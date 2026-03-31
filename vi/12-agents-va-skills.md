# 12 - Agents va Skills

---

## 1. Agent La Gi

Agent la mot AI assistant duoc cau hinh voi:

- **Ca tinh va gio thieu** (SOUL.md, IDENTITY.md): Giong noi, phong cach, ten, bieu tuong
- **Kien thuc nen tang** (AGENTS.md, TOOLS.md): Cach van hanh, cong cu co san
- **Ho so nguoi dung** (USER.md): Ten, mui gio, so thich cua ban
- **Skills va tools**: Kha nang mo rong de thuc hien cong viec cu the

Moi agent chay vong lap **Think → Act → Observe** (toi da 20 vong) cho den khi tao ra phan hoi cuoi cung.

---

## 2. Hai Loai Agent

### Open Agent (Agent Mo)

- Moi nguoi dung co **bo context rieng hoan toan** (6 file: AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, BOOTSTRAP.md)
- Ca tinh va ky nang co the duoc tuy chinh rieng cho tung nguoi
- Phu hop khi moi nguoi can mot AI assistant ca nhan hoa khac nhau

### Predefined Agent (Agent Dinh Nghia San)

- **Ca tinh chia se** cho tat ca nguoi dung (SOUL.md, IDENTITY.md, AGENTS.md o cap agent)
- Moi nguoi dung co USER.md rieng de agent nho thong tin ca nhan
- USER_PREDEFINED.md cung cap quy tac xu ly nguoi dung chung
- Phu hop khi can mot AI assistant nhat quan, theo tieu chuan (vi du: bot ho tro khach hang)

| Dac diem | Open | Predefined |
|----------|------|-----------|
| Context | Hoan toan rieng biet | Ca tinh chung, profile rieng |
| Tuy chinh | Toan phan | Chi USER.md |
| Use case | Personal assistant | Shared assistant |

---

## 3. Chon Agent Trong Chat

- Sidebar chat co dropdown **AgentSelector** — chon agent truoc khi tao session moi
- Agent mac dinh la `default` neu khong chon
- URL session key co nhung thong tin agent: `agent:{agentId}:...` — chuyen session la chuyen agent
- Tren cac kenh ngoai (Telegram, Discord, v.v.), agent duoc gan luc cau hinh kenh; nguoi dung khong can chon

---

## 4. Skills — Kha Nang Mo Rong

Skills la cac module kien thuc hoac huong dan duoc nhung vao system prompt, giup agent biet cach su dung cong cu hoac xu ly linh vuc cu the.

**Vi du skills co san:**

| Skill | Chuc nang |
|-------|-----------|
| `pdf` | Doc, tao, gop, tach file PDF |
| `xlsx` | Doc, tao, chinh sua spreadsheet |
| `docx` | Doc, tao, chinh sua file Word |
| `pptx` | Doc, tao, chinh sua bai thuyet trinh |
| `skill-creator` | Tao skill moi |

**Tim kiem skills:**

- Neu <= 20 skills va tong token <= 3,500: Danh sach skills duoc nhung truc tiep vao system prompt (inline mode)
- Neu nhieu hon: Agent dung tool `skill_search` de tim kiem theo keyword (BM25 + vector search)

**Visibility:**

| Muc | Quyen truy cap |
|-----|----------------|
| `public` | Tat ca agent va nguoi dung |
| `private` | Chi chu so huu |
| `internal` | Phai duoc cap quyen ro rang |

---

## 5. Tools — Cong Cu Agent Co The Dung

Tools la chuc nang thuc thi, khac skills (la kien thuc). Agent chon tool phu hop va goi chung trong qua trinh xu ly.

| Nhom tool | Vi du |
|-----------|-------|
| Filesystem | `read_file`, `write_file`, `list_files` |
| Web | `web_search`, `browser_act`, `browser_screenshot` |
| Code execution | `exec` (chay Python, Node.js trong sandbox Docker) |
| Memory | `memory_search`, `memory_write` |
| TTS | `tts_convert` (van ban sang giong noi) |
| Subagent | Goi agent khac xu ly tac vu con |
| MCP tools | Cong cu tu MCP server ben ngoai |

Moi request co the co danh sach tools duoc phep rieng (vi du: Telegram forum topic co the gioi han tools).

---

## 6. Memory — Agent Nho Gi Ve Ban

Agent luu ky uc lau dai trong cac file `MEMORY.md` (va `memory/*.md`) o workspace.

**Qua trinh hoat dong:**

- Khi session gap nguong context (> 85%), agent duoc yeu cau luu ky uc can giu truoc khi lich su bi tom tat
- Ky uc duoc chunk, embed va index bang hybrid search (FTS + pgvector)
- Lan sau chat, agent tu dong truy van va inject cac ky uc lien quan vao system prompt

**Xoa memory:**

- Qua Web UI: vao trang **Memory**, tim ky uc can xoa, nhan Delete
- Qua API: `DELETE /v1/memory/{id}`
- Xoa file MEMORY.md truc tiep trong workspace (neu co quyen)

---

## 7. Extended Thinking — Suy Nghi Sau

Extended Thinking cho phep model "suy nghi noi tieng" truoc khi tra loi, cai thien chat luong voi cac cau hoi phuc tap.

**Cac muc:**

| Muc | Mo ta |
|-----|-------|
| `off` | Tat (mac dinh) |
| `low` | Suy nghi nhanh, toi thieu |
| `medium` | Can bang giua toc do va chat luong |
| `high` | Suy nghi sau nhat, danh cho tac vu phuc tap |

**Ho tro:** Anthropic (Claude), OpenAI (GPT-4o reasoning, o1, o3), ACP.

**Luu y:** Extended Thinking tieu ton them token va tang thoi gian phan hoi. Chi nen bat khi can xu ly cac van de kho, suy luan da buoc, hoac lap luan phuc tap.

**Cau hinh:** Bat/tat trong cai dat agent (`other_config.thinking_level`) hoac thua ke tu provider (`reasoning_defaults`). Khi dang chat, ThinkingBlock hien thi noi dung suy nghi cua model (co the an/hien).

---

## Xem Them

- [07-bootstrap-skills-memory.md](../07-bootstrap-skills-memory.md) — Chi tiet skills, memory, bootstrap
- [12-extended-thinking.md](../12-extended-thinking.md) — Cau hinh Extended Thinking
- [03-tools-system.md](../03-tools-system.md) — He thong tools
- [14-skills-runtime.md](../14-skills-runtime.md) — Runtime environment cho skills (Docker, Python, Node.js)
