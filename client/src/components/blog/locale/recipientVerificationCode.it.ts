import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeIt: BlogGuideArticleCopy = {
  heroAlt:
    "Schermo di un laptop che mostra un passaggio di verifica a sei cifre prima che una nota privata possa essere rivelata",
  heroCaption:
    "Il solo link non basta: il destinatario inserisce un codice monouso che condividi su un canale separato.",
  intro: [
    "Un link a una nota privata è potente perché di solito trasporta il materiale necessario per decifrare il messaggio. Quella comodità è anche un rischio: se l’URL completa finisce nella casella, nella chat o nello screenshot sbagliati, il segreto può essere raggiungibile prima che il destinatario previsto lo apra.",
    "I **codici di verifica** del destinatario aggiungono un secondo segreto di consegna che controlli tu. Dopo aver creato la nota, PrivateNote mostra un codice a sei cifre specifico della nota. Condividi quel codice separatamente—per telefono, Signal o un altro canale—così un link intercettato non basta per arrivare al passaggio di rivelazione.",
    "È diverso dall’eventuale wrapping con passphrase sul testo cifrato e diverso dall’accesso con account. È un cancello di consegna: **verifica, poi rivela**.",
  ],
  sections: [
    {
      title: "Solo link rispetto a link più codice",
      takeaway:
        "La consegna su canali separati trasforma un messaggio rubato in un puzzle incompleto.",
      paragraphs: [
        "I bearer link sono comuni nella condivisione sicura. Funzionano bene quando il canale è affidabile e la durata è breve. Funzionano meno bene quando lo stesso account e-mail o chat che riceve il link potrebbe anche essere monitorato, condiviso o compromesso.",
        "Richiedere un codice di verifica ripristina la classica separazione: invia il link sul canale A, il codice sul canale B. Un attaccante ha bisogno di entrambi. Questo schema si abbina naturalmente a [come condividere una password in modo sicuro](blog:how-to-share-a-password-securely) e ai [link segreti monouso](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Controllo", "Cosa protegge", "Cosa non fa"],
        rows: [
          [
            "Codice di verifica (Starter/Business)",
            "Blocca la rivelazione finché il destinatario non inserisce il codice monouso",
            "Non sostituisce il wrapping con passphrase né l’accesso all’account",
          ],
          [
            "Passphrase sulla nota",
            "Avvolge il testo cifrato così la decifratura richiede la passphrase",
            "Richiede comunque una condivisione out-of-band attenta di quella passphrase",
          ],
          [
            "Scadenza breve + una apertura",
            "Limita per quanto tempo un link trapelato resta utile",
            "Non ferma chi ha già link e codice in tempo",
          ],
        ],
      },
    },
    {
      title: "Come attivarlo",
      takeaway:
        "Attivalo in Consegna e verifica, poi condividi codice e link separatamente.",
      paragraphs: [
        "Nei piani Starter e Business idonei, apri **Personalizza** quando crei una nota e attiva **Richiedi codice di verifica** in Consegna e verifica. Puoi anche impostarlo come predefinito in Account → Preferenze così le nuove note ereditano il cancello.",
        "Dopo la creazione, la schermata di successo mostra il **codice di verifica del destinatario**. Copia il link della nota come di consueto, poi invia il codice per un’altra via. Informa il destinatario che vedrà un passaggio di verifica prima di **Rivela nota**.",
      ],
      checklist: [
        "Usare Starter o Business (funzione legata al piano)",
        "Attivare Richiedi codice di verifica per la nota (o come predefinito dell’account)",
        "Creare la nota e copiare il link",
        "Copiare il codice a sei cifre dalla schermata di successo",
        "Inviare link e codice su canali separati",
        "Confermare che il destinatario verifica prima di rivelare",
      ],
      midCta: {
        body: "Stai inviando qualcosa verso una casella che potrebbe essere condivisa o sorvegliata?",
        button: "Crea una nota con verifica",
      },
    },
    {
      title: "Cosa vive il destinatario",
      takeaway: "Prima il codice, poi l’avviso familiare di click-to-reveal.",
      paragraphs: [
        "Aprendo il link compare una schermata di verifica—non il contenuto decifrato. Dopo un codice corretto appare il cancello di rivelazione familiare: apri solo quando sei pronto, perché rivelare può consumare la nota secondo la sua policy di burn.",
        "I codici errati falliscono in modo chiuso. Il destinatario non ha bisogno di un account; solo del codice che hai condiviso. Per il ritardo intenzionale prima della decifratura, vedi [perché le note attendono il click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Quando usare i codici di verifica",
      takeaway: "Usali quando il canale del link è più debole del segreto.",
      bullets: [
        "Credenziali o documenti inviati via e-mail a una casella condivisa",
        "Link pubblicati in una chat di team con molti membri",
        "Consegne con alto rischio di screenshot o inoltro",
        "Qualsiasi segreto che proteggeresti anche con passphrase su canali separati",
      ],
      calloutTitle: "Consiglio pratico",
      callout:
        "Non mettere il codice di verifica nella stessa e-mail del link. Così entrambi i fattori finiscono in un unico messaggio intercettabile.",
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "Il codice di verifica è uguale a una password sulla nota?",
          answer:
            "No. Il codice di verifica è un cancello controllato dal server prima della rivelazione. Una passphrase della nota (se abilitata) avvolge il testo cifrato stesso ed è un controllo opzionale separato.",
        },
        {
          question: "Posso scegliere il mio codice?",
          answer:
            "PrivateNote genera un codice a sei cifre specifico della nota. Condividi quel valore generato; non inventi né riutilizzi un PIN personale.",
        },
        {
          question: "È disponibile su Free?",
          answer:
            "La verifica del destinatario è una capacità Starter e Business. Gli account Free possono comunque usare scadenza breve, limiti di apertura e wrapping opzionale con passphrase dove offerti.",
        },
        {
          question: "La verifica significa che PrivateNote può leggere la mia nota?",
          answer:
            "No. La verifica autorizza l’accesso al flusso di rivelazione. I contenuti del messaggio restano cifrati nel browser; gli avvisi di stato non includono mai il testo in chiaro.",
        },
      ],
    },
    {
      title: "In sintesi",
      takeaway: "Rendi il link incompleto senza il tuo codice out-of-band.",
      paragraphs: [
        "I codici di verifica servono nei momenti in cui la comodità lascerebbe altrimenti un’URL completamente decifrabile in un solo canale.",
        "Attiva il cancello, condividi il codice separatamente e tieni breve la durata della nota—soprattutto per [chiavi API](blog:how-to-share-api-key-securely), password e documenti.",
      ],
    },
  ],
  ctaTitle: "Aggiungi un passaggio di verifica separato alla consegna.",
  ctaBody:
    "Richiedi un codice di verifica monouso prima della rivelazione, poi invia quel codice su un canale diverso dal link.",
  ctaButton: "Crea una nota privata verificata",
};
