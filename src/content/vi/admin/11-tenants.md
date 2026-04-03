# Quản Lý Tổ Chức (Multi-Tenant)

**Route danh sách:** `/admin/tenants`
**Route chi tiết:** `/admin/tenants/:id`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Owner (Cross-tenant)

> **Chỉ dành cho Standard Edition.** Desktop (Lite) không hỗ trợ multi-tenant.

---

## Tổng Quan

Multi-tenant cho phép một hệ thống GoClaw phục vụ nhiều tổ chức (tenant) độc lập. Mỗi tenant có người dùng, agents, và dữ liệu riêng biệt. Quản trị viên cấp Owner có thể tạo và quản lý tất cả tenants từ giao diện này.

---

## Danh Sách Tổ Chức

**Route:** `/admin/tenants`

### Giao Diện

Bảng hiển thị tất cả tổ chức hiện có: tên, slug, trạng thái (hoạt động / tạm ngưng), ngày tạo.

### Tạo Tổ Chức Mới

1. Nhấn nút **"Tạo tổ chức"**
2. Điền vào hộp thoại:
   - **Tên** (bắt buộc) — tên hiển thị của tổ chức
   - **Slug** (bắt buộc) — tự động tạo từ tên (chữ thường + gạch ngang); có thể chỉnh sửa
3. Nhấn **Tạo** — hệ thống tạo tenant và chuyển đến trang chi tiết

> Slug không thể thay đổi sau khi tạo. Chọn cẩn thận.

### Làm Mới

Nhấn **Làm mới** để tải lại danh sách từ server.

---

## Chi Tiết Tổ Chức

**Route:** `/admin/tenants/:id`

### Giao Diện

- **Thẻ thông tin** — hiển thị slug, trạng thái, ngày tạo
- **Phần quản lý người dùng** — danh sách thành viên và vai trò của họ trong tenant này

### Thêm Người Dùng

1. Nhấn **"Thêm người dùng"**
2. Điền vào hộp thoại:
   - **ID Người dùng** — tìm kiếm qua UserPickerCombobox hoặc nhập thủ công
   - **Vai trò** — chọn một trong: `owner`, `admin`, `operator`, `member`, `viewer`
3. Nhấn **Thêm người dùng**

### Xóa Người Dùng

1. Nhấn nút xóa trên dòng người dùng cần xóa
2. Xác nhận trong hộp thoại — hiển thị ID người dùng bị xóa
3. Nhấn **Xóa người dùng** (hành động nguy hiểm — không thể hoàn tác)

### Làm Mới Danh Sách

Nhấn **Làm mới** để đồng bộ với server.

---

## Hệ Thống Vai Trò

| Vai trò | Quyền truy cập |
|---------|---------------|
| `owner` | Toàn quyền — quản lý tenant, người dùng, cấu hình hệ thống |
| `admin` | Quản lý agents, channels, tools, cron, providers |
| `operator` | Chat, quản lý sessions, cron, gửi tin nhắn ra ngoài |
| `member` | Chat và xem lịch sử của chính mình |
| `viewer` | Chỉ đọc — xem agents, sessions, lịch sử |

---

## Luồng Làm Việc Điển Hình

**Tạo tenant cho phòng ban mới:**

1. `/admin/tenants` → Tạo tổ chức → Nhập tên "Marketing Team", slug tự động `marketing-team`
2. Chuyển đến chi tiết tenant vừa tạo
3. Thêm trưởng phòng: vai trò `admin`
4. Thêm nhân viên: vai trò `member`

**Thêm người dùng vào tenant hiện có:**

1. `/admin/tenants` → Nhấn vào dòng tenant
2. Nhấn **Thêm người dùng**
3. Tìm kiếm ID người dùng qua combobox
4. Chọn vai trò phù hợp → Nhấn **Thêm**

---

## Lưu Ý

- Mỗi tenant được cô lập hoàn toàn — người dùng của tenant A không thể truy cập dữ liệu của tenant B
- Header `X-GoClaw-Tenant-Id` trong API requests xác định tenant scope (UUID hoặc slug đều được)
- Owner có quyền **cross-tenant** — có thể thao tác trên tất cả tenants từ một tài khoản
- Xóa người dùng khỏi tenant không xóa tài khoản người dùng — chỉ xóa quyền truy cập vào tenant đó
- Tenant "default" là tenant gốc, luôn tồn tại và không thể xóa

---

## Xem Thêm

- [Bảo mật và phân quyền](../admin/05-security.md)
- [API Reference — Headers multi-tenant](../reference/01-api-reference.md)
- [Cấu hình tham chiếu](../reference/03-configuration.md)
