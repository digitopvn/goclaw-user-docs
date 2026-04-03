# System Configuration

**Route:** `/config`
**Sidebar Group:** System
**Access:** Owner (Cross-tenant)

---

## Overview

The system configuration page allows administrators to edit the entire `config.json` directly through the web interface. The configuration is divided into 6 specialized tabs, each with its own Save button.

The system uses **optimistic locking** via a configuration hash — if multiple people edit simultaneously, the later version will trigger a conflict error.

> **Warning:** Changes on this page directly affect the operation of the entire system. Read carefully before saving.

---

## User Interface (UI)

**Route:** `/config`

A configuration editor with 6 vertical tabs on the left. Displays:
- **Configuration hash badge** — current hash, used for optimistic locking
- **Warning panel** — reminders when selecting sensitive fields
- **Refresh button** — reload configuration from server, discarding unsaved changes

Changes are saved separately per tab. Click **Save** after finishing edits on each tab.

---

## Tab Guide

### Server Tab

Controls the gateway server: listen address, port, auth token, CORS, rate limit, debounce, and message handling policies.

Key fields:

| Field | Description |
|-------|-------------|
| `gateway.host` | Listen address (default `0.0.0.0`) |
| `gateway.port` | HTTP/WS port (default `8080`) |
| `gateway.token` | Bearer token — **use env var, do not enter directly** |
| `gateway.rate_limit_rpm` | Request limit per minute per user (`0` = disabled) |
| `gateway.inbound_debounce_ms` | Coalesce rapid messages from same sender (ms) |
| `gateway.injection_action` | Prompt injection handling: `log`, `warn`, `block`, `off` |
| `gateway.allowed_origins` | WebSocket CORS whitelist |

### Behavior Tab

Authorization policies and session scoping:

| Field | Description |
|-------|-------------|
| `sessions.scope` | `per-sender` or `global` |
| `sessions.dm_scope` | DM session scope (see configuration docs) |
| `gateway.block_reply` | Send intermediate text while tools are running |
| `gateway.tool_status` | Show tool name in preview streaming |

### AI Defaults Tab

Default values applied to all agents when no specific settings are provided:

| Field | Description |
|-------|-------------|
| `agents.defaults.provider` | Default LLM provider |
| `agents.defaults.model` | Default model |
| `agents.defaults.max_tokens` | Max output tokens (default `8192`) |
| `agents.defaults.temperature` | LLM temperature (default `0.7`) |
| `agents.defaults.max_tool_iterations` | Max tool iterations (default `30`) |
| `agents.defaults.agent_type` | `open` or `predefined` |

### Quota Tab

Configure usage limits per user, provider, channel, or group:

```json5
{
  gateway: {
    quota: {
      enabled: true,
      default: { hour: 20, day: 100, week: 500 },
      providers: {
        "anthropic": { hour: 50, day: 200 }
      },
      groups: {
        "user-id-vip": { hour: 100, day: 500, week: 2000 }
      }
    }
  }
}
```

Merge priority order: Groups > Channels > Providers > Default.

### Tools Tab

Controls tool availability:

| Field | Description |
|-------|-------------|
| `tools.profile` | Global profile: `minimal`, `coding`, `messaging`, `full` |
| `tools.allow` / `tools.deny` | Allow / deny list by name or group |
| `tools.execApproval.security` | `deny`, `allowlist`, `full` |
| `tools.execApproval.ask` | Ask user before running: `off`, `on-miss`, `always` |
| `tools.web_fetch.policy` | `allow_all` or `allowlist` |
| `tools.browser.enabled` | Enable browser automation |

### Integrations Tab

System integrations:

- **Text-to-Speech** — quick link to the `/tts` page
- **Cron Scheduler** — scheduler configuration (timezone, ...)
- **Telemetry** — performance data collection configuration
- **Agent Bindings** — connections to external services

---

## JSON5 Syntax

The config page supports JSON5 — an extended JSON format:

```json5
{
  // This is a comment
  gateway: {
    port: 8080,      // trailing comma allowed
    host: "0.0.0.0",
  },
}
```

---

## Quick Configuration Examples

**Enable rate limiting and quota:**
```json5
{
  gateway: {
    rate_limit_rpm: 30,
    quota: {
      enabled: true,
      default: { hour: 20, day: 100 }
    }
  }
}
```

**Change the default model:**
```json5
{
  agents: {
    defaults: {
      provider: "anthropic",
      model: "claude-opus-4-5",
      max_tokens: 16384
    }
  }
}
```

---

## Notes

- Secrets (API keys, tokens, DSN) should **never** be stored in `config.json` — use environment variables or `.env.local`
- The configuration hash changes with each save — keep the old hash if you need manual rollback
- Some fields require a server restart to take effect
- `config.patch` via WebSocket RPC allows partial updates without affecting other sections

---

## See Also

- [Full Configuration Reference](../reference/03-configuration.md)
- [TTS Configuration](../admin/08-tts.md)
- [WebSocket RPC — config methods](../reference/02-websocket-rpc.md)
