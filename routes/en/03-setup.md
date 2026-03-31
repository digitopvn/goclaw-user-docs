# Setup Wizard

**Route:** `/setup`
**Access:** Auth

## What It Shows
4-step onboarding wizard with a stepper UI to get the system running from scratch.

## Actions
- **Step 1 — Configure Provider** — add first LLM provider
- **Step 2 — Select Model** — choose and test a model from the provider
- **Step 3 — Create Agent** — create the first agent
- **Step 4 — Connect Channel** — optionally connect a messaging channel
- **Skip setup** — bypass the wizard entirely
- **Change language** — language selector (en / vi / zh)
- **Switch tenant** — tenant switcher for multi-tenant environments

## Sub-features
- Stepper navigation (forward/back)
- Completion modal at end of wizard

## Dialogs

### Step 1 — Provider Form
**Trigger:** Initial wizard step
**Fields:**
- Provider Type (select: openrouter, claude_cli, ollama, chatgpt_oauth)
- Name/Alias (text, auto-slugified)
- Display Name (text, OAuth only)
- API Key (password, not required for CLI/Ollama/OAuth)
- API Base (text, defaults by provider type)

**Actions:**
- **Create** — creates provider; OAuth triggers inline auth flow; advances to Step 2

### Step 2 — Model Selection
**Trigger:** After provider created
**Fields:**
- Model (combobox, populated from provider)

**Actions:**
- **Verify** — calls verify(providerId, model), shows 30s countdown, ✓ on success
- **Continue** — disabled until verified; advances to Step 3

### Step 3 — Agent Creation
**Trigger:** After model verified
**Fields:**
- Emoji (text, 2-char max)
- Display Name (text)
- Agent Key (text, auto-derived from display name)
- Personality (preset buttons + textarea)
- Agent Type (Predefined / Open toggle)
- Self-Evolve (switch)

**Actions:**
- **Create** — creates agent; opens SummoningModal on success
- **Back** — returns to Step 2

### Step 4 — Channel Connection
**Trigger:** After agent created
**Fields:**
- Channel Type (select)
- Name (text, slugified)
- Display Name (text, optional)
- Credentials (dynamic fields per channel type)

**Actions:**
- **Create** — creates channel instance; opens SetupCompleteModal
- **Skip / Skip & Finish** — completes setup without channel
- **Back** — returns to Step 3

### Summoning Modal
**Trigger:** Successful agent creation
**Displays:** Animated orb, agent name, file progress (SOUL.md, IDENTITY.md), elapsed timer
**States:** summoning → completed (green ✓) / failed (error message)

**Actions:**
- **Continue** — (success) proceeds to next step
- **Retry** — (failed) calls resummon(agentId)
- **Close** — dismisses (if not hidden)

### Setup Complete Modal
**Trigger:** End of wizard (Step 4 done or skipped)
**Displays:** Animated checkmark, "You're all set" message

**Actions:**
- **Go to Dashboard** — navigates to `/overview`
