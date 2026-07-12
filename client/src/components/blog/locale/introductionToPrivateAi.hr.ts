import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiHr: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Osoba koja radi za kućnim stolom s prijenosnim računalom na kojem je prikazana vizualizacija neuronske mreže i kompaktni lokalni AI poslužitelj pored njega",
  intro: [
    "**Private AI** znači pokretanje velikog jezičnog modela na hardveru koji izravno kontrolirate—vašem prijenosnom računalu, pregledniku ili poslužitelju u uredu—tako da vaš ulazni tekst nikad ne bude poslan u oblak treće strane na inferenciju. To je praktičan odgovor na jednostavno pitanje: *mogu li dobiti visokokvalitetnu pomoć od AI-ja bez predaje svojih riječi tuđem računalu?*",
    "To pitanje postaje važnije svake godine. Oblak asistenti izuzetno su moćni, ali vaše upite obrađuju na udaljenoj infrastrukturi. Za bilješke, vjerodajnice, pravne nacrte, zdravstvene informacije ili bilo što što ne biste zalijepili u javni chatbot, lokalni AI i AI u pregledniku više nisu hobistička znatiželja. To je vitalan sigurnosni zahtjev.",
    "Ovaj vodič prolazi kroz to kako se private AI razvijao, zašto veliki laboratoriji objavljuju otvorene težine (otvorene koeficiente) modela, glavne načine na koje ljudi pokreću modele lokalno, open-source projekte i obitelji modela koje su najvažnije, gdje stanje tehnike stoji u 2026.—i kako se [PrivateNote](app:home) uklapa s **Write with Private AI**, koji radi u potpunosti unutar kartice vašeg preglednika.",
  ],
  sections: [
    {
      title: "Kratka evolucija: od laboratorija do vašeg prijenosnog računala",
      paragraphs: [
        "Godinama su korisni jezični modeli živjeli gotovo isključivo unutar tehnoloških divova s masivnim GPU klasterima. Treniranje je zahtijevalo milijune dolara računalne snage, specijalizirane timove i vlasničke skupove podataka. Ako ste željeli AI pomoć, koristili ste API ili web aplikaciju u oblaku—i vaš tekst je napuštao vaš uređaj.",
        "Tri industrijska pomaka potpuno su promijenila tu sliku:",
      ],
      bullets: [
        "**Zakoni skaliranja transformera** — Istraživanja su pokazala da dobro trenirani modeli na velikim, visokokvalitetnim skupovima podataka mogu pružiti iznenađujuće opće sposobnosti—ne samo na granici skale.",
        "**Objave modela s otvorenim težinama (otvorenim koeficientima)** — Počevši s Metaovom obitelji Llama, a zatim Mistralom, Google Gemma, Alibaba Qwen i drugima, preuzimljivi parametri stigli su do programera diljem svijeta.",
        "**Zrelost alata za inferenciju** — Projekti poput llama.cpp, Ollama, vLLM, WebLLM i Transformers.js učinili su praktičnim pokretanje tih otvorenih težina (otvorenih koeficienta) na potrošačkom hardveru.",
      ],
      callout:
        "Do 2026. razmak između „samo u oblaku“ i „radi na mom uređaju“ dramatično se suzio. Granični modeli u oblaku i dalje su veći i brži, ali mali i srednji open modeli vrlo su sposobni za nacrte, sažetke, prepisivanje i odgovaranje na svakodnevna pitanja—posebno za kratke tekstove poput bilješki.",
    },
    {
      title: "Zašto tvrtke objavljuju otvorene težine (otvorene koeficiente) modela",
      paragraphs: [
        "Objavljivanje otvorenih težina (otvorenih koeficienta) nije dobrotvornost. Laboratoriji objavljuju parametre iz strateških razloga koji oblikuju cijeli ekosustav.",
      ],
      bullets: [
        "**Poluga ekosustava** — Kada programeri grade na vašem modelu, vaša arhitektura postaje zadana. Fine-tuneovi, alati i integracije slijede otvorene težine (otvorene koeficiente).",
        "**Istraživačka vjerodostojnost** — Otvorene težine (otvoreni koeficienti) pozivaju na provjeru, reproduktivnost i akademsku primjenu. Ta vidljivost jača tehničko vodstvo.",
        "**Regulatorno i povjerenjsko pozicioniranje** — Europski igrači poput Mistrala te globalni brendovi poput Metae i Googlea koriste open objave za signaliziranje transparentnosti i razlikovanje od potpuno zatvorenih API-ja.",
        "**Destilacija i specijalizacija** — Manji modeli trenirani iz većih šire sposobnosti prema dolje. Objavljivanje roditeljskih otvorenih težina (otvorenih koeficienta) ubrzava taj pipeline u cijeloj zajednici.",
        "**Konkurentski pritisak** — Kad jedan veliki laboratorij open objavi snažan model, drugi su pod pritiskom da usklade ili riskiraju gubitak pažnje programera.",
      ],
      callout:
        "Otvorene težine (otvoreni koeficienti) nisu uvijek „open source“ u strogom smislu. Licence mogu ograničiti komercijalnu upotrebu, zahtijevati atribuciju ili isključiti određene domene. Uvijek pročitajte model card prije implementacije u produkciji.",
    },
    {
      title: "Tri načina implementacije private AI-ja",
      paragraphs: [
        "Ne postoji jedna najbolja arhitektura. Pravi izbor ovisi o vašem hardveru, zahtjevima privatnosti i tome trebate li generalista od 70 milijardi parametara ili brzog asistenta za kratke bilješke.",
      ],
      beforeFlowSteps: "Većina private-AI implementacija pada u jedan od ovih obrazaca:",
      flowDiagramCaption: "Tri obrasca implementacije na prvi pogled",
      flowSteps: [
        {
          step: "Opcija 1",
          title: "Lokalna aplikacijska okruženja (Ollama i desktop aplikacije)",
          body: "Alati poput [Ollama](https://ollama.com), LM Studio i GPT4All preuzimaju otvorene težine (otvorene koeficiente) modela i pokreću ih nativno na vašem Macu, Windowsu ili Linuxu. Dobivate offline inferenciju, nativno GPU ubrzanje i pristup većim modelima nego što preglednik može udobno učitati. Kompromisi: značajan prostor na disku (često desetke gigabajta po modelu), namjenski RAM ili VRAM i ručna ažuriranja.",
        },
        {
          step: "Opcija 2",
          title: "Sandbox okruženja (WebGPU u pregledniku)",
          body: "Moderni preglednici izlažu **WebGPU**, koji omogućuje JavaScriptu da pokreće neuronske mreže na vašem GPU-u bez instalacije bilo čega. Projekti poput WebLLM, MLC LLM i Transformers.js kompiliraju modele za web. Žrtvujete veličinu modela i sirovu brzinu, ali dobivate izvanredno svojstvo: **vaš upit nikad ne napušta karticu preglednika radi inferencije**. Bez računa, bez zaokreta prema poslužitelju, bez logiranja nacrta od strane pružatelja.",
        },
        {
          step: "Opcija 3",
          title: "Namjenska računalna snaga (kućni ili uredski poslužitelji)",
          body: "Timovi s namjenskim NVIDIA GPU-ima, Mac Studiom ili malim rack poslužiteljem često pokreću **vLLM**, **llama.cpp** ili Ollama kao zajednički interni endpoint. To je obrazac za private AI najviše kvalitete: veliki kontekstni prozori, veći modeli i više korisnika na LAN-u. Kompromisi: trošak hardvera, energija, hlađenje i stalno operativno održavanje.",
        },
      ],
      afterFlowSteps: [
        "Crvena nit je ista u sva tri slučaja: **inferencija se događa na infrastrukturi koju kontrolirate**, a ne na multi-tenant oblaku gdje vaš tekst postaje tuđe opterećenje obrade.",
      ],
    },
    {
      title: "Open-source projekti koji su najvažniji",
      paragraphs: [
        "Modeli su samo pola priče. Ovi temeljni projekti pretvorili su sirove otvorene težine (otvorene koeficiente) u softver koji milijuni ljudi mogu stvarno pokrenuti.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Visoko učinkovita C/C++ inferencija; temelj za bezbroj lokalnih CPU i GPU implementacija.",
        "**[Ollama](https://ollama.com)** — Prijateljsko CLI i desktop iskustvo za preuzimanje, ažuriranje i razgovor s modelima lokalno.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Visokopropusno batch serviranje za zajedničke timske GPU poslužitelje i API radna opterećenja.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — De facto knjižnica i hub za otkrivanje, preuzimanje, fine-tuning i dijeljenje modela.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Kompilira modele za izvršavanje u pregledniku bez instalacije putem WebGPU-a.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Pokreće ONNX-izvezene modele izravno u JavaScriptu—još jedan put do inferencije u pregledniku.",
      ],
    },
    {
      title: "Obitelji modela koje vrijedi poznavati",
      paragraphs: [
        "Deseci checkpointa pojavljuju se svaki mjesec. Četiri obitelji dominiraju razgovorima o private AI-ju u 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 i novije linije Llama 4 postavljaju mjerilo za generaliste s otvorenim težinama (otvorenim koeficientima): snažno rasuđivanje, široka podrška alatima i ogroman fine-tune ekosustav.",
        "**Google Gemma** — Obitelji Gemma 2, Gemma 3 i **Gemma 4** fokusiraju se na učinkovitost—snažne performanse po parametru, izvrsni mali modeli i varijante prilagođene za inferenciju na uređaju i u hostiranom okruženju.",
        "**Mistral AI (Europa)** — Pariski Mistral isporučuje kompaktne, sposobne modele (Mistral, Mixtral, Codestral) s developer-friendly licencama i izrazito europskom narativom o suverenitetu podataka.",
        "**Alibaba Qwen** — Serije Qwen 2.5 i **Qwen 3** izvrsne su u višejezičnim zadacima i nude male varijante (ispod 1B parametara) koje iznimno dobro rade na skromnom hardveru prijenosnog računala i u pregledniku.",
      ],
      callout:
        "PrivateNoteov AI u pregledniku koristi **Gemma 2 2B** i **Qwen3 0.6B** putem WebLLM-a—modele s otvorenim težinama (otvorenim koeficientima) kompilirane za WebGPU, a ne vlasnički zatvoreni checkpoint. Veće varijante **Gemma 4** pojavljuju se u opcionalnom Cloud Assist putu, ne u Write with Private AI danas.",
    },
    {
      title: "Stanje tehnike u 2026.",
      paragraphs: [
        "Granica je podijeljena. Zatvoreni API-ji od OpenAI-ja, Anthropic-a i Googlea i dalje vode u sirovoj sposobnosti, korištenju alata u velikoj skali i najvećim kontekstnim prozorima. Ali otvorene težine (otvoreni koeficienti) dovoljno su blizu za mnoge stvarne radne tijekove—i ispred su u **privatnosti, kontroli troškova i prilagodbi**.",
        "Među open modelima, **Gemma 4**, **Llama 4**, **Qwen 3** i veliki **Mistral** checkpointi predstavljaju trenutnu generaciju: bolje slijede upute, poboljšano kodiranje i matematiku te pouzdanije odbijanje osjetljivih upita. Manje destilirane varijante donose značajan dio te kvalitete na prijenosna računala i u preglednike.",
        "Multimodalni modeli (tekst + slika) šire se i u oblaku i u open objavama, ali za bilješke i povjerljive predaje, mali modeli samo za tekst ostaju idealna točka: dovoljno brzi da djeluju interaktivno, dovoljno mali da ostanu lokalni.",
      ],
    },
    {
      title: "Private AI u PrivateNoteu: Write with Private AI",
      paragraphs: [
        "PrivateNote je izgrađen za šifrirane, efemerne bilješke—ne za zamjenu cijelog vašeg AI stacka. Ipak, izrada osjetljive poruke upravo je mjesto gdje AI u pregledniku blista: dobivate pomoć pri pisanju **prije** šifriranja, bez slanja teksta na naše poslužitelje radi inferencije.",
        "Otvorite [PrivateNote](app:home) i odaberite **Write with Private AI**. Nema ručnog odabira modela—na podržanim desktopima s WebGPU-om, razina vašeg uređaja odlučuje koji se checkpoint pokreće:",
        "Budite iskreni o kompromisima. Otvorene težine (otvoreni koeficienti) preuzimaju se u pohranu preglednika i inferencija radi lokalno—ali AI u pregledniku je **sporiji** od cloud datacentra i ne može parirati **velikim kontekstnim prozorima** server-class modela. Također ovisi o hardveru: mnogi telefoni i starija prijenosna računala padaju na tipkanje bez AI-ja ili na opcionalni Cloud Assist. Ali za nacrt kratke privatne bilješke, poruke za predaju lozinke ili povjerljivog odgovora, **vrlo je sposoban**—a svojstva privatnosti fundamentalno se razlikuju od tijekova zalijepi-u-ChatGPT.",
      ],
      bullets: [
        "**Skromni hardver** — Učitava **Qwen3 0.6B** i pokreće inferenciju lokalno putem WebGPU-a.",
        "**Sposobni desktopi** — Učitava **Gemma 2 2B** i pokreće inferenciju lokalno putem WebGPU-a.",
        "**Privatno po arhitekturi** — S Write with Private AI vaš nacrt se obrađuje u pregledniku. Ne šalje se na PrivateNote poslužitelje radi inferencije modela.",
        "**Šifrirajte nakon nacrta** — Kad ste zadovoljni tekstom, bilješka se šifrira lokalno prije uploada—isti model kao i svaki drugi PrivateNote.",
        "**Opcionalni Cloud Assist** — Ako vaš uređaj ne može pokrenuti lokalne modele, možete se uključiti u Cloud Assist (Google **Gemma 4 26B** putem Cloudflare Workers AI). Taj put je brži i sposobniji, ali **nije potpuno privatan**—vaš upit napušta uređaj u čistom tekstu i morate ga izričito omogućiti. Pogledajte [kako PrivateNote radi](app:how-it-works) za punu usporedbu.",
        "**Pravi alat za zadatak** — Koristite browser Private AI za osjetljive nacrte. Koristite Ollama ili kućni GPU poslužitelj kad trebate duge dokumente, ogroman kontekst ili najveće open modele.",
      ],
      callout:
        "Private AI u pregledniku ne pokušava nadmašiti granične cloud modele na benchmarkovima. Pokušava učiniti **privatno pisanje nacrta praktičnim** za bilješke koje ljudi već stvaraju u PrivateNoteu.",
    },
    {
      title: "Odabir vaše private-AI postave",
      paragraphs: [
        "Ako ste novi u private AI-ju, krenite jednostavno: instalirajte Ollama i isprobajte srednji Llama ili Gemma checkpoint za svakodnevno pisanje na prijenosnom računalu.",
        "Ako vaš threat model zahtijeva da nacrti nikad ne napuste uređaj—čak i prije šifriranja—koristite alate na strani preglednika, uključujući Write with Private AI unutar PrivateNotea. Suverenitet podataka i inteligentna automatizacija više se ne proturječe; jednostavno uskladite osjetljivost teksta s arhitekturom koja ga pokreće.",
        "Ako osiguravate tim, procijenite zajednički GPU poslužitelj s vLLM-om i kontrolama pristupa—i pročitajte [osiguravanje AI agenata poput zaposlenika](blog:securing-ai-agents-like-employees) za to kako agentni sustavi mijenjaju granicu povjerenja. Za programere koji spajaju agente u radne tijekove, pogledajte [PrivateNote za programere](blog:privatenote-for-developers) i [Codex MCP integraciju](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Isprobajte privatno pisanje nacrta u pregledniku",
  closingBody: [
    "Otvorite PrivateNote, odaberite Write with Private AI i nacrtajte sljedeću osjetljivu bilješku bez slanja u vanjski cloud model. Šifrirajte je kad ste spremni—zatim podijelite sigurnu, jednokratnu poveznicu.",
  ],
  fileSharingNote:
    "Dijelite i datoteke? [Siguran prijenos datoteka](app:secure-file-transfer) koristi isto šifriranje u pregledniku. Slanje zahtijeva besplatan račun; primatelji otvaraju poveznice bez registracije.",
  tagline: "Nacrtajte lokalno. Šifrirajte prvo. Podijelite poveznicu.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb: "Kako AI agenti dobivaju alate i memoriju, sigurnost mora upravljati cijelim sustavom—ne samo modelom.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Dijelite tajne iz VS Codea, Cursora ili AI agenta bez lijepljenja u povijest chata.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb: "Šifrirajte prije uploada, podijelite poveznicu i pustite da bilješka istekne—korak po korak.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb: "Tko drži ključeve i zašto se šifriranje u pregledniku razlikuje od samog HTTPS-a.",
    },
    {
      slug: "privacy-tools",
      blurb: "Praktični alati za privatnost izvan boljih navika same po sebi.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto efemerne bilješke nadmašuju trajne zapise chata za osjetljive poslovne poruke.",
    },
  ],
};
