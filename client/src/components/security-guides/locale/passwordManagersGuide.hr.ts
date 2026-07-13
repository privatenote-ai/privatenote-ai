import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideHr: PasswordManagersGuideCopy = {
  metaTitle: "Vodič za upravitelje lozinki",
  metaDescription:
    "Sigurno stvarajte, pohranjujte i dijelite lozinke. Usporedite KeePass, Bitwarden, Apple i Google — plus Passwords.lu i PrivateNote za jednokratno dijeljenje.",
  heroLabel: "Sigurnosni vodič",
  heroTitle: "Vodič za upravitelje lozinki",
  heroTagline: "Stvarajte, pohranjujte i dijelite lozinke sigurno",
  heroSubtitle:
    "Lozinke štite gotovo svaki aspekt digitalnog života — no ponovna upotreba i slabi obrasci i dalje su jedna od najslabijih karika u kibernetičkoj sigurnosti. Upravitelj lozinki to rješava.",
  introLead:
    "Problem nisu same lozinke. Problem je način na koji ih ljudi koriste. Mnogi i dalje koriste istu lozinku na desetinama stranica ili rade samo male varijacije:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Ako jedna stranica pretrpi curenje podataka, napadači testiraju te vjerodajnice posvuda — tehnika poznata kao credential stuffing, odgovorna za milijune kompromitiranih računa svake godine. Upravitelj lozinki generira drugačiju lozinku za svaki račun. Potrebno je zapamtiti samo jednu jaku glavnu lozinku.",
  essentialTitle: "Zašto su upravitelji lozinki neophodni",
  essentialIntro: "Dobar upravitelj lozinki dramatično poboljšava i sigurnost i svakodnevno online iskustvo.",
  essentialBenefits: [
    "Trenutačno generirajte duge, nasumične lozinke",
    "Pohranite svaku lozinku u šifriranom trezoru",
    "Automatski ispunjavajte obrasce za prijavu",
    "Otkrivajte ponovno korištene ili slabe lozinke",
    "Primajte upozorenja kada se vjerodajnice pojave u poznatim curenjima",
    "Sinkronizirajte lozinke na svim uređajima",
    "Pohranite passkeys uz lozinke",
    "Sigurno dijelite vjerodajnice kada je potrebno",
  ],
  howItWorksTitle: "Kako upravitelji lozinki rade",
  howItWorksBody1:
    "Vaše vjerodajnice žive u šifriranom trezoru. Kada kreirate trezor, birate glavnu lozinku koja izvodi ključeve šifriranja koji štite sve unutra.",
  cryptoLabel: "Moderna kriptografija obično uključuje:",
  cryptoPoints: [
    "AES-256 šifriranje",
    "Argon2id ili PBKDF2 za izvođenje ključeva",
    "Autentificirano šifriranje za otkrivanje neovlaštenih izmjena",
  ],
  howItWorksBody2:
    "Budući da je trezor šifriran prije pohrane ili sinkronizacije, renomirani pružatelji usluga općenito ne mogu čitati vaše lozinke.",
  unlockedLabel: "Kada je otključan, upravitelj može:",
  vaultFeatures: [
    "Automatski ispunjavati korisnička imena i lozinke",
    "Generirati sigurne lozinke",
    "Spremati novo kreirane vjerodajnice",
    "Sinkronizirati promjene na svim uređajima",
    "Pohraniti sigurne bilješke i passkeys",
  ],
  benefitsTitle: "Prednosti korištenja upravitelja lozinki",
  benefitBlocks: [
    {
      title: "Svaki račun dobiva jedinstvenu lozinku",
      body: "Ako vam ukradu Netflix lozinku, ne bi trebala otključati i e-poštu, bankarstvo, GitHub račun ili cloud pohranu. Upravitelji lozinki čine jedinstvene lozinke bez napora.",
    },
    {
      title: "Generiranje jakih lozinki",
      body: "Ljudi su loši u izmišljanju nasumičnih lozinki. Upravitelji generiraju niske visoke entropije poput uQ8!kL#7P2@wXf9$rZm4 — izuzetno teške za pogoditi ili brute-force napad.",
    },
    {
      title: "Automatska prijava",
      body: "Upravitelji lozinki prepoznaju web-stranice i automatski ispunjavaju vjerodajnice. Renomirani upravitelji obično ispunjavaju samo na ispravnoj domeni, što također pomaže protiv phishinga.",
    },
    {
      title: "Izvještaji o zdravlju lozinki",
      body: "Mnogi upravitelji označavaju ponovno korištene lozinke, slabe lozinke, kompromitirane vjerodajnice, nedostajući MFA i stranice koje podržavaju passkeys — pomažući vam poboljšati sigurnost tijekom vremena.",
    },
    {
      title: "Sigurna sinkronizacija",
      body: "Moderni upravitelji sinkroniziraju šifrirani trezor na desktopu, laptopu, telefonu i tabletu tako da lozinke budu dostupne gdje god vam zatrebaju.",
    },
  ],
  passwordsLuPartnerLabel: "Partnerski alat",
  passwordsLuTitle: "Generiranje u pregledniku s Passwords.lu",
  passwordsLuBody:
    "Ponekad vam treba samo jaka lozinka — ne kompletan trezor workflow. Passwords.lu pokreće generiranje izravno u pregledniku. Lozinke se ne učitavaju na poslužitelje; račun nije potreban.",
  passwordsLuWorkflow:
    "Preporučeni workflow: generirajte na Passwords.lu, zatim odmah spremite u upravitelj lozinki.",
  passwordsLuCta: "Otvori generator lozinki",
  passwordsLuTools: [
    "Generator jakih lozinki",
    "Generator passphrase-a",
    "Generator sigurnog PIN-a",
    "Provjera jačine lozinke",
    "Generator korisničkih imena",
    "Generatori hash-ova (Argon2id, bcrypt, scrypt i više)",
    "Edukativni sigurnosni alati",
  ],
  recommendedTitle: "Preporučeni upravitelji lozinki",
  recommendedIntro:
    "Razmišljajte u tri sloja: platformski alati za stabilnost, lokalni open-source trezori za kontrolu i cloud upravitelji kada vam treba moćna sinkronizacija — prihvaćajući dodatni serverski rizik koji to donosi.",
  tiers: {
    platform: {
      title: "Platformski upravitelji",
      subtitle: "Snažna inženjerija, stabilni proizvodi — najbolji zadani izbor za većinu",
      intro:
        "Apple i Google isporučuju upravitelje lozinki s operativnim sustavom. Podržani su od strane velikih sigurnosnih timova, dobivaju stalna ažuriranja i integriraju passkeys, autofill i upozorenja o curenjima uz minimalno podešavanje. Ako živite u jednom ekosustavu, to je često najglatkiji i najpouzdaniji izbor.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Dotjeran UX s autofill-om na razini OS-a i podrškom za passkeys",
        "Održavaju inženjeri sigurnosti platforme u velikom opsegu",
        "Bez posebne pretplate za osnovne funkcije",
        "Stabilna sinkronizacija preko iCloud-a ili Google računa",
      ],
      cons: [
        "Vezani za Apple ili Google račun i izbore platforme",
        "Manje fleksibilni ako slobodno miješate Windows, Linux i mobilne uređaje",
        "Model povjerenja ovisi o sigurnosti vašeg cloud računa",
      ],
      managers: {
        apple: {
          verdict: "Najbolje za iPhone, iPad, Mac i Vision Pro",
          description:
            "Ugrađen u Apple platforme sa sigurnom pohranom, generiranjem, sigurnosnim upozorenjima, passkeys i iCloud Keychain sinkronizacijom — bez dodatne aplikacije u potpuno Apple kućanstvu.",
          highlights: [
            "Duboka OS integracija i podrška za passkeys",
            "Sigurnosna upozorenja za poznata curenja",
            "Odličan UX unutar Apple ekosustava",
          ],
          learnMore: "Saznajte više",
        },
        google: {
          verdict: "Najbolje za Android i Chrome",
          description:
            "Ugrađen u Android i Chrome s generiranjem, autofill-om, Password Checkup, upozorenjima o curenjima, passkeys i sinkronizacijom preko Google računa.",
          highlights: [
            "Pogodan zadani izbor na Android uređajima",
            "Password Checkup i upozorenja o curenjima",
            "Radi gdje god koristite Chrome",
          ],
          learnMore: "Saznajte više",
        },
      },
    },
    local: {
      title: "Lokalni open-source trezori",
      subtitle: "Maksimalna kontrola — vi posjedujete šifriranu datoteku",
      intro:
        "KeePass pohranjuje trezor kao lokalnu šifriranu bazu. Nije potreban cloud račun pružatelja: vi odlučujete gdje datoteka živi i kako se sinkronizira. Kompromis je UX — sučelja mogu djelovati zastarjelo u usporedbi s platformskim ili cloud upraviteljima, a sinkronizacija na više uređaja je DIY osim ako dodate vlastiti sloj pohrane.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Open source i provjerljiv",
        "Bez obveznog cloud računa ili pretplate",
        "Offline-first; datoteka trezora ostaje pod vašom kontrolom",
        "Veliki ekosustav dodataka (KeePassXC, mobilni portovi, itd.)",
      ],
      cons: [
        "UI i onboarding manje dotjerani od platformskih alata",
        "Sinkronizacija na više uređaja ručna osim ako je konfigurirana",
        "Više posla podešavanja za obitelji ili kućanstva sa mješovitim uređajima",
      ],
      managers: {
        keepass: {
          verdict: "Najbolje za puriste privatnosti i self-hostere",
          description:
            "Izvorni open-source model: jedna šifrirana .kdbx datoteka koju možete pohraniti na disku, USB-u, NAS-u ili sinkronizirati preko vlastitog cloud-a. KeePassXC je popularan cross-platform fork sa modernijim sučeljem.",
          highlights: [
            "Potpuno besplatno — bez vendor lock-in-a",
            "Vi birate strategiju pohrane i sinkronizacije",
            "Idealno kada je cloud opcionalan, ne zadani",
          ],
          learnMore: "Saznajte više",
        },
      },
    },
    cloud: {
      title: "Cloud upravitelji lozinki",
      subtitle: "Moćna sinkronizacija i dijeljenje — najveći serverski rizik",
      intro:
        "Posvećeni cloud upravitelji poput Bitwarden-a ističu se u cross-platform sinkronizaciji, obiteljskom dijeljenju i timskim funkcijama. Ta pogodnost donosi drugačiji model prijetnje: vaš šifrirani trezor (i ponekad metapodaci) živi na tuđim poslužiteljima. Curenje ili pogrešna konfiguracija kod pružatelja je glavni preostali rizik — zato su revizije, open source i jaka glavna lozinka ovdje važniji nego bilo gdje drugdje.",
      strengthsLabel: "Prednosti",
      tradeoffsLabel: "Kompromisi",
      pros: [
        "Najbolja cross-device sinkronizacija odmah po instalaciji",
        "Funkcije obiteljskog i organizacijskog dijeljenja",
        "Radi dosljedno na Windows, macOS, Linux i mobilnim uređajima",
        "Open-source opcije (Bitwarden) s javnim sigurnosnim revizijama",
      ],
      cons: [
        "Najveća površina napada ako je pružatelj kompromitiran",
        "Šifrirane sigurnosne kopije trezora mogu se offline dekriptirati sa slabim glavnim lozinkama",
        "Morate vjerovati kripto implementaciji i operacijama pružatelja",
      ],
      managers: {
        bitwarden: {
          verdict: "Najbolja cloud opcija za cross-platform korisnike",
          description:
            "Open-source softver, end-to-end šifrirana sinkronizacija, podrška za passkeys, neovisne revizije i jak besplatni plan — zadana preporuka kada vam treba cloud sync izvan Apple ili Google ekosustava.",
          highlights: [
            "Revidirani open-source klijenti",
            "Odličan besplatni plan i obiteljski razini",
            "Dosljedno iskustvo na svim glavnim platformama",
          ],
          learnMore: "Saznajte više",
        },
        lastpass: {
          verdict: "Legacy opcija — za nove korisnike birajte Bitwarden",
          description:
            "Pomogao je popularizaciji cloud upravitelja lozinki, ali incidenti visokog profila s ukradenim šifriranim sigurnosnim kopijama trezora gurnuli su mnoge sigurnosne profesionalce prema Bitwarden-u ili lokalnom KeePass-u za nove implementacije.",
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
    { priority: "Život u Apple ekosustavu", pick: "Apple Passwords" },
    { priority: "Android i Chrome svakodnevno", pick: "Google Password Manager" },
    { priority: "Maksimalna privatnost i kontrola datoteka", pick: "KeePass (lokalni trezor)" },
    { priority: "Cross-platform cloud sinkronizacija", pick: "Bitwarden" },
    { priority: "Postojeći LastPass korisnik", pick: "Nastavite ako je ojačan; procijenite Bitwarden ili KeePass" },
  ],
  sharingTitle: "Sigurno dijeljenje lozinki",
  sharingBody:
    "Čak i jake lozinke ponekad moraju biti podijeljene — s kolegama, obitelji, IT administratorima, izvođačima ili klijentima. Previše ljudi ih i dalje šalje preko platformi za poruke dizajniranih za chat, a ne za tajnu isporuku.",
  unsafeChannels: ["E-pošta", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Koristite PrivateNote umjesto toga",
  privateNoteSharingBody:
    "PrivateNote šifrira tajne u pregledniku prije učitavanja. Poslužitelj pohranjuje samo šifrirani tekst; ključ za dešifriranje putuje odvojeno u poveznici. Bilješke mogu samouništiti nakon jednog čitanja ili isteći po rasporedu.",
  privateNoteSharingItems: [
    "Lozinke",
    "API ključevi",
    "Wi‑Fi vjerodajnice",
    "Kodovi za oporavak",
    "Privremene prijave",
  ],
  privateNoteSharingCta: "Kreirajte sigurnu jednokratnu bilješku",
  passwordProtectedTitle: "Dodatna zaštita s bilješkama zaštićenim lozinkom",
  passwordProtectedBody1:
    "Dodajte opcionalnu lozinku PrivateNote bilješci. Primatelj treba i poveznicu i odvojenu lozinku — idealno isporučene različitim kanalima (poveznica putem e-pošte, lozinka telefonom ili osobno).",
  passwordProtectedBody2:
    "Čak i ako netko presretne poveznicu, ne može otkriti tajnu bez lozinke.",
  bestPracticesTitle: "Najbolje prakse",
  bestPractices: [
    "Koristite dugu, jedinstvenu glavnu lozinku",
    "Omogućite višefaktorsku autentifikaciju na upravitelju lozinki",
    "Nikada ne koristite istu lozinku na različitim stranicama",
    "Generirajte lozinke upraviteljem lozinki ili Passwords.lu",
    "Spremite svaku lozinku u šifrirani trezor",
    "Omogućite passkeys kad god su dostupni",
    "Redovito pregledavajte izvještaje o zdravlju lozinki",
    "Dijelite lozinke preko PrivateNote umjesto e-pošte ili chata",
    "Za vrlo osjetljive vjerodajnice koristite opcionalnu zaštitu lozinkom PrivateNote-a i isporučite lozinku odvojeno",
  ],
  faqTitle: "Često postavljana pitanja",
  faq: [
    {
      q: "Jesu li upravitelji lozinki sigurni?",
      a: "Da. Renomirani upravitelji lozinki koriste jaku, industrijski standardnu šifriranje. Za gotovo sve, korištenje upravitelja lozinki je značajno sigurnije od pamćenja lozinki ili ponovne upotrebe iste lozinke na više stranica.",
    },
    {
      q: "Može li pružatelj upravitelja lozinki čitati moje lozinke?",
      a: "Za moderne upravitelje poput KeePass, Bitwarden, Apple Passwords i Google Password Manager, trezor se šifrira prije pohrane. Uz jaku glavnu lozinku, pružatelj općenito ne može čitati pohranjene vjerodajnice.",
    },
    {
      q: "Što se događa ako zaboravim glavnu lozinku?",
      a: "Većina upravitelja lozinki ne može je povratiti jer je nikada ne znaju. To je namjerno. Neki servisi nude opcije oporavka ili hitan pristup ako su unaprijed konfigurirani.",
    },
    {
      q: "Trebam li koristiti pohranu lozinki u pregledniku?",
      a: "Ugrađeni Apple i Google upravitelji jaki su, stabilni izbori u svojim ekosustavima — podržani od velikih sigurnosnih timova. KeePass odgovara za maksimalnu kontrolu. Bitwarden kada vam treba cloud sync na mješovitim platformama, prihvaćajući veći serverski rizik.",
    },
  ],
  finalTitle: "Konačna preporuka",
  finalBody:
    "Nijedan upravitelj nije savršen za sve — no korištenje jednog među je najučinkovitijim koracima. Kombinirajte ga s Passwords.lu za brzo generiranje i PrivateNote kada trebate sigurno dijeliti tajne.",
  finalBullets: [
    { label: "Apple & Google", text: "stabilni platformski zadani izbori" },
    { label: "KeePass", text: "lokalna kontrola, open source" },
    { label: "Bitwarden", text: "cloud sync kada vam treba svaki uređaj" },
    { label: "Passwords.lu", text: "brzo generiranje u pregledniku" },
  ],
  finalCtaPrivateNote: "Podijelite tajnu s PrivateNote",
  finalCtaPasswordsLu: "Posjetite passwords.lu",
  exploreOther: "Istražite druge vodiče",
  allResources: "Svi resursi",
  affiliateDisclaimer:
    "Samo edukativni vodič. Možemo zaraditi proviziju preko affiliate poveznica kada koristite preporučene usluge, što pomaže održavanju ovog besplatnog resursa o privatnosti.",
  otherGuides: [
    { id: "vpn", title: "Vodič za VPN usluge" },
    { id: "messenger", title: "Sigurno slanje poruka" },
    { id: "email", title: "Sigurna e-pošta" },
    { id: "browser", title: "Preglednici za privatnost" },
  ],
};
