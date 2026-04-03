# Cấu Hình Hệ Thống

**Route:** `/config`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Chủ sở hữu (Cross-tenant)

## Hiển Thị
Trình chỉnh sửa cấu hình với 6 tab dọc. Hiển thị huy hiệu hash cấu hình và băng cảnh báo về thay đổi nhạy cảm.

## Thao Tác
Mỗi tab có nút **Lưu** riêng:
- **Tab Máy chủ** — cài đặt gateway
- **Tab Hành vi** — giới hạn tần suất, bảo mật, cài đặt phiên
- **Tab Mặc định AI** — cấu hình agent mặc định
- **Tab Hạn mức** — giới hạn sử dụng
- **Tab Công cụ** — cấu hình profile, exec, web, bảo mật shell
- **Tab Tích hợp** — TTS (liên kết), Cron, Telemetry, Bindings
- **Làm mới cấu hình** — tải lại từ server

## Tính Năng Phụ
- Huy hiệu hash cấu hình (kiểm soát đồng thời lạc quan)
- Băng cảnh báo thay đổi nhạy cảm
- Cú pháp JSON5 (chú thích, dấu phẩy cuối)
