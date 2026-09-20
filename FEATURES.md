# PrivateNote.ai product features

Living catalog of everything the web product currently ships. Use this to track iOS parity.

**How to update:** every PR that adds, changes, or removes a user-facing capability must update this file in the same PR. Describe what differs from the previous state (new, changed, or removed), including plan gating if it changed.

CI enforces this (`FEATURES.md` job on pull requests). If capability files change and this file does not, the check fails. Skip a false positive with the PR label `skip-features-md`, or `[skip-features]` in the title.

Baseline date: 2026-09-14.

**Changed:** Delayed reveal is now **Scheduled reveal** in the UI, pricing, and docs. Same behavior (`opensAt`).

**Changed:** Account preferred language accepts every PrivateNote UI language (`en`, `de`, `fr`, `es`, `it`, `nl`, `pt`, `sr`, `hr`, `tr`, `pl`), not only English, German, French, and Spanish.

**Changed:** IBM Plex Serif is a Business-only reveal typeface.

**Changed:** First-party analytics now measures engaged time (idle tabs excluded), landing-page funnels, and same-session recipient→sender rates as aggregates only. No session ID, visitor ID, or advertising tracker is stored.

**Changed:** Recipient **Create New Note** clicks after a reveal are counted as an aggregate (clicks / reveals), not as unique people or per-note identities.

Tagline: **Share secrets. Leave no trail.**

Site: https://privatenote.ai

---

## Security model (applies to every client)

- End-to-end encryption before upload. The server stores ciphertext only.
- Standard notes: browser / client Web Crypto **AES-GCM**.
- Password-protected notes: **Argon2id** key derivation, then AES-GCM.
- File / photo / voice / video attachments: **libsodium**, chunked; filename and metadata are encrypted.
- Share URL shape: `https://privatenote.ai/note/{id}#{decryption-key}`.
- The fragment (`#…`) stays on the device. Browsers do not send it to servers.
- Anyone with the full link (and password, if set) can open the note.
- Recipients can still copy, screenshot, download, or forward after access. Read-once and expiry reduce leftover copies; they do not stop a determined recipient.
- Recipients never need an account.
- Destroyed or expired notes cannot be recovered.
- Authentication data, encrypted notes, and operational records live in **EU-jurisdiction** infrastructure.
- Password-breach checks use Have I Been Pwned **k-anonymity** (hash prefix only).
- Hosted web app / API backend is not fully open source. Client encryption, shared crypto, CLI, MCP, Chrome, VS Code/Cursor, and Codex tooling are public.

---

## Plans

Business is **one professional account**, not team seats. Stripe charges **USD or EUR** by region. Annual is two months free versus monthly.

| | Free | Starter | Business |
|---|---|---|---|
| Price | $0 | $4 / €4 month, $40 / €40 year | $12 / €12 month, $120 / €120 year |
| Account required to send a basic text note | No | Yes (paid) | Yes (paid) |
| Account required to open a link | Never | Never | Never |
| Account required to attach files | Yes (free account) | Yes | Yes |
| Note body (UTF-8) | 50 KB | 200 KB | 500 KB |
| Per-file limit | 25 MB | 250 MB | 1 GB |
| Files per transfer | 5 | 10 | 20 |
| Combined transfer size | 25 MB | 250 MB | 1 GB |
| Transfers / UTC month | 10 | 50 | Unlimited |
| Active encrypted payload buffer | 250 MB | 5 GB | 50 GB |
| Max expiry | 3 days | 15 days | 30 days |
| Open counts | 1 (read-once) | 1, 2, 3 | 1, 2, 3, 5, 10 |
| Attachment access after open | 15 min, 1 hour | + 4 hours | + 24 hours |
| Voice / video recording length | 5 min | 15 min | 30 min |
| Hosted AI drafts / month | 3 | 50 | 300 |

EU/EEA 14-day withdrawal for paid subscriptions via support@privatenote.ai. Existing notes keep the conditions they were created with after a plan change.

---

## Create a note (composer)

Home composer. Write text, attach files, take a photo, or record voice/video. Encrypts locally, then returns a shareable link.

### Content

- Plaintext note body with UTF-8 size meter (plan cap).
- Drag-and-drop files (gravity drop zone).
- Attach files (requires signed-in account).
- Attach a **folder**.
- **Take a photo** (LaunchDarkly flag `take-a-photo`): camera capture, crop before encrypt, strip identifying details in the frame.
- **Record voice message**: in-browser MediaRecorder, waveform playback.
- **Record video message**: camera + microphone, same recorder dialog (`audio` / `video` modes).
- Voice format preference: Auto, WAV (max compatibility), M4A (smaller, Safari-friendly; Starter+).
- Multiple attachments in one transfer, up to plan count and combined size.
- Partner prefill (e.g. passwords.lu) can stamp trusted-partner reveal branding when the sender has none.

