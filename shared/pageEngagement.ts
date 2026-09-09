import { isLocaleHomeSegment } from "./supportedLanguages";

/** Current click/attention grid. Sparse on disk; not a session replay. */
export const HEATMAP_COLS = 40;
export const HEATMAP_ROWS = 80;
/** Grid used before heatmapVersion 2 — upsample on read. */
export const LEGACY_HEATMAP_COLS = 24;
export const LEGACY_HEATMAP_ROWS = 18;
export const HEATMAP_VERSION = 2;
/** Max-scroll histogram buckets (0–10%, …, 90–100%). */
export const SCROLL_BUCKETS = 10;
export const MAX_ENGAGEMENT_CELLS_PER_FLUSH = 200;
export const MAX_VISIBLE_MS_PER_FLUSH = 20 * 60 * 1000;
export const MAX_ANALYTICS_PATH_LENGTH = 160;
export const MAX_STORED_PAGES_PER_DAY = 250;

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

/** Click/attention grids are skipped on note pages (sensitive on-screen content). */
export function pageAllowsHeatmap(page: string): boolean {
  return page !== "note" && page !== "/note" && !page.startsWith("/note/");
}

export function isLegacyEngagementKey(page: string): page is PageEngagementKey {
  return PAGE_KEY_SET.has(page);
}

export type SparseHeatmap = Record<string, number>;

export interface DailyPageEngagement {
  heatmapVersion?: number;
  visits: Record<string, number>;
  visibleSeconds: Record<string, number>;
  /** Count of flushes whose max scroll depth landed in each 10% bucket. */
  scrollMax: Record<string, number[]>;
  clicks: Record<string, SparseHeatmap>;
  dwell: Record<string, SparseHeatmap>;
}

export interface AggregatedPageEngagement {
  startDateUtc: string;
  endDateUtc: string;
  engagement: DailyPageEngagement;
}

export type HeatmapCellTriple = [row: number, col: number, count: number];

export interface PageEngagementFlush {
  page: AnalyticsPageId;
  visits: number;
  visibleMs: number;
  /** When true, `scrollMaxPct` is the max depth for this page view (recorded once on leave). */
  scrollRecorded: boolean;
  scrollMaxPct: number;
  clicks: HeatmapCellTriple[];
  dwell: HeatmapCellTriple[];
}

export function createEmptyDailyPageEngagement(): DailyPageEngagement {
  return {
    heatmapVersion: HEATMAP_VERSION,
    visits: {},
    visibleSeconds: {},
    scrollMax: {},
    clicks: {},
    dwell: {},
  };
}

function emptyScrollBuckets(): number[] {
  return Array.from({ length: SCROLL_BUCKETS }, () => 0);
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

/** Path to load in the admin preview iframe, or null when a live page cannot be shown. */
export function analyticsPreviewPath(page: string): string | null {
  if (page === "note" || page === "/note" || page.startsWith("/note/")) return null;
  if (page === "auth" || page === "/auth" || page.startsWith("/auth")) return null;
  if (page === "account" || page === "/account" || page.startsWith("/account")) return null;
  if (page === "other" || page === "/other") return null;
  if (page.startsWith("/")) return page;
  if (isLegacyEngagementKey(page)) {
    const mapped = LEGACY_KEY_TO_PATH[page];
    return mapped.startsWith("/") ? mapped : null;
  }
  return null;
}

export function migrateLegacyPageKey(page: string): string {
  if (isLegacyEngagementKey(page)) return LEGACY_KEY_TO_PATH[page];
  return page;
}

export function isStoredPageKey(value: string): boolean {
  if (PAGE_KEY_SET.has(value)) return true;
  return isSafeExactPath(value);
}

export function heatmapCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

function parseCellKeyUnbounded(key: string): { row: number; col: number } | null {
  const [r, c] = key.split(",");
  const row = Number(r);
  const col = Number(c);
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  if (row < 0 || col < 0) return null;
  return { row, col };
}

export function parseHeatmapCellKey(key: string): { row: number; col: number } | null {
  const parsed = parseCellKeyUnbounded(key);
  if (!parsed) return null;
  if (parsed.row >= HEATMAP_ROWS || parsed.col >= HEATMAP_COLS) return null;
  return parsed;
}

export function upsampleLegacyHeatmap(map: SparseHeatmap): SparseHeatmap {
  const out: SparseHeatmap = {};
  const scaleR = HEATMAP_ROWS / LEGACY_HEATMAP_ROWS;
  const scaleC = HEATMAP_COLS / LEGACY_HEATMAP_COLS;
  for (const [key, value] of Object.entries(map)) {
    const parsed = parseCellKeyUnbounded(key);
    if (!parsed) continue;
    const n = Math.round(Number(value));
    if (!Number.isFinite(n) || n <= 0) continue;
    const row = Math.min(HEATMAP_ROWS - 1, Math.max(0, Math.floor((parsed.row + 0.5) * scaleR)));
    const col = Math.min(HEATMAP_COLS - 1, Math.max(0, Math.floor((parsed.col + 0.5) * scaleC)));
    const nextKey = heatmapCellKey(row, col);
    out[nextKey] = (out[nextKey] || 0) + n;
  }
  return out;
}

function heatmapLooksLegacy(map: SparseHeatmap): boolean {
  const keys = Object.keys(map);
  if (keys.length === 0) return false;
  for (const key of keys) {
    const parsed = parseCellKeyUnbounded(key);
    if (!parsed) continue;
    if (parsed.row >= LEGACY_HEATMAP_ROWS || parsed.col >= LEGACY_HEATMAP_COLS) return false;
  }
  return true;
}

function normalizeSparseMap(map: SparseHeatmap | undefined, heatmapVersion: number | undefined): SparseHeatmap {
  const source = map || {};
  if (heatmapVersion === HEATMAP_VERSION) {
    const out: SparseHeatmap = {};
    addSparse(out, source);
    return out;
  }
  if (heatmapLooksLegacy(source)) return upsampleLegacyHeatmap(source);
  const out: SparseHeatmap = {};
  addSparse(out, source);
  return out;
}

function addSparse(target: SparseHeatmap, source: SparseHeatmap): void {
  for (const [key, value] of Object.entries(source)) {
    if (!parseHeatmapCellKey(key)) continue;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) continue;
    target[key] = (target[key] || 0) + Math.round(n);
  }
}

