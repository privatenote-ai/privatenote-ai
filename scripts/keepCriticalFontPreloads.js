/**
 * Homepage LCP should preload only Satoshi Bold latin (hero) and Inter 400 latin (UI).
 * Vite preloads every @font-face in CSS; latin-ext and 600 would contend with CSS/JS.
 */
import fs from "node:fs";

const FONT_PRELOAD_RE = /\s*<link\b[^>]*rel=["']preload["'][^>]*>/gi;
const CRITICAL_FONT_HREF_RE =
  /(?:Satoshi-latin-700|Inter-latin-400)[^"'/]*\.woff2/i;
const CRITICAL_FONT_FILE_RE = [
  /^Satoshi-latin-700[^/]*\.woff2$/,
  /^Inter-latin-400[^/]*\.woff2$/,
];

function isFontPreload(tag) {
  return /\bas=["']font["']/i.test(tag);
}

function isCriticalFontPreload(tag) {
  return CRITICAL_FONT_HREF_RE.test(tag);
}

function preloadTag(file) {
  return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`;
}

function ensureCriticalFontPreloadTags(html, assetsDir) {
  if (!assetsDir || !fs.existsSync(assetsDir)) return html;
  const files = fs.readdirSync(assetsDir);
  const needed = CRITICAL_FONT_FILE_RE.map((pattern) =>
    files.find((file) => pattern.test(file)),
  ).filter(Boolean);

  const extra = [];
  for (const file of needed) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const already =
      new RegExp(`rel=["']preload["'][^>]*${escaped}`, "i").test(html) ||
      new RegExp(`${escaped}[^>]*rel=["']preload["']`, "i").test(html);
    if (!already) extra.push(preloadTag(file));
  }
  if (!extra.length) return html;
  const block = extra.map((tag) => `  ${tag}`).join("\n");
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${block}\n</head>`);
  }
  return `${html}${block}`;
}

export function keepCriticalFontPreloads(html, assetsDir) {
  const stripped = html.replace(FONT_PRELOAD_RE, (tag) => {
    if (!isFontPreload(tag)) return tag;
    return isCriticalFontPreload(tag) ? tag : "";
  });
  return ensureCriticalFontPreloadTags(stripped, assetsDir);
}
