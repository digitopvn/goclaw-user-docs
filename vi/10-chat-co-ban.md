# 10 - Chat Co Ban (Web UI)

Huong dan su dung giao dien chat tren Web UI cua GoClaw.

---

## 1. Giao Dien Tong Quan

Giao dien chat gom 3 khu vuc chinh:

- **Sidebar (trai)**: Danh sach session, nut tao session moi, bo chon agent
- **Chat area (giua)**: Luong tin nhan, streaming response, tool call cards
- **Input bar (duoi)**: O nhap tin nhan, nut dinh kem file, nut gui

Tren mobile, sidebar bi an; nhan icon menu de mo. Keyboard ao tren iOS/Android duoc xu ly tu dong de input bar khong bi che.

---

## 2. Tao Session Moi

1. Mo sidebar (icon menu tren mobile hoac sidebar hien thi san tren desktop)
2. Chon agent muon su dung tu bo chon **AgentSelector** (dropdown hien danh sach agent)
3. Nhan nut **New Chat** (icon dau `+`)
4. URL duoc cap nhat thanh `/chat/{sessionKey}` — session duoc tao tu dong khi gui tin nhan dau tien

Session key co dinh dang `agent:{agentId}:{channel}:direct:{userId}`. Moi agent co namespace session rieng biet.

---

## 3. Gui Tin Nhan

- Nhap noi dung vao input bar, nhan **Enter** (hoac nut Send) de gui
- Ho tro **Markdown** trong noi dung nhap: `**bold**`, `*italic*`, backtick code, list
- Dinh kem file: keo tha hoac nhan icon dinh kem — file duoc upload qua `/v1/media/upload` va duong dan tu dong inject vao tin nhan
- Input bar tu dong tang chieu cao theo noi dung nhap (multi-line)

---

## 4. Streaming Response

Khi agent xu ly, response duoc stream theo tung token:

- **ThinkingBlock**: Hien thi khi agent dang suy nghi (Extended Thinking)
- **ToolCallCard**: The hien thi ten tool va ket qua (web_search, read_file, v.v.)
- **MessageBubble**: Tich luy text streaming, render Markdown sau khi hoan thanh
- Typing activity indicator hien o cuoi thread khi agent dang xu ly

Response duoc tu dong cuon xuong khi co tin nhan moi (smooth scroll). Khi user tu cuon len, auto-scroll tam dung.

---

## 5. Xem Lich Su Chat

- Lich su duoc load tu `chat.history` khi chon session
- Cuon len de xem tin nhan cu
- Session cu duoc liet ke trong sidebar, sap xep theo thoi gian
- Session co the duoc xem lai bat ky luc nao, ke ca session cua nguoi dung khac neu duoc chia se

---

## 6. Dung Response (Abort)

Khi agent dang chay:

- Nut **Stop** hien thi trong input area — nhan de huy request hien tai (`chat.abort`)
- Neu co nhieu agent con dang chay (team tasks), trang thai `isBusy` van con cho den khi tat ca hoan thanh
- Tren Telegram: dung lenh `/stop` de huy run hien tai, `/stopall` de huy tat ca

---

## 7. Xoa Session

1. Hover vao session trong sidebar de hien icon Xoa
2. Nhan icon Xoa — xuat hien dialog xac nhan
3. Xac nhan de xoa vinh vien (`sessions.delete`)

Luu y: Xoa session khong the phuc hoi. Lich su tin nhan bi xoa hoan toan.

---

## 8. Phim Tat

| Phim tat | Chuc nang |
|----------|-----------|
| `Enter` | Gui tin nhan |
| `Shift+Enter` | Xuong dong moi trong input |
| `Escape` | Dong sidebar (mobile) |

---

## Xem Them

- [04-gateway-protocol.md](../04-gateway-protocol.md) — WebSocket RPC, `chat.send`, `chat.abort`
- [01-agent-loop.md](../01-agent-loop.md) — Vong lap xu ly cua agent
- [12-extended-thinking.md](../12-extended-thinking.md) — Extended Thinking
