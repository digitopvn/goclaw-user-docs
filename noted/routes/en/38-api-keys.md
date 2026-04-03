# API Keys

**Route:** `/api-keys`
**Access:** Admin

## What It Shows
Table of API keys. Columns: name, prefix (first 8 chars), scopes, tenant (owner view only), status (active / revoked / expired), expiry date, last used.

## Actions
- **Create API key** — dialog (full key shown once — must copy immediately)
- **Revoke API key** — confirm dialog
- **Copy newly created key** — one-time copy after creation
- **View code examples** — dialog with usage examples
- **Search**
- **Refresh**

## Sub-features
- Full key only shown at creation time; afterwards only prefix is displayed
- Status badges: active / revoked / expired
- Scoped permissions (e.g., `operator.admin`, `operator.read`)
- Pagination

## Dialogs

### Create API Key Dialog
**Trigger:** "Create API Key" button
**Fields:**
- Name (text, required)
- Tenant (select, owner view only)
- Scopes (6 checkboxes in grid): operator.admin / operator.read / operator.write / operator.approvals / operator.pairing / operator.provision
- Expiry (select: Never / 7 days / 30 days / 90 days)

**Actions:**
- **Create** — generates key; full key shown once with **Copy** button; closes after copying
- **Cancel** — closes

**Post-creation:** Shows full key string with one-time copy button (key not recoverable after dialog closes)

### Code Examples Dialog
**Trigger:** "View Code Examples" button
**Displays:** Three syntax-highlighted code tabs — curl / TypeScript / Go — showing how to use the key

**Actions:**
- **Copy** per tab — copies code snippet to clipboard
- **Close** — dismisses (read-only)
