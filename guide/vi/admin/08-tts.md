# Cấu Hình TTS (Chuyển Văn Bản Thành Giọng Nói)

**Route:** `/tts`
**Nhóm Sidebar:** Khả Năng
**Quyền truy cập:** Owner (Cross-tenant)

---

## Tổng Quan

TTS (Text-to-Speech) cho phép GoClaw đọc to phản hồi của agent bằng giọng nói tổng hợp. Hệ thống hỗ trợ nhiều provider và có thể cấu hình để tự động phát âm thanh theo điều kiện.

---

## Hướng Dẫn Cấu Hình

### 1. Chọn provider chính

Vào `/tts`, chọn provider từ danh sách:

- **Không có** — tắt TTS
- **openai** — sử dụng OpenAI TTS API
- **elevenlabs** — sử dụng ElevenLabs API (giọng cao chất lượng)
- **edge** — sử dụng Microsoft Edge TTS (miễn phí, không cần API key)
- **minimax** — sử dụng MiniMax TTS API

### 2. Cấu hình chế độ tự động (Auto Mode)

| Giá trị | Mô tả |
|---------|-------|
| `off` | Không tự động phát âm thanh |
| `always` | Phát âm thanh cho mọi phản hồi |
| `inbound` | Chỉ phát khi tin nhắn đến từ channel bên ngoài |
| `tagged` | Chỉ phát khi phản hồi có thẻ đặc biệt |

### 3. Chế độ trả lời (Reply Mode)

- **final** — chỉ phát âm thanh cho phản hồi hoàn chỉnh cuối cùng
- **all** — phát âm thanh cho tất cả các turns trong hội thoại

### 4. Giới hạn và timeout

- **Max length** — độ dài văn bản tối đa trước khi cắt (mặc định: 1500 ký tự)
- **Timeout** — thời gian chờ đợi API call tối đa (mặc định: 30 giây)

### 5. Cấu hình theo provider

Mỗi provider có các tham số riêng:

**OpenAI TTS**
- API Key (lấy từ env `OPENAI_API_KEY`)
- Model: mặc định `gpt-4o-mini-tts`
- Giọng nói: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

**ElevenLabs**
- API Key (lấy từ env `ELEVENLABS_API_KEY`)
- Voice ID: mặc định `pMsXgVXv3BLzUgSXRplE`
- Model ID: mặc định `eleven_multilingual_v2`

**Edge TTS**
- Bật/tắt toggle
- Giọng nói: mặc định `en-US-MichelleNeural`
- Tốc độ nói: tốc độ đọc (ví dụ: `+10%`, `-20%`)

**MiniMax**
- API Key + Group ID
- Model: mặc định `speech-02-hd`
- Voice ID: chọn giọng đọc

---

## Giao Diện (UI)

Trang cấu hình TTS gồm:

- **Thẻ trạng thái** — hiển thị provider đang hoạt động và trạng thái kết nối
- **Cài đặt chung** — provider chính, chế độ tự động, chế độ trả lời, max length, timeout
- **Thẻ cài đặt theo provider** — mỗi provider có thẻ riêng với các trường tương ứng
- **Nút Lưu** — lưu toàn bộ cài đặt
- **Nút Làm mới** — tải lại từ server

---

## Ví Dụ

Cấu hình TTS sử dụng Edge TTS (miễn phí), tự động phát cho tin nhắn đến:

```json5
{
  tts: {
    provider: "edge",
    auto: "inbound",
    mode: "final",
    max_length: 1500,
    timeout_ms: 30000,
    edge: {
      enabled: true,
      voice: "vi-VN-HoaiMyNeural",  // Giọng Việt Nam
      rate: "+0%"
    }
  }
}
```

---

## Lưu Ý

- API keys của TTS providers không lưu trong `config.json` — dùng biến môi trường hoặc `.env.local`
- Edge TTS không cần API key nhưng phụ thuộc vào kết nối internet
- `auto: "tagged"` yêu cầu agent trả về thẻ đặc biệt trong phản hồi — kiểm tra tài liệu agent tương ứng
- Khi `mode: "all"`, số lần gọi API tăng lên nhiều — cần theo dõi chi phí với OpenAI/ElevenLabs

---

## Xem Thêm

- [Cấu hình tham chiếu — Section tts](../reference/03-cau-hinh.md#7-section-tts)
- [Cấu hình providers](../admin/02-providers.md)
