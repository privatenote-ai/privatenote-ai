import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesDe: BlogGuideArticleCopy = {
  heroAlt:
    "Empfängeransicht eines PrivateNote-Anzeigebildschirms mit klarer Warnung „Öffnen, wenn bereit“ vor der Entschlüsselung",
  heroCaption:
    "Anzeigen ist absichtlich: Der Empfänger entscheidet, wann entschlüsselt wird—und wann die Burn-Richtlinie greifen kann.",
  intro: [
    "Das Öffnen einer einmaligen Notiz sollte bewusst geschehen. PrivateNote zeigt daher eine **Klick-zum-Anzeigen**-Sperre mit einer ausdrücklichen Warnung, bevor die Entschlüsselung beginnt.",
    "Der Link kann früh ankommen. Der Chiffretext kann verschlüsselt liegen bleiben, bis jemand bereit ist. Entschlüsseln und Verbrauchen finden erst statt, nachdem der Empfänger **Notiz anzeigen** bestätigt—mit Text, der die Konsequenz klar macht: nur öffnen, wenn bereit—das lässt sich nicht rückgängig machen.",
    "Diese Pause ist Absicht. Sie reduziert versehentliches Anzeigen durch Link-Vorschauen, Fehlklicks oder das Öffnen auf dem falschen Gerät, bevor Sie bereit sind, eine einmalige Notiz zu verbrauchen.",
  ],
  sections: [
    {
      title: "Ein Bestätigungsschritt, keine zeitgesteuerte Freigabe",
      takeaway:
        "Der Empfänger entscheidet, wann angezeigt wird; der Server entsperrt die Notiz nicht nach Kalender.",
      paragraphs: [
        "Es gibt heute keinen Schalter „Notiz nächsten Dienstag um 09:00 freigeben“ im Produkt. Stattdessen trennt PrivateNote **Zustellung** von **Öffnen**.",
        "Sie können den Link senden, wann die Abstimmung es erfordert. Der Empfänger kann warten, bis er an einem privaten Bildschirm sitzt, einen etwaigen Verifizierungscode oder eine Passphrase bereithält und für eine einmalige Öffnung bereit ist. Das Geheimnis bleibt versiegelt, bis zu dieser bewussten Handlung.",
        "Verwandte Zeitsteuerungen bleiben wichtig: Notiz-Lebensdauer (wie lange der Link funktioniert, wenn nie geöffnet) und Download-Fenster für Anhänge (wie lange Dateien nach dem Öffnen abrufbar bleiben). Die begrenzen die Verfügbarkeit; Klick-zum-Anzeigen begrenzt, *wann die Entschlüsselung beginnt*.",
      ],
    },
    {
      title: "Warum versehentliches Öffnen teuer ist",
      takeaway: "Einmalige Notizen bestrafen Neugier und Fehlklicks gleichermaßen.",
      paragraphs: [
        "Ist eine Notiz für eine einzige Ansicht konfiguriert, kann die erste erfolgreiche Anzeige weiteren Zugriff zerstören. Öffnen auf einem Telefon-Sperrbildschirm, einem geteilten Laptop oder in einem Café mit öffentlichem WLAN kann die einzige Ansicht verschwenden—oder Inhalt am falschen Ort preisgeben.",
        "Der Anzeigebildschirm erzwingt eine Pause. Zusammen mit [Empfänger-Verifizierungscodes](blog:recipient-verification-code-before-reveal) erhalten Sie zwei bewusste Schritte, bevor Klartext erscheint.",
      ],
      calloutTitle: "Produkttext, mit Absicht",
      callout:
        "„Öffnen Sie sie nur, wenn Sie bereit sind — dies kann nicht rückgängig gemacht werden.“ ist kein Marketing-Geschwätz. Es ist die Sicherheitsreling für Burn-on-Open-Workflows.",
    },
    {
      title: "So funktioniert der Empfängerablauf",
      takeaway: "Link öffnen → optional prüfen → anzeigen → lokal entschlüsseln.",
      checklist: [
        "Die vollständige PrivateNote-URL öffnen",
        "Einen Verifizierungscode eingeben, falls der Absender einen verlangt hat",
        "Die Anzeigewarnung lesen",
        "Nur bei Bereitschaft auf Notiz anzeigen tippen",
        "Entschlüsselung erfolgt im Browser; danach ggf. Open/Burn-Richtlinie beachten",
      ],
      paragraphsAfterChecklist: [
        "Absender können die Pause mit einer klaren Anweisung verstärken: „Ich sende den Link jetzt; bitte erst anzeigen, wenn wir im Call sind.“ Der Bestätigungsbildschirm unterstützt diese Anweisung, plant oder erzwingt aber technisch keinen späteren Öffnungszeitpunkt.",
        "Zum breiteren Einmal-Modell siehe [einmalige Geheimnis-Links](blog:one-time-secret-links) und [so erstellen Sie eine private Notiz](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Senden Sie eine Notiz, die der Empfänger halten kann, bis er bereit ist, sie zu öffnen.",
        button: "Private Notiz erstellen",
      },
    },
    {
      title: "Zeitsteuerungen, die zum Anzeigen passen",
      takeaway:
        "Lebensdauer, Öffnungslimits und Dateifenster ergänzen die Klick-Sperre.",
      comparisonTable: {
        headers: ["Steuerung", "Schützt vor", "Typische Nutzung"],
        rows: [
          [
            "Klick-zum-Anzeigen",
            "Versehentliches oder vorzeitiges Entschlüsseln",
            "Jede einmalige oder hochsensible Notiz",
          ],
          [
            "Notiz-Lebensdauer",
            "Veraltete, ungeöffnete Links",
            "„Wenn sie innerhalb von 24 Std. nicht öffnen, löschen“",
          ],
          [
            "Öffnungs-/Ansichtslimit",
            "Wiederholten Zugriff nach der Übergabe",
            "Einmal (oder eine kleine feste Anzahl)",
          ],
          [
            "Download-Fenster für Anhänge",
            "Endlose Datei-Neu-Downloads nach dem Öffnen",
            "15 Minuten Standard; länger auf berechtigten Plänen",
          ],
        ],
      },
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ich eine Notiz für einen späteren Zeitpunkt freigeben lassen?",
          answer:
            "Nicht als serverseitigen Zeitplan. Teilen Sie den Link bei Bedarf früh und bitten Sie den Empfänger zu warten—Klick-zum-Anzeigen plus optionale Verifizierung hält den Inhalt versiegelt, bis er bestätigt.",
        },
        {
          question: "Entschlüsselt die Link-Vorschau die Notiz?",
          answer:
            "Die Anzeigebestätigung ist der bewusste Entschlüsselungsschritt. Empfänger sollten nicht auf Anzeigen tippen, bevor sie bereit sind, dass die Burn-Richtlinie greift.",
        },
        {
          question: "Was, wenn jemand den Link versehentlich öffnet?",
          answer:
            "Wenn sie vor dem Anzeigen stoppen, können sie später noch zurückkehren (abhängig von der Lebensdauer). Nach dem Anzeigen einer einmaligen Notiz ist weiterer Zugriff typischerweise weg—senden Sie bei Bedarf eine neue Notiz.",
        },
        {
          question: "Wie hängt das mit E-Mail-Benachrichtigungen zusammen?",
          answer:
            "Öffnungs- und Zerstörungsalarme informieren den Absender über Statusänderungen. Sie enthalten keinen Nachrichteninhalt. Siehe [so erfahren Sie, wann ein Geheimnis-Link geöffnet wurde](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Das Fazit",
      takeaway:
        "Anzeigen ist eine bewusste Handlung, nicht die automatische Folge des Ladens eines Links.",
      paragraphs: [
        "Klick-zum-Anzeigen lässt Sie einen Link früh senden, ohne die Notiz allein deshalb zu entschlüsseln, weil die Landingpage geladen hat.",
        "Kombinieren Sie es mit kurzen Lebensdauern, Verifizierung bei schwachen Kanälen und klaren Anweisungen an den Empfänger—und Sie erhalten praktische verzögerte Anzeige, ohne vorzutäuschen, das Produkt könne einen Screenshot remote löschen.",
      ],
    },
  ],
  ctaTitle: "Lassen Sie den Empfänger erst anzeigen, wenn er bereit ist.",
  ctaBody:
    "PrivateNote hält den Chiffretext versiegelt, bis der Empfänger das Anzeigen bestätigt—so verbrennen einmalige Notizen seltener durch einen versehentlichen Tipp.",
  ctaButton: "Notiz mit Klick-zum-Anzeigen erstellen",
};
