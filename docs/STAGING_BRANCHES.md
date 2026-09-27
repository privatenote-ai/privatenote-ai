# Staging branches (`premium`, `develop`)

Use these git branches to test on Cloudflare Pages **before** merging to `main`.

| Git branch | Pages URL | Same-site staging URL |
|------------|-----------|------------------------|
| `premium` | https://premium.privatenote-ai.pages.dev | https://premium.privatenote.ai |
| `develop` | https://develop.privatenote-ai.pages.dev | — |
| `main` (production) | https://privatenote.ai / https://privatenote-ai.pages.dev | — |

## Same-site Safari uploads (required)

Safari drops large (~20 MB+) cross-site XHR bodies. encrypt.lu works because:

`https://encrypt.lu` → `https://relay.encrypt.lu` (same eTLD+1)

For staging, use:

`https://premium.privatenote.ai` → `https://upload-staging.privatenote.ai`

**Do not** rely on `*.pages.dev` → `upload-staging.privatenote.ai` for large Safari attachment tests (still cross-site).

### WORKING: Cloudflare HTTP/3 (QUIC) must not carry large Safari PUTs

Confirmed root cause of Safari ~30 MiB attach failing with `status: 0` in ~200 ms (Worker never logged the PUT), while curl 31 MiB to the same host succeeded:

Safari used **HTTP/3 / QUIC** (`Alt-Svc: h3`). Turning **HTTP/3 (with QUIC) Off** under **Speed → Settings → Protocol Optimization** on zone `privatenote.ai` fixed uploads.

Long-term: leave zone HTTP/3 on if desired, but add a Response Header Transform Rule that **removes `Alt-Svc`** for `upload-staging.privatenote.ai` and `upload.privatenote.ai` so the upload relay stays on HTTP/2.

App recipe (Bearer + XHR + `application/octet-stream` Blob, no chunking): see `.cursor/rules/attachment-blob-upload.mdc` (**WORKING COPY**).

### One-time: attach the custom domain

In Cloudflare Dashboard → Pages → `privatenote-ai` → Custom domains:

1. Add `premium.privatenote.ai`
2. Map it to the **`premium`** branch deployment
3. Confirm DNS (CNAME to the Pages target Cloudflare shows)
4. Add `premium.privatenote.ai` to the Turnstile widget hostname allowlist

Staging Worker `PUBLIC_WEB_APP_ORIGIN` is `https://premium.privatenote.ai` (`wrangler.staging.toml`). Redeploy the staging Worker after changing that var:

```bash
npx wrangler deploy -c wrangler.staging.toml
```

## Internal routes (staging + local dev only)

Not registered on production `privatenote.ai` / main Pages deploy:

- `/admin/*`, `/test-llm`, `/llm-ui`

Use **premium** or **develop** staging URLs (or `npm run dev`) for those tools — including `https://premium.privatenote.ai`.

## What works on staging (same as production Pages)

Configured in `shared/pagesAppHosts.ts` and `src/trustedOrigins.ts`:

- Same-origin `/api/*` proxy (`functions/api/[[path]].ts`) → Worker API
- Credentialed API / CSRF (trusted Origin)
- **Production session cookie** (`pn_session`), not preview-isolated cookie
- WebAuthn / passkeys (rpID = branch hostname / custom domain)
- Note create, magic link auth, Turnstile (if env + widget host allowlist are set)
- Binary attachments → `upload-staging.privatenote.ai` (not Pages `/api`, not `workers.dev`)

Ephemeral PR previews (`feat--xyz.privatenote-ai.pages.dev`) stay on the **preview** cookie and **no** WebAuthn — by design.

## Deploy

1. **GitHub Actions** — push to `premium` or `develop` runs `.github/workflows/deploy-pages-staging.yml` (same build as `main`, deploys to that branch name).
2. **Cloudflare Pages (optional)** — if the project is connected to Git, enable branch builds for `premium` and `develop` so dashboard deploys match.

## One-time Cloudflare checklist (required for full auth / Turnstile)

