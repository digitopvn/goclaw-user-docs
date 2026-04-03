# Session Detail

**Route:** `/sessions/:key`
**Access:** Auth

## What It Shows
Full message history for a session rendered as chat bubbles (user / assistant / system), plus session metadata (agent, channel, username, peer kind, tokens in/out) and an expandable session summary block.

## Actions
- **Edit session title** — inline title editing
- **Reset session** — clear conversation history
- **Delete session** — remove session permanently

## Sub-features
- Auto-refreshes when the agent completes a run
- Expandable session summary block
- Metadata sidebar: agent, channel, username, peer kind, token counts

## Dialogs

### Inline Title Edit
**Trigger:** Click on session title text
**Fields:** Title input (auto-focused)

**Actions:**
- **✓ (check)** — saves via `onPatch(session.key, {label: titleDraft})`
- **✕ (x)** — cancels edit
- **Enter key** — saves
- **Escape key** — cancels

### Reset Session Confirmation
**Trigger:** "Reset" button (rotate-ccw icon) in header
**Displays:** Confirmation message only

**Actions:**
- **Confirm Reset** — calls `onReset(session.key)`, clears messages
- **Cancel** — closes

### Delete Session Confirmation
**Trigger:** "Delete" button (trash icon) in header
**Displays:** Confirmation message only

**Actions:**
- **Confirm Delete** (destructive) — calls `onDelete(session.key)`, navigates back to sessions list
- **Cancel** — closes
