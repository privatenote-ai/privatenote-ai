import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyHr: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Programer koji radi za stolom s laptopom otvorenim na kodu—gdje predaje SSH ključeva često počinju",
  heroCaption:
    "Privatni SSH ključevi spadaju u enkriptirane, kratkotrajne predaje—ne u Slack, e-mail ili git povijest. Slika: programerski radni stol putem Pixabaya.",
  intro: [
    "Kolegi je potreban pristup staging poslužitelju. Izvođaču je potreban deploy key za vikend. Nekome je laptop prestao raditi, a jedini preostali pristup je privatni ključ na vašem računalu.",
    "Najbrži put je obično ista loša navika: zalijepiti PEM blok u Slack, poslati ga e-poštom „samo ovaj put“, ili ga ostaviti u tiketu. Ta poruka se sinkronizira na telefone, završava u indeksima za pretraživanje, i može ostati u sigurnosnim kopijama dugo nakon što je hitna situacija prošla.",
    "Privatni SSH ključevi su tajne s velikim radijusom štete. Jedan procureni ključ može značiti potpuni shell pristup. Ovaj vodič objašnjava kada uopće treba dijeliti privatni ključ, što nikad ne treba zalijepiti u chat, i kako ga predati putem enkriptiranog linka koji se briše nakon čitanja (burn-after-reading)—plus PrivateNote ekstenzije za developere koje čine sigurni put i brzim putem.",
  ],
  sections: [
    {
      title: "Javni ključ naspram privatnog ključa (30 sekundi jasnoće)",
      paragraphs: [
        "SSH par ključeva ima dvije polovice. **Javni** ključ namijenjen je dijeljenju: dodajete ga u `~/.ssh/authorized_keys`, cloud konzolu, ili GitHub deploy key. Slanje nečijeg javnog ključa u chatu je normalno.",
        "**Privatni** ključ (`id_ed25519`, `id_rsa`, datoteka `.pem`) je tajna. Tko god ga posjeduje može se autenticirati kao ta identičnost sve dok ne opozovete pristup. Tretirajte ga kao lozinku koja otključava poslužitelj—jer to je točno to.",
        "Ako vam instinkt govori „moramo dijeliti privatni ključ“, zastanite. U mnogim slučajevima trebali biste umjesto toga dijeliti **javni** ključ: primatelj lokalno generira svoj par, a vi autorizirate njegov javni ključ na hostu.",
      ],
      calloutTitle: "Pravilo palca",
      callout:
        "Bolje je dodati njihov javni ključ nego slati svoj privatni ključ. Predaje privatnog ključa su za hitne slučajeve (break-glass) i legacy situacije—ne za standardni onboarding.",
    },
    {
      title: "Bolje je ne dijeliti privatni ključ",
      paragraphs: [
        "Prije nego što bilo što enkriptirate i pošaljete, pitajte se treba li privatni ključ uopće premjestiti:",
      ],
      subsections: [
        {
          title: "Dodajte njihov javni ključ",
          paragraphs: [
            "Neka pokrenu `ssh-keygen`, pošalju vam `.pub` datoteku (sigurno u chatu), i dodaju je u `authorized_keys` ili SSH postavke pružatelja usluge. Oni čuvaju privatnu polovicu; vi je nikad ne vidite.",
          ],
        },
        {
          title: "Koristite namjenski deploy key",
          paragraphs: [
            "Za CI ili jedan repozitorij, izradite namjenski deploy key s minimalnim opsegom. Izbjegavajte ponovnu upotrebu osobnog laptop ključa na više sustava.",
          ],
        },
        {
          title: "Preferirajte kratkotrajan pristup",
          paragraphs: [
            "Gdje vaš stack to podržava—SSH certifikati, bastion/jump host poslužitelji, Tailscale SSH, cloud IAM uloge—preferirajte vremenski ograničen pristup umjesto kopiranja dugotrajnih privatnih ključeva.",
          ],
        },
        {
          title: "Kada je predaja privatnog ključa opravdana",
          paragraphs: [
            "Hitni pristup (break-glass) kod oporavka, legacy host koji ne može brzo registrirati nove ključeve, ili hitna situacija u kojoj postoji samo jedan ključ zaštićen passphraseom. I tada: enkriptirajte prijenos, držite kratak istek, potvrdite prijem, zatim rotirajte ili opozovite.",
          ],
        },
      ],
    },
    {
      title: "Gdje SSH ključevi umiru u praksi",
      paragraphs: [
        "Isti kanali koji propuštaju [API ključeve](blog:how-to-share-api-key-securely) i [lozinke](blog:how-to-share-a-password-securely) propuštaju i SSH materijal—često s gorim posljedicama.",
      ],
      comparisonTable: {
        headers: ["Kanal", "Zašto ne uspijeva", "Što napadači dobivaju"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Pretraživa povijest, sinkronizacija uređaja, izvozi radnog prostora",
            "Kompletan privatni ključ u čistom tekstu, zauvijek",
          ],
          [
            "E-pošta",
            "Pretinci, arhive, mobilna sinkronizacija, prosljeđivanja",
            "Trajna kopija koju ne možete pouzdano obrisati",
          ],
          [
            "Tiketi i dokumenti",
            "Jira, Notion, Confluence, GitHub issuei",
            "Ključevi u sigurnosnim kopijama, AI pretraživanju i audit tragovima",
          ],
          [
            "Git repozitoriji",
            "Povijest ostaje; „obriši i pushaj“ ne briše ništa",
            "Skeneri pronalaze PEM datoteke u minutama na javnim repozitorijima",
          ],
        ],
        after: [
          "Ako se tajna već pojavila u chatu ili gitu, pretpostavite da je izgorjela. Opozovite ključ, generirajte novi par, i isporučite zamjenu putem [jednokratnog enkriptiranog linka](blog:one-time-secret-links)—ne novim lijepljenjem. Za curenja pipelinea i `.env` datoteka, pogledajte [tajne u CI/CD-u i GitHubu](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Sigurnija predaja privatnog SSH ključa",
      paragraphs: [
        "Kada morate premjestiti privatni ključ, tretirajte prijenos kao privremenu isporuku—ne kao pohranu. Isti obrazac koji se koristi za lozinke i API ključeve primjenjuje se: enkriptirajte lokalno, pošaljite link, izbrišite nakon čitanja, zatim rotirajte.",
        "PrivateNote enkriptira u pregledniku (ili u vašem editoru/CLI-u) s AES-256-GCM prije nego bilo što stigne do mreže. Ključ za dešifriranje živi samo u URL fragmentu—dijelu `#…` koji preglednici nikad ne šalju poslužiteljima. Detalji: [što enkripcija od kraja do kraja znači ovdje](blog:what-is-end-to-end-encryption) i [kako napraviti privatnu bilješku](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Praktičan radni tijek za hitne slučajeve (break-glass):",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Ograničite i zaštitite ključ",
          body: "Preferirajte namjenski ključ za ovaj host ili zadatak. Koristite passphrase na privatnom ključu. Izbjegavajte slanje svog svakodnevnog osobnog identitetskog ključa ako je dovoljan uži ključ.",
        },
        {
          step: "Korak 2",
          title: "Enkriptirajte lokalno",
          body: "Zalijepite samo materijal ključa (ne roman od hostnameova i korisničkih imena) u PrivateNote putem [web aplikacije](app:home), [VS Code / Cursor ekstenzije](app:developers/vscode), [CLI-a](app:developers/cli), ili [Chrome ekstenzije](chrome:extension).",
        },
        {
          step: "Korak 3",
          title: "Pošaljite link—ne PEM",
          body: "Podijelite enkriptirani link u Slacku ili e-poštom. Opcionalno aktivirajte omatanje passphraseom i pošaljite tu passphrase preko odvojenog kanala ([savjet za odvojene kanale](blog:how-to-share-a-password-securely)). Preferirajte istek od 15 minuta ili 1 sat i brisanje nakon čitanja.",
        },
        {
          step: "Korak 4",
          title: "Potvrdite, zatim rotirajte",
          body: "Primatelj instalira ključ s ispravnim dozvolama (`chmod 600`), potvrđuje prijavu, zatim vi opozivate stari ključ ili ga rotirate. Tretirajte svaki ključ koji je bio u AI promptu kao viđen—rotirajte ga.",
        },
      ],
      midCta: {
        body: "Trebate predati SSH ključ sada? Kreirajte enkriptiranu jednokratnu bilješku i pošaljite link umjesto privatnog ključa.",
        button: "Kreiraj privatnu bilješku",
      },
    },
    {
      title: "Ekstenzije za developere: dijelite SSH ključeve odakle radite",
      paragraphs: [
        "Predaje ne uspijevaju kada je sigurni alat tri klika dalje od Slacka. PrivateNote integracije čuvaju enkripciju u vašem editoru, pregledniku, terminalu ili agent workflowu. Kompletan pregled: [PrivateNote za developere](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Vaša situacija", "Najbolji put"],
        rows: [
          [
            "Ključ je već otvoren u editoru",
            "VS Code / Cursor / Codex IDE ekstenzija — odaberi → podijeli kao PrivateNote",
          ],
          [
            "Ključ je na web stranici ili tiketu",
            "Chrome ekstenzija — označi → Kreiraj PrivateNote",
          ],
          [
            "Nalazite se u terminalu",
            "CLI — pipe-ajte datoteku da PEM nikad ne bude u shell povijesti",
          ],
          [
            "Želite da agent generira link",
            "MCP poslužitelj — zatim rotirajte; preferirajte editor ekstenziju za privatne ključeve",
          ],
          [
            "Primatelj nije tehnički potkovan",
            "Link web aplikacije na privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor i Codex IDE",
          paragraphs: [
            "Instalirajte iz marketplacea (`PrivateNote.privatenote-vscode`), odaberite blok ključa, i koristite **Share as PrivateNote**—ili otvorite composer u sidebaru. Enkripcija se izvršava u host procesu editora, tako da čisti tekst nikad ne mora ući u AI chat. Postavljanje: [VS Code / Cursor ekstenzija](app:developers/vscode).",
          ],
        },
        {
          title: "Chrome ekstenzija",
          paragraphs: [
            "Kad se ključ pojavi u tiketu, stranici dokumentacije ili admin konzoli, označite ga i kreirajte enkriptiranu bilješku bez prethodnog kopiranja u Slack. Instalacija: [Chrome ekstenzija](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Pipe-ajte iz datoteke tako da tajna ne bude `echo` argument u shell povijesti: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Dokumentacija: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "MCP za Cursor, Claude i Codex",
          paragraphs: [
            "Agenti mogu pozvati `create_private_note` nakon što instalirate [privatenote-mcp](app:developers/mcp). Korisno za orkestraciju—ali ako zalijepite privatni ključ u agent prompt, pružatelj modela ga možda vidi prije enkripcije. Za privatne SSH ključeve preferirajte editor ili Chrome ekstenziju. Postavljanje specifično za Codex: [PrivateNote s Codexom](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Iskrena napomena",
      callout:
        "MCP enkriptira nakon što agent pročita prompt. Trajna izloženost u chatu/e-pošti nestaje; vidljivost AI pružatelja ne. Za privatne ključeve koristite VS Code ili Chrome ekstenziju tako da čisti tekst nikad ne napusti vaše računalo prije nego što već bude šifrirani tekst.",
    },
    {
      title: "Najbolje prakse i zamke",
      subsections: [
        {
          title: "Nikad ne commitajte privatne ključeve",
          paragraphs: [
            "Držite `id_*` i `*.pem` izvan repozitorija. Dodajte ih u `.gitignore`. Ako je ključ dospio u git povijest, rotirajte ga—prepisivanje povijesti više nije dovoljno kad je repozitorij jednom kloniran ili skeniran.",
          ],
        },
        {
          title: "Ispravite dozvole datoteka",
          paragraphs: [
            "Privatni ključevi trebali bi imati `chmod 600` (ili `400`). SSH će na mnogim sustavima odbiti previše dopuštene datoteke ključeva—a ključevi koje svi mogu čitati na zajedničkim računalima su gol u svoju mrežu.",
          ],
        },
        {
          title: "Ne stavljajte kontekst unutar bilješke",
          paragraphs: [
            "Stavite samo materijal ključa u enkriptiranu bilješku. Pošaljite hostname, korisničko ime i port u zasebnoj poruci. Ako link procuri, napadač ne bi trebao dodatno dobiti i oznakovanu kartu onoga što otključava.",
          ],
        },
        {
          title: "Passphrase i odvojeni kanali",
          paragraphs: [
            "Zaštitite passphraseom samu datoteku ključa, i opcionalno omotajte PrivateNote sa zasebnom passphrase poslanom preko drugog kanala. Isti savjet kao za [sigurno dijeljenje lozinke](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Prosljeđivanje agenta nije strategija dijeljenja",
          paragraphs: [
            "SSH agent forwarding može smanjiti kopije ključeva na udaljenim hostovima, ali nije zamjena za pažljivu distribuciju ključeva—i proširuje povjerenje na svaki hop kroz koji prosljeđujete. Koristite ga namjerno, ne kao izgovor za slanje PEM datoteka e-poštom.",
          ],
        },
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Je li sigurno slati javni ključ u Slacku?",
          answer:
            "Da. Javni ključevi namijenjeni su distribuciji. Ipak izbjegavajte izbacivanje čitavih `~/.ssh` mapa—ljudi nenamjerno uključe privatne datoteke.",
        },
        {
          question: "Mogu li staviti privatni SSH ključ u upravitelja lozinki?",
          answer:
            "Za dugoročno čuvanje ključeva koje zadržavate, upravitelj lozinki ili agent podržan hardverom je adekvatan. Koristite jednokratni enkriptirani link za trenutak predaje od čovjeka do čovjeka—zatim primatelj pravilno pohranjuje ključ. PrivateNote je isporuka, ne trezor tajni.",
        },
        {
          question: "Trebam li dijeliti ključ i passphrase zajedno?",
          answer:
            "Ne. To ponovno stvara jednu točku kvara. Pošaljite enkriptirani link na jednom kanalu, a bilo koju passphrase na drugom—ili neka primatelj postavi svoju passphrase nakon instalacije i rotira je.",
        },
        {
          question: "Koji istek trebam koristiti?",
          answer:
            "Za koordinaciju u stvarnom vremenu, 15 minuta s brisanjem nakon čitanja. Za asinkrone predaje izvođačima, najviše 1 sat ili 1 dan. Preferirajte kraće kad god je primatelj dostupan.",
        },
        {
          question: "Je li PrivateNote zamjena za Vault ili cloud upravitelje tajni?",
          answer:
            "Ne. Koristite Vault, AWS Secrets Manager i slične alate za pohranu i injekciju stroj-stroj. Koristite PrivateNote za trenutak čovjek-čovjek kad ključ mora prijeći chat ili e-poštu bez da postane trajna arhiva. Ista razlika kao u [vodiču za API ključeve](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Zaključne misli",
      paragraphs: [
        "Većina SSH problema „dijeljenja“ su zapravo problemi registracije: dodajte javni ključ, koristite deploy key, ili izdajte kratkotrajan pristup. Kad privatni ključ mora premjestiti, ne ostavljajte ga u [povijesti chata](blog:secrets-never-send-in-chat) ili [e-pošti](blog:why-email-is-worst-for-secrets).",
        "Enkriptirajte lokalno, pošaljite link koji se sam briše, potvrdite instalaciju, zatim rotirajte. Povežite [alate za developere](app:developers) koje već koristite tako da sigurni put bude i put najmanjeg otpora.",
      ],
    },
  ],
  ctaTitle: "Dijelite link—ne privatni ključ",
  ctaBody:
    "Kreirajte PrivateNote enkriptiranu u pregledniku s kratkim istekom i brisanjem nakon čitanja. Ili enkriptirajte iz VS Code ekstenzije, CLI-a, ili Chrome ekstenzije tako da PEM nikad ne stigne u čistom tekstu u Slack.",
  ctaButton: "Kreiraj privatnu bilješku",
};
