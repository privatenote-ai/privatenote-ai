# PrivateNote.ai

**Share secrets. Leave no trail.**

End-to-end encrypted notes and file attachments — encrypted in your browser (or editor) before upload. PrivateNote stores ciphertext only.

🌐 **[privatenote.ai](https://privatenote.ai)** · 📦 **[This repository](https://github.com/privatenote-ai/privatenote-ai)**

## Developer tools

| Tool | Package | Description |
|------|---------|-------------|
| [CLI](./packages/privatenote-cli/) | `privatenote-cli` | Create encrypted links from the terminal / CI |
| [MCP](./packages/privatenote-mcp/) | `privatenote-mcp` | Local MCP server (`create_private_note`) for agents |
| [VS Code / Cursor](./packages/privatenote-vscode/) | `privatenote-vscode` | Encrypt selection without the AI seeing plaintext |
| [Chrome](./packages/privatenote-chrome/) | `privatenote-chrome` | Create encrypted notes from any page |
| [Codex plugin](./packages/privatenote-codex-plugin/) | — | MCP + skill bundle for Codex |

## Security model (summary)

- **Client-side encryption** before anything is uploaded
- **Keys in the URL fragment** — never sent to the server
- **Read-once / expiry** — notes can burn after reading or expire on a timer
- Shared crypto lives in [`shared/`](./shared/) (`noteCrypto`, AAD binding, URL fragment keys)

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Open source scope

This repository publishes **developer tools and the shared crypto utilities** they need.

The hosted web application, API Worker, auth, and billing code are **not** open-sourced here.

## Build

From the repository root:

```bash
npm install
npm run build:chrome   # → packages/privatenote-chrome/dist
npm run build:cli      # → packages/privatenote-cli/dist
npm run build:vscode   # → packages/privatenote-vscode/dist
npm run build:mcp      # → packages/privatenote-mcp/dist
```

See each package README for install and usage.

## Links

- Website: [privatenote.ai](https://privatenote.ai)
- Developers: [privatenote.ai/developers](https://privatenote.ai/developers)
- Security: [security@privatenote.ai](mailto:security@privatenote.ai)

## License

MIT — see [LICENSE](./LICENSE).
