import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksNl: OneTimeSecretLinksArticleCopy = {
  intro: [
    "De meeste mensen delen gevoelige informatie op dezelfde manier als alles anders: via e-mail, in Slack of per sms.",
    "Dat werkt totdat je beseft wat je eigenlijk hebt gedaan. Je hebt niet alleen een wachtwoord of API-sleutel overgedragen — je hebt een **permanent record** achtergelaten in iemands inbox, het chatarchief van het bedrijf, een cloudback-up, een compliance-export of een AI-vergadersamenvatting waar niemand meer aan denkt.",
    "In de rechtszaak **Musk vs. Altman** in 2026 werden sms'jes tussen Sam Altman en Mira Murati over zijn vertrek bij OpenAI in november 2023 als bewijs ingediend. Uitwisselingen die op het moment privé leken — drukke berichten over bestuursoproepen en terugkeer — werden uiteindelijk gerechtelijke bijlagen. Het probleem was geen onderschepping. Het probleem was **retentie**.",
    "Sommige informatie heeft een korte rol. Een staging-wachtwoord. Een herstelcode. Een eenmalige toegangsinstructie. Contractor-credentials die vrijdag verlopen. Die geheimen hebben geen doorzoekbare geschiedenis nodig. Ze moeten aankomen, gebruikt worden en verdwijnen.",
    "Daar zijn **eenmalige geheime links** voor bedoeld.",
  ],
  sections: [
    {
      title: 'Het probleem met kanalen die „veilig genoeg" zijn',
      paragraphs: [
        "E-mail kan versleuteld zijn in transit. Slack kan SSO hebben. Signal biedt verdwijnende berichten. Dat helpt allemaal — maar het lost een ander probleem op.",
        "Het probleem is niet altijd onderschepping. Het probleem is **retentie**.",
        "Als je een geheim via een gewoon kanaal stuurt, wed je op een lange keten van aannames:",
      ],
      bullets: [
        { label: "Het bericht wordt nooit doorgestuurd, gescreenshot of gekopieerd.", body: "" },
        { label: "Niemand doorzoekt per ongeluk zes maanden later de gedeelde chatgeschiedenis.", body: "" },
        {
          label:
            "Back-ups, serverexports en eDiscovery-workflows maken van een snelle overdracht geen langdurige aansprakelijkheid.",
          body: "",
        },
        {
          label:
            "Link-previewbots in Slack, Teams of iMessage halen de URL niet automatisch op en vernietigen de notitie voordat de ontvanger de link opent.",
          body: "",
        },
        {
          label:
            "Het geheim wordt direct na gebruik geroteerd, ook al ligt de oude waarde nog ergens in een serverlog.",
          body: "",
        },
      ],
      callout:
        "**Rolscheiding:** Versleuteling beschermt inhoud onderweg. Kortstondigheid vermindert wat daarna bestaat. Beide zijn belangrijk — maar de meeste communicatietools optimaliseren voor het eerste en negeren het tweede volledig.",
    },
    {
      title: "Wat een eenmalige geheime link eigenlijk is",
      paragraphs: [
        'Een eenmalige geheime link (soms een **burn-after-reading**-link of zelfvernietigende notitie genoemd) is een URL bedoeld om gevoelige tekst één keer aan één lezer te leveren. Na dat ene lezen zou de inhoud weg moeten zijn — niet gearchiveerd, niet doorzoekbaar, niet achtergelaten in een inbox of chatgeschiedenis.',
        "**Echt eenmalig ontwerp** is strenger dan vervaltijd. Cruciaal: **de versleutelingssleutel wordt in je browser gegenereerd** — nooit op de server — en platte tekst wordt daar versleuteld vóór elke overdracht.",
      ],
      chromeExtensionCta: "Installeer Chrome-extensie",
      beforeFlowSteps: "**In de praktijk ziet de hele flow er zo uit:**",
      flowSteps: [
        {
          title: "Sleutelgeneratie en versleuteling in de browser",
          step: "Stap 1: Je browser",
          body: "Je typt het geheim in de browser. De browser genereert lokaal een nieuwe versleutelingssleutel en versleutelt de tekst ermee — voordat een netwerkverzoek je apparaat verlaat.",
        },
        {
          title: "Alleen versleutelde tekst wordt overgedragen",
          step: "Stap 2: Server",
          body: "Alleen de versleutelde inhoud wordt overgedragen. De server slaat versleutelde tekst op die hij niet kan lezen omdat hij nooit de sleutel of platte tekst heeft ontvangen.",
        },
        {
          title: "De sleutel blijft in de link",
          step: "Stap 3: URL",
          body: "De in de browser gegenereerde sleutel wordt aan de link toegevoegd in het URL-fragment — het deel na # — dat nooit naar de server wordt gestuurd.",
        },
        {
          title: "Eén lezing, dan weg",
          step: "Stap 4: Ontvanger",
          body: "De ontvanger opent de volledige link. De browser leest de sleutel uit het fragment, ontsleutelt lokaal en de server verwijdert de versleutelde inhoud na dat eerste succesvolle lezen.",
        },
      ],
      afterFlowSteps: [
        "Niet elke tool die zich als eenmalige geheime link verkoopt volgt dit patroon. Sommige tools versleutelen pas op de server nadat ze je tekst hebben ontvangen — of genereren daar de sleutel, waardoor de dienst je geheim zou kunnen lezen. Anderen vertrouwen op een gedeeld wachtwoord dat de dienst kan verifiëren. Weer anderen verwijderen op schema maar bewaren metadata, logs of herstelbare kopieën. Vraag bij het kiezen van een tool of het volledige ontwerp is geïmplementeerd — niet alleen of de link verloopt.",
      ],
    },
    {
      title: "Waarom het URL-fragment ertoe doet",
      paragraphs: [
        "Dit architectuurdetail wordt gemakkelijk over het hoofd gezien — en toch is het de basis van moderne webcryptografie.",
        "In een standaard HTTPS-verzoek wordt alles vóór het #-symbool rechtstreeks naar de server gestuurd. Alles erna blijft in de sandbox van de browser. Een goed ontworpen eenmalig-link-systeem kan versleutelde inhoud opslaan onder /note/abc123, terwijl de ontsleutelingssleutel onder #xK9m2p... onzichtbaar blijft voor serverlogs, CDN-paden en externe databasetabellen.",
      ],
    },
    {
      title: "Wanneer een eenmalige link gebruiken (en wanneer niet)",
      paragraphs: [
        "Niet elk kanaal is verkeerd voor elk type geheim — maar de meeste dagelijkse tools zijn gebouwd voor persistentie, niet voor eenmalige overdracht.",
      ],
      table: [
        {
          channel: "E-mail",
          encrypted: "Vaak in transit",
          persistent: "Ja — permanent, in meerdere inboxen",
          verdict: "✗ Slecht",
        },
        {
          channel: "Slack / Teams",
          encrypted: "Ja, op platform",
          persistent: "Ja — doorzoekbaar, exporteerbaar",
          verdict: "✗ Slecht",
        },
        {
          channel: "SMS / iMessage",
          encrypted: "Zeer wisselend",
          persistent: "Vaak back-up, cloudsynchronisatie",
          verdict: "✗ Slecht",
        },
        {
          channel: "Wachtwoordmanager",
          encrypted: "Ja",
          persistent: "Ontworpen voor permanente opslag",
          verdict: "Vaak onhandig — vaak betaald, traag voor snelle overdracht",
        },
        {
          channel: "Signal / WhatsApp (verdwijnende berichten)",
          encrypted: "Ja, end-to-end",
          persistent: "Berichten verdwijnen na verloop van tijd",
          verdict: "Goed — beide partijen hebben een account nodig",
        },
        {
          channel: "Eenmalige link",
          encrypted: "Ja, client-side",
          persistent: "Direct verwijderd na lezen",
          verdict: "✓ Hiervoor bedoeld",
        },
      ],
      goodFits: [
        "Wachtwoorden, API-sleutels en tijdelijke tokens overgedragen aan één persoon.",
        "Systeemherstelcodes en 2FA-back-ups.",
        'Tijdelijke fysieke toegangsinstructies („gebruik deze deurcode tot 18:00").',
        "Juridisch of HR-gevoelige concepten die geen institutioneel geheugen zouden moeten worden.",
      ],
      poorFits: [
        "Langetermijnopslag: gebruik een dedicated wachtwoordkluis.",
        "Doorlopende gesprekken: gebruik een end-to-end versleutelde messenger zoals Signal.",
        "Geheimen voor audit: als compliance een onveranderlijk spoor vereist, gebruik het goedgekeurde opslagsysteem van de organisatie.",
      ],
    },
    {
      title: "De link-preview-valkuil",
      paragraphs: [
        "Dit is een manier waarop veel teams het op de harde manier ontdekken. Veel zakelijke chatapps crawlen automatisch inkomende URL's om rich previews te genereren (titels, beschrijvingen, thumbnails).",
        "Die automatische crawl kan een eenmalige link verbruiken voordat de ontvanger überhaupt kan klikken. De previewbot wordt de eerste lezer, de notitie wordt verwijderd of vernietigd en je collega opent een dode link.",
        "Serieuze kortstondigheidstools mitigeren dit actief: bekende crawler user-agents blokkeren, een expliciete klik vereisen vóór lokale ontsleuteling en zeer korte vervaltijden gebruiken.",
      ],
    },
  ],
  tableHeaders: {
    channel: "Kanaaltype",
    encrypted: "Versleuteld?",
    persistent: "Permanent?",
    verdict: "Goed voor eenmalige geheimen?",
  },
  goodFitsLabel: "Goede use cases",
  poorFitsLabel: "Slechte use cases",
  closingTitle: "Waar PrivateNote staat",
  closingBody:
    "PrivateNote is precies rond dit client-side versleutelingsmodel gebouwd. Het is geen langetermijn wachtwoordkluis, geen teamwiki en geen permanent compliance-archief. Het is een lichtgewicht, snelle overdrachtstool.",
  encryptLu:
    "Voor grotere bestanden die hetzelfde client-side versleutelingsmodel nodig hebben, past [Encrypt.lu](https://encrypt.lu) dezelfde architectuuraanpak toe op bestandsschaal.",
  tagline:
    "Het zorgt ervoor dat de levensduur van gevoelige data overeenkomt met die van het medium waardoor het reist. Want soms is het veiligste bericht degene die volledig ophoudt te bestaan.",
  relatedReading: "Verder lezen",
};
