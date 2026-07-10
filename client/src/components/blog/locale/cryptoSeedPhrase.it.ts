import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseIt: CryptoSeedArticleCopy = {
  heroAlt: "Concetto di condivisione cifrata dei file che illustra la cifratura locale prima dell’invio di segreti",
  intro: [
    "Una seed phrase di criptovaluta è uno dei segreti più preziosi che potrai mai possedere. Di solito non può essere reimpostata. Non esiste un pulsante “Password dimenticata”. Chi la possiede, in genere, controlla il wallet e tutto ciò che contiene.",
    "Può sembrare strano leggerlo sul blog di un’azienda che costruisce link cifrati monouso. Ma la sicurezza non consiste nel fingere che ogni strumento sia adatto a ogni compito: consiste nel scegliere l’approccio giusto per ciò che stai proteggendo, inclusi i limiti del nostro stesso prodotto.",
    "Per **segreti sostituibili**, come password Wi‑Fi, credenziali temporanee, codici di recupero MFA, molte chiavi API e messaggi aziendali riservati, un [link cifrato monouso](blog:one-time-secret-links) è un’ottima soluzione.",
    "I **segreti master di lunga durata**, come le seed phrase crypto, meritano un approccio diverso.",
  ],
  ruleTitle: "Regola n. 1",
  ruleParagraphs: [
    "**Non inserire una seed phrase di criptovaluta in un sito web, incluso PrivateNote.** Se la trasmissione è inevitabile, cifra prima localmente e condividi **solo il testo cifrato**. PrivateNote serve a trasportare dati già cifrati, non a digitare la frase mnemonica.",
    "**I vendor legittimi di hardware wallet non ti chiedono di inserire la frase di recupero su un sito web.** Se un sito richiede la tua seed phrase, trattalo come altamente sospetto e verifica l’autenticità prima di procedere.",
    "Evita di inserire seed phrase su siti web ogni volta che puoi.",
  ],
  offlineAlternatives: [
    { label: "Backup su metallo", body: "conservato in una cassaforte o cassetta di sicurezza" },
    { label: "SLIP-39", body: "o schemi simili per eredità o disaster recovery" },
    { label: "Trasferimento tramite hardware wallet", body: "quando pratico, invece della frase di recupero" },
  ],
  seedPhraseTraits: [
    { label: "Concede pieno controllo", body: "sugli asset" },
    { label: "Spesso dura decenni", body: "senza rotazione" },
    { label: "Non può essere cambiata", body: "se compromessa" },
    { label: "Non prevede recupero dal vendor", body: "se viene rubata" },
  ],
  oneTimeLinkFit: [
    "Chiavi API e password temporanee",
    "Credenziali Wi‑Fi",
    "Codici di recupero MFA",
    "Messaggi aziendali e bozze legali",
    "Token di accesso temporanei",
  ],
  localEncryptFirst: [
    "Seed phrase di criptovalute",
    "Backup di hardware wallet",
    "Chiavi private CA e chiavi di firma",
    "Materiale di recupero del gestore password",
    "Segreti master di alto valore",
  ],
  philosophySteps: [
    "evita la trasmissione quando puoi",
    "cifra localmente",
    "carica solo testo cifrato",
    "cancella il testo in chiaro temporaneo",
    "quando possibile, invia la passphrase del file age, non la mnemonica, su un canale separato",
  ],
  sections: {
    sendAtAll: {
      title: "Devi davvero inviarla?",
      question: "**la frase deve davvero lasciare il luogo in cui si trova?** Spesso la risposta è no.",
      outro:
        "Ogni trasmissione aggiunge una possibilità di esposizione. Se puoi evitare di inviarla, fallo. Per altri canali che conservano i segreti a tempo indefinito, leggi [perché l’e-mail è il posto peggiore per i segreti](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Perché le seed phrase sono diverse",
      p1: "Una seed phrase è il segreto radice di un intero patrimonio digitale, non “solo un’altra password”.",
      listIntro: "A differenza della maggior parte delle credenziali:",
      outro:
        "Non ti stai difendendo solo dagli attaccanti di oggi: stai prendendo decisioni che potrebbero contare tra dieci o vent’anni.",
    },
    browserEncryption: {
      title: "La cifratura nel browser è forte, ma non è magia",
      paragraphs: [
        "PrivateNote cifra nel browser prima dell’invio. I nostri server vedono solo testo cifrato; la chiave non ci raggiunge mai. È molto meglio di [e-mail](blog:why-email-is-worst-for-secrets), chat o documenti cloud per i segreti quotidiani, e rispetta un modello rigoroso di [cifratura end-to-end](blog:what-is-end-to-end-encryption) per il contenuto della nota.",
        "Ogni app crittografica nel browser condivide un vincolo: **il testo in chiaro deve esistere nel browser prima della cifratura.** JavaScript malevolo, proveniente da estensioni, compromissioni della supply chain, injection o CDN compromessi, potrebbe teoricamente leggerlo prima. È un limite intrinseco della cifratura lato client nel browser, non specifico di PrivateNote.",
        "Per chiavi API e password temporanee, questo compromesso di solito è accettabile. Per una seed phrase che protegge i risparmi di una vita, potresti voler fidarti di meno sistemi.",
      ],
    },
    encryptLocal: {
      title: "Cifra prima che il browser la veda",
      intro: "Cifra localmente, poi carica solo il testo cifrato:",
      outro: "PrivateNote non riceve mai la mnemonica, solo dati cifrati.",
      callout:
        "La cifratura locale **non** ferma il malware sul tuo computer. **Tiene il testo in chiaro fuori da web app, servizi cloud e server** che non ne hanno bisogno. Riduci la base di sistemi fidati; non elimini il rischio di un endpoint compromesso.",
    },
    whichTool: {
      title: "Quale strumento usare",
      age: "**age** (consigliato per la maggior parte degli utenti): cifratura di file semplice con impostazioni sicure — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: eccellente se usi già OpenPGP.",
      openssl: "**OpenSSL**: affidabile e potente; CLI di basso livello, più adatto a utenti esperti.",
    },
    ageExample: {
      title: "Esempio minimo (age)",
      passphraseTitle: "Ti serve una passphrase forte?",
      passphraseBefore: "Usa un segreto lungo e unico per `age -p`. Generane uno localmente nel browser: il",
      passphraseLink: "generatore di passphrase",
      passphraseAfter: "su passwords.lu funziona lato client; non viene caricato nulla.",
      p1: "Dopo aver verificato `seed.txt.age`, **cancella in modo sicuro il testo in chiaro** sul dispositivo del mittente. Dopo l’importazione nel wallet, anche il destinatario dovrebbe **cancellare la propria copia in chiaro**.",
      p2: "Per scambi regolari con la stessa persona, `age -r` (modalità a chiave pubblica) evita una passphrase condivisa: vale la pena impararlo separatamente.",
      docsLabel: "Documentazione:",
    },
    separateChannels: {
      title: "Usa canali separati",
      intro:
        "Separa il file cifrato dal segreto che lo sblocca. Stai separando il testo cifrato `.age` dalla **passphrase di decifratura age**, non inviando la seed phrase mnemonica su un secondo canale.",
      steps: [
        "Carica il **file cifrato** (testo cifrato) con PrivateNote",
        "Invia la **passphrase age** che decifra quel file tramite Signal, telefono o di persona",
      ],
      outro: "Un attaccante deve compromettere più sistemi, non un solo link.",
    },
    recommend: {
      title: "Che cosa consigliamo",
      intro:
        "La distinzione vera è tra segreti **sostituibili** e segreti **master di lunga durata**, non solo tra formato del file o canale.",
      oneTimeTitle: "Adatti ai link monouso",
      oneTimeSubtitle: "Segreti sostituibili che puoi ruotare o revocare",
      localTitle: "Cifra prima localmente",
      localSubtitle: "Segreti master di lunga durata che cambiano raramente",
      outro:
        "Per le chiavi API in particolare, leggi la nostra guida su [come condividere una chiave API in modo sicuro](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Abbina lo strumento al rischio",
      body: "Ogni approccio ha ipotesi di fiducia: gestori di password, hardware wallet, strumenti offline, crittografia nel browser. Nessuno è perfetto; i compromessi cambiano. La domanda è se siano adatti al **valore** di ciò che proteggi.",
    },
    philosophy: {
      title: "La nostra filosofia",
      p1: "Abbiamo costruito PrivateNote perché la cifratura avvenga **prima** che i dati raggiungano i nostri server. Per segreti temporanei e sostituibili, questo è meglio di e-mail, messaggistica o cloud storage. Puoi anche [inviare un segreto senza account](blog:send-secret-message-without-account). Leggi [come funziona PrivateNote](app:how-it-works) per il modello completo.",
      listIntro: "Per una seed phrase che potrebbe rappresentare i risparmi di una vita:",
      closingQuote:
        "A volte il consiglio più sicuro non è “usa il nostro prodotto”. È “usa lo strumento giusto per il lavoro”.",
    },
  },
  ctaTitle: "Condividi segreti sostituibili, non seed phrase, nel browser",
  ctaBody:
    "Crea una nota cifrata monouso per chiavi API, password e credenziali. Per le seed phrase, cifra prima localmente con age e condividi solo il testo cifrato.",
  ctaButton: "Prova PrivateNote ->",
};
