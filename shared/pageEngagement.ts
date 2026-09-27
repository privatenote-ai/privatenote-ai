import {
  addEngagedMsToHistogram,
  mergeEngagedHistograms,
} from "./engagedTime";
import { isSearchReferrer, type ReferrerType } from "./referrerCategory";
import { isLocaleHomeSegment } from "./supportedLanguages";
import { utmCampaignKey, type SanitizedUtm } from "./utmSanitize";

export const MAX_VISIBLE_MS_PER_FLUSH = 20 * 60 * 1000;
export const MAX_ANALYTICS_PATH_LENGTH = 160;
export const MAX_STORED_PAGES_PER_DAY = 250;
export const MAX_TRANSITIONS_PER_DAY = 200;
export const MAX_UTM_CAMPAIGNS_PER_DAY = 80;

export const SEO_LANDING_PATHS = [
  "/",
  "/one-time-link",
  "/privnote-alternative",
  "/secure-file-transfer",
  "/password-generator",
  "/developers",
  "/developers/mcp",
  "/developers/cli",
  "/auth",
  "/account",
  "/premium",
] as const;
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
  "/one-time-link": "One-time link",
  "/privnote-alternative": "Privnote alternative",
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
  /** Engaged seconds (legacy field name kept for existing KV records). */
  visibleSeconds: Record<string, number>;
  uniqueSessions?: Record<string, number>;
  bounces?: Record<string, number>;
  exits?: Record<string, number>;
  engagedHistogram?: Record<string, number[]>;
  transitions?: Record<string, number>;
  referrerSessions?: Record<string, number>;
  searchOriginSessions?: Record<string, number>;
  utmCampaignSessions?: Record<string, number>;
  ctaClicks?: Record<string, number>;
  sessionsOpenedNote?: number;
  sessionsCreatedNote?: number;
  recipientLoopCompleted?: number;
  noteCreationsByLanding?: Record<string, number>;
  signupsByLanding?: Record<string, number>;
  authStartsByLanding?: Record<string, number>;
  premiumByLanding?: Record<string, number>;
  checkoutByLanding?: Record<string, number>;
  notesByReferrer?: Record<string, number>;
  signupsByReferrer?: Record<string, number>;
  premiumByReferrer?: Record<string, number>;
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
    uniqueSessions: {},
    bounces: {},
    exits: {},
    engagedHistogram: {},
    transitions: {},
    referrerSessions: {},
    searchOriginSessions: {},
    utmCampaignSessions: {},
    ctaClicks: {},
    sessionsOpenedNote: 0,
    sessionsCreatedNote: 0,
    recipientLoopCompleted: 0,
    noteCreationsByLanding: {},
    signupsByLanding: {},
    authStartsByLanding: {},
    premiumByLanding: {},
    checkoutByLanding: {},
    notesByReferrer: {},
    signupsByReferrer: {},
    premiumByReferrer: {},
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

function remapPageCounts(source: Record<string, number> | undefined): Record<string, number> {
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

function remapLooseCounts(source: Record<string, number> | undefined, maxKeyLength = 80): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(source || {})) {
    if (typeof key !== "string" || key.length === 0 || key.length > maxKeyLength) continue;
    const n = Math.floor(Number(value) || 0);
    if (n <= 0) continue;
    out[key] = (out[key] || 0) + n;
  }
  return out;
}

function addCountMaps(
  into: Record<string, number>,
  from: Record<string, number> | undefined,
  cap?: number,
): void {
  for (const [key, value] of Object.entries(from || {})) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (cap && !(key in into) && Object.keys(into).length >= cap) continue;
    into[key] = (into[key] || 0) + Math.floor(n);
  }
}

export function normalizeDailyPageEngagement(raw: DailyPageEngagement | undefined | null): DailyPageEngagement {
  const source = raw || createEmptyDailyPageEngagement();
  return {
    visits: remapPageCounts(source.visits),
    visibleSeconds: remapPageCounts(source.visibleSeconds),
    uniqueSessions: remapPageCounts(source.uniqueSessions),
    bounces: remapPageCounts(source.bounces),
    exits: remapPageCounts(source.exits),
    engagedHistogram: { ...(source.engagedHistogram || {}) },
    transitions: remapLooseCounts(source.transitions, 120),
    referrerSessions: remapLooseCounts(source.referrerSessions, 24),
    searchOriginSessions: remapPageCounts(source.searchOriginSessions),
    utmCampaignSessions: remapLooseCounts(source.utmCampaignSessions, 80),
    ctaClicks: remapLooseCounts(source.ctaClicks, 80),
    sessionsOpenedNote: Math.max(0, Math.floor(Number(source.sessionsOpenedNote) || 0)),
    sessionsCreatedNote: Math.max(0, Math.floor(Number(source.sessionsCreatedNote) || 0)),
    recipientLoopCompleted: Math.max(0, Math.floor(Number(source.recipientLoopCompleted) || 0)),
    noteCreationsByLanding: remapPageCounts(source.noteCreationsByLanding),
    signupsByLanding: remapPageCounts(source.signupsByLanding),
    authStartsByLanding: remapPageCounts(source.authStartsByLanding),
    premiumByLanding: remapPageCounts(source.premiumByLanding),
    checkoutByLanding: remapPageCounts(source.checkoutByLanding),
    notesByReferrer: remapLooseCounts(source.notesByReferrer, 24),
    signupsByReferrer: remapLooseCounts(source.signupsByReferrer, 24),
    premiumByReferrer: remapLooseCounts(source.premiumByReferrer, 24),
  };
}

