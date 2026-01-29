-- Auth schema for D1 (Cloudflare)
-- Apply with: wrangler d1 execute <DB_NAME> --file=src/auth/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  backup_email TEXT,
  backup_email_verified INTEGER DEFAULT 0,
  backup_email_pending TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  last_login_at TEXT
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
  FOREIGN KEY (user_id) REFERENCES users(id)
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
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_hash ON sessions(session_id_hash);
CREATE INDEX IF NOT EXISTS idx_webauthn_credential_id ON webauthn_credentials(credential_id);

CREATE TABLE IF NOT EXISTS recovery_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_recovery_codes_user_id ON recovery_codes(user_id);
