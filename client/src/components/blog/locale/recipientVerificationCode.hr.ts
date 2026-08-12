import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeHr: BlogGuideArticleCopy = {
  heroAlt:
    "Ekran laptopa koji prikazuje šesteroznamenkasti korak verifikacije prije nego što se privatna bilješka može otkriti",
  heroCaption:
    "Samo link nije dovoljan: primatelj unosi jednokratni kod koji dijelite drugim kanalom.",
  intro: [
    "Link privatne bilješke moćan je jer obično nosi materijal potreban za dešifriranje poruke. Ta pogodnost također je rizik: ako potpuni URL dospije u pogrešan sandučić, chat nit ili snimku zaslona, tajna može biti dostupna prije nego što je otvori namjerni primatelj.",
    "**Verifikacijski kodovi** za primatelja dodaju drugu tajnu dostave koju vi kontrolirate. Nakon što stvorite bilješku, PrivateNote prikazuje šesteroznamenkasti kod specifičan za tu bilješku. Taj kod dijelite odvojeno—telefonom, Signalom ili drugim kanalom—tako da presretnuti link nije dovoljan da se dođe do koraka otkrivanja.",
    "To se razlikuje od opcionalnog umotavanja šifroteksta lozinkom i od prijave. To je kapija dostave: **verificiraj, zatim otkrij**.",
  ],
  sections: [
    {
      title: "Samo link naspram link plus kod",
      takeaway:
        "Dostava preko odvojenih kanala pretvara jednu ukradenu poruku u nepotpunu slagalicu.",
      paragraphs: [
        "Bearer linkovi uobičajeni su u sigurnom dijeljenju. Dobro rade kada je kanal pouzdan i životni vijek kratak. Lošije rade kada isti e-mail ili chat račun koji prima link može biti i praćen, dijeljen ili kompromitiran.",
        "Zahtjev za verifikacijski kod vraća klasičnu podjelu: pošaljite link kanalom A, kod kanalom B. Napadaču trebaju oba. Taj obrazac prirodno se uklapa uz [kako sigurno podijeliti lozinku](blog:how-to-share-a-password-securely) i [jednokratne tajne linkove](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Kontrola", "Što štiti", "Što ne radi"],
        rows: [
          [
            "Verifikacijski kod (Starter/Business)",
            "Blokira otkrivanje dok primatelj ne unese jednokratni kod",
            "Ne zamjenjuje umotavanje lozinkom niti prijavu na račun",
          ],
          [
            "Lozinka na bilješci",
            "Umotava šifrotekst tako da dešifriranje zahtijeva lozinku",
            "I dalje zahtijeva pažljivo out-of-band dijeljenje te lozinke",
          ],
          [
            "Kratak rok + jedno otvaranje",
            "Ograničava koliko dugo procurjeli link ostaje koristan",
            "Ne zaustavlja nekoga tko već ima link + kod na vrijeme",
          ],
        ],
      },
    },
    {
      title: "Kako ga uključiti",
      takeaway:
        "Omogućite pod Dostava i provjera, zatim dijelite kod i link odvojeno.",
      paragraphs: [
        "Na prikladnim Starter i Business planovima otvorite **Prilagodite** pri stvaranju bilješke i omogućite **Zahtijevaj verifikacijski kod** pod Dostava i provjera. Možete ga postaviti i kao zadano u Račun → Postavke kako bi nove bilješke naslijedile kapiju.",
        "Nakon stvaranja, zaslon uspjeha prikazuje **verifikacijski kod primatelja**. Kopirajte link bilješke kao i inače, zatim pošaljite kod drugim putem. Recite primatelju da će vidjeti korak verifikacije prije **Otvori bilješku**.",
      ],
      checklist: [
        "Koristite Starter ili Business (značajka je vezana uz plan)",
        "Omogućite Zahtijevaj verifikacijski kod za bilješku (ili kao zadano na računu)",
        "Stvorite bilješku i kopirajte link",
        "Kopirajte šesteroznamenkasti kod sa zaslona uspjeha",
        "Pošaljite link i kod odvojenim kanalima",
        "Potvrdite da primatelj verificira prije otkrivanja",
      ],
      midCta: {
        body: "Šaljete nešto gdje sandučić može biti dijeljen ili praćen?",
        button: "Stvorite bilješku s verifikacijom",
      },
    },
    {
      title: "Što primatelj doživljava",
      takeaway: "Prvo kod, zatim uobičajeno upozorenje click-to-reveal.",
      paragraphs: [
        "Otvaranje linka prikazuje zaslon verifikacije—ne dešifrirani sadržaj. Nakon točnog koda pojavljuje se poznata kapija otkrivanja: otvorite tek kada ste spremni, jer otkrivanje može potrošiti bilješku prema burn politici.",
        "Pogrešni kodovi padaju zatvoreno. Primatelju nije potreban račun; samo kod koji ste podijelili. Za namjerno kašnjenje prije dešifriranja, pogledajte [zašto bilješke čekaju click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Kada koristiti verifikacijske kodove",
      takeaway: "Koristite ih kada je kanal linka slabiji od tajne.",
      bullets: [
        "Vjerodajnice ili dokumenti poslani e-poštom u dijeljeni sandučić",
        "Linkovi objavljeni u timskom chatu s mnogo članova",
        "Predaje gdje je rizik od snimke zaslona ili prosljeđivanja visok",
        "Svaka tajna koju biste štitili i podijeljenom lozinkom na odvojenim kanalima",
      ],
      calloutTitle: "Praktičan savjet",
      callout:
        "Ne stavljajte verifikacijski kod u isti e-mail kao link. Time se oba faktora spajaju u jednu presretnutu poruku.",
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Je li verifikacijski kod isto što i lozinka na bilješci?",
          answer:
            "Ne. Verifikacijski kod je kapija koju poslužitelj provjerava prije otkrivanja. Lozinka bilješke (kada je omogućena) umotava sam šifrotekst i posebna je opcionalna kontrola.",
        },
        {
          question: "Mogu li odabrati vlastiti kod?",
          answer:
            "PrivateNote generira šesteroznamenkasti kod specifičan za bilješku. Dijelite tu generiranu vrijednost; ne izmišljate niti ponovno koristite osobni PIN.",
        },
        {
          question: "Je li dostupno na Free?",
          answer:
            "Verifikacija primatelja mogućnost je Starter i Business planova. Free računi i dalje mogu koristiti kratak rok, limite otvaranja i opcionalno umotavanje lozinkom gdje je ponuđeno.",
        },
        {
          question: "Znači li verifikacija da PrivateNote može čitati moju bilješku?",
          answer:
            "Ne. Verifikacija ovlašćuje pristup toku otkrivanja. Sadržaj poruka i dalje se enkriptira u pregledniku; statusne obavijesti nikad ne uključuju otvoreni tekst.",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway: "Učinite link nepotpunim bez vašeg out-of-band koda.",
      paragraphs: [
        "Verifikacijski kodovi namijenjeni su trenucima kada bi pogodnost inače ostavila potpuno dešifrabilan URL u jednom kanalu.",
        "Omogućite kapiju, dijelite kod odvojeno i držite životni vijek bilješke kratkim—osobito za [API ključeve](blog:how-to-share-api-key-securely), lozinke i dokumente.",
      ],
    },
  ],
  ctaTitle: "Dodajte odvojeni korak verifikacije predaji.",
  ctaBody:
    "Zahtijevajte jednokratni verifikacijski kod prije otkrivanja, zatim pošaljite taj kod drugim kanalom od linka.",
  ctaButton: "Stvorite verificiranu privatnu bilješku",
};
