import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteHr: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop na stolu s prikazom zaslona za stvaranje privatne bilješke s brisanjem nakon čitanja i istekom, uz zaključanu kožnu bilježnicu",
  intro: [
    "Želite napisati nešto osjetljivo—[lozinku](app:password-generator), kod za oporavak, povjerljivu poruku ili osobnu bilješku—i zadržati to privatno. Možda ste tražili „how to make a note private“ i pronašli opće savjete o zaključavanju aplikacije, skrivanju lokalne mape ili uključivanju postavke privatnosti na uređaju.",
    "Ti koraci pomažu kod svakodnevne privatnosti, protiv znatiželjnih pogleda. **Ne** rješavaju teži problem: dijeljenje bilješke s drugom osobom bez ostavljanja trajne, pretražive kopije na poslužitelju treće strane.",
    "Zaista privatna bilješka zahtijeva tri različita stupa: **šifriranje prije uploada**, **strogu kontrolu pristupa** i **planiranu efemernost**—mehanizam nestajanja. Evo kako to postići u praksi.",
  ],
  sections: [
    {
      title: "Što „privatno“ zapravo znači",
      paragraphs: [
        "U svakodnevnim aplikacijama „privatno“ obično znači skriveno od drugih ljudi koji uzmu vaš uređaj, zaštićeno lozinkom telefona ili zaključano iza premium pretplate. To je vrlo korisno—ali nije isto što i kriptografska privatnost.",
        "Kad dijelite osjetljive informacije putem weba, pravo pitanje je: **tko može pročitati bilješku nakon što izađe iz vaših ruku?**",
        "Može li je pročitati pružatelj usluge? Može li je pročitati neovlaštena strana koja dobije pristup sigurnosnoj kopiji u oblaku? Može li budući kolega pretražiti stare zapise chata i pronaći je mjesecima kasnije?",
        "Privatna bilješka, u strogom sigurnosnom smislu, je ona koju samo namijenjeni primatelj može pročitati, hosting usluga nikad ne vidi osnovni čisti tekst i bilješka ne ostaje online zauvijek.",
      ],
    },
    {
      title: "Zašto obične aplikacije za bilješke nisu dovoljne",
      paragraphs: [
        "Apple Notes, Google Keep, Notion i Evernote izvrsni su alati za osobnu organizaciju, ali su općenito pogrešan izbor za distribuciju jednokratnih tajni zbog nekoliko inherentnih osobina:",
      ],
      bullets: [
        "**Sinkronizacija i sigurnosne kopije** — Vaša bilješka se tiho kopira na više uređaja, računa za pohranu u oblaku i dugoročne arhive koje ne kontrolirate izravno.",
        "**Pretraživanje i dijeljenje** — Slučajno javno dijeljenje, široka pretraživanja radnog prostora ili jedan kompromitirani račun mogu otkriti stare bilješke mjesecima kasnije.",
        "**Pristup pružatelja** — Osim ako aplikacija izričito ne nudi end-to-end šifriranje za tu konkretnu bilješku, pružatelj zadržava tehničku mogućnost čitanja vašeg sadržaja na svojim poslužiteljima.",
        "**Bez uništenja nakon čitanja** — Većina organizacijskih aplikacija strukturno je dizajnirana za neograničeno pohranjivanje informacija, a ne za brisanje nakon jednog čitanja.",
      ],
      callout:
        "Za dugoročno osobno vođenje dnevnika, standardne aplikacije za bilješke su idealne. Za lozinke, kodove za oporavak i povjerljive predaje trebate efemerni alat izgrađen za [jednokratnu dostavu tajni](blog:one-time-secret-links)—ne za trajno pohranjivanje.",
    },
    {
      title: "Kako napraviti privatnu bilješku: korak po korak",
      paragraphs: [
        "Ne trebate registrirati račun da biste poslali sigurnu, jednokratnu privatnu bilješku. Strukturirani radni tijek u nastavku opisuje što su usluge šifrirane u pregledniku dizajnirane sigurno izvršavati.",
      ],
      flowDiagramCaption: "Radni tijek privatne bilješke na prvi pogled",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Napišite poruku u pregledniku",
          body: "Otvorite [PrivateNote](app:home) i upišite poruku izravno. Već ste u drugoj kartici? [Chrome proširenje](chrome:extension) šifrira odabrani tekst na mjestu—isti tijek na strani klijenta, bez otvaranja stranice. Izbjegavajte lijepljenje sirove tajne u standardne e-mail klijente ili nešifrirane tekstualne niti unaprijed. Također možete koristiti [Write with Private AI](app:home) za lokalno pisanje na uređaju prije šifriranja.",
        },
        {
          step: "Korak 2",
          title: "Konfigurirajte efemerne postavke privatnosti",
          body: "Postavite prozor isteka koji odgovara zadatku. Uključite uništenje nakon čitanja ako bilješka treba potpuno nestati nakon prvog uspješnog otvaranja i dodajte opcionalnu lozinku za vrlo osjetljiv sadržaj.",
        },
        {
          step: "Korak 3",
          title: "Pustite preglednik da izvrši lokalno šifriranje",
          body: "Kad kliknete stvori, šifriranje se događa u potpunosti na strani klijenta. Učitava se samo šifrirani tekst. Ključ za dešifriranje ostaje ugrađen u URL fragment—dio nakon `#`—koji moderni web preglednici ne prenose hosting web poslužiteljima.",
        },
        {
          step: "Korak 4",
          title: "Izolirajte kanale dijeljenja",
          body: "Pošaljite generiranu sigurnu poveznicu primatelju kroz željeni kanal. Ako ste postavili ručnu lozinku, podijelite je out-of-band—telefonskim pozivom, Signalom ili sigurno uživo.",
        },
        {
          step: "Korak 5",
          title: "Potvrdite dostavu i očistite lokalno stanje",
          body: "Koristite opcionalne obavijesti o dostavi da provjerite kada je bilješka uspješno otvorena ili istekla. Nakon potrošnje, ne ostaje kopija čistog teksta u vašem odlaznom sandučiću ili povijesnim zapisima chata.",
        },
      ],
    },
    {
      title: "Postavke privatnosti koje vrijedi uključiti",
      paragraphs: [
        "Male arhitektonske prilagodbe donose ogromne sigurnosne dobitke. Pri stvaranju efemerne bilješke maksimizirajte obranu koristeći ove konfiguracije:",
      ],
      bullets: [
        "**Uništenje nakon čitanja** — Zlatni standard za lozinke i vjerodajnice. Osnovni šifrirani tekst briše se s poslužitelja u trenutku kada je jednom uspješno pročitan.",
        "**Kratki prozori isteka** — Ako primatelj ne mora odmah otvoriti podatke, ograničite prozor izloženosti na sate ili dane—nikad neograničeno.",
        "**Slojevite lozinke** — Dodaje ključan drugi faktor. Napadač bi morao kompromitirati i kanal prijenosa poveznice i dobiti zasebnu lozinku da bi pročitao sadržaj.",
      ],
    },
    {
      title: "Što ne stavljati u web privatnu bilješku",
      paragraphs: [
        "Poveznice šifrirane u pregledniku izvrsne su za privremene ili zamjenjive tajne—poput Wi‑Fi vjerodajnica, API tokena i korporativnih poruka. Imaju granice.",
      ],
      callout:
        "**Kritično sigurnosno pravilo:** Nikad ne upisujte kripto seed frazu, glavnu sigurnosnu kopiju hardverskog novčanika ili root privatni ključ na bilo koju web stranicu. Nezamjenjiva glavna imovina opravdava lokalno terminalno šifriranje s age ili OpenSSL prije prijenosa. Za tu arhitekturu pročitajte [kripto seed fraze i jednokratne poveznice](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Kad je privatna bilješka pravi alat",
      paragraphs: [
        "Posegnite za namjenskom privatnom bilješkom umjesto standardnog e-maila ili chata kad predajete osjetljive informacije:",
      ],
      table: [
        {
          dataType: "Vjerodajnice",
          scenario:
            "Predaja [lozinke ili koda za oporavak](blog:how-we-generate-passwords) pouzdanom članu obitelji ili kolegi.",
        },
        {
          dataType: "Ključevi pristupa",
          scenario:
            "Distribucija [API ključa ili tajnog ključa za potpis webhooka](blog:how-to-share-api-key-securely) tijekom onboardinga developera.",
        },
        {
          dataType: "Fizički pristup",
          scenario:
            "Dijeljenje privremenih kodova vrata, PIN-ova alarma ili Wi‑Fi vjerodajnica za goste.",
        },
        {
          dataType: "Korporativna komunikacija",
          scenario:
            "Slanje povjerljive poslovne poruke koja ne smije biti indeksirana u [arhivama poslovnog chata ili e-maila](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Naša filozofija u PrivateNoteu",
      paragraphs: [
        "Dizajnirali smo PrivateNote da vrati ravnotežu povjerenja korisniku. Obavljanjem kriptografskih operacija u potpunosti u vašem pregledniku prije nego što payload dosegne našu infrastrukturu, naši poslužitelji strukturno su slijepi za vaše tajne u čistom tekstu.",
        "Također vjerujemo u jasnu transparentnost o ograničenjima proizvoda. Ako šaljete privremeni pristupni token kolegi, šifrirana jednokratna poveznica izvrsan je alat. Ako se radi o vašim životnim uštedama, prvo šifrirajte lokalno na offline računalu.",
        "Sigurnost nije pronalaženje magičnog univerzalnog alata. Radi se o usklađivanju radnog tijeka s vrijednošću onoga što štitite. Za tehnički model iza šifriranja u pregledniku pročitajte [kako PrivateNote radi](app:how-it-works) i [što znači klijentsko end-to-end šifriranje](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Vrsta podataka",
    scenario: "Idealni scenarij dijeljenja",
  },
  closingTitle: "Stvorite privatnu bilješku sada",
  closingBody: [
    "Račun nije potreban. Napišite bilješku, konfigurirajte postavke privatnosti i podijelite sigurnu poveznicu za manje od minute.",
  ],
  fileSharingNote:
    "Trebate dijeliti i dokumente? [Siguran prijenos datoteka](app:secure-file-transfer) koristi isti model šifriranja u pregledniku. Slanje zahtijeva besplatan račun; primatelji mogu otvoriti poveznice bez registracije.",
  chromeExtensionNote:
    "Često koristite PrivateNote? [Chrome proširenje](chrome:extension) dodaje šifriranje i dijeljenje u alatnu traku ili kontekstni izbornik—korisno kad se lozinka ili API ključ pojavi usred razgovora.",
  tagline: "Prvo šifrirajte. Podijelite poveznicu. Pustite da istekne.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Poveznice s uništenjem nakon čitanja, URL fragment i zašto efemernost nadmašuje e-mail ili Slack za jednokratne tajne.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Zašto e-mail stvara dugotrajne kopije tajni—i što koristiti umjesto toga za povjerljive predaje.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Sigurniji radni tijek za API ključeve: usko ograničite, šifrirajte lokalno, pošaljite poveznicu—a ne sirovu tajnu.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Što klijentsko E2EE zapravo znači i kako se razlikuje od same transportne sigurnosti.",
    },
  ],
};
