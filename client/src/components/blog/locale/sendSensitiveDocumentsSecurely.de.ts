import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyDe: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Konzept für sicheren Dokumentenversand: ein versiegelter Umschlag und eine verschlüsselte Dateiübergabe auf einem ruhigen Schreibtisch",
  heroCaption:
    "Der schwierige Teil ist selten der Senden-Knopf. Entscheidend ist, was mit jeder Kopie passiert, nachdem das Dokument angekommen ist.",
  intro: [
    "Stellen Sie sich vor, Sie müssen Ihren Reisepass an eine Bank senden, Ihr Steuerberater bittet um Unterlagen, Ihr Arbeitgeber verlangt einen Identitätsnachweis, oder ein Kunde braucht einen unterschriebenen Vertrag.",
    "Die Aufgabe selbst dauert nur wenige Sekunden: Datei anhängen, Senden klicken, weitermachen. Die Übertragung ist selten der schwächste Teil des Prozesses. Das eigentliche Problem beginnt, nachdem das Dokument angekommen ist.",
    "Dieser Anhang kann jahrelang in Postfächern, Cloud-Backups, synchronisierten Geräten, archivierten Mailboxen und alten Chat-Verläufen verbleiben. In vielen Fällen ist das größte Datenschutzrisiko nicht das Abfangen während der Übertragung — es ist, dass Kopien lange weiterexistieren, nachdem das Dokument seinen Zweck erfüllt hat.",
    "Dieser Leitfaden erklärt, warum klassisches Dokumententeilen oft nicht ausreicht, was sicheres Dokumententeilen wirklich bedeutet, und wie [browserseitige Verschlüsselung](blog:encrypted-vs-secure-file-sharing) und [Einmal-Links](blog:one-time-secret-links) Ihnen helfen, vertrauliche Informationen privat zu halten.",
  ],
  sections: [
    {
      title: "Warum vertrauliche Dokumente eine andere Behandlung verdienen",
      takeaway:
        "Wenn ein Dokument schwer zu ersetzen wäre — oder ein Leck schmerzhaft wäre —, behandeln Sie es nicht wie ein Urlaubsfoto.",
      paragraphs: [
        "Nicht jede Datei verdient denselben Schutz. Ein Urlaubsfoto online zu verlieren mag enttäuschend sein. Ein vertrauliches Dokument zu verlieren kann Folgen haben, die Jahre andauern.",
        "Identitätsdokumente enthalten oft Ihren vollständigen Namen, Ihr Geburtsdatum, Ihre Ausweisnummer, Staatsangehörigkeit, Unterschrift und Ihr Foto. Finanzunterlagen offenbaren Einkommen, Ersparnisse, Steuerinformationen oder Bankkontodaten. Medizinische Dokumente enthalten zutiefst persönliche Informationen, während Verträge häufig kommerziell sensible Details enthalten, die nie öffentlich werden sollten.",
        "Wenn jemand Ihr Passwort erfährt, ändern Sie es. Wenn jemand Ihren Reisepass, Personalausweis, Ihre Steuererklärung oder Ihren Arbeitsvertrag kopiert, ist die Lage weit komplizierter. Deshalb verdienen vertrauliche Dokumente einen anderen Ansatz als die alltägliche Kommunikation.",
      ],
    },
    {
      title: "Das versteckte Problem mit E-Mail",
      takeaway: "TLS schützt den Transportweg; es verhindert nicht, dass sich danach dauerhafte Kopien ansammeln.",
      paragraphs: [
        "E-Mail bleibt eines der nützlichsten Kommunikationsmittel, die je erfunden wurden. Sie wurde nie als sicheres System zur Dokumentenzustellung entworfen.",
        "Moderne E-Mail-Anbieter schützen Nachrichten während der Übertragung mit verschlüsselten Verbindungen wie TLS. Sobald die Nachricht angekommen ist, wird der Anhang üblicherweise gespeichert, damit er später durchsucht, synchronisiert, gefiltert, gesichert und abgerufen werden kann.",
        "Aus einem einzigen Anhang werden schnell mehrere Kopien: Ihr Gesendet-Ordner, das Postfach des Empfängers, Telefone, Laptops, Unternehmensarchive, Cloud-Backups und manchmal automatische Weiterleitungssysteme. Die E-Mail später zu löschen entfernt selten jede Kopie.",
        "Für alltägliche Gespräche ist das meist unbedenklich. Für Reisepässe, Verträge, Finanzunterlagen oder medizinische Berichte oft nicht. Einen tieferen Blick darauf, warum E-Mail ein schlechter Ort für Geheimnisse ist, finden Sie unter [warum E-Mail der schlechteste Ort für Geheimnisse ist](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Warum Messaging-Apps eine dauerhafte Spur hinterlassen",
      takeaway: "Chat macht Zusammenarbeit einfach — und Dokumentenaufbewahrung unbeabsichtigt.",
      paragraphs: [
        "Viele Menschen vermeiden E-Mail und senden vertrauliche Dokumente stattdessen über Slack, Microsoft Teams, WhatsApp, Signal, Telegram oder Discord. Diese Plattformen lösen das Problem der Zusammenarbeit. Sie lösen nicht das Problem des Dokumentenlebenszyklus.",
        "In Chats geteilte Dateien bleiben oft monate- oder jahrelang durchsuchbar, synchronisieren sich über mehrere Geräte, landen in automatischen Backups und werden auf private Computer heruntergeladen. Selbst wenn das Gespräch längst vergessen ist, bleiben die Dokumente oft erhalten.",
        "Das größte Datenschutzrisiko ist oft nicht das Abfangen durch Hacker. Es ist, dass sich bei vertraulichen Informationen still Kopien anhäufen, die niemand aufbewahren wollte. Dasselbe Muster zeigt sich, wenn Teams [Geheimnisse in den Chat einfügen](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Cloud-Speicher löst ein anderes Problem",
      takeaway:
        "Cloud-Speicher ist für dauerhaften Zugriff gebaut; temporäre Zustellung braucht Ablauf von Beginn an.",
      paragraphs: [
        "Dienste wie Google Drive, OneDrive, Dropbox und iCloud eignen sich hervorragend für Zusammenarbeit, Backups und langfristige Speicherung. Sichere Dokumentenzustellung ist ein anderes Problem.",
        "Wenn mehrere Kollegen dauerhaften Zugriff auf dieselben Dateien brauchen, ist Cloud-Speicher das richtige Werkzeug. Wenn Sie einfach möchten, dass eine Person heute ein vertrauliches Dokument erhält — und es nächsten Monat nicht mehr verfügbar sein muss —, sind die Anforderungen völlig andere.",
        "Dauerhafte Freigabelinks bleiben oft im Browserverlauf, alten E-Mails, Projektdokumenten, Chat-Nachrichten und Lesezeichen erhalten, lange nachdem alle annehmen, sie seien verschwunden. Cloud-Speicher ist auf langfristige Verfügbarkeit optimiert, nicht auf temporäre Zustellung.",
      ],
    },
    {
      title: "Sicheres Dokumententeilen ist mehr als Verschlüsselung",
      takeaway: "Verschlüsselung schützt die Bits; Lebenszyklus-Kontrollen entscheiden, wie lange die Gefährdung anhält.",
      paragraphs: [
        "Wenn Menschen von „sicherem Dokumententeilen“ hören, denken sie oft nur an Verschlüsselung. Verschlüsselung ist essenziell. Sie ist nicht die ganze Geschichte.",
        "Sicheres Teilen bedeutet, unnötige Gefährdung über die gesamte Lebensdauer eines Dokuments zu reduzieren. Ein gut durchdachtes System sollte beantworten: Kann nur der vorgesehene Empfänger auf das Dokument zugreifen? Läuft der Zugriff automatisch ab? Werden unnötige Kopien vermieden? Erhält der Dienst das Originaldokument oder nur verschlüsselte Daten?",
        "Sicherheit bedeutet nicht nur, eine Datei während der Übertragung zu schützen. Es geht darum, zu begrenzen, wer darauf zugreifen kann — und wie lange.",
      ],
    },
    {
      title: "E-Mail vs. Einmal-verschlüsselter Link",
      takeaway:
        "E-Mail ist dafür gebaut, Nachrichten zu behalten; Einmal-verschlüsselte Links sind dafür gebaut, ein Dokument zuzustellen und es danach nicht mehr zu behalten.",
      comparisonTable: {
        headers: ["", "E-Mail-Anhang", "Einmal-verschlüsselter Link"],
        rows: [
          ["Einfachheit des Sendens", "Sehr hoch", "Hoch"],
          [
            "Erzeugte Kopien",
            "Viele (Gesendet, Posteingang, Geräte, Backups)",
            "Deutlich weniger, by design",
          ],
          ["Zugriffsdauer", "Oft unbegrenzt", "Läuft ab oder wird nach Nutzung gelöscht"],
          [
            "Was der Dienst sieht",
            "Meist die Originaldatei",
            "Chiffretext, wenn zuerst im Browser verschlüsselt",
          ],
          [
            "Am besten geeignet für",
            "Alltägliche, unsensible Post",
            "Reisepässe, Verträge, Steuer- und Ausweisdokumente",
          ],
        ],
        after: [
          "**Kurzfassung:** E-Mail-Anhang = einfaches Senden, Kopien, die jahrelang bestehen können. Einmal-verschlüsselter Link = Verschlüsselung im Browser vor dem Upload, ablaufender Zugriff, deutlich weniger übrig bleibende Kopien.",
        ],
      },
    },
    {
      title: "Browserverschlüsselung reduziert das nötige Vertrauen",
      takeaway:
        "Vor dem Upload verschlüsseln, damit der Dienst Chiffretext speichert — nicht Ihr Originaldokument.",
      paragraphs: [
        "Klassische Filesharing-Plattformen erhalten in der Regel Ihr Originaldokument, bevor sie es speichern oder verarbeiten. Browserbasierte Verschlüsselung funktioniert anders.",
        "Bevor die Datei Ihren Computer verlässt, verschlüsselt Ihr Browser sie lokal. Der Dienst speichert verschlüsselten Chiffretext statt des Originaldokuments. Ohne den passenden Entschlüsselungsschlüssel sind die gespeicherten Daten unverständlich.",
        "Statt sich nach der Übermittlung vollständig auf den Anbieter zu verlassen, verringern Sie von Anfang an die Informationen, die der Anbieter erhält. Der Leitfaden von PrivateNote zu [verschlüsseltem vs. sicherem Filesharing](blog:encrypted-vs-secure-file-sharing) erklärt dieses Modell ausführlicher.",
      ],
    },
    {
      title: "Einmal-Links reduzieren langfristige Gefährdung",
      takeaway: "Die meisten Leaks sind übrig gebliebener Zugriff — kein Hollywood-Hacking.",
      paragraphs: [
        "Viele Dokumentenlecks entstehen, weil alte Dokumente weiter existieren: E-Mail-Anhänge in Postfächern, Cloud-Links, die noch funktionieren, Chat-Verläufe, die alte Dateien bewahren.",
        "Einmal-Links verfolgen einen anderen Ansatz. Der Empfänger ruft das Dokument einmal ab. Danach werden die verschlüsselten Daten entfernt, oder der Freigabelink läuft dauerhaft ab.",
        "Kein vergessener geteilter Ordner. Kein jahrealter Download-Link. Kein vertrauliches Dokument, das still darauf wartet, entdeckt zu werden.",
        "Keine Technologie kann einen berechtigten Empfänger davon abhalten, absichtlich eine Kopie zu speichern, nachdem er das Dokument geöffnet hat. Was Einmal-Teilen tatsächlich erreicht, ist die Eliminierung vieler unnötiger Kopien, die klassische Tools erzeugen.",
      ],
      calloutTitle: "Faustregel",
      callout:
        "Wenn Sie sich nicht wohl damit fühlen würden, ein Dokument auf einer öffentlichen Website zu veröffentlichen, überlegen Sie genau, bevor Sie es als dauerhaften E-Mail-Anhang versenden.",
    },
    {
      title: "Eine zusätzliche Ebene: passwortgeschütztes Teilen",
      takeaway: "Trennen Sie den Link vom Passwort, damit ein Fehler nicht beide offenlegt.",
      paragraphs: [
        "Manchmal verdient sogar der Freigabelink Schutz — eine versehentlich weitergeleitete E-Mail, sichtbarer Browserverlauf oder ein kompromittiertes Messaging-Konto.",
        "Ein Passwort hinzuzufügen schafft eine weitere Ebene. Selbst wenn jemand den Freigabelink entdeckt, kann er das Dokument ohne das Passwort trotzdem nicht entschlüsseln.",
        "Bei besonders sensiblen Informationen teilen Sie das Passwort über einen anderen Kanal — Telefon oder persönlich — statt in derselben Nachricht wie den Link. Dasselbe Muster gilt, wenn Sie [ein Passwort sicher teilen](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Sicheres Dokumententeilen in Europa und darüber hinaus",
      takeaway:
        "Die DSGVO nennt kein bestimmtes Produkt — aber begrenzter Zugriff und Aufbewahrung entsprechen ihrem Geist.",
      paragraphs: [
        "In ganz Europa verarbeiten Organisationen personenbezogene Daten im Rahmen der DSGVO. Sie schreibt keinen bestimmten Filesharing-Dienst vor, verlangt aber angemessene technische und organisatorische Maßnahmen entsprechend dem Risiko.",
        "Verschlüsseltes Teilen, begrenzte Verfügbarkeit und weniger unnötige Kopien sind praktische Beispiele für diese Prinzipien. Dieselben Ideen gelten, egal ob Sie Dokumente an einen Steuerberater, Arbeitgeber, Anwalt, eine Universität, einen Gesundheitsdienstleister, eine Bank, einen Versicherer oder eine Behörde senden.",
      ],
    },
    {
      title: "Wann sollten Sie sicheres Dokumententeilen nutzen?",
      takeaway:
        "Wenn es wichtig wäre, dass dieses Dokument öffentlich würde, senden Sie es nicht als dauerhaften Anhang.",
      paragraphs: [
        "Dazu gehören Reisepässe, Personalausweise, Führerscheine, Finanzunterlagen, Steuerdokumente, Hypothekenanträge, Arbeitsverträge, Versicherungsunterlagen, Rechtsvereinbarungen, medizinische Berichte, vertrauliche Geschäftsinformationen, Forschungsdaten, Kundendaten und geistiges Eigentum.",
        "Je schwieriger ein Dokument zu ersetzen wäre — oder je größer die Folgen einer Offenlegung —, desto sorgfältiger sollte es geteilt werden.",
      ],
    },
    {
      title: "Praktische Wege, Risiko zu reduzieren",
      takeaway: "Perfekte Sicherheit existiert nicht; weniger Kopien und kürzerer Zugriff helfen fast immer.",
      paragraphs: [
        "Bevor Sie ein vertrauliches Dokument senden, gehen Sie diese kurze Checkliste durch:",
      ],
      checklist: [
        "Empfänger verifizieren — richtige Person, richtige Adresse oder richtiger Kanal",
        "Nur das Nötige senden — benötigte Seiten, nicht das ganze Paket, wenn möglich",
        "Einen ablaufenden oder Einmal-Link verwenden — keinen dauerhaften Anhang",
        "Ein Passwort für hochsensible Dateien hinzufügen — und es über einen separaten Kanal teilen",
        "Zustellung bestätigen, dann aufräumen — lokale und Postfach-Kopien löschen, die Sie nicht mehr brauchen",
      ],
      paragraphsAfterChecklist: [
        "Die Anzahl der Kopien zu reduzieren ist eine der einfachsten und wirksamsten Datenschutzverbesserungen, die jeder vornehmen kann.",
      ],
      midCta: {
        body: "Bereit, einen Reisepass-Scan, Vertrag oder Steuerunterlagen zu senden, ohne eine dauerhafte Spur in E-Mails zu hinterlassen?",
        button: "Sichere Dateiübertragung starten",
      },
    },
    {
      title: "Häufig gestellte Fragen",
      takeaway: "Verschlüsselung hilft; Ablauf und weniger Kopien erledigen den Rest.",
      faqs: [
        {
          question: "Reicht es, eine PDF mit Passwort zu schützen?",
          answer:
            "Es hilft, löst aber nicht das Problem der Persistenz. Die verschlüsselte PDF kann jahrelang in E-Mail-Archiven, Cloud-Backups und Downloads verbleiben. Kombinieren Sie Verschlüsselung mit ablaufender oder Einmal-Zustellung.",
        },
        {
          question: "Ist HTTPS nicht schon sicher?",
          answer:
            "HTTPS schützt Daten während der Übertragung. Es hindert den empfangenden Dienst nicht notwendigerweise daran, die Datei danach zu speichern oder darauf zuzugreifen. Browserbasierte Verschlüsselung verschlüsselt vor dem Upload.",
        },
        {
          question: "Was ist mit verschlüsselten ZIP-Dateien?",
          answer:
            "Vertretbar, wenn Sie starke Verschlüsselung nutzen und das Passwort separat übermitteln — aber sie hinterlassen weiterhin dauerhafte Dateien in E-Mail-Systemen, sofern die Freigabemethode nicht auch begrenzt, wie lange die Datei verfügbar bleibt.",
        },
        {
          question: "Kann sicheres Teilen den Empfänger davon abhalten, das Dokument zu speichern?",
          answer:
            "Nein. Sobald jemand ein Dokument legitim erhalten hat, kann er es speichern, ausdrucken oder den Bildschirm fotografieren. Sicheres Teilen reduziert unnötige Gefährdung vor und nach der Zustellung; es kann absichtliche Handlungen vertrauenswürdiger Empfänger nicht verhindern.",
        },
      ],
    },
    {
      title: "Vertrauliche Dokumente mit PrivateNote teilen",
      takeaway:
        "PrivateNote ist für die temporäre Zustellung verschlüsselter Dokumente gebaut — nicht für dauerhaften Cloud-Speicher.",
      paragraphs: [
        "PrivateNote wurde auf einer einfachen Beobachtung aufgebaut: Viele vertrauliche Dokumente müssen nur so lange online existieren, bis ein einzelner Empfänger sie abgerufen hat.",
        "Statt Dokumententeilen als dauerhaften Speicher zu behandeln, verschlüsselt PrivateNote Dateien in Ihrem Browser vor dem Upload und speichert nur den resultierenden verschlüsselten Chiffretext. Sie können automatischen Ablauf wählen, Einmal-Links erstellen und, wenn passend, das Dokument über [sichere Dateiübertragung](app:secure-file-transfer) zusätzlich mit einem Passwort schützen.",
      ],
      useCaseTable: {
        headers: ["Was PrivateNote tut", "Was es nicht tut"],
        rows: [
          [
            "Verschlüsselt in Ihrem Browser vor dem Upload",
            "Liest Ihr Originaldokument auf dem Server",
          ],
          [
            "Nutzt separate kryptografische Schlüssel für Notiztext, Dateien und Metadaten",
            "Vermischt diese Belange unter einem wiederverwendbaren Schlüssel",
          ],
          [
            "Nutzt authentifizierte AES-256-GCM-Verschlüsselung mit an den Chiffretext gebundenen Richtlinien (Ablauf / Zugriffsbeschränkungen)",
            "Verlässt sich auf „Verschlüsselung“, die ignoriert, wer die Notiz öffnen darf oder wie lange",
          ],
          [
            "Unterstützt Einmal- und ablaufende Links, um übrig bleibenden Zugriff zu begrenzen",
            "Hält Dokumente standardmäßig unbegrenzt verfügbar, aus Bequemlichkeit",
          ],
          [
            "Lässt Sie ein optionales Passwort als zweiten Faktor für den Link hinzufügen",
            "Hindert einen berechtigten Empfänger daran, es nach dem Öffnen zu speichern oder auszudrucken",
          ],
          [
            "Reduziert unnötige Online-Kopien vor und nach der Zustellung",
            "Ersetzt organisatorische Prozesse, das Urteilsvermögen des Empfängers oder langfristige Tresorspeicherung",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Dieser Ansatz kann nicht verhindern, dass ein berechtigter Empfänger nach dem Öffnen des Dokuments eine Kopie speichert — keine Technologie kann das. Was er reduziert, ist die Anzahl unnötiger Kopien, die vor und nach der Zustellung online verbleiben.",
      ],
    },
    {
      title: "Abschließende Gedanken",
      takeaway:
        "Die beste Kontrolle ist oft die kürzeste Lebensdauer — nur die Menschen, die es brauchen, nur so lange, wie sie es brauchen.",
      paragraphs: [
        "Das Internet hat das Teilen von Dokumenten fast mühelos gemacht. Es hat auch das dauerhafte Aufbewahren erstaunlich einfach gemacht.",
        "Die meisten vertraulichen Dokumente müssen nicht monate- oder jahrelang zugänglich bleiben. Sie müssen nur sicher den vorgesehenen Empfänger erreichen.",
        "Eine Methode zu wählen, die vor dem Upload verschlüsselt, unnötige Kopien begrenzt und Daten entfernt, sobald sie ihren Zweck erfüllt haben, ist eine der einfachsten Möglichkeiten, den Datenschutz zu verbessern — ohne das alltägliche Dokumententeilen wesentlich zu erschweren.",
        "Die stärkste Sicherheitsmaßnahme ist nicht immer die raffinierteste Kryptografie. Manchmal reicht es einfach, sicherzustellen, dass ein vertrauliches Dokument nur für die Menschen existiert, die es brauchen, und nur so lange, wie sie es brauchen.",
      ],
    },
  ],
  ctaTitle: "Senden Sie das Dokument. Behalten Sie die Kontrolle über die Kopien.",
  ctaBody:
    "Verschlüsseln Sie eine Datei in Ihrem Browser, legen Sie einen Ablauf oder Einmal-Zugriff fest und teilen Sie einen Link — keinen dauerhaften Anhang, der für immer in jemandes Postfach bleibt.",
  ctaButton: "Datei sicher übertragen",
};
