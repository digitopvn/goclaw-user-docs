# Contacts

**Route:** `/contacts`
**Access:** Operator+

## What It Shows
Paginated table of contacts from all channels. Columns: name, username, sender ID, channel type, peer kind (direct/group), last seen. Selection checkboxes for bulk actions. Permissions note explaining per-channel capabilities.

## Actions
- **Search contacts** — submit-based search
- **Filter by channel type** — dropdown
- **Filter by peer kind** — direct / group
- **Select contacts** — checkboxes for bulk selection
- **Merge selected contacts** — dialog (combines duplicate contacts)
- **Unmerge selected contacts** — available when all selected contacts are merged
- **Refresh**

## Sub-features
- Submit-based search (not live)
- Bulk select with merge/unmerge
- Permissions note explaining what data is available per channel type
- Pagination

## Dialogs

### Merge Contacts Dialog
**Trigger:** "Merge" button (requires 2+ contacts selected)
**Fields:**
- Mode (radio button):
  - **Link to Existing User** — UserPickerCombobox to select target user
  - **Create New User** — optional Display Name + User ID (auto-generated default)

**Actions:**
- **Merge** — links/creates user and merges selected contacts under them
- **Cancel** — closes
