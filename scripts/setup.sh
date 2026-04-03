#!/usr/bin/env bash
# GoClaw Quick Setup — interactive wizard covering all deployment cases.
#
# Usage:
#   ./scripts/setup.sh              # interactive
#   ./scripts/setup.sh --mode docker
#   ./scripts/setup.sh --mode native
#   ./scripts/setup.sh --mode lite
#
# Modes:
#   docker  — GoClaw + PostgreSQL in Docker (recommended for servers)
#   native  — GoClaw binary on host, connecting to your own PostgreSQL
#   lite    — GoClaw Desktop (SQLite, no PostgreSQL needed)

set -euo pipefail

REPO="nextlevelbuilder/goclaw"
SCRIPTS_BASE="https://raw.githubusercontent.com/${REPO}/main/scripts"
MODE=""
PG_SOURCE=""        # bundled | external
WITH_UI=false
NONINTERACTIVE=false
DOMAIN=""
SSL_EMAIL=""

# ── Colors ──
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ── Run a sibling script (local file first, fallback to remote) ──
run_script() {
  local name="$1"; shift
  local local_path
  local_path="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)/${name}" 2>/dev/null || true
  if [ -f "$local_path" ]; then
    bash "$local_path" "$@"
  else
    bash <(curl -fsSL "${SCRIPTS_BASE}/${name}") "$@"
  fi
}

info()    { echo -e "${CYAN}  $*${RESET}"; }
success() { echo -e "${GREEN}  ✓ $*${RESET}"; }
warn()    { echo -e "${YELLOW}  ⚠  $*${RESET}"; }
error()   { echo -e "${RED}  ✗ $*${RESET}"; }
bold()    { echo -e "${BOLD}$*${RESET}"; }

# ── Parse args ──
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)         MODE="$2"; shift 2 ;;
    --pg)           PG_SOURCE="$2"; shift 2 ;;
    --with-ui)      WITH_UI=true; shift ;;
    --domain)       DOMAIN="$2"; shift 2 ;;
    --email)        SSL_EMAIL="$2"; shift 2 ;;
    --yes|-y)       NONINTERACTIVE=true; shift ;;
    --help|-h)
      sed -n '2,12p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Prompt helper (reads from /dev/tty so curl|bash works) ──
ask() {
  local prompt="$1" default="${2:-}" var
  if [ -n "$default" ]; then
    read -rp "  ${prompt} [${default}]: " var </dev/tty
    echo "${var:-$default}"
  else
    read -rp "  ${prompt}: " var </dev/tty
    echo "$var"
  fi
}

ask_yn() {
  local prompt="$1" default="${2:-y}"
  local yn
  read -rp "  ${prompt} [$([ "$default" = y ] && echo 'Y/n' || echo 'y/N')]: " yn </dev/tty
  yn="${yn:-$default}"
  [[ "$yn" =~ ^[Yy] ]]
}

# ── Detect available tools ──
has_docker=false
has_docker_compose=false
has_goclaw=false

command -v docker &>/dev/null && has_docker=true
( command -v docker &>/dev/null && docker compose version &>/dev/null ) && has_docker_compose=true
command -v goclaw &>/dev/null && has_goclaw=true

