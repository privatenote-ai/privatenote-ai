import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksDe: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Ruhige Schreibtischszene, die eine vorübergehende Dateiübergabe gegenüber dauerhaften Cloud-Kollaborationsordnern andeutet",
  heroCaption:
    "Drive glänzt bei laufender Zusammenarbeit. Einmal-Links glänzen, wenn die Datei nur für die Übergabe existieren muss.",
  intro: [
    "Google Drive gehört zu den besten Werkzeugen, um Dateien zu speichern und über Tage, Wochen oder Jahre mit anderen zusammenzuarbeiten. [Einmalige verschlüsselte Links](blog:one-time-secret-links) lösen ein anderes Problem: vertrauliche Informationen sicher einmal zu übergeben und den Zugriff automatisch zu entfernen, sobald er nicht mehr nötig ist.",
    "Kein Ansatz ist generell besser. Die richtige Wahl hängt davon ab, ob Sie an einem Dokument zusammenarbeiten oder lediglich vertrauliche Informationen liefern.",
  ],
  sections: [
    {
      title: "Warum das wichtig ist",
      takeaway:
        "Bequemlichkeit macht Drive zum Standard—auch wenn die Datei nur einmal gesehen werden muss.",
      paragraphs: [
        "Für viele Menschen ist Google Drive zur Standardantwort geworden, sobald eine Datei geteilt werden muss. Es ist in Gmail, Android, Google Workspace und unzählige Geschäftsabläufe integriert. PDF, Tabelle oder Vertrag senden? Hochladen zu Drive, Link kopieren und absenden.",
        "Diese Bequemlichkeit hat Drive enorm erfolgreich gemacht—kann aber dazu verleiten, dasselbe Werkzeug für Situationen zu nutzen, für die es nicht speziell gedacht war.",
        "Stellen Sie sich vor, Sie senden eine Passkopie an Ihren Steuerberater, einen unterschriebenen Arbeitsvertrag an die Personalabteilung oder Steuerunterlagen an einen Finanzberater. In den meisten Fällen braucht der Empfänger diese Dateien nur einmal. Nach erledigter Aufgabe erhöht jede verbleibende Kopie nur die Chance, dass die Informationen länger zugänglich bleiben als nötig.",
        "Das größte Risiko ist selten, dass jemand die Datei während der Übertragung abfängt. Moderne Cloud-Dienste verschlüsseln Daten [während der Übertragung](blog:encrypted-vs-secure-file-sharing). Das größere Problem ist die **Aufbewahrung**. Vertrauliche Informationen bleiben oft in Cloud-Speicher, E-Mail-Benachrichtigungen, synchronisierten Ordnern und heruntergeladenen Dateien, lange nachdem alle vergessen haben, dass sie existieren.",
      ],
    },
    {
      title: "Google Drive ist für Zusammenarbeit gebaut",
      takeaway: "Gleichzeitiges Bearbeiten, Versionsverlauf und gemeinsame Ordner sind Stärken—keine Fehler.",
      paragraphs: [
        "Google Drive ist hervorragend darin, Menschen gemeinsam arbeiten zu lassen. Mehrere Personen können dasselbe Dokument gleichzeitig bearbeiten, Änderungen werden automatisch gespeichert, der Versionsverlauf erleichtert das Wiederherstellen früherer Revisionen, und Berechtigungen lassen sich anpassen, wenn Teammitglieder zu einem Projekt hinzukommen oder es verlassen. Für laufende Arbeit sind das enorme Vorteile.",
        "Genau für diese Umgebung wurde Drive entwickelt. Ein Projektordner kann monatelang aktiv bleiben, während Dokumente wachsen und neue Dateien hinzukommen.",
        "Die Herausforderung entsteht, wenn dieselben Kollaborationsfunktionen für Informationen genutzt werden, die von vornherein nicht dauerhaft verfügbar bleiben sollten.",
      ],
    },
    {
      title: "Die versteckten Kosten langfristigen Zugriffs",
      takeaway:
        "Vorübergehende Übergaben hinterlassen dauerhafte Spuren, wenn die Plattform auf Verfügbarkeit optimiert.",
      paragraphs: [
        "Die meisten vertraulichen Dateien müssen nicht für immer verfügbar sein. Eine Passkopie braucht man vielleicht nur zur Identitätsprüfung. Eine Steuererklärung nur für eine bestimmte Einreichung. Ein API-Schlüssel könnte einmal verwendet und dann rotiert werden. Sobald der Empfänger fertig ist, bringt die weitere Speicherung kaum Nutzen.",
        "Leider ist das Löschen von Zugriff nicht immer einfach. Menschen laden Dateien auf Laptops herunter. Ordner werden geräteübergreifend synchronisiert. E-Mail-Einladungen bleiben in Postfächern. Gemeinsame Ordner bestehen weiter. Monate später entdeckt jemand einen alten Ordner mit Berechtigungen, an die sich niemand erinnerte.",
        "Nichts davon ist ein Versagen von Google Drive. Es ist die natürliche Folge, wenn man eine Kollaborationsplattform für eine vorübergehende Übergabe nutzt—dasselbe Aufbewahrungsmuster, das entsteht, wenn Leute [Geheimnisse per E-Mail](blog:why-email-is-worst-for-secrets) senden oder [Dokumente im Chat](blog:secrets-never-send-in-chat) hinterlassen.",
      ],
    },
    {
      title: "Wann Einmal-Links sinnvoller sind",
      takeaway:
        "Einmal liefern, by Design ablaufen lassen—ohne aus jeder Übergabe einen gemeinsamen Arbeitsbereich zu machen.",
      paragraphs: [
        "Einmalige verschlüsselte Links verfolgen ein anderes Ziel. Statt einen gemeinsamen Arbeitsbereich zu schaffen, konzentrieren sie sich darauf, vertrauliche Informationen mit dem kleinstmöglichen digitalen Fußabdruck zu liefern. Die Informationen werden verschlüsselt, bevor sie den Browser verlassen, und der Zugriff kann auf eine einzelne Ansicht oder eine kurze Ablaufzeit begrenzt werden. Nach abgeschlossener Übergabe ist der Link unbrauchbar.",
        "Es geht nicht darum, Cloud-Speicher zu ersetzen. Es geht darum zu erkennen, dass nicht jede Datei dauerhaften Speicher oder laufende Berechtigungen verdient.",
        "Wenn Sie einen Wiederherstellungscode an einen Kollegen, einen unterschriebenen Vertrag an einen Kunden oder medizinische Unterlagen an einen Spezialisten senden, brauchen Sie wahrscheinlich kein gemeinsames Bearbeiten, keinen Versionsverlauf und keinen gemeinsamen Ordner. Sie brauchen lediglich, dass die richtige Person die Informationen sicher erhält—siehe auch [wie man sensible Dokumente sicher sendet](blog:send-sensitive-documents-securely).",
        "Dienste wie [PrivateNote](app:secure-file-transfer) sind um dieses Modell des vorübergehenden Teilens herum gebaut. Statt langfristige Speicherung zu fördern, minimieren sie die Aufbewahrung durch clientseitige Verschlüsselung und automatisches Ablaufen.",
      ],
    },
    {
      title: "Welche Methode sollten Sie wählen?",
      takeaway:
        "Passen Sie das Werkzeug an die Lebensdauer der Information an—nicht an die vertrauteste Plattform.",
      paragraphs: [
        "Die Entscheidung geht weniger um abstrakte „Sicherheit“ und mehr um den Zweck.",
        "Wenn mehrere Personen ein Dokument über die Zeit prüfen, bearbeiten und wieder öffnen müssen, ist Google Drive eine ausgezeichnete Wahl. Kommentare, Versionsverlauf und gemeinsame Ordner machen Zusammenarbeit einfach.",
        "Wenn die Information nur einmal geliefert werden muss, passt ein einmaliger verschlüsselter Link oft besser. Er macht langfristige Berechtigungen überflüssig, reduziert unnötige Kopien und begrenzt, wie lange die Information verfügbar bleibt.",
      ],
      calloutTitle: "Faustregel",
      callout:
        "Wählen Sie das Werkzeug danach, wie lange die Information tatsächlich verfügbar bleiben muss—nicht danach, was Sie aus Gewohnheit öffnen.",
    },
    {
      title: "Vergleich",
      takeaway: "Kollaborationsfunktionen und ephemere Lieferung lösen unterschiedliche Aufgaben.",
      comparisonTable: {
        headers: ["Merkmal", "Google Drive", "Einmaliger verschlüsselter Link"],
        rows: [
          ["Für Zusammenarbeit ausgelegt", "Ja", "Nein"],
          ["Langzeitspeicher", "Ja", "Nein"],
          ["Clientseitige Ende-zu-Ende-Verschlüsselung", "Nicht standardmäßig*", "Ja"],
          ["Automatisches Ablaufen", "Nein (manuelle Bereinigung)", "Ja"],
          ["Einmaliger Lesezugriff", "Nein", "Ja"],
          ["Laufende Berechtigungsverwaltung", "Ja", "Nein"],
          ["Am besten für vorübergehendes vertrauliches Teilen", "Manchmal", "Ja"],
        ],
        after: [
          "*Standard-Drive verschlüsselt Daten während der Übertragung und im Ruhezustand mit von Google verwalteten Schlüsseln. Google Workspace bietet für manche Organisationen optionale [clientseitige Verschlüsselung](https://support.google.com/a/answer/10741875), doch alltägliche Freigabelinks optimieren weiterhin auf dauerhaften Zugriff statt auf Burn-after-Reading-Lieferung.",
        ],
      },
    },
    {
      title: "Checkliste für Best Practices",
      takeaway: "Kleine Gewohnheiten senken das Aufbewahrungsrisiko—egal welches Werkzeug Sie wählen.",
      paragraphs: [
        "Unabhängig vom gewählten Werkzeug reduzieren einige einfache Gewohnheiten unnötige Exposition erheblich.",
      ],
      checklist: [
        "Nur teilen, was der Empfänger braucht—keine ganzen Ordner mit unzusammenhängenden persönlichen Daten",
        "Unnötige Metadaten aus PDFs, Office-Dateien und Bildern entfernen, wenn praktikabel",
        "Falls Sie eine Passphrase nutzen: auf einem separaten Kanal senden (Out-of-Band / OOB)",
        "Nach erledigter Aufgabe: Freigaben widerrufen, lokale Temporärkopien löschen und unbefristete gemeinsame Ordner vermeiden",
      ],
      paragraphsAfterChecklist: [
        "Out-of-Band-Lieferung bedeutet: Der verschlüsselte Link läuft über einen Kanal (z. B. E-Mail), die Passphrase über einen anderen (Signal, SMS oder Telefonanruf). Das Kompromittieren nur eines Kanals sollte nicht reichen, um die Datei zu öffnen.",
        "Für einen tieferen Workflow bei Dokumentübergaben folgen Sie dem [Leitfaden für sensible Dokumente](blog:send-sensitive-documents-securely). Zum Unterschied zwischen Browser- und Transportverschlüsselung siehe [verschlüsselt vs. sicheres Dateiteilen](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist Google Drive sicher?",
          answer:
            "Ja—Google Drive ist eine ausgereifte Cloud-Plattform, die Informationen während der Übertragung und im Ruhezustand verschlüsselt. Die Gesamtexposition hängt weiterhin davon ab, wie Dateien geteilt werden, wie Berechtigungen verwaltet werden und wie lange Dokumente nach erledigter Aufgabe zugänglich bleiben.",
        },
        {
          question: "Ist Google Drive ende-zu-ende-verschlüsselt?",
          answer:
            "Nicht im Sinne clientseitig verschlüsselter Messaging-Apps oder browserverschlüsselter Einmal-Links. Beim Standard-Drive-Speicher verwaltet Google die Verschlüsselungsschlüssel. Optionale Workspace-Clientseitige Verschlüsselung ändert das Bild für berechtigte Organisationen, doch alltägliches Teilen „für alle mit dem Link“ hinterlässt weiterhin dauerhafte Kopien und Berechtigungsflächen, die ephemere Lieferung vermeidet. Siehe [was Ende-zu-Ende-Verschlüsselung bedeutet](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Sind Einmal-Links sicherer als Google Drive?",
          answer:
            "Bei vorübergehenden vertraulichen Übergaben verringern sie oft das langfristige Risiko, weil sie Aufbewahrung minimieren und Zugriff nach der Lieferung automatisch entfernen können. Für gemeinsame Bearbeitung und laufende Projekte bleibt Drive das bessere Werkzeug. Sicherheit folgt dem Zweck—nicht einer universellen Rangfolge.",
        },
        {
          question: "Was, wenn ich einen Einmal-Link an die falsche Person sende?",
          answer:
            "Schützen Sie den Inhalt mit einer Passphrase, nutzen Sie eine kurze Ablaufzeit und vernichten Sie die Notiz vor dem Öffnen, wenn Ihr Tool das erlaubt. Den Empfänger vor dem Senden zu verifizieren bleibt die stärkste Verteidigung. Behörden wie [CISA](https://www.cisa.gov/) betonen durchgängig, Zugriffszeiten zu begrenzen und Least Privilege anzuwenden—dieselben Ideen hinter kurzlebigen verschlüsselten Links.",
        },
      ],
    },
  ],
  ctaTitle: "Brauchen Sie eine vorübergehende vertrauliche Übergabe?",
  ctaBody:
    "Google Drive und einmalige verschlüsselte Links sind ergänzende Werkzeuge. Wenn Menschen über die Zeit an Dokumenten zusammenarbeiten müssen, gehört Drive zu den besten Kollaborationsplattformen. Wenn Ihr Ziel ist, vertrauliche Informationen einmal zu übergeben und die Zugänglichkeit so kurz wie möglich zu halten, erstellen Sie einen ende-zu-ende-verschlüsselten Einmal-Link in Ihrem Browser—ohne dauerhafte Kopien in E-Mail oder gemeinsamen Ordnern zu hinterlassen.",
  ctaButton: "Sicheren Einmal-Link erstellen",
};
