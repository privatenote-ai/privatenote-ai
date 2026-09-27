import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersDe: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Editorial-Grafik „Chat Control ist zurück“ mit gesperrter Chat-Blase über einer Europakarte",
  heroCaption: "Illustration erstellt für PrivateNote.ai.",
  intro:
    "Heute, Dienstag, 7. Juli, wird das Europäische Parlament voraussichtlich die vorgeschlagene Verordnung zur Bekämpfung sexuellen Kindesmissbrauchs (CSAR) erneut behandeln—von Kritikern oft Chat Control genannt. Das Ziel des Vorschlags ist nicht umstritten: Kinder müssen vor schrecklichem Missbrauch geschützt werden. Die technische Frage ist, ob verpflichtendes Scannen privater Kommunikation das leisten kann, ohne die Sicherheitsgarantien zu brechen, von denen alle anderen abhängen.",
  updatePrefix:
    "**Update (9. Juli 2026):** Das Parlament verlängerte Chat Control 1.0, obwohl mehr Abgeordnete dagegen stimmten als dafür.",
  updateLink: "Lesen Sie, was passiert ist und warum",
  updateSuffix: ".",
  calloutTitle: "Diese Debatte geht nicht darum, ob Kindesmissbrauch bekämpft werden soll.",
  calloutBody:
    "Opfer verdienen Schutz. Strafverfolgung verdient wirksame Werkzeuge. Plattformen sollten bekanntes illegales Material schnell melden und bei Ermittlungen kooperieren. Der Streit ist, ob Massen-Scanning aller privaten Nachrichten technisch ein sinnvoller Weg dorthin ist.",
  expertEyebrow: "Expertenwarnung",
  expertTitle: "Bart Preneel: Die Sicherheitscommunity ist ungewöhnlich einig",
  expertParagraphs: [
    "Bart Preneel, Professor an der KU Leuven und einer der bekanntesten europäischen Experten für Kryptografie, Privatsphäre und digitale Rechte, warnte heute, dass Chat Control nach zwei früheren, unentschiedenen Abstimmungen zur dritten Abstimmung zurückkehrt. In seinem LinkedIn-Beitrag beschrieb er den Vorschlag als pauschales Scannen unverschlüsselter Kommunikation, nun erweitert um KI zur Suche nach neuem CSAM.",
    "Preneel verwies auch auf den ungewöhnlich breiten Expertenkonsens hinter der Kritik: Mehr als 800 Cybersicherheits- und Datenschutzexperten warnen, dass Massen-Scanning und KI-basierte Inhaltsanalyse weiterhin inakzeptable Fehlerraten haben, ernsthafte Verhältnismäßigkeitsbedenken aufwerfen und weniger wirksam sind als gezielte Ansätze. Wie er formulierte, erreicht die Sicherheitscommunity selten dieses Maß an Einigkeit zu einem Thema.",
    "Seine praktische Empfehlung ist direkt: Kontaktieren Sie Mitglieder des Europäischen Parlaments und erklären Sie, warum pauschales Scannen kein sinnvoller Weg ist, das ernste Problem der CSAM-Verbreitung anzugehen.",
    "Zum technischen Hintergrund verweist er auf zwei Wissenschaftlerbriefe: den offenen Brief von September 2025, der die Kernbedenken zu clientseitigem Scannen und KI-basierter Erkennung erklärt, und das Follow-up von November 2025, das argumentiert, die vorgeschlagene Ausweitung verstärke dieselben Risiken, die die Sicherheitscommunity bereits identifiziert hat.",
  ],
  expertLinks: {
    preneel: "LinkedIn-Beitrag von Bart Preneel",
    sep2025: "Offener Brief September 2025",
    nov2025: "Follow-up November 2025",
  },
  technicalConcerns: [
    {
      title: "KI kann unbekanntes CSAM im Internetmaßstab nicht zuverlässig klassifizieren",
      body: "Bildklassifikation hängt vom Kontext ab. Familienfotos, medizinische Bilder, Lehrmaterial und einvernehmliche Bilder unter Jugendlichen sind selbst für Menschen schwer korrekt einzuordnen.",
    },
    {
      title: "Bekanntes-Bild-Matching lässt sich umgehen",
      body: "Zuschneiden, Skalieren, Kompression, kleine Pixeländerungen und adversariale Perturbationen können ein Bild für Menschen erkennbar lassen, während automatisierte Matching-Systeme es anders sehen.",
    },
    {
      title: "Clientseitiges Scannen ändert das Verschlüsselungs-Vertrauensmodell",
      body: "Der Verschlüsselungsalgorithmus kann mathematisch stark bleiben, aber die Software muss Inhalte prüfen, bevor Verschlüsselung sie schützt. Das ist nicht die Privatsphäre-Garantie, die Nutzer von Ende-zu-Ende-Verschlüsselung erwarten.",
    },
    {
      title: "Scan-Infrastruktur wird zum hochwertigen Angriffsziel",
      body: "Sobald Geräte private Nachrichten prüfen müssen, kann derselbe Mechanismus Angreifer, politischen Druck und künftige Forderungen anziehen, nach weiteren Inhaltskategorien zu scannen.",
    },
  ],
  protectedGroups: [
    "Journalisten und vertrauliche Quellen",
    "Anwälte und Mandanten",
    "Ärzte und Patienten",
    "Unternehmen, die Geschäftsgeheimnisse schützen",
    "Regierungsbeamte und Diplomaten",
    "Strafverfolgung und militärische Kommunikation",
  ],
  betterInvestments: [
    { title: "Opfer unterstützen", body: "Trauma-sensible Meldekanäle und langfristige Opferhilfe." },
    { title: "Spezialisten finanzieren", body: "Mehr Kapazität für geschulte Ermittlungsteams." },
    { title: "Beweise untersuchen", body: "Schnelle, gezielte Ermittlung auf Basis konkreter Hinweise und Meldungen." },
    { title: "Grenzüberschreitend arbeiten", body: "Internationale Zusammenarbeit, wenn Täter, Plattformen und Opfer mehrere Rechtsordnungen betreffen." },
    { title: "Bestätigtes Material entfernen", body: "Schnellere Entfernung bekannter illegaler Inhalte nach ordnungsgemäßer Bestätigung." },
    { title: "Missbrauch früher verhindern", body: "Aufklärung und Prävention, bevor Missbrauch entsteht." },
  ],
  betterInvestmentEyebrow: "Bessere Investition",
  betterInvestmentTitle: "Die Arbeit stärken, die Opfern und Ermittlern direkt hilft",
  sections: {
    proposalReturns: {
      title: "Der Vorschlag kehrt immer wieder",
      paragraphs: [
        "In den letzten Jahren durchlief CSAR mehrere Überarbeitungen. Manche Verbesserungen verdienen Anerkennung: schnellere Bearbeitung freiwilliger Meldungen, klarere Pflichten und engere Inhaltskategorien sind besser als breitere, vagere Mandate.",
        "Diese Änderungen beseitigen aber nicht das zentrale technische Problem. Die umstrittensten Versionen von Chat Control stützen sich weiter auf Erkennungstechnologien, vor denen Kryptografen, Informatiker und Sicherheitsforscher warnen—nicht zuverlässig genug für Hunderte Millionen privater Kommunikationen.",
      ],
    },
    cryptographersObject: { title: "Warum Kryptografen weiter widersprechen" },
    e2eeScanning: {
      title: "Ende-zu-Ende-Verschlüsselung überlebt kein verpflichtendes clientseitiges Scannen",
      paragraphs: [
        "Ende-zu-Ende-Verschlüsselung gibt Nutzern ein einfaches Versprechen: Nur Sender und beabsichtigter Empfänger können die Nachricht lesen. Verpflichtendes clientseitiges Scannen ändert dieses Versprechen. Das Gerät muss die Nachricht prüfen, bevor Verschlüsselung sie schützt, und alles melden, was das Scan-System als verdächtig einstuft.",
        "In der Übertragung kann die Nachricht weiterhin stark verschlüsselt sein. Das Problem liegt davor. Muss Software Klartext auf dem Gerät prüfen und Treffer an ein externes System melden, handelt der Endpunkt nicht mehr nur für den Nutzer. Das ist ein anderes Vertrauensmodell als Ende-zu-Ende-Verschlüsselung, wie Menschen sie verstehen.",
      ],
    },
    encryptionProtects: {
      title: "Verschlüsselung schützt mehr als private Chats",
      intro:
        "Die öffentliche Debatte klingt oft, als ginge es bei verschlüsselter Kommunikation nur um lockere Gespräche. Das stimmt nicht. Sichere private Kommunikation ist kritische Infrastruktur für Menschen und Institutionen mit realem Risiko.",
    },
    moreTech: {
      title: "Mehr Technologie bedeutet nicht automatisch mehr Sicherheit",
      paragraphs: [
        "Der Vorschlag steht neben breiteren Forderungen nach Altersverifikation und weiteren Schutzsystemen. Das klingt nach zusätzlichen Sicherheitsschichten, aber Sicherheitsengineering verbessert sich selten durch Komplexität ohne Verständnis der neuen Angriffsflächen.",
        "Zentralisierte Identitätsprüfungen, Scan-Pipelines, Review-Warteschlangen und Melde-Infrastruktur können eigene Privatsphäre-Risiken einführen. Ein System zum Kinderschutz sollte nicht leise neue Datenbanken, neue Überwachungsanreize und neue Fehlermodi für alle schaffen.",
      ],
    },
    betterWays: {
      title: "Es gibt bessere Wege, Kinder zu schützen",
      intro:
        "Ein Punkt aus der wissenschaftlichen Kritik verdient besondere Aufmerksamkeit: CSAM ist Beweis für eine frühere Straftat. Das eigentliche Ziel sollte sein, Missbrauch zu verhindern, Opfer zu unterstützen und gezielte Ermittlungen zu ermöglichen, die Täter tatsächlich identifizieren.",
    },
    privateNote: {
      title: "Warum das für PrivateNote wichtig ist",
      paragraphs: [
        "Bei PrivateNote ist das Prinzip einfach: Wenn Sie eine verschlüsselte Notiz erstellen, sollen nur die von Ihnen Gewählten sie lesen können. Nicht wir. Nicht Werbetreibende. Nicht Cloud-Anbieter. Niemand sonst.",
        "Dieses Prinzip ist kein Slogan. Es spiegelt Jahrzehnte kryptografischer Ingenieursarbeit. Die Debatte um Chat Control fragt, ob private Kommunikation wirklich privat bleiben soll—oder ob jedes Gerät zur verpflichtenden Kontrollstelle wird, die Nachrichten prüft, bevor sie verschlüsselt werden.",
      ],
    },
    policyReality: {
      title: "Politik sollte der technischen Realität folgen",
      paragraphs: [
        "Vernünftige Menschen können in der Politik unterschiedlicher Meinung sein. **Aber Politik sollte von technischer Realität informiert sein.** Wenn Hunderte Kryptografen, Informatiker, Sicherheitsingenieure und Datenschutzforscher warnen, eine vorgeschlagene Technologie könne ihre Versprechen nicht erfüllen, ohne fundamentale Sicherheitsgarantien zu schwächen, sollten Gesetzgeber zuhören.",
        "Kinder schützen und sichere Kommunikation schützen schließen einander nicht aus. Europa sollte Lösungen verfolgen, die beides erreichen.",
      ],
    },
  },
  ctaTitle: "Private Notizen senden, ohne dem Server den Schlüssel zu geben",
  ctaBody:
    "PrivateNote verschlüsselt Notizen in Ihrem Browser und hält den Entschlüsselungsschlüssel im URL-Fragment.",
  ctaButton: "PrivateNote testen ->",
};
