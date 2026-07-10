import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseSr: CryptoSeedArticleCopy = {
  heroAlt:
    "Koncept šifrovanog deljenja fajlova: lokalno šifrovanje pre uploada tajni",
  intro: [
    "Seed fraza za kriptovalute jedna je od najvrednijih tajni koje ćete ikad posedovati. Obično se ne može resetovati. Nema „zaboravljene lozinke“. Ko je ima, tipično kontroliše novčanik i sve u njemu.",
    "To možda zvuči čudno na blogu kompanije koja gradi šifrovane jednokratne linkove. Bezbednost ne znači prodavati svaki alat za svaki zadatak—već prilagoditi pristup onome što štitite, uključujući i naša ograničenja.",
    "Za **zamenjive tajne**—Wi-Fi lozinke, privremene kredencijale, MFA kodove za oporavak, mnoge API ključeve i poverljive poslovne poruke—[šifrovani jednokratni link](blog:one-time-secret-links) je odlično rešenje.",
    "**Dugotrajne glavne tajne** poput seed fraza za kriptovalute zaslužuju drugačiji pristup.",
  ],
  ruleTitle: "Pravilo br. 1",
  ruleParagraphs: [
    "**Nikad ne unosite seed frazu za kriptovalute na veb sajt—čak ni na PrivateNote.** Ako je prenos neizbežan: prvo lokalno šifrujte i delite **samo šifrovani tekst**. PrivateNote je namenjen prenosu unapred šifrovanih podataka, ne kucanju mnemonika.",
    "**Ozbiljni proizvođači hardverskih novčanika ne traže unos fraze za oporavak na veb sajtu.** Ako sajt traži vašu seed frazu, tretirajte to kao vrlo sumnjivo—proverite autentičnost pre nastavka.",
    "Po mogućnosti izbegavajte unos seed fraza na veb sajtovima.",
  ],
  offlineAlternatives: [
    { label: "Metalna rezervna kopija", body: "čuvana u sefu ili bankovnom sefu" },
    { label: "SLIP-39", body: "ili slični postupci za nasleđivanje ili oporavak od katastrofe" },
    { label: "Prenos hardverskog novčanika", body: "kada je praktično, umesto fraze za oporavak" },
  ],
  seedPhraseTraits: [
    { label: "Daje potpunu kontrolu", body: "nad imovinom" },
    { label: "Često traje decenijama", body: "bez rotacije" },
    { label: "Ne može se promeniti", body: "nakon kompromitacije" },
    { label: "Nema oporavka od provajdera", body: "nakon krađe" },
  ],
  oneTimeLinkFit: [
    "API ključevi i privremene lozinke",
    "Wi-Fi kredencijali",
    "MFA kodovi za oporavak",
    "Poslovne poruke i pravni nacrti",
    "Privremeni pristupni tokeni",
  ],
  localEncryptFirst: [
    "Seed fraze za kriptovalute",
    "Rezervne kopije hardverskih novčanika",
    "CA privatni ključevi i ključevi za potpisivanje",
    "Materijal za oporavak menadžera lozinki",
    "Visokovredne glavne tajne",
  ],
  philosophySteps: [
    "izbegavajte prenos kada je moguće",
    "lokalno šifrujte",
    "uploadujte samo šifrovani tekst",
    "sigurno obrišite privremeni čist tekst",
    "age passphrase za fajl—ne mnemonik—po mogućnosti pošaljite zasebnim kanalom",
  ],
  sections: {
    sendAtAll: {
      title: "Da li je uopšte treba slati?",
      question: "**da li fraza mora napustiti svoje mesto?** Često: ne.",
      outro:
        "Svaki prenos povećava šansu otkrivanja. Ako možete izbeći slanje, učinite to. Za druge kanale koji takođe trajno čuvaju tajne, pogledajte [Zašto je e-pošta najgori prostor za tajne](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Zašto su seed fraze drugačije",
      p1: "Seed fraza je korenska tajna za celu digitalnu imovinu—nije „samo još jedna lozinka“.",
      listIntro: "Za razliku od većine kredencijala:",
      outro:
        "Ne branite se samo od današnjih napadača—donosite odluke koje mogu važiti i za deset ili dvadeset godina.",
    },
    browserEncryption: {
      title: "Šifrovanje u pretraživaču je snažno—ali nije magija",
      paragraphs: [
        "PrivateNote šifruje u vašem pretraživaču pre uploada. Naši serveri vide samo šifrovani tekst; ključ nam nikad ne stiže. To je mnogo bolje od [e-pošte](blog:why-email-is-worst-for-secrets), četa ili cloud dokumenata za svakodnevne tajne—i odgovara strogom [end-to-end šifrovanom](blog:what-is-end-to-end-encryption) modelu za sadržaj beleške.",
        "Svaka kripto aplikacija u pretraživaču deli ograničenje: **čist tekst mora postojati u pretraživaču pre šifrovanja.** Zlonamerni JavaScript—od proširenja, kompromitacije lanca snabdevanja, injekcije ili lošeg CDN-a—teoretski bi ga mogao prvo pročitati. To je inherentno klijentskom šifrovanju u pretraživaču, ne specifično za PrivateNote.",
        "Za API ključeve i privremene lozinke taj kompromis je obično prihvatljiv. Za seed frazu koja štiti ušteđevinu možda želite verovati manje sistema.",
      ],
    },
    encryptLocal: {
      title: "Šifrujte pre nego pretraživač to vidi",
      intro: "Lokalno šifrujte, zatim uploadujte samo šifrovani tekst:",
      outro: "PrivateNote nikad ne prima mnemonik—samo šifrovane podatke.",
      callout:
        "Lokalno šifrovanje **ne zaustavlja zlonamerni softver na vašem računaru**. **Drži čist tekst podalje od veb aplikacija, cloud usluga i servera** kojima ne treba. Smanjujete površinu poverenja; ne eliminišete kompromitovanu krajnju tačku.",
    },
    whichTool: {
      title: "Koji alat koristiti",
      age: "**age** (preporučeno za većinu korisnika): jednostavno šifrovanje fajlova sa sigurnim podrazumevanim postavkama — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: odlično ako već koristite OpenPGP.",
      openssl: "**OpenSSL**: pouzdan i moćan; niskorazinski CLI—bolji za iskusne korisnike.",
    },
    ageExample: {
      title: "Minimalni primer (age)",
      passphraseTitle: "Da li vam treba jaka passphrase?",
      passphraseBefore:
        "Koristite dugo, jedinstveno tajno za `age -p`. Generišite ga lokalno u pretraživaču—",
      passphraseLink: "generator lozinki",
      passphraseAfter: "na passwords.lu radi na strani klijenta; ništa se ne uploaduje.",
      p1: "Nakon što je `seed.txt.age` proveren, **sigurno obrišite čist tekst na uređaju pošiljaoca**. Nakon što primalac uveze u novčanik, **obrišite i njegovu kopiju čistog teksta**.",
      p2: "Za redovnu razmenu sa nekim, `age -r` (način sa javnim ključem) izbegava zajedničku passphrase—vredi naučiti zasebno.",
      docsLabel: "Dokumentacija:",
    },
    separateChannels: {
      title: "Koristite zasebne kanale",
      intro:
        "Odvojite šifrovani fajl od tajne koja ga otključava. Odvajate `.age` šifrovani tekst od **age passphrase za dešifrovanje**—ne seed mnemonik drugim kanalom.",
      steps: [
        "Uploadujte **šifrovani fajl** (šifrovani tekst) sa PrivateNoteom",
        "Pošaljite **age passphrase** koja dešifruje taj fajl—putem Signala, telefona ili lično",
      ],
      outro: "Napadač mora kompromitovati više sistema—ne samo jedan link.",
    },
    recommend: {
      title: "Šta preporučujemo",
      intro:
        "Razdvajanje se zapravo odnosi na **zamenjive** naspram **dugotrajnih glavnih** tajni—ne samo na format fajla ili kanal.",
      oneTimeTitle: "Dobro prikladno za jednokratne linkove",
      oneTimeSubtitle: "Zamenjive tajne koje možete rotirati ili opozvati",
      localTitle: "Prvo lokalno šifrujte",
      localSubtitle: "Dugotrajne glavne tajne koje retko menjate",
      outro:
        "Za API ključeve posebno pogledajte naš vodič [Sigurno deljenje API ključeva](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Prilagodite alat riziku",
      body: "Svaki pristup ima pretpostavke poverenja—menadžeri lozinki, hardverski novčanici, offline alati, kripto u pretraživaču. Nijedan nije savršen; kompromisi se razlikuju. Pitanje je da li odgovaraju **vrednosti** onoga što štitite.",
    },
    philosophy: {
      title: "Naša filozofija",
      p1: "Izgradili smo PrivateNote tako da se šifrovanje dešava **pre** nego podaci stignu do naših servera. Za privremene, zamenjive tajne to nadmašuje e-poštu, poruke ili cloud skladištenje. Možete i [poslati tajnu poruku bez naloga](blog:send-secret-message-without-account). Pročitajte [kako PrivateNote radi](app:how-it-works) za potpuni model.",
      listIntro: "Za seed frazu koja bi mogla biti vaša ušteđevina:",
      closingQuote:
        "Ponekad najbolji savet nije „koristite naš proizvod“. Već: „Koristite pravi alat za zadatak.“",
    },
  },
  ctaTitle: "Delite zamenjive tajne—ne seed fraze—u pretraživaču",
  ctaBody:
    "Stvorite šifrovanu jednokratnu belešku za API ključeve, lozinke i kredencijale. Za seed fraze prvo lokalno šifrujte sa age, zatim delite samo šifrovani tekst.",
  ctaButton: "Isprobajte PrivateNote ->",
};
