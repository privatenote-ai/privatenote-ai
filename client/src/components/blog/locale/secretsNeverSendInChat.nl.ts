import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatNl: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Van Slack en Microsoft Teams tot WhatsApp en Messenger: chat is voor veel mensen de standaardmanier geworden om informatie uit te wisselen. Het is snel, handig en houdt teams op één lijn. Helaas is het ook een digitaal graf geworden voor zeer gevoelige data: uit gemak gedeeld en daarna vergeten.",
    "Veel moderne chatapps bieden sterke [transportversleuteling](blog:encrypted-vs-secure-file-sharing) of zelfs end-to-end-versleuteling. Versleuteling beschermt berichten terwijl ze tussen apparaten onderweg zijn. Het grotere probleem begint daarna. Zodra een geheim in een chat belandt, blijft het vaak maanden of jaren doorzoekbaar over meerdere systemen heen.",
    "Die duurzaamheid creëert een verrassend grote digitale voetafdruk. Gevoelige informatie kan verder leven in doorzoekbare chatgeschiedenis, cloudback-ups, workspace-exports, meldingspreviews, screenshots en gesynchroniseerde apparaten.",
    "Volgens [Verizons Data Breach Investigations Report 2026](https://www.verizon.com/business/resources/reports/dbir/) heeft **62% van de beveiligingsincidenten een menselijke factor**: gestolen inloggegevens, phishing, social engineering, misbruik en simpele fouten. Techniek alleen voorkomt zulke incidenten niet als gevoelige informatie ondoordacht wordt gedeeld.",
    "Een veiligere aanpak volgt een simpel principe: **deel informatie alleen wanneer die nodig is, en zorg dat die verdwijnt na de eerste keer bekijken.** Daarop zijn [eenmalige links voor geheimen](blog:one-time-secret-links) gebaseerd, en daarom behandelt PrivateNote de levensduur van een notitie als onderdeel van de beveiliging, niet als bijzaak.",
  ],
  chatScreenshotCaption:
    "Illustratief voorbeeld: leesbare inloggegevens in een teamchat blijven bewaard in kanaalgeschiedenis, back-ups en zoekfuncties, lang nadat de overdracht klaar is.",
  cheatSheetTitle: "De beveiligings-spiekbrief",
  cheatSheetHeaders: ["Nooit sturen", "Het risico", "Betere aanpak"],
  cheatSheetRows: [
    {
      neverSend: "Wachtwoorden",
      risk: "Worden geïndexeerd in blijvende chatgeschiedenis en doorzoekbare logs.",
      better: "[Eenmalige link met browserversleuteling](blog:one-time-secret-links).",
    },
    {
      neverSend: "Herstelcodes",
      risk: "Omzeilen multi-factor-authenticatie feitelijk permanent.",
      better: "Dedicated wachtwoordmanager of [eenmalige notitie](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "API-sleutels",
      risk: "Eén onbedoelde plak in een openbaar kanaal compromitteert productieomgevingen.",
      better: "[Zelfverwijderende beveiligde notitie](blog:privatenote-for-developers) met browserversleuteling.",
    },
    {
      neverSend: "Documenten",
      risk: "Laten blijvende kopieën achter in lokale downloadmappen en gesynchroniseerde apparaten.",
      better: "[Tijdelijke versleutelde bestandsoverdracht](app:secure-file-transfer) met beperkte toegang.",
    },
  ],
  whyChatTitle: "Waarom chat geen geheimenbeheerder is",
  whyChatParagraphs: [
    "Messagingplatforms zijn gebouwd voor communicatie, niet voor geheimenbeheer. Hun doel is gesprekken over apparaten heen bewaren, geschiedenis synchroniseren, zoeken mogelijk maken, back-ups maken en samenwerking traceerbaar houden.",
    "Precies die functies worden een risico wanneer inloggegevens of bedrijfsgevoelige data worden gedeeld. De informatie blijft toegankelijk, lang nadat ze haar doel heeft bereikt. Ons artikel over [werkplekberichten en juridische vindbaarheid](blog:workplace-texts-private-note) laat zien hoe nonchalant geschreven berichten hun oorspronkelijke context jaren kunnen overleven.",
    "Een eenmalig geheim volgt een ander model: de informatie is alleen beschikbaar voor de korte periode waarin ze echt nodig is, en daarna wordt server-side toegang by design verwijderd.",
  ],
  lifetimeTitle: "Datalevensduur: klassieke chat versus PrivateNote",
  lifetimeIntro: "Het verschil zit niet alleen in of een bericht onderweg versleuteld is. Het gaat erom of het geheim na het lezen nog ergens bestaat.",
  chatWorkflowLabel: "Klassiek chatproces",
  chatWorkflowSteps: ["Wachtwoord", "Slack / Teams", "Opgeslagen", "Doorzoekbaar", "Back-ups", "Jaren later"],
  chatWorkflowOutcome: "Het geheim blijft bestaan over systemen heen",
  privateNoteWorkflowLabel: "PrivateNote-proces",
  privateNoteWorkflowSteps: [
    "Wachtwoord",
    "Versleutelen in browser",
    "Eenmalige link",
    "Geopend",
    "Van server verwijderd",
  ],
  privateNoteWorkflowOutcome: "Het geheim wordt verwijderd na bezorging",
  secretsTitle: "10 geheimen die niet in chatapps horen",
  secrets: [
    {
      title: "Accountwachtwoorden",
      paragraphs: [
        "Iedereen kent de situatie: \"Wat was ook alweer het login voor het gedeelde marketingaccount?\" en even later staat het wachtwoord in leesbare vorm in de chat. Zelfs als je je collega volledig vertrouwt, staat dit wachtwoord nu geïndexeerd in de workspace-geschiedenis, gecachet in lokale appdata en mogelijk zichtbaar in e-mail- of pushmeldingen.",
        "Als een aanvaller maanden later die chatgeschiedenis compromitteert, erft hij actieve toegang tot je account.",
      ],
      instead:
        "Stuur een [eenmalige link met browserversleuteling](blog:send-secret-message-without-account). Zodra de ontvanger hem opent en het wachtwoord ophaalt, wordt de versleutelde tekst van de hostserver verwijderd. Eerst een sterk wachtwoord nodig? Gebruik onze [wachtwoordgenerator](app:password-generator).",
    },
    {
      title: "MFA-herstelcodes",
      paragraphs: [
        "Bij het inschakelen van MFA genereren diensten nood-back-upcodes. Omdat gebruikers bang zijn hun toegang te verliezen, kopiëren ze die codes vaak naar een chat met een teamlid of naar hun eigen privéchat.",
        "Herstelcodes zijn back-upmastersleutels. Ze als luchtig bericht te behandelen ondermijnt het doel van multi-factorbeveiliging.",
      ],
      instead:
        "Bewaar ze in een dedicated wachtwoordmanager. Als je ze bij een accountoverdracht moet delen, gebruik dan een [tijdelijke eenmalige notitie](blog:one-time-secret-links), zodat het geheim niet permanent in de chatgeschiedenis blijft staan.",
    },
    {
      title: "Productie-API-sleutels",
      paragraphs: [
        "Ontwikkelaars wisselen API-sleutels, toegangstokens of cloudsecrets vaak uit in chat om snel een probleem te debuggen. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) detecteert voortdurend gelekte inloggegevens in openbare repositories, een hint hoe vaak geheimen per ongeluk lekken.",
        "Eén onbedoelde plak in het verkeerde kanaal kan live databases of facturatiesystemen blootleggen.",
      ],
      instead:
        "Stuur tokens via een [browserversleutelde notitie](blog:privatenote-for-developers) die automatisch verloopt nadat ze één keer is bekeken.",
    },
    {
      title: "Privé-SSH-sleutels",
      paragraphs: [
        "Je privésleutel is je identiteit voor serverinfrastructuur. Die hoort nooit in een messagingapp te liggen. Wie een privésleutel kopieert, maakt nog een kopie buiten de bedoelde beveiligde omgeving; die kan blijven bestaan in chatgeschiedenis, back-ups of op apparaten van ontvangers.",
      ],
      instead:
        "Als een sleutel veilig moet worden overgedragen, gebruik dan een versleutelde eenmalige payload die zich na bezorging van de hostserver verwijdert.",
    },
    {
      title: "Uitnodigings- en resetlinks",
      paragraphs: [
        "Tijdelijke onboarding- en adminlinks belanden voortdurend in chatkanalen:",
      ],
      bullets: [
        "Zoom-hosttoewijzingslinks",
        "Google Meet-moderatortokens",
        "Stripe-onboardinguitnodigingen",
        "Uitnodigingen voor beheerdersrechten",
        "Wachtwoord-reset-URL's",
      ],
      instead:
        "Stuur bevoorrechte onboardinglinks via een [eenmalige notitie](blog:one-time-secret-links), zodat ze niet uit historische logs kunnen worden geoogst wanneer ze ongebruikt blijven liggen.",
    },
    {
      title: "Crypto-seed phrases",
      paragraphs: [
        "Je 12- of 24-woorden herstelzin beheert je hele wallet. Als iemand jaren later je chataccount compromitteert, kunnen geautomatiseerde scrapers historische gesprekken doorzoeken op zinnen die bij seedformaten passen. Als je seed phrase wordt gestolen, kunnen je waarden permanent verloren zijn.",
      ],
      instead:
        "Draag seed phrases bij voorkeur helemaal niet digitaal over. Als een absolute noodsituatie het dwingt, gebruik dan een versleutelde notitie die na het lezen onmiddellijke verwijdering afdwingt om de blootstelling te beperken.",
    },
    {
      title: "Tijdelijke inloggegevens",
      paragraphs: [
        "IT-helpdesks delen bij onboarding van nieuwe medewerkers vaak initiële inloggegevens. Ook al worden gebruikers meestal bij de eerste login gevraagd hun wachtwoord te wijzigen, het tijdelijke wachtwoord blijft doorzoekbaar in de chatgeschiedenis. Als de wijziging vertraagd wordt of het systeem hergebruik toestaat, blijft dat bericht een actieve kwetsbaarheid.",
      ],
      instead:
        "Lever tijdelijke inloggegevens via een [notitie met browserversleuteling](blog:send-secret-message-without-account) die verloopt na het openen.",
    },
    {
      title: "Financiële en bankinformatie",
      paragraphs: [
        "Bedrijfs-IBAN's, routinggegevens, belastingdocumenten of betalingsbevestigingen in chats plakken voelt onschuldig, omdat een IBAN alleen geen wachtwoord is. Maar als aanvallers bankgegevens combineren met persoonlijke context uit chatgeschiedenis, ontstaat de basis voor overtuigende phishing en factuurfraude.",
      ],
      instead:
        "Scheid financiële details van dagelijkse communicatie. Deel ze via versleutelde kanalen die toegang verwijderen zodra de transactie is gecontroleerd.",
    },
    {
      title: "Scans van persoonlijke documenten",
      paragraphs: [
        "Moet je snel een kopie van je paspoort, rijbewijs of arbeidscontract naar HR sturen? Een PDF in het chatvenster kopieert zeer gevoelige identiteitsdata naar cloudback-ups, lokale smartphonegalerijen en gesynchroniseerde desktopmappen.",
      ],
      instead:
        "Gebruik [veilige bestandsoverdracht](app:secure-file-transfer) met browserversleuteling: één download, daarna wordt het bestand volgens je toegangsinstellingen van de hostserver verwijderd.",
    },
    {
      title: "Vertrouwelijke bedrijfsinformatie",
      paragraphs: [
        "Interne strategiepresentaties, nog niet aangekondigde prijsvoorstellen, juridische concepten en overnamedocumenten gaan voortdurend door teamkanalen. Datalekken komen niet altijd van externe hackers; soms ontstaan ze doordat een medewerker per ongeluk een externe gast uitnodigt in een kanaal met jarenlange interne strategie.",
      ],
      instead:
        "Deel gevoelige bedrijfsdata via versleutelde notities met strikte automatische vervaldatums en beperkte toegangsvensters.",
    },
  ],
  lifespanTitle: "Geheimen hebben een levensduur",
  lifespanParagraphs: [
    "Versleuteling beschermt geheimen onderweg. **Vervaldatum beschermt ze over tijd.** De meeste chatapps negeren dat tweede deel bijna volledig.",
    "Met PrivateNote verander je de beveiligingspositie by design. In plaats van te hopen dat gebruikers gevoelige berichten later handmatig verwijderen, dwing je de levensduur van het geheim af. De ontvanger leest het één keer, daarna is het van de server verdwenen.",
  ],
  lifespanBullets: [
    "**Geen blijvende voetafdruk:** Geen chatgeschiedenis en geen doorzoekbaar archief bevat het ruwe geheim.",
    "**Kleinere schadecirkel:** Als later een laptop of chataccount wordt gecompromitteerd, liggen er geen oude wachtwoorden in logs die kunnen worden afgetapt.",
    "**Minder menselijke fouten:** Het systeem doet dataminimalisatie automatisch, in plaats van dat iemand moet denken aan het handmatig verwijderen van gevoelige berichten.",
  ],
  underHoodTitle: "Beveiliging onder de motorkap: zo werkt PrivateNote",
  underHoodParagraphs: [
    "PrivateNote versleutelt je bericht direct in je browser voordat het wordt geüpload. De server slaat alleen versleutelde tekst op. De ontsleutelingssleutel staat in het [URL-fragment](blog:one-time-secret-links), het deel na `#`, dat browsers niet meesturen bij HTTP-verzoeken naar webservers. De server ontvangt de ontsleutelingssleutel nooit.",
    "Zodra de notitie volgens je instellingen is geopend, wordt de versleutelde tekst van de server verwijderd. Voor wachtwoorden, API-sleutels, herstelcodes en tijdelijke inloggegevens is **het beperken van de datalevensduur net zo belangrijk als het versleutelen van de data zelf.** Chats bewaren gesprekken. PrivateNote beperkt de levensduur van geheimen.",
  ],
  faqTitle: "Veelgestelde vragen",
  faq: [
    {
      question: "Is het veilig om wachtwoorden in Slack te sturen?",
      answer:
        "Slack versleutelt data tijdens overdracht en in rust, maar wachtwoorden blijven in de doorzoekbare chatgeschiedenis tot ze worden verwijderd. Voor tijdelijke inloggegevens vermindert een [eenmalige notitie met browserversleuteling](blog:send-secret-message-without-account) de blootstelling op lange termijn.",
    },
    {
      question: "Zijn WhatsApp-berichten veilig voor wachtwoorden?",
      answer:
        "End-to-end-versleuteling beschermt berichten tijdens overdracht, en verdwijnende berichten kunnen ze na een ingestelde tijd automatisch verwijderen. Ontvangers kunnen inhoud nog steeds via screenshots vastleggen, doorsturen of bewaren voordat ze verdwijnen. Wachtwoorden horen idealiter alleen zo lang gedeeld te worden als nodig is: via een [eenmalige link voor geheimen](blog:one-time-secret-links), niet via een blijvende chatgeschiedenis.",
    },
    {
      question: "Is e-mail veiliger dan chat voor wachtwoorden?",
      answer:
        "Nee. Standaard e-mail is meestal niet standaard end-to-end-versleuteld en loopt over meerdere mailservers. Na bezorging blijft een wachtwoord onbeperkt in mailboxen, verzonden-mappen, lokale caches en providerback-ups liggen.",
    },
    {
      question: "Wat is een eenmalig geheim?",
      answer:
        "Een eenmalig geheim is een bericht dat na één keer bekijken of na een gedefinieerde vervaltijd niet meer beschikbaar is. Daardoor worden blijvende kopieën over systemen heen verminderd. Zie onze gids over [eenmalige links voor geheimen](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Bronnen",
  references: [
    "Verizon. Data Breach Investigations Report 2026 (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. Healthcare Data Breach Investigations Snapshot 2026. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Deel geheimen zonder een chatspoor achter te laten",
  closingBody: [
    "Chat is uitstekend voor coördinatie. Als kluis voor inloggegevens, sleutels, herstelcodes en documenten die nooit permanent hadden moeten bestaan, is het slecht geschikt.",
    "PrivateNote is gebouwd voor het tegenovergestelde patroon: versleutelen in de browser, een link delen en het geheim laten verlopen zodra het zijn taak heeft gedaan. Geen account nodig voor de afzender, geen leesbare tekst in een jarenlang doorzoekbaar archief.",
  ],
  tagline: "Minder chatgeschiedenis. Minder metadata. Meer controle over hoe lang een geheim online bestaat.",
  relatedReading: "Verder lezen",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Wachtwoorden en privénotities sturen zonder registratie: browserversleuteling en verlopende links uitgelegd.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Hoe eenmalige links werken, waarom het URL-fragment belangrijk is en wanneer vervaldatum beter is dan e-mail of Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Waarom geschreven sporen in e-mail en werkplekchat langetermijnrisico's creëren en wanneer vergankelijke notities beter passen.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS versus browserversleuteling: wat elk beschermt en waarom de server je data toch kan lezen.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Maak sterke wachtwoorden voordat je ze via een eenmalige link deelt.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Een praktische beveiligingsbasis voor wachtwoorden, authenticatie en veilig delen.",
    },
  ],
};
