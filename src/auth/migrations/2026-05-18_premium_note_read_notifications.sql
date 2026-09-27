CREATE TABLE IF NOT EXISTS note_read_notifications (
  note_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  opened_at TEXT,
  notified_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_note_read_notifications_user_created
  ON note_read_notifications(user_id, created_at DESC);
