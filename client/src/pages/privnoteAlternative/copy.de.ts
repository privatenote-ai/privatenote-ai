import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativeDe: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Privnote-Alternative",
  eyebrow: "Privnote-Alternative",
  heroTitleLine1: "Eine private Alternative zu Privnote",
  heroTitleLine2: "für Notizen, Passwörter und Dateien",
  heroBody:
    "PrivateNote behält die Einfachheit einer verschwindenden Notiz und ergänzt verschlüsseltes Dateiteilen, Passwortschutz, Empfängersteuerung und Werkzeuge für die Übergabe sensibler Informationen.",
  primaryCta: "Private Notiz erstellen",
  secondaryCta: "So funktioniert es",
  trustLine: "Kein Konto für Textnotizen · Browserseitige Verschlüsselung · Einmal lesen",

  introHeading: "Wenn Sie Privnote schon kennen",
  introBody:
    "Wenn Sie eine Alternative zu Privnote suchen, folgt PrivateNote derselben Idee: Sie erstellen einen privaten Link, teilen ihn, und der Inhalt läuft ab oder verschwindet nach dem Öffnen. Verschlüsselt wird im Browser, bevor etwas hochgeladen wird. Empfänger öffnen den Link und entschlüsseln lokal. Sie brauchen kein Konto.",
  introBody2:
    "PrivateNote führt diesen Ablauf über eine kurze Textnachricht hinaus. Sie können Passwörter, Dokumente, Fotos, Sprach- oder Videoaufnahmen und andere Dateien in derselben verschlüsselten Übergabe teilen — mit zusätzlicher Steuerung, wenn die Situation sie braucht.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Beide Dienste sind für temporäres Teilen gemacht. PrivateNote erweitert die Idee auf Dateien, Medien, Empfängersteuerung und Geschäftsabläufe.",
  compareFeatureColumn: "Funktion",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Ja",
  compareNo: "Nicht angeboten",
  comparePaid: "Starter und Business",
  compareRows: [
    { feature: "Selbstlöschende Notizen", privnote: "yes", privatenote: "yes" },
    { feature: "Kein Konto für Empfänger nötig", privnote: "yes", privatenote: "yes" },
    { feature: "Passwortschutz", privnote: "yes", privatenote: "yes" },
    { feature: "Verschlüsselte Dateianhänge", privnote: "no", privatenote: "yes" },
    { feature: "Mehrere Dateien in einem Link", privnote: "no", privatenote: "yes" },
    { feature: "Fotos, Audio und Video", privnote: "no", privatenote: "yes" },
    { feature: "Benachrichtigungen bei Öffnen und Löschen", privnote: "yes", privatenote: "yes" },
    { feature: "Empfängerverifizierung", privnote: "no", privatenote: "paid" },
    { feature: "Geplante Freigabe", privnote: "no", privatenote: "paid" },
    {
      feature: "Unternehmensbranding auf der Abrufseite",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Entwickler-Werkzeuge (CLI, MCP, Erweiterungen)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Funktionen können sich ändern. Vergleich auf Basis öffentlich verfügbarer Produktinformationen Stand September 2026.",
  compareCta: "PrivateNote ausprobieren",

  whyHeading: "Warum nach einer Privnote-Alternative suchen?",
  whyBody:
    "Privnote eignet sich gut, wenn die Anforderung einfach ist: eine temporäre Textnotiz senden. Temporärer Text ist nur ein Weg, auf dem sensible Informationen zwischen Menschen wandern.",
  whyBody2:
    "Sie müssen vielleicht ein PDF senden, mehrere Dateien teilen, bestätigen, dass ein Link geöffnet wurde, den Zugriff mit einem Passwort schützen oder vertrauliche Dokumente zustellen, ohne sie in gewöhnlicher E-Mail zu hinterlassen.",
  whyClose:
    "Genau dafür ist PrivateNote gebaut: eine sichere Übergabe, nicht nur eine verschwindende Nachricht.",

  passwordHeading: "Eine Privnote-Alternative zum Teilen von Passwörtern",
  passwordBody:
    "WLAN-Passwörter, API-Schlüssel und Wiederherstellungscodes reisen oft in derselben E-Mail oder demselben Chat, der erklärt, wofür sie gedacht sind. Das kann Kopien in Verlauf, synchronisierten Geräten und Backups hinterlassen.",
  passwordBody2:
    "PrivateNote legt die Zugangsdaten hinter einen eigenen verschlüsselten Link. Den Kontext senden Sie über den Kanal, den Sie schon nutzen, das Geheimnis in einer temporären Notiz, die ablaufen, sich nach dem Lesen löschen und optional ein Passwort verlangen kann. Das ist eine Übergabe, kein Passwortmanager.",
  passwordCta: "Passwort sicher teilen",
  passwordArticleLink: "Wie man ein Passwort sicher teilt",

  filesHeading: "Dateien senden, nicht nur Text",
  filesBody:
    "Verträge, Ausweisdokumente, Finanz-PDFs, Konfigurationsdateien, Fotos und Archive sind oft der eigentliche Inhalt. Eine verschwindende Textnotiz kann sie nicht tragen. PrivateNote hält die Notiz und ihre verschlüsselten Anhänge in derselben sicheren Übergabe, sodass Nachricht und Dateien zusammen unterwegs sind.",
  filesBody2:
    "Zum Senden von Dateien ist ein kostenloses PrivateNote-Konto nötig, damit Speicher- und Übertragungslimits greifen. Empfänger öffnen den Link weiterhin ohne Anmeldung. Nach dem ersten Öffnen bleiben Anhänge für ein begrenztes Zeitfenster verfügbar — kein dauerhaft geteilter Ordner.",
  filesLimits:
    "Aktuelle Limits: Free bis {freeSize} pro Datei und {freeCount} Dateien pro Übertragung ({freeTransfers} Übertragungen im Monat). Starter bis {starterSize} und {starterCount} Dateien. Business bis {businessSize} und {businessCount} Dateien.",
  filesCta: "Verschlüsselte Datei senden",
  filesArticleLink: "Vertrauliche Dokumente sicher versenden",

  mediaHeading: "Sensible Fotos, Audio und Video teilen",
  mediaBody:
    "Manche Informationen beginnen nie als Datei auf der Festplatte. Sie fotografieren ein Dokument, nehmen eine kurze Sprachnachricht auf oder hängen ein vorhandenes Foto an — ohne den Umweg über eine andere Messenger-App.",
  mediaBody2:
    "Mit PrivateNote können Sie ein Foto aufnehmen, Audio oder Video aufzeichnen oder vorhandene Medien anhängen. Die Aufnahme erfolgt im Browser; danach gilt dieselbe browserseitige Verschlüsselung wie bei Dateien, bevor etwas hochgeladen wird.",
  mediaPhotoLink: "Fotos sicher teilen",
  mediaVoiceLink: "Verschlüsselte Sprachnachrichten",

  businessHeading: "Wenn aus einer verschwindenden Notiz ein Geschäftsablauf wird",
  businessBody:
    "Derselbe private Link hilft, wenn der Absender eine Steuerberatung, eine IT-Administration, eine Beratung oder eine Kanzlei ist, die vertrauliche Dateien an Kundinnen und Kunden übergibt. Es geht nicht nur um Geheimhaltung. Es geht um Bestätigung, Kontrolle und eine professionelle Zustellung.",
  businessScenarios: [
    "Eine Steuerberatung sendet vertrauliche Zahlen an einen Mandanten.",
    "Eine IT-Administration sendet Zugangsdaten an Mitarbeitende.",
    "Eine Kanzlei sendet Ausweis- oder Finanzdokumente an Kundinnen und Kunden.",
    "Eine Beratung übergibt Projektdateien, die nicht in der E-Mail liegen bleiben sollen.",
    "Ein Unternehmen muss wissen, dass auf sensible Informationen zugegriffen wurde.",
  ],
  businessBody2:
    "Starter und Business ergänzen Empfängerverifizierung, geplante Freigabe, Zugriffsnachweis, längere Zugriffsfenster, Widerruf ungeöffneter Notizen und eine Übersicht gesendeter Notizen. Business fügt gebrandete Abrufseiten, Dateizugriff nur zur Ansicht und größere Übertragungen hinzu. Die Verschlüsselung bleibt in jedem Tarif browserseitig.",
  businessCta: "PrivateNote Business entdecken",
  businessNotifyLink: "Wissen, wann ein Geheim-Link geöffnet wurde",
  businessVerifyLink: "Empfängerverifizierung",

  securityHeading: "Wie PrivateNote Ihre Inhalte schützt",
  securityBody:
    "Sensible Inhalte werden in Ihrem Browser verschlüsselt, bevor sie hochgeladen werden. Die Infrastruktur von PrivateNote speichert Chiffretext, nicht die Klartext-Notiz oder -Datei.",
  securityArchitecture:
    "Für eine Standardnotiz erzeugt der Browser einen zufälligen 256-Bit-Schlüssel und nutzt authentifizierte Verschlüsselung mit AES-256-GCM. Der Entschlüsselungsschlüssel liegt im URL-Fragment — dem Teil nach #. Browser senden das Fragment in normalen HTTP-Anfragen nicht mit, sodass der Server den Schlüssel nicht als Teil der Anfrage-URL erhält.",
  securityRecipient:
    "Der Browser der empfangenden Person nutzt den Schlüssel aus dem geteilten Link, um den Inhalt lokal zu entschlüsseln.",
  securityLimitation:
    "Wer später den vollständigen Link hat, kann weiterhin kopieren oder einen Screenshot machen. PrivateNote steuert die Übergabe, nicht was nach dem Öffnen damit geschieht.",
  securityFlowWrite: "Schreiben / anhängen",
  securityFlowEncrypt: "Im Browser verschlüsseln",
  securityFlowCiphertext: "Chiffretext hochladen",
  securityFlowShare: "Privaten Link teilen",
  securityFlowDecrypt: "Empfänger entschlüsselt",
  securityEncryptionLink: "Wie die Verschlüsselung von PrivateNote funktioniert",
  securityHowItWorksLink: "So funktioniert es im Detail",
  founderHeading: "Mit Kryptografie im Blick gebaut",
  founderBody:
    "PrivateNote wird von Marjan Skrobot entwickelt, einem Forscher für Kryptografie und Informationssicherheit. Sicherheitsmodell und Grenzen sind öffentlich dokumentiert — einschließlich dessen, wogegen PrivateNote schützen kann und wogegen nicht.",
  founderLink: "Zum Sicherheitsmodell",

  decideHeading: "Was sollten Sie nutzen?",
  decidePrivnoteTitle: "Privnote kann ausreichen, wenn …",
  decidePrivnoteItems: [
    "Sie nur eine temporäre Textnotiz senden müssen.",
    "Sie den einfachstmöglichen Ablauf wollen.",
    "Sie keine Dateianhänge oder zusätzliche Zustellsteuerung brauchen.",
  ],
  decidePrivateNoteTitle: "PrivateNote kann besser passen, wenn …",
  decidePrivateNoteItems: [
    "Sie dokumentierte browserseitige Verschlüsselung wollen.",
    "Sie neben Text auch Dateien oder Medien teilen müssen.",
    "Sie Empfängerverifizierung oder geplante Freigabe brauchen.",
    "Sie Benachrichtigungen beim Zugriff oder einen Zugriffsnachweis wollen.",
    "Sie professionelles Branding oder geschäftliche Zustellsteuerung brauchen.",
  ],
  decideOneTimeLink: "So funktionieren geheime Einmal-Links",
  decideDevelopersLink: "Entwickler-Integrationen",

  faqHeading: "Häufige Fragen",
  faqs: [
    {
      question: "Welche Alternativen zu Privnote gibt es?",
      answer:
        "Mehrere Dienste bieten temporäres oder verschlüsseltes Teilen von Notizen. PrivateNote ist für Menschen gebaut, die den Ablauf einer verschwindenden Notiz wollen, aber auch verschlüsselte Dateien, Medien, Empfängersteuerung oder geschäftliche Zustellung brauchen.",
    },
    {
      question: "Worin unterscheidet sich PrivateNote von Privnote?",
      answer:
        "Beide erzeugen einen temporären privaten Link, den Empfänger ohne Konto öffnen können. PrivateNote ergänzt verschlüsselte Anhänge, Foto- und Audioaufnahme im Browser, optionalen Passwortschutz im selben Ablauf und bezahlte Steuerung wie Empfängerverifizierung und gebrandete Abrufseiten. Privnote konzentriert sich auf selbstlöschende Textnotizen.",
    },
    {
      question: "Kann ich PrivateNote ohne Konto nutzen?",
      answer:
        "Ja. Eine einfache verschlüsselte Textnotiz können Sie ohne Anmeldung erstellen. Empfänger brauchen nie ein Konto. Das Senden von Dateien, Fotos oder Aufnahmen erfordert ein kostenloses Konto, damit Speicher- und monatliche Übertragungslimits greifen.",
    },
    {
      question: "Kann ich mit PrivateNote Dateien senden?",
      answer:
        "Ja. Hängen Sie eine oder mehrere Dateien an dieselbe verschlüsselte Notiz. Dateien werden im Browser vor dem Upload verschlüsselt. Zum Senden ist ein kostenloses Konto nötig, zum Öffnen des Links nicht. Empfänger können Anhänge in einem begrenzten Zeitfenster nach dem Öffnen herunterladen.",
    },
    {
      question: "Kann ich mit PrivateNote Passwörter teilen?",
      answer:
        "Ja. Legen Sie das Passwort in die Notiz und senden Sie den verschlüsselten Link statt des Passworts selbst. Sie können zusätzlich einen Passwortschutz setzen und die Gültigkeit kurz halten. Nach der Nutzung wichtiger Zugangsdaten rotieren Sie sie. Eine private Notiz ist eine Übergabe, kein Passwortmanager.",
    },
    {
      question: "Wie verschlüsselt PrivateNote Notizen?",
      answer:
        "Der Browser erzeugt einen zufälligen 256-Bit-Schlüssel und verschlüsselt die Notiz vor dem Upload mit AES-256-GCM. Der Schlüssel liegt im URL-Fragment — dem Teil nach # —, den Browser in einer normalen HTTP-Anfrage nicht mitsenden. Passwortgeschützte Notizen umhüllen diesen Schlüssel mit Argon2id. Dateianhänge werden ebenfalls im Browser verschlüsselt.",
    },
    {
      question: "Braucht die empfangende Person ein PrivateNote-Konto?",
      answer:
        "Nein. Empfänger öffnen den Link im Browser und entschlüsseln lokal. Sie müssen sich nicht anmelden. Wer den vollständigen Link hat — und das Passwort, falls gesetzt — kann die Notiz öffnen.",
    },
  ],

  finalHeading: "Teilen Sie etwas privat.",
  finalBody: "Erstellen Sie eine verschlüsselte Notiz oder Dateiübergabe und senden Sie den Link an die empfangende Person.",
  finalPrimaryCta: "Private Notiz erstellen",
  finalSecondaryCta: "Pläne vergleichen",
  finalTrust: "Zum Starten ist kein Konto nötig.",
};
