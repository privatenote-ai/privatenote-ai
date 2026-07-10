import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsSr: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop na stolu sa e-poštom koja prikazuje kredencijale za server i SSH privatni ključ u čistom tekstu",
  intro:
    "E-pošta je postala standard za razmenu gotovo svega—ugovora, lozinki, API ključeva, bankovnih podataka, medicinskih dokumenata, ličnih iskaznica, Wi-Fi lozinki i kodova za oporavak. Većina nas šalje osetljive informacije e-poštom bez puno razmišljanja.",
  calloutTitle: "E-pošta je napravljena za dostavu poruka—ne za nestajanje",
  calloutBody:
    "Kada pošaljete e-poštu, često gubite kontrolu nad tim gde završi, koliko dugo se čuva i ko joj u budućnosti može pristupiti. Ako šaljete nešto što treba da ostane privatno, e-pošta je obično pogrešan alat.",
  emailCopies: [
    "vašem sandučetu",
    "sandučetu primaoca",
    "rezervnim kopijama provajdera e-pošte",
    "arhiviranim kopijama",
    "sinhronizovanim uređajima",
    "sistemima rezervnih kopija kompanije",
    "izvezenim PST ili MBOX fajlovima",
    "infrastrukturi za oporavak od katastrofe",
  ],
  agedSecretsExamples: [
    "lozinka produkcione baze podataka",
    "API ključ",
    "SSH kredencijali",
    "VPN podaci za prijavu",
    "fraza za oporavak kriptovalute",
  ],
  forwardingPaths: [
    "prosleđena",
    "kopirana u sisteme za tikete",
    "nalepljena u čet aplikacije",
    "priložena drugim e-porukama",
    "podeljena sa izvođačima",
    "uključena u zahteve za podršku",
  ],
  aiProcessingUses: [
    "prepoznavanje spama",
    "zaštita od phishinga",
    "otkrivanje zlonamernog softvera",
    "pametni predlozi odgovora",
    "kategorizacija sandučeta",
    "pretraga",
    "produktivnost",
    "pisanje i sažimanje uz pomoć AI-ja",
  ],
  oneTimeSecretExamples: [
    "lozinka",
    "API ključ",
    "kod za oporavak",
    "softverska licenca",
    "kredencijali za server",
    "poverljiva poruka",
  ],
  oneTimeBenefits: [
    "Nema istorije sandučeta.",
    "Nema pretraživog arhiva.",
    "Nema slučajnog prosleđivanja same tajne.",
    "Nema zaboravljenih kopija koje leže u sandučetima godinama.",
  ],
  sections: [
    {
      title: "Vaša e-pošta ne postoji samo na jednom mestu",
      paragraphs: [
        "Mnogi zamisle e-poštu kao jednostavan razgovor između dve osobe. U stvarnosti svaka e-poruka obično postoji na više mesta:",
        "Čak i ako obrišete e-poštu, kopije mogu postojati drugde. Neke organizacije čuvaju e-poštu godinama radi pravnih, regulatornih ili poslovnih zahteva. U praksi e-pošta često postaje trajna.",
      ],
    },
    {
      title: "Tajne loše stare",
      paragraphs: [
        "Najopasnije kod e-pošte nije nužno danas. To je za pet godina. Zamislite da ste nekome poslali:",
        "Možda su se kredencijali od tada promenili. Možda i nisu. Godinama kasnije ta e-pošta može još ležati u više sandučeta—pretraživa u sekundama. Ko dobije pristup jednom od tih naloga ima odjednom mapu vaših ranijih tajni. Naš vodič o [tajnama koje nikad ne biste trebalo slati u četu](blog:secrets-never-send-in-chat) pokriva slične rizike u messenger aplikacijama—e-pošta je često gora jer je zadržavanje duže i kopija više.",
      ],
    },
    {
      title: "E-pošta je napravljena za pretragu",
      paragraphs: [
        "Moderni klijenti za e-poštu neverovatno su dobri u pronalaženju starih poruka. Pretražite `password`, `API` ili `confidential`—i poruke od pre godina pojave se gotovo odmah.",
      ],
      callout:
        "To je odlična funkcija za svakodnevni rad. Užasna za tajne. Osetljive informacije bi s vremenom trebalo da postaju **teže** za pronalaženje—ne lakše.",
    },
    {
      title: "Prosleđivanje košta jedan klik",
      paragraphs: [
        "Možda verujete primaocu. To nije uvek dovoljno. E-pošta se rutinski:",
        "Kada tajna napusti vaše sanduče, više ne kontrolišete koliko kopija postoji. Za razliku od menadžera lozinki ili šifrovane usluge deljenja, e-pošta ne poznaje opoziv pristupa nakon dostave.",
      ],
    },
    {
      title: "AI sve više obrađuje e-poštu",
      paragraphs: [
        "Još jedan razlog za razmišljanje pre slanja osetljivih informacija e-poštom: provajderi e-pošte sve više koriste automatizovane sisteme za obradu poruka. Ti sistemi mogu pomoći pri:",
        "Provajderi se značajno razlikuju u tome kako te funkcije rade, koji se podaci obrađuju i pod kojim pravilima privatnosti. Iako su mnogi u poslednjim godinama uveli jače obaveze privatnosti, slanje osetljivih informacija e-poštom i dalje znači poveravanje tim sistemima izvan vaše kontrole. Ako želite minimizirati izloženost, manje osetljivih informacija e-poštom razuman je prvi korak.",
      ],
    },
    {
      title: "Regulatorno skeniranje takođe je deo rasprave",
      paragraphs: [
        "Privatnost više nije samo tehničko pitanje. Postala je političko pitanje. U julu 2026. Evropski parlament odobrio je produženje privremenog pravnog okvira koji provajderima određenih komunikacionih usluga dozvoljava dobrovoljno otkrivanje i prijavljivanje dečje pornografije (CSAM) do aprila 2028.",
        "Okvir se prvenstveno odnosi na usluge koje mogu pristupiti sadržaju poruka—na primer mnoge klasične provajdere e-pošte i druge usluge bez [end-to-end šifrovanja](blog:what-is-end-to-end-encryption). Više o tome šta je ovo glasanje značilo—i zašto je usvojeno uprkos više glasova protiv nego za—nalazite u našem objašnjenju [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "Izričiti cilj je zaštita dece, i razumni ljudi mogu se razilaziti o pravoj ravnoteži između privatnosti i javne bezbednosti. Ipak, rasprava pokazuje važnu tačku: **ako usluga može čitati vaše poruke, budući zakoni, politike ili odluke platformi mogu uticati na to kako se te poruke obrađuju.** End-to-end šifrovane usluge fundamentalno su drugačije jer provajder nema kriptografske ključeve potrebne za čitanje sadržaja.",
    },
    {
      title: "Postoji bolji način deljenja tajni",
      paragraphs: [
        "Ne mora svaka informacija trajati zauvek. Ponekad trebate nešto poslati samo jednom. Primeri:",
        "Umesto slanja direktno u e-pošti, koristite [šifrovani jednokratni link](blog:one-time-secret-links). Primalac otvori link, pročita tajnu, a šifrovani podaci se trajno brišu. Za API ključeve posebno pogledajte naš vodič za radni tok [Sigurno deljenje API ključeva](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Šifrovanje u pretraživaču čini razliku",
      paragraphs: [
        "Kod PrivateNotea šifrovanje se odvija u vašem pretraživaču pre bilo kakvog uploada. Vaš pretraživač lokalno šifruje poruku. Samo šifrovani tekst stiže do naših servera. Ključ za dešifrovanje nikad ne napušta vaš uređaj i ne čuvamo ga.",
        "Kada primalac otvori belešku, može se konfigurisati da se samouništi nakon prvog uspešnog čitanja ili automatski istekne nakon odabranog roka. To znači: nema trajne e-pošte sa tajnom koja bi se mogla otkriti godinama kasnije. Možete [poslati tajnu poruku bez naloga](blog:send-secret-message-without-account) ili pročitati [kako PrivateNote radi](app:how-it-works) za potpuni model šifrovanja.",
      ],
      callout:
        "Praktični test je jednostavan: može li provajder dobiti ključ za dešifrovanje ili čist tekst? Ako da, sistem nije istinski end-to-end šifrovan. E-pošta po dizajnu ne prolazi taj test.",
    },
    {
      title: "Pravi alat za pravu informaciju",
      paragraphs: [
        "E-pošta ostaje jedna od najkorisnijih komunikacionih tehnologija. Odlična je za razgovore, račune, newslettere i svakodnevnu poslovnu komunikaciju.",
        "Nije idealno mesto za informacije koje bi trebalo da nestanu čim ispune svrhu. Lozinke, kodovi za oporavak, API ključevi, poverljivi dokumenti i druge osetljive informacije zaslužuju mehanizam deljenja dizajniran sa privatnošću na umu.",
        "**Ponekad je najsigurnija tajna ona koja jednostavno više ne postoji.**",
      ],
    },
  ],
  ctaTitle: "Podelite tajnu bez ostavljanja u nečijem sandučetu",
  ctaBody:
    "Stvorite šifrovanu jednokratnu belešku u pretraživaču. Pošaljite link e-poštom ako morate—sama tajna ostaje van niza poruka.",
  ctaButton: "Isprobajte PrivateNote ->",
};
