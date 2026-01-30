#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${1:-privatenote-auth}"
REMOTE_FLAG="--remote"

if [[ "${2:-}" == "--local" ]]; then
  REMOTE_FLAG=""
fi

run_sql() {
  local sql="$1"
  if [[ -n "${REMOTE_FLAG}" ]]; then
    wrangler d1 execute "${DB_NAME}" ${REMOTE_FLAG} --command "${sql}"
  else
    wrangler d1 execute "${DB_NAME}" --command "${sql}"
  fi
}

echo "Checking database state for ${DB_NAME} ${REMOTE_FLAG:-"(local)"}"
echo ""

echo "Tables:"
run_sql "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
echo ""

if run_sql "SELECT name FROM sqlite_master WHERE type='table' AND name='users';" | grep -q "users"; then
  echo "Users table columns:"
  run_sql "PRAGMA table_info(users);"
  echo ""
fi

if run_sql "SELECT name FROM sqlite_master WHERE type='table' AND name='users_new';" | grep -q "users_new"; then
  echo "⚠️  users_new table exists!"
  echo "Users_new table columns:"
  run_sql "PRAGMA table_info(users_new);"
  echo ""
fi
