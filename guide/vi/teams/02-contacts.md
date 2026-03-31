# Danh Ba Lien He (Contacts)

## Tong Quan

Trang Contacts hien thi tat ca lien he tu cac kenh ket noi (Telegram, Discord, Slack, v.v.). Dung de quan ly, tim kiem va hop nhat lien he trung lap.

**Route:** `/contacts`
**Quyen truy cap:** Operator+

---

## Huong Dan Su Dung

### Tim Kiem va Loc Lien He

- **Tim kiem theo ten / username / sender ID** — nhap tu khoa, bam nut Submit
- **Loc theo loai kenh** — dropdown chon kenh (Telegram, Discord, Slack, v.v.)
- **Loc theo loai ngang hang** — Direct (DM) hoac Group (nhom)

### Hop Nhat Lien He Trung Lap

Khi cung mot nguoi dung xuat hien tren nhieu kenh, co the hop nhat thanh mot profile:

1. Chon cac lien he can hop nhat (checkbox)
2. Nhan **Hop nhat lien he da chon**
3. Chon che do hop nhat:
   - **Lien ket Nguoi dung Hien co** — chon user tu combobox
   - **Tao Nguoi dung Moi** — nhap ten + ID moi
4. Nhan **Hop nhat**

### Tach Hop Nhat

Khi tat ca lien he da chon deu da duoc hop nhat, nut **Tach hop nhat** xuat hien — dung de hoan tac viec hop nhat.

---

## Giao Dien (UI)

### Trang Danh Sach (`/contacts`)

**Hien thi:** Bang phan trang cac lien he tu tat ca kenh voi cac cot:
- Ten hien thi
- Ten nguoi dung (username)
- Sender ID
- Loai kenh
- Loai ngang hang (truc tiep / nhom)
- Lan hoat dong cuoi

**Thao tac:**
- O chon (checkbox) cho chon hang loat
- **Tim kiem** — tim kiem bang nut Submit
- **Loc theo loai kenh** — dropdown
- **Loc theo loai ngang hang** — truc tiep / nhom
- **Hop nhat lien he da chon** — ket hop lien he trung lap
- **Tach hop nhat** — hien thi khi tat ca da chon deu da hop nhat

**Hop thoai Hop Nhat Danh Ba:**
- Che do (radio): Lien ket Nguoi dung Hien co (combobox) hoac Tao Nguoi dung Moi (ten + ID)
- Thao tac: **Hop nhat** | **Huy**

---

## Vi Du

### Hop Nhat Lien He Da Kenh

Nguoi dung "Nguyen Van A" nhan tin qua Telegram (ID: 123456) va Discord (ID: abc#1234):

1. Tim kiem "Nguyen Van A" trong danh sach
2. Tick chon ca hai dong
3. Nhan **Hop nhat lien he da chon**
4. Chon **Tao Nguoi dung Moi**, nhap ten "Nguyen Van A"
5. Nhan **Hop nhat**

Ket qua: lich su chat tu ca hai kenh duoc gan vao cung mot profile.

---

## Luu Y

- Can quyen Operator tro len moi truy cap trang Contacts
- Hop nhat lien he khong xoa lich su chat — chi lien ket cac sender ID voi nhau
- Tach hop nhat chi kha dung khi tat ca lien he da chon deu da duoc hop nhat truoc do

---

## Xem Them

- [guide/vi/teams/01-doi-nhom.md](01-doi-nhom.md) — Quan ly doi nhom
- [guide/vi/admin/02-channels-setup.md](../admin/02-channels-setup.md) — Cau hinh kenh ket noi
