ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN subscription_status TEXT;
ALTER TABLE users ADD COLUMN subscription_current_period_end TEXT;
ALTER TABLE users ADD COLUMN premium_granted_at TEXT;
ALTER TABLE users ADD COLUMN premium_revoked_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0 CHECK (livemode IN (0, 1)),
  received_at TEXT NOT NULL DEFAULT (datetime('now')),
  processed_at TEXT,
  processing_error TEXT
);
