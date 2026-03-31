# Thông Tin Xác Thực CLI

**Route:** `/cli-credentials`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Admin

## Hiển Thị
Quản lý thông tin xác thực CLI cho các công cụ xác thực với gateway.

## Thao Tác
- **Tạo thông tin xác thực** — thêm mới
- **Chỉnh sửa thông tin xác thực** — cập nhật
- **Xóa thông tin xác thực** — xóa

## Hộp Thoại

### Form Thông Tin Xác Thực CLI (Tạo/Chỉnh sửa)
**Trường:** Preset (chọn, chỉ khi tạo), Tên binary (bắt buộc), Đường dẫn binary, Mô tả, Args bị từ chối (phân cách bằng dấu phẩy), Timeout, Verbose bị từ chối, Gợi ý, Agent ID, Bật/tắt, Biến môi trường (preset: ô nhập mật khẩu / thủ công: key-value editor)
**Thao tác:** **Tạo/Cập nhật** | **Hủy**

### Thông Tin Xác Thực Người Dùng CLI
**Chế độ xem danh sách:** ID người dùng với huy hiệu "env", nút chỉnh sửa/xóa
**Chế độ form:** Ô nhập ID người dùng + key-value editor cho biến môi trường
**Thao tác:** **Thêm** | **Quay lại** | **Lưu** | **Xóa** từng mục
