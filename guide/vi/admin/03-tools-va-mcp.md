# Tools và MCP Servers

## Tổng Quan

GoClaw có hệ thống built-in tools nhóm theo category, và hỗ trợ đăng ký MCP servers để mở rộng khả năng agent. Tool access được kiểm soát qua profiles và policies nhiều lớp.

**Route built-in tools:** `/builtin-tools` — Admin
**Route MCP servers:** `/mcp` — Admin

---

## Hướng Dẫn

### Built-in Tool Profiles

4 cấp độ profile xác định bộ tools nào agent được phép dùng:

| Profile | Tools Bao Gồm |
|---------|---------------|
| `minimal` | Chỉ `session_status` |
| `messaging` | messaging, web, sessions, media_read, skill_search |
| `coding` | fs, runtime, sessions, memory, web, knowledge, media_gen, media_read, skills |
| `full` | Tất cả tools đã đăng ký |

**Cấu hình:** Agents > chọn agent > tab Tools > chọn profile. Có thể ghi đè profile theo từng LLM provider.

### Exec Approval

Kiểm soát việc agent chạy lệnh shell:

**Chế độ bảo mật:**

| Mode | Hành Vi |
|------|---------|
| `deny` | Block tất cả lệnh shell |
| `allowlist` | Chỉ chấp nhận lệnh khớp glob pattern trong allowlist |
| `full` | Cho phép tất cả lệnh (mặc định) |

**Chế độ hỏi:**

| Mode | Hành Vi |
|------|---------|
| `off` | Tự động chấp nhận — không hỏi (mặc định) |
| `on-miss` | Hỏi khi lệnh không có trong allowlist |
| `always` | Hỏi trước mỗi lần chạy lệnh |

Khi hỏi: request gửi đến admin, timeout 2 phút. Admin chọn: **Cho phép một lần** | **Luôn cho phép** | **Từ chối**.

Lệnh bị block bất kể mode: `rm -rf`, `curl|sh`, reverse shells, fork bombs, ...

**Cấu hình:** Settings > Config > exec, hoặc per-agent trong Agents settings.

### Custom Tools

Tạo tool từ shell command không cần recompile hay restart:

1. Vào **Settings > Custom Tools > Tạo công cụ**
2. Điền các trường:
   - **Name**: tên tool (dùng trong LLM tool call)
   - **Description**: mô tả để LLM hiểu khi nào dùng
   - **Parameters**: JSON Schema cho tham số
   - **Command**: lệnh shell, dùng <code v-pre>{{.param_name}}</code> cho tham số
   - **Timeout**: mặc định 60 giây
   - **Scope**: Global (tất cả agents) hoặc per-agent
3. **Environment Variables**: lưu mã hóa AES-256-GCM, inject vào process khi chạy

Ví dụ: <code v-pre>dig +short {{.record_type}} {{.domain}}</code>

Bảo mật: tham số được shell-escape, áp dụng deny pattern như `exec` tool, env vars không bao giờ hiển thị plain text.

### Web Fetch Policy

Kiểm soát URL nào agent được phép fetch:

| Mode | Hành Vi |
|------|---------|
| `allow_all` | Cho phép fetch bất kỳ URL (mặc định) |
| `allowlist` | Chỉ cho phép domain trong `allowed_domains` |

**Cấu hình:** Settings > Builtin Tools > web_fetch > Cài đặt.

### Đăng Ký MCP Server

1. Vào **Settings > MCP > Thêm máy chủ**
2. Điền:
   - **Name**: tên nhận dạng (tạo prefix tool: `mcp_{name}_{tool}`)
   - **Transport**: stdio / sse / streamable-http
   - **Command** (stdio): vd `npx -y @modelcontextprotocol/server-filesystem /workspace`
   - **URL** (sse/http): endpoint URL
   - **Environment Variables**, Timeout, Enabled, Yêu cầu xác thực người dùng
3. Nhấn **Kiểm tra kết nối** > **Tạo/Cập nhật** | **Hủy**

Health check: 30 giây/lần. Reconnect: exponential backoff (2s → 60s max, 10 lần thử).

### MCP Grants — Cấp Quyền

