# Basic Chat

## Overview

The Chat interface is the main interaction hub with AI agents on the Web Dashboard. It supports sending text messages, attaching files, viewing streaming responses with tool call cards, and managing multiple sessions simultaneously.

Route: `/chat/:sessionKey?`
Sidebar Group: Core
Access: Logged in

---

## Interface

The chat interface consists of 3 main areas:

- **Sidebar (left)**: Session list, new session button, agent picker (AgentSelector dropdown)
- **Chat area (center)**: Message thread, streaming response, tool call cards, thinking blocks
- **Input bar (bottom)**: Message input field, file attachment button, send button
- **Team task panel (right)**: Automatically opens when the agent is running team tasks

On mobile: the sidebar is hidden, tap the menu icon to open. The virtual keyboard on iOS/Android is handled automatically so the input bar is not obscured.

---

## Guide

### Create a new session

1. Open the sidebar (on mobile: tap the menu icon).
2. Select an agent from the **AgentSelector** dropdown — shows a list of all agents.
3. Tap the **New Chat** button (icon `+`).
4. The URL updates to `/chat/{sessionKey}` — the session is created automatically when you send the first message.

The session key format is `agent:{agentId}:{channel}:direct:{userId}`. Each agent has its own separate session namespace.

### Send a message

- Type content in the input bar, press **Enter** (or the Send message button) to send.
- Supports **Markdown** in input content: `**bold**`, `*italic*`, backtick code, list.
- Attach files: drag and drop or tap the file attachment icon — files are uploaded via `/v1/media/upload` and the path is automatically injected into the message.
- The input bar automatically expands in height based on content (multi-line).

### View streaming response

When the agent is processing, the response is streamed token by token:

| Component | Description |
|-----------|-------------|
| ThinkingBlock | Displayed when the agent is thinking (Extended Thinking) — can be shown/hidden |
| ToolCallCard | Card showing tool name and result (web_search, read_file, etc.) |
| MessageBubble | Accumulates streaming text, renders Markdown after completion |
| Typing indicator | Shown at the end of the thread when the agent is processing |

The response automatically scrolls down when new messages arrive (smooth scroll). When the user scrolls up manually, auto-scroll pauses.

### Stop response (Abort)

When the agent is running:
- The **Stop generating** button appears in the input area — tap to cancel the current request (`chat.abort`).
- If multiple child agents are running (team tasks), the `isBusy` state remains until all complete.
- On Telegram: use the `/stop` command to cancel the current run, `/stopall` to cancel all.

### View chat history

- History is loaded from `chat.history` when a session is selected.
- Scroll up to view older messages.
- Older sessions are listed in the sidebar, sorted by time.
- **Read-only mode**: Sessions belonging to other users are displayed in read-only mode (if permission is granted).

### Delete a session

1. Hover over a session in the sidebar to reveal the Delete icon.
2. Tap the Delete icon — a confirmation dialog appears.
3. Confirm to permanently delete (`sessions.delete`).

Note: Deleting a session cannot be undone. The message history is completely removed.

---

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Enter` | Send message |
| `Shift+Enter` | New line in input |
| `Escape` | Close sidebar (mobile) |

---

## Example

Start a chat with the "Assistant" agent:

```
1. Sidebar -> AgentSelector -> select "Assistant"
2. Tap New Chat (+)
3. URL: /chat/agent:assistant-id:web:direct:system
4. Type: "Summarize this article for me" + attach a PDF file
5. Press Enter -> agent receives file, processes, returns result
```

---

## Notes

- Each agent has its own session namespace — switching agents means switching session namespaces; you cannot share sessions across agents.
- Streaming only works via WebSocket RPC — ensure a stable WebSocket connection.
- Tool call cards are displayed in real time during agent processing, helping you track what the agent is doing.
- On external channels (Telegram, Discord, ...), the agent is assigned when configuring the channel; users do not need to select an agent.

---

## See Also

- [Managing and searching sessions](./02-session-management.md)
- [Chat via Telegram, Discord, Slack](./03-channels.md)
- [Understanding agents and skills](../agents/01-agents-overview.md)
