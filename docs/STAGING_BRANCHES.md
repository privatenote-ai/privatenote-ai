# Staging branches (`premium`, `develop`)

Use these git branches to test on Cloudflare Pages **before** merging to `main`.

| Git branch | Pages URL |
|------------|-----------|
| `premium` | https://premium.privatenote-ai.pages.dev |
| `develop` | https://develop.privatenote-ai.pages.dev |
| `main` (production) | https://privatenote.ai / https://privatenote-ai.pages.dev |

## Internal routes (staging + local dev only)

Not registered on production `privatenote.ai` / main Pages deploy:

- `/admin/*`, `/test-llm`, `/llm-ui`

Use **premium** or **develop** staging URLs (or `npm run dev`) for those tools.

## What works on staging (same as production Pages)

Configured in `shared/pagesAppHosts.ts` and `src/trustedOrigins.ts`:

- Same-origin `/api/*` proxy (`functions/api/[[path]].ts`) → Worker API
- Credentialed API / CSRF (trusted Origin)
- **Production session cookie** (`pn_session`), not preview-isolated cookie
- WebAuthn / passkeys (rpID = branch hostname)
- Note create, magic link auth, Turnstile (if env + widget host allowlist are set)

Ephemeral PR previews (`feat--xyz.privatenote-ai.pages.dev`) stay on the **preview** cookie and **no** WebAuthn — by design.

## Deploy

1. **GitHub Actions** — push to `premium` or `develop` runs `.github/workflows/deploy-pages-staging.yml` (same build as `main`, deploys to that branch name).
2. **Pull requests** — opening a PR to `main` or `develop` runs `.github/workflows/pr-check.yml` (full `build:prerender` + unit tests, no deploy).
3. **Cloudflare Pages (optional)** — if the project is connected to Git, enable branch builds for `premium` and `develop` so dashboard deploys match.

## One-time Cloudflare checklist (required for full auth / Turnstile)

Copy **production** Pages environment variables to these branch deployments (or set for **Preview** if branches use preview env):

- `VITE_TURNSTILE_SITE_KEY` (and Worker `TURNSTILE_SECRET_KEY`)
- Do **not** set `VITE_API_URL` on Pages unless you intentionally bypass the same-origin proxy (leave empty for `/api` proxy).

**Turnstile widget** — in Cloudflare Turnstile dashboard, add hostnames:

- `premium.privatenote-ai.pages.dev`
- `develop.privatenote-ai.pages.dev`

**R2 model CORS** (on-device AI) — apply scripts if you test WebLLM on staging:

```bash
# After editing scripts/r2-cors-transformers-browser.json
npx wrangler r2 bucket cors put <bucket> --file scripts/r2-cors-transformers-browser.json
```

## Quick smoke test on staging

1. Open the branch URL (e.g. https://develop.privatenote-ai.pages.dev).
2. Create a note → should succeed (Turnstile + API).
3. `/auth/sign-in` → magic link or passkey (passkey uses rpID `develop.privatenote-ai.pages.dev` or `premium…`).
4. DevTools → Network: `/api/*` should be **same origin**, not `workers.dev`.

### Magic links

- Request sign-in from the **stable branch URL** (`https://develop.privatenote-ai.pages.dev`), not a one-off deployment hash like `https://958aa19e.privatenote-ai.pages.dev` from the Cloudflare dashboard.
- Set Worker `PUBLIC_WEB_APP_ORIGIN` to that branch URL (e.g. `https://develop.privatenote-ai.pages.dev`) so emailed links stay on the branch host even if you briefly used a preview URL.
- If a link 404s with “Did you forget to add the page to the router?”, redeploy `develop` after pulling the Pages Functions for `/magic` (`functions/magic.ts`).

## Workflow

```bash
git checkout develop   # or premium
git merge main         # or cherry-pick features
git push origin develop
# Wait for GitHub Action → open https://develop.privatenote-ai.pages.dev
```

Open a PR to `develop` or `main` to run the PR check workflow before merge.

Merge to `main` only after staging checks pass.
