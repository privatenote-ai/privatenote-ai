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
  // Required in production for magic-link KV integrity (HMAC). Optional only when AUTH_ALLOW_UNSIGNED_MAGIC_LINK=1 or Worker URL is localhost.
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
}
