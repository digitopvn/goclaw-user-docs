# Trình Hướng Dẫn Cài Đặt

**Route:** `/setup`
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Trình hướng dẫn 4 bước để khởi động hệ thống từ đầu.

## Thao Tác
- **Bước 1** — Cấu hình Provider (thêm nhà cung cấp LLM)
- **Bước 2** — Chọn Model (chọn và kiểm tra model)
- **Bước 3** — Tạo Agent (tạo agent đầu tiên)
- **Bước 4** — Kết nối Kênh (tùy chọn)
- **Bỏ qua** — bỏ qua toàn bộ trình hướng dẫn
- **Đổi ngôn ngữ** — vi / en / zh
- **Chuyển tổ chức** — chọn tổ chức khác

## Hộp Thoại

### Bước 1 — Provider
**Trường:** Loại Provider, Tên, API Key, API Base
**Thao tác:** **Tạo** → chuyển Bước 2

### Bước 2 — Model
**Trường:** Model (combobox)
**Thao tác:** **Xác minh** (đếm ngược 30s) → **Tiếp tục** (sau khi xác minh)

### Bước 3 — Agent
**Trường:** Emoji, Tên, Agent Key, Tính cách, Loại (Định sẵn/Mở), Tự tiến hóa
**Thao tác:** **Tạo** → mở Modal Triệu Hồi

### Bước 4 — Kênh
**Trường:** Loại Kênh, Tên, Thông tin xác thực (động theo loại)
**Thao tác:** **Tạo** → mở Modal Hoàn Thành | **Bỏ qua**

### Modal Triệu Hồi
Quả cầu động, tiến trình file, đồng hồ đếm thời gian
**Thao tác:** **Tiếp tục** (thành công) | **Thử lại** (thất bại) | **Đóng**

### Modal Hoàn Thành Cài Đặt
**Thao tác:** **Đến Bảng Điều Khiển** → `/overview`
