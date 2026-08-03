# privatenote-cli

Create encrypted [PrivateNote.ai](https://privatenote.ai) links from the terminal.

Plaintext is encrypted locally with AES-256-GCM. Only ciphertext is uploaded. The decryption key is embedded in the URL `#fragment` and never sent to the server.

Notes created via this tool are tracked as `creationSource: cli` in analytics.

## Requirements

- Node.js 18+

## Install

```bash
# Run without installing (recommended to try)
npx privatenote-cli --help

# Global install — adds the `privatenote` command
npm install -g privatenote-cli
```

## Usage

```bash
# Pipe secrets from stdin (use --output-url-only when piping)
cat secret.txt | npx privatenote-cli --expire 1h --output-url-only

# After global install
cat secret.txt | privatenote --expire 1h --output-url-only

# Read from a file
privatenote --expire 24h .env

# JSON output for scripts
cat secret.txt | privatenote --expire 1h --json --force-stdout
```

### Options

| Flag | Description |
|------|-------------|
| `--expire 15m\|1h\|24h\|7d` | Note lifetime (default: `24h`) |
| `--burn` | Destroy after first view (default) |
| `--no-burn` | Allow a second view (requires Premium) |
| `--title <text>` | Optional title prepended to content |
| `--json` | Print `{ secureUrl, expiresAt, burnAfterReading }` |
| `--output-url-only` | URL-only output; bypasses non-TTY stdout guard for scripts |
| `--force-stdout` | Allow output when stdout is not a terminal (required with `--json` in CI) |
| `--api-base-url <url>` | Override API origin (HTTPS required) |
| `--web-origin <url>` | Override share-link origin (defaults to API origin) |
| `--insecure` | Allow `http://` API origins for local dev only |
| `--allow-origin-mismatch` | Dangerous: allow share links on a different host than the API |

Environment variables:

- `PRIVATENOTE_API_BASE_URL`
- `PRIVATENOTE_WEB_ORIGIN` (optional; defaults to the API origin)
- `PRIVATENOTE_ALLOWED_HOSTS` — comma-separated hostname allowlist (e.g. `privatenote.ai` for enterprise pinning)

HTTPS is enforced for remote APIs. The CLI refuses HTTP redirects, validates API response shapes, and validates reserved note IDs.

When stdout is piped or captured (not a TTY), the CLI refuses to print a link unless you pass `--force-stdout` or `--output-url-only`:

```bash
cat secret.txt | privatenote --expire 1h --output-url-only > link.txt
cat secret.txt | privatenote --expire 1h --json --force-stdout
```

## Password manager and shell history

The share URL contains the decryption key in its `#fragment`. Treat it like a password: do not echo it, paste it into chat, or leave it in shell history.

### pass (password-store)

```bash
pass show prod/api-key | privatenote --expire 1h --output-url-only > "$(mktemp -u).url"
chmod 600 *.url

# Or pipe to a clipboard helper without printing (macOS example)
pass show prod/api-key | privatenote --expire 1h --output-url-only | pbcopy
```

### 1Password CLI (`op`)

```bash
op read "op://Engineering/deploy-key/password" | privatenote --expire 1h --output-url-only > /tmp/note.url
chmod 600 /tmp/note.url
```

### General habits

- Prefer `--output-url-only` and redirect to a `chmod 600` file instead of printing the URL.
- Prefix one-off commands with a space and use `HISTCONTROL=ignorespace` (bash) so the line is omitted from history when possible.
- Never put the full URL in a script argument list — scripts show up in `ps` and logs.
- For CI, use `--json --force-stdout` and write to a masked secret output, not plain build logs.

## Publishing (maintainers)

From the repository root:

```bash
npm run publish:cli
```

Requires npm login as **`privatenote-ai`** (same account as `privatenote-mcp`). Verify before publishing:

```bash
npm whoami   # must print: privatenote-ai
npm run publish:cli
```

If you use 2FA on npm, add a one-time password:

```bash
cd packages/privatenote-cli && npm publish --otp=YOUR_CODE
```

Create an **Automation** token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) with publish access if CI fails.

## Build from source

```bash
git clone https://github.com/privatenote-ai/privatenote-ai.git
cd privatenote
npm run build:cli
node packages/privatenote-cli/dist/cli.js --help
```

## Signed GitHub releases (optional)

Checksum-signed release artifacts are also published on [GitHub Releases](https://github.com/privatenote-ai/privatenote-ai/releases) when tagged `cli-v*`. See [developers/cli](https://privatenote.ai/developers/cli) for verification steps.

## Self-hosting

```bash
export PRIVATENOTE_API_BASE_URL=https://notes.example.com
cat credentials.txt | privatenote --expire 1h --output-url-only > link.txt
```

For local Wrangler dev over HTTP:

```bash
privatenote --insecure --api-base-url http://localhost:8787 < secret.txt
```

## License

MIT
