/**
 * prefill-guard.js
 *
 * Loaded as a synchronous (no async/defer) script in <head> — runs BEFORE
 * Turnstile, the Vite bundle, and any other third-party code.
 *
 * Goal: move the #text= secret out of window.location.hash and into
 * sessionStorage before anything else on the page can read it, then
 * immediately wipe the fragment from the browser address bar.
 *
 * React's usePrefillFromFragment hook reads from sessionStorage instead of
 * location.hash, and deletes the entry immediately after the first read.
 */
(function () {
  try {
    var stored = localStorage.getItem("privatenote-theme");
    var prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored === "dark" || (stored !== "light" && prefersDark);
    if (dark) document.documentElement.classList.add("dark");
  } catch (_) {}

  try {
    var h = window.location.hash;
    if (h && h.indexOf("#text=") === 0) {
      // Persist the raw fragment so React can parse it after mounting.
      sessionStorage.setItem("__pn_prefill_v1", h);
      // Wipe from URL — does not trigger a navigation or a history entry.
      history.replaceState(null, "", location.pathname + location.search);
    }
  } catch (_) {
    // sessionStorage blocked (e.g. third-party cookie restrictions in some
    // privacy-hardened browsers). React's hook will fall back to reading
    // location.hash directly via useLayoutEffect, which is less secure but
    // still functionally correct. Silent fail — do not log.
  }
})();