Copy **production** Pages environment variables to these branch deployments (or set for **Preview** if branches use preview env):

- `VITE_TURNSTILE_SITE_KEY` (and Worker `TURNSTILE_SECRET_KEY`)
- Do **not** set `VITE_API_URL` on Pages unless you intentionally bypass the same-origin proxy (leave empty for `/api` proxy).

**Turnstile widget** — in Cloudflare Turnstile dashboard, add hostnames:

- `premium.privatenote.ai`
- `premium.privatenote-ai.pages.dev`
- `develop.privatenote-ai.pages.dev`

**R2 model CORS** (on-device AI) — apply scripts if you test WebLLM on staging:

```bash
# After editing scripts/r2-cors-transformers-browser.json
npx wrangler r2 bucket cors put <bucket> --file scripts/r2-cors-transformers-browser.json
```

### Large attachments (≥ ~90 MB) — R2 direct upload (required for Premium 1 GB)

Cloudflare Free/Pro reject proxied request bodies above **~100 MB** with **413** (Safari often mislabels this as CORS). Premium’s plan limit is **1 GB**, so ciphertext at/above `NOTE_FILE_DIRECT_R2_MIN_BYTES` (90 MB) uses:

1. `POST /api/notes/:id/file/presign` → short-lived S3 PUT URL  
2. Browser XHR `PUT` Blob → `https://{accountId}.r2.cloudflarestorage.com/...` (Blob `type: application/octet-stream`; matches signed Content-Type)  
3. `POST /api/notes/:id/file/complete` → Worker checks R2 object size, stores client `chunkSha256` in KV (no full-object re-hash)  
4. Existing `POST /api/notes` finalize  

**One-time setup (staging):**

```bash
# 1) Create an R2 API token (Object Read & Write) for privatenote-files-staging-eu
npx wrangler secret put R2_ACCESS_KEY_ID -c wrangler.staging.toml
npx wrangler secret put R2_SECRET_ACCESS_KEY -c wrangler.staging.toml

# 2) Bucket CORS for browser PUTs
npx wrangler r2 bucket cors set privatenote-files-staging-eu \
  --file scripts/r2-cors-note-files-upload.json

# 3) Deploy Worker (vars R2_ACCOUNT_ID + R2_BUCKET_NAME are in wrangler.staging.toml)
npx wrangler deploy -c wrangler.staging.toml
```

Production: same secrets on `wrangler.toml`, CORS on `privatenote-files-eu`.

CSP already allows `https://*.r2.cloudflarestorage.com` in `connect-src`.

## Quick smoke test on staging

1. Open **https://premium.privatenote.ai** (same-site) for Safari attachment QA; pages.dev is fine for non-upload checks.
2. Create a note → should succeed (Turnstile + API).
3. `/auth/sign-in` → magic link or passkey (passkey uses rpID of the host you opened).
4. DevTools → Network: JSON `/api/*` same origin; binary `PUT …/file` → `upload-staging.privatenote.ai` (under ~90 MB ciphertext); larger files `PUT` → `*.r2.cloudflarestorage.com` after `/file/presign`.

### Magic links

- Request sign-in from the **stable staging URL** (`https://premium.privatenote.ai` or `https://develop.privatenote-ai.pages.dev`), not a one-off deployment hash like `https://958aa19e.privatenote-ai.pages.dev` from the Cloudflare dashboard.
- Set Worker `PUBLIC_WEB_APP_ORIGIN` to `https://premium.privatenote.ai` so emailed links stay on the same-site host.
- If a link 404s with “Did you forget to add the page to the router?”, redeploy `develop`/`premium` after pulling the Pages Functions for `/magic` (`functions/magic.ts`).

## Workflow

```bash
git checkout develop   # or premium
git merge main         # or cherry-pick features
git push origin develop
# Wait for GitHub Action → open https://develop.privatenote-ai.pages.dev
# For Safari uploads: open https://premium.privatenote.ai
```

Merge to `main` only after staging checks pass.