### Access controls

- **Note lifetime** presets: 5m, 10m, 15m, 30m, 1h, 2h, 8h, 1d, 3d, 7d, 14d, 15d, 30d. Plan caps which presets can be submitted.
- **Open limit**: once (free); 2–3 (Starter); 5 or 10 (Business).
- **Access after opening** (attachment download window): 15 minutes, 1 hour, 4 hours, 24 hours.
- **File access**: View + download, or **View only** (Business; hides download; screenshots still possible).
- **Password**: optional extra gate. Recipients need it to decrypt.
  - Show / hide / copy
  - Generate **simple** (human-friendly words) or **strong** (transport-safe charset)
  - Strength meter
  - HIBP breach check (k-anonymity)
  - Partner footer when a generated password is used

### Notification Center (per note)

Requires signed-in verified email for alerts.

- Email alert when note is **opened** (and destroyed, for read-once).
- Separate open vs destroyed alerts when open limit > 1.
- Email alert when **attachment / recording is downloaded**.
- Alert destinations (paid): account email and/or a custom email.
- **Unopened reminder** (Business): email if still unopened after 24 / 48 / 72 hours.
- **Note label**: private name stored on **this device only**. Never uploaded with the note. Used in Activity / Notification Center.

### Delivery and verification (Starter+)

- **Recipient verification**: one-time code emailed to a specified address before reveal. Recipient does not need an account.
- **Email link to recipient**: PrivateNote emails the secret link. Email is **not** end-to-end encrypted. Sender email must be verified.
- **Scheduled reveal**: do not allow opening before a chosen local datetime (stored as UTC). Must be before note lifetime ends.
- **Require receipt confirmation**: recipient confirms after successful decrypt. Starter uses a default statement; Business can pick presets or write custom text (max 180 characters).
  - Presets: “Message received”, “Credentials received”, “Received and reviewed”.

### Reveal look

- **Reader language**: Auto (recipient browser) on Free; lock to a specific UI language on Starter+.
- **Message typeface** (snapshotted on the note):
  - Free: Inter, Satoshi
  - Starter+: Source Serif 4, Fraunces, JetBrains Mono
  - Business: IBM Plex Serif

### Recipient branding (Business)

- Toggle applying saved company branding on this note.
- If entitled but not configured, link to Account → Branding.

### Saved defaults (Starter+)

- “Save these as my defaults” from the settings panel.
- Also editable under Account → Preferences (expiry, open limit, file window, reader language, body font, notify on open, recipient verification). Reset to standard defaults.

---

## After create (success screen)

- Copy link, native share (`navigator.share`), QR code show/hide and share as image.
- Copy / share the note password out of band (never sent to the server).
- Optional: email the link to a recipient from the success page (Starter+, verified email).
- Show whether the link was already emailed.
- Success metadata: expiry, burn/open limit, password set, etc.

---

## Reveal (recipient, `/note/:id`)

No navbar/footer. Anonymous. Click-to-reveal is always on.

### Gates (in order, as applicable)

1. **Click to reveal** — page load is not a read. Chat/iMessage/Slack previews do not consume the view or get plaintext. Ciphertext is fetched only after a deliberate Reveal tap.
2. **Scheduled reveal** — if `opensAt` is in the future, wait.
3. **Password** — unwrap ciphertext with Argon2id.
4. **Recipient verification code** — emailed one-time code.
5. Decrypt and show the note.
6. **Receipt acknowledgment** — optional confirm after decrypt.

### Revealed content

- Note body in the chosen typeface.
- Secure attachment viewer: images, PDF, audio (waveform), video, text.
- Previous / next attachment.
- Download (unless view-only).
- Business **branded portal**: logo, sender name/role, company, trust message, accent/background/banner, card placement, overlay, note-text border color.
- Copy note text.
- Errors: expired, already opened / burned, revoked, incomplete link (missing `#key`), decrypt failure.

---

## Account

