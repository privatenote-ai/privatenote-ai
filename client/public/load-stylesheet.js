/**
 * Activates CSS deferred with media="not all" (non-render-blocking).
 * External file required: CSP script-src does not allow inline onload handlers.
 * Prefer flipping media in place so the preloaded bytes are used (no second download).
 */
(function () {
  var deferred = document.querySelectorAll("link[data-pn-defer-css]");
  if (deferred.length) {
    for (var i = 0; i < deferred.length; i++) {
      deferred[i].media = "all";
      deferred[i].removeAttribute("data-pn-defer-css");
    }
    return;
  }
  var preloads = document.querySelectorAll('link[rel="preload"][as="style"]');
  for (var j = 0; j < preloads.length; j++) {
    preloads[j].rel = "stylesheet";
  }
})();
