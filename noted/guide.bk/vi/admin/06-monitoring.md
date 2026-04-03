# Theo Dõi và Logs

## Tổng Quan

GoClaw cung cấp 5 công cụ theo dõi: Traces (LLM calls), Events (real-time), Activity (audit log), Logs (system log), và Usage Stats. Tất cả công cụ tập trung trong nhóm sidebar **Giám Sát**.

**Routes:**
- `/traces` — Operator+
- `/traces/:id` — Operator+
- `/events` — Operator+
- `/activity` — Operator+
- `/logs` — Admin

---

## Hướng Dẫn

### Xem Traces

Traces ghi lại toàn bộ hoạt động agent theo từng request: LLM calls, tool calls, token count, latency, cost.

1. Vào **Theo dõi** trong menu chính
2. Lọc theo: Agent, Kênh, Trạng thái (`running` / `success` / `error` / `cancelled`)
3. Click vào một trace để xem chi tiết

**Thông tin trace:**

| Trường | Mô Tả |
|--------|-------|
| Duration | Thời gian thực hiện tổng cộng |
| Input / Output tokens | Tổng token LLM đã dùng |
| Cost | Chi phí ước tính |
| Status | Trạng thái cuối |
| Tool calls | Số lượng tool được gọi |

**Dừng trace đang chạy:** Nhấn nút dừng trên dòng đang xử lý.

**Xuất trace:** Nút **Xuất trace** trong chi tiết trace → tải `trace-{id}.json.gz`.

### Trace Detail — Cây Span

Mỗi trace gồm nhiều span theo thứ bậc:

```
Agent Span (root)
  LLM Call Span 1 — model, tokens, finish reason
  Tool Span: exec
  LLM Call Span 2
  Tool Span: read_file
  LLM Call Span N
```

**Loại span:**

| Loại | Mô Tả |
|------|-------|
| `agent` | Span gốc, bao gồm toàn bộ agent run |
| `llm_call` | Một lần gọi LLM provider |
| `tool_call` | Một lần chạy tool |
| `embedding` | Tạo vector embedding |
| `event` | Sự kiện rời rạc (không có duration) |

**Prompt Cache Metrics** (Anthropic Claude): hiển thị `cache_read_tokens` và `cache_create_tokens` trong span `llm_call`.

**Verbose Mode** (xem toàn bộ nội dung): đặt biến môi trường `GOCLAW_TRACE_VERBOSE=1`. Lưu đến 200KB cho mỗi input/output span.

### Events — Sự Kiện Real-Time

**Route `/events`:** Luồng sự kiện trực tiếp qua WebSocket theo thứ tự thời gian.

- **Lọc theo category:** team.task / team.message / agent / team.crud / agent_link
- **Lọc theo nhóm / người dùng / chat** — dropdown
- **Tạm dừng / Tiếp tục** stream
- **Xóa tất cả sự kiện** — xóa view hiện tại

Sự kiện tự động cuộn xuống khi có sự kiện mới.

### Activity — Nhật Ký Quản Trị

**Route `/activity`:** Bảng nhật ký kiểm toán phân trang — hành động, người thực hiện, loại thực thể, ID thực thể, địa chỉ IP, thời gian.

- Lọc theo loại hành động (vd: `agent.created` / `agent.updated` / `agent.deleted`)
- Lọc theo loại thực thể
- Chỉ xem, không có thao tác thay đổi dữ liệu

**Các thao tác quản trị được ghi lại:**
- Tạo / thu hồi API key
- Thay đổi cấu hình agent
- Duyệt / từ chối browser pairing
- Thay đổi RBAC và quyền truy cập
- Tạo / xóa cron job

### Logs — Nhật Ký Hệ Thống

**Route `/logs`:** Trình xem nhật ký real-time, giao diện terminal tối.

Mỗi mục: thời gian, mức độ (debug/info/warn/error), nguồn, tin nhắn, thuộc tính.

**Thao tác:**
- Chọn mức độ trước khi bắt đầu theo dõi
- **Bắt đầu** — stream nhật ký trực tiếp
- **Dừng** — tạm dừng stream
- **Lọc theo mức độ** — pill: debug / info / warn / error
- **Tìm kiếm văn bản** — lọc theo từ khóa
- **Xóa nhật ký** — xóa view hiện tại

**Lọc sự kiện bảo mật** từ log file:
```bash
grep "security." goclaw.log
```

