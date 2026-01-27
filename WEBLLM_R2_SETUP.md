# WebLLM Models - Cloudflare R2 Self-Hosting Setup

This guide explains how to self-host WebLLM models on Cloudflare R2 + CDN for better privacy, performance, and cost efficiency.

## ✅ Benefits

- **Very low cost storage** (~$0.015/GB/month)
- **No egress fees** to Cloudflare (huge savings!)
- **Reliable** - Cloudflare's global CDN
- **Easy custom domain** (e.g., `models.privatenote.ai`)
- **Perfect for large files** (MLC model shards)
- **Long cache headers** for optimal performance

## 📋 Prerequisites

1. Cloudflare account with R2 enabled
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticated with Cloudflare: `wrangler login`
4. Models downloaded to `./models/` directory

## 🚀 Setup Steps

### Step 1: Create R2 Bucket

```bash
wrangler r2 bucket create webllm-models
```

### Step 2: Upload Models to R2

**⚠️ Important**: Wrangler CLI has a 300MB file size limit. For larger files, use the S3 Compatibility API (see `R2_S3_SETUP.md`).

**Option 1: Use S3 API Script** (Recommended for large files)
```bash
./scripts/upload-models-to-r2-s3.sh
```
This automatically uses S3 API for files > 300MB and Wrangler for smaller files.

**Option 2: Use Wrangler Script** (For files < 300MB)
```bash
./scripts/upload-models-to-r2.sh
```

**Option 3: Manual upload with Wrangler:**

```bash
# Upload Gemma 3 1B model
wrangler r2 object put webllm-models/gemma-3-1b-it-mlc/mlc-chat-config.json \
  --file=./models/gemma-3-1b-it-mlc/mlc-chat-config.json

# Upload all files in the model directory
for file in ./models/gemma-3-1b-it-mlc/*; do
  filename=$(basename "$file")
  wrangler r2 object put "webllm-models/gemma-3-1b-it-mlc/$filename" --file="$file"
done

# Repeat for gemma-3-270m-it-mlc
```

### Step 3: Verify Upload

**Note**: Wrangler doesn't have a direct `list` command for objects. Use one of these methods:

**Option 1: Use Verification Script** (Recommended)
```bash
./scripts/verify-r2-upload.sh
```
This will test key files to ensure they're uploaded correctly.

**Option 2: Cloudflare Dashboard** (Easiest)
- Go to: https://dash.cloudflare.com/ → R2 → webllm-models
- View all uploaded files visually

**Option 3: Test a specific file manually**
```bash
# Try to get a file to verify it exists
wrangler r2 object get webllm-models/gemma-3-1b-it-mlc/mlc-chat-config.json --file=/tmp/test.json
cat /tmp/test.json
rm /tmp/test.json
```

You should see files like:
- `gemma-3-1b-it-mlc/mlc-chat-config.json`
- `gemma-3-1b-it-mlc/params_shard_0.bin`
- `gemma-3-1b-it-mlc/tokenizer.json`
- `gemma-3-270m-it-mlc/...` (similar structure)

### Step 4: Deploy Worker

The Worker is already configured to serve models from R2. Deploy:

```bash
npm run deploy
# or
wrangler deploy
```

### Step 5: Test Model Serving

Visit: `https://your-domain.com/models/gemma-3-1b-it-mlc/mlc-chat-config.json`

You should see the JSON config file.

## 🔧 Configuration

### Custom Domain (Optional but Recommended)

1. **Create R2 Custom Domain**:
   - Go to Cloudflare Dashboard → R2 → Your Bucket → Settings
   - Add custom domain: `models.privatenote.ai`
   - Follow DNS setup instructions

2. **Update Environment Variable**:
   ```bash
   # In your .env or Vite config
   VITE_MODEL_BASE_URL=https://models.privatenote.ai
   ```

3. **Or use Worker route** (already configured):
   - Models are served via `/models/*` route
   - No custom domain needed if using same domain

### Model URLs

Models are served at:
- **Gemma 3 1B**: `https://your-domain.com/models/gemma-3-1b-it-mlc/`
- **Gemma 3 270M**: `https://your-domain.com/models/gemma-3-270m-it-mlc/`

## 📁 Expected File Structure

```
webllm-models/ (R2 bucket)
├── gemma-3-1b-it-mlc/
│   ├── mlc-chat-config.json
│   ├── params_shard_0.bin
│   ├── params_shard_1.bin
│   ├── ... (all shard files)
│   ├── tokenizer.json
│   ├── tokenizer_config.json
│   └── libs/ (optional - for WASM files)
│       └── gemma-3-1b-it-webgpu.wasm
└── gemma-3-270m-it-mlc/
    ├── mlc-chat-config.json
    ├── params_shard_*.bin
    ├── tokenizer.json
    └── libs/ (optional)
        └── gemma-3-270m-it-webgpu.wasm
```

## 🔒 Security & CORS

The Worker route (`/models/*`) automatically:
- ✅ Sets proper CORS headers
- ✅ Uses long cache headers (1 year, immutable)
- ✅ Supports range requests (for partial downloads)
- ✅ Sets correct content types

## 💰 Cost Estimate

### Storage Costs
- **Gemma 3 1B**: ~600MB → ~$0.009/month
- **Gemma 3 270M**: ~200MB → ~$0.003/month
- **Total**: ~$0.012/month storage

### Egress Costs
- **First 10GB/month**: FREE
- **After 10GB**: $0.09/GB
- With CDN caching, most users won't hit the limit

### Example Monthly Cost
- 100 users downloading models: ~80GB → ~$6.30/month
- 1000 users: ~800GB → ~$71/month
- Much cheaper than HuggingFace bandwidth!

## 🧪 Testing

1. **Test file serving**:
   ```bash
   curl https://your-domain.com/models/gemma-3-1b-it-mlc/mlc-chat-config.json
   ```

2. **Test in browser**:
   - Open DevTools → Network tab
   - Initialize WebLLM model
   - Check that requests go to `/models/*` not HuggingFace

3. **Verify caching**:
   - Check response headers include `Cache-Control: public, max-age=31536000, immutable`

## 🔄 Updating Models

To update models:

1. Upload new version to different path (versioned):
   ```bash
   wrangler r2 object put webllm-models/gemma-3-1b-it-mlc-v2/...
   ```

2. Update `clientLLM.ts` to use new path

3. Or overwrite existing files (not recommended - breaks caching)

## 🐛 Troubleshooting

### Models not loading
- Check R2 bucket name matches `wrangler.toml`
- Verify files uploaded correctly
- Check Worker logs: `wrangler tail`

### CORS errors
- Verify CORS headers in `serveModelFile()` function
- Check allowed origins in `routes.ts`

### 404 errors
- Verify file paths match R2 object keys
- Check model directory structure

### Slow downloads
- Enable Cloudflare CDN caching
- Use custom domain for better routing
- Check R2 bucket region (should be close to users)

## 📚 Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Custom Domains](https://developers.cloudflare.com/r2/buckets/custom-domains/)
- [WebLLM Documentation](https://webllm.mlc.ai/)
