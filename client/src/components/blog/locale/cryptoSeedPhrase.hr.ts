import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseHr: CryptoSeedArticleCopy = {
  heroAlt:
    "Koncept šifriranog dijeljenja datoteka: lokalno šifriranje prije uploada tajni",
  intro: [
    "Seed fraza za kriptovalute jedna je od najvrijednijih tajni koje ćete ikad posjedovati. Obično se ne može resetirati. Nema „zaboravljene lozinke“. Tko je ima, tipično kontrolira novčanik i sve u njemu.",
    "To možda zvuči čudno na blogu tvrtke koja gradi šifrirane jednokratne poveznice. Sigurnost ne znači prodavati svaki alat za svaki zadatak—već prilagoditi pristup onome što štitite, uključujući i naša ograničenja.",
    "Za **zamjenjive tajne**—Wi-Fi lozinke, privremene vjerodajnice, MFA kodove za oporavak, mnoge API ključeve i povjerljive poslovne poruke—[šifrirana jednokratna poveznica](blog:one-time-secret-links) izvrsno je rješenje.",
    "**Dugotrajne glavne tajne** poput seed fraza za kriptovalute zaslužuju drugačiji pristup.",
  ],
  ruleTitle: "Pravilo br. 1",
  ruleParagraphs: [
    "**Nikad ne unosite seed frazu za kriptovalute na web stranicu—čak ni na PrivateNote.** Ako je prijenos neizbježan: prvo lokalno šifrirajte i dijelite **samo šifrirani tekst**. PrivateNote je namijenjen prijenosu unaprijed šifriranih podataka, ne tipkanju mnemonika.",
    "**Ozbiljni proizvođači hardverskih novčanika ne traže unos fraze za oporavak na web stranici.** Ako stranica traži vašu seed frazu, tretirajte to kao vrlo sumnjivo—provjerite autentičnost prije nastavka.",
    "Po mogućnosti izbjegavajte unos seed fraza na web stranicama.",
  ],
  offlineAlternatives: [
    { label: "Metalna sigurnosna kopija", body: "pohranjena u sefu ili bankovnom sefu" },
    { label: "SLIP-39", body: "ili slični postupci za nasljeđivanje ili oporavak od katastrofe" },
    { label: "Prijenos hardverskog novčanika", body: "kad je praktično, umjesto fraze za oporavak" },
  ],
  seedPhraseTraits: [
    { label: "Daje potpunu kontrolu", body: "nad imovinom" },
    { label: "Često traje desetljećima", body: "bez rotacije" },
    { label: "Ne može se promijeniti", body: "nakon kompromitacije" },
    { label: "Nema oporavka od pružatelja", body: "nakon krađe" },
  ],
  oneTimeLinkFit: [
    "API ključevi i privremene lozinke",
    "Wi-Fi vjerodajnice",
    "MFA kodovi za oporavak",
    "Poslovne poruke i pravni nacrti",
    "Privremeni pristupni tokeni",
  ],
  localEncryptFirst: [
    "Seed fraze za kriptovalute",
    "Sigurnosne kopije hardverskih novčanika",
    "CA privatni ključevi i ključevi za potpisivanje",
    "Materijal za oporavak upravitelja lozinki",
    "Visokovrijedne glavne tajne",
  ],
  philosophySteps: [
    "izbjegavajte prijenos kad je moguće",
    "lokalno šifrirajte",
    "uploadajte samo šifrirani tekst",
    "sigurno obrišite privremeni čisti tekst",
    "age passphrase za datoteku—ne mnemonik—po mogućnosti pošaljite zasebnim kanalom",
  ],
  sections: {
    sendAtAll: {
      title: "Trebate li je uopće slati?",
      question: "**mora li fraza napustiti svoje mjesto?** Često: ne.",
      outro:
        "Svaki prijenos povećava šansu otkrivanja. Ako možete izbjeći slanje, učinite to. Za druge kanale koji također trajno pohranjuju tajne, pogledajte [Zašto je e-pošta najgori prostor za tajne](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Zašto su seed fraze drugačije",
      p1: "Seed fraza je korijenska tajna za cijelu digitalnu imovinu—nije „samo još jedna lozinka“.",
      listIntro: "Za razliku od većine vjerodajnica:",
      outro:
        "Ne branite se samo od današnjih napadača—donosite odluke koje mogu važiti i za deset ili dvadeset godina.",
    },
    browserEncryption: {
      title: "Šifriranje u pregledniku je snažno—ali nije magija",
      paragraphs: [
        "PrivateNote šifrira u vašem pregledniku prije uploada. Naši poslužitelji vide samo šifrirani tekst; ključ nam nikad ne stiže. To je puno bolje od [e-pošte](blog:why-email-is-worst-for-secrets), chata ili cloud dokumenata za svakodnevne tajne—i odgovara strogom [end-to-end šifriranom](blog:what-is-end-to-end-encryption) modelu za sadržaj bilješke.",
        "Svaka kripto aplikacija u pregledniku dijeli ograničenje: **čisti tekst mora postojati u pregledniku prije šifriranja.** Zlonamjerni JavaScript—od proširenja, kompromitacije lanca opskrbe, injekcije ili lošeg CDN-a—teoretski bi ga mogao prvo pročitati. To je inherentno klijentskom šifriranju u pregledniku, ne specifično za PrivateNote.",
        "Za API ključeve i privremene lozinke taj kompromis je obično prihvatljiv. Za seed frazu koja štiti ušteđevinu možda želite vjerovati manje sustava.",
      ],
    },
    encryptLocal: {
      title: "Šifrirajte prije nego preglednik to vidi",
      intro: "Lokalno šifrirajte, zatim uploadajte samo šifrirani tekst:",
      outro: "PrivateNote nikad ne prima mnemonik—samo šifrirane podatke.",
      callout:
        "Lokalno šifriranje **ne zaustavlja zlonamjerni softver na vašem računalu**. **Drži čisti tekst podalje od web aplikacija, cloud usluga i poslužitelja** kojima ne treba. Smanjujete površinu povjerenja; ne eliminirate kompromitiranu krajnju točku.",
    },
    whichTool: {
      title: "Koji alat koristiti",
      age: "**age** (preporučeno za većinu korisnika): jednostavno šifriranje datoteka sa sigurnim zadanim postavkama — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: izvrsno ako već koristite OpenPGP.",
      openssl: "**OpenSSL**: pouzdan i moćan; niskorazinski CLI—bolji za iskusne korisnike.",
    },
    ageExample: {
      title: "Minimalni primjer (age)",
      passphraseTitle: "Trebate li jaku passphrase?",
      passphraseBefore:
        "Koristite dugo, jedinstveno tajno za `age -p`. Generirajte ga lokalno u pregledniku—",
      passphraseLink: "generator lozinki",
      passphraseAfter: "na passwords.lu radi na strani klijenta; ništa se ne uploada.",
      p1: "Nakon što je `seed.txt.age` provjeren, **sigurno obrišite čisti tekst na uređaju pošiljatelja**. Nakon što primatelj uveze u novčanik, **obrišite i njegovu kopiju čistog teksta**.",
      p2: "Za redovitu razmjenu s nekim, `age -r` (način s javnim ključem) izbjegava zajedničku passphrase—vrijedi naučiti zasebno.",
      docsLabel: "Dokumentacija:",
    },
    separateChannels: {
      title: "Koristite zasebne kanale",
      intro:
        "Odvojite šifriranu datoteku od tajne koja je otključava. Odvajate `.age` šifrirani tekst od **age passphrase za dešifriranje**—ne seed mnemonik drugim kanalom.",
      steps: [
        "Uploadajte **šifriranu datoteku** (šifrirani tekst) s PrivateNoteom",
        "Pošaljite **age passphrase** koja dešifrira tu datoteku—putem Signala, telefona ili osobno",
      ],
      outro: "Napadač mora kompromitirati više sustava—ne samo jednu poveznicu.",
    },
    recommend: {
      title: "Što preporučujemo",
      intro:
        "Razdvajanje se zapravo odnosi na **zamjenjive** naspram **dugotrajnih glavnih** tajni—ne samo na format datoteke ili kanal.",
      oneTimeTitle: "Dobro prikladno za jednokratne poveznice",
      oneTimeSubtitle: "Zamjenjive tajne koje možete rotirati ili opozvati",
      localTitle: "Prvo lokalno šifrirajte",
      localSubtitle: "Dugotrajne glavne tajne koje rijetko mijenjate",
      outro:
        "Za API ključeve posebno pogledajte naš vodič [Sigurno dijeljenje API ključeva](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Prilagodite alat riziku",
      body: "Svaki pristup ima pretpostavke povjerenja—upravitelji lozinki, hardverski novčanici, offline alati, kripto u pregledniku. Nijedan nije savršen; kompromisi se razlikuju. Pitanje je odgovaraju li **vrijednosti** onoga što štitite.",
    },
    philosophy: {
      title: "Naša filozofija",
      p1: "Izgradili smo PrivateNote tako da se šifriranje događa **prije** nego podaci stignu do naših poslužitelja. Za privremene, zamjenjive tajne to nadmašuje e-poštu, poruke ili cloud pohranu. Možete i [poslati tajnu poruku bez računa](blog:send-secret-message-without-account). Pročitajte [kako PrivateNote radi](app:how-it-works) za potpuni model.",
      listIntro: "Za seed frazu koja bi mogla biti vaša ušteđevina:",
      closingQuote:
        "Ponekad najbolji savjet nije „koristite naš proizvod“. Već: „Koristite pravi alat za zadatak.“",
    },
  },
  ctaTitle: "Dijelite zamjenjive tajne—ne seed fraze—u pregledniku",
  ctaBody:
    "Stvorite šifriranu jednokratnu bilješku za API ključeve, lozinke i vjerodajnice. Za seed fraze prvo lokalno šifrirajte s age, zatim dijelite samo šifrirani tekst.",
  ctaButton: "Isprobajte PrivateNote ->",
};
