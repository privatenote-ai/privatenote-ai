import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessDe: BlogGuideArticleCopy = {
  heroAlt:
    "Kontoaktivität mit einer ungeöffneten Notiz und einer klaren Option, den Link zu widerrufen",
  heroCaption:
    "Vor dem Öffnen umentschieden? Link zerstören. Beleg nötig? Zugriffsbeleg anzeigen.",
  intro: [
    "Sicheres Teilen endet nicht bei der Verschlüsselung beim Senden. Es geht auch um **Kontrolle danach**: einen Link stoppen, den Sie nicht hätten senden sollen, und einen datenschutzfreundlichen Nachweis darüber behalten, was mit einem gesendeten Link passiert ist.",
    "Die Starter- und Business-Pläne von PrivateNote ergänzen das um zwei zusammengehörige Werkzeuge. **Widerrufen** zerstört einen ungeöffneten Link, sodass er nicht mehr offengelegt werden kann. Der **Zugriffsbeleg** zeigt eine einfache Zeitleiste—erstellt, geöffnet, Anhang heruntergeladen, zerstört, abgelaufen oder widerrufen—ohne Notizinhalte preiszugeben.",
    "Zusammen beantworten sie die beiden Folgefragen, die Teams wirklich stellen: „Kann ich das zurücknehmen?“ und „Kann ich zeigen, dass der Link aufgerufen wurde?“",
  ],
  sections: [
    {
      title: "Widerrufen, solange noch ungeöffnet",
      takeaway:
        "Widerruf wirkt vor dem Reveal—nicht nachdem jemand bereits eine Kopie entschlüsselt hat.",
      paragraphs: [
        "Wurde eine Notiz noch nicht geöffnet, können Sie sie vom Erfolgsbildschirm nach dem Erstellen oder unter Konto → Aktivität widerrufen. Der Link funktioniert nicht mehr; Empfänger, die später kommen, sehen, dass der Zugang weg ist.",
        "Widerrufen ist der richtige Schritt, wenn Sie den falschen Empfänger eingefügt haben, das Geheimnis im falschen Chat entdeckt haben oder die Übergabe warten soll. Es ist **keine** Fernlöschung einer Datei, die jemand nach dem Reveal bereits heruntergeladen hat—kein ehrliches E2EE-Übergabe-Tool kann das versprechen.",
      ],
      checklist: [
        "Notiz auf Starter oder Business erstellen",
        "Sieht etwas falsch aus, sofort vom Erfolgsbildschirm widerrufen",
        "Oder Konto → Aktivität öffnen und widerrufen, solange der Status noch ungeöffnet ist",
        "Ersatznotiz senden, wenn der Empfänger das Geheimnis weiterhin braucht",
      ],
      midCta: {
        body: "Brauchen Sie Rücknahmen und Belege bei sensiblen Übergaben?",
        button: "Widerrufbare Notiz erstellen",
      },
    },
    {
      title: "Zugriffsbeleg ohne Inhaltslecks",
      takeaway:
        "Ein datenschutzfreundlicher Statusnachweis: Der Link wurde aufgerufen—kein Lesetranskript.",
      paragraphs: [
        "Der Zugriffsbeleg ist für betriebliche und Compliance-Gespräche gedacht, die Nachweise zu Lieferereignissen brauchen, ohne Geheimnisse in E-Mails oder Tickets zu legen.",
        "Die Zeitleiste bleibt grobkörnig: erstellt, Link geöffnet, Anhang heruntergeladen (wenn erfasst), zerstört, abgelaufen, widerrufen. Das entspricht dem Datenschutzanspruch von [Open-Alerts](blog:know-when-secret-link-opened): Status, nicht Inhalt.",
      ],
      calloutTitle: "Bezeichnung sorgfältig lesen",
      callout:
        "Der Zugriffsbeleg ist ein Nachweis, dass der Link aufgerufen wurde—kein kryptografischer Beweis, dass eine bestimmte Person jedes Wort sorgfältig gelesen hat, und kein DRM gegen Screenshots.",
    },
    {
      title: "Wie Widerruf und Beleg zusammenpassen",
      takeaway:
        "Zugang verhindern, wenn Sie können; Zugang dokumentieren, wenn Sie müssen.",
      comparisonTable: {
        headers: ["Situation", "Nutzen", "Ergebnis"],
        rows: [
          [
            "Falscher Empfänger, noch ungeöffnet",
            "Widerrufen",
            "Link stirbt; korrigierte Notiz erstellen",
          ],
          [
            "Übergabe erledigt, Auditor fragt „wurde geöffnet?“",
            "Zugriffsbeleg",
            "Zeitleisten-Ereignisse ohne Inhalt zeigen",
          ],
          [
            "Notiz bereits offengelegt",
            "Geheimnis rotieren / als exponiert annehmen",
            "Widerruf stellt Klartextkopien nicht wieder her",
          ],
          [
            "Warten auf Empfänger",
            "Alerts + Lebensdauer",
            "Nachfassen oder automatisch ablaufen lassen, falls nie geöffnet",
          ],
        ],
      },
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ich nach dem Öffnen durch den Empfänger noch widerrufen?",
          answer:
            "Widerruf richtet sich an ungeöffnete Notizen. Nach dem Reveal sollten Sie davon ausgehen, dass der Empfänger behalten kann, was er gesehen hat; Zugangsdaten rotieren oder das Dokument als zugestellt behandeln.",
        },
        {
          question: "Enthält der Zugriffsbeleg den Nachrichtentext?",
          answer:
            "Nein. Es ist nur eine Status-Zeitleiste. Inhalte bleiben außerhalb von Aktivität und Belegansichten.",
        },
        {
          question: "Gibt es Widerruf auf Free?",
          answer:
            "Widerruf und Zugriffsbeleg sind Funktionen von Starter/Business. Free-Nutzer erhalten weiterhin Verschlüsselung, kurze Lebensdauern und Open-Alerts, sobald sie mit verifizierter E-Mail angemeldet sind.",
        },
        {
          question: "Wo finde ich den Beleg später?",
          answer:
            "Öffnen Sie Konto → Aktivität, finden Sie die Notiz und wählen Sie Zugriffsbeleg anzeigen, wenn der Plan das unterstützt.",
        },
      ],
    },
    {
      title: "Das Fazit",
      takeaway: "Den ungeöffneten Link kontrollieren; den geöffneten dokumentieren.",
      paragraphs: [
        "Verschlüsselung beantwortet „wer kann das unterwegs und im Ruhezustand lesen.“ Widerruf und Beleg beantworten „was tun wir als Nächstes.“",
        "Nutzen Sie sie zusammen mit [Verifizierungscodes](blog:recipient-verification-code-before-reveal) und [Open-Alerts](blog:know-when-secret-link-opened) für einen vollständigen Übergabe-Kreislauf—vom Senden über die Bestätigung bis zu Rücknahme oder Beleg.",
      ],
    },
  ],
  ctaTitle: "Ungeöffnetes Geheimnis zurücknehmen.",
  ctaBody:
    "Widerrufen Sie Links, die nie geöffnet werden sollten, und behalten Sie eine datenschutzfreundliche Zeitleiste, wenn Sie zeigen müssen, dass eine Übergabe aufgerufen wurde—ohne das Geheimnis per E-Mail zu schicken.",
  ctaButton: "Private Notiz erstellen",
};
