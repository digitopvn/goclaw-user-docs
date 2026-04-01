# Cấu Hình Channels

## Tổng Quan

GoClaw hỗ trợ 7 kênh kết nối. Mỗi channel instance có thể gắn vào một agent cụ thể. Nhiều channel có thể dùng cùng một agent.

**Route danh sách:** `/channels`
**Route chi tiết:** `/channels/:id`
**Quyền truy cập:** Admin

---

## Hướng Dẫn

### 7 Channels Hỗ Trợ

| Kênh | Kiểu Kết Nối | DM | Nhóm | Streaming |
|------|--------------|----|------|-----------|
| Telegram | Long polling | Có | Có | Typing indicator |
| Discord | Gateway events | Có | Có | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Có | Có | Edit-in-place |
| Feishu/Lark | WebSocket / Webhook | Có | Có | Streaming card |
| Zalo OA | Long polling | Có | Không | Không |
| Zalo Personal | Giao thức nội bộ | Có | Có | Không |
| WhatsApp | WebSocket bridge ngoài | Có | Có | Không |

### Setup Telegram

1. Nhắn tin với `@BotFather` trên Telegram
2. Gửi `/newbot`, đặt tên và username (phải kết thúc bằng `bot`)
3. BotFather trả về **Bot Token** dạng `123456789:ABC-DEF...`
4. Vào **Channels > Thêm channel > Telegram**, nhập Bot Token
5. (Tùy chọn) API Server URL nếu dùng local Bot API server cho file >20 MB
6. (Tùy chọn) HTTP Proxy nếu cần route traffic qua proxy

Telegram dùng long polling — không cần cấu hình webhook.

| Trường | Mặc Định | Mô Tả |
|--------|----------|-------|
| Chính sách DM | `pairing` | Yêu cầu mã kết cặp cho user mới |
| Chính sách nhóm | `pairing` | Yêu cầu phê duyệt cho nhóm mới |
| Yêu cầu @đề cập | `true` | Chỉ trả lời khi được mention trong nhóm |
| Giới hạn lịch sử nhóm | 50 | Số tin nhắn nhóm giữ làm ngữ cảnh |

### Setup Discord

