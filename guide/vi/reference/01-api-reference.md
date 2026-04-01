# Tham Chiếu HTTP REST API

GoClaw cung cấp HTTP REST API đầy đủ song song với WebSocket RPC. Tất cả endpoint được phục vụ trên cùng một cổng với gateway server.

Tài liệu tương tác có tại `/docs` (Swagger UI), spec raw tại `/docs/openapi.json`.

---

## Tổng Quan

- **Base URL:** `http://<host>:<port>` (mặc định port 18790 đối với Desktop, cấu hình qua `gateway.port`)
- **Versioning:** Tất cả endpoint bắt đầu bằng `/v1/`
- **Protocol:** HTTP/1.1, JSON request/response
- **Content-Type:** `application/json` cho request body
- **Encoding:** UTF-8

---

## Xác Thực (Authentication)

Tất cả endpoint (trừ `/health`) yêu cầu xác thực qua Bearer token trong header `Authorization`:

```
Authorization: Bearer <token>
```

Hai loại token được chấp nhận:

| Loại | Định dạng | Phạm vi |
|------|-----------|---------|
| Gateway token | Cấu hình trong `config.json` (trường `gateway.token`) | Admin toàn quyền |
| API key | `goclaw_` + 32 ký tự hex | Phạm vi giới hạn bởi scope của key |

API key được hash SHA-256 trước khi tra cứu — raw key không bao giờ được lưu trữ. Một số endpoint chấp nhận token qua query parameter `?token=<token>` (dùng cho `<img>` và `<audio>` tags).

### Headers Thường Gặp

| Header | Mục đích |
|--------|----------|
| `Authorization` | Bearer token xác thực |
| `X-GoClaw-User-Id` | User ID bên ngoài cho context multi-tenant |
| `X-GoClaw-Agent-Id` | Agent identifier cho tác vụ có phạm vi |
| `X-GoClaw-Tenant-Id` | Tenant scope — UUID hoặc slug |
| `Accept-Language` | Locale (`en`, `vi`, `zh`) cho thông báo lỗi i18n |
| `Content-Type` | `application/json` cho request body |

---

## Agents

CRUD quản lý agent. Yêu cầu header `X-GoClaw-User-Id` cho context multi-tenant.

| Method | Path | Mô tả | Auth |
|--------|------|-------|------|
| `GET` | `/v1/agents` | Liệt kê agents mà user truy cập được | Bearer |
| `POST` | `/v1/agents` | Tạo agent mới | Bearer |
| `GET` | `/v1/agents/{id}` | Lấy agent theo ID hoặc key | Bearer |
| `PUT` | `/v1/agents/{id}` | Cập nhật agent (chỉ owner) | Bearer |
| `DELETE` | `/v1/agents/{id}` | Xóa agent (chỉ owner) | Bearer |

### Agent Actions

| Method | Path | Mô tả |
|--------|------|-------|
| `POST` | `/v1/agents/{id}/wake` | Kích hoạt agent từ bên ngoài (n8n, orchestrators) |
| `POST` | `/v1/agents/{id}/regenerate` | Tạo lại cấu hình agent bằng LLM |
| `POST` | `/v1/agents/{id}/resummon` | Thử lại quá trình summoning ban đầu |

### Agent Files và Instances

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/agents/{id}/instances` | Liệt kê user instances |
| `GET` | `/v1/agents/{id}/instances/{userID}/files` | Liệt kê context files của user |
| `PUT` | `/v1/agents/{id}/instances/{userID}/files/{fileName}` | Cập nhật user file (chỉ USER.md) |

### Agent Sharing

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/agents/{id}/sharing` | Liệt kê shares của agent |
| `POST` | `/v1/agents/{id}/sharing` | Chia sẻ agent với user |
| `DELETE` | `/v1/agents/{id}/sharing/{userID}` | Thu hồi quyền truy cập |

---

