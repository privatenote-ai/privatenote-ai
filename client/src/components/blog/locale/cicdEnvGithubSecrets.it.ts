import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsIt: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Laptop di uno sviluppatore su una scrivania di notte con terminale e file di configurazione sotto una luce blu fredda",
  heroCaption:
    "La maggior parte delle fughe di secret inizia per comodità: un .env committato, una variabile CI incollata, o una chiave che non ha mai lasciato la history di Git.",
  intro: [
    "Le chiavi API di solito non fuoriescono tramite attacchi crittografici sofisticati. Fuoriescono tramite i workflow degli sviluppatori—file `.env` committati in Git, secret ecoati nei log CI e credenziali incollate nelle pull request «solo per ora».",
    "Se sai già [come condividere una chiave API in modo sicuro](blog:how-to-share-api-key-securely), questa guida è il livello successivo: dove quelle chiavi sfuggono davvero nella delivery software moderna, e come impedire a GitHub, CI/CD e alla config locale di diventare un archivio permanente del tuo accesso di produzione.",
    "Lo schema è sempre lo stesso. Un secret entra in un sistema costruito per conservare la history. Mesi dopo, un fork, un export di log, un laptop compromesso o una scansione di un repo pubblico trasformano quella comodità in un incidente.",
  ],
  sections: [
    {
      title: "Perché i file .env e CI/CD attirano le fughe degli sviluppatori",
      paragraphs: [
        "I file di ambiente locali e le pipeline esistono per muovere la configurazione in fretta. Quella velocità è utile—e pericolosa—perché i secret spesso viaggiano con gli stessi strumenti che usi per code review, artefatti di build e automazione.",
        "Un file `.env` sembra temporaneo. Un secret in CI sembra «gestito». Un `echo $DATABASE_URL` di debug sembra innocuo in un repo privato. Gli attaccanti—e gli scanner automatici di secret—non si preoccupano se l’esposizione era intenzionale. Contano permanenza, ricercabilità e raggio d’impatto.",
        "Tratta ogni secret che tocca Git o CI come se prima o poi venisse copiato, mirrorato o indicizzato. Progetta il workflow così che quell’ipotesi sia sopravvivibile: credenziali a breve durata, store di secret appropriati e passaggi umani che non lasciano plaintext in chat o ticket.",
      ],
    },
    {
      title: "Come i secret sfuggono attraverso GitHub",
      subsections: [
        {
          title: "File .env e di config committati",
          paragraphs: [
            "La fuga classica resta la più comune: `cp .env.example .env`, inserire i valori di produzione, poi `git add .` senza accorgersene. Anche se elimini il file nel commit successivo, il secret resta nella history di Git finché non la riscrivi—e i repository pubblici possono essere scansionati molto rapidamente per credenziali esposte. Riscrivere la history non cancella nemmeno ogni copia: fork, mirror, cache CI e clone locali possono ancora tenere i vecchi commit.",
            "Le varianti includono `docker-compose.yml` con password hardcoded, stato Terraform con output sensibili, manifest Kubernetes che memorizzano «secret» in base64 (base64 è encoding, non cifratura—chiunque possa leggere il manifest può decodificare il valore) e celle di notebook che stampano token. Se sembra configurazione, assumi che gli scanner lo tratteranno come un dump di credenziali.",
          ],
        },
        {
          title: "Pull request, issue e commenti",
          paragraphs: [
            "Gli sviluppatori incollano chiavi di staging nelle descrizioni delle PR per «aiutare il reviewer a riprodurre il bug». I commenti dei ticket e GitHub Discussions ereditano lo stesso problema: permanenza ricercabile, notifiche, digest email ed export.",
            "I repository privati riducono molto l’esposizione casuale, ma non sono comunque un store di secret appropriato. Cambi di accesso, contractor, account compromessi, clone, backup e integrazioni possono far riemergere plaintext storico. Per i passaggi di chiavi API tra persone, usa un [link monouso cifrato lato client](blog:one-time-secret-links)—non un commento di PR.",
          ],
        },
        {
          title: "Fork, mirror e history che non muore mai",
          paragraphs: [
            "Una chiave committata una volta può sopravvivere in fork, mirror, cache CI e clone locali molto dopo che il branch principale è stato pulito. La rotazione del secret è la vera remediation; riscrivere la history è controllo dei danni.",
            "Se scattano GitHub Secret Scanning, TruffleHog, gitleaks o un alert del cloud provider, ruota prima. Poi rimuovi il secret dai branch attivi. Solo allora decidi se riscrivere la history vale il costo di coordinamento.",
          ],
        },
      ],
      calloutTitle: "Regola ferrea",
      callout:
        "Non committare mai secret live in Git—nemmeno credenziali temporanee di staging. Se un secret deve passare tra persone, usa un canale di consegna sicuro appropriato, come un link monouso cifrato lato client. Se l’automazione ha bisogno del secret, usa il meccanismo nativo di secret della piattaforma CI, un secret manager dedicato o preferibilmente credenziali a breve durata ottenute tramite workload identity o OIDC—non il repository.",
    },
    {
      title: "Come i secret sfuggono attraverso CI/CD",
      subsections: [
        {
          title: "Plaintext nei file di workflow",
          paragraphs: [
            "Mettere `API_KEY: sk-...` direttamente in `.github/workflows/*.yml`, YAML di GitLab CI o config CircleCI è solo committare un secret con passaggi extra. I file di workflow sono codice. Vengono revisionati, clonati e conservati per sempre.",
            "Usa il meccanismo nativo di secret della piattaforma (secret di GitHub Actions, variabili GitLab CI/CD ed equivalenti) e riferiscili come binding di environment—non YAML hardcoded. I secret CI nativi sono molto meglio del repository, ma non sono magia: logica di workflow malevola, dipendenze compromesse e logging negligente possono ancora esporre valori a runtime. Preferisci OIDC o altra federazione di identity del carico di lavoro verso i cloud provider così non ti servono chiavi cloud di lunga durata in CI.",
          ],
        },
        {
          title: "Log di pipeline e output di debug",
          paragraphs: [
            "I log di build sono un archivio sottovalutato. Stampare variabili d’ambiente «per debuggare il deploy», dumpare `process.env` o eseguire output verbose di Terraform/Helm può scrivere credenziali in storage di log che sopravvive al job.",
            "Assumi che i log siano leggibili da chiunque abbia accesso CI—e a volte da chiunque possa scaricare artefatti. Maschera i secret, evita di dumpare l’env e tratta una riga di log fugata come una password fugata: ruota.",
          ],
        },
        {
          title: "Pull request da fork",
          paragraphs: [
            "Le PR da fork sono una trappola CI classica: codice non fidato che gira con secret. La maggior parte delle piattaforme limita la disponibilità dei secret sui workflow da fork proprio per questo. Lascialo così. Non «abilitare i secret» per contributor esterni solo per far diventare verde un check.",
            "Per i repo interni, separa comunque i job di deploy privilegiati dai check delle PR. Build e test con least privilege; deploy solo da branch fidati con secret concessi esplicitamente.",
          ],
        },
        {
          title: "Runner condivisi e fuga di artefatti",
          paragraphs: [
            "I runner self-hosted, le cache condivise e gli artefatti caricati possono trattenere token più a lungo del job che li ha creati. Pulisci i workspace, delimita con cura le cache key e non impacchettare mai file `.env` negli artefatti di build «per comodità».",
          ],
        },
      ],
    },
    {
      title: "Un modello mentale più sicuro: tre posti in cui i secret possono vivere",
      paragraphs: [
        "La confusione nasce quando i team usano uno strumento per ogni compito. Dividi il problema per ciclo di vita.",
      ],
      comparisonTable: {
        headers: ["Posto", "Ideale per", "Non per"],
        rows: [
          [
            "Local .env / dotenv",
            "Config di sviluppo locale che resta sul laptop ed è correttamente in gitignore",
            "Condivisione con colleghi, CI, Git, o secret di produzione di lunga durata in plaintext",
          ],
          [
            "Secret CI nativi / Vault / cloud secret manager",
            "Runtime machine-to-machine e automazione di deploy",
            "Passaggi umani in chat o messaggi di lunga durata «passa questo al contractor»",
          ],
          [
            "Nota monouso cifrata lato client",
            "Consegna umana di una chiave, un token o uno snippet .env",
            "Archiviare secret di produzione per app o pipeline",
          ],
        ],
        after: [
          "Un `.env` in gitignore va bene per lo sviluppo locale. I secret di produzione sensibili idealmente non dovrebbero vivere a tempo indeterminato in plaintext sulle macchine degli sviluppatori—preferisci un password manager o accesso a breve durata dove è pratico. PrivateNote sta nella terza riga: consegna sicura tra persone. Non sostituisce i secret di GitHub Actions, HashiCorp Vault, AWS Secrets Manager o il tuo password manager. Per i passaggi quotidiani di chiavi API, abbinalo a [come condividere una chiave API in modo sicuro](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Workflow pratico: tenere i secret fuori da Git e dalla chat",
      flowIntro:
        "Quando un collega, un contractor o un cliente ha bisogno di un valore che finirà in CI o in un `.env` locale, usa questa sequenza:",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Crea una credenziale scoped e a breve durata",
          body: "Preferisci chiavi di staging, scope di sola lettura, allowlist IP e scadenza. Evita di distribuire la chiave di produzione primaria «perché è più veloce».",
        },
        {
          step: "Passo 2",
          title: "Consegna tramite una nota monouso cifrata lato client",
          body: "Cifra il secret (o le poche righe `.env` necessarie) localmente con PrivateNote—tramite la [web app](app:home), la [CLI](app:developers/cli), l’[estensione VS Code / Cursor](app:developers/vscode) o l’[estensione Chrome](chrome:extension). Imposta una scadenza breve o burn-after-read, poi invia il link della nota—non il plaintext—via Slack, email o ticket.",
        },
        {
          step: "Passo 3",
          title: "Installa nello store giusto",
          body: "Il destinatario copia il valore in un `.env` locale in gitignore (per lo sviluppo), un password manager o lo store di secret CI/cloud. Non re-incollarlo nella PR, nel thread della chat o in un doc condiviso.",
        },
        {
          step: "Passo 4",
          title: "Ruota quando il lavoro è finito",
          body: "Revoca le chiavi dei contractor, ruota dopo gli incidenti e sostituisci ogni credenziale che sia mai apparsa in log, Git o un ticket. La comodità senza rotazione è solo risposta agli incidenti ritardata.",
        },
      ],
      midCta: {
        body: "Devi passare a qualcuno un token CI o qualche riga .env adesso? Invia una nota monouso cifrata lato client invece di committare o incollare plaintext.",
        button: "Crea una nota privata",
      },
    },
    {
      title: "Condividi da dove lavori già",
      paragraphs: [
        "Non serve lasciare terminale, editor o scheda del browser per creare una nota monouso cifrata lato client. Scegli la superficie PrivateNote che calza il momento—la cifratura avviene sempre in locale sul tuo dispositivo prima dell’upload. Per una guida più completa, vedi [PrivateNote per sviluppatori](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Leggi da un file o fai pipe di stdin così il secret non resta nella history della shell come argomento di `echo`: `npx privatenote-cli --expire 1h --output-url-only .env.local` o `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Utile in workflow shell, script e passaggi rapidi da terminale. Setup e flag: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code e Cursor",
          paragraphs: [
            "Installa l’[estensione VS Code / Cursor](app:developers/vscode), poi cifra dalla sidebar, dalla selezione dell’editor o dal menu contestuale—ideale quando il secret è già a schermo in un `.env` o file di config e non deve mai finire in Slack come plaintext.",
          ],
        },
        {
          title: "Estensione Chrome",
          paragraphs: [
            "Quando la credenziale compare in email, docs o un ticket, l’[estensione Chrome](chrome:extension) trasforma il testo selezionato in una nota monouso cifrata nel browser senza lasciare la scheda.",
          ],
        },
      ],
    },
    {
      title: "Checklist sviluppatore prima di ogni push e modifica alla pipeline",
      useCaseTable: {
        headers: ["Checkpoint", "Cosa verificare"],
        rows: [
          [
            "Prima del git commit",
            "`.env`, `*.pem`, `credentials.json` e file locali di secret sono in gitignore; `git status` non mostra aggiunte a sorpresa",
          ],
          [
            "Prima di aprire una PR",
            "Nessuna chiave in descrizione, screenshot, fixture o file di debug «temporanei»",
          ],
          [
            "Prima di modificare i workflow",
            "I secret vengono dal meccanismo nativo di secret della piattaforma o da OIDC/workload identity—non da YAML hardcoded",
          ],
          [
            "Prima di debuggare la CI",
            "Niente `env`, `printenv` o dump verbose che potrebbero scrivere secret nei log",
          ],
          [
            "Dopo qualsiasi esposizione",
            "Ruota prima, poi pulisci history/branch; tratta gli scanner come trigger di incidente",
          ],
        ],
      },
      callout:
        "Aggiungi il secret scanning al percorso predefinito: hook pre-commit (gitleaks), scanning CI e GitHub Secret Scanning / push protection. La prevenzione batte le riscritture eroiche della history.",
    },
    {
      title: "Cosa fare se un secret è già in GitHub",
      paragraphs: [
        "Agisci in questo ordine: **ruota o revoca** la credenziale presso il provider, **invalida** sessioni o webhook dipendenti, **rimuovi** il secret dal branch di default, poi decidi se una riscrittura della history è necessaria per compliance o esposizione pubblica. Anche dopo una riscrittura, assumi che fork, mirror, cache e clone possano ancora trattenere copie finché non vengono affrontati separatamente.",
        "Avvisa i proprietari di ogni sistema che la chiave potrebbe raggiungere. Controlla billing cloud, log di accesso e uso API insolito. Se il secret è stato anche incollato in Slack o email, assumi che quegli archivi lo contengano ancora—vedi [perché l’email è il posto peggiore per i secret](blog:why-email-is-worst-for-secrets) e [i secret che non dovresti mai inviare in chat](blog:secrets-never-send-in-chat).",
        "Per secret di valore estremamente alto come seed phrase crypto, evita di trasmetterli quando possibile. Per altre credenziali root irrinunciabili, non digitarle affatto in un sito web—cifra prima in locale e condividi solo ciphertext quando serve. Quel modello è coperto nella nostra [guida alle seed phrase crypto](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Un repo GitHub privato basta per i file .env?",
          answer:
            "No. Un repository privato limita molto l’esposizione, ma non è comunque un store di secret appropriato. Cambi di accesso, account compromessi, clone, backup e integrazioni di terze parti possono far riemergere plaintext storico. Tieni i secret del tutto fuori da Git.",
        },
        {
          question: "I secret di GitHub Actions bastano?",
          answer:
            "Sono il posto giusto per molti valori runtime CI—molto meglio di YAML o file del repo. Non risolvono comunque la consegna umana, le fughe nei log, i permessi troppo ampi, i rischi delle PR da fork né l’esposizione tramite step di workflow malevoli e dipendenze compromesse. Combina il meccanismo nativo di secret della piattaforma con least privilege, logging attento e preferibilmente credenziali a breve durata via OIDC o workload identity.",
        },
        {
          question: "Dovrei committare un .env.example redacted?",
          answer:
            "Sì. Committa solo nomi di variabili e placeholder fittizi. Mai valori reali, chiavi di staging «quasi reali» o connection string di produzione con la password rimossa ma host e username intatti se quella combinazione è sensibile nel tuo threat model.",
        },
        {
          question: "Un file .env locale va bene?",
          answer:
            "Per lo sviluppo locale, sì—quando è correttamente in gitignore e mai committato. I secret di produzione sensibili idealmente non dovrebbero vivere a tempo indeterminato in file `.env` in plaintext sulle macchine degli sviluppatori; usa un password manager, accesso a breve durata o un secret manager dove è pratico.",
        },
        {
          question: "PrivateNote può sostituire Vault o i secret di GitHub?",
          answer:
            "No. PrivateNote è per la consegna sicura persona-a-persona. Usa il meccanismo nativo di secret della piattaforma CI e secret manager dedicati per l’automazione. Usa PrivateNote quando una persona deve ricevere una chiave, un token o uno snippet .env senza lasciare plaintext in Slack, email o GitHub.",
        },
        {
          question: "Qual è il passaggio sicuro più veloce per un token CI?",
          answer:
            "Crea un token strettamente scoped, consegnalo tramite una nota monouso cifrata lato client (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) o [Chrome](chrome:extension)), fai memorizzare dal destinatario nello store di secret CI o in un password manager, poi revoca il token quando il lavoro è finito.",
        },
      ],
    },
    {
      title: "Considerazioni finali",
      paragraphs: [
        "GitHub e CI/CD sono eccellenti nel preservare il lavoro. È esattamente per questo che sono posti scadenti per preservare i secret.",
        "Tieni i file `.env` locali, in gitignore e limitati allo sviluppo quando puoi. Metti le credenziali di automazione nei secret CI nativi, in un secret manager o in credenziali OIDC a breve durata. Quando una persona ha bisogno di un valore, usa una nota monouso cifrata lato client—poi ruota.",
        "Se il tuo team incolla ancora chiavi nelle PR o committa credenziali «solo staging», inizia con il [workflow di condivisione chiavi API](blog:how-to-share-api-key-securely) e la checklist sopra. Per materiale di accesso ai server, usa [come condividere chiavi SSH in modo sicuro](blog:how-to-share-ssh-keys-securely). Integra la [CLI](app:developers/cli), l’[estensione VS Code](app:developers/vscode) o l’[estensione Chrome](chrome:extension) nel percorso di minor resistenza così l’opzione sicura è anche quella veloce.",
      ],
    },
  ],
  ctaTitle: "Condividi il secret—non una copia permanente",
  ctaBody:
    "Cifra un token CI o uno snippet .env localmente con PrivateNote—usando web app, CLI, VS Code / Cursor o estensione Chrome—prima che arrivi in chat o Git. Usa una scadenza breve o burn-after-read, invia il link della nota monouso invece del plaintext e tieni la history di Git e delle pipeline libera da credenziali live.",
  ctaButton: "Crea una nota privata",
};
