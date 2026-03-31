# Cau Hinh Tham Chieu

GoClaw doc cau hinh tu file JSON5. Secrets duoc tach biet khoi config.json va chi doc tu bien moi truong hoac file `.env.local`.

---

## Tong Quan

- **Dinh dang:** JSON5 (ho tro comment `//`, trailing commas, unquoted keys)
- **Vi tri mac dinh:** `~/.goclaw/data/config.json` (Desktop) hoac `./config.json` (Standard)
- **Bien moi truong ghi de:** `GOCLAW_CONFIG` chi dinh duong dan tuong minh
- **Nguyen tac bao mat:** Secrets (API keys, tokens, DSN) KHONG BAO GIO luu trong `config.json`

**Vi du co ban:**
```json5
{
  // Gateway server settings
  gateway: {
    host: "0.0.0.0",
    port: 8080,
    token: "", // De trong, su dung bien moi truong GOCLAW_GATEWAY_TOKEN
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

Dieu khien gateway server.

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `host` | string | `"0.0.0.0"` | Dia chi lang nghe |
| `port` | int | `8080` | Cong lang nghe (Desktop: 18790) |
| `token` | string | `""` | Bearer token xac thuc WS/HTTP (secret — dung env) |
| `owner_ids` | []string | `[]` | Sender IDs duoc coi la "owner" |
| `allowed_origins` | []string | `[]` | WebSocket CORS whitelist (trong = cho phep tat ca) |
| `max_message_chars` | int | `32000` | So ky tu toi da cua user message |
| `rate_limit_rpm` | int | `20` | Gioi han request/phut moi user (0 = tat) |
| `injection_action` | string | `"warn"` | Hanh dong khi phat hien prompt injection: `log`, `warn`, `block`, `off` |
| `inbound_debounce_ms` | int | `1000` | Gop rapid messages cung sender (ms, -1 = tat) |
| `block_reply` | *bool | `false` | Gui text trung gian trong khi tool dang chay |
| `tool_status` | *bool | `true` | Hien thi ten tool trong streaming preview |
| `task_recovery_interval_sec` | int | `300` | Khoang thoi gian kiem tra team task recovery (giay) |

### gateway.quota

Cau hinh quota request theo user/group.

| Truong | Kieu | Mo ta |
|--------|------|-------|
| `enabled` | bool | Bat/tat he thong quota |
| `default` | QuotaWindow | Gioi han mac dinh cho moi user |
| `providers` | map[string]QuotaWindow | Ghi de theo provider (key = ten provider) |
| `channels` | map[string]QuotaWindow | Ghi de theo channel (key = ten channel) |
| `groups` | map[string]QuotaWindow | Ghi de theo group (key = userID) |

**QuotaWindow:**
```json5
{
  hour: 20,   // max requests/gio (0 = khong gioi han)
  day: 100,   // max requests/ngay
  week: 500   // max requests/tuan
}
```

Thu tu uu tien merge: Groups > Channels > Providers > Default.

---

## Section: channels

### channels.telegram

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bat kenh Telegram |
| `token` | string | `""` | Bot token (secret — dung env) |
| `allow_from` | []string | `[]` | Whitelist sender IDs |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Yeu cau @bot mention trong groups |
| `mention_mode` | string | `"strict"` | `"strict"` hoac `"yield"` |
| `history_limit` | int | `50` | So pending group messages toi da cho context (0 = tat) |
| `dm_stream` | *bool | `false` | Bat streaming cho DMs |
| `group_stream` | *bool | `false` | Bat streaming cho groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `media_max_bytes` | int64 | `20MB` | Kich thuoc toi da tai media |
| `proxy` | string | `""` | URL proxy HTTP/SOCKS5 |
| `api_server` | string | `""` | Custom Telegram Bot API server URL |

### channels.discord

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bat kenh Discord |
| `token` | string | `""` | Bot token (secret — dung env) |
| `allow_from` | []string | `[]` | Whitelist user IDs |
| `dm_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Yeu cau @bot mention |
| `history_limit` | int | `50` | Max pending messages cho context |
| `media_max_bytes` | int64 | `25MB` | Kich thuoc toi da tai media |

