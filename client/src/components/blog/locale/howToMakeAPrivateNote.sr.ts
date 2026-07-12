import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteSr: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop na stolu sa prikazom ekrana za kreiranje privatne beleške sa brisanjem nakon čitanja i istekom, pored zaključane kožne beležnice",
  intro: [
    "Želite da napišete nešto osetljivo—[lozinku](app:password-generator), kod za oporavak, poverljivu poruku ili ličnu belešku—i zadržite to privatno. Možda ste tražili „how to make a note private“ i pronašli opšte savete o zaključavanju aplikacije, skrivanju lokalnog foldera ili uključivanju podešavanja privatnosti na uređaju.",
    "Ti koraci pomažu kod svakodnevne privatnosti, protiv radoznalih pogleda. **Ne** rešavaju teži problem: deljenje beleške sa drugom osobom bez ostavljanja trajne, pretražive kopije na serveru treće strane.",
    "Zaista privatna beleška zahteva tri različita stuba: **šifrovanje pre otpremanja**, **strogu kontrolu pristupa** i **planiranu efemernost**—mehanizam nestajanja. Evo kako to postići u praksi.",
  ],
  sections: [
    {
      title: "Šta „privatno“ zapravo znači",
      paragraphs: [
        "U svakodnevnim aplikacijama „privatno“ obično znači skriveno od drugih ljudi koji uzmu vaš uređaj, zaštićeno lozinkom telefona ili zaključano iza premium pretplate. To je veoma korisno—ali nije isto što i kriptografska privatnost.",
        "Kada delite osetljive informacije preko veba, pravo pitanje je: **ko može da pročita belešku nakon što izađe iz vaših ruku?**",
        "Može li je pročitati pružalac usluge? Može li je pročitati neovlašćena strana koja dobije pristup rezervnoj kopiji u oblaku? Može li budući kolega da pretraži stare zapise četa i pronađe je mesecima kasnije?",
        "Privatna beleška, u strogom bezbednosnom smislu, je ona koju samo namenjeni primalac može da pročita, hosting usluga nikad ne vidi osnovni čisti tekst i beleška ne ostaje online zauvek.",
      ],
    },
    {
      title: "Zašto obične aplikacije za beleške nisu dovoljne",
      paragraphs: [
        "Apple Notes, Google Keep, Notion i Evernote su izvrsni alati za ličnu organizaciju, ali su generalno pogrešan izbor za distribuciju jednokratnih tajni zbog nekoliko inherentnih osobina:",
      ],
      bullets: [
        "**Sinhronizacija i rezervne kopije** — Vaša beleška se tiho kopira na više uređaja, naloga za skladištenje u oblaku i dugoročne arhive koje ne kontrolišete direktno.",
        "**Pretraživanje i deljenje** — Slučajno javno deljenje, široka pretraživanja radnog prostora ili jedan kompromitovan nalog mogu otkriti stare beleške mesecima kasnije.",
        "**Pristup pružaoca** — Osim ako aplikacija izričito ne nudi end-to-end šifrovanje za tu konkretnu belešku, pružalac zadržava tehničku mogućnost čitanja vašeg sadržaja na svojim serverima.",
        "**Bez uništenja nakon čitanja** — Većina organizacionih aplikacija strukturno je dizajnirana za neograničeno čuvanje informacija, a ne za brisanje nakon jednog čitanja.",
      ],
      callout:
        "Za dugoročno lično vođenje dnevnika, standardne aplikacije za beleške su idealne. Za lozinke, kodove za oporavak i poverljive predaje trebate efemerni alat izgrađen za [jednokratnu isporuku tajni](blog:one-time-secret-links)—ne za trajno skladištenje.",
    },
    {
      title: "Kako napraviti privatnu belešku: korak po korak",
      paragraphs: [
        "Ne morate da registrujete nalog da biste poslali bezbednu, jednokratnu privatnu belešku. Strukturirani radni tok u nastavku opisuje šta su usluge šifrovane u pregledaču dizajnirane da sigurno izvršavaju.",
      ],
      flowDiagramCaption: "Radni tok privatne beleške na prvi pogled",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Napišite poruku u pregledaču",
          body: "Otvorite [PrivateNote](app:home) i ukucajte poruku direktno. Već ste u drugom tabu? [Chrome ekstenzija](chrome:extension) šifruje izabrani tekst na mestu—isti tok na strani klijenta, bez otvaranja sajta. Izbegavajte lepljenje sirove tajne u standardne e-mail klijente ili nešifrovane tekstualne niti unapred. Takođe možete koristiti [Write with Private AI](app:home) za lokalno pisanje na uređaju pre šifrovanja.",
        },
        {
          step: "Korak 2",
          title: "Konfigurišite efemerna podešavanja privatnosti",
          body: "Postavite prozor isteka koji odgovara zadatku. Uključite uništenje nakon čitanja ako beleška treba potpuno da nestane nakon prvog uspešnog otvaranja i dodajte opcionalnu lozinku za veoma osetljiv sadržaj.",
        },
        {
          step: "Korak 3",
          title: "Pustite pregledač da izvrši lokalno šifrovanje",
          body: "Kada kliknete na kreiraj, šifrovanje se dešava u potpunosti na strani klijenta. Otprema se samo šifrovani tekst. Ključ za dešifrovanje ostaje ugrađen u URL fragment—deo nakon `#`—koji moderni web pregledači ne prenose hosting web serverima.",
        },
        {
          step: "Korak 4",
          title: "Izolujte kanale deljenja",
          body: "Pošaljite generisanu bezbednu vezu primaocu kroz željeni kanal. Ako ste postavili ručnu lozinku, podelite je out-of-band—telefonskim pozivom, Signalom ili bezbedno uživo.",
        },
        {
          step: "Korak 5",
          title: "Potvrdite isporuku i očistite lokalno stanje",
          body: "Koristite opcionalna obaveštenja o isporuci da proverite kada je beleška uspešno otvorena ili istekla. Nakon potrošnje, ne ostaje kopija čistog teksta u vašem odlaznom sandučetu ili istorijskim zapisima četa.",
        },
      ],
    },
    {
      title: "Podešavanja privatnosti koja vredi uključiti",
      paragraphs: [
        "Male arhitektonske prilagodbe donose ogromne bezbednosne dobitke. Pri kreiranju efemerne beleške maksimizujte odbranu koristeći ove konfiguracije:",
      ],
      bullets: [
        "**Uništenje nakon čitanja** — Zlatni standard za lozinke i akreditive. Osnovni šifrovani tekst briše se sa servera u trenutku kada je jednom uspešno pročitan.",
        "**Kratki prozori isteka** — Ako primalac ne mora odmah da otvori podatke, ograničite prozor izloženosti na sate ili dane—nikad neograničeno.",
        "**Slojevite lozinke** — Dodaje ključan drugi faktor. Napadač bi morao da kompromituje i kanal prenosa veze i da dobije zasebnu lozinku da bi pročitao sadržaj.",
      ],
    },
    {
      title: "Šta ne stavljati u web privatnu belešku",
      paragraphs: [
        "Veze šifrovane u pregledaču su izvrsne za privremene ili zamenljive tajne—poput Wi‑Fi akreditiva, API tokena i korporativnih poruka. Imaju granice.",
      ],
      callout:
        "**Kritično bezbednosno pravilo:** Nikad ne ukucavajte kripto seed frazu, glavnu rezervnu kopiju hardverskog novčanika ili root privatni ključ na bilo koji veb sajt. Nezamenjiva glavna imovina opravdava lokalno terminalno šifrovanje sa age ili OpenSSL pre prenosa. Za tu arhitekturu pročitajte [kripto seed fraze i jednokratne veze](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Kada je privatna beleška pravi alat",
      paragraphs: [
        "Posegnite za namenskom privatnom beleškom umesto standardnog e-maila ili četa kada predajete osetljive informacije:",
      ],
      table: [
        {
          dataType: "Akreditivi",
          scenario:
            "Predaja [lozinke ili koda za oporavak](blog:how-we-generate-passwords) pouzdanom članu porodice ili kolegi.",
        },
        {
          dataType: "Ključevi pristupa",
          scenario:
            "Distribucija [API ključa ili tajnog ključa za potpis webhooka](blog:how-to-share-api-key-securely) tokom onboardinga developera.",
        },
        {
          dataType: "Fizički pristup",
          scenario:
            "Deljenje privremenih kodova vrata, PIN-ova alarma ili Wi‑Fi akreditiva za goste.",
        },
        {
          dataType: "Korporativna komunikacija",
          scenario:
            "Slanje poverljive poslovne poruke koja ne sme biti indeksirana u [arhivama poslovnog četa ili e-maila](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Naša filozofija u PrivateNoteu",
      paragraphs: [
        "Dizajnirali smo PrivateNote da vrati ravnotežu poverenja korisniku. Obavljanjem kriptografskih operacija u potpunosti u vašem pregledaču pre nego što payload dostigne našu infrastrukturu, naši serveri strukturno su slepi za vaše tajne u čistom tekstu.",
        "Takođe verujemo u jasnu transparentnost o ograničenjima proizvoda. Ako šaljete privremeni pristupni token kolegi, šifrovana jednokratna veza je izvrsan alat. Ako se radi o vašim životnim uštedama, prvo šifrujte lokalno na offline računaru.",
        "Bezbednost nije pronalaženje magičnog univerzalnog alata. Radi se o usklađivanju radnog toka sa vrednošću onoga što štitite. Za tehnički model iza šifrovanja u pregledaču pročitajte [kako PrivateNote radi](app:how-it-works) i [šta znači klijentsko end-to-end šifrovanje](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Vrsta podataka",
    scenario: "Idealni scenario deljenja",
  },
  closingTitle: "Kreirajte privatnu belešku sada",
  closingBody: [
    "Nalog nije potreban. Napišite belešku, konfigurišite podešavanja privatnosti i podelite bezbednu vezu za manje od minuta.",
  ],
  fileSharingNote:
    "Trebate da delite i dokumente? [Bezbedan prenos fajlova](app:secure-file-transfer) koristi isti model šifrovanja u pregledaču. Slanje zahteva besplatan nalog; primaoci mogu da otvore veze bez registracije.",
  chromeExtensionNote:
    "Često koristite PrivateNote? [Chrome ekstenzija](chrome:extension) dodaje šifrovanje i deljenje u alatnu traku ili kontekstni meni—korisno kada se lozinka ili API ključ pojavi usred razgovora.",
  tagline: "Prvo šifrujte. Podelite vezu. Pustite da istekne.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Veze sa uništenjem nakon čitanja, URL fragment i zašto efemernost nadmašuje e-mail ili Slack za jednokratne tajne.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Zašto e-mail stvara dugotrajne kopije tajni—i šta koristiti umesto toga za poverljive predaje.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Bezbedniji radni tok za API ključeve: usko ograničite, šifrujte lokalno, pošaljite vezu—a ne sirovu tajnu.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Šta klijentsko E2EE zapravo znači i kako se razlikuje od same transportne bezbednosti.",
    },
  ],
};
