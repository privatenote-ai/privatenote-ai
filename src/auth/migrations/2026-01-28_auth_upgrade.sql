-- Auth schema upgrade: users, sessions metadata, recovery codes
-- NOTE: SQLite/D1 does not support ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
-- Use scripts/safe-d1-migrate-auth.sh for an idempotent upgrade.

CREATE TABLE IF NOT EXISTS recovery_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_recovery_codes_user_id ON recovery_codes(user_id);
