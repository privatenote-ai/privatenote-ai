-- Opt-in: keep sender branding on the opened-note view (default off for screenshot hygiene).
ALTER TABLE users ADD COLUMN business_show_branding_after_reveal INTEGER NOT NULL DEFAULT 0
  CHECK (business_show_branding_after_reveal IN (0, 1));
