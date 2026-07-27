import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsSr: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Laptop developera na stolu noću sa terminalom i konfiguracionim fajlovima pod hladnim plavim svetlom",
  heroCaption:
    "Većina curenja tajni počinje iz pogodnosti: commitovan .env, nalepjena CI promenljiva ili ključ koji nikad nije napustio Git istoriju.",
  intro: [
    "API ključevi obično ne cure kroz sofisticovane kriptografske napade. Cure kroz developer workflowe—`.env` fajlove commitovane u Git, tajne ispisane u CI logovima i kredencijale nalepljene u pull requestove „samo za sada“.",
    "Ako već znate [kako bezbedno deliti API ključ](blog:how-to-share-api-key-securely), ovaj vodič je sledeći sloj: gde ti ključevi stvarno beže u modernoj softverskoj isporuci i kako sprečiti da GitHub, CI/CD i lokalna konfiguracija postanu trajna arhiva vašeg produkcionog pristupa.",
    "Šablon je svaki put isti. Tajna uđe u sistem napravljen da čuva istoriju. Mesecima kasnije fork, izvoz logova, kompromitovan laptop ili skeniranje javnog repoa pretvore tu pogodnost u incident.",
  ],
  sections: [
    {
      title: "Zašto su .env fajlovi i CI/CD magnet za curenje kod developera",
      paragraphs: [
        "Lokalni environment fajlovi i pipeline-ovi postoje da brzo pomeraju konfiguraciju. Ta brzina je korisna—i opasna—jer tajne često putuju istim alatima koje koristite za code review, build artefakte i automatizaciju.",
        "`.env` fajl deluje privremeno. Tajna u CI-ju deluje „rešeno“. Debug `echo $DATABASE_URL` deluje bezazleno u privatnom repou. Napadače—i automatske skenere tajni—ne zanima da li je ekspozicija bila namerna. Zanimaju ih trajnost, pretraživost i radijus štete.",
        "Tretirajte svaku tajnu koja dodirne Git ili CI kao da će na kraju biti kopirana, mirrorovana ili indeksirana. Dizajnirajte workflow tako da ta pretpostavka bude preživljiva: kratkotrajni kredencijali, pravi store-ovi tajni i ljudske predaje koje ne ostavljaju plaintext u chatu ili tiketima.",
      ],
    },
    {
      title: "Kako tajne beže kroz GitHub",
      subsections: [
        {
          title: "Commitovani .env i config fajlovi",
          paragraphs: [
            "Klasično curenje je i dalje najčešće: `cp .env.example .env`, uneti produkcione vrednosti, pa `git add .` bez primetanja. Čak i ako obrišete fajl u sledećem commit-u, tajna ostaje u Git istoriji dok je ne prepišete—a javni repozitorijumi mogu veoma brzo biti skenirani za izložene kredencijale. Prepisivanje istorije takođe ne briše svaku kopiju: fork-ovi, mirror-i, CI keševi i lokalni clone-ovi i dalje mogu držati stare commit-ove.",
            "Varijante uključuju `docker-compose.yml` sa hardkodovanim lozinkama, Terraform state sa osetljivim outputima, Kubernetes manifeste koji čuvaju base64-enkodirane „tajne“ (base64 je enkodiranje, ne enkripcija—ko može da pročita manifest može da dekodira vrednost) i notebook ćelije koje štampaju tokene. Ako liči na konfiguraciju, pretpostavite da će skeneri to tretirati kao dump kredencijala.",
          ],
        },
        {
          title: "Pull requestovi, issue-i i komentari",
          paragraphs: [
            "Developeri lepe staging ključeve u PR opise da „pomognu revieweru da reprodukuje bag“. Komentari na tiketima i GitHub Discussions nasleđuju isti problem: pretraživa trajnost, notifikacije, email digesti i izvozi.",
            "Privatni repozitorijumi značajno smanjuju slučajnu ekspoziciju, ali i dalje nisu odgovarajući store tajni. Promene pristupa, contractori, kompromitovani nalozi, clone-ovi, backup-i i integracije mogu sve vratiti istorijski plaintext. Za predaju API ključeva među ljudima koristite [client-side enkriptovan one-time link](blog:one-time-secret-links)—ne PR komentar.",
          ],
        },
        {
          title: "Fork-ovi, mirror-i i istorija koja nikad ne umire",
          paragraphs: [
            "Ključ commitovan jednom može preživeti u fork-ovima, mirror-ima, CI keševima i lokalnim clone-ovima dugo nakon što je main branch očišćen. Rotacija tajne je prava remedijacija; prepisivanje istorije je kontrola štete.",
            "Ako se aktiviraju GitHub Secret Scanning, TruffleHog, gitleaks ili alert cloud providera, prvo rotirajte. Zatim uklonite tajnu sa aktivnih branch-eva. Tek onda odlučite da li prepisivanje istorije vredi cenu koordinacije.",
          ],
        },
      ],
      calloutTitle: "Čvrsto pravilo",
      callout:
        "Nikad ne commitujte live tajne u Git—čak ni privremene staging kredencijale. Ako tajna mora da se kreće među ljudima, koristite odgovarajući bezbedan kanal isporuke, kao što je client-side enkriptovan one-time link. Ako automatizacija treba tajnu, koristite native mehanizam tajni CI platforme, namenski secrets manager ili po mogućnosti kratkotrajne kredencijale preko workload identity ili OIDC—ne repozitorijum.",
    },
    {
      title: "Kako tajne beže kroz CI/CD",
      subsections: [
        {
          title: "Plaintext u workflow fajlovima",
          paragraphs: [
            "Stavljanje `API_KEY: sk-...` direktno u `.github/workflows/*.yml`, GitLab CI YAML ili CircleCI config samo je commitovanje tajne sa dodatnim koracima. Workflow fajlovi su kod. Pregledaju se, kloniraju i čuvaju zauvek.",
            "Koristite native mehanizam tajni platforme (GitHub Actions secrets, GitLab CI/CD variables i ekvivalente) i referencirajte ih kao environment bindinge—ne hardkodovan YAML. Native CI tajne su daleko bolje od repozitorijuma, ali nisu magija: zlonamerna workflow logika, kompromitovane zavisnosti i nemarno logovanje i dalje mogu izložiti vrednosti u runtime-u. Preferirajte OIDC ili drugu federaciju workload identity ka cloud providerima da uopšte ne treba vam dugovečni cloud ključevi u CI-ju.",
          ],
        },
        {
          title: "Pipeline logovi i debug izlaz",
          paragraphs: [
            "Build logovi su podcenjena arhiva. Ispisivanje env promenljivih „da se debaguje deploy“, dumpovanje `process.env` ili verbose Terraform/Helm izlaza može upisati kredencijale u skladište logova koje nadživi job.",
            "Pretpostavite da su logovi čitljivi svakome sa CI pristupom—a ponekad svakome ko može da preuzme artefakte. Maskirajte tajne, izbegavajte dump env-a i tretirajte curenje linije loga kao curenje lozinke: rotirajte.",
          ],
        },
        {
          title: "Pull requestovi sa fork-ova",
          paragraphs: [
            "Fork PR-ovi su klasična CI zamka: nepouzdan kod koji radi sa tajnama. Većina platformi ograničava dostupnost tajni na fork workflowima upravo zbog toga. Ostavi te tako. Nikad „samo ne omogućavaj tajne“ za eksterne contributore da bi check postao zelen.",
            "Za interne repo-e i dalje razdvojite privilegovane deploy jobove od PR checkova. Build i test sa least privilege; deploy samo sa trusted branch-eva sa eksplicitno dodeljenim tajnama.",
          ],
        },
        {
          title: "Deljeni runneri i curenje artefakata",
          paragraphs: [
            "Self-hosted runneri, deljeni keševi i uploadovani artefakti mogu zadržati tokene duže od joba koji ih je kreirao. Očistite workspace-ove, pažljivo scope-ujte cache ključeve i nikad ne pakujte `.env` fajlove u build artefakte „radi pogodnosti“.",
          ],
        },
      ],
    },
    {
      title: "Bezbedniji mentalni model: tri mesta gde tajne mogu da žive",
      paragraphs: [
        "Zbunjenost nastaje kada timovi koriste jedan alat za svaki posao. Podelite problem po lifecycle-u.",
      ],
      comparisonTable: {
        headers: ["Mesto", "Najbolje za", "Ne za"],
        rows: [
          [
            "Lokalni .env / dotenv",
            "Lokalna development konfiguracija koja ostaje na laptopu i pravilno je gitignored",
            "Deljenje sa kolegama, CI, Git ili dugovečne produkcione tajne u plaintextu",
          ],
          [
            "CI native tajne / Vault / cloud secret manager",
            "Machine-to-machine runtime i deploy automatizacija",
            "Ljudske chat predaje ili dugovečne poruke „prosledi ovo contractoru“",
          ],
          [
            "Client-side enkriptovana one-time beleška",
            "Isporuka od čoveka do čoveka ključa, tokena ili .env isečka",
            "Čuvanje produkcionih tajni za aplikacije ili pipeline-ove",
          ],
        ],
        after: [
          "Gitignored `.env` je u redu za lokalni development. Osetljive produkcione tajne idealno takođe ne bi trebalo da žive neograničeno kao plaintext na developer mašinama—preferirajte password manager ili kratkotrajni pristup gde je praktično. PrivateNote je u trećem redu: bezbedna isporuka među ljudima. Nije zamena za GitHub Actions secrets, HashiCorp Vault, AWS Secrets Manager ili vaš password manager. Za svakodnevne predaje API ključeva uparite ovo sa [kako bezbedno deliti API ključ](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Praktičan workflow: držite tajne van Git-a i chata",
      flowIntro:
        "Kada kolega, contractor ili klijent treba vrednost koja će na kraju završiti u CI-ju ili lokalnom `.env`, koristite ovaj redosled:",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Kreirajte scoped, kratkotrajni kredencijal",
          body: "Preferirajte staging ključeve, read-only scope-ove, IP allowlist-e i istek. Izbegavajte da delite primarni produkcioni ključ „jer je brže“.",
        },
        {
          step: "Korak 2",
          title: "Isporučite preko client-side enkriptovane one-time beleške",
          body: "Enkriptujte tajnu (ili nekoliko potrebnih `.env` linija) lokalno sa PrivateNote—preko [web aplikacije](app:home), [CLI](app:developers/cli), [VS Code / Cursor ekstenzije](app:developers/vscode) ili [Chrome ekstenzije](chrome:extension). Postavite kratak istek ili burn-after-read, pa pošaljite link beleške—ne plaintext—preko Slacka, emaila ili tiketa.",
        },
        {
          step: "Korak 3",
          title: "Instalirajte u pravi store",
          body: "Primalac kopira vrednost u gitignored lokalni `.env` (za development), password manager ili CI/cloud store tajni. Ne lepite je nazad u PR, chat thread ili deljeni dokument.",
        },
        {
          step: "Korak 4",
          title: "Rotirajte kada je posao gotov",
          body: "Opovucite contractor ključeve, rotirajte posle incidenta i zamenite svaki kredencijal koji se ikad pojavio u logovima, Git-u ili tiketu. Pogodnost bez rotacije je samo odloženi odgovor na incident.",
        },
      ],
      midCta: {
        body: "Treba da date nekome CI token ili nekoliko .env linija odmah? Pošaljite client-side enkriptovanu one-time belešku umesto da commitujete ili lepite plaintext.",
        button: "Kreiraj privatnu belešku",
      },
    },
    {
      title: "Delite odatle gde već radite",
      paragraphs: [
        "Ne morate da napuštate terminal, editor ili browser tab da biste kreirali client-side enkriptovanu one-time belešku. Izaberite PrivateNote površinu koja odgovara trenutku—enkripcija se uvek dešava lokalno na vašem uređaju pre upload-a. Za potpuniji vodič, vidite [PrivateNote za developere](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Čitajte iz fajla ili pipe-ujte stdin da tajna nikad ne sedi u shell istoriji kao `echo` argument: `npx privatenote-cli --expire 1h --output-url-only .env.local` ili `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Korisno u shell workflowima, skriptama i brzim terminal predajama. Setup i flagovi: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code i Cursor",
          paragraphs: [
            "Instalirajte [VS Code / Cursor ekstenziju](app:developers/vscode), pa enkriptujte iz sidebara, selekcije u editoru ili context menija—idealno kada je tajna već na ekranu u `.env` ili config fajlu i nikad ne treba da stigne u Slack kao plaintext.",
          ],
        },
        {
          title: "Chrome ekstenzija",
          paragraphs: [
            "Kada se kredencijal pojavi u emailu, dokumentima ili tiketu, [Chrome ekstenzija](chrome:extension) pretvara selektovan tekst u browser-enkriptovanu one-time belešku bez napuštanja taba.",
          ],
        },
      ],
    },
    {
      title: "Developer checklist pre svakog push-a i izmene pipeline-a",
      useCaseTable: {
        headers: ["Checkpoint", "Šta proveriti"],
        rows: [
          [
            "Pre git commit-a",
            "`.env`, `*.pem`, `credentials.json` i lokalni fajlovi tajni su gitignored; `git status` ne pokazuje iznenađujuće dodatke",
          ],
          [
            "Pre otvaranja PR-a",
            "Nema ključeva u opisu, screenshotima, fixture-ima ili „privremenim“ debug fajlovima",
          ],
          [
            "Pre uređivanja workflowa",
            "Tajne dolaze iz native mehanizma tajni platforme ili OIDC/workload identity—ne iz hardkodovanog YAML-a",
          ],
          [
            "Pre debagovanja CI-ja",
            "Nema `env`, `printenv` ili verbose dumpova koji bi mogli da upišu tajne u logove",
          ],
          [
            "Posle bilo koje ekspozicije",
            "Prvo rotirajte, zatim očistite istoriju/branch-eve; tretirajte skenere kao okidače incidenta",
          ],
        ],
      },
      callout:
        "Dodajte secret scanning na podrazumevani put: pre-commit hook-ovi (gitleaks), CI skeniranje i GitHub Secret Scanning / push protection. Prevencija pobedi herojska prepisivanja istorije.",
    },
    {
      title: "Šta uraditi ako je tajna već u GitHub-u",
      paragraphs: [
        "Postupite ovim redosledom: **rotirajte ili opovucite** kredencijal kod providera, **invalidirajte** zavisne sesije ili webhook-ove, **uklonite** tajnu sa default branch-a, pa odlučite da li je prepisivanje istorije potrebno zbog compliance-a ili javne ekspozicije. Čak i posle prepisa, pretpostavite da fork-ovi, mirror-i, keševi i clone-ovi i dalje mogu držati kopije dok se to ne reši posebno.",
        "Obavestite vlasnike svih sistema do kojih bi ključ mogao da dođe. Proverite cloud billing, access logove i neuobičajenu API upotrebu. Ako je tajna takođe nalepljena u Slack ili email, pretpostavite da te arhive i dalje sadrže—vidite [zašto je email najgore mesto za tajne](blog:why-email-is-worst-for-secrets) i [tajne koje nikad ne treba slati u chat](blog:secrets-never-send-in-chat).",
        "Za izuzetno vredne tajne poput crypto seed phrase-ova, izbegavajte prenos kad god je moguće. Za druge nezamenjive root kredencijale uopšte ih ne kucajte u website—prvo enkriptujte lokalno i delite samo ciphertext kada morate. Taj model je pokriven u našem [vodiču za crypto seed phrase](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li je privatni GitHub repo dovoljno bezbedan za .env fajlove?",
          answer:
            "Ne. Privatni repozitorijum značajno ograničava ekspoziciju, ali i dalje nije odgovarajući store tajni. Promene pristupa, kompromitovani nalozi, clone-ovi, backup-i i third-party integracije mogu sve vratiti istorijski plaintext. Držite tajne potpuno van Git-a.",
        },
        {
          question: "Da li su GitHub Actions secrets dovoljni?",
          answer:
            "To je pravo mesto za mnoge CI runtime vrednosti—daleko bolje od YAML-a ili fajlova u repou. I dalje ne rešavaju ljudsku isporuku, curenje logova, preširoke dozvole, rizike fork PR-ova niti ekspoziciju kroz zlonamerne workflow korake i kompromitovane zavisnosti. Kombinujte native mehanizam tajni platforme sa least privilege, pažljivim logovanjem i po mogućnosti kratkotrajnim kredencijalima preko OIDC ili workload identity.",
        },
        {
          question: "Da li treba da commitujem redigovan .env.example?",
          answer:
            "Da. Commitujte samo imena promenljivih i dummy placeholdere. Nikad stvarne vrednosti, „skoro stvarne“ staging ključeve ili produkcione connection stringove sa uklonjenom lozinkom ali intaktnim hostom i username-om ako je ta kombinacija osetljiva u vašem threat modelu.",
        },
        {
          question: "Da li je lokalni .env fajl u redu?",
          answer:
            "Za lokalni development, da—kada je pravilno gitignored i nikad commitovan. Osetljive produkcione tajne idealno ne bi trebalo da žive neograničeno u plaintext `.env` fajlovima na developer mašinama; koristite password manager, kratkotrajni pristup ili secrets manager gde je praktično.",
        },
        {
          question: "Može li PrivateNote zameniti Vault ili GitHub secrets?",
          answer:
            "Ne. PrivateNote je za bezbednu isporuku od čoveka do čoveka. Koristite native mehanizam tajni CI platforme i namenske secrets managere za automatizaciju. Koristite PrivateNote kada osoba treba da primi ključ, token ili .env isečak bez ostavljanja plainteksta u Slacku, emailu ili GitHub-u.",
        },
        {
          question: "Šta je najbrža bezbedna predaja za CI token?",
          answer:
            "Kreirajte usko scoped token, isporučite ga preko client-side enkriptovane one-time beleške (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) ili [Chrome](chrome:extension)), neka primalac ga sačuva u CI store-u tajni ili password manageru, pa opovucite token kada je posao gotov.",
        },
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "GitHub i CI/CD su odlični u čuvanju rada. Upravo zato su loša mesta za čuvanje tajni.",
        "Držite `.env` fajlove lokalno, gitignored i ograničene na development gde možete. Stavite kredencijale automatizacije u native CI tajne, secrets manager ili kratkotrajne OIDC kredencijale. Kada čovek treba vrednost, koristite client-side enkriptovanu one-time belešku—zatim rotirajte.",
        "Ako vaš tim i dalje lepi ključeve u PR-ove ili commituje „samo staging“ kredencijale, počnite sa [workflow-om deljenja API ključeva](blog:how-to-share-api-key-securely) i checklistom iznad. Za materijal pristupa serveru koristite [kako bezbedno deliti SSH ključeve](blog:how-to-share-ssh-keys-securely). Uvezite [CLI](app:developers/cli), [VS Code ekstenziju](app:developers/vscode) ili [Chrome ekstenziju](chrome:extension) u put najmanjeg otpora tako da bezbedna opcija bude i brza.",
      ],
    },
  ],
  ctaTitle: "Podelite tajnu—ne trajnu kopiju",
  ctaBody:
    "Enkriptujte CI token ili .env isečak lokalno sa PrivateNote—preko web aplikacije, CLI, VS Code / Cursor ili Chrome ekstenzije—pre nego što stigne u chat ili Git. Koristite kratak istek ili burn-after-read, pošaljite one-time link beleške umesto plainteksta i držite Git i pipeline istoriju bez live kredencijala.",
  ctaButton: "Kreiraj privatnu belešku",
};
