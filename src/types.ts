import type { DurableObjectNamespace, KVNamespace, D1Database, R2Bucket } from "@cloudflare/workers-types";

export type WorkersAiBinding = {
  run: (model: string, input: unknown, options?: unknown) => Promise<unknown>;
};

export interface Env {
  NOTES_KV: KVNamespace;
  NOTE_FILES_R2?: R2Bucket;
  SECURE_NOTES: DurableObjectNamespace;
  AI?: WorkersAiBinding;
  TURNSTILE_SECRET_KEY?: string;
  /** Staging-only: skip Turnstile on magic/send so Resend is not silently dropped. */
  AUTH_RELAX_TURNSTILE?: string;
  // Rate limiting KV namespace (can use same as NOTES_KV or separate)
  RATE_LIMIT_KV?: KVNamespace;
  // Analytics KV namespace (can use same as NOTES_KV or separate)
  ANALYTICS_KV?: KVNamespace;
  // Auth scaffolding (optional until configured)
  AUTH_DB?: D1Database;
  AUTH_KV?: KVNamespace;
  AUTH_TOKENS?: DurableObjectNamespace;
  AUTH_EMAIL_FROM?: string;
  AUTH_EMAIL_PROVIDER?: string;
  RESEND_API_KEY?: string;
  /** Stripe secret key for server-side billing portal sessions. Set via `wrangler secret put STRIPE_SECRET_KEY`. */
  STRIPE_SECRET_KEY?: string;
  /** Stripe webhook signing secret. Required for `/api/auth/billing/stripe/webhook`. */
  STRIPE_WEBHOOK_SECRET?: string;
  /** Stripe API version pinned on every outbound request. Defaults to 2025-03-31.basil. */
  STRIPE_API_VERSION?: string;
  /** USD prices. */
  STRIPE_PRICE_PERSONAL_MONTHLY?: string;
  STRIPE_PRICE_PERSONAL_YEARLY?: string;
  STRIPE_PRICE_BUSINESS_MONTHLY?: string;
  STRIPE_PRICE_BUSINESS_YEARLY?: string;
  /** EUR prices selected server-side for customers detected in Europe. */
  STRIPE_PRICE_PERSONAL_MONTHLY_EUR?: string;
  STRIPE_PRICE_PERSONAL_YEARLY_EUR?: string;
  STRIPE_PRICE_BUSINESS_MONTHLY_EUR?: string;
  STRIPE_PRICE_BUSINESS_YEARLY_EUR?: string;
  /** Optional Billing Portal configuration that controls allowed plan switches. */
  STRIPE_PORTAL_CONFIGURATION_ID?: string;
  /** Explicit payment-failure grace window. Defaults to 3 days when omitted. */
  STRIPE_GRACE_PERIOD_DAYS?: string;
  /** Maximum Stripe subscriptions reconciled by each cron run. Defaults to 100. */
  STRIPE_RECONCILIATION_LIMIT?: string;
  // Required in production for magic-link KV integrity and recipient email gate HMACs.
  // Optional only when AUTH_ALLOW_UNSIGNED_MAGIC_LINK=1 or Worker URL is localhost and recipient email gates are not used.
  AUTH_SECRET_KEY?: string;
  /** Dev-only: allow magic links without AUTH_SECRET_KEY / unsigned KV rows. Never set in production. */
  AUTH_ALLOW_UNSIGNED_MAGIC_LINK?: string;
  // Admin API token (set via wrangler secret put ADMIN_TOKEN). Required for /api/admin/*.
  ADMIN_TOKEN?: string;
  /**
   * Base32-encoded TOTP secret for admin 2FA. When set, POST /api/admin/auth requires
   * both a valid token AND a valid 6-digit TOTP code from an authenticator app.
   * Generate with: `npx otpauth-secret` or any base32 TOTP secret generator.
   * Set via: `wrangler secret put ADMIN_TOTP_SECRET`
   */
  ADMIN_TOTP_SECRET?: string;
  /**
   * Canonical web app origin for links emailed from the API when the browser `Origin` header is absent
   * (e.g. misrouted or non-browser callers). Must be a trusted first-party origin; see `getMagicLinkOrigin`.
   */
  PUBLIC_WEB_APP_ORIGIN?: string;
  /** Set to "1" or "true" in [vars] temporarily: WebAuthn 400 responses include a `debug` field; all failures log to Worker logs. */
  AUTH_DEBUG?: string;
  /** Base64-encoded 256-bit key for AES-GCM encryption of TOTP secrets at rest. Set via `wrangler secret put TOTP_ENCRYPTION_KEY`. */
  TOTP_ENCRYPTION_KEY?: string;
  /** R2 S3 API credentials for browser presigned PUTs (large attachments). */
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  /** Cloudflare account id — used as `https://{id}.r2.cloudflarestorage.com`. */
  R2_ACCOUNT_ID?: string;
  /** Note-files bucket name for S3 API presigns (e.g. privatenote-files-staging-eu). */
  R2_BUCKET_NAME?: string;
  /** Set in wrangler.local.toml — skip EU D1-backed KV shim and use Miniflare KV bindings. */
  LOCAL_DEV?: string;
}
