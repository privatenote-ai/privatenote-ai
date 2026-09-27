ALTER TABLE users ADD COLUMN business_sender_name TEXT;
ALTER TABLE users ADD COLUMN business_sender_role TEXT;
ALTER TABLE users ADD COLUMN business_trust_message TEXT;
ALTER TABLE users ADD COLUMN business_banner_key TEXT;
ALTER TABLE users ADD COLUMN business_background_style TEXT DEFAULT 'neutral';
