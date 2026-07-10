import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersNl: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Redactionele grafiek 'Chat Control is terug' met vergrendelde chatballon boven een Europakaart",
  heroCaption: "Illustratie gemaakt voor PrivateNote.ai.",
  intro:
    "Vandaag, dinsdag 7 juli, behandelt het Europees Parlement naar verwachting opnieuw de voorgestelde verordening ter bestrijding van seksueel kindermisbruik (CSAR)—door critici vaak Chat Control genoemd. Het doel van het voorstel is niet omstreden: kinderen moeten worden beschermd tegen verschrikkelijk misbruik. De technische vraag is of verplicht scannen van privécommunicatie dat kan doen zonder de beveiligingsgaranties te breken waar iedereen op vertrouwt.",
  updatePrefix:
    "**Update (9 juli 2026):** Het Parlement verlengde Chat Control 1.0, hoewel meer afgevaardigden tegen stemden dan voor.",
  updateLink: "Lees wat er gebeurde en waarom",
  updateSuffix: ".",
  calloutTitle: "Dit debat gaat niet over óf kindermisbruik moet worden bestreden.",
  calloutBody:
    "Slachtoffers verdienen bescherming. Opsporing verdient effectieve hulpmiddelen. Platforms moeten bekend illegaal materiaal snel melden en meewerken aan onderzoeken. Het geschil is of massascanning van alle privéberichten technisch een zinvolle weg daarheen is.",
  expertEyebrow: "Expertwaarschuwing",
  expertTitle: "Bart Preneel: de securitycommunity is ongewoon eensgezind",
  expertParagraphs: [
    "Bart Preneel, hoogleraar aan de KU Leuven en een van de bekendste Europese experts op het gebied van cryptografie, privacy en digitale rechten, waarschuwde vandaag dat Chat Control na twee eerdere, onbesliste stemmingen terugkeert voor een derde stemming. In zijn LinkedIn-post beschreef hij het voorstel als algemeen scannen van onversleutelde communicatie, nu uitgebreid met AI om nieuw CSAM te zoeken.",
    "Preneel verwees ook naar de ongewoon brede expertconsensus achter de kritiek: meer dan 800 cybersecurity- en privacyexperts waarschuwen dat massascanning en AI-gebaseerde inhoudsanalyse nog steeds onaanvaardbare foutpercentages hebben, ernstige proportionaliteitsbezwaren oproepen en minder effectief zijn dan gerichte aanpakken. Zoals hij het formuleerde, bereikt de securitycommunity zelden dit niveau van eensgezindheid over een onderwerp.",
    "Zijn praktische aanbeveling is direct: neem contact op met leden van het Europees Parlement en leg uit waarom algemeen scannen geen zinvolle weg is om het ernstige probleem van CSAM-verspreiding aan te pakken.",
    "Voor de technische achtergrond verwijst hij naar twee wetenschappersbrieven: de open brief van september 2025 die de kernbezwaren over client-side scannen en AI-gebaseerde detectie uitlegt, en de follow-up van november 2025 die stelt dat de voorgestelde uitbreiding dezelfde risico's versterkt die de securitycommunity al heeft geïdentificeerd.",
  ],
  expertLinks: {
    preneel: "LinkedIn-post van Bart Preneel",
    sep2025: "Open brief september 2025",
    nov2025: "Follow-up november 2025",
  },
  technicalConcerns: [
    {
      title: "AI kan onbekend CSAM op internet schaal niet betrouwbaar classificeren",
      body: "Beeldclassificatie hangt af van context. Familiefoto's, medische beelden, lesmateriaal en consensuele beelden onder jongeren zijn zelfs voor mensen moeilijk correct in te delen.",
    },
    {
      title: "Bekende-beeldmatching is te omzeilen",
      body: "Bijsnijden, schalen, compressie, kleine pixelwijzigingen en adversarial perturbaties kunnen een beeld voor mensen herkenbaar laten, terwijl geautomatiseerde matchingsystemen het anders zien.",
    },
    {
      title: "Client-side scannen verandert het versleutelingsvertrouwensmodel",
      body: "Het versleutelingsalgoritme kan wiskundig sterk blijven, maar de software moet inhoud controleren voordat versleuteling die beschermt. Dat is niet de privacygarantie die gebruikers van end-to-end-versleuteling verwachten.",
    },
    {
      title: "Scaninfrastructuur wordt een waardevol aanvalsdoel",
      body: "Zodra apparaten privéberichten moeten controleren, kan hetzelfde mechanisme aanvallers, politieke druk en toekomstige eisen aantrekken om naar meer inhoudscategorieën te scannen.",
    },
  ],
  protectedGroups: [
    "journalisten en vertrouwelijke bronnen",
    "advocaten en cliënten",
    "artsen en patiënten",
    "bedrijven die bedrijfsgeheimen beschermen",
    "overheidsfunctionarissen en diplomaten",
    "opsporing en militaire communicatie",
  ],
  betterInvestments: [
    { title: "Slachtoffers ondersteunen", body: "Trauma-gevoelige meldkanalen en langetermijnhulp voor slachtoffers." },
    { title: "Specialisten financieren", body: "Meer capaciteit voor getrainde onderzoeksteams." },
    { title: "Bewijs onderzoeken", body: "Snelle, gerichte opsporing op basis van concrete tips en meldingen." },
    { title: "Grensoverschrijdend werken", body: "Internationale samenwerking wanneer daders, platforms en slachtoffers meerdere rechtsgebieden raken." },
    { title: "Bevestigd materiaal verwijderen", body: "Snellere verwijdering van bekende illegale inhoud na correcte bevestiging." },
    { title: "Misbruik eerder voorkomen", body: "Voorlichting en preventie voordat misbruik ontstaat." },
  ],
  betterInvestmentEyebrow: "Betere investering",
  betterInvestmentTitle: "Versterk het werk dat slachtoffers en opsporing direct helpt",
  sections: {
    proposalReturns: {
      title: "Het voorstel blijft terugkomen",
      paragraphs: [
        "De afgelopen jaren doorliep CSAR meerdere herzieningen. Sommige verbeteringen verdienen erkenning: snellere verwerking van vrijwillige meldingen, duidelijkere verplichtingen en smallere inhoudscategorieën zijn beter dan bredere, vagere mandaten.",
        "Die wijzigingen lossen het centrale technische probleem echter niet op. De meest omstreden versies van Chat Control blijven steunen op detectietechnologieën waar cryptografen, informatici en securityonderzoekers voor waarschuwen—niet betrouwbaar genoeg voor honderden miljoenen privécommunicaties.",
      ],
    },
    cryptographersObject: { title: "Waarom cryptografen blijven protesteren" },
    e2eeScanning: {
      title: "End-to-end-versleuteling overleeft geen verplicht client-side scannen",
      paragraphs: [
        "End-to-end-versleuteling geeft gebruikers een eenvoudige belofte: alleen afzender en beoogde ontvanger kunnen het bericht lezen. Verplicht client-side scannen verandert die belofte. Het apparaat moet het bericht controleren voordat versleuteling het beschermt, en alles melden wat het scansysteem als verdacht bestempelt.",
        "Tijdens transport kan het bericht nog steeds sterk versleuteld zijn. Het probleem zit ervoor. Moet software platte tekst op het apparaat controleren en treffers melden aan een extern systeem, dan handelt het eindpunt niet meer alleen voor de gebruiker. Dat is een ander vertrouwensmodel dan end-to-end-versleuteling zoals mensen die begrijpen.",
      ],
    },
    encryptionProtects: {
      title: "Versleuteling beschermt meer dan privéchats",
      intro:
        "Het publieke debat klinkt vaak alsof versleutelde communicatie alleen over informele gesprekken gaat. Dat klopt niet. Veilige privécommunicatie is kritieke infrastructuur voor mensen en instellingen met reëel risico.",
    },
    moreTech: {
      title: "Meer technologie betekent niet automatisch meer veiligheid",
      paragraphs: [
        "Het voorstel staat naast bredere eisen voor leeftijdsverificatie en extra beschermingssystemen. Dat klinkt als extra beveiligingslagen, maar security engineering verbetert zelden door complexiteit zonder begrip van de nieuwe aanvalsoppervlakken.",
        "Gecentraliseerde identiteitscontroles, scanpijplijnen, reviewwachtrijen en meldinfrastructuur kunnen eigen privacyrisico's introduceren. Een systeem voor kinderbescherming zou niet stilletjes nieuwe databases, nieuwe surveillanceprikkels en nieuwe foutmodi voor iedereen moeten creëren.",
      ],
    },
    betterWays: {
      title: "Er zijn betere manieren om kinderen te beschermen",
      intro:
        "Eén punt uit de wetenschappelijke kritiek verdient bijzondere aandacht: CSAM is bewijs van een eerdere misdaad. Het echte doel zou moeten zijn misbruik voorkomen, slachtoffers ondersteunen en gerichte opsporing mogelijk maken die daders daadwerkelijk identificeert.",
    },
    privateNote: {
      title: "Waarom dit belangrijk is voor PrivateNote",
      paragraphs: [
        "Bij PrivateNote is het principe eenvoudig: als je een versleutelde notitie maakt, mogen alleen de door jou gekozen personen die lezen. Niet wij. Niet adverteerders. Niet cloudproviders. Niemand anders.",
        "Dit principe is geen slogan. Het weerspiegelt decennia cryptografisch engineeringwerk. Het debat over Chat Control vraagt of privécommunicatie echt privé moet blijven—of dat elk apparaat een verplichte controlepost wordt die berichten controleert voordat ze worden versleuteld.",
      ],
    },
    policyReality: {
      title: "Beleid moet de technische realiteit volgen",
      paragraphs: [
        "Verstandige mensen kunnen in de politiek van mening verschillen. **Maar beleid moet worden geïnformeerd door technische realiteit.** Als honderden cryptografen, informatici, security engineers en privacyonderzoekers waarschuwen dat een voorgestelde technologie haar beloften niet kan waarmaken zonder fundamentele beveiligingsgaranties te verzwakken, moeten wetgevers luisteren.",
        "Kinderen beschermen en veilige communicatie beschermen sluiten elkaar niet uit. Europa zou oplossingen moeten nastreven die beide bereiken.",
      ],
    },
  },
  ctaTitle: "Stuur privénotities zonder de server de sleutel te geven",
  ctaBody:
    "PrivateNote versleutelt notities in je browser en houdt de ontsleutelingssleutel in het URL-fragment.",
  ctaButton: "PrivateNote proberen ->",
};
