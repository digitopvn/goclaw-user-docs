# Codex Pool

## Tổng quan

Codex Pool là tính năng quản lý pool định tuyến ChatGPT OAuth cho một agent cụ thể. Thay vì dùng một ChatGPT OAuth provider duy nhất, Codex Pool cho phép cấu hình nhiều provider và định tuyến request theo chiến lược (round-robin, primary-first, v.v.) để tăng tính sẵn sàng và giảm nguy cơ hết hạn mức.

Route: `/agents/:id/codex-pool`
Nhóm Sidebar: Core (trang con của Agent)
Quyền truy cập: Admin

---

## Codex Pool là gì

ChatGPT OAuth là phương thức xác thực để truy cập ChatGPT qua luồng OAuth thay vì API key thông thường. Khi một agent sử dụng ChatGPT OAuth:

- Có thể cấu hình nhiều tài khoản / provider ChatGPT OAuth.
- Codex Pool phân phối request đến các provider theo chiến lược.
- Nếu một provider gặp lỗi hoặc hết hạn mức, pool tự động chuyển sang provider khác (fallback).
- Hệ thống theo dõi sức khỏe từng provider trong pool theo thời gian thực.

---

## Giao diện

Trang gồm hai phần chính:

### Bảng hoạt động pool

Hiển thị thống kê theo từng provider trong pool:

| Cột | Mô tả |
|-----|-------|
| Provider | Tên ChatGPT OAuth provider |
| Số yêu cầu | Tổng request đã xử lý |
| Tỷ lệ thành công | Phần trăm request thành công |
| Điểm sức khỏe | Điểm đánh giá sức khỏe hiện tại (0-100) |
| Số lần chuyển dự phòng | Số lần pool đã chuyển sang provider này do fallback |
| Timeline | Biểu đồ hoạt động theo thời gian |

### Cấu hình định tuyến

Các thiết lập chiến lược phân phối request.

---

## Hướng dẫn cấu hình

### Thêm provider vào pool

1. Vào `/agents/:id` -> nhấn **Quản lý Codex Pool** -> `/agents/:id/codex-pool`.
2. Nhấn **Thêm provider**.
3. Chọn ChatGPT OAuth provider từ danh sách đã đăng ký.
4. Nhấn **Lưu cấu hình định tuyến**.

### Chọn chiến lược định tuyến

| Chiến lược | Mô tả |
|------------|-------|
| `round-robin` | Phân phối đều đến tất cả provider theo vòng |
| `primary-first` | Ưu tiên provider chính, chỉ dùng provider phụ khi chính gặp lỗi |

Sau khi chọn chiến lược, nhấn **Lưu cấu hình định tuyến** để áp dụng.

### Xóa provider khỏi pool

1. Tìm provider trong bảng hoạt động.
2. Nhấn **Xóa** bên cạnh provider đó.
3. Pool tự động cập nhật, request mới không còn được gửi đến provider đã xóa.

### Làm mới dữ liệu

Nhấn **Làm mới** để cập nhật bảng hoạt động và dữ liệu hạn mức về trạng thái hiện tại.

### Xem liên kết provider (chỉ admin)

Admin có thể xem thông tin liên kết OAuth chi tiết của từng provider trong pool.

---

## Ví dụ — Cấu hình pool với 2 provider

```
/agents/my-agent/codex-pool
  -> Thêm provider: chatgpt-oauth-account-1
  -> Thêm provider: chatgpt-oauth-account-2
  -> Chiến lược: round-robin
  -> Lưu cấu hình định tuyến

Kết quả:
  Request 1 -> account-1
  Request 2 -> account-2
  Request 3 -> account-1
  ...
  Nếu account-1 lỗi -> tự động chuyển hết sang account-2
```

---

## Lưu ý

- Codex Pool chỉ áp dụng cho agent sử dụng ChatGPT OAuth provider — không ảnh hưởng đến các provider khác (Anthropic, OpenAI API key, v.v.).
- Provider phải được đăng ký trong `/providers` trước khi thêm vào pool.
- Điểm sức khỏe tính toán dựa trên tỷ lệ thành công, độ trễ, và số lần fallback gần đây.
- Khi tất cả provider trong pool gặp lỗi, agent trả về lỗi cho người dùng thay vì treo vô hạn.
- Tính năng này phù hợp cho môi trường dùng nhiều tài khoản ChatGPT để tránh giới hạn bản miễn phí.

---

## Xem thêm

- [Cấu hình tổng quát agent, bao gồm mục "Định tuyến ChatGPT OAuth"](./02-cau-hinh-agent.md)
- [Tổng quan về agents](./01-tong-quan-agents.md)
