# Team Detail

**Route:** `/teams/:id`
**Access:** Auth

## What It Shows
Team detail page with member management and task management sections.

## Actions
- **Edit team configuration** — update team settings
- **Manage members** — add/remove team members, assign roles
- **Manage tasks** — view, create, update, delete team tasks
- **Delete team** — remove the team

## Sub-features
- Member section
- Task section
- Back to teams list

## Dialogs

### Members Dialog
**Trigger:** "Members" button on team board
**Displays:** Scrollable member list (max 60vh) — emoji, display name, agent key, role badge (lead/reviewer/member), frontmatter/bio

**Actions:**
- **Add Member** — opens inline form with agent combobox (predefined only, excludes current members); **Add** button calls `onAddMember(agentId, "member")`
- **Remove (X)** per member row — calls `onRemoveMember(agentId)` (hidden for lead role)

### Team Info Dialog
**Trigger:** Info button on team board
**Displays:** Team name, status badge, description, lead agent, member count; embedded settings tab

**Actions:**
- Click **"v2 Super Team" badge** — opens TeamFeaturesModal (informational)

### TeamFeaturesModal (sub-dialog)
**Trigger:** "v2 Super Team" badge in Team Info Dialog
**Displays:** v2 feature information (read-only)

### Create Task Dialog
**Trigger:** "Create Task" button on team board
**Fields:**
- Subject (text, required)
- Description (textarea, optional)
- Type (select: general / delegation / escalation)
- Priority (number, 0–N)
- Assign To (select from team members, optional; lead shown with "(Lead)" suffix)

**Actions:**
- **Create Task** — validates subject; calls `createTask(...)` with scope binding from selected channel/chat; resets and closes
- **Cancel** — closes dialog

### Task Detail Dialog
**Trigger:** Click task card on board
**Displays:** Task ID, status badge, subject, progress bar (V2), follow-up banner (V2), metadata grid (priority, owner, type, dates), blocked-by badges, description, result, attachments, comments, timeline

**Actions:**
- **Delete** — (terminal status tasks only) opens ConfirmDialog → calls `deleteTask(teamId, taskId)`
- **Add Comment** (V2) — text input + submit → calls `onAddComment(teamId, taskId, content)`
- **Navigate blocked-by** — click badge → calls `onNavigateTask(taskId)`
- **ConfirmDialog** (sub-dialog for delete): Cancel / Delete (destructive)

### Team Workspace Dialog
**Trigger:** "Workspace" button on team board
**Displays:** File browser (90vh × 95vw) — scope selector, directory tree, file content viewer

**Header Actions:**
- **Scope Selector** — filter by chat_id or "All"
- **Upload** — opens FileUploadDialog
- **Refresh** — reloads file list

**File Actions:**
- **Select file** — loads content in viewer
- **Delete file** — calls `deleteFile()`
- **Move file** — drag-drop to folder
- **Download file** — fetches blob and triggers browser download

### FileUploadDialog (sub-dialog)
**Trigger:** Upload button in Team Workspace Dialog
**Fields:** Drag-drop area for files, target folder display
**Actions:**
- **Upload** — uploads to `/v1/teams/{teamId}/workspace/upload`
- **Cancel** — closes
