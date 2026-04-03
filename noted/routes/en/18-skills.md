# Skills

**Route:** `/skills`
**Access:** Auth

## What It Shows
Two-tab table of skills: Core (system/bundled) and Custom (user-uploaded). Columns: name, description, author (custom only), status (active/archived + missing deps indicator), visibility (custom only), actions. Missing dependencies panel shown at top when deps are absent.

## Actions
- **Upload custom skill** — file upload dialog (new or update existing)
- **Edit skill metadata** — dialog for name, description, visibility, tags
- **Delete custom skill** — confirm dialog
- **Toggle enable/disable** — switch per skill
- **Cycle visibility** — click badge to cycle public → internal → private
- **Rescan dependencies** — scan all skills for missing deps
- **Install single dependency** — install one missing dep
- **View skill detail** — dialog with versions, files, and file content viewer
- **Set tenant override** — enable/disable skill for current tenant
- **Reset tenant override** — revert to global default

## Sub-features
- Two tabs: Core / Custom
- Missing dependencies panel at top
- Search and pagination
- Refresh button

## Dialogs

### Upload Skill Dialog
**Trigger:** "Upload" button (Custom tab only)
**Fields:**
- Drag-drop zone (accepts `.zip` files)
- Per-file status: validating → valid/invalid → uploading → success/error
- File entry row: status icon, filename, size, error message, remove (X)

**Actions:**
- **Upload [N]** — uploads all valid files concurrently (N = valid file count)
- **Done** — closes after completion
- **Cancel** — closes (disabled during upload)
- **Remove (X)** per file — removes from list before upload

### Edit Skill Dialog
**Trigger:** Edit/pencil button on skill row
**Fields:**
- Name (text, required)
- Description (textarea, 3 rows)
- Visibility (select: private / internal / public)
- Tags (text input + add button; badges with X to remove)
  - Add: Enter key or button click

**Actions:**
- **Save** — calls `onSave(skill.id, {name, description, visibility, tags})`; disabled if name empty or saving
- **Cancel** — closes without saving

### Skill Detail Dialog
**Trigger:** Click skill name in table
**Tabs:**
- **Content** — markdown-rendered README, copy button
- **Files** — version selector dropdown, file tree browser, file content viewer with syntax highlighting

**Actions:**
- **Version selector** — loads files for selected version
- **Click file in tree** — displays file content
- **Copy** — copies content to clipboard

### Missing Deps Panel (inline)
**Trigger:** Auto-shown when dependencies are missing
**Sections:** System | Python (pip) | Node (npm)

**Actions:**
- **Install** per dep — calls `onInstallItem(dep)`; shows spinner / ✓ / ✕ per dep
- **Go to Packages** link — navigates to `/packages`

### Tenant Override (inline per skill row)
**Trigger:** Always visible in tenant scope
**Fields:** Status badge (Enabled / Disabled / Default), toggle switch

**Actions:**
- **Toggle** — calls `onSetTenantConfig(skill.id, enabled)`
- **Reset (X)** — calls `onDeleteTenantConfig(skill.id)` (visible when override exists)
