import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksSr: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Mirna scena radnog stola koja sugeriše privremenu predaju datoteke naspram dugotrajnih mapa za saradnju u oblaku",
  heroCaption:
    "Drive blista u kontinuiranoj saradnji. Jednokratni linkovi blistaju kada datoteka treba da postoji samo za predaju.",
  intro: [
    "Google Drive jedan je od najboljih alata za čuvanje datoteka i saradnju tokom dana, nedelja ili godina. [Jednokratni šifrovani linkovi](blog:one-time-secret-links) rešavaju drugi problem: bezbedno jednom predati poverljive informacije, a zatim automatski ukloniti pristup kada više nije potreban.",
    "Nijedan pristup nije univerzalno bolji. Pravi izbor zavisi od toga da li sarađujete na dokumentu ili samo dostavljate poverljive informacije.",
  ],
  sections: [
    {
      title: "Zašto je to važno",
      takeaway:
        "Praktičnost čini Drive podrazumevanim izborom—čak i kada datoteku treba videti samo jednom.",
      paragraphs: [
        "Za mnoge ljude Google Drive je postao podrazumevani odgovor kad god treba podeliti datoteku. Ugrađen je u Gmail, Android, Google Workspace i bezbrojne poslovne tokove rada. Treba da pošaljete PDF, tabelu ili ugovor? Otpremite ga na Drive, kopirajte link i pošaljite.",
        "Ta praktičnost učinila je Drive neverovatno uspešnim—ali može nas i naterati da isti alat koristimo u situacijama za koje nije posebno osmišljen.",
        "Zamislite slanje kopije pasoša računovođi, potpisanog ugovora o radu HR-u ili poreskih dokumenata finansijskom savetniku. U većini slučajeva primaocu te datoteke trebaju samo jednom. Nakon što je zadatak završen, svaka preostala kopija samo povećava šansu da informacije ostanu dostupne duže nego što je potrebno.",
        "Najveći rizik retko je da neko presretne datoteku dok putuje internetom. Moderni cloud servisi šifruju podatke [u prenosu](blog:encrypted-vs-secure-file-sharing). Veći problem je **zadržavanje**. Osetljive informacije često ostaju u cloud skladištu, email obaveštenjima, sinhronizovanim folderima i preuzetim datotekama dugo nakon što svi zaborave da postoje.",
      ],
    },
    {
      title: "Google Drive je napravljen za saradnju",
      takeaway: "Istovremeno uređivanje, istorija verzija i deljeni folderi snage su—ne mane.",
      paragraphs: [
        "Google Drive je odličan u tome da pomogne ljudima da rade zajedno. Više osoba može istovremeno uređivati isti dokument, izmene se automatski čuvaju, istorija verzija olakšava vraćanje prethodnih revizija, a dozvole se mogu prilagoditi kada članovi tima dođu ili napuste projekat. Za kontinuirani rad to su ogromne prednosti.",
        "To je tačno okruženje za koje je Drive dizajniran. Projektni folder može ostati aktivan mesecima dok se dokumenti razvijaju i dodaju nove datoteke.",
        "Izazov nastaje kada se iste funkcije saradnje koriste za informacije koje nikada nisu trebale da ostanu dostupne.",
      ],
    },
    {
      title: "Skriveni trošak dugoročnog pristupa",
      takeaway:
        "Privremene predaje ostavljaju trajne tragove kada platforma optimizuje dostupnost.",
      paragraphs: [
        "Većini poverljivih datoteka ne treba da budu dostupne zauvek. Kopija pasoša možda treba samo za proveru identiteta. Poreska prijava samo za određeno podnošenje. API ključ mogao bi se koristiti jednom, a zatim rotirati. Nakon što primalac završi, dalje čuvanje donosi veoma malo koristi.",
        "Nažalost, brisanje pristupa nije uvek jednostavno. Ljudi preuzimaju datoteke na laptopove. Sinhronizuju foldere na uređajima. Email pozivnice ostaju u sandučićima. Deljeni folderi i dalje postoje. Mesecima kasnije neko otkrije stari folder sa dozvolama koje niko nije pamtio da je dao.",
        "Nijedan od ovih događaja nije neuspeh Google Drivea. To je jednostavno prirodna posledica korišćenja platforme za saradnju za privremenu predaju—isti obrazac zadržavanja koji se pojavi kada ljudi [šalju tajne emailom](blog:why-email-is-worst-for-secrets) ili ostavljaju [dokumente u četu](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Kada jednokratni linkovi imaju više smisla",
      takeaway:
        "Predajte jednom, neka istekne po dizajnu—bez pretvaranja svake predaje u deljeni radni prostor.",
      paragraphs: [
        "Jednokratni šifrovani linkovi dizajnirani su sa drugim ciljem. Umesto stvaranja deljenog radnog prostora, fokusiraju se na dostavu poverljivih informacija sa najmanjim praktičnim digitalnim otiskom. Informacije se šifruju pre nego što napuste pregledač, a pristup se može ograničiti na jedan pregled ili kratak period isteka. Nakon završene predaje link postaje neupotrebljiv.",
        "Ne radi se o zameni cloud skladišta. Radi se o prepoznavanju da ne zaslužuje svaka datoteka trajno skladište ili trajne dozvole.",
        "Ako šaljete kod za oporavak kolegi, potpisani ugovor klijentu ili medicinske nalaze specijalisti, verovatno vam ne treba zajedničko uređivanje, istorija verzija ni deljeni folder. Treba vam samo da prava osoba bezbedno primi informacije—pogledajte i [kako bezbedno slati osetljive dokumente](blog:send-sensitive-documents-securely).",
        "Usluge kao što je [PrivateNote](app:secure-file-transfer) izgrađene su oko ovog modela privremenog deljenja. Umesto podsticanja dugoročnog skladištenja, minimizuju zadržavanje kombinujući šifrovanje na strani klijenta sa automatskim istekom.",
      ],
    },
    {
      title: "Koju metodu izabrati?",
      takeaway:
        "Uskladite alat sa vekom trajanja informacije—ne sa platformom koja vam je najpoznatija.",
      paragraphs: [
        "Odluka manje zavisi od apstraktne „bezbednosti”, a više od svrhe.",
        "Ako više osoba treba da pregleda, uređuje i ponovo otvara dokument kroz vreme, Google Drive je odličan izbor. Komentari, istorija verzija i deljeni folderi čine saradnju jednostavnom.",
        "Ako informacije treba dostaviti samo jednom, jednokratni šifrovani link često bolje pristaje. Uklanja potrebu za upravljanjem dugotrajnim dozvolama, smanjuje nepotrebne kopije i ograničava koliko dugo informacije ostaju dostupne.",
      ],
      calloutTitle: "Praktično pravilo",
      callout:
        "Izaberite alat koji odgovara tome koliko dugo informacije stvarno treba da ostanu dostupne—ne onaj koji otvarate iz navike.",
    },
    {
      title: "Poređenje",
      takeaway: "Funkcije saradnje i efemerna dostava rešavaju različite poslove.",
      comparisonTable: {
        headers: ["Funkcija", "Google Drive", "Jednokratni šifrovani link"],
        rows: [
          ["Dizajniran za saradnju", "Da", "Ne"],
          ["Dugoročno skladište", "Da", "Ne"],
          ["Šifrovanje od kraja do kraja na strani klijenta", "Ne podrazumevano*", "Da"],
          ["Automatski istek", "Ne (ručno čišćenje)", "Da"],
          ["Pristup za jedno čitanje", "Ne", "Da"],
          ["Kontinuirano upravljanje dozvolama", "Da", "Ne"],
          ["Najbolje za privremeno poverljivo deljenje", "Ponekad", "Da"],
        ],
        after: [
          "*Standardni Drive šifruje podatke u prenosu i u mirovanju sa ključevima koje upravlja Google. Google Workspace nudi opciono [šifrovanje na strani klijenta](https://support.google.com/a/answer/10741875) za neke organizacije, ali svakodnevni deljeni linkovi i dalje optimizuju trajni pristup umesto dostave burn-after-reading.",
        ],
      },
    },
    {
      title: "Kontrolna lista dobre prakse",
      takeaway: "Male navike smanjuju rizik zadržavanja bez obzira na izabrani alat.",
      paragraphs: [
        "Koji god alat izabrali, nekoliko jednostavnih navika značajno smanjuje nepotrebnu izloženost.",
      ],
      checklist: [
        "Delite samo ono što primaocu treba—izbegavajte cele foldere pune nepovezanih ličnih podataka",
        "Uklonite nepotrebne metapodatke iz PDF-ova, Office datoteka i slika kada je praktično",
        "Ako koristite lozinku, pošaljite je odvojenim kanalom (out-of-band / OOB)",
        "Nakon zadatka: opozovite deljeni pristup, obrišite lokalne privremene kopije i izbegavajte neodređene deljene foldere",
      ],
      paragraphsAfterChecklist: [
        "Dostava out-of-band znači da šifrovani link putuje jednim kanalom (npr. emailom), a lozinka drugim (Signal, SMS ili telefonski poziv). Kompromitovanje samo jednog kanala ne bi trebalo da bude dovoljno za otvaranje datoteke.",
        "Za dublji tok rada oko predaje dokumenata pratite [vodič za osetljive dokumente](blog:send-sensitive-documents-securely). Za razliku između šifrovanja u pregledaču i transportnog šifrovanja, pogledajte [šifrovano vs bezbedno deljenje datoteka](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li je Google Drive bezbedan?",
          answer:
            "Da—Google Drive je zrela cloud platforma koja šifruje informacije u prenosu i u mirovanju. Ukupna izloženost i dalje zavisi od toga kako se datoteke dele, kako se upravlja dozvolama i koliko dugo dokumenti ostaju dostupni nakon završetka zadatka.",
        },
        {
          question: "Da li je Google Drive šifrovan od kraja do kraja?",
          answer:
            "Ne u smislu koji se koristi za poruke šifrovane na strani klijenta ili jednokratne linkove šifrovane u pregledaču. Za standardno Drive skladište Google upravlja ključevima šifrovanja. Opciono Workspace šifrovanje na strani klijenta menja tu sliku za podobne organizacije, ali svakodnevno deljenje „svako sa linkom” i dalje ostavlja trajne kopije i površine dozvola koje efemerna dostava izbegava. Pogledajte [šta znači šifrovanje od kraja do kraja](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Da li su jednokratni linkovi bezbedniji od Google Drivea?",
          answer:
            "Za privremene poverljive predaje često smanjuju dugoročni rizik jer minimizuju zadržavanje i mogu automatski ukloniti pristup nakon dostave. Za zajedničko uređivanje i kontinuirane projekte Drive ostaje bolji alat. Bezbednost prati svrhu—ne univerzalni poredak.",
        },
        {
          question: "Šta ako pošaljem jednokratni link pogrešnoj osobi?",
          answer:
            "Zaštitite sadržaj lozinkom, koristite kratak istek i uništite belešku pre otvaranja ako vaš alat to dozvoljava. Provera primaoca pre slanja ostaje najjača odbrana. Agencije kao što je [CISA](https://www.cisa.gov/) dosledno naglašavaju ograničavanje trajanja pristupa i najmanje privilegije—iste ideje iza kratkotrajnih šifrovanih linkova.",
        },
      ],
    },
  ],
  ctaTitle: "Treba li vam privremena poverljiva predaja?",
  ctaBody:
    "Google Drive i jednokratni šifrovani linkovi komplementarni su alati. Ako ljudi treba da sarađuju na dokumentima kroz vreme, Drive je jedna od najboljih platformi za saradnju. Ako je cilj jednom predati poverljive informacije i minimizovati koliko dugo ostaju dostupne, napravite jednokratni link šifrovan od kraja do kraja u pregledaču—bez ostavljanja trajnih kopija u emailu ili deljenim folderima.",
  ctaButton: "Napravi bezbedan jednokratni link",
};
