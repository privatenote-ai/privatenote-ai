import interRoman from "./assets/fonts/Inter-VariableFont_opsz,wght.ttf?url";

/** Preload Inter early so metrics match before first paint (pairs with font-display: optional). */
for (const href of [interRoman]) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = "font/ttf";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
