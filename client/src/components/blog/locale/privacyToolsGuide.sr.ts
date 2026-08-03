import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideSr: PrivacyToolsGuideArticleCopy = {
  intro: [
    "Većina stranica o „najboljim alatima za privatnost“ su afilijacijski katalozi u maski. Rangiraju svaku kategoriju, zakopavaju kompromise i ostavljaju vas sa dvadeset tabova i bez sistema.",
    "Ovaj vodič je drugačiji. To je **okvir odlučivanja za 2026.** za sastavljanje privacy stack-a koji odgovara stvarnom životu: koji posao treba da obavite, koji podrazumevani izbor da uzmete, kada da uradite upgrade—i kada alat ima potpuno pogrešan oblik.",
    "PrivateNote.ai zauzima usko mesto—**jednokratne predaje tajni**. Sve ostalo ispod je kurirano mišljenje da sa ove stranice odete sa koherentnim stack-om, a zatim pregledate naš [direktorijum alata za privatnost](app:privacy-tools) za potpuni katalog.",
  ],
  sections: [
    {
      title: "Počnite od modela pretnje (ne od shopping liste)",
      paragraphs: [
        "Alati za privatnost pomažu samo ako odgovaraju onome od čega se branite. Freelancer koji deli Wi‑Fi kredencijale ima drugačiji problem od novinara pod ciljanim nadzorom. Izaberite najlakši stack koji pokriva *vaše* rizike—pa prestanite da skupljate alate iz sporta.",
      ],
      subsections: [
        {
          title: "Svakodnevna lična upotreba",
          paragraphs: [
            "Želite manje praćenja, manje katastrofa zbog ponovne upotrebe lozinki i tajne koje ne ostaju u četu. Ne pokušavate da nestanete pred državama. Fokusirajte se na menadžer lozinki, razumne podrazumevane postavke pregledača, šifrovanu poruku za osetljive četove i efemerne linkove za jednokratne kredencijale.",
          ],
        },
        {
          title: "Freelancer ili konsultant",
          paragraphs: [
            "Predajete tajne klijentima koji ne dele vaše aplikacije. Mejl i Slack postaju trajne arhive API ključeva i privremenih lozinki. Dodajte jednokratne šifrovane beleške i šifrovani prenos fajlova; dugotrajne kredencijale držite u trezoru, ne u nitima.",
          ],
        },
        {
          title: "Mali tim",
          paragraphs: [
            "Treba vam deljeni pristup koji se može opozvati, jasna pravila za ugovarače i manje oslanjanja na „samo pošalji u kanal“. Preferirajte deljenje preko menadžera lozinki za trajni pristup, jednokratne linkove za privremene predaje i pisane norme da pogodnost ne postane tiho politika.",
          ],
        },
      ],
      calloutTitle: "Praktično pravilo",
      callout:
        "Ako alat ne mapira na posao koji zaista radite nedeljno, preskočite ga. Minimalni stack koji koristite pobedi puristički stack koji napustite.",
    },
    {
      title: "Poslovi privatnosti, ne kategorije proizvoda",
      paragraphs: [
        "Kategorije (VPN, pregledač, messenger) podstiču sakupljanje logotipa. Poslovi forsiraju kompromise na videlo. Koristite ovu mapu za orijentaciju; odeljci ispod idu dublje.",
      ],
      comparisonTable: {
        headers: ["Posao", "Podrazumevani pristup", "Pogrešan alat za posao"],
        rows: [
          [
            "Čuvati dugotrajne lozinke",
            "Menadžer lozinki + jak generator",
            "Samo lozinke sačuvane u pregledaču, ili arhive četa",
          ],
          [
            "Predati nekome jednokratnu tajnu",
            "Beleška šifrovana u pregledaču koja ističe",
            "Mejl, Slack, SMS ili cloud folder „za sada“",
          ],
          [
            "Svakodnevni privatni čet",
            "Messenger sa end-to-end šifrovanjem",
            "SMS, ili „nestajuće“ poruke u aplikacijama koje i dalje zauvek arhiviraju metadate",
          ],
          [
            "Smanjiti trackere pri pregledanju",
            "Ojačan mainstream pregledač + blocker",
            "Instalirati pet konfliktnih ekstenzija za privatnost",
          ],
          [
            "Nepoverljive mreže",
            "No-logs VPN sa reputacijom",
            "Pretpostaviti da vas VPN čini anonimnim",
          ],
          [
            "Higijena protiv preuzimanja naloga",
            "Provera curenja + 2FA / passkeys",
            "Ponovo koristiti lozinke i nadati se",
          ],
        ],
        after: [
          "Za imena proizvoda, beleške o cenama i isključenja, držite [direktorijum alata za privatnost](app:privacy-tools) otvorenim pored ovog vodiča.",
        ],
      },
    },
    {
      title: "Posao: dugotrajne lozinke",
      paragraphs: [
        "Lozinke koje ćete mesecima ponovo koristiti pripadaju trezoru—ne mozgu, ne aplikaciji za beleške i ne jučerašnjoj Teams niti.",
      ],
      subsections: [
        {
          title: "Problem",
          paragraphs: [
            "Ponovna upotreba pretvara jedno curenje u mnoga. Slabe, zapamtljive lozinke padaju na offline cracking-u. Store-ovi pregledača pomažu, ali retko dostižu namenske menadžere u sync-u, deljenju i auditu.",
          ],
        },
        {
          title: "Podrazumevano + alternativa",
          paragraphs: [
            "**Podrazumevano:** [Bitwarden](https://bitwarden.com/) za većinu—open source, upotrebljiv free tier, solidan sync. **Alternativa:** [KeePassXC](https://keepassxc.org/) ako želite lokalni trezor bez cloud-a. **Kada je polish važniji od open source-a:** [1Password](https://1password.com/) je fer izbor; znajte da birate vlasničku pogodnost.",
          ],
        },
        {
          title: "Kada ne koristiti samo menadžer",
          paragraphs: [
            "Menadžeri sjaje u *skladištenju* i trajnom deljenom pristupu. Nespretni su kada primalac nema nalog, ili kada tajna treba da umre nakon jednog čitanja. To je drugi posao—vidite jednokratne tajne ispod. Generišite jake vrednosti lokalnim [generatorom lozinki](app:password-generator) pre nego što ih sačuvate ili podelite.",
          ],
        },
      ],
    },
    {
      title: "Posao: jednokratne tajne",
      paragraphs: [
        "Lozinke za ugovarače, kodovi za oporavak, API ključevi, Wi‑Fi za posetioca—sve što ne treba da postane pretraživa istorija.",
      ],
      subsections: [
        {
          title: "Problem",
          paragraphs: [
            "Mejl i čet šifruju u tranzitu, pa arhiviraju zauvek. Cloud folderi ostaju. Screenshot-ovi i backup-i uređaja šire radijus. Failure mode nije „neko sniff-uje liniju“—već „tajna je i dalje tu za šest meseci.“",
          ],
        },
        {
          title: "Podrazumevano",
          paragraphs: [
            "**Podrazumevano:** beleška šifrovana u pregledaču koja ističe, kao [PrivateNote.ai](app:home)—ciphertext na serveru, materijal za dešifrovanje u fragmentu linka, burn-after-reading ili kratak TTL. Za model, vidite [kako PrivateNote radi](app:how-it-works) i [zašto je mejl najgore mesto za tajne](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Kada ne koristiti",
          paragraphs: [
            "Ne zamenjujte menadžer lozinki ni dnevni messenger jednokratnim beleškama. Ne stavljajte dugotrajne dokumente ili tekuće razgovore u efemerne linkove. I ne šaljite link i opcionalnu prolaznu frazu istim kanalom ako je tajna visokog rizika—razdvojite kanale.",
          ],
        },
      ],
      midCta: {
        body: "Treba da predate lozinku ili API ključ sada? Šifrujte je u pregledaču i pošaljite link koji može da istekne nakon čitanja.",
        button: "Napravite privatnu belešku",
        href: "app:home",
      },
    },
    {
      title: "Posao: svakodnevno slanje poruka",
      paragraphs: [
        "Osetljivi razgovori trebaju end-to-end šifrovanje po podrazumevanom—ne prekidač zakopan u podešavanjima, i ne obećanje da „nestajuće“ poruke brišu serverske kopije koje ne možete da verifikujete.",
      ],
      subsections: [
        {
          title: "Podrazumevano + kompromis",
          paragraphs: [
            "**Podrazumevano:** [Signal](https://signal.org/) za mainstream bezbedan čet. **Kompromis koji treba glasno reći:** registracija zahteva broj telefona, što neki modeli pretnje visoke anonimnosti odbacuju. Za te slučajeve, gledajte van ovog starter vodiča—i i dalje tretirajte metadate (ko sa kim razgovara) kao preostali rizik na svakom messengeru.",
          ],
        },
        {
          title: "Kada ne koristiti čet za tajne",
          paragraphs: [
            "Čak i šifrovani messengeri čuvaju istoriju na uređajima. Nalepite produkcijsku lozinku u nit i napravili ste trajnu kopiju. Koristite čet za razgovor; koristite jednokratne beleške za kredencijale. Više o tom obrascu: [tajne koje nikad ne treba slati u četu](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Posao: mejl i razdvajanje identiteta",
      paragraphs: [
        "Mejl je javni sistem adresiranja sa privatnim nadama. Tretirajte šifrovanje sandučeta i aliasing kao kontrolu štete, ne magičnu nevidljivost.",
      ],
      subsections: [
        {
          title: "Podrazumevano",
          paragraphs: [
            "**Podrazumevano šifrovano sanduče:** [Proton Mail](https://proton.me/) ili [Tuta](https://tuta.com/) kada želite zero-access mejl za osetljivu prepisku. **Podrazumevani aliasing:** [Firefox Relay](https://relay.firefox.com/) za lagano maskiranje, ili [SimpleLogin](https://simplelogin.io/) kada treba custom domeni i oštrije razdvajanje identiteta.",
          ],
        },
        {
          title: "Kada se ne oslanjati na mejl",
          paragraphs: [
            "Šifrovani mejl i dalje ostavlja zaglavlja, navike prosleđivanja i dugo zadržavanje. Nikad ne stavljajte aktivne kredencijale u telo „samo ovaj put“. Ako je payload predaja tajne, koristite jednokratnu belešku i u mejl stavite samo kontekst.",
          ],
        },
      ],
    },
    {
      title: "Posao: pregledanje sa manje praćenja",
      paragraphs: [
        "U 2026. borba je manje o „tajnom režimu“, a više o fingerprinting-u, cross-site praćenju i ekstenzijama koje obećavaju privatnost dok dodaju površinu napada.",
      ],
      subsections: [
        {
          title: "Podrazumevani stack",
          paragraphs: [
            "**Podrazumevano:** [Firefox](https://www.mozilla.org/) sa strogom zaštitom od praćenja plus [uBlock Origin](https://ublockorigin.com/). **Chromium-oblična alternativa:** [Brave](https://brave.com/) ako vam treba kompatibilnost ekstenzija—znajte da je zajednica podeljena oko njegove rewards/crypto površine. **Pretraga:** [DuckDuckGo](https://duckduckgo.com/) (ili slična neprofilišuća pretraga) da vaši upiti ne budu feed reklamnog profila.",
          ],
        },
        {
          title: "Kada je Tor pravi upgrade",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) je standard za jaču anonimnost i otpornost na cenzuru. Takođe je sporiji i pun CAPTCHA-a. Koristite ga kada model pretnje to zahteva—ne kao svakodnevni bankarski pregledač.",
          ],
        },
      ],
    },
    {
      title: "Posao: nepoverljive mreže (VPN reality check)",
      paragraphs: [
        "VPN šifruje put između vas i VPN provajdera. Sakriva vaš IP od sajtova koje posećujete. **Ne** čini vas anonimnim, ne šifruje logove destinacije i ne popravlja slabu lozinku.",
      ],
      subsections: [
        {
          title: "Podrazumevano što smo spremni da imenujemo",
          paragraphs: [
            "Preferirajte provajdere sa javnim track record-om, jasnom jurisdikcijskom pričom i auditovanim no-logs tvrdnjama—obično [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) ili [IVPN](https://www.ivpn.net/). Platite proizvod; free VPN poslovni modeli često jesu proizvod.",
          ],
        },
        {
          title: "Kada ne treba da se mučite",
          paragraphs: [
            "Na mreži kojoj već verujete, sa HTTPS-om svuda, VPN je opciona higijena—ne moralna dužnost. Preskočite sumnjive „military-grade“ brendove i sve što vodi influencer kodovima umesto inženjerskog detalja. Beleške o isključenju u našem direktorijumu pokrivaju uobičajene „privacy-washed“ izbore.",
          ],
        },
      ],
    },
    {
      title: "Posao: curenja, 2FA i passkeys",
      paragraphs: [
        "Higijena naloga je neugledna polovina privatnosti. Većina ličnih katastrofa su credential stuffing i SIM-swap-slični neuspesi, ne egzotični malware.",
      ],
      subsections: [
        {
          title: "Praktična podrazumevana",
          paragraphs: [
            "Proverite adrese na [Have I Been Pwned](https://haveibeenpwned.com/). Uključite faktore otporne na phishing gde možete—passkeys ili hardverski ključevi kao [YubiKey](https://www.yubico.com/) pobeduju SMS OTP. Koristite [2FA Directory](https://2fa.directory/) da vidite koji servisi i dalje tretiraju drugi faktor kao opcioni teatar.",
          ],
        },
        {
          title: "Napomena 2026. o passwordless-u",
          paragraphs: [
            "Passkeys smanjuju phishing i ponovnu upotrebu lozinki, ali oporavak i lock-in preko ekosistema su stvarni. Držite priču o oporavku (hardverski ključ, dokumentovan proces) pre nego što obrišete svaku lozinku. Menadžeri lozinki ostaju korisni za dugi rep sajtova koji još nisu stigli.",
          ],
        },
      ],
    },
    {
      title: "Šta se promenilo 2026. (komentar vredan čuvanja)",
      bullets: [
        "**AI čet je nova arhiva.** Lepljenje tajni u asistente stvara pitanja zadržavanja i rizika treniranja koja vaš model pretnje iz 2019. nikad nije uključivao. Tretirajte promptove kao tela mejlova.",
        "**Fingerprinting je prestigao cookie banere.** Blokiranje third-party kolačića pomaže; izbor pregledača, blokiranje trackera i manje ekstenzija i dalje više znače nego prihvatanje svakog „legitimate interest“ prekidača.",
        "**Passkeys ulaze u mainstream.** Preferirajte ih na nalozima visoke vrednosti; ne pravite se da ih već podržava svaki sajt.",
        "**VPN marketing je postao glasniji, ne mudriji.** Jurisdikcijski teatar i afilijacijski leaderboard-ovi nisu auditi. Birajte dosadne, dokumentovane provajdere—ili nijednog.",
        "**Efemerne deljenje je još nišno—i još neophodno.** Aplikacije za saradnju optimizovane za pretragu čine alate za jednokratne tajne vrednijim, ne manje.",
      ],
    },
    {
      title: "Minimalni starter kit (za većinu ljudi)",
      paragraphs: [
        "Ako radite samo sedam stvari, uradite ove. Sve ostalo je opciona dubina.",
      ],
      useCaseTable: {
        headers: ["Mesto", "Izbor"],
        rows: [
          ["Trezor lozinki", "Bitwarden (ili KeePassXC ako odbijate cloud)"],
          ["Kreiranje lozinki", "Lokalni generator—zatim sačuvajte u trezoru"],
          ["Jednokratne tajne", "PrivateNote.ai (ili ekvivalentna beleška šifrovana u pregledaču)"],
          ["Privatni čet", "Signal"],
          ["Pregledač + blocker", "Firefox + uBlock Origin"],
          ["Higijena curenja / 2FA", "Have I Been Pwned + passkeys ili app/hardverski 2FA"],
          ["Putovanja / Wi‑Fi u kafiću", "Mullvad, Proton VPN ili IVPN—kada je mreža rizik"],
        ],
      },
      callout:
        "Napredni dodaci (Tor svakodnevno, full-disk ritualizam, anonimne mejl mreže) su validni—ali tek nakon što starter kit postane navika.",
    },
    {
      title: "Šta isključujemo—i zašto",
      paragraphs: [
        "Kuriranje je uglavnom reći ne. Nekoliko obrazaca koje odbijamo da ublažimo:",
      ],
      subsections: [
        {
          title: "VPN-ovi teatra privatnosti",
          paragraphs: [
            "Free tier-ovi finansirani nejasnim praksama podataka, lažni „audit“ bedževi i leaderboard SEO. Ako je pitch strah plus kod za popust, otiđite.",
          ],
        },
        {
          title: "Messengeri koji selektivno reklamiraju šifrovanje",
          paragraphs: [
            "Cloud po podrazumevanom, opcioni E2EE ili režimi „tajnog četa“ koji trenuju korisnike da lepe tajne u nesiguran default. Radije preporučujemo jedan pošten default nego pet režima koje ljudi zloupotrebljavaju. Cloud-ovi u stilu Telegrama i WhatsApp-ove realnosti metapodataka/backup-a naznačene su u našim [isključenjima direktorijuma](app:privacy-tools).",
          ],
        },
        {
          title: "Sve što treba da kupi našu preporuku",
          paragraphs: [
            "Ovaj vodič i direktorijum nisu afilijacijska lista. Ne zarađujemo ništa ako kliknete. To nas ne čini sveznajućim—znači da podsticaji tiho ne upravljaju shortlist-om.",
          ],
        },
      ],
    },
    {
      title: "Gde dalje",
      paragraphs: [
        "Koristite ovaj članak kao sloj odlučivanja. Koristite direktorijum kao živi katalog—kategorije, nijanse i linkove koje držimo pregledanim.",
      ],
      bullets: [
        "[Direktorijum alata za privatnost](app:privacy-tools) — kuriran katalog po kategoriji",
        "[Kako bezbedno podeliti lozinku](blog:how-to-share-a-password-securely) — playbook predaje",
        "[Pošaljite tajnu bez naloga](blog:send-secret-message-without-account) — nije potrebna zajednička aplikacija",
        "[Resursi bezbednosti](app:security-resources) — šire čitanje na PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — kontekst politike i prava",
        "[Privacy Guides](https://www.privacyguides.org/) — dublje preporuke koje održava zajednica",
      ],
      midCta: {
        body: "Spremni da pregledate potpuni shortlist sa beleškama kategorija i isključenjima?",
        button: "Otvorite direktorijum alata za privatnost",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li je ovo isto što i vaš direktorijum alata za privatnost?",
          answer:
            "Ne. Ovaj post je vodič 2026. kako birati. [Direktorijum](app:privacy-tools) je kurirani katalog. Pročitajte vodič da odlučite; koristite direktorijum da izaberete konkretne alate.",
        },
        {
          question: "Mogu li da jurim rangiranje svake kategorije privatnosti?",
          answer:
            "Možete, ali nećete izdržati. Starter kit od sedam mesta koji stvarno koristite pobedi hram od trideset alata koji konfigurišete jednom.",
        },
        {
          question: "Gde se uklapa PrivateNote.ai?",
          answer:
            "Samo u posao jednokratnih tajni—kredencijali i uputstva koja treba da isteknu. Nije menadžer lozinki, messenger ni VPN.",
        },
        {
          question: "Treba li mi VPN svaki dan?",
          answer:
            "Obično ne. Koristite ga na nepoverljivim mrežama ili kada posebno treba da sakrijete IP od destinacije. Nije zamena za HTTPS, dobre lozinke ili šifrovane messengere.",
        },
        {
          question: "Open source ili uglađen vlasnički?",
          answer:
            "Preferirajte open source kada je rizik visok i možete da živite sa UX-om. Vlasnički alati mogu biti racionalni kada upotrebljivost određuje da li vaša porodica uopšte usvoji trezor—eksplicitno imenujte kompromis, kao što radimo sa 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Sastavite stack, pa pravilno delite tajne",
  ctaBody:
    "Kada je posao privremena predaja, preskočite arhivu četa. Napravite belešku šifrovanu u pregledaču, pošaljite link i pustite da istekne kada trenutak prođe.",
  ctaButton: "Napravite privatnu belešku",
  ctaSecondaryLabel: "Pregledajte direktorijum alata za privatnost",
  ctaSecondaryHref: "app:privacy-tools",
};
