# Kênh Kết Nối (Channels)

## Tổng quan

GoClaw hỗ trợ 7 kênh nhắn tin để kết nối AI agent với các nền tảng nhắn tin phổ biến. Mỗi kênh hoạt động độc lập. Mỗi user trên mỗi kênh có session riêng biệt.

---

## 7 kênh hỗ trợ

| Kênh | Kiểu kết nối | Nhóm | DM | Streaming |
|------|--------------|------|----|-----------|
| Telegram | Long polling | Có | Có | Typing indicator |
| Discord | Gateway events | Có | Có | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Có | Có | Edit "Thinking..." |
| Feishu/Lark | WebSocket / Webhook | Có | Có | Streaming card |
| Zalo OA | Long polling | Không | Có | Không |
| Zalo Personal | Giao thức nội bộ (không chính thức) | Có | Có | Không |
| WhatsApp | WebSocket bridge ngoài | Có | Có | Không |

---

## Hướng dẫn sử dụng từng kênh

### Telegram

- **DM**: Nhắn tin trực tiếp với bot — được xử lý ngay lập tức.
- **Nhóm**: Bot phải được `@mention` trước khi trả lời (mặc định). Các tin nhắn trước khi mention được giữ lại làm ngữ cảnh (tối đa 50 tin).
- **Reply ngầm**: Reply vào tin nhắn của bot trong nhóm được coi là mention.
- **Voice/Audio**: Tin nhắn giọng nói được phiên âm qua STT proxy, nội dung được tiền tố `[audio: filename] Transcript: ...` trước khi gửi đến agent.
- **Forum topics**: Mỗi topic trong supergroup có session và cấu hình riêng.
- **Lệnh bot**: `/stop` hủy run hiện tại, `/stopall` hủy tất cả, `/reset` xóa lịch sử, `/help` hiện trợ giúp.

### Discord

- **DM**: Nhắn tin trực tiếp với bot.
- **Kênh**: Bot cần quyền `GuildMessages` + `MessageContent`; cần được `@mention` (mặc định).
- **Streaming**: Bot gửi tin nhắn "Thinking..." rồi chỉnh sửa khi có kết quả.
- **Giới hạn**: 2.000 ký tự mỗi tin nhắn — tự động chia nhỏ nếu vượt quá.
- **Typing indicator**: Keepalive 9 giây trong khi agent xử lý.

### Slack

- **DM**: Nhắn tin trực tiếp với bot.
- **Kênh**: Cần được `@mention`; sau khi bot reply trong thread, các tin nhắn tiếp theo trong thread đó tự động kích hoạt không cần mention (TTL 24 giờ).
- **Socket Mode**: Kết nối WebSocket — không cần public URL.
- **Streaming**: Edit-in-place via `chat.update`, throttle 1000ms (Slack Tier 3).
- **Reactions**: Emoji trạng thái trên tin nhắn người dùng (đang suy nghĩ, đang dùng tool, hoàn thành, lỗi).
- **Giới hạn**: 4.000 ký tự mỗi tin nhắn.

### Feishu/Lark

- **DM**: Nhắn tin trực tiếp với bot.
- **Nhóm**: Cần `@mention` (mặc định); có thể tắt requirement này theo từng kênh.
- **Streaming card**: Response được hiển thị trong interactive card với hiệu ứng in chữ đồng thời (throttle 100ms).
- **Topic session mode**: Khi bật, mỗi thread có session riêng biệt (session key: `{chatID}:topic:{rootMsgId}`).
- **Media**: Nhận/gửi ảnh, file, audio (mặc định tối đa 30 MB).
- **Kết nối**: WebSocket (mặc định) hoặc Webhook — có thể gắn trên cổng HTTP của gateway.

### Zalo OA (Official Account)

- Chỉ hỗ trợ DM — không có nhóm.
- Giới hạn 2.000 ký tự mỗi tin nhắn.
- Policy DM mặc định: `pairing` (yêu cầu xác thực bằng code).
- Hỗ trợ gửi ảnh (tối đa 5 MB).

