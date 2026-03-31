# Cau Hinh LLM Providers

## Tong Quan

Provider la ket noi den mot LLM backend. GoClaw abstracts tat ca provider sau mot interface chung nen agent loop hoat dong nhu nhau bat ke backend. API key duoc ma hoa AES-256-GCM truoc khi luu.

**Route danh sach:** `/providers`
**Route chi tiet:** `/providers/:id`
**Quyen truy cap:** Admin

---

## Huong Dan

### Them Provider Moi

1. Vao **Settings > Providers > Tao Provider**
2. Dien cac truong:

| Truong | Mo Ta |
|--------|-------|
| Display Name | Ten hien thi trong UI |
| Provider Name | Slug duy nhat (vd: `my-openrouter`) |
| Provider Type | `openai_compat`, `anthropic`, `claude_cli`, `acp`, `chatgpt_oauth` |
| API Key | Duoc ma hoa AES-256-GCM khi luu |
| API Base URL | Chi can khi dung OpenAI-compat voi endpoint rieng |
| Enabled | Tat thi agent khong the dung provider nay |

3. Nhan **Tao** | **Huy**

### Kiem Tra Ket Noi

Trong dialog tao/sua agent, nhan **Check**:
- Xanh la: model hop le, ket noi thanh cong
- Do: loi xac thuc hoac model khong ton tai

### Chon Model Cho Agent

Sau khi chon provider, dropdown model tai danh sach tu `GET /v1/providers/{id}/models`. Co the chon tu danh sach hoac go ten thu cong (Combobox). Neu provider khong tra ve danh sach, go ten va dung **Check** de xac nhan.

### Sua va Xoa Provider

**Sua:** Vao `/providers/:id` — co the chinh sua Display Name, API Key, API Base URL, Enabled/Disabled, Settings nang cao.

> Luu y: Doi ten (`name`) lam mat ket noi cac agent dang dung provider do. Cap nhat agent truoc khi doi ten.

**Xoa:** Click icon xoa, nhap lai ten provider de xac nhan. Agent se fallback sang provider dau tien trong registry.

---

## Giao Dien (UI)

### Trang Danh Sach (`/providers`)

**Hien thi:** Danh sach phan trang co tim kiem. Hien thi so do phan cap pool cho ChatGPT OAuth va han muc OAuth.

**Thao tac:** Tao provider | Xoa provider | Xem chi tiet | Tim kiem | Lam moi

**Hop thoai Tao Provider:**
- Truong: Loai (anthropic_native, openai_compat, gemini_native, claude_cli, dashscope, openrouter, groq, deepseek, ollama, acp, ...), Ten, API Key, API Base, Cac truong OAuth
- Thao tac: **Tao** | **Huy**

### Trang Chi Tiet (`/providers/:id`)

**Hien thi:** Cac truong cau hinh, API key (an), cai dat model, cau hinh nhung va suy luan.

**Thao tac:** Chinh sua cau hinh | Xac minh API key | Xac minh model nhung | Duyet model kha dung | Dang nhap OAuth | Quan ly Codex Pool | Xoa provider

**Hop thoai Cai Dat Nang Cao:**
- Truong theo loai: URL API Base, binary path/args/TTL/perm-mode/work-dir (ACP), cau hinh CLI, cau hinh OAuth
- Thao tac: **Luu** | **Huy**

---

## Danh Sach Providers Ho Tro

### Core Providers

| Ten | Loai | Mo Ta |
|-----|------|-------|
| `anthropic` | Native HTTP+SSE | Claude models qua api.anthropic.com |
| `claude_cli` | stdio subprocess | Binary `claude` cuc bo |
| `codex` | OAuth Responses API | ChatGPT via chatgpt.com |
| `acp` | JSON-RPC 2.0 | Claude Code / Codex / Gemini CLI lam sub-agent |
| `dashscope` | OpenAI-compat | Alibaba Qwen3 models |

### OpenAI-Compatible Providers

| Ten | API Base |
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

Cho phep LLM sinh "reasoning tokens" noi bo truoc khi tra loi — cai thien chat luong voi task phuc tap nhung ton them token.

| Muc | Mo Ta |
|-----|-------|
| `off` | Tat thinking (mac dinh) |
| `low` | Suy nghi nhe, nhanh |
| `medium` | Can bang toc do va chat luong |
| `high` | Suy nghi sau nhat |

**Ho tro:** Anthropic (4K/10K/32K budget), OpenAI-compat GPT-5/Codex, DashScope Qwen3. Ollama/Groq/DeepSeek: khong ho tro.

**Cau hinh:** Tab Config cua agent > phan Thinking > Inherit hoac Custom. Expert Mode cho phep chon `reasoning_effort` chi tiet hon.

---

## Provider Pool (Nhieu Account Cung Loai)

Danh cho `chatgpt_oauth`: gop nhieu account vao mot pool de load balance.

| Strategy | Mo Ta |
|----------|-------|
| `primary_first` | Dung account chinh truoc, fallback khi loi |
| `round_robin` | Xoay vong deu giua tat ca account |
| `priority_order` | Drain theo thu tu cac account phu |

---

## Luu Y

- Provider tu config file bi override boi provider cung ten trong database
- Fallback: neu provider khong tim thay, dung provider dau tien trong registry
- Xoa provider khong xoa agent

---

## Xem Them

- [guide/vi/admin/02-channels-setup.md](02-channels-setup.md) — Cau hinh kenh ket noi
- [guide/vi/admin/05-bao-mat.md](05-bao-mat.md) — Ma hoa API keys
