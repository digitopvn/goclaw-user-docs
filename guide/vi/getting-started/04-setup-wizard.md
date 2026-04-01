# Setup Wizard và Dashboard Tổng Quan

## Tổng quan

Lần đầu truy cập Web Dashboard sau khi cài đặt, hệ thống hiển thị **Setup Wizard** 4 bước để cấu hình hệ thống từ đầu. Sau khi hoàn thành, chuyển sang trang **Tổng quan** — trung tâm giám sát hoạt động của gateway.

---

## Hướng dẫn — Setup Wizard

Route: `/setup`
Quyền truy cập: Đã đăng nhập

### Bước 1 — Cấu hình Provider

Thêm nhà cung cấp LLM đầu tiên.

| Trường | Mô tả |
|--------|-------|
| Loại provider | Chọn từ danh sách (Anthropic, OpenAI, OpenRouter, ...) |
| Tên | Tên hiển thị cho provider này |
| API Key | Khóa xác thực của provider |
| API Base | URL cơ sở (tùy chọn, dùng cho provider tự host) |

Nhấn **Tạo provider** để lưu và chuyển sang Bước 2.

### Bước 2 — Chọn Model

Chọn model mặc định cho provider vừa thêm.

- Chọn model từ combobox.
- Nhấn **Xác minh** — hệ thống gửi request kiểm tra (đếm ngược 30 giây).
- Sau khi xác minh thành công, nút **Tiếp tục** hiện ra.

### Bước 3 — Tạo Agent

Tạo agent đầu tiên.

| Trường | Mô tả |
|--------|-------|
| Biểu tượng | Emoji đại diện (tùy chọn) |
| Tên hiển thị | Tên hiển thị của agent |
| Khóa agent | Slug duy nhất (tự động sinh từ tên) |
| Cá tính agent | Mô tả vai trò, phong cách của agent |
| Loại | **Định sẵn** (shared context) hoặc **Mở** (per-user context) |
| Tự tiến hóa | Cho phép agent tự cập nhật SOUL.md |

Nhấn **Tạo agent** — hiện **Modal Triệu Hồi** với quả cầu động và tiến trình file theo thời gian thực.
- Thành công: nút **Tiếp tục** → chuyển Bước 4.
- Thất bại: nút **Thử lại** hoặc **Đóng**.

### Bước 4 — Kết nối Kênh (Tùy chọn)

Kết nối kênh nhắn tin (Telegram, Discord, Slack, ...).

| Trường | Mô tả |
|--------|-------|
| Loại channel | Chọn loại (Telegram, Discord, Slack, Feishu, Zalo, WhatsApp) |
| Tên | Tên hiển thị cho kênh này |
| Thông tin xác thực | Tùy theo loại (Bot Token, App ID, ...) |

Nhấn **Tạo channel** để kết nối — hiện **Modal Hoàn Thành Cài Đặt** với nút **Đến bảng điều khiển** → `/overview`.

Nhấn **Bỏ qua** để hoàn thành wizard không kết nối kênh (có thể thêm sau trong Settings).

Các tùy chọn khác trong wizard:
- **Đổi ngôn ngữ** — vi / en / zh
- **Chuyển tổ chức** — chọn tổ chức khác

---

## Giao diện — Dashboard Tổng Quan

Route: `/overview`
Nhóm Sidebar: Core
Quyền truy cập: Đã đăng nhập

Sau setup wizard, đây là trang chủ của hệ thống. Có hai tab chính.

### Tab Tổng quan

Hiển thị 5 thẻ thống kê:

| Thẻ | Nội dung |
|-----|----------|
| Request hôm nay | Tổng số request trong ngày |
| Token hôm nay | Tổng token đã dùng |
| Chi phí hôm nay | Ước tính chi phí LLM |
| Agent | Số lượng agent đang hoạt động |
| Channel | Số lượng kênh đã kết nối |

Các khu vực khác trên Tab Tổng quan:
- **Cảnh báo provider** — provider nào chưa cấu hình hoặc gặp lỗi
- **Tình trạng hệ thống** — trạng thái các thành phần chính
- **Máy khách đã kết nối** — danh sách WebSocket clients đang kết nối
- **Tác vụ định kỳ** — các tác vụ lịch trình sắp chạy
- **Yêu cầu gần đây** — log các request mới nhất
- **Mức sử dụng Quota** — mức độ sử dụng so với giới hạn
- **Thông tin phiên bản** — phiên bản GoClaw hiện tại

Trang tự động làm mới mỗi 30 giây.

### Tab Sử dụng

Phân tích chi tiết lượng sử dụng theo thời gian.

**Thao tác:**
- **Lọc** theo agent, provider, kênh, khoảng thời gian, độ chi tiết
- **Biểu đồ time-series** — lượng request theo thời gian
- **Phân tích** theo provider / model / kênh
- **Bảng dữ liệu** chi tiết
- **Xuất CSV** — tải dữ liệu sử dụng thô

---

## Ví dụ — Luồng setup hoàn chỉnh

```
Đăng nhập -> /login
  -> Chưa có Setup? -> /setup
    -> Bước 1: Thêm Anthropic provider + API key
    -> Bước 2: Chọn claude-sonnet-4-5, Xác minh OK
    -> Bước 3: Tạo agent "Assistant", type=open
    -> Bước 4: Bỏ qua kênh
  -> /overview (Dashboard)
```

---

## Lưu ý

- Có thể bỏ qua toàn bộ wizard bằng nút **Bỏ qua cài đặt và vào dashboard** ở bước bất kỳ.
- Sau khi bỏ qua, có thể quay lại cấu hình từng phần trong **Settings** (Providers, Channels, Agents).
- Tab Sử dụng trên Overview là nơi theo dõi chi phí LLM tổng quát — để xem chi tiết từng session, dùng trang **Sessions**.

---

## Xem thêm

- [Bắt đầu chat với agent](../chat-and-sessions/01-chat-co-ban.md)
- [Hiểu rõ hơn về agents](../agents/01-tong-quan-agents.md)
- [Cấu hình agent nâng cao](../agents/02-cau-hinh-agent.md)
