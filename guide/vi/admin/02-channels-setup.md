# Cau Hinh Channels

## Tong Quan

GoClaw ho tro 7 kenh ket noi. Moi channel instance co the gan vao mot agent cu the. Nhieu channel co the dung cung mot agent.

**Route danh sach:** `/channels`
**Route chi tiet:** `/channels/:id`
**Quyen truy cap:** Admin

---

## Huong Dan

### 7 Channels Ho Tro

| Kenh | Kieu Ket Noi | DM | Nhom | Streaming |
|------|--------------|----|------|-----------|
| Telegram | Long polling | Co | Co | Typing indicator |
| Discord | Gateway events | Co | Co | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Co | Co | Edit-in-place |
| Feishu/Lark | WebSocket / Webhook | Co | Co | Streaming card |
| Zalo OA | Long polling | Co | Khong | Khong |
| Zalo Personal | Giao thuc noi bo | Co | Co | Khong |
| WhatsApp | WebSocket bridge ngoai | Co | Co | Khong |

### Setup Telegram

1. Nhan tin voi `@BotFather` tren Telegram
2. Gui `/newbot`, dat ten va username (phai ket thuc bang `bot`)
3. BotFather tra ve **Bot Token** dang `123456789:ABC-DEF...`
4. Vao **Channels > Add Channel > Telegram**, nhap Bot Token
5. (Tuy chon) API Server URL neu dung local Bot API server cho file >20 MB
6. (Tuy chon) HTTP Proxy neu can route traffic qua proxy

Telegram dung long polling — khong can cau hinh webhook.

| Truong | Mac Dinh | Mo Ta |
|--------|----------|-------|
| DM Policy | `pairing` | Yeu cau ma ket cap cho user moi |
| Group Policy | `pairing` | Yeu cau phe duyet cho nhom moi |
| Require @mention | `true` | Chi tra loi khi duoc mention trong nhom |
| Group History Limit | 50 | So tin nhan nhom giu lam nguyen canh |

### Setup Discord

1. Vao [Discord Developer Portal](https://discord.com/developers/applications) > **New Application > Bot**
2. Nhan **Reset Token** lay bot token
3. Bat Privileged Gateway Intents: `Server Members Intent` va `Message Content Intent`
4. Tao invite link: **OAuth2 > URL Generator** > scopes: `bot`, permissions: `Send Messages`, `Read Message History`, `View Channels`
5. Vao **Channels > Add Channel > Discord**, nhap Bot Token

### Setup Slack

1. Vao [api.slack.com/apps](https://api.slack.com/apps) > **Create New App > From scratch**
2. **Socket Mode** > bat `Enable Socket Mode` > tao App-Level Token scope `connections:write` (token `xapp-...`)
3. **OAuth & Permissions > Bot Token Scopes**: them `chat:write`, `im:history`, `im:read`, `channels:history`, `channels:read`, `groups:history`, `reactions:write`
4. **Install to Workspace** > copy Bot User OAuth Token (`xoxb-...`)
5. Vao **Channels > Add Channel > Slack**:
   - Bot Token: `xoxb-...`
   - App-Level Token: `xapp-...`
   - User Token (tuy chon): `xoxp-...`
   - Debounce Delay: mac dinh 300ms
   - Thread Participation TTL: mac dinh 24h

Slack dung Socket Mode — khong can public URL.

### Setup Feishu/Lark

1. Tao Custom App tai [open.feishu.cn](https://open.feishu.cn) hoac [open.larksuite.com](https://open.larksuite.com)
2. Lay App ID (`cli_xxxxx`) va App Secret
3. Scopes can: `im:message`, `im:message:send_as_bot`, `im:resource`, `contact:user.base:readonly`, `cardkit:card:write`
4. Vao **Channels > Add Channel > Feishu**, nhap App ID, App Secret, chon Domain (`lark` hoac `feishu`), Connection Mode, Render Mode

| Mode | Yeu Cau | Khuyen Nghi |
|------|---------|-------------|
| `websocket` | Khong can IP public | Co (mac dinh) |
| `webhook` | Can endpoint public | Khi websocket khong kha dung |

### Setup Zalo OA

1. Dang ky Zalo Official Account tai [oa.zalo.me](https://oa.zalo.me)
2. Vao **Dev Tools > API** lay OA Access Token
3. Vao **Channels > Add Channel > Zalo OA**, nhap OA Access Token
4. (Tuy chon) nhap Webhook Secret

> Mac dinh DM Policy la `pairing`. Gioi han: 2,000 ky tu tin nhan, media 5 MB. Chi ho tro DM.

### Setup WhatsApp

WhatsApp yeu cau external bridge (vd: whatsapp-web.js). GoClaw ket noi den bridge qua WebSocket.

1. Vao **Channels > Add Channel > WhatsApp**
2. Nhap Bridge URL: `http://bridge:3000`

> GoClaw khong implement giao thuc WhatsApp truc tiep. Bridge phai deploy rieng.

---

## Giao Dien (UI)

### Trang Chi Tiet (`/channels/:id`)

**Hien thi:** Cau hinh kenh, trang thai ket noi, cai dat.

**Thao tac:** Xem cau hinh | Xoa kenh | Quay lai danh sach | Hien thi trang thai ket noi

---

## Channel Policies

### DM Policy

| Policy | Hanh Vi |
|--------|---------|
| `open` | Chap nhan tu bat ky user |
| `allowlist` | Chi chap nhan user trong danh sach |
| `pairing` | User moi nhan ma 8 ky tu (hieu luc 60 phut), admin phe duyet |
| `disabled` | Tu choi tat ca DM |

### Group Policy

| Policy | Hanh Vi |
|--------|---------|
| `open` | Chap nhan tu bat ky nhom |
| `allowlist` | Chi chap nhan nhom trong danh sach |
| `disabled` | Khong xu ly tin nhan nhom |

### Mention Mode (Telegram, Slack, Feishu)

| Mode | Hanh Vi |
|------|---------|
| `strict` (mac dinh) | Chi tra loi khi duoc @mention |
| `yield` | Tra loi tru khi bot khac duoc mention |

---

## Per-Group Overrides (Telegram)

Cau hinh rieng cho tung group hoac forum topic, ghi de len cau hinh kenh chung.

**Truy cap:** Channels > chon Telegram instance > tab **Group Overrides**

Cac truong co the ghi de: Group Policy, Require @mention, Mention Mode, Allowed Users, Skills Filter, Tool Allowlist, System Prompt, Enabled.

Thu tu uu tien: Global defaults < Wildcard group `*` < Specific group < Specific topic.

---

## Voice Routing (Telegram)

Khi nhan voice/audio, Telegram channel:
1. Download file audio tu Telegram
2. Gui den STT proxy de phien am
3. Tien to noi dung: `[audio: filename] Transcript: <text>`
4. Neu VoiceAgentID duoc cau hinh, chuyen den agent chuyen biet
5. Neu khong, chuyen den agent mac dinh cua kenh

> Cau hinh Voice Agent ID trong phan Advanced cua Telegram channel settings.

---

## Luu Y

- Telegram, Discord, Slack: long polling hoac WebSocket — khong can public endpoint
- Feishu webhook mode voi `port=0`: gan tren cong HTTP cua gateway
- WhatsApp yeu cau deploy bridge rieng biet

---

## Xem Them

- [guide/vi/teams/02-contacts.md](../teams/02-contacts.md) — Quan ly danh ba lien he
- [guide/vi/admin/05-bao-mat.md](05-bao-mat.md) — DM Policy va bao mat
