# Sao Luu va Khoi Phuc

## Tong Quan

GoClaw ho tro export/import agents, skills, MCP configs va teams qua giao dien Web UI. Doi voi production, nen ket hop voi database backup bang `pg_dump`.

**Route:** `/import-export`
**Quyen truy cap:** Admin

> Tinh nang Import/Export hien o trang thai **beta**. Nen kiem tra lai cau hinh sau khi khoi phuc.

---

## Huong Dan

### Truy Cap Import/Export

Vao **System > Import / Export**. Giao dien co 3 tab chinh:
- **Teams** — export/import doi nhom
- **Agents** — export/import agents
- **Skills & MCP** — export/import skills va MCP configs

Moi tab co 2 inner tab: **Xuat** va **Nhap**.

### Export Agents

1. Vao tab **Agents > Xuat**
2. Chon agent(s) can sao luu
3. Nhan **Xem truoc** de kiem tra noi dung
4. Nhan **Bat dau Xuat** → cay tien trinh → nut **Tai xuong** (file JSON)

Noi dung bao gom: ten, mo ta, model, system prompt, tool profile, context files, per-user seed files, tool policies, exec settings, cac tuy chinh khac.

> Quan trong: API keys cua LLM provider **khong duoc export** vi ly do bao mat.

### Import Agents

1. Vao tab **Agents > Nhap**
2. Keo tha file `.tar.gz` hoac chon file JSON
3. **Xem truoc nhap** — phat hien xung dot truoc khi nhap
4. Chon **Nhap Moi** (tao agents moi) hoac **Hop Nhat Nhap** (hop nhat vao agent hien co)
5. Xem tom tat hoan thanh (cung canh bao "dung dong")

### Export / Import Skills

**Export:**
1. Tab **Skills & MCP > Xuat**
2. Chon skills can sao luu
3. Nhan **Xuat** → tai xuong file JSON

**Import:**
1. Tab **Skills & MCP > Nhap**
2. Chon file JSON → xac nhan → **Nhap**

### Export / Import MCP Configs

**Export:**
1. Tab **Skills & MCP > Xuat**
2. Chon MCP server configs
3. Nhan **Xuat**

> API keys cua MCP servers **khong duoc export**. Sau khi import, nhap lai credentials tai Settings > MCP.

**Import:**
1. Tab **Skills & MCP > Nhap**
2. Chon file JSON → **Nhap** — tao lai MCP server configs (khong co credentials)

### Export / Import Teams

**Export:**
1. Tab **Teams > Xuat**
2. Chon team can sao luu
3. Nhan **Xuat** — file JSON gom cau hinh team, danh sach agents, workspace settings

**Import:**
1. Tab **Teams > Nhap**
2. Chon file JSON → **Nhap**

> Neu agents tham chieu trong team chua ton tai, import agents truoc roi moi import team.

### Database Backup (PostgreSQL)

Nen thuc hien dinh ky cho moi truong production:

**Backup:**
```bash
pg_dump -h localhost -U goclaw -d goclaw_db -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
```

| Tham So | Mo Ta |
|---------|-------|
| `-F c` | Format custom (nen, restore linh hoat) |
| `-f` | Ten file output |
| `-h` | Host database |
| `-U` | Username |
| `-d` | Ten database |

**Restore:**
```bash
pg_restore -h localhost -U goclaw -d goclaw_db_new backup_20260330_080000.dump
```

**Lich backup tu dong (khuyen nghi):**
```bash
# Them vao crontab — backup moi ngay luc 2:00 sang
0 2 * * * pg_dump -U goclaw -d goclaw_db -F c -f /backups/goclaw_$(date +\%Y\%m\%d).dump
```

Luu backup ra ngoai server chinh (S3, NFS, v.v.).

---

## Giao Dien (UI)

### Trang Import/Export (`/import-export`)

**Hien thi:** Trang 3 tab: Nhom, Agents, Skills & MCP. Moi tab co sub-tab Xuat/Nhap. Bang canh bao tinh nang Beta.

**Luong Xuat:** Chon doi tuong (combobox) → Xem truoc → **Bat dau Xuat** → cay tien trinh → nut **Tai xuong**

**Luong Nhap:** Keo tha file `.tar.gz` → Xem truoc (phat hien xung dot) → **Nhap Moi** hoac **Hop Nhat** → tom tat hoan thanh (kem canh bao "dung dong")

**Tab Nhom:** Xuat nhom (JSON voi thanh vien va task) | Nhap nhom

**Tab Agents:** Xem truoc xuat | Xuat | Xem truoc nhap | Nhap moi | Hop nhat nhap

**Tab Skills & MCP:** Xuat/Nhap skills (JSON) | Xuat/Nhap MCP servers (JSON)

---

## Sau Khi Import/Restore

**Bat buoc thuc hien:**
1. **Settings > Providers** — nhap lai API key cua tung LLM provider
2. **Settings > MCP** — nhap lai credentials cho cac MCP servers co auth
3. **Settings > Custom Tools** — nhap lai env vars neu can

**Kiem tra xac nhan:**
- Chay thu mot agent chat — xac nhan LLM provider hoat dong
- Kiem tra cac cron jobs co lich trinh dung khong
- Xac nhan MCP servers da ket noi lai thanh cong
- Kiem tra cau hinh kenh ket noi (Telegram, Discord, v.v.)

---

## Luu Y

GoClaw **khong bao gio export** cac secrets sau vi ly do bao mat:
- API keys cua LLM providers (`llm_providers.api_key`)
- API keys cua MCP servers (`mcp_servers.api_key`)
- Env vars cua custom tools (`custom_tools.env`)

Tat ca duoc ma hoa AES-256-GCM va khong dua vao file export.

---

## Xem Them

- [guide/vi/admin/01-providers.md](01-providers.md) — Nhap lai LLM provider credentials
- [guide/vi/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — Nhap lai MCP credentials
- [guide/vi/admin/05-bao-mat.md](05-bao-mat.md) — Ma hoa AES-256-GCM
