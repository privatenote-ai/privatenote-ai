import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesIt: BlogGuideArticleCopy = {
  heroAlt:
    "Vista del destinatario di una schermata di rivelazione PrivateNote con un chiaro avviso Apri quando sei pronto prima della decrittazione",
  heroCaption:
    "La rivelazione è intenzionale: il destinatario sceglie quando decrittare—e quando può scattare la politica di distruzione.",
  intro: [
    "Aprire una nota monouso deve essere deliberato. PrivateNote mostra quindi un cancello **clicca per rivelare** con un avviso esplicito prima che inizi la decrittazione.",
    "Il link può arrivare in anticipo. Il testo cifrato può restare cifrato finché qualcuno non è pronto. Decrittazione e consumo avvengono solo dopo che il destinatario conferma **Rivela nota**, con un testo che rende chiara la conseguenza: aprire solo quando sei pronto—non si può annullare.",
    "Quella pausa è voluta. Riduce le rivelazioni accidentali da anteprime dei link, tocchi sbagliati o apertura sul dispositivo sbagliato prima di essere pronti a consumare una nota monouso.",
  ],
  sections: [
    {
      title: "Un passaggio di conferma, non uno sblocco programmato",
      takeaway:
        "Il destinatario sceglie quando rivelare; il server non sblocca la nota secondo un calendario.",
      paragraphs: [
        "Oggi nel prodotto non esiste un interruttore «sblocca questa nota martedì alle 09:00». Invece, PrivateNote separa la **consegna** dall'**apertura**.",
        "Puoi inviare il link quando il coordinamento lo richiede. Il destinatario può attendere di essere su uno schermo privato, avere pronto eventuali codice di verifica o passphrase, ed essere preparato a un'apertura unica. Il segreto resta sigillato fino a quell'azione consapevole.",
        "I controlli di tempistica correlati restano importanti: durata della nota (quanto a lungo funziona il link se non viene mai aperto) e finestre di download degli allegati (quanto a lungo i file restano recuperabili dopo l'apertura). Quelli limitano la disponibilità; il clic-per-rivelare limita *quando inizia la decrittazione*.",
      ],
    },
    {
      title: "Perché le aperture accidentali costano care",
      takeaway: "Le note monouso puniscono allo stesso modo curiosità e tocchi sbagliati.",
      paragraphs: [
        "Se una nota è configurata per una sola visualizzazione, la prima rivelazione riuscita può distruggere gli accessi successivi. Aprirla sulla schermata di blocco del telefono, su un laptop condiviso o in un caffè con Wi‑Fi pubblico può sprecare l'unica visualizzazione—o esporre il contenuto nel posto sbagliato.",
        "La schermata di rivelazione impone una pausa. Combinata con i [codici di verifica del destinatario](blog:recipient-verification-code-before-reveal), ottieni due passaggi deliberati prima che compaia il testo in chiaro.",
      ],
      calloutTitle: "Testo di prodotto, di proposito",
      callout:
        "«Aprila solo quando sei pronto: l'azione non può essere annullata.» non è riempitivo di marketing. È la sbarra di sicurezza per i flussi di distruzione all'apertura.",
    },
    {
      title: "Come funziona il flusso del destinatario",
      takeaway: "Arrivare al link → verifica opzionale → rivelare → decrittare in locale.",
      checklist: [
        "Aprire l'URL PrivateNote completo",
        "Inserire un codice di verifica se il mittente ne ha richiesto uno",
        "Leggere l'avviso di rivelazione",
        "Premere Rivela nota solo quando sei pronto",
        "La decrittazione avviene nel browser; poi seguire eventuali politiche di apertura/distruzione",
      ],
      paragraphsAfterChecklist: [
        "I mittenti possono rafforzare la pausa con un'istruzione chiara: «Invio il link ora; non rivelarlo finché non siamo in chiamata.» La schermata di conferma supporta quell'istruzione, ma non programma né impone tecnicamente un orario futuro di apertura.",
        "Per il modello monouso più ampio, vedi [link segreti monouso](blog:one-time-secret-links) e [come creare una nota privata](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Invia una nota che il destinatario può tenere finché non è pronto ad aprirla.",
        button: "Crea una nota privata",
      },
    },
    {
      title: "Controlli di tempistica che si abbinano alla rivelazione",
      takeaway:
        "Durata, limiti di apertura e finestre dei file completano il cancello al clic.",
      comparisonTable: {
        headers: ["Controllo", "Protegge da", "Uso tipico"],
        rows: [
          [
            "Clicca per rivelare",
            "Decrittazione accidentale o prematura",
            "Qualsiasi nota monouso o ad alta sensibilità",
          ],
          [
            "Durata della nota",
            "Link non aperti obsoleti",
            "«Se non aprono entro 24 ore, eliminala»",
          ],
          [
            "Limite di aperture / visualizzazioni",
            "Accesso ripetuto dopo la consegna",
            "Una volta (o un piccolo numero fisso)",
          ],
          [
            "Finestra di download degli allegati",
            "Ri-download illimitati dei file dopo l'apertura",
            "15 minuti di default; più lunga sui piani idonei",
          ],
        ],
      },
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Posso programmare lo sblocco di una nota in un momento futuro?",
          answer:
            "Non come pianificazione lato server. Condividi il link in anticipo se serve e chiedi al destinatario di attendere—il clic-per-rivelare più la verifica opzionale mantengono il contenuto sigillato finché non conferma.",
        },
        {
          question: "L'anteprima del link decritta la nota?",
          answer:
            "La conferma di rivelazione è il passaggio intenzionale di decrittazione. I destinatari non devono premere Rivela finché non sono pronti affinché si applichi la politica di distruzione.",
        },
        {
          question: "Cosa succede se qualcuno apre il link per sbaglio?",
          answer:
            "Se si ferma prima di Rivela, potrebbe ancora tornare più tardi (in base alla durata). Dopo Rivela su una nota monouso, l'accesso successivo di solito è perso—invia una nuova nota se necessario.",
        },
        {
          question: "Come si collega alle notifiche e-mail?",
          answer:
            "Gli avvisi di apertura e distruzione dicono al mittente quando cambia lo stato. Non includono il contenuto del messaggio. Vedi [come sapere quando è stato aperto un link segreto](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "In sintesi",
      takeaway:
        "Rivelare è un'azione consapevole, non una conseguenza automatica del caricamento di un link.",
      paragraphs: [
        "Il clic-per-rivelare consente di inviare un link in anticipo senza decrittare la nota solo perché si è caricata la pagina di destinazione.",
        "Abbinalo a durate brevi, verifica quando i canali sono deboli e istruzioni chiare al destinatario—e ottieni una rivelazione ritardata pratica senza fingere che il prodotto possa eliminare uno screenshot da remoto.",
      ],
    },
  ],
  ctaTitle: "Lascia che il destinatario riveli solo quando è pronto.",
  ctaBody:
    "PrivateNote mantiene il testo cifrato sigillato finché il destinatario non conferma la rivelazione—così le note monouso hanno meno probabilità di bruciarsi con un tocco accidentale.",
  ctaButton: "Crea una nota con clicca per rivelare",
};
