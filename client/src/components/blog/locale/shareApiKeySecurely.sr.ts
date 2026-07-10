import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelySr: ShareApiKeyArticleCopy = {
  heroAlt: "Hotelski ključ na drvenoj tabli sa brojevima",
  heroCaptionPrefix: "Slika:",
  heroArtist: "Hans",
  heroCaptionMiddle: "sa",
  heroSource: "Pixabay",
  intro:
    "Svaki developer mora u nekom trenutku poslati API ključ nekome drugome—za staging pristup, izvođača, webhook integraciju ili predaju klijentu. Najbrži put obično je i onaj koji ostavlja najduži trag.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord ili druga istorija četa",
    "E-pošta, SMS ili prosleđeni nizovi poruka",
    "Jira, Trello, Notion, Confluence ili GitHub issuei",
    "Dokumenti u čistom tekstu, tabele i deljene cloud fascikle",
    "Git commitovi, pull requestovi i komentari u kodu",
  ],
  leakSources: [
    {
      title: "E-pošta",
      body: "E-pošta stvara dugotrajne kopije. Ključ može preživeti u sandučetima, arhivima, rezervnim kopijama, mobilnoj sinhronizaciji, prosleđenim nizovima i indeksima pretrage—dugo nakon što je zadatak gotov.",
    },
    {
      title: "Timski čet",
      body: "Slack i Teams čuvaju kontekst—što ih čini rizičnima za tajne. Nalepljeni ključ može biti pretraživ budućim članovima radnog prostora ili procuriti kroz kompromitovan uređaj.",
    },
    {
      title: "Alati za projekte",
      body: "Jira, Notion, Confluence, Trello i GitHub issuei nisu trezori za kredencijale. Obrisani tiketi mogu i dalje postojati u izvozima, rezervnim kopijama, audit tragovima i pretrazi uz pomoć AI-ja.",
    },
    {
      title: "Git repozitorijumi",
      body: "Git istorija ostaje. Uklanjanje ključa u kasnijem commitu ne briše ranije commitove. Javni repozitorijumi se stalno skeniraju, a izložene cloud kredencijale mogu biti zloupotrebljene u minutama.",
    },
  ],
  prepSteps: [
    {
      title: "Koristite najmanji mogući opseg",
      body: "Izbegavajte primarne produkcione ključeve. Preferirajte staging ključeve, dozvole samo za čitanje, IP ograničenja, kratkotrajne tokene i kredencijale specifične za integraciju.",
    },
    {
      title: "Planirajte rotaciju ili opoziv",
      body: "Tretirajte deljene API ključeve kao privremene. Opozovite ih nakon onboardinga, testiranja, angažmana izvođača ili predaje klijentu.",
    },
    {
      title: "Posmatrajte obrasce korišćenja",
      body: "Neočekivane lokacije, nagli skokovi zahteva, novi endpointi ili neobično naplaćivanje često su prvi znakovi da je ključ procurio.",
    },
    {
      title: "Isporučite putem šifrovanog jednokratnog linka",
      body: "Šifrujte ključ lokalno pre nego uđe u komunikacioni kanal. Pošaljite kratkotrajni link umesto da ostavite sirovu tajnu u trajnoj istoriji četa ili e-pošte.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Ograničite ključ", detail: "Samo minimalne dozvole" },
    { key: "encrypt", label: "Lokalno šifrujte", detail: "Ključ nikad ne napušta pretraživač" },
    { key: "send", label: "Pošaljite link", detail: "Ne sirovu tajnu" },
    { key: "revoke", label: "Opozovite nakon korišćenja", detail: "Rotirajte nakon predaje" },
  ],
  faqs: [
    {
      question: "Zašto ne samo varijabla okruženja?",
      answer:
        "Varijable okruženja dobro rade za lokalni softver. Ne rešavaju problem prenosa kada morate vrednost predati kolegi, izvođaču, klijentu ili partnerskoj integraciji.",
    },
    {
      question: "Da li API ključevi uvek treba da isteknu?",
      answer:
        "Ako provajder to podržava: da. Kratkotrajni kredencijali smanjuju prozor zloupotrebe nakon slučajnog otkrivanja i čine rotaciju normalnim tokom.",
    },
    {
      question: "Koji je najsigurniji radni tok?",
      answer:
        "Stvorite usko ograničen ključ, pošaljite ga putem jednokratnog linka šifrovanog u pretraživaču, podelite opcionalnu lozinku zasebnim kanalom i rotirajte ili opozovite ključ nakon završetka. Za visokorizične ili dugotrajne ključeve: prvo lokalno šifrujte sa age ili OpenSSL i uploadujte samo šifrovani tekst.",
    },
    {
      question: "Da li je PrivateNote menadžer tajni?",
      answer:
        "Ne. PrivateNote rešava sigurnu ljudsku predaju. Za skladištenje mašina-mašina koristite HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager ili Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Tretirajte API ključeve kao produkcione lozinke",
      paragraphs: [
        "API ključ je u suštini lozinka za softver. U zavisnosti od dozvola, procurio ključ može otkriti podatke korisnika, trošiti plaćene resurse, deployovati cloud infrastrukturu, slati e-poštu sa vaše verifikovane domene ili podići AI račun.",
        "Za razliku od ljudskih lozinki, API ključevi često ostaju važeći mesecima, leže u konfiguracionim fajlovima i u potpunosti zaobilaze višefaktorsku autentifikaciju. Ako ključ procuri, napadač može delovati kao vaša aplikacija—zlonamerni saobraćaj može se sakriti u normalnom produkcionom saobraćaju dok troškovi ne porastu ili podaci već nisu izloženi.",
      ],
    },
    neverPaste: {
      title: "Nikad ne lepite API ključeve u trajne sisteme",
      intro:
        "Ti kanali su praktični jer čuvaju istoriju. Upravo zato su pogrešno mesto za tajne.",
      avoidHeading: "Izbegavajte ove kanale",
    },
    whereLeak: {
      title: "Gde API ključevi stvarno cure",
      intro:
        "Većina curenja nisu sofisticirani kripto proboji. Dešavaju se kada neko kopira tajnu u sistem napravljen za evidenciju.",
    },
    beforeShare: {
      title: "Pre deljenja",
      intro:
        "Prvo smanjite radijus štete. Kako isporučite ključ je važno—ali usko ograničen ključ ograničava štetu ako ipak nešto pođe po zlu.",
      newKeyTitle: "Stvarate novi ključ?",
      newKeyBefore: "Generišite visokoentropijske kredencijale lokalno u pretraživaču—",
      newKeyLink: "generator API ključeva",
      newKeyAfter: "na passwords.lu radi na strani klijenta; ništa se ne uploaduje.",
    },
    highRisk: {
      title: "Visokorizični ključevi: prvo lokalno šifrujte",
      p1: "Većina API ključeva je zamenjiva: staging tokeni, kratkotrajne tajne integracija i usko ograničeni kredencijali koje želite rotirati. Za to obično dovoljno predaje šifrovane u pretraživaču.",
      p2: "Neki ključevi su teži—produkcioni admin pristup, ključevi za potpisivanje, root cloud kredencijali ili sve dugotrajno što je bolno ili nemoguće čisto opozvati. Tretirajte to kao glavne tajne: **lokalno šifrujte pre bilo kakvog uploada na veb**, zatim pošaljite šifrovani tekst putem PrivateNotea.",
      calloutHeading: "Prvo lokalno šifrujte",
      ageBullet:
        "**age** — najjednostavnije podrazumevane postavke za šifrovanje fajlova (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — pouzdan CLI ako poznajete zastavice",
      separateChannelBullet:
        "Uploadujte šifrovani fajl sa PrivateNoteom; passphrase za dešifrovanje pošaljite **zasebnim kanalom** (Signal, telefon, lično)",
      outro:
        "Isti radni tok važi za seed fraze kriptovaluta i druge nezamenjive glavne tajne. Pogledajte [Kripto seed fraze i jednokratni linkovi](blog:crypto-seed-phrase-one-time-link) za potpuni age/OpenSSL vodič, savete za passphrase i kada jednokratni linkovi odgovaraju—a kada ne.",
    },
    handoff: {
      title: "Sigurniji radni tok predaje",
      intro:
        "Kada čovek treba ključ—ne kada ga aplikacija dohvata u runtimeu—pratite ovaj sled.",
      diagramCaption: "Sigurna predaja na prvi pogled",
      diagramFootnote:
        "Podelite lozinku beleške zasebnim kanalom—nikad u istoj poruci kao link.",
    },
    privateNote: {
      title: "Kako PrivateNote odgovara predaji",
      p1: "PrivateNote je napravljen za trenutak čovek-čovek: API ključevi, SSH privatni ključevi, kredencijali baze podataka, kodovi za oporavak, webhook signing tajne i privremene lozinke koje treba doseći jednu osobu bez postajanja trajnim zapisom.",
      p2: "Tajna se šifruje u vašem pretraživaču pre uploada. PrivateNote čuva šifrovani tekst, ne čist tekst. Ključ za dešifrovanje leži u URL fragmentu—delu posle `#`—koji pretraživač pri učitavanju ne šalje serveru.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "Server prima ID beleške i šifrovani sadržaj.",
      bullet2: "Server ne prima ključ za dešifrovanje.",
      bullet3: "Brisanje nakon čitanja i istek ograničavaju koliko dugo šifrovana beleška postoji.",
      p3: "PrivateNote dopunjuje namenske trezore tajni—zatvara prazninu kada šaljete Stripe ključ partnerskoj integraciji, delite privremeni OpenAI ključ sa izvođačem ili dajete članu tima jednokratni staging pristup.",
    },
    faq: { title: "Često postavljana pitanja" },
    bottomLine: {
      title: "Zaključak",
      body: "Većina curenja API ključeva ne dešava se jer je kriptografija zakazala. Dešavaju se jer je neko iz praktičnosti kopirao tajnu u trajni, pretraživi sistem. Ograničite ključeve, delite samo kada treba i ne ostavljajte trag čistog teksta u četu, tiketima, e-pošti ili Gitu.",
    },
  },
  ctaTitle: "Podelite API ključ bez ostavljanja u četu",
  ctaBody:
    "Stvorite PrivateNote link šifrovan u pretraživaču sa brisanjem nakon čitanja. Za jednokratne beleške nije potreban nalog.",
  ctaButton: "Stvorite PrivateNote ->",
};
