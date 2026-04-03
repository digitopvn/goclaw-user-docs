# Agent Codex Pool

**Route:** `/agents/:id/codex-pool`
**Nhóm Sidebar:** Core (trang con của Agent)
**Quyền truy cập:** Admin

## Hiển Thị
Quản lý pool định tuyến ChatGPT OAuth cho agent cụ thể: bảng hoạt động pool (thống kê theo provider: số yêu cầu, tỷ lệ thành công, điểm sức khỏe, số lần chuyển đổi dự phòng, timeline) và cấu hình định tuyến.

## Thao Tác
- **Cấu hình chiến lược định tuyến** — round-robin, primary-first, v.v.
- **Thêm provider vào pool** — thêm ChatGPT OAuth providers
- **Xóa provider khỏi pool**
- **Lưu cấu hình định tuyến**
- **Làm mới dữ liệu hoạt động/hạn mức**
- **Xem liên kết provider** (chỉ admin)
