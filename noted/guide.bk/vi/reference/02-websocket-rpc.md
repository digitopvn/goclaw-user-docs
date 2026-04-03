# WebSocket RPC

GoClaw sử dụng WebSocket JSON-RPC (protocol v3) làm control plane chính. Client kết nối tới `/ws`, xác thực qua frame `connect`, sau đó trao đổi request/response/event frames.

---

## Tổng Quan

- **URL kết nối:** `ws://<host>:<port>/ws`
- **Protocol version:** 3
- **Xác thực:** Frame `connect` bắt buộc là request đầu tiên sau khi upgrade
- **Định dạng:** JSON thuần túy, mỗi frame là một JSON object

---

## Kết Nối và Xác Thực

Sau khi WebSocket upgrade thành công (HTTP 101), request đầu tiên bắt buộc phải là `connect`:

```json
{
  "type": "req",
  "id": "client-gen-uuid",
  "method": "connect",
  "params": {
    "token": "gateway-token-hoac-api-key",
    "user_id": "external-user-id",
    "sender_id": "device-id-tuy-chon",
    "locale": "vi"
  }
}
```

**Response thành công:**
```json
{
  "type": "res",
  "id": "client-gen-uuid",
  "ok": true,
  "payload": {
    "protocol": 3,
    "role": "admin",
    "user_id": "user-123",
    "server": {"version": "1.0.0", "uptime": "2h30m"}
  }
}
```

**Luồng xác thực:** Gateway token so sánh timing-safe → role admin. Nếu không khớp, SHA-256 hash → tra cứu API key → role suy ra từ scopes. Pairing codes cũng được chấp nhận cho channel devices.

### Tham Số Kết Nối

| Tham số | Giá trị | Mô tả |
|---------|---------|-------|
| Read limit | 512 KB | Tự động đóng kết nối nếu vượt quá |
| Send buffer | 256 | Drop messages khi đầy |
| Read deadline | 60s | Reset mỗi message hoặc pong |
| Write deadline | 10s | Timeout mỗi lần ghi |
| Ping interval | 30s | Server keepalive |

---

## Định Dạng Frame

### Request Frame (Client → Server)

```json
{
  "type": "req",
  "id": "<client-gen-uuid>",
  "method": "<ten-method>",
  "params": { ... }
}
```

### Response Frame (Server → Client)

```json
{
  "type": "res",
  "id": "<khop-voi-request-id>",
  "ok": true,
  "payload": { ... }
}
```

Khi lỗi:
```json
{
  "type": "res",
  "id": "<khop-voi-request-id>",
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "permission denied",
    "details": "",
    "retryable": false,
    "retryAfterMs": 0
  }
}
```

### Event Frame (Server → Client)

```json
{
  "type": "event",
  "event": "<ten-event>",
  "payload": { ... },
  "seq": 42,
  "stateVersion": { ... }
}
```

---

## Methods — Theo Nhóm

### System

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `connect` | Handshake xác thực (phải là request đầu tiên) | — |
| `health` | Kiểm tra sức khỏe server và clients kết nối | Viewer |
| `status` | Số lượng agent/session/client nhanh | Viewer |

### Chat

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `chat.send` | Gửi message tới agent, nhận response (có thể streaming) | Operator |
| `chat.history` | Lấy lịch sử chat cho session | Viewer |
| `chat.abort` | Hủy agent invocations đang chạy | Operator |
| `chat.inject` | Inject message vào session transcript không kích hoạt agent | Operator |

**`chat.send` request:**
```json
{
  "message": "Xin chào agent",
  "agentId": "uuid-hoac-key",
  "sessionKey": "session-tuy-chon",
  "stream": true,
  "media": [{"type": "image", "url": "..."}]
}
```

Khi `stream: true`, intermediate events được phát: `chunk`, `tool.call`, `tool.result`, `run.started`, `run.completed`.

### Sessions

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `sessions.list` | Liệt kê sessions (có phân trang) | Viewer |
| `sessions.preview` | Lấy lịch sử session và tóm tắt | Viewer |
| `sessions.patch` | Cập nhật label, model, metadata | Operator |
| `sessions.delete` | Xóa session | Operator |
| `sessions.reset` | Xóa tất cả messages của session | Operator |

