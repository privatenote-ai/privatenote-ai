# privatenote-mcp

A local [Model Context Protocol](https://modelcontextprotocol.io/) server for [Cursor](https://cursor.com) that lets the AI agent create end-to-end encrypted [PrivateNote](https://privatenote.ai) links — without any plaintext ever leaving your machine.

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

## Usage

Once connected, ask the Cursor agent naturally:

> *"Create a PrivateNote for this secret: sk_live_abc123. Expire it in 1 hour."*

The agent calls `create_private_note` and returns:

```json
{
  "secureUrl": "https://privatenote.ai/note/550e8400-…#abc123…",
  "expiresAt": "2026-05-20T14:00:00.000Z",
  "burnAfterReading": true
}
```

Share the `secureUrl` with whoever needs to read it. It self-destructs after the first view.

To attach a file, sign in first, then pass a local `filePath` (the file is encrypted in this process; do not paste file bytes into the chat):

> *"Sign in to PrivateNote, then attach ~/Desktop/contract.pdf to a new note."*

## Tools

### `sign_in` / `whoami` / `sign_out`

Device-code sign-in. The MCP server opens `https://privatenote.ai/auth/device`, you approve in the browser, and a plugin session token is stored at `~/.config/privatenote/mcp-session.json`. That token is sent as `Authorization: Bearer` and does **not** replace your website cookie session.

If approval takes longer than three minutes, call `sign_in` again with the returned `pollDeviceCode`.

### `create_private_note`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | string | — | Text to encrypt (optional when `filePath` is set) |
| `expiresIn` | `15m` \| `1h` \| `24h` \| `7d` | `24h` | How long the note stays accessible |
| `burnAfterReading` | boolean | `true` | Destroy after first view |
| `title` | string | — | Optional title prepended before encryption |
| `filePath` | string | — | Local file to encrypt and attach (`sign_in` required) |

## Privacy & security

- **Local encryption only** — `AES-256-GCM` with a fresh key per note, generated on your machine
- **Key never sent to server** — lives exclusively in the URL fragment
- **No plaintext logged** — the server, error messages, and console output never contain your content
- **Burn after reading** — default `true`; the note is deleted after the first view
- **Requires Node 18+** — uses the built-in Web Crypto API (`globalThis.crypto`)

## Limitations

- Password-protected notes are not supported in v1 (requires browser-only argon2)
- `burnAfterReading: false` (multi-view) requires a [PrivateNote Premium](https://privatenote.ai) account
- Rate limits apply the same as browser-created notes
- File attach requires a signed-in PrivateNote account

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
        "PRIVATENOTE_WEB_ORIGIN": "http://localhost:5173"
      }
    }
  }
}
```

## License

MIT
