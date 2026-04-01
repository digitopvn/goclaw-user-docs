# Cài Đặt và Khởi Động GoClaw

## Tổng quan

Hướng dẫn này mô tả các bước cài đặt GoClaw từ source, cấu hình database, và khởi động server. Cũng bao gồm cài đặt Desktop (Lite) và Docker Compose.

---

## Yêu cầu hệ thống

| Thành phần | Phiên bản tối thiểu | Ghi chú |
|------------|---------------------|---------|
| Go | 1.26+ | Bắt buộc khi build từ source |
| PostgreSQL | 18+ với pgvector | Bắt buộc cho Standard edition |
| pnpm | Mới nhất | Chỉ cần cho Web UI development |
| Docker | 24+ | Tùy chọn, dùng cho Docker Compose |

Desktop (Lite) edition không cần PostgreSQL — dùng SQLite, zero setup.

---

## Cài đặt từ source

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw
make build
```

Lệnh `make build` tạo binary `./goclaw` (~25 MB, static, không phụ thuộc Node.js runtime).

Hoặc build thủ công:

```bash
CGO_ENABLED=0 go build -o goclaw .
```

---

## Cài đặt database (PostgreSQL)

GoClaw yêu cầu PostgreSQL 18+ với extension `pgvector`.

Tạo database:

```sql
CREATE DATABASE goclaw;
CREATE USER goclaw WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE goclaw TO goclaw;
-- Kết nối vào database goclaw rồi chạy:
CREATE EXTENSION IF NOT EXISTS vector;
```

Connection string (dùng trong bước onboard):

```
postgres://goclaw:your_password@localhost:5432/goclaw?sslmode=disable
```

Migrations chạy tự động trong bước onboard hoặc có thể chạy thủ công:

```bash
./goclaw migrate up
```

---

## Onboard wizard (lần đầu tiên)

Chạy wizard tương tác để tạo file `.env.local` và khởi tạo database:

```bash
./goclaw onboard
```

Wizard sẽ hỏi lần lượt:
- PostgreSQL DSN (connection string đến database)
- Gateway token (tự tạo nếu để trống)
- Encryption key (tự tạo nếu để trống)

Kết quả: file `.env.local` được tạo với các biến môi trường cần thiết:

```bash
GOCLAW_GATEWAY_TOKEN=<token>
GOCLAW_ENCRYPTION_KEY=<key>
GOCLAW_POSTGRES_DSN=postgres://...
```

Migrations database cũng được chạy tự động trong bước này.

---

## Khởi động server

```bash
source .env.local && ./goclaw
```

Khi khởi động, gateway thực hiện theo thứ tự:
1. Load config từ `GOCLAW_CONFIG` (JSON5) hoặc dùng defaults
2. Kết nối PostgreSQL, verify schema version
3. Khởi tạo provider registry, tool registry, scheduler
4. Bắt đầu lắng nghe WebSocket + HTTP tại `localhost:18790`
5. Khởi động các channel đã cấu hình (Telegram, Discord, ...)

Log startup thành công:

```
level=INFO msg="gateway started" addr=":18790"
```

Health check:

```bash
curl http://localhost:18790/health
```

---

## Truy cập Web Dashboard

Sau khi server khởi động, mở trình duyệt tại:

```
http://localhost:8000
```

Lần đầu truy cập, Web Dashboard hiển thị **Setup Wizard** gồm 4 bước:

| Bước | Nội dung |
|------|----------|
| 1 - Provider | Thêm LLM provider (Anthropic, OpenAI, OpenRouter, ...) và API key |
| 2 - Model | Chọn model mặc định cho provider vừa thêm |
| 3 - Agent | Tạo agent đầu tiên với tên, cá tính |
| 4 - Channel | (Tùy chọn) Kết nối Telegram, Discord, Slack, ... |

Có thể bỏ qua bước 4 và thiết lập channel sau trong Settings. Sau khi hoàn thành wizard, dashboard chuyển sang trang Tổng quan.

---

## Cài đặt Desktop (GoClaw Lite)

Desktop edition (Lite) là app native cho máy tính cá nhân — không cần Docker, không cần PostgreSQL.

macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

Hoặc tải file cài đặt từ [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`):
- macOS: `.dmg` installer
- Windows: `.zip`

Vị trí dữ liệu:
- Database (SQLite): `~/.goclaw/data/`
- Workspace (agent files): `~/.goclaw/workspace/`
- Secrets: OS keyring hoặc `~/.goclaw/secrets/`

Giới hạn Lite edition: tối đa 5 agents, 1 team, không có messaging channels, không có RBAC.

---

## Cài đặt với Docker Compose

Cách nhanh nhất để chạy toàn bộ stack:

```bash
# Tạo .env với auto-generated secrets
chmod +x prepare-env.sh && ./prepare-env.sh

# Thêm ít nhất một API key vào .env, ví dụ:
# GOCLAW_ANTHROPIC_API_KEY=sk-ant-...

make up
```

Web Dashboard tại `http://localhost:3000`.

Các lệnh thường dùng:

```bash
make up          # Khởi động tất cả services (build + migrate)
make down        # Dừng tất cả services
make logs        # Xem logs realtime
make reset       # Xóa volumes và build lại từ đầu
```

Optional services:

```bash
make up WITH_BROWSER=1    # Thêm headless Chrome (web scraping)
make up WITH_OTEL=1       # Thêm Jaeger tracing UI
make up WITH_SANDBOX=1    # Thêm Docker sandbox cho code execution
```

---

## Xác minh cài đặt

1. Health check server:

```bash
curl http://localhost:18790/health
# Expected: {"status":"ok"}
```

2. Kiểm tra database migrations:

```bash
./goclaw migrate status
```

3. Test chat đầu tiên: Mở Web Dashboard, vào **Chat**, chọn agent vừa tạo và gửi tin nhắn thử.

---

## Lưu ý

- Dùng `pnpm`, không dùng `npm` cho Web UI development.
- Docker Compose Web Dashboard chạy tại cổng 3000, build từ source tại cổng 8000.
- Lite edition không hỗ trợ channels (Telegram, Discord, Slack, v.v.).

---

## Xem thêm

- [Đăng nhập và chọn tổ chức](./03-dang-nhap.md)
- [Hướng dẫn setup wizard chi tiết](./04-setup-wizard.md)
