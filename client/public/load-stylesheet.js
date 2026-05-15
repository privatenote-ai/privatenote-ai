/**
 * Activates CSS preloaded with rel="preload" as="style" (non-render-blocking).
 * External file required: CSP script-src does not allow inline onload handlers.
 */
(function () {
  var links = document.querySelectorAll('link[rel="preload"][as="style"]');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (!href) continue;
    var sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = href;
    document.head.appendChild(sheet);
  }
})();
