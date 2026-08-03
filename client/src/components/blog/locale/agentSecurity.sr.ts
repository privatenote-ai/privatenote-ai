import type { AgentSecurityArticleCopy } from "./agentSecurity.types";

export const agentSecuritySr: AgentSecurityArticleCopy = {
  intro: [
    "AI industrija poslednjih godina opsednuta je **prompt injectionom**—brinući da bi zlonameran prompt mogao navesti chatbot na neželjen odgovor.",
    "Ali prompt injection više nije cela priča.",
    "Današnji AI sistemi brzo evoluiraju iz pasivnih asistenata u **autonomne agente**. Više ne odgovaraju samo na pitanja. Pristupaju fajlovima, parsiraju e-mailove, pozivaju API-je, izvršavaju višekoračne tokove rada i donose operativne odluke u ime korisnika.",
    "Čim AI sistem dobije sposobnost **delovanja**, bezbednosni priručnik se potpuno menja.",
    "Nedavni USENIX Security 2026 rad, **SoK: Attack and Defense Landscape of Agentic AI Systems** autora Kim et al., pruža jednu od najopsežnijih analiza bezbednosti agenata do danas. Istraživači su pregledali 128 akademskih radova, identifikovali 51 tehniku napada i 60 strategija odbrane i predložili okvir za razumevanje novih bezbednosnih izazova autonomnih AI sistema.",
    "Njihov centralni zaključak je jednostavan:",
    "Organizacijama koje grade, implementiraju ili se oslanjaju na AI proizvode to bi trebalo da posluži kao buđenje.",
  ],
  introCallout: "Što više autonomije AI agent dobije, to je veća njegova površina napada.",
  sections: [
    {
      title: "Zašto je bezbednost agenata drugačija",
      paragraphs: [
        "Tradicionalni softver prati unapred definisanu logiku. Tradicionalne LLM aplikacije prvenstveno generišu tekst. **Agentni sistemi rade drugačije.**",
        "Kombinuju jezičke modele sa spoljnim alatima, sistemima memorije, bazama podataka, API-jima i sposobnostima autonomnog odlučivanja. Poslovni agent može pročitati dolazni e-mail, dohvatiti informacije iz interne dokumentacije, upitati CRM, ažurirati bazu podataka i poslati odgovor—sve u jednom toku rada.",
        "Ta fleksibilnost čini agente tako moćnim. Takođe ih čini teškim za zaštitu.",
        "USENIX rad tvrdi da fokus samo na bezbednosti modela nije dovoljan. Bezbednost se mora procenjivati kroz **ceo ekosistem agenta**: model, memoriju, alate, izvore podataka i radnje koje može izvršiti.",
      ],
    },
    {
      title: "Sedam dimenzija rizika agenta",
      paragraphs: ["Istraživači identifikuju sedam ključnih dimenzija koje utiču na bezbednosni profil agenta:"],
      bullets: [
        { label: "Input Trust", body: "Odakle potiče informacija?" },
        { label: "Data Access Sensitivity", body: "Kojim informacijama agent može pristupiti?" },
        { label: "Workflow Autonomy", body: "Može li samostalno odlučiti šta učiniti sledeće?" },
        { label: "Action Capability", body: "Može li menjati, brisati ili prenositi podatke?" },
        { label: "Memory Persistence", body: "Ostaju li informacije između sesija?" },
        { label: "Tool Availability", body: "Koje spoljne sisteme može pozvati?" },
        { label: "User Interface Power", body: "Koliko utiče na odluke korisnika?" },
      ],
      afterBullets: [
        "Uporedite chatbot za korisničku podršku i autonomnog executive assistenta.",
        "Svaka dodatna sposobnost povećava korisnost. Ali i proširuje površinu napada i stvara nove prilike za zloupotrebu, manipulaciju ili neželjeno ponašanje.",
        "Bezbednost postaje manje pitanje zaštite modela, a više **upravljanja složenim sistemom**.",
      ],
    },
    {
      title: "Kontekst je nova bezbednosna granica",
      paragraphs: [
        "Decenijama se kibernetička bezbednost fokusirala na tri načela: poverljivost, integritet i dostupnost. Ta načela ostaju ključna.",
        "Agentni AI uvodi novi izazov: **kontekstualnu bezbednost**.",
        "Agent može imati jaku autentifikaciju, enkriptovanu komunikaciju i stroge kontrole pristupa, a ipak katastrofalno propasti jer deluje na zlonamerne ili manipulisane informacije.",
        "Zamislite agenta koji obrađuje naizgled bezopasan PDF koji je uploadovao spoljni učesnik. Skrivene upute u dokumentu govore agentu da zanemari prethodne smernice, dohvati osetljive informacije i prenese ih drugde.",
        "Ta razlika je važna jer mnogi novi AI napadi iskorišćavaju tok informacija, a ne softverske ranjivosti.",
      ],
      emphasisBlock: [
        "Sistem nije kompromitovan ukradenim kredencijalima.",
        "Infrastruktura nije probijena.",
        "Agent je jednostavno pratio pogrešan kontekst.",
      ],
      callout:
        "Kod agentnih sistema kontekst postaje bezbednosna granica jednako važna kao autentifikacija, enkripcija ili segmentacija mreže.",
    },
    {
      title: "Zašto memorija stvara nove rizike",
      paragraphs: [
        "AI memorija se često predstavlja kao UX funkcija. Argument je jednostavan: bolja memorija omogućava bolju personalizaciju.",
        "Ali memorija takođe stvara trajnost. A trajnost stvara rizik.",
        "USENIX rad ističe kako napadači mogu pokušati otrovati dugoročne memorijske skladišta zlonamernim uputama ili obmanjujućim informacijama. Jednom zapisano u memoriju, taj sadržaj može uticati na buduće odluke dugo nakon što je izvorna interakcija završila.",
        "Za razliku od privremenog prompt injection napada, memory poisoning može trajati kroz tokove rada, korisnike i vreme. Rezultat je fundamentalno drugačiji bezbednosni izazov.",
      ],
      emphasisBlock: [
        "Memorija više nije samo funkcija udobnosti.",
        "Memorija je infrastruktura.",
        "A infrastruktura zahteva upravljanje.",
      ],
    },
    {
      title: "Najopasniji agenti su oni sa dozvolama",
      paragraphs: [
        "Najveći rizici agentnog AI-ja ne dolaze nužno od inteligencije modela. **Dolaze od ovlasti koja mu je dodeljena.**",
        "Model koji generiše netačan odlomak je neugodan. Agent sa pristupom korisničkim zapisima, internim dokumentima, finansijskim sistemima, komunikacionim platformama i alatima za automatizaciju može stvoriti stvarne posledice.",
        "Kako organizacije povezuju agente sa sve moćnijim sistemima, fokus se mora pomeriti sa sposobnosti modela na operativnu kontrolu.",
      ],
      callout: 'Ključno pitanje više nije „Koliko je model pametan?" Nego: „Šta model sme da uradi?"',
    },
    {
      title: "Gradnja pouzdanih agentskih sistema",
      paragraphs: [
        "Šira lekcija rada je da bezbednost agenata zahteva **odbranu u dubinu**.",
        "Organizacije koje implementiraju AI agente trebalo bi da prioritizuju:",
      ],
      bullets: [
        { label: "Pouzdani vs. nepouzdani podaci", body: "Jaka separacija između izvora podataka" },
        { label: "Granice dozvola", body: "Eksplicitna ograničenja onoga što agenti mogu učiniti" },
        { label: "Upravljanje memorijom", body: "Kontrole za dugoročne memorijske sisteme" },
        { label: "Ljudsko odobrenje", body: "Potvrda za visokorizične operacije" },
        { label: "Revizija i posmatrljivost", body: "Sveobuhvatno beleženje i praćenje" },
        { label: "Politike pristupa alatima", body: "Jasna pravila za spoljne integracije" },
      ],
      afterBullets: [
        "Ta načela odražavaju ustaljenu kibernetičku praksu jer AI agenti sve više liče zaposlenicima, a ne softverskim funkcijama.",
      ],
    },
    {
      title: "Šira lekcija",
      paragraphs: [
        "Industrija često opisuje AI agente kao **digitalne zaposlenike**. Ta analogija postaje sve tačnija.",
        "Zaposlenici dobijaju obuku. Zaposlenici rade prema politikama. Zaposlenici imaju definisane dozvole. Zaposlenici se prate. Zaposlenici mogu pogrešiti.",
        "AI agenti nisu drugačiji. Jedina razlika je što mogu pogrešiti brzinom mašine.",
        "Najuspešniji AI proizvodi sledeće decenije neće imati samo najsposobnije modele. **Imaće najjaču arhitekturu poverenja.**",
      ],
      emphasisBlock: ["Inteligencija privlači korisnike.", "Poverenje ih zadržava."],
    },
  ],
  closingCallout: {
    title: "Zaštita konteksta, ne samo podataka",
    body: "U PrivateNote.ai verujemo da zaštita konteksta postaje jednako važna kao zaštita samih podataka. Kako AI sistemi dobijaju pristup našim ličnim beleškama, poslovnom znanju i operativnim tokovima rada, bezbednost mora ići dalje od skladištenja i enkripcije—uključujući informacije koje agenti konzumiraju, pamte i na koje deluju.",
  },
};
