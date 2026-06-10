import { PAGE_CSP_CONNECT_SRC } from "@shared/pageContentSecurityPolicy";

/**
 * Security headers for Worker responses. CSP here applies to API JSON responses;
 * HTML documents get nonce-based CSP from Pages middleware.
 */

export function getApiContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `connect-src ${PAGE_CSP_CONNECT_SRC}`,
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
