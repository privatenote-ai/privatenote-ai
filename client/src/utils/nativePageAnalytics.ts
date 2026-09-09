import {
  canonicalizeAnalyticsPath,
  documentPointToCell,
  MAX_ENGAGEMENT_CELLS_PER_FLUSH,
  pageAllowsHeatmap,
  type HeatmapCellTriple,
  type PageEngagementKey,
} from "@shared/pageEngagement";
import { hasPagesSameOriginApiProxy } from "@shared/pagesAppHosts";

const FLUSH_MS = 15_000;
const DWELL_MS = 4_000;

type CellMap = Map<string, number>;

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

function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

function bump(map: CellMap, row: number, col: number, n = 1): void {
  const key = cellKey(row, col);
  map.set(key, (map.get(key) || 0) + n);
}

function serializeCells(map: CellMap): HeatmapCellTriple[] {
  const entries = [...map.entries()]
    .map(([key, count]) => {
      const [row, col] = key.split(",").map((v) => Number(v));
      return [row, col, count] as HeatmapCellTriple;
    })
    .filter(([row, col, count]) => Number.isInteger(row) && Number.isInteger(col) && count > 0)
    .sort((a, b) => b[2] - a[2])
    .slice(0, MAX_ENGAGEMENT_CELLS_PER_FLUSH);
  map.clear();
  return entries;
}

function currentScrollMaxPct(): number {
  const el = document.documentElement;
  const max = Math.max(0, el.scrollHeight - el.clientHeight);
  if (max <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)));
}

function postEngagement(payload: Record<string, unknown>, keepalive: boolean): void {
  const json = JSON.stringify(payload);
  const url = analyticsUrl();
  if (keepalive && typeof navigator.sendBeacon === "function") {
    try {
      // text/plain is CORS-simple if the request is ever cross-origin; Workers parse JSON from the body either way.
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
  private page: PageEngagementKey | null = null;
  private path = "/";
  private visitsPending = 0;
  private visibleStartedAt = 0;
  private visibleAccumMs = 0;
  private maxScrollPct = 0;
  private clicks: CellMap = new Map();
  private dwell: CellMap = new Map();
  private lastMouse: { x: number; y: number } | null = null;
  private flushTimer: number | null = null;
  private dwellTimer: number | null = null;
  private started = false;

  start(): void {
    if (this.started || isPrerender()) return;
    this.started = true;
    window.addEventListener("click", this.onClick, { capture: true, passive: true });
    window.addEventListener("mousemove", this.onMouseMove, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("pagehide", this.onPageHide);
    this.setPage(window.location.pathname || "/");
    this.armTimers();
  }

  stop(): void {
    if (!this.started) return;
    this.flush({ keepalive: true, recordScroll: true });
    this.started = false;
    window.removeEventListener("click", this.onClick, true);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pagehide", this.onPageHide);
    this.clearTimers();
  }

  onRouteChange(pathname: string): void {
    if (!this.started) return;
    const path = pathname.split(/[?#]/)[0] || "/";
    if (path === this.path && this.page) return;
    this.flush({ keepalive: false, recordScroll: true });
    this.setPage(path);
  }

  private setPage(pathname: string): void {
    const page = canonicalizeAnalyticsPath(pathname);
    this.path = pathname.split(/[?#]/)[0] || "/";
    this.page = page;
    this.visitsPending = page ? 1 : 0;
    this.visibleAccumMs = 0;
    this.maxScrollPct = currentScrollMaxPct();
    this.clicks = new Map();
    this.dwell = new Map();
    this.lastMouse = null;
    if (document.visibilityState === "visible") {
      this.visibleStartedAt = Date.now();
    } else {
      this.visibleStartedAt = 0;
    }
  }

  private armTimers(): void {
    this.clearTimers();
    this.flushTimer = window.setInterval(() => this.flush({ keepalive: false, recordScroll: false }), FLUSH_MS);
    this.dwellTimer = window.setInterval(() => this.sampleDwell(), DWELL_MS);
  }

  private clearTimers(): void {
    if (this.flushTimer != null) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.dwellTimer != null) {
      window.clearInterval(this.dwellTimer);
      this.dwellTimer = null;
    }
  }

  private onClick = (event: MouseEvent): void => {
    if (!this.page || !pageAllowsHeatmap(this.page)) return;
    const cell = documentPointToCell(
      event.pageX,
      event.pageY,
      document.documentElement.scrollWidth,
      document.documentElement.scrollHeight,
    );
    if (cell) bump(this.clicks, cell.row, cell.col);
  };

  private onMouseMove = (event: MouseEvent): void => {
    this.lastMouse = { x: event.pageX, y: event.pageY };
  };

  private onScroll = (): void => {
    this.maxScrollPct = Math.max(this.maxScrollPct, currentScrollMaxPct());
  };

  private onVisibility = (): void => {
    if (document.visibilityState === "hidden") {
      this.pauseVisibleClock();
      this.flush({ keepalive: true, recordScroll: false });
    } else if (document.visibilityState === "visible") {
      this.visibleStartedAt = Date.now();
    }
  };

  private onPageHide = (): void => {
    this.pauseVisibleClock();
    this.flush({ keepalive: true, recordScroll: true });
  };

  private pauseVisibleClock(): void {
    if (this.visibleStartedAt > 0) {
      this.visibleAccumMs += Math.max(0, Date.now() - this.visibleStartedAt);
      this.visibleStartedAt = 0;
    }
  }

  private sampleDwell(): void {
    if (!this.page || !pageAllowsHeatmap(this.page)) return;
    if (document.visibilityState !== "visible") return;
    const width = document.documentElement.scrollWidth;
    const height = document.documentElement.scrollHeight;
    let x: number;
    let y: number;
    if (this.lastMouse) {
      x = this.lastMouse.x;
      y = this.lastMouse.y;
    } else {
      x = window.scrollX + window.innerWidth / 2;
      y = window.scrollY + window.innerHeight / 2;
    }
    const cell = documentPointToCell(x, y, width, height);
    if (cell) bump(this.dwell, cell.row, cell.col);
  }

  private flush(opts: { keepalive: boolean; recordScroll: boolean }): void {
    if (!this.page) return;
    if (document.visibilityState === "visible" && this.visibleStartedAt > 0) {
      this.visibleAccumMs += Math.max(0, Date.now() - this.visibleStartedAt);
      this.visibleStartedAt = Date.now();
    }
    const visits = this.visitsPending;
    const visibleMs = this.visibleAccumMs;
    const clicks = serializeCells(this.clicks);
    const dwell = serializeCells(this.dwell);
    const scrollRecorded = opts.recordScroll;
    if (
      visits === 0 &&
      visibleMs < 500 &&
      clicks.length === 0 &&
      dwell.length === 0 &&
      !scrollRecorded
    ) {
      return;
    }
    postEngagement(
      {
        kind: "engagement",
        path: this.path,
        visits,
        visibleMs,
        scrollRecorded,
        scrollMaxPct: scrollRecorded ? this.maxScrollPct : 0,
        clicks,
        dwell,
      },
      opts.keepalive,
    );
    this.visitsPending = 0;
    this.visibleAccumMs = 0;
  }
}

let collector: NativePageAnalyticsCollector | null = null;

export function startNativePageAnalytics(): () => void {
  if (typeof window === "undefined" || isPrerender()) return () => {};
  if (!collector) collector = new NativePageAnalyticsCollector();
  collector.start();
  return () => collector?.stop();
}

export function notifyNativePageAnalyticsRoute(pathname: string): void {
  collector?.onRouteChange(pathname);
}
