import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativeIt: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternativa a Privnote",
  eyebrow: "Alternativa a Privnote",
  heroTitleLine1: "Un’alternativa privata a Privnote",
  heroTitleLine2: "per note, password e file",
  heroBody:
    "PrivateNote mantiene la semplicità di una nota che scompare e aggiunge la condivisione di file cifrati, la protezione con password, i controlli per il destinatario e gli strumenti per consegnare informazioni sensibili.",
  primaryCta: "Crea una nota privata",
  secondaryCta: "Come funziona",
  trustLine: "Nessun account per le note di testo · Cifratura nel browser · Lettura unica",

  introHeading: "Se conosci già Privnote",
  introBody:
    "Se cerchi un’alternativa a Privnote, PrivateNote segue la stessa idea: crea un link privato, condividilo e fai scadere o scomparire il contenuto dopo l’apertura. La cifratura avviene nel browser prima di qualsiasi caricamento. Chi riceve apre il link e decifra in locale. Non serve un account.",
  introBody2:
    "PrivateNote estende quel flusso oltre un breve messaggio di testo. Puoi condividere password, documenti, foto, registrazioni vocali o video e altri file nella stessa consegna cifrata, con controlli extra quando la situazione lo richiede.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Entrambi i servizi sono pensati per la condivisione temporanea. PrivateNote estende l’idea a file, media, controlli del destinatario e flussi aziendali.",
  compareFeatureColumn: "Funzione",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Sì",
  compareNo: "Non previsto",
  comparePaid: "Starter e Business",
  compareRows: [
    { feature: "Note autodistruttive", privnote: "yes", privatenote: "yes" },
    { feature: "Nessun account richiesto al destinatario", privnote: "yes", privatenote: "yes" },
    { feature: "Protezione con password", privnote: "yes", privatenote: "yes" },
    { feature: "Allegati cifrati", privnote: "no", privatenote: "yes" },
    { feature: "Più file in un unico link", privnote: "no", privatenote: "yes" },
    { feature: "Foto, audio e video", privnote: "no", privatenote: "yes" },
    { feature: "Notifiche di apertura e distruzione", privnote: "yes", privatenote: "yes" },
    { feature: "Verifica del destinatario", privnote: "no", privatenote: "paid" },
    { feature: "Rivelazione programmata", privnote: "no", privatenote: "paid" },
    {
      feature: "Brand sulla pagina di apertura",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Strumenti per sviluppatori (CLI, MCP, estensioni)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Le funzioni possono cambiare. Confronto basato sulle informazioni prodotto pubbliche a settembre 2026.",
  compareCta: "Prova PrivateNote",

  whyHeading: "Perché cercare un’alternativa a Privnote?",
  whyBody:
    "Privnote funziona bene quando il requisito è semplice: inviare una nota di testo temporanea. Il testo temporaneo è solo uno dei modi in cui viaggiano le informazioni sensibili.",
  whyBody2:
    "Potresti dover inviare un PDF, condividere più file, confermare che un link è stato aperto, proteggere l’accesso con una password o consegnare documenti riservati senza lasciarli nella posta ordinaria.",
  whyClose:
    "È il problema che PrivateNote è pensato per affrontare: una consegna sicura, non solo un messaggio che scompare.",

  passwordHeading: "Un’alternativa a Privnote per condividere password",
  passwordBody:
    "Password Wi-Fi, chiavi API e codici di recupero viaggiano spesso nella stessa email o chat che spiega a che servono. Questo può lasciare copie nella cronologia, sui dispositivi sincronizzati e nei backup.",
  passwordBody2:
    "PrivateNote mette la credenziale dietro un link cifrato separato. Invii il contesto sul canale che usi già, e il segreto in una nota temporanea che può scadere, autodistruggersi dopo la lettura e, se vuoi, richiedere una password. È una consegna, non un gestore di password.",
  passwordCta: "Condividi una password in modo sicuro",
  passwordArticleLink: "Come condividere una password in modo sicuro",

  filesHeading: "Invia file, non solo testo",
  filesBody:
    "Contratti, documenti di identità, PDF finanziari, file di configurazione, foto e archivi sono spesso il contenuto reale. Una nota di testo che scompare non può portarli. PrivateNote tiene la nota e i suoi allegati cifrati nella stessa consegna sicura, così messaggio e file viaggiano insieme.",
  filesBody2:
    "L’invio di file richiede un account PrivateNote gratuito, per applicare i limiti di archiviazione e di trasferimento. Chi riceve apre comunque il link senza accedere. Dopo la prima apertura, gli allegati restano disponibili per una finestra limitata, non come una cartella condivisa permanente.",
  filesLimits:
    "Limiti attuali: Free fino a {freeSize} per file e {freeCount} file per trasferimento ({freeTransfers} trasferimenti al mese). Starter fino a {starterSize} e {starterCount} file. Business fino a {businessSize} e {businessCount} file.",
  filesCta: "Invia un file cifrato",
  filesArticleLink: "Invia documenti sensibili in modo sicuro",

  mediaHeading: "Condividi foto, audio e video sensibili",
  mediaBody:
    "Alcune informazioni non partono mai come un file sul disco. Potresti fotografare un documento, registrare un breve messaggio vocale o allegare una foto esistente senza passarla prima da un’altra app di messaggistica.",
  mediaBody2:
    "PrivateNote può scattare una foto, registrare audio o video, o allegare un media esistente. L’acquisizione avviene nel browser; poi si applica la stessa cifratura lato client usata per i file, prima del caricamento.",
  mediaPhotoLink: "Come condividere foto in modo sicuro",
  mediaVoiceLink: "Messaggi vocali cifrati",

  businessHeading: "Quando una nota che scompare diventa un flusso aziendale",
  businessBody:
    "Lo stesso link privato è utile quando chi invia è un commercialista, un amministratore IT, un consulente o uno studio che consegna file riservati a un cliente. Il bisogno non è solo il segreto. È conferma, controllo e una consegna professionale.",
  businessScenarios: [
    "Un commercialista invia cifre riservate a un cliente.",
    "Un amministratore IT invia credenziali a un dipendente.",
    "Uno studio invia documenti di identità o finanziari a un cliente.",
    "Un consulente trasferisce file di progetto che non dovrebbero restare in email.",
    "Un’azienda ha bisogno di sapere che si è acceduto a informazioni sensibili.",
  ],
  businessBody2:
    "Starter e Business aggiungono verifica del destinatario, rivelazione programmata, prova di accesso, finestre di accesso più lunghe, revoca delle note non aperte e il monitoraggio delle note inviate. Business aggiunge pagine di apertura con il tuo brand, accesso ai file in sola lettura e trasferimenti più grandi. La cifratura resta nel browser su ogni piano.",
  businessCta: "Scopri PrivateNote Business",
  businessNotifyLink: "Sapere quando è stato aperto un link segreto",
  businessVerifyLink: "Verifica del destinatario",

  securityHeading: "Come PrivateNote protegge i tuoi contenuti",
  securityBody:
    "I contenuti sensibili vengono cifrati nel browser prima del caricamento. L’infrastruttura di PrivateNote memorizza testo cifrato, non la nota o il file in chiaro.",
  securityArchitecture:
    "Per una nota standard, il browser genera una chiave di cifratura casuale a 256 bit e usa la cifratura autenticata AES-256-GCM. La chiave di decifratura viaggia nel fragment dell’URL — la parte dopo #. I browser non includono il fragment nelle richieste HTTP normali, quindi il server non riceve la chiave come parte dell’URL della richiesta.",
  securityRecipient:
    "Il browser del destinatario usa la chiave del link condiviso per decifrare il contenuto in locale.",
  securityLimitation:
    "Chi in seguito ha il link completo può comunque copiare o fare uno screenshot di ciò che vede. PrivateNote controlla la consegna, non ciò che il destinatario fa dopo l’apertura.",
  securityFlowWrite: "Scrivi / allega",
  securityFlowEncrypt: "Cifra nel browser",
  securityFlowCiphertext: "Carica il testo cifrato",
  securityFlowShare: "Condividi il link privato",
  securityFlowDecrypt: "Il destinatario decifra",
  securityEncryptionLink: "Come funziona la cifratura di PrivateNote",
  securityHowItWorksLink: "Come funziona nel dettaglio",
  founderHeading: "Progettato con la crittografia in mente",
  founderBody:
    "PrivateNote è sviluppato da Marjan Skrobot, ricercatore in crittografia e sicurezza delle informazioni. Il modello di sicurezza e i suoi limiti sono documentati pubblicamente, incluso ciò contro cui PrivateNote può — e non può — proteggere.",
  founderLink: "Il modello di sicurezza",

  decideHeading: "Quale dovresti usare?",
  decidePrivnoteTitle: "Privnote può bastare se…",
  decidePrivnoteItems: [
    "Devi solo inviare una nota di testo temporanea.",
    "Vuoi il flusso più semplice possibile.",
    "Non ti servono allegati né controlli di consegna aggiuntivi.",
  ],
  decidePrivateNoteTitle: "PrivateNote può adattarsi meglio se…",
  decidePrivateNoteItems: [
    "Vuoi una cifratura lato client documentata.",
    "Devi condividere file o media oltre al testo.",
    "Ti serve la verifica del destinatario o la rivelazione programmata.",
    "Vuoi notifiche di accesso o una prova di accesso.",
    "Ti serve un brand professionale o controlli di consegna per il lavoro.",
  ],
  decideOneTimeLink: "Come funzionano i link segreti monouso",
  decideDevelopersLink: "Integrazioni per sviluppatori",

  faqHeading: "Domande frequenti",
  faqs: [
    {
      question: "Quali sono alcune alternative a Privnote?",
      answer:
        "Diversi servizi offrono la condivisione temporanea o cifrata di note. PrivateNote è pensato per chi vuole il flusso di una nota che scompare, ma ha anche bisogno di file cifrati, media, controlli del destinatario o funzioni di consegna professionale.",
    },
    {
      question: "In che cosa PrivateNote differisce da Privnote?",
      answer:
        "Entrambi creano un link privato temporaneo che il destinatario può aprire senza account. PrivateNote aggiunge allegati cifrati, cattura di foto e audio nel browser, protezione opzionale con password nello stesso flusso, e controlli a pagamento come la verifica del destinatario e le pagine di apertura con il tuo brand. Privnote si concentra sulle note di testo autodistruttive.",
    },
    {
      question: "Posso usare PrivateNote senza un account?",
      answer:
        "Sì. Puoi creare una nota di testo cifrata di base senza accedere. Chi riceve non ha mai bisogno di un account. L’invio di file, foto o registrazioni richiede un account gratuito per applicare i limiti di archiviazione e di trasferimento mensile.",
    },
    {
      question: "Posso inviare file con PrivateNote?",
      answer:
        "Sì. Allega uno o più file alla stessa nota cifrata. I file vengono cifrati nel browser prima del caricamento. L’invio richiede un account gratuito; l’apertura del link no. Chi riceve può scaricare gli allegati in una finestra limitata dopo l’apertura.",
    },
    {
      question: "Posso condividere password con PrivateNote?",
      answer:
        "Sì. Metti la password nella nota e invia il link cifrato invece della password. Puoi aggiungere una passphrase distinta e tenere breve la scadenza. Dopo l’uso di una credenziale importante, ruotala. Una nota privata è una consegna, non un gestore di password.",
    },
    {
      question: "Come cifra PrivateNote le note?",
      answer:
        "Il browser genera una chiave casuale a 256 bit e cifra la nota con AES-256-GCM prima del caricamento. La chiave viaggia nel fragment dell’URL — la parte dopo # — che i browser non inviano in una richiesta HTTP normale. Le note protette da password avvolgono quella chiave con Argon2id. Anche gli allegati vengono cifrati nel browser.",
    },
    {
      question: "Il destinatario ha bisogno di un account PrivateNote?",
      answer:
        "No. Chi riceve apre il link in un browser e decifra il contenuto in locale. Non accede. Chiunque abbia il link completo, e la password se ne hai impostata una, può aprire la nota.",
    },
  ],

  finalHeading: "Condividi qualcosa in privato.",
  finalBody: "Crea una nota cifrata o una consegna di file e invia il link al destinatario.",
  finalPrimaryCta: "Crea una nota privata",
  finalSecondaryCta: "Vedi i prezzi",
  finalTrust: "Nessun account richiesto per iniziare.",
};
