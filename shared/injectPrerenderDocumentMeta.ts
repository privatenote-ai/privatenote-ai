/**
 * Inject per-route <title> and meta descriptions into prerendered HTML snapshots.
 * Crawlers read static HTML; client-side setDocumentMeta runs too late for Ahrefs.
 */
import { blogPostTitleForSlug } from "../client/src/components/blog/blogPostTitles.ts";
import { privacyToolsGuideEn } from "../client/src/components/blog/locale/privacyToolsGuide.en.ts";
import type { PrivacyToolsGuideArticleCopy } from "../client/src/components/blog/locale/privacyToolsGuide.types.ts";
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
import { tr } from "../client/src/utils/translations/tr.ts";
import { pl } from "../client/src/utils/translations/pl.ts";
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
import {
  buildOneTimeLinkFaqSchema,
  isOneTimeLinkRoute,
} from "./oneTimeLinkStructuredData.ts";
import { getOneTimeLinkCopy } from "../client/src/pages/oneTimeLink/copy.ts";
import {
  buildPrivnoteAlternativeFaqSchema,
  buildPrivnoteAlternativePageSchema,
  isPrivnoteAlternativeRoute,
} from "./privnoteAlternativeStructuredData.ts";
import { getPrivnoteAlternativeCopy } from "../client/src/pages/privnoteAlternative/copy.ts";
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
  tr: { ...en, ...tr },
  pl: { ...en, ...pl },
};

const DEFAULT_SHELL_TITLE = "Encrypted Notes, Photos & Files · PrivateNote.ai";

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
  tr: "tr_TR",
  pl: "pl_PL",
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

/** Remove the static home boot overlay from prerender HTML.
 *  Scans balanced `<div>` tags rather than matching a fixed inner shape, so
 *  the composer shell after the hero section is removed with the title. */
export function stripPnHomePrerenderBlock(html: string): string {
  const open = /<div\s+id=["']pn-home-prerender["'][^>]*>/i.exec(html);
  if (!open || open.index === undefined) return html;

  const openEnd = open.index + open[0].length;
  const tag = /<(\/?)div\b[^>]*>/gi;
  tag.lastIndex = openEnd;
  let depth = 1;

  for (let match = tag.exec(html); match; match = tag.exec(html)) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) {
      const after = html.slice(match.index + match[0].length).replace(/^\s*/, "");
      return stripPnHomePrerenderBlock(html.slice(0, open.index) + after);
    }
  }

  return html;
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
  const next = parts[blogIndex + 1];
  if (!next || next === "category") return null;
  // Post routes are exactly one segment after /blog (locale already stripped by caller path shape).
  if (parts.length !== blogIndex + 2) return null;
  return next;
}

function hasNonemptyH1(html: string): boolean {
  const withoutHomeSnapshot = stripPnHomePrerenderBlock(html);
  for (const match of withoutHomeSnapshot.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) return true;
  }
  return false;
}

function resolvePrerenderArticleHref(href: string): string {
  if (href.startsWith("blog:")) {
    return `/blog/${href.slice(5)}`;
  }
  if (href.startsWith("app:")) {
    const path = href.slice(4).replace(/^\/+/, "");
    if (!path || path === "home") return "/";
    return `/${path}`;
  }
  return href;
}

function inlineArticleTextToHtml(text: string): string {
  const escaped = escapeHtmlText(text);
  const withBold = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return withBold.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const to = resolvePrerenderArticleHref(href);
    const external = to.startsWith("http://") || to.startsWith("https://");
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${escapeHtmlAttr(to)}"${rel}>${label}</a>`;
  });
}

function buildPrivacyToolsPrerenderSections(article: PrivacyToolsGuideArticleCopy): string {
  return article.sections
    .map((section) => {
      const parts: string[] = [`<section><h2>${escapeHtmlText(section.title)}</h2>`];
      for (const paragraph of section.paragraphs ?? []) {
        parts.push(`<p>${inlineArticleTextToHtml(paragraph)}</p>`);
      }
      if (section.bullets?.length) {
        parts.push(
          `<ul>${section.bullets.map((bullet) => `<li>${inlineArticleTextToHtml(bullet)}</li>`).join("")}</ul>`,
        );
      }
      if (section.comparisonTable) {
        const headers = section.comparisonTable.headers
          .map((header) => `<th>${escapeHtmlText(header)}</th>`)
          .join("");
        const rows = section.comparisonTable.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtmlText(cell)}</td>`).join("")}</tr>`,
          )
          .join("");
        parts.push(`<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`);
        for (const paragraph of section.comparisonTable.after ?? []) {
          parts.push(`<p>${inlineArticleTextToHtml(paragraph)}</p>`);
        }
      }
      if (section.useCaseTable) {
        const headers = section.useCaseTable.headers
          .map((header) => `<th>${escapeHtmlText(header)}</th>`)
          .join("");
        const rows = section.useCaseTable.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtmlText(cell)}</td>`).join("")}</tr>`,
          )
          .join("");
        parts.push(`<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`);
      }
      for (const subsection of section.subsections ?? []) {
        parts.push(`<h3>${escapeHtmlText(subsection.title)}</h3>`);
        for (const paragraph of subsection.paragraphs) {
          parts.push(`<p>${inlineArticleTextToHtml(paragraph)}</p>`);
        }
        if (subsection.bullets?.length) {
          parts.push(
            `<ul>${subsection.bullets.map((bullet) => `<li>${inlineArticleTextToHtml(bullet)}</li>`).join("")}</ul>`,
          );
        }
      }
      if (section.callout) {
        const title = section.calloutTitle
          ? `<p><strong>${escapeHtmlText(section.calloutTitle)}</strong></p>`
          : "";
        parts.push(`<blockquote>${title}<p>${inlineArticleTextToHtml(section.callout)}</p></blockquote>`);
      }
      if (section.faqs?.length) {
        for (const faq of section.faqs) {
          parts.push(`<h3>${escapeHtmlText(faq.question)}</h3>`);
          parts.push(`<p>${inlineArticleTextToHtml(faq.answer)}</p>`);
        }
      }
      parts.push("</section>");
      return parts.join("");
    })
    .join("");
}

