import "./fontPreloads";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// LFM-style `<redacted_thinking>…</redacted_thinking>` stripping: `@shared/parseThinkingOutput` (used by client LLM / API).

createRoot(document.getElementById("root")!).render(<App />);
