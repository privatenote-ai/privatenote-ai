import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesSr: BlogGuideArticleCopy = {
  heroAlt:
    "Prikaz za primaoca PrivateNote ekrana za otvaranje sa jasnim upozorenjem Otvori kada ste spremni pre dekripcije",
  heroCaption:
    "Otvaranje je namerno: primalac bira kada da dekriptuje—i kada politika samouništenja može da stupi na snagu.",
  intro: [
    "Otvaranje jednokratne poruke treba da bude svesno. PrivateNote zato prikazuje **klik-za-otvaranje** kapiju sa eksplicitnim upozorenjem pre nego što dekripcija počne.",
    "Link može da stigne ranije. Šifrovani tekst može da ostane šifrovan dok neko nije spreman. Dekripcija i potrošnja se dešavaju tek nakon što primalac potvrdi **Otvori Privatnu poruku**, uz tekst koji jasno kaže posledicu: otvorite samo kada ste spremni—ovo se ne može poništiti.",
    "Ta pauza je namerna. Smanjuje slučajna otvaranja zbog pregleda linkova, pogrešnih dodira ili otvaranja na pogrešnom uređaju pre nego što ste spremni da potrošite jednokratnu poruku.",
  ],
  sections: [
    {
      title: "Korak potvrde, ne zakazano otključavanje",
      takeaway:
        "Primalac bira kada da otvori; server ne otključava poruku po kalendaru.",
      paragraphs: [
        "Danas u proizvodu nema prekidača „otključaj ovu poruku sledećeg utorka u 09:00“. Umesto toga, PrivateNote razdvaja **isporuku** od **otvaranja**.",
        "Link možete poslati kad god koordinacija to zahteva. Primalac može da sačeka dok ne bude na privatnom ekranu, dok ne pripremi eventualni verifikacioni kod ili lozinku, i dok nije spreman za jednokratno otvaranje. Tajna ostaje zapečaćena do te svesne radnje.",
        "Povezane vremenske kontrole i dalje bitne: vek trajanja poruke (koliko dugo link radi ako se nikad ne otvori) i prozori za preuzimanje priloga (koliko dugo fajlovi ostaju dostupni posle otvaranja). One ograničavaju dostupnost; klik-za-otvaranje ograničava *kada dekripcija počinje*.",
      ],
    },
    {
      title: "Zašto su slučajna otvaranja skupa",
      takeaway: "Jednokratne poruke jednako kažnjavaju radoznalost i pogrešne dodire.",
      paragraphs: [
        "Ako je poruka podešena za jedan prikaz, prvo uspešno otvaranje može uništiti dalji pristup. Otvaranje na zaključanom ekranu telefona, deljenom laptopu ili u kafiću sa javnim Wi‑Fi-jem može potrošiti jedini prikaz—ili izložiti sadržaj na pogrešnom mestu.",
        "Ekran za otvaranje nameće pauzu. U kombinaciji sa [verifikacionim kodovima za primaoca](blog:recipient-verification-code-before-reveal) dobijate dva svesna koraka pre nego što se pojavi otvoreni tekst.",
      ],
      calloutTitle: "Tekst proizvoda, namerno",
      callout:
        "„Otvorite samo kada ste spremni — poruka će se samouništiti nakon čitanja.“ nije marketinški ukras. To je sigurnosna ograda za tokove samouništenja pri otvaranju.",
    },
    {
      title: "Kako radi tok za primaoca",
      takeaway: "Otvoriti link → opciona verifikacija → otvoriti → lokalno dekriptovati.",
      checklist: [
        "Otvoriti kompletan PrivateNote URL",
        "Uneti verifikacioni kod ako ga je pošiljalac zahtevao",
        "Pročitati upozorenje pre otvaranja",
        "Pritisnuti Otvori Privatnu poruku samo kada ste spremni",
        "Dekripcija se dešava u pregledaču; zatim slediti eventualnu politiku otvaranja/samouništenja",
      ],
      paragraphsAfterChecklist: [
        "Pošiljaoci mogu da ojačaju pauzu jasnim uputstvom: „Šaljem link sada; ne otvarajte ga dok ne budemo na pozivu.“ Ekran potvrde podržava to uputstvo, ali ne zakazuje niti tehnički nameće buduće vreme otvaranja.",
        "Za širi jednokratni model, pogledajte [jednokratne tajne linkove](blog:one-time-secret-links) i [kako napraviti privatnu poruku](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Pošaljite poruku koju primalac može da sačuva dok ne bude spreman da je otvori.",
        button: "Kreiraj privatnu poruku",
      },
    },
    {
      title: "Vremenske kontrole koje idu uz otvaranje",
      takeaway:
        "Vek trajanja, limiti otvaranja i prozori za fajlove dopunjuju klik-kapiju.",
      comparisonTable: {
        headers: ["Kontrola", "Štiti od", "Tipična upotreba"],
        rows: [
          [
            "Klik-za-otvaranje",
            "Slučajne ili prerane dekripcije",
            "Svaka jednokratna ili veoma osetljiva poruka",
          ],
          [
            "Vek trajanja poruke",
            "Zastarelih neotvorenih linkova",
            "„Ako ne otvore za 24 sata, uništi“",
          ],
          [
            "Limit otvaranja / prikaza",
            "Ponovljenog pristupa posle predaje",
            "Jednom (ili mali fiksni broj)",
          ],
          [
            "Prozor za preuzimanje priloga",
            "Beskrajnih ponovnih preuzimanja fajlova posle otvaranja",
            "15 minuta podrazumevano; duže na odgovarajućim planovima",
          ],
        ],
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Mogu li da zakažem otključavanje poruke u budućnosti?",
          answer:
            "Ne kao raspored na serveru. Podelite link ranije ako treba i zamolite primaoca da sačeka—klik-za-otvaranje plus opciona verifikacija drže sadržaj zapečaćenim dok ne potvrdi.",
        },
        {
          question: "Da li pregled linka dekriptuje poruku?",
          answer:
            "Potvrda otvaranja je namerni korak dekripcije. Primaoci ne treba da pritisnu Otvori dok nisu spremni da politika samouništenja stupi na snagu.",
        },
        {
          question: "Šta ako neko greškom otvori link?",
          answer:
            "Ako stanu pre Otvaranja, možda mogu kasnije da se vrate (zavisno od veka trajanja). Posle Otvaranja jednokratne poruke, dalji pristup je tipično nestao—pošaljite novu poruku ako treba.",
        },
        {
          question: "Kako se ovo odnosi na e-mail obaveštenja?",
          answer:
            "Upozorenja o otvaranju i uništenju govore pošiljaocu kada se status promeni. Ne uključuju sadržaj poruke. Pogledajte [kako znati kada je tajni link otvoren](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway:
        "Otvaranje je svesna radnja, ne automatska posledica učitavanja linka.",
      paragraphs: [
        "Klik-za-otvaranje omogućava da pošaljete link ranije bez dekripcije poruke samo zato što se učitala odredišna stranica.",
        "Kombinujte ga sa kratkim vekom trajanja, verifikacijom kada su kanali slabi i jasnim uputstvima primaocu—i dobijate praktično odloženo otvaranje bez pretvaranja da proizvod može daljinski da obriše snimak ekrana.",
      ],
    },
  ],
  ctaTitle: "Neka primalac otvori tek kada je spreman.",
  ctaBody:
    "PrivateNote drži šifrovani tekst zapečaćenim dok primalac ne potvrdi otvaranje—tako je manje verovatno da se jednokratne poruke „spale“ slučajnim dodirom.",
  ctaButton: "Kreiraj poruku sa klik-za-otvaranje",
};
