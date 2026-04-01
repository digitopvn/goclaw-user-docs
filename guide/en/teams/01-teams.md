# Agent Teams

## Overview

An agent team is a group of AI agents collaborating through a **shared task board**. The lead agent coordinates work, while member agents execute independently and in parallel.

**List route:** `/teams` — Operator+
**Detail route:** `/teams/:id` — Operator+

---

## Usage Guide

### When to Use a Team

| Scenario | Example |
|----------|---------|
| Research + report writing | Member A finds materials, Member B drafts the document |
| Code + review | Member A codes, Member B checks for errors |
| Diverse content creation | Member A writes captions, Member B creates images |
| Multi-source analysis | Each member processes a separate dataset |
| Approval flow (human-in-the-loop) | Task requires human approval before completion |

### Create a Team

1. Go to **Web UI > Teams > Create Team**
2. Fill in **Name** and **Description**
3. Select the **Lead Agent** (only one lead)
4. Add **Members** (only predefined agents can be selected)
5. Click **Create** — required: name + lead + at least 1 member

Limit: Lite edition supports max 1 team / 5 members. Standard edition has no limit.

### Create a Task

On the team detail page, click **Create Task**:

| Field | Description |
|-------|-------------|
| Subject | Short subject line (required) |
| Description | Detailed content |
| Type | General / Delegation / Escalation |
| Priority | Integer, higher = more priority |
| Assign to | Assigned member |

### Task Dependencies

Set `blocked_by` when a task requires another task to complete first:
- The task stays in `blocked` status until all dependent tasks are completed
- When dependent tasks finish, the `blocked` task automatically moves to `pending`
- A `cancelled` task also releases its dependencies

### Comments and Blockers

Both users and agents can add comments to tasks:
- **Regular comment** — feedback, explanation
- **Blocker comment** — the task automatically moves to `failed`, the lead receives an escalation notification

---

## Interface (UI)

### List Page (`/teams`)

Display: paginated list (card or list view), search.

Actions:
- **Create Team** — opens dialog
- **Delete Team** — confirmation required
- **View details** — click a card

### Detail Page (`/teams/:id`)

Display: team information, member list, task board.

**Members Dialog**: scrollable list — emoji, name, role (lead / reviewer / member). Add (predefined agent combobox) | Remove (X) per member (except lead).

**Team Info Dialog**: name, status, description, lead agent, member count, settings tab. Click the "v2 Super Team" badge to open the Feature Modal.

**Create Task Dialog**: Subject (required), Description, Type, Priority, Assign to. Click **Create Task** | **Cancel**.

**Task Detail Dialog**: Task ID, status, progress (V2), follow-up banner (V2), metadata, blocked by tasks, description, result, comments, timeline. Actions: **Delete** (completed tasks) | **Add Comment** | **Navigate to related tasks**.

**Team Workspace** (90vh x 95vw): file browser — scope filter, directory tree, content viewer. Actions: **Upload** | **Download** | **Delete** | **Move** (drag & drop) | **Refresh**.

---

## Task Lifecycle

```
pending -> in_progress -> completed
    |           |
  blocked    in_review -> approved -> completed
                      -> rejected -> cancelled
    |
  failed -> (retry) -> pending
```

| Status | Meaning |
|--------|---------|
| `pending` | Newly created, awaiting processing |
| `in_progress` | Member is working on it |
| `in_review` | Member submitted for review |
| `completed` | Completed |
| `blocked` | Waiting for dependent tasks |
| `failed` | Error / blocker escalation |
| `cancelled` | Cancelled |
| `stale` | Inactive for a long time |

---

## Team Workspace

| Mode | Directory | Use When |
|------|-----------|----------|
| Isolated (default) | `teams/{teamID}/{chatID}/` | Separate files per conversation |
| Shared | `teams/{teamID}/` | All members share the same directory |

Limits: max file size 10 MB, max 100 files/scope.

---

## Limits by Edition

| Feature | Lite | Standard |
|---------|:----:|:--------:|
| Max teams | 1 | Unlimited |
| Members/team | 5 | Unlimited |
| Comments / Review / Attachments | No | Full |
| Follow-up Reminders | No | Full |

---

## Notes

- The lead only assigns work through the task board, not through direct function calls
- Members can run in parallel — results are aggregated and returned to the user in a single turn
- Files created during tasks are automatically saved to `attachments/` and linked to the task

---

## See Also

- [Team workspace and files](../files-and-media/01-files-and-media.md)
