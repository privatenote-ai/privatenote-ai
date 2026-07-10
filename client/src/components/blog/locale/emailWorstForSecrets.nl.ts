import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsNl: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Laptop op een bureau met een e-mail die servergegevens en een SSH-privésleutel in platte tekst toont",
  intro:
    "E-mail is de standaard geworden om bijna alles te delen—contracten, wachtwoorden, API-sleutels, bankgegevens, medische dossiers, identiteitsdocumenten, wifi-wachtwoorden en herstelcodes. De meesten van ons sturen gevoelige informatie per e-mail zonder er lang bij stil te staan.",
  calloutTitle: "E-mail is gebouwd om berichten te bezorgen—niet om ze te laten verdwijnen",
  calloutBody:
    "Zodra je een e-mail verstuurt, verlies je vaak de controle over waar die terechtkomt, hoe lang die wordt bewaard en wie er ooit toegang toe kan krijgen. Als je iets deelt dat privé moet blijven, is e-mail meestal het verkeerde hulpmiddel.",
  emailCopies: [
    "jouw inbox",
    "de inbox van de ontvanger",
    "back-ups van de e-mailprovider",
    "gearchiveerde kopieën",
    "gesynchroniseerde apparaten",
    "bedrijfsback-upsystemen",
    "geëxporteerde PST- of MBOX-bestanden",
    "disaster-recovery-infrastructuur",
  ],
  agedSecretsExamples: [
    "een productiedatabasewachtwoord",
    "een API-sleutel",
    "SSH-gegevens",
    "VPN-inloggegevens",
    "een cryptocurrency-herstelzin",
  ],
  forwardingPaths: [
    "doorgestuurd",
    "gekopieerd naar ticketsystemen",
    "geplakt in chatapps",
    "bijgevoegd aan andere e-mails",
    "gedeeld met aannemers",
    "opgenomen in supportverzoeken",
  ],
  aiProcessingUses: [
    "spamdetectie",
    "phishingbescherming",
    "malwaredetectie",
    "slimme antwoordsuggesties",
    "inboxcategorisering",
    "zoeken",
    "productiviteitsfuncties",
    "AI-ondersteund schrijven en samenvatten",
  ],
  oneTimeSecretExamples: [
    "een wachtwoord",
    "een API-sleutel",
    "een herstelcode",
    "een softwarelicentie",
    "servergegevens",
    "een vertrouwelijk bericht",
  ],
  oneTimeBenefits: [
    "Geen mailboxgeschiedenis.",
    "Geen doorzoekbaar archief.",
    "Geen per ongeluk doorgestuurd geheim.",
    "Geen vergeten kopieën die jaren in mailboxen blijven liggen.",
  ],
  sections: [
    {
      title: "Je e-mail bestaat niet op één plek",
      paragraphs: [
        "Veel mensen zien e-mail als een eenvoudig gesprek tussen twee personen. In werkelijkheid bestaat elke e-mail meestal op meerdere plekken:",
        "Zelfs als je een e-mail verwijdert, kunnen kopieën elders blijven bestaan. Sommige organisaties bewaren e-mails jarenlang om aan wettelijke, regelgevende of zakelijke vereisten te voldoen. In de praktijk wordt een e-mail vaak permanent.",
      ],
    },
    {
      title: "Geheimen verouderen slecht",
      paragraphs: [
        "Het gevaarlijkste aan e-mail is niet per se vandaag. Het is over vijf jaar. Stel je voor dat je iemand hebt gestuurd:",
        "Misschien zijn de gegevens sindsdien gewijzigd. Misschien niet. Jaren later kan die e-mail nog in meerdere mailboxen liggen—in seconden doorzoekbaar. Wie toegang krijgt tot een van die accounts, heeft plotseling een kaart van je oude geheimen. Onze gids over [geheimen die je nooit in chat moet sturen](blog:secrets-never-send-in-chat) behandelt vergelijkbare risico's in messengerapps—e-mail is vaak erger omdat de bewaartermijn langer is en er meer kopieën zijn.",
      ],
    },
    {
      title: "E-mail is gebouwd om te zoeken",
      paragraphs: [
        "Moderne e-mailclients vinden oude berichten verrassend goed. Zoek op `password`, `API` of `confidential`—en berichten van jaren geleden verschijnen bijna meteen.",
      ],
      callout:
        "Dat is een uitstekende functie voor dagelijks gebruik. Een verschrikkelijke voor geheimen. Gevoelige informatie zou in de loop van de tijd **moeilijker** te vinden moeten worden—niet makkelijker.",
    },
    {
      title: "Doorsturen kost één klik",
      paragraphs: [
        "Misschien vertrouw je de ontvanger. Dat is niet altijd genoeg. E-mails worden routinematig:",
        "Zodra een geheim je inbox verlaat, bepaal je niet meer hoeveel kopieën er bestaan. Anders dan een wachtwoordmanager of een versleutelde deelservice kent e-mail geen intrekking van toegang na bezorging.",
      ],
    },
    {
      title: "AI verwerkt e-mail steeds vaker",
      paragraphs: [
        "Nog een reden om na te denken voordat je gevoelige informatie per e-mail verstuurt: e-mailproviders zetten steeds vaker geautomatiseerde systemen in om berichten te verwerken. Die systemen kunnen helpen bij:",
        "Providers verschillen sterk in hoe deze functies werken, welke data wordt verwerkt en onder welke privacybeleid. Hoewel veel providers de afgelopen jaren sterkere privacyverplichtingen hebben ingevoerd, betekent het versturen van gevoelige informatie per e-mail nog steeds dat je deze systemen buiten je controle vertrouwt. Als je de blootstelling wilt minimaliseren, is minder gevoelige informatie per e-mail een verstandige eerste stap.",
      ],
    },
    {
      title: "Regelgevend scannen hoort ook bij het debat",
      paragraphs: [
        "Privacy is niet langer alleen een technische kwestie. Het is een politieke kwestie geworden. In juli 2026 keurde het Europees Parlement een verlenging goed van het tijdelijke juridische kader dat providers van bepaalde communicatiediensten toestaat om vrijwillig kinderpornografisch materiaal (CSAM) te detecteren en te melden tot april 2028.",
        "Het kader betreft vooral diensten die toegang hebben tot berichtinhoud—zoals veel klassieke e-mailproviders en andere niet [end-to-end-versleutelde](blog:what-is-end-to-end-encryption) communicatiediensten. Meer over wat die stemming betekende—en waarom er ondanks meer tegen- dan voorstemmen toch een aanneming volgde—vind je in onze uitleg over [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "Het verklaarde doel is kinderbescherming, en verstandige mensen kunnen van mening verschillen over de juiste balans tussen privacy en openbare veiligheid. Toch illustreert het debat een belangrijk punt: **kan een dienst je berichten lezen, dan kunnen toekomstige wetten, beleid of platformbeslissingen beïnvloeden hoe die berichten worden verwerkt.** End-to-end-versleutelde diensten zijn fundamenteel anders omdat de provider niet over de cryptografische sleutels beschikt die nodig zijn om de inhoud te lezen.",
    },
    {
      title: "Er is een betere manier om geheimen te delen",
      paragraphs: [
        "Niet alle informatie hoeft voor altijd te bestaan. Soms hoef je iets maar één keer te versturen. Voorbeelden:",
        "In plaats van die direct in een e-mail te sturen, gebruik je een [versleutelde eenmalige link](blog:one-time-secret-links). De ontvanger opent de link, leest het geheim, en de versleutelde data wordt permanent verwijderd. Voor API-sleutels specifiek, zie onze workflowgids [API-sleutels veilig delen](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Browserversleuteling maakt het verschil",
      paragraphs: [
        "Bij PrivateNote gebeurt de versleuteling in je browser, voordat er iets wordt geüpload. Je browser versleutelt het bericht lokaal. Alleen de versleutelde ciphertext bereikt onze servers. De ontsleutelingssleutel verlaat je apparaat nooit en wordt door ons niet opgeslagen.",
        "Als de ontvanger de notitie opent, kan die zo worden ingesteld dat hij na het eerste succesvolle lezen zelfvernietigt of na een gekozen termijn automatisch verloopt. Dat betekent: geen permanente e-mail met het geheim die jaren later kan worden ontdekt. Je kunt [een geheim bericht sturen zonder account](blog:send-secret-message-without-account) of [hoe PrivateNote werkt](app:how-it-works) lezen voor het volledige versleutelingsmodel.",
      ],
      callout:
        "De praktische test is eenvoudig: kan de provider de ontsleutelingssleutel of de platte tekst verkrijgen? Zo ja, dan is het systeem niet echt end-to-end-versleuteld. E-mail faalt die test per ontwerp.",
    },
    {
      title: "Het juiste hulpmiddel voor de juiste informatie",
      paragraphs: [
        "E-mail blijft een van de nuttigste communicatietechnologieën ooit. Het is uitstekend geschikt voor gesprekken, facturen, nieuwsbrieven en alledaagse zakelijke communicatie.",
        "Het is niet de ideale plek voor informatie die moet verdwijnen zodra die haar doel heeft bereikt. Wachtwoorden, herstelcodes, API-sleutels, vertrouwelijke documenten en andere gevoelige informatie verdienen een deelmechanisme dat met privacy in gedachten is ontworpen.",
        "**Soms is het veiligste geheim het geheim dat simpelweg niet meer bestaat.**",
      ],
    },
  ],
  ctaTitle: "Deel een geheim zonder het in iemands inbox achter te laten",
  ctaBody:
    "Maak een versleutelde eenmalige notitie in je browser. Stuur de link per e-mail als je moet—het geheim zelf blijft buiten de thread.",
  ctaButton: "PrivateNote proberen ->",
};
