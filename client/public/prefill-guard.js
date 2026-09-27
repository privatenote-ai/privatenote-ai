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
 *
 * Home hero copy must match client/src/utils/translations (mobile + desktop)
 * so unhiding #pn-home-prerender does not change line count (CLS).
 */
(function () {
  var HOME_HERO = {
    en: {
      l1: "Your Messages,",
      l2: "Your Privacy",
      sub: "Share passwords, sensitive messages, and files via end-to-end encrypted links that disappear after opening. No recipient accounts. No ads. Zero profiling.",
      subMobile: "Encrypted notes and files that disappear.",
      write: "Write",
      privateAi: "Private AI",
      writeWithPrivateAi: "Write with Private AI",
      typeHere: "Type your confidential message here...",
      share: "Share Private Note",
      attach: "Attach",
      recordAudio: "Record audio",
      recordVideo: "Record video",
    },
    de: {
      l1: "Ihre Nachrichten,",
      l2: "Ihre Privatsphäre",
      sub: "Teilen Sie Passwörter, sensible Nachrichten und Dateien über Ende-zu-Ende-verschlüsselte Links, die nach dem Öffnen verschwinden. Keine Empfängerkonten. Keine Werbung. Kein Profiling.",
      subMobile: "Verschlüsselte Notizen und Dateien, die verschwinden.",
      write: "Schreiben",
      privateAi: "Private AI",
      writeWithPrivateAi: "Mit Private AI schreiben",
      typeHere: "Geben Sie hier Ihre vertrauliche Nachricht ein...",
      share: "Private Notiz teilen",
      attach: "Anhängen",
      recordAudio: "Audio aufnehmen",
      recordVideo: "Video aufnehmen",
    },
    fr: {
      l1: "Vos messages,",
      l2: "votre vie privée",
      sub: "Partagez mots de passe, messages sensibles et fichiers via des liens chiffrés de bout en bout qui disparaissent après ouverture. Pas de compte destinataire. Pas de publicité. Zéro profilage.",
      subMobile: "Notes et fichiers chiffrés qui disparaissent.",
      write: "Écrire",
      privateAi: "Private AI",
      writeWithPrivateAi: "Écrire avec Private AI",
      typeHere: "Tapez votre message confidentiel ici...",
      share: "Partager la note privée",
      attach: "Joindre",
      recordAudio: "Enregistrer l’audio",
      recordVideo: "Enregistrer une vidéo",
    },
    es: {
      l1: "Tus mensajes,",
      l2: "tu privacidad",
      sub: "Comparte contraseñas, mensajes sensibles y archivos mediante enlaces cifrados de extremo a extremo que desaparecen al abrirlos. Sin cuentas para destinatarios. Sin anuncios. Cero perfilado.",
      subMobile: "Notas y archivos cifrados que desaparecen.",
      write: "Escribir",
      privateAi: "Private AI",
      writeWithPrivateAi: "Escribir con Private AI",
      typeHere: "Escribe aquí tu mensaje confidencial...",
      share: "Compartir nota privada",
      attach: "Adjuntar",
      recordAudio: "Grabar audio",
      recordVideo: "Grabar vídeo",
    },
    it: {
      l1: "I tuoi messaggi,",
      l2: "la tua privacy",
      sub: "Condividi password, messaggi sensibili e file tramite link cifrati end-to-end che scompaiono dopo l'apertura. Nessun account per i destinatari. Niente pubblicità. Zero profilazione.",
      subMobile: "Note e file cifrati che scompaiono.",
      write: "Scrivi",
      privateAi: "IA privata",
      writeWithPrivateAi: "Scrivi con l'intelligenza artificiale privata",
      typeHere: "Scrivi qui il tuo messaggio confidenziale...",
      share: "Condividi nota privata",
      attach: "Allega",
      recordAudio: "Registra audio",
      recordVideo: "Registra video",
    },
    nl: {
      l1: "Jouw berichten,",
      l2: "jouw privacy",
      sub: "Deel wachtwoorden, gevoelige berichten en bestanden via end-to-end versleutelde links die na opening verdwijnen. Geen accounts voor ontvangers. Geen advertenties. Geen profilering.",
      subMobile: "Versleutelde notities en bestanden die verdwijnen.",
      write: "Schrijven",
      privateAi: "Privé AI",
      writeWithPrivateAi: "Schrijf met Private AI",
      typeHere: "Typ hier uw vertrouwelijke bericht...",
      share: "Deel privénotitie",
      attach: "Bijvoegen",
      recordAudio: "Audio opnemen",
      recordVideo: "Video opnemen",
    },
    pt: {
      l1: "Suas mensagens,",
      l2: "Sua privacidade",
      sub: "Compartilhe senhas, mensagens sensíveis e arquivos por meio de links criptografados de ponta a ponta que desaparecem após a abertura. Sem contas para destinatários. Sem anúncios. Zero criação de perfil.",
      subMobile: "Notas e arquivos criptografados que desaparecem.",
      write: "Escrever",
      privateAi: "IA privada",
      writeWithPrivateAi: "Escrever com IA privada",
      typeHere: "Digite sua mensagem confidencial aqui...",
      share: "Compartilhar nota privada",
      attach: "Anexar",
      recordAudio: "Gravar áudio",
      recordVideo: "Gravar vídeo",
    },
    sr: {
      l1: "Vaše poruke,",
      l2: "Vaša privatnost",
      sub: "Delite lozinke, osetljive poruke i fajlove putem end-to-end šifrovanih linkova koji nestaju nakon otvaranja. Bez naloga za primaoca. Bez oglasa. Nula profilisanja.",
      subMobile: "Šifrovane poruke i datoteke koje nestaju.",
      write: "Pišite",
      privateAi: "Privatna AI",
      writeWithPrivateAi: "Pišite uz privatnu AI",
      typeHere: "Unesite svoju poverljivu poruku ovde...",
      share: "Podelite privatnu poruku",
      attach: "Priloži",
      recordAudio: "Snimite audio",
      recordVideo: "Snimite video",
    },
    hr: {
      l1: "Vaše poruke,",
      l2: "Vaša privatnost",
      sub: "Podijelite lozinke, osjetljive poruke i datoteke putem end-to-end šifriranih poveznica koje nestaju nakon otvaranja. Bez računa za primatelje. Bez oglasa. Nula profiliranja.",
      subMobile: "Šifrirane bilješke i datoteke koje nestaju.",
      write: "Pisati",
      privateAi: "Privatna AI",
      writeWithPrivateAi: "Pišite uz privatnu AI",
      typeHere: "Ovdje upišite svoju povjerljivu poruku...",
      share: "Podijelite privatnu bilješku",
      attach: "Priloži",
      recordAudio: "Snimi audio",
      recordVideo: "Snimi video",
    },
    tr: {
      l1: "Mesajlarınız,",
      l2: "Gizliliğiniz",
      sub: "Şifreleri, hassas mesajları ve dosyaları açıldıktan sonra kaybolan uçtan uca şifreli bağlantılarla paylaşın. Alıcı hesabı yok. Reklam yok. Profilleme yok.",
      subMobile: "Kaybolan şifreli notlar ve dosyalar.",
      write: "Yazın",
      privateAi: "Private AI",
      writeWithPrivateAi: "Private AI ile yazın",
      typeHere: "Gizli mesajınızı buraya yazın...",
      share: "Özel notu paylaş",
      attach: "Ekle",
      recordAudio: "Ses kaydet",
      recordVideo: "Video kaydet",
    },
    pl: {
      l1: "Twoje wiadomości,",
      l2: "Twoja prywatność",
      sub: "Udostępniaj hasła, poufne wiadomości i pliki przez szyfrowane end-to-end linki, które znikają po otwarciu. Bez kont odbiorców. Bez reklam. Zero profilowania.",
      subMobile: "Szyfrowane notatki i pliki, które znikają.",
      write: "Napisz",
      privateAi: "Private AI",
      writeWithPrivateAi: "Pisz z Private AI",
      typeHere: "Wpisz tu poufną wiadomość...",
      share: "Udostępnij prywatną notatkę",
      attach: "Dołącz",
      /* pl has no recordAudio/recordVideo yet — CreateNote falls back to English too. */
      recordAudio: "Record audio",
      recordVideo: "Record video",
    },
  };

  var HOME_LOCALES = "de|fr|es|it|nl|pt|sr|hr|tr|pl";

  function pathHomeLocale() {
    var seg = (location.pathname || "/").split("/").filter(Boolean)[0];
    if (seg && HOME_HERO[seg]) return seg;
    return "en";
  }

  function isHomePath() {
    var p = location.pathname || "/";
    if (p === "/") return true;
    return new RegExp("^/(" + HOME_LOCALES + ")/?$").test(p);
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyHomeHeroPrerender() {
    var shell = document.getElementById("pn-home-prerender");
    if (!shell) return;
    if (!isHomePath()) {
      shell.remove();
      return;
    }
    var copy = HOME_HERO[pathHomeLocale()] || HOME_HERO.en;
    setText("pn-hero-l1", copy.l1);
    setText("pn-hero-l2", copy.l2);
    setText("pn-hero-l1-wide", copy.l1);
    setText("pn-hero-l2-wide", copy.l2);
    setText("pn-hero-sub-narrow", copy.subMobile);
    setText("pn-hero-sub-wide", copy.sub);
    // Back-compat if an older snapshot still has a single subtitle node.
    setText("pn-hero-sub", copy.subMobile);
    setText("pn-editor-tab-write", copy.write || "Write");
    setText("pn-editor-tab-ai", copy.privateAi || "Private AI");
    setText("pn-editor-tab-ai-wide", copy.writeWithPrivateAi || "Write with Private AI");
    setText("pn-editor-placeholder", copy.typeHere || "Type your confidential message here...");
    setText("pn-editor-share", copy.share || "Share Private Note");
    setText("pn-editor-attach", copy.attach || "Attach");
    setText("pn-editor-record-audio", copy.recordAudio || "Record audio");
    setText("pn-editor-record-video", copy.recordVideo || "Record video");
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
