# Pending Messages

**Route:** `/pending-messages`
**Sidebar Group:** Conversations
**Access:** Operator+

---

## Overview

When multiple messages arrive simultaneously from a group or channel (e.g., Telegram group, Discord server), GoClaw buffers them into **pending message groups** instead of processing each one individually. This system helps:

- Avoid invoking the agent too many times for the same topic
- Reduce LLM costs by summarizing before processing
- Manage message queues when the agent is busy

---

## User Interface (UI)

**Route:** `/pending-messages`

The page displays a table of pending message groups with the following columns:

| Column | Description |
|--------|-------------|
| Channel | Message source (Telegram, Discord, ...) |
| Group | Group conversation identifier |
| Messages | Number of unprocessed messages in the group |
| Status | `Raw` or `Compacted` |
| Last Activity | Time of the most recent message |

**"How it works" info card** — expandable to view an explanation of the mechanism.

---

## Guide

### View Messages in a Group

1. Click the **"View"** button on a group row
2. The dialog displays each message in the group: sender, content, timestamp
3. Click **Close** to dismiss

### Compact a Message Group

Compaction uses an LLM to summarize raw messages into a concise summary, reducing context when the agent processes them:

1. Click the **"Compact"** button on a group row with `Raw` status
2. The system calls the LLM to generate a summary
3. The button shows a processing state — automatic polling until completion
4. Status changes to `Compacted` when done

> Configure the auto-compaction threshold in `config.json` on the [System Configuration](../admin/10-config.md) page.

### Clear a Message Group

1. Click the **"Clear"** button on a group row
2. Confirm in the dialog
3. All messages in the group are permanently deleted

### Refresh

Click **Refresh** to update the list from the server.

---

## How It Works

```
Incoming messages (group/channel)
        |
        v
  inbound_debounce_ms (default 1000ms)
        |
        v
  Pending message group
        |
   [if >= threshold]
        v
  LLM Compaction (summarization)
        |
        v
  Agent processes the summary
```

**Related configuration in `config.json`:**

| Field | Default | Description |
|-------|---------|-------------|
| `gateway.inbound_debounce_ms` | `1000` | Message coalescing time (ms, -1 = disabled) |
| `channels.pending_compaction.threshold` | `200` | Number of entries that triggers auto-compaction |
| `channels.pending_compaction.keep_recent` | `40` | Number of messages kept after compaction |
| `channels.pending_compaction.max_tokens` | `4096` | Max tokens for LLM summarization |
| `channels.pending_compaction.provider` | `""` | LLM provider (empty = use agent's provider) |

---

## Troubleshooting

**Message group persists too long, agent not processing:**

Possible causes:
- Agent is busy processing another task
- Channel connection error
- `inbound_debounce_ms` configured too high

Solutions:
1. Check agent status on `/agents`
2. View logs at `/logs`
3. If needed, compact or clear the group to free up the queue

**Compaction failed:**

- Check the LLM provider configured in `pending_compaction.provider`
- View error details in `/logs` (filter by `compaction` event)
- If the provider is unavailable, compaction will retry automatically

**Messages lost after clearing a group:**

Clearing a group is permanent — it cannot be undone. Only clear when you are certain the messages are no longer needed.

---

## Notes

- This page only shows messages from **group channels** (group chats) — DM messages do not appear in this queue
- Manual compaction overrides any auto-compaction that was scheduled
- The agent can still process groups in `Raw` status — compaction is an optimization, not a requirement
- When `inbound_debounce_ms: -1`, messages are processed immediately and do not go through this queue

---

## See Also

- [System Configuration — pending_compaction](../admin/10-config.md)
- [Channel Configuration](../chat-and-sessions/03-channels.md)
- [Monitoring and Logs](../admin/06-monitoring.md)
