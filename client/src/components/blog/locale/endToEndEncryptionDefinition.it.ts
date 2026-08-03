import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionIt: E2eeDefinitionArticleCopy = {
  intro: [
    "La cifratura end-to-end è una delle espressioni più ripetute nel marketing della sicurezza. È anche una delle più facili da svuotare. La vera definizione non è che i dati siano cifrati da qualche parte. La vera definizione riguarda chi può decifrarli.",
    "Se il provider possiede le chiavi, può recuperarle o riceve testo in chiaro durante il normale funzionamento, il sistema può anche essere cifrato, ma non è cifrato end-to-end in senso rigoroso.",
  ],
  definitionTitle: "La definizione utile più breve",
  definitionBody:
    "Cifratura end-to-end significa che solo gli endpoint possiedono le chiavi necessarie per decifrare i dati. Il provider può conservare o inoltrare testo cifrato, ma non dovrebbe possedere né le chiavi né il testo in chiaro.",
  tableHeaders: ["Modello", "Cifratura", "Il server vede il testo in chiaro?", "Il server ha le chiavi?"],
  tableRows: [
    { model: "Sicurezza di trasporto (TLS)", happens: "Tra browser e server", plaintext: "Sì, sul server", keys: "Sì, per l’elaborazione lato server" },
    { model: "Cifratura lato client imperfetta", happens: "Sul dispositivo", plaintext: "Forse", keys: "Sì, se le chiavi vengono caricate o sono recuperabili" },
    { model: "Vera E2EE", happens: "Agli endpoint", plaintext: "No", keys: "No" },
  ],
  flowNodes: [
    { title: "Browser del mittente", body: "Cifra localmente prima dell’invio" },
    { title: "Storage PrivateNote", body: "Conserva solo testo cifrato" },
    { title: "Browser del destinatario", body: "Decifra con la chiave nel frammento" },
  ],
  sections: [
    {
      title: "Cifratura non significa automaticamente cifratura end-to-end",
      paragraphs: [
        "La maggior parte dei servizi web seri usa TLS. È importante: TLS protegge i dati mentre viaggiano tra il browser e il server e impedisce agli attaccanti sulla rete locale di leggere la connessione.",
        "Ma TLS termina sul server. Quando la richiesta arriva, il servizio di solito può vedere il testo in chiaro. Il provider può poi conservarlo, scannerizzarlo, indicizzarlo, elaborarlo o cifrarlo di nuovo a riposo con chiavi sotto il suo controllo.",
        "Questa è cifratura del trasporto. Da sola, non è cifratura end-to-end.",
      ],
      callout: "Il test pratico è semplice: il provider può ottenere la chiave di decifratura o il testo in chiaro? Se sì, il sistema non è davvero cifrato end-to-end.",
    },
    {
      title: "La definizione del crittografo",
      paragraphs: [
        "Una definizione precisa di E2EE parte dal possesso delle chiavi. In un vero sistema end-to-end, le chiavi di cifratura e decifratura sono create e detenute dagli endpoint, non dal servizio di consegna.",
        "Il server può instradare, conservare, limitare il traffico ed eliminare testo cifrato. Può far funzionare il servizio. Ma non possiede il materiale crittografico necessario per trasformare il testo cifrato in contenuto leggibile.",
        "La nota analisi di Matthew Green sulla controversia sulla cifratura di Zoom chiarisce bene questo punto: la proprietà centrale non è solo che esista cifratura, ma che le chiavi di decifratura non siano disponibili al provider.",
      ],
      bullets: [
        "L’endpoint del mittente può cifrare i dati.",
        "L’endpoint del destinatario può decifrare i dati.",
        "Il server intermedio gestisce solo testo cifrato.",
        "Una compromissione del server non dovrebbe esporre contenuti in chiaro.",
      ],
    },
    {
      title: "La cifratura lato client può comunque non bastare",
      paragraphs: [
        "Cifratura lato client significa che l’operazione crittografica avviene localmente prima dell’invio. È necessaria per molti design E2EE, ma da sola non è sufficiente.",
        "Un servizio potrebbe cifrare i dati nel browser e poi caricare sia il testo cifrato sia la chiave corrispondente nel backend. La cifratura è avvenuta lato client, ma il provider ha comunque la chiave. Questo rompe il confine end-to-end.",
        "La distinzione importante è il possesso esclusivo della chiave. Se il provider può accedere, recuperare, ruotare, depositare o rigenerare la chiave utilizzabile, l’utente sta ancora affidando al provider l’accesso al testo in chiaro.",
      ],
    },
    {
      title: "Come si inseriscono nel modello le note con frammento URL",
      paragraphs: [
        "PrivateNote usa una versione basata sul browser di questa architettura per le note monouso. Il browser del mittente cifra la nota localmente. Il payload cifrato viene caricato nello storage. La chiave di decifratura viene inserita nel frammento dell’URL: la parte dopo il simbolo #.",
        "I browser non inviano il frammento dell’URL al server nella richiesta HTTP. Questo significa che il server riceve il testo cifrato, ma non la chiave. Quando il destinatario apre il link, il suo browser ha il frammento localmente e può decifrare la nota dopo il passaggio di apertura.",
        "Non è la stessa topologia di Signal o MLS, dove gli endpoint sono di solito dispositivi associati ad account con chiavi pubbliche persistenti. Ma la proprietà di sicurezza centrale è la stessa: il provider di storage non possiede la chiave necessaria per decifrare il contenuto.",
      ],
    },
    {
      title: "Anche il canale di consegna conta",
      paragraphs: [
        "Un link cifrato monouso è potente, ma il link completo diventa sensibile perché porta con sé la chiave di decifratura nel frammento. Se incolli quel link in un canale che registra messaggi, sincronizza cronologie o è monitorato da un amministratore, quel canale può esporre il segreto prima che venga aperto.",
        "Per questo scadenze, lettura unica e password opzionali sono importanti sul piano operativo. Non cambiano la definizione di E2EE, ma riducono il danno se un link viene inoltrato, registrato o visualizzato in anteprima da un software.",
        "Per materiale molto sensibile, invia il link su un canale e condividi la password opzionale su un altro. Separi così il possesso del payload cifrato dal possesso del segreto umano.",
      ],
    },
    {
      title: "La cautela sugli attacchi offline",
      paragraphs: [
        "La protezione con password aggiunge difesa in profondità, ma ha una cautela crittografica reale. Se un attaccante ottiene il link completo e scarica il testo cifrato prima della scadenza, il tentativo di indovinare la password può diventare un attacco offline. I limiti di frequenza del server non aiutano più, perché l’attaccante può provare le password localmente contro il testo cifrato.",
        "PrivateNote usa Argon2id per le note protette da password. Argon2id è una funzione di derivazione della chiave memory-hard, che aumenta il costo di ogni tentativo, soprattutto per attacchi brute-force pesanti su GPU.",
        "Questo non rende sicure le password deboli. Una password corta o riutilizzata può comunque fallire. Più forte è la password opzionale, più utile diventa questo secondo livello.",
      ],
    },
    {
      title: "Perché l’architettura conta",
      paragraphs: [
        "La E2EE cambia il modello di fiducia. Con lo storage ordinario cifrato a riposo, gli utenti si affidano a policy del provider, controlli sui dipendenti, gestione legale e prevenzione delle violazioni. Con la cifratura end-to-end, il provider è limitato strutturalmente: può conservare dati cifrati, ma non può decifrarli.",
        "Questo non elimina ogni rischio. Malware sull’endpoint, estensioni browser malevole, link copiati, password deboli e canali di consegna insicuri contano ancora. La crittografia restringe il confine di fiducia; non elimina il giudizio operativo.",
        "Il valore resta significativo: una violazione del database dovrebbe esporre testo cifrato illeggibile, non il contenuto dei messaggi. È la differenza tra promettere di non leggere i dati ed essere incapaci di leggerli.",
      ],
    },
  ],
  continueReadingTitle: "Continua a leggere",
  referencesTitle: "Riferimenti",
  references: [
    { label: "Matthew Green, “Does Zoom use end-to-end encryption?”", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
