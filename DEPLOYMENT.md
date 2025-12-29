# Cloudflare Deployment Guide

This guide covers deploying both the frontend (Cloudflare Pages) and API (Cloudflare Workers).

## Prerequisites

1. Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler` or use `npx wrangler`)
3. Git repository (for Pages deployment)

## Step 1: Deploy Workers API

### 1.1 Create KV Namespace (if not done already)

```bash
# Create production namespace
wrangler kv:namespace create "NOTES_KV"

# Create preview namespace for local development
wrangler kv:namespace create "NOTES_KV" --preview
```

Update `wrangler.toml` with the namespace IDs.

### 1.2 Set Environment Variables

```bash
# Set OpenAI API key (if needed)
wrangler secret put OPENAI_API_KEY=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
# Enter your API key when prompted
```

### 1.3 Deploy Workers

```bash
npm run deploy
# or
wrangler deploy
```

After deployment, note your Workers URL (e.g., `https://privatenote-api.your-subdomain.workers.dev`)

## Step 2: Deploy Frontend to Cloudflare Pages

### Option A: Deploy via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

2. **Connect Repository**
   - Select your Git provider (GitHub, GitLab, etc.)
   - Choose your repository
   - Authorize Cloudflare

3. **Configure Build Settings**
   - **Project name**: `privatenote-frontend` (or your preferred name)
   - **Production branch**: `main` (or `master`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty or set to root)

4. **Environment Variables** (Required if Pages and Workers are on different domains)
   - Go to **Settings** → **Environment variables**
   - Add production variable:
     - **Variable name**: `VITE_API_URL`
     - **Value**: `https://privatenote-api.your-subdomain.workers.dev` (your Workers URL)
   - If using same domain with Workers Routes, leave this empty (relative URLs will work)

5. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will build and deploy your site

### Option B: Deploy via Wrangler CLI

1. **Build the frontend locally**
   ```bash
   npm run build
   ```

2. **Deploy to Pages**
   ```bash
   npx wrangler pages deploy dist/public --project-name=privatenote-frontend
   ```

### Option C: Deploy via Direct Upload

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Upload via Dashboard**
   - Go to **Workers & Pages** → **Pages**
   - Click **Create a project** → **Upload assets**
   - Upload the `dist/public` directory

## Step 3: Configure Custom Domain (Optional)

### For Pages:
1. Go to your Pages project → **Custom domains**
2. Add your domain
3. Update DNS records as instructed

### For Workers:
1. Go to your Worker → **Triggers** → **Custom domains**
2. Add your domain
3. Update DNS records

## Step 4: Connect Frontend to Workers API

### If using same domain:
If both Pages and Workers are on the same domain, relative URLs (`/api/*`) will work automatically.

### If using different domains:
You'll need to configure the API base URL:

1. **Create environment variable file** (`.env.production`):
   ```
   VITE_API_URL=https://privatenote-api.your-subdomain.workers.dev
   ```

2. **Update API client** to use the environment variable:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || '';
   export async function apiRequest<T = any>(
     url: string,
     method: string = "GET",
     data?: unknown | undefined,
   ): Promise<T> {
     const fullUrl = API_BASE_URL + url;
     // ... rest of the function
   }
   ```

### Using Cloudflare Workers Routes (Recommended)

You can route `/api/*` requests from Pages to your Worker:

1. **In Cloudflare Dashboard**:
   - Go to your domain → **Workers Routes**
   - Add route: `yourdomain.com/api/*` → `privatenote-api` worker

2. **Or use wrangler.toml routes** (for Workers):
   ```toml
   routes = [
     { pattern = "yourdomain.com/api/*", custom_domain = true }
   ]
   ```

## Step 5: Verify Deployment

1. **Test API endpoints**:
   ```bash
   curl https://your-workers-url.workers.dev/api/blog
   ```

2. **Test frontend**:
   - Visit your Pages URL
   - Check browser console for errors
   - Test creating a note

## Troubleshooting

### CORS Issues
If you see CORS errors, add CORS headers to your Workers routes. Update `src/routes.ts`:

```typescript
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token"
    },
  });
}
```

### SPA Routing Issues
The `_redirects` file in `client/public/` should handle SPA routing. If routes don't work:
- Verify `_redirects` is in the build output
- Check Cloudflare Pages settings for redirect rules

### Build Failures
- Check build logs in Cloudflare Dashboard
- Verify Node.js version (Pages uses Node 18 by default)
- Ensure all dependencies are in `package.json`

## Continuous Deployment

Once connected to Git:
- Every push to the main branch triggers a new deployment
- Preview deployments are created for pull requests
- You can configure custom build settings per branch

## Environment Variables

### Pages Environment Variables:
- Set in Dashboard: **Pages** → **Settings** → **Environment variables**
- Available as `import.meta.env.VITE_*` in your code

### Workers Secrets:
```bash
wrangler secret put SECRET_NAME
```

## Monitoring

- **Workers Analytics**: Available in Cloudflare Dashboard
- **Pages Analytics**: Available in Pages dashboard
- **KV Analytics**: Check KV namespace metrics

## Cost Considerations

- **Workers**: Free tier includes 100,000 requests/day
- **Pages**: Free tier includes unlimited requests
- **KV**: Free tier includes 100,000 reads/day, 1,000 writes/day

For production, consider upgrading to a paid plan if you exceed free tier limits.

