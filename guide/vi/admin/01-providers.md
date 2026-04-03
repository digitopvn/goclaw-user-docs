# Cấu Hình LLM Providers

## Tổng Quan

Provider là kết nối đến một LLM backend. GoClaw abstracts tất cả provider sau một interface chung nên agent loop hoạt động như nhau bất kể backend. API key được mã hóa AES-256-GCM trước khi lưu.

**Route danh sách:** `/providers`
**Route chi tiết:** `/providers/:id`
**Quyền truy cập:** Admin

---

## Hướng Dẫn

### Thêm Provider Mới

1. Vào **Settings > Providers > Thêm provider**
2. Điền các trường:

| Trường | Mô Tả |
|--------|-------|
| Display Name | Tên hiển thị trong UI |
| Provider Name | Slug duy nhất (vd: `my-openrouter`) |
| Provider Type | `openai_compat`, `anthropic`, `claude_cli`, `acp`, `chatgpt_oauth` |
| API Key | Được mã hóa AES-256-GCM khi lưu |
| API Base URL | Chỉ cần khi dùng OpenAI-compat với endpoint riêng |
| Enabled | Tắt thì agent không thể dùng provider này |

3. Nhấn **Tạo** | **Hủy**

### Kiểm Tra Kết Nối

Trong dialog tạo/sửa agent, nhấn **Kiểm tra**:
- Xanh lá: model hợp lệ, kết nối thành công
- Đỏ: lỗi xác thực hoặc model không tồn tại

### Chọn Model Cho Agent

Sau khi chọn provider, dropdown model tải danh sách từ `GET /v1/providers/{id}/models`. Có thể chọn từ danh sách hoặc gõ tên thủ công (Combobox). Nếu provider không trả về danh sách, gõ tên và dùng **Kiểm tra** để xác nhận.

### Sửa và Xóa Provider

**Sửa:** Vào `/providers/:id` — có thể chỉnh sửa Display Name, API Key, API Base URL, Enabled/Disabled, Settings nâng cao.

> Lưu ý: Đổi tên (`name`) làm mất kết nối các agent đang dùng provider đó. Cập nhật agent trước khi đổi tên.

**Xóa:** Click icon xóa, nhập lại tên provider để xác nhận. Agent sẽ fallback sang provider đầu tiên trong registry.

---

## Giao Diện (UI)

### Trang Danh Sách (`/providers`)

**Hiển thị:** Danh sách phân trang có tìm kiếm. Hiển thị sơ đồ phân cấp pool cho ChatGPT OAuth và hạn mức OAuth.

**Thao tác:** Thêm provider | Xóa provider | Xem chi tiết | Tìm kiếm | Làm mới

**Hộp thoại Thêm Provider:**
- Trường: Loại (anthropic_native, openai_compat, gemini_native, claude_cli, dashscope, openrouter, groq, deepseek, ollama, acp, ...), Tên, API Key, API Base, Các trường OAuth
- Thao tác: **Tạo** | **Hủy**

### Trang Chi Tiết (`/providers/:id`)

**Hiển thị:** Các trường cấu hình, API key (ẩn), cài đặt model, cấu hình nhúng và suy luận.

**Thao tác:** Chỉnh sửa cấu hình | Xác minh API key | Xác minh model nhúng | Duyệt model khả dụng | Đăng nhập OAuth | Quản lý Codex Pool | Xóa provider

**Hộp thoại Cài Đặt Nâng Cao:**
- Trường theo loại: URL API Base, binary path/args/TTL/perm-mode/work-dir (ACP), cấu hình CLI, cấu hình OAuth
- Thao tác: **Lưu** | **Hủy**

---

## Danh Sách Providers Hỗ Trợ

### Core Providers

| Tên | Loại | Mô Tả |
|-----|------|-------|
| `anthropic` | Native HTTP+SSE | Claude models qua api.anthropic.com |
| `claude_cli` | stdio subprocess | Binary `claude` cục bộ |
| `codex` | OAuth Responses API | ChatGPT via chatgpt.com |
| `acp` | JSON-RPC 2.0 | Claude Code / Codex / Gemini CLI làm sub-agent |
| `dashscope` | OpenAI-compat | Alibaba Qwen3 models |

### OpenAI-Compatible Providers

| Tên | API Base |
|-----|----------|
| `openai` | api.openai.com/v1 |
| `openrouter` | openrouter.ai/api/v1 |
| `groq` | api.groq.com/openai/v1 |
| `deepseek` | api.deepseek.com/v1 |
| `gemini` | generativelanguage.googleapis.com/v1beta/openai |
| `mistral` | api.mistral.ai/v1 |
| `xai` | api.x.ai/v1 |
| `minimax` | api.minimax.io/v1 |
| `ollama` | localhost:11434/v1 |

---

## Extended Thinking

Cho phép LLM sinh "reasoning tokens" nội bộ trước khi trả lời — cải thiện chất lượng với task phức tạp nhưng tốn thêm token.

| Mức | Mô Tả |
|-----|-------|
| `off` | Tắt thinking (mặc định) |
| `low` | Suy nghĩ nhẹ, nhanh |
| `medium` | Cân bằng tốc độ và chất lượng |
| `high` | Suy nghĩ sâu nhất |

**Hỗ trợ:** Anthropic (4K/10K/32K budget), OpenAI-compat GPT-5/Codex, DashScope Qwen3. Ollama/Groq/DeepSeek: không hỗ trợ.

**Cấu hình:** Tab Config của agent > phần Thinking > Inherit hoặc Custom. Expert Mode cho phép chọn `reasoning_effort` chi tiết hơn.

---

## Provider Pool (Nhiều Account Cùng Loại)

Dành cho `chatgpt_oauth`: gộp nhiều account vào một pool để load balance.

| Strategy | Mô Tả |
|----------|-------|
| `primary_first` | Dùng account chính trước, fallback khi lỗi |
| `round_robin` | Xoay vòng đều giữa tất cả account |
| `priority_order` | Drain theo thứ tự các account phụ |

---

## Lưu Ý

- Provider từ config file bị override bởi provider cùng tên trong database
- Fallback: nếu provider không tìm thấy, dùng provider đầu tiên trong registry
- Xóa provider không xóa agent

---

## Xem Thêm

- [Cấu hình kênh kết nối](../chat-and-sessions/03-channels.md)
- [Mã hóa API keys](05-security.md)
