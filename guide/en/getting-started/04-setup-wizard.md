# Setup Wizard and Dashboard Overview

## Overview

On first access to the Web Dashboard after installation, the system displays a **Setup Wizard** with 4 steps to configure the system from scratch. After completion, it transitions to the **Overview** page — the central hub for monitoring gateway activity.

---

## Guide — Setup Wizard

Route: `/setup`
Access: Signed in

### Step 1 — Configure LLM Provider

Add your first LLM provider.

| Field | Description |
|-------|-------------|
| Provider Type | Select from the list (Anthropic, OpenAI, OpenRouter, ...) |
| Name | Display name for this provider |
| API Key | Authentication key for the provider |
| API Base URL | Base URL (optional, used for self-hosted providers) |

Click **Create Provider** to save and proceed to Step 2.

### Step 2 — Select & Verify Model

Select a default model for the provider just added.

- Select a model from the combobox.
- Click **Verify** — the system sends a test request (30-second countdown).
- After successful verification, the **Continue** button appears.

### Step 3 — Create Your First Agent

Create your first agent.

| Field | Description |
|-------|-------------|
| Icon | Representative emoji (optional) |
| Display Name | Display name of the agent |
| Agent Key | Unique slug (auto-generated from the name) |
| Agent Personality | Description of the agent's role and style |
| Type | **Predefined** (shared context) or **Open** (per-user context) |
| Self-Evolution | Allow the agent to self-update SOUL.md |

Click **Create Agent** — a **Summoning Modal** appears with an animated orb and real-time file progress.
- On success: **Continue** button → proceeds to Step 4.
- On failure: **Retry** or **Close** button.

### Step 4 — Connect a Channel (Optional)

Connect a messaging channel (Telegram, Discord, Slack, ...).

| Field | Description |
|-------|-------------|
| Channel Type | Select type (Telegram, Discord, Slack, Feishu, Zalo, WhatsApp) |
| Name | Display name for this channel |
| Credentials | Depends on type (Bot Token, App ID, ...) |

Click **Create Channel** to connect — a **Setup Complete** modal appears with a **Go to Dashboard** button → `/overview`.

Click **Skip** to finish the wizard without connecting a channel (you can add one later in Settings).

Other options in the wizard:
- **Switch language** — vi / en / zh
- **Switch tenant** — select a different tenant

---

## Interface — Dashboard Overview

Route: `/overview`
Sidebar Group: Core
Access: Signed in

After the setup wizard, this is the system's home page. It has two main tabs.

### Overview Tab

Displays 5 stat cards:

| Card | Content |
|------|---------|
| Requests Today | Total requests for the day |
| Tokens Today | Total tokens used |
| Cost Today | Estimated LLM cost |
| Agents | Number of active agents |
| Channels | Number of connected channels |

Other sections on the Overview tab:
- **Provider alerts** — providers that are not configured or encountering errors
- **System Health** — status of key components
- **Connected Clients** — list of currently connected WebSocket clients
- **Cron Jobs** — upcoming scheduled tasks
- **Recent Requests** — log of the most recent requests
- **Quota Usage** — usage levels compared to limits
- **Version info** — current GoClaw version

The page auto-refreshes every 30 seconds.

### Usage Tab

Detailed usage analysis over time.

**Actions:**
- **Filter** by agent, provider, channel, time range, granularity
- **Time-series chart** — request volume over time
- **Distribution** by provider / model / channel
- **Data table** with details
- **Export CSV** — download raw usage data

---

## Example — Complete Setup Flow

```
Sign in -> /login
  -> No setup yet? -> /setup
    -> Step 1: Add Anthropic provider + API key
    -> Step 2: Select claude-sonnet-4-5, Verify OK
    -> Step 3: Create agent "Assistant", type=open
    -> Step 4: Skip channel
  -> /overview (Dashboard)
```

---

## Notes

- You can skip the entire wizard using the **Skip setup and go to dashboard** button at any step.
- After skipping, you can return to configure each part individually in **Settings** (Providers, Channels, Agents).
- The Usage tab on Overview provides a high-level view of LLM costs — for per-session details, use the **Sessions** page.

---

## See Also

- [Getting started with agent chat](../chat-and-sessions/01-basic-chat.md)
- [Understanding agents in depth](../agents/01-agents-overview.md)
- [Advanced agent configuration](../agents/02-agent-config.md)
