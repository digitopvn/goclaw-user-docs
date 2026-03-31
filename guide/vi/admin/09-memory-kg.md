# Bộ Nhớ và Đồ Thị Tri Thức

**Route Bộ Nhớ:** `/memory`
**Route Đồ Thị Tri Thức:** `/knowledge-graph`
**Nhóm Sidebar:** Dữ Liệu
**Quyền truy cập:** Operator+

---

## Tổng Quan

GoClaw cung cấp hai cơ chế lưu trữ tri thức dài hạn cho agents:

- **Bộ nhớ (Memory)** — lưu trữ tài liệu văn bản có cấu trúc, hỗ trợ tìm kiếm ngữ nghĩa qua vector embeddings
- **Đồ thị tri thức (Knowledge Graph)** — mô hình hóa mối quan hệ giữa các thực thể, tổ chức theo agent và phiên làm việc

---

## Bộ Nhớ (Memory)

### Giao Diện

**Route:** `/memory`

Trang hiển thị bảng tài liệu bộ nhớ với các cột: đường dẫn, agent, phạm vi (cá nhân/toàn cục), mã băm, ngày cập nhật. Huy hiệu trạng thái nhúng vector hiển thị ở trên cùng.

### Quản Lý Tài Liệu

**Tạo tài liệu mới**
1. Nhấn nút "Tạo tài liệu bộ nhớ"
2. Điền vào hộp thoại:
   - **Agent** — chọn agent sở hữu tài liệu
   - **Chế độ phạm vi** — Toàn cục / Hiện có / Tùy chỉnh
   - **Đường dẫn** — định danh tài liệu (ví dụ: `user/preferences`)
   - **Nội dung** — nội dung văn bản
   - **Tự động lập chỉ mục** — bật để nhúng vector ngay sau khi tạo
3. Nhấn **Tạo**

**Xem và chỉnh sửa**
- Nhấn vào dòng tài liệu để mở hộp thoại xem
- Tab **Nội dung**: chỉnh sửa nội dung, hiển thị đường dẫn và metadata
- Tab **Đoạn trích**: xem các đoạn được lập chỉ mục với phạm vi dòng và trạng thái nhúng

**Xóa tài liệu**
- Nhấn nút xóa trên dòng, xác nhận trong hộp thoại

### Lập Chỉ Mục (Indexing)

- **Lập chỉ mục lại một tài liệu** — nhúng lại vector cho một tài liệu cụ thể
- **Lập chỉ mục tất cả** — nhúng lại hàng loạt toàn bộ tài liệu (dùng khi đổi provider embeddings)

### Tìm Kiếm Ngữ Nghĩa

1. Nhấn "Tìm kiếm bộ nhớ"
2. Nhập câu truy vấn (bắt buộc)
3. Tùy chọn lọc theo ID người dùng
4. Kết quả hiển thị: đường dẫn, phạm vi dòng, thanh điểm tương đồng, đoạn trích

### Bộ Lọc

- **Lọc theo agent** — hiển thị tài liệu của agent cụ thể hoặc xem toàn cục
- **Lọc theo phạm vi người dùng** — lọc theo người dùng sở hữu tài liệu

---

## Đồ Thị Tri Thức (Knowledge Graph)

### Giao Diện

**Route:** `/knowledge-graph`

Trình xem thực thể đồ thị tri thức theo từng agent và phiên. Gồm bộ chọn agent, bộ chọn phạm vi (từ các phiên hiện có), huy hiệu trạng thái nhúng.

### Sử Dụng

1. **Chọn agent** — chọn agent cần xem đồ thị tri thức
2. **Lọc theo phạm vi** — lọc theo người dùng hoặc nhóm cụ thể
3. **Xem thực thể** — duyệt danh sách các thực thể KG đã được agent nhận diện

### Khái Niệm

- **Thực thể (Entity)** — đối tượng mà agent nhận biết (người, tổ chức, khái niệm, v.v.)
- **Phạm vi (Scope)** — người dùng hoặc nhóm sở hữu thực thể
- **Đồ thị (Graph)** — mạng lưới mối quan hệ giữa các thực thể

> **Lưu ý:** Knowledge Graph chỉ có sẵn trong Standard edition. Desktop (Lite) không hỗ trợ tính năng này.

---

## Ví Dụ Luồng Làm Việc

**Lưu thông tin người dùng vào bộ nhớ:**

Agent tự động lưu khi detect thông tin quan trọng. Quản trị viên cũng có thể tạo thủ công:

```
Đường dẫn: users/nguyen-van-a/preferences
Nội dung:
- Ngôn ngữ ưu tiên: Tiếng Việt
- Múi giờ: Asia/Ho_Chi_Minh
- Style trả lời: ngắn gọn, có danh sách
```

**Tìm kiếm trước khi trả lời:**

Agent dùng semantic search để lấy tài liệu liên quan trước khi tạo phản hồi, đảm bảo nhất quán với thông tin đã biết về người dùng.

---

## Lưu Ý

- Vector embeddings yêu cầu cấu hình embedding provider (ví dụ: OpenAI `text-embedding-3-small`)
- Nếu chưa cấu hình embeddings, bộ nhớ vẫn hoạt động nhưng không có khả năng tìm kiếm ngữ nghĩa
- Tài liệu có phạm vi "Toàn cục" được chia sẻ giữa tất cả người dùng của agent đó
- Tài liệu có phạm vi "Cá nhân" chỉ thuộc về người dùng cụ thể
- Knowledge Graph phụ thuộc vào khả năng nhận dạng thực thể của LLM — chất lượng phụ thuộc vào provider

---

## Xem Thêm

- [Cấu hình providers](../admin/02-providers.md)
- [Cấu hình tham chiếu — Section agents.defaults](../reference/03-cau-hinh.md)
