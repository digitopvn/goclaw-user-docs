# Đội Nhóm (Agent Teams)

<YouTube id="0LX9gyBMS38" title="GoClaw Agent Config" />

## Tổng Quan

Agent team là nhóm các AI agent hợp tác qua một **task board chung**. Lead agent điều phối công việc, member agents thực thi độc lập và song song.

**Route danh sách:** `/teams` — Operator+
**Route chi tiết:** `/teams/:id` — Operator+

---

## Hướng Dẫn Sử Dụng

### Khi Nào Cần Dùng Team

| Tình Huống | Ví Dụ |
|-----------|-------|
| Research + viết báo cáo | Member A tìm tài liệu, Member B soạn văn bản |
| Viết code + review | Member A code, Member B kiểm tra lỗi |
| Tạo nội dung đa dạng | Member A viết caption, Member B tạo hình ảnh |
| Phân tích nhiều nguồn | Mỗi member xử lý một tập dữ liệu riêng |
| Luồng duyệt (human-in-the-loop) | Task cần người duyệt trước khi xong |

### Tạo Team

1. Vào **Web UI > Teams > Tạo Team**
2. Điền **Tên** và **Mô tả**
3. Chọn **Agent trưởng nhóm** (chỉ một lead)
4. Thêm **Thành viên** (chỉ chọn agent định sẵn)
5. Nhấn **Tạo** — yêu cầu: tên + lead + ít nhất 1 thành viên

Giới hạn: Lite edition tối đa 1 team / 5 thành viên. Standard edition không giới hạn.

### Tạo Nhiệm Vụ

Trong trang chi tiết team, nhấn **Tạo nhiệm vụ**:

| Trường | Mô Tả |
|--------|-------|
| Tiêu đề | Tiêu đề ngắn gọn (bắt buộc) |
| Mô tả | Nội dung chi tiết |
| Loại | Chung / Ủy quyền / Leo thang |
| Độ ưu tiên | Số nguyên, cao hơn = ưu tiên hơn |
| Giao cho | Thành viên được phân công |

### Dependency Giữa Nhiệm Vụ

Đặt `blocked_by` khi một task cần task khác xong trước:
- Task ở trạng thái `blocked` cho đến khi tất cả task phụ thuộc hoàn thành
- Khi task phụ thuộc xong, task `blocked` tự động chuyển sang `pending`
- Task `cancelled` cũng giải phóng phụ thuộc

### Bình luận và Blocker

Cả người dùng lẫn agent đều có thể thêm bình luận vào task:
- **Bình luận thường** — phản hồi, giải thích
- **Blocker comment** — task tự động chuyển sang `failed`, lead nhận thông báo escalation

---

## Giao Diện (UI)

### Trang Danh Sách (`/teams`)

Hiển thị: danh sách phân trang (thẻ hoặc danh sách), tìm kiếm.

Thao tác:
- **Tạo nhóm** — mở hộp thoại
- **Xóa nhóm** — xác nhận
- **Xem chi tiết** — nhấn vào thẻ

### Trang Chi Tiết (`/teams/:id`)

Hiển thị: thông tin nhóm, danh sách thành viên, task board.

**Hộp thoại Thành Viên**: danh sách cuộn — emoji, tên, vai trò (trưởng/người đánh giá/thành viên). Thêm (combobox agent định sẵn) | Xóa (X) mỗi thành viên (trừ trưởng).

**Hộp thoại Thông Tin Nhóm**: tên, trạng thái, mô tả, trưởng nhóm, số thành viên, tab cài đặt. Nhấn huy hiệu "v2 Super Team" → Modal Tính Năng.

**Hộp thoại Tạo Nhiệm Vụ**: Tiêu đề (bắt buộc), Mô tả, Loại, Độ ưu tiên, Giao cho. Nhấn **Tạo nhiệm vụ** | **Hủy**.

**Hộp thoại Chi Tiết Nhiệm Vụ**: ID task, trạng thái, tiến trình (V2), banner theo dõi (V2), metadata, task bị chặn, mô tả, kết quả, bình luận, lịch sử. Thao tác: **Xóa** (task hoàn thành) | **Thêm bình luận** | **Điều hướng task liên quan**.

**Không Gian Làm Việc Nhóm** (90vh x 95vw): trình duyệt file — bộ lọc phạm vi, cây thư mục, trình xem nội dung. Thao tác: **Tải lên** | **Tải xuống** | **Xóa** | **Di chuyển** (kéo thả) | **Làm mới**.

---

## Vòng Đời Nhiệm Vụ

```
pending → in_progress → completed
    |           |
  blocked    in_review → approved → completed
                      → rejected → cancelled
    |
  failed → (retry) → pending
```

| Trạng thái | Ý Nghĩa |
|--------|---------|
| `pending` | Mới tạo, chờ xử lý |
| `in_progress` | Thành viên đang làm |
| `in_review` | Thành viên gửi duyệt |
| `completed` | Hoàn thành |
| `blocked` | Chờ task phụ thuộc |
| `failed` | Lỗi / blocker escalation |
| `cancelled` | Bị hủy |
| `stale` | Không hoạt động lâu |

---

## Không Gian Làm Việc Nhóm

| Chế Độ | Thư Mục | Dùng Khi |
|--------|---------|---------|
| Cô lập (mặc định) | `teams/{teamID}/{chatID}/` | Phân tách file theo cuộc trò chuyện |
| Chia sẻ | `teams/{teamID}/` | Tất cả thành viên dùng chung |

Giới hạn: file tối đa 10 MB, tối đa 100 file/scope.

---

## Giới Hạn Theo Phiên Bản

| Tính Năng | Lite | Standard |
|-----------|:----:|:--------:|
| Số team tối đa | 1 | Không giới hạn |
| Số thành viên/team | 5 | Không giới hạn |
| Bình luận / Review / Đính kèm | Không | Đầy đủ |
| Nhắc nhở theo dõi | Không | Đầy đủ |

---

## Lưu Ý

- Lead chỉ giao việc qua task board, không giao trực tiếp qua hàm gọi
- Các thành viên có thể chạy song song — kết quả được gộp lại và trả về user trong một lượt
- File tạo ra trong task được tự động lưu vào `attachments/` và gắn với task

---

## Xem Thêm

- [Không gian làm việc nhóm và file](../files-and-media/01-files-and-media.md)
