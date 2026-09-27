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

/**
 * Defer auth session fetch until after initial load settles (and on first interaction).
 * LCP-based scheduling still runs too early for Lighthouse's critical-request chain.
 */
export function scheduleAuthSessionCheck(
  work: () => void,
  options?: { delayAfterLoadMs?: number },
): () => void {
  if (typeof window === "undefined") {
    work();
    return () => {};
  }

  const delayAfterLoadMs = options?.delayAfterLoadMs ?? 5_000;
  let cancelled = false;
  let done = false;
  const run = () => {
    if (cancelled || done) return;
    done = true;
    work();
  };

  const cancelInteract = scheduleOnFirstInteraction(run);

  let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;
  const startTimer = () => {
    if (cancelled || done) return;
    timeoutId = globalThis.setTimeout(run, delayAfterLoadMs);
  };

  if (document.readyState === "complete") {
    startTimer();
  } else {
    window.addEventListener("load", startTimer, { once: true });
  }

  return () => {
    cancelled = true;
    cancelInteract();
    if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    window.removeEventListener("load", startTimer);
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
