CREATE TABLE IF NOT EXISTS account_file_storage_usage (
  user_id TEXT PRIMARY KEY,
  used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account_file_storage_reservations (
  note_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  encrypted_size INTEGER NOT NULL CHECK (encrypted_size >= 0),
  total_chunks INTEGER,
  max_reads INTEGER,
  file_access_window_seconds INTEGER NOT NULL DEFAULT 900,
  expires_at TEXT,
  last_checked_at TEXT,
  status TEXT NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved', 'active', 'released')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  activated_at TEXT,
  released_at TEXT,
  release_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_file_storage_reservations_user_status
  ON account_file_storage_reservations(user_id, status);
