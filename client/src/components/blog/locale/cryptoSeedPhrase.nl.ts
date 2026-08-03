import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseNl: CryptoSeedArticleCopy = {
  heroAlt:
    "Concept voor versleuteld bestandsdelen: lokale versleuteling vóór het uploaden van geheimen",
  intro: [
    "Een cryptocurrency-herstelzin is een van de waardevolste geheimen die je ooit zult bezitten. Die kun je meestal niet resetten. Er is geen 'wachtwoord vergeten'. Wie hem heeft, heeft doorgaans controle over de wallet en alles erin.",
    "Dat klinkt misschien vreemd op de blog van een bedrijf dat versleutelde eenmalige links bouwt. Veiligheid betekent niet elk hulpmiddel voor elke taak verkopen—maar de aanpak afstemmen op wat je beschermt, inclusief onze eigen beperkingen.",
    "Voor **vervangbare geheimen**—wifi-wachtwoorden, tijdelijke inloggegevens, MFA-herstelcodes, veel API-sleutels en vertrouwelijke zakelijke berichten—is een [versleutelde eenmalige link](blog:one-time-secret-links) een uitstekende oplossing.",
    "**Langlevende mastergeheimen** zoals cryptocurrency-herstelzinnen verdienen een andere aanpak.",
  ],
  ruleTitle: "Regel nr. 1",
  ruleParagraphs: [
    "**Voer nooit een cryptocurrency-herstelzin in op een website—ook niet bij PrivateNote.** Als overdracht onvermijdelijk is: eerst lokaal versleutelen en **alleen de ciphertext** delen. PrivateNote is bedoeld voor het transport van vooraf versleutelde data, niet om de mnemonic in te typen.",
    "**Serieuze hardwarewallet-fabrikanten vragen niet om je herstelzin op een website in te voeren.** Vraagt een site om je herstelzin, behandel dat als zeer verdacht—controleer de echtheid voordat je verdergaat.",
    "Vermijd waar mogelijk het invoeren van herstelzinnen op websites.",
  ],
  offlineAlternatives: [
    { label: "Metalen back-up", body: "bewaard in een kluis of bankkluisje" },
    { label: "SLIP-39", body: "of vergelijkbare methoden voor erfenis of disaster recovery" },
    { label: "Hardwarewallet-overdracht", body: "wanneer praktisch, in plaats van de herstelzin" },
  ],
  seedPhraseTraits: [
    { label: "Geeft volledige controle", body: "over activa" },
    { label: "Houdt vaak decennia stand", body: "zonder rotatie" },
    { label: "Kan niet worden gewijzigd", body: "bij compromittering" },
    { label: "Geen providerherstel", body: "bij diefstal" },
  ],
  oneTimeLinkFit: [
    "API-sleutels & tijdelijke wachtwoorden",
    "wifi-inloggegevens",
    "MFA-herstelcodes",
    "zakelijke berichten & juridische concepten",
    "tijdelijke toegangstokens",
  ],
  localEncryptFirst: [
    "cryptocurrency-herstelzinnen",
    "hardwarewallet-back-ups",
    "CA-privésleutels & ondertekeningssleutels",
    "wachtwoordmanager-herstelmateriaal",
    "hoogwaardige mastergeheimen",
  ],
  philosophySteps: [
    "overdracht vermijden waar mogelijk",
    "lokaal versleutelen",
    "alleen ciphertext uploaden",
    "tijdelijke platte tekst veilig wissen",
    "de age-bestandswachtwoordzin—niet de mnemonic—indien mogelijk via een apart kanaal versturen",
  ],
  sections: {
    sendAtAll: {
      title: "Moet je hem überhaupt versturen?",
      question: "**moet de zin haar locatie verlaten?** Vaak: nee.",
      outro:
        "Elke overdracht vergroot de kans op blootstelling. Als je versturen kunt vermijden, doe dat dan. Voor andere kanalen die geheimen ook permanent opslaan, zie [Waarom e-mail de slechtste plek is voor geheimen](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Waarom herstelzinnen anders zijn",
      p1: "Een herstelzin is het wortelgeheim voor een volledig digitaal vermogen—niet 'nog een wachtwoord'.",
      listIntro: "Anders dan de meeste inloggegevens:",
      outro:
        "Je verdedigt je niet alleen tegen aanvallers van vandaag—je neemt beslissingen die over tien of twintig jaar nog kunnen tellen.",
    },
    browserEncryption: {
      title: "Browserversleuteling is sterk—maar geen magie",
      paragraphs: [
        "PrivateNote versleutelt in je browser vóór upload. Onze servers zien alleen ciphertext; de sleutel bereikt ons nooit. Dat is veel beter dan [e-mail](blog:why-email-is-worst-for-secrets), chat of clouddocumenten voor alledaagse geheimen—en komt overeen met een strikt [end-to-end-versleutelings](blog:what-is-end-to-end-encryption)model voor de notitie-inhoud.",
        "Elke browsercrypto-app deelt een beperking: **platte tekst moet in de browser bestaan voordat er wordt versleuteld.** Kwaadaardige JavaScript—van extensies, supply-chain-compromittering, injectie of een slecht CDN—kan die theoretisch eerst lezen. Dat is inherent aan client-side versleuteling in de browser, niet specifiek voor PrivateNote.",
        "Voor API-sleutels en tijdelijke wachtwoorden is dat compromis meestal acceptabel. Voor een herstelzin die spaargeld beschermt, wil je misschien minder systemen vertrouwen.",
      ],
    },
    encryptLocal: {
      title: "Versleutelen voordat de browser het ziet",
      intro: "Lokaal versleutelen, dan alleen ciphertext uploaden:",
      outro: "PrivateNote ontvangt nooit de mnemonic—alleen versleutelde data.",
      callout:
        "Lokale versleuteling **stopt geen malware op je computer**. Het **houdt platte tekst weg van webapps, clouddiensten en servers** die die niet nodig hebben. Je verkleint de vertrouwde rekenbasis; je elimineert geen gecompromitteerd eindpunt.",
    },
    whichTool: {
      title: "Welk hulpmiddel gebruiken",
      age: "**age** (aanbevolen voor de meeste gebruikers): eenvoudige bestandsversleuteling met veilige defaults — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: uitstekend als je OpenPGP al gebruikt.",
      openssl: "**OpenSSL**: betrouwbaar en krachtig; low-level CLI—beter voor ervaren gebruikers.",
    },
    ageExample: {
      title: "Minimaal voorbeeld (age)",
      passphraseTitle: "Heb je een sterk wachtwoordzin nodig?",
      passphraseBefore:
        "Gebruik een lang, uniek geheim voor `age -p`. Genereer er een lokaal in de browser—de",
      passphraseLink: "wachtwoordzinnen-generator",
      passphraseAfter: "op passwords.lu draait client-side; er wordt niets geüpload.",
      p1: "Nadat `seed.txt.age` is geverifieerd, **wis platte tekst veilig op het apparaat van de verzender**. Nadat de ontvanger in een wallet heeft geïmporteerd, **wis ook diens kopie in platte tekst**.",
      p2: "Voor regelmatige uitwisseling met iemand vermijdt `age -r` (public-key-modus) een gedeeld wachtwoord—de moeite waard om apart te leren.",
      docsLabel: "Documentatie:",
    },
    separateChannels: {
      title: "Aparte kanalen gebruiken",
      intro:
        "Scheid het versleutelde bestand van het geheim dat het ontgrendelt. Je scheidt de `.age`-ciphertext van het **age-ontsleutelingswachtwoord**—niet de herstelzin-mnemonic via een tweede kanaal.",
      steps: [
        "Upload het **versleutelde bestand** (ciphertext) met PrivateNote",
        "Stuur het **age-wachtwoord** dat dat bestand ontsleutelt—via Signal, telefoon of persoonlijk",
      ],
      outro: "Een aanvaller moet meerdere systemen compromitteren—niet alleen één link.",
    },
    recommend: {
      title: "Wat we aanbevelen",
      intro:
        "De scheiding gaat echt over **vervangbare** versus **langlevende master**-geheimen—niet alleen over bestandsformaat of kanaal.",
      oneTimeTitle: "Goed geschikt voor eenmalige links",
      oneTimeSubtitle: "Vervangbare geheimen die je kunt roteren of intrekken",
      localTitle: "Eerst lokaal versleutelen",
      localSubtitle: "Langlevende mastergeheimen die zelden wijzigen",
      outro:
        "Voor API-sleutels specifiek, zie onze gids [API-sleutels veilig delen](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Hulpmiddel afstemmen op het risico",
      body: "Elke aanpak heeft vertrouwensaannames—wachtwoordmanagers, hardwarewallets, offline tools, browsercrypto. Geen enkele is perfect; de compromissen verschillen. De vraag is of ze passen bij de **waarde** van wat je beschermt.",
    },
    philosophy: {
      title: "Onze filosofie",
      p1: "We hebben PrivateNote zo gebouwd dat versleuteling **voordat** data onze servers bereikt plaatsvindt. Voor tijdelijke, vervangbare geheimen wint dat van e-mail, messaging of cloudopslag. Je kunt ook [een geheim bericht sturen zonder account](blog:send-secret-message-without-account). Lees [hoe PrivateNote werkt](app:how-it-works) voor het volledige model.",
      listIntro: "Voor een herstelzin die je spaargeld zou kunnen zijn:",
      closingQuote:
        "Soms is het beste advies niet 'gebruik ons product'. Maar: 'Gebruik het juiste hulpmiddel voor de taak.'",
    },
  },
  ctaTitle: "Deel vervangbare geheimen—geen herstelzinnen—in de browser",
  ctaBody:
    "Maak een versleutelde eenmalige notitie voor API-sleutels, wachtwoorden en inloggegevens. Voor herstelzinnen eerst lokaal versleutelen met age, dan alleen de ciphertext delen.",
  ctaButton: "PrivateNote proberen ->",
};
