# Tools va MCP Servers

## Tong Quan

GoClaw co he thong built-in tools nhom theo category, va ho tro dang ky MCP servers de mo rong kha nang agent. Tool access duoc kiem soat qua profiles va policies nhieu lop.

**Route built-in tools:** `/builtin-tools` — Admin
**Route MCP servers:** `/mcp` — Admin

---

## Huong Dan

### Built-in Tool Profiles

4 cap do profile xac dinh bo tools nao agent duoc phep dung:

| Profile | Tools Bao Gom |
|---------|---------------|
| `minimal` | Chi `session_status` |
| `messaging` | messaging, web, sessions, media_read, skill_search |
| `coding` | fs, runtime, sessions, memory, web, knowledge, media_gen, media_read, skills |
| `full` | Tat ca tools da dang ky |

**Cau hinh:** Agents > chon agent > tab Tools > chon profile. Co the ghi de profile theo tung LLM provider.

### Exec Approval

Kiem soat viec agent chay lenh shell:

**Security Mode:**

| Mode | Hanh Vi |
|------|---------|
| `deny` | Block tat ca lenh shell |
| `allowlist` | Chi chap nhan lenh khop glob pattern trong allowlist |
| `full` | Cho phep tat ca lenh (mac dinh) |

**Ask Mode:**

| Mode | Hanh Vi |
|------|---------|
| `off` | Tu dong chap nhan — khong hoi (mac dinh) |
| `on-miss` | Hoi khi lenh khong co trong allowlist |
| `always` | Hoi truoc moi lan chay lenh |

Khi hoi: request gui den admin, timeout 2 phut. Admin chon: **Allow once** | **Allow always** | **Deny**.

Lenh bi block bat ke mode: `rm -rf`, `curl|sh`, reverse shells, fork bombs, ...

**Cau hinh:** Settings > Config > exec, hoac per-agent trong Agents settings.

### Custom Tools

Tao tool tu shell command khong can recompile hay restart:

1. Vao **Settings > Custom Tools > Add Tool**
2. Dien cac truong:
   - **Name**: ten tool (dung trong LLM tool call)
   - **Description**: mo ta de LLM hieu khi nao dung
   - **Parameters**: JSON Schema cho tham so
   - **Command**: lenh shell, dung `{{.param_name}}` cho tham so
   - **Timeout**: mac dinh 60 giay
   - **Scope**: Global (tat ca agents) hoac per-agent
3. **Environment Variables**: luu ma hoa AES-256-GCM, inject vao process khi chay

Vi du: `dig +short {{.record_type}} {{.domain}}`

Bao mat: tham so duoc shell-escape, ap dung deny pattern nhu `exec` tool, env vars khong bao gio hien thi plain text.

### Web Fetch Policy

Kiem soat URL nao agent duoc phep fetch:

| Mode | Hanh Vi |
|------|---------|
| `allow_all` | Cho phep fetch bat ky URL (mac dinh) |
| `allowlist` | Chi cho phep domain trong `allowed_domains` |

**Cau hinh:** Settings > Builtin Tools > web_fetch > Settings.

### Dang Ky MCP Server

1. Vao **Settings > MCP > Add Server**
2. Dien:
   - **Name**: ten nhan dang (tao prefix tool: `mcp_{name}_{tool}`)
   - **Transport**: stdio / sse / streamable-http
   - **Command** (stdio): vd `npx -y @modelcontextprotocol/server-filesystem /workspace`
   - **URL** (sse/http): endpoint URL
   - **Environment Variables**, Timeout, Enabled, Yeu cau xac thuc nguoi dung
3. Nhan **Kiem tra ket noi** > **Tao/Cap nhat** | **Huy**

Health check: 30 giay/lan. Reconnect: exponential backoff (2s → 60s max, 10 lan thu).

### MCP Grants — Cap Quyen

**Cap quyen cho Agent:**
1. MCP > chon server > Grants
2. Chon agent, tuy chon them Tool Allow / Tool Deny
3. Nhan **Grant** / **Thu hoi**

**Cap quyen cho User:** Tuong tu nhung ap dung cho user cu the.

Quy tac: deny > allow. Tool bi deny se khong xuat hien du co trong allow list.

