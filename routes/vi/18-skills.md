# Skills (Kỹ Năng)

**Route:** `/skills`
**Nhóm Sidebar:** Khả Năng
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Bảng hai tab: Core (hệ thống) và Tùy chỉnh (do người dùng tải lên). Cột: tên, mô tả, tác giả, trạng thái, khả năng hiển thị, thao tác. Bảng thiếu dependencies hiển thị ở trên cùng.

## Thao Tác
- **Tải lên skill** — hộp thoại tải file (tạo mới hoặc cập nhật)
- **Chỉnh sửa metadata** — tên, mô tả, khả năng hiển thị, thẻ
- **Xóa skill** — xác nhận
- **Bật/tắt** — switch mỗi skill
- **Chuyển đổi khả năng hiển thị** — nhấp badge để chuyển công khai → nội bộ → riêng tư
- **Quét lại dependencies** — quét tất cả skills
- **Cài đặt dependency đơn lẻ**
- **Xem chi tiết skill** — phiên bản, files, nội dung
- **Ghi đè theo tổ chức** — bật/tắt skill cho tổ chức hiện tại

## Hộp Thoại

### Tải Lên Skill
**Trường:** Vùng kéo thả (file `.zip`) — trạng thái mỗi file: đang xác thực → hợp lệ/không hợp lệ → đang tải → thành công/lỗi
**Thao tác:** **Tải lên [N]** | **Xong** | **Hủy** | **Xóa (X)** mỗi file

### Chỉnh Sửa Skill
**Trường:** Tên, Mô tả, Khả năng hiển thị, Thẻ (thêm/xóa)
**Thao tác:** **Lưu** | **Hủy**

### Chi Tiết Skill
**Tab:** Nội dung (README markdown) | Files (chọn phiên bản, cây file, trình xem nội dung)
**Thao tác:** Chọn phiên bản | Nhấp file để xem | **Sao chép** nội dung

### Bảng Thiếu Dependencies (Inline)
**Thao tác:** **Cài đặt** từng dep | Liên kết "Đến Packages"

### Ghi Đè Theo Tổ Chức (Inline)
**Thao tác:** Toggle bật/tắt | **Đặt lại (X)** để xóa ghi đè
