# Self-Hosting WebLLM Models

This guide explains how to self-host WebLLM models instead of downloading from HuggingFace, providing better privacy, security, and performance.

## Benefits

1. **Privacy**: Model downloads don't go through HuggingFace
2. **Security**: Tighter CSP (no external domains needed)
3. **Performance**: Faster downloads from your own CDN/Worker
4. **Reliability**: Not dependent on external services
5. **Control**: Version management and caching

## Implementation Options

### Option 1: Cloudflare R2 + Worker (Recommended)

**Best for**: Production deployments with Cloudflare

1. **Download Model Files**:
   ```bash
   # Model weights (~300MB total, multiple shards)
   # Download from: https://huggingface.co/mlc-ai/Qwen2-0.5B-Instruct-q4f16_1-MLC
   
   # Required files:
   # - mlc-chat-config.json
   # - params_shard_*.bin (multiple shard files)
   # - tokenizer.json
   # - tokenizer_config.json
   ```

2. **Upload to R2**:
   ```bash
   # Create R2 bucket
   wrangler r2 bucket create webllm-models
   
   # Upload files
   wrangler r2 object put webllm-models/qwen2-0.5b/mlc-chat-config.json --file=mlc-chat-config.json
   # ... repeat for all files
   ```

3. **Create Worker Route**:
   ```typescript
   // src/routes.ts or new file: src/model-serving.ts
   export async function serveModelFile(request: Request, env: Env): Promise<Response> {
     const url = new URL(request.url);
     const path = url.pathname.replace('/models/', '');
     
     // Get file from R2
     const object = await env.WEBLLM_MODELS_BUCKET.get(path);
     
     if (!object) {
       return new Response('Not found', { status: 404 });
     }
     
     // Set appropriate headers
     const headers = new Headers();
     headers.set('Content-Type', getContentType(path));
     headers.set('Cache-Control', 'public, max-age=31536000, immutable');
     headers.set('Access-Control-Allow-Origin', '*');
     
     return new Response(object.body, { headers });
   }
   
   function getContentType(path: string): string {
     if (path.endsWith('.json')) return 'application/json';
     if (path.endsWith('.bin')) return 'application/octet-stream';
     if (path.endsWith('.wasm')) return 'application/wasm';
     return 'application/octet-stream';
   }
   ```

4. **Update WebLLM Config**:
   ```typescript
   // client/src/utils/clientLLM.ts
   import { CreateMLCEngine, type MLCEngineInterface, type AppConfig } from "@mlc-ai/web-llm";
   
   const MODEL_BASE_URL = "https://your-domain.com/models/qwen2-0.5b";
   
   const customAppConfig: AppConfig = {
     model_list: [
       {
         model_id: "Qwen2-0.5B-Instruct-q4f16_1",
         model: `${MODEL_BASE_URL}/`,
         model_lib: "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm",
         // Or host WASM yourself too:
         // model_lib: `${MODEL_BASE_URL}/model.wasm`,
       }
     ]
   };
   
   const engine = await CreateMLCEngine("Qwen2-0.5B-Instruct-q4f16_1", {
     appConfig: customAppConfig,
     initProgressCallback: ...
   });
   ```

### Option 2: Cloudflare Pages Assets

**Best for**: Simple static hosting

1. **Download and organize model files**:
   ```
   client/public/models/qwen2-0.5b/
     ├── mlc-chat-config.json
     ├── params_shard_0.bin
     ├── params_shard_1.bin
     ├── ...
     └── tokenizer.json
   ```

2. **Update WebLLM config**:
   ```typescript
   const MODEL_BASE_URL = "/models/qwen2-0.5b";
   
   const customAppConfig: AppConfig = {
     model_list: [{
       model_id: "Qwen2-0.5B-Instruct-q4f16_1",
       model: MODEL_BASE_URL,
       model_lib: "https://raw.githubusercontent.com/...", // Or host yourself
     }]
   };
   ```

### Option 3: Hybrid Approach

**Best for**: Balance between control and simplicity

- Host model weights yourself (large files, better control)
- Use GitHub CDN for WASM libraries (small files, less critical)

## Implementation Steps

### Step 1: Download Model

Choose one or both models:

```bash
# Install huggingface-cli
pip install huggingface-hub

# Download Llama-3.2-1B (recommended, better quality)
huggingface-cli download mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC \
  --local-dir ./models/llama-3.2-1b \
  --local-dir-use-symlinks False

# OR download Qwen2-0.5B (smaller, faster)
huggingface-cli download mlc-ai/Qwen2-0.5B-Instruct-q4f16_1-MLC \
  --local-dir ./models/qwen2-0.5b \
  --local-dir-use-symlinks False
```

### Step 2: Update clientLLM.ts

```typescript
// client/src/utils/clientLLM.ts
import { CreateMLCEngine, type MLCEngineInterface, type AppConfig } from "@mlc-ai/web-llm";

const MODEL_BASE_URL = import.meta.env.VITE_MODEL_BASE_URL || 
  "https://your-domain.com/models/qwen2-0.5b";

function createCustomAppConfig(): AppConfig {
  return {
    model_list: [
      {
        model_id: "Qwen2-0.5B-Instruct-q4f16_1",
        model: `${MODEL_BASE_URL}/`,
        model_lib: "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm",
      }
    ]
  };
}

export async function initializeClientLLM(
  onProgress?: ProgressCallback
): Promise<MLCEngineInterface> {
  // ... existing checks ...
  
  const customAppConfig = createCustomAppConfig();
  
  const engine = await CreateMLCEngine("Qwen2-0.5B-Instruct-q4f16_1", {
    appConfig: customAppConfig,
    initProgressCallback: ...
  });
}
```

