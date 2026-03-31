# WebSocket RPC

GoClaw uses WebSocket JSON-RPC (protocol v3) as its primary control plane. Clients connect to `/ws`, authenticate via a `connect` frame, then exchange request/response/event frames.

---

## Overview

- **Connection URL:** `ws://<host>:<port>/ws`
- **Protocol version:** 3
- **Authentication:** A `connect` frame is required as the first request after upgrade
- **Format:** Plain JSON, each frame is a JSON object

---

## Connection and Authentication

After a successful WebSocket upgrade (HTTP 101), the first request must be `connect`:

```json
{
  "type": "req",
  "id": "client-gen-uuid",
  "method": "connect",
  "params": {
    "token": "gateway-token-or-api-key",
    "user_id": "external-user-id",
    "sender_id": "optional-device-id",
    "locale": "en"
  }
}
```

**Successful response:**
```json
{
  "type": "res",
  "id": "client-gen-uuid",
  "ok": true,
  "payload": {
    "protocol": 3,
    "role": "admin",
    "user_id": "user-123",
    "server": {"version": "1.0.0", "uptime": "2h30m"}
  }
}
```

**Authentication flow:** Gateway token is compared using timing-safe comparison -> admin role. If no match, SHA-256 hash -> API key lookup -> role inferred from scopes. Pairing codes are also accepted for channel devices.

### Connection Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Read limit | 512 KB | Automatically closes connection if exceeded |
| Send buffer | 256 | Drops messages when full |
| Read deadline | 60s | Reset on each message or pong |
| Write deadline | 10s | Timeout per write |
| Ping interval | 30s | Server keepalive |

---

## Frame Format

### Request Frame (Client -> Server)

```json
{
  "type": "req",
  "id": "<client-gen-uuid>",
  "method": "<method-name>",
  "params": { ... }
}
```

### Response Frame (Server -> Client)

```json
{
  "type": "res",
  "id": "<matches-request-id>",
  "ok": true,
  "payload": { ... }
}
```

On error:
```json
{
  "type": "res",
  "id": "<matches-request-id>",
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "permission denied",
    "details": "",
    "retryable": false,
    "retryAfterMs": 0
  }
}
```

### Event Frame (Server -> Client)

```json
{
  "type": "event",
  "event": "<event-name>",
  "payload": { ... },
  "seq": 42,
  "stateVersion": { ... }
}
```

---

## Methods — By Group

### System

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `connect` | Authentication handshake (must be the first request) | — |
| `health` | Check server health and connected clients | Viewer |
| `status` | Quick agent/session/client counts | Viewer |

### Chat

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `chat.send` | Send message to agent, receive response (supports streaming) | Operator |
| `chat.history` | Get chat history for a session | Viewer |
| `chat.abort` | Cancel running agent invocations | Operator |
| `chat.inject` | Inject message into session transcript without triggering the agent | Operator |

**`chat.send` request:**
```json
{
  "message": "Hello agent",
  "agentId": "uuid-or-key",
  "sessionKey": "optional-session",
  "stream": true,
  "media": [{"type": "image", "url": "..."}]
}
```

When `stream: true`, intermediate events are emitted: `chunk`, `tool.call`, `tool.result`, `run.started`, `run.completed`.

### Sessions

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `sessions.list` | List sessions (paginated) | Viewer |
| `sessions.preview` | Get session history and summary | Viewer |
| `sessions.patch` | Update label, model, metadata | Operator |
| `sessions.delete` | Delete session | Operator |
| `sessions.reset` | Clear all messages in a session | Operator |

### Agents

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `agents.list` | List all agents | Viewer |
| `agent` | Get a specific agent's state | Viewer |
| `agent.wait` | Wait for agent to complete | Viewer |
| `agent.identity.get` | Get agent identity (name, emoji, avatar, description) | Viewer |
| `agents.create` | Create a new agent | Admin |
| `agents.update` | Update agent properties | Admin |
| `agents.delete` | Delete agent | Admin |
| `agents.files.list` | List agent context files | Admin |
| `agents.files.get` | Read context file content | Admin |
| `agents.files.set` | Write context file content | Admin |

### Teams

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `teams.list` | List all teams | Admin |
| `teams.create` | Create a new team | Admin |
| `teams.get` | Get team details with members | Admin |
| `teams.update` | Update team properties | Admin |
| `teams.delete` | Delete team | Admin |
| `teams.members.add` | Add agent to team with role | Admin |
| `teams.members.remove` | Remove agent from team | Admin |
| `teams.tasks.list` | List team tasks (filterable) | Admin |
| `teams.tasks.get` | Get task with comments/events | Admin |
| `teams.tasks.create` | Create task | Admin |
| `teams.tasks.approve` | Approve task | Admin |
| `teams.tasks.reject` | Reject task | Admin |
| `teams.tasks.comment` | Add comment to task | Admin |
| `teams.tasks.assign` | Assign task to member | Admin |
| `teams.tasks.delete` | Delete task | Admin |
| `teams.known_users` | Get list of user IDs in team | Admin |
| `teams.scopes` | Get channel/chat scopes for task routing | Admin |
| `teams.workspace.list` | List workspace items | Admin |
| `teams.workspace.read` | Read workspace file content | Admin |
| `teams.workspace.delete` | Delete workspace item | Admin |