1. Vào [Discord Developer Portal](https://discord.com/developers/applications) > **New Application > Bot**
2. Nhấn **Reset Token** lấy bot token
3. Bật Privileged Gateway Intents: `Server Members Intent` và `Message Content Intent`
4. Tạo invite link: **OAuth2 > URL Generator** > scopes: `bot`, permissions: `Send Messages`, `Read Message History`, `View Channels`
5. Vào **Channels > Thêm channel > Discord**, nhập Bot Token

### Setup Slack

1. Vào [api.slack.com/apps](https://api.slack.com/apps) > **Create New App > From scratch**
2. **Socket Mode** > bật `Enable Socket Mode` > tạo App-Level Token scope `connections:write` (token `xapp-...`)
3. **OAuth & Permissions > Bot Token Scopes**: thêm `chat:write`, `im:history`, `im:read`, `channels:history`, `channels:read`, `groups:history`, `reactions:write`
4. **Install to Workspace** > copy Bot User OAuth Token (`xoxb-...`)
5. Vào **Channels > Thêm channel > Slack**:
   - Bot Token: `xoxb-...`
   - App-Level Token: `xapp-...`
   - User Token (tùy chọn): `xoxp-...`
   - Debounce Delay: mặc định 300ms
   - Thread Participation TTL: mặc định 24h

Slack dùng Socket Mode — không cần public URL.

### Setup Feishu/Lark

1. Tạo Custom App tại [open.feishu.cn](https://open.feishu.cn) hoặc [open.larksuite.com](https://open.larksuite.com)
2. Lấy App ID (`cli_xxxxx`) và App Secret
3. Scopes cần: `im:message`, `im:message:send_as_bot`, `im:resource`, `contact:user.base:readonly`, `cardkit:card:write`
4. Vào **Channels > Thêm channel > Feishu**, nhập App ID, App Secret, chọn Domain (`lark` hoặc `feishu`), Connection Mode, Render Mode

| Mode | Yêu Cầu | Khuyến Nghị |
|------|---------|-------------|
| `websocket` | Không cần IP public | Có (mặc định) |
| `webhook` | Cần endpoint public | Khi websocket không khả dụng |

### Setup Zalo OA

1. Đăng ký Zalo Official Account tại [oa.zalo.me](https://oa.zalo.me)
2. Vào **Dev Tools > API** lấy OA Access Token
3. Vào **Channels > Thêm channel > Zalo OA**, nhập OA Access Token
4. (Tùy chọn) nhập Webhook Secret

> Mặc định Chính sách DM là `pairing`. Giới hạn: 2,000 ký tự tin nhắn, media 5 MB. Chỉ hỗ trợ DM.

### Setup WhatsApp

WhatsApp yêu cầu external bridge (vd: whatsapp-web.js). GoClaw kết nối đến bridge qua WebSocket.

1. Vào **Channels > Thêm channel > WhatsApp**
2. Nhập Bridge URL: `http://bridge:3000`

> GoClaw không implement giao thức WhatsApp trực tiếp. Bridge phải deploy riêng.

---

## Giao Diện (UI)

### Trang Chi Tiết (`/channels/:id`)

**Hiển thị:** Cấu hình kênh, trạng thái kết nối, cài đặt.

**Thao tác:** Xem cấu hình | Xóa kênh | Quay lại danh sách | Hiển thị trạng thái kết nối

---

## Channel Policies

### Chính Sách DM

| Policy | Hành Vi |
|--------|---------|
| `open` | Chấp nhận từ bất kỳ user |
| `allowlist` | Chỉ chấp nhận user trong danh sách |
| `pairing` | User mới nhận mã 8 ký tự (hiệu lực 60 phút), admin phê duyệt |
| `disabled` | Từ chối tất cả DM |

### Chính Sách Nhóm

| Policy | Hành Vi |
|--------|---------|
| `open` | Chấp nhận từ bất kỳ nhóm |
| `allowlist` | Chỉ chấp nhận nhóm trong danh sách |
| `disabled` | Không xử lý tin nhắn nhóm |

### Mention Mode (Telegram, Slack, Feishu)

| Mode | Hành Vi |
|------|---------|
| `strict` (mặc định) | Chỉ trả lời khi được @mention |
| `yield` | Trả lời trừ khi bot khác được mention |

---

## Per-Group Overrides (Telegram)

Cấu hình riêng cho từng group hoặc forum topic, ghi đè lên cấu hình kênh chung.

**Truy cập:** Channels > chọn Telegram instance > tab **Nhóm**

Các trường có thể ghi đè: Chính sách nhóm, Yêu cầu @mention, Mention Mode, Người dùng được phép, Bộ lọc Skill, Tool Allowlist, System Prompt, Enabled.

Thứ tự ưu tiên: Global defaults < Wildcard group `*` < Specific group < Specific topic.

---

## Voice Routing (Telegram)

Khi nhận voice/audio, Telegram channel:
1. Download file audio từ Telegram
2. Gửi đến STT proxy để phiên âm
3. Tiền tố nội dung: `[audio: filename] Transcript: <text>`
4. Nếu VoiceAgentID được cấu hình, chuyển đến agent chuyên biệt
5. Nếu không, chuyển đến agent mặc định của kênh

> Cấu hình Voice Agent ID trong phần Advanced của Telegram channel settings.

---

## Lưu Ý

- Telegram, Discord, Slack: long polling hoặc WebSocket — không cần public endpoint
- Feishu webhook mode với `port=0`: gắn trên cổng HTTP của gateway
- WhatsApp yêu cầu deploy bridge riêng biệt

---

## Xem Thêm

- [Quản lý danh bạ liên hệ](../teams/02-contacts.md)
- [Chính sách DM và bảo mật](05-security.md)
