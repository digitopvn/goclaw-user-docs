# Cai Dat va Khoi Dong GoClaw

## Tong quan

Huong dan nay mo ta cac buoc cai dat GoClaw tu source, cau hinh database, va khoi dong server. Cung bao gom cai dat Desktop (Lite) va Docker Compose.

---

## Yeu cau he thong

| Thanh phan | Phien ban toi thieu | Ghi chu |
|------------|---------------------|---------|
| Go | 1.26+ | Bat buoc khi build tu source |
| PostgreSQL | 18+ voi pgvector | Bat buoc cho Standard edition |
| pnpm | Moi nhat | Chi can cho Web UI development |
| Docker | 24+ | Tuy chon, dung cho Docker Compose |

Desktop (Lite) edition khong can PostgreSQL — dung SQLite, zero setup.

---

## Cai dat tu source

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw
make build
```

Lenh `make build` tao binary `./goclaw` (~25 MB, static, khong phu thuoc Node.js runtime).

Hoac build thu cong:

```bash
CGO_ENABLED=0 go build -o goclaw .
```

---

## Cai dat database (PostgreSQL)

GoClaw yeu cau PostgreSQL 18+ voi extension `pgvector`.

Tao database:

```sql
CREATE DATABASE goclaw;
CREATE USER goclaw WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE goclaw TO goclaw;
-- Ket noi vao database goclaw roi chay:
CREATE EXTENSION IF NOT EXISTS vector;
```

Connection string (dung trong buoc onboard):

```
postgres://goclaw:your_password@localhost:5432/goclaw?sslmode=disable
```

Migrations chay tu dong trong buoc onboard hoac co the chay thu cong:

```bash
./goclaw migrate up
```

---

## Onboard wizard (lan dau tien)

Chay wizard tuong tac de tao file `.env.local` va khoi tao database:

```bash
./goclaw onboard
```

Wizard se hoi lan luot:
- PostgreSQL DSN (connection string den database)
- Gateway token (tu tao neu de trong)
- Encryption key (tu tao neu de trong)

Ket qua: file `.env.local` duoc tao voi cac bien moi truong can thiet:

```bash
GOCLAW_GATEWAY_TOKEN=<token>
GOCLAW_ENCRYPTION_KEY=<key>
GOCLAW_POSTGRES_DSN=postgres://...
```

Migrations database cung duoc chay tu dong trong buoc nay.

---

## Khoi dong server

```bash
source .env.local && ./goclaw
```

Khi khoi dong, gateway thuc hien theo thu tu:
1. Load config tu `GOCLAW_CONFIG` (JSON5) hoac dung defaults
2. Ket noi PostgreSQL, verify schema version
3. Khoi tao provider registry, tool registry, scheduler
4. Bat dau lang nghe WebSocket + HTTP tai `localhost:18790`
5. Khoi dong cac channel da cau hinh (Telegram, Discord, ...)

Log startup thanh cong:

```
level=INFO msg="gateway started" addr=":18790"
```

Health check:

```bash
curl http://localhost:18790/health
```

---

## Truy cap Web Dashboard

Sau khi server khoi dong, mo trinh duyet tai:

```
http://localhost:8000
```

Lan dau truy cap, Web Dashboard hien thi **Setup Wizard** gom 4 buoc:

| Buoc | Noi dung |
|------|----------|
| 1 - Provider | Them LLM provider (Anthropic, OpenAI, OpenRouter, ...) va API key |
| 2 - Model | Chon model mac dinh cho provider vua them |
| 3 - Agent | Tao agent dau tien voi ten, personality |
| 4 - Channel | (Tuy chon) Ket noi Telegram, Discord, Slack, ... |

Co the bo qua buoc 4 va thiet lap channel sau trong Settings. Sau khi hoan thanh wizard, dashboard chuyen sang trang Overview.

---

## Cai dat Desktop (GoClaw Lite)

Desktop edition (Lite) la app native cho may tinh ca nhan — khong can Docker, khong can PostgreSQL.

macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

Hoac tai file cai dat tu [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`):
- macOS: `.dmg` installer
- Windows: `.zip`

Vi tri du lieu:
- Database (SQLite): `~/.goclaw/data/`
- Workspace (agent files): `~/.goclaw/workspace/`
- Secrets: OS keyring hoac `~/.goclaw/secrets/`

Gioi han Lite edition: toi da 5 agents, 1 team, khong co messaging channels, khong co RBAC.

---

## Cai dat voi Docker Compose

Cach nhanh nhat de chay toan bo stack:

```bash
# Tao .env voi auto-generated secrets
chmod +x prepare-env.sh && ./prepare-env.sh

# Them it nhat mot API key vao .env, vi du:
# GOCLAW_ANTHROPIC_API_KEY=sk-ant-...

make up
```

Web Dashboard tai `http://localhost:3000`.

Cac lenh thuong dung:

```bash
make up          # Khoi dong tat ca services (build + migrate)
make down        # Dung tat ca services
make logs        # Xem logs realtime
make reset       # Xoa volumes va build lai tu dau
```

Optional services:

```bash
make up WITH_BROWSER=1    # Them headless Chrome (web scraping)
make up WITH_OTEL=1       # Them Jaeger tracing UI
make up WITH_SANDBOX=1    # Them Docker sandbox cho code execution
```

---

## Xac minh cai dat

1. Health check server:

```bash
curl http://localhost:18790/health
# Expected: {"status":"ok"}
```

2. Kiem tra database migrations:

```bash
./goclaw migrate status
```

3. Test chat dau tien: Mo Web Dashboard, vao **Chat**, chon agent vua tao va gui tin nhan thu.

---

## Luu y

- Dung `pnpm`, khong dung `npm` cho Web UI development.
- Docker Compose Web Dashboard chay tai cong 3000, build tu source tai cong 8000.
- Lite edition khong ho tro channels (Telegram, Discord, Slack, v.v.).

---

## Xem them

- [03-dang-nhap.md](./03-dang-nhap.md) — Dang nhap va chon to chuc
- [04-setup-wizard.md](./04-setup-wizard.md) — Huong dan setup wizard chi tiet
