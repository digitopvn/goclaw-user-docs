# 23 - Tools va MCP (Admin Guide)

Huong dan quan tri he thong tools va tich hop MCP servers trong GoClaw.

---

## 1. Built-in Tools

Danh sach day du cac built-in tools, nhom theo category.

### Filesystem (group: `fs`)

| Tool | Mo Ta |
|------|-------|
| `read_file` | Doc noi dung file, ho tro chi dinh pham vi dong |
| `write_file` | Ghi hoac tao file |
| `edit` | Chinh sua co muc tieu trong file |
| `list_files` | Liet ke thu muc |
| `search` | Tim kiem noi dung file bang regex |
| `glob` | Tim file theo glob pattern |

### Runtime (group: `runtime`)

| Tool | Mo Ta |
|------|-------|
| `exec` | Chay lenh shell |
| `credentialed_exec` | Chay CLI voi credentials duoc inject truc tiep (khong qua shell) |

### Web (group: `web`)

| Tool | Mo Ta |
|------|-------|
| `web_search` | Tim kiem web (Brave, DuckDuckGo) |
| `web_fetch` | Fetch va parse noi dung URL thanh Markdown |

### Memory (group: `memory`)

| Tool | Mo Ta |
|------|-------|
| `memory_search` | Tim kiem tai lieu trong memory (BM25 + vector) |
| `memory_get` | Lay mot tai lieu memory cu the |

### Sessions (group: `sessions`)

| Tool | Mo Ta |
|------|-------|
| `sessions_list` | Liet ke sessions dang hoat dong |
| `sessions_history` | Xem lich su tin nhan cua session |
| `sessions_send` | Gui tin nhan den session |
| `spawn` | Tao subagent hoac uy quyen cho agent khac |
| `session_status` | Lay trang thai session hien tai |

### Teams (group: `teams`)

| Tool | Mo Ta |
|------|-------|
| `team_tasks` | Task board: tao, liet ke, nhan, hoan thanh, binh luan, tim kiem task |
| `team_message` | Mailbox: gui tin nhan truc tiep, broadcast, doc tin chua doc |

### Tao Media (group: `media_gen`)

| Tool | Mo Ta |
|------|-------|
| `create_image` | Tao anh tu mo ta van ban (OpenAI, Gemini, MiniMax, DashScope) |
| `create_audio` | Tao audio/nhac/hieu ung am thanh (MiniMax, ElevenLabs) |
| `create_video` | Tao video tu text/anh (MiniMax) |
| `tts` | Text-to-speech (OpenAI, ElevenLabs, Edge, MiniMax) |

### Doc Media (group: `media_read`)

| Tool | Mo Ta |
|------|-------|
| `read_image` | Phan tich/mo ta anh bang vision AI |
| `read_audio` | Phien am audio sang van ban |
| `read_document` | Trich xuat va phan tich tai lieu (PDF, anh) |
| `read_video` | Phan tich/phien am video |

### Cac Nhom Khac

| Tool | Group | Mo Ta |
|------|-------|-------|
| `cron` | `automation` | Quan ly scheduled tasks |
| `datetime` | `automation` | Lay ngay gio hien tai co ho tro timezone |
| `message` | `messaging` | Gui tin nhan den channel |
| `create_forum_topic` | `messaging` | Tao Telegram forum topic |
| `knowledge_graph_search` | `knowledge` | Tim kiem knowledge graph |
| `skill_search` | `knowledge` | Tim kiem skills kha dung |
| `use_skill` | `skills` | Kich hoat mot skill |
| `publish_skill` | `skills` | Dang ky thu muc skill vao database |
| `workspace_dir` | -- | Lay duong dan workspace cua team/user |
| `openai_compat_call` | -- | Goi OpenAI-compatible endpoint tuy chinh |

---

## 2. Tool Profiles

4 cap do profile xac dinh bo tools nao agent duoc phep dung.

| Profile | Tools Bao Gom |
|---------|---------------|
| `minimal` | Chi `session_status` |
| `messaging` | `messaging`, `web`, `sessions`, `media_read`, `skill_search` |
| `coding` | `fs`, `runtime`, `sessions`, `memory`, `web`, `knowledge`, `media_gen`, `media_read`, `skills` |
| `full` | Tat ca tools da dang ky (khong gioi han) |

**Cau hinh**: Vao **Agents > chon agent > Tools tab** de chon profile. Co the ghi de profile theo tung LLM provider.

---

## 3. Tool Policies

Policy engine ap dung 7 buoc loc truoc khi gui danh sach tool cho LLM:

1. Global profile (full/coding/messaging/minimal)
2. Provider profile override (ghi de theo provider)
3. Global allow list (giao voi allow list)
4. Provider allow override (ghi de theo provider)
5. Agent allow list (per-agent)
6. Agent + Provider allow (per-agent per-provider)
7. Group allow list (group-level)

Sau do ap dung **deny list** (global, agent), cuoi cung ap dung **alsoAllow** (bo sung them).

**Cach tham chieu nhom tool**: dung tien to `group:` trong allow/deny list, vi du: `group:fs`, `group:web`.

---

## 4. Exec Approval

### Security Mode

