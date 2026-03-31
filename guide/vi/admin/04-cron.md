# Cron và Lịch Trình Tự Động

## Tổng Quan

Cron cho phép agent tự động chạy theo thời gian đặt trước — không cần gửi tin nhắn thủ công. Mỗi cron job kích hoạt một agent turn với một prompt cụ thể, chạy trong lane `cron` riêng biệt (tối đa 30 luồng song song).

**Route danh sách:** `/cron` — Đã đăng nhập
**Route chi tiết:** `/cron/:id` — Đã đăng nhập

---

## Hướng Dẫn

### 3 Loại Biểu Thức Lịch

| Loại | Tham Số | Ví Dụ | Hành Vi |
|------|---------|-------|---------|
| `at` | Thời điểm epoch ms | Ngày mai 15:00 | Chạy 1 lần, tự xóa sau khi chạy |
| `every` | Khoảng cách ms | `1800000` (30 phút) | Lặp lại cố định |
| `cron` | Biểu thức 5 trường | `"0 9 * * 1-5"` | Lịch linh hoạt |

**Cron expression 5 trường:** `phút giờ ngày-tháng tháng ngày-trong-tuần`

Ví dụ hay dùng:
- `"0 9 * * 1-5"` — 9:00 sáng các ngày trong tuần
- `"0 */6 * * *"` — mỗi 6 tiếng
- `"30 8 * * 0"` — Chủ nhật 8:30 sáng

### Tạo Cron Job

1. Vào **Cron > Tác vụ mới**
2. Điền các trường:
   - **Name**: tên mô tả (bắt buộc, tự động tạo slug)
   - **Agent**: chọn agent sẽ chạy
   - **Prompt/Message**: nội dung tin nhắn gửi cho agent (bắt buộc)
   - **Schedule**: chọn loại lịch và nhập giá trị
     - `every`: chu kỳ tính bằng giây (tối thiểu 1)
     - `cron`: biểu thức cron (vd `0 * * * *`)
     - `at`: một lần, mặc định = hiện tại + 1 phút
3. Nhấn **Tạo** — job bắt đầu hoạt động ngay

### Quản Lý Jobs

**Enable/Disable:** Click toggle trên row hoặc trong chi tiết job. Job tắt sẽ bị bỏ qua trong vòng kiểm tra định kỳ.

**Xóa:** Click **Xóa** trên row, xác nhận trước khi xóa. Job `at` tự động xóa sau khi chạy xong.

**Manual Trigger:** Vào chi tiết job > nhấn **Chạy ngay** — dùng để kiểm tra trước khi đặt lịch chính thức.

**Lịch Sử Chạy:** Vào chi tiết job > xem **Lịch sử chạy** — thời điểm chạy, thời gian thực hiện, trạng thái, output và thông báo lỗi. Hệ thống lưu tối đa 200 bản ghi.

### Cài Đặt Nâng Cao (Chi Tiết Job)

- **Múi giờ**: IANA timezone (mặc định UTC)
- **Giao hàng**: Gửi đến Kênh (switch) — chọn Kênh + Người nhận; Kích hoạt Heartbeat (switch)
- **Vòng đời**: Xóa Sau Khi Chạy (switch); Không Trạng Thái (switch)

---

## Giao Diện (UI)

### Trang Danh Sách (`/cron`)

**Hiển thị:** Danh sách phân trang tất cả jobs có tìm kiếm: trạng thái, lịch trình, lần chạy kế tiếp, lần chạy gần nhất.

**Thao tác:** Tạo job | Chạy ngay | Xóa | Xem chi tiết | Làm mới

**Hộp thoại Tạo Job:**
- Trường: Tên (bắt buộc), Agent ID, Loại lịch (nhóm nút: every/cron/at), Tin nhắn (bắt buộc)
- Thao tác: **Tạo** | **Hủy**

### Trang Chi Tiết (`/cron/:id`)

**Hiển thị:** Lịch, payload, agent đích, lịch sử chạy, trạng thái bật/tắt.

**Thao tác:** Chạy ngay | Bật/tắt | Cập nhật cài đặt | Xóa | Xem nhật ký chạy

**Hộp thoại Nhật Ký Chạy:** Danh sách cuộn — thời gian, huy hiệu trạng thái (xanh/đỏ), tóm tắt, lỗi. Trạng thái trống: "Chưa có lịch sử chạy nào."

**Hộp thoại Cài Đặt Nâng Cao:** Múi giờ, Giao hàng, Vòng đời. **Lưu** | **Hủy**

---

## Lane-Based Concurrency

| Lane | Concurrency Mặc Định | Override Env |
|------|:-------------------:|--------------|
| `main` | 30 | `GOCLAW_LANE_MAIN` |
| `subagent` | 50 | `GOCLAW_LANE_SUBAGENT` |
| `team` | 100 | `GOCLAW_LANE_TEAM` |
| `cron` | 30 | `GOCLAW_LANE_CRON` |

Cron jobs không tranh chấp tài nguyên với chat sessions. Các jobs cùng session xếp hàng tuần tự tránh race condition.

---

## Retry Tự Động

| Tham Số | Giá Trị |
|---------|--------|
| Số lần thử tối đa | 3 |
| Delay ban đầu | 2 giây |
| Delay tối đa | 30 giây |

Công thức: `delay = min(2 x 2^lần, 30)` +/- 25% jitter.

---

## Ví Dụ Thực Tế

**Báo cáo hàng ngày:**
- Loại: `cron`, Biểu thức: `"0 8 * * 1-5"`
- Agent: Analyst Agent
- Prompt: *"Tạo báo cáo hoạt động hệ thống 24 giờ qua và gửi tóm tắt qua kênh #reports"*

**Kiểm tra định kỳ:**
- Loại: `every`, Khoảng cách: `1800000` (30 phút)
- Agent: Monitor Agent
- Prompt: *"Kiểm tra trạng thái các service chính, báo cáo nếu phát hiện bất thường"*

---

## Lưu Ý

- Lane `cron` tối đa 30 jobs đồng thời
- Job `at` tự động bị xóa sau khi chạy — không cần dọn dẹp thủ công
- Dùng **Chạy ngay** để test trước khi đặt lịch chính thức

---

## Xem Thêm

- [guide/vi/admin/06-theo-doi.md](06-theo-doi.md) — Xem lịch sử chạy và traces
- [guide/vi/admin/03-tools-va-mcp.md](03-tools-va-mcp.md) — Tool `cron` để agent tự quản lý jobs
