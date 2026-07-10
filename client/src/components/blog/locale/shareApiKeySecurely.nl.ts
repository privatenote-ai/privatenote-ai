import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyNl: ShareApiKeyArticleCopy = {
  heroAlt: "Hotelsleutel aan een genummerd houten sleutelbord",
  heroCaptionPrefix: "Afbeelding van",
  heroArtist: "Hans",
  heroCaptionMiddle: "van",
  heroSource: "Pixabay",
  intro:
    "Elke ontwikkelaar moet op een gegeven moment een API-sleutel naar iemand anders sturen—voor staging-toegang, een aannemer, een webhook-integratie of een klantoverdracht. De snelste manier is meestal ook degene die het langste spoor achterlaat.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord of andere chatgeschiedenis",
    "e-mail, sms of doorgestuurde mailboxthreads",
    "Jira, Trello, Notion, Confluence of GitHub-issues",
    "platte-tekstdocumenten, spreadsheets en gedeelde cloudmappen",
    "git-commits, pull requests en codecommentaren",
  ],
  leakSources: [
    {
      title: "E-mail",
      body: "E-mail creëert langlevende kopieën. Een sleutel kan overleven in mailboxen, archieven, back-ups, mobiele synchronisatie, doorgestuurde threads en zoekindexen—lang nadat de taak is afgerond.",
    },
    {
      title: "Teamchat",
      body: "Slack en Teams bewaren context—wat ze riskant maakt voor geheimen. Een geplakte sleutel kan doorzoekbaar zijn voor toekomstige workspace-leden of lekken via een gecompromitteerd apparaat.",
    },
    {
      title: "Projecttools",
      body: "Jira, Notion, Confluence, Trello en GitHub Issues zijn geen credential-kluizen. Verwijderde tickets kunnen blijven bestaan in exports, back-ups, audittrails en AI-ondersteund zoeken.",
    },
    {
      title: "Git-repositories",
      body: "Git-geschiedenis blijft plakken. Een sleutel in een latere commit verwijderen wist eerdere commits niet. Publieke repos worden continu gescand, en blootgestelde cloudgegevens kunnen binnen minuten worden misbruikt.",
    },
  ],
  prepSteps: [
    {
      title: "Gebruik de kleinst mogelijke scope",
      body: "Vermijd primaire productiesleutels. Geef de voorkeur aan staging-sleutels, alleen-lezen-rechten, IP-beperkingen, kortlevende tokens en integratiespecifieke gegevens.",
    },
    {
      title: "Plan rotatie of intrekking",
      body: "Behandel gedeelde API-sleutels als tijdelijk. Trek ze in na onboarding, tests, aannemersinzet of klantoverdracht.",
    },
    {
      title: "Observeer gebruikspatronen",
      body: "Onverwachte locaties, plotselinge requestpieken, nieuwe endpoints of ongebruikelijke facturering zijn vaak de eerste signalen dat een sleutel is gelekt.",
    },
    {
      title: "Lever via versleutelde eenmalige link",
      body: "Versleutel de sleutel lokaal voordat die een communicatiekanaal betreedt. Stuur een kortlevende link in plaats van het ruwe geheim achter te laten in permanente chat- of e-mailgeschiedenis.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Beperk de sleutel", detail: "Alleen minimale rechten" },
    { key: "encrypt", label: "Lokaal versleutelen", detail: "Sleutel verlaat je browser nooit" },
    { key: "send", label: "Link versturen", detail: "Niet het ruwe geheim" },
    { key: "revoke", label: "Intrekken na gebruik", detail: "Roteer na overdracht" },
  ],
  faqs: [
    {
      question: "Waarom niet gewoon een omgevingsvariabele?",
      answer:
        "Omgevingsvariabelen zijn prima voor lokale software. Ze lossen het transportprobleem niet op wanneer je de waarde moet overdragen aan een collega, aannemer, klant of integratiepartner.",
    },
    {
      question: "Moeten API-sleutels altijd verlopen?",
      answer:
        "Als de provider het ondersteunt: ja. Kortlevende gegevens verkleinen het misbruikvenster na accidentele blootstelling en maken rotatie tot de normale flow.",
    },
    {
      question: "Wat is de veiligste workflow?",
      answer:
        "Maak een strak begrensde sleutel, stuur die via een browser-versleutelde eenmalige link, deel een optioneel wachtwoord via een apart kanaal en roteer of trek de sleutel in na afronding. Voor hoogrisico- of langlevende sleutels: eerst lokaal versleutelen met age of OpenSSL en alleen ciphertext uploaden.",
    },
    {
      question: "Is PrivateNote een secrets manager?",
      answer:
        "Nee. PrivateNote lost veilige menselijke overdracht op. Voor machine-to-machine-opslag gebruik je HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager of Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Behandel API-sleutels als productiewachtwoorden",
      paragraphs: [
        "Een API-sleutel is feitelijk een wachtwoord voor software. Afhankelijk van de rechten kan een gelekte sleutel klantdata blootleggen, betaalde resources verbruiken, cloudinfrastructuur deployen, e-mail versturen via je geverifieerde domein of een AI-rekening opdrijven.",
        "Anders dan menselijke wachtwoorden blijven API-sleutels vaak maanden geldig, liggen ze in configuratiebestanden en omzeilen ze multi-factor-authenticatie volledig. Lekt een sleutel, dan kan een aanvaller optreden als jouw applicatie—kwaadaardig verkeer kan zich verbergen in normaal productieverkeer totdat de kosten stijgen of data al is blootgesteld.",
      ],
    },
    neverPaste: {
      title: "Plak API-sleutels nooit in permanente systemen",
      intro:
        "Deze kanalen zijn handig omdat ze geschiedenis bewaren. Precies daarom zijn ze de verkeerde plek voor geheimen.",
      avoidHeading: "Vermijd deze kanalen",
    },
    whereLeak: {
      title: "Waar API-sleutels echt lekken",
      intro:
        "De meeste leaks zijn geen ingewikkelde cryptobreaks. Ze gebeuren wanneer iemand een geheim kopieert naar een systeem dat is gebouwd om records bij te houden.",
    },
    beforeShare: {
      title: "Voordat je deelt",
      intro:
        "Verklein eerst de schade-radius. Hoe je de sleutel levert telt—maar een strak begrensde sleutel beperkt de schade als er toch iets misgaat.",
      newKeyTitle: "Nieuwe sleutel aanmaken?",
      newKeyBefore: "Genereer hoog-entropische gegevens lokaal in de browser—de",
      newKeyLink: "API-sleutelgenerator",
      newKeyAfter: "op passwords.lu draait client-side; er wordt niets geüpload.",
    },
    highRisk: {
      title: "Hoogrisicosleutels: eerst lokaal versleutelen",
      p1: "De meeste API-sleutels zijn vervangbaar: staging-tokens, kortlevende integratiegeheimen en strak begrensde gegevens die je wilt roteren. Daarvoor volstaat browser-versleutelde eenmalige overdracht meestal.",
      p2: "Sommige sleutels wegen zwaarder—productie-admin-toegang, ondertekeningssleutels, root-cloudgegevens of alles langlevends dat pijnlijk of onmogelijk schoon in te trekken is. Behandel dat als mastergeheimen: **lokaal versleutelen voordat er iets naar het web wordt geüpload**, stuur dan ciphertext via PrivateNote.",
      calloutHeading: "Eerst lokaal versleutelen",
      ageBullet:
        "**age** — eenvoudigste defaults voor bestandsversleuteling (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — betrouwbare CLI als je de flags kent",
      separateChannelBullet:
        "Upload het versleutelde bestand met PrivateNote; stuur het ontsleutelingswachtwoord via een **apart kanaal** (Signal, telefoon, persoonlijk)",
      outro:
        "Dezelfde workflow geldt voor cryptocurrency-herstelzinnen en andere onvervangbare mastergeheimen. Zie [crypto-herstelzinnen en eenmalige links](blog:crypto-seed-phrase-one-time-link) voor de volledige age/OpenSSL-handleiding, wachtwoordzintips en wanneer eenmalige links passen—en wanneer niet.",
    },
    handoff: {
      title: "Een veiligere overdrachtsworkflow",
      intro:
        "Wanneer een mens de sleutel nodig heeft—niet wanneer een app die tijdens runtime ophaalt—volg deze volgorde.",
      diagramCaption: "Veilige overdracht in één oogopslag",
      diagramFootnote:
        "Deel een notitiewachtwoord via een apart kanaal—nooit in hetzelfde bericht als de link.",
    },
    privateNote: {
      title: "Hoe PrivateNote past in de overdracht",
      p1: "PrivateNote is gebouwd voor het mens-tot-mens-moment: API-sleutels, SSH-privésleutels, databasegegevens, herstelcodes, webhook-signing-secrets en tijdelijke wachtwoorden die één persoon moeten bereiken zonder permanent record te worden.",
      p2: "Het geheim wordt in je browser versleuteld vóór upload. PrivateNote slaat ciphertext op, geen platte tekst. De ontsleutelingssleutel zit in het URL-fragment—het deel na `#`—dat de browser bij het laden niet naar de server stuurt.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "De server ontvangt de notitie-ID en de versleutelde payload.",
      bullet2: "De server ontvangt de ontsleutelingssleutel niet.",
      bullet3: "Burn-after-reading en verval beperken hoe lang de versleutelde notitie bestaat.",
      p3: "PrivateNote vult dedicated secret stores aan—het sluit de kloof wanneer je een Stripe-sleutel naar een integratiepartner stuurt, een tijdelijke OpenAI-sleutel deelt met een aannemer of een teamlid eenmalige staging-toegang geeft.",
    },
    faq: { title: "Veelgestelde vragen" },
    bottomLine: {
      title: "De kern",
      body: "De meeste API-sleutelleaks gebeuren niet omdat cryptografie faalde. Ze gebeuren omdat iemand uit gemak een geheim kopieerde naar een permanent, doorzoekbaar systeem. Beperk sleutels, deel alleen wanneer nodig en laat geen platte-tekstspoor achter in chat, tickets, e-mail of git.",
    },
  },
  ctaTitle: "Deel een API-sleutel zonder hem in chat achter te laten",
  ctaBody:
    "Maak een browser-versleutelde PrivateNote-link met burn-after-reading. Voor eenmalige notities geen account nodig.",
  ctaButton: "PrivateNote maken ->",
};
