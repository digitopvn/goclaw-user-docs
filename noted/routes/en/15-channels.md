# Channels

**Route:** `/channels`
**Access:** Admin

## What It Shows
Paginated list of channel instances with online/offline status indicator and search.

## Actions
- **Create channel instance** — wizard dialog (steps vary by channel type)
- **Edit channel instance** — update configuration
- **Delete channel instance** — confirm dialog (blocked for default system channels)
- **Re-authenticate** — re-run auth flow for channels requiring it (e.g., Zalo QR login)
- **View channel detail** — click to navigate to detail page
- **Refresh**

## Sub-features
- Multi-step creation wizard (steps differ per channel type: Telegram, Feishu, Zalo, Discord, WhatsApp, etc.)
- Status indicator (online / offline / connecting)
- Delete blocked for default channels
- Pagination

## Dialogs

### Channel Form Dialog (Create / Edit)
**Trigger:** "Create Channel" button (create) or edit button on row (edit)

**Wizard Steps** (create mode, if channel type has wizard):
1. **Form Step** (always present)
2. **Auth Step** (channel-specific, e.g. QR code)
3. **Config Step** (channel-specific, e.g. group/topic settings)
Progress shown as "Step N of M"

**Form Step Fields:**
- Key (text, slugified, disabled on edit)
- Display Name (text)
- Channel Type (select, disabled on edit)
- Agent (select, required)
- Credentials (dynamic per channel type — inputs/selects/textareas; encrypted at rest; read-only hint on edit)
- Configuration (dynamic config fields, channel-specific; e.g. TelegramGroupOverrides)
- Enabled (switch)

**Auth Step:**
- Channel-specific UI (QR code scan, OAuth, etc.)
- Auto-advances to Config Step on completion (1.2s delay)
- **Skip** — moves to next step or closes

**Config Step:**
- Channel-specific settings (groups, topics, permissions, etc.)
- **Skip** — closes dialog
- **Done** — saves config and closes

**Form Step Actions:**
- **Create / Update** — validates required fields; on success with wizard → opens auth step; without wizard → closes; shows "Saving..." spinner
- **Cancel** — closes (disabled during auth step)

### Channel Advanced Settings Dialog
**Trigger:** Advanced button in channel detail header

**Field Groups (shown by channel type):**
- **Network:** api_server, proxy, domain, connection_mode, webhook_port, webhook_path, webhook_url
- **Limits:** history_limit, media_max_mb, text_chunk_limit
- **Streaming:** dm_stream, group_stream, draft_transport, reasoning_stream, native_stream, debounce_delay, thread_ttl
- **Behavior:** reaction_level, link_preview, block_reply, render_mode, topic_session_mode
- **Access Control:** allow_from, group_allow_from

**Actions:**
- **Save** — merges config preserving existing keys; calls `onUpdate({config: merged})`
- **Cancel** — closes without saving

### Delete Channel Confirmation
**Trigger:** Delete button (blocked for default channels)
**Fields:** Confirmation text input — must match channel display name exactly

**Actions:**
- **Delete** (destructive, enabled only when text matches) — removes channel
- **Cancel** — closes
