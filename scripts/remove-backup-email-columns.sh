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
  run_sql "pragma table_info('${table}');" | grep -q -w "${column}" || return 1
}

table_exists() {
  local table="$1"
  run_sql "SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';" | grep -q "${table}" || return 1
}

echo "Running migration to remove backup email columns from ${DB_NAME} ${REMOTE_FLAG:-"(local)"}"

# Check if migration was partially completed (users_new exists)
if table_exists "users_new"; then
  if table_exists "users"; then
    # Both exist - check if users still has backup_email
    if ! table_has_column "users" "backup_email"; then
      echo "⚠️  Detected partial migration. Cleaning up..."
      run_sql "DROP TABLE IF EXISTS users_new;"
      echo "✓ Cleanup complete"
      exit 0
    else
      echo "⚠️  Detected partial migration. Completing..."
      # Drop dependent tables first, then users, then rename
      run_sql "DROP TABLE IF EXISTS sessions;"
      run_sql "DROP TABLE IF EXISTS webauthn_credentials;"
      run_sql "DROP TABLE IF EXISTS recovery_codes;"
      run_sql "DROP TABLE IF EXISTS users;"
      run_sql "ALTER TABLE users_new RENAME TO users;"
      echo "⚠️  Warning: Dependent tables were dropped. You may need to recreate them."
      echo "✓ Migration completed (partial)"
      exit 0
    fi
  else
    # users_new exists but users doesn't - complete the migration
    echo "⚠️  Detected partial migration. Completing..."
    run_sql "ALTER TABLE users_new RENAME TO users;"
    echo "✓ Migration completed"
    exit 0
  fi
fi

# Check if backup_email columns exist
if ! table_exists "users" || ! table_has_column "users" "backup_email"; then
  echo "✓ backup_email columns already removed, nothing to do"
  exit 0
fi

echo "→ Removing backup_email columns..."

# Clean up any leftover temp tables from previous failed runs
echo "→ Cleaning up any leftover temp tables..."
run_sql "DROP TABLE IF EXISTS users_new;"
run_sql "DROP TABLE IF EXISTS sessions_new;"
run_sql "DROP TABLE IF EXISTS sessions_temp;"
run_sql "DROP TABLE IF EXISTS webauthn_credentials_new;"
run_sql "DROP TABLE IF EXISTS webauthn_credentials_temp;"
run_sql "DROP TABLE IF EXISTS recovery_codes_new;"
run_sql "DROP TABLE IF EXISTS recovery_codes_temp;"

# Step 1: Create new users table without backup_email columns
echo "→ Step 1: Creating new users table..."
run_sql "CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  last_login_at TEXT
);"

# Step 2: Copy data from old table to new table
echo "→ Step 2: Copying data to new users table..."
run_sql "INSERT INTO users_new (id, email, email_verified, status, created_at, updated_at, last_login_at)
SELECT id, email, email_verified, status, created_at, updated_at, last_login_at
FROM users;"

# Step 3: Drop indexes first
echo "→ Step 3: Dropping indexes..."
run_sql "DROP INDEX IF EXISTS idx_sessions_hash;"
run_sql "DROP INDEX IF EXISTS idx_webauthn_credential_id;"
run_sql "DROP INDEX IF EXISTS idx_recovery_codes_user_id;"

# Step 4: Recreate dependent tables without foreign keys
echo "→ Step 4: Recreating dependent tables without foreign keys..."

# Recreate sessions table
run_sql "CREATE TABLE sessions_new (
  id TEXT PRIMARY KEY,
  session_id_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TEXT,
  absolute_expires_at TEXT,
  revoked_at TEXT,
  revoked_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_seen_at TEXT,
  last_auth_at TEXT,
  last_stepup_at TEXT,
  user_agent TEXT,
  ip TEXT,
  city TEXT,
  country TEXT,
  device_label TEXT
);"

run_sql "INSERT INTO sessions_new SELECT * FROM sessions;"
run_sql "DROP TABLE sessions;"
run_sql "ALTER TABLE sessions_new RENAME TO sessions;"

# Recreate webauthn_credentials table
run_sql "CREATE TABLE webauthn_credentials_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  counter INTEGER DEFAULT 0,
  transports TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_used_at TEXT
);"

run_sql "INSERT INTO webauthn_credentials_new SELECT * FROM webauthn_credentials;"
run_sql "DROP TABLE webauthn_credentials;"
run_sql "ALTER TABLE webauthn_credentials_new RENAME TO webauthn_credentials;"

# Recreate recovery_codes table
run_sql "CREATE TABLE recovery_codes_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);"

run_sql "INSERT INTO recovery_codes_new SELECT * FROM recovery_codes;"
run_sql "DROP TABLE recovery_codes;"
run_sql "ALTER TABLE recovery_codes_new RENAME TO recovery_codes;"

# Step 5: Now we can drop the old users table and rename the new one
echo "→ Step 5: Replacing users table..."
run_sql "DROP TABLE users;"
run_sql "ALTER TABLE users_new RENAME TO users;"

# Step 6: Recreate foreign key constraints by recreating dependent tables with foreign keys
echo "→ Step 6: Recreating foreign key constraints..."

# Recreate sessions with foreign key
run_sql "CREATE TABLE sessions_temp (
  id TEXT PRIMARY KEY,
  session_id_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TEXT,
  absolute_expires_at TEXT,
  revoked_at TEXT,
  revoked_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_seen_at TEXT,
  last_auth_at TEXT,
  last_stepup_at TEXT,
  user_agent TEXT,
  ip TEXT,
  city TEXT,
  country TEXT,
  device_label TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);"

run_sql "INSERT INTO sessions_temp SELECT * FROM sessions;"
run_sql "DROP TABLE sessions;"
run_sql "ALTER TABLE sessions_temp RENAME TO sessions;"

# Recreate webauthn_credentials with foreign key
run_sql "CREATE TABLE webauthn_credentials_temp (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  counter INTEGER DEFAULT 0,
  transports TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);"

run_sql "INSERT INTO webauthn_credentials_temp SELECT * FROM webauthn_credentials;"
run_sql "DROP TABLE webauthn_credentials;"
run_sql "ALTER TABLE webauthn_credentials_temp RENAME TO webauthn_credentials;"

# Recreate recovery_codes with foreign key
run_sql "CREATE TABLE recovery_codes_temp (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);"

run_sql "INSERT INTO recovery_codes_temp SELECT * FROM recovery_codes;"
run_sql "DROP TABLE recovery_codes;"
run_sql "ALTER TABLE recovery_codes_temp RENAME TO recovery_codes;"

# Step 7: Recreate indexes
echo "→ Step 7: Recreating indexes..."
run_sql "CREATE INDEX idx_sessions_hash ON sessions(session_id_hash);"
run_sql "CREATE INDEX idx_webauthn_credential_id ON webauthn_credentials(credential_id);"
run_sql "CREATE INDEX idx_recovery_codes_user_id ON recovery_codes(user_id);"

echo "✓ Migration complete: backup_email columns removed"
