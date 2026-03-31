# Agent Detail

**Route:** `/agents/:id`
**Access:** Auth

## What It Shows
Agent detail page with 4 tabs: Overview, Files, Permissions, Instances (predefined agents only).

## Actions
- **Update configuration** — edit agent settings in Overview tab
- **Regenerate from prompt** — rebuild agent definition from a prompt
- **Resummon** — re-initialize the agent
- **Delete agent** — confirm dialog
- **Advanced settings** — open advanced settings dialog
- **Configure heartbeat** — set up health checks, checklist, and targets
- **Manage Codex Pool** — navigate to codex pool page (`/agents/:id/codex-pool`)
- **View/edit files** — system prompt, tool definitions, context files (Files tab)
- **Manage permissions** — Permissions tab
- **View instances** — Instances tab (predefined agents only)

## Sub-features
- 4 tabs: Overview / Files / Permissions / Instances
- Heartbeat configuration dialog
- Advanced settings dialog

## Dialogs

### Advanced Settings Dialog
**Trigger:** "Advanced Settings" button in page header

**Sections & Fields:**
- **Workspace Sharing:** share DM flag, share group flag, shared users combobox, share memory flag
- **Thinking/Reasoning:**
  - Reasoning Mode (Inherit / Custom toggle)
  - Thinking Level (off / low / medium / high — simple mode)
  - Reasoning Effort (off / auto / low / medium / high / advanced — expert mode)
  - Reasoning Fallback (downgrade / degrade / disable)
  - Expert Mode (switch to unlock advanced levels)
- **ChatGPT OAuth Routing:** provider selection, routing config, membership management
- **Compaction Settings:** token budget, merge rules
- **Context Pruning:** enabled switch + mode (aggressive / balanced / conservative) + max context length
- **Sandbox:** enabled switch + isolation level config

**Actions:**
- **Save** — merges config, preserves unmanaged keys, updates agent
- **Cancel** — closes without saving

### Heartbeat Config Dialog
**Trigger:** Heartbeat button in page header

**Fields:**
- Enabled (switch)
- Interval (number, min=5 minutes)
- Provider override (combobox)
- Model override (combobox)
- Channel (select dropdown)
- Chat ID (select or text input)
- Active Hours Start / End (time HH:MM)
- Timezone (IANA timezone select)
- **Advanced (collapsible):** Ack Max Chars, Max Retries, Isolated Session (switch), Light Context (switch)
- Checklist (textarea, monospace, markdown)

**Actions:**
- **Test Run** — sends immediate test heartbeat
- **Save** — saves all settings + checklist if changed
- **Cancel** — closes without saving

### Heartbeat Logs Dialog
**Trigger:** Logs view from heartbeat section
**Displays:** Paginated log list — timestamp, status badge (success/error/suppressed/skipped), token counts, duration, summary, error

**Actions:**
- **Refresh** — reloads current page
- **Previous / Next** — pagination controls

### Regenerate Dialog (Files Tab)
**Trigger:** "Edit with AI" button in Files tab (predefined agents only)
**Fields:**
- Prompt (textarea) — instruction for regenerating the file

**Actions:**
- **Regenerate** — calls onRegenerate(prompt); clears and closes on success
- **Cancel** — closes without action

### Resummon Confirmation (Files Tab)
**Trigger:** "Resummon" button in Files tab header (predefined, owner only)
**Actions:**
- **Resummon** — re-initializes the agent
- **Cancel** — closes

### Permissions Tab (Inline Form)
**Trigger:** Always visible on Permissions tab
**Fields:**
- User ID (UserPickerCombobox)
- Config Type (select: file_writer / heartbeat / cron / context_files / *)
- Scope (combobox, options depend on configType)
- Permission (select: allow / deny)

**Actions:**
- **Add (+)** — grants the rule via `grant(scope, configType, userId, permission)`
- **Delete (X)** per rule row — revokes that rule
- **Refresh** — reloads permissions list
