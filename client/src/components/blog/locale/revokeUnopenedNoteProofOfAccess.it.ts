import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessIt: BlogGuideArticleCopy = {
  heroAlt:
    "Vista attività dell’account con una nota non aperta e un’opzione chiara per revocare il link",
  heroCaption:
    "Hai cambiato idea prima che qualcuno la aprisse? Distruggi il link. Ti serve una ricevuta? Visualizza la prova di accesso.",
  intro: [
    "La condivisione sicura non riguarda solo la cifratura al momento dell’invio. Riguarda anche il **controllo dopo**: interrompere un link che non avresti dovuto inviare e conservare un registro rispettoso della privacy su ciò che è successo a un link che hai inviato.",
    "I piani Starter e Business di PrivateNote aggiungono due strumenti complementari. **Revocare** distrugge un link non aperto così non può più essere rivelato. La **prova di accesso** mostra una cronologia semplice—creata, aperta, allegato scaricato, distrutta, scaduta o revocata—senza esporre il contenuto della nota.",
    "Insieme rispondono alle due domande di follow-up che i team fanno davvero: «Posso riprenderla?» e «Posso dimostrare che il link è stato consultato?»",
  ],
  sections: [
    {
      title: "Revoca finché è ancora non aperta",
      takeaway:
        "La revoca funziona prima della rivelazione—non dopo che qualcuno ha già decifrato una copia.",
      paragraphs: [
        "Se una nota non è ancora stata aperta, puoi revocarla dalla schermata di successo dopo la creazione o da Account → Attività. Il link smette di funzionare; i destinatari che arrivano dopo vedono che l’accesso non c’è più.",
        "Revocare è la mossa giusta quando hai incollato il destinatario sbagliato, hai visto il segreto nella chat sbagliata o hai deciso che la consegna deve aspettare. **Non** è la cancellazione remota di un file già scaricato dopo la rivelazione: nessuno strumento di consegna E2EE onesto può prometterlo.",
      ],
      checklist: [
        "Crea la nota su Starter o Business",
        "Se qualcosa sembra sbagliato, revoca subito dalla schermata di successo",
        "Oppure apri Account → Attività e revoca mentre lo stato è ancora non aperta",
        "Invia una nota sostitutiva se il destinatario ha ancora bisogno del segreto",
      ],
      midCta: {
        body: "Ti servono riprese e ricevute per consegne sensibili?",
        button: "Crea una nota che puoi revocare",
      },
    },
    {
      title: "Prova di accesso senza perdite di contenuto",
      takeaway:
        "Un registro di stato rispettoso della privacy: il link è stato consultato—non una trascrizione della lettura.",
      paragraphs: [
        "La prova di accesso è pensata per conversazioni operative e di conformità che necessitano evidenza di eventi di consegna senza mettere segreti in email o ticket.",
        "La cronologia resta di alto livello: creata, link aperto, allegato scaricato (quando tracciato), distrutta, scaduta, revocata. Questo allinea la postura sulla privacy degli [avvisi di apertura](blog:know-when-secret-link-opened): stato, non sostanza.",
      ],
      calloutTitle: "Leggi l’etichetta con attenzione",
      callout:
        "La prova di accesso è una ricevuta che il link è stato consultato—non una prova crittografica che una persona specifica abbia letto attentamente ogni parola, e non un DRM contro gli screenshot.",
    },
    {
      title: "Come si integrano revoca e prova",
      takeaway:
        "Impedisci l’accesso quando puoi; documenta l’accesso quando devi.",
      comparisonTable: {
        headers: ["Situazione", "Usa", "Esito"],
        rows: [
          [
            "Destinatario sbagliato, ancora non aperta",
            "Revocare",
            "Il link muore; crea una nota corretta",
          ],
          [
            "Consegna completata, l’auditor chiede «è stata aperta?»",
            "Prova di accesso",
            "Mostra gli eventi della cronologia senza contenuto",
          ],
          [
            "Nota già rivelata",
            "Ruota il segreto / considera esposto",
            "La revoca non recupera più le copie in chiaro",
          ],
          [
            "In attesa del destinatario",
            "Avvisi + durata",
            "Fai follow-up o lascia scadere automaticamente se mai aperta",
          ],
        ],
      },
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Posso revocare dopo che il destinatario ha aperto la nota?",
          answer:
            "La revoca riguarda le note non aperte. Dopo la rivelazione, assumi che il destinatario possa trattenere ciò che ha visto; ruota le credenziali o tratta il documento come consegnato.",
        },
        {
          question: "La prova di accesso include il testo del messaggio?",
          answer:
            "No. È solo una cronologia di stato. I contenuti restano fuori da Attività e dalle viste della prova.",
        },
        {
          question: "La revoca è disponibile su Free?",
          answer:
            "Revoca e prova di accesso sono funzionalità Starter/Business. Gli utenti Free ottengono comunque cifratura, durate brevi e avvisi di apertura una volta collegati con un’email verificata.",
        },
        {
          question: "Dove trovo la prova in seguito?",
          answer:
            "Apri Account → Attività, trova la nota e scegli Vedi prova di accesso quando il piano lo supporta.",
        },
      ],
    },
    {
      title: "In sintesi",
      takeaway: "Controlla il link non aperto; documenta quello aperto.",
      paragraphs: [
        "La cifratura risponde a «chi può leggere questo in transito e a riposo.» Revoca e prova rispondono a «cosa facciamo dopo.»",
        "Usale con i [codici di verifica](blog:recipient-verification-code-before-reveal) e gli [avvisi di apertura](blog:know-when-secret-link-opened) per un ciclo di consegna completo—dall’invio alla conferma, fino a ripresa o ricevuta.",
      ],
    },
  ],
  ctaTitle: "Riprendi un segreto non aperto.",
  ctaBody:
    "Revoca i link che non dovrebbero mai aprirsi e conserva una cronologia rispettosa della privacy quando devi mostrare che una consegna è stata consultata—senza inviare il segreto via email.",
  ctaButton: "Crea una nota privata",
};
