# Text-to-Speech Configuration

**Route:** `/tts`
**Sidebar Group:** Capabilities
**Access:** Owner (Cross-tenant)

---

## Overview

TTS (Text-to-Speech) allows GoClaw to read agent responses aloud using synthesized voice. The system supports multiple providers and can be configured to automatically play audio based on conditions.

---

## Configuration Guide

### 1. Select the Primary Provider

Go to `/tts` and select a provider from the list:

- **None (Disabled)** — disable TTS
- **OpenAI** — use OpenAI TTS API
- **ElevenLabs** — use ElevenLabs API (high-quality voices)
- **Edge (Free)** — use Microsoft Edge TTS (free, no API key required)
- **MiniMax** — use MiniMax TTS API

### 2. Configure Auto-Apply Mode

| Value | Description |
|-------|-------------|
| `off` | Agent can use TTS tool manually |
| `always` | All replies get audio |
| `inbound` | Only when user sends voice/audio |
| `tagged` | Only when reply contains special tag |

### 3. Reply Mode

- **Final only** — only play audio for the final complete response
- **All** — play audio for all turns in the conversation

### 4. Limits and Timeout

- **Max Text Length** — maximum text length before truncation (default: 1500 characters)
- **Timeout (ms)** — maximum wait time for API call (default: 30000 ms)

### 5. Per-Provider Settings

Each provider has its own parameters:

**OpenAI TTS**
- API Key (from env `OPENAI_API_KEY`)
- Model: default `gpt-4o-mini-tts`
- Voice: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

**ElevenLabs**
- API Key (from env `ELEVENLABS_API_KEY`)
- Voice ID: default `pMsXgVXv3BLzUgSXRplE`
- Model ID: default `eleven_multilingual_v2`

**Edge TTS**
- Enabled toggle
- Voice: default `en-US-MichelleNeural`
- Speech Rate: reading speed (e.g., `+10%`, `-20%`)

**MiniMax**
- API Key + Group ID
- Model: default `speech-02-hd`
- Voice ID: select a voice

---

## User Interface (UI)

The TTS configuration page includes:

- **Status card** — displays the active provider and connection status
- **General Settings** — primary provider, auto-apply mode, reply mode, max text length, timeout
- **Per-provider settings cards** — each provider has a dedicated card with corresponding fields
- **Save button** — save all settings
- **Refresh button** — reload from server

---

## Example

Configure TTS using Edge TTS (free), auto-play for inbound messages:

```json5
{
  tts: {
    provider: "edge",
    auto: "inbound",
    mode: "final",
    max_length: 1500,
    timeout_ms: 30000,
    edge: {
      enabled: true,
      voice: "vi-VN-HoaiMyNeural",  // Vietnamese voice
      rate: "+0%"
    }
  }
}
```

---

## Notes

- TTS provider API keys are not stored in `config.json` — use environment variables or `.env.local`
- Edge TTS does not require an API key but depends on internet connectivity
- `auto: "tagged"` requires the agent to return a special tag in its response — check the corresponding agent documentation
- When `mode: "all"`, the number of API calls increases significantly — monitor costs with OpenAI/ElevenLabs

---

## See Also

- [Configuration Reference — TTS section](../reference/03-configuration.md#7-section-tts)
- [Provider Configuration](../admin/01-providers.md)
