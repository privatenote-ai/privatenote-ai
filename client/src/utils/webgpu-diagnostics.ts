/**
 * WebGPU adapter probing and structured diagnostics for Safari / iOS field debugging.
 * `navigator.gpu` can exist while `requestAdapter()` still returns null (policy, GPU process, or options).
 *
 * `maxStorageBufferBindingSize` (surfaced in adapter summaries) is one WebGPU limit among many. Callers
 * that choose local LLM models should treat it as a **negative filter** (e.g. avoid leading with large
 * models when the limit is very low), not as total VRAM or a guarantee that a given model will run or
 * stay stable under tab memory pressure, KV growth, or driver quirks.
 */

const GPU_LOG = "[PrivateNote][WebGPU]";

type RequestAdapterOptions = {
  powerPreference?: "low-power" | "high-performance";
  forceFallbackAdapter?: boolean;
};

export type WebGpuAdapterAttempt = {
  label: string;
  options: RequestAdapterOptions | null;
  outcome: "adapter" | "null" | "threw";
  summary?: Record<string, unknown>;
  error?: string;
};

export type WebGpuDiagnosticsReport = {
  capturedAt: string;
  environment: Record<string, unknown>;
  attempts: WebGpuAdapterAttempt[];
  /** Only run when no hardware adapter was returned from standard attempts. */
  fallbackAttempt: WebGpuAdapterAttempt | null;
  /** First successful adapter from default / powerPreference attempts (never forceFallback). */
  firstHardwareAdapterLabel: string | null;
  /** True when `gpu` exists but every standard attempt was null/threw and only fallback worked. */
  hardwareDeniedButFallbackWorked: boolean;
};

function iosWebKitLikely(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function collectWebGpuEnvironment(): Record<string, unknown> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { window: false };
  }
  const gpu = navigator.gpu;
  return {
    secureContext: window.isSecureContext,
    hostname: window.location.hostname,
    visibilityState: typeof document !== "undefined" ? document.visibilityState : undefined,
    standalonePwa:
      typeof (navigator as Navigator & { standalone?: boolean }).standalone === "boolean"
        ? Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
        : undefined,
    iosWebKitLikely: iosWebKitLikely(),
    hasNavigatorGpu: Boolean(gpu),
    hasRequestAdapter: typeof gpu?.requestAdapter === "function",
    userAgentSnippet: String(navigator.userAgent).slice(0, 160),
  };
}

function summarizeAdapter(adapter: unknown): Record<string, unknown> {
  if (adapter == null || typeof adapter !== "object") {
    return { present: false };
  }
  const a = adapter as Record<string, unknown>;
  const limits = a.limits as Record<string, number | undefined> | undefined;
  const features = a.features as Set<string> | undefined;
  let featureSample: string[] | undefined;
  if (features && typeof features.values === "function") {
    try {
      featureSample = [...features].slice(0, 24);
    } catch {
      featureSample = undefined;
    }
  }
  const info = a.info as Record<string, string | undefined> | undefined;
  const out: Record<string, unknown> = {
    present: true,
    isFallbackAdapter: typeof a.isFallbackAdapter === "boolean" ? a.isFallbackAdapter : undefined,
    maxStorageBufferBindingSize: limits?.maxStorageBufferBindingSize,
    maxBufferSize: limits?.maxBufferSize,
    maxComputeWorkgroupStorageSize: limits?.maxComputeWorkgroupStorageSize,
  };
  if (info && typeof info === "object") {
    out.vendor = info.vendor;
    out.architecture = info.architecture;
    out.device = info.device;
    out.description = info.description;
  }
  if (featureSample?.length) out.featureSample = featureSample;
  return out;
}

function emitReportToConsole(report: WebGpuDiagnosticsReport, adapterResolved: boolean): void {
  console.warn(GPU_LOG, "diagnostics", {
    adapterResolved,
    firstHardwareAdapterLabel: report.firstHardwareAdapterLabel,
    hardwareDeniedButFallbackWorked: report.hardwareDeniedButFallbackWorked,
    environment: report.environment,
  });
  for (const a of report.attempts) {
    console.warn(GPU_LOG, "attempt", a);
  }
  if (report.fallbackAttempt) {
    console.warn(GPU_LOG, "fallback (diagnostic only — not used for WebLLM)", report.fallbackAttempt);
  }
}

/**
 * Request a hardware WebGPU adapter using the same retry order as local LLM init.
 * Does not return forceFallbackAdapter results for production use.
 */
