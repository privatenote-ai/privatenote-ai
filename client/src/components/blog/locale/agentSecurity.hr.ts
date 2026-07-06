import type { AgentSecurityArticleCopy } from "./agentSecurity.types";

export const agentSecurityHr: AgentSecurityArticleCopy = {
  intro: [
    "AI industrija posljednjih je godina opsjednuta **prompt injectionom**—brinući da bi zlonamjerni prompt mogao navesti chatbot na neželjeni odgovor.",
    "Ali prompt injection više nije cijela priča.",
    "Današnji AI sustavi brzo evoluiraju iz pasivnih asistenata u **autonomne agente**. Više ne odgovaraju samo na pitanja. Pristupaju datotekama, parsiraju e-mailove, pozivaju API-je, izvršavaju višekoračne tijekove rada i donose operativne odluke u ime korisnika.",
    "Čim AI sustav dobije sposobnost **djelovanja**, sigurnosni priručnik se potpuno mijenja.",
    "Nedavni USENIX Security 2026 rad, **SoK: Attack and Defense Landscape of Agentic AI Systems** autora Kim et al., pruža jednu od najopsežnijih analiza sigurnosti agenata do danas. Istraživači su pregledali 128 akademskih radova, identificirali 51 tehniku napada i 60 strategija obrane te predložili okvir za razumijevanje novih sigurnosnih izazova autonomnih AI sustava.",
    "Njihov centralni zaključak je jednostavan:",
    "Organizacijama koje grade, implementiraju ili se oslanjaju na AI proizvode to bi trebalo poslužiti kao buđenje.",
  ],
  introCallout: "Što više autonomije AI agent dobije, to je veća njegova površina napada.",
  sections: [
    {
      title: "Zašto je sigurnost agenata drugačija",
      paragraphs: [
        "Tradicionalni softver slijedi unaprijed definiranu logiku. Tradicionalne LLM aplikacije prvenstveno generiraju tekst. **Agentni sustavi rade drugačije.**",
        "Kombiniraju jezične modele s vanjskim alatima, sustavima memorije, bazama podataka, API-jima i sposobnostima autonomnog odlučivanja. Poslovni agent može pročitati dolazni e-mail, dohvatiti informacije iz interne dokumentacije, upitati CRM, ažurirati bazu podataka i poslati odgovor—sve u jednom tijeku rada.",
        "Ta fleksibilnost čini agente tako moćnima. Također ih čini teškim za zaštitu.",
        "USENIX rad tvrdi da fokus samo na sigurnosti modela nije dovoljan. Sigurnost se mora procjenjivati kroz **cijeli ekosustav agenta**: model, memoriju, alate, izvore podataka i radnje koje može izvršiti.",
      ],
    },
    {
      title: "Sedam dimenzija rizika agenta",
      paragraphs: ["Istraživači identificiraju sedam ključnih dimenzija koje utječu na sigurnosni profil agenta:"],
      bullets: [
        { label: "Input Trust", body: "Odakle potječe informacija?" },
        { label: "Data Access Sensitivity", body: "Kojim informacijama agent može pristupiti?" },
        { label: "Workflow Autonomy", body: "Može li samostalno odlučiti što učiniti sljedeće?" },
        { label: "Action Capability", body: "Može li mijenjati, brisati ili prenositi podatke?" },
        { label: "Memory Persistence", body: "Ostaju li informacije između sesija?" },
        { label: "Tool Availability", body: "Koje vanjske sustave može pozvati?" },
        { label: "User Interface Power", body: "Koliko utječe na odluke korisnika?" },
      ],
      afterBullets: [
        "Usporedite chatbot za korisničku podršku i autonomnog executive assistenta.",
        "Svaka dodatna sposobnost povećava korisnost. Ali i proširuje površinu napada te stvara nove prilike za zlouporabu, manipulaciju ili neželjeno ponašanje.",
        "Sigurnost postaje manje pitanje zaštite modela, a više **upravljanja složenim sustavom**.",
      ],
    },
    {
      title: "Kontekst je nova sigurnosna granica",
      paragraphs: [
        "Desetljećima se kibernetička sigurnost fokusirala na tri načela: povjerljivost, integritet i dostupnost. Ta načela ostaju ključna.",
        "Agentni AI uvodi novi izazov: **kontekstualnu sigurnost**.",
        "Agent može imati jaku autentifikaciju, enkriptiranu komunikaciju i stroge kontrole pristupa, a ipak katastrofalno propasti jer djeluje na zlonamjerne ili manipulirane informacije.",
        "Zamislite agenta koji obrađuje naizgled bezopasan PDF koji je učitao vanjski sudionik. Skrivene upute u dokumentu govore agentu da zanemari prethodne smjernice, dohvati osjetljive informacije i prenese ih drugdje.",
        "Ta razlika je važna jer mnogi novi AI napadi iskorištavaju tok informacija, a ne softverske ranjivosti.",
      ],
      emphasisBlock: [
        "Sustav nije kompromitiran ukradenim vjerodajnicama.",
        "Infrastruktura nije probijena.",
        "Agent je jednostavno slijedio pogrešan kontekst.",
      ],
      callout:
        "Kod agentnih sustava kontekst postaje sigurnosna granica jednako važna kao autentifikacija, enkripcija ili segmentacija mreže.",
    },
    {
      title: "Zašto memorija stvara nove rizike",
      paragraphs: [
        "AI memorija se često predstavlja kao UX značajka. Argument je jednostavan: bolja memorija omogućuje bolju personalizaciju.",
        "Ali memorija također stvara trajnost. A trajnost stvara rizik.",
        "USENIX rad ističe kako napadači mogu pokušati otrovati dugoročne memorijske pohrane zlonamjernim uputama ili obmanjujućim informacijama. Jednom zapisano u memoriju, taj sadržaj može utjecati na buduće odluke dugo nakon što je izvorna interakcija završila.",
        "Za razliku od privremenog prompt injection napada, memory poisoning može trajati kroz tijekove rada, korisnike i vrijeme. Rezultat je fundamentalno drugačiji sigurnosni izazov.",
      ],
      emphasisBlock: [
        "Memorija više nije samo značajka udobnosti.",
        "Memorija je infrastruktura.",
        "A infrastruktura zahtijeva upravljanje.",
      ],
    },
    {
      title: "Najopasniji agenti su oni s dopuštenjima",
      paragraphs: [
        "Najveći rizici agentnog AI-ja ne dolaze nužno od inteligencije modela. **Dolaze od ovlasti koja mu je dodijeljena.**",
        "Model koji generira netočan odlomak je neugodan. Agent s pristupom korisničkim zapisima, internim dokumentima, financijskim sustavima, komunikacijskim platformama i alatima za automatizaciju može stvoriti stvarne posljedice.",
        "Kako organizacije povezuju agente s sve moćnijim sustavima, fokus se mora pomaknuti s sposobnosti modela na operativnu kontrolu.",
      ],
      callout: 'Ključno pitanje više nije „Koliko je model pametan?" Nego: „Što model smije učiniti?"',
    },
    {
      title: "Gradnja pouzdanih agentskih sustava",
      paragraphs: [
        "Šira lekcija rada je da sigurnost agenata zahtijeva **obrambu u dubinu**.",
        "Organizacije koje implementiraju AI agente trebale bi prioritizirati:",
      ],
      bullets: [
        { label: "Pouzdani vs. nepouzdani podaci", body: "Jaka separacija između izvora podataka" },
        { label: "Granice dopuštenja", body: "Eksplicitna ograničenja onoga što agenti mogu učiniti" },
        { label: "Upravljanje memorijom", body: "Kontrole za dugoročne memorijske sustave" },
        { label: "Ljudsko odobrenje", body: "Potvrda za visokorizične operacije" },
        { label: "Revizija i promatljivost", body: "Sveobuhvatno bilježenje i praćenje" },
        { label: "Politike pristupa alatima", body: "Jasna pravila za vanjske integracije" },
      ],
      afterBullets: [
        "Ta načela odražavaju ustaljenu kibernetičku praksu jer AI agenti sve više nalikuju zaposlenicima, a ne softverskim značajkama.",
      ],
    },
    {
      title: "Šira lekcija",
      paragraphs: [
        "Industrija često opisuje AI agente kao **digitalne zaposlenike**. Ta analogija postaje sve točnija.",
        "Zaposlenici dobivaju obuku. Zaposlenici rade prema politikama. Zaposlenici imaju definirana dopuštenja. Zaposlenici se prate. Zaposlenici mogu pogriješiti.",
        "AI agenti nisu drugačiji. Jedina razlika je što mogu pogriješiti brzinom stroja.",
        "Najuspješniji AI proizvodi sljedećeg desetljeća neće imati samo najsposobnije modele. **Imat će najjaču arhitekturu povjerenja.**",
      ],
      emphasisBlock: ["Inteligencija privlači korisnike.", "Povjerenje ih zadržava."],
    },
  ],
  closingCallout: {
    title: "Zaštita konteksta, ne samo podataka",
    body: "U PrivateNote.ai vjerujemo da zaštita konteksta postaje jednako važna kao zaštita samih podataka. Kako AI sustavi dobivaju pristup našim osobnim bilješkama, poslovnom znanju i operativnim tijekovima rada, sigurnost mora ići dalje od pohrane i enkripcije—uključujući informacije koje agenti konzumiraju, pamte i na koje djeluju.",
  },
};
