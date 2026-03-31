# Cau Hinh Agent

## Tong quan

Trang chi tiet agent (`/agents/:id`) cung cap day du cong cu de cau hinh model, behavior, sandbox, rate limits, va context files. Day la trang danh cho admin va operator can tinh chinh agent cho moi truong san xuat.

Route: `/agents/:id`
Nhom Sidebar: Core
Quyen truy cap: Da dang nhap (mot so phan yeu cau Admin)

---

## Giao dien chi tiet agent

Trang gom 4 tab chinh:

| Tab | Noi dung |
|-----|----------|
| Tong quan | Cau hinh model, provider, behavior settings |
| Files | Context files (SOUL.md, IDENTITY.md, AGENTS.md, ...) |
| Quyen | Phan quyen per-user |
| Instances | Chi hien voi predefined agent — danh sach per-user instances |

**Thao tac chinh tren trang:**
- Cap nhat cau hinh agent
- Tai tao tu prompt — xay dung lai agent tu mo ta moi
- Trieu hoi lai — khoi tao lai agent (chay lai sinh context files)
- Xoa agent — hop thoai xac nhan
- Cai dat nang cao — mo hop thoai nang cao
- Cau hinh Heartbeat — thiet lap kiem tra suc khoe
- Quan ly Codex Pool — dieu huong den `/agents/:id/codex-pool`

---

## Huong dan cau hinh

### Model va Provider

Trong tab **Tong quan**:

| Truong | Mo ta |
|--------|-------|
| Provider | Ten provider da dang ky (vi du: `anthropic`, `openrouter`) |
| Model | Ten model cu the (vi du: `claude-sonnet-4-5-20250929`, `gpt-4o`) |
| Max Iterations | So vong lap toi da trong mot lan chay (mac dinh: 20). Tang neu agent co nhieu tool calls phuc tap. |
| History Limit | So user turn giu lai trong lich su. Ngan tiet kiem token, dai giup nho context. |

### Context Files (Tab Files)

Cac file dinh nghia nhan cach va kien thuc cua agent:

| File | Chuc nang |
|------|-----------|
| `IDENTITY.md` | Ten, vai tro, nen tang cua agent. Dua vao system prompt o muc "primacy zone". |
| `SOUL.md` | System prompt chinh — phong cach giao tiep, gia tri, nguyen tac xu ly. |
| `BOOTSTRAP.md` | Neu ton tai, agent chay ngay lap tuc khi khoi dong (mandatory notice). |
| `AGENTS.md` | Mo ta cac agent trong he thong de agent chinh biet cach spawn sub-agent. |
| `TOOLS.md` | Tai lieu ve cac tool co san cho agent. |

Co the them file bat ky vao workspace. File duoc inject vao system prompt trong phan "Project Context" voi defensive preamble bao ve agent khoi bi manipulate boi noi dung ben ngoai.

**Per-user context files** (open agents): Moi nguoi dung co thu muc `base/{userID}/` rieng. File `USER.md` duoc tao tu dong khi nguoi dung chat lan dau — agent co the cap nhat file nay theo thoi gian.

**Tao lai tu prompt** (Tab Files):
1. Nhan **Tai tao tu prompt**.
2. Nhap mo ta vai tro moi vao textarea.
3. Nhan **Tai tao** — he thong sinh lai SOUL.md va cac context files.

### Behavior Settings

| Thiet lap | Mo ta |
|-----------|-------|
| Debounce | Thoi gian cho (ms) truoc khi xu ly tin nhan trong group chat (tranh spam) |
| Streaming | Bat/tat stream response theo tung chunk. Tat giup debug. |
| Tool Status | Hien thi trang thai tool call trong UI (tool.call / tool.result events) |
| Input Guard | Kich hoat quet prompt injection (mac dinh: `warn` — log nhung khong block) |

### Cai dat nang cao

Mo qua nut **Cai dat nang cao**:

