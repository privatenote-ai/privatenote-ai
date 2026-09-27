import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteHr: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret i PrivateNote rješavaju isti praktični problem: prenijeti lozinku, API ključ, kod za oporavak ili povjerljivu bilješku privremenom poveznicom umjesto ostavljanja otvorenog teksta u e-pošti ili chatu. Primatelj otvara poveznicu, a pohranjeni payload može nestati nakon što je pročitan ili kad istekne vrijeme valjanosti.",
    "Oba proizvoda enkriptiraju payload. Važna razlika je gdje se enkripcija događa.",
    "OneTimeSecret svoju arhitekturu opisuje kao enkripciju na poslužitelju. Otvoreni tekst stiže do OneTimeSecreta prije nego što se enkriptira. PrivateNote prvo enkriptira lokalno, pa usluga prima šifrirani tekst umjesto payload-a u otvorenom tekstu. Ta razlika određuje kriptografsku granicu povjerenja.",
  ],
  sections: [
    {
      title: "Dva načina za izgradnju iste poveznice",
      paragraphs: [
        "Kod **enkripcije na poslužitelju** pošiljatelj šalje tajnu usluzi preko TLS-a. Usluga prima otvoreni tekst, enkriptira ga i pohranjuje šifrirani tekst. Zatim može pohraniti payload, dostaviti ga, isteći i obrisati. Aplikacijski poslužitelj dio je procesa enkripcije jer otvoreni tekst ulazi u uslugu prije nego što postane šifrirani tekst.",
        "Kod **enkripcije na klijentu** uređaj pošiljatelja prvo enkriptira. Usluga prima i pohranjuje šifrirani tekst. Taj upload putuje preko TLS-a. Usluga ne prima ključ potreban za dešifriranje standardnog payload-a. Uređaj primatelja dešifrira lokalno. Usluga i dalje može pohraniti, dostaviti, isteći i obrisati payload bez pristupa otvorenom tekstu.",
        "Oba dizajna mogu pružiti privremene poveznice, ograničen pristup i istek. Oba se točno mogu opisati kao enkriptirana. OneTimeSecret koristi prvu arhitekturu; PrivateNote drugu. Relevantno pitanje stoga nije samo je li jednokratna poveznica enkriptirana, već koji sustavi moraju imati pristup otvorenom tekstu da bi ta poveznica radila.",
      ],
    },
    {
      title: "OneTimeSecret: enkripcija na poslužitelju",
      paragraphs: [
        "U uobičajenom OneTimeSecret toku pošiljatelj šalje tajnu preko TLS-a. Aplikacija prima otvoreni tekst, enkriptira ga na poslužitelju i pohranjuje enkriptirani payload.",
        "To pruža značajnu zaštitu pohranjenih podataka. Dobivanje samo enkriptirane pohrane ne otkriva nužno sadržaj kad materijal potreban za dešifriranje nije dostupan napadaču.",
        "Arhitektonski kompromis događa se prije pohrane. TLS štiti tajnu dok putuje između preglednika i OneTimeSecreta, ali aplikacija mora obraditi otvoreni tekst kako bi ga enkriptirala. Aplikacijski poslužitelj stoga sjedi unutar kriptografske granice povjerenja.",
        "Zlonamjerni ili kompromitirani aplikacijski proces u tom trenutku mogao bi pristupiti tajni prije nego što se enkriptira za pohranu. Enkripcija na klijentu uklanja tu konkretnu ovisnost enkriptiranjem tajne prije nego što stigne do usluge.",
      ],
    },
    {
      title: "Passphrase OneTimeSecreta ne mijenja granicu enkripcije",
      paragraphs: [
        "Dokumentacija OneTimeSecreta opisuje opcionalnu passphrase. Kad se passphrase koristi, OneTimeSecret kaže da se tajna enkriptira na njegovim poslužiteljima pomoću passphrase koju pošalje pošiljatelj. Kaže da ne pohranjuje samu passphrase; umjesto toga zadržava bcrypt hash koji se koristi za provjeru passphrase tijekom dohvata. Prema dokumentaciji, taj hash sam ne može dešifrirati tajnu, a pohranjena tajna zaštićena passphraseom ne može se dešifrirati bez izvorne passphrase.",
        "Dohvat koristi istu granicu na poslužitelju. Primatelj šalje passphrase OneTimeSecretu preko TLS-a. Usluga je provjerava i izvršava dešifriranje na poslužitelju prije nego što vrati otvoreni tekst.",
        "To znači da aplikacijski proces ima pristup tajni i passphrase kad se enkripcija dogodi te ponovno obrađuje passphrase i rezultirajući otvoreni tekst tijekom dohvata. Zlonamjerni ili kompromitirani aplikacijski proces na bilo kojoj od tih točaka potencijalno bi mogao uhvatiti te informacije. To je posljedica mjesta izvršavanja enkripcije i dešifriranja, a ne tvrdnja da OneTimeSecret bilježi ili zloupotrebljava te vrijednosti.",
        "Javna dokumentacija OneTimeSecreta sama po sebi ne utvrđuje svaki detalj unutarnje hijerarhije ključeva—na primjer, precizno kako se materijal ključa na poslužitelju, ključevi po tajni, izvođenje ključa i dostavljena passphrase kombiniraju. Nema potrebe nagađati o tim detaljima implementacije za ovu usporedbu. Relevantno dokumentirano svojstvo jest da se enkripcija i dešifriranje odvijaju na strani usluge.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Tajna koju želite poslati i passphrase kad je postavite obje putuju na poslužitelj preko TLS-a. Enkripcija se izvršava na tom poslužitelju. U pohrani ostaje šifrirani tekst.",
          columns: [
            [
              { text: "Tajna + passphrase", via: "TLS" },
              { text: "Poslužitelj", via: "Enkriptiraj" },
              { text: "Šifrirani tekst" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-hosting može učiniti to povjerenje u poslužitelj razumnim",
      paragraphs: [
        "OneTimeSecret je open source. Organizacija može pokrenuti vlastitu instancu unutar enterprise sigurnosnog perimetra, umjesto da šalje tajne javnoj usluzi.",
        "U toj implementaciji povjerenje aplikacijskom poslužitelju znači povjerenje infrastrukturi koju organizacija već upravlja. Otvoreni tekst i dalje stiže do tog poslužitelja jer se enkripcija i dalje događa tamo. Strana s druge strane granice su vlastiti hostovi, operatori i backupi organizacije. Za tim koji te sustave već prihvaća kao dio puta kojim tajna prolazi, enkripcija na poslužitelju može biti razuman izbor. Sužava jaz između modela prijetnji na poslužitelju i na klijentu jer operator više nije vanjska usluga.",
      ],
    },
    {
      title: "PrivateNote enkriptira prije uploada",
      paragraphs: [
        "Standardna PrivateNote enkriptira se prije uploada. Preglednik pošiljatelja ili lokalni [CLI](app:developers/cli), [Chrome ekstenzija](app:developers/chrome), [ekstenzija uređivača](app:developers/vscode) ili [MCP](app:developers/mcp) proces generira nasumični ključ i enkriptira payload AES-256-GCM-om. Uploadira se samo šifrirani tekst. TLS prenosi taj šifrirani tekst od preglednika do Cloudflare workera PrivateNotea. Ključ za dešifriranje stavlja se u URL fragment, dio nakon `#`, na primjer `https://privatenote.ai/note/abc123#…`. Fragment se obrađuje na klijentu i nije uključen u HTTPS zahtjev ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). Worker prima identifikator bilješke i vraća šifrirani tekst preko iste TLS veze. Preglednik zadržava fragment i dešifrira lokalno.",
      ],
    },
    {
      title: "Passphrase štiti ključ ako je kanal poveznice kompromitiran",
      paragraphs: [
        "Passphrase na PrivateNoteu radi drugačiji posao od passphrase na OneTimeSecretu. Bilješka je već šifrirani tekst prije nego što napusti uređaj. Ako dodate passphrase, preglednik iz nje Argon2id-om izvodi ključ za umotavanje i tim ključem enkriptira ključ bilješke. URL fragment tada drži umotani ključ. Primatelju trebaju poveznica i passphrase. Preglednik lokalno odmotava ključ i tek tada dešifrira bilješku.",
        "PrivateNote ne prima passphrase. Zahtjev za stvaranje nosi šifrirani tekst, salt i parametre koje preglednik primatelja treba da lokalno isproba passphrase. Nema hash-a na poslužitelju čiji je posao provjeriti passphrase. Pogrešna passphrase pada na dešifriranju na uređaju.",
        "Passphrase dodatno lokalno štiti klijentski ključ ako je kanal koji nosi poveznicu kompromitiran. Taj kanal tada vidi umotani ključ, a ne ključ koji sam može otvoriti bilješku. To nije mehanizam koji PrivateNote drži izvan puta otvorenog teksta. Ta odvojenost već postoji na standardnoj bilješci, s passphraseom ili bez nje. Podijelite passphrase drugim kanalom od poveznice. Ista poruka urušava dva sloja u jedan — isto pravilo kao [sigurno dijeljenje lozinke](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Lokalna enkripcija proizvodi klijentski ključ i šifrirani tekst. Argon2id umata taj ključ, a umotani ključ ostaje u URL fragmentu. TLS prenosi samo šifrirani tekst do Cloudflare workera.",
          columns: [
            [
              { text: "Tajna" },
              { text: "Lokalna enkripcija" },
              { text: "Šifrirani tekst", via: "TLS" },
              { text: "Poslužitelj" },
            ],
            [
              { text: "Passphrase" },
              { text: "Lokalni Argon2id" },
              { text: "Umataj ključ" },
              { text: "URL fragment" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "Ista podjela, jedno svojstvo po jednom.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Enkripcija payload-a", "Poslužitelj", "Uređaj pošiljatelja"],
          ["Otvoreni tekst stiže do usluge", "Da", "Ne"],
          ["Passphrase stiže do usluge", "Da", "Ne"],
          [
            "Uloga passphrase",
            "Sudjeluje u zaštiti na poslužitelju",
            "Izvodi lokalni ključ za umotavanje",
          ],
          [
            "Pohranjeni verifier ili materijal",
            "bcrypt verifier i enkriptirani payload, prema dokumentaciji OneTimeSecreta",
            "Salt, Argon2id wrap parametri i šifrirani tekst",
          ],
          ["Gdje se dešifriranje izvršava", "Aplikacijski poslužitelj OneTimeSecreta", "Uređaj primatelja"],
        ],
      },
      paragraphsAfterTable: [
        "Rukovanje ključevima PrivateNotea opisano je na [Kako radi](app:how-it-works): ključ sadržaja wrapa se Argon2id-om, a umotani ključ putuje u poveznici.",
      ],
    },
    {
      title: "Preostala pretpostavka povjerenja web klijenta",
      paragraphs: [
        "Enkripcija na klijentu u pregledniku nije web aplikacija bez povjerenja. Kriptografija može raditi lokalno dok JavaScript koji je implementira dostavlja stranica. Preglednik vjeruje kodu koji primi za tu sesiju.",
        "Netko tko može izmijeniti taj JavaScript — putem aplikacije, CDN-a ili deploy pipelinea — mogao bi promijeniti klijenta i uhvatiti ključeve u budućoj sesiji preglednika. To je drugačiji kvar od krađe baze podataka. Kompromitiranje pohrane izlaže šifrirani tekst. Dostava zlonamjernog koda napada endpoint dok je ključ stvarno prisutan.",
        "Kasniji dump baze ne može proizvesti klijentske ključeve koji tamo nikad nisu bili pohranjeni. Aktivno kompromitirani klijent može napasti tajne obrađene tijekom te sesije. Ista pretpostavka upisana je u model prijetnji PrivateNotea: dostavljeni aplikacijski kod nije zlonamjerno izmijenjen, a uređaji pošiljatelja i primatelja pouzdani su u trenutku enkripcije i dešifriranja.",
        "Instalirani softver sužava tu ovisnost o tek skinutoj stranici. CLI, ekstenzija uređivača ili native app pokreću kod koji ste instalirali. Ti klijenti i dalje ovise o operacijskom sustavu, potpisivanju, ovisnostima i kanalu ažuriranja. [Alati za developere](app:developers) koriste istu podjelu kao preglednik: enkriptiraj lokalno, uploadaj šifrirani tekst, ostavi ključ u fragmentu.",
      ],
    },
    {
      title: "Životni vijek i povjerljivost",
      paragraphs: [
        "Jednokratna poveznica odgovara na dva odvojena pitanja. Koliko dugo bi enkriptirani payload trebao postojati? I tko ga može dešifrirati dok postoji? Uništavanje nakon dohvata ili isteka skraćuje prozor. Ne odlučuje tko ga je mogao pročitati tijekom tog prozora. Životni vijek i povjerljivost podržavaju jedno drugo. Jedno ne stoji umjesto drugog.",
        "Razlika je najoštrija kad je payload autoritet: API ključevi, vjerodajnice baza podataka, cloud tokeni, kodovi za oporavak, infrastrukturalne lozinke. Usluga dijeljenja tajni postoji jer pošiljatelj želi manje sustava kojima se ta informacija povjerava. Ako posrednik samo treba nositi neprozirni enkriptirani objekt, nametnuti istek i obrisati ga, poslužitelj može obaviti taj posao bez primanja tajne ili ključa koji je otvara.",
      ],
    },
    {
      title: "Gdje leži granica",
      paragraphs: [
        "„Enkriptirano” ne govori vam gdje leži granica povjerenja. Standard vrijedan korištenja jest minimalna granica povjerenja: načelo najmanjih privilegija primijenjeno na to tko mora vidjeti otvoreni tekst. U modernom kriptografskom inženjerstvu cilj nije samo vjerovati da se poslužitelj ponaša ispravno, već smanjiti matematičku nužnost povjerenja unaprijed.",
        "OneTimeSecret opisuje sustav enkriptiran na poslužitelju. Uz zaštitu passphraseom kaže da se pohranjena tajna naknadno ne može dešifrirati bez passphrase i da bi kompromitiranje poslužitelja ostavilo tajnu sigurnom dok ta passphrase ostane nepoznata. Slabu passphrase može se napasti brute-forceom. Ako je slaba, to kompromitiranje i dalje može ostaviti tajnu obnovljivom. Otvoreni tekst i passphrase stižu do OneTimeSecreta pri stvaranju jer se enkripcija događa na njegovim poslužiteljima, a passphrase se šalje natrag pri dohvatu kako bi ti poslužitelji mogli dešifrirati.",
        "PrivateNote donosi drugačiji arhitektonski izbor. Payload se enkriptira prije nego što stigne do usluge, a standardni ključ payload-a ostaje na klijentu. Passphrase, kad je postavite, dodatno lokalno štiti taj klijentski ključ ako je kanal koji nosi poveznicu kompromitiran. Ne šalje se PrivateNoteu.",
        "OneTimeSecret enkriptira vašu tajnu. Klijent koji koristi uslugu PrivateNotea enkriptira je prije nego što je usluga primi. Ta razlika ne ovisi o pretpostavci da je bilo koji pružatelj zlonamjeran. Svodi pitanje na arhitekturu: koliko sustava treba pristup otvorenom tekstu da bi usluga radila?",
      ],
    },
    {
      title: "Česta pitanja",
      faqs: [
        {
          question: "Čuva li OneTimeSecret tajnu u otvorenom tekstu?",
          answer:
            "Njihova dokumentacija kaže ne. Enkriptiraju na svojim poslužiteljima. Uz passphrase kažu da pohranjuju enkriptiranu tajnu i bcrypt hash passphrase, ne samu passphrase, te da hash ne može dešifrirati tajnu.",
        },
        {
          question: "Ako postavim passphrase na OneTimeSecretu, je li tajna skrivena od njihovih poslužitelja?",
          answer:
            "Ne tijekom stvaranja i ne pri dohvatu. OneTimeSecret kaže da se tajna i passphrase daju njegovom poslužitelju kako bi poslužitelj izvršio enkripciju. Kad primatelj otvori poveznicu, šalje passphrase natrag preko TLS-a, a dešifriranje se izvršava na poslužiteljima OneTimeSecreta prije nego što se otvoreni tekst vrati. Nakon enkripcije OneTimeSecret kaže da odbacuje passphrase u otvorenom tekstu, zadržava samo bcrypt hash i ne može dešifrirati pohranjenu tajnu bez izvorne passphrase.",
        },
        {
          question: "Što štiti PrivateNote passphrase?",
          answer:
            "Klijentski ključ, ako je kanal koji nosi poveznicu kompromitiran. Sama bilješka već je enkriptirana na vašem uređaju AES-256-GCM-om. Argon2id lokalno iz passphrase izvodi ključ za umotavanje, a taj ključ za umotavanje enkriptira ključ bilješke. Poveznica tada drži umotani ključ. PrivateNote prima šifrirani tekst i salt. Ne prima passphrase ni sirovi ključ. Standardna bilješka enkriptira se prije uploada čak i bez passphrase. Pošaljite passphrase zasebnim kanalom od poveznice.",
        },
        {
          question: "Može li enkripcija na klijentu zaštititi od kompromitiranog PrivateNote poslužitelja?",
          answer:
            "Kompromitiranje pohranjenih podataka ili API-ja: da, u smislu da enkripcija na klijentu izolira nepročitane payload-e jer poslužitelj nema standardni ključ payload-a. Kasniji dump baze ne može proizvesti ključeve koji tamo nikad nisu bili pohranjeni. Dostava zlonamjernog klijentskog koda: ne. Napadač koji može promijeniti JavaScript dostavljen budućoj sesiji preglednika mogao bi pokušati uhvatiti ključ dok je prisutan. Instalirani klijenti smanjuju tu ovisnost o tek skinutoj stranici.",
        },
      ],
    },
    {
      title: "Primarni izvori",
      paragraphs: [
        "Informacije o arhitekturi OneTimeSecreta pregledane su u odnosu na javnu dokumentaciju 23. rujna 2026. Implementacije proizvoda i dokumentacija mogu se promijeniti.",
      ],
      bullets: [
        "[Dokumentacija OneTimeSecreta](https://docs.onetimesecret.com/)",
        "[OneTimeSecret o sigurnosti i passphraseima](https://onetimesecret.com/en/about)",
        "[Izvorni kod OneTimeSecreta](https://github.com/onetimesecret/onetimesecret)",
        "[Kako radi enkripcija PrivateNotea](app:how-it-works)",
        "[PrivateNote za developere](blog:privatenote-for-developers), uključujući CLI",
        "[RFC 3986, odjeljak 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), koji odvaja fragment od URI-ja prije dereference",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), o klijentskoj obradi fragmenta",
      ],
    },
  ],
  ctaTitle: "Enkriptirajte prije nego tajna napusti uređaj",
  ctaBody:
    "Napišite bilješku u pregledniku. Klijent je enkriptira lokalno, stavlja ključ u poveznicu i može zaštititi taj ključ passphraseom koju poslužitelj nikad ne prima.",
  ctaPrimary: "Stvorite private note",
  ctaSecondary: "Pogledajte kako enkripcija radi",
};
