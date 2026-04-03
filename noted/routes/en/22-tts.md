# TTS (Text-to-Speech)

**Route:** `/tts`
**Access:** Cross-tenant (Owner)

## What It Shows
TTS configuration page with a status card, general settings, and provider-specific settings cards.

## Actions
- **Select primary provider** — none / openai / elevenlabs / edge / minimax
- **Set auto-apply mode** — off / always / inbound / tagged
- **Set reply mode** — final / all
- **Configure max text length** — character limit
- **Configure timeout** — seconds
- **Configure provider settings** — API key, model, voice (per provider)
- **Save all changes**
- **Refresh**

## Sub-features
- Status card showing current TTS state
- Provider-specific settings cards (only shown when relevant provider is selected)