export function mergeDailyPageEngagement(
  baseMetrics: DailyPageEngagement,
  addMetrics: DailyPageEngagement,
): DailyPageEngagement {
  const base = normalizeDailyPageEngagement(baseMetrics);
  const add = normalizeDailyPageEngagement(addMetrics);
  const merged = createEmptyDailyPageEngagement();
  addCountMaps(merged.visits, base.visits);
  addCountMaps(merged.visits, add.visits);
  addCountMaps(merged.visibleSeconds, base.visibleSeconds);
  addCountMaps(merged.visibleSeconds, add.visibleSeconds);
  addCountMaps(merged.uniqueSessions!, base.uniqueSessions);
  addCountMaps(merged.uniqueSessions!, add.uniqueSessions);
  addCountMaps(merged.bounces!, base.bounces);
  addCountMaps(merged.bounces!, add.bounces);
  addCountMaps(merged.exits!, base.exits);
  addCountMaps(merged.exits!, add.exits);
  merged.engagedHistogram = mergeEngagedHistograms(base.engagedHistogram, add.engagedHistogram);
  addCountMaps(merged.transitions!, base.transitions, MAX_TRANSITIONS_PER_DAY);
  addCountMaps(merged.transitions!, add.transitions, MAX_TRANSITIONS_PER_DAY);
  addCountMaps(merged.referrerSessions!, base.referrerSessions);
  addCountMaps(merged.referrerSessions!, add.referrerSessions);
  addCountMaps(merged.searchOriginSessions!, base.searchOriginSessions);
  addCountMaps(merged.searchOriginSessions!, add.searchOriginSessions);
  addCountMaps(merged.utmCampaignSessions!, base.utmCampaignSessions, MAX_UTM_CAMPAIGNS_PER_DAY);
  addCountMaps(merged.utmCampaignSessions!, add.utmCampaignSessions, MAX_UTM_CAMPAIGNS_PER_DAY);
  addCountMaps(merged.ctaClicks!, base.ctaClicks);
  addCountMaps(merged.ctaClicks!, add.ctaClicks);
  merged.sessionsOpenedNote = (base.sessionsOpenedNote || 0) + (add.sessionsOpenedNote || 0);
  merged.sessionsCreatedNote = (base.sessionsCreatedNote || 0) + (add.sessionsCreatedNote || 0);
  merged.recipientLoopCompleted = (base.recipientLoopCompleted || 0) + (add.recipientLoopCompleted || 0);
  addCountMaps(merged.noteCreationsByLanding!, base.noteCreationsByLanding);
  addCountMaps(merged.noteCreationsByLanding!, add.noteCreationsByLanding);
  addCountMaps(merged.signupsByLanding!, base.signupsByLanding);
  addCountMaps(merged.signupsByLanding!, add.signupsByLanding);
  addCountMaps(merged.authStartsByLanding!, base.authStartsByLanding);
  addCountMaps(merged.authStartsByLanding!, add.authStartsByLanding);
  addCountMaps(merged.premiumByLanding!, base.premiumByLanding);
  addCountMaps(merged.premiumByLanding!, add.premiumByLanding);
  addCountMaps(merged.checkoutByLanding!, base.checkoutByLanding);
  addCountMaps(merged.checkoutByLanding!, add.checkoutByLanding);
  addCountMaps(merged.notesByReferrer!, base.notesByReferrer);
  addCountMaps(merged.notesByReferrer!, add.notesByReferrer);
  addCountMaps(merged.signupsByReferrer!, base.signupsByReferrer);
  addCountMaps(merged.signupsByReferrer!, add.signupsByReferrer);
  addCountMaps(merged.premiumByReferrer!, base.premiumByReferrer);
  addCountMaps(merged.premiumByReferrer!, add.premiumByReferrer);
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
  const engagedRaw = rec.engagedMs ?? rec.visibleMs;
  const visibleMs = Math.min(
    MAX_VISIBLE_MS_PER_FLUSH,
    Math.max(0, Math.floor(Number(engagedRaw) || 0)),
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
    next.engagedHistogram = next.engagedHistogram || {};
    next.engagedHistogram[page] = addEngagedMsToHistogram(next.engagedHistogram[page], flush.visibleMs);
  }
  return next;
}

function bumpPage(map: Record<string, number>, page: string, n = 1): void {
  map[page] = (map[page] || 0) + n;
}

