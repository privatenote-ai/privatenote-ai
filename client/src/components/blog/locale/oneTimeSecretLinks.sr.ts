import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksSr: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Većina ljudi deli osetljive informacije na isti način kao i sve ostalo: e-poštom, u Slacku ili SMS-om.",
    "To funkcioniše dok ne shvatite šta ste zapravo uradili. Niste samo preneli lozinku ili API ključ — ostavili ste **trajni zapis** u tuđem sandučetu, arhivi četa kompanije, cloud rezervnoj kopiji, izvozu za usklađenost ili sažetku sastanka generisanom AI-jem na koji više niko ne misli.",
    "Neke informacije imaju kratku ulogu. Lozinka za staging. Kod za oporavak. Jednokratna uputa za pristup. Akreditivi izvođača koji ističu u petak. Te tajne ne trebaju pretraživu istoriju. Moraju stići, biti korišćene i nestati.",
    "Upravo za to služe **jednokratni tajni linkovi**.",
  ],
  sections: [
    {
      title: 'Problem kanala koji su „dovoljno bezbedni“',
      paragraphs: [
        "E-pošta može biti šifrovana u prenosu. Slack može biti zaštićen jedinstvenom prijavom (SSO). Signal nudi nestajuće poruke. Sve to pomaže — ali rešava potpuno drugi problem.",
        "Problem nije uvek presretanje. Problem je **zadržavanje**.",
        "Kada pošaljete tajnu običnim kanalom, kladite se na dugačak lanac pretpostavki:",
      ],
      bullets: [
        { label: "Poruka se nikada neće proslediti, snimiti ekranom ili kopirati.", body: "" },
        { label: "Niko slučajno neće pretraživati zajedničku istoriju četa šest meseci kasnije.", body: "" },
        {
          label:
            "Rezervne kopije, izvozi sa servera i eDiscovery tokovi neće brzu predaju pretvoriti u dugoročnu odgovornost.",
          body: "",
        },
        {
          label:
            "Botovi za pregled linkova u Slacku, Teamsima ili iMessageu neće automatski dohvatiti URL i uništiti poruku pre nego što primalac otvori link.",
          body: "",
        },
        {
          label:
            "Tajna će odmah biti zamenjena nakon korišćenja, iako stara vrednost još uvek negde leži u serverskom logu.",
          body: "",
        },
      ],
      callout:
        "**Razdvajanje uloga:** Šifrovanje štiti sadržaj u pokretu. Kratkotrajnost smanjuje ono što postoji posle. Oboje je važno — ali većina alata za komunikaciju optimizuje prvo i potpuno zanemaruje drugo.",
    },
    {
      title: "Šta je jednokratni tajni link zapravo",
      paragraphs: [
        'Jednokratni tajni link (ponekad se zove link koji se **briše ili uništava nakon čitanja** ili samouništavajuća poruka) URL je namenjen isporuci osetljivog teksta jednom čitaocu, jednom. Nakon tog čitanja sadržaj bi trebalo da bude nestao — ne arhiviran, ne pretraživ, ne ostavljen u sandučetu ili istoriji četa.',
        "**Pravi jednokratni dizajn** stroži je od vremena isteka. Ključno: **ključ za šifrovanje generiše se u vašem pregledaču** — nikada na serveru — a običan tekst se tamo šifruje pre bilo kakvog prenosa.",
      ],
      beforeFlowSteps: "**U praksi, ceo tok izgleda ovako:**",
      flowSteps: [
        {
          title: "Generisanje ključa i šifrovanje u pregledaču",
          step: "Korak 1: Vaš pregledač",
          body: "Pišete tajnu u pregledaču. Pregledač lokalno generiše novi ključ za šifrovanje i njime šifruje tekst — pre nego bilo koji mrežni zahtev napusti vaš uređaj.",
        },
        {
          title: "Prenos samo šifrovanog teksta",
          step: "Korak 2: Server",
          body: "Prenosi se samo šifrovani sadržaj. Server čuva šifrovani tekst koji ne može pročitati jer nikada nije primio ključ niti običan tekst.",
        },
        {
          title: "Ključ ostaje u linku",
          step: "Korak 3: URL",
          body: "Ključ generisan u pregledaču dodaje se linku u URL fragment — deo posle # — koji se nikada ne šalje serveru.",
        },
        {
          title: "Jedno čitanje, zatim nestaje",
          step: "Korak 4: Primalac",
          body: "Primalac otvara ceo link. Pregledač čita ključ iz fragmenta, lokalno dešifruje, a server briše šifrovani sadržaj nakon tog prvog uspešnog čitanja.",
        },
      ],
      afterFlowSteps: [
        "Ne prati svaki proizvod koji se prodaje kao jednokratni tajni link ovaj obrazac. Neki alati šifruju tek na serveru nakon što prime vaš tekst — ili tamo generišu ključ, pa bi usluga mogla pročitati vašu tajnu. Drugi se oslanjaju na zajedničku lozinku koju usluga može proveriti. Treći brišu po rasporedu, ali zadržavaju metapodatke, logove ili kopije koje se mogu obnoviti. Pri izboru alata pitajte da li je implementiran ceo dizajn — ne samo da li link ističe.",
      ],
    },
    {
      title: "Zašto URL fragment ima značaj",
      paragraphs: [
        "Ovaj arhitektonski detalj lako se previdi — a ipak je temelj moderne web kriptografije.",
        "U standardnom HTTPS zahtevu sve pre simbola # šalje se direktno serveru. Sve posle ostaje u sandboxu pregledača. Dobro dizajniran sistem jednokratnih linkova može čuvati šifrovani sadržaj pod /note/abc123, dok ključ za dešifrovanje pod #xK9m2p... ostaje nevidljiv serverskim logovima, CDN putanjama i spoljnim tabelama baze podataka.",
      ],
    },
    {
      title: "Kada koristiti jednokratni link (a kada ne)",
      paragraphs: [
        "Nije svaki kanal pogrešan za svaku vrstu tajne — ali većina svakodnevnih alata građena je za trajnost, ne za jednokratnu predaju.",
      ],
      table: [
        {
          channel: "E-pošta",
          encrypted: "Često u prenosu",
          persistent: "Da — trajno, u više sandučeta",
          verdict: "✗ Loše",
        },
        {
          channel: "Slack / Teams",
          encrypted: "Da, na platformi",
          persistent: "Da — pretraživo, izvozivo",
          verdict: "✗ Loše",
        },
        {
          channel: "SMS / iMessage",
          encrypted: "Veoma različito",
          persistent: "Često rezervna kopija, sinhronizacija u oblaku",
          verdict: "✗ Loše",
        },
        {
          channel: "Menadžer lozinki",
          encrypted: "Da",
          persistent: "Dizajniran za trajno čuvanje",
          verdict: "Često nezgrapno — često plaćeno, sporo za brzu predaju",
        },
        {
          channel: "Jednokratni link",
          encrypted: "Da, na strani klijenta",
          persistent: "Odmah obrisano nakon čitanja",
          verdict: "✓ Namenjeno tome",
        },
      ],
      goodFits: [
        "Lozinke, API ključevi i privremeni tokeni predati jednom jednoj osobi.",
        "Kodovi za oporavak sistema i rezervne kopije 2FA.",
        'Privremene upute za fizički pristup („koristite ovaj kod vrata do 18 h“).',
        "Pravni ili HR osetljivi nacrti koji ne bi trebali postati institucionalno sećanje.",
      ],
      poorFits: [
        "Dugoročno čuvanje: koristite namenski trezor menadžera lozinki.",
        "Trajni razgovori: koristite messenger sa end-to-end šifrovanjem poput Signala.",
        "Tajne za reviziju: ako usklađenost zahteva nepromenjiv trag, koristite odobreni sistem skladištenja organizacije.",
      ],
    },
    {
      title: "Zamka pregleda linka",
      paragraphs: [
        "Ovo je način kvara koji mnogi timovi otkriju na teži način. Mnoge poslovne chat aplikacije automatski pregledavaju dolazne URL-ove kako bi generisale bogate preglede (naslove, opise, sličice).",
        "Taj automatski crawl može potrošiti jednokratni link pre nego što primalac uopšte stigne da klikne. Bot za pregled postaje prvi čitalac, poruka se briše ili uništava, a kolega otvara mrtav link.",
        "Ozbiljni alati za kratkotrajnost to aktivno ublažavaju: blokiranje poznatih crawler user-agenta, zahtev eksplicitnog klika pre lokalnog dešifrovanja i veoma kratka vremena isteka.",
      ],
    },
  ],
  tableHeaders: {
    channel: "Vrsta kanala",
    encrypted: "Šifrovano?",
    persistent: "Trajno?",
    verdict: "Dobro za jednokratne tajne?",
  },
  goodFitsLabel: "Dobri slučajevi upotrebe",
  poorFitsLabel: "Loši slučajevi upotrebe",
  closingTitle: "Gde PrivateNote stoji",
  closingBody:
    "PrivateNote je izgrađen upravo oko ovog modela šifrovanja na strani klijenta. Nije dugoročni trezor lozinki, timski wiki niti trajna arhiva za usklađenost. To je lagan, brz alat za predaju.",
  encryptLu:
    "Za veće datoteke koje trebaju isti model šifrovanja na strani klijenta, [Encrypt.lu](https://encrypt.lu) primenjuje isti arhitektonski pristup u razmeru datoteka.",
  tagline:
    "Obezbeđuje da vek trajanja osetljivih podataka odgovara veku trajanja medija kroz koji putuju. Jer ponekad je najsigurnija poruka ona koja potpuno prestaje da postoji.",
  relatedReading: "Dalje čitanje",
};
