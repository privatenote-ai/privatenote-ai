import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersSr: SecureClientDeliveryForLawyersArticleCopy = {
  heroKicker: "Za advokatske kancelarije",
  intro: [
    "Poverljiva komunikacija između advokata i klijenta zaslužuje više od enkripcije tokom prenosa. Važno je i koje kopije ostaju nakon dostave, ko im kasnije može pristupiti i koliko dugo ostaju dostupne.",
    "Kancelarije znaju da e-pošta nije trezor za poverljive podatke klijenta. Mnoge zato prelaze na Signal ili WhatsApp jer je „šifrovano“. To je nepotpuno. Te usluge čuvaju razgovor. Mnoge komunikacije između advokata i klijenta zahtevaju upravo suprotno: da se klijentu preda uputstvo, nacrt ili prilog, bez stvaranja novih trajnih kopija.",
    "Teškoća je praktična i pravna. Znatan deo klijenata neće da instalira Signal. Neće pored porodičnog WhatsApp-a da uvede drugu „bezbednu“ aplikaciju za poruke. Otvoriće link u pregledaču koji već imaju. Posebno u krivičnoj odbrani advokatura treba kanal koji liči na kancelarijsku prepisku — ne na oblačić iz obične aplikacije za čet.",
  ],
  sections: [
    {
      title: "Zašto šifrovani čet ipak može da ostavi trajnu istoriju",
      paragraphs: [
        "Šifrovanje s kraja na kraj u Signal-u i WhatsApp-u efikasno štiti sadržaj od pristupa pružaoca usluge. Ali šifrovanje i trajnost podataka dva su različita pitanja: poruka može biti dobro zaštićena, a da ipak ostane dostupna na uređajima učesnika, u rezervnim kopijama ili na povezanim računarima. Upravo je to drugo pitanje važno u praksi, naročito za advokatske kancelarije koje se bave krivičnom odbranom:",
      ],
      bullets: [
        "Ostaje li pretraživa istorija na telefonu klijenta, na uređaju srodnika ili na aparatu koji će kasnije biti pretresen, izgubljen ili veštačen?",
        "Da li oblak, povezani računari, pregledi obaveštenja i prosleđeni snimci ekrana umnožavaju sadržaj van prvobitnih strana?",
        "Nastaje li, nenamerno, tekući pisani komentar koji nikad nije trebalo da uđe u predmet, a kasnije se pojavi kao još jedan trajni digitalni zapis?",
      ],
      paragraphsAfterBullets: [
        "Isti obrazac poznaje i ostala struka: napisane poruke nadžive povod zbog kog su poslate. Vidite [kratkotrajne beleške za poruke s posla](blog:workplace-texts-private-note) i [zašto tajne ne idu u čet](blog:secrets-never-send-in-chat). Za isprave, lekarska izvešća i ugovore isti prigovor važi i za [priloge e-pošte](blog:why-email-is-worst-for-secrets).",
        "To nije poziv da se uništi ono što kancelarija mora da čuva. Zakonske obaveze čuvanja spisa, uredno vođenje predmeta i, gde je naloženo, obezbeđenje dokaza ostaju. Poenta je uža: mnoge operativne poruke — jednokratna uputstva, pristupni podaci, nacrti samo za klijenta, osetljiv prilog koji ne sme da stoji u porodičnom četu — ne treba trajno da ostanu u aplikaciji za poruke.",
      ],
    },
    {
      title: "Krivična odbrana, pritvor i klijent bez druge aplikacije",
      paragraphs: [
        "Prigovor je najoštriji u krivičnoj odbrani. Klijent je pod pritiskom, ponekad u pritvoru ili na izdržavanju kazne, koristi telefon srodnika i retko može da uvede sopstveni skup alata za poverljivost. Molba da „samo instalira Signal“ u mnogim predmetima pada u prazno. WhatsApp je često već na uređaju — i baš je to problem. To je okruženje lične komunikacije: tu se porodica svađa, tu putuju snimci ekrana, tu poverljivo uputstvo stoji pored šale od rođaka.",
        "Dodaje se praksa pretresa i oduzimanja. Ako se telefon oduzme, lokalna istorija poruka je na uređaju. PrivateNote ne menja ono što organi vlasti mogu zakonito da oduzmu ili pregledaju. Postavlja drugo pitanje: koje kopije klijent sam, podrazumevano, drži na svakodnevnom telefonu.",
        "Među porukama koje ne treba da ostanu u tom okruženju su:",
      ],
      bullets: [
        "Uputstva o izjašnjenju, pritvoru, merama, jemstvu ili sporazumu o priznanju krivice.",
        "Nacrti iskaza, podneska ili završne reči o kazni koje klijent treba da odobri pre podnošenja.",
        "Adrese, lekarska izvešća, imovinsko stanje ili identitet predviđenog svedoka — danas potrebno, opasno ako ostane.",
        "Jednokratni pristup portalu, video-ročištu ili dokumentu koji klijent treba jednom da pročita, a ne da ga čuva u četu.",
        "Advokat advokatu: korespondent, zamenički advokat na ročištu, koleginica koja preuzima termin — spisi trebaju sada, ne trajni grupni čet.",
      ],
      paragraphsAfterBullets: [
        "U svakom od tih slučajeva cilj je da se sadržaj preda određenom primaocu, bez nepotrebnog širenja kruga onih koji ga kasnije mogu rekonstruisati. Potvrda čitanja u aplikaciji za poruke nije zapis o dostavi namenjen kancelariji. Ne označava kancelariju. Ne nudi, na prvi pogled, profesionalni kontekst koji klijent oprezan prema nepoznatim linkovima može da potraži da bi prepoznao pošiljku.",
      ],
    },
    {
      title: "Šta advokatura zaista treba od kanala dostave",
      paragraphs: [
        "Podesan kanal za prenos poverljivih informacija ima kratak spisak zahteva. Klijent ne treba da pravi nalog niti da instalira aplikaciju. Šifrovanje mora da se desi na uređaju pošiljaoca pre otpreme, tako da usluga čuva samo šifrovane podatke, a ne sadržaj u čitljivom obliku. Pristup mora da može da se uništi posle čitanja i da istekne. Stranica za otvaranje treba da izgleda kao kancelarijska prepiska — ne kao anonimna usluga za deljenje teksta. Pošiljalac treba da može da vidi da li je link otvoren, da ga opozove ako je broj pogrešan, i da kod osetljivih priloga oteža nepotrebno preuzimanje.",
        "To je logika [jednokratnog tajnog linka](blog:one-time-secret-links), primenjena na advokatsku praksu. PrivateNote šifruje sadržaj u pregledaču pre nego što napusti uređaj. Primaoci otvaraju jedinstveni URL; nalog nije potreban. Kancelarija može da pošalje link kanalom koji klijent već koristi — SMS, e-pošta ili kratak poziv u kom se adresa pročita — bez stavljanja samog uputstva u taj kanal. Poverljivi sadržaj nalazi se u belešci. U četu ili e-pošti ostaje samo link koji nakon otvaranja ili isteka prestaje da radi.",
      ],
      comparisonTable: {
        headers: ["Zahtev prakse", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Klijent ne instalira aplikaciju",
            "Ne — aplikacija jeste kanal",
            "Da — običan pregledač",
          ],
          [
            "Nema trajne istorije kao podrazumevano",
            "Razgovor u aplikaciji; mogu se podesiti poruke koje nestaju",
            "Jednokratna predaja putem linka; jednokratno čitanje i istek kao osnovni tok",
          ],
          [
            "Identitet kancelarije pri dostavi",
            "Profil ili identitet unutar aplikacije za poruke",
            "Logo, ime kancelarije i stranica za otvaranje sa identitetom kancelarije",
          ],
          [
            "Dokaz da su spisi preuzeti",
            "Potvrde čitanja pripadaju četu, ne posebnom zapisu o dostavi",
            "Obaveštenja o otvaranju i dokaz pristupa (samo status)",
          ],
          [
            "Opoziv pri pogrešnom broju",
            "Poruka je već na uređaju",
            "Opozovi neotvorenu belešku",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal i WhatsApp takođe nude poruke koje nestaju. Njihov model i dalje je razgovor u aplikaciji za poruke, dok je PrivateNote osmišljen kao jednokratna predaja putem linka. Za dokumente umesto kratkih uputstava vidi [kako bezbedno poslati osetljiva dokumenta](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Kancelarijski standard: jedinstvena praksa dostave",
      paragraphs: [
        "Korist raste kada advokati međusobno koriste isti kanal kao prema klijentu. Korespondent, zamenički advokat na ročištu, koleginica koja pokriva pretres i klijent tada dele jedno očekivanje: osetljivo stiže kao jednokratni link sa identitetom kancelarije; ne ide u grupni čet; ne postaje još jedan trajni digitalni zapis.",
        "To je standard prakse, ne proizvod zasnovan na licencama po korisniku. PrivateNote Business je jedan profesionalni nalog. Advokat, saradnik ili mala kancelarija mogu da prikažu ime i vizuelni identitet na svakoj stranici za otvaranje. Kolege sa sopstvenim Business ili Starter nalogom mogu da vrate spise istim putem. Klijentu i dalje nije potreban nalog. Zajednička disciplina je poenta: prestati da svakodnevne aplikacije za poruke tretiramo kao podrazumevani kanal za poverljivu operativnu komunikaciju.",
        "Brendiranje nije sujeta. Klijent koji je navikao da bude oprezan sa nepoznatim linkovima treba odmah da prepozna kontekst poruke: naziv kancelarije, logo, identitet pošiljaoca i kratku prateću poruku. To nije kriptografska autentikacija pošiljaoca, ali dostavu čini prepoznatljivijom i profesionalnijom. Business dodaje profil kancelarije, logo, boje i prilagođenu stranicu za otvaranje, tako da klijent jasno vidi u kom kontekstu prima poverljivi sadržaj.",
      ],
      midCta: {
        body: "Business paket je namenjen profesionalnoj dostavi: identitet kancelarije kod primaoca, režim pregleda bez preuzimanja, prilozi do 1 GB i puna kontrola dostave (dokaz pristupa, provera primaoca, opoziv, odloženo otvaranje). 12 € / 12 $ mesečno, ili 120 € / 120 $ godišnje — jedan profesionalni nalog, ne licenca po korisniku.",
        button: "Testirajte Business paket za kancelarije",
      },
    },
    {
      title: "Kontrole koje pripadaju profesionalnom nalogu",
      paragraphs: [
        "Starter i Business dodaju funkcije koje bi kancelarija inače morala da usklađuje telefonom ili odvojenim kanalima. [Provera primaoca](blog:recipient-verification-code-before-reveal) stavlja kod specifičan za belešku na drugi kanal, tako da presretnuti link nije dovoljan. [Obaveštenja o otvaranju](blog:know-when-secret-link-opened) i dokaz pristupa kažu da su spisi preuzeti — samo status, nikad sadržaj. Još neotvoreni link može da se [opozove](blog:revoke-unopened-note-proof-of-access) ako je poslat na pogrešan broj. Odloženo otvaranje može da spreči pristup sadržaju do određenog roka ili dogovorenog termina, na primer do poziva iz zavoda. Business dodaje pregled bez preuzimanja za priloge koje treba čitati, ne usput čuvati, i najveće granice priloga za svežnjeve koji ne idu u čet.",
      ],
      orderedIntro: "Praktičan tok u kancelariji je kratak:",
      ordered: [
        "Sastavite uputstvo ili priložite spise. Šifrovanje je u pregledaču pre otpreme.",
        "Postavite kratak rok i jedno otvaranje — ili malo otvaranja ako klijent i korespondent moraju da preuzmu isti paket.",
        "Uključite proveru primaoca gde je sadržaj posebno osetljiv i kod saopštite drugim putem (npr. telefonom).",
        "Pošaljite samo link SMS-om ili e-poštom. Samo uputstvo ne stavljajte u tu poruku.",
        "Sačekajte obaveštenje o otvaranju. Ako je broj pogrešan, opozovite pre otvaranja. Posle otvaranja pretpostavite da primalac može da zadrži što je video, i postupite u skladu s tim.",
      ],
      paragraphsAfterOrdered: [
        "Za veće svežnjeve važi isti model: [šifrovane datoteke, šifrovani podaci na serveru, vremenski ograničen prozor preuzimanja](app:secure-file-transfer). Slanje datoteke zahteva besplatan nalog; otvaranje linka nikad.",
      ],
    },
    {
      title: "Šta ovaj kanal ne odlučuje",
      paragraphs: [
        "U Srbiji advokatsku tajnu uređuju, između ostalog, Zakon o advokaturi i Zakonik o krivičnom postupku. Da li je konkretna komunikacija obuhvaćena advokatskom tajnom zavisi od prava i okolnosti konkretnog slučaja. PrivateNote ne određuje taj pravni status. Nijedan proizvod ne sprečava ovlašćenog primaoca da, kad je sadržaj prikazan u čitljivom obliku, napravi kopiju, snimak ekrana ili fotografiju. PrivateNote ne zamenjuje sistem spisa kancelarije, evidenciju vremena ni dužnost da se čuva što predmet mora da čuva. Smanjuje nepotrebne kopije poruka koje nikad nisu trebale da postanu stalna arhiva.",
        "Uz to ograničenje, to je stručna alternativa dvema navikama koje danas vladaju: staviti poverljivu operativnu komunikaciju u e-poštu — ili u svakodnevnu aplikaciju za poruke jer klijent ništa drugo neće da instalira. Kancelarija ostavlja klijenta na alatima koje već ima, stavlja svoje ime na dostavu i ne ostavlja trajnu istoriju tamo gde nije potrebna.",
      ],
    },
    {
      title: "Česta pitanja",
      faqs: [
        {
          question: "Da li je šifrovanje u Signal-u ili WhatsApp-u dovoljno za zaštitu advokatske tajne?",
          answer:
            "Šifrovanje s kraja na kraj efikasno štiti sadržaj od pristupa pružaoca usluge. Ali ne rešava pitanje koliko dugo poruka ostaje na uređajima, u rezervnim kopijama ili na povezanim računarima. Šifrovanje i trajnost podataka dva su različita pitanja. Za poverljivu komunikaciju važno je i šta ostaje nakon dostave, ne samo kako je sadržaj zaštićen tokom razmene.",
        },
        {
          question: "Mora li klijent da napravi nalog ili da instalira aplikaciju?",
          answer:
            "Ne. Klijent otvara jedinstveni link u običnom pregledaču. Ni Signal, ni WhatsApp, ni aplikacija PrivateNote nisu potrebni, i za otvaranje beleške nalog nije potreban.",
        },
        {
          question: "Da li je PrivateNote sistem za spise ili zamena za predmet?",
          answer:
            "Ne. To je kratkotrajni kanal dostave. Predmeti, sudski spisi i sve pod obavezom čuvanja ostaju u uobičajenim sistemima kancelarije. PrivateNote je za poruke koje posle prijema ne treba da traju.",
        },
        {
          question: "Može li primalac posle otvaranja ipak da zadrži kopiju?",
          answer:
            "Da. Kada se sadržaj prikaže u čitljivom obliku, primalac može da ga kopira, snimi ekran, preuzme ili fotografiše. Uništenje posle čitanja i istek smanjuju ostatke na usluzi; ne brišu na daljinu ono što je primalac već sačuvao. Pregled bez preuzimanja u Business otežava usputno preuzimanje; ne zabranjuje fotografisanje.",
        },
      ],
    },
  ],
  ctaTitle: "Predajte uputstvo. Ne ostavljajte trajnu istoriju.",
  ctaBody:
    "Šifrujte sadržaj u pregledaču, prikažite identitet kancelarije na stranici za otvaranje i pošaljite link koji klijent može da otvori bez instaliranja dodatne aplikacije. Business je namenjen upravo takvoj profesionalnoj dostavi.",
  ctaPrimary: "Testirajte Business paket za kancelarije",
  ctaSecondary: "Pošaljite test poruku",
};
