import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksHr: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Većina ljudi dijeli osjetljive informacije na isti način kao i sve ostalo: e-poštom, u Slacku ili SMS-om.",
    "To funkcionira dok ne shvatite što ste zapravo učinili. Niste samo prenijeli lozinku ili API ključ — ostavili ste **trajni zapis** u tuđem pretincu e-pošte, arhivi chata tvrtke, cloud sigurnosnoj kopiji, izvozu za usklađenost ili sažetku sastanka generiranom AI-jem na koji više nitko ne misli.",
    "Neke informacije imaju kratku ulogu. Lozinka za staging. Kod za oporavak. Jednokratna uputa za pristup. Vjerodajnice izvođača koje istječu u petak. Te tajne ne trebaju pretraživu povijest. Moraju stići, biti korištene i nestati.",
    "Upravo za to služe **jednokratne tajne poveznice**.",
  ],
  sections: [
    {
      title: 'Problem kanala koji su „dovoljno sigurni“',
      paragraphs: [
        "E-pošta može biti šifrirana u prijenosu. Slack može biti zaštićen jedinstvenom prijavom (SSO). Signal nudi nestajuće poruke. Sve to pomaže — ali rješava potpuno drugi problem.",
        "Problem nije uvijek presretanje. Problem je **zadržavanje**.",
        "Kad pošaljete tajnu običnim kanalom, kladite se na dugačak lanac pretpostavki:",
      ],
      bullets: [
        { label: "Poruka se nikada neće proslijediti, snimiti zaslonom ili kopirati.", body: "" },
        { label: "Nitko slučajno neće pretraživati zajedničku povijest chata šest mjeseci kasnije.", body: "" },
        {
          label:
            "Sigurnosne kopije, izvozi s poslužitelja i eDiscovery tijekovi neće brzu predaju pretvoriti u dugoročnu odgovornost.",
          body: "",
        },
        {
          label:
            "Botovi za pregled poveznica u Slacku, Teamsima ili iMessageu neće automatski dohvatiti URL i uništiti bilješku prije nego što primatelj otvori poveznicu.",
          body: "",
        },
        {
          label:
            "Tajna će odmah biti zamijenjena nakon korištenja, iako stara vrijednost još uvijek negdje leži u poslužiteljskom zapisniku.",
          body: "",
        },
      ],
      callout:
        "**Razdvajanje uloga:** Šifriranje štiti sadržaj u pokretu. Kratkotrajnost smanjuje ono što postoji poslije. Oboje je važno — ali većina alata za komunikaciju optimizira prvo i potpuno zanemaruje drugo.",
    },
    {
      title: "Što je jednokratna tajna poveznica zapravo",
      paragraphs: [
        'Jednokratna tajna poveznica (ponekad se zove poveznica koja se **briše ili uništava nakon čitanja** ili samouništavajuća bilješka) URL je namijenjen isporuci osjetljivog teksta jednom čitatelju, jednom. Nakon tog čitanja sadržaj bi trebao biti nestao — ne arhiviran, ne pretraživ, ne ostavljen u pretincu e-pošte ili povijesti chata.',
        "**Pravi jednokratni dizajn** stroži je od vremena isteka. Ključno: **ključ za šifriranje generira se u vašem pregledniku** — nikada na poslužitelju — a običan tekst se tamo šifrira prije bilo kakvog prijenosa.",
      ],
      beforeFlowSteps: "**U praksi, cijeli tijek izgleda ovako:**",
      flowSteps: [
        {
          title: "Generiranje ključa i šifriranje u pregledniku",
          step: "Korak 1: Vaš preglednik",
          body: "Pišete tajnu u pregledniku. Preglednik lokalno generira novi ključ za šifriranje i njime šifrira tekst — prije nego bilo koji mrežni zahtjev napusti vaš uređaj.",
        },
        {
          title: "Prijenos samo šifriranog teksta",
          step: "Korak 2: Poslužitelj",
          body: "Prenosi se samo šifrirani sadržaj. Poslužitelj pohranjuje šifrirani tekst koji ne može pročitati jer nikada nije primio ključ niti običan tekst.",
        },
        {
          title: "Ključ ostaje u poveznici",
          step: "Korak 3: URL",
          body: "Ključ generiran u pregledniku dodaje se poveznici u URL fragment — dio nakon # — koji se nikada ne šalje poslužitelju.",
        },
        {
          title: "Jedno čitanje, zatim nestaje",
          step: "Korak 4: Primatelj",
          body: "Primatelj otvara cijelu poveznicu. Preglednik čita ključ iz fragmenta, lokalno dešifrira, a poslužitelj briše šifrirani sadržaj nakon tog prvog uspješnog čitanja.",
        },
      ],
      afterFlowSteps: [
        "Ne prati svaki proizdat koji se prodaje kao jednokratna tajna poveznica ovaj obrazac. Neki alati šifriraju tek na poslužitelju nakon što prime vaš tekst — ili tamo generiraju ključ, pa bi usluga mogla pročitati vašu tajnu. Drugi se oslanjaju na zajedničku lozinku koju usluga može provjeriti. Treći brišu po rasporedu, ali zadržavaju metapodatke, zapise ili kopije koje se mogu obnoviti. Pri odabiru alata pitajte je li implementiran cijeli dizajn — ne samo istječe li poveznica.",
      ],
    },
    {
      title: "Zašto URL fragment ima značaj",
      paragraphs: [
        "Ovaj arhitektonski detalj lako se previdi — a ipak je temelj moderne web kriptografije.",
        "U standardnom HTTPS zahtjevu sve prije simbola # šalje se izravno poslužitelju. Sve poslije ostaje u sandboxu preglednika. Dobro dizajniran sustav jednokratnih poveznica može pohraniti šifrirani sadržaj pod /note/abc123, dok ključ za dešifriranje pod #xK9m2p... ostaje nevidljiv poslužiteljskim zapisnicima, CDN putanjama i vanjskim tablicama baze podataka.",
      ],
    },
    {
      title: "Kada koristiti jednokratnu poveznicu (a kada ne)",
      paragraphs: [
        "Nije svaki kanal pogrešan za svaku vrstu tajne — ali većina svakodnevnih alata građena je za trajnost, ne za jednokratnu predaju.",
      ],
      table: [
        {
          channel: "E-pošta",
          encrypted: "Često u prijenosu",
          persistent: "Da — trajno, u više pretinaca",
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
          encrypted: "Vrlo različito",
          persistent: "Često sigurnosna kopija, sinkronizacija u oblaku",
          verdict: "✗ Loše",
        },
        {
          channel: "Upravitelj lozinki",
          encrypted: "Da",
          persistent: "Dizajniran za trajno čuvanje",
          verdict: "Često nezgrapno — često plaćeno, sporo za brzu predaju",
        },
        {
          channel: "Jednokratna poveznica",
          encrypted: "Da, na strani klijenta",
          persistent: "Odmah izbrisano nakon čitanja",
          verdict: "✓ Namijenjeno tome",
        },
      ],
      goodFits: [
        "Lozinke, API ključevi i privremeni tokeni predani jednom jednoj osobi.",
        "Kodovi za oporavak sustava i sigurnosne kopije 2FA.",
        'Privremene upute za fizički pristup („koristite ovaj kod vrata do 18 h“).',
        "Pravni ili HR osjetljivi nacrti koji ne bi trebali postati institucionalno sjećanje.",
      ],
      poorFits: [
        "Dugoročno pohranjivanje: koristite namjenski trezor upravitelja lozinki.",
        "Trajni razgovori: koristite messenger s end-to-end šifriranjem poput Signala.",
        "Tajne za reviziju: ako usklađenost zahtijeva nepromjenjiv trag, koristite odobreni sustav pohrane organizacije.",
      ],
    },
    {
      title: "Zamka pregleda poveznice",
      paragraphs: [
        "Ovo je način kvara koji mnogi timovi otkriju na teži način. Mnoge poslovne chat aplikacije automatski pregledavaju dolazne URL-ove kako bi generirale bogate preglede (naslove, opise, sličice).",
        "Taj automatski crawl može potrošiti jednokratnu poveznicu prije nego što primatelj uopće stigne kliknuti. Bot za pregled postaje prvi čitatelj, bilješka se briše ili uništava, a kolega otvara mrtvu poveznicu.",
        "Ozbiljni alati za kratkotrajnost to aktivno ublažavaju: blokiranje poznatih crawler user-agenta, zahtijevanje eksplicitnog klika prije lokalnog dešifriranja i vrlo kratka vremena isteka.",
      ],
    },
  ],
  tableHeaders: {
    channel: "Vrsta kanala",
    encrypted: "Šifrirano?",
    persistent: "Trajno?",
    verdict: "Dobro za jednokratne tajne?",
  },
  goodFitsLabel: "Dobri slučajevi upotrebe",
  poorFitsLabel: "Loši slučajevi upotrebe",
  closingTitle: "Gdje PrivateNote stoji",
  closingBody:
    "PrivateNote je izgrađen upravo oko ovog modela šifriranja na strani klijenta. Nije dugoročni trezor lozinki, timski wiki niti trajna arhiva za usklađenost. To je lagan, brz alat za predaju.",
  encryptLu:
    "Za veće datoteke koje trebaju isti model šifriranja na strani klijenta, [Encrypt.lu](https://encrypt.lu) primjenjuje isti arhitektonski pristup u razmjeru datoteka.",
  tagline:
    "Osigurava da vijek trajanja osjetljivih podataka odgovara vijeku trajanja medija kroz koji putuju. Jer ponekad je najsigurnija poruka ona koja potpuno prestaje postojati.",
  relatedReading: "Dodatno čitanje",
};
