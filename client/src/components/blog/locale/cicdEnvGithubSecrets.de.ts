import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsDe: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Entwickler-Laptop auf einem Schreibtisch bei Nacht mit Terminal und Konfigurationsdateien unter kühlem blauem Schreibtischlicht",
  heroCaption:
    "Die meisten Geheimnis-Leaks beginnen mit Bequemlichkeit: eine committed .env, eine eingefügte CI-Variable oder ein Schlüssel, der nie die Git-Historie verlassen hat.",
  intro: [
    "API-Schlüssel leaken selten durch ausgeklügelte Krypto-Angriffe. Sie leaken durch Entwickler-Workflows—`.env`-Dateien, die in Git landen, Secrets, die in CI-Logs auftauchen, und Credentials, die „nur kurz“ in Pull Requests eingefügt werden.",
    "Wenn Sie bereits wissen, [wie man einen API-Schlüssel sicher teilt](blog:how-to-share-api-key-securely), ist dieser Leitfaden die nächste Schicht: wo diese Schlüssel in der modernen Software-Auslieferung tatsächlich entweichen—und wie Sie verhindern, dass GitHub, CI/CD und lokale Konfiguration zu einem permanenten Archiv Ihres Produktionszugangs werden.",
    "Das Muster ist jedes Mal dasselbe. Ein Geheimnis gelangt in ein System, das Historie bewahrt. Monate später machen ein Fork, ein Log-Export, ein kompromittierter Laptop oder ein Scan eines öffentlichen Repos aus dieser Bequemlichkeit einen Vorfall.",
  ],
  sections: [
    {
      title: "Warum .env-Dateien und CI/CD ein Magnet für Entwickler-Leaks sind",
      paragraphs: [
        "Lokale Umgebungsdateien und Pipelines existieren, um Konfiguration schnell zu bewegen. Diese Geschwindigkeit ist nützlich—und gefährlich—, weil Secrets oft mit denselben Werkzeugen wandern, die Sie für Code-Review, Build-Artefakte und Automatisierung nutzen.",
        "Eine `.env`-Datei wirkt temporär. Ein Secret in CI fühlt sich „erledigt“ an. Ein Debug-`echo $DATABASE_URL` wirkt in einem privaten Repo harmlos. Angreifer—und automatisierte Secret-Scanner—interessiert nicht, ob die Exposition absichtlich war. Sie interessieren Dauerhaftigkeit, Durchsuchbarkeit und Schadensradius.",
        "Behandeln Sie jedes Secret, das Git oder CI berührt, so, als würde es irgendwann kopiert, gespiegelt oder indexiert. Gestalten Sie den Workflow so, dass diese Annahme überlebbar ist: kurzlebige Credentials, richtige Secret-Stores und menschliche Übergaben, die keinen Klartext in Chat oder Tickets hinterlassen.",
      ],
    },
    {
      title: "Wie Secrets über GitHub entweichen",
      subsections: [
        {
          title: "Committed .env- und Konfigurationsdateien",
          paragraphs: [
            "Der klassische Leak ist immer noch der häufigste: `cp .env.example .env`, Produktionswerte eintragen, dann `git add .` ohne hinzuschauen. Selbst wenn Sie die Datei im nächsten Commit löschen, bleibt das Secret in der Git-Historie, bis Sie sie umschreiben—und öffentliche Repositories können sehr schnell auf exponierte Credentials gescannt werden. Historie umschreiben löscht auch nicht jede Kopie: Forks, Mirrors, CI-Caches und lokale Clones können die alten Commits weiterhin halten.",
            "Varianten sind `docker-compose.yml` mit fest codierten Passwörtern, Terraform-State mit sensiblen Outputs, Kubernetes-Manifeste, die base64-kodierte „Secrets“ speichern (Base64 ist Kodierung, keine Verschlüsselung—wer das Manifest lesen kann, kann den Wert dekodieren), und Notebook-Zellen, die Tokens ausgeben. Sieht es wie Konfiguration aus, gehen Scanner davon aus, dass es ein Credential-Dump ist.",
          ],
        },
        {
          title: "Pull Requests, Issues und Kommentare",
          paragraphs: [
            "Entwickler fügen Staging-Keys in PR-Beschreibungen ein, um „dem Reviewer zu helfen, den Bug zu reproduzieren.“ Ticket-Kommentare und GitHub Discussions haben dasselbe Problem: durchsuchbare Dauerhaftigkeit, Benachrichtigungen, E-Mail-Digests und Exporte.",
            "Private Repositories reduzieren die zufällige Exposition erheblich, sind aber trotzdem kein geeigneter Secrets-Store. Zugriffsänderungen, Auftragnehmer, kompromittierte Konten, Clones, Backups und Integrationen können historischen Klartext wieder auftauchen lassen. Für API-Schlüssel-Übergaben zwischen Menschen nutzen Sie einen [clientseitig verschlüsselten Einmal-Link](blog:one-time-secret-links)—keinen PR-Kommentar.",
          ],
        },
        {
          title: "Forks, Mirrors und Historie, die nie stirbt",
          paragraphs: [
            "Ein einmal committed Schlüssel kann in Forks, Mirrors, CI-Caches und lokalen Clones überleben, lange nachdem der Hauptbranch bereinigt wurde. Secret-Rotation ist die echte Remediation; Historie umschreiben ist Schadensbegrenzung.",
            "Wenn GitHub Secret Scanning, TruffleHog, gitleaks oder eine Cloud-Provider-Warnung auslöst: zuerst rotieren. Dann das Secret aus aktiven Branches entfernen. Erst danach entscheiden, ob ein History-Rewrite den Koordinationsaufwand wert ist.",
          ],
        },
      ],
      calloutTitle: "Harte Regel",
      callout:
        "Committen Sie niemals Live-Secrets in Git—auch keine temporären Staging-Credentials. Muss ein Secret zwischen Menschen wandern, nutzen Sie einen geeigneten sicheren Lieferkanal, etwa einen clientseitig verschlüsselten Einmal-Link. Braucht Automatisierung das Secret, nutzen Sie den nativen Secrets-Mechanismus der CI-Plattform, einen dedizierten Secrets Manager oder idealerweise kurzlebige Credentials über Workload Identity oder OIDC—nicht das Repository.",
    },
    {
      title: "Wie Secrets über CI/CD entweichen",
      subsections: [
        {
          title: "Klartext in Workflow-Dateien",
          paragraphs: [
            "`API_KEY: sk-...` direkt in `.github/workflows/*.yml`, GitLab-CI-YAML oder CircleCI-Config zu setzen, ist nur ein Secret-Commit mit Extra-Schritten. Workflow-Dateien sind Code. Sie werden reviewed, geklont und für immer aufbewahrt.",
            "Nutzen Sie den nativen Secrets-Mechanismus der Plattform (GitHub Actions Secrets, GitLab CI/CD Variables und Entsprechungen) und referenzieren Sie sie als Environment-Bindings—nicht als hardcodiertes YAML. Native CI-Secrets sind weit besser als das Repository, aber keine Magie: böswillige Workflow-Logik, kompromittierte Dependencies und unachtsames Logging können Werte zur Laufzeit trotzdem exposieren. Bevorzugen Sie OIDC oder andere Workload-Identity-Federation zu Cloud-Providern, damit Sie gar keine langlebigen Cloud-Keys in CI brauchen.",
          ],
        },
        {
          title: "Pipeline-Logs und Debug-Ausgabe",
          paragraphs: [
            "Build-Logs sind ein unterschätztes Archiv. Env-Vars „zum Debuggen des Deploys“ auszugeben, `process.env` zu dumpen oder verbose Terraform-/Helm-Output zu fahren, kann Credentials in Log-Speicher schreiben, der den Job überdauert.",
            "Gehen Sie davon aus, dass Logs für alle mit CI-Zugriff lesbar sind—und manchmal für alle, die Artefakte herunterladen können. Maskieren Sie Secrets, vermeiden Sie Env-Dumps, und behandeln Sie eine geleakte Log-Zeile wie ein geleaktes Passwort: rotieren.",
          ],
        },
        {
          title: "Pull Requests von Forks",
          paragraphs: [
            "Fork-PRs sind eine klassische CI-Falle: untrusted Code läuft mit Secrets. Die meisten Plattformen beschränken die Secret-Verfügbarkeit bei Fork-Workflows genau deshalb. Lassen Sie das so. „Aktivieren Sie Secrets einfach“ nie für externe Contributors, damit ein Check grün wird.",
            "Bei internen Repos trennen Sie privilegierte Deploy-Jobs trotzdem von PR-Checks. Build und Test mit Least Privilege; Deploy nur von trusted Branches mit explizit gewährten Secrets.",
          ],
        },
        {
          title: "Shared Runner und Artefakt-Leaks",
          paragraphs: [
            "Self-hosted Runner, geteilte Caches und hochgeladene Artefakte können Tokens länger halten als der Job, der sie erzeugt hat. Workspaces bereinigen, Cache-Keys sorgfältig scopen und niemals `.env`-Dateien „der Bequemlichkeit wegen“ in Build-Artefakte packen.",
          ],
        },
      ],
    },
    {
      title: "Ein sichereres mentales Modell: drei Orte, an denen Secrets leben können",
      paragraphs: [
        "Verwirrung entsteht, wenn Teams ein Tool für jede Aufgabe nutzen. Teilen Sie das Problem nach Lifecycle auf.",
      ],
      comparisonTable: {
        headers: ["Ort", "Am besten für", "Nicht für"],
        rows: [
          [
            "Lokale .env / dotenv",
            "Lokale Entwicklungskonfiguration, die auf dem Laptop bleibt und richtig gitignored ist",
            "Teilen mit Teamkollegen, CI, Git oder langlebige Produktions-Secrets im Klartext",
          ],
          [
            "CI-native Secrets / Vault / Cloud Secret Manager",
            "Machine-to-Machine-Runtime und Deploy-Automatisierung",
            "Menschliche Chat-Übergaben oder langlebige „gib das dem Auftragnehmer“-Nachrichten",
          ],
          [
            "Clientseitig verschlüsselte Einmal-Notiz",
            "Mensch-zu-Mensch-Lieferung eines Keys, Tokens oder .env-Snippets",
            "Speichern von Produktions-Secrets für Apps oder Pipelines",
          ],
        ],
        after: [
          "Eine gitignorierte `.env` ist für die lokale Entwicklung in Ordnung. Sensible Produktions-Secrets sollten idealerweise auch nicht unbegrenzt als Klartext auf Entwickler-Maschinen liegen—bevorzugen Sie wo praktikabel einen Passwort-Manager oder kurzlebigen Zugriff. PrivateNote sitzt in der dritten Zeile: sichere Lieferung zwischen Menschen. Es ist kein Ersatz für GitHub Actions Secrets, HashiCorp Vault, AWS Secrets Manager oder Ihren Passwort-Manager. Für den täglichen API-Schlüssel-Übergang kombinieren Sie das mit [wie man einen API-Schlüssel sicher teilt](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Praktischer Workflow: Secrets aus Git und Chat heraushalten",
      flowIntro:
        "Wenn ein Teammitglied, Auftragnehmer oder Kunde einen Wert braucht, der irgendwann in CI oder eine lokale `.env` landet, nutzen Sie diese Sequenz:",
      flowSteps: [
        {
          step: "Schritt 1",
          title: "Ein scoped, kurzlebiges Credential erstellen",
          body: "Bevorzugen Sie Staging-Keys, Read-only-Scopes, IP-Allowlists und Ablauf. Vermeiden Sie es, den primären Produktions-Key zu verteilen „weil es schneller geht.“",
        },
        {
          step: "Schritt 2",
          title: "Über eine clientseitig verschlüsselte Einmal-Notiz liefern",
          body: "Verschlüsseln Sie das Secret (oder die wenigen benötigten `.env`-Zeilen) lokal mit PrivateNote—über die [Web-App](app:home), [CLI](app:developers/cli), [VS Code / Cursor-Extension](app:developers/vscode) oder [Chrome-Extension](chrome:extension). Setzen Sie einen kurzen Ablauf oder Burn-after-Read, und senden Sie den Notiz-Link—nicht den Klartext—per Slack, E-Mail oder Ticket.",
        },
        {
          step: "Schritt 3",
          title: "Im richtigen Store installieren",
          body: "Der Empfänger kopiert den Wert in eine gitignorierte lokale `.env` (für die Entwicklung), einen Passwort-Manager oder den CI-/Cloud-Secret-Store. Nicht zurück in den PR, den Chat-Thread oder ein geteiltes Doc einfügen.",
        },
        {
          step: "Schritt 4",
          title: "Rotieren, wenn der Job erledigt ist",
          body: "Auftragnehmer-Keys widerrufen, nach Vorfällen rotieren und jedes Credential ersetzen, das jemals in Logs, Git oder einem Ticket erschien. Bequemlichkeit ohne Rotation ist nur verzögerte Incident Response.",
        },
      ],
      midCta: {
        body: "Müssen Sie jemandem gerade einen CI-Token oder ein paar .env-Zeilen übergeben? Senden Sie eine clientseitig verschlüsselte Einmal-Notiz statt Klartext zu committen oder einzufügen.",
        button: "Private Notiz erstellen",
      },
    },
    {
      title: "Teilen von dort, wo Sie bereits arbeiten",
      paragraphs: [
        "Sie müssen Terminal, Editor oder Browser-Tab nicht verlassen, um eine clientseitig verschlüsselte Einmal-Notiz zu erstellen. Wählen Sie die PrivateNote-Oberfläche, die zum Moment passt—Verschlüsselung passiert immer lokal auf Ihrem Gerät vor dem Upload. Für einen ausführlicheren Walkthrough siehe [PrivateNote für Entwickler](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Aus einer Datei lesen oder stdin pipen, damit das Secret nie als `echo`-Argument in der Shell-Historie landet: `npx privatenote-cli --expire 1h --output-url-only .env.local` oder `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Nützlich in Shell-Workflows, Skripten und schnellen Terminal-Übergaben. Setup und Flags: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code und Cursor",
          paragraphs: [
            "Installieren Sie die [VS Code / Cursor-Extension](app:developers/vscode) und verschlüsseln Sie aus der Sidebar, der Editor-Auswahl oder dem Kontextmenü—ideal, wenn das Secret bereits auf dem Bildschirm in einer `.env` oder Config-Datei steht und nie als Klartext in Slack landen soll.",
          ],
        },
        {
          title: "Chrome-Extension",
          paragraphs: [
            "Wenn das Credential in E-Mail, Docs oder einem Ticket auftaucht, macht die [Chrome-Extension](chrome:extension) aus ausgewähltem Text eine browserverschlüsselte Einmal-Notiz, ohne den Tab zu verlassen.",
          ],
        },
      ],
    },
    {
      title: "Entwickler-Checkliste vor jedem Push und Pipeline-Change",
      useCaseTable: {
        headers: ["Checkpoint", "Was zu prüfen ist"],
        rows: [
          [
            "Vor dem Git-Commit",
            "`.env`, `*.pem`, `credentials.json` und lokale Secret-Dateien sind gitignored; `git status` zeigt keine Überraschungs-Additions",
          ],
          [
            "Vor dem Öffnen eines PR",
            "Keine Keys in Beschreibung, Screenshots, Fixtures oder „temporären“ Debug-Dateien",
          ],
          [
            "Vor dem Bearbeiten von Workflows",
            "Secrets kommen aus dem nativen Secrets-Mechanismus der Plattform oder OIDC/Workload Identity—nicht aus hardcodiertem YAML",
          ],
          [
            "Vor dem Debuggen von CI",
            "Kein `env`, `printenv` oder verbose Dumps, die Secrets in Logs schreiben könnten",
          ],
          [
            "Nach jeder Exposition",
            "Zuerst rotieren, dann Historie/Branches bereinigen; Scanner als Incident-Trigger behandeln",
          ],
        ],
      },
      callout:
        "Fügen Sie Secret Scanning zum Standardweg hinzu: Pre-Commit-Hooks (gitleaks), CI-Scanning und GitHub Secret Scanning / Push Protection. Prävention schlägt heroische History-Rewrites.",
    },
    {
      title: "Was tun, wenn ein Secret bereits in GitHub ist",
      paragraphs: [
        "Handeln Sie in dieser Reihenfolge: Credential beim Provider **rotieren oder widerrufen**, abhängige Sessions oder Webhooks **invalidieren**, das Secret vom Default-Branch **entfernen**, dann entscheiden, ob ein History-Rewrite für Compliance oder öffentliche Exposition nötig ist. Auch nach einem Rewrite gehen Sie davon aus, dass Forks, Mirrors, Caches und Clones weiterhin Kopien halten können, bis diese separat adressiert sind.",
        "Benachrichtigen Sie die Owner aller Systeme, die der Key erreichen könnte. Prüfen Sie Cloud-Billing, Access-Logs und ungewöhnliche API-Nutzung. Wurde das Secret auch in Slack oder E-Mail eingefügt, gehen Sie davon aus, dass diese Archive es noch enthalten—siehe [warum E-Mail der schlechteste Ort für Secrets ist](blog:why-email-is-worst-for-secrets) und [Secrets, die Sie nie im Chat senden sollten](blog:secrets-never-send-in-chat).",
        "Bei extrem hochwertigen Secrets wie Krypto-Seed-Phrasen vermeiden Sie die Übertragung möglichst ganz. Bei anderen unersetzlichen Root-Credentials tippen Sie sie gar nicht in eine Website—verschlüsseln Sie zuerst lokal und teilen Sie nur Ciphertext, wenn Sie müssen. Dieses Modell behandelt unser [Crypto-Seed-Phrase-Leitfaden](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist ein privates GitHub-Repo sicher genug für .env-Dateien?",
          answer:
            "Nein. Ein privates Repository begrenzt die Exposition erheblich, ist aber trotzdem kein geeigneter Secrets-Store. Zugriffsänderungen, kompromittierte Konten, Clones, Backups und Drittanbieter-Integrationen können historischen Klartext wieder auftauchen lassen. Halten Sie Secrets ganz aus Git heraus.",
        },
        {
          question: "Reichen GitHub Actions Secrets aus?",
          answer:
            "Sie sind der richtige Ort für viele CI-Runtime-Werte—weit besser als YAML oder Repo-Dateien. Sie lösen trotzdem nicht menschliche Lieferung, Log-Leaks, zu breite Berechtigungen, Fork-PR-Risiken oder Exposition durch böswillige Workflow-Schritte und kompromittierte Dependencies. Kombinieren Sie den nativen Secrets-Mechanismus der Plattform mit Least Privilege, sorgfältigem Logging und idealerweise kurzlebigen Credentials über OIDC oder Workload Identity.",
        },
        {
          question: "Soll ich eine redacted .env.example committen?",
          answer:
            "Ja. Committen Sie nur Variablennamen und Dummy-Platzhalter. Niemals echte Werte, „fast echte“ Staging-Keys oder Produktions-Connection-Strings, bei denen das Passwort entfernt, Host und Username aber intakt sind—wenn diese Kombination in Ihrem Threat Model sensitiv ist.",
        },
        {
          question: "Ist eine lokale .env-Datei in Ordnung?",
          answer:
            "Für die lokale Entwicklung ja—wenn sie richtig gitignored und nie committed wird. Sensible Produktions-Secrets sollten idealerweise nicht unbegrenzt in Klartext-`.env`-Dateien auf Entwickler-Maschinen liegen; nutzen Sie wo praktikabel einen Passwort-Manager, kurzlebigen Zugriff oder einen Secrets Manager.",
        },
        {
          question: "Kann PrivateNote Vault oder GitHub Secrets ersetzen?",
          answer:
            "Nein. PrivateNote ist für sichere Mensch-zu-Mensch-Lieferung. Nutzen Sie den nativen Secrets-Mechanismus der CI-Plattform und dedizierte Secrets Manager für Automatisierung. Nutzen Sie PrivateNote, wenn eine Person einen Key, Token oder ein .env-Snippet empfangen muss, ohne Klartext in Slack, E-Mail oder GitHub zu hinterlassen.",
        },
        {
          question: "Was ist die schnellste sichere Übergabe für einen CI-Token?",
          answer:
            "Erstellen Sie einen eng scoped Token, liefern Sie ihn über eine clientseitig verschlüsselte Einmal-Notiz (Web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) oder [Chrome](chrome:extension)), lassen Sie den Empfänger ihn im CI-Secret-Store oder Passwort-Manager speichern, und widerrufen Sie den Token, wenn die Arbeit fertig ist.",
        },
      ],
    },
    {
      title: "Abschließende Gedanken",
      paragraphs: [
        "GitHub und CI/CD sind exzellent darin, Arbeit zu bewahren. Genau deshalb sind sie schlechte Orte, um Secrets zu bewahren.",
        "Halten Sie `.env`-Dateien lokal, gitignored und wo möglich auf Entwicklung beschränkt. Legen Sie Automatisierungs-Credentials in native CI-Secrets, einen Secrets Manager oder kurzlebige OIDC-Credentials. Wenn ein Mensch einen Wert braucht, nutzen Sie eine clientseitig verschlüsselte Einmal-Notiz—dann rotieren.",
        "Wenn Ihr Team immer noch Keys in PRs einfügt oder „nur Staging“-Credentials committed, starten Sie mit dem [API-Schlüssel-Sharing-Workflow](blog:how-to-share-api-key-securely) und der Checkliste oben. Für Server-Zugangs-Material nutzen Sie [wie man SSH-Schlüssel sicher teilt](blog:how-to-share-ssh-keys-securely). Binden Sie die [CLI](app:developers/cli), [VS Code-Extension](app:developers/vscode) oder [Chrome-Extension](chrome:extension) in den Weg des geringsten Widerstands ein, damit die sichere Option auch die schnelle ist.",
      ],
    },
  ],
  ctaTitle: "Teilen Sie das Secret—nicht eine permanente Kopie",
  ctaBody:
    "Verschlüsseln Sie einen CI-Token oder ein .env-Snippet lokal mit PrivateNote—über die Web-App, CLI, VS Code / Cursor oder Chrome-Extension—, bevor es Chat oder Git erreicht. Nutzen Sie einen kurzen Ablauf oder Burn-after-Read, senden Sie den Einmal-Notiz-Link statt Klartext, und halten Sie Git- und Pipeline-Historie frei von Live-Credentials.",
  ctaButton: "Private Notiz erstellen",
};
