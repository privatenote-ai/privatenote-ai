/**
 * Inject per-route <title> and meta descriptions into prerendered HTML snapshots.
 * Crawlers read static HTML; client-side setDocumentMeta runs too late for Ahrefs.
 */
import { blogPostTitleForSlug } from "../client/src/components/blog/blogPostTitles.ts";
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
import {
  absolutePublicUrl,
  canonicalAbsoluteUrlForRoute,
  canonicalPathForHomeLanguage,
  homeLanguageFromRoute,
  isLocaleHomeRoute,
  PUBLIC_SITE_ORIGIN,
} from "./homeSeoLinks.ts";
import { isBlogCanonicalSlug, resolveCanonicalBlogSlug } from "./localizedBlogSlugs.ts";
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

/** Must match `client/index.html` and {@link DEFAULT_OG_IMAGE_PATH} in documentMeta.ts */
export const PRERENDER_OG_IMAGE_PATH = "/og-image.png";
export const PRERENDER_OG_IMAGE_WIDTH = "1200";
export const PRERENDER_OG_IMAGE_HEIGHT = "630";

function prerenderOgImageUrl(): string {
  return `${PUBLIC_SITE_ORIGIN}${PRERENDER_OG_IMAGE_PATH}`;
}

function prerenderOgUrlForRoute(route: string): string {
  if (isLocaleHomeRoute(route)) {
    return absolutePublicUrl(canonicalPathForHomeLanguage(homeLanguageFromRoute(route)));
  }
  return canonicalAbsoluteUrlForRoute(route);
}

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

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
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

/** Remove the static home hero snapshot block from prerender HTML. */
export function stripPnHomePrerenderBlock(html: string): string {
  return html.replace(
    /<div\s+id=["']pn-home-prerender["'][^>]*>[\s\S]*?<\/section>\s*<\/div>\s*/gi,
    "",
  );
}

/** Remove static home hero snapshot so crawlers do not see duplicate H1 on inner pages. */
function stripHomePrerenderHero(html: string, route: string): string {
  if (route === "/" || isLocaleHomeRoute(route)) return html;
  return stripPnHomePrerenderBlock(html);
}

function blogSlugFromRoute(route: string): string | null {
  const parts = route.split("/").filter(Boolean);
  const blogIndex = parts.indexOf("blog");
  if (blogIndex < 0) return null;
  return parts[blogIndex + 1] ?? null;
}

function hasNonemptyH1(html: string): boolean {
  const withoutHomeSnapshot = stripPnHomePrerenderBlock(html);
  for (const match of withoutHomeSnapshot.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) return true;
  }
  return false;
}

