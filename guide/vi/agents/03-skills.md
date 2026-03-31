# Skills (Kỹ Năng)

## Tổng quan

Skills là các module kiến thức hoặc hướng dẫn được nhúng vào system prompt, giúp agent biết cách sử dụng công cụ hoặc xử lý lĩnh vực cụ thể. Khác với tools (thực thi hành động), skills là kiến thức — agent đọc skills để biết cách làm việc.

---

## Skills là gì

Skills là file ZIP chứa:
- Hướng dẫn sử dụng công cụ (ví dụ: cách dùng `pdf`, `xlsx`, `docx`)
- Quy trình xử lý tác vụ cụ thể
- Tài liệu tham khảo nội bộ

**Ví dụ skills có sẵn:**

| Skill | Chức năng |
|-------|-----------|
| `pdf` | Đọc, tạo, gộp, tách file PDF |
| `xlsx` | Đọc, tạo, chỉnh sửa spreadsheet |
| `docx` | Đọc, tạo, chỉnh sửa file Word |
| `pptx` | Đọc, tạo, chỉnh sửa bài thuyết trình |
| `skill-creator` | Tạo skill mới |

**Cách agent tìm kiếm skills:**

| Điều kiện | Hành vi |
|-----------|---------|
| <= 20 skills và tổng token <= 3.500 | Danh sách skills được nhúng trực tiếp vào system prompt (inline mode) |
| Nhiều hơn ngưỡng trên | Agent dùng tool `skill_search` để tìm kiếm theo keyword (BM25 + vector search) |

---

## Phạm vi hiển thị (Visibility)

| Mức | Quyền truy cập |
|-----|----------------|
| `public` | Tất cả agent và người dùng |
| `private` | Chỉ chủ sở hữu |
| `internal` | Phải được cấp quyền rõ ràng |

---

## Giao diện — Trang Skills

Route: `/skills`
Nhóm Sidebar: Kỹ Năng
Quyền truy cập: Đã đăng nhập

Hiển thị bảng hai tab:
- **Hệ thống**: Skills hệ thống (built-in)
- **Tùy chỉnh**: Skills do người dùng tải lên

Các cột: tên, mô tả, tác giả, trạng thái, khả năng hiển thị, thao tác.

Bảng **Thiếu dependencies** hiện ở trên cùng nếu có skill chưa đủ điều kiện chạy.

**Thao tác:**
- **Tải lên skill** — kéo thả file `.zip` vào vùng tải lên
- **Chỉnh sửa metadata** — tên, mô tả, khả năng hiển thị, thẻ
- **Xóa skill** — xác nhận
- **Bật/tắt** — switch mỗi skill
- **Chuyển đổi khả năng hiển thị** — nhấn badge để chuyển `public` -> `internal` -> `private`
- **Quét lại dependencies** — quét tất cả skills
- **Cài đặt dependency đơn lẻ** — cài đặt từng gói
- **Ghi đè theo tổ chức** — bật/tắt skill cho tổ chức hiện tại (Toggle / Đặt lại)

---

## Hướng dẫn — Tải lên skill mới

1. Vào `/skills`, nhấn **Tải lên skill**.
2. Kéo thả file `.zip` vào vùng tải lên (hoặc nhấn để chọn file).
3. Hệ thống xác thực từng file: **đang xác thực** -> **hợp lệ / không hợp lệ** -> **đang tải** -> **thành công / lỗi**.
4. Nhấn **Tải lên [N]** để bắt đầu tải lên các file đã xác thực.
5. Sau khi hoàn thành, nhấn **Xong**.
6. Nhấn **X** mỗi file để xóa khỏi hàng đợi trước khi tải.

---

## Giao diện — Chi tiết Skill

Route: `/skills/:id`
Nhóm Sidebar: Kỹ Năng
Quyền truy cập: Đã đăng nhập

Mở dưới dạng hộp thoại từ trang `/skills`.

**Hai tab:**

| Tab | Nội dung |
|-----|----------|
| Nội dung | README markdown của skill |
| Tệp | Chọn phiên bản, cây file, trình xem nội dung với tô sáng cú pháp |

**Thao tác:**
- **Xem phiên bản** — danh sách tất cả phiên bản đã phát hành
- **Duyệt files** — danh sách file trong thư mục skill
- **Đọc nội dung file** — hiển thị trong trình xem với tô sáng cú pháp
- **Ghim phiên bản cho agent** — cấp skill cho agent theo phiên bản cụ thể
- **Sao chép** — sao chép nội dung file

---

## Tools — Công cụ Agent Có Thể Dùng

Tools là chức năng thực thi (khác skills là kiến thức). Agent chọn tool phù hợp và gọi trong quá trình xử lý.

| Nhóm tool | Ví dụ |
|-----------|-------|
| Filesystem | `read_file`, `write_file`, `list_files` |
| Web | `web_search`, `browser_act`, `browser_screenshot` |
| Code execution | `exec` (chạy Python, Node.js trong sandbox Docker) |
| Memory | `memory_search`, `memory_write` |
| TTS | `tts_convert` (văn bản sang giọng nói) |
| Subagent | Gọi agent khác xử lý tác vụ con |
| MCP tools | Công cụ từ MCP server bên ngoài |

Mỗi request có thể có danh sách tools được phép riêng (ví dụ: Telegram forum topic có thể giới hạn tools).

---

## Ví dụ — Thêm skill pdf cho agent

```
/skills -> Tải lên skill -> kéo thả pdf.zip
  -> Xác thực: hợp lệ
  -> Tải lên -> Thành công
/skills -> nhấn "pdf" -> Chi tiết -> Ghim phiên bản
  -> Chọn agent: "Assistant", phiên bản: latest
  -> Xác nhận
```

---

## Lưu ý

- Skills chỉ là kiến thức — agent vẫn cần có tools tương ứng mới thực hiện được (ví dụ: skill `pdf` cần tool `exec` hoặc `read_file`).
- Skills `private` chỉ chủ sở hữu thấy — phù hợp cho kiến thức nội bộ của từng người.
- Xóa skill đang được sử dụng bởi agent không tự động vô hiệu hóa agent — agent chỉ không tìm thấy skill khi cần.
- Phiên bản skill được ghim cho agent: nếu không ghim phiên bản cụ thể, agent dùng phiên bản mới nhất.

---

## Xem thêm

- [01-tong-quan-agents.md](./01-tong-quan-agents.md) — Khái niệm agent và skills
- [02-cau-hinh-agent.md](./02-cau-hinh-agent.md) — Cấu hình agent nâng cao
- [04-codex-pool.md](./04-codex-pool.md) — Codex Pool cho ChatGPT OAuth routing
