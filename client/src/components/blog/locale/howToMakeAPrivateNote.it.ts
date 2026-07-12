import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteIt: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop su una scrivania con schermata per creare una nota privata, lettura singola e scadenza, accanto a un taccuino in pelle chiuso con lucchetto",
  intro: [
    "Vuoi scrivere qualcosa di sensibile—una [password](app:password-generator), un codice di recupero, un messaggio riservato o una nota personale—e mantenerlo privato. Forse hai cercato «how to make a note private» e trovato consigli generici su come bloccare un'app, nascondere una cartella locale o attivare un'impostazione di privacy del dispositivo.",
    "Quei passaggi aiutano con la privacy casuale, contro gli sguardi indiscreti. **Non** risolvono il problema più difficile: condividere una nota con un'altra persona senza lasciare una copia permanente e ricercabile su un server di terze parti.",
    "Una nota davvero privata richiede tre pilastri distinti: **crittografia prima del caricamento**, **controllo degli accessi rigoroso** e **effimerità pianificata**—un meccanismo per scomparire. Ecco come ottenerlo nella pratica.",
  ],
  sections: [
    {
      title: "Cosa significa davvero «privato»",
      paragraphs: [
        "Nelle applicazioni quotidiane, «privato» di solito significa nascosto da altre persone fisiche che prendono il tuo dispositivo, protetto dal codice del telefono o bloccato dietro un abbonamento premium. È molto utile—ma non è la stessa cosa della privacy crittografica.",
        "Quando condividi informazioni sensibili sul web, la vera domanda è: **chi può leggere la nota dopo che è uscita dalle tue mani?**",
        "Può leggerla il fornitore del servizio? Può leggerla qualcuno non autorizzato che ottiene accesso a un backup cloud? Può un futuro collega cercare nelle vecchie cronologie chat e trovarla mesi dopo?",
        "Una nota privata, nel senso rigoroso della sicurezza, è una in cui solo il destinatario previsto può leggere il contenuto, il servizio di hosting non vede mai il testo in chiaro sottostante e la nota non resta online per sempre.",
      ],
    },
    {
      title: "Perché le app per note comuni non bastano",
      paragraphs: [
        "Apple Notes, Google Keep, Notion ed Evernote sono strumenti eccellenti per l'organizzazione personale, ma in genere sono la scelta sbagliata per distribuire segreti monouso a causa di diversi tratti intrinseci:",
      ],
      bullets: [
        "**Sincronizzazione e backup** — La tua nota viene silenziosamente copiata su più dispositivi, account di cloud storage e archivi storici a lungo termine che non controlli direttamente.",
        "**Ricerca e condivisione** — Una condivisione pubblica accidentale, ricerche ampie nell'area di lavoro o un singolo account compromesso possono esporre note storiche mesi dopo.",
        "**Accesso del fornitore** — A meno che l'app non offra esplicitamente crittografia end-to-end per quella specifica nota, il fornitore mantiene la capacità tecnica di leggere i tuoi contenuti sui propri server.",
        "**Nessuna distruzione dopo la lettura** — La maggior parte delle app di organizzazione è strutturalmente progettata per conservare le informazioni a tempo indeterminato, non per eliminarle dopo una sola lettura.",
      ],
      callout:
        "Per il diario personale a lungo termine, le app per note standard sono ideali. Per password, codici di recupero e consegne riservate, serve uno strumento effimero costruito per la [consegna di segreti monouso](blog:one-time-secret-links)—non per l'archiviazione permanente.",
    },
    {
      title: "Come creare una nota privata: passo dopo passo",
      paragraphs: [
        "Non serve registrare un account per inviare una nota privata sicura monouso. Il flusso strutturato qui sotto descrive ciò che i servizi crittografati nel browser sono progettati per eseguire in sicurezza.",
      ],
      flowDiagramCaption: "Flusso di lavoro per nota privata a colpo d'occhio",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Redigi il messaggio nel browser",
          body: "Apri [PrivateNote](app:home) e digita il messaggio direttamente. Sei già in un'altra scheda? L'[estensione Chrome](chrome:extension) crittografa il testo selezionato sul posto—lo stesso flusso lato client, senza aprire prima il sito. Evita di incollare il segreto grezzo in client email standard o thread di testo non crittografati in anticipo. Puoi anche usare [Write with Private AI](app:home) per redigere in locale sul dispositivo prima della crittografia.",
        },
        {
          step: "Passo 2",
          title: "Configura le impostazioni di privacy effimera",
          body: "Imposta una finestra di scadenza adatta al compito. Attiva la distruzione dopo la lettura se la nota deve scomparire completamente dopo la prima apertura riuscita, e aggiungi una passphrase opzionale per contenuti molto sensibili.",
        },
        {
          step: "Passo 3",
          title: "Lascia che il browser esegua la crittografia locale",
          body: "Quando clicchi su crea, la crittografia avviene interamente lato client. Viene caricato solo il testo cifrato. La chiave di decrittazione resta incorporata nel frammento URL—la parte dopo `#`—che i browser web moderni non trasmettono ai server di hosting.",
        },
        {
          step: "Passo 4",
          title: "Isola i canali di condivisione",
          body: "Trasmetti il link sicuro generato al destinatario tramite il canale preferito. Se hai configurato una password manuale, condividila out-of-band—con una telefonata, Signal o di persona in modo sicuro.",
        },
        {
          step: "Passo 5",
          title: "Conferma la consegna e cancella lo stato locale",
          body: "Usa le notifiche di consegna opzionali per verificare quando la nota è stata aperta o scaduta con successo. Una volta consumata, non resta alcuna copia in chiaro nella posta in uscita o nei log storici delle chat.",
        },
      ],
    },
    {
      title: "Impostazioni di privacy da attivare",
      paragraphs: [
        "Piccoli aggiustamenti architetturali producono enormi guadagni di sicurezza. Quando crei una nota effimera, massimizza le difese utilizzando queste configurazioni:",
      ],
      bullets: [
        "**Distruzione dopo la lettura** — Lo standard d'oro per password e credenziali. Il testo cifrato sottostante viene eliminato dal server nel momento in cui viene letto una volta con successo.",
        "**Finestre di scadenza brevi** — Se il destinatario non deve aprire i dati all'istante, limita la finestra di esposizione a ore o giorni—mai senza limiti.",
        "**Password a strati** — Aggiunge un secondo fattore cruciale. Un attaccante dovrebbe compromettere sia il canale di trasporto del link sia ottenere la password separata per leggere il contenuto.",
      ],
    },
    {
      title: "Cosa non mettere in una nota privata basata sul web",
      paragraphs: [
        "I link crittografati nel browser sono eccellenti per segreti temporanei o sostituibili—come credenziali Wi‑Fi, token API e messaggi aziendali. Hanno dei limiti.",
      ],
      callout:
        "**Regola di sicurezza critica:** Non digitare mai una seed phrase di criptovaluta, un backup master di hardware wallet o una chiave privata root su un sito web. Gli asset master insostituibili giustificano la crittografia locale basata su terminale con age o OpenSSL prima della trasmissione. Per quell'architettura, leggi [seed phrase crypto e link monouso](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Quando una nota privata è lo strumento giusto",
      paragraphs: [
        "Rivolgiti a una nota privata dedicata invece di email o chat standard quando consegni informazioni sensibili:",
      ],
      table: [
        {
          dataType: "Credenziali",
          scenario:
            "Passare una [password o codice di recupero](blog:how-we-generate-passwords) a un familiare o collega di fiducia.",
        },
        {
          dataType: "Chiavi di accesso",
          scenario:
            "Distribuire una [chiave API o segreto di firma webhook](blog:how-to-share-api-key-securely) durante l'onboarding di uno sviluppatore.",
        },
        {
          dataType: "Accesso fisico",
          scenario:
            "Condividere codici porta temporanei, PIN di allarme o credenziali Wi‑Fi per ospiti.",
        },
        {
          dataType: "Comunicazioni aziendali",
          scenario:
            "Inviare un messaggio aziendale riservato che non debba essere indicizzato dagli [archivi di chat o email aziendali](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "La nostra filosofia in PrivateNote",
      paragraphs: [
        "Abbiamo progettato PrivateNote per riportare l'equilibrio della fiducia verso l'utente. Gestendo le operazioni crittografiche interamente nel browser prima che il payload raggiunga la nostra infrastruttura, i nostri server restano strutturalmente ciechi ai tuoi segreti in chiaro.",
        "Crediamo anche in una chiara trasparenza sui limiti del prodotto. Se invii un token di accesso temporaneo a un collega, un link crittografato monouso è uno strumento eccellente. Se stai gestendo i tuoi risparmi di una vita, crittografa prima in locale su una macchina offline.",
        "La sicurezza non consiste nel trovare uno strumento magico universale. Consiste nell'adattare il flusso di lavoro al valore di ciò che proteggi. Per il modello tecnico dietro la crittografia nel browser, leggi [come funziona PrivateNote](app:how-it-works) e [cosa significa la crittografia end-to-end lato client](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Tipo di dato",
    scenario: "Scenario di condivisione ideale",
  },
  closingTitle: "Crea una nota privata ora",
  closingBody: [
    "Nessun account richiesto. Scrivi la nota, configura le impostazioni di privacy e condividi un link sicuro in meno di un minuto.",
  ],
  fileSharingNote:
    "Devi condividere anche documenti? [Trasferimento file sicuro](app:secure-file-transfer) usa lo stesso modello di crittografia lato browser. L'invio richiede un account gratuito; i destinatari possono aprire i link senza registrarsi.",
  chromeExtensionNote:
    "Usi spesso PrivateNote? L'[estensione Chrome](chrome:extension) aggiunge crittografare e condividere alla barra degli strumenti o al menu contestuale—utile quando una password o una chiave API compare a metà conversazione.",
  tagline: "Crittografa prima. Condividi un link. Fallo scadere.",
  relatedReading: "Letture correlate",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Link di distruzione dopo la lettura, il frammento URL e perché l'effimerità batte email o Slack per i segreti monouso.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Perché l'email crea copie durature dei segreti—e cosa usare al posto per le consegne riservate.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Un flusso più sicuro per le chiavi API: limitare l'ambito, crittografare in locale, inviare il link—non il segreto grezzo.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Cosa significa davvero l'E2EE lato client e come differisce dalla sola sicurezza del trasporto.",
    },
  ],
};
