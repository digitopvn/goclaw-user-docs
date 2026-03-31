# Kênh

**Route:** `/channels`
**Nhóm Sidebar:** Kết Nối
**Quyền truy cập:** Admin

## Hiển Thị
Danh sách phân trang các kênh với chỉ báo trạng thái (trực tuyến/ngoại tuyến/đang kết nối) và tìm kiếm.

## Thao Tác
- **Tạo kênh** — trình hướng dẫn (các bước khác nhau theo loại kênh)
- **Chỉnh sửa kênh** — cập nhật cấu hình
- **Xóa kênh** — xác nhận (bị chặn với kênh mặc định)
- **Xác thực lại** — chạy lại luồng xác thực (vd: Zalo QR)
- **Xem chi tiết kênh** — điều hướng

## Hộp Thoại

### Form Kênh (Tạo/Chỉnh sửa) — Có thể 3 bước
**Bước 1 — Form:** Key (slug), Tên hiển thị, Loại kênh, Agent, Thông tin xác thực (động), Cấu hình (động), Bật/tắt
**Bước 2 — Xác thực:** Giao diện theo kênh (QR code, OAuth, v.v.) — **Bỏ qua** hoặc tự động chuyển tiếp
**Bước 3 — Cấu hình:** Cài đặt nhóm/chủ đề — **Bỏ qua** | **Xong**
**Thao tác Bước 1:** **Tạo/Cập nhật** | **Hủy**

### Cài Đặt Nâng Cao Kênh
**Nhóm trường:** Mạng, Giới hạn, Streaming, Hành vi, Kiểm soát truy cập
**Thao tác:** **Lưu** | **Hủy**

### Xác Nhận Xóa
**Trường:** Ô nhập xác nhận phải khớp chính xác tên kênh
**Thao tác:** **Xóa** (nguy hiểm) | **Hủy**
