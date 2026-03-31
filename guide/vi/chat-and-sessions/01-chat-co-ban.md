# Chat Co Ban

## Tong quan

Giao dien Chat la trung tam tuong tac chinh voi AI agents tren Web Dashboard. Ho tro gui tin nhan van ban, dinh kem file, xem streaming response voi tool call cards, va quan ly nhieu session song song.

Route: `/chat/:sessionKey?`
Nhom Sidebar: Core
Quyen truy cap: Da dang nhap

---

## Giao dien

Giao dien chat gom 3 khu vuc chinh:

- **Sidebar (trai)**: Danh sach session, nut tao session moi, bo chon agent (AgentSelector dropdown)
- **Chat area (giua)**: Luong tin nhan, streaming response, tool call cards, thinking blocks
- **Input bar (duoi)**: O nhap tin nhan, nut dinh kem file, nut gui
- **Bang task nhom (phai)**: Tu dong mo khi agent dang chay nhiem vu nhom (team tasks)

Tren mobile: sidebar bi an, nhan icon menu de mo. Keyboard ao tren iOS/Android duoc xu ly tu dong de input bar khong bi che.

---

## Huong dan

### Tao session moi

1. Mo sidebar (tren mobile: nhan icon menu).
2. Chon agent tu dropdown **AgentSelector** — hien danh sach tat ca agent.
3. Nhan nut **New Chat** (icon `+`).
4. URL cap nhat thanh `/chat/{sessionKey}` — session duoc tao tu dong khi gui tin nhan dau tien.

Session key co dinh dang `agent:{agentId}:{channel}:direct:{userId}`. Moi agent co namespace session rieng biet.

### Gui tin nhan

- Nhap noi dung vao input bar, nhan **Enter** (hoac nut Send) de gui.
- Ho tro **Markdown** trong noi dung nhap: `**bold**`, `*italic*`, backtick code, list.
- Dinh kem file: keo tha hoac nhan icon dinh kem — file duoc upload qua `/v1/media/upload` va duong dan tu dong inject vao tin nhan.
- Input bar tu dong tang chieu cao theo noi dung nhap (multi-line).

### Xem streaming response

Khi agent xu ly, response duoc stream theo tung token:

| Thanh phan | Mo ta |
|------------|-------|
| ThinkingBlock | Hien thi khi agent dang suy nghi (Extended Thinking) — co the an/hien |
| ToolCallCard | The hien thi ten tool va ket qua (web_search, read_file, v.v.) |
| MessageBubble | Tich luy text streaming, render Markdown sau khi hoan thanh |
| Typing indicator | Hien o cuoi thread khi agent dang xu ly |

Response tu dong cuon xuong khi co tin nhan moi (smooth scroll). Khi user tu cuon len, auto-scroll tam dung.

### Dung response (Abort)

Khi agent dang chay:
- Nut **Stop** hien thi trong input area — nhan de huy request hien tai (`chat.abort`).
- Neu co nhieu agent con dang chay (team tasks), trang thai `isBusy` van con cho den khi tat ca hoan thanh.
- Tren Telegram: dung lenh `/stop` de huy run hien tai, `/stopall` de huy tat ca.

### Xem lich su chat

- Lich su duoc load tu `chat.history` khi chon session.
- Cuon len de xem tin nhan cu.
- Session cu duoc liet ke trong sidebar, sap xep theo thoi gian.
- **Che do chi doc**: Session cua nguoi dung khac hien thi o che do read-only (neu duoc cap quyen).

### Xoa session

1. Hover vao session trong sidebar de hien icon Xoa.
2. Nhan icon Xoa — xuat hien dialog xac nhan.
3. Xac nhan de xoa vinh vien (`sessions.delete`).

Luu y: Xoa session khong the phuc hoi. Lich su tin nhan bi xoa hoan toan.

---

## Phim tat

| Phim tat | Chuc nang |
|----------|-----------|
| `Enter` | Gui tin nhan |
| `Shift+Enter` | Xuong dong moi trong input |
| `Escape` | Dong sidebar (mobile) |

---

## Vi du

Bat dau chat voi agent "Assistant":

```
1. Sidebar -> AgentSelector -> chon "Assistant"
2. Nhan New Chat (+)
3. URL: /chat/agent:assistant-id:web:direct:system
4. Nhap: "Tong ket bai viet nay cho toi" + dinh kem file PDF
5. Nhan Enter -> agent nhan file, xu ly, tra ket qua
```

---

## Luu y

- Moi agent co namespace session rieng — chuyen agent la chuyen session namespace, khong the dung chung session cu.
- Streaming chi hoat dong qua WebSocket RPC — dam bao ket noi WebSocket on dinh.
- Tool call cards hien thi theo thoi gian thuc trong qua trinh agent xu ly, giup theo doi agent dang lam gi.
- Tren cac kenh ngoai (Telegram, Discord, ...), agent duoc gan khi cau hinh kenh; nguoi dung khong can chon agent.

---

## Xem them

- [02-quan-ly-sessions.md](./02-quan-ly-sessions.md) — Quan ly va tim kiem sessions
- [03-kenh-ket-noi.md](./03-kenh-ket-noi.md) — Chat qua Telegram, Discord, Slack
- [../agents/01-tong-quan-agents.md](../agents/01-tong-quan-agents.md) — Hieu ro ve agents va skills
