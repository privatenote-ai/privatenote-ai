/**
 * Convert Vite's render-blocking entry CSS into a preload + media="not all"
 * stylesheet so first paint can use inline critical CSS (hero title).
 *
 * Do not use a <noscript> stylesheet fallback: Cloudflare unwraps noscript and
 * the inner link becomes render-blocking again.
 */
const ENTRY_CSS_HREF_RE = /\/assets\/index-[A-Za-z0-9_-]+\.css/;

export function deferEntryStylesheet(html) {
  const hrefMatch = html.match(/href=["'](\/assets\/index-[A-Za-z0-9_-]+\.css)["']/i);
  if (!hrefMatch) return html;

  const href = hrefMatch[1];
  if (!ENTRY_CSS_HREF_RE.test(href)) return html;

  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const entryLinkRe = new RegExp(
    `<link\\s+[^>]*href=["']${escapedHref}["'][^>]*>\\s*`,
    "gi",
  );
  const existing = html.match(entryLinkRe) || [];
  const crossorigin = existing.some((tag) => /crossorigin/i.test(tag))
    ? " crossorigin"
    : "";

  entryLinkRe.lastIndex = 0;
  let out = html.replace(entryLinkRe, "");
  out = out.replace(
    /<noscript>\s*<link\s+rel=["']stylesheet["'][^>]*\/assets\/index-[A-Za-z0-9_-]+\.css[^>]*>\s*<\/noscript>\s*/gi,
    "",
  );

  const loader = out.includes("/load-stylesheet.js")
    ? ""
    : `<script defer src="/load-stylesheet.js"></script>\n`;
  const tags =
    `<link rel="preload" href="${href}" as="style"${crossorigin} />\n` +
    `<link rel="stylesheet" href="${href}" media="not all" data-pn-defer-css${crossorigin} />\n` +
    loader;

  if (out.includes("</head>")) {
    return out.replace("</head>", `${tags}</head>`);
  }
  return tags + out;
}

/** Keep vendor-react, vendor-query, and the entry chunk; drop other modulepreloads. */
export function stripStaleModulePreloads(html) {
  return html.replace(
    /<link\s+rel="modulepreload"[^>]*href="\/assets\/(?!vendor-react-|vendor-query-|index-)[^"]*\.js"[^>]*\/?>/gi,
    "",
  );
}
