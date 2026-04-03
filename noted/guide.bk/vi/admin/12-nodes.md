# Nodes (Ghép Nối Thiết Bị)

**Route:** `/nodes`
**Nhóm Sidebar:** Kết Nối
**Quyền truy cập:** Admin

---

## Tổng Quan

Nodes quản lý việc ghép nối (pairing) các thiết bị vật lý hoặc ứng dụng client với hệ thống GoClaw. Khi một thiết bị được ghép, nó có thể giao tiếp với agents qua channel cụ thể mà không cần xác thực lại từng lần.

Cơ chế này thích hợp cho:
- Thiết bị IoT gửi tin nhắn định kỳ
- Ứng dụng mobile kết nối với agent cụ thể
- Triển khai đa instances với các thiết bị riêng biệt

---

## Giao Diện (UI)

**Route:** `/nodes`

Trang chia thành hai phần chính:

**Yêu cầu ghép nối đang chờ** — danh sách các thiết bị đã gửi yêu cầu pairing, chờ admin phê duyệt hoặc từ chối.

**Thiết bị đã ghép** — bảng các thiết bị đang hoạt động, hiển thị: kênh (channel), sender ID, ngày ghép, ghép bởi (admin nào đã duyệt).

---

## Hướng Dẫn

### Quy Trình Ghép Thiết Bị

1. **Thiết bị gửi yêu cầu** — thiết bị gọi `device.pair.request` qua WebSocket với mã ghép nối
2. **Hiển thị trong "Yêu cầu đang chờ"** — admin thấy yêu cầu mới trên trang `/nodes`
3. **Admin phê duyệt** — nhấn nút phê duyệt, xác nhận thông tin
4. **Thiết bị nhận xác nhận** — thiết bị chuyển sang trạng thái đã xác thực

### Phê Duyệt Yêu Cầu Ghép

1. Tìm yêu cầu trong phần "Yêu cầu đang chờ"
2. Nhấn **Phê duyệt**
3. Kiểm tra thông tin trong hộp thoại: kênh, sender ID, mã ghép nối
4. Nhấn **Phê duyệt** để xác nhận

### Từ Chối Yêu Cầu Ghép

1. Tìm yêu cầu cần từ chối
2. Nhấn **Từ chối**
3. Xác nhận trong hộp thoại (hành động nguy hiểm)
4. Nhấn **Từ chối** — yêu cầu bị xóa

### Thu Hồi Thiết Bị Đã Ghép

1. Tìm thiết bị trong bảng "Thiết bị đã ghép"
2. Nhấn **Thu hồi**
3. Xác nhận trong hộp thoại — hiển thị kênh và sender ID
4. Nhấn **Thu hồi** — kích hoạt sự kiện `EventPairingRevoked`, ngắt kết nối phiên phía server ngay lập tức

### Làm Mới

Nhấn **Làm mới** để cập nhật danh sách từ server.

---

## Triển Khai Đa Instances

Trong môi trường có nhiều instance GoClaw chạy song song (horizontal scaling), mỗi instance cần biết về các thiết bị đã ghép để xử lý tin nhắn đúng:

- **Đồng bộ trạng thái pairing** — thông tin ghép nối lưu trong database chung (PostgreSQL), tất cả instances đều có thể tra cứu
- **Sender ID** — định danh duy nhất của thiết bị, dùng để định tuyến tin nhắn đúng instance
- **Thu hồi từ xa** — khi thu hồi trên bất kỳ instance nào, sự kiện broadcast đến tất cả instances để ngắt kết nối

### Các Trường Hợp Cần Lưu Ý

| Tình huống | Xử lý |
|-----------|-------|
| Thiết bị đổi IP | Pairing vẫn hợp lệ — định danh dựa trên sender ID, không phải IP |
| Instance bị restart | Thiết bị tự động reconnect và pairing được khôi phục từ DB |
| Thu hồi khi thiết bị offline | Thu hồi ghi vào DB, có hiệu lực khi thiết bị kết nối lại |
| Nhiều thiết bị cùng sender ID | Không cho phép — mỗi sender ID chỉ ghép một lần |

---

## Ví Dụ

**Ghép máy tính bảng (tablet) với agent hỗ trợ khách hàng:**

1. App trên tablet gọi `device.pair.request` với kênh `web` và sender ID `tablet-reception-01`
2. Admin mở `/nodes`, thấy yêu cầu từ `tablet-reception-01`
3. Xác nhận đây là thiết bị hợp lệ → Phê duyệt
4. Tablet được ghép, từ đó có thể gửi tin nhắn mà không cần token

---

## Lưu Ý

- Thu hồi (`revoke`) ngắt kết nối ngay lập tức phía server — thiết bị sẽ nhận lỗi WebSocket và cần xin ghép lại
- `EventPairingRevoked` có thể được lắng nghe bởi các hệ thống khác để phản ứng theo
- Pairing codes có thời hạn — kiểm tra cấu hình `gateway.pairing_code_ttl` nếu yêu cầu tự động hết hạn
- Nodes chỉ hiển thị trong Standard edition có multi-channel; Desktop (Lite) không có channels nên không sử dụng trang này

---

## Xem Thêm

- [Cấu hình kênh kết nối](../admin/02-channels-setup.md)
- [WebSocket RPC — Pairing methods](../reference/02-websocket-rpc.md)
- [Bảo mật và phân quyền](../admin/05-security.md)
