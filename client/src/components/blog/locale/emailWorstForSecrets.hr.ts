import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsHr: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop na stolu s e-poštom koja prikazuje vjerodajnice za poslužitelj i SSH privatni ključ u čistom tekstu",
  intro:
    "E-pošta je postala standard za razmjenu gotovo svega—ugovora, lozinki, API ključeva, bankovnih podataka, medicinskih dokumenata, osobnih iskaznica, Wi-Fi lozinki i kodova za oporavak. Većina nas šalje osjetljive informacije e-poštom bez puno razmišljanja.",
  calloutTitle: "E-pošta je izgrađena za dostavu poruka—ne za nestajanje",
  calloutBody:
    "Kad pošaljete e-poštu, često gubite kontrolu nad tim gdje završi, koliko dugo se pohranjuje i tko joj u budućnosti može pristupiti. Ako šaljete nešto što treba ostati privatno, e-pošta je obično pogrešan alat.",
  emailCopies: [
    "vašem pretincu",
    "pretincu primatelja",
    "sigurnosnim kopijama pružatelja e-pošte",
    "arhiviranim kopijama",
    "sinkroniziranim uređajima",
    "sustavima sigurnosnih kopija tvrtke",
    "izvezenim PST ili MBOX datotekama",
    "infrastrukturi za oporavak od katastrofe",
  ],
  agedSecretsExamples: [
    "lozinka produkcijske baze podataka",
    "API ključ",
    "SSH vjerodajnice",
    "VPN podaci za prijavu",
    "fraza za oporavak kriptovalute",
  ],
  forwardingPaths: [
    "proslijeđena",
    "kopirana u sustave za tikete",
    "zalijepljena u chat aplikacije",
    "priložena drugim e-porukama",
    "dijeljena s izvođačima",
    "uključena u zahtjeve za podršku",
  ],
  aiProcessingUses: [
    "prepoznavanje spama",
    "zaštita od phishinga",
    "otkrivanje zlonamjernog softvera",
    "pametni prijedlozi odgovora",
    "kategorizacija pretinca",
    "pretraživanje",
    "produktivnost",
    "pisanje i sažimanje uz pomoć AI-ja",
  ],
  oneTimeSecretExamples: [
    "lozinka",
    "API ključ",
    "kod za oporavak",
    "softverska licenca",
    "vjerodajnice za poslužitelj",
    "povjerljiva poruka",
  ],
  oneTimeBenefits: [
    "Nema povijesti pretinca.",
    "Nema pretraživog arhiva.",
    "Nema slučajnog prosljeđivanja same tajne.",
    "Nema zaboravljenih kopija koje leže u pretincima godinama.",
  ],
  sections: [
    {
      title: "Vaša e-pošta ne postoji samo na jednom mjestu",
      paragraphs: [
        "Mnogi zamisljaju e-poštu kao jednostavan razgovor između dvije osobe. U stvarnosti svaka e-poruka obično postoji na više mjesta:",
        "Čak i ako obrišete e-poštu, kopije mogu postojati drugdje. Neke organizacije čuvaju e-poštu godinama radi pravnih, regulatornih ili poslovnih zahtjeva. U praksi e-pošta često postaje trajna.",
      ],
    },
    {
      title: "Tajne loše stare",
      paragraphs: [
        "Najopasnije kod e-pošte nije nužno danas. To je za pet godina. Zamislite da ste nekome poslali:",
        "Možda su se vjerodajnice od tada promijenile. Možda i nisu. Godinama kasnije ta e-pošta može još ležati u više pretinaca—pretraživa u sekundama. Tko dobije pristup jednom od tih računa ima odjednom kartu vaših ranijih tajni. Naš vodič o [tajnama koje nikad ne biste trebali slati u chatu](blog:secrets-never-send-in-chat) pokriva slične rizike u messenger aplikacijama—e-pošta je često gora jer je zadržavanje duže i kopija više.",
      ],
    },
    {
      title: "E-pošta je izgrađena za pretraživanje",
      paragraphs: [
        "Moderni klijenti za e-poštu nevjerojatno su dobri u pronalaženju starih poruka. Pretražite `password`, `API` ili `confidential`—i poruke od prije godina pojave se gotovo odmah.",
      ],
      callout:
        "To je izvrsna značajka za svakodnevni rad. Užasna za tajne. Osjetljive informacije bi s vremenom trebale postajati **teže** za pronalaženje—ne lakše.",
    },
    {
      title: "Prosljeđivanje košta jedan klik",
      paragraphs: [
        "Možda vjerujete primatelju. To nije uvijek dovoljno. E-pošta se rutinski:",
        "Kad tajna napusti vaš pretinac, više ne kontrolirate koliko kopija postoji. Za razliku od upravitelja lozinki ili šifrirane usluge dijeljenja, e-pošta ne poznaje opoziv pristupa nakon dostave.",
      ],
    },
    {
      title: "AI sve više obrađuje e-poštu",
      paragraphs: [
        "Još jedan razlog za razmišljanje prije slanja osjetljivih informacija e-poštom: pružatelji e-pošte sve više koriste automatizirane sustave za obradu poruka. Ti sustavi mogu pomoći pri:",
        "Pružatelji se značajno razlikuju u tome kako te značajke rade, koji se podaci obrađuju i pod kojim pravilima privatnosti. Iako su mnogi u posljednjim godinama uveli jače obveze privatnosti, slanje osjetljivih informacija e-poštom i dalje znači povjeravanje tim sustavima izvan vaše kontrole. Ako želite minimizirati izloženost, manje osjetljivih informacija e-poštom razuman je prvi korak.",
      ],
    },
    {
      title: "Regulatorno skeniranje također je dio rasprave",
      paragraphs: [
        "Privatnost više nije samo tehničko pitanje. Postala je političko pitanje. U srpnju 2026. Europski parlament odobrio je produljenje privremenog pravnog okvira koji pružateljima određenih komunikacijskih usluga dopušta dobrovoljno otkrivanje i prijavljivanje dječje pornografije (CSAM) do travnja 2028.",
        "Okvir se prvenstveno odnosi na usluge koje mogu pristupiti sadržaju poruka—na primjer mnoge klasične pružatelje e-pošte i druge usluge bez [end-to-end šifriranja](blog:what-is-end-to-end-encryption). Više o tome što je ovo glasovanje značilo—i zašto je usvojeno unatoč više glasova protiv nego za—nalazite u našem objašnjenju [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "Izričiti cilj je zaštita djece, i razumni ljudi mogu se razilaziti o pravoj ravnoteži između privatnosti i javne sigurnosti. Ipak, rasprava pokazuje važnu točku: **ako usluga može čitati vaše poruke, budući zakoni, politike ili odluke platformi mogu utjecati na to kako se te poruke obrađuju.** End-to-end šifrirane usluge fundamentalno su drugačije jer pružatelj nema kriptografske ključeve potrebne za čitanje sadržaja.",
    },
    {
      title: "Postoji bolji način dijeljenja tajni",
      paragraphs: [
        "Ne mora svaka informacija trajati zauvijek. Ponekad trebate nešto poslati samo jednom. Primjeri:",
        "Umjesto slanja izravno u e-pošti, koristite [šifriranu jednokratnu poveznicu](blog:one-time-secret-links). Primatelj otvori poveznicu, pročita tajnu, a šifrirani podaci se trajno brišu. Za API ključeve posebno pogledajte naš vodič za radni tijek [Sigurno dijeljenje API ključeva](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Šifriranje u pregledniku čini razliku",
      paragraphs: [
        "Kod PrivateNotea šifriranje se odvija u vašem pregledniku prije bilo kakvog uploada. Vaš preglednik lokalno šifrira poruku. Samo šifrirani tekst stiže do naših poslužitelja. Ključ za dešifriranje nikad ne napušta vaš uređaj i ne pohranjujemo ga.",
        "Kad primatelj otvori bilješku, može se konfigurirati da se samouništi nakon prvog uspješnog čitanja ili automatski istekne nakon odabranog roka. To znači: nema trajne e-pošte s tajnom koja bi se mogla otkriti godinama kasnije. Možete [poslati tajnu poruku bez računa](blog:send-secret-message-without-account) ili pročitati [kako PrivateNote radi](app:how-it-works) za potpuni model šifriranja.",
      ],
      callout:
        "Praktični test je jednostavan: može li pružatelj dobiti ključ za dešifriranje ili čisti tekst? Ako da, sustav nije istinski end-to-end šifriran. E-pošta po dizajnu ne prolazi taj test.",
    },
    {
      title: "Pravi alat za pravu informaciju",
      paragraphs: [
        "E-pošta ostaje jedna od najkorisnijih komunikacijskih tehnologija. Izvrsna je za razgovore, račune, newslettere i svakodnevnu poslovnu komunikaciju.",
        "Nije idealno mjesto za informacije koje bi trebale nestati čim ispune svrhu. Lozinke, kodovi za oporavak, API ključevi, povjerljivi dokumenti i druge osjetljive informacije zaslužuju mehanizam dijeljenja dizajniran s privatnošću na umu.",
        "**Ponekad je najsigurnija tajna ona koja jednostavno više ne postoji.**",
      ],
    },
  ],
  ctaTitle: "Podijelite tajnu bez ostavljanja u nečijem pretincu",
  ctaBody:
    "Stvorite šifiranu jednokratnu bilješku u pregledniku. Pošaljite poveznicu e-poštom ako morate—sama tajna ostaje izvan niza poruka.",
  ctaButton: "Isprobajte PrivateNote ->",
};
