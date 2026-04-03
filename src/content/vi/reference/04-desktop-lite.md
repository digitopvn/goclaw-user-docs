# Phiên Bản Desktop (Lite)

GoClaw Desktop là phiên bản binary đơn giản dành cho cá nhân và nhóm nhỏ, không yêu cầu dependency bên ngoài.

---

## Tổng Quan

Desktop Edition (cũng gọi là "Lite") là một binary duy nhất nhúng cả gateway server lẫn giao diện React frontend, sử dụng SQLite thay vì PostgreSQL. Thích hợp cho:

- Sử dụng cá nhân trên máy tính nội bộ
- Nhóm nhỏ không muốn quản lý infrastructure
- Thử nghiệm nhanh trước khi triển khai Standard edition

**Build tag:** `//go:build sqliteonly` — binary Desktop chỉ chứa SQLite, không có PostgreSQL.

**Tech stack Desktop:**
- **Backend:** Go + Wails v2, embedded gateway, SQLite via `modernc.org/sqlite`
- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS 4, Zustand, Framer Motion
- **Cổng:** 18790 (localhost only, cấu hình qua biến môi trường `GOCLAW_PORT`)
- **Secrets:** OS keyring (`go-keyring`) với fallback file tại `~/.goclaw/secrets/`

---

## Hướng Dẫn Cài Đặt

### macOS

**Cách 1: DMG installer (khuyến nghị)**

