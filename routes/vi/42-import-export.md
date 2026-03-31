# Import & Export

**Route:** `/import-export`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Admin

## Hiển Thị
Trang 3 tab chuyển dữ liệu hàng loạt: Nhóm, Agents, Skills & MCP. Mỗi tab có sub-tab Xuất/Nhập. Băng cảnh báo tính năng Beta.

## Thao Tác

**Tab Nhóm:**
- **Xuất nhóm** — tải xuống nhóm với thành viên và task dạng JSON
- **Nhập nhóm** — tải lên JSON để khôi phục nhóm

**Tab Agents:**
- **Xem trước xuất** — xem nội dung trước khi xuất
- **Xuất agent** — tải xuống cấu hình agent
- **Xem trước nhập** — phát hiện xung đột trước khi nhập
- **Nhập agent mới** — tạo agents từ file xuất
- **Hợp nhất nhập** — hợp nhất vào agent hiện có

**Tab Skills & MCP:**
- **Xuất/Nhập skills** — JSON
- **Xuất/Nhập máy chủ MCP** — JSON

## Bảng Điều Khiển (không phải hộp thoại modal)

**Luồng Xuất:** Chọn đối tượng (combobox) → Xem trước → **Bắt đầu Xuất** → cây tiến trình → nút **Tải xuống**

**Luồng Nhập:** Kéo thả file `.tar.gz` → Xem trước (phát hiện xung đột) → **Nhập mới** hoặc **Hợp nhất** → tóm tắt hoàn thành (kèm cảnh báo "đừng đóng")
