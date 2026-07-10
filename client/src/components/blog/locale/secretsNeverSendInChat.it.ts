import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatIt: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Da Slack e Microsoft Teams a WhatsApp e Messenger, la chat è diventata il modo predefinito di scambiare informazioni. È veloce, comoda e mantiene i team allineati. Purtroppo è anche diventata un cimitero digitale di dati molto sensibili: condivisi per comodità e poi dimenticati.",
    "Molte app di chat moderne offrono una solida [crittografia in transito](blog:encrypted-vs-secure-file-sharing) o persino crittografia end-to-end. La crittografia protegge i messaggi mentre si spostano tra i dispositivi. Il problema più grande è ciò che accade dopo. Una volta che un segreto entra in una chat, spesso resta ricercabile per mesi o anni su più sistemi.",
    "Questa persistenza crea un’impronta digitale sorprendentemente ampia. Le informazioni sensibili possono sopravvivere nella cronologia chat ricercabile, nei backup cloud, negli export del workspace, nelle anteprime delle notifiche, negli screenshot e sui dispositivi sincronizzati.",
    "Secondo il [Data Breach Investigations Report 2026 di Verizon](https://www.verizon.com/business/resources/reports/dbir/), **il 62% delle violazioni coinvolge l’elemento umano** — furto di credenziali, phishing, ingegneria sociale, uso improprio ed errori semplici. La tecnologia da sola non può prevenire questi incidenti se le informazioni sensibili vengono condivise senza attenzione.",
    "Un approccio più sicuro si basa su un principio semplice: **condividi le informazioni solo quando servono e assicurati che scompaiano dopo la prima visualizzazione.** Questo è il modello alla base dei [link segreti monouso](blog:one-time-secret-links) — ed è il motivo per cui PrivateNote tratta la durata della nota come parte della sicurezza, non come un dettaglio secondario.",
  ],
  chatScreenshotCaption:
    "Esempio illustrativo: credenziali in chiaro incollate in una chat di team restano nella cronologia del canale, nei backup e nella ricerca — molto dopo che la consegna è terminata.",
  cheatSheetTitle: "Scheda di riferimento rapido sulla sicurezza",
  cheatSheetHeaders: ["Non inviare mai", "Il rischio", "Approccio migliore"],
  cheatSheetRows: [
    {
      neverSend: "Password",
      risk: "Indicizzate nella cronologia chat permanente e nei log ricercabili.",
      better: "[Link monouso crittografato nel browser](blog:one-time-secret-links).",
    },
    {
      neverSend: "Codici di recupero",
      risk: "Aggira in modo efficace e permanente l’autenticazione multifattore.",
      better: "Gestore di password dedicato o [nota monouso](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "Chiavi API",
      risk: "Un incolla accidentale in un canale pubblico compromette gli ambienti di produzione.",
      better: "[Nota sicura autodistruttiva](blog:privatenote-for-developers) con crittografia lato client.",
    },
    {
      neverSend: "Documenti",
      risk: "Lascia copie persistenti sparse nelle cartelle di download locali.",
      better: "[Trasferimento temporaneo di file crittografato](app:secure-file-transfer) con accesso limitato.",
    },
  ],
  whyChatTitle: "Perché la chat non è un gestore di segreti",
  whyChatParagraphs: [
    "Le piattaforme di messaggistica sono progettate per la comunicazione, non per la gestione dei segreti. Il loro scopo è preservare le conversazioni tra dispositivi, sincronizzare la cronologia, supportare la ricerca, creare backup e mantenere traccia della collaborazione.",
    "Le stesse funzioni diventano un rischio quando vengono condivise credenziali o asset aziendali. Le informazioni restano accessibili molto dopo aver svolto il loro scopo. Il nostro articolo su [messaggi di lavoro e discovery legale](blog:workplace-texts-private-note) mostra come messaggi scritti con disinvoltura possano sopravvivere al loro contesto originale per anni.",
    "Un segreto monouso segue un modello diverso: rendi l’informazione disponibile solo per il breve periodo in cui è realmente necessaria — e poi rimuovi l’accesso lato server per design.",
  ],
  lifetimeTitle: "Durata dei dati: chat tradizionale vs. PrivateNote",
  lifetimeIntro:
    "La differenza non è se un messaggio è crittografato in transito. È se il segreto esiste ancora da qualche parte dopo essere stato letto.",
  chatWorkflowLabel: "Flusso chat tradizionale",
  chatWorkflowSteps: ["Password", "Slack / Teams", "Archiviata", "Ricercabile", "Backup", "Anni dopo"],
  chatWorkflowOutcome: "Il segreto persiste nei sistemi",
  privateNoteWorkflowLabel: "Flusso PrivateNote",
  privateNoteWorkflowSteps: [
    "Password",
    "Crittografa nel browser",
    "Link monouso",
    "Visualizzata",
    "Eliminata dal server",
  ],
  privateNoteWorkflowOutcome: "Segreto rimosso dopo la consegna",
  secretsTitle: "10 segreti da vietare nelle tue app di chat",
  secrets: [
    {
      title: "Password degli account",
      paragraphs: [
        "Tutti l’abbiamo visto: «Ehi, qual era di nuovo la password dell’account marketing condiviso?» seguito da una risposta in chiaro. Anche se ti fidi completamente del collega, quella password è ora indicizzata nella cronologia del workspace, in cache locale dell’app e potenzialmente visibile nelle anteprime di e-mail o notifiche push.",
        "Se un attaccante compromette quella cronologia chat mesi dopo, eredita l’accesso attivo al tuo account.",
      ],
      instead:
        "Invia un [link monouso crittografato nel browser](blog:send-secret-message-without-account). Una volta che il destinatario lo apre e recupera la password, il testo cifrato viene eliminato dal server host. Ti serve prima una password forte? Usa il nostro [generatore di password](app:password-generator).",
    },
    {
      title: "Codici di recupero dell’autenticazione multifattore (MFA)",
      paragraphs: [
        "Quando si attiva la MFA, i servizi generano codici di backup di emergenza. Poiché gli utenti temono di perdere l’accesso, spesso incollano questi codici in una chat con un collega — o se li inviano al proprio spazio chat personale.",
        "I codici di recupero sono chiavi master di backup. Trattarli come testo informale vanifica completamente lo scopo dell’imposizione della sicurezza multifattore.",
      ],
      instead:
        "Conservali in un gestore di password dedicato. Se devi condividerli durante un passaggio di account, usa una [nota temporanea monouso](blog:one-time-secret-links) così il segreto non resta archiviato permanentemente nella cronologia chat.",
    },
    {
      title: "Chiavi API di produzione",
      paragraphs: [
        "Gli sviluppatori scambiano regolarmente chiavi API, token di accesso o segreti di servizi cloud in chat per debuggare rapidamente un problema. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) rileva continuamente credenziali esposte nei repository pubblici — a dimostrazione di quanto spesso i segreti trapelino per errore.",
        "Un incolla accidentale nel canale sbagliato può esporre cluster di database live o pipeline di fatturazione.",
      ],
      instead:
        "Instrada i token tramite una [nota crittografata lato client](blog:privatenote-for-developers) che scade automaticamente dopo essere stata visualizzata una volta.",
    },
    {
      title: "Chiavi private SSH",
      paragraphs: [
        "La tua chiave privata è la tua identità per l’infrastruttura server. Non dovrebbe mai esistere dentro un’applicazione di messaggistica. Copiare una chiave privata significa che una copia vive ora fuori dal suo ambiente sicuro previsto — e può persistere nella cronologia chat, nei backup o sui dispositivi del destinatario.",
      ],
      instead:
        "Se una chiave deve essere spostata in modo sicuro, usa un payload crittografato monouso che si elimina dal server host dopo la consegna.",
    },
    {
      title: "Link di invito e reset",
      paragraphs: [
        "Le persone lasciano costantemente link temporanei di onboarding e amministrativi nei canali chat:",
      ],
      bullets: [
        "Link di assegnazione host Zoom",
        "Token di accesso moderatore Google Meet",
        "Inviti di onboarding Stripe",
        "Inviti con privilegi di amministratore",
        "URL di reset password",
      ],
      instead:
        "Consegna link di onboarding ad alto privilegio tramite una [nota monouso](blog:one-time-secret-links) così non possono essere estratti dai log storici se restano inutilizzati.",
    },
    {
      title: "Frasi seed di criptovalute",
      paragraphs: [
        "La tua frase di recupero da 12 o 24 parole controlla l’intero wallet. Se qualcuno compromette il tuo account chat anni dopo, lo scraping automatizzato può scansionare conversazioni storiche in cerca di frasi con formato seed. Se ti rubano la seed phrase, i tuoi asset possono andare persi in modo permanente.",
      ],
      instead:
        "Evita di trasmettere seed phrase digitalmente del tutto. Se un’emergenza assoluta ti costringe, usa una nota crittografata che impone l’eliminazione immediata alla lettura per limitare l’esposizione.",
    },
    {
      title: "Credenziali di accesso temporanee",
      paragraphs: [
        "Gli helpdesk IT condividono frequentemente credenziali iniziali durante l’onboarding dei dipendenti. Anche se di solito all’utente viene chiesto di cambiare la password al primo accesso, la credenziale temporanea resta ricercabile nella cronologia chat. Se l’utente ritarda il cambio — o il sistema consente il riutilizzo della password — quel messaggio resta una vulnerabilità attiva.",
      ],
      instead:
        "Consegna credenziali temporanee tramite una [nota crittografata nel browser](blog:send-secret-message-without-account) che scade dopo essere stata visualizzata.",
    },
    {
      title: "Informazioni finanziarie e bancarie",
      paragraphs: [
        "Incollare IBAN aziendali, dati di bonifico, documenti fiscali o conferme di pagamento in chat sembra innocuo perché un IBAN da solo non è una password. Tuttavia, quando gli attaccanti combinano dati bancari con conversazioni personali trovate nella cronologia chat, ottengono il contesto necessario per phishing convincente e attacchi di frode sulle fatture.",
      ],
      instead:
        "Separa i dati finanziari dalla conversazione quotidiana. Condividili tramite canali crittografati che rimuovono l’accesso nel momento in cui la transazione è verificata.",
    },
    {
      title: "Scansioni di documenti personali",
      paragraphs: [
        "Devi inviare rapidamente una copia del passaporto, della patente o del contratto di lavoro alle HR? Lasciare quel PDF in una finestra chat copia dati di identità molto sensibili nei backup cloud, nelle gallerie locali del telefono e nelle cartelle desktop sincronizzate.",
      ],
      instead:
        "Usa il [trasferimento sicuro di file](app:secure-file-transfer) con crittografia nel browser — un download, poi il file viene eliminato dal server di hosting secondo le tue impostazioni di accesso.",
    },
    {
      title: "Informazioni aziendali riservate",
      paragraphs: [
        "Presentazioni di strategia interna, proposte di prezzo non annunciate, bozze legali e documenti di acquisizione circolano costantemente nei canali del team. Le fughe di dati non arrivano sempre da hacker esterni; a volte accade perché un dipendente invita per errore un ospite esterno in un canale con anni di strategia interna.",
      ],
      instead:
        "Condividi asset aziendali sensibili tramite note crittografate con scadenze automatiche rigorose e finestre di accesso limitate.",
    },
  ],
  lifespanTitle: "I segreti hanno una durata",
  lifespanParagraphs: [
    "La crittografia protegge i segreti in transito. **La scadenza li protegge nel tempo.** La maggior parte delle app di chat ignora completamente questa seconda parte.",
    "Quando usi PrivateNote, cambi la postura di sicurezza per design. Invece di affidarti al ricordo degli utenti di eliminare i messaggi sensibili in seguito, imponi la durata del segreto. Il destinatario lo legge una volta — e poi scompare dal server.",
  ],
  lifespanBullets: [
    "**Nessuna impronta permanente:** nessuna cronologia chat né archivio ricercabile contiene il segreto grezzo.",
    "**Riduzione del raggio di esplosione:** se un laptop o un account chat viene compromesso in seguito, non ci sono password legacy nei log da raccogliere.",
    "**Mitigazione dell’errore umano:** il sistema minimizza i dati automaticamente, senza bisogno di ricordare di eliminare manualmente i messaggi sensibili.",
  ],
  underHoodTitle: "Sicurezza sotto il cofano: come funziona PrivateNote",
  underHoodParagraphs: [
    "PrivateNote crittografa il tuo messaggio direttamente nel browser prima di caricarlo. Il server memorizza solo testo cifrato. La chiave di decifratura risiede nel [frammento URL](blog:one-time-secret-links) — la parte dopo `#` — che i browser non inviano ai server web come parte delle richieste HTTP. Il server non riceve mai la chiave di decifratura.",
    "Una volta che la nota viene aperta secondo le impostazioni scelte, il testo cifrato viene eliminato dal server. Per password, chiavi API, codici di recupero e credenziali temporanee, **limitare la durata dei dati è importante quanto crittografare i dati stessi.** Le chat preservano le conversazioni. PrivateNote limita la durata dei segreti.",
  ],
  faqTitle: "Domande frequenti",
  faq: [
    {
      question: "È sicuro inviare password in Slack?",
      answer:
        "Slack crittografa i dati in transito e a riposo, ma le password restano nella cronologia chat ricercabile finché non vengono eliminate. Per credenziali temporanee, una [nota monouso crittografata nel browser](blog:send-secret-message-without-account) riduce l’esposizione a lungo termine.",
    },
    {
      question: "I messaggi WhatsApp sono sicuri per le password?",
      answer:
        "La crittografia end-to-end protegge i messaggi durante la trasmissione, e i messaggi che scompaiono possono eliminarli automaticamente dopo un tempo definito — ma i destinatari possono ancora fare screenshot, inoltrare o fare backup del contenuto prima che scompaia. Le password dovrebbero idealmente essere condivise solo per il tempo necessario — tramite un [link segreto monouso](blog:one-time-secret-links), non un thread chat permanente.",
    },
    {
      question: "L’e-mail è più sicura della chat per le password?",
      answer:
        "No. L’e-mail standard manca di crittografia end-to-end per impostazione predefinita e passa attraverso più server di posta. Una volta consegnata, una password resta indefinitamente in caselle di posta, cartelle inviate, cache locali e backup del provider.",
    },
    {
      question: "Cos’è un segreto monouso?",
      answer:
        "Un segreto monouso è un messaggio che non è più disponibile dopo essere stato visualizzato una volta o dopo un tempo di scadenza definito — riducendo le copie persistenti nei sistemi. Consulta la nostra guida su [come funzionano i link segreti monouso](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Riferimenti",
  references: [
    "Verizon. 2026 Data Breach Investigations Report (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. 2026 Healthcare Data Breach Investigations Snapshot. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Condividi segreti senza lasciare un’impronta a forma di chat",
  closingBody: [
    "La chat è eccellente per la coordinazione. È un pessimo deposito per credenziali, chiavi, codici di recupero e documenti che non avrebbero mai dovuto persistere.",
    "PrivateNote è stato costruito per il modello opposto: crittografare nel browser, condividere un link e lasciare che il segreto scada quando ha finito il suo lavoro — nessun account per il mittente, nessun testo in chiaro in un archivio ricercabile per anni.",
  ],
  tagline: "Meno cronologia chat. Meno metadati. Più controllo su quanto tempo un segreto esiste online.",
  relatedReading: "Letture correlate",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Invia password e note private senza registrarti — crittografia nel browser e link con scadenza spiegati.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Come funzionano i link monouso, perché il frammento URL conta e quando l’effimero batte e-mail o Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Perché i registri scritti in e-mail e chat di lavoro creano rischio a lungo termine — e quando le note effimere si adattano meglio.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS vs crittografia nel browser — cosa protegge ciascuno e perché il server può ancora leggere i tuoi dati.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Crea password forti prima di condividerle tramite un link monouso.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Una base di sicurezza pratica per password, autenticazione e abitudini di condivisione sicura.",
    },
  ],
};
