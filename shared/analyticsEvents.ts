import { CLIENT_ANALYTICS_EVENTS, isClientAnalyticsEvent } from "./clientAnalyticsEvents";
import { canonicalizeAnalyticsPath } from "./pageEngagement";
import { categorizeReferrer, isReferrerType, type ReferrerType } from "./referrerCategory";
import { sanitizeUtmFields, utmCampaignKey, type SanitizedUtm } from "./utmSanitize";

export const ANALYTICS_NAMED_EVENTS = [
  ...CLIENT_ANALYTICS_EVENTS,
  "cta_clicked",
  "note_creation_started",
  "note_link_copied",
  "share_action_selected",
  "note_open_page_loaded",
  "note_reveal_requested",
  "auth_page_viewed",
  "signup_started",
  "premium_viewed",
  "pricing_cta_clicked",
  "checkout_started",
  "developer_page_viewed",
  "mcp_page_viewed",
  "cli_page_viewed",
  "npm_link_clicked",
  "github_link_clicked",
  "install_command_copied",
  "mcp_demo_started",
  "mcp_demo_completed",
] as const;

export type AnalyticsNamedEvent = (typeof ANALYTICS_NAMED_EVENTS)[number];

export const ANALYTICS_CTA_IDS = [
  "home_create",
  "one_time_link_create",
  "privnote_alternative_create_note",
  "privnote_alternative_file",
  "privnote_alternative_business",
  "privnote_alternative_pricing",
  "file_share_cta",
  "password_share_cta",
  "premium_starter",
  "premium_business",
  "developers_npm",
  "developers_github",
  "recipient_create_note",
] as const;

export type AnalyticsCtaId = (typeof ANALYTICS_CTA_IDS)[number];

const NAMED_EVENT_SET = new Set<string>(ANALYTICS_NAMED_EVENTS);
const CTA_ID_SET = new Set<string>(ANALYTICS_CTA_IDS);

/**
 * Property names that must never appear on an analytics payload,
 * except the listed coarse fields.
 */
export const ANALYTICS_FORBIDDEN_KEY_TOKENS = [
  "content",
  "plaintext",
  "password",
  "key",
  "secret",
  "email",
  "filename",
  "file",
  "noteid",
  "recipient",
  "token",
  "fragment",
  "url",
  "sessionid",
  "userid",
  "ip",
] as const;

const APPROVED_COARSE_KEYS = new Set([
  "passwordprotected",
  "hasattachment",
  "utmcontent",
  "recipientloop",
]);

const ENGAGEMENT_KEYS = new Set(["kind", "path", "visits", "visiblems", "engagedms"]);
const SESSION_STARTED_KEYS = new Set([
  "kind",
  "path",
  "referrertype",
  "utmsource",
  "utmmedium",
  "utmcampaign",
  "utmcontent",
]);
const TRANSITION_KEYS = new Set(["kind", "frompath", "topath"]);
const SUMMARY_KEYS = new Set([
  "kind",
  "landingpath",
  "exitpath",
  "pagecount",
  "openednote",
  "creatednote",
  "recipientloop",
  "viewedauth",
  "startedsignup",
  "viewedpremium",
  "startedcheckout",
  "referrertype",
]);
const NAMED_KEYS = new Set(["event", "path", "ctaid"]);
const LEGACY_PAGE_KEYS = new Set(["page"]);

export type AnalyticsIngest =
  | {
      kind: "engagement";
      page: string;
      visits: 0 | 1;
      engagedMs: number;
    }
  | {
      kind: "session_started";
      page: string;
      referrerType: ReferrerType;
      utm: SanitizedUtm;
    }
  | {
      kind: "page_transition";
      fromPage: string;
      toPage: string;
    }
  | {
      kind: "session_summary";
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
      referrerType: ReferrerType;
    }
  | {
      kind: "named";
      event: AnalyticsNamedEvent;
      page: string | null;
      ctaId: AnalyticsCtaId | null;
    }
  | {
      kind: "legacy_page";
      page: "file-share" | "password-share";
    };

function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  return body as Record<string, unknown>;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[_-]/g, "");
}

export function analyticsPayloadHasForbiddenKeys(body: Record<string, unknown>): boolean {
  for (const key of Object.keys(body)) {
    const normalized = normalizeKey(key);
    if (APPROVED_COARSE_KEYS.has(normalized)) continue;
    for (const token of ANALYTICS_FORBIDDEN_KEY_TOKENS) {
      if (normalized === token || normalized.includes(token)) return true;
    }
  }
  return false;
}

