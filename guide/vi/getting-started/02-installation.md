# Cài Đặt

> Chạy GoClaw trên máy bạn trong vài phút. Bốn cách: cài binary nhanh, bare metal, Docker (local), hoặc Docker trên VPS.

## Tổng quan

GoClaw compile thành một binary static duy nhất (~25 MB). Chọn cách phù hợp với hệ thống của bạn:

| Cách | Phù hợp cho | Yêu cầu |
|------|-------------|----------|
| Cài nhanh (Binary) | Setup nhanh nhất trên Linux/macOS | curl, PostgreSQL |
| Bare Metal | Developer muốn kiểm soát toàn bộ | Go 1.26+, PostgreSQL 15+ với pgvector |
| **Docker (Local) ⭐** | **Chạy mọi thứ qua Docker Compose (khuyến nghị)** | **Docker + Docker Compose, 2 GB+ RAM** |
| VPS (Production) | Deploy production tự host | VPS $5+, Docker, 2 GB+ RAM |

---

## Cách 1: Cài nhanh (Binary)

Tải và cài binary GoClaw mới nhất bằng một lệnh duy nhất. Không cần Go toolchain.

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install.sh | bash
```

**Nền tảng hỗ trợ:** Linux và macOS, cả `amd64` và `arm64`.

**Tùy chọn:**

```bash
# Cài phiên bản cụ thể
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install.sh | bash -s -- --version v1.30.0

# Cài vào thư mục tùy chọn (mặc định: /usr/local/bin)
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install.sh | bash -s -- --dir /opt/goclaw
```

Script tự phát hiện OS và kiến trúc, tải tarball phù hợp từ GitHub, và cài binary. Tự dùng `sudo` nếu thư mục đích không ghi được.

### Sau khi cài: thiết lập PostgreSQL

```bash
# Khởi động PostgreSQL với pgvector (Docker là cách dễ nhất)
docker run -d --name goclaw-pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=goclaw \
  pgvector/pgvector:pg18
```

### Chạy setup wizard

```bash
export GOCLAW_POSTGRES_DSN='postgres://postgres:goclaw@localhost:5432/postgres?sslmode=disable'
goclaw onboard
```

Wizard chạy migrations, tạo secrets, và lưu tất cả vào `.env.local`.

```bash
source .env.local && goclaw
```

### Mở Dashboard

Binary pre-built đã bao gồm Web UI nhúng — dashboard được phục vụ trực tiếp tại cổng gateway. Không cần chạy tiến trình UI riêng.

Mở `http://localhost:18790` và đăng nhập:
- **User ID:** `system`
- **Gateway Token:** tìm trong `.env.local` (tìm `GOCLAW_GATEWAY_TOKEN`)

Sau khi đăng nhập, làm theo hướng dẫn [Hướng Dẫn Setup Wizard](./04-setup-wizard.md) để thêm LLM provider, tạo agent đầu tiên, và bắt đầu chat.

<details>
<summary><strong>Thay thế: chạy dashboard UI riêng</strong></summary>

Nếu bạn cần chạy dashboard như dev server riêng (ví dụ cho UI development), clone repo và chạy:

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw/ui/web
cp .env.example .env    # Bắt buộc — cấu hình kết nối backend
pnpm install
pnpm dev
```

Dashboard có tại `http://localhost:5173`.

</details>