### Zalo Personal

- Sử dụng giao thức không chính thức (reverse-engineered).
- Hỗ trợ cả DM lẫn nhóm.
- Policy mặc định: `allowlist` (chỉ chấp nhận người dùng trong danh sách cho phép).
- Cảnh báo: Tài khoản có thể bị Zalo khóa bất kỳ lúc nào do vi phạm điều khoản.

---

## Pairing flow (xác thực kết cặp)

Áp dụng khi kênh sử dụng policy `pairing` cho DM:

1. Người dùng mới gửi tin nhắn lần đầu — bot trả về hướng dẫn và **mã 8 ký tự** (hiệu lực 60 phút).
2. Người dùng cung cấp mã này cho admin.
3. Admin phê duyệt qua `device.pair.approve` (Web UI hoặc WebSocket RPC).
4. Kết nối được kết cặp — các tin nhắn tiếp theo được xử lý bình thường.

Đặc điểm mã kết cặp:
- Độ dài: 8 ký tự
- Bộ chữ cái: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (loại bỏ ký tự dễ nhầm như 0, O, 1, I, L)
- Tối đa 3 yêu cầu cho cùng một tài khoản
- Debounce: bot không gửi lại hướng dẫn quá 1 lần mỗi 60 giây

---

## Chính sách kết nối (Channel Policies)

### DM Policies

| Policy | Hành vi |
|--------|---------|
| `open` | Chấp nhận tin nhắn từ bất kỳ ai |
| `allowlist` | Chỉ chấp nhận người gửi có trong danh sách cho phép |
| `pairing` | Yêu cầu xác thực kết cặp trước khi xử lý |
| `disabled` | Từ chối tất cả DM |

### Group Policies

| Policy | Hành vi |
|--------|---------|
| `open` | Chấp nhận tin nhắn từ bất kỳ nhóm nào |
| `allowlist` | Chỉ chấp nhận nhóm có trong danh sách |
| `disabled` | Không xử lý tin nhắn nhóm |

---

## Giao diện quản lý kênh

Route: `/channels`
Nhóm Sidebar: Kết Nối
Quyền truy cập: Admin

Hiển thị danh sách phân trang các kênh với chỉ báo trạng thái (trực tuyến / ngoại tuyến / đang kết nối) và ô tìm kiếm.

**Thao tác:**
- **Thêm channel** — trình hướng dẫn (các bước khác nhau theo loại kênh):
  - Bước 1: Key (slug), Tên hiển thị, Loại channel, Agent, Thông tin xác thực, Cấu hình, Bật/tắt
  - Bước 2: Xác thực (QR code, OAuth, v.v.) — có thể bỏ qua
  - Bước 3: Cài đặt nhóm/chủ đề — có thể bỏ qua
- **Chỉnh sửa kênh** — cập nhật cấu hình
- **Xóa kênh** — nhập chính xác tên kênh để xác nhận (bị chặn với kênh mặc định)
- **Xác thực lại** — chạy lại luồng xác thực (ví dụ: Zalo QR)
- **Xem chi tiết kênh** — điều hướng đến trang chi tiết

**Cài đặt nâng cao kênh**: Mạng, Giới hạn, Streaming, Hành vi, Kiểm soát truy cập.

Admin có thể bật/tắt kênh qua `channels.toggle` (yêu cầu quyền admin).

---

## Lưu ý

- Mỗi kênh gắn với một agent duy nhất — nếu muốn nhiều agent, tạo nhiều kênh.
- Thay đổi agent của kênh ảnh hưởng đến tất cả tin nhắn mới (session cũ vẫn dùng agent cũ).
- Zalo Personal không phải kênh chính thức — sử dụng chịu rủi ro. Nên dùng Zalo OA cho mục đích sản xuất.
- WhatsApp yêu cầu WebSocket bridge ngoài — liên hệ nhà cung cấp để cài đặt.

---

## Xem thêm

- [Giao diện chat trên Web](./01-chat-co-ban.md)
- [Quản lý sessions](./02-quan-ly-sessions.md)
