import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesHr: BlogGuideArticleCopy = {
  heroAlt:
    "Prikaz za primatelja PrivateNote zaslona za otvaranje s jasnim upozorenjem Otvori kada ste spremni prije dekripcije",
  heroCaption:
    "Otvaranje je namjerno: primatelj bira kada dešifrirati—i kada politika samouništenja može stupiti na snagu.",
  intro: [
    "Otvaranje jednokratne bilješke treba biti svjesno. PrivateNote stoga prikazuje **klik-za-otvaranje** kapiju s eksplicitnim upozorenjem prije nego što dekripcija započne.",
    "Poveznica može stići ranije. Šifrirani tekst može ostati šifriran dok netko nije spreman. Dekripcija i potrošnja događaju se tek nakon što primatelj potvrdi **Otvori bilješku**, uz tekst koji jasno kaže posljedicu: otvorite samo kada ste spremni—ovo se ne može poništiti.",
    "Ta pauza je namjerna. Smanjuje slučajna otvaranja zbog pregleda poveznica, pogrešnih dodira ili otvaranja na pogrešnom uređaju prije nego što ste spremni potrošiti jednokratnu bilješku.",
  ],
  sections: [
    {
      title: "Korak potvrde, ne zakazano otključavanje",
      takeaway:
        "Primatelj bira kada otvoriti; poslužitelj ne otključava bilješku po kalendaru.",
      paragraphs: [
        "Danas u proizvodu nema prekidača „otključaj ovu bilješku sljedećeg utorka u 09:00“. Umjesto toga, PrivateNote razdvaja **isporuku** od **otvaranja**.",
        "Poveznicu možete poslati kad god koordinacija to zahtijeva. Primatelj može pričekati dok ne bude na privatnom zaslonu, dok ne pripremi eventualni verifikacijski kod ili lozinku, i dok nije spreman za jednokratno otvaranje. Tajna ostaje zapečaćena do te svjesne radnje.",
        "Povezane vremenske kontrole i dalje su bitne: životni vijek bilješke (koliko dugo poveznica radi ako se nikad ne otvori) i prozori za preuzimanje privitaka (koliko dugo datoteke ostaju dostupne nakon otvaranja). One ograničavaju dostupnost; klik-za-otvaranje ograničava *kada dekripcija počinje*.",
      ],
    },
    {
      title: "Zašto su slučajna otvaranja skupa",
      takeaway: "Jednokratne bilješke jednako kažnjavaju radoznalost i pogrešne dodire.",
      paragraphs: [
        "Ako je bilješka konfigurirana za jedan prikaz, prvo uspješno otvaranje može uništiti daljnji pristup. Otvaranje na zaključanom zaslonu telefona, dijeljenom laptopu ili u kafiću s javnim Wi‑Fi-jem može potrošiti jedini prikaz—ili izložiti sadržaj na pogrešnom mjestu.",
        "Zaslon za otvaranje nameće pauzu. U kombinaciji s [verifikacijskim kodovima za primatelja](blog:recipient-verification-code-before-reveal) dobivate dva svjesna koraka prije nego što se pojavi otvoreni tekst.",
      ],
      calloutTitle: "Tekst proizvoda, namjerno",
      callout:
        "„Otvorite samo kad ste spremni — bilješka će se samouništiti nakon čitanja.“ nije marketinški ukras. To je sigurnosna ograda za tokove samouništenja pri otvaranju.",
    },
    {
      title: "Kako radi tok za primatelja",
      takeaway: "Otvoriti poveznicu → opcionalna verifikacija → otvoriti → lokalno dešifrirati.",
      checklist: [
        "Otvoriti potpuni PrivateNote URL",
        "Unijeti verifikacijski kod ako ga je pošiljatelj zahtijevao",
        "Pročitati upozorenje prije otvaranja",
        "Pritisnuti Otvori bilješku samo kada ste spremni",
        "Dekripcija se događa u pregledniku; zatim slijediti eventualnu politiku otvaranja/samouništenja",
      ],
      paragraphsAfterChecklist: [
        "Pošiljatelji mogu ojačati pauzu jasnom uputom: „Šaljem poveznicu sada; ne otvarajte je dok ne budemo na pozivu.“ Zaslon potvrde podržava tu uputu, ali ne zakazuje niti tehnički nameće buduće vrijeme otvaranja.",
        "Za širi jednokratni model, pogledajte [jednokratne tajne poveznice](blog:one-time-secret-links) i [kako napraviti privatnu bilješku](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Pošaljite bilješku koju primatelj može sačuvati dok ne bude spreman otvoriti je.",
        button: "Stvori privatnu bilješku",
      },
    },
    {
      title: "Vremenske kontrole koje idu uz otvaranje",
      takeaway:
        "Životni vijek, limiti otvaranja i prozori za datoteke dopunjuju klik-kapiju.",
      comparisonTable: {
        headers: ["Kontrola", "Štiti od", "Tipična uporaba"],
        rows: [
          [
            "Klik-za-otvaranje",
            "Slučajne ili prerane dekripcije",
            "Svaka jednokratna ili vrlo osjetljiva bilješka",
          ],
          [
            "Životni vijek bilješke",
            "Zastarjelih neotvorenih poveznica",
            "„Ako ne otvore u 24 sata, uništi“",
          ],
          [
            "Limit otvaranja / prikaza",
            "Ponovljenog pristupa nakon predaje",
            "Jednom (ili mali fiksni broj)",
          ],
          [
            "Prozor za preuzimanje privitaka",
            "Beskrajnih ponovnih preuzimanja datoteka nakon otvaranja",
            "15 minuta zadano; dulje na odgovarajućim planovima",
          ],
        ],
      },
    },
    {
      title: "Često postavljana pitanja",
      faqs: [
        {
          question: "Mogu li zakazati otključavanje bilješke u budućnosti?",
          answer:
            "Ne kao raspored na poslužitelju. Podijelite poveznicu ranije ako treba i zamolite primatelja da pričeka—klik-za-otvaranje plus opcionalna verifikacija drže sadržaj zapečaćenim dok ne potvrdi.",
        },
        {
          question: "Pretpregled poveznice dešifrira li bilješku?",
          answer:
            "Potvrda otvaranja namjerni je korak dekripcije. Primatelji ne trebaju pritisnuti Otvori dok nisu spremni da politika samouništenja stupi na snagu.",
        },
        {
          question: "Što ako netko greškom otvori poveznicu?",
          answer:
            "Ako stanu prije Otvaranja, možda se mogu kasnije vratiti (ovisno o životnom vijeku). Nakon Otvaranja jednokratne bilješke, daljnji pristup tipično nestaje—pošaljite novu bilješku ako treba.",
        },
        {
          question: "Kako se ovo odnosi na e-mail obavijesti?",
          answer:
            "Upozorenja o otvaranju i uništenju govore pošiljatelju kada se status promijeni. Ne uključuju sadržaj poruke. Pogledajte [kako znati kada je tajna poveznica otvorena](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Zaključak",
      takeaway:
        "Otvaranje je svjesna radnja, ne automatska posljedica učitavanja poveznice.",
      paragraphs: [
        "Klik-za-otvaranje omogućuje slanje poveznice ranije bez dešifriranja bilješke samo zato što se učitala odredišna stranica.",
        "Kombinirajte ga s kratkim životnim vijekom, verifikacijom kada su kanali slabi i jasnim uputama primatelju—i dobivate praktično odgođeno otvaranje bez pretvaranja da proizvod može daljinski obrisati snimku zaslona.",
      ],
    },
  ],
  ctaTitle: "Neka primatelj otvori tek kada je spreman.",
  ctaBody:
    "PrivateNote drži šifrirani tekst zapečaćenim dok primatelj ne potvrdi otvaranje—tako je manje vjerojatno da se jednokratne bilješke „spale“ slučajnim dodirom.",
  ctaButton: "Stvori bilješku s klik-za-otvaranje",
};
