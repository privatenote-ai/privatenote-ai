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
  business_display_name TEXT,
  business_sender_name TEXT,
  business_sender_role TEXT,
  business_trust_message TEXT,
  business_logo_key TEXT,
  business_banner_key TEXT,
  business_accent_color TEXT,
  business_background_color TEXT,
  business_text_color TEXT,
  business_background_style TEXT DEFAULT 'neutral' CHECK (business_background_style IN ('neutral', 'gradient', 'banner')),
  business_portal_layout TEXT,
  business_show_branding_after_reveal INTEGER NOT NULL DEFAULT 0 CHECK (business_show_branding_after_reveal IN (0, 1)),
  business_opened_branding TEXT,
  email_notifications INTEGER NOT NULL DEFAULT 1 CHECK (email_notifications IN (0, 1)),
  preferred_language TEXT CHECK (preferred_language IN ('en', 'de', 'fr', 'es')),
  allow_hosted_ai INTEGER NOT NULL DEFAULT 0 CHECK (allow_hosted_ai IN (0, 1))
);

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
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_activity_user_created ON account_activity(user_id, created_at DESC);

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
