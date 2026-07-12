import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiIt: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Persona che lavora a una scrivania domestica con un laptop che mostra una visualizzazione di rete neurale e un piccolo server AI locale accanto",
  intro: [
    "**Private AI** significa eseguire un grande modello linguistico su hardware che controlli direttamente—il tuo laptop, il browser o un server in ufficio—così il testo inserito non viene mai inviato a un cloud di terze parti per l'inferenza. È la risposta pratica a una domanda semplice: *posso ottenere un aiuto di alta qualità dall'IA senza consegnare le mie parole al computer di qualcun altro?*",
    "Questa domanda conta sempre di più ogni anno. Gli assistenti cloud sono straordinariamente potenti, ma elaborano i tuoi prompt su infrastrutture remote. Per note, credenziali, bozze legali, informazioni sanitarie o qualsiasi cosa non incolleresti in un chatbot pubblico, l'IA locale e lato browser non è più una curiosità da hobbisti. È un requisito di sicurezza vitale.",
    "Questa guida illustra come si è evoluta l'IA privata, perché i grandi laboratori pubblicano i pesi dei modelli, i principali modi in cui le persone eseguono modelli in locale, i progetti open source e le famiglie di modelli che contano di più, dove si colloca lo stato dell'arte nel 2026—e come [PrivateNote](app:home) si integra con **Write with Private AI**, che funziona interamente nella scheda del browser.",
  ],
  sections: [
    {
      title: "Una breve evoluzione: dai laboratori al tuo laptop",
      paragraphs: [
        "Per anni, i modelli linguistici utili vivevano quasi esclusivamente dentro i giganti tecnologici con cluster GPU massicci. L'addestramento richiedeva milioni di dollari in calcolo, team specializzati e dataset proprietari. Se volevi assistenza IA, usavi un'API o un'app web cloud—e il tuo testo lasciava la macchina.",
        "Tre cambiamenti nel settore hanno trasformato completamente questo quadro:",
      ],
      bullets: [
        "**Leggi di scaling dei transformer** — La ricerca ha dimostrato che modelli ben addestrati su grandi dataset di alta qualità potevano offrire capacità sorprendentemente generali—non solo alla scala di frontiera.",
        "**Rilasci di pesi aperti** — A partire dalla famiglia Llama di Meta, seguita da Mistral, Google Gemma, Alibaba Qwen e altri, parametri scaricabili hanno raggiunto sviluppatori in tutto il mondo.",
        "**Maturazione degli strumenti di inferenza** — Progetti come llama.cpp, Ollama, vLLM, WebLLM e Transformers.js hanno reso pratico eseguire quei pesi su hardware consumer.",
      ],
      callout:
        "Nel 2026, il divario tra «solo cloud» e «gira sul mio dispositivo» si è ridotto drasticamente. I modelli cloud di frontiera restano più grandi e più veloci, ma i modelli aperti piccoli e medi sono molto capaci per bozze, riassunti, riscritture e domande quotidiane—soprattutto per scrittura breve come le note.",
    },
    {
      title: "Perché le aziende pubblicano i pesi dei modelli",
      paragraphs: [
        "Pubblicare pesi non è beneficenza. I laboratori diffondono parametri per ragioni strategiche che modellano l'intero ecosistema.",
      ],
      bullets: [
        "**Leva dell'ecosistema** — Quando gli sviluppatori costruiscono sul tuo modello, la tua architettura diventa uno standard. Fine-tune, strumenti e integrazioni seguono i pesi.",
        "**Credibilità di ricerca** — I pesi aperti invitano all'esame, alla riproducibilità e all'adozione accademica. Quella visibilità rafforza la leadership tecnica.",
        "**Posizionamento normativo e fiducia** — Player europei come Mistral e marchi globali come Meta e Google usano i rilasci aperti per segnalare trasparenza e differenziarsi dalle API completamente chiuse.",
        "**Distillazione e specializzazione** — Modelli più piccoli addestrati da modelli più grandi diffondono le capacità verso il basso. Pubblicare i pesi genitori accelera quel pipeline in tutta la comunità.",
        "**Pressione competitiva** — Una volta che un grande laboratorio rilascia in open source un modello solido, gli altri subiscono pressione per adeguarsi o rischiano di perdere l'attenzione degli sviluppatori.",
      ],
      callout:
        "I pesi aperti non sono sempre «open source» nel senso stretto. Le licenze possono limitare l'uso commerciale, richiedere attribuzione o escludere certi domini. Leggi sempre la scheda del modello prima di un deploy in produzione.",
    },
    {
      title: "Tre modi per distribuire l'IA privata",
      paragraphs: [
        "Non esiste un'architettura migliore in assoluto. La scelta giusta dipende dal tuo hardware, dai requisiti di privacy e dal bisogno di un generalista da 70 miliardi di parametri o di un assistente veloce per note brevi.",
      ],
      beforeFlowSteps: "La maggior parte dei deploy di IA privata rientra in uno di questi schemi:",
      flowDiagramCaption: "Tre schemi di distribuzione a colpo d'occhio",
      flowSteps: [
        {
          step: "Opzione 1",
          title: "Ambienti applicativi locali (Ollama e app desktop)",
          body: "Strumenti come [Ollama](https://ollama.com), LM Studio e GPT4All scaricano i pesi dei modelli e li eseguono nativamente su Mac, Windows o Linux. Ottieni inferenza offline, accelerazione GPU nativa e accesso a modelli più grandi di quanto un browser possa caricare comodamente. Compromessi: spazio su disco significativo (spesso decine di gigabyte per modello), RAM o VRAM dedicata e aggiornamenti manuali.",
        },
        {
          step: "Opzione 2",
          title: "Ambienti sandbox (WebGPU nel browser)",
          body: "I browser moderni espongono **WebGPU**, che consente a JavaScript di eseguire reti neurali sulla GPU senza installare nulla. Progetti come WebLLM, MLC LLM e Transformers.js compilano modelli per il web. Sacrifichi dimensione del modello e velocità pura, ma ottieni una proprietà notevole: **il tuo prompt non lascia mai la scheda del browser per l'inferenza**. Nessun account, nessun round-trip al server, nessun provider che registra la tua bozza.",
        },
        {
          step: "Opzione 3",
          title: "Calcolo dedicato (server domestici o di ufficio)",
          body: "I team con GPU NVIDIA dedicate, un Mac Studio o un piccolo server rack spesso eseguono **vLLM**, **llama.cpp** o Ollama come endpoint interno condiviso. Questo è lo schema per l'IA privata di massima qualità: grandi finestre di contesto, modelli più grandi e più utenti su una LAN. Compromessi: costo hardware, alimentazione, raffreddamento e manutenzione operativa continua.",
        },
      ],
      afterFlowSteps: [
        "Il filo conduttore è lo stesso in tutti e tre i casi: **l'inferenza avviene su infrastruttura che controlli**, non su un cloud multi-tenant dove il tuo testo diventa il carico di elaborazione di qualcun altro.",
      ],
    },
    {
      title: "I progetti open source che contano di più",
      paragraphs: [
        "I modelli sono solo metà della storia. Questi progetti fondamentali hanno trasformato pesi grezzi in software che milioni di persone possono effettivamente eseguire.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Inferenza C/C++ ad alta efficienza; la base per innumerevoli deploy locali CPU e GPU.",
        "**[Ollama](https://ollama.com)** — Un'esperienza CLI e desktop intuitiva per scaricare, aggiornare e chattare con modelli in locale.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Serving ad alto throughput in batch per server GPU condivisi del team e carichi di lavoro su scala API.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — La libreria e l'hub di riferimento per scoprire, scaricare, fine-tunare e condividere modelli.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compila modelli per esecuzione nativa nel browser, senza installazione, via WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Esegue modelli esportati in ONNX direttamente in JavaScript—un altro percorso verso l'inferenza lato browser.",
      ],
    },
    {
      title: "Famiglie di modelli da conoscere",
      paragraphs: [
        "Decine di checkpoint compaiono ogni mese. Quattro famiglie dominano le conversazioni sull'IA privata nel 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 e le linee Llama 4 più recenti fissano il benchmark per i generalisti a pesi aperti: ragionamento solido, ampio supporto di strumenti e un enorme ecosistema di fine-tune.",
        "**Google Gemma** — Le famiglie Gemma 2, Gemma 3 e **Gemma 4** si concentrano sull'efficienza—forte performance per parametro, eccellenti modelli piccoli e varianti ottimizzate per inferenza su dispositivo e ospitata.",
        "**Mistral AI (Europa)** — Mistral, con sede a Parigi, offre modelli compatti e capaci (Mistral, Mixtral, Codestral) con licenze developer-friendly e una narrativa distinta di sovranità dei dati europea.",
        "**Alibaba Qwen** — Le serie Qwen 2.5 e **Qwen 3** eccellono nei compiti multilingue e offrono varianti minuscole (sotto 1 miliardo di parametri) che funzionano eccezionalmente bene su hardware modesto di laptop e browser.",
      ],
      callout:
        "L'IA browser di PrivateNote usa **Gemma 2 2B** e **Qwen3 0.6B** via WebLLM—modelli a pesi aperti compilati per WebGPU, non un checkpoint proprietario chiuso. Varianti **Gemma 4** più grandi compaiono nel percorso Cloud Assist opzionale, non in Write with Private AI oggi.",
    },
    {
      title: "Stato dell'arte nel 2026",
      paragraphs: [
        "La frontiera è divisa. Le API chiuse di OpenAI, Anthropic e Google guidano ancora su capacità pura, uso di strumenti su larga scala e le finestre di contesto più grandi. Ma i pesi aperti sono abbastanza vicini per molti flussi di lavoro reali—e in vantaggio su **privacy, controllo dei costi e personalizzazione**.",
        "Tra i modelli aperti, **Gemma 4**, **Llama 4**, **Qwen 3** e i grandi checkpoint **Mistral** rappresentano la generazione attuale: migliore aderenza alle istruzioni, coding e matematica migliorati e rifiuti più affidabili su prompt sensibili. Varianti distillate più piccole portano una fetta significativa di quella qualità su laptop e browser.",
        "I modelli multimodali (testo + immagine) si espandono sia nei rilasci cloud che aperti, ma per prendere appunti e consegne di segreti, i piccoli modelli solo testo restano il punto ideale: abbastanza veloci da sembrare interattivi, abbastanza piccoli da restare locali.",
      ],
    },
    {
      title: "IA privata in PrivateNote: Write with Private AI",
      paragraphs: [
        "PrivateNote è costruito per note crittografate ed effimere—non per sostituire l'intero stack IA. Eppure, redigere un messaggio sensibile è esattamente dove l'IA lato browser eccelle: ottieni aiuto alla scrittura **prima** della crittografia, senza inviare il testo ai nostri server per l'inferenza.",
        "Apri [PrivateNote](app:home) e scegli **Write with Private AI**. Non c'è un selettore manuale del modello—su desktop supportati con WebGPU, il livello del dispositivo decide quale checkpoint viene eseguito:",
        "Sii onesto sui compromessi. I pesi si scaricano nello storage del browser e l'inferenza gira in locale—ma l'IA browser è **più lenta** di un datacenter cloud e non può eguagliare le **grandi finestre di contesto** dei modelli di classe server. Dipende anche dall'hardware: molti telefoni e laptop più vecchi tornano alla digitazione senza IA o a Cloud Assist opzionale. Ma per redigere una breve nota privata, un messaggio di consegna password o una risposta riservata, è **piuttosto capace**—e le proprietà di privacy sono fondamentalmente diverse dai flussi incolla-in-ChatGPT.",
      ],
      bullets: [
        "**Hardware modesto** — Carica **Qwen3 0.6B** ed esegue l'inferenza in locale via WebGPU.",
        "**Desktop capaci** — Carica **Gemma 2 2B** ed esegue l'inferenza in locale via WebGPU.",
        "**Privato per architettura** — Con Write with Private AI, la bozza viene elaborata nel browser. Non viene inviata ai server PrivateNote per l'inferenza del modello.",
        "**Crittografa dopo la redazione** — Una volta soddisfatto del testo, la nota viene crittografata in locale prima del caricamento—lo stesso modello di ogni altra nota PrivateNote.",
        "**Cloud Assist opzionale** — Se il dispositivo non può eseguire modelli locali, puoi optare per Cloud Assist (Google **Gemma 4 26B** via Cloudflare Workers AI). Quel percorso è più veloce e più capace, ma **non completamente privato**—il prompt lascia il dispositivo in chiaro e devi abilitarlo esplicitamente. Vedi [come funziona PrivateNote](app:how-it-works) per il confronto completo.",
        "**Lo strumento giusto per il compito** — Usa l'IA privata nel browser per bozze sensibili. Usa Ollama o un server GPU domestico quando servono documenti lunghi, contesto enorme o i modelli aperti più grandi.",
      ],
      callout:
        "L'IA privata nel browser non cerca di battere i modelli cloud di frontiera sui benchmark. Cerca di rendere **la redazione privata pratica** per le note che le persone creano già in PrivateNote.",
    },
    {
      title: "Scegliere la tua configurazione di IA privata",
      paragraphs: [
        "Se sei nuovo all'IA privata, inizia in modo semplice: installa Ollama e prova un checkpoint Llama o Gemma di medie dimensioni per la scrittura quotidiana sul laptop.",
        "Se il tuo modello di minaccia richiede che le bozze non lascino mai il dispositivo—anche prima della crittografia—usa strumenti lato browser, incluso Write with Private AI in PrivateNote. Sovranità dei dati e automazione intelligente non si contraddicono più; abbini semplicemente la sensibilità del testo all'architettura che lo esegue.",
        "Se stai mettendo in sicurezza un team, valuta un server GPU condiviso con vLLM e controlli di accesso—e leggi [mettere in sicurezza gli agenti IA come dipendenti](blog:securing-ai-agents-like-employees) per capire come i sistemi agentici cambiano il confine di fiducia. Per sviluppatori che integrano agenti nei flussi di lavoro, vedi [PrivateNote per sviluppatori](blog:privatenote-for-developers) e l'[integrazione Codex MCP](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Prova la redazione privata nel browser",
  closingBody: [
    "Apri PrivateNote, seleziona Write with Private AI e redigi la tua prossima nota sensibile senza inviarla a un modello cloud esterno. Crittografala quando sei pronto—poi condividi un link sicuro monouso.",
  ],
  fileSharingNote:
    "Devi condividere anche file? [Trasferimento file sicuro](app:secure-file-transfer) usa la stessa crittografia lato browser. L'invio richiede un account gratuito; i destinatari aprono i link senza registrarsi.",
  tagline: "Redigi in locale. Crittografa prima. Condividi un link.",
  relatedReading: "Letture correlate",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "Man mano che gli agenti IA acquisiscono strumenti e memoria, la sicurezza deve governare l'intero sistema—non solo il modello.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Condividi segreti da VS Code, Cursor o un agente IA senza incollarli nella cronologia chat.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Crittografa prima del caricamento, condividi un link e lascia scadere la nota—passo dopo passo.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Chi detiene le chiavi e perché la crittografia nel browser differisce dal solo HTTPS.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Strumenti di privacy pratici oltre a migliori abitudini da sole.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Perché le note effimere battono i log di chat permanenti per messaggi di lavoro sensibili.",
    },
  ],
};
