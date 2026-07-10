import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersIt: ChatControlCryptographersArticleCopy = {
  heroAlt: "Grafica editoriale Chat Control is back con una chat bloccata e una mappa dell’Europa",
  heroCaption: "Illustrazione generata per PrivateNote.ai.",
  intro:
    "Oggi, martedì 7 luglio, il Parlamento europeo dovrebbe riesaminare la proposta di regolamento sugli abusi sessuali sui minori, nota ai critici come Chat Control. L’obiettivo dichiarato non è controverso: i bambini devono essere protetti da abusi terribili. La domanda tecnica è se la scansione obbligatoria delle comunicazioni private possa farlo senza rompere le garanzie di sicurezza da cui dipendono tutti gli altri.",
  updatePrefix: "**Aggiornamento (9 luglio 2026):** il Parlamento ha prorogato Chat Control 1.0 anche se più eurodeputati hanno votato contro che a favore.",
  updateLink: "Leggi che cosa è successo e perché",
  updateSuffix: ".",
  calloutTitle: "Questo non è un dibattito sull’opportunità di combattere gli abusi sui minori.",
  calloutBody:
    "Le vittime meritano protezione. Le forze dell’ordine meritano strumenti efficaci. Le piattaforme dovrebbero segnalare rapidamente il materiale illegale noto e collaborare alle indagini. Il dissenso riguarda un’altra domanda: la scansione di massa dei messaggi privati di tutti è davvero un modo tecnicamente solido per arrivarci?",
  expertEyebrow: "Avvertimento degli esperti",
  expertTitle: "Bart Preneel: la comunità della sicurezza è insolitamente allineata",
  expertParagraphs: [
    "Bart Preneel, professore ordinario alla KU Leuven e uno dei maggiori esperti europei di crittografia, privacy e diritti digitali, ha avvertito oggi che Chat Control torna per un terzo voto dopo che i primi due non hanno chiuso la questione. Nel suo post su LinkedIn ha descritto la proposta come una scansione indiscriminata delle comunicazioni non cifrate, ora estesa anche all’uso dell’IA per trovare nuovo CSAM.",
    "Preneel ha anche richiamato il consenso insolitamente ampio dietro la critica: più di 800 esperti di cybersecurity e privacy hanno avvertito che la scansione di massa e l’analisi dei contenuti basata sull’IA continuano ad avere tassi di errore inaccettabili, sollevano seri problemi di proporzionalità e sono meno efficaci degli approcci mirati. Come ha osservato, la comunità della sicurezza raggiunge raramente un accordo così ampio su qualsiasi tema.",
    "La sua raccomandazione pratica è diretta: contattare i membri del Parlamento europeo e spiegare perché la scansione indiscriminata non è un modo solido per affrontare il grave problema della distribuzione di CSAM.",
    "Per il contesto tecnico, rimanda a due lettere di scienziati: la lettera aperta di settembre 2025, che spiega le preoccupazioni principali sulla scansione lato client e sul rilevamento basato sull’IA, e il seguito di novembre 2025, che sostiene che l’ampliamento dello scopo proposto amplifica gli stessi rischi già individuati dalla comunità della sicurezza.",
  ],
  expertLinks: {
    preneel: "Post LinkedIn di Bart Preneel",
    sep2025: "lettera aperta di settembre 2025",
    nov2025: "seguito di novembre 2025",
  },
  technicalConcerns: [
    {
      title: "L’IA non può classificare in modo affidabile CSAM sconosciuto su scala Internet",
      body: "La classificazione delle immagini dipende dal contesto. Foto familiari, immagini mediche, materiale educativo e immagini consensuali scambiate da adolescenti possono essere difficili da interpretare correttamente anche per gli esseri umani.",
    },
    {
      title: "Il matching di immagini note può essere aggirato",
      body: "Ritaglio, ridimensionamento, compressione, piccole modifiche ai pixel e perturbazioni avversarie possono lasciare un’immagine riconoscibile per una persona ma cambiarne la percezione da parte dei sistemi automatici di matching.",
    },
    {
      title: "La scansione lato client cambia il modello di fiducia della cifratura",
      body: "L’algoritmo di cifratura può rimanere matematicamente forte, ma il software è obbligato a ispezionare il contenuto prima che la cifratura lo protegga. Non è questa la garanzia di privacy che gli utenti si aspettano dalla cifratura end-to-end.",
    },
    {
      title: "L’infrastruttura di scansione diventa un bersaglio di alto valore",
      body: "Una volta che i dispositivi sono obbligati a ispezionare messaggi privati, lo stesso meccanismo può attirare attaccanti, pressioni politiche e richieste future di scansione per altre categorie di contenuti.",
    },
  ],
  protectedGroups: [
    "giornalisti e fonti confidenziali",
    "avvocati e clienti",
    "medici e pazienti",
    "aziende che proteggono segreti commerciali",
    "funzionari pubblici e diplomatici",
    "comunicazioni delle forze dell’ordine e militari",
  ],
  betterInvestments: [
    { title: "Sostenere le vittime", body: "Canali di segnalazione informati sul trauma e supporto a lungo termine per le vittime." },
    { title: "Finanziare specialisti", body: "Più capacità per team investigativi formati che si occupano di abusi." },
    { title: "Indagare sulle prove", body: "Indagini rapide e mirate basate su segnalazioni e indizi concreti." },
    { title: "Collaborare oltre confine", body: "Cooperazione internazionale quando autori, piattaforme e vittime si trovano in giurisdizioni diverse." },
    { title: "Rimuovere materiale confermato", body: "Rimozione più rapida dei contenuti illegali noti dopo la dovuta conferma." },
    { title: "Prevenire prima", body: "Educazione e prevenzione prima che l’abuso avvenga." },
  ],
  betterInvestmentEyebrow: "Investire meglio",
  betterInvestmentTitle: "Rafforzare il lavoro che aiuta direttamente vittime e investigatori",
  sections: {
    proposalReturns: {
      title: "La proposta continua a tornare",
      paragraphs: [
        "Negli ultimi anni il CSAR ha attraversato diverse revisioni. Alcune modifiche meritano riconoscimento: gestione più rapida delle segnalazioni volontarie, obblighi più chiari e categorie di contenuti più ristrette sono tutte migliori di mandati più ampi e vaghi.",
        "Ma queste modifiche non rimuovono il problema tecnico centrale. Le versioni più contestate di Chat Control continuano a fare affidamento su tecnologie di rilevamento che crittografi, informatici e ricercatori di sicurezza hanno giudicato non abbastanza affidabili per essere applicate a centinaia di milioni di comunicazioni private.",
      ],
    },
    cryptographersObject: { title: "Perché i crittografi continuano a opporsi" },
    e2eeScanning: {
      title: "La cifratura end-to-end non può sopravvivere alla scansione lato client obbligatoria",
      paragraphs: [
        "La cifratura end-to-end offre agli utenti una promessa semplice: solo mittente e destinatario previsto possono leggere il messaggio. La scansione lato client obbligatoria cambia quella promessa. Il dispositivo deve ispezionare il messaggio prima che la cifratura lo protegga e segnalare ciò che il sistema di scansione considera sospetto.",
        "Durante il transito, il messaggio può ancora essere cifrato con crittografia forte. Il problema è ciò che accade prima. Se il software è obbligato a esaminare il testo in chiaro sul dispositivo e segnalare corrispondenze a un sistema esterno, l’endpoint non agisce più solo nell’interesse dell’utente. È un modello di fiducia diverso dalla cifratura end-to-end per come le persone la intendono.",
      ],
    },
    encryptionProtects: {
      title: "La cifratura protegge più delle chat personali",
      intro:
        "Il dibattito pubblico spesso fa sembrare che la messaggistica cifrata riguardi solo conversazioni informali. Non è così. La comunicazione privata sicura è infrastruttura critica per persone e istituzioni che affrontano rischi reali.",
    },
    moreTech: {
      title: "Più tecnologia non significa automaticamente più sicurezza",
      paragraphs: [
        "La proposta si colloca anche accanto a richieste più ampie di verifica dell’età e di ulteriori sistemi di mitigazione. Queste idee possono sembrare livelli di sicurezza aggiuntivi, ma l’ingegneria della sicurezza raramente migliora aggiungendo complessità senza comprendere le nuove superfici di attacco che crea.",
        "Controlli centralizzati dell’identità, pipeline di scansione, code di revisione e infrastrutture di segnalazione possono introdurre rischi propri per la privacy. Un sistema costruito per proteggere i bambini non dovrebbe creare silenziosamente nuovi database, nuovi incentivi alla sorveglianza e nuove modalità di fallimento per tutti.",
      ],
    },
    betterWays: {
      title: "Esistono modi migliori per proteggere i bambini",
      intro:
        "Un punto della critica scientifica merita particolare attenzione: il CSAM è prova di un reato già avvenuto. Il vero obiettivo dovrebbe essere prevenire gli abusi, sostenere le vittime e consentire indagini mirate che possano davvero identificare gli autori.",
    },
    privateNote: {
      title: "Perché questo conta per PrivateNote",
      paragraphs: [
        "In PrivateNote il principio è semplice: quando crei una nota cifrata, solo le persone che scegli dovrebbero poterla leggere. Non noi. Non gli inserzionisti. Non i provider cloud. Nessun altro.",
        "Non è uno slogan. È il risultato di decenni di ingegneria crittografica. Il dibattito su Chat Control chiede se la comunicazione privata debba restare davvero privata, o se ogni dispositivo debba diventare un checkpoint obbligatorio che ispeziona i messaggi prima che vengano cifrati.",
      ],
    },
    policyReality: {
      title: "La politica dovrebbe seguire la realtà tecnica",
      paragraphs: [
        "Persone ragionevoli possono non essere d’accordo sulle politiche pubbliche. **Ma la politica dovrebbe essere informata dalla realtà tecnica.** Quando centinaia di crittografi, informatici, ingegneri della sicurezza e ricercatori di privacy avvertono che una tecnologia proposta non può mantenere le promesse senza indebolire garanzie di sicurezza fondamentali, i legislatori dovrebbero ascoltare.",
        "Proteggere i bambini e proteggere le comunicazioni sicure non sono obiettivi incompatibili. L’Europa dovrebbe perseguire soluzioni capaci di fare entrambe le cose.",
      ],
    },
  },
  ctaTitle: "Invia note private senza consegnare la chiave al server",
  ctaBody: "PrivateNote cifra le note nel browser e conserva la chiave di decifratura nel frammento dell’URL.",
  ctaButton: "Prova PrivateNote ->",
};
