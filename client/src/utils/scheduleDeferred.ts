/** Run work after first paint / when the browser is idle (falls back to a short timeout). */
export function scheduleDeferred(work: () => void, options?: { timeoutMs?: number }): () => void {
  if (typeof window === "undefined") {
    work();
    return () => {};
  }
  const timeoutMs = options?.timeoutMs ?? 2500;
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    work();
  };
  let cancelHandle: (() => void) | null = null;
  const schedule = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: timeoutMs });
      cancelHandle = () => window.cancelIdleCallback(id);
    } else {
      const id = globalThis.setTimeout(run, 1);
      cancelHandle = () => globalThis.clearTimeout(id);
    }
  };
  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
    cancelHandle = () => window.removeEventListener("load", schedule);
  }
  return () => {
    cancelled = true;
    cancelHandle?.();
  };
}

/** Run once on first user interaction (pointer or keyboard). */
export function scheduleOnFirstInteraction(work: () => void): () => void {
  if (typeof window === "undefined") {
    work();
    return () => {};
  }
  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    work();
    cleanup();
  };
  const opts: AddEventListenerOptions = { once: true, passive: true, capture: true };
  const cleanup = () => {
    window.removeEventListener("pointerdown", run, opts);
    window.removeEventListener("keydown", run, opts);
  };
  window.addEventListener("pointerdown", run, opts);
  window.addEventListener("keydown", run, opts);
  return cleanup;
}
