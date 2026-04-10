-- Account hub: plan, notification preference, metadata-only activity log

ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE users ADD COLUMN email_notifications INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS account_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  note_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_activity_user_created ON account_activity(user_id, created_at DESC);
