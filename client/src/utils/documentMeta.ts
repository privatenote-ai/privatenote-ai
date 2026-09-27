import { canonicalPublicPath } from "@shared/homeSeoLinks";
import { isSupportedLanguage } from "@shared/supportedLanguages";

/** Visible brand suffix for HTML <title> tags. */
export const DOCUMENT_META_BRAND = "PrivateNote.ai";

/** Default share image (root-relative). Use an absolute URL in meta tags. */
export const DEFAULT_OG_IMAGE_PATH = "/og-image.png";

const OG_LOCALE_BY_LANG: Record<string, string> = {
  en: "en_US",
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

export type DocumentMetaOptions = {
  /**
   * Share image URL (absolute or root-relative). Omit to use {@link DEFAULT_OG_IMAGE_PATH}.
   */
  image?: string | null;
  /** Override canonical URL path (defaults to `location.pathname`, no hash/query). */
  canonicalPath?: string;
  /** Locale home pages set canonical via {@link setHomeSeoLinks} in App.tsx. */
  skipCanonical?: boolean;
  ogType?: "website" | "article";
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  /** Plain-text article author for og / article meta */
  articleAuthor?: string;
};

export function buildDocumentTitle(pageTitle: string): string {
  const trimmed = pageTitle.trim();
  if (!trimmed) return DOCUMENT_META_BRAND;
  return `${trimmed} · ${DOCUMENT_META_BRAND}`;
}

const BRAND_TITLE_SUFFIX = ` · ${DOCUMENT_META_BRAND}`;

/** Typical search-snippet budget for `meta name="description"`. */
export const META_DESCRIPTION_MAX = 160;

/**
 * Keep locale URLs from sharing an English (or twin-locale) `<title>`.
 * English stays untagged; `/de/...` becomes `Page (DE) · PrivateNote.ai`.
 */
export function titleWithLocaleTag(title: string, language: string): string {
  const code = language.trim().toLowerCase();
  if (!code || code === "en") return title;
  const tag = ` (${code.toUpperCase()})`;
  if (title.includes(tag) || !title.endsWith(BRAND_TITLE_SUFFIX)) return title;
  return `${title.slice(0, -BRAND_TITLE_SUFFIX.length)}${tag}${BRAND_TITLE_SUFFIX}`;
}

function localeMetaTag(language: string): string | null {
  const code = language.trim().toLowerCase();
  if (!code || code === "en") return null;
  return ` (${code.toUpperCase()})`;
}

function fitMetaDescription(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max).trimEnd();
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace >= Math.floor(max * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return cut.replace(/[.,;:–—-]+$/u, "").trimEnd();
}

/**
 * Keep locale URLs from sharing an English (or twin-locale) meta description.
 * English stays untagged; `/de/...` appends ` (DE)` and stays within 160 characters.
 */
export function descriptionWithLocaleTag(description: string, language: string): string {
  const trimmed = description.trim();
  const tag = localeMetaTag(language);
  if (!tag) return trimmed;
  if (trimmed.endsWith(tag)) {
    return trimmed.length <= META_DESCRIPTION_MAX ? trimmed : fitMetaDescription(trimmed, META_DESCRIPTION_MAX);
  }
  return `${fitMetaDescription(trimmed, META_DESCRIPTION_MAX - tag.length)}${tag}`;
}

function absoluteUrlFromHref(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${origin}${path}`;
}

function canonicalPageUrl(canonicalPath?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const path = canonicalPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${canonicalPublicPath(normalizedPath)}`;
}

function upsertMetaProperty(property: string, content: string): void {
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaName(name: string, content: string): void {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeMetaProperty(property: string): void {
  document.head.querySelector(`meta[property="${property}"]`)?.remove();
}

function clearArticleOnlyTags(): void {
  removeMetaProperty("article:published_time");
  removeMetaProperty("article:modified_time");
  removeMetaProperty("article:author");
}

export function removeStructuredDataScript(id: string): void {
  document.head.querySelector<HTMLScriptElement>(`script[type="application/ld+json"][data-structured-data-id="${id}"]`)?.remove();
}

export function setStructuredDataScript(id: string, data: Record<string, unknown> | null): void {
  if (!data) {
    removeStructuredDataScript(id);
    return;
  }

  let el = document.head.querySelector<HTMLScriptElement>(
    `script[type="application/ld+json"][data-structured-data-id="${id}"]`,
  );
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.structuredDataId = id;
    const nonce = document.head.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content;
    if (nonce) {
      el.nonce = nonce;
    }
    document.head.appendChild(el);
  }
  el.text = JSON.stringify(data);
}

function ogLocaleFromDocument(): string {
  const raw = typeof document !== "undefined" ? document.documentElement.lang?.trim().split("-")[0] ?? "en" : "en";
  return OG_LOCALE_BY_LANG[raw] ?? OG_LOCALE_BY_LANG.en;
}

/** Paths that must not be indexed (also covered by `client/public/_headers` X-Robots-Tag). */
const NOINDEX_PATH_PATTERNS = [
  /^\/auth(?:\/|$)/,
  /^\/magic$/,
  /^\/account(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/note\//,
  /^\/test-llm$/,
  /^\/llm-ui$/,
];

export function isNoindexPath(pathname: string): boolean {
  const path = (pathname.split(/[?#]/)[0] || "/").replace(/\/+$/, "") || "/";
  return NOINDEX_PATH_PATTERNS.some((re) => re.test(path));
}

function currentPathname(): string {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

function languageFromPathname(pathname: string): string {
  const first = (pathname.split(/[?#]/)[0] || "/").split("/").filter(Boolean)[0];
  return first && isSupportedLanguage(first) && first !== "en" ? first : "en";
}

/**
 * Updates `<title>`, description, Open Graph, and Twitter Card tags.
 */
export function setDocumentMeta(title: string, description: string, options?: DocumentMetaOptions): void {
  const language = languageFromPathname(options?.canonicalPath ?? currentPathname());
  const taggedTitle = titleWithLocaleTag(title, language);
  const taggedDescription = descriptionWithLocaleTag(description, language);
  document.title = taggedTitle;

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", taggedDescription);

  const pageUrl = canonicalPageUrl(options?.canonicalPath);
  const imageHref = options?.image?.trim() || DEFAULT_OG_IMAGE_PATH;
  const imageUrl = absoluteUrlFromHref(imageHref);
  const ogType = options?.ogType ?? "website";

  if (!options?.skipCanonical) {
    upsertCanonical(pageUrl);
  }
  upsertMetaName(
    "robots",
    isNoindexPath(options?.canonicalPath ?? currentPathname()) ? "noindex, nofollow" : "index, follow",
  );
  upsertMetaProperty("og:title", taggedTitle);
  upsertMetaProperty("og:description", taggedDescription);
  upsertMetaProperty("og:url", pageUrl);
  upsertMetaProperty("og:type", ogType);
  upsertMetaProperty("og:site_name", DOCUMENT_META_BRAND);
  upsertMetaProperty("og:image", imageUrl);
  upsertMetaProperty("og:image:width", "1200");
  upsertMetaProperty("og:image:height", "630");
  upsertMetaProperty("og:locale", ogLocaleFromDocument());

  upsertMetaName("twitter:card", "summary_large_image");
  upsertMetaName("twitter:title", taggedTitle);
  upsertMetaName("twitter:description", taggedDescription);
  upsertMetaName("twitter:image", imageUrl);

  if (ogType === "article") {
    if (options?.articlePublishedTime) {
      upsertMetaProperty("article:published_time", options.articlePublishedTime);
    } else {
      removeMetaProperty("article:published_time");
    }
    if (options?.articleModifiedTime) {
      upsertMetaProperty("article:modified_time", options.articleModifiedTime);
    } else {
      removeMetaProperty("article:modified_time");
    }
    if (options?.articleAuthor) {
      upsertMetaProperty("article:author", options.articleAuthor);
    } else {
      removeMetaProperty("article:author");
    }
  } else {
    clearArticleOnlyTags();
    removeStructuredDataScript("blog-article");
  }
}
