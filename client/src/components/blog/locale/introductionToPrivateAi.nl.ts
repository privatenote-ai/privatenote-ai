import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiNl: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Persoon die aan een thuisbureau werkt met een laptop waarop een neurale-netwerkvisualisatie staat en een compacte lokale AI-server ernaast",
  intro: [
    "**Private AI** betekent dat je een groot taalmodel draait op hardware die je rechtstreeks beheert—je laptop, je browser of een server op kantoor—zodat je invoertekst nooit naar een cloud van een derde partij wordt gestuurd voor inferentie. Het is het praktische antwoord op een eenvoudige vraag: *kan ik hoogwaardige hulp van AI krijgen zonder mijn woorden af te geven aan iemand anders zijn computer?*",
    "Die vraag wordt elk jaar belangrijker. Cloud-assistenten zijn opmerkelijk krachtig, maar ze verwerken je prompts op externe infrastructuur. Voor notities, inloggegevens, juridische concepten, gezondheidsinformatie of alles wat je niet in een publieke chatbot zou plakken, is lokale en browser-side AI geen hobbyproject meer. Het is een essentiële beveiligingseis.",
    "Deze gids doorloopt hoe private AI zich ontwikkelde, waarom grote labs modelgewichten publiceren, de belangrijkste manieren waarop mensen modellen lokaal draaien, de open-sourceprojecten en modelfamilies die het meest tellen, waar de state of the art in 2026 staat—en hoe [PrivateNote](app:home) past met **Write with Private AI**, dat volledig in je browsertabblad draait.",
  ],
  sections: [
    {
      title: "Een korte evolutie: van labs naar je laptop",
      paragraphs: [
        "Jarenlang leefden nuttige taalmodellen bijna uitsluitend binnen techgiganten met enorme GPU-clusters. Trainen vereiste miljoenen dollars aan rekenkracht, gespecialiseerde teams en propriëtaire datasets. Wilde je AI-assistentie, dan gebruikte je een API of een cloudwebapp—en je tekst verliet je machine.",
        "Drie verschuivingen in de sector veranderden dat beeld volledig:",
      ],
      bullets: [
        "**Transformer-schaalwetten** — Onderzoek toonde aan dat goed getrainde modellen op grote, hoogwaardige datasets verrassend algemene capaciteiten konden leveren—niet alleen op frontier-schaal.",
        "**Open-weight releases** — Beginnend met Meta's Llama-familie en gevolgd door Mistral, Google Gemma, Alibaba Qwen en anderen, bereikten downloadbare parameters ontwikkelaars wereldwijd.",
        "**Volwassen inferentietooling** — Projecten als llama.cpp, Ollama, vLLM, WebLLM en Transformers.js maakten het praktisch om die gewichten op consumentenhardware te draaien.",
      ],
      callout:
        "Tegen 2026 is de kloof tussen «alleen in de cloud» en «draait op mijn apparaat» dramatisch kleiner geworden. Frontier-cloudmodellen zijn nog steeds groter en sneller, maar kleine en middelgrote open modellen zijn zeer capabel bij het opstellen, samenvatten, herschrijven en beantwoorden van alledaagse vragen—vooral voor kort schrijfwerk zoals notities.",
    },
    {
      title: "Waarom bedrijven modelgewichten publiceren",
      paragraphs: [
        "Gewichten vrijgeven is geen liefdadigheid. Labs publiceren parameters om strategische redenen die het hele ecosysteem vormgeven.",
      ],
      bullets: [
        "**Ecosysteemhefboom** — Wanneer ontwikkelaars op jouw model bouwen, wordt jouw architectuur een standaard. Fine-tunes, tools en integraties volgen de gewichten.",
        "**Onderzoeksgeloofwaardigheid** — Open gewichten nodigen uit tot controle, reproduceerbaarheid en academische adoptie. Die zichtbaarheid versterkt technisch leiderschap.",
        "**Regelgevende en vertrouwenspositionering** — Europese spelers als Mistral en wereldwijde merken als Meta en Google gebruiken open releases om transparantie te signaleren en zich te onderscheiden van volledig gesloten API's.",
        "**Distillatie en specialisatie** — Kleinere modellen getraind van grotere verspreiden capaciteit naar beneden. Het publiceren van oudergewichten versnelt die pijplijn in de community.",
        "**Concurrentiedruk** — Zodra één groot lab een sterk model open releaset, staan anderen onder druk om te volgen of risico te lopen ontwikkelaarsaandacht te verliezen.",
      ],
      callout:
        "Open gewichten zijn niet altijd «open source» in strikte zin. Licenties kunnen commercieel gebruik beperken, attributie vereisen of bepaalde domeinen uitsluiten. Lees altijd de modelkaart voordat je in productie deployt.",
    },
    {
      title: "Drie manieren om private AI te deployen",
      paragraphs: [
        "Er is geen enkele beste architectuur. De juiste keuze hangt af van je hardware, privacy-eisen en of je een 70-miljard-parameter generalist nodig hebt of een snelle assistent voor korte notities.",
      ],
      beforeFlowSteps: "De meeste private-AI-deployments vallen in één van deze patronen:",
      flowDiagramCaption: "Drie deploymentpatronen in één oogopslag",
      flowSteps: [
        {
          step: "Optie 1",
          title: "Lokale applicatieomgevingen (Ollama en desktop-apps)",
          body: "Tools als [Ollama](https://ollama.com), LM Studio en GPT4All downloaden modelgewichten en draaien ze native op je Mac, Windows- of Linux-machine. Je krijgt offline inferentie, native GPU-acceleratie en toegang tot grotere modellen dan een browser comfortabel kan laden. Afwegingen: aanzienlijke schijfruimte (vaak tientallen gigabytes per model), dedicated RAM of VRAM, en handmatige updates.",
        },
        {
          step: "Optie 2",
          title: "Sandboxomgevingen (in-browser WebGPU)",
          body: "Moderne browsers bieden **WebGPU**, waarmee JavaScript neurale netwerken op je GPU kan draaien zonder iets te installeren. Projecten als WebLLM, MLC LLM en Transformers.js compileren modellen voor het web. Je offert modelgrootte en rauwe snelheid op, maar wint een opmerkelijke eigenschap: **je prompt verlaat het browsertabblad nooit voor inferentie**. Geen account, geen server-roundtrip, geen provider die je concept logt.",
        },
        {
          step: "Optie 3",
          title: "Dedicated compute (thuis- of kantoorservers)",
          body: "Teams met dedicated NVIDIA GPU's, een Mac Studio of een kleine rackserver draaien vaak **vLLM**, **llama.cpp** of Ollama als gedeeld intern endpoint. Dit is het patroon voor private AI van maximale kwaliteit: grote contextvensters, grotere modellen en meerdere gebruikers op een LAN. Afwegingen: hardwarekosten, stroom, koeling en doorlopend operationeel onderhoud.",
        },
      ],
      afterFlowSteps: [
        "De rode draad is in alle drie de gevallen hetzelfde: **inferentie gebeurt op infrastructuur die je beheert**, niet op een multi-tenant cloud waar je tekst iemand anders zijn verwerkingslast wordt.",
      ],
    },
    {
      title: "Open-sourceprojecten die het meest tellen",
      paragraphs: [
        "Modellen zijn maar de helft van het verhaal. Deze fundamentele projecten maakten van ruwe gewichten software die miljoenen mensen daadwerkelijk kunnen draaien.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Zeer efficiënte C/C++-inferentie; de basis voor talloze lokale CPU- en GPU-deployments.",
        "**[Ollama](https://ollama.com)** — Een gebruiksvriendelijke CLI en desktop-ervaring voor het ophalen, bijwerken en lokaal chatten met modellen.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — High-throughput batched serving voor gedeelde team-GPU-servers en API-schaal workloads.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — De de facto bibliotheek en hub voor het ontdekken, downloaden, fine-tunen en delen van modellen.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compileert modellen voor zero-install, browser-native uitvoering via WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Draait ONNX-geëxporteerde modellen direct in JavaScript—een ander pad naar browser-side inferentie.",
      ],
    },
    {
      title: "Modelfamilies die je moet kennen",
      paragraphs: [
        "Elke maand verschijnen tientallen checkpoints. Vier families domineren private-AI-gesprekken in 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 en de nieuwere Llama 4-lijnen zetten de benchmark voor open-weight generalisten: sterk redeneren, brede tooling-ondersteuning en een enorm fine-tune-ecosysteem.",
        "**Google Gemma** — De Gemma 2-, Gemma 3- en **Gemma 4**-families richten zich op efficiëntie—sterke prestaties per parameter, uitstekende kleine modellen en varianten afgestemd op on-device en gehoste inferentie.",
        "**Mistral AI (Europa)** — In Parijs gevestigde Mistral levert compacte, capabele modellen (Mistral, Mixtral, Codestral) met ontwikkelaarvriendelijke licenties en een uitgesproken Europees datasoevereiniteitsverhaal.",
        "**Alibaba Qwen** — De Qwen 2.5- en **Qwen 3**-series blinken uit in meertalige taken en leveren kleine varianten (sub‑1B parameters) die uitzonderlijk goed draaien op bescheiden laptop- en browserhardware.",
      ],
      callout:
        "PrivateNote's browser-AI gebruikt **Gemma 2 2B** en **Qwen3 0.6B** via WebLLM—open-weight modellen gecompileerd voor WebGPU, geen propriëtair gesloten checkpoint. Grotere **Gemma 4**-varianten verschijnen in het optionele Cloud Assist-pad, niet in Write with Private AI vandaag.",
    },
    {
      title: "State of the art in 2026",
      paragraphs: [
        "De frontier is gesplitst. Gesloten API's van OpenAI, Anthropic en Google leiden nog steeds op rauwe capaciteit, toolgebruik op schaal en de grootste contextvensters. Maar open gewichten zijn dichtbij genoeg voor veel echte workflows—en voorop op **privacy, kostenbeheersing en maatwerk**.",
        "Onder open modellen vertegenwoordigen **Gemma 4**, **Llama 4**, **Qwen 3** en grote **Mistral**-checkpoints de huidige generatie: betere instructie-opvolging, verbeterde code en wiskunde, en betrouwbaardere weigeringen op gevoelige prompts. Kleinere gedistilleerde varianten brengen een betekenisvol deel van die kwaliteit naar laptops en browsers.",
        "Multimodale modellen (tekst + beeld) breiden uit in zowel cloud- als open releases, maar voor notities maken en geheime overdrachten blijven tekst-only kleine modellen de sweet spot: snel genoeg om interactief te voelen, klein genoeg om lokaal te blijven.",
      ],
    },
    {
      title: "Private AI in PrivateNote: Write with Private AI",
      paragraphs: [
        "PrivateNote is gebouwd voor versleutelde, efemere notities—niet om je hele AI-stack te vervangen. Toch is het opstellen van een gevoelig bericht precies waar browser-side AI schittert: je krijgt schrijfhulp **vóór** versleuteling, zonder je tekst naar onze servers te sturen voor inferentie.",
        "Open [PrivateNote](app:home) en kies **Write with Private AI**. Er is geen handmatige modelkiezer—op ondersteunde desktops met WebGPU bepaalt je apparaatniveau welk checkpoint draait:",
        "Wees eerlijk over de afwegingen. Gewichten worden gedownload naar browseropslag en inferentie draait lokaal—maar browser-AI is **langzamer** dan een clouddatacenter en kan de **grote contextvensters** van serverklasse modellen niet evenaren. Het is ook hardware-afhankelijk: veel telefoons en oudere laptops vallen terug op typen zonder AI of op optionele Cloud Assist. Maar voor het opstellen van een korte privénotitie, een wachtwoordoverdrachtsbericht of een vertrouwelijk antwoord is het **zeer capabel**—en de privacy-eigenschappen zijn fundamenteel anders dan plak-in-ChatGPT-workflows.",
      ],
      bullets: [
        "**Bescheiden hardware** — Laadt **Qwen3 0.6B** en draait inferentie lokaal via WebGPU.",
        "**Capabele desktops** — Laadt **Gemma 2 2B** en draait inferentie lokaal via WebGPU.",
        "**Privé door architectuur** — Met Write with Private AI wordt je concept in de browser verwerkt. Het wordt niet naar PrivateNote-servers gestuurd voor modelinferentie.",
        "**Versleutel na het opstellen** — Zodra je tevreden bent met de tekst, wordt de notitie lokaal versleuteld vóór upload—hetzelfde model als elke andere PrivateNote.",
        "**Optionele Cloud Assist** — Als je apparaat geen lokale modellen kan draaien, kun je kiezen voor Cloud Assist (Google **Gemma 4 26B** via Cloudflare Workers AI). Dat pad is sneller en capabeler, maar **niet volledig privé**—je prompt verlaat het apparaat in platte tekst en je moet het expliciet inschakelen. Zie [hoe PrivateNote werkt](app:how-it-works) voor de volledige vergelijking.",
        "**Het juiste hulpmiddel voor de taak** — Gebruik browser Private AI voor gevoelige concepten. Gebruik Ollama of een thuis-GPU-server wanneer je lange documenten, enorme context of de grootste open modellen nodig hebt.",
      ],
      callout:
        "Private AI in de browser probeert frontier-cloudmodellen niet te verslaan op benchmarks. Het probeert **privé opstellen praktisch** te maken voor de notities die mensen al in PrivateNote maken.",
    },
    {
      title: "Je private-AI-setup kiezen",
      paragraphs: [
        "Ben je nieuw met private AI, begin dan eenvoudig: installeer Ollama en probeer een middelgroot Llama- of Gemma-checkpoint voor alledaags schrijven op je laptop.",
        "Als je dreigingsmodel vereist dat concepten het apparaat nooit verlaten—zelfs vóór versleuteling—gebruik dan browser-side tools, inclusief Write with Private AI in PrivateNote. Datasoevereiniteit en intelligente automatisering spreken elkaar niet langer tegen; je stemt gewoon de gevoeligheid van de tekst af op de architectuur die het draait.",
        "Beveilig je een team, evalueer dan een gedeelde GPU-server met vLLM en toegangscontroles—en lees [AI-agenten beveiligen als medewerkers](blog:securing-ai-agents-like-employees) voor hoe agentische systemen de vertrouwensgrens veranderen. Voor ontwikkelaars die agenten in workflows integreren, zie [PrivateNote voor ontwikkelaars](blog:privatenote-for-developers) en de [Codex MCP-integratie](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Probeer privé opstellen in je browser",
  closingBody: [
    "Open PrivateNote, selecteer Write with Private AI en stel je volgende gevoelige notitie op zonder die naar een extern cloudmodel te sturen. Versleutel wanneer je klaar bent—deel dan een beveiligde, eenmalige link.",
  ],
  fileSharingNote:
    "Moet je ook bestanden delen? [Veilige bestandsoverdracht](app:secure-file-transfer) gebruikt dezelfde browser-side versleuteling. Verzenden vereist een gratis account; ontvangers kunnen links openen zonder zich aan te melden.",
  tagline: "Lokaal opstellen. Eerst versleutelen. Deel een link.",
  relatedReading: "Gerelateerde artikelen",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "Naarmate AI-agenten tools en geheugen krijgen, moet beveiliging het hele systeem besturen—niet alleen het model.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Deel geheimen vanuit VS Code, Cursor of een AI-agent zonder te plakken in chatgeschiedenis.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Versleutel vóór upload, deel een link en laat de notitie verlopen—stap voor stap.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Wie houdt de sleutels, en waarom browserversleuteling anders is dan alleen HTTPS.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Stel een praktische privacystack voor 2026 samen per taak—niet op hype.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Waarom efemere notities permanente chatlogs verslaan voor gevoelige werkplekberichten.",
    },
  ],
};
