import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksIt: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Scena tranquilla di scrivania che suggerisce una consegna temporanea di file rispetto a cartelle di collaborazione cloud di lunga durata",
  heroCaption:
    "Drive eccelle nella collaborazione continua. I link monouso eccellono quando il file deve esistere solo per la consegna.",
  intro: [
    "Google Drive è uno degli strumenti migliori per archiviare file e collaborare per giorni, settimane o anni. I [link crittografati monouso](blog:one-time-secret-links) risolvono un problema diverso: consegnare in modo sicuro informazioni confidenziali una sola volta, rimuovendo automaticamente l’accesso quando non serve più.",
    "Nessun approccio è universalmente migliore. La scelta giusta dipende dal fatto che stiate collaborando su un documento o semplicemente consegnando informazioni confidenziali.",
  ],
  sections: [
    {
      title: "Perché è importante",
      takeaway:
        "La comodità rende Drive la scelta predefinita—anche quando il file va visto una sola volta.",
      paragraphs: [
        "Per molte persone, Google Drive è diventato la risposta predefinita ogni volta che bisogna condividere un file. È integrato in Gmail, Android, Google Workspace e innumerevoli flussi di lavoro aziendali. Serve inviare un PDF, un foglio di calcolo o un contratto? Caricalo su Drive, copia il link e invia.",
        "Questa comodità ha reso Drive incredibilmente di successo—ma può anche spingerci a usare lo stesso strumento in situazioni per cui non era specificamente progettato.",
        "Immaginate di inviare una copia del passaporto al commercialista, un contratto di lavoro firmato alle HR o documenti fiscali a un consulente finanziario. Nella maggior parte dei casi, il destinatario ha bisogno di quei file una sola volta. A compito completato, ogni copia rimanente aumenta solo la probabilità che le informazioni restino accessibili più a lungo del necessario.",
        "Il rischio maggiore raramente è che qualcuno intercetti il file in transito. I servizi cloud moderni crittografano i dati [in transito](blog:encrypted-vs-secure-file-sharing). Il problema più grande è la **conservazione**. Le informazioni sensibili spesso restano nello storage cloud, nelle notifiche email, nelle cartelle sincronizzate e nei file scaricati molto dopo che tutti hanno dimenticato che esistano.",
      ],
    },
    {
      title: "Google Drive è pensato per la collaborazione",
      takeaway:
        "Modifica simultanea, cronologia versioni e cartelle condivise sono punti di forza—non difetti.",
      paragraphs: [
        "Google Drive è eccellente nel far lavorare le persone insieme. Più persone possono modificare lo stesso documento contemporaneamente, le modifiche vengono salvate automaticamente, la cronologia delle versioni facilita il recupero delle revisioni precedenti e i permessi possono essere regolati quando i membri del team entrano o escono da un progetto. Per il lavoro continuo, questi sono vantaggi enormi.",
        "È esattamente l’ambiente per cui Drive è stato progettato. Una cartella di progetto può restare attiva per mesi mentre i documenti evolvono e si aggiungono nuovi file.",
        "La sfida nasce quando quelle stesse funzioni di collaborazione vengono usate per informazioni che non dovevano rimanere disponibili.",
      ],
    },
    {
      title: "Il costo nascosto dell’accesso a lungo termine",
      takeaway:
        "Le consegne temporanee lasciano impronte permanenti quando la piattaforma ottimizza la disponibilità.",
      paragraphs: [
        "La maggior parte dei file confidenziali non deve essere disponibile per sempre. Una copia del passaporto potrebbe servire solo per la verifica dell’identità. Una dichiarazione dei redditi solo per una specifica presentazione. Una chiave API potrebbe essere usata una volta e poi ruotata. Una volta che il destinatario ha finito, continuare a conservare le informazioni offre pochissimo beneficio.",
        "Purtroppo, eliminare l’accesso non è sempre semplice. Le persone scaricano i file sui laptop. Sincronizzano cartelle tra dispositivi. Gli inviti email restano nelle caselle. Le cartelle condivise continuano a esistere. Mesi dopo, qualcuno scopre una vecchia cartella con permessi che nessuno ricordava di aver concesso.",
        "Nessuno di questi eventi è un fallimento di Google Drive. Sono semplicemente la conseguenza naturale dell’uso di una piattaforma di collaborazione per una consegna temporanea—lo stesso schema di conservazione che emerge quando si [inviano segreti via email](blog:why-email-is-worst-for-secrets) o si lasciano [documenti in chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Quando i link monouso hanno più senso",
      takeaway:
        "Consegnare una volta, scadere per progettazione—senza trasformare ogni consegna in uno spazio di lavoro condiviso.",
      paragraphs: [
        "I link crittografati monouso sono progettati con un obiettivo diverso. Invece di creare uno spazio di lavoro condiviso, si concentrano sulla consegna di informazioni confidenziali con la più piccola impronta digitale pratica. Le informazioni vengono crittografate prima di lasciare il browser e l’accesso può essere limitato a una sola visualizzazione o a una breve scadenza. Una volta completata la consegna, il link diventa inutilizzabile.",
        "Non si tratta di sostituire lo storage cloud. Si tratta di riconoscere che non ogni file merita archiviazione permanente o permessi continui.",
        "Se inviate un codice di recupero a un collega, un contratto firmato a un cliente o cartelle mediche a uno specialista, probabilmente non vi serve la modifica collaborativa, la cronologia delle versioni o una cartella condivisa. Serve semplicemente che la persona giusta riceva le informazioni in sicurezza—vedi anche [come inviare documenti sensibili in modo sicuro](blog:send-sensitive-documents-securely).",
        "Servizi come [PrivateNote](app:secure-file-transfer) sono costruiti intorno a questo modello di condivisione temporanea. Invece di incoraggiare lo storage a lungo termine, minimizzano la conservazione combinando crittografia lato client e scadenza automatica.",
      ],
    },
    {
      title: "Quale metodo scegliere?",
      takeaway:
        "Adatta lo strumento alla durata dell’informazione—non alla piattaforma più familiare.",
      paragraphs: [
        "La decisione riguarda meno la «sicurezza» astratta e più lo scopo.",
        "Se più persone devono rivedere, modificare e consultare un documento nel tempo, Google Drive è una scelta eccellente. Commenti, cronologia delle versioni e cartelle condivise rendono la collaborazione semplice.",
        "Se l’informazione deve essere consegnata una sola volta, un link crittografato monouso spesso si adatta meglio. Elimina la necessità di gestire permessi duraturi, riduce le copie inutili e limita quanto a lungo l’informazione resta disponibile.",
      ],
      calloutTitle: "Regola pratica",
      callout:
        "Scegliete lo strumento in base a quanto a lungo l’informazione deve effettivamente restare disponibile—non a quello che aprite per abitudine.",
    },
    {
      title: "Confronto",
      takeaway: "Funzioni di collaborazione e consegna effimera risolvono lavori diversi.",
      comparisonTable: {
        headers: ["Funzionalità", "Google Drive", "Link crittografato monouso"],
        rows: [
          ["Progettato per la collaborazione", "Sì", "No"],
          ["Archiviazione a lungo termine", "Sì", "No"],
          ["Crittografia end-to-end lato client", "Non di default*", "Sì"],
          ["Scadenza automatica", "No (pulizia manuale)", "Sì"],
          ["Accesso in sola lettura una volta", "No", "Sì"],
          ["Gestione continua dei permessi", "Sì", "No"],
          ["Ideale per condivisione confidenziale temporanea", "A volte", "Sì"],
        ],
        after: [
          "*Drive standard crittografa i dati in transito e a riposo con chiavi gestite da Google. Google Workspace offre [crittografia lato client](https://support.google.com/a/answer/10741875) opzionale per alcune organizzazioni, ma i link condivisi quotidiani ottimizzano ancora l’accesso durevole piuttosto che una consegna burn-after-reading.",
        ],
      },
    },
    {
      title: "Checklist delle best practice",
      takeaway: "Piccole abitudini riducono il rischio di conservazione con qualsiasi strumento scegliate.",
      paragraphs: [
        "Qualunque strumento scegliate, alcune abitudini semplici riducono sensibilmente l’esposizione inutile.",
      ],
      checklist: [
        "Condividete solo ciò di cui il destinatario ha bisogno—evitate cartelle intere piene di dati personali non correlati",
        "Rimuovete metadati inutili da PDF, file Office e immagini quando è pratico",
        "Se usate una passphrase, inviatela su un canale separato (out-of-band / OOB)",
        "A compito concluso: revocate l’accesso condiviso, eliminate le copie locali temporanee ed evitate cartelle condivise indefinite",
      ],
      paragraphsAfterChecklist: [
        "La consegna out-of-band significa che il link crittografato viaggia su un canale (ad esempio l’email) mentre la passphrase viaggia su un altro (Signal, SMS o una telefonata). Compromettere un solo canale non dovrebbe bastare ad aprire il file.",
        "Per un flusso più approfondito sulle consegne di documenti, seguite la [guida ai documenti sensibili](blog:send-sensitive-documents-securely). Per come la crittografia del browser differisce da quella di trasporto, vedi [crittografato vs condivisione file sicura](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Google Drive è sicuro?",
          answer:
            "Sì—Google Drive è una piattaforma cloud matura che crittografa le informazioni in transito e a riposo. L’esposizione complessiva dipende ancora da come vengono condivisi i file, da come sono gestiti i permessi e da quanto a lungo i documenti restano accessibili dopo la fine del compito.",
        },
        {
          question: "Google Drive è crittografato end-to-end?",
          answer:
            "Non nel senso usato per la messaggistica crittografata lato client o i link monouso crittografati nel browser. Per lo storage Drive standard, Google gestisce le chiavi di crittografia. La crittografia lato client opzionale di Workspace cambia il quadro per le organizzazioni idonee, ma la condivisione quotidiana «chiunque abbia il link» lascia ancora copie durevoli e superfici di permesso che la consegna effimera evita. Vedi [cosa significa la crittografia end-to-end](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "I link monouso sono più sicuri di Google Drive?",
          answer:
            "Per consegne confidenziali temporanee, spesso riducono il rischio a lungo termine perché minimizzano la conservazione e possono rimuovere l’accesso automaticamente dopo la consegna. Per la modifica collaborativa e i progetti in corso, Drive resta lo strumento migliore. La sicurezza segue lo scopo—non una classifica universale.",
        },
        {
          question: "E se invio un link monouso alla persona sbagliata?",
          answer:
            "Proteggete il contenuto con una passphrase, usate una scadenza breve e distruggete la nota prima che venga aperta se lo strumento lo consente. Verificare il destinatario prima di inviare resta la difesa più forte. Agenzie come [CISA](https://www.cisa.gov/) sottolineano costantemente di limitare la durata dell’accesso e il minimo privilegio—le stesse idee dietro i link crittografati a breve durata.",
        },
      ],
    },
  ],
  ctaTitle: "Vi serve una consegna confidenziale temporanea?",
  ctaBody:
    "Google Drive e i link crittografati monouso sono strumenti complementari. Se le persone devono collaborare sui documenti nel tempo, Drive è una delle migliori piattaforme di collaborazione. Se l’obiettivo è consegnare informazioni confidenziali una sola volta e minimizzare quanto a lungo restano accessibili, create un link monouso crittografato end-to-end nel browser—senza lasciare copie permanenti in email o cartelle condivise.",
  ctaButton: "Crea un link sicuro monouso",
};