### MCP Self-Service

User co the tu yeu cau quyen truy cap MCP server:
1. User gui request qua Web UI hoac API
2. Request o trang thai `pending` — admin nhan thong bao
3. Admin vao **MCP > Pending Requests** > **Approve** hoac **Reject**
4. Grant co hieu luc ngay sau khi duyet

---

## Giao Dien (UI)

### Trang Built-in Tools (`/builtin-tools`)

**Hien thi:** Tat ca tools nhom theo category. Moi tool: ten hien thi, ten ma, mo ta, huy hieu yeu cau, huy hieu loi thoi.

**Danh muc:** filesystem, runtime, web, memory, media, browser, sessions, messaging, scheduling, subagents, skills, delegation, teams.

**Thao tac:** Bat/tat switch moi tool | Cau hinh cai dat (hop thoai) | Ghi de theo to chuc | Dat lai ghi de | Tim kiem | Lam moi

> Canh bao khi bat tool media ma khong co provider duoc cau hinh.

### Trang MCP Servers (`/mcp`)

**Hien thi:** Bang tich hop MCP: ten, loai van chuyen, so tool, so agent, trang thai, nguoi tao.

**Thao tac:** Them MCP server | Chinh sua | Xoa | Ket noi lai | Quan ly cap phep agent | Xem tools | Quan ly xac thuc nguoi dung

**Hop thoai Form MCP:**
- Truong: Ten, Ten hien thi, Van chuyen (stdio: lenh+args | SSE/HTTP: URL+headers), Bien moi truong, Tien to tool, Timeout, Bat/tat, Yeu cau xac thuc
- Thao tac: **Kiem tra ket noi** | **Tao/Cap nhat** | **Huy**

**Hop thoai Cap Phep Agent:** Danh sach cap phep hien co + form cap: chon agent, danh sach cho phep/tu choi (multi-select co tim kiem). **Cap/Cap nhat** | **Thu hoi** | **Huy**

**Hop thoai Xem Tools:** Danh sach cuon co loc tim kiem — ten, mo ta, huy hieu tien to (chi doc).

**Hop thoai Xac Thuc Nguoi Dung:** Chon nguoi dung, API Key, Headers (che giau nhay cam), Bien moi truong. **Luu** | **Xoa tat ca** | **Huy**

---

## Danh Sach Built-in Tools

### Filesystem (`fs`)
`read_file`, `write_file`, `edit`, `list_files`, `search`, `glob`

### Runtime (`runtime`)
`exec`, `credentialed_exec`

### Web (`web`)
`web_search`, `web_fetch`

### Memory (`memory`)
`memory_search`, `memory_get`

### Sessions (`sessions`)
`sessions_list`, `sessions_history`, `sessions_send`, `spawn`, `session_status`

### Teams (`teams`)
`team_tasks`, `team_message`

### Tao Media (`media_gen`)
`create_image`, `create_audio`, `create_video`, `tts`

### Doc Media (`media_read`)
`read_image`, `read_audio`, `read_document`, `read_video`

### Khac
`cron` (automation), `datetime` (automation), `message` (messaging), `knowledge_graph_search`, `use_skill`, `publish_skill`, `workspace_dir`, `openai_compat_call`

---

## Tool Policies — 7 Buoc Loc

1. Global profile (full/coding/messaging/minimal)
2. Provider profile override
3. Global allow list
4. Provider allow override
5. Agent allow list
6. Agent + Provider allow
7. Group allow list

Sau do ap dung deny list (global, agent), cuoi cung ap dung alsoAllow. Tham chieu nhom tool: dung tien to `group:`, vd `group:fs`, `group:web`.

---

## Luu Y

- MCP Transport `stdio`: khoi chay process cuc bo; `sse`/`streamable-http`: ket noi den URL
- Tool prefix mac dinh: `mcp_{server_name}_{tool_name}`
- Slack channel co SSRF protection rieng: chi cho download tu `*.slack.com`

---

## Xem Them

- [guide/vi/admin/05-bao-mat.md](05-bao-mat.md) — Exec approval va shell deny patterns
- [guide/vi/admin/01-providers.md](01-providers.md) — Cau hinh LLM providers
