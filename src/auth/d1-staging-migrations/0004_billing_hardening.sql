ALTER TABLE billing_webhook_events
  ADD COLUMN processing_status TEXT NOT NULL DEFAULT 'processed';
ALTER TABLE billing_webhook_events
  ADD COLUMN attempts INTEGER NOT NULL DEFAULT 1;
ALTER TABLE billing_webhook_events
  ADD COLUMN error_code TEXT;
ALTER TABLE billing_webhook_events
  ADD COLUMN error_message TEXT;

CREATE INDEX IF NOT EXISTS idx_billing_webhook_events_status
  ON billing_webhook_events(processing_status, processed_at);

CREATE TABLE IF NOT EXISTS billing_reconciliation_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