### Cron

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `cron.list` | List cron jobs | Viewer |
| `cron.create` | Create a scheduled job | Operator |
| `cron.update` | Update job settings | Operator |
| `cron.delete` | Delete job | Operator |
| `cron.toggle` | Enable/disable job | Operator |
| `cron.status` | Get scheduler status | Viewer |
| `cron.run` | Trigger immediate execution | Operator |
| `cron.runs` | List execution history | Viewer |

**`cron.create` request:**
```json
{
  "name": "daily-report",
  "schedule": "every day at 09:00",
  "message": "Generate daily report",
  "deliver": "channel",
  "channel": "telegram",
  "to": "chat-id",
  "agentId": "uuid"
}
```

### Skills

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `skills.list` | List all available skills | Viewer |
| `skills.get` | Get skill metadata and content | Viewer |
| `skills.update` | Update skill metadata (DB-backed only) | Operator |

### Config

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `config.get` | Get current configuration (secrets masked) | Viewer |
| `config.apply` | Replace entire config (optimistic locking via `baseHash`) | Admin |
| `config.patch` | Partially update config | Admin |
| `config.schema` | Get JSON schema for config form generation | Viewer |

**`config.patch` request:**
```json
{
  "raw": "{gateway: {port: 9090}}",
  "baseHash": "sha256-of-current-config"
}
```

### Channels

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `channels.list` | List enabled channels | Viewer |
| `channels.status` | Get channel connection status | Viewer |
| `channels.instances.list` | List instances | Viewer |
| `channels.instances.get` | Get instance details | Viewer |
| `channels.instances.create` | Create instance | Admin |
| `channels.instances.update` | Update instance | Admin |
| `channels.instances.delete` | Delete instance | Admin |

### Providers and Tools

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `providers.models` | List available models from all providers | Viewer |

### API Keys

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `api_keys.list` | List API keys (masked) | Admin |
| `api_keys.create` | Create a new API key | Admin |
| `api_keys.revoke` | Revoke API key | Admin |

### Pairing (Device Pairing)

| Method | Description | Auth |
|--------|-------------|------|
| `device.pair.request` | Request pairing (from device) | Unauthenticated |
| `device.pair.approve` | Approve request (from admin) | Admin |
| `device.pair.deny` | Deny request | Admin |
| `device.pair.list` | List pending + paired devices | Admin |
| `device.pair.revoke` | Revoke device | Admin |
| `browser.pairing.status` | Check pairing status (poll) | Unauthenticated |

### Exec Approvals

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `exec.approval.list` | List commands pending approval | Operator |
| `exec.approval.approve` | Approve command (option: always approve) | Operator |
| `exec.approval.deny` | Deny command execution | Operator |

### Usage and Quotas

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `usage.get` | Get usage records by agent | Viewer |
| `usage.summary` | Get token usage summary | Viewer |
| `quota.usage` | Get quota consumption | Viewer |

### Other

| Method | Description | Minimum Role |
|--------|-------------|--------------|
| `send` | Send outbound message via channel | Operator |
| `logs.tail` | Enable/disable live log streaming | Admin |
| `delegations.list` | List delegation history | Viewer |
| `delegations.get` | Get delegation details | Viewer |

---

## Streaming Events

When `chat.send` is called with `stream: true`, the server pushes events in order:

| Event | Description | Key Payload |
|-------|-------------|-------------|
| `run.started` | Agent run started | `runId`, `agentId` |
| `chunk` | Text streaming chunk | `content` (string) |
| `tool.call` | Tool invocation started | `toolName`, `toolInput` |
| `tool.result` | Tool invocation completed | `toolName`, `result` |
| `run.completed` | Agent run finished | `content`, `usage` |

### Server-Pushed Events

| Event | Description |
|-------|-------------|
| `session.updated` | Session metadata changed |
| `agent.updated` | Agent configuration changed |
| `cron.fired` | Cron job triggered |
| `team.task.*` | Team task lifecycle events |
| `exec.approval.pending` | Command pending approval |

---

## Permission Matrix

| Role | Access |
|------|--------|
| **Admin** | All methods |
| **Operator** | Read + write (chat, sessions, cron, approvals, send) |
| **Viewer** | Read-only (list, get, preview, status, history) |

**Admin-only methods:** `config.apply`, `config.patch`, `agents.create`, `agents.update`, `agents.delete`, `channels.toggle`, `device.pair.approve`, `device.pair.deny`, `device.pair.revoke`, `teams.*`, `api_keys.*`

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication failed or insufficient role |
| `INVALID_REQUEST` | Missing field, wrong type, or method does not exist |
| `NOT_FOUND` | Resource does not exist |
| `ALREADY_EXISTS` | Resource already exists |
| `UNAVAILABLE` | Service temporarily unavailable |
| `RESOURCE_EXHAUSTED` | Rate limit exceeded |
| `AGENT_TIMEOUT` | Agent run exceeded time limit |
| `INTERNAL` | Unexpected server error |

Error responses include `retryable` (boolean) and `retryAfterMs` (integer).

---

## See Also

- [HTTP REST API](./01-api-reference.md)
- [Configuration Reference](./03-cau-hinh.md)
- [Nodes — Device Pairing](../admin/12-nodes.md)