## Sessions

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/sessions` | Liệt kê sessions (có phân trang) |

Chi tiết session được quản lý chủ yếu qua WebSocket RPC (xem `sessions.*` methods).

---

## Providers

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/providers` | Liệt kê LLM providers |
| `POST` | `/v1/providers` | Tạo provider mới |
| `GET` | `/v1/providers/{id}` | Lấy chi tiết provider |
| `PUT` | `/v1/providers/{id}` | Cập nhật cấu hình provider |
| `DELETE` | `/v1/providers/{id}` | Xóa provider |

---

## Tools

### Custom Tools

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/tools/custom` | Liệt kê tools (lọc theo `?agent_id=`) |
| `POST` | `/v1/tools/custom` | Tạo custom tool |
| `GET` | `/v1/tools/custom/{id}` | Lấy chi tiết tool |
| `PUT` | `/v1/tools/custom/{id}` | Cập nhật tool |
| `DELETE` | `/v1/tools/custom/{id}` | Xóa tool |
| `POST` | `/v1/tools/invoke` | Gọi trực tiếp tool không qua agent loop |

---

## MCP Servers

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/mcp/servers` | Liệt kê MCP servers đã đăng ký |
| `POST` | `/v1/mcp/servers` | Đăng ký MCP server mới |
| `GET` | `/v1/mcp/servers/{id}` | Lấy chi tiết server |
| `PUT` | `/v1/mcp/servers/{id}` | Cập nhật cấu hình server |
| `DELETE` | `/v1/mcp/servers/{id}` | Xóa MCP server |
| `POST` | `/v1/mcp/servers/{id}/grants/agent` | Cấp quyền truy cập cho agent |
| `DELETE` | `/v1/mcp/servers/{id}/grants/agent/{agentID}` | Thu hồi quyền agent |
| `GET` | `/v1/mcp/grants/agent/{agentID}` | Liệt kê MCP grants của agent |
| `POST` | `/v1/mcp/servers/{id}/grants/user` | Cấp quyền truy cập cho user |
| `DELETE` | `/v1/mcp/servers/{id}/grants/user/{userID}` | Thu hồi quyền user |
| `POST` | `/v1/mcp/requests` | Yêu cầu cấp quyền (user tự phục vụ) |
| `GET` | `/v1/mcp/requests` | Liệt kê yêu cầu đang chờ |
| `POST` | `/v1/mcp/requests/{id}/review` | Chấp nhận hoặc từ chối yêu cầu |

---

## Channels

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/channel-instances` | Liệt kê channel instances |
| `POST` | `/v1/channel-instances` | Tạo channel instance mới |
| `GET` | `/v1/channel-instances/{id}` | Lấy chi tiết instance |
| `PUT` | `/v1/channel-instances/{id}` | Cập nhật cấu hình instance |
| `DELETE` | `/v1/channel-instances/{id}` | Xóa channel instance |

---

## Skills

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/skills` | Liệt kê tất cả skills |
| `POST` | `/v1/skills/upload` | Upload ZIP chứa SKILL.md (tối đa 20 MB) |
| `GET` | `/v1/skills/{id}` | Lấy chi tiết skill |
| `PUT` | `/v1/skills/{id}` | Cập nhật metadata skill |
| `DELETE` | `/v1/skills/{id}` | Xóa skill (không áp dụng với system skills) |
| `POST` | `/v1/skills/{id}/toggle` | Bật/tắt skill |
| `GET` | `/v1/skills/{id}/versions` | Liệt kê phiên bản có sẵn |
| `GET` | `/v1/skills/{id}/files` | Liệt kê files trong skill |
| `POST` | `/v1/skills/{id}/grants/agent` | Cấp skill cho agent |
| `DELETE` | `/v1/skills/{id}/grants/agent/{agentID}` | Thu hồi skill khỏi agent |
| `GET` | `/v1/agents/{agentID}/skills` | Liệt kê skills với trạng thái grant của agent |

---

