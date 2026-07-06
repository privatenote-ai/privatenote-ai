import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingSr: EncryptedFileSharingArticleCopy = {
  intro: [
    'Kada ljudi traže „sigurno deljenje fajlova", često pretpostavljaju da svaka usluga sa HTTPS ili TLS enkripcijom štiti fajlove na isti način. Nažalost, to nije istina.',
    'Dve usluge mogu oglašavati „enkriptovan prenos fajlova" uz potpuno različita jamstva privatnosti. Razlika leži u **tome gde se enkripcija dešava**. Razumevanje te razlike objašnjava zašto neke usluge mogu pregledati, indeksirati i obrađivati vaše fajlove, dok druge jednostavno ne mogu.',
  ],
  sections: [
    {
      title: "Dve vrste enkripcije",
      level: "primary",
      paragraphs: ["Postoje dva glavna načina na koja moderni servisi za deljenje fajlova štite vaše podatke."],
    },
    {
      title: "1. Transportna enkripcija (TLS)",
      level: "secondary",
      paragraphs: [
        "To je standardna enkripcija koju danas koristi gotovo svaka veb stranica. Kada uploadujete fajl, pregledač uspostavlja sigurnu TLS vezu sa serverom domaćina. Veza je enkriptovana dok fajl putuje mrežom, štiteći vas od napadača na javnom Wi-Fi-ju, kompromitovanih ruterima ili bilo koga ko prisluškuje saobraćaj.",
      ],
      flow: "tls",
      bullets: [
        "TLS je neophodan i svaka ugledna usluga ga mora koristiti.",
        "Kada upload stigne na server, provajder prima izvorni fajl u čistom tekstu.",
        "Od tada nadalje, u zavisnosti od politika, usluga može čuvati fajl, generisati preglede, indeksirati sadržaj, skenirati zlonamerni softver ili koristiti metapodatke za analitiku.",
        'Mnogi provajderi takođe enkriptuju fajlove „u mirovanju". To štiti od fizičke krađe diskova—ali usluga i dalje drži ključeve i može čitati vaše fajlove.',
      ],
      callout:
        "**Osnovna ranjivost tradicionalnog cloud skladišta:** server može enkriptovati samo ono što je već mogao pročitati.",
    },
    {
      title: "2. Enkripcija u pregledaču",
      level: "secondary",
      paragraphs: [
        "Fundamentalno drugačiji pristup je enkriptovati fajl **pre** nego što napusti vaš uređaj. Umesto izvornog fajla, pregledač koristi lokalne kriptografske API-je. Server prima samo šifrovani tekst—podatke koji izgledaju nasumično i beskorisni su bez ključa za dešifrovanje.",
      ],
      flow: "browser",
      bullets: [
        "Enkripcija u pregledaču ne zamenjuje TLS—dopunjuje ga.",
        "TLS i dalje štiti vezu od prisluškivanja na nivou mreže.",
        "Serveri provajdera primaju samo nečitljiv šifrovani tekst jer nikad ne primaju čist tekst niti ključ za dešifrovanje.",
      ],
    },
    {
      title: "Zašto ta razlika ima značaj",
      level: "primary",
      paragraphs: [
        "Pretpostavimo da delite visoko osetljive podatke: pravne ugovore, finansijske tabele, vlasnički izvorni kod, medicinske zapise ili poverljive poslovne dokumente.",
        "Kod enkripcije samo u prenosu, vaša privatnost je **ugovorna**. Morate verovati implementaciji provajdera, kontrolama pristupa zaposlenih i trenutnim i budućim korporativnim politikama.",
        "Kod enkripcije u pregledaču, vaša privatnost je **arhitektonska**. Provajder čuva samo šifrovani tekst. Čak i ako budu hakirani, subpoenirani ili promene poslovni model, ne mogu predati čist tekst koji nikad nisu posedovali.",
      ],
      callout:
        "Kod enkripcije samo u prenosu, vaša privatnost je **ugovorna**. Kod enkripcije u pregledaču, vaša privatnost je **arhitektonska**.",
    },
    {
      title: "Nedavni podsetnik: faktor poverenja",
      level: "primary",
      paragraphs: [
        "2025. WeTransfer je ažurirao Uslove korišćenja jezikom koji je izgledao kao da dodeljuje široka prava nad uploadovanim sadržajem, uključujući za poboljšanje mašinskog učenja u moderaciji sadržaja.",
        "Promena je odmah izazvala negativnu reakciju umetnika, novinara i kreativaca koji su se bojali da će intelektualna svojina služiti za treniranje AI sistema. WeTransfer je brzo pojasnio da se sadržaj korisnika ne koristi za AI treniranje i uklonio zbunjujući jezik—ali incident je istaknuo ključnu lekciju:",
        "Ako provajder prima vaše fajlove u čistom tekstu, u potpunosti ste zavisni od njihovih obećanja. Kada provajder čuva samo šifrovani tekst, količina poverenja koju morate imati strukturno je minimizirana. Arhitektura nameće privatnost.",
      ],
    },
    {
      title: "Kako PrivateNote rukuje deljenjem fajlova",
      level: "primary",
      paragraphs: [
        "Moderna enkripcija u pregledaču kombinuje nekoliko dobro utvrđenih kriptografskih gradivnih elemenata kako bi podaci bili sigurni bez oslanjanja na poverenje u server.",
      ],
    },
    {
      title: "Generisanje i izolacija ključeva",
      level: "secondary",
      paragraphs: [
        "Kada korisnik pripremi deljenje fajla, PrivateNote u pregledaču generiše kriptografski siguran, slučajan simetrični ključ pomoću Web Crypto API-ja.",
        "Taj ključ se nikad ne prenosi na našu infrastrukturu. Umesto toga dodaje se deljenom linku kao URL fragment (deo posle `#`):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Prema dizajnu, veb pregledači nikad ne šalju URL fragment veb serveru u HTTP zahtevu. Ključ za dešifrovanje ostaje u pregledaču primaoca.",
      ],
    },
    {
      title: "Autentifikovana streaming enkripcija",
      level: "secondary",
      paragraphs: [
        "Umesto sirovih podataka, pregledač enkriptuje fajl pre nego što dotakne mrežu. PrivateNote podržava velike priloge pa koristi **streaming enkripciju u chunkovima**: fajlovi se enkriptuju blok po blok (obično u chunkovima od nekoliko megabajta) kako veliki uploadi ne bi morali učitati ceo fajl u memoriju odjednom.",
        "Besplatni nalozi mogu priložiti fajlove do 25 MB; Premium nalozi podržavaju mnogo veće payloade (do 1 GB po fajlu). U svim slučajevima, na server stiže samo šifrovani tekst.",
        "Implementacija koristi **AES-GCM** (Authenticated Encryption with Associated Data), pružajući poverljivost i integritet:",
      ],
      bullets: [
        "**Poverljivost** — payload je nečitljiv bez ključa.",
        "**Integritet** — neovlašćene izmene šifrovanog teksta u mirovanju otkrivaju se i odbijaju pri klijentskom dešifrovanju.",
        "Kada je uključena zaštita lozinkom, ključ izveden iz lozinke generiše se memorijski zahtevnim algoritmima poput **Argon2id**, čineći brute-force pogadanje nepraktičnim.",
      ],
    },
    {
      title: "Koji metapodaci i dalje postoje",
      level: "primary",
      paragraphs: [
        "Rigorozna bezbednosna arhitektura mora priznati svoje granice. Enkripcija u pregledaču štiti **sadržaj** fajlova, ali određeni metapodaci ostaju vidljivi mreži i usluzi:",
      ],
      bullets: [
        "Vremenske oznake uploada i downloada.",
        "Približna veličina enkriptovanog payloada.",
        "Istek, limiti pregleda i prozori pristupa fajlu.",
        "IP adresa primaoca pri downloadu (vidljiva veb serveru koji usmerava zahtev).",
      ],
      callout:
        "Sistemi fokusirani na privatnost minimiziraju metapodatke gde je praktično, ali nijedna veb usluga ih ne može u potpunosti eliminisati. PrivateNote metapodatke tretira istom disciplinom zadržavanja kao i enkriptovane payloade—briše ih kada beleška istekne ili se obriše.",
    },
    {
      title: "Kompromisi prave privatnosti",
      level: "primary",
      paragraphs: ["Enkripcija u pregledaču nudi maksimalnu privatnost sadržaja, ali dolazi sa namernim kompromisima:"],
      bullets: [
        "**Bez skeniranja zlonamernog softvera na serveru** — jer server ne može pročitati fajl, ne može ga skenirati. Verujte pošiljaocu.",
        "**Bez pregleda generisanih na serveru** — sličice i pregledi dokumenata renderuju se lokalno u pregledaču primaoca posle dešifrovanja, ne na serveru.",
        "**Bez oporavka lozinke ili ključa** — ako izgubite link ili ključ, provajder ne može oporaviti fajl. Nema „Zaboravljene lozinke” za podatke kojima domaćin ne može pristupiti.",
      ],
    },
    {
      title: "Izbor prave usluge",
      level: "primary",
      paragraphs: [
        "Ne svaki prenos fajlova zahteva strogu enkripciju u pregledaču. Obične fotografije sa odmora sa porodicom mogu biti u redu samo sa transportnom enkripcijom.",
        "Ako delite intelektualnu svojinu, pravne ugovore ili osetljive lične podatke, postavite jedno arhitektonsko pitanje:",
        "**Da li usluga prima moj izvorni fajl ili samo enkriptovanu verziju?**",
        "Ta jedna razlika određuje ko tehnički može pristupiti vašim podacima—ne samo danas, već kako se korporativne politike, vlasništvo i zakoni o privatnosti menjaju tokom vremena.",
      ],
    },
  ],
  closingTitle: "Delite fajlove bez predaje čistog teksta serveru",
  closingBody:
    "PrivateNote siguran prenos fajlova koristi isti model enkripcije u pregledaču kao i naše nestajuće beleške: enkriptuj lokalno, uploaduj šifrovani tekst, podeli ključ u URL fragmentu i istekni pristup po vašim uslovima.",
  ctaLabel: "Isprobajte siguran prenos fajlova",
  relatedReading: "Povezano čitanje",
};
