-- Mirror of d1 0013 for SQL migration runners.
ALTER TABLE users ADD COLUMN subscription_grace_period_end TEXT;
ALTER TABLE users ADD COLUMN manual_entitlement_expires_at TEXT;
ALTER TABLE users ADD COLUMN manual_entitlement_account_type TEXT
  CHECK (manual_entitlement_account_type IN ('personal_premium', 'business_premium'));
ALTER TABLE users ADD COLUMN stripe_price_id TEXT;
ALTER TABLE users ADD COLUMN subscription_cancel_at_period_end INTEGER NOT NULL DEFAULT 0
  CHECK (subscription_cancel_at_period_end IN (0, 1));
ALTER TABLE users ADD COLUMN subscription_updated_at TEXT;
ALTER TABLE users ADD COLUMN subscription_last_event_created INTEGER;
ALTER TABLE users ADD COLUMN subscription_last_reconciled_at TEXT;
ALTER TABLE users ADD COLUMN subscription_reconciliation_error TEXT;

CREATE TABLE IF NOT EXISTS billing_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_created INTEGER NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_id TEXT,
  processing_status TEXT NOT NULL DEFAULT 'processed',
  attempts INTEGER NOT NULL DEFAULT 1,
  error_code TEXT,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS billing_reconciliation_runs (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'partial', 'failed')),
  scanned_count INTEGER NOT NULL DEFAULT 0,
  repaired_count INTEGER NOT NULL DEFAULT 0,
  unchanged_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS billing_reconciliation_failures (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  user_id TEXT,
  stripe_subscription_id TEXT,
  error_code TEXT NOT NULL,
  error_message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (run_id) REFERENCES billing_reconciliation_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS billing_reconciliation_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS billing_customer_notifications (
  id TEXT PRIMARY KEY,
  notification_key TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  notification_type TEXT NOT NULL CHECK (
    notification_type IN (
      'payment_failed',
      'trial_ending',
      'grace_ending',
      'cancellation_confirmed'
    )
  ),
  effective_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'sending', 'sent', 'failed', 'skipped')
  ),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_attempt_at TEXT,
  sent_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
