/**
 * Convert Vite's render-blocking entry CSS into a preload so first paint can
 * use the inline critical CSS (hero title) instead of waiting ~40KB of Tailwind.
 */
const ENTRY_CSS_HREF_RE = /\/assets\/index-[A-Za-z0-9_-]+\.css/;
const BLOCKING_ENTRY_CSS_RE =
  /<link\s+rel=["']stylesheet["']([^>]*href=["'](\/assets\/index-[A-Za-z0-9_-]+\.css)["'][^>]*)\/?>/i;

export function deferEntryStylesheet(html) {
  const match = html.match(BLOCKING_ENTRY_CSS_RE);
  if (!match) return html;

  const href = match[2];
  if (!ENTRY_CSS_HREF_RE.test(href)) return html;

  const extra = match[1];
  const crossorigin = /crossorigin/i.test(extra) ? " crossorigin" : "";
  const loader = html.includes("/load-stylesheet.js")
    ? ""
    : `<script defer src="/load-stylesheet.js"></script>\n`;
  const replacement =
    `<link rel="preload" href="${href}" as="style"${crossorigin} />\n` +
    loader +
    `<noscript><link rel="stylesheet" href="${href}"${crossorigin} /></noscript>`;
  return html.replace(BLOCKING_ENTRY_CSS_RE, replacement);
}
