import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideHr: PrivacyToolsGuideArticleCopy = {
  intro: [
    "Većina stranica o „najboljim alatima za privatnost“ afilijacijski su katalozi u maski. Rangiraju svaku kategoriju, zakopavaju kompromise i ostavljaju vas s dvadeset kartica i bez sustava.",
    "Ovaj vodič je drugačiji. To je **okvir odlučivanja za 2026.** za sastavljanje privacy stacka koji odgovara stvarnom životu: koji posao trebate obaviti, koji zadani izbor uzeti, kada napraviti upgrade—i kada alat ima potpuno pogrešan oblik.",
    "PrivateNote.ai zauzima usko mjesto—**jednokratne predaje tajni**. Sve ostalo ispod kurirano je mišljenje kako biste s ove stranice otišli s koherentnim stackom, a zatim pregledali naš [direktorij alata za privatnost](app:privacy-tools) za potpuni katalog.",
  ],
  sections: [
    {
      title: "Počnite od modela prijetnje (ne od shopping liste)",
      paragraphs: [
        "Alati za privatnost pomažu samo ako odgovaraju onome od čega se branite. Freelancer koji dijeli Wi‑Fi vjerodajnice ima drugačiji problem od novinara pod ciljanim nadzorom. Odaberite najlakši stack koji pokriva *vaše* rizike—pa prestanite skupljati alate iz zabave.",
      ],
      subsections: [
        {
          title: "Svakodnevna osobna uporaba",
          paragraphs: [
            "Želite manje praćenja, manje katastrofa zbog ponovne uporabe lozinki i tajne koje ne ostaju u chatu. Ne pokušavate nestati pred državama. Usredotočite se na upravitelja lozinki, razumne zadane postavke preglednika, šifriranu poruku za osjetljive chatove i efemerne poveznice za jednokratne vjerodajnice.",
          ],
        },
        {
          title: "Freelancer ili konzultant",
          paragraphs: [
            "Predajete tajne klijentima koji ne dijele vaše aplikacije. E-mail i Slack postaju trajne arhive API ključeva i privremenih lozinki. Dodajte jednokratne šifrirane bilješke i šifrirani prijenos datoteka; dugotrajne vjerodajnice držite u trezoru, ne u nitima.",
          ],
        },
        {
          title: "Mali tim",
          paragraphs: [
            "Treba vam dijeljeni pristup koji se može opozvati, jasna pravila za ugovaratelje i manje oslanjanja na „samo pošalji u kanal“. Preferirajte dijeljenje preko upravitelja lozinki za trajni pristup, jednokratne poveznice za privremene predaje i pisane norme kako pogodnost ne bi tiho postala politika.",
          ],
        },
      ],
      calloutTitle: "Praktično pravilo",
      callout:
        "Ako alat ne mapira na posao koji stvarno radite tjedno, preskočite ga. Minimalni stack koji koristite pobjeđuje puristički stack koji napustite.",
    },
    {
      title: "Poslovi privatnosti, ne kategorije proizvoda",
      paragraphs: [
        "Kategorije (VPN, preglednik, messenger) potiču sakupljanje logotipa. Poslovi forsiraju kompromise na vidjelo. Koristite ovu kartu za orijentaciju; odjeljci ispod idu dublje.",
      ],
      comparisonTable: {
        headers: ["Posao", "Zadani pristup", "Pogrešan alat za posao"],
        rows: [
          [
            "Čuvati dugotrajne lozinke",
            "Upravitelj lozinki + jak generator",
            "Samo lozinke spremljene u pregledniku, ili arhive chata",
          ],
          [
            "Predati nekome jednokratnu tajnu",
            "Bilješka šifrirana u pregledniku koja istječe",
            "E-mail, Slack, SMS ili cloud mapa „za sada“",
          ],
          [
            "Svakodnevni privatni chat",
            "Messenger s end-to-end šifriranjem",
            "SMS, ili „nestajuće“ poruke u aplikacijama koje ipak zauvijek arhiviraju metapodatke",
          ],
          [
            "Smanjiti trackere pri pregledavanju",
            "Ojačan mainstream preglednik + blocker",
            "Instalirati pet konfliktnih proširenja za privatnost",
          ],
          [
            "Nepouzdane mreže",
            "No-logs VPN s reputacijom",
            "Pretpostaviti da vas VPN čini anonimnim",
          ],
          [
            "Higijena protiv preuzimanja računa",
            "Provjera curenja + 2FA / passkeys",
            "Ponovno koristiti lozinke i nadati se",
          ],
        ],
        after: [
          "Za imena proizvoda, bilješke o cijenama i isključenja, držite [direktorij alata za privatnost](app:privacy-tools) otvorenim uz ovaj vodič.",
        ],
      },
    },
    {
      title: "Posao: dugotrajne lozinke",
      paragraphs: [
        "Lozinke koje ćete mjesecima ponovno koristiti pripadaju trezoru—ne mozgu, ne aplikaciji za bilješke i ne jučerašnjoj Teams niti.",
      ],
      subsections: [
        {
          title: "Problem",
          paragraphs: [
            "Ponovna uporaba pretvara jedno curenje u mnoga. Slabe, zapamtljive lozinke padaju na offline crackingu. Spremišta preglednika pomažu, ali rijetko dosežu namjenske upravitelje u syncu, dijeljenju i auditu.",
          ],
        },
        {
          title: "Zadano + alternativa",
          paragraphs: [
            "**Zadano:** [Bitwarden](https://bitwarden.com/) za većinu—open source, upotrebljiv free tier, solidan sync. **Alternativa:** [KeePassXC](https://keepassxc.org/) ako želite lokalni trezor bez clouda. **Kada je polish važniji od open sourcea:** [1Password](https://1password.com/) fer je izbor; znajte da birate vlasničku pogodnost.",
          ],
        },
        {
          title: "Kada ne koristiti samo upravitelj",
          paragraphs: [
            "Upravitelji sjaje u *pohrani* i trajnom dijeljenom pristupu. Nespretni su kada primatelj nema račun, ili kada tajna treba umrijeti nakon jednog čitanja. To je drugi posao—vidite jednokratne tajne ispod. Generirajte jake vrijednosti lokalnim [generatorom lozinki](app:password-generator) prije nego ih spremite ili podijelite.",
          ],
        },
      ],
    },
    {
      title: "Posao: jednokratne tajne",
      paragraphs: [
        "Lozinke za ugovaratelje, kodovi za oporavak, API ključevi, Wi‑Fi za posjetitelja—sve što ne treba postati pretraživa povijest.",
      ],
      subsections: [
        {
          title: "Problem",
          paragraphs: [
            "E-mail i chat šifriraju u prijenosu, pa arhiviraju zauvijek. Cloud mape ostaju. Screenshotovi i sigurnosne kopije uređaja šire radijus. Failure mode nije „netko sniffa liniju“—već „tajna je i dalje tu za šest mjeseci.“",
          ],
        },
        {
          title: "Zadano",
          paragraphs: [
            "**Zadano:** bilješka šifrirana u pregledniku koja istječe, poput [PrivateNote.ai](app:home)—ciphertext na poslužitelju, materijal za dešifriranje u fragmentu poveznice, burn-after-reading ili kratak TTL. Za model, vidite [kako PrivateNote radi](app:how-it-works) i [zašto je e-mail najgore mjesto za tajne](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Kada ne koristiti",
          paragraphs: [
            "Ne zamjenjujte upravitelj lozinki ni dnevni messenger jednokratnim bilješkama. Ne stavljajte dugotrajne dokumente ili tekuće razgovore u efemerne poveznice. I ne šaljite poveznicu i opcionalnu prolaznu frazu istim kanalom ako je tajna visokog rizika—razdvojite kanale.",
          ],
        },
      ],
      midCta: {
        body: "Trebate predati lozinku ili API ključ sada? Šifrirajte je u pregledniku i pošaljite poveznicu koja može isteći nakon čitanja.",
        button: "Izradite privatnu bilješku",
        href: "app:home",
      },
    },
    {
      title: "Posao: svakodnevno slanje poruka",
      paragraphs: [
        "Osjetljivi razgovori trebaju end-to-end šifriranje po zadanom—ne prekidač zakopan u postavkama, i ne obećanje da „nestajuće“ poruke brišu serverske kopije koje ne možete verificirati.",
      ],
      subsections: [
        {
          title: "Zadano + kompromis",
          paragraphs: [
            "**Zadano:** [Signal](https://signal.org/) za mainstream siguran chat. **Kompromis koji treba glasno reći:** registracija zahtijeva broj telefona, što neki modeli prijetnje visoke anonimnosti odbacuju. Za te slučajeve, gledajte izvan ovog starter vodiča—i i dalje tretirajte metapodatke (tko s kim razgovara) kao preostali rizik na svakom messengeru.",
          ],
        },
        {
          title: "Kada ne koristiti chat za tajne",
          paragraphs: [
            "Čak i šifrirani messengeri čuvaju povijest na uređajima. Zalijepite produkcijsku lozinku u nit i napravili ste trajnu kopiju. Koristite chat za razgovor; koristite jednokratne bilješke za vjerodajnice. Više o tom obrascu: [tajne koje nikad ne treba slati u chatu](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Posao: e-mail i razdvajanje identiteta",
      paragraphs: [
        "E-mail je javni sustav adresiranja s privatnim nadama. Tretirajte šifriranje sandučića i aliasing kao kontrolu štete, ne magičnu nevidljivost.",
      ],
      subsections: [
        {
          title: "Zadano",
          paragraphs: [
            "**Zadani šifrirani sandučić:** [Proton Mail](https://proton.me/) ili [Tuta](https://tuta.com/) kada želite zero-access e-mail za osjetljivu prepisku. **Zadani aliasing:** [Firefox Relay](https://relay.firefox.com/) za lagano maskiranje, ili [SimpleLogin](https://simplelogin.io/) kada trebate prilagođene domene i oštrije razdvajanje identiteta.",
          ],
        },
        {
          title: "Kada se ne oslanjati na e-mail",
          paragraphs: [
            "Šifrirani e-mail i dalje ostavlja zaglavlja, navike prosljeđivanja i dugo zadržavanje. Nikad ne stavljajte aktivne vjerodajnice u tijelo „samo ovaj put“. Ako je payload predaja tajne, koristite jednokratnu bilješku i u e-mail stavite samo kontekst.",
          ],
        },
      ],
    },
    {
      title: "Posao: pregledavanje s manje praćenja",
      paragraphs: [
        "U 2026. borba je manje o „tajnom načinu“, a više o fingerprintingu, cross-site praćenju i proširenjima koja obećavaju privatnost dok dodaju površinu napada.",
      ],
      subsections: [
        {
          title: "Zadani stack",
          paragraphs: [
            "**Zadano:** [Firefox](https://www.mozilla.org/) sa strogom zaštitom od praćenja plus [uBlock Origin](https://ublockorigin.com/). **Chromium-oblična alternativa:** [Brave](https://brave.com/) ako vam treba kompatibilnost proširenja—znajte da je zajednica podijeljena oko njegove rewards/crypto površine. **Pretraživanje:** [DuckDuckGo](https://duckduckgo.com/) (ili slično neprofilirajuće pretraživanje) da vaši upiti ne budu feed reklamnog profila.",
          ],
        },
        {
          title: "Kada je Tor pravi upgrade",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) standard je za jaču anonimnost i otpornost na cenzuru. Također je sporiji i pun CAPTCHA-a. Koristite ga kada model prijetnje to zahtijeva—ne kao svakodnevni bankarski preglednik.",
          ],
        },
      ],
    },
    {
      title: "Posao: nepouzdane mreže (VPN reality check)",
      paragraphs: [
        "VPN šifrira put između vas i VPN pružatelja. Skriva vaš IP od stranica koje posjećujete. **Ne** čini vas anonimnim, ne šifrira zapisnike odredišta i ne popravlja slabu lozinku.",
      ],
      subsections: [
        {
          title: "Zadano što smo spremni imenovati",
          paragraphs: [
            "Preferirajte pružatelje s javnim track recordom, jasnom jurisdikcijskom pričom i auditiranim no-logs tvrdnjama—obično [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) ili [IVPN](https://www.ivpn.net/). Platite proizvod; free VPN poslovni modeli često jesu proizvod.",
          ],
        },
        {
          title: "Kada se ne treba mučiti",
          paragraphs: [
            "Na mreži kojoj već vjerujete, s HTTPS-om posvuda, VPN je opcionalna higijena—ne moralna dužnost. Preskočite sumnjive „military-grade“ brendove i sve što vodi influencer kodovima umjesto inženjerskog detalja. Bilješke o isključenju u našem direktoriju pokrivaju uobičajene „privacy-washed“ izbore.",
          ],
        },
      ],
    },
    {
      title: "Posao: curenja, 2FA i passkeys",
      paragraphs: [
        "Higijena računa neugledna je polovica privatnosti. Većina osobnih katastrofa credential stuffing je i SIM-swap-slični neuspjesi, ne egzotični malware.",
      ],
      subsections: [
        {
          title: "Praktično zadano",
          paragraphs: [
            "Provjerite adrese na [Have I Been Pwned](https://haveibeenpwned.com/). Uključite faktore otporne na phishing gdje možete—passkeys ili hardverski ključevi kao [YubiKey](https://www.yubico.com/) pobjeđuju SMS OTP. Koristite [2FA Directory](https://2fa.directory/) da vidite koji servisi i dalje tretiraju drugi faktor kao opcionalni teatar.",
          ],
        },
        {
          title: "Napomena 2026. o passwordlessu",
          paragraphs: [
            "Passkeys smanjuju phishing i ponovnu uporabu lozinki, ali oporavak i lock-in preko ekosustava stvarni su. Držite priču o oporavku (hardverski ključ, dokumentiran proces) prije nego obrišete svaku lozinku. Upravitelji lozinki ostaju korisni za dugi rep stranica koje još nisu stigle.",
          ],
        },
      ],
    },
    {
      title: "Što se promijenilo 2026. (komentar vrijedan čuvanja)",
      bullets: [
        "**AI chat nova je arhiva.** Lijepljenje tajni u asistente stvara pitanja zadržavanja i rizika treniranja koja vaš model prijetnje iz 2019. nikad nije uključivao. Tretirajte promptove kao tijela e-mailova.",
        "**Fingerprinting je prestigao cookie bannere.** Blokiranje third-party kolačića pomaže; izbor preglednika, blokiranje trackera i manje proširenja i dalje više znače nego prihvaćanje svakog „legitimate interest“ prekidača.",
        "**Passkeys ulaze u mainstream.** Preferirajte ih na računima visoke vrijednosti; ne pravite se da ih već podržava svaka stranica.",
        "**VPN marketing postao je glasniji, ne mudriji.** Jurisdikcijski teatar i afilijacijski leaderboardovi nisu auditi. Birajte dosadne, dokumentirane pružatelje—ili nijednog.",
        "**Efemerne dijeljenje još je nišno—i još nužno.** Aplikacije za suradnju optimizirane za pretraživanje čine alate za jednokratne tajne vrijednijima, ne manje.",
      ],
    },
    {
      title: "Minimalni starter kit (za većinu ljudi)",
      paragraphs: [
        "Ako radite samo sedam stvari, učinite ove. Sve ostalo opcionalna je dubina.",
      ],
      useCaseTable: {
        headers: ["Mjesto", "Izbor"],
        rows: [
          ["Trezor lozinki", "Bitwarden (ili KeePassXC ako odbijate cloud)"],
          ["Izrada lozinki", "Lokalni generator—zatim spremite u trezor"],
          ["Jednokratne tajne", "PrivateNote.ai (ili ekvivalentna bilješka šifrirana u pregledniku)"],
          ["Privatni chat", "Signal"],
          ["Preglednik + blocker", "Firefox + uBlock Origin"],
          ["Higijena curenja / 2FA", "Have I Been Pwned + passkeys ili app/hardverski 2FA"],
          ["Putovanja / Wi‑Fi u kafiću", "Mullvad, Proton VPN ili IVPN—kada je mreža rizik"],
        ],
      },
      callout:
        "Napredni dodaci (Tor svakodnevno, full-disk ritualizam, anonimne e-mail mreže) valjani su—ali tek nakon što starter kit postane navika.",
    },
    {
      title: "Što isključujemo—i zašto",
      paragraphs: [
        "Kuriranje je uglavnom reći ne. Nekoliko obrazaca koje odbijamo ublažiti:",
      ],
      subsections: [
        {
          title: "VPN-ovi teatra privatnosti",
          paragraphs: [
            "Free tierovi financirani nejasnim praksama podataka, lažni „audit“ bedževi i leaderboard SEO. Ako je pitch strah plus kod za popust, otiđite.",
          ],
        },
        {
          title: "Messengeri koji selektivno reklamiraju šifriranje",
          paragraphs: [
            "Cloud po zadanom, opcionalni E2EE ili načini „tajnog chata“ koji treniraju korisnike da lijepe tajne u nesiguran default. Radije preporučujemo jedan pošten default nego pet načina koje ljudi zlorabe. Cloudovi u stilu Telegrama i WhatsAppove realnosti metapodataka/backupa naznačene su u našim [isključenjima direktorija](app:privacy-tools).",
          ],
        },
        {
          title: "Sve što treba kupiti našu preporuku",
          paragraphs: [
            "Ovaj vodič i direktorij nisu afilijacijska lista. Ne zarađujemo ništa ako kliknete. To nas ne čini sveznajućima—znači da poticaji tiho ne upravljaju shortlistom.",
          ],
        },
      ],
    },
    {
      title: "Kamo dalje",
      paragraphs: [
        "Koristite ovaj članak kao sloj odlučivanja. Koristite direktorij kao živi katalog—kategorije, nijanse i poveznice koje držimo pregledanima.",
      ],
      bullets: [
        "[Direktorij alata za privatnost](app:privacy-tools) — kurirani katalog po kategoriji",
        "[Kako sigurno podijeliti lozinku](blog:how-to-share-a-password-securely) — playbook predaje",
        "[Pošaljite tajnu bez računa](blog:send-secret-message-without-account) — nije potrebna zajednička aplikacija",
        "[Resursi sigurnosti](app:security-resources) — šire čitanje na PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — kontekst politike i prava",
        "[Privacy Guides](https://www.privacyguides.org/) — dublje preporuke koje održava zajednica",
      ],
      midCta: {
        body: "Spremni pregledati potpuni shortlist s bilješkama kategorija i isključenjima?",
        button: "Otvorite direktorij alata za privatnost",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Je li ovo isto što i vaš direktorij alata za privatnost?",
          answer:
            "Ne. Ovaj post vodič je 2026. kako birati. [Direktorij](app:privacy-tools) kurirani je katalog. Pročitajte vodič da odlučite; koristite direktorij da odaberete konkretne alate.",
        },
        {
          question: "Mogu li juriti rangiranje svake kategorije privatnosti?",
          answer:
            "Možete, ali nećete izdržati. Starter kit od sedam mjesta koji stvarno koristite pobjeđuje hram od trideset alata koji konfigurirate jednom.",
        },
        {
          question: "Gdje se uklapa PrivateNote.ai?",
          answer:
            "Samo u posao jednokratnih tajni—vjerodajnice i upute koje trebaju isteći. Nije upravitelj lozinki, messenger ni VPN.",
        },
        {
          question: "Treba li mi VPN svaki dan?",
          answer:
            "Obično ne. Koristite ga na nepouzdanim mrežama ili kada posebno trebate sakriti IP od odredišta. Nije zamjena za HTTPS, dobre lozinke ili šifrirane messengere.",
        },
        {
          question: "Open source ili uglađen vlasnički?",
          answer:
            "Preferirajte open source kada je rizik visok i možete živjeti s UX-om. Vlasnički alati mogu biti racionalni kada upotrebljivost određuje hoće li vaša obitelj uopće usvojiti trezor—eksplicitno imenujte kompromis, kao što radimo s 1Passwordom.",
        },
      ],
    },
  ],
  ctaTitle: "Sastavite stack, pa pravilno dijelite tajne",
  ctaBody:
    "Kada je posao privremena predaja, preskočite arhivu chata. Izradite bilješku šifriranu u pregledniku, pošaljite poveznicu i pustite da istekne kada trenutak prođe.",
  ctaButton: "Izradite privatnu bilješku",
  ctaSecondaryLabel: "Pregledajte direktorij alata za privatnost",
  ctaSecondaryHref: "app:privacy-tools",
};