function hasOnlyKeys(body: Record<string, unknown>, allowed: Set<string>): boolean {
  for (const key of Object.keys(body)) {
    if (!allowed.has(normalizeKey(key))) return false;
  }
  return true;
}

function readPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const stripped = value.split(/[?#]/)[0] || "/";
  return canonicalizeAnalyticsPath(stripped);
}

function readBool(value: unknown): boolean {
  return value === true;
}

function readPageCount(value: unknown): number {
  const n = Math.floor(Number(value) || 0);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(30, n);
}

export function isAnalyticsNamedEvent(value: unknown): value is AnalyticsNamedEvent {
  return typeof value === "string" && NAMED_EVENT_SET.has(value);
}

export function parseAnalyticsIngest(body: unknown): AnalyticsIngest | null {
  const rec = asRecord(body);
  if (!rec) return null;
  if (analyticsPayloadHasForbiddenKeys(rec)) return null;

  if (rec.kind === "engagement") {
    if (!hasOnlyKeys(rec, ENGAGEMENT_KEYS)) return null;
    const page = readPath(rec.path);
    if (!page) return null;
    const visits = rec.visits === 1 ? 1 : 0;
    const engagedRaw = rec.engagedMs ?? rec.visibleMs;
    const engagedMs = Math.min(
      20 * 60 * 1000,
      Math.max(0, Math.floor(Number(engagedRaw) || 0)),
    );
    if (visits === 0 && engagedMs === 0) return null;
    return { kind: "engagement", page, visits, engagedMs };
  }

  if (rec.kind === "session_started") {
    if (!hasOnlyKeys(rec, SESSION_STARTED_KEYS)) return null;
    const page = readPath(rec.path);
    if (!page) return null;
    const referrerType = isReferrerType(rec.referrerType)
      ? rec.referrerType
      : categorizeReferrer(typeof rec.referrerType === "string" ? rec.referrerType : null);
    const utm = sanitizeUtmFields({
      utmSource: rec.utmSource,
      utmMedium: rec.utmMedium,
      utmCampaign: rec.utmCampaign,
      utmContent: rec.utmContent,
    });
    return { kind: "session_started", page, referrerType, utm };
  }

  if (rec.kind === "page_transition") {
    if (!hasOnlyKeys(rec, TRANSITION_KEYS)) return null;
    const fromPage = readPath(rec.fromPath);
    const toPage = readPath(rec.toPath);
    if (!fromPage || !toPage || fromPage === toPage) return null;
    return { kind: "page_transition", fromPage, toPage };
  }

  if (rec.kind === "session_summary") {
    if (!hasOnlyKeys(rec, SUMMARY_KEYS)) return null;
    const landingPage = readPath(rec.landingPath);
    const exitPage = readPath(rec.exitPath);
    if (!landingPage || !exitPage) return null;
    const openedNote = readBool(rec.openedNote);
    const createdNote = readBool(rec.createdNote);
    return {
      kind: "session_summary",
      landingPage,
      exitPage,
      pageCount: readPageCount(rec.pageCount),
      openedNote,
      createdNote,
      recipientLoop: readBool(rec.recipientLoop) && openedNote && createdNote,
      viewedAuth: readBool(rec.viewedAuth),
      startedSignup: readBool(rec.startedSignup),
      viewedPremium: readBool(rec.viewedPremium),
      startedCheckout: readBool(rec.startedCheckout),
      referrerType: isReferrerType(rec.referrerType) ? rec.referrerType : "direct",
    };
  }

  if (typeof rec.event === "string") {
    if (!hasOnlyKeys(rec, NAMED_KEYS)) return null;
    if (!isAnalyticsNamedEvent(rec.event)) return null;
    const page = rec.path === undefined ? null : readPath(rec.path);
    let ctaId: AnalyticsCtaId | null = null;
    if (rec.event === "cta_clicked") {
      if (typeof rec.ctaId !== "string" || !CTA_ID_SET.has(rec.ctaId)) return null;
      ctaId = rec.ctaId as AnalyticsCtaId;
    } else if (rec.ctaId !== undefined) {
      return null;
    }
    return { kind: "named", event: rec.event, page, ctaId };
  }

  if (typeof rec.page === "string") {
    if (!hasOnlyKeys(rec, LEGACY_PAGE_KEYS)) return null;
    if (rec.page === "file-share" || rec.page === "password-share") {
      return { kind: "legacy_page", page: rec.page };
    }
    return null;
  }

  return null;
}

export function namedEventToClientCountKey(event: AnalyticsNamedEvent, ctaId: AnalyticsCtaId | null): string {
  if (event === "cta_clicked" && ctaId) return `cta:${ctaId}`;
  return event;
}

export { utmCampaignKey };
