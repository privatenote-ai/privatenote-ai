import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseDe: CryptoSeedArticleCopy = {
  heroAlt:
    "Konzept für verschlüsseltes Dateiteilen: lokale Verschlüsselung vor dem Hochladen von Geheimnissen",
  intro: [
    "Eine Kryptowährungs-Seed-Phrase ist eines der wertvollsten Geheimnisse, die Sie je besitzen werden. Sie lässt sich meist nicht zurücksetzen. Es gibt kein „Passwort vergessen“. Wer sie hat, kontrolliert typischerweise die Wallet und alles darin.",
    "Das klingt vielleicht seltsam im Blog eines Unternehmens, das verschlüsselte Einmal-Links baut. Sicherheit bedeutet nicht, jedes Werkzeug für jede Aufgabe zu verkaufen—sondern den Ansatz an das anzupassen, was Sie schützen, einschließlich unserer eigenen Grenzen.",
    "Für **ersetzbare Geheimnisse**—WLAN-Passwörter, temporäre Zugangsdaten, MFA-Wiederherstellungscodes, viele API-Schlüssel und vertrauliche Geschäftsnachrichten—ist ein [verschlüsselter Einmal-Link](blog:one-time-secret-links) eine hervorragende Lösung.",
    "**Lang lebende Master-Geheimnisse** wie Kryptowährungs-Seed-Phrasen verdienen einen anderen Ansatz.",
  ],
  ruleTitle: "Regel Nr. 1",
  ruleParagraphs: [
    "**Geben Sie eine Kryptowährungs-Seed-Phrase niemals auf einer Website ein—auch nicht bei PrivateNote.** Wenn Übertragung unvermeidlich ist: zuerst lokal verschlüsseln und **nur den Chiffretext** teilen. PrivateNote ist zum Transport vorverschlüsselter Daten gedacht, nicht zum Eintippen der Mnemonic.",
    "**Seriöse Hardware-Wallet-Hersteller verlangen nicht, Ihre Wiederherstellungsphrase auf einer Website einzugeben.** Fordert eine Seite Ihre Seed-Phrase an, behandeln Sie das als höchst verdächtig—prüfen Sie die Echtheit, bevor Sie fortfahren.",
    "Vermeiden Sie nach Möglichkeit, Seed-Phrasen auf Websites einzugeben.",
  ],
  offlineAlternatives: [
    { label: "Metall-Backup", body: "im Tresor oder Schließfach aufbewahrt" },
    { label: "SLIP-39", body: "oder ähnliche Verfahren für Erbschaft oder Disaster Recovery" },
    { label: "Hardware-Wallet-Übertragung", body: "wenn praktikabel, statt der Wiederherstellungsphrase" },
  ],
  seedPhraseTraits: [
    { label: "Gewährt volle Kontrolle", body: "über Vermögenswerte" },
    { label: "Hält oft Jahrzehnte", body: "ohne Rotation" },
    { label: "Kann nicht geändert werden", body: "bei Kompromittierung" },
    { label: "Kein Anbieter-Recovery", body: "bei Diebstahl" },
  ],
  oneTimeLinkFit: [
    "API-Schlüssel & temporäre Passwörter",
    "WLAN-Zugangsdaten",
    "MFA-Wiederherstellungscodes",
    "Geschäftsnachrichten & Rechtsentwürfe",
    "Temporäre Zugriffstokens",
  ],
  localEncryptFirst: [
    "Kryptowährungs-Seed-Phrasen",
    "Hardware-Wallet-Backups",
    "CA-Privatschlüssel & Signierschlüssel",
    "Passwortmanager-Wiederherstellungsmaterial",
    "Hochwertige Master-Geheimnisse",
  ],
  philosophySteps: [
    "Übertragung vermeiden, wenn möglich",
    "lokal verschlüsseln",
    "nur Chiffretext hochladen",
    "temporären Klartext sicher löschen",
    "die age-Datei-Passphrase—nicht die Mnemonic—wenn möglich über einen separaten Kanal senden",
  ],
  sections: {
    sendAtAll: {
      title: "Müssen Sie sie überhaupt senden?",
      question: "**muss die Phrase ihren Ort verlassen?** Oft: nein.",
      outro:
        "Jede Übertragung erhöht die Chance einer Offenlegung. Wenn Sie senden vermeiden können, tun Sie es. Für andere Kanäle, die Geheimnisse ebenfalls dauerhaft speichern, siehe [Warum E-Mail der schlechteste Ort für Geheimnisse ist](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Warum Seed-Phrasen anders sind",
      p1: "Eine Seed-Phrase ist das Wurzelgeheimnis für ein gesamtes digitales Vermögen—nicht „nur ein weiteres Passwort“.",
      listIntro: "Anders als die meisten Zugangsdaten:",
      outro:
        "Sie verteidigen sich nicht nur gegen heutige Angreifer—Sie treffen Entscheidungen, die in zehn oder zwanzig Jahren noch zählen können.",
    },
    browserEncryption: {
      title: "Browser-Verschlüsselung ist stark—aber keine Magie",
      paragraphs: [
        "PrivateNote verschlüsselt in Ihrem Browser vor dem Upload. Unsere Server sehen nur Chiffretext; der Schlüssel erreicht uns nie. Das ist weit besser als [E-Mail](blog:why-email-is-worst-for-secrets), Chat oder Cloud-Dokumente für alltägliche Geheimnisse—und entspricht einem strikten [Ende-zu-Ende-Verschlüsselungs](blog:what-is-end-to-end-encryption)-Modell für den Notizinhalt.",
        "Jede Browser-Krypto-App teilt eine Einschränkung: **Klartext muss im Browser existieren, bevor verschlüsselt wird.** Bösartiges JavaScript—von Erweiterungen, Supply-Chain-Kompromittierung, Injection oder einem schlechten CDN—könnte ihn theoretisch zuerst lesen. Das ist inhärent für clientseitige Verschlüsselung im Browser, nicht spezifisch für PrivateNote.",
        "Für API-Schlüssel und temporäre Passwörter ist dieser Kompromiss meist in Ordnung. Für eine Seed-Phrase, die Erspartes schützt, wollen Sie vielleicht weniger Systemen vertrauen.",
      ],
    },
    encryptLocal: {
      title: "Verschlüsseln, bevor der Browser es sieht",
      intro: "Lokal verschlüsseln, dann nur Chiffretext hochladen:",
      outro: "PrivateNote erhält niemals die Mnemonic—nur verschlüsselte Daten.",
      callout:
        "Lokale Verschlüsselung **stoppt keine Malware auf Ihrem Rechner**. Sie **hält Klartext von Web-Apps, Cloud-Diensten und Servern fern**, die ihn nicht brauchen. Sie verkleinern die vertrauenswürdige Rechenbasis; Sie eliminieren keinen kompromittierten Endpunkt.",
    },
    whichTool: {
      title: "Welches Werkzeug nutzen",
      age: "**age** (für die meisten Nutzer empfohlen): einfache Dateiverschlüsselung mit sicheren Defaults — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: hervorragend, wenn Sie OpenPGP bereits nutzen.",
      openssl: "**OpenSSL**: vertrauenswürdig und mächtig; Low-Level-CLI—besser für erfahrene Nutzer.",
    },
    ageExample: {
      title: "Minimales Beispiel (age)",
      passphraseTitle: "Brauchen Sie eine starke Passphrase?",
      passphraseBefore:
        "Nutzen Sie ein langes, einzigartiges Geheimnis für `age -p`. Generieren Sie eines lokal im Browser—der",
      passphraseLink: "Passphrase-Generator",
      passphraseAfter: "auf passwords.lu läuft clientseitig; nichts wird hochgeladen.",
      p1: "Nachdem `seed.txt.age` verifiziert ist, **Klartext auf dem Sender-Gerät sicher löschen**. Nachdem der Empfänger in eine Wallet importiert hat, **auch dessen Klartext-Kopie löschen**.",
      p2: "Für regelmäßigen Austausch mit jemandem vermeidet `age -r` (Public-Key-Modus) eine gemeinsame Passphrase—lohnt sich separat zu lernen.",
      docsLabel: "Dokumentation:",
    },
    separateChannels: {
      title: "Getrennte Kanäle nutzen",
      intro:
        "Trennen Sie die verschlüsselte Datei vom Geheimnis, das sie entsperrt. Sie trennen den `.age`-Chiffretext von der **age-Entschlüsselungs-Passphrase**—nicht die Seed-Phrase-Mnemonic über einen zweiten Kanal.",
      steps: [
        "Laden Sie die **verschlüsselte Datei** (Chiffretext) mit PrivateNote hoch",
        "Senden Sie die **age-Passphrase**, die diese Datei entschlüsselt—per Signal, Telefon oder persönlich",
      ],
      outro: "Ein Angreifer muss mehrere Systeme kompromittieren—nicht nur einen Link.",
    },
    recommend: {
      title: "Was wir empfehlen",
      intro:
        "Die Trennung geht wirklich um **ersetzbare** versus **lang lebende Master**-Geheimnisse—nicht allein um Dateiformat oder Kanal.",
      oneTimeTitle: "Gut geeignet für Einmal-Links",
      oneTimeSubtitle: "Ersetzbare Geheimnisse, die Sie rotieren oder widerrufen können",
      localTitle: "Zuerst lokal verschlüsseln",
      localSubtitle: "Lang lebende Master-Geheimnisse, die selten wechseln",
      outro:
        "Für API-Schlüssel speziell siehe unseren Leitfaden [API-Schlüssel sicher teilen](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Werkzeug an das Risiko anpassen",
      body: "Jeder Ansatz hat Vertrauensannahmen—Passwortmanager, Hardware-Wallets, Offline-Tools, Browser-Krypto. Keiner ist perfekt; Kompromisse unterscheiden sich. Die Frage ist, ob sie zum **Wert** dessen passen, was Sie schützen.",
    },
    philosophy: {
      title: "Unsere Philosophie",
      p1: "Wir haben PrivateNote so gebaut, dass Verschlüsselung **bevor** Daten unsere Server erreichen passiert. Für temporäre, ersetzbare Geheimnisse schlägt das E-Mail, Messaging oder Cloud-Speicher. Sie können auch [eine geheime Nachricht ohne Konto senden](blog:send-secret-message-without-account). Lesen Sie [wie PrivateNote funktioniert](app:how-it-works) für das vollständige Modell.",
      listIntro: "Für eine Seed-Phrase, die Ihr Erspartes sein könnte:",
      closingQuote:
        "Manchmal ist der beste Rat nicht „nutzen Sie unser Produkt“. Sondern: „Nutzen Sie das richtige Werkzeug für die Aufgabe.“",
    },
  },
  ctaTitle: "Ersetzbare Geheimnisse teilen—nicht Seed-Phrasen—im Browser",
  ctaBody:
    "Erstellen Sie eine verschlüsselte Einmal-Notiz für API-Schlüssel, Passwörter und Zugangsdaten. Für Seed-Phrasen zuerst lokal mit age verschlüsseln, dann nur den Chiffretext teilen.",
  ctaButton: "PrivateNote testen ->",
};
