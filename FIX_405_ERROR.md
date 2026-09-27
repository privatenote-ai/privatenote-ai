# Fix 405 Error on Cloudflare Pages

## Problem
You're getting a 405 error when trying to create notes. This happens because:
- Your frontend is deployed on Cloudflare Pages (`privatenote-ai.pages.dev`)
- API requests to `/api/notes` are going to Pages (which only serves static files)
- Pages returns 405 (Method Not Allowed) for POST requests to non-existent files

## Solution Options

### Option 1: Set VITE_API_URL Environment Variable (Quick Fix)

1. **Find your Worker URL**:
   - Go to Cloudflare Dashboard → Workers & Pages
   - Find your Worker (e.g., `privatenote-api`)
   - Note the URL (e.g., `https://privatenote-api.your-subdomain.workers.dev`)

2. **Set Environment Variable in Pages**:
   - Go to Cloudflare Dashboard → Workers & Pages → Pages
   - Click on your Pages project (`privatenote-ai` or similar)
   - Go to **Settings** → **Environment variables**
   - Add production variable:
     - **Variable name**: `VITE_API_URL`
     - **Value**: `https://privatenote-api.your-subdomain.workers.dev` (your Worker URL)
     - ⚠️ **IMPORTANT**: Must include `https://` protocol!
   - Click **Save**
   
   **Common Mistake**: If you set it to just `privatenote-api.your-subdomain.workers.dev` (without `https://`), the client will now auto-add it, but it's better to include it explicitly.

3. **Redeploy**:
   - Go to **Deployments**
   - Click **Retry deployment** on the latest deployment, or push a new commit

### Option 2: Set Up Workers Routes (Better Solution)

This routes `/api/*` requests from your Pages domain directly to your Worker.

1. **In Cloudflare Dashboard**:
   - Go to your domain (if you have a custom domain) or use the Pages domain
   - Navigate to **Workers Routes** (or **Rules** → **Workers Routes**)
   - Click **Add route**
   - **Route**: `privatenote-ai.pages.dev/api/*` (or `yourdomain.com/api/*` if using custom domain)
   - **Worker**: Select your Worker (e.g., `privatenote-api`)
   - Click **Save**

2. **Or configure in wrangler.toml**:
   ```toml
   [[routes]]
   pattern = "privatenote-ai.pages.dev/api/*"
   ```

### Option 3: Use Cloudflare Functions (Alternative)

If you want to handle API routes within Pages itself, you can use Cloudflare Functions, but this requires restructuring your code.

## Verify the Fix

After applying one of the solutions:

1. **Check browser console**:
   - You should see `[CLIENT] Full URL: https://...` logs
   - The URL should point to your Worker, not Pages

2. **Test creating a note**:
   - The request should succeed
   - Check Worker logs in Cloudflare Dashboard to see the request being processed

## Current Status

Based on your error logs:
- Frontend: `https://privatenote-ai.pages.dev`
- API requests are going to: `https://privatenote-ai.pages.dev/api/notes` ❌
- Should go to: `https://your-worker-url.workers.dev/api/notes` ✅

## Quick Test

To verify your Worker is working, test it directly:
```bash
curl -X POST https://your-worker-url.workers.dev/api/notes \
  -H "Content-Type: application/json" \
  -d '{"content":"test","iv":"test"}'
```

If this works, the issue is definitely the routing from Pages to Worker.

