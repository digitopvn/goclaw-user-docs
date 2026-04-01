# Tools and MCP Servers

## Overview

GoClaw has a system of built-in tools grouped by category, and supports registering MCP servers to extend agent capabilities. Tool access is controlled through profiles and multi-layer policies.

**Built-in tools route:** `/builtin-tools` — Admin
**MCP servers route:** `/mcp` — Admin

---

## Guide

### Built-in Tool Profiles

4 profile levels determine which tools an agent is allowed to use:

| Profile | Tools Included |
|---------|----------------|
| `minimal` | Only `session_status` |
| `messaging` | messaging, web, sessions, media_read, skill_search |
| `coding` | fs, runtime, sessions, memory, web, knowledge, media_gen, media_read, skills |
| `full` | All registered tools |

**Configuration:** Agents > select agent > Tools tab > select profile. Profile can be overridden per LLM provider.

### Exec Approval

Controls whether agents can run shell commands:

**Security modes:**

| Mode | Behavior |
|------|----------|
| `deny` | Block all shell commands |
| `allowlist` | Only accept commands matching glob patterns in the allowlist |
| `full` | Allow all commands (default) |

**Ask modes:**

| Mode | Behavior |
|------|----------|
| `off` | Auto-approve — no prompting (default) |
| `on-miss` | Prompt when the command is not in the allowlist |
| `always` | Prompt before every command execution |

When prompting: the request is sent to admin, timeout 2 minutes. Admin chooses: **Allow Once** | **Allow Always** | **Deny**.

Commands blocked regardless of mode: `rm -rf`, `curl|sh`, reverse shells, fork bombs, ...

**Configuration:** Settings > Config > exec, or per-agent in Agents settings.

### Custom Tools

Create tools from shell commands without recompiling or restarting:

1. Go to **Settings > Custom Tools > Create Tool**
2. Fill in the fields:
   - **Name**: tool name (used in LLM tool calls)
   - **Description**: description so the LLM knows when to use it
   - **Parameters**: JSON Schema for parameters
   - **Command**: shell command, use `{{.param_name}}` for parameter placeholders
   - **Timeout**: default 60 seconds
   - **Scope**: Global (all agents) or per-agent
3. **Environment Variables**: encrypted with AES-256-GCM, injected into the process at runtime

Example: `dig +short {{.record_type}} {{.domain}}`

Security: parameters are shell-escaped, deny patterns from the `exec` tool apply, env vars are never displayed in plain text.

### Web Fetch Policy

Controls which URLs agents are allowed to fetch:

| Mode | Behavior |
|------|----------|
| `allow_all` | Allow fetching any URL (default) |
| `allowlist` | Only allow domains in `allowed_domains` |

**Configuration:** Settings > Built-in Tools > web_fetch > Settings.

### Registering an MCP Server

1. Go to **Settings > MCP > Add Server**
2. Fill in:
   - **Name**: identifier (creates tool prefix: `mcp_{name}_{tool}`)
   - **Transport**: stdio / sse / streamable-http
   - **Command** (stdio): e.g. `npx -y @modelcontextprotocol/server-filesystem /workspace`
   - **URL** (sse/http): endpoint URL
   - **Environment Variables**, Timeout, Enabled, Require User Credentials
3. Click **Test Connection** > **Create/Update** | **Cancel**

Health check: every 30 seconds. Reconnect: exponential backoff (2s -> 60s max, 10 retries).

### MCP Grants — Managing Access

**Grant access to an Agent:**
1. MCP > select server > Manage grants
2. Select agent, optionally add Tool Allow / Tool Deny lists
3. Click **Grant** / **Revoke**

**Grant access to a User:** Same process but applied to a specific user.

Rule: deny > allow. A denied tool will not appear even if it is in the allow list.

### MCP Self-Service

Users can request access to an MCP server themselves:
1. User submits a request via the Web UI or API
2. Request is in `pending` status — admin receives a notification
3. Admin goes to **MCP > Pending Requests** > **Approve** or **Deny**
4. The grant takes effect immediately after approval

---

## User Interface (UI)

### Built-in Tools Page (`/builtin-tools`)

**Display:** All tools grouped by category. Each tool: display name, code name, description, requirement badge, deprecated badge.

**Categories:** filesystem, runtime, web, memory, media, browser, sessions, messaging, scheduling, subagents, skills, delegation, teams.

**Actions:** Enable/disable toggle per tool | Configure settings (dialog) | Tenant override | Reset override | Search | Refresh

> Warning when enabling a media tool without a configured provider.

### MCP Servers Page (`/mcp`)

**Display:** MCP integration table: name, transport, tool count, agent count, status, created by.

**Actions:** Add MCP Server | Edit | Delete | Reconnect | Manage agent grants | View tools | Manage user credentials

**MCP Form Dialog:**
- Fields: Name, Display Name, Transport (stdio: command+args | SSE/HTTP: URL+headers), Environment Variables, Tool Prefix, Timeout, Enabled, Require User Credentials
- Actions: **Test Connection** | **Create/Update** | **Cancel**

**Agent Grants Dialog:** Current grants list + grant form: select agent, allow/deny lists (multi-select with search). **Grant/Update** | **Revoke** | **Cancel**

**View Tools Dialog:** Scrollable list with search filter — name, description, prefix badge (read-only).

**User Credentials Dialog:** Select user, API Key, Headers (sensitive values masked), Environment Variables. **Save** | **Delete All** | **Cancel**

---

## Built-in Tools List

### Filesystem (`fs`)
`read_file`, `write_file`, `edit`, `list_files`, `search`, `glob`

### Runtime (`runtime`)
`exec`, `credentialed_exec`

### Web (`web`)
`web_search`, `web_fetch`

### Memory (`memory`)
`memory_search`, `memory_get`

### Sessions (`sessions`)
`sessions_list`, `sessions_history`, `sessions_send`, `spawn`, `session_status`

### Teams (`teams`)
`team_tasks`, `team_message`

### Media Generation (`media_gen`)
`create_image`, `create_audio`, `create_video`, `tts`

### Media Read (`media_read`)
`read_image`, `read_audio`, `read_document`, `read_video`

### Other
`cron` (automation), `datetime` (automation), `message` (messaging), `knowledge_graph_search`, `use_skill`, `publish_skill`, `workspace_dir`, `openai_compat_call`

---

## Tool Policies — 7 Filtering Steps

1. Global profile (full/coding/messaging/minimal)
2. Provider profile override
3. Global allow list
4. Provider allow override
5. Agent allow list
6. Agent + Provider allow
7. Group allow list

Then deny lists are applied (global, agent), and finally alsoAllow is applied. To reference tool groups: use the prefix `group:`, e.g. `group:fs`, `group:web`.

---

## Notes

- MCP Transport `stdio`: launches a local process; `sse`/`streamable-http`: connects to a URL
- Default tool prefix: `mcp_{server_name}_{tool_name}`
- Slack channel has its own SSRF protection: only allows downloads from `*.slack.com`

---

## See Also

- [guide/en/admin/05-bao-mat.md](05-bao-mat.md) — Exec approval and shell deny patterns
- [guide/en/admin/01-providers.md](01-providers.md) — Configuring LLM providers
