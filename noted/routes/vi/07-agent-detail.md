# Chi Tiết Agent

**Route:** `/agents/:id`
**Nhóm Sidebar:** Core
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Trang chi tiết agent với 4 tab: Tổng quan, Files, Quyền, Instances (chỉ agent định sẵn).

## Thao Tác
- **Cập nhật cấu hình** — chỉnh sửa cài đặt agent
- **Tái tạo từ prompt** — xây dựng lại agent từ mô tả
- **Triệu hồi lại** — khởi tạo lại agent
- **Xóa agent** — hộp thoại xác nhận
- **Cài đặt nâng cao** — mở hộp thoại nâng cao
- **Cấu hình Heartbeat** — thiết lập kiểm tra sức khỏe
- **Quản lý Codex Pool** — điều hướng đến `/agents/:id/codex-pool`
- **Xem/chỉnh sửa files** — tab Files
- **Quản lý quyền** — tab Quyền

## Hộp Thoại

### Cài Đặt Nâng Cao
**Phần:** Chia sẻ workspace, Suy luận (chế độ, mức độ, dự phòng), Định tuyến ChatGPT OAuth, Nén ngữ cảnh, Cắt tỉa ngữ cảnh, Sandbox
**Thao tác:** **Lưu** | **Hủy**

### Cấu Hình Heartbeat
**Trường:** Bật/tắt, Chu kỳ (phút), Provider/Model ghi đè, Kênh, Chat ID, Giờ hoạt động, Múi giờ, Cài đặt nâng cao, Danh sách kiểm tra
**Thao tác:** **Chạy thử** | **Lưu** | **Hủy**

### Nhật Ký Heartbeat
Danh sách log phân trang — thời gian, trạng thái, token, thời lượng
**Thao tác:** Phân trang (Trước/Sau) | **Làm mới**

### Tái Tạo (Tab Files)
**Trường:** Prompt hướng dẫn (textarea)
**Thao tác:** **Tái tạo** | **Hủy**

### Tab Quyền (Form inline)
**Trường:** ID Người dùng, Loại cấu hình, Phạm vi, Quyền (cho phép/từ chối)
**Thao tác:** **Thêm (+)** — cấp quyền | **Xóa (X)** — thu hồi quyền
