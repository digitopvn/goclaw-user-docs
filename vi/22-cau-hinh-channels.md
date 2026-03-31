# 22 - Cau Hinh Channels (Admin Guide)

Huong dan quan tri viec thiet lap va cau hinh cac kenh nhan tin trong GoClaw.

---

## 1. Tong Quan — 7 Channels

GoClaw ho tro 7 kenh ket noi. Vao **Settings > Channels** tren Web UI de quan ly.

| Kenh | Kieu ket noi | DM | Nhom | Streaming |
|------|--------------|----|------|-----------|
| Telegram | Long polling | Co | Co | Typing indicator |
| Discord | Gateway events | Co | Co | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Co | Co | Edit-in-place |
| Feishu/Lark | WebSocket / Webhook | Co | Co | Streaming card |
| Zalo OA | Long polling | Co | Khong | Khong |
| Zalo Personal | Giao thuc noi bo (khong chinh thuc) | Co | Co | Khong |
| WhatsApp | WebSocket bridge ngoai | Co | Co | Khong |

Moi channel instance co the gan vao mot agent cu the. Nhieu channel co the dung cung mot agent.

---

## 2. Setup Telegram

### Tao Bot

1. Mo Telegram, nhan tin voi `@BotFather`
2. Gui `/newbot`, dat ten va username (phai ket thuc bang `bot`)
3. BotFather tra ve **Bot Token** dang `123456789:ABC-DEF...`

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > Telegram**
2. Nhap **Bot Token** vao truong "Bot Token"
3. (Tuy chon) **API Server URL**: neu dung local Bot API server cho file lon (>20 MB)
4. (Tuy chon) **HTTP Proxy**: neu can route traffic qua proxy

### Webhook

Telegram dung long polling — khong can cau hinh webhook. Bot tu dong ket noi khi bat.

### Chinh Sach

| Truong | Mac Dinh | Mo Ta |
|--------|----------|-------|
| DM Policy | `pairing` | Yeu cau ma ket cap cho user moi |
| Group Policy | `pairing` | Yeu cau phe duyet cho nhom moi |
| Require @mention | `true` | Bot chi tra loi khi duoc mention trong nhom |
| Group History Limit | 50 | So tin nhan nhom giu lai lam nguyen canh truoc khi mention |

---

## 3. Setup Discord

### Tao Bot

