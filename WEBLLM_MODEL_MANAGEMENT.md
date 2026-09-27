# WebLLM Model Management Guide

This guide explains how models are stored, cached, and managed in the client-side LLM implementation.

## 📦 Where Models Are Stored

### Storage Location: **IndexedDB**

Models are stored in the browser's **IndexedDB** database, which is a client-side storage API that can hold large amounts of structured data.

### Database Names

WebLLM creates IndexedDB databases with names like:
- `webllm_model_cache_v1`
- `webllm_model_cache_*` (versioned)
- Model-specific databases (created by WebLLM library)

### What Gets Stored

1. **Model Weights** (~300-600MB)
   - Quantized model parameters (`.bin` files)
   - Multiple shard files for large models
   - Stored as binary blobs in IndexedDB

2. **Model Metadata**
   - Configuration files (`mlc-chat-config.json`)
   - Tokenizer files (`tokenizer.json`)
   - Model version information

3. **WASM Libraries** (~10-20MB)
   - Compiled WebAssembly inference engines
   - Platform-specific (WebGPU/WebAssembly)
   - Cached separately by WebLLM

### Storage Size

- **Llama-3.2-1B**: ~600MB total
- **Qwen2-0.5B**: ~300MB total
- **Overhead**: ~50-100MB (IndexedDB overhead, metadata)

## 🔄 How Model Download Works

### First-Time Download

1. **User triggers AI feature** (Improve, Summarize, Ask, etc.)
2. **System checks** if model is cached
3. **If not cached:**
   - Downloads model weights from HuggingFace CDN
   - Downloads WASM library from GitHub
   - Stores everything in IndexedDB
   - Shows progress indicator (0-100%)
4. **Model loads** into memory for inference

### Subsequent Uses

1. **System checks** IndexedDB cache
2. **If cached:**
   - Loads from IndexedDB (much faster, ~5-10 seconds)
   - No re-download needed
   - Loads directly into memory

### Caching Behavior

- **Persistent**: Models persist across browser sessions
- **Per-domain**: Each website has its own IndexedDB
- **Versioned**: WebLLM uses versioned cache keys
- **Automatic**: WebLLM handles caching automatically

## 🗑️ How Users Can Delete Models

### Option 1: Clear Cache Button (Test Page)

On the `/test-llm` page, there's a "Clear Cache" button that:
- Finds all WebLLM IndexedDB databases
- Deletes them completely
- Clears the in-memory engine instance
- Next load will download fresh model

**Code:**
```typescript
const handleClearCache = async () => {
  const databases = await indexedDB.databases();
  for (const db of databases) {
    if (db.name && db.name.includes('webllm')) {
      indexedDB.deleteDatabase(db.name);
    }
  }
  clearEngine();
};
```

### Option 2: Browser DevTools

Users can manually delete via browser DevTools:

1. **Chrome/Edge:**
   - Open DevTools (F12)
   - Go to **Application** tab
   - Expand **IndexedDB** in left sidebar
   - Find databases starting with `webllm_`
   - Right-click → **Delete database**

2. **Firefox:**
   - Open DevTools (F12)
   - Go to **Storage** tab
   - Expand **IndexedDB**
   - Find `webllm_*` databases
   - Right-click → **Delete**

3. **Safari:**
   - Open DevTools (Cmd+Option+I)
   - Go to **Storage** tab
   - Expand **IndexedDB**
   - Delete `webllm_*` databases

### Option 3: Browser Settings

Users can clear all site data:

1. **Chrome:**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Choose time range → Clear data

2. **Firefox:**
   - Settings → Privacy → Clear Data
   - Check "Cached Web Content"

3. **Safari:**
   - Safari → Clear History
   - Choose time range → Clear History

**Note:** This clears ALL site data, not just models.

### Option 4: Programmatic API

You can add a function to your app:

```typescript
import { clearEngine } from '@/utils/clientLLM';

async function clearModelCache() {
  // Clear in-memory engine
  clearEngine();
  
  // Clear IndexedDB databases
  const databases = await indexedDB.databases();
  for (const db of databases) {
    if (db.name && db.name.includes('webllm')) {
      await new Promise((resolve, reject) => {
        const deleteReq = indexedDB.deleteDatabase(db.name!);
        deleteReq.onsuccess = () => resolve(undefined);
        deleteReq.onerror = () => reject(deleteReq.error);
      });
    }
  }
}
```

## 📊 Storage Management

### Checking Storage Usage

```typescript
async function checkStorageUsage() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    console.log('Total quota:', estimate.quota);
    console.log('Used:', estimate.usage);
    console.log('Available:', estimate.quota! - estimate.usage!);
  }
}
```

### Storage Quota Limits

- **Chrome**: ~60% of disk space (varies by OS)
- **Firefox**: ~50% of disk space
- **Safari**: ~1GB per origin (can request more)
- **Mobile**: Often limited to 50MB-1GB

### Handling Storage Full

The code checks available space before download:

