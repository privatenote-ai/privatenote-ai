function stringFromUnknownError(reason: unknown): string {
  if (reason == null) return "";
  if (typeof reason === "string") return reason;
  if (reason instanceof Error) return `${reason.name} ${reason.message}`;
  if (typeof DOMException !== "undefined" && reason instanceof DOMException) {
    return `${reason.name} ${reason.message}`;
  }
  if (typeof reason === "object" && reason !== null) {
    const r = reason as { name?: unknown; message?: unknown; toString?: () => unknown };
    if ("message" in r || "name" in r) {
      return `${r.name != null ? String(r.name) : ""} ${r.message != null ? String(r.message) : ""}`.trim();
    }
    try {
      const ts = r.toString?.call(reason);
      if (typeof ts === "string" && ts.length > 0 && !/^\[object \w+]$/.test(ts)) {
        return ts;
      }
    } catch {
      /* ignore */
    }
  }
  try {
    return String(reason);
  } catch {
    return "";
  }
}

/**
 * Detect WebLLM / WebGPU fatal errors (device loss, memory pressure) and Safari/WASM dispose bugs.
 * Used for clearing stale engine state, skipping doomed fallbacks, and filtering noisy follow-on rejections.
 */
export function isWebLlmGpuOrDisposeFailure(error: unknown): boolean {
  const raw = stringFromUnknownError(error);
  const msg = raw.toLowerCase();
  const fallback = String(error).toLowerCase();
  const combined = msg || fallback;

  const name =
    error instanceof Error
      ? error.name.toLowerCase()
      : typeof DOMException !== "undefined" && error instanceof DOMException
        ? error.name.toLowerCase()
        : "";

  return (
    combined.includes("disposed") ||
    combined.includes("device was lost") ||
    combined.includes("device lost") ||
    combined.includes("gpudevicelost") ||
    combined.includes("gpudevicelostinfo") ||
    combined.includes("gpu device lost") ||
    (combined.includes("webgpu") && combined.includes("lost")) ||
    name.includes("binding") ||
    combined.includes("bindingerror") ||
    combined.includes("tokenizer") ||
    combined.includes("cannot pass deleted object") ||
    combined.includes("deleted object") ||
    combined.includes("poperrorscope") ||
    combined.includes("map async was not successful") ||
    combined.includes("mapasync") ||
    (name === "operationerror" &&
      (combined.includes("poperrorscope") || combined.includes("map async") || combined.includes("mapasync")))
  );
}
