-- Opt-in for non-private hosted AI (Cloudflare Workers AI). Default off.
ALTER TABLE users ADD COLUMN allow_hosted_ai INTEGER NOT NULL DEFAULT 0 CHECK (allow_hosted_ai IN (0, 1));