```typescript
const availableSpace = await checkStorageQuota();
const requiredSpace = DEFAULT_MODEL_SIZE_MB * 1.5; // Model + overhead
if (availableSpace < requiredSpace) {
  throw new Error(
    `Insufficient storage space. Need at least ${Math.ceil(requiredSpace)}MB free space.`
  );
}
```

## 🔍 Model Detection & Management

### Check if Model is Cached

```typescript
async function isModelCached(): Promise<boolean> {
  const databases = await indexedDB.databases();
  return databases.some(db => db.name && db.name.includes('webllm'));
}
```

### List All Cached Models

```typescript
async function listCachedModels(): Promise<string[]> {
  const databases = await indexedDB.databases();
  return databases
    .filter(db => db.name && db.name.includes('webllm'))
    .map(db => db.name!);
}
```

### Get Model Size

```typescript
async function getModelSize(): Promise<number> {
  const databases = await indexedDB.databases();
  let totalSize = 0;
  
  for (const db of databases) {
    if (db.name && db.name.includes('webllm')) {
      // Note: IndexedDB doesn't provide direct size API
      // You'd need to estimate or use storage.estimate()
    }
  }
  
  return totalSize;
}
```

## 🎯 Best Practices

### For Users

1. **First Use**: Be patient - initial download takes 30-60 seconds
2. **Storage**: Models use ~300-600MB of browser storage
3. **Clearing**: Only clear if you need space or want fresh model
4. **Multiple Models**: Each model is cached separately
5. **Privacy**: Models are stored locally, never sent to servers

### For Developers

1. **Check Storage**: Always verify available space before download
2. **Progress Feedback**: Show download progress to users
3. **Error Handling**: Handle storage quota errors gracefully
4. **Cache Management**: Provide clear cache option for users
5. **Versioning**: Use versioned cache keys for model updates

## 🔐 Privacy & Security

### Privacy Benefits

- ✅ **Local Storage**: Models never leave user's device
- ✅ **No Tracking**: No server-side logging of model usage
- ✅ **User Control**: Users can delete models anytime
- ✅ **Isolated**: Each website has separate storage

### Security Considerations

- ⚠️ **Storage Limits**: Browsers enforce storage quotas
- ⚠️ **Cross-Origin**: Models are domain-specific
- ⚠️ **Cache Poisoning**: IndexedDB is isolated per origin
- ⚠️ **Disk Space**: Large models consume significant space

## 🛠️ Implementation Details

### Current Implementation

**File**: `client/src/utils/clientLLM.ts`

```typescript
// Cache key (not directly used, WebLLM manages its own)
const MODEL_CACHE_KEY = "webllm_model_cache_v1";

// Clear engine from memory
export function clearEngine(): void {
  engineInstance = null;
  engineLoadingPromise = null;
  loadProgressCallback = null;
}
```

**File**: `client/src/pages/TestClientLLM.tsx`

```typescript
// Clear cache function
const handleClearCache = async () => {
  const databases = await indexedDB.databases();
  for (const db of databases) {
    if (db.name && db.name.includes('webllm')) {
      indexedDB.deleteDatabase(db.name);
    }
  }
  clearEngine();
};
```

## 📱 Browser-Specific Behavior

### Chrome/Edge
- **Storage**: IndexedDB in `%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB`
- **Quota**: ~60% of disk space
- **Persistence**: Survives browser restarts
- **Clearing**: Via DevTools or Settings

### Firefox
- **Storage**: IndexedDB in profile folder
- **Quota**: ~50% of disk space
- **Persistence**: Survives browser restarts
- **Clearing**: Via DevTools or Settings

### Safari
- **Storage**: IndexedDB in `~/Library/Safari/IndexedDB`
- **Quota**: ~1GB per origin (can request more)
- **Persistence**: Survives browser restarts
- **Clearing**: Via DevTools or Safari → Clear History

### Mobile Browsers
- **Storage**: Limited (often 50MB-1GB)
- **Quota**: Much stricter limits
- **Persistence**: May be cleared by OS
- **Clearing**: Via browser settings

## 🚀 Future Improvements

### Potential Enhancements

1. **Storage Management UI**
   - Show model size in settings
   - List all cached models
   - Selective deletion (by model)

2. **Storage Monitoring**
   - Warn users when storage is low
   - Suggest clearing old models
   - Show storage usage breakdown

3. **Model Versioning**
   - Detect model updates
   - Prompt to update cached model
   - Keep multiple versions

4. **Compression**
   - Compress cached models
   - Reduce storage footprint
   - Faster downloads

5. **Progressive Loading**
   - Load model in chunks
   - Start using before full download
   - Better UX for large models

## 📝 Summary

- **Storage**: IndexedDB (browser's local database)
- **Size**: ~300-600MB per model
- **Persistence**: Survives browser restarts
- **Deletion**: Via DevTools, browser settings, or code
- **Privacy**: Models never leave user's device
- **Management**: WebLLM handles caching automatically

Users have full control over model storage and can delete cached models anytime through browser DevTools or the test page's "Clear Cache" button.
