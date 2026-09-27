import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyDe: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop auf einem Schreibtisch zeigt einen PrivateNote.ai-Sicherheitshinweis zum Kopieren, mit Einmalansicht und Passphrase aktiviert",
  heroCaption:
    "Teilen Sie einen sicheren Link—nicht das Passwort selbst—mit kurzer Gültigkeit, einmaligem Ansehen und optionaler Passphrase.",
  intro: [
    "Ein Passwort zu teilen wirkt wie eine alltägliche Kleinigkeit—bis etwas schiefgeht.",
    "Ob ein Kollege vorübergehend Zugang zu einem internen Tool braucht, der Kundensupport Systemzugang anfragt oder Sie WLAN-Zugangsdaten an einen Besucher senden müssen: Die schnellste Option fühlt sich oft an, als würde man das Klartext-Passwort in einen Microsoft-Teams-Chat, eine WhatsApp-Nachricht oder eine kurze E-Mail einfügen.",
    "Leider hinterlässt diese Bequemlichkeit eine dauerhafte digitale Spur. Sobald ein Geheimnis in diese Kanäle gelangt, wird es geräteübergreifend synchronisiert, über Suchfunktionen indexierbar, in automatischen Postfach-Backups gespeichert und in Unternehmens-Nachrichtenarchiven auf unbestimmte Zeit aufbewahrt. Ein Passwort, das vorübergehend gedacht war, wird zur dauerhaften Haftung.",
    "Glücklicherweise gibt es einen besseren Weg, Ihre Zugangsdaten zu schützen.",
  ],
  sections: [
    {
      title: "Das Kernproblem beim Teilen im Klartext",
      paragraphs: [
        "E-Mail und Chat-Anwendungen sind ausgezeichnete Kollaborationsplattformen, waren aber nie dafür gedacht, Geheimnisse zu speichern. Moderne Systeme verschlüsseln Daten in der Regel während der Übertragung—doch an Ephemeralität mangelt es: Geheimnisse verschwinden nicht, sobald sie ihren Zweck erfüllt haben.",
        "Wenn Sie ein Passwort in einen normalen Chat oder E-Mail-Thread einfügen, verlieren Sie sofort die Kontrolle über dessen Lebenszyklus. Es bleibt in Postfächern gespeichert, Jahre später in Chat-Protokollen durchsuchbar und in Gerätebenachrichtigungen oder Sperrbildschirmen sichtbar. Wird irgendwann Ihr Konto oder das des Empfängers kompromittiert, werden diese Klartext-Chatverläufe zur Goldgrube für Angreifer.",
      ],
    },
    {
      title: "DSGVO (GDPR) und Compliance-Risiken in Europa",
      paragraphs: [
        "Für europäische Organisationen ist das nicht nur ein Sicherheits-, sondern ein Compliance-Risiko. Nach der Datenschutz-Grundverordnung (DSGVO / GDPR) sind Unternehmen gesetzlich verpflichtet, den Zugang zu personenbezogenen Daten mit dem Stand der Technik entsprechenden technischen und organisatorischen Maßnahmen zu schützen.",
        "Aktive Zugangsdaten in US-gehostete Cloud-Chat-Protokolle oder unverschlüsselte E-Mail-Server ohne dedizierte Ende-zu-Ende-Verschlüsselung einzufügen, kann die Compliance-Exposition erhöhen—besonders wenn diese Passwörter Zugang zu Datenbanken mit Kunden- oder Mitarbeiterdaten gewähren.",
        "Lokale, browserseitige Verschlüsselung verringert drastisch, wo Zugangsdaten liegen bleiben können, und hält den Alltagsübergabeprozess auf einen privacy-first-Ansatz ausgerichtet. Dies ist keine Rechtsberatung; behandeln Sie sicheres Teilen von Zugangsdaten als einen Teil von Zugangskontrolle, Passwortverwaltung und Rotationsrichtlinien.",
      ],
    },
    {
      title: "So funktionieren browserseitig verschlüsselte Links",
      paragraphs: [
        "Für schnelles, einmaliges Passwort-Sharing gehören browserverschlüsselte Einmallinks zu den sichersten und effizientesten Optionen. Statt die Zugangsdaten selbst zu senden, senden Sie einen eindeutigen, temporären Link zu einer verschlüsselten Notiz. [Was ein Einmal-Link ist](blog:one-time-secret-links) erklärt das Modell hinter dieser Übergabe.",
        "Ihr Browser übernimmt die schwere Arbeit: Das Passwort wird lokal vor dem Upload verschlüsselt, sodass der Zwischenserver nur Ciphertext speichert—nicht Ihr Rohpasswort. Der Entschlüsselungsschlüssel bleibt typischerweise im Link-Fragment, das Browser nicht an den Server senden.",
      ],
      flowIntro:
        "Um ein Geheimnis über einen temporären, selbstzerstörenden Link zu teilen, folgen Sie diesen vier Schritten:",
      flowSteps: [
        {
          step: "Schritt 1",
          title: "Eingabe und lokale Verschlüsselung",
          body: "Geben Sie das Passwort in ein sicheres Tool ein. Ihr Browser verschlüsselt es lokal mit einem Schlüssel, der Ihre Maschine nie als Klartext verlässt.",
        },
        {
          step: "Schritt 2",
          title: "Link erzeugen",
          body: "Das Tool lädt nur die verschlüsselte Nutzlast auf einen Zero-Knowledge-Server hoch und baut einen eindeutigen Freigabelink. Das Entschlüsselungsmaterial bleibt beim Link—nicht in einem serverseitigen Tresor lesbarer Geheimnisse.",
        },
        {
          step: "Schritt 3",
          title: "Link senden",
          body: "Kopieren und senden Sie den Link über Microsoft Teams, E-Mail oder WhatsApp. Die Chat-Plattform sieht eine URL, nicht Ihr Passwort.",
        },
        {
          step: "Schritt 4",
          title: "Anzeigen und Selbstzerstörung",
          body: "Der Browser des Empfängers entschlüsselt den Inhalt lokal. Je nach Freigaberichtlinie kann die verschlüsselte Nutzlast danach vom Server entfernt werden—nach dem Ansehen oder nach einem kurzen Ablaufzeitfenster.",
        },
      ],
      midCta: {
        body: "Müssen Sie jetzt ein Passwort teilen? Erstellen Sie eine verschlüsselte Einmalnotiz und senden Sie den sicheren Link statt des Passworts selbst.",
        button: "Private Notiz erstellen",
      },
    },
    {
      title: "High-Security-Tipp: Split-Channel-Sharing",
      paragraphs: [
        "Ein verschlüsselter Link ist nur so sicher wie der Kanal, über den Sie ihn senden. Verschafft sich ein Angreifer Zugang zu Ihrem Teams- oder E-Mail-Posteingang, könnte er den Link abfangen, bevor Ihr Empfänger ihn öffnet.",
        "Viele sichere Sharing-Tools—einschließlich PrivateNote.ai—bieten eine optionale Einstellung, die Notiz mit einem zusätzlichen Passwort zu schützen (Passphrase-Wrapping). Das ist standardmäßig nicht aktiv: Sie schalten es beim Erstellen der Notiz ein, wählen eine Passphrase, und der Empfänger muss sie eingeben, bevor das Geheimnis angezeigt wird.",
        "Um einen Single Point of Failure (SPoF) bei besonders sensiblen Zugangsdaten zu vermeiden, nutzen Sie diese Option für Split-Channel-Sharing: Erzeugen Sie den verschlüsselten Link mit aktiviertem Passphrase-Schutz, senden Sie den Link über Ihren Primärkanal (zum Beispiel Microsoft Teams) und die Passphrase über einen völlig anderen Kanal—vorzugsweise einen privacy-fokussierten Messenger wie Signal oder Threema, oder ein kurzes Telefonat.",
      ],
      callout:
        "Ein Angreifer bräuchte sowohl den Link als auch die Passphrase. Genau diese Trennung macht Split-Channel-Sharing wirksam.",
    },
    {
      title: "Passwortmanager-Sharing vs. Einmallinks",
      paragraphs: [
        "Beide Methoden können sehr sicher sein, dienen aber unterschiedlichen Zwecken. Das richtige Tool hängt davon ab, wie lange der Empfänger Zugang braucht.",
      ],
      comparisonTable: {
        headers: ["Kategorie", "Ideal für", "Technische Einschränkungen"],
        rows: [
          [
            "E-Mail, Teams oder WhatsApp",
            "Nicht empfohlen für Passwörter",
            "Hinterlässt dauerhafte, durchsuchbare Klartextkopien in Backups und Archiven",
          ],
          [
            "Passwortmanager",
            "Dauerhafter Zugang: Vaults mit Familienmitgliedern, internen Abteilungen oder vertrauenswürdigen Kernteams teilen",
            "Beide Parteien müssen aktive, kompatible Passwortmanager-Konten pflegen",
          ],
          [
            "Verschlüsselte Einmallinks",
            "Temporärer Zugang: Freelancer, Kundensupport, Besucher und einmalige Übergaben",
            "Jeder mit dem Link kann das Geheimnis lesen, sofern nicht durch eine sekundäre Passphrase geschützt",
          ],
        ],
        after: [
          "Faustregel: Nutzen Sie einen **Passwortmanager** für dauerhaft geteilten Zugang und einen **verschlüsselten Einmallink**, wenn die Zugangsdaten bald nach der Übergabe geändert werden sollten.",
        ],
      },
    },
    {
      title: "Wann Sie einen Einmal-Passwort-Link nutzen sollten",
      paragraphs: [
        "Einmaliges Passwort-Sharing eignet sich ideal für transaktionale Zugangsdaten, die nur einmal kommuniziert werden müssen. Typische Beispiele aus europäischen Arbeitsumfeldern:",
      ],
      useCaseTable: {
        headers: ["Abteilung", "Häufige Anwendungsfälle"],
        rows: [
          [
            "Administration & Büro",
            "Router- oder Gäste-WLAN-Passwörter, Drucker-Admin-Zugangsdaten oder Smart-Office-Einstellungen",
          ],
          [
            "Finanzen & Business",
            "Zugangsdaten für Ihren Steuerberater oder externe Wirtschaftsprüfer",
          ],
          [
            "IT & Operations",
            "Onboarding temporärer externer IT-Dienstleister oder Teilen temporärer Auftragnehmer-Logins",
          ],
          [
            "Technische Teams",
            "Datenbank-Zugangsdaten, API-Schlüssel, SSH-Schlüssel oder Cloud-Plattform-Passwörter mit Entwicklern",
          ],
        ],
      },
    },
    {
      title: "Best Practices und Fallstricke",
      subsections: [
        {
          title: "Rotation durchsetzen",
          paragraphs: [
            "Behandeln Sie jedes geteilte Passwort als vorübergehend. Bitten Sie den Empfänger, es sofort nach dem Login zu ändern, und bestätigen Sie die abgeschlossene Rotation, bevor Sie die Übergabe als erledigt betrachten.",
          ],
        },
        {
          title: "Starke, lokale Passwörter erzeugen",
          paragraphs: [
            "Erfinden Sie keine Passwörter selbst. Nutzen Sie ein lokales Tool wie den PrivateNote-[Passwortgenerator](app:password-generator) oder [passwords.lu](https://passwords.lu) für Passphrase- und PIN-Optionen. Beide laufen lokal—nichts wird hochgeladen. Zum technischen Modell siehe [How We Generate Secure Passwords](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Ablaufzeiten kurz halten",
          paragraphs: [
            "Die meisten Passwörter müssen nur wenige Minuten oder Stunden existieren. Bevorzugen Sie eine einzige Ansicht oder ein kurzes Fenster wie zwei Stunden, wenn das noch zum Workflow des Empfängers passt.",
          ],
        },
        {
          title: "Keine Passwörter in Titeln oder Betreffzeilen",
          paragraphs: [
            "Platzieren Sie niemals Klartext-Passwörter in E-Mail-Betreffzeilen, Ticket-Titeln, Teams-Kanalnamen, WhatsApp-Gruppentiteln, Dokumentnamen oder Kalendereinladungen. Diese Felder werden selten mit derselben Sorgfalt behandelt wie Nachrichtentexte—und sie bleiben in Suchindizes bestehen.",
          ],
        },
        {
          title: "Kontext aus der sicheren Notiz herauslassen",
          paragraphs: [
            "Wenn Sie ein Datenbankpasswort teilen, schreiben Sie nicht „Datenbankpasswort für Production-CRM: MySecret123!“ in die Notiz. Legen Sie nur das rohe Geheimnis in den verschlüsselten Link. Wird der Link abgefangen, sollte der Angreifer nicht auch erfahren, welches Konto oder System er freischaltet.",
          ],
        },
      ],
      calloutTitle: "Häufiger Fehler",
      callout:
        "Den verschlüsselten Link und seine Passphrase in derselben Teams-Nachricht, WhatsApp-Chat oder E-Mail zu senden, unterläuft Split-Channel-Sharing und erzeugt erneut einen Single Point of Failure.",
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Sind Microsoft Teams oder WhatsApp sicherer als E-Mail?",
          answer:
            "Ihre Übertragungsprotokolle sind in der Regel sicher, funktionieren aber weiterhin als langfristige Chat-Archive. Jedes in einen Thread eingefügte Passwort kann auf unbestimmte Zeit durchsuchbar bleiben—und damit eine dauerhafte Schwachstelle darstellen.",
        },
        {
          question: "Beeinflusst die DSGVO (GDPR), wie ich Passwörter teile?",
          answer:
            "Nach Artikel 32 DSGVO müssen Organisationen geeignete technische und organisatorische Maßnahmen zum Schutz personenbezogener Daten umsetzen. Klartext-Passwörter in Cloud-Backups oder offenen E-Mail-Ketten zu speichern, erhöht die Compliance-Exposition. Zero-Knowledge-, selbstzerstörende Links halten den Fußabdruck der Zugangsdaten kleiner.",
        },
        {
          question: "Soll ich Link und Passphrase zusammen senden?",
          answer:
            "Nein. Beide Teile in derselben Nachricht zu senden, unterläuft Split-Channel-Sharing. Senden Sie die Passphrase über ein anderes Medium—vorzugsweise Signal oder Threema, oder telefonisch.",
        },
        {
          question: "Passwortmanager oder Einmallink?",
          answer:
            "Nutzen Sie einen Passwortmanager für langfristig geteilten Zugang. Nutzen Sie einen browserverschlüsselten Einmallink, wenn Sie ein Passwort nur einmal kommunizieren müssen.",
        },
        {
          question: "Brauche ich trotzdem einen Passwortmanager?",
          answer:
            "Ja. Passwortmanager bleiben der richtige Ort, um Zugangsdaten zu speichern und zu verwalten, die Sie behalten. Verschlüsselte Einmallinks ergänzen sie für kontrollierte, temporäre Übergaben.",
        },
      ],
    },
    {
      title: "Fazit",
      paragraphs: [
        "Sicheres Passwort-Sharing muss kein Engpass für Ihren Workflow sein. Es braucht nur eine kleine Gewohnheitsänderung: Sensible Daten nicht dauerhaft in Chat-Protokollen und Posteingangsverläufen liegen lassen.",
        "Mit lokaler, browserseitiger Verschlüsselung und selbstzerstörenden Links senken Sie organisatorisches Sicherheits- und Compliance-Risiko—und halten Übergaben schnell und praxisnah.",
        "Wenn Sie das nächste Mal ein Passwort teilen müssen, fügen Sie es nicht in Microsoft Teams, WhatsApp oder E-Mail ein. Erstellen Sie eine verschlüsselte Einmalnotiz, senden Sie den Link statt des Passworts und lassen Sie die Notiz nach Erfüllung ihres Zwecks ablaufen.",
      ],
    },
  ],
  ctaTitle: "Bereit, sicher zu teilen?",
  ctaBody:
    "Erstellen Sie eine private Notiz auf PrivateNote.ai, um Zugangsdaten im Browser vor dem Upload zu verschlüsseln. Notizen können automatisch oder nach dem Lesen ablaufen, optionaler Passphrase-Schutz fügt eine weitere Schicht hinzu, und verschlüsselte Notizdaten werden unter EU-Rechtsraum verarbeitet.",
  ctaButton: "Private Notiz erstellen",
};
