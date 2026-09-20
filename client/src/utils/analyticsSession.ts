import { canonicalizeAnalyticsPath } from "@shared/pageEngagement";
import { categorizeReferrer, type ReferrerType } from "@shared/referrerCategory";
import { readUtmFromSearchParams, type SanitizedUtm } from "@shared/utmSanitize";

const STORAGE_KEY = "pn_analytics_flags_v1";

export type AnalyticsSessionFlags = {
  started: boolean;
  landingPath: string;
  referrerType: ReferrerType;
  utm: SanitizedUtm;
  pageCount: number;
  lastPath: string;
  openedNote: boolean;
  revealedNote: boolean;
  createdNote: boolean;
  creationStarted: boolean;
  viewedAuth: boolean;
  startedSignup: boolean;
  viewedPremium: boolean;
  startedCheckout: boolean;
  summarySent: boolean;
};

function emptyFlags(path: string): AnalyticsSessionFlags {
  return {
    started: false,
    landingPath: path,
    referrerType: "direct",
    utm: { source: null, medium: null, campaign: null, content: null },
    pageCount: 0,
    lastPath: path,
    openedNote: false,
    revealedNote: false,
    createdNote: false,
    creationStarted: false,
    viewedAuth: false,
    startedSignup: false,
    viewedPremium: false,
    startedCheckout: false,
    summarySent: false,
  };
}

function readFlags(): AnalyticsSessionFlags | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnalyticsSessionFlags;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeFlags(flags: AnalyticsSessionFlags): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch {
    /* quota / private mode */
  }
}

export function getAnalyticsSessionFlags(): AnalyticsSessionFlags | null {
  return readFlags();
}

export function beginAnalyticsSession(pathname: string): { flags: AnalyticsSessionFlags; first: boolean } {
  const existing = readFlags();
  if (existing?.started) return { flags: existing, first: false };
  const path = canonicalizeAnalyticsPath(pathname.split(/[?#]/)[0] || "/") || "/";
  const flags = emptyFlags(path);
  flags.started = true;
  flags.pageCount = 1;
  flags.referrerType = categorizeReferrer(
    typeof document !== "undefined" ? document.referrer : "",
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
  flags.utm = readUtmFromSearchParams(typeof window !== "undefined" ? window.location.search : "");
  writeFlags(flags);
  return { flags, first: true };
}

export function recordAnalyticsPath(pathname: string): { from: string; to: string } | null {
  const flags = readFlags();
  if (!flags?.started) return null;
  const to = canonicalizeAnalyticsPath(pathname.split(/[?#]/)[0] || "/") || "/";
  const from = flags.lastPath;
  if (to === from) return null;
  flags.lastPath = to;
  flags.pageCount = Math.min(30, flags.pageCount + 1);
  writeFlags(flags);
  return { from, to };
}

function patchFlags(update: Partial<AnalyticsSessionFlags>): void {
  const flags = readFlags();
  if (!flags?.started) return;
  writeFlags({ ...flags, ...update });
}

export function markAnalyticsOpenedNote(): void {
  patchFlags({ openedNote: true });
}

export function markAnalyticsRevealedNote(): void {
  patchFlags({ revealedNote: true });
}

export function markAnalyticsCreatedNote(): void {
  patchFlags({ createdNote: true });
}

export function markAnalyticsCreationStarted(): boolean {
  const flags = readFlags();
  if (!flags?.started || flags.creationStarted) return false;
  flags.creationStarted = true;
  writeFlags(flags);
  return true;
}

export function markAnalyticsViewedAuth(): void {
  patchFlags({ viewedAuth: true });
}

export function markAnalyticsStartedSignup(): boolean {
  const flags = readFlags();
  if (!flags?.started || flags.startedSignup) return false;
  flags.startedSignup = true;
  writeFlags(flags);
  return true;
}

export function markAnalyticsViewedPremium(): void {
  patchFlags({ viewedPremium: true });
}

export function markAnalyticsStartedCheckout(): boolean {
  const flags = readFlags();
  if (!flags?.started || flags.startedCheckout) return false;
  flags.startedCheckout = true;
  writeFlags(flags);
  return true;
}

export function takeAnalyticsSessionSummary(): AnalyticsSessionFlags | null {
  const flags = readFlags();
  if (!flags?.started || flags.summarySent) return null;
  flags.summarySent = true;
  writeFlags(flags);
  return flags;
}
