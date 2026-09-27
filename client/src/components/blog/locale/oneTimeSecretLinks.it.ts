import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksIt: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Un **link monouso** è un URL per consegnare un’informazione sensibile senza lasciare il testo in chiaro nella posta o nella cronologia di una chat. Chi lo riceve apre il link, mostra il segreto nel browser e la copia cifrata sul server diventa inaccessibile secondo le regole di accesso e di scadenza.",
    "È utile per password, chiavi API, codici di recupero, credenziali temporanee e messaggi privati che devono arrivare una volta e non hanno bisogno di una conversazione permanente.",
    "Il problema non è sempre l’intercettazione. È la **conservazione**. La cifratura protegge l’accesso. L’effimerità riduce quanto a lungo restano copie inutili. Un link monouso copre un terzo lavoro: la **consegna temporanea**.",
  ],
  earlyCta: {
    body: "Devi inviarne uno adesso?",
    linkLabel: "Crea un link cifrato monouso con PrivateNote",
  },
  sections: [
    {
      title: "Che cos’è un link monouso?",
      paragraphs: [
        "Si usano diversi nomi per la stessa idea: link segreto, nota autodistruttiva, collegamento una tantum, link con scadenza. L’etichetta cambia. Le proprietà di sicurezza non arrivano insieme al nome.",
        "Un prodotto chiamato «segreto monouso» non implica, da solo, che la cifratura avvenga nel browser, che il fornitore non possa decifrare il contenuto, che la chiave resti fuori dal server, che la cancellazione segua davvero la lettura o che i metadati scompaiano. Sono scelte di progettazione. Valuta le proprietà, non lo slogan.",
        "Una lista utile: dove viene cifrato il testo in chiaro? Il server riceve mai la chiave? Che succede dopo la consultazione prevista? Quanto resta disponibile un link inutilizzato? Che cosa recupera l’anteprima di una chat se si incolla l’URL?",
      ],
    },
    {
      title: "Come funziona un link monouso?",
      paragraphs: [
        "In un disegno lato client come quello di PrivateNote, il segreto viene cifrato nel browser di chi invia prima del caricamento. Il server memorizza testo cifrato. Il browser di chi riceve lo decifra in locale. Il testo di una nota usa AES-256-GCM tramite l’API Web Crypto.",
      ],
      beforeFlowSteps: "**Nella pratica, il percorso completo è questo:**",
      flowSteps: [
        {
          title: "Chiave e cifratura nel browser",
          step: "Passo 1: il tuo browser",
          body: "Scrivi il segreto in locale. Il browser genera il materiale crittografico e cifra il testo in chiaro prima che parta qualsiasi richiesta di rete.",
        },
        {
          title: "Si carica solo il testo cifrato",
          step: "Passo 2: il server",
          body: "Viaggia solo il carico cifrato. Il server memorizza un testo che non può leggere, perché non riceve né il chiaro né la chiave del frammento.",
        },
        {
          title: "La chiave resta nel link",
          step: "Passo 3: l’URL",
          body: "La chiave di decifratura sta nel frammento dell’URL—la parte dopo #. Il percorso pubblico identifica la nota; il frammento resta nel browser in una navigazione HTTPS normale.",
        },
        {
          title: "Mostra, decifra, poi applica le regole di accesso",
          step: "Passo 4: chi riceve",
          body: "Aprire la pagina non basta. Serve un clic per mostrare, e solo allora si recupera il testo cifrato. Il browser decifra in locale. Dopo una visualizzazione riuscita, PrivateNote applica il limite di letture—una di default—e cancella il testo cifrato quando il limite è raggiunto. I link inutilizzati scadono anche per tempo.",
        },
      ],
      afterFlowSteps: [
        "Non tutti i prodotti venduti come link monouso seguono questo modello. Alcuni cifrano sul server dopo aver ricevuto il testo, o generano lì la chiave, il che consentirebbe al servizio di leggere il segreto. Altri cancellano secondo un calendario ma tengono copie recuperabili. Chiedi se è implementato il disegno completo—non solo se il link scade.",
        "Per l’architettura di cifratura di PrivateNote, incluso l’avvolgimento con password tramite Argon2id, vedi [Come funziona](app:how-it-works).",
      ],
    },
    {
      title: "Perché conta il frammento dell’URL",
      paragraphs: [
        "Questo dettaglio è facile da saltare, ed è il fondamento di questa architettura.",
        "In una navigazione HTTPS normale il browser invia al server il percorso e la query. Il [frammento dell’URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—tutto ciò che segue #—resta nel browser e non entra in quella richiesta. Un sistema ben fatto può quindi tenere il testo cifrato a un identificatore come `/note/abc123` e il materiale di decifratura in `#…`, fuori dai log ordinari di quel caricamento di pagina.",
        "Mettere una chiave dopo # non rende sicura un’applicazione da sola. La crittografia intorno deve essere solida: una chiave casuale forte, cifratura autenticata e un server che non ha mai bisogno del testo in chiaro. Il frammento serve a tenere separate queste parti, non a aggirarle.",
      ],
    },
    {
      title: "Link monouso, link con scadenza e messaggio che scompare",
      paragraphs: [
        "Queste idee si mescolano spesso. Sono controlli diversi, e un prodotto può combinarli.",
      ],
      bullets: [
        {
          label: "Link monouso",
          body: "La disponibilità dipende soprattutto dall’accesso. Dopo la consultazione prevista—su PrivateNote, una visualizzazione riuscita che raggiunge il limite—il carico cifrato sparisce dal server.",
        },
        {
          label: "Link con scadenza",
          body: "La disponibilità dipende soprattutto dal tempo. Il link resta recuperabile fino alla scadenza, sia stato aperto o no.",
        },
        {
          label: "Messaggio che scompare",
          body: "Fa parte di una conversazione in corso. La conservazione segue la politica del messenger, che può ancora lasciare backup, citazioni o copie sul dispositivo.",
        },
      ],
      callout:
        "**PrivateNote combina accesso e tempo.** Le note nuove partono da una visualizzazione riuscita e scadono anche se nessuno le apre—un giorno di default, con durate più corte o più lunghe a seconda del piano. È una consegna temporanea: si recupera, o si aspetta, e la copia sul server sparisce.",
    },
    {
      title: "I link monouso sono sicuri?",
      paragraphs: [
        "Possono esserlo. La sicurezza dipende dall’implementazione e da come si invia il link, non dalla formula «monouso».",
        "Un disegno serio deve considerare la cifratura lato client, chiavi casuali forti, ciò che il server può vedere, la scadenza, il significato dell’accesso, una password opzionale, una verifica opzionale di chi riceve, i metadati, la fuga del link, un dispositivo compromesso e il comportamento di chi riceve.",
        "PrivateNote cifra nel browser, memorizza testo cifrato, tiene la chiave nel frammento dell’URL, limita di default a una visualizzazione e fa scadere le note inutilizzate. Puoi aggiungere una password o, sui piani a pagamento, la verifica del destinatario. Chi riceve non ha bisogno di un account.",
        "Un link monouso **non protegge** da un dispositivo compromesso, da chi copia il segreto dopo averlo visto, da uno screenshot o una foto, o dall’invio dell’URL completo—frammento compreso—alla persona sbagliata. Tratta l’intero link come la capacità di accesso.",
      ],
    },
    {
      title: "Quando usare un link monouso?",
      paragraphs: [
        "Quando il segreto ha un lavoro breve: arrivare, servire e smettere di vivere nel canale usato per inviarlo.",
      ],
      subsections: [
        {
          title: "Password",
          paragraphs: [
            "Un link monouso sta bene per consegnare una password temporanea o appena creata a una sola persona, senza lasciare il chiaro in mail o chat. Per il flusso dedicato, vedi [come condividere una password in modo sicuro](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Chiavi API e token",
          paragraphs: [
            "Chi sviluppa o collabora come contractor spesso ha bisogno di una chiave una sola volta. Passare da un link tiene la credenziale grezza fuori da thread Slack, ticket e commenti Git. Vedi [come condividere una chiave API in modo sicuro](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Codici di recupero",
          paragraphs: [
            "Utile quando un codice di backup o di recupero 2FA deve davvero arrivare a un’altra persona autorizzata—e non deve restare ricercabile nel thread che lo ha portato.",
          ],
        },
        {
          title: "Messaggi privati",
          paragraphs: [
            "Un’informazione da comunicare una volta, senza diventare una conversazione permanente. Chi riceve può aprire la nota senza creare un account. Vedi [inviare un messaggio segreto senza account](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "File sensibili",
          paragraphs: [
            "Un file chiede più attenzione: dimensione, download, anteprima e una finestra di accesso distinta dopo l’apertura della nota. Su PrivateNote, inviare un file richiede un account di chi invia; aprirlo, no. Gli allegati restano recuperabili per una finestra limitata dopo la visualizzazione—un’ora di default. Usa il [trasferimento sicuro di file](app:secure-file-transfer) quando il contenuto è un documento e non un segreto breve.",
          ],
        },
      ],
    },
    {
      title: "Quando non usarlo?",
      paragraphs: [
        "Il link monouso è lo strumento sbagliato quando il lavoro è archiviare, collaborare o conservare un registro che sei tenuto a tenere.",
      ],
      poorFits: [
        "Archivio duraturo delle password: usa la cassaforte di un gestore di password.",
        "Conversazione continua: usa un messenger che entrambe le parti già usano, per esempio Signal.",
        "Archivi organizzativi da conservare per audit o obbligo legale.",
        "Segreti che non hanno bisogno di viaggiare: generali sul posto, o non condividerli.",
        "Frasi seed di criptovalute e altri segreti master irrecuperabili: un link può comunque fuoriuscire se si copia l’URL completo. Leggi [frasi seed crypto e link monouso](blog:crypto-seed-phrase-one-time-link) prima di usare questo schema.",
      ],
    },
    {
      title: "Link monouso, e-mail, messaggistica e gestori di password",
      paragraphs: [
        "Il confronto utile è lo scopo e la persistenza, non una classifica di quale canale è «sicuro».",
      ],
      comparisonTable: {
        headers: [
          "Mezzo",
          "Uso principale",
          "Cifratura end-to-end",
          "Persistenza tipica",
          "Adatto a una consegna puntuale?",
        ],
        rows: [
          [
            "E-mail",
            "Corrispondenza duratura",
            "La cifratura in transito è comune; quella end-to-end di solito non è il valore predefinito",
            "Di solito resta in più caselle, backup e ricerche",
            "Scarsa aderenza per un segreto in chiaro",
          ],
          [
            "Slack / Teams",
            "Conversazione di lavoro e ricerca",
            "Cifrato in transito e a riposo sulla piattaforma; non end-to-end di default",
            "Cronologia dello spazio di lavoro consultabile ed esportabile",
            "Scarsa aderenza per un segreto in chiaro; accettabile per inviare un link",
          ],
          [
            "SMS / iMessage",
            "Messaggistica personale",
            "Varia molto secondo operatore e piattaforma",
            "Spesso con backup o sincronizzazione nel cloud",
            "Scarsa aderenza per un segreto in chiaro",
          ],
          [
            "WhatsApp",
            "Conversazione privata",
            "End-to-end per le chat; i backup possono non esserlo",
            "Copie sul dispositivo e, se attivati, nel cloud",
            "Meglio dell’e-mail per conversare; resta un posto sbagliato per lasciare una password",
          ],
          [
            "Signal",
            "Conversazione privata",
            "End-to-end",
            "I messaggi che scompaiono si possono configurare",
            "Un’alternativa ragionevole se entrambe le parti lo usano già",
          ],
          [
            "Gestore di password",
            "Archivio e condivisione di credenziali",
            "Sì, per progettazione",
            "Pensato per la conservazione a lungo termine",
            "Ottimo per team e accessi stabili; spesso più pesante di una consegna occasionale",
          ],
          [
            "PrivateNote",
            "Consegna cifrata temporanea",
            "Cifratura lato client; chiave nel frammento dell’URL",
            "Limite di letture più scadenza; il testo cifrato viene cancellato quando quelle condizioni sono soddisfatte",
            "Progettato per questo uso",
          ],
        ],
      },
    },
    {
      title: "Il problema dell’anteprima del link",
      paragraphs: [
        "Molte app di chat recuperano un URL in arrivo per costruire un’anteprima: titolo, descrizione, miniatura. Se il semplice caricamento della pagina contasse come una lettura, quel robot brucerebbe il link prima che chi lo riceve lo apra.",
        "PrivateNote non tratta un caricamento di pagina come una lettura. L’URL pubblico della nota mostra una porta «clicca per mostrare». I metadati di quella pagina si possono recuperare senza restituire il testo in chiaro. Il testo cifrato si ottiene solo dopo un’azione deliberata di visualizzazione. Un’anteprima di Slack, Teams o iMessage quindi non riceve il segreto e non consuma il limite di letture.",
        "È una scelta di progettazione del client e dell’API, non un elenco di user-agent bloccati. Resta importante come invii il link: chi ha l’URL completo, frammento compreso, e clicca per mostrare, può leggere la nota. Per l’avviso a chi riceve, vedi [perché le note aspettano un clic per rivelarsi](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Come creare un link monouso",
      paragraphs: ["Tieni i passi brevi. Lo strumento cifra; tu scegli le regole di accesso."],
      numberedSteps: [
        { title: "Apri PrivateNote", body: "Usa l’editor sul sito: per una nota di testo non serve un account." },
        { title: "Inserisci ciò che devi condividere", body: "Una password, un messaggio, una chiave API o, con un account, un file." },
        {
          title: "Scegli scadenza e accesso",
          body: "Preferisci la durata più breve che resti pratica. Di default: una lettura e un giorno se inutilizzato. Aggiungi una password o la verifica del destinatario se la sensibilità lo richiede.",
        },
        { title: "Crea il link cifrato", body: "Il browser cifra prima, poi carica il testo cifrato." },
        { title: "Invia il link a chi deve riceverlo", body: "Non incollare il testo in chiaro accanto." },
      ],
      closingNote: "Quando sei pronto, [crea un link monouso](app:one-time-link).",
    },
    {
      title: "Prima di inviare un segreto",
      paragraphs: ["Una consegna attenta è soprattutto operativa. La crittografia non corregge il destinatario sbagliato."],
      checklist: [
        "Conferma chi riceve prima di inviare l’URL completo.",
        "Usa la scadenza più breve che abbia senso.",
        "Aggiungi una password o la verifica del destinatario se la sensibilità lo richiede.",
        "Invia ogni fattore extra su un canale diverso.",
        "Ruota le credenziali temporanee dopo l’uso.",
        "Non trasmettere segreti che non hanno bisogno di muoversi.",
        "Ricorda che chi riceve può copiare, fotografare o catturare ciò che vede.",
      ],
    },
    {
      title: "Domande frequenti",
      paragraphs: [],
      faqs: [
        {
          question: "Che cos’è un link monouso?",
          answer:
            "Un URL che consegna un segreto da recuperare e poi rende inaccessibile la copia cifrata sul server secondo regole di accesso e scadenza, così il testo in chiaro non deve vivere in e-mail o chat.",
        },
        {
          question: "Come inviare una password con un link sicuro?",
          answer:
            "Metti la password nella nota, non nel messaggio che trasporta il link. Consigli sui canali separati in [come condividere una password in modo sicuro](blog:how-to-share-a-password-securely).",
        },
        {
          question: "È più sicuro della e-mail?",
          answer:
            "Per il segreto in sé sì, perché la e-mail conserva il testo in chiaro. Il link può comunque viaggiare via e-mail; nella casella resta un URL, non la credenziale.",
        },
        {
          question: "Cosa succede dopo l’apertura del link?",
          answer:
            "Su PrivateNote una visualizzazione riuscita conta come una lettura. Con il limite di default di una lettura, il server cancella poi il testo cifrato. Il contenuto può restare visibile nel browser già aperto. I link inutilizzati scadono anche per tempo.",
        },
        {
          question: "Chi riceve ha bisogno di un account?",
          answer:
            "No. Chi ha il link completo può aprire una nota non protetta. Una password o una verifica valgono solo se chi invia le ha attivate.",
        },
        {
          question: "Si può inviare un file con un link monouso?",
          answer:
            "Sì, con il [trasferimento sicuro di file](app:secure-file-transfer) di PrivateNote. L’invio richiede un account gratuito; l’apertura no. Dopo la visualizzazione, gli allegati seguono una finestra di accesso distinta: un’ora di default.",
        },
        {
          question: "Qual è la differenza tra un link monouso e un link con scadenza?",
          answer:
            "Monouso riguarda l’accesso: non più disponibile dopo la consultazione prevista. La scadenza riguarda il tempo: non più disponibile dopo la data, anche senza apertura. PrivateNote usa entrambi.",
        },
        {
          question: "Si può fare uno screenshot di un segreto monouso?",
          answer:
            "Sì. Ciò che è sullo schermo si può copiare, fotografare o catturare. Un link monouso limita la copia originale sul server; non è un DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Tipo di canale",
    encrypted: "Cifrato?",
    persistent: "Persistente?",
    verdict: "Adatto a un segreto puntuale?",
  },
  goodFitsLabel: "Buoni usi",
  poorFitsLabel: "Usi sbagliati",
  closingTitle: "Dove sta PrivateNote",
  closingBody:
    "PrivateNote è uno strumento di consegna. Non è una cassaforte di password a lungo termine, né un wiki di team, né un archivio di conformità. Cifra nel browser, condividi un link temporaneo e lascia che la copia sul server scada quando il lavoro è fatto.",
  encryptLu: "",
  tagline: "Fai coincidere la vita del segreto con quella del mezzo che lo trasporta.",
  relatedReading: "Letture correlate",
  ctaTitle: "Crea un link monouso",
  ctaBody: "Cifra un messaggio, una password o un file nel browser e condividilo con un link temporaneo.",
  ctaButton: "Crea un link sicuro",
};
