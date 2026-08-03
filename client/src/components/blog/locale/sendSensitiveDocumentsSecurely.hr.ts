import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyHr: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Koncept sigurnog prijenosa dokumenata: zapečaćena omotnica i enkriptirana predaja datoteke na smirenom radnom stolu",
  heroCaption:
    "Teži dio rijetko je gumb za slanje. To je ono što se događa sa svakom kopijom nakon što dokument stigne.",
  intro: [
    "Zamislite da trebate poslati putovnicu banci, računovođa vam traži poreznu dokumentaciju, poslodavac zahtijeva dokaz identiteta, ili klijent treba potpisan ugovor.",
    "Sam zadatak traje samo nekoliko sekundi: priložite datoteku, kliknite Pošalji, nastavite dan. Prijenos je rijetko najslabija točka procesa. Pravi problem počinje nakon što dokument stigne.",
    "Taj privitak može ostati u pretincima, cloud sigurnosnim kopijama, sinkroniziranim uređajima, arhiviranim poštanskim sandučićima i starim chat razgovorima godinama. U mnogim situacijama, najveći rizik za privatnost nije presretanje tijekom prijenosa—već to što kopije nastavljaju postojati dugo nakon što je dokument ispunio svoju svrhu.",
    "Ovaj vodič objašnjava zašto tradicionalno dijeljenje dokumenata često ne uspijeva, što sigurno dijeljenje dokumenata zapravo znači, i kako [enkripcija na strani preglednika](blog:encrypted-vs-secure-file-sharing) i [linkovi za jednokratnu upotrebu](blog:one-time-secret-links) pomažu da povjerljive informacije ostanu privatne.",
  ],
  sections: [
    {
      title: "Zašto povjerljivi dokumenti zaslužuju drugačiji tretman",
      takeaway:
        "Ako bi dokument bilo teško zamijeniti—ili bi bilo bolno da procuri—ne tretirajte ga kao fotografiju s odmora.",
      paragraphs: [
        "Ne svaka datoteka zaslužuje istu razinu zaštite. Gubitak fotografije s odmora na internetu može biti neugodan. Gubitak povjerljivog dokumenta može imati posljedice koje traju godinama.",
        "Identifikacijski dokumenti često sadrže vaše puno ime, datum rođenja, identifikacijski broj, nacionalnost, potpis i fotografiju. Financijski zapisi otkrivaju prihode, ušteđevinu, porezne podatke ili podatke o bankovnom računu. Medicinski dokumenti sadrže duboko osobne informacije, dok ugovori često sadrže komercijalno osjetljive detalje koji nikad nisu trebali postati javni.",
        "Ako netko sazna vašu lozinku, promijenite je. Ako netko kopira vašu putovnicu, osobnu iskaznicu, poreznu prijavu ili ugovor o radu, situacija je puno kompliciranija. Zato povjerljivi dokumenti zaslužuju drugačiji pristup od svakodnevne komunikacije.",
      ],
    },
    {
      title: "Skriveni problem s e-poštom",
      takeaway: "TLS štiti putovanje; ne sprječava gomilanje trajnih kopija nakon toga.",
      paragraphs: [
        "E-pošta ostaje jedan od najkorisnijih komunikacijskih alata koji su ikad napravljeni. Nikad nije bila osmišljena kao sustav za sigurnu isporuku dokumenata.",
        "Moderni pružatelji e-pošte štite poruke tijekom prijenosa enkriptiranim vezama kao što je TLS. Kad poruka stigne, privitak se obično pohranjuje kako bi mogao biti pretraživan, sinkroniziran, filtriran, sigurnosno kopiran i preuzet kasnije.",
        "Jedan privitak brzo postaje više kopija: vaš folder Sent, pretinac primatelja, telefoni, laptopi, korporativne arhive, cloud sigurnosne kopije, a povremeno i automatski sustavi za prosljeđivanje. Brisanje e-pošte kasnije rijetko uklanja svaku kopiju.",
        "Za svakodnevne razgovore ovo je obično prihvatljivo. Za putovnice, ugovore, financijska izvješća ili medicinske izvještaje, često nije. Za dublji pregled zašto je e-pošta loše mjesto za čuvanje tajni, pogledajte [zašto je e-pošta najgore mjesto za tajne](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Zašto aplikacije za razmjenu poruka ostavljaju trajni trag",
      takeaway: "Chat olakšava suradnju—a zadržavanje dokumenata čini slučajnim.",
      paragraphs: [
        "Mnogi ljudi izbjegavaju e-poštu i umjesto toga šalju povjerljive dokumente putem Slacka, Microsoft Teamsa, WhatsAppa, Signala, Telegrama ili Discorda. Ove platforme rješavaju suradnju. Ne rješavaju upravljanje životnim ciklusom dokumenata.",
        "Datoteke dijeljene u chatu često ostaju pretražive mjesecima ili godinama, sinkroniziraju se preko uređaja, ulaze u automatske sigurnosne kopije i preuzimaju se na osobna računala. Čak i kad je razgovor zaboravljen, dokumenti često ostaju.",
        "Najveći rizik za privatnost često nije presretanje od strane hakera. To je da povjerljive informacije tiho gomilaju kopije koje nitko nije namjeravao čuvati. Isti obrazac se javlja kad timovi [zalijepe tajne u chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Cloud pohrana rješava drugačiji problem",
      takeaway:
        "Cloud diskovi su izgrađeni za trajni pristup; privremena isporuka po dizajnu treba istek.",
      paragraphs: [
        "Usluge kao Google Drive, OneDrive, Dropbox i iCloud izvrsne su za suradnju, sigurnosne kopije i dugoročnu pohranu. Sigurna isporuka dokumenata drugačiji je problem.",
        "Ako nekoliko kolega treba stalan pristup istim datotekama, cloud pohrana je pravi alat. Ako samo želite da jedna osoba danas primi povjerljiv dokument—a ne treba vam dostupan sljedeći mjesec—zahtjevi su potpuno drugačiji.",
        "Trajni linkovi za dijeljenje često ostaju u povijesti preglednika, starim e-mailovima, dokumentima projekata, chat porukama i favoritima dugo nakon što svi pretpostave da su nestali. Cloud pohrana optimizira za dugoročnu dostupnost, a ne za privremenu isporuku.",
      ],
    },
    {
      title: "Sigurno dijeljenje dokumenata je više od enkripcije",
      takeaway: "Enkripcija štiti bitove; kontrole životnog ciklusa određuju koliko dugo izloženost traje.",
      paragraphs: [
        "Kad ljudi čuju „sigurno dijeljenje dokumenata“, često misle samo na enkripciju. Enkripcija je neophodna. Nije cijela priča.",
        "Sigurno dijeljenje se odnosi na smanjenje nepotrebne izloženosti tijekom cijelog životnog ciklusa dokumenta. Dobro osmišljen sustav treba odgovoriti: Može li samo predviđeni primatelj pristupiti dokumentu? Ističe li pristup automatski? Izbjegavaju li se nepotrebne kopije? Prima li usluga izvorni dokument ili samo enkriptirane podatke?",
        "Sigurnost nije samo o zaštiti datoteke tijekom prijenosa. Radi se o ograničavanju tko može pristupiti—i na koliko dugo.",
      ],
    },
    {
      title: "E-pošta naspram jednokratnog enkriptiranog linka",
      takeaway:
        "E-pošta je izgrađena da čuva poruke; jednokratni enkriptirani linkovi su izgrađeni da isporuče dokument i onda ga prestanu čuvati.",
      comparisonTable: {
        headers: ["", "Privitak e-pošte", "Jednokratni enkriptirani link"],
        rows: [
          ["Lakoća slanja", "Vrlo visoka", "Visoka"],
          [
            "Nastale kopije",
            "Mnogo (sent, pretinac, uređaji, sigurnosne kopije)",
            "Znatno manje po dizajnu",
          ],
          ["Trajanje pristupa", "Često neograničeno", "Ističe ili se briše nakon upotrebe"],
          [
            "Što usluga vidi",
            "Obično izvornu datoteku",
            "Šifrirani tekst ako je prvo enkriptirano u pregledniku",
          ],
          [
            "Najbolje za",
            "Svakodnevnu neosjetljivu poštu",
            "Putovnice, ugovore, porezne i identifikacijske dokumente",
          ],
        ],
        after: [
          "**Rečenica spremna za citiranje:** Privitak e-pošte = lako slanje, kopije koje mogu trajati godinama. Jednokratni enkriptirani link = enkripcija u pregledniku prije uploada, pristup koji ističe, znatno manje zaostalih kopija.",
        ],
      },
    },
    {
      title: "Enkripcija u pregledniku smanjuje potrebno povjerenje",
      takeaway:
        "Enkriptirajte prije uploada tako da usluga pohranjuje šifrirani tekst—ne vaš izvorni dokument.",
      paragraphs: [
        "Tradicionalne platforme za dijeljenje datoteka općenito primaju vaš izvorni dokument prije pohrane ili obrade. Enkripcija u pregledniku funkcionira drugačije.",
        "Prije nego što datoteka napusti vaše računalo, vaš preglednik je enkriptira lokalno. Usluga pohranjuje enkriptirani šifrirani tekst umjesto izvornog dokumenta. Bez odgovarajućeg ključa za dešifriranje, pohranjeni podaci su nerazumljivi.",
        "Umjesto da se u potpunosti oslanjate na pružatelja nakon što primi vaš dokument, smanjujete informacije dostupne pružatelju od samog početka. PrivateNoteov vodič [enkriptirano naspram sigurnog dijeljenja datoteka](blog:encrypted-vs-secure-file-sharing) detaljnije objašnjava taj model.",
      ],
    },
    {
      title: "Jednokratni linkovi smanjuju dugoročnu izloženost",
      takeaway: "Većina curenja podataka su zaostali pristupi—ne holivudsko hakiranje.",
      paragraphs: [
        "Mnoga curenja dokumenata događaju se zato što stari dokumenti nastavljaju postojati: privici e-pošte u pretincima, cloud linkovi koji još rade, chat povijesti koje čuvaju stare datoteke.",
        "Jednokratni linkovi koriste drugačiji pristup. Primatelj preuzima dokument jednom. Nakon toga, enkriptirani podaci se uklanjaju ili link za dijeljenje trajno ističe.",
        "Nema zaboravljene dijeljene mape. Nema linka za preuzimanje starog nekoliko godina. Nema povjerljivog dokumenta koji tiho čeka da bude otkriven.",
        "Nijedna tehnologija ne može spriječiti ovlaštenog primatelja da namjerno spremi kopiju nakon otvaranja dokumenta. Ono što jednokratno dijeljenje postiže je eliminiranje mnogih nepotrebnih kopija koje stvaraju tradicionalni alati.",
      ],
      calloutTitle: "Pravilo palca",
      callout:
        "Ako se ne biste osjećali ugodno objavljujući dokument na javnoj web stranici, dobro razmislite prije nego što ga poslate kao trajni privitak e-pošte.",
    },
    {
      title: "Dodatni sloj: dijeljenje zaštićeno lozinkom",
      takeaway: "Odvojite link od lozinke tako da jedna pogreška ne izloži oboje.",
      paragraphs: [
        "Ponekad i sam link za dijeljenje zaslužuje zaštitu—e-mail proslijeđen greškom, vidljiva povijest preglednika, ili kompromitiran račun za razmjenu poruka.",
        "Dodavanje lozinke stvara još jedan sloj. Čak i ako netko otkrije link za dijeljenje, i dalje ne može dešifrirati dokument bez lozinke.",
        "Za posebno osjetljive informacije, prenesite lozinku putem drugog kanala—telefonom ili osobno—umjesto u istoj poruci kao link. Isti obrazac se primjenjuje kad [sigurno dijelite lozinku](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Sigurno dijeljenje dokumenata u Europi i šire",
      takeaway:
        "GDPR ne imenuje proizvod—ali ograničavanje pristupa i zadržavanja odgovara njegovom duhu.",
      paragraphs: [
        "Širom Europe, organizacije obrađuju osobne podatke pod GDPR-om. On ne zahtijeva određenu uslugu za dijeljenje datoteka, ali zahtijeva odgovarajuće tehničke i organizacijske mjere prema riziku.",
        "Enkriptirano dijeljenje, ograničena dostupnost i manje nepotrebnih kopija praktični su primjeri tih principa. Iste ideje se primjenjuju bez obzira šaljete li dokumente računovođi, poslodavcu, odvjetniku, sveučilištu, zdravstvenom pružatelju, banci, osiguravatelju ili javnom tijelu.",
      ],
    },
    {
      title: "Kad trebate koristiti sigurno dijeljenje dokumenata?",
      takeaway:
        "Ako bi bilo bitno da ovaj dokument postane javan, ne šaljite ga kao trajni privitak.",
      paragraphs: [
        "To obuhvaća putovnice, osobne iskaznice, vozačke dozvole, financijske zapise, porezne dokumente, zahtjeve za hipoteku, ugovore o radu, dokumentaciju osiguranja, pravne sporazume, medicinske izvještaje, povjerljive poslovne informacije, istraživačke podatke, podatke o klijentima i intelektualno vlasništvo.",
        "Što je dokument teže zamijeniti—ili što su posljedice izlaganja veće—to pažljivije treba biti dijeljen.",
      ],
    },
    {
      title: "Praktični načini za smanjenje rizika",
      takeaway: "Savršena sigurnost ne postoji; manje kopija i kraći pristup skoro uvijek pomažu.",
      paragraphs: [
        "Prije nego što poslate povjerljiv dokument, prođite ovaj kratki popis:",
      ],
      checklist: [
        "Provjerite primatelja — ispravna osoba, ispravna adresa ili kanal",
        "Pošaljite samo ono što je potrebno — potrebne stranice, ne cijeli paket kad je moguće",
        "Koristite link koji ističe ili je jednokratan — ne trajni privitak",
        "Dodajte lozinku za vrlo osjetljive datoteke — i prenesite je preko drugog kanala",
        "Potvrdite isporuku, pa počistite — obrišite lokalne i pretinac kopije koje vam više ne trebaju",
      ],
      paragraphsAfterChecklist: [
        "Smanjenje broja kopija jedno je od najjednostavnijih i najučinkovitijih poboljšanja privatnosti koje bilo tko može učiniti.",
      ],
      midCta: {
        body: "Spremni poslati skeniranu putovnicu, ugovor ili porezni dokument bez ostavljanja trajnog traga u e-pošti?",
        button: "Pokreni siguran prijenos datoteke",
      },
    },
    {
      title: "Često postavljana pitanja",
      takeaway: "Enkripcija pomaže; istek i manje kopija završavaju posao.",
      faqs: [
        {
          question: "Je li zaštita PDF-a lozinkom dovoljna?",
          answer:
            "Pomaže, ali ne rješava trajnost. Enkriptirani PDF može i dalje ostati u arhivama e-pošte, cloud sigurnosnim kopijama i preuzetim datotekama godinama. Kombinirajte enkripciju s istekom ili jednokratnom isporukom.",
        },
        {
          question: "Nije li HTTPS već siguran?",
          answer:
            "HTTPS štiti podatke tijekom prijenosa. Ne zaustavlja nužno uslugu koja prima datoteku da joj pristupi ili je pohrani nakon toga. Enkripcija u pregledniku enkriptira prije uploada.",
        },
        {
          question: "Što je s enkriptiranim ZIP datotekama?",
          answer:
            "Razumno ako koristite jaku enkripciju i prenosite lozinku odvojeno—ali ipak ostavljaju trajne datoteke u sustavima e-pošte osim ako metoda dijeljenja također ograničava koliko dugo datoteka ostaje dostupna.",
        },
        {
          question: "Može li sigurno dijeljenje spriječiti primatelja da spremi dokument?",
          answer:
            "Ne. Kad netko legitimno primi dokument, može ga spremiti, ispisati ili fotografirati zaslon. Sigurno dijeljenje smanjuje nepotrebnu izloženost prije i nakon isporuke; ne može spriječiti namjerne radnje pouzdanih primatelja.",
        },
      ],
    },
    {
      title: "Dijeljenje povjerljivih dokumenata s PrivateNote",
      takeaway:
        "PrivateNote je izgrađen za privremenu isporuku enkriptiranih dokumenata—ne trajnu cloud pohranu.",
      paragraphs: [
        "PrivateNote je osmišljen oko jednostavnog zapažanja: mnogi povjerljivi dokumenti trebaju postojati online samo dovoljno dugo da ih jedan primatelj preuzme.",
        "Umjesto da tretira dijeljenje dokumenata kao trajnu pohranu, PrivateNote enkriptira datoteke u vašem pregledniku prije uploada i pohranjuje samo rezultirajući enkriptirani šifrirani tekst. Možete odabrati automatski istek, kreirati jednokratne linkove, i kad je prikladno, zaštititi dokument dodatnom lozinkom putem [sigurnog prijenosa datoteka](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Što PrivateNote radi", "Što ne radi"],
        rows: [
          [
            "Enkriptira u vašem pregledniku prije uploada",
            "Čita vaš izvorni dokument na poslužitelju",
          ],
          [
            "Koristi odvojene kriptografske ključeve za tekst bilješke, datoteke i metapodatke",
            "Miješa te stvari pod jednim ključem za ponovnu upotrebu",
          ],
          [
            "Koristi AES-256-GCM autentificiranu enkripciju, s politikom (istek / limiti pristupa) vezanom za šifrirani tekst",
            "Oslanja se na „enkripciju“ koja ignorira tko može otvoriti bilješku ili na koliko dugo",
          ],
          [
            "Podržava jednokratne linkove i linkove s istekom da ograniči zaostali pristup",
            "Čuva dokumente dostupnima neograničeno po zadanim postavkama radi udobnosti",
          ],
          [
            "Dopušta dodavanje neobavezne lozinke kao drugog faktora za link",
            "Sprječava ovlaštenog primatelja da spremi ili ispiše nakon što otvori",
          ],
          [
            "Smanjuje nepotrebne online kopije prije i nakon isporuke",
            "Zamjenjuje organizacijski proces, procjenu primatelja, ili dugoročnu pohranu u trezoru",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Ovaj pristup ne može spriječiti ovlaštenog primatelja da spremi kopiju nakon otvaranja dokumenta—nijedna tehnologija ne može. Ono što smanjuje je broj nepotrebnih kopija koje ostaju online prije i nakon isporuke.",
      ],
    },
    {
      title: "Zaključne misli",
      takeaway:
        "Najbolja kontrola je često najkraći životni vijek—samo ljudi kojima je potreban, samo dok im je potreban.",
      paragraphs: [
        "Internet je učinio dijeljenje dokumenata skoro bez napora. Također je učinio njihovo trajno čuvanje nevjerojatno lakim.",
        "Većina povjerljivih dokumenata ne treba ostati dostupna mjesecima ili godinama. Jednostavno treba stići do predviđenog primatelja sigurno.",
        "Odabir metode koja enkriptira prije uploada, ograničava nepotrebne kopije i uklanja podatke kad su ispunili svoju svrhu jedan je od najjednostavnijih načina za poboljšanje privatnosti—bez da svakodnevno dijeljenje dokumenata učini mnogo težim.",
        "Najjača sigurnosna mjera nije uvijek najsofisticiranija kriptografija. Ponekad je jednostavno osiguravanje da povjerljiv dokument postoji samo za ljude kojima je potreban, i samo dok im je potreban.",
      ],
    },
  ],
  ctaTitle: "Pošaljite dokument. Držite kopije pod kontrolom.",
  ctaBody:
    "Enkriptirajte datoteku u svom pregledniku, postavite istek ili jednokratno otvaranje, i podijelite link—ne trajni privitak koji zauvijek živi u nečijem pretincu.",
  ctaButton: "Sigurno prenesi datoteku",
};
