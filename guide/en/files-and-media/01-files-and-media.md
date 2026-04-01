# Files and Media

## Overview

GoClaw supports uploading, analyzing, creating, and managing media files in chat. The agent processes files through specialized built-in tools for each format.

**Storage management route:** `/storage`
**Access:** Admin

---

## Usage Guide

### Upload Files in Chat

Two ways to send files to the agent:
- **Drag & drop** — drag files into the chat window
- **Click upload** — tap the file attachment button (clip icon) in the input bar

Files are attached to the message; the agent receives and processes them along with the text content.

### Supported Formats

| Type | Formats |
|------|---------|
| Image | JPEG, PNG, GIF, WebP, BMP, TIFF |
| Video | MP4, AVI, MOV, MKV, WebM |
| Audio | MP3, WAV, OGG, FLAC, AAC, M4A |
| Document | PDF, DOCX, XLSX, PPTX |
| Text / Code | TXT, MD, JSON, CSV, and other text files |

### Document Processing

The agent uses the `read_document` tool to analyze:
- **PDF** — extracts text page by page
- **DOCX** — reads Word content
- **XLSX / PPTX** — reads spreadsheet data / slides

The agent can summarize, answer questions, or extract specific information from documents.

> Note: `read_file` cannot read binary files. The agent automatically selects the correct tool based on the format.

### Image Analysis

The agent analyzes images via LLM vision:
- Detailed description of image content
- Text recognition in images (OCR)
- Chart and diagram analysis
- Comparison of multiple images

Simply send an image in chat and ask a question.

### Audio and Voice

**Voice message (STT):** When sending voice via Telegram / Discord, the system automatically:
1. Receives the audio file
2. Runs Speech-to-Text (STT)
3. Converts the result to text
4. The agent processes it like a regular message

**Upload audio file:** The agent extracts content via the `read_audio` tool.

### Image Generation

The agent creates images from text descriptions via the `create_image` tool.

Supported providers (in priority order):
1. OpenRouter (Gemini 2.5 Flash Image)
2. Gemini
3. OpenAI (DALL-E 3)
4. MiniMax
5. DashScope (Wan 2.6)

Example: *"Create an image of a cat sitting on a keyboard, anime style, blue background"*

### Text-to-Speech (TTS)

The agent converts text to speech via the `tts` tool.

| Provider | Notes |
|----------|-------|
| OpenAI | Multiple voices, high quality |
| ElevenLabs | Natural voices, supports voice cloning |
| Edge TTS | Microsoft Edge, free |
| MiniMax | Supports Vietnamese |

Example: *"Read this paragraph aloud in a female voice"*

### Video Generation

The agent creates short videos from text or images via the `create_video` tool.
Supported provider: MiniMax Video.

Example: *"Create a 5-second video: a beach at sunset, waves coming ashore"*

---

## Interface (UI) — Storage Page (`/storage`)

**Display:** File browser with an expandable directory tree (left) and a file content viewer (right). Total storage size is shown at the top.

**Actions:**
- **Browse directory tree** — lazy-loads subdirectories on expansion
- **View file content** — text is displayed in the viewer; images show a preview
- **Upload file** — dialog, uploads to the current directory
- **Download file** — download to your computer
- **Delete file/folder** — confirmation required (warning: all contents will be removed recursively, this action cannot be undone)
- **Move file** — drag and drop between directories
- **Refresh**

**Upload Dialog:**
- Drag-and-drop area for files, displays the current directory path
- Actions: **Upload** | **Cancel**

---

## Storage File Management

**Storage location:**
- Standard edition — `data/` on the server, separated by tenant
- Lite edition — `~/.goclaw/workspace/`

**Access files via API:**
```
GET /v1/files/{path}?ft={token}
```
Token is short-lived, ensuring only authorized users can view files.

**Limits:**

| Limit | Value |
|-------|-------|
| Max file size | 10 MB |
| Max files / workspace | 100 files |

**Files in team workspace:** Files created during tasks are automatically saved to the team workspace's `attachments/` directory and linked to the executing task.

---

## Notes

- The `read_file` tool only reads text files — use `read_document` for PDF/DOCX/XLSX/PPTX
- Files created by the agent (images, audio, video) are saved to the workspace and sent to the user
- Full storage management (`/storage`) is available to Admins only

---

## See Also

- [guide/en/teams/01-teams.md](../teams/01-teams.md) — Team workspace
- [guide/en/admin/03-tools-and-mcp.md](../admin/03-tools-and-mcp.md) — Full tools system
