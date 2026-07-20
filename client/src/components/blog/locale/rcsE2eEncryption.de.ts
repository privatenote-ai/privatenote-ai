import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionDe: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "iPhone und Android-Smartphones mit Schloss-Symbolen in Nachrichtenblasen, verbunden durch ein zentrales Vorhängeschloss, das Ende-zu-Ende-verschlüsseltes RCS darstellt",
  heroCaption:
    "Plattformübergreifendes RCS holt endlich auf: dieselbe Ende-zu-Ende-Verschlüsselungsgarantie, egal ob die Sprechblase blau oder grün ist.",
  intro: [
    "Jahrelang war eine der größten Frustrationen beim mobilen Messaging nicht der Mangel an Funktionen, sondern der Mangel an durchgängigem Datenschutz.",
    "Apple-Nutzer genossen Ende-zu-Ende-verschlüsselte Unterhaltungen über iMessage, während Android-Nutzer von Verschlüsselung profitieren konnten, wenn sie Google Messages mit anderen Android-Geräten verwendeten. Nachrichten zwischen Android und iPhone hatten nie denselben Schutz. Plattformübergreifende Unterhaltungen liefen über Rich Communication Services (RCS), jedoch ohne interoperable Ende-zu-Ende-Verschlüsselung.",
    "Das ändert sich endlich.",
    "Google hat vor kurzem angekündigt, dass Ende-zu-Ende-verschlüsseltes RCS-Messaging zwischen Android und iPhone eingeführt wird, nachdem das aktuelle GSMA RCS Universal Profile veröffentlicht wurde, das das Messaging Layer Security (MLS)-Protokoll integriert. Während die Unterstützung sich über Geräte und Messaging-Anwendungen ausweitet, gewinnen Milliarden von Nutzern mehr Privatsphäre für alltägliche Unterhaltungen.",
    "Das ist ein bedeutender Meilenstein für die digitale Kommunikation. Es ist auch eine gute Gelegenheit zu verstehen, was [Ende-zu-Ende-Verschlüsselung](blog:what-is-end-to-end-encryption) tatsächlich schützt — und was nicht.",
  ],
  sections: [
    {
      title: "Ein besserer Standard für alltägliches Messaging",
      paragraphs: [
        "Der Übergang von SMS zu RCS hat das Texten mit Funktionen wie hochwertigem Fotoversand, Tippanzeigen, Lesebestätigungen und umfangreicheren Gruppenunterhaltungen modernisiert. Die Sicherheit blieb jedoch uneinheitlich, je nachdem, welche Geräte beteiligt waren.",
        "Bislang konnten Android-Nutzer, die anderen Android-Nutzern schrieben, Ende-zu-Ende-Verschlüsselung über Google Messages genießen, während iPhone-Nutzer denselben Schutz innerhalb von iMessage hatten. Nachrichten zwischen Android und iPhone hingegen fehlte interoperable Ende-zu-Ende-Verschlüsselung.",
        "Der aktualisierte RCS-Standard ändert das. Sobald die Unterstützung ausgerollt ist, können Nutzer beider Plattformen endlich von denselben grundlegenden Datenschutzgarantien profitieren, unabhängig davon, welches Telefon sie besitzen.",
        "Für eine Kommunikationstechnologie, die von Milliarden Menschen genutzt wird, ist das ein wichtiger Fortschritt.",
      ],
    },
    {
      title: "Was Ende-zu-Ende-Verschlüsselung wirklich bedeutet",
      paragraphs: [
        "Ende-zu-Ende-Verschlüsselung bedeutet, dass eine Nachricht verschlüsselt wird, bevor sie das Gerät des Absenders verlässt, und nur auf dem Gerät des Empfängers entschlüsselt werden kann.",
        "Anders als bei herkömmlicher Transportverschlüsselung, bei der ein Dienstanbieter möglicherweise auf Nachrichten zugreifen kann, sobald sie seine Server erreichen, sorgt Ende-zu-Ende-Verschlüsselung dafür, dass nur die kommunizierenden Geräte die Schlüssel besitzen, die zum Lesen der Unterhaltung nötig sind. Der Messaging-Dienst transportiert verschlüsselte Daten, kann deren Inhalt aber nicht entschlüsseln.",
        "Für Nutzer ist der Vorteil klar: Ihre Unterhaltung bleibt privat zwischen Ihnen und der Person, mit der Sie sprechen.",
        "Richtig implementierte Ende-zu-Ende-Verschlüsselung schützt vor vielen gängigen Bedrohungen. Jemand, der ein öffentliches WLAN-Netzwerk überwacht, kann Ihre Nachrichten nicht einfach lesen, Internetanbieter können deren Inhalt nicht einsehen, und ein Einbruch in die Server des Messaging-Anbieters würde verschlüsselte Daten offenlegen statt lesbarer Unterhaltungen.",
        "Für die alltägliche Kommunikation stellt das eine erhebliche Verbesserung des Datenschutzes dar. Eine tiefergehende technische Definition finden Sie in unserem Leitfaden zu [was Ende-zu-Ende-Verschlüsselung bedeutet](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Verschlüsselung hat Grenzen",
      paragraphs: [
        "So wichtig Ende-zu-Ende-Verschlüsselung ist, wird sie oft missverstanden.",
        "Verschlüsselung schützt Nachrichten, während sie übertragen und während sie vom Messaging-Anbieter gespeichert werden. Sie kontrolliert nicht, was nach der Zustellung der Nachricht geschieht.",
        "Sobald eine Nachricht auf dem Telefon des Empfängers entschlüsselt wurde, wird sie wieder zu gewöhnlicher Information. Der Empfänger kann sie unbegrenzt aufbewahren, an jemand anderen weiterleiten, ihren Inhalt in eine andere Anwendung kopieren oder einfach einen Screenshot machen. Je nach Messaging-Plattform können Unterhaltungen auch über mehrere Geräte synchronisiert oder in Cloud-Backups aufgenommen werden.",
        "Mit anderen Worten: Ende-zu-Ende-Verschlüsselung sichert die Zustellung — sie garantiert nicht, dass Informationen verschwinden, nachdem sie gelesen wurden.",
      ],
      callout:
        "Diese Unterscheidung wird zunehmend wichtig, wenn die geteilten Informationen besonders sensibel sind — Passwörter, Wiederherstellungscodes, API-Schlüssel und andere Zugangsdaten, die nicht ewig in einem durchsuchbaren Chatverlauf liegen sollten.",
    },
    {
      title: "Nicht jedes Geheimnis gehört in den Chatverlauf",
      paragraphs: [
        "Die meisten Unterhaltungen verdienen es, aufbewahrt zu werden. Nachrichten mit der Familie, Gespräche mit Freunden oder berufliche Unterhaltungen werden oft zu einem nützlichen Archiv, das man später gerne wieder aufruft.",
        "Sensible Zugangsdaten sind anders.",
        "Stellen Sie sich vor, Sie senden ein temporäres Administratorpasswort an einen Kollegen. Das Passwort reist dank Ende-zu-Ende-Verschlüsselung sicher durch das Internet, aber sechs Monate später liegt es möglicherweise immer noch in einem durchsuchbaren Gesprächsverlauf. Dasselbe gilt für API-Schlüssel, Wiederherstellungscodes, Krypto-Seed-Phrasen, vertrauliche Kundendaten oder temporäre Login-Zugangsdaten.",
        "Bei vielen realen Sicherheitsvorfällen ist nicht das Problem, dass das Geheimnis während der Übertragung abgefangen wurde. Das Problem ist, dass es lange nach dem Zeitpunkt, an dem es hätte vergessen werden sollen, irgendwo gespeichert blieb.",
        "Da Messaging zunehmend sicherer wird, verschiebt sich die Aufmerksamkeit allmählich zu einer anderen Herausforderung: der Reduzierung unnötiger Persistenz. Deshalb sollten manche [Geheimnisse niemals im Chat gesendet werden](blog:secrets-never-send-in-chat) — verschlüsselt oder nicht.",
      ],
    },
    {
      title: "Wann Einmal-Links mehr Sinn ergeben",
      paragraphs: [
        "Für Informationen, die nur einmal geteilt werden müssen, ist es nicht immer ideal, sie in einer dauerhaften Unterhaltung zu belassen.",
        "Eine zunehmend verbreitete Alternative ist es, sensible Informationen über [verschlüsselte Einmal-Links](blog:one-time-secret-links) zu teilen, die automatisch ablaufen oder nach dem Ansehen unzugänglich werden. Statt das Geheimnis direkt in eine laufende Unterhaltung einzubetten, öffnet der Empfänger einen dedizierten Link, ruft die Information ab, und der Link läuft irgendwann ab — oder ist in manchen Fällen nur einmal abrufbar.",
        "Dieser Ansatz ersetzt verschlüsseltes Messaging nicht. Er ergänzt es vielmehr, indem er ein anderes Problem angeht.",
        "Messaging-Anwendungen sind darauf ausgelegt, Unterhaltungen zu bewahren. Einmal-Links sind darauf ausgelegt, die langfristige Gefährdung von Informationen zu minimieren, die im Idealfall nicht dauerhaft gespeichert bleiben sollten.",
        "Ob Sie ein temporäres Passwort, ein API-Token, einen Software-Lizenzschlüssel oder einen anderen vertraulichen Wert teilen — die Existenzdauer dieser Information zu begrenzen kann das Risiko einer späteren versehentlichen Offenlegung erheblich verringern.",
      ],
    },
    {
      title: "Datenschutz ist mehr als Verschlüsselung",
      paragraphs: [
        "Die Einführung interoperabler Ende-zu-Ende-verschlüsselter RCS-Nachrichten ist wirklich gute Nachricht. Zum ersten Mal können Android- und iPhone-Nutzer denselben Schutz genießen, unabhängig davon, welches Ökosystem sie verwenden.",
        "Es ist auch eine Erinnerung daran, dass es bei Datenschutz um mehr geht als nur Verschlüsselung.",
        "Informationen zu schützen, während sie durch das Internet reisen, ist wichtig, aber ebenso wichtig ist es, darüber nachzudenken, was danach passiert. Manche Informationen verdienen es, jahrelang verfügbar zu bleiben. Andere Informationen — insbesondere Passwörter, Wiederherstellungscodes und temporäre Zugangsdaten — sind oft sicherer, wenn sie nur so lange existieren, wie unbedingt nötig.",
        "Moderne Messaging-Apps und Einmal-Geheimnis-Dienste erfüllen unterschiedliche Zwecke. Keiner ersetzt den anderen; sie behandeln stattdessen unterschiedliche Aspekte sicherer Kommunikation. Der richtige Ansatz hängt davon ab, was Sie teilen und wie lange es existieren muss.",
      ],
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ersetzt das SMS?",
          answer:
            "Nein. Herkömmliche SMS-Nachrichten bleiben unverschlüsselt. Der neue Schutz gilt nur für kompatible RCS-Unterhaltungen, wenn sowohl die Geräte als auch die Messaging-Anwendungen den neuesten Ende-zu-Ende-verschlüsselten RCS-Standard unterstützen.",
        },
        {
          question: "Können Google oder Apple verschlüsselte RCS-Nachrichten lesen?",
          answer:
            "Ende-zu-Ende-Verschlüsselung ist so konzipiert, dass nur die kommunizierenden Geräte die zur Entschlüsselung nötigen Schlüssel besitzen. Die Anbieter transportieren verschlüsselte Daten, können aber nicht auf den Klartextinhalt Ihrer Unterhaltungen zugreifen.",
        },
        {
          question: "Kann trotzdem noch jemand einen Screenshot machen?",
          answer:
            "Ja. Sobald eine Nachricht auf dem Gerät des Empfängers entschlüsselt wurde, kann dieser weiterhin Screenshots machen, den Inhalt kopieren oder ihn an andere weiterleiten. Ende-zu-Ende-Verschlüsselung schützt die Übertragung der Nachricht, nicht das, was der Empfänger anschließend damit macht.",
        },
        {
          question: "Sind Einmal-Links sicherer als Messaging-Apps?",
          answer:
            "Nicht unbedingt — sie lösen ein anderes Problem. Ende-zu-Ende-verschlüsseltes Messaging ist ausgezeichnet für laufende Unterhaltungen geeignet. [Einmalige oder ablaufende Links](blog:one-time-secret-links) sind oft besser geeignet, um sensible Informationen zu teilen, die nicht dauerhaft in einem Chatverlauf gespeichert bleiben sollten.",
        },
      ],
    },
  ],
  referencesTitle: "Weiterführende Informationen",
  references: [
    {
      label:
        "Android- und iPhone-Nutzer können jetzt Ende-zu-Ende-verschlüsseltes RCS-Messaging nutzen (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Teilen Sie Geheimnisse, die nicht im Chat leben sollten",
  ctaBody:
    "Wenn Sie jemandem ein Passwort, einen API-Schlüssel oder einen Wiederherstellungscode übergeben müssen, senden Sie stattdessen eine clientseitig verschlüsselte Einmal-Notiz, statt sie in Messages einzufügen. Legen Sie eine kurze Ablaufzeit oder Burn-after-Read fest, damit das Geheimnis nicht in einem durchsuchbaren Verlauf verbleibt.",
  ctaButton: "Private Notiz erstellen",
};
