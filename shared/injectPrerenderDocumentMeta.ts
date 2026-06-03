/**
 * Inject per-route <title> and meta descriptions into prerendered HTML snapshots.
 * Crawlers read static HTML; client-side setDocumentMeta runs too late for Ahrefs.
 */
import { resolveDocumentMeta } from "../client/src/utils/resolveDocumentMeta.ts";
import { en } from "../client/src/utils/translations/en.ts";
import { de } from "../client/src/utils/translations/de.ts";
import { fr } from "../client/src/utils/translations/fr.ts";
import { es } from "../client/src/utils/translations/es.ts";
import type { Translations } from "../client/src/utils/translations/types.ts";
import { isLocaleHomeRoute } from "./homeSeoLinks.ts";

const LOCALE_TRANSLATIONS: Record<"de" | "fr" | "es", Translations> = {
  de: { ...en, ...de },
  fr: { ...en, ...fr },
  es: { ...en, ...es },
};

const DEFAULT_SHELL_TITLE = "PrivateNote.ai - Secure Encrypted Notes";

function translationsForRoute(route: string): Translations {
  const first = route.split("/").filter(Boolean)[0];
  if (first === "de" || first === "fr" || first === "es") {
    return LOCALE_TRANSLATIONS[first];
  }
  return en;
}

function htmlLangForRoute(route: string): string {
  const first = route.split("/").filter(Boolean)[0];
  if (first === "de" || first === "fr" || first === "es") return first;
  return "en";
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceMetaContent(html: string, attr: "name" | "property", key: string, content: string): string {
  const escaped = escapeHtmlAttr(content);
  // Use separate patterns for double-quoted and single-quoted content values.
  // The combined ["'][^"']*["'] pattern incorrectly treats apostrophes inside
  // double-quoted values (e.g. "Here's how") as the closing delimiter, causing
  // the match to fail and a duplicate tag to be appended instead.
  const reDQ = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content="[^"]*"\\s*/?>`, "i");
  const reSQ = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content='[^']*'\\s*/?>`, "i");
  if (reDQ.test(html)) {
    return html.replace(reDQ, `<meta ${attr}="${key}" content="${escaped}" />`);
  }
  if (reSQ.test(html)) {
    return html.replace(reSQ, `<meta ${attr}="${key}" content="${escaped}" />`);
  }
  return html.replace("</head>", `<meta ${attr}="${key}" content="${escaped}" /></head>`);
}

/** Remove static home hero snapshot so crawlers do not see duplicate H1 on inner pages. */
function stripHomePrerenderHero(html: string, route: string): string {
  if (route === "/" || isLocaleHomeRoute(route)) return html;
  return html.replace(
    /\s*<div id="pn-home-prerender"[\s\S]*?<\/div>\s*(?=<\/div>\s*<noscript>)/i,
    "\n",
  );
}

export function injectPrerenderDocumentMeta(html: string, route: string): string {
  const t = translationsForRoute(route);
  const { title, description } = resolveDocumentMeta(route, t);
  const lang = htmlLangForRoute(route);

  let out = stripHomePrerenderHero(html, route);

  out = out.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${lang}"`);
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtmlAttr(title)}</title>`);

  out = replaceMetaContent(out, "name", "description", description);
  out = replaceMetaContent(out, "property", "og:title", title);
  out = replaceMetaContent(out, "property", "og:description", description);
  out = replaceMetaContent(out, "name", "twitter:title", title);
  out = replaceMetaContent(out, "name", "twitter:description", description);

  const ogLocale =
    lang === "de" ? "de_DE" : lang === "fr" ? "fr_FR" : lang === "es" ? "es_ES" : "en_US";
  out = replaceMetaContent(out, "property", "og:locale", ogLocale);

  return out;
}

/** Shell title from client/index.html — used to detect missing client meta updates during prerender. */
export function isDefaultShellDocumentTitle(title: string): boolean {
  return title.trim() === DEFAULT_SHELL_TITLE;
}
