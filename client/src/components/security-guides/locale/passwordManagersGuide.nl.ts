import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideNl: PasswordManagersGuideCopy = {
  metaTitle: "Wachtwoordmanagers gids",
  metaDescription:
    "Maak, bewaar en deel wachtwoorden veilig. Vergelijk KeePass, Bitwarden, Apple en Google — plus Passwords.lu en PrivateNote voor eenmalig delen.",
  heroLabel: "Beveiligingsgids",
  heroTitle: "Wachtwoordmanagers gids",
  heroTagline: "Wachtwoorden veilig maken, bewaren en delen",
  heroSubtitle:
    "Wachtwoorden beschermen bijna elk aspect van het digitale leven — toch blijven hergebruik en zwakke patronen een van de zwakste schakels in cybersecurity. Een wachtwoordmanager lost dat op.",
  introLead:
    "Het probleem zijn niet de wachtwoorden zelf. Het is hoe mensen ze gebruiken. Velen hergebruiken nog steeds hetzelfde wachtwoord op tientallen sites of maken alleen kleine variaties:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Als een website een datalek krijgt, testen aanvallers die inloggegevens overal — een techniek genaamd credential stuffing, verantwoordelijk voor miljoenen gecompromitteerde accounts per jaar. Een wachtwoordmanager genereert voor elk account een ander wachtwoord. U hoeft alleen één sterk hoofdwachtwoord te onthouden.",
  essentialTitle: "Waarom wachtwoordmanagers essentieel zijn",
  essentialIntro: "Een goede wachtwoordmanager verbetert zowel de beveiliging als de dagelijkse online ervaring aanzienlijk.",
  essentialBenefits: [
    "Direct lange, willekeurige wachtwoorden genereren",
    "Elk wachtwoord opslaan in een versleutelde kluis",
    "Inlogformulieren automatisch invullen",
    "Hergebruikte of zwakke wachtwoorden detecteren",
    "Waarschuwingen ontvangen wanneer inloggegevens in bekende datalekken verschijnen",
    "Wachtwoorden synchroniseren over al uw apparaten",
    "Passkeys naast wachtwoorden opslaan",
    "Inloggegevens veilig delen wanneer nodig",
  ],
  howItWorksTitle: "Hoe wachtwoordmanagers werken",
  howItWorksBody1:
    "Uw inloggegevens staan in een versleutelde kluis. Bij het aanmaken kiest u een hoofdwachtwoord dat de versleutelingssleutels afleidt die alles daarin beschermen.",
  cryptoLabel: "Moderne cryptografie omvat doorgaans:",
  cryptoPoints: [
    "AES-256-versleuteling",
    "Argon2id of PBKDF2 voor sleutelafleiding",
    "Geauthenticeerde versleuteling om manipulatie te detecteren",
  ],
  howItWorksBody2:
    "Omdat de kluis wordt versleuteld vóór opslag of synchronisatie, kunnen betrouwbare aanbieders uw wachtwoorden over het algemeen niet lezen.",
  unlockedLabel: "Eenmaal ontgrendeld kan uw manager:",
  vaultFeatures: [
    "Gebruikersnamen en wachtwoorden automatisch invullen",
    "Veilige wachtwoorden genereren",
    "Nieuw aangemaakte inloggegevens opslaan",
    "Wijzigingen synchroniseren tussen apparaten",
    "Veilige notities en passkeys opslaan",
  ],
  benefitsTitle: "Voordelen van een wachtwoordmanager",
  benefitBlocks: [
    {
      title: "Elk account krijgt een uniek wachtwoord",
      body: "Als uw Netflix-wachtwoord wordt gestolen, mag het niet ook uw e-mail, bankieren, GitHub-account of cloudopslag ontgrendelen. Wachtwoordmanagers maken unieke wachtwoorden moeiteloos.",
    },
    {
      title: "Sterke wachtwoordgeneratie",
      body: "Mensen zijn slecht in het bedenken van willekeurige wachtwoorden. Managers genereren strings met hoge entropie zoals uQ8!kL#7P2@wXf9$rZm4 — extreem moeilijk te raden of te brute-forcen.",
    },
    {
      title: "Automatisch inloggen",
      body: "Wachtwoordmanagers herkennen websites en vullen inloggegevens automatisch in. Betrouwbare managers vullen doorgaans alleen in op het juiste domein, wat ook helpt tegen phishing.",
    },
    {
      title: "Wachtwoordgezondheidsrapporten",
      body: "Veel managers markeren hergebruikte wachtwoorden, zwakke wachtwoorden, gecompromitteerde inloggegevens, ontbrekende MFA en sites die passkeys ondersteunen — zodat u de beveiliging in de loop der tijd kunt verbeteren.",
    },
    {
      title: "Veilige synchronisatie",
      body: "Moderne managers synchroniseren uw versleutelde kluis over desktop, laptop, telefoon en tablet zodat wachtwoorden overal beschikbaar zijn waar u ze nodig heeft.",
    },
  ],
  passwordsLuPartnerLabel: "Partnertool",
  passwordsLuTitle: "Browsergebaseerde generatie met Passwords.lu",
  passwordsLuBody:
    "Soms heeft u alleen een sterk wachtwoord nodig — geen volledige kluisworkflow. Passwords.lu voert generatie direct in uw browser uit. Wachtwoorden worden niet naar servers geüpload; geen account vereist.",
  passwordsLuWorkflow:
    "Aanbevolen workflow: genereren op Passwords.lu, dan direct opslaan in uw wachtwoordmanager.",
  passwordsLuCta: "Wachtwoordgenerator openen",
  passwordsLuTools: [
    "Sterke wachtwoordgenerator",
    "Wachtwoordzin-generator",
    "Veilige PIN-generator",
    "Wachtwoordsterkte-checker",
    "Gebruikersnaamgenerator",
    "Hash-generators (Argon2id, bcrypt, scrypt en meer)",
    "Educatieve beveiligingstools",
  ],
  recommendedTitle: "Aanbevolen wachtwoordmanagers",
  recommendedIntro:
    "Denk in drie lagen: platformgebouwde tools voor stabiliteit, lokale open-source-kluizen voor controle, en cloudmanagers wanneer u krachtige synchronisatie nodig heeft — met het extra serverrisico dat daarbij hoort.",
  tiers: {
    platform: {
      title: "Platformgebouwde managers",
      subtitle: "Sterke engineering, stabiele producten — beste standaard voor de meeste mensen",
      intro:
        "Apple en Google leveren wachtwoordmanagers met het besturingssysteem. Ze worden ondersteund door grote beveiligingsteams, krijgen continue updates en integreren passkeys, autofill en datalekwaarschuwingen met minimale setup. Als u in één ecosysteem leeft, is dit vaak de soepelste en meest betrouwbare keuze.",
      strengthsLabel: "Sterke punten",
      tradeoffsLabel: "Compromissen",
      pros: [
        "Verfijnde UX met autofill op OS-niveau en passkey-ondersteuning",
        "Onderhouden door platformbeveiligingsingenieurs op schaal",
        "Geen apart abonnement voor kernfuncties",
        "Stabiele sync via iCloud of uw Google-account",
      ],
      cons: [
        "Gebonden aan Apple- of Google-account en platformkeuzes",
        "Minder flexibel bij vrije mix van Windows, Linux en mobiel",
        "Vertrouwensmodel hangt af van de beveiliging van uw cloudaccount",
      ],
      managers: {
        apple: {
          verdict: "Beste voor iPhone, iPad, Mac en Vision Pro",
          description:
            "Ingebouwd in Apple-platforms met veilige opslag, generatie, beveiligingswaarschuwingen, passkeys en iCloud Keychain-sync — geen extra app nodig in een volledig Apple-huishouden.",
          highlights: [
            "Diepe OS-integratie en passkey-ondersteuning",
            "Beveiligingswaarschuwingen bij bekende datalekken",
            "Uitstekende UX binnen het Apple-ecosysteem",
          ],
          learnMore: "Meer informatie",
        },
        google: {
          verdict: "Beste voor Android en Chrome",
          description:
            "Ingebouwd in Android en Chrome met generatie, autofill, Password Checkup, datalekwaarschuwingen, passkeys en sync via uw Google-account.",
          highlights: [
            "Handige standaard op Android-apparaten",
            "Password Checkup en datalekwaarschuwingen",
            "Werkt overal waar u Chrome gebruikt",
          ],
          learnMore: "Meer informatie",
        },
      },
    },
    local: {
      title: "Lokale open-source-kluizen",
      subtitle: "Maximale controle — u bezit het versleutelde bestand",
      intro:
        "KeePass slaat uw kluis op als een lokaal versleutelde database. Geen verplicht cloudaccount van de leverancier: u bepaalt waar het bestand staat en hoe het synchroniseert. De afweging is UX — interfaces kunnen gedateerd aanvoelen vergeleken met platform- of cloudmanagers, en multi-device sync is DIY tenzij u uw eigen opslaglaag toevoegt.",
      strengthsLabel: "Sterke punten",
      tradeoffsLabel: "Compromissen",
      pros: [
        "Open source en auditeerbaar",
        "Geen verplicht cloudaccount of abonnement",
        "Offline-first; kluisbestand blijft onder uw controle",
        "Groot pluginecosysteem (KeePassXC, mobiele ports, enz.)",
      ],
      cons: [
        "UI en onboarding minder verfijnd dan platformtools",
        "Sync tussen apparaten handmatig tenzij geconfigureerd",
        "Meer setupwerk voor gezinnen of huishoudens met gemengde apparaten",
      ],
      managers: {
        keepass: {
          verdict: "Beste voor privacypuristen en self-hosters",
          description:
            "Het originele open-source-model: één versleuteld .kdbx-bestand dat u op schijf, USB, NAS kunt opslaan of via uw eigen cloud kunt synchroniseren. KeePassXC is een populaire cross-platform fork met een modernere interface.",
          highlights: [
            "Volledig gratis — geen vendor lock-in",
            "U kiest opslag- en syncstrategie",
            "Ideaal wanneer de cloud optioneel is, niet standaard",
          ],
          learnMore: "Meer informatie",
        },
      },
    },
    cloud: {
      title: "Cloud-sync wachtwoordmanagers",
      subtitle: "Krachtige sync en delen — hoogste serverrisico",
      intro:
        "Toegewijde cloudmanagers zoals Bitwarden blinken uit in cross-platform sync, gezinsdeling en teamfuncties. Dat gemak brengt een ander dreigingsmodel: uw versleutelde kluis (en soms metadata) staat op servers van iemand anders. Een datalek of misconfiguratie bij de leverancier is het belangrijkste resterende risico — daarom zijn audits, open source en een sterk hoofdwachtwoord hier belangrijker dan overal elders.",
      strengthsLabel: "Sterke punten",
      tradeoffsLabel: "Compromissen",
      pros: [
        "Beste cross-device sync out of the box",
        "Gezins- en organisatiedelingsfuncties",
        "Werkt consistent op Windows, macOS, Linux en mobiel",
        "Open-source opties (Bitwarden) met openbare beveiligingsaudits",
      ],
      cons: [
        "Grootste aanvalsoppervlak als de leverancier wordt gecompromitteerd",
        "Versleutelde kluisback-ups kunnen offline worden gekraakt met zwakke hoofdwachtwoorden",
        "U moet de crypto-implementatie en operaties van de leverancier vertrouwen",
      ],
      managers: {
        bitwarden: {
          verdict: "Beste cloudoptie voor cross-platform gebruikers",
          description:
            "Open-source software, end-to-end versleutelde sync, passkey-ondersteuning, onafhankelijke audits en een sterk gratis plan — de standaardaanbeveling wanneer u cloudsync buiten Apple of Google nodig heeft.",
          highlights: [
            "Geauditeerde open-source clients",
            "Uitstekend gratis plan en gezinstarieven",
            "Consistente ervaring op alle grote platforms",
          ],
          learnMore: "Meer informatie",
        },
        lastpass: {
          verdict: "Legacy-optie — verkies Bitwarden voor nieuwe gebruikers",
          description:
            "Hielp cloud-wachtwoordmanagers populair te maken, maar hoogprofielincidenten met gestolen versleutelde kluisback-ups stuurden veel beveiligingsprofessionals naar Bitwarden of lokaal KeePass voor nieuwe deployments.",
          highlights: [
            "Bruikbaar met sterk hoofdwachtwoord + MFA als u al geïnvesteerd bent",
            "Overweeg migratie als u opnieuw begint",
          ],
          learnMore: "Meer informatie",
          caution: "Voorzichtigheid",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Uw prioriteit",
    recommendation: "Aanbeveling",
  },
  comparisonRows: [
    { priority: "Leven in het Apple-ecosysteem", pick: "Apple Passwords" },
    { priority: "Android & Chrome dagelijks", pick: "Google Password Manager" },
    { priority: "Maximale privacy en bestandscontrole", pick: "KeePass (lokale kluis)" },
    { priority: "Cross-platform cloudsync", pick: "Bitwarden" },
    { priority: "Bestaande LastPass-gebruiker", pick: "Doorgaan indien verhard; evalueer Bitwarden of KeePass" },
  ],
  sharingTitle: "Wachtwoorden veilig delen",
  sharingBody:
    "Zelfs sterke wachtwoorden moeten soms worden gedeeld — met collega's, familie, IT-beheerders, aannemers of klanten. Te veel mensen sturen ze nog via berichtenplatforms die voor chat zijn ontworpen, niet voor geheime levering.",
  unsafeChannels: ["E-mail", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Gebruik in plaats daarvan PrivateNote",
  privateNoteSharingBody:
    "PrivateNote versleutelt geheimen in uw browser vóór upload. De server slaat alleen ciphertext op; de ontsleutelingssleutel reist apart in de link. Notities kunnen zichzelf vernietigen na één keer lezen of op schema verlopen.",
  privateNoteSharingItems: [
    "Wachtwoorden",
    "API-sleutels",
    "Wi‑Fi-inloggegevens",
    "Herstelcodes",
    "Tijdelijke logins",
  ],
  privateNoteSharingCta: "Maak een veilige eenmalige notitie",
  passwordProtectedTitle: "Extra bescherming met wachtwoordbeveiligde notities",
  passwordProtectedBody1:
    "Voeg een optioneel wachtwoord toe aan een PrivateNote. De ontvanger heeft zowel de link als het aparte wachtwoord nodig — idealiter via verschillende kanalen (link per e-mail, wachtwoord per telefoon of persoonlijk).",
  passwordProtectedBody2:
    "Zelfs als iemand de link onderschept, kan hij het geheim niet onthullen zonder het wachtwoord.",
  bestPracticesTitle: "Best practices",
  bestPractices: [
    "Gebruik een lang, uniek hoofdwachtwoord",
    "Schakel multi-factor authenticatie in op uw wachtwoordmanager",
    "Hergebruik nooit wachtwoorden op websites",
    "Genereer wachtwoorden met een wachtwoordmanager of Passwords.lu",
    "Sla elk wachtwoord op in uw versleutelde kluis",
    "Schakel passkeys in wanneer beschikbaar",
    "Bekijk regelmatig wachtwoordgezondheidsrapporten",
    "Deel wachtwoorden via PrivateNote in plaats van e-mail of chat",
    "Voor zeer gevoelige inloggegevens: gebruik PrivateNotes optionele wachtwoordbeveiliging en lever het wachtwoord apart",
  ],
  faqTitle: "Veelgestelde vragen",
  faq: [
    {
      q: "Zijn wachtwoordmanagers veilig?",
      a: "Ja. Betrouwbare wachtwoordmanagers gebruiken sterke, industriestandaard versleuteling. Voor bijna iedereen is een wachtwoordmanager aanzienlijk veiliger dan wachtwoorden onthouden of hetzelfde wachtwoord op meerdere websites hergebruiken.",
    },
    {
      q: "Kan de wachtwoordmanager-aanbieder mijn wachtwoorden lezen?",
      a: "Voor moderne managers zoals KeePass, Bitwarden, Apple Passwords en Google Password Manager wordt uw kluis versleuteld vóór opslag. Met een sterk hoofdwachtwoord kan de aanbieder uw opgeslagen inloggegevens over het algemeen niet lezen.",
    },
    {
      q: "Wat als ik mijn hoofdwachtwoord vergeet?",
      a: "De meeste wachtwoordmanagers kunnen het niet herstellen omdat ze het nooit kennen. Dat is opzettelijk. Sommige diensten bieden herstelopties of noodtoegang als dat vooraf is geconfigureerd.",
    },
    {
      q: "Moet ik browserwachtwoordopslag gebruiken?",
      a: "Ingebouwde Apple- en Google-managers zijn sterke, stabiele keuzes binnen hun ecosystemen — ondersteund door grote beveiligingsteams. KeePass past bij maximale controle. Bitwarden wanneer u cloudsync over gemengde platforms nodig heeft, met hoger serverrisico.",
    },
  ],
  finalTitle: "Eindaanbeveling",
  finalBody:
    "Geen enkele manager is perfect voor iedereen — maar er een gebruiken is een van de meest effectieve stappen. Combineer het met Passwords.lu voor snelle generatie en PrivateNote wanneer u geheimen veilig moet delen.",
  finalBullets: [
    { label: "Apple & Google", text: "stabiele platformstandaarden" },
    { label: "KeePass", text: "lokale controle, open source" },
    { label: "Bitwarden", text: "cloudsync voor elk apparaat" },
    { label: "Passwords.lu", text: "snelle browsergebaseerde generatie" },
  ],
  finalCtaPrivateNote: "Deel een geheim met PrivateNote",
  finalCtaPasswordsLu: "Bezoek passwords.lu",
  exploreOther: "Ontdek andere gidsen",
  allResources: "Alle bronnen",
  affiliateDisclaimer:
    "Alleen educatieve gids. We kunnen commissie verdienen via affiliate-links wanneer u aanbevolen diensten gebruikt, wat deze gratis privacybron ondersteunt.",
  otherGuides: [
    { id: "vpn", title: "VPN-diensten gids" },
    { id: "messenger", title: "Veilige berichten" },
    { id: "email", title: "Veilige e-mail" },
    { id: "browser", title: "Privacybrowsers" },
  ],
};
