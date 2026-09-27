/**
 * Lightweight on-device AI capability checks for UI and routing.
 * Does not import WebLLM, Transformers.js, or model policy modules (keeps the main bundle small).
 */

export type WebLLMBrowserSupportLevel = "unsupported" | "missing-webgpu" | "supported";

const TRANSFORMERS_DESKTOP_MAC_DEV_FLAG = (() => {
  const v = import.meta.env.VITE_TRANSFORMERS_DESKTOP_MAC_DEV;
  if (v === undefined || v === null) return false;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
})();

export const TRANSFORMERS_MOBILE_IOS_DISABLED_REASON =
  "Local mobile inference is disabled on iOS due to current WebGPU/WASM runtime limitations.";

function isLocalhostOrSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

export function isIOSWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS;
}

export function isDesktopMacAgentLikely(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!/Macintosh/i.test(navigator.userAgent)) return false;
  if (isIOSWebKit()) return false;
  return true;
}

/** Optional Mac desktop dev path only (`VITE_TRANSFORMERS_DESKTOP_MAC_DEV`). */
export function shouldUseTransformersJsLocalPath(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return TRANSFORMERS_DESKTOP_MAC_DEV_FLAG && isDesktopMacAgentLikely();
}

export function isTransformersMobileLikelySupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (isIOSWebKit()) return false;
  return typeof indexedDB !== "undefined" && typeof WebAssembly !== "undefined";
}

export function getWebLLMBrowserSupportLevel(): WebLLMBrowserSupportLevel {
  if (typeof window === "undefined") return "unsupported";
  if (!isLocalhostOrSecureContext()) return "unsupported";
  if (!("crypto" in window) || !("indexedDB" in window)) return "unsupported";
  if (typeof WebAssembly === "undefined") return "unsupported";
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return "missing-webgpu";
  }
  return "supported";
}

export function isWebLLMSupported(): boolean {
  return getWebLLMBrowserSupportLevel() === "supported";
}

export function getWebLLMSupportHint(): string | null {
  const level = getWebLLMBrowserSupportLevel();
  if (level === "supported") return null;
  if (typeof window !== "undefined" && !window.isSecureContext) {
    const h = window.location.hostname;
    if (h !== "localhost" && h !== "127.0.0.1") {
      return "On-device AI needs a secure context. Open this site over HTTPS (localhost is OK).";
    }
  }
  if (level === "missing-webgpu") {
    return "On-device AI needs WebGPU. Use a recent Chrome, Edge, or Safari version, or another device with WebGPU enabled.";
  }
  return "On-device AI needs a modern browser with WebAssembly, IndexedDB, and Web Crypto.";
}

/**
 * Sync UI gate for offering on-device AI. Does not reflect GPU binding probes
 * ({@link import("./clientLLM").isLocalAiSupported} after model policy is primed).
 */
export function isLocalAiSupported(): boolean {
  if (shouldUseTransformersJsLocalPath()) {
    return isTransformersMobileLikelySupported();
  }
  return isWebLLMSupported();
}

export function getLocalAiSupportHint(): string | null {
  if (typeof window === "undefined") return null;
  if (shouldUseTransformersJsLocalPath() && isIOSWebKit()) {
    return `${TRANSFORMERS_MOBILE_IOS_DISABLED_REASON} Use cloud AI or a desktop browser.`;
  }
  if (shouldUseTransformersJsLocalPath() && !isTransformersMobileLikelySupported()) {
    return "On-device AI is not supported in this browser.";
  }
  return getWebLLMSupportHint();
}
