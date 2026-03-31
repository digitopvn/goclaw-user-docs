# GoClaw Docs — Unified Structure

## Analysis

### /routes/ (42 files, 1005 lines)
- Per UI page: "trang X hien thi gi, thao tac gi"
- Nong (11-41 lines/file), listing style
- Tot cho: quick reference, sitemap
- Thieu: concept explanation, step-by-step, examples, troubleshooting

### /vi/ (19 files, 3738 lines)
- Per topic: "lam sao de...", giai thich concept
- Sau (68-230 lines/file), tutorial style
- Tot cho: learning, onboarding
- Thieu: UI-specific details, per-page navigation

## Merged Strategy

Ket hop noi dung /vi/ (depth) + /routes/ (UI details) thanh 1 structure cho docs website.

### Principles
1. User journey first — bat dau tu "toi la ai" → "toi can lam gi"
2. Moi page = 1 URL tren docs site
3. Sidebar navigation = folder structure
4. Moi file co: mo ta → step-by-step → UI screenshots placeholder → tips/troubleshooting
5. Routes info embed vao guide pages (khong tach rieng)

## Final Structure

```
guide/
├── vi/                              # Vietnamese
│   ├── getting-started/
│   │   ├── 01-gioi-thieu.md         ← /vi/01 merged
│   │   ├── 02-cai-dat.md            ← /vi/02 merged
│   │   ├── 03-dang-nhap.md          ← /routes/01-login + 02-select-tenant
│   │   └── 04-setup-wizard.md       ← /routes/03-setup + 04-overview
│   │
│   ├── chat-and-sessions/
│   │   ├── 01-chat-co-ban.md        ← /vi/10 + /routes/05-chat
│   │   ├── 02-quan-ly-sessions.md   ← /routes/11-sessions + 12-session-detail
│   │   └── 03-kenh-ket-noi.md       ← /vi/11 + /routes/15-channels
│   │
│   ├── agents/
│   │   ├── 01-tong-quan-agents.md   ← /vi/12 (concepts) + /routes/06-agents
│   │   ├── 02-cau-hinh-agent.md     ← /vi/20 + /routes/07-agent-detail
│   │   ├── 03-skills.md             ← /vi/12 (skills section) + /routes/18-19
│   │   └── 04-codex-pool.md         ← /routes/08-agent-codex-pool
│   │
│   ├── teams/
│   │   ├── 01-doi-nhom.md           ← /vi/13 + /routes/09-10
│   │   └── 02-contacts.md           ← /routes/14-contacts
│   │
│   ├── files-and-media/
│   │   └── 01-file-va-media.md      ← /vi/14 + /routes/27-storage
│   │
│   ├── admin/
│   │   ├── 01-providers.md          ← /vi/21 + /routes/35-36
│   │   ├── 02-channels-setup.md     ← /vi/22 + /routes/15-16
│   │   ├── 03-tools-va-mcp.md       ← /vi/23 + /routes/20-21
│   │   ├── 04-cron.md               ← /vi/24 + /routes/23-24
│   │   ├── 05-bao-mat.md            ← /vi/25 + /routes/38 (api-keys) + 41 (approvals)
│   │   ├── 06-theo-doi.md           ← /vi/26 + /routes/28-32 (traces,events,activity,logs)
│   │   ├── 07-sao-luu.md            ← /vi/27 + /routes/42
│   │   ├── 08-tts.md                ← /routes/22-tts
│   │   ├── 09-memory-kg.md          ← /routes/25-memory + 26-kg
│   │   ├── 10-config.md             ← /routes/40-config
│   │   ├── 11-tenants.md            ← /routes/33-34 (multi-tenant)
│   │   ├── 12-nodes.md              ← /routes/17-nodes
│   │   └── 13-pending-messages.md   ← /routes/13
│   │
│   ├── reference/
│   │   ├── 01-api-reference.md      ← /vi/30
│   │   ├── 02-websocket-rpc.md      ← /vi/31
│   │   ├── 03-cau-hinh.md           ← /vi/32
│   │   └── 04-desktop-lite.md       ← /vi/33
│   │
│   └── en/                          # English (future)
│       └── ...                      # Same structure
│
└── STRUCTURE.md                     # This file
```

## Benefits

| Aspect | Old (/routes/ + /vi/) | New (guide/) |
|--------|----------------------|--------------|
| Files | 61 files, 2 systems | ~30 files, 1 system |
| Navigation | Confusing: which to read? | Clear sidebar sections |
| Content | Shallow OR deep | Both merged per page |
| Website ready | No (flat lists) | Yes (folder = sidebar group) |
| i18n | Inconsistent | guide/vi/ + guide/en/ |
| Duplication | Some overlap | Zero — merged content |

## Page Template

Each guide page should follow:

```markdown
# Page Title

Brief description (1-2 sentences).

## Tong quan
What and why.

## Huong dan
Step-by-step with numbered steps.

## Giao dien (UI)
What you see on screen. Screenshot placeholders: `![Description](../assets/screenshot.png)`
Route: `/path/on/web-ui`
Key actions available on this page.

## Vi du
Practical examples.

## Luu y / Troubleshooting
Common issues and solutions.

## Xem them
Links to related pages.
```

## Migration Plan

Phase 1: Create guide/vi/ folder structure
Phase 2: Merge /vi/ content (deep) + /routes/ content (UI details) per file
Phase 3: Add screenshot placeholders
Phase 4: Delete old /vi/ and /routes/ folders
Phase 5: Update README.md index
Phase 6: Create guide/en/ (translate)
