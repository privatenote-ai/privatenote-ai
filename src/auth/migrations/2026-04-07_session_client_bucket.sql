-- Session row: bind "one active session per client bucket" to first-party pn_client_id + IP when available,
-- instead of raw User-Agent alone (avoids unrelated devices with identical UA strings superseding each other).
-- Apply with: wrangler d1 execute <DB_NAME> --file=src/auth/migrations/2026-04-07_session_client_bucket.sql
-- Or use scripts/safe-d1-migrate-auth.sh (ensure_column sessions client_bucket).

ALTER TABLE sessions ADD COLUMN client_bucket TEXT;
