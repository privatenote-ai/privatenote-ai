import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersHr: SecureClientDeliveryForLawyersArticleCopy = {
  heroKicker: "Za odvjetničke urede",
  intro: [
    "Povjerljiva komunikacija između odvjetnika i klijenta zaslužuje više od šifriranja tijekom prijenosa. Važno je i koje kopije ostaju nakon dostave, tko im kasnije može pristupiti i koliko dugo ostaju dostupne.",
    "Uredi znaju da e-pošta nije trezor za povjerljive podatke klijenta. Mnogi stoga prelaze na Signal ili WhatsApp jer je „šifrirano“. To je nepotpuno. Te usluge čuvaju razgovor. Mnoge komunikacije između odvjetnika i klijenta zahtijevaju upravo suprotno: da se klijentu preda uputa, nacrt ili prilog, bez stvaranja novih trajnih kopija.",
    "Teškoća je praktična i pravna. Znatni dio klijenata neće instalirati Signal. Neće uz obiteljski WhatsApp uvesti drugu „sigurnu“ aplikaciju za poruke. Otvorit će poveznicu u pregledniku koji već imaju. Osobito u kaznenoj obrani odvjetništvo treba kanal koji izgleda kao uredska korespondencija — ne kao oblačić iz uobičajene aplikacije za chat.",
  ],
  sections: [
    {
      title: "Zašto šifrirani chat ipak može ostaviti trajnu povijest",
      paragraphs: [
        "Šifriranje s kraja na kraj u Signalu i WhatsAppu učinkovito štiti sadržaj od pristupa pružatelja usluge. Ali šifriranje i trajnost podataka dva su različita pitanja: poruka može biti dobro zaštićena, a da ipak ostane dostupna na uređajima sudionika, u sigurnosnim kopijama ili na povezanim računalima. Upravo je to drugo pitanje važno u praksi, osobito u kaznenoj obrani:",
      ],
      bullets: [
        "Ostaje li pretraživa povijest na telefonu klijenta, na uređaju srodnika ili na uređaju koji će kasnije biti pretražen, oduzet ili vještačen?",
        "Umnožavaju li oblak, povezana računala, pregledi obavijesti i proslijeđeni snimci zaslona sadržaj izvan izvornih strana?",
        "Nastaje li, nenamjerno, tekući pisani komentar koji nikad nije trebao ući u predmet, a kasnije se pojavi kao još jedan trajni digitalni zapis?",
      ],
      paragraphsAfterBullets: [
        "Isti obrazac poznaje i ostala struka: napisane poruke nadžive povod zbog kojega su poslane. Vidite [kratkotrajne bilješke za poruke s radnog mjesta](blog:workplace-texts-private-note) i [zašto tajne ne idu u chat](blog:secrets-never-send-in-chat). Za isprave, liječnička izvješća i ugovore isti prigovor vrijedi i za [privitke e-pošte](blog:why-email-is-worst-for-secrets).",
        "To nije poziv da se uništi ono što ured mora čuvati. Zakonske obveze čuvanja spisa, uredno vođenje predmeta i, gdje je naloženo, osiguranje dokaza ostaju. Poanta je uža: mnoge operativne poruke — jednokratne upute, pristupni podaci, nacrti samo za klijenta, osjetljiv prilog koji ne smije stajati u obiteljskom chatu — ne trebaju trajno ostati u aplikaciji za poruke.",
      ],
    },
    {
      title: "Kaznena obrana, istražni zatvor i klijent bez druge aplikacije",
      paragraphs: [
        "Prigovor je najoštriji u kaznenoj obrani. Klijent je pod pritiskom, ponekad u istražnom zatvoru ili na izdržavanju kazne, koristi telefon srodnika i rijetko može uvesti vlastiti skup alata za povjerljivost. Molba da „samo instalira Signal“ u mnogim predmetima pada u prazno. WhatsApp je često već na uređaju — i baš je to problem. To je okruženje osobne komunikacije: tu se obitelj svađa, tu putuju snimci zaslona, tu povjerljiva uputa stoji pored šale od rođaka.",
        "Dodaje se praksa pretresa i oduzimanja. Ako se telefon oduzme, lokalna povijest poruka je na uređaju. PrivateNote ne mijenja ono što tijela vlasti mogu zakonito oduzeti ili pregledati. Postavlja drugo pitanje: koje kopije klijent sam, prema zadanim postavkama, drži na svakodnevnom telefonu.",
        "Među porukama koje ne trebaju ostati u tom okruženju su:",
      ],
      bullets: [
        "Upute o izjašnjenju, istražnom zatvoru, mjerama opreza, jamstvu ili sporazumu o priznanju krivnje.",
        "Nacrti iskaza, podneska ili završne riječi o kazni koje klijent treba odobriti prije podnošenja.",
        "Adrese, liječnička izvješća, imovinsko stanje ili identitet predviđenog svjedoka — danas potrebno, opasno ako ostane.",
        "Jednokratni pristup portalu, video-ročištu ili dokumentu koji klijent treba jednom pročitati, a ne čuvati u chatu.",
        "Odvjetnik odvjetniku: korespondent, zamjenski odvjetnik na ročištu, kolegica koja preuzima termin — spisi trebaju sada, ne trajni grupni chat.",
      ],
      paragraphsAfterBullets: [
        "U svakom od tih slučajeva cilj je da se sadržaj preda određenom primatelju, bez nepotrebnog širenja kruga onih koji ga kasnije mogu rekonstruirati. Potvrda čitanja u aplikaciji za poruke nije zapis o dostavi namijenjen uredu. Ne označava ured. Ne nudi, na prvi pogled, profesionalni kontekst koji klijent oprezan prema nepoznatim poveznicama može potražiti da bi prepoznao pošiljku.",
      ],
    },
    {
      title: "Što odvjetništvo doista treba od kanala dostave",
      paragraphs: [
        "Pogodan kanal za prijenos povjerljivih informacija ima kratak popis zahtjeva. Klijent ne bi trebao morati otvarati račun niti instalirati aplikaciju. Šifriranje mora biti na uređaju pošiljatelja prije otpreme, tako da usluga čuva samo šifrirane podatke, a ne sadržaj u čitljivom obliku. Pristup mora moći nestati nakon čitanja i isteći. Stranica za otvaranje treba izgledati kao uredska korespondencija — ne kao anonimna usluga za dijeljenje teksta. Pošiljatelj treba moći vidjeti je li poveznica otvorena, opozvati je ako je broj pogrešan, i kod osjetljivih priloga otežati nepotrebno preuzimanje.",
        "To je logika [jednokratne tajne poveznice](blog:one-time-secret-links), primijenjena na odvjetničku praksu. PrivateNote šifrira sadržaj u pregledniku prije nego napusti uređaj. Primatelji otvaraju jedinstveni URL; račun nije potreban. Ured može poslati poveznicu kanalom koji klijent već koristi — SMS, e-pošta ili kratak telefonski poziv u kojem se adresa pročita — bez stavljanja same upute u taj kanal. Povjerljivi sadržaj nalazi se u bilješci. U chatu ili e-pošti ostaje samo poveznica koja nakon otvaranja ili isteka prestaje raditi.",
      ],
      comparisonTable: {
        headers: ["Zahtjev prakse", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Klijent ne instalira aplikaciju",
            "Ne — aplikacija jest kanal",
            "Da — običan preglednik",
          ],
          [
            "Nema trajne povijesti kao zadano",
            "Razgovor u aplikaciji; mogu se postaviti poruke koje nestaju",
            "Jednokratna dostava putem poveznice; jednokratno čitanje i istek kao osnovni tijek",
          ],
          [
            "Identitet ureda pri dostavi",
            "Profil ili identitet unutar aplikacije za poruke",
            "Logotip, ime ureda i stranica za otvaranje s identitetom ureda",
          ],
          [
            "Dokaz da su spisi preuzeti",
            "Potvrde čitanja pripadaju chatu, ne posebnom zapisu o dostavi",
            "Obavijesti o otvaranju i dokaz pristupa (samo status)",
          ],
          [
            "Opoziv pri pogrešnom broju",
            "Poruka je već na uređaju",
            "Opozovi neotvorenu bilješku",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal i WhatsApp također nude poruke koje nestaju. Njihov model i dalje je razgovor u aplikaciji za poruke, dok je PrivateNote osmišljen kao jednokratna dostava putem poveznice. Za dokumente umjesto kratkih uputa vidi [kako sigurno poslati osjetljive dokumente](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Uredski standard: jedinstvena praksa dostave",
      paragraphs: [
        "Korist raste kada odvjetnici međusobno koriste isti kanal kao prema klijentu. Korespondent, zamjenski odvjetnik na ročištu, kolegica koja pokriva pretres i klijent tada dijele jedno očekivanje: osjetljivo stiže kao jednokratna poveznica s identitetom ureda; ne ide u grupni chat; ne postaje još jedan trajni digitalni zapis.",
        "To je standard prakse, ne proizvod zasnovan na licencama po korisniku. PrivateNote Business je jedan profesionalni račun. Odvjetnik, suradnik ili mali ured mogu prikazati ime i vizualni identitet na svakoj stranici za otvaranje. Kolege s vlastitim Business ili Starter računom mogu vratiti spise istim putem. Klijentu i dalje nije potreban račun. Zajednička disciplina je poanta: prestati svakodnevne aplikacije za poruke tretirati kao zadani kanal za povjerljivu operativnu komunikaciju.",
        "Klijent koji je navikao biti oprezan s nepoznatim poveznicama treba odmah prepoznati kontekst poruke: naziv ureda, logotip, identitet pošiljatelja i kratku popratnu poruku. To nije kriptografska autentikacija pošiljatelja, ali dostavu čini prepoznatljivijom i profesionalnijom. Business dodaje profil ureda, logotip, boje i prilagođenu stranicu za otvaranje, tako da klijent jasno vidi u kojem kontekstu prima povjerljivi sadržaj.",
      ],
      midCta: {
        body: "Business je namijenjen profesionalnoj dostavi: identitet ureda kod primatelja, način pregleda bez preuzimanja, prilozi do 1 GB i puna kontrola dostave (dokaz pristupa, provjera primatelja, opoziv, odgođeno otvaranje). 12 € / 12 $ mjesečno, ili 120 € / 120 $ godišnje — jedan profesionalni račun, ne licenca po korisniku.",
        button: "Pogledajte Business na stranici tarifa",
      },
    },
    {
      title: "Kontrole koje pripadaju profesionalnom računu",
      paragraphs: [
        "Starter i Business dodaju funkcije koje bi ured inače morao usklađivati telefonom ili odvojenim kanalima. [Provjera primatelja](blog:recipient-verification-code-before-reveal) stavlja kod specifičan za bilješku na drugi kanal, tako da presretnuta poveznica nije dovoljna. [Obavijesti o otvaranju](blog:know-when-secret-link-opened) i dokaz pristupa kažu da su spisi preuzeti — samo status, nikad sadržaj. Još neotvorena poveznica može se [opozvati](blog:revoke-unopened-note-proof-of-access) ako je poslana na pogrešan broj. Odgođeno otvaranje može spriječiti pristup sadržaju do određenog roka ili dogovorenog termina, na primjer do poziva iz zatvora. Business dodaje pregled bez preuzimanja za priloge koje treba čitati, ne usput spremati, i najveće granice priloga za opsežnije spise koji ne idu u chat.",
      ],
      orderedIntro: "Praktičan tijek u uredu je kratak:",
      ordered: [
        "Sastavite uputu ili priložite spise. Šifriranje je u pregledniku prije otpreme.",
        "Postavite kratak rok i jedno otvaranje — ili nekoliko otvaranja ako klijent i korespondent moraju preuzeti isti paket.",
        "Uključite provjeru primatelja gdje je sadržaj posebno osjetljiv i kod pošaljite drugim kanalom (npr. telefonom).",
        "Pošaljite samo poveznicu SMS-om ili e-poštom. Samu uputu ne stavljajte u tu poruku.",
        "Pričekajte obavijest o otvaranju. Ako je broj pogrešan, opozovite prije otvaranja. Nakon otvaranja pretpostavite da primatelj može zadržati što je vidio, i postupite u skladu s time.",
      ],
      paragraphsAfterOrdered: [
        "Za veće skupove dokumenata vrijedi isti model: [šifrirane datoteke, šifrirani podaci na poslužitelju, vremenski ograničen prozor preuzimanja](app:secure-file-transfer). Slanje datoteke zahtijeva besplatan račun; otvaranje poveznice nikad.",
      ],
    },
    {
      title: "Što ovaj kanal ne odlučuje",
      paragraphs: [
        "U Hrvatskoj odvjetničku tajnu uređuju, među ostalim, Zakon o odvjetništvu i Zakon o kaznenom postupku. Primjenjuje li se odvjetnička tajna na konkretnu komunikaciju ovisi o pravnom okviru i okolnostima konkretnog slučaja. PrivateNote ne određuje taj pravni status. Nijedan proizvod ne sprječava ovlaštenog primatelja da, kad je sadržaj prikazan u čitljivom obliku, napravi kopiju, snimku zaslona ili fotografiju. PrivateNote ne zamjenjuje sustav spisa ureda, evidenciju vremena ni dužnost čuvati što predmet mora čuvati. Smanjuje nepotrebne kopije poruka koje nikad nisu trebale postati stalna arhiva. Načelo smanjenja količine podataka iz GDPR-a također ide u prilog tome da se osobni podaci ne čuvaju dulje ni u većem opsegu nego što je potrebno za konkretnu svrhu.",
        "Uz to ograničenje, to je stručna alternativa dvjema navikama koje danas vladaju: staviti povjerljivu operativnu komunikaciju u e-poštu — ili u svakodnevnu aplikaciju za poruke jer klijent ništa drugo neće instalirati. Ured ostavlja klijenta na alatima koje već ima, stavlja svoje ime na dostavu i ne ostavlja trajnu povijest tamo gdje nije potrebna.",
      ],
    },
    {
      title: "Česta pitanja",
      faqs: [
        {
          question: "Je li šifriranje u Signalu ili WhatsAppu dovoljno za zaštitu odvjetničke tajne?",
          answer:
            "Šifriranje s kraja na kraj učinkovito štiti sadržaj od pristupa pružatelja usluge. Međutim, ono ne rješava pitanje koliko dugo poruke ostaju na uređajima, u sigurnosnim kopijama ili na povezanim računalima. Šifriranje i trajnost podataka dva su različita pitanja. Za povjerljivu komunikaciju važno je i što ostaje nakon dostave, a ne samo kako je sadržaj zaštićen tijekom razmjene.",
        },
        {
          question: "Mora li klijent otvoriti račun ili instalirati aplikaciju?",
          answer:
            "Ne. Klijent otvara jedinstvenu poveznicu u običnom pregledniku. Ni Signal, ni WhatsApp, ni aplikacija PrivateNote nisu potrebni, i za otvaranje bilješke račun nije potreban.",
        },
        {
          question: "Je li PrivateNote sustav za spise ili zamjena za predmet?",
          answer:
            "Ne. To je kratkotrajni kanal dostave. Predmeti, sudski spisi i sve pod obvezom čuvanja ostaju u uobičajenim sustavima ureda. PrivateNote je za poruke koje nakon primitka ne trebaju trajati.",
        },
        {
          question: "Može li primatelj nakon otvaranja ipak zadržati kopiju?",
          answer:
            "Da. Kada se sadržaj prikaže u čitljivom obliku, primatelj ga može kopirati, snimiti zaslon, preuzeti ili fotografirati. Uništenje nakon čitanja i istek smanjuju ostatke na usluzi; ne brišu na daljinu ono što je primatelj već sačuvao. Pregled bez preuzimanja u Business otežava usputno preuzimanje; ne zabranjuje fotografiranje.",
        },
      ],
    },
  ],
  ctaTitle: "Predajte uputu. Ne ostavljajte trajnu povijest.",
  ctaBody:
    "Šifrirajte sadržaj u pregledniku, prikažite identitet ureda na stranici za otvaranje i pošaljite poveznicu koju klijent može otvoriti bez instaliranja dodatne aplikacije. Business je namijenjen upravo takvoj profesionalnoj dostavi.",
  ctaPrimary: "Odaberite Business",
  ctaSecondary: "Napišite privatnu bilješku",
};
