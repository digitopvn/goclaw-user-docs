# Configuring Channels

## Overview

GoClaw supports 7 connection channels. Each channel instance can be attached to a specific agent. Multiple channels can use the same agent.

**List route:** `/channels`
**Detail route:** `/channels/:id`
**Access:** Admin

---

## Guide

### 7 Supported Channels

| Channel | Connection Type | DM | Group | Streaming |
|---------|-----------------|----|-------|-----------|
| Telegram | Long polling | Yes | Yes | Typing indicator |
| Discord | Gateway events | Yes | Yes | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Yes | Yes | Edit-in-place |
| Feishu/Lark | WebSocket / Webhook | Yes | Yes | Streaming card |
| Zalo OA | Long polling | Yes | No | No |
| Zalo Personal | Internal protocol | Yes | Yes | No |
| WhatsApp | External WebSocket bridge | Yes | Yes | No |

### Setup Telegram

1. Message `@BotFather` on Telegram
2. Send `/newbot`, set a name and username (must end with `bot`)
3. BotFather returns a **Bot Token** in the format `123456789:ABC-DEF...`
4. Go to **Channels > Add Channel > Telegram**, enter the Bot Token
5. (Optional) API Server URL if using a local Bot API server for files >20 MB
6. (Optional) HTTP Proxy if you need to route traffic through a proxy

Telegram uses long polling — no webhook configuration needed.

| Field | Default | Description |
|-------|---------|-------------|
| DM Policy | `pairing` | Requires a pairing code for new users |
| Group Policy | `pairing` | Requires approval for new groups |
| Require @mention | `true` | Only responds when mentioned in groups |
| Group History Limit | 50 | Number of group messages kept as context |

### Setup Discord

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) > **New Application > Bot**
2. Click **Reset Token** to get the bot token
3. Enable Privileged Gateway Intents: `Server Members Intent` and `Message Content Intent`
4. Create an invite link: **OAuth2 > URL Generator** > scopes: `bot`, permissions: `Send Messages`, `Read Message History`, `View Channels`
5. Go to **Channels > Add Channel > Discord**, enter the Bot Token

### Setup Slack

1. Go to [api.slack.com/apps](https://api.slack.com/apps) > **Create New App > From scratch**
2. **Socket Mode** > enable `Enable Socket Mode` > create an App-Level Token with scope `connections:write` (token `xapp-...`)
3. **OAuth & Permissions > Bot Token Scopes**: add `chat:write`, `im:history`, `im:read`, `channels:history`, `channels:read`, `groups:history`, `reactions:write`
4. **Install to Workspace** > copy Bot User OAuth Token (`xoxb-...`)
5. Go to **Channels > Add Channel > Slack**:
   - Bot Token: `xoxb-...`
   - App-Level Token: `xapp-...`
   - User Token (optional): `xoxp-...`
   - Debounce Delay: default 300ms
   - Thread Participation TTL: default 24h

Slack uses Socket Mode — no public URL required.

### Setup Feishu/Lark

1. Create a Custom App at [open.feishu.cn](https://open.feishu.cn) or [open.larksuite.com](https://open.larksuite.com)
2. Get the App ID (`cli_xxxxx`) and App Secret
3. Required scopes: `im:message`, `im:message:send_as_bot`, `im:resource`, `contact:user.base:readonly`, `cardkit:card:write`
4. Go to **Channels > Add Channel > Feishu**, enter App ID, App Secret, select Domain (`lark` or `feishu`), Connection Mode, Render Mode

| Mode | Requirement | Recommended |
|------|-------------|-------------|
| `websocket` | No public IP needed | Yes (default) |
| `webhook` | Public endpoint required | When websocket is unavailable |

### Setup Zalo OA

1. Register a Zalo Official Account at [oa.zalo.me](https://oa.zalo.me)
2. Go to **Dev Tools > API** to get the OA Access Token
3. Go to **Channels > Add Channel > Zalo OA**, enter the OA Access Token
4. (Optional) enter a Webhook Secret

> Default DM Policy is `pairing`. Limits: 2,000 characters per message, media 5 MB. DM only.

### Setup WhatsApp

WhatsApp requires an external bridge (e.g. whatsapp-web.js). GoClaw connects to the bridge via WebSocket.

1. Go to **Channels > Add Channel > WhatsApp**
2. Enter Bridge URL: `http://bridge:3000`

> GoClaw does not implement the WhatsApp protocol directly. The bridge must be deployed separately.

---

## User Interface (UI)

### Detail Page (`/channels/:id`)

**Display:** Channel configuration, connection status, settings.

**Actions:** View configuration | Delete channel | Back to list | Display connection status

---

## Channel Policies

### DM Policy

| Policy | Behavior |
|--------|----------|
| `open` | Accept from any user |
| `allowlist` | Only accept users on the allowlist |
| `pairing` | New users receive an 8-character code (valid for 60 minutes), admin approves |
| `disabled` | Reject all DMs |

### Group Policy

| Policy | Behavior |
|--------|----------|
| `open` | Accept from any group |
| `allowlist` | Only accept groups on the allowlist |
| `disabled` | Do not process group messages |

### Mention Mode (Telegram, Slack, Feishu)

| Mode | Behavior |
|------|----------|
| `strict` (default) | Only respond when @mentioned |
| `yield` | Respond unless another bot is @mentioned |

---

## Per-Group Overrides (Telegram)

Per-group or per-forum-topic configuration that overrides the channel-level defaults.

**Access:** Channels > select Telegram instance > **Groups** tab

Fields that can be overridden: Group Policy, Require @mention, Mention Mode, Allowed Users, Skills Filter, Tool Allowlist, System Prompt, Enabled.

Priority order: Global defaults < Wildcard group `*` < Specific group < Specific topic.

---

## Voice Routing (Telegram)

When receiving voice/audio, the Telegram channel:
1. Downloads the audio file from Telegram
2. Sends it to the STT proxy for transcription
3. Prefixes the content: `[audio: filename] Transcript: <text>`
4. If VoiceAgentID is configured, routes to the specialized agent
5. Otherwise, routes to the channel's default agent

> Configure Voice Agent ID in the Advanced section of Telegram channel settings.

---

## Notes

- Telegram, Discord, Slack: long polling or WebSocket — no public endpoint needed
- Feishu webhook mode with `port=0`: attaches to the gateway's HTTP port
- WhatsApp requires a separately deployed bridge

---

## See Also

- [guide/en/teams/02-contacts.md](../teams/02-contacts.md) — Contact management
- [guide/en/admin/05-bao-mat.md](05-bao-mat.md) — DM policies and security
