# Quan ly Agents

## 1. Tong quan

Trang **Agents** trong Web UI (`/agents`) hien thi danh sach tat ca agent da tao trong tenant. Moi agent la mot thuc the AI doc lap voi cau hinh rieng: model, provider, context files, va behavior settings.

Hai loai agent:
- **predefined** — context chung cho tat ca nguoi dung (SOUL.md, IDENTITY.md cap agent). Phu hop voi bot cong cong, tro ly san pham.
- **open** — moi nguoi dung co workspace rieng, files rieng. Phu hop voi tro ly ca nhan.

---

## 2. Tao agent moi

Click **+ New Agent** de mo dialog tao agent.

| Truong | Mo ta |
|--------|-------|
| Display Name | Ten hien thi (co emoji tuy chon) |
| Agent Key | Slug duy nhat, tu dong sinh tu ten (vd: `my-agent`) |
| Provider | Chon provider da them (dropdown) hoac nhap ten thu cong |
| Model | Chon tu danh sach model cua provider hoac nhap tay |
| Agent Type | `predefined` (context chung) hoac `open` (per-user) |
| Description | Mo ta vai tro agent — dung de sinh SOUL.md tu dong |
| Self Evolution | Cho phep agent tu cap nhat SOUL.md theo phan hoi nguoi dung |

Nut **Check & Create** se kiem tra ket noi model truoc khi tao. Neu model da verify thanh cong, nut chuyen sang **Create**.

---

## 3. Cau hinh agent

Mo agent detail bang cach click vao agent trong danh sach. Tab **Config** chua cac thiet lap chinh:

### Model va Provider

- **Provider**: ten provider da dang ky (vd: `anthropic`, `openrouter`)
- **Model**: ten model cu the (vd: `claude-sonnet-4-5-20250929`, `gpt-4o`)
- **Max Iterations**: so vong lap toi da trong mot lan chay (default: 20). Tang len neu agent co nhieu tool calls phuc tap.
- **History Limit**: so luong user turn giu lai trong lich su (dat boi `historyLimit`). Giu ngan giup tiet kiem token, giu dai giup agent nho context.

---

## 4. Context Files

Tab **Files** trong agent detail cho phep quan ly cac file dinh nghia nhan cach va kien thuc cua agent.

### Files chuan

| File | Chuc nang |
|------|-----------|
| `IDENTITY.md` | Ten, vai tro, nen tang cua agent. Dua vao system prompt o muc "primacy zone". |
| `SOUL.md` | System prompt chinh — phong cach giao tiep, gia tri, nguyen tac xu ly. |
| `BOOTSTRAP.md` | Neu ton tai, agent se chay ngay lap tuc khi khoi dong (mandatory notice). |
| `AGENTS.md` | Mo ta cac agent trong he thong de agent chinh biet each spawning sub-agent. |
| `TOOLS.md` | Tai lieu ve cac tool co san cho agent. |

### Custom files

Co the them file bat ky vao workspace. File duoc inject vao system prompt trong phan "Project Context" voi defensive preamble bao ve agent khoi bi memanipulate boi noi dung ben ngoai.

---

## 5. Per-user Context Files

Doi voi **open agents**: moi nguoi dung co mot thu muc workspace rieng (`base/{userID}/`). Cac file sau duoc tao tu dong khi nguoi dung chat lan dau:

- `USER.md` — thong tin ca nhan, so thich, lich su. Agent co the cap nhat file nay theo thoi gian.

Doi voi **predefined agents**: agent dung context chung (SOUL.md, IDENTITY.md) nhung van co `USER.md` rieng cho tung nguoi dung de luu thong tin ca nhan.

De xem hoac chinh sua file cua mot nguoi dung cu the, su dung API hoac truy cap workspace truc tiep.

---

## 6. Behavior Settings

Trong tab **Config**, phan Behavior:

| Thiet lap | Mo ta |
|-----------|-------|
| Debounce | Thoi gian cho (ms) truoc khi xu ly tin nhan trong group chat (tranh spam) |
| Streaming | Bat/tat stream response theo tung chunk. Tat streaming giup debug. |
| Tool Status | Hien thi trang thai tool call trong UI (tool.call / tool.result events) |
| Input Guard | Kich hoat quet prompt injection (default: `warn` — log nhung khong block) |

---

## 7. Sandbox Mode

Sandbox chay code trong Docker container de cach ly voi may chu chinh.

| Truong | Mo ta |
|--------|-------|
| Mode | `off` — khong sandbox; `non-main` — chi sandbox sub-agent; `all` — sandbox moi thu |
| Workspace Access | `none` isolate hoan toan; `ro` mount read-only; `rw` read-write day du |
| Image | Docker image su dung (vd: `goclaw-sandbox:bookworm-slim`) |
| Scope | `session` — 1 container/phien; `agent` — dung chung giua cac phien; `shared` — chia se moi agent |
| Timeout | Thoi gian toi da (giay) cho moi lenh chay trong sandbox (default: 300) |
| Memory | RAM toi da (MB) cho container (default: 512) |
| CPUs | So CPU core (phan so duoc, vd: 0.5) |
| Network | Bat/tat truy cap mang tu container |

Sandbox yeu cau Docker cai tren may chu. Image phai duoc build san.

---

## 8. Rate Limits

Tab **Permissions** cho phep dat gioi han thuc thi tool theo agent:

- Gioi han so luong tool call trong khoang thoi gian (per hour/day/week)
- Ap dung RBAC: `admin` / `operator` / `viewer`
- Co the tu choi cac tool cu the cho agent qua **Tool Policy**

---

## 9. Export va Import Agent

Hien tai cau hinh agent duoc luu trong PostgreSQL. De backup:

1. Su dung API `GET /v1/agents/{id}` de lay cau hinh JSON
2. Luu lai tat ca context files tu workspace (`SOUL.md`, `IDENTITY.md`, v.v.)
3. De restore: `POST /v1/agents` voi payload tuong tu, sau do upload lai files

---

## 10. Agent Sharing

Agent co the chia se thong qua **pairing link** (tinh nang kenh ngoai, vd: Telegram):

- Moi kenh (Telegram, Zalo, Discord, v.v.) co `agent_key` gan voi agent
- Link chia se duoc tao tu Web UI hoac qua WS method `pairing.generate`
- Nguoi dung quet/click link se duoc ket noi vao agent tuong ung

De ngan chan truy cap: vo hieu hoa kenh hoac xoa agent.
