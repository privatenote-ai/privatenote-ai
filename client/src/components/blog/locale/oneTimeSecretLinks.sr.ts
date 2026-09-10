import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksSr: OneTimeSecretLinksArticleCopy = {
  intro: [
    "**Jednokratni link** je URL kojj predaje osetljivu informaciju bez da otvoreni tekst trajno ostane u e-pošti ili istoriji četa. Primalac otvori link, prikaže tajnu u pregledaču, a šifrovana kopija na serveru zatim postane nedostupna prema pravilima pristupa i isteka.",
    "Koristan je za lozinke, API ključeve, kodove za oporavak, privremene akreditive i privatne poruke koje treba da stignu jednom—i ne trebaju trajni razgovor.",
    "Problem nije uvek presretanje. Problem je **zadržavanje**. Šifrovanje štiti pristup. Kratkotrajnost smanjuje koliko dugo nepotrebne kopije ostaju dostupne. Jednokratni link pokriva treći posao: **privremenu predaju**.",
  ],
  earlyCta: {
    body: "Treba li da pošaljete jedan sada?",
    linkLabel: "Napravite šifrovani jednokratni link sa PrivateNote-om",
  },
  sections: [
    {
      title: "Šta je jednokratni link?",
      paragraphs: [
        "Za istu ideju postoji više naziva: tajni link, samouništiva beleška, link koji ističe, „izgoreti posle čitanja“. Natpis se menja. Bezbednosna svojstva ne dolaze automatski sa imenom.",
        "Proizvod nazvan „jednokratnom tajnom“ sam po sebi ne znači da se šifrovanje dešava u pregledaču, da provajder ne može da pročita sadržaj, da ključ ostaje van servera, da brisanje stvarno prati čitanje ili da metapodaci nestaju. To su odluke dizajna. Procenjujte svojstva, ne slogan.",
        "Koristan spisak: gde se otvoreni tekst šifruje? Prima li server ikada ključ za dešifrovanje? Šta se dešava posle predviđenog dohvata? Koliko dugo neiskorišćeni link ostaje dostupan? Šta pregled četa dohvata ako neko nalepi URL?",
      ],
    },
    {
      title: "Kako funkcioniše jednokratni link?",
      paragraphs: [
        "U klijentskom dizajnu kao što je PrivateNote-ov, tajna se šifruje u pregledaču pošiljaoca pre slanja. Server čuva šifrovani tekst. Pregledač primaoca dešifruje lokalno. Tekst beleške koristi AES-256-GCM preko Web Crypto API-ja.",
      ],
      beforeFlowSteps: "**U praksi ceo tok izgleda ovako:**",
      flowSteps: [
        {
          title: "Ključ i šifrovanje u pregledaču",
          step: "Korak 1: vaš pregledač",
          body: "Tajnu unosite lokalno. Pregledač generiše kriptografski materijal i šifruje otvoreni tekst pre nego što bilo koji mrežni zahtev napusti uređaj.",
        },
        {
          title: "Šalje se samo šifrovani tekst",
          step: "Korak 2: server",
          body: "Prenosi se samo šifrovani teret. Server čuva tekst koji ne može da pročita jer ne prima ni otvoreni tekst ni ključ iz fragmenta.",
        },
        {
          title: "Ključ ostaje u linku",
          step: "Korak 3: URL",
          body: "Ključ za dešifrovanje stavlja se u URL fragment—deo posle #. Javna putanja identifikuje belešku; fragment ostaje u pregledaču pri uobičajenoj HTTPS navigaciji.",
        },
        {
          title: "Prikaži, dešifruj, zatim primeni pravila pristupa",
          step: "Korak 4: primalac",
          body: "Otvaranje stranice nije dovoljno. Primalac klikne da prikaže, čime se dohvata šifrovani tekst. Pregledač dešifruje lokalno. Posle uspešnog prikaza PrivateNote primenjuje ograničenje pregleda—podrazumevano jedan—i briše šifrovani tekst kad se to ograničenje dosegne. Neiskorišćeni linkovi ističu i vremenski.",
        },
      ],
      afterFlowSteps: [
        "Nisu svi proizvodi koji se prodaju kao jednokratni link prate ovaj model. Neki šifruju na serveru posle prijema teksta ili tamo generišu ključ, što bi usluzi omogućilo čitanje tajne. Drugi brišu po rasporedu, ali čuvaju kopije koje se mogu vratiti. Pitajte da li je sproveden ceo dizajn—ne samo da li link ističe.",
        "Za arhitekturu šifrovanja PrivateNote-a, uključujući umotavanje lozinkom sa Argon2id, vidi [Kako funkcioniše](app:how-it-works).",
      ],
    },
    {
      title: "Zašto je URL fragment važan",
      paragraphs: [
        "Ovaj se detalj lako previdi, a temelj je ove arhitekture.",
        "Pri uobičajenoj HTTPS navigaciji pregledač šalje putanju i upit serveru. [URL fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—sve posle #—ostaje u pregledaču i nije deo tog zahteva. Dobro osmišljen sistem stoga može da čuva šifrovani tekst na identifikatoru kao `/note/abc123`, a materijal za dešifrovanje drži u `#…`, van običnih serverskih zapisa tog učitavanja stranice.",
        "Stavljanje ključa iza # samo po sebi ne čini aplikaciju bezbednom. Kriptografija oko toga i dalje mora da bude zdrava: jak nasumični ključ, autentifikovano šifrovanje i server kome otvoreni tekst nikad ne treba. Fragment odvaja te delove—nije prečica oko njih.",
      ],
    },
    {
      title: "Jednokratni link, link koji ističe i poruka koja nestaje",
      paragraphs: [
        "Te se ideje često mešaju. To su različite kontrole, a jedan proizvod može da ih kombinuje.",
      ],
      bullets: [
        {
          label: "Jednokratni link",
          body: "Dostupnost pre svega zavisi od pristupa. Posle predviđenog dohvata—u PrivateNote-u uspešnog prikaza koji dosegne ograničenje—šifrovani teret nestaje sa servera.",
        },
        {
          label: "Link koji ističe",
          body: "Dostupnost pre svega zavisi od vremena. Link ostaje dohvatljiv do isteka roka, bio otvoren ili ne.",
        },
        {
          label: "Poruka koja nestaje",
          body: "Deo je tekućeg razgovora. Zadržavanje prati politiku mesendžera, koja i dalje može da ostavi rezervne kopije, citate ili kopije na uređaju.",
        },
      ],
      callout:
        "**PrivateNote kombinuje pristup i vreme.** Nove beleške kreću sa jednim uspešnim prikazom i ističu i ako se ne otvore—podrazumevano jedan dan, sa kraćim ili dužim predlošcima zavisno od plana. To je privremena predaja: dohvatite ili sačekajte, i kopija na serveru nestaje.",
    },
    {
      title: "Da li su jednokratni linkovi bezbedni?",
      paragraphs: [
        "Mogu biti. Bezbednost zavisi od implementacije i od toga kako se link šalje—ne od izraza „jednokratni“.",
        "Ozbiljan dizajn treba da razmotri šifrovanje na klijentu, jake nasumične ključeve, šta server vidi, istek, značenje pristupa, opcionu lozinku, opcionu proveru primaoca, metapodatke, curenje linka, kompromitovani uređaj i ponašanje primaoca.",
        "PrivateNote šifruje u pregledaču, čuva šifrovani tekst, drži ključ u URL fragmentu, podrazumevano ograničava na jedan prikaz i ističe neiskorišćene beleške. Možete da dodate lozinku ili, na plaćenim planovima, proveru primaoca. Primalac ne treba nalog.",
        "Jednokratni link **ne štiti** od kompromitovanog uređaja, primaoca koji kopira tajnu posle pregleda, snimka ekrana ili fotografije, ni od slanja celog URL-a—uključujući fragment—pogrešnoj osobi. Ceo link tretirajte kao ovlašćenje pristupa.",
      ],
    },
    {
      title: "Kada koristiti jednokratni link?",
      paragraphs: [
        "Kad tajna ima kratak posao: stići, biti korišćena i prestati da živi u kanalu kojjim ste je poslali.",
      ],
      subsections: [
        {
          title: "Lozinke",
          paragraphs: [
            "Jednokratni link dobro pristaje za predaju privremene ili novo napravljene lozinke jednom primaocu, bez ostavljanja otvorenog teksta u pošti ili četu. Za tok namenjen lozinkama vidi [kako bezbedno podeliti lozinku](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "API ključevi i tokeni",
          paragraphs: [
            "Razvojnim inženjerima i spoljnim saradnicima često treba ključ jednom. Slanje preko linka drži sirovi akreditiv van Slack niti, tiketa i Git komentara. Vidi [kako bezbedno podeliti API ključ](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Kodovi za oporavak",
          paragraphs: [
            "Korisno kad rezervni ili 2FA kod za oporavak stvarno mora da stigne do druge ovlašćene osobe—i ne sme da ostane pretraživ u niti koja ga je nosila.",
          ],
        },
        {
          title: "Privatne poruke",
          paragraphs: [
            "Informacija koju treba javiti jednom, bez da postane trajni razgovor. Primalac može da otvori belešku bez naloga. Vidi [slanje tajne poruke bez naloga](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Osetljivi fajlovi",
          paragraphs: [
            "Fajl traži dodatnu pažnju: veličinu, preuzimanje, pregled i poseban prozor pristupa posle otvaranja beleške. U PrivateNote-u slanje fajla zahteva nalog pošiljaoca; otvaranje ne. Prilozi ostaju dohvatljivi u ograničenom vremenu posle prikaza—podrazumevano jedan sat. Koristite [bezbedan prenos fajlova](app:secure-file-transfer) kad je sadržaj dokument, a ne kratka tajna.",
          ],
        },
      ],
    },
    {
      title: "Kada ga ne koristiti?",
      paragraphs: [
        "Jednokratni link je pogrešan alat kad je posao skladištenje, saradnja ili evidencija koju ste dužni da čuvate.",
      ],
      poorFits: [
        "Dugoročno čuvanje lozinki: koristite trezor menadžera lozinki.",
        "Trajni razgovor: koristite mesendžer kome obe strane već veruju, npr. Signal.",
        "Organizacione evidencije koje treba čuvati zbog revizije ili zakonske obaveze.",
        "Tajne koje uopšte ne treba prenositi—generišite ih na mestu ili ih ne delite.",
        "Kripto seed-fraze i druge nepovratne glavne tajne: link i dalje može da procuri ako se kopira ceo URL. Pročitajte [kripto seed-fraze i jednokratni linkovi](blog:crypto-seed-phrase-one-time-link) pre nego taj obrazac tamo primenite.",
      ],
    },
    {
      title: "Jednokratni link, e-pošta, poruke i menadžeri lozinki",
      paragraphs: [
        "Korisna poredba je svrha i postojanost—ne rangiranje koji je kanal „bezbedan“.",
      ],
      comparisonTable: {
        headers: [
          "Kanal",
          "Glavna namena",
          "Šifrovanje od kraja do kraja",
          "Uobičajena postojanost",
          "Pogodno za kratku predaju tajne?",
        ],
        rows: [
          [
            "E-pošta",
            "Trajna korespondencija",
            "Šifrovanje u prenosu uobičajeno je; šifrovanje od kraja do kraja uglavnom nije podrazumevano",
            "Obično ostaje u više sandučića, rezervnim kopijama i pretragama",
            "Loš izbor za tajnu u otvorenom tekstu",
          ],
          [
            "Slack / Teams",
            "Radni razgovor i pretraga",
            "Šifrovano u prenosu i u mirovanju na platformi; podrazumevano nije od kraja do kraja",
            "Pretraživa, izvoziva istorija radnog prostora",
            "Loš izbor za tajnu u otvorenom tekstu; prihvatljivo za slanje linka",
          ],
          [
            "SMS / iMessage",
            "Lične poruke",
            "Jako varira zavisno od operatera i platforme",
            "Često sa rezervnom kopijom ili sinhronizacijom u oblaku",
            "Loš izbor za tajnu u otvorenom tekstu",
          ],
          [
            "WhatsApp",
            "Privatni razgovor",
            "Od kraja do kraja za četove; rezervne kopije možda nisu",
            "Kopije na uređaju i, po izboru, u oblaku",
            "Bolje od e-pošte za razgovor; i dalje loše mesto da ostavite lozinku",
          ],
          [
            "Signal",
            "Privatni razgovor",
            "Od kraja do kraja",
            "Poruke koje nestaju mogu da se podese",
            "Razumna alternativa kad obe strane već koriste tu aplikaciju",
          ],
          [
            "Menadžer lozinki",
            "Skladištenje i deljenje akreditiva",
            "Da, po dizajnu",
            "Građen za dugoročno čuvanje",
            "Odličan za timove i stalni pristup; često teži od ad-hoc predaje",
          ],
          [
            "PrivateNote",
            "Privremena šifrovana predaja",
            "Šifrovanje na klijentu; ključ u URL fragmentu",
            "Ograničenje pregleda plus istek; šifrovani tekst briše se kad su ti uslovi ispunjeni",
            "Osmišljen za ovu namenu",
          ],
        ],
      },
    },
    {
      title: "Problem pregleda linka",
      paragraphs: [
        "Mnoge aplikacije za čet dohvataju dolazni URL da sagrade pregled—naslov, opis, sličicu. Kad bi samo učitavanje stranice brojalo kao čitanje, taj bi robot potrošio jednokratni link pre nego što ga primalac otvori.",
        "PrivateNote ne tretira učitavanje stranice kao čitanje. Javni URL beleške prikazuje vrata „klikni da prikažeš“. Metapodatke te stranice moguće je dohvatiti bez vraćanja otvorenog teksta. Šifrovani tekst dohvata se tek posle namernog prikaza. Pregled u Slack-u, Teams-u ili iMessage-u stoga ne prima tajnu i ne troši ograničenje pregleda.",
        "To je odluka dizajna klijenta i API-ja, ne spisak blokiranih korisničkih agenata. I dalje je važno kako šaljete link: ko ima ceo URL, uključujući fragment, i klikne da prikaže, može da pročita belešku. Za upozorenje primaocu vidi [zašto beleške čekaju klik za prikaz](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Kako napraviti jednokratni link",
      paragraphs: ["Držite korake kratkim. Alat šifruje; vi birate pravila pristupa."],
      numberedSteps: [
        { title: "Otvorite PrivateNote", body: "Koristite uređivač na sajtu—za tekstualnu belešku nalog nije potreban." },
        { title: "Unesite šta treba da podelite", body: "Lozinku, poruku, API ključ ili, sa nalogom, fajl." },
        {
          title: "Izaberite istek i pristup",
          body: "Birajte najkraći vek koji još ima smisla. Podrazumevano: jedan pregled i jedan dan ako se ne iskoristi. Dodajte lozinku ili proveru primaoca ako osetljivost to opravdava.",
        },
        { title: "Napravite šifrovani link", body: "Pregledač prvo šifruje, zatim šalje šifrovani tekst." },
        { title: "Pošaljite link predviđenom primaocu", body: "Ne lepite otvoreni tekst pored njega." },
      ],
      closingNote: "Kad ste spremni, [napravite jednokratni link](app:one-time-link).",
    },
    {
      title: "Pre slanja tajne",
      paragraphs: ["Pažljiva predaja pre svega je operativna. Kriptografija ne ispravlja pogrešnog primaoca."],
      checklist: [
        "Potvrdite primaoca pre slanja celog URL-a.",
        "Koristite najkraći istek koji ima smisla.",
        "Dodajte lozinku ili proveru primaoca ako osetljivost to opravdava.",
        "Dodatni faktor autentikacije pošaljite drugim kanalom.",
        "Posle korišćenja rotirajte privremene akreditive.",
        "Ne prenosite tajne koje ne moraju da se pomeraju.",
        "Računajte na to da primalac može da kopira, fotografiše ili snimi ono što vidi.",
      ],
    },
    {
      title: "Česta pitanja",
      paragraphs: [],
      faqs: [
        {
          question: "Šta je jednokratni link?",
          answer:
            "URL koji predaje tajnu na dohvat, a zatim šifrovanu kopiju na serveru čini nedostupnom prema pravilima pristupa i isteka—da otvoreni tekst ne mora da živi u e-pošti ili četu.",
        },
        {
          question: "Kako bezbedno poslati lozinku preko linka?",
          answer:
            "Lozinku stavite u belešku, ne u poruku koja nosi link. Saveti za odvojene kanale u [kako bezbedno podeliti lozinku](blog:how-to-share-a-password-securely).",
        },
        {
          question: "Da li je to bezbednije od e-pošte?",
          answer:
            "Za samu tajnu da, jer e-pošta čuva otvoreni tekst. Link i dalje može da ide e-poštom; u sandučetu ostaje URL, ne akreditiv.",
        },
        {
          question: "Šta se dešava posle otvaranja linka?",
          answer:
            "U PrivateNote-u uspešan prikaz broji se kao pregled. Uz podrazumevano ograničenje od jednog pregleda server zatim briše šifrovani tekst. Sadržaj može da ostane vidljiv u već otvorenom pregledaču. Neiskorišćeni linkovi ističu i vremenski.",
        },
        {
          question: "Da li primalac treba nalog?",
          answer:
            "Ne. Ko ima ceo link, može da otvori nezaštićenu belešku. Lozinka ili provera važe samo ako ih je pošiljalac uključio.",
        },
        {
          question: "Mogu li da pošaljem fajl jednokratnim linkom?",
          answer:
            "Da, preko PrivateNote-ovog [bezbednog prenosa fajlova](app:secure-file-transfer). Slanje zahteva besplatni nalog; otvaranje ne. Posle prikaza prilozi prate poseban prozor pristupa—podrazumevano jedan sat.",
        },
        {
          question: "Koja je razlika između jednokratnog i linka koji ističe?",
          answer:
            "Jednokratnost govori o pristupu: nestaje posle predviđenog dohvata. Istek govori o vremenu: nestaje posle roka, i bez otvaranja. PrivateNote koristi oba.",
        },
        {
          question: "Može li neko da napravi snimak ekrana jednokratne tajne?",
          answer:
            "Da. Što je na ekranu, može da se kopira, fotografiše ili uhvati. Jednokratni link ograničava izvornu kopiju na serveru; to nije DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Vrsta kanala",
    encrypted: "Šifrovano?",
    persistent: "Trajno?",
    verdict: "Pogodno za jednokratnu tajnu?",
  },
  goodFitsLabel: "Dobri slučajevi",
  poorFitsLabel: "Loši slučajevi",
  closingTitle: "Gde PrivateNote pripada",
  closingBody:
    "PrivateNote je alat za predaju. Nije dugoročni trezor lozinki, timski viki ni arhiva usklađenosti. Šifrujte u pregledaču, podelite privremeni link i pustite da kopija na serveru istekne kad je posao gotov.",
  encryptLu: "",
  tagline: "Uskladite vek tajne sa vekom medija koji je nosi.",
  relatedReading: "Povezano čitanje",
  ctaTitle: "Napravite jednokratni link",
  ctaBody: "Šifrujte poruku, lozinku ili fajl u pregledaču i podelite ih privremenim linkom.",
  ctaButton: "Napravite bezbedan link",
};
