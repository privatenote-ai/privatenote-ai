import { canonicalizeAnalyticsPath, type AnalyticsPageId } from "@shared/pageEngagement";
import { hasPagesSameOriginApiProxy } from "@shared/pagesAppHosts";

const FLUSH_MS = 15_000;

function isPrerender(): boolean {
  return Boolean((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__);
}

function isEmbeddedPreview(): boolean {
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  return false;
}

function analyticsUrl(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const base = hasPagesSameOriginApiProxy(host)
    ? ""
    : (import.meta.env.VITE_API_URL || "").trim();
  return `${base}/api/analytics/event`;
}

function postEngagement(payload: Record<string, unknown>, keepalive: boolean): void {
  const json = JSON.stringify(payload);
  const url = analyticsUrl();
  if (keepalive && typeof navigator.sendBeacon === "function") {
    try {
      const ok = navigator.sendBeacon(url, new Blob([json], { type: "text/plain;charset=UTF-8" }));
      if (ok) return;
    } catch {
      /* fall through to fetch */
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

class NativePageAnalyticsCollector {
  private page: AnalyticsPageId | null = null;
  private path = "/";
  private visitsPending = 0;
  private visibleStartedAt = 0;
  private visibleAccumMs = 0;
  private flushTimer: number | null = null;
  private started = false;

  start(): void {
    try {
      if (this.started || isPrerender() || isEmbeddedPreview()) return;
      this.started = true;
      document.addEventListener("visibilitychange", this.onVisibility);
      window.addEventListener("pagehide", this.onPageHide);
      this.setPage(window.location.pathname || "/");
      this.armTimers();
    } catch {
      this.started = false;
    }
  }

  stop(): void {
    if (!this.started) return;
    try {
      this.flush({ keepalive: true });
    } catch {
      /* ignore */
    }
    this.started = false;
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pagehide", this.onPageHide);
    this.clearTimers();
  }

  onRouteChange(pathname: string): void {
    if (!this.started) return;
    try {
      const path = pathname.split(/[?#]/)[0] || "/";
      if (path === this.path && this.page) return;
      this.flush({ keepalive: false });
      this.setPage(path);
    } catch {
      /* never break routing */
    }
  }

  private setPage(pathname: string): void {
    const page = canonicalizeAnalyticsPath(pathname);
    this.path = pathname.split(/[?#]/)[0] || "/";
    this.page = page;
    this.visitsPending = page ? 1 : 0;
    this.visibleAccumMs = 0;
    if (document.visibilityState === "visible") {
      this.visibleStartedAt = Date.now();
    } else {
      this.visibleStartedAt = 0;
    }
  }

  private armTimers(): void {
    this.clearTimers();
    this.flushTimer = window.setInterval(() => this.flush({ keepalive: false }), FLUSH_MS);
  }

  private clearTimers(): void {
    if (this.flushTimer != null) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private onVisibility = (): void => {
    if (document.visibilityState === "hidden") {
      this.pauseVisibleClock();
      this.flush({ keepalive: true });
    } else if (document.visibilityState === "visible") {
      this.visibleStartedAt = Date.now();
    }
  };

  private onPageHide = (): void => {
    this.pauseVisibleClock();
    this.flush({ keepalive: true });
  };

  private pauseVisibleClock(): void {
    if (this.visibleStartedAt > 0) {
      this.visibleAccumMs += Math.max(0, Date.now() - this.visibleStartedAt);
      this.visibleStartedAt = 0;
    }
  }

  private flush(opts: { keepalive: boolean }): void {
    try {
      if (!this.page) return;
      if (document.visibilityState === "visible" && this.visibleStartedAt > 0) {
        this.visibleAccumMs += Math.max(0, Date.now() - this.visibleStartedAt);
        this.visibleStartedAt = Date.now();
      }
      const visits = this.visitsPending;
      const visibleMs = this.visibleAccumMs;
      if (visits === 0 && visibleMs < 500) {
        return;
      }
      postEngagement(
        {
          kind: "engagement",
          path: this.path,
          visits,
          visibleMs,
        },
        opts.keepalive,
      );
      this.visitsPending = 0;
      this.visibleAccumMs = 0;
    } catch {
      /* never throw into the page */
    }
  }
}

let collector: NativePageAnalyticsCollector | null = null;

export function startNativePageAnalytics(): () => void {
  try {
    if (typeof window === "undefined" || isPrerender() || isEmbeddedPreview()) return () => {};
    if (!collector) collector = new NativePageAnalyticsCollector();
    collector.start();
    return () => {
      try {
        collector?.stop();
      } catch {
        /* ignore */
      }
    };
  } catch {
    return () => {};
  }
}

export function notifyNativePageAnalyticsRoute(pathname: string): void {
  try {
    collector?.onRouteChange(pathname);
  } catch {
    /* never break routing */
  }
}
