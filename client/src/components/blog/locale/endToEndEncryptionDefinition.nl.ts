import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionNl: E2eeDefinitionArticleCopy = {
  intro: [
    "End-to-end-versleuteling is een van de meest gebruikte termen in securitymarketing. Tegelijkertijd is het ook een van de makkelijkst te verwateren. De echte definitie is niet dat data ergens versleuteld is. Het gaat om wie die data kan ontsleutelen.",
    "Als de dienstverlener de sleutels heeft, ze kan herstellen of tijdens normaal gebruik leesbare inhoud ontvangt, is het systeem misschien versleuteld, maar in strikte zin niet end-to-end-versleuteld.",
  ],
  definitionTitle: "De kortste nuttige definitie",
  definitionBody:
    "End-to-end-versleuteling betekent: alleen de eindpunten hebben de sleutels die nodig zijn om de data te ontsleutelen. De dienstverlener mag versleutelde tekst opslaan of doorsturen, maar mag de sleutels of leesbare inhoud niet bezitten.",
  tableHeaders: ["Model", "Versleuteling", "Ziet de server leesbare inhoud?", "Heeft de server sleutels?"],
  tableRows: [
    { model: "Transportbeveiliging (TLS)", happens: "Tussen browser en server", plaintext: "Ja, op de server", keys: "Ja, voor verwerking op de server" },
    { model: "Zwakke client-side versleuteling", happens: "Op het apparaat", plaintext: "Misschien", keys: "Ja, als sleutels worden geüpload of herstelbaar zijn" },
    { model: "Echte E2EE", happens: "Bij de eindpunten", plaintext: "Nee", keys: "Nee" },
  ],
  flowNodes: [
    { title: "Browser van de afzender", body: "Versleutelt lokaal vóór upload" },
    { title: "PrivateNote-opslag", body: "Slaat alleen versleutelde tekst op" },
    { title: "Browser van de ontvanger", body: "Ontsleutelt met de fragment-sleutel" },
  ],
  sections: [
    {
      title: "Versleuteling is niet hetzelfde als end-to-end-versleuteling",
      paragraphs: [
        "De meeste serieuze webdiensten gebruiken TLS. Dat is belangrijk: TLS beschermt data terwijl die tussen je browser en de server reist, en voorkomt dat aanvallers op het lokale netwerk de verbinding kunnen meelezen.",
        "Maar TLS eindigt bij de server. Zodra het verzoek daar aankomt, kan de dienst meestal de leesbare inhoud zien. De aanbieder kan die dan opslaan, scannen, indexeren, verwerken of opnieuw versleuteld opslaan met sleutels die de aanbieder zelf beheert.",
        "Dat is versleuteld transport. Op zichzelf is dat geen end-to-end-versleuteling.",
      ],
      callout: "De praktische test is simpel: kan de aanbieder de ontsleutelingssleutel of de leesbare inhoud verkrijgen? Zo ja, dan is het systeem niet echt end-to-end-versleuteld.",
    },
    {
      title: "De cryptografische definitie",
      paragraphs: [
        "Een precieze definitie van E2EE begint bij het bezit van sleutels. In een echt end-to-end-systeem worden versleutelings- en ontsleutelingssleutels door de eindpunten gemaakt en bewaard, niet door de bezorgdienst.",
        "De server kan versleutelde tekst doorsturen, opslaan, beperken en verwijderen. Hij kan de dienst draaien. Maar hij bezit niet het sleutelmateriaal dat nodig is om versleutelde tekst weer leesbaar te maken.",
        "Matthew Greens bekende analyse van het Zoom-versleutelingsdebat maakt dit punt helder: de kern is niet alleen dat versleuteling bestaat, maar dat ontsleutelingssleutels niet beschikbaar zijn voor de aanbieder.",
      ],
      bullets: [
        "Het verzendende eindpunt kan de data versleutelen.",
        "Het ontvangende eindpunt kan de data ontsleutelen.",
        "De tussenliggende server verwerkt alleen versleutelde tekst.",
        "Een compromittering van de server zou geen leesbare inhoud moeten blootleggen.",
      ],
    },
    {
      title: "Client-side versleuteling kan nog steeds tekortschieten",
      paragraphs: [
        "Client-side versleuteling betekent dat de cryptografische bewerking lokaal plaatsvindt vóór de upload. Dat is nodig voor veel E2EE-ontwerpen, maar alleen niet genoeg.",
        "Een dienst zou data in de browser kunnen versleutelen en daarna zowel de versleutelde tekst als de bijbehorende sleutel naar zijn backend uploaden. De versleuteling gebeurde client-side, maar de aanbieder heeft nog steeds de sleutel. Daarmee is de end-to-end-grens doorbroken.",
        "Het belangrijke onderscheid is exclusief sleutelbezit. Als de aanbieder toegang heeft tot de bruikbare sleutel, die kan herstellen, roteren, bewaren of opnieuw genereren, vertrouw je de aanbieder nog steeds met toegang tot leesbare inhoud.",
      ],
    },
    {
      title: "Hoe notities met URL-fragment in dit model passen",
      paragraphs: [
        "PrivateNote gebruikt een browsergebaseerde variant van deze architectuur voor eenmalige notities. De browser van de afzender versleutelt de notitie lokaal. De versleutelde payload wordt opgeslagen. De ontsleutelingssleutel staat in het URL-fragment: het deel na het #-teken.",
        "Browsers sturen het URL-fragment niet mee in het HTTP-verzoek naar de server. De server ontvangt dus de versleutelde tekst, maar niet de sleutel. Wanneer de ontvanger de link opent, heeft de browser het fragment lokaal en kan de notitie na het tonen worden ontsleuteld.",
        "Dit is niet dezelfde topologie als Signal of MLS, waar eindpunten meestal aan accounts gekoppelde apparaten zijn met blijvende publieke sleutels. Maar de centrale beveiligingseigenschap is dezelfde: de opslagaanbieder bezit niet de sleutel die nodig is om de inhoud te ontsleutelen.",
      ],
    },
    {
      title: "Het bezorgkanaal blijft belangrijk",
      paragraphs: [
        "Een eenmalige versleutelde link is krachtig, maar de volledige link wordt gevoelig omdat hij de ontsleutelingssleutel in het fragment bevat. Als je die link plakt in een kanaal dat berichten logt, geschiedenis synchroniseert of administratief wordt bewaakt, kan dat kanaal het geheim blootleggen voordat het wordt geopend.",
        "Daarom zijn vervaldatum, eenmalig lezen en optionele wachtwoorden operationeel belangrijk. Ze veranderen de definitie van E2EE niet, maar verkleinen de schade als een link wordt doorgestuurd, gelogd of door software als preview wordt verwerkt.",
        "Voor zeer gevoelige inhoud stuur je de link via het ene kanaal en deel je het optionele wachtwoord via een ander. Zo scheid je het bezit van de versleutelde payload van het menselijke geheim.",
      ],
    },
    {
      title: "De offline brute-force-kanttekening",
      paragraphs: [
        "Wachtwoordbescherming voegt verdediging in diepte toe, maar heeft een echte cryptografische beperking. Als een aanvaller de volledige link verkrijgt en de versleutelde tekst vóór verval downloadt, kan wachtwoordraden een offline aanval worden. De rate limits van de server helpen dan niet meer, omdat de aanvaller lokaal tegen de versleutelde tekst kan proberen.",
        "PrivateNote gebruikt Argon2id voor met wachtwoord beveiligde notities. Argon2id is een geheugenharde sleutelafleidingsfunctie en verhoogt de kosten van elke wachtwoordpoging, vooral bij GPU-zware brute-force-aanvallen.",
        "Dat maakt zwakke wachtwoorden niet veilig. Een kort of hergebruikt wachtwoord kan nog steeds falen. Hoe sterker het optionele wachtwoord, hoe nuttiger deze tweede beschermingslaag wordt.",
      ],
    },
    {
      title: "Waarom de architectuur ertoe doet",
      paragraphs: [
        "E2EE verandert het vertrouwensmodel. Bij gewone versleutelde opslag vertrouw je op het beleid van de aanbieder, medewerkerscontroles, juridische processen en bescherming tegen datalekken. Bij end-to-end-versleuteling is de aanbieder structureel beperkt: hij kan versleutelde data opslaan, maar niet ontsleutelen.",
        "Dat elimineert niet elk risico. Malware op eindapparaten, kwaadaardige browserextensies, gekopieerde links, zwakke wachtwoorden en onveilige bezorgkanalen blijven relevant. Cryptografie verkleint de vertrouwensgrens; het vervangt geen operationeel oordeel.",
        "De waarde is nog steeds groot: een databaselek zou onleesbare versleutelde tekst moeten blootleggen, niet berichtinhoud. Dat is het verschil tussen beloven data niet te lezen en technisch niet in staat zijn om die überhaupt te lezen.",
      ],
    },
  ],
  continueReadingTitle: "Verder lezen",
  referencesTitle: "Bronnen",
  references: [
    { label: "Matthew Green, \"Does Zoom use end-to-end encryption?\"", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
