import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksHr: OneTimeSecretLinksArticleCopy = {
  intro: [
    "**Jednokratna poveznica** URL je kojj služi da se osjetljiva informacija preda bez da otvoreni tekst trajno ostane u e-pošti ili povijesti chata. Primatelj otvori poveznicu, prikaže tajnu u pregledniku, a šifrirana kopija na poslužitelju zatim postane nedostupna prema pravilima pristupa i isteka.",
    "Korisna je za lozinke, API ključeve, kodove za oporavak, privremene vjerodajnice i privatne poruke koje trebaju stići jednom—i ne trebaju trajni razgovor.",
    "Problem nije uvijek presretanje. Problem je **zadržavanje**. Šifriranje štiti pristup. Kratkotrajnost smanjuje koliko dugo nepotrebne kopije ostaju dostupne. Jednokratna poveznica pokriva treći posao: **privremenu predaju**.",
  ],
  earlyCta: {
    body: "Trebate li poslati jednu sada?",
    linkLabel: "Stvorite šifriranu jednokratnu poveznicu s PrivateNoteom",
  },
  sections: [
    {
      title: "Što je jednokratna poveznica?",
      paragraphs: [
        "Za istu ideju postoji više naziva: tajna poveznica, samouništiva bilješka, poveznica koja istječe, „izgorjeti nakon čitanja“. Natpis se mijenja. Sigurnosna svojstva ne dolaze automatski s imenom.",
        "Proizvod nazvan „jednokratnom tajnom“ sam po sebi ne znači da se šifriranje događa u pregledniku, da pružatelj ne može pročitati sadržaj, da ključ ostaje izvan poslužitelja, da brisanje stvarno slijedi čitanje ili da metapodaci nestaju. To su odluke dizajna. Procjenjujte svojstva, ne slogan.",
        "Koristan popis: gdje se otvoreni tekst šifrira? Prima li poslužitelj ikada ključ za dešifriranje? Što se dogodi nakon predviđenog dohvata? Koliko dugo neiskorištena poveznica ostaje dostupna? Što pretpregled chata dohvaća ako netko zalijepi URL?",
      ],
    },
    {
      title: "Kako funkcionira jednokratna poveznica?",
      paragraphs: [
        "U klijentskom dizajnu kao što je PrivateNoteov, tajna se šifrira u pregledniku pošiljatelja prije slanja. Poslužitelj pohranjuje šifrirani tekst. Preglednik primatelja dešifrira lokalno. Tekst bilješke koristi AES-256-GCM preko Web Crypto API-ja.",
      ],
      beforeFlowSteps: "**U praksi cijeli tok izgleda ovako:**",
      flowSteps: [
        {
          title: "Ključ i šifriranje u pregledniku",
          step: "Korak 1: vaš preglednik",
          body: "Tajnu upisujete lokalno. Preglednik generira kriptografski materijal i šifrira otvoreni tekst prije nego što bilo koji mrežni zahtjev napusti uređaj.",
        },
        {
          title: "Šalje se samo šifrirani tekst",
          step: "Korak 2: poslužitelj",
          body: "Prenosi se samo šifrirani teret. Poslužitelj pohranjuje tekst koji ne može pročitati jer ne prima ni otvoreni tekst ni ključ iz fragmenta.",
        },
        {
          title: "Ključ ostaje u poveznici",
          step: "Korak 3: URL",
          body: "Ključ za dešifriranje stavlja se u URL fragment—dio iza #. Javna putanja identificira bilješku; fragment ostaje u pregledniku pri uobičajenoj HTTPS navigaciji.",
        },
        {
          title: "Prikaži, dešifriraj, zatim primijeni pravila pristupa",
          step: "Korak 4: primatelj",
          body: "Otvaranje stranice nije dovoljno. Primatelj klikne za prikaz, čime se dohvaća šifrirani tekst. Preglednik dešifrira lokalno. Nakon uspješnog prikaza PrivateNote primjenjuje ograničenje pregleda—zadano jedan—i briše šifrirani tekst kad se to ograničenje dosegne. Neiskorištene poveznice istječu i vremenski.",
        },
      ],
      afterFlowSteps: [
        "Nisu svi proizvodi koji se prodaju kao jednokratna poveznica slijede ovaj model. Neki šifriraju na poslužitelju nakon primitka teksta ili tamo generiraju ključ, što bi usluzi omogućilo čitanje tajne. Drugi brišu prema rasporedu, ali čuvaju kopije koje se mogu vratiti. Pitajte je li proveden cijeli dizajn—ne samo istječe li poveznica.",
        "Za arhitekturu šifriranja PrivateNotea, uključujući omotavanje lozinkom s Argon2id, vidi [Kako funkcionira](app:how-it-works).",
      ],
    },
    {
      title: "Zašto je URL fragment važan",
      paragraphs: [
        "Ovaj se detalj lako previdi, a temelj je ove arhitekture.",
        "Pri uobičajenoj HTTPS navigaciji preglednik šalje putanju i upit poslužitelju. [URL fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—sve iza #—ostaje u pregledniku i nije dio tog zahtjeva. Dobro osmišljen sustav stoga može pohraniti šifrirani tekst na identifikatoru poput `/note/abc123`, a materijal za dešifriranje držati u `#…`, izvan običnih poslužiteljskih zapisa tog učitavanja stranice.",
        "Stavljanje ključa iza # samo po sebi ne čini aplikaciju sigurnom. Kriptografija oko toga i dalje mora biti zdrava: jak nasumični ključ, autentificirano šifriranje i poslužitelj kojjem otvoreni tekst nikad ne treba. Fragment odvaja te dijelove—nije prečac oko njih.",
      ],
    },
    {
      title: "Jednokratna poveznica, poveznica koja istječe i poruka koja nestaje",
      paragraphs: [
        "Te se ideje često miješaju. To su različite kontrole, a jedan proizvod može ih kombinirati.",
      ],
      bullets: [
        {
          label: "Jednokratna poveznica",
          body: "Dostupnost prije svega ovisi o pristupu. Nakon predviđenog dohvata—u PrivateNoteu uspješnog prikaza koji dosegne ograničenje—šifrirani teret nestaje s poslužitelja.",
        },
        {
          label: "Poveznica koja istječe",
          body: "Dostupnost prije svega ovisi o vremenu. Poveznica ostaje dohvatljiva do isteka roka, bila otvorena ili ne.",
        },
        {
          label: "Poruka koja nestaje",
          body: "Dio je tekućeg razgovora. Zadržavanje slijedi politiku messengera, koja i dalje može ostaviti sigurnosne kopije, citate ili kopije na uređaju.",
        },
      ],
      callout:
        "**PrivateNote kombinira pristup i vrijeme.** Nove bilješke kreću s jednim uspješnim prikazom i istječu i ako se ne otvore—zadano jedan dan, s kraćim ili duljim predlošcima ovisno o planu. To je privremena predaja: dohvatite ili pričekajte, i kopija na poslužitelju nestaje.",
    },
    {
      title: "Jesu li jednokratne poveznice sigurne?",
      paragraphs: [
        "Mogu biti. Sigurnost ovisi o provedbi i o tome kako se poveznica šalje—ne o izrazu „jednokratna“.",
        "Ozbiljan dizajn treba razmotriti šifriranje na klijentu, jake nasumične ključeve, što poslužitelj vidi, istek, značenje pristupa, opcionalnu lozinku, opcionalnu provjeru primatelja, metapodatke, curenje poveznice, kompromitirani uređaj i ponašanje primatelja.",
        "PrivateNote šifrira u pregledniku, pohranjuje šifrirani tekst, drži ključ u URL fragmentu, zadano ograničava na jedan prikaz i ističe neiskorištene bilješke. Možete dodati lozinku ili, na plaćenim planovima, provjeru primatelja. Primatelj ne treba račun.",
        "Jednokratna poveznica **ne štiti** od kompromitiranog uređaja, primatelja koji kopira tajnu nakon pregleda, snimke zaslona ili fotografije, ni od slanja cijelog URL-a—uključujući fragment—pogrešnoj osobi. Cijelu poveznicu tretirajte kao ovlast pristupa.",
      ],
    },
    {
      title: "Kada koristiti jednokratnu poveznicu?",
      paragraphs: [
        "Kad tajna ima kratak posao: stići, biti korištena i prestati živjeti u kanalu kojjim ste je poslali.",
      ],
      subsections: [
        {
          title: "Lozinke",
          paragraphs: [
            "Jednokratna poveznica dobro pristaje za predaju privremene ili novo stvorene lozinke jednom primatelju, bez ostavljanja otvorenog teksta u pošti ili chatu. Za tok namijenjen lozinkama vidi [kako sigurno podijeliti lozinku](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "API ključevi i tokeni",
          paragraphs: [
            "Razvojnim inženjerima i vanjskim suradnicima često treba ključ jednom. Slanje putem poveznice drži sirovu vjerodajnicu izvan Slack niti, tiketa i Git komentara. Vidi [kako sigurno podijeliti API ključ](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Kodovi za oporavak",
          paragraphs: [
            "Korisno kad rezervni ili 2FA kod za oporavak stvarno mora doći do druge ovlaštene osobe—i ne smije ostati pretraživ u niti koja ga je nosila.",
          ],
        },
        {
          title: "Privatne poruke",
          paragraphs: [
            "Informacija koju treba javiti jednom, bez da postane trajni razgovor. Primatelj može otvoriti bilješku bez računa. Vidi [slanje tajne poruke bez računa](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Osjetljive datoteke",
          paragraphs: [
            "Datoteka traži dodatnu pažnju: veličinu, preuzimanje, pretpregled i zaseban prozor pristupa nakon otvaranja bilješke. U PrivateNoteu slanje datoteke zahtijeva račun pošiljatelja; otvaranje ne. Privitci ostaju dohvatljivi u ograničenom vremenu nakon prikaza—zadano jedan sat. Koristite [siguran prijenos datoteka](app:secure-file-transfer) kad je sadržaj dokument, a ne kratka tajna.",
          ],
        },
      ],
    },
    {
      title: "Kada je ne koristiti?",
      paragraphs: [
        "Jednokratna poveznica pogrešan je alat kad je posao pohrana, suradnja ili evidencija koju ste dužni čuvati.",
      ],
      poorFits: [
        "Dugoročna pohrana lozinki: koristite trezor upravitelja lozinkama.",
        "Trajni razgovor: koristite messenger kojjem obje strane već vjeruju, npr. Signal.",
        "Organizacijske evidencije koje treba čuvati zbog revizije ili zakonske obveze.",
        "Tajne koje uopće ne treba prenositi—generirajte ih na mjestu ili ih ne dijelite.",
        "Kripto seed-fraze i druge nepovratne glavne tajne: poveznica i dalje može procuriti ako se kopira cijeli URL. Pročitajte [kripto seed-fraze i jednokratne poveznice](blog:crypto-seed-phrase-one-time-link) prije nego taj obrazac tamo primijenite.",
      ],
    },
    {
      title: "Jednokratna poveznica, e-pošta, poruke i upravitelji lozinkama",
      paragraphs: [
        "Korisna usporedba je svrha i postojanost—ne rangiranje koji je kanal „siguran“.",
      ],
      comparisonTable: {
        headers: [
          "Kanal",
          "Glavna namjena",
          "Šifriranje od kraja do kraja",
          "Uobičajena postojanost",
          "Prikladno za kratku predaju tajne?",
        ],
        rows: [
          [
            "E-pošta",
            "Trajna korespondencija",
            "Šifriranje u prijenosu uobičajeno je; šifriranje od kraja do kraja općenito nije zadano",
            "Obično ostaje u više pretinaca, sigurnosnim kopijama i pretragama",
            "Loš izbor za tajnu u otvorenom tekstu",
          ],
          [
            "Slack / Teams",
            "Radni razgovor i pretraga",
            "Šifrirano u prijenosu i u mirovanju na platformi; zadano nije od kraja do kraja",
            "Pretraživa, izvoziva povijest radnog prostora",
            "Loš izbor za tajnu u otvorenom tekstu; prihvatljivo za slanje poveznice",
          ],
          [
            "SMS / iMessage",
            "Osobne poruke",
            "Jako varira ovisno o operateru i platformi",
            "Često sa sigurnosnom kopijom ili sinkronizacijom u oblaku",
            "Loš izbor za tajnu u otvorenom tekstu",
          ],
          [
            "WhatsApp",
            "Privatni razgovor",
            "Od kraja do kraja za chatove; sigurnosne kopije možda nisu",
            "Kopije na uređaju i, po izboru, u oblaku",
            "Bolje od e-pošte za razgovor; i dalje loše mjesto za ostaviti lozinku",
          ],
          [
            "Signal",
            "Privatni razgovor",
            "Od kraja do kraja",
            "Poruke koje nestaju mogu se konfigurirati",
            "Razumna alternativa kad obje strane već koriste tu aplikaciju",
          ],
          [
            "Upravitelj lozinkama",
            "Pohrana i dijeljenje vjerodajnica",
            "Da, po dizajnu",
            "Građen za dugoročno čuvanje",
            "Izvrstan za timove i stalni pristup; često teži od ad-hoc predaje",
          ],
          [
            "PrivateNote",
            "Privremena šifrirana predaja",
            "Šifriranje na klijentu; ključ u URL fragmentu",
            "Ograničenje pregleda plus istek; šifrirani tekst briše se kad su ti uvjeti ispunjeni",
            "Osmišljen za ovu namjenu",
          ],
        ],
      },
    },
    {
      title: "Problem pretpregleda poveznice",
      paragraphs: [
        "Mnoge chat aplikacije dohvaćaju dolazni URL da sagrade pretpregled—naslov, opis, sličicu. Kad bi samo učitavanje stranice brojalo kao čitanje, taj bi robot potrošio jednokratnu poveznicu prije nego što je primatelj otvori.",
        "PrivateNote ne tretira učitavanje stranice kao čitanje. Javni URL bilješke prikazuje vrata „klikni za prikaz“. Metapodatke te stranice moguće je dohvatiti bez vraćanja otvorenog teksta. Šifrirani tekst dohvaća se tek nakon namjerne radnje prikaza. Pretpregled u Slacku, Teamsu ili iMessageu stoga ne prima tajnu i ne troši ograničenje pregleda.",
        "To je odluka dizajna klijenta i API-ja, ne popis blokiranih korisničkih agenata. I dalje je važno kako šaljete poveznicu: tko ima cijeli URL, uključujući fragment, i klikne za prikaz, može pročitati bilješku. Za upozorenje primatelju vidi [zašto bilješke čekaju klik za prikaz](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Kako stvoriti jednokratnu poveznicu",
      paragraphs: ["Držite korake kratkima. Alat šifrira; vi birate pravila pristupa."],
      numberedSteps: [
        { title: "Otvorite PrivateNote", body: "Koristite uređivač na stranici—za tekstualnu bilješku račun nije potreban." },
        { title: "Unesite što trebate podijeliti", body: "Lozinku, poruku, API ključ ili, s računom, datoteku." },
        {
          title: "Odaberite istek i pristup",
          body: "Birajte najkraći vijek koji još ima smisla. Zadano: jedan pregled i jedan dan ako se ne iskoristi. Dodajte lozinku ili provjeru primatelja ako osjetljivost to opravdava.",
        },
        { title: "Stvorite šifriranu poveznicu", body: "Preglednik prvo šifrira, zatim šalje šifrirani tekst." },
        { title: "Pošaljite poveznicu predviđenom primatelju", body: "Ne lijepite otvoreni tekst pokraj nje." },
      ],
      closingNote: "Kad ste spremni, [stvorite jednokratnu poveznicu](app:one-time-link).",
    },
    {
      title: "Prije slanja tajne",
      paragraphs: ["Pažljiva predaja ponajprije je operativna. Kriptografija ne ispravlja pogrešnog primatelja."],
      checklist: [
        "Potvrdite primatelja prije slanja cijelog URL-a.",
        "Koristite najkraći istek koji ima smisla.",
        "Dodajte lozinku ili provjeru primatelja ako osjetljivost to opravdava.",
        "Dodatni faktor autentikacije pošaljite drugim kanalom.",
        "Nakon korištenja rotirajte privremene vjerodajnice.",
        "Ne prenosite tajne koje se ne moraju micati.",
        "Računajte na to da primatelj može kopirati, fotografirati ili snimiti ono što vidi.",
      ],
    },
    {
      title: "Česta pitanja",
      paragraphs: [],
      faqs: [
        {
          question: "Što je jednokratna poveznica?",
          answer:
            "URL koji predaje tajnu na dohvat, a zatim šifriranu kopiju na poslužitelju čini nedostupnom prema pravilima pristupa i isteka—da otvoreni tekst ne mora živjeti u e-pošti ili chatu.",
        },
        {
          question: "Kako sigurno poslati lozinku putem poveznice?",
          answer:
            "Lozinku stavite u bilješku, ne u poruku koja nosi poveznicu. Savjeti za odvojene kanale u [kako sigurno podijeliti lozinku](blog:how-to-share-a-password-securely).",
        },
        {
          question: "Je li to sigurnije od e-pošte?",
          answer:
            "Za samu tajnu da, jer e-pošta čuva otvoreni tekst. Poveznica i dalje može ići e-poštom; u pretincu ostaje URL, ne vjerodajnica.",
        },
        {
          question: "Što se događa nakon otvaranja poveznice?",
          answer:
            "U PrivateNoteu uspješan prikaz broji se kao pregled. Uz zadano ograničenje od jednog pregleda poslužitelj zatim briše šifrirani tekst. Sadržaj može ostati vidljiv u već otvorenom pregledniku. Neiskorištene poveznice istječu i vremenski.",
        },
        {
          question: "Treba li primatelj račun?",
          answer:
            "Ne. Tko ima cijelu poveznicu, može otvoriti nezaštićenu bilješku. Lozinka ili provjera vrijede samo ako ih je pošiljatelj uključio.",
        },
        {
          question: "Mogu li poslati datoteku jednokratnom poveznicom?",
          answer:
            "Da, putem PrivateNoteova [sigurnog prijenosa datoteka](app:secure-file-transfer). Slanje zahtijeva besplatni račun; otvaranje ne. Nakon prikaza privitci slijede zaseban prozor pristupa—zadano jedan sat.",
        },
        {
          question: "Koja je razlika između jednokratne i poveznice koja istječe?",
          answer:
            "Jednokratnost govori o pristupu: nestaje nakon predviđenog dohvata. Istek govori o vremenu: nestaje nakon roka, i bez otvaranja. PrivateNote koristi oboje.",
        },
        {
          question: "Može li netko napraviti snimku zaslona jednokratne tajne?",
          answer:
            "Da. Što je na zaslonu, može se kopirati, fotografirati ili uhvatiti. Jednokratna poveznica ograničava izvornu kopiju na poslužitelju; to nije DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Vrsta kanala",
    encrypted: "Šifrirano?",
    persistent: "Trajno?",
    verdict: "Prikladno za jednokratnu tajnu?",
  },
  goodFitsLabel: "Dobri slučajevi",
  poorFitsLabel: "Loši slučajevi",
  closingTitle: "Gdje PrivateNote pripada",
  closingBody:
    "PrivateNote je alat za predaju. Nije dugoročni trezor lozinki, timski wiki ni arhiva usklađenosti. Šifrirajte u pregledniku, podijelite privremenu poveznicu i pustite da kopija na poslužitelju istekne kad je posao gotov.",
  encryptLu: "",
  tagline: "Uskladite vijek tajne s vijekom medija koji je nosi.",
  relatedReading: "Povezano čitanje",
  ctaTitle: "Stvorite jednokratnu poveznicu",
  ctaBody: "Šifrirajte poruku, lozinku ili datoteku u pregledniku i podijelite je privremenom poveznicom.",
  ctaButton: "Stvorite sigurnu poveznicu",
};
