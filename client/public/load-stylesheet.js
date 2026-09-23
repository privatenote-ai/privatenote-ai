/**
 * Applies the deferred homepage stylesheet, then lets #root back into flow.
 * No-op when the entry CSS is already render-blocking.
 */
(function () {
  function markReady() {
    document.documentElement.classList.add("pn-css-ready");
  }

  var deferred = document.querySelectorAll("link[data-pn-defer-css]");
  if (!deferred.length) {
    markReady();
  } else {
    var pending = deferred.length;
    var finish = function (link) {
      link.media = "all";
      link.removeAttribute("data-pn-defer-css");
      pending -= 1;
      if (pending <= 0) markReady();
    };
    for (var i = 0; i < deferred.length; i++) {
      (function (link) {
        var settled = false;
        var done = function () {
          if (settled) return;
          settled = true;
          finish(link);
        };
        link.addEventListener("load", done);
        link.addEventListener("error", done);
        link.media = "all";
        if (link.sheet) done();
      })(deferred[i]);
    }
  }

  var links = document.querySelectorAll('link[rel="preload"][as="style"]');
  for (var j = 0; j < links.length; j++) {
    if (links[j].getAttribute("data-pn-defer-css") != null) continue;
    if (document.querySelector('link[rel="stylesheet"][href="' + links[j].getAttribute("href") + '"]')) {
      continue;
    }
    links[j].rel = "stylesheet";
  }
})();
