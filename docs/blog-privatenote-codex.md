# Using PrivateNote with OpenAI Codex

*One command wires the PrivateNote MCP server into every Codex session. Here's exactly how to set it up, what Codex can do with it, and how to keep secrets out of the agent prompt entirely.*

---

OpenAI Codex is an AI coding agent. You describe what you want — fix a bug, add a feature, write a test — and it does it autonomously in a sandboxed environment.

But agents need secrets. They need to clone repos over SSH, pull from private package registries, connect to staging databases, call internal APIs. That means passing credentials to them.

Pasting an API key into an agent prompt isn't fundamentally different from pasting it into Slack — it ends up in context history, possibly in logs, possibly in memory that persists between sessions. PrivateNote gives you a cleaner path: encrypt the secret before the agent ever sees it, share a link that self-destructs after one read, and leave nothing behind.

---

## The fastest path: one command

If you use the Codex CLI, adding PrivateNote as a global MCP server is a single command:

```bash
codex mcp add privatenote -- npx -y privatenote-mcp
```

- That's it. The server is registered globally in `~/.codex/config.toml`
- Every new Codex session has access to the `create_private_note` tool
- No project-level config needed — it follows you across repos

---

## What Codex can now do

Once the MCP server is registered, you can ask Codex to handle secret sharing directly:

> "Create a PrivateNote for this API key, expire in 1 hour, burn after reading"

> "Wrap this database password in a self-destructing link for the contractor"

> "Send the SSH key securely — 15-minute expiry"

> "Generate a new PrivateNote for the staging credentials and give me the link"

---

## What the tool actually does

When Codex calls `create_private_note`, the MCP server runs a local Node.js process on your machine. The encryption happens there — before anything touches the network.

The server generates a random 256-bit AES key, encrypts the content with AES-256-GCM, and POSTs only the ciphertext to `privatenote.ai`. The key is not in the request.

The decryption key lives only in the URL fragment — the `#this-part` that browsers never send to servers. What comes back from Codex is a link. Whoever opens the link decrypts it in their browser. The note deletes itself immediately after.

---

## The privacy caveat you should understand

Here's the honest part: when you type a secret into a Codex prompt, Codex reads it before the MCP tool runs. OpenAI's servers process that message.

So "create a PrivateNote for `sk_live_abc123`" means the value `sk_live_abc123` briefly appeared in a cloud context. The PrivateNote step ensures it doesn't persist in Slack, email, or chat history — but it isn't the same as the AI never seeing it.

Two ways to close that gap:

- **Use the VS Code extension when in the Codex IDE** — select the secret in your editor, right-click → Share as PrivateNote. The secret goes directly from your editor to the encrypted link. Codex is never involved.
- **Use a local model for the agent session.** Nothing leaves your machine until it's already encrypted.

---

## Using the VS Code extension in Codex IDE

Codex runs inside a VS Code-compatible editor. The PrivateNote VS Code extension installs and works there exactly as it does in standard VS Code:

```bash
code --install-extension PrivateNote.privatenote-vscode
```

- After install, an envelope icon appears in the activity bar — click it to open the PrivateNote panel
- Select any text in the editor, right-click → **Share as PrivateNote** for a quick one-off
- The lock icon in the editor title bar appears whenever you have text selected
- With this path, Codex never touches the plaintext — the extension encrypts locally in the VS Code host process

---

## If you prefer the config file

The `codex mcp add` command writes to `~/.codex/config.toml`. You can also edit that file directly:

```toml
[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]
```

---

## Pointing at a self-hosted instance

If your team runs a private PrivateNote server, set the base URL via an environment variable:

```toml
[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.your-domain.com"
```

All secrets stay on your infrastructure. The same AES-256-GCM encryption applies; only the storage destination changes.

---

## A few things to remember

**The URL is the secret.** The link contains the decryption key in its fragment. Treat it with the same care as the credential itself — don't commit it, don't log it, don't post it in a public channel.

**Burn-after-reading means exactly that.** Once the link is opened, it's gone. Neither you nor the recipient can re-open it.

**Rotate after sharing.** If a credential appeared in an AI prompt — even briefly — treat it as potentially seen. Share the current value via PrivateNote, then rotate to a new one.

**PrivateNote is for delivery, not storage.** If you need a secret accessible for more than a few days, use a proper secrets manager. PrivateNote is the secure handoff step, not the vault.

---

## Links

- **MCP package on npm:** [npmjs.com/package/privatenote-mcp](https://www.npmjs.com/package/privatenote-mcp)
- **VS Code Marketplace:** [marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode](https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode)
- **Web app:** [privatenote.ai](https://privatenote.ai)
- **Developers page:** [privatenote.ai/developers](https://privatenote.ai/developers)
