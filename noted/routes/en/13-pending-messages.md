# Pending Messages

**Route:** `/pending-messages`
**Access:** Operator+

## What It Shows
Table of pending message groups waiting to be processed. Columns: channel, group title, message count, status (raw / compacted), last activity. Expandable "How It Works" info card at top.

## Actions
- **Compact message group** — trigger LLM summarization of the group, polls until complete
- **Clear message group** — delete with confirm dialog
- **View messages** — dialog showing individual messages in the group
- **Refresh**

## Sub-features
- Status badges: raw / compacted
- Compaction polls for completion in real-time
- Expandable info card explaining the pending messages flow
