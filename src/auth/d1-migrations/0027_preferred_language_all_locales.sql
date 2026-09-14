-- Account preferred language used to CHECK only en/de/fr/es.
-- Product UI languages are defined in shared/supportedLanguages.ts; validate there
-- so adding a locale does not require another table rebuild.
ALTER TABLE users ADD COLUMN preferred_language_next TEXT;
UPDATE users SET preferred_language_next = preferred_language;
ALTER TABLE users DROP COLUMN preferred_language;
ALTER TABLE users RENAME COLUMN preferred_language_next TO preferred_language;
