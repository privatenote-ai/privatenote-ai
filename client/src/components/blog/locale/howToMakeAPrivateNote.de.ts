import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteDe: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop auf einem Schreibtisch mit Bildschirm zum Erstellen einer privaten Notiz, Burn-after-reading und Ablaufzeit, daneben ein verschlossenes Ledernotizbuch",
  intro: [
    "Sie möchten etwas Sensibles schreiben—ein [Passwort](app:password-generator), einen Wiederherstellungscode, eine vertrauliche Nachricht oder eine persönliche Notiz—und es privat halten. Vielleicht haben Sie nach „how to make a note private“ gesucht und allgemeine Ratschläge gefunden, wie man eine App sperrt, einen lokalen Ordner versteckt oder eine Datenschutzeinstellung auf dem Gerät umschaltet.",
    "Diese Schritte helfen bei alltäglicher Privatsphäre vor neugierigen Blicken. Sie lösen **nicht** das schwierigere Problem: eine Notiz mit einer anderen Person zu teilen, ohne eine dauerhafte, durchsuchbare Kopie auf dem Server eines Drittanbieters zu hinterlassen.",
    "Eine wirklich private Notiz erfordert drei unterschiedliche Säulen: **Verschlüsselung vor dem Upload**, **strenge Zugriffskontrolle** und **geplante Ephemerität**—ein Mechanismus zum Verschwinden. So erreichen Sie das in der Praxis.",
  ],
  sections: [
    {
      title: "Was „privat“ wirklich bedeutet",
      paragraphs: [
        "In alltäglichen Anwendungen bedeutet „privat“ meist: verborgen vor anderen Personen, die Ihr Gerät in die Hand nehmen, geschützt durch einen Telefoncode oder hinter einem Premium-Abo gesperrt. Das ist sehr nützlich—aber nicht dasselbe wie kryptografische Privatsphäre.",
        "Wenn Sie sensible Informationen über das Web teilen, lautet die eigentliche Frage: **Wer kann die Notiz lesen, nachdem sie Ihre Hände verlassen hat?**",
        "Kann der Dienstanbieter sie lesen? Kann eine unbefugte Person mit Zugriff auf ein Cloud-Backup sie lesen? Kann ein zukünftiger Teamkollege alte Chat-Verläufe durchsuchen und sie Monate später finden?",
        "Eine private Notiz im strengen Sicherheitssinn ist eine, bei der nur der beabsichtigte Empfänger den Inhalt lesen kann, der Hosting-Dienst niemals den zugrunde liegenden Klartext sieht und die Notiz nicht ewig online bleibt.",
      ],
    },
    {
      title: "Warum gewöhnliche Notizen-Apps nicht ausreichen",
      paragraphs: [
        "Apple Notes, Google Keep, Notion und Evernote sind hervorragende Werkzeuge für persönliche Organisation, aber sie sind im Allgemeinen die falsche Wahl für die Weitergabe einmaliger Geheimnisse—aus mehreren inhärenten Gründen:",
      ],
      bullets: [
        "**Synchronisation und Backups** — Ihre Notiz wird stillschweigend auf mehrere Geräte, Cloud-Speicherkonten und langfristige Archivkopien kopiert, die Sie nicht direkt kontrollieren.",
        "**Suche und Freigabe** — Versehentliches öffentliches Teilen, breite Workspace-Suchen oder ein einzelnes kompromittiertes Konto können historische Notizen Monate später offenlegen.",
        "**Anbieterzugriff** — Sofern die App nicht ausdrücklich Ende-zu-Ende-Verschlüsselung für genau diese Notiz bietet, behält der Anbieter die technische Fähigkeit, Ihren Inhalt auf seinen Servern zu lesen.",
        "**Kein Burn-after-Reading** — Die meisten Organisations-Apps sind strukturell darauf ausgelegt, Informationen unbegrenzt zu speichern—not sie nach einmaligem Lesen zu löschen.",
      ],
      callout:
        "Für langfristiges persönliches Journaling sind Standard-Notizen-Apps ideal. Für Passwörter, Wiederherstellungscodes und vertrauliche Übergaben brauchen Sie ein ephemeres Tool für [einmalige Geheimniszustellung](blog:one-time-secret-links)—nicht für dauerhafte Speicherung.",
    },
    {
      title: "So erstellen Sie eine private Notiz: Schritt für Schritt",
      paragraphs: [
        "Sie brauchen kein Konto, um eine sichere, einmalige private Notiz zu senden. Der strukturierte Ablauf unten beschreibt, was browserverschlüsselte Dienste sicher ausführen sollen.",
      ],
      flowDiagramCaption: "Workflow für private Notizen auf einen Blick",
      flowSteps: [
        {
          step: "Schritt 1",
          title: "Nachricht im Browser verfassen",
          body: "Öffnen Sie [PrivateNote](app:home) und tippen Sie Ihre Nachricht direkt ein. Bereits in einem anderen Tab? Die [Chrome-Erweiterung](chrome:extension) verschlüsselt markierten Text direkt vor Ort—derselbe clientseitige Ablauf, ohne die Website zuerst zu öffnen. Vermeiden Sie es, das Rohtgeheimnis zuvor in Standard-E-Mail-Clients oder unverschlüsselte Text-Threads einzufügen. Sie können auch [Write with Private AI](app:home) nutzen, um lokal auf Ihrem Gerät zu entwerfen, bevor die Verschlüsselung erfolgt.",
        },
        {
          step: "Schritt 2",
          title: "Ephemere Datenschutzeinstellungen konfigurieren",
          body: "Legen Sie ein Ablaufzeitfenster fest, das zur Aufgabe passt. Aktivieren Sie Burn-after-Reading, wenn die Notiz nach dem ersten erfolgreichen Öffnen vollständig verschwinden soll, und fügen Sie optional eine Passphrase für besonders sensible Inhalte hinzu.",
        },
        {
          step: "Schritt 3",
          title: "Browser führt lokale Verschlüsselung aus",
          body: "Wenn Sie auf Erstellen klicken, erfolgt die Verschlüsselung vollständig clientseitig. Nur Chiffretext wird hochgeladen. Der Entschlüsselungsschlüssel bleibt im URL-Fragment eingebettet—dem Teil nach `#`—den moderne Webbrowser nicht an Hosting-Webserver übermitteln.",
        },
        {
          step: "Schritt 4",
          title: "Freigabekanäle trennen",
          body: "Übermitteln Sie den generierten sicheren Link über Ihren bevorzugten Kanal an den Empfänger. Wenn Sie ein manuelles Passwort konfiguriert haben, teilen Sie es out-of-band—per Telefonanruf, Signal oder sicher persönlich.",
        },
        {
          step: "Schritt 5",
          title: "Zustellung bestätigen und lokalen Zustand löschen",
          body: "Nutzen Sie optionale Zustellbenachrichtigungen, um zu prüfen, wann die Notiz erfolgreich geöffnet oder abgelaufen wurde. Nach dem Lesen bleibt keine Klartextkopie mehr in Ihrem Postausgang oder historischen Chat-Protokollen.",
        },
      ],
    },
    {
      title: "Datenschutzeinstellungen, die sich lohnen",
      paragraphs: [
        "Kleine architektonische Anpassungen bringen enorme Sicherheitsgewinne. Maximieren Sie Ihre Abwehr bei der Erstellung einer ephemeren Notiz mit diesen Konfigurationen:",
      ],
      bullets: [
        "**Burn-after-Reading** — Der Goldstandard für Passwörter und Zugangsdaten. Der zugrunde liegende Chiffretext wird vom Server gelöscht, sobald er einmal erfolgreich gelesen wurde.",
        "**Kurze Ablaufzeitfenster** — Wenn Ihr Empfänger die Daten nicht sofort öffnen muss, begrenzen Sie das Expositionsfenster auf Stunden oder Tage—niemals unbegrenzt.",
        "**Geschichtete Passwörter** — Fügt einen entscheidenden zweiten Faktor hinzu. Ein Angreifer müsste sowohl den Link-Transportkanal kompromittieren als auch das separate Passwort erlangen, um den Inhalt zu lesen.",
      ],
    },
    {
      title: "Was nicht in eine webbasierte private Notiz gehört",
      paragraphs: [
        "Browserverschlüsselte Links sind hervorragend für temporäre oder ersetzbare Geheimnisse—wie WLAN-Zugangsdaten, API-Token und vertrauliche Unternehmensnachrichten. Sie haben Grenzen.",
      ],
      callout:
        "**Kritische Sicherheitsregel:** Geben Sie niemals eine Kryptowährungs-Seed-Phrase, ein Master-Backup einer Hardware-Wallet oder einen Root-Private-Key auf einer Website ein. Unersetzbare Master-Assets rechtfertigen lokale terminalbasierte Verschlüsselung mit age oder OpenSSL vor der Übertragung. Für diese Architektur lesen Sie [Krypto-Seed-Phrasen und Einmal-Links](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Wann eine private Notiz das richtige Werkzeug ist",
      paragraphs: [
        "Greifen Sie zu einer dedizierten privaten Notiz statt zu Standard-E-Mail oder Chat-Tools, wenn Sie sensible Informationen übergeben:",
      ],
      table: [
        {
          dataType: "Zugangsdaten",
          scenario:
            "Weitergabe eines [Passworts oder Wiederherstellungscodes](blog:how-we-generate-passwords) an ein vertrauenswürdiges Familienmitglied oder einen Kollegen.",
        },
        {
          dataType: "Zugriffsschlüssel",
          scenario:
            "Verteilung eines [API-Schlüssels oder Webhook-Signaturgeheimnisses](blog:how-to-share-api-key-securely) beim Developer-Onboarding.",
        },
        {
          dataType: "Physischer Zugang",
          scenario:
            "Teilen temporärer Türcodes, Alarm-PINs oder Gast-WLAN-Zugangsdaten.",
        },
        {
          dataType: "Unternehmenskommunikation",
          scenario:
            "Senden einer vertraulichen Geschäftsnachricht, die nicht von [Unternehmens-Chat- oder E-Mail-Archiven](blog:workplace-texts-private-note) indexiert werden soll.",
        },
      ],
    },
    {
      title: "Unsere Philosophie bei PrivateNote",
      paragraphs: [
        "Wir haben PrivateNote so entwickelt, dass das Vertrauensgleichgewicht zurück zum Nutzer verschoben wird. Indem kryptografische Operationen vollständig in Ihrem Browser erfolgen, bevor die Nutzlast unsere Infrastruktur erreicht, bleiben unsere Server strukturell blind für Ihre Klartextgeheimnisse.",
        "Wir glauben auch an klare Transparenz bezüglich Produktgrenzen. Wenn Sie ein temporäres Zugriffstoken an einen Kollegen senden, ist ein verschlüsselter Einmal-Link ein hervorragendes Werkzeug. Wenn es um Ihre Lebensersparnisse geht, verschlüsseln Sie zuerst lokal auf einem Offline-Rechner.",
        "Sicherheit bedeutet nicht, ein magisches Einheitswerkzeug zu finden. Es geht darum, Ihren Workflow an den Wert dessen anzupassen, was Sie schützen. Für das technische Modell hinter der Browser-Verschlüsselung lesen Sie [wie PrivateNote funktioniert](app:how-it-works) und [was clientseitige Ende-zu-Ende-Verschlüsselung bedeutet](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Datentyp",
    scenario: "Ideales Freigabeszenario",
  },
  closingTitle: "Jetzt eine private Notiz erstellen",
  closingBody: [
    "Kein Konto erforderlich. Schreiben Sie Ihre Notiz, konfigurieren Sie Ihre Datenschutzeinstellungen und teilen Sie in unter einer Minute einen sicheren Link.",
  ],
  fileSharingNote:
    "Müssen Sie auch Dokumente teilen? [Sicherer Dateitransfer](app:secure-file-transfer) nutzt dasselbe browserseitige Verschlüsselungsmodell. Zum Senden ist ein kostenloses Konto erforderlich; Empfänger können Links ohne Anmeldung öffnen.",
  chromeExtensionNote:
    "Nutzen Sie PrivateNote häufig? Die [Chrome-Erweiterung](chrome:extension) bringt Verschlüsseln-und-Teilen in Ihre Symbolleiste oder das Kontextmenü—praktisch, wenn mitten in einem Gespräch ein Passwort oder API-Schlüssel auftaucht.",
  tagline: "Zuerst verschlüsseln. Link teilen. Ablaufen lassen.",
  relatedReading: "Weiterführende Artikel",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Burn-after-Reading-Links, das URL-Fragment und warum Ephemerität E-Mail oder Slack für einmalige Geheimnisse schlägt.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Warum E-Mail langfristige Kopien von Geheimnissen erzeugt—und womit Sie stattdessen vertrauliche Übergaben durchführen.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Ein sichererer Workflow für API-Schlüssel: eng begrenzen, lokal verschlüsseln, den Link senden—nicht das Rohtgeheimnis.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Was clientseitige E2EE wirklich bedeutet und wie sie sich von reiner Transportsicherheit unterscheidet.",
    },
  ],
};
