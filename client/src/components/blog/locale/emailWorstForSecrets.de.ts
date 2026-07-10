import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsDe: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop auf einem Schreibtisch mit einer E-Mail, die Server-Zugangsdaten und einen SSH-Privatschlüssel im Klartext zeigt",
  intro:
    "E-Mail ist zum Standard geworden, um fast alles auszutauschen—Verträge, Passwörter, API-Schlüssel, Bankdaten, medizinische Unterlagen, Ausweisdokumente, WLAN-Passwörter und Wiederherstellungscodes. Die meisten von uns senden sensible Informationen per E-Mail, ohne lange darüber nachzudenken.",
  calloutTitle: "E-Mail wurde zum Zustellen von Nachrichten gebaut—nicht zum Verschwindenlassen",
  calloutBody:
    "Sobald Sie eine E-Mail absenden, verlieren Sie oft die Kontrolle darüber, wo sie landet, wie lange sie gespeichert wird und wer irgendwann Zugriff darauf haben könnte. Wenn Sie etwas senden, das privat bleiben soll, ist E-Mail meist das falsche Werkzeug.",
  emailCopies: [
    "Ihrem Postfach",
    "dem Postfach des Empfängers",
    "Backups des E-Mail-Anbieters",
    "archivierten Kopien",
    "synchronisierten Geräten",
    "Unternehmens-Backup-Systemen",
    "exportierten PST- oder MBOX-Dateien",
    "Disaster-Recovery-Infrastruktur",
  ],
  agedSecretsExamples: [
    "ein Produktions-Datenbankpasswort",
    "ein API-Schlüssel",
    "SSH-Zugangsdaten",
    "VPN-Anmeldedaten",
    "eine Kryptowährungs-Wiederherstellungsphrase",
  ],
  forwardingPaths: [
    "weitergeleitet",
    "in Ticketsysteme kopiert",
    "in Chat-Anwendungen eingefügt",
    "an andere E-Mails angehängt",
    "mit Auftragnehmern geteilt",
    "in Support-Anfragen aufgenommen",
  ],
  aiProcessingUses: [
    "Spam-Erkennung",
    "Phishing-Schutz",
    "Malware-Erkennung",
    "intelligente Antwortvorschläge",
    "Postfach-Kategorisierung",
    "Suche",
    "Produktivitätsfunktionen",
    "KI-gestütztes Schreiben und Zusammenfassen",
  ],
  oneTimeSecretExamples: [
    "ein Passwort",
    "ein API-Schlüssel",
    "ein Wiederherstellungscode",
    "eine Softwarelizenz",
    "Server-Zugangsdaten",
    "eine vertrauliche Nachricht",
  ],
  oneTimeBenefits: [
    "Kein Postfach-Verlauf.",
    "Kein durchsuchbares Archiv.",
    "Keine versehentliche Weiterleitung des Geheimnisses selbst.",
    "Keine vergessenen Kopien, die jahrelang in Postfächern liegen.",
  ],
  sections: [
    {
      title: "Ihre E-Mail existiert nicht nur an einem Ort",
      paragraphs: [
        "Viele stellen sich E-Mail als ein einfaches Gespräch zwischen zwei Personen vor. In Wirklichkeit existiert jede E-Mail typischerweise an mehreren Orten:",
        "Selbst wenn Sie eine E-Mail löschen, können Kopien anderswo weiterbestehen. Manche Organisationen bewahren E-Mails jahrelang auf, um rechtliche, regulatorische oder geschäftliche Anforderungen zu erfüllen. In der Praxis wird eine E-Mail oft dauerhaft.",
      ],
    },
    {
      title: "Geheimnisse altern schlecht",
      paragraphs: [
        "Das Gefährlichste an E-Mail ist nicht unbedingt heute. Es ist in fünf Jahren. Stellen Sie sich vor, Sie haben jemandem geschickt:",
        "Vielleicht haben sich die Zugangsdaten seitdem geändert. Vielleicht auch nicht. Jahre später kann diese E-Mail noch in mehreren Postfächern liegen—in Sekunden durchsuchbar. Wer Zugriff auf eines dieser Konten erhält, hat plötzlich eine Landkarte Ihrer früheren Geheimnisse. Unser Leitfaden zu [Geheimnissen, die Sie nie im Chat senden sollten](blog:secrets-never-send-in-chat) behandelt ähnliche Risiken in Messenger-Apps—E-Mail ist oft schlimmer, weil die Aufbewahrung länger und die Kopien zahlreicher sind.",
      ],
    },
    {
      title: "E-Mail ist für die Suche gebaut",
      paragraphs: [
        "Moderne E-Mail-Clients finden alte Nachrichten erstaunlich gut. Suchen Sie nach `password`, `API` oder `confidential`—und Nachrichten von vor Jahren erscheinen fast sofort.",
      ],
      callout:
        "Das ist eine hervorragende Funktion für den Alltag. Eine schreckliche für Geheimnisse. Sensible Informationen sollten mit der Zeit **schwerer** zu finden werden—nicht leichter.",
    },
    {
      title: "Weiterleiten kostet einen Klick",
      paragraphs: [
        "Vielleicht vertrauen Sie dem Empfänger. Das reicht nicht immer. E-Mails werden routinemäßig:",
        "Sobald ein Geheimnis Ihr Postfach verlässt, kontrollieren Sie nicht mehr, wie viele Kopien existieren. Anders als ein Passwortmanager oder ein verschlüsselter Sharing-Dienst kennt E-Mail kein Widerrufen des Zugriffs nach der Zustellung.",
      ],
    },
    {
      title: "KI verarbeitet E-Mail zunehmend",
      paragraphs: [
        "Ein weiterer Grund, vor dem Versenden sensibler Informationen per E-Mail nachzudenken: E-Mail-Anbieter setzen zunehmend automatisierte Systeme ein, um Nachrichten zu verarbeiten. Diese Systeme können helfen bei:",
        "Anbieter unterscheiden sich erheblich darin, wie diese Funktionen arbeiten, welche Daten verarbeitet werden und unter welchen Datenschutzrichtlinien. Obwohl viele Anbieter in den letzten Jahren stärkere Datenschutzverpflichtungen eingeführt haben, bedeutet das Senden sensibler Informationen per E-Mail weiterhin, diese Systemen außerhalb Ihrer Kontrolle anzuvertrauen. Wenn Sie die Exposition minimieren wollen, ist weniger sensible Information per E-Mail ein vernünftiger erster Schritt.",
      ],
    },
    {
      title: "Regulatorisches Scannen gehört auch zur Debatte",
      paragraphs: [
        "Privatsphäre ist nicht mehr nur eine technische Frage. Sie ist zur politischen Frage geworden. Im Juli 2026 billigte das Europäische Parlament eine Verlängerung des temporären Rechtsrahmens, der Anbietern bestimmter Kommunikationsdienste erlaubt, freiwillig kinderpornografisches Material (CSAM) bis April 2028 zu erkennen und zu melden.",
        "Der Rahmen betrifft vor allem Dienste, die auf Nachrichteninhalte zugreifen können—etwa viele klassische E-Mail-Anbieter und andere nicht [ende-zu-ende-verschlüsselte](blog:what-is-end-to-end-encryption) Kommunikationsdienste. Mehr dazu, was diese Abstimmung bedeutete—und warum trotz mehr „Nein“- als „Ja“-Stimmen eine Verabschiedung erfolgte—finden Sie in unserer Erklärung zu [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "Das erklärte Ziel ist Kinderschutz, und vernünftige Menschen können über das richtige Gleichgewicht zwischen Privatsphäre und öffentlicher Sicherheit unterschiedlicher Meinung sein. Dennoch zeigt die Debatte einen wichtigen Punkt: **Kann ein Dienst Ihre Nachrichten lesen, können künftige Gesetze, Richtlinien oder Plattformentscheidungen beeinflussen, wie diese Nachrichten verarbeitet werden.** Ende-zu-Ende-verschlüsselte Dienste sind grundlegend anders, weil der Anbieter nicht über die kryptografischen Schlüssel verfügt, die zum Lesen der Inhalte nötig sind.",
    },
    {
      title: "Es gibt einen besseren Weg, Geheimnisse zu teilen",
      paragraphs: [
        "Nicht jede Information muss ewig bestehen. Manchmal müssen Sie etwas nur einmal senden. Beispiele:",
        "Statt diese direkt in einer E-Mail zu senden, nutzen Sie einen [verschlüsselten Einmal-Link](blog:one-time-secret-links). Der Empfänger öffnet den Link, liest das Geheimnis, und die verschlüsselten Daten werden dauerhaft gelöscht. Für API-Schlüssel speziell siehe unseren Workflow-Leitfaden [API-Schlüssel sicher teilen](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Browser-Verschlüsselung macht einen Unterschied",
      paragraphs: [
        "Bei PrivateNote erfolgt die Verschlüsselung in Ihrem Browser, bevor etwas hochgeladen wird. Ihr Browser verschlüsselt die Nachricht lokal. Nur der verschlüsselte Chiffretext erreicht unsere Server. Der Entschlüsselungsschlüssel verlässt Ihr Gerät nie und wird von uns nicht gespeichert.",
        "Wenn der Empfänger die Notiz öffnet, kann sie so konfiguriert werden, dass sie nach dem ersten erfolgreichen Lesen selbst zerstört wird oder nach einer gewählten Frist automatisch abläuft. Das bedeutet: keine dauerhafte E-Mail mit dem Geheimnis, die Jahre später entdeckt werden könnte. Sie können [eine geheime Nachricht ohne Konto senden](blog:send-secret-message-without-account) oder [wie PrivateNote funktioniert](app:how-it-works) für das vollständige Verschlüsselungsmodell lesen.",
      ],
      callout:
        "Der praktische Test ist einfach: Kann der Anbieter den Entschlüsselungsschlüssel oder den Klartext erhalten? Wenn ja, ist das System nicht wirklich ende-zu-ende-verschlüsselt. E-Mail scheitert an diesem Test per Design.",
    },
    {
      title: "Das richtige Werkzeug für die richtige Information",
      paragraphs: [
        "E-Mail bleibt eine der nützlichsten Kommunikationstechnologien überhaupt. Sie eignet sich hervorragend für Gespräche, Rechnungen, Newsletter und alltägliche Geschäftskommunikation.",
        "Sie ist nicht der ideale Ort für Informationen, die verschwinden sollen, sobald sie ihren Zweck erfüllt haben. Passwörter, Wiederherstellungscodes, API-Schlüssel, vertrauliche Dokumente und andere sensible Informationen verdienen einen Sharing-Mechanismus, der mit Datenschutz im Sinn entworfen wurde.",
        "**Manchmal ist das sicherste Geheimnis das, das einfach nicht mehr existiert.**",
      ],
    },
  ],
  ctaTitle: "Ein Geheimnis teilen, ohne es im Postfach von jemandem zu hinterlassen",
  ctaBody:
    "Erstellen Sie eine verschlüsselte Einmal-Notiz in Ihrem Browser. Senden Sie den Link per E-Mail, wenn Sie müssen—das Geheimnis selbst bleibt aus dem Thread.",
  ctaButton: "PrivateNote testen ->",
};
