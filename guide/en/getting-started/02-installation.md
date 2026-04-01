# Installation and Starting GoClaw

## Overview

This guide describes the steps to install GoClaw from source, configure the database, and start the server. It also covers Desktop (Lite) installation and Docker Compose.

---

## System Requirements

| Component | Minimum Version | Notes |
|-----------|-----------------|-------|
| Go | 1.26+ | Required when building from source |
| PostgreSQL | 18+ with pgvector | Required for Standard edition |
| pnpm | Latest | Only needed for Web UI development |
| Docker | 24+ | Optional, used for Docker Compose |

Desktop (Lite) edition does not require PostgreSQL — it uses SQLite, zero setup.

---

## Install from Source

```bash
git clone https://github.com/nextlevelbuilder/goclaw.git
cd goclaw
make build
```

The `make build` command creates the `./goclaw` binary (~25 MB, static, no Node.js runtime dependency).

Or build manually:

```bash
CGO_ENABLED=0 go build -o goclaw .
```

---

## Database Setup (PostgreSQL)

GoClaw requires PostgreSQL 18+ with the `pgvector` extension.

Create the database:

```sql
CREATE DATABASE goclaw;
CREATE USER goclaw WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE goclaw TO goclaw;
-- Connect to the goclaw database then run:
CREATE EXTENSION IF NOT EXISTS vector;
```

Connection string (used in the onboard step):

```
postgres://goclaw:your_password@localhost:5432/goclaw?sslmode=disable
```

Migrations run automatically during the onboard step or can be run manually:

```bash
./goclaw migrate up
```

---

## Onboard Wizard (First Time)

Run the interactive wizard to create the `.env.local` file and initialize the database:

```bash
./goclaw onboard
```

The wizard will prompt for the following in order:
- PostgreSQL DSN (connection string to the database)
- Gateway token (auto-generated if left blank)
- Encryption key (auto-generated if left blank)

Result: a `.env.local` file is created with the necessary environment variables:

```bash
GOCLAW_GATEWAY_TOKEN=<token>
GOCLAW_ENCRYPTION_KEY=<key>
GOCLAW_POSTGRES_DSN=postgres://...
```

Database migrations are also run automatically during this step.

---

## Starting the Server

```bash
source .env.local && ./goclaw
```

On startup, the gateway performs the following in order:
1. Load config from `GOCLAW_CONFIG` (JSON5) or use defaults
2. Connect to PostgreSQL, verify schema version
3. Initialize provider registry, tool registry, scheduler
4. Start listening on WebSocket + HTTP at `localhost:18790`
5. Start configured channels (Telegram, Discord, ...)

Successful startup log:

```
level=INFO msg="gateway started" addr=":18790"
```

Health check:

```bash
curl http://localhost:18790/health
```

---

## Accessing the Web Dashboard

After the server starts, open your browser at:

```
http://localhost:8000
```

On first access, the Web Dashboard displays the **Setup Wizard** with 4 steps:

| Step | Description |
|------|-------------|
| 1 - Provider | Add an LLM provider (Anthropic, OpenAI, OpenRouter, ...) and API key |
| 2 - Model | Select a default model for the provider just added |
| 3 - Agent | Create your first agent with a name and personality |
| 4 - Channel | (Optional) Connect Telegram, Discord, Slack, ... |

You can skip step 4 and set up channels later in Settings. After completing the wizard, the dashboard navigates to the Overview page.

---

## Desktop Installation (GoClaw Lite)

Desktop edition (Lite) is a native app for personal computers — no Docker or PostgreSQL required.

macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/nextlevelbuilder/goclaw/main/scripts/install-lite.ps1 | iex
```

Or download the installer from [GitHub Releases](https://github.com/nextlevelbuilder/goclaw/releases) (tag `lite-v*`):
- macOS: `.dmg` installer
- Windows: `.zip`

Data locations:
- Database (SQLite): `~/.goclaw/data/`
- Workspace (agent files): `~/.goclaw/workspace/`
- Secrets: OS keyring or `~/.goclaw/secrets/`

Lite edition limitations: up to 5 agents, 1 team, no messaging channels, no RBAC.

---

## Installation with Docker Compose

The fastest way to run the entire stack:

```bash
# Create .env with auto-generated secrets
chmod +x prepare-env.sh && ./prepare-env.sh

# Add at least one API key to .env, for example:
# GOCLAW_ANTHROPIC_API_KEY=sk-ant-...

make up
```

Web Dashboard at `http://localhost:3000`.

Common commands:

```bash
make up          # Start all services (build + migrate)
make down        # Stop all services
make logs        # View logs in real time
make reset       # Remove volumes and rebuild from scratch
```

Optional services:

```bash
make up WITH_BROWSER=1    # Add headless Chrome (web scraping)
make up WITH_OTEL=1       # Add Jaeger tracing UI
make up WITH_SANDBOX=1    # Add Docker sandbox for code execution
```

---

## Verifying the Installation

1. Health check the server:

```bash
curl http://localhost:18790/health
# Expected: {"status":"ok"}
```

2. Check database migrations:

```bash
./goclaw migrate status
```

3. Test your first chat: Open the Web Dashboard, go to **Chat**, select the agent you just created, and send a test message.

---

## Notes

- Use `pnpm`, not `npm`, for Web UI development.
- Docker Compose Web Dashboard runs on port 3000; building from source runs on port 8000.
- Lite edition does not support channels (Telegram, Discord, Slack, etc.).

---

## See Also

- [03-login.md](./03-login.md) — Sign in and select tenant
- [04-setup-wizard.md](./04-setup-wizard.md) — Detailed setup wizard guide
