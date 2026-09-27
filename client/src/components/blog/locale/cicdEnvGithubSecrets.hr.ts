import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsHr: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Developerov laptop na stolu noću s terminalom i konfiguracijskim datotekama pod hladnim plavim svjetlom",
  heroCaption:
    "Većina curenja tajni počinje iz pogodnosti: commitani .env, zalijepljena CI varijabla ili ključ koji nikad nije napustio Git povijest.",
  intro: [
    "API ključevi obično ne cure kroz sofisticirane kriptografske napade. Cure kroz developer workflowe—`.env` datoteke commitane u Git, tajne ispisane u CI logovima i vjerodajnice zalijepljene u pull requestove „samo za sada“.",
    "Ako već znate [kako sigurno dijeliti API ključ](blog:how-to-share-api-key-securely), ovaj vodič je sljedeći sloj: gdje ti ključevi stvarno bježe u modernoj softverskoj isporuci i kako spriječiti da GitHub, CI/CD i lokalna konfiguracija postanu trajna arhiva vašeg produkcijskog pristupa.",
    "Obrazac je svaki put isti. Tajna uđe u sustav napravljen da čuva povijest. Mjesecima kasnije fork, izvoz logova, kompromitiran laptop ili skeniranje javnog repoa pretvore tu pogodnost u incident.",
  ],
  sections: [
    {
      title: "Zašto su .env datoteke i CI/CD magnet za curenje kod developera",
      paragraphs: [
        "Lokalne environment datoteke i pipelinei postoje da brzo pomiču konfiguraciju. Ta brzina je korisna—i opasna—jer tajne često putuju istim alatima koje koristite za code review, build artefakte i automatizaciju.",
        "`.env` datoteka djeluje privremeno. Tajna u CI-ju djeluje „riješeno“. Debug `echo $DATABASE_URL` djeluje bezazleno u privatnom repou. Napadače—i automatske skenere tajni—ne zanima je li ekspozicija bila namjerna. Zanimaju ih trajnost, pretraživost i radijus štete.",
        "Tretirajte svaku tajnu koja dotakne Git ili CI kao da će na kraju biti kopirana, mirrorana ili indeksirana. Dizajnirajte workflow tako da ta pretpostavka bude preživljiva: kratkotrajne vjerodajnice, pravi storeovi tajni i ljudske predaje koje ne ostavljaju plaintext u chatu ili tiketima.",
      ],
    },
    {
      title: "Kako tajne bježe kroz GitHub",
      subsections: [
        {
          title: "Commitane .env i config datoteke",
          paragraphs: [
            "Klasično curenje i dalje je najčešće: `cp .env.example .env`, unijeti produkcijske vrijednosti, pa `git add .` bez primjećivanja. Čak i ako obrišete datoteku u sljedećem commit-u, tajna ostaje u Git povijesti dok je ne prepišete—a javni repozitoriji mogu vrlo brzo biti skenirani za izložene vjerodajnice. Prepisivanje povijesti također ne briše svaku kopiju: forkovi, mirrori, CI cacheovi i lokalni cloneovi i dalje mogu držati stare commitove.",
            "Varijante uključuju `docker-compose.yml` s hardkodiranim lozinkama, Terraform state s osjetljivim outputima, Kubernetes manifeste koji čuvaju base64-enkodirane „tajne“ (base64 je enkodiranje, ne enkripcija—tko može pročitati manifest može dekodirati vrijednost) i notebook ćelije koje ispisuju tokene. Ako liči na konfiguraciju, pretpostavite da će skeneri to tretirati kao dump vjerodajnica.",
          ],
        },
        {
          title: "Pull requestovi, issuei i komentari",
          paragraphs: [
            "Developeri lijepe staging ključeve u PR opise da „pomognu revieweru reproducirati bug“. Komentari na tiketima i GitHub Discussions nasljeđuju isti problem: pretraživa trajnost, notifikacije, email digesti i izvozi.",
            "Privatni repozitoriji znatno smanjuju slučajnu ekspoziciju, ali i dalje nisu odgovarajući store tajni. Promjene pristupa, contractori, kompromitirani računi, cloneovi, backupi i integracije mogu sve vratiti povijesni plaintext. Za predaju API ključeva među ljudima koristite [client-side enkriptirani one-time link](blog:one-time-secret-links)—ne PR komentar.",
          ],
        },
        {
          title: "Forkovi, mirrori i povijest koja nikad ne umire",
          paragraphs: [
            "Ključ commitan jednom može preživjeti u forkovima, mirrorima, CI cacheovima i lokalnim cloneovima dugo nakon što je main branch očišćen. Rotacija tajne je prava remedijacija; prepisivanje povijesti je kontrola štete.",
            "Ako se aktiviraju GitHub Secret Scanning, TruffleHog, gitleaks ili alert cloud providera, prvo rotirajte. Zatim uklonite tajnu s aktivnih brancheva. Tek onda odlučite vrijedi li prepisivanje povijesti cijenu koordinacije.",
          ],
        },
      ],
      calloutTitle: "Čvrsto pravilo",
      callout:
        "Nikad ne commitajte live tajne u Git—čak ni privremene staging vjerodajnice. Ako se tajna mora kretati među ljudima, koristite odgovarajući siguran kanal isporuke, poput client-side enkriptiranog one-time linka. Ako automatizacija treba tajnu, koristite native mehanizam tajni CI platforme, namjenski secrets manager ili po mogućnosti kratkotrajne vjerodajnice preko workload identity ili OIDC—ne repozitorij.",
    },
    {
      title: "Kako tajne bježe kroz CI/CD",
      subsections: [
        {
          title: "Plaintext u workflow datotekama",
          paragraphs: [
            "Stavljanje `API_KEY: sk-...` izravno u `.github/workflows/*.yml`, GitLab CI YAML ili CircleCI config samo je commitanje tajne s dodatnim koracima. Workflow datoteke su kod. Pregledavaju se, kloniraju i čuvaju zauvijek.",
            "Koristite native mehanizam tajni platforme (GitHub Actions secrets, GitLab CI/CD variables i ekvivalente) i referencirajte ih kao environment bindinge—ne hardkodirani YAML. Native CI tajne daleko su bolje od repozitorija, ali nisu magija: zlonamjerna workflow logika, kompromitirane ovisnosti i nemarno logiranje i dalje mogu izložiti vrijednosti u runtimeu. Preferirajte OIDC ili drugu federaciju workload identity prema cloud providerima da uopće ne trebate dugovječne cloud ključeve u CI-ju.",
          ],
        },
        {
          title: "Pipeline logovi i debug izlaz",
          paragraphs: [
            "Build logovi su podcijenjena arhiva. Ispisivanje env varijabli „da se debugira deploy“, dumpanje `process.env` ili verbose Terraform/Helm izlaz može upisati vjerodajnice u skladište logova koje nadživi job.",
            "Pretpostavite da su logovi čitljivi svakome s CI pristupom—a ponekad svakome tko može preuzeti artefakte. Maskirajte tajne, izbjegavajte dump env-a i tretirajte curenje linije loga kao curenje lozinke: rotirajte.",
          ],
        },
        {
          title: "Pull requestovi s forkova",
          paragraphs: [
            "Fork PR-ovi klasična su CI zamka: nepouzdani kod koji radi s tajnama. Većina platformi ograničava dostupnost tajni na fork workflowima upravo zbog toga. Ostavi te tako. Nikad „samo ne omogućujte tajne“ za vanjske contributore da bi check postao zelen.",
            "Za interne repoje i dalje razdvojite privilegirane deploy jobove od PR checkova. Build i test s least privilege; deploy samo s trusted brancheva s eksplicitno dodijeljenim tajnama.",
          ],
        },
        {
          title: "Dijeljeni runneri i curenje artefakata",
          paragraphs: [
            "Self-hosted runneri, dijeljeni cacheovi i uploadani artefakti mogu zadržati tokene dulje od joba koji ih je stvorio. Očistite workspaceove, pažljivo scopeajte cache ključeve i nikad ne pakirajte `.env` datoteke u build artefakte „radi pogodnosti“.",
          ],
        },
      ],
    },
    {
      title: "Sigurniji mentalni model: tri mjesta gdje tajne mogu živjeti",
      paragraphs: [
        "Zbunjenost nastaje kada timovi koriste jedan alat za svaki posao. Podijelite problem po lifecycleu.",
      ],
      comparisonTable: {
        headers: ["Mjesto", "Najbolje za", "Ne za"],
        rows: [
          [
            "Lokalni .env / dotenv",
            "Lokalna development konfiguracija koja ostaje na laptopu i pravilno je gitignored",
            "Dijeljenje s kolegama, CI, Git ili dugovječne produkcijske tajne u plaintextu",
          ],
          [
            "CI native tajne / Vault / cloud secret manager",
            "Machine-to-machine runtime i deploy automatizacija",
            "Ljudske chat predaje ili dugovječne poruke „proslijedi ovo contractoru“",
          ],
          [
            "Client-side enkriptirana one-time bilješka",
            "Isporuka od čovjeka do čovjeka ključa, tokena ili .env isečka",
            "Čuvanje produkcijskih tajni za aplikacije ili pipelinee",
          ],
        ],
        after: [
          "Gitignored `.env` u redu je za lokalni development. Osjetljive produkcijske tajne idealno također ne bi trebale živjeti neograničeno kao plaintext na developer strojevima—preferirajte password manager ili kratkotrajni pristup gdje je praktično. PrivateNote je u trećem redu: sigurna isporuka među ljudima. Nije zamjena za GitHub Actions secrets, HashiCorp Vault, AWS Secrets Manager ili vaš password manager. Za svakodnevne predaje API ključeva uparite ovo s [kako sigurno dijeliti API ključ](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Praktičan workflow: držite tajne izvan Gita i chata",
      flowIntro:
        "Kada kolega, contractor ili klijent treba vrijednost koja će na kraju završiti u CI-ju ili lokalnom `.env`, koristite ovaj redoslijed:",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Stvorite scoped, kratkotrajnu vjerodajnicu",
          body: "Preferirajte staging ključeve, read-only scopeove, IP allowliste i istek. Izbjegavajte dijeliti primarni produkcijski ključ „jer je brže“.",
        },
        {
          step: "Korak 2",
          title: "Isporučite putem client-side enkriptirane one-time bilješke",
          body: "Enkriptirajte tajnu (ili nekoliko potrebnih `.env` linija) lokalno s PrivateNote—putem [web aplikacije](app:home), [CLI](app:developers/cli), [VS Code / Cursor ekstenzije](app:developers/vscode) ili [Chrome ekstenzije](chrome:extension). Postavite kratak istek ili burn-after-read, pa pošaljite link bilješke—ne plaintext—putem Slacka, emaila ili tiketa.",
        },
        {
          step: "Korak 3",
          title: "Instalirajte u pravi store",
          body: "Primatelj kopira vrijednost u gitignored lokalni `.env` (za development), password manager ili CI/cloud store tajni. Ne lijepite je natrag u PR, chat thread ili dijeljeni dokument.",
        },
        {
          step: "Korak 4",
          title: "Rotirajte kada je posao gotov",
          body: "Opovucite contractor ključeve, rotirajte nakon incidenta i zamijenite svaku vjerodajnicu koja se ikad pojavila u logovima, Gitu ili tiketu. Pogodnost bez rotacije samo je odgođeni odgovor na incident.",
        },
      ],
      midCta: {
        body: "Trebate li nekome odmah dati CI token ili nekoliko .env linija? Pošaljite client-side enkriptiranu one-time bilješku umjesto da commitate ili lijepite plaintext.",
        button: "Stvori privatnu bilješku",
      },
    },
    {
      title: "Dijelite odatle gdje već radite",
      paragraphs: [
        "Ne morate napuštati terminal, editor ili browser tab da biste stvorili client-side enkriptiranu one-time bilješku. Odaberite PrivateNote površinu koja odgovara trenutku—enkripcija se uvijek događa lokalno na vašem uređaju prije uploada. Za potpuniji vodič, pogledajte [PrivateNote za developere](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Čitajte iz datoteke ili pipeajte stdin da tajna nikad ne sjedi u shell povijesti kao `echo` argument: `npx privatenote-cli --expire 1h --output-url-only .env.local` ili `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Korisno u shell workflowima, skriptama i brzim terminal predajama. Setup i flagovi: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code i Cursor",
          paragraphs: [
            "Instalirajte [VS Code / Cursor ekstenziju](app:developers/vscode), pa enkriptirajte iz sidebara, selekcije u editoru ili context izbornika—idealno kada je tajna već na ekranu u `.env` ili config datoteci i nikad ne treba stići u Slack kao plaintext.",
          ],
        },
        {
          title: "Chrome ekstenzija",
          paragraphs: [
            "Kada se vjerodajnica pojavi u emailu, dokumentima ili tiketu, [Chrome ekstenzija](chrome:extension) pretvara odabrani tekst u browser-enkriptiranu one-time bilješku bez napuštanja taba.",
          ],
        },
      ],
    },
    {
      title: "Developer checklist prije svakog pusha i izmjene pipelinea",
      useCaseTable: {
        headers: ["Checkpoint", "Što provjeriti"],
        rows: [
          [
            "Prije git commit-a",
            "`.env`, `*.pem`, `credentials.json` i lokalne datoteke tajni su gitignored; `git status` ne pokazuje iznenađujuće dodatke",
          ],
          [
            "Prije otvaranja PR-a",
            "Nema ključeva u opisu, screenshotovima, fixtureima ili „privremenim“ debug datotekama",
          ],
          [
            "Prije uređivanja workflowa",
            "Tajne dolaze iz native mehanizma tajni platforme ili OIDC/workload identity—ne iz hardkodiranog YAML-a",
          ],
          [
            "Prije debugiranja CI-ja",
            "Nema `env`, `printenv` ili verbose dumpova koji bi mogli upisati tajne u logove",
          ],
          [
            "Nakon bilo koje ekspozicije",
            "Prvo rotirajte, zatim očistite povijest/brancheve; tretirajte skenere kao okidače incidenta",
          ],
        ],
      },
      callout:
        "Dodajte secret scanning na zadani put: pre-commit hookovi (gitleaks), CI skeniranje i GitHub Secret Scanning / push protection. Prevencija pobjeđuje herojska prepisivanja povijesti.",
    },
    {
      title: "Što učiniti ako je tajna već na GitHubu",
      paragraphs: [
        "Postupite ovim redoslijedom: **rotirajte ili opovucite** vjerodajnicu kod providera, **invalidirajte** ovisne sesije ili webhookove, **uklonite** tajnu s default brancha, pa odlučite treba li prepisivanje povijesti zbog compliancea ili javne ekspozicije. Čak i nakon prepisa, pretpostavite da forkovi, mirrori, cacheovi i cloneovi i dalje mogu držati kopije dok se to ne riješi posebno.",
        "Obavijestite vlasnike svih sustava do kojih bi ključ mogao doći. Provjerite cloud billing, access logove i neuobičajenu API upotrebu. Ako je tajna također zalijepljena u Slack ili email, pretpostavite da te arhive i dalje sadrže—pogledajte [zašto je email najgore mjesto za tajne](blog:why-email-is-worst-for-secrets) i [tajne koje nikad ne treba slati u chat](blog:secrets-never-send-in-chat).",
        "Za iznimno vrijedne tajne poput crypto seed phraseova, izbjegavajte prijenos kad god je moguće. Za druge nezamjenjive root vjerodajnice uopće ih ne tipkajte u website—prvo enkriptirajte lokalno i dijelite samo ciphertext kada morate. Taj model pokriven je u našem [vodiču za crypto seed phrase](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Je li privatni GitHub repo dovoljno siguran za .env datoteke?",
          answer:
            "Ne. Privatni repozitorij znatno ograničava ekspoziciju, ali i dalje nije odgovarajući store tajni. Promjene pristupa, kompromitirani računi, cloneovi, backupi i third-party integracije mogu sve vratiti povijesni plaintext. Držite tajne potpuno izvan Gita.",
        },
        {
          question: "Jesu li GitHub Actions secrets dovoljni?",
          answer:
            "To je pravo mjesto za mnoge CI runtime vrijednosti—daleko bolje od YAML-a ili datoteka u repou. I dalje ne rješavaju ljudsku isporuku, curenje logova, preširoke dozvole, rizike fork PR-ova niti ekspoziciju kroz zlonamjerne workflow korake i kompromitirane ovisnosti. Kombinirajte native mehanizam tajni platforme s least privilege, pažljivim logiranjem i po mogućnosti kratkotrajnim vjerodajnicama preko OIDC ili workload identity.",
        },
        {
          question: "Trebam li commitati redigirani .env.example?",
          answer:
            "Da. Commitajte samo imena varijabli i dummy placeholdere. Nikad stvarne vrijednosti, „gotovo stvarne“ staging ključeve ili produkcijske connection stringove s uklonjenom lozinkom ali intaktnim hostom i usernameom ako je ta kombinacija osjetljiva u vašem threat modelu.",
        },
        {
          question: "Je li lokalna .env datoteka u redu?",
          answer:
            "Za lokalni development, da—kada je pravilno gitignored i nikad commitana. Osjetljive produkcijske tajne idealno ne bi trebale živjeti neograničeno u plaintext `.env` datotekama na developer strojevima; koristite password manager, kratkotrajni pristup ili secrets manager gdje je praktično.",
        },
        {
          question: "Može li PrivateNote zamijeniti Vault ili GitHub secrets?",
          answer:
            "Ne. PrivateNote je za sigurnu isporuku od čovjeka do čovjeka. Koristite native mehanizam tajni CI platforme i namjenske secrets managere za automatizaciju. Koristite PrivateNote kada osoba treba primiti ključ, token ili .env isečak bez ostavljanja plainteksta u Slacku, emailu ili GitHubu.",
        },
        {
          question: "Koja je najbrža sigurna predaja za CI token?",
          answer:
            "Stvorite usko scoped token, isporučite ga putem client-side enkriptirane one-time bilješke (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) ili [Chrome](chrome:extension)), neka ga primatelj spremi u CI store tajni ili password manager, pa opovucite token kada je posao gotov.",
        },
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "GitHub i CI/CD izvrsni su u čuvanju rada. Upravo zato su loša mjesta za čuvanje tajni.",
        "Držite `.env` datoteke lokalno, gitignored i ograničene na development gdje možete. Stavite vjerodajnice automatizacije u native CI tajne, secrets manager ili kratkotrajne OIDC vjerodajnice. Kada čovjek treba vrijednost, koristite client-side enkriptiranu one-time bilješku—zatim rotirajte.",
        "Ako vaš tim i dalje lijepi ključeve u PR-ove ili commita „samo staging“ vjerodajnice, počnite s [workflowom dijeljenja API ključeva](blog:how-to-share-api-key-securely) i checklistom iznad. Za materijal pristupa serveru koristite [kako sigurno dijeliti SSH ključeve](blog:how-to-share-ssh-keys-securely). Uvezite [CLI](app:developers/cli), [VS Code ekstenziju](app:developers/vscode) ili [Chrome ekstenziju](chrome:extension) u put najmanjeg otpora tako da sigurna opcija bude i brza.",
      ],
    },
  ],
  ctaTitle: "Podijelite tajnu—ne trajnu kopiju",
  ctaBody:
    "Enkriptirajte CI token ili .env isečak lokalno s PrivateNote—putem web aplikacije, CLI, VS Code / Cursor ili Chrome ekstenzije—prije nego stigne u chat ili Git. Koristite kratak istek ili burn-after-read, pošaljite one-time link bilješke umjesto plainteksta i držite Git i pipeline povijest bez live vjerodajnica.",
  ctaButton: "Stvori privatnu bilješku",
};
