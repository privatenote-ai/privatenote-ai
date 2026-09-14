import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativeSr: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternativa Privnote-u",
  eyebrow: "Alternativa Privnote-u",
  heroTitleLine1: "Privatna alternativa Privnote-u",
  heroTitleLine2: "za poruke, lozinke i datoteke",
  heroBody:
    "PrivateNote zadržava jednostavnost poruke koja nestaje i dodaje šifrovano deljenje datoteka, zaštitu lozinkom, kontrole za primaoca i alate za predaju osetljivih informacija.",
  primaryCta: "Napravite privatnu poruku",
  secondaryCta: "Kako to radi",
  trustLine: "Bez naloga za tekstualne poruke · Šifrovanje u pregledaču · Jednokratno čitanje",

  introHeading: "Ako već poznajete Privnote",
  introBody:
    "Ako tražite alternativu Privnote-u, PrivateNote prati istu ideju: napravite privatni link, podelite ga i neka sadržaj istekne ili nestane posle otvaranja. Šifrovanje se dešava u pregledaču pre otpremanja. Primalac otvara link i dešifruje lokalno. Ne treba nalog.",
  introBody2:
    "PrivateNote taj tok proširuje izvan kratke tekstualne poruke. Možete da delite lozinke, dokumente, fotografije, glasovne ili video snimke i druge datoteke u istoj šifrovanoj predaji, s dodatnim kontrolama kad situacija to traži.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Obe usluge su osmišljene za privremeno deljenje. PrivateNote ideju proširuje na datoteke, medije, kontrole primaoca i poslovne tokove.",
  compareFeatureColumn: "Funkcija",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Da",
  compareNo: "Nije ponuđeno",
  comparePaid: "Starter i Business",
  compareRows: [
    { feature: "Samouništavajuće poruke", privnote: "yes", privatenote: "yes" },
    { feature: "Primalac ne treba nalog", privnote: "yes", privatenote: "yes" },
    { feature: "Zaštita lozinkom", privnote: "yes", privatenote: "yes" },
    { feature: "Šifrovani prilozi", privnote: "no", privatenote: "yes" },
    { feature: "Više datoteka u jednom linku", privnote: "no", privatenote: "yes" },
    { feature: "Fotografije, audio i video", privnote: "no", privatenote: "yes" },
    { feature: "Obaveštenja o otvaranju i uništenju", privnote: "yes", privatenote: "yes" },
    { feature: "Verifikacija primaoca", privnote: "no", privatenote: "paid" },
    { feature: "Zakazano otkrivanje", privnote: "no", privatenote: "paid" },
    {
      feature: "Vizuelni identitet na stranici otvaranja",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Alati za programere (CLI, MCP, proširenja)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Funkcije mogu da se menjaju. Poređenje se zasniva na javno dostupnim informacijama o proizvodu u septembru 2026.",
  compareCta: "Isprobajte PrivateNote",

  whyHeading: "Zašto tražiti alternativu Privnote-u?",
  whyBody:
    "Privnote dobro radi kad je zahtev jednostavan: poslati privremenu tekstualnu poruku. Privremeni tekst samo je jedan način na koji osetljive informacije putuju među ljudima.",
  whyBody2:
    "Možda trebate da pošaljete PDF, podelite više datoteka, potvrdite da je link otvoren, zaštitite pristup lozinkom ili predate poverljive dokumente bez da ostanu u običnom imejlu.",
  whyClose:
    "To je problem za koji je PrivateNote osmišljen: bezbedna predaja, a ne samo poruka koja nestaje.",

  passwordHeading: "Alternativa Privnote-u za deljenje lozinki",
  passwordBody:
    "Wi-Fi lozinke, API ključevi i kodovi za oporavak često putuju u istom imejlu ili četu koji objašnjava čemu služe. To može da ostavi kopije u istoriji, sinhronizovanim uređajima i rezervnim kopijama.",
  passwordBody2:
    "PrivateNote stavlja podatke za prijavu iza zasebnog šifrovanog linka. Kontekst šaljete kanalom koji već koristite, a tajnu u privremenoj poruci koja može da istekne, nestane posle čitanja i po želji zahteva lozinku. To je predaja, a ne menadžer lozinki.",
  passwordCta: "Bezbedno podelite lozinku",
  passwordArticleLink: "Kako bezbedno podeliti lozinku",

  filesHeading: "Šaljite datoteke, ne samo tekst",
  filesBody:
    "Ugovori, lični dokumenti, finansijski PDF-ovi, konfiguracione datoteke, fotografije i arhive često su stvarni sadržaj. Poruka koja nestaje ne može da ih ponese. PrivateNote drži poruku i šifrovane priloge u istoj bezbednoj predaji, tako da poruka i datoteke putuju zajedno.",
  filesBody2:
    "Slanje datoteka zahteva besplatni PrivateNote nalog da bi se mogla primeniti ograničenja skladišta i prenosa. Primalac i dalje otvara link bez prijave. Posle prvog otvaranja prilozi ostaju dostupni ograničeno vreme — nije trajno deljeni folder.",
  filesLimits:
    "Trenutna ograničenja: Free do {freeSize} po datoteci i {freeCount} datoteka po prenosu ({freeTransfers} prenosa mesečno). Starter do {starterSize} i {starterCount} datoteka. Business do {businessSize} i {businessCount} datoteka.",
  filesCta: "Pošaljite šifrovanu datoteku",
  filesArticleLink: "Bezbedno slanje poverljivih dokumenata",

  mediaHeading: "Delite osetljive fotografije, audio i video",
  mediaBody:
    "Neke informacije nikad ne počinju kao datoteka na disku. Možda trebate da snimite dokument kamerom, snimite kratku glasovnu poruku ili priložite postojeću fotografiju bez da je prvo pošaljete kroz drugi mesendžer.",
  mediaBody2:
    "PrivateNote može da snimi fotografiju, audio ili video ili da priloži postojeće medije. Snimanje se dešava u pregledaču, zatim se pre otpremanja primenjuje isto šifrovanje na strani klijenta kao i za datoteke.",
  mediaPhotoLink: "Kako bezbedno deliti fotografije",
  mediaVoiceLink: "Šifrovane glasovne poruke",

  businessHeading: "Kad poruka koja nestaje postane poslovni tok",
  businessBody:
    "Isti privatni link koristan je kad pošiljalac računovođa, IT administrator, konsultant ili kancelarija predaje poverljive datoteke klijentu. Potreba nije samo tajnost. To su potvrda, kontrola i profesionalna predaja.",
  businessScenarios: [
    "Računovođa šalje poverljive brojke klijentu.",
    "IT administrator šalje podatke za prijavu zaposlenom.",
    "Kancelarija šalje lične ili finansijske dokumente klijentu.",
    "Konsultant predaje projektne datoteke koje ne bi trebalo da ostanu u imejlu.",
    "Kompanija treba da zna da se pristupilo osetljivim informacijama.",
  ],
  businessBody2:
    "Starter i Business dodaju verifikaciju primaoca, zakazano otkrivanje, dokaz pristupa, duže prozore pristupa, opoziv neotvorenih poruka i pregled poslatih poruka. Business dodaje stranice otvaranja u vašem vizuelnom identitetu, pristup datotekama samo za pregled i veće prenose. Šifrovanje ostaje u pregledaču na svakom planu.",
  businessCta: "Upoznajte PrivateNote Business",
  businessNotifyLink: "Znajte kada je tajni link otvoren",
  businessVerifyLink: "Verifikacija primaoca",

  securityHeading: "Kako PrivateNote štiti vaš sadržaj",
  securityBody:
    "Osetljiv sadržaj se šifruje u pregledaču pre otpremanja. Infrastruktura PrivateNote-a čuva šifrovani tekst, a ne otvorenu poruku ili datoteku.",
  securityArchitecture:
    "Za standardnu poruku pregledač stvara slučajni 256-bitni ključ za šifrovanje i koristi autentifikovano šifrovanje AES-256-GCM. Ključ za dešifrovanje nosi se u fragmentu URL-a — delu posle #. Pregledači fragment ne uključuju u uobičajene HTTP zahteve, pa server ne prima ključ kao deo URL-a zahteva.",
  securityRecipient:
    "Pregledač primaoca koristi ključ iz deljenog linka da lokalno dešifruje sadržaj.",
  securityLimitation:
    "Ko kasnije ima ceo link, i dalje može da kopira ili snimi ono što vidi. PrivateNote upravlja predajom, ne onim što primalac uradi posle otvaranja.",
  securityFlowWrite: "Napišite / priložite",
  securityFlowEncrypt: "Šifrujte u pregledaču",
  securityFlowCiphertext: "Otpremite šifrovani tekst",
  securityFlowShare: "Podelite privatni link",
  securityFlowDecrypt: "Primalac dešifruje",
  securityEncryptionLink: "Kako radi šifrovanje PrivateNote-a",
  securityHowItWorksLink: "Kako to radi u detaljima",
  founderHeading: "Građeno s kriptografijom na umu",
  founderBody:
    "PrivateNote razvija Marjan Skrobot, istraživač kriptografije i informacione bezbednosti. Model bezbednosti i njegova ograničenja javno su dokumentovani, uključujući ono od čega PrivateNote može — i ne može — da zaštiti.",
  founderLink: "O modelu bezbednosti",

  decideHeading: "Šta biste trebali da koristite?",
  decidePrivnoteTitle: "Privnote može da bude dovoljan ako…",
  decidePrivnoteItems: [
    "Trebate samo da pošaljete privremenu tekstualnu poruku.",
    "Želite najjednostavniji mogući tok.",
    "Ne trebate priloge ni dodatne kontrole predaje.",
  ],
  decidePrivateNoteTitle: "PrivateNote može bolje da odgovara ako…",
  decidePrivateNoteItems: [
    "Želite dokumentovano šifrovanje na strani klijenta.",
    "Trebate da delite datoteke ili medije uz tekst.",
    "Trebate verifikaciju primaoca ili zakazano otkrivanje.",
    "Želite obaveštenja o pristupu ili dokaz pristupa.",
    "Trebate profesionalni vizuelni identitet ili poslovne kontrole predaje.",
  ],
  decideOneTimeLink: "Kako funkcionišu tajni jednokratni linkovi",
  decideDevelopersLink: "Integracije programera",

  faqHeading: "Česta pitanja",
  faqs: [
    {
      question: "Koje su alternative Privnote-u?",
      answer:
        "Nekoliko usluga nudi privremeno ili šifrovano deljenje poruka. PrivateNote je osmišljen za one koji žele tok poruke koja nestaje, ali trebaju i šifrovane datoteke, medije, kontrole primaoca ili poslovnu predaju.",
    },
    {
      question: "Po čemu se PrivateNote razlikuje od Privnote-a?",
      answer:
        "Obe stvaraju privremeni privatni link koji primalac može da otvori bez naloga. PrivateNote dodaje šifrovane priloge, snimanje fotografije i zvuka u pregledaču, opcionu zaštitu lozinkom u istom toku i plaćene kontrole poput verifikacije primaoca i stranica otvaranja u vašem vizuelnom identitetu. Privnote se usredsređuje na samouništavajuće tekstualne poruke.",
    },
    {
      question: "Mogu li da koristim PrivateNote bez naloga?",
      answer:
        "Da. Osnovnu šifrovanu tekstualnu poruku možete da napravite bez prijave. Primalac nikad ne treba nalog. Slanje datoteka, fotografija ili snimaka zahteva besplatni nalog da bi se mogla primeniti ograničenja skladišta i mesečnih prenosa.",
    },
    {
      question: "Mogu li da šaljem datoteke s PrivateNote-om?",
      answer:
        "Da. Priložite jednu ili više datoteka istoj šifrovanoj poruci. Datoteke se šifruju u pregledaču pre otpremanja. Slanje zahteva besplatni nalog; otvaranje linka ne. Primalac može da preuzme priloge u ograničenom vremenu posle otvaranja.",
    },
    {
      question: "Mogu li da delim lozinke s PrivateNote-om?",
      answer:
        "Da. Stavite lozinku u poruku i pošaljite šifrovani link umesto same lozinke. Možete da dodate zasebnu lozinku i držite rok kratkim. Posle korišćenja važnih podataka za prijavu, rotirajte ih. Privatna poruka je predaja, a ne menadžer lozinki.",
    },
    {
      question: "Kako PrivateNote šifruje poruke?",
      answer:
        "Pregledač stvara slučajni 256-bitni ključ i šifruje poruku s AES-256-GCM pre otpremanja. Ključ se nosi u fragmentu URL-a — delu posle # — koji pregledači ne šalju u uobičajenom HTTP zahtevu. Poruke zaštićene lozinkom umotavaju taj ključ s Argon2id. Prilozi se takođe šifruju u pregledaču.",
    },
    {
      question: "Treba li primalac PrivateNote nalog?",
      answer:
        "Ne. Primalac otvara link u pregledaču i dešifruje sadržaj lokalno. Ne prijavljuje se. Ko ima ceo link, i lozinku ako ste je postavili, može da otvori poruku.",
    },
  ],

  finalHeading: "Podelite nešto privatno.",
  finalBody: "Napravite šifrovanu poruku ili predaju datoteke i pošaljite link primaocu.",
  finalPrimaryCta: "Napravite privatnu poruku",
  finalSecondaryCta: "Pogledajte cene",
  finalTrust: "Za početak nije potreban nalog.",
};
