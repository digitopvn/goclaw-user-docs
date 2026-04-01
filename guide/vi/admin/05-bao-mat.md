# Bảo Mật và Phân Quyền

## Tổng Quan

GoClaw áp dụng bảo mật theo chiều sâu (defense-in-depth) với 5 lớp độc lập. Phân quyền dựa trên RBAC 3 cấp. API keys hỗ trợ phạm vi giới hạn cho tích hợp bên ngoài.

**Route API keys:** `/api-keys` — Admin
**Route phê duyệt:** `/approvals` — Operator+

---

## Hướng Dẫn

### Xác Thực (Authentication)

3 phương thức, ưu tiên theo thứ tự:

1. **Gateway token** — token chính trong `config.json` (`gateway.token`), cấp quyền Admin toàn hệ thống
2. **API key** — khóa có phạm vi giới hạn, cấp quyền theo scopes
3. **Browser pairing** — trình duyệt được cấp quyền qua QR/code, cấp quyền Operator (chỉ HTTP)

Sử dụng: `Authorization: Bearer <token>`

> Nếu không cấu hình gateway token, hệ thống chấp nhận tất cả request không xác thực (dev mode).

### Tạo API Key

1. Vào **System > API Keys > Tạo API Key** (cần quyền Admin)
2. Điền:
   - **Tên** (bắt buộc)
   - **Tổ chức** (chọn, chỉ chủ sở hữu)
   - **Phạm vi** (6 checkbox): `operator.admin` / `.read` / `.write` / `.approvals` / `.pairing` / `.provision`
   - **Thời hạn**: Không giới hạn / 7 / 30 / 90 ngày
3. Nhấn **Tạo** → hiển thị key đầy đủ + **Sao chép**

> **Quan trọng:** Sao chép key ngay — chỉ hiển thị 1 lần duy nhất khi tạo.

**Thu hồi:** Danh sách API Keys > click **Thu hồi** — mất hiệu lực ngay lập tức.

**Bảo mật lưu trữ:** Raw key không bao giờ lưu trong database — chỉ lưu SHA-256 hash. Xác thực dùng `ConstantTimeCompare` tránh timing attack. Cache in-memory 5 phút.

### RBAC — 3 Cấp Quyền

| Role | Cấp | Quyền Chính |
|------|:---:|-------------|
| Viewer | 1 | Xem agents, sessions, skills, trạng thái hệ thống |
| Operator | 2 | Viewer + gửi chat, quản lý sessions, chạy cron jobs, cập nhật skills |
| Admin | 3 | Operator + sửa cấu hình, tạo/xóa agents, quản lý kênh, duyệt device pairing |

### Scopes cho API Key

| Scope | Quyền |
|-------|-------|
| `operator.admin` | Toàn quyền, tương đương gateway token |
| `operator.read` | Chỉ đọc (Viewer) |
| `operator.write` | Đọc + ghi (Operator) |
| `operator.approvals` | Duyệt/từ chối lệnh shell |
| `operator.pairing` | Quản lý browser device pairing |

### Phê Duyệt Lệnh Shell (`/approvals`)

Khi exec ask mode là `on-miss` hoặc `always`, lệnh shell cần được admin duyệt:

- **Cho phép một lần** — phê duyệt lần thực thi này
- **Luôn cho phép** — thêm lệnh vào danh sách cho phép vĩnh viễn
- **Từ chối** — từ chối lệnh

Timeout: 2 phút. Quá timeout, lệnh bị từ chối tự động.

---

## Giao Diện (UI)

### Trang API Keys (`/api-keys`)

**Hiển thị:** Bảng API keys: tên, tiền tố (8 ký tự đầu), phạm vi, tổ chức, trạng thái (hoạt động/thu hồi/hết hạn), ngày hết hạn, lần dùng cuối.

**Thao tác:** Tạo API key | Thu hồi | Sao chép key mới tạo | Xem ví dụ mã (curl/TypeScript/Go) | Tìm kiếm | Làm mới

**Hộp thoại Tạo Key:** Tên (bắt buộc), Tổ chức, Phạm vi (6 checkbox), Thời hạn. **Tạo** → hiển thị key + **Sao chép** | **Hủy**

