# 27 - Sao Luu va Khoi Phuc

Huong dan export/import agents, skills, MCP configs, teams va sao luu database trong GoClaw.

> Tinh nang Import/Export hien o trang thai **beta**. Nen kiem tra lai cau hinh sau khi khoi phuc.

---

## 1. Truy Cap Import/Export

Vao **System > Import / Export** trong menu chinh (can quyen Admin).

Giao dien co 3 tab chinh:
- **Teams** — export/import doi nhom
- **Agents** — export/import agents
- **Skills & MCP** — export/import skills, MCP configs

Moi tab co 2 inner tab: **Export** va **Import**.

---

## 2. Export Agents

Tao ban sao JSON cua mot hoac nhieu agents.

1. Vao tab **Agents > Export**
2. Chon agent(s) muon sao luu
3. Nhan **Export** — tai xuong file JSON

**Noi dung file JSON bao gom**:
- Cau hinh agent: ten, mo ta, model, system prompt, tool profile
- Context files va per-user seed files
- Tool policies, exec settings
- Cac tuy chinh khac (memory, sandbox, v.v.)

**Luu y quan trong**: API keys cua LLM provider **khong duoc export** vi ly do bao mat. Sau khi import, can cau hinh lai provider credentials.

---

## 3. Import Agents

Khoi phuc agent tu file JSON da export.

1. Vao tab **Agents > Import**
2. Chon hoac keo tha file JSON
3. Xem lai danh sach agents trong file
4. Nhan **Import**

He thong tao agents moi voi cau hinh da luu. Neu agent cung ten da ton tai, kiem tra xung dot truoc khi ghi de.

---

## 4. Export / Import Skills

Skills la tap lenh huong dan (SKILL.md) mo rong kha nang agent.

### Export Skills

1. Vao tab **Skills & MCP > Export**
2. Chon skills muon sao luu
3. Nhan **Export** — tai xuong file JSON chua noi dung skills

### Import Skills

1. Vao tab **Skills & MCP > Import**
2. Chon file JSON
3. Xac nhan va nhan **Import**

---

## 5. Export / Import MCP Configs

MCP server configs dinh nghia cach ket noi den external tool servers.

### Export MCP Configs

1. Vao tab **Skills & MCP > Export**
2. Chon MCP server configs muon sao luu
3. Nhan **Export**

**Luu y**: API keys cua MCP servers **khong duoc export**. Sau khi import, can nhap lai credentials cho tung MCP server tai **Settings > MCP**.

### Import MCP Configs

1. Vao tab **Skills & MCP > Import**
2. Chon file JSON
3. Nhan **Import** — he thong tao lai cac MCP server configs (khong co credentials)

---

## 6. Export / Import Teams

Teams chua cau hinh doi nhom va danh sach agents thanh vien.

### Export Teams

1. Vao tab **Teams > Export**
2. Chon team muon sao luu
3. Nhan **Export**

File JSON bao gom: cau hinh team, danh sach agent members, workspace settings.

### Import Teams

1. Vao tab **Teams > Import**
2. Chon file JSON
3. Nhan **Import**

Neu agents tham chieu trong team chua ton tai, can import agents truoc roi moi import team.

---

## 7. Database Backup — PostgreSQL

Doi voi moi truong production, nen sao luu toan bo database dinh ky.

### Backup Bang pg_dump

```bash
pg_dump -h localhost -U goclaw -d goclaw_db -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
```

| Tham So | Mo Ta |
|---------|-------|
| `-F c` | Format custom (nen, restore linh hoat hon) |
| `-f` | Ten file output |
| `-h` | Host database |
| `-U` | Username |
| `-d` | Ten database |

### Restore Tu Backup

```bash
pg_restore -h localhost -U goclaw -d goclaw_db_new backup_20260330_080000.dump
```

### Lich Backup Tu Dong (khuyen nghi)

```bash
# Them vao crontab — backup moi ngay luc 2:00 sang
0 2 * * * pg_dump -U goclaw -d goclaw_db -F c -f /backups/goclaw_$(date +\%Y\%m\%d).dump
```

Luu backup ra ngoai server chinh (S3, NFS, v.v.) de bao dam an toan.

---

## 8. Luu Y Quan Trong

### API Keys Khong Duoc Export

GoClaw chu y bao mat bang cach **khong bao gio export**:
- API keys cua LLM providers (`llm_providers.api_key`)
- API keys cua MCP servers (`mcp_servers.api_key`)
- Env vars cua custom tools (`custom_tools.env`)

Tat ca deu duoc ma hoa AES-256-GCM va khong dua vao file export.

**Sau khi import/restore, bat buoc phai**:
1. Vao **Settings > Providers** — nhap lai API key cua tung LLM provider
2. Vao **Settings > MCP** — nhap lai credentials cho cac MCP servers co auth
3. Vao **Settings > Custom Tools** — nhap lai env vars neu can

### Kiem Tra Sau Restore

- Chay thu mot agent chat de xac nhan LLM provider hoat dong
- Kiem tra cac cron jobs co lich trinh dung khong
- Xac nhan MCP servers da ket noi lai thanh cong
- Kiem tra cau hinh kenh ket noi (Telegram, Discord, v.v.)

---

## Xem Them

- [09-security.md](../09-security.md) — Ma hoa secrets, AES-256-GCM
- [21-cau-hinh-providers.md](./21-cau-hinh-providers.md) — Cau hinh LLM providers
- [23-tools-va-mcp.md](./23-tools-va-mcp.md) — Cau hinh MCP servers