export async function requestWebGpuAdapterWithRetries(options?: {
  /** When false, skips console noise (e.g. GPU limit prime). Default true. */
  logToConsole?: boolean;
}): Promise<unknown | null> {
  const { adapter, report } = await probeWebGpuForLocalLlm({ logToConsole: options?.logToConsole ?? true });
  void report;
  return adapter;
}

/**
 * Full probe: environment snapshot, multiple `requestAdapter` attempts, optional fallback-only probe.
 * Use from QA UI or when init fails.
 */
export async function probeWebGpuForLocalLlm(options?: {
  logToConsole?: boolean;
}): Promise<{ adapter: unknown | null; report: WebGpuDiagnosticsReport }> {
  const logToConsole = options?.logToConsole ?? true;
  const environment = collectWebGpuEnvironment();
  const attempts: WebGpuAdapterAttempt[] = [];
  let firstHardwareAdapterLabel: string | null = null;
  let adapter: unknown | null = null;

  const gpu = typeof navigator !== "undefined" ? navigator.gpu : undefined;
  if (!gpu?.requestAdapter) {
    const report: WebGpuDiagnosticsReport = {
      capturedAt: new Date().toISOString(),
      environment,
      attempts: [],
      fallbackAttempt: null,
      firstHardwareAdapterLabel: null,
      hardwareDeniedButFallbackWorked: false,
    };
    if (logToConsole) {
      console.warn(GPU_LOG, "navigator.gpu.requestAdapter missing", environment);
    }
    return { adapter: null, report };
  }

  const sequence: Array<{ label: string; options?: RequestAdapterOptions }> = [
    { label: "default", options: undefined },
    { label: "powerPreference: high-performance", options: { powerPreference: "high-performance" } },
    { label: "powerPreference: low-power", options: { powerPreference: "low-power" } },
  ];

  for (const { label, options } of sequence) {
    try {
      const a = await gpu.requestAdapter(options as object);
      if (a != null) {
        const summary = summarizeAdapter(a);
        attempts.push({ label, options: options ?? null, outcome: "adapter", summary });
        adapter = a;
        firstHardwareAdapterLabel = label;
        break;
      }
      attempts.push({ label, options: options ?? null, outcome: "null" });
    } catch (e) {
      attempts.push({
        label,
        options: options ?? null,
        outcome: "threw",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  let fallbackAttempt: WebGpuAdapterAttempt | null = null;
  let hardwareDeniedButFallbackWorked = false;

  if (adapter == null) {
    try {
      const fb = await gpu.requestAdapter({ forceFallbackAdapter: true } as object);
      if (fb != null) {
        hardwareDeniedButFallbackWorked = true;
        const summary = summarizeAdapter(fb);
        fallbackAttempt = {
          label: "forceFallbackAdapter: true (diagnostic)",
          options: { forceFallbackAdapter: true },
          outcome: "adapter",
          summary,
        };
      } else {
        fallbackAttempt = {
          label: "forceFallbackAdapter: true (diagnostic)",
          options: { forceFallbackAdapter: true },
          outcome: "null",
        };
      }
    } catch (e) {
      fallbackAttempt = {
        label: "forceFallbackAdapter: true (diagnostic)",
        options: { forceFallbackAdapter: true },
        outcome: "threw",
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  const report: WebGpuDiagnosticsReport = {
    capturedAt: new Date().toISOString(),
    environment,
    attempts,
    fallbackAttempt,
    firstHardwareAdapterLabel,
    hardwareDeniedButFallbackWorked,
  };

  if (logToConsole) {
    emitReportToConsole(report, adapter != null);
    if (adapter == null) {
      console.warn(
        GPU_LOG,
        "JSON (copy for bug reports)",
        JSON.stringify(report, null, 2),
      );
    }
  }

  return { adapter, report };
}

export async function collectWebGpuDiagnosticsJson(): Promise<string> {
  const { report } = await probeWebGpuForLocalLlm({ logToConsole: false });
  return JSON.stringify(report, null, 2);
}

/** Check if the first hardware adapter advertises `shader-f16`. Null when no adapter. */
export async function detectShaderF16Support(): Promise<boolean | null> {
  const adapter = await requestWebGpuAdapterWithRetries({ logToConsole: false });
  if (adapter == null || typeof adapter !== "object" || !("features" in adapter)) {
    return null;
  }
  const features = (adapter as { features?: { has?: (k: string) => boolean } }).features;
  if (!features || typeof features.has !== "function") return false;
  try {
    return features.has("shader-f16") === true;
  } catch {
    return false;
  }
}