function addScrollBuckets(target: number[], source: number[] | undefined): number[] {
  const next = target.length === SCROLL_BUCKETS ? target.slice() : emptyScrollBuckets();
  if (!source) return next;
  for (let i = 0; i < SCROLL_BUCKETS; i++) {
    next[i] = (next[i] || 0) + (Number(source[i]) || 0);
  }
  return next;
}

function remapRecord<T>(
  source: Record<string, T> | undefined,
  mergeValue: (into: T | undefined, add: T) => T,
): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [key, value] of Object.entries(source || {})) {
    const page = migrateLegacyPageKey(key);
    if (!isStoredPageKey(page) && !isLegacyEngagementKey(page)) continue;
    out[page] = mergeValue(out[page], value);
  }
  return out;
}

export function normalizeDailyPageEngagement(raw: DailyPageEngagement | undefined | null): DailyPageEngagement {
  const source = raw || createEmptyDailyPageEngagement();
  const version = source.heatmapVersion;
  const visits = remapRecord(source.visits, (into, add) => {
    const n = Math.floor(Number(add) || 0);
    return (into || 0) + (n > 0 ? n : 0);
  });
  const visibleSeconds = remapRecord(source.visibleSeconds, (into, add) => {
    const n = Math.floor(Number(add) || 0);
    return (into || 0) + (n > 0 ? n : 0);
  });
  const scrollMax = remapRecord(source.scrollMax, (into, add) => addScrollBuckets(into || emptyScrollBuckets(), add));
  const clicks = remapRecord(source.clicks, (into, add) => {
    const next = into ? { ...into } : {};
    addSparse(next, normalizeSparseMap(add, version));
    return next;
  });
  const dwell = remapRecord(source.dwell, (into, add) => {
    const next = into ? { ...into } : {};
    addSparse(next, normalizeSparseMap(add, version));
    return next;
  });
  return {
    heatmapVersion: HEATMAP_VERSION,
    visits,
    visibleSeconds,
    scrollMax,
    clicks,
    dwell,
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

  const pages = new Set([
    ...Object.keys(base.scrollMax),
    ...Object.keys(add.scrollMax),
    ...Object.keys(base.clicks),
    ...Object.keys(add.clicks),
    ...Object.keys(base.dwell),
    ...Object.keys(add.dwell),
  ]);
  for (const page of pages) {
    merged.scrollMax[page] = addScrollBuckets(base.scrollMax[page] || emptyScrollBuckets(), add.scrollMax[page]);
    merged.clicks[page] = {};
    addSparse(merged.clicks[page], base.clicks[page] || {});
    addSparse(merged.clicks[page], add.clicks[page] || {});
    merged.dwell[page] = {};
    addSparse(merged.dwell[page], base.dwell[page] || {});
    addSparse(merged.dwell[page], add.dwell[page] || {});
  }
  return merged;
}

function parseCellTriples(raw: unknown, legacyGrid: boolean): HeatmapCellTriple[] {
  if (!Array.isArray(raw)) return [];
  const rows = legacyGrid ? LEGACY_HEATMAP_ROWS : HEATMAP_ROWS;
  const cols = legacyGrid ? LEGACY_HEATMAP_COLS : HEATMAP_COLS;
  const out: HeatmapCellTriple[] = [];
  for (const item of raw.slice(0, MAX_ENGAGEMENT_CELLS_PER_FLUSH)) {
    if (!Array.isArray(item) || item.length < 3) continue;
    const row = Number(item[0]);
    const col = Number(item[1]);
    const count = Math.floor(Number(item[2]));
    if (!Number.isInteger(row) || !Number.isInteger(col) || !Number.isFinite(count)) continue;
    if (row < 0 || row >= rows || col < 0 || col >= cols) continue;
    if (count <= 0 || count > 500) continue;
    out.push([row, col, count]);
  }
  return out;
}

function triplesFromSparse(map: SparseHeatmap): HeatmapCellTriple[] {
  const out: HeatmapCellTriple[] = [];
  for (const [key, value] of Object.entries(map)) {
    const parsed = parseHeatmapCellKey(key);
    if (!parsed) continue;
    const count = Math.floor(Number(value) || 0);
    if (count <= 0) continue;
    out.push([parsed.row, parsed.col, count]);
  }
  return out;
}

/**
 * Validate a client engagement beacon. The client may send `path`; we always
 * re-canonicalize so note IDs and unknown routes cannot be stored as IDs.
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
  const scrollRecorded = rec.scrollRecorded === true;
  const scrollMaxPct = scrollRecorded
    ? Math.min(100, Math.max(0, Math.floor(Number(rec.scrollMaxPct) || 0)))
    : 0;
  const allowHeatmap = pageAllowsHeatmap(page);
  const legacyGrid = rec.hv !== HEATMAP_VERSION;
  const rawClicks = allowHeatmap ? parseCellTriples(rec.clicks, legacyGrid) : [];
  const rawDwell = allowHeatmap ? parseCellTriples(rec.dwell, legacyGrid) : [];
  const clicks = legacyGrid
    ? triplesFromSparse(upsampleLegacyHeatmap(Object.fromEntries(rawClicks.map(([r, c, n]) => [heatmapCellKey(r, c), n]))))
    : rawClicks;
  const dwell = legacyGrid
    ? triplesFromSparse(upsampleLegacyHeatmap(Object.fromEntries(rawDwell.map(([r, c, n]) => [heatmapCellKey(r, c), n]))))
    : rawDwell;

  if (
    visits === 0 &&
    visibleMs === 0 &&
    clicks.length === 0 &&
    dwell.length === 0 &&
    !scrollRecorded
  ) {
    return null;
  }

  return { page, visits, visibleMs, scrollRecorded, scrollMaxPct, clicks, dwell };
}

function storedPageCount(current: DailyPageEngagement): number {
  return new Set([
    ...Object.keys(current.visits),
    ...Object.keys(current.visibleSeconds),
    ...Object.keys(current.scrollMax),
    ...Object.keys(current.clicks),
    ...Object.keys(current.dwell),
  ]).size;
}

export function applyEngagementFlush(
  current: DailyPageEngagement,
  flush: PageEngagementFlush,
): DailyPageEngagement {
  const next = mergeDailyPageEngagement(current, createEmptyDailyPageEngagement());
  let page = migrateLegacyPageKey(flush.page);
  const alreadyKnown =
    page in next.visits ||
    page in next.visibleSeconds ||
    page in next.scrollMax ||
    page in next.clicks ||
    page in next.dwell;
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
  if (flush.scrollRecorded) {
    if (!next.scrollMax[page]) next.scrollMax[page] = emptyScrollBuckets();
    const width = 100 / SCROLL_BUCKETS;
    const bucket = Math.min(SCROLL_BUCKETS - 1, Math.floor(flush.scrollMaxPct / width));
    next.scrollMax[page]![bucket] = (next.scrollMax[page]![bucket] || 0) + 1;
  }

  const addCells = (into: SparseHeatmap, cells: HeatmapCellTriple[]) => {
    for (const [row, col, count] of cells) {
      const key = heatmapCellKey(row, col);
      into[key] = (into[key] || 0) + count;
    }
  };
  if (flush.clicks.length > 0) {
    if (!next.clicks[page]) next.clicks[page] = {};
    addCells(next.clicks[page]!, flush.clicks);
  }
  if (flush.dwell.length > 0) {
    if (!next.dwell[page]) next.dwell[page] = {};
    addCells(next.dwell[page]!, flush.dwell);
  }
  return next;
}

/** Cumulative reach: visitors who scrolled at least to bucket i. */
export function scrollReachFromMaxHistogram(scrollMax: number[] | undefined): number[] {
  const buckets = addScrollBuckets(emptyScrollBuckets(), scrollMax);
  const reach = emptyScrollBuckets();
  let running = 0;
  for (let i = SCROLL_BUCKETS - 1; i >= 0; i--) {
    running += buckets[i] || 0;
    reach[i] = running;
  }
  return reach;
}

export function documentPointToCell(
  pageX: number,
  pageY: number,
  pageWidth: number,
  pageHeight: number,
): { row: number; col: number } | null {
  if (pageWidth <= 0 || pageHeight <= 0) return null;
  const col = Math.min(HEATMAP_COLS - 1, Math.max(0, Math.floor((pageX / pageWidth) * HEATMAP_COLS)));
  const row = Math.min(HEATMAP_ROWS - 1, Math.max(0, Math.floor((pageY / pageHeight) * HEATMAP_ROWS)));
  if (!Number.isFinite(col) || !Number.isFinite(row)) return null;
  return { row, col };
}
