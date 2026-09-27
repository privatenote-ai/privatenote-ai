import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountNl: SecretMessageArticleCopy = {
  intro: [
    "Soms moet je iets vertrouwelijks delen: een [wachtwoord](app:password-generator), een herstelcode, een wifi-wachtwoord, een privénotitie of een persoonlijk bericht. Maar alleen daarvoor een account aanmaken voelt vaak onnodig.",
    "Het goede nieuws: dat hoeft niet.",
    "Moderne [browsergebaseerde versleuteling](blog:encrypted-vs-secure-file-sharing) maakt het mogelijk om veilig een geheim bericht te sturen **zonder je aan te melden**, software te installeren of een dienst je leesbare tekst toe te vertrouwen.",
  ],
  sections: [
    {
      title: "Waarom geen account aanmaken?",
      paragraphs: [
        "Een account aanmaken laat meer sporen achter dan veel mensen beseffen. Een typische dienst kan je e-mailadres, een [gebruikersnaam](https://passwords.lu/en/blog/username-privacy-identity), inloggeschiedenis, apparaatinformatie, IP-adressen en metadata over je activiteit opslaan.",
        "Voor langdurige samenwerking kan dat prima redelijk zijn. Voor het delen van één vertrouwelijk bericht meestal niet.",
        'Als je doel simpelweg is: "Ik wil dat deze ene persoon dit bericht precies één keer leest", voegt een account vaak complexiteit toe zonder de beveiliging te verbeteren. Voor dat patroon passen [eenmalige geheime links](blog:one-time-secret-links) meestal beter.',
      ],
    },
    {
      title: "Versleutel vóór je verstuurt",
      paragraphs: [
        "De belangrijke vraag is niet alleen of een website HTTPS gebruikt. Vrijwel elke website gebruikt vandaag HTTPS (TLS), dat data beschermt terwijl die over het internet reist. Onze gids over [versleuteld versus veilig bestanden delen](blog:encrypted-vs-secure-file-sharing) legt uit waarom transportversleuteling alleen niet hetzelfde is als end-to-end-privacy.",
        "De belangrijkere vraag is: **wie kan je bericht lezen nadat het de server heeft bereikt?**",
      ],
    },
    {
      title: "Traditionele webdiensten",
      paragraphs: [
        "Veel messagingplatforms sturen je bericht via een versleutelde verbinding (HTTPS/TLS). Zodra het bericht hun servers bereikt, kunnen ze er technisch gezien toegang toe krijgen voordat het wordt opgeslagen of verwerkt.",
        "Afhankelijk van de dienst kan het bericht worden gescand op spam of misbruik, geïndexeerd voor zoeken, verwerkt door cloudsystemen, bewaard in back-ups of toegankelijk zijn voor beheerders.",
        "TLS beschermt de verbinding tussen je browser en de dienst. Het voorkomt **niet** per se dat de dienst zelf je bericht kan lezen.",
      ],
    },
    {
      title: "Versleuteling in de browser",
      paragraphs: ["Een privacyvriendelijkere aanpak is het bericht in je browser te versleutelen voordat het wordt geüpload."],
      beforeFlowSteps: "In dit model:",
      flowSteps: [
        {
          title: "Schrijf je bericht",
          body: "Je stelt het geheim op in je browser; er wordt nog niets verstuurd. Of gebruik Private AI en [Write with Private AI](app:home) om het op je apparaat te schrijven vóór de versleuteling.",
        },
        {
          title: "Genereer lokaal een unieke sleutel",
          body: "Je browser maakt een versleutelingssleutel op je apparaat.",
        },
        {
          title: "Versleutel vóór upload",
          body: "Het bericht wordt lokaal versleuteld. Alleen versleutelde tekst wordt naar de server geüpload.",
        },
        {
          title: "Deel de sleutel in de link",
          body: "De ontsleutelingssleutel blijft bij jou en wordt gedeeld als onderdeel van de beveiligde link, meestal in het [URL-fragment](blog:one-time-secret-links) dat browsers niet naar webservers sturen.",
        },
      ],
      afterFlowSteps: [
        "De dienst slaat alleen versleutelde data op en fungeert als doorgeefluik. Zonder de ontsleutelingssleutel is de versleutelde tekst praktisch nutteloos.",
        "Hetzelfde principe geldt voor bestanden. [Veilige bestandsoverdracht](app:secure-file-transfer) versleutelt documenten en archieven in je browser vóór upload. Ontvangers kunnen de link zonder account openen; verzenden vereist inloggen op een gratis PrivateNote-account.",
      ],
    },
    {
      title: "Waarom je daardoor geen account nodig hebt",
      paragraphs: [
        "Als een dienst je bericht nooit hoeft te lezen, heeft hij ook weinig reden om te weten wie je bent. Daarom kunnen diensten met browserversleuteling vaak zonder registratie werken. Zie [hoe eenmalige geheime links werken](blog:one-time-secret-links) voor het volledige proces.",
        "In plaats van een account aan te maken, schrijf je gewoon je bericht, genereer je een beveiligde link en stuur je die naar de ontvanger. Geen gebruikersnamen. Geen wachtwoorden om te onthouden. Geen inbox vol verificatiemails.",
      ],
    },
    {
      title: "Voeg een extra laag toe met een wachtwoord",
      paragraphs: [
        "Voor zeer gevoelige informatie kun je het versleutelde bericht met een extra wachtwoord beveiligen.",
        "Een gangbare aanpak is het versleutelde link via het ene communicatiekanaal te sturen en het wachtwoord via een ander, bijvoorbeeld per telefoon, sms of messenger. Een aanvaller zou beide nodig hebben om het bericht te ontsleutelen.",
      ],
    },
    {
      title: "Berichten die automatisch verdwijnen",
      paragraphs: [
        "Vertrouwelijke informatie hoort meestal niet voor altijd online te blijven. Veel veilige notitiediensten laten berichten [zichzelf verwijderen na de eerste keer lezen](blog:one-time-secret-links), verlopen na een gekozen tijd of worden automatisch verwijderd.",
        "Dat vermindert hoeveel gevoelige informatie online beschikbaar blijft, vergelijkbaar met waarom [werkplekberichten en chatlogs](blog:workplace-texts-private-note) een slechte plek zijn voor eenmalige geheimen. Geen technologie kan voorkomen dat een ontvanger na het openen een screenshot maakt of de inhoud kopieert, maar automatische vervaldatum verkleint de blootstelling op lange termijn aanzienlijk.",
      ],
    },
    {
      title: "Wanneer gebruik je anonieme geheime berichten?",
      paragraphs: ["Versleutelde berichten sturen zonder account aan te maken is handig voor het delen van:"],
      bullets: [
        "[Wachtwoorden en herstelcodes](blog:how-we-generate-passwords) — of gebruik onze [wachtwoordgenerator](app:password-generator) vóór je deelt",
        "[API-sleutels](blog:privatenote-for-developers) en softwarelicentiesleutels",
        "Privélinks en vertrouwelijke zakelijke notities",
        "Financiële informatie en wifi-wachtwoorden",
        "Tijdelijke persoonlijke berichten die niet voor altijd in e-mail of chatgeschiedenis horen te blijven",
      ],
    },
    {
      title: "Waar je op let bij een veilige dienst",
      paragraphs: ['Niet elke dienst voor "privéberichten" of "geheime notities" biedt hetzelfde beschermingsniveau. Zoek naar diensten die:'],
      bullets: [
        "Berichten in je browser versleutelen vóór upload",
        "Je leesbare tekst nooit ontvangen",
        "Geen account vereisen",
        "Automatische vervaldatum ondersteunen",
        "Optioneel wachtwoordbescherming bieden",
        "Moderne geauthenticeerde versleuteling gebruiken",
      ],
      callout:
        'Deze ontwerpkeuzes verminderen hoeveel vertrouwen je in de dienst zelf hoeft te stellen. Voor een bredere beveiligingsbasis — inclusief wachtwoorden, authenticatie en veilig delen — zie [De mythe van "goed genoeg" beveiliging](blog:myth-good-enough-security).',
    },
    {
      title: "Hoe PrivateNote bij deze principes past",
      paragraphs: [
        "PrivateNote is precies rond deze ideeën gebouwd. Wanneer je een notitie maakt, gebeurt de versleuteling volledig in je browser voordat er iets wordt geüpload. De server slaat alleen versleutelde tekst op en fungeert uitsluitend als doorgeefluik tussen jou en je ontvanger; hij ontvangt nooit de leesbare tekst van je bericht.",
        "Door dit ontwerp hoef je geen account aan te maken om een privénotitie te sturen. Schrijf gewoon je bericht, genereer een beveiligde link en deel die via het communicatiekanaal dat jij wilt.",
        "Voor extra bescherming kun je de notitie met een wachtwoord beveiligen, kiezen wanneer deze verloopt, laten zelfvernietigen na de eerste keer lezen, versleutelde bestanden bijvoegen en optioneel bezorgmeldingen ontvangen die aangeven wanneer een notitie is geopend of verlopen — zonder de inhoud van het bericht te onthullen.",
        "Het doel is simpel: vertrouwelijke informatie delen zo makkelijk als een link, terwijl je zo min mogelijk vertrouwen in de dienst hoeft te stellen.",
      ],
    },
    {
      title: "Slotwoord",
      paragraphs: [
        "Een geheim bericht sturen zou niet moeten betekenen dat je nog een account aanmaakt of onnodige persoonlijke gegevens weggeeft.",
        "Browsergebaseerde versleuteling maakt het mogelijk je bericht te versleutelen voordat het je apparaat verlaat, zodat de dienst alleen versleutelde tekst opslaat in plaats van je echte bericht. Gecombineerd met [verlopende links](blog:one-time-secret-links) en optionele wachtwoordbescherming biedt dit een eenvoudige, praktische manier om vertrouwelijke informatie te delen.",
        "Of je nu een wachtwoord, een herstelcode of een persoonlijke notitie stuurt: een dienst die data in je browser versleutelt en geen account vereist, geeft je meer privacy met minder gedoe.",
      ],
    },
  ],
  closingTitle: "Probeer het zonder aanmelden",
  closingBody: [
    "PrivateNote is rond deze principes ontworpen: veilig berichten delen zo simpel als een link maken en naar de beoogde ontvanger sturen.",
  ],
  fileSharingNote:
    "PrivateNote biedt ook [veilige bestandsoverdracht](app:secure-file-transfer) voor het delen van documenten en mappen met hetzelfde browsergebaseerde versleutelingsmodel. Verzenden vereist een gratis account; ontvangers kunnen de link openen zonder zich aan te melden.",
  tagline: "Minder accountgedoe. Minder metadata. Meer controle over wat online blijft na de overdracht.",
  relatedReading: "Verder lezen",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Diepgaande uitleg over eenmalige links, het URL-fragment en waarom vergankelijkheid beter is dan e-mail of Slack voor eenmalige geheimen.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS versus browserversleuteling — wat elk beschermt en waarom de server je data toch kan lezen.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Hoe je sterke wachtwoorden maakt en deelt zonder patronen te hergebruiken of ze in chatgeschiedenis achter te laten.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Waarom geschreven sporen in e-mail en werkplekchat langetermijnrisico's creëren — en wanneer vergankelijke notities beter passen.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Een praktische beveiligingsbasis: wachtwoorden, authenticatie, messaging en veilige deelpatronen.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Deel API-sleutels en inloggegevens vanuit je editor zonder geheimen in Slack of tickets te plakken.",
    },
  ],
};
