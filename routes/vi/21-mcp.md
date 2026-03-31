# Máy Chủ MCP

**Route:** `/mcp`
**Nhóm Sidebar:** Khả Năng
**Quyền truy cập:** Admin

## Hiển Thị
Bảng tích hợp MCP (Model Context Protocol): tên, loại vận chuyển (stdio/sse/http), số công cụ, số agent, trạng thái, người tạo.

## Thao Tác
- **Thêm máy chủ MCP** — hộp thoại có kiểm tra kết nối
- **Chỉnh sửa** — cập nhật cấu hình
- **Xóa** — xác nhận
- **Kết nối lại** — thiết lập lại kết nối
- **Quản lý cấp phép agent** — cấp/thu hồi truy cập theo agent với danh sách cho phép/từ chối
- **Xem công cụ** — danh sách công cụ của máy chủ
- **Quản lý thông tin xác thực người dùng** — lấy/đặt/xóa thông tin xác thực theo người dùng

## Hộp Thoại

### Form MCP (Thêm/Chỉnh sửa)
**Trường:** Tên, Tên hiển thị, Vận chuyển (stdio: lệnh+args | SSE/HTTP: URL+headers), Biến môi trường, Tiền tố công cụ, Timeout, Bật/tắt, Yêu cầu thông tin xác thực người dùng
**Thao tác:** **Kiểm tra kết nối** | **Tạo/Cập nhật** | **Hủy**

### Cấp Phép Agent
Danh sách cấp phép hiện có + form cấp: chọn agent, danh sách cho phép/từ chối (multi-select có tìm kiếm, dùng Portal tránh bị cắt)
**Thao tác:** **Cấp/Cập nhật** | **Thu hồi** mỗi cấp phép hiện có | **Hủy**

### Xem Công Cụ
Danh sách cuộn có lọc tìm kiếm — tên, mô tả, huy hiệu tiền tố (chỉ đọc)

### Thông Tin Xác Thực Người Dùng
**Trường:** Chọn người dùng, API Key, Headers (key-value, che giấu nhạy cảm), Biến môi trường
**Thao tác:** **Lưu** | **Xóa tất cả** | **Hủy**