| Mode | Hanh Vi |
|------|---------|
| `deny` | Block tat ca lenh shell — tool `exec` khong kha dung |
| `allowlist` | Chi chap nhan lenh khop glob pattern trong allowlist |
| `full` | Cho phep tat ca lenh (mac dinh) |

### Ask Mode

| Mode | Hanh Vi |
|------|---------|
| `off` | Tu dong chap nhan — khong hoi (mac dinh) |
| `on-miss` | Hoi khi lenh khong co trong allowlist |
| `always` | Hoi truoc moi lan chay lenh |

**Khi hoi**: Request duoc gui den admin voi timeout 2 phut. Admin co the chon:
- **Allow once**: chap nhan lan nay
- **Allow always**: them vao dynamic allowlist
- **Deny**: tu choi

**Lenh bi block theo mac dinh** bat ke mode nao: `rm -rf`, `curl|sh`, reverse shells, fork bombs, v.v.

**Cau hinh**: **Settings > Config > exec** hoac per-agent trong Agents settings.

---

## 5. Custom Tools

Tao tool tu shell command khong can recompile hay restart.

### Tao Custom Tool

1. Vao **Settings > Custom Tools > Add Tool**
2. Dien cac truong:
   - **Name**: ten tool (dung trong LLM tool call)
   - **Description**: mo ta de LLM hieu khi nao dung
   - **Parameters**: JSON Schema cho tham so
   - **Command**: lenh shell, dung `{{.param_name}}` cho tham so
   - **Timeout**: thoi gian cho doi toi da (mac dinh 60 giay)
   - **Scope**: Global (tat ca agents) hoac per-agent

3. **Environment Variables**: luu ma hoa AES-256-GCM trong database, inject vao process khi chay

**Vi du command**: `dig +short {{.record_type}} {{.domain}}`

### Luu Y Bao Mat

- Tham so duoc shell-escape truoc khi dua vao command
- Cung ap dung deny pattern nhu `exec` tool (block `curl|sh`, reverse shells, v.v.)
- Env vars duoc ma hoa, khong bao gio hien thi trong plain text

---

## 6. Web Fetch Policy

Cau hinh `web_fetch` tool de kiem soat URL nao agent duoc phep fetch.

| Mode | Hanh Vi |
|------|---------|
| `allow_all` | Cho phep fetch bat ky URL (mac dinh) |
| `allowlist` | Chi cho phep domain trong `allowed_domains` |

**Cau hinh**: **Settings > Builtin Tools > web_fetch > Settings**.

Slack channel co them SSRF protection rieng: chi cho phep download file tu `*.slack.com`, `*.slack-edge.com`, `*.slack-files.com`.

---

## 7. MCP Servers

Dang ky MCP server de mo rong tool cho agent.

### Kieu Transport

| Transport | Mo Ta |
|-----------|-------|
| `stdio` | Khoi chay process, giao tiep qua stdin/stdout |
| `sse` | Ket noi den SSE endpoint qua URL |
| `streamable-http` | Ket noi den HTTP streaming endpoint |

### Dang Ky MCP Server

1. Vao **Settings > MCP > Add Server**
2. Dien:
   - **Name**: ten nhan dang (dung lam prefix cho tool: `mcp_{name}_{tool}`)
   - **Transport**: stdio / sse / streamable-http
   - **Command** (stdio): lenh chay process, vi du: `npx -y @modelcontextprotocol/server-filesystem /workspace`
   - **URL** (sse/http): endpoint URL
3. Luu — GoClaw tu dong ket noi va kham pha tools

**Health check**: 30 giay/lan. **Reconnect**: exponential backoff (2s → 60s max, 10 lan thu).

---

## 8. MCP Grants

Kiem soat agent va user nao duoc phep dung MCP server.

### Cap Quyen cho Agent

1. Vao **MCP > chon server > Grants**
2. Chon agent, tuy chon them **Tool Allow** (chi cho phep tool nay) hoac **Tool Deny** (cam tool nay)
3. Nhan **Grant**

Grant duoc luu trong bang `mcp_agent_grants`. Moi grant co the cau hinh:
- `tool_allow`: mang ten tool duoc phep (rong = tat ca)
- `tool_deny`: mang ten tool bi cam (deny uu tien hon allow)

### Cap Quyen cho User

Tuong tu agent grant nhung ap dung cho tung user cu the (`mcp_user_grants`).

**Quy tac loc**: deny > allow. Tool bi deny se khong bao gio xuat hien du co trong allow list.

---

## 9. MCP Self-Service

User co the tu yeu cau quyen truy cap MCP server, admin phe duyet.

### Flow

1. **User gui request**: qua Web UI hoac API — chon server, scope (agent/user), tool_allow mong muon
2. **Request trang thai `pending`** — admin nhan thong bao
3. **Admin duyet**: Vao **MCP > Pending Requests**
   - **Approve**: tu dong tao grant voi `tool_allow` da yeu cau
   - **Reject**: dong request
4. User nhan ket qua, grant co hieu luc ngay

**Xem pending requests**: **Settings > MCP > Requests tab** hoac **Settings > Approvals**.

---

## Xem Them

- [03-tools-system.md](../03-tools-system.md) — Chi tiet ky thuat tool system
- [12-agents-va-skills.md](./12-agents-va-skills.md) — Cau hinh agent va skills
