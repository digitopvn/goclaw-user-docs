# Skills

## Overview

Skills are knowledge modules or instructions embedded into the system prompt, helping the agent know how to use tools or handle specific domains. Unlike tools (which execute actions), skills are knowledge — the agent reads skills to learn how to work.

---

## What are Skills

Skills are ZIP files containing:
- Tool usage instructions (e.g., how to use `pdf`, `xlsx`, `docx`)
- Specific task processing workflows
- Internal reference documentation

**Example built-in skills:**

| Skill | Function |
|-------|----------|
| `pdf` | Read, create, merge, split PDF files |
| `xlsx` | Read, create, edit spreadsheets |
| `docx` | Read, create, edit Word files |
| `pptx` | Read, create, edit presentations |
| `skill-creator` | Create new skills |

**How the agent discovers skills:**

| Condition | Behavior |
|-----------|----------|
| <= 20 skills and total tokens <= 3,500 | The skill list is embedded directly into the system prompt (inline mode) |
| Above the threshold | The agent uses the `skill_search` tool to search by keyword (BM25 + vector search) |

---

## Visibility

| Level | Access |
|-------|--------|
| `public` | All agents and users |
| `private` | Owner only |
| `internal` | Must be explicitly granted |

---

## Interface — Skills Page

Route: `/skills`
Sidebar Group: Skills
Access: Logged in

Displays a two-tab table:
- **Core**: System skills (built-in)
- **Custom**: User-uploaded skills

Columns: name, description, author, status, visibility, actions.

A **Missing Dependencies** banner appears at the top if any skills are missing prerequisites.

**Actions:**
- **Upload Skills** — drag and drop `.zip` files into the upload area
- **Edit metadata** — name, description, visibility, tags
- **Delete Skill** — with confirmation
- **Enable/Disable** — toggle switch per skill
- **Cycle visibility** — click the badge to cycle `public` -> `internal` -> `private`
- **Rescan Deps** — scan all skills for dependencies
- **Install Dependencies** — install individual packages
- **Per-tenant override** — enable/disable a skill for the current tenant (Toggle / Reset to default)

---

## Guide — Uploading a New Skill

1. Go to `/skills`, click **Upload Skills**.
2. Drag and drop `.zip` files into the upload area (or click to select files).
3. The system validates each file: **Validating** -> **Valid / Invalid** -> **Uploading** -> **Success / Failed**.
4. Click **Upload [N]** to begin uploading validated files.
5. After completion, click **Done**.
6. Click **X** on each file to remove it from the queue before uploading.

---

## Interface — Skill Detail

Route: `/skills/:id`
Sidebar Group: Skills
Access: Logged in

Opens as a dialog from the `/skills` page.

**Two tabs:**

| Tab | Content |
|-----|---------|
| Content | Skill's README markdown |
| Files | Version selector, file tree, content viewer with syntax highlighting |

**Actions:**
- **View versions** — list of all published versions
- **Browse files** — file listing within the skill directory
- **Read file content** — displayed in the viewer with syntax highlighting
- **Pin version for agent** — assign a skill to an agent at a specific version
- **Copy** — copy file content

---

## Tools — Agent-Available Tools

Tools are executable functions (unlike skills, which are knowledge). The agent selects the appropriate tool and calls it during processing.

| Tool Group | Examples |
|------------|----------|
| Filesystem | `read_file`, `write_file`, `list_files` |
| Web | `web_search`, `browser_act`, `browser_screenshot` |
| Code execution | `exec` (run Python, Node.js in Docker sandbox) |
| Memory | `memory_search`, `memory_write` |
| TTS | `tts_convert` (text to speech) |
| Subagent | Call another agent to handle a sub-task |
| MCP tools | Tools from external MCP servers |

Each request can have its own list of allowed tools (e.g., a Telegram forum topic can restrict tools).

---

## Example — Adding the PDF Skill to an Agent

```
/skills -> Upload Skills -> drag and drop pdf.zip
  -> Validation: valid
  -> Upload -> Success
/skills -> click "pdf" -> Skill Detail -> Pin version
  -> Select agent: "Assistant", version: latest
  -> Confirm
```

---

## Notes

- Skills are knowledge only — the agent still needs corresponding tools to execute actions (e.g., the `pdf` skill requires the `exec` or `read_file` tool).
- `private` skills are visible only to the owner — suitable for individual internal knowledge.
- Deleting a skill currently used by an agent does not automatically disable the agent — the agent simply won't find the skill when needed.
- Skill versions are pinned per agent: if no specific version is pinned, the agent uses the latest version.

---

## See Also

- [Agent and skill concepts](./01-agents-overview.md)
- [Advanced agent configuration](./02-agent-config.md)
- [Codex Pool for ChatGPT OAuth routing](./04-codex-pool.md)
