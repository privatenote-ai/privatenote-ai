# Client-Side LLM Setup Guide

## Overview

**AI Assist** uses WebLLM in the browser (e.g. Qwen2.5-0.5B-Instruct, ~300MB). The Worker does **not** run server-side LLM inference and there is **no** OpenAI (or similar) API route for note content.

## Installation

### 1. Install WebLLM

```bash
npm install @mlc-ai/web-llm
```

### 2. Model configuration

Configured in `client/src/utils/clientLLM.ts` (model id, size hints, cache behavior).

## Architecture

```
User note (plaintext in memory only in browser)
  ↓
[AI Assist ON] → Local WebLLM in browser → Result stays on device until you save
  ↓
Encrypt in browser → Server stores ciphertext only
```

If the browser cannot run WebLLM, AI features surface an error—there is **no** server AI fallback.

## Behavior

1. **Try on-device** when `preferClientSide` / support checks pass.
2. **Otherwise** `enhanceNoteHybrid` throws `AiEnhanceError` (user sees unsupported-capability messaging).

## Privacy

- **On-device:** Note content for AI is processed locally; not sent to a hosted chat API as part of the app’s AI pipeline.
- **Downloads:** Model artifacts load from WebMLC/CDN endpoints; that is separate from uploading ciphertext.
- **No server LLM key** required in Wrangler for AI Assist.

## Files

- **`client/src/utils/clientLLM.ts`** — engine, load, cache, compatibility
- **`client/src/utils/aiEnhancement.ts`** — `enhanceNoteHybrid` (WebLLM-only)
- **`CreateNote.tsx`** — wires actions and progress UI

## Browser requirements

- WebGPU or WebAssembly (per WebMLC support)
- IndexedDB for cache
- Enough free storage (~300MB+ for weights)

## Troubleshooting

- **Model fails:** Check console, IndexedDB, and `navigator.storage.estimate()`.
- **Slow first run:** One-time large download; later loads use cache.
- **No AI in browser X:** Expected if unsupported; there is no server AI fallback.

## References

- [WebLLM](https://webllm.mlc.ai/)
- [Qwen2.5-0.5B MLC build](https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC)
