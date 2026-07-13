import type { VpnGuideCopy } from "./types";

export const vpnGuideDe: VpnGuideCopy = {
  metaTitle: "VPN-Dienste – Leitfaden",
  metaDescription:
    "Seriösen VPN wählen: Proton VPN, Mullvad und NymVPN im Vergleich — was VPNs schützen, ihre Grenzen und sicheres Teilen von Geheimnissen.",
  heroLabel: "Sicherheitsleitfaden",
  heroTitle: "VPN-Dienste – Leitfaden",
  heroSubtitle:
    "Ein praxisnaher Leitfaden zur Wahl eines seriösen VPN — was es schützt, was es nicht behebt, und warum Proton VPN, Mullvad und NymVPN für datenschutzbewusste Nutzer hervorstechen.",
  whatItDoesTitle: "Was ein VPN tatsächlich leistet",
  whatItDoesBody:
    "Ein Virtual Private Network erstellt einen verschlüsselten Tunnel zwischen Ihrem Gerät und einem VPN-Server. Der ausgehende Datenverkehr wird verschlüsselt, und Websites sehen die IP-Adresse des VPN-Servers statt Ihrer — wodurch weniger sichtbar ist, was Ihr ISP, der Betreiber des Café-WLANs oder jemand im selben Netzwerk beobachten kann.",
  benefits: [
    "Verschlüsselt den Datenverkehr zwischen Ihrem Gerät und dem VPN-Server",
    "Verbirgt Ihre echte IP vor besuchten Websites und Diensten",
    "Schützt vor passivem Mitlesen in nicht vertrauenswürdigen WLANs",
    "Reduziert DNS- und Ziel-Metadaten-Tracking auf ISP-Ebene",
  ],
  withoutVpnLabel: "Ohne VPN",
  withoutVpnBody:
    "Ihr Gerät kommuniziert direkt mit der Website. Der WLAN-Betreiber und ISP können Verbindungsmetadaten sehen — und in feindlichen Netzwerken kann der Datenverkehr abgefangen werden.",
  withoutVpnItems: [
    "Echte IP für Websites sichtbar",
    "ISP sieht Ziele & DNS",
    "Risiko in öffentlichen WLANs",
  ],
  withVpnLabel: "Mit VPN",
  withVpnBody:
    "Der Datenverkehr wird zuerst verschlüsselt zum VPN-Server geleitet. Beobachter im lokalen Netzwerk sehen verschlüsselte Pakete — nicht, welche Sites Sie besuchen.",
  withVpnItems: [
    "Sites sehen VPN-Ausgangs-IP",
    "Verschlüsselter Tunnel zum Server",
    "Sicherer in nicht vertrauenswürdigen Netzen",
  ],
  limitationsTitle: "Was ein VPN nicht leistet",
  limitationsIntro: "VPNs sind nützlich, aber kein magischer Unsichtbarkeitsmantel — besonders beim Teilen von Geheimnissen.",
  limitations: [
    "Macht Sie nicht anonym, wenn Sie bei Google, Facebook oder Arbeitskonten angemeldet bleiben",
    "Stoppt kein Phishing, keine Malware und keine schwachen Passwörter",
    "Verschlüsselt Chat-Inhalte nicht, sofern die App nicht bereits Ende-zu-Ende-Verschlüsselung nutzt",
    "Ersetzt kein sicheres Teilen von Passwörtern, API-Schlüsseln oder Wiederherstellungscodes",
  ],
  limitationsCallout:
    "Für einmalige Geheimnisse — Passwörter, Seed-Phrasen, API-Schlüssel — nutzen Sie Ende-zu-Ende-verschlüsseltes Teilen wie PrivateNote. Ein VPN schützt die Leitung; es schützt nicht, was Sie in E-Mail, Slack oder SMS einfügen.",
  whenToUseTitle: "Wann ein VPN sinnvoll ist",
  whenToUseIntro:
    "Sie brauchen keins rund um die Uhr, sofern Ihr Bedrohungsmodell es nicht erfordert — aber in diesen Situationen lohnt sich ein seriöses VPN.",
  useCases: [
    { label: "Öffentliches WLAN", detail: "Flughäfen, Hotels, Cafés" },
    { label: "Reisen", detail: "Fremde Netze & Roaming" },
    { label: "ISP-Metadaten", detail: "Weniger Logging im Heimnetz" },
    { label: "Sensible Arbeit", detail: "Recherche & Journalismus" },
  ],
  trustTitle: "So erkennen Sie ein seriöses VPN",
  trustSignals: [
    "Unabhängig geprüfte No-Logs-Richtlinie",
    "Transparente Eigentümerschaft und Rechtsordnung",
    "WireGuard oder OpenVPN mit starker Verschlüsselung",
    "Open-Source- oder reproduzierbare Client-Builds",
    "Ehrliche Offenlegung von Metadaten und Abrechnung",
    "Kein Marketing mit „100 % anonym“",
  ],
  providersTitle: "Empfohlene Anbieter",
  providersIntro:
    "Drei datenschutzorientierte VPNs von seriösen Teams — wählen Sie nach Schweizer Recht, anonymer Registrierung oder Mixnet-Routing.",
  providers: {
    proton: {
      tagline: "Schweizer Datenschutzrecht · geprüftes No-Logs · Proton-Ökosystem",
      description:
        "Von Proton AG — dem Team hinter Proton Mail. Open-Source-Apps, unabhängige Audits, Secure-Core-Routing und optionales Tor-over-VPN.",
      highlights: ["Schweizer Rechtsordnung", "Geprüftes No-Logs", "Kostenloser Tarif verfügbar", "Open-Source-Clients"],
      visitLabel: "Proton VPN besuchen",
    },
    mullvad: {
      tagline: "Keine E-Mail · nur Kontonummer · Bargeld & Krypto",
      description:
        "Schwedischer VPN mit anonymen Kontonummern, Pauschalpreisen und Zahlungsoptionen, die Ihre Identität von Ihrem Abo trennen.",
      highlights: ["Keine E-Mail-Registrierung", "WireGuard + OpenVPN", "Bargeld & Krypto akzeptiert", "Geprüfte Infrastruktur"],
      visitLabel: "Mullvad besuchen",
    },
    nym: {
      tagline: "Mixnet-Routing · über Standard-Tunneling hinaus",
      description:
        "Ergänzt VPN-Verschlüsselung um Mixnet-Technologie — Pakete werden zerlegt und neu geordnet, um Verkehrsanalyse zu erschweren, nicht nur die IP zu verbergen.",
      highlights: [
        "WireGuard + Mixnet-Modi",
        "Dezentrales Routing",
        "Resistent gegen Verkehrsanalyse",
        "Forschungsbasiertes Team",
      ],
      visitLabel: "NymVPN besuchen",
    },
  },
  comparisonHeaders: {
    bestFor: "Am besten für",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Datenschutz-Rechtsordnung",
      proton: "Schweiz",
      mullvad: "Schweden",
      nym: "Dezentrales Mixnet",
    },
    signup: {
      label: "Registrierung",
      proton: "E-Mail-Konto",
      mullvad: "Zufällige Kontonr.",
      nym: "Standardkonto",
    },
    standout: {
      label: "Besonderes Merkmal",
      proton: "Secure Core + Tor",
      mullvad: "Bargeld/Krypto-Zahlung",
      nym: "Mixnet-Routing",
    },
    idealUser: {
      label: "Idealer Nutzer",
      proton: "Proton-Ökosystem-Fans",
      mullvad: "Maximale Anonymität bei Registrierung",
      nym: "Schutz vor Verkehrsanalyse",
    },
  },
  ctaTitle: "VPN + PrivateNote: verschiedene Aufgaben",
  ctaBody:
    "Ein VPN schützt Ihre Verbindung. PrivateNote schützt das Geheimnis selbst — im Browser verschlüsselt vor dem Upload, nach einmaligem Lesen selbstzerstörend.",
  ctaButton: "Sichere Einmal-Notiz erstellen",
  exploreOther: "Weitere Leitfäden entdecken",
  allResources: "Alle Ressourcen",
  affiliateDisclaimer:
    "Nur zu Bildungszwecken. Über Affiliate-Links zu empfohlenen Diensten können wir eine Provision erhalten, die diese kostenlose Datenschutz-Ressource unterstützt.",
  otherGuides: [
    { id: "password", title: "Passwort-Manager" },
    { id: "messenger", title: "Sichere Messenger" },
    { id: "email", title: "Sichere E-Mail" },
    { id: "browser", title: "Datenschutz-Browser" },
  ],
};
