# Client-Side LLM Setup Guide

## Overview

This implementation adds **mobile-first client-side AI** using WebLLM with Qwen2.5-0.5B-Instruct (~300MB), providing true end-to-end encryption for AI features.

## Installation

### 1. Install WebLLM Package

```bash
npm install @mlc-ai/web-llm
```

### 2. Model Configuration

The model is configured in `client/src/utils/clientLLM.ts`:
- **Model**: `Qwen2.5-0.5B-Instruct-q4f16_1-MLC`
- **Size**: ~300MB (perfect for mobile)
- **Format**: 4-bit quantized for efficiency

## How It Works

### Architecture

```
User Note (encrypted)
  ↓
Client decrypts locally
  ↓
[Client-Side Path]          [Server-Side Path]
  ↓                            ↓
Local LLM processes          Server sends to OpenAI
  ↓                            ↓
Result stays on device        ❌ Privacy leak
  ↓
✅ True E2E Encryption
```

### Hybrid Approach

The system uses a **hybrid enhancement** strategy:

1. **Try client-side first** (if supported)
   - Checks browser compatibility
   - Loads model (~300MB, cached after first download)
   - Processes entirely locally
   - ✅ No privacy leaks

2. **Fallback to server-side** (if client-side fails)
   - Shows privacy warning dialog
   - Requires user consent
   - Uses OpenAI API
   - ⚠️ Privacy trade-off documented

## Features

### ✅ Privacy Benefits

- **True E2E Encryption**: Content never leaves device
- **No Third-Party Data Sharing**: No OpenAI API calls
- **Offline Capable**: Works after initial model download
- **Mobile Optimized**: Small model size (~300MB)

### 📱 Mobile-First Design

- **Small Model**: Qwen2.5-0.5B (~300MB vs 2.3GB for Phi-3-mini)
- **Efficient Loading**: IndexedDB caching
- **Progress Indicators**: Shows download/processing progress
- **Graceful Degradation**: Falls back to server if needed

## Implementation Details

### Files Created

1. **`client/src/utils/clientLLM.ts`**
   - WebLLM engine initialization
   - Model loading and caching
   - Progress tracking
   - Browser compatibility checks

2. **`client/src/utils/aiEnhancement.ts`**
   - Hybrid enhancement wrapper
   - Client/server selection logic
   - Error handling and fallback

### Integration Points

- **`CreateNote.tsx`**: All AI enhancement functions updated
  - `handleImprove()` → Uses hybrid enhancement
  - `handleSummarize()` → Uses hybrid enhancement
  - `handleSimplify()` → Uses hybrid enhancement
  - `handleAiGenerate()` → Uses hybrid enhancement
  - `handleRegenerate()` → Uses hybrid enhancement

## User Experience

### First-Time Usage

1. User clicks AI feature (e.g., "Improve")
2. System checks for client-side support
3. If supported:
   - Shows progress: "Loading AI model... (0%)"
   - Downloads model (~300MB, one-time)
   - Caches in IndexedDB
   - Processes locally
   - Shows: "🔒 Processed locally"

4. If not supported or fails:
   - Shows privacy warning dialog
   - User consents
   - Falls back to server-side

### Subsequent Usage

- Model already cached → Instant processing
- No network requests needed
- Works offline

## Privacy Warning Dialog

The privacy warning dialog only appears for **server-side AI**:
- Client-side AI: No dialog (no privacy risk)
- Server-side AI: Shows warning about data sharing

## Configuration

### Enable/Disable Client-Side AI

```typescript
// In CreateNote.tsx
const [preferClientSideAI, setPreferClientSideAI] = useState(true);
```

### Model Selection

To use a different model, update `client/src/utils/clientLLM.ts`:

```typescript
const MODEL_NAME = "Your-Model-Name-q4f16_1-MLC";
const MODEL_SIZE_MB = 300; // Update size estimate
```

## Browser Compatibility

### Required Features

- WebGPU OR WebAssembly support
- IndexedDB support
- Web Crypto API

### Supported Browsers

- ✅ Chrome/Edge (WebGPU)
- ✅ Firefox (WebAssembly fallback)
- ✅ Safari (WebGPU on iOS 16.4+)
- ✅ Mobile browsers (with WebGPU support)

## Performance

### Model Loading

- **First Load**: ~10-30 seconds (downloads ~300MB)
- **Subsequent Loads**: ~1-2 seconds (from cache)
- **Processing**: ~2-5 seconds per request

### Storage

- **Model Cache**: ~300MB in IndexedDB
- **One-time Download**: After first use
- **Persistent**: Survives browser restarts

## Troubleshooting

### Model Fails to Load

1. Check browser console for errors
2. Verify IndexedDB is enabled
3. Check available storage space (need ~450MB free)
4. System will automatically fallback to server-side

### Slow Processing

- First-time: Normal (downloading model)
- Subsequent: Should be fast (~2-5 seconds)
- If slow: Check browser performance, consider server-side fallback

### Storage Issues

- Model requires ~300MB
- Check `navigator.storage.estimate()` for available space
- System checks automatically and falls back if insufficient

## Security Considerations

### ✅ Client-Side AI

- **No data leaves device**: True privacy
- **No API keys needed**: Free for users
- **No rate limiting**: Unlimited usage
- **Offline capable**: Works without internet

### ⚠️ Server-Side AI (Fallback)

- **Privacy warning shown**: User informed
- **Requires consent**: Explicit opt-in
- **Rate limited**: Prevents abuse
- **Uses OpenAI API**: Third-party dependency

## Future Enhancements

1. **Model Selection UI**: Let users choose model size
2. **Background Preloading**: Download model on page load
3. **Model Updates**: Version management for model updates
4. **Multiple Models**: Support for different task-specific models
5. **Streaming Responses**: Real-time text generation

## References

- [WebLLM Documentation](https://webllm.mlc.ai/)
- [Qwen2.5-0.5B Model Card](https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC)
- [MLC-LLM Project](https://github.com/mlc-ai/mlc-llm)
