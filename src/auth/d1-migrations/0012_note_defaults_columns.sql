-- Synced note defaults (Starter+), including file-access window and reader language.
CREATE TABLE IF NOT EXISTS user_note_defaults (
  user_id TEXT PRIMARY KEY,
  expiry_seconds INTEGER,
  max_reads INTEGER,
  file_access_window_seconds INTEGER,
  reader_language TEXT,
  notify_on_open INTEGER NOT NULL DEFAULT 0 CHECK (notify_on_open IN (0, 1)),
  require_recipient_verification INTEGER NOT NULL DEFAULT 0 CHECK (require_recipient_verification IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
