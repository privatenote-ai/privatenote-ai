import { isLocaleHomeSegment } from "./supportedLanguages";

export const MAX_VISIBLE_MS_PER_FLUSH = 20 * 60 * 1000;
export const MAX_ANALYTICS_PATH_LENGTH = 160;
export const MAX_STORED_PAGES_PER_DAY = 250;
/** Write shards per UTC day so ingest is not a single hot KV key (~1 write/sec). */
export const ENGAGEMENT_WRITE_SHARDS = 16;
/** Admin reads merge shards+legacy; keep this under the Worker subrequest budget. */
export const MAX_ENGAGEMENT_RANGE_DAYS = 31;
export const ANALYTICS_ENGAGEMENT_PREFIX = "analytics:engagement:";
/** Skip a shard write if it would exceed this (KV is 25 MiB; CPU/merge cost bites first). */
export const MAX_ENGAGEMENT_SHARD_JSON_BYTES = 120_000;

export function engagementLegacyKvKey(dateKey: string): string {
  return `${ANALYTICS_ENGAGEMENT_PREFIX}${dateKey}`;
}

export function engagementShardKvKey(dateKey: string, shard: number): string {
  const index = ((shard % ENGAGEMENT_WRITE_SHARDS) + ENGAGEMENT_WRITE_SHARDS) % ENGAGEMENT_WRITE_SHARDS;
  return `${ANALYTICS_ENGAGEMENT_PREFIX}${dateKey}:s${index}`;
}

export function engagementReadKvKeys(dateKey: string): string[] {
  const keys = [engagementLegacyKvKey(dateKey)];
  for (let i = 0; i < ENGAGEMENT_WRITE_SHARDS; i++) {
    keys.push(engagementShardKvKey(dateKey, i));
  }
  return keys;
}

export function pickEngagementWriteShard(randomByte: number): number {
  return randomByte % ENGAGEMENT_WRITE_SHARDS;
}

/** Pre-exact-path buckets still present in older KV records. */
export const PAGE_ENGAGEMENT_KEYS = [
  "home",
  "password-generator",
  "secure-file-transfer",
  "privacy-tools",
  "security-resources",
  "security-guide",
  "how-it-works",
  "premium",
  "developers",
  "about",
  "contact",
  "blog",
  "blog-category",
  "blog-post",
  "privacy",
  "terms",
  "note",
  "auth",
  "account",
  "other",
] as const;

export type PageEngagementKey = (typeof PAGE_ENGAGEMENT_KEYS)[number];
export type AnalyticsPageId = string;

const PAGE_KEY_SET = new Set<string>(PAGE_ENGAGEMENT_KEYS);

export const PAGE_ENGAGEMENT_LABELS: Record<PageEngagementKey, string> = {
  home: "Home",
  "password-generator": "Password share",
  "secure-file-transfer": "File share",
  "privacy-tools": "Privacy tools",
  "security-resources": "Security resources",
  "security-guide": "Security guides (grouped)",
  "how-it-works": "How it works",
  premium: "Premium",
  developers: "Developers",
  about: "About",
  contact: "Contact",
  blog: "Blog index",
  "blog-category": "Blog category (grouped)",
  "blog-post": "Blog posts (grouped)",
  privacy: "Privacy",
  terms: "Terms",
  note: "View note",
  auth: "Sign-in / sign-up",
  account: "Account",
  other: "Other",
};

const EXACT_PATH_TITLES: Record<string, string> = {
  "/": "Home",
  "/password-generator": "Password share",
  "/secure-file-transfer": "File share",
  "/privacy-tools": "Privacy tools",
  "/security-resources": "Security resources",
  "/how-it-works": "How it works",
  "/premium": "Premium",
  "/developers": "Developers",
  "/about": "About",
  "/contact": "Contact",
  "/blog": "Blog index",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/note": "View note",
  "/auth": "Sign-in / sign-up",
  "/account": "Account",
  "/other": "Other",
};

const LEGACY_KEY_TO_PATH: Record<PageEngagementKey, string> = {
  home: "/",
  "password-generator": "/password-generator",
  "secure-file-transfer": "/secure-file-transfer",
  "privacy-tools": "/privacy-tools",
  "security-resources": "/security-resources",
  "security-guide": "security-guide",
  "how-it-works": "/how-it-works",
  premium: "/premium",
  developers: "/developers",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
  "blog-category": "blog-category",
  "blog-post": "blog-post",
  privacy: "/privacy",
  terms: "/terms",
  note: "/note",
  auth: "/auth",
  account: "/account",
  other: "/other",
};

export function isLegacyEngagementKey(page: string): page is PageEngagementKey {
  return PAGE_KEY_SET.has(page);
}

export interface DailyPageEngagement {
  visits: Record<string, number>;
  visibleSeconds: Record<string, number>;
}

export interface AggregatedPageEngagement {
  startDateUtc: string;
  endDateUtc: string;
  engagement: DailyPageEngagement;
}

export interface PageEngagementFlush {
  page: AnalyticsPageId;
  visits: number;
  visibleMs: number;
}

export function createEmptyDailyPageEngagement(): DailyPageEngagement {
  return {
    visits: {},
    visibleSeconds: {},
  };
}

function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (!isLocaleHomeSegment(parts[0]!)) {
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
  }
  if (parts.length === 1) return "/";
  return `/${parts.slice(1).join("/")}`;
}

