# Traces

**Route:** `/traces`
**Access:** Operator+

## What It Shows
Paginated table of LLM request traces. Columns: name, status, duration, tokens in/out + cached, span count, timestamp. Agent and channel filter dropdowns.

## Actions
- **Filter by agent** — dropdown filter
- **Filter by channel** — dropdown filter
- **Abort running trace** — stop button on in-progress rows
- **View trace detail** — click row to open detail dialog
- **Refresh**

## Sub-features
- Running traces show a stop button
- Pagination

## Dialogs

### Trace Detail Dialog
**Trigger:** Click trace row

**Header Actions:**
- **Copy Trace ID** — copies ID to clipboard (check icon on success)
- **Export** — downloads `trace-{id}.json.gz`
- **Stop Run** — (running traces only) calls `onAbortRun(trace)`

**Trace Summary Grid (4-col):**
- Name, Status badge, Duration, Channel
- Tokens in/out + cache breakdown
- Span counts (total / llm_calls / tool_calls)
- Started time, Created time
- Parent trace ID (clickable, if delegated)

**Preview Blocks:**
- Input preview + copy button
- Output preview + copy button
- Error block (red border, if error present)

**Span Tree:**
- Expandable/collapsible hierarchy
- Per span: type badge, name, token counts (in/out), cache/thinking tokens, duration, status
- Click span → toggles inline detail panel

**Span Detail Panel (expanded):**
- Start/end times, model (provider/model)
- Token breakdown: input / output / cache / thinking
- Reasoning metadata: effort level, source, fallback, supported levels
- Input/output previews + copy
- Error text (if present)

**Actions:**
- **Expand/collapse** span rows — chevron toggle
- **Click span** — toggle detail expansion
- **Click parent trace** — navigates to parent trace
- **Copy** on any preview — clipboard
