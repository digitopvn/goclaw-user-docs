# Tin Nhắn Chờ Xử Lý

<YouTube id="cujahnV4S4U" title="GoClaw Pending Messages" />

**Route:** `/pending-messages`
**Nhóm Sidebar:** Hội Thoại
**Quyền truy cập:** Operator+

---

## Tổng Quan

Khi nhiều tin nhắn đến cùng lúc từ một nhóm hoặc kênh (ví dụ Telegram group, Discord server), GoClaw gom các tin nhắn đó vào **nhóm chờ xử lý** thay vì xử lý từng cái một. Hệ thống này giúp:

- Tránh gọi agent quá nhiều lần cho cùng một chủ đề
- Giảm chi phí LLM bằng cách tóm tắt trước khi xử lý
- Quản lý hàng đợi tin nhắn chưa được giao khi agent bận

---

## Giao Diện (UI)

**Route:** `/pending-messages`

Trang hiển thị bảng các nhóm tin nhắn đang chờ xử lý với các cột:

| Cột | Mô tả |
|-----|-------|
| Channel | Nguồn tin nhắn (Telegram, Discord, ...) |
| Nhóm | Nhãn định danh nhóm hội thoại |
| Tin nhắn | Số lượng tin nhắn chưa xử lý trong nhóm |
| Trạng thái | `Thô` (raw) hoặc `Đã tóm tắt` (compacted) |
| Hoạt động gần đây | Thời gian tin nhắn cuối cùng |

**Thẻ thông tin "Cơ chế hoạt động"** — có thể mở rộng để xem giải thích cơ chế.

---

## Hướng Dẫn

### Xem Tin Nhắn Trong Nhóm

1. Nhấn nút **"Xem tin nhắn"** trên dòng nhóm
2. Hộp thoại hiển thị từng tin nhắn trong nhóm: người gửi, nội dung, thời gian
3. Nhấn **Đóng** để tắt

### Nén Nhóm Tin Nhắn (Compaction)

Nén dùng LLM tóm tắt các tin nhắn thô thành một bản tóm tắt ngắn gọn, giúp giảm context khi agent xử lý:

1. Nhấn nút **"Tóm tắt"** trên dòng nhóm có trạng thái `Thô`
2. Hệ thống gọi LLM để tạo bản tóm tắt
3. Nút hiển thị trạng thái đang xử lý — polling tự động đến khi hoàn thành
4. Trạng thái chuyển sang `Đã tóm tắt` sau khi xong

> Cấu hình ngưỡng nén tự động trong `config.json` trên trang [Cấu hình Hệ Thống](../admin/10-config.md).

### Xóa Nhóm Tin Nhắn

1. Nhấn nút **"Xóa"** trên dòng nhóm
2. Xác nhận trong hộp thoại
3. Toàn bộ tin nhắn trong nhóm bị xóa vĩnh viễn

### Làm Mới

Nhấn **Làm mới** để cập nhật danh sách từ server.

---

## Cơ Chế Hoạt Động

```
Tin nhắn đến (group/channel)
        |
        v
  inbound_debounce_ms (mặc định 1000ms)
        |
        v
  Nhóm chờ xử lý (pending group)
        |
   [nếu >= threshold]
        v
  LLM Compaction (tóm tắt)
        |
        v
  Agent xử lý bản tóm tắt
```

**Cấu hình liên quan trong `config.json`:**

| Trường | Mặc định | Mô tả |
|--------|----------|-------|
| `gateway.inbound_debounce_ms` | `1000` | Thời gian gom tin nhắn (ms, -1 = tắt) |
| `channels.pending_compaction.threshold` | `200` | Số entries kích hoạt compaction tự động |
| `channels.pending_compaction.keep_recent` | `40` | Số tin nhắn giữ lại sau compaction |
| `channels.pending_compaction.max_tokens` | `4096` | Max tokens cho LLM tóm tắt |
| `channels.pending_compaction.provider` | `""` | Provider LLM (trống = dùng provider agent) |

---

## Xử Lý Sự Cố

**Nhóm tin nhắn tồn tại quá lâu, agent không xử lý:**

Nguyên nhân có thể:
- Agent đang bận xử lý task khác
- Lỗi kết nối channel
- Cấu hình `inbound_debounce_ms` quá cao

Giải pháp:
1. Kiểm tra trạng thái agent trên `/agents`
2. Xem logs tại `/logs`
3. Nếu cần, nén hoặc xóa nhóm để giải phóng hàng đợi

**Compaction thất bại:**

- Kiểm tra provider LLM được cấu hình trong `pending_compaction.provider`
- Xem chi tiết lỗi trong `/logs` (lọc theo event `compaction`)
- Nếu provider không khả dụng, compaction sẽ thử lại tự động

**Tin nhắn bị mất sau khi xóa nhóm:**

Xóa nhóm là vĩnh viễn — không thể khôi phục. Chỉ xóa khi chắc chắn tin nhắn không còn cần thiết.

---

## Lưu Ý

- Trang này chỉ hiển thị tin nhắn đến từ **channels nhóm** (group chats) — tin nhắn DM không có trong hàng đợi này
- Compaction thủ công ghi đè compaction tự động đã lập lịch
- Agent vẫn có thể xử lý nhóm ở trạng thái `Thô` — compaction chỉ là tối ưu hóa, không bắt buộc
- Khi `inbound_debounce_ms: -1`, tin nhắn được xử lý ngay lập tức và không qua hàng đợi này

---

## Xem Thêm

- [Cấu hình Hệ Thống — pending_compaction](../admin/10-config.md)
- [Cấu hình kênh kết nối](../admin/02-channels-setup.md)
- [Theo dõi và logs](../admin/06-monitoring.md)
