ALTER TABLE sent_notes ADD COLUMN alert_notify_account_email INTEGER NOT NULL DEFAULT 1;
ALTER TABLE sent_notes ADD COLUMN alert_custom_email TEXT;
