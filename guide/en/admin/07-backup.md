# Backup and Restore

## Overview

GoClaw supports export/import of agents, skills, MCP configs, and teams via the Web UI. For production, it is recommended to combine this with database backup using `pg_dump`.

**Route:** `/import-export`
**Access:** Admin

> The Import & Export feature is currently in **beta**. Verify the configuration after restoring.

---

## Guide

### Accessing Import/Export

Go to **System > Import / Export**. The interface has 3 main tabs:
- **Teams** — export/import teams
- **Agents** — export/import agents
- **Skills & MCP** — export/import skills and MCP configs

Each tab has 2 inner tabs: **Export** and **Import**.

### Export Agents

1. Go to the **Agents > Export** tab
2. Select the agent(s) to back up
3. Click **Preview** to check the content
4. Click **Export** -> progress tree -> **Download** button (JSON file)

Included content: name, description, model, system prompt, tool profile, context files, per-user seed files, tool policies, exec settings, other customizations.

> Important: LLM provider API keys are **not exported** for security reasons.

### Import Agents

1. Go to the **Agents > Import** tab
2. Drag and drop a `.tar.gz` file or select a JSON file
3. **Preview import** — detect conflicts before importing
4. Select **Create new agent** (creates new agents) or **Merge into existing** (merges into an existing agent)
5. View completion summary (with "don't close" warning)

### Export / Import Skills

**Export:**
1. **Skills & MCP > Export** tab
2. Select the skills to back up
3. Click **Export Skills** -> downloads a JSON file

**Import:**
1. **Skills & MCP > Import** tab
2. Select the JSON file -> confirm -> **Import Skills**

### Export / Import MCP Configs

**Export:**
1. **Skills & MCP > Export** tab
2. Select MCP server configs
3. Click **Export MCP Servers**

> MCP server API keys are **not exported**. After import, re-enter credentials at Settings > MCP.

**Import:**
1. **Skills & MCP > Import** tab
2. Select the JSON file -> **Import MCP Servers** — recreates MCP server configs (without credentials)

### Export / Import Teams

**Export:**
1. **Teams > Export** tab
2. Select the team to back up
3. Click **Export** — JSON file including team configuration, agent list, workspace settings

**Import:**
1. **Teams > Import** tab
2. Select the JSON file -> **Import**

> If agents referenced in the team do not exist yet, import the agents first, then import the team.

### Database Backup (PostgreSQL)

Recommended to perform regularly for production environments:

**Backup:**
```bash
pg_dump -h localhost -U goclaw -d goclaw_db -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
```

| Parameter | Description |
|-----------|-------------|
| `-F c` | Custom format (compressed, flexible restore) |
| `-f` | Output filename |
| `-h` | Database host |
| `-U` | Username |
| `-d` | Database name |

**Restore:**
```bash
pg_restore -h localhost -U goclaw -d goclaw_db_new backup_20260330_080000.dump
```

**Automated backup schedule (recommended):**
```bash
# Add to crontab — backup daily at 2:00 AM
0 2 * * * pg_dump -U goclaw -d goclaw_db -F c -f /backups/goclaw_$(date +\%Y\%m\%d).dump
```

Store backups off the primary server (S3, NFS, etc.).

---

## User Interface (UI)

### Import/Export Page (`/import-export`)

**Display:** 3-tab page: Teams, Agents, Skills & MCP. Each tab has Export/Import sub-tabs. Beta feature warning banner.

**Export flow:** Select object (combobox) -> Preview -> **Export** -> progress tree -> **Download** button

**Import flow:** Drag and drop `.tar.gz` file -> Preview (conflict detection) -> **Create new agent** or **Merge into existing** -> completion summary (with "don't close" warning)

**Teams tab:** Export team (JSON with members and tasks) | Import team

**Agents tab:** Export preview | Export | Import preview | Create new | Merge import

**Skills & MCP tab:** Export/Import skills (JSON) | Export/Import MCP servers (JSON)

---

## After Import/Restore

**Required steps:**
1. **Settings > Providers** — re-enter the API key for each LLM provider
2. **Settings > MCP** — re-enter credentials for MCP servers with auth
3. **Settings > Custom Tools** — re-enter env vars if needed

**Verification checks:**
- Run a test agent chat — confirm the LLM provider is working
- Check that cron jobs have the correct schedule
- Confirm MCP servers have reconnected successfully
- Verify channel configurations (Telegram, Discord, etc.)

---

## Notes

GoClaw **never exports** the following secrets for security reasons:
- LLM provider API keys (`llm_providers.api_key`)
- MCP server API keys (`mcp_servers.api_key`)
- Custom tool env vars (`custom_tools.env`)

All are encrypted with AES-256-GCM and are not included in export files.

---

## See Also

- [guide/en/admin/01-providers.md](01-providers.md) — Re-entering LLM provider credentials
- [guide/en/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — Re-entering MCP credentials
- [guide/en/admin/05-bao-mat.md](05-bao-mat.md) — AES-256-GCM encryption
