# MCP Servers

**Route:** `/mcp`
**Access:** Admin

## What It Shows
Table of MCP (Model Context Protocol) server integrations. Columns: name, transport type (stdio / sse / streamable-http), tool count, agent count, enabled status, created by.

## Actions
- **Add MCP server** — form dialog with test connection
- **Edit MCP server** — update configuration
- **Delete MCP server** — confirm dialog
- **Reconnect server** — re-establish connection
- **Manage agent grants** — dialog: grant/revoke per-agent access with allow/deny tool lists
- **View tools** — dialog listing available tools from this server
- **Manage user credentials** — dialog: get/set/delete per-user credentials for this server
- **Search**
- **Refresh**

## Sub-features
- Test connection on add
- Per-agent tool allow/deny lists
- Per-user credential management
- Pagination

## Dialogs

### MCP Form Dialog (Add / Edit)
**Trigger:** "Add MCP Server" button or edit button on row
**Fields:**
- Name (text)
- Display Name (text)
- Transport (toggle: stdio / SSE / HTTP)
  - **stdio:** Command (text) + Args (text)
  - **SSE/HTTP:** URL (text) + Headers (key-value editor)
- Env Vars (key-value editor)
- Tool Prefix (text)
- Timeout (number)
- Enabled (switch)
- Require User Credentials (switch)

**Actions:**
- **Test Connection** — verifies connectivity before saving
- **Create / Update** — saves the server configuration
- **Cancel** — closes

### Agent Grants Dialog
**Trigger:** "Manage Agent Grants" button on row
**Displays:** Two-part UI — (1) existing grants list, (2) grant form

**Existing Grants:**
- Lists agents with current grant; each has **Revoke** button

**Grant Form:**
- Agent selector (dropdown)
- Tool Allow list (multi-select with search)
- Tool Deny list (multi-select with search)
- Uses React Portal for dropdown to avoid dialog clipping

**Actions:**
- **Grant / Update** — saves grant for selected agent
- **Revoke** per existing grant — removes agent's access
- **Cancel** — closes

### View Tools Dialog
**Trigger:** "View Tools" button on row
**Displays:** Scrollable tool list with search filter — tool name, description, tool prefix badge, total count

**Actions:**
- **Search** — filters tool list (read-only, no mutations)
- **Close** — dismisses

### User Credentials Dialog
**Trigger:** "Manage User Credentials" button on row
**Displays:** User selector (admin view), credential status badges (API Key / Headers / Env Vars), form for editing

**Fields:**
- User (select)
- API Key (password input)
- Headers (key-value editor, sensitive masking)
- Env Vars (key-value editor, sensitive masking)

**Actions:**
- **Save** — persists credentials for selected user
- **Delete All** — removes all credentials for user (destructive)
- **Cancel** — closes
