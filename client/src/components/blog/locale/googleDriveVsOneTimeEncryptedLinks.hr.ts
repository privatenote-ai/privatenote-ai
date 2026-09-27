import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksHr: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Mirna scena radnog stola koja sugerira privremenu predaju datoteke naspram dugotrajnih mapa za suradnju u oblaku",
  heroCaption:
    "Drive blista u kontinuiranoj suradnji. Jednokratni linkovi blistaju kada datoteka treba postojati samo za predaju.",
  intro: [
    "Google Drive jedan je od najboljih alata za pohranu datoteka i suradnju tijekom dana, tjedana ili godina. [Jednokratni šifrirani linkovi](blog:one-time-secret-links) rješavaju drugi problem: sigurno jednom predati povjerljive informacije, a zatim automatski ukloniti pristup kada više nije potreban.",
    "Nijedan pristup nije univerzalno bolji. Pravi izbor ovisi o tome surađujete li na dokumentu ili samo dostavljate povjerljive informacije.",
  ],
  sections: [
    {
      title: "Zašto je to važno",
      takeaway:
        "Praktičnost čini Drive zadanim izborom—čak i kada datoteku treba vidjeti samo jednom.",
      paragraphs: [
        "Za mnoge ljude Google Drive postao je zadani odgovor kad god treba podijeliti datoteku. Ugrađen je u Gmail, Android, Google Workspace i bezbrojne poslovne tijekove rada. Trebate poslati PDF, tablicu ili ugovor? Prenesite ga na Drive, kopirajte poveznicu i pošaljite.",
        "Ta praktičnost učinila je Drive nevjerojatno uspješnim—ali može nas i potaknuti da isti alat koristimo u situacijama za koje nije posebno osmišljen.",
        "Zamislite slanje kopije putovnice računovođi, potpisanog ugovora o radu HR-u ili poreznih dokumenata financijskom savjetniku. U većini slučajeva primatelju te datoteke trebaju samo jednom. Nakon što je zadatak gotov, svaka preostala kopija samo povećava šansu da informacije ostanu dostupne dulje nego što je potrebno.",
        "Najveći rizik rijetko je da netko presretne datoteku dok putuje internetom. Moderni cloud servisi šifriraju podatke [u prijenosu](blog:encrypted-vs-secure-file-sharing). Veći problem je **zadržavanje**. Osjetljive informacije često ostaju u cloud pohrani, email obavijestima, sinkroniziranim mapama i preuzetim datotekama dugo nakon što svi zaborave da postoje.",
      ],
    },
    {
      title: "Google Drive je izgrađen za suradnju",
      takeaway: "Istodobno uređivanje, povijest verzija i dijeljene mape snage su—ne mane.",
      paragraphs: [
        "Google Drive izvrstan je u pomaganju ljudima da rade zajedno. Više osoba može istodobno uređivati isti dokument, promjene se automatski spremaju, povijest verzija olakšava vraćanje prethodnih revizija, a dozvole se mogu prilagoditi kad članovi tima dođu ili napuste projekt. Za kontinuirani rad to su ogromne prednosti.",
        "To je točno okruženje za koje je Drive dizajniran. Projektna mapa može ostati aktivna mjesecima dok se dokumenti razvijaju i dodaju nove datoteke.",
        "Izazov nastaje kada se iste značajke suradnje koriste za informacije koje nikada nisu trebale ostati dostupne.",
      ],
    },
    {
      title: "Skriveni trošak dugoročnog pristupa",
      takeaway:
        "Privremene predaje ostavljaju trajne tragove kada platforma optimizira dostupnost.",
      paragraphs: [
        "Većini povjerljivih datoteka ne treba biti dostupnima zauvijek. Kopija putovnice možda treba samo za provjeru identiteta. Porezna prijava samo za određenu prijavu. API ključ mogao bi se koristiti jednom, a zatim rotirati. Nakon što primatelj završi, daljnja pohrana donosi vrlo malo koristi.",
        "Nažalost, brisanje pristupa nije uvijek jednostavno. Ljudi preuzimaju datoteke na prijenosna računala. Sinkroniziraju mape na uređajima. Email pozivnice ostaju u sandučićima. Dijeljene mape i dalje postoje. Mjesecima kasnije netko otkrije staru mapu s dozvolama koje nitko nije pamtio da je dao.",
        "Nijedan od tih događaja nije neuspjeh Google Drivea. To je jednostavno prirodna posljedica korištenja platforme za suradnju za privremenu predaju—isti obrazac zadržavanja koji se pojavi kada ljudi [šalju tajne emailom](blog:why-email-is-worst-for-secrets) ili ostavljaju [dokumente u chatu](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Kada jednokratni linkovi imaju više smisla",
      takeaway:
        "Predajte jednom, neka istekne po dizajnu—bez pretvaranja svake predaje u dijeljeni radni prostor.",
      paragraphs: [
        "Jednokratni šifrirani linkovi dizajnirani su s drugim ciljem. Umjesto stvaranja dijeljenog radnog prostora, fokusiraju se na dostavu povjerljivih informacija s najmanjim praktičnim digitalnim otiskom. Informacije se šifriraju prije nego napuste preglednik, a pristup se može ograničiti na jedan pregled ili kratko razdoblje isteka. Nakon završene predaje link postaje neupotrebljiv.",
        "Ne radi se o zamjeni cloud pohrane. Radi se o prepoznavanju da ne zaslužuje svaka datoteka trajnu pohranu ili trajne dozvole.",
        "Ako šaljete kod za oporavak kolegi, potpisani ugovor klijentu ili medicinske nalaze specijalistu, vjerojatno vam ne treba zajedničko uređivanje, povijest verzija ni dijeljena mapa. Treba vam samo da prava osoba sigurno primi informacije—pogledajte i [kako sigurno slati osjetljive dokumente](blog:send-sensitive-documents-securely).",
        "Usluge poput [PrivateNote](app:secure-file-transfer) izgrađene su oko ovog modela privremenog dijeljenja. Umjesto poticanja dugoročne pohrane, minimiziraju zadržavanje kombinirajući šifriranje na strani klijenta s automatskim istekom.",
      ],
    },
    {
      title: "Koju metodu odabrati?",
      takeaway:
        "Uskladite alat s vijekom trajanja informacije—ne s platformom koja vam je najpoznatija.",
      paragraphs: [
        "Odluka manje ovisi o apstraktnoj „sigurnosti”, a više o svrsi.",
        "Ako više osoba treba pregledavati, uređivati i ponovno otvarati dokument kroz vrijeme, Google Drive je izvrstan izbor. Komentari, povijest verzija i dijeljene mape čine suradnju jednostavnom.",
        "Ako informacije treba dostaviti samo jednom, jednokratni šifrirani link često bolje pristaje. Uklanja potrebu za upravljanjem dugotrajnim dozvolama, smanjuje nepotrebne kopije i ograničava koliko dugo informacije ostaju dostupne.",
      ],
      calloutTitle: "Praktično pravilo",
      callout:
        "Odaberite alat koji odgovara tome koliko dugo informacije stvarno trebaju ostati dostupne—ne onaj koji otvarate iz navike.",
    },
    {
      title: "Usporedba",
      takeaway: "Značajke suradnje i efemerna dostava rješavaju različite poslove.",
      comparisonTable: {
        headers: ["Značajka", "Google Drive", "Jednokratni šifrirani link"],
        rows: [
          ["Dizajniran za suradnju", "Da", "Ne"],
          ["Dugoročna pohrana", "Da", "Ne"],
          ["Šifriranje od kraja do kraja na strani klijenta", "Ne prema zadanim postavkama*", "Da"],
          ["Automatski istek", "Ne (ručno čišćenje)", "Da"],
          ["Pristup za jedno čitanje", "Ne", "Da"],
          ["Kontinuirano upravljanje dozvolama", "Da", "Ne"],
          ["Najbolje za privremeno povjerljivo dijeljenje", "Ponekad", "Da"],
        ],
        after: [
          "*Standardni Drive šifrira podatke u prijenosu i u mirovanju s ključevima koje upravlja Google. Google Workspace nudi opcionalno [šifriranje na strani klijenta](https://support.google.com/a/answer/10741875) za neke organizacije, ali svakodnevni dijeljeni linkovi i dalje optimiziraju trajni pristup umjesto dostave burn-after-reading.",
        ],
      },
    },
    {
      title: "Kontrolni popis dobre prakse",
      takeaway: "Male navike smanjuju rizik zadržavanja bez obzira na odabrani alat.",
      paragraphs: [
        "Koji god alat odabrali, nekoliko jednostavnih navika značajno smanjuje nepotrebnu izloženost.",
      ],
      checklist: [
        "Dijelite samo ono što primatelju treba—izbjegavajte cijele mape pune nepovezanih osobnih podataka",
        "Uklonite nepotrebne metapodatke iz PDF-ova, Office datoteka i slika kada je praktično",
        "Ako koristite lozinku, pošaljite je odvojenim kanalom (out-of-band / OOB)",
        "Nakon zadatka: opozovite dijeljeni pristup, obrišite lokalne privremene kopije i izbjegavajte neodređene dijeljene mape",
      ],
      paragraphsAfterChecklist: [
        "Dostava out-of-band znači da šifrirani link putuje jednim kanalom (npr. emailom), a lozinka drugim (Signal, SMS ili telefonski poziv). Kompromitiranje samo jednog kanala ne bi trebalo biti dovoljno za otvaranje datoteke.",
        "Za dublji tijek rada oko predaje dokumenata slijedite [vodič za osjetljive dokumente](blog:send-sensitive-documents-securely). Za razliku između šifriranja u pregledniku i transportnog šifriranja, pogledajte [šifrirano vs sigurno dijeljenje datoteka](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Je li Google Drive siguran?",
          answer:
            "Da—Google Drive zrela je cloud platforma koja šifrira informacije u prijenosu i u mirovanju. Ukupna izloženost i dalje ovisi o tome kako se datoteke dijele, kako se upravlja dozvolama i koliko dugo dokumenti ostaju dostupni nakon završetka zadatka.",
        },
        {
          question: "Je li Google Drive šifriran od kraja do kraja?",
          answer:
            "Ne u smislu koji se koristi za poruke šifrirane na strani klijenta ili jednokratne linkove šifrirane u pregledniku. Za standardnu Drive pohranu Google upravlja ključevima šifriranja. Opcionalno Workspace šifriranje na strani klijenta mijenja tu sliku za podobne organizacije, ali svakodnevno dijeljenje „svatko s poveznicom” i dalje ostavlja trajne kopije i površine dozvola koje efemerna dostava izbjegava. Pogledajte [što znači šifriranje od kraja do kraja](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Jesu li jednokratni linkovi sigurniji od Google Drivea?",
          answer:
            "Za privremene povjerljive predaje često smanjuju dugoročni rizik jer minimiziraju zadržavanje i mogu automatski ukloniti pristup nakon dostave. Za zajedničko uređivanje i kontinuirane projekte Drive ostaje bolji alat. Sigurnost slijedi svrhu—ne univerzalni poredak.",
        },
        {
          question: "Što ako pošaljem jednokratni link pogrešnoj osobi?",
          answer:
            "Zaštitite sadržaj lozinkom, koristite kratki istek i uništite bilješku prije otvaranja ako vaš alat to dopušta. Provjera primatelja prije slanja ostaje najjača obrana. Agencije poput [CISA](https://www.cisa.gov/) dosljedno naglašavaju ograničavanje trajanja pristupa i najmanje privilegije—iste ideje iza kratkotrajnih šifriranih linkova.",
        },
      ],
    },
  ],
  ctaTitle: "Trebate li privremenu povjerljivu predaju?",
  ctaBody:
    "Google Drive i jednokratni šifrirani linkovi komplementarni su alati. Ako ljudi trebaju surađivati na dokumentima kroz vrijeme, Drive je jedna od najboljih platformi za suradnju. Ako je cilj jednom predati povjerljive informacije i minimizirati koliko dugo ostaju dostupne, stvorite jednokratni link šifriran od kraja do kraja u pregledniku—bez ostavljanja trajnih kopija u emailu ili dijeljenim mapama.",
  ctaButton: "Stvori siguran jednokratni link",
};
