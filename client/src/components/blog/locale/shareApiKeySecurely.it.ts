import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyIt: ShareApiKeyArticleCopy = {
  heroAlt: "Due laptop che scambiano una chiave API tramite un link monouso cifrato PrivateNote",
  heroCaption: "Illustrazione generata per PrivateNote.ai.",
  takeawaysHeading: "Punti chiave",
  takeaways: [
    "Non incollare mai chiavi API in email, chat, ticket, documenti o Git.",
    "Chiave più ristretta: least privilege, vita breve, poi rotazione.",
    "Invia i segreti con un link monouso cifrato nel browser.",
    "Per chiavi ad alto rischio, cifra prima in locale; condividi solo il ciphertext.",
    "Controlla usi insoliti—PrivateNote è consegna, non un vault.",
  ],
  intro:
    "Prima o poi ogni sviluppatore deve inviare una chiave API a qualcun altro: per l’accesso a staging, un contractor, un’integrazione webhook o un passaggio di consegne a un cliente. Il percorso più veloce è spesso anche quello che lascia la traccia più lunga.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord o altra cronologia chat",
    "E-mail, SMS o thread inoltrati",
    "Jira, Trello, Notion, Confluence o issue GitHub",
    "Documenti di testo semplice, fogli di calcolo e cartelle cloud condivise",
    "Commit Git, pull request e commenti nel codice",
  ],
  leakSources: [
    {
      title: "E-mail",
      body: "L’e-mail crea copie di lunga durata. Una chiave può sopravvivere in caselle di posta, archivi, backup, sincronizzazione mobile, thread inoltrati e indici di ricerca molto dopo la fine dell’attività.",
    },
    {
      title: "Chat di team",
      body: "Slack e Teams conservano il contesto, ed è proprio questo a renderli rischiosi per i segreti. Una chiave incollata può diventare ricercabile da futuri membri del workspace o trapelare tramite un dispositivo compromesso.",
    },
    {
      title: "Strumenti di progetto",
      body: "Jira, Notion, Confluence, Trello e GitHub Issues non sono vault di credenziali. I ticket eliminati possono ancora esistere in export, backup, audit trail e ricerche assistite dall’IA.",
    },
    {
      title: "Repository Git",
      body: "La cronologia Git è ostinata. Rimuovere una chiave in un commit successivo non cancella i commit precedenti. I repository pubblici vengono scansionati continuamente e credenziali cloud esposte possono essere abusate in pochi minuti.",
    },
  ],
  prepSteps: [
    {
      title: "Usa lo scope più piccolo possibile",
      body: "Evita chiavi primarie di produzione. Preferisci chiavi di staging, permessi in sola lettura, restrizioni IP, token di breve durata e credenziali specifiche per integrazione.",
    },
    {
      title: "Pianifica rotazione o revoca",
      body: "Tratta le chiavi API condivise come temporanee. Revocale quando onboarding, test, collaborazione con un contractor o passaggio a un cliente sono conclusi.",
    },
    {
      title: "Monitora i pattern d’uso",
      body: "Località inattese, picchi improvvisi di richieste, nuovi endpoint o attività di fatturazione insolite sono spesso i primi segnali che una chiave è uscita dal perimetro.",
    },
    {
      title: "Consegna con un link cifrato monouso",
      body: "Cifra la chiave localmente prima che entri in qualsiasi canale di comunicazione. Invia un link di breve durata invece di lasciare il segreto in chiaro nella cronologia permanente di chat o e-mail.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Limita lo scope", detail: "Solo permessi minimi" },
    { key: "encrypt", label: "Cifra localmente", detail: "La chiave non lascia il browser" },
    { key: "send", label: "Invia il link", detail: "Non il segreto in chiaro" },
    { key: "revoke", label: "Revoca alla fine", detail: "Ruota dopo la consegna" },
  ],
  faqs: [
    {
      question: "Perché non usare semplicemente una variabile d’ambiente?",
      answer:
        "Le variabili d’ambiente sono utili per eseguire software localmente. Non risolvono il problema del trasporto quando devi consegnare quel valore a un collega, contractor, cliente o partner di integrazione.",
    },
    {
      question: "Le chiavi API dovrebbero sempre scadere?",
      answer:
        "Quando il provider lo supporta, sì. Credenziali di breve durata riducono la finestra di abuso dopo un’esposizione accidentale e rendono la rotazione parte del flusso normale.",
    },
    {
      question: "Qual è il flusso più sicuro?",
      answer:
        "Crea una chiave con scope ristretto, inviala tramite un link monouso cifrato nel browser, condividi l’eventuale password opzionale su un canale separato, poi ruota o revoca la chiave quando l’attività è finita. Per chiavi ad alto rischio o di lunga durata, cifra prima localmente con age o OpenSSL e carica solo testo cifrato.",
    },
    {
      question: "PrivateNote è un secrets manager?",
      answer:
        "No. PrivateNote risolve la consegna sicura da persona a persona. Per l’archiviazione machine-to-machine dei segreti, usa HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager o Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Tratta le chiavi API come password di produzione",
      paragraphs: [
        "Una chiave API è di fatto una password per software. A seconda dei permessi, una chiave trapelata può esporre dati dei clienti, consumare risorse a pagamento, distribuire infrastruttura cloud, inviare e-mail dal tuo dominio verificato o far salire una fattura IA.",
        "A differenza delle password umane, le chiavi API spesso restano valide per mesi, vivono dentro file di configurazione e bypassano del tutto l’autenticazione a più fattori. Se una chiave trapela, un attaccante può operare come la tua applicazione, e il traffico malevolo può confondersi con il normale uso di produzione finché i costi esplodono o i dati sono già esposti.",
      ],
    },
    neverPaste: {
      title: "Non incollare mai chiavi API in sistemi permanenti",
      intro:
        "Questi canali sono comodi perché conservano la cronologia. È esattamente per questo che sono il posto sbagliato per i segreti.",
      avoidHeading: "Evita questi canali",
    },
    whereLeak: {
      title: "Dove trapelano davvero le chiavi API",
      intro:
        "La maggior parte delle fughe non nasce da sofisticate rotture crittografiche. Avviene quando qualcuno copia un segreto in un sistema costruito per conservare record.",
    },
    beforeShare: {
      title: "Prima di condividere",
      intro:
        "Riduci prima il raggio d’impatto. Il modo in cui consegni la chiave conta, ma una chiave con scope ristretto limita i danni se qualcosa va comunque storto.",
      newKeyTitle: "Stai creando una nuova chiave?",
      newKeyBefore: "Genera credenziali ad alta entropia localmente nel browser: il",
      newKeyLink: "generatore di chiavi API",
      newKeyAfter: "su passwords.lu funziona lato client; non viene caricato nulla.",
    },
    highRisk: {
      title: "Chiavi ad alto rischio: cifra prima localmente",
      p1: "La maggior parte delle chiavi API è sostituibile: token di staging, segreti di integrazione di breve durata e credenziali con scope ristretto che prevedi di ruotare. Per queste, la consegna monouso cifrata nel browser di solito è sufficiente.",
      p2: "Alcune chiavi hanno un peso maggiore: accesso admin di produzione, chiavi di firma, credenziali cloud root o qualsiasi segreto di lunga durata che sarebbe doloroso o impossibile revocare pulitamente. Trattale come segreti master: **cifra localmente prima di qualsiasi upload web**, poi invia il testo cifrato tramite PrivateNote.",
      calloutHeading: "Prima cifratura locale",
      ageBullet:
        "**age** — impostazioni predefinite semplici per cifrare file (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — CLI affidabile se conosci già i flag",
      separateChannelBullet:
        "Carica il file cifrato con PrivateNote; invia la passphrase di decifratura su un **canale separato** (Signal, telefono, di persona)",
      outro:
        "Lo stesso flusso si applica alle seed phrase di criptovalute e ad altri segreti master insostituibili. Leggi [seed phrase crypto e link monouso](blog:crypto-seed-phrase-one-time-link) per la guida completa age/OpenSSL, consigli sulle passphrase e quando i link monouso sono, o non sono, lo strumento giusto.",
    },
    handoff: {
      title: "Un flusso di consegna più sicuro",
      intro: "Quando una persona ha bisogno della chiave, non quando un’app la recupera a runtime, segui questa sequenza.",
      diagramCaption: "Consegna più sicura in sintesi",
      diagramFootnote: "Condividi l’eventuale password della nota su un canale separato, mai nello stesso messaggio del link.",
    },
    privateNote: {
      title: "Come PrivateNote si inserisce nella consegna",
      p1: "PrivateNote è pensato per il momento da persona a persona: chiavi API, chiavi private SSH, credenziali database, codici di recupero, segreti di firma webhook e password temporanee che devono raggiungere una persona senza diventare un record permanente.",
      relatedSsh:
        "Se il segreto è una chiave SSH invece di una credenziale API, vedi [come condividere chiavi SSH in modo sicuro](blog:how-to-share-ssh-keys-securely) su chiavi pubbliche vs private, deploy key ed estensioni dell’editor.",
      p2: "Il segreto viene cifrato nel browser prima dell’invio. PrivateNote conserva testo cifrato, non testo in chiaro. La chiave di decifratura vive nel frammento dell’URL, la parte dopo `#`, che i browser non inviano al server quando caricano la pagina. È il modello del [link monouso](blog:one-time-secret-links) applicato alle credenziali API.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "Il server riceve l’ID della nota e il payload cifrato.",
      bullet2: "Il server non riceve la chiave di decifratura.",
      bullet3: "Lettura unica e scadenza limitano per quanto tempo la nota cifrata esiste.",
      p3: "PrivateNote completa i secret store dedicati: chiude il vuoto quando devi inviare una chiave Stripe a un partner di integrazione, condividere una chiave OpenAI temporanea con un contractor o dare a un collega accesso monouso a una credenziale di staging.",
    },
    faq: { title: "Domande frequenti" },
    bottomLine: {
      title: "In sintesi",
      body: "La maggior parte delle fughe di chiavi API non avviene perché la crittografia ha fallito. Avviene perché qualcuno ha copiato un segreto in un sistema permanente e ricercabile per comodità. Limita strettamente lo scope delle chiavi, condividile solo quando necessario ed evita di lasciare una traccia in chiaro in chat, ticket, e-mail o Git.",
    },
  },
  ctaTitle: "Condividi una chiave API senza lasciarla in chat",
  ctaBody: "Crea un link PrivateNote cifrato nel browser e a lettura unica. Non serve account per le note monouso.",
  ctaButton: "Crea una PrivateNote ->",
};
