# Client-Side LLM Testing Guide

This guide explains how to test the private/client-side LLM functionality in your application.

## Quick Test Steps

### 1. **Browser Console Test**

Open your browser's developer console (F12) and run:

```javascript
// Check if WebLLM is supported
import { isWebLLMSupported, getAiCapabilities } from './utils/aiEnhancement';
const caps = getAiCapabilities();
console.log('Client-side LLM supported:', caps.clientSideSupported);
console.log('Model info:', caps.modelInfo);

// Test initialization
import { initializeClientLLM, enhanceNoteClientSide } from './utils/clientLLM';
const engine = await initializeClientLLM((progress) => {
  console.log(`Loading: ${progress.progress}% - ${progress.text}`);
});
console.log('Engine loaded:', engine);

// Test enhancement
const result = await enhanceNoteClientSide(
  "This is a test note that needs improvement.",
  "improve"
);
console.log('Enhanced:', result);
```

### 2. **UI Testing (CreateNote Component)**

1. **Navigate to Create Note page**
   - Go to `/create` or click "Create Note" in the UI

2. **Enable AI Mode**
   - Toggle "AI Mode" switch ON
   - You should see AI verification panel (if required)

3. **Test AI Features**

   **a) Improve Text:**
   - Type some text in the note editor
   - Click "Improve" button
   - **Expected:** 
     - Progress indicator shows "Loading AI model..." (first time)
     - Progress shows model download/loading progress
     - Text gets improved without server request
     - Check browser console for `[AI]` logs showing client-side processing

   **b) Summarize:**
   - Type a longer text
   - Click "Summarize" button
   - **Expected:** Summary generated locally

   **c) Privacy Check:**
   - Type text with PII (e.g., "Contact John at john@example.com or call 555-1234")
   - Click "Privacy Check" or use "Privacy Check" template
   - **Expected:** PII removed locally

   **d) AI Generate:**
   - Use a template like "Ask AI Anything"
   - Enter a prompt
   - Click "Generate"
   - **Expected:** Content generated locally

### 3. **Verify Client-Side Processing**

#### Check Browser Console
Look for these log messages:
```
[AI] Client-side LLM supported: true
[AI] Loading model: X%
[AI] Processing with local AI...
```

#### Check Network Tab
- **Client-side:** NO requests to `/api/ai/enhance` endpoint
- **Server-side fallback:** You'll see POST requests to `/api/ai/enhance`

#### Check IndexedDB
1. Open DevTools → Application → IndexedDB
2. Look for `webllm_model_cache_v1` or similar
3. You should see model weights cached (~300MB)

### 4. **Test Privacy Warning**

1. **Disable client-side preference:**
   - In browser console: `localStorage.setItem('preferClientSideAI', 'false')`
   - Or toggle the preference in UI (if available)

2. **Try AI feature:**
   - Should show privacy warning dialog
   - Warning should mention "OpenAI" and "third-party service"

3. **Enable client-side:**
   - `localStorage.setItem('preferClientSideAI', 'true')`
   - Try AI feature again
   - Should NOT show privacy warning (runs locally)

### 5. **Test Fallback Behavior**

#### Simulate Client-Side Failure:
1. Open browser console
2. Run: `localStorage.setItem('preferClientSideAI', 'true')`
3. Disable WebGPU/WebAssembly (if possible) or block IndexedDB
4. Try AI feature
5. **Expected:** Falls back to server-side with privacy warning

#### Test Storage Quota:
1. Fill up browser storage (use DevTools → Application → Storage)
2. Try to use client-side LLM
3. **Expected:** Error message about insufficient storage, falls back to server

## Testing Checklist

- [ ] Client-side LLM initializes successfully
- [ ] Model downloads and caches in IndexedDB
- [ ] Progress indicator shows during model loading
- [ ] "Improve" works client-side
- [ ] "Summarize" works client-side
- [ ] "Privacy Check" works client-side
- [ ] "AI Generate" works client-side
- [ ] No network requests when using client-side
- [ ] Privacy warning shows for server-side fallback
- [ ] Privacy warning does NOT show for client-side
- [ ] Fallback to server works when client-side fails
- [ ] Error messages are user-friendly

## Debugging Tips

### Check Model Loading:
```javascript
import { isEngineLoaded, getEngine } from './utils/clientLLM';
console.log('Engine loaded:', isEngineLoaded());
if (isEngineLoaded()) {
  const engine = getEngine();
  console.log('Engine:', engine);
}
```

### Monitor Progress:
```javascript
import { initializeClientLLM } from './utils/clientLLM';
await initializeClientLLM((progress) => {
  console.log(`Progress: ${progress.progress}%`, progress.text);
});
```

### Test Hybrid Function:
```javascript
import { enhanceNoteHybrid } from './utils/aiEnhancement';
const result = await enhanceNoteHybrid(
  "Test text",
  "improve",
  {
    preferClientSide: true,
    onProgress: (p) => console.log(p)
  }
);
console.log('Result:', result.content);
console.log('Source:', result.source); // Should be "client"
```

### Clear Model Cache:
```javascript
// Clear IndexedDB cache
indexedDB.deleteDatabase('webllm_model_cache_v1');
// Or clear all WebLLM data
indexedDB.databases().then(dbs => {
  dbs.forEach(db => {
    if (db.name.includes('webllm')) {
      indexedDB.deleteDatabase(db.name);
    }
  });
});
```

## Expected Behavior

### First Time Use:
1. User clicks AI feature
2. Progress shows "Loading AI model..."
3. Model downloads (~300MB) - takes 30-60 seconds on fast connection
4. Progress updates: "Downloading weights", "Compiling kernels", etc.
5. Model loads into memory
6. AI processing happens locally
7. Result appears in editor

### Subsequent Uses:
1. User clicks AI feature
2. Model loads from cache (much faster, ~5-10 seconds)
3. AI processing happens locally
4. Result appears in editor

### Privacy:
- ✅ Client-side: No data leaves browser
- ⚠️ Server-side: Shows privacy warning, data sent to OpenAI

## Troubleshooting

### Model Won't Load:
- Check browser console for errors
- Verify WebGPU/WebAssembly support
- Check available storage space (need ~450MB free)
- Try clearing cache and reloading

### Slow Performance:
- First load downloads ~300MB model
- Subsequent loads use cached model
- Processing speed depends on device CPU/GPU

### Privacy Warning Shows Unexpectedly:
- Check `preferClientSideAI` preference
- Verify `isWebLLMSupported()` returns true
- Check browser console for client-side errors

## Performance Benchmarks

Expected performance on modern devices:
- **Model Download:** 30-60 seconds (first time, fast connection)
- **Model Load from Cache:** 5-10 seconds
- **Text Improvement:** 2-5 seconds (depends on length)
- **Summarization:** 3-8 seconds
- **Privacy Check:** 2-5 seconds
