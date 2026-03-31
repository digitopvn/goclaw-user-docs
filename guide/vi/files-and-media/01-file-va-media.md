# File va Media

## Tong Quan

GoClaw ho tro upload, phan tich, tao va quan ly file media trong chat. Agent xu ly file thong qua cac built-in tools chuyen biet theo tung dinh dang.

**Route quan ly luu tru:** `/storage`
**Quyen truy cap:** Admin

---

## Huong Dan Su Dung

### Upload File Trong Chat

Hai cach gui file cho agent:
- **Keo tha (drag & drop)** — keo file vao cua so chat
- **Click upload** — bam nut dinh kem (clip icon) trong thanh nhap lieu

File duoc dinh kem vao tin nhan, agent nhan va xu ly cung voi noi dung text.

### Dinh Dang Ho Tro

| Loai | Dinh Dang |
|------|-----------|
| Hinh anh | JPEG, PNG, GIF, WebP, BMP, TIFF |
| Video | MP4, AVI, MOV, MKV, WebM |
| Audio | MP3, WAV, OGG, FLAC, AAC, M4A |
| Document | PDF, DOCX, XLSX, PPTX |
| Text / Code | TXT, MD, JSON, CSV, va cac file text khac |

### Xu Ly Document

Agent dung tool `read_document` de phan tich:
- **PDF** — trich xuat text tung trang
- **DOCX** — doc noi dung Word
- **XLSX / PPTX** — doc du lieu bang tinh / slide

Agent co the tom tat, tra loi cau hoi, hoac trich xuat thong tin cu the tu tai lieu.

> Luu y: `read_file` khong doc duoc file binary. Agent tu dong chon dung tool theo dinh dang.

### Phan Tich Hinh Anh

Agent phan tich hinh anh qua vision cua LLM:
- Mo ta chi tiet noi dung hinh
- Nhan dien van ban trong anh (OCR)
- Phan tich bieu do, so do
- So sanh nhieu hinh

Chi can gui hinh vao chat va dat cau hoi.

### Audio va Voice

**Voice message (STT):** Khi gui voice qua Telegram / Discord, he thong tu dong:
1. Nhan file audio
2. Chay Speech-to-Text (STT)
3. Chuyen ket qua thanh text
4. Agent xu ly nhu tin nhan thuong

**Upload file audio:** Agent trich xuat noi dung qua tool `read_audio`.

### Tao Hinh Anh

Agent tao hinh tu mo ta text qua tool `create_image`.

Providers ho tro (theo thu tu uu tien):
1. OpenRouter (Gemini 2.5 Flash Image)
2. Gemini
3. OpenAI (DALL-E 3)
4. MiniMax
5. DashScope (Wan 2.6)

Vi du: *"Tao hinh anh mot chu meo ngoi tren ban phim, phong cach anime, nen mau xanh"*

### Text-to-Speech (TTS)

Agent chuyen doi text thanh giong noi qua tool `tts`.

| Provider | Ghi Chu |
|----------|---------|
| OpenAI | Nhieu giong, chat luong cao |
| ElevenLabs | Giong tu nhien, ho tro clone giong |
| Edge TTS | Microsoft Edge, mien phi |
| MiniMax | Ho tro tieng Viet |

Vi du: *"Doc to doan van nay bang giong nu"*

### Tao Video

Agent tao video ngan tu text hoac hinh anh qua tool `create_video`.
Provider ho tro: MiniMax Video.

Vi du: *"Tao video 5 giay: mot bai bien lua hoang hon, song vao bo"*

---

## Giao Dien (UI) — Trang Luu Tru (`/storage`)

**Hien thi:** Trinh duyet file voi cay thu muc mo rong duoc (trai) va trinh xem noi dung file (phai). Hien thi tong dung luong o tren cung.

**Thao tac:**
- **Duyet cay thu muc** — tai lazy cac thu muc con khi mo rong
- **Xem noi dung file** — van ban hien thi trong trinh xem; anh hien thi xem truoc
- **Tai len file** — hop thoai, tai vao thu muc hien tai
- **Tai xuong file** — tai ve may tinh
- **Xoa file/thu muc** — xac nhan (canh bao: toan bo noi dung se bi xoa, khong the hoan tac)
- **Di chuyen file** — keo tha giua cac thu muc
- **Lam moi**

**Hop thoai Tai Len:**
- Vung keo tha file, hien thi duong dan thu muc hien tai
- Thao tac: **Tai len** | **Huy**

---

## Quan Ly File Luu Tru

**Vi tri luu tru:**
- Standard edition — `data/` tren server, phan tach theo tenant
- Lite edition — `~/.goclaw/workspace/`

**Truy cap file qua API:**
```
GET /v1/files/{path}?ft={token}
```
Token co thoi han ngan, dam bao chi nguoi co quyen moi xem duoc.

**Gioi han:**

| Gioi Han | Gia Tri |
|---------|--------|
| Kich thuoc file toi da | 10 MB |
| So file toi da / workspace | 100 file |

**File trong team workspace:** File tao ra khi lam task duoc tu dong luu vao `attachments/` cua team workspace va gan voi task dang thuc thi.

---

## Luu Y

- Tool `read_file` chi doc file text — dung `read_document` cho PDF/DOCX/XLSX/PPTX
- File duoc tao ra boi agent (anh, audio, video) luu vao workspace va gui toi user
- Quan ly luu tru toan bo (`/storage`) chi danh cho Admin

---

## Xem Them

- [guide/vi/teams/01-doi-nhom.md](../teams/01-doi-nhom.md) — Team workspace
- [guide/vi/admin/03-tools-va-mcp.md](../admin/03-tools-va-mcp.md) — He thong tools day du