### Agents

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `agents.list` | Liệt kê tất cả agents | Viewer |
| `agent` | Lấy trạng thái một agent cụ thể | Viewer |
| `agent.wait` | Chờ agent hoàn thành | Viewer |
| `agent.identity.get` | Lấy identity agent (tên, emoji, avatar, description) | Viewer |
| `agents.create` | Tạo agent mới | Admin |
| `agents.update` | Cập nhật thuộc tính agent | Admin |
| `agents.delete` | Xóa agent | Admin |
| `agents.files.list` | Liệt kê context files của agent | Admin |
| `agents.files.get` | Đọc nội dung context file | Admin |
| `agents.files.set` | Ghi nội dung context file | Admin |

### Teams

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `teams.list` | Liệt kê tất cả teams | Admin |
| `teams.create` | Tạo team mới | Admin |
| `teams.get` | Lấy chi tiết team với members | Admin |
| `teams.update` | Cập nhật thuộc tính team | Admin |
| `teams.delete` | Xóa team | Admin |
| `teams.members.add` | Thêm agent vào team với role | Admin |
| `teams.members.remove` | Xóa agent khỏi team | Admin |
| `teams.tasks.list` | Liệt kê team tasks (có thể lọc) | Admin |
| `teams.tasks.get` | Lấy task với comments/events | Admin |
| `teams.tasks.create` | Tạo task | Admin |
| `teams.tasks.approve` | Chấp nhận task | Admin |
| `teams.tasks.reject` | Từ chối task | Admin |
| `teams.tasks.comment` | Thêm comment vào task | Admin |
| `teams.tasks.assign` | Gán task cho member | Admin |
| `teams.tasks.delete` | Xóa task | Admin |
| `teams.known_users` | Lấy danh sách user IDs trong team | Admin |
| `teams.scopes` | Lấy channel/chat scopes cho task routing | Admin |
| `teams.workspace.list` | Liệt kê workspace items | Admin |
| `teams.workspace.read` | Đọc nội dung workspace file | Admin |
| `teams.workspace.delete` | Xóa workspace item | Admin |

### Cron

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `cron.list` | Liệt kê cron jobs | Viewer |
| `cron.create` | Tạo job theo lịch | Operator |
| `cron.update` | Cập nhật cài đặt job | Operator |
| `cron.delete` | Xóa job | Operator |
| `cron.toggle` | Bật/tắt job | Operator |
| `cron.status` | Lấy trạng thái scheduler | Viewer |
| `cron.run` | Kích hoạt chạy ngay lập tức | Operator |
| `cron.runs` | Liệt kê lịch sử thực thi | Viewer |

**`cron.create` request:**
```json
{
  "name": "bao-cao-hang-ngay",
  "schedule": "every day at 09:00",
  "message": "Tạo báo cáo hàng ngày",
  "deliver": "channel",
  "channel": "telegram",
  "to": "chat-id",
  "agentId": "uuid"
}
```

### Skills

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `skills.list` | Liệt kê tất cả skills khả dụng | Viewer |
| `skills.get` | Lấy metadata và nội dung skill | Viewer |
| `skills.update` | Cập nhật metadata skill (chỉ DB-backed) | Operator |

### Config

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `config.get` | Lấy cấu hình hiện tại (secrets đã ẩn) | Viewer |
| `config.apply` | Thay thế toàn bộ config (optimistic locking qua `baseHash`) | Admin |
| `config.patch` | Cập nhật một phần config | Admin |
| `config.schema` | Lấy JSON schema để tạo form config | Viewer |

**`config.patch` request:**
```json
{
  "raw": "{gateway: {port: 9090}}",
  "baseHash": "sha256-cua-config-hien-tai"
}
```

### Channels

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `channels.list` | Liệt kê channels đã bật | Viewer |
| `channels.status` | Lấy trạng thái kết nối channel | Viewer |
| `channels.instances.list` | Liệt kê instances | Viewer |
| `channels.instances.get` | Lấy chi tiết instance | Viewer |
| `channels.instances.create` | Tạo instance | Admin |
| `channels.instances.update` | Cập nhật instance | Admin |
| `channels.instances.delete` | Xóa instance | Admin |

### Providers và Tools

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `providers.models` | Liệt kê models khả dụng từ tất cả providers | Viewer |

