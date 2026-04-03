# Chi Tiết Tổ Chức (Admin)

**Route:** `/admin/tenants/:id`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Chủ sở hữu (Cross-tenant)

## Hiển Thị
Thẻ thông tin tổ chức (slug, trạng thái, ngày tạo) và phần quản lý người dùng với danh sách thành viên và vai trò.

## Thao Tác
- **Thêm người dùng** — hộp thoại chọn người dùng + vai trò
- **Xóa người dùng** — xác nhận
- **Làm mới danh sách người dùng**
- **Quay lại danh sách tổ chức**

## Hộp Thoại

### Thêm Người Dùng
**Trường:** ID Người dùng (UserPickerCombobox, cho phép nhập tùy chỉnh), Vai trò (chọn: chủ sở hữu / admin / operator / thành viên / người xem)
**Thao tác:** **Thêm Người dùng** | **Hủy**

### Xác Nhận Xóa Người Dùng
Hiển thị ID người dùng bị xóa
**Thao tác:** **Xóa Người dùng** (nguy hiểm) | **Hủy**