| Phan | Noi dung |
|------|----------|
| Chia se workspace | Cau hinh chia se workspace giua cac agent |
| Suy luan | Che do, muc do, du phong cho Extended Thinking |
| Dinh tuyen ChatGPT OAuth | Cau hinh Codex Pool routing |
| Nen ngu canh | Nguong va chien luoc nen lich su hoi thoai |
| Cat tia ngu canh | Loai bo cac phan ngu canh it quan trong |
| Sandbox | Cau hinh Docker sandbox cho code execution |

### Sandbox Mode

Chay code trong Docker container de cach ly voi may chu chinh.

| Truong | Mo ta |
|--------|-------|
| Mode | `off` — khong sandbox; `non-main` — chi sandbox sub-agent; `all` — sandbox moi thu |
| Workspace Access | `none` isolate hoan toan; `ro` mount read-only; `rw` read-write day du |
| Image | Docker image su dung (vi du: `goclaw-sandbox:bookworm-slim`) |
| Scope | `session` — 1 container/phien; `agent` — dung chung giua cac phien; `shared` — chia se moi agent |
| Timeout | Thoi gian toi da (giay) cho moi lenh chay trong sandbox (mac dinh: 300) |
| Memory | RAM toi da (MB) cho container (mac dinh: 512) |
| CPUs | So CPU core (phan so duoc, vi du: 0.5) |
| Network | Bat/tat truy cap mang tu container |

Sandbox yeu cau Docker cai tren may chu. Image phai duoc build san.

### Rate Limits va Quyen (Tab Quyen)

- Gioi han so luong tool call trong khoang thoi gian (per hour/day/week).
- Ap dung RBAC: `admin` / `operator` / `viewer`.
- Tu choi cac tool cu the cho agent qua **Tool Policy**.

**Them quyen per-user:**
- Nhap ID Nguoi dung, Loai cau hinh, Pham vi, Quyen (cho phep/tu choi).
- Nhan **Them (+)** de cap quyen.
- Nhan **Xoa (X)** de thu hoi quyen.

### Heartbeat (Kiem tra suc khoe)

Nhan **Cau hinh Heartbeat** de thiet lap:

| Truong | Mo ta |
|--------|-------|
| Bat/tat | Bat/tat heartbeat |
| Chu ky (phut) | Khoang thoi gian giua cac lan kiem tra |
| Provider/Model ghi de | Dung provider/model khac cho heartbeat |
| Kenh | Kenh nhan thong bao |
| Chat ID | ID cuoc tro chuyen nhan thong bao |
| Gio hoat dong | Khung gio cho phep chay heartbeat |
| Mui gio | Mui gio ap dung |
| Danh sach kiem tra | Cac buoc kiem tra tuy chinh |

Nhan **Chay thu** de kiem tra ngay lap tuc. Xem lich su heartbeat qua **Nhat Ky Heartbeat**.

---

## Vi du — Cau hinh sandbox cho agent viet code

```
/agents/my-coder -> Cai dat nang cao -> Sandbox:
  Mode: non-main
  Workspace Access: rw
  Image: goclaw-sandbox:bookworm-slim
  Scope: session
  Timeout: 120
  Memory: 1024
  Network: bat
-> Luu
```

---

## Luu y

- Thay doi Model/Provider anh huong ngay den cac session moi; session dang chay khong bi gian doan.
- Max Iterations qua thap co the lam agent dung giua chung khi co nhieu tool calls phuc tap.
- Sandbox yeu cau Docker daemon chay tren may chu — kiem tra `docker info` truoc khi bat.
- Tab Instances chi hien voi predefined agent — cho phep xem va quan ly context rieng cua tung nguoi dung.

---

## Xem them

- [01-tong-quan-agents.md](./01-tong-quan-agents.md) — Khai niem co ban ve agents
- [03-skills.md](./03-skills.md) — Them skills cho agent
- [04-codex-pool.md](./04-codex-pool.md) — Cau hinh Codex Pool routing
