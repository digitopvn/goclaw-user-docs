# Config

**Route:** `/config`
**Access:** Cross-tenant (Owner)

## What It Shows
Server configuration editor with 6 vertical tabs. Displays a config hash badge and a warning banner about sensitive changes.

## Actions
Each tab has its own Save button:
- **Server tab** — gateway settings
- **Behavior tab** — rate limiting, security, session settings
- **AI Defaults tab** — default agent configuration
- **Quota tab** — usage quota limits
- **Tools tab** — profile settings, exec settings, web settings, shell security rules
- **Integrations tab** — TTS (link), Cron settings, Telemetry settings, Bindings
- **Refresh config** — reload from server

## Sub-features
- Config hash badge (optimistic concurrency control)
- Warning banner for sensitive changes
- JSON5 syntax support (comments, trailing commas)
- 6 tabs: Server / Behavior / AI Defaults / Quota / Tools / Integrations
