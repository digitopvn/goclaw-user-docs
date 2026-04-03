# Approvals

**Route:** `/approvals`
**Access:** Operator+

## What It Shows
List of pending shell execution approval requests. Each entry shows: agent ID, command to execute, and timestamp.

## Actions
- **Allow Once** — approve this single execution (confirm dialog)
- **Allow Always** — add command to permanent allow-list (confirm dialog)
- **Deny** — reject the command (confirm dialog)
- **Refresh**

## Sub-features
- Confirm dialog for all three actions
- Empty state when no pending approvals

## Dialogs

### Allow Once Confirmation
**Trigger:** "Allow Once" button on pending request
**Displays:** Command text + agent ID

**Actions:**
- **Allow Once** — approves single execution
- **Cancel** — closes

### Allow Always Confirmation
**Trigger:** "Allow Always" button on pending request
**Displays:** Command text + agent ID

**Actions:**
- **Allow Always** — adds command to permanent allow-list
- **Cancel** — closes

### Deny Confirmation
**Trigger:** "Deny" button on pending request
**Displays:** Command text + agent ID (destructive styling)

**Actions:**
- **Deny** (destructive) — rejects the command
- **Cancel** — closes
