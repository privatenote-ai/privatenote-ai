# PrivateNote plugin for OpenAI Codex

Codex plugin that bundles:

- **`privatenote-mcp`** — local MCP server with `create_private_note`
- **`share-privatenote` skill** — when to use MCP vs the VS Code extension

The companion **VS Code extension** (`packages/privatenote-vscode`) is the same build used in Cursor: install it in the Codex IDE so users can encrypt from the editor without putting secrets in the agent chat.

## Install in Codex

### From this repo (local marketplace)

1. Ensure `.agents/plugins/marketplace.json` exists at the repo root (already wired for this plugin).
2. Restart Codex (CLI or IDE extension).
3. Open **Plugins** → select the **PrivateNote** marketplace → install **privatenote**.

### CLI only (MCP, no plugin bundle)

```bash
codex mcp add privatenote -- npx -y privatenote-mcp
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]
enabled = true
```

### IDE extension (encrypt without agent)

In VS Code / Codex IDE: Extensions → search **PrivateNote** → Install.

```bash
code --install-extension PrivateNote.privatenote-vscode
```

## Structure

```
privatenote-codex-plugin/
  .codex-plugin/plugin.json   # manifest
  .mcp.json                   # bundled MCP servers
  skills/share-privatenote/   # agent skill
  assets/icon.png
```

## Publish to a personal marketplace

Copy the folder to `~/.codex/plugins/privatenote` and point `~/.agents/plugins/marketplace.json` at it. See [Build plugins](https://developers.openai.com/codex/plugins/build).

## License

MIT
