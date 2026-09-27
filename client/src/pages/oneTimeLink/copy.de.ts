import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkDe: OneTimeLinkCopy = {
  heroTitle: "Einmal-Link erstellen",
  heroSubtitle:
    "Passwörter, Nachrichten und Dateien verschlüsselt teilen · Im Browser verschlüsselt · Empfänger benötigen kein Konto",
  whatHeading: "Was ist ein Einmal-Link?",
  whatBody:
    "Ein Einmal-Link ist ein sichererer Weg, Informationen zu übergeben, die nicht dauerhaft in gewöhnlichen Kommunikationskanälen liegen sollten. Sie legen ein Passwort, einen API-Schlüssel, einen Wiederherstellungscode, eine private Nachricht, ein sensibles Dokument oder temporäre Zugangsdaten hinter eine verschlüsselte URL. Die empfangende Person öffnet den Link und entschlüsselt den Inhalt im Browser. PrivateNote verschlüsselt den Inhalt im Browser vor dem Upload, sodass der Server verschlüsselte Daten statt Klartext erhält. Sie bestimmen, wie lange ein ungenutzter Link gültig bleibt und wie oft er geöffnet werden darf. Ein Einmal-Link ist ein Werkzeug für die Übergabe, kein dauerhafter Speicherort für Geheimnisse.",
  whatLearnMore: "So funktionieren geheime Einmal-Links",
  stepsHeading: "So erstellen Sie einen Einmal-Link",
  step1Title: "Inhalt hinzufügen",
  step1Body: "Geben Sie eine private Nachricht oder ein Passwort ein oder hängen Sie eine Datei an.",
  step2Title: "Zugriff festlegen",
  step2Body: "Legen Sie Ablauf, mögliche Öffnungen und optionalen Passwortschutz fest.",
  step3Title: "Link senden",
  step3Body: "PrivateNote verschlüsselt den Inhalt in Ihrem Browser und erzeugt einen Link, den Sie über Ihren üblichen Kanal senden.",
  useHeading: "Was Sie mit PrivateNote teilen können",
  usePasswordsTitle: "Passwörter und Zugangsdaten",
  usePasswordsBody:
    "Teilen Sie Passwörter und temporäre Zugangsdaten, ohne den Klartext dauerhaft in E-Mail oder Chat zu hinterlassen.",
  usePasswordsLink: "Passwort sicher teilen",
  useApiTitle: "API-Schlüssel",
  useApiBody:
    "Teilen Sie API-Schlüssel, Tokens und Webhook-Geheimnisse, ohne sie in Chatverläufen oder Tickets zu hinterlassen.",
  useApiLink: "API-Schlüssel sicher teilen",
  useMessagesTitle: "Private Nachrichten",
  useMessagesBody:
    "Für Informationen, die nach dem Lesen nicht dauerhaft in E-Mail oder Chat durchsuchbar bleiben sollen.",
  useMessagesLink: "Geheime Nachricht ohne Konto senden",
  useFilesTitle: "Dateien und Dokumente",
  useFilesBody:
    "Für sensible Dateien, bei denen Sie verschlüsselte Zustellung und begrenzte Verfügbarkeit wollen — kein dauerhaft geteilter Ordner.",
  useFilesLink: "Sichere Dateiübertragung",
  persistHeading: "Warum einen Einmal-Link verwenden?",
  persistBody:
    "Ein Passwort per E-Mail, Slack, Teams, SMS oder einem anderen Messenger zu senden, kann Kopien in Verlauf, synchronisierten Geräten, Backups, Benachrichtigungen und durchsuchbaren Archiven hinterlassen. Verschlüsselung schützt die Übertragung. Ablauf verkürzt, wie lange das Original verfügbar bleibt.",
  handoffHeading: "Für die sichere Übergabe gebaut",
  handoffBody:
    "PrivateNote verschlüsselt Nachrichten und Dateien im Browser, bevor sie hochgeladen werden. Der Server erhält verschlüsselte Daten statt des lesbaren Inhalts. Entschlüsselt wird im Browser des Empfängers.",
  handoffEncryptionLink: "Wie die Verschlüsselung funktioniert",
  handoffHowItWorksLink: "PrivateNote im Detail",
  limitsHeading: "Was ein Einmal-Link nicht verhindern kann",
  limitsBody:
    "Nach dem Öffnen kann eine berechtigte Person Informationen weiterhin kopieren, speichern oder fotografieren. PrivateNote schützt die Übergabe und begrenzt die Verfügbarkeit des ursprünglichen Links. Bereits gespeicherte Kopien werden dadurch nicht gelöscht.",
  faqHeading: "Häufige Fragen",
  faqs: [
    {
      question: "Was ist ein Einmal-Link?",
      answer:
        "Ein Einmal-Link dient dazu, vertrauliche Informationen vorübergehend zu teilen. Statt ein Passwort, eine Nachricht oder eine Datei direkt per E-Mail oder Chat zu senden, teilen Sie einen verschlüsselten Link mit begrenzter Gültigkeit und Zugriffsmöglichkeit. PrivateNote verschlüsselt den Inhalt im Browser, damit das Original nicht dauerhaft im Verlauf liegt.",
    },
    {
      question: "Wie erstelle ich einen Einmal-Link?",
      answer:
        "Nutzen Sie das Formular oben auf dieser Seite. Fügen Sie eine Nachricht, ein Passwort oder eine Datei hinzu, wählen Sie, wie lange der ungenutzte Link verfügbar bleibt und wie oft er geöffnet werden darf, und erstellen Sie den Link. PrivateNote verschlüsselt den Inhalt im Browser und gibt eine URL zurück, die Sie über Ihren üblichen Kanal senden.",
    },
    {
      question: "Kann ich ein Passwort mit einem Einmal-Link senden?",
      answer:
        "Ja. Legen Sie das Passwort in die Notiz und senden Sie den verschlüsselten Link statt des Passworts selbst. Sie können zusätzlich einen Passwortschutz setzen. Bei wichtigen Konten rotieren Sie das Kennwort nach der Nutzung. Ein Einmal-Link ist eine Übergabe, kein Passwortmanager.",
    },
    {
      question: "Kann ich eine Datei über einen Einmal-Link senden?",
      answer:
        "Ja. Hängen Sie eine Datei oder einen Ordner an dieselbe verschlüsselte Notiz. Dateien werden im Browser vor dem Upload verschlüsselt. Das Senden von Anhängen erfordert ein kostenloses PrivateNote-Konto wegen Speicherlimits. Empfänger brauchen zum Öffnen weiterhin kein Konto.",
    },
    {
      question: "Braucht die empfangende Person ein PrivateNote-Konto?",
      answer:
        "Nein. Empfänger öffnen den Link im Browser und entschlüsseln lokal. Sie müssen sich nicht anmelden. Eine einfache Textnotiz kann auch ohne Konto erstellt werden. Das Senden von Dateien erfordert ein kostenloses Konto für Missbrauchsschutz und Speicherlimits.",
    },
    {
      question: "Was passiert nach dem Öffnen?",
      answer:
        "Der Browser der empfangenden Person entschlüsselt den Inhalt lokal. Kostenlose Notizen sind einmal lesbar: danach wird die ursprüngliche Notiz gelöscht. Starter kann bis zu drei Öffnungen erlauben, Business bis zu zehn. Wird der Link nicht geöffnet, läuft er nach der von Ihnen gesetzten Lebensdauer ab — bei kostenlosen Notizen nach höchstens drei Tagen. Angehängte Dateien bleiben nach dem ersten Öffnen für ein begrenztes Zeitfenster sichtbar.",
    },
    {
      question: "Kann jemand einen Screenshot von PrivateNote machen?",
      answer:
        "Ja. Wer den Inhalt sehen kann, kann ihn per Screenshot, Foto oder Kopie festhalten. PrivateNote behauptet nicht, das zu blockieren. Es steuert die verschlüsselte Übertragung und wie lange der ursprüngliche Link verfügbar bleibt.",
    },
    {
      question: "Wie lange kann ein PrivateNote-Link aktiv bleiben?",
      answer:
        "Wird die Notiz nie geöffnet, laufen kostenlose Links nach höchstens drei Tagen ab. Starter erlaubt bis zu 15 Tage und Business bis zu 30 Tage. Nach dem Öffnen sind kostenlose Notizen einmal lesbar. Starter kann bis zu drei Öffnungen und Business bis zu zehn erlauben. Wählen Sie die kürzeste Lebensdauer, die für die Übergabe reicht.",
    },
  ],
  articleLearnMore: "Mehr über die Sicherheit und Funktionsweise von Einmal-Links erfahren",
  backToCreate: "Bereit? Einmal-Link erstellen ↑",
};
