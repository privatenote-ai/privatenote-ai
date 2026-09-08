import { isLocaleHomeSegment } from "./supportedLanguages";

/** Coarse click/attention grid — not pixel-accurate, not a session replay. */
export const HEATMAP_COLS = 24;
export const HEATMAP_ROWS = 18;
/** Max-scroll histogram buckets (0–10%, …, 90–100%). */
export const SCROLL_BUCKETS = 10;
export const MAX_ENGAGEMENT_CELLS_PER_FLUSH = 80;
export const MAX_VISIBLE_MS_PER_FLUSH = 20 * 60 * 1000;

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

const PAGE_KEY_SET = new Set<string>(PAGE_ENGAGEMENT_KEYS);

export const PAGE_ENGAGEMENT_LABELS: Record<PageEngagementKey, string> = {
  home: "Home",
  "password-generator": "Password share",
  "secure-file-transfer": "File share",
  "privacy-tools": "Privacy tools",
  "security-resources": "Security resources",
  "security-guide": "Security guide",
  "how-it-works": "How it works",
  premium: "Premium",
  developers: "Developers",
  about: "About",
  contact: "Contact",
  blog: "Blog index",
  "blog-category": "Blog category",
  "blog-post": "Blog post",
  privacy: "Privacy",
  terms: "Terms",
  note: "View note",
  auth: "Sign-in / sign-up",
  account: "Account",
  other: "Other",
};

/** Click/attention grids are skipped on note pages (sensitive on-screen content). */
export function pageAllowsHeatmap(page: PageEngagementKey): boolean {
  return page !== "note";
}

export type SparseHeatmap = Record<string, number>;

export interface DailyPageEngagement {
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
  page: PageEngagementKey;
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

function isPageKey(value: string): value is PageEngagementKey {
  return PAGE_KEY_SET.has(value);
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

/**
 * Map a browser pathname to a coarse, allow-listed page key.
 * Strips locale prefixes, query, hash, and note/blog IDs.
 * Returns null for admin/internal routes that must not be tracked.
 */
export function canonicalizeAnalyticsPath(pathname: string): PageEngagementKey | null {
  const raw = (pathname.split(/[?#]/)[0] || "/").replace(/\/{2,}/g, "/");
  const trimmed = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  const path = stripLocalePrefix(trimmed || "/");
  const lower = path.toLowerCase();

  if (lower.startsWith("/admin") || lower.startsWith("/test-llm") || lower.startsWith("/llm-ui")) {
    return null;
  }

  if (lower === "/" || lower === "") return "home";
  if (lower === "/password-generator") return "password-generator";
  if (lower === "/secure-file-transfer") return "secure-file-transfer";
  if (lower === "/privacy-tools") return "privacy-tools";
  if (lower === "/security-resources") return "security-resources";
  if (lower.startsWith("/security-guides/")) return "security-guide";
  if (lower === "/how-it-works") return "how-it-works";
  if (lower === "/premium") return "premium";
  if (lower === "/developers" || lower.startsWith("/developers/")) return "developers";
  if (lower === "/about") return "about";
  if (lower === "/contact") return "contact";
  if (lower === "/blog") return "blog";
  if (lower.startsWith("/blog/category/")) return "blog-category";
  if (lower.startsWith("/blog/")) return "blog-post";
  if (lower === "/privacy") return "privacy";
  if (lower === "/terms") return "terms";
  if (lower.startsWith("/note/")) return "note";
  if (lower.startsWith("/auth") || lower === "/magic") return "auth";
  if (lower.startsWith("/account")) return "account";
  return "other";
}

export function heatmapCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function parseHeatmapCellKey(key: string): { row: number; col: number } | null {
  const [r, c] = key.split(",");
  const row = Number(r);
  const col = Number(c);
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  if (row < 0 || row >= HEATMAP_ROWS || col < 0 || col >= HEATMAP_COLS) return null;
  return { row, col };
}

function addSparse(target: SparseHeatmap, source: SparseHeatmap): void {
  for (const [key, value] of Object.entries(source)) {
    if (!parseHeatmapCellKey(key)) continue;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) continue;
    target[key] = (target[key] || 0) + Math.floor(n);
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

export function mergeDailyPageEngagement(
  baseMetrics: DailyPageEngagement,
  addMetrics: DailyPageEngagement,
): DailyPageEngagement {
  const merged = createEmptyDailyPageEngagement();
  const addCounts = (into: Record<string, number>, from: Record<string, number> | undefined) => {
    for (const [key, value] of Object.entries(from || {})) {
      if (!isPageKey(key)) continue;
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) continue;
      into[key] = (into[key] || 0) + Math.floor(n);
    }
  };
  addCounts(merged.visits, baseMetrics.visits);
  addCounts(merged.visits, addMetrics.visits);
  addCounts(merged.visibleSeconds, baseMetrics.visibleSeconds);
  addCounts(merged.visibleSeconds, addMetrics.visibleSeconds);

  const pages = new Set([
    ...Object.keys(baseMetrics.scrollMax || {}),
    ...Object.keys(addMetrics.scrollMax || {}),
    ...Object.keys(baseMetrics.clicks || {}),
    ...Object.keys(addMetrics.clicks || {}),
    ...Object.keys(baseMetrics.dwell || {}),
    ...Object.keys(addMetrics.dwell || {}),
  ]);
  for (const page of pages) {
    if (!isPageKey(page)) continue;
    merged.scrollMax[page] = addScrollBuckets(
      baseMetrics.scrollMax?.[page] || emptyScrollBuckets(),
      addMetrics.scrollMax?.[page],
    );
    merged.clicks[page] = {};
    addSparse(merged.clicks[page], baseMetrics.clicks?.[page] || {});
    addSparse(merged.clicks[page], addMetrics.clicks?.[page] || {});
    merged.dwell[page] = {};
    addSparse(merged.dwell[page], baseMetrics.dwell?.[page] || {});
    addSparse(merged.dwell[page], addMetrics.dwell?.[page] || {});
  }
  return merged;
}

function parseCellTriples(raw: unknown): HeatmapCellTriple[] {
  if (!Array.isArray(raw)) return [];
  const out: HeatmapCellTriple[] = [];
  for (const item of raw.slice(0, MAX_ENGAGEMENT_CELLS_PER_FLUSH)) {
    if (!Array.isArray(item) || item.length < 3) continue;
    const row = Number(item[0]);
    const col = Number(item[1]);
    const count = Math.floor(Number(item[2]));
    if (!Number.isInteger(row) || !Number.isInteger(col) || !Number.isFinite(count)) continue;
    if (row < 0 || row >= HEATMAP_ROWS || col < 0 || col >= HEATMAP_COLS) continue;
    if (count <= 0 || count > 500) continue;
    out.push([row, col, count]);
  }
  return out;
}

/**
 * Validate a client engagement beacon. The client may send `path`; we always
 * re-canonicalize so note IDs and unknown routes cannot be stored.
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
  const clicks = allowHeatmap ? parseCellTriples(rec.clicks) : [];
  const dwell = allowHeatmap ? parseCellTriples(rec.dwell) : [];

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

export function applyEngagementFlush(
  current: DailyPageEngagement,
  flush: PageEngagementFlush,
): DailyPageEngagement {
  const next = mergeDailyPageEngagement(current, createEmptyDailyPageEngagement());
  const page = flush.page;
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
