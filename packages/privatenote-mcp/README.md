# privatenote-mcp

A local [Model Context Protocol](https://modelcontextprotocol.io/) server for [Cursor](https://cursor.com) that lets the AI agent create end-to-end encrypted [PrivateNote](https://privatenote.ai) links — **without giving the AI the secrets**.

**Agent = orchestration. This process = secret handling. You = approval of the exact bytes and destination. Slack / Discord / Teams / email / WhatsApp = delivery.**

## How it works

```
Cursor agent  →  privatenote-mcp (local)  →  PrivateNote API
                      ↓ AES-256-GCM encrypt
                ciphertext + IV + AAD       (no plaintext, no key)
                ← ← ← ← ← ← ← ← ← ← note ID
  secureUrl = https://privatenote.ai/note/{id}#{decryption-key}
                                               ↑
                                 key in fragment only — server never sees it
```

The agent should pass **local file paths**, not file bytes. `create_private_note` **prepares** a note: it canonicalizes paths, hashes file bytes, and returns a preview, not a URL. After you approve, `confirm_private_note({ confirmationId })` re-opens that same file, verifies device/inode/size/SHA-256, and encrypts those bytes. Do not open those files with other tools first.

Confirmation authorizes **exact bytes + exact PrivateNote options + exact destination**. If the file changed, the token is consumed and the agent must start a new preview.

If the MCP host supports elicitation, Accept on that dialog creates the link. Otherwise the agent shows the preview and waits for your next message before `confirm_private_note`. Sending still needs a destination on the preview; creating a link is not authorization to send it.

Creating a note is not authorization to send it. Pass `sendChannel` and `sendRecipient` at preview so the human sees the exact destination. `confirm_private_note` cannot substitute another recipient. If no destination was approved, `sendAuthorized` is `false`.

`secureUrl` is a bearer capability (possession may unlock the note). This MCP host returns it in the tool result, so the agent can observe it even though it cannot observe plaintext file contents. It is redacted from logs and errors.

Do **not** set `PRIVATENOTE_MCP_ALLOW_ONE_SHOT` on a host that can also send email, Slack, Discord, WhatsApp, or files. One-shot skips your preview of the exact bytes and destination. Path allowlisting is not a substitute. See [One-shot (privileged exception)](#one-shot-privileged-exception).

Paths are constrained: by default only files under the current working directory (usually the workspace) can be encrypted. Set `PRIVATENOTE_MCP_ALLOWED_ROOTS` to add directories. Credential locations (`~/.ssh`, `~/.aws`, `~/.gnupg`, cloud/Kubernetes/Docker config, the MCP session file) are **always blocked**, even if you allow `$HOME` or `/`.

The decryption key is generated locally and embedded **only** in the URL fragment. Browsers never send fragments to servers. The PrivateNote API stores only an encrypted blob.

## Install in Cursor

Add this to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}
```

Restart Cursor. The server downloads and caches automatically — no manual install needed.

If Cursor started this server with cwd set to your home directory or `/`, file tools refuse every path until you set `PRIVATENOTE_MCP_ALLOWED_ROOTS` to the folders you actually want to share from (colon-separated on macOS/Linux, semicolon-separated on Windows). Credential directories stay blocked even if you allow `$HOME` or `/`.

## Usage

Once connected, ask for a **path-based** handoff (private-first). Do not paste the secret into the prompt if a file exists:

> *"Send Mark the database password from /absolute/path/secrets/db-password.txt over WhatsApp. Make it read-once and expire it tomorrow. Don't read the file into the chat."*

The agent calls `create_private_note` with `contentFilePath`, shows you a preview, then `confirm_private_note` after you approve:

```json
{
  "status": "created",
  "noteId": "550e8400-…",
  "secureUrl": "https://privatenote.ai/note/550e8400-…#abc123…",
  "expiresAt": "2026-05-20T14:00:00.000Z",
  "burnAfterReading": true,
  "sendAuthorized": false
}
```

Share the `secureUrl` with whoever needs to read it. It self-destructs after the first view.

To attach files or wrap with a passphrase, sign in first, then pass `filePath` / `filePaths` / `passwordFilePath`. Send any passphrase separately from the link.

> *"Sign in to PrivateNote, then attach /absolute/path/contract.pdf and /absolute/path/nda.pdf. Protect them with the password in /absolute/path/client-password.txt. Don't expose the files or password to the model."*

## Tools

### `sign_in` / `whoami` / `sign_out`

Browser approve sign-in. The first `sign_in` opens `verificationUriComplete` (the grant is in the URL — there is no code for the user or agent to type). After they click Approve, call `sign_in` again with `pollDeviceCode`. A plugin session is stored at `~/.config/privatenote/mcp-session.json` and sent as `Authorization: Bearer`. It does **not** replace your website cookie session.

Signed-in **Business** notes apply your account reveal branding (logo, colors, sender). The API snapshots it from the account; the model never supplies branding assets. Unsigned notes stay unbranded.

### `create_private_note`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | string | — | LAST RESORT text. Prefer `contentFilePath`. |
| `contentFilePath` | string | — | UTF-8 file whose contents become the note body. Workspace / `PRIVATENOTE_MCP_ALLOWED_ROOTS` only. Do not read it first. |
| `expiresIn` | `5m` \| `10m` \| `15m` \| `30m` \| `1h` \| `2h` \| `8h` \| `24h` \| `1d` \| `3d` \| `7d` \| `14d` \| `15d` \| `30d` | `24h` | Lifetime (`24h` = `1d`). Server plan caps still apply. |
| `burnAfterReading` | boolean | `true` | Destroy after first view |
| `title` | string | — | Optional title prepended before encryption |
| `filePath` | string | — | One local file to attach (`sign_in` required). Same path allowlist. Do not read it first. |
| `filePaths` | string[] | — | Additional files to attach (`sign_in` required, max 20) |
| `passwordFilePath` | string | — | UTF-8 file with the reveal passphrase (Argon2id wrap). Same path allowlist. Prefer this over `password`. |
| `password` | string | — | LAST RESORT passphrase. Send it separately from the link. |
| `requireRecipientVerification` | boolean | — | Reader must verify `recipientEmail` before unlock (`sign_in`, paid). Does not send mail. |
| `recipientEmail` | string | — | Email for the verification gate (not a secret) |
| `notifyOnOpen` | boolean | — | Email your account when opened (`sign_in`, paid, verified sender email) |
| `label` | string | — | Activity label on the sent-note row |
| `sendChannel` | `email` \| `slack` \| `discord` \| `teams` \| `whatsapp` | — | Bound with `sendRecipient` at preview. Required to authorize delivery. |
| `sendRecipient` | string | — | Exact destination for `sendChannel`. Confirm cannot change it. |

### `confirm_private_note`

Creates the encrypted link after you approve the preview. Does nothing without a valid `confirmationId` from `create_private_note`. Tokens are cryptographically random (`cnfg_…`), single-use, expire after 5 minutes, and are consumed as soon as confirm starts — even if hashing or upload later fails.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `confirmationId` | string | — | Id from the pending preview. Do not resupply path, recipient, channel, expiry, or destruction options. |

### `list_sent_notes` / `revoke_sent_note`

Requires `sign_in` and a paid plan. List recent sent notes as **events** (id, status, `openedAt`) — not contents. Revoke an **unopened** note so the link no longer works. Poll `list_sent_notes` after delivery to see if the recipient opened the link. `notifyOnOpen` also emails the signed-in account; there is no push webhook into the agent.

## Privacy & security

- **Local encryption only** — `AES-256-GCM` with a fresh key per note, generated on your machine
- **Key never sent to server** — lives exclusively in the URL fragment
- **Path allowlist** — only files under the workspace or `PRIVATENOTE_MCP_ALLOWED_ROOTS`; SSH keys, cloud creds, and the session file are always blocked
- **Confirm before create+send** — by default `create_private_note` returns a preview, not a URL. One approval (host Accept, or your next message then `confirm_private_note`) encrypts the bound bytes. Creating a note is not authorization to send it; `sendAuthorized` is true only if the preview named a destination.
- **Business branding** — when signed in, create requests your account reveal-page branding. The API rebuilds the snapshot from the Business account (not from the model).
- **Bearer URL** — `secureUrl` is redacted from logs and errors. The current host still returns it in the tool result, so the agent can observe the capability even though it cannot observe plaintext.
- **No plaintext logged** — the server, error messages, and console output never contain your content
- **Burn after reading** — default `true`; the note is deleted after the first view
- **Requires Node 18+** — uses the built-in Web Crypto API (`globalThis.crypto`)

## One-shot (privileged exception)

`PRIVATENOTE_MCP_ALLOW_ONE_SHOT=1` in `mcp.json` makes `create_private_note` return `secureUrl` in one call. The flag is frozen when the MCP process starts. The agent cannot enable it as a tool argument. Changing the env later has no effect until you restart the server.

**Leave it unset** unless you run a tightly scoped automation host with **no** send tools (email, Slack, Discord, WhatsApp, or file delivery). Combined with send permissions, one-shot is a confused-deputy: the model can encrypt the wrong file and dispatch the link in one turn. Path allowlisting and deny rules still apply; they are not enough.

```json
{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"],
      "env": {
        "PRIVATENOTE_MCP_ALLOW_ONE_SHOT": "1"
      }
    }
  }
}
```

`sendAuthorized` is true only if that same one-shot call bound `sendChannel` and `sendRecipient`.

## Limitations

- `burnAfterReading: false` (multi-view) requires a [PrivateNote Premium](https://privatenote.ai) account
- Rate limits apply the same as browser-created notes
- File attach, recipient verification, and open notifications require a signed-in PrivateNote account (paid plan for gates and alerts; sender email must be verified for `notifyOnOpen`)

## Local dev / self-hosted

To point the MCP at a local PrivateNote instance:

```json
{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"],
      "env": {
        "PRIVATENOTE_API_BASE_URL": "http://127.0.0.1:8787",
        "PRIVATENOTE_WEB_ORIGIN": "http://localhost:5173",
        "PRIVATENOTE_MCP_ALLOWED_ROOTS": "/absolute/path/to/your/project"
      }
    }
  }
}
```

## License

MIT
