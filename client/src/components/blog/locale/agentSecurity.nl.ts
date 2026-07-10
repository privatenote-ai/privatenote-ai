import type { AgentSecurityArticleCopy } from "./agentSecurity.types";

export const agentSecurityNl: AgentSecurityArticleCopy = {
  intro: [
    "De AI-industrie was de afgelopen jaren geobsedeerd door **prompt injection** — de angst dat een kwaadaardige prompt een chatbot tot ongewenst gedrag zou kunnen brengen.",
    "Maar prompt injection is niet meer het hele verhaal.",
    "Moderne AI-systemen evolueren snel van passieve assistenten naar **autonome agents**. Ze beantwoorden niet alleen vragen. Ze openen bestanden, parsen e-mails, roepen API's aan, voeren meerstaps-workflows uit en nemen operationele beslissingen namens gebruikers.",
    "Zodra een AI-systeem de mogelijkheid krijgt om **te handelen**, verandert het security-handboek volledig.",
    "Het recente USENIX Security 2026-paper, **SoK: Attack and Defense Landscape of Agentic AI Systems** van Kim et al., biedt een van de meest uitgebreide analyses van agentsecurity tot nu toe. Onderzoekers bekeken 128 academische papers, identificeerden 51 aanvalstechnieken en 60 verdedigingsstrategieën en stelden een raamwerk voor om de nieuwe security-uitdagingen van autonome AI-systemen te begrijpen.",
    "Hun centrale conclusie is eenvoudig:",
    "Voor organisaties die AI-producten bouwen, implementeren of erop vertrouwen, zou dit een wake-up call moeten zijn.",
  ],
  introCallout: "Hoe meer autonomie een AI-agent krijgt, hoe groter zijn aanvalsoppervlak.",
  sections: [
    {
      title: "Waarom agentsecurity anders is",
      paragraphs: [
        "Traditionele software volgt vooraf gedefinieerde logica. Traditionele LLM-applicaties genereren vooral tekst. **Agentsystemen werken anders.**",
        "Ze combineren taalmodellen met externe tools, geheugensystemen, databases, API's en autonome beslissingscapaciteiten. Een business agent kan een inkomende e-mail lezen, informatie ophalen uit interne documentatie, een CRM bevragen, een database bijwerken en een antwoord sturen — alles in één workflow.",
        "Die flexibiliteit maakt agents zo krachtig. Het maakt ze ook moeilijk te beschermen.",
        "Het USENIX-paper stelt dat focussen op alleen modelsecurity niet genoeg is. Security moet worden beoordeeld over het **hele agent-ecosysteem**: model, geheugen, tools, databronnen en de acties die het kan uitvoeren.",
      ],
    },
    {
      title: "Zeven dimensies van agentrisico",
      paragraphs: ["Onderzoekers identificeren zeven sleuteldimensies die het securityprofiel van een agent beïnvloeden:"],
      bullets: [
        { label: "Input Trust", body: "Waar komt de informatie vandaan?" },
        { label: "Data Access Sensitivity", body: "Tot welke informatie heeft de agent toegang?" },
        { label: "Workflow Autonomy", body: "Kan hij zelfstandig beslissen wat de volgende stap is?" },
        { label: "Action Capability", body: "Kan hij data wijzigen, verwijderen of overdragen?" },
        { label: "Memory Persistence", body: "Blijft informatie tussen sessies bestaan?" },
        { label: "Tool Availability", body: "Welke externe systemen kan hij aanroepen?" },
        { label: "User Interface Power", body: "Hoeveel invloed heeft hij op gebruikersbeslissingen?" },
      ],
      afterBullets: [
        "Vergelijk een klantenservice-chatbot met een autonome executive assistant.",
        "Elke extra capability verhoogt de bruikbaarheid. Maar het vergroot ook het aanvalsoppervlak en creëert nieuwe kansen voor misbruik, manipulatie of ongewenst gedrag.",
        "Security wordt minder een kwestie van het model beschermen en meer **een complex systeem beheren**.",
      ],
    },
    {
      title: "Context is de nieuwe securitygrens",
      paragraphs: [
        "Decennialang focuste cybersecurity op drie principes: vertrouwelijkheid, integriteit en beschikbaarheid. Die principes blijven cruciaal.",
        "Agentic AI introduceert een nieuwe uitdaging: **contextuele security**.",
        "Een agent kan sterke authenticatie, versleutelde communicatie en strikte toegangscontroles hebben, en toch catastrofaal falen omdat hij handelt op kwaadaardige of gemanipuleerde informatie.",
        "Stel je een agent voor die een ogenschijnlijk onschuldige PDF verwerkt die een externe partij heeft geüpload. Verborgen instructies in het document vertellen de agent om eerdere richtlijnen te negeren, gevoelige informatie op te halen en elders over te dragen.",
        "Dat verschil is belangrijk omdat veel nieuwe AI-aanvallen informatiestromen misbruiken in plaats van softwarekwetsbaarheden.",
      ],
      emphasisBlock: [
        "Het systeem is niet gecompromitteerd door gestolen credentials.",
        "De infrastructuur is niet doorbroken.",
        "De agent volgde simpelweg de verkeerde context.",
      ],
      callout:
        "Bij agentsystemen wordt context een securitygrens die net zo belangrijk is als authenticatie, versleuteling of netwerksegmentatie.",
    },
    {
      title: "Waarom geheugen nieuwe risico's creëert",
      paragraphs: [
        "AI-geheugen wordt vaak gepresenteerd als een UX-feature. Het argument is eenvoudig: beter geheugen betekent betere personalisatie.",
        "Maar geheugen creëert ook persistentie. En persistentie creëert risico.",
        "Het USENIX-paper benadrukt hoe aanvallers langdurige geheugenopslag kunnen proberen te vergiftigen met kwaadaardige instructies of misleidende informatie. Eenmaal in geheugen opgeslagen kan die inhoud toekomstige beslissingen beïnvloeden, lang nadat de oorspronkelijke interactie voorbij is.",
        "In tegenstelling tot een tijdelijke prompt injection-aanval kan memory poisoning doorgaan over workflows, gebruikers en tijd. Het resultaat is een fundamenteel ander security-uitdaging.",
      ],
      emphasisBlock: [
        "Geheugen is niet alleen een comfortfeature.",
        "Geheugen is infrastructuur.",
        "En infrastructuur vereist beheer.",
      ],
    },
    {
      title: "De gevaarlijkste agents zijn degene met permissies",
      paragraphs: [
        "De grootste risico's van agentic AI komen niet per se van de intelligentie van het model. **Ze komen van de bevoegdheden die het is gegeven.**",
        "Een model dat een onjuiste alinea genereert is ongemakkelijk. Een agent met toegang tot gebruikersrecords, interne documenten, financiële systemen, communicatieplatformen en automatiseringstools kan echte gevolgen veroorzaken.",
        "Naarmate organisaties agents verbinden met steeds krachtigere systemen, moet de focus verschuiven van modelcapability naar operationele controle.",
      ],
      callout: 'De cruciale vraag is niet meer: "Hoe intelligent is het model?" Maar: "Wat mag het model doen?"',
    },
    {
      title: "Betrouwbare agentsystemen bouwen",
      paragraphs: [
        "De bredere les van het paper is dat agentsecurity **defense in depth** vereist.",
        "Organisaties die AI-agents implementeren zouden moeten prioriteren:",
      ],
      bullets: [
        { label: "Vertrouwde vs. onbetrouwbare data", body: "Sterke scheiding tussen databronnen" },
        { label: "Permissiegrenzen", body: "Expliciete limieten op wat agents mogen doen" },
        { label: "Geheugenbeheer", body: "Controles voor langdurige geheugensystemen" },
        { label: "Menselijke goedkeuring", body: "Bevestiging voor hoog-risico operaties" },
        { label: "Audit en observability", body: "Uitgebreide logging en monitoring" },
        { label: "Tool-toegangsbeleid", body: "Duidelijke regels voor externe integraties" },
      ],
      afterBullets: [
        "Die principes weerspiegelen gevestigde cybersecurity-praktijk omdat AI-agents steeds meer op werknemers lijken dan op softwarefeatures.",
      ],
    },
    {
      title: "De bredere les",
      paragraphs: [
        "De industrie beschrijft AI-agents vaak als **digitale werknemers**. Die analogie wordt steeds accurater.",
        "Werknemers krijgen training. Werknemers werken volgens beleid. Werknemers hebben gedefinieerde permissies. Werknemers worden gemonitord. Werknemers kunnen fouten maken.",
        "AI-agents zijn niet anders. Het enige verschil is dat ze fouten kunnen maken met machinesnelheid.",
        "De meest succesvolle AI-producten van het komende decennium hebben niet alleen de meest capabele modellen. **Ze hebben de sterkste trust-architectuur.**",
      ],
      emphasisBlock: ["Intelligentie trekt gebruikers aan.", "Vertrouwen houdt ze vast."],
    },
  ],
  closingCallout: {
    title: "Context beschermen, niet alleen data",
    body: "Bij PrivateNote.ai geloven we dat het beschermen van context net zo belangrijk wordt als het beschermen van de data zelf. Naarmate AI-systemen toegang krijgen tot onze persoonlijke notities, bedrijfskennis en operationele workflows, moet security verder gaan dan opslag en versleuteling — inclusief de informatie die agents consumeren, onthouden en waarop ze handelen.",
  },
};
