# Configuration Reference

GoClaw reads configuration from a JSON5 file. Secrets are kept separate from config.json and are only read from environment variables or the `.env.local` file.

---

## Overview

- **Format:** JSON5 (supports `//` comments, trailing commas, unquoted keys)
- **Default location:** `~/.goclaw/data/config.json` (Desktop) or `./config.json` (Standard)
- **Environment variable override:** `GOCLAW_CONFIG` specifies an explicit path
- **Security principle:** Secrets (API keys, tokens, DSN) are NEVER stored in `config.json`

**Basic example:**
```json5
{
  // Gateway server settings
  gateway: {
    host: "0.0.0.0",
    port: 8080,
    token: "", // Leave empty, use GOCLAW_GATEWAY_TOKEN environment variable
  },
  agents: {
    defaults: {
      provider: "anthropic",
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
    }
  }
}
```

---

## Section: gateway

Controls the gateway server.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `host` | string | `"0.0.0.0"` | Listen address |
| `port` | int | `8080` | Listen port (Desktop: 18790) |
| `token` | string | `""` | Bearer token for WS/HTTP authentication (secret — use env) |
| `owner_ids` | []string | `[]` | Sender IDs treated as "owner" |
| `allowed_origins` | []string | `[]` | WebSocket CORS whitelist (empty = allow all) |
| `max_message_chars` | int | `32000` | Maximum characters per user message |
| `rate_limit_rpm` | int | `20` | Request limit per minute per user (0 = disabled) |
| `injection_action` | string | `"warn"` | Action on prompt injection detection: `log`, `warn`, `block`, `off` |
| `inbound_debounce_ms` | int | `1000` | Coalesce rapid messages from the same sender (ms, -1 = disabled) |
| `block_reply` | *bool | `false` | Send intermediate text while tools are running |
| `tool_status` | *bool | `true` | Show tool name in streaming preview |
| `task_recovery_interval_sec` | int | `300` | Interval for checking team task recovery (seconds) |

### gateway.quota

Per-user/group request quota configuration.

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | bool | Enable/disable the quota system |
| `default` | QuotaWindow | Default limits per user |
| `providers` | map[string]QuotaWindow | Override per provider (key = provider name) |
| `channels` | map[string]QuotaWindow | Override per channel (key = channel name) |
| `groups` | map[string]QuotaWindow | Override per group (key = userID) |

**QuotaWindow:**
```json5
{
  hour: 20,   // max requests/hour (0 = unlimited)
  day: 100,   // max requests/day
  week: 500   // max requests/week
}
```

Merge priority order: Groups > Channels > Providers > Default.

---

## Section: channels

### channels.telegram

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | bool | `false` | Enable Telegram channel |
| `token` | string | `""` | Bot token (secret — use env) |
| `allow_from` | []string | `[]` | Sender ID whitelist |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Require @bot mention in groups |
| `mention_mode` | string | `"strict"` | `"strict"` or `"yield"` |
| `history_limit` | int | `50` | Max pending group messages for context (0 = disabled) |
| `dm_stream` | *bool | `false` | Enable streaming for DMs |
| `group_stream` | *bool | `false` | Enable streaming for groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `media_max_bytes` | int64 | `20MB` | Maximum media download size |
| `proxy` | string | `""` | HTTP/SOCKS5 proxy URL |
| `api_server` | string | `""` | Custom Telegram Bot API server URL |

### channels.discord

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | bool | `false` | Enable Discord channel |
| `token` | string | `""` | Bot token (secret — use env) |
| `allow_from` | []string | `[]` | User ID whitelist |
| `dm_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Require @bot mention |
| `history_limit` | int | `50` | Max pending messages for context |
| `media_max_bytes` | int64 | `25MB` | Maximum media download size |

### channels.slack

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | bool | `false` | Enable Slack channel |
| `bot_token` | string | `""` | `xoxb-...` Bot User OAuth Token (secret) |
| `app_token` | string | `""` | `xapp-...` App-Level Token Socket Mode (secret) |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"pairing"`, `"allowlist"`, `"disabled"` |
| `dm_stream` | *bool | `false` | Streaming for DMs |
| `group_stream` | *bool | `false` | Streaming for groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `debounce_delay` | int | `300` | Ms delay before processing rapid messages |
| `thread_ttl` | *int | `24` | Hours before thread participation expires |

