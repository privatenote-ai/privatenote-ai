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

## Tool: `create_private_note`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | string | required | The text to encrypt |
| `expiresIn` | `15m` \| `1h` \| `24h` \| `7d` | `24h` | How long the note stays accessible |
| `burnAfterReading` | boolean | `true` | Destroy after first view |
| `title` | string | — | Optional title prepended before encryption |

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
