# Đăng Nhập

**Route:** `/login`
**Quyền truy cập:** Công khai

## Hiển Thị
Form đăng nhập với hai tab: Token và Ghép nối thiết bị.

## Thao Tác
- **Đăng nhập Token** — xác thực bằng ID người dùng + token
- **Đăng nhập Ghép nối** — xác thực qua luồng phê duyệt ghép nối (tạo mã, chờ duyệt)
- Chuyển hướng về trang yêu cầu ban đầu sau khi đăng nhập thành công

## Tính Năng Phụ
- Hai tab: Token và Ghép nối
- Tab Ghép nối hiển thị mã cần phê duyệt từ trang Nodes

## Hộp Thoại

### Form Token
**Mở bằng:** Tab mặc định
**Trường nhập:** ID Người dùng (mặc định "system"), Token Gateway (mật khẩu)
**Thao tác:** **Kết nối** — xác thực, lưu token và điều hướng; lỗi 401 hiển thị "Thông tin không hợp lệ"

### Form Ghép Nối
**Mở bằng:** Tab "Ghép nối"
**Trường nhập:** ID Người dùng
**Trạng thái:** Chờ → Kết nối → Đang chờ duyệt → Đã duyệt
**Thao tác:**
- **Yêu cầu Truy cập** — mở WebSocket, nhận mã ghép nối, bắt đầu polling
- **Hủy** — đóng WebSocket, quay về trạng thái chờ
- Hiển thị mã 6 ký tự + lệnh CLI `goclaw pairing approve {mã}`
