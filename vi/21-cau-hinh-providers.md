# Cau hinh Providers

## 1. Provider la gi

Provider la ket noi den mot LLM backend. GoClaw abstracts tat ca provider sau mot interface chung (`Chat` / `ChatStream`), nen agent loop hoat dong nhu nhau bat ke backend nao dang duoc su dung.

Provider duoc luu trong bang `llm_providers` (PostgreSQL). API key duoc ma hoa AES-256-GCM truoc khi luu. Provider tu config file se bi override boi provider cung ten trong database.

---

## 2. Danh sach Providers

### Core Providers

| Ten | Loai | Mo ta |
|-----|------|-------|
| `anthropic` | Native HTTP+SSE | Claude models qua api.anthropic.com |
| `claude_cli` | stdio subprocess | Binary `claude` cuc bo, quan ly session rieng |
| `codex` | OAuth Responses API | ChatGPT via chatgpt.com/backend-api |
| `acp` | JSON-RPC 2.0 | Claude Code / Codex / Gemini CLI lam sub-agent |
| `dashscope` | OpenAI-compat | Alibaba Qwen3 models |

### OpenAI-Compatible Providers

| Ten | API Base | Model mac dinh |
|-----|----------|----------------|
| `openai` | api.openai.com/v1 | gpt-4o |
| `openrouter` | openrouter.ai/api/v1 | anthropic/claude-sonnet-4-5-20250929 |
| `groq` | api.groq.com/openai/v1 | llama-3.3-70b-versatile |
| `deepseek` | api.deepseek.com/v1 | deepseek-chat |
| `gemini` | generativelanguage.googleapis.com/v1beta/openai | gemini-2.0-flash |
| `mistral` | api.mistral.ai/v1 | mistral-large-latest |
| `xai` | api.x.ai/v1 | grok-3-mini |
| `minimax` | api.minimax.io/v1 | MiniMax-M2.5 |
| `cohere` | api.cohere.ai/compatibility/v1 | command-a |
| `perplexity` | api.perplexity.ai | sonar-pro |
| `ollama` | localhost:11434/v1 | llama3.3 (local) |
| `bailian` | coding-intl.dashscope.aliyuncs.com/v1 | qwen3.5-plus |
| `zai` | api.z.ai/api/paas/v4 | glm-5 |

---

## 3. Them Provider

Click **Add Provider** tren trang Providers.

| Truong | Mo ta |
|--------|-------|
| Display Name | Ten hien thi trong UI |
| Provider Name | Slug duy nhat (vd: `my-openrouter`) |
| Provider Type | Loai ket noi: `openai_compat`, `anthropic`, `claude_cli`, `acp`, `chatgpt_oauth` |
| API Key | Key xac thuc — duoc ma hoa AES-256-GCM khi luu |
| API Base URL | URL tuy chinh (chi can khi dung OpenAI-compat voi endpoint rieng) |
| Enabled | Bat/tat provider. Tat thi agent khong the dung provider nay. |

Sau khi dien, click **Save**. Provider xuat hien trong danh sach va co the duoc chon khi tao agent.

### Kiem tra ket noi (Verify)

Trong dialog tao/sua agent, nut **Check** se gui mot request nho den provider voi model da chon. Ket qua:
- Xanh la: model hop le, ket noi thanh cong
- Do: loi xac thuc hoac model khong ton tai

---

## 4. Chon Model cho Agent

Sau khi chon provider, dropdown model se tai danh sach tu `GET /v1/providers/{id}/models`.

- Co the chon tu danh sach hoac go ten model truc tiep (Combobox)
- Neu provider khong tra ve danh sach model, go ten thu cong va dung **Check** de xac nhan
- **Fallback**: Neu provider khong tim thay, he thong dung provider dau tien trong registry lam fallback

---

## 5. Extended Thinking (Che do suy nghi sau)

Extended Thinking cho phep LLM sinh "reasoning tokens" noi bo truoc khi tra loi — cai thien chat luong voi cac task phuc tap, nhung ton them token va tang latency.

### Cac muc thinking

| Muc | Mo ta |
|-----|-------|
| `off` | Tat thinking (mac dinh) |
| `low` | Suy nghi nhe, nhanh |
| `medium` | Can bang giua toc do va chat luong |
| `high` | Suy nghi sau nhat, dung cho task phuc tap |

### Hỗ tro theo provider

| Provider | Ho tro | Budget Tokens (low/medium/high) | Ghi chu |
|----------|--------|----------------------------------|---------|
| Anthropic | Co | 4K / 10K / 32K | Strip temperature; can anthropic-beta header |
| OpenAI-compat (GPT-5/Codex) | Co | Theo `reasoning_effort` | Capability-aware |
| DashScope (Qwen3) | Co (mot so model) | 4K / 16K / 32K | Khong stream khi co tools |
| Ollama / Groq / DeepSeek | Khong | — | Request gui binh thuong |

### Cau hinh trong Web UI

Vao tab **Config** cua agent, phan **Thinking**:

1. **Inherit** — ke thua default tu provider (`settings.reasoning_defaults`)
2. **Custom** — dat muc rieng cho agent nay

**Expert Mode** (khi provider ho tro): chon `reasoning_effort` chi tiet hon (`auto`, `minimal`, `xhigh`, v.v.) va fallback behavior (`downgrade`, `off`, `provider_default`).

---

## 6. Provider Quotas

GoClaw theo doi han muc su dung cho cac provider ChatGPT OAuth (`chatgpt_oauth`). Tren trang Providers:

- Badge xanh: so provider da dang nhap thanh cong
- Quota bar: hien thi so request con lai (per hour/day/week)
- Provider chua dang nhap hien thi trang thai `needs_sign_in`

Gioi han request duoc dat qua **Config > Quotas** trong tenant settings. Co the gioi han per-agent qua Tool Policy trong tab Permissions.

---

## 7. Provider Pool (Nhieu account cung loai)

Danh cho `chatgpt_oauth`: co the them nhieu account va gop chung vao mot **pool** de load balance.

**Cau hinh pool tren provider chinh (owner)**:
```json
{
  "settings": {
    "codex_pool": {
      "strategy": "round_robin",
      "extra_provider_names": ["codex-work", "codex-personal"]
    }
  }
}
```

| Strategy | Mo ta |
|----------|-------|
| `primary_first` | Luon dung account chinh truoc, fallback sang account phu khi loi |
| `round_robin` | Xoay vong deu giua tat ca account trong pool |
| `priority_order` | Thu account chinh truoc, roi drain theo thu tu cac account phu |

Agent co the override pool behavior qua `other_config.reasoning.override_mode`:
- `inherit` — theo pool cua provider
- `custom` — dat pool/strategy rieng cho agent nay

De xem hoat dong pool: `GET /v1/agents/{id}/codex-pool-activity`.

---

## 8. Xoa va Sua Provider

### Sua provider

Click vao provider trong danh sach de vao **Provider Detail**. Co the chinh sua:
- Display Name, API Key, API Base URL
- Enabled/Disabled
- Settings nang cao (reasoning defaults, pool config) qua **Advanced** dialog

Luu y: doi ten (`name`) cua provider se lam mat ket noi cac agent dang dung provider do. Hay cap nhat agent truoc khi doi ten.

### Xoa provider

Click icon xoa tren hang provider trong danh sach. He thong yeu cau xac nhan bang cach go lai ten provider. Xoa provider khong xoa agent — agent se fallback sang provider dau tien trong registry.
