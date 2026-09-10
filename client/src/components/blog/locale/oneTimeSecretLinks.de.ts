import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksDe: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Ein **Einmal-Link** ist eine URL, mit der sich vertrauliche Informationen übergeben lassen, ohne den Klartext dauerhaft in E-Mail oder Chat zu hinterlassen. Die Empfängerin öffnet den Link, klickt zum Anzeigen, und die verschlüsselte Kopie auf dem Server wird danach gemäß den Zugriffs- und Ablaufregeln unzugänglich.",
    "Sinnvoll ist das für Passwörter, API-Schlüssel, Wiederherstellungscodes, temporäre Zugangsdaten und private Nachrichten, die einmal ankommen sollen und keinen dauerhaften Gesprächsverlauf brauchen.",
    "Das eigentliche Problem ist oft nicht das Abfangen unterwegs. Es ist die **Aufbewahrung**. Verschlüsselung schützt vor unbefugtem Zugriff. Begrenzte Lebensdauer verringert, wie lange unnötige Kopien weiter existieren. Ein Einmal-Link löst eine dritte Aufgabe: die **kurzfristige Übergabe**.",
  ],
  earlyCta: {
    body: "Sie möchten jetzt etwas vertraulich teilen?",
    linkLabel: "Einmal-Link mit PrivateNote erstellen",
  },
  sections: [
    {
      title: "Was ist ein Einmal-Link?",
      paragraphs: [
        "Die Bezeichnungen wechseln: Einmal-Link, One-Time-Link, geheimer Link, geheime Nachricht, private Notiz, verschlüsselte Nachricht, selbstzerstörende Nachricht oder ein Link, der nach einmaligem Öffnen gelöscht wird. Der Name sagt wenig über die Sicherheit aus.",
        "Ein Dienst, der etwas als „One-Time-Secret“ bezeichnet, verschlüsselt deshalb nicht automatisch im Browser. Er kann den Inhalt trotzdem lesen, den Schlüssel selbst erzeugen, erst nach einem Zeitplan löschen oder Metadaten behalten. Das sind Entwurfsentscheidungen. Prüfen Sie die Eigenschaften, nicht das Etikett.",
        "Nützlich sind Fragen wie: Wo wird der Klartext verschlüsselt? Erhält der Server den Schlüssel? Was passiert nach dem vorgesehenen Abruf? Wie lange bleibt ein ungenutzter Link gültig? Was sieht eine Chat-Vorschau, wenn jemand die URL einfügt?",
      ],
    },
    {
      title: "Wie funktioniert ein Einmal-Link?",
      paragraphs: [
        "Bei einem clientseitigen Entwurf wie dem von PrivateNote wird der Inhalt im Browser der sendenden Person verschlüsselt, bevor er hochgeladen wird. Der Server speichert Chiffretext. Entschlüsselt wird im Browser der empfangenden Person. Nachrichtentext nutzt AES-256-GCM über die Web Crypto API.",
      ],
      beforeFlowSteps: "**In der Praxis sieht der Ablauf so aus:**",
      flowSteps: [
        {
          title: "Schlüssel und Verschlüsselung im Browser",
          step: "Schritt 1: Ihr Browser",
          body: "Sie schreiben den Inhalt lokal. Der Browser erzeugt kryptografisches Material und verschlüsselt den Klartext, bevor eine Anfrage das Gerät verlässt.",
        },
        {
          title: "Upload des Chiffretexts",
          step: "Schritt 2: Der Server",
          body: "Hochgeladen wird nur die verschlüsselte Nutzlast. Der Server speichert Chiffretext, den er nicht lesen kann, weil er weder Klartext noch den Fragment-Schlüssel erhält.",
        },
        {
          title: "Schlüssel bleibt im Link",
          step: "Schritt 3: Die URL",
          body: "Der Entschlüsselungsschlüssel liegt im URL-Fragment—dem Teil nach #. Der öffentliche Pfad identifiziert die Notiz; das Fragment bleibt bei normaler Navigation im Browser.",
        },
        {
          title: "Anzeigen, entschlüsseln, Zugriffsregeln anwenden",
          step: "Schritt 4: Die empfangende Person",
          body: "Die Seite zu öffnen reicht nicht. Erst ein Klick auf „Notiz anzeigen“ holt den Chiffretext. Der Browser entschlüsselt lokal. Nach erfolgreichem Anzeigen gilt das Öffnungslimit—standardmäßig eine Öffnung—und der Server löscht den Chiffretext, sobald dieses Limit erreicht ist. Ungenutzte Links laufen zusätzlich nach Zeit ab.",
        },
      ],
      afterFlowSteps: [
        "Nicht jedes Produkt, das als Einmal-Link angeboten wird, folgt diesem Muster. Manche Dienste verschlüsseln erst auf dem Server oder erzeugen den Schlüssel dort und könnten den Inhalt lesen. Andere löschen nach Zeitplan, behalten aber wiederherstellbare Kopien. Fragen Sie nach dem gesamten Entwurf—nicht nur danach, ob der Link abläuft.",
        "Zur Verschlüsselungsarchitektur von PrivateNote, einschließlich Passwortschutz mit Argon2id, siehe [So funktioniert PrivateNote](app:how-it-works).",
      ],
    },
    {
      title: "Warum das URL-Fragment wichtig ist",
      paragraphs: [
        "Dieses Detail ist leicht zu übersehen—und trägt die Architektur.",
        "Bei einer normalen HTTPS-Navigation sendet der Browser Pfad und Query an den Server. Das [URL-Fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—alles nach #—bleibt im Browser und gehört nicht zu dieser Anfrage. Ein durchdachtes System kann Chiffretext unter einer Notiz-ID wie `/note/abc123` speichern und das Entschlüsselungsmaterial in `#…` halten, außerhalb gewöhnlicher Server-Logs für diesen Seitenaufruf.",
        "Ein Schlüssel hinter # macht eine Anwendung nicht von selbst sicher. Die Kryptografie drumherum muss stimmen: ein starker Zufallsschlüssel, authentifizierte Verschlüsselung und ein Server, der den Klartext nicht braucht. Das Fragment trennt diese Teile—es ersetzt sie nicht.",
      ],
    },
    {
      title: "Einmal-Link, ablaufender Link und verschwindende Nachricht",
      paragraphs: [
        "Diese drei Dinge werden oft in einen Topf geworfen. Es sind unterschiedliche Steuerungen, und ein Dienst kann sie kombinieren.",
      ],
      bullets: [
        {
          label: "Einmal-Link",
          body: "Die Verfügbarkeit hängt vor allem vom Zugriff ab. Nach dem vorgesehenen Abruf—bei PrivateNote nach erfolgreichem Anzeigen bis zum Öffnungslimit—ist die verschlüsselte Nutzlast auf dem Server weg.",
        },
        {
          label: "Ablaufender Link",
          body: "Die Verfügbarkeit hängt vor allem von der Zeit ab. Der Link bleibt abrufbar, bis die Frist endet, unabhängig davon, ob jemand geöffnet hat.",
        },
        {
          label: "Verschwindende Nachricht",
          body: "Teil eines laufenden Gesprächs. Die Aufbewahrung folgt den Regeln des Messengers und kann Backups, Zitate oder Kopien auf Geräten hinterlassen.",
        },
      ],
      callout:
        "**PrivateNote kombiniert Zugriff und Zeit.** Neue Nachrichten sind standardmäßig auf eine erfolgreiche Anzeige begrenzt und laufen ungenutzt ab—standardmäßig nach einem Tag, mit kürzeren oder längeren Vorgaben je nach Tarif. Das ist Übergabe auf Zeit: abrufen oder warten, dann ist die serverseitige Kopie weg.",
    },
    {
      title: "Sind Einmal-Links sicher?",
      paragraphs: [
        "Sie können es sein. Die Sicherheit hängt von der Umsetzung und vom Umgang mit dem Link ab—nicht von der Bezeichnung.",
        "Ein belastbarer Entwurf berücksichtigt clientseitige Verschlüsselung, starke Zufallsschlüssel, was der Server sehen kann, Ablauf, Zugriffsregeln, optionalen Passwortschutz, optionale Empfängerprüfung, Metadaten, Link-Leaks, kompromittierte Endgeräte und das Verhalten der empfangenden Person.",
        "PrivateNote verschlüsselt im Browser, speichert Chiffretext, hält den Schlüssel im URL-Fragment, erlaubt standardmäßig eine Anzeige und lässt ungenutzte Notizen ablaufen. Bei Bedarf können Sie ein Passwort setzen oder, in bezahlten Tarifen, eine Prüfung der Empfängerin. Zum Öffnen ist kein Konto nötig.",
        "Ein Einmal-Link schützt **nicht** vor einem kompromittierten Gerät, vor jemandem, der den Inhalt nach dem Anzeigen kopiert, vor Screenshots oder Fotos und nicht davor, die vollständige URL inklusive Fragment an die falsche Person zu senden. Behandeln Sie den ganzen Link wie das Geheimnis selbst.",
      ],
    },
    {
      title: "Wann ist ein Einmal-Link sinnvoll?",
      paragraphs: [
        "Dann, wenn ein Geheimnis nur eine kurze Aufgabe hat: ankommen, genutzt werden und nicht im Kanal bleiben, über den Sie es geschickt haben.",
      ],
      subsections: [
        {
          title: "Passwörter",
          paragraphs: [
            "Gut geeignet, um ein neues oder temporäres Passwort an eine Person zu übergeben, ohne den Klartext in Postfach oder Chat zu lassen. Den Ablauf beschreibt [Passwort sicher teilen](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "API-Schlüssel und Tokens",
          paragraphs: [
            "Entwicklerinnen und externe Partner brauchen einen Schlüssel oft nur einmal. Über den Link bleibt das Rohgeheimnis aus Slack, Tickets und Git heraus. Siehe [API-Schlüssel sicher teilen](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Wiederherstellungscodes",
          paragraphs: [
            "Sinnvoll, wenn ein Backup- oder 2FA-Code wirklich zu einer anderen berechtigten Person muss—und danach nicht in dem Thread auffindbar bleiben soll, der ihn transportiert hat.",
          ],
        },
        {
          title: "Private Nachrichten",
          paragraphs: [
            "Informationen, die einmal gesagt sein müssen, ohne dauerhaften Chatverlauf. Empfängerinnen brauchen kein Konto. Siehe [geheime Nachricht ohne Konto senden](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Sensible Dateien",
          paragraphs: [
            "Dateien brauchen extra Aufmerksamkeit: Größe, Download, Vorschau und ein eigenes Zugriffsfenster nach dem Öffnen. Zum Senden einer Datei ist bei PrivateNote ein Konto nötig; zum Öffnen nicht. Anhänge bleiben nach dem Anzeigen für ein begrenztes Fenster abrufbar—standardmäßig eine Stunde. Nutzen Sie die [sichere Dateiübertragung](app:secure-file-transfer), wenn die Nutzlast ein Dokument ist und kein kurzes Geheimnis.",
          ],
        },
      ],
    },
    {
      title: "Wann sollten Sie keinen nutzen?",
      paragraphs: [
        "Ein Einmal-Link ist das falsche Werkzeug, wenn Speichern, Zusammenarbeit oder eine aufbewahrungspflichtige Akte die Aufgabe sind.",
      ],
      poorFits: [
        "Langzeitspeicherung von Passwörtern: nutzen Sie einen Passworttresor.",
        "Laufende Gespräche: nutzen Sie einen Messenger, dem beide Seiten vertrauen, etwa Signal.",
        "Unternehmensunterlagen, die für Prüfung oder rechtliche Aufbewahrung bleiben müssen.",
        "Geheimnisse, die gar nicht übertragen werden müssen—vor Ort erzeugen oder nicht teilen.",
        "Krypto-Seed-Phrasen und andere nicht ersetzbare Master-Geheimnisse: ein Link kann trotzdem leaken, wenn die vollständige URL kopiert wird. Lesen Sie [Krypto-Seed-Phrasen und Einmal-Links](blog:crypto-seed-phrase-one-time-link), bevor Sie dieses Muster dort verwenden.",
      ],
    },
    {
      title: "Einmal-Links im Vergleich zu E-Mail, Messengern und Passwortmanagern",
      paragraphs: [
        "Der sinnvolle Vergleich gilt Zweck und Aufbewahrung—nicht der Frage, welcher Kanal „sicher“ sei.",
      ],
      comparisonTable: {
        headers: ["Methode", "Hauptzweck", "Ende-zu-Ende", "Typische Aufbewahrung", "Geeignet für kurzfristige Geheimnis-Übergabe?"],
        rows: [
          [
            "E-Mail",
            "Dauerhafte Korrespondenz",
            "Transportverschlüsselung ist üblich; Ende-zu-Ende ist in der Regel nicht Standard",
            "Meist in mehreren Postfächern, Backups und der Suche",
            "Schlecht geeignet für Klartext-Geheimnisse",
          ],
          [
            "Slack / Teams",
            "Arbeitsgespräch und Suche",
            "Unterwegs und auf der Plattform verschlüsselt; nicht standardmäßig Ende-zu-Ende",
            "Durchsuchbarer, exportierbarer Workspace-Verlauf",
            "Schlecht für Klartext-Geheimnisse; akzeptabel, um einen Link zu senden",
          ],
          [
            "SMS / iMessage",
            "Persönliche Nachrichten",
            "Je nach Anbieter und Plattform sehr unterschiedlich",
            "Oft gesichert oder in der Cloud synchronisiert",
            "Schlecht geeignet für Klartext-Geheimnisse",
          ],
          [
            "WhatsApp",
            "Privates Gespräch",
            "Chats Ende-zu-Ende; Backups nicht unbedingt",
            "Kopien auf dem Gerät und optional in der Cloud",
            "Besser als E-Mail für das Gespräch; trotzdem kein Ort für ein Passwort",
          ],
          [
            "Signal",
            "Privates Gespräch",
            "Ende-zu-Ende",
            "Verschwindende Nachrichten sind einstellbar",
            "Eine vernünftige Alternative, wenn beide Seiten Signal nutzen",
          ],
          [
            "Passwortmanager",
            "Zugangsdaten speichern und teilen",
            "Ja, vom Entwurf her",
            "Für dauerhafte Aufbewahrung gebaut",
            "Sehr gut für Teams und dauerhaften Zugang; oft zu schwer für eine einmalige Übergabe",
          ],
          [
            "PrivateNote",
            "Verschlüsselte Übergabe auf Zeit",
            "Clientseitige Verschlüsselung; Schlüssel im URL-Fragment",
            "Öffnungslimit plus zeitlicher Ablauf; Chiffretext wird gelöscht, wenn die Bedingungen erfüllt sind",
            "Genau für diesen Fall gebaut",
          ],
        ],
      },
    },
    {
      title: "Das Problem der Link-Vorschau",
      paragraphs: [
        "Viele Chat-Apps rufen eine eingefügte URL ab, um eine Vorschau zu bauen—Titel, Beschreibung, Bild. Würde schon der Seitenaufruf als Lesen zählen, würde dieser Abruf einen Einmal-Link verbrauchen, bevor die Empfängerin klickt.",
        "PrivateNote zählt einen Seitenaufruf nicht als Öffnung. Die öffentliche Notiz-URL zeigt zuerst eine Bestätigung. Metadaten für diese Seite lassen sich holen, ohne Klartext zu liefern. Der Chiffretext kommt erst nach einem bewussten Klick auf „Notiz anzeigen“. Eine Vorschau in Slack, Teams oder iMessage erhält den Inhalt nicht und verbraucht das Öffnungslimit nicht.",
        "Das ist eine Entscheidung in Client und API, keine Liste gesperrter Crawler. Trotzdem zählt, wie Sie den Link senden: Wer die vollständige URL inklusive Fragment hat und auf Anzeigen klickt, kann die Notiz lesen. Zur Warnung vor dem Öffnen siehe [warum Notizen auf Klick warten](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "So erstellen Sie einen Einmal-Link",
      paragraphs: ["Die Schritte sind kurz. Das Werkzeug verschlüsselt; Sie legen die Zugriffsregeln fest."],
      numberedSteps: [
        { title: "PrivateNote öffnen", body: "Nutzen Sie den Editor auf der Website—für eine Textnotiz ist kein Konto nötig." },
        { title: "Inhalt eingeben", body: "Ein Passwort, eine Nachricht, ein API-Schlüssel oder, mit Konto, eine Datei." },
        {
          title: "Ablauf und Zugriff wählen",
          body: "Wählen Sie die kürzeste sinnvolle Gültigkeit. Standard ist eine Öffnung und ein Tag für ungenutzte Links. Setzen Sie ein Passwort oder eine Empfängerprüfung, wenn die Sensibilität das rechtfertigt.",
        },
        { title: "Verschlüsselten Link erzeugen", body: "Der Browser verschlüsselt zuerst und lädt dann den Chiffretext hoch." },
        { title: "Link an die vorgesehene Person senden", body: "Fügen Sie den Klartext nicht zusätzlich in dieselbe Nachricht." },
      ],
      closingNote: "Wenn Sie so weit sind, [erstellen Sie einen Einmal-Link](app:one-time-link).",
    },
    {
      title: "Bevor Sie ein Geheimnis senden",
      paragraphs: ["Eine sorgfältige Übergabe ist vor allem organisatorisch. Die Kryptografie korrigiert keine falsche Empfängerin."],
      checklist: [
        "Prüfen Sie die Empfängerin, bevor Sie die vollständige URL senden.",
        "Wählen Sie die kürzeste sinnvolle Gültigkeit.",
        "Setzen Sie ein Passwort oder eine Empfängerprüfung, wenn die Sensibilität das rechtfertigt.",
        "Senden Sie zusätzliche Authentisierung über einen anderen Kanal.",
        "Rotieren Sie temporäre Zugangsdaten nach der Nutzung.",
        "Übertragen Sie keine Geheimnisse, die nicht übertragen werden müssen.",
        "Rechnen Sie damit, dass nach dem Anzeigen kopiert, fotografiert oder ein Screenshot gemacht werden kann.",
      ],
    },
    {
      title: "Häufige Fragen",
      paragraphs: [],
      faqs: [
        {
          question: "Was ist ein Einmal-Link?",
          answer:
            "Eine URL, die ein Geheimnis zur Abholung übergibt. Die verschlüsselte Kopie auf dem Server wird danach nach Zugriffs- und Ablaufregeln unzugänglich—der Klartext muss nicht in E-Mail oder Chat liegen.",
        },
        {
          question: "Wie funktioniert ein Link, der nur einmal geöffnet werden kann?",
          answer:
            "Der Browser der sendenden Person verschlüsselt den Inhalt, der Server speichert Chiffretext, der Schlüssel bleibt im URL-Fragment. Die empfangende Person zeigt die Notiz an; ihr Browser entschlüsselt lokal.",
        },
        {
          question: "Wie kann ich eine geheime Nachricht per Link senden?",
          answer:
            "Inhalt eingeben, Ablauf und Öffnungen festlegen, den verschlüsselten Link erzeugen und nur den Link schicken—nicht den Klartext daneben.",
        },
        {
          question: "Kann ich ein Passwort über einen Einmal-Link teilen?",
          answer:
            "Ja. Legen Sie das Passwort in die Notiz, nicht in die Chatnachricht mit dem Link. Tipps zur Kanaltrennung stehen unter [Passwort sicher teilen](blog:how-to-share-a-password-securely).",
        },
        {
          question: "Ist ein Einmal-Link sicherer als E-Mail?",
          answer:
            "Für das Geheimnis selbst ja, weil E-Mail den Klartext behält. Der Link darf trotzdem per E-Mail reisen; im Postfach liegt dann eine URL, nicht das Passwort.",
        },
        {
          question: "Was passiert nach dem Öffnen?",
          answer:
            "Bei PrivateNote zählt ein erfolgreiches Anzeigen als Öffnung. Mit dem Standard von einer Öffnung löscht der Server danach den Chiffretext. Im bereits geöffneten Browser kann der Inhalt sichtbar bleiben. Ungenutzte Links laufen zusätzlich nach Zeit ab.",
        },
        {
          question: "Kann der Empfänger die Nachricht trotzdem kopieren oder einen Screenshot machen?",
          answer:
            "Ja. Was auf dem Bildschirm steht, lässt sich kopieren oder fotografieren. Ein Einmal-Link begrenzt die Originalkopie auf dem Server; er ist kein Kopierschutz.",
        },
        {
          question: "Was ist der Unterschied zwischen einem Einmal-Link und einem ablaufenden Link?",
          answer:
            "Einmal bezieht sich auf den Zugriff: nach dem vorgesehenen Abruf weg. Ablauf bezieht sich auf die Zeit: nach der Frist weg, auch ohne Öffnung. PrivateNote nutzt beides.",
        },
        {
          question: "Braucht der Empfänger ein PrivateNote-Konto?",
          answer:
            "Nein. Mit dem vollständigen Link lässt sich eine ungeschützte Notiz öffnen. Ein Passwort oder eine Prüfung gilt nur, wenn die sendende Person das eingeschaltet hat.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Kanaltyp",
    encrypted: "Verschlüsselt?",
    persistent: "Persistent?",
    verdict: "Gut für One-Time-Geheimnisse?",
  },
  goodFitsLabel: "Gute Einsatzfälle",
  poorFitsLabel: "Schlechte Einsatzfälle",
  closingTitle: "Wo PrivateNote passt",
  closingBody:
    "PrivateNote ist ein Werkzeug für die Übergabe. Es ist kein langfristiger Passworttresor, kein Team-Wiki und kein Archiv für Aufbewahrungspflichten. Im Browser verschlüsseln, einen befristeten Link teilen, die serverseitige Kopie entfernen, wenn die Aufgabe erledigt ist.",
  encryptLu: "",
  tagline: "Die Lebensdauer des Geheimnisses sollte zur Lebensdauer des Mediums passen, das es trägt.",
  relatedReading: "Weiterlesen",
  ctaTitle: "Einmal-Link erstellen",
  ctaBody: "Verschlüsseln Sie eine Nachricht, ein Passwort oder eine Datei im Browser und teilen Sie sie über einen befristeten Link.",
  ctaButton: "Sicheren Link erstellen",
};
