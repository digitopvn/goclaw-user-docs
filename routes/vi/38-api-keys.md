# API Keys

**Route:** `/api-keys`
**Nhóm Sidebar:** Hệ Thống
**Quyền truy cập:** Admin

## Hiển Thị
Bảng API keys: tên, tiền tố (8 ký tự đầu), phạm vi, tổ chức (xem chủ sở hữu), trạng thái (hoạt động/thu hồi/hết hạn), ngày hết hạn, lần dùng cuối.

## Thao Tác
- **Tạo API key** — hiển thị key đầy đủ một lần (phải sao chép ngay)
- **Thu hồi API key** — xác nhận
- **Sao chép key mới tạo** — một lần duy nhất
- **Xem ví dụ mã** — hộp thoại với curl/TypeScript/Go
- **Tìm kiếm** | **Làm mới**

## Hộp Thoại

### Tạo API Key
**Trường:** Tên (bắt buộc), Tổ chức (chọn, chỉ chủ sở hữu), Phạm vi (6 checkbox: operator.admin / .read / .write / .approvals / .pairing / .provision), Thời hạn (Không giới hạn / 7 ngày / 30 ngày / 90 ngày)
**Thao tác:** **Tạo** → hiển thị key đầy đủ + **Sao chép** | **Hủy**

### Ví Dụ Mã
**Tab:** curl | TypeScript | Go — hiển thị code với tô sáng cú pháp
**Thao tác:** **Sao chép** mỗi tab (chỉ đọc)
