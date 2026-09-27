import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeSr: BlogGuideArticleCopy = {
  heroAlt:
    "Ekran laptopa koji prikazuje šestocifreni korak verifikacije pre nego što se privatna beleška može otkriti",
  heroCaption:
    "Samo link nije dovoljan: primalac unosi jednokratni kod koji delite drugim kanalom.",
  intro: [
    "Link privatne beleške je moćan jer obično nosi materijal potreban za dešifrovanje poruke. Ta pogodnost je i rizik: ako pun URL dospe u pogrešan inbox, chat nit ili snimak ekrana, tajna može biti dostupna pre nego što je otvori namerni primalac.",
    "**Verifikacioni kodovi** za primaoca dodaju drugu tajnu isporuke koju vi kontrolišete. Nakon što kreirate belešku, PrivateNote prikazuje šestocifreni kod specifičan za tu belešku. Taj kod delite odvojeno—telefonom, Signalom ili drugim kanalom—tako da presretnuti link nije dovoljan da se stigne do koraka otkrivanja.",
    "To se razlikuje od opcionalnog umotavanja šifroteksta lozinkom i od prijavljivanja. To je kapija isporuke: **verifikuj, pa otkrij**.",
  ],
  sections: [
    {
      title: "Samo link naspram link plus kod",
      takeaway:
        "Isporuka preko odvojenih kanala pretvara jednu ukradenu poruku u nepotpunu slagalicu.",
      paragraphs: [
        "Bearer linkovi su uobičajeni u bezbednom deljenju. Dobro rade kada je kanal pouzdan i vek trajanja kratak. Lošije rade kada isti nalog e-pošte ili chata koji prima link može biti i praćen, deljen ili kompromitovan.",
        "Zahtev za verifikacioni kod vraća klasičnu podelu: pošaljite link kanalom A, kod kanalom B. Napadaču trebaju oba. Taj obrazac se prirodno uklapa uz [kako bezbedno podeliti lozinku](blog:how-to-share-a-password-securely) i [jednokratne tajne linkove](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Kontrola", "Šta štiti", "Šta ne radi"],
        rows: [
          [
            "Verifikacioni kod (Starter/Business)",
            "Blokira otkrivanje dok primalac ne unese jednokratni kod",
            "Ne zamenjuje umotavanje lozinkom niti prijavu na nalog",
          ],
          [
            "Lozinka na belešci",
            "Umotava šifrotekst tako da dešifrovanje zahteva lozinku",
            "I dalje zahteva pažljivo out-of-band deljenje te lozinke",
          ],
          [
            "Kratak rok + jedno otvaranje",
            "Ograničava koliko dugo procureni link ostaje koristan",
            "Ne zaustavlja nekoga ko već ima link + kod na vreme",
          ],
        ],
      },
    },
    {
      title: "Kako da ga uključite",
      takeaway:
        "Omogućite pod Isporuka i verifikacija, zatim delite kod i link odvojeno.",
      paragraphs: [
        "Na kvalifikovanim Starter i Business planovima otvorite **Prilagodite** pri kreiranju beleške i omogućite **Zahtevaj verifikacioni kod** pod Isporuka i verifikacija. Možete ga postaviti i kao podrazumevano u Nalog → Podešavanja kako bi nove beleške nasledile kapiju.",
        "Nakon kreiranja, ekran uspeha prikazuje **verifikacioni kod primaoca**. Kopirajte link beleške kao i inače, zatim pošaljite kod drugim putem. Recite primaocu da će videti korak verifikacije pre **Otvori Privatnu poruku**.",
      ],
      checklist: [
        "Koristite Starter ili Business (funkcija je vezana za plan)",
        "Omogućite Zahtevaj verifikacioni kod za belešku (ili kao podrazumevano na nalogu)",
        "Kreirajte belešku i kopirajte link",
        "Kopirajte šestocifreni kod sa ekrana uspeha",
        "Pošaljite link i kod odvojenim kanalima",
        "Potvrdite da primalac verifikuje pre otkrivanja",
      ],
      midCta: {
        body: "Šaljete nešto gde inbox može biti deljen ili praćen?",
        button: "Kreirajte belešku sa verifikacijom",
      },
    },
    {
      title: "Šta primalac doživljava",
      takeaway: "Prvo kod, zatim uobičajeno upozorenje click-to-reveal.",
      paragraphs: [
        "Otvaranje linka prikazuje ekran verifikacije—ne dešifrovani sadržaj. Posle tačnog koda pojavljuje se poznata kapija otkrivanja: otvorite tek kada ste spremni, jer otkrivanje može potrošiti belešku prema burn politici.",
        "Pogrešni kodovi padaju zatvoreno. Primaocu nije potreban nalog; samo kod koji ste podelili. Za namerno kašnjenje pre dešifrovanja, pogledajte [zašto beleške čekaju click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Kada koristiti verifikacione kodove",
      takeaway: "Koristite ih kada je kanal linka slabiji od tajne.",
      bullets: [
        "Akreditivi ili dokumenti poslati e-poštom u deljeni inbox",
        "Linkovi objavljeni u timskom chatu sa mnogo članova",
        "Predaje gde je rizik od snimka ekrana ili prosleđivanja visok",
        "Svaka tajna koju biste štitili i podeljenom lozinkom na odvojenim kanalima",
      ],
      calloutTitle: "Praktičan savet",
      callout:
        "Ne stavljajte verifikacioni kod u isti e-mail kao link. Time se oba faktora spajaju u jednu presretnutu poruku.",
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li je verifikacioni kod isto što i lozinka na belešci?",
          answer:
            "Ne. Verifikacioni kod je kapija koju server proverava pre otkrivanja. Lozinka beleške (kada je omogućena) umotava sam šifrotekst i posebna je opcionalna kontrola.",
        },
        {
          question: "Mogu li da izaberem svoj kod?",
          answer:
            "PrivateNote generiše šestocifreni kod specifičan za belešku. Delite tu generisanu vrednost; ne izmišljate niti ponovo koristite lični PIN.",
        },
        {
          question: "Da li je dostupno na Free?",
          answer:
            "Verifikacija primaoca je mogućnost Starter i Business planova. Free nalozi i dalje mogu koristiti kratak rok, limite otvaranja i opcionalno umotavanje lozinkom gde je ponuđeno.",
        },
        {
          question: "Da li verifikacija znači da PrivateNote može da čita moju belešku?",
          answer:
            "Ne. Verifikacija ovlašćuje pristup toku otkrivanja. Sadržaj poruka i dalje se enkriptuje u pregledaču; statusna obaveštenja nikad ne uključuju otvoreni tekst.",
        },
      ],
    },
    {
      title: "Suština",
      takeaway: "Učinite link nepotpunim bez vašeg out-of-band koda.",
      paragraphs: [
        "Verifikacioni kodovi su za trenutke kada bi pogodnost inače ostavila potpuno dešifrabilan URL u jednom kanalu.",
        "Omogućite kapiju, delite kod odvojeno i držite vek beleške kratkim—posebno za [API ključeve](blog:how-to-share-api-key-securely), lozinke i dokumente.",
      ],
    },
  ],
  ctaTitle: "Dodajte odvojeni korak verifikacije predaji.",
  ctaBody:
    "Zahtevajte jednokratni verifikacioni kod pre otkrivanja, zatim pošaljite taj kod drugim kanalom od linka.",
  ctaButton: "Kreirajte verifikovanu privatnu belešku",
};
