import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelySr: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Programer koji radi za stolom sa laptopom otvorenim na kodu—gde predaje SSH ključeva često počinju",
  heroCaption:
    "Privatni SSH ključevi spadaju u enkriptovane, kratkotrajne predaje—ne u Slack, email ili git istoriju. Slika: programerski radni sto putem Pixabay-a.",
  intro: [
    "Kolegi je potreban pristup staging serveru. Izvođaču je potreban deploy key za vikend. Nekome je laptop prestao da radi, a jedini preostali pristup je privatni ključ na vašem računaru.",
    "Najbrži put je obično ista loša navika: nalepiti PEM blok u Slack, poslati ga email-om „samo ovaj put“, ili ga ostaviti u tiketu. Ta poruka se sinhronizuje na telefone, završava u indeksima za pretragu, i može ostati u rezervnim kopijama dugo nakon što je hitna situacija prošla.",
    "Privatni SSH ključevi su tajne sa velikim radijusom štete. Jedan procureli ključ može značiti potpuni shell pristup. Ovaj vodič objašnjava kada uopšte treba da deliš privatni ključ, šta nikad ne treba nalepiti u chat, i kako da ga predaš putem enkriptovanog linka koji se briše nakon čitanja (burn-after-reading)—plus PrivateNote ekstenzije za developere koje čine bezbedan put i brzim putem.",
  ],
  sections: [
    {
      title: "Javni ključ naspram privatnog ključa (30 sekundi jasnoće)",
      paragraphs: [
        "SSH par ključeva ima dve polovine. **Javni** ključ je namenjen deljenju: dodaješ ga u `~/.ssh/authorized_keys`, cloud konzolu, ili GitHub deploy key. Slanje nečijeg javnog ključa u chat-u je normalno.",
        "**Privatni** ključ (`id_ed25519`, `id_rsa`, fajl `.pem`) je tajna. Ko god ga poseduje može se autentifikovati kao ta identičnost sve dok ne opozovete pristup. Tretirajte ga kao lozinku koja otključava server—jer to je tačno to.",
        "Ako vam instinkt govori „moramo deliti privatni ključ“, zastanite. U mnogim slučajevima trebalo bi umesto toga da delite **javni** ključ: primalac lokalno generiše sopstveni par, a vi autorizujete njegov javni ključ na hostu.",
      ],
      calloutTitle: "Pravilo palca",
      callout:
        "Bolje je dodati njihov javni ključ nego slati svoj privatni ključ. Predaje privatnog ključa su za hitne slučajeve (break-glass) i legacy situacije—ne za standardni onboarding.",
    },
    {
      title: "Bolje je ne deliti privatni ključ",
      paragraphs: [
        "Pre nego što bilo šta enkriptujete i pošaljete, pitajte se da li privatni ključ uopšte mora da se pomeri:",
      ],
      subsections: [
        {
          title: "Dodajte njihov javni ključ",
          paragraphs: [
            "Neka pokrenu `ssh-keygen`, pošalju vam `.pub` fajl (bezbedno u chat-u), i dodaju ga u `authorized_keys` ili SSH podešavanja provajdera. Oni čuvaju privatnu polovinu; vi je nikad ne vidite.",
          ],
        },
        {
          title: "Koristite namenski deploy key",
          paragraphs: [
            "Za CI ili jedan repozitorijum, kreirajte namenski deploy key sa minimalnim opsegom. Izbegavajte ponovnu upotrebu ličnog laptop ključa na više sistema.",
          ],
        },
        {
          title: "Preferirajte kratkotrajan pristup",
          paragraphs: [
            "Gde vaš stack to podržava—SSH sertifikati, bastion/jump host serveri, Tailscale SSH, cloud IAM uloge—preferirajte vremenski ograničen pristup umesto kopiranja dugotrajnih privatnih ključeva.",
          ],
        },
        {
          title: "Kada je predaja privatnog ključa opravdana",
          paragraphs: [
            "Hitni pristup (break-glass) prilikom oporavka, legacy host koji ne može brzo registrovati nove ključeve, ili hitna situacija u kojoj postoji samo jedan ključ zaštićen passphrase-om. I tada: enkriptujte prenos, držite kratak istek, potvrdite prijem, zatim rotirajte ili opozovite.",
          ],
        },
      ],
    },
    {
      title: "Gde SSH ključevi umiru u praksi",
      paragraphs: [
        "Isti kanali koji propuštaju [API ključeve](blog:how-to-share-api-key-securely) i [lozinke](blog:how-to-share-a-password-securely) propuštaju i SSH materijal—često sa gorim posledicama.",
      ],
      comparisonTable: {
        headers: ["Kanal", "Zašto ne uspeva", "Šta napadači dobijaju"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Pretraživa istorija, sinhronizacija uređaja, izvozi radnog prostora",
            "Kompletan privatni ključ u čistom tekstu, zauvek",
          ],
          [
            "Email",
            "Sanduče, arhive, mobilna sinhronizacija, prosleđivanja",
            "Trajna kopija koju ne možete pouzdano obrisati",
          ],
          [
            "Tiketi i dokumenti",
            "Jira, Notion, Confluence, GitHub issuei",
            "Ključevi u rezervnim kopijama, AI pretrazi i audit tragovima",
          ],
          [
            "Git repozitorijumi",
            "Istorija ostaje; „obriši i push-uj“ ne briše ništa",
            "Skeneri pronalaze PEM fajlove u minutima na javnim repozitorijumima",
          ],
        ],
        after: [
          "Ako se tajna već pojavila u chat-u ili git-u, pretpostavite da je izgorela. Opozovite ključ, generišite novi par, i isporučite zamenu putem [jednokratnog enkriptovanog linka](blog:one-time-secret-links)—ne novim lepljenjem. Za curenja pipeline-a i `.env` fajlova, pogledajte [tajne u CI/CD i GitHub-u](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Bezbednija predaja privatnog SSH ključa",
      paragraphs: [
        "Kada morate premestiti privatni ključ, tretirajte prenos kao privremenu isporuku—ne kao skladištenje. Isti obrazac koji se koristi za lozinke i API ključeve se primenjuje: enkriptujte lokalno, pošaljite link, izbrišite nakon čitanja, zatim rotirajte.",
        "PrivateNote enkriptuje u pregledaču (ili u vašem editoru/CLI-ju) sa AES-256-GCM prije nego bilo šta stigne do mreže. Ključ za dešifrovanje živi samo u URL fragmentu—delu `#…` koji pregledači nikad ne šalju serverima. Detalji: [šta enkripcija od kraja do kraja znači ovde](blog:what-is-end-to-end-encryption) i [kako napraviti privatnu belešku](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Praktičan radni tok za hitne slučajeve (break-glass):",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Ograničite i zaštitite ključ",
          body: "Preferirajte namenski ključ za ovaj host ili zadatak. Koristite passphrase na privatnom ključu. Izbegavajte slanje svog svakodnevnog ličnog identitetskog ključa ako je dovoljan uži ključ.",
        },
        {
          step: "Korak 2",
          title: "Enkriptujte lokalno",
          body: "Nalepite samo materijal ključa (ne roman od hostnameova i korisničkih imena) u PrivateNote putem [veb aplikacije](app:home), [VS Code / Cursor ekstenzije](app:developers/vscode), [CLI-ja](app:developers/cli), ili [Chrome ekstenzije](chrome:extension).",
        },
        {
          step: "Korak 3",
          title: "Pošaljite link—ne PEM",
          body: "Podelite enkriptovani link u Slack-u ili email-om. Opciono aktivirajte umotavanje passphrase-om i pošaljite tu passphrase preko odvojenog kanala ([savet za odvojene kanale](blog:how-to-share-a-password-securely)). Preferirajte istek od 15 minuta ili 1 sat i brisanje nakon čitanja.",
        },
        {
          step: "Korak 4",
          title: "Potvrdite, zatim rotirajte",
          body: "Primalac instalira ključ sa ispravnim dozvolama (`chmod 600`), potvrđuje prijavu, zatim vi opozivate stari ključ ili ga rotirate. Tretirajte svaki ključ koji je bio u AI prompt-u kao viđen—rotirajte ga.",
        },
      ],
      midCta: {
        body: "Treba da predate SSH ključ sada? Kreirajte enkriptovanu jednokratnu belešku i pošaljite link umesto privatnog ključa.",
        button: "Kreiraj privatnu belešku",
      },
    },
    {
      title: "Ekstenzije za developere: delite SSH ključeve odakle radite",
      paragraphs: [
        "Predaje ne uspevaju kada je bezbedan alat tri klika dalje od Slack-a. PrivateNote integracije čuvaju enkripciju u vašem editoru, pregledaču, terminalu ili agent workflow-u. Kompletan pregled: [PrivateNote za developere](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Vaša situacija", "Najbolji put"],
        rows: [
          [
            "Ključ je već otvoren u editoru",
            "VS Code / Cursor / Codex IDE ekstenzija — selektuj → deli kao PrivateNote",
          ],
          [
            "Ključ je na veb stranici ili tiketu",
            "Chrome ekstenzija — obeleži → Kreiraj PrivateNote",
          ],
          [
            "Nalazite se u terminalu",
            "CLI — pipe-ujte fajl da PEM nikad ne bude u shell istoriji",
          ],
          [
            "Želite da agent generiše link",
            "MCP server — zatim rotirajte; preferirajte editor ekstenziju za privatne ključeve",
          ],
          [
            "Primalac nije tehnički potkovan",
            "Link veb aplikacije na privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor i Codex IDE",
          paragraphs: [
            "Instalirajte iz marketplace-a (`PrivateNote.privatenote-vscode`), selektujte blok ključa, i koristite **Share as PrivateNote**—ili otvorite composer u sidebar-u. Enkripcija se izvršava u host procesu editora, tako da čist tekst nikad ne mora da uđe u AI chat. Podešavanje: [VS Code / Cursor ekstenzija](app:developers/vscode).",
          ],
        },
        {
          title: "Chrome ekstenzija",
          paragraphs: [
            "Kada se ključ pojavi u tiketu, stranici dokumentacije ili admin konzoli, obeležite ga i kreirajte enkriptovanu belešku bez prethodnog kopiranja u Slack. Instalacija: [Chrome ekstenzija](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Pipe-ujte iz fajla tako da tajna ne bude `echo` argument u shell istoriji: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Dokumentacija: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "MCP za Cursor, Claude i Codex",
          paragraphs: [
            "Agenti mogu pozvati `create_private_note` nakon što instalirate [privatenote-mcp](app:developers/mcp). Korisno za orkestraciju—ali ako nalepite privatni ključ u agent prompt, provajder modela ga možda vidi pre enkripcije. Za privatne SSH ključeve, preferirajte editor ili Chrome ekstenziju. Podešavanje specifično za Codex: [PrivateNote sa Codex-om](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Iskrena napomena",
      callout:
        "MCP enkriptuje nakon što agent pročita prompt. Trajna izloženost u chat-u/email-u nestaje; vidljivost AI provajdera ne. Za privatne ključeve koristite VS Code ili Chrome ekstenziju tako da čist tekst nikad ne napusti vaš računar prije nego što već bude šifrovani tekst.",
    },
    {
      title: "Najbolje prakse i zamke",
      subsections: [
        {
          title: "Nikad ne commit-ujte privatne ključeve",
          paragraphs: [
            "Držite `id_*` i `*.pem` van repozitorijuma. Dodajte ih u `.gitignore`. Ako je ključ dospeo u git istoriju, rotirajte ga—prepisivanje istorije više nije dovoljno kada je repozitorijum jednom klonovan ili skeniran.",
          ],
        },
        {
          title: "Ispravite dozvole fajlova",
          paragraphs: [
            "Privatni ključevi bi trebalo da imaju `chmod 600` (ili `400`). SSH će na mnogim sistemima odbiti previše dozvoljene fajlove ključeva—a ključevi koje svi mogu čitati na deljenim računarima su gol u svoju mrežu.",
          ],
        },
        {
          title: "Ne stavljajte kontekst unutar beleške",
          paragraphs: [
            "Stavite samo materijal ključa u enkriptovanu belešku. Pošaljite hostname, korisničko ime i port u zasebnoj poruci. Ako link procuri, napadač ne bi trebalo dodatno da dobije i oznakovanu mapu onoga što otključava.",
          ],
        },
        {
          title: "Passphrase i odvojeni kanali",
          paragraphs: [
            "Zaštitite passphrase-om sam fajl ključa, i opciono umotajte PrivateNote sa zasebnom passphrase-om poslatom preko drugog kanala. Isti savet kao za [bezbedno deljenje lozinke](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Prosleđivanje agenta nije strategija deljenja",
          paragraphs: [
            "SSH agent forwarding može smanjiti kopije ključeva na udaljenim hostovima, ali nije zamena za pažljivu distribuciju ključeva—i proširuje poverenje na svaki hop kroz koji prosleđujete. Koristite ga namerno, ne kao izgovor za slanje PEM fajlova email-om.",
          ],
        },
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li je bezbedno slati javni ključ u Slack-u?",
          answer:
            "Da. Javni ključevi su namenjeni distribuciji. Ipak izbegavajte izbacivanje čitavih `~/.ssh` foldera—ljudi nenamerno uključe privatne fajlove.",
        },
        {
          question: "Mogu li staviti privatni SSH ključ u menadžer lozinki?",
          answer:
            "Za dugoročno čuvanje ključeva koje zadržavate, menadžer lozinki ili agent podržan hardverom je adekvatan. Koristite jednokratni enkriptovani link za trenutak predaje od čoveka do čoveka—zatim primalac pravilno skladišti ključ. PrivateNote je isporuka, ne trezor tajni.",
        },
        {
          question: "Da li treba da delim ključ i passphrase zajedno?",
          answer:
            "Ne. To ponovo stvara jednu tačku kvara. Pošaljite enkriptovani link na jednom kanalu, a bilo koju passphrase na drugom—ili neka primalac postavi svoju passphrase nakon instalacije i rotira je.",
        },
        {
          question: "Koji istek treba da koristim?",
          answer:
            "Za koordinaciju u realnom vremenu, 15 minuta sa brisanjem nakon čitanja. Za asinhrone predaje izvođačima, najviše 1 sat ili 1 dan. Preferirajte kraće kad god je primalac dostupan.",
        },
        {
          question: "Da li je PrivateNote zamena za Vault ili cloud upravljače tajni?",
          answer:
            "Ne. Koristite Vault, AWS Secrets Manager i slične alate za skladištenje i injekciju mašina-mašina. Koristite PrivateNote za trenutak čovek-čovek kada ključ mora preći chat ili email bez da postane trajna arhiva. Ista razlika kao u [vodiču za API ključeve](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Zaključne misli",
      paragraphs: [
        "Većina SSH problema „deljenja“ su u stvari problemi registracije: dodajte javni ključ, koristite deploy key, ili izdajte kratkotrajan pristup. Kada privatni ključ mora da se pomeri, ne ostavljajte ga u [istoriji chat-a](blog:secrets-never-send-in-chat) ili [email-u](blog:why-email-is-worst-for-secrets).",
        "Enkriptujte lokalno, pošaljite link koji se sam briše, potvrdite instalaciju, zatim rotirajte. Povežite [alate za developere](app:developers) koje već koristite tako da bezbedan put bude i put najmanjeg otpora.",
      ],
    },
  ],
  ctaTitle: "Delite link—ne privatni ključ",
  ctaBody:
    "Kreirajte PrivateNote enkriptovanu u pregledaču sa kratkim istekom i brisanjem nakon čitanja. Ili enkriptujte iz VS Code ekstenzije, CLI-ja, ili Chrome ekstenzije tako da PEM nikad ne stigne u čistom tekstu u Slack.",
  ctaButton: "Kreiraj privatnu belešku",
};
