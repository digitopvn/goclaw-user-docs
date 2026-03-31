# 33 — Phien Ban Desktop (Lite)

GoClaw Desktop la phien ban binary don gian danh cho ca nhan va nhom nho, khong yeu cau dependency ben ngoai.

---

## 1. Desktop (Lite) La Gi

Desktop Edition (cung goi la "Lite") la mot binary duy nhat nhung ca gateway server lan giao dien React frontend, su dung SQLite thay vi PostgreSQL. Thich hop cho:

- Su dung ca nhan tren may tinh noi bo
- Nhom nho khong muon quan ly infrastructure
- Thu nghiem nhanh truoc khi trien khai Standard edition

**Build tag:** `//go:build sqliteonly` — binary Desktop chi chua SQLite, khong co PostgreSQL.

**Tech stack Desktop:**
- **Backend:** Go + Wails v2, embedded gateway, SQLite via `modernc.org/sqlite`
- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS 4, Zustand, Framer Motion
- **Cong:** 18790 (localhost only, cau hinh qua bien moi truong `GOCLAW_PORT`)
- **Secrets:** OS keyring (`go-keyring`) voi fallback file tai `~/.goclaw/secrets/`

---

## 2. Cai Dat

### macOS

**Cach 1: DMG installer (khuyen nghi)**

