# Cấu Hình Hệ Thống

**Route:** `/config`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Owner (Cross-tenant)

---

## Tổng Quan

Trang cấu hình hệ thống cho phép quản trị viên chỉnh sửa toàn bộ `config.json` trực tiếp qua giao diện web. Cấu hình được phân thành 6 tab chuyên biệt, mỗi tab có nút Lưu riêng.

Hệ thống sử dụng kỹ thuật **optimistic locking** qua hash cấu hình — nếu nhiều người cùng chỉnh sửa, phiên biên sau sẽ báo lỗi conflict.

> **Cảnh báo:** Thay đổi trên trang này ảnh hưởng trực tiếp đến hoạt động của toàn bộ hệ thống. Đọc kỹ trước khi lưu.

---

## Giao Diện (UI)

**Route:** `/config`

Trình chỉnh sửa cấu hình với 6 tab dọc bên trái. Hiển thị:
- **Huy hiệu hash cấu hình** — mã hash hiện tại, dùng cho optimistic locking
- **Bảng cảnh báo** — nhắc nhở khi chọn các trường nhạy cảm
- **Nút Làm mới** — tải lại cấu hình từ server, bỏ qua các thay đổi chưa lưu

Các thay đổi được lưu riêng biệt theo từng tab. Nhấn **Lưu** sau khi chỉnh sửa xong mỗi tab.

---

## Hướng Dẫn Theo Tab

### Tab Máy Chủ (Server)

Điều khiển gateway server: địa chỉ lắng nghe, cổng, token xác thực, CORS, rate limit, debounce, và các chính sách xử lý tin nhắn.

Các trường quan trọng:

| Trường | Mô tả |
|--------|-------|
| `gateway.host` | Địa chỉ lắng nghe (mặc định `0.0.0.0`) |
| `gateway.port` | Cổng HTTP/WS (mặc định `8080`) |
| `gateway.token` | Bearer token — **dùng env var, không nhập trực tiếp** |
| `gateway.rate_limit_rpm` | Giới hạn request/phút/user (`0` = tắt) |
| `gateway.inbound_debounce_ms` | Gộp tin nhắn nhanh cùng sender (ms) |
| `gateway.injection_action` | Xử lý prompt injection: `log`, `warn`, `block`, `off` |
| `gateway.allowed_origins` | WebSocket CORS whitelist |

### Tab Hành Vi (Behavior)

Chính sách phân quyền và phạm vi phiên:

| Trường | Mô tả |
|--------|-------|
| `sessions.scope` | `per-sender` hoặc `global` |
| `sessions.dm_scope` | Phạm vi session DM (xem tài liệu cấu hình) |
| `gateway.block_reply` | Gửi text trung gian khi tool đang chạy |
| `gateway.tool_status` | Hiển thị tên tool trong preview streaming |

### Tab Mặc Định AI (AI Defaults)

Giá trị mặc định áp dụng cho tất cả agents khi không có cài đặt riêng:

| Trường | Mô tả |
|--------|-------|
| `agents.defaults.provider` | Provider LLM mặc định |
| `agents.defaults.model` | Model mặc định |
| `agents.defaults.max_tokens` | Max output tokens (mặc định `8192`) |
| `agents.defaults.temperature` | Nhiệt độ LLM (mặc định `0.7`) |
| `agents.defaults.max_tool_iterations` | Số lần lặp tool tối đa (mặc định `30`) |
| `agents.defaults.agent_type` | `open` hoặc `predefined` |

### Tab Hạn Mức (Quotas)

Cấu hình giới hạn sử dụng theo user, provider, channel, hoặc nhóm:

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

Thứ tự ưu tiên merge: Groups > Channels > Providers > Default.

### Tab Công Cụ (Tools)

Điều khiển tính khả dụng của tools:

| Trường | Mô tả |
|--------|-------|
| `tools.profile` | Profile toàn cục: `minimal`, `coding`, `messaging`, `full` |
| `tools.allow` / `tools.deny` | Danh sách cho phép / chặn theo tên hoặc nhóm |
| `tools.execApproval.security` | `deny`, `allowlist`, `full` |
| `tools.execApproval.ask` | Hỏi user trước khi chạy: `off`, `on-miss`, `always` |
| `tools.web_fetch.policy` | `allow_all` hoặc `allowlist` |
| `tools.browser.enabled` | Bật browser automation |

### Tab Tích Hợp (Integrations)

Các tích hợp hệ thống:

- **TTS** — liên kết nhanh đến trang `/tts`
- **Cron** — cấu hình scheduler (timezone, ...)
- **Telemetry** — cấu hình thu thập dữ liệu hiệu suất
- **Bindings** — kết nối đến các dịch vụ bên ngoài

---

## Cú Pháp JSON5

Trang config hỗ trợ JSON5 — định dạng mở rộng của JSON:

```json5
{
  // Đây là comment
  gateway: {
    port: 8080,      // trailing comma được phép
    host: "0.0.0.0",
  },
}
```

---

## Ví Dụ Cấu Hình Nhanh

**Bật rate limiting và quota:**
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

**Đổi model mặc định:**
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

## Lưu Ý

- Secrets (API keys, tokens, DSN) **không bao giờ** lưu trong `config.json` — dùng biến môi trường hoặc `.env.local`
- Hash cấu hình thay đổi mỗi lần lưu — giữ lại hash cũ nếu cần rollback thủ công
- Một số trường yêu cầu khởi động lại server để có hiệu lực
- `config.patch` qua WebSocket RPC cho phép cập nhật một phần mà không ảnh hưởng phần còn lại

---

## Xem Thêm

- [Cấu hình tham chiếu đầy đủ](../reference/03-cau-hinh.md)
- [Cấu hình TTS](../admin/08-tts.md)
- [WebSocket RPC — config methods](../reference/02-websocket-rpc.md)
