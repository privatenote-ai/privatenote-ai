# PrivateNote.ai

**Share secrets. Leave no trail.**

End-to-end encrypted notes and file attachments. Encryption happens in your browser before upload — PrivateNote stores ciphertext only.

🌐 **[privatenote.ai](https://privatenote.ai)** · 📦 **[Public developer tools](https://github.com/privatenote-ai/privatenote-ai)** · 📋 **[Product feature catalog](./FEATURES.md)** (iOS parity; update on every PR)

## Developer tools

| Tool | Description |
|------|-------------|
| [CLI](./packages/privatenote-cli/) | Create encrypted links from the terminal / CI |
| [MCP](./packages/privatenote-mcp/) | Local MCP server (`create_private_note`) for agents |
| [Chrome extension](./packages/privatenote-chrome/) | Create encrypted notes from any page |
| [VS Code / Cursor extension](./packages/privatenote-vscode/) | Send editor selection as an encrypted link |
| [Codex plugin](./packages/privatenote-codex-plugin/) | MCP + skills for agent workflows |

## Security model (summary)

- **Client-side encryption** before anything is uploaded
- **Keys in the URL fragment** — never sent to the server
- **Read-once / expiry** — notes can burn after reading or expire on a timer
- **File attachments** — chunked libsodium encryption; encrypted metadata (including filename)
- **No file scanning** — we cannot read attachment plaintext on the server

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Open source scope

The public GitHub repository ([privatenote-ai/privatenote-ai](https://github.com/privatenote-ai/privatenote-ai)) publishes **developer tools and shared crypto utilities**.

The hosted web application backend is not fully open-sourced. Extension source is provided for transparency and review.

Publish / refresh the public extract:

```bash
GITHUB_ORG_REPO=privatenote-ai/privatenote-ai node scripts/publish-github-public-repo.mjs
```

## Build (extensions)

From the repository root:

```bash
npm install
npm run build:chrome    # → packages/privatenote-chrome/dist
npm run build:cli       # → packages/privatenote-cli/dist
```

See each package README for VS Code, MCP, and Codex install instructions.

## Links

- Website: [privatenote.ai](https://privatenote.ai)
- Developers: [privatenote.ai/developers](https://privatenote.ai/developers)
- Chrome Web Store: *(pending approval)*
- VS Code Marketplace: search **PrivateNote**

## License

MIT — see [LICENSE](./LICENSE).
