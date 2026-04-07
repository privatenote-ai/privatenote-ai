-- Harden auth schema: UNIQUE session_id_hash, ON DELETE for FKs, CHECK constraints on enum/boolean columns.
-- Apply once per database: wrangler d1 execute <DB_NAME> --remote --file=src/auth/migrations/2026-04-07_auth_db_integrity.sql
-- Prerequisites: prefer scripts/run-auth-db-integrity-migration.sh (adds missing session columns first).
-- Re-running this file is not idempotent. Uses PRAGMA foreign_keys=OFF so tables referencing users can be rebuilt safely.

PRAGMA foreign_keys = OFF;

-- Older snapshots may not have this table yet; rebuild below replaces it with CASCADE + CHECK.
CREATE TABLE IF NOT EXISTS totp_secrets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  encrypted_secret TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ---------------------------------------------------------------------------
-- webauthn_credentials
-- ---------------------------------------------------------------------------
CREATE TABLE webauthn_credentials_new (
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
INSERT INTO webauthn_credentials_new SELECT * FROM webauthn_credentials;
DROP TABLE webauthn_credentials;
ALTER TABLE webauthn_credentials_new RENAME TO webauthn_credentials;
CREATE UNIQUE INDEX IF NOT EXISTS idx_webauthn_credential_id ON webauthn_credentials(credential_id);

-- ---------------------------------------------------------------------------
-- recovery_codes
-- ---------------------------------------------------------------------------
CREATE TABLE recovery_codes_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO recovery_codes_new SELECT * FROM recovery_codes;
DROP TABLE recovery_codes;
ALTER TABLE recovery_codes_new RENAME TO recovery_codes;
CREATE INDEX IF NOT EXISTS idx_recovery_codes_user_id ON recovery_codes(user_id);

-- ---------------------------------------------------------------------------
-- totp_secrets
-- ---------------------------------------------------------------------------
CREATE TABLE totp_secrets_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  encrypted_secret TEXT NOT NULL,
  verified INTEGER DEFAULT 0 CHECK (verified IN (0, 1)),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO totp_secrets_new
SELECT
  id,
  user_id,
  encrypted_secret,
  CASE WHEN verified IN (0, 1) THEN verified ELSE 0 END,
  created_at
FROM totp_secrets;
DROP TABLE totp_secrets;
ALTER TABLE totp_secrets_new RENAME TO totp_secrets;

-- ---------------------------------------------------------------------------
-- sessions: dedupe session_id_hash (keep newest by created_at), normalize auth_complete, UNIQUE hash index
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS idx_sessions_hash;

CREATE TABLE sessions_new (
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
INSERT INTO sessions_new (
  id,
  session_id_hash,
  user_id,
  expires_at,
  absolute_expires_at,
  revoked_at,
  revoked_reason,
  created_at,
  last_seen_at,
  last_auth_at,
  last_stepup_at,
  user_agent,
  ip,
  city,
  country,
  device_label,
  client_bucket,
  auth_complete
)
SELECT
  s.id,
  s.session_id_hash,
  s.user_id,
  s.expires_at,
  s.absolute_expires_at,
  s.revoked_at,
  s.revoked_reason,
  s.created_at,
  s.last_seen_at,
  s.last_auth_at,
  s.last_stepup_at,
  s.user_agent,
  s.ip,
  s.city,
  s.country,
  s.device_label,
  s.client_bucket,
  CASE WHEN s.auth_complete IN (0, 1) THEN s.auth_complete ELSE 1 END
FROM sessions s
INNER JOIN (
  SELECT id FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY session_id_hash
        ORDER BY datetime(created_at) DESC, id
      ) AS rn
    FROM sessions
  ) WHERE rn = 1
) keep ON keep.id = s.id;
DROP TABLE sessions;
ALTER TABLE sessions_new RENAME TO sessions;
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_session_id_hash ON sessions(session_id_hash);

-- ---------------------------------------------------------------------------
-- audit_log: preserve rows when user is deleted
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log_new (
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
INSERT INTO audit_log_new SELECT * FROM audit_log;
DROP TABLE audit_log;
ALTER TABLE audit_log_new RENAME TO audit_log;
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ---------------------------------------------------------------------------
-- users: CHECK on status and email_verified
-- ---------------------------------------------------------------------------
CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0 CHECK (email_verified IN (0, 1)),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  last_login_at TEXT
);
INSERT INTO users_new (
  id,
  email,
  email_verified,
  status,
  created_at,
  updated_at,
  last_login_at
)
SELECT
  id,
  email,
  CASE WHEN email_verified IN (0, 1) THEN email_verified ELSE 0 END,
  CASE WHEN status IN ('pending', 'active') THEN status ELSE 'active' END,
  created_at,
  updated_at,
  last_login_at
FROM users;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

PRAGMA foreign_keys = ON;
