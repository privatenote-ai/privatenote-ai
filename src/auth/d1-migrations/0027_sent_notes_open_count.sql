-- Persist Reveal open counts on sent-note Activity rows so "N of M"
-- survives after the ciphertext (and its current_reads) is deleted.
ALTER TABLE sent_notes ADD COLUMN open_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sent_notes ADD COLUMN max_reads INTEGER;
