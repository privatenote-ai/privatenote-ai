# PrivateNote for VS Code, Cursor & Codex

Send selected text as an **end-to-end encrypted [PrivateNote](https://privatenote.ai) link** — without your AI assistant ever seeing the secret.

Works in VS Code, [Cursor](https://cursor.com), and the [Codex IDE extension](https://developers.openai.com/codex/ide) (VS Code–compatible). For Codex agent workflows, also install the [PrivateNote Codex plugin](../privatenote-codex-plugin/) (MCP + skills).

Encryption happens entirely inside the editor on your local machine using `AES-256-GCM`. Only ciphertext reaches the PrivateNote API. The decryption key lives only in the link's URL fragment.

## Why use this instead of the AI agent?

If you ask an AI agent "send this secret as a PrivateNote", the AI provider's cloud servers read the secret to call the tool. With this extension, the secret never touches the AI at all:

| Method | Who sees the plaintext? |
|--------|------------------------|
| AI agent + MCP | You + your AI provider's servers + your machine |
| **This extension** | **You + your machine only** |

## Features

- **Selection-based** — highlight any text, right-click → *"PrivateNote: Send Selection…"*
- **Composer panel** — open a dedicated webview to paste secrets that aren't in a file
- **All choices local** — expiry, burn-after-reading, and title selection happen on your machine
- **Burn after reading by default** — single-use links unless you explicitly opt out
- **Self-hosted ready** — point at your own PrivateNote deployment via settings

## Quick start

1. Install from the marketplace (search for `PrivateNote`)
2. Open any file, select some text (e.g. an API key, a password)
3. Right-click → **PrivateNote: Send Selection as Encrypted Link**
4. Pick an expiry (15 min / 1 h / 24 h / 7 d)
5. The link is copied to your clipboard

Or open the composer:

- `Cmd+Shift+P` (`Ctrl+Shift+P` on Windows/Linux) → **PrivateNote: Compose New Note…**

**Codex IDE:** install this extension from the Marketplace, then install the [Codex plugin](../privatenote-codex-plugin/) for agent MCP + skills (`codex mcp add privatenote -- npx -y privatenote-mcp`).

## How it works

```
You select text
   ↓
Extension reads selection (locally, in-process)
   ↓
Generate AES-256-GCM key (locally, never leaves machine)
   ↓
Encrypt content with AAD binding (locally)
   ↓
POST ciphertext + IV + AAD  →  PrivateNote API
   ↓
                            ←  note ID
Build URL: privatenote.ai/note/{id}#{key}
                                   └──┬──┘
                          key in fragment, never transmitted
   ↓
Copy URL to your clipboard
```

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `privatenote.apiBaseUrl` | `https://privatenote.ai` | API host (change for self-hosting) |
| `privatenote.webOrigin` | `https://privatenote.ai` | Origin used in shareable links |
| `privatenote.defaultExpiresIn` | `24h` | Default expiry duration |
| `privatenote.defaultBurnAfterReading` | `true` | Default to single-use links |

## Threat model

**What the extension protects:**

- The PrivateNote server never sees your plaintext
- Anyone intercepting traffic to privatenote.ai cannot decrypt
- The note self-destructs after the first view (default)
- Your AI assistant is not involved — the secret stays on your machine

**What it does not protect:**

- A compromised local machine (the plaintext exists in memory during encryption)
- The recipient's environment (once they open the link, they have the text)
- Network observers seeing *that* a note was created (timing/size metadata)
- Screenshots — once read, the recipient can save the content

## Limitations

- Password-protected notes are not supported in v1 (single-key encryption only)
- Multi-read notes (2+ views) require a [PrivateNote Premium](https://privatenote.ai) account
- Max content size: 50 KB
- Rate limits on `/api/notes` apply

## License

MIT
