import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatDe: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Von Slack und Microsoft Teams bis WhatsApp und Messenger: Chat ist fuer viele zum Standardweg geworden, Informationen auszutauschen. Er ist schnell, bequem und haelt Teams synchron. Leider ist er auch zu einem digitalen Friedhof fuer hochsensible Daten geworden: aus Bequemlichkeit geteilt und danach vergessen.",
    "Viele moderne Chat-Apps bieten starke [Transportverschluesselung](blog:encrypted-vs-secure-file-sharing) oder sogar Ende-zu-Ende-Verschluesselung. Verschluesselung schuetzt Nachrichten, waehrend sie zwischen Geraeten unterwegs sind. Das groessere Problem beginnt danach. Sobald ein Geheimnis in einem Chat landet, bleibt es oft monatelang oder jahrelang ueber mehrere Systeme hinweg durchsuchbar.",
    "Diese Dauerhaftigkeit erzeugt einen ueberraschend grossen digitalen Fussabdruck. Sensible Informationen koennen in durchsuchbaren Chatverlaeufen, Cloud-Backups, Workspace-Exporten, Benachrichtigungsvorschauen, Screenshots und synchronisierten Geraeten weiterleben.",
    "Laut [Verizons Data Breach Investigations Report 2026](https://www.verizon.com/business/resources/reports/dbir/) beinhalten **62% der Sicherheitsvorfaelle den menschlichen Faktor**: gestohlene Zugangsdaten, Phishing, Social Engineering, Missbrauch und einfache Fehler. Technik allein verhindert solche Vorfaelle nicht, wenn sensible Informationen unbedacht geteilt werden.",
    "Ein sichererer Ansatz folgt einem einfachen Prinzip: **Informationen nur dann teilen, wenn sie gebraucht werden, und dafuer sorgen, dass sie nach der ersten Ansicht verschwinden.** Genau darauf basieren [Einmal-Links fuer Geheimnisse](blog:one-time-secret-links), und deshalb behandelt PrivateNote die Lebensdauer einer Notiz als Teil der Sicherheit, nicht als Nebensache.",
  ],
  chatScreenshotCaption:
    "Illustratives Beispiel: Klartext-Zugangsdaten in einem Team-Chat bleiben in Kanalverlauf, Backups und Suche erhalten, lange nachdem die Uebergabe erledigt ist.",
  cheatSheetTitle: "Die Sicherheits-Kurzanleitung",
  cheatSheetHeaders: ["Nie senden", "Das Risiko", "Besserer Ansatz"],
  cheatSheetRows: [
    {
      neverSend: "Passwoerter",
      risk: "Werden in dauerhaftem Chatverlauf und durchsuchbaren Logs indexiert.",
      better: "[Einmal-Link mit browserseitiger Verschluesselung](blog:one-time-secret-links).",
    },
    {
      neverSend: "Wiederherstellungscodes",
      risk: "Umgehen Multi-Faktor-Authentifizierung faktisch dauerhaft.",
      better: "Dedizierter Passwortmanager oder [Einmal-Notiz](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "API-Schluessel",
      risk: "Ein versehentliches Einfuegen in einen oeffentlichen Kanal kompromittiert Produktionsumgebungen.",
      better: "[Selbstloeschende sichere Notiz](blog:privatenote-for-developers) mit browserseitiger Verschluesselung.",
    },
    {
      neverSend: "Dokumente",
      risk: "Hinterlassen dauerhafte Kopien in lokalen Download-Ordnern und synchronisierten Geraeten.",
      better: "[Temporaere verschluesselte Dateiuebertragung](app:secure-file-transfer) mit begrenztem Zugriff.",
    },
  ],
  whyChatTitle: "Warum Chat kein Geheimnis-Manager ist",
  whyChatParagraphs: [
    "Messaging-Plattformen sind fuer Kommunikation gebaut, nicht fuer Geheimnisverwaltung. Ihr Zweck ist es, Gespraeche ueber Geraete hinweg zu erhalten, Verlaeufe zu synchronisieren, Suche zu ermoeglichen, Backups zu erstellen und Zusammenarbeit nachvollziehbar zu machen.",
    "Genau diese Funktionen werden zum Risiko, wenn Zugangsdaten oder Unternehmenswerte geteilt werden. Die Information bleibt zugaenglich, lange nachdem sie ihren Zweck erfuellt hat. Unser Artikel zu [Arbeitsplatznachrichten und rechtlicher Auffindbarkeit](blog:workplace-texts-private-note) zeigt, wie beilaufig geschriebene Nachrichten ihren urspruenglichen Kontext um Jahre ueberleben koennen.",
    "Ein einmaliges Geheimnis folgt einem anderen Modell: Die Information ist nur fuer den kurzen Zeitraum verfuegbar, in dem sie tatsaechlich gebraucht wird, und danach wird serverseitiger Zugriff per Design entfernt.",
  ],
  lifetimeTitle: "Datenlebensdauer: klassischer Chat vs. PrivateNote",
  lifetimeIntro: "Der Unterschied liegt nicht nur darin, ob eine Nachricht unterwegs verschluesselt ist. Entscheidend ist, ob das Geheimnis nach dem Lesen noch irgendwo existiert.",
  chatWorkflowLabel: "Klassischer Chat-Ablauf",
  chatWorkflowSteps: ["Passwort", "Slack / Teams", "Gespeichert", "Durchsuchbar", "Backups", "Jahre spaeter"],
  chatWorkflowOutcome: "Das Geheimnis bleibt ueber Systeme hinweg bestehen",
  privateNoteWorkflowLabel: "PrivateNote-Ablauf",
  privateNoteWorkflowSteps: [
    "Passwort",
    "Im Browser verschluesseln",
    "Einmal-Link",
    "Geoeffnet",
    "Vom Server geloescht",
  ],
  privateNoteWorkflowOutcome: "Das Geheimnis wird nach der Zustellung entfernt",
  secretsTitle: "10 Geheimnisse, die nicht in Chat-Apps gehoeren",
  secrets: [
    {
      title: "Konto-Passwoerter",
      paragraphs: [
        "Jeder kennt die Situation: \"Wie war noch einmal das Login fuer das gemeinsame Marketing-Konto?\" und kurz darauf kommt das Passwort im Klartext. Selbst wenn Sie Ihrem Kollegen voll vertrauen, ist dieses Passwort jetzt im Workspace-Verlauf indexiert, in lokalen App-Daten zwischengespeichert und moeglicherweise in E-Mail- oder Push-Benachrichtigungsvorschauen sichtbar.",
        "Wenn ein Angreifer Monate spaeter diesen Chatverlauf kompromittiert, erbt er aktiven Zugriff auf Ihr Konto.",
      ],
      instead:
        "Senden Sie einen [Einmal-Link mit browserseitiger Verschluesselung](blog:send-secret-message-without-account). Sobald der Empfaenger ihn oeffnet und das Passwort abruft, wird der Chiffretext vom Host-Server geloescht. Brauchen Sie zuerst ein starkes Passwort? Nutzen Sie unseren [Passwortgenerator](app:password-generator).",
    },
    {
      title: "MFA-Wiederherstellungscodes",
      paragraphs: [
        "Beim Aktivieren von MFA erzeugen Dienste Notfall-Backup-Codes. Weil Nutzer Angst haben, den Zugriff zu verlieren, kopieren sie diese Codes haeufig in einen Chat mit einem Teammitglied oder in ihren eigenen privaten Chatbereich.",
        "Wiederherstellungscodes sind Backup-Master-Schluessel. Sie wie beilaufigen Text zu behandeln, untergraebt den Zweck von Multi-Faktor-Sicherheit.",
      ],
      instead:
        "Speichern Sie sie in einem dedizierten Passwortmanager. Wenn Sie sie bei einer Kontouebergabe teilen muessen, verwenden Sie eine [temporaere Einmal-Notiz](blog:one-time-secret-links), damit das Geheimnis nicht dauerhaft im Chatverlauf gespeichert bleibt.",
    },
    {
      title: "Produktions-API-Schluessel",
      paragraphs: [
        "Entwickler tauschen API-Schluessel, Zugriffstoken oder Cloud-Secrets oft im Chat aus, um ein schnelles Problem zu debuggen. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) erkennt laufend offengelegte Zugangsdaten in oeffentlichen Repositories, ein Hinweis darauf, wie haeufig Geheimnisse versehentlich leaken.",
        "Ein versehentliches Einfuegen in den falschen Kanal kann Live-Datenbanken oder Abrechnungssysteme offenlegen.",
      ],
      instead:
        "Leiten Sie Token ueber eine [browserseitig verschluesselte Notiz](blog:privatenote-for-developers), die automatisch ablaeuft, nachdem sie einmal angesehen wurde.",
    },
    {
      title: "Private SSH-Schluessel",
      paragraphs: [
        "Ihr privater Schluessel ist Ihre Identitaet fuer Serverinfrastruktur. Er sollte niemals in einer Messaging-Anwendung liegen. Wer einen privaten Schluessel kopiert, erzeugt eine weitere Kopie ausserhalb der vorgesehenen sicheren Umgebung; sie kann in Chatverlaeufen, Backups oder auf Empfaengergeraeten bestehen bleiben.",
      ],
      instead:
        "Wenn ein Schluessel sicher uebertragen werden muss, verwenden Sie eine verschluesselte Einmal-Nutzlast, die sich nach der Zustellung vom Host-Server loescht.",
    },
    {
      title: "Einladungs- und Reset-Links",
      paragraphs: [
        "Temporaere Onboarding- und Admin-Links landen staendig in Chatkanaelen:",
      ],
      bullets: [
        "Zoom-Host-Zuweisungslinks",
        "Google-Meet-Moderator-Tokens",
        "Stripe-Onboarding-Einladungen",
        "Einladungen fuer Administratorrechte",
        "Passwort-Reset-URLs",
      ],
      instead:
        "Senden Sie privilegierte Onboarding-Links ueber eine [Einmal-Notiz](blog:one-time-secret-links), damit sie nicht aus historischen Logs geerntet werden koennen, wenn sie ungenutzt liegen bleiben.",
    },
    {
      title: "Krypto-Seed-Phrases",
      paragraphs: [
        "Ihre 12- oder 24-Wort-Wiederherstellungsphrase kontrolliert Ihr gesamtes Wallet. Wenn jemand Ihr Chatkonto Jahre spaeter kompromittiert, koennen automatisierte Scraper historische Gespraeche nach Phrasen durchsuchen, die Seed-Formaten entsprechen. Wird Ihre Seed Phrase gestohlen, koennen Ihre Werte dauerhaft verloren sein.",
      ],
      instead:
        "Uebertragen Sie Seed Phrases moeglichst gar nicht digital. Wenn ein absoluter Notfall es erzwingt, verwenden Sie eine verschluesselte Notiz, die nach dem Lesen sofortige Loeschung erzwingt, um die Exposition zu begrenzen.",
    },
    {
      title: "Temporaere Zugangsdaten",
      paragraphs: [
        "IT-Helpdesks teilen bei der Einarbeitung neuer Mitarbeiter oft initiale Zugangsdaten. Auch wenn Nutzer normalerweise beim ersten Login zum Aendern des Passworts aufgefordert werden, bleibt das temporaere Passwort im Chatverlauf durchsuchbar. Wenn die Aenderung verzoegert wird oder das System Wiederverwendung erlaubt, bleibt diese Nachricht eine aktive Schwachstelle.",
      ],
      instead:
        "Stellen Sie temporaere Zugangsdaten ueber eine [Notiz mit browserseitiger Verschluesselung](blog:send-secret-message-without-account) zu, die nach dem Oeffnen ablaeuft.",
    },
    {
      title: "Finanz- und Bankinformationen",
      paragraphs: [
        "Firmen-IBANs, Routing-Details, Steuerdokumente oder Zahlungsbestaetigungen in Chats zu kopieren wirkt harmlos, weil eine IBAN allein kein Passwort ist. Kombinieren Angreifer Bankdaten jedoch mit persoenlichem Kontext aus Chatverlaeufen, entsteht die Grundlage fuer ueberzeugendes Phishing und Rechnungsbetrug.",
      ],
      instead:
        "Trennen Sie Finanzdetails von der Alltagskommunikation. Teilen Sie sie ueber verschluesselte Kanaele, die den Zugriff entfernen, sobald die Transaktion geprueft ist.",
    },
    {
      title: "Scans persoenlicher Dokumente",
      paragraphs: [
        "Sie muessen schnell eine Kopie Ihres Passes, Fuehrerscheins oder Arbeitsvertrags an HR senden? Ein PDF im Chatfenster kopiert hochsensible Identitaetsdaten in Cloud-Backups, lokale Smartphone-Galerien und synchronisierte Desktop-Ordner.",
      ],
      instead:
        "Nutzen Sie [sichere Dateiuebertragung](app:secure-file-transfer) mit browserseitiger Verschluesselung: ein Download, danach wird die Datei gemaess Ihren Zugriffseinstellungen vom Host-Server entfernt.",
    },
    {
      title: "Vertrauliche Geschaeftsinformationen",
      paragraphs: [
        "Interne Strategiepraesentationen, noch nicht angekuendigte Preisvorschlaege, juristische Entwuerfe und Uebernahmedokumente wandern staendig durch Teamkanaele. Datenlecks kommen nicht immer von externen Hackern; manchmal entstehen sie, weil ein Mitarbeiter versehentlich einen externen Gast in einen Kanal mit jahrelanger interner Strategie einlaedt.",
      ],
      instead:
        "Teilen Sie sensible Unternehmenswerte ueber verschluesselte Notizen mit strengen automatischen Ablaufzeiten und begrenzten Zugriffsfenstern.",
    },
  ],
  lifespanTitle: "Geheimnisse haben eine Lebensdauer",
  lifespanParagraphs: [
    "Verschluesselung schuetzt Geheimnisse unterwegs. **Ablauf schuetzt sie ueber die Zeit.** Die meisten Chat-Anwendungen ignorieren diesen zweiten Teil fast vollstaendig.",
    "Mit PrivateNote aendern Sie die Sicherheitslage per Design. Statt darauf zu hoffen, dass Nutzer sensible Nachrichten spaeter manuell loeschen, erzwingen Sie die Lebensdauer des Geheimnisses. Der Empfaenger liest es einmal, danach ist es vom Server verschwunden.",
  ],
  lifespanBullets: [
    "**Kein dauerhafter Fussabdruck:** Kein Chatverlauf und kein durchsuchbares Archiv enthaelt das rohe Geheimnis.",
    "**Kleinerer Schadensradius:** Wenn spaeter ein Laptop oder Chatkonto kompromittiert wird, liegen keine alten Passwoerter in Logs, die abgegriffen werden koennen.",
    "**Weniger menschliche Fehler:** Das System erledigt Datenminimierung automatisch, statt dass jemand daran denken muss, sensible Nachrichten manuell zu loeschen.",
  ],
  underHoodTitle: "Sicherheit unter der Haube: so funktioniert PrivateNote",
  underHoodParagraphs: [
    "PrivateNote verschluesselt Ihre Nachricht direkt in Ihrem Browser, bevor sie hochgeladen wird. Der Server speichert nur verschluesselten Chiffretext. Der Entschluesselungsschluessel liegt im [URL-Fragment](blog:one-time-secret-links), also im Teil nach `#`, den Browser bei HTTP-Anfragen nicht an Webserver senden. Der Server erhaelt den Entschluesselungsschluessel nie.",
    "Sobald die Notiz gemaess Ihren Einstellungen geoeffnet wurde, wird der verschluesselte Chiffretext vom Server geloescht. Bei Passwoertern, API-Schluesseln, Wiederherstellungscodes und temporaeren Zugangsdaten ist **die Begrenzung der Datenlebensdauer genauso wichtig wie die Verschluesselung der Daten selbst.** Chats bewahren Gespraeche auf. PrivateNote begrenzt die Lebensdauer von Geheimnissen.",
  ],
  faqTitle: "Haeufige Fragen",
  faq: [
    {
      question: "Ist es sicher, Passwoerter in Slack zu senden?",
      answer:
        "Slack verschluesselt Daten bei der Uebertragung und im Ruhezustand, aber Passwoerter bleiben bis zur Loeschung im durchsuchbaren Chatverlauf. Fuer temporaere Zugangsdaten reduziert eine [Einmal-Notiz mit browserseitiger Verschluesselung](blog:send-secret-message-without-account) die langfristige Exposition.",
    },
    {
      question: "Sind WhatsApp-Nachrichten fuer Passwoerter sicher?",
      answer:
        "Ende-zu-Ende-Verschluesselung schuetzt Nachrichten waehrend der Uebertragung, und verschwindende Nachrichten koennen sie nach einer festgelegten Zeit automatisch loeschen. Empfaenger koennen Inhalte aber weiterhin per Screenshot sichern, weiterleiten oder vor dem Verschwinden sichern. Passwoerter sollten idealerweise nur so lange geteilt werden, wie noetig: ueber einen [Einmal-Link fuer Geheimnisse](blog:one-time-secret-links), nicht ueber einen dauerhaften Chatverlauf.",
    },
    {
      question: "Ist E-Mail sicherer als Chat fuer Passwoerter?",
      answer:
        "Nein. Standard-E-Mail ist normalerweise nicht standardmaessig ende-zu-ende-verschluesselt und laeuft ueber mehrere Mailserver. Nach der Zustellung bleibt ein Passwort unbegrenzt in Postfaechern, Gesendet-Ordnern, lokalen Caches und Anbieter-Backups liegen.",
    },
    {
      question: "Was ist ein Einmal-Geheimnis?",
      answer:
        "Ein Einmal-Geheimnis ist eine Nachricht, die nach einmaligem Ansehen oder nach einer definierten Ablaufzeit nicht mehr verfuegbar ist. Dadurch werden dauerhafte Kopien ueber Systeme hinweg reduziert. Siehe unseren Leitfaden zu [Einmal-Links fuer Geheimnisse](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Quellen",
  references: [
    "Verizon. Data Breach Investigations Report 2026 (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. Healthcare Data Breach Investigations Snapshot 2026. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Geheimnisse teilen, ohne einen Chat-Fussabdruck zu hinterlassen",
  closingBody: [
    "Chat ist hervorragend fuer Koordination. Als Tresor fuer Zugangsdaten, Schluessel, Wiederherstellungscodes und Dokumente, die nie dauerhaft bestehen sollten, ist er schlecht geeignet.",
    "PrivateNote wurde fuer das gegenteilige Muster gebaut: im Browser verschluesseln, einen Link teilen und das Geheimnis ablaufen lassen, sobald seine Aufgabe erledigt ist. Kein Konto fuer den Absender erforderlich, kein Klartext in einem jahrelang durchsuchbaren Archiv.",
  ],
  tagline: "Weniger Chatverlauf. Weniger Metadaten. Mehr Kontrolle darueber, wie lange ein Geheimnis online existiert.",
  relatedReading: "Weiterlesen",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Passwoerter und private Notizen ohne Registrierung senden: browserseitige Verschluesselung und ablaufende Links erklaert.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Wie Einmal-Links funktionieren, warum das URL-Fragment wichtig ist und wann Ablauf besser ist als E-Mail oder Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Warum schriftliche Spuren in E-Mail und Arbeitsplatz-Chat langfristige Risiken schaffen und wann fluechtige Notizen besser passen.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS im Vergleich zu browserseitiger Verschluesselung: was jeweils geschuetzt wird und warum der Server Ihre Daten trotzdem lesen koennte.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Erstellen Sie starke Passwoerter, bevor Sie sie ueber einen Einmal-Link teilen.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Eine praktische Sicherheitsgrundlage fuer Passwoerter, Authentifizierung und sicheres Teilen.",
    },
  ],
};
