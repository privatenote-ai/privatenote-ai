import { ANALYTICS_IDLE_TIMEOUT_MS } from "@shared/analyticsRetention";
import { canonicalizeAnalyticsPath, type AnalyticsPageId } from "@shared/pageEngagement";
import {
  beginAnalyticsSession,
  recordAnalyticsPath,
  takeAnalyticsSessionSummary,
} from "@/utils/analyticsSession";
import { trackAnalytics } from "@/utils/productAnalytics";

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

function analyticsPathname(): string {
  return (window.location.pathname || "/").split(/[?#]/)[0] || "/";
}

class NativePageAnalyticsCollector {
  private page: AnalyticsPageId | null = null;
  private path = "/";
  private visitsPending = 0;
  private engagedStartedAt = 0;
  private engagedAccumMs = 0;
  private lastInteractionAt = 0;
  private started = false;
  private idleTimer: number | null = null;

  start(): void {
    try {
      if (this.started || isPrerender() || isEmbeddedPreview()) return;
      this.started = true;
      document.addEventListener("visibilitychange", this.onVisibility);
      window.addEventListener("pagehide", this.onPageHide);
      window.addEventListener("focus", this.onFocus);
      window.addEventListener("blur", this.onBlur);
      window.addEventListener("pointerdown", this.onInteraction, { passive: true });
      window.addEventListener("keydown", this.onInteraction);
      window.addEventListener("scroll", this.onInteraction, { passive: true });
      this.lastInteractionAt = Date.now();
      this.setPage(analyticsPathname());
      this.sendSessionStarted();
    } catch {
      this.started = false;
    }
  }

  stop(): void {
    if (!this.started) return;
    try {
      this.flush({ keepalive: true });
      this.sendSessionSummary();
    } catch {
      /* ignore */
    }
    this.started = false;
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pagehide", this.onPageHide);
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);
    window.removeEventListener("pointerdown", this.onInteraction);
    window.removeEventListener("keydown", this.onInteraction);
    window.removeEventListener("scroll", this.onInteraction);
    this.clearIdleTimer();
  }

  onRouteChange(pathname: string): void {
    if (!this.started) return;
    try {
      const path = pathname.split(/[?#]/)[0] || "/";
      if (path === this.path && this.page) return;
      this.flush({ keepalive: false });
      const transition = recordAnalyticsPath(path);
      if (transition) {
        trackAnalytics({
          kind: "page_transition",
          fromPath: transition.from,
          toPath: transition.to,
        });
      }
      this.setPage(path);
    } catch {
      /* never break routing */
    }
  }

  private sendSessionStarted(): void {
    const { flags, first } = beginAnalyticsSession(this.path);
    if (!first) return;
    const payload: Record<string, unknown> = {
      kind: "session_started",
      path: flags.landingPath,
      referrerType: flags.referrerType,
    };
    if (flags.utm.source) payload.utmSource = flags.utm.source;
    if (flags.utm.medium) payload.utmMedium = flags.utm.medium;
    if (flags.utm.campaign) payload.utmCampaign = flags.utm.campaign;
    if (flags.utm.content) payload.utmContent = flags.utm.content;
    trackAnalytics(payload);
  }

  private sendSessionSummary(): void {
    const flags = takeAnalyticsSessionSummary();
    if (!flags) return;
    trackAnalytics(
      {
        kind: "session_summary",
        landingPath: flags.landingPath,
        exitPath: this.page || flags.lastPath,
        pageCount: flags.pageCount,
        openedNote: flags.openedNote,
        createdNote: flags.createdNote,
        recipientLoop: flags.openedNote && flags.createdNote,
        viewedAuth: flags.viewedAuth,
        startedSignup: flags.startedSignup,
        viewedPremium: flags.viewedPremium,
        startedCheckout: flags.startedCheckout,
        referrerType: flags.referrerType,
      },
      true,
    );
  }

  private setPage(pathname: string): void {
    const page = canonicalizeAnalyticsPath(pathname);
    this.path = pathname.split(/[?#]/)[0] || "/";
    this.page = page;
    this.visitsPending = page ? 1 : 0;
    this.engagedAccumMs = 0;
    this.engagedStartedAt = this.shouldAccumulate() ? Date.now() : 0;
    this.armIdleTimer();
  }

  private shouldAccumulate(): boolean {
    if (document.visibilityState !== "visible") return false;
    if (typeof document.hasFocus === "function" && !document.hasFocus()) {
      return Date.now() - this.lastInteractionAt < ANALYTICS_IDLE_TIMEOUT_MS;
    }
    return Date.now() - this.lastInteractionAt < ANALYTICS_IDLE_TIMEOUT_MS;
  }

  private onInteraction = (): void => {
    this.lastInteractionAt = Date.now();
    if (this.started && this.engagedStartedAt === 0 && this.shouldAccumulate()) {
      this.engagedStartedAt = Date.now();
    }
    this.armIdleTimer();
  };

  private onFocus = (): void => {
    this.lastInteractionAt = Date.now();
    if (this.engagedStartedAt === 0 && this.shouldAccumulate()) {
      this.engagedStartedAt = Date.now();
    }
    this.armIdleTimer();
  };

  private onBlur = (): void => {
    this.armIdleTimer();
  };

  private armIdleTimer(): void {
    this.clearIdleTimer();
    this.idleTimer = window.setTimeout(() => {
      this.pauseEngagedClock();
    }, ANALYTICS_IDLE_TIMEOUT_MS);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer != null) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private onVisibility = (): void => {
    if (document.visibilityState === "hidden") {
      this.pauseEngagedClock();
      this.flush({ keepalive: true });
    } else if (document.visibilityState === "visible") {
      this.lastInteractionAt = Date.now();
      this.engagedStartedAt = Date.now();
      this.armIdleTimer();
    }
  };

  private onPageHide = (): void => {
    this.pauseEngagedClock();
    this.flush({ keepalive: true });
    this.sendSessionSummary();
  };

  private pauseEngagedClock(): void {
    if (this.engagedStartedAt > 0) {
      this.engagedAccumMs += Math.max(0, Date.now() - this.engagedStartedAt);
      this.engagedStartedAt = 0;
    }
  }

  private flush(opts: { keepalive: boolean }): void {
    try {
      if (!this.page) return;
      if (this.shouldAccumulate() && this.engagedStartedAt > 0) {
        this.engagedAccumMs += Math.max(0, Date.now() - this.engagedStartedAt);
        this.engagedStartedAt = Date.now();
      } else {
        this.pauseEngagedClock();
      }
      const visits = this.visitsPending;
      const engagedMs = this.engagedAccumMs;
      if (visits === 0 && engagedMs < 500) {
        return;
      }
      trackAnalytics(
        {
          kind: "engagement",
          path: this.path,
          visits,
          engagedMs,
        },
        opts.keepalive,
      );
      this.visitsPending = 0;
      this.engagedAccumMs = 0;
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
