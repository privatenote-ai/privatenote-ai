import { useCallback, useEffect, useRef, useState } from "react";
import {
  HEATMAP_COLS,
  HEATMAP_ROWS,
  SCROLL_BUCKETS,
  scrollReachFromMaxHistogram,
  type SparseHeatmap,
} from "@shared/pageEngagement";

export type HeatMode = "clicks" | "dwell" | "scroll";

function heatColor(t: number, alpha = 0.55): string {
  const clamped = Math.min(1, Math.max(0, t));
  const hue = (1 - clamped) * 220;
  return `hsla(${hue}, 95%, 55%, ${0.08 + clamped * alpha})`;
}

function maxSparse(map: SparseHeatmap | undefined): number {
  if (!map) return 0;
  return Object.values(map).reduce((m, n) => Math.max(m, n), 0);
}

function previewSrc(path: string): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("pnHeatmapPreview", "1");
  return `${url.pathname}${url.search}`;
}

type PageMetrics = {
  docW: number;
  docH: number;
  scrollX: number;
  scrollY: number;
  viewW: number;
  viewH: number;
};

function readIframeMetrics(iframe: HTMLIFrameElement | null): PageMetrics | null {
  try {
    const win = iframe?.contentWindow;
    const doc = iframe?.contentDocument;
    if (!iframe || !win || !doc) return null;
    const el = doc.documentElement;
    const body = doc.body;
    return {
      docW: Math.max(el.scrollWidth, body?.scrollWidth || 0, iframe.clientWidth),
      docH: Math.max(el.scrollHeight, body?.scrollHeight || 0, iframe.clientHeight),
      scrollX: win.scrollX,
      scrollY: win.scrollY,
      viewW: iframe.clientWidth,
      viewH: iframe.clientHeight,
    };
  } catch {
    return null;
  }
}

