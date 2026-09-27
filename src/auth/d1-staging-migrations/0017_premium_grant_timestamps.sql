-- Staging drifted from production: 0007_stripe_billing_entitlements added these
-- two columns there, but no staging migration ever did. Without them
-- /api/auth/account/summary logs "no such column: premium_granted_at" and falls
-- back to a billing-free summary.
ALTER TABLE users ADD COLUMN premium_granted_at TEXT;
ALTER TABLE users ADD COLUMN premium_revoked_at TEXT;
