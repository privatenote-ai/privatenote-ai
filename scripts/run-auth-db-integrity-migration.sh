#!/usr/bin/env bash
set -eo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DB_NAME="${1:-privatenote-auth}"
WR_BASE=(npx wrangler d1 execute "$DB_NAME")
if [[ "${2:-}" == "--remote" ]]; then
  WR_BASE+=(--remote)
  LOC_LABEL="remote"
else
  LOC_LABEL="local"
fi

table_has_column() {
  local table="$1"
  local column="$2"
  "${WR_BASE[@]}" --command "PRAGMA table_info(${table});" | grep -q "\"name\": \"${column}\""
}

ensure_column() {
  local table="$1"
  local column="$2"
  local sql_type="$3"
  if table_has_column "$table" "$column"; then
    echo "✓ ${table}.${column} exists"
    return
  fi
  echo "→ Adding ${table}.${column}"
  "${WR_BASE[@]}" --command "ALTER TABLE ${table} ADD COLUMN ${column} ${sql_type};"
}

echo "Auth DB integrity migration on ${DB_NAME} (${LOC_LABEL})"

ensure_column sessions client_bucket TEXT
ensure_column sessions auth_complete "INTEGER DEFAULT 1"

"${WR_BASE[@]}" --file=src/auth/migrations/2026-04-07_auth_db_integrity.sql

echo "Done."
