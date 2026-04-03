# Providers

**Route:** `/providers`
**Access:** Admin

## What It Shows
Paginated list of LLM provider integrations with search. Shows pool hierarchy visualization for ChatGPT OAuth pools (owner/member connectors) and quota display for authenticated OAuth providers.

## Actions
- **Create provider** — form dialog
- **Delete provider** — confirm dialog
- **View provider detail** — click row to navigate to detail page
- **Search providers**
- **Refresh**

## Sub-features
- Pool hierarchy visualization for ChatGPT OAuth providers
- Quota usage display for OAuth authenticated providers
- Pagination

## Dialogs

### Create Provider Dialog
**Trigger:** "Create Provider" button
**Fields:**
- Provider Type (select: openrouter, claude_cli, ollama, chatgpt_oauth, anthropic_native, openai_compat, etc.)
- Name/Alias (text, auto-slugified)
- Display Name (text)
- API Key (password, not required for CLI/Ollama/OAuth)
- API Base (text, defaults by type)
- OAuth-specific fields (when type = chatgpt_oauth): inline OAuth auth flow

**Actions:**
- **Create** — creates provider; OAuth triggers auth flow
- **Cancel** — closes

### Delete Provider Dialog
**Trigger:** Delete button on provider row/detail
**Displays:** Confirmation with provider name

**Actions:**
- **Confirm Delete** (destructive) — removes provider
- **Cancel** — closes
