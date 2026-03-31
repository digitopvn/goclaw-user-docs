# Tin Nhan Cho Xu Ly

**Route:** `/pending-messages`
**Nhom Sidebar:** Hoi Thoai
**Quyen truy cap:** Operator+

---

## Tong Quan

Khi nhieu tin nhan den cung luc tu mot nhom hoac kenh (vi du Telegram group, Discord server), GoClaw gom cac tin nhan do vao **nhom cho xu ly** thay vi xu ly tung cai mot. He thong nay giup:

- Tranh goi agent qua nhieu lan cho cung mot chu de
- Giam chi phi LLM bang cach tom tat truoc khi xu ly
- Quan ly hang doi tin nhan chua duoc giao khi agent ban

---

## Giao Dien (UI)

**Route:** `/pending-messages`

Trang hien thi bang cac nhom tin nhan dang cho xu ly voi cac cot:

| Cot | Mo ta |
|-----|-------|
| Kenh | Nguon tin nhan (Telegram, Discord, ...) |
| Tieu de nhom | Nhan dinh danh nhom hoi thoai |
| So tin nhan | So luong tin nhan chua xu ly trong nhom |
| Trang thai | `tho` (raw) hoac `da nen` (compacted) |
| Hoat dong gan day | Thoi gian tin nhan cuoi cung |

**The thong tin "Cach hoat dong"** — co the mo rong de xem giai thich co che.

---

## Huong Dan

### Xem Tin Nhan Trong Nhom

1. Nhan nut **"Xem tin nhan"** tren dong nhom
2. Hop thoai hien thi tung tin nhan trong nhom: nguoi gui, noi dung, thoi gian
3. Nhan **Dong** de tat

### Nen Nhom Tin Nhan (Compaction)

Nen dung LLM tom tat cac tin nhan tho thanh mot ban tom tat ngan gon, giup giam context khi agent xu ly:

1. Nhan nut **"Nen"** tren dong nhom co trang thai `tho`
2. He thong goi LLM de tao ban tom tat
3. Nut hien thi trang thai dang xu ly — polling tu dong den khi hoan thanh
4. Trang thai chuyen sang `da nen` sau khi xong

> Cau hinh nguong nen tu dong trong `config.json` tren trang [Cau hinh He Thong](../admin/10-config.md).

### Xoa Nhom Tin Nhan

1. Nhan nut **"Xoa"** tren dong nhom
2. Xac nhan trong hop thoai
3. Toan bo tin nhan trong nhom bi xoa vinh vien

### Lam Moi

Nhan **Lam moi** de cap nhat danh sach tu server.

---

## Co Che Hoat Dong

```
Tin nhan den (group/channel)
        |
        v
  inbound_debounce_ms (mac dinh 1000ms)
        |
        v
  Nhom cho xu ly (pending group)
        |
   [neu >= threshold]
        v
  LLM Compaction (tom tat)
        |
        v
  Agent xu ly ban tom tat
```

**Cau hinh lien quan trong `config.json`:**

| Truong | Mac dinh | Mo ta |
|--------|----------|-------|
| `gateway.inbound_debounce_ms` | `1000` | Thoi gian gom tin nhan (ms, -1 = tat) |
| `channels.pending_compaction.threshold` | `200` | So entries kich hoat compaction tu dong |
| `channels.pending_compaction.keep_recent` | `40` | So tin nhan giu lai sau compaction |
| `channels.pending_compaction.max_tokens` | `4096` | Max tokens cho LLM tom tat |
| `channels.pending_compaction.provider` | `""` | Provider LLM (trong = dung provider agent) |

---

## Xu Ly Su Co

**Nhom tin nhan ton tai qua lau, agent khong xu ly:**

Nguyen nhan co the:
- Agent dang ban xu ly task khac
- Loi ket noi channel
- Cau hinh `inbound_debounce_ms` qua cao

Giai phap:
1. Kiem tra trang thai agent tren `/agents`
2. Xem logs tai `/logs`
3. Neu can, nen hoac xoa nhom de giai phong hang doi

**Compaction that bai:**

- Kiem tra provider LLM duoc cau hinh trong `pending_compaction.provider`
- Xem chi tiet loi trong `/logs` (loc theo event `compaction`)
- Neu provider khong kha dung, compaction se thu lai tu dong

**Tin nhan bi mat sau khi xoa nhom:**

Xoa nhom la vinh vien — khong the khoi phuc. Chi xoa khi chac chan tin nhan khong con can thiet.

---

## Luu Y

- Trang nay chi hien thi tin nhan den tu **channels nhom** (group chats) — tin nhan DM khong co trong hang doi nay
- Compaction thu cong ghi de compaction tu dong da lap lich
- Agent van co the xu ly nhom o trang thai `tho` — compaction chi la toi uu hoa, khong bat buoc
- Khi `inbound_debounce_ms: -1`, tin nhan duoc xu ly ngay lap tuc va khong qua hang doi nay

---

## Xem Them

- [Cau hinh He Thong — pending_compaction](../admin/10-config.md)
- [Cau hinh kenh ket noi](../admin/03-channels.md)
- [Theo doi va logs](../admin/06-logs.md)
