ALTER TABLE account_file_storage_reservations
  ADD COLUMN file_access_window_seconds INTEGER NOT NULL DEFAULT 900;

ALTER TABLE account_file_storage_reservations
  ADD COLUMN expires_at TEXT;

ALTER TABLE account_file_storage_reservations
  ADD COLUMN last_checked_at TEXT;
