-- Account type foundation for account hub and future secure receiving

ALTER TABLE users
  ADD COLUMN account_type TEXT NOT NULL DEFAULT 'free'
  CHECK (account_type IN ('free', 'personal_premium', 'business_premium'));

ALTER TABLE users
  ADD COLUMN business_display_name TEXT;

UPDATE users
SET account_type = CASE lower(coalesce(plan, 'free'))
  WHEN 'business' THEN 'business_premium'
  WHEN 'business_premium' THEN 'business_premium'
  WHEN 'pro' THEN 'personal_premium'
  WHEN 'personal_premium' THEN 'personal_premium'
  ELSE 'free'
END
WHERE account_type IS NULL OR account_type = 'free';