# ── Nginx reverse proxy + SSL setup ──
setup_nginx_ssl() {
  local port="$1"

  # Skip if no domain was provided
  [ -z "$DOMAIN" ] && return 0

  echo
  bold "── Setting up Nginx + SSL ──"
  echo
  info "Configuring ${DOMAIN} → 127.0.0.1:${port}..."

  # Install nginx + certbot if needed
  if ! command -v nginx &>/dev/null; then
    info "Installing Nginx..."
    apt-get update -qq && apt-get install -y -qq nginx || { error "Failed to install Nginx."; return 1; }
  fi
  if ! command -v certbot &>/dev/null; then
    info "Installing Certbot..."
    apt-get install -y -qq certbot python3-certbot-nginx || { error "Failed to install Certbot."; return 1; }
  fi

  # Create nginx site config
  cat > "/etc/nginx/sites-available/${DOMAIN}" <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    # Block sensitive files & directories
    location ~ /\\.(?:env|git|docker|htpasswd|htaccess) {
        deny all;
        return 404;
    }
    location ~ /(?:docker-compose|Makefile|package\\.json|composer\\.json|Dockerfile) {
        deny all;
        return 404;
    }

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}
NGINX

  # Enable site
  ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"

  # Remove default site if it conflicts
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null

  # Test & reload nginx
  nginx -t || { error "Nginx config test failed."; return 1; }
  systemctl reload nginx
  success "Nginx proxy configured: ${DOMAIN} → 127.0.0.1:${port}"

  # SSL with certbot
  echo
  info "Obtaining SSL certificate..."
  certbot certonly --agree-tos --email "${SSL_EMAIL}" -d "${DOMAIN}" --nginx --non-interactive \
    || { warn "SSL certificate failed — is the domain pointing to this server?"; return 1; }

  # Enable SSL in nginx
  cat > "/etc/nginx/sites-available/${DOMAIN}" <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # ── Security headers ──
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ── Hide server info ──
    server_tokens off;

    # ── Block sensitive files & directories ──
    location ~ /\\.(?:env|git|docker|htpasswd|htaccess) {
        deny all;
        return 404;
    }
    location ~ /(?:docker-compose|Makefile|package\\.json|composer\\.json|Dockerfile) {
        deny all;
        return 404;
    }

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}
NGINX

  nginx -t && systemctl reload nginx
  success "SSL enabled: https://${DOMAIN}"
}

# ── Banner ──
echo
bold "╔══════════════════════════════════════════════╗"
bold "║          GoClaw Setup Wizard                 ║"
bold "╚══════════════════════════════════════════════╝"
echo

# ── Mode selection ──
if [ -z "$MODE" ]; then
  bold "── Choose deployment mode ──"
  echo
  echo "  1) Docker      — GoClaw + Postgres in containers  (recommended, no install needed)"
  echo "  2) Native      — GoClaw binary on this host       (you manage PostgreSQL)"
  echo "  3) Lite        — Desktop app with embedded SQLite (no PostgreSQL needed)"
  echo

  if ! $has_docker; then
    warn "Docker not detected on this system — option 1 may not work."
    echo
  fi

  read -rp "  Choice [1-3, default=1]: " choice </dev/tty
  case "${choice:-1}" in
    1|docker)  MODE="docker" ;;
    2|native)  MODE="native" ;;
    3|lite)    MODE="lite" ;;
    *) error "Invalid choice"; exit 1 ;;
  esac
fi

# ── All questions upfront (skip for lite) ──
if [ "$MODE" != "lite" ]; then

  # ── PostgreSQL source (docker mode only) ──
  if [ "$MODE" = "docker" ] && [ -z "$PG_SOURCE" ]; then
    echo
    bold "── PostgreSQL ──"
    echo
    echo "  1) Bundled   — spin up a postgres container automatically (easiest)"
    echo "  2) External  — connect to your own PostgreSQL (managed service, existing server)"
    echo
    read -rp "  Choice [1-2, default=1]: " pg_choice </dev/tty
    case "${pg_choice:-1}" in
      1|bundled)  PG_SOURCE="bundled" ;;
      2|external) PG_SOURCE="external" ;;
      *) error "Invalid choice"; exit 1 ;;
    esac

    if [ "$PG_SOURCE" = "external" ]; then
      GOCLAW_POSTGRES_DSN="${GOCLAW_POSTGRES_DSN:-}"
      if [ -z "$GOCLAW_POSTGRES_DSN" ]; then
        echo
        info "Format: postgres://user:pass@host:5432/dbname?sslmode=disable"
        GOCLAW_POSTGRES_DSN="$(ask "PostgreSQL DSN")"
      fi
    fi
  fi

  # ── Web dashboard ──
  if ! $WITH_UI && ! $NONINTERACTIVE; then
    echo
    ask_yn "Include web dashboard UI?" "y" && WITH_UI=true
  fi

  # ── Domain & Email ──
  if [ -z "$DOMAIN" ]; then
    echo
    bold "── Domain & SSL ──"
    echo
    if ask_yn "Set up custom domain with Nginx + SSL?" "y"; then
      DOMAIN="$(ask "Domain (e.g. api.example.com)")"
      if [ -z "$SSL_EMAIL" ]; then
        SSL_EMAIL="$(ask "Email for SSL certificate")"
      fi
    fi
  fi

