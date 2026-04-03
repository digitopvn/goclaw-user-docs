# Teams

**Route:** `/teams`
**Access:** Auth

## What It Shows
Paginated list of all teams in card or list view, with search.

## Actions
- **Create team** — open creation dialog
- **Delete team** — confirm dialog
- **View team detail** — click card/row to navigate to detail page
- **Toggle card/list view** — switch display mode

## Sub-features
- Pagination
- Search

## Dialogs

### Team Create Dialog
**Trigger:** "Create Team" button
**Fields:**
- Team Name (text, required)
- Description (text, optional)
- Lead Agent (combobox, required — any active agent type)
- Members (combobox + badge list, predefined agents only, excludes lead)
  - Add via combobox selection
  - Remove via X badge

**Actions:**
- **Create** — validates name + lead + at least 1 member; creates team; resets and closes
- **Cancel** — closes dialog
