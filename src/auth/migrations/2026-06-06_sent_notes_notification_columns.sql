-- Extend sent_notes so it replaces note_read_notifications for premium delivery events.

ALTER TABLE sent_notes ADD COLUMN notify_on_destroyed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sent_notes ADD COLUMN destroyed_at TEXT;
ALTER TABLE sent_notes ADD COLUMN opened_notified_at TEXT;
ALTER TABLE sent_notes ADD COLUMN destroyed_notified_at TEXT;

INSERT OR IGNORE INTO sent_notes (
  id,
  user_id,
  note_id,
  status,
  notify_on_open,
  notify_on_destroyed,
  proof_enabled,
  created_at,
  opened_at,
  opened_notified_at
)
SELECT
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' ||
    substr(lower(hex(randomblob(2))), 2) || '-' ||
    substr('89ab', abs(random()) % 4 + 1, 1) ||
    substr(lower(hex(randomblob(2))), 2) || '-' || lower(hex(randomblob(6))),
  user_id,
  note_id,
  CASE WHEN opened_at IS NOT NULL THEN 'opened' ELSE 'created' END,
  enabled,
  0,
  1,
  created_at,
  opened_at,
  notified_at
FROM note_read_notifications
WHERE enabled = 1;
