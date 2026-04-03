# Chi Tiết Công Việc Định Kỳ

**Route:** `/cron/:id`
**Nhóm Sidebar:** Khả Năng
**Quyền truy cập:** Đã đăng nhập

## Hiển Thị
Chi tiết đầy đủ: lịch, payload, agent đích, lịch sử chạy, trạng thái bật/tắt.

## Thao Tác
- **Chạy ngay** — thực thi thủ công ngay lập tức
- **Bật/tắt** — tạm dừng hoặc tiếp tục
- **Cập nhật cài đặt** — chỉnh sửa lịch, payload, agent
- **Xóa công việc** — xóa vĩnh viễn
- **Xem nhật ký chạy** — lịch sử thực thi có phân trang

## Hộp Thoại

### Nhật Ký Chạy
Danh sách nhập cuộn — thời gian, huy hiệu trạng thái (ok/thành công=xanh, lỗi/thất bại=đỏ), văn bản tóm tắt, lỗi
**Trạng thái trống:** "Không có lịch sử chạy"

### Cài Đặt Nâng Cao
**Trường:**
- **Lịch:** Múi giờ (IANA, mặc định UTC)
- **Giao hàng:** Gửi đến Kênh (switch) → Kênh + Đến; Đánh thức Heartbeat (switch)
- **Vòng đời:** Xóa Sau Khi Chạy (switch), Không Trạng Thái (switch)

**Thao tác:** **Lưu** | **Hủy**
