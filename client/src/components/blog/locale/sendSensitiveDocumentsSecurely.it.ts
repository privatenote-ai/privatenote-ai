import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyIt: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Concetto di trasferimento sicuro di documenti: una busta sigillata e la consegna di un file cifrato su una scrivania ordinata",
  heroCaption:
    "La parte difficile raramente è il tasto Invia. È quello che succede a ogni copia dopo l’arrivo del documento.",
  intro: [
    "Immagina di dover inviare il tuo passaporto a una banca, il tuo commercialista che chiede documenti fiscali, il tuo datore di lavoro che richiede una prova d’identità, o un cliente che ha bisogno di un contratto firmato.",
    "L’operazione in sé richiede solo pochi secondi: allega il file, clicca su Invia, prosegui con la giornata. Il trasferimento raramente è la parte più debole del processo. Il vero problema inizia dopo l’arrivo del documento.",
    "Quell’allegato può rimanere per anni in caselle di posta, backup cloud, dispositivi sincronizzati, caselle archiviate e vecchie conversazioni di chat. In molte situazioni, il rischio maggiore per la privacy non è l’intercettazione durante il transito—è il fatto che le copie continuano a esistere molto dopo che il documento ha esaurito il suo scopo.",
    "Questa guida spiega perché la condivisione tradizionale dei documenti spesso non basta, cosa significa davvero condivisione sicura dei documenti, e come [la cifratura lato browser](blog:encrypted-vs-secure-file-sharing) e i [link monouso](blog:one-time-secret-links) ti aiutano a mantenere private le informazioni confidenziali.",
  ],
  sections: [
    {
      title: "Perché i documenti confidenziali meritano un trattamento diverso",
      takeaway:
        "Se un documento sarebbe difficile da sostituire—o doloroso da vedere trapelare—non trattarlo come una foto delle vacanze.",
      paragraphs: [
        "Non tutti i file meritano lo stesso livello di protezione. Perdere una foto delle vacanze online può essere una delusione. Perdere un documento confidenziale può avere conseguenze che durano anni.",
        "I documenti d’identità contengono spesso nome completo, data di nascita, numero di identificazione, nazionalità, firma e fotografia. I documenti finanziari rivelano reddito, risparmi, informazioni fiscali o dettagli del conto bancario. I documenti medici contengono informazioni profondamente personali, mentre i contratti includono spesso dettagli commercialmente sensibili che non erano destinati a diventare pubblici.",
        "Se qualcuno scopre la tua password, la cambi. Se qualcuno copia il tuo passaporto, la carta d’identità, la dichiarazione dei redditi o il contratto di lavoro, la situazione è molto più complicata. Ecco perché i documenti confidenziali meritano un approccio diverso rispetto alla comunicazione quotidiana.",
      ],
    },
    {
      title: "Il problema nascosto dell’e-mail",
      takeaway: "Il TLS protegge il viaggio; non impedisce l’accumulo di copie permanenti in seguito.",
      paragraphs: [
        "L’e-mail resta uno degli strumenti di comunicazione più utili mai creati. Non è mai stata progettata come sistema sicuro per la consegna di documenti.",
        "I provider di posta moderni proteggono i messaggi in transito con connessioni cifrate come il TLS. Una volta arrivato il messaggio, l’allegato viene tipicamente conservato per poter essere cercato, sincronizzato, filtrato, sottoposto a backup e recuperato in seguito.",
        "Un singolo allegato diventa rapidamente più copie: la tua cartella Posta inviata, la casella del destinatario, telefoni, laptop, archivi aziendali, backup cloud e, a volte, sistemi di inoltro automatico. Eliminare l’e-mail in seguito raramente rimuove ogni copia.",
        "Per le conversazioni quotidiane questo è generalmente accettabile. Per passaporti, contratti, estratti conto o referti medici, spesso non lo è. Per un’analisi più approfondita del perché l’e-mail sia un pessimo posto per i segreti, leggi [perché l’e-mail è il posto peggiore per i segreti](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Perché le app di messaggistica lasciano una traccia permanente",
      takeaway: "La chat rende facile la collaborazione, e la conservazione dei documenti accidentale.",
      paragraphs: [
        "Molte persone evitano l’e-mail e inviano invece documenti confidenziali tramite Slack, Microsoft Teams, WhatsApp, Signal, Telegram o Discord. Queste piattaforme risolvono la collaborazione. Non risolvono la gestione del ciclo di vita dei documenti.",
        "I file condivisi in chat rimangono spesso ricercabili per mesi o anni, si sincronizzano tra dispositivi, entrano nei backup automatici e vengono scaricati su computer personali. Anche dopo che la conversazione è stata dimenticata, i documenti spesso restano.",
        "Il rischio maggiore per la privacy spesso non è l’intercettazione da parte di hacker. È che le informazioni confidenziali accumulano silenziosamente copie che nessuno intendeva conservare. Lo stesso schema si ripete quando i team [incollano segreti in chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "L’archiviazione cloud risolve un problema diverso",
      takeaway:
        "I drive cloud sono progettati per un accesso duraturo; la consegna temporanea richiede una scadenza per design.",
      paragraphs: [
        "Servizi come Google Drive, OneDrive, Dropbox e iCloud sono eccellenti per la collaborazione, i backup e l’archiviazione a lungo termine. La consegna sicura di documenti è un problema diverso.",
        "Se diversi colleghi hanno bisogno di accesso continuo agli stessi file, l’archiviazione cloud è lo strumento giusto. Se vuoi semplicemente che una persona riceva oggi un documento confidenziale—e non ti serve più che sia disponibile il mese prossimo—i requisiti sono completamente diversi.",
        "I link di condivisione permanenti spesso rimangono nella cronologia del browser, in vecchie e-mail, documenti di progetto, messaggi di chat e segnalibri molto dopo che tutti pensano siano scomparsi. L’archiviazione cloud ottimizza per la disponibilità a lungo termine piuttosto che per la consegna temporanea.",
      ],
    },
    {
      title: "La condivisione sicura dei documenti è più della sola cifratura",
      takeaway: "La cifratura protegge i bit; i controlli sul ciclo di vita decidono per quanto tempo dura l’esposizione.",
      paragraphs: [
        "Quando le persone sentono “condivisione sicura dei documenti”, pensano spesso solo alla cifratura. La cifratura è essenziale. Non è tutta la storia.",
        "La condivisione sicura consiste nel ridurre l’esposizione non necessaria durante tutta la vita di un documento. Un sistema ben progettato dovrebbe rispondere a: Solo il destinatario previsto può accedere al documento? L’accesso scade automaticamente? Si evitano copie non necessarie? Il servizio riceve il documento originale o solo dati cifrati?",
        "La sicurezza non riguarda solo la protezione di un file durante il transito. Riguarda anche il limitare chi può accedervi—e per quanto tempo.",
      ],
    },
    {
      title: "E-mail contro link cifrato monouso",
      takeaway:
        "L’e-mail è costruita per conservare i messaggi; i link cifrati monouso sono costruiti per consegnare un documento e poi smettere di conservarlo.",
      comparisonTable: {
        headers: ["", "Allegato e-mail", "Link cifrato monouso"],
        rows: [
          ["Facilità di invio", "Molto alta", "Alta"],
          [
            "Copie create",
            "Molte (inviati, posta in arrivo, dispositivi, backup)",
            "Molte meno per progettazione",
          ],
          ["Durata dell’accesso", "Spesso indefinita", "Scade o si autodistrugge dopo l’uso"],
          [
            "Cosa vede il servizio",
            "Di solito il file originale",
            "Testo cifrato se cifrato prima nel browser",
          ],
          [
            "Più indicato per",
            "Posta quotidiana non sensibile",
            "Passaporti, contratti, documenti fiscali e d’identità",
          ],
        ],
        after: [
          "**Riga pronta per l’estratto:** Allegato e-mail = invio facile, copie che possono durare anni. Link cifrato monouso = cifratura nel browser prima del caricamento, accesso che scade, molte meno copie residue.",
        ],
      },
    },
    {
      title: "La cifratura nel browser riduce la fiducia richiesta",
      takeaway:
        "Cifra prima del caricamento così il servizio conserva testo cifrato—non il tuo documento originale.",
      paragraphs: [
        "Le piattaforme tradizionali di condivisione file generalmente ricevono il tuo documento originale prima di conservarlo o elaborarlo. La cifratura basata sul browser funziona diversamente.",
        "Prima che il file lasci il tuo computer, il browser lo cifra localmente. Il servizio conserva testo cifrato invece del documento originale. Senza la corrispondente chiave di decifratura, i dati conservati sono incomprensibili.",
        "Invece di fare affidamento completamente sul fornitore dopo che ha ricevuto il tuo documento, riduci in origine le informazioni disponibili al fornitore. La guida di PrivateNote [cifratura vs condivisione sicura di file](blog:encrypted-vs-secure-file-sharing) approfondisce questo modello.",
      ],
    },
    {
      title: "I link monouso riducono l’esposizione a lungo termine",
      takeaway: "La maggior parte delle fughe di dati è accesso residuo—non hacking da film.",
      paragraphs: [
        "Molte fughe di documenti avvengono perché vecchi documenti continuano a esistere: allegati e-mail nelle caselle di posta, link cloud che funzionano ancora, cronologie di chat che conservano vecchi file.",
        "I link monouso adottano un approccio diverso. Il destinatario recupera il documento una sola volta. Successivamente, i dati cifrati vengono rimossi oppure il link di condivisione scade permanentemente.",
        "Nessuna cartella condivisa dimenticata. Nessun link di download vecchio di anni. Nessun documento confidenziale in attesa silenziosa di essere scoperto.",
        "Nessuna tecnologia può impedire a un destinatario autorizzato di salvare intenzionalmente una copia dopo aver aperto il documento. Ciò che la condivisione monouso riesce a fare è eliminare molte delle copie non necessarie create dagli strumenti tradizionali.",
      ],
      calloutTitle: "Regola pratica",
      callout:
        "Se non ti sentiresti a tuo agio a pubblicare un documento su un sito web pubblico, pensaci bene prima di inviarlo come allegato e-mail permanente.",
    },
    {
      title: "Un ulteriore livello: condivisione protetta da password",
      takeaway: "Separa il link dalla password così un solo errore non esponga entrambi.",
      paragraphs: [
        "A volte anche il link di condivisione merita protezione: un’e-mail inoltrata per errore, la cronologia del browser visibile, o un account di messaggistica compromesso.",
        "Aggiungere una password crea un ulteriore livello. Anche se qualcuno scopre il link di condivisione, non può comunque decifrare il documento senza la password.",
        "Per informazioni particolarmente sensibili, comunica la password tramite un canale diverso—telefono o di persona—piuttosto che nello stesso messaggio del link. Lo stesso schema si applica quando [condividi una password in modo sicuro](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "La condivisione sicura di documenti in Europa e oltre",
      takeaway:
        "Il GDPR non nomina un prodotto specifico—ma limitare accesso e conservazione ne rispetta lo spirito.",
      paragraphs: [
        "In Europa, le organizzazioni trattano informazioni personali secondo il GDPR. Non richiede un servizio specifico di condivisione file, ma richiede misure tecniche e organizzative adeguate in base al rischio.",
        "La condivisione cifrata, la disponibilità limitata e un numero minore di copie non necessarie sono esempi pratici di questi principi. Le stesse idee si applicano sia che tu stia inviando documenti a un commercialista, un datore di lavoro, un avvocato, un’università, un fornitore sanitario, una banca, un assicuratore o un’autorità pubblica.",
      ],
    },
    {
      title: "Quando dovresti usare la condivisione sicura dei documenti?",
      takeaway:
        "Se avesse importanza che questo documento diventasse pubblico, non inviarlo come allegato permanente.",
      paragraphs: [
        "Questo include passaporti, carte d’identità nazionali, patenti di guida, documenti finanziari, documenti fiscali, richieste di mutuo, contratti di lavoro, documentazione assicurativa, accordi legali, referti medici, informazioni aziendali confidenziali, dati di ricerca, informazioni sui clienti e proprietà intellettuale.",
        "Più difficile sarebbe sostituire un documento—o maggiori le conseguenze della sua esposizione—tanto più attenzione richiede la sua condivisione.",
      ],
    },
    {
      title: "Modi pratici per ridurre il rischio",
      takeaway: "La sicurezza perfetta non esiste; meno copie e un accesso più breve aiutano quasi sempre.",
      paragraphs: [
        "Prima di inviare un documento confidenziale, esegui questa breve checklist:",
      ],
      checklist: [
        "Verifica il destinatario — persona corretta, indirizzo o canale corretto",
        "Invia solo ciò che serve — le pagine necessarie, non l’intero fascicolo quando possibile",
        "Usa un link scadente o monouso — non un allegato permanente",
        "Aggiungi una password per i file ad alta sensibilità — e condividila su un canale separato",
        "Confermata la consegna, fai pulizia — elimina le copie locali e nella casella di posta che non ti servono più",
      ],
      paragraphsAfterChecklist: [
        "Ridurre il numero di copie è uno dei miglioramenti della privacy più semplici ed efficaci che chiunque possa fare.",
      ],
      midCta: {
        body: "Pronto a inviare la scansione di un passaporto, un contratto o un documento fiscale senza lasciare una traccia permanente nell’e-mail?",
        button: "Avvia un trasferimento file sicuro",
      },
    },
    {
      title: "Domande frequenti",
      takeaway: "La cifratura aiuta; la scadenza e un minor numero di copie completano il lavoro.",
      faqs: [
        {
          question: "Proteggere un PDF con password è sufficiente?",
          answer:
            "Aiuta, ma non risolve il problema della persistenza. Il PDF cifrato può comunque rimanere per anni in archivi e-mail, backup cloud e download. Combina la cifratura con una consegna scadente o monouso.",
        },
        {
          question: "L’HTTPS non è già sicuro?",
          answer:
            "L’HTTPS protegge i dati in transito. Non impedisce necessariamente al servizio ricevente di accedere o conservare il file in seguito. La cifratura basata sul browser cifra prima del caricamento.",
        },
        {
          question: "E i file ZIP cifrati?",
          answer:
            "Ragionevoli se usi una cifratura forte e comunichi la password separatamente—ma lasciano comunque file permanenti nei sistemi di posta a meno che il metodo di condivisione non limiti anche per quanto tempo il file resta disponibile.",
        },
        {
          question: "La condivisione sicura può impedire al destinatario di salvare il documento?",
          answer:
            "No. Una volta che qualcuno riceve legittimamente un documento, può salvarlo, stamparlo o fotografare lo schermo. La condivisione sicura riduce l’esposizione non necessaria prima e dopo la consegna; non può impedire azioni intenzionali da parte di destinatari fidati.",
        },
      ],
    },
    {
      title: "Condividere documenti confidenziali con PrivateNote",
      takeaway:
        "PrivateNote è pensato per la consegna temporanea di documenti cifrati—non per l’archiviazione cloud permanente.",
      paragraphs: [
        "PrivateNote è stato progettato attorno a un’osservazione semplice: molti documenti confidenziali devono esistere online solo per il tempo necessario a un unico destinatario per recuperarli.",
        "Invece di trattare la condivisione dei documenti come archiviazione permanente, PrivateNote cifra i file nel tuo browser prima del caricamento e conserva solo il testo cifrato risultante. Puoi scegliere la scadenza automatica, creare link monouso e, quando appropriato, proteggere il documento con una password aggiuntiva tramite il [trasferimento sicuro di file](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Cosa fa PrivateNote", "Cosa non fa"],
        rows: [
          [
            "Cifra nel tuo browser prima del caricamento",
            "Leggere il tuo documento originale sul server",
          ],
          [
            "Usa chiavi crittografiche separate per testo delle note, file e metadati",
            "Mescolare queste responsabilità sotto un’unica chiave riutilizzabile",
          ],
          [
            "Usa cifratura autenticata AES-256-GCM, con policy (scadenza / limiti di accesso) legata al testo cifrato",
            "Fare affidamento su una “cifratura” che ignora chi può aprire la nota o per quanto tempo",
          ],
          [
            "Supporta link monouso e con scadenza per limitare l’accesso residuo",
            "Mantenere i documenti disponibili indefinitamente per impostazione predefinita, per comodità",
          ],
          [
            "Ti permette di aggiungere una password opzionale come secondo fattore per il link",
            "Impedire a un destinatario autorizzato di salvare o stampare dopo l’apertura",
          ],
          [
            "Riduce le copie online non necessarie prima e dopo la consegna",
            "Sostituire il processo organizzativo, il giudizio del destinatario o l’archiviazione a lungo termine in un vault",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Questo approccio non può impedire a un destinatario autorizzato di salvare una copia dopo aver aperto il documento—nessuna tecnologia può farlo. Ciò che riduce è il numero di copie non necessarie che rimangono online prima e dopo la consegna.",
      ],
    },
    {
      title: "Considerazioni finali",
      takeaway:
        "Il miglior controllo è spesso il ciclo di vita più breve—solo le persone che ne hanno bisogno, solo per il tempo necessario.",
      paragraphs: [
        "Internet ha reso la condivisione di documenti quasi senza sforzo. Ha anche reso il conservarli per sempre straordinariamente facile.",
        "La maggior parte dei documenti confidenziali non deve rimanere accessibile per mesi o anni. Deve semplicemente raggiungere in sicurezza il destinatario previsto.",
        "Scegliere un metodo che cifra prima del caricamento, limita le copie non necessarie e rimuove i dati una volta che hanno svolto il loro scopo è uno dei modi più semplici per migliorare la privacy, senza rendere molto più difficile la condivisione quotidiana dei documenti.",
        "La misura di sicurezza più forte non è sempre la crittografia più sofisticata. A volte è semplicemente assicurarsi che un documento confidenziale esista solo per le persone che ne hanno bisogno, e solo per il tempo in cui ne hanno bisogno.",
      ],
    },
  ],
  ctaTitle: "Invia il documento. Mantieni le copie sotto controllo.",
  ctaBody:
    "Cifra un file nel tuo browser, imposta una scadenza o un’apertura monouso, e condividi un link—non un allegato permanente che vive per sempre nella casella di posta di qualcuno.",
  ctaButton: "Trasferisci un file in modo sicuro",
};
