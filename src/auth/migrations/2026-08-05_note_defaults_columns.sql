-- Extend synced note defaults with file-access window and reader language (Starter+).
ALTER TABLE user_note_defaults ADD COLUMN file_access_window_seconds INTEGER;
ALTER TABLE user_note_defaults ADD COLUMN reader_language TEXT;
