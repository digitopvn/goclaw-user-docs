# Agent Configuration

<YouTube id="lHMY3rbElfs" title="GoClaw Agent Config" />

## Overview

The agent detail page (`/agents/:id`) provides a complete set of tools to configure model, behavior, sandbox, rate limits, and context files. This page is intended for admins and operators who need to fine-tune agents for production environments.

Route: `/agents/:id`
Sidebar Group: Core
Access: Logged in (some sections require Admin)

---

## Agent Detail Interface

The page consists of 4 main tabs:

| Tab | Content |
|-----|---------|
| General | Model configuration, provider, behavior settings |
| Files | Context files (SOUL.md, IDENTITY.md, AGENTS.md, ...) |
| Permissions | Per-user permissions |
| Instances | Only visible for predefined agents — list of per-user instances |

**Main actions on the page:**
- Update agent configuration
- Regenerate from prompt — rebuild the agent from a new description
- Resummon — reinitialize the agent (re-run context file generation)
- Delete agent — confirmation dialog
- Advanced settings — open the advanced dialog
- Configure Heartbeat — set up health checks
- Manage Codex Pool — navigate to `/agents/:id/codex-pool`

---

## Configuration Guide

### Model and Provider

In the **General** tab:

| Field | Description |
|-------|-------------|
| Provider | Registered provider name (e.g., `anthropic`, `openrouter`) |
| Model | Specific model name (e.g., `claude-sonnet-4-5-20250929`, `gpt-4o`) |
| Max Iterations | Maximum loop iterations per run (default: 20). Increase if the agent has many complex tool calls. |
| History Limit | Number of user turns retained in history. Shorter saves tokens, longer helps retain context. |

### Context Files (Files Tab)

Files that define the agent's personality and knowledge:

| File | Function |
|------|----------|
| `IDENTITY.md` | Agent's name, role, background. Injected into the system prompt at the "primacy zone" level. |
| `SOUL.md` | Main system prompt — communication style, values, handling principles. |
| `BOOTSTRAP.md` | If present, the agent runs immediately on startup (mandatory notice). |
| `AGENTS.md` | Describes agents in the system so the main agent knows how to spawn sub-agents. |
| `TOOLS.md` | Documentation about tools available to the agent. |

You can add any file to the workspace. Files are injected into the system prompt under the "Project Context" section with a defensive preamble that protects the agent from being manipulated by external content.

**Per-user context files** (open agents): Each user has a separate `base/{userID}/` directory. The `USER.md` file is created automatically when a user chats for the first time — the agent can update this file over time.

**Regenerate from prompt** (Files Tab):
1. Click **Regenerate from prompt**.
2. Enter the new role description in the textarea.
3. Click **Regenerate** — the system regenerates SOUL.md and other context files.

### Behavior Settings

| Setting | Description |
|---------|-------------|
| Debounce | Wait time (ms) before processing messages in group chat (prevents spam) |
| Streaming | Enable/disable streaming response by chunk. Disable for debugging. |
| Tool Status | Display tool call status in the UI (tool.call / tool.result events) |
| Input Guard | Activate prompt injection scanning (default: `warn` — logs but does not block) |

### Advanced Settings

Opened via the **Advanced** button:

| Section | Content |
|---------|---------|
| Workspace Sharing | Configure workspace sharing between agents |
| Reasoning | Mode, level, fallback for Extended Thinking |
| ChatGPT OAuth Routing | Codex Pool routing configuration |
| Context Compression | Threshold and strategy for conversation history compression |
| Context Pruning | Remove less important context sections |
| Sandbox | Docker sandbox configuration for code execution |

### Sandbox Mode

Run code in a Docker container to isolate it from the main host.

| Field | Description |
|-------|-------------|
| Mode | `off` — no sandbox; `non-main` — sandbox sub-agents only; `all` — sandbox everything |
| Workspace Access | `none` full isolation; `ro` read-only mount; `rw` full read-write |
| Image | Docker image to use (e.g., `goclaw-sandbox:bookworm-slim`) |
| Scope | `session` — 1 container per session; `agent` — shared across sessions; `shared` — shared across all agents |
| Timeout | Maximum time (seconds) for each command run in the sandbox (default: 300) |
| Memory | Maximum RAM (MB) for the container (default: 512) |
| CPUs | Number of CPU cores (fractions allowed, e.g., 0.5) |
| Network | Enable/disable network access from the container |

Sandbox requires Docker installed on the host. The image must be pre-built.

### Rate Limits and Permissions (Permissions Tab)

- Limit the number of tool calls within a time period (per hour/day/week).
- Apply RBAC: `admin` / `operator` / `viewer`.
- Deny specific tools for the agent via **Tool Policy**.

**Adding per-user permissions:**
- Enter User ID, Config Type, Scope, Permission (allow/deny).
- Click **Add (+)** to grant permission.
- Click **Delete (X)** to revoke permission.

### Heartbeat (Health Check)

Click **Configure Heartbeat** to set up:

| Field | Description |
|-------|-------------|
| Enable/Disable | Turn heartbeat on or off |
| Interval (minutes) | Time between health checks |
| Provider/Model override | Use a different provider/model for heartbeat |
| Channel | Channel to receive notifications |
| Chat ID | Chat ID to receive notifications |
| Active hours | Time window for running heartbeat |
| Timezone | Timezone to apply |
| Checklist | Custom check steps |

Click **Run Now** to test immediately. View heartbeat history via **Heartbeat Logs**.

---

## Example — Configuring Sandbox for a Code-Writing Agent

```
/agents/my-coder -> Advanced -> Sandbox:
  Mode: non-main
  Workspace Access: rw
  Image: goclaw-sandbox:bookworm-slim
  Scope: session
  Timeout: 120
  Memory: 1024
  Network: enabled
-> Save
```

---

## Notes

- Changing Model/Provider takes effect immediately for new sessions; running sessions are not interrupted.
- Setting Max Iterations too low may cause the agent to stop mid-task when there are many complex tool calls.
- Sandbox requires the Docker daemon to be running on the host — check `docker info` before enabling.
- The Instances tab is only visible for predefined agents — it allows viewing and managing each user's individual context.

---

## See Also

- [Basic agent concepts](./01-agents-overview.md)
- [Adding skills to an agent](./03-skills.md)
- [Configuring Codex Pool routing](./04-codex-pool.md)
