# Tong Quan ve Agents

## Tong quan

Agent la mot AI assistant duoc cau hinh voi ca tinh, kien thuc, va cac cong cu cu the. GoClaw ho tro nhieu agent chay song song, moi agent co workspace rieng biet va vong lap xu ly doc lap.

---

## Agent la gi

Agent la mot thuc the AI doc lap duoc cau hinh voi:

- **Ca tinh va gioi thieu** (SOUL.md, IDENTITY.md): Giong noi, phong cach, ten, bieu tuong
- **Kien thuc nen tang** (AGENTS.md, TOOLS.md): Cach van hanh, cong cu co san
- **Ho so nguoi dung** (USER.md): Ten, mui gio, so thich cua nguoi dung
- **Skills va tools**: Kha nang mo rong de thuc hien cong viec cu the

Moi agent chay vong lap **Think -> Act -> Observe** (toi da 20 vong) cho den khi tao ra phan hoi cuoi cung.

---

## Hai loai agent

### Open Agent (Agent Mo)

- Moi nguoi dung co **bo context rieng hoan toan** (6 file: AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, BOOTSTRAP.md).
- Ca tinh va ky nang co the duoc tuy chinh rieng cho tung nguoi.
- Phu hop khi moi nguoi can mot AI assistant ca nhan hoa khac nhau.

### Predefined Agent (Agent Dinh Nghia San)

- **Ca tinh chia se** cho tat ca nguoi dung (SOUL.md, IDENTITY.md, AGENTS.md o cap agent).
- Moi nguoi dung co USER.md rieng de agent nho thong tin ca nhan.
- USER_PREDEFINED.md cung cap quy tac xu ly nguoi dung chung.
- Phu hop khi can mot AI assistant nhat quan, theo tieu chuan (vi du: bot ho tro khach hang).

| Dac diem | Open | Predefined |
|----------|------|-----------|
| Context | Hoan toan rieng biet | Ca tinh chung, profile rieng |
| Tuy chinh | Toan phan | Chi USER.md |
| Use case | Personal assistant | Shared assistant |

---

## Chon agent trong Chat

- Sidebar chat co dropdown **AgentSelector** — chon agent truoc khi tao session moi.
- Agent mac dinh la `default` neu khong chon.
- URL session key chua thong tin agent: `agent:{agentId}:...` — chuyen session la chuyen agent.
- Tren cac kenh ngoai (Telegram, Discord, v.v.), agent duoc gan luc cau hinh kenh; nguoi dung khong can chon.

---

## Giao dien — Trang Agents

Route: `/agents`
Nhom Sidebar: Core
Quyen truy cap: Da dang nhap

Hien thi danh sach phan trang tat ca agents (dang the hoac danh sach), tim kiem va loc theo nguoi tao.

**Thao tac:**
- **Tao agent** — mo hop thoai tao moi
- **Xoa agent** — xac nhan voi o nhap ten
- **Trieu hoi lai** — khoi tao lai agent (chay lai qua trinh sinh file context)
- **Chuyen (Import/Export)** — dieu huong den trang import-export
- **Xem chi tiet** — nhan de dieu huong den `/agents/:id`

**Hop thoai Tao Agent:**

| Truong | Mo ta |
|--------|-------|
| Emoji | Bieu tuong dai dien |
| Ten | Ten hien thi |
| Agent Key | Slug duy nhat (tu dong sinh tu ten, vi du: `my-agent`) |
| Provider | Chon provider da them |
| Model | Chon model hoac nhap tay + Xac minh |
| Loai | `predefined` hoac `open` |
| Tinh cach | Mo ta vai tro agent — dung de sinh SOUL.md tu dong |
| Tu tien hoa | Cho phep agent tu cap nhat SOUL.md |

Nut **Kiem tra & Tao** kiem tra ket noi model truoc khi tao. Neu model da verify, nut chuyen sang **Tao**.

**Modal Trieu Hoi:** Hien thi tien trinh file theo thoi gian thuc khi agent duoc khoi tao lan dau.
- Thanh cong: **Tiep tuc**
- That bai: **Thu lai** hoac **Dong**

---

## Vi du — Tao agent ca nhan

```
/agents -> + New Agent
  Emoji: "A"
  Ten: "Assistant"
  Agent Key: assistant (tu dong)
  Provider: anthropic
  Model: claude-sonnet-4-5-20250929 -> Kiem tra OK
  Loai: open
  Tinh cach: "Tro ly ca nhan, than thien, ngan gon"
  -> Tao -> Modal Trieu Hoi -> Tiep tuc
  -> Agent "Assistant" xuat hien trong danh sach
```

---

## Luu y

- Agent Key la dinh danh khi thuc thi — khong the doi sau khi tao.
- Loai agent (open/predefined) anh huong den cau truc workspace — khong the doi sau khi tao.
- Moi agent co namespace session rieng biet tren kenh `web:direct`.
- Xoa agent se xoa toan bo session, memory, va context files lien quan.

---

## Xem them

- [02-cau-hinh-agent.md](./02-cau-hinh-agent.md) — Cau hinh model, behavior, sandbox
- [03-skills.md](./03-skills.md) — Skills va tools
- [../chat-and-sessions/01-chat-co-ban.md](../chat-and-sessions/01-chat-co-ban.md) — Chat voi agent
