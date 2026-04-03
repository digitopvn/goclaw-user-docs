# Cấu Hình Tham Chiếu

GoClaw đọc cấu hình từ file JSON5. Secrets được tách biệt khỏi config.json và chỉ đọc từ biến môi trường hoặc file `.env.local`.

---

## Tổng Quan

- **Định dạng:** JSON5 (hỗ trợ comment `//`, trailing commas, unquoted keys)
- **Vị trí mặc định:** `~/.goclaw/data/config.json` (Desktop) hoặc `./config.json` (Standard)
- **Biến môi trường ghi đè:** `GOCLAW_CONFIG` chỉ định đường dẫn tường minh
- **Nguyên tắc bảo mật:** Secrets (API keys, tokens, DSN) KHÔNG BAO GIỜ lưu trong `config.json`

**Ví dụ cơ bản:**
```json5
{
  // Gateway server settings
  gateway: {
    host: "0.0.0.0",
    port: 8080,
    token: "", // Để trống, sử dụng biến môi trường GOCLAW_GATEWAY_TOKEN
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

Điều khiển gateway server.

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `host` | string | `"0.0.0.0"` | Địa chỉ lắng nghe |
| `port` | int | `8080` | Cổng lắng nghe (Desktop: 18790) |
| `token` | string | `""` | Bearer token xác thực WS/HTTP (secret — dùng env) |
| `owner_ids` | []string | `[]` | Sender IDs được coi là "owner" |
| `allowed_origins` | []string | `[]` | WebSocket CORS whitelist (trống = cho phép tất cả) |
| `max_message_chars` | int | `32000` | Số ký tự tối đa của user message |
| `rate_limit_rpm` | int | `20` | Giới hạn request/phút mỗi user (0 = tắt) |
| `injection_action` | string | `"warn"` | Hành động khi phát hiện prompt injection: `log`, `warn`, `block`, `off` |
| `inbound_debounce_ms` | int | `1000` | Gộp rapid messages cùng sender (ms, -1 = tắt) |
| `block_reply` | *bool | `false` | Gửi text trung gian trong khi tool đang chạy |
| `tool_status` | *bool | `true` | Hiển thị tên tool trong streaming preview |
| `task_recovery_interval_sec` | int | `300` | Khoảng thời gian kiểm tra team task recovery (giây) |

### gateway.quota

Cấu hình quota request theo user/group.

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `enabled` | bool | Bật/tắt hệ thống quota |
| `default` | QuotaWindow | Giới hạn mặc định cho mỗi user |
| `providers` | map[string]QuotaWindow | Ghi đè theo provider (key = tên provider) |
| `channels` | map[string]QuotaWindow | Ghi đè theo channel (key = tên channel) |
| `groups` | map[string]QuotaWindow | Ghi đè theo group (key = userID) |

**QuotaWindow:**
```json5
{
  hour: 20,   // max requests/giờ (0 = không giới hạn)
  day: 100,   // max requests/ngày
  week: 500   // max requests/tuần
}
```

Thứ tự ưu tiên merge: Groups > Channels > Providers > Default.

---

## Section: channels

### channels.telegram

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bật kênh Telegram |
| `token` | string | `""` | Bot token (secret — dùng env) |
| `allow_from` | []string | `[]` | Whitelist sender IDs |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Yêu cầu @bot mention trong groups |
| `mention_mode` | string | `"strict"` | `"strict"` hoặc `"yield"` |
| `history_limit` | int | `50` | Số pending group messages tối đa cho context (0 = tắt) |
| `dm_stream` | *bool | `false` | Bật streaming cho DMs |
| `group_stream` | *bool | `false` | Bật streaming cho groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `media_max_bytes` | int64 | `20MB` | Kích thước tối đa tải media |
| `proxy` | string | `""` | URL proxy HTTP/SOCKS5 |
| `api_server` | string | `""` | Custom Telegram Bot API server URL |

### channels.discord

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bật kênh Discord |
| `token` | string | `""` | Bot token (secret — dùng env) |
| `allow_from` | []string | `[]` | Whitelist user IDs |
| `dm_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"allowlist"`, `"disabled"` |
| `require_mention` | *bool | `true` | Yêu cầu @bot mention |
| `history_limit` | int | `50` | Max pending messages cho context |
| `media_max_bytes` | int64 | `25MB` | Kích thước tối đa tải media |

### channels.slack

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `enabled` | bool | `false` | Bật kênh Slack |
| `bot_token` | string | `""` | `xoxb-...` Bot User OAuth Token (secret) |
| `app_token` | string | `""` | `xapp-...` App-Level Token Socket Mode (secret) |
| `dm_policy` | string | `"pairing"` | `"pairing"`, `"allowlist"`, `"open"`, `"disabled"` |
| `group_policy` | string | `"open"` | `"open"`, `"pairing"`, `"allowlist"`, `"disabled"` |
| `dm_stream` | *bool | `false` | Streaming cho DMs |
| `group_stream` | *bool | `false` | Streaming cho groups |
| `reaction_level` | string | `"off"` | `"off"`, `"minimal"`, `"full"` |
| `debounce_delay` | int | `300` | Ms delay trước khi xử lý rapid messages |
| `thread_ttl` | *int | `24` | Giờ trước khi thread participation hết hạn |

### Các Channel Khác

- **`channels.whatsapp`** — `enabled`, `bridge_url`, `allow_from`, `dm_policy`, `group_policy`
- **`channels.zalo`** — `enabled`, `token`, `allow_from`, `dm_policy`, `webhook_url`, `webhook_secret`
- **`channels.zalo_personal`** — `enabled`, `allow_from`, `dm_policy`, `group_policy`, `credentials_path`
- **`channels.feishu`** — `enabled`, `app_id`, `app_secret`, `domain` (`"lark"`/`"feishu"`), `connection_mode` (`"websocket"`/`"webhook"`)

### channels.pending_compaction

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `threshold` | `200` | Kích hoạt compaction khi entries vượt quá |
| `keep_recent` | `40` | Giữ lại số messages gần nhất sau compaction |
| `max_tokens` | `4096` | Max output tokens cho LLM summarization |
| `provider` | `""` | LLM provider (trống = dùng provider của agent) |

---

## Section: providers

API keys luôn đọc từ env vars — KHÔNG lưu trong `config.json`.

| Provider | Trường | Mô tả |
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
| `ollama` | `host` | Local Ollama (không cần API key) |
| `claude_cli` | `cli_path`, `model`, `perm_mode` | Claude CLI (dùng subscription) |
| `acp` | `binary`, `args`, `model`, `work_dir`, `idle_ttl`, `perm_mode` | ACP protocol agents |
| `dashscope` | `api_key`, `api_base` | Alibaba DashScope (Qwen) |
| `novita` | `api_key`, `api_base` | Novita AI |

---

## Section: tools

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `profile` | string | `"minimal"`, `"coding"`, `"messaging"`, `"full"` |
| `allow` | []string | Danh sách cho phép (tên tool hoặc `"group:xxx"`) |
| `deny` | []string | Danh sách chặn |
| `alsoAllow` | []string | Thêm vào mà không xóa existing |
| `rate_limit_per_hour` | int | Max tool executions/giờ/session (0 = tắt) |
| `scrub_credentials` | *bool | Tự động ẩn API keys/tokens trong tool output (mặc định true) |

### tools.execApproval

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `security` | `"full"` | `"deny"`, `"allowlist"`, `"full"` |
| `ask` | `"off"` | `"off"`, `"on-miss"`, `"always"` |
| `allowlist` | `[]` | Glob patterns cho lệnh được phép |

### tools.web_fetch

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `policy` | `"allow_all"` | `"allow_all"` hoặc `"allowlist"` |
| `allowed_domains` | `[]` | Ví dụ: `["github.com", "*.example.com"]` |
| `blocked_domains` | `[]` | Luôn kiểm tra bất kể policy |

### tools.browser

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `enabled` | `false` | Bật tool browser automation |
| `headless` | `false` | Chạy Chrome headless |
| `remote_url` | `""` | CDP endpoint cho remote Chrome |
| `action_timeout_ms` | `30000` | Timeout mỗi action (ms) |
| `idle_timeout_ms` | `600000` | Tự động đóng page khi idle (ms, 0 = tắt) |
| `max_pages` | `5` | Max open pages mỗi tenant |

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

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `scope` | string | `"per-sender"` | `"per-sender"` hoặc `"global"` |
| `dm_scope` | string | `"per-channel-peer"` | Phạm vi DM session |
| `main_key` | string | `"main"` | Key suffix cho main session |

**Giá trị `dm_scope`:**

| Giá trị | Mô tả |
|---------|-------|
| `"main"` | Tất cả DMs dùng chung một session |
| `"per-peer"` | Mỗi peer có session riêng (dùng chung giữa các channels) |
| `"per-channel-peer"` | Mỗi (channel, peer) cặp có session riêng (mặc định) |
| `"per-account-channel-peer"` | Thêm bot account vào key phân tách |

---

## Section: tts

| Trường | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `provider` | string | `""` | `"openai"`, `"elevenlabs"`, `"edge"`, `"minimax"` |
| `auto` | string | `"off"` | `"off"`, `"always"`, `"inbound"`, `"tagged"` |
| `mode` | string | `"final"` | `"final"` hoặc `"all"` |
| `max_length` | int | `1500` | Độ dài text tối đa trước khi cắt |
| `timeout_ms` | int | `30000` | Timeout API call (ms) |

**TTS Providers:**

| Provider | Trường cấu hình |
|----------|----------------|
| `tts.openai` | `api_key`, `api_base`, `model` (mặc định `"gpt-4o-mini-tts"`), `voice` (mặc định `"alloy"`) |
| `tts.elevenlabs` | `api_key`, `base_url`, `voice_id`, `model_id` |
| `tts.edge` | `enabled`, `voice` (mặc định `"en-US-MichelleNeural"`), `rate` |
| `tts.minimax` | `api_key`, `group_id`, `api_base`, `model`, `voice_id` |

---

## Section: agents.defaults

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `workspace` | `"~/agents"` | Thư mục workspace gốc |
| `restrict_to_workspace` | `false` | Giới hạn file access trong workspace |
| `provider` | `""` | Tên provider mặc định |
| `model` | `""` | Model mặc định |
| `max_tokens` | `8192` | Max output tokens |
| `temperature` | `0.7` | Nhiệt độ LLM |
| `max_tool_iterations` | `30` | Số lần lặp tool tối đa mỗi run |
| `context_window` | `200000` | Kích thước context window |
| `max_tool_calls` | `25` | Tổng số tool calls tối đa mỗi run (0 = không giới hạn) |
| `agent_type` | `"open"` | `"open"` hoặc `"predefined"` |

---

## Biến Môi Trường

| Biến | Mô tả |
|------|-------|
| `GOCLAW_CONFIG` | Đường dẫn tường minh đến file config.json |
| `GOCLAW_GATEWAY_TOKEN` | Bearer token xác thực gateway |
| `GOCLAW_POSTGRES_DSN` | PostgreSQL connection string |
| `GOCLAW_REDIS_DSN` | Redis connection string (tùy chọn) |
| `GOCLAW_STORAGE_BACKEND` | `"postgres"` hoặc `"sqlite"` |
| `GOCLAW_SQLITE_PATH` | Đường dẫn SQLite DB |
| `GOCLAW_PORT` | Ghi đè gateway port (Desktop) |
| `GOCLAW_TSNET_AUTH_KEY` | Tailscale auth key |

File `.env.local` được tự động load nếu tồn tại bên cạnh `config.json`. Biến môi trường có ưu tiên cao hơn config.json.

**Ví dụ `.env.local`:**
```bash
GOCLAW_GATEWAY_TOKEN=my-secret-token
GOCLAW_POSTGRES_DSN=postgres://user:pass@localhost:5432/goclaw
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

---

## Xem Thêm

- [Cấu hình Hệ Thống (UI)](../admin/10-config.md)
- [Cấu hình TTS](../admin/08-tts.md)
- [WebSocket RPC — config methods](./02-websocket-rpc.md)
