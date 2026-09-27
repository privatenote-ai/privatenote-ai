import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedIt: ChatControl10VoteArticleCopy = {
  heroAlt: "Voto del Parlamento europeo su Chat Control con una chat bloccata sopra una mappa dell’Europa",
  heroCaption: "Illustrazione generata per PrivateNote.ai.",
  intro:
    "Il 9 luglio 2026 è accaduto qualcosa di insolito al Parlamento europeo. Il voto finale sulla proroga del regolamento temporaneo Chat Control 1.0 si è concluso con più eurodeputati contrari che favorevoli, eppure la misura è stata comunque approvata.",
  voteEyebrow: "Voto finale, 9 luglio 2026",
  voteHeadline: "Più voti contrari che favorevoli, ma il testo è passato lo stesso",
  voteLabels: { against: "Contrari", for: "Favorevoli", abstentions: "Astenuti" },
  voteSummary:
    "A prima vista, molti osservatori avrebbero concluso che la proposta fosse stata respinta. La spiegazione non riguarda cifratura o cybersecurity, ma la procedura parlamentare.",
  nonE2eChannels: [
    "servizi di posta elettronica tradizionali",
    "archiviazione cloud",
    "alcuni servizi di messaggistica diretta",
    "altre comunicazioni in cui i provider possono accedere al contenuto dei messaggi",
  ],
  privacyConcerns: [
    {
      title: "Falsi positivi",
      body: "Rilevare materiale illegale già noto tramite hash crittografici è in genere affidabile, ma non perfetto. I ricercatori hanno dimostrato collisioni ed errori di implementazione che possono generare segnalazioni false. Se i provider iniziano a usare l’IA per identificare materiale nuovo e mai visto prima, il tasso di falsi positivi diventa molto più difficile da controllare. Ogni falso positivo può significare che una comunicazione privata di una persona innocente viene segnalata per ulteriori verifiche.",
    },
    {
      title: "Espansione dell’infrastruttura di sorveglianza",
      body: "Molti esperti sostengono che, una volta costruiti sistemi di scansione su larga scala, estenderne l’uso ad altri scopi diventi tecnicamente semplice. La storia mostra che tecnologie introdotte per finalità ristrette spesso evolvono nel tempo in capacità di sorveglianza più ampie.",
    },
    {
      title: "Effetti dissuasivi",
      body: "La comunicazione privata funziona solo quando le persone si fidano che le loro conversazioni restino private. Se gli utenti credono che ogni messaggio possa essere analizzato automaticamente, molti eviteranno del tutto di discutere temi sensibili, anche quando sono perfettamente leciti. Questo fenomeno è ben documentato nella ricerca sulla privacy.",
    },
    {
      title: "Efficacia limitata",
      body: "Più di 800 ricercatori in cybersecurity e privacy hanno sostenuto che la scansione generalizzata dei messaggi difficilmente ridurrà in modo significativo gli abusi sui minori, imponendo però costi elevati alla privacy di centinaia di milioni di utenti. Secondo i critici, le risorse investigative sarebbero impiegate meglio in indagini mirate anziché in scansioni indiscriminate.",
    },
  ],
  e2eeCalloutTitle: "La cifratura end-to-end cambia il modello di fiducia",
  e2eeCalloutBody:
    "La cifratura end-to-end garantisce che solo mittente e destinatario previsto possiedano le chiavi crittografiche necessarie per leggere un messaggio. Nemmeno il provider può decifrarne il contenuto. Qualsiasi obbligo di ispezionare messaggi cifrati prima o dopo la cifratura modifica radicalmente quel modello di sicurezza, ed è diventato uno dei temi più controversi della politica moderna sulla cybersecurity.",
  sections: {
    whyPassed: {
      title: "Perché è passato?",
      paragraphs: [
        "Non si trattava di un normale voto legislativo che richiedeva la maggioranza semplice dei voti espressi. A causa della fase procedurale specifica di questa legislazione, **per respingere la proposta era necessaria la maggioranza assoluta di tutti i membri del Parlamento europeo: attualmente 361 voti**.",
        "Sebbene 314 eurodeputati abbiano votato contro la proposta, quel numero non ha raggiunto la soglia richiesta. Di conseguenza, la proposta è stata considerata approvata.",
      ],
      callout:
        "Questo esito procedurale ha sorpreso molti osservatori, inclusi giornalisti, giuristi e ricercatori di cybersecurity, perché l’aspettativa intuitiva è che più voti contrari che favorevoli dovrebbero bastare a bocciare una proposta.",
    },
    whatItDoes: {
      title: "Che cosa fa davvero Chat Control 1.0?",
      paragraphs: [
        "La misura adottata **non** introduce la scansione obbligatoria di tutti i messaggi privati. Estende invece il quadro giuridico temporaneo esistente che consente ai provider di servizi online di rilevare e segnalare **volontariamente** materiale pedopornografico (CSAM) in alcuni tipi di comunicazioni fino al 3 aprile 2028.",
        "Questo riguarda principalmente comunicazioni non protette da [cifratura end-to-end](blog:what-is-end-to-end-encryption), come:",
        "È importante notare che il Parlamento ha mantenuto il linguaggio che esclude le comunicazioni cifrate end-to-end da questo quadro di scansione volontaria. Per una definizione precisa di che cosa significhi nella pratica, e di come differisca dalla normale cifratura di trasporto, leggi la nostra guida su [che cosa sia davvero la cifratura end-to-end](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Perché gli esperti di privacy sono preoccupati?",
      intro:
        "Molti ricercatori e organizzazioni per le libertà civili si sono opposti alla proroga non perché siano contrari alla protezione dei minori, ma perché dubitano che questo approccio raggiunga l’obiettivo senza creare rischi significativi. Il nostro precedente articolo su [perché i crittografi europei continuano ad avvertire sui rischi di Chat Control](blog:chat-control-europe-cryptographers) spiega in dettaglio le obiezioni tecniche più ampie.",
    },
    chatControl20: {
      title: "La questione più grande è Chat Control 2.0",
      paragraphs: [
        "Sebbene il voto di questa settimana abbia attirato molta attenzione, molti esperti ritengono che il dibattito più importante debba ancora arrivare. La proposta comunemente chiamata Chat Control 2.0 punta a creare un quadro giuridico permanente per il rilevamento del CSAM online.",
        "A differenza della proroga temporanea adottata questa settimana, le discussioni su Chat Control 2.0 hanno incluso più volte proposte che potrebbero incidere sulle comunicazioni cifrate end-to-end. È lì che il dibattito diventa molto più rilevante, ed è lì che gli avvertimenti nel nostro [briefing dei crittografi su Chat Control](blog:chat-control-europe-cryptographers) contano di più.",
      ],
    },
    privateNote: {
      title: "Perché questo conta per PrivateNote",
      paragraphs: [
        "La comunicazione privata si fonda su un principio semplice: se un servizio non può leggere il tuo messaggio, non può analizzarlo, venderlo, scannerizzarlo o esporlo accidentalmente. PrivateNote è stato progettato attorno a questa idea.",
        "Quando crei una nota, la cifratura avviene direttamente nel browser. La chiave di cifratura non raggiunge mai i nostri server. Conserviamo solo testo cifrato. Senza la chiave, che resta interamente sotto il tuo controllo, il contenuto della nota è matematicamente illeggibile per noi.",
        "Questo design non serve a evitare responsabilità. Serve a garantire che la tua comunicazione privata resti davvero privata. Che tu stia condividendo password, documenti legali, informazioni finanziarie, segreti aziendali o conversazioni personali, la privacy non dovrebbe dipendere solo dalla fiducia nel provider. Dovrebbe essere fatta rispettare dalla crittografia.",
        "Per vedere passo dopo passo come funziona la cifratura nel browser, leggi [come funziona PrivateNote](app:how-it-works). Per condividere segreti di breve durata senza lasciarli in un thread permanente, i [link segreti monouso](blog:one-time-secret-links) sono spesso più adatti delle app di messaggistica, anche di quelle cifrate.",
      ],
    },
    debateContinues: {
      title: "Il dibattito è tutt’altro che concluso",
      paragraphs: [
        "Persone ragionevoli possono avere opinioni diverse su come la società debba combattere gli abusi online sui minori. Proteggere i bambini è senza dubbio uno degli interessi pubblici più importanti. La domanda difficile è come raggiungere questo obiettivo senza indebolire l’infrastruttura di sicurezza e privacy su cui ogni giorno fanno affidamento giornalisti, imprese, avvocati, operatori sanitari, attivisti e cittadini comuni.",
        "Mentre proseguono le discussioni su Chat Control 2.0, l’equilibrio tra sicurezza pubblica e diritti fondamentali alla privacy resterà uno dei dibattiti centrali della politica tecnologica europea. Qualunque sia la posizione di ciascuno, una cosa è certa: il futuro della comunicazione cifrata sarà deciso sempre più non solo da crittografi e ingegneri del software, ma anche dai legislatori.",
      ],
    },
  },
  ctaTitle: "Invia note private senza consegnare la chiave al server",
  ctaBody: "PrivateNote cifra le note nel browser e conserva la chiave di decifratura nel frammento dell’URL.",
  ctaButton: "Prova PrivateNote ->",
};
