import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelySr: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop na stolu prikazuje PrivateNote.ai bezbedan link spreman za kopiranje, sa isticanjem nakon jednog pregleda i uključenom prolaznom frazom",
  heroCaption:
    "Pošaljite bezbedan link—ne samu lozinku—sa kratkim rokom važenja, jednokratnim pregledom i opcionalnom prolaznom frazom.",
  intro: [
    "Deljenje lozinke deluje kao sitna, svakodnevna radnja—dok nešto ne pođe po zlu.",
    "Bilo da kolegi treba privremeni pristup internom alatu, predstavnik korisničke podrške traži sistemski pristup, ili treba da pošaljete Wi-Fi kredencijale posetiocu, najbrža opcija često izgleda kao lepljenje lozinke u čistom tekstu u Microsoft Teams čet, WhatsApp poruku ili brzi mejl.",
    "Nažalost, ta pogodnost ostavlja trajni digitalni trag. Jednom kada tajna uđe u te kanale, sinhronizuje se na uređajima, može se pretraživati, čuva se u automatskim rezervnim kopijama sandučeta i zadržava se u korporativnim arhivama poruka neograničeno. Lozinka koja je trebalo da bude privremena postaje trajna odgovornost.",
    "Srećom, postoji bolji način da zaštitite svoje kredencijale.",
  ],
  sections: [
    {
      title: "Osnovni problem deljenja u čistom tekstu",
      paragraphs: [
        "Aplikacije za e-poštu i čet su odlične platforme za saradnju, ali nikada nisu dizajnirane da čuvaju tajne. Iako moderni sistemi obično šifruju podatke tokom prenosa, padaju na efemernosti—osiguravanju da tajne nestanu nakon što su odslužile svrhu.",
        "Kada nalepite lozinku u standardni čet ili mejl nit, odmah gubite kontrolu nad njenim životnim ciklusom. Ostaje sačuvana u sandučetima, pretraživa u logovima četa godinama kasnije i vidljiva u notifikacijama uređaja ili na zaključanom ekranu. Ako ikada bude kompromitovan vaš nalog ili nalog primaoca, te istorije četa u čistom tekstu postaju zlatni rudnik za napadače.",
      ],
    },
    {
      title: "GDPR (DSGVO) i rizici usklađenosti u Evropi",
      paragraphs: [
        "Za evropske organizacije ovo nije samo bezbednosna briga—to je rizik usklađenosti. Prema Opštoj uredbi o zaštiti podataka (GDPR / DSGVO), kompanije su zakonski obavezne da štite pristup ličnim podacima korišćenjem savremenih tehničkih i organizacionih mera.",
        "Lepljenje aktivnih kredencijala u cloud logove četa hostovane u SAD ili na nešifrovane mejl servere bez posvećenog end-to-end šifrovanja može povećati izloženost usklađenosti, posebno ako te lozinke daju pristup bazama koje sadrže podatke kupaca ili zaposlenih.",
        "Lokalno šifrovanje u pretraživaču drastično smanjuje gde kredencijali mogu da ostanu, držeći svakodnevne predaje usklađenim sa pristupom koji stavlja privatnost na prvo mesto. Ovo nije pravni savet; tretirajte bezbedno deljenje kredencijala kao jedan deo šire kontrole pristupa, upravljanja lozinkama i politike rotacije.",
      ],
    },
    {
      title: "Kako funkcionišu linkovi šifrovani u pretraživaču",
      paragraphs: [
        "Za brzo, jednokratno deljenje lozinki, jednokratni linkovi šifrovani u pretraživaču spadaju među najbezbednije i najefikasnije opcije. Umesto da šaljete sam kredencijal, šaljete jedinstven, privremeni link ka šifrovanoj belešci.",
        "Vaš pretraživač obavlja težak posao: lozinka se šifruje lokalno pre uploada, tako da posrednički server čuva ciphertext—ne vašu sirovu lozinku. Ključ za dešifrovanje obično ostaje u fragmentu linka, koji pretraživači ne šalju serveru.",
      ],
      flowIntro:
        "Da biste podelili tajnu pomoću privremenog, samouništavajućeg linka, pratite ova četiri koraka:",
      flowSteps: [
        {
          step: "Korak 1",
          title: "Unos i lokalno šifrovanje",
          body: "Unesite lozinku u bezbedan alat. Vaš pretraživač je šifruje lokalno ključem koji nikada ne napušta vašu mašinu u čistom tekstu.",
        },
        {
          step: "Korak 2",
          title: "Generisanje linka",
          body: "Alat uploaduje samo šifrovani payload na zero-knowledge server i gradi jedinstven link za deljenje. Materijal za dešifrovanje ostaje uz link—ne u serverskom trezoru čitljivih tajni.",
        },
        {
          step: "Korak 3",
          title: "Slanje linka",
          body: "Kopirajte i pošaljite link preko Microsoft Teamsa, e-pošte ili WhatsAppa. Platforma za čet vidi URL, ne vašu lozinku.",
        },
        {
          step: "Korak 4",
          title: "Otkrivanje i samouništenje",
          body: "Pretraživač primaoca dešifruje sadržaj lokalno. U zavisnosti od politike deljenja, šifrovani payload zatim može biti uklonjen sa servera nakon pregleda ili nakon kratkog prozora isticanja.",
        },
      ],
      midCta: {
        body: "Treba da podelite lozinku sada? Napravite šifrovanu jednokratnu belešku i pošaljite bezbedan link umesto same lozinke.",
        button: "Napravi privatnu belešku",
      },
    },
    {
      title: "Savet za visoku bezbednost: deljenje preko razdvojenih kanala",
      paragraphs: [
        "Šifrovani link je bezbedan onoliko koliko i kanal kojim ga šaljete. Ako zlonamerna treća strana dobije pristup vašem Teamsu ili mejl sandučetu, može da presretne link pre nego što ga primalac otvori.",
        "Mnogi alati za bezbedno deljenje—uključujući PrivateNote.ai—nude opcionalno podešavanje da se beleška umota dodatnom lozinkom (passphrase wrapping). To nije uključeno podrazumevano: uključite ga kada kreirate belešku, izaberite prolaznu frazu, a primalac mora da je unese pre nego što se tajna otkrije.",
        "Da biste sprečili jednu tačku otkaza (SPoF) za visoko osetljive kredencijale, koristite tu opciju za deljenje preko razdvojenih kanala: generišite šifrovani link sa uključenom zaštitom prolaznom frazom, pošaljite link primarnim kanalom (na primer Microsoft Teams), a prolaznu frazu pošaljite potpuno drugim kanalom—poželjno mesindžerom usmerenim na privatnost kao što su Signal ili Threema, ili kratkim telefonskim pozivom.",
      ],
      callout:
        "Napadaču bi trebali i link i prolazna fraza. Ta razdvojenost čini deljenje preko razdvojenih kanala delotvornim.",
    },
    {
      title: "Deljenje preko menadžera lozinki naspram jednokratnih linkova",
      paragraphs: [
        "Oba metoda mogu biti veoma bezbedna, ali služe različitim svrhama. Izbor pravog alata zavisi od toga koliko dugo primalcu treba pristup.",
      ],
      comparisonTable: {
        headers: ["Kategorija", "Najbolje za", "Tehnička ograničenja"],
        rows: [
          [
            "E-pošta, Teams ili WhatsApp",
            "Nije preporučeno za lozinke",
            "Ostavlja trajne, pretražive kopije u čistom tekstu u rezervnim kopijama i arhivama",
          ],
          [
            "Menadžeri lozinki",
            "Trajni pristup: deljenje trezora sa članovima porodice, internim odeljenjima ili pouzdanim osnovnim timovima",
            "Zahteva da obe strane održavaju aktivne, kompatibilne naloge menadžera lozinki",
          ],
          [
            "Jednokratni šifrovani linkovi",
            "Privremeni pristup: frilenseri, korisnička podrška, posetioci i jednokratne predaje",
            "Svako sa linkom može pročitati tajnu osim ako nije zaštićena sekundarnom prolaznom frazom",
          ],
        ],
        after: [
          "Kao pravilo: koristite **menadžer lozinki** za trajni deljeni pristup, a **jednokratni šifrovani link** kada kredencijal treba promeniti ubrzo nakon predaje.",
        ],
      },
    },
    {
      title: "Kada koristiti jednokratni link za lozinku",
      paragraphs: [
        "Jednokratno deljenje lozinki idealno je za transakcione kredencijale koje treba saopštiti samo jednom. Uobičajeni primeri na evropskim radnim mestima uključuju:",
      ],
      useCaseTable: {
        headers: ["Odeljenje", "Uobičajeni slučajevi upotrebe"],
        rows: [
          [
            "Administracija i kancelarija",
            "Lozinke za ruter ili kancelarijski gostujući Wi-Fi, admin kredencijali za štampač ili podešavanja pametne kancelarije",
          ],
          [
            "Finansije i poslovanje",
            "Kredencijali za poreskog savetnika ili eksterne finansijske revizore",
          ],
          [
            "IT i operacije",
            "Onboarding privremenih eksternih IT provajdera ili deljenje privremenih prijava za izvođače",
          ],
          [
            "Tehnički timovi",
            "Kredencijali baza podataka, API ključevi, SSH ključevi ili lozinke cloud platformi sa developerima",
          ],
        ],
      },
    },
    {
      title: "Najbolje prakse i zamke koje treba izbegavati",
      subsections: [
        {
          title: "Sprovedite rotaciju",
          paragraphs: [
            "Kad god delite lozinku, tretirajte je kao privremenu. Zamolite primaoca da je promeni čim se prijavi i potvrdite da je rotacija završena pre nego što smatrate predaju gotovom.",
          ],
        },
        {
          title: "Generišite jake, lokalne lozinke",
          paragraphs: [
            "Ne izmišljajte lozinke sami. Koristite lokalni alat kao što je PrivateNoteov [generator lozinki](app:password-generator), ili [passwords.lu](https://passwords.lu) za opcije prolaznih fraza i PIN-ova. Oba rade lokalno—ništa se ne uploaduje. Za tehnički model pogledajte [Kako generišemo bezbedne lozinke](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Držite vreme isticanja kratkim",
          paragraphs: [
            "Većini lozinki treba da postoje samo nekoliko minuta ili sati. Preferirajte jedan pregled ili kratak prozor kao što su dva sata kada to i dalje odgovara toku rada primaoca.",
          ],
        },
        {
          title: "Ne stavljajte lozinke u naslove ili predmete",
          paragraphs: [
            "Nikada ne stavljajte lozinke u čistom tekstu u predmet e-pošte, naslove sistema za tikete, imena Teams kanala, naslove WhatsApp grupa, imena dokumenata ili kalendarske pozivnice. Ta polja retko dobijaju istu pažnju kao tela poruka—i ostaju u indeksima pretrage.",
          ],
        },
        {
          title: "Držite kontekst van bezbedne beleške",
          paragraphs: [
            "Ako delite lozinku baze podataka, ne pišite „Lozinka baze podataka za produkcioni CRM: MySecret123!“ unutar beleške. Stavite samo sirovu tajnu u šifrovani link. Ako se link presretne, napadač ne bi trebalo da sazna i koji nalog ili sistem otključava.",
          ],
        },
      ],
      calloutTitle: "Česta greška",
      callout:
        "Slanje i šifrovanog linka i njegove prolazne fraze u istoj Teams poruci, WhatsApp četu ili mejlu poništava deljenje preko razdvojenih kanala i ponovo stvara jednu tačku otkaza.",
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li su Microsoft Teams ili WhatsApp bezbedniji od e-pošte?",
          answer:
            "Njihovi protokoli prenosa su generalno bezbedni, ali i dalje funkcionišu kao dugoročne arhive četa. Svaka lozinka nalepljena u nit može ostati pretraživa neograničeno, što je čini trajnom ranjivošću.",
        },
        {
          question: "Da li GDPR (DSGVO) utiče na način na koji delim lozinke?",
          answer:
            "Prema članu 32 GDPR-a, organizacije moraju da primene odgovarajuće tehničke i organizacione mere za obezbeđivanje ličnih podataka. Čuvanje lozinki u čistom tekstu u cloud rezervnim kopijama ili otvorenim mejl nitima povećava izloženost usklađenosti. Zero-knowledge, samouništavajući linkovi drže trag kredencijala manjim.",
        },
        {
          question: "Da li treba da šaljem link i prolaznu frazu zajedno?",
          answer:
            "Ne. Slanje oba dela u istoj poruci poništava deljenje preko razdvojenih kanala. Pošaljite prolaznu frazu drugim medijumom—poželjno Signalom ili Threemom, ili telefonskim pozivom.",
        },
        {
          question: "Da li treba da koristim menadžer lozinki ili jednokratni link?",
          answer:
            "Koristite menadžer lozinki za dugoročni deljeni pristup. Koristite jednokratni link šifrovan u pretraživaču kada treba da saopštite lozinku samo jednom.",
        },
        {
          question: "Da li mi i dalje treba menadžer lozinki?",
          answer:
            "Da. Menadžeri lozinki ostaju pravo mesto za čuvanje i upravljanje kredencijalima koje zadržavate. Jednokratni šifrovani linkovi ih dopunjuju za kontrolisane, privremene predaje.",
        },
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "Bezbedno deljenje lozinki ne mora da bude usko grlo za vaš tok rada. Zahteva samo malu promenu navike: prestanite da ostavljate osetljive podatke da trajno leže u logovima četa i istorijama sandučeta.",
        "Korišćenjem lokalnog šifrovanja u pretraživaču i samouništavajućih linkova smanjujete organizacioni bezbednosni i rizik usklađenosti, dok predaje ostaju brze i praktične.",
        "Sledeći put kada treba da podelite lozinku, izbegavajte kopiranje i lepljenje u Microsoft Teams, WhatsApp ili e-poštu. Napravite šifrovanu jednokratnu belešku, pošaljite link umesto lozinke i pustite belešku da istekne nakon što je odslužila svrhu.",
      ],
    },
  ],
  ctaTitle: "Spremni da delite bezbedno?",
  ctaBody:
    "Napravite privatnu belešku na PrivateNote.ai da šifrujete kredencijale u pretraživaču pre uploada. Beleške mogu da isteknu automatski ili nakon čitanja, opcionalna zaštita prolaznom frazom dodaje još jedan sloj, a šifrovani podaci beleške obrađuju se pod EU jurisdikcijom.",
  ctaButton: "Napravi privatnu belešku",
};
