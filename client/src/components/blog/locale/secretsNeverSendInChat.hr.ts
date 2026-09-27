import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatHr: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Od Slacka i Microsoft Teamsa do WhatsAppa i Messengera, chat je postao zadani način razmjene informacija. Brz je, praktičan i drži timove usklađenima. Nažalost, postao je i digitalno groblje visoko osjetljivih podataka — podijeljenih u trenutku praktičnosti, zatim zaboravljenih.",
    "Mnoge moderne chat aplikacije nude snažno [šifriranje u prijenosu](blog:encrypted-vs-secure-file-sharing) ili čak end-to-end šifriranje. Šifriranje štiti poruke dok putuju između uređaja. Veći problem je što se događa poslije. Kad tajna uđe u chat, često ostaje pretraživa mjesecima ili godinama u više sustava.",
    "Ta trajnost stvara iznenađujuće veliki digitalni otisak. Osjetljive informacije mogu preživjeti u pretraživoj povijesti chata, cloud sigurnosnim kopijama, izvozima radnog prostora, pregledima obavijesti, snimkama zaslona i sinkroniziranim uređajima.",
    "Prema [Verizonovom izvještaju o istraživanju povreda podataka za 2026.](https://www.verizon.com/business/resources/reports/dbir/), **62% povreda uključuje ljudski element** — krađu vjerodajnica, phishing, socijalni inženjering, zlouporabu i jednostavne pogreške. Tehnologija sama ne može spriječiti te incidente ako se osjetljive informacije dijele nepažljivo.",
    "Sigurniji pristup oslanja se na jednostavno načelo: **dijelite informacije samo kad treba i osigurajte da nestanu nakon prvog pregleda.** To je model iza [jednokratnih tajnih poveznica](blog:one-time-secret-links) — i zašto PrivateNote tretira vijek trajanja bilješke kao dio sigurnosti, ne naknadnu misao.",
  ],
  chatScreenshotCaption:
    "Ilustrativni primjer: vjerodajnice u običnom tekstu zalijepljene u timski chat ostaju u povijesti kanala, sigurnosnim kopijama i pretraživanju — dugo nakon što je predaja gotova.",
  cheatSheetTitle: "Brza referentna sigurnosna tablica",
  cheatSheetHeaders: ["Nikad ne šaljite", "Rizik", "Bolji pristup"],
  cheatSheetRows: [
    {
      neverSend: "Lozinke",
      risk: "Indeksirane u trajnoj povijesti chata i pretraživim logovima.",
      better: "[Jednokratna poveznica enkriptirana u pregledniku](blog:one-time-secret-links).",
    },
    {
      neverSend: "Kodovi za oporavak",
      risk: "U praksi trajno zaobilazi višefaktorsku autentifikaciju.",
      better: "Namjenski upravitelj lozinki ili [jednokratna bilješka](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "API ključevi",
      risk: "Slučajno lijepljenje u javni kanal kompromitira produkcijska okruženja.",
      better: "[Samouništavajuća sigurna bilješka](blog:privatenote-for-developers) s enkripcijom na strani klijenta.",
    },
    {
      neverSend: "Dokumenti",
      risk: "Ostavlja trajne kopije razbacane po lokalnim mapama preuzimanja.",
      better: "[Privremeni enkriptirani prijenos datoteka](app:secure-file-transfer) s ograničenim pristupom.",
    },
  ],
  whyChatTitle: "Zašto chat nije upravitelj tajni",
  whyChatParagraphs: [
    "Platforme za poruke dizajnirane su za komunikaciju, ne za upravljanje tajnama. Njihova svrha je očuvati razgovore između uređaja, sinkronizirati povijest, podržati pretraživanje, stvarati sigurnosne kopije i voditi zapise suradnje.",
    "Te iste značajke postaju odgovornost kad se dijele vjerodajnice ili korporativna imovina. Informacije ostaju dostupne dugo nakon što su ispunile svrhu. Naš članak o [poslovnim porukama i pravnom otkrivanju](blog:workplace-texts-private-note) pokazuje kako neformalno napisane poruke mogu nadživjeti izvorni kontekst godinama.",
    "Jednokratna tajna slijedi drugačiji model: učinite informaciju dostupnom samo kratko dok je stvarno potrebna — zatim uklonite pristup na strani poslužitelja po dizajnu.",
  ],
  lifetimeTitle: "Vijek trajanja podataka: klasični chat naspram PrivateNote-a",
  lifetimeIntro:
    "Razlika nije u tome je li poruka šifrirana u prijenosu. Riječ je o tome postoji li tajna negdje nakon što je pročitana.",
  chatWorkflowLabel: "Tijek klasičnog chata",
  chatWorkflowSteps: ["Lozinka", "Slack / Teams", "Pohranjeno", "Pretraživo", "Sigurnosne kopije", "Godinama kasnije"],
  chatWorkflowOutcome: "Tajna preživljava u sustavima",
  privateNoteWorkflowLabel: "PrivateNote tijek",
  privateNoteWorkflowSteps: [
    "Lozinka",
    "Enkripcija u pregledniku",
    "Jednokratna poveznica",
    "Pregledano",
    "Obrisano s poslužitelja",
  ],
  privateNoteWorkflowOutcome: "Tajna uklonjena nakon isporuke",
  secretsTitle: "10 tajni koje trebate zabraniti u chat aplikacijama",
  secrets: [
    {
      title: "Lozinke računa",
      paragraphs: [
        'Svi smo to vidjeli: "Hej, koja je opet lozinka za zajednički marketing račun?" praćeno odgovorom u običnom tekstu. Čak i ako u potpunosti vjerujete kolegi, ta lozinka je sada indeksirana u povijesti radnog prostora, u predmemoriji lokalnih podataka aplikacije i možda vidljiva u pregledima e-pošte ili push obavijesti.',
        "Ako napadač kompromitira tu povijest chata mjesecima kasnije, nasljeđuje aktivan pristup vašem računu.",
      ],
      instead:
        "Pošaljite [jednokratnu poveznicu enkriptiranu u pregledniku](blog:send-secret-message-without-account). Kad primatelj otvori link i preuzme lozinku, šifrirani tekst se briše s host poslužitelja. Trebate jaku lozinku prije toga? Koristite naš [generator lozinki](app:password-generator).",
    },
    {
      title: "Kodovi za oporavak višefaktorske autentifikacije (MFA)",
      paragraphs: [
        "Pri uključivanju MFA servisi generiraju rezervne kodove za hitne slučajeve. Budući da se korisnici boje gubitka pristupa, često ih dijele u chat s kolegom — ili pošalju u vlastiti osobni chat.",
        "Kodovi za oporavak rezervni su glavni ključevi. Tretirati ih kao ležernu poruku poništava cijelu svrhu višefaktorske sigurnosti.",
      ],
      instead:
        "Čuvajte ih u namjenskom upravitelju lozinki. Ako ih morate podijeliti tijekom predaje računa, koristite [privremenu bilješku za jedan pregled](blog:one-time-secret-links) kako tajna ne bi trajno ostala u povijesti chata.",
    },
    {
      title: "Produkcijski API ključevi",
      paragraphs: [
        "Developeri rutinski razmjenjuju API ključeve, pristupne tokene ili cloud tajne preko chata da brzo riješe problem. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) kontinuirano otkriva izložene vjerodajnice u javnim repozitorijima — dokaz koliko često tajne cure slučajno.",
        "Jedno slučajno lijepljenje u krivi kanal može izložiti live baze podataka ili billing pipeline.",
      ],
      instead:
        "Usmjerite tokene kroz [enkriptiranu bilješku na strani klijenta](blog:privatenote-for-developers) koja automatski istječe nakon jednog pregleda.",
    },
    {
      title: "SSH privatni ključevi",
      paragraphs: [
        "Vaš privatni ključ vaš je identitet za serversku infrastrukturu. Nikad ne bi trebao postojati u messaging aplikaciji. Kopiranje privatnog ključa znači da kopija sada živi izvan namijenjenog sigurnog okruženja — i može preživjeti u povijesti chata, sigurnosnim kopijama ili na uređajima primatelja.",
      ],
      instead:
        "Ako se ključ mora sigurno premjestiti, koristite enkriptirani payload za jedan pregled koji se briše s host poslužitelja nakon isporuke.",
    },
    {
      title: "Pozivnice i linkovi za reset",
      paragraphs: ["Ljudi stalno bacaju privremene onboarding i administrativne linkove u chat kanale:"],
      bullets: [
        "Zoom linkovi za dodjelu hosta",
        "Google Meet tokeni moderatorskog pristupa",
        "Stripe onboarding pozivnice",
        "Pozivnice za admin privilegije",
        "URL-ovi za reset lozinke",
      ],
      instead:
        "Isporučite linkove visokih privilegija putem [jednokratne bilješke](blog:one-time-secret-links) kako se ne bi mogli pokupiti iz povijesnih logova ako ostanu neiskorišteni.",
    },
    {
      title: "Seed fraze za kriptovalute",
      paragraphs: [
        "Vaša 12- ili 24-riječna fraza oporavka kontrolira cijeli novčanik. Ako netko kompromitira vaš chat račun godinama kasnije, automatizirano skeniranje može pretražiti povijesne razgovore za fraze u seed formatu. Ako vam ukradu seed frazu, imovina može biti trajno izgubljena.",
      ],
      instead:
        "U potpunosti izbjegavajte digitalni prijenos seed fraza. Ako apsolutna nužda prisili na to, koristite enkriptiranu bilješku koja nakon čitanja odmah briše sadržaj kako biste ograničili izloženost.",
    },
    {
      title: "Privremene prijavne vjerodajnice",
      paragraphs: [
        "IT helpdeski često dijele početne vjerodajnice tijekom onboardinga zaposlenika. Iako se korisnika obično traži promjena lozinke pri prvoj prijavi, privremena vjerodajnica ostaje pretraživa u povijesti chata. Ako korisnik odgodi promjenu — ili sustav dopušta ponovnu upotrebu lozinke — ta poruka ostaje aktivna ranjivost.",
      ],
      instead:
        "Isporučite privremene vjerodajnice kroz [bilješku enkriptiranu u pregledniku](blog:send-secret-message-without-account) koja istječe nakon pregleda.",
    },
    {
      title: "Financijske i bankovne informacije",
      paragraphs: [
        "Lijepljenje korporativnih IBAN-ova, podataka za wire transfer, poreznih dokumenata ili potvrda plaćanja u chat djeluje bezazleno jer IBAN sam po sebi nije lozinka. Međutim, kad napadači spoje bankovne podatke s osobnim razgovorima u povijesti chata, dobivaju kontekst potreban za uvjerljive phishing i invoice-fraud napade.",
      ],
      instead:
        "Odvojite financijske podatke od svakodnevnog razgovora. Dijelite ih kroz enkriptirane kanale koji uklanjaju pristup čim je transakcija potvrđena.",
    },
    {
      title: "Skenovi osobnih dokumenata",
      paragraphs: [
        "Trebate brzo poslati kopiju putovnice, vozačke dozvole ili ugovora o radu HR-u? Bacanje PDF-a u chat prozor kopira visoko osjetljive identitetske podatke u cloud sigurnosne kopije, lokalne galerije telefona i sinkronizirane desktop mape.",
      ],
      instead:
        "Koristite [siguran prijenos datoteka](app:secure-file-transfer) s enkripcijom u pregledniku — jedno preuzimanje, zatim datoteka se briše s hosting poslužitelja prema vašim postavkama pristupa.",
    },
    {
      title: "Povjerljive poslovne informacije",
      paragraphs: [
        "Interni strateški deckovi, neobjavljene cjenovne ponude, pravni nacrti i dokumenti o akvizicijama stalno kruže timskim kanalima. Curenja podataka ne dolaze uvijek od vanjskih hakera; ponekad se dogode jer zaposlenik slučajno pozove vanjskog gosta u kanal s godinama interne strategije.",
      ],
      instead:
        "Dijelite osjetljivu korporativnu imovinu enkriptiranim bilješkama sa strogim automatskim datumima isteka i ograničenim prozorima pristupa.",
    },
  ],
  lifespanTitle: "Tajne imaju vijek trajanja",
  lifespanParagraphs: [
    "Šifriranje štiti tajne u prijenosu. **Istek ih štiti kroz vrijeme.** Većina chat aplikacija taj drugi dio u potpunosti ignorira.",
    "Kad koristite PrivateNote, sigurnosni stav mijenjate po dizajnu. Umjesto oslanjanja na korisnike da kasnije obrišu osjetljive poruke, nametnete vijek trajanja tajne. Primatelj pročita jednom — i tada nestaje s poslužitelja.",
  ],
  lifespanBullets: [
    "**Bez trajnog otiska:** nijedna povijest chata ili pretraživa arhiva ne sadrži sirovu tajnu.",
    "**Smanjenje blast radiusa:** ako se laptop ili chat račun kasnije kompromitira, nema starih lozinki u logovima za berbu.",
    "**Ublažavanje ljudske pogreške:** sustav automatski minimizira podatke, bez potrebe da ručno brišete osjetljive poruke.",
  ],
  underHoodTitle: "Sigurnost ispod haube: kako PrivateNote radi",
  underHoodParagraphs: [
    "PrivateNote enkriptira vašu poruku izravno u pregledniku prije uploada. Poslužitelj pohranjuje samo šifrirani tekst. Ključ za dešifriranje živi u [URL fragmentu](blog:one-time-secret-links) — dijelu nakon `#` — koji preglednici ne šalju web poslužiteljima kao dio HTTP zahtjeva. Poslužitelj nikad ne prima ključ za dešifriranje.",
    "Kad se bilješka otvori prema vašim postavkama, šifrirani tekst briše se s poslužitelja. Za lozinke, API ključeve, kodove za oporavak i privremene vjerodajnice, **ograničavanje vijeka trajanja podataka jednako je važno kao i enkripcija samih podataka.** Chatovi čuvaju razgovore. PrivateNote ograničava vijek trajanja tajni.",
  ],
  faqTitle: "Često postavljana pitanja",
  faq: [
    {
      question: "Je li slanje lozinki u Slacku sigurno?",
      answer:
        "Slack šifrira podatke u prijenosu i u mirovanju, ali lozinke ostaju u pretraživoj povijesti chata dok se ne obrišu. Za privremene vjerodajnice, [jednokratna bilješka enkriptirana u pregledniku](blog:send-secret-message-without-account) smanjuje dugoročnu izloženost.",
    },
    {
      question: "Jesu li WhatsApp poruke sigurne za lozinke?",
      answer:
        "End-to-end šifriranje štiti poruke tijekom prijenosa, a nestajuće poruke mogu ih automatski obrisati nakon zadanog vremena — ali primatelji i dalje mogu snimiti zaslon, proslijediti ili sigurnosno kopirati sadržaj prije nego što nestane. Lozinke bi se idealno trebale dijeliti samo dok su potrebne — kroz [jednokratnu tajnu poveznicu](blog:one-time-secret-links), ne trajni chat thread.",
    },
    {
      question: "Je li e-pošta sigurnija od chata za lozinke?",
      answer:
        "Ne. Standardna e-pošta po defaultu nema end-to-end šifriranje i prolazi kroz više mail poslužitelja. Kad je isporučena, lozinka beskonačno stoji u pretincima, poslanim mapama, lokalnim predmemorijama i sigurnosnim kopijama pružatelja.",
    },
    {
      question: "Što je jednokratna tajna?",
      answer:
        "Jednokratna tajna poruka je ona koja postaje nedostupna nakon jednog pregleda ili nakon definiranog vremena isteka — smanjujući trajne kopije u sustavima. Pogledajte naš vodič o [tome kako jednokratne tajne poveznice rade](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Reference",
  references: [
    "Verizon. 2026 Data Breach Investigations Report (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. 2026 Healthcare Data Breach Investigations Snapshot. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Dijelite tajne bez otiska u obliku chata",
  closingBody: [
    "Chat je izvrstan za koordinaciju. Loš je trezor za vjerodajnice, ključeve, kodove za oporavak i dokumente koji nikad nisu trebali trajati.",
    "PrivateNote je izgrađen za suprotan obrazac: enkripcija u pregledniku, dijeljenje poveznice i istek tajne kad posao završi — pošiljatelju nije potreban račun, nema običnog teksta u pretraživoj arhivi godinama.",
  ],
  tagline: "Manje povijesti chata. Manje metapodataka. Više kontrole nad tim koliko dugo tajna postoji online.",
  relatedReading: "Dodatno čitanje",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Pošaljite lozinke i privatne bilješke bez registracije — enkripcija u pregledniku i privremene poveznice objašnjene.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Kako rade poveznice koje se brišu ili uništavaju nakon čitanja, zašto URL fragment ima značaj i kada kratkotrajnost pobjeđuje e-poštu ili Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto pisani zapisi u e-pošti i poslovnom chatu stvaraju dugoročni rizik — i kada kratkotrajne bilješke bolje odgovaraju.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS naspram enkripcije u pregledniku — što svaki štiti i zašto poslužitelj i dalje može čitati vaše podatke.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Stvorite jake lozinke prije nego ih podijelite kroz jednokratnu poveznicu.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Praktična sigurnosna osnova za lozinke, autentifikaciju i navike sigurnog dijeljenja.",
    },
  ],
};
