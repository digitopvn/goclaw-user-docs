# Managing Sessions

![Quản lý session](/images/session.png)

## Overview

The Sessions page allows you to view, search, and manage the entire conversation history in the system. The session detail page displays the full message history, metadata, and editing actions.

---

## Interface — Session List

Route: `/sessions`
Sidebar Group: Sessions
Access: Logged in

Displays a paginated table of all sessions with the following columns:

| Column | Content |
|--------|---------|
| Session / User | Session key and display name |
| Agent | Agent handling this session |
| Context | Bar: estimated tokens vs. window + number of compactions |
| Messages | Total messages in the session |
| Updated | Time of the last message |

**Actions:**
- **Search** — by key, label, display name, username, chat title
- **View details** — click a row to navigate to `/sessions/:key`

---

## Interface — Session Detail

Route: `/sessions/:key`
Sidebar Group: Sessions
Access: Logged in

Displays the full message history as chat bubbles (user / assistant / system).

**Session metadata** displayed above:

| Field | Description |
|-------|-------------|
| Agent | Agent handling the session |
| Channel | Message channel (web, telegram, discord, ...) |
| User | User ID |
| Peer Type | Peer type of the session |
| Tokens In/Out | Total tokens consumed |

**Summary block** (expandable): Conversation summary if the agent has generated one.

---

## Guide — Session Actions

### Edit title

1. On the session detail page, click the title to edit inline.
2. Press **Enter** or the tick icon (v) to save.
3. Press **Escape** or the x icon to cancel.

### Reset session

Clears the conversation history but keeps the session (does not remove the session from the list).

1. Click the **Reset** button.
2. A confirmation dialog appears — click **Reset**.
3. The message history is cleared, but the session remains.

### Delete session

Permanently deletes the session and all its history.

1. Click the **Delete** button.
2. A confirmation dialog appears — click **Delete** (danger style).
3. After deletion, you are automatically redirected to the `/sessions` list.

Warning: Deleting a session cannot be undone.

---

## Example — Search session by user

```
/sessions
  -> Search box: "user123"
  -> System filters sessions for user123
  -> Click a session to view full history
```

---

## Notes

- The "Context" bar indicates the session is nearing the context window limit — when full, the agent automatically compacts older history.
- The number of compactions is displayed in the bar: the more compactions, the less the agent remembers of older history.
- The Sessions page displays all sessions in the tenant (admins see all; regular users only see their own sessions depending on RBAC configuration).
- To resume chatting in an old session, click the session in the Chat page sidebar.

---

## See Also

- [Main chat interface](./01-basic-chat.md)
- [Sessions via external channels](./03-channels.md)
