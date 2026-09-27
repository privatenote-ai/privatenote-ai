import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedDe: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Abstimmung des Europäischen Parlaments zu Chat Control mit gesperrter Chat-Blase über einer Europakarte",
  heroCaption: "Illustration erstellt für PrivateNote.ai.",
  intro:
    "Am 9. Juli 2026 geschah im Europäischen Parlament etwas Ungewöhnliches. Die Schlussabstimmung über die Verlängerung der temporären Chat-Control-1.0-Verordnung endete mit mehr Abgeordneten dagegen als dafür—und die Maßnahme wurde dennoch verabschiedet.",
  voteEyebrow: "Schlussabstimmung, 9. Juli 2026",
  voteHeadline: "Mehr „Nein“- als „Ja“-Stimmen—und trotzdem verabschiedet",
  voteLabels: { against: "Dagegen", for: "Dafür", abstentions: "Enthaltungen" },
  voteSummary:
    "Auf den ersten Blick würden die meisten Beobachter schließen, der Vorschlag sei abgelehnt worden. Die Antwort liegt nicht in Verschlüsselung oder Cybersicherheit—sondern im parlamentarischen Verfahren.",
  nonE2eChannels: [
    "klassische E-Mail-Dienste",
    "Cloud-Speicher",
    "bestimmte Direktnachrichten-Dienste",
    "andere Kommunikation, bei der Anbieter auf Nachrichteninhalte zugreifen können",
  ],
  privacyConcerns: [
    {
      title: "Falschpositive",
      body: "Die Erkennung bereits bekannter illegaler Inhalte per kryptografischer Hashes ist im Allgemeinen zuverlässig, aber nicht perfekt. Forscher haben Kollisionen und Implementierungsfehler gezeigt, die falsche Meldungen erzeugen können. Setzen Anbieter KI ein, um neues, bisher ungesehenes Material zu identifizieren, wird die Falschpositiv-Rate deutlich schwerer kontrollierbar. Jede Falschmeldung kann bedeuten, dass die private Kommunikation einer unschuldigen Person zur weiteren Prüfung markiert wird.",
    },
    {
      title: "Ausbau der Überwachungsinfrastruktur",
      body: "Viele Experten argumentieren: Sobald Plattformen groß angelegte Scan-Systeme aufbauen, ist die Ausweitung auf weitere Zwecke technisch einfach. Die Geschichte zeigt, dass für enge Zwecke eingeführte Technologien oft zu breiterer Überwachung werden.",
    },
    {
      title: "Abschreckende Wirkung",
      body: "Private Kommunikation funktioniert nur, wenn Menschen darauf vertrauen, dass ihre Gespräche privat bleiben. Glauben Nutzer, jede Nachricht könne automatisch analysiert werden, meiden viele sensible Themen ganz—even wenn völlig legal. Dieses Phänomen ist in der Privatsphäre-Forschung gut dokumentiert.",
    },
    {
      title: "Begrenzte Wirksamkeit",
      body: "Mehr als 800 Cybersicherheits- und Datenschutzforscher argumentieren, breites Nachrichten-Scanning werde Kindesmissbrauch kaum spürbar reduzieren, aber erhebliche Privatsphäre-Kosten für Hunderte Millionen Nutzer verursachen. Kritiker halten gezielte Ermittlungen für sinnvoller als pauschales Scannen.",
    },
  ],
  e2eeCalloutTitle: "Ende-zu-Ende-Verschlüsselung ändert das Vertrauensmodell",
  e2eeCalloutBody:
    "Ende-zu-Ende-Verschlüsselung stellt sicher, dass nur Sender und beabsichtigter Empfänger die kryptografischen Schlüssel besitzen, um eine Nachricht zu lesen. Selbst der Dienstanbieter kann den Inhalt nicht entschlüsseln. Jede Pflicht, verschlüsselte Nachrichten vor oder nach der Verschlüsselung zu prüfen, verändert dieses Sicherheitsmodell grundlegend—und ist eines der umstrittensten Themen der modernen Cybersicherheitspolitik.",
  sections: {
    whyPassed: {
      title: "Warum wurde es verabschiedet?",
      paragraphs: [
        "Das war keine normale Gesetzgebungsabstimmung mit einfacher Mehrheit der abgegebenen Stimmen. Aufgrund der konkreten Verfahrensstufe erforderte eine **Ablehnung des Vorschlags eine absolute Mehrheit aller Mitglieder des Europäischen Parlaments—derzeit 361 Stimmen**.",
        "Obwohl 314 Abgeordnete dagegen stimmten, reichte diese Zahl nicht für die erforderliche Schwelle. Folglich galt der Vorschlag als angenommen.",
      ],
      callout:
        "Dieses Verfahrensergebnis hat viele Beobachter überrascht—Journalisten, Juristen und Cybersicherheitsforscher—, weil man intuitiv erwartet, dass mehr „Nein“- als „Ja“-Stimmen einen Vorschlag scheitern lassen.",
    },
    whatItDoes: {
      title: "Was bewirkt Chat Control 1.0 wirklich?",
      paragraphs: [
        "Die angenommene Maßnahme führt **kein** verpflichtendes Scannen aller privaten Nachrichten ein. Stattdessen verlängert sie den bestehenden temporären Rechtsrahmen, der Online-Diensteanbietern erlaubt, **freiwillig** kinderpornografisches Material (CSAM) in bestimmten Kommunikationsarten bis zum 3. April 2028 zu erkennen und zu melden.",
        "Das betrifft vor allem Kommunikation ohne [Ende-zu-Ende-Verschlüsselung](blog:what-is-end-to-end-encryption), etwa:",
        "Wichtig: Das Parlament hielt Formulierungen aufrecht, die Ende-zu-Ende-verschlüsselte Kommunikation von diesem freiwilligen Scan-Rahmen ausschließen. Eine präzise Definition—und der Unterschied zur gewöhnlichen Transportverschlüsselung—finden Sie in unserem Leitfaden [Was Ende-zu-Ende-Verschlüsselung wirklich ist](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Warum sind Datenschutzexperten besorgt?",
      intro:
        "Viele Forscher und Bürgerrechtsorganisationen lehnten die Verlängerung ab—nicht weil sie Kinderschutz ablehnen, sondern weil sie bezweifeln, dass dieser Ansatz das Ziel erreicht, ohne erhebliche Risiken zu schaffen. Unser früherer Artikel [Warum Europas Kryptografen vor Chat Control warnen](blog:chat-control-europe-cryptographers) erklärt die breiteren technischen Einwände ausführlich.",
    },
    chatControl20: {
      title: "Die größere Geschichte heißt Chat Control 2.0",
      paragraphs: [
        "Während diese Wochenabstimmung viel Aufmerksamkeit erhielt, glauben viele Experten, die eigentliche Debatte steht noch bevor. Der oft als Chat Control 2.0 bezeichnete Vorschlag zielt auf einen dauerhaften Rechtsrahmen zur Erkennung von CSAM online.",
        "Anders als die diese Woche verabschiedete temporäre Verlängerung umfassten Diskussionen um Chat Control 2.0 wiederholt Vorschläge, die Ende-zu-Ende-verschlüsselte Kommunikation betreffen könnten. Dort wird die Debatte deutlich bedeutsamer—und dort zählen die Warnungen in unserem [Kryptografen-Briefing zu Chat Control](blog:chat-control-europe-cryptographers) am meisten.",
      ],
    },
    privateNote: {
      title: "Warum das für PrivateNote wichtig ist",
      paragraphs: [
        "Private Kommunikation basiert auf einem einfachen Prinzip: Kann ein Dienst Ihre Nachricht nicht lesen, kann er sie nicht scannen, analysieren, verkaufen oder versehentlich offenlegen. PrivateNote wurde um diese Idee herum entworfen.",
        "Wenn Sie eine Notiz erstellen, erfolgt die Verschlüsselung direkt in Ihrem Browser. Der Verschlüsselungsschlüssel erreicht unsere Server nie. Wir speichern nur Chiffretext. Ohne den Schlüssel—der vollständig unter Ihrer Kontrolle bleibt—ist der Inhalt Ihrer Notiz für uns mathematisch unlesbar.",
        "Dieses Design geht nicht darum, Verantwortung zu vermeiden. Es geht darum sicherzustellen, dass Ihre private Kommunikation genau das bleibt: privat. Ob Sie Passwörter, Rechtsdokumente, Finanzinformationen, Geschäftsgeheimnisse oder persönliche Gespräche teilen—Privatsphäre sollte nicht allein vom Vertrauen in den Anbieter abhängen. Sie sollte durch Kryptografie erzwungen werden.",
        "Schritt für Schritt zur browserseitigen Verschlüsselung: [Wie PrivateNote funktioniert](app:how-it-works). Für kurzlebige Geheimnisse ohne dauerhaften Chat-Verlauf sind [Einmal-Geheimlinks](blog:one-time-secret-links) oft passender als Messenger—auch verschlüsselte.",
      ],
    },
    debateContinues: {
      title: "Die Debatte ist längst nicht vorbei",
      paragraphs: [
        "Vernünftige Menschen können unterschiedlicher Meinung sein, wie Gesellschaft Online-Kindesmissbrauch bekämpfen soll. Kinderschutz ist zweifellos eines der wichtigsten öffentlichen Interessen. Die schwierige Frage ist, wie man dieses Ziel erreicht, ohne die Sicherheits- und Privatsphäre-Infrastruktur zu untergraben, auf die Journalisten, Unternehmen, Anwälte, Gesundheitsdienstleister, Aktivisten und Bürger täglich angewiesen sind.",
        "Während die Diskussionen um Chat Control 2.0 weitergehen, bleibt dieses Gleichgewicht zwischen öffentlicher Sicherheit und Grundrechten auf Privatsphäre eine der prägenden Technologiepolitik-Debatten Europas. Unabhängig von der Position gilt: Die Zukunft verschlüsselter Kommunikation wird zunehmend nicht nur von Kryptografen und Software-Ingenieuren entschieden—sondern auch von Gesetzgebern.",
      ],
    },
  },
  ctaTitle: "Private Notizen senden, ohne dem Server den Schlüssel zu geben",
  ctaBody:
    "PrivateNote verschlüsselt Notizen in Ihrem Browser und hält den Entschlüsselungsschlüssel im URL-Fragment.",
  ctaButton: "PrivateNote testen ->",
};
