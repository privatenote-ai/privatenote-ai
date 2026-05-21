# Sharing Secrets Without Regret: PrivateNote for Developers

*End-to-end encrypted, self-destructing notes — directly from your editor, your AI agent, or your browser.*

---

You have a secret to share. A Stripe key. A database password. An SSH credential. A staging API token.

You could paste it into Slack. You could email it. You could drop it into a shared doc.

Or you could send a link that encrypts the secret on your machine, never shows the server the key, burns itself the moment it's read, and leaves nothing behind.

That's PrivateNote. Here's every way to use it — starting with the one that takes 30 seconds to set up.

---

## The easiest path: VS Code / Cursor / Codex IDE extension

If you work in VS Code, Cursor, or the Codex IDE extension, this is the cleanest integration. Install once, use it without ever leaving your editor.

### Install

Open the Extensions panel (`Cmd+Shift+X`), search **PrivateNote**, and click Install.

Or from the command line:

```bash
cursor --install-extension PrivateNote.privatenote-vscode
# or
code --install-extension PrivateNote.privatenote-vscode
```

### How to use it

**From the sidebar** — click the envelope icon in the activity bar on the left. The PrivateNote panel opens. Type or paste your secret, set an expiry, and click **Share PrivateNote →**. The encrypted link lands in your clipboard.

**From a selection** — select any text in the editor, right-click, and choose **Share as PrivateNote**. A quick-pick prompt asks for expiry and burn preference. Done.

**From the title bar** — a lock icon appears in the top-right of any open file whenever you have text selected. One click to share.

The panel looks like this:

```
╔══════════════════════════════╗
║       🔵 PrivateNote         ║
║  End-to-end encrypted sharing ║
║    privatenote.ai ↗          ║
╠══════════════════════════════╣
║  Content                     ║
║  ┌──────────────────────┐    ║
║  │ Paste secret here…   │    ║
║  └──────────────────────┘    ║
║                              ║
║  Expires in [1 day ▾]        ║
║  ☑ Burn after reading        ║
║                              ║
║  [ Share PrivateNote →     ] ║
╚══════════════════════════════╝
```

Everything happens locally. No secret crosses the network in plaintext. The link copies to your clipboard and the note is ready to share.

---

## For OpenAI Codex: plugin + MCP

Codex (CLI and IDE) uses `~/.codex/config.toml` for MCP servers and supports **plugins** that bundle MCP + skills.

**Quick MCP setup:**

```bash
codex mcp add privatenote -- npx -y privatenote-mcp
```

**Full plugin** (this repo): install from `.agents/plugins/marketplace.json` → plugin `privatenote` at `packages/privatenote-codex-plugin`. Restart Codex, open **Plugins**, install **PrivateNote**, and use `@share-privatenote` or the default prompts.

Pair the plugin with the **VS Code extension** in the Codex IDE when the secret must not appear in the agent chat.

---

## For AI workflows: the MCP server

If you use Codex, Cursor, Claude Desktop, or any MCP-compatible AI client, you can let the AI agent create PrivateNotes on your behalf.

### Install in Cursor

