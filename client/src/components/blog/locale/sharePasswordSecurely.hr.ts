import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyHr: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Prijenosnik na stolu prikazuje PrivateNote.ai sigurnu poveznicu spremnu za kopiranje, s isticanjem nakon jednog pregleda i uključenom prolaznom frazom",
  heroCaption:
    "Pošaljite sigurnu poveznicu—ne samu lozinku—s kratkim rokom valjanosti, jednokratnim pregledom i opcionalnom prolaznom frazom.",
  intro: [
    "Dijeljenje lozinke djeluje kao sitna, svakodnevna radnja—dok nešto ne pođe po zlu.",
    "Bilo da kolegi treba privremeni pristup internom alatu, predstavnik korisničke podrške traži sustavni pristup, ili trebate poslati Wi-Fi vjerodajnice posjetitelju, najbrža opcija često izgleda kao lijepljenje lozinke u čistom tekstu u Microsoft Teams chat, WhatsApp poruku ili brzi e-mail.",
    "Nažalost, ta pogodnost ostavlja trajni digitalni trag. Jednom kad tajna uđe u te kanale, sinkronizira se na uređajima, može se pretraživati, čuva se u automatskim sigurnosnim kopijama pretinca i zadržava se u korporativnim arhivama poruka neograničeno. Lozinka koja je trebala biti privremena postaje trajna odgovornost.",
    "Srećom, postoji bolji način da zaštitite svoje vjerodajnice.",
  ],
  sections: [
    {
      title: "Osnovni problem dijeljenja u čistom tekstu",
      paragraphs: [
        "Aplikacije za e-poštu i chat izvrsne su platforme za suradnju, ali nikada nisu dizajnirane da čuvaju tajne. Iako moderni sustavi obično šifriraju podatke tijekom prijenosa, padaju na efemernosti—osiguravanju da tajne nestanu nakon što su odslužile svrhu.",
        "Kad zalijepite lozinku u standardni chat ili e-mail nit, odmah gubite kontrolu nad njezinim životnim ciklusom. Ostaje sačuvana u pretincima, pretraživa u zapisima chata godinama kasnije i vidljiva u obavijestima uređaja ili na zaključanom zaslonu. Ako ikada bude kompromitiran vaš račun ili račun primatelja, te povijesti chata u čistom tekstu postaju zlatni rudnik za napadače.",
      ],
    },
    {
      title: "GDPR (DSGVO) i rizici usklađenosti u Europi",
      paragraphs: [
        "Za europske organizacije ovo nije samo sigurnosna briga—to je rizik usklađenosti. Prema Općoj uredbi o zaštiti podataka (GDPR / DSGVO), tvrtke su zakonski obvezne štititi pristup osobnim podacima korištenjem suvremenih tehničkih i organizacijskih mjera.",
        "Lijepljenje aktivnih vjerodajnica u cloud zapise chata hostirane u SAD-u ili na nešifrirane e-mail poslužitelje bez posvećenog end-to-end šifriranja može povećati izloženost usklađenosti, osobito ako te lozinke daju pristup bazama koje sadrže podatke kupaca ili zaposlenika.",
        "Lokalno šifriranje u pregledniku drastično smanjuje gdje vjerodajnice mogu ostati, držeći svakodnevne predaje usklađenima s pristupom koji stavlja privatnost na prvo mjesto. Ovo nije pravni savjet; tretirajte sigurno dijeljenje vjerodajnica kao jedan dio šire kontrole pristupa, upravljanja lozinkama i politike rotacije.",
      ],
    },
    {
      title: "Kako funkcioniraju poveznice šifrirane u pregledniku",
      paragraphs: [
        "Za brzo, jednokratno dijeljenje lozinki, jednokratne poveznice šifrirane u pregledniku spadaju među najsigurnije i najučinkovitije opcije. Umjesto da šaljete samu vjerodajnicu, šaljete jedinstvenu, privremenu poveznicu na šifriranu bilješku.",
        "Vaš preglednik obavlja težak posao: lozinka se šifrira lokalno prije uploada, tako da posrednički poslužitelj čuva ciphertext—ne vašu sirovu lozinku. Ključ za dešifriranje obično ostaje u fragmentu poveznice, koji preglednici ne šalju poslužitelju.",
      ],
      flowIntro:
        "Da biste podijelili tajnu pomoću privremene, samouništavajuće poveznice, slijedite ova četiri koraka:",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Unos i lokalno šifriranje",
          body: "Unesite lozinku u siguran alat. Vaš preglednik je šifrira lokalno ključem koji nikada ne napušta vaš stroj u čistom tekstu.",
        },
        {
          step: "Korak 2",
          title: "Generiranje poveznice",
          body: "Alat uploadira samo šifrirani payload na zero-knowledge poslužitelj i gradi jedinstvenu poveznicu za dijeljenje. Materijal za dešifriranje ostaje uz poveznicu—ne u poslužiteljskom trezoru čitljivih tajni.",
        },
        {
          step: "Korak 3",
          title: "Slanje poveznice",
          body: "Kopirajte i pošaljite poveznicu putem Microsoft Teamsa, e-pošte ili WhatsAppa. Platforma za chat vidi URL, ne vašu lozinku.",
        },
        {
          step: "Korak 4",
          title: "Otkrivanje i samouništenje",
          body: "Preglednik primatelja dešifrira sadržaj lokalno. Ovisno o politici dijeljenja, šifrirani payload zatim može biti uklonjen s poslužitelja nakon pregleda ili nakon kratkog prozora isteka.",
        },
      ],
      midCta: {
        body: "Trebate podijeliti lozinku sada? Izradite šifriranu jednokratnu bilješku i pošaljite sigurnu poveznicu umjesto same lozinke.",
        button: "Izradi privatnu bilješku",
      },
    },
    {
      title: "Savjet za visoku sigurnost: dijeljenje preko razdvojenih kanala",
      paragraphs: [
        "Šifrirana poveznica sigurna je onoliko koliko i kanal kojim je šaljete. Ako zlonamjerna treća strana dobije pristup vašem Teamsu ili e-mail pretincu, može presresti poveznicu prije nego što je primatelj otvori.",
        "Mnogi alati za sigurno dijeljenje—uključujući PrivateNote.ai—nude opcionalnu postavku da se bilješka umota dodatnom lozinkom (passphrase wrapping). To nije uključeno prema zadanim postavkama: uključite ga kad izradite bilješku, odaberite prolaznu frazu, a primatelj je mora unijeti prije nego što se tajna otkrije.",
        "Da biste spriječili jednu točku otkaza (SPoF) za visoko osjetljive vjerodajnice, koristite tu opciju za dijeljenje preko razdvojenih kanala: generirajte šifriranu poveznicu s uključenom zaštitom prolaznom frazom, pošaljite poveznicu primarnim kanalom (na primjer Microsoft Teams), a prolaznu frazu pošaljite potpuno drugim kanalom—poželjno messengerom usmjerenim na privatnost kao što su Signal ili Threema, ili kratkim telefonskim pozivom.",
      ],
      callout:
        "Napadaču bi trebali i poveznica i prolazna fraza. Ta razdvojenost čini dijeljenje preko razdvojenih kanala djelotvornim.",
    },
    {
      title: "Dijeljenje putem upravitelja lozinki naspram jednokratnih poveznica",
      paragraphs: [
        "Obje metode mogu biti vrlo sigurne, ali služe različitim svrhama. Izbor pravog alata ovisi o tome koliko dugo primatelju treba pristup.",
      ],
      comparisonTable: {
        headers: ["Kategorija", "Najbolje za", "Tehnička ograničenja"],
        rows: [
          [
            "E-pošta, Teams ili WhatsApp",
            "Nije preporučeno za lozinke",
            "Ostavlja trajne, pretražive kopije u čistom tekstu u sigurnosnim kopijama i arhivama",
          ],
          [
            "Upravitelji lozinki",
            "Trajni pristup: dijeljenje trezora s članovima obitelji, internim odjelima ili pouzdanim osnovnim timovima",
            "Zahtijeva da obje strane održavaju aktivne, kompatibilne račune upravitelja lozinki",
          ],
          [
            "Jednokratne šifrirane poveznice",
            "Privremeni pristup: freelanceri, korisnička podrška, posjetitelji i jednokratne predaje",
            "Svatko s poveznicom može pročitati tajnu osim ako nije zaštićena sekundarnom prolaznom frazom",
          ],
        ],
        after: [
          "Kao pravilo: koristite **upravitelj lozinki** za trajni dijeljeni pristup, a **jednokratnu šifriranu poveznicu** kad vjerodajnicu treba promijeniti ubrzo nakon predaje.",
        ],
      },
    },
    {
      title: "Kad koristiti jednokratnu poveznicu za lozinku",
      paragraphs: [
        "Jednokratno dijeljenje lozinki idealno je za transakcijske vjerodajnice koje treba priopćiti samo jednom. Uobičajeni primjeri na europskim radnim mjestima uključuju:",
      ],
      useCaseTable: {
        headers: ["Odjel", "Uobičajeni slučajevi uporabe"],
        rows: [
          [
            "Administracija i ured",
            "Lozinke za router ili uredski gostujući Wi-Fi, admin vjerodajnice za pisač ili postavke pametnog ureda",
          ],
          [
            "Financije i poslovanje",
            "Vjerodajnice za poreznog savjetnika ili vanjske financijske revizore",
          ],
          [
            "IT i operacije",
            "Onboarding privremenih vanjskih IT pružatelja usluga ili dijeljenje privremenih prijava za izvođače",
          ],
          [
            "Tehnički timovi",
            "Vjerodajnice baza podataka, API ključevi, SSH ključevi ili lozinke cloud platformi s developerima",
          ],
        ],
      },
    },
    {
      title: "Najbolje prakse i zamke koje treba izbjegavati",
      subsections: [
        {
          title: "Provedite rotaciju",
          paragraphs: [
            "Kad god dijelite lozinku, tretirajte je kao privremenu. Zamolite primatelja da je promijeni čim se prijavi i potvrdite da je rotacija završena prije nego što smatrate predaju gotovom.",
          ],
        },
        {
          title: "Generirajte jake, lokalne lozinke",
          paragraphs: [
            "Ne izmišljajte lozinke sami. Koristite lokalni alat kao što je PrivateNoteov [generator lozinki](app:password-generator), ili [passwords.lu](https://passwords.lu) za opcije prolaznih fraza i PIN-ova. Oba rade lokalno—ništa se ne uploada. Za tehnički model pogledajte [Kako generiramo sigurne lozinke](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Držite vrijeme isteka kratkim",
          paragraphs: [
            "Većini lozinki treba postojati samo nekoliko minuta ili sati. Preferirajte jedan pregled ili kratki prozor kao što su dva sata kad to i dalje odgovara tijeku rada primatelja.",
          ],
        },
        {
          title: "Ne stavljajte lozinke u naslove ili predmete",
          paragraphs: [
            "Nikada ne stavljajte lozinke u čistom tekstu u predmet e-pošte, naslove sustava za tickete, imena Teams kanala, naslove WhatsApp grupa, imena dokumenata ili kalendarske pozivnice. Ta polja rijetko dobivaju istu pažnju kao tijela poruka—i ostaju u indeksima pretraživanja.",
          ],
        },
        {
          title: "Držite kontekst izvan sigurne bilješke",
          paragraphs: [
            "Ako dijelite lozinku baze podataka, ne pišite „Lozinka baze podataka za produkcijski CRM: MySecret123!“ unutar bilješke. Stavite samo sirovu tajnu u šifriranu poveznicu. Ako se poveznica presretne, napadač ne bi trebao saznati i koji račun ili sustav otključava.",
          ],
        },
      ],
      calloutTitle: "Česta pogreška",
      callout:
        "Slanje i šifrirane poveznice i njezine prolazne fraze u istoj Teams poruci, WhatsApp chatu ili e-mailu poništava dijeljenje preko razdvojenih kanala i ponovno stvara jednu točku otkaza.",
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Jesu li Microsoft Teams ili WhatsApp sigurniji od e-pošte?",
          answer:
            "Njihovi protokoli prijenosa općenito su sigurni, ali i dalje funkcioniraju kao dugoročne arhive chata. Svaka lozinka zalijepljena u nit može ostati pretraživa neograničeno, što je čini trajnom ranjivošću.",
        },
        {
          question: "Utječe li GDPR (DSGVO) na način na koji dijelim lozinke?",
          answer:
            "Prema članku 32. GDPR-a, organizacije moraju provesti odgovarajuće tehničke i organizacijske mjere za osiguravanje osobnih podataka. Čuvanje lozinki u čistom tekstu u cloud sigurnosnim kopijama ili otvorenim e-mail nitima povećava izloženost usklađenosti. Zero-knowledge, samouništavajuće poveznice drže trag vjerodajnica manjim.",
        },
        {
          question: "Trebam li slati poveznicu i prolaznu frazu zajedno?",
          answer:
            "Ne. Slanje oba dijela u istoj poruci poništava dijeljenje preko razdvojenih kanala. Pošaljite prolaznu frazu drugim medijem—poželjno Signalom ili Threemom, ili telefonskim pozivom.",
        },
        {
          question: "Trebam li koristiti upravitelj lozinki ili jednokratnu poveznicu?",
          answer:
            "Koristite upravitelj lozinki za dugoročni dijeljeni pristup. Koristite jednokratnu poveznicu šifriranu u pregledniku kad trebate priopćiti lozinku samo jednom.",
        },
        {
          question: "Treba li mi i dalje upravitelj lozinki?",
          answer:
            "Da. Upravitelji lozinki ostaju pravo mjesto za pohranu i upravljanje vjerodajnicama koje zadržavate. Jednokratne šifrirane poveznice ih nadopunjuju za kontrolirane, privremene predaje.",
        },
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "Sigurno dijeljenje lozinki ne mora biti usko grlo za vaš tijek rada. Zahtijeva samo malu promjenu navike: prestanite ostavljati osjetljive podatke da trajno leže u zapisima chata i povijestima pretinaca.",
        "Korištenjem lokalnog šifriranja u pregledniku i samouništavajućih poveznica smanjujete organizacijski sigurnosni i rizik usklađenosti, dok predaje ostaju brze i praktične.",
        "Sljedeći put kad trebate podijeliti lozinku, izbjegavajte kopiranje i lijepljenje u Microsoft Teams, WhatsApp ili e-poštu. Izradite šifriranu jednokratnu bilješku, pošaljite poveznicu umjesto lozinke i pustite bilješku da istekne nakon što je odslužila svrhu.",
      ],
    },
  ],
  ctaTitle: "Spremni dijeliti sigurno?",
  ctaBody:
    "Izradite privatnu bilješku na PrivateNote.ai da šifrirate vjerodajnice u pregledniku prije uploada. Bilješke mogu isteći automatski ili nakon čitanja, opcionalna zaštita prolaznom frazom dodaje još jedan sloj, a šifrirani podaci bilješke obrađuju se pod EU jurisdikcijom.",
  ctaButton: "Izradi privatnu bilješku",
};