Tải file `.dmg` từ [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`), mở và kéo vào Applications.

**Cách 2: Script cài đặt tự động**

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

Script tự động tải binary phù hợp với kiến trúc (arm64 hoặc amd64), đặt vào `/usr/local/bin/goclaw`.

### Windows

**Cách 1: EXE installer**

Tải file `.exe` từ GitHub Releases và chạy installer.

**Cách 2: PowerShell script**

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

---

## So Sánh Standard vs Desktop (Lite)

| Tính năng | Standard | Desktop (Lite) |
|-----------|----------|----------------|
| Database | PostgreSQL + pgvector | SQLite |
| Cài đặt | Docker / binary + DB | Single binary |
| Agents | Không giới hạn | Tối đa 5 |
| Teams | Không giới hạn | Tối đa 1 |
| Thành viên team | Không giới hạn | Tối đa 5 |
| Sessions | Không giới hạn | Tối đa 50 |
| Channels (Telegram, Discord, ...) | Có | Không |
| Knowledge Graph | Có | Không |
| RBAC (phân quyền chi tiết) | Có | Không |
| Multi-tenant | Có | Không |
| Memory | Có (pgvector embeddings) | SQLite FTS5 |
| Heartbeat | Có | Không |
| File storage UI | Có | Không |
| Skill self-manage | Có | Không |
| Auto-update | Không | Có (GitHub Releases) |
| Port mặc định | Cấu hình qua config.json | 18790 |
| Secrets storage | Env vars / .env.local | OS keyring + ~/.goclaw/secrets/ |

---

## Giới Hạn Tính Năng (Feature Limits)

Desktop Edition áp dụng giới hạn sau qua `internal/edition/edition.go` (preset `Lite`):

| Giới hạn | Giá trị |
|----------|---------|
| Max agents | 5 |
| Max teams | 1 |
| Max thành viên team | 5 |
| Max sessions | 50 |
| Channels | Không khả dụng |
| Heartbeat | Không khả dụng |
| File storage UI | Không khả dụng |
| Skill self-manage | Không khả dụng |
| Knowledge Graph | Không khả dụng |
| RBAC | Không khả dụng |
| Multi-tenant | Không khả dụng |

Kiểm tra edition tại runtime: `edition.Current()` trả về `edition.Lite` hoặc `edition.Standard`.

---

## Tool Gating — Tools Bị Vô Hiệu Hóa Trong Lite

**Team action tools** (bị chặn bởi `TeamActionPolicy`):

| Tool | Lý do chặn |
|------|-----------|
| `comment` | Không có team collaboration UI |
| `review` | Không có review workflow |
| `approve` | Không có approval workflow |
| `reject` | Không có rejection workflow |
| `attach` | Không có file storage UI |
| `ask_user` | Không có multi-tenant user context |

**Skill tools:**

| Tool | Lý do chặn |
|------|-----------|
| `skill_manage` | Không có skill self-management |
| `publish_skill` | Không có skill publishing |

---

## Vị Trí Dữ Liệu

Tất cả dữ liệu Desktop được lưu tại `~/.goclaw/`:

```
~/.goclaw/
├── data/
│   ├── goclaw.db          # SQLite database chính
│   └── config.json        # File cấu hình
├── workspace/             # Agent files và team workspace
│   ├── agent-id-1/
│   └── teams/
└── secrets/               # Fallback secrets (nếu OS keyring không khả dụng)
```

**Biến môi trường ghi đè:**
- `GOCLAW_PORT` — thay đổi port (mặc định 18790)
- `GOCLAW_SQLITE_PATH` — đường dẫn tùy chỉnh đến SQLite DB
- `GOCLAW_CONFIG` — đường dẫn tùy chỉnh đến config.json

---

## Auto-Update

Desktop Edition tự động kiểm tra bản cập nhật mỗi khi khởi động:

- **Nguồn:** GitHub Releases, tags dạng `lite-v*`
- **Cơ chế:** `internal/updater/updater.go` gọi GitHub Releases API, so sánh version hiện tại với latest
- **Giao diện:** Component `UpdateBanner` hiển thị thông báo nếu có bản mới
- **Hành động:** Người dùng click "Cập nhật" để tải và cài đặt, hoặc bỏ qua
- **Không tự động áp dụng:** Người dùng phải xác nhận trước khi cập nhật được áp dụng

Kiểm tra version hiện tại: Frontend gọi `wails.getVersion()`, giá trị được đặt qua `-ldflags` lúc build.

---

## Build Từ Source

### Yêu Cầu

- Go 1.26+
- Node.js 20+ và pnpm
- Wails v2 CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- macOS: Xcode Command Line Tools
- Windows: WebView2 Runtime, MSVC Build Tools

### Dev Mode (Hot Reload)

```bash
cd ui/desktop && wails dev -tags sqliteonly
# hoặc
make desktop-dev
```

### Build Production

```bash
# Build .app (macOS) hoặc .exe (Windows)
make desktop-build VERSION=0.1.0

# Tạo .dmg installer (chỉ macOS)
make desktop-dmg VERSION=0.1.0
```

Version được nhúng vào binary qua `-ldflags`:
```
-ldflags "-X github.com/nextlevelbuilder/goclaw/cmd.Version=0.1.0"
```

### CI/CD — GitHub Actions

Tag `lite-v*` kích hoạt workflow `.github/workflows/release-desktop.yaml`:
1. Build macOS (arm64 + amd64) và Windows
2. Tạo GitHub Release
3. Đính kèm binary và DMG/EXE installer

### Cấu Trúc Thư Mục Desktop

```
ui/desktop/
├── main.go           # Entry point Wails
├── app.go            # Wails bindings, embedded gateway
└── frontend/         # React frontend
    ├── src/
    └── package.json  # Dùng pnpm
```

---

## Lưu Ý Kỹ Thuật

- **WS method params:** Tất cả params sử dụng camelCase (`teamId`, `taskId`, `sessionKey`) — khớp với Go struct `json:"..."` tags
- **SQLite vs PostgreSQL:** SQLite dùng `?` cho positional params, PostgreSQL dùng `$1, $2` — code có build tag `sqliteonly` xử lý sự khác biệt này
- **Nullable columns:** Dùng `*string`, `*time.Time` — nhất quán giữa cả hai backends
- **Edition check:** Trước khi thêm tính năng mới, kiểm tra `edition.Current()` để quyết định có áp dụng giới hạn hay không

---

## Xem Thêm

- [Cấu hình tham chiếu](./03-configuration.md)
- [So sánh tính năng Standard vs Lite](../getting-started/02-installation.md)
- GitHub Releases: `https://github.com/nextlevelbuilder/goclaw/releases`
