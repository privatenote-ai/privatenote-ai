#!/usr/bin/env bash
# Regenerate PNG brand assets from SVG sources (requires librsvg: rsvg-convert).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/client/public"

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "rsvg-convert not found. Install librsvg (e.g. brew install librsvg)." >&2
  exit 1
fi

echo "Generating apple-touch-icon.png (180×180)…"
rsvg-convert -w 180 -h 180 "$PUBLIC/apple-touch-icon.svg" -o "$PUBLIC/apple-touch-icon.png"

echo "Generating favicon PNGs…"
rsvg-convert -w 32 -h 32 "$PUBLIC/favicon.svg" -o "$PUBLIC/favicon-32x32.png"
rsvg-convert -w 16 -h 16 "$PUBLIC/favicon.svg" -o "$PUBLIC/favicon-16x16.png"

echo "Generating og-image.png (1200×630)…"
rsvg-convert -w 1200 -h 630 "$PUBLIC/og-image.svg" -o "$PUBLIC/og-image.png"

echo "Done."
