-- Manual upgrade: drop the en/de/fr/es CHECK on users.preferred_language.
-- Prefer wrangler D1 migrations (0027 production / 0021 staging) on deploy.
ALTER TABLE users ADD COLUMN preferred_language_next TEXT;
UPDATE users SET preferred_language_next = preferred_language;
ALTER TABLE users DROP COLUMN preferred_language;
ALTER TABLE users RENAME COLUMN preferred_language_next TO preferred_language;