fi

echo

# ════════════════════════════════════════════════
# MODE: LITE (Desktop)
# ════════════════════════════════════════════════
if [ "$MODE" = "lite" ]; then
  bold "── GoClaw Lite — Desktop App ──"
  echo
  info "Downloads the desktop app (SQLite embedded, no PostgreSQL needed)."
  echo

  OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
  if [ "$OS" = "darwin" ]; then
    info "Running macOS installer..."
    echo
    run_script "install-lite.sh"
  else
    warn "Lite desktop installer currently supports macOS only."
    echo "  Windows: download the .zip from https://github.com/${REPO}/releases"
    echo "  Linux:   not available yet"
  fi
  exit 0
fi

# ════════════════════════════════════════════════
# MODE: DOCKER
# ════════════════════════════════════════════════
if [ "$MODE" = "docker" ]; then
  if ! $has_docker; then
    warn "Docker is not installed."
    if ask_yn "Install Docker automatically?" "y"; then
      info "Installing Docker..."
      curl -fsSL https://get.docker.com | sh
      if command -v docker &>/dev/null; then
        success "Docker installed successfully."
        has_docker=true
      else
        error "Docker installation failed. Install manually from https://docker.com and retry."
        exit 1
      fi
    else
      error "Docker is required for this mode. Install from https://docker.com and retry."
      exit 1
    fi
  fi
  if ! $has_docker_compose; then
    if docker compose version &>/dev/null 2>&1; then
      has_docker_compose=true
    else
      warn "Docker Compose plugin not found."
      info "Attempting to install Docker Compose plugin..."
      apt-get update -qq && apt-get install -y -qq docker-compose-plugin 2>/dev/null \
        || { error "Could not install Docker Compose. Install manually and retry."; exit 1; }
      if docker compose version &>/dev/null 2>&1; then
        success "Docker Compose installed successfully."
        has_docker_compose=true
      else
        error "Docker Compose plugin not found. Make sure you have Docker Desktop ≥ 4.x or install the compose plugin."
        exit 1
      fi
    fi
  fi

  bold "── Docker Setup ──"
  echo

  # ── Resolve data dir ──
  DATA_DIR="${GOCLAW_DATA_DIR:-./goclaw-data}"
  info "Creating data directory: ${DATA_DIR}"
  mkdir -p "${DATA_DIR}"

  ENV_FILE="${DATA_DIR}/.env"

  # ── Generate secrets ──
  gen_secret() { openssl rand -hex "$1" 2>/dev/null || head -c $(( $1 * 2 )) /dev/urandom | od -An -tx1 | tr -d ' \n'; }

  if [ ! -f "$ENV_FILE" ]; then
    GATEWAY_TOKEN="$(gen_secret 32)"
    ENCRYPTION_KEY="$(gen_secret 16)"
    GOCLAW_PORT="${GOCLAW_PORT:-18790}"
    UI_PORT="${GOCLAW_UI_PORT:-18791}"

    {
      echo "# GoClaw environment — generated by setup.sh"
      echo "GOCLAW_GATEWAY_TOKEN=${GATEWAY_TOKEN}"
      echo "GOCLAW_ENCRYPTION_KEY=${ENCRYPTION_KEY}"
      echo "GOCLAW_PORT=${GOCLAW_PORT}"
      echo "GOCLAW_UI_PORT=${UI_PORT}"
    } > "$ENV_FILE"

    if [ "$PG_SOURCE" = "bundled" ]; then
      PG_PASSWORD="$(gen_secret 12)"
      {
        echo "POSTGRES_PORT=5432"
        echo "POSTGRES_USER=goclaw"
        echo "POSTGRES_PASSWORD=${PG_PASSWORD}"
        echo "POSTGRES_DB=goclaw"
      } >> "$ENV_FILE"
      success "Generated ${ENV_FILE} with random secrets."
    else
      success "Generated ${ENV_FILE} (no PG credentials — using external DSN)."
    fi
  else
    info "Using existing ${ENV_FILE}"
    # Load existing env
    set -a; source "$ENV_FILE"; set +a
    GOCLAW_PORT="${GOCLAW_PORT:-18790}"
    UI_PORT="${GOCLAW_UI_PORT:-18791}"
  fi

  # ── External PG: collect DSN ──
  if [ "$PG_SOURCE" = "external" ]; then
    echo
    bold "── External PostgreSQL ──"
    echo
    info "Enter your PostgreSQL connection string."
    info "Format: postgres://user:pass@host:5432/dbname?sslmode=disable"
    echo

    GOCLAW_POSTGRES_DSN="${GOCLAW_POSTGRES_DSN:-}"
    if [ -z "$GOCLAW_POSTGRES_DSN" ]; then
      GOCLAW_POSTGRES_DSN="$(ask "DSN")"
    else
      info "Using GOCLAW_POSTGRES_DSN from environment."
    fi

    # Rewrite localhost → host.docker.internal
    if echo "$GOCLAW_POSTGRES_DSN" | grep -qE 'localhost|127\.0\.0\.1'; then
      warn "DSN contains 'localhost' — inside Docker this resolves to the container itself."
      GOCLAW_POSTGRES_DSN="${GOCLAW_POSTGRES_DSN/localhost/host.docker.internal}"
      GOCLAW_POSTGRES_DSN="${GOCLAW_POSTGRES_DSN/127.0.0.1/host.docker.internal}"
      info "Auto-replaced with: ${GOCLAW_POSTGRES_DSN}"
    fi

    echo "GOCLAW_POSTGRES_DSN=${GOCLAW_POSTGRES_DSN}" >> "$ENV_FILE"

    # Check pgvector on external PG
    echo
    info "Checking pgvector on your PostgreSQL instance..."
    if command -v psql &>/dev/null; then
      if psql "$GOCLAW_POSTGRES_DSN" -tAc "SELECT 1 FROM pg_extension WHERE extname='vector'" 2>/dev/null | grep -q 1; then
        success "pgvector extension found — all features enabled."
      else
        warn "pgvector not found on your PostgreSQL."
        warn "Memory semantic search, KG embeddings, and skill vector search will be disabled."
        warn "To enable: run 'CREATE EXTENSION vector;' as superuser, or enable it in your provider's dashboard."
      fi
    else
      warn "psql not available — cannot check pgvector. Setup will continue; check after startup with: goclaw doctor"
    fi
  fi

  # ── Generate self-contained docker-compose.yaml ──
  COMPOSE_FILE="${DATA_DIR}/docker-compose.yaml"

  # Build postgres service block (bundled only)
  PG_SERVICE=""
  PG_DSN_ENV=""
  PG_DEPENDS=""
  if [ "$PG_SOURCE" = "bundled" ]; then
    PG_SERVICE='
  postgres:
    image: pgvector/pgvector:pg18
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-goclaw}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-goclaw}
      POSTGRES_DB: ${POSTGRES_DB:-goclaw}
    volumes:
      - postgres-data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-goclaw} -d ${POSTGRES_DB:-goclaw}"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped'
    PG_DSN_ENV='      - GOCLAW_POSTGRES_DSN=postgres://${POSTGRES_USER:-goclaw}:${POSTGRES_PASSWORD:-goclaw}@postgres:5432/${POSTGRES_DB:-goclaw}?sslmode=disable'
    PG_DEPENDS='    depends_on:
      postgres:
        condition: service_healthy'
  else
    PG_DSN_ENV="      - GOCLAW_POSTGRES_DSN=${GOCLAW_POSTGRES_DSN}"
  fi

  # Build UI service block (optional)
  UI_SERVICE=""
  if $WITH_UI; then
    UI_SERVICE='
  goclaw-ui:
    image: ghcr.io/nextlevelbuilder/goclaw-web:latest
    ports:
      - "${GOCLAW_UI_PORT:-18791}:80"
    depends_on:
      - goclaw
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: unless-stopped'
  fi

  # Watchtower — auto-pull, rolling restart (zero-downtime), cleanup old images
  WATCHTOWER_SERVICE='
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --cleanup --rolling-restart --schedule "0 0 3 * * *"
    restart: unless-stopped'

  # Build volumes block
  VOLUMES_BLOCK="volumes:
  goclaw-data:
  goclaw-workspace:"
  if [ "$PG_SOURCE" = "bundled" ]; then
    VOLUMES_BLOCK="${VOLUMES_BLOCK}
  postgres-data:"
  fi

  cat > "$COMPOSE_FILE" <<COMPOSE
