-- Add preferred_language column to users table.
-- The baseline schema (0001) already defines this column for fresh databases;
-- this migration adds it to existing production databases that were created before
-- the column was included in the baseline.
ALTER TABLE users ADD COLUMN preferred_language TEXT CHECK (preferred_language IN ('en', 'de', 'fr', 'es'));
