import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersIt: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Devi inviare una password a un collega. Forse è il database di staging. Forse è una chiave Stripe che sta per andare in produzione. Forse è una credenziale SSH per un server che dovrebbero toccare solo tu e altre due persone.",
    "Apri Slack. Inizi a scrivere. Poi arriva quella piccola esitazione familiare.",
    "Quel messaggio resterà nella cronologia della chat. Si sincronizzerà su tre dispositivi. Potrebbe finire in un backup, in un indice di ricerca o in un archivio di compliance. Molto dopo aver ruotato la credenziale e averla dimenticata, quel messaggio sarà ancora lì.",
    "PrivateNote è un percorso diverso. Il segreto viene cifrato sul tuo computer prima di toccare qualsiasi rete. La chiave di decifratura vive solo nell'URL che condividi: il server che conserva la nota non la vede mai. La nota si autodistrugge dopo la prima lettura. Nulla resta permanente.",
    "Ecco come usarlo, partendo dall'opzione più semplice.",
  ],
  sections: [
    {
      title: "L'estensione per VS Code e Cursor",
      body: [
        "Se passi le giornate in VS Code o Cursor, questo è il percorso con meno attrito. Installi l'estensione una volta e resta nella barra laterale, sempre a un clic di distanza.",
        "Apri il pannello Estensioni (Cmd+Shift+X), cerca PrivateNote e fai clic su Installa. Dopo il riavvio della finestra, nella barra attività a sinistra compare una piccola icona a busta.",
        "Fai clic sull'icona. Si apre un pannello:",
      ],
      bullets: [
        "Scrivi o incolla il segreto nel campo del contenuto",
        "Imposta una scadenza: 15 minuti, 1 ora, 1 giorno o 7 giorni",
        'Lascia attiva l\'opzione «Elimina dopo la lettura» (impostazione predefinita)',
        "Fai clic su Condividi nota privata →",
      ],
    },
    {
      title: "Che cosa succede quando fai clic su Condividi",
      body: [
        "La crittografia integrata nel browser genera una chiave casuale a 256 bit. Quella chiave non lascia mai il tuo computer.",
        "Il contenuto viene cifrato con AES-256-GCM. Il risultato è un blocco di testo cifrato senza contenuto leggibile.",
        "Solo quel testo cifrato viene inviato al server PrivateNote. La chiave non è inclusa: non nel corpo della richiesta, non in un'intestazione HTTP, da nessuna parte.",
        "Il server conserva il blocco cifrato e restituisce un ID nota. Il tuo computer costruisce un URL condivisibile: l'ID della nota nel percorso, la chiave di decifratura nel frammento dell'URL, la parte dopo # che i browser non inviano mai ai server.",
        "Il link viene copiato negli appunti. Lo incolli dove normalmente avresti incollato il segreto. La differenza è che ora il segreto è il link, non la password stessa.",
      ],
    },
    {
      title: "Altri due modi per usare l'estensione",
      body: [
        "Non devi sempre aprire il pannello. Esistono due scorciatoie più veloci:",
        "Seleziona qualsiasi testo nell'editor e fai clic destro: nel menu contestuale vedrai Condividi come PrivateNote. Un prompt rapido chiede scadenza e preferenza di eliminazione dopo la lettura, poi copia il link negli appunti.",
        "Quando hai del testo selezionato, appare anche un'icona a lucchetto nella barra del titolo dell'editor, in alto a destra. Un clic lo invia.",
      ],
    },
    {
      title: "Se usi un assistente IA: il server MCP",
      body: [
        "Se lavori in Cursor con Claude o un altro modello, puoi lasciare che l'IA crei PrivateNote per tuo conto. Il server MCP (Model Context Protocol) aggiunge uno strumento create_private_note che l'agente può chiamare automaticamente.",
        "Aggiungi questo a ~/.cursor/mcp.json:",
      ],
      code: mcpConfig,
      bullets: [
        "Riavvia Cursor e controlla Impostazioni → MCP: dovresti vedere privatenote con un punto verde",
        'Poi dì all\'agente: «Invia questa chiave API in modo sicuro, elimina dopo la lettura»',
        "L'agente chiama lo strumento, la cifratura avviene localmente e tu ricevi un link",
      ],
    },
    {
      title: "Una cosa da capire su IA e segreti",
      body: [
        "Quando includi un segreto in un prompt IA, il modello lo legge prima che lo strumento MCP lo cifri. I server del provider IA vedono brevemente il contenuto.",
        "È comunque un miglioramento significativo rispetto all'invio tramite Slack: il segreto non finisce nella cronologia persistente della chat, nell'e-mail o nei log del server. Ma non è lo stesso che dire che l'IA non lo abbia mai visto.",
        "Per una privacy end-to-end completa quando usi un agente IA, usa un modello locale sul tuo computer, come Ollama. In quel caso nulla lascia il computer finché non è già cifrato.",
      ],
    },
    {
      title: "Nessuna installazione: l'app web",
      body: [
        "Se non sei in VS Code, o sei su un computer senza il tuo ambiente abituale, l'app web su privatenote.ai fa la stessa cosa in qualsiasi browser.",
        "Incolla il segreto, scegli una scadenza, fai clic su Crea. Condividi il link. La logica di cifratura gira nel browser: lo stesso AES-256-GCM, la stessa architettura con chiave nel frammento.",
      ],
    },
    {
      title: "Cosa ricordare",
      body: [
        "Il link contiene la chiave di decifratura. Tratta l'URL con la stessa cura del segreto stesso: non pubblicarlo in un canale pubblico.",
        "Quando una nota a lettura unica viene aperta, il link non funziona più. Né tu né il destinatario potete riaprirlo.",
        "Se hai digitato un segreto in un prompt IA, valuta di ruotarlo dopo la condivisione. Il prompt è stato visto. Il link PrivateNote no, ma la credenziale sottostante sì.",
        "Per segreti che devono persistere, usa un vero gestore di segreti. PrivateNote serve alla consegna, non all'archiviazione.",
      ],
    },
  ],
  ctaTitle: "Condividi la tua prima nota privata",
  ctaBody: "Installa l'estensione VS Code o prova l'app web: non serve account per le note a lettura unica.",
  ctaButton: "Prova PrivateNote →",
};
