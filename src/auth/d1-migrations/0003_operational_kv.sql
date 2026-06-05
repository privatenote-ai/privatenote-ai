-- EU-only replacement for Cloudflare Workers KV operational state.
-- Stores rate limits, note reservations, Turnstile challenge state,
-- analytics aggregates, and auth support tokens in the EU-jurisdiction D1 DB.

CREATE TABLE IF NOT EXISTS operational_kv (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (namespace, key)
);

CREATE INDEX IF NOT EXISTS idx_operational_kv_expires_at
  ON operational_kv(expires_at);
