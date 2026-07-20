import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionHr: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "iPhone i Android telefon s ikonama lokota u oblačićima poruka, povezani središnjim lokotom koji predstavlja end-to-end enkriptirani RCS",
  heroCaption:
    "Cross-platform RCS napokon sustiže: ista garancija end-to-end enkripcije, bilo da je oblačić plav ili zelen.",
  intro: [
    "Godinama je jedna od najvećih frustracija u mobilnim porukama bila manjak dosljedne privatnosti, a ne manjak značajki.",
    "Apple korisnici su imali end-to-end enkriptirane razgovore putem iMessagea, dok su Android korisnici mogli imati koristi od enkripcije kad su koristili Google Messages s drugim Android uređajima. Poruke poslane između Androida i iPhonea nikad nisu imale istu zaštitu. Cross-platform razgovori oslanjali su se na Rich Communication Services (RCS), ali bez interoperabilne end-to-end enkripcije.",
    "To se konačno mijenja.",
    "Google je nedavno objavio da počinje uvođenje end-to-end enkriptiranih RCS poruka između Androida i iPhonea, nakon objave najnovijeg GSMA RCS Universal Profilea, koji uključuje protokol Messaging Layer Security (MLS). Kako se podrška širi na uređaje i aplikacije za poruke, milijarde korisnika dobit će jaču privatnost za svakodnevne razgovore.",
    "Ovo je značajna prekretnica za digitalnu komunikaciju. Također je dobra prilika za razumijevanje što [end-to-end enkripcija](blog:what-is-end-to-end-encryption) zapravo štiti — a što ne.",
  ],
  sections: [
    {
      title: "Bolji standard za svakodnevne poruke",
      paragraphs: [
        "Prijelaz s SMS-a na RCS modernizirao je razmjenu tekstualnih poruka značajkama kao što su slanje fotografija visoke kvalitete, indikatori tipkanja, potvrde o pročitanom i bogatiji grupni razgovori. Sigurnost je, međutim, ostala nedosljedna, ovisno o tome koji su uređaji bili uključeni.",
        "Do sada su Android korisnici koji su razmjenjivali poruke s drugim Android korisnicima mogli imati end-to-end enkripciju putem Google Messagesa, dok su iPhone korisnici imali istu zaštitu unutar iMessagea. Poruke razmijenjene između Androida i iPhonea, međutim, nisu imale interoperabilnu end-to-end enkripciju.",
        "Ažurirani RCS standard to mijenja. Kako se podrška uvodi, korisnici na obje platforme napokon mogu imati koristi od istih temeljnih garancija privatnosti, bez obzira koji telefon imaju.",
        "Za komunikacijsku tehnologiju koju koriste milijarde ljudi, ovo je važan korak napravljen unaprijed.",
      ],
    },
    {
      title: "Što end-to-end enkripcija zapravo znači",
      paragraphs: [
        "End-to-end enkripcija znači da se poruka enkriptira prije nego što napusti uređaj pošiljatelja i da se može dekriptirati samo na uređaju primatelja.",
        "Za razliku od tradicionalne transportne enkripcije, gdje davatelj usluge možda može pristupiti porukama kad stignu na njegove servere, end-to-end enkripcija osigurava da samo uređaji koji komuniciraju posjeduju ključeve potrebne za čitanje razgovora. Usluga za poruke prenosi enkriptirane podatke, ali ne može dekriptirati njihov sadržaj.",
        "Za korisnike je prednost jednostavna: vaš razgovor ostaje privatan između vas i osobe s kojom razgovarate.",
        "Pravilno implementirana end-to-end enkripcija štiti od mnogih uobičajenih prijetnji. Netko koji nadzire javnu Wi-Fi mrežu ne može jednostavno pročitati vaše poruke, internetski davatelji usluga ne mogu pregledati njihov sadržaj, a proboj na servere davatelja usluge za poruke izložio bi enkriptirane podatke, a ne razgovore koji se mogu čitati.",
        "Za svakodnevnu komunikaciju, ovo predstavlja značajno poboljšanje privatnosti. Za dublju tehničku definiciju, pogledajte naš vodič o tome [što znači end-to-end enkripcija](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Enkripcija ima ograničenja",
      paragraphs: [
        "Koliko god je end-to-end enkripcija važna, često se pogrešno razumije.",
        "Enkripcija štiti poruke tijekom prijenosa i dok su spremljene kod davatelja usluge za poruke. Ne kontrolira što se događa nakon što je poruka isporučena.",
        "Kad se poruka dekriptira na telefonu primatelja, ona opet postaje obična informacija. Primatelj je može čuvati neograničeno, proslijediti nekom drugom, kopirati njezin sadržaj u drugu aplikaciju, ili jednostavno snimiti zaslon. Ovisno o platformi za poruke, razgovori se također mogu sinkronizirati preko više uređaja ili biti uključeni u cloud sigurnosne kopije.",
        "Drugim riječima, end-to-end enkripcija osigurava isporuku — ne garantira da informacija nestaje nakon što je pročitana.",
      ],
      callout:
        "Ova razlika postaje sve važnija kad su informacije koje se dijele posebno osjetljive — lozinke, kodovi za oporavak, API ključevi i drugi podaci za pristup koji ne bi trebali zauvijek ostati u pretraživoj povijesti chata.",
    },
    {
      title: "Ne svaka tajna spada u povijest chata",
      paragraphs: [
        "Većina razgovora zaslužuje da bude sačuvana. Poruke s obitelji, razgovori s prijateljima ili razgovori vezani za posao često postaju koristan zapis koji ljudi očekuju ponovno pregledati kasnije.",
        "Osjetljivi podaci za pristup su drugačiji.",
        "Zamislite da šaljete privremenu administratorsku lozinku kolegi. Lozinka putuje sigurno preko interneta zahvaljujući end-to-end enkripciji, ali šest mjeseci kasnije možda se još nalazi u pretraživoj povijesti razgovora. Isto se odnosi na API ključeve, kodove za oporavak, seed fraze za kriptovalute, povjerljive podatke o klijentima ili privremene podatke za prijavu.",
        "U mnogim stvarnim sigurnosnim incidentima, problem nije to što je tajna presretnuta tijekom prijenosa. Problem je što je ostala spremljena negdje dugo nakon što je trebala biti zaboravljena.",
        "Kako poruke postaju sve sigurnije, pažnja se postupno pomiče prema drugačijem izazovu: smanjenju nepotrebne trajnosti. Zato neke [tajne nikad ne treba slati u chatu](blog:secrets-never-send-in-chat) — enkriptirane ili ne.",
      ],
    },
    {
      title: "Kad jednokratni linkovi imaju više smisla",
      paragraphs: [
        "Za informacije koje treba podijeliti samo jednom, ostavljanje unutar trajnog razgovora nije uvijek idealno.",
        "Sve češća alternativa je dijeljenje osjetljivih informacija putem [enkriptiranih jednokratnih linkova](blog:one-time-secret-links) koji automatski ističu ili postaju nedostupni nakon pregleda. Umjesto da se tajna izravno ugradi u tekući razgovor, primatelj otvara namjenski link, preuzima informaciju, a link na kraju ističe — ili mu se, u nekim slučajevima, može pristupiti samo jednom.",
        "Ovaj pristup ne zamjenjuje enkriptirane poruke. Umjesto toga, nadopunjuje ih rješavajući drugačiji problem.",
        "Aplikacije za poruke namijenjene su čuvanju razgovora. Jednokratni linkovi namijenjeni su minimiziranju dugoročne izloženosti informacija koje idealno ne bi trebale ostati spremljene neograničeno.",
        "Bilo da dijelite privremenu lozinku, API token, ključ za licencu softvera ili drugu povjerljivu vrijednost, ograničavanje toga koliko dugo ta informacija postoji može znatno smanjiti rizik od kasnijeg slučajnog otkrivanja.",
      ],
    },
    {
      title: "Privatnost je više od enkripcije",
      paragraphs: [
        "Uvođenje interoperabilnih end-to-end enkriptiranih RCS poruka zaista je dobra vijest. Po prvi put, Android i iPhone korisnici mogu imati istu razinu zaštite bez obzira koji ekosustav koriste.",
        "Također je podsjetnik da se privatnost odnosi na više od same enkripcije.",
        "Zaštita informacija dok putuju preko interneta neophodna je, ali je jednako važno razmišljati o tome što se događa nakon toga. Neke informacije zaslužuju ostati dostupne godinama. Druge informacije — posebno lozinke, kodovi za oporavak i privremeni podaci za pristup — često su sigurnije kad postoje samo onoliko dugo koliko je potrebno.",
        "Moderne aplikacije za poruke i usluge za jednokratno dijeljenje tajni imaju različite namjene. Nijedna ne zamjenjuje drugu; umjesto toga, bave se različitim aspektima sigurne komunikacije. Izbor pravog pristupa ovisi o tome što dijelite i koliko dugo to treba postojati.",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Zamjenjuje li ovo SMS?",
          answer:
            "Ne. Tradicionalne SMS poruke ostaju neenkriptirane. Nova zaštita odnosi se samo na kompatibilne RCS razgovore kad i uređaji i aplikacije za poruke podržavaju najnoviji end-to-end enkriptirani RCS standard.",
        },
        {
          question: "Mogu li Google ili Apple čitati enkriptirane RCS poruke?",
          answer:
            "End-to-end enkripcija je osmišljena tako da samo uređaji koji komuniciraju posjeduju ključeve potrebne za dekriptiranje poruka. Davatelji usluga prenose enkriptirane podatke, ali ne mogu pristupiti čistom tekstu vaših razgovora.",
        },
        {
          question: "Može li netko i dalje snimiti zaslon?",
          answer:
            "Da. Kad se poruka dekriptira na uređaju primatelja, on i dalje može snimati zaslon, kopirati sadržaj ili ga proslijediti drugima. End-to-end enkripcija štiti prijenos poruke, ne to što primatelj odluči raditi s njom nakon toga.",
        },
        {
          question: "Jesu li jednokratni linkovi sigurniji od aplikacija za poruke?",
          answer:
            "Ne nužno — oni rješavaju drugačiji problem. End-to-end enkriptirane poruke izvrsne su za tekuće razgovore. [Jednokratni linkovi ili linkovi koji ističu](blog:one-time-secret-links) često su pogodniji za dijeljenje osjetljivih informacija koje ne bi trebale neograničeno ostati spremljene u povijesti chata.",
        },
      ],
    },
  ],
  referencesTitle: "Dodatno štivo",
  references: [
    {
      label:
        "Android i iPhone korisnici sada mogu koristiti end-to-end enkriptirane RCS poruke (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Dijelite tajne koje ne bi trebale živjeti u chatu",
  ctaBody:
    "Kad trebate nekome predati lozinku, API ključ ili kod za oporavak, pošaljite enkriptiranu jednokratnu bilješku na strani preglednika umjesto da je zalijepite u Messages. Postavite kratak istek ili brisanje nakon čitanja, tako da tajna ne ostane u pretraživoj povijesti.",
  ctaButton: "Kreiraj privatnu bilješku",
};
