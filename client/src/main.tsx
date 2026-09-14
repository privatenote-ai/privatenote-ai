import { createRoot, hydrateRoot } from "react-dom/client";
import type { ReactElement } from "react";
import App from "./App";
import "./index.css";
import { isWebLlmGpuOrDisposeFailure } from "./utils/webLlmGpuErrors";
// LFM-style `<think>…</think>` stripping: `@shared/parseThinkingOutput` (used by client LLM / API).

if (import.meta.env.DEV) {
  void import("./utils/clientLLM").then((llm) => {
    window.__PRIVATE_NOTE_LLM_DEBUG = {
      getLoadedLocalModelId: llm.getLoadedLocalModelId,
      getModelInfo: llm.getModelInfo,
    };
  });
}

declare global {
  interface Window {
    /** Dev-only: Safari console → `__PRIVATE_NOTE_LLM_DEBUG.getLoadedLocalModelId()` */
    __PRIVATE_NOTE_LLM_DEBUG?: {
      getLoadedLocalModelId: () => string | null;
      getModelInfo: () => unknown;
    };
  }
}

/** MLC/WebGPU often emits many async rejections after device loss; avoid drowning the console. */
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (isWebLlmGpuOrDisposeFailure(event.reason)) {
      event.preventDefault();
      console.warn(
        "[PrivateNote][WebGPU] Suppressed follow-on rejection after GPU/device loss:",
        event.reason
      );
    }
  });

  /**
   * After a Pages deploy, a tab can keep an old HTML shell that points at hashed chunks
   * that no longer exist (404 → HTML). Safari then throws "Importing a module script failed."
   * Reload once so the browser picks up the new index + asset map.
   */
  const CHUNK_RELOAD_KEY = "pn:vite-chunk-reload-at";
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    try {
      const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || "0");
      if (Number.isFinite(last) && Date.now() - last < 15_000) return;
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    } catch {
      /* private mode / quota — still attempt one reload */
    }
    window.location.reload();
  });
}

/**
 * Prerendered marketing HTML is already the LCP paint. createRoot() would throw it
 * away and retimestamp LCP after JS on slow mobiles. Hydrate instead. Empty SPA
 * shells (/auth, /account, …) still client-render.
 */
function mountRoot(tree: ReactElement) {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    console.error("[PrivateNote] #root element not found");
    return;
  }
  if (rootEl.firstElementChild) {
    hydrateRoot(rootEl, tree);
  } else {
    createRoot(rootEl).render(tree);
  }
}

mountRoot(<App />);
