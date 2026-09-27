import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteIt: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret e PrivateNote risolvono lo stesso problema pratico: far circolare una password, una chiave API, un codice di recupero o una nota confidenziale tramite un link temporaneo, invece di lasciare il testo in chiaro in e-mail o chat. Il destinatario apre il link e il payload memorizzato può sparire dopo la lettura o al raggiungimento della scadenza.",
    "Entrambi i prodotti cifrano il payload. La differenza importante è dove avviene la cifratura.",
    "OneTimeSecret descrive la propria architettura come cifratura lato server. Il testo in chiaro raggiunge OneTimeSecret prima di essere cifrato. PrivateNote cifra prima in locale, così il servizio riceve testo cifrato anziché il payload in chiaro. Quella differenza determina il confine di fiducia crittografica.",
  ],
  sections: [
    {
      title: "Due modi per costruire lo stesso link",
      paragraphs: [
        "Nella **cifratura lato server**, il mittente invia il segreto al servizio tramite TLS. Il servizio riceve il testo in chiaro, lo cifra e memorizza testo cifrato. Può poi memorizzare il payload, consegnarlo, farlo scadere e cancellarlo. Il server applicativo fa parte del processo di cifratura perché il testo in chiaro entra nel servizio prima di diventare testo cifrato.",
        "Nella **cifratura lato client**, il dispositivo del mittente cifra per primo. Il servizio riceve e memorizza testo cifrato. Quell’upload viaggia su TLS. Il servizio non riceve la chiave necessaria per decifrare un payload standard. Il dispositivo del destinatario decifra in locale. Il servizio può comunque memorizzare, consegnare, far scadere e cancellare il payload senza bisogno di accedere al suo testo in chiaro.",
        "Entrambi i progetti possono offrire link temporanei, accesso limitato e scadenza. Entrambi possono essere descritti correttamente come cifrati. OneTimeSecret usa la prima architettura; PrivateNote la seconda. La domanda rilevante non è quindi semplicemente se un link monouso sia cifrato, ma quali sistemi debbano avere accesso al testo in chiaro perché quel link funzioni.",
      ],
    },
    {
      title: "OneTimeSecret: cifratura lato server",
      paragraphs: [
        "Nel flusso ordinario di OneTimeSecret, il mittente invia il segreto tramite TLS. L’applicazione riceve il testo in chiaro, lo cifra sul server e memorizza il payload cifrato.",
        "Questo offre una protezione concreta per i dati memorizzati. Ottenere da solo lo storage cifrato non rivela necessariamente il contenuto quando il materiale richiesto per la decifratura non è disponibile all’attaccante.",
        "Il compromesso architetturale nasce prima della memorizzazione. TLS protegge il segreto mentre viaggia tra il browser e OneTimeSecret, ma l’applicazione deve elaborare il testo in chiaro per cifrarlo. Il server applicativo si trova quindi all’interno del confine di fiducia crittografica.",
        "Un processo applicativo malevolo o compromesso in quel momento potrebbe accedere al segreto prima che venga cifrato per lo storage. La cifratura lato client rimuove questa dipendenza specifica cifrando il segreto prima che raggiunga il servizio.",
      ],
    },
    {
      title: "La passphrase di OneTimeSecret non cambia il confine di cifratura",
      paragraphs: [
        "La documentazione di OneTimeSecret descrive una passphrase opzionale. Quando si usa una passphrase, OneTimeSecret afferma che il segreto viene cifrato sui suoi server usando la passphrase fornita dal mittente. Afferma di non memorizzare la passphrase stessa; invece conserva un hash bcrypt usato per verificare la passphrase durante il recupero. Secondo la documentazione, quell’hash non può da solo decifrare il segreto, e il segreto memorizzato protetto da passphrase non può essere decifrato senza la passphrase originale.",
        "Il recupero usa lo stesso confine lato server. Il destinatario fornisce la passphrase a OneTimeSecret tramite TLS. Il servizio la verifica ed esegue la decifratura sul server prima di restituire il testo in chiaro.",
        "Ciò significa che il processo applicativo ha accesso al segreto e alla passphrase quando avviene la cifratura, e di nuovo elabora la passphrase e il testo in chiaro risultante durante il recupero. Un processo applicativo malevolo o compromesso che operi in uno di questi punti potrebbe potenzialmente catturare quelle informazioni. È una conseguenza di dove si eseguono cifratura e decifratura, non un’affermazione che OneTimeSecret registri o faccia un uso improprio di quei valori.",
        "La documentazione pubblica di OneTimeSecret non stabilisce, da sola, ogni dettaglio della gerarchia interna delle chiavi — ad esempio, precisamente come si combinano il materiale di chiave lato server, le chiavi per segreto, la derivazione delle chiavi e la passphrase fornita. Non è necessario speculare su quei dettagli di implementazione per questo confronto. La proprietà documentata rilevante è che cifratura e decifratura avvengono lato servizio.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Il segreto che vuoi inviare, e la passphrase quando ne imposti una, viaggiano entrambi verso il server tramite TLS. La cifratura viene eseguita su quel server. Ciò che resta nello storage è testo cifrato.",
          columns: [
            [
              { text: "Segreto + passphrase", via: "TLS" },
              { text: "Server", via: "Cifrare" },
              { text: "Testo cifrato" },
            ],
          ],
        },
      ],
    },
    {
      title: "Il self-hosting può rendere ragionevole quella fiducia nel server",
      paragraphs: [
        "OneTimeSecret è open source. Un’organizzazione può eseguire la propria istanza all’interno di un perimetro di sicurezza aziendale, invece di inviare segreti al servizio pubblico.",
        "In quel deployment, fidarsi del server applicativo significa fidarsi di un’infrastruttura che l’organizzazione già gestisce. Il testo in chiaro raggiunge comunque quel server, perché la cifratura avviene ancora lì. La parte dall’altra parte del confine sono gli host, gli operatori e i backup dell’organizzazione stessa. Per un team che già accetta quei sistemi come parte del percorso che un segreto percorre, la cifratura lato server può essere una scelta ragionevole. Riduce la distanza tra i modelli di minaccia lato server e lato client, perché l’operatore non è più un servizio esterno.",
      ],
    },
    {
      title: "PrivateNote cifra prima dell’upload",
      paragraphs: [
        "Una PrivateNote standard viene cifrata prima dell’upload. Il browser del mittente, o un processo locale [CLI](app:developers/cli), [estensione Chrome](app:developers/chrome), [estensione dell’editor](app:developers/vscode) o [MCP](app:developers/mcp), genera una chiave casuale e cifra il payload con AES-256-GCM. Viene caricato solo testo cifrato. TLS trasporta quel testo cifrato dal browser al worker Cloudflare di PrivateNote. La chiave di decifratura viene collocata nel frammento URL, la parte dopo `#`, ad esempio `https://privatenote.ai/note/abc123#…`. Il fragment viene gestito lato client e non è incluso nella richiesta HTTPS ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). Il worker riceve un identificatore della nota e restituisce testo cifrato sulla stessa connessione TLS. Il browser conserva il fragment e decifra in locale.",
      ],
    },
    {
      title: "Una passphrase protegge la chiave se il canale del link è compromesso",
      paragraphs: [
        "Una passphrase su PrivateNote svolge un lavoro diverso da una passphrase su OneTimeSecret. La nota è già testo cifrato prima di lasciare il dispositivo. Se aggiungi una passphrase, il browser deriva da essa una chiave di wrapping con Argon2id e usa quella chiave per cifrare la chiave della nota. Il frammento URL contiene allora la chiave avvolta. Il destinatario ha bisogno del link e della passphrase. Il browser svolge la chiave in locale e solo allora decifra la nota.",
        "PrivateNote non riceve la passphrase. La richiesta di creazione trasporta testo cifrato, un salt e i parametri di cui il browser del destinatario ha bisogno per provare la passphrase in locale. Non c’è un hash lato server il cui compito sia verificare la passphrase. Una passphrase sbagliata fa fallire la decifratura sul dispositivo.",
        "La passphrase protegge inoltre la chiave lato client in locale se il canale che trasporta il link è compromesso. Quel canale vede allora una chiave avvolta, non una chiave che può aprire la nota da sola. Non è il meccanismo che tiene PrivateNote fuori dal percorso del testo in chiaro. Quella separazione c’è già su una nota standard, con o senza passphrase. Condividi la passphrase su un canale diverso dal link. Lo stesso messaggio fa collassare i due livelli in uno — la stessa regola di [come condividere una password in modo sicuro](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "La cifratura locale produce la chiave lato client e il testo cifrato. Argon2id avvolge quella chiave, e la chiave avvolta resta nel frammento URL. TLS trasporta solo il testo cifrato al worker Cloudflare.",
          columns: [
            [
              { text: "Segreto" },
              { text: "Cifratura locale" },
              { text: "Testo cifrato", via: "TLS" },
              { text: "Server" },
            ],
            [
              { text: "Passphrase" },
              { text: "Argon2id locale" },
              { text: "Avvolgere la chiave" },
              { text: "Frammento URL" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "La stessa separazione, una proprietà alla volta.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Cifratura del payload", "Server", "Dispositivo del mittente"],
          ["Il testo in chiaro raggiunge il servizio", "Sì", "No"],
          ["La passphrase raggiunge il servizio", "Sì", "No"],
          [
            "Ruolo della passphrase",
            "Partecipa alla protezione lato server",
            "Deriva una chiave di wrapping locale",
          ],
          [
            "Verificatore o materiale memorizzato",
            "Verificatore bcrypt e payload cifrato, secondo la documentazione di OneTimeSecret",
            "Salt, parametri di wrap Argon2id e testo cifrato",
          ],
          ["Dove si esegue la decifratura", "Server applicativo di OneTimeSecret", "Dispositivo del destinatario"],
        ],
      },
      paragraphsAfterTable: [
        "La gestione delle chiavi di PrivateNote è descritta in [Come funziona](app:how-it-works): la chiave del contenuto viene avvolta con Argon2id, e la chiave avvolta viaggia nel link.",
      ],
    },
    {
      title: "L’ipotesi di fiducia rimanente del client web",
      paragraphs: [
        "La cifratura lato client in un browser non è un’applicazione web senza fiducia. La crittografia può essere eseguita in locale mentre il JavaScript che la implementa viene consegnato dal sito. Il browser si fida del codice che riceve per quella sessione.",
        "Chi può alterare quel JavaScript — tramite l’applicazione, un CDN o la pipeline di deployment — potrebbe modificare il client e catturare chiavi in una sessione browser futura. È un fallimento diverso dal furto di un database. Una compromissione dello storage espone testo cifrato. La consegna di codice malevolo attacca l’endpoint mentre la chiave è effettivamente presente.",
        "Un dump successivo del database non può fabbricare chiavi lato client che non sono mai state memorizzate lì. Un client attivamente compromesso può attaccare i segreti gestiti durante quella sessione. La stessa ipotesi è scritta nel modello di minaccia di PrivateNote: il codice applicativo consegnato non è stato modificato in modo malevolo, e i dispositivi del mittente e del destinatario sono fidati al momento della cifratura e della decifratura.",
        "Il software installato riduce quella dipendenza da una pagina appena scaricata. Una CLI, un’estensione dell’editor o un’app nativa esegue codice che hai installato. Quei client dipendono ancora dal sistema operativo, dalla firma, dalle dipendenze e dal canale di aggiornamento. Gli [strumenti per sviluppatori](app:developers) usano la stessa separazione del browser: cifrare in locale, caricare testo cifrato, lasciare la chiave nel fragment.",
      ],
    },
    {
      title: "Durata e riservatezza",
      paragraphs: [
        "Un link monouso risponde a due domande distinte. Per quanto tempo deve esistere il payload cifrato? E chi può decifrarlo mentre esiste? Distruggerlo dopo il recupero o la scadenza accorcia la finestra. Non decide chi potrebbe leggerlo durante quella finestra. Durata e riservatezza si sostengono a vicenda. L’una non sostituisce l’altra.",
        "La distinzione è più netta quando il payload è autorità: chiavi API, credenziali di database, token cloud, codici di recupero, password di infrastruttura. Un servizio di condivisione di segreti esiste perché il mittente vuole affidare quelle informazioni a meno sistemi. Se l’intermediario deve solo trasportare un oggetto cifrato opaco, far rispettare la scadenza e cancellarlo, il server può fare quel lavoro senza ricevere il segreto né la chiave che lo apre.",
      ],
    },
    {
      title: "Dove si colloca il confine",
      paragraphs: [
        "«Cifrato» non ti dice dove si colloca il confine di fiducia. Lo standard che vale la pena usare è un confine di fiducia minimo: il principio del minimo privilegio applicato a chi deve vedere il testo in chiaro. Nell’ingegneria crittografica moderna, l’obiettivo non è soltanto fidarsi che un server si comporti bene, ma ridurre fin dall’inizio la necessità matematica di quella fiducia.",
        "OneTimeSecret descrive un sistema cifrato lato server. Con la protezione tramite passphrase, afferma che il segreto memorizzato non può successivamente essere decifrato senza la passphrase, e che una compromissione del server lascerebbe il segreto al sicuro finché quella passphrase resta sconosciuta. Una passphrase debole può essere attaccata con brute-force. Se è debole, quella compromissione può comunque lasciare il segreto recuperabile. Il testo in chiaro e la passphrase raggiungono OneTimeSecret alla creazione, perché la cifratura avviene sui suoi server, e la passphrase viene reinviata al recupero così che quei server possano decifrare.",
        "PrivateNote fa una scelta architetturale diversa. Il payload viene cifrato prima di raggiungere il servizio, e la chiave del payload standard resta lato client. Una passphrase, quando ne imposti una, protegge inoltre quella chiave lato client in locale se il canale che trasporta il link è compromesso. Non viene inviata a PrivateNote.",
        "OneTimeSecret cifra il tuo segreto. Il client che usa il servizio di PrivateNote lo cifra prima che il servizio lo riceva. Quella distinzione non dipende dall’ipotesi che uno dei provider sia malevolo. Riduce la domanda all’architettura: quanti sistemi hanno bisogno di accesso al testo in chiaro perché il servizio funzioni?",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "OneTimeSecret memorizza il segreto in chiaro?",
          answer:
            "La loro documentazione dice di no. Cifrano sui loro server. Con una passphrase, affermano di memorizzare il segreto cifrato e un hash bcrypt della passphrase, non la passphrase, e che l’hash non può decifrare il segreto.",
        },
        {
          question: "Se imposto una passphrase su OneTimeSecret, il segreto è nascosto ai loro server?",
          answer:
            "Non durante la creazione, e non al recupero. OneTimeSecret afferma che il segreto e la passphrase vengono forniti al suo server così che il server possa eseguire la cifratura. Quando il destinatario apre il link, reinvia la passphrase tramite TLS, e la decifratura viene eseguita sui server di OneTimeSecret prima che il testo in chiaro venga restituito. Dopo la cifratura, OneTimeSecret afferma di scartare la passphrase in chiaro, di trattenere solo un hash bcrypt e di non poter decifrare il segreto memorizzato senza la passphrase originale.",
        },
        {
          question: "Cosa protegge una passphrase di PrivateNote?",
          answer:
            "La chiave lato client, se il canale che trasporta il link è compromesso. La nota stessa è già cifrata sul tuo dispositivo con AES-256-GCM. Argon2id deriva una chiave di wrapping dalla passphrase in locale, e quella chiave di wrapping cifra la chiave della nota. Il link contiene allora una chiave avvolta. PrivateNote riceve testo cifrato e un salt. Non riceve la passphrase né la chiave grezza. Una nota standard è cifrata prima dell’upload anche senza passphrase. Invia la passphrase su un canale separato dal link.",
        },
        {
          question: "La cifratura lato client può proteggere da un server PrivateNote compromesso?",
          answer:
            "Compromissione dei dati memorizzati o dell’API: sì, nel senso che la cifratura lato client isola i payload non letti, perché il server non ha la chiave del payload standard. Un dump successivo del database non può fabbricare chiavi che non sono mai state memorizzate lì. Consegna di codice client malevolo: no. Un attaccante che può modificare il JavaScript consegnato a una sessione browser futura potrebbe tentare di catturare la chiave mentre è presente. I client installati riducono quella dipendenza da una pagina appena scaricata.",
        },
      ],
    },
    {
      title: "Fonti primarie",
      paragraphs: [
        "Le informazioni di architettura su OneTimeSecret sono state verificate rispetto alla documentazione pubblica il 23 settembre 2026. Le implementazioni del prodotto e la documentazione possono cambiare.",
      ],
      bullets: [
        "[OneTimeSecret documentation](https://docs.onetimesecret.com/)",
        "[OneTimeSecret on security and passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret source code](https://github.com/onetimesecret/onetimesecret)",
        "[Come funziona la cifratura di PrivateNote](app:how-it-works)",
        "[PrivateNote per sviluppatori](blog:privatenote-for-developers), inclusa la CLI",
        "[RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), che separa il fragment dall’URI prima del dereference",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), sulla gestione lato client del fragment",
      ],
    },
  ],
  ctaTitle: "Cifrare prima che il segreto lasci il dispositivo",
  ctaBody:
    "Scrivi la nota nel browser. Il client la cifra in locale, mette la chiave nel link e può proteggere quella chiave con una passphrase che il server non riceve mai.",
  ctaPrimary: "Crea una nota privata",
  ctaSecondary: "Scopri come funziona la cifratura",
};
