# Agents

**Route:** `/agents`
**Access:** Auth

## What It Shows
Paginated list of all agents in card or list view, with search and owner/creator filter.

## Actions
- **Create agent** — open creation dialog
- **Delete agent** — confirm dialog with name verification input
- **Resummon agent** — trigger re-initialization
- **Transfer (Import/Export)** — navigate to import-export page
- **View agent detail** — click card/row to navigate to detail page
- **Toggle card/list view** — switch display mode
- **Filter by creator/owner** — dropdown filter

## Sub-features
- Summoning modal opens instead of detail page when agent status is "summoning"
- Pagination

## Dialogs

### Agent Create Dialog
**Trigger:** "Create Agent" button
**Fields:**
- Emoji (text, 2-char max)
- Display Name (text)
- Agent Key (text, auto-derived, slug-validated)
- Provider (select, enabled providers only)
- Model (combobox + Verify button)
- Agent Type (Predefined / Open toggle)
- Personality (preset buttons + textarea, Predefined only)
- Self-Evolution (switch)

**Actions:**
- **Check** — verifies provider/model combination
- **Check & Create** — verifies then creates (when verification is pending)
- **Create** — creates agent with already-verified model
- **Cancel** — closes dialog

### Summoning Modal
**Trigger:** After agent creation (also shown when clicking a "summoning" agent card)
**Displays:** Animated orb, file progress list, elapsed timer
**States:** summoning → completed / failed

**Actions:**
- **Continue** — (success) navigate to agent detail
- **Retry** — (failed) re-summons the agent
- **Close** — dismisses modal
