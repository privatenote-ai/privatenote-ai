import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionSr: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "iPhone i Android telefon sa ikonicama katanca u oblačićima poruka, povezani centralnim katancem koji predstavlja end-to-end enkriptovan RCS",
  heroCaption:
    "Cross-platform RCS napokon sustiže: ista garancija end-to-end enkripcije, bez obzira da li je oblačić plav ili zelen.",
  intro: [
    "Godinama je jedna od najvećih frustracija u mobilnim porukama bila nedostatak dosledne privatnosti, a ne nedostatak funkcija.",
    "Apple korisnici su imali end-to-end enkriptovane razgovore preko iMessage-a, dok su Android korisnici mogli da koriste enkripciju kada koriste Google Messages sa drugim Android uređajima. Poruke poslate između Android-a i iPhone-a nikad nisu imale istu zaštitu. Cross-platform razgovori su se oslanjali na Rich Communication Services (RCS), ali bez interoperabilne end-to-end enkripcije.",
    "To se konačno menja.",
    "Google je nedavno objavio da počinje uvođenje end-to-end enkriptovanih RCS poruka između Android-a i iPhone-a, nakon objavljivanja najnovijeg GSMA RCS Universal Profile-a, koji uključuje Messaging Layer Security (MLS) protokol. Kako se podrška širi na uređaje i aplikacije za poruke, milijarde korisnika će dobiti jaču privatnost za svakodnevne razgovore.",
    "Ovo je značajna prekretnica za digitalnu komunikaciju. Takođe je dobra prilika da se razume šta [end-to-end enkripcija](blog:what-is-end-to-end-encryption) zapravo štiti — a šta ne.",
  ],
  sections: [
    {
      title: "Bolji standard za svakodnevne poruke",
      paragraphs: [
        "Prelazak sa SMS-a na RCS je modernizovao razmenu tekstualnih poruka funkcijama kao što su deljenje fotografija visokog kvaliteta, indikatori kucanja, potvrde o čitanju i bogatiji grupni razgovori. Bezbednost je, međutim, ostala nedosledna u zavisnosti od toga koji uređaji su bili uključeni.",
        "Do sada su Android korisnici koji su razmenjivali poruke sa drugim Android korisnicima mogli da koriste end-to-end enkripciju preko Google Messages-a, dok su iPhone korisnici imali istu zaštitu unutar iMessage-a. Poruke razmenjene između Android-a i iPhone-a, međutim, nisu imale interoperabilnu end-to-end enkripciju.",
        "Ažurirani RCS standard to menja. Kako se podrška uvodi, korisnici na obe platforme napokon mogu da koriste iste osnovne garancije privatnosti, bez obzira koji telefon imaju.",
        "Za komunikacionu tehnologiju koju koriste milijarde ljudi, ovo je važan korak napred.",
      ],
    },
    {
      title: "Šta end-to-end enkripcija zapravo znači",
      paragraphs: [
        "End-to-end enkripcija znači da se poruka enkriptuje pre nego što napusti uređaj pošiljalja i da se može dešifrovati samo na uređaju primaoca.",
        "Za razliku od tradicionalne transportne enkripcije, gde davatelj usluge možda može da pristupi porukama kada stignu na njegove servere, end-to-end enkripcija osigurava da samo uređaji koji komuniciraju posedaju ključeve potrebne za čitanje razgovora. Usluga za poruke prenosi enkriptovane podatke, ali ne može da dešifruje njihov sadržaj.",
        "Za korisnike je prednost jednostavna: vaš razgovor ostaje privatan između vas i osobe sa kojom razgovarate.",
        "Pravilno implementirana end-to-end enkripcija štiti od mnogih uobičajenih pretnji. Neko koji nadgleda javnu Wi-Fi mrežu ne može jednostavno da čita vaše poruke, internet provajderi ne mogu da pregledaju njihov sadržaj, a proboj na servere provajdera usluge za poruke bi izložio enkriptovane podatke, a ne razgovore koji se mogu čitati.",
        "Za svakodnevnu komunikaciju, ovo predstavlja značajno poboljšanje privatnosti. Za dublju tehničku definiciju, pogledajte naš vodič o tome [šta znači end-to-end enkripcija](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Enkripcija ima ograničenja",
      paragraphs: [
        "Koliko je god end-to-end enkripcija važna, često se pogrešno razume.",
        "Enkripcija štiti poruke tokom prenosa i dok su sačuvane kod provajdera usluge za poruke. Ne kontroliše šta se dešava nakon što je poruka isporučena.",
        "Kada se poruka dešifruje na telefonu primaoca, ona ponovo postaje obična informacija. Primalac je može čuvati neograničeno, proslediti nekom drugom, kopirati njen sadržaj u drugu aplikaciju, ili jednostavno napraviti snimak ekrana. U zavisnosti od platforme za poruke, razgovori se takođe mogu sinhronizovati preko više uređaja ili biti uključeni u cloud rezervne kopije.",
        "Drugim rečima, end-to-end enkripcija obezbeđuje isporuku — ne garantuje da informacija nestaje nakon što je pročitana.",
      ],
      callout:
        "Ova razlika postaje sve važnija kada su informacije koje se dele posebno osetljive — lozinke, kodovi za oporavak, API ključevi i drugi podaci za pristup koji ne bi trebalo da zauvek ostanu u pretraživoj istoriji čata.",
    },
    {
      title: "Ne svaka tajna spada u istoriju čata",
      paragraphs: [
        "Većina razgovora zaslužuje da bude sačuvana. Poruke sa porodicom, razgovori sa prijateljima ili razgovori vezani za posao često postaju koristan zapis koji ljudi očekuju da ponovo pregledaju kasnije.",
        "Osetljivi podaci za pristup su drugačiji.",
        "Zamislite da šaljete privremenu administratorsku lozinku kolegi. Lozinka putuje bezbedno preko interneta zahvaljujući end-to-end enkripciji, ali šest meseci kasnije možda se još nalazi u pretraživoj istoriji razgovora. Isto se odnosi na API ključeve, kodove za oporavak, seed fraze za kriptovalute, poverljive podatke o klijentima ili privremene podatke za prijavu.",
        "U mnogim stvarnim bezbednosnim incidentima, problem nije to što je tajna presretnuta tokom prenosa. Problem je što je ostala sačuvana negde dugo nakon što je trebalo da bude zaboravljena.",
        "Kako poruke postaju sve bezbednije, pažnja se postepeno pomera ka drugačijem izazovu: smanjenju nepotrebne trajnosti. Zato neke [tajne nikad ne treba slati u čatu](blog:secrets-never-send-in-chat) — enkriptovane ili ne.",
      ],
    },
    {
      title: "Kada jednokratni linkovi imaju više smisla",
      paragraphs: [
        "Za informacije koje treba deliti samo jednom, ostavljanje unutar trajnog razgovora nije uvek idealno.",
        "Sve češća alternativa je deljenje osetljivih informacija putem [enkriptovanih jednokratnih linkova](blog:one-time-secret-links) koji automatski ističu ili postaju nedostupni nakon pregleda. Umesto da se tajna direktno ugradi u tekući razgovor, primalac otvara namenski link, preuzima informaciju, a link na kraju ističe — ili, u nekim slučajevima, može mu se pristupiti samo jednom.",
        "Ovaj pristup ne zamenjuje enkriptovane poruke. Umesto toga, dopunjuje ih rešavajući drugačiji problem.",
        "Aplikacije za poruke su namenjene čuvanju razgovora. Jednokratni linkovi su namenjeni minimiziranju dugoročne izloženosti informacija koje idealno ne bi trebalo da ostanu sačuvane neograničeno.",
        "Bilo da delite privremenu lozinku, API token, ključ za licencu softvera ili drugu poverljivu vrednost, ograničavanje toga koliko dugo ta informacija postoji može značajno smanjiti rizik od kasnijeg slučajnog otkrivanja.",
      ],
    },
    {
      title: "Privatnost je više od enkripcije",
      paragraphs: [
        "Uvođenje interoperabilnih end-to-end enkriptovanih RCS poruka je zaista dobra vest. Po prvi put, Android i iPhone korisnici mogu imati isti nivo zaštite bez obzira koji ekosistem koriste.",
        "Takođe je podsetnik da se privatnost odnosi na više od same enkripcije.",
        "Zaštita informacija dok putuju preko interneta je neophodna, ali je isto tako važno razmišljati o tome šta se dešava nakon toga. Neke informacije zaslužuju da ostanu dostupne godinama. Druge informacije — posebno lozinke, kodovi za oporavak i privremeni podaci za pristup — često su bezbednije kada postoje samo onoliko dugo koliko je potrebno.",
        "Moderne aplikacije za poruke i usluge za jednokratno deljenje tajni imaju različite namene. Nijedna ne zamenjuje drugu; umesto toga, bave se različitim aspektima bezbedne komunikacije. Izbor pravog pristupa zavisi od toga šta delite i koliko dugo to treba da postoji.",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li ovo zamenjuje SMS?",
          answer:
            "Ne. Tradicionalne SMS poruke ostaju neenkriptovane. Nova zaštita se odnosi samo na kompatibilne RCS razgovore kada i uređaji i aplikacije za poruke podržavaju najnoviji end-to-end enkriptovani RCS standard.",
        },
        {
          question: "Mogu li Google ili Apple da čitaju enkriptovane RCS poruke?",
          answer:
            "End-to-end enkripcija je osmišljena tako da samo uređaji koji komuniciraju posedaju ključeve potrebne za dešifrovanje poruka. Provajderi prenose enkriptovane podatke, ali ne mogu da pristupe čistom tekstu vaših razgovora.",
        },
        {
          question: "Da li neko još može da napravi snimak ekrana?",
          answer:
            "Da. Kada se poruka dešifruje na uređaju primaoca, on i dalje može da pravi snimke ekrana, kopira sadržaj ili ga prosledi drugima. End-to-end enkripcija štiti prenos poruke, ne to šta primalac odluči da radi sa njom nakon toga.",
        },
        {
          question: "Da li su jednokratni linkovi bezbedniji od aplikacija za poruke?",
          answer:
            "Ne nužno — oni rešavaju drugačiji problem. End-to-end enkriptovane poruke su izvrsne za tekuće razgovore. [Jednokratni ili linkovi koji ističu](blog:one-time-secret-links) su često pogodniji za deljenje osetljivih informacija koje ne bi trebalo da ostanu neograničeno sačuvane u istoriji čata.",
        },
      ],
    },
  ],
  referencesTitle: "Dodatno štivo",
  references: [
    {
      label:
        "Android i iPhone korisnici sada mogu da koriste end-to-end enkriptovane RCS poruke (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Delite tajne koje ne treba da žive u čatu",
  ctaBody:
    "Kada treba da nekom predate lozinku, API ključ ili kod za oporavak, pošaljite enkriptovanu jednokratnu belešku sa strane pregledača umesto da je nalepite u Messages. Podesite kratak istek ili brisanje nakon čitanja da tajna ne bi ostala u pretraživoj istoriji.",
  ctaButton: "Kreiraj privatnu belešku",
};
