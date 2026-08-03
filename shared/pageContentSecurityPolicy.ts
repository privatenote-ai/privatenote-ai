/**
 * HTML document CSP for Cloudflare Pages. Production uses a per-response nonce injected by
 * `functions/_shared/applyHtmlPageSecurity.ts`; dev uses {@link buildDevPageContentSecurityPolicy}.
 */

export const PAGE_CSP_CONNECT_SRC = [
  "'self'",
  "http://localhost:*",
  "http://127.0.0.1:*",
  "https://privatenote-api.marjan-skrobot.workers.dev",
  "https://privatenote-api-staging.marjan-skrobot.workers.dev",
  "https://upload.privatenote.ai",
  "https://upload-staging.privatenote.ai",
  "https://privatenote-ai.pages.dev",
  "https://*.privatenote-ai.pages.dev",
  "https://*.pages.dev",
  "https://privatenote.ai",
  "https://*.privatenote.ai",
  "https://api.pwnedpasswords.com",
  "https://challenges.cloudflare.com",
  "https://cloudflareinsights.com",
  "https://huggingface.co",
  "https://*.huggingface.co",
  "https://cdn-lfs.huggingface.co",
  "https://cdn-lfs-us-1.huggingface.co",
  "https://cdn-lfs-eu-1.huggingface.co",
  "https://cdn-lfs-us-1.hf.co",
  "https://cdn-lfs-eu-1.hf.co",
  "https://*.hf.co",
  "https://*.r2.dev",
  "https://raw.githubusercontent.com",
  "https://cdn.jsdelivr.net",
].join(" ");

const PAGE_CSP_BASE_DIRECTIVES = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  `connect-src ${PAGE_CSP_CONNECT_SRC}`,
  "img-src 'self' data: https: blob:",
  "frame-src https://challenges.cloudflare.com blob: data:",
  "worker-src 'self' blob:",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
] as const;

/** Cryptographically random nonce suitable for CSP `script-src 'nonce-…'`. */
export function generateCspNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Production HTML CSP — pair with {@link injectCspNonceIntoHtml}. */
export function buildPageContentSecurityPolicy(nonce: string): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://challenges.cloudflare.com",
    "'wasm-unsafe-eval'",
  ].join(" ");
  return [`default-src 'self'`, `script-src ${scriptSrc}`, ...PAGE_CSP_BASE_DIRECTIVES.slice(1)].join("; ");
}

/**
 * Dev CSP — keeps `'unsafe-inline'` so Vite React Fast Refresh preamble works.
 * Must stay aligned with `vite.config.ts` dev server headers.
 */
export function buildDevPageContentSecurityPolicy(): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://challenges.cloudflare.com",
    "'wasm-unsafe-eval'",
  ].join(" ");
  return [`default-src 'self'`, `script-src ${scriptSrc}`, ...PAGE_CSP_BASE_DIRECTIVES.slice(1)].join("; ");
}

/** Inject per-request nonce into HTML script tags and expose it for runtime script creation. */
export function injectCspNonceIntoHtml(html: string, nonce: string): string {
  const escapedNonce = nonce.replace(/"/g, "&quot;");
  let out = html;

  if (/<meta\s+name="csp-nonce"/i.test(out)) {
    out = out.replace(
      /<meta\s+name="csp-nonce"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="csp-nonce" content="${escapedNonce}" />`,
    );
  } else {
    out = out.replace(
      /<head(\s[^>]*)?>/i,
      `<head$1>\n  <meta name="csp-nonce" content="${escapedNonce}" />`,
    );
  }

  out = out.replace(/<script(?![^>]*\bnonce=)(?=\s|>)/gi, `<script nonce="${escapedNonce}"`);
  return out;
}
