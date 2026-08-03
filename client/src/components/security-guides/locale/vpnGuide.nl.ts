import type { VpnGuideCopy } from "./types";

export const vpnGuideNl: VpnGuideCopy = {
  metaTitle: "VPN-diensten gids",
  metaDescription:
    "Kies een betrouwbare VPN: vergelijk Proton VPN, Mullvad en NymVPN — wat ze beschermen, hun grenzen en veilig delen van geheimen.",
  heroLabel: "Beveiligingsgids",
  heroTitle: "VPN-diensten gids",
  heroSubtitle:
    "Een praktische gids voor het kiezen van een betrouwbare VPN — wat het beschermt, wat het niet oplost, en waarom Proton VPN, Mullvad en NymVPN opvallen voor privacybewuste gebruikers.",
  whatItDoesTitle: "Wat een VPN echt doet",
  whatItDoesBody:
    "Een Virtual Private Network maakt een versleutelde tunnel tussen uw apparaat en een VPN-server. Uitgaand verkeer wordt versleuteld en websites zien het IP-adres van de VPN-server in plaats van het uwe — waardoor uw ISP, de exploitant van het café-Wi‑Fi of iemand op hetzelfde netwerk minder kan observeren.",
  benefits: [
    "Versleutelt verkeer tussen uw apparaat en de VPN-server",
    "Verbergt uw echte IP voor bezochte sites en diensten",
    "Beschermt tegen passief meeluisteren op onbetrouwbaar Wi‑Fi",
    "Vermindert DNS- en bestemmingsmetadatatracking op ISP-niveau",
  ],
  withoutVpnLabel: "Zonder VPN",
  withoutVpnBody:
    "Uw apparaat praat rechtstreeks met de website. De Wi‑Fi-exploitant en ISP kunnen verbindingsmetagegevens zien — en op vijandige netwerken kan verkeer worden onderschept.",
  withoutVpnItems: [
    "Echte IP zichtbaar voor sites",
    "ISP ziet bestemmingen & DNS",
    "Blootstelling op openbaar Wi‑Fi",
  ],
  withVpnLabel: "Met VPN",
  withVpnBody:
    "Verkeer wordt eerst in versleuteling naar de VPN-server gewikkeld. Waarnemers op het lokale netwerk zien versleutelde pakketten — niet welke sites u bezoekt.",
  withVpnItems: [
    "Sites zien VPN-uitgangs-IP",
    "Versleutelde tunnel naar server",
    "Veiliger op onbetrouwbare netwerken",
  ],
  limitationsTitle: "Wat een VPN niet doet",
  limitationsIntro: "VPN's zijn nuttig, maar geen magische onzichtbaarheidsmantel — vooral bij het delen van geheimen.",
  limitations: [
    "Maakt u niet anoniem als u ingelogd blijft bij Google, Facebook of werkaccounts",
    "Stopt geen phishing, malware of zwakke wachtwoorden",
    "Versleutelt geen chatinhoud tenzij de app al end-to-end-versleuteling gebruikt",
    "Vervangt geen veilig delen van wachtwoorden, API-sleutels of herstelcodes",
  ],
  limitationsCallout:
    "Voor eenmalige geheimen — wachtwoorden, seed phrases, API-sleutels — gebruik end-to-end-versleuteld delen zoals PrivateNote. Een VPN beschermt de leiding; het beschermt niet wat u in e-mail, Slack of SMS plakt.",
  whenToUseTitle: "Wanneer een VPN gebruiken",
  whenToUseIntro:
    "U heeft er niet 24/7 een nodig tenzij uw dreigingsmodel dat vereist — maar dit zijn situaties waarin een betrouwbare VPN zijn plaats verdient.",
  useCases: [
    { label: "Openbaar Wi‑Fi", detail: "Luchthavens, hotels, cafés" },
    { label: "Reizen", detail: "Buitenlandse netwerken & roaming" },
    { label: "ISP-metagegevens", detail: "Minder logging thuisnetwerk" },
    { label: "Gevoelig werk", detail: "Onderzoek & journalistiek" },
  ],
  trustTitle: "Hoe u een betrouwbare VPN herkent",
  trustSignals: [
    "Onafhankelijk geaudit no-logs-beleid",
    "Transparant eigendom en jurisdictie",
    "WireGuard of OpenVPN met sterke versleuteling",
    "Open-source of reproduceerbare client-builds",
    "Eerlijke openbaarmaking van metadata en facturering",
    "Geen marketing met «100% anoniem»",
  ],
  providersTitle: "Aanbevolen aanbieders",
  providersIntro:
    "Drie privacygerichte VPN's van betrouwbare teams — kies op basis van Zwitsers recht, anonieme registratie of mixnet-routing.",
  providers: {
    proton: {
      tagline: "Zwitsers privacyrecht · geaudit no-logs · Proton-ecosysteem",
      description:
        "Gebouwd door Proton AG — het team achter Proton Mail. Open-source-apps, onafhankelijke audits, Secure Core-routing en optioneel Tor-over-VPN.",
      highlights: ["Zwitserse jurisdictie", "Geaudit no-logs", "Gratis tier beschikbaar", "Open-source-clients"],
      visitLabel: "Bezoek Proton VPN",
    },
    mullvad: {
      tagline: "Geen e-mail · alleen accountnummer · contant & crypto",
      description:
        "Zweedse VPN met anonieme accountnummers, vast tarief en betaalopties die uw identiteit scheiden van uw abonnement.",
      highlights: ["Geen e-mailregistratie", "WireGuard + OpenVPN", "Contant & crypto geaccepteerd", "Geaudit infrastructuur"],
      visitLabel: "Bezoek Mullvad",
    },
    nym: {
      tagline: "Mixnet-routing · verder dan standaard tunneling",
      description:
        "Voegt mixnet-technologie toe aan VPN-versleuteling — pakketten worden opgesplitst en herschikt om verkeersanalyse te weerstaan, niet alleen uw IP te verbergen.",
      highlights: [
        "WireGuard + mixnet-modi",
        "Gedecentraliseerde routing",
        "Bestand tegen verkeersanalyse",
        "Onderzoeksgericht team",
      ],
      visitLabel: "Bezoek NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Het beste voor",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Privacy-jurisdictie",
      proton: "Zwitserland",
      mullvad: "Zweden",
      nym: "Gedecentraliseerd mixnet",
    },
    signup: {
      label: "Registratie",
      proton: "E-mailaccount",
      mullvad: "Willekeurig accountnr.",
      nym: "Standaardaccount",
    },
    standout: {
      label: "Opvallend kenmerk",
      proton: "Secure Core + Tor",
      mullvad: "Contant/crypto-betaling",
      nym: "Mixnet-routing",
    },
    idealUser: {
      label: "Ideale gebruiker",
      proton: "Proton-ecosysteemfans",
      mullvad: "Maximale anonimiteit bij registratie",
      nym: "Weerstand tegen verkeersanalyse",
    },
  },
  ctaTitle: "VPN + PrivateNote: verschillende taken",
  ctaBody:
    "Een VPN beschermt uw verbinding. PrivateNote beschermt het geheim zelf — versleuteld in uw browser vóór upload, zelfvernietigend na één keer lezen.",
  ctaButton: "Maak een veilige eenmalige notitie",
  exploreOther: "Ontdek andere gidsen",
  allResources: "Alle bronnen",
  affiliateDisclaimer:
    "Alleen een educatieve gids. We kunnen commissie verdienen via affiliate-links bij aanbevolen diensten, wat deze gratis privacybron ondersteunt.",
  otherGuides: [
    { id: "password", title: "Wachtwoordmanagers" },
    { id: "messenger", title: "Veilige berichten" },
    { id: "email", title: "Veilige e-mail" },
    { id: "browser", title: "Privacybrowsers" },
  ],
};
