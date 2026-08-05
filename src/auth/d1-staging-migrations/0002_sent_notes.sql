CREATE TABLE IF NOT EXISTS sent_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  note_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'opened', 'expired', 'destroyed', 'revoked')),
  label TEXT,
  recipient_email_hint TEXT,
  notify_on_open INTEGER NOT NULL DEFAULT 0,
  notify_on_destroyed INTEGER NOT NULL DEFAULT 0,
  require_recipient_verification INTEGER NOT NULL DEFAULT 0,
  proof_enabled INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  opened_at TEXT,
  destroyed_at TEXT,
  revoked_at TEXT,
  opened_notified_at TEXT,
  destroyed_notified_at TEXT,
  open_country TEXT,
  open_device_class TEXT,
  open_browser TEXT,
  attachment_downloaded_at TEXT,
  attachment_downloaded_notified_at TEXT,
  notification_deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sent_notes_user_created
  ON sent_notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_notes_note_id ON sent_notes(note_id);
