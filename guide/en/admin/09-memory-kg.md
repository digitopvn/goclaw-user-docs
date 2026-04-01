# Memory and Knowledge Graph

**Memory Route:** `/memory`
**Knowledge Graph Route:** `/knowledge-graph`
**Sidebar Group:** Data
**Access:** Operator+

---

## Overview

GoClaw provides two long-term knowledge storage mechanisms for agents:

- **Memory** — stores structured text documents, supports semantic search via vector embeddings
- **Knowledge Graph** — models relationships between entities, organized by agent and session

---

## Memory

### User Interface

**Route:** `/memory`

The page displays a memory documents table with columns: path, agent, scope (personal/global), hash, updated date. An embedding status badge is shown at the top.

### Document Management

**Create a new document**
1. Click the "Create Memory Document" button
2. Fill in the dialog:
   - **Agent** — select the agent that owns the document
   - **Scope** — Global / Existing scope / Custom
   - **Path** — document identifier (e.g., `user/preferences`)
   - **Content** — text content
   - **Auto-index** — enable to embed vectors immediately after creation
3. Click **Create**

**View and edit**
- Click a document row to open the view dialog
- **Content** tab: edit content, view path and metadata
- **Chunks** tab: view indexed chunks with line ranges and embedding status

**Delete a document**
- Click the delete button on a row, confirm in the dialog

### Indexing

- **Re-index a single document** — re-embed vectors for a specific document
- **Index All** — bulk re-embed all documents (use when switching embedding providers)

### Semantic Search

1. Click "Search Memory"
2. Enter a search query (required)
3. Optionally filter by user ID
4. Results display: path, line range, similarity score bar, excerpt

### Filters

- **Filter by agent** — display documents for a specific agent or view all
- **Filter by user scope** — filter by the user who owns the document

---

## Knowledge Graph

### User Interface

**Route:** `/knowledge-graph`

A knowledge graph entity viewer organized by agent and session. Includes an agent selector, scope selector (from existing sessions), and embedding status badge.

### Usage

1. **Select an agent** — choose the agent whose knowledge graph you want to view
2. **Filter by scope** — filter by specific user or group
3. **View entities** — browse the list of KG entities identified by the agent

### Concepts

- **Entity** — an object the agent recognizes (person, organization, concept, etc.)
- **Scope** — the user or group that owns the entity
- **Graph** — the network of relationships between entities

> **Note:** Knowledge Graph is only available in the Standard edition. Desktop (Lite) does not support this feature.

---

## Workflow Example

**Saving user information to memory:**

The agent automatically saves when it detects important information. Administrators can also create entries manually:

```
Path: users/nguyen-van-a/preferences
Content:
- Preferred language: Vietnamese
- Timezone: Asia/Ho_Chi_Minh
- Reply style: concise, with lists
```

**Searching before responding:**

The agent uses semantic search to retrieve relevant documents before generating a response, ensuring consistency with known user information.

---

## Notes

- Vector embeddings require an embedding provider configuration (e.g., OpenAI `text-embedding-3-small`)
- If embeddings are not configured, memory still works but without semantic search capability
- Documents with "Global" scope are shared across all users of that agent
- Documents with "Personal" scope belong to a specific user only
- Knowledge Graph depends on the LLM's entity recognition capability — quality varies by provider

---

## See Also

- [Provider Configuration](../admin/01-providers.md)
- [Configuration Reference — agents.defaults section](../reference/03-cau-hinh.md)
