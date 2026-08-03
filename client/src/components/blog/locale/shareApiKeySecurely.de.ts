import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyDe: ShareApiKeyArticleCopy = {
  heroAlt: "Zwei Laptops tauschen einen API-Schlüssel über einen einmaligen verschlüsselten PrivateNote-Link aus",
  heroCaption: "Illustration erstellt für PrivateNote.ai.",
  takeawaysHeading: "Wichtigste Punkte",
  takeaways: [
    "API-Schlüssel nie in E-Mail, Chat, Tickets, Dokumente oder Git einfügen.",
    "Engstmöglichen Schlüssel nutzen: Least Privilege, kurze Laufzeit, danach rotieren.",
    "Geheimnisse über einen browserverschlüsselten Einmallink senden.",
    "Bei hochriskanten Keys zuerst lokal verschlüsseln; nur Ciphertext teilen.",
    "Nach dem Teilen auf ungewöhnliche Nutzung achten—PrivateNote ist Übergabe, kein Vault.",
  ],
  intro:
    "Jeder Entwickler muss irgendwann einen API-Schlüssel an jemand anderen senden—für Staging-Zugang, einen Auftragnehmer, eine Webhook-Integration oder eine Kundenübergabe. Der schnellste Weg ist meist auch der, der die längste Spur hinterlässt.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord oder anderer Chat-Verlauf",
    "E-Mail, SMS oder weitergeleitete Postfach-Threads",
    "Jira, Trello, Notion, Confluence oder GitHub-Issues",
    "Klartext-Dokumente, Tabellen und geteilte Cloud-Ordner",
    "Git-Commits, Pull Requests und Code-Kommentare",
  ],
  leakSources: [
    {
      title: "E-Mail",
      body: "E-Mail erzeugt langlebige Kopien. Ein Schlüssel kann in Postfächern, Archiven, Backups, mobiler Synchronisation, weitergeleiteten Threads und Suchindizes überleben—lange nachdem die Aufgabe erledigt ist.",
    },
    {
      title: "Team-Chat",
      body: "Slack und Teams bewahren Kontext—was sie riskant für Geheimnisse macht. Ein eingefügter Schlüssel kann für künftige Workspace-Mitglieder durchsuchbar werden oder über ein kompromittiertes Gerät durchsickern.",
    },
    {
      title: "Projekttools",
      body: "Jira, Notion, Confluence, Trello und GitHub Issues sind keine Credential-Tresore. Gelöschte Tickets können in Exporten, Backups, Audit-Trails und KI-gestützter Suche weiterexistieren.",
    },
    {
      title: "Git-Repositories",
      body: "Git-Historie klebt. Ein Schlüssel in einem späteren Commit zu entfernen löscht frühere Commits nicht. Öffentliche Repos werden ständig gescannt, und exponierte Cloud-Zugangsdaten können innerhalb von Minuten missbraucht werden.",
    },
  ],
  prepSteps: [
    {
      title: "Kleinstmöglichen Umfang nutzen",
      body: "Vermeiden Sie primäre Produktions-Schlüssel. Bevorzugen Sie Staging-Schlüssel, Nur-Lese-Berechtigungen, IP-Beschränkungen, kurzlebige Tokens und integrationsspezifische Zugangsdaten.",
    },
    {
      title: "Rotation oder Widerruf planen",
      body: "Behandeln Sie geteilte API-Schlüssel als temporär. Widerrufen Sie sie nach Onboarding, Tests, Auftragnehmer-Einsatz oder Kundenübergabe.",
    },
    {
      title: "Nutzungsmuster beobachten",
      body: "Unerwartete Standorte, plötzliche Request-Spitzen, neue Endpunkte oder ungewöhnliche Abrechnung sind oft die ersten Anzeichen, dass ein Schlüssel entwichen ist.",
    },
    {
      title: "Über verschlüsselten Einmal-Link liefern",
      body: "Verschlüsseln Sie den Schlüssel lokal, bevor er einen Kommunikationskanal betritt. Senden Sie einen kurzlebigen Link statt das Rohgeheimnis im dauerhaften Chat- oder E-Mail-Verlauf zu hinterlassen.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Schlüssel einschränken", detail: "Nur minimale Berechtigungen" },
    { key: "encrypt", label: "Lokal verschlüsseln", detail: "Schlüssel verlässt Ihren Browser nie" },
    { key: "send", label: "Link senden", detail: "Nicht das Rohgeheimnis" },
    { key: "revoke", label: "Nach Nutzung widerrufen", detail: "Nach Übergabe rotieren" },
  ],
  faqs: [
    {
      question: "Warum nicht einfach eine Umgebungsvariable?",
      answer:
        "Umgebungsvariablen eignen sich gut für lokale Software. Sie lösen nicht das Transportproblem, wenn Sie den Wert an einen Kollegen, Auftragnehmer, Kunden oder Integrationspartner übergeben müssen.",
    },
    {
      question: "Sollten API-Schlüssel immer ablaufen?",
      answer:
        "Wenn der Anbieter es unterstützt: ja. Kurzlebige Zugangsdaten verkleinern das Missbrauchsfenster nach versehentlicher Offenlegung und machen Rotation zum normalen Ablauf.",
    },
    {
      question: "Was ist der sicherste Workflow?",
      answer:
        "Erstellen Sie einen eng begrenzten Schlüssel, senden Sie ihn über einen browserverschlüsselten Einmal-Link, teilen Sie ein optionales Passwort über einen separaten Kanal und rotieren oder widerrufen Sie den Schlüssel nach Abschluss. Für Hochrisiko- oder lang lebende Schlüssel: zuerst lokal mit age oder OpenSSL verschlüsseln und nur Chiffretext hochladen.",
    },
    {
      question: "Ist PrivateNote ein Secrets Manager?",
      answer:
        "Nein. PrivateNote löst sichere menschliche Übergabe. Für Machine-to-Machine-Speicherung nutzen Sie HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager oder Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "API-Schlüssel wie Produktionspasswörter behandeln",
      paragraphs: [
        "Ein API-Schlüssel ist faktisch ein Passwort für Software. Je nach Berechtigungen kann ein geleakter Schlüssel Kundendaten offenlegen, kostenpflichtige Ressourcen verbrauchen, Cloud-Infrastruktur deployen, E-Mail über Ihre verifizierte Domain senden oder eine KI-Rechnung in die Höhe treiben.",
        "Anders als menschliche Passwörter bleiben API-Schlüssel oft monatelang gültig, liegen in Konfigurationsdateien und umgehen Multi-Faktor-Authentifizierung vollständig. Leakt ein Schlüssel, kann ein Angreifer als Ihre Anwendung agieren—bösartiger Traffic kann sich in normalem Produktionsverkehr verbergen, bis Kosten steigen oder Daten bereits exponiert sind.",
      ],
    },
    neverPaste: {
      title: "API-Schlüssel nie in dauerhafte Systeme einfügen",
      intro:
        "Diese Kanäle sind bequem, weil sie Historie bewahren. Genau deshalb sind sie der falsche Ort für Geheimnisse.",
      avoidHeading: "Diese Kanäle vermeiden",
    },
    whereLeak: {
      title: "Wo API-Schlüssel wirklich durchsickern",
      intro:
        "Die meisten Leaks sind keine ausgeklügelten Krypto-Brüche. Sie passieren, wenn jemand ein Geheimnis in ein System kopiert, das für Aufzeichnungen gebaut ist.",
    },
    beforeShare: {
      title: "Bevor Sie teilen",
      intro:
        "Verkleinern Sie zuerst den Schadensradius. Wie Sie den Schlüssel liefern, zählt—aber ein eng begrenzter Schlüssel begrenzt den Schaden, falls trotzdem etwas schiefgeht.",
      newKeyTitle: "Neuen Schlüssel erstellen?",
      newKeyBefore: "Generieren Sie hoch entropische Zugangsdaten lokal im Browser—der",
      newKeyLink: "API-Schlüssel-Generator",
      newKeyAfter: "auf passwords.lu läuft clientseitig; nichts wird hochgeladen.",
    },
    highRisk: {
      title: "Hochrisiko-Schlüssel: zuerst lokal verschlüsseln",
      p1: "Die meisten API-Schlüssel sind ersetzbar: Staging-Tokens, kurzlebige Integrationsgeheimnisse und eng begrenzte Zugangsdaten, die Sie rotieren wollen. Dafür reicht browserverschlüsselte Einmal-Übergabe meist.",
      p2: "Manche Schlüssel wiegen schwerer—Produktions-Admin-Zugang, Signierschlüssel, Root-Cloud-Zugangsdaten oder alles Lang lebige, das sich schmerzhaft oder unmöglich sauber widerrufen lässt. Behandeln Sie das wie Master-Geheimnisse: **lokal verschlüsseln, bevor etwas ins Web hochgeladen wird**, dann Chiffretext über PrivateNote senden.",
      calloutHeading: "Zuerst lokal verschlüsseln",
      ageBullet:
        "**age** — einfachste Defaults für Dateiverschlüsselung (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — vertrauenswürdige CLI, wenn Sie die Flags kennen",
      separateChannelBullet:
        "Verschlüsselte Datei mit PrivateNote hochladen; Entschlüsselungs-Passphrase über einen **separaten Kanal** senden (Signal, Telefon, persönlich)",
      outro:
        "Derselbe Workflow gilt für Kryptowährungs-Seed-Phrasen und andere unersetzliche Master-Geheimnisse. Siehe [Krypto-Seed-Phrasen und Einmal-Links](blog:crypto-seed-phrase-one-time-link) für die vollständige age/OpenSSL-Anleitung, Passphrase-Tipps und wann Einmal-Links passen—und wann nicht.",
    },
    handoff: {
      title: "Ein sichererer Übergabe-Workflow",
      intro:
        "Wenn ein Mensch den Schlüssel braucht—not wenn eine App ihn zur Laufzeit abruft—folgen Sie dieser Abfolge.",
      diagramCaption: "Sichere Übergabe auf einen Blick",
      diagramFootnote:
        "Teilen Sie ein Notiz-Passwort über einen separaten Kanal—nie in derselben Nachricht wie der Link.",
    },
    privateNote: {
      title: "Wie PrivateNote in die Übergabe passt",
      p1: "PrivateNote ist für den Mensch-zu-Mensch-Moment gebaut: API-Schlüssel, SSH-Privatschlüssel, Datenbank-Zugangsdaten, Wiederherstellungscodes, Webhook-Signing-Secrets und temporäre Passwörter, die eine Person erreichen sollen, ohne dauerhafter Datensatz zu werden.",
      relatedSsh:
        "Geht es um einen SSH-Schlüssel statt um API-Zugangsdaten, siehe [SSH-Schlüssel sicher teilen](blog:how-to-share-ssh-keys-securely) zu öffentlichen vs. privaten Schlüsseln, Deploy Keys und Editor-Erweiterungen.",
      p2: "Das Geheimnis wird in Ihrem Browser vor dem Upload verschlüsselt. PrivateNote speichert Chiffretext, nicht Klartext. Der Entschlüsselungsschlüssel liegt im URL-Fragment—dem Teil nach `#`—den Browser beim Laden nicht an den Server senden.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "Der Server erhält die Notiz-ID und die verschlüsselte Nutzlast.",
      bullet2: "Der Server erhält den Entschlüsselungsschlüssel nicht.",
      bullet3: "Burn-after-Reading und Ablauf begrenzen, wie lange die verschlüsselte Notiz existiert.",
      p3: "PrivateNote ergänzt dedizierte Secret Stores—es schließt die Lücke, wenn Sie einen Stripe-Schlüssel an einen Integrationspartner senden, einen temporären OpenAI-Schlüssel mit einem Auftragnehmer teilen oder einem Teammitglied einmaligen Staging-Zugang geben.",
    },
    faq: { title: "Häufig gestellte Fragen" },
    bottomLine: {
      title: "Das Fazit",
      body: "Die meisten API-Schlüssel-Leaks passieren nicht, weil Kryptografie versagt hat. Sie passieren, weil jemand aus Bequemlichkeit ein Geheimnis in ein dauerhaftes, durchsuchbares System kopiert hat. Schlüssel eng begrenzen, nur bei Bedarf teilen und keine Klartext-Spur in Chat, Tickets, E-Mail oder Git hinterlassen.",
    },
  },
  ctaTitle: "API-Schlüssel teilen, ohne ihn im Chat zu hinterlassen",
  ctaBody:
    "Erstellen Sie einen browserverschlüsselten PrivateNote-Link mit Burn-after-Reading. Für Einmal-Notizen kein Konto nötig.",
  ctaButton: "PrivateNote erstellen ->",
};