# GoClaw — generated by setup.sh
# Edit as needed. Re-run setup.sh to regenerate.
# Start:   docker compose up -d
# Stop:    docker compose down
# Logs:    docker compose logs -f goclaw
# Migrate: docker compose exec goclaw goclaw migrate up

services:${PG_SERVICE}

  goclaw:
    image: ghcr.io/nextlevelbuilder/goclaw:latest
    ports:
      - "\${GOCLAW_PORT:-18790}:18790"
    env_file:
      - .env
    environment:
      - GOCLAW_HOST=0.0.0.0
      - GOCLAW_PORT=18790
      - GOCLAW_CONFIG=/app/data/config.json
      - GOCLAW_SKILLS_DIR=/app/data/skills
${PG_DSN_ENV}
    volumes:
      - goclaw-data:/app/data
      - goclaw-workspace:/app/workspace
    extra_hosts:
      - "host.docker.internal:host-gateway"
${PG_DEPENDS}
    security_opt:
      - no-new-privileges:true
    init: true
    cap_drop:
      - ALL
    cap_add:
      - SETUID
      - SETGID
      - CHOWN
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=256m
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:18790/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    restart: unless-stopped
${UI_SERVICE}
${WATCHTOWER_SERVICE}

${VOLUMES_BLOCK}
COMPOSE

  # ── Generate start.sh wrapper ──
  WRAPPER="${DATA_DIR}/start.sh"
  cat > "$WRAPPER" <<'WRAPPER_EOF'
