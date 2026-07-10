import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsIt: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop su una scrivania che mostra un’e-mail con credenziali server e una chiave privata SSH in chiaro",
  intro:
    "L’e-mail è diventata il modo predefinito per scambiare quasi tutto: contratti, password, chiavi API, dati bancari, cartelle cliniche, documenti d’identità, password Wi‑Fi e codici di recupero. Molti di noi inviano informazioni sensibili via e-mail senza pensarci due volte.",
  calloutTitle: "L’e-mail è nata per consegnare messaggi, non per farli sparire",
  calloutBody:
    "Una volta inviata un’e-mail, spesso perdi il controllo su dove finirà, per quanto tempo sarà conservata e chi potrà eventualmente accedervi. Se stai inviando qualcosa che deve restare privato, l’e-mail è di solito lo strumento sbagliato.",
  emailCopies: [
    "la tua casella di posta",
    "la casella del destinatario",
    "i backup del provider e-mail",
    "copie archiviate",
    "dispositivi sincronizzati",
    "sistemi di backup aziendali",
    "file PST o MBOX esportati",
    "infrastruttura di disaster recovery",
  ],
  agedSecretsExamples: [
    "una password di database di produzione",
    "una chiave API",
    "credenziali SSH",
    "dettagli di accesso VPN",
    "una frase di recupero crypto",
  ],
  forwardingPaths: [
    "inoltrate",
    "copiate in sistemi di ticketing",
    "incollate in applicazioni di chat",
    "allegate ad altre e-mail",
    "condivise con fornitori",
    "incluse in richieste di supporto",
  ],
  aiProcessingUses: [
    "rilevamento spam",
    "protezione dal phishing",
    "rilevamento malware",
    "risposte intelligenti",
    "categorizzazione della posta",
    "ricerca",
    "funzioni di produttività",
    "scrittura e riepilogo assistiti dall’IA",
  ],
  oneTimeSecretExamples: [
    "una password",
    "una chiave API",
    "un codice di recupero",
    "una licenza software",
    "una credenziale server",
    "un messaggio riservato",
  ],
  oneTimeBenefits: [
    "Nessuna cronologia nella casella di posta.",
    "Nessun archivio ricercabile.",
    "Nessun inoltro accidentale del segreto stesso.",
    "Nessuna copia dimenticata per anni nelle caselle e-mail.",
  ],
  sections: [
    {
      title: "La tua e-mail non esiste in un solo posto",
      paragraphs: [
        "Molte persone immaginano l’e-mail come una semplice conversazione tra due persone. In realtà, ogni e-mail esiste di solito in più luoghi:",
        "Anche se elimini un’e-mail, copie possono continuare a esistere altrove. Alcune organizzazioni conservano la posta per anni per obblighi legali, normativi o aziendali. Nella pratica, un’e-mail spesso diventa permanente.",
      ],
    },
    {
      title: "I segreti invecchiano male",
      paragraphs: [
        "La cosa più pericolosa dell’e-mail non è necessariamente oggi. È tra cinque anni. Immagina di aver inviato a qualcuno:",
        "Forse quelle credenziali sono state cambiate. Forse no. Anni dopo, quell’e-mail potrebbe essere ancora in più caselle, ricercabile in pochi secondi. Chiunque ottenga accesso a uno di quegli account eredita una mappa dei tuoi vecchi segreti. La nostra guida sui [segreti da non inviare mai in chat](blog:secrets-never-send-in-chat) copre rischi simili nelle app di messaggistica; l’e-mail spesso è peggiore perché la conservazione è più lunga e le copie sono più numerose.",
      ],
    },
    {
      title: "L’e-mail è progettata per essere ricercabile",
      paragraphs: [
        "I client e-mail moderni sono incredibilmente bravi a trovare vecchi messaggi. Cerca `password`, `API` o `confidenziale` e messaggi di anni fa appaiono quasi istantaneamente.",
      ],
      callout:
        "È una funzione fantastica per la comunicazione quotidiana. È una pessima funzione per i segreti. Le informazioni sensibili dovrebbero diventare **più difficili** da trovare nel tempo, non più facili.",
    },
    {
      title: "L’inoltro richiede un clic",
      paragraphs: [
        "Forse ti fidi del destinatario. Non sempre basta. Le e-mail vengono abitualmente:",
        "Una volta che un segreto lascia la tua casella, non controlli più quante copie esistono. A differenza di un gestore di password o di un servizio di condivisione cifrata, l’e-mail non ha il concetto di revocare l’accesso dopo la consegna.",
      ],
    },
    {
      title: "L’IA elabora sempre più spesso le e-mail",
      paragraphs: [
        "Un altro motivo per riflettere prima di inviare informazioni sensibili via e-mail è che i provider usano sempre più sistemi automatici per elaborare i messaggi. Questi sistemi possono aiutare con:",
        "I provider differiscono molto su come funzionano queste funzionalità, quali dati vengono elaborati e con quali politiche di privacy. Anche se molti provider hanno rafforzato i loro impegni sulla privacy negli ultimi anni, inviare informazioni sensibili via e-mail significa comunque affidarle a sistemi fuori dal tuo controllo. Se l’obiettivo è ridurre l’esposizione, inviare meno informazioni sensibili via e-mail è un primo passo sensato.",
      ],
    },
    {
      title: "Anche la scansione normativa fa parte del dibattito",
      paragraphs: [
        "La privacy non è più solo una questione tecnica. È diventata anche una questione politica. Nel luglio 2026, il Parlamento europeo ha approvato una proroga del quadro giuridico temporaneo che consente ai provider di alcuni servizi di comunicazione di rilevare e segnalare volontariamente materiale pedopornografico (CSAM) fino ad aprile 2028.",
        "Il quadro riguarda principalmente servizi che possono accedere al contenuto dei messaggi, come molti provider e-mail tradizionali e altri servizi di comunicazione non [cifrati end-to-end](blog:what-is-end-to-end-encryption). Per capire cosa significasse quel voto, e perché più voti “No” che “Sì” abbiano comunque portato all’approvazione, leggi il nostro approfondimento su [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "L’obiettivo dichiarato è la protezione dei minori, e persone ragionevoli possono non essere d’accordo sul giusto equilibrio tra privacy e sicurezza pubblica. Tuttavia, il dibattito mostra un punto importante: **se un servizio può leggere i tuoi messaggi, leggi future, policy o decisioni della piattaforma possono influenzare il modo in cui quei messaggi vengono elaborati.** I servizi cifrati end-to-end sono diversi proprio perché il provider non possiede le chiavi crittografiche necessarie per leggere il contenuto.",
    },
    {
      title: "C’è un modo migliore per condividere segreti",
      paragraphs: [
        "Non ogni informazione deve vivere per sempre. A volte devi semplicemente inviare qualcosa una volta. Per esempio:",
        "Invece di inviarli direttamente in un’e-mail, usa un [link cifrato monouso](blog:one-time-secret-links). Il destinatario apre il link, legge il segreto e i dati cifrati vengono eliminati in modo permanente. Per le chiavi API in particolare, leggi la nostra guida operativa su [come condividere una chiave API in modo sicuro](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "La cifratura nel browser fa la differenza",
      paragraphs: [
        "In PrivateNote, la cifratura avviene nel browser prima che venga caricato qualsiasi dato. Il browser cifra il messaggio localmente. Solo il testo cifrato raggiunge i nostri server. La chiave di decifratura non lascia mai il dispositivo e non viene mai conservata da noi.",
        "Quando il destinatario apre la nota, puoi configurarla perché si autodistrugga dopo la prima lettura riuscita o scada automaticamente dopo un periodo scelto. Questo significa che non resta un’e-mail permanente contenente il segreto in attesa di essere scoperta anni dopo. Puoi [inviare un messaggio segreto senza creare un account](blog:send-secret-message-without-account), oppure leggere [come funziona PrivateNote](app:how-it-works) per il modello completo di cifratura.",
      ],
      callout:
        "Il test pratico è semplice: il provider può ottenere la chiave di decifratura o il testo in chiaro? Se sì, il sistema non è davvero cifrato end-to-end. L’e-mail fallisce questo test per design.",
    },
    {
      title: "Lo strumento giusto per l’informazione giusta",
      paragraphs: [
        "L’e-mail resta una delle tecnologie di comunicazione più utili mai create. È eccellente per conversazioni, fatture, newsletter e comunicazione aziendale quotidiana.",
        "Non è il posto ideale per informazioni che dovrebbero sparire dopo aver svolto il loro scopo. Password, codici di recupero, chiavi API, documenti riservati e altre informazioni sensibili meritano un meccanismo di condivisione progettato con la privacy al centro.",
        "**A volte il segreto più sicuro è quello che semplicemente non esiste più.**",
      ],
    },
  ],
  ctaTitle: "Condividi un segreto senza lasciarlo nella casella di posta di nessuno",
  ctaBody:
    "Crea una nota cifrata monouso nel browser. Se devi, invia il link via e-mail: il segreto resta fuori dal thread.",
  ctaButton: "Prova PrivateNote ->",
};
