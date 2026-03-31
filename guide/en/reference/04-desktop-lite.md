# Desktop Edition (Lite)

GoClaw Desktop is a simplified single-binary edition designed for individuals and small teams, requiring no external dependencies.

---

## Overview

Desktop Edition (also called "Lite") is a single binary that embeds both the gateway server and React frontend, using SQLite instead of PostgreSQL. Suitable for:

- Personal use on a local machine
- Small teams that don't want to manage infrastructure
- Quick experimentation before deploying the Standard edition

**Build tag:** `//go:build sqliteonly` — the Desktop binary contains only SQLite, no PostgreSQL.

**Desktop tech stack:**
- **Backend:** Go + Wails v2, embedded gateway, SQLite via `modernc.org/sqlite`
- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS 4, Zustand, Framer Motion
- **Port:** 18790 (localhost only, configured via `GOCLAW_PORT` environment variable)
- **Secrets:** OS keyring (`go-keyring`) with file fallback at `~/.goclaw/secrets/`

---

## Installation Guide

### macOS

**Option 1: DMG installer (recommended)**

Download the `.dmg` file from [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`), open and drag to Applications.

**Option 2: Automated install script**

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

The script automatically downloads the appropriate binary for your architecture (arm64 or amd64) and places it in `/usr/local/bin/goclaw`.

### Windows

**Option 1: EXE installer**

Download the `.exe` file from GitHub Releases and run the installer.

**Option 2: PowerShell script**

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

---

## Standard vs Desktop (Lite) Comparison

| Feature | Standard | Desktop (Lite) |
|---------|----------|----------------|
| Database | PostgreSQL + pgvector | SQLite |
| Installation | Docker / binary + DB | Single binary |
| Agents | Unlimited | Up to 5 |
| Teams | Unlimited | Up to 1 |
| Team members | Unlimited | Up to 5 |
| Sessions | Unlimited | Up to 50 |
| Channels (Telegram, Discord, ...) | Yes | No |
| Knowledge Graph | Yes | No |
| RBAC (fine-grained permissions) | Yes | No |
| Multi-tenant | Yes | No |
| Memory | Yes (pgvector embeddings) | SQLite FTS5 |
| Heartbeat | Yes | No |
| File storage UI | Yes | No |
| Skill self-manage | Yes | No |
| Auto-update | No | Yes (GitHub Releases) |
| Default port | Configured via config.json | 18790 |
| Secrets storage | Env vars / .env.local | OS keyring + ~/.goclaw/secrets/ |

---

## Feature Limits

Desktop Edition applies the following limits via `internal/edition/edition.go` (preset `Lite`):

| Limit | Value |
|-------|-------|
| Max agents | 5 |
| Max teams | 1 |
| Max team members | 5 |
| Max sessions | 50 |
| Channels | Not available |
| Heartbeat | Not available |
| File storage UI | Not available |
| Skill self-manage | Not available |
| Knowledge Graph | Not available |
| RBAC | Not available |
| Multi-tenant | Not available |

Check edition at runtime: `edition.Current()` returns `edition.Lite` or `edition.Standard`.

---

## Tool Gating — Tools Disabled in Lite

**Team action tools** (blocked by `TeamActionPolicy`):

| Tool | Reason |
|------|--------|
| `comment` | No team collaboration UI |
| `review` | No review workflow |
| `approve` | No approval workflow |
| `reject` | No rejection workflow |
| `attach` | No file storage UI |
| `ask_user` | No multi-tenant user context |

**Skill tools:**

| Tool | Reason |
|------|--------|
| `skill_manage` | No skill self-management |
| `publish_skill` | No skill publishing |

---

## Data Location

All Desktop data is stored at `~/.goclaw/`:

```
~/.goclaw/
├── data/
│   ├── goclaw.db          # Main SQLite database
│   └── config.json        # Configuration file
├── workspace/             # Agent files and team workspace
│   ├── agent-id-1/
│   └── teams/
└── secrets/               # Fallback secrets (if OS keyring is not available)
```

**Environment variable overrides:**
- `GOCLAW_PORT` — change port (default 18790)
- `GOCLAW_SQLITE_PATH` — custom path to SQLite DB
- `GOCLAW_CONFIG` — custom path to config.json

---

## Auto-Update

Desktop Edition automatically checks for updates on each startup:

- **Source:** GitHub Releases, tags matching `lite-v*`
- **Mechanism:** `internal/updater/updater.go` calls the GitHub Releases API, compares the current version with latest
- **UI:** The `UpdateBanner` component displays a notification if a new version is available
- **Action:** User clicks "Update" to download and install, or dismiss
- **Not auto-applied:** User must confirm before the update is applied

Check current version: The frontend calls `wails.getVersion()`, the value is set via `-ldflags` at build time.

---

## Building from Source

### Requirements

- Go 1.26+
- Node.js 20+ and pnpm
- Wails v2 CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- macOS: Xcode Command Line Tools
- Windows: WebView2 Runtime, MSVC Build Tools

### Dev Mode (Hot Reload)

```bash
cd ui/desktop && wails dev -tags sqliteonly
# or
make desktop-dev
```

### Production Build

```bash
# Build .app (macOS) or .exe (Windows)
make desktop-build VERSION=0.1.0

# Create .dmg installer (macOS only)
make desktop-dmg VERSION=0.1.0
```

Version is embedded into the binary via `-ldflags`:
```
-ldflags "-X github.com/nextlevelbuilder/goclaw/cmd.Version=0.1.0"
```

### CI/CD — GitHub Actions

Tag `lite-v*` triggers the workflow `.github/workflows/release-desktop.yaml`:
1. Build macOS (arm64 + amd64) and Windows
2. Create GitHub Release
3. Attach binary and DMG/EXE installer

### Desktop Directory Structure

```
ui/desktop/
├── main.go           # Wails entry point
├── app.go            # Wails bindings, embedded gateway
└── frontend/         # React frontend
    ├── src/
    └── package.json  # Uses pnpm
```

---

## Technical Notes

- **WS method params:** All params use camelCase (`teamId`, `taskId`, `sessionKey`) — matching Go struct `json:"..."` tags
- **SQLite vs PostgreSQL:** SQLite uses `?` for positional params, PostgreSQL uses `$1, $2` — code with the `sqliteonly` build tag handles this difference
- **Nullable columns:** Use `*string`, `*time.Time` — consistent across both backends
- **Edition check:** Before adding new features, check `edition.Current()` to decide whether to apply limits

---

## See Also

- [Configuration Reference](./03-cau-hinh.md)
- [Standard vs Lite Feature Comparison](../getting-started/02-cai-dat.md)
- GitHub Releases: `https://github.com/nextlevelbuilder/goclaw/releases`