function isSafeExactPath(path: string): boolean {
  if (path === "/") return true;
  if (path.length > MAX_ANALYTICS_PATH_LENGTH) return false;
  return /^\/[a-z0-9][a-z0-9/_-]*$/.test(path);
}

/**
 * Map a browser pathname to the public page that was actually shown.
 * Strips locale prefixes, query, and hash. Collapses note IDs, account, and
 * auth routes. Keeps blog slugs, security guides, and other public URLs exact.
 * Returns null for admin/internal routes that must not be tracked.
 */
export function canonicalizeAnalyticsPath(pathname: string): AnalyticsPageId | null {
  const raw = (pathname.split(/[?#]/)[0] || "/").replace(/\/{2,}/g, "/");
  const trimmed = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  const path = stripLocalePrefix(trimmed || "/");
  const lower = path.toLowerCase();

  if (lower.startsWith("/admin") || lower.startsWith("/test-llm") || lower.startsWith("/llm-ui")) {
    return null;
  }

  if (lower === "/" || lower === "") return "/";
  if (lower.startsWith("/note")) return "/note";
  if (lower.startsWith("/account")) return "/account";
  if (lower.startsWith("/auth") || lower === "/magic") return "/auth";
  if (isSafeExactPath(lower)) return lower;
  return "/other";
}

/** Human label for the admin table. Exact paths stay visible as the path. */
export function analyticsPageLabel(page: string): string {
  if (isLegacyEngagementKey(page)) return PAGE_ENGAGEMENT_LABELS[page];
  return EXACT_PATH_TITLES[page] || page;
}

export function migrateLegacyPageKey(page: string): string {
  if (isLegacyEngagementKey(page)) return LEGACY_KEY_TO_PATH[page];
  return page;
}

export function isStoredPageKey(value: string): boolean {
  if (PAGE_KEY_SET.has(value)) return true;
  return isSafeExactPath(value);
}

function remapCounts(source: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(source || {})) {
    const page = migrateLegacyPageKey(key);
    if (!isStoredPageKey(page) && !isLegacyEngagementKey(page)) continue;
    const n = Math.floor(Number(value) || 0);
    if (n <= 0) continue;
    out[page] = (out[page] || 0) + n;
  }
  return out;
}

export function normalizeDailyPageEngagement(raw: DailyPageEngagement | undefined | null): DailyPageEngagement {
  const source = raw || createEmptyDailyPageEngagement();
  return {
    visits: remapCounts(source.visits),
    visibleSeconds: remapCounts(source.visibleSeconds),
  };
}

export function mergeDailyPageEngagement(
  baseMetrics: DailyPageEngagement,
  addMetrics: DailyPageEngagement,
): DailyPageEngagement {
  const base = normalizeDailyPageEngagement(baseMetrics);
  const add = normalizeDailyPageEngagement(addMetrics);
  const merged = createEmptyDailyPageEngagement();
  const addCounts = (into: Record<string, number>, from: Record<string, number>) => {
    for (const [key, value] of Object.entries(from)) {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) continue;
      into[key] = (into[key] || 0) + Math.floor(n);
    }
  };
  addCounts(merged.visits, base.visits);
  addCounts(merged.visits, add.visits);
  addCounts(merged.visibleSeconds, base.visibleSeconds);
  addCounts(merged.visibleSeconds, add.visibleSeconds);
  return merged;
}

/**
 * Validate a client engagement beacon. The client may send `path`; we always
 * re-canonicalize so note IDs and unknown routes cannot be stored as IDs.
 * Click, dwell, and scroll grids from older clients are ignored.
 */
export function parsePageEngagementFlush(body: unknown): PageEngagementFlush | null {
  if (!body || typeof body !== "object") return null;
  const rec = body as Record<string, unknown>;
  if (rec.kind !== "engagement") return null;

  const path = typeof rec.path === "string" ? rec.path.slice(0, 200) : "";
  const page = canonicalizeAnalyticsPath(path);
  if (!page) return null;

  const visits = rec.visits === 1 ? 1 : 0;
  const visibleMs = Math.min(
    MAX_VISIBLE_MS_PER_FLUSH,
    Math.max(0, Math.floor(Number(rec.visibleMs) || 0)),
  );

  if (visits === 0 && visibleMs === 0) {
    return null;
  }

  return { page, visits, visibleMs };
}

function storedPageCount(current: DailyPageEngagement): number {
  return new Set([...Object.keys(current.visits), ...Object.keys(current.visibleSeconds)]).size;
}

export function applyEngagementFlush(
  current: DailyPageEngagement,
  flush: PageEngagementFlush,
): DailyPageEngagement {
  const next = normalizeDailyPageEngagement(current);
  let page = migrateLegacyPageKey(flush.page);
  const alreadyKnown = page in next.visits || page in next.visibleSeconds;
  if (!alreadyKnown && storedPageCount(next) >= MAX_STORED_PAGES_PER_DAY) {
    page = "/other";
  }
  if (flush.visits > 0) {
    next.visits[page] = (next.visits[page] || 0) + flush.visits;
  }
  if (flush.visibleMs > 0) {
    const seconds = Math.round(flush.visibleMs / 1000);
    if (seconds > 0) {
      next.visibleSeconds[page] = (next.visibleSeconds[page] || 0) + seconds;
    }
  }
  return next;
}
