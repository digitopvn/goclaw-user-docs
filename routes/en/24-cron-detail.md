# Cron Job Detail

**Route:** `/cron/:id`
**Access:** Auth

## What It Shows
Full detail view of a single cron job: schedule, payload, target agent, run history/logs, and enable/disable state.

## Actions
- **Run now** — trigger an immediate manual execution
- **Toggle enable/disable** — pause or resume the job
- **Update settings** — edit schedule, payload, or agent
- **Delete job** — remove permanently
- **View run logs** — paginated log of past executions

## Sub-features
- Run history with status indicators
- Back navigation to cron list

## Dialogs

### Run Log Dialog
**Trigger:** History/logs section in cron detail
**Displays:** Scrollable log entries — timestamp, status badge (ok/success=green, error/failed=red), summary text, error text
**Empty state:** "No run history"

**Actions:**
- **Close** — only action (read-only dialog)

### Cron Advanced Settings Dialog
**Trigger:** Advanced/settings button in header

**Fields:**
- **Scheduling:**
  - Timezone (select, IANA list, default UTC)
- **Delivery:**
  - Deliver to Channel (switch) → Channel (text) + To (text) when enabled
  - Wake Heartbeat (switch)
- **Lifecycle:**
  - Delete After Run (switch) — auto-delete after single execution
  - Stateless (switch) — each run independent

**Actions:**
- **Save** — persists all changes
- **Cancel** — closes without saving
