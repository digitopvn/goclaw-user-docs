# Memory

**Route:** `/memory`
**Access:** Operator+

## What It Shows
Table of memory documents. Columns: path, agent (global view), scope (personal/global), hash, updated date. Embedding status badge shown at top.

## Actions
- **Create memory document** — dialog
- **View document content** — dialog with full content
- **Delete document** — confirm dialog
- **Reindex document** — re-embed a single document
- **Index All** — bulk reindex all documents
- **Search memory** — semantic search dialog (vector similarity)
- **Filter by agent** — dropdown
- **Filter by user scope** — dropdown
- **Refresh**

## Sub-features
- Embedding status badge (shows if embedding is configured and working)
- Semantic search dialog
- Pagination

## Dialogs

### Create Memory Document Dialog
**Trigger:** "Create" button
**Fields:**
- Agent (select)
- Scope Mode (toggle: Global / Existing / Custom)
- Path (text input)
- Content (textarea, 200px+)
- Auto-Index (switch)

**Actions:**
- **Create** — creates document, optionally triggers indexing
- **Cancel** — closes

### View Memory Document Dialog
**Trigger:** Click document row
**Tabs:**
- **Content** — path, scope badge, metadata, editable textarea
- **Chunks** — indexed chunks with line ranges and embedding status

**Actions:**
- **Save** (Content tab) — persists content changes
- **Close** — dismisses

### Search Memory Dialog
**Trigger:** "Search" button
**Fields:**
- Query (text, required, auto-focused)
- User ID filter (optional)

**Results:** Path, line range, similarity score bar, scope badge, content snippet

**Actions:**
- **Search** — runs vector similarity search and shows results
- **Close** — dismisses