#!/usr/bin/env bash
# GoClaw start — generated by setup.sh
set -euo pipefail
cd "$(dirname "$0")"
docker compose "$@"
WRAPPER_EOF
  chmod +x "$WRAPPER"

  # ── Auto start ──
  echo
  info "Starting GoClaw..."
  cd "${DATA_DIR}"
  docker compose up -d

  # ── Auto migrate ──
  echo
  info "Waiting for GoClaw to be ready..."
  sleep 5
  info "Running migrations..."
  docker compose exec goclaw goclaw migrate up || warn "Migration failed — you can retry later: ./start.sh exec goclaw goclaw migrate up"

  echo
  bold "╔══════════════════════════════════════════════╗"
  bold "║         Docker Setup Complete!               ║"
  bold "╚══════════════════════════════════════════════╝"
  echo
  echo "  Config:   ${COMPOSE_FILE}"
  echo "  Secrets:  ${ENV_FILE}"
  echo
  if $WITH_UI; then
    echo "  Gateway:    http://localhost:${GOCLAW_PORT:-18790}"
    echo "  Dashboard:  http://localhost:${UI_PORT:-3000}"
  else
    echo "  Gateway:    http://localhost:${GOCLAW_PORT:-18790}"
    info "Re-run with --with-ui to add the web dashboard."
  fi
  echo
  # ── Domain & SSL ──
  setup_nginx_ssl "${GOCLAW_UI_PORT:-18791}"

  echo
  bold "── Manage ──"
  echo
  echo "  cd ${DATA_DIR}"
  echo "  ./start.sh logs -f goclaw    # view logs"
  echo "  ./start.sh restart           # restart"
  echo "  ./start.sh down              # stop"
  if [ -n "$DOMAIN" ]; then
    echo
    echo "  Gateway:    https://${DOMAIN}"
  fi
  echo

  exit 0
