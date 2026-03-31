# Bo Nho va Do Thi Tri Thuc

**Route Bo Nho:** `/memory`
**Route Do Thi Tri Thuc:** `/knowledge-graph`
**Nhom Sidebar:** Du Lieu
**Quyen truy cap:** Operator+

---

## Tong Quan

GoClaw cung cap hai co che luu tru tri thuc dai han cho agents:

- **Bo nho (Memory)** — luu tru tai lieu van ban co cau truc, ho tro tim kiem ngu nghia qua vector embeddings
- **Do thi tri thuc (Knowledge Graph)** — mo hinh hoa moi quan he giua cac thuc the, to chuc theo agent va phien lam viec

---

## Bo Nho (Memory)

### Giao Dien

**Route:** `/memory`

Trang hien thi bang tai lieu bo nho voi cac cot: duong dan, agent, pham vi (ca nhan/toan cau), hash, ngay cap nhat. Huy hieu trang thai nhung vector hien thi o tren cung.

### Quan Ly Tai Lieu

**Tao tai lieu moi**
1. Nhan nut "Tao tai lieu bo nho"
2. Dien vao hop thoai:
   - **Agent** — chon agent so huu tai lieu
   - **Che do pham vi** — Toan cuc / Hien co / Tuy chinh
   - **Duong dan** — dinh danh tai lieu (vi du: `user/preferences`)
   - **Noi dung** — noi dung van ban
   - **Tu dong lap chi muc** — bat de nhung vector ngay sau khi tao
3. Nhan **Tao**

**Xem va chinh sua**
- Nhan vao dong tai lieu de mo hop thoai xem
- Tab **Noi dung**: chinh sua noi dung, hien thi duong dan va metadata
- Tab **Chunks**: xem cac doan duoc lap chi muc voi pham vi dong va trang thai nhung

**Xoa tai lieu**
- Nhan nut xoa tren dong, xac nhan trong hop thoai

### Lap Chi Muc (Indexing)

- **Lap chi muc lai mot tai lieu** — nhung lai vector cho mot tai lieu cu the
- **Lap chi muc tat ca** — nhung lai hang loat toan bo tai lieu (dung khi doi provider embeddings)

### Tim Kiem Ngu Nghia

1. Nhan "Tim kiem bo nho"
2. Nhap cau truy van (bat buoc)
3. Tuy chon loc theo ID nguoi dung
4. Ket qua hien thi: duong dan, pham vi dong, thanh diem tuong dong, doan trich

### Bo Loc

- **Loc theo agent** — hien thi tai lieu cua agent cu the hoac xem toan cau
- **Loc theo pham vi nguoi dung** — loc theo nguoi dung so huu tai lieu

---

## Do Thi Tri Thuc (Knowledge Graph)

### Giao Dien

**Route:** `/knowledge-graph`

Trinh xem thuc the do thi tri thuc theo tung agent va phien. Gom bo chon agent, bo chon pham vi (tu cac phien hien co), huy hieu trang thai nhung.

### Su Dung

1. **Chon agent** — chon agent can xem do thi tri thuc
2. **Loc theo pham vi** — loc theo nguoi dung hoac nhom cu the
3. **Xem thuc the** — duyet danh sach cac thuc the KG da duoc agent nhan dien

### Khai Niem

- **Thuc the (Entity)** — doi tuong ma agent nhan biet (nguoi, to chuc, khai niem, v.v.)
- **Pham vi (Scope)** — nguoi dung hoac nhom so huu thuc the
- **Do thi (Graph)** — mang luoi moi quan he giua cac thuc the

> **Luu y:** Knowledge Graph chi co san trong Standard edition. Desktop (Lite) khong ho tro tinh nang nay.

---

## Vi Du Luong Lam Viec

**Luu thong tin nguoi dung vao bo nho:**

Agent tu dong luu khi detect thong tin quan trong. Quan tri vien cung co the tao thu cong:

```
Duong dan: users/nguyen-van-a/preferences
Noi dung:
- Ngon ngu uu tien: Tieng Viet
- Mui gio: Asia/Ho_Chi_Minh
- Style tra loi: ngan gon, co danh sach
```

**Tim kiem truoc khi tra loi:**

Agent dung semantic search de lay tai lieu lien quan truoc khi tao phan hoi, dam bao nhat quan voi thong tin da biet ve nguoi dung.

---

## Luu Y

- Vector embeddings yeu cau cau hinh embedding provider (vi du: OpenAI `text-embedding-3-small`)
- Neu chua cau hinh embeddings, bo nho van hoat dong nhung khong co kha nang tim kiem ngu nghia
- Tai lieu co pham vi "Toan cuc" duoc chia se giua tat ca nguoi dung cua agent do
- Tai lieu co pham vi "Ca nhan" chi thuoc ve nguoi dung cu the
- Knowledge Graph phu thuoc vao kha nang nhan dang thuc the cua LLM — chat luong phu thuoc vao provider

---

## Xem Them

- [Cau hinh providers](../admin/02-providers.md)
- [Cau hinh tham chieu — Section agents.defaults](../reference/03-cau-hinh.md)
