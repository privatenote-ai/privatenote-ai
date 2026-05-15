import interRoman from "./assets/fonts/Inter-VariableFont_opsz,wght.ttf?url";
import { scheduleDeferred } from "@/utils/scheduleDeferred";

/** Defer Inter preload so it does not compete with LCP (font-display: optional in CSS). */
export function scheduleFontPreloads(): void {
  scheduleDeferred(
    () => {
      for (const href of [interRoman]) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "font";
        link.type = "font/ttf";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    },
    { timeoutMs: 5000 },
  );
}
