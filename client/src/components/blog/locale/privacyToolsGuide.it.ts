import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideIt: PrivacyToolsGuideArticleCopy = {
  intro: [
    "La maggior parte delle pagine sui «migliori strumenti per la privacy» sono cataloghi di affiliazione travestiti. Classificano ogni categoria, seppelliscono i trade-off e ti lasciano con venti tab e nessun sistema.",
    "Questa guida è diversa. È un **quadro decisionale 2026** per assemblare uno stack di privacy che si adatti alla vita reale: quale lavoro devi fare, quale default scegliere, quando fare upgrade e quando uno strumento ha proprio la forma sbagliata.",
    "PrivateNote.ai occupa uno slot stretto—**consegne di segreti monouso**. Tutto il resto sotto è opinione curata così puoi lasciare questa pagina con uno stack coerente, poi sfogliare la nostra [directory di strumenti per la privacy](app:privacy-tools) per il catalogo completo.",
  ],
  sections: [
    {
      title: "Inizia con un modello di minaccia (non una lista della spesa)",
      paragraphs: [
        "Gli strumenti per la privacy aiutano solo se corrispondono a ciò da cui ti difendi. Un freelancer che condivide le credenziali Wi‑Fi ha un problema diverso da un giornalista sotto sorveglianza mirata. Scegli lo stack più leggero che copra *i tuoi* rischi—poi smetti di collezionare strumenti per sport.",
      ],
      subsections: [
        {
          title: "Uso personale quotidiano",
          paragraphs: [
            "Vuoi meno tracking, meno disastri da riutilizzo delle password e segreti che non restano in chat. Non stai cercando di sparire dagli stati-nazione. Concentrati su un password manager, default sensati del browser, messaggistica crittografata per chat sensibili e link effimeri per credenziali una tantum.",
          ],
        },
        {
          title: "Freelancer o consulente",
          paragraphs: [
            "Consegni segreti a clienti che non condividono le tue app. Email e Slack diventano archivi permanenti di chiavi API e password temporanee. Aggiungi note crittografate monouso e trasferimento file crittografato; tieni le credenziali di lunga durata in un vault, non nei thread.",
          ],
        },
        {
          title: "Team piccolo",
          paragraphs: [
            "Serve accesso condiviso revocabile, regole chiare per i contractor e meno dipendenza da «mandalo nel canale». Preferisci la condivisione del password manager per l’accesso continuo, link monouso per consegne temporanee e norme scritte così la comodità non diventa silenziosamente policy.",
          ],
        },
      ],
      calloutTitle: "Regola empirica",
      callout:
        "Se uno strumento non mappa a un lavoro che fai davvero ogni settimana, saltalo. Uno stack minimo che usi batte uno stack purista che abbandoni.",
    },
    {
      title: "Job di privacy, non categorie di prodotto",
      paragraphs: [
        "Le categorie (VPN, browser, messenger) incoraggiano a collezionare loghi. I job forziano i trade-off alla luce. Usa questa mappa per orientarti; le sezioni sotto approfondiscono.",
      ],
      comparisonTable: {
        headers: ["Job", "Approccio di default", "Strumento sbagliato per il job"],
        rows: [
          [
            "Conservare password di lunga durata",
            "Password manager + generatore forte",
            "Solo password salvate nel browser, o archivi di chat",
          ],
          [
            "Consegnare un segreto monouso",
            "Nota crittografata nel browser e con scadenza",
            "Email, Slack, SMS o una cartella cloud «per ora»",
          ],
          [
            "Chat privata quotidiana",
            "Messenger con crittografia end-to-end",
            "SMS, o messaggi «che scompaiono» in app che comunque archiviano i metadati per sempre",
          ],
          [
            "Ridurre i tracker di navigazione",
            "Browser mainstream indurito + blocker",
            "Installare cinque estensioni privacy in conflitto",
          ],
          [
            "Reti non fidate",
            "VPN no-logs con reputazione comprovata",
            "Assumere che una VPN ti renda anonimo",
          ],
          [
            "Igiene contro il furto di account",
            "Controllo breach + 2FA / passkey",
            "Riutilizzare password e sperare",
          ],
        ],
        after: [
          "Per nomi di prodotto, note sui prezzi ed esclusioni, tieni aperta la [directory di strumenti per la privacy](app:privacy-tools) accanto a questa guida.",
        ],
      },
    },
    {
      title: "Job: password di lunga durata",
      paragraphs: [
        "Le password che riutilizzerai per mesi appartengono a un vault—non alla tua testa, non a un’app di note e non al thread Teams di ieri.",
      ],
      subsections: [
        {
          title: "Il problema",
          paragraphs: [
            "Il riutilizzo trasforma una breach in molte. Password deboli e memorabili falliscono al cracking offline. Gli store del browser aiutano, ma raramente eguagliano i manager dedicati per sync, condivisione e auditabilità.",
          ],
        },
        {
          title: "Default + alternativa",
          paragraphs: [
            "**Default:** [Bitwarden](https://bitwarden.com/) per la maggior parte—open source, free tier usabile, sync solido. **Alternativa:** [KeePassXC](https://keepassxc.org/) se vuoi un vault locale senza cloud. **Quando la rifinitura conta più dell’open source:** [1Password](https://1password.com/) è una scelta equa; sappi che stai scegliendo la comodità proprietaria.",
          ],
        },
        {
          title: "Quando non usare solo un manager",
          paragraphs: [
            "I manager eccellono nello *storage* e nell’accesso condiviso continuo. Sono goffi quando il destinatario non ha un account, o quando il segreto deve morire dopo una lettura. Quello è un job diverso—vedi i segreti monouso sotto. Genera valori forti con un [generatore di password](app:password-generator) locale prima di memorizzarli o condividerli.",
          ],
        },
      ],
    },
    {
      title: "Job: segreti monouso",
      paragraphs: [
        "Password per contractor, codici di recupero, chiavi API, Wi‑Fi per un visitatore—tutto ciò che non dovrebbe diventare cronologia ricercabile.",
      ],
      subsections: [
        {
          title: "Il problema",
          paragraphs: [
            "Email e chat crittografano in transito, poi archiviano per sempre. Le cartelle cloud restano. Screenshot e backup dei dispositivi ampliano il raggio. Il failure mode non è «qualcuno sniffa il filo»—è «il segreto c’è ancora tra sei mesi».",
          ],
        },
        {
          title: "Default",
          paragraphs: [
            "**Default:** una nota crittografata nel browser e con scadenza come [PrivateNote.ai](app:home)—ciphertext sul server, materiale di decrittazione nel fragment del link, burn-after-reading o TTL breve. Per il modello, vedi [come funziona PrivateNote](app:how-it-works) e [perché l’email è il peggior posto per i segreti](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Quando non usarlo",
          paragraphs: [
            "Non sostituire il password manager né il messenger quotidiano con note monouso. Non mettere documenti di lunga durata o conversazioni in corso in link effimeri. E non inviare il link e una passphrase opzionale sullo stesso canale se il segreto è ad alto rischio—separa i canali.",
          ],
        },
      ],
      midCta: {
        body: "Devi consegnare una password o una chiave API ora? Crittografala nel browser e invia un link che può scadere dopo la lettura.",
        button: "Crea una nota privata",
        href: "app:home",
      },
    },
    {
      title: "Job: messaggistica quotidiana",
      paragraphs: [
        "Le conversazioni sensibili hanno bisogno di crittografia end-to-end di default—non di un toggle sepolto nelle impostazioni, né della promessa che i messaggi «che scompaiono» cancellino copie lato server che non puoi verificare.",
      ],
      subsections: [
        {
          title: "Default + trade-off",
          paragraphs: [
            "**Default:** [Signal](https://signal.org/) per la chat sicura mainstream. **Trade-off da dire ad alta voce:** la registrazione richiede un numero di telefono, che alcuni modelli di minaccia ad alta anonimità rifiutano. Per quei casi, guarda oltre questa guida di avvio—e tratta comunque i metadati (chi parla con chi) come rischio residuo su ogni messenger.",
          ],
        },
        {
          title: "Quando non usare la chat per i segreti",
          paragraphs: [
            "Anche i messenger crittografati tengono la cronologia sui dispositivi. Incolla una password di produzione in un thread e hai creato una copia durevole. Usa la chat per conversare; usa le note monouso per le credenziali. Altro su quel pattern: [segreti che non dovresti mai inviare in chat](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Job: email e separazione dell’identità",
      paragraphs: [
        "L’email è un sistema di indirizzamento pubblico con speranze private. Tratta la crittografia della casella e l’aliasing come contenimento dei danni, non come invisibilità magica.",
      ],
      subsections: [
        {
          title: "Default",
          paragraphs: [
            "**Default casella crittografata:** [Proton Mail](https://proton.me/) o [Tuta](https://tuta.com/) quando vuoi mail zero-access per corrispondenza sensibile. **Default aliasing:** [Firefox Relay](https://relay.firefox.com/) per mascheramento leggero, o [SimpleLogin](https://simplelogin.io/) quando ti servono domini personalizzati e una separazione dell’identità più netta.",
          ],
        },
        {
          title: "Quando non affidarsi all’email",
          paragraphs: [
            "L’email crittografata lascia comunque header, abitudini di inoltro e retention lunga. Non mettere mai credenziali attive nel body «solo questa volta». Se il payload è una consegna di segreto, usa una nota monouso e metti solo il contesto nell’email.",
          ],
        },
      ],
    },
    {
      title: "Job: navigare con meno tracking",
      paragraphs: [
        "Nel 2026, la lotta riguarda meno la «modalità segreta» e più fingerprinting, tracking cross-site ed estensioni che promettono privacy aggiungendo superficie di attacco.",
      ],
      subsections: [
        {
          title: "Stack di default",
          paragraphs: [
            "**Default:** [Firefox](https://www.mozilla.org/) con protezione rigorosa dal tracking più [uBlock Origin](https://ublockorigin.com/). **Alternativa a forma Chromium:** [Brave](https://brave.com/) se ti serve compatibilità delle estensioni—sappi che la community è divisa sulla sua superficie rewards/crypto. **Ricerca:** [DuckDuckGo](https://duckduckgo.com/) (o ricerca simile non profilante) così le tue query non sono un feed di profilo pubblicitario.",
          ],
        },
        {
          title: "Quando Tor è l’upgrade giusto",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) è lo standard per maggiore anonimato e resistenza alla censura. È anche più lento e pieno di CAPTCHA. Usalo quando il modello di minaccia lo richiede—non come browser bancario quotidiano.",
          ],
        },
      ],
    },
    {
      title: "Job: reti non fidate (reality check VPN)",
      paragraphs: [
        "Una VPN cifra il percorso tra te e il provider VPN. Nasconde il tuo IP ai siti che visiti. **Non** ti rende anonimo, non cifra i log della destinazione e non sistema una password debole.",
      ],
      subsections: [
        {
          title: "Default che siamo disposti a nominare",
          paragraphs: [
            "Preferisci provider con track record pubblico, storia di giurisdizione chiara e claim no-logs auditati—comunemente [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) o [IVPN](https://www.ivpn.net/). Paga per il prodotto; i modelli di business delle VPN gratuite spesso sono il prodotto.",
          ],
        },
        {
          title: "Quando non preoccuparsene",
          paragraphs: [
            "Su una rete di cui ti fidi già, con HTTPS ovunque, una VPN è igiene opzionale—non un dovere morale. Evita brand dubbi «military-grade» e tutto ciò che guida con codici influencer invece che dettaglio di engineering. Le note di esclusione della nostra directory coprono i pick «privacy-washed» comuni.",
          ],
        },
      ],
    },
    {
      title: "Job: breach, 2FA e passkey",
      paragraphs: [
        "L’igiene degli account è la metà poco glam della privacy. La maggior parte dei disastri personali è credential stuffing e fallimenti vicini al SIM-swap, non malware esotico.",
      ],
      subsections: [
        {
          title: "Default pratici",
          paragraphs: [
            "Controlla gli indirizzi su [Have I Been Pwned](https://haveibeenpwned.com/). Attiva fattori resistenti al phishing dove puoi—passkey o chiavi hardware come [YubiKey](https://www.yubico.com/) battono l’OTP SMS. Usa la [2FA Directory](https://2fa.directory/) per vedere quali servizi trattano ancora il secondo fattore come teatro opzionale.",
          ],
        },
        {
          title: "Nota 2026 sul passwordless",
          paragraphs: [
            "Le passkey riducono phishing e riutilizzo delle password, ma recovery e lock-in cross-ecosistema sono reali. Tieni una storia di recovery (chiave hardware, processo documentato) prima di cancellare ogni password. I password manager restano utili per la lunga coda di siti che non hanno ancora recuperato.",
          ],
        },
      ],
    },
    {
      title: "Cosa è cambiato nel 2026 (commento da tenere)",
      bullets: [
        "**La chat AI è un nuovo archivio.** Incollare segreti negli assistenti crea domande di retention e rischio di training che il tuo modello di minaccia del 2019 non includeva. Tratta i prompt come body delle email.",
        "**Il fingerprinting ha superato i banner cookie.** Bloccare i cookie di terze parti aiuta; scelta del browser, blocco dei tracker e meno estensioni contano ancora di più che accettare ogni toggle di «interesse legittimo».",
        "**Le passkey stanno diventando mainstream.** Preferiscile sugli account ad alto valore; non fingere che ogni sito le supporti già.",
        "**Il marketing VPN è diventato più rumoroso, non più saggio.** Teatro di giurisdizione e leaderboard di affiliazione non sono audit. Scegli provider noiosi e documentati—o nessuno.",
        "**La condivisione effimera è ancora di nicchia—e ancora necessaria.** Le app di collaborazione ottimizzate per la ricerca rendono gli strumenti per segreti monouso più preziosi, non meno.",
      ],
    },
    {
      title: "Kit di partenza minimo (la maggior parte delle persone)",
      paragraphs: [
        "Se fai solo sette cose, fai queste. Tutto il resto è profondità opzionale.",
      ],
      useCaseTable: {
        headers: ["Slot", "Scelta"],
        rows: [
          ["Vault password", "Bitwarden (o KeePassXC se rifiuti il cloud)"],
          ["Creazione password", "Generatore locale—poi memorizza nel vault"],
          ["Segreti monouso", "PrivateNote.ai (o nota equivalente crittografata nel browser)"],
          ["Chat privata", "Signal"],
          ["Browser + blocker", "Firefox + uBlock Origin"],
          ["Igiene breach / 2FA", "Have I Been Pwned + passkey o 2FA app/hardware"],
          ["Viaggi / Wi‑Fi del bar", "Mullvad, Proton VPN o IVPN—quando la rete è il rischio"],
        ],
      },
      callout:
        "Gli add-on avanzati (Tor quotidiano, ritualismo full-disk, reti di email anonime) sono validi—ma solo dopo che il kit di partenza è diventato abitudine.",
    },
    {
      title: "Cosa escludiamo—e perché",
      paragraphs: [
        "Curare è soprattutto dire di no. Alcuni pattern che rifiutiamo di ammorbidire:",
      ],
      subsections: [
        {
          title: "VPN teatro della privacy",
          paragraphs: [
            "Free tier finanziati da pratiche dati vaghe, badge «audit» falsi e SEO da leaderboard. Se il pitch è paura più un codice sconto, vattene.",
          ],
        },
        {
          title: "Messenger che commercializzano la crittografia in modo selettivo",
          paragraphs: [
            "Cloud di default, E2EE opzionale o modalità «chat segreta» che addestrano gli utenti a incollare segreti nel default non sicuro. Preferiamo raccomandare un default onesto piuttosto che cinque modalità che la gente usa male. Cloud stile Telegram e le realtà di metadati/backup di WhatsApp sono segnalate nelle nostre [esclusioni della directory](app:privacy-tools).",
          ],
        },
        {
          title: "Qualsiasi cosa che debba comprare la nostra raccomandazione",
          paragraphs: [
            "Questa guida e la directory non sono una lista di affiliazione. Non guadagniamo nulla se clicchi. Questo non ci rende onniscienti—significa che gli incentivi non stanno guidando silenziosamente la shortlist.",
          ],
        },
      ],
    },
    {
      title: "Dove andare dopo",
      paragraphs: [
        "Usa questo articolo come strato decisionale. Usa la directory come catalogo vivo—categorie, sfumature e link che teniamo revisionati.",
      ],
      bullets: [
        "[Directory di strumenti per la privacy](app:privacy-tools) — catalogo curato per categoria",
        "[Come condividere una password in modo sicuro](blog:how-to-share-a-password-securely) — playbook di consegna",
        "[Inviare un segreto senza account](blog:send-secret-message-without-account) — nessuna app condivisa richiesta",
        "[Risorse di sicurezza](app:security-resources) — letture più ampie su PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — contesto di policy e diritti",
        "[Privacy Guides](https://www.privacyguides.org/) — raccomandazioni più profonde mantenute dalla community",
      ],
      midCta: {
        body: "Pronto a sfogliare la shortlist completa con note di categoria ed esclusioni?",
        button: "Apri la directory di strumenti per la privacy",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "È la stessa cosa della vostra directory di strumenti per la privacy?",
          answer:
            "No. Questo post è la guida 2026 su come scegliere. La [directory](app:privacy-tools) è il catalogo curato. Leggi la guida per decidere; usa la directory per scegliere strumenti concreti.",
        },
        {
          question: "Posso inseguire il ranking di ogni categoria di privacy?",
          answer:
            "Puoi, ma non ci resterai. Un kit di partenza a sette slot che usi davvero batte un santuario di trenta strumenti che configuri una volta.",
        },
        {
          question: "Dove si inserisce PrivateNote.ai?",
          answer:
            "Solo nel job dei segreti monouso—credenziali e istruzioni che devono scadere. Non è un password manager, un messenger o una VPN.",
        },
        {
          question: "Mi serve una VPN ogni giorno?",
          answer:
            "Di solito no. Usane una su reti non fidate o quando devi nascondere specificamente il tuo IP a una destinazione. Non è un sostituto di HTTPS, buone password o messenger crittografati.",
        },
        {
          question: "Open source o proprietario rifinito?",
          answer:
            "Preferisci open source quando il rischio è alto e puoi vivere con la UX. Gli strumenti proprietari possono essere razionali quando l’usabilità decide se la tua famiglia adotta un vault—nomina il trade-off esplicitamente, come facciamo con 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Costruisci lo stack, poi condividi i segreti correttamente",
  ctaBody:
    "Quando il job è una consegna temporanea, salta l’archivio della chat. Crea una nota crittografata nel browser, invia il link e lascialo scadere quando il momento è passato.",
  ctaButton: "Crea una nota privata",
  ctaSecondaryLabel: "Sfoglia la directory di strumenti per la privacy",
  ctaSecondaryHref: "app:privacy-tools",
};
