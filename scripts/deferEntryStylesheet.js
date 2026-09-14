/**
 * Keep the Vite entry CSS render-blocking so prerendered HTML cannot paint
 * unstyled. Also converts leftover preload / media="not all" deferral back.
 *
 * Do not reintroduce a <noscript> stylesheet fallback: Cloudflare unwraps
 * noscript and the inner link becomes a second stylesheet tag.
 */
const ENTRY_CSS_HREF_RE = /\/assets\/index-[A-Za-z0-9_-]+\.css/;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ensureBlockingEntryStylesheet(html) {
  const hrefMatch = html.match(ENTRY_CSS_HREF_RE);
  if (!hrefMatch) return html;

  const href = hrefMatch[0];
  const hrefRe = escapeRegExp(href);
  const linkRe = new RegExp(`<link\\b[^>]*href=["']${hrefRe}["'][^>]*>`, "gi");
  const tags = html.match(linkRe) || [];
  const crossorigin = tags.some((tag) => /crossorigin/i.test(tag))
    ? " crossorigin"
    : "";
  const blocking = `<link rel="stylesheet" href="${href}"${crossorigin}>`;

  let out = html.replace(
    /<script\b[^>]*\bsrc=["']\/load-stylesheet\.js["'][^>]*>\s*<\/script>\s*/gi,
    "",
  );
  out = out.replace(
    new RegExp(
      `<noscript>\\s*<link\\b[^>]*href=["']${hrefRe}["'][^>]*>\\s*</noscript>\\s*`,
      "gi",
    ),
    "",
  );

  const remaining = out.match(
    new RegExp(`<link\\b[^>]*href=["']${hrefRe}["'][^>]*>\\s*`, "gi"),
  );
  if (remaining?.length) {
    let replaced = false;
    out = out.replace(
      new RegExp(`<link\\b[^>]*href=["']${hrefRe}["'][^>]*>\\s*`, "gi"),
      () => {
        if (replaced) return "";
        replaced = true;
        return `${blocking}\n`;
      },
    );
    return out;
  }

  if (/<\/head>/i.test(out)) {
    return out.replace(/<\/head>/i, `${blocking}\n</head>`);
  }
  return `${out}${blocking}`;
}

/** @deprecated Prefer {@link ensureBlockingEntryStylesheet}. */
export function deferEntryStylesheet(html) {
  return ensureBlockingEntryStylesheet(html);
}

/** Keep vendor-react, vendor-query, and the entry chunk; drop other modulepreloads. */
export function stripStaleModulePreloads(html) {
  return html.replace(
    /<link\s+rel="modulepreload"[^>]*href="\/assets\/(?!vendor-react-|vendor-query-|index-)[^"]*\.js"[^>]*\/?>/gi,
    "",
  );
}
