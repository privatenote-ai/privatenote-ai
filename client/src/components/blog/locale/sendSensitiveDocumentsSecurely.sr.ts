import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelySr: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Koncept sigurnog prenosa dokumenata: zapečaćena koverta i enkriptovana predaja fajla na smirenom radnom stolu",
  heroCaption:
    "Teži deo retko je dugme za slanje. To je ono što se dešava sa svakom kopijom nakon što dokument stigne.",
  intro: [
    "Zamislite da treba da pošaljete pasoš banci, računovođa vam traži poresku dokumentaciju, poslodavac zahteva dokaz identiteta, ili klijent treba potpisan ugovor.",
    "Sam zadatak traje samo nekoliko sekundi: priložite fajl, kliknite Pošalji, nastavite dan. Prenos je retko najslabija tačka procesa. Prava briga počinje nakon što dokument stigne.",
    "Taj prilog može ostati u inboxima, cloud rezervnim kopijama, sinhronizovanim uređajima, arhiviranim poštanskim sandučićima i starim chat razgovorima godinama. U mnogim situacijama, najveći rizik za privatnost nije presretanje tokom prenosa—već to što kopije nastavljaju da postoje mnogo nakon što je dokument ispunio svoju svrhu.",
    "Ovaj vodič objašnjava zašto tradicionalno deljenje dokumenata često ne uspeva, šta sigurno deljenje dokumenata zapravo znači, i kako [enkripcija na strani pregledača](blog:encrypted-vs-secure-file-sharing) i [linkovi za jednokratnu upotrebu](blog:one-time-secret-links) pomažu da poverljive informacije ostanu privatne.",
  ],
  sections: [
    {
      title: "Zašto poverljivi dokumenti zaslužuju drugačiji tretman",
      takeaway:
        "Ako bi dokument bio teško zamenljiv—ili bolan za curenje—ne tretirajte ga kao odmorsku fotografiju.",
      paragraphs: [
        "Ne svaki fajl zaslužuje isti nivo zaštite. Gubitak fotografije sa odmora na internetu može biti neprijatan. Gubitak poverljivog dokumenta može imati posledice koje traju godinama.",
        "Identifikacioni dokumenti često sadrže vaše puno ime, datum rođenja, identifikacioni broj, nacionalnost, potpis i fotografiju. Finansijski zapisi otkrivaju prihode, ušteđevinu, poreske podatke ili podatke o bankovnom računu. Medicinski dokumenti sadrže duboko lične informacije, dok ugovori često sadrže komercijalno osetljive detalje koji nikad nisu trebali postati javni.",
        "Ako neko sazna vašu lozinku, promenite je. Ako neko kopira vaš pasoš, ličnu kartu, poreski izveštaj ili ugovor o radu, situacija je mnogo komplikovanija. Zato poverljivi dokumenti zaslužuju drugačiji pristup od svakodnevne komunikacije.",
      ],
    },
    {
      title: "Skriveni problem sa email-om",
      takeaway: "TLS štiti putovanje; ne sprečava gomilanje trajnih kopija nakon toga.",
      paragraphs: [
        "Email ostaje jedan od najkorisnijih komunikacionih alata koji su ikad napravljeni. Nikad nije bio dizajniran kao sistem za sigurnu isporuku dokumenata.",
        "Moderni email provajderi štite poruke tokom prenosa enkriptovanim konekcijama kao što je TLS. Kada poruka stigne, prilog se obično čuva da bi mogao biti pretraživan, sinhronizovan, filtriran, rezervno kopiran i preuzet kasnije.",
        "Jedan prilog brzo postaje više kopija: vaš folder Sent, inbox primaoca, telefoni, laptopovi, korporativne arhive, cloud rezervne kopije, a povremeno i automatski sistemi za prosleđivanje. Brisanje email-a kasnije retko uklanja svaku kopiju.",
        "Za svakodnevne razgovore ovo je obično prihvatljivo. Za pasoše, ugovore, finansijske izveštaje ili medicinske izveštaje, često nije. Za detaljniji pregled zašto je email loše mesto za čuvanje tajni, pogledajte [zašto je email najgore mesto za tajne](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Zašto aplikacije za razmenu poruka ostavljaju trajni trag",
      takeaway: "Chat olakšava saradnju—a zadržavanje dokumenata čini slučajnim.",
      paragraphs: [
        "Mnogi ljudi izbegavaju email i umesto toga šalju poverljive dokumente preko Slack-a, Microsoft Teams-a, WhatsApp-a, Signal-a, Telegram-a ili Discord-a. Ove platforme rešavaju saradnju. Ne rešavaju upravljanje životnim ciklusom dokumenata.",
        "Fajlovi deljeni u chat-u često ostaju pretraživi mesecima ili godinama, sinhronizuju se preko uređaja, ulaze u automatske rezervne kopije i preuzimaju se na lične računare. Čak i kada je razgovor zaboravljen, dokumenti često ostaju.",
        "Najveći rizik za privatnost često nije presretanje od strane hakera. To je da poverljive informacije tiho gomilaju kopije koje niko nije namerio da čuva. Isti obrazac se javlja kada timovi [nalepe tajne u chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Cloud skladištenje rešava drugačiji problem",
      takeaway:
        "Cloud diskovi su namenjeni trajnom pristupu; privremena isporuka po dizajnu treba istek.",
      paragraphs: [
        "Usluge kao Google Drive, OneDrive, Dropbox i iCloud su izvrsne za saradnju, rezervne kopije i dugoročno skladištenje. Sigurna isporuka dokumenata je drugačiji problem.",
        "Ako je nekoliko kolega potrebno da imaju stalan pristup istim fajlovima, cloud skladištenje je prava alatka. Ako samo želite da jedna osoba danas primi poverljiv dokument—a ne treba vam dostupan sledećeg meseca—zahtevi su potpuno drugačiji.",
        "Trajni linkovi za deljenje često ostaju u istoriji pregledača, starim email-ovima, dokumentima projekata, chat porukama i obeleživačima dugo nakon što svi pretpostave da su nestali. Cloud skladištenje optimizuje za dugoročnu dostupnost, ne za privremenu isporuku.",
      ],
    },
    {
      title: "Sigurno deljenje dokumenata je više od enkripcije",
      takeaway: "Enkripcija štiti bitove; kontrole životnog ciklusa određuju koliko dugo izloženost traje.",
      paragraphs: [
        "Kada ljudi čuju „sigurno deljenje dokumenata“, često misle samo na enkripciju. Enkripcija je neophodna. Nije cela priča.",
        "Sigurno deljenje se odnosi na smanjenje nepotrebne izloženosti tokom celog životnog ciklusa dokumenta. Dobro osmišljen sistem treba da odgovori: Može li samo predviđeni primalac pristupiti dokumentu? Ističe li pristup automatski? Da li se izbegavaju nepotrebne kopije? Da li usluga prima originalni dokument ili samo enkriptovane podatke?",
        "Bezbednost nije samo o zaštiti fajla tokom prenosa. Radi se o ograničavanju ko može pristupiti—i na koliko dugo.",
      ],
    },
    {
      title: "Email naspram jednokratnog enkriptovanog linka",
      takeaway:
        "Email je napravljen da čuva poruke; jednokratni enkriptovani linkovi su napravljeni da isporuče dokument i onda prestanu da ga čuvaju.",
      comparisonTable: {
        headers: ["", "Email prilog", "Jednokratni enkriptovani link"],
        rows: [
          ["Lakoća slanja", "Veoma visoka", "Visoka"],
          [
            "Nastale kopije",
            "Mnogo (sent, inbox, uređaji, rezervne kopije)",
            "Mnogo manje po dizajnu",
          ],
          ["Trajanje pristupa", "Često neograničeno", "Ističe ili se briše nakon upotrebe"],
          [
            "Šta usluga vidi",
            "Obično originalni fajl",
            "Šifrovani tekst ako je prvo enkriptovan u pregledaču",
          ],
          [
            "Najbolje za",
            "Svakodnevnu neosetljivu poštu",
            "Pasoše, ugovore, poreske i identifikacione dokumente",
          ],
        ],
        after: [
          "**Rečenica spremna za citiranje:** Email prilog = lako slanje, kopije koje mogu trajati godinama. Jednokratni enkriptovani link = enkripcija u pregledaču pre uploada, pristup koji ističe, mnogo manje zaostalih kopija.",
        ],
      },
    },
    {
      title: "Enkripcija u pregledaču smanjuje potrebno poverenje",
      takeaway:
        "Enkriptujte pre uploada tako da usluga čuva šifrovani tekst—ne vaš originalni dokument.",
      paragraphs: [
        "Tradicionalne platforme za deljenje fajlova generalno primaju vaš originalni dokument pre čuvanja ili obrade. Enkripcija u pregledaču funkcioniše drugačije.",
        "Pre nego što fajl napusti vaš računar, vaš pregledač ga enkriptuje lokalno. Usluga čuva enkriptovani šifrovani tekst umesto originalnog dokumenta. Bez odgovarajućeg ključa za dešifrovanje, sačuvani podaci su nerazumljivi.",
        "Umesto da se u potpunosti oslanjate na provajdera nakon što primi vaš dokument, smanjujete informacije dostupne provajderu od samog početka. PrivateNote-ov vodič [enkriptovano naspram sigurnog deljenja fajlova](blog:encrypted-vs-secure-file-sharing) detaljnije objašnjava taj model.",
      ],
    },
    {
      title: "Jednokratni linkovi smanjuju dugoročnu izloženost",
      takeaway: "Većina curenja podataka su zaostali pristupi—ne holivudsko hakovanje.",
      paragraphs: [
        "Mnoga curenja dokumenata se dešavaju zato što stari dokumenti nastavljaju da postoje: email prilozi u inboxima, cloud linkovi koji još rade, chat istorije koje čuvaju stare fajlove.",
        "Jednokratni linkovi koriste drugačiji pristup. Primalac preuzima dokument jednom. Nakon toga, enkriptovani podaci se uklanjaju ili link za deljenje trajno ističe.",
        "Nema zaboravljenog deljenog foldera. Nema linka za preuzimanje starog nekoliko godina. Nema poverljivog dokumenta koji tiho čeka da bude otkriven.",
        "Nijedna tehnologija ne može sprečiti ovlašćenog primaoca da namerno sačuva kopiju nakon otvaranja dokumenta. Ono što jednokratno deljenje postiže je eliminisanje mnogih nepotrebnih kopija koje kreiraju tradicionalni alati.",
      ],
      calloutTitle: "Pravilo palca",
      callout:
        "Ako se ne biste osećali prijatno objavljujući dokument na javnom sajtu, dobro razmislite pre nego što ga pošaljete kao trajni email prilog.",
    },
    {
      title: "Dodatni sloj: deljenje zaštićeno lozinkom",
      takeaway: "Odvojite link od lozinke tako da jedna greška ne izloži oboje.",
      paragraphs: [
        "Ponekad i sam link za deljenje zaslužuje zaštitu—email prosleđen greškom, vidljiva istorija pregledača, ili kompromitovan nalog za razmenu poruka.",
        "Dodavanje lozinke stvara još jedan sloj. Čak i ako neko otkrije link za deljenje, i dalje ne može dešifrovati dokument bez lozinke.",
        "Za posebno osetljive informacije, prenesite lozinku putem drugog kanala—telefonom ili lično—umesto u istoj poruci kao link. Isti obrazac se primenjuje kada [sigurno delite lozinku](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Sigurno deljenje dokumenata u Evropi i šire",
      takeaway:
        "GDPR ne imenuje proizvod—ali ograničavanje pristupa i zadržavanja odgovara njegovom duhu.",
      paragraphs: [
        "Širom Evrope, organizacije obrađuju lične podatke pod GDPR-om. On ne zahteva određenu uslugu za deljenje fajlova, ali zahteva odgovarajuće tehničke i organizacione mere prema riziku.",
        "Enkriptovano deljenje, ograničena dostupnost i manje nepotrebnih kopija su praktični primeri tih principa. Iste ideje se primenjuju bez obzira da li šaljete dokumente računovođi, poslodavcu, advokatu, univerzitetu, zdravstvenom provajderu, banci, osiguravaču ili javnom organu.",
      ],
    },
    {
      title: "Kada treba koristiti sigurno deljenje dokumenata?",
      takeaway:
        "Ako bi bilo bitno da ovaj dokument postane javan, ne šaljite ga kao trajni prilog.",
      paragraphs: [
        "To obuhvata pasoše, lične karte, vozačke dozvole, finansijske zapise, poreske dokumente, zahteve za hipoteku, ugovore o radu, dokumentaciju osiguranja, pravne sporazume, medicinske izveštaje, poverljive poslovne informacije, istraživačke podatke, podatke o klijentima i intelektualnu svojinu.",
        "Što je dokument teže zameniti—ili što su posledice izlaganja veće—to pažljivije treba biti deljen.",
      ],
    },
    {
      title: "Praktični načini za smanjenje rizika",
      takeaway: "Savršena bezbednost ne postoji; manje kopija i kraći pristup skoro uvek pomažu.",
      paragraphs: [
        "Pre nego što pošaljete poverljiv dokument, prođite ovu kratku listu:",
      ],
      checklist: [
        "Proverite primaoca — ispravna osoba, ispravna adresa ili kanal",
        "Pošaljite samo ono što je potrebno — potrebne stranice, ne ceo paket kada je moguće",
        "Koristite link koji ističe ili je jednokratan — ne trajni prilog",
        "Dodajte lozinku za veoma osetljive fajlove — i prenesite je preko drugog kanala",
        "Potvrdite isporuku, pa počistite — obrišite lokalne i inbox kopije koje vam više ne trebaju",
      ],
      paragraphsAfterChecklist: [
        "Smanjenje broja kopija je jedno od najjednostavnijih i najefikasnijih poboljšanja privatnosti koje bilo ko može učiniti.",
      ],
      midCta: {
        body: "Spremni da pošaljete skenirani pasoš, ugovor ili poreski fajl bez ostavljanja trajnog traga u email-u?",
        button: "Pokreni siguran prenos fajla",
      },
    },
    {
      title: "Često postavljana pitanja",
      takeaway: "Enkripcija pomaže; istek i manje kopija završavaju posao.",
      faqs: [
        {
          question: "Da li je zaštita PDF-a lozinkom dovoljna?",
          answer:
            "Pomaže, ali ne rešava trajnost. Enkriptovani PDF može i dalje ostati u email arhivama, cloud rezervnim kopijama i preuzetim fajlovima godinama. Kombinujte enkripciju sa istekom ili jednokratnom isporukom.",
        },
        {
          question: "Zar HTTPS nije već bezbedan?",
          answer:
            "HTTPS štiti podatke tokom prenosa. Ne zaustavlja nužno uslugu koja prima fajl da mu pristupi ili ga čuva nakon toga. Enkripcija u pregledaču enkriptuje pre uploada.",
        },
        {
          question: "Šta je sa enkriptovanim ZIP fajlovima?",
          answer:
            "Razumno ako koristite jaku enkripciju i prenosite lozinku odvojeno—ali ipak ostavljaju trajne fajlove u email sistemima osim ako metod deljenja takođe ograničava koliko dugo fajl ostaje dostupan.",
        },
        {
          question: "Može li sigurno deljenje sprečiti primaoca da sačuva dokument?",
          answer:
            "Ne. Kada neko legitimno primi dokument, može ga sačuvati, odštampati ili fotografisati ekran. Sigurno deljenje smanjuje nepotrebnu izloženost pre i posle isporuke; ne može sprečiti namerne akcije pouzdanih primalaca.",
        },
      ],
    },
    {
      title: "Deljenje poverljivih dokumenata sa PrivateNote",
      takeaway:
        "PrivateNote je namenjen privremenoj isporuci enkriptovanih dokumenata—ne trajnom cloud skladištenju.",
      paragraphs: [
        "PrivateNote je dizajniran oko jednostavnog zapažanja: mnogi poverljivi dokumenti treba da postoje na internetu samo dovoljno dugo da ih jedan primalac preuzme.",
        "Umesto da tretira deljenje dokumenata kao trajno skladištenje, PrivateNote enkriptuje fajlove u vašem pregledaču pre uploada i čuva samo rezultujući enkriptovani šifrovani tekst. Možete izabrati automatski istek, kreirati jednokratne linkove, i kada je prikladno, zaštititi dokument dodatnom lozinkom putem [sigurnog prenosa fajlova](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Šta PrivateNote radi", "Šta ne radi"],
        rows: [
          [
            "Enkriptuje u vašem pregledaču pre uploada",
            "Čita vaš originalni dokument na serveru",
          ],
          [
            "Koristi odvojene kriptografske ključeve za tekst beleške, fajlove i metapodatke",
            "Meša te stvari pod jedan ključ za ponovnu upotrebu",
          ],
          [
            "Koristi AES-256-GCM autentifikovanu enkripciju, sa politikom (istek / limiti pristupa) povezanom sa šifrovanim tekstom",
            "Oslanja se na „enkripciju“ koja ignoriše ko može otvoriti belešku ili na koliko dugo",
          ],
          [
            "Podržava jednokratne i linkove sa istekom da ograniči zaostali pristup",
            "Čuva dokumente dostupnim neograničeno po podrazumevanom podešavanju radi udobnosti",
          ],
          [
            "Dozvoljava dodavanje opcione lozinke kao drugog faktora za link",
            "Sprečava ovlašćenog primaoca da sačuva ili odštampa nakon što otvori",
          ],
          [
            "Smanjuje nepotrebne online kopije pre i posle isporuke",
            "Zamenjuje organizacioni proces, procenu primaoca, ili dugoročno skladištenje u trezoru",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Ovaj pristup ne može sprečiti ovlašćenog primaoca da sačuva kopiju nakon otvaranja dokumenta—nijedna tehnologija ne može. Ono što smanjuje je broj nepotrebnih kopija koje ostaju online pre i posle isporuke.",
      ],
    },
    {
      title: "Zaključne misli",
      takeaway:
        "Najbolja kontrola je često najkraći životni vek—samo ljudi kojima je potreban, samo dok im je potreban.",
      paragraphs: [
        "Internet je učinio deljenje dokumenata skoro bez napora. Takođe je učinio njihovo trajno čuvanje neverovatno lakim.",
        "Većina poverljivih dokumenata ne treba da ostane dostupna mesecima ili godinama. Jednostavno treba da stigne do predviđenog primaoca bezbedno.",
        "Izbor metode koja enkriptuje pre uploada, ograničava nepotrebne kopije i uklanja podatke kada su ispunili svoju svrhu je jedan od najjednostavnijih načina za poboljšanje privatnosti—bez da svakodnevno deljenje dokumenata učini mnogo težim.",
        "Najjača bezbednosna mera nije uvek najsofisticiranija kriptografija. Ponekad je jednostavno osiguravanje da poverljiv dokument postoji samo za ljude kojima je potreban, i samo dok im je potreban.",
      ],
    },
  ],
  ctaTitle: "Pošaljite dokument. Držite kopije pod kontrolom.",
  ctaBody:
    "Enkriptujte fajl u vašem pregledaču, postavite istek ili jednokratno otvaranje, i podelite link—ne trajni prilog koji zauvek živi u nečijem inboxu.",
  ctaButton: "Bezbedno prenesi fajl",
};
