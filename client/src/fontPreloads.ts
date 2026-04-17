import interRoman from "./assets/fonts/Inter-VariableFont_opsz,wght.ttf?url";

/** Start font fetch before index.css @font-face so first paint matches final metrics more often. */
/** Roman only: italic is @font-face’d on demand; preloading both triggers Safari “preloaded but not used” warnings on first paint. */
for (const href of [interRoman]) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = "font/ttf";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
