import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedSr: BlogGuideArticleCopy = {
  heroAlt:
    "Panel obaveštenja koji prikazuje upozorenje da je beleška otvorena, bez vidljivog sadržaja poruke",
  heroCaption:
    "Samo status: otvorena, uništena, istekla ili opozvana—nikad sama tajna.",
  intro: [
    "Nakon što pošaljete osetljiv link, prirodno pitanje je: **da li su ga već otvorili?** Čekanje u tišini je stresno; jurenje ljudi u četu samo stvara više plaintext buke.",
    "PrivateNote može da vas obavesti kada se status isporuke promeni—putem e-pošte, uživo upozorenjima u kartici dok je sajt otvoren, i opciono obaveštenjima pregledača—bez ikad slanja sadržaja beleške e-poštom.",
    "Ta vidljivost pomaže vam da rotirate akreditive, opozovete neotvorene linkove ili jednostavno prestanete da se pitate da li je predaja stigla.",
  ],
  sections: [
    {
      title: "Šta možete da saznate (a šta ne)",
      takeaway: "Upozorenja su o događajima životnog ciklusa, ne o tekstu poruke.",
      paragraphs: [
        "Tipični događaji uključuju belešku otvorenu, uništenu, isteklu, prilog preuzet i opozvanu. Formulacija ostaje namerno gruba: dovoljno za operativnu sigurnost, ne feed nadzora ponašanja čitanja.",
        "Model privatnosti PrivateNote-a i dalje važi. Statusna pošta i toastovi **ne** uključuju dešifrovanu tajnu. Ako vam treba strukturisan račun za audit trag, koristite **dokaz pristupa** na podobnim planovima—opisano u [opozovi i dokaz pristupa](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signal", "Gde se pojavljuje", "Dobro za"],
        rows: [
          [
            "Obaveštenja e-poštom (verifikovan nalog)",
            "E-pošta vašeg naloga",
            "Asinhrona potvrda kada niste na sajtu",
          ],
          [
            "Uživo upozorenja u kartici (prijavljeni)",
            "PrivateNote otvoren u pregledaču",
            "Skoro realno-vremenska svest tokom aktivne predaje",
          ],
          [
            "Obaveštenja pregledača (potrebna dozvola)",
            "OS dozvola zatražena iz Prilagodite",
            "Upozorenje kada je kartica u pozadini",
          ],
          [
            "Nalog → Aktivnost (zavisi od plana)",
            "Vaša privatna istorija aktivnosti",
            "Pregled onoga što se kasnije dogodilo",
          ],
        ],
      },
    },
    {
      title: "Kako da omogućite upozorenja",
      takeaway:
        "Prijavite se, verifikujte e-poštu, zatim uključite upozorenja po belešci ili u podešavanjima.",
      checklist: [
        "Prijavite se i verifikujte e-poštu na svom nalogu",
        "Omogućite obaveštenja e-poštom u Nalog → Podešavanja",
        "Pri kreiranju beleške otvorite Prilagodite → Obaveštenja e-poštom",
        "Izaberite obaveštenje pri otvaranju, ili pri otvaranju i uništenju (za tokove jednog čitanja)",
        "Dozvolite obaveštenja pregledača ako želite pingove na nivou OS-a",
        "Držite PrivateNote otvorenim za uživo toastove u kartici tokom kritičnih predaja",
      ],
      paragraphsAfterChecklist: [
        "Obaveštenja o otvaranju dostupna su prijavljenim Free korisnicima kada je e-pošta verifikovana; bogatije praćenje kao što su događaji preuzimanja priloga i alati za opoziv šire se na plaćenim planovima.",
        "Za osnovni obrazac predaje, pogledajte [kako napraviti privatnu belešku](blog:how-to-make-a-private-note) i [pošaljite tajnu poruku bez naloga](blog:send-secret-message-without-account) za primaoce.",
      ],
      midCta: {
        body: "Šaljete vremenski osetljivu tajnu i treba vam potvrda da je stigla?",
        button: "Kreirajte belešku sa upozorenjima o otvaranju",
      },
    },
    {
      title: "Operativno korišćenje upozorenja",
      takeaway:
        "Tretirajte „otvorena“ kao signal da rotirate ili zatvorite petlju—ne kao dokaz pažljivog čitanja.",
      bullets: [
        "Predaja lozinke: kada vidite otvorena, rotirajte ili potvrdite da je primalac promenio akreditiv",
        "Slanje dokumenta: otvorena + prilog preuzet (gde je dostupno) znači da je prozor fajla aktivan",
        "Nema otvaranja pre isteka: pratite drugim kanalom, ili opozovite ako je još neotvorena",
        "Neočekivano otvaranje: pretpostavite da link može biti kompromitovan; opozovite ako je moguće i pošaljite ponovo",
      ],
      calloutTitle: "Iskreno ograničenje",
      callout:
        "„Otvorena“ znači da je tok otkrivanja napredovao—ne da je čovek pažljivo pročitao svaku liniju, i ne da snimci ekrana nisu bili mogući.",
    },
    {
      title: "Očekivanja privatnosti",
      takeaway: "Praćenje isporuke ne sme da ponovo stvori e-poruku tajne.",
      paragraphs: [
        "Timovi ponekad zloupotrebljavaju potvrde čitanja kao nadzor produktivnosti. Dizajn PrivateNote-a drži upozorenja minimalnim: statusne oznake i reference, ne dumpovi sadržaja.",
        "To se poklapa sa obećanjem proizvoda drugde—enkripcija u pregledaču, [koncepti end-to-end enkripcije](blog:what-is-end-to-end-encryption), i nikad vraćanje tajne u e-poštu samo da bi se dokazalo da je stigla.",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Da li će upozorenje uključiti tekst moje beleške?",
          answer:
            "Ne. E-pošta i uživo upozorenja opisuju samo status. Sadržaj poruke ostaje van kanala obaveštenja.",
        },
        {
          question: "Da li moram da držim karticu otvorenom?",
          answer:
            "Obaveštenja e-poštom rade bez kartice. Uživo toastovi u kartici zahtevaju otvoren sajt; obaveštenja pregledača pomažu kada je kartica u pozadini i dozvola je data.",
        },
        {
          question: "Da li primaoci mogu da vide da sam omogućio upozorenja?",
          answer:
            "Primaoci se fokusiraju na otvaranje i otkrivanje beleške. Podešavanja obaveštenja na strani pošiljaoca nisu deo tajnog payload-a koji dešifruju.",
        },
        {
          question: "Šta ako treba da zaustavim pristup nakon slanja?",
          answer:
            "Ako je beleška još neotvorena, opozovite link sa ekrana uspeha ili aktivnosti naloga na podobnim planovima. Detalji u [opozovi i dokaz pristupa](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway: "Zatvorite petlju bez kopiranja tajne u drugi sandučić.",
      paragraphs: [
        "Znati kada je link otvoren omogućava vam da završite operativnu priču: rotirajte, pratite ili opozovite.",
        "Uključite kanal upozorenja koji odgovara načinu rada—e-pošta za asinhrono, uživo upozorenja za uživo predaje—i držite plaintext tamo gde treba: unutar enkriptovane beleške.",
      ],
    },
  ],
  ctaTitle: "Pošaljite tajnu. Dobijte status.",
  ctaBody:
    "Omogućite upozorenja o otvaranju i uništenju da znate kada se PrivateNote predaja pomera—bez stavljanja poruke u e-poštu.",
  ctaButton: "Kreirajte belešku sa upozorenjima",
};