| Route | What it is |
|---|---|
| `/auth/sign-in`, `/auth/sign-up` | Email magic link + code (10 min), or passkey |
| `/auth/magic`, `/magic` | Consume magic link |
| `/auth/totp` | 2-step verification challenge |
| `/auth/recovery` | Recovery codes |
| `/auth/email-change` | Confirm email change |
| `/auth/device` | Device-code approve for MCP / Chrome (no code to type; grant is in the URL) |
| `/extension/connected` | Chrome extension connected landing |
| `/account` | Overview: plan, billing portal, theme, branding shortcut |
| `/account/activity` | Sent-notes dashboard, proof of access, revoke unopened, labels |
| `/account/preferences` | Theme, language, note defaults, hosted AI preference, voice format |
| `/account/branding` | Business reveal branding studio |
| `/account/security` | Passkeys, TOTP, recovery codes, sessions, change email, delete account |

### Auth and security

- Magic-link email with one-tap link **and** 6-digit code (expires in 10 minutes or when a new code is requested).
- Passkeys (WebAuthn), including discoverable credentials.
- TOTP 2-step verification (setup QR / secret, disable).
- Recovery codes (generate, remaining count; step-up with passkey or TOTP).
- Change email (confirm via emailed link).
- Sessions: list devices, revoke one, log out of all other devices.
- Step-up auth for sensitive actions.
- Delete account.
- Theme: light / dark / system.
- Preferred UI language stored on the account (same set as the product UI: English, German, French, Spanish, Italian, Dutch, Portuguese, Serbian, Croatian, Turkish, Polish).

### Activity / Notification Center (Starter+ for dashboard and revoke)

- List sent notes as **events**, never contents: created, opened, expired, destroyed, revoked, receipt confirmed.
- Chips: voice, attachment, password, expiry, open limit, alerts, verification, receipt.
- Proof-of-access timeline (coarse: when opened, device class, browser — not IP as a product promise).
- Revoke an **unopened** note (Starter+).
- Device-only labels; Business can export / load / share labels as a portable file or PrivateNote (still never note content).

### Branding studio (Business)

- Company name, sender name, sender role, trust message.
- Logo, banner / card-banner images.
- Accent, background, text, and note-border colors.
- Background style (neutral, gradient, glow, mesh, vignette, banner image).
- Overlay, zoom, focal point, card position (desktop + mobile).
- Show branding after open vs. only on the gate.
- Live preview of the recipient portal.

### Billing

- Stripe Checkout (monthly / yearly, USD / EUR).
- Customer portal: invoices, receipts, cancel at period end, renew.
- Entitlement states: free, active, trialing, grace, manual grant, expired. Paid access fails closed without a future period end.

---

## AI (opt-in; regular notes never send plaintext to a model)

- **On-device models** (WebGPU / WebLLM) when the browser can run them. iOS WebKit: Qwen 0.6 only; Gemma 2 2B is not auto-offered (crash risk). Local mobile Transformers path is disabled on iOS.
- Modes: improve, summarize, secure, ask. Sentence-length control. Guided writing templates (localized).
- **Hosted cloud assist** (signed-in): monthly quota by plan (3 / 50 / 300). Cloudflare Turnstile when the server requires a challenge.
- Premium template packs (Starter+): Document Summary / Privacy Check, etc.
- Custom prompt templates saved in the browser (Business).
- Fallback templates when local model is unavailable.
- Preference: prefer hosted cloud after local failure.

---

## Password generator (`/password-generator`)

- Client-side only. Length, uppercase, lowercase, numbers, symbols, exclude similar characters.
- Copy, native share, generate again.
- **Share as a one-time encrypted note** (same E2EE pipeline). Success page with copy / share / QR.

---

## Developer integrations

Encryption stays local in every integration. Analytics records `creationSource`.

| Tool | What it does |
|---|---|
| **CLI** (`privatenote-cli`) | stdin/file → encrypted link. Flags: `--expire`, `--burn` / `--no-burn` (paid), `--title`, `--json`, `--output-url-only`, `--force-stdout`, `--api-base-url`, `--insecure` (local HTTP only). Refuses to print URLs to non-TTY stdout unless explicitly allowed. |
| **MCP** (`privatenote-mcp`) | Local agent tools. Paths, not file bytes. Preview then confirm. |
| **VS Code / Cursor / Codex IDE** | Sidebar compose, selection context menu, title-bar lock, clipboard copy. Expiry + burn. |
| **Chrome extension** | Toolbar popup, context menu on selected text, `Alt+Shift+P`, auto-copy link, settings (expiry, burn, theme, language). Device-code / identity sign-in. |
| **Codex plugin** | `codex mcp add privatenote -- npx -y privatenote-mcp` plus skills. |

### MCP tools

