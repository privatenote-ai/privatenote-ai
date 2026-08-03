import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyDe: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Entwickler arbeitet an einem Schreibtisch mit einem Laptop, auf dem Code geöffnet ist—wo SSH-Schlüsselübergaben oft beginnen",
  heroCaption:
    "SSH-Privatschlüssel gehören in verschlüsselte, kurzlebige Übergaben—nicht in Slack, E-Mail oder Git-Historie. Bild: Programmier-Schreibtisch via Pixabay.",
  intro: [
    "Ein Teammitglied braucht Zugang zur Staging-Box. Ein Auftragnehmer braucht einen Deploy-Key fürs Wochenende. Der Laptop von jemandem ist ausgefallen, und der einzige verbleibende Zugang ist der private Schlüssel auf Ihrem Rechner.",
    "Der schnellste Weg ist meist dieselbe schlechte Angewohnheit: den PEM-Block in Slack einfügen, ihn „nur dieses eine Mal“ per E-Mail senden oder in ein Ticket ablegen. Diese Nachricht synchronisiert sich auf Telefone, landet in Suchindizes und kann noch lange nach dem Notfall in Backups liegen.",
    "SSH-Privatschlüssel sind Geheimnisse mit hohem Schadensradius. Ein geleakter Schlüssel kann vollständigen Shell-Zugriff bedeuten. Dieser Leitfaden behandelt, wann Sie einen privaten Schlüssel überhaupt teilen sollten, was nie in den Chat gehört, und wie Sie einen mit einem Burn-after-Reading-verschlüsselten Link übergeben—plus die PrivateNote-Entwicklererweiterungen, die den sicheren Weg zum schnellen machen.",
  ],
  sections: [
    {
      title: "Öffentlicher Schlüssel vs. privater Schlüssel (30 Sekunden Klarheit)",
      paragraphs: [
        "Ein SSH-Schlüsselpaar hat zwei Hälften. Der **öffentliche** Schlüssel ist zum Teilen gedacht: Sie fügen ihn zu `~/.ssh/authorized_keys`, einer Cloud-Konsole oder einem GitHub-Deploy-Key hinzu. Jemandes öffentlichen Schlüssel im Chat zu senden ist normal.",
        "Der **private** Schlüssel (`id_ed25519`, `id_rsa`, eine `.pem`-Datei) ist das Geheimnis. Wer ihn besitzt, kann sich als diese Identität authentifizieren, bis Sie den Zugriff widerrufen. Behandeln Sie ihn wie ein Passwort, das einen Server aufschließt—denn genau das ist er.",
        "Wenn Ihr Instinkt sagt „wir müssen den privaten Schlüssel teilen“, halten Sie inne. In vielen Fällen sollten Sie stattdessen den **öffentlichen** Schlüssel teilen: Der Empfänger generiert sein eigenes Paar lokal, und Sie autorisieren dessen öffentlichen Schlüssel auf dem Host.",
      ],
      calloutTitle: "Faustregel",
      callout:
        "Bevorzugen Sie es, deren öffentlichen Schlüssel hinzuzufügen, statt Ihren privaten Schlüssel zu senden. Übergaben privater Schlüssel sind für Break-Glass- und Legacy-Fälle gedacht—nicht für das Standard-Onboarding.",
    },
    {
      title: "Lieber den privaten Schlüssel nicht teilen",
      paragraphs: [
        "Bevor Sie irgendetwas verschlüsseln und senden, fragen Sie sich, ob der private Schlüssel überhaupt bewegt werden muss:",
      ],
      subsections: [
        {
          title: "Deren öffentlichen Schlüssel hinzufügen",
          paragraphs: [
            "Lassen Sie sie `ssh-keygen` ausführen, Ihnen die `.pub`-Datei senden (im Chat unbedenklich) und sie zu `authorized_keys` oder den SSH-Einstellungen des Anbieters hinzufügen. Sie behalten die private Hälfte; Sie sehen sie nie.",
          ],
        },
        {
          title: "Einen zweckgebundenen Deploy-Key verwenden",
          paragraphs: [
            "Für CI oder ein einzelnes Repository erstellen Sie einen dedizierten Deploy-Key mit minimalem Umfang. Vermeiden Sie es, einen persönlichen Laptop-Schlüssel über mehrere Systeme hinweg wiederzuverwenden.",
          ],
        },
        {
          title: "Kurzlebigen Zugriff bevorzugen",
          paragraphs: [
            "Wo Ihr Stack es unterstützt—SSH-Zertifikate, Bastion-/Jump-Hosts, Tailscale SSH, Cloud-IAM-Rollen—bevorzugen Sie zeitlich begrenzten Zugriff gegenüber dem Kopieren langlebiger privater Schlüssel.",
          ],
        },
        {
          title: "Wann eine Übergabe des privaten Schlüssels gerechtfertigt ist",
          paragraphs: [
            "Break-Glass-Wiederherstellung, ein Legacy-Host, der keine neuen Schlüssel schnell registrieren kann, oder ein Notfall, in dem nur ein passphrasegeschützter Schlüssel existiert. Selbst dann: Verschlüsseln Sie die Übertragung, halten Sie die Gültigkeit kurz, bestätigen Sie den Empfang und rotieren oder widerrufen Sie danach.",
          ],
        },
      ],
    },
    {
      title: "Wo SSH-Schlüssel in der Praxis sterben",
      paragraphs: [
        "Dieselben Kanäle, die [API-Schlüssel](blog:how-to-share-api-key-securely) und [Passwörter](blog:how-to-share-a-password-securely) leaken, leaken auch SSH-Material—oft mit schlimmeren Folgen.",
      ],
      comparisonTable: {
        headers: ["Kanal", "Warum es fehlschlägt", "Was Angreifer erhalten"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Durchsuchbare Historie, Gerätesynchronisierung, Workspace-Exporte",
            "Vollständiger privater Schlüssel im Klartext für immer",
          ],
          [
            "E-Mail",
            "Postfächer, Archive, mobile Synchronisierung, Weiterleitungen",
            "Eine dauerhafte Kopie, die Sie nicht zuverlässig löschen können",
          ],
          [
            "Tickets & Dokumente",
            "Jira, Notion, Confluence, GitHub Issues",
            "Schlüssel in Backups, KI-Suche und Audit-Trails",
          ],
          [
            "Git-Repositories",
            "Historie klebt; „löschen und pushen“ löscht nichts",
            "Scanner finden PEMs in Minuten in öffentlichen Repos",
          ],
        ],
        after: [
          "Wenn das Geheimnis bereits in Chat oder Git aufgetaucht ist, gehen Sie davon aus, dass es verbrannt ist. Widerrufen Sie den Schlüssel, generieren Sie ein neues Paar und liefern Sie den Ersatz über einen [verschlüsselten Einmal-Link](blog:one-time-secret-links)—nicht per erneutem Einfügen. Für Pipeline- und `.env`-Leaks siehe [Geheimnisse in CI/CD und GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Eine sicherere Übergabe privater SSH-Schlüssel",
      paragraphs: [
        "Wenn Sie einen privaten Schlüssel bewegen müssen, behandeln Sie die Übertragung als temporäre Zustellung—nicht als Speicherung. Dasselbe Muster wie bei Passwörtern und API-Schlüsseln gilt: lokal verschlüsseln, einen Link senden, nach dem Lesen vernichten, dann rotieren.",
        "PrivateNote verschlüsselt im Browser (oder in Ihrem Editor/CLI) mit AES-256-GCM, bevor irgendetwas das Netzwerk erreicht. Der Entschlüsselungsschlüssel liegt nur im URL-Fragment—dem `#…`-Teil, den Browser nie an Server senden. Details: [was Ende-zu-Ende-Verschlüsselung hier bedeutet](blog:what-is-end-to-end-encryption) und [wie man eine private Notiz erstellt](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Ein praktischer Break-Glass-Workflow:",
      flowSteps: [
        {
          step: "Schritt 1",
          title: "Schlüssel eingrenzen und schützen",
          body: "Bevorzugen Sie einen dedizierten Schlüssel für diesen Host oder diese Aufgabe. Verwenden Sie eine Passphrase für den privaten Schlüssel. Vermeiden Sie es, Ihren täglichen persönlichen Identitätsschlüssel zu versenden, wenn ein engerer Schlüssel ausreicht.",
        },
        {
          step: "Schritt 2",
          title: "Lokal verschlüsseln",
          body: "Fügen Sie nur das Schlüsselmaterial (nicht einen Roman aus Hostnamen und Benutzernamen) über die [Web-App](app:home), die [VS Code / Cursor Erweiterung](app:developers/vscode), die [CLI](app:developers/cli) oder die [Chrome-Erweiterung](chrome:extension) in PrivateNote ein.",
        },
        {
          step: "Schritt 3",
          title: "Den Link senden—nicht das PEM",
          body: "Teilen Sie den verschlüsselten Link in Slack oder per E-Mail. Aktivieren Sie optional eine Passphrase-Verpackung und senden Sie diese Passphrase über einen separaten Kanal ([Tipp zum getrennten Kanal](blog:how-to-share-a-password-securely)). Bevorzugen Sie 15 Minuten oder 1 Stunde Gültigkeit und Burn-after-Reading.",
        },
        {
          step: "Schritt 4",
          title: "Bestätigen, dann rotieren",
          body: "Der Empfänger installiert den Schlüssel mit korrekten Berechtigungen (`chmod 600`), bestätigt den Login, dann widerrufen Sie den alten Schlüssel oder rotieren ihn. Behandeln Sie jeden Schlüssel, der in einem KI-Prompt lag, als gesehen—rotieren Sie ihn.",
        },
      ],
      midCta: {
        body: "Müssen Sie jetzt einen SSH-Schlüssel übergeben? Erstellen Sie eine verschlüsselte Einmal-Notiz und senden Sie den Link statt des privaten Schlüssels.",
        button: "Private Notiz erstellen",
      },
    },
    {
      title: "Entwicklererweiterungen: SSH-Schlüssel von dort teilen, wo Sie arbeiten",
      paragraphs: [
        "Übergaben scheitern, wenn das sichere Tool drei Klicks weiter entfernt ist als Slack. PrivateNote-Integrationen halten die Verschlüsselung in Ihrem Editor, Browser, Terminal oder Agenten-Workflow. Vollständige Tour: [PrivateNote für Entwickler](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Ihre Situation", "Bester Weg"],
        rows: [
          [
            "Der Schlüssel ist schon im Editor geöffnet",
            "VS Code / Cursor / Codex IDE-Erweiterung — auswählen → als PrivateNote teilen",
          ],
          [
            "Der Schlüssel steht auf einer Webseite oder in einem Ticket",
            "Chrome-Erweiterung — markieren → PrivateNote erstellen",
          ],
          [
            "Sie sind in einem Terminal",
            "CLI — die Datei per Pipe senden, damit das PEM nie in der Shell-Historie landet",
          ],
          [
            "Sie möchten, dass ein Agent den Link erzeugt",
            "MCP-Server — dann rotieren; für private Schlüssel die Editor-Erweiterung bevorzugen",
          ],
          [
            "Der Empfänger ist technisch nicht versiert",
            "Web-App-Link auf privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor und Codex IDE",
          paragraphs: [
            "Installieren Sie aus dem Marketplace (`PrivateNote.privatenote-vscode`), wählen Sie den Schlüsselblock aus und nutzen Sie **Share as PrivateNote**—oder öffnen Sie den Sidebar-Composer. Die Verschlüsselung läuft im Editor-Host-Prozess, sodass der Klartext nie in einen KI-Chat gelangen muss. Einrichtung: [VS Code / Cursor Erweiterung](app:developers/vscode).",
          ],
        },
        {
          title: "Chrome-Erweiterung",
          paragraphs: [
            "Wenn ein Schlüssel in einem Ticket, einer Dokumentationsseite oder einer Admin-Konsole auftaucht, markieren Sie ihn und erstellen Sie eine verschlüsselte Notiz, ohne ihn zuerst in Slack zu kopieren. Installation: [Chrome-Erweiterung](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Leiten Sie aus einer Datei per Pipe weiter, damit das Geheimnis kein `echo`-Argument in der Shell-Historie wird: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Dokumentation: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "MCP für Cursor, Claude und Codex",
          paragraphs: [
            "Agenten können `create_private_note` aufrufen, nachdem Sie [privatenote-mcp](app:developers/mcp) installiert haben. Nützlich für Orchestrierung—aber wenn Sie den privaten Schlüssel in den Agenten-Prompt einfügen, sieht der Modellanbieter ihn möglicherweise vor der Verschlüsselung. Für SSH-Privatschlüssel bevorzugen Sie die Editor- oder Chrome-Erweiterung. Codex-spezifische Einrichtung: [PrivateNote mit Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Ehrlicher Vorbehalt",
      callout:
        "MCP verschlüsselt, nachdem der Agent den Prompt gelesen hat. Die dauerhafte Chat-/E-Mail-Exposition ist weg; die Sichtbarkeit für den KI-Anbieter nicht. Für private Schlüssel nutzen Sie die VS-Code- oder Chrome-Erweiterung, damit Klartext Ihren Rechner nie verlässt, bevor er bereits Chiffretext ist.",
    },
    {
      title: "Best Practices und Fallstricke",
      subsections: [
        {
          title: "Private Schlüssel niemals committen",
          paragraphs: [
            "Halten Sie `id_*` und `*.pem` aus Repositories fern. Fügen Sie sie zur `.gitignore` hinzu. Wenn ein Schlüssel in die Git-Historie gelangt ist, rotieren Sie ihn—das Umschreiben der Historie reicht nicht mehr, sobald das Repository geklont oder gescannt wurde.",
          ],
        },
        {
          title: "Dateiberechtigungen korrigieren",
          paragraphs: [
            "Private Schlüssel sollten `chmod 600` (oder `400`) haben. SSH verweigert auf vielen Systemen zu freizügige Schlüsseldateien—und weltweit lesbare Schlüssel auf gemeinsam genutzten Rechnern sind ein Eigentor.",
          ],
        },
        {
          title: "Keinen Kontext in die Notiz packen",
          paragraphs: [
            "Legen Sie nur das Schlüsselmaterial in die verschlüsselte Notiz. Senden Sie Hostname, Benutzername und Port in einer separaten Nachricht. Wenn der Link leakt, sollte der Angreifer nicht auch eine beschriftete Karte dessen erhalten, was er entschlüsselt.",
          ],
        },
        {
          title: "Passphrase und getrennte Kanäle",
          paragraphs: [
            "Schützen Sie die Schlüsseldatei selbst mit einer Passphrase und verpacken Sie die PrivateNote optional mit einer separaten Passphrase, die über einen anderen Kanal gesendet wird. Gleiche Empfehlung wie bei [sicherem Passwort-Teilen](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Agent-Forwarding ist keine Teilungsstrategie",
          paragraphs: [
            "SSH-Agent-Forwarding kann Schlüsselkopien auf Remote-Hosts reduzieren, ist aber kein Ersatz für sorgfältige Schlüsselverteilung—und es erweitert das Vertrauen auf jeden Hop, durch den Sie weiterleiten. Nutzen Sie es bewusst, nicht als Ausrede, PEMs per E-Mail zu senden.",
          ],
        },
      ],
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist es sicher, einen öffentlichen Schlüssel in Slack zu senden?",
          answer:
            "Ja. Öffentliche Schlüssel sind zum Verteilen gedacht. Vermeiden Sie trotzdem, komplette `~/.ssh`-Verzeichnisse abzulegen—Menschen fügen versehentlich private Dateien mit ein.",
        },
        {
          question: "Kann ich einen SSH-Privatschlüssel in einem Passwort-Manager speichern?",
          answer:
            "Für die langfristige Speicherung von Schlüsseln, die Sie behalten, ist ein Passwort-Manager oder ein hardwaregestützter Agent angemessen. Nutzen Sie für den Moment der Übergabe von Mensch zu Mensch einen Einmal-verschlüsselten Link—dann speichert der Empfänger den Schlüssel korrekt. PrivateNote ist Zustellung, kein Secrets-Tresor.",
        },
        {
          question: "Sollte ich Schlüssel und Passphrase zusammen teilen?",
          answer:
            "Nein. Das schafft wieder einen einzigen Ausfallpunkt. Senden Sie den verschlüsselten Link über einen Kanal und jede Passphrase über einen anderen—oder lassen Sie den Empfänger nach der Installation seine eigene Passphrase setzen und rotieren.",
        },
        {
          question: "Welche Gültigkeit sollte ich verwenden?",
          answer:
            "Für Live-Koordination: 15 Minuten mit Burn-after-Reading. Für asynchrone Auftragnehmer-Übergaben höchstens 1 Stunde oder 1 Tag. Bevorzugen Sie kürzer, wann immer der Empfänger erreichbar ist.",
        },
        {
          question: "Ist PrivateNote ein Ersatz für Vault oder Cloud-Secret-Manager?",
          answer:
            "Nein. Nutzen Sie Vault, AWS Secrets Manager und ähnliche Tools für Machine-to-Machine-Speicherung und -Injektion. Nutzen Sie PrivateNote für den Moment von Person zu Person, wenn ein Schlüssel Chat oder E-Mail durchqueren muss, ohne zu einem dauerhaften Archiv zu werden. Gleiche Unterscheidung wie im [API-Schlüssel-Leitfaden](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Abschließende Gedanken",
      paragraphs: [
        "Die meisten SSH-„Teilungs“-Probleme sind eigentlich Registrierungsprobleme: einen öffentlichen Schlüssel hinzufügen, einen Deploy-Key verwenden oder kurzlebigen Zugriff ausstellen. Wenn ein privater Schlüssel bewegt werden muss, lassen Sie ihn nicht in der [Chat-Historie](blog:secrets-never-send-in-chat) oder [E-Mail](blog:why-email-is-worst-for-secrets) liegen.",
        "Verschlüsseln Sie lokal, senden Sie einen sich selbst zerstörenden Link, bestätigen Sie die Installation und rotieren Sie dann. Verdrahten Sie die [Entwickler-Tools](app:developers), die Sie schon nutzen, damit der sichere Weg auch der Weg des geringsten Widerstands ist.",
      ],
    },
  ],
  ctaTitle: "Teilen Sie den Link—nicht den privaten Schlüssel",
  ctaBody:
    "Erstellen Sie eine im Browser verschlüsselte PrivateNote mit kurzer Gültigkeit und Burn-after-Reading. Oder verschlüsseln Sie über die VS-Code-Erweiterung, die CLI oder die Chrome-Erweiterung, damit das PEM nie als Klartext in Slack landet.",
  ctaButton: "Private Notiz erstellen",
};
