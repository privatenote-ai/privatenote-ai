/**
 * Activates CSS preloaded with rel="preload" as="style" (non-render-blocking).
 * External file required: CSP script-src does not allow inline onload handlers.
 * Flip rel in place so the preloaded bytes are used (no second download).
 */
(function () {
  var links = document.querySelectorAll('link[rel="preload"][as="style"]');
  for (var i = 0; i < links.length; i++) {
    links[i].rel = "stylesheet";
  }
})();
