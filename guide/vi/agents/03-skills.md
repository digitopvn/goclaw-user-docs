# Skills (Ky Nang)

## Tong quan

Skills la cac module kien thuc hoac huong dan duoc nhung vao system prompt, giup agent biet cach su dung cong cu hoac xu ly linh vuc cu the. Khac voi tools (thuc thi hanh dong), skills la kien thuc — agent doc skills de biet cach lam viec.

---

## Skills la gi

Skills la file ZIP chua:
- Huong dan su dung cong cu (vi du: cach dung `pdf`, `xlsx`, `docx`)
- Quy trinh xu ly tac vu cu the
- Tai lieu tham khao noi bo

**Vi du skills co san:**

| Skill | Chuc nang |
|-------|-----------|
| `pdf` | Doc, tao, gop, tach file PDF |
| `xlsx` | Doc, tao, chinh sua spreadsheet |
| `docx` | Doc, tao, chinh sua file Word |
| `pptx` | Doc, tao, chinh sua bai thuyet trinh |
| `skill-creator` | Tao skill moi |

**Cach agent tim kiem skills:**

| Dieu kien | Hanh vi |
|-----------|---------|
| <= 20 skills va tong token <= 3,500 | Danh sach skills duoc nhung truc tiep vao system prompt (inline mode) |
| Nhieu hon nguong tren | Agent dung tool `skill_search` de tim kiem theo keyword (BM25 + vector search) |

---

## Pham vi hien thi (Visibility)

| Muc | Quyen truy cap |
|-----|----------------|
| `public` | Tat ca agent va nguoi dung |
| `private` | Chi chu so huu |
| `internal` | Phai duoc cap quyen ro rang |

---

## Giao dien — Trang Skills

Route: `/skills`
Nhom Sidebar: Kha Nang
Quyen truy cap: Da dang nhap

Hien thi bang hai tab:
- **Core**: Skills he thong (built-in)
- **Tuy chinh**: Skills do nguoi dung tai len

Cac cot: ten, mo ta, tac gia, trang thai, kha nang hien thi, thao tac.

Bang **Thieu dependencies** hien o tren cung neu co skill chua du dieu kien chay.

**Thao tac:**
- **Tai len skill** — keo tha file `.zip` vao vung tai len
- **Chinh sua metadata** — ten, mo ta, kha nang hien thi, the
- **Xoa skill** — xac nhan
- **Bat/tat** — switch moi skill
- **Chuyen doi kha nang hien thi** — nhan badge de chuyen `public` -> `internal` -> `private`
- **Quet lai dependencies** — quet tat ca skills
- **Cai dat dependency don le** — cai dat tung goi
- **Ghi de theo to chuc** — bat/tat skill cho to chuc hien tai (Toggle / Dat lai)

---

## Huong dan — Tai len skill moi

1. Vao `/skills`, nhan **Tai len skill**.
2. Keo tha file `.zip` vao vung tai len (hoac nhan de chon file).
3. He thong xac thuc tung file: **dang xac thuc** -> **hop le / khong hop le** -> **dang tai** -> **thanh cong / loi**.
4. Nhan **Tai len [N]** de bat dau tai len cac file da xac thuc.
5. Sau khi hoan thanh, nhan **Xong**.
6. Nhan **X** moi file de xoa khoi hang doi truoc khi tai.

---

## Giao dien — Chi tiet Skill

Route: `/skills/:id`
Nhom Sidebar: Kha Nang
Quyen truy cap: Da dang nhap

Mo duoi dang hop thoai tu trang `/skills`.

**Hai tab:**

| Tab | Noi dung |
|-----|----------|
| Noi dung | README markdown cua skill |
| Files | Chon phien ban, cay file, trinh xem noi dung voi to sang cu phap |

**Thao tac:**
- **Xem phien ban** — danh sach tat ca phien ban da phat hanh
- **Duyet files** — danh sach file trong thu muc skill
- **Doc noi dung file** — hien thi trong trinh xem voi to sang cu phap
- **Ghim phien ban cho agent** — cap skill cho agent theo phien ban cu the
- **Sao chep** — sao chep noi dung file

---

## Tools — Cong cu Agent Co The Dung

Tools la chuc nang thuc thi (khac skills la kien thuc). Agent chon tool phu hop va goi trong qua trinh xu ly.

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

## Vi du — Them skill pdf cho agent

```
/skills -> Tai len skill -> keo tha pdf.zip
  -> Xac thuc: hop le
  -> Tai len -> Thanh cong
/skills -> nhan "pdf" -> Chi tiet -> Ghim phien ban
  -> Chon agent: "Assistant", phien ban: latest
  -> Xac nhan
```

---

## Luu y

- Skills chi la kien thuc — agent van can co tools tuong ung moi thuc hien duoc (vi du: skill `pdf` can tool `exec` hoac `read_file`).
- Skills `private` chi chu so huu thay — phu hop cho kien thuc noi bo cua tung nguoi.
- Xoa skill dang duoc su dung boi agent khong tu dong vo hieu hoa agent — agent chi khong tim thay skill khi can.
- Phien ban skill duoc ghim cho agent: neu khong ghim phien ban cu the, agent dung phien ban moi nhat.

---

## Xem them

- [01-tong-quan-agents.md](./01-tong-quan-agents.md) — Khai niem agent va skills
- [02-cau-hinh-agent.md](./02-cau-hinh-agent.md) — Cau hinh agent nang cao
- [04-codex-pool.md](./04-codex-pool.md) — Codex Pool cho ChatGPT OAuth routing
