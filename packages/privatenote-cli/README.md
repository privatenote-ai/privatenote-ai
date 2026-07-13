# @privatenote/cli

Create encrypted [PrivateNote.ai](https://privatenote.ai) links from the terminal.

Plaintext is encrypted locally with AES-256-GCM. Only ciphertext is uploaded. The decryption key is embedded in the URL `#fragment` and never sent to the server.

Notes created via this tool are tracked as `creationSource: cli` in analytics.

## Requirements

- Node.js 18+

## Build

From the repository root:

```bash
npm run build:cli
```

## Usage

```bash
# Pipe secrets from stdin (use --output-url-only when piping)
cat config.json | node packages/privatenote-cli/dist/cli.js --expire 1h --output-url-only

# Read from a file
node packages/privatenote-cli/dist/cli.js --expire 24h .env

# JSON output for scripts
cat secret.txt | node packages/privatenote-cli/dist/cli.js --expire 1h --json --force-stdout
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
# Read a secret from pass; write only the URL to a restricted file (not the terminal)
pass show prod/api-key | privatenote --expire 1h --output-url-only > "$(mktemp -u).url"
chmod 600 *.url

# Or pipe to a clipboard helper without printing (macOS example)
pass show prod/api-key | privatenote --expire 1h --output-url-only | pbcopy
```

### 1Password CLI (`op`)

```bash
# Inject a field at runtime; avoid typing the URL on the command line
op read "op://Engineering/deploy-key/password" | privatenote --expire 1h --output-url-only > /tmp/note.url
chmod 600 /tmp/note.url
```

### General habits

- Prefer `--output-url-only` and redirect to a `chmod 600` file instead of printing the URL.
- Prefix one-off commands with a space and use `HISTCONTROL=ignorespace` (bash) so the line is omitted from history when possible.
- Never put the full URL in a script argument list — scripts show up in `ps` and logs.
- For CI, use `--json --force-stdout` and write to a masked secret output, not plain build logs.

## Signed releases

Official CLI binaries are published on [GitHub Releases](https://github.com/privatenote-ai/privatenote/releases) with SHA-256 checksums and a detached GPG signature over the checksum file.

### Verify a release

1. Download `privatenote-cli-<version>`, `SHA256SUMS`, and `SHA256SUMS.asc` from the release assets.
2. Import the signing key (fingerprint published on [privatenote.ai/developers](https://privatenote.ai/developers#cli)):

```bash
gpg --keyserver keys.openpgp.org --recv-keys <FINGERPRINT>
```

3. Verify the signature and checksum:

```bash
gpg --verify SHA256SUMS.asc SHA256SUMS
shasum -a 256 -c SHA256SUMS
```

4. Install the verified binary:

```bash
chmod +x privatenote-cli-<version>
sudo mv privatenote-cli-<version> /usr/local/bin/privatenote
```

### Build release artifacts locally

Maintainers can reproduce the checksum (and sign when GPG is configured):

```bash
bash packages/privatenote-cli/scripts/prepare-release.sh
# Optional: PRIVATENOTE_RELEASE_SIGNING_KEY=<key-id> bash packages/privatenote-cli/scripts/prepare-release.sh 0.1.0
```

This writes `packages/privatenote-cli/release/privatenote-cli-<version>`, `SHA256SUMS`, and optionally `SHA256SUMS.asc`.

## Self-hosting

Point both URLs at your PrivateNote instance:

```bash
export PRIVATENOTE_API_BASE_URL=https://notes.example.com
cat credentials.txt | privatenote --expire 1h --output-url-only > link.txt
```

For local Wrangler dev over HTTP:

```bash
node packages/privatenote-cli/dist/cli.js --insecure --api-base-url http://localhost:8787 < secret.txt
```

## License

MIT
