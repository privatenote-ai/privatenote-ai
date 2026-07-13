import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideIt: PasswordManagersGuideCopy = {
  metaTitle: "Guida ai gestori di password",
  metaDescription:
    "Crea, conserva e condividi password in sicurezza. Confronta KeePass, Bitwarden, Apple e Google — più Passwords.lu e PrivateNote per la condivisione una tantum.",
  heroLabel: "Guida alla sicurezza",
  heroTitle: "Guida ai gestori di password",
  heroTagline: "Crea, conserva e condividi password in sicurezza",
  heroSubtitle:
    "Le password proteggono quasi ogni aspetto della vita digitale — eppure il riutilizzo e gli schemi deboli restano uno dei punti più vulnerabili nella cybersicurezza. Un gestore di password risolve il problema.",
  introLead:
    "Il problema non sono le password in sé. È il modo in cui le persone le usano. Molti riutilizzano ancora la stessa password su decine di siti o fanno solo piccole variazioni:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Se un sito subisce una violazione, gli attaccanti testano quelle credenziali ovunque — una tecnica chiamata credential stuffing, responsabile di milioni di account compromessi ogni anno. Un gestore di password genera una password diversa per ogni account. Devi ricordare solo una password principale forte.",
  essentialTitle: "Perché i gestori di password sono essenziali",
  essentialIntro: "Un buon gestore di password migliora drasticamente sia la sicurezza sia l'esperienza quotidiana online.",
  essentialBenefits: [
    "Generare password lunghe e casuali all'istante",
    "Conservare ogni password in una cassaforte crittografata",
    "Compilare automaticamente i moduli di accesso",
    "Rilevare password riutilizzate o deboli",
    "Ricevere avvisi quando le credenziali compaiono in violazioni note",
    "Sincronizzare le password su tutti i dispositivi",
    "Conservare passkey insieme alle password",
    "Condividere credenziali in sicurezza quando necessario",
  ],
  howItWorksTitle: "Come funzionano i gestori di password",
  howItWorksBody1:
    "Le credenziali vivono in una cassaforte crittografata. Quando la crei, scegli una password principale che deriva le chiavi di crittografia che proteggono tutto ciò che contiene.",
  cryptoLabel: "La crittografia moderna include tipicamente:",
  cryptoPoints: [
    "Crittografia AES-256",
    "Argon2id o PBKDF2 per la derivazione delle chiavi",
    "Crittografia autenticata per rilevare manomissioni",
  ],
  howItWorksBody2:
    "Poiché la cassaforte è crittografata prima dell'archiviazione o della sincronizzazione, i fornitori affidabili generalmente non possono leggere le tue password.",
  unlockedLabel: "Una volta sbloccato, il gestore può:",
  vaultFeatures: [
    "Compilare automaticamente nomi utente e password",
    "Generare password sicure",
    "Salvare le credenziali appena create",
    "Sincronizzare le modifiche tra i dispositivi",
    "Conservare note sicure e passkey",
  ],
  benefitsTitle: "Vantaggi dell'uso di un gestore di password",
  benefitBlocks: [
    {
      title: "Ogni account ottiene una password unica",
      body: "Se la password di Netflix viene rubata, non dovrebbe sbloccare anche email, conto bancario, account GitHub o archiviazione cloud. I gestori rendono le password uniche senza sforzo.",
    },
    {
      title: "Generazione di password forti",
      body: "Gli esseri umani sono scarsi nell'inventare password casuali. I gestori generano stringhe ad alta entropia come uQ8!kL#7P2@wXf9$rZm4 — estremamente difficili da indovinare o forzare con brute force.",
    },
    {
      title: "Accesso automatico",
      body: "I gestori riconoscono i siti web e compilano le credenziali automaticamente. I gestori affidabili compilano tipicamente solo sul dominio corretto, il che aiuta anche a proteggersi dal phishing.",
    },
    {
      title: "Report sulla salute delle password",
      body: "Molti gestori segnalano password riutilizzate, deboli, credenziali compromesse, MFA mancante e siti che supportano passkey — aiutandoti a migliorare la sicurezza nel tempo.",
    },
    {
      title: "Sincronizzazione sicura",
      body: "I gestori moderni sincronizzano la cassaforte crittografata su desktop, laptop, telefono e tablet così le password restano disponibili ovunque ti servano.",
    },
  ],
  passwordsLuPartnerLabel: "Strumento partner",
  passwordsLuTitle: "Generazione nel browser con Passwords.lu",
  passwordsLuBody:
    "A volte serve solo una password forte — non un flusso completo di cassaforte. Passwords.lu esegue la generazione direttamente nel browser. Le password non vengono caricate su server; nessun account richiesto.",
  passwordsLuWorkflow:
    "Flusso consigliato: genera su Passwords.lu, poi salva subito nel gestore di password.",
  passwordsLuCta: "Apri generatore di password",
  passwordsLuTools: [
    "Generatore di password forti",
    "Generatore di passphrase",
    "Generatore di PIN sicuro",
    "Verificatore di robustezza password",
    "Generatore di nomi utente",
    "Generatori di hash (Argon2id, bcrypt, scrypt e altro)",
    "Strumenti educativi sulla sicurezza",
  ],
  recommendedTitle: "Gestori di password consigliati",
  recommendedIntro:
    "Pensa a tre livelli: strumenti integrati nella piattaforma per stabilità, casseforti open source locali per controllo, e gestori cloud quando serve una sincronizzazione potente — accettando il rischio aggiuntivo lato server che comporta.",
  tiers: {
    platform: {
      title: "Gestori integrati nella piattaforma",
      subtitle: "Ingegneria solida, prodotti stabili — scelta predefinita migliore per la maggior parte",
      intro:
        "Apple e Google forniscono gestori di password con il sistema operativo. Sono supportati da grandi team di sicurezza, ricevono aggiornamenti continui e integrano passkey, compilazione automatica e avvisi di violazione con configurazione minima. Se vivi in un ecosistema, è spesso la scelta più fluida e affidabile.",
      strengthsLabel: "Punti di forza",
      tradeoffsLabel: "Compromessi",
      pros: [
        "UX curata con compilazione automatica a livello OS e supporto passkey",
        "Mantenuti da ingegneri di sicurezza di piattaforma su larga scala",
        "Nessun abbonamento separato per le funzioni principali",
        "Sincronizzazione stabile tramite iCloud o il tuo account Google",
      ],
      cons: [
        "Legati all'account Apple o Google e alle scelte di piattaforma",
        "Meno flessibili se mescoli liberamente Windows, Linux e mobile",
        "Il modello di fiducia dipende dalla sicurezza del tuo account cloud",
      ],
      managers: {
        apple: {
          verdict: "Ideale per iPhone, iPad, Mac e Vision Pro",
          description:
            "Integrato nelle piattaforme Apple con archiviazione sicura, generazione, avvisi di sicurezza, passkey e sincronizzazione iCloud Keychain — nessuna app aggiuntiva in una famiglia tutta Apple.",
          highlights: [
            "Integrazione OS profonda e supporto passkey",
            "Avvisi di sicurezza per violazioni note",
            "Ottima UX nell'ecosistema Apple",
          ],
          learnMore: "Scopri di più",
        },
        google: {
          verdict: "Ideale per Android e Chrome",
          description:
            "Integrato in Android e Chrome con generazione, compilazione automatica, Password Checkup, avvisi di violazione, passkey e sincronizzazione tramite il tuo account Google.",
          highlights: [
            "Scelta predefinita comoda sui dispositivi Android",
            "Password Checkup e avvisi di violazione",
            "Funziona ovunque usi Chrome",
          ],
          learnMore: "Scopri di più",
        },
      },
    },
    local: {
      title: "Casseforti open source locali",
      subtitle: "Controllo massimo — possiedi il file crittografato",
      intro:
        "KeePass archivia la cassaforte come database crittografato locale. Non serve un account cloud del fornitore: decidi dove vive il file e come si sincronizza. Il compromesso è l'UX — le interfacce possono sembrare datate rispetto ai gestori di piattaforma o cloud, e la sincronizzazione multi-dispositivo è fai-da-te salvo che aggiungi il tuo strato di archiviazione.",
      strengthsLabel: "Punti di forza",
      tradeoffsLabel: "Compromessi",
      pros: [
        "Open source e verificabile",
        "Nessun account cloud o abbonamento obbligatorio",
        "Offline-first; il file della cassaforte resta sotto il tuo controllo",
        "Ampio ecosistema di plugin (KeePassXC, port mobili, ecc.)",
      ],
      cons: [
        "Interfaccia e onboarding meno curati rispetto agli strumenti di piattaforma",
        "Sincronizzazione tra dispositivi manuale salvo configurazione",
        "Più lavoro di configurazione per famiglie o famiglie con dispositivi misti",
      ],
      managers: {
        keepass: {
          verdict: "Ideale per puristi della privacy e self-hoster",
          description:
            "Il modello open source originale: un file .kdbx crittografato che puoi archiviare su disco, USB, NAS o sincronizzare tramite il tuo cloud. KeePassXC è un fork multipiattaforma popolare con interfaccia più moderna.",
          highlights: [
            "Completamente gratuito — nessun vendor lock-in",
            "Scegli strategia di archiviazione e sincronizzazione",
            "Ideale quando il cloud è opzionale, non predefinito",
          ],
          learnMore: "Scopri di più",
        },
      },
    },
    cloud: {
      title: "Gestori di password cloud",
      subtitle: "Sincronizzazione e condivisione potenti — rischio lato server più alto",
      intro:
        "I gestori cloud dedicati come Bitwarden eccellono in sincronizzazione multipiattaforma, condivisione familiare e funzioni di team. Questa comodità porta un modello di minaccia diverso: la cassaforte crittografata (e talvolta i metadati) vive su server altrui. Una violazione o malfunzionamento del fornitore è il principale rischio residuo — per questo audit, open source e una password principale forte contano più che altrove.",
      strengthsLabel: "Punti di forza",
      tradeoffsLabel: "Compromessi",
      pros: [
        "Migliore sincronizzazione multi-dispositivo pronta all'uso",
        "Funzioni di condivisione familiare e organizzativa",
        "Funziona in modo coerente su Windows, macOS, Linux e mobile",
        "Opzioni open source (Bitwarden) con audit di sicurezza pubblici",
      ],
      cons: [
        "Superficie di attacco più ampia se il fornitore è compromesso",
        "I backup crittografati della cassaforte possono ancora essere decrittati offline con password principali deboli",
        "Devi fidarti dell'implementazione crittografica e delle operazioni del fornitore",
      ],
      managers: {
        bitwarden: {
          verdict: "Migliore opzione cloud per utenti multipiattaforma",
          description:
            "Software open source, sincronizzazione crittografata end-to-end, supporto passkey, audit indipendenti e un piano gratuito solido — la raccomandazione predefinita quando serve sync cloud fuori da Apple o Google.",
          highlights: [
            "Client open source verificati",
            "Ottimo piano gratuito e piani familiari",
            "Esperienza coerente su tutte le piattaforme principali",
          ],
          learnMore: "Scopri di più",
        },
        lastpass: {
          verdict: "Opzione legacy — preferisci Bitwarden per nuovi utenti",
          description:
            "Ha contribuito a popularizzare i gestori cloud, ma incidenti di alto profilo con backup crittografati rubati hanno spinto molti professionisti della sicurezza verso Bitwarden o KeePass locale per nuovi deployment.",
          highlights: [
            "Utilizzabile con password principale forte + MFA se già investito",
            "Valuta la migrazione se parti da zero",
          ],
          learnMore: "Scopri di più",
          caution: "Attenzione",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "La tua priorità",
    recommendation: "Raccomandazione",
  },
  comparisonRows: [
    { priority: "Vivere nell'ecosistema Apple", pick: "Apple Passwords" },
    { priority: "Android e Chrome ogni giorno", pick: "Google Password Manager" },
    { priority: "Massima privacy e controllo dei file", pick: "KeePass (cassaforte locale)" },
    { priority: "Sincronizzazione cloud multipiattaforma", pick: "Bitwarden" },
    { priority: "Utente LastPass esistente", pick: "Continua se rafforzato; valuta Bitwarden o KeePass" },
  ],
  sharingTitle: "Condividere password in sicurezza",
  sharingBody:
    "Anche le password forti a volte vanno condivise — con colleghi, famiglia, amministratori IT, appaltatori o clienti. Troppi le inviano ancora tramite piattaforme di messaggistica pensate per la chat, non per la consegna di segreti.",
  unsafeChannels: ["Email", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Usa PrivateNote invece",
  privateNoteSharingBody:
    "PrivateNote crittografa i segreti nel browser prima del caricamento. Il server conserva solo testo cifrato; la chiave di decrittazione viaggia separatamente nel link. Le note possono autodistruggersi dopo una lettura o scadere secondo un calendario.",
  privateNoteSharingItems: [
    "Password",
    "Chiavi API",
    "Credenziali Wi‑Fi",
    "Codici di recupero",
    "Accessi temporanei",
  ],
  privateNoteSharingCta: "Crea una nota sicura monouso",
  passwordProtectedTitle: "Protezione extra con note protette da password",
  passwordProtectedBody1:
    "Aggiungi una password opzionale a una PrivateNote. Il destinatario ha bisogno sia del link sia della password separata — idealmente consegnati su canali diversi (invia il link via email, condividi la password per telefono o di persona).",
  passwordProtectedBody2:
    "Anche se qualcuno intercetta il link, non può rivelare il segreto senza la password.",
  bestPracticesTitle: "Buone pratiche",
  bestPractices: [
    "Usa una password principale lunga e unica",
    "Abilita l'autenticazione a più fattori sul gestore di password",
    "Non riutilizzare mai password tra siti web",
    "Genera password con un gestore o Passwords.lu",
    "Salva ogni password nella cassaforte crittografata",
    "Abilita passkey quando disponibili",
    "Rivedi regolarmente i report sulla salute delle password",
    "Condividi password tramite PrivateNote invece di email o chat",
    "Per credenziali molto sensibili, usa la protezione password opzionale di PrivateNote e consegna la password separatamente",
  ],
  faqTitle: "Domande frequenti",
  faq: [
    {
      q: "I gestori di password sono sicuri?",
      a: "Sì. I gestori affidabili usano crittografia forte e standard del settore. Per quasi tutti, usare un gestore è significativamente più sicuro che memorizzare password o riutilizzare la stessa su più siti.",
    },
    {
      q: "Il fornitore del gestore può leggere le mie password?",
      a: "Per gestori moderni come KeePass, Bitwarden, Apple Passwords e Google Password Manager, la cassaforte è crittografata prima dell'archiviazione. Con una password principale forte, il fornitore generalmente non può leggere le credenziali archiviate.",
    },
    {
      q: "Cosa succede se dimentico la password principale?",
      a: "La maggior parte dei gestori non può recuperarla perché non la conosce mai. È deliberato. Alcuni servizi offrono opzioni di recupero o accesso di emergenza se configurati in anticipo.",
    },
    {
      q: "Dovrei usare l'archiviazione password del browser?",
      a: "I gestori integrati Apple e Google sono scelte solide e stabili nei loro ecosistemi — supportati da grandi team di sicurezza. KeePass va bene per il massimo controllo. Bitwarden quando serve sync cloud su piattaforme miste, accettando un rischio lato server più alto.",
    },
  ],
  finalTitle: "Raccomandazione finale",
  finalBody:
    "Nessun gestore è perfetto per tutti — ma usarne uno è tra i passi più efficaci. Abbinalo a Passwords.lu per generazione rapida e a PrivateNote quando devi condividere segreti in sicurezza.",
  finalBullets: [
    { label: "Apple & Google", text: "scelte stabili di piattaforma" },
    { label: "KeePass", text: "controllo locale, open source" },
    { label: "Bitwarden", text: "sync cloud per ogni dispositivo" },
    { label: "Passwords.lu", text: "generazione rapida nel browser" },
  ],
  finalCtaPrivateNote: "Condividi un segreto con PrivateNote",
  finalCtaPasswordsLu: "Visita passwords.lu",
  exploreOther: "Esplora altre guide",
  allResources: "Tutte le risorse",
  affiliateDisclaimer:
    "Solo guida educativa. Possiamo guadagnare una commissione tramite link di affiliazione quando usi i servizi consigliati, il che aiuta a sostenere questa risorsa gratuita sulla privacy.",
  otherGuides: [
    { id: "vpn", title: "Guida ai servizi VPN" },
    { id: "messenger", title: "Messaggistica sicura" },
    { id: "email", title: "Email sicura" },
    { id: "browser", title: "Browser per la privacy" },
  ],
};
