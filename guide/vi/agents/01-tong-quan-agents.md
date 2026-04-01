# Tổng Quan về Agents

## Tổng quan

Agent là một AI assistant được cấu hình với cá tính, kiến thức, và các công cụ cụ thể. GoClaw hỗ trợ nhiều agent chạy song song, mỗi agent có workspace riêng biệt và vòng lặp xử lý độc lập.

---

## Agent là gì

Agent là một thực thể AI độc lập được cấu hình với:

- **Cá tính và giới thiệu** (SOUL.md, IDENTITY.md): Giọng nói, phong cách, tên, biểu tượng
- **Kiến thức nền tảng** (AGENTS.md, TOOLS.md): Cách vận hành, công cụ có sẵn
- **Hồ sơ người dùng** (USER.md): Tên, múi giờ, sở thích của người dùng
- **Skills và tools**: Khả năng mở rộng để thực hiện công việc cụ thể

Mỗi agent chạy vòng lặp **Think -> Act -> Observe** (tối đa 20 vòng) cho đến khi tạo ra phản hồi cuối cùng.

---

## Hai loại agent

### Open Agent (Agent Mở)

- Mỗi người dùng có **bộ context riêng hoàn toàn** (6 file: AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, BOOTSTRAP.md).
- Cá tính và kỹ năng có thể được tùy chỉnh riêng cho từng người.
- Phù hợp khi mỗi người cần một AI assistant cá nhân hóa khác nhau.

### Predefined Agent (Agent Định Nghĩa Sẵn)

- **Cá tính chia sẻ** cho tất cả người dùng (SOUL.md, IDENTITY.md, AGENTS.md ở cấp agent).
- Mỗi người dùng có USER.md riêng để agent nhớ thông tin cá nhân.
- USER_PREDEFINED.md cung cấp quy tắc xử lý người dùng chung.
- Phù hợp khi cần một AI assistant nhất quán, theo tiêu chuẩn (ví dụ: bot hỗ trợ khách hàng).

| Đặc điểm | Mở | Định sẵn |
|----------|------|-----------|
| Context | Hoàn toàn riêng biệt | Cá tính chung, profile riêng |
| Tùy chỉnh | Toàn phần | Chỉ USER.md |
| Use case | Personal assistant | Shared assistant |

---

## Chọn agent trong Chat

- Sidebar chat có dropdown **AgentSelector** — chọn agent trước khi tạo session mới.
- Agent mặc định là `default` nếu không chọn.
- URL session key chứa thông tin agent: `agent:{agentId}:...` — chuyển session là chuyển agent.
- Trên các kênh ngoài (Telegram, Discord, v.v.), agent được gắn lúc cấu hình kênh; người dùng không cần chọn.

---

## Giao diện — Trang Agents

Route: `/agents`
Nhóm Sidebar: Core
Quyền truy cập: Đã đăng nhập

Hiển thị danh sách phân trang tất cả agents (dạng thẻ hoặc danh sách), tìm kiếm và lọc theo người tạo.

**Thao tác:**
- **Tạo agent** — mở hộp thoại tạo mới
- **Xóa agent** — xác nhận với ô nhập tên
- **Triệu hồi lại** — khởi tạo lại agent (chạy lại quá trình sinh file context)
- **Chuyển (Import/Export)** — điều hướng đến trang import-export
- **Xem chi tiết** — nhấn để điều hướng đến `/agents/:id`

**Hộp thoại Tạo Agent:**

| Trường | Mô tả |
|--------|-------|
| Biểu tượng | Emoji đại diện |
| Tên hiển thị | Tên hiển thị |
| Khóa agent | Slug duy nhất (tự động sinh từ tên, ví dụ: `my-agent`) |
| Provider | Chọn provider đã thêm |
| Model | Chọn model hoặc nhập tay + Xác minh |
| Loại | `predefined` hoặc `open` |
| Cá tính agent | Mô tả vai trò agent — dùng để sinh SOUL.md tự động |
| Tự tiến hóa | Cho phép agent tự cập nhật SOUL.md |

Nút **Kiểm tra & Tạo** kiểm tra kết nối model trước khi tạo. Nếu model đã verify, nút chuyển sang **Tạo**.

**Modal Triệu Hồi:** Hiển thị tiến trình file theo thời gian thực khi agent được khởi tạo lần đầu.
- Thành công: **Tiếp tục**
- Thất bại: **Thử lại** hoặc **Đóng**

---

## Ví dụ — Tạo agent cá nhân

```
/agents -> + Tạo agent
  Biểu tượng: "A"
  Tên hiển thị: "Assistant"
  Khóa agent: assistant (tự động)
  Provider: anthropic
  Model: claude-sonnet-4-5-20250929 -> Kiểm tra OK
  Loại: open
  Cá tính: "Trợ lý cá nhân, thân thiện, ngắn gọn"
  -> Tạo -> Modal Triệu Hồi -> Tiếp tục
  -> Agent "Assistant" xuất hiện trong danh sách
```

---

## Lưu ý

- Khóa agent là định danh khi thực thi — không thể đổi sau khi tạo.
- Loại agent (open/predefined) ảnh hưởng đến cấu trúc workspace — không thể đổi sau khi tạo.
- Mỗi agent có namespace session riêng biệt trên kênh `web:direct`.
- Xóa agent sẽ xóa toàn bộ session, memory, và context files liên quan.

---

## Xem thêm

- [Cấu hình model, behavior, sandbox](./02-cau-hinh-agent.md)
- [Skills và tools](./03-skills.md)
- [Chat với agent](../chat-and-sessions/01-chat-co-ban.md)
