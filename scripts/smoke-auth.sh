#!/usr/bin/env bash
set -euo pipefail

# Basic smoke test for auth endpoints (magic link + recovery)
# Usage:
#   BASE_URL=https://your-worker.example.com \
#   EMAIL=you@example.com \
#   bash scripts/smoke-auth.sh
#
# Optional:
#   RECOVERY_CODE=XXXX-XXXX-XXXX

BASE_URL="${BASE_URL:-}"
EMAIL="${EMAIL:-}"
RECOVERY_CODE="${RECOVERY_CODE:-}"

if [[ -z "${BASE_URL}" || -z "${EMAIL}" ]]; then
  echo "Missing BASE_URL or EMAIL."
  echo "Example: BASE_URL=https://privatenote-api.example.workers.dev EMAIL=you@example.com bash scripts/smoke-auth.sh"
  exit 1
fi

COOKIE_JAR="$(mktemp)"
cleanup() { rm -f "${COOKIE_JAR}"; }
trap cleanup EXIT

echo "==> Magic link request (generic response expected)"
curl -sS -i \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\"}" \
  "${BASE_URL}/api/auth/magic/send" | head -n 20

echo ""
echo "==> Recovery code login (if provided)"
if [[ -n "${RECOVERY_CODE}" ]]; then
  curl -sS -c "${COOKIE_JAR}" -i \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${EMAIL}\",\"code\":\"${RECOVERY_CODE}\"}" \
    "${BASE_URL}/api/auth/recovery/consume" | head -n 20

  echo ""
  echo "==> Auth me (requires cookie from recovery)"
  curl -sS -b "${COOKIE_JAR}" -i "${BASE_URL}/api/auth/me" | head -n 20
else
  echo "Skipping recovery test (set RECOVERY_CODE to run)."
fi
