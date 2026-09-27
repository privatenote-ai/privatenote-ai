import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersDe: SecureClientDeliveryForLawyersArticleCopy = {
  heroKicker: "Datenschutz für Anwaltskanzleien",
  intro: [
    "Für vertrauliche anwaltliche Mitteilungen ist Verschlüsselung nur ein Teil der Risikoanalyse. Eine weitere praktische Frage lautet: Wer kann später eine schriftliche Aufzeichnung wiederfinden — und wie lange bleibt sie erhalten? In Deutschland, Österreich und der Schweiz geht es um anwaltliche Verschwiegenheit und Berufsgeheimnis.",
    "Kanzleien wissen, dass E-Mail kein Tresor für Mandatsgeheimnisse ist. Viele weichen deshalb auf Signal oder WhatsApp aus, weil „es verschlüsselt ist“. Das greift zu kurz. Diese Dienste sind darauf angelegt, ein Gespräch zu bewahren. Viele mandatsbezogene Mitteilungen sollen das Gegenteil leisten: eine Weisung, einen Entwurf oder eine Anlage dem Mandanten zu übermitteln — und danach keine weiteren Kopien anhäufen.",
    "Das Problem ist ebenso praktisch wie rechtlich. Ein erheblicher Teil der Mandantschaft installiert kein Signal. Sie legt keinen zweiten „sicheren“ Messenger neben den Familien-WhatsApp-Chat. Sie öffnet einen Link im Browser, der schon auf dem Gerät ist. Gerade in der Strafverteidigung braucht die Anwaltschaft deshalb einen Übertragungsweg, der wie Kanzleikorrespondenz wirkt — nicht wie eine Sprechblase aus einem sozialen Netzwerk.",
  ],
  sections: [
    {
      title: "Warum ein „sicherer Chat“ trotzdem einen dauerhaften Verlauf hinterlässt",
      paragraphs: [
        "Die Ende-zu-Ende-Verschlüsselung von Signal und WhatsApp schützt den Inhalt wirksam vor dem Zugriff des Anbieters. Doch Verschlüsselung und Speicherung sind zwei verschiedene Fragen. Eine Nachricht kann während der Übertragung stark geschützt sein und anschließend dennoch auf Geräten, in Backups oder auf verknüpften Rechnern auffindbar bleiben. Das ist die Frage, die für Kanzleiorganisation und Strafverteidigung entscheidend ist:",
      ],
      bullets: [
        "Bleibt ein durchsuchbarer Verlauf auf dem Telefon des Mandanten, auf dem Gerät eines Angehörigen oder auf einem Apparat, der später beschlagnahmt, verloren oder ausgewertet wird?",
        "Vervielfältigen Cloud-Sicherungen, verknüpfte Computer, Benachrichtigungsvorschauen und weitergeleitete Screenshots den Inhalt über die ursprünglichen Beteiligten hinaus?",
        "Entsteht — unbeabsichtigt — ein laufender schriftlicher Kommentar, der nie Teil der Handakte werden sollte, später aber als digitale Spur erscheint?",
      ],
      paragraphsAfterBullets: [
        "Dasselbe Muster kennt auch die übrige Berufswelt: geschriebene Nachrichten überleben den Anlass, zu dem sie gesendet wurden. Siehe [kurzlebige Notizen für Arbeitsplatznachrichten](blog:workplace-texts-private-note) und [warum Geheimnisse nicht in den Chat gehören](blog:secrets-never-send-in-chat). Für Ausweise, Arztberichte und Verträge gilt der Einwand ebenso für [E-Mail-Anhänge](blog:why-email-is-worst-for-secrets).",
        "PrivateNote dient der sicheren Übermittlung operativer Hinweise — nicht dem Ersatz der gesetzlichen Handakte. Einmalige Weisungen, Zugangsdaten, Formulierungsentwürfe nur für den Mandanten oder eine sensible Anlage, die nicht im Familienchat liegen muss, gehören nicht in den Messenger.",
      ],
    },
    {
      title: "Strafverteidigung, Haft und der Mandant ohne zweite App",
      paragraphs: [
        "Der Einwand ist in der Strafverteidigung besonders scharf. Der Mandant steht unter Druck, sitzt mitunter in Untersuchungshaft oder Strafhaft, nutzt das Telefon eines Angehörigen und ist selten in der Lage, ein eigenes Set an Datenschutzwerkzeugen einzuführen. Die Bitte, „einfach Signal zu installieren“, geht in vielen Mandaten ins Leere. WhatsApp ist oft bereits auf dem Gerät — und genau darin liegt das Problem. Es ist Teil des privaten Kommunikationsalltags: Familiennachrichten, Gruppen, Screenshots und vertrauliche anwaltliche Hinweise liegen nebeneinander.",
        "Wird das Smartphone sichergestellt, liegt der lokale Chatverlauf auf dem Gerät. PrivateNote ändert nicht, was Behörden rechtlich beschlagnahmen oder auswerten dürfen. Es zielt darauf, dass eine Weisung nicht standardmäßig als dauerhafter Verlauf in einer Unterhaltung liegen bleibt.",
        "Zu den Mitteilungen, die in diesem privaten Kommunikationsnetzwerk nicht verbleiben sollten, gehören namentlich:",
      ],
      bullets: [
        "Weisungen zur Einlassung, zu Haftfragen, Auflagen, Kaution oder einer möglichen Verständigung.",
        "Entwürfe einer Aussage, eines Schriftsatzes oder des Plädoyers zum Strafmaß, die der Mandant vor Einreichung billigen soll.",
        "Anschriften, Arztberichte, Vermögensverhältnisse oder die Identität einer in Aussicht genommenen Auskunftsperson — heute nötig, gefährlich, wenn sie liegen bleibt.",
        "Einmalige Zugangsdaten zu einem Portal, einer Videoverhandlung oder einem Dokument, das der Mandant einmal lesen und nicht im Chat speichern soll.",
        "Anwalt-zu-Anwalt: Korrespondenzanwalt, Terminsvertretung, Unterbevollmächtigung oder die Kollegin, die einen Termin übernimmt — die Papiere werden jetzt gebraucht, kein dauerhafter Gruppenchat.",
      ],
      paragraphsAfterBullets: [
        "In all diesen Fällen geht es darum, den Inhalt gezielt an den vorgesehenen Empfänger zu übermitteln, ohne den Kreis der Personen unnötig zu vergrößern, die ihn später rekonstruieren können. Ein grünes Häkchen ist kein Kanzleibriefkopf. Es weist die Kanzlei nicht aus. Es sieht nicht aus wie eine Mitteilung, der ein bereits misstrauischer Mandant auf den ersten Blick vertrauen kann.",
      ],
    },
    {
      title: "Was die Anwaltschaft von einem sicheren Übermittlungskanal braucht",
      paragraphs: [
        "Ein tauglicher Kanal für die sichere Übermittlung vertraulicher operativer Informationen hat eine kurze Anforderungsliste. Der Mandant darf weder ein Konto noch eine App brauchen. Die Verschlüsselung muss bereits auf dem sendenden Gerät erfolgen, bevor hochgeladen wird, sodass der Dienst nur Chiffretext speichert, nicht die Weisung selbst. Der Zugriff muss sich nach dem Lesen vernichten und nach Fristablauf erlöschen können. Die Abrufseite soll als Kanzleikorrespondenz erscheinen — nicht als anonyme Paste-Seite. Und wer sendet, soll wissen, dass der Link geöffnet wurde, ihn widerrufen können, wenn die Nummer falsch war, und bei sensiblen Anlagen das beiläufige Herunterladen erschweren.",
        "Das ist die Logik eines [einmaligen Geheimlinks](blog:one-time-secret-links), angewandt auf die anwaltliche Praxis. PrivateNote verschlüsselt im Browser, bevor die Nutzlast das Gerät verlässt. Empfänger öffnen eine eindeutige URL; ein Konto ist nicht erforderlich. Die Kanzlei kann den Link über den Weg senden, den der Mandant schon nutzt — SMS, E-Mail, auch ein kurzes Telefonat, in dem die Adresse vorgelesen wird — ohne die eigentliche Weisung in diese Nachricht zu legen. Der vertrauliche Inhalt liegt in der Notiz. Im Chat oder Posteingang bleibt nur der Link — und der verliert nach dem Öffnen oder Ablauf seine Funktion.",
      ],
      comparisonTable: {
        headers: ["Anforderung der Praxis", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Mandant muss keine App installieren",
            "Nein — die App ist der Kanal",
            "Ja — gewöhnlicher Browser",
          ],
          [
            "Kein bleibender Verlauf als Voreinstellung",
            "Unterhaltung in einer App — auch mit verschwindenden Nachrichten",
            "Einmalige Übermittlung per Link; nach dem Lesen nicht mehr über den Dienst abrufbar",
          ],
          [
            "Kanzleiidentität beim Öffnen",
            "Profil bzw. Identität innerhalb des Messengers",
            "Logo, Kanzleiname und gestaltete Abrufseite",
          ],
          [
            "Nachweis, dass die Unterlagen geöffnet wurden",
            "Lesebestätigungen gehören zum Chat, nicht zu einem eigenen Übermittlungsbeleg",
            "Öffnungsalarme und Zugriffsnachweis (nur Status)",
          ],
          [
            "Rückruf bei falscher Nummer",
            "Die Nachricht liegt bereits auf dem Gerät",
            "Ungeöffnete Notiz widerrufen",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal und WhatsApp bieten ebenfalls verschwindende Nachrichten. Ihr Modell bleibt gleichwohl das einer Unterhaltung in einem Messenger, während PrivateNote als einmalige Übermittlung per Link gedacht ist. Ausführlicher zu Unterlagen statt kurzer Weisungen: [vertrauliche Dokumente sicher versenden](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Eine gemeinsame berufliche Gewohnheit",
      paragraphs: [
        "PrivateNote lässt sich unter Anwälten ebenso nutzen wie gegenüber Mandanten. Korrespondenzanwalt, Terminsvertretung, Kollege in der Hauptverhandlung oder Mandant erhalten Sensibles in derselben Form: als kurzlebigen Link statt als weiteren dauerhaften Chatverlauf. Der Empfänger braucht weiterhin kein PrivateNote-Konto.",
        "Business ist ein professionelles Konto, keine Sitzlizenz für ein Kollaborationspaket. Der Wert liegt im Übermittlungsstandard: Sensibles kommt unter der Identität der Kanzlei an und wird nicht automatisch zu einer weiteren durchsuchbaren Unterhaltung.",
        "Kanzlei-Branding ist keine Eitelkeit. Ein Mandant, der vor Phishing gewarnt wurde, sollte auf der Seite, über die er eine vertrauliche Nachricht öffnet, sofort erkennen können, von welcher Kanzlei sie stammt. Ein gängiger Messenger-Chat bietet diese Gewähr nicht. Business ergänzt Kanzleiprofil, Logo, Farben sowie eine standardisierte oder individuell gestaltete Abrufseite.",
      ],
      midCta: {
        body: "Business ist der Tarif für die professionelle Übermittlung: Empfänger-Branding, Dateien nur zur Ansicht, Anhänge bis 1 GB und die vollständigen Kontrollen (Zugriffsnachweis, Empfängerprüfung, Widerruf, geplante Freigabe). 12 € / 12 $ im Monat oder 120 € / 120 $ im Jahr — ein professionelles Konto, keine Sitzlizenz.",
        button: "Kanzlei-Konto einrichten",
      },
    },
    {
      title: "Zusätzliche Kontrollen für Kanzleien",
      paragraphs: [
        "Starter und Business ergänzen Funktionen, die Kanzleien sonst häufig telefonisch oder über getrennte Kanäle organisieren müssen. Die [Empfängerprüfung](blog:recipient-verification-code-before-reveal) legt einen notizspezifischen Code auf einen zweiten Kanal, sodass ein abgefangener Link nicht genügt. [Öffnungsbenachrichtigungen](blog:know-when-secret-link-opened) und der Zugriffsnachweis sagen, dass die Unterlagen geöffnet wurden — nur Status, niemals der Inhalt. Ein noch ungeöffneter Link lässt sich [widerrufen](blog:revoke-unopened-note-proof-of-access), wenn er an die falsche Nummer gesendet wurde. Mit der geplanten Freigabe lässt sich ein verschlüsseltes Paket bis zu einem bestimmten Zeitpunkt oder etwa einem vereinbarten Anruf aus der JVA sperren. Business fügt die Ansicht ohne Download für Anlagen hinzu, die gelesen, aber nicht beiläufig gespeichert werden sollen, und die größten Anhangsgrenzen für Bündel, die nicht in den Chat gehören.",
      ],
      orderedIntro: "Ein praktikabler Ablauf in der Kanzlei ist kurz:",
      ordered: [
        "Weisung verfassen oder Unterlagen anhängen. Die Verschlüsselung erfolgt im Browser vor dem Hochladen.",
        "Kurze Lebensdauer und eine einzige Öffnung setzen — oder wenige Öffnungen, wenn Mandant und Korrespondenzanwalt dasselbe Paket abholen müssen.",
        "Empfängerprüfung einschalten, wo der Inhalt besonders heikel ist, und den Code auf anderem Wege mitteilen (etwa telefonisch).",
        "Nur den Link per SMS oder E-Mail senden. Die eigentliche Weisung nicht in diese Nachricht legen.",
        "Den Öffnungsalarm abwarten. War die Nummer falsch, vor dem Öffnen widerrufen. Nach dem Öffnen davon ausgehen, dass der Empfänger behalten kann, was er gesehen hat, und danach handeln.",
      ],
      paragraphsAfterOrdered: [
        "Für größere Bündel gilt dasselbe Modell: [verschlüsselte Dateien, Chiffretext auf dem Server, zeitlich begrenztes Downloadfenster](app:secure-file-transfer). Zum Senden einer Datei ist ein kostenloses Konto nötig; zum Öffnen eines Links nie.",
      ],
    },
    {
      title: "Was dieser Kanal nicht entscheidet",
      paragraphs: [
        "Ob das Berufsgeheimnis im Einzelfall greift, hängt vom rechtlichen Rahmen und den Umständen des konkreten Falls ab — in Deutschland, Österreich oder der Schweiz. PrivateNote bestimmt diesen rechtlichen Status nicht. Kein Produkt hindert einen berechtigten Empfänger daran, nach dem Öffnen eine Kopie anzufertigen. PrivateNote ersetzt nicht die gesetzliche Handakte, das Dokumentenmanagement oder die Zeitaufnahme. Es verringert unnötige Kopien von Mitteilungen, die nicht dauerhaft archiviert werden sollten. Auch der Grundsatz der Datenminimierung spricht dafür, personenbezogene Daten nicht länger oder umfangreicher vorzuhalten, als es für den jeweiligen Zweck erforderlich ist.",
        "Mit dieser Grenze ist es eine berufliche Alternative zu den zwei Gewohnheiten, die heute vorherrschen: vertraulichen Betriebsverkehr in die E-Mail zu legen — oder in gängige Messenger-Dienste, weil der Mandant nichts anderes installiert. Die Kanzlei lässt den Mandanten bei den Werkzeugen, die er schon hat, setzt den Kanzleinamen auf die Übermittlung und hinterlässt keinen Verlauf, wo keiner erforderlich ist.",
      ],
    },
    {
      title: "Häufige Fragen",
      faqs: [
        {
          question:
            "Erfüllt die Verschlüsselung in Signal oder WhatsApp die Verschwiegenheitspflicht?",
          answer:
            "Die Ende-zu-Ende-Verschlüsselung schützt den Inhalt wirksam vor dem Zugriff des Anbieters. Sie entscheidet nicht, wie lange ein Verlauf auf Geräten, in Sicherungen oder im Chat des Mandanten bleibt. Verschlüsselung und Speicherung sind zwei verschiedene Fragen. Ob eine Mitteilung rechtlich dem Berufsgeheimnis unterliegt, hängt nicht allein davon ab, mit welchem Werkzeug sie übermittelt wurde.",
        },
        {
          question: "Muss der Mandant ein Konto anlegen oder eine App installieren?",
          answer:
            "Nein. Der Mandant öffnet einen eindeutigen Link in einem gewöhnlichen Browser. Weder Signal noch WhatsApp noch eine PrivateNote-App sind erforderlich, und zum Öffnen der Notiz ist kein Konto nötig.",
        },
        {
          question: "Ist PrivateNote ein Dokumentenmanagement oder ein Ersatz für die Handakte?",
          answer:
            "Nein. Es ist ein kurzlebiger Übermittlungskanal. Mandatsakten, Gerichtsakten und alles, was einer Aufbewahrungspflicht unterliegt, gehört in die gewöhnlichen Systeme der Kanzlei. PrivateNote ist für Mitteilungen gedacht, die nach dem Empfang nicht fortbestehen sollen.",
        },
        {
          question: "Kann der Empfänger nach dem Öffnen trotzdem eine Kopie behalten?",
          answer:
            "Ja. Sobald der Klartext rechtmäßig geöffnet ist, kann ein entschlossener Empfänger kopieren, einen Screenshot machen, herunterladen oder den Bildschirm fotografieren. Vernichtung nach dem Lesen und Ablauf verringern Restkopien auf dem Dienst; sie löschen nicht ferngesteuert, was der Empfänger bereits festgehalten hat. Dateien nur zur Ansicht in Business erschweren das beiläufige Herunterladen; sie verbieten keine Fotografie.",
        },
      ],
    },
  ],
  ctaTitle: "Vertraulich übermitteln. Nicht dauerhaft im Chat hinterlassen.",
  ctaBody:
    "Richten Sie das Kanzlei-Konto ein, um die Abrufseite mit Namen und Zeichen zu versehen. Oder senden Sie zuerst eine Test-Nachricht an sich selbst — verschlüsselt im Browser, ohne App für den Mandanten.",
  ctaPrimary: "Kanzlei-Konto einrichten",
  ctaSecondary: "Test-Nachricht an sich selbst senden",
};
