# Security and Access Control

## Overview

GoClaw applies defense-in-depth security with 5 independent layers. Access control is based on 3-level RBAC. API keys support scoped permissions for external integrations.

**API keys route:** `/api-keys` — Admin
**Approvals route:** `/approvals` — Operator+

---

## Guide

### Authentication

3 methods, in order of priority:

1. **Gateway token** — primary token in `config.json` (`gateway.token`), grants full Admin access
2. **API key** — scoped key, grants access according to scopes
3. **Browser pairing** — browser authorized via QR/code, grants Operator access (HTTP only)

Usage: `Authorization: Bearer <token>`

> If no gateway token is configured, the system accepts all unauthenticated requests (dev mode).

### Creating an API Key

1. Go to **System > API Keys > Create API Key** (requires Admin permission)
2. Fill in:
   - **Name** (required)
   - **Tenant** (select, owner only)
   - **Scopes** (6 checkboxes): `operator.admin` / `.read` / `.write` / `.approvals` / `.pairing` / `.provision`
   - **Expiry**: Never / 7 / 30 / 90 days
3. Click **Create** -> displays the full key + **Copy**

> **Important:** Copy the key immediately — it is only displayed once at creation time.

**Revoke:** API Keys list > click **Revoke** — takes effect immediately.

**Storage security:** The raw key is never stored in the database — only the SHA-256 hash is saved. Authentication uses `ConstantTimeCompare` to prevent timing attacks. In-memory cache for 5 minutes.

### RBAC — 3 Access Levels

| Role | Level | Primary Permissions |
|------|:-----:|---------------------|
| Viewer | 1 | View agents, sessions, skills, system status |
| Operator | 2 | Viewer + send chats, manage sessions, run cron jobs, update skills |
| Admin | 3 | Operator + edit configuration, create/delete agents, manage channels, approve device pairing |

### API Key Scopes

| Scope | Permission |
|-------|------------|
| `operator.admin` | Full access, equivalent to gateway token |
| `operator.read` | Read-only (Viewer) |
| `operator.write` | Read + write (Operator) |
| `operator.approvals` | Approve/deny shell commands |
| `operator.pairing` | Manage browser device pairing |

### Shell Command Approvals (`/approvals`)

When exec ask mode is `on-miss` or `always`, shell commands require admin approval:

- **Allow Once** — approve this execution
- **Allow Always** — permanently add the command to the allowlist
- **Deny** — deny the command

Timeout: 2 minutes. After timeout, the command is automatically denied.

---

## User Interface (UI)

### API Keys Page (`/api-keys`)

**Display:** API keys table: name, prefix (first 8 characters), scopes, tenant, status (active/revoked/expired), expiry date, last used.

**Actions:** Create API key | Revoke | Copy newly created key | View code examples (curl/TypeScript/Go) | Search | Refresh

**Create Key Dialog:** Name (required), Tenant, Scopes (6 checkboxes), Expiry. **Create** -> displays key + **Copy** | **Cancel**

**Code Examples Dialog:** Tabs curl / TypeScript / Go — displays code with syntax highlighting. **Copy** per tab (read-only).

### Approvals Page (`/approvals`)

**Display:** List of pending shell approval requests: agent ID, command, timestamp.

**Actions:** Allow Once | Allow Always | Deny | Refresh

---

## 5 Protection Layers

| Layer | Mechanism | Details |
|-------|-----------|---------|
| 1 - Transport | CORS, size limits | WS checks `allowed_origins`; WS max 512KB; HTTP body max 1MB |
| 2 - Input | Injection detection | 6 patterns: ignore_instructions, role_override, system_tags, instruction_injection, null_bytes, delimiter_escape |
| 3 - Tool | Shell deny, path traversal, SSRF | Blocks dangerous commands, checks directories, DNS rebinding protection |
| 4 - Output | Credential scrubbing | Removes LLM tokens, GitHub, AWS, connection strings from output |
| 5 - Isolation | Per-user workspace, Docker sandbox | Each user has a separate directory; shell can run in a container |

### Input Guard — Injection Detection

6 patterns scanned before processing:

| Pattern | Example Detected |
|---------|-----------------|
| `ignore_instructions` | "ignore all previous instructions" |
| `role_override` | "you are now...", "pretend you are..." |
| `system_tags` | `<system>`, `[SYSTEM]`, `[INST]` |
| `instruction_injection` | "new instructions:", "override:" |
| `null_bytes` | `\x00` character |
| `delimiter_escape` | `</instructions>`, "end of system" |

Action (`gateway.injection_action`): `off` / `log` / `warn` (default) / `block`.

### Shell Deny Patterns (Always Applied)

| Category | Examples |
|----------|----------|
| Dangerous file deletion | `rm -rf`, `del /f`, `rmdir /s` |
| Disk operations | `mkfs`, `dd if=`, writes to `/dev/sd*` |
| System commands | `shutdown`, `reboot`, `poweroff` |
| Fork bomb | `:(){ ... };:` |
| Remote code execution | `curl \| sh`, `wget -O - \| sh` |
| Reverse shell | `/dev/tcp/`, `nc -e` |
| Eval injection | `eval $()`, `base64 -d \| sh` |

### SSRF Protection

URLs are checked in 3 steps before fetching:
1. Blocked hostnames: `localhost`, `*.local`, `*.internal`, `metadata.google.internal`
2. Internal IP ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`
3. DNS pinning: resolves the domain, checks each resulting IP including redirect targets

### AES-256-GCM Encryption

| Data | Table | Column |
|------|-------|--------|
| LLM provider API key | `llm_providers` | `api_key` |
| MCP server API key | `mcp_servers` | `api_key` |
| Custom tool env vars | `custom_tools` | `env` |

Encryption key: environment variable `GOCLAW_ENCRYPTION_KEY`.
Format: `"aes-gcm:" + base64(12-byte nonce + ciphertext + GCM tag)`.

### Rate Limiting

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rate_limit_rpm` | 0 (disabled) | Max requests/minute/user/IP |
| Burst | 5 | Allows instantaneous bursts above the limit |

Configuration in `config.json`: `gateway.rate_limit_rpm`. Requests exceeding the limit: HTTP 429 or WebSocket error.

---

## Notes

- Copy the API key immediately after creation — it cannot be retrieved later
- Changing the gateway token invalidates all current sessions
- Raw API keys are not stored in the DB — only SHA-256 hashes

---

## See Also

- [guide/en/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — Exec approval details
- [guide/en/admin/06-theo-doi.md](06-theo-doi.md) — Security event logs