1. Vao [Discord Developer Portal](https://discord.com/developers/applications)
2. Tao **New Application**, vao tab **Bot**
3. Nhan **Reset Token** de lay bot token
4. Bat cac **Privileged Gateway Intents**: `Server Members Intent` va `Message Content Intent`

### Tao Invite Link

- Vao **OAuth2 > URL Generator**
- Scopes: `bot` | Bot Permissions: `Send Messages`, `Read Message History`, `Read Messages/View Channels`
- Copy URL va invite bot vao server

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > Discord**
2. Nhap **Bot Token**
3. Cau hinh DM Policy va Group Policy

---

## 4. Setup Slack

### Tao Slack App

1. Vao [api.slack.com/apps](https://api.slack.com/apps) > **Create New App > From scratch**
2. Vao **Socket Mode** > bat `Enable Socket Mode` > tao **App-Level Token** voi scope `connections:write` — day la `xapp-...` token

### OAuth Scopes

Vao **OAuth & Permissions > Bot Token Scopes**, them:
- `chat:write`, `im:history`, `im:read`, `channels:history`, `channels:read`, `groups:history`, `reactions:write`

Cai app vao workspace: **Install to Workspace** > copy **Bot User OAuth Token** (`xoxb-...`)

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > Slack**
2. **Bot Token**: `xoxb-...`
3. **App-Level Token**: `xapp-...`
4. **User Token** (tuy chon): `xoxp-...` cho custom identity
5. Cau hinh Debounce Delay (mac dinh 300ms) va Thread Participation TTL (mac dinh 24h)

Slack dung **Socket Mode** — khong can public URL hay webhook endpoint.

---

## 5. Setup Feishu/Lark

### Tao App

1. Vao [open.feishu.cn](https://open.feishu.cn) (Feishu) hoac [open.larksuite.com](https://open.larksuite.com) (Lark)
2. Tao **Custom App** > lay **App ID** (`cli_xxxxx`) va **App Secret**
3. **Scopes can thiet**: `im:message`, `im:message:send_as_bot`, `im:resource`, `contact:user.base:readonly`, `cardkit:card:write`, v.v.

### Kieu Ket Noi

| Mode | Yeu Cau | Khuyen Nghi |
|------|---------|-------------|
| `websocket` | Khong can IP public | Co (mac dinh) |
| `webhook` | Can endpoint public | Khi websocket khong kha dung |

Webhook mode voi `port=0`: gan tren cong HTTP cua gateway (khong can server rieng).

### Event Subscription

- WebSocket mode: bat trong App Configuration > Subscriptions
- Webhook mode: cau hinh **Encrypt Key** va **Verification Token**, thi dung webhook URL

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > Feishu**
2. Nhap **App ID**, **App Secret**
3. Chon **Domain**: `lark` (global) hoac `feishu` (China)
4. Chon **Connection Mode** va **Render Mode** (`auto` phan tich code/table tu dong)

---

## 6. Setup Zalo OA

### Dang Ky OA

1. Dang ky **Zalo Official Account** tai [oa.zalo.me](https://oa.zalo.me)
2. Vao **Dev Tools > API** de lay **OA Access Token**
3. (Tuy chon) cau hinh **Webhook URL** de nhan events

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > Zalo OA**
2. Nhap **OA Access Token**
3. (Tuy chon) nhap **Webhook Secret** neu co
4. Zalo OA chi ho tro DM — khong co group messaging

> Mac dinh DM Policy la `pairing`. Gioi han tin nhan: 2,000 ky tu, media: 5 MB.

---

## 7. Setup WhatsApp

WhatsApp yeu cau mot **external bridge** (vi du: whatsapp-web.js). GoClaw ket noi den bridge nay qua WebSocket.

### Cau Hinh tren GoClaw

1. Vao **Channels > Add Channel > WhatsApp**
2. Nhap **Bridge URL**: `http://bridge:3000`
3. Bridge xu ly xac thuc QR code va giao thuc WhatsApp

> GoClaw khong implement giao thuc WhatsApp truc tiep. Bridge phai duoc deploy rieng.

---

## 8. Channel Policies

### DM Policy

| Policy | Hanh Vi |
|--------|---------|
| `open` | Chap nhan tin nhan tu bat ky user |
| `allowlist` | Chi chap nhan user co trong danh sach `Allowed Users` |
| `pairing` | User moi nhan ma 8 ky tu (hieu luc 60 phut), admin phe duyet |
| `disabled` | Tu choi tat ca DM |

### Group Policy

| Policy | Hanh Vi |
|--------|---------|
| `open` | Chap nhan tin nhan tu bat ky nhom |
| `allowlist` | Chi chap nhan nhom trong danh sach |
| `disabled` | Khong xu ly tin nhan nhom |

### Mention Mode (Telegram, Slack, Feishu)

| Mode | Hanh Vi |
|------|---------|
| `strict` (mac dinh) | Bot chi tra loi khi duoc @mention |
| `yield` | Bot tra loi tru khi bot khac duoc mention (moi truong nhieu bot) |

---

## 9. Per-Group Overrides (Telegram)

Telegram ho tro cau hinh rieng cho tung **group** hoac **forum topic** (ghi de len cau hinh kenh chung).

**Truy cap**: Channels > chon Telegram instance > **Group Overrides** tab.

Cac truong co the ghi de:

| Truong | Mo Ta |
|--------|-------|
| Group Policy | Ghi de policy cho nhom nay |
| Require @mention | Bat/tat require mention cho nhom nay |
| Mention Mode | Ghi de mention mode |
| Allowed Users | Danh sach user duoc phep rieng cho nhom |
| Skills Filter | Gioi han skills kha dung trong nhom |
| Tool Allowlist | Gioi han tools ma agent co the dung trong nhom |
| System Prompt | Them system prompt bo sung cho nhom |
| Enabled | Bat/tat xu ly tin nhan nhom nay |

Thu tu ghi de: Global defaults < Wildcard group `*` < Specific group < Specific topic.

---

## 10. Voice Routing (Telegram)

Khi nhan duoc tin nhan giong noi (voice/audio), Telegram channel:

1. Download file audio tu Telegram
2. Gui den **STT proxy** de phien am
3. Tien to noi dung: `[audio: filename] Transcript: <text>`
4. Neu **VoiceAgentID** duoc cau hinh, chuyen den agent chuyen biet (vi du: speech agent)
5. Neu khong, chuyen den agent mac dinh cua kenh

> Cau hinh Voice Agent ID trong phan Advanced cua Telegram channel settings.

---

## Xem Them

- [05-channels-messaging.md](../05-channels-messaging.md) — Chi tiet ky thuat
- [11-kenh-ket-noi.md](./11-kenh-ket-noi.md) — Huong dan user
