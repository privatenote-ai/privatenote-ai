# PrivateNote.ai

**Share secrets. Leave no trail.**

End-to-end encrypted notes and file attachments. Encryption happens in your browser before upload — PrivateNote stores ciphertext only.

🌐 **[privatenote.ai](https://privatenote.ai)**

## Developer tools

| Tool | Description |
|------|-------------|
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

This repository publishes **developer tools and shared crypto utilities** used by PrivateNote extensions.

The hosted web application backend is not fully open-sourced here. Extension source is provided for transparency and review.

## Build (extensions)

From the repository root:

```bash
npm install
npm run build:chrome    # → packages/privatenote-chrome/dist
```

See each package README for VS Code and Codex install instructions.

## Links

- Website: [privatenote.ai](https://privatenote.ai)
- Chrome Web Store: *(pending approval)*
- VS Code Marketplace: search **PrivateNote**

## License

MIT — see [LICENSE](./LICENSE).
