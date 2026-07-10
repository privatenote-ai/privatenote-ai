import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyHr: ShareApiKeyArticleCopy = {
  heroAlt: "Hotelski ključ na drvenoj ploči s brojevima",
  heroCaptionPrefix: "Slika:",
  heroArtist: "Hans",
  heroCaptionMiddle: "s",
  heroSource: "Pixabay",
  intro:
    "Svaki developer mora u nekom trenutku poslati API ključ nekome drugome—za staging pristup, izvođača, webhook integraciju ili predaju klijentu. Najbrži put obično je i onaj koji ostavlja najduži trag.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord ili druga povijest chata",
    "E-pošta, SMS ili proslijeđeni nizovi poruka",
    "Jira, Trello, Notion, Confluence ili GitHub issuei",
    "Dokumenti u čistom tekstu, tablice i dijeljene cloud mape",
    "Git commitovi, pull requestovi i komentari u kodu",
  ],
  leakSources: [
    {
      title: "E-pošta",
      body: "E-pošta stvara dugotrajne kopije. Ključ može preživjeti u pretincima, arhivima, sigurnosnim kopijama, mobilnoj sinkronizaciji, proslijeđenim nizovima i indeksima pretraživanja—dugo nakon što je zadatak gotov.",
    },
    {
      title: "Timski chat",
      body: "Slack i Teams čuvaju kontekst—što ih čini rizičnima za tajne. Zalijepljeni ključ može biti pretraživ budućim članovima radnog prostora ili procureti kroz kompromitirani uređaj.",
    },
    {
      title: "Alati za projekte",
      body: "Jira, Notion, Confluence, Trello i GitHub issuei nisu trezori za vjerodajnice. Obrisani tiketi mogu i dalje postojati u izvozima, sigurnosnim kopijama, audit tragovima i pretraživanju uz pomoć AI-ja.",
    },
    {
      title: "Git repozitoriji",
      body: "Git povijest ostaje. Uklanjanje ključa u kasnijem commitu ne briše ranije commitove. Javni repozitoriji se stalno skeniraju, a izložene cloud vjerodajnice mogu biti zloupotrijebljene u minutama.",
    },
  ],
  prepSteps: [
    {
      title: "Koristite najmanji mogući opseg",
      body: "Izbjegavajte primarne produkcijske ključeve. Preferirajte staging ključeve, dozvole samo za čitanje, IP ograničenja, kratkotrajne tokene i vjerodajnice specifične za integraciju.",
    },
    {
      title: "Planirajte rotaciju ili opoziv",
      body: "Tretirajte dijeljene API ključeve kao privremene. Opozovite ih nakon onboardinga, testiranja, angažmana izvođača ili predaje klijentu.",
    },
    {
      title: "Promatrajte obrasce korištenja",
      body: "Neočekivane lokacije, nagli skokovi zahtjeva, novi endpointi ili neobično naplaćivanje često su prvi znakovi da je ključ procureo.",
    },
    {
      title: "Isporučite putem šifrirane jednokratne poveznice",
      body: "Šifrirajte ključ lokalno prije nego uđe u komunikacijski kanal. Pošaljite kratkotrajnu poveznicu umjesto da ostavite sirovu tajnu u trajnoj povijesti chata ili e-pošte.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Ograničite ključ", detail: "Samo minimalne dozvole" },
    { key: "encrypt", label: "Lokalno šifrirajte", detail: "Ključ nikad ne napušta preglednik" },
    { key: "send", label: "Pošaljite poveznicu", detail: "Ne sirovu tajnu" },
    { key: "revoke", label: "Opozovite nakon korištenja", detail: "Rotirajte nakon predaje" },
  ],
  faqs: [
    {
      question: "Zašto ne samo varijabla okruženja?",
      answer:
        "Varijable okruženja dobro rade za lokalni softver. Ne rješavaju problem prijenosa kad morate vrijednost predati kolegi, izvođaču, klijentu ili partnerskoj integraciji.",
    },
    {
      question: "Trebaju li API ključevi uvijek istjecati?",
      answer:
        "Ako pružatelj to podržava: da. Kratkotrajne vjerodajnice smanjuju prozor zlouporabe nakon slučajnog otkrivanja i čine rotaciju normalnim tijekom.",
    },
    {
      question: "Koji je najsigurniji radni tijek?",
      answer:
        "Stvorite usko ograničen ključ, pošaljite ga putem jednokratne poveznice šifrirane u pregledniku, podijelite opcionalnu lozinku zasebnim kanalom i rotirajte ili opozovite ključ nakon završetka. Za visokorizične ili dugotrajne ključeve: prvo lokalno šifrirajte s age ili OpenSSL i uploadajte samo šifrirani tekst.",
    },
    {
      question: "Je li PrivateNote upravitelj tajni?",
      answer:
        "Ne. PrivateNote rješava sigurnu ljudsku predaju. Za pohranu stroj-stroj koristite HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager ili Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Tretirajte API ključeve kao produkcijske lozinke",
      paragraphs: [
        "API ključ je u biti lozinka za softver. Ovisno o dozvolama, procureni ključ može otkriti podatke korisnika, trošiti plaćene resurse, deployati cloud infrastrukturu, slati e-poštu s vaše verificirane domene ili podići AI račun.",
        "Za razliku od ljudskih lozinki, API ključevi često ostaju valjani mjesecima, leže u konfiguracijskim datotekama i u potpunosti zaobilaze višefaktorsku autentifikaciju. Ako ključ procure, napadač može djelovati kao vaša aplikacija—zlonamjerni promet može se sakriti u normalnom produkcijskom prometu dok troškovi ne porastu ili podaci već nisu izloženi.",
      ],
    },
    neverPaste: {
      title: "Nikad ne lijepljajte API ključeve u trajne sustave",
      intro:
        "Ti kanali su praktični jer čuvaju povijest. Upravo zato su pogrešno mjesto za tajne.",
      avoidHeading: "Izbjegavajte ove kanale",
    },
    whereLeak: {
      title: "Gdje API ključevi stvarno cure",
      intro:
        "Većina curenja nisu sofisticirani kripto proboji. Dogode se kad netko kopira tajnu u sustav izgrađen za evidenciju.",
    },
    beforeShare: {
      title: "Prije dijeljenja",
      intro:
        "Prvo smanjite radijus štete. Kako isporučite ključ je važno—ali usko ograničen ključ ograničava štetu ako ipak nešto pođe po zlu.",
      newKeyTitle: "Stvarate novi ključ?",
      newKeyBefore: "Generirajte visokoentropijske vjerodajnice lokalno u pregledniku—",
      newKeyLink: "generator API ključeva",
      newKeyAfter: "na passwords.lu radi na strani klijenta; ništa se ne uploada.",
    },
    highRisk: {
      title: "Visokorizični ključevi: prvo lokalno šifrirajte",
      p1: "Većina API ključeva je zamjenjiva: staging tokeni, kratkotrajne tajne integracija i usko ograničene vjerodajnice koje želite rotirati. Za to obično dovoljno predaje šifrirane u pregledniku.",
      p2: "Neki ključevi su teži—produkcijski admin pristup, ključevi za potpisivanje, root cloud vjerodajnice ili sve dugotrajno što je bolno ili nemoguće čisto opozvati. Tretirajte to kao glavne tajne: **lokalno šifrirajte prije bilo kakvog uploada na web**, zatim pošaljite šifrirani tekst putem PrivateNotea.",
      calloutHeading: "Prvo lokalno šifrirajte",
      ageBullet:
        "**age** — najjednostavnije zadane postavke za šifriranje datoteka (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — pouzdan CLI ako poznajete zastavice",
      separateChannelBullet:
        "Uploadajte šifriranu datoteku s PrivateNoteom; passphrase za dešifriranje pošaljite **zasebnim kanalom** (Signal, telefon, osobno)",
      outro:
        "Isti radni tijek vrijedi za seed fraze kriptovaluta i druge nezamjenjive glavne tajne. Pogledajte [Kripto seed fraze i jednokratne poveznice](blog:crypto-seed-phrase-one-time-link) za potpuni age/OpenSSL vodič, savjete za passphrase i kad jednokratne poveznice odgovaraju—a kad ne.",
    },
    handoff: {
      title: "Sigurniji radni tijek predaje",
      intro:
        "Kad čovjek treba ključ—ne kad ga aplikacija dohvaća u runtimeu—slijedite ovaj slijed.",
      diagramCaption: "Sigurna predaja na prvi pogled",
      diagramFootnote:
        "Podijelite lozinku bilješke zasebnim kanalom—nikad u istoj poruci kao poveznica.",
    },
    privateNote: {
      title: "Kako PrivateNote odgovara predaji",
      p1: "PrivateNote je izgrađen za trenutak čovjek-čovjek: API ključevi, SSH privatni ključevi, vjerodajnice baze podataka, kodovi za oporavak, webhook signing tajne i privremene lozinke koje treba doseći jednu osobu bez postajanja trajnim zapisom.",
      p2: "Tajna se šifrira u vašem pregledniku prije uploada. PrivateNote pohranjuje šifrirani tekst, ne čisti tekst. Ključ za dešifriranje leži u URL fragmentu—dijelu nakon `#`—koji preglednik pri učitavanju ne šalje poslužitelju.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "Poslužitelj prima ID bilješke i šifrirani sadržaj.",
      bullet2: "Poslužitelj ne prima ključ za dešifriranje.",
      bullet3: "Brisanje nakon čitanja i istek ograničavaju koliko dugo šifrirana bilješka postoji.",
      p3: "PrivateNote nadopunjuje namjenske trezore tajni—zatvara prazninu kad šaljete Stripe ključ partnerskoj integraciji, dijelite privremeni OpenAI ključ s izvođačem ili dajete članu tima jednokratni staging pristup.",
    },
    faq: { title: "Često postavljana pitanja" },
    bottomLine: {
      title: "Zaključak",
      body: "Većina curenja API ključeva ne događa se jer je kriptografija zakazala. Dogode se jer je netko iz praktičnosti kopirao tajnu u trajni, pretraživi sustav. Ograničite ključeve, dijelite samo kad treba i ne ostavljajte trag čistog teksta u chatu, tiketima, e-pošti ili Gitu.",
    },
  },
  ctaTitle: "Podijelite API ključ bez ostavljanja u chatu",
  ctaBody:
    "Stvorite PrivateNote poveznicu šifriranu u pregledniku s brisanjem nakon čitanja. Za jednokratne bilješke nije potreban račun.",
  ctaButton: "Stvorite PrivateNote ->",
};
