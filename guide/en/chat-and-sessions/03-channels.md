# Channels

## Overview

GoClaw supports 7 messaging channels to connect AI agents with popular messaging platforms. Each channel operates independently. Each user on each channel has a separate session.

---

## 7 Supported Channels

| Channel | Connection Type | Group | DM | Streaming |
|---------|----------------|-------|----|-----------|
| Telegram | Long polling | Yes | Yes | Typing indicator |
| Discord | Gateway events | Yes | Yes | Edit "Thinking..." |
| Slack | Socket Mode (WebSocket) | Yes | Yes | Edit "Thinking..." |
| Feishu/Lark | WebSocket / Webhook | Yes | Yes | Streaming card |
| Zalo OA | Long polling | No | Yes | No |
| Zalo Personal | Internal protocol (unofficial) | Yes | Yes | No |
| WhatsApp | External WebSocket bridge | Yes | Yes | No |

---

## Usage Guide for Each Channel

### Telegram

- **DM**: Send messages directly to the bot — processed immediately.
- **Group**: The bot must be `@mentioned` before replying (default). Messages before the mention are kept as context (up to 50 messages).
- **Implicit reply**: Replying to the bot's message in a group is treated as a mention.
- **Voice/Audio**: Voice messages are transcribed via STT proxy, content is prefixed with `[audio: filename] Transcript: ...` before being sent to the agent.
- **Forum topics**: Each topic in a supergroup has its own session and configuration.
- **Bot commands**: `/stop` cancels the current run, `/stopall` cancels all, `/reset` clears history, `/help` shows help.

### Discord

- **DM**: Send messages directly to the bot.
- **Channel**: The bot needs `GuildMessages` + `MessageContent` permissions; must be `@mentioned` (default).
- **Streaming**: The bot sends a "Thinking..." message then edits it when the result is ready.
- **Limit**: 2,000 characters per message — automatically split if exceeded.
- **Typing indicator**: 9-second keepalive while the agent is processing.

### Slack

- **DM**: Send messages directly to the bot.
- **Channel**: Must be `@mentioned`; after the bot replies in a thread, subsequent messages in that thread automatically trigger without needing a mention (TTL 24 hours).
- **Socket Mode**: WebSocket connection — no public URL required.
- **Streaming**: Edit-in-place via `chat.update`, throttle 1000ms (Slack Tier 3).
- **Reactions**: Status emoji on user messages (thinking, using tool, completed, error).
- **Limit**: 4,000 characters per message.

### Feishu/Lark

- **DM**: Send messages directly to the bot.
- **Group**: Requires `@mention` (default); this requirement can be disabled per channel.
- **Streaming card**: Response is displayed in an interactive card with real-time typing effect (throttle 100ms).
- **Topic session mode**: When enabled, each thread has a separate session (session key: `{chatID}:topic:{rootMsgId}`).
- **Media**: Send/receive images, files, audio (default max 30 MB).
- **Connection**: WebSocket (default) or Webhook — can be mounted on the gateway's HTTP port.

### Zalo OA (Official Account)

- DM only — no group support.
- Limit of 2,000 characters per message.
- Default DM policy: `pairing` (requires code-based authentication).
- Supports sending images (max 5 MB).

### Zalo Personal

- Uses an unofficial protocol (reverse-engineered).
- Supports both DM and group.
- Default policy: `allowlist` (only accepts users on the allowlist).
- Warning: The account may be banned by Zalo at any time for violating terms of service.

---

## Pairing Flow (Pairing Authentication)

Applies when a channel uses the `pairing` policy for DM:

1. A new user sends a message for the first time — the bot replies with instructions and an **8-character code** (valid for 60 minutes).
2. The user provides this code to the admin.
3. The admin approves via `device.pair.approve` (Web UI or WebSocket RPC).
4. The connection is paired — subsequent messages are processed normally.

Pairing code characteristics:
- Length: 8 characters
- Alphabet: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (excludes easily confused characters like 0, O, 1, I, L)
- Maximum 3 requests for the same account
- Debounce: the bot does not resend instructions more than once every 60 seconds

---

## Channel Policies

### DM Policies

| Policy | Behavior |
|--------|----------|
| `open` | Accept messages from anyone |
| `allowlist` | Only accept senders on the allowlist |
| `pairing` | Require pairing authentication before processing |
| `disabled` | Reject all DMs |

### Group Policies

| Policy | Behavior |
|--------|----------|
| `open` | Accept messages from any group |
| `allowlist` | Only accept groups on the allowlist |
| `disabled` | Do not process group messages |

---

## Channel Management Interface

Route: `/channels`
Sidebar Group: Channels
Access: Admin

Displays a paginated list of channels with status indicators (running / stopped / connecting) and a search box.

**Actions:**
- **Add Channel** — wizard (steps vary by channel type):
  - Step 1: Key (slug), Display Name, Channel Type, Agent, Credentials, Configuration, Enabled/Disabled
  - Step 2: Authenticate (QR code, OAuth, etc.) — can be skipped
  - Step 3: Group/Topic settings — can be skipped
- **Edit channel** — update configuration
- **Delete channel** — type the exact channel name to confirm (blocked for default channels)
- **Re-authenticate** — re-run the authentication flow (e.g., Zalo QR)
- **View channel details** — navigate to the detail page

**Advanced channel settings**: Network, Limits, Streaming, Behavior, Access Control.

Admins can enable/disable channels via `channels.toggle` (requires admin permission).

---

## Notes

- Each channel is bound to a single agent — if you want multiple agents, create multiple channels.
- Changing a channel's agent affects all new messages (existing sessions still use the old agent).
- Zalo Personal is not an official channel — use at your own risk. Use Zalo OA for production purposes.
- WhatsApp requires an external WebSocket bridge — contact the provider for setup.

---

## See Also

- [Chat interface on Web](./01-basic-chat.md)
- [Managing sessions](./02-session-management.md)