function buildPrivacyToolsPrerenderArticle(t: Translations): string {
  const title = t.blogPrivacyTitle.trim();
  const article = privacyToolsGuideEn;
  const intro = article.intro.map((paragraph) => `<p>${inlineArticleTextToHtml(paragraph)}</p>`).join("");
  const sections = buildPrivacyToolsPrerenderSections(article);
  const cta =
    `<section><h2>${escapeHtmlText(article.ctaTitle)}</h2>` +
    `<p>${escapeHtmlText(article.ctaBody)}</p>` +
    `<p><a href="/">${escapeHtmlText(article.ctaButton)}</a>` +
    (article.ctaSecondaryLabel
      ? ` · <a href="${escapeHtmlAttr(resolvePrerenderArticleHref(article.ctaSecondaryHref ?? "app:privacy-tools"))}">${escapeHtmlText(article.ctaSecondaryLabel)}</a>`
      : "") +
    `</p></section>`;

  return (
    `<article data-privatenote-prerender-article="privacy-tools">` +
    `<h1 data-privatenote-prerender-h1="true">${escapeHtmlText(title)}</h1>` +
    intro +
    sections +
    cta +
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

function injectOneTimeLinkFaqSchema(html: string, route: string, language: SupportedLanguage): string {
  if (!isOneTimeLinkRoute(route)) return html;

  const copy = getOneTimeLinkCopy(language);
  const schema = buildOneTimeLinkFaqSchema(copy.faqs);
  const script = `<script type="application/ld+json" data-structured-data-id="one-time-link-faq">${serializeJsonLd(schema)}</script>`;

  const withoutExisting = html.replace(
    /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']one-time-link-faq["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  return withoutExisting.replace("</head>", `${script}\n</head>`);
}

function comparisonRowCell(
  value: "yes" | "no" | "paid",
  copy: ReturnType<typeof getPrivnoteAlternativeCopy>,
  note?: string,
): string {
  if (value === "paid") return note ?? copy.comparePaid;
  if (value === "yes") return copy.compareYes;
  return copy.compareNo;
}

function buildPrivnoteAlternativePrerenderArticle(language: SupportedLanguage): string {
  const copy = getPrivnoteAlternativeCopy(language);
  const rows = copy.compareRows
    .map((row) => {
      const privnote = comparisonRowCell(row.privnote, copy);
      const privatenote = comparisonRowCell(row.privatenote, copy, row.privatenoteNote);
      return `<tr><th>${escapeHtmlText(row.feature)}</th><td>${escapeHtmlText(privnote)}</td><td>${escapeHtmlText(privatenote)}</td></tr>`;
    })
    .join("");
  const faqs = copy.faqs
    .map((faq) => `<h3>${escapeHtmlText(faq.question)}</h3><p>${escapeHtmlText(faq.answer)}</p>`)
    .join("");

  return (
    `<article data-privatenote-prerender-article="privnote-alternative">` +
    `<h1 data-privatenote-prerender-h1="true">${escapeHtmlText(`${copy.heroTitleLine1} ${copy.heroTitleLine2}`)}</h1>` +
    `<p>${escapeHtmlText(copy.heroBody)}</p>` +
    `<h2>${escapeHtmlText(copy.introHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.introBody)}</p>` +
    `<p>${escapeHtmlText(copy.introBody2)}</p>` +
    `<h2>${escapeHtmlText(copy.compareHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.compareIntro)}</p>` +
    `<table><thead><tr><th>${escapeHtmlText(copy.compareFeatureColumn)}</th><th>${escapeHtmlText(copy.comparePrivnoteColumn)}</th><th>${escapeHtmlText(copy.comparePrivateNoteColumn)}</th></tr></thead><tbody>${rows}</tbody></table>` +
    `<p>${escapeHtmlText(copy.compareFootnote)}</p>` +
    `<h2>${escapeHtmlText(copy.whyHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.whyBody)}</p>` +
    `<p>${escapeHtmlText(copy.whyBody2)}</p>` +
    `<p>${escapeHtmlText(copy.whyClose)}</p>` +
    `<h2>${escapeHtmlText(copy.passwordHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.passwordBody)}</p>` +
    `<p>${escapeHtmlText(copy.passwordBody2)}</p>` +
    `<h2>${escapeHtmlText(copy.filesHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.filesBody)}</p>` +
    `<p>${escapeHtmlText(copy.filesBody2)}</p>` +
    `<h2>${escapeHtmlText(copy.mediaHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.mediaBody)}</p>` +
    `<p>${escapeHtmlText(copy.mediaBody2)}</p>` +
    `<h2>${escapeHtmlText(copy.businessHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.businessBody)}</p>` +
    `<ul>${copy.businessScenarios.map((item) => `<li>${escapeHtmlText(item)}</li>`).join("")}</ul>` +
    `<p>${escapeHtmlText(copy.businessBody2)}</p>` +
    `<h2>${escapeHtmlText(copy.securityHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.securityBody)}</p>` +
    `<p>${escapeHtmlText(copy.securityArchitecture)}</p>` +
    `<p>${escapeHtmlText(copy.securityRecipient)}</p>` +
    `<p>${escapeHtmlText(copy.securityLimitation)}</p>` +
    `<h3>${escapeHtmlText(copy.founderHeading)}</h3>` +
    `<p>${escapeHtmlText(copy.founderBody)}</p>` +
    `<h2>${escapeHtmlText(copy.decideHeading)}</h2>` +
    `<h3>${escapeHtmlText(copy.decidePrivnoteTitle)}</h3>` +
    `<ul>${copy.decidePrivnoteItems.map((item) => `<li>${escapeHtmlText(item)}</li>`).join("")}</ul>` +
    `<h3>${escapeHtmlText(copy.decidePrivateNoteTitle)}</h3>` +
    `<ul>${copy.decidePrivateNoteItems.map((item) => `<li>${escapeHtmlText(item)}</li>`).join("")}</ul>` +
    `<h2>${escapeHtmlText(copy.faqHeading)}</h2>` +
    faqs +
    `<h2>${escapeHtmlText(copy.finalHeading)}</h2>` +
    `<p>${escapeHtmlText(copy.finalBody)}</p>` +
    `</article>`
  );
}

function injectPrivnoteAlternativeCrawlerFallback(html: string, route: string, language: SupportedLanguage): string {
  if (!isPrivnoteAlternativeRoute(route)) return html;
  if (hasNonemptyH1(html)) return html;
  const emptyRoot = /<div\s+id=["']root["']\s*>\s*<\/div>/i;
  if (!emptyRoot.test(html)) return html;
  const article = buildPrivnoteAlternativePrerenderArticle(language);
  return html.replace(emptyRoot, `<div id="root"><main>${article}</main></div>`);
}

function injectPrivnoteAlternativeSchema(html: string, route: string, language: SupportedLanguage): string {
  if (!isPrivnoteAlternativeRoute(route)) return html;

  const copy = getPrivnoteAlternativeCopy(language);
  const pagePath = route.replace(/\/+$/, "") || "/privnote-alternative";
  const homePath = language === "en" ? "/" : `/${language}/`;
  const faqScript = `<script type="application/ld+json" data-structured-data-id="privnote-alternative-faq">${serializeJsonLd(buildPrivnoteAlternativeFaqSchema(copy.faqs))}</script>`;
  const pageScript = `<script type="application/ld+json" data-structured-data-id="privnote-alternative-page">${serializeJsonLd(buildPrivnoteAlternativePageSchema(copy, pagePath, homePath))}</script>`;

  const withoutExisting = html
    .replace(
      /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']privnote-alternative-faq["'][^>]*>[\s\S]*?<\/script>/gi,
      "",
    )
    .replace(
      /\s*<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*\bdata-structured-data-id=["']privnote-alternative-page["'][^>]*>[\s\S]*?<\/script>/gi,
      "",
    );
  return withoutExisting.replace("</head>", `${faqScript}\n${pageScript}\n</head>`);
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
  out = injectOneTimeLinkFaqSchema(out, route, lang);
  out = injectPrivnoteAlternativeSchema(out, route, lang);
  out = injectPrivnoteAlternativeCrawlerFallback(out, route, lang);
  out = stripPrerenderCloudflareAnalyticsBeacons(out);

  return out;
}

/** Shell title from client/index.html — used to detect missing client meta updates during prerender. */
export function isDefaultShellDocumentTitle(title: string): boolean {
  return title.trim() === DEFAULT_SHELL_TITLE;
}