- `create_private_note` — preview only (unless administrator one-shot env). Bind expiry, burn, files, password file, recipient verification, notify on open, label, send channel/recipient.
- `confirm_private_note` — `{ confirmationId }` only. Single-use, ~5 min.
- `sign_in` / `whoami` / `sign_out` — browser Approve; session at `~/.config/privatenote/mcp-session.json`.
- `list_sent_notes` / `revoke_sent_note` — paid, signed in. Events, not contents.

Creating a note is **not** authorization to send it. `sendAuthorized` is true only if the preview named a destination.

Env: `PRIVATENOTE_API_BASE_URL`, `PRIVATENOTE_WEB_ORIGIN`, `PRIVATENOTE_ALLOWED_HOSTS`, `PRIVATENOTE_MCP_ALLOWED_ROOTS`. HTTPS required for remote APIs.

---

## Marketing and content surfaces

Localized marketing routes (prefix `/{lang}`): English canonical plus `de`, `fr`, `es`, `it`, `nl`, `pt`, `sr`, `hr`. UI also includes `tr` and `pl` (guides / extra locales).

| Path | Surface |
|---|---|
| `/` | Composer + product home |
| `/how-it-works` | Encryption, fragment keys, read-once, on-device AI |
| `/premium` | Plans and pricing |
| `/privnote-alternative` | Privnote alternative positioning |
| `/one-time-link` | One-time secret links |
| `/secure-file-transfer` | Encrypted attachments and folders |
| `/password-generator` | Generator + share |
| `/privacy-tools` | Directory of privacy tools |
| `/security-resources` | Guides hub |
| `/security-guides/vpn` | VPN guide |
| `/security-guides/password` | Password manager guide |
| `/developers`, `/developers/:id` | CLI, MCP, VS Code, Chrome, Codex |
| `/blog`, `/blog/category/:cat`, `/blog/:slug` | Blog |
| `/about`, `/contact`, `/privacy`, `/terms` | Company / legal |

Blog categories: secrets, encryption, developers, privacy, AI.

Admin (not a product feature for iOS): `/admin` (Cloudflare Access + token), blog admin, analytics, audit logs, internal LLM test pages.

---

## App chrome (all clients should match)

- Languages: English, German, French, Spanish, Italian, Dutch, Portuguese, Serbian (Latin), Croatian, Turkish, Polish.
- Theme: light, dark, system.
- Navbar hidden on `/note/*` and most `/auth/*` (shown on magic / email-change / totp).
- Lazy-route error boundary with stale-chunk reload.
- First-party page analytics (visits, engaged time, coarse funnel counts, and aggregate recipient Create New Note clicks after reveal; skipped on admin and iframes; no session ID or advertising).
- `llms.txt` / `llms-full.txt` for agents.

---

## iOS-specific notes from the web app

These are web-runtime constraints, not missing product features. Native iOS can implement the same product without them.

- Take-a-photo is gated by LaunchDarkly `take-a-photo`.
- Safari chunked uploads use a Safari-safe path.
- On-device AI: iOS WebKit is limited (Qwen 0.6 only; Transformers.js mobile path disabled). Hosted AI still works when signed in.
- M4A voice format is the Safari-friendly option; WAV is the compatibility fallback.
- Click-to-reveal exists specifically so iMessage / Mail link previews do not burn the note.

---

## Feature × plan matrix (quick)

| Capability | Free | Starter | Business |
|---|---|---|---|
| Create text note without account | Yes | — | — |
| Attach files / photo / voice / video | Yes* | Yes | Yes |
| Password on note | Yes | Yes | Yes |
| Open / destroy / download email alerts | Yes* | Yes | Yes |
| Reader language lock | Auto only | Yes | Yes |
| Inter / Satoshi typeface | Yes | Yes | Yes |
| Extra typefaces | — | Yes | Yes + IBM Plex Serif |
| Recipient verification | — | Yes | Yes |
| Email the link | — | Yes | Yes |
| Scheduled reveal | — | Yes | Yes |
| Receipt acknowledgment | — | Yes | Yes + custom statement |
| Sent-notes dashboard | — | Yes | Yes |
| Revoke unopened | — | Yes | Yes |
| Proof of access | — | Yes | Yes |
| Saved note defaults | — | Yes | Yes |
| Premium AI templates | — | Yes | Yes |
| Voice format picker | Auto/WAV | + M4A | + M4A |
| View-only attachments | — | — | Yes |
| Reveal branding | — | — | Yes |
| Custom AI templates | — | — | Yes |
| Unopened reminder | — | — | Yes |
| Note-label portability | — | — | Yes |

\* File attach and email alerts require a signed-in, verified free account.
