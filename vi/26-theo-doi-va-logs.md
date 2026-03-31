# 26 - Theo Doi va Logs

Huong dan xem traces, logs va thong ke su dung trong GoClaw.

---

## 1. Traces — Xem LLM Calls

Traces ghi lai toan bo hoat dong cua agent theo tung request: LLM calls, tool calls, token count, latency, cost.

### Xem Traces tren Web UI

1. Vao **Traces** trong menu chinh
2. Bo loc theo:
   - **Agent**: chon agent cu the
   - **User**: loc theo user ID
   - **Status**: `running` / `success` / `error` / `cancelled`
   - **Khoang thoi gian**: tu — den
3. Click vao mot trace de xem chi tiet

### Thong Tin Hien Thi

| Truong | Mo Ta |
|--------|-------|
| Duration | Thoi gian thuc hien tong cong |
| Input / Output tokens | Tong token LLM da dung |
| Cost | Chi phi uoc tinh (dua tren pricing cau hinh) |
| Status | Trang thai cuoi: success / error / cancelled |
| Tool calls | So luong tool duoc goi |

---

## 2. Trace Detail — Xem Chi Tiet Span

Moi trace bao gom nhieu span lon nhau theo thu bac:

```
Agent Span (root)
  LLM Call Span 1 — model, tokens, finish reason
  Tool Span: exec — ten tool, thoi gian
  LLM Call Span 2
  Tool Span: read_file
  LLM Call Span N
```

### Loai Span

| Loai | Mo Ta |
|------|-------|
| `agent` | Span goc, bao gom toan bo agent run |
| `llm_call` | Mot lan goi LLM provider |
| `tool_call` | Mot lan chay tool |
| `embedding` | Tao vector embedding |
| `event` | Su kien roi rac (khong co duration) |

### Prompt Cache Metrics

Voi cac model ho tro prompt caching (Anthropic Claude), span `llm_call` hien thi them:
- `cache_read_tokens` — token doc tu cache (re dung, gia thap hon)
- `cache_create_tokens` — token tao cache moi

### Verbose Mode

Mac dinh, span chi luu toi da 500 ky tu preview. De xem toan bo noi dung (system prompt, lich su, tool output):

```bash
GOCLAW_TRACE_VERBOSE=1
```

Verbose mode luu den 200KB cho moi input/output span. Dung cho debug LLM conversations.

---

## 3. Activity Logs — Su Kien He Thong

Activity logs ghi lai cac su kien van hanh: agent start/stop, session tao moi, kenh ket noi/ngat, cron job chay.

**Xem**: Thong tin hien thi trong traces va run logs. Logs he thong xuat ra stdout cua process GoClaw.

**Loc bao mat**: Tat ca su kien lien quan bao mat dung prefix `security.` — loc nhanh bang grep:

```bash
grep "security." goclaw.log
```

| Event | Y Nghia |
|-------|---------|
| `security.injection_detected` | Phat hien prompt injection |
| `security.injection_blocked` | Message bi chan do injection |
| `security.rate_limited` | Request bi gioi han |
| `security.cors_rejected` | Ket noi WebSocket bi tu choi |
| `security.message_truncated` | Message bi cat do qua dai |

---

## 4. Audit Logs — Nhat Ky Quan Tri

Cac thao tac quan tri duoc ghi lai de tra soat:

- Tao / thu hoi API key
- Thay doi cau hinh agent
- Duyet / tu choi browser pairing
- Thay doi RBAC va quyen truy cap
- Tao / xoa cron job

Thong tin ghi lai bao gom: ai thao tac (`created_by`), thoi diem, doi tuong bi tac dong.

---

## 5. Usage Stats — Thong Ke Su Dung

He thong tong hop thong ke theo gio vao bang `usage_snapshots`.

### Cac Chi So Theo Doi

| Chi So | Mo Ta |
|--------|-------|
| `request_count` | So luong agent runs |
| `error_count` | So runs that bai |
| `unique_users` | So user duy nhat |
| `input_tokens` | Tong token dau vao |
| `output_tokens` | Tong token dau ra |
| `total_cost` | Tong chi phi uoc tinh |
| `tool_call_count` | Tong so tool calls |
| `avg_duration_ms` | Thoi gian trung binh moi run |
| `llm_call_count` | So lan goi LLM theo model |
| `cache_read_tokens` | Token doc tu prompt cache |

### Cach Tinh Cost

```
Cost = (input_tokens x InputCostPerM) / 1,000,000
     + (output_tokens x OutputCostPerM) / 1,000,000
     + (cache_read_tokens x CacheReadCostPerM) / 1,000,000
     + (cache_create_tokens x CacheCreateCostPerM) / 1,000,000
```

Gia model cau hinh trong `config.ModelPricing`, key theo `provider/model`.

### Chu Ky Tong Hop

`SnapshotWorker` chay moi gio vao phut thu 5 (HH:05:00 UTC). Khi khoi dong, tu dong backfill cac gio bi bo lo.

---

## 6. OpenTelemetry — Export Ra Ngoai

GoClaw ho tro xuat spans den Jaeger, Grafana Tempo, Datadog qua OTLP.

### Cau Hinh OTel

Them vao `config.json`:

```json5
{
  "tracing": {
    "otel": {
      "endpoint": "localhost:4317",
      "protocol": "grpc",
      "insecure": true,
      "service_name": "goclaw-gateway",
      "headers": {}
    }
  }
}
```

| Tham So | Mo Ta |
|---------|-------|
| `endpoint` | OTLP endpoint (gRPC: port 4317, HTTP: port 4318) |
| `protocol` | `grpc` (mac dinh) hoac `http` |
| `insecure` | Bo qua TLS, dung cho moi truong dev |
| `service_name` | Ten service trong OTel (mac dinh: `goclaw-gateway`) |
| `headers` | Header bo sung (auth token, v.v.) |

Khi OTel duoc cau hinh, span duoc ghi ca vao PostgreSQL lan OTLP backend. Batch xu ly toi da 100 spans moi 5 giay.

**Luu y**: Bo package OTel (`internal/tracing/otelexport/`) tang ~15-20MB kich thuoc binary do phu thuoc gRPC/protobuf. Khong cau hinh OTel thi khong anh huong hieu nang.

---

## Xem Them

- [10-tracing-observability.md](../10-tracing-observability.md) — Chi tiet ky thuat tracing
- [09-security.md](../09-security.md) — Security logging convention
