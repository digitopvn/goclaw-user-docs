# Contacts

## Overview

The Contacts page displays all contacts from connected channels (Telegram, Discord, Slack, etc.). Use it to manage, search, and merge duplicate contacts.

**Route:** `/contacts`
**Access:** Operator+

---

## Usage Guide

### Search and Filter Contacts

- **Search by name / username / sender ID** — enter a keyword, click the Submit button
- **Filter by channel type** — dropdown to select a channel (Telegram, Discord, Slack, etc.)
- **Filter by type** — Direct (DM) or Group

### Merge Duplicate Contacts

When the same person appears across multiple channels, you can merge them into a single profile:

1. Select the contacts to merge (checkbox)
2. Click **Merge**
3. Choose the merge mode:
   - **Link to existing user** — select a user from the combobox
   - **Create new user** — enter a name + new ID
4. Click **Merge**

### Unmerge

When all selected contacts have already been merged, the **Unmerge** button appears — use it to undo the merge.

---

## Interface (UI)

### List Page (`/contacts`)

**Display:** Paginated table of contacts from all channels with columns:
- Name
- Username
- Sender ID
- Channel (type)
- Type (direct / group)
- Last Seen

**Actions:**
- Checkbox for bulk selection
- **Search** — search with the Submit button
- **Filter by channel type** — dropdown
- **Filter by type** — direct / group
- **Merge** — combine duplicate contacts
- **Unmerge** — shown when all selected contacts are already merged

**Merge Contacts Dialog:**
- Mode (radio): Link to existing user (combobox) or Create new user (name + ID)
- Actions: **Merge** | **Cancel**

---

## Example

### Merge Multi-Channel Contacts

User "Nguyen Van A" sends messages via Telegram (ID: 123456) and Discord (ID: abc#1234):

1. Search for "Nguyen Van A" in the list
2. Select both rows
3. Click **Merge**
4. Choose **Create new user**, enter the name "Nguyen Van A"
5. Click **Merge**

Result: chat history from both channels is linked to the same profile.

---

## Notes

- Operator permission or higher is required to access the Contacts page
- Merging contacts does not delete chat history — it only links the sender IDs together
- Unmerge is only available when all selected contacts have been previously merged

---

## See Also

- [Managing agent teams](01-teams.md)
- [Channel configuration](../admin/02-channels-setup.md)