### API Keys

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `api_keys.list` | Liệt kê API keys (đã ẩn) | Admin |
| `api_keys.create` | Tạo API key mới | Admin |
| `api_keys.revoke` | Thu hồi API key | Admin |

### Pairing (Ghép Thiết Bị)

| Method | Mô tả | Auth |
|--------|-------|------|
| `device.pair.request` | Yêu cầu ghép cặp (từ thiết bị) | Chưa xác thực |
| `device.pair.approve` | Chấp nhận yêu cầu (từ admin) | Admin |
| `device.pair.deny` | Từ chối yêu cầu | Admin |
| `device.pair.list` | Liệt kê pending + đã ghép cặp | Admin |
| `device.pair.revoke` | Thu hồi thiết bị | Admin |
| `browser.pairing.status` | Kiểm tra trạng thái ghép cặp (poll) | Chưa xác thực |

### Exec Approvals

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `exec.approval.list` | Liệt kê lệnh đang chờ duyệt | Operator |
| `exec.approval.approve` | Chấp nhận lệnh (tùy chọn: luôn chấp nhận) | Operator |
| `exec.approval.deny` | Từ chối thực thi lệnh | Operator |

### Usage và Quotas

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `usage.get` | Lấy bản ghi sử dụng theo agent | Viewer |
| `usage.summary` | Lấy tổng hợp sử dụng token | Viewer |
| `quota.usage` | Lấy mức tiêu thụ quota | Viewer |

### Other

| Method | Mô tả | Role tối thiểu |
|--------|-------|---------------|
| `send` | Gửi message đi ra qua channel | Operator |
| `logs.tail` | Bật/tắt live log streaming | Admin |
| `delegations.list` | Liệt kê lịch sử delegation | Viewer |
| `delegations.get` | Lấy chi tiết delegation | Viewer |

---

## Streaming Events

Khi `chat.send` được gọi với `stream: true`, server đẩy events theo thứ tự:

| Event | Mô tả | Payload chính |
|-------|-------|--------------|
| `run.started` | Agent run bắt đầu | `runId`, `agentId` |
| `chunk` | Text streaming chunk | `content` (string) |
| `tool.call` | Tool invocation bắt đầu | `toolName`, `toolInput` |
| `tool.result` | Tool invocation hoàn thành | `toolName`, `result` |
| `run.completed` | Agent run kết thúc | `content`, `usage` |

### Events Đẩy Từ Server

| Event | Mô tả |
|-------|-------|
| `session.updated` | Session metadata thay đổi |
| `agent.updated` | Cấu hình agent thay đổi |
| `cron.fired` | Cron job được kích hoạt |
| `team.task.*` | Team task lifecycle events |
| `exec.approval.pending` | Lệnh đang chờ duyệt |

---

## Permission Matrix

| Role | Quyền truy cập |
|------|---------------|
| **Admin** | Tất cả methods |
| **Operator** | Đọc + ghi (chat, sessions, cron, approvals, send) |
| **Viewer** | Chỉ đọc (list, get, preview, status, history) |

**Methods chỉ Admin:** `config.apply`, `config.patch`, `agents.create`, `agents.update`, `agents.delete`, `channels.toggle`, `device.pair.approve`, `device.pair.deny`, `device.pair.revoke`, `teams.*`, `api_keys.*`

---

## Mã Lỗi

| Code | Mô tả |
|------|-------|
| `UNAUTHORIZED` | Xác thực thất bại hoặc không đủ role |
| `INVALID_REQUEST` | Trường thiếu, sai kiểu, hoặc method không tồn tại |
| `NOT_FOUND` | Tài nguyên không tồn tại |
| `ALREADY_EXISTS` | Tài nguyên đã tồn tại |
| `UNAVAILABLE` | Dịch vụ tạm thời không khả dụng |
| `RESOURCE_EXHAUSTED` | Vượt giới hạn rate limit |
| `AGENT_TIMEOUT` | Agent run vượt quá thời gian cho phép |
| `INTERNAL` | Lỗi server không mong đợi |

Response lỗi bao gồm `retryable` (boolean) và `retryAfterMs` (integer).

---

## Xem Thêm

- [HTTP REST API](./01-api-reference.md)
- [Cấu hình tham chiếu](./03-configuration.md)
- [Nodes — ghép thiết bị](../admin/12-nodes.md)
