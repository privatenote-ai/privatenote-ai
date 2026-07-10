import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersHr: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Urednička grafika „Chat Control se vraća“ sa zaključanim chat oblačićem iznad karte Europe",
  heroCaption: "Ilustracija izrađena za PrivateNote.ai.",
  intro:
    "Danas, u utorak 7. srpnja, Europski parlament će vjerojatno ponovno razmatrati predloženu uredbu o suzbijanju seksualnog zlostavljanja djece (CSAR)—koju kritičari često nazivaju Chat Control. Cilj prijedloga nije sporan: djeca moraju biti zaštićena od užasnog zlostavljanja. Tehničko pitanje je može li obvezno skeniranje privatne komunikacije to postići bez razbijanja sigurnosnih jamstava od kojih svi ovise.",
  updatePrefix:
    "**Ažuriranje (9. srpnja 2026.):** Parlament je produljio Chat Control 1.0 iako je više zastupnika glasovalo protiv nego za.",
  updateLink: "Pročitajte što se dogodilo i zašto",
  updateSuffix: ".",
  calloutTitle: "Ova rasprava ne ide o tome treba li se boriti protiv zlostavljanja djece.",
  calloutBody:
    "Žrtve zaslužuju zaštitu. Progon zaslužuje učinkovite alate. Platforme bi trebale brzo prijavljivati poznati ilegalni sadržaj i surađivati u istragama. Spor je može li masovno skeniranje svih privatnih poruka biti tehnički smislen put do toga.",
  expertEyebrow: "Stručno upozorenje",
  expertTitle: "Bart Preneel: sigurnosna zajednica neobično je složna",
  expertParagraphs: [
    "Bart Preneel, profesor na KU Leuvenu i jedan od najpoznatijih europskih stručnjaka za kriptografiju, privatnost i digitalna prava, danas je upozorio da se Chat Control vraća na treće glasovanje nakon dva prethodna neriješena. U svom LinkedIn objavi opisao je prijedlog kao opće skeniranje nešifrirane komunikacije, sada prošireno AI-jem za traženje novog CSAM-a.",
    "Preneel je također ukazao na neobično širok stručni konsenzus iza kritike: Više od 800 stručnjaka za kibernetičku sigurnost i privatnost upozorava da masovno skeniranje i AI analiza sadržaja i dalje imaju neprihvatljive stope pogrešaka, postavljaju ozbiljna pitanja proporcionalnosti i manje su učinkoviti od ciljanih pristupa. Kako je formulirao, sigurnosna zajednica rijetko postiže ovu razinu složnosti oko jedne teme.",
    "Njegova praktična preporuka je izravna: kontaktirajte članove Europskog parlamenta i objasnite zašto opće skeniranje nije smislen put za rješavanje ozbiljnog problema širenja CSAM-a.",
    "Za tehničku pozadinu upućuje na dva znanstvena pisma: otvoreno pismo iz rujna 2025. koje objašnjava ključne zabrinutosti oko klijentskog skeniranja i AI prepoznavanja, te nastavak iz studenog 2025. koji tvrdi da predloženo proširenje pojačava iste rizike koje je sigurnosna zajednica već identificirala.",
  ],
  expertLinks: {
    preneel: "LinkedIn objava Bart Preneela",
    sep2025: "Otvoreno pismo rujan 2025.",
    nov2025: "Nastavak studeni 2025.",
  },
  technicalConcerns: [
    {
      title: "AI ne može pouzdano klasificirati nepoznati CSAM u internetskom mjerilu",
      body: "Klasifikacija slika ovisi o kontekstu. Obiteljske fotografije, medicinske slike, nastavni materijal i suglasne slike među mladima teško je čak i ljudima ispravno procijeniti.",
    },
    {
      title: "Podudaranje poznatih slika može se zaobići",
      body: "Obrezivanje, skaliranje, kompresija, male promjene piksela i adversarialne perturbacije mogu sliku ostaviti prepoznatljivom ljudima, dok je automatizirani sustavi podudaranja vide drugačije.",
    },
    {
      title: "Klijentsko skeniranje mijenja model povjerenja šifriranja",
      body: "Algoritam šifriranja može matematički ostati jak, ali softver mora provjeravati sadržaj prije nego ga šifriranje zaštiti. To nije jamstvo privatnosti koje korisnici očekuju od end-to-end šifriranja.",
    },
    {
      title: "Infrastruktura za skeniranje postaje vrijedna meta napada",
      body: "Kad uređaji moraju provjeravati privatne poruke, isti mehanizam može privući napadače, politički pritisak i buduće zahtjeve za skeniranjem dodatnih kategorija sadržaja.",
    },
  ],
  protectedGroups: [
    "Novinari i povjerljivi izvori",
    "Odvjetnici i klijenti",
    "Liječnici i pacijenti",
    "Tvrtke koje štite poslovne tajne",
    "Državni službenici i diplomati",
    "Komunikacija tijela za progon i vojske",
  ],
  betterInvestments: [
    { title: "Podržati žrtve", body: "Kanali prijave osjetljivi na traumu i dugoročna pomoć žrtvama." },
    { title: "Financirati specijaliste", body: "Više kapaciteta za obučene istražne timove." },
    { title: "Istražiti dokaze", body: "Brza, ciljana istraga na temelju konkretnih tragova i prijava." },
    { title: "Raditi prekogranično", body: "Međunarodna suradnja kad počinitelji, platforme i žrtve obuhvaćaju više pravnih sustava." },
    { title: "Ukloniti potvrđeni sadržaj", body: "Brže uklanjanje poznatog ilegalnog sadržaja nakon pravilne potvrde." },
    { title: "Spriječiti zlostavljanje ranije", body: "Edukacija i prevencija prije nego zlostavljanje nastane." },
  ],
  betterInvestmentEyebrow: "Bolja investicija",
  betterInvestmentTitle: "Ojačati rad koji izravno pomaže žrtvama i istražiteljima",
  sections: {
    proposalReturns: {
      title: "Prijedlog se stalno vraća",
      paragraphs: [
        "U posljednjim godinama CSAR je prošao kroz nekoliko revizija. Neke poboljšanja zaslužuju priznanje: brža obrada dobrovoljnih prijava, jasnije obveze i uže kategorije sadržaja bolji su od širih, nejasnih mandata.",
        "Te promjene ne uklanjaju središnji tehnički problem. Najkontroverznije verzije Chat Controla i dalje se oslanjaju na tehnologije prepoznavanja pred kojima kriptografi, informatičari i istraživači sigurnosti upozoravaju—nisu dovoljno pouzdane za stotine milijuna privatnih komunikacija.",
      ],
    },
    cryptographersObject: { title: "Zašto kriptografi i dalje prigovaraju" },
    e2eeScanning: {
      title: "End-to-end šifriranje ne preživljava obvezno klijentsko skeniranje",
      paragraphs: [
        "End-to-end šifriranje daje korisnicima jednostavno obećanje: samo pošiljatelj i namjereni primatelj mogu pročitati poruku. Obvezno klijentsko skeniranje mijenja to obećanje. Uređaj mora provjeriti poruku prije nego je šifriranje zaštiti, i prijaviti sve što sustav za skeniranje smatra sumnjivim.",
        "U prijenosu poruka može i dalje biti snažno šifrirana. Problem je prije toga. Ako softver mora provjeravati čisti tekst na uređaju i prijavljivati pogotke vanjskom sustavu, krajnja točka više ne djeluje samo za korisnika. To je drugačiji model povjerenja od end-to-end šifriranja kako ga ljudi razumiju.",
      ],
    },
    encryptionProtects: {
      title: "Šifriranje štiti više od privatnih chatova",
      intro:
        "Javna rasprava često zvuči kao da se šifrirana komunikacija odnosi samo na opuštene razgovore. To nije točno. Sigurna privatna komunikacija kritična je infrastruktura za ljude i institucije s realnim rizikom.",
    },
    moreTech: {
      title: "Više tehnologije ne znači automatski više sigurnosti",
      paragraphs: [
        "Prijedlog stoji uz šire zahtjeve za provjerom dobi i dodatnim sustavima zaštite. To zvuči kao dodatni sigurnosni slojevi, ali sigurnosno inženjerstvo rijetko se poboljšava složenošću bez razumijevanja novih površina napada.",
        "Centralizirane provjere identiteta, cjevovodi za skeniranje, redovi za pregled i infrastruktura za prijavljivanje mogu uvesti vlastite rizike privatnosti. Sustav za zaštitu djece ne bi trebao tiho stvarati nove baze podataka, nove poticaje za nadzor i nove načine pogrešaka za sve.",
      ],
    },
    betterWays: {
      title: "Postoje bolji načini zaštite djece",
      intro:
        "Jedna točka iz znanstvene kritike zaslužuje posebnu pažnju: CSAM je dokaz ranijeg kaznenog djela. Pravi cilj trebao bi biti spriječiti zlostavljanje, podržati žrtve i omogućiti ciljane istrage koje stvarno identificiraju počinitelje.",
    },
    privateNote: {
      title: "Zašto je to važno za PrivateNote",
      paragraphs: [
        "Kod PrivateNotea načelo je jednostavno: kad stvorite šifriranu bilješku, samo oni koje odaberete trebaju je moći pročitati. Ne mi. Ne oglašivači. Ne pružatelji oblaka. Nitko drugi.",
        "To načelo nije slogan. Odražava desetljeća kriptografskog inženjeringa. Rasprava o Chat Controlu pita treba li privatna komunikacija zaista ostati privatna—ili svaki uređaj postati obvezna kontrolna točka koja provjerava poruke prije nego se šifriraju.",
      ],
    },
    policyReality: {
      title: "Politika bi trebala slijediti tehničku stvarnost",
      paragraphs: [
        "Razumni ljudi mogu se razilaziti u politici. **Ali politika bi trebala biti informirana tehničkom stvarnošću.** Kad stotine kriptografa, informatičara, sigurnosnih inženjera i istraživača privatnosti upozore da predložena tehnologija ne može ispuniti svoja obećanja bez slabljenja temeljnih sigurnosnih jamstava, zakonodavci bi trebali slušati.",
        "Zaštita djece i zaštita sigurne komunikacije ne isključuju jedno drugo. Europa bi trebala slijediti rješenja koja postižu oboje.",
      ],
    },
  },
  ctaTitle: "Šaljite privatne bilješke bez davanja ključa poslužitelju",
  ctaBody:
    "PrivateNote šifrira bilješke u vašem pregledniku i drži ključ za dešifriranje u URL fragmentu.",
  ctaButton: "Isprobajte PrivateNote ->",
};
