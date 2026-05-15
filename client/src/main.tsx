import { scheduleFontPreloads } from "./fontPreloads";
import { createRoot } from "react-dom/client";
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
}

scheduleFontPreloads();
createRoot(document.getElementById("root")!).render(<App />);
