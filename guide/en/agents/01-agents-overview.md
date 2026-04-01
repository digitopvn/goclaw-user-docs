# Agents Overview

## Overview

An agent is an AI assistant configured with a personality, knowledge, and specific tools. GoClaw supports multiple agents running in parallel, each with its own separate workspace and independent processing loop.

---

## What is an Agent

An agent is an independent AI entity configured with:

- **Personality and identity** (SOUL.md, IDENTITY.md): Voice, style, name, icon
- **Foundation knowledge** (AGENTS.md, TOOLS.md): Operating procedures, available tools
- **User profile** (USER.md): Name, timezone, user preferences
- **Skills and tools**: Extensible capabilities for performing specific tasks

Each agent runs a **Think -> Act -> Observe** loop (up to 20 iterations) until it produces a final response.

---

## Two Types of Agents

### Open Agent

- Each user gets a **completely separate set of context files** (6 files: AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, BOOTSTRAP.md).
- Personality and skills can be customized individually for each user.
- Suitable when each user needs a differently personalized AI assistant.

### Predefined Agent

- **Shared personality** across all users (SOUL.md, IDENTITY.md, AGENTS.md at the agent level).
- Each user has their own USER.md so the agent remembers personal information.
- USER_PREDEFINED.md provides general user handling rules.
- Suitable when a consistent, standardized AI assistant is needed (e.g., a customer support bot).

| Feature | Open | Predefined |
|---------|------|------------|
| Context | Completely separate | Shared personality, separate profile |
| Customization | Full | USER.md only |
| Use case | Personal assistant | Shared assistant |

---

## Selecting an Agent in Chat

- The chat sidebar has an **AgentSelector** dropdown — select an agent before creating a new session.
- The default agent is `default` if none is selected.
- The session URL key contains agent information: `agent:{agentId}:...` — switching sessions means switching agents.
- On external channels (Telegram, Discord, etc.), the agent is assigned during channel configuration; users do not need to select one.

---

## Interface — Agents Page

Route: `/agents`
Sidebar Group: Core
Access: Logged in

Displays a paginated list of all agents (card or list view), with search and filter by creator.

**Actions:**
- **Create Agent** — opens the create dialog
- **Delete** — confirms with a name input field
- **Resummon** — reinitializes the agent (re-runs the context file generation process)
- **Transfer (Import/Export)** — navigates to the import-export page
- **View details** — click to navigate to `/agents/:id`

**Create Agent Dialog:**

| Field | Description |
|-------|-------------|
| Icon | Representative emoji |
| Display Name | Display name |
| Agent Key | Unique slug (auto-generated from name, e.g., `my-agent`) |
| Provider | Select an added provider |
| Model | Select a model or enter manually + Check |
| Agent Type | `predefined` or `open` |
| Agent Personality | Describe the agent's role — used to auto-generate SOUL.md |
| Self-Evolution | Allow the agent to self-update SOUL.md |

The **Check & Create** button verifies the model connection before creating. If the model is already verified, the button changes to **Create**.

**Summon Modal:** Displays real-time file progress when the agent is initialized for the first time.
- Success: **Continue**
- Failure: **Retry** or **Close**

---

## Example — Creating a Personal Agent

```
/agents -> + Create Agent
  Icon: "A"
  Display Name: "Assistant"
  Agent Key: assistant (auto)
  Provider: anthropic
  Model: claude-sonnet-4-5-20250929 -> Check OK
  Agent Type: open
  Personality: "Personal assistant, friendly, concise"
  -> Create -> Summon Modal -> Continue
  -> Agent "Assistant" appears in the list
```

---

## Notes

- The Agent Key is the identifier used at runtime — it cannot be changed after creation.
- The agent type (open/predefined) affects the workspace structure — it cannot be changed after creation.
- Each agent has a separate session namespace on the `web:direct` channel.
- Deleting an agent will delete all related sessions, memory, and context files.

---

## See Also

- [02-agent-config.md](./02-agent-config.md) — Configuring model, behavior, sandbox
- [03-skills.md](./03-skills.md) — Skills and tools
- [../chat-and-sessions/01-basic-chat.md](../chat-and-sessions/01-basic-chat.md) — Chatting with an agent
