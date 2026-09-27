import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountSr: SecretMessageArticleCopy = {
  intro: [
    "Ponekad trebate podeliti nešto poverljivo—[lozinku](app:password-generator), kod za oporavak, Wi-Fi lozinku, privatnu belešku ili ličnu poruku—ali otvaranje naloga samo da biste poslali jednu poruku deluje nepotrebno.",
    "Dobra vest je da to nije potrebno.",
    "Moderna [enkripcija u pregledaču](blog:encrypted-vs-secure-file-sharing) omogućava sigurno slanje tajne poruke **bez registracije**, instalacije softvera ili poverenja usluzi vašim čistim tekstom.",
  ],
  sections: [
    {
      title: "Zašto izbegavati otvaranje naloga?",
      paragraphs: [
        "Otvaranje naloga ostavlja više informacija nego što mnogi shvataju. Tipična usluga može čuvati vašu e-mail adresu, [korisničko ime](https://passwords.lu/en/blog/username-privacy-identity), istoriju prijava, podatke o uređaju, IP adrese i metapodatke o aktivnosti.",
        "Za dugotrajnu saradnju to može biti sasvim razumno. Za deljenje jedne poverljive poruke obično nije.",
        'Ako je vaš cilj jednostavno „Želim da ova osoba pročita poruku jednom", nalog često dodaje složenost bez poboljšanja bezbednosti. Za taj obrazac [jednokratne tajne poveznice](blog:one-time-secret-links) obično su bolji izbor.',
      ],
    },
    {
      title: "Enkriptujte pre slanja",
      paragraphs: [
        "Važno pitanje nije da li veb stranica koristi HTTPS. Gotovo svaka veb stranica danas koristi HTTPS (TLS), koji štiti podatke dok putuju internetom. Naš vodič o [enkriptovanom naspram sigurnog deljenja fajlova](blog:encrypted-vs-secure-file-sharing) objašnjava zašto transportna enkripcija sama po sebi nije ista stvar kao end-to-end privatnost.",
        "Važnije pitanje je: **ko može pročitati vašu poruku nakon što stigne na server?**",
      ],
    },
    {
      title: "Tradicionalne veb usluge",
      paragraphs: [
        "Mnoge platforme za poruke šalju poruku preko enkriptovane veze (HTTPS/TLS). Kada poruka stigne na njihove servere, tehnički joj mogu pristupiti pre pohrane ili obrade.",
        "U zavisnosti od usluge, poruka se može skenirati radi spama ili zloupotrebe, indeksirati za pretragu, obrađivati u oblaku, zadržati u rezervnim kopijama ili učiniti dostupnom administratorima.",
        "TLS štiti vezu između pregledača i usluge. **Ne** sprečava nužno samu uslugu da pročita vašu poruku.",
      ],
    },
    {
      title: "Enkripcija u pregledaču",
      paragraphs: ["Privatniji pristup je enkriptovati poruku unutar pregledača pre uploada."],
      beforeFlowSteps: "U ovom modelu:",
      flowSteps: [
        {
          title: "Napišite poruku",
          body: "Sastavite tajnu u pregledaču—ništa se još ne šalje. Ili koristite Private AI i [Pišite sa Private AI](app:home) da nacrtate sadržaj na uređaju pre enkripcije.",
        },
        {
          title: "Generišite jedinstveni ključ lokalno",
          body: "Pregledač stvara ključ za enkripciju na vašem uređaju.",
        },
        {
          title: "Enkriptujte pre uploada",
          body: "Poruka se enkriptuje lokalno. Na server se uploaduje samo šifrovani tekst.",
        },
        {
          title: "Podelite ključ u linku",
          body: "Ključ za dešifrovanje ostaje kod vas i deli se kao deo sigurnog linka—obično u [URL fragmentu](blog:one-time-secret-links), koji pregledači ne šalju veb serverima.",
        },
      ],
      afterFlowSteps: [
        "Usluga čuva samo enkriptovane podatke i deluje kao relej. Bez ključa za dešifrovanje šifrovani tekst je praktično beskoristan.",
        "Isti princip važi za fajlove. [Siguran prenos fajlova](app:secure-file-transfer) enkriptuje dokumente i arhive u pregledaču pre uploada. Primaoci mogu otvoriti link bez naloga, ali slanje zahteva prijavu na besplatan PrivateNote nalog.",
      ],
    },
    {
      title: "Zašto to znači da nalog nije potreban",
      paragraphs: [
        "Kada usluga nikad ne mora pročitati vašu poruku, malo je razloga da zna ko ste. Zato usluge deljenja beleški enkriptovanih u pregledaču često rade bez registracije—pogledajte [kako jednokratne tajne poveznice rade](blog:one-time-secret-links) za ceo tok.",
        "Umesto otvaranja naloga jednostavno napišete poruku, generišete siguran link i pošaljete ga primaocu. Bez korisničkih imena. Bez lozinki za pamćenje. Bez sandučeta punog e-mailova za verifikaciju.",
      ],
    },
    {
      title: "Dodajte još jedan sloj lozinkom",
      paragraphs: [
        "Za visoko osetljive informacije možete zaštititi enkriptovanu poruku dodatnom lozinkom.",
        "Uobičajen pristup je poslati enkriptovani link jednim kanalom, a lozinku drugim—telefonskim pozivom, SMS-om ili aplikacijom za poruke. Napadaču bi trebala oba dela da dešifruje poruku.",
      ],
    },
    {
      title: "Poruke koje automatski nestaju",
      paragraphs: [
        "Poverljive informacije obično ne bi trebale ostati online zauvek. Mnoge sigurne usluge beleški dozvoljavaju da se poruke [brišu ili uništavaju nakon prvog čitanja](blog:one-time-secret-links), isteknu nakon izabranog vremena ili se automatski obrišu.",
        "To smanjuje količinu osetljivih informacija dostupnih online—slično kao što su [poslovni tekstovi i chat zapisi](blog:workplace-texts-private-note) loše mesto za jednokratne tajne. Nijedna tehnologija ne može sprečiti primaoca da snimi ekran ili kopira sadržaj nakon otvaranja, ali automatski istek značajno smanjuje dugoročnu izloženost.",
      ],
    },
    {
      title: "Kada koristiti anonimne tajne poruke?",
      paragraphs: ["Slanje enkriptovanih poruka bez otvaranja naloga korisno je za deljenje:"],
      bullets: [
        "[Lozinki i kodova za oporavak](blog:how-we-generate-passwords) — ili koristite naš [generator lozinki](app:password-generator) pre deljenja",
        "[API ključeva](blog:privatenote-for-developers) i softverskih licencnih ključeva",
        "Privatnih linkova i poverljivih poslovnih beleški",
        "Finansijskih informacija i Wi-Fi lozinki",
        "Privremenih ličnih poruka koje ne bi trebale zauvek živeti u e-mailu ili istoriji chata",
      ],
    },
    {
      title: "Šta tražiti u sigurnoj usluzi",
      paragraphs: ['Nisu sve usluge „privatnih poruka" ili „tajnih beleški" jednake stepena zaštite. Tražite usluge koje:'],
      bullets: [
        "Enkriptuju poruke u pregledaču pre uploada",
        "Nikad ne primaju vaš čist tekst",
        "Ne zahtevaju nalog",
        "Podržavaju automatski istek",
        "Opcionalno dozvoljavaju zaštitu lozinkom",
        "Koriste modernu autentifikovanu enkripciju",
      ],
      callout:
        'Te dizajnerske odluke smanjuju količinu poverenja koju morate imati u samu uslugu. Za širu bezbednosnu osnovu—uključujući lozinke, autentifikaciju i sigurno deljenje—pogledajte [Mit o „dovoljno dobroj" bezbednosti](blog:myth-good-enough-security).',
    },
    {
      title: "Kako PrivateNote odgovara tim načelima",
      paragraphs: [
        "PrivateNote je izgrađen upravo oko tih ideja. Kada stvorite belešku, enkripcija se dešava u celosti u pregledaču pre bilo kakvog uploada. Server čuva samo šifrovani tekst i deluje isključivo kao relej između vas i primaoca—nikad ne prima čist tekst vaše poruke.",
        "Zbog tog dizajna ne morate otvoriti nalog da biste poslali privatnu belešku. Jednostavno napišete poruku, generišete siguran link i podelite ga kanalom koji preferirate.",
        "Za dodatnu zaštitu možete zaštititi belešku lozinkom, odabrati istek, omogućiti brisanje nakon prvog čitanja, priložiti enkriptovane fajlove i opcionalno primati obaveštenja o dostavi koja govore kada je beleška otvorena ili istekla—bez otkrivanja sadržaja poruke.",
        "Cilj je jednostavan: učiniti slanje poverljivih informacija jednako lakim kao deljenje linka, uz minimiziranje poverenja koje morate imati u uslugu.",
      ],
    },
    {
      title: "Završne misli",
      paragraphs: [
        "Slanje tajne poruke ne bi trebalo zahtevati otvaranje još jednog naloga niti davanje nepotrebnih ličnih podataka.",
        "Enkripcija u pregledaču omogućava enkriptovanje poruke pre nego što napusti uređaj, pa usluga čuva samo šifrovani tekst, a ne stvarnu poruku. U kombinaciji sa [linkovima sa istekom](blog:one-time-secret-links) i opcionalnom zaštitom lozinkom, to pruža jednostavan i praktičan način deljenja poverljivih informacija.",
        "Bilo da šaljete lozinku, kod za oporavak ili ličnu belešku, izbor usluge koja enkriptuje podatke u pregledaču i ne zahteva nalog daje veću privatnost sa manje trenja.",
      ],
    },
  ],
  closingTitle: "Isprobajte bez registracije",
  closingBody: [
    "PrivateNote je dizajniran oko tih načela—sigurno deljenje poruka jednostavno kao stvaranje linka i slanje namenjenom primaocu.",
  ],
  fileSharingNote:
    "PrivateNote takođe nudi [siguran prenos fajlova](app:secure-file-transfer) za deljenje dokumenata i foldera sa istim modelom enkripcije u pregledaču. Slanje zahteva besplatan nalog; primaoci mogu otvoriti link bez registracije.",
  tagline: "Manje administracije naloga. Manje metapodataka. Više kontrole nad tim šta ostaje online nakon predaje.",
  relatedReading: "Povezano čitanje",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Detaljan pregled linkova sa brisanjem nakon čitanja, URL fragmenta i zašto kratkotrajnost pobedi e-mail ili Slack za jednokratne tajne.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS naspram enkripcije u pregledaču—šta svaki štiti i zašto server i dalje može pročitati vaše podatke.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Kako stvoriti i podeliti jake lozinke bez ponavljanja obrazaca ili ostavljanja u istoriji chata.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Zašto pisani zapisi u e-mailu i poslovnom chatu stvaraju dugoročni rizik—i kada kratkotrajne beleške bolje odgovaraju.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Praktična bezbednosna osnova: lozinke, autentifikacija, poruke i obrasci sigurnog deljenja.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Podelite API ključeve i kredencijale iz editora bez lepljenja tajni u Slack ili tikete.",
    },
  ],
};
