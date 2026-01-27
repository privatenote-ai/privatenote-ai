# Deploy Worker with Self-Hosted Models

This guide covers deploying your Worker after uploading models to R2.

## ✅ Prerequisites

- [x] Models uploaded to R2 bucket `webllm-models`
- [x] R2 bucket binding configured in `wrangler.toml`
- [x] Worker route handler for `/models/*` configured

## 🚀 Deployment Steps

### Step 1: Verify Models Are Uploaded

```bash
# Quick check
./scripts/verify-r2-upload.sh

# Or check in dashboard
# https://dash.cloudflare.com/ → R2 → webllm-models
```

### Step 2: Build the Project

```bash
npm run build
```

This builds the frontend and prepares the Worker code.

### Step 3: Deploy the Worker

```bash
npm run deploy
```

Or directly:

```bash
wrangler deploy
```

This will:
- Deploy your Worker with the `/models/*` route handler
- Make models accessible at: `https://your-worker.workers.dev/models/...`

### Step 4: Verify Deployment

After deployment, test model serving:

```bash
# Test a model file
curl https://privatenote-api.your-subdomain.workers.dev/models/gemma-3-1b-it-mlc/mlc-chat-config.json

# Should return the JSON config file
```

### Step 5: Update Frontend (If Needed)

If your frontend is deployed separately (Cloudflare Pages), make sure it's using the correct model URLs:

- **Same domain**: Models are at `/models/...` (relative URLs work)
- **Different domain**: Set `VITE_MODEL_BASE_URL` environment variable

## 🔍 Testing Model Serving

1. **Test in browser**:
   ```
   https://your-worker.workers.dev/models/gemma-3-1b-it-mlc/mlc-chat-config.json
   ```

2. **Check response headers**:
   - Should have `Cache-Control: public, max-age=31536000, immutable`
   - Should have CORS headers
   - Content-Type should be correct

3. **Test WebLLM loading**:
   - Open your app
   - Try to initialize a model
   - Check Network tab - requests should go to `/models/*` not HuggingFace

## 🐛 Troubleshooting

### Models not loading
- Check R2 bucket name matches `wrangler.toml`
- Verify files are in R2 (use dashboard)
- Check Worker logs: `wrangler tail`

### 404 errors
- Verify route handler is deployed: Check `src/routes.ts` has `/models/*` handler
- Check file paths match R2 object keys exactly

### CORS errors
- Verify CORS headers in `serveModelFile()` function
- Check allowed origins in `routes.ts`

### Worker deployment fails
- Check `wrangler.toml` syntax
- Verify R2 bucket exists: `wrangler r2 bucket list`
- Check you're logged in: `wrangler whoami`

## 📝 Post-Deployment Checklist

- [ ] Models accessible via `/models/*` route
- [ ] Frontend can load models from your domain
- [ ] No HuggingFace requests in Network tab
- [ ] Models load successfully in WebLLM
- [ ] Cache headers are set correctly
- [ ] CORS working for model files

## 🔄 Updating Models

To update models in the future:

1. Upload new files to R2:
   ```bash
   ./scripts/upload-models-to-r2-s3.sh
   ```

2. Redeploy Worker (if route handler changed):
   ```bash
   npm run deploy
   ```

3. Clear browser cache (models are cached for 1 year)
