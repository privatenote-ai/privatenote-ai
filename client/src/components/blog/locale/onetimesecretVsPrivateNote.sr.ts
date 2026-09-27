import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteSr: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret i PrivateNote rešavaju isti praktični problem: preneti lozinku, API ključ, kod za oporavak ili poverljivu belešku privremenim linkom umesto ostavljanja otvorenog teksta u e-pošti ili četu. Primalac otvara link, a sačuvani payload može nestati nakon što je pročitan ili kad istekne vreme važenja.",
    "Oba proizvoda enkriptuju payload. Važna razlika je gde se enkripcija dešava.",
    "OneTimeSecret svoju arhitekturu opisuje kao enkripciju na serveru. Otvoreni tekst stiže do OneTimeSecreta pre nego što se enkriptuje. PrivateNote prvo enkriptuje lokalno, pa usluga prima šifrovani tekst umesto payload-a u otvorenom tekstu. Ta razlika određuje kriptografsku granicu poverenja.",
  ],
  sections: [
    {
      title: "Dva načina da se napravi isti link",
      paragraphs: [
        "Kod **enkripcije na serveru** pošiljalac šalje tajnu usluzi preko TLS-a. Usluga prima otvoreni tekst, enkriptuje ga i čuva šifrovani tekst. Zatim može sačuvati payload, dostaviti ga, isteći i obrisati. Aplikacioni server deo je procesa enkripcije jer otvoreni tekst ulazi u uslugu pre nego što postane šifrovani tekst.",
        "Kod **enkripcije na klijentu** uređaj pošiljaoca prvo enkriptuje. Usluga prima i čuva šifrovani tekst. Taj upload putuje preko TLS-a. Usluga ne prima ključ potreban za dešifrovanje standardnog payload-a. Uređaj primaoca dešifruje lokalno. Usluga i dalje može sačuvati, dostaviti, isteći i obrisati payload bez pristupa otvorenom tekstu.",
        "Oba dizajna mogu pružiti privremene linkove, ograničen pristup i istek. Oba se tačno mogu opisati kao enkriptovana. OneTimeSecret koristi prvu arhitekturu; PrivateNote drugu. Relevantno pitanje stoga nije samo da li je jednokratni link enkriptovan, već koji sistemi moraju imati pristup otvorenom tekstu da bi taj link radio.",
      ],
    },
    {
      title: "OneTimeSecret: enkripcija na serveru",
      paragraphs: [
        "U uobičajenom OneTimeSecret toku pošiljalac šalje tajnu preko TLS-a. Aplikacija prima otvoreni tekst, enkriptuje ga na serveru i čuva enkriptovani payload.",
        "To pruža značajnu zaštitu sačuvanih podataka. Dobijanje samo enkriptovanog skladišta ne otkriva nužno sadržaj kada materijal potreban za dešifrovanje nije dostupan napadaču.",
        "Arhitektonski kompromis dešava se pre skladištenja. TLS štiti tajnu dok putuje između pregledača i OneTimeSecreta, ali aplikacija mora obraditi otvoreni tekst da bi ga enkriptovala. Aplikacioni server stoga sedi unutar kriptografske granice poverenja.",
        "Zlonamerni ili kompromitovani aplikacioni proces u tom trenutku mogao bi pristupiti tajni pre nego što se enkriptuje za skladištenje. Enkripcija na klijentu uklanja tu konkretnu zavisnost enkriptovanjem tajne pre nego što stigne do usluge.",
      ],
    },
    {
      title: "Passphrase OneTimeSecreta ne menja granicu enkripcije",
      paragraphs: [
        "Dokumentacija OneTimeSecreta opisuje opcionalnu passphrase. Kada se passphrase koristi, OneTimeSecret kaže da se tajna enkriptuje na njegovim serverima pomoću passphrase koju pošalje pošiljalac. Kaže da ne čuva samu passphrase; umesto toga zadržava bcrypt hash koji se koristi za proveru passphrase tokom dohvata. Prema dokumentaciji, taj hash sam ne može dešifrovati tajnu, a sačuvana tajna zaštićena passphraseom ne može se dešifrovati bez izvorne passphrase.",
        "Dohvat koristi istu granicu na serveru. Primalac šalje passphrase OneTimeSecretu preko TLS-a. Usluga je proverava i izvršava dešifrovanje na serveru pre nego što vrati otvoreni tekst.",
        "To znači da aplikacioni proces ima pristup tajni i passphrase kada se enkripcija desi i ponovo obrađuje passphrase i rezultujući otvoreni tekst tokom dohvata. Zlonamerni ili kompromitovani aplikacioni proces na bilo kojoj od tih tačaka potencijalno bi mogao uhvatiti te informacije. To je posledica mesta izvršavanja enkripcije i dešifrovanja, a ne tvrdnja da OneTimeSecret beleži ili zloupotrebljava te vrednosti.",
        "Javna dokumentacija OneTimeSecreta sama po sebi ne utvrđuje svaki detalj unutrašnje hijerarhije ključeva—na primer, precizno kako se materijal ključa na serveru, ključevi po tajni, izvođenje ključa i dostavljena passphrase kombinuju. Nema potrebe nagađati o tim detaljima implementacije za ovo poređenje. Relevantno dokumentovano svojstvo jeste da se enkripcija i dešifrovanje odvijaju na strani usluge.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Tajna koju želite da pošaljete i passphrase kada je podesite obe putuju na server preko TLS-a. Enkripcija se izvršava na tom serveru. U skladištu ostaje šifrovani tekst.",
          columns: [
            [
              { text: "Tajna + passphrase", via: "TLS" },
              { text: "Server", via: "Enkriptuj" },
              { text: "Šifrovani tekst" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-hosting može učiniti to poverenje u server razumnim",
      paragraphs: [
        "OneTimeSecret je open source. Organizacija može pokrenuti sopstvenu instancu unutar enterprise bezbednosnog perimetra, umesto da šalje tajne javnoj usluzi.",
        "U toj implementaciji poverenje aplikacionom serveru znači poverenje infrastrukturi kojom organizacija već upravlja. Otvoreni tekst i dalje stiže do tog servera jer se enkripcija i dalje dešava tamo. Strana s druge strane granice su sopstveni hostovi, operatori i backupi organizacije. Za tim koji te sisteme već prihvata kao deo puta kojim tajna prolazi, enkripcija na serveru može biti razuman izbor. Sužava jaz između modela pretnji na serveru i na klijentu jer operator više nije spoljna usluga.",
      ],
    },
    {
      title: "PrivateNote enkriptuje pre uploada",
      paragraphs: [
        "Standardna PrivateNote enkriptuje se pre uploada. Pregledač pošiljaoca ili lokalni [CLI](app:developers/cli), [Chrome ekstenzija](app:developers/chrome), [ekstenzija uređivača](app:developers/vscode) ili [MCP](app:developers/mcp) proces generiše nasumični ključ i enkriptuje payload AES-256-GCM-om. Uploaduje se samo šifrovani tekst. TLS prenosi taj šifrovani tekst od pregledača do Cloudflare workera PrivateNotea. Ključ za dešifrovanje stavlja se u URL fragment, deo posle `#`, na primer `https://privatenote.ai/note/abc123#…`. Fragment se obrađuje na klijentu i nije uključen u HTTPS zahtev ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). Worker prima identifikator beleške i vraća šifrovani tekst preko iste TLS veze. Pregledač zadržava fragment i dešifruje lokalno.",
      ],
    },
    {
      title: "Passphrase štiti ključ ako je kanal linka kompromitovan",
      paragraphs: [
        "Passphrase na PrivateNoteu radi drugačiji posao od passphrase na OneTimeSecretu. Beleška je već šifrovani tekst pre nego što napusti uređaj. Ako dodate passphrase, pregledač iz nje Argon2id-om izvodi ključ za umotavanje i tim ključem enkriptuje ključ beleške. URL fragment tada drži umotani ključ. Primaocu trebaju link i passphrase. Pregledač lokalno odmotava ključ i tek tada dešifruje belešku.",
        "PrivateNote ne prima passphrase. Zahtev za kreiranje nosi šifrovani tekst, salt i parametre koje pregledač primaoca treba da lokalno isproba passphrase. Nema hash-a na serveru čiji je posao da proveri passphrase. Pogrešna passphrase pada na dešifrovanju na uređaju.",
        "Passphrase dodatno lokalno štiti klijentski ključ ako je kanal koji nosi link kompromitovan. Taj kanal tada vidi umotani ključ, a ne ključ koji sam može otvoriti belešku. To nije mehanizam koji PrivateNote drži van puta otvorenog teksta. Ta odvojenost već postoji na standardnoj belešci, sa passphraseom ili bez nje. Podelite passphrase drugim kanalom od linka. Ista poruka urušava dva sloja u jedan — isto pravilo kao [sigurno deljenje lozinke](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Lokalna enkripcija proizvodi klijentski ključ i šifrovani tekst. Argon2id umotava taj ključ, a umotani ključ ostaje u URL fragmentu. TLS prenosi samo šifrovani tekst do Cloudflare workera.",
          columns: [
            [
              { text: "Tajna" },
              { text: "Lokalna enkripcija" },
              { text: "Šifrovani tekst", via: "TLS" },
              { text: "Server" },
            ],
            [
              { text: "Passphrase" },
              { text: "Lokalni Argon2id" },
              { text: "Umotaj ključ" },
              { text: "URL fragment" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "Ista podela, jedno svojstvo po jednom.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Enkripcija payload-a", "Server", "Uređaj pošiljaoca"],
          ["Otvoreni tekst stiže do usluge", "Da", "Ne"],
          ["Passphrase stiže do usluge", "Da", "Ne"],
          [
            "Uloga passphrase",
            "Učestvuje u zaštiti na serveru",
            "Izvodi lokalni ključ za umotavanje",
          ],
          [
            "Sačuvani verifier ili materijal",
            "bcrypt verifier i enkriptovani payload, prema dokumentaciji OneTimeSecreta",
            "Salt, Argon2id wrap parametri i šifrovani tekst",
          ],
          ["Gde se dešifrovanje izvršava", "Aplikacioni server OneTimeSecreta", "Uređaj primaoca"],
        ],
      },
      paragraphsAfterTable: [
        "Rukovanje ključevima PrivateNotea opisano je na [Kako radi](app:how-it-works): ključ sadržaja wrapuje se Argon2id-om, a umotani ključ putuje u linku.",
      ],
    },
    {
      title: "Preostala pretpostavka poverenja veb klijenta",
      paragraphs: [
        "Enkripcija na klijentu u pregledaču nije veb aplikacija bez poverenja. Kriptografija može da radi lokalno dok JavaScript koji je implementira dostavlja sajt. Pregledač veruje kodu koji primi za tu sesiju.",
        "Neko ko može da izmeni taj JavaScript — putem aplikacije, CDN-a ili deploy pipelinea — mogao bi da promeni klijenta i uhvati ključeve u budućoj sesiji pregledača. To je drugačiji kvar od krađe baze podataka. Kompromitovanje skladišta izlaže šifrovani tekst. Dostava zlonamernog koda napada endpoint dok je ključ stvarno prisutan.",
        "Kasniji dump baze ne može da proizvede klijentske ključeve koji tamo nikad nisu bili sačuvani. Aktivno kompromitovani klijent može da napadne tajne obrađene tokom te sesije. Ista pretpostavka upisana je u model pretnji PrivateNotea: dostavljeni aplikacioni kod nije zlonamerno izmenjen, a uređaji pošiljaoca i primaoca pouzdani su u trenutku enkripcije i dešifrovanja.",
        "Instalirani softver sužava tu zavisnost od tek skinute stranice. CLI, ekstenzija uređivača ili native app pokreću kod koji ste instalirali. Ti klijenti i dalje zavise od operativnog sistema, potpisivanja, zavisnosti i kanala ažuriranja. [Alati za developere](app:developers) koriste istu podelu kao pregledač: enkriptuj lokalno, uploaduj šifrovani tekst, ostavi ključ u fragmentu.",
      ],
    },
    {
      title: "Životni vek i poverljivost",
      paragraphs: [
        "Jednokratni link odgovara na dva odvojena pitanja. Koliko dugo bi enkriptovani payload trebalo da postoji? I ko ga može dešifrovati dok postoji? Uništavanje nakon dohvata ili isteka skraćuje prozor. Ne odlučuje ko ga je mogao pročitati tokom tog prozora. Životni vek i poverljivost podržavaju jedno drugo. Jedno ne stoji umesto drugog.",
        "Razlika je najoštrija kada je payload autoritet: API ključevi, kredencijali baza podataka, cloud tokeni, kodovi za oporavak, infrastrukturne lozinke. Usluga deljenja tajni postoji jer pošiljalac želi manje sistema kojima se ta informacija poverava. Ako posrednik samo treba da nosi neproziran enkriptovani objekat, nametne istek i obriše ga, server može da obavi taj posao bez primanja tajne ili ključa koji je otvara.",
      ],
    },
    {
      title: "Gde leži granica",
      paragraphs: [
        "„Enkriptovano” ne govori vam gde leži granica poverenja. Standard vredan korišćenja jeste minimalna granica poverenja: načelo najmanjih privilegija primenjeno na to ko mora da vidi otvoreni tekst. U modernom kriptografskom inženjerstvu cilj nije samo verovati da se server ponaša ispravno, već smanjiti matematičku nužnost poverenja unapred.",
        "OneTimeSecret opisuje sistem enkriptovan na serveru. Uz zaštitu passphraseom kaže da se sačuvana tajna naknadno ne može dešifrovati bez passphrase i da bi kompromitovanje servera ostavilo tajnu sigurnom dok ta passphrase ostane nepoznata. Slabu passphrase može se napasti brute-forceom. Ako je slaba, to kompromitovanje i dalje može ostaviti tajnu obnovljivom. Otvoreni tekst i passphrase stižu do OneTimeSecreta pri kreiranju jer se enkripcija dešava na njegovim serverima, a passphrase se šalje nazad pri dohvatu kako bi ti serveri mogli da dešifruju.",
        "PrivateNote donosi drugačiji arhitektonski izbor. Payload se enkriptuje pre nego što stigne do usluge, a standardni ključ payload-a ostaje na klijentu. Passphrase, kada je podesite, dodatno lokalno štiti taj klijentski ključ ako je kanal koji nosi link kompromitovan. Ne šalje se PrivateNoteu.",
        "OneTimeSecret enkriptuje vašu tajnu. Klijent koji koristi uslugu PrivateNotea enkriptuje je pre nego što je usluga primi. Ta razlika ne zavisi od pretpostavke da je bilo koji provajder zlonameran. Svodi pitanje na arhitekturu: koliko sistema treba pristup otvorenom tekstu da bi usluga radila?",
      ],
    },
    {
      title: "Česta pitanja",
      faqs: [
        {
          question: "Čuva li OneTimeSecret tajnu u otvorenom tekstu?",
          answer:
            "Njihova dokumentacija kaže ne. Enkriptuju na svojim serverima. Uz passphrase kažu da čuvaju enkriptovanu tajnu i bcrypt hash passphrase, ne samu passphrase, te da hash ne može da dešifruje tajnu.",
        },
        {
          question: "Ako podesim passphrase na OneTimeSecretu, da li je tajna skrivena od njihovih servera?",
          answer:
            "Ne tokom kreiranja i ne pri dohvatu. OneTimeSecret kaže da se tajna i passphrase daju njegovom serveru kako bi server izvršio enkripciju. Kada primalac otvori link, šalje passphrase nazad preko TLS-a, a dešifrovanje se izvršava na serverima OneTimeSecreta pre nego što se otvoreni tekst vrati. Nakon enkripcije OneTimeSecret kaže da odbacuje passphrase u otvorenom tekstu, zadržava samo bcrypt hash i ne može da dešifruje sačuvanu tajnu bez izvorne passphrase.",
        },
        {
          question: "Šta štiti PrivateNote passphrase?",
          answer:
            "Klijentski ključ, ako je kanal koji nosi link kompromitovan. Sama beleška već je enkriptovana na vašem uređaju AES-256-GCM-om. Argon2id lokalno iz passphrase izvodi ključ za umotavanje, a taj ključ za umotavanje enkriptuje ključ beleške. Link tada drži umotani ključ. PrivateNote prima šifrovani tekst i salt. Ne prima passphrase ni sirovi ključ. Standardna beleška enkriptuje se pre uploada čak i bez passphrase. Pošaljite passphrase zasebnim kanalom od linka.",
        },
        {
          question: "Može li enkripcija na klijentu da zaštiti od kompromitovanog PrivateNote servera?",
          answer:
            "Kompromitovanje sačuvanih podataka ili API-ja: da, u smislu da enkripcija na klijentu izoluje nepročitane payload-e jer server nema standardni ključ payload-a. Kasniji dump baze ne može da proizvede ključeve koji tamo nikad nisu bili sačuvani. Dostava zlonamernog klijentskog koda: ne. Napadač koji može da promeni JavaScript dostavljen budućoj sesiji pregledača mogao bi da pokuša da uhvati ključ dok je prisutan. Instalirani klijenti smanjuju tu zavisnost od tek skinute stranice.",
        },
      ],
    },
    {
      title: "Primarni izvori",
      paragraphs: [
        "Informacije o arhitekturi OneTimeSecreta pregledane su u odnosu na javnu dokumentaciju 23. septembra 2026. Implementacije proizvoda i dokumentacija mogu se promeniti.",
      ],
      bullets: [
        "[Dokumentacija OneTimeSecreta](https://docs.onetimesecret.com/)",
        "[OneTimeSecret o bezbednosti i passphraseima](https://onetimesecret.com/en/about)",
        "[Izvorni kod OneTimeSecreta](https://github.com/onetimesecret/onetimesecret)",
        "[Kako radi enkripcija PrivateNotea](app:how-it-works)",
        "[PrivateNote za developere](blog:privatenote-for-developers), uključujući CLI",
        "[RFC 3986, odeljak 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), koji odvaja fragment od URI-ja pre dereference",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), o klijentskoj obradi fragmenta",
      ],
    },
  ],
  ctaTitle: "Enkriptujte pre nego tajna napusti uređaj",
  ctaBody:
    "Napišite belešku u pregledaču. Klijent je enkriptuje lokalno, stavlja ključ u link i može zaštititi taj ključ passphraseom koju server nikad ne prima.",
  ctaPrimary: "Napravite private note",
  ctaSecondary: "Pogledajte kako enkripcija radi",
};