### Step 3: Update CSP (Remove HuggingFace)

Once self-hosted, you can remove HuggingFace domains from CSP:

```typescript
// src/routes.ts
"connect-src 'self' ... https://raw.githubusercontent.com", // Remove huggingface.co
```

### Step 4: Add Environment Variable

```bash
# .env.local
VITE_MODEL_BASE_URL=https://your-domain.com/models/qwen2-0.5b
```

## File Structure

```
models/
└── qwen2-0.5b/
    ├── mlc-chat-config.json          # Model configuration
    ├── params_shard_0.bin            # Model weights (shard 0)
    ├── params_shard_1.bin            # Model weights (shard 1)
    ├── params_shard_2.bin            # Model weights (shard 2)
    ├── params_shard_3.bin            # Model weights (shard 3)
    ├── params_shard_4.bin            # Model weights (shard 4)
    ├── params_shard_5.bin            # Model weights (shard 5)
    ├── params_shard_6.bin            # Model weights (shard 6)
    ├── tokenizer.json                # Tokenizer
    └── tokenizer_config.json         # Tokenizer config
```

## Storage Requirements

### Llama-3.2-1B-Instruct:
- **Model weights**: ~880MB (multiple shard files)
- **WASM library**: ~10-20MB (can be hosted separately)
- **Total**: ~900MB

### Qwen2-0.5B-Instruct:
- **Model weights**: ~300MB (multiple shard files)
- **WASM library**: ~10-20MB (can be hosted separately)
- **Total**: ~320MB

### Phi-3.5-mini-Instruct:
- **Model weights**: ~2.2GB (multiple shard files)
- **WASM library**: ~10-20MB (can be hosted separately)
- **Total**: ~2.2GB
- **Note**: Despite "mini" name, this is a large model requiring significant storage

### Gemma-3-1B-Instruct:
- **Model weights**: ~600MB (multiple shard files)
- **WASM library**: ~10-20MB (can be hosted separately)
- **Total**: ~620MB

### Gemma-3-270M-Instruct:
- **Model weights**: ~200MB (multiple shard files)
- **WASM library**: ~10-20MB (can be hosted separately)
- **Total**: ~220MB

## CDN Considerations

1. **Caching**: Set long cache headers (1 year) for immutable model files
2. **Compression**: Enable gzip/brotli compression
3. **Range requests**: Ensure your CDN supports HTTP range requests (for partial downloads)

## Security Considerations

1. **CORS**: Allow CORS for model files
2. **Integrity**: Consider adding SRI hashes for model files
3. **Access control**: If needed, add authentication for model downloads

## Testing

1. Test model loading from your CDN
2. Verify CSP no longer needs HuggingFace domains
3. Check download speeds and reliability
4. Test IndexedDB caching still works

## Migration Checklist

- [ ] Download model files from HuggingFace
- [ ] Upload to your CDN/storage (R2, Pages, etc.)
- [ ] Update `clientLLM.ts` with custom `appConfig`
- [ ] Test model loading
- [ ] Remove HuggingFace domains from CSP
- [ ] Update documentation
- [ ] Monitor download metrics

## Cost Considerations

- **R2 Storage**: ~$0.015/GB/month
- **R2 Egress**: First 10GB free, then $0.09/GB
- **Pages Assets**: Included in Pages plan
- **Bandwidth**: Consider CDN caching to reduce egress

For models:
- **Llama-3.2-1B** (~880MB): Storage ~$0.013/month, Egress depends on usage
- **Qwen2-0.5B** (~300MB): Storage ~$0.005/month, Egress depends on usage
- **Gemma-3-1B** (~600MB): Storage ~$0.009/month, Egress depends on usage
- **Phi-3.5-mini** (~2.2GB): Storage ~$0.033/month, Egress depends on usage
- **Gemma-3-270M** (~200MB): Storage ~$0.003/month, Egress depends on usage
- First 10GB egress free per month

## Supported Models

The application supports multiple models with automatic fallback:

### Preferred Models (in order):
1. **Llama-3.2-1B-Instruct-q4f16_1-MLC** (~880MB)
   - Best quality and performance
   - Recommended for desktop users
   - Better instruction following

2. **Qwen2-0.5B-Instruct-q4f16_1** (~300MB)
   - Smaller, faster download
   - Good for mobile users
   - Still provides quality results

3. **mlc-ai/gemma-3-1b-it-q4f32_1-MLC** (~600MB)
   - Good balance of quality and size
   - Google's Gemma 3 1B model
   - Better than 270M version while still reasonable size

4. **Phi-3.5-mini-instruct-q4f16_1-MLC** (~2.2GB)
   - **Large model** - requires significant storage
   - Microsoft's Phi-3.5 model with excellent quality
   - Best instruction following but largest download
   - **Note**: Despite "mini" name, this model is quite large

5. **linguini/gemma-3-270m-it-q4f16_1-MLC** (~200MB)
   - Smallest model, fastest download
   - Best for very limited storage/bandwidth
   - Good for basic tasks

### Fallback Models:
- Other Llama 3.x models (1B-2B range)
- Qwen2 variants (0.5B-1.5B)
- Gemma models (270M-2B range)
- Phi-3-mini
- Other small models available in WebLLM registry

The system automatically selects the best available model from the registry, prioritizing preferred models.