export function applySessionStarted(
  current: DailyPageEngagement,
  input: { page: string; referrerType: ReferrerType; utm: SanitizedUtm },
): DailyPageEngagement {
  const next = normalizeDailyPageEngagement(current);
  const page = migrateLegacyPageKey(input.page);
  next.uniqueSessions = next.uniqueSessions || {};
  bumpPage(next.uniqueSessions, page);
  next.referrerSessions = next.referrerSessions || {};
  next.referrerSessions[input.referrerType] = (next.referrerSessions[input.referrerType] || 0) + 1;
  if (isSearchReferrer(input.referrerType)) {
    next.searchOriginSessions = next.searchOriginSessions || {};
    bumpPage(next.searchOriginSessions, page);
  }
  const campaign = utmCampaignKey(input.utm);
  if (campaign) {
    next.utmCampaignSessions = next.utmCampaignSessions || {};
    if (
      campaign in next.utmCampaignSessions ||
      Object.keys(next.utmCampaignSessions).length < MAX_UTM_CAMPAIGNS_PER_DAY
    ) {
      next.utmCampaignSessions[campaign] = (next.utmCampaignSessions[campaign] || 0) + 1;
    }
  }
  return next;
}

export function applyPageTransition(
  current: DailyPageEngagement,
  fromPage: string,
  toPage: string,
): DailyPageEngagement {
  const next = normalizeDailyPageEngagement(current);
  const from = migrateLegacyPageKey(fromPage);
  const to = migrateLegacyPageKey(toPage);
  const key = `${from}\t${to}`;
  next.transitions = next.transitions || {};
  if (key in next.transitions || Object.keys(next.transitions).length < MAX_TRANSITIONS_PER_DAY) {
    next.transitions[key] = (next.transitions[key] || 0) + 1;
  }
  return next;
}

export function applySessionSummary(
  current: DailyPageEngagement,
  input: {
    landingPage: string;
    exitPage: string;
    pageCount: number;
    openedNote: boolean;
    createdNote: boolean;
    recipientLoop: boolean;
    viewedAuth: boolean;
    startedSignup: boolean;
    viewedPremium: boolean;
    startedCheckout: boolean;
    referrerType?: ReferrerType;
  },
): DailyPageEngagement {
  const next = normalizeDailyPageEngagement(current);
  const landing = migrateLegacyPageKey(input.landingPage);
  const exit = migrateLegacyPageKey(input.exitPage);
  next.exits = next.exits || {};
  bumpPage(next.exits, exit);
  if (input.pageCount <= 1) {
    next.bounces = next.bounces || {};
    bumpPage(next.bounces, landing);
  }
  if (input.openedNote) next.sessionsOpenedNote = (next.sessionsOpenedNote || 0) + 1;
  if (input.createdNote) {
    next.sessionsCreatedNote = (next.sessionsCreatedNote || 0) + 1;
    next.noteCreationsByLanding = next.noteCreationsByLanding || {};
    bumpPage(next.noteCreationsByLanding, landing);
    if (input.referrerType) {
      next.notesByReferrer = next.notesByReferrer || {};
      next.notesByReferrer[input.referrerType] = (next.notesByReferrer[input.referrerType] || 0) + 1;
    }
  }
  if (input.recipientLoop) next.recipientLoopCompleted = (next.recipientLoopCompleted || 0) + 1;
  if (input.viewedAuth) {
    next.authStartsByLanding = next.authStartsByLanding || {};
    bumpPage(next.authStartsByLanding, landing);
  }
  if (input.startedSignup) {
    next.signupsByLanding = next.signupsByLanding || {};
    bumpPage(next.signupsByLanding, landing);
    if (input.referrerType) {
      next.signupsByReferrer = next.signupsByReferrer || {};
      next.signupsByReferrer[input.referrerType] = (next.signupsByReferrer[input.referrerType] || 0) + 1;
    }
  }
  if (input.viewedPremium) {
    next.premiumByLanding = next.premiumByLanding || {};
    bumpPage(next.premiumByLanding, landing);
    if (input.referrerType) {
      next.premiumByReferrer = next.premiumByReferrer || {};
      next.premiumByReferrer[input.referrerType] = (next.premiumByReferrer[input.referrerType] || 0) + 1;
    }
  }
  if (input.startedCheckout) {
    next.checkoutByLanding = next.checkoutByLanding || {};
    bumpPage(next.checkoutByLanding, landing);
  }
  return next;
}

export function applyCtaClick(current: DailyPageEngagement, page: string, ctaId: string): DailyPageEngagement {
  const next = normalizeDailyPageEngagement(current);
  const path = migrateLegacyPageKey(page);
  next.ctaClicks = next.ctaClicks || {};
  next.ctaClicks[path] = (next.ctaClicks[path] || 0) + 1;
  next.ctaClicks[ctaId] = (next.ctaClicks[ctaId] || 0) + 1;
  return next;
}
