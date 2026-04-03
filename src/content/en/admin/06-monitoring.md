# Monitoring and Logs

<YouTube id="6hcStzQMqOI" title="GoClaw Monitoring and Logs" />

## Overview

GoClaw provides 5 monitoring tools: Traces (LLM calls), Events (real-time), Activity (audit log), Logs (system log), and Usage Stats. All tools are grouped under the **Monitoring** sidebar section.

**Routes:**
- `/traces` — Operator+
- `/traces/:id` — Operator+
- `/events` — Operator+
- `/activity` — Operator+
- `/logs` — Admin

---

## Guide

### Viewing Traces

Traces record all agent activity per request: LLM calls, tool calls, token count, latency, cost.

1. Go to **Traces** in the main menu
2. Filter by: Agent, Channel, Status (`running` / `success` / `error` / `cancelled`)
3. Click on a trace to view details

**Trace information:**

| Field | Description |
|-------|-------------|
| Duration | Total execution time |
| Input / Output tokens | Total LLM tokens used |
| Cost | Estimated cost |
| Status | Final status |
| Tool calls | Number of tools called |

**Stop a running trace:** Click the stop button on the active row.

**Export trace:** Click **Export trace** in the trace detail -> downloads `trace-{id}.json.gz`.

### Trace Detail — Span Tree

Each trace consists of multiple hierarchical spans:

```
Agent Span (root)
  LLM Call Span 1 — model, tokens, finish reason
  Tool Span: exec
  LLM Call Span 2
  Tool Span: read_file
  LLM Call Span N
```

**Span types:**

| Type | Description |
|------|-------------|
| `agent` | Root span, covers the entire agent run |
| `llm_call` | A single LLM provider call |
| `tool_call` | A single tool execution |
| `embedding` | Vector embedding generation |
| `event` | Discrete event (no duration) |

**Prompt Cache Metrics** (Anthropic Claude): displays `cache_read_tokens` and `cache_create_tokens` in the `llm_call` span.

**Verbose Mode** (view full content): set the environment variable `GOCLAW_TRACE_VERBOSE=1`. Stores up to 200KB per input/output span.

### Events — Real-Time Events

**Route `/events`:** Live event stream via WebSocket in chronological order.

- **Filter by category:** team.task / team.message / agent / team.crud / agent_link
- **Filter by team / user / chat** — dropdown
- **Pause / Resume** stream
- **Clear all events** — clears the current view

Events auto-scroll to the bottom when new events arrive.

### Activity — Audit Log

**Route `/activity`:** Paginated audit log table — action, actor, entity type, entity ID, IP address, timestamp.

- Filter by action type (e.g. `agent.created` / `agent.updated` / `agent.deleted`)
- Filter by entity type
- View only, no data-modifying actions

**Admin actions recorded:**
- Create / revoke API key
- Agent configuration changes
- Approve / deny browser pairing
- RBAC and access control changes
- Create / delete cron job

### Logs — System Logs

**Route `/logs`:** Real-time log viewer, dark terminal interface.

Each entry: timestamp, level (debug/info/warn/error), source, message, attributes.

**Actions:**
- Select level before starting monitoring
- **Start** — stream logs live
- **Stop** — pause stream
- **Filter by level** — pill: debug / info / warn / error
- **Text search** — filter by keyword
- **Clear logs** — clear current view

**Filtering security events** from log file:
```bash
grep "security." goclaw.log
```

| Event | Meaning |
|-------|---------|
| `security.injection_detected` | Prompt injection detected |
| `security.injection_blocked` | Message blocked |
| `security.rate_limited` | Request rate limited |
| `security.cors_rejected` | WebSocket connection rejected |
| `security.message_truncated` | Message truncated due to excessive length |

---

## User Interface (UI)

### Traces Page (`/traces`)

**Display:** Paginated table: name, status, duration, input/output tokens + cache, span count, timestamp. Agent and channel filters.

**Trace Detail Dialog:**
- Header: Copy Trace ID | Export trace | Stop (running trace)
- Summary grid: Name, Status, Duration, Channel, Tokens, Span count, Start time, Parent trace (clickable)
- Preview blocks: input + copy | output + copy | error block (red border)
- Span Tree: type badge, name, tokens, cache/thinking, duration, status. Click span -> detail panel: timing, model, token breakdown, reasoning metadata, input/output preview

### Trace Detail Page (`/traces/:id`)

Opens as a dialog on the `/traces` page. Collapsible span tree. Time and token breakdown per span. **Navigate** previous/next trace.

### Events Page (`/events`)

Real-time event stream. Auto-scroll to bottom. Real-time WebSocket subscription.

### Activity Page (`/activity`)

Paginated audit log table. View only.

### Logs Page (`/logs`)

Dark terminal interface. Auto-scroll to bottom when new logs arrive. Select level before starting monitoring.

---

## Usage Stats

The system aggregates hourly statistics into the `usage_snapshots` table.

| Metric | Description |
|--------|-------------|
| `request_count` | Number of agent runs |
| `error_count` | Number of failed runs |
| `unique_users` | Number of unique users |
| `input_tokens` / `output_tokens` | Total tokens |
| `total_cost` | Total estimated cost |
| `tool_call_count` | Total tool calls |
| `avg_duration_ms` | Average duration per run |
| `cache_read_tokens` | Tokens read from prompt cache |

**Aggregation cycle:** `SnapshotWorker` runs every hour at minute 5 (HH:05:00 UTC). On startup, it automatically backfills missed hours.

**Cost formula:**
```
Cost = (input_tokens x InputCostPerM) / 1,000,000
     + (output_tokens x OutputCostPerM) / 1,000,000
     + (cache_read_tokens x CacheReadCostPerM) / 1,000,000
     + (cache_create_tokens x CacheCreateCostPerM) / 1,000,000
```

---

## OpenTelemetry — External Export

Supports exporting spans to Jaeger, Grafana Tempo, Datadog via OTLP.

Add to `config.json`:
```json
{
  "tracing": {
    "otel": {
      "endpoint": "localhost:4317",
      "protocol": "grpc",
      "insecure": true,
      "service_name": "goclaw-gateway",
      "headers": {}
    }
  }
}
```

| Parameter | Description |
|-----------|-------------|
| `endpoint` | OTLP endpoint (gRPC: 4317, HTTP: 4318) |
| `protocol` | `grpc` (default) or `http` |
| `insecure` | Skip TLS for dev environments |
| `service_name` | Default: `goclaw-gateway` |

When OTel is configured, spans are written to both PostgreSQL and the OTLP backend. Batch: up to 100 spans every 5 seconds.

> Note: the OTel package adds ~15-20MB to binary size. Not configuring OTel has no performance impact.

---

## Notes

- Route `/logs` requires Admin permission; other routes require Operator+
- Verbose mode (`GOCLAW_TRACE_VERBOSE=1`) can significantly increase storage usage
- System logs are output to the GoClaw process stdout

---

## See Also

- [Security events and injection detection](05-security.md)
- [Cron job run logs](04-cron.md)
