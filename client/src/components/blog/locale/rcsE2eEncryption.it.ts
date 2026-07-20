import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionIt: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "Un iPhone e uno smartphone Android con icone di lucchetto nei fumetti dei messaggi, collegati da un lucchetto centrale che rappresenta l'RCS cifrato end-to-end",
  heroCaption:
    "L'RCS multipiattaforma finalmente si aggiorna: la stessa garanzia di cifratura end-to-end, che il fumetto sia blu o verde.",
  intro: [
    "Per anni, una delle più grandi frustrazioni nella messaggistica mobile non è stata la mancanza di funzionalità, ma la mancanza di una privacy coerente.",
    "Gli utenti Apple godevano di conversazioni cifrate end-to-end tramite iMessage, mentre gli utenti Android potevano beneficiare della cifratura usando Google Messages con altri dispositivi Android. I messaggi scambiati tra Android e iPhone non hanno mai avuto la stessa protezione. Le conversazioni multipiattaforma si basavano su Rich Communication Services (RCS), ma senza cifratura end-to-end interoperabile.",
    "Questo sta finalmente cambiando.",
    "Google ha recentemente annunciato che la messaggistica RCS cifrata end-to-end tra Android e iPhone ha iniziato il roll-out, in seguito alla pubblicazione dell'ultimo GSMA RCS Universal Profile, che incorpora il protocollo Messaging Layer Security (MLS). Man mano che il supporto si estende a dispositivi e applicazioni di messaggistica, miliardi di utenti otterranno una privacy più forte per le conversazioni quotidiane.",
    "Si tratta di una pietra miliare importante per la comunicazione digitale. È anche una buona occasione per capire cosa protegge davvero [la cifratura end-to-end](blog:what-is-end-to-end-encryption) — e cosa no.",
  ],
  sections: [
    {
      title: "Uno standard migliore per la messaggistica quotidiana",
      paragraphs: [
        "La transizione dagli SMS all'RCS ha modernizzato i messaggi di testo con funzionalità come la condivisione di foto ad alta qualità, gli indicatori di digitazione, le conferme di lettura e conversazioni di gruppo più ricche. La sicurezza, tuttavia, è rimasta incoerente in base ai dispositivi coinvolti.",
        "Finora, gli utenti Android che scrivevano ad altri utenti Android potevano godere della cifratura end-to-end tramite Google Messages, mentre gli utenti iPhone avevano la stessa protezione all'interno di iMessage. I messaggi scambiati tra Android e iPhone, invece, non avevano cifratura end-to-end interoperabile.",
        "Lo standard RCS aggiornato cambia questo scenario. Man mano che il supporto viene distribuito, gli utenti di entrambe le piattaforme possono finalmente beneficiare delle stesse garanzie fondamentali di privacy, indipendentemente dal telefono che possiedono.",
        "Per una tecnologia di comunicazione usata da miliardi di persone, questo è un passo avanti importante.",
      ],
    },
    {
      title: "Cosa significa davvero la cifratura end-to-end",
      paragraphs: [
        "La cifratura end-to-end significa che un messaggio viene cifrato prima di lasciare il dispositivo del mittente e può essere decifrato solo sul dispositivo del destinatario.",
        "A differenza della cifratura di trasporto tradizionale, dove un fornitore di servizi può essere in grado di accedere ai messaggi una volta che raggiungono i suoi server, la cifratura end-to-end garantisce che solo i dispositivi coinvolti nella comunicazione possiedano le chiavi necessarie per leggere la conversazione. Il servizio di messaggistica trasporta dati cifrati ma non può decifrarne il contenuto.",
        "Per gli utenti, il vantaggio è semplice: la tua conversazione resta privata tra te e la persona con cui stai parlando.",
        "Una cifratura end-to-end correttamente implementata protegge da molte minacce comuni. Chi monitora una rete Wi-Fi pubblica non può semplicemente leggere i tuoi messaggi, i fornitori di servizi internet non possono ispezionarne il contenuto, e una violazione dei server del fornitore di messaggistica esporrebbe dati cifrati piuttosto che conversazioni leggibili.",
        "Per la comunicazione quotidiana, questo rappresenta un miglioramento significativo della privacy. Per una definizione tecnica più approfondita, consulta la nostra guida su [cosa significa la cifratura end-to-end](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "La cifratura ha dei limiti",
      paragraphs: [
        "Per quanto importante sia la cifratura end-to-end, viene spesso fraintesa.",
        "La cifratura protegge i messaggi mentre vengono trasmessi e mentre sono conservati dal fornitore di messaggistica. Non controlla ciò che accade dopo che il messaggio è stato consegnato.",
        "Una volta che un messaggio è stato decifrato sul telefono del destinatario, torna a essere informazione ordinaria. Il destinatario può conservarlo indefinitamente, inoltrarlo a qualcun altro, copiarne il contenuto in un'altra applicazione, o semplicemente fare uno screenshot. In base alla piattaforma di messaggistica, le conversazioni possono anche essere sincronizzate su più dispositivi o incluse in backup cloud.",
        "In altre parole, la cifratura end-to-end protegge la consegna — non garantisce che le informazioni scompaiano dopo essere state lette.",
      ],
      callout:
        "Questa distinzione diventa sempre più importante quando le informazioni condivise sono particolarmente sensibili — password, codici di ripristino, chiavi API e altre credenziali che non dovrebbero rimanere per sempre in una cronologia chat ricercabile.",
    },
    {
      title: "Non ogni segreto appartiene alla cronologia chat",
      paragraphs: [
        "La maggior parte delle conversazioni merita di essere conservata. I messaggi con la famiglia, le chiacchierate con gli amici o le conversazioni di lavoro diventano spesso un archivio utile che le persone si aspettano di poter riconsultare in seguito.",
        "Le credenziali sensibili sono diverse.",
        "Immagina di inviare una password amministrativa temporanea a un collega. La password viaggia in sicurezza su internet grazie alla cifratura end-to-end, ma sei mesi dopo potrebbe ancora trovarsi in una cronologia di conversazione ricercabile. Lo stesso vale per chiavi API, codici di ripristino, seed phrase di criptovalute, informazioni confidenziali di clienti o credenziali di accesso temporanee.",
        "In molti incidenti di sicurezza reali, il problema non è che il segreto sia stato intercettato durante la trasmissione. È che è rimasto memorizzato da qualche parte molto tempo dopo che avrebbe dovuto essere dimenticato.",
        "Man mano che la messaggistica diventa sempre più sicura, l'attenzione si sta gradualmente spostando su una sfida diversa: ridurre la persistenza non necessaria. Ecco perché alcuni [segreti non dovrebbero mai essere inviati in chat](blog:secrets-never-send-in-chat) — cifrati o no.",
      ],
    },
    {
      title: "Quando i link monouso hanno più senso",
      paragraphs: [
        "Per informazioni che devono essere condivise solo una volta, lasciarle all'interno di una conversazione permanente non è sempre l'ideale.",
        "Un'alternativa sempre più comune è condividere informazioni sensibili tramite [link cifrati monouso](blog:one-time-secret-links) che scadono automaticamente o diventano inaccessibili dopo essere stati visualizzati. Invece di incorporare il segreto direttamente all'interno di una conversazione in corso, il destinatario apre un link dedicato, recupera l'informazione, e il link alla fine scade — o, in alcuni casi, può essere consultato solo una volta.",
        "Questo approccio non sostituisce la messaggistica cifrata. Piuttosto la completa affrontando un problema diverso.",
        "Le applicazioni di messaggistica sono progettate per preservare le conversazioni. I link monouso sono progettati per minimizzare l'esposizione a lungo termine di informazioni che, idealmente, non dovrebbero rimanere memorizzate indefinitamente.",
        "Che tu stia condividendo una password temporanea, un token API, una chiave di licenza software o un altro valore confidenziale, limitare il tempo in cui quell'informazione esiste può ridurre significativamente il rischio di una futura divulgazione accidentale.",
      ],
    },
    {
      title: "La privacy è più della sola cifratura",
      paragraphs: [
        "Il roll-out della messaggistica RCS cifrata end-to-end e interoperabile è davvero una buona notizia. Per la prima volta, gli utenti Android e iPhone possono godere dello stesso livello di protezione indipendentemente dall'ecosistema che utilizzano.",
        "È anche un promemoria del fatto che la privacy riguarda più della sola cifratura.",
        "Proteggere le informazioni mentre viaggiano su internet è essenziale, ma lo è anche pensare a cosa succede dopo. Alcune informazioni meritano di rimanere disponibili per anni. Altre informazioni — in particolare password, codici di ripristino e credenziali temporanee — sono spesso più sicure quando esistono solo per il tempo necessario.",
        "Le app di messaggistica moderne e i servizi di condivisione di segreti monouso servono scopi diversi. Nessuno dei due sostituisce l'altro; anzi, affrontano aspetti diversi della comunicazione sicura. Scegliere l'approccio giusto dipende da cosa stai condividendo e da quanto tempo deve esistere.",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Questo sostituisce gli SMS?",
          answer:
            "No. I tradizionali messaggi SMS restano non cifrati. Le nuove protezioni si applicano solo alle conversazioni RCS compatibili, quando sia i dispositivi che le applicazioni di messaggistica supportano l'ultimo standard RCS cifrato end-to-end.",
        },
        {
          question: "Google o Apple possono leggere i messaggi RCS cifrati?",
          answer:
            "La cifratura end-to-end è progettata in modo che solo i dispositivi coinvolti nella comunicazione possiedano le chiavi necessarie per decifrare i messaggi. I fornitori trasportano dati cifrati ma non possono accedere al contenuto in chiaro delle tue conversazioni.",
        },
        {
          question: "Qualcuno può ancora fare uno screenshot?",
          answer:
            "Sì. Una volta che un messaggio è stato decifrato sul dispositivo del destinatario, questo può ancora fare screenshot, copiare il contenuto o inoltrarlo ad altri. La cifratura end-to-end protegge la trasmissione del messaggio, non ciò che il destinatario decide di farne in seguito.",
        },
        {
          question: "I link monouso sono più sicuri delle app di messaggistica?",
          answer:
            "Non necessariamente — risolvono un problema diverso. La messaggistica cifrata end-to-end è eccellente per le conversazioni continue. I [link monouso o a scadenza](blog:one-time-secret-links) sono spesso più adatti per condividere informazioni sensibili che non dovrebbero rimanere memorizzate indefinitamente nella cronologia chat.",
        },
      ],
    },
  ],
  referencesTitle: "Per saperne di più",
  references: [
    {
      label:
        "Gli utenti Android e iPhone possono ora godere della messaggistica RCS cifrata end-to-end (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Condividi segreti che non dovrebbero vivere in chat",
  ctaBody:
    "Quando devi consegnare a qualcuno una password, una chiave API o un codice di ripristino, invia una nota monouso cifrata lato browser invece di incollarla in Messaggi. Imposta una scadenza breve o l'autodistruzione dopo la lettura, così il segreto non resta a lungo in una cronologia ricercabile.",
  ctaButton: "Crea una nota privata",
};
