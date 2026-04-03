# Agent Codex Pool

**Route:** `/agents/:id/codex-pool`
**Access:** Admin

## What It Shows
ChatGPT OAuth routing pool management for a specific agent.

- Pool activity panel: per-provider stats (request count, success rate, health score, failover counts, recent requests timeline)
- Routing configuration panel

## Actions
- **Configure routing strategy** — round-robin, primary-first, etc.
- **Add provider to pool** — add extra ChatGPT OAuth providers
- **Remove provider from pool**
- **Save routing configuration**
- **Refresh activity/quota data**
- **View provider links** (admin only)

## Sub-features
- Per-provider health score and failover tracking
- Recent requests timeline per provider
