# Giới Thiệu GoClaw

## Tổng quan

GoClaw là một **AI agent gateway** viết bằng Go — nền tảng multi-tenant dùng để triển khai và điều phối các LLM-powered agent qua nhiều kênh nhắn tin và giao thức.

GoClaw là Go port của [OpenClaw](https://github.com/openclaw/openclaw), được viết lại hoàn toàn với:
- Bảo mật nâng cao (5 lớp phòng thủ, AES-256-GCM)
- Multi-tenant PostgreSQL với per-user workspace cô lập
- Single binary ~25 MB, khởi động dưới 1 giây, chạy được trên VPS $5

Gateway tiếp nhận tin nhắn từ các channel (Telegram, Discord, v.v.), định tuyến qua Agent Loop, gọi LLM provider, thực thi tool, rồi trả kết quả về người dùng.

---

## Tính năng chính

- **7 channels** — Telegram, Discord, Slack, Feishu/Lark, Zalo OA, Zalo Personal, WhatsApp
- **20+ LLM providers** — Anthropic (native HTTP+SSE), OpenAI, OpenRouter, Gemini, DeepSeek, Groq, Mistral, xAI, DashScope, Ollama, và nhiều hơn
- **Agent teams & orchestration** — Shared task board, inter-agent delegation (sync/async), team mailbox
- **Tools & skills** — Filesystem, exec/shell, web search, memory, browser automation, TTS, media (tạo ảnh/audio/video)
- **MCP** — Model Context Protocol bridge (stdio / SSE / streamable-HTTP)
- **Scheduling & cron** — `at`, `every`, cron expression với lane-based concurrency
- **Bảo mật** — Rate limiting, prompt injection detection, SSRF protection, RBAC (admin/operator/viewer), path traversal prevention
- **Tracing & observability** — LLM call tracing với spans, prompt cache metrics, optional OpenTelemetry OTLP export
- **Extended thinking** — Anthropic budget tokens, OpenAI reasoning effort, DashScope thinking budget
- **Knowledge graph** — LLM extraction + traversal
- **Multi-tenant** — Per-user workspace, encrypted API keys, isolated sessions

---

## Kiến trúc tổng quan

```
+----------------------------------------------------------+
|                        CHANNELS                           |
|  Telegram  Discord  Slack  Feishu  Zalo OA  Zalo WhatsApp|
+------------------------+---------------------------------+
                         |
+------------------------v---------------------------------+
|                       GATEWAY                             |
|         WebSocket RPC v3  +  HTTP API                     |
|         Rate Limiter  ->  Permission Engine (RBAC)        |
+------------------------+---------------------------------+
                         |
+------------------------v---------------------------------+
|                    AGENT LOOP                             |
|              Think  ->  Act  ->  Observe                  |
|    Scheduler (4 lanes: main / subagent / team / cron)     |
+-------------+---------------------------+----------------+
              |                           |
+-------------v-----------+  +-----------v---------------+
|      LLM PROVIDERS      |  |         TOOL REGISTRY     |
|  Anthropic  OpenAI ...  |  |  fs  exec  web  memory    |
|  20+ providers          |  |  teams  browser  TTS      |
+-------------------------+  +---------------------------+
                         |
+------------------------v---------------------------------+
|                     STORE LAYER                           |
|              PostgreSQL  (hoặc SQLite cho Lite)           |
|    Sessions  Agents  Memory  Skills  Traces  Teams  MCP   |
+----------------------------------------------------------+
```

---

## Hai phiên bản

| Tính năng | Lite (Desktop) | Standard (Server) |
|-----------|:--------------:|:-----------------:|
| Database | SQLite (local) | PostgreSQL |
| Agents | Tối đa 5 | Không giới hạn |
| Teams | 1 team, 5 thành viên | Không giới hạn |
| Memory | FTS5 text search | pgvector semantic |
| Channels | Không hỗ trợ | Telegram, Discord, Slack, Zalo, Feishu, WhatsApp |
| Knowledge Graph | Không hỗ trợ | Đầy đủ |
| RBAC / Multi-tenant | Không hỗ trợ | Đầy đủ |
| Cài đặt | Script 1 dòng (macOS/Windows) | Docker hoặc binary |
| Auto-update | GitHub Releases | Docker / binary |

**Lite** phù hợp để dùng cá nhân trên máy tính, không cần server hay database riêng.

**Standard** dành cho triển khai production: phục vụ nhiều user, nhiều tenant, kết nối channel thực tế.

---

## Yêu cầu hệ thống

### Standard (Server)

| Thành phần | Yêu cầu |
|------------|---------|
| Go | 1.26+ |
| PostgreSQL | 18+ với extension pgvector |
| Docker | Tùy chọn — dùng cho sandbox và quick-start |
| Node.js | Tùy chọn — cần nếu dùng MCP server qua stdio |

RAM tối thiểu: ~35 MB (idle). Chạy được trên VPS $5.

### Lite (Desktop)

| Thành phần | Yêu cầu |
|------------|---------|
| macOS | Apple Silicon hoặc Intel |
| Windows | 64-bit |
| Dung lượng | ~30 MB |

Không cần Go, PostgreSQL, hay Docker.

---

## Xem thêm

- [Cài đặt và khởi động GoClaw (Standard + Lite)](./02-cai-dat.md)
- [Đăng nhập và chọn tổ chức](./03-dang-nhap.md)
