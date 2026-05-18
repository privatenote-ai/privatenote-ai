-- Baseline auth schema for D1 (wrangler dev / migrations apply).
-- Keep in sync with src/auth/schema.sql when adding or changing auth tables.

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
  email_notifications INTEGER NOT NULL DEFAULT 1 CHECK (email_notifications IN (0, 1)),
  preferred_language TEXT CHECK (preferred_language IN ('en', 'de', 'fr', 'es'))
);

CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS note_read_notifications (
  note_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  opened_at TEXT,
  notified_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_note_read_notifications_user_created
  ON note_read_notifications(user_id, created_at DESC);