fi

# ════════════════════════════════════════════════
# MODE: NATIVE BINARY
# ════════════════════════════════════════════════
if [ "$MODE" = "native" ]; then
  bold "── Native Binary Setup ──"
  echo

  # ── Install binary if not present ──
  if ! $has_goclaw; then
    info "GoClaw binary not found. Installing..."
    echo
    run_script "install.sh"
    echo
  else
    VER="$(goclaw version 2>/dev/null || echo unknown)"
    success "GoClaw already installed: ${VER}"
  fi

  echo

  # ── PostgreSQL DSN ──
  bold "── Database Connection ──"
  echo
  echo "  Options:"
  echo "  1) Enter DSN manually"
  echo "  2) Use GOCLAW_POSTGRES_DSN environment variable (already set)"
  echo "  3) I don't have PostgreSQL — show me how to get one"
  echo

  PG_DSN="${GOCLAW_POSTGRES_DSN:-}"
  if [ -n "$PG_DSN" ]; then
    info "GOCLAW_POSTGRES_DSN is set in environment. Using it."
  else
    read -rp "  Choice [1-3, default=1]: " pg_opt </dev/tty
    case "${pg_opt:-1}" in
      1)
        echo
        info "Format: postgres://user:pass@host:5432/dbname?sslmode=disable"
        PG_DSN="$(ask "PostgreSQL DSN")"
        ;;
      2)
        error "GOCLAW_POSTGRES_DSN is not set in your environment. Set it and re-run."
        exit 1
        ;;
      3)
        echo
        bold "── PostgreSQL Setup Options ──"
        echo
        echo "  Docker (fastest):    docker run -d --name goclaw-pg -p 5432:5432 \\"
        echo "                         -e POSTGRES_PASSWORD=goclaw pgvector/pgvector:pg18"
        echo
        echo "  Homebrew (macOS):    brew install postgresql@16 && brew services start postgresql@16"
        echo
        echo "  APT (Ubuntu/Debian): sudo apt install postgresql"
        echo
        echo "  Managed services:    Supabase (free tier), Neon, Railway, Render"
        echo "                       → Enable the 'vector' extension in the dashboard"
        echo
        warn "After setting up PostgreSQL, re-run: ./scripts/setup.sh --mode native"
        exit 0
        ;;
    esac
  fi

  echo
  info "Testing connection..."
  if ! goclaw onboard --dsn-check "$PG_DSN" 2>/dev/null; then
    # Fall back to running full onboard with the DSN pre-set
    export GOCLAW_POSTGRES_DSN="$PG_DSN"
  fi

  # ── Check pgvector ──
  echo
  info "Checking pgvector extension..."
  if command -v psql &>/dev/null; then
    if psql "$PG_DSN" -tAc "SELECT 1 FROM pg_extension WHERE extname='vector'" 2>/dev/null | grep -q 1; then
      success "pgvector found — all features enabled."
    else
      warn "pgvector not installed on this PostgreSQL instance."
      warn "Memory semantic search, KG embeddings, and skill vector search will be disabled."
      echo
      info "To enable pgvector:"
      echo "    Docker: use pgvector/pgvector:pg18 image"
      echo "    APT:    sudo apt install postgresql-16-pgvector"
      echo "    Homebrew: brew install pgvector"
      echo "    Managed: enable 'vector' extension in your provider dashboard"
      echo
      ask_yn "Continue without pgvector?" "y" || exit 0
    fi
  else
    warn "psql not available — cannot verify pgvector. Continuing..."
  fi

  # ── Run onboard ──
  echo
  bold "── Running GoClaw Onboard Wizard ──"
  echo
  export GOCLAW_POSTGRES_DSN="$PG_DSN"
  goclaw onboard

  # ── Web UI Dashboard ──
  echo
  bold "── Web UI Dashboard ──"
  echo
  if ask_yn "Install web dashboard UI?" "y"; then
    if command -v docker &>/dev/null; then
      GOCLAW_PORT="${GOCLAW_PORT:-18790}"
      UI_PORT="${GOCLAW_UI_PORT:-18791}"
      info "Starting GoClaw Web UI on port ${UI_PORT}..."
      docker rm -f goclaw-ui 2>/dev/null || true
      docker run -d \
        --name goclaw-ui \
        --restart unless-stopped \
        -p "${UI_PORT}:80" \
        -e GOCLAW_API_URL="http://host.docker.internal:${GOCLAW_PORT}" \
        --add-host=host.docker.internal:host-gateway \
        ghcr.io/nextlevelbuilder/goclaw-web:latest
      success "Dashboard running at http://localhost:${UI_PORT}"
    else
      warn "Docker not available — cannot run web UI container."
      info "Install Docker to enable the dashboard, or use the API directly."
    fi
  fi

  # ── Systemd Service ──
  echo
  bold "── Systemd Service ──"
  echo
  if [ "$(id -u)" = "0" ] && command -v systemctl &>/dev/null; then
    if ask_yn "Create systemd service (auto-start on boot)?" "y"; then
      ENV_LOCAL="$(pwd)/.env.local"
      MIGRATIONS_DIR="${GOCLAW_MIGRATIONS_DIR:-/usr/local/share/goclaw/migrations}"

      cat > /etc/systemd/system/goclaw.service <<SYSTEMD
