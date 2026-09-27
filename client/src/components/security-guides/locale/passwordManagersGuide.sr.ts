import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideSr: PasswordManagersGuideCopy = {
  metaTitle: "Vodič za menadžere lozinki",
  metaDescription:
    "Bezbedno kreirajte, čuvajte i delite lozinke. Uporedite KeePass, Bitwarden, Apple i Google — plus Passwords.lu i PrivateNote za jednokratno deljenje.",
  heroLabel: "Bezbednosni vodič",
  heroTitle: "Vodič za menadžere lozinki",
  heroTagline: "Kreirajte, čuvajte i delite lozinke bezbedno",
  heroSubtitle:
    "Lozinke štite gotovo svaki aspekt digitalnog života — a ponovna upotreba i slabi obrasci i dalje su jedna od najslabijih karika u sajber bezbednosti. Menadžer lozinki to rešava.",
  introLead:
    "Problem nisu same lozinke. Problem je način na koji ih ljudi koriste. Mnogi i dalje koriste istu lozinku na desetinama sajtova ili prave samo male varijacije:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Ako jedan sajt pretrpi curenje podataka, napadači testiraju te akreditive svuda — tehnika poznata kao credential stuffing, odgovorna za milione kompromitovanih naloga svake godine. Menadžer lozinki generiše drugačiju lozinku za svaki nalog. Potrebno je da zapamtite samo jednu jaku glavnu lozinku.",
  essentialTitle: "Zašto su menadžeri lozinki neophodni",
  essentialIntro: "Dobar menadžer lozinki dramatično poboljšava i bezbednost i svakodnevno online iskustvo.",
  essentialBenefits: [
    "Trenutno generišite duge, nasumične lozinke",
    "Čuvajte svaku lozinku u šifrovanom trezoru",
    "Automatski popunjavajte forme za prijavu",
    "Otkrivajte ponovo korišćene ili slabe lozinke",
    "Primajte upozorenja kada se akreditivi pojave u poznatim curenjima",
    "Sinhronizujte lozinke na svim uređajima",
    "Čuvajte passkeys pored lozinki",
    "Bezbedno delite akreditive kada je potrebno",
  ],
  howItWorksTitle: "Kako menadžeri lozinki rade",
  howItWorksBody1:
    "Vaši akreditivi žive u šifrovanom trezoru. Kada kreirate trezor, birate glavnu lozinku koja izvodi ključeve šifrovanja koji štite sve unutra.",
  cryptoLabel: "Moderna kriptografija obično uključuje:",
  cryptoPoints: [
    "AES-256 šifrovanje",
    "Argon2id ili PBKDF2 za izvođenje ključeva",
    "Autentifikovano šifrovanje za otkrivanje neovlašćenih izmena",
  ],
  howItWorksBody2:
    "Pošto je trezor šifrovan pre čuvanja ili sinhronizacije, renomirani provajderi generalno ne mogu da čitaju vaše lozinke.",
  unlockedLabel: "Kada je otključan, menadžer može:",
  vaultFeatures: [
    "Automatski popunjavati korisnička imena i lozinke",
    "Generisati bezbedne lozinke",
    "Čuvati novo kreirane akreditive",
    "Sinhronizovati promene na svim uređajima",
    "Čuvati bezbedne beleške i passkeys",
  ],
  benefitsTitle: "Prednosti korišćenja menadžera lozinki",
  benefitBlocks: [
    {
      title: "Svaki nalog dobija jedinstvenu lozinku",
      body: "Ako vam ukradu Netflix lozinku, ne bi trebalo da otključa i e-poštu, bankarstvo, GitHub nalog ili cloud skladište. Menadžeri lozinki čine jedinstvene lozinke bez napora.",
    },
    {
      title: "Generisanje jakih lozinki",
      body: "Ljudi su loši u izmišljanju nasumičnih lozinki. Menadžeri generišu niske visoke entropije poput uQ8!kL#7P2@wXf9$rZm4 — izuzetno teške za pogoditi ili brute-force napad.",
    },
    {
      title: "Automatska prijava",
      body: "Menadžeri lozinki prepoznaju veb-sajtove i automatski popunjavaju akreditive. Renomirani menadžeri obično popunjavaju samo na ispravnom domenu, što takođe pomaže protiv phishinga.",
    },
    {
      title: "Izveštaji o zdravlju lozinki",
      body: "Mnogi menadžeri označavaju ponovo korišćene lozinke, slabe lozinke, kompromitovane akreditive, nedostajući MFA i sajtove koji podržavaju passkeys — pomažući vam da poboljšate bezbednost tokom vremena.",
    },
    {
      title: "Bezbedna sinhronizacija",
      body: "Moderni menadžeri sinhronizuju šifrovani trezor na desktopu, laptopu, telefonu i tabletu tako da lozinke budu dostupne gde god vam zatrebaju.",
    },
  ],
  passwordsLuPartnerLabel: "Partnerski alat",
  passwordsLuTitle: "Generisanje u pregledaču sa Passwords.lu",
  passwordsLuBody:
    "Ponekad vam treba samo jaka lozinka — ne kompletan trezor workflow. Passwords.lu pokreće generisanje direktno u pregledaču. Lozinke se ne otpremaju na servere; nalog nije potreban.",
  passwordsLuWorkflow:
    "Preporučeni workflow: generišite na Passwords.lu, zatim odmah sačuvajte u menadžeru lozinki.",
  passwordsLuCta: "Otvori generator lozinki",
  passwordsLuTools: [
    "Generator jakih lozinki",
    "Generator passphrase-a",
    "Generator bezbednog PIN-a",
    "Provera jačine lozinke",
    "Generator korisničkih imena",
    "Generatori hash-ova (Argon2id, bcrypt, scrypt i više)",
    "Edukativni bezbednosni alati",
  ],
  recommendedTitle: "Preporučeni menadžeri lozinki",
  recommendedIntro:
    "Razmišljajte u tri sloja: platformski alati za stabilnost, lokalni open-source trezori za kontrolu i cloud menadžeri kada vam treba moćna sinhronizacija — prihvatajući dodatni serverski rizik koji to donosi.",
  tiers: {
    platform: {
      title: "Platformski menadžeri",
      subtitle: "Snažna inženjerija, stabilni proizvodi — najbolji podrazumevani izbor za većinu",
      intro:
        "Apple i Google isporučuju menadžere lozinki sa operativnim sistemom. Podržani su od strane velikih bezbednosnih timova, dobijaju stalna ažuriranja i integrišu passkeys, autofill i upozorenja o curenjima sa minimalnim podešavanjem. Ako živite u jednom ekosistemu, to je često najglatkiji i najpouzdaniji izbor.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Doteran UX sa autofill-om na nivou OS-a i podrškom za passkeys",
        "Održavaju inženjeri bezbednosti platforme u velikom obimu",
        "Bez posebne pretplate za osnovne funkcije",
        "Stabilna sinhronizacija preko iCloud-a ili Google naloga",
      ],
      cons: [
        "Vezani za Apple ili Google nalog i izbore platforme",
        "Manje fleksibilni ako slobodno mešate Windows, Linux i mobilne uređaje",
        "Model poverenja zavisi od bezbednosti vašeg cloud naloga",
      ],
      managers: {
        apple: {
          verdict: "Najbolje za iPhone, iPad, Mac i Vision Pro",
          description:
            "Ugrađen u Apple platforme sa bezbednim skladištenjem, generisanjem, bezbednosnim upozorenjima, passkeys i iCloud Keychain sinhronizacijom — bez dodatne aplikacije u potpuno Apple domaćinstvu.",
          highlights: [
            "Duboka OS integracija i podrška za passkeys",
            "Bezbednosna upozorenja za poznata curenja",
            "Odličan UX unutar Apple ekosistema",
          ],
          learnMore: "Saznajte više",
        },
        google: {
          verdict: "Najbolje za Android i Chrome",
          description:
            "Ugrađen u Android i Chrome sa generisanjem, autofill-om, Password Checkup, upozorenjima o curenjima, passkeys i sinhronizacijom preko Google naloga.",
          highlights: [
            "Pogodan podrazumevani izbor na Android uređajima",
            "Password Checkup i upozorenja o curenjima",
            "Radi gde god koristite Chrome",
          ],
          learnMore: "Saznajte više",
        },
      },
    },
    local: {
      title: "Lokalni open-source trezori",
      subtitle: "Maksimalna kontrola — vi posedujete šifrovanu datoteku",
      intro:
        "KeePass čuva trezor kao lokalnu šifrovanu bazu. Nije potreban cloud nalog provajdera: vi odlučujete gde datoteka živi i kako se sinhronizuje. Kompromis je UX — interfejsi mogu delovati zastarelo u poređenju sa platformskim ili cloud menadžerima, a sinhronizacija na više uređaja je DIY osim ako dodate sopstveni sloj skladištenja.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Open source i proverljiv",
        "Bez obaveznog cloud naloga ili pretplate",
        "Offline-first; datoteka trezora ostaje pod vašom kontrolom",
        "Veliki ekosistem dodataka (KeePassXC, mobilni portovi, itd.)",
      ],
      cons: [
        "UI i onboarding manje doterani od platformskih alata",
        "Sinhronizacija na više uređaja ručna osim ako je konfigurisana",
        "Više posla podešavanja za porodice ili domaćinstva sa mešovitim uređajima",
      ],
      managers: {
        keepass: {
          verdict: "Najbolje za puriste privatnosti i self-hostere",
          description:
            "Originalni open-source model: jedna šifrovana .kdbx datoteka koju možete čuvati na disku, USB-u, NAS-u ili sinhronizovati preko sopstvenog cloud-a. KeePassXC je popularan cross-platform fork sa modernijim interfejsom.",
          highlights: [
            "Potpuno besplatno — bez vendor lock-in-a",
            "Vi birate strategiju skladištenja i sinhronizacije",
            "Idealno kada je cloud opcionalan, ne podrazumevan",
          ],
          learnMore: "Saznajte više",
        },
      },
    },
    cloud: {
      title: "Cloud menadžeri lozinki",
      subtitle: "Moćna sinhronizacija i deljenje — najveći serverski rizik",
      intro:
        "Posvećeni cloud menadžeri poput Bitwarden-a se ističu u cross-platform sinhronizaciji, porodičnom deljenju i timskim funkcijama. Ta pogodnost donosi drugačiji model pretnje: vaš šifrovani trezor (i ponekad metapodaci) živi na tuđim serverima. Curenje ili pogrešna konfiguracija kod provajdera je glavni preostali rizik — zato su revizije, open source i jaka glavna lozinka ovde važniji nego bilo gde drugde.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Najbolja cross-device sinhronizacija odmah po instalaciji",
        "Funkcije porodičnog i organizacionog deljenja",
        "Radi dosledno na Windows, macOS, Linux i mobilnim uređajima",
        "Open-source opcije (Bitwarden) sa javnim bezbednosnim revizijama",
      ],
      cons: [
        "Najveća površina napada ako je provajder kompromitovan",
        "Šifrovane rezervne kopije trezora mogu se offline dekriptovati sa slabim glavnim lozinkama",
        "Morate verovati kripto implementaciji i operacijama provajdera",
      ],
      managers: {
        bitwarden: {
          verdict: "Najbolja cloud opcija za cross-platform korisnike",
          description:
            "Open-source softver, end-to-end šifrovana sinhronizacija, podrška za passkeys, nezavisne revizije i jak besplatni plan — podrazumevana preporuka kada vam treba cloud sync van Apple ili Google ekosistema.",
          highlights: [
            "Revidirani open-source klijenti",
            "Odličan besplatni plan i porodični nivoi",
            "Dosledno iskustvo na svim glavnim platformama",
          ],
          learnMore: "Saznajte više",
        },
        lastpass: {
          verdict: "Legacy opcija — za nove korisnike birajte Bitwarden",
          description:
            "Pomogao je popularizaciji cloud menadžera lozinki, ali incidenti visokog profila sa ukradenim šifrovanim rezervnim kopijama trezora gurnuli su mnoge bezbednosne profesionalce ka Bitwarden-u ili lokalnom KeePass-u za nove implementacije.",
          highlights: [
            "Upotrebljiv sa jakom glavnom lozinkom + MFA ako ste već uložili",
            "Razmotrite migraciju ako počinjete ispočetka",
          ],
          learnMore: "Saznajte više",
          caution: "Oprez",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Vaš prioritet",
    recommendation: "Preporuka",
  },
  comparisonRows: [
    { priority: "Život u Apple ekosistemu", pick: "Apple Passwords" },
    { priority: "Android i Chrome svakodnevno", pick: "Google Password Manager" },
    { priority: "Maksimalna privatnost i kontrola datoteka", pick: "KeePass (lokalni trezor)" },
    { priority: "Cross-platform cloud sinhronizacija", pick: "Bitwarden" },
    { priority: "Postojeći LastPass korisnik", pick: "Nastavite ako je ojačan; procenite Bitwarden ili KeePass" },
  ],
  sharingTitle: "Bezbedno deljenje lozinki",
  sharingBody:
    "Čak i jake lozinke ponekad moraju biti podeljene — sa kolegama, porodicom, IT administratorima, izvođačima ili klijentima. Previše ljudi ih i dalje šalje preko platformi za poruke dizajniranih za chat, a ne za tajnu isporuku.",
  unsafeChannels: ["E-pošta", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Koristite PrivateNote umesto toga",
  privateNoteSharingBody:
    "PrivateNote šifruje tajne u pregledaču pre otpremanja. Server čuva samo šifrovani tekst; ključ za dešifrovanje putuje odvojeno u linku. Beleške mogu da se samounište nakon jednog čitanja ili isteknu po rasporedu.",
  privateNoteSharingItems: [
    "Lozinke",
    "API ključevi",
    "Wi‑Fi akreditivi",
    "Kodovi za oporavak",
    "Privremene prijave",
  ],
  privateNoteSharingCta: "Kreirajte bezbednu jednokratnu belešku",
  passwordProtectedTitle: "Dodatna zaštita sa beleškama zaštićenim lozinkom",
  passwordProtectedBody1:
    "Dodajte opcionu lozinku PrivateNote belešci. Primalac treba i link i odvojenu lozinku — idealno isporučene različitim kanalima (link putem e-pošte, lozinka telefonom ili lično).",
  passwordProtectedBody2:
    "Čak i ako neko presretne link, ne može otkriti tajnu bez lozinke.",
  bestPracticesTitle: "Najbolje prakse",
  bestPractices: [
    "Koristite dugu, jedinstvenu glavnu lozinku",
    "Omogućite višefaktorsku autentifikaciju na menadžeru lozinki",
    "Nikada ne koristite istu lozinku na različitim sajtovima",
    "Generišite lozinke menadžerom lozinki ili Passwords.lu",
    "Sačuvajte svaku lozinku u šifrovanom trezoru",
    "Omogućite passkeys kad god su dostupni",
    "Redovno pregledajte izveštaje o zdravlju lozinki",
    "Delite lozinke preko PrivateNote umesto e-pošte ili chata",
    "Za veoma osetljive akreditive koristite opcionalnu zaštitu lozinkom PrivateNote-a i isporučite lozinku odvojeno",
  ],
  faqTitle: "Često postavljana pitanja",
  faq: [
    {
      q: "Da li su menadžeri lozinki bezbedni?",
      a: "Da. Renomirani menadžeri lozinki koriste jaku, industrijski standardnu šifrovanje. Za gotovo sve, korišćenje menadžera lozinki je značajno bezbednije od pamćenja lozinki ili ponovne upotrebe iste lozinke na više sajtova.",
    },
    {
      q: "Može li provajder menadžera lozinki da čita moje lozinke?",
      a: "Za moderne menadžere poput KeePass, Bitwarden, Apple Passwords i Google Password Manager, trezor se šifruje pre čuvanja. Uz jaku glavnu lozinku, provajder generalno ne može da čita sačuvane akreditive.",
    },
    {
      q: "Šta se dešava ako zaboravim glavnu lozinku?",
      a: "Većina menadžera lozinki ne može da je povrati jer je nikada ne znaju. To je namerno. Neki servisi nude opcije oporavka ili hitan pristup ako su unapred konfigurisani.",
    },
    {
      q: "Da li da koristim skladištenje lozinki u pregledaču?",
      a: "Ugrađeni Apple i Google menadžeri su jaki, stabilni izbori u svojim ekosistemima — podržani od velikih bezbednosnih timova. KeePass odgovara za maksimalnu kontrolu. Bitwarden kada vam treba cloud sync na mešovitim platformama, prihvatajući veći serverski rizik.",
    },
  ],
  finalTitle: "Konačna preporuka",
  finalBody:
    "Nijedan menadžer nije savršen za sve — ali korišćenje jednog je među najefikasnijim koracima. Kombinujte ga sa Passwords.lu za brzo generisanje i PrivateNote kada treba da bezbedno delite tajne.",
  finalBullets: [
    { label: "Apple & Google", text: "stabilni platformski podrazumevani izbori" },
    { label: "KeePass", text: "lokalna kontrola, open source" },
    { label: "Bitwarden", text: "cloud sync kada vam treba svaki uređaj" },
    { label: "Passwords.lu", text: "brzo generisanje u pregledaču" },
  ],
  finalCtaPrivateNote: "Podelite tajnu sa PrivateNote",
  finalCtaPasswordsLu: "Posetite passwords.lu",
  exploreOther: "Istražite druge vodiče",
  allResources: "Svi resursi",
  affiliateDisclaimer:
    "Samo edukativni vodič. Možemo zaraditi proviziju preko affiliate linkova kada koristite preporučene usluge, što pomaže održavanju ovog besplatnog resursa o privatnosti.",
  otherGuides: [
    { id: "vpn", title: "Vodič za VPN usluge" },
    { id: "messenger", title: "Bezbedno slanje poruka" },
    { id: "email", title: "Bezbedna e-pošta" },
    { id: "browser", title: "Pregledači za privatnost" },
  ],
};
