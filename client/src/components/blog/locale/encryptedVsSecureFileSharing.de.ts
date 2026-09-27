import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingDe: EncryptedFileSharingArticleCopy = {
  intro: [
    'Wenn Menschen nach „sicherer Dateiübertragung“ suchen, gehen sie oft davon aus, dass jeder Dienst mit HTTPS- oder TLS-Verschlüsselung Dateien auf dieselbe Weise schützt. Leider stimmt das nicht.',
    'Zwei Dienste können beide „verschlüsselte Dateiübertragung“ bewerben und dabei sehr unterschiedliche Datenschutzgarantien bieten. Der Unterschied liegt ganz darin, **wo die Verschlüsselung stattfindet**. Diese Unterscheidung erklärt, warum manche Dienste Ihre Dateien inspizieren, indexieren und verarbeiten können, während andere das schlicht nicht können.',
  ],
  sections: [
    {
      title: "Die zwei Arten der Verschlüsselung",
      level: "primary",
      paragraphs: ["Es gibt zwei Hauptwege, wie moderne Datei-Sharing-Dienste Ihre Daten schützen."],
    },
    {
      title: "1. Transportverschlüsselung (TLS)",
      level: "secondary",
      paragraphs: [
        "Das ist die Standardverschlüsselung, die heute fast jede Website im Internet nutzt. Wenn Sie eine Datei hochladen, baut Ihr Browser eine sichere Transport Layer Security (TLS)-Verbindung zum Host-Server auf. Die Verbindung ist verschlüsselt, während Ihre Datei über das Netzwerk reist, und schützt Sie vor Angreifern in öffentlichen WLANs, kompromittierten Routern oder jedem, der Netzwerkverkehr mitschneidet.",
      ],
      flow: "tls",
      bullets: [
        "TLS ist unverzichtbar, und jeder seriöse Dienst muss es einsetzen.",
        "Sobald der Upload den Server erreicht, erhält der Anbieter die ursprüngliche Datei im Klartext.",
        "Ab diesem Zeitpunkt kann der Dienst je nach Richtlinien die Datei speichern, Vorschauen erzeugen, Inhalte indexieren, nach Malware scannen oder Metadaten für Analysen nutzen.",
        'Viele Anbieter verschlüsseln Dateien auch „at rest“. Das schützt vor physischem Diebstahl von Datenträgern — der Dienst besitzt aber weiterhin die Schlüssel und kann Ihre Dateien lesen.',
      ],
      callout:
        "**Die zentrale Schwachstelle klassischer Cloud-Speicher:** Der Server kann nur verschlüsseln, was er bereits lesen konnte.",
    },
    {
      title: "2. Browserseitige Verschlüsselung",
      level: "secondary",
      paragraphs: [
        "Ein grundlegend anderer Ansatz ist, die Datei zu verschlüsseln, **bevor** sie Ihr Gerät verlässt. Statt die Originaldatei hochzuladen, nutzt Ihr Browser lokale kryptografische APIs zur Verschlüsselung. Der Server erhält nur Chiffretext — Daten, die zufällig wirken und ohne den Entschlüsselungsschlüssel nutzlos sind.",
      ],
      flow: "browser",
      bullets: [
        "Browserseitige Verschlüsselung ersetzt TLS nicht — sie ergänzt es.",
        "TLS schützt die Verbindung weiterhin vor Abhörern auf Netzwerkebene.",
        "Die Server des Anbieters erhalten ausschließlich unlesbaren Chiffretext, weil sie weder Klartext noch Entschlüsselungsschlüssel erhalten.",
      ],
    },
    {
      title: "Warum dieser Unterschied wichtig ist",
      level: "primary",
      paragraphs: [
        "Angenommen, Sie teilen hochsensible Daten: Rechtsverträge, Finanztabellen, proprietären Quellcode, medizinische Unterlagen oder vertrauliche Geschäftsdokumente.",
        "Bei reiner Transportverschlüsselung ist Ihre Privatsphäre **vertraglich**. Sie müssen der Implementierung des Anbieters, den Zugriffskontrollen für Mitarbeiter sowie aktuellen und künftigen Unternehmensrichtlinien vertrauen.",
        "Bei browserseitiger Verschlüsselung ist Ihre Privatsphäre **architektonisch**. Der Anbieter speichert nur verschlüsselten Chiffretext. Selbst bei einem Hack, einer gerichtlichen Anordnung oder einem geänderten Geschäftsmodell kann er keinen Klartext herausgeben, den er nie besessen hat.",
      ],
      callout:
        "Bei reiner Transportverschlüsselung ist Ihre Privatsphäre **vertraglich**. Bei browserseitiger Verschlüsselung ist Ihre Privatsphäre **architektonisch**.",
    },
    {
      title: "Eine aktuelle Erinnerung: der Vertrauensfaktor",
      level: "primary",
      paragraphs: [
        "2025 aktualisierte WeTransfer seine Nutzungsbedingungen mit Formulierungen, die weitreichende Rechte an hochgeladenen Inhalten zu gewähren schienen — auch zur Verbesserung von Machine-Learning-Systemen für die Inhaltsmoderation.",
        "Die Änderung löste sofortigen Widerstand bei Künstlern, Journalisten und Kreativprofis aus, die befürchteten, ihr geistiges Eigentum werde zum Training von KI-Systemen genutzt. WeTransfer stellte schnell klar, dass Kundeninhalte nicht für KI-Training verwendet würden, und entfernte die missverständliche Sprache — doch der Vorfall verdeutlichte eine zentrale Lektion:",
        "Wenn ein Anbieter Ihre Dateien im Klartext erhält, sind Sie vollständig von seinen Versprechen abhängig. Wenn ein Anbieter nur verschlüsselten Chiffretext speichert, ist das Vertrauen, das Sie in ihn setzen müssen, strukturell minimiert. Die Architektur erzwingt den Datenschutz.",
      ],
    },
    {
      title: "Wie PrivateNote Datei-Sharing handhabt",
      level: "primary",
      paragraphs: [
        "Moderne browserbasierte Verschlüsselung kombiniert mehrere etablierte kryptografische Bausteine, um Daten sicher zu halten, ohne auf Server-Vertrauen angewiesen zu sein.",
      ],
    },
    {
      title: "Schlüsselerzeugung und -isolierung",
      level: "secondary",
      paragraphs: [
        "Wenn ein Nutzer eine Datei teilen möchte, erzeugt PrivateNote direkt im Browser einen kryptografisch sicheren, zufälligen symmetrischen Schlüssel mit der Web Crypto API.",
        "Dieser Schlüssel wird niemals an unsere Infrastruktur übertragen. Stattdessen wird er als URL-Fragment an den Freigabelink angehängt (der Teil nach dem `#`-Zeichen):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Web-Browser senden das URL-Fragment bei HTTP-Anfragen by design nicht an den Webserver. Dieses Verhalten ist im URL-Standard definiert und funktioniert seit Jahrzehnten so. Der Entschlüsselungsschlüssel bleibt im Browser des Empfängers.",
      ],
    },
    {
      title: "Authentifizierte Streaming-Verschlüsselung",
      level: "secondary",
      paragraphs: [
        "Statt Rohdaten hochzuladen, verschlüsselt der Browser die Datei, bevor sie das Netzwerk berührt. Da PrivateNote große Anhänge unterstützt, nutzt es **Streaming-Verschlüsselung in Blöcken**: Dateien werden blockweise verschlüsselt (typischerweise in mehrmegabytegroßen Chunks), sodass große Uploads nicht die gesamte Datei gleichzeitig in den Speicher laden müssen.",
        "Kostenlose Konten können Dateien bis 25 MB anhängen; Premium-Konten unterstützen deutlich größere Uploads (bis 1 GB pro Datei). In allen Fällen erreicht nur Chiffretext unsere Server.",
        "Die Implementierung basiert auf **AES-GCM** (Authenticated Encryption with Associated Data) und bietet sowohl Vertraulichkeit als auch Integrität:",
      ],
      bullets: [
        "**Vertraulichkeit** — die Nutzdaten sind ohne Schlüssel unlesbar.",
        "**Integrität** — Manipulationen am Chiffretext im Ruhezustand werden bei der clientseitigen Entschlüsselung erkannt und abgelehnt.",
        "Wenn Passwortschutz aktiviert ist, wird ein aus dem Passwort abgeleiteter Schlüssel mit speicherintensiven Algorithmen wie **Argon2id** erzeugt, wodurch Brute-Force-Raten praktisch unmöglich werden.",
      ],
    },
    {
      title: "Welche Metadaten weiterhin existieren",
      level: "primary",
      paragraphs: [
        "Eine rigorose Sicherheitsarchitektur muss ihre Grenzen anerkennen. Browserseitige Verschlüsselung schützt den **Inhalt** Ihrer Dateien, aber bestimmte Metadaten bleiben für Netzwerk und Dienst sichtbar:",
      ],
      bullets: [
        "Zeitstempel von Upload und Download.",
        "Die ungefähre Größe der verschlüsselten Nutzdaten.",
        "Ablaufdatum, Anzeigelimits und Dateizugriffszeiträume.",
        "Die IP-Adresse des Empfängers beim Download (sichtbar für den Webserver, der die Anfrage weiterleitet).",
      ],
      callout:
        "Datenschutzorientierte Systeme minimieren Metadaten, wo praktikabel — aber kein webbasierter Dienst kann sie vollständig eliminieren. PrivateNote behandelt Metadaten mit derselben Aufbewahrungsdisziplin wie verschlüsselte Nutzdaten: Sie werden gelöscht, wenn eine Notiz abläuft oder entfernt wird.",
    },
    {
      title: "Die Kompromisse echter Privatsphäre",
      level: "primary",
      paragraphs: ["Browserseitige Verschlüsselung bietet maximale Inhalts-Privatsphäre, aber mit bewussten Kompromissen:"],
      bullets: [
        "**Keine serverseitige Malware-Prüfung** — weil der Server die Datei nicht lesen kann, kann er sie nicht auf Viren scannen. Vertrauen Sie dem Absender.",
        "**Keine serverseitig erzeugten Vorschauen** — Miniaturansichten und Dokumentvorschauen werden nach der Entschlüsselung lokal im Browser des Empfängers gerendert, nicht auf dem Server.",
        "**Keine Passwort- oder Schlüsselwiederherstellung** — wenn Sie den Link oder Verschlüsselungsschlüssel verlieren, kann der Anbieter die Datei nicht wiederherstellen. Es gibt kein „Passwort vergessen“ für Daten, auf die der Host keinen Zugriff hat.",
      ],
    },
    {
      title: "Den richtigen Dienst wählen",
      level: "primary",
      paragraphs: [
        "Nicht jede Dateiübertragung erfordert strikte browserseitige Verschlüsselung. Ungezwungene Urlaubsfotos mit der Familie sind vielleicht mit reiner Transportverschlüsselung in Ordnung.",
        "Wenn Sie geistiges Eigentum, Rechtsvereinbarungen oder sensible persönliche Daten teilen, stellen Sie eine architektonische Frage:",
        "**Erhält der Dienst meine Originaldatei oder nur eine verschlüsselte Version davon?**",
        "Diese eine Unterscheidung bestimmt, wer technisch auf Ihre Daten zugreifen kann — nicht nur heute, sondern auch wenn sich Unternehmensrichtlinien, Eigentumsverhältnisse und Datenschutzgesetze im Laufe der Zeit ändern.",
      ],
    },
  ],
  closingTitle: "Dateien teilen, ohne Klartext an den Server zu übergeben",
  closingBody:
    "Die sichere Dateiübertragung von PrivateNote nutzt dasselbe browserseitige Verschlüsselungsmodell wie unsere verschwindenden Notizen: lokal verschlüsseln, Chiffretext hochladen, den Schlüssel im URL-Fragment teilen und den Zugriff nach Ihren Bedingungen ablaufen lassen.",
  ctaLabel: "Sichere Dateiübertragung ausprobieren",
  relatedReading: "Weiterlesen",
};
