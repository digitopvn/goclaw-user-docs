# Đăng Nhập và Chọn Tổ Chức

## Tổng quan

GoClaw hỗ trợ hai phương thức đăng nhập: xác thực bằng Token và xác thực bằng Ghép nối thiết bị. Sau khi đăng nhập, người dùng có nhiều tổ chức (tenant) sẽ được chuyển đến trang chọn tổ chức trước khi vào dashboard.

![Login](/images/login.png)
---

## Hướng dẫn đăng nhập

### Phương thức 1 — Đăng nhập bằng Token

Route: `/login`

1. Mở Web Dashboard, trang đăng nhập hiển thị mặc định ở tab **Token**.
2. Nhập **User ID** (mặc định: `system`) và **Gateway Token**.
3. Nhấn **Kết nối**.
4. Nếu thành công: chuyển hướng đến trang yêu cầu ban đầu (hoặc `/overview`).
5. Nếu thất bại (lỗi 401): hiển thị thông báo "Thông tin xác thực không hợp lệ".

Gateway Token là giá trị `GOCLAW_GATEWAY_TOKEN` được cấu hình trong bước onboard.

### Phương thức 2 — Đăng nhập bằng Ghép nối

Dùng khi không biết token — yêu cầu admin phê duyệt qua trang Nodes.

1. Chuyển sang tab **Ghép nối**.
2. Nhập **User ID**.
3. Nhấn **Yêu cầu truy cập** — hệ thống mở WebSocket và hiển thị mã 6 ký tự.
4. Cung cấp mã này cho admin.
5. Admin phê duyệt qua lệnh CLI:
   ```bash
   goclaw pairing approve {mã}
   ```
6. Sau khi được duyệt, kết nối tự động hoàn tất.

Trạng thái ghép nối theo thứ tự: **Chờ** → **Đang kết nối** → **Đang chờ phê duyệt** → **Đã phê duyệt**.

Nhấn **Hủy** bất kỳ lúc nào để đóng WebSocket và quay về trạng thái chờ.

---

## Giao diện — Trang đăng nhập

Route: `/login`
Quyền truy cập: Công khai

**Hai tab:**

| Tab | Trường nhập | Thao tác |
|-----|-------------|----------|
| Token | User ID, Gateway Token (password) | **Kết nối** |
| Ghép nối | User ID | **Yêu cầu truy cập**, **Hủy** |

Tab Ghép nối hiển thị mã 6 ký tự + lệnh CLI `goclaw pairing approve {mã}` để admin phê duyệt.

---

## Chọn tổ chức (Tenant)

Route: `/select-tenant`
Quyền truy cập: Đã đăng nhập

Hiển thị sau khi đăng nhập nếu người dùng thuộc nhiều tổ chức.

**Hiển thị:** Danh sách thẻ tổ chức của người dùng hiện tại (tên, slug, vai trò).

**Thao tác:**
- Nhấn thẻ để chọn tổ chức — đặt phạm vi phiên làm việc theo tổ chức đó.
- Nếu không thuộc tổ chức nào và không phải owner: hiển thị màn hình "không có quyền truy cập" + nút **Đăng xuất**.

---

## Ví dụ — Luồng đăng nhập đầy đủ

```
[Người dùng] -> /login (tab Token)
  -> Nhập system / <gateway-token>
  -> Nhấn Kết nối
  -> [Hệ thống] Xác thực thành công
  -> Có nhiều tenant? -> /select-tenant -> Chọn tổ chức
  -> Không có tenant? -> /overview (trang chủ)
```

---

## Lưu ý

- Token được lưu trong session storage của trình duyệt sau khi đăng nhập.
- Nếu truy cập trang yêu cầu đăng nhập khi chưa xác thực, hệ thống tự động chuyển về `/login` và lưu lại URL gốc để chuyển hướng sau khi đăng nhập.
- Phương thức Ghép nối phù hợp cho người dùng mới chưa có token — admin quản lý phê duyệt trên trang `/nodes`.

---

## Xem thêm

- [Setup wizard sau khi đăng nhập lần đầu](./04-setup-wizard.md)
- [Cấu hình Gateway token khi cài đặt](./02-installation.md)
