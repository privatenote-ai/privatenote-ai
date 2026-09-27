-- Add table for delayed account deletion after email-fallback verification
CREATE TABLE IF NOT EXISTS pending_account_deletions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  requested_at TEXT NOT NULL,
  delete_after_at TEXT NOT NULL,
  cancel_token_hash TEXT NOT NULL,
  verification_method TEXT NOT NULL,
  cancelled_at TEXT,
  cancelled_reason TEXT,
  created_ip TEXT,
  created_user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pending_account_deletions_delete_after
  ON pending_account_deletions(delete_after_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_account_deletions_cancel_token
  ON pending_account_deletions(cancel_token_hash);
