import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideDe: PrivacyToolsGuideArticleCopy = {
  intro: [
    "Die meisten Seiten zu den „besten Privacy-Tools“ sind Affiliate-Kataloge im Trenchcoat. Sie ranken jede Kategorie, verstecken die Abwägungen und hinterlassen Sie mit zwanzig Tabs und ohne System.",
    "Dieser Leitfaden ist anders. Er ist ein **Entscheidungsrahmen für 2026**, um einen Privacy-Stack zusammenzustellen, der zum echten Leben passt: welche Aufgabe Sie erledigen müssen, welche Voreinstellung Sie wählen, wann Sie upgraden—und wann ein Tool schlicht die falsche Form hat.",
    "PrivateNote.ai besetzt einen engen Slot—**Einmal-Übergaben von Geheimnissen**. Alles andere unten ist kuratierte Meinung, damit Sie diese Seite mit einem kohärenten Stack verlassen und danach unser [Privacy-Tools-Verzeichnis](app:privacy-tools) für den vollständigen Katalog durchstöbern können.",
  ],
  sections: [
    {
      title: "Beginnen Sie mit einem Bedrohungsmodell (nicht mit einer Einkaufsliste)",
      paragraphs: [
        "Privacy-Tools helfen nur, wenn sie zu dem passen, wogegen Sie sich schützen. Ein Freelancer, der WLAN-Zugangsdaten teilt, hat ein anderes Problem als eine Journalistin unter gezielter Überwachung. Wählen Sie den leichtesten Stack, der *Ihre* Risiken abdeckt—und hören Sie auf, Tools aus Sport zu sammeln.",
      ],
      subsections: [
        {
          title: "Alltäglicher Privatgebrauch",
          paragraphs: [
            "Sie wollen weniger Tracking, weniger Desaster durch Passwort-Wiederverwendung und Geheimnisse, die nicht im Chat hängen bleiben. Sie versuchen nicht, vor Nationalstaaten zu verschwinden. Konzentrieren Sie sich auf einen Passwort-Manager, vernünftige Browser-Defaults, verschlüsselte Messaging für sensible Chats und ephemere Links für einmalige Zugangsdaten.",
          ],
        },
        {
          title: "Freelancer oder Berater",
          paragraphs: [
            "Sie übergeben Geheimnisse an Kunden, die Ihre Apps nicht teilen. E-Mail und Slack werden zu dauerhaften Archiven von API-Keys und temporären Passwörtern. Ergänzen Sie einmalige verschlüsselte Notizen und verschlüsselten Dateitransfer; halten Sie langlebige Zugangsdaten in einem Vault, nicht in Threads.",
          ],
        },
        {
          title: "Kleines Team",
          paragraphs: [
            "Sie brauchen geteilten Zugang, der widerrufen werden kann, klare Regeln für Auftragnehmer und weniger Abhängigkeit von „schick es einfach in den Channel“. Bevorzugen Sie Passwort-Manager-Sharing für laufenden Zugang, Einmal-Links für temporäre Übergaben und schriftliche Normen, damit Bequemlichkeit nicht stillschweigend zur Richtlinie wird.",
          ],
        },
      ],
      calloutTitle: "Faustregel",
      callout:
        "Wenn ein Tool nicht zu einer Aufgabe passt, die Sie tatsächlich wöchentlich erledigen, lassen Sie es weg. Ein minimaler Stack, den Sie nutzen, schlägt einen puristischen Stack, den Sie aufgeben.",
    },
    {
      title: "Privacy-Jobs, keine Produktkategorien",
      paragraphs: [
        "Kategorien (VPN, Browser, Messenger) verleiten dazu, Logos zu sammeln. Jobs zwingen Abwägungen ans Licht. Nutzen Sie diese Karte zur Orientierung; die Abschnitte darunter gehen tiefer.",
      ],
      comparisonTable: {
        headers: ["Job", "Standardansatz", "Falsches Tool für den Job"],
        rows: [
          [
            "Langlebige Passwörter verwahren",
            "Passwort-Manager + starker Generator",
            "Nur browsergespeicherte Passwörter oder Chat-Archive",
          ],
          [
            "Jemandem ein Einmal-Geheimnis übergeben",
            "Browser-verschlüsselte, ablaufende Notiz",
            "E-Mail, Slack, SMS oder ein Cloud-Ordner „nur fürs Erste“",
          ],
          [
            "Alltäglicher privater Chat",
            "Ende-zu-Ende-verschlüsselter Messenger",
            "SMS oder „verschwindende“ Nachrichten in Apps, die trotzdem Metadaten ewig archivieren",
          ],
          [
            "Browser-Tracker reduzieren",
            "Gehärteter Mainstream-Browser + Blocker",
            "Fünf widersprüchliche Privacy-Erweiterungen installieren",
          ],
          [
            "Unvertraute Netzwerke",
            "Seriöses No-Logs-VPN mit Track Record",
            "Annehmen, ein VPN mache Sie anonym",
          ],
          [
            "Hygiene gegen Account-Übernahme",
            "Breach-Check + 2FA / Passkeys",
            "Passwörter wiederverwenden und hoffen",
          ],
        ],
        after: [
          "Für Produktnamen, Preisnotizen und Ausschlüsse halten Sie das [Privacy-Tools-Verzeichnis](app:privacy-tools) neben diesem Leitfaden offen.",
        ],
      },
    },
    {
      title: "Job: langlebige Passwörter",
      paragraphs: [
        "Passwörter, die Sie monatelang wiederverwenden, gehören in einen Vault—nicht in Ihr Gehirn, nicht in eine Notiz-App und nicht in den Teams-Thread von gestern.",
      ],
      subsections: [
        {
          title: "Das Problem",
          paragraphs: [
            "Wiederverwendung macht aus einem Breach viele. Schwache, merkbare Passwörter scheitern bei Offline-Cracking. Browser-Passwortspeicher helfen, erreichen aber selten dedizierte Manager bei Sync, Sharing und Auditierbarkeit.",
          ],
        },
        {
          title: "Default + Alternative",
          paragraphs: [
            "**Default:** [Bitwarden](https://bitwarden.com/) für die meisten—Open Source, nutzbarer Free-Tier, solider Sync. **Alternative:** [KeePassXC](https://keepassxc.org/), wenn Sie einen lokalen Vault ohne Cloud wollen. **Wenn Politur wichtiger ist als Open Source:** [1Password](https://1password.com/) ist eine faire Wahl; wissen Sie, dass Sie proprietäre Bequemlichkeit wählen.",
          ],
        },
        {
          title: "Wann Sie nicht allein auf einen Manager setzen sollten",
          paragraphs: [
            "Manager glänzen bei *Speicherung* und laufendem geteilten Zugang. Sie sind unbeholfen, wenn der Empfänger kein Konto hat oder das Geheimnis nach einmaligem Lesen sterben soll. Das ist ein anderer Job—siehe Einmal-Geheimnisse unten. Generieren Sie starke Werte mit einem lokalen [Passwort-Generator](app:password-generator), bevor Sie sie speichern oder teilen.",
          ],
        },
      ],
    },
    {
      title: "Job: Einmal-Geheimnisse",
      paragraphs: [
        "Passwörter für Auftragnehmer, Recovery-Codes, API-Keys, WLAN für einen Besucher—alles, was nicht durchsuchbare Historie werden sollte.",
      ],
      subsections: [
        {
          title: "Das Problem",
          paragraphs: [
            "E-Mail und Chat verschlüsseln unterwegs und archivieren danach für immer. Cloud-Ordner bleiben liegen. Screenshots und Geräte-Backups vergrößern den Radius. Der Fehlermodus ist nicht „jemand snifft die Leitung“—sondern „das Geheimnis ist in sechs Monaten immer noch da.“",
          ],
        },
        {
          title: "Default",
          paragraphs: [
            "**Default:** eine browser-verschlüsselte, ablaufende Notiz wie [PrivateNote.ai](app:home)—Ciphertext auf dem Server, Entschlüsselungsmaterial im Link-Fragment, Burn-after-Reading oder kurze TTL. Zum Modell siehe [wie PrivateNote funktioniert](app:how-it-works) und [warum E-Mail der schlechteste Ort für Geheimnisse ist](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Wann Sie es nicht nutzen sollten",
          paragraphs: [
            "Ersetzen Sie weder Ihren Passwort-Manager noch Ihren Alltags-Messenger durch Einmal-Notizen. Legen Sie keine langlebigen Dokumente oder laufenden Gespräche in ephemere Links. Und senden Sie bei hohen Einsätzen Link und optionale Passphrase nicht im selben Kanal—teilen Sie die Kanäle.",
          ],
        },
      ],
      midCta: {
        body: "Müssen Sie jetzt ein Passwort oder einen API-Key übergeben? Verschlüsseln Sie ihn im Browser und senden Sie einen Link, der nach dem Lesen ablaufen kann.",
        button: "Private Notiz erstellen",
        href: "app:home",
      },
    },
    {
      title: "Job: alltägliches Messaging",
      paragraphs: [
        "Sensible Gespräche brauchen Ende-zu-Ende-Verschlüsselung by Default—nicht einen Toggle, der in den Einstellungen vergraben ist, und nicht das Versprechen, dass „verschwindende Nachrichten“ serverseitige Kopien löschen, die Sie nicht verifizieren können.",
      ],
      subsections: [
        {
          title: "Default + Abwägung",
          paragraphs: [
            "**Default:** [Signal](https://signal.org/) für Mainstream-sicheren Chat. **Abwägung klar benennen:** Die Registrierung erfordert eine Telefonnummer, die manche Hochanonymitäts-Bedrohungsmodelle ablehnen. Für solche Fälle schauen Sie über diesen Starter-Guide hinaus—und behandeln Sie Metadaten (wer mit wem spricht) auf jedem Messenger als Restrisiko.",
          ],
        },
        {
          title: "Wann Chat nicht für Geheimnisse taugt",
          paragraphs: [
            "Selbst verschlüsselte Messenger behalten Verlauf auf Geräten. Fügen Sie ein Produktionspasswort in einen Thread ein, und Sie haben eine dauerhafte Kopie erzeugt. Nutzen Sie Chat für Gespräch; nutzen Sie Einmal-Notizen für Zugangsdaten. Mehr zu diesem Muster: [Geheimnisse, die Sie nie im Chat senden sollten](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Job: E-Mail und Identitäts-Trennung",
      paragraphs: [
        "E-Mail ist ein öffentliches Adressierungssystem mit privaten Hoffnungen. Behandeln Sie Postfach-Verschlüsselung und Aliasing als Schadensbegrenzung, nicht als magische Unsichtbarkeit.",
      ],
      subsections: [
        {
          title: "Defaults",
          paragraphs: [
            "**Verschlüsseltes Postfach-Default:** [Proton Mail](https://proton.me/) oder [Tuta](https://tuta.com/), wenn Sie Zero-Access-Mail für sensible Korrespondenz wollen. **Aliasing-Default:** [Firefox Relay](https://relay.firefox.com/) für leichtes Maskieren, oder [SimpleLogin](https://simplelogin.io/), wenn Sie Custom Domains und schärfere Identitäts-Trennung brauchen.",
          ],
        },
        {
          title: "Wann Sie sich nicht auf E-Mail verlassen sollten",
          paragraphs: [
            "Verschlüsselte E-Mail hinterlässt trotzdem Header, Weiterleitungsgewohnheiten und lange Aufbewahrung. Legen Sie niemals aktive Zugangsdaten „nur diesmal“ in den Body. Ist die Nutzlast eine Geheimnis-Übergabe, nutzen Sie eine Einmal-Notiz und schreiben Sie nur Kontext in die E-Mail.",
          ],
        },
      ],
    },
    {
      title: "Job: mit weniger Tracking browsen",
      paragraphs: [
        "2026 geht es weniger um „geheimen Modus“ und mehr um Fingerprinting, Cross-Site-Tracking und Erweiterungen, die Privacy versprechen und gleichzeitig Angriffsfläche hinzufügen.",
      ],
      subsections: [
        {
          title: "Default-Stack",
          paragraphs: [
            "**Default:** [Firefox](https://www.mozilla.org/) mit strengem Tracking-Schutz plus [uBlock Origin](https://ublockorigin.com/). **Chromium-förmige Alternative:** [Brave](https://brave.com/), wenn Sie Extension-Kompatibilität brauchen—wissen Sie, dass die Community bei seiner Rewards-/Crypto-Oberfläche gespalten ist. **Suche:** [DuckDuckGo](https://duckduckgo.com/) (oder ähnlich nicht-profilierende Suche), damit Ihre Queries kein Ad-Profil-Feed werden.",
          ],
        },
        {
          title: "Wann Tor das richtige Upgrade ist",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) ist der Standard für stärkere Anonymität und Zensurresistenz. Er ist auch langsamer und CAPTCHA-lastig. Nutzen Sie ihn, wenn das Bedrohungsmodell es verlangt—nicht als Alltags-Banking-Browser.",
          ],
        },
      ],
    },
    {
      title: "Job: unvertraute Netzwerke (VPN-Realitätscheck)",
      paragraphs: [
        "Ein VPN verschlüsselt den Pfad zwischen Ihnen und dem VPN-Anbieter. Es verbirgt Ihre IP vor den Sites, die Sie besuchen. Es macht Sie **nicht** anonym, verschlüsselt nicht die Logs des Ziels und repariert kein schwaches Passwort.",
      ],
      subsections: [
        {
          title: "Defaults, die wir benennen wollen",
          paragraphs: [
            "Bevorzugen Sie Anbieter mit öffentlichem Track Record, klarer Jurisdiktions-Story und geprüften No-Logs-Claims—häufig [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) oder [IVPN](https://www.ivpn.net/). Zahlen Sie für das Produkt; Free-VPN-Geschäftsmodelle sind oft selbst das Produkt.",
          ],
        },
        {
          title: "Wann Sie sich den Aufwand sparen können",
          paragraphs: [
            "In einem Netzwerk, dem Sie bereits vertrauen, mit HTTPS überall, ist ein VPN optionale Hygiene—keine moralische Pflicht. Meiden Sie skurrile „military-grade“-Marken und alles, was mit Influencer-Codes statt Engineering-Detail führt. Die Ausschluss-Notizen unseres Verzeichnisses decken gängige „privacy-washed“-Picks ab.",
          ],
        },
      ],
    },
    {
      title: "Job: Breaches, 2FA und Passkeys",
      paragraphs: [
        "Account-Hygiene ist die unglamouröse Hälfte von Privacy. Die meisten persönlichen Desaster sind Credential Stuffing und SIM-Swap-nahe Ausfälle, nicht exotische Malware.",
      ],
      subsections: [
        {
          title: "Praktische Defaults",
          paragraphs: [
            "Prüfen Sie Adressen auf [Have I Been Pwned](https://haveibeenpwned.com/). Schalten Sie phishing-resistente Faktoren ein, wo Sie können—Passkeys oder Hardware-Keys wie [YubiKey](https://www.yubico.com/) schlagen SMS-OTP. Nutzen Sie das [2FA Directory](https://2fa.directory/), um zu sehen, welche Dienste Zweitfaktoren noch als optionales Theater behandeln.",
          ],
        },
        {
          title: "2026-Hinweis zu Passwordless",
          paragraphs: [
            "Passkeys reduzieren Phishing und Passwort-Wiederverwendung, aber Recovery und Cross-Ecosystem-Lock-in sind real. Halten Sie eine Recovery-Story (Hardware-Key, dokumentierter Prozess) bereit, bevor Sie jedes Passwort löschen. Passwort-Manager bleiben nützlich für den Long Tail von Sites, die noch nicht nachgezogen haben.",
          ],
        },
      ],
    },
    {
      title: "Was sich 2026 geändert hat (Kommentar, der bleiben darf)",
      bullets: [
        "**AI-Chat ist ein neues Archiv.** Geheimnisse in Assistenten einzufügen erzeugt Retention- und Trainingsrisiko-Fragen, die Ihr Bedrohungsmodell von 2019 nie enthielt. Behandeln Sie Prompts wie E-Mail-Bodies.",
        "**Fingerprinting hat Cookie-Banner überholt.** Third-Party-Cookies zu blocken hilft; Browserwahl, Tracker-Blocking und weniger Extensions zählen immer noch mehr als jedes „legitimate interest“-Toggle zu akzeptieren.",
        "**Passkeys werden Mainstream.** Bevorzugen Sie sie auf hochwertigen Accounts; tun Sie nicht so, als unterstütze sie schon jede Site.",
        "**VPN-Marketing wurde lauter, nicht klüger.** Jurisdiktions-Theater und Affiliate-Leaderboards sind keine Audits. Wählen Sie langweilige, dokumentierte Anbieter—oder keinen.",
        "**Ephemeres Teilen ist noch Nische—und trotzdem nötig.** Kollaborations-Apps, die für Suche optimiert sind, machen Einmal-Geheimnis-Tools wertvoller, nicht weniger.",
      ],
    },
    {
      title: "Minimales Starter-Kit (für die meisten)",
      paragraphs: [
        "Wenn Sie nur sieben Dinge tun: diese. Alles andere ist optionale Tiefe.",
      ],
      useCaseTable: {
        headers: ["Slot", "Wahl"],
        rows: [
          ["Passwort-Vault", "Bitwarden (oder KeePassXC, wenn Sie Cloud ablehnen)"],
          ["Passwort-Erstellung", "Lokaler Generator—dann im Vault speichern"],
          ["Einmal-Geheimnisse", "PrivateNote.ai (oder gleichwertige browser-verschlüsselte Notiz)"],
          ["Privater Chat", "Signal"],
          ["Browser + Blocker", "Firefox + uBlock Origin"],
          ["Breach- / 2FA-Hygiene", "Have I Been Pwned + Passkeys oder App-/Hardware-2FA"],
          ["Reisen / Café-WLAN", "Mullvad, Proton VPN oder IVPN—wenn das Netzwerk das Risiko ist"],
        ],
      },
      callout:
        "Fortgeschrittene Add-ons (Tor als Alltag, Full-Disk-Ritualismus, anonyme E-Mail-Netze) sind gültig—aber erst, wenn das Starter-Kit zur Gewohnheit geworden ist.",
    },
    {
      title: "Was wir ausschließen—und warum",
      paragraphs: [
        "Kuratieren heißt vor allem Nein sagen. Ein paar Muster, die wir nicht weichspülen:",
      ],
      subsections: [
        {
          title: "Privacy-Theater-VPNs",
          paragraphs: [
            "Free-Tiers finanziert durch vage Datenpraktiken, gefälschte „Audit“-Badges und Leaderboard-SEO. Wenn der Pitch Angst plus Rabattcode ist, gehen Sie weg.",
          ],
        },
        {
          title: "Messenger, die Verschlüsselung selektiv vermarkten",
          paragraphs: [
            "Cloud by Default, optionales E2EE oder „Secret Chat“-Modi, die Nutzer trainieren, Geheimnisse in den unsicheren Default zu pasten. Wir empfehlen lieber einen ehrlichen Default als fünf Modi, die Leute falsch nutzen. Telegram-artige Clouds und WhatsApps Metadaten-/Backup-Realitäten werden in unseren [Verzeichnis-Ausschlüssen](app:privacy-tools) benannt.",
          ],
        },
        {
          title: "Alles, was unsere Empfehlung kaufen müsste",
          paragraphs: [
            "Dieser Leitfaden und das Verzeichnis sind keine Affiliate-Liste. Wir verdienen nichts, wenn Sie durchklicken. Das macht uns nicht allwissend—es bedeutet, dass Anreize die Shortlist nicht still lenken.",
          ],
        },
      ],
    },
    {
      title: "Wohin als Nächstes",
      paragraphs: [
        "Nutzen Sie diesen Artikel als Entscheidungsebene. Nutzen Sie das Verzeichnis als lebendigen Katalog—Kategorien, Nuancen und Links, die wir geprüft halten.",
      ],
      bullets: [
        "[Privacy-Tools-Verzeichnis](app:privacy-tools) — kuratierter Katalog nach Kategorie",
        "[Wie man ein Passwort sicher teilt](blog:how-to-share-a-password-securely) — Übergabe-Playbook",
        "[Ein Geheimnis ohne Konto senden](blog:send-secret-message-without-account) — keine gemeinsame App nötig",
        "[Sicherheitsressourcen](app:security-resources) — weiterführende Lektüre auf PrivateNote.ai",
        "[EFF Privacy Issues](https://www.eff.org/issues/privacy) — Politik- und Rechtekontext",
        "[Privacy Guides](https://www.privacyguides.org/) — tiefere, community-gepflegte Empfehlungen",
      ],
      midCta: {
        body: "Bereit, die volle Shortlist mit Kategorie-Notizen und Ausschlüssen zu browsen?",
        button: "Privacy-Tools-Verzeichnis öffnen",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist das dasselbe wie Ihr Privacy-Tools-Verzeichnis?",
          answer:
            "Nein. Dieser Beitrag ist der How-to-Choose-Leitfaden 2026. Das [Verzeichnis](app:privacy-tools) ist der kuratierte Katalog. Lesen Sie den Leitfaden zum Entscheiden; nutzen Sie das Verzeichnis, um konkrete Tools zu wählen.",
        },
        {
          question: "Kann ich jede Privacy-Kategorie nach Rankings jagen?",
          answer:
            "Können Sie—aber Sie bleiben nicht dabei. Ein Sieben-Slot-Starter-Kit, das Sie wirklich nutzen, schlägt einen Dreißig-Tool-Schrein, den Sie einmal konfigurieren.",
        },
        {
          question: "Wo passt PrivateNote.ai hinein?",
          answer:
            "Nur beim Job Einmal-Geheimnisse—Zugangsdaten und Anweisungen, die ablaufen sollen. Es ist kein Passwort-Manager, Messenger oder VPN.",
        },
        {
          question: "Brauche ich jeden Tag ein VPN?",
          answer:
            "Meist nein. Nutzen Sie eines in unvertrauten Netzwerken oder wenn Sie Ihre IP speziell vor einem Ziel verbergen müssen. Es ersetzt weder HTTPS noch gute Passwörter noch verschlüsselte Messenger.",
        },
        {
          question: "Open Source oder poliertes Proprietäres?",
          answer:
            "Bevorzugen Sie Open Source, wenn das Risiko hoch ist und Sie mit der UX leben können. Proprietäre Tools können rational sein, wenn Usability entscheidet, ob Ihre Familie überhaupt einen Vault übernimmt—benennen Sie die Abwägung explizit, wie wir es bei 1Password tun.",
        },
      ],
    },
  ],
  ctaTitle: "Bauen Sie den Stack—und teilen Sie Geheimnisse richtig",
  ctaBody:
    "Wenn der Job eine temporäre Übergabe ist, überspringen Sie das Chat-Archiv. Erstellen Sie eine browser-verschlüsselte Notiz, senden Sie den Link und lassen Sie ihn ablaufen, wenn der Moment vorbei ist.",
  ctaButton: "Private Notiz erstellen",
  ctaSecondaryLabel: "Privacy-Tools-Verzeichnis durchstöbern",
  ctaSecondaryHref: "app:privacy-tools",
};
