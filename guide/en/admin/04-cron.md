# Cron and Automated Scheduling

## Overview

Cron allows agents to run automatically on a preset schedule — no manual message sending required. Each cron job triggers an agent turn with a specific prompt, running in a separate `cron` lane (up to 30 concurrent threads).

**List route:** `/cron` — Logged in
**Detail route:** `/cron/:id` — Logged in

---

## Guide

### 3 Schedule Expression Types

| Type | Parameter | Example | Behavior |
|------|-----------|---------|----------|
| `at` | Epoch ms timestamp | Tomorrow 15:00 | Runs once, auto-deletes after execution |
| `every` | Interval in ms | `1800000` (30 min) | Fixed repeat |
| `cron` | 5-field expression | `"0 9 * * 1-5"` | Flexible schedule |

**5-field cron expression:** `minute hour day-of-month month day-of-week`

Common examples:
- `"0 9 * * 1-5"` — 9:00 AM on weekdays
- `"0 */6 * * *"` — every 6 hours
- `"30 8 * * 0"` — Sunday 8:30 AM

### Creating a Cron Job

1. Go to **Cron > New Job**
2. Fill in the fields:
   - **Name**: descriptive name (required, slug auto-generated)
   - **Agent**: select the agent to run
   - **Prompt/Message**: message content sent to the agent (required)
   - **Schedule**: select schedule type and enter the value
     - `every`: interval in seconds (minimum 1)
     - `cron`: cron expression (e.g. `0 * * * *`)
     - `at`: one-time, default = now + 1 minute
3. Click **Create** — the job starts running immediately

### Managing Jobs

**Enable/Disable:** Click the toggle on the row or in the job detail. A disabled job is skipped during the periodic check cycle.

**Delete:** Click **Delete** on the row, confirm before deletion. `at` jobs are automatically deleted after execution.

**Manual Trigger:** Go to job detail > click **Run Now** — useful for testing before setting up the official schedule.

**Run History:** Go to job detail > view **Run History** — execution time, duration, status, output, and error messages. The system stores up to 200 records.

### Advanced Settings (Job Detail)

- **Timezone**: IANA timezone (default UTC)
- **Delivery**: Deliver to Channel (toggle) — select Channel + Recipient; Wake Heartbeat (toggle)
- **Lifecycle**: Delete After Run (toggle); Stateless (toggle)

---

## User Interface (UI)

### List Page (`/cron`)

**Display:** Paginated list of all jobs with search: status, schedule, next run, last run.

**Actions:** Create job | Run Now | Delete | View details | Refresh

**Create Job Dialog:**
- Fields: Name (required), Agent ID, Schedule Type (button group: every/cron/at), Message (required)
- Actions: **Create** | **Cancel**

### Detail Page (`/cron/:id`)

**Display:** Schedule, payload, target agent, run history, enabled/disabled status.

**Actions:** Run Now | Enable/Disable | Update settings | Delete | View run log

**Run Log Dialog:** Scrollable list — time, status badge (green/red), summary, error. Empty state: "No run history yet."

**Advanced Settings Dialog:** Timezone, Delivery, Lifecycle. **Save** | **Cancel**

---

## Lane-Based Concurrency

| Lane | Default Concurrency | Override Env |
|------|:-------------------:|--------------|
| `main` | 30 | `GOCLAW_LANE_MAIN` |
| `subagent` | 50 | `GOCLAW_LANE_SUBAGENT` |
| `team` | 100 | `GOCLAW_LANE_TEAM` |
| `cron` | 30 | `GOCLAW_LANE_CRON` |

Cron jobs do not compete for resources with chat sessions. Jobs within the same session are queued sequentially to avoid race conditions.

---

## Automatic Retry

| Parameter | Value |
|-----------|-------|
| Max retries | 3 |
| Initial delay | 2 seconds |
| Max delay | 30 seconds |

Formula: `delay = min(2 x 2^attempt, 30)` +/- 25% jitter.

---

## Practical Examples

**Daily report:**
- Type: `cron`, Expression: `"0 8 * * 1-5"`
- Agent: Analyst Agent
- Prompt: *"Generate a system activity report for the past 24 hours and send a summary to the #reports channel"*

**Periodic health check:**
- Type: `every`, Interval: `1800000` (30 minutes)
- Agent: Monitor Agent
- Prompt: *"Check the status of the main services, report if anomalies are detected"*

---

## Notes

- The `cron` lane supports a maximum of 30 concurrent jobs
- `at` jobs are automatically deleted after execution — no manual cleanup needed
- Use **Run Now** to test before setting up the official schedule

---

## See Also

- [guide/en/admin/06-theo-doi.md](06-theo-doi.md) — Viewing run history and traces
- [guide/en/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — The `cron` tool for agents to self-manage jobs
