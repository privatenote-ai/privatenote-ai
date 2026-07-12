import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiSr: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Osoba koja radi za kućnim stolom sa laptopom na kojem je prikazana vizualizacija neuronske mreže i kompaktni lokalni AI server pored njega",
  intro: [
    "**Private AI** znači pokretanje velikog jezičkog modela na hardveru koji direktno kontrolišete—vašem laptopu, pregledaču ili serveru u kancelariji—tako da vaš ulazni tekst nikad ne bude poslat u oblak treće strane na inferenciju. To je praktičan odgovor na jednostavno pitanje: *mogu li da dobijem visokokvalitetnu pomoć od AI-ja bez predaje svojih reči tuđem računaru?*",
    "To pitanje postaje važnije svake godine. Oblak asistenti su izuzetno moćni, ali vaše upite obrađuju na udaljenoj infrastrukturi. Za beleške, akreditive, pravne nacrte, zdravstvene informacije ili bilo šta što ne biste zalepili u javni chatbot, lokalni AI i AI u pregledaču više nisu hobistička radoznalost. To je vitalan bezbednosni zahtev.",
    "Ovaj vodič prolazi kroz to kako se private AI razvijao, zašto veliki laboratoriji objavljuju otvorene težine (otvorene koeficiente) modela, glavne načine na koje ljudi pokreću modele lokalno, open-source projekte i porodice modela koje su najvažnije, gde stanje tehnike stoji u 2026.—i kako se [PrivateNote](app:home) uklapa sa **Write with Private AI**, koji radi u potpunosti unutar taba vašeg pregledača.",
  ],
  sections: [
    {
      title: "Kratka evolucija: od laboratorija do vašeg laptopa",
      paragraphs: [
        "Godinama su korisni jezički modeli živeli gotovo isključivo unutar tehnoloških divova sa masivnim GPU klasterima. Treniranje je zahtevalo milione dolara računske snage, specijalizovane timove i vlasničke skupove podataka. Ako ste želeli AI pomoć, koristili ste API ili web aplikaciju u oblaku—i vaš tekst je napuštao vaš uređaj.",
        "Tri industrijska pomaka potpuno su promenili tu sliku:",
      ],
      bullets: [
        "**Zakoni skaliranja transformera** — Istraživanja su pokazala da dobro trenirani modeli na velikim, visokokvalitetnim skupovima podataka mogu da pruže iznenađujuće opšte sposobnosti—ne samo na granici skale.",
        "**Objave modela s otvorenim težinama (otvorenim koeficientima)** — Počevši sa Metaovom porodicom Llama, a zatim Mistralom, Google Gemma, Alibaba Qwen i drugima, preuzimljivi parametri stigli su do programera širom sveta.",
        "**Zrelost alata za inferenciju** — Projekti poput llama.cpp, Ollama, vLLM, WebLLM i Transformers.js učinili su praktičnim pokretanje tih otvorenih težina (otvorenih koeficienta) na potrošačkom hardveru.",
      ],
      callout:
        "Do 2026. razmak između „samo u oblaku“ i „radi na mom uređaju“ dramatično se suzio. Granični modeli u oblaku i dalje su veći i brži, ali mali i srednji open modeli su veoma sposobni za nacrte, sažetke, prepisivanje i odgovaranje na svakodnevna pitanja—posebno za kratke tekstove poput beleški.",
    },
    {
      title: "Zašto kompanije objavljuju otvorene težine (otvorene koeficiente) modela",
      paragraphs: [
        "Objavljivanje otvorenih težina (otvorenih koeficienta) nije dobrotvornost. Laboratoriji objavljuju parametre iz strateških razloga koji oblikuju ceo ekosistem.",
      ],
      bullets: [
        "**Poluga ekosistema** — Kada programeri grade na vašem modelu, vaša arhitektura postaje podrazumevana. Fine-tuneovi, alati i integracije slede otvorene težine (otvorene koeficiente).",
        "**Istraživačka verodostojnost** — Otvorene težine (otvoreni koeficienti) pozivaju na proveru, reproduktivnost i akademsku primenu. Ta vidljivost jača tehničko vođstvo.",
        "**Regulatorno i poverenjsko pozicioniranje** — Evropski igrači poput Mistrala i globalni brendovi poput Metae i Googlea koriste open objave za signaliziranje transparentnosti i razlikovanje od potpuno zatvorenih API-ja.",
        "**Destilacija i specijalizacija** — Manji modeli trenirani iz većih šire sposobnosti nadole. Objavljivanje roditeljskih otvorenih težina (otvorenih koeficienta) ubrzava taj pipeline u celoj zajednici.",
        "**Konkurentski pritisak** — Kada jedan veliki laboratorij open objavi snažan model, drugi su pod pritiskom da usklade ili rizikuju gubitak pažnje programera.",
      ],
      callout:
        "Otvorene težine (otvoreni koeficienti) nisu uvek „open source“ u strogom smislu. Licence mogu ograničiti komercijalnu upotrebu, zahtevati atribuciju ili isključiti određene domene. Uvek pročitajte model card pre implementacije u produkciji.",
    },
    {
      title: "Tri načina implementacije private AI-ja",
      paragraphs: [
        "Ne postoji jedna najbolja arhitektura. Pravi izbor zavisi od vašeg hardvera, zahteva privatnosti i toga da li vam treba generalista od 70 milijardi parametara ili brzog asistenta za kratke beleške.",
      ],
      beforeFlowSteps: "Većina private-AI implementacija pada u jedan od ovih obrazaca:",
      flowDiagramCaption: "Tri obrasca implementacije na prvi pogled",
      flowSteps: [
        {
          step: "Opcija 1",
          title: "Lokalna aplikacijska okruženja (Ollama i desktop aplikacije)",
          body: "Alati poput [Ollama](https://ollama.com), LM Studio i GPT4All preuzimaju otvorene težine (otvorene koeficiente) modela i pokreću ih nativno na vašem Macu, Windowsu ili Linuxu. Dobijate offline inferenciju, nativno GPU ubrzanje i pristup većim modelima nego što pregledač može udobno da učita. Kompromisi: značajan prostor na disku (često desetine gigabajta po modelu), namenski RAM ili VRAM i ručna ažuriranja.",
        },
        {
          step: "Opcija 2",
          title: "Sandbox okruženja (WebGPU u pregledaču)",
          body: "Moderni pregledači izlažu **WebGPU**, koji omogućava JavaScriptu da pokreće neuronske mreže na vašem GPU-u bez instalacije bilo čega. Projekti poput WebLLM, MLC LLM i Transformers.js kompiliraju modele za web. Žrtvujete veličinu modela i sirovu brzinu, ali dobijate izvanredno svojstvo: **vaš upit nikad ne napušta tab pregledača radi inferencije**. Bez naloga, bez zaokreta ka serveru, bez logovanja nacrta od strane pružaoca.",
        },
        {
          step: "Opcija 3",
          title: "Namenska računska snaga (kućni ili kancelarijski serveri)",
          body: "Timovi sa namenskim NVIDIA GPU-ima, Mac Studiom ili malim rack serverom često pokreću **vLLM**, **llama.cpp** ili Ollama kao zajednički interni endpoint. To je obrazac za private AI najviše kvaliteta: veliki kontekstni prozori, veći modeli i više korisnika na LAN-u. Kompromisi: trošak hardvera, energija, hlađenje i stalno operativno održavanje.",
        },
      ],
      afterFlowSteps: [
        "Crvena nit je ista u sva tri slučaja: **inferencija se dešava na infrastrukturi koju kontrolišete**, a ne na multi-tenant oblaku gde vaš tekst postaje tuđe opterećenje obrade.",
      ],
    },
    {
      title: "Open-source projekti koji su najvažniji",
      paragraphs: [
        "Modeli su samo pola priče. Ovi temeljni projekti pretvorili su sirove otvorene težine (otvorene koeficiente) u softver koji milioni ljudi mogu stvarno da pokrenu.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Visoko efikasna C/C++ inferencija; temelj za bezbroj lokalnih CPU i GPU implementacija.",
        "**[Ollama](https://ollama.com)** — Prijateljsko CLI i desktop iskustvo za preuzimanje, ažuriranje i razgovor sa modelima lokalno.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Visokopropusno batch serviranje za zajedničke timske GPU servere i API radna opterećenja.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — De facto biblioteka i hub za otkrivanje, preuzimanje, fine-tuning i deljenje modela.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Kompilira modele za izvršavanje u pregledaču bez instalacije putem WebGPU-a.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Pokreće ONNX-izvezene modele direktno u JavaScriptu—još jedan put do inferencije u pregledaču.",
      ],
    },
    {
      title: "Porodice modela koje vredi poznavati",
      paragraphs: [
        "Deseci checkpointa pojavljuju se svakog meseca. Četiri porodice dominiraju razgovorima o private AI-ju u 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 i novije linije Llama 4 postavljaju merilo za generaliste s otvorenim težinama (otvorenim koeficientima): snažno rasuđivanje, široka podrška alatima i ogroman fine-tune ekosistem.",
        "**Google Gemma** — Porodice Gemma 2, Gemma 3 i **Gemma 4** fokusiraju se na efikasnost—snažne performanse po parametru, izvrsni mali modeli i varijante prilagođene za inferenciju na uređaju i u hostovanom okruženju.",
        "**Mistral AI (Evropa)** — Pariski Mistral isporučuje kompaktne, sposobne modele (Mistral, Mixtral, Codestral) sa developer-friendly licencama i izrazito evropskim narativom o suverenitetu podataka.",
        "**Alibaba Qwen** — Serije Qwen 2.5 i **Qwen 3** izvrsne su u višejezičnim zadacima i nude male varijante (ispod 1B parametara) koje izuzetno dobro rade na skromnom hardveru laptopa i u pregledaču.",
      ],
      callout:
        "PrivateNoteov AI u pregledaču koristi **Gemma 2 2B** i **Qwen3 0.6B** putem WebLLM-a—modele s otvorenim težinama (otvorenim koeficientima) kompilirane za WebGPU, a ne vlasnički zatvoreni checkpoint. Veće varijante **Gemma 4** pojavljuju se u opcionalnom Cloud Assist putu, ne u Write with Private AI danas.",
    },
    {
      title: "Stanje tehnike u 2026.",
      paragraphs: [
        "Granica je podeljena. Zatvoreni API-ji od OpenAI-ja, Anthropic-a i Googlea i dalje vode u sirovoj sposobnosti, korišćenju alata u velikoj skali i najvećim kontekstnim prozorima. Ali otvorene težine (otvoreni koeficienti) su dovoljno blizu za mnoge stvarne radne tokove—i ispred su u **privatnosti, kontroli troškova i prilagodbi**.",
        "Među open modelima, **Gemma 4**, **Llama 4**, **Qwen 3** i veliki **Mistral** checkpointi predstavljaju trenutnu generaciju: bolje slede upute, poboljšano kodiranje i matematiku i pouzdanije odbijanje osetljivih upita. Manje destilirane varijante donose značajan deo te kvalitete na laptopove i u pregledače.",
        "Multimodalni modeli (tekst + slika) šire se i u oblaku i u open objavama, ali za beleške i poverljive predaje, mali modeli samo za tekst ostaju idealna tačka: dovoljno brzi da deluju interaktivno, dovoljno mali da ostanu lokalni.",
      ],
    },
    {
      title: "Private AI u PrivateNoteu: Write with Private AI",
      paragraphs: [
        "PrivateNote je izgrađen za šifrovane, efemerne beleške—ne za zamenu celog vašeg AI stacka. Ipak, izrada osetljive poruke upravo je mesto gde AI u pregledaču blista: dobijate pomoć pri pisanju **pre** šifrovanja, bez slanja teksta na naše servere radi inferencije.",
        "Otvorite [PrivateNote](app:home) i izaberite **Write with Private AI**. Nema ručnog odabira modela—na podržanim desktopima sa WebGPU-om, nivo vašeg uređaja odlučuje koji se checkpoint pokreće:",
        "Budite iskreni o kompromisima. Otvorene težine (otvoreni koeficienti) preuzimaju se u skladište pregledača i inferencija radi lokalno—ali AI u pregledaču je **sporiji** od cloud datacentra i ne može da parira **velikim kontekstnim prozorima** server-class modela. Takođe zavisi od hardvera: mnogi telefoni i stariji laptopovi padaju na kucanje bez AI-ja ili na opcionalni Cloud Assist. Ali za nacrt kratke privatne beleške, poruke za predaju lozinke ili poverljivog odgovora, **veoma je sposoban**—a svojstva privatnosti fundamentalno se razlikuju od tokova zalepi-u-ChatGPT.",
      ],
      bullets: [
        "**Skromni hardver** — Učitava **Qwen3 0.6B** i pokreće inferenciju lokalno putem WebGPU-a.",
        "**Sposobni desktopi** — Učitava **Gemma 2 2B** i pokreće inferenciju lokalno putem WebGPU-a.",
        "**Privatno po arhitekturi** — Sa Write with Private AI vaš nacrt se obrađuje u pregledaču. Ne šalje se na PrivateNote servere radi inferencije modela.",
        "**Šifrujte nakon nacrta** — Kada ste zadovoljni tekstom, beleška se šifruje lokalno pre otpremanja—isti model kao i svaka druga PrivateNote beleška.",
        "**Opcionalni Cloud Assist** — Ako vaš uređaj ne može da pokrene lokalne modele, možete da se uključite u Cloud Assist (Google **Gemma 4 26B** putem Cloudflare Workers AI). Taj put je brži i sposobniji, ali **nije potpuno privatan**—vaš upit napušta uređaj u čistom tekstu i morate ga izričito da omogućite. Pogledajte [kako PrivateNote radi](app:how-it-works) za punu uporedbu.",
        "**Pravi alat za zadatak** — Koristite browser Private AI za osetljive nacrte. Koristite Ollama ili kućni GPU server kada vam trebaju dugi dokumenti, ogroman kontekst ili najveći open modeli.",
      ],
      callout:
        "Private AI u pregledaču ne pokušava da nadmaši granične cloud modele na benchmarkovima. Pokušava da učini **privatno pisanje nacrta praktičnim** za beleške koje ljudi već kreiraju u PrivateNoteu.",
    },
    {
      title: "Odabir vaše private-AI postave",
      paragraphs: [
        "Ako ste novi u private AI-ju, krenite jednostavno: instalirajte Ollama i isprobajte srednji Llama ili Gemma checkpoint za svakodnevno pisanje na laptopu.",
        "Ako vaš threat model zahteva da nacrti nikad ne napuste uređaj—čak i pre šifrovanja—koristite alate na strani pregledača, uključujući Write with Private AI unutar PrivateNotea. Suverenitet podataka i inteligentna automatizacija više se ne protivreče; jednostavno uskladite osetljivost teksta sa arhitekturom koja ga pokreće.",
        "Ako obezbeđujete tim, procenite zajednički GPU server sa vLLM-om i kontrolama pristupa—i pročitajte [obezbeđivanje AI agenata poput zaposlenih](blog:securing-ai-agents-like-employees) za to kako agentni sistemi menjaju granicu poverenja. Za programere koji spajaju agente u radne tokove, pogledajte [PrivateNote za programere](blog:privatenote-for-developers) i [Codex MCP integraciju](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Isprobajte privatno pisanje nacrta u pregledaču",
  closingBody: [
    "Otvorite PrivateNote, izaberite Write with Private AI i nacrtajte sledeću osetljivu belešku bez slanja u spoljni cloud model. Šifrujte je kada ste spremni—zatim podelite bezbednu, jednokratnu vezu.",
  ],
  fileSharingNote:
    "Delite i datoteke? [Bezbedan prenos datoteka](app:secure-file-transfer) koristi isto šifrovanje u pregledaču. Slanje zahteva besplatan nalog; primaoci otvaraju veze bez registracije.",
  tagline: "Nacrtajte lokalno. Šifrujte prvo. Podelite vezu.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb: "Kako AI agenti dobijaju alate i memoriju, bezbednost mora da upravlja celim sistemom—ne samo modelom.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Delite tajne iz VS Codea, Cursora ili AI agenta bez lepljenja u istoriju četa.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb: "Šifrujte pre otpremanja, podelite vezu i pustite da beleška istekne—korak po korak.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb: "Ko drži ključeve i zašto se šifrovanje u pregledaču razlikuje od samog HTTPS-a.",
    },
    {
      slug: "privacy-tools",
      blurb: "Praktični alati za privatnost izvan boljih navika same po sebi.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto efemerne beleške nadmašuju trajne zapise četa za osetljive poslovne poruke.",
    },
  ],
};
