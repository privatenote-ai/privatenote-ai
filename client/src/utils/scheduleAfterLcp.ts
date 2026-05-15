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

  const fallbackMs = options?.fallbackMs ?? 12_000;
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

  try {
    observer = new PerformanceObserver(() => {
      observer?.disconnect();
      globalThis.clearTimeout(fallbackTimer);
      start();
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // PerformanceObserver unsupported — rely on fallback timer only.
  }

  return () => {
    cancelled = true;
    globalThis.clearTimeout(fallbackTimer);
    observer?.disconnect();
  };
}
