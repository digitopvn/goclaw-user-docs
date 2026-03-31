# Doi Nhom (Agent Teams)

## Tong Quan

Agent team la nhom cac AI agent hop tac qua mot **task board chung**. Lead agent dieu phoi cong viec, member agents thuc thi doc lap va song song.

**Route danh sach:** `/teams` — Operator+
**Route chi tiet:** `/teams/:id` — Operator+

---

## Huong Dan Su Dung

### Khi Nao Can Dung Team

| Tinh Huong | Vi Du |
|-----------|-------|
| Research + viet bao cao | Member A tim tai lieu, Member B soan van ban |
| Viet code + review | Member A code, Member B kiem tra loi |
| Tao noi dung da dang | Member A viet caption, Member B tao hinh anh |
| Phan tich nhieu nguon | Moi member xu ly mot tap du lieu rieng |
| Luong duyet (human-in-the-loop) | Task can nguoi duyet truoc khi xong |

### Tao Team

1. Vao **Web UI > Teams > New Team**
2. Dien **Ten** va **Mo ta**
3. Chon **Lead Agent** (chi mot lead)
4. Them **Member Agents** (chi chon agent dinh san)
5. Nhan **Tao** — yeu cau: ten + lead + it nhat 1 thanh vien

Gioi han: Lite edition toi da 1 team / 5 member. Standard edition khong gioi han.

### Tao Task

Trong trang chi tiet team, nhan **Tao Task**:

| Truong | Mo Ta |
|--------|-------|
| Chu de | Tieu de ngan gon (bat buoc) |
| Mo ta | Noi dung chi tiet |
| Loai | Chung / Uy quyen / Leo thang |
| Uu tien | So nguyen, cao hon = uu tien hon |
| Giao cho | Member duoc phan cong |

### Dependency Giua Task

Dat `blocked_by` khi mot task can task khac xong truoc:
- Task o trang thai `blocked` cho den khi tat ca task phu thuoc hoan thanh
- Khi task phu thuoc xong, task `blocked` tu dong chuyen sang `pending`
- Task `cancelled` cung giai phong phu thuoc

### Comments va Blocker

Ca nguoi dung lan agent deu co the them binh luan vao task:
- **Binh luan thuong** — phan hoi, giai thich
- **Blocker comment** — task tu dong chuyen sang `failed`, lead nhan thong bao escalation

---

## Giao Dien (UI)

### Trang Danh Sach (`/teams`)

Hien thi: danh sach phan trang (the hoac danh sach), tim kiem.

Thao tac:
- **Tao nhom** — mo hop thoai
- **Xoa nhom** — xac nhan
- **Xem chi tiet** — nhan vao the

### Trang Chi Tiet (`/teams/:id`)

Hien thi: thong tin nhom, danh sach thanh vien, task board.

**Hop thoai Thanh Vien**: danh sach cuon — emoji, ten, vai tro (truong/nguoi danh gia/thanh vien). Them (combobox agent dinh san) | Xoa (X) moi thanh vien (tru truong).

**Hop thoai Thong Tin Nhom**: ten, trang thai, mo ta, truong nhom, so thanh vien, tab cai dat. Nhan huy hieu "v2 Super Team" → Modal Tinh Nang.

**Hop thoai Tao Task**: Chu de (bat buoc), Mo ta, Loai, Uu tien, Giao cho. Nhan **Tao Task** | **Huy**.

**Hop thoai Chi Tiet Task**: ID task, trang thai, tien trinh (V2), banner theo doi (V2), metadata, task bi chan, mo ta, ket qua, binh luan, timeline. Thao tac: **Xoa** (task hoan thanh) | **Them binh luan** | **Dieu huong task lien quan**.

**Workspace Nhom** (90vh x 95vw): trinh duyet file — bo loc pham vi, cay thu muc, trinh xem noi dung. Thao tac: **Tai len** | **Tai xuong** | **Xoa** | **Di chuyen** (keo tha) | **Lam moi**.

---

## Vong Doi Task

```
pending → in_progress → completed
    |           |
  blocked    in_review → approved → completed
                      → rejected → cancelled
    |
  failed → (retry) → pending
```

| Status | Y Nghia |
|--------|---------|
| `pending` | Moi tao, cho xu ly |
| `in_progress` | Member dang lam |
| `in_review` | Member gui duyet |
| `completed` | Hoan thanh |
| `blocked` | Cho task phu thuoc |
| `failed` | Loi / blocker escalation |
| `cancelled` | Bi huy |
| `stale` | Khong hoat dong lau |

---

## Team Workspace

| Che Do | Thu Muc | Dung Khi |
|--------|---------|---------|
| Isolated (mac dinh) | `teams/{teamID}/{chatID}/` | Phan tach file theo cuoc tro chuyen |
| Shared | `teams/{teamID}/` | Tat ca member dung chung |

Gioi han: file toi da 10 MB, toi da 100 file/scope.

---

## Gioi Han Theo Phien Ban

| Tinh Nang | Lite | Standard |
|-----------|:----:|:--------:|
| So team toi da | 1 | Khong gioi han |
| So member/team | 5 | Khong gioi han |
| Comment / Review / Attach | Khong | Day du |
| Ask user reminder | Khong | Day du |

---

## Luu Y

- Lead chi giao viec qua task board, khong giao truc tiep qua ham goi
- Cac member co the chay song song — ket qua duoc gop lai va tra ve user trong mot luot
- File tao ra trong task duoc tu dong luu vao `attachments/` va gan voi task

---

## Xem Them

- [guide/vi/files-and-media/01-file-va-media.md](../files-and-media/01-file-va-media.md) — Team workspace va file
