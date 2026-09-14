/**
 * prefill-guard.js
 *
 * Loaded with defer (runs before type=module, in document order) — still before
 * the Vite bundle executes. Pair with pn-critical CSS for first-paint colors.
 *
 * Goal: move the #text= secret out of window.location.hash and into
 * sessionStorage before anything else on the page can read it, then
 * immediately wipe the fragment from the browser address bar.
 *
 * React's usePrefillFromFragment hook reads from sessionStorage instead of
 * location.hash, and deletes the entry after the editor mount commits.
 */
(function () {
  var HOME_HERO = {
    en: {
      l1: "Your Messages,",
      l2: "Your Privacy",
      sub: "End-to-end encrypted notes that self-destruct after reading. More secure than alternatives, with client-side encryption ensuring your messages stay private.",
    },
    de: {
      l1: "Ihre Nachrichten,",
      l2: "Ihre Privatsphäre",
      sub: "Ende-zu-Ende-verschlüsselte Notizen, die sich nach dem Lesen selbst löschen. Sicherer als Alternativen, mit clientseitiger Verschlüsselung, damit Ihre Nachrichten privat bleiben.",
    },
    fr: {
      l1: "Vos messages,",
      l2: "votre vie privée",
      sub: "Des notes chiffrées de bout en bout qui s’autodétruisent après lecture. Plus sûr que les alternatives, avec un chiffrement côté client qui garde vos messages privés.",
    },
    es: {
      l1: "Tus mensajes,",
      l2: "tu privacidad",
      sub: "Notas cifradas de extremo a extremo que se autodestruyen después de leerse. Más seguras que las alternativas, con cifrado del lado del cliente para mantener privados tus mensajes.",
    },
    it: {
      l1: "I tuoi messaggi,",
      l2: "la tua privacy",
      sub: "Note crittografate end-to-end che si autodistruggono dopo la lettura. Piu sicure delle alternative, con crittografia lato client che mantiene privati i tuoi messaggi.",
    },
    nl: {
      l1: "Uw berichten,",
      l2: "uw privacy",
      sub: "End-to-end versleutelde notities die zichzelf vernietigen na het lezen. Veiliger dan alternatieven, met client-side versleuteling die uw berichten prive houdt.",
    },
  };

  function pathHomeLocale() {
    var seg = (location.pathname || "/").split("/").filter(Boolean)[0];
    if (seg === "de" || seg === "fr" || seg === "es" || seg === "it" || seg === "nl") return seg;
    return "en";
  }

  function isHomePath() {
    var p = location.pathname || "/";
    if (p === "/") return true;
    var seg = p.split("/").filter(Boolean)[0];
    var rest = p.split("/").filter(Boolean).slice(1);
    if (!seg || rest.length > 0) return false;
    return (
      seg === "de" ||
      seg === "fr" ||
      seg === "es" ||
      seg === "it" ||
      seg === "nl" ||
      seg === "pt" ||
      seg === "sr" ||
      seg === "hr" ||
      seg === "tr" ||
      seg === "pl"
    );
  }

  function applyHomeHeroPrerender() {
    var shell = document.getElementById("pn-home-prerender");
    if (!shell) return;
    if (!isHomePath()) {
      shell.remove();
      return;
    }
    var copy = HOME_HERO[pathHomeLocale()];
    if (copy && pathHomeLocale() !== "en") {
      var l1 = document.getElementById("pn-hero-l1");
      var l2 = document.getElementById("pn-hero-l2");
      var sub = document.getElementById("pn-hero-sub");
      if (l1) l1.textContent = copy.l1;
      if (l2) l2.textContent = copy.l2;
      if (sub) sub.textContent = copy.sub;
    }
    shell.removeAttribute("hidden");
  }

  try {
    var stored = localStorage.getItem("privatenote-theme");
    var prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    if (stored === "light") root.classList.add("light");
    else if (stored === "dark" || prefersDark) root.classList.add("dark");
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

  try {
    applyHomeHeroPrerender();
  } catch (_) {}
})();
