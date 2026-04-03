# Configuring LLM Providers

## Overview

A provider is a connection to an LLM backend. GoClaw abstracts all providers behind a common interface so the agent loop works the same regardless of backend. API keys are encrypted with AES-256-GCM before storage.

**List route:** `/providers`
**Detail route:** `/providers/:id`
**Access:** Admin

---

## Guide

### Adding a New Provider

1. Go to **Settings > Providers > Add Provider**
2. Fill in the fields:

| Field | Description |
|-------|-------------|
| Display Name | Name shown in the UI |
| Provider Name | Unique slug (e.g. `my-openrouter`) |
| Provider Type | `openai_compat`, `anthropic`, `claude_cli`, `acp`, `chatgpt_oauth` |
| API Key | Encrypted with AES-256-GCM on save |
| API Base URL | Only needed when using OpenAI-compat with a custom endpoint |
| Enabled | When disabled, agents cannot use this provider |

3. Click **Create** | **Cancel**

### Testing the Connection

In the agent create/edit dialog, click **Check**:
- Green: model is valid, connection successful
- Red: authentication error or model does not exist

### Selecting a Model for an Agent

After selecting a provider, the model dropdown loads a list from `GET /v1/providers/{id}/models`. You can select from the list or type a name manually (Combobox). If the provider does not return a list, type the name and use **Check** to verify.

### Editing and Deleting a Provider

**Edit:** Go to `/providers/:id` — you can modify Display Name, API Key, API Base URL, Enabled/Disabled, and Advanced Settings.

> Note: Changing the name (`name`) breaks the connection for all agents currently using that provider. Update agents before renaming.

**Delete:** Click the delete icon, re-type the provider name to confirm. Agents will fall back to the first provider in the registry.

---

## User Interface (UI)

### List Page (`/providers`)

**Display:** Paginated list with search. Shows pool hierarchy diagram for ChatGPT OAuth and OAuth quota limits.

**Actions:** Add Provider | Delete Provider | View Details | Search | Refresh

**Add Provider Dialog:**
- Fields: Type (anthropic_native, openai_compat, gemini_native, claude_cli, dashscope, openrouter, groq, deepseek, ollama, acp, ...), Name, API Key, API Base, OAuth fields
- Actions: **Create** | **Cancel**

### Detail Page (`/providers/:id`)

**Display:** Configuration fields, API key (hidden), model settings, embedding and inference configuration.

**Actions:** Edit configuration | Verify API key | Verify embedding model | Browse available models | OAuth sign-in | Manage Codex Pool | Delete provider

**Advanced Settings Dialog:**
- Fields by type: API Base URL, binary path/args/TTL/perm-mode/work-dir (ACP), CLI configuration, OAuth configuration
- Actions: **Save** | **Cancel**

---

## Supported Providers

### Core Providers

| Name | Type | Description |
|------|------|-------------|
| `anthropic` | Native HTTP+SSE | Claude models via api.anthropic.com |
| `claude_cli` | stdio subprocess | Local `claude` binary |
| `codex` | OAuth Responses API | ChatGPT via chatgpt.com |
| `acp` | JSON-RPC 2.0 | Claude Code / Codex / Gemini CLI as sub-agent |
| `dashscope` | OpenAI-compat | Alibaba Qwen3 models |

### OpenAI-Compatible Providers

| Name | API Base |
|------|----------|
| `openai` | api.openai.com/v1 |
| `openrouter` | openrouter.ai/api/v1 |
| `groq` | api.groq.com/openai/v1 |
| `deepseek` | api.deepseek.com/v1 |
| `gemini` | generativelanguage.googleapis.com/v1beta/openai |
| `mistral` | api.mistral.ai/v1 |
| `xai` | api.x.ai/v1 |
| `minimax` | api.minimax.io/v1 |
| `ollama` | localhost:11434/v1 |

---

## Extended Thinking

Allows the LLM to generate internal "reasoning tokens" before responding — improves quality for complex tasks but consumes additional tokens.

| Level | Description |
|-------|-------------|
| `off` | Thinking disabled (default) |
| `low` | Light thinking, fast |
| `medium` | Balance between speed and quality |
| `high` | Deepest thinking |

**Support:** Anthropic (4K/10K/32K budget), OpenAI-compat GPT-5/Codex, DashScope Qwen3. Ollama/Groq/DeepSeek: not supported.

**Configuration:** Agent Config tab > Thinking section > Inherit or Custom. Expert Mode allows selecting `reasoning_effort` in more detail.

---

## Provider Pool (Multiple Accounts of the Same Type)

For `chatgpt_oauth`: combine multiple accounts into a pool for load balancing.

| Strategy | Description |
|----------|-------------|
| `primary_first` | Use the primary account first, fall back on error |
| `round_robin` | Rotate evenly across all accounts |
| `priority_order` | Drain secondary accounts in order |

---

## Notes

- A provider from the config file is overridden by a provider with the same name in the database
- Fallback: if a provider is not found, the first provider in the registry is used
- Deleting a provider does not delete agents

---

## See Also

- [Channel configuration](../chat-and-sessions/03-channels.md)
- [API key encryption](05-security.md)
