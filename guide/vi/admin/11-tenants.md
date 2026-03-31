# Quan Ly To Chuc (Multi-Tenant)

**Route danh sach:** `/admin/tenants`
**Route chi tiet:** `/admin/tenants/:id`
**Nhom Sidebar:** He Thong
**Quyen truy cap:** Owner (Cross-tenant)

> **Chi danh cho Standard Edition.** Desktop (Lite) khong ho tro multi-tenant.

---

## Tong Quan

Multi-tenant cho phep mot he thong GoClaw phuc vu nhieu to chuc (tenant) doc lap. Moi tenant co nguoi dung, agents, va du lieu rieng biet. Quan tri vien cap Owner co the tao va quan ly tat ca tenants tu giao dien nay.

---

## Danh Sach To Chuc

**Route:** `/admin/tenants`

### Giao Dien

Bang hien thi tat ca to chuc hien co: ten, slug, trang thai (hoat dong / tam dung), ngay tao.

### Tao To Chuc Moi

1. Nhan nut **"Tao to chuc"**
2. Dien vao hop thoai:
   - **Ten** (bat buoc) — ten hien thi cua to chuc
   - **Slug** (bat buoc) — tu dong tao tu ten (chu thuong + gach ngang); co the chinh sua
3. Nhan **Tao** — he thong tao tenant va chuyen den trang chi tiet

> Slug khong the thay doi sau khi tao. Chon can than.

### Lam Moi

Nhan **Lam moi** de tai lai danh sach tu server.

---

## Chi Tiet To Chuc

**Route:** `/admin/tenants/:id`

### Giao Dien

- **The thong tin** — hien thi slug, trang thai, ngay tao
- **Phan quan ly nguoi dung** — danh sach thanh vien va vai tro cua ho trong tenant nay

### Them Nguoi Dung

1. Nhan **"Them nguoi dung"**
2. Dien vao hop thoai:
   - **ID Nguoi dung** — tim kiem qua UserPickerCombobox hoac nhap thu cong
   - **Vai tro** — chon mot trong: `owner`, `admin`, `operator`, `member`, `viewer`
3. Nhan **Them Nguoi dung**

### Xoa Nguoi Dung

1. Nhan nut xoa tren dong nguoi dung can xoa
2. Xac nhan trong hop thoai — hien thi ID nguoi dung bi xoa
3. Nhan **Xoa Nguoi dung** (hanh dong nguy hiem — khong the hoan tac)

### Lam Moi Danh Sach

Nhan **Lam moi danh sach nguoi dung** de dong bo voi server.

---

## He Thong Vai Tro

| Vai tro | Quyen truy cap |
|---------|---------------|
| `owner` | Toan quyen — quan ly tenant, nguoi dung, cau hinh he thong |
| `admin` | Quan ly agents, channels, tools, cron, providers |
| `operator` | Chat, quan ly sessions, cron, gui tin nhan ra ngoai |
| `member` | Chat va xem lich su cua chinh minh |
| `viewer` | Chi doc — xem agents, sessions, lich su |

---

## Luong Lam Viec Dien Hinh

**Tao tenant cho phong ban moi:**

1. `/admin/tenants` → Tao to chuc → Nhap ten "Marketing Team", slug tu dong `marketing-team`
2. Chuyen den chi tiet tenant vua tao
3. Them truong phong: vai tro `admin`
4. Them nhan vien: vai tro `member`

**Them nguoi dung vao tenant hien co:**

1. `/admin/tenants` → Nhan vao dong tenant
2. Nhan **Them nguoi dung**
3. Tim kiem ID nguoi dung qua combobox
4. Chon vai tro phu hop → Nhan **Them**

---

## Luu Y

- Moi tenant duoc co lap hoan toan — nguoi dung cua tenant A khong the truy cap du lieu cua tenant B
- Header `X-GoClaw-Tenant-Id` trong API requests xac dinh tenant scope (UUID hoac slug deu duoc)
- Owner co quyen **cross-tenant** — co the thao tac tren tat ca tenants tu mot tai khoan
- Xoa nguoi dung khoi tenant khong xoa tai khoan nguoi dung — chi xoa quyen truy cap vao tenant do
- Tenant "default" la tenant goc, luon ton tai va khong the xoa

---

## Xem Them

- [Bao mat va phan quyen](../admin/05-security.md)
- [API Reference — Headers multi-tenant](../reference/01-api-reference.md)
- [Cau hinh tham chieu](../reference/03-cau-hinh.md)
