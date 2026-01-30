-- Remove backup email columns from users table
-- Note: D1 automatically wraps statements in a transaction when executed via wrangler d1 execute

CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  last_login_at TEXT
);

INSERT INTO users_new (id, email, email_verified, status, created_at, updated_at, last_login_at)
SELECT id, email, email_verified, status, created_at, updated_at, last_login_at
FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;
