# Quản Lý Sessions

## Tổng quan

Trang Sessions cho phép xem, tìm kiếm, và quản lý toàn bộ lịch sử hội thoại trong hệ thống. Trang chi tiết session hiển thị đầy đủ lịch sử tin nhắn, metadata, và các thao tác chỉnh sửa.

---

## Giao diện — Danh sách Sessions

Route: `/sessions`
Nhóm Sidebar: Hội Thoại
Quyền truy cập: Đã đăng nhập

Hiển thị bảng phân trang tất cả session với các cột:

| Cột | Nội dung |
|-----|----------|
| Session / Người dùng | Key session và tên hiển thị |
| Agent | Agent xử lý session này |
| Ngữ cảnh | Thanh bar: token ước tính so với cửa sổ + số lần nén |
| Tin nhắn | Tổng tin nhắn trong session |
| Cập nhật | Thời gian tin nhắn cuối cùng |

**Thao tác:**
- **Tìm kiếm** — theo key, nhãn, tên hiển thị, tên người dùng, tiêu đề chat
- **Xem chi tiết** — nhấn vào dòng để chuyển đến `/sessions/:key`

---

## Giao diện — Chi tiết Session

Route: `/sessions/:key`
Nhóm Sidebar: Hội Thoại
Quyền truy cập: Đã đăng nhập

Hiển thị toàn bộ lịch sử tin nhắn dạng bong bóng chat (người dùng / trợ lý / hệ thống).

**Metadata session** hiển thị phía trên:

| Trường | Mô tả |
|--------|-------|
| Agent | Agent xử lý session |
| Kênh | Kênh tin nhắn (web, telegram, discord, ...) |
| Người dùng | ID người dùng |
| Loại ngang hàng | Peer type của session |
| Token vào/ra | Tổng token đã tiêu thụ |

**Khối tóm tắt** (có thể mở rộng): Tóm tắt nội dung hội thoại nếu agent đã tạo.

---

## Hướng dẫn — Thao tác trên Session

### Chỉnh sửa tiêu đề

1. Trên trang chi tiết session, nhấn vào tiêu đề để chỉnh sửa inline.
2. Nhấn **Enter** hoặc icon tick (v) để lưu.
3. Nhấn **Escape** hoặc icon x để hủy.

### Đặt lại session

Xóa lịch sử hội thoại nhưng giữ lại session (không xóa session khỏi danh sách).

1. Nhấn nút **Đặt lại**.
2. Hiện dialog xác nhận — nhấn **Đặt lại**.
3. Lịch sử tin nhắn bị xóa, session vẫn còn.

### Xóa session

Xóa vĩnh viễn session và toàn bộ lịch sử.

1. Nhấn nút **Xóa**.
2. Hiện dialog xác nhận — nhấn **Xóa** (màu nguy hiểm).
3. Sau khi xóa, tự động chuyển về danh sách `/sessions`.

Cảnh báo: Xóa session không thể phục hồi.

---

## Ví dụ — Tìm kiếm session theo người dùng

```
/sessions
  -> Ô tìm kiếm: "user123"
  -> Hệ thống lọc các session của user123
  -> Nhấn vào session để xem lịch sử đầy đủ
```

---

## Lưu ý

- Thanh bar "ngữ cảnh" cho biết session sắp đầy context window — khi đầy, agent tự động nén lịch sử cũ.
- Số lần nén hiển thị trong thanh bar: càng nhiều lần nén, agent càng ít nhớ lịch sử cũ.
- Trang Sessions hiển thị tất cả session trong tenant (admin thấy tất cả, người dùng thường chỉ thấy session của mình tùy theo cấu hình RBAC).
- Để chat lại với session cũ, nhấn vào session trong sidebar của trang Chat.

---

## Xem thêm

- [Giao diện chat chính](./01-basic-chat.md)
- [Sessions qua các kênh ngoài](./03-channels.md)
