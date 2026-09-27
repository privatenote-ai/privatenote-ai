import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessSr: BlogGuideArticleCopy = {
  heroAlt:
    "Pregled aktivnosti naloga sa neotvorenom beleškom i jasnom opcijom da se link opozove",
  heroCaption:
    "Preispitali ste se pre nego što je neko otvorio? Uništite link. Treba vam potvrda? Pogledajte dokaz pristupa.",
  intro: [
    "Bezbedno deljenje nije samo enkripcija u trenutku slanja. Reč je i o **kontroli posle**: da zaustavite link koji niste trebali da pošaljete i da sačuvate evidenciju koja štiti privatnost o tome šta se desilo sa linkom koji jeste poslali.",
    "PrivateNote planovi Starter i Business dodaju dva komplementarna alata. **Opoziv** uništava neotvoreni link tako da više ne može da se otkrije. **Dokaz pristupa** prikazuje jednostavnu vremensku liniju—kreirano, otvoreno, prilog preuzet, uništeno, isteklo ili opozvano—bez izlaganja sadržaja beleške.",
    "Zajedno odgovaraju na dva pitanja koja timovi zaista postavljaju: „Mogu li da vratim?“ i „Mogu li da pokažem da je link otvoren?“",
  ],
  sections: [
    {
      title: "Opozovite dok je još neotvoreno",
      takeaway:
        "Opoziv deluje pre otkrivanja—ne nakon što je neko već dešifrovao kopiju.",
      paragraphs: [
        "Ako beleška još nije otvorena, možete je opozvati sa ekrana uspeha nakon kreiranja ili iz Račun → Aktivnost. Link prestaje da radi; primaoci koji stignu kasnije vide da pristup više ne postoji.",
        "Opoziv je pravi potez kada ste nalepili pogrešnog primaoca, primetili tajnu u pogrešnom četu ili odlučili da predaja treba da sačeka. To **nije** daljinsko brisanje fajla koji je neko već preuzeo posle otkrivanja—nijedan iskren E2EE alat za predaju to ne može da obeća.",
      ],
      checklist: [
        "Kreirajte belešku na Starter ili Business planu",
        "Ako nešto izgleda pogrešno, odmah opozovite sa ekrana uspeha",
        "Ili otvorite Račun → Aktivnost i opozovite dok je status još neotvoreno",
        "Pošaljite zamensku belešku ako primalac i dalje treba tajnu",
      ],
      midCta: {
        body: "Treba vam povlačenje i potvrde kod osetljivih predaja?",
        button: "Kreirajte belešku koju možete da opozovete",
      },
    },
    {
      title: "Dokaz pristupa bez curenja sadržaja",
      takeaway:
        "Evidencija statusa koja štiti privatnost: link je otvoren—ne transkript čitanja.",
      paragraphs: [
        "Dokaz pristupa je namenjen operativnim i compliance razgovorima kojima treba dokaz događaja isporuke bez stavljanja tajni u mejl ili tikete.",
        "Vremenska linija ostaje na visokom nivou: kreirano, link otvoren, prilog preuzet (kada se prati), uništeno, isteklo, opozvano. To se poklapa sa stavom o privatnosti kod [obaveštenja o otvaranju](blog:know-when-secret-link-opened): status, ne sadržaj.",
      ],
      calloutTitle: "Pažljivo pročitajte oznaku",
      callout:
        "Dokaz pristupa je potvrda da je link otvoren—ne kriptografski dokaz da je određena osoba pažljivo pročitala svaku reč, niti DRM protiv snimaka ekrana.",
    },
    {
      title: "Kako se opoziv i dokaz uklapaju",
      takeaway:
        "Sprečite pristup kada možete; dokumentujte pristup kada morate.",
      comparisonTable: {
        headers: ["Situacija", "Koristite", "Ishod"],
        rows: [
          [
            "Pogrešan primalac, još neotvoreno",
            "Opoziv",
            "Link umire; kreirajte ispravljenu belešku",
          ],
          [
            "Predaja završena, auditor pita „da li je otvoreno?“",
            "Dokaz pristupa",
            "Pokažite događaje vremenske linije bez sadržaja",
          ],
          [
            "Beleška već otkrivena",
            "Rotirajte tajnu / tretirajte kao izloženu",
            "Opoziv više ne vraća plaintext kopije",
          ],
          [
            "Čeka se primalac",
            "Obaveštenja + vek trajanja",
            "Pratite ili automatski isteknite ako nikad nije otvoreno",
          ],
        ],
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Mogu li da opozovem nakon što je primalac otvorio belešku?",
          answer:
            "Opoziv cilja neotvorene beleške. Posle otkrivanja, pretpostavite da primalac može da zadrži ono što je video; rotirajte kredencijale ili tretirajte dokument kao isporučen.",
        },
        {
          question: "Da li dokaz pristupa uključuje tekst poruke?",
          answer:
            "Ne. To je samo vremenska linija statusa. Sadržaj ostaje van Aktivnosti i prikaza dokaza.",
        },
        {
          question: "Da li je opoziv dostupan na Free planu?",
          answer:
            "Opoziv i dokaz pristupa su mogućnosti Starter/Business planova. Free korisnici i dalje dobijaju enkripciju, kratke vekove trajanja i obaveštenja o otvaranju kada se prijave sa verifikovanim mejlom.",
        },
        {
          question: "Gde kasnije nalazim dokaz?",
          answer:
            "Otvorite Račun → Aktivnost, pronađite belešku i izaberite Prikaži dokaz pristupa kada plan to podržava.",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway: "Kontrolišite neotvoreni link; dokumentujte otvoreni.",
      paragraphs: [
        "Enkripcija odgovara na „ko može ovo da pročita u tranzitu i u mirovanju.“ Opoziv i dokaz odgovaraju na „šta radimo dalje.“",
        "Koristite ih uz [verifikacione kodove](blog:recipient-verification-code-before-reveal) i [obaveštenja o otvaranju](blog:know-when-secret-link-opened) za kompletan ciklus predaje—od slanja, preko potvrde, do povlačenja ili potvrde.",
      ],
    },
  ],
  ctaTitle: "Vratite neotvorenu tajnu.",
  ctaBody:
    "Opozovite linkove koji nikad ne bi trebalo da se otvore i sačuvajte vremensku liniju koja štiti privatnost kada treba da pokažete da je predaja otvorena—bez slanja tajne mejlom.",
  ctaButton: "Kreiraj privatnu belešku",
};
