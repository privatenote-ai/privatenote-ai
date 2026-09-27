CREATE TABLE IF NOT EXISTS mobile_refresh_tokens (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  session_row_id TEXT NOT NULL,
  family_id TEXT NOT NULL,
  client_type TEXT NOT NULL DEFAULT 'ios',
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  revoked_reason TEXT,
  replaced_by_id TEXT,
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mobile_refresh_token_hash
  ON mobile_refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_mobile_refresh_user_id
  ON mobile_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_refresh_family_id
  ON mobile_refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_mobile_refresh_session_row_id
  ON mobile_refresh_tokens(session_row_id);
