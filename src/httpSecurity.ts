/**
 * Security headers for Worker responses. CSP here applies to API JSON responses;
 * the browser enforces CSP for documents from HTML (see client/index.html / edge).
 *
 * Note: Nonce-based `strict-dynamic` script CSP needs per-response HTML rewriting; not used yet.
 */

export function getApiContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://cdn.jsdelivr.net 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://*.privatenote-ai.pages.dev https://privatenote.ai https://*.privatenote.ai https://challenges.cloudflare.com https://cloudflareinsights.com https://huggingface.co https://*.huggingface.co https://cdn-lfs.huggingface.co https://cdn-lfs-us-1.huggingface.co https://cdn-lfs-eu-1.huggingface.co https://cdn-lfs-us-1.hf.co https://cdn-lfs-eu-1.hf.co https://*.hf.co https://*.r2.dev https://raw.githubusercontent.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https:",
    "frame-src https://challenges.cloudflare.com",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Baseline hardening headers (OWASP secure-header guidance). PublicKey Credentials allowlists
 * keep WebAuthn working when the policy is enforced.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": [
    "accelerometer=()",
    "camera=()",
    "geolocation=()",
    "gyroscope=()",
    "magnetometer=()",
    "microphone=()",
    "payment=()",
    "usb=()",
    "interest-cohort=()",
    "publickey-credentials-get=(self)",
    "publickey-credentials-create=(self)",
  ].join(", "),
};
