# HTTP REST API Reference

GoClaw provides a full HTTP REST API alongside WebSocket RPC. All endpoints are served on the same port as the gateway server.

Interactive documentation is available at `/docs` (Swagger UI), raw spec at `/docs/openapi.json`.

---

## Overview

- **Base URL:** `http://<host>:<port>` (default port 18790 for Desktop, configured via `gateway.port`)
- **Versioning:** All endpoints start with `/v1/`
- **Protocol:** HTTP/1.1, JSON request/response
- **Content-Type:** `application/json` for request body
- **Encoding:** UTF-8

---

## Authentication

All endpoints (except `/health`) require authentication via Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Two token types are accepted:

| Type | Format | Scope |
|------|--------|-------|
| Gateway token | Configured in `config.json` (field `gateway.token`) | Full admin access |
| API key | `goclaw_` + 32 hex characters | Limited by key scopes |

API keys are SHA-256 hashed before lookup — the raw key is never stored. Some endpoints accept tokens via the `?token=<token>` query parameter (used for `<img>` and `<audio>` tags).

### Common Headers

| Header | Purpose |
|--------|---------|
| `Authorization` | Bearer token for authentication |
| `X-GoClaw-User-Id` | External user ID for multi-tenant context |
| `X-GoClaw-Agent-Id` | Agent identifier for scoped operations |
| `X-GoClaw-Tenant-Id` | Tenant scope — UUID or slug |
| `Accept-Language` | Locale (`en`, `vi`, `zh`) for i18n error messages |
| `Content-Type` | `application/json` for request body |

---

## Agents

CRUD agent management. Requires the `X-GoClaw-User-Id` header for multi-tenant context.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/v1/agents` | List agents accessible to the user | Bearer |
| `POST` | `/v1/agents` | Create a new agent | Bearer |
| `GET` | `/v1/agents/{id}` | Get agent by ID or key | Bearer |
| `PUT` | `/v1/agents/{id}` | Update agent (owner only) | Bearer |
| `DELETE` | `/v1/agents/{id}` | Delete agent (owner only) | Bearer |

### Agent Actions

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/agents/{id}/wake` | Wake agent externally (n8n, orchestrators) |
| `POST` | `/v1/agents/{id}/regenerate` | Regenerate agent configuration using LLM |
| `POST` | `/v1/agents/{id}/resummon` | Retry the initial summoning process |

### Agent Files and Instances

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/agents/{id}/instances` | List user instances |
| `GET` | `/v1/agents/{id}/instances/{userID}/files` | List user context files |
| `PUT` | `/v1/agents/{id}/instances/{userID}/files/{fileName}` | Update user file (USER.md only) |

### Agent Sharing

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/agents/{id}/sharing` | List agent shares |
| `POST` | `/v1/agents/{id}/sharing` | Share agent with a user |
| `DELETE` | `/v1/agents/{id}/sharing/{userID}` | Revoke access |

---

## Sessions

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/sessions` | List sessions (paginated) |

Session details are primarily managed via WebSocket RPC (see `sessions.*` methods).

---

## Providers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/providers` | List LLM providers |
| `POST` | `/v1/providers` | Create a new provider |
| `GET` | `/v1/providers/{id}` | Get provider details |
| `PUT` | `/v1/providers/{id}` | Update provider configuration |
| `DELETE` | `/v1/providers/{id}` | Delete provider |

---

## Tools

### Custom Tools

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/tools/custom` | List tools (filter by `?agent_id=`) |
| `POST` | `/v1/tools/custom` | Create a custom tool |
| `GET` | `/v1/tools/custom/{id}` | Get tool details |
| `PUT` | `/v1/tools/custom/{id}` | Update tool |
| `DELETE` | `/v1/tools/custom/{id}` | Delete tool |
| `POST` | `/v1/tools/invoke` | Invoke tool directly without the agent loop |

---

## MCP Servers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/mcp/servers` | List registered MCP servers |
| `POST` | `/v1/mcp/servers` | Register a new MCP server |
| `GET` | `/v1/mcp/servers/{id}` | Get server details |
| `PUT` | `/v1/mcp/servers/{id}` | Update server configuration |
| `DELETE` | `/v1/mcp/servers/{id}` | Delete MCP server |
| `POST` | `/v1/mcp/servers/{id}/grants/agent` | Grant access to an agent |
| `DELETE` | `/v1/mcp/servers/{id}/grants/agent/{agentID}` | Revoke agent access |
| `GET` | `/v1/mcp/grants/agent/{agentID}` | List MCP grants for an agent |
| `POST` | `/v1/mcp/servers/{id}/grants/user` | Grant access to a user |
| `DELETE` | `/v1/mcp/servers/{id}/grants/user/{userID}` | Revoke user access |
| `POST` | `/v1/mcp/requests` | Request access (user self-service) |
| `GET` | `/v1/mcp/requests` | List pending requests |
| `POST` | `/v1/mcp/requests/{id}/review` | Approve or deny a request |

