# Auth Testing Checklist (Detailed)

## Quick Links (UI)
- `/auth` — Unified sign-in / signup entry
- `/auth/magic` — Magic link consume
- `/auth/recovery` — Recovery code sign-in
- `/auth/backup` — Backup email verify
- `/account/security` — Security dashboard

## API Endpoints (Reference)
- `POST /api/auth/magic/send`
- `GET /api/auth/magic/consume?token=...`
- `GET /api/auth/me`
- `POST /api/auth/webauthn/register/options`
- `POST /api/auth/webauthn/register/verify`
- `POST /api/auth/webauthn/login/options`
- `POST /api/auth/webauthn/login/verify`
- `POST /api/auth/webauthn/stepup/options`
- `POST /api/auth/webauthn/stepup/verify`
- `GET /api/auth/passkeys`
- `POST /api/auth/passkeys/reset`
- `GET /api/auth/sessions`
- `POST /api/auth/sessions/revoke`
- `POST /api/auth/backup/start`
- `GET /api/auth/backup/verify?token=...`
- `GET /api/auth/recovery-codes/status`
- `POST /api/auth/recovery-codes/generate`
- `POST /api/auth/recovery/consume`

## Prereqs (One-Time)
- [ ] `AUTH_DB` is bound on the Worker
- [ ] Resend configured: `AUTH_EMAIL_PROVIDER=resend`, `AUTH_EMAIL_FROM`, `RESEND_API_KEY`
- [ ] Turnstile configured: `TURNSTILE_SECRET_KEY` + `VITE_TURNSTILE_SITE_KEY`
- [ ] Pages deployed with latest UI bundle

## Auth Entry (Unified)
- [ ] `/auth` loads and shows “Continue with email”
- [ ] With Turnstile enabled, widget renders and token is required
- [ ] Submit valid email → toast shows “Check your email”
- [ ] Submit invalid email → same generic response (no enumeration)
- [ ] Response timing looks similar for valid/invalid
- [ ] “Didn’t receive email? Check for typos.” returns to form
- [ ] “Use a recovery code” link goes to `/auth/recovery`

## Magic Link
- [ ] Existing email → email arrives via Resend, link signs in
- [ ] New email → pending user created, magic link activates to active
- [ ] Token reuse fails (single use)
- [ ] Expired token returns “expired/invalid”
- [ ] `/api/auth/magic/consume` sets session cookie

## Passkeys (WebAuthn)
- [ ] Passkey nudge appears after magic link success (`/auth/magic`)
- [ ] Register passkey succeeds (same device)
- [ ] Hybrid flow works (QR / cross-device)
- [ ] Login with passkey works from `/auth`
- [ ] `GET /api/auth/passkeys` returns labels
- [ ] Labels map: `internal` → Local Device, `usb|nfc|ble` → Security Key

## Step-up (Sensitive Actions)
- [ ] Step-up challenge works via `/api/auth/webauthn/stepup/*`
- [ ] Step-up required for backup email update
- [ ] Step-up required for recovery code generation
- [ ] Step-up required for reset passkeys

## Recovery Codes
- [ ] Generate codes after step-up → codes displayed once
- [ ] Refresh hides codes (not retrievable)
- [ ] Valid code signs in via `/auth/recovery`
- [ ] Reuse of code fails
- [ ] Backup email can be used for recovery (if verified)

## Backup Email
- [ ] Add backup email triggers verification email
- [ ] Backup verify link `/auth/backup` works
- [ ] Backup email shows verified in `/account/security`

## Sessions
- [ ] Session created on magic link login
- [ ] Session created on passkey login
- [ ] `/account/security` shows device, geo, last active
- [ ] Revoke session logs out target device
- [ ] Sliding TTL extends on activity (expires_at updates)
- [ ] Absolute TTL enforced (90 days; simulate via DB edit)

## Security Dashboard
- [ ] `/account/security` loads when signed in
- [ ] Not signed in → prompt to sign in
- [ ] “Reset passkeys” removes all passkeys after step-up
- [ ] Recovery codes section shows remaining + last generated time

## Regression
- [ ] Note create/read still works
- [ ] CORS works for Pages domain + Worker
