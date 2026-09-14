import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersIt: SecureClientDeliveryForLawyersArticleCopy = {
  intro: [
    "Le comuni app di messaggistica lasciano una cronologia. Per molte comunicazioni coperte dal segreto professionale, l’esigenza pratica è opposta: trasmettere un’informazione sensibile senza trasformarla in un’altra conversazione permanente. La cifratura conta; conta anche chi potrà in seguito recuperare uno scritto, e per quanto tempo.",
    "Gli studi sanno che la posta elettronica non è una cassaforte. Molti passano a Signal o WhatsApp perché «è cifrato». È insufficiente. Quelle applicazioni sono fatte per conservare una conversazione. Molte comunicazioni tra avvocato e cliente devono fare l’opposto: consegnare al cliente un’istruzione, una bozza o un allegato, e poi smettere di accumulare copie.",
    "La difficoltà è pratica e giuridica. Una parte rilevante della clientela non installerà Signal. Non aggiungerà una seconda app di messaggistica «sicura» accanto al WhatsApp di famiglia. Aprirà un link nel browser già presente. Soprattutto nella difesa penale, la professione ha bisogno di un canale che assomigli a una corrispondenza di studio, non a un messaggio in una normale app di chat.",
  ],
  sections: [
    {
      title: "Perché una chat cifrata può comunque lasciare una cronologia",
      paragraphs: [
        "La cifratura end-to-end di Signal e WhatsApp protegge efficacemente il contenuto dall’accesso del fornitore del servizio. Ma cifratura e persistenza sono due questioni diverse: un messaggio può essere ben protetto e restare comunque disponibile sui dispositivi, nei backup o sui computer collegati. È questa seconda questione che conta, in pratica, per lo studio e, in particolare, per la difesa penale:",
      ],
      bullets: [
        "Resta una cronologia consultabile sul telefono del cliente, su quello di un congiunto o su un apparecchio che sarà poi perquisito, smarrito o sottoposto a perizia?",
        "Backup cloud, computer collegati, anteprime di notifica e screenshot inoltrati moltiplicano il contenuto oltre le parti originarie?",
        "Nasce, senza volerlo, un commento scritto corrente che non doveva entrare nel fascicolo e poi riappare come traccia digitale?",
      ],
      paragraphsAfterBullets: [
        "Lo stesso schema si ritrova fuori dall’udienza: i messaggi scritti sopravvivono all’occasione che li ha originati. Si veda [note effimere per i messaggi di lavoro](blog:workplace-texts-private-note) e [perché i segreti non vanno in chat](blog:secrets-never-send-in-chat). Per documenti d’identità, referti e contratti l’obiezione vale anche per gli [allegati di posta](blog:why-email-is-worst-for-secrets).",
        "Non è un invito a distruggere ciò che lo studio deve conservare. Gli obblighi di conservazione del fascicolo, la tenuta regolare degli atti e, ove disposte, le misure di assicurazione restano. Il punto è più stretto: molte comunicazioni operative — istruzioni puntuali, credenziali di accesso, formulazioni solo per il cliente, un allegato sensibile che non deve vivere nella chat di famiglia — non devono fossilizzarsi in un’app di messaggistica.",
      ],
    },
    {
      title: "Difesa penale, custodia cautelare e il cliente senza seconda app",
      paragraphs: [
        "L’obiezione è più acuta nella difesa penale. Il cliente è sotto pressione, a volte in custodia cautelare o in esecuzione di pena, usa il telefono di un familiare e raramente può adottare un proprio insieme di strumenti di riservatezza. Chiedergli di «installare Signal» fallisce in molti fascicoli. WhatsApp è spesso già sul dispositivo, ed è proprio quello il problema. È un ambiente di comunicazione personale: lì discute la famiglia, circolano gli screenshot, e un’istruzione coperta dal segreto sta accanto allo scherzo di un cugino.",
        "Si aggiunge la prassi di perquisizioni e sequestri. Se il telefono è sequestrato, la cronologia locale è sull’apparecchio. PrivateNote non modifica ciò che le autorità possono legalmente sequestrare o esaminare. Pone un’altra domanda: quali copie il cliente stesso conservi, per impostazione predefinita, su un telefono quotidiano.",
        "Tra le comunicazioni che non dovrebbero restare in quell’ambiente:",
      ],
      bullets: [
        "Istruzioni sull’atteggiamento processuale, sulla custodia cautelare, sulle misure, sulla cauzione o su un patteggiamento.",
        "Bozze di dichiarazione, memoria o arringa sulla pena che il cliente deve approvare prima del deposito.",
        "Indirizzi, certificati medici, situazione patrimoniale o identità di un teste prospettato: necessari oggi, pericolosi se restano.",
        "Accessi una tantum a un portale, a un’udienza da remoto o a un documento che il cliente deve leggere una volta, senza archiviarlo in chat.",
        "Avvocato ad avvocato: corrispondente, sostituto in udienza, collega che copre un’udienza — gli atti servono ora, non un gruppo permanente.",
      ],
      paragraphsAfterBullets: [
        "In tutti questi casi, l’obiettivo è trasmettere il contenuto al destinatario previsto senza ampliare inutilmente il numero di persone che potrebbero ricostruirlo in seguito. Una conferma di lettura in una messaggistica non equivale a un registro di consegna pensato per lo studio. Non identifica lo studio. Non somiglia a una comunicazione di cui un cliente già diffidente verso i link possa fidarsi a colpo d’occhio.",
      ],
    },
    {
      title: "Di che cosa ha davvero bisogno la professione",
      paragraphs: [
        "Un canale adatto alla trasmissione di informazioni riservate deve soddisfare pochi requisiti essenziali. Il cliente non deve creare un account né installare software. La cifratura deve avvenire sul dispositivo del mittente prima del caricamento, così il servizio memorizza solo cifrato, non l’istruzione. L’accesso deve potersi distruggere dopo la lettura e scadere. La pagina di apertura deve presentarsi come corrispondenza di studio, non come un servizio anonimo per condividere testo. Il mittente deve sapere che il link è stato aperto, revocarlo se il numero era errato e, per gli allegati sensibili, ostacolare il download non necessario.",
        "È la logica di un [link segreto monouso](blog:one-time-secret-links), applicata all’esercizio. PrivateNote cifra il contenuto nel browser prima che lasci il dispositivo. I destinatari aprono un URL unico; non serve un account. Lo studio può inviare il link sul canale che il cliente già usa — SMS, e-mail, anche una breve telefonata in cui si detta l’indirizzo — senza collocare l’istruzione in quel canale. Il contenuto sensibile è nella nota. Chat o casella tengono solo un link che smette di funzionare.",
      ],
      comparisonTable: {
        headers: ["Esigenza dell’esercizio", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Il cliente non installa un’applicazione",
            "No — l’applicazione è il canale",
            "Sì — browser ordinario",
          ],
          [
            "Nessuna cronologia duratura per impostazione",
            "Conversazione all’interno di un’app; possono essere configurati messaggi a scomparsa",
            "Trasmissione puntuale tramite link; lettura unica e scadenza come modello principale",
          ],
          [
            "Identità dello studio alla consegna",
            "Profilo o identità all’interno della messaggistica",
            "Logo, nome dello studio e pagina di apertura con identità dello studio",
          ],
          [
            "Prova che gli atti sono stati ritirati",
            "Le conferme di lettura appartengono alla chat, non a un registro di consegna dello studio",
            "Avvisi di apertura e prova di accesso (solo stato)",
          ],
          [
            "Revoca in caso di numero errato",
            "Il messaggio è già sul dispositivo",
            "Revocare una nota non aperta",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal e WhatsApp offrono anche messaggi a scomparsa. Il loro modello resta quello di una conversazione in un’app di messaggistica, mentre PrivateNote è pensato come una trasmissione puntuale tramite link. Per i documenti anziché brevi istruzioni, si veda [come inviare documenti sensibili in sicurezza](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Usarlo insieme: un’abitudine di studio",
      paragraphs: [
        "Il valore cresce quando gli avvocati usano tra loro lo stesso canale che usano con il cliente. Il corrispondente, il sostituto in udienza, la collega che copre una comparizione e il cliente condividono allora un’aspettativa: il sensibile arriva come link monouso con l’identità dello studio; non finisce in un gruppo; non diventa un’altra traccia permanente e consultabile.",
        "È uno standard di esercizio, non un prodotto basato su licenze per singolo utente. PrivateNote Business è un account professionale. Un avvocato, un collaboratore o un piccolo studio possono apporre nome e segno su ogni pagina di apertura. I colleghi con un proprio account Business o Starter possono restituire gli atti allo stesso modo. Il cliente non ha comunque bisogno di un account. La disciplina comune è il punto: smettere di trattare le app di messaggistica di uso quotidiano come recipiente predefinito del traffico operativo coperto dal segreto.",
        "Il marchio non è vanità. Un cliente abituato a diffidare dei link sconosciuti dovrebbe poter riconoscere immediatamente il contesto dell’invio: nome dello studio, logo, identità del mittente e messaggio di accompagnamento. Questo non autentica crittograficamente il mittente, ma rende la trasmissione più riconoscibile e professionale. Un filo WhatsApp non offre quella garanzia. Business aggiunge profilo, logo, colori e una pagina di apertura predefinita o personalizzata, perché la consegna si presenti chiaramente sotto l’identità dello studio.",
      ],
      midCta: {
        body: "Business è il piano per la consegna professionale: identità dello studio presso il destinatario, file in sola visualizzazione, allegati fino a 1 GB e l’insieme dei controlli di consegna (prova di accesso, verifica del destinatario, revoca, rivelazione programmata). 12 € / 12 $ al mese, o 120 € / 120 $ all’anno: un account professionale, non una licenza per singolo utente.",
        button: "Vedi Business nella pagina dei piani",
      },
    },
    {
      title: "Controlli che spettano a un account professionale",
      paragraphs: [
        "Starter e Business aggiungono funzioni che lo studio dovrebbe altrimenti coordinare per telefono o attraverso canali separati. La [verifica del destinatario](blog:recipient-verification-code-before-reveal) mette un codice proprio della nota su un secondo canale, così un link intercettato non basta. Le [notifiche di apertura](blog:know-when-secret-link-opened) e la prova di accesso dicono che gli atti sono stati ritirati: solo lo stato, mai il contenuto. Un link ancora non aperto può essere [revocato](blog:revoke-unopened-note-proof-of-access) se è stato inviato al numero sbagliato. La rivelazione programmata può trattenere un plico fino a un termine di deposito o a una chiamata dal luogo di detenzione. Business aggiunge la sola visualizzazione per allegati da consultare, non da salvare occasionalmente, e i limiti di allegato più ampi per fascicoli che non appartengono a una chat.",
      ],
      orderedIntro: "Una sequenza praticabile è breve:",
      ordered: [
        "Redigere l’istruzione o allegare gli atti. La cifratura avviene nel browser prima del caricamento.",
        "Impostare una vita breve e una sola apertura, o poche aperture se cliente e corrispondente devono ritirare lo stesso plico.",
        "Attivare la verifica del destinatario quando il contenuto è particolarmente sensibile e comunicare il codice per altra via (una telefonata, ad esempio).",
        "Inviare solo il link via SMS o e-mail. Non incollare l’istruzione in quel messaggio.",
        "Attendere l’avviso di apertura. Se il numero era errato, revocare prima dell’apertura. Dopo l’apertura, assumere che il destinatario possa trattenere ciò che ha visto e agire di conseguenza.",
      ],
      paragraphsAfterOrdered: [
        "Per plichi più voluminosi vale lo stesso modello: [file cifrati, dati cifrati sul server, finestra di download limitata](app:secure-file-transfer). L’invio di un file richiede un account gratuito; l’apertura di un link, mai.",
      ],
    },
    {
      title: "Ciò che questo canale non decide",
      paragraphs: [
        "In Italia, il segreto professionale dell’avvocato si articola, tra le altre fonti, nell’ordinamento forense e nel codice di procedura penale. La sua applicazione concreta dipende dal quadro giuridico e dalle circostanze del caso. PrivateNote non determina se una determinata comunicazione sia giuridicamente coperta dal segreto professionale. Nessun prodotto impedisce a un destinatario legittimo di copiare, catturare o fotografare una volta mostrato il contenuto in chiaro. PrivateNote non sostituisce il sistema documentale dello studio, la rilevazione del tempo né l’obbligo di conservare ciò che il fascicolo deve conservare. Riduce copie inutili di comunicazioni che non dovevano diventare un archivio permanente. Anche il principio di minimizzazione dei dati favorisce la conservazione dei dati personali solo nella misura e per il tempo necessari alla finalità prevista.",
        "In questo limite, è un’alternativa professionale alle due abitudini oggi dominanti: mettere il traffico operativo coperto dal segreto nella posta, o in un’app di messaggistica di uso quotidiano perché il cliente non installerà nient’altro. Lo studio lascia il cliente sugli strumenti che ha già, appone il nome sulla consegna e non lascia una cronologia dove non è richiesta.",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "La cifratura di Signal o WhatsApp assolve il segreto professionale?",
          answer:
            "La cifratura end-to-end protegge efficacemente il contenuto dall’accesso del fornitore del servizio. Non decide quanto a lungo una cronologia resta su dispositivi, backup o nella chat del cliente. Cifratura e persistenza sono due questioni diverse. La tutela giuridica applicabile a una comunicazione non dipende solo dallo strumento usato per trasmetterla.",
        },
        {
          question: "Il cliente deve creare un account o installare un’applicazione?",
          answer:
            "No. Il cliente apre un link unico in un browser ordinario. Non servono Signal, WhatsApp né un’applicazione PrivateNote, e non è richiesto un account per aprire la nota.",
        },
        {
          question: "PrivateNote sostituisce il fascicolo dello studio?",
          answer:
            "No. È un canale di consegna di breve durata. I fascicoli, gli atti e tutto ciò che è soggetto a obbligo di conservazione restano nei sistemi abituali dello studio. PrivateNote serve alle comunicazioni che non devono persistere dopo la ricezione.",
        },
        {
          question: "Il destinatario può comunque conservare una copia dopo l’apertura?",
          answer:
            "Sì. Una volta mostrato lecitamente il contenuto in chiaro, un destinatario determinato può copiare, catturare, scaricare o fotografare. La distruzione dopo la lettura e la scadenza riducono le copie residue sul servizio; non cancellano a distanza ciò che il destinatario ha già fissato. La sola visualizzazione di Business ostacola il download non necessario; non vieta la fotografia.",
        },
      ],
    },
  ],
  ctaTitle: "Consegnate l’istruzione. Non lasciate la cronologia.",
  ctaBody:
    "Cifrate nel browser, apponete il nome dello studio sulla pagina di apertura e inviate un link che il cliente apre senza installare Signal o WhatsApp. Business è il piano per quella consegna professionale.",
  ctaPrimary: "Scegli Business",
  ctaSecondary: "Scrivi una nota privata",
};
