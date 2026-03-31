# Gioi Thieu GoClaw

## Tong quan

GoClaw la mot **AI agent gateway** viet bang Go — nen tang multi-tenant dung de trien khai va dieu phoi cac LLM-powered agent qua nhieu kenh nhan tin va giao thuc.

GoClaw la Go port cua [OpenClaw](https://github.com/openclaw/openclaw), duoc viet lai hoan toan voi:
- Bao mat nang cao (5 lop phong thu, AES-256-GCM)
- Multi-tenant PostgreSQL voi per-user workspace co lap
- Single binary ~25 MB, khoi dong duoi 1 giay, chay duoc tren VPS $5

Gateway tiep nhan tin nhan tu cac channel (Telegram, Discord, v.v.), dinh tuyen qua Agent Loop, goi LLM provider, thuc thi tool, roi tra ket qua ve nguoi dung.

---

## Tinh nang chinh

- **7 channels** — Telegram, Discord, Slack, Feishu/Lark, Zalo OA, Zalo Personal, WhatsApp
- **20+ LLM providers** — Anthropic (native HTTP+SSE), OpenAI, OpenRouter, Gemini, DeepSeek, Groq, Mistral, xAI, DashScope, Ollama, va nhieu hon
- **Agent teams & orchestration** — Shared task board, inter-agent delegation (sync/async), team mailbox
- **Tools & skills** — Filesystem, exec/shell, web search, memory, browser automation, TTS, media (tao anh/audio/video)
- **MCP** — Model Context Protocol bridge (stdio / SSE / streamable-HTTP)
- **Scheduling & cron** — `at`, `every`, cron expression voi lane-based concurrency
- **Bao mat** — Rate limiting, prompt injection detection, SSRF protection, RBAC (admin/operator/viewer), path traversal prevention
- **Tracing & observability** — LLM call tracing voi spans, prompt cache metrics, optional OpenTelemetry OTLP export
- **Extended thinking** — Anthropic budget tokens, OpenAI reasoning effort, DashScope thinking budget
- **Knowledge graph** — LLM extraction + traversal
- **Multi-tenant** — Per-user workspace, encrypted API keys, isolated sessions

---

## Kien truc tong quan

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
|              PostgreSQL  (hoac SQLite cho Lite)           |
|    Sessions  Agents  Memory  Skills  Traces  Teams  MCP   |
+----------------------------------------------------------+
```

---

## Hai phien ban

| Tinh nang | Lite (Desktop) | Standard (Server) |
|-----------|:--------------:|:-----------------:|
| Database | SQLite (local) | PostgreSQL |
| Agents | Toi da 5 | Khong gioi han |
| Teams | 1 team, 5 thanh vien | Khong gioi han |
| Memory | FTS5 text search | pgvector semantic |
| Channels | Khong ho tro | Telegram, Discord, Slack, Zalo, Feishu, WhatsApp |
| Knowledge Graph | Khong ho tro | Day du |
| RBAC / Multi-tenant | Khong ho tro | Day du |
| Cai dat | Script 1 dong (macOS/Windows) | Docker hoac binary |
| Auto-update | GitHub Releases | Docker / binary |

**Lite** phu hop de dung ca nhan tren may tinh, khong can server hay database rieng.

**Standard** danh cho trien khai production: phuc vu nhieu user, nhieu tenant, ket noi channel thuc te.

---

## Yeu cau he thong

### Standard (Server)

| Thanh phan | Yeu cau |
|------------|---------|
| Go | 1.26+ |
| PostgreSQL | 18+ voi extension pgvector |
| Docker | Tuy chon — dung cho sandbox va quick-start |
| Node.js | Tuy chon — can neu dung MCP server qua stdio |

RAM toi thieu: ~35 MB (idle). Chay duoc tren VPS $5.

### Lite (Desktop)

| Thanh phan | Yeu cau |
|------------|---------|
| macOS | Apple Silicon hoac Intel |
| Windows | 64-bit |
| Dung luong | ~30 MB |

Khong can Go, PostgreSQL, hay Docker.

---

## Xem them

- [02-cai-dat.md](./02-cai-dat.md) — Cai dat va khoi dong GoClaw (Standard + Lite)
- [03-dang-nhap.md](./03-dang-nhap.md) — Dang nhap va chon to chuc
