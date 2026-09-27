/**
 * First-party product analytics. Sends only allowlisted events.
 * Never include note content, keys, emails, filenames, URLs, or a session ID.
 */
import {
  isAnalyticsNamedEvent,
  type AnalyticsCtaId,
  type AnalyticsNamedEvent,
} from "@shared/analyticsEvents";
import { hasPagesSameOriginApiProxy } from "@shared/pagesAppHosts";

function isPrerender(): boolean {
  return Boolean((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__);
}

function analyticsUrl(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const base = hasPagesSameOriginApiProxy(host)
    ? ""
    : (import.meta.env.VITE_API_URL || "").trim();
  return `${base}/api/analytics/event`;
}

function postAnalytics(payload: Record<string, unknown>, keepalive: boolean): void {
  if (typeof window === "undefined" || isPrerender()) return;
  const json = JSON.stringify(payload);
  const url = analyticsUrl();
  if (keepalive && typeof navigator.sendBeacon === "function") {
    try {
      const ok = navigator.sendBeacon(url, new Blob([json], { type: "text/plain;charset=UTF-8" }));
      if (ok) return;
    } catch {
      /* fall through */
    }
  }
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
    keepalive,
    credentials: "omit",
  }).catch(() => {});
}

export function trackAnalytics(payload: Record<string, unknown>, keepalive = false): void {
  postAnalytics(payload, keepalive);
}

export function trackNamedEvent(
  event: AnalyticsNamedEvent,
  extra?: { path?: string; ctaId?: AnalyticsCtaId; keepalive?: boolean },
): void {
  if (!isAnalyticsNamedEvent(event)) return;
  const payload: Record<string, unknown> = { event };
  if (extra?.path) payload.path = extra.path.split(/[?#]/)[0] || "/";
  if (event === "cta_clicked" && extra?.ctaId) payload.ctaId = extra.ctaId;
  postAnalytics(payload, extra?.keepalive === true);
}

export function trackCta(ctaId: AnalyticsCtaId, path?: string, keepalive = false): void {
  trackNamedEvent("cta_clicked", {
    ctaId,
    path: path || (typeof window !== "undefined" ? window.location.pathname : "/"),
    keepalive,
  });
}
