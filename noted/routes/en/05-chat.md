# Chat

**Route:** `/chat/:sessionKey?`
**Access:** Auth

## What It Shows
Full chat interface with three panels: session sidebar (left), main message thread (center), task panel (right, auto-shows for team sessions).

## Actions
- **Send message** — text + file attachments (drag-and-drop supported)
- **Create new session** — start a fresh chat
- **Switch session** — select from sidebar list
- **Delete session** — remove a session
- **Switch agent** — change agent for new chats
- **Abort run** — stop a currently running agent
- **View task panel** — team tasks side panel (auto-opens/closes)

## Sub-features
- Real-time streaming text, thinking indicators, tool execution steps
- Read-only mode for sessions not owned by the current user
- Mobile-responsive: sidebar becomes an overlay
- ChatTopBar shows running/busy status and activity
- Drag-and-drop file attachments
