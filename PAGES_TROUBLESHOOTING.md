# Cloudflare Pages Troubleshooting

## If Pages shows "Nothing is there" or blank page:

### 1. Verify Build Settings

In Cloudflare Dashboard → Your Pages Project → **Settings** → **Builds & deployments**:

- ✅ **Build command**: `npm run build`
- ✅ **Build output directory**: `dist/public`
- ✅ **Root directory**: `/` (leave empty or set to root)
- ✅ **Node.js version**: `18` or `20` (default is usually fine)

### 2. Check Deployment Logs

1. Go to your Pages project
2. Click on **Deployments** tab
3. Click on the latest deployment
4. Check the **Build log** for errors

**Common errors:**
- ❌ "Build output directory not found" → Check the directory path
- ❌ "Build command failed" → Check npm dependencies
- ❌ "No index.html found" → Build output directory is wrong

### 3. Verify Build Output Locally

Run locally to verify build works:
```bash
npm run build
ls -la dist/public/
```

You should see:
- `index.html`
- `assets/` folder
- `_redirects` file

### 4. Check Browser Console

1. Open your Pages URL
2. Open browser DevTools (F12)
3. Check **Console** tab for errors
4. Check **Network** tab - are assets loading?

**Common issues:**
- 404 errors for assets → Build output directory wrong
- CORS errors → API configuration issue
- Blank page → JavaScript errors in console

### 5. Verify _redirects File

The `_redirects` file should be in `dist/public/` after build:
```bash
cat dist/public/_redirects
```

Should contain:
```
/*    /index.html   200
```

### 6. Re-deploy

If settings are correct but still not working:

1. **Trigger a new deployment:**
   - Go to **Deployments** → **Retry deployment**
   - Or push a new commit to trigger rebuild

2. **Or manually upload:**
   ```bash
   npm run build
   npx wrangler pages deploy dist/public --project-name=your-project-name
   ```

### 7. Check Custom Domain

If using a custom domain:
- Verify DNS is configured correctly
- Check SSL/TLS settings
- Wait for DNS propagation (can take a few minutes)

### 8. Verify Files Are Deployed

In Cloudflare Dashboard:
1. Go to your Pages project
2. Click on a deployment
3. Click **View build output** or **View files**
4. Verify `index.html` and `assets/` folder exist

## Quick Fix Checklist

- [ ] Build output directory is `dist/public`
- [ ] Build command is `npm run build`
- [ ] Root directory is `/` (empty)
- [ ] Build succeeded (check logs)
- [ ] `index.html` exists in build output
- [ ] `_redirects` file exists in build output
- [ ] No errors in browser console
- [ ] Assets are loading (check Network tab)

## Still Not Working?

1. **Check the deployment URL:**
   - Your Pages URL should be: `https://your-project.pages.dev`
   - Make sure you're visiting the correct URL

2. **Try a fresh deployment:**
   - Delete the project and recreate it
   - Or use manual upload method

3. **Check if it's a routing issue:**
   - Try visiting: `https://your-project.pages.dev/` (root)
   - If root works but other routes don't → `_redirects` issue

4. **Verify API connection:**
   - Check if API calls are working
   - Open Network tab and check `/api/*` requests

