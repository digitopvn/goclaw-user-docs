# Cron Jobs

**Route:** `/cron`
**Access:** Auth

## What It Shows
Paginated list of all cron jobs with search.

## Actions
- **Create cron job** — form dialog (schedule expression, payload, target agent)
- **Run now** — manually trigger a job immediately
- **Delete job** — confirm dialog
- **View job detail** — click to navigate to detail page
- **Refresh**

## Sub-features
- Search by job name
- Pagination

## Dialogs

### Create Cron Job Dialog
**Trigger:** "Create Cron Job" button
**Fields:**
- Name (text, required, auto-slugified)
- Agent ID (select — choose agent or default/any)
- Schedule Type (button group: every / cron / at)
  - **every:** Interval in Seconds (number, min=1)
  - **cron:** Cron Expression (text, e.g. `0 * * * *`)
  - **at:** One-time, set to now + 1 min (no user input)
- Message (textarea, 3 rows, required)

**Actions:**
- **Create** — validates name + message + schedule; calls `onSubmit({name, schedule, message, agentId})`; shows "Creating..." spinner
- **Cancel** — closes dialog
