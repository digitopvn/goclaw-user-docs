# Danh Bạ Liên Hệ (Contacts)

## Tổng Quan

Trang Contacts hiển thị tất cả liên hệ từ các kênh kết nối (Telegram, Discord, Slack, v.v.). Dùng để quản lý, tìm kiếm và gộp liên hệ trùng lặp.

**Route:** `/contacts`
**Quyền truy cập:** Operator+

---

## Hướng Dẫn Sử Dụng

### Tìm Kiếm và Lọc Liên Hệ

- **Tìm kiếm theo tên / username / sender ID** — nhập từ khóa, bấm nút Submit
- **Lọc theo loại kênh** — dropdown chọn kênh (Telegram, Discord, Slack, v.v.)
- **Lọc theo loại ngang hàng** — Trực tiếp (DM) hoặc Nhóm (group)

### Gộp Liên Hệ Trùng Lặp

Khi cùng một người dùng xuất hiện trên nhiều kênh, có thể gộp thành một profile:

1. Chọn các liên hệ cần gộp (checkbox)
2. Nhấn **Gộp**
3. Chọn chế độ gộp:
   - **Liên kết với người dùng có sẵn** — chọn user từ combobox
   - **Tạo người dùng mới** — nhập tên + ID mới
4. Nhấn **Gộp**

### Tách Gộp

Khi tất cả liên hệ đã chọn đều đã được gộp, nút **Tách** xuất hiện — dùng để hoàn tác việc gộp.

---

## Giao Diện (UI)

### Trang Danh Sách (`/contacts`)

**Hiển thị:** Bảng phân trang các liên hệ từ tất cả kênh với các cột:
- Tên hiển thị
- Tên đăng nhập (username)
- ID gửi (Sender ID)
- Loại kênh
- Loại ngang hàng (trực tiếp / nhóm)
- Lần hoạt động cuối

**Thao tác:**
- Ô chọn (checkbox) cho chọn hàng loạt
- **Tìm kiếm** — tìm kiếm bằng nút Submit
- **Lọc theo loại kênh** — dropdown
- **Lọc theo loại ngang hàng** — trực tiếp / nhóm
- **Gộp** — kết hợp liên hệ trùng lặp
- **Tách** — hiển thị khi tất cả đã chọn đều đã được gộp

**Hộp thoại Gộp Danh Bạ:**
- Chế độ (radio): Liên kết với người dùng có sẵn (combobox) hoặc Tạo người dùng mới (tên + ID)
- Thao tác: **Gộp** | **Hủy**

---

## Ví Dụ

### Gộp Liên Hệ Đa Kênh

Người dùng "Nguyễn Văn A" nhắn tin qua Telegram (ID: 123456) và Discord (ID: abc#1234):

1. Tìm kiếm "Nguyễn Văn A" trong danh sách
2. Tick chọn cả hai dòng
3. Nhấn **Gộp**
4. Chọn **Tạo người dùng mới**, nhập tên "Nguyễn Văn A"
5. Nhấn **Gộp**

Kết quả: lịch sử chat từ cả hai kênh được gắn vào cùng một profile.

---

## Lưu Ý

- Cần quyền Operator trở lên mới truy cập trang Contacts
- Gộp liên hệ không xóa lịch sử chat — chỉ liên kết các sender ID với nhau
- Tách gộp chỉ khả dụng khi tất cả liên hệ đã chọn đều đã được gộp trước đó

---

## Xem Thêm

- [Quản lý đội nhóm](01-doi-nhom.md)
- [Cấu hình kênh kết nối](../admin/02-channels-setup.md)
