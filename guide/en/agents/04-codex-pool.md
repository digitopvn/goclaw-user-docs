# Codex Pool

## Overview

Codex Pool is a feature for managing the ChatGPT OAuth routing pool for a specific agent. Instead of using a single ChatGPT OAuth provider, Codex Pool allows configuring multiple providers and routing requests by strategy (round-robin, primary-first, etc.) to increase availability and reduce the risk of quota exhaustion.

Route: `/agents/:id/codex-pool`
Sidebar Group: Core (Agent sub-page)
Access: Admin

---

## What is Codex Pool

ChatGPT OAuth is an authentication method for accessing ChatGPT via the OAuth flow instead of a standard API key. When an agent uses ChatGPT OAuth:

- Multiple ChatGPT OAuth accounts / providers can be configured.
- Codex Pool distributes requests to providers according to the routing strategy.
- If a provider encounters an error or runs out of quota, the pool automatically switches to another provider (fallback).
- The system monitors each provider's health in the pool in real time.

---

## Interface

The page consists of two main sections:

### Pool Activity Table

Displays statistics for each provider in the pool:

| Column | Description |
|--------|-------------|
| Provider | ChatGPT OAuth provider name |
| Requests | Total requests processed |
| Success Rate | Percentage of successful requests |
| Health Score | Current health score (0-100) |
| Fallback Count | Number of times the pool has switched to this provider via fallback |
| Timeline | Activity chart over time |

### Routing Configuration

Settings for the request distribution strategy.

---

## Configuration Guide

### Adding a Provider to the Pool

1. Go to `/agents/:id` -> click **Open Pool** -> `/agents/:id/codex-pool`.
2. Click **Add provider**.
3. Select a ChatGPT OAuth provider from the registered list.
4. Click **Save routing configuration**.

### Selecting a Routing Strategy

| Strategy | Description |
|----------|-------------|
| `round-robin` | Distributes evenly across all providers in rotation |
| `primary-first` | Prioritizes the primary provider, only uses secondary providers when the primary encounters errors |

After selecting a strategy, click **Save routing configuration** to apply.

### Removing a Provider from the Pool

1. Find the provider in the activity table.
2. Click **Delete** next to that provider.
3. The pool updates automatically; new requests are no longer sent to the removed provider.

### Refreshing Data

Click **Refresh Live State** to update the activity table and quota data to the current state.

### Viewing Provider Links (Admin Only)

Admins can view detailed OAuth link information for each provider in the pool.

---

## Example — Configuring a Pool with 2 Providers

```
/agents/my-agent/codex-pool
  -> Add provider: chatgpt-oauth-account-1
  -> Add provider: chatgpt-oauth-account-2
  -> Strategy: round-robin
  -> Save routing configuration

Result:
  Request 1 -> account-1
  Request 2 -> account-2
  Request 3 -> account-1
  ...
  If account-1 fails -> automatically routes all to account-2
```

---

## Notes

- Codex Pool only applies to agents using a ChatGPT OAuth provider — it does not affect other providers (Anthropic, OpenAI API key, etc.).
- Providers must be registered in `/providers` before being added to the pool.
- The health score is calculated based on success rate, latency, and recent fallback count.
- When all providers in the pool encounter errors, the agent returns an error to the user instead of hanging indefinitely.
- This feature is suitable for environments using multiple ChatGPT accounts to avoid free tier rate limits.

---

## See Also

- [02-cau-hinh-agent.md](./02-cau-hinh-agent.md) — General agent configuration, including the "ChatGPT OAuth Routing" section
- [01-tong-quan-agents.md](./01-tong-quan-agents.md) — Agents overview
