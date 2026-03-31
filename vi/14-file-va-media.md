# 14 - File va Media

## 1. Upload file trong chat

Co hai cach gui file cho agent:

- **Keo tha (drag & drop)** — keo file vao cua so chat
- **Click upload** — bam nut dinh kem (clip icon) trong thanh nhap lieu

File duoc dinh kem vao tin nhan, agent se nhan va xu ly cung voi noi dung text.

---

## 2. Dinh dang ho tro

| Loai | Dinh dang |
|------|-----------|
| Hinh anh | JPEG, PNG, GIF, WebP, BMP, TIFF |
| Video | MP4, AVI, MOV, MKV, WebM |
| Audio | MP3, WAV, OGG, FLAC, AAC, M4A |
| Document | PDF, DOCX, XLSX, PPTX |
| Text / Code | TXT, MD, JSON, CSV, va cac file text khac |

---

## 3. Xu ly document

Khi nhan file document (PDF, DOCX, v.v.), agent su dung tool `read_document` de doc va phan tich noi dung:

- **PDF** — trich xuat text tu tung trang
- **DOCX** — doc noi dung Word
- **XLSX / PPTX** — doc du lieu bang tinh / slide

Agent co the:
- Tom tat noi dung
- Tra loi cau hoi dua tren tai lieu
- Trich xuat thong tin cu the

> Luu y: `read_file` khong doc duoc file binary. Agent tu dong chon dung tool phu hop theo dinh dang.

---

## 4. Phan tich hinh anh (Image Analysis)

Agent co the mo ta va phan tich hinh anh thong qua **vision** cua LLM:

- Mo ta chi tiet noi dung hinh
- Nhan dien van ban trong anh (OCR)
- Phan tich bieu do, so do
- So sanh nhieu hinh

Chi can gui hinh anh vao chat va dat cau hoi, agent se phan tich truc tiep.

---

## 5. Audio / Voice

### Voice message (STT)

Khi gui voice message qua Telegram hoac Discord, he thong tu dong:
1. Nhan file audio
2. Chay Speech-to-Text (STT)
3. Chuyen ket qua thanh text
4. Agent xu ly text nhu tin nhan thuong

### Upload file audio

Upload file audio truc tiep (.mp3, .wav, v.v.) — agent co the trich xuat noi dung qua `read_audio` tool.

---

## 6. Tao hinh anh (Image Generation)

Agent co the tao hinh anh tu mo ta text qua tool `create_image`.

**Providers ho tro** (theo thu tu uu tien):
1. OpenRouter (Gemini 2.5 Flash Image)
2. Gemini
3. OpenAI (DALL-E 3)
4. MiniMax
5. DashScope (Wan 2.6)

**Cach dung:**

> "Tao hinh anh mot chu meo ngoi tren ban phim, phong cach anime, nen mau xanh"

Agent goi `create_image` voi prompt, tra ve duong dan file anh. File duoc luu vao workspace va gui toi user.

---

## 7. Text-to-Speech (TTS)

Agent chuyen doi text thanh giong noi qua tool `tts`.

**Providers ho tro:**

| Provider | Ghi chu |
|----------|---------|
| OpenAI | Nhieu giong, chat luong cao |
| ElevenLabs | Giong tu nhien, ho tro clone giong |
| Edge TTS | Microsoft Edge, mien phi |
| MiniMax | Ho tro tieng Viet |

**Cach dung:**

> "Doc to doan van nay bang giong nu"

Agent goi `tts` voi text va tuy chon voice/provider, tra ve file audio (.mp3). File duoc gui toi user.

---

## 8. Tao video

Agent co the tao video ngan tu text hoac hinh anh qua tool `create_video`.

**Providers ho tro:**
- MiniMax Video

**Cach dung:**

> "Tao video 5 giay: mot bai bien lua hoang hon, song vao bo"

Agent tra ve duong dan file video sau khi tao xong.

---

## 9. Quan ly file da upload (File Storage)

File sinh ra tu agent (hinh anh, audio, video) duoc luu vao **workspace**:

- **Standard edition** — luu trong `data/` cua server, phan tach theo tenant
- **Lite edition** — luu trong `~/.goclaw/workspace/`

### Truy cap file

File co the truy cap qua HTTP API:

```
GET /v1/files/{path}?ft={token}
```

Token co thoi han ngan (short-lived), dam bao chi nguoi co quyen moi xem duoc file.

### Gioi han

| Gioi han | Gia tri |
|---------|--------|
| Kich thuoc file toi da | 10 MB |
| So file toi da / workspace | 100 file |

### File trong team workspace

Khi agent tao file trong khi lam task, file duoc:
- Tu dong luu vao `attachments/` cua team workspace
- Gan ket voi task dang thuc thi
- Hien thi tren trang chi tiet task trong Web UI

---

## Xem them

- [03-tools-system.md](../03-tools-system.md) — He thong tool day du
- [11-agent-teams.md](../11-agent-teams.md) — Team workspace
- [13-doi-nhom-teams.md](./13-doi-nhom-teams.md) — Huong dan doi nhom (tieng Viet)
