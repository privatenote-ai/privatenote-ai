import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkHr: OneTimeLinkCopy = {
  heroTitle: "Stvorite jednokratnu poveznicu",
  heroSubtitle:
    "Podijelite lozinke, poruke i datoteke putem šifrirane poveznice · Šifrirano u pregledniku · Primatelj ne treba račun",
  whatHeading: "Što je jednokratna poveznica?",
  whatBody:
    "Jednokratna poveznica sigurniji je način predaje informacija koje ne bi trebale ostati neodređeno dostupne u uobičajenim kanalima komunikacije. Lozinku, API ključ, kod za oporavak, privatnu poruku, osjetljiv dokument ili privremene vjerodajnice stavite iza šifriranog URL-a. Primatelj otvara poveznicu kako bi sadržaj dohvatio i dešifrirao u pregledniku. PrivateNote šifrira sadržaj u pregledniku prije prijenosa, pa poslužitelj prima šifrirane podatke, a ne otvoreni tekst. Vi određujete koliko dugo neotvorena poveznica ostaje dostupna i koliko se puta može otvoriti. To je sigurna predaja, a ne mjesto za trajno čuvanje tajni.",
  whatLearnMore: "Kako funkcioniraju tajne jednokratne poveznice",
  stepsHeading: "Kako stvoriti jednokratnu poveznicu",
  step1Title: "Dodajte sadržaj",
  step1Body: "Unesite privatnu poruku, lozinku ili priložite datoteku.",
  step2Title: "Postavite pristup",
  step2Body: "Odaberite rok važenja, koliko se puta poveznica može otvoriti i, po želji, zaštitu lozinkom.",
  step3Title: "Pošaljite poveznicu",
  step3Body: "PrivateNote šifrira sadržaj u pregledniku i vraća poveznicu koju šaljete kanalom koji već koristite.",
  useHeading: "Što možete podijeliti s PrivateNoteom",
  usePasswordsTitle: "Lozinke i vjerodajnice",
  usePasswordsBody:
    "Podijelite lozinke i privremene vjerodajnice bez toga da otvoreni tekst ostane trajno u e-pošti ili chatu.",
  usePasswordsLink: "Kako sigurno podijeliti lozinku",
  useApiTitle: "API ključevi",
  useApiBody:
    "Podijelite API ključeve, tokene i webhook tajne bez toga da ostanu u povijesti chata ili u tiketima.",
  useApiLink: "Kako sigurno podijeliti API ključ",
  useMessagesTitle: "Privatne poruke",
  useMessagesBody:
    "Za informacije koje nakon čitanja ne bi trebale ostati neodređeno pretražive u e-pošti ili chatu.",
  useMessagesLink: "Pošaljite tajnu poruku bez računa",
  useFilesTitle: "Datoteke i dokumenti",
  useFilesBody:
    "Za osjetljive datoteke kada trebate šifriranu predaju i kontroliranu dostupnost, a ne trajno dijeljenu mapu.",
  useFilesLink: "Siguran prijenos datoteka",
  persistHeading: "Zašto koristiti jednokratnu poveznicu?",
  persistBody:
    "Slanje lozinke e-poštom, Slackom, Teamsom, SMS-om ili drugim uslugama slanja poruka može ostaviti kopiju u povijesti, sinkroniziranim uređajima, sigurnosnim kopijama, obavijestima i pretraživim arhivama. Šifriranje štiti prijenos. Istek smanjuje koliko dugo original ostaje dostupan.",
  handoffHeading: "Napravljeno za sigurnu predaju",
  handoffBody:
    "PrivateNote šifrira poruke i datoteke u pregledniku prije prijenosa. Poslužitelj prima šifrirane podatke, a ne čitljiv sadržaj. Dešifriranje se događa u pregledniku primatelja.",
  handoffEncryptionLink: "Kako funkcionira šifriranje",
  handoffHowItWorksLink: "PrivateNote u detalje",
  limitsHeading: "Što jednokratna poveznica ne može spriječiti",
  limitsBody:
    "Nakon otvaranja ovlaštena osoba i dalje može kopirati, spremiti ili fotografirati informacije. PrivateNote štiti predaju i ograničava koliko dugo originalna poveznica ostaje dostupna. Već spremljene kopije ne briše.",
  faqHeading: "Često postavljana pitanja",
  faqs: [
    {
      question: "Što je jednokratna poveznica?",
      answer:
        "Jednokratna poveznica služi za privremeno dijeljenje povjerljivih informacija. Umjesto da lozinku, poruku ili datoteku šaljete izravno e-poštom ili chatom, dijelite šifriranu poveznicu s ograničenim vijekom i pristupom. PrivateNote šifrira sadržaj u pregledniku kako originalna tajna ne bi neodređeno ostala u povijesti razgovora.",
    },
    {
      question: "Kako stvoriti jednokratnu poveznicu?",
      answer:
        "Upotrijebite obrazac na vrhu ove stranice. Dodajte poruku, lozinku ili datoteku, odaberite koliko dugo neotvorena poveznica ostaje dostupna i koliko se puta može otvoriti, zatim je stvorite. PrivateNote šifrira sadržaj u pregledniku i vraća URL koji šaljete kanalom koji već koristite.",
    },
    {
      question: "Mogu li jednokratnom poveznicom poslati lozinku?",
      answer:
        "Da. Stavite lozinku u bilješku i pošaljite šifriranu poveznicu umjesto same lozinke. Možete dodati i zasebnu lozinku za dodatnu zaštitu. Za važne račune zamijenite vjerodajnicu nakon što je primatelj upotrijebi. Jednokratna poveznica je predaja, a ne upravitelj lozinki.",
    },
    {
      question: "Mogu li jednokratnom poveznicom poslati datoteku?",
      answer:
        "Da. Priložite datoteku ili mapu istoj šifriranoj bilješci. Datoteke se šifriraju u pregledniku prije prijenosa. Slanje privitaka zahtijeva besplatni PrivateNote račun kako bi se mogla primijeniti ograničenja pohrane. Primatelj i dalje ne treba račun za otvaranje poveznice.",
    },
    {
      question: "Treba li primatelj PrivateNote račun?",
      answer:
        "Ne. Primatelj otvara poveznicu u pregledniku i dešifrira sadržaj lokalno. Ne treba se prijaviti. Osnovnu tekstualnu bilješku možete stvoriti i bez računa. Slanje datoteka zahtijeva besplatni račun zbog sprječavanja zlouporabe i ograničenja pohrane.",
    },
    {
      question: "Što se dogodi nakon što netko otvori poveznicu?",
      answer:
        "Preglednik primatelja dešifrira sadržaj lokalno. Besplatne bilješke čitaju se jednom: nakon tog otvaranja originalna se bilješka uništava. Starter može dopustiti do tri otvaranja, a Business do deset. Ako nitko ne otvori poveznicu, istječe nakon vijeka koji ste postavili — najviše tri dana na besplatnom planu. Priložene datoteke ostaju vidljive ograničeno vrijeme nakon prvog otvaranja.",
    },
    {
      question: "Može li netko napraviti snimku zaslona PrivateNotea?",
      answer:
        "Da. Tko vidi otkriveni sadržaj može ga snimiti, fotografirati ili kopirati. PrivateNote ne tvrdi da to sprječava. Kontrolira šifrirani prijenos i koliko dugo originalna poveznica ostaje dostupna.",
    },
    {
      question: "Koliko dugo PrivateNote poveznica može ostati aktivna?",
      answer:
        "Ako se bilješka nikad ne otvori, besplatne poveznice istječu najkasnije za tri dana. Starter dopušta do 15 dana, a Business do 30. Nakon otvaranja besplatne se bilješke čitaju jednom. Starter može dopustiti do tri otvaranja, a Business do deset. Odaberite najkraći vijek koji primatelju još omogućuje da dovrši predaju.",
    },
  ],
  articleLearnMore: "Saznajte više o tome kako jednokratne poveznice funkcioniraju i kako ostaju sigurne",
  backToCreate: "Spremni? Stvorite jednokratnu poveznicu ↑",
};
