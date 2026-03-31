# Nodes (Ghép Nối Thiết Bị)

**Route:** `/nodes`
**Nhóm Sidebar:** Kết Nối
**Quyền truy cập:** Admin

## Hiển Thị
Hai phần: yêu cầu ghép nối đang chờ và bảng thiết bị đã ghép (kênh, sender ID, ngày ghép, ghép bởi).

## Thao Tác
- **Phê duyệt ghép nối** — hộp thoại xác nhận
- **Từ chối ghép nối** — hộp thoại xác nhận
- **Thu hồi ghép nối** — hộp thoại xác nhận (ngắt kết nối phiên phía server)
- **Làm mới**

## Hộp Thoại

### Phê Duyệt Ghép Nối
Hiển thị: kênh + sender_id + mã ghép nối
**Thao tác:** **Phê duyệt** | **Hủy**

### Từ Chối Ghép Nối
**Thao tác:** **Từ chối** (nguy hiểm) | **Hủy**

### Thu Hồi Ghép Nối
Hiển thị: kênh + sender_id
**Thao tác:** **Thu hồi** (nguy hiểm) — kích hoạt `EventPairingRevoked` | **Hủy**