> **Mẹo:** Để trải nghiệm all-in-one dễ nhất (gateway + database + dashboard), xem [Cách 3: Docker (Local)](#cách-3-docker-local).

---

## Cách 2: Bare Metal

Cài GoClaw trực tiếp trên máy. Bạn tự quản lý Go, PostgreSQL, và binary.

### Bước 1: Cài PostgreSQL + pgvector

GoClaw yêu cầu **PostgreSQL 15+** với extension **pgvector** (cho vector similarity search trong memory và skills). Docker deployments dùng **PostgreSQL 18** với pgvector (image `pgvector/pgvector:pg18`).

<details>
<summary><strong>Ubuntu 24.04+ / Debian 12+</strong></summary>

```bash
sudo apt update
sudo apt install -y postgresql postgresql-common

# Cài pgvector (thay 17 bằng phiên bản PG của bạn — kiểm tra: pg_config --version)
sudo apt install -y postgresql-17-pgvector

# Tạo database và bật extension
sudo -u postgres createdb goclaw
sudo -u postgres psql -d goclaw -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

> **Lưu ý:** Ubuntu 22.04 trở xuống đi kèm PostgreSQL 14, không được hỗ trợ. Vui lòng nâng cấp lên Ubuntu 24.04+ hoặc dùng Docker.

</details>

<details>
<summary><strong>macOS (Homebrew)</strong></summary>

```bash
brew install postgresql pgvector
brew services start postgresql
createdb goclaw
psql -d goclaw -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

</details>

<details>
<summary><strong>Fedora / RHEL</strong></summary>

```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

sudo dnf install -y postgresql-devel git make gcc
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install

sudo -u postgres createdb goclaw
sudo -u postgres psql -d goclaw -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

</details>

**Xác minh cài đặt:**

```bash
psql -d goclaw -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';"
# Kết quả: vector | 0.x.x
```

> Trên Linux, thêm `sudo -u postgres` nếu user của bạn không có quyền truy cập database trực tiếp.

### Bước 2: Clone & Build

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw
go build -o goclaw .
./goclaw version
```

> **Python runtime (tùy chọn):** Một số built-in skills cần Python 3. Cài với `sudo apt install -y python3 python3-pip` (Ubuntu/Debian) hoặc `brew install python` (macOS) nếu bạn cần dùng.

**Build Tags (Tùy chọn):** Bật thêm tính năng khi compile:

```bash
go build -tags embedui -o goclaw .           # Nhúng web UI vào binary (phục vụ dashboard tại cổng gateway)
go build -tags otel -o goclaw .              # OpenTelemetry tracing
go build -tags tsnet -o goclaw .             # Tailscale networking
go build -tags redis -o goclaw .             # Redis caching
go build -tags "otel,tsnet" -o goclaw .      # Kết hợp nhiều tags
```

### Bước 3: Chạy Setup Wizard

```bash
./goclaw onboard
```

Wizard hướng dẫn qua các bước:
1. **Kết nối database** — nhập host, port, tên database, username, password (mặc định phù hợp cho PostgreSQL local)
2. **Kiểm tra kết nối** — xác minh PostgreSQL có thể truy cập
3. **Migrations** — tạo tất cả bảng cần thiết tự động
4. **Tạo key** — tự tạo `GOCLAW_GATEWAY_TOKEN` và `GOCLAW_ENCRYPTION_KEY`
5. **Lưu secrets** — ghi tất cả vào `.env.local`

### Bước 4: Khởi động Gateway

```bash
source .env.local && ./goclaw
```

### Bước 5: Mở Dashboard

Nếu build với tag `embedui`, dashboard được phục vụ trực tiếp tại `http://localhost:18790`. Đăng nhập với:
- **User ID:** `system`
- **Gateway Token:** tìm trong `.env.local` (tìm `GOCLAW_GATEWAY_TOKEN`)

Không có `embedui`, chạy dashboard như React dev server riêng trong terminal mới:

```bash
cd ui/web
cp .env.example .env    # Bắt buộc — cấu hình kết nối backend
pnpm install
pnpm dev
```

Mở `http://localhost:5173` và đăng nhập với cùng thông tin ở trên.

Sau khi đăng nhập, làm theo hướng dẫn [Hướng Dẫn Setup Wizard](./04-setup-wizard.md) để thêm LLM provider, tạo agent đầu tiên, và bắt đầu chat.

---

## Cách 3: Docker (Local)

Chạy GoClaw với Docker Compose — đã bao gồm PostgreSQL và web dashboard. Đây là **cách được khuyến nghị** cho đa số người dùng.

> **Lưu ý:** Setup này bao gồm PostgreSQL tự động qua `docker-compose.postgres.yml`. Bạn không cần cài riêng.

> **RAM tối thiểu:** 2 GB. Gateway, PostgreSQL, và dashboard containers dùng ~1.2 GB khi idle.

### Bước 1: Clone & Cấu hình

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw

# Tự tạo encryption key + gateway token
./prepare-env.sh
```

Tùy chọn thêm API key LLM provider vào `.env` ngay (hoặc thêm sau qua dashboard):

```env
GOCLAW_OPENROUTER_API_KEY=sk-or-xxxxx
# hoặc GOCLAW_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

> **Lưu ý:** Bạn **không** cần chạy `goclaw onboard` cho Docker — onboard wizard chỉ dành cho bare metal. Docker đọc cấu hình từ `.env` và tự chạy migrations khi khởi động.

### Bước 2: Khởi động Services

GoClaw dùng các file Docker Compose modular:
- `docker-compose.yml` — GoClaw gateway và API server chính (mặc định bao gồm Web UI nhúng)
- `docker-compose.postgres.yml` — PostgreSQL database với pgvector extension
- `docker-compose.selfservice.yml` — Tùy chọn: nginx reverse proxy + UI container riêng tại cổng 3000

Mặc định `docker-compose.yml` đặt `ENABLE_EMBEDUI: true`, nên dashboard được phục vụ tại cổng gateway (`http://localhost:18790`). Bạn chỉ cần hai file cho setup local đầy đủ:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.postgres.yml \
  up -d --build
```

Khởi động:
- **GoClaw gateway + dashboard nhúng** — `http://localhost:18790`
- **PostgreSQL** với pgvector — cổng `5432`

GoClaw tự chạy database migrations đang chờ mỗi lần khởi động. Không cần chạy `goclaw onboard` hay `goclaw migrate` thủ công.

Mở `http://localhost:18790` và đăng nhập:
- **User ID:** `system`
- **Gateway Token:** tìm trong `.env` (tìm `GOCLAW_GATEWAY_TOKEN`)

<details>
<summary><strong>Tùy chọn: nginx + UI riêng (selfservice)</strong></summary>

Nếu bạn muốn UI container riêng tại cổng 3000 (ví dụ cho nginx reverse proxy với cổng UI riêng biệt), thêm selfservice overlay:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.postgres.yml \
  -f docker-compose.selfservice.yml \
  up -d --build
```

Dashboard có tại `http://localhost:3000`.

</details>

Sau khi đăng nhập, làm theo hướng dẫn [Hướng Dẫn Setup Wizard](./04-setup-wizard.md) để thêm LLM provider, tạo agent đầu tiên, và bắt đầu chat.

### Tiện ích bổ sung

Thêm khả năng với các file Docker Compose overlay:

| File overlay | Thêm gì |
|---|---|
| `docker-compose.sandbox.yml` | Code sandbox cho thực thi script cô lập |
| `docker-compose.tailscale.yml` | Truy cập từ xa bảo mật qua Tailscale |
| `docker-compose.otel.yml` | OpenTelemetry tracing (Jaeger UI tại `:16686`) |
| `docker-compose.redis.yml` | Redis caching layer |
| `docker-compose.browser.yml` | Tự động hóa trình duyệt (Chrome sidecar) |
| `docker-compose.upgrade.yml` | Dịch vụ nâng cấp database |

Thêm bất kỳ overlay nào với `-f` khi khởi động services:

```bash
# Ví dụ: thêm Redis caching
docker compose \
  -f docker-compose.yml \
  -f docker-compose.postgres.yml \
  -f docker-compose.redis.yml \
  up -d --build
```

> **Lưu ý:** Redis và OTel overlays cần rebuild GoClaw image với build args tương ứng (`ENABLE_REDIS=true`, `ENABLE_OTEL=true`). Đặt `ENABLE_EMBEDUI=false` để tắt UI nhúng (ví dụ khi dùng selfservice nginx overlay). Xem chi tiết trong các file overlay.

> **Python runtime:** Mặc định `docker-compose.yml` build GoClaw với `ENABLE_PYTHON: "true"`, nên các skill Python hoạt động ngay trên Docker.

---

## Cách 4: VPS (Production)

Deploy GoClaw trên VPS với Docker. Phù hợp cho setup luôn chạy, truy cập được từ internet.

> **Lưu ý:** PostgreSQL chạy bên trong Docker. File compose xử lý setup — bạn không cần cài PostgreSQL trên hệ thống VPS.

### Yêu cầu

- **VPS**: 1 vCPU, **2 GB RAM tối thiểu** (gói $6). 2 vCPU / 4 GB khuyến nghị cho workload nặng.
- **OS**: Ubuntu 24.04+ hoặc Debian 12+
- **Domain** (tùy chọn): Cho HTTPS/SSL qua reverse proxy

### Bước 1: Thiết lập Server

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Docker (script chính thức — bao gồm Compose plugin)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Đăng xuất và đăng nhập lại để group change có hiệu lực
```

### Bước 2: Firewall

```bash
sudo apt install -y ufw
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw --force enable
```

### Bước 3: Tạo thư mục & Clone

```bash
sudo mkdir -p /opt/goclaw
sudo chown $(whoami):$(whoami) /opt/goclaw
git clone https://github.com/nextlevelbuilder/goclaw.git /opt/goclaw
cd /opt/goclaw

# Tự tạo secrets
./prepare-env.sh
```

### Bước 4: Khởi động Services

Mặc định compose bao gồm Web UI nhúng. Hai file là đủ cho setup production đầy đủ:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.postgres.yml \
  up -d --build
```

GoClaw tự chạy database migrations đang chờ mỗi lần khởi động. Không cần chạy `goclaw onboard` hay `goclaw migrate` thủ công.

Dashboard có tại `http://localhost:18790`.

> **Tùy chọn:** Để dùng nginx + UI container riêng tại cổng 3000, thêm `-f docker-compose.selfservice.yml`. Xem phần [Tùy chọn: nginx + UI riêng](#tùy-chọn-nginx--ui-riêng-selfservice) trong Cách 3 để biết chi tiết.

### Bước 4.5: Xác minh Services đã chạy

Trước khi thiết lập reverse proxy, đảm bảo mọi thứ đang chạy:

```bash
docker compose ps
# Tất cả services hiển thị "Up"

docker compose logs goclaw | grep "gateway starting"
# Sẽ thấy: "goclaw gateway starting"
```

### Bước 5: Reverse Proxy với SSL

**Thiết lập DNS:** Tạo bản ghi A trỏ đến IP VPS:

| Bản ghi | Loại | Giá trị |
|---------|------|---------|
| `yourdomain.com` | A | `IP_VPS_CỦA_BẠN` |

**Caddy (Khuyến nghị):**

```bash
sudo apt install -y caddy
```

Tạo `/etc/caddy/Caddyfile`:

```
yourdomain.com {
    reverse_proxy localhost:18790
}
```

> **Lưu ý:** Với `ENABLE_EMBEDUI: true` (mặc định), cả dashboard và API/WebSocket đều phục vụ từ cùng cổng (`18790`). Nếu dùng `docker-compose.selfservice.yml`, trỏ domain dashboard đến `localhost:3000`.

```bash
sudo systemctl reload caddy
```

Caddy tự cấp chứng chỉ SSL qua Let's Encrypt.

**Nginx:**

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Tạo `/etc/nginx/sites-available/goclaw`:

```nginx
server {
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:18790;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

> **Lưu ý:** Với `ENABLE_EMBEDUI: true` (mặc định), tất cả traffic (dashboard + API + WebSocket) đi qua cổng gateway duy nhất. Nếu dùng `docker-compose.selfservice.yml`, cấu hình server block riêng trỏ đến `localhost:3000` cho UI và `localhost:18790` cho WebSocket gateway.

```bash
sudo ln -s /etc/nginx/sites-available/goclaw /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

### Bước 6: Backup (Khuyến nghị)

Thêm cron job backup PostgreSQL hàng ngày:

```bash
sudo mkdir -p /backup
(crontab -l 2>/dev/null; echo "0 2 * * * cd /opt/goclaw && docker compose -f docker-compose.yml -f docker-compose.postgres.yml exec -T postgres pg_dump -U goclaw goclaw | gzip > /backup/goclaw-\$(date +\%Y\%m\%d).sql.gz") | crontab -
```

---

## Cập nhật lên phiên bản mới nhất

Đang chạy GoClaw và muốn nâng cấp? Làm theo các bước cho cách cài đặt của bạn.

### Cách 1: Cài nhanh (Binary)

Chạy lại script cài đặt — tải phiên bản mới nhất và ghi đè binary hiện tại:

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install.sh | bash
```

Sau đó nâng cấp schema database:

```bash
source .env.local && goclaw upgrade
```

> **Mẹo:** Chạy `goclaw upgrade --status` trước để kiểm tra có cần nâng cấp schema không, hoặc `goclaw upgrade --dry-run` để xem trước thay đổi.

### Cách 2: Bare Metal

```bash
cd goclaw
git pull origin main
go build -o goclaw .
./goclaw upgrade
```

Lệnh `goclaw upgrade` áp dụng SQL migrations đang chờ và chạy data hooks. An toàn khi chạy nhiều lần (idempotent).

### Cách 3 & 4: Docker (Local / VPS)

```bash
cd /path/to/goclaw     # hoặc /opt/goclaw trên VPS
git pull origin main
docker compose \
  -f docker-compose.yml \
  -f docker-compose.postgres.yml \
  up -d --build
```

GoClaw tự chạy migrations đang chờ khi khởi động — không cần chạy `goclaw upgrade` thủ công.

**Thay thế: dùng upgrade overlay** để nâng cấp database một lần mà không cần restart gateway:

```bash
# Xem trước thay đổi
docker compose -f docker-compose.yml -f docker-compose.postgres.yml \
  -f docker-compose.upgrade.yml run --rm upgrade --dry-run

# Áp dụng nâng cấp
docker compose -f docker-compose.yml -f docker-compose.postgres.yml \
  -f docker-compose.upgrade.yml run --rm upgrade
```

### Tự động nâng cấp khi khởi động

Đặt biến môi trường `GOCLAW_AUTO_UPGRADE` để tự chạy migrations khi gateway khởi động — hữu ích cho CI/CD và Docker deployments:

```bash
# .env hoặc .env.local
GOCLAW_AUTO_UPGRADE=true
```

Khi bật, GoClaw áp dụng SQL migrations đang chờ và data hooks khi khởi động. Nếu muốn kiểm soát thủ công, để trống và tự chạy `goclaw upgrade`.

### Xử lý sự cố nâng cấp

| Vấn đề | Giải pháp |
|--------|-----------|
| `database schema is dirty` | Migration trước đó thất bại. Chạy `goclaw migrate force <version-1>` rồi `goclaw upgrade` |
| `schema is newer than this binary` | Binary cũ hơn database. Cập nhật binary trước |
| `UPGRADE NEEDED` khi khởi động gateway | Chạy `goclaw upgrade` hoặc đặt `GOCLAW_AUTO_UPGRADE=true` |

---

## Xác minh cài đặt

Áp dụng cho tất cả các cách:

```bash
# Health check
curl http://localhost:18790/health
# Kết quả: {"status":"ok"}

# Docker logs (Docker/VPS)
docker compose logs goclaw
# Tìm: "goclaw gateway starting"

# Kiểm tra chẩn đoán (bare metal)
./goclaw doctor
```

## Lỗi thường gặp

| Vấn đề | Giải pháp |
|--------|-----------|
| `go: module requires Go >= 1.26` | Cập nhật Go: `go install golang.org/dl/go1.26@latest` |
| `pgvector extension not found` | Chạy `CREATE EXTENSION vector;` trong database goclaw |
| Cổng 18790 đã được dùng | Đặt `GOCLAW_PORT=18791` trong `.env` (Docker) hoặc `.env.local` (bare metal) |
| Docker build thất bại trên ARM Mac | Bật Rosetta trong cài đặt Docker Desktop |
| `no provider API key found` | Thêm LLM provider & API key qua Dashboard |
| `encryption key not set` | Chạy `./goclaw onboard` (bare metal) hoặc `./prepare-env.sh` (Docker) |
| `Cannot connect to the Docker daemon` | Khởi động Docker Desktop trước: `open -a Docker` (macOS) hoặc `sudo systemctl start docker` (Linux) |

## Tiếp theo

- [Hướng Dẫn Setup Wizard](./04-setup-wizard.md) — Chạy agent đầu tiên
- [Cấu Hình](../reference/03-configuration.md) — Tùy chỉnh cài đặt GoClaw

<!-- goclaw-source: c388364d | updated: 2026-04-01 -->
