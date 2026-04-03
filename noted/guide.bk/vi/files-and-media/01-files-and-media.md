# File và Media

<YouTube id="bZ0lxPnc25k" title="GoClaw File and Media" />

## Tổng Quan

GoClaw hỗ trợ upload, phân tích, tạo và quản lý file media trong chat. Agent xử lý file thông qua các built-in tools chuyên biệt theo từng định dạng.

**Route quản lý lưu trữ:** `/storage`
**Quyền truy cập:** Admin

---

## Hướng Dẫn Sử Dụng

### Upload File Trong Chat

Hai cách gửi file cho agent:
- **Kéo thả (drag & drop)** — kéo file vào cửa sổ chat
- **Click upload** — bấm nút đính kèm tệp (clip icon) trong thanh nhập liệu

File được đính kèm vào tin nhắn, agent nhận và xử lý cùng với nội dung text.

### Định Dạng Hỗ Trợ

| Loại | Định Dạng |
|------|-----------|
| Hình ảnh | JPEG, PNG, GIF, WebP, BMP, TIFF |
| Video | MP4, AVI, MOV, MKV, WebM |
| Audio | MP3, WAV, OGG, FLAC, AAC, M4A |
| Tài liệu | PDF, DOCX, XLSX, PPTX |
| Text / Code | TXT, MD, JSON, CSV, và các file text khác |

### Xử Lý Tài Liệu

Agent dùng tool `read_document` để phân tích:
- **PDF** — trích xuất text từng trang
- **DOCX** — đọc nội dung Word
- **XLSX / PPTX** — đọc dữ liệu bảng tính / slide

Agent có thể tóm tắt, trả lời câu hỏi, hoặc trích xuất thông tin cụ thể từ tài liệu.

> Lưu ý: `read_file` không đọc được file binary. Agent tự động chọn đúng tool theo định dạng.

### Phân Tích Hình Ảnh

Agent phân tích hình ảnh qua vision của LLM:
- Mô tả chi tiết nội dung hình
- Nhận diện văn bản trong ảnh (OCR)
- Phân tích biểu đồ, sơ đồ
- So sánh nhiều hình

Chỉ cần gửi hình vào chat và đặt câu hỏi.

### Audio và Voice

**Voice message (STT):** Khi gửi voice qua Telegram / Discord, hệ thống tự động:
1. Nhận file audio
2. Chạy Speech-to-Text (STT)
3. Chuyển kết quả thành text
4. Agent xử lý như tin nhắn thường

**Upload file audio:** Agent trích xuất nội dung qua tool `read_audio`.

### Tạo Hình Ảnh

Agent tạo hình từ mô tả text qua tool `create_image`.

Providers hỗ trợ (theo thứ tự ưu tiên):
1. OpenRouter (Gemini 2.5 Flash Image)
2. Gemini
3. OpenAI (DALL-E 3)
4. MiniMax
5. DashScope (Wan 2.6)

Ví dụ: *"Tạo hình ảnh một chú mèo ngồi trên bàn phím, phong cách anime, nền màu xanh"*

### Text-to-Speech (TTS)

Agent chuyển đổi text thành giọng nói qua tool `tts`.

| Provider | Ghi Chú |
|----------|---------|
| OpenAI | Nhiều giọng, chất lượng cao |
| ElevenLabs | Giọng tự nhiên, hỗ trợ clone giọng |
| Edge TTS | Microsoft Edge, miễn phí |
| MiniMax | Hỗ trợ tiếng Việt |

Ví dụ: *"Đọc to đoạn văn này bằng giọng nữ"*

### Tạo Video

Agent tạo video ngắn từ text hoặc hình ảnh qua tool `create_video`.
Provider hỗ trợ: MiniMax Video.

Ví dụ: *"Tạo video 5 giây: một bãi biển lúc hoàng hôn, sóng vào bờ"*

---

## Giao Diện (UI) — Trang Lưu Trữ (`/storage`)

**Hiển thị:** Trình duyệt file với cây thư mục mở rộng được (trái) và trình xem nội dung file (phải). Hiển thị tổng dung lượng ở trên cùng.

**Thao tác:**
- **Duyệt cây thư mục** — tải lazy các thư mục con khi mở rộng
- **Xem nội dung file** — văn bản hiển thị trong trình xem; ảnh hiển thị xem trước
- **Tải lên file** — hộp thoại, tải vào thư mục hiện tại
- **Tải xuống file** — tải về máy tính
- **Xóa file/thư mục** — xác nhận (cảnh báo: toàn bộ nội dung sẽ bị xóa, không thể hoàn tác)
- **Di chuyển file** — kéo thả giữa các thư mục
- **Làm mới**

**Hộp thoại Tải Lên:**
- Vùng kéo thả file, hiển thị đường dẫn thư mục hiện tại
- Thao tác: **Tải lên** | **Hủy**

---

## Quản Lý File Lưu Trữ

**Vị trí lưu trữ:**
- Standard edition — `data/` trên server, phân tách theo tenant
- Lite edition — `~/.goclaw/workspace/`

**Truy cập file qua API:**
```
GET /v1/files/{path}?ft={token}
```
Token có thời hạn ngắn, đảm bảo chỉ người có quyền mới xem được.

**Giới hạn:**

| Giới Hạn | Giá Trị |
|---------|--------|
| Kích thước file tối đa | 10 MB |
| Số file tối đa / workspace | 100 file |

**File trong không gian làm việc nhóm:** File tạo ra khi làm task được tự động lưu vào `attachments/` của team workspace và gắn với task đang thực thi.

---

## Lưu Ý

- Tool `read_file` chỉ đọc file text — dùng `read_document` cho PDF/DOCX/XLSX/PPTX
- File được tạo ra bởi agent (ảnh, audio, video) lưu vào workspace và gửi tới user
- Quản lý lưu trữ toàn bộ (`/storage`) chỉ dành cho Admin

---

## Xem Thêm

- [Không gian làm việc nhóm](../teams/01-teams.md)
- [Hệ thống tools đầy đủ](../admin/03-tools-and-mcp.md)