### channels.slack

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bat kenh Slack |
| `bot_token` | string | `""` | `xoxb-...` Bot User OAuth Token (secret) |
| `app_token` | string | `""` | `xapp-...` App-Level Token Socket Mode (secret) |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"pairing"`, `"allowlist"`, `"disabled"` |
| `dm_stream` | *bool | `false` | Streaming cho DMs |
| `group_stream` | *bool | `false` | Streaming cho groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `debounce_delay` | int | `300` | Ms delay truoc khi xu ly rapid messages |
| `thread_ttl` | *int | `24` | Gio truoc khi thread participation het han |

### Cac Channel Khac

- **`channels.whatsapp`** — `enabled`, `bridge_url`, `allow_from`, `dm_policy`, `group_policy`
- **`channels.zalo`** — `enabled`, `token`, `allow_from`, `dm_policy`, `webhook_url`, `webhook_secret`
- **`channels.zalo_personal`** — `enabled`, `allow_from`, `dm_policy`, `group_policy`, `credentials_path`
- **`channels.feishu`** — `enabled`, `app_id`, `app_secret`, `domain` (`"lark"`/`"feishu"`), `connection_mode` (`"websocket"`/`"webhook"`)

### channels.pending_compaction

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `threshold` | `200` | Kich hoat compaction khi entries vuot qua |
| `keep_recent` | `40` | Giu lai so messages gan nhat sau compaction |
| `max_tokens` | `4096` | Max output tokens cho LLM summarization |
| `provider` | `""` | LLM provider (trong = dung provider cua agent) |

---

## Section: providers

API keys luon doc tu env vars — KHONG luu trong `config.json`.

| Provider | Truong | Mo ta |
|----------|--------|-------|
| `anthropic` | `api_key`, `api_base` | Anthropic Claude |
| `openai` | `api_key`, `api_base` | OpenAI GPT |
| `openrouter` | `api_key`, `api_base` | OpenRouter |
| `gemini` | `api_key`, `api_base` | Google Gemini |
| `deepseek` | `api_key`, `api_base` | DeepSeek |
| `groq` | `api_key`, `api_base` | Groq |
| `mistral` | `api_key`, `api_base` | Mistral AI |
| `xai` | `api_key`, `api_base` | xAI Grok |
| `minimax` | `api_key`, `api_base` | MiniMax |
| `ollama` | `host` | Local Ollama (khong can API key) |
| `claude_cli` | `cli_path`, `model`, `perm_mode` | Claude CLI (dung subscription) |
| `acp` | `binary`, `args`, `model`, `work_dir`, `idle_ttl`, `perm_mode` | ACP protocol agents |
| `dashscope` | `api_key`, `api_base` | Alibaba DashScope (Qwen) |
| `novita` | `api_key`, `api_base` | Novita AI |

---

## Section: tools

| Truong | Kieu | Mo ta |
|--------|------|-------|
| `profile` | string | `"minimal"`, `"coding"`, `"messaging"`, `"full"` |
| `allow` | []string | Danh sach cho phep (ten tool hoac `"group:xxx"`) |
| `deny` | []string | Danh sach chan |
| `alsoAllow` | []string | Them vao ma khong xoa existing |
| `rate_limit_per_hour` | int | Max tool executions/gio/session (0 = tat) |
| `scrub_credentials` | *bool | Tu dong an API keys/tokens trong tool output (mac dinh true) |

### tools.execApproval

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `security` | `"full"` | `"deny"`, `"allowlist"`, `"full"` |
| `ask` | `"off"` | `"off"`, `"on-miss"`, `"always"` |
| `allowlist` | `[]` | Glob patterns cho lenh duoc phep |

### tools.web_fetch

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `policy` | `"allow_all"` | `"allow_all"` hoac `"allowlist"` |
| `allowed_domains` | `[]` | Vi du: `["github.com", "*.example.com"]` |
| `blocked_domains` | `[]` | Luon kiem tra bat ke policy |

### tools.browser

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `enabled` | `false` | Bat tool browser automation |
| `headless` | `false` | Chay Chrome headless |
| `remote_url` | `""` | CDP endpoint cho remote Chrome |
| `action_timeout_ms` | `30000` | Timeout moi action (ms) |
| `idle_timeout_ms` | `600000` | Tu dong dong page khi idle (ms, 0 = tat) |
| `max_pages` | `5` | Max open pages moi tenant |

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

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `scope` | string | `"per-sender"` | `"per-sender"` hoac `"global"` |
| `dm_scope` | string | `"per-channel-peer"` | Pham vi DM session |
| `main_key` | string | `"main"` | Key suffix cho main session |

**Gia tri `dm_scope`:**

| Gia tri | Mo ta |
|---------|-------|
| `"main"` | Tat ca DMs dung chung mot session |
| `"per-peer"` | Moi peer co session rieng (dung chung giua cac channels) |
| `"per-channel-peer"` | Moi (channel, peer) cap co session rieng (mac dinh) |
| `"per-account-channel-peer"` | Them bot account vao key phan tach |

---

## Section: tts

| Truong | Kieu | Mac dinh | Mo ta |
|--------|------|----------|-------|
| `provider` | string | `""` | `"openai"`, `"elevenlabs"`, `"edge"`, `"minimax"` |
| `auto` | string | `"off"` | `"off"`, `"always"`, `"inbound"`, `"tagged"` |
| `mode` | string | `"final"` | `"final"` hoac `"all"` |
| `max_length` | int | `1500` | Do dai text toi da truoc khi cat |
| `timeout_ms` | int | `30000` | Timeout API call (ms) |

**TTS Providers:**

| Provider | Truong cau hinh |
|----------|----------------|
| `tts.openai` | `api_key`, `api_base`, `model` (mac dinh `"gpt-4o-mini-tts"`), `voice` (mac dinh `"alloy"`) |
| `tts.elevenlabs` | `api_key`, `base_url`, `voice_id`, `model_id` |
| `tts.edge` | `enabled`, `voice` (mac dinh `"en-US-MichelleNeural"`), `rate` |
| `tts.minimax` | `api_key`, `group_id`, `api_base`, `model`, `voice_id` |

---

## Section: agents.defaults

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `workspace` | `"~/agents"` | Thu muc workspace goc |
| `restrict_to_workspace` | `false` | Gioi han file access trong workspace |
| `provider` | `""` | Ten provider mac dinh |
| `model` | `""` | Model mac dinh |
| `max_tokens` | `8192` | Max output tokens |
| `temperature` | `0.7` | Nhiet do LLM |
| `max_tool_iterations` | `30` | So lan lap tool toi da moi run |
| `context_window` | `200000` | Kich thuoc context window |
| `max_tool_calls` | `25` | Tong so tool calls toi da moi run (0 = khong gioi han) |
| `agent_type` | `"open"` | `"open"` hoac `"predefined"` |

---

## Bien Moi Truong

| Bien | Mo ta |
|------|-------|
| `GOCLAW_CONFIG` | Duong dan tuong minh den file config.json |
| `GOCLAW_GATEWAY_TOKEN` | Bearer token xac thuc gateway |
| `GOCLAW_POSTGRES_DSN` | PostgreSQL connection string |
| `GOCLAW_REDIS_DSN` | Redis connection string (tuy chon) |
| `GOCLAW_STORAGE_BACKEND` | `"postgres"` hoac `"sqlite"` |
| `GOCLAW_SQLITE_PATH` | Duong dan SQLite DB |
| `GOCLAW_PORT` | Ghi de gateway port (Desktop) |
| `GOCLAW_TSNET_AUTH_KEY` | Tailscale auth key |

File `.env.local` duoc tu dong load neu ton tai ben canh `config.json`. Bien moi truong co uu tien cao hon config.json.

**Vi du `.env.local`:**
```bash
GOCLAW_GATEWAY_TOKEN=my-secret-token
GOCLAW_POSTGRES_DSN=postgres://user:pass@localhost:5432/goclaw
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

---

## Xem Them

- [Cau hinh He Thong (UI)](../admin/10-config.md)
- [Cau hinh TTS](../admin/08-tts.md)
- [WebSocket RPC — config methods](./02-websocket-rpc.md)
