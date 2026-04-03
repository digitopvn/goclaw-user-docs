# Chat Cơ Bản

![Khung chat](/images/khung-chat.png)

## Tổng quan

Giao diện Chat là trung tâm tương tác chính với AI agents trên Web Dashboard. Hỗ trợ gửi tin nhắn văn bản, đính kèm file, xem streaming response với tool call cards, và quản lý nhiều session song song.

Route: `/chat/:sessionKey?`
Nhóm Sidebar: Core
Quyền truy cập: Đã đăng nhập

---

## Giao diện

Giao diện chat gồm 3 khu vực chính:

- **Sidebar (trái)**: Danh sách session, nút tạo session mới, bộ chọn agent (AgentSelector dropdown)
- **Chat area (giữa)**: Luồng tin nhắn, streaming response, tool call cards, thinking blocks
- **Input bar (dưới)**: Ô nhập tin nhắn, nút đính kèm file, nút gửi
- **Bảng task nhóm (phải)**: Tự động mở khi agent đang chạy nhiệm vụ nhóm (team tasks)

Trên mobile: sidebar bị ẩn, nhấn icon menu để mở. Bàn phím ảo trên iOS/Android được xử lý tự động để input bar không bị che.

---

## Hướng dẫn

### Tạo session mới

1. Mở sidebar (trên mobile: nhấn icon menu).
2. Chọn agent từ dropdown **AgentSelector** — hiện danh sách tất cả agent.
3. Nhấn nút **Trò chuyện mới** (icon `+`).
4. URL cập nhật thành `/chat/{sessionKey}` — session được tạo tự động khi gửi tin nhắn đầu tiên.

Session key có định dạng `agent:{agentId}:{channel}:direct:{userId}`. Mỗi agent có namespace session riêng biệt.

### Gửi tin nhắn

- Nhập nội dung vào input bar, nhấn **Enter** (hoặc nút Gửi tin nhắn) để gửi.
- Hỗ trợ **Markdown** trong nội dung nhập: `**bold**`, `*italic*`, backtick code, list.
- Đính kèm file: kéo thả hoặc nhấn icon đính kèm tệp — file được upload qua `/v1/media/upload` và đường dẫn tự động inject vào tin nhắn.
- Input bar tự động tăng chiều cao theo nội dung nhập (multi-line).

### Xem streaming response

Khi agent xử lý, response được stream theo từng token:

| Thành phần | Mô tả |
|------------|-------|
| ThinkingBlock | Hiển thị khi agent đang suy nghĩ (Extended Thinking) — có thể ẩn/hiện |
| ToolCallCard | Thẻ hiển thị tên tool và kết quả (web_search, read_file, v.v.) |
| MessageBubble | Tích lũy text streaming, render Markdown sau khi hoàn thành |
| Typing indicator | Hiện ở cuối thread khi agent đang xử lý |

Response tự động cuộn xuống khi có tin nhắn mới (smooth scroll). Khi user tự cuộn lên, auto-scroll tạm dừng.

### Dừng response (Abort)

Khi agent đang chạy:
- Nút **Dừng tạo** hiển thị trong input area — nhấn để hủy request hiện tại (`chat.abort`).
- Nếu có nhiều agent con đang chạy (team tasks), trạng thái `isBusy` vẫn còn cho đến khi tất cả hoàn thành.
- Trên Telegram: dùng lệnh `/stop` để hủy run hiện tại, `/stopall` để hủy tất cả.

### Xem lịch sử chat

- Lịch sử được load từ `chat.history` khi chọn session.
- Cuộn lên để xem tin nhắn cũ.
- Session cũ được liệt kê trong sidebar, sắp xếp theo thời gian.
- **Chế độ chỉ đọc**: Session của người dùng khác hiển thị ở chế độ read-only (nếu được cấp quyền).

### Xóa session

1. Hover vào session trong sidebar để hiện icon Xóa.
2. Nhấn icon Xóa — xuất hiện dialog xác nhận.
3. Xác nhận để xóa vĩnh viễn (`sessions.delete`).

Lưu ý: Xóa session không thể phục hồi. Lịch sử tin nhắn bị xóa hoàn toàn.

---

## Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Enter` | Gửi tin nhắn |
| `Shift+Enter` | Xuống dòng mới trong input |
| `Escape` | Đóng sidebar (mobile) |

---

## Ví dụ

Bắt đầu chat với agent "Assistant":

```
1. Sidebar -> AgentSelector -> chọn "Assistant"
2. Nhấn Trò chuyện mới (+)
3. URL: /chat/agent:assistant-id:web:direct:system
4. Nhập: "Tóm tắt bài viết này cho tôi" + đính kèm file PDF
5. Nhấn Enter -> agent nhận file, xử lý, trả kết quả
```

---

## Lưu ý

- Mỗi agent có namespace session riêng — chuyển agent là chuyển session namespace, không thể dùng chung session cũ.
- Streaming chỉ hoạt động qua WebSocket RPC — đảm bảo kết nối WebSocket ổn định.
- Tool call cards hiển thị theo thời gian thực trong quá trình agent xử lý, giúp theo dõi agent đang làm gì.
- Trên các kênh ngoài (Telegram, Discord, ...), agent được gắn khi cấu hình kênh; người dùng không cần chọn agent.

---

## Xem thêm

- [Quản lý và tìm kiếm sessions](./02-session-management.md)
- [Chat qua Telegram, Discord, Slack](./03-channels.md)
- [Hiểu rõ về agents và skills](../agents/01-agents-overview.md)
