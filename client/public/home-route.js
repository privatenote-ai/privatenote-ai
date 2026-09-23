/**
 * Runs in <head> without defer so html.pn-home-route exists before first paint.
 * That lets the homepage hero stub show immediately (no blank → hero jump).
 * Keep this file tiny: it is render-blocking.
 */
(function () {
  var p = location.pathname || "/";
  if (p === "/" || /^\/(de|fr|es|it|nl|pt|sr|hr|tr|pl)\/?$/.test(p)) {
    document.documentElement.classList.add("pn-home-route");
  }
})();
