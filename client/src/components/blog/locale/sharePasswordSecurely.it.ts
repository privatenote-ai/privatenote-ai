import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyIt: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop su una scrivania che mostra un link sicuro PrivateNote.ai pronto da copiare, con scadenza a una visualizzazione e passphrase attiva",
  heroCaption:
    "Condividi un link sicuro—non la password stessa—con scadenza breve, visualizzazione monouso e una passphrase opzionale.",
  intro: [
    "Condividere una password sembra un’attività quotidiana e banale—fino a quando qualcosa va storto.",
    "Che un collega abbia bisogno di un accesso temporaneo a uno strumento interno, che un addetto al supporto clienti chieda l’accesso a un sistema, o che tu debba inviare le credenziali Wi-Fi a un visitatore, l’opzione più rapida spesso sembra incollare la password in chiaro in una chat Microsoft Teams, in un messaggio WhatsApp o in un’e-mail veloce.",
    "Purtroppo quella comodità lascia dietro di sé una traccia digitale permanente. Una volta che un segreto entra in questi canali, viene sincronizzato su più dispositivi, risulta ricercabile, resta nei backup automatici della casella di posta e viene conservato indefinitamente negli archivi dei messaggi aziendali. Una password pensata come temporanea diventa una responsabilità permanente.",
    "Fortunatamente esiste un modo migliore per proteggere le tue credenziali.",
  ],
  sections: [
    {
      title: "Il problema centrale della condivisione in chiaro",
      paragraphs: [
        "E-mail e applicazioni di chat sono ottime piattaforme di collaborazione, ma non sono mai state progettate per conservare i segreti. Sebbene i sistemi moderni di solito cifrino i dati in transito, falliscono sull’efemerità—cioè sul far sparire i segreti una volta che hanno compiuto il loro scopo.",
        "Quando incolli una password in una chat o in un thread e-mail standard, perdi subito il controllo del suo ciclo di vita. Resta nelle caselle di posta, ricercabile nei log della chat anni dopo, e visibile nelle notifiche dei dispositivi o nelle schermate di blocco. Se in futuro il tuo account o quello del destinatario venisse compromesso, quelle cronologie in chiaro diventano una miniera d’oro per gli attaccanti.",
      ],
    },
    {
      title: "GDPR (DSGVO) e rischi di conformità in Europa",
      paragraphs: [
        "Per le organizzazioni europee non è solo una questione di sicurezza—è un rischio di conformità. Ai sensi del Regolamento generale sulla protezione dei dati (GDPR / DSGVO), le aziende sono legalmente tenute a proteggere l’accesso ai dati personali con misure tecniche e organizzative all’avanguardia.",
        "Incollare credenziali attive in log di chat su cloud ospitati negli USA o su server e-mail non cifrati, senza una cifratura end-to-end dedicata, può aumentare l’esposizione alla conformità, soprattutto se quelle password danno accesso a database con dati di clienti o dipendenti.",
        "Usare la cifratura locale lato browser riduce drasticamente i luoghi in cui le credenziali possono rimanere, allineando i passaggi quotidiani a un approccio privacy-first. Questo non è un parere legale; tratta la condivisione sicura delle credenziali come una parte di un più ampio controllo degli accessi, della gestione delle password e delle policy di rotazione.",
      ],
    },
    {
      title: "Come funzionano i link cifrati lato browser",
      paragraphs: [
        "Per la condivisione rapida e occasionale di password, i link monouso cifrati nel browser sono tra le opzioni più sicure ed efficienti. Invece di inviare la credenziale stessa, invii un link unico e temporaneo a una nota cifrata. [Che cos’è un link monouso](blog:one-time-secret-links) spiega il modello dietro quella consegna.",
        "Il browser svolge il lavoro pesante: la password viene cifrata localmente prima del caricamento, così il server intermedio memorizza il ciphertext—non la password in chiaro. La chiave di decifratura di solito resta nel fragment del link, che i browser non inviano al server.",
      ],
      flowIntro: "Per condividere un segreto con un link temporaneo e autodistruggente, segui questi quattro passaggi:",
      flowSteps: [
        {
          step: "Passaggio 1",
          title: "Inserimento e cifratura locale",
          body: "Inserisci la password in uno strumento sicuro. Il browser la cifra localmente con una chiave che non lascia mai la tua macchina in chiaro.",
        },
        {
          step: "Passaggio 2",
          title: "Genera il link",
          body: "Lo strumento carica solo il payload cifrato su un server zero-knowledge e crea un link di condivisione unico. Il materiale di decifratura resta con il link—non in un vault lato server di segreti leggibili.",
        },
        {
          step: "Passaggio 3",
          title: "Invia il link",
          body: "Copia e invia il link via Microsoft Teams, e-mail o WhatsApp. La piattaforma di chat vede un URL, non la tua password.",
        },
        {
          step: "Passaggio 4",
          title: "Rivelazione e autodistruzione",
          body: "Il browser del destinatario decifra il contenuto localmente. A seconda della policy di condivisione, il payload cifrato può poi essere eliminato dal server dopo la visualizzazione o dopo una breve finestra di scadenza.",
        },
      ],
      midCta: {
        body: "Devi condividere una password adesso? Crea una nota cifrata monouso e invia il link sicuro al posto della password stessa.",
        button: "Crea una nota privata",
      },
    },
    {
      title: "Consiglio ad alta sicurezza: condivisione a canali separati",
      paragraphs: [
        "Un link cifrato è sicuro quanto il canale che usi per inviarlo. Se un terzo malevolo ottiene accesso alla tua inbox Teams o e-mail, potrebbe intercettare il link prima che il destinatario lo apra.",
        "Molti strumenti di condivisione sicura—incluso PrivateNote.ai—offrono un’impostazione opzionale per proteggere la nota con una password aggiuntiva (passphrase wrapping). Non è attiva di default: la attivi quando crei la nota, scegli una passphrase e il destinatario deve inserirla prima che il segreto venga rivelato.",
        "Per evitare un singolo punto di fallimento (SPoF) con credenziali altamente sensibili, usa questa opzione per la condivisione a canali separati: genera il link cifrato con la protezione tramite passphrase attiva, invia il link sul canale principale (ad esempio Microsoft Teams) e invia la passphrase su un canale completamente diverso—preferibilmente un messenger privacy-focused come Signal o Threema, oppure una breve telefonata.",
      ],
      callout:
        "Un attaccante avrebbe bisogno sia del link sia della passphrase. È quella separazione a rendere efficace la condivisione a canali separati.",
    },
    {
      title: "Condivisione tramite password manager vs. link monouso",
      paragraphs: [
        "Entrambi i metodi possono essere altamente sicuri, ma servono scopi diversi. Scegliere lo strumento giusto dipende da quanto a lungo il destinatario ha bisogno dell’accesso.",
      ],
      comparisonTable: {
        headers: ["Categoria", "Ideale per", "Limiti tecnici"],
        rows: [
          [
            "E-mail, Teams o WhatsApp",
            "Non consigliato per le password",
            "Lascia copie permanenti e ricercabili in chiaro in backup e archivi",
          ],
          [
            "Password manager",
            "Accesso continuativo: condivisione di vault con familiari, reparti interni o team di fiducia",
            "Richiede che entrambe le parti mantengano account di password manager attivi e compatibili",
          ],
          [
            "Link cifrati monouso",
            "Accesso temporaneo: freelancer, supporto clienti, visitatori e consegne una tantum",
            "Chiunque abbia il link può leggere il segreto, a meno che non sia protetto da una passphrase secondaria",
          ],
        ],
        after: [
          "Come regola pratica: usa un **password manager** per l’accesso condiviso continuativo, e un **link cifrato monouso** quando la credenziale dovrebbe cambiare subito dopo la consegna.",
        ],
      },
    },
    {
      title: "Quando usare un link password monouso",
      paragraphs: [
        "La condivisione monouso delle password è ideale per credenziali transazionali che devono essere comunicate una sola volta. Esempi comuni nei luoghi di lavoro europei includono:",
      ],
      useCaseTable: {
        headers: ["Reparto", "Casi d’uso comuni"],
        rows: [
          [
            "Amministrazione e ufficio",
            "Password del router o del Wi-Fi guest dell’ufficio, credenziali admin della stampante o impostazioni smart office",
          ],
          [
            "Finanza e business",
            "Credenziali per il commercialista o per revisori finanziari esterni",
          ],
          [
            "IT e operations",
            "Onboarding di fornitori IT esterni temporanei, o condivisione di login temporanei per contractor",
          ],
          [
            "Team tecnici",
            "Credenziali di database, chiavi API, chiavi SSH o password di piattaforme cloud con gli sviluppatori",
          ],
        ],
      },
    },
    {
      title: "Best practice e errori da evitare",
      subsections: [
        {
          title: "Applica la rotazione",
          paragraphs: [
            "Ogni volta che condividi una password, trattala come temporanea. Chiedi al destinatario di cambiarla non appena accede e conferma che la rotazione sia completa prima di considerare conclusa la consegna.",
          ],
        },
        {
          title: "Genera password forti in locale",
          paragraphs: [
            "Non inventare le password da solo. Usa uno strumento locale come il [generatore di password](app:password-generator) di PrivateNote, oppure [passwords.lu](https://passwords.lu) per passphrase e opzioni PIN. Entrambi funzionano in locale—niente viene caricato. Per il modello tecnico, vedi [Come generiamo password sicure](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Mantieni tempi di scadenza brevi",
          paragraphs: [
            "La maggior parte delle password deve esistere solo per pochi minuti o ore. Preferisci una singola visualizzazione o una finestra breve, ad esempio due ore, quando ciò è ancora compatibile con il flusso di lavoro del destinatario.",
          ],
        },
        {
          title: "Non mettere le password in titoli o oggetti",
          paragraphs: [
            "Non inserire mai password in chiaro nell’oggetto delle e-mail, nei titoli dei ticket, nei nomi dei canali Teams, nei titoli dei gruppi WhatsApp, nei nomi dei documenti o negli inviti di calendario. Quei campi raramente ricevono la stessa cura dei corpi dei messaggi—e restano negli indici di ricerca.",
          ],
        },
        {
          title: "Tieni il contesto fuori dalla nota sicura",
          paragraphs: [
            "Se stai condividendo una password di database, non scrivere “Password database per CRM di produzione: MySecret123!” nella nota. Metti solo il segreto grezzo nel link cifrato. Se il link viene intercettato, l’attaccante non dovrebbe anche scoprire quale account o sistema sblocca.",
          ],
        },
      ],
      calloutTitle: "Errore comune",
      callout:
        "Inviare sia il link cifrato sia la relativa passphrase nello stesso messaggio Teams, chat WhatsApp o e-mail annulla la condivisione a canali separati e ricrea un singolo punto di fallimento.",
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Microsoft Teams o WhatsApp sono più sicuri dell’e-mail?",
          answer:
            "I loro protocolli di trasmissione sono generalmente sicuri, ma funzionano comunque come archivi di chat a lungo termine. Qualsiasi password incollata in un thread può restare ricercabile indefinitamente, il che la rende una vulnerabilità persistente.",
        },
        {
          question: "Il GDPR (DSGVO) influisce su come condivido le password?",
          answer:
            "Ai sensi dell’articolo 32 del GDPR, le organizzazioni devono attuare misure tecniche e organizzative adeguate per proteggere i dati personali. Conservare password in chiaro in backup cloud o catene e-mail aperte aumenta l’esposizione alla conformità. I link zero-knowledge autodistruggenti mantengono più piccola l’impronta delle credenziali.",
        },
        {
          question: "Devo inviare il link e la passphrase insieme?",
          answer:
            "No. Inviare entrambi i pezzi nello stesso messaggio annulla la condivisione a canali separati. Invia la passphrase tramite un mezzo separato—preferibilmente Signal o Threema, oppure una telefonata.",
        },
        {
          question: "Devo usare un password manager o un link monouso?",
          answer:
            "Usa un password manager per l’accesso condiviso a lungo termine. Usa un link monouso cifrato nel browser quando ti serve comunicare una password una sola volta.",
        },
        {
          question: "Ho comunque bisogno di un password manager?",
          answer:
            "Sì. I password manager restano il posto giusto per conservare e gestire le credenziali che tieni. I link cifrati monouso li completano per consegne controllate e temporanee.",
        },
      ],
    },
    {
      title: "Considerazioni finali",
      paragraphs: [
        "La condivisione sicura delle password non deve essere un collo di bottiglia per il tuo flusso di lavoro. Richiede semplicemente un piccolo cambio di abitudine: smetti di lasciare dati sensibili permanentemente nelle cronologie delle chat e nelle caselle di posta.",
        "Usando la cifratura locale lato browser e link autodistruggenti, riduci il rischio di sicurezza e conformità organizzativa mantenendo le consegne rapide e pratiche.",
        "La prossima volta che devi condividere una password, evita di copiarla e incollarla in Microsoft Teams, WhatsApp o e-mail. Crea una nota cifrata monouso, invia il link al posto della password e lascia scadere la nota dopo che ha compiuto il suo scopo.",
      ],
    },
  ],
  ctaTitle: "Pronto a condividere in modo sicuro?",
  ctaBody:
    "Crea una nota privata su PrivateNote.ai per cifrare le credenziali nel browser prima del caricamento. Le note possono scadere automaticamente o dopo la lettura, la protezione opzionale con passphrase aggiunge un altro livello, e i dati delle note cifrate sono gestiti sotto giurisdizione UE.",
  ctaButton: "Crea una nota privata",
};
