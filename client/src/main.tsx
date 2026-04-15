import "./fontPreloads";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getLoadedLocalModelId, getModelInfo } from "./utils/clientLLM";
// LFM-style `<think>…</think>` stripping: `@shared/parseThinkingOutput` (used by client LLM / API).

declare global {
  interface Window {
    /** Dev-only: Safari console → `__PRIVATE_NOTE_LLM_DEBUG.getLoadedLocalModelId()` */
    __PRIVATE_NOTE_LLM_DEBUG?: {
      getLoadedLocalModelId: typeof getLoadedLocalModelId;
      getModelInfo: typeof getModelInfo;
    };
  }
}

if (import.meta.env.DEV) {
  window.__PRIVATE_NOTE_LLM_DEBUG = { getLoadedLocalModelId, getModelInfo };
}

createRoot(document.getElementById("root")!).render(<App />);
