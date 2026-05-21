---
name: share-privatenote
description: Create end-to-end encrypted PrivateNote links for secrets, credentials, and one-time handoffs.
---

# Share with PrivateNote

Use this skill when the user wants to send a password, API key, token, recovery code, or other secret as a link instead of pasting it into chat, email, or Slack.

## Choose the right path

| Situation | What to do |
|-----------|------------|
| User is in VS Code / Cursor / Codex IDE with the **PrivateNote extension** installed | Tell them to select the secret and run **Share as PrivateNote** or open the **PrivateNote** sidebar. The extension encrypts locally; **Codex never needs the plaintext**. |
| User asks Codex to create the link, or no editor extension | Use the bundled **`privatenote` MCP** tool `create_private_note`. Encryption runs in the MCP process on the user's machine. |
| User pastes a secret **into this chat** for you to forward | Prefer asking them to use the extension or MCP tool with the secret supplied only to that tool. If they insist, call `create_private_note` and **do not echo the secret** in your reply. |

## MCP tool usage

After the plugin is installed, the `privatenote` MCP server exposes `create_private_note`.

Typical parameters:

- **content** — the secret text (required)
- **expiresIn** — `15m`, `1h`, `24h`, or `7d` (default `24h`)
- **burnAfterReading** — `true` for single-use (recommended default)

Return only the **secure URL** to the user. Remind them the `#fragment` is the decryption key and must be shared with the recipient separately if needed.

## Privacy caveat (say this when using MCP)

When the user types a secret into the Codex chat, **OpenAI's servers may process that message** before the MCP tool runs. The PrivateNote server still only receives ciphertext. For maximum privacy, recommend:

1. **PrivateNote VS Code extension** — shield icon / sidebar; plaintext stays in the editor host only.
2. **MCP with the secret passed only in the tool call** — better than leaving it in thread history, but not as strong as the extension.

## VS Code extension (Codex IDE)

Codex runs in VS Code-compatible editors. Install **PrivateNote** from the Marketplace (`PrivateNote.privatenote-vscode`):

- **Lock** (editor title bar / context menu) — share current selection quickly
- **Shield** — open sidebar composer, optionally prefilled from selection

Search Extensions for `PrivateNote` or run:

```bash
code --install-extension PrivateNote.privatenote-vscode
```

## Self-hosted

If the user self-hosts PrivateNote, set `PRIVATENOTE_API_BASE_URL` (and related env vars documented on npm for `privatenote-mcp`) before using MCP. For the extension, use settings `privatenote.apiBaseUrl` and `privatenote.webOrigin`.
