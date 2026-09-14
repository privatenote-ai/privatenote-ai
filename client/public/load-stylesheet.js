/**
 * Activates leftover deferred CSS from older HTML snapshots.
 * New builds keep the entry stylesheet render-blocking and do not inject this file.
 */
(function () {
  var deferred = document.querySelectorAll("link[data-pn-defer-css]");
  for (var i = 0; i < deferred.length; i++) {
    deferred[i].media = "all";
    deferred[i].removeAttribute("data-pn-defer-css");
  }
  var links = document.querySelectorAll('link[rel="preload"][as="style"]');
  for (var j = 0; j < links.length; j++) {
    links[j].rel = "stylesheet";
  }
})();