---

## Channels

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/channel-instances` | List channel instances |
| `POST` | `/v1/channel-instances` | Create a new channel instance |
| `GET` | `/v1/channel-instances/{id}` | Get instance details |
| `PUT` | `/v1/channel-instances/{id}` | Update instance configuration |
| `DELETE` | `/v1/channel-instances/{id}` | Delete channel instance |

---

## Skills

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/skills` | List all skills |
| `POST` | `/v1/skills/upload` | Upload ZIP containing SKILL.md (max 20 MB) |
| `GET` | `/v1/skills/{id}` | Get skill details |
| `PUT` | `/v1/skills/{id}` | Update skill metadata |
| `DELETE` | `/v1/skills/{id}` | Delete skill (not applicable to system skills) |
| `POST` | `/v1/skills/{id}/toggle` | Enable/disable skill |
| `GET` | `/v1/skills/{id}/versions` | List available versions |
| `GET` | `/v1/skills/{id}/files` | List files in skill |
| `POST` | `/v1/skills/{id}/grants/agent` | Grant skill to agent |
| `DELETE` | `/v1/skills/{id}/grants/agent/{agentID}` | Revoke skill from agent |
| `GET` | `/v1/agents/{agentID}/skills` | List skills with agent grant status |

---

## Files

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/files` | List workspace files |
| `GET` | `/v1/files/{path}` | Serve file content |
| `DELETE` | `/v1/storage/{path}` | Delete workspace file |
| `POST` | `/v1/media/upload` | Upload media file |
| `GET` | `/v1/media/{id}` | Serve media file |

---

## Config, Usage, Traces, Audit

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/usage` | Get usage metrics |
| `GET` | `/v1/usage/summary` | Get usage summary |
| `GET` | `/v1/traces` | List traces (filter by agent, user, status, date) |
| `GET` | `/v1/traces/{id}` | Get trace details with all spans |
| `GET` | `/v1/activity` | List activity audit logs |
| `GET` | `/v1/api-keys` | List API keys (masked) |
| `POST` | `/v1/api-keys` | Create a new API key |
| `DELETE` | `/v1/api-keys/{id}` | Revoke API key |
| `GET` | `/v1/delegations` | List delegation history (paginated) |
| `GET` | `/v1/delegations/{id}` | Get delegation details |
| `GET` | `/v1/memory` | Get memory entries |
| `POST` | `/v1/memory` | Create memory entry |
| `DELETE` | `/v1/memory/{id}` | Delete memory entry |

---

## OpenAI-Compatible Endpoint

### `POST /v1/chat/completions`

Compatible with the OpenAI Chat API for programmatic agent access.

**Request:**
```json
{
  "model": "goclaw:agent-id-or-key",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": false,
  "user": "optional-user-id"
}
```

Agent resolution rules: `model` field with `goclaw:` or `agent:` prefix, then `X-GoClaw-Agent-Id` header, then the `"default"` agent.

**Response (non-streaming):**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "choices": [{
    "index": 0,
    "message": {"role": "assistant", "content": "..."},
    "finish_reason": "stop"
  }],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
```

**Streaming:** Set `"stream": true` to receive Server-Sent Events (SSE) with `data: {...}` chunks, ending with `data: [DONE]`.

### `POST /v1/responses`

Alternative protocol compatible with the OpenAI Responses API. Uses the same authentication, returns structured response objects (`response.started`, `response.delta`, `response.done`).

---

## Rate Limiting

Token bucket rate limiting per user or IP. Configured via `gateway.rate_limit_rpm` (0 = disabled, > 0 = enabled).

- **Burst:** 5 requests
- **HTTP 429** when limit exceeded, with `Retry-After: 60` header
- **Cleanup:** every 5 minutes, removes entries inactive for more than 10 minutes

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication failed or insufficient permissions |
| `INVALID_REQUEST` | Missing or invalid field in request |
| `NOT_FOUND` | Resource does not exist |
| `ALREADY_EXISTS` | Resource already exists (conflict) |
| `UNAVAILABLE` | Service temporarily unavailable |
| `RESOURCE_EXHAUSTED` | Rate limit exceeded |
| `FAILED_PRECONDITION` | Precondition not met |
| `AGENT_TIMEOUT` | Agent run exceeded time limit |
| `INTERNAL` | Unexpected server error |

Error responses include a `retryable` (boolean) and `retryAfterMs` (integer) field to guide client retry behavior.

---

## See Also

- [WebSocket RPC](./02-websocket-rpc.md)
- [Configuration Reference](./03-cau-hinh.md)
- Swagger UI live: `http://<host>:<port>/docs`
