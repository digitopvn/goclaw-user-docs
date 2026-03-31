# Import & Export

**Route:** `/import-export`
**Access:** Admin

## What It Shows
Three-tab page for bulk data transfer: Teams, Agents, Skills & MCP. Each tab has Export and Import sub-tabs. Beta feature warning banner displayed.

## Actions
**Teams tab:**
- **Export team** — download team with members and tasks as JSON
- **Import team** — upload JSON to restore a team

**Agents tab:**
- **Preview export** — see what will be included before exporting
- **Export agent** — download agent configuration
- **Preview import** — dry-run conflict detection before importing
- **Import as new agents** — create agents from exported file
- **Merge import** — merge exported data into an existing agent

**Skills & MCP tab:**
- **Export skills** — download all skills as JSON
- **Import skills** — upload skills JSON
- **Export MCP servers** — download MCP server configurations
- **Import MCP servers** — upload MCP configurations

## Sub-features
- Beta warning banner
- Dry-run preview before import (conflict detection)
- Token-based temporary download links
- Tenant-scoped exports/imports

## Panels (panel-based workflow, not modal dialogs)

### Team Export Panel
**Flow:**
1. Team selector (combobox) — choose which team to export
2. Preview card — shows agents, members, tasks included
3. **Start Export** — triggers export, shows progress tree with agent nodes
4. **Download** button — appears on completion (token-based link)

### Team Import Panel
**Flow:**
1. Drag-drop `.tar.gz` file area — drop or click to select file
2. File card — shows selected file name/size
3. **Import** — starts import, shows progress with "don't close" warning
4. Completion state with summary

### Agent Export Panel
**Flow:**
1. Agent selector — choose which agent
2. Preview card — shows files and context included
3. **Start Export** → progress tree → **Download** button

### Agent Import Panel
**Flow:**
1. Drag-drop `.tar.gz` file
2. **Preview** — dry-run showing conflicts/new items
3. **Import as New** — creates new agents
4. **Merge into Existing** — agent selector + merge

### Skills & MCP Export/Import Panels
**Flow (same pattern):**
1. Preview — lists skills/servers to be exported
2. **Export** → **Download** link
3. **Import** — drag-drop JSON → progress → completion summary
