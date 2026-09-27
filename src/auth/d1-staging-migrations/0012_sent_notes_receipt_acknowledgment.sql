ALTER TABLE sent_notes ADD COLUMN require_receipt_ack INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sent_notes ADD COLUMN receipt_ack_token_hash TEXT;
ALTER TABLE sent_notes ADD COLUMN receipt_acknowledged_at TEXT;
ALTER TABLE sent_notes ADD COLUMN receipt_ack_notified_at TEXT;
