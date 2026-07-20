import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyIt: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Sviluppatore che lavora a una scrivania con un laptop aperto sul codice—dove spesso iniziano i passaggi di chiavi SSH",
  heroCaption:
    "Le chiavi private SSH appartengono a passaggi cifrati e di breve durata—non a Slack, e-mail o cronologia git. Immagine: scrivania di programmazione via Pixabay.",
  intro: [
    "Un collega deve accedere al server di staging. Un collaboratore ha bisogno di una chiave di deploy per il weekend. Il laptop di qualcuno si è rotto e l'unico accesso rimasto è la chiave privata sul tuo computer.",
    "Il percorso più rapido è di solito la stessa cattiva abitudine: incollare il blocco PEM in Slack, inviarlo per e-mail «solo questa volta», o inserirlo in un ticket. Quel messaggio si sincronizza sui telefoni, finisce negli indici di ricerca, e può restare nei backup molto dopo la fine dell'emergenza.",
    "Le chiavi private SSH sono segreti con un ampio raggio d'impatto. Una sola chiave trapelata può significare accesso shell completo. Questa guida spiega quando dovresti condividere una chiave privata, cosa non incollare mai in chat, e come consegnarne una con un link cifrato ad autodistruzione dopo la lettura—più le estensioni per sviluppatori di PrivateNote che rendono il percorso sicuro anche quello veloce.",
  ],
  sections: [
    {
      title: "Chiave pubblica vs chiave privata (30 secondi di chiarezza)",
      paragraphs: [
        "Una coppia di chiavi SSH ha due metà. La chiave **pubblica** è pensata per essere condivisa: la aggiungi a `~/.ssh/authorized_keys`, a una console cloud, o a una deploy key di GitHub. Inviare la chiave pubblica di qualcuno in chat è normale.",
        "La chiave **privata** (`id_ed25519`, `id_rsa`, un file `.pem`) è il segreto. Chiunque la possieda può autenticarsi come quell'identità finché non revochi l'accesso. Trattala come una password che apre un server—perché è esattamente questo che è.",
        "Se il tuo istinto dice «dobbiamo condividere la chiave privata», fermati. In molti casi dovresti invece condividere la chiave **pubblica**: il destinatario genera la propria coppia in locale e tu autorizzi la sua chiave pubblica sull'host.",
      ],
      calloutTitle: "Regola pratica",
      callout:
        "Preferisci aggiungere la loro chiave pubblica piuttosto che inviare la tua chiave privata. I passaggi di chiave privata sono per casi di recupero di emergenza (break-glass) e casi legacy—non per l'onboarding predefinito.",
    },
    {
      title: "Preferisci non condividere la chiave privata",
      paragraphs: [
        "Prima di cifrare e inviare qualsiasi cosa, chiediti se la chiave privata deve davvero essere spostata:",
      ],
      subsections: [
        {
          title: "Aggiungi la loro chiave pubblica",
          paragraphs: [
            "Falli eseguire `ssh-keygen`, farti inviare il file `.pub` (sicuro in chat), e aggiungerlo ad `authorized_keys` o alle impostazioni SSH del provider. Loro conservano la metà privata; tu non la vedi mai.",
          ],
        },
        {
          title: "Usa una chiave di deploy dedicata",
          paragraphs: [
            "Per la CI o un singolo repository, crea una chiave di deploy dedicata con l'ambito minimo. Evita di riutilizzare una chiave personale del laptop su più sistemi.",
          ],
        },
        {
          title: "Preferisci l'accesso a breve termine",
          paragraphs: [
            "Dove il tuo stack lo supporta—certificati SSH, host bastione (jump host), Tailscale SSH, ruoli IAM cloud—preferisci un accesso limitato nel tempo rispetto a copiare chiavi private a lunga durata.",
          ],
        },
        {
          title: "Quando il passaggio di una chiave privata è giustificato",
          paragraphs: [
            "Recupero di emergenza (break-glass), un host legacy che non può registrare rapidamente nuove chiavi, o un'emergenza in cui esiste solo una chiave protetta da passphrase. Anche in quel caso: cifra il trasferimento, mantieni una scadenza breve, confermane la ricezione, poi ruota o revoca.",
          ],
        },
      ],
    },
    {
      title: "Dove muoiono le chiavi SSH nella realtà",
      paragraphs: [
        "Gli stessi canali che fanno trapelare [chiavi API](blog:how-to-share-api-key-securely) e [password](blog:how-to-share-a-password-securely) fanno trapelare anche materiale SSH—spesso con conseguenze peggiori.",
      ],
      comparisonTable: {
        headers: ["Canale", "Perché fallisce", "Cosa ottengono gli attaccanti"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Cronologia ricercabile, sincronizzazione dispositivi, esportazioni del workspace",
            "Chiave privata completa in chiaro per sempre",
          ],
          [
            "E-mail",
            "Caselle di posta, archivi, sincronizzazione mobile, inoltri",
            "Una copia duratura che non puoi eliminare in modo affidabile",
          ],
          [
            "Ticket e documenti",
            "Jira, Notion, Confluence, issue di GitHub",
            "Chiavi in backup, ricerca IA e audit trail",
          ],
          [
            "Repository Git",
            "La cronologia è persistente; «elimina e fai push» non elimina nulla",
            "Gli scanner trovano PEM in pochi minuti nei repo pubblici",
          ],
        ],
        after: [
          "Se il segreto è già apparso in chat o su git, considéralo compromesso. Revoca la chiave, genera una nuova coppia, e consegna la sostituzione tramite un [link cifrato monouso](blog:one-time-secret-links)—non un altro copia-incolla. Per fughe di pipeline e `.env`, vedi [segreti in CI/CD e GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Un passaggio più sicuro delle chiavi private SSH",
      paragraphs: [
        "Quando devi spostare una chiave privata, tratta il trasferimento come consegna temporanea—non come archiviazione. Si applica lo stesso schema usato per password e chiavi API: cifra in locale, invia un link, distruggi dopo la lettura, poi ruota.",
        "PrivateNote cifra nel browser (o nel tuo editor/CLI) con AES-256-GCM prima che qualcosa raggiunga la rete. La chiave di decifratura vive solo nel fragment dell'URL—la parte `#…` che i browser non inviano mai ai server. Dettagli: [cosa significa qui la cifratura end-to-end](blog:what-is-end-to-end-encryption) e [come creare una nota privata](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Un flusso di lavoro pratico per il break-glass:",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Delimita e proteggi la chiave",
          body: "Preferisci una chiave dedicata per questo host o compito. Usa una passphrase sulla chiave privata. Evita di spedire la tua chiave d'identità personale quotidiana se basta una chiave più ristretta.",
        },
        {
          step: "Passo 2",
          title: "Cifra in locale",
          body: "Incolla solo il materiale della chiave (non un romanzo di hostname e username) in PrivateNote tramite la [web app](app:home), l'[estensione VS Code / Cursor](app:developers/vscode), la [CLI](app:developers/cli), o l'[estensione Chrome](chrome:extension).",
        },
        {
          step: "Passo 3",
          title: "Invia il link—non il PEM",
          body: "Condividi il link cifrato su Slack o via e-mail. Attiva opzionalmente l'incapsulamento con passphrase e invia quella passphrase su un canale separato ([suggerimento sui canali separati](blog:how-to-share-a-password-securely)). Preferisci una scadenza di 15 minuti o 1 ora e l'autodistruzione dopo la lettura.",
        },
        {
          step: "Passo 4",
          title: "Conferma, poi ruota",
          body: "Il destinatario installa la chiave con i permessi corretti (`chmod 600`), conferma l'accesso, poi revochi o ruoti la vecchia chiave. Considera qualsiasi chiave finita in un prompt IA come vista—ruotala.",
        },
      ],
      midCta: {
        body: "Devi consegnare una chiave SSH ora? Crea una nota cifrata monouso e invia il link invece della chiave privata.",
        button: "Crea una nota privata",
      },
    },
    {
      title: "Estensioni per sviluppatori: condividi chiavi SSH da dove lavori",
      paragraphs: [
        "I passaggi falliscono quando lo strumento sicuro è a tre clic di distanza in più rispetto a Slack. Le integrazioni PrivateNote mantengono la cifratura nel tuo editor, browser, terminale o flusso di lavoro dell'agente. Tour completo: [PrivateNote per sviluppatori](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["La tua situazione", "Percorso migliore"],
        rows: [
          [
            "La chiave è già aperta nell'editor",
            "Estensione IDE VS Code / Cursor / Codex — seleziona → condividi come PrivateNote",
          ],
          [
            "La chiave è su una pagina web o un ticket",
            "Estensione Chrome — evidenzia → Crea PrivateNote",
          ],
          [
            "Sei in un terminale",
            "CLI — incanala il file così il PEM non finisce mai nella cronologia della shell",
          ],
          [
            "Vuoi che un agente produca il link",
            "Server MCP — poi ruota; preferisci l'estensione dell'editor per le chiavi private",
          ],
          [
            "Il destinatario non è tecnico",
            "Link della web app su privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor e Codex IDE",
          paragraphs: [
            "Installa dal marketplace (`PrivateNote.privatenote-vscode`), seleziona il blocco della chiave, e usa **Share as PrivateNote**—oppure apri il composer nella sidebar. La cifratura viene eseguita nel processo host dell'editor, quindi il testo in chiaro non deve mai entrare in una chat IA. Configurazione: [estensione VS Code / Cursor](app:developers/vscode).",
          ],
        },
        {
          title: "Estensione Chrome",
          paragraphs: [
            "Quando una chiave appare in un ticket, una pagina di documentazione o una console di amministrazione, evidenziala e crea una nota cifrata senza copiarla prima in Slack. Installazione: [estensione Chrome](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Incanala da un file così il segreto non è un argomento di `echo` nella cronologia della shell: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Documentazione: [CLI di PrivateNote](app:developers/cli).",
          ],
        },
        {
          title: "MCP per Cursor, Claude e Codex",
          paragraphs: [
            "Gli agenti possono chiamare `create_private_note` dopo aver installato [privatenote-mcp](app:developers/mcp). Utile per l'orchestrazione—ma se incolli la chiave privata nel prompt dell'agente, il fornitore del modello potrebbe vederla prima della cifratura. Per le chiavi private SSH, preferisci l'estensione dell'editor o di Chrome. Configurazione specifica per Codex: [PrivateNote con Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Un'avvertenza onesta",
      callout:
        "MCP cifra dopo che l'agente ha letto il prompt. L'esposizione persistente in chat/e-mail scompare; la visibilità del fornitore IA no. Per le chiavi private, usa l'estensione VS Code o Chrome così il testo in chiaro non lascia mai il tuo computer prima di essere già testo cifrato.",
    },
    {
      title: "Buone pratiche e insidie",
      subsections: [
        {
          title: "Non fare mai commit delle chiavi private",
          paragraphs: [
            "Tieni `id_*` e `*.pem` fuori dai repository. Aggiungili al `.gitignore`. Se una chiave è finita nella cronologia git, ruotala—riscrivere la cronologia non basta più una volta che il repository è stato clonato o scansionato.",
          ],
        },
        {
          title: "Correggi i permessi dei file",
          paragraphs: [
            "Le chiavi private dovrebbero essere `chmod 600` (o `400`). SSH rifiuterà file di chiave troppo permissivi su molti sistemi—e chiavi leggibili da chiunque su macchine condivise sono un autogol.",
          ],
        },
        {
          title: "Non inserire contesto nella nota",
          paragraphs: [
            "Metti solo il materiale della chiave nella nota cifrata. Invia hostname, username e porta in un messaggio separato. Se il link trapela, l'attaccante non dovrebbe ottenere anche una mappa etichettata di ciò che sblocca.",
          ],
        },
        {
          title: "Passphrase e canali separati",
          paragraphs: [
            "Proteggi con passphrase il file della chiave stesso, e opzionalmente incapsula la PrivateNote con una passphrase separata inviata su un altro canale. Stessa raccomandazione della [condivisione sicura delle password](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Il forwarding dell'agente non è una strategia di condivisione",
          paragraphs: [
            "Il forwarding dell'agente SSH può ridurre le copie di chiave sugli host remoti, ma non sostituisce una distribuzione attenta delle chiavi—ed estende la fiducia a ogni hop attraverso cui esegui il forwarding. Usalo deliberatamente, non come scusa per inviare PEM via e-mail.",
          ],
        },
      ],
    },
    {
      title: "Domande frequenti",
      faqs: [
        {
          question: "È sicuro inviare una chiave pubblica su Slack?",
          answer:
            "Sì. Le chiavi pubbliche sono pensate per essere distribuite. Evita comunque di scaricare interi directory `~/.ssh`—le persone includono per errore file privati.",
        },
        {
          question: "Posso mettere una chiave privata SSH in un password manager?",
          answer:
            "Per l'archiviazione a lungo termine delle chiavi che conservi, un password manager o un agente basato su hardware è appropriato. Usa un link cifrato monouso per il momento di consegna da persona a persona—poi il destinatario archivia correttamente la chiave. PrivateNote è consegna, non un vault di segreti.",
        },
        {
          question: "Dovrei condividere la chiave e la passphrase insieme?",
          answer:
            "No. Questo ricrea un singolo punto di fallimento. Invia il link cifrato su un canale e qualsiasi passphrase su un altro—oppure fai impostare al destinatario la propria passphrase dopo l'installazione e ruotala.",
        },
        {
          question: "Quale scadenza dovrei usare?",
          answer:
            "Per il coordinamento in tempo reale, 15 minuti con autodistruzione dopo la lettura. Per passaggi asincroni a collaboratori esterni, massimo 1 ora o 1 giorno. Preferisci una durata più breve ogni volta che il destinatario è raggiungibile.",
        },
        {
          question: "PrivateNote è un sostituto di Vault o dei gestori di segreti cloud?",
          answer:
            "No. Usa Vault, AWS Secrets Manager e strumenti simili per l'archiviazione e l'iniezione machine-to-machine. Usa PrivateNote per il momento da persona a persona quando una chiave deve attraversare chat o e-mail senza diventare un archivio permanente. Stessa distinzione della [guida alle chiavi API](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Considerazioni finali",
      paragraphs: [
        "La maggior parte dei problemi di «condivisione» SSH sono in realtà problemi di iscrizione: aggiungi una chiave pubblica, usa una chiave di deploy, o emetti un accesso a breve termine. Quando una chiave privata deve essere spostata, non lasciarla nella [cronologia della chat](blog:secrets-never-send-in-chat) o nell'[e-mail](blog:why-email-is-worst-for-secrets).",
        "Cifra in locale, invia un link ad autodistruzione, conferma l'installazione, poi ruota. Collega gli [strumenti per sviluppatori](app:developers) che già usi così che il percorso sicuro sia anche il percorso di minore resistenza.",
      ],
    },
  ],
  ctaTitle: "Condividi il link—non la chiave privata",
  ctaBody:
    "Crea una PrivateNote cifrata nel browser con scadenza breve e autodistruzione dopo la lettura. Oppure cifra dall'estensione VS Code, dalla CLI, o dall'estensione Chrome così il PEM non finisce mai in chiaro su Slack.",
  ctaButton: "Crea una nota privata",
};