function buildPrivacyToolsPrerenderArticle(t: Translations): string {
  const title = t.blogPrivacyTitle.trim();
  const paragraphs = [t.blogPrivacyBody1, t.blogPrivacyBody2];
  const educationSections = [
    { title: t.educationNetworkTitle, items: [t.educationNetwork1, t.educationNetwork2, t.educationNetwork3, t.educationNetwork4, t.educationNetwork5] },
    { title: t.educationMobileTitle, items: [t.educationMobile1, t.educationMobile2, t.educationMobile3, t.educationMobile4, t.educationMobile5, t.educationMobile6] },
    { title: t.educationBrowsingTitle, items: [t.educationBrowsing1, t.educationBrowsing2, t.educationBrowsing3, t.educationBrowsing4, t.educationBrowsing5, t.educationBrowsing6] },
    { title: t.educationCommunicationTitle, items: [t.educationCommunication1, t.educationCommunication2, t.educationCommunication3, t.educationCommunication4, t.educationCommunication5, t.educationCommunication6] },
    { title: t.educationPrivacyTitle, items: [t.educationPrivacy1, t.educationPrivacy2, t.educationPrivacy3, t.educationPrivacy4, t.educationPrivacy5, t.educationPrivacy6] },
  ];
  const externalResources = [
    { href: "https://www.eff.org/issues/privacy", label: t.blogPrivacyResourceEff },
    { href: "https://haveibeenpwned.com/", label: t.blogPrivacyResourceHibp },
    { href: "https://2fa.directory/", label: t.blogPrivacyResource2fa },
    { href: "https://signal.org/", label: t.blogPrivacyResourceSignal },
    { href: "https://www.mozilla.org/en-US/privacy/", label: t.blogPrivacyResourceMozilla },
    { href: "https://proton.me/", label: t.blogPrivacyResourceProton },
  ];

  const bodyParagraphs = paragraphs
    .map((paragraph) => `<p>${escapeHtmlText(paragraph)}</p>`)
    .join("");
  const educationHtml = educationSections
    .map(
      (section) =>
        `<section><h2>${escapeHtmlText(section.title)}</h2><ul>${section.items
          .map((item) => `<li>${escapeHtmlText(item)}</li>`)
          .join("")}</ul></section>`,
    )
    .join("");
  const oneTimeSection =
    `<section><h2>${escapeHtmlText(t.blogPrivacyOneTimeTitle)}</h2>` +
    `<p>${escapeHtmlText(t.blogPrivacyOneTimeP1)}</p>` +
    `<p>${escapeHtmlText(t.blogPrivacyOneTimeP2)}</p>` +
    `<p>${escapeHtmlText(t.blogPrivacyOneTimeP3)}</p>` +
    `<ul>` +
    `<li><a href="/how-it-works">${escapeHtmlText(t.blogPrivacyLinkHowItWorks)}</a></li>` +
    `<li><a href="/password-generator">${escapeHtmlText(t.blogPrivacyLinkPasswordGenerator)}</a></li>` +
    `<li><a href="/blog/why-email-is-worst-for-secrets">${escapeHtmlText(t.blogPrivacyLinkEmailSecrets)}</a></li>` +
    `<li><a href="/blog/send-secret-message-without-account">${escapeHtmlText(t.blogPrivacyLinkSecretNoAccount)}</a></li>` +
    `</ul></section>`;
  const toolsMapSection =
    `<section><h2>${escapeHtmlText(t.blogPrivacyToolsMapTitle)}</h2>` +
    `<p>${escapeHtmlText(t.blogPrivacyToolsMapIntro)} <a href="/privacy-tools">${escapeHtmlText(t.blogPrivacyLinkPrivacyTools)}</a>.</p>` +
    `<table><thead><tr><th>${escapeHtmlText(t.blogPrivacyToolsMapColJob)}</th><th>${escapeHtmlText(t.blogPrivacyToolsMapColTool)}</th><th>${escapeHtmlText(t.blogPrivacyToolsMapColStart)}</th></tr></thead>` +
    `<tbody>` +
    `<tr><td>${escapeHtmlText(t.blogPrivacyToolsRowPasswordsJob)}</td><td>${escapeHtmlText(t.blogPrivacyToolsRowPasswordsTool)}</td><td><a href="/password-generator">${escapeHtmlText(t.blogPrivacyToolsRowPasswordsStart)}</a></td></tr>` +
    `<tr><td>${escapeHtmlText(t.blogPrivacyToolsRowSecretsJob)}</td><td>${escapeHtmlText(t.blogPrivacyToolsRowSecretsTool)}</td><td><a href="/">${escapeHtmlText(t.blogPrivacyToolsRowSecretsStart)}</a></td></tr>` +
    `<tr><td>${escapeHtmlText(t.blogPrivacyToolsRowFilesJob)}</td><td>${escapeHtmlText(t.blogPrivacyToolsRowFilesTool)}</td><td><a href="/secure-file-transfer">${escapeHtmlText(t.blogPrivacyToolsRowFilesStart)}</a></td></tr>` +
    `<tr><td>${escapeHtmlText(t.blogPrivacyToolsRowDirectoryJob)}</td><td>${escapeHtmlText(t.blogPrivacyToolsRowDirectoryTool)}</td><td><a href="/privacy-tools">${escapeHtmlText(t.blogPrivacyToolsRowDirectoryStart)}</a></td></tr>` +
    `</tbody></table></section>`;
  const internalLinks =
    `<section><h2>${escapeHtmlText(t.blogPrivacyFurtherReadingTitle)}</h2>` +
    `<h3>${escapeHtmlText(t.blogPrivacyInternalLinksTitle)}</h3>` +
    `<ul>` +
    `<li><a href="/privacy-tools">${escapeHtmlText(t.blogPrivacyLinkPrivacyTools)}</a></li>` +
    `<li><a href="/how-it-works">${escapeHtmlText(t.blogPrivacyLinkHowItWorks)}</a></li>` +
    `<li><a href="/password-generator">${escapeHtmlText(t.blogPrivacyLinkPasswordGenerator)}</a></li>` +
    `<li><a href="/security-resources">${escapeHtmlText(t.blogPrivacyLinkSecurityResources)}</a></li>` +
    `</ul>` +
    `<h3>${escapeHtmlText(t.blogPrivacyExternalLinksTitle)}</h3>` +
    `<ul>${externalResources.map((resource) => `<li><a href="${escapeHtmlAttr(resource.href)}">${escapeHtmlText(resource.label)}</a></li>`).join("")}</ul>` +
    `</section>`;

  return (
    `<article data-privatenote-prerender-article="privacy-tools">` +
    `<h1 data-privatenote-prerender-h1="true">${escapeHtmlText(title)}</h1>` +
    bodyParagraphs +
    `<section><h2>${escapeHtmlText(t.blogPrivacyHabitsTitle)}</h2>${educationHtml}</section>` +
    oneTimeSection +
    toolsMapSection +
    internalLinks +
    `</article>`
  );
}

