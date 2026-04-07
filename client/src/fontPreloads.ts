import interRoman from "./assets/fonts/Inter-VariableFont_opsz,wght.ttf?url";
import interItalic from "./assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf?url";

/** Start font fetch before index.css @font-face so first paint matches final metrics more often. */
for (const href of [interRoman, interItalic]) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = "font/ttf";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
