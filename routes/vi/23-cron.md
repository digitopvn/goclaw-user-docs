# Công Việc Định Kỳ

**Route:** `/cron`
**Nhóm Sidebar:** Khả Năng
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Danh sách phân trang tất cả công việc định kỳ với tìm kiếm.

## Thao Tác
- **Tạo công việc định kỳ** — hộp thoại form
- **Chạy ngay** — kích hoạt thủ công ngay lập tức
- **Xóa công việc** — xác nhận
- **Xem chi tiết** — điều hướng đến trang chi tiết
- **Làm mới**

## Hộp Thoại

### Tạo Công Việc Định Kỳ
**Trường:**
- Tên (văn bản, bắt buộc, tự động tạo slug)
- Agent ID (chọn)
- Loại lịch (nhóm nút: every / cron / at)
  - **every:** Chu kỳ tính bằng giây (số, tối thiểu=1)
  - **cron:** Biểu thức Cron (vd: `0 * * * *`)
  - **at:** Một lần, đặt = hiện tại + 1 phút
- Tin nhắn (textarea, bắt buộc)

**Thao tác:** **Tạo** | **Hủy**