/** Ensure blog article snapshots expose crawler-visible content when React did not hydrate in time. */
function injectBlogPostCrawlerFallback(html: string, route: string, t: Translations): string {
  const slugFromRoute = blogSlugFromRoute(route);
  if (!slugFromRoute) return html;

  const canonicalSlug = resolveCanonicalBlogSlug(slugFromRoute);
  if (!canonicalSlug || !isBlogCanonicalSlug(canonicalSlug)) return html;

  if (hasNonemptyH1(html)) return html;

  const emptyRoot = /<div\s+id=["']root["']\s*>\s*<\/div>/i;
  if (canonicalSlug === "privacy-tools" && emptyRoot.test(html)) {
    const article = buildPrivacyToolsPrerenderArticle(t);
    return html.replace(emptyRoot, `<div id="root"><main>${article}</main></div>`);
  }

  const title = blogPostTitleForSlug(canonicalSlug, t).trim();
  if (!title) return html;

  const h1 =
    `<h1 class="mb-5 max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 dark:text-white" ` +
    `data-privatenote-prerender-h1="true">${escapeHtmlAttr(title)}</h1>`;

  const articleOpen = html.match(/<article\b[^>]*>/i);
  if (articleOpen) {
    const idx = html.indexOf(articleOpen[0]) + articleOpen[0].length;
    return html.slice(0, idx) + h1 + html.slice(idx);
  }

  if (emptyRoot.test(html)) {
    return html.replace(emptyRoot, `<div id="root"><main>${h1}</main></div>`);
  }

  const mainOpen = html.match(/<main\b[^>]*>/i);
  if (mainOpen) {
    const idx = html.indexOf(mainOpen[0]) + mainOpen[0].length;
    return html.slice(0, idx) + h1 + html.slice(idx);
  }

  return html.replace(/<body[^>]*>/i, (match) => `${match}<main>${h1}</main>`);
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

  const ogImageUrl = prerenderOgImageUrl();
  out = replaceMetaContent(out, "property", "og:url", prerenderOgUrlForRoute(route));
  out = replaceMetaContent(out, "property", "og:type", "website");
  out = replaceMetaContent(out, "property", "og:site_name", "PrivateNote.ai");
  out = replaceMetaContent(out, "property", "og:image", ogImageUrl);
  out = replaceMetaContent(out, "property", "og:image:width", PRERENDER_OG_IMAGE_WIDTH);
  out = replaceMetaContent(out, "property", "og:image:height", PRERENDER_OG_IMAGE_HEIGHT);
  out = replaceMetaContent(out, "name", "twitter:image", ogImageUrl);

  out = replaceMetaContent(out, "property", "og:locale", OG_LOCALE_BY_LANG[lang] ?? "en_US");
  out = injectBlogStructuredData(out, route, lang, t);
  out = injectBlogPostCrawlerFallback(out, route, t);
  out = injectPasswordGeneratorFaqSchema(out, route, t);
  out = injectSecureFileTransferFaqSchema(out, route, t);
  out = stripPrerenderCloudflareAnalyticsBeacons(out);

  return out;
}

/** Shell title from client/index.html — used to detect missing client meta updates during prerender. */
export function isDefaultShellDocumentTitle(title: string): boolean {
  return title.trim() === DEFAULT_SHELL_TITLE;
}
