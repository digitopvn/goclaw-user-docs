# Cấu Hình Agent

## Tổng quan

Trang chi tiết agent (`/agents/:id`) cung cấp đầy đủ công cụ để cấu hình model, behavior, sandbox, rate limits, và context files. Đây là trang dành cho admin và operator cần tinh chỉnh agent cho môi trường sản xuất.

Route: `/agents/:id`
Nhóm Sidebar: Core
Quyền truy cập: Đã đăng nhập (một số phần yêu cầu Admin)

---

## Giao diện chi tiết agent

Trang gồm 4 tab chính:

| Tab | Nội dung |
|-----|----------|
| Tổng quan | Cấu hình model, provider, behavior settings |
| Tệp | Context files (SOUL.md, IDENTITY.md, AGENTS.md, ...) |
| Phân quyền | Phân quyền per-user |
| Phiên bản người dùng | Chỉ hiện với predefined agent — danh sách per-user instances |

**Thao tác chính trên trang:**
- Cập nhật cấu hình agent
- Tái tạo từ prompt — xây dựng lại agent từ mô tả mới
- Triệu hồi lại — khởi tạo lại agent (chạy lại sinh context files)
- Xóa agent — hộp thoại xác nhận
- Cài đặt nâng cao — mở hộp thoại nâng cao
- Cấu hình Heartbeat — thiết lập kiểm tra sức khỏe
- Quản lý Codex Pool — điều hướng đến `/agents/:id/codex-pool`

---

## Hướng dẫn cấu hình

### Model và Provider

Trong tab **Tổng quan**:

| Trường | Mô tả |
|--------|-------|
| Provider | Tên provider đã đăng ký (ví dụ: `anthropic`, `openrouter`) |
| Model | Tên model cụ thể (ví dụ: `claude-sonnet-4-5-20250929`, `gpt-4o`) |
| Max Iterations | Số vòng lặp tối đa trong một lần chạy (mặc định: 20). Tăng nếu agent có nhiều tool calls phức tạp. |
| History Limit | Số user turn giữ lại trong lịch sử. Ngắn tiết kiệm token, dài giúp nhớ context. |

### Context Files (Tab Tệp)

Các file định nghĩa nhân cách và kiến thức của agent:

| File | Chức năng |
|------|-----------|
| `IDENTITY.md` | Tên, vai trò, nền tảng của agent. Đưa vào system prompt ở mức "primacy zone". |
| `SOUL.md` | System prompt chính — phong cách giao tiếp, giá trị, nguyên tắc xử lý. |
| `BOOTSTRAP.md` | Nếu tồn tại, agent chạy ngay lập tức khi khởi động (mandatory notice). |
| `AGENTS.md` | Mô tả các agent trong hệ thống để agent chính biết cách spawn sub-agent. |
| `TOOLS.md` | Tài liệu về các tool có sẵn cho agent. |

Có thể thêm file bất kỳ vào workspace. File được inject vào system prompt trong phần "Project Context" với defensive preamble bảo vệ agent khỏi bị manipulate bởi nội dung bên ngoài.

**Per-user context files** (open agents): Mỗi người dùng có thư mục `base/{userID}/` riêng. File `USER.md` được tạo tự động khi người dùng chat lần đầu — agent có thể cập nhật file này theo thời gian.

**Tái tạo từ prompt** (Tab Tệp):
1. Nhấn **Tái tạo từ prompt**.
2. Nhập mô tả vai trò mới vào textarea.
3. Nhấn **Tái tạo** — hệ thống sinh lại SOUL.md và các context files.

### Behavior Settings

| Thiết lập | Mô tả |
|-----------|-------|
| Debounce | Thời gian chờ (ms) trước khi xử lý tin nhắn trong group chat (tránh spam) |
| Streaming | Bật/tắt stream response theo từng chunk. Tắt giúp debug. |
| Tool Status | Hiển thị trạng thái tool call trong UI (tool.call / tool.result events) |
| Input Guard | Kích hoạt quét prompt injection (mặc định: `warn` — log nhưng không block) |

### Cài đặt nâng cao

Mở qua nút **Nâng cao**:

| Phần | Nội dung |
|------|----------|
| Chia sẻ workspace | Cấu hình chia sẻ workspace giữa các agent |
| Suy luận | Chế độ, mức độ, dự phòng cho Extended Thinking |
| Định tuyến ChatGPT OAuth | Cấu hình Codex Pool routing |
| Nén ngữ cảnh | Ngưỡng và chiến lược nén lịch sử hội thoại |
| Cắt tỉa ngữ cảnh | Loại bỏ các phần ngữ cảnh ít quan trọng |
| Sandbox | Cấu hình Docker sandbox cho code execution |

### Sandbox Mode

Chạy code trong Docker container để cách ly với máy chủ chính.

| Trường | Mô tả |
|--------|-------|
| Mode | `off` — không sandbox; `non-main` — chỉ sandbox sub-agent; `all` — sandbox mọi thứ |
| Workspace Access | `none` isolate hoàn toàn; `ro` mount read-only; `rw` read-write đầy đủ |
| Image | Docker image sử dụng (ví dụ: `goclaw-sandbox:bookworm-slim`) |
| Scope | `session` — 1 container/phiên; `agent` — dùng chung giữa các phiên; `shared` — chia sẻ mọi agent |
| Timeout | Thời gian tối đa (giây) cho mỗi lệnh chạy trong sandbox (mặc định: 300) |
| Memory | RAM tối đa (MB) cho container (mặc định: 512) |
| CPUs | Số CPU core (phân số được, ví dụ: 0.5) |
| Network | Bật/tắt truy cập mạng từ container |

Sandbox yêu cầu Docker cài trên máy chủ. Image phải được build sẵn.

### Rate Limits và Phân quyền (Tab Phân quyền)

- Giới hạn số lượng tool call trong khoảng thời gian (per hour/day/week).
- Áp dụng RBAC: `admin` / `operator` / `viewer`.
- Từ chối các tool cụ thể cho agent qua **Tool Policy**.

**Thêm quyền per-user:**
- Nhập ID Người dùng, Loại cấu hình, Phạm vi, Quyền (cho phép/từ chối).
- Nhấn **Thêm (+)** để cấp quyền.
- Nhấn **Xóa (X)** để thu hồi quyền.

### Heartbeat (Kiểm tra sức khỏe)

Nhấn **Cấu hình Heartbeat** để thiết lập:

| Trường | Mô tả |
|--------|-------|
| Bật/tắt | Bật/tắt heartbeat |
| Chu kỳ (phút) | Khoảng thời gian giữa các lần kiểm tra |
| Provider/Model ghi đè | Dùng provider/model khác cho heartbeat |
| Kênh | Kênh nhận thông báo |
| Chat ID | ID cuộc trò chuyện nhận thông báo |
| Giờ hoạt động | Khung giờ cho phép chạy heartbeat |
| Múi giờ | Múi giờ áp dụng |
| Danh sách kiểm tra | Các bước kiểm tra tùy chỉnh |

Nhấn **Chạy thử** để kiểm tra ngay lập tức. Xem lịch sử heartbeat qua **Nhật Ký Heartbeat**.

---

## Ví dụ — Cấu hình sandbox cho agent viết code

```
/agents/my-coder -> Nâng cao -> Sandbox:
  Mode: non-main
  Workspace Access: rw
  Image: goclaw-sandbox:bookworm-slim
  Scope: session
  Timeout: 120
  Memory: 1024
  Network: bật
-> Lưu
```

---

## Lưu ý

- Thay đổi Model/Provider ảnh hưởng ngay đến các session mới; session đang chạy không bị gián đoạn.
- Max Iterations quá thấp có thể làm agent dừng giữa chừng khi có nhiều tool calls phức tạp.
- Sandbox yêu cầu Docker daemon chạy trên máy chủ — kiểm tra `docker info` trước khi bật.
- Tab Phiên bản người dùng chỉ hiện với predefined agent — cho phép xem và quản lý context riêng của từng người dùng.

---

## Xem thêm

- [01-tong-quan-agents.md](./01-tong-quan-agents.md) — Khái niệm cơ bản về agents
- [03-skills.md](./03-skills.md) — Thêm skills cho agent
- [04-codex-pool.md](./04-codex-pool.md) — Cấu hình Codex Pool routing