Add this to `~/.cursor/mcp.json` (create the file if it doesn't exist):

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

Restart Cursor. Check **Settings → MCP** — you should see `privatenote` with a green dot.

### Install in Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Install in any other MCP client

The pattern is always the same: `command: npx`, `args: ["-y", "privatenote-mcp"]`. Works with Continue.dev, Zed, and any other client that speaks the Model Context Protocol.

### Using it

Once installed, just tell your AI agent what you want:

> *"Create a PrivateNote with this API key: `sk_live_xxx`. Expire in 1 hour."*

> *"Send the staging database password securely, burn after reading."*

> *"Create a 15-minute note with this SSH key and give me the link."*

The agent calls the `create_private_note` tool, encryption runs locally, and you get back a link.

### The honest caveat about AI + secrets

When you type a secret into an AI prompt, the model sees it. The MCP server encrypts it *after* the AI has already processed the message. This means:

- The AI provider's servers saw the secret briefly in transit
- But Slack, email, chat history, and server logs never will
- The PrivateNote server itself only ever stores encrypted ciphertext — it can never read your note

The value is eliminating **persistent** exposure. The AI's copy is ephemeral. A Slack message is not.

For full privacy, use a local model (Ollama + Cursor) — then the prompt never leaves your machine at all.

---

## The web app

No install required. Go to [privatenote.ai](https://privatenote.ai), paste your secret, set an expiry, click **Create**. Share the link.

The web app supports the same AES-256-GCM encryption. The key lives only in the URL fragment — `#this-part` — which browsers never send to servers. Your browser encrypts locally before sending anything.

Use the web app when you're on a machine without your editor, or when sharing with someone who'll find a plain URL easiest.

---

## How encryption works

Every path above uses the same cryptography:

```
Your machine
────────────
1. Generate a random 256-bit AES key  ←── stays local
2. Encrypt content with AES-256-GCM
3. POST ciphertext to privatenote.ai  ←── key is NOT included
4. Build URL: privatenote.ai/note/{id}#{key}
                                           └── fragment = key
                                               never sent to server
```

When your recipient opens the link:

```
Their browser
─────────────
1. Fetches /note/{id} → gets encrypted blob
2. Extracts #key from URL fragment (client-side only)
3. Decrypts locally with the key
4. Displays plaintext
5. If burn-after-reading: server deletes the blob immediately
```

The server never has the key. Without the key, the stored blob is meaningless ciphertext.

### Cryptographic details

| Property | Value |
|----------|-------|
| Algorithm | AES-256-GCM |
| Key size | 256 bits |
| IV | 96 bits, fresh per note |
| AAD | note ID + expiry + read limit (tamper-proof) |
| Key encoding | Base64url in URL fragment |
| Key generation | Web Crypto API (`crypto.subtle.generateKey`) |

---

## Expiry and burn options

| Option | Use when |
|--------|----------|
| 15 minutes | Live coordination — you're on a call |
| 1 hour | You expect them to open it soon |
| 1 day | Normal async sharing, enough buffer |
| 7 days | Contractor getting access over the weekend |

**Burn after reading** (default on) means the note is deleted the moment it's first opened. The recipient can't re-open the link. Neither can you.

---

## What PrivateNote protects against

| Threat | Protected? |
|--------|------------|
| Secret stored in plaintext on a server | ✓ Only ciphertext stored |
| PrivateNote database breach | ✓ Ciphertext is useless without the URL key |
| Secret persisting in chat history | ✓ The link dies after reading |
| Secret re-readable after first view | ✓ Burn-after-reading by default |
| Server-side analytics reading your content | ✓ Server never has the key |
| Secret intercepted in transit | ✓ TLS + key never in any HTTP request |

## What it does not protect against

| Threat | Not protected |
|--------|---------------|
| AI provider seeing your prompt | ✗ (use local model to avoid this) |
| Recipient screenshotting the opened note | ✗ |
| Your machine being compromised | ✗ |
| The recipient pasting the secret elsewhere | ✗ |

The goal is eliminating *persistent* exposure — not making a secret impossible to ever see, which is impossible. A secret that must be shared must be seen by someone.

---

## Self-hosting

Run your own PrivateNote instance and point all clients at it:

**VS Code extension** — go to **Settings → PrivateNote** and set `privatenote.apiBaseUrl` to your instance URL.

**MCP server:**

```json
{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"],
      "env": {
        "PRIVATENOTE_API_BASE_URL": "https://notes.your-domain.com"
      }
    }
  }
}
```

Self-hosting is the strongest privacy posture: your infrastructure, your logs, your rules.

---

## Which option to choose

| Your situation | Best option |
|----------------|-------------|
| You use VS Code or Cursor daily | **Extension** — install once, always there |
| You want AI to handle sharing | **MCP server** — agents call it automatically |
| One-off, no install | **Web app** at privatenote.ai |
| Maximum control / compliance | **Self-hosted** instance |
| All of the above | All work together — same encryption, same links |

---

## Best practices

1. **Rotate after sharing.** Any secret you've typed into an AI prompt should be treated as seen. Share the current one via PrivateNote, then rotate to a new one.
2. **Use 15-minute expiry for live sessions.** If you're on a video call, 15 minutes is plenty and limits the window if the link leaks.
3. **Treat the URL like the secret.** The link contains the decryption key. Don't post it in a public channel.
4. **Prefer local models when possible.** Cursor + Ollama + PrivateNote MCP = the secret never leaves your machine until it's already encrypted.
5. **Ask if sharing is necessary.** Could you create a scoped token instead? A read-only credential? The best secrets are the ones that never need to be shared at all.

---

## Links

- **VS Code Marketplace:** [marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode](https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode)
- **MCP package on npm:** [npmjs.com/package/privatenote-mcp](https://www.npmjs.com/package/privatenote-mcp)
- **Web app:** [privatenote.ai](https://privatenote.ai)
- **Source:** [github.com/marjanskrobot/privatenote.ai](https://github.com/marjanskrobot/privatenote.ai)
- **License:** MIT

---

*PrivateNote won't prevent a determined attacker from seeing a secret you've already shared. What it does is change the default from "this secret now lives in 12 places forever" to "this secret existed for 30 seconds and is gone." For most real-world threats, that difference is everything.*
