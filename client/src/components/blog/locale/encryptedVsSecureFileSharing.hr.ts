import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingHr: EncryptedFileSharingArticleCopy = {
  intro: [
    'Kad ljudi traže „sigurno dijeljenje datoteka", često pretpostavljaju da svaka usluga s HTTPS ili TLS enkripcijom štiti datoteke na isti način. Nažalost, to nije istina.',
    'Dvije usluge mogu oglašavati „enkriptirani prijenos datoteka" uz potpuno različita jamstva privatnosti. Razlika leži u **tome gdje se enkripcija događa**. Razumijevanje te razlike objašnjava zašto neke usluge mogu pregledavati, indeksirati i obrađivati vaše datoteke, dok druge jednostavno ne mogu.',
  ],
  sections: [
    {
      title: "Dvije vrste enkripcije",
      level: "primary",
      paragraphs: ["Postoje dva glavna načina na koja moderni servisi za dijeljenje datoteka štite vaše podatke."],
    },
    {
      title: "1. Transportna enkripcija (TLS)",
      level: "secondary",
      paragraphs: [
        "To je standardna enkripcija koju danas koristi gotovo svaka web stranica. Kad učitavate datoteku, preglednik uspostavlja sigurnu TLS vezu s poslužiteljem domaćina. Veza je enkriptirana dok datoteka putuje mrežom, štiteći vas od napadača na javnom Wi-Fi-ju, kompromitiranih usmjerivača ili bilo koga tko prisluškuje promet.",
      ],
      flow: "tls",
      bullets: [
        "TLS je neophodan i svaka ugledna usluga ga mora koristiti.",
        "Kad upload stigne na poslužitelj, pružatelj prima izvornu datoteku u čistom tekstu.",
        "Od tada nadalje, ovisno o politikama, usluga može pohraniti datoteku, generirati preglede, indeksirati sadržaj, skenirati zlonamjerni softver ili koristiti metapodatke za analitiku.",
        'Mnogi pružatelji također enkriptiraju datoteke „u mirovanju". To štiti od fizičke krađe diskova—ali usluga i dalje drži ključeve i može čitati vaše datoteke.',
      ],
      callout:
        "**Osnovna ranjivost tradicionalnog cloud skladišta:** poslužitelj može enkriptirati samo ono što je već mogao pročitati.",
    },
    {
      title: "2. Enkripcija u pregledniku",
      level: "secondary",
      paragraphs: [
        "Fundamentalno drugačiji pristup je enkriptirati datoteku **prije** nego što napusti vaš uređaj. Umjesto izvorne datoteke, preglednik koristi lokalne kriptografske API-je. Poslužitelj prima samo šifrirani tekst—podatke koji izgledaju nasumično i beskorisni su bez ključa za dešifriranje.",
      ],
      flow: "browser",
      bullets: [
        "Enkripcija u pregledniku ne zamjenjuje TLS—dopunjuje ga.",
        "TLS i dalje štiti vezu od prisluškivanja na razini mreže.",
        "Poslužitelji pružatelja primaju samo nečitljiv šifrirani tekst jer nikad ne primaju čisti tekst niti ključ za dešifriranje.",
      ],
    },
    {
      title: "Zašto ta razlika ima značaj",
      level: "primary",
      paragraphs: [
        "Pretpostavimo da dijelite visoko osjetljive podatke: pravne ugovore, financijske tablice, vlasnički izvorni kod, medicinske zapise ili povjerljive poslovne dokumente.",
        "Kod enkripcije samo u prijenosu, vaša privatnost je **ugovorna**. Morate vjerovati implementaciji pružatelja, kontrolama pristupa zaposlenika i trenutnim i budućim korporativnim politikama.",
        "Kod enkripcije u pregledniku, vaša privatnost je **arhitektonska**. Pružatelj pohranjuje samo šifrirani tekst. Čak i ako budu hakirani, subpoenirani ili promijene poslovni model, ne mogu predati čisti tekst koji nikad nisu posjedovali.",
      ],
      callout:
        "Kod enkripcije samo u prijenosu, vaša privatnost je **ugovorna**. Kod enkripcije u pregledniku, vaša privatnost je **arhitektonska**.",
    },
    {
      title: "Nedavni podsjetnik: faktor povjerenja",
      level: "primary",
      paragraphs: [
        "2025. WeTransfer je ažurirao Uvjete korištenja jezikom koji je izgledao kao da dodjeljuje široka prava nad učitanim sadržajem, uključujući za poboljšanje strojnog učenja u moderaciji sadržaja.",
        "Promjena je odmah izazvala negativnu reakciju umjetnika, novinara i kreativaca koji su se bojali da će intelektualno vlasništvo služiti za treniranje AI sustava. WeTransfer je brzo pojasnio da se sadržaj korisnika ne koristi za AI treniranje i uklonio zbunjujući jezik—ali incident je istaknuo ključnu lekciju:",
        "Ako pružatelj prima vaše datoteke u čistom tekstu, u potpunosti ste ovisni o njihovim obećanjima. Kad pružatelj pohranjuje samo šifrirani tekst, količina povjerenja koju morate imati strukturno je minimizirana. Arhitektura nametne privatnost.",
      ],
    },
    {
      title: "Kako PrivateNote rukuje dijeljenjem datoteka",
      level: "primary",
      paragraphs: [
        "Moderna enkripcija u pregledniku kombinira nekoliko dobro utvrđenih kriptografskih gradivnih elemenata kako bi podaci bili sigurni bez oslanjanja na povjerenje u poslužitelj.",
      ],
    },
    {
      title: "Generiranje i izolacija ključeva",
      level: "secondary",
      paragraphs: [
        "Kad korisnik pripremi dijeljenje datoteke, PrivateNote u pregledniku generira kriptografski siguran, slučajni simetrični ključ pomoću Web Crypto API-ja.",
        "Taj ključ se nikad ne prenosi na našu infrastrukturu. Umjesto toga dodaje se dijeljenom linku kao URL fragment (dio nakon `#`):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Prema dizajnu, web preglednici nikad ne šalju URL fragment web poslužitelju u HTTP zahtjevu. Ključ za dešifriranje ostaje u pregledniku primatelja.",
      ],
    },
    {
      title: "Autentificirana streaming enkripcija",
      level: "secondary",
      paragraphs: [
        "Umjesto sirovih podataka, preglednik enkriptira datoteku prije nego što dotakne mrežu. PrivateNote podržava velike privitke pa koristi **streaming enkripciju u chunkovima**: datoteke se enkriptiraju blok po blok (obično u chunkovima od nekoliko megabajta) kako veliki uploadi ne bi morali učitati cijelu datoteku u memoriju odjednom.",
        "Besplatni računi mogu priložiti datoteke do 25 MB; Premium računi podržavaju mnogo veće payloade (do 1 GB po datoteci). U svim slučajevima, na poslužitelje stiže samo šifrirani tekst.",
        "Implementacija koristi **AES-GCM** (Authenticated Encryption with Associated Data), pružajući povjerljivost i integritet:",
      ],
      bullets: [
        "**Povjerljivost** — payload je nečitljiv bez ključa.",
        "**Integritet** — neovlaštene izmjene šifriranog teksta u mirovanju otkrivaju se i odbijaju pri klijentskom dešifriranju.",
        "Kad je uključena zaštita lozinkom, ključ izveden iz lozinke generira se memorijski zahtjevnim algoritmima poput **Argon2id**, čineći brute-force pogadanje nepraktičnim.",
      ],
    },
    {
      title: "Koji metapodaci i dalje postoje",
      level: "primary",
      paragraphs: [
        "Rigorozna sigurnosna arhitektura mora priznati svoje granice. Enkripcija u pregledniku štiti **sadržaj** datoteka, ali određeni metapodaci ostaju vidljivi mreži i usluzi:",
      ],
      bullets: [
        "Vremenske oznake uploada i downloada.",
        "Približna veličina enkriptiranog payloada.",
        "Istek, limiti pregleda i prozori pristupa datoteci.",
        "IP adresa primatelja pri downloadu (vidljiva web poslužitelju koji usmjerava zahtjev).",
      ],
      callout:
        "Sustavi fokusirani na privatnost minimiziraju metapodatke gdje je praktično, ali nijedna web usluga ih ne može u potpunosti eliminirati. PrivateNote metapodatke tretira istom disciplinom zadržavanja kao i enkriptirane payloade—briše ih kad bilješka istekne ili se obriše.",
    },
    {
      title: "Kompromisi prave privatnosti",
      level: "primary",
      paragraphs: ["Enkripcija u pregledniku nudi maksimalnu privatnost sadržaja, ali dolazi s namjernim kompromisima:"],
      bullets: [
        "**Bez skeniranja zlonamjernog softvera na poslužitelju** — jer poslužitelj ne može pročitati datoteku, ne može je skenirati. Vjerujte pošiljatelju.",
        "**Bez pregleda generiranih na poslužitelju** — sličice i pregledi dokumenata renderiraju se lokalno u pregledniku primatelja nakon dešifriranja, ne na poslužitelju.",
        "**Bez oporavka lozinke ili ključa** — ako izgubite link ili ključ, pružatelj ne može oporaviti datoteku. Nema „Zaboravljene lozinke” za podatke kojima domaćin ne može pristupiti.",
      ],
    },
    {
      title: "Odabir prave usluge",
      level: "primary",
      paragraphs: [
        "Ne svaki prijenos datoteka zahtijeva strogu enkripciju u pregledniku. Obične fotografije s odmora s obitelji mogu biti u redu samo s transportnom enkripcijom.",
        "Ako dijelite intelektualno vlasništvo, pravne ugovore ili osjetljive osobne podatke, postavite jedno arhitektonsko pitanje:",
        "**Prima li usluga moju izvornu datoteku ili samo enkriptiranu verziju?**",
        "Ta jedna razlika određuje tko tehnički može pristupiti vašim podacima—ne samo danas, već kako se korporativne politike, vlasništvo i zakoni o privatnosti mijenjaju tijekom vremena.",
      ],
    },
  ],
  closingTitle: "Dijelite datoteke bez predaje čistog teksta poslužitelju",
  closingBody:
    "PrivateNote siguran prijenos datoteka koristi isti model enkripcije u pregledniku kao i naše nestajuće bilješke: enkriptiraj lokalno, učitaj šifrirani tekst, podijeli ključ u URL fragmentu i istekni pristup po vašim uvjetima.",
  ctaLabel: "Isprobajte siguran prijenos datoteka",
  relatedReading: "Povezano čitanje",
};
