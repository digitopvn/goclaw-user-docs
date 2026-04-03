# Provider Detail

**Route:** `/providers/:id`
**Access:** Admin

## What It Shows
Full detail page for a single LLM provider. Shows configuration fields, API key (masked), model settings, embedding config, and reasoning config.

## Actions
- **Edit provider configuration** — update name, API base, API key, model, etc.
- **Verify API key** — test connectivity before saving
- **Verify embedding model** — confirm embedding endpoint works
- **Browse available models** — list models from this provider
- **OAuth sign-in** — for OAuth-based providers (e.g., ChatGPT OAuth)
- **Manage Codex Pool** — configure pool routing (ChatGPT OAuth providers)
- **Delete provider**

## Sub-features
- API key field shows masked value, only editable
- Embedding settings sub-section
- Reasoning config sub-section (effort level, fallback strategy)

## Dialogs

### Provider Advanced Dialog
**Trigger:** Advanced/settings button on provider detail
**Fields (vary by provider type):**
- API Base URL (standard providers)
- Binary path / args / TTL / perm-mode / work-dir (ACP providers)
- CLI config (claude_cli)
- OAuth config (chatgpt_oauth)

**Actions:**
- **Save** — persists changes
- **Cancel** — closes without saving

### Delete Provider Confirmation
**Trigger:** Delete button in header
**Displays:** Provider name confirmation

**Actions:**
- **Confirm Delete** (destructive) — removes provider and navigates back
- **Cancel** — closes