## Files

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/files` | Liệt kê workspace files |
| `GET` | `/v1/files/{path}` | Phục vụ nội dung file |
| `DELETE` | `/v1/storage/{path}` | Xóa workspace file |
| `POST` | `/v1/media/upload` | Upload media file |
| `GET` | `/v1/media/{id}` | Phục vụ media file |

---

## Config, Usage, Traces, Audit

| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/v1/usage` | Lấy metrics sử dụng |
| `GET` | `/v1/usage/summary` | Lấy tổng hợp sử dụng |
| `GET` | `/v1/traces` | Liệt kê traces (lọc theo agent, user, status, ngày) |
| `GET` | `/v1/traces/{id}` | Lấy chi tiết trace với tất cả spans |
| `GET` | `/v1/activity` | Liệt kê audit logs hoạt động |
| `GET` | `/v1/api-keys` | Liệt kê API keys (đã che) |
| `POST` | `/v1/api-keys` | Tạo API key mới |
| `DELETE` | `/v1/api-keys/{id}` | Thu hồi API key |
| `GET` | `/v1/delegations` | Liệt kê lịch sử delegation (phân trang) |
| `GET` | `/v1/delegations/{id}` | Lấy chi tiết delegation |
| `GET` | `/v1/memory` | Lấy memory entries |
| `POST` | `/v1/memory` | Tạo memory entry |
| `DELETE` | `/v1/memory/{id}` | Xóa memory entry |

---

## OpenAI-Compatible Endpoint

### `POST /v1/chat/completions`

Tương thích với OpenAI Chat API để truy cập agent theo chương trình.

**Request:**
```json
{
  "model": "goclaw:agent-id-hoac-key",
  "messages": [
    {"role": "user", "content": "Xin chào"}
  ],
  "stream": false,
  "user": "user-id-tuy-chon"
}
```

Quy tắc phân giải agent: trường `model` với prefix `goclaw:` hoặc `agent:`, sau đó header `X-GoClaw-Agent-Id`, sau đó agent `"default"`.

**Response (non-streaming):**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "choices": [{
    "index": 0,
    "message": {"role": "assistant", "content": "..."},
    "finish_reason": "stop"
  }],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
```

**Streaming:** Đặt `"stream": true` để nhận Server-Sent Events (SSE) với `data: {...}` chunks, kết thúc bằng `data: [DONE]`.

### `POST /v1/responses`

Alternative protocol tương thích với OpenAI Responses API. Cung cấp xác thực tương tự, trả về response objects có cấu trúc (`response.started`, `response.delta`, `response.done`).

---

## Rate Limiting

Token bucket rate limiting theo user hoặc IP. Cấu hình qua `gateway.rate_limit_rpm` (0 = tắt, > 0 = bật).

- **Burst:** 5 requests
- **HTTP 429** khi vượt giới hạn, kèm header `Retry-After: 60`
- **Cleanup:** mỗi 5 phút, xóa entries không hoạt động quá 10 phút

---

## Mã Lỗi (Error Codes)

| Code | Mô tả |
|------|-------|
| `UNAUTHORIZED` | Xác thực thất bại hoặc không đủ quyền |
| `INVALID_REQUEST` | Trường thiếu hoặc không hợp lệ trong request |
| `NOT_FOUND` | Tài nguyên không tồn tại |
| `ALREADY_EXISTS` | Tài nguyên đã tồn tại (conflict) |
| `UNAVAILABLE` | Dịch vụ tạm thời không khả dụng |
| `RESOURCE_EXHAUSTED` | Vượt giới hạn rate limit |
| `FAILED_PRECONDITION` | Điều kiện tiên quyết chưa được đáp ứng |
| `AGENT_TIMEOUT` | Agent run vượt quá giới hạn thời gian |
| `INTERNAL` | Lỗi server không mong đợi |

Response lỗi bao gồm trường `retryable` (boolean) và `retryAfterMs` (integer) để hướng dẫn client retry.

---

## Xem Thêm

- [WebSocket RPC](./02-websocket-rpc.md)
- [Cấu hình tham chiếu](./03-configuration.md)
- Swagger UI trực tiếp: `http://<host>:<port>/docs`