[Unit]
Description=GoClaw AI Gateway
After=network.target postgresql.service
Wants=network.target

[Service]
Type=simple
EnvironmentFile=${ENV_LOCAL}
Environment=GOCLAW_MIGRATIONS_DIR=${MIGRATIONS_DIR}
ExecStart=/usr/local/bin/goclaw
Restart=on-failure
RestartSec=5
LimitNOFILE=65535
WorkingDirectory=$(pwd)

[Install]
WantedBy=multi-user.target
SYSTEMD

      systemctl daemon-reload
      systemctl enable goclaw
      systemctl start goclaw
      success "Service created and started."
      echo
      echo "  Manage with:"
      echo "    systemctl status goclaw"
      echo "    systemctl restart goclaw"
      echo "    journalctl -u goclaw -f"
    fi
  else
    if ! command -v systemctl &>/dev/null; then
      warn "systemd not available on this system."
    else
      warn "Not running as root — skipping systemd setup."
      info "To create service manually, run setup.sh as root."
    fi
  fi

  # ── Domain & SSL ──
  setup_nginx_ssl "${GOCLAW_UI_PORT:-18791}"

  echo
  bold "╔══════════════════════════════════════════════╗"
  bold "║         Native Setup Complete!               ║"
  bold "╚══════════════════════════════════════════════╝"
  echo
  if [ -n "$DOMAIN" ]; then
    echo "  Gateway:    https://${DOMAIN}"
  fi
  echo

  exit 0
fi