| Event | Ý Nghĩa |
|-------|---------|
| `security.injection_detected` | Phát hiện prompt injection |
| `security.injection_blocked` | Message bị chặn |
| `security.rate_limited` | Request bị giới hạn |
| `security.cors_rejected` | Kết nối WebSocket bị từ chối |
| `security.message_truncated` | Message bị cắt do quá dài |

---

## Giao Diện (UI)

### Trang Traces (`/traces`)

**Hiển thị:** Bảng phân trang: tên, trạng thái, thời lượng, token vào/ra + cache, số span, thời gian. Bộ lọc agent và kênh.

**Hộp thoại Chi Tiết Trace:**
- Header: Sao chép Trace ID | Xuất trace | Dừng (trace đang chạy)
- Lưới tóm tắt: Tên, Trạng thái, Thời lượng, Kênh, Token, Số span, Thời gian bắt đầu, Trace cha (có thể nhấn)
- Khối xem trước: input + sao chép | output + sao chép | khối lỗi (viền đỏ)
- Cây Span: huy hiệu loại, tên, token, cache/suy nghĩ, thời lượng, trạng thái. Nhấn span → bảng chi tiết: thời gian, model, phân tích token, metadata suy luận, xem trước vào/ra

### Trang Chi Tiết Trace (`/traces/:id`)

Mở dưới dạng hộp thoại trên trang `/traces`. Cây span có thể thu gọn. Phân tích thời gian và token theo span. **Điều hướng** trace trước/sau.

### Trang Events (`/events`)

Luồng sự kiện theo thời gian thực. Tự động cuộn xuống. Subscription WebSocket real-time.

### Trang Activity (`/activity`)

Bảng nhật ký kiểm toán phân trang. Chỉ xem.

### Trang Logs (`/logs`)

Giao diện terminal tối. Tự động cuộn xuống khi nhật ký mới đến. Chọn mức độ trước khi bắt đầu theo dõi.

---

## Usage Stats — Thống Kê Sử Dụng

Hệ thống tổng hợp thống kê theo giờ vào bảng `usage_snapshots`.

| Chỉ Số | Mô Tả |
|--------|-------|
| `request_count` | Số agent runs |
| `error_count` | Số runs thất bại |
| `unique_users` | Số user duy nhất |
| `input_tokens` / `output_tokens` | Tổng token |
| `total_cost` | Tổng chi phí ước tính |
| `tool_call_count` | Tổng số tool calls |
| `avg_duration_ms` | Thời gian trung bình mỗi run |
| `cache_read_tokens` | Token đọc từ prompt cache |

**Chu kỳ tổng hợp:** `SnapshotWorker` chạy mỗi giờ vào phút thứ 5 (HH:05:00 UTC). Khi khởi động, tự động backfill các giờ bị bỏ lỡ.

**Công thức tính cost:**
```
Cost = (input_tokens x InputCostPerM) / 1,000,000
     + (output_tokens x OutputCostPerM) / 1,000,000
     + (cache_read_tokens x CacheReadCostPerM) / 1,000,000
     + (cache_create_tokens x CacheCreateCostPerM) / 1,000,000
```

---

## OpenTelemetry — Export Ra Ngoài

Hỗ trợ xuất spans đến Jaeger, Grafana Tempo, Datadog qua OTLP.

Thêm vào `config.json`:
```json
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

| Tham Số | Mô Tả |
|---------|-------|
| `endpoint` | OTLP endpoint (gRPC: 4317, HTTP: 4318) |
| `protocol` | `grpc` (mặc định) hoặc `http` |
| `insecure` | Bỏ qua TLS cho môi trường dev |
| `service_name` | Mặc định: `goclaw-gateway` |

Khi OTel được cấu hình, span ghi cả vào PostgreSQL lẫn OTLP backend. Batch: tối đa 100 spans mỗi 5 giây.

> Lưu ý: package OTel tăng ~15-20MB kích thước binary. Không cấu hình OTel thì không ảnh hưởng hiệu năng.

---

## Lưu Ý

- Route `/logs` yêu cầu quyền Admin; các route khác yêu cầu Operator+
- Verbose mode (`GOCLAW_TRACE_VERBOSE=1`) có thể tăng dung lượng lưu trữ đáng kể
- Nhật ký hệ thống xuất ra stdout của process GoClaw

---

## Xem Thêm

- [Security events và injection detection](05-security.md)
- [Run log của cron jobs](04-cron.md)
