import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountHr: SecretMessageArticleCopy = {
  intro: [
    "Ponekad trebate podijeliti nešto povjerljivo—[lozinku](app:password-generator), kod za oporavak, Wi-Fi lozinku, privatnu bilješku ili osobnu poruku—ali otvaranje računa samo da biste poslali jednu poruku djeluje nepotrebno.",
    "Dobra vijest je da to nije potrebno.",
    "Moderna [enkripcija u pregledniku](blog:encrypted-vs-secure-file-sharing) omogućuje sigurno slanje tajne poruke **bez registracije**, instalacije softvera ili povjerenja usluzi vašim čistim tekstom.",
  ],
  sections: [
    {
      title: "Zašto izbjegavati otvaranje računa?",
      paragraphs: [
        "Otvaranje računa ostavlja više informacija nego što mnogi shvaćaju. Tipična usluga može pohraniti vašu e-mail adresu, [korisničko ime](https://passwords.lu/en/blog/username-privacy-identity), povijest prijava, podatke o uređaju, IP adrese i metapodatke o aktivnosti.",
        "Za dugotrajnu suradnju to može biti sasvim razumno. Za dijeljenje jedne povjerljive poruke obično nije.",
        'Ako je vaš cilj jednostavno „Želim da ova osoba pročita poruku jednom", račun često dodaje složenost bez poboljšanja sigurnosti. Za taj obrazac [jednokratne tajne poveznice](blog:one-time-secret-links) obično su bolji izbor.',
      ],
    },
    {
      title: "Enkriptirajte prije slanja",
      paragraphs: [
        "Važno pitanje nije koristi li web stranica HTTPS. Gotovo svaka web stranica danas koristi HTTPS (TLS), koji štiti podatke dok putuju internetom. Naš vodič o [enkriptiranom naspram sigurnog dijeljenja datoteka](blog:encrypted-vs-secure-file-sharing) objašnjava zašto transportna enkripcija sama po sebi nije ista stvar kao end-to-end privatnost.",
        "Važnije pitanje je: **tko može pročitati vašu poruku nakon što stigne na poslužitelj?**",
      ],
    },
    {
      title: "Tradicionalne web usluge",
      paragraphs: [
        "Mnoge platforme za poruke šalju poruku preko enkriptirane veze (HTTPS/TLS). Kad poruka stigne na njihove poslužitelje, tehnički joj mogu pristupiti prije pohrane ili obrade.",
        "Ovisno o usluzi, poruka se može skenirati radi spama ili zlouporabe, indeksirati za pretraživanje, obrađivati u oblaku, zadržati u sigurnosnim kopijama ili učiniti dostupnom administratorima.",
        "TLS štiti vezu između preglednika i usluge. **Ne** sprječava nužno samu uslugu da pročita vašu poruku.",
      ],
    },
    {
      title: "Enkripcija u pregledniku",
      paragraphs: ["Privatniji pristup je enkriptirati poruku unutar preglednika prije uploada."],
      beforeFlowSteps: "U ovom modelu:",
      flowSteps: [
        {
          title: "Napišite poruku",
          body: "Sastavite tajnu u pregledniku—ništa se još ne šalje. Ili koristite Private AI i [Pišite s Private AI](app:home) da nacrtate sadržaj na uređaju prije enkripcije.",
        },
        {
          title: "Generirajte jedinstveni ključ lokalno",
          body: "Preglednik stvara ključ za enkripciju na vašem uređaju.",
        },
        {
          title: "Enkriptirajte prije uploada",
          body: "Poruka se enkriptira lokalno. Na poslužitelj se uploada samo šifrirani tekst.",
        },
        {
          title: "Podijelite ključ u poveznici",
          body: "Ključ za dešifriranje ostaje kod vas i dijeli se kao dio sigurne poveznice—obično u [URL fragmentu](blog:one-time-secret-links), koji preglednici ne šalju web poslužiteljima.",
        },
      ],
      afterFlowSteps: [
        "Usluga pohranjuje samo enkriptirane podatke i djeluje kao relej. Bez ključa za dešifriranje šifrirani tekst je praktički beskoristan.",
        "Isti princip vrijedi za datoteke. [Siguran prijenos datoteka](app:secure-file-transfer) enkriptira dokumente i arhive u pregledniku prije uploada. Primatelji mogu otvoriti poveznicu bez računa, ali slanje zahtijeva prijavu na besplatni PrivateNote račun.",
      ],
    },
    {
      title: "Zašto to znači da račun nije potreban",
      paragraphs: [
        "Kad usluga nikad ne mora pročitati vašu poruku, malo je razloga da zna tko ste. Zato usluge dijeljenja bilješki enkriptiranih u pregledniku često rade bez registracije—pogledajte [kako jednokratne tajne poveznice rade](blog:one-time-secret-links) za cijeli tijek.",
        "Umjesto otvaranja računa jednostavno napišete poruku, generirate sigurnu poveznicu i pošaljete je primatelju. Bez korisničkih imena. Bez lozinki za pamćenje. Bez pretinca punog e-mailova za verifikaciju.",
      ],
    },
    {
      title: "Dodajte još jedan sloj lozinkom",
      paragraphs: [
        "Za visoko osjetljive informacije možete zaštititi enkriptiranu poruku dodatnom lozinkom.",
        "Uobičajen pristup je poslati enkriptiranu poveznicu jednim kanalom, a lozinku drugim—telefonskim pozivom, SMS-om ili aplikacijom za poruke. Napadaču bi trebala oba dijela da dešifrira poruku.",
      ],
    },
    {
      title: "Poruke koje automatski nestaju",
      paragraphs: [
        "Povjerljive informacije obično ne bi trebale ostati online zauvijek. Mnoge sigurne usluge bilješki dopuštaju da se poruke [brišu ili uništavaju nakon prvog čitanja](blog:one-time-secret-links), isteknu nakon odabranog vremena ili se automatski obrišu.",
        "To smanjuje količinu osjetljivih informacija dostupnih online—slično kao što su [poslovni tekstovi i chat zapisi](blog:workplace-texts-private-note) loše mjesto za jednokratne tajne. Nijedna tehnologija ne može spriječiti primatelja da snimi zaslon ili kopira sadržaj nakon otvaranja, ali automatski istek značajno smanjuje dugoročnu izloženost.",
      ],
    },
    {
      title: "Kad koristiti anonimne tajne poruke?",
      paragraphs: ["Slanje enkriptiranih poruka bez otvaranja računa korisno je za dijeljenje:"],
      bullets: [
        "[Lozinki i kodova za oporavak](blog:how-we-generate-passwords) — ili koristite naš [generator lozinki](app:password-generator) prije dijeljenja",
        "[API ključeva](blog:privatenote-for-developers) i softverskih licencnih ključeva",
        "Privatnih poveznica i povjerljivih poslovnih bilješki",
        "Financijskih informacija i Wi-Fi lozinki",
        "Privremenih osobnih poruka koje ne bi trebale zauvijek živjeti u e-mailu ili povijesti chata",
      ],
    },
    {
      title: "Što tražiti u sigurnoj usluzi",
      paragraphs: ['Nisu sve usluge „privatnih poruka" ili „tajnih bilješki" jednake razine zaštite. Tražite usluge koje:'],
      bullets: [
        "Enkriptiraju poruke u pregledniku prije uploada",
        "Nikad ne primaju vaš čisti tekst",
        "Ne zahtijevaju račun",
        "Podržavaju automatski istek",
        "Opcionalno dopuštaju zaštitu lozinkom",
        "Koriste modernu autentificiranu enkripciju",
      ],
      callout:
        'Te dizajnerske odluke smanjuju količinu povjerenja koju morate imati u samu uslugu. Za širu sigurnosnu osnovu—uključujući lozinke, autentifikaciju i sigurno dijeljenje—pogledajte [Mit o „dovoljno dobroj" sigurnosti](blog:myth-good-enough-security).',
    },
    {
      title: "Kako PrivateNote odgovara tim načelima",
      paragraphs: [
        "PrivateNote je izgrađen upravo oko tih ideja. Kad stvorite bilješku, enkripcija se događa u cijelosti u pregledniku prije bilo kakvog uploada. Poslužitelj pohranjuje samo šifrirani tekst i djeluje isključivo kao relej između vas i primatelja—nikad ne prima čisti tekst vaše poruke.",
        "Zbog tog dizajna ne morate otvoriti račun da biste poslali privatnu bilješku. Jednostavno napišete poruku, generirate sigurnu poveznicu i podijelite je kanalom koji preferirate.",
        "Za dodatnu zaštitu možete zaštititi bilješku lozinkom, odabrati istek, omogućiti brisanje nakon prvog čitanja, priložiti enkriptirane datoteke i opcionalno primati obavijesti o dostavi koje govore kad je bilješka otvorena ili istekla—bez otkrivanja sadržaja poruke.",
        "Cilj je jednostavan: učiniti slanje povjerljivih informacija jednako lakim kao dijeljenje poveznice, uz minimiziranje povjerenja koje morate imati u uslugu.",
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "Slanje tajne poruke ne bi trebalo zahtijevati otvaranje još jednog računa niti davanje nepotrebnih osobnih podataka.",
        "Enkripcija u pregledniku omogućuje enkriptiranje poruke prije nego što napusti uređaj, pa usluga pohranjuje samo šifrirani tekst, a ne stvarnu poruku. U kombinaciji s [poveznicama s istekom](blog:one-time-secret-links) i opcionalnom zaštitom lozinkom, to pruža jednostavan i praktičan način dijeljenja povjerljivih informacija.",
        "Bilo da šaljete lozinku, kod za oporavak ili osobnu bilješku, odabir usluge koja enkriptira podatke u pregledniku i ne zahtijeva račun daje veću privatnost s manje trenja.",
      ],
    },
  ],
  closingTitle: "Isprobajte bez registracije",
  closingBody: [
    "PrivateNote je dizajniran oko tih načela—sigurno dijeljenje poruka jednostavno kao stvaranje poveznice i slanje namijenjenom primatelju.",
  ],
  fileSharingNote:
    "PrivateNote također nudi [siguran prijenos datoteka](app:secure-file-transfer) za dijeljenje dokumenata i mapa s istim modelom enkripcije u pregledniku. Slanje zahtijeva besplatni račun; primatelji mogu otvoriti poveznicu bez registracije.",
  tagline: "Manje administracije računa. Manje metapodataka. Više kontrole nad time što ostaje online nakon predaje.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Detaljan pregled poveznica s brisanjem nakon čitanja, URL fragmenta i zašto kratkotrajnost pobjeđuje e-mail ili Slack za jednokratne tajne.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS naspram enkripcije u pregledniku—što svaki štiti i zašto poslužitelj i dalje može pročitati vaše podatke.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Kako stvoriti i podijeliti jake lozinke bez ponavljanja obrazaca ili ostavljanja u povijesti chata.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto pisani zapisi u e-mailu i poslovnom chatu stvaraju dugoročni rizik—i kad kratkotrajne bilješke bolje odgovaraju.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Praktična sigurnosna osnova: lozinke, autentifikacija, poruke i obrasci sigurnog dijeljenja.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Podijelite API ključeve i vjerodajnice iz editora bez lijepljenja tajni u Slack ili tikete.",
    },
  ],
};
