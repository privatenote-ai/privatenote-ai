import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedDe: BlogGuideArticleCopy = {
  heroAlt:
    "Benachrichtigungsbereich mit einer Hinweis-Meldung zum Öffnen einer Notiz, ohne sichtbaren Nachrichteninhalt",
  heroCaption:
    "Nur Status: geöffnet, zerstört, abgelaufen oder widerrufen—niemals das Geheimnis selbst.",
  intro: [
    "Nach dem Versand eines sensiblen Links stellt sich die naheliegende Frage: **Haben sie ihn schon geöffnet?** Stilles Warten stresst; Nachfragen im Chat erzeugen nur mehr Klartext-Lärm.",
    "PrivateNote kann Sie benachrichtigen, wenn sich der Zustellstatus ändert—per E-Mail, über Live-Benachrichtigungen im Tab, solange die Seite geöffnet ist, und optional über Browser-Benachrichtigungen—ohne jemals den Notizinhalt per E-Mail zu senden.",
    "Diese Sichtbarkeit hilft Ihnen, Zugangsdaten zu rotieren, ungeöffnete Links zu widerrufen oder einfach aufzuhören zu raten, ob die Übergabe angekommen ist.",
  ],
  sections: [
    {
      title: "Was Sie erfahren können (und was nicht)",
      takeaway: "Benachrichtigungen betreffen Lebenszyklus-Ereignisse, nicht den Nachrichtentext.",
      paragraphs: [
        "Typische Ereignisse sind Notiz geöffnet, zerstört, abgelaufen, Anhang heruntergeladen und widerrufen. Die Formulierung bleibt absichtlich grob: genug für operative Sicherheit, kein Überwachungsfeed des Leseverhaltens.",
        "Das Privacy-Modell von PrivateNote gilt weiterhin. Status-Mails und Toasts enthalten **nicht** das entschlüsselte Geheimnis. Wenn Sie eine strukturierte Quittung für eine Audit-Spur brauchen, nutzen Sie **Zugriffsnachweis** auf berechtigten Plänen—beschrieben in [Widerrufen und Zugriffsnachweis](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signal", "Wo es erscheint", "Gut geeignet für"],
        rows: [
          [
            "E-Mail-Benachrichtigungen (verifiziertes Konto)",
            "Ihre Konto-E-Mail",
            "Asynchrone Bestätigung, wenn Sie nicht auf der Seite sind",
          ],
          [
            "Live-Benachrichtigungen im Tab (angemeldet)",
            "PrivateNote im Browser geöffnet",
            "Nahezu Echtzeit-Bewusstsein während einer aktiven Übergabe",
          ],
          [
            "Browser-Benachrichtigungen (Berechtigung erforderlich)",
            "OS-Berechtigung, angefordert unter Anpassen",
            "Hinweis, wenn der Tab im Hintergrund liegt",
          ],
          [
            "Konto → Aktivität (planabhängig)",
            "Ihr privater Aktivitätsverlauf",
            "Später nachvollziehen, was passiert ist",
          ],
        ],
      },
    },
    {
      title: "So aktivieren Sie Benachrichtigungen",
      takeaway:
        "Anmelden, E-Mail verifizieren, dann Benachrichtigungen pro Notiz oder in den Einstellungen umschalten.",
      checklist: [
        "Melden Sie sich an und verifizieren Sie die E-Mail Ihres Kontos",
        "Aktivieren Sie E-Mail-Benachrichtigungen unter Konto → Einstellungen",
        "Beim Erstellen einer Notiz: Anpassen → E-Mail-Benachrichtigungen öffnen",
        "Wählen Sie Benachrichtigung bei Öffnen oder bei Öffnen und Zerstören (für Einmal-Lesen-Abläufe)",
        "Erlauben Sie Browser-Benachrichtigungen, wenn Sie OS-Hinweise möchten",
        "Halten Sie PrivateNote bei kritischen Übergaben für Live-Toasts im Tab geöffnet",
      ],
      paragraphsAfterChecklist: [
        "Öffnungsbenachrichtigungen stehen angemeldeten Free-Nutzern zur Verfügung, sobald die E-Mail verifiziert ist; reichhaltigeres Tracking wie Ereignisse zum Anhang-Download und Widerrufs-Tools erweitern sich auf kostenpflichtigen Plänen.",
        "Zum zugrunde liegenden Übergabe-Muster siehe [so erstellen Sie eine private Notiz](blog:how-to-make-a-private-note) und [geheime Nachricht ohne Konto senden](blog:send-secret-message-without-account) für Empfänger.",
      ],
      midCta: {
        body: "Senden Sie ein zeitkritisches Geheimnis und brauchen Bestätigung, dass es angekommen ist?",
        button: "Notiz mit Öffnungsbenachrichtigungen erstellen",
      },
    },
    {
      title: "Benachrichtigungen operativ nutzen",
      takeaway:
        "Behandeln Sie „geöffnet“ als Signal zum Rotieren oder Schließen der Schleife—nicht als Beweis sorgfältigen Lesens.",
      bullets: [
        "Passwort-Übergabe: bei „geöffnet“ rotieren oder bestätigen, dass der Empfänger die Zugangsdaten geändert hat",
        "Dokumentenversand: geöffnet + Anhang heruntergeladen (wo verfügbar) bedeutet, das Dateifenster ist aktiv",
        "Kein Öffnen vor Ablauf: über einen anderen Kanal nachfassen oder widerrufen, falls noch ungeöffnet",
        "Unerwartetes Öffnen: Link als möglicherweise kompromittiert annehmen; wenn möglich widerrufen und neu senden",
      ],
      calloutTitle: "Ehrliches Limit",
      callout:
        "„Geöffnet“ bedeutet, dass der Reveal-Ablauf fortgeschritten ist—nicht, dass ein Mensch jede Zeile sorgfältig gelesen hat, und nicht, dass Screenshots unmöglich waren.",
    },
    {
      title: "Datenschutz-Erwartungen",
      takeaway: "Zustellung zu überwachen darf keine E-Mail mit dem Geheimnis erzeugen.",
      paragraphs: [
        "Teams missbrauchen Lesebestätigungen manchmal als Produktivitätsüberwachung. PrivateNote hält Benachrichtigungen minimal: Statuslabels und Referenzen, keine Inhalts-Dumps.",
        "Das entspricht dem Produktversprechen an anderer Stelle—browserseitige Verschlüsselung, [Konzepte der Ende-zu-Ende-Verschlüsselung](blog:what-is-end-to-end-encryption), und niemals das Geheimnis zurück in die E-Mail legen, nur um Ankunft zu beweisen.",
      ],
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Enthält die Benachrichtigung meinen Notiztext?",
          answer:
            "Nein. E-Mail- und Live-Benachrichtigungen beschreiben nur den Status. Nachrichteninhalt bleibt aus Benachrichtigungskanälen heraus.",
        },
        {
          question: "Muss ich den Tab geöffnet lassen?",
          answer:
            "E-Mail-Benachrichtigungen funktionieren ohne Tab. Live-Toasts im Tab brauchen die geöffnete Seite; Browser-Benachrichtigungen helfen, wenn der Tab im Hintergrund ist und die Berechtigung erteilt wurde.",
        },
        {
          question: "Können Empfänger sehen, dass ich Benachrichtigungen aktiviert habe?",
          answer:
            "Empfänger konzentrieren sich auf Öffnen und Anzeigen der Notiz. Absenderseitige Benachrichtigungseinstellungen sind nicht Teil der geheimen Nutzlast, die sie entschlüsseln.",
        },
        {
          question: "Was, wenn ich den Zugriff nach dem Senden stoppen muss?",
          answer:
            "Wenn die Notiz noch ungeöffnet ist, widerrufen Sie den Link vom Erfolgsbildschirm oder aus der Kontoaktivität auf berechtigten Plänen. Details in [Widerrufen und Zugriffsnachweis](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "Das Fazit",
      takeaway: "Schließen Sie die Schleife, ohne das Geheimnis in ein anderes Postfach zu kopieren.",
      paragraphs: [
        "Zu wissen, wann ein Link geöffnet wurde, lässt Sie die operative Geschichte abschließen: rotieren, nachfassen oder widerrufen.",
        "Aktivieren Sie den Benachrichtigungskanal, der zu Ihrer Arbeitsweise passt—E-Mail für asynchron, Live-Benachrichtigungen für Live-Übergaben—und lassen Sie den Klartext dort, wo er hingehört: in der verschlüsselten Notiz.",
      ],
    },
  ],
  ctaTitle: "Geheimnis senden. Status erhalten.",
  ctaBody:
    "Aktivieren Sie Öffnungs- und Zerstörungsbenachrichtigungen, damit Sie wissen, wann eine PrivateNote-Übergabe voranschreitet—ohne die Nachricht in die E-Mail zu legen.",
  ctaButton: "Notiz mit Benachrichtigungen erstellen",
};
