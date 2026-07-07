/**
 * Inject per-route <title> and meta descriptions into prerendered HTML snapshots.
 * Crawlers read static HTML; client-side setDocumentMeta runs too late for Ahrefs.
 */
import { resolveDocumentMeta } from "../client/src/utils/resolveDocumentMeta.ts";
import { buildStaticBlogPosts } from "../client/src/utils/staticBlogPosts.ts";
import { en } from "../client/src/utils/translations/en.ts";
import { de } from "../client/src/utils/translations/de.ts";
import { fr } from "../client/src/utils/translations/fr.ts";
import { es } from "../client/src/utils/translations/es.ts";
import { it } from "../client/src/utils/translations/it.ts";
import { nl } from "../client/src/utils/translations/nl.ts";
import { pt } from "../client/src/utils/translations/pt.ts";
import { sr } from "../client/src/utils/translations/sr.ts";
import { hr } from "../client/src/utils/translations/hr.ts";
import type { Translations } from "../client/src/utils/translations/types.ts";
import { buildBlogArticleStructuredData } from "./blogStructuredData.ts";
import { isLocaleHomeRoute } from "./homeSeoLinks.ts";
import { resolveCanonicalBlogSlug } from "./localizedBlogSlugs.ts";
import {
  buildSecureFileTransferFaqSchema,
  isSecureFileTransferRoute,
  stripPrerenderCloudflareAnalyticsBeacons,
} from "./secureFileTransferStructuredData.ts";
import {
  buildPasswordGeneratorFaqSchema,
  isPasswordGeneratorRoute,
} from "./passwordGeneratorStructuredData.ts";
import { isSupportedLanguage, type SupportedLanguage } from "./supportedLanguages.ts";

const LOCALE_TRANSLATIONS: Record<Exclude<SupportedLanguage, "en">, Translations> = {
  de: { ...en, ...de },
  fr: { ...en, ...fr },
  es: { ...en, ...es },
  it: { ...en, ...it },
  nl: { ...en, ...nl },
  pt: { ...en, ...pt },
  sr: { ...en, ...sr },
  hr: { ...en, ...hr },
};

const DEFAULT_SHELL_TITLE = "PrivateNote.ai - Secure Encrypted Notes";

const OG_LOCALE_BY_LANG: Record<string, string> = {
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
  nl: "nl_NL",
  pt: "pt_PT",
  sr: "sr_RS",
  hr: "hr_HR",
};

function translationsForRoute(route: string): Translations {
  const first = route.split("/").filter(Boolean)[0];
  if (isSupportedLanguage(first) && first !== "en") {
    return LOCALE_TRANSLATIONS[first];
  }
  return en;
}

function htmlLangForRoute(route: string): string {
  const first = route.split("/").filter(Boolean)[0];
  if (isSupportedLanguage(first) && first !== "en") return first;
  return "en";
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function parseJsonStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function replaceMetaContent(html: string, attr: "name" | "property", key: string, content: string): string {
  const escaped = escapeHtmlAttr(content);
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

function blogSlugFromRoute(route: string): string | null {
  const parts = route.split("/").filter(Boolean);
  const blogIndex = parts.indexOf("blog");
  if (blogIndex < 0) return null;
  return parts[blogIndex + 1] ?? null;
}

function injectBlogStructuredData(html: string, route: string, language: SupportedLanguage, t: Translations): string {
  const slugFromRoute = blogSlugFromRoute(route);
  if (!slugFromRoute) return html;

  const canonicalSlug = resolveCanonicalBlogSlug(slugFromRoute);
  if (!canonicalSlug) return html;

  const post = buildStaticBlogPosts(t).find((entry) => entry.slug === canonicalSlug);
  if (!post) return html;

  const schema = buildBlogArticleStructuredData({
    slug: canonicalSlug,
    language,
    title: post.title,
    description: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    image: post.coverImage,
    tags: parseJsonStringArray(post.tags),
  });
  const script = `<script type="application/ld+json" data-structured-data-id="blog-article">${serializeJsonLd(schema)}</script>`;

  const withoutExisting = html.replace(
    /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']blog-article["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  return withoutExisting.replace("</head>", `${script}\n</head>`);
}

function injectSecureFileTransferFaqSchema(html: string, route: string, t: Translations): string {
  if (!isSecureFileTransferRoute(route)) return html;

  const schema = buildSecureFileTransferFaqSchema(t);
  const script = `<script type="application/ld+json" data-structured-data-id="secure-file-transfer-faq">${serializeJsonLd(schema)}</script>`;

  const withoutExisting = html.replace(
    /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']secure-file-transfer-faq["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  return withoutExisting.replace("</head>", `${script}\n</head>`);
}

function injectPasswordGeneratorFaqSchema(html: string, route: string, t: Translations): string {
  if (!isPasswordGeneratorRoute(route)) return html;

  const schema = buildPasswordGeneratorFaqSchema(t);
  const script = `<script type="application/ld+json" data-structured-data-id="password-generator-faq">${serializeJsonLd(schema)}</script>`;

  const withoutExisting = html.replace(
    /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']password-generator-faq["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  return withoutExisting.replace("</head>", `${script}\n</head>`);
}

export function injectPrerenderDocumentMeta(html: string, route: string): string {
  const t = translationsForRoute(route);
  const { title, description } = resolveDocumentMeta(route, t);
  const lang = htmlLangForRoute(route) as SupportedLanguage;

  let out = stripHomePrerenderHero(html, route);

  out = out.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${lang}"`);
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtmlAttr(title)}</title>`);

  out = replaceMetaContent(out, "name", "description", description);
  out = replaceMetaContent(out, "property", "og:title", title);
  out = replaceMetaContent(out, "property", "og:description", description);
  out = replaceMetaContent(out, "name", "twitter:title", title);
  out = replaceMetaContent(out, "name", "twitter:description", description);

  out = replaceMetaContent(out, "property", "og:locale", OG_LOCALE_BY_LANG[lang] ?? "en_US");
  out = injectBlogStructuredData(out, route, lang, t);
  out = injectSecureFileTransferFaqSchema(out, route, t);
  out = injectPasswordGeneratorFaqSchema(out, route, t);
  out = stripPrerenderCloudflareAnalyticsBeacons(out);

  return out;
}

/** Shell title from client/index.html — used to detect missing client meta updates during prerender. */
export function isDefaultShellDocumentTitle(title: string): boolean {
  return title.trim() === DEFAULT_SHELL_TITLE;
}
