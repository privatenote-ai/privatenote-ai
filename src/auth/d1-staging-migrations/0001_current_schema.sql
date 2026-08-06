-- Auth schema for D1 (Cloudflare)
-- Apply with: wrangler d1 execute <DB_NAME> --file=src/auth/schema.sql
-- Wrangler-managed baseline (local dev + deploy): src/auth/d1-migrations/0001_auth_schema.sql — update both when changing tables.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0 CHECK (email_verified IN (0, 1)),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  last_login_at TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  account_type TEXT NOT NULL DEFAULT 'free' CHECK (account_type IN ('free', 'personal_premium', 'business_premium')),
  subscription_status TEXT,
  subscription_current_period_end TEXT,
  subscription_grace_period_end TEXT,
  manual_entitlement_expires_at TEXT,
  manual_entitlement_account_type TEXT
    CHECK (manual_entitlement_account_type IN ('personal_premium', 'business_premium')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  subscription_cancel_at_period_end INTEGER NOT NULL DEFAULT 0
    CHECK (subscription_cancel_at_period_end IN (0, 1)),
  subscription_updated_at TEXT,
  subscription_last_event_created INTEGER,
  subscription_last_reconciled_at TEXT,
  subscription_reconciliation_error TEXT,
  business_display_name TEXT,
  email_notifications INTEGER NOT NULL DEFAULT 1 CHECK (email_notifications IN (0, 1)),
  preferred_language TEXT CHECK (preferred_language IN ('en', 'de', 'fr', 'es')),
  allow_hosted_ai INTEGER NOT NULL DEFAULT 0 CHECK (allow_hosted_ai IN (0, 1))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer_id
  ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_subscription_id
  ON users(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS billing_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_created INTEGER NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_billing_webhook_events_user
  ON billing_webhook_events(user_id, processed_at);

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

CREATE INDEX IF NOT EXISTS idx_users_subscription_last_reconciled
  ON users(subscription_last_reconciled_at);
CREATE INDEX IF NOT EXISTS idx_billing_reconciliation_failures_run
  ON billing_reconciliation_failures(run_id);

CREATE TABLE IF NOT EXISTS billing_customer_notifications (
  id TEXT PRIMARY KEY,
  notification_key TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  notification_type TEXT NOT NULL CHECK (
    notification_type IN ('payment_failed', 'trial_ending', 'grace_ending', 'cancellation_confirmed')
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

CREATE INDEX IF NOT EXISTS idx_billing_customer_notifications_delivery
  ON billing_customer_notifications(status, last_attempt_at);
CREATE INDEX IF NOT EXISTS idx_billing_customer_notifications_user
  ON billing_customer_notifications(user_id, created_at);

CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  counter INTEGER DEFAULT 0,
  transports TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_used_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_id_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TEXT,
  absolute_expires_at TEXT,
  revoked_at TEXT,
  revoked_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_seen_at TEXT,
  last_auth_at TEXT,
  last_stepup_at TEXT,
  user_agent TEXT,
  ip TEXT,
  city TEXT,
  country TEXT,
  device_label TEXT,
  client_bucket TEXT,
  auth_complete INTEGER DEFAULT 1 CHECK (auth_complete IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_session_id_hash ON sessions(session_id_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_webauthn_credential_id ON webauthn_credentials(credential_id);

CREATE TABLE IF NOT EXISTS recovery_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_recovery_codes_user_id ON recovery_codes(user_id);

-- Security audit log table for structured logging of security events
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_status TEXT NOT NULL,
  details TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

CREATE TABLE IF NOT EXISTS totp_secrets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  encrypted_secret TEXT NOT NULL,
  verified INTEGER DEFAULT 0 CHECK (verified IN (0, 1)),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_account_deletions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  requested_at TEXT NOT NULL,
  delete_after_at TEXT NOT NULL,
  cancel_token_hash TEXT NOT NULL,
  verification_method TEXT NOT NULL,
  cancelled_at TEXT,
  cancelled_reason TEXT,
  created_ip TEXT,
  created_user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pending_account_deletions_delete_after
  ON pending_account_deletions(delete_after_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_account_deletions_cancel_token
  ON pending_account_deletions(cancel_token_hash);

CREATE TABLE IF NOT EXISTS account_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  note_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_activity_user_created ON account_activity(user_id, created_at DESC);

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
  notify_on_attachment_download INTEGER NOT NULL DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS account_file_storage_usage (
  user_id TEXT PRIMARY KEY,
  used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account_file_storage_reservations (
  note_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  encrypted_size INTEGER NOT NULL CHECK (encrypted_size >= 0),
  total_chunks INTEGER,
  max_reads INTEGER,
  file_access_window_seconds INTEGER NOT NULL DEFAULT 900,
  expires_at TEXT,
  last_checked_at TEXT,
  status TEXT NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved', 'active', 'released')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  activated_at TEXT,
  released_at TEXT,
  release_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_file_storage_reservations_user_status
  ON account_file_storage_reservations(user_id, status);

CREATE TABLE IF NOT EXISTS token_usage_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens INTEGER NOT NULL DEFAULT 0 CHECK (completion_tokens >= 0),
  cost_usd REAL NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  billing_month TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_token_usage_logs_user_month
  ON token_usage_logs(user_id, billing_month);

CREATE INDEX IF NOT EXISTS idx_token_usage_logs_created_at
  ON token_usage_logs(created_at);
