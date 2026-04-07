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

table_has_column() {
  local table="$1"
  local column="$2"
  run_sql "pragma table_info('${table}');" | grep -q -w "${column}"
}

ensure_column() {
  local table="$1"
  local column="$2"
  local type="$3"
  if table_has_column "${table}" "${column}"; then
    echo "✓ ${table}.${column} exists"
    return
  fi
  echo "→ Adding ${table}.${column}"
  run_sql "alter table ${table} add column ${column} ${type};"
}

echo "Running safe auth migration on ${DB_NAME} ${REMOTE_FLAG:-"(local)"}"

# Users columns
ensure_column "users" "status" "TEXT DEFAULT 'pending'"
ensure_column "users" "backup_email" "TEXT"
ensure_column "users" "backup_email_verified" "INTEGER DEFAULT 0"
ensure_column "users" "backup_email_pending" "TEXT"
ensure_column "users" "updated_at" "TEXT"
ensure_column "users" "last_login_at" "TEXT"

# Sessions columns
ensure_column "sessions" "absolute_expires_at" "TEXT"
ensure_column "sessions" "revoked_reason" "TEXT"
ensure_column "sessions" "last_auth_at" "TEXT"
ensure_column "sessions" "last_stepup_at" "TEXT"
ensure_column "sessions" "user_agent" "TEXT"
ensure_column "sessions" "ip" "TEXT"
ensure_column "sessions" "city" "TEXT"
ensure_column "sessions" "country" "TEXT"
ensure_column "sessions" "device_label" "TEXT"
ensure_column "sessions" "client_bucket" "TEXT"

# WebAuthn credentials columns
ensure_column "webauthn_credentials" "last_used_at" "TEXT"

# Recovery codes table + index (idempotent)
run_sql "create table if not exists recovery_codes (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, code_hash TEXT NOT NULL, salt TEXT NOT NULL, used_at TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id));"
run_sql "create index if not exists idx_recovery_codes_user_id on recovery_codes(user_id);"

run_sql "update users set status = 'active' where status is null;"

echo "Done."
