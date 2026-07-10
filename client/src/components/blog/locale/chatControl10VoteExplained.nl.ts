import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedNl: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Stemming in het Europees Parlement over Chat Control met vergrendelde chatballon boven een Europakaart",
  heroCaption: "Illustratie gemaakt voor PrivateNote.ai.",
  intro:
    "Op 9 juli 2026 gebeurde er iets ongewoons in het Europees Parlement. De eindstemming over de verlenging van de tijdelijke Chat Control 1.0-verordening eindigde met meer afgevaardigden tegen dan voor—en de maatregel werd toch aangenomen.",
  voteEyebrow: "Eindstemming, 9 juli 2026",
  voteHeadline: "Meer tegen- dan voorstemmen—en toch aangenomen",
  voteLabels: { against: "Tegen", for: "Voor", abstentions: "Onthoudingen" },
  voteSummary:
    "Op het eerste gezicht zouden de meeste waarnemers concluderen dat het voorstel was verworpen. Het antwoord ligt niet in versleuteling of cybersecurity—maar in het parlementaire proces.",
  nonE2eChannels: [
    "klassieke e-maildiensten",
    "cloudopslag",
    "bepaalde directe berichtendiensten",
    "andere communicatie waarbij providers toegang hebben tot berichtinhoud",
  ],
  privacyConcerns: [
    {
      title: "Vals-positieven",
      body: "Het detecteren van reeds bekende illegale inhoud via cryptografische hashes is over het algemeen betrouwbaar, maar niet perfect. Onderzoekers hebben botsingen en implementatiefouten aangetoond die valse meldingen kunnen veroorzaken. Zetten providers AI in om nieuw, nog niet gezien materiaal te identificeren, dan wordt de vals-positievenratio aanzienlijk moeilijker te beheersen. Elke valse melding kan betekenen dat de privécommunicatie van een onschuldig persoon voor verder onderzoek wordt gemarkeerd.",
    },
    {
      title: "Uitbreiding van surveillantie-infrastructuur",
      body: "Veel experts stellen: zodra platforms grootschalige scansystemen opbouwen, is uitbreiding naar andere doeleinden technisch eenvoudig. De geschiedenis laat zien dat voor smalle doeleinden ingevoerde technologieën vaak bredere surveillance worden.",
    },
    {
      title: "Afschrikwekkend effect",
      body: "Privécommunicatie werkt alleen als mensen erop vertrouwen dat hun gesprekken privé blijven. Geloven gebruikers dat elk bericht automatisch kan worden geanalyseerd, dan vermijden velen gevoelige onderwerpen helemaal—ook als die volledig legaal zijn. Dit fenomeen is goed gedocumenteerd in privacyonderzoek.",
    },
    {
      title: "Beperkte effectiviteit",
      body: "Meer dan 800 cybersecurity- en privacyonderzoekers stellen dat breed berichtenscannen kindermisbruik nauwelijks merkbaar zal verminderen, maar aanzienlijke privacykosten voor honderden miljoenen gebruikers veroorzaakt. Critici vinden gerichte onderzoeken zinvoller dan algemeen scannen.",
    },
  ],
  e2eeCalloutTitle: "End-to-end-versleuteling verandert het vertrouwensmodel",
  e2eeCalloutBody:
    "End-to-end-versleuteling zorgt ervoor dat alleen afzender en beoogde ontvanger de cryptografische sleutels bezitten om een bericht te lezen. Zelfs de dienstverlener kan de inhoud niet ontsleutelen. Elke verplichting om versleutelde berichten vóór of na de versleuteling te controleren, verandert dit beveiligingsmodel fundamenteel—en is een van de meest omstreden onderwerpen in het moderne cybersecuritybeleid.",
  sections: {
    whyPassed: {
      title: "Waarom werd het toch aangenomen?",
      paragraphs: [
        "Dit was geen normale wetgevingsstemming met een eenvoudige meerderheid van uitgebrachte stemmen. Vanwege de specifieke procedurele fase vereiste een **verwerping van het voorstel een absolute meerderheid van alle leden van het Europees Parlement—momenteel 361 stemmen**.",
        "Hoewel 314 afgevaardigden tegen stemden, volstond dat niet voor de vereiste drempel. Bijgevolg werd het voorstel als aangenomen beschouwd.",
      ],
      callout:
        "Dit procedurele resultaat verraste veel waarnemers—journalisten, juristen en cybersecurityonderzoekers—omdat je intuïtief verwacht dat meer tegen- dan voorstemmen een voorstel laat mislukken.",
    },
    whatItDoes: {
      title: "Wat doet Chat Control 1.0 echt?",
      paragraphs: [
        "De aangenomen maatregel voert **geen** verplicht scannen van alle privéberichten in. In plaats daarvan verlengt ze het bestaande tijdelijke juridische kader dat online dienstverleners toestaat om **vrijwillig** kinderpornografisch materiaal (CSAM) in bepaalde communicatievormen te detecteren en te melden tot 3 april 2028.",
        "Dat betreft vooral communicatie zonder [end-to-end-versleuteling](blog:what-is-end-to-end-encryption), zoals:",
        "Belangrijk: het Parlement handhaafde formuleringen die end-to-end-versleutelde communicatie uitsluiten van dit vrijwillige scanraamwerk. Een precieze definitie—en het verschil met gewone transportversleuteling—vind je in onze gids [Wat end-to-end-versleuteling echt is](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Waarom maken privacyexperts zich zorgen?",
      intro:
        "Veel onderzoekers en burgerrechtenorganisaties verwierpen de verlenging—niet omdat ze kinderbescherming afwijzen, maar omdat ze twijfelen of deze aanpak het doel bereikt zonder aanzienlijke risico's te creëren. Ons eerdere artikel [Waarom Europese cryptografen waarschuwen voor Chat Control](blog:chat-control-europe-cryptographers) legt de bredere technische bezwaren uitgebreid uit.",
    },
    chatControl20: {
      title: "Het grotere verhaal heet Chat Control 2.0",
      paragraphs: [
        "Hoewel deze weekstemming veel aandacht kreeg, geloven veel experts dat het echte debat nog moet komen. Het voorstel dat vaak Chat Control 2.0 wordt genoemd, richt zich op een permanent juridisch kader voor het detecteren van CSAM online.",
        "Anders dan de deze week aangenomen tijdelijke verlenging omvatten discussies over Chat Control 2.0 herhaaldelijk voorstellen die end-to-end-versleutelde communicatie kunnen raken. Daar wordt het debat aanzienlijk belangrijker—en daar tellen de waarschuwingen in ons [cryptografenbriefing over Chat Control](blog:chat-control-europe-cryptographers) het meest.",
      ],
    },
    privateNote: {
      title: "Waarom dit belangrijk is voor PrivateNote",
      paragraphs: [
        "Privécommunicatie rust op een eenvoudig principe: kan een dienst je bericht niet lezen, dan kan die het niet scannen, analyseren, verkopen of per ongeluk onthullen. PrivateNote is rond dat idee ontworpen.",
        "Als je een notitie maakt, gebeurt de versleuteling direct in je browser. De versleutelingssleutel bereikt onze servers nooit. We slaan alleen ciphertext op. Zonder de sleutel—die volledig onder jouw controle blijft—is de inhoud van je notitie voor ons wiskundig onleesbaar.",
        "Dit ontwerp gaat niet over het vermijden van verantwoordelijkheid. Het gaat erom te zorgen dat je privécommunicatie precies dat blijft: privé. Of je nu wachtwoorden, juridische documenten, financiële informatie, bedrijfsgeheimen of persoonlijke gesprekken deelt—privacy zou niet alleen moeten afhangen van vertrouwen in de provider. Die zou door cryptografie moeten worden afgedwongen.",
        "Stap voor stap naar browser-side versleuteling: [Hoe PrivateNote werkt](app:how-it-works). Voor kortlevende geheimen zonder permanente chatgeschiedenis zijn [eenmalige geheimlinks](blog:one-time-secret-links) vaak passender dan messengers—ook versleutelde.",
      ],
    },
    debateContinues: {
      title: "Het debat is allerminst voorbij",
      paragraphs: [
        "Verstandige mensen kunnen van mening verschillen over hoe de samenleving online kindermisbruik moet bestrijden. Kinderbescherming is ongetwijfeld een van de belangrijkste publieke belangen. De moeilijke vraag is hoe je dat doel bereikt zonder de beveiligings- en privacy-infrastructuur te ondermijnen waar journalisten, bedrijven, advocaten, zorgverleners, activisten en burgers dagelijks op vertrouwen.",
        "Terwijl de discussies over Chat Control 2.0 doorgaan, blijft deze balans tussen openbare veiligheid en grondrechten op privacy een van de bepalende technologiepolitieke debatten van Europa. Ongeacht je standpunt: de toekomst van versleutelde communicatie wordt steeds minder alleen bepaald door cryptografen en software-engineers—maar ook door wetgevers.",
      ],
    },
  },
  ctaTitle: "Stuur privénotities zonder de server de sleutel te geven",
  ctaBody:
    "PrivateNote versleutelt notities in je browser en houdt de ontsleutelingssleutel in het URL-fragment.",
  ctaButton: "PrivateNote proberen ->",
};
