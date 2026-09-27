ALTER TABLE sent_notes ADD COLUMN receipt_ack_statement TEXT;
ALTER TABLE sent_notes ADD COLUMN receipt_ack_statement_id TEXT;
ALTER TABLE sent_notes ADD COLUMN activity_folder TEXT;
ALTER TABLE sent_notes ADD COLUMN activity_tags TEXT;
ALTER TABLE sent_notes ADD COLUMN unopened_reminder_at TEXT;
ALTER TABLE sent_notes ADD COLUMN unopened_reminded_at TEXT;
