#!/usr/bin/env bash
# Build the CLI and produce checksum + optional GPG signature files for a release.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PKG="$ROOT/packages/privatenote-cli"
VERSION="${1:-$(node -p "require('$PKG/package.json').version")}"
OUT_DIR="$PKG/release"
ARTIFACT="$OUT_DIR/privatenote-cli-${VERSION}"

cd "$ROOT"
npm run build:cli

mkdir -p "$OUT_DIR"
cp "$PKG/dist/cli.js" "$ARTIFACT"
chmod +x "$ARTIFACT"

(
  cd "$OUT_DIR"
  shasum -a 256 "privatenote-cli-${VERSION}" > SHA256SUMS
)

if command -v gpg >/dev/null 2>&1 && gpg --list-secret-keys >/dev/null 2>&1; then
  (
    cd "$OUT_DIR"
    gpg --armor --detach-sign --local-user "${PRIVATENOTE_RELEASE_SIGNING_KEY:-}" SHA256SUMS 2>/dev/null || \
      gpg --armor --detach-sign SHA256SUMS
  )
  echo "Signed SHA256SUMS → $OUT_DIR/SHA256SUMS.asc"
else
  echo "GPG not configured — checksum only (see README for manual signing)."
fi

echo "Release artifacts in $OUT_DIR:"
ls -la "$OUT_DIR"
