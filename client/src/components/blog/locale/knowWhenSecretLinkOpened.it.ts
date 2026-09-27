import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedIt: BlogGuideArticleCopy = {
  heroAlt:
    "Pannello notifiche che mostra un avviso di nota aperta senza alcun contenuto del messaggio visibile",
  heroCaption:
    "Solo stato: aperta, distrutta, scaduta o revocata—mai il segreto stesso.",
  intro: [
    "Dopo aver inviato un link sensibile, la domanda naturale è: **l’hanno già aperto?** Aspettare in silenzio è stressante; inseguire le persone in chat crea solo più rumore in chiaro.",
    "PrivateNote può avvisarti quando lo stato di consegna cambia—via e-mail, con avvisi in tempo reale nella scheda finché il sito è aperto, e opzionalmente con notifiche del browser—senza mai inviare il contenuto della nota via e-mail.",
    "Questa visibilità ti aiuta a ruotare le credenziali, revocare link non aperti o semplicemente smettere di chiederti se la consegna sia arrivata.",
  ],
  sections: [
    {
      title: "Cosa puoi sapere (e cosa no)",
      takeaway: "Gli avvisi riguardano eventi del ciclo di vita, non il testo del messaggio.",
      paragraphs: [
        "Gli eventi tipici includono nota aperta, distrutta, scaduta, allegato scaricato e revocata. La formulazione resta volutamente grossolana: abbastanza per fiducia operativa, non un feed di sorveglianza sul comportamento di lettura.",
        "Il modello di privacy di PrivateNote continua ad applicarsi. Le e-mail di stato e i toast **non** includono il segreto decifrato. Se ti serve una ricevuta strutturata per una traccia di audit, usa la **prova di accesso** sui piani idonei—descritta in [revoca e prova di accesso](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Segnale", "Dove compare", "Utile per"],
        rows: [
          [
            "Avvisi e-mail (account verificato)",
            "L’e-mail del tuo account",
            "Conferma asincrona quando non sei sul sito",
          ],
          [
            "Avvisi in tempo reale nella scheda (accesso effettuato)",
            "PrivateNote aperto in un browser",
            "Consapevolezza quasi in tempo reale durante una consegna attiva",
          ],
          [
            "Notifiche del browser (autorizzazione richiesta)",
            "Autorizzazione OS richiesta da Personalizza",
            "Avviso quando la scheda è in background",
          ],
          [
            "Account → Attività (in base al piano)",
            "La tua cronologia attività privata",
            "Rivedere in seguito cosa è successo",
          ],
        ],
      },
    },
    {
      title: "Come attivare gli avvisi",
      takeaway:
        "Accedi, verifica l’e-mail, poi attiva gli avvisi per nota o nelle preferenze.",
      checklist: [
        "Accedi e verifica l’e-mail del tuo account",
        "Attiva le notifiche e-mail in Account → Preferenze",
        "Quando crei una nota, apri Personalizza → Avvisi e-mail",
        "Scegli notifica all’apertura, oppure all’apertura e alla distruzione (per flussi a lettura unica)",
        "Consenti le notifiche del browser se vuoi avvisi a livello OS",
        "Tieni PrivateNote aperto per i toast in tempo reale nella scheda durante le consegne critiche",
      ],
      paragraphsAfterChecklist: [
        "Le notifiche di apertura sono disponibili agli utenti Free connessi una volta verificata l’e-mail; il monitoraggio più ricco come gli eventi di download degli allegati e gli strumenti di revoca si ampliano sui piani a pagamento.",
        "Per il modello di consegna sottostante, vedi [come creare una nota privata](blog:how-to-make-a-private-note) e [inviare un messaggio segreto senza account](blog:send-secret-message-without-account) per i destinatari.",
      ],
      midCta: {
        body: "Stai inviando un segreto urgente e ti serve conferma che sia arrivato?",
        button: "Crea una nota con avvisi di apertura",
      },
    },
    {
      title: "Usare gli avvisi in modo operativo",
      takeaway:
        "Tratta «aperta» come un segnale per ruotare o chiudere il ciclo—non come prova di lettura attenta.",
      bullets: [
        "Consegna password: quando vedi aperta, ruota o conferma che il destinatario ha cambiato la credenziale",
        "Invio documento: aperta + allegato scaricato (dove disponibile) significa che la finestra del file è attiva",
        "Nessuna apertura prima della scadenza: segui su un altro canale, o revoca se ancora non aperta",
        "Apertura inattesa: considera il link potenzialmente compromesso; revoca se possibile e reinvia",
      ],
      calloutTitle: "Limite onesto",
      callout:
        "«Aperta» significa che il flusso di rivelazione è avanzato—non che una persona abbia letto attentamente ogni riga, e non che gli screenshot fossero impossibili.",
    },
    {
      title: "Aspettative sulla privacy",
      takeaway: "Monitorare la consegna non deve ricreare un’e-mail del segreto.",
      paragraphs: [
        "A volte i team abusano delle ricevute di lettura come sorveglianza della produttività. Il design di PrivateNote mantiene gli avvisi minimi: etichette di stato e riferimenti, non dump di contenuto.",
        "Questo corrisponde alla promessa del prodotto altrove—crittografia lato browser, [concetti di crittografia end-to-end](blog:what-is-end-to-end-encryption), e non rimettere mai il segreto nell’e-mail solo per dimostrare che è arrivato.",
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "L’avviso includerà il testo della mia nota?",
          answer:
            "No. Gli avvisi e-mail e in tempo reale descrivono solo lo stato. Il contenuto del messaggio resta fuori dai canali di notifica.",
        },
        {
          question: "Devo tenere la scheda aperta?",
          answer:
            "Gli avvisi e-mail funzionano senza la scheda. I toast in tempo reale nella scheda richiedono il sito aperto; le notifiche del browser aiutano quando la scheda è in background e l’autorizzazione è concessa.",
        },
        {
          question: "I destinatari possono vedere che ho attivato gli avvisi?",
          answer:
            "I destinatari si concentrano sull’aprire e rivelare la nota. Le impostazioni di notifica del mittente non fanno parte del payload segreto che decifrano.",
        },
        {
          question: "E se devo interrompere l’accesso dopo l’invio?",
          answer:
            "Se la nota è ancora non aperta, revoca il link dalla schermata di successo o dall’attività dell’account sui piani idonei. Dettagli in [revoca e prova di accesso](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "In sintesi",
      takeaway: "Chiudi il ciclo senza copiare il segreto in un’altra casella di posta.",
      paragraphs: [
        "Sapere quando un link è stato aperto ti permette di chiudere la storia operativa: ruotare, fare follow-up o revocare.",
        "Attiva il canale di avviso che corrisponde al tuo modo di lavorare—e-mail per l’asincrono, avvisi in tempo reale per le consegne live—e lascia il testo in chiaro dove deve stare: dentro la nota crittografata.",
      ],
    },
  ],
  ctaTitle: "Invia il segreto. Ricevi lo stato.",
  ctaBody:
    "Attiva gli avvisi di apertura e distruzione così sai quando una consegna PrivateNote avanza—senza mettere il messaggio nell’e-mail.",
  ctaButton: "Crea una nota con avvisi",
};