Tai file `.dmg` tu [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`), mo va keo vao Applications.

**Cach 2: Script cai dat tu dong**

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

Script nay tu dong tai binary phu hop voi kien truc (arm64 hoac amd64), dat vao `/usr/local/bin/goclaw`.

### Windows

**Cach 1: EXE installer**

Tai file `.exe` tu GitHub Releases va chay installer.

**Cach 2: PowerShell script**

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

---

## 3. So Sanh Standard vs Desktop (Lite)

| Tinh nang | Standard | Desktop (Lite) |
|-----------|----------|----------------|
| Database | PostgreSQL 18 + pgvector | SQLite |
| Cai dat | Docker / binary + DB | Single binary |
| Agents | Khong gioi han | Toi da 5 |
| Teams | Khong gioi han | Toi da 1 |
| Thanh vien team | Khong gioi han | Toi da 5 |
| Sessions | Khong gioi han | Toi da 50 |
| Channels (Telegram, Discord, ...) | Co | Khong |
| Knowledge Graph | Co | Khong |
| RBAC (phan quyen chi tiet) | Co | Khong |
| Multi-tenant | Co | Khong |
| Memory (pgvector embeddings) | Co | SQLite FTS5 |
| Heartbeat | Co | Khong |
| File storage UI | Co | Khong |
| Skill self-manage | Co | Khong |
| Auto-update | Khong | Co (GitHub Releases) |
| Port mac dinh | Cau hinh qua config.json | 18790 |
| Secrets storage | Env vars / .env.local | OS keyring + ~/.goclaw/secrets/ |

---

## 4. Gioi Han Tinh Nang (Feature Limits)

Desktop Edition ap dung gioi han sau qua `internal/edition/edition.go` (preset `Lite`):

| Gioi han | Gia tri |
|----------|---------|
| Max agents | 5 |
| Max teams | 1 |
| Max thanh vien team | 5 |
| Max sessions | 50 |
| Channels | Khong kha dung |
| Heartbeat | Khong kha dung |
| File storage UI | Khong kha dung |
| Skill self-manage | Khong kha dung |
| Knowledge Graph | Khong kha dung |
| RBAC | Khong kha dung |
| Multi-tenant | Khong kha dung |

Kiem tra edition tai runtime: `edition.Current()` tra ve `edition.Lite` hoac `edition.Standard`.

---

## 5. Tool Gating — Tools Bi Vo Hieu Hoa Trong Lite

Mot so tools bi chan trong Desktop edition:

**Team action tools** (bi chan boi `TeamActionPolicy` trong `internal/tools/team_action_policy.go`):

| Tool | Ly do chan |
|------|-----------|
| `comment` | Khong co team collaboration UI |
| `review` | Khong co review workflow |
| `approve` | Khong co approval workflow |
| `reject` | Khong co rejection workflow |
| `attach` | Khong co file storage UI |
| `ask_user` | Khong co multi-tenant user context |

**Skill tools** (khong duoc dang ky trong Lite):

| Tool | Ly do chan |
|------|-----------|
| `skill_manage` | Khong co skill self-management |
| `publish_skill` | Khong co skill publishing |

---

## 6. Vi Tri Du Lieu

Tat ca du lieu Desktop duoc luu tai `~/.goclaw/`:

```
~/.goclaw/
├── data/
│   ├── goclaw.db          # SQLite database chinh
│   └── config.json        # File cau hinh
├── workspace/             # Agent files va team workspace
│   ├── agent-id-1/        # Workspace cua tung agent
│   └── teams/             # Team workspace files
└── secrets/               # Fallback secrets (neu OS keyring khong kha dung)
```

**Bien moi truong ghi de:**
- `GOCLAW_PORT` — thay doi port (mac dinh 18790)
- `GOCLAW_SQLITE_PATH` — duong dan tuy chinh den SQLite DB
- `GOCLAW_CONFIG` — duong dan tuy chinh den config.json

---

## 7. Auto-Update

Desktop Edition tu dong kiem tra ban cap nhat moi khi khoi dong:

- **Nguon:** GitHub Releases, tags dang `lite-v*`
- **Co che:** `internal/updater/updater.go` goi GitHub Releases API, so sanh version hien tai voi latest release
- **Giao dien:** Component `UpdateBanner` hien thi thong bao neu co ban moi
- **Hanh dong:** Nguoi dung click "Cap nhat" de tai va cai dat, hoac bo qua
- **Khong tu dong ap dung:** Nguoi dung phai xac nhan truoc khi cap nhat duoc ap dung

**Kiem tra version hien tai:** Frontend goi `wails.getVersion()`, gia tri duoc dat qua `-ldflags` luc build.

---

## 8. Build Tu Source

### Yeu cau

- Go 1.26+
- Node.js 20+ va pnpm
- Wails v2 CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- macOS: Xcode Command Line Tools
- Windows: WebView2 Runtime, MSVC Build Tools

### Dev Mode (Hot Reload)

```bash
# Truc tiep
cd ui/desktop && wails dev -tags sqliteonly

# Hoac qua Makefile
make desktop-dev
```

Frontend React chay tren cong rieng voi hot reload. Gateway Go cung khoi dong lai khi co thay doi code.

### Build Production

```bash
# Build .app (macOS) hoac .exe (Windows)
make desktop-build VERSION=0.1.0

# Tao .dmg installer (chi macOS)
make desktop-dmg VERSION=0.1.0
```

**Version duoc nhung vao binary qua `-ldflags`:**
```
-ldflags "-X github.com/nextlevelbuilder/goclaw/cmd.Version=0.1.0"
```

### CI/CD — GitHub Actions

Tag `lite-v*` kich hoat workflow `.github/workflows/release-desktop.yaml`:
1. Build macOS (arm64 + amd64) va Windows
2. Tao GitHub Release
3. Dinh kem binary va DMG/EXE installer

### Cau Truc Thu Muc Desktop

```
ui/desktop/
├── main.go           # Entry point Wails
├── app.go            # Wails bindings, embedded gateway
└── frontend/         # React frontend
    ├── src/
    └── package.json  # Dung pnpm
```

---

## 9. Luu Y Ky Thuat

- **WS method params:** Tat ca params su dung **camelCase** (`teamId`, `taskId`, `sessionKey`) — khop voi Go struct `json:"..."` tags
- **SQLite vs PostgreSQL SQL:** SQLite dung `?` cho positional params, PostgreSQL dung `$1, $2` — code co build tag `sqliteonly` xu ly su khac biet nay
- **Nullable columns:** Dung `*string`, `*time.Time` — nhat quan giua ca hai backends
- **Edition check:** Truoc khi them tinh nang moi, kiem tra `edition.Current()` de quyet dinh co ap dung gioi han hay khong
