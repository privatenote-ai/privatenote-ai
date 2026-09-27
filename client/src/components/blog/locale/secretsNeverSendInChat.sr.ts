import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatSr: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Od Slacka i Microsoft Teamsa do WhatsAppa i Messengera, čet je postao podrazumevani način razmene informacija. Brz je, praktičan i drži timove usklađenima. Nažalost, postao je i digitalno groblje visoko osetljivih podataka — podeljenih u trenutku praktičnosti, zatim zaboravljenih.",
    "Mnoge moderne čet aplikacije nude snažno [šifrovanje u prenosu](blog:encrypted-vs-secure-file-sharing) ili čak end-to-end šifrovanje. Šifrovanje štiti poruke dok putuju između uređaja. Veći problem je šta se dešava posle. Kada tajna uđe u čet, često ostaje pretraživa mesecima ili godinama u više sistema.",
    "Ta trajnost stvara iznenađujuće veliki digitalni otisak. Osetljive informacije mogu preživeti u pretraživoj istoriji četa, cloud rezervnim kopijama, izvozima radnog prostora, pregledima obaveštenja, snimcima ekrana i sinhronizovanim uređajima.",
    "Prema [Verizonovom izveštaju o istraživanju povreda podataka za 2026.](https://www.verizon.com/business/resources/reports/dbir/), **62% povreda uključuje ljudski element** — krađu kredencijala, phishing, socijalni inženjering, zloupotrebu i jednostavne greške. Tehnologija sama ne može sprečiti te incidente ako se osetljive informacije dele nepažljivo.",
    "Sigurniji pristup oslanja se na jednostavno načelo: **delite informacije samo kada treba i obezbedite da nestanu nakon prvog pregleda.** To je model iza [jednokratnih tajnih linkova](blog:one-time-secret-links) — i zašto PrivateNote tretira vek trajanja beleške kao deo bezbednosti, ne naknadnu misao.",
  ],
  chatScreenshotCaption:
    "Ilustrativni primer: kredencijali u običnom tekstu nalepljeni u timski čet ostaju u istoriji kanala, rezervnim kopijama i pretrazi — dugo nakon što je predaja gotova.",
  cheatSheetTitle: "Brza referentna bezbednosna tabela",
  cheatSheetHeaders: ["Nikad ne šaljite", "Rizik", "Bolji pristup"],
  cheatSheetRows: [
    {
      neverSend: "Lozinke",
      risk: "Indeksirane u trajnoj istoriji četa i pretraživim logovima.",
      better: "[Jednokratni link enkriptovan u pregledniku](blog:one-time-secret-links).",
    },
    {
      neverSend: "Kodovi za oporavak",
      risk: "U praksi trajno zaobilazi višefaktorsku autentifikaciju.",
      better: "Namenski menadžer lozinki ili [jednokratna beleška](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "API ključevi",
      risk: "Slučajno lepljenje u javni kanal kompromituje produkciona okruženja.",
      better: "[Samouništavajuća sigurna beleška](blog:privatenote-for-developers) sa enkripcijom na strani klijenta.",
    },
    {
      neverSend: "Dokumenti",
      risk: "Ostavlja trajne kopije razbacane po lokalnim folderima preuzimanja.",
      better: "[Privremeni enkriptovani prenos fajlova](app:secure-file-transfer) sa ograničenim pristupom.",
    },
  ],
  whyChatTitle: "Zašto čet nije menadžer tajni",
  whyChatParagraphs: [
    "Platforme za poruke dizajnirane su za komunikaciju, ne za upravljanje tajnama. Njihova svrha je očuvati razgovore između uređaja, sinhronizovati istoriju, podržati pretragu, stvarati rezervne kopije i voditi zapise saradnje.",
    "Te iste funkcije postaju odgovornost kada se dele kredencijali ili korporativna imovina. Informacije ostaju dostupne dugo nakon što su ispunile svrhu. Naš članak o [poslovnim porukama i pravnom otkrivanju](blog:workplace-texts-private-note) pokazuje kako neformalno napisane poruke mogu nadživeti izvorni kontekst godinama.",
    "Jednokratna tajna prati drugačiji model: učinite informaciju dostupnom samo kratko dok je stvarno potrebna — zatim uklonite pristup na strani servera po dizajnu.",
  ],
  lifetimeTitle: "Vek trajanja podataka: klasični čet naspram PrivateNote-a",
  lifetimeIntro:
    "Razlika nije u tome da li je poruka šifrovana u prenosu. Reč je o tome da li tajna i dalje postoji negde nakon što je pročitana.",
  chatWorkflowLabel: "Tok klasičnog četa",
  chatWorkflowSteps: ["Lozinka", "Slack / Teams", "Sačuvano", "Pretraživo", "Rezervne kopije", "Godinama kasnije"],
  chatWorkflowOutcome: "Tajna preživljava u sistemima",
  privateNoteWorkflowLabel: "PrivateNote tok",
  privateNoteWorkflowSteps: [
    "Lozinka",
    "Enkripcija u pregledniku",
    "Jednokratni link",
    "Pregledano",
    "Obrisano sa servera",
  ],
  privateNoteWorkflowOutcome: "Tajna uklonjena nakon isporuke",
  secretsTitle: "10 tajni koje treba zabraniti u čet aplikacijama",
  secrets: [
    {
      title: "Lozinke naloga",
      paragraphs: [
        'Svi smo to videli: "Hej, koja je opet lozinka za zajednički marketing nalog?" praćeno odgovorom u običnom tekstu. Čak i ako u potpunosti verujete kolegi, ta lozinka je sada indeksirana u istoriji radnog prostora, u kešu lokalnih podataka aplikacije i možda vidljiva u pregledima e-pošte ili push obaveštenja.',
        "Ako napadač kompromituje tu istoriju četa mesecima kasnije, nasleđuje aktivan pristup vašem nalogu.",
      ],
      instead:
        "Pošaljite [jednokratni link enkriptovan u pregledniku](blog:send-secret-message-without-account). Kada primalac otvori link i preuzme lozinku, šifrovani tekst se briše sa host servera. Trebate jaku lozinku pre toga? Koristite naš [generator lozinki](app:password-generator).",
    },
    {
      title: "Kodovi za oporavak višefaktorske autentifikacije (MFA)",
      paragraphs: [
        "Pri uključivanju MFA servisi generišu rezervne kodove za hitne slučajeve. Pošto se korisnici boje gubitka pristupa, često ih nalepe u čet sa kolegom — ili pošalju u sopstveni lični čet.",
        "Kodovi za oporavak rezervni su glavni ključevi. Tretirati ih kao ležernu poruku poništava celu svrhu višefaktorske bezbednosti.",
      ],
      instead:
        "Čuvajte ih u namenskom menadžeru lozinki. Ako ih morate podeliti tokom predaje naloga, koristite [privremenu belešku za jedan pregled](blog:one-time-secret-links) kako tajna ne bi trajno ostala u istoriji četa.",
    },
    {
      title: "Produkcijski API ključevi",
      paragraphs: [
        "Developeri rutinski razmenjuju API ključeve, pristupne tokene ili cloud tajne preko četa da brzo reše problem. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) kontinuirano otkriva izložene kredencijale u javnim repozitorijumima — dokaz koliko često tajne cure slučajno.",
        "Jedno slučajno lepljenje u pogrešan kanal može izložiti live baze podataka ili billing pipeline.",
      ],
      instead:
        "Usmerite tokene kroz [enkriptovanu belešku na strani klijenta](blog:privatenote-for-developers) koja automatski ističe nakon jednog pregleda.",
    },
    {
      title: "SSH privatni ključevi",
      paragraphs: [
        "Vaš privatni ključ vaš je identitet za serversku infrastrukturu. Nikad ne bi trebao postojati u messaging aplikaciji. Kopiranje privatnog ključa znači da kopija sada živi van namenjenog sigurnog okruženja — i može preživeti u istoriji četa, rezervnim kopijama ili na uređajima primaoca.",
      ],
      instead:
        "Ako se ključ mora sigurno premestiti, koristite enkriptovani payload za jedan pregled koji se briše sa host servera nakon isporuke.",
    },
    {
      title: "Pozivnice i linkovi za reset",
      paragraphs: ["Ljudi stalno bacaju privremene onboarding i administrativne linkove u čet kanale:"],
      bullets: [
        "Zoom linkovi za dodelu hosta",
        "Google Meet tokeni moderatorskog pristupa",
        "Stripe onboarding pozivnice",
        "Pozivnice za admin privilegije",
        "URL-ovi za reset lozinke",
      ],
      instead:
        "Isporučite linkove visokih privilegija putem [jednokratne beleške](blog:one-time-secret-links) kako se ne bi mogli pokupiti iz istorijskih logova ako ostanu neiskorišćeni.",
    },
    {
      title: "Seed fraze za kriptovalute",
      paragraphs: [
        "Vaša 12- ili 24-rečna fraza oporavka kontroliše ceo novčanik. Ako neko kompromituje vaš čet nalog godinama kasnije, automatizovano skeniranje može pretražiti istorijske razgovore za fraze u seed formatu. Ako vam ukradu seed frazu, imovina može biti trajno izgubljena.",
      ],
      instead:
        "U potpunosti izbegavajte digitalni prenos seed fraza. Ako apsolutna nužda prisili na to, koristite enkriptovanu belešku koja nakon čitanja odmah briše sadržaj kako biste ograničili izloženost.",
    },
    {
      title: "Privremeni pristupni kredencijali",
      paragraphs: [
        "IT helpdeski često dele početne kredencijale tokom onboardinga zaposlenih. Iako se korisnika obično traži promena lozinke pri prvoj prijavi, privremeni kredencijal ostaje pretraživ u istoriji četa. Ako korisnik odloži promenu — ili sistem dozvoljava ponovnu upotrebu lozinke — ta poruka ostaje aktivna ranjivost.",
      ],
      instead:
        "Isporučite privremene kredencijale kroz [belešku enkriptovanu u pregledniku](blog:send-secret-message-without-account) koja ističe nakon pregleda.",
    },
    {
      title: "Finansijske i bankovne informacije",
      paragraphs: [
        "Lepljenje korporativnih IBAN-ova, podataka za wire transfer, poreskih dokumenata ili potvrda plaćanja u čet deluje bezazleno jer IBAN sam po sebi nije lozinka. Međutim, kada napadači spoje bankovne podatke sa ličnim razgovorima u istoriji četa, dobijaju kontekst potreban za uverljive phishing i invoice-fraud napade.",
      ],
      instead:
        "Odvojite finansijske podatke od svakodnevnog razgovora. Delite ih kroz enkriptovane kanale koji uklanjaju pristup čim je transakcija potvrđena.",
    },
    {
      title: "Skenovi ličnih dokumenata",
      paragraphs: [
        "Trebate brzo poslati kopiju pasoša, vozačke dozvole ili ugovora o radu HR-u? Bacanje PDF-a u čet prozor kopira visoko osetljive identitetske podatke u cloud rezervne kopije, lokalne galerije telefona i sinhronizovane desktop foldere.",
      ],
      instead:
        "Koristite [siguran prenos fajlova](app:secure-file-transfer) sa enkripcijom u pregledniku — jedno preuzimanje, zatim fajl se briše sa hosting servera prema vašim podešavanjima pristupa.",
    },
    {
      title: "Poverljive poslovne informacije",
      paragraphs: [
        "Interni strateški deckovi, neobjavljene cenovne ponude, pravni nacrti i dokumenti o akvizicijama stalno kruže timskim kanalima. Curenja podataka ne dolaze uvek od spoljnih hakera; ponekad se dese jer zaposleni slučajno pozove spoljnog gosta u kanal sa godinama interne strategije.",
      ],
      instead:
        "Delite osetljivu korporativnu imovinu enkriptovanim beleškama sa strogim automatskim datumima isteka i ograničenim prozorima pristupa.",
    },
  ],
  lifespanTitle: "Tajne imaju vek trajanja",
  lifespanParagraphs: [
    "Šifrovanje štiti tajne u prenosu. **Istek ih štiti kroz vreme.** Većina čet aplikacija taj drugi deo u potpunosti ignoriše.",
    "Kada koristite PrivateNote, bezbednosni stav menjate po dizajnu. Umesto oslanjanja na korisnike da kasnije obrišu osetljive poruke, nametnete vek trajanja tajne. Primalac pročita jednom — i tada nestaje sa servera.",
  ],
  lifespanBullets: [
    "**Bez trajnog otiska:** nijedna istorija četa ili pretraživa arhiva ne sadrži sirovu tajnu.",
    "**Smanjenje blast radiusa:** ako se laptop ili čet nalog kasnije kompromituje, nema starih lozinki u logovima za berbu.",
    "**Ublažavanje ljudske greške:** sistem automatski minimizira podatke, bez potrebe da ručno brišete osetljive poruke.",
  ],
  underHoodTitle: "Bezbednost ispod haube: kako PrivateNote radi",
  underHoodParagraphs: [
    "PrivateNote enkriptuje vašu poruku direktno u pregledniku pre uploada. Server čuva samo enkriptovani šifrovani tekst. Ključ za dešifrovanje živi u [URL fragmentu](blog:one-time-secret-links) — delu nakon `#` — koji preglednici ne šalju web serverima kao deo HTTP zahteva. Server nikad ne prima ključ za dešifrovanje.",
    "Kada se beleška otvori prema vašim podešavanjima, enkriptovani šifrovani tekst briše se sa servera. Za lozinke, API ključeve, kodove za oporavak i privremene kredencijale, **ograničavanje veka trajanja podataka jednako je važno kao i enkripcija samih podataka.** Četovi čuvaju razgovore. PrivateNote ograničava vek trajanja tajni.",
  ],
  faqTitle: "Često postavljana pitanja",
  faq: [
    {
      question: "Da li je slanje lozinki u Slacku sigurno?",
      answer:
        "Slack šifruje podatke u prenosu i u mirovanju, ali lozinke ostaju u pretraživoj istoriji četa dok se ne obrišu. Za privremene kredencijale, [jednokratna beleška enkriptovana u pregledniku](blog:send-secret-message-without-account) smanjuje dugoročnu izloženost.",
    },
    {
      question: "Da li su WhatsApp poruke sigurne za lozinke?",
      answer:
        "End-to-end šifrovanje štiti poruke tokom prenosa, a nestajuće poruke mogu ih automatski obrisati nakon zadatog vremena — ali primaoci i dalje mogu snimiti ekran, proslediti ili rezervno kopirati sadržaj pre nego što nestane. Lozinke bi se idealno trebale deliti samo dok su potrebne — kroz [jednokratnu tajnu vezu](blog:one-time-secret-links), ne trajni čet thread.",
    },
    {
      question: "Da li je e-pošta sigurnija od četa za lozinke?",
      answer:
        "Ne. Standardna e-pošta po defaultu nema end-to-end šifrovanje i prolazi kroz više mail servera. Kada je isporučena, lozinka beskonačno stoji u sandučićima, poslatim folderima, lokalnim keševima i rezervnim kopijama provajdera.",
    },
    {
      question: "Šta je jednokratna tajna?",
      answer:
        "Jednokratna tajna poruka je ona koja postaje nedostupna nakon jednog pregleda ili nakon definisanog vremena isteka — smanjujući trajne kopije u sistemima. Pogledajte naš vodič o [tome kako jednokratni tajni linkovi rade](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Reference",
  references: [
    "Verizon. 2026 Data Breach Investigations Report (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. 2026 Healthcare Data Breach Investigations Snapshot. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Delite tajne bez otiska u obliku četa",
  closingBody: [
    "Čet je odličan za koordinaciju. Loš je trezor za kredencijale, ključeve, kodove za oporavak i dokumente koji nikad nisu trebali trajati.",
    "PrivateNote je izgrađen za suprotan obrazac: enkripcija u pregledniku, deljenje linka i istek tajne kada posao završi — pošiljaocu nije potreban nalog, nema običnog teksta u pretraživoj arhivi godinama.",
  ],
  tagline: "Manje istorije četa. Manje metapodataka. Više kontrole nad tim koliko dugo tajna postoji online.",
  relatedReading: "Dodatno čitanje",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Pošaljite lozinke i privatne beleške bez registracije — enkripcija u pregledniku i privremeni linkovi objašnjeni.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Kako rade linkovi koji se brišu nakon čitanja, zašto URL fragment ima značaj i kada kratkotrajnost pobedi e-poštu ili Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto pisani zapisi u e-pošti i poslovnom četu stvaraju dugoročni rizik — i kada kratkotrajne beleške bolje odgovaraju.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS naspram enkripcije u pregledniku — šta svaki štiti i zašto server i dalje može čitati vaše podatke.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Stvorite jake lozinke pre nego ih podelite kroz jednokratni link.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Praktična bezbednosna osnova za lozinke, autentifikaciju i navike sigurnog deljenja.",
    },
  ],
};
