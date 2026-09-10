import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkSr: OneTimeLinkCopy = {
  heroTitle: "Napravite jednokratni link",
  heroSubtitle:
    "Delite lozinke, poruke i datoteke preko šifrovanog linka · Šifrovano u pregledaču · Primalac ne treba nalog",
  whatHeading: "Šta je jednokratni link?",
  whatBody:
    "Jednokratni link je bezbedniji način da predate informacije koje ne bi trebalo da ostanu neodređeno dostupne u uobičajenim kanalima komunikacije. Lozinku, API ključ, kod za oporavak, privatnu poruku, osetljiv dokument ili privremene podatke za prijavu stavite iza šifrovanog URL-a. Primalac otvara link da bi sadržaj preuzeo i dešifrovao u pregledaču. PrivateNote šifruje sadržaj u pregledaču pre otpremanja, pa server prima šifrovane podatke, a ne otvoreni tekst. Vi birate koliko dugo neotvoreni link ostaje dostupan i koliko puta može da se otvori. To je bezbedna predaja, a ne mesto za trajno čuvanje tajni.",
  whatLearnMore: "Kako funkcionišu tajni jednokratni linkovi",
  stepsHeading: "Kako napraviti jednokratni link",
  step1Title: "Dodajte sadržaj",
  step1Body: "Unesite privatnu poruku, lozinku ili priložite datoteku.",
  step2Title: "Podesite pristup",
  step2Body: "Izaberite rok važenja, koliko puta link može da se otvori i, po želji, zaštitu lozinkom.",
  step3Title: "Pošaljite link",
  step3Body: "PrivateNote šifruje sadržaj u pregledaču i vraća link koji šaljete kanalom koji već koristite.",
  useHeading: "Šta možete da podelite sa PrivateNote-om",
  usePasswordsTitle: "Lozinke i podaci za prijavu",
  usePasswordsBody:
    "Delite lozinke i privremene podatke za prijavu bez toga da otvoreni tekst ostane trajno u imejlu ili četu.",
  usePasswordsLink: "Kako bezbedno podeliti lozinku",
  useApiTitle: "API ključevi",
  useApiBody:
    "Delite API ključeve, tokene i webhook tajne bez toga da ostanu u istoriji četa ili u tiketima.",
  useApiLink: "Kako bezbedno podeliti API ključ",
  useMessagesTitle: "Privatne poruke",
  useMessagesBody:
    "Za informacije koje posle čitanja ne bi trebalo da ostanu neodređeno pretražive u imejlu ili četu.",
  useMessagesLink: "Pošaljite tajnu poruku bez naloga",
  useFilesTitle: "Datoteke i dokumenti",
  useFilesBody:
    "Za osetljive datoteke kada želite šifrovanu predaju i kontrolisanu dostupnost, a ne trajno deljeni folder.",
  useFilesLink: "Bezbedan prenos datoteka",
  persistHeading: "Zašto koristiti jednokratni link?",
  persistBody:
    "Slanje lozinke imejlom, Slackom, Teamsom, SMS-om ili drugom uslugom za poruke može ostaviti kopiju u istoriji, sinhronizovanim uređajima, rezervnim kopijama, obaveštenjima i pretraživim arhivama. Šifrovanje štiti prenos. Istek smanjuje koliko dugo original ostaje dostupan.",
  handoffHeading: "Napravljeno za bezbednu predaju",
  handoffBody:
    "PrivateNote šifruje poruke i datoteke u pregledaču pre otpremanja. Server prima šifrovane podatke, a ne čitljiv sadržaj. Dešifrovanje se dešava u pregledaču primaoca.",
  handoffEncryptionLink: "Kako funkcioniše šifrovanje",
  handoffHowItWorksLink: "PrivateNote u detalje",
  limitsHeading: "Šta jednokratni link ne može da spreči",
  limitsBody:
    "Posle otvaranja ovlašćena osoba i dalje može da kopira, sačuva ili fotografiše informacije. PrivateNote štiti predaju i ograničava koliko dugo originalni link ostaje dostupan. Već sačuvane kopije ne briše.",
  faqHeading: "Često postavljana pitanja",
  faqs: [
    {
      question: "Šta je jednokratni link?",
      answer:
        "Jednokratni link služi za privremeno deljenje poverljivih informacija. Umesto da lozinku, poruku ili datoteku šaljete direktno imejlom ili četom, delite šifrovani link sa ograničenim vekom i pristupom. PrivateNote šifruje sadržaj u pregledaču kako originalna tajna ne bi neodređeno ostala u istoriji razgovora.",
    },
    {
      question: "Kako da napravim jednokratni link?",
      answer:
        "Koristite formular na vrhu ove stranice. Dodajte poruku, lozinku ili datoteku, izaberite koliko dugo neotvoreni link treba da ostane dostupan i koliko puta može da se otvori, pa ga napravite. PrivateNote šifruje sadržaj u pregledaču i vraća URL koji šaljete kanalom koji već koristite.",
    },
    {
      question: "Mogu li jednokratnim linkom da pošaljem lozinku?",
      answer:
        "Da. Stavite lozinku u poruku i pošaljite šifrovani link umesto same lozinke. Možete da dodate i posebnu lozinku za dodatnu zaštitu. Za važne naloge promenite podatke za prijavu posle toga što ih primalac upotrebi. Jednokratni link je predaja, a ne menadžer lozinki.",
    },
    {
      question: "Mogu li jednokratnim linkom da pošaljem datoteku?",
      answer:
        "Da. Priložite datoteku ili folder istoj šifrovanoj poruci. Datoteke se šifruju u pregledaču pre otpremanja. Slanje priloga zahteva besplatan PrivateNote nalog da bi se mogla primeniti ograničenja skladišta. Primalac i dalje ne treba nalog da otvori link.",
    },
    {
      question: "Da li primalac treba PrivateNote nalog?",
      answer:
        "Ne. Primalac otvara link u pregledaču i dešifruje sadržaj lokalno. Ne mora da se prijavi. Osnovnu tekstualnu poruku možete da napravite i bez naloga. Slanje datoteka zahteva besplatan nalog zbog sprečavanja zloupotrebe i ograničenja skladišta.",
    },
    {
      question: "Šta se desi nakon što neko otvori link?",
      answer:
        "Pregledač primaoca dešifruje sadržaj lokalno. Besplatne poruke se čitaju jednom: posle tog otvaranja originalna poruka se uništava. Starter može da dozvoli do tri otvaranja, a Business do deset. Ako niko ne otvori link, ističe posle veka koji ste podesili — najviše tri dana na besplatnom planu. Priložene datoteke ostaju vidljive ograničeno vreme posle prvog otvaranja.",
    },
    {
      question: "Može li neko da snimi ekran PrivateNote poruke?",
      answer:
        "Da. Ko vidi otkriveni sadržaj može da ga snimi, fotografiše ili kopira. PrivateNote ne tvrdi da to sprečava. Kontroliše šifrovani prenos i koliko dugo originalni link ostaje dostupan.",
    },
    {
      question: "Koliko dugo PrivateNote link može da ostane aktivan?",
      answer:
        "Ako se poruka nikad ne otvori, besplatni linkovi ističu najkasnije za tri dana. Starter dozvoljava do 15 dana, a Business do 30. Posle otvaranja besplatne poruke se čitaju jednom. Starter može da dozvoli do tri otvaranja, a Business do deset. Izaberite najkraći vek koji primaocu još omogućuje da završi predaju.",
    },
  ],
  articleLearnMore: "Saznajte više o tome kako jednokratni linkovi funkcionišu i kako ostaju bezbedni",
  backToCreate: "Spremni? Napravite jednokratni link ↑",
};
