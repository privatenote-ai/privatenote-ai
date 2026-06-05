/** Visible brand suffix for HTML <title> tags. */
export const DOCUMENT_META_BRAND = "PrivateNote.ai";

/** Default share image (root-relative). Use an absolute URL in meta tags. */
export const DEFAULT_OG_IMAGE_PATH = "/og-image.png";

const OG_LOCALE_BY_LANG: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
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
  const canonicalPathname =
    normalizedPath === "/" || normalizedPath.includes(".")
      ? normalizedPath
      : normalizedPath.replace(/\/+$/, "") || "/";
  return `${origin}${canonicalPathname}`;
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

/**
 * Updates `<title>`, description, Open Graph, and Twitter Card tags.
 */
export function setDocumentMeta(title: string, description: string, options?: DocumentMetaOptions): void {
  document.title = title;

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", description);

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
  upsertMetaProperty("og:title", title);
  upsertMetaProperty("og:description", description);
  upsertMetaProperty("og:url", pageUrl);
  upsertMetaProperty("og:type", ogType);
  upsertMetaProperty("og:site_name", DOCUMENT_META_BRAND);
  upsertMetaProperty("og:image", imageUrl);
  upsertMetaProperty("og:locale", ogLocaleFromDocument());

  upsertMetaName("twitter:card", "summary_large_image");
  upsertMetaName("twitter:title", title);
  upsertMetaName("twitter:description", description);
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
  }
}
