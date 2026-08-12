import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeDe: BlogGuideArticleCopy = {
  heroAlt:
    "Laptop-Bildschirm mit einem sechsstelligen Verifizierungsschritt, bevor eine private Notiz angezeigt werden kann",
  heroCaption:
    "Der Link allein reicht nicht: Der Empfänger gibt einen einmaligen Code ein, den Sie über einen separaten Kanal teilen.",
  intro: [
    "Ein Private-Note-Link ist mächtig, weil er in der Regel das Material mitführt, das zum Entschlüsseln der Nachricht nötig ist. Genau diese Bequemlichkeit ist auch ein Risiko: Landet die vollständige URL im falschen Postfach, Chat-Thread oder Screenshot, kann das Geheimnis erreichbar sein, bevor Ihr vorgesehener Empfänger es öffnet.",
    "Empfänger-**Verifizierungscodes** fügen ein zweites Zustellgeheimnis hinzu, das Sie kontrollieren. Nach dem Erstellen der Notiz zeigt PrivateNote einen notizspezifischen sechsstelligen Code. Sie teilen diesen Code separat—per Telefon, Signal oder einem anderen Kanal—damit ein abgefangener Link nicht ausreicht, um den Anzeigeschritt zu erreichen.",
    "Das unterscheidet sich von optionaler Passphrase-Ummantelung des Ciphertexts und vom Anmelden. Es ist ein Zustell-Tor: **verifizieren, dann anzeigen**.",
  ],
  sections: [
    {
      title: "Nur Link vs. Link plus Code",
      takeaway:
        "Zustellung über getrennte Kanäle macht aus einer gestohlenen Nachricht ein unvollständiges Puzzle.",
      paragraphs: [
        "Bearer-Links sind beim sicheren Teilen üblich. Sie funktionieren gut, wenn der Kanal vertrauenswürdig und die Lebensdauer kurz ist. Sie funktionieren schlechter, wenn dasselbe E-Mail- oder Chat-Konto, das den Link empfängt, auch überwacht, geteilt oder kompromittiert sein könnte.",
        "Ein Verifizierungscode stellt die klassische Trennung wieder her: Link über Kanal A, Code über Kanal B. Ein Angreifer braucht beides. Dieses Muster passt natürlich zu [wie man ein Passwort sicher teilt](blog:how-to-share-a-password-securely) und [einmaligen Geheim-Links](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Kontrolle", "Was sie schützt", "Was sie nicht tut"],
        rows: [
          [
            "Verifizierungscode (Starter/Business)",
            "Blockiert die Anzeige, bis der Empfänger den Einmalcode eingibt",
            "Ersetzt weder Passphrase-Ummantelung noch Konto-Login",
          ],
          [
            "Passphrase auf der Notiz",
            "Ummantelt den Ciphertext, sodass die Entschlüsselung die Passphrase braucht",
            "Erfordert weiterhin sorgfältiges Out-of-Band-Teilen dieser Passphrase",
          ],
          [
            "Kurze Ablaufzeit + einmaliges Öffnen",
            "Begrenzt, wie lange ein durchgesickerter Link nützlich bleibt",
            "Stoppt niemanden, der Link und Code rechtzeitig bereits hat",
          ],
        ],
      },
    },
    {
      title: "So schalten Sie es ein",
      takeaway:
        "Unter Lieferung und Überprüfung aktivieren, dann Code und Link getrennt teilen.",
      paragraphs: [
        "Auf berechtigten Starter- und Business-Tarifen öffnen Sie beim Erstellen einer Notiz **Anpassen** und aktivieren **Verifizierungscode erforderlich** unter Lieferung und Überprüfung. Sie können es auch als Standard unter Konto → Einstellungen setzen, damit neue Notizen das Tor erben.",
        "Nach dem Erstellen zeigt der Erfolgsbildschirm den **Empfänger-Verifizierungscode**. Kopieren Sie den Notiz-Link wie gewohnt und senden Sie den Code über einen anderen Weg. Informieren Sie den Empfänger, dass vor **Notiz anzeigen** ein Verifizierungsschritt erscheint.",
      ],
      checklist: [
        "Starter oder Business nutzen (Funktion ist tarifgebunden)",
        "Verifizierungscode erforderlich für die Notiz aktivieren (oder als Kontostandard)",
        "Notiz erstellen und Link kopieren",
        "Sechsstelligen Code vom Erfolgsbildschirm kopieren",
        "Link und Code über getrennte Kanäle senden",
        "Bestätigen, dass der Empfänger vor dem Anzeigen verifiziert",
      ],
      midCta: {
        body: "Senden Sie etwas, bei dem das Postfach geteilt oder beobachtet sein könnte?",
        button: "Notiz mit Verifizierung erstellen",
      },
    },
    {
      title: "Was der Empfänger erlebt",
      takeaway: "Zuerst der Code, dann die gewohnte Click-to-Reveal-Warnung.",
      paragraphs: [
        "Beim Öffnen des Links erscheint ein Verifizierungsbildschirm—nicht der entschlüsselte Inhalt. Nach einem korrekten Code folgt das bekannte Anzeige-Tor: erst öffnen, wenn Sie bereit sind, denn das Anzeigen kann die Notiz gemäß Burn-Richtlinie verbrauchen.",
        "Falsche Codes scheitern geschlossen. Der Empfänger braucht kein Konto; nur den Code, den Sie geteilt haben. Zur bewussten Verzögerung vor der Entschlüsselung siehe [warum Notizen auf Click-to-Reveal warten](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Wann Verifizierungscodes sinnvoll sind",
      takeaway: "Nutzen Sie sie, wenn der Link-Kanal schwächer ist als das Geheimnis.",
      bullets: [
        "Zugangsdaten oder Dokumente an ein geteiltes Postfach per E-Mail",
        "Links in Team-Chats mit breiter Mitgliedschaft",
        "Übergaben mit hohem Screenshot- oder Weiterleitungsrisiko",
        "Jedes Geheimnis, das Sie auch mit getrennter Passphrase-Zustellung schützen würden",
      ],
      calloutTitle: "Praxistipp",
      callout:
        "Legen Sie den Verifizierungscode nicht in dieselbe E-Mail wie den Link. Das fasst beide Faktoren in einer abgefangenen Nachricht zusammen.",
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist der Verifizierungscode dasselbe wie ein Passwort auf der Notiz?",
          answer:
            "Nein. Der Verifizierungscode ist ein serverseitig geprüftes Tor vor dem Anzeigen. Eine Notiz-Passphrase (falls aktiviert) ummantelt den Ciphertext selbst und ist eine separate optionale Kontrolle.",
        },
        {
          question: "Kann ich meinen eigenen Code wählen?",
          answer:
            "PrivateNote erzeugt einen notizspezifischen sechsstelligen Code. Sie teilen diesen generierten Wert; Sie erfinden oder wiederverwenden keinen persönlichen PIN.",
        },
        {
          question: "Ist das im Free-Tarif verfügbar?",
          answer:
            "Empfängerverifizierung ist eine Starter- und Business-Funktion. Free-Konten können weiterhin kurze Ablaufzeiten, Öffnungslimits und optionale Passphrase-Ummantelung nutzen, wo angeboten.",
        },
        {
          question: "Bedeutet Verifizierung, dass PrivateNote meine Notiz lesen kann?",
          answer:
            "Nein. Die Verifizierung autorisiert den Zugang zum Anzeigeablauf. Nachrichteninhalte werden weiterhin im Browser verschlüsselt; Statusbenachrichtigungen enthalten nie Klartext.",
        },
      ],
    },
    {
      title: "Das Fazit",
      takeaway: "Machen Sie den Link ohne Ihren Out-of-Band-Code unvollständig.",
      paragraphs: [
        "Verifizierungscodes sind für Momente gedacht, in denen Bequemlichkeit sonst eine vollständig entschlüsselbare URL in einem einzigen Kanal hinterlassen würde.",
        "Aktivieren Sie das Tor, teilen Sie den Code separat und halten Sie die Lebensdauer der Notiz kurz—besonders bei [API-Schlüsseln](blog:how-to-share-api-key-securely), Passwörtern und Dokumenten.",
      ],
    },
  ],
  ctaTitle: "Fügen Sie der Übergabe einen separaten Verifizierungsschritt hinzu.",
  ctaBody:
    "Fordern Sie vor dem Anzeigen einen einmaligen Verifizierungscode an und senden Sie diesen Code über einen anderen Kanal als den Link.",
  ctaButton: "Verifizierte private Notiz erstellen",
};
