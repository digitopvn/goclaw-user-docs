# Chi Tiết Nhà Cung Cấp

**Route:** `/providers/:id`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Admin

## Hiển Thị
Trang chi tiết nhà cung cấp LLM: trường cấu hình, API key (ẩn), cài đặt model, cấu hình nhúng và suy luận.

## Thao Tác
- **Chỉnh sửa cấu hình** — tên, API base, API key, model, v.v.
- **Xác minh API key** — kiểm tra kết nối
- **Xác minh model nhúng** — xác nhận endpoint hoạt động
- **Duyệt model có sẵn** — danh sách model từ provider
- **Đăng nhập OAuth** — cho provider OAuth (vd: ChatGPT OAuth)
- **Quản lý Codex Pool** — cấu hình định tuyến pool
- **Xóa provider**

## Hộp Thoại

### Cài Đặt Nâng Cao Provider
**Trường (theo loại):** URL API Base, đường dẫn binary/args/TTL/perm-mode/work-dir (ACP), cấu hình CLI, cấu hình OAuth
**Thao tác:** **Lưu** | **Hủy**

### Xác Nhận Xóa
**Thao tác:** **Xác nhận Xóa** (nguy hiểm) → quay lại danh sách | **Hủy**
