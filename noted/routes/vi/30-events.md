# Sự Kiện Thời Gian Thực

**Route:** `/events`
**Nhóm Sidebar:** Giám Sát
**Quyền truy cập:** Operator+

## Hiển Thị
Luồng sự kiện trực tiếp qua WebSocket theo thứ tự thời gian với danh mục, thời gian và payload.

## Thao Tác
- **Tạm dừng / Tiếp tục** — dừng/bắt đầu luồng trực tiếp
- **Xóa tất cả sự kiện** — xóa view hiện tại
- **Lọc theo danh mục** — pill: tất cả, team.task, team.message, agent, team.crud, agent_link
- **Lọc theo nhóm / người dùng / chat** — dropdown
- **Cuộn xuống dưới** — nút hành động nổi

## Tính Năng Phụ
- Tự động cuộn xuống khi sự kiện đến
- Subscription WebSocket thời gian thực
