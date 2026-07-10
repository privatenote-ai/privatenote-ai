import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingNl: EncryptedFileSharingArticleCopy = {
  intro: [
    'Als mensen zoeken naar "veilig bestanden delen", gaan ze vaak uit van dat elke dienst met HTTPS of TLS-versleuteling hun bestanden op dezelfde manier beschermt. Helaas klopt dat niet.',
    'Twee diensten kunnen allebei "versleutelde bestandsoverdracht" adverteren met heel verschillende privacygaranties. Het verschil zit volledig in **waar de versleuteling plaatsvindt**. Dat onderscheid verklaart waarom sommige diensten je bestanden kunnen inspecteren, indexeren en verwerken, terwijl anderen dat simpelweg niet kunnen.',
  ],
  sections: [
    {
      title: "De twee soorten versleuteling",
      level: "primary",
      paragraphs: ["Er zijn twee hoofdmanieren waarop moderne bestandsdeeldiensten je data beschermen."],
    },
    {
      title: "1. Transportversleuteling (TLS)",
      level: "secondary",
      paragraphs: [
        "Dit is de standaardversleuteling die vrijwel elke website op internet vandaag gebruikt. Wanneer je een bestand uploadt, maakt je browser een beveiligde Transport Layer Security (TLS)-verbinding met de hostserver. De verbinding is versleuteld terwijl je bestand over het netwerk reist, en beschermt je tegen aanvallers op openbare wifi, gecompromitteerde routers of iedereen die netwerkverkeer afluistert.",
      ],
      flow: "tls",
      bullets: [
        "TLS is essentieel, en elke betrouwbare dienst moet het gebruiken.",
        "Zodra de upload de server bereikt, ontvangt de aanbieder het originele leesbare bestand.",
        "Vanaf dat punt kan de dienst, afhankelijk van het beleid, het bestand opslaan, previews genereren, inhoud indexeren, scannen op malware of metadata gebruiken voor analytics.",
        'Veel aanbieders versleutelen bestanden ook "at rest". Dat beschermt tegen fysieke diefstal van schijven — maar de dienst heeft nog steeds de sleutels en kan je bestanden lezen.',
      ],
      callout:
        "**De kernkwetsbaarheid van traditionele cloudopslag:** de server kan alleen versleutelen wat hij al heeft kunnen lezen.",
    },
    {
      title: "2. Browserversleuteling",
      level: "secondary",
      paragraphs: [
        "Een fundamenteel andere aanpak is het bestand te versleutelen **voordat** het je apparaat verlaat. In plaats van het originele bestand te uploaden, gebruikt je browser lokale cryptografische API's om het te versleutelen. De server ontvangt alleen versleutelde tekst — data die willekeurig lijkt en nutteloos is zonder de ontsleutelingssleutel.",
      ],
      flow: "browser",
      bullets: [
        "Browserversleuteling vervangt TLS niet — het vult het aan.",
        "TLS beschermt de verbinding nog steeds tegen afluisteraars op netwerkniveau.",
        "De servers van de aanbieder ontvangen alleen onleesbare versleutelde tekst, omdat ze nooit de leesbare inhoud of de ontsleutelingssleutel ontvangen.",
      ],
    },
    {
      title: "Waarom dit verschil ertoe doet",
      level: "primary",
      paragraphs: [
        "Stel dat je zeer gevoelige data deelt: juridische contracten, financiële spreadsheets, bedrijfseigen broncode, medische dossiers of vertrouwelijke zakelijke documenten.",
        "Met alleen transportversleuteling is je privacy **contractueel**. Je moet vertrouwen op de implementatie van de aanbieder, toegangscontroles voor medewerkers en het huidige en toekomstige bedrijfsbeleid.",
        "Met browserversleuteling is je privacy **architectonisch**. De aanbieder slaat alleen versleutelde tekst op. Zelfs bij een hack, een gerechtelijk bevel of een gewijzigd businessmodel kan hij geen leesbare inhoud overhandigen die hij nooit heeft gehad.",
      ],
      callout:
        "Met alleen transportversleuteling is je privacy **contractueel**. Met browserversleuteling is je privacy **architectonisch**.",
    },
    {
      title: "Een recente herinnering: het vertrouwensfactor",
      level: "primary",
      paragraphs: [
        "In 2025 werkte WeTransfer zijn Servicevoorwaarden bij met taal die brede rechten leek te geven over geüploade inhoud, ook voor het verbeteren van machinelearning-systemen die worden gebruikt bij contentmoderatie.",
        "De wijziging leidde tot directe reacties van kunstenaars, journalisten en creatieve professionals die bang waren dat hun intellectueel eigendom zou worden gebruikt om AI-systemen te trainen. WeTransfer verduidelijkte snel dat klantinhoud niet voor AI-training werd gebruikt en verwijderde de verwarrende taal — maar het incident benadrukte een cruciale les:",
        "Als een aanbieder je bestanden in leesbare vorm ontvangt, ben je volledig afhankelijk van hun beloften. Wanneer een aanbieder alleen versleutelde tekst opslaat, is het vertrouwen dat je in hem moet stellen structureel geminimaliseerd. De architectuur dwingt privacy af.",
      ],
    },
    {
      title: "Hoe PrivateNote bestanden delen afhandelt",
      level: "primary",
      paragraphs: [
        "Moderne browsergebaseerde versleuteling combineert verschillende goed gevestigde cryptografische bouwstenen om data veilig te houden zonder op serververtrouwen te leunen.",
      ],
    },
    {
      title: "Sleutelgeneratie en -isolatie",
      level: "secondary",
      paragraphs: [
        "Wanneer een gebruiker een bestand wil delen, genereert PrivateNote in de browser een cryptografisch veilige, willekeurige symmetrische sleutel met de Web Crypto API.",
        "Deze sleutel wordt nooit naar onze infrastructuur verstuurd. In plaats daarvan wordt hij aan de deellink toegevoegd als URL-fragment (het deel na het `#`-teken):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Browsers sturen het URL-fragment bij ontwerp niet mee naar de webserver in een HTTP-verzoek. Dit gedrag is vastgelegd in de URL-standaard en werkt al tientallen jaren zo. De ontsleutelingssleutel blijft in de browser van de ontvanger.",
      ],
    },
    {
      title: "Geauthenticeerde streamingversleuteling",
      level: "secondary",
      paragraphs: [
        "In plaats van ruwe data te uploaden, versleutelt de browser het bestand voordat het het netwerk raakt. Omdat PrivateNote grote bijlagen ondersteunt, gebruikt het **streamingversleuteling in blokken**: bestanden worden blok voor blok versleuteld (meestal in chunks van meerdere megabytes), zodat grote uploads niet het hele bestand tegelijk in het geheugen hoeven te laden.",
        "Gratis accounts kunnen bestanden tot 25 MB bijvoegen; Premium-accounts ondersteunen veel grotere uploads (tot 1 GB per bestand). In alle gevallen bereikt alleen versleutelde tekst onze servers.",
        "De implementatie leunt op **AES-GCM** (Authenticated Encryption with Associated Data), dat zowel vertrouwelijkheid als integriteit biedt:",
      ],
      bullets: [
        "**Vertrouwelijkheid** — de payload is onleesbaar zonder de sleutel.",
        "**Integriteit** — manipulatie van versleutelde tekst in rust wordt gedetecteerd en afgewezen tijdens client-side ontsleuteling.",
        "Wanneer wachtwoordbescherming is ingeschakeld, wordt een uit het wachtwoord afgeleide sleutel gegenereerd met geheugenharde algoritmen zoals **Argon2id**, waardoor brute-force raden onpraktisch wordt.",
      ],
    },
    {
      title: "Welke metadata nog bestaat",
      level: "primary",
      paragraphs: [
        "Een rigoureuze beveiligingsarchitectuur moet haar grenzen erkennen. Browserversleuteling beschermt de **inhoud** van je bestanden, maar bepaalde metadata blijft zichtbaar voor het netwerk en de dienst:",
      ],
      bullets: [
        "Tijdstempels van upload en download.",
        "De geschatte grootte van de versleutelde payload.",
        "Vervaldatum, weergavelimieten en toegangsvensters voor bestanden.",
        "Het IP-adres van de ontvanger bij download (zichtbaar voor de webserver die het verzoek routeert).",
      ],
      callout:
        "Privacygerichte systemen minimaliseren metadata waar praktisch mogelijk, maar geen webgebaseerde dienst kan het volledig elimineren. PrivateNote behandelt metadata met dezelfde bewaardiscipline als versleutelde payloads — verwijderd wanneer een notitie verloopt of wordt gewist.",
    },
    {
      title: "De afwegingen van echte privacy",
      level: "primary",
      paragraphs: ["Browserversleuteling biedt maximale inhoudsprivacy, maar met bewuste afwegingen:"],
      bullets: [
        "**Geen server-side malwarescan** — omdat de server het bestand niet kan lezen, kan hij het niet scannen op virussen. Vertrouw op de afzender.",
        "**Geen servergegenereerde previews** — miniaturen en documentpreviews worden lokaal in de browser van de ontvanger gerenderd na ontsleuteling, niet op de server.",
        "**Geen wachtwoord- of sleutelherstel** — als je de link of versleutelingssleutel verliest, kan de aanbieder het bestand niet herstellen. Er is geen \"Wachtwoord vergeten\" voor data waartoe de host geen toegang heeft.",
      ],
    },
    {
      title: "De juiste dienst kiezen",
      level: "primary",
      paragraphs: [
        "Niet elke bestandsoverdracht vereist strikte browserversleuteling. Informele vakantiefoto's met familie zijn misschien prima met alleen transportversleuteling.",
        "Als je intellectueel eigendom, juridische overeenkomsten of gevoelige persoonlijke data deelt, stel dan één architecturale vraag:",
        "**Ontvangt de dienst mijn originele bestand, of alleen een versleutelde versie ervan?**",
        "Dat ene onderscheid bepaalt wie technisch toegang heeft tot je data — niet alleen vandaag, maar naarmate bedrijfsbeleid, eigendom en privacywetten in de loop van de tijd veranderen.",
      ],
    },
  ],
  closingTitle: "Deel bestanden zonder leesbare inhoud aan de server te geven",
  closingBody:
    "De veilige bestandsoverdracht van PrivateNote gebruikt hetzelfde browsergebaseerde versleutelingsmodel als onze verdwijnende notities: lokaal versleutelen, versleutelde tekst uploaden, de sleutel delen in het URL-fragment en toegang laten verlopen op jouw voorwaarden.",
  ctaLabel: "Probeer veilige bestandsoverdracht",
  relatedReading: "Verder lezen",
};
