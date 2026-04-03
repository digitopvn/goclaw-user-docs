# Chi Tiết Nhóm Agent

**Route:** `/teams/:id`
**Nhóm Sidebar:** Core
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Trang chi tiết nhóm với quản lý thành viên và task.

## Thao Tác
- **Chỉnh sửa cấu hình nhóm**
- **Quản lý thành viên** — thêm/xóa, phân vai trò
- **Quản lý task** — xem, tạo, cập nhật, xóa task
- **Xóa nhóm**

## Hộp Thoại

### Hộp Thoại Thành Viên
Danh sách thành viên cuộn — emoji, tên, vai trò (trưởng/người đánh giá/thành viên)
**Thao tác:** **Thêm** (combobox agent định sẵn) | **Xóa (X)** mỗi thành viên (trừ trưởng)

### Hộp Thoại Thông Tin Nhóm
Hiển thị tên, trạng thái, mô tả, trưởng nhóm, số thành viên, tab cài đặt
**Thao tác:** Nhấp huy hiệu "v2 Super Team" → Modal Tính Năng (thông tin)

### Tạo Task
**Trường:** Chủ đề (bắt buộc), Mô tả, Loại (chung/ủy quyền/leo thang), Ưu tiên, Giao cho
**Thao tác:** **Tạo Task** | **Hủy**

### Chi Tiết Task
ID task, trạng thái, tiến trình (V2), banner theo dõi (V2), metadata, task bị chặn bởi, mô tả, kết quả, bình luận, timeline
**Thao tác:** **Xóa** (task hoàn thành) | **Thêm bình luận** | **Điều hướng task liên quan**

### Workspace Nhóm (90vh × 95vw)
Trình duyệt file — bộ lọc phạm vi, cây thư mục, trình xem nội dung file
**Thao tác:** **Tải lên** | **Tải xuống** | **Xóa** | **Di chuyển** (kéo thả) | **Làm mới**
