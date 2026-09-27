# Client-Side LLM Testing Guide

How to test **on-device** AI (WebLLM). There is **no** server `/api/ai/enhance` fallback.

## Quick tests

### 1. Browser console

Open DevTools and (from app context / bundled modules) verify support and run a small enhancement if you have dev imports available, or rely on UI tests below.

Typical logs reference client-side loading and processing.

### 2. UI (`CreateNote`)

1. Open **Create Note** (`/create`).
2. Enable **AI** / AI Assist if the UI requires it.
3. **Improve / Summarize / Simplify / Generate:** expect progress while the model loads the first time, then a local result.
4. **Network:** you should **not** see `POST …/api/ai/enhance` (removed). You may see fetches for **model weights** / WebLLM assets (CDN), which is expected.

### 3. IndexedDB

DevTools → Application → IndexedDB: WebLLM-related DBs show cached weights (~300MB order of magnitude).

### 4. Unsupported browser / forced failure

- Use a browser without usable WebGPU/WASM for WebLLM, or block storage.
- **Expected:** AI action fails with an on-device / capability message, **not** a server AI response.

## Checklist

- [ ] Model loads or shows a clear error if unsupported
- [ ] Progress UI during first download/load
- [ ] Improve / summarize / generate work when supported
- [ ] No `/api/ai/enhance` requests
- [ ] Cached runs faster after first success

## Debugging

### Engine state

Use helpers from `client/src/utils/clientLLM.ts` (e.g. `isEngineLoaded`, `initializeClientLLM`) in dev to inspect load state.

### Hybrid entry point

```typescript
import { enhanceNoteHybrid } from "./utils/aiEnhancement";

const result = await enhanceNoteHybrid("Test text", "improve", {
  preferClientSide: true,
  onProgress: (p) => console.log(p),
});
console.log(result.source); // "client"
```

### Clear cache

```javascript
indexedDB.databases().then((dbs) => {
  dbs.forEach((db) => {
    if (db.name && db.name.includes("webllm")) {
      indexedDB.deleteDatabase(db.name);
    }
  });
});
```

## Expected behavior

- **First use:** Download/compile delay, then local inference.
- **Later use:** Load from cache, faster.
- **Privacy:** Note text for AI is processed in-browser; app does not send that plaintext to a Worker LLM endpoint.

## Troubleshooting

- **Won’t load:** Console errors, storage full, or unsupported browser.
- **Slow:** First-time model cost; device CPU/GPU limits.
- **“Not supported”:** No server fallback—improve browser or disable AI.

## Performance (rough)

- First download: tens of seconds on a fast link (large artifact).
- Load from cache: seconds.
- Inference: a few seconds depending on length and device.
