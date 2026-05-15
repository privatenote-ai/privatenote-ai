/**
 * Run work after the Largest Contentful Paint (or a long fallback timeout).
 * Keeps non-essential fetches off Lighthouse's critical request chain.
 */
export function scheduleAfterLcp(
  work: () => void,
  options?: { fallbackMs?: number },
): () => void {
  if (typeof window === "undefined") {
    work();
    return () => {};
  }

  const fallbackMs = options?.fallbackMs ?? 4_000;
  let cancelled = false;
  let started = false;

  const start = () => {
    if (cancelled || started) return;
    started = true;
    requestAnimationFrame(() => {
      if (!cancelled) work();
    });
  };

  const fallbackTimer = globalThis.setTimeout(start, fallbackMs);
  let observer: PerformanceObserver | undefined;
  let loadTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

  const scheduleLoadFallback = () => {
    loadTimer = globalThis.setTimeout(start, 2_500);
  };
  if (document.readyState === "complete") {
    scheduleLoadFallback();
  } else {
    window.addEventListener("load", scheduleLoadFallback, { once: true });
  }

  try {
    observer = new PerformanceObserver(() => {
      observer?.disconnect();
      globalThis.clearTimeout(fallbackTimer);
      if (loadTimer !== undefined) globalThis.clearTimeout(loadTimer);
      start();
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // PerformanceObserver unsupported — rely on fallback timers only.
  }

  return () => {
    cancelled = true;
    globalThis.clearTimeout(fallbackTimer);
    if (loadTimer !== undefined) globalThis.clearTimeout(loadTimer);
    window.removeEventListener("load", scheduleLoadFallback);
    observer?.disconnect();
  };
}
