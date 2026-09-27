# Security Improvements: Rate Limiting & CORS

## Changes Made

### 1. Rate Limiting ✅
- **Implementation**: Added rate limiting using KV storage
- **Limit**: 20 requests per 60 seconds per IP address
- **Scope**: Applied to POST requests (note creation)
- **Storage**: Uses `NOTES_KV` (or `RATE_LIMIT_KV` if configured separately)
- **Behavior**: Returns 429 (Too Many Requests) when limit exceeded

**Configuration** (in `src/routes.ts`):
```typescript
const RATE_LIMIT = {
  MAX_REQUESTS: 20,      // requests per window
  WINDOW_SECONDS: 60,    // 1 minute window
  KEY_PREFIX: 'rate_limit:',
};
```

**How it works**:
- Tracks requests per client IP (using `CF-Connecting-IP` header)
- Uses sliding window: resets every 60 seconds
- Stores count in KV with automatic expiration
- Fails open: if KV error occurs, allows request (prevents service disruption)

### 2. CORS Restrictions ✅
- **Before**: Wildcard (`*`) - any origin could access API
- **After**: Whitelist of allowed origins only

**Allowed Origins**:
- `https://privatenote-ai.pages.dev` (production Pages)
- `https://privatenote.ai` (custom domain if configured)
- `http://localhost:5000` (local dev server)
- `http://localhost:5173` (local Vite dev)
- `http://127.0.0.1:5000` (local dev alternative)
- `http://127.0.0.1:5173` (local Vite alternative)

**Implementation**:
- Checks `Origin` header on all requests
- Returns 403 if origin not in whitelist
- Automatically allows localhost variations for development
- CORS headers added to all responses

## Files Modified

1. **`src/routes.ts`**:
   - Added `getAllowedOrigin()` function
   - Added `getCorsHeaders()` function
   - Added `checkRateLimit()` function
   - Added `getClientIdentifier()` function
   - Updated `jsonResponse()` to accept request parameter
   - Added CORS check at route entry
   - Added rate limiting for POST requests
   - Updated all `jsonResponse()` calls to include request

2. **`src/index.ts`**:
   - Added CORS origin checking for OPTIONS requests
   - Added CORS helper functions
   - Validates origin before processing requests

3. **`src/types.ts`**:
   - Added optional `RATE_LIMIT_KV` to Env interface

## Testing

### Test Rate Limiting:
```bash
# Make 21 requests quickly
for i in {1..21}; do
  curl -X POST https://your-worker.workers.dev/api/notes \
    -H "Content-Type: application/json" \
    -H "Origin: https://privatenote-ai.pages.dev" \
    -d '{"content":"test","iv":"test"}'
done
# 21st request should return 429
```

### Test CORS:
```bash
# Should work (allowed origin)
curl -X POST https://your-worker.workers.dev/api/notes \
  -H "Content-Type: application/json" \
  -H "Origin: https://privatenote-ai.pages.dev" \
  -d '{"content":"test","iv":"test"}'

# Should fail (disallowed origin)
curl -X POST https://your-worker.workers.dev/api/notes \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -d '{"content":"test","iv":"test"}'
# Returns 403
```

## Configuration

### Adjust Rate Limits
Edit `RATE_LIMIT` constant in `src/routes.ts`:
```typescript
const RATE_LIMIT = {
  MAX_REQUESTS: 50,      // Increase limit
  WINDOW_SECONDS: 300,   // 5 minute window
  KEY_PREFIX: 'rate_limit:',
};
```

### Add Allowed Origins
Edit `ALLOWED_ORIGINS` array in `src/routes.ts` and `src/index.ts`:
```typescript
const ALLOWED_ORIGINS = [
  'https://privatenote-ai.pages.dev',
  'https://your-custom-domain.com',  // Add your domain
  // ... existing origins
];
```

## Deployment

1. **Deploy Worker**:
   ```bash
   npm run deploy
   # or
   wrangler deploy
   ```

2. **No environment variables needed** - rate limiting uses existing `NOTES_KV`

3. **Optional**: Create separate KV namespace for rate limiting:
   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV"
   ```
   Then add to `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "RATE_LIMIT_KV"
   id = "your-namespace-id"
   ```

## Security Benefits

✅ **Prevents API abuse**: Limits requests per IP
✅ **Reduces costs**: Prevents storage spam
✅ **Protects against DDoS**: Rate limiting slows down attacks
✅ **CORS protection**: Only your domains can use the API
✅ **Maintains functionality**: Legitimate users unaffected

## Monitoring

Check Worker logs in Cloudflare Dashboard to see:
- `[ROUTES] ✅ Rate limit OK. Remaining: X` - Normal requests
- `[ROUTES] ❌ Rate limit exceeded` - Blocked requests
- `[ROUTES] ❌ CORS: Origin not allowed` - Blocked origins

