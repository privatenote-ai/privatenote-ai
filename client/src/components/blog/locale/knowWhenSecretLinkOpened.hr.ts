import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedHr: BlogGuideArticleCopy = {
  heroAlt:
    "Panel obavijesti koji prikazuje upozorenje da je bilješka otvorena, bez vidljivog sadržaja poruke",
  heroCaption:
    "Samo status: otvorena, uništena, istekla ili opozvana—nikad sama tajna.",
  intro: [
    "Nakon što pošaljete osjetljivu poveznicu, prirodno je pitanje: **jesu li je već otvorili?** Čekanje u tišini je stresno; jurenje ljudi u chatu stvara samo više plaintext buke.",
    "PrivateNote vas može obavijestiti kada se status isporuke promijeni—putem e-pošte, uživo upozorenjima u kartici dok je stranica otvorena, i opcionalno obavijestima preglednika—bez ikad slanja sadržaja bilješke e-poštom.",
    "Ta vidljivost pomaže vam rotirati vjerodajnice, opozvati neotvorene poveznice ili jednostavno prestati pitati se je li predaja stigla.",
  ],
  sections: [
    {
      title: "Što možete saznati (a što ne)",
      takeaway: "Upozorenja su o događajima životnog ciklusa, ne o tekstu poruke.",
      paragraphs: [
        "Tipični događaji uključuju bilješku otvorenu, uništenu, isteklu, privitak preuzet i opozvanu. Formulacija ostaje namjerno gruba: dovoljno za operativnu sigurnost, ne feed nadzora ponašanja čitanja.",
        "Model privatnosti PrivateNotea i dalje vrijedi. Statusna pošta i toastovi **ne** uključuju dešifriranu tajnu. Ako trebate strukturirani račun za audit trag, koristite **dokaz pristupa** na podobnim planovima—opisano u [opozovi i dokaz pristupa](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signal", "Gdje se pojavljuje", "Dobro za"],
        rows: [
          [
            "Obavijesti e-poštom (verificiran račun)",
            "E-pošta vašeg računa",
            "Asinkrona potvrda kada niste na stranici",
          ],
          [
            "Uživo upozorenja u kartici (prijavljeni)",
            "PrivateNote otvoren u pregledniku",
            "Svijest gotovo u stvarnom vremenu tijekom aktivne predaje",
          ],
          [
            "Obavijesti preglednika (potrebna dozvola)",
            "OS dozvola zatražena iz Prilagodite",
            "Upozorenje kada je kartica u pozadini",
          ],
          [
            "Račun → Aktivnost (ovisno o planu)",
            "Vaša privatna povijest aktivnosti",
            "Pregled onoga što se kasnije dogodilo",
          ],
        ],
      },
    },
    {
      title: "Kako omogućiti upozorenja",
      takeaway:
        "Prijavite se, verificirajte e-poštu, zatim uključite upozorenja po bilješci ili u postavkama.",
      checklist: [
        "Prijavite se i verificirajte e-poštu na svom računu",
        "Omogućite obavijesti e-poštom u Račun → Postavke",
        "Pri stvaranju bilješke otvorite Prilagodite → Obavijesti putem e-pošte",
        "Odaberite obavijest pri otvaranju, ili pri otvaranju i uništenju (za tokove jednog čitanja)",
        "Dopustite obavijesti preglednika ako želite pingove na razini OS-a",
        "Držite PrivateNote otvorenim za uživo toastove u kartici tijekom kritičnih predaja",
      ],
      paragraphsAfterChecklist: [
        "Obavijesti o otvaranju dostupne su prijavljenim Free korisnicima nakon što je e-pošta verificirana; bogatije praćenje poput događaja preuzimanja privitaka i alata za opoziv širi se na plaćenim planovima.",
        "Za osnovni obrazac predaje, pogledajte [kako napraviti privatnu bilješku](blog:how-to-make-a-private-note) i [pošaljite tajnu poruku bez računa](blog:send-secret-message-without-account) za primatelje.",
      ],
      midCta: {
        body: "Šaljete vremenski osjetljivu tajnu i trebate potvrdu da je stigla?",
        button: "Stvorite bilješku s upozorenjima o otvaranju",
      },
    },
    {
      title: "Operativno korištenje upozorenja",
      takeaway:
        "Tretirajte „otvorena“ kao signal za rotaciju ili zatvaranje petlje—ne kao dokaz pažljivog čitanja.",
      bullets: [
        "Predaja lozinke: kada vidite otvorena, rotirajte ili potvrdite da je primatelj promijenio vjerodajnicu",
        "Slanje dokumenta: otvorena + privitak preuzet (gdje je dostupno) znači da je prozor datoteke aktivan",
        "Nema otvaranja prije isteka: pratite drugim kanalom, ili opozovite ako je još neotvorena",
        "Neočekivano otvaranje: pretpostavite da poveznica može biti kompromitirana; opozovite ako je moguće i pošaljite ponovno",
      ],
      calloutTitle: "Iskreno ograničenje",
      callout:
        "„Otvorena“ znači da je tok otkrivanja napredovao—ne da je čovjek pažljivo pročitao svaku liniju, i ne da snimke zaslona nisu bile moguće.",
    },
    {
      title: "Očekivanja privatnosti",
      takeaway: "Praćenje isporuke ne smije ponovno stvoriti e-poruku tajne.",
      paragraphs: [
        "Timovi ponekad zloupotrebljavaju potvrde čitanja kao nadzor produktivnosti. Dizajn PrivateNotea drži upozorenja minimalnima: statusne oznake i reference, ne dumpovi sadržaja.",
        "To se podudara s obećanjem proizvoda drugdje—enkripcija u pregledniku, [koncepti end-to-end enkripcije](blog:what-is-end-to-end-encryption), i nikad vraćanje tajne u e-poštu samo da bi se dokazalo da je stigla.",
      ],
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Hoće li upozorenje uključiti tekst moje bilješke?",
          answer:
            "Ne. E-pošta i uživo upozorenja opisuju samo status. Sadržaj poruke ostaje izvan kanala obavijesti.",
        },
        {
          question: "Moram li držati karticu otvorenom?",
          answer:
            "Obavijesti e-poštom rade bez kartice. Uživo toastovi u kartici zahtijevaju otvorenu stranicu; obavijesti preglednika pomažu kada je kartica u pozadini i dozvola je dana.",
        },
        {
          question: "Mogu li primatelji vidjeti da sam omogućio upozorenja?",
          answer:
            "Primatelji se usredotočuju na otvaranje i otkrivanje bilješke. Postavke obavijesti na strani pošiljatelja nisu dio tajnog payloada koji dešifriraju.",
        },
        {
          question: "Što ako trebam zaustaviti pristup nakon slanja?",
          answer:
            "Ako je bilješka još neotvorena, opozovite poveznicu s zaslona uspjeha ili aktivnosti računa na podobnim planovima. Detalji u [opozovi i dokaz pristupa](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway: "Zatvorite petlju bez kopiranja tajne u drugi sandučić.",
      paragraphs: [
        "Znati kada je poveznica otvorena omogućuje vam završiti operativnu priču: rotirati, pratiti ili opozvati.",
        "Uključite kanal upozorenja koji odgovara načinu rada—e-pošta za asinkrono, uživo upozorenja za uživo predaje—i držite plaintext tamo gdje treba: unutar enkriptirane bilješke.",
      ],
    },
  ],
  ctaTitle: "Pošaljite tajnu. Dobijte status.",
  ctaBody:
    "Omogućite upozorenja o otvaranju i uništenju da znate kada se PrivateNote predaja pomiče—bez stavljanja poruke u e-poštu.",
  ctaButton: "Stvorite bilješku s upozorenjima",
};