function drawClickOrDwell(
  ctx: CanvasRenderingContext2D,
  map: SparseHeatmap | undefined,
  metrics: PageMetrics,
) {
  const { docW, docH, scrollX, scrollY, viewW, viewH } = metrics;
  ctx.clearRect(0, 0, viewW, viewH);
  const peak = maxSparse(map);
  if (!map || peak <= 0 || docW <= 0 || docH <= 0) return;

  const cellW = docW / HEATMAP_COLS;
  const cellH = docH / HEATMAP_ROWS;
  const radius = Math.max(18, Math.max(cellW, cellH) * 1.8);

  for (const [key, count] of Object.entries(map)) {
    if (count <= 0) continue;
    const [r, c] = key.split(",");
    const row = Number(r);
    const col = Number(c);
    if (!Number.isInteger(row) || !Number.isInteger(col)) continue;
    const cx = (col + 0.5) * cellW - scrollX;
    const cy = (row + 0.5) * cellH - scrollY;
    if (cx < -radius || cy < -radius || cx > viewW + radius || cy > viewH + radius) continue;
    const t = count / peak;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, heatColor(t, 0.72));
    gradient.addColorStop(0.45, heatColor(t, 0.28));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawScrollReach(
  ctx: CanvasRenderingContext2D,
  scrollMax: number[] | undefined,
  metrics: PageMetrics,
) {
  const { docH, scrollY, viewW, viewH } = metrics;
  ctx.clearRect(0, 0, viewW, viewH);
  const reach = scrollReachFromMaxHistogram(scrollMax);
  const peak = reach[0] || 0;
  if (peak <= 0 || docH <= 0) return;

  const bandH = docH / SCROLL_BUCKETS;
  for (let i = 0; i < SCROLL_BUCKETS; i++) {
    const y0 = i * bandH - scrollY;
    const y1 = (i + 1) * bandH - scrollY;
    const top = Math.max(0, y0);
    const bottom = Math.min(viewH, y1);
    if (bottom <= top) continue;
    const t = reach[i] / peak;
    ctx.fillStyle = heatColor(t, 0.5);
    ctx.fillRect(0, top, viewW, bottom - top);
  }
}

export function PageHeatmapPreview({
  path,
  mode,
  clickMap,
  dwellMap,
  scrollMax,
}: {
  path: string | null;
  mode: HeatMode;
  clickMap: SparseHeatmap | undefined;
  dwellMap: SparseHeatmap | undefined;
  scrollMax: number[] | undefined;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [containerW, setContainerW] = useState(720);
  const [metrics, setMetrics] = useState<PageMetrics | null>(null);
  const previewKey = `${path ?? ""}-${device}`;

  const frameWidth = device === "mobile" ? 390 : 1280;
  const scale = containerW > 0 ? Math.min(1, containerW / frameWidth) : 1;
  const viewH = 640;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerW(width);
    });
    ro.observe(el);
    setContainerW(el.clientWidth || 720);
    return () => ro.disconnect();
  }, []);

  const syncMetrics = useCallback(() => {
    const next = readIframeMetrics(iframeRef.current);
    if (next) setMetrics(next);
  }, []);

  useEffect(() => {
    setMetrics(null);
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cancelled = false;
    const attach = () => {
      if (cancelled) return;
      syncMetrics();
      iframe.contentWindow?.addEventListener("scroll", syncMetrics, { passive: true });
      iframe.contentWindow?.addEventListener("resize", syncMetrics);
    };
    iframe.addEventListener("load", attach);
    if (iframe.contentDocument?.readyState === "complete") attach();
    const id = window.setInterval(() => {
      if (!cancelled) syncMetrics();
    }, 400);
    return () => {
      cancelled = true;
      iframe.removeEventListener("load", attach);
      iframe.contentWindow?.removeEventListener("scroll", syncMetrics);
      iframe.contentWindow?.removeEventListener("resize", syncMetrics);
      window.clearInterval(id);
    };
  }, [previewKey, syncMetrics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !metrics) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(metrics.viewW * dpr));
    canvas.height = Math.max(1, Math.round(metrics.viewH * dpr));
    canvas.style.width = `${metrics.viewW}px`;
    canvas.style.height = `${metrics.viewH}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (mode === "scroll") drawScrollReach(ctx, scrollMax, metrics);
    else drawClickOrDwell(ctx, mode === "clicks" ? clickMap : dwellMap, metrics);
  }, [metrics, mode, clickMap, dwellMap, scrollMax]);

  const reach = scrollReachFromMaxHistogram(scrollMax);
  const peakReach = reach[0] || 0;
  const halfIndex = peakReach > 0 ? reach.findIndex((n) => n / peakReach <= 0.5) : -1;
  const halfPct = halfIndex >= 0 ? Math.round((halfIndex / SCROLL_BUCKETS) * 100) : null;
  const overlayEmpty =
    mode === "scroll"
      ? peakReach <= 0
      : maxSparse(mode === "clicks" ? clickMap : dwellMap) <= 0;

  if (!path) {
    return (
      <p className="rounded-md border border-dashed p-4 text-sm text-gray-500">
        This row is aggregated older data or a private surface, so a live page cannot be shown underneath
        the map.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              device === "desktop"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
            }`}
            onClick={() => setDevice("desktop")}
          >
            Desktop width
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              device === "mobile"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
            }`}
            onClick={() => setDevice("mobile")}
          >
            Mobile width
          </button>
        </div>
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Open {path}
        </a>
      </div>

      {mode === "scroll" ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
          <p className="font-medium">Scroll reach — how far down this page visitors got</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This is not clicks. Everyone who opened the page counts at the top, so the top is always hottest.
            Color cools as fewer people scrolled that far. A mostly-hot page means most visitors reached the
            bottom.
            {halfPct != null ? ` About half of visits reached ~${halfPct}% down.` : ""}
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Overlay is on the live {path} page. Hot spots are {mode === "clicks" ? "clicks" : "pointer dwell"}{" "}
          in a {HEATMAP_COLS}×{HEATMAP_ROWS} grid, drawn as blobs so neighboring cells blend.
        </p>
      )}

      <div ref={containerRef} className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center bg-slate-100 dark:bg-slate-900" style={{ height: viewH, overflow: "hidden" }}>
          <div style={{ width: frameWidth * scale, height: viewH, overflow: "hidden" }}>
            <div
              style={{
                width: frameWidth,
                height: viewH / scale,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "relative",
              }}
            >
            <iframe
              key={previewKey}
              ref={iframeRef}
              title={`Heatmap preview of ${path}`}
              src={previewSrc(path)}
              className="absolute inset-0 h-full w-full bg-white"
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            />
            {mode === "scroll" && !overlayEmpty && metrics && metrics.docH > 0 && (
              <div className="pointer-events-none absolute inset-y-0 right-2 flex w-10 flex-col justify-between py-2 text-[10px] font-medium text-white drop-shadow">
                <span>Top</span>
                <span>50%</span>
                <span>Bottom</span>
              </div>
            )}
            {overlayEmpty && (
              <div className="pointer-events-none absolute inset-x-4 top-4 z-10 rounded-md bg-black/70 px-3 py-2 text-center text-xs text-white">
                {mode === "scroll"
                  ? "No scroll-reach data for this page yet. The live page is shown underneath."
                  : `No ${mode === "clicks" ? "clicks" : "attention samples"} on this page yet. The live page is shown underneath.`}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {mode === "scroll" && (
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="font-medium text-slate-600 dark:text-slate-300">Reached by</span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-8 rounded" style={{ background: heatColor(1, 0.7) }} />
            100% of visits
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-8 rounded" style={{ background: heatColor(0.5, 0.7) }} />
            50%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-8 rounded" style={{ background: heatColor(0.1, 0.7) }} />
            few visitors
          </span>
        </div>
      )}
    </div>
  );
}