**Hộp thoại Ví Dụ Mã:** Tab curl / TypeScript / Go — hiển thị code với tô sáng cú pháp. **Sao chép** mỗi tab (chỉ đọc).

### Trang Phê Duyệt (`/approvals`)

**Hiển thị:** Danh sách yêu cầu phê duyệt shell đang chờ: ID agent, lệnh, thời gian.

**Thao tác:** Cho phép một lần | Luôn cho phép | Từ chối | Làm mới

---

## 5 Lớp Bảo Vệ

| Lớp | Cơ Chế | Chi Tiết |
|-----|--------|---------|
| 1 - Transport | CORS, giới hạn kích thước | WS kiểm tra `allowed_origins`; WS max 512KB; HTTP body max 1MB |
| 2 - Input | Phát hiện injection | 6 mẫu: ignore_instructions, role_override, system_tags, instruction_injection, null_bytes, delimiter_escape |
| 3 - Tool | Shell deny, path traversal, SSRF | Cấm lệnh nguy hiểm, kiểm tra thư mục, bảo vệ DNS rebinding |
| 4 - Output | Scrub credentials | Xóa token LLM, GitHub, AWS, connection strings khỏi output |
| 5 - Isolation | Workspace per-user, Docker sandbox | Mỗi user có thư mục riêng; shell có thể chạy trong container |

### Input Guard — Phát Hiện Injection

6 mẫu bị quét trước khi xử lý:

| Mẫu | Ví Dụ Bị Phát Hiện |
|-----|-------------------|
| `ignore_instructions` | "ignore all previous instructions" |
| `role_override` | "you are now...", "pretend you are..." |
| `system_tags` | `<system>`, `[SYSTEM]`, `[INST]` |
| `instruction_injection` | "new instructions:", "override:" |
| `null_bytes` | Ký tự `\x00` |
| `delimiter_escape` | `</instructions>`, "end of system" |

Hành động (`gateway.injection_action`): `off` / `log` / `warn` (mặc định) / `block`.

### Shell Deny Patterns (Luôn Áp Dụng)

| Nhóm | Ví Dụ |
|------|-------|
| Xóa file nguy hiểm | `rm -rf`, `del /f`, `rmdir /s` |
| Thao tác đĩa | `mkfs`, `dd if=`, ghi vào `/dev/sd*` |
| Lệnh hệ thống | `shutdown`, `reboot`, `poweroff` |
| Fork bomb | `:(){ ... };:` |
| Remote code execution | `curl \| sh`, `wget -O - \| sh` |
| Reverse shell | `/dev/tcp/`, `nc -e` |
| Eval injection | `eval $()`, `base64 -d \| sh` |

### SSRF Protection

URL kiểm tra 3 bước trước khi fetch:
1. Hostname bị chặn: `localhost`, `*.local`, `*.internal`, `metadata.google.internal`
2. Dải IP nội bộ: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`
3. DNS pinning: resolve domain, kiểm tra từng IP kết quả kể cả redirect target

### Mã Hóa AES-256-GCM

| Dữ Liệu | Bảng | Cột |
|---------|------|-----|
| API key LLM provider | `llm_providers` | `api_key` |
| API key MCP server | `mcp_servers` | `api_key` |
| Env vars custom tool | `custom_tools` | `env` |

Khóa mã hóa: biến môi trường `GOCLAW_ENCRYPTION_KEY`.
Format: `"aes-gcm:" + base64(12-byte nonce + ciphertext + GCM tag)`.

### Rate Limiting

| Tham Số | Mặc Định | Mô Tả |
|---------|----------|-------|
| `rate_limit_rpm` | 0 (tắt) | Request tối đa/phút/user/IP |
| Burst | 5 | Cho phép vượt giới hạn tức thời |

Cấu hình trong `config.json`: `gateway.rate_limit_rpm`. Request vượt giới hạn: HTTP 429 hoặc WebSocket error.

---

## Lưu Ý

- Sao chép API key ngay sau khi tạo — không thể lấy lại sau
- Đổi gateway token làm vô hiệu toàn bộ session hiện tại
- Raw API key không lưu trong DB — chỉ SHA-256 hash

---

## Xem Thêm

- [Exec approval chi tiết](03-tools-va-mcp.md)
- [Security event logs](06-theo-doi.md)
