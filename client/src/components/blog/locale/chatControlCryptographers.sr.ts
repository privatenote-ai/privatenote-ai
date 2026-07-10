import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersSr: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Urednička grafika „Chat Control se vraća“ sa zaključanim čet oblačićem iznad mape Evrope",
  heroCaption: "Ilustracija napravljena za PrivateNote.ai.",
  intro:
    "Danas, u utorak 7. jula, Evropski parlament će verovatno ponovo razmatrati predloženu uredbu o suzbijanju seksualnog zlostavljanja dece (CSAR)—koju kritičari često nazivaju Chat Control. Cilj predloga nije sporan: deca moraju biti zaštićena od užasnog zlostavljanja. Tehničko pitanje je da li obavezno skeniranje privatne komunikacije to može postići bez razbijanja bezbednosnih garancija od kojih svi zavise.",
  updatePrefix:
    "**Ažuriranje (9. jula 2026.):** Parlament je produžio Chat Control 1.0 iako je više poslanika glasalo protiv nego za.",
  updateLink: "Pročitajte šta se dogodilo i zašto",
  updateSuffix: ".",
  calloutTitle: "Ova rasprava ne ide o tome da li treba boriti se protiv zlostavljanja dece.",
  calloutBody:
    "Žrtve zaslužuju zaštitu. Progon zaslužuje efikasne alate. Platforme bi trebalo brzo prijavljivati poznati ilegalni sadržaj i sarađivati u istragama. Spor je da li masovno skeniranje svih privatnih poruka može biti tehnički smislen put do toga.",
  expertEyebrow: "Stručno upozorenje",
  expertTitle: "Bart Preneel: bezbednosna zajednica je neobično složna",
  expertParagraphs: [
    "Bart Preneel, profesor na KU Leuvenu i jedan od najpoznatijih evropskih stručnjaka za kriptografiju, privatnost i digitalna prava, danas je upozorio da se Chat Control vraća na treće glasanje nakon dva prethodna nerešena. U svom LinkedIn postu opisao je predlog kao opšte skeniranje nešifrovane komunikacije, sada prošireno AI-jem za traženje novog CSAM-a.",
    "Preneel je takođe ukazao na neobično širok stručni konsenzus iza kritike: Više od 800 stručnjaka za sajber bezbednost i privatnost upozorava da masovno skeniranje i AI analiza sadržaja i dalje imaju neprihvatljive stope grešaka, postavljaju ozbiljna pitanja proporcionalnosti i manje su efikasni od ciljanih pristupa. Kako je formulirao, bezbednosna zajednica retko postiže ovaj nivo složnosti oko jedne teme.",
    "Njegova praktična preporuka je direktna: kontaktirajte članove Evropskog parlamenta i objasnite zašto opšte skeniranje nije smislen put za rešavanje ozbiljnog problema širenja CSAM-a.",
    "Za tehničku pozadinu upućuje na dva naučna pisma: otvoreno pismo iz septembra 2025. koje objašnjava ključne zabrinutosti oko klijentskog skeniranja i AI prepoznavanja, te nastavak iz novembra 2025. koji tvrdi da predloženo proširenje pojačava iste rizike koje je bezbednosna zajednica već identifikovala.",
  ],
  expertLinks: {
    preneel: "LinkedIn post Bart Preneela",
    sep2025: "Otvoreno pismo septembar 2025.",
    nov2025: "Nastavak novembar 2025.",
  },
  technicalConcerns: [
    {
      title: "AI ne može pouzdano klasifikovati nepoznati CSAM u internet razmeri",
      body: "Klasifikacija slika zavisi od konteksta. Porodične fotografije, medicinske slike, nastavni materijal i saglasne slike među mladima teško je čak i ljudima ispravno proceniti.",
    },
    {
      title: "Podudaranje poznatih slika može se zaobići",
      body: "Obrezivanje, skaliranje, kompresija, male promene piksela i adversarialne perturbacije mogu sliku ostaviti prepoznatljivom ljudima, dok je automatizovani sistemi podudaranja vide drugačije.",
    },
    {
      title: "Klijentsko skeniranje menja model poverenja šifrovanja",
      body: "Algoritam šifrovanja može matematički ostati jak, ali softver mora proveravati sadržaj pre nego ga šifrovanje zaštiti. To nije garancija privatnosti koju korisnici očekuju od end-to-end šifrovanja.",
    },
    {
      title: "Infrastruktura za skeniranje postaje vredna meta napada",
      body: "Kada uređaji moraju proveravati privatne poruke, isti mehanizam može privući napadače, politički pritisak i buduće zahteve za skeniranjem dodatnih kategorija sadržaja.",
    },
  ],
  protectedGroups: [
    "Novinari i poverljivi izvori",
    "Advokati i klijenti",
    "Lekari i pacijenti",
    "Kompanije koje štite poslovne tajne",
    "Državni službenici i diplomati",
    "Komunikacija tela za gonjenje i vojske",
  ],
  betterInvestments: [
    { title: "Podržati žrtve", body: "Kanali prijave osetljivi na traumu i dugoročna pomoć žrtvama." },
    { title: "Finansirati specijaliste", body: "Više kapaciteta za obučene istražne timove." },
    { title: "Istražiti dokaze", body: "Brza, ciljana istraga na osnovu konkretnih tragova i prijava." },
    { title: "Raditi prekogranično", body: "Međunarodna saradnja kada počinioci, platforme i žrtve obuhvataju više pravnih sistema." },
    { title: "Ukloniti potvrđeni sadržaj", body: "Brže uklanjanje poznatog ilegalnog sadržaja nakon pravilne potvrde." },
    { title: "Sprečiti zlostavljanje ranije", body: "Edukacija i prevencija pre nego zlostavljanje nastane." },
  ],
  betterInvestmentEyebrow: "Bolja investicija",
  betterInvestmentTitle: "Ojačati rad koji direktno pomaže žrtvama i istražiteljima",
  sections: {
    proposalReturns: {
      title: "Predlog se stalno vraća",
      paragraphs: [
        "U poslednjim godinama CSAR je prošao kroz nekoliko revizija. Neke poboljšanja zaslužuju priznanje: brža obrada dobrovoljnih prijava, jasnije obaveze i uže kategorije sadržaja bolji su od širih, nejasnih mandata.",
        "Te promene ne uklanjaju središnji tehnički problem. Najkontroverznije verzije Chat Controla i dalje se oslanjaju na tehnologije prepoznavanja pred kojima kriptografi, informatičari i istraživači bezbednosti upozoravaju—nisu dovoljno pouzdane za stotine miliona privatnih komunikacija.",
      ],
    },
    cryptographersObject: { title: "Zašto kriptografi i dalje prigovaraju" },
    e2eeScanning: {
      title: "End-to-end šifrovanje ne preživljava obavezno klijentsko skeniranje",
      paragraphs: [
        "End-to-end šifrovanje daje korisnicima jednostavno obećanje: samo pošiljalac i namereni primalac mogu pročitati poruku. Obavezno klijentsko skeniranje menja to obećanje. Uređaj mora proveriti poruku pre nego je šifrovanje zaštiti, i prijaviti sve što sistem za skeniranje smatra sumnjivim.",
        "U prenosu poruka može i dalje biti snažno šifrovana. Problem je pre toga. Ako softver mora proveravati čist tekst na uređaju i prijavljivati pogotke spoljašnjem sistemu, krajnja tačka više ne deluje samo za korisnika. To je drugačiji model poverenja od end-to-end šifrovanja kako ga ljudi razumeju.",
      ],
    },
    encryptionProtects: {
      title: "Šifrovanje štiti više od privatnih četova",
      intro:
        "Javna rasprava često zvuči kao da se šifrovana komunikacija odnosi samo na opuštene razgovore. To nije tačno. Sigurna privatna komunikacija kritična je infrastruktura za ljude i institucije sa realnim rizikom.",
    },
    moreTech: {
      title: "Više tehnologije ne znači automatski više bezbednosti",
      paragraphs: [
        "Predlog stoji uz šire zahteve za proverom starosti i dodatnim sistemima zaštite. To zvuči kao dodatni bezbednosni slojevi, ali bezbednosno inženjerstvo retko se poboljšava složenošću bez razumevanja novih površina napada.",
        "Centralizovane provere identiteta, cevovodi za skeniranje, redovi za pregled i infrastruktura za prijavljivanje mogu uvesti sopstvene rizike privatnosti. Sistem za zaštitu dece ne bi trebalo tiho stvarati nove baze podataka, nove podsticaje za nadzor i nove načine grešaka za sve.",
      ],
    },
    betterWays: {
      title: "Postoje bolji načini zaštite dece",
      intro:
        "Jedna tačka iz naučne kritike zaslužuje posebnu pažnju: CSAM je dokaz ranijeg krivičnog dela. Pravi cilj trebalo bi biti sprečiti zlostavljanje, podržati žrtve i omogućiti ciljane istrage koje stvarno identifikuju počinioce.",
    },
    privateNote: {
      title: "Zašto je to važno za PrivateNote",
      paragraphs: [
        "Kod PrivateNotea načelo je jednostavno: kada stvorite šifrovanu belešku, samo oni koje odaberete treba da je mogu pročitati. Ne mi. Ne oglašivači. Ne provajderi oblaka. Niko drugi.",
        "To načelo nije slogan. Odražava decenije kriptografskog inženjeringa. Rasprava o Chat Controlu pita da li privatna komunikacija zaista treba da ostane privatna—ili svaki uređaj postane obavezna kontrolna tačka koja proverava poruke pre nego se šifruju.",
      ],
    },
    policyReality: {
      title: "Politika bi trebalo da prati tehničku stvarnost",
      paragraphs: [
        "Razumni ljudi mogu se razilaziti u politici. **Ali politika bi trebalo da bude informisana tehničkom stvarnošću.** Kada stotine kriptografa, informatičara, bezbednosnih inženjera i istraživača privatnosti upozore da predložena tehnologija ne može ispuniti svoja obećanja bez slabljenja temeljnih bezbednosnih garancija, zakonodavci bi trebalo da slušaju.",
        "Zaštita dece i zaštita sigurne komunikacije ne isključuju jedno drugo. Evropa bi trebalo da prati rešenja koja postižu oboje.",
      ],
    },
  },
  ctaTitle: "Šaljite privatne beleške bez davanja ključa serveru",
  ctaBody:
    "PrivateNote šifruje beleške u vašem pretraživaču i drži ključ za dešifrovanje u URL fragmentu.",
  ctaButton: "Isprobajte PrivateNote ->",
};
