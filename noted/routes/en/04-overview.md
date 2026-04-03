# Overview

**Route:** `/overview`
**Access:** Auth

## What It Shows
Main dashboard with two tabs: Overview and Usage.

**Overview tab:**
- 5 summary stat cards: Requests Today (with sparkline), Tokens Today, Cost Today, Agents (running/total), Channels (online/total)
- Provider warnings (no providers / no enabled providers)
- System health card (uptime, providers, sessions, clients, channels, runtimes)
- Connected clients card
- Cron jobs card
- Recent requests card (last 8 traces)
- Quota usage card (if enabled)
- Version info + update-available badge

## Actions
- **Navigate to providers** — shortcut link from provider warning card
- Auto-refreshes every 30 seconds

## Sub-features
- Usage tab lazy-loads the full Usage page — see `05-usage.md`
