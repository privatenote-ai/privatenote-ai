import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideDe: PasswordManagersGuideCopy = {
  metaTitle: "Passwort-Manager – Leitfaden",
  metaDescription:
    "Passwörter sicher erstellen, speichern und teilen. KeePass, Bitwarden, Apple und Google im Vergleich — plus Passwords.lu und PrivateNote für einmaliges Teilen.",
  heroLabel: "Sicherheitsleitfaden",
  heroTitle: "Passwort-Manager – Leitfaden",
  heroTagline: "Passwörter sicher erstellen, speichern und teilen",
  heroSubtitle:
    "Passwörter schützen fast jeden Aspekt des digitalen Lebens — doch Wiederverwendung und schwache Muster bleiben eine der größten Schwachstellen in der Cybersicherheit. Ein Passwort-Manager behebt das.",
  introLead:
    "Das Problem sind nicht die Passwörter selbst. Es ist, wie Menschen sie nutzen. Viele verwenden noch immer dasselbe Passwort auf Dutzenden von Websites oder machen nur kleine Variationen:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Wenn eine Website gehackt wird, testen Angreifer diese Zugangsdaten überall — eine Technik namens Credential Stuffing, die jährlich Millionen kompromittierter Konten verursacht. Ein Passwort-Manager erzeugt für jedes Konto ein anderes Passwort. Sie müssen sich nur ein starkes Master-Passwort merken.",
  essentialTitle: "Warum Passwort-Manager unverzichtbar sind",
  essentialIntro: "Ein guter Passwort-Manager verbessert sowohl die Sicherheit als auch das tägliche Online-Erlebnis erheblich.",
  essentialBenefits: [
    "Lange, zufällige Passwörter sofort generieren",
    "Jedes Passwort in einem verschlüsselten Tresor speichern",
    "Anmeldeformulare automatisch ausfüllen",
    "Wiederverwendete oder schwache Passwörter erkennen",
    "Warnungen erhalten, wenn Zugangsdaten in bekannten Datenlecks auftauchen",
    "Passwörter auf allen Geräten synchronisieren",
    "Passkeys neben Passwörtern speichern",
    "Zugangsdaten bei Bedarf sicher teilen",
  ],
  howItWorksTitle: "Wie Passwort-Manager funktionieren",
  howItWorksBody1:
    "Ihre Zugangsdaten befinden sich in einem verschlüsselten Tresor. Beim Erstellen des Tresors wählen Sie ein Master-Passwort, aus dem die Verschlüsselungsschlüssel abgeleitet werden, die alles darin schützen.",
  cryptoLabel: "Moderne Kryptografie umfasst typischerweise:",
  cryptoPoints: [
    "AES-256-Verschlüsselung",
    "Argon2id oder PBKDF2 zur Schlüsselableitung",
    "Authentifizierte Verschlüsselung zur Erkennung von Manipulationen",
  ],
  howItWorksBody2:
    "Da der Tresor vor der Speicherung oder Synchronisierung verschlüsselt wird, können seriöse Anbieter Ihre Passwörter in der Regel nicht lesen.",
  unlockedLabel: "Nach dem Entsperren kann Ihr Manager:",
  vaultFeatures: [
    "Benutzernamen und Passwörter automatisch ausfüllen",
    "Sichere Passwörter generieren",
    "Neu erstellte Zugangsdaten speichern",
    "Änderungen geräteübergreifend synchronisieren",
    "Sichere Notizen und Passkeys speichern",
  ],
  benefitsTitle: "Vorteile eines Passwort-Managers",
  benefitBlocks: [
    {
      title: "Jedes Konto erhält ein einzigartiges Passwort",
      body: "Wenn Ihr Netflix-Passwort gestohlen wird, sollte es nicht auch Ihre E-Mail, Ihr Online-Banking, Ihr GitHub-Konto oder Ihren Cloud-Speicher entsperren. Passwort-Manager machen einzigartige Passwörter mühelos.",
    },
    {
      title: "Starke Passwort-Generierung",
      body: "Menschen sind schlecht darin, zufällige Passwörter zu erfinden. Manager erzeugen hoch-entropische Zeichenketten wie uQ8!kL#7P2@wXf9$rZm4 — extrem schwer zu erraten oder per Brute-Force zu knacken.",
    },
    {
      title: "Automatische Anmeldung",
      body: "Passwort-Manager erkennen Websites und füllen Zugangsdaten automatisch aus. Seriöse Manager füllen typischerweise nur auf der korrekten Domain aus, was auch vor Phishing schützt.",
    },
    {
      title: "Passwort-Gesundheitsberichte",
      body: "Viele Manager markieren wiederverwendete Passwörter, schwache Passwörter, kompromittierte Zugangsdaten, fehlende MFA und Websites mit Passkey-Unterstützung — und helfen Ihnen, die Sicherheit im Laufe der Zeit zu verbessern.",
    },
    {
      title: "Sichere Synchronisierung",
      body: "Moderne Manager synchronisieren Ihren verschlüsselten Tresor über Desktop, Laptop, Smartphone und Tablet, damit Passwörter überall verfügbar sind, wo Sie sie brauchen.",
    },
  ],
  passwordsLuPartnerLabel: "Partner-Tool",
  passwordsLuTitle: "Browserbasierte Generierung mit Passwords.lu",
  passwordsLuBody:
    "Manchmal brauchen Sie nur ein starkes Passwort — keinen vollständigen Tresor-Workflow. Passwords.lu führt die Generierung direkt in Ihrem Browser aus. Passwörter werden nicht auf Server hochgeladen; kein Konto erforderlich.",
  passwordsLuWorkflow:
    "Empfohlener Workflow: auf Passwords.lu generieren, dann sofort im Passwort-Manager speichern.",
  passwordsLuCta: "Passwort-Generator öffnen",
  passwordsLuTools: [
    "Starker Passwort-Generator",
    "Passphrase-Generator",
    "Sicherer PIN-Generator",
    "Passwort-Stärke-Prüfer",
    "Benutzernamen-Generator",
    "Hash-Generatoren (Argon2id, bcrypt, scrypt und mehr)",
    "Bildungs-Tools für Sicherheit",
  ],
  recommendedTitle: "Empfohlene Passwort-Manager",
  recommendedIntro:
    "Denken Sie in drei Schichten: plattformeigene Tools für Stabilität, lokale Open-Source-Tresore für Kontrolle und Cloud-Manager, wenn Sie leistungsstarke Synchronisierung brauchen — mit dem zusätzlichen serverseitigen Risiko, das damit einhergeht.",
  tiers: {
    platform: {
      title: "Plattformeigene Manager",
      subtitle: "Starke Technik, stabile Produkte — beste Standardwahl für die meisten",
      intro:
        "Apple und Google liefern Passwort-Manager mit dem Betriebssystem. Sie werden von großen Sicherheitsteams unterstützt, erhalten kontinuierliche Updates und integrieren Passkeys, Autofill und Datenleck-Warnungen mit minimalem Setup. Wenn Sie in einem Ökosystem leben, ist das oft die reibungsloseste und zuverlässigste Wahl.",
      strengthsLabel: "Stärken",
      tradeoffsLabel: "Kompromisse",
      pros: [
        "Ausgereifte UX mit Autofill auf OS-Ebene und Passkey-Unterstützung",
        "Von Plattform-Sicherheitsingenieuren im großen Maßstab gepflegt",
        "Kein separates Abo für Kernfunktionen",
        "Stabile Synchronisierung über iCloud oder Ihr Google-Konto",
      ],
      cons: [
        "An Apple- oder Google-Konto und Plattformentscheidungen gebunden",
        "Weniger flexibel bei freier Mischung von Windows, Linux und Mobilgeräten",
        "Vertrauensmodell hängt von der Sicherheit Ihres Cloud-Kontos ab",
      ],
      managers: {
        apple: {
          verdict: "Am besten für iPhone, iPad, Mac und Vision Pro",
          description:
            "In Apple-Plattformen integriert mit sicherer Speicherung, Generierung, Sicherheitswarnungen, Passkeys und iCloud Keychain-Sync — keine zusätzliche App in einem reinen Apple-Haushalt nötig.",
          highlights: [
            "Tiefe OS-Integration und Passkey-Unterstützung",
            "Sicherheitswarnungen bei bekannten Datenlecks",
            "Hervorragende UX innerhalb des Apple-Ökosystems",
          ],
          learnMore: "Mehr erfahren",
        },
        google: {
          verdict: "Am besten für Android und Chrome",
          description:
            "In Android und Chrome integriert mit Generierung, Autofill, Password Checkup, Datenleck-Warnungen, Passkeys und Sync über Ihr Google-Konto.",
          highlights: [
            "Bequemer Standard auf Android-Geräten",
            "Password Checkup und Datenleck-Warnungen",
            "Funktioniert überall, wo Sie Chrome nutzen",
          ],
          learnMore: "Mehr erfahren",
        },
      },
    },
    local: {
      title: "Lokale Open-Source-Tresore",
      subtitle: "Maximale Kontrolle — Sie besitzen die verschlüsselte Datei",
      intro:
        "KeePass speichert Ihren Tresor als lokale verschlüsselte Datenbank. Kein Anbieter-Cloud-Konto nötig: Sie entscheiden, wo die Datei liegt und wie sie synchronisiert wird. Der Kompromiss ist die UX — Oberflächen wirken veraltet im Vergleich zu Plattform- oder Cloud-Managern, und geräteübergreifende Sync ist DIY, sofern Sie keine eigene Speicherschicht hinzufügen.",
      strengthsLabel: "Stärken",
      tradeoffsLabel: "Kompromisse",
      pros: [
        "Open Source und auditierbar",
        "Kein obligatorisches Cloud-Konto oder Abo",
        "Offline-first; Tresordatei bleibt unter Ihrer Kontrolle",
        "Großes Plugin-Ökosystem (KeePassXC, mobile Ports usw.)",
      ],
      cons: [
        "UI und Onboarding weniger ausgereift als Plattform-Tools",
        "Geräteübergreifende Sync manuell, sofern nicht konfiguriert",
        "Mehr Einrichtungsaufwand für Familien oder gemischte Geräte-Haushalte",
      ],
      managers: {
        keepass: {
          verdict: "Am besten für Datenschutz-Puristen und Self-Hoster",
          description:
            "Das ursprüngliche Open-Source-Modell: eine verschlüsselte .kdbx-Datei, die Sie auf Festplatte, USB, NAS speichern oder über Ihre eigene Cloud synchronisieren können. KeePassXC ist ein beliebter plattformübergreifender Fork mit modernerer Oberfläche.",
          highlights: [
            "Völlig kostenlos — kein Vendor Lock-in",
            "Sie wählen Speicher- und Sync-Strategie",
            "Ideal, wenn die Cloud optional ist, nicht Standard",
          ],
          learnMore: "Mehr erfahren",
        },
      },
    },
    cloud: {
      title: "Cloud-synchronisierte Passwort-Manager",
      subtitle: "Leistungsstarke Sync und Freigabe — höchstes serverseitiges Risiko",
      intro:
        "Dedizierte Cloud-Manager wie Bitwarden glänzen bei plattformübergreifender Sync, Familienfreigabe und Teamfunktionen. Dieser Komfort bringt ein anderes Bedrohungsmodell: Ihr verschlüsselter Tresor (und manchmal Metadaten) liegt auf fremden Servern. Ein Datenleck oder eine Fehlkonfiguration beim Anbieter ist das Hauptrisiko — deshalb sind Audits, Open Source und ein starkes Master-Passwort hier wichtiger als überall sonst.",
      strengthsLabel: "Stärken",
      tradeoffsLabel: "Kompromisse",
      pros: [
        "Beste geräteübergreifende Sync out of the box",
        "Familien- und Organisationsfreigabe",
        "Konsistent auf Windows, macOS, Linux und Mobilgeräten",
        "Open-Source-Optionen (Bitwarden) mit öffentlichen Sicherheitsaudits",
      ],
      cons: [
        "Größte Angriffsfläche bei Kompromittierung des Anbieters",
        "Verschlüsselte Tresor-Backups können offline mit schwachen Master-Passwörtern geknackt werden",
        "Sie müssen der Krypto-Implementierung und dem Betrieb des Anbieters vertrauen",
      ],
      managers: {
        bitwarden: {
          verdict: "Beste Cloud-Option für plattformübergreifende Nutzer",
          description:
            "Open-Source-Software, Ende-zu-Ende-verschlüsselte Sync, Passkey-Unterstützung, unabhängige Audits und ein starkes Gratis-Angebot — die Standardempfehlung, wenn Sie Cloud-Sync außerhalb von Apple oder Google brauchen.",
          highlights: [
            "Geprüfte Open-Source-Clients",
            "Hervorragender Gratis-Plan und Familien-Tarife",
            "Konsistentes Erlebnis auf allen großen Plattformen",
          ],
          learnMore: "Mehr erfahren",
        },
        lastpass: {
          verdict: "Legacy-Option — für Neunutzer Bitwarden bevorzugen",
          description:
            "Hat Cloud-Passwort-Manager populär gemacht, aber hochkarätige Vorfälle mit gestohlenen verschlüsselten Tresor-Backups trieben viele Sicherheitsexperten zu Bitwarden oder lokalem KeePass für neue Deployments.",
          highlights: [
            "Nutzbare Option mit starkem Master-Passwort + MFA bei bestehender Nutzung",
            "Migration erwägen, wenn Sie neu starten",
          ],
          learnMore: "Mehr erfahren",
          caution: "Vorsicht",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Ihre Priorität",
    recommendation: "Empfehlung",
  },
  comparisonRows: [
    { priority: "Leben im Apple-Ökosystem", pick: "Apple Passwords" },
    { priority: "Android & Chrome als täglicher Begleiter", pick: "Google Password Manager" },
    { priority: "Maximaler Datenschutz und Dateikontrolle", pick: "KeePass (lokaler Tresor)" },
    { priority: "Plattformübergreifende Cloud-Sync", pick: "Bitwarden" },
    { priority: "Bestehender LastPass-Nutzer", pick: "Weiter nutzen wenn gehärtet; Bitwarden oder KeePass prüfen" },
  ],
  sharingTitle: "Passwörter sicher teilen",
  sharingBody:
    "Auch starke Passwörter müssen manchmal geteilt werden — mit Kollegen, Familie, IT-Admins, Auftragnehmern oder Kunden. Zu viele senden sie noch über Messaging-Plattformen, die für Chat, nicht für geheime Zustellung gedacht sind.",
  unsafeChannels: ["E-Mail", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Stattdessen PrivateNote nutzen",
  privateNoteSharingBody:
    "PrivateNote verschlüsselt Geheimnisse in Ihrem Browser vor dem Upload. Der Server speichert nur Chiffretext; der Entschlüsselungsschlüssel reist separat im Link. Notizen können sich nach einem Lesevorgang selbst zerstören oder planmäßig ablaufen.",
  privateNoteSharingItems: [
    "Passwörter",
    "API-Schlüssel",
    "WLAN-Zugangsdaten",
    "Wiederherstellungscodes",
    "Temporäre Logins",
  ],
  privateNoteSharingCta: "Sichere Einmal-Notiz erstellen",
  passwordProtectedTitle: "Zusätzlicher Schutz mit passwortgeschützten Notizen",
  passwordProtectedBody1:
    "Fügen Sie einer PrivateNote optional ein Passwort hinzu. Der Empfänger braucht sowohl den Link als auch das separate Passwort — idealerweise über verschiedene Kanäle (Link per E-Mail, Passwort per Telefon oder persönlich).",
  passwordProtectedBody2:
    "Selbst wenn jemand den Link abfängt, kann er das Geheimnis ohne das Passwort nicht enthüllen.",
  bestPracticesTitle: "Best Practices",
  bestPractices: [
    "Ein langes, einzigartiges Master-Passwort verwenden",
    "Multi-Faktor-Authentifizierung für Ihren Passwort-Manager aktivieren",
    "Passwörter niemals auf Websites wiederverwenden",
    "Passwörter mit Passwort-Manager oder Passwords.lu generieren",
    "Jedes Passwort im verschlüsselten Tresor speichern",
    "Passkeys aktivieren, wann immer verfügbar",
    "Passwort-Gesundheitsberichte regelmäßig prüfen",
    "Passwörter über PrivateNote statt E-Mail oder Chat teilen",
    "Für hochsensible Zugangsdaten PrivateNotes optionale Passwortschutz nutzen und das Passwort separat übermitteln",
  ],
  faqTitle: "Häufig gestellte Fragen",
  faq: [
    {
      q: "Sind Passwort-Manager sicher?",
      a: "Ja. Seriöse Passwort-Manager nutzen starke, branchenübliche Verschlüsselung. Für fast alle ist ein Passwort-Manager deutlich sicherer als Passwörter auswendig zu lernen oder dasselbe Passwort auf mehreren Websites zu verwenden.",
    },
    {
      q: "Kann der Passwort-Manager-Anbieter meine Passwörter lesen?",
      a: "Bei modernen Managern wie KeePass, Bitwarden, Apple Passwords und Google Password Manager wird Ihr Tresor vor der Speicherung verschlüsselt. Bei einem starken Master-Passwort kann der Anbieter Ihre gespeicherten Zugangsdaten in der Regel nicht lesen.",
    },
    {
      q: "Was passiert, wenn ich mein Master-Passwort vergesse?",
      a: "Die meisten Passwort-Manager können es nicht wiederherstellen, weil sie es nie kennen. Das ist beabsichtigt. Einige Dienste bieten Wiederherstellungsoptionen oder Notfallzugriff, wenn vorab konfiguriert.",
    },
    {
      q: "Soll ich die Browser-Passwortspeicherung nutzen?",
      a: "Integrierte Apple- und Google-Manager sind starke, stabile Wahlen in ihren Ökosystemen — unterstützt von großen Sicherheitsteams. KeePass eignet sich für maximale Kontrolle. Bitwarden passt, wenn Sie Cloud-Sync über gemischte Plattformen brauchen und höheres serverseitiges Risiko akzeptieren.",
    },
  ],
  finalTitle: "Abschließende Empfehlung",
  finalBody:
    "Kein einzelner Manager ist für alle perfekt — aber einen zu nutzen gehört zu den wirksamsten Schritten. Kombinieren Sie ihn mit Passwords.lu für schnelle Generierung und PrivateNote, wenn Sie Geheimnisse sicher teilen müssen.",
  finalBullets: [
    { label: "Apple & Google", text: "stabile Plattform-Standards" },
    { label: "KeePass", text: "lokale Kontrolle, Open Source" },
    { label: "Bitwarden", text: "Cloud-Sync für jedes Gerät" },
    { label: "Passwords.lu", text: "schnelle browserbasierte Generierung" },
  ],
  finalCtaPrivateNote: "Geheimnis mit PrivateNote teilen",
  finalCtaPasswordsLu: "passwords.lu besuchen",
  exploreOther: "Weitere Leitfäden entdecken",
  allResources: "Alle Ressourcen",
  affiliateDisclaimer:
    "Nur ein Bildungsleitfaden. Wir können eine Provision über Affiliate-Links verdienen, wenn Sie empfohlene Dienste nutzen — das unterstützt diese kostenlose Datenschutz-Ressource.",
  otherGuides: [
    { id: "vpn", title: "VPN-Dienste – Leitfaden" },
    { id: "messenger", title: "Sichere Messenger" },
    { id: "email", title: "Sichere E-Mail" },
    { id: "browser", title: "Datenschutz-Browser" },
  ],
};
