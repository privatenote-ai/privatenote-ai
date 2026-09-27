import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessHr: BlogGuideArticleCopy = {
  heroAlt:
    "Pregled aktivnosti računa s neotvorenom bilješkom i jasnom opcijom za opoziv poveznice",
  heroCaption:
    "Preispitali ste se prije nego što ju je netko otvorio? Uništite poveznicu. Treba vam potvrda? Pogledajte dokaz pristupa.",
  intro: [
    "Sigurno dijeljenje nije samo enkripcija u trenutku slanja. Riječ je i o **kontroli nakon toga**: zaustaviti poveznicu koju niste trebali poslati i sačuvati evidenciju koja štiti privatnost o tome što se dogodilo s poveznicom koju jeste poslali.",
    "PrivateNote planovi Starter i Business dodaju dva komplementarna alata. **Opoziv** uništava neotvorenu poveznicu tako da se više ne može otkriti. **Dokaz pristupa** prikazuje jednostavnu vremensku crtu—stvoreno, otvoreno, privitak preuzet, uništeno, isteklo ili opozvano—bez izlaganja sadržaja bilješke.",
    "Zajedno odgovaraju na dva pitanja koja timovi zaista postavljaju: „Mogu li vratiti?“ i „Mogu li pokazati da je poveznica otvorena?“",
  ],
  sections: [
    {
      title: "Opozovite dok je još neotvoreno",
      takeaway:
        "Opoziv djeluje prije otkrivanja—ne nakon što je netko već dešifrirao kopiju.",
      paragraphs: [
        "Ako bilješka još nije otvorena, možete je opozvati s ekrana uspjeha nakon stvaranja ili iz Račun → Aktivnost. Poveznica prestaje raditi; primatelji koji stignu kasnije vide da pristup više ne postoji.",
        "Opoziv je pravi potez kada ste zalijepili pogrešnog primatelja, primijetili tajnu u pogrešnom chatu ili odlučili da predaja treba pričekati. To **nije** daljinsko brisanje datoteke koju je netko već preuzeo nakon otkrivanja—nijedan iskren E2EE alat za predaju to ne može obećati.",
      ],
      checklist: [
        "Stvorite bilješku na Starter ili Business planu",
        "Ako nešto izgleda pogrešno, odmah opozovite s ekrana uspjeha",
        "Ili otvorite Račun → Aktivnost i opozovite dok je status još neotvoreno",
        "Pošaljite zamjensku bilješku ako primatelj i dalje treba tajnu",
      ],
      midCta: {
        body: "Trebate povlačenje i potvrde kod osjetljivih predaja?",
        button: "Stvorite bilješku koju možete opozvati",
      },
    },
    {
      title: "Dokaz pristupa bez curenja sadržaja",
      takeaway:
        "Evidencija statusa koja štiti privatnost: poveznica je otvorena—ne transkript čitanja.",
      paragraphs: [
        "Dokaz pristupa namijenjen je operativnim i compliance razgovorima kojima treba dokaz događaja isporuke bez stavljanja tajni u e-poštu ili tikete.",
        "Vremenska crta ostaje na visokoj razini: stvoreno, poveznica otvorena, privitak preuzet (kada se prati), uništeno, isteklo, opozvano. To se poklapa sa stavom o privatnosti kod [obavijesti o otvaranju](blog:know-when-secret-link-opened): status, ne sadržaj.",
      ],
      calloutTitle: "Pažljivo pročitajte oznaku",
      callout:
        "Dokaz pristupa je potvrda da je poveznica otvorena—ne kriptografski dokaz da je određena osoba pažljivo pročitala svaku riječ, niti DRM protiv snimaka zaslona.",
    },
    {
      title: "Kako se opoziv i dokaz uklapaju",
      takeaway:
        "Spriječite pristup kada možete; dokumentirajte pristup kada morate.",
      comparisonTable: {
        headers: ["Situacija", "Koristite", "Ishod"],
        rows: [
          [
            "Pogrešan primatelj, još neotvoreno",
            "Opoziv",
            "Poveznica umire; stvorite ispravljenu bilješku",
          ],
          [
            "Predaja završena, auditor pita „je li otvoreno?“",
            "Dokaz pristupa",
            "Pokažite događaje vremenske crte bez sadržaja",
          ],
          [
            "Bilješka već otkrivena",
            "Rotirajte tajnu / tretirajte kao izloženu",
            "Opoziv više ne vraća plaintext kopije",
          ],
          [
            "Čeka se primatelj",
            "Obavijesti + vijek trajanja",
            "Pratite ili automatski isteknite ako nikad nije otvoreno",
          ],
        ],
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Mogu li opozvati nakon što je primatelj otvorio bilješku?",
          answer:
            "Opoziv cilja neotvorene bilješke. Nakon otkrivanja pretpostavite da primatelj može zadržati ono što je vidio; rotirajte vjerodajnice ili tretirajte dokument kao isporučen.",
        },
        {
          question: "Uključuje li dokaz pristupa tekst poruke?",
          answer:
            "Ne. To je samo vremenska crta statusa. Sadržaj ostaje izvan Aktivnosti i prikaza dokaza.",
        },
        {
          question: "Je li opoziv dostupan na Free planu?",
          answer:
            "Opoziv i dokaz pristupa mogućnosti su Starter/Business planova. Free korisnici i dalje dobivaju enkripciju, kratke vijekove trajanja i obavijesti o otvaranju kada se prijave s verificiranom e-poštom.",
        },
        {
          question: "Gdje kasnije nalazim dokaz?",
          answer:
            "Otvorite Račun → Aktivnost, pronađite bilješku i odaberite Prikaži dokaz pristupa kada plan to podržava.",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway: "Kontrolirajte neotvorenu poveznicu; dokumentirajte otvorenu.",
      paragraphs: [
        "Enkripcija odgovara na „tko ovo može pročitati u prijenosu i u mirovanju.“ Opoziv i dokaz odgovaraju na „što radimo dalje.“",
        "Koristite ih uz [verifikacijske kodove](blog:recipient-verification-code-before-reveal) i [obavijesti o otvaranju](blog:know-when-secret-link-opened) za potpuni ciklus predaje—od slanja, preko potvrde, do povlačenja ili potvrde.",
      ],
    },
  ],
  ctaTitle: "Vratite neotvorenu tajnu.",
  ctaBody:
    "Opozovite poveznice koje nikad ne bi trebale biti otvorene i sačuvajte vremensku crtu koja štiti privatnost kada trebate pokazati da je predaja otvorena—bez slanja tajne e-poštom.",
  ctaButton: "Stvori privatnu bilješku",
};