**Cấp quyền cho Agent:**
1. MCP > chọn server > Quản lý quyền
2. Chọn agent, tùy chọn thêm Tool Allow / Tool Deny
3. Nhấn **Cấp quyền** / **Thu hồi**

**Cấp quyền cho User:** Tương tự nhưng áp dụng cho user cụ thể.

Quy tắc: deny > allow. Tool bị deny sẽ không xuất hiện dù có trong allow list.

### MCP Self-Service

User có thể tự yêu cầu quyền truy cập MCP server:
1. User gửi request qua Web UI hoặc API
2. Request ở trạng thái `pending` — admin nhận thông báo
3. Admin vào **MCP > Pending Requests** > **Phê duyệt** hoặc **Từ chối**
4. Grant có hiệu lực ngay sau khi duyệt

---

## Giao Diện (UI)

### Trang Built-in Tools (`/builtin-tools`)

**Hiển thị:** Tất cả tools nhóm theo category. Mỗi tool: tên hiển thị, tên mã, mô tả, huy hiệu yêu cầu, huy hiệu lỗi thời.

**Danh mục:** filesystem, runtime, web, memory, media, browser, sessions, messaging, scheduling, subagents, skills, delegation, teams.

**Thao tác:** Bật/tắt switch mỗi tool | Cấu hình cài đặt (hộp thoại) | Ghi đè theo tổ chức | Đặt lại ghi đè | Tìm kiếm | Làm mới

> Cảnh báo khi bật tool media mà không có provider được cấu hình.

### Trang MCP Servers (`/mcp`)

**Hiển thị:** Bảng tích hợp MCP: tên, loại vận chuyển, số tool, số agent, trạng thái, người tạo.

**Thao tác:** Thêm MCP server | Chỉnh sửa | Xóa | Kết nối lại | Quản lý cấp phép agent | Xem tools | Quản lý xác thực người dùng

**Hộp thoại Form MCP:**
- Trường: Tên, Tên hiển thị, Vận chuyển (stdio: lệnh+args | SSE/HTTP: URL+headers), Biến môi trường, Tiền tố tool, Timeout, Bật/tắt, Yêu cầu xác thực
- Thao tác: **Kiểm tra kết nối** | **Tạo/Cập nhật** | **Hủy**

**Hộp thoại Cấp Phép Agent:** Danh sách cấp phép hiện có + form cấp: chọn agent, danh sách cho phép/từ chối (multi-select có tìm kiếm). **Cấp/Cập nhật** | **Thu hồi** | **Hủy**

**Hộp thoại Xem Tools:** Danh sách cuộn có lọc tìm kiếm — tên, mô tả, huy hiệu tiền tố (chỉ đọc).

**Hộp thoại Xác Thực Người Dùng:** Chọn người dùng, API Key, Headers (che giấu nhạy cảm), Biến môi trường. **Lưu** | **Xóa tất cả** | **Hủy**

---

## Danh Sách Built-in Tools

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

### Tạo Media (`media_gen`)
`create_image`, `create_audio`, `create_video`, `tts`

### Đọc Media (`media_read`)
`read_image`, `read_audio`, `read_document`, `read_video`

### Khác
`cron` (automation), `datetime` (automation), `message` (messaging), `knowledge_graph_search`, `use_skill`, `publish_skill`, `workspace_dir`, `openai_compat_call`

---

## Tool Policies — 7 Bước Lọc

1. Global profile (full/coding/messaging/minimal)
2. Provider profile override
3. Global allow list
4. Provider allow override
5. Agent allow list
6. Agent + Provider allow
7. Group allow list

Sau đó áp dụng deny list (global, agent), cuối cùng áp dụng alsoAllow. Tham chiếu nhóm tool: dùng tiền tố `group:`, vd `group:fs`, `group:web`.

---

## Lưu Ý

- MCP Transport `stdio`: khởi chạy process cục bộ; `sse`/`streamable-http`: kết nối đến URL
- Tool prefix mặc định: `mcp_{server_name}_{tool_name}`
- Slack channel có SSRF protection riêng: chỉ cho download từ `*.slack.com`

---

## Xem Thêm

- [Exec approval và shell deny patterns](05-bao-mat.md)
- [Cấu hình LLM providers](01-providers.md)
