# Sao Lưu và Khôi Phục

## Tổng Quan

GoClaw hỗ trợ export/import agents, skills, MCP configs và teams qua giao diện Web UI. Đối với production, nên kết hợp với database backup bằng `pg_dump`.

**Route:** `/import-export`
**Quyền truy cập:** Admin

> Tính năng Nhập/Xuất hiện ở trạng thái **beta**. Nên kiểm tra lại cấu hình sau khi khôi phục.

---

## Hướng Dẫn

### Truy Cập Nhập/Xuất

Vào **System > Nhập / Xuất**. Giao diện có 3 tab chính:
- **Nhóm** — export/import đội nhóm
- **Agents** — export/import agents
- **Kỹ năng & MCP** — export/import skills và MCP configs

Mỗi tab có 2 inner tab: **Xuất** và **Nhập**.

### Export Agents

1. Vào tab **Agents > Xuất**
2. Chọn agent(s) cần sao lưu
3. Nhấn **Xem trước** để kiểm tra nội dung
4. Nhấn **Xuất** → cây tiến trình → nút **Tải xuống** (file JSON)

Nội dung bao gồm: tên, mô tả, model, system prompt, tool profile, context files, per-user seed files, tool policies, exec settings, các tùy chỉnh khác.

> Quan trọng: API keys của LLM provider **không được export** vì lý do bảo mật.

### Import Agents

1. Vào tab **Agents > Nhập**
2. Kéo thả file `.tar.gz` hoặc chọn file JSON
3. **Xem trước nhập** — phát hiện xung đột trước khi nhập
4. Chọn **Tạo agent mới** (tạo agents mới) hoặc **Gộp vào agent có sẵn** (gộp vào agent hiện có)
5. Xem tóm tắt hoàn thành (cùng cảnh báo "đừng đóng")

### Export / Import Skills

**Export:**
1. Tab **Kỹ năng & MCP > Xuất**
2. Chọn skills cần sao lưu
3. Nhấn **Xuất kỹ năng** → tải xuống file JSON

**Import:**
1. Tab **Kỹ năng & MCP > Nhập**
2. Chọn file JSON → xác nhận → **Nhập kỹ năng**

### Export / Import MCP Configs

**Export:**
1. Tab **Kỹ năng & MCP > Xuất**
2. Chọn MCP server configs
3. Nhấn **Xuất MCP Servers**

> API keys của MCP servers **không được export**. Sau khi import, nhập lại credentials tại Settings > MCP.

**Import:**
1. Tab **Kỹ năng & MCP > Nhập**
2. Chọn file JSON → **Nhập MCP Servers** — tạo lại MCP server configs (không có credentials)

### Export / Import Teams

**Export:**
1. Tab **Nhóm > Xuất**
2. Chọn team cần sao lưu
3. Nhấn **Xuất** — file JSON gồm cấu hình team, danh sách agents, workspace settings

**Import:**
1. Tab **Nhóm > Nhập**
2. Chọn file JSON → **Nhập**

> Nếu agents tham chiếu trong team chưa tồn tại, import agents trước rồi mới import team.

### Database Backup (PostgreSQL)

Nên thực hiện định kỳ cho môi trường production:

**Backup:**
```bash
pg_dump -h localhost -U goclaw -d goclaw_db -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
```

| Tham Số | Mô Tả |
|---------|-------|
| `-F c` | Format custom (nén, restore linh hoạt) |
| `-f` | Tên file output |
| `-h` | Host database |
| `-U` | Username |
| `-d` | Tên database |

**Restore:**
```bash
pg_restore -h localhost -U goclaw -d goclaw_db_new backup_20260330_080000.dump
```

**Lịch backup tự động (khuyến nghị):**
```bash
# Thêm vào crontab — backup mỗi ngày lúc 2:00 sáng
0 2 * * * pg_dump -U goclaw -d goclaw_db -F c -f /backups/goclaw_$(date +\%Y\%m\%d).dump
```

Lưu backup ra ngoài server chính (S3, NFS, v.v.).

---

## Giao Diện (UI)

### Trang Nhập/Xuất (`/import-export`)

**Hiển thị:** Trang 3 tab: Nhóm, Agents, Kỹ năng & MCP. Mỗi tab có sub-tab Xuất/Nhập. Bảng cảnh báo tính năng Beta.

**Luồng Xuất:** Chọn đối tượng (combobox) → Xem trước → **Xuất** → cây tiến trình → nút **Tải xuống**

**Luồng Nhập:** Kéo thả file `.tar.gz` → Xem trước (phát hiện xung đột) → **Tạo agent mới** hoặc **Gộp vào agent có sẵn** → tóm tắt hoàn thành (kèm cảnh báo "đừng đóng")

**Tab Nhóm:** Xuất nhóm (JSON với thành viên và task) | Nhập nhóm

**Tab Agents:** Xem trước xuất | Xuất | Xem trước nhập | Tạo mới | Gộp nhập

**Tab Kỹ năng & MCP:** Xuất/Nhập skills (JSON) | Xuất/Nhập MCP servers (JSON)

---

## Sau Khi Import/Restore

**Bắt buộc thực hiện:**
1. **Settings > Providers** — nhập lại API key của từng LLM provider
2. **Settings > MCP** — nhập lại credentials cho các MCP servers có auth
3. **Settings > Custom Tools** — nhập lại env vars nếu cần

**Kiểm tra xác nhận:**
- Chạy thử một agent chat — xác nhận LLM provider hoạt động
- Kiểm tra các cron jobs có lịch trình đúng không
- Xác nhận MCP servers đã kết nối lại thành công
- Kiểm tra cấu hình kênh kết nối (Telegram, Discord, v.v.)

---

## Lưu Ý

GoClaw **không bao giờ export** các secrets sau vì lý do bảo mật:
- API keys của LLM providers (`llm_providers.api_key`)
- API keys của MCP servers (`mcp_servers.api_key`)
- Env vars của custom tools (`custom_tools.env`)

Tất cả được mã hóa AES-256-GCM và không đưa vào file export.

---

## Xem Thêm

- [guide/vi/admin/01-providers.md](01-providers.md) — Nhập lại LLM provider credentials
- [guide/vi/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — Nhập lại MCP credentials
- [guide/vi/admin/05-bao-mat.md](05-bao-mat.md) — Mã hóa AES-256-GCM
