# Bộ Nhớ

**Route:** `/memory`
**Nhóm Sidebar:** Dữ Liệu
**Quyền truy cập:** Operator+

## Hiển Thị
Bảng tài liệu bộ nhớ: đường dẫn, agent (xem toàn cục), phạm vi (cá nhân/toàn cục), hash, ngày cập nhật. Huy hiệu trạng thái nhúng vector ở trên cùng.

## Thao Tác
- **Tạo tài liệu bộ nhớ** — hộp thoại
- **Xem nội dung** — hộp thoại
- **Xóa tài liệu** — xác nhận
- **Lập chỉ mục lại tài liệu** — nhúng lại một tài liệu
- **Lập chỉ mục tất cả** — nhúng lại hàng loạt
- **Tìm kiếm bộ nhớ** — hộp thoại tìm kiếm ngữ nghĩa
- **Lọc theo agent** | **Lọc theo phạm vi người dùng**

## Hộp Thoại

### Tạo Tài Liệu Bộ Nhớ
**Trường:** Agent, Chế độ phạm vi (Toàn cục/Hiện có/Tùy chỉnh), Đường dẫn, Nội dung (textarea), Tự động lập chỉ mục (switch)
**Thao tác:** **Tạo** | **Hủy**

### Xem Tài Liệu
**Tab:** Nội dung (đường dẫn, huy hiệu phạm vi, metadata, textarea có thể chỉnh sửa) | Chunks (các đoạn được lập chỉ mục với phạm vi dòng và trạng thái nhúng)
**Thao tác:** **Lưu** (tab Nội dung) | **Đóng**

### Tìm Kiếm Bộ Nhớ
**Trường:** Câu truy vấn (bắt buộc, tự động focus), Lọc theo ID người dùng (tùy chọn)
**Kết quả:** Đường dẫn, phạm vi dòng, thanh điểm tương đồng, phạm vi, đoạn trích
**Thao tác:** **Tìm kiếm** | **Đóng**