### Other Channels

- **`channels.whatsapp`** — `enabled`, `bridge_url`, `allow_from`, `dm_policy`, `group_policy`
- **`channels.zalo`** — `enabled`, `token`, `allow_from`, `dm_policy`, `webhook_url`, `webhook_secret`
- **`channels.zalo_personal`** — `enabled`, `allow_from`, `dm_policy`, `group_policy`, `credentials_path`
- **`channels.feishu`** — `enabled`, `app_id`, `app_secret`, `domain` (`"lark"`/`"feishu"`), `connection_mode` (`"websocket"`/`"webhook"`)

### channels.pending_compaction

| Field | Default | Description |
|-------|---------|-------------|
| `threshold` | `200` | Trigger compaction when entries exceed this |
| `keep_recent` | `40` | Number of recent messages to keep after compaction |
| `max_tokens` | `4096` | Max output tokens for LLM summarization |
| `provider` | `""` | LLM provider (empty = use agent's provider) |

---

## Section: providers

API keys are always read from env vars — NEVER stored in `config.json`.

| Provider | Fields | Description |
|----------|--------|-------------|
| `anthropic` | `api_key`, `api_base` | Anthropic Claude |
| `openai` | `api_key`, `api_base` | OpenAI GPT |
| `openrouter` | `api_key`, `api_base` | OpenRouter |
| `gemini` | `api_key`, `api_base` | Google Gemini |
| `deepseek` | `api_key`, `api_base` | DeepSeek |
| `groq` | `api_key`, `api_base` | Groq |
| `mistral` | `api_key`, `api_base` | Mistral AI |
| `xai` | `api_key`, `api_base` | xAI Grok |
| `minimax` | `api_key`, `api_base` | MiniMax |
| `ollama` | `host` | Local Ollama (no API key needed) |
| `claude_cli` | `cli_path`, `model`, `perm_mode` | Claude CLI (uses subscription) |
| `acp` | `binary`, `args`, `model`, `work_dir`, `idle_ttl`, `perm_mode` | ACP protocol agents |
| `dashscope` | `api_key`, `api_base` | Alibaba DashScope (Qwen) |
| `novita` | `api_key`, `api_base` | Novita AI |

---

## Section: tools

| Field | Type | Description |
|-------|------|-------------|
| `profile` | string | `"minimal"`, `"coding"`, `"messaging"`, `"full"` |
| `allow` | []string | Allow list (tool names or `"group:xxx"`) |
| `deny` | []string | Deny list |
| `alsoAllow` | []string | Add without removing existing |
| `rate_limit_per_hour` | int | Max tool executions/hour/session (0 = disabled) |
| `scrub_credentials` | *bool | Automatically redact API keys/tokens in tool output (default true) |

### tools.execApproval

| Field | Default | Description |
|-------|---------|-------------|
| `security` | `"full"` | `"deny"`, `"allowlist"`, `"full"` |
| `ask` | `"off"` | `"off"`, `"on-miss"`, `"always"` |
| `allowlist` | `[]` | Glob patterns for allowed commands |

### tools.web_fetch

| Field | Default | Description |
|-------|---------|-------------|
| `policy` | `"allow_all"` | `"allow_all"` or `"allowlist"` |
| `allowed_domains` | `[]` | e.g., `["github.com", "*.example.com"]` |
| `blocked_domains` | `[]` | Always checked regardless of policy |

### tools.browser

| Field | Default | Description |
|-------|---------|-------------|
| `enabled` | `false` | Enable browser automation tool |
| `headless` | `false` | Run Chrome headless |
| `remote_url` | `""` | CDP endpoint for remote Chrome |
| `action_timeout_ms` | `30000` | Timeout per action (ms) |
| `idle_timeout_ms` | `600000` | Auto-close page when idle (ms, 0 = disabled) |
| `max_pages` | `5` | Max open pages per tenant |

### tools.mcp_servers

```json5
{
  tools: {
    mcp_servers: {
      "my-server": {
        transport: "stdio",        // "stdio", "sse", "streamable-http"
        command: "npx",
        args: ["-y", "@my/mcp-server"],
        env: {"API_KEY": "xxx"},
        tool_prefix: "my_",
        timeout_sec: 60,
        enabled: true
      }
    }
  }
}
```

---

## Section: sessions

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `scope` | string | `"per-sender"` | `"per-sender"` or `"global"` |
| `dm_scope` | string | `"per-channel-peer"` | DM session scope |
| `main_key` | string | `"main"` | Key suffix for main session |

**`dm_scope` values:**

| Value | Description |
|-------|-------------|
| `"main"` | All DMs share a single session |
| `"per-peer"` | Each peer has a separate session (shared across channels) |
| `"per-channel-peer"` | Each (channel, peer) pair has a separate session (default) |
| `"per-account-channel-peer"` | Adds bot account to key separation |

---

## Section: tts

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `provider` | string | `""` | `"openai"`, `"elevenlabs"`, `"edge"`, `"minimax"` |
| `auto` | string | `"off"` | `"off"`, `"always"`, `"inbound"`, `"tagged"` |
| `mode` | string | `"final"` | `"final"` or `"all"` |
| `max_length` | int | `1500` | Maximum text length before truncation |
| `timeout_ms` | int | `30000` | API call timeout (ms) |

**TTS Providers:**

| Provider | Configuration Fields |
|----------|---------------------|
| `tts.openai` | `api_key`, `api_base`, `model` (default `"gpt-4o-mini-tts"`), `voice` (default `"alloy"`) |
| `tts.elevenlabs` | `api_key`, `base_url`, `voice_id`, `model_id` |
| `tts.edge` | `enabled`, `voice` (default `"en-US-MichelleNeural"`), `rate` |
| `tts.minimax` | `api_key`, `group_id`, `api_base`, `model`, `voice_id` |

---

## Section: agents.defaults

| Field | Default | Description |
|-------|---------|-------------|
| `workspace` | `"~/agents"` | Root workspace directory |
| `restrict_to_workspace` | `false` | Restrict file access to workspace |
| `provider` | `""` | Default provider name |
| `model` | `""` | Default model |
| `max_tokens` | `8192` | Max output tokens |
| `temperature` | `0.7` | LLM temperature |
| `max_tool_iterations` | `30` | Maximum tool iterations per run |
| `context_window` | `200000` | Context window size |
| `max_tool_calls` | `25` | Maximum total tool calls per run (0 = unlimited) |
| `agent_type` | `"open"` | `"open"` or `"predefined"` |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOCLAW_CONFIG` | Explicit path to config.json file |
| `GOCLAW_GATEWAY_TOKEN` | Gateway authentication bearer token |
| `GOCLAW_POSTGRES_DSN` | PostgreSQL connection string |
| `GOCLAW_REDIS_DSN` | Redis connection string (optional) |
| `GOCLAW_STORAGE_BACKEND` | `"postgres"` or `"sqlite"` |
| `GOCLAW_SQLITE_PATH` | SQLite DB path |
| `GOCLAW_PORT` | Override gateway port (Desktop) |
| `GOCLAW_TSNET_AUTH_KEY` | Tailscale auth key |

The `.env.local` file is automatically loaded if it exists alongside `config.json`. Environment variables take priority over config.json.

**`.env.local` example:**
```bash
GOCLAW_GATEWAY_TOKEN=my-secret-token
GOCLAW_POSTGRES_DSN=postgres://user:pass@localhost:5432/goclaw
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

---

## See Also

- [System Configuration (UI)](../admin/10-config.md)
- [TTS Configuration](../admin/08-tts.md)
- [WebSocket RPC — config methods](./02-websocket-rpc.md)
