import type { VpnGuideCopy } from "./types";

export const vpnGuideIt: VpnGuideCopy = {
  metaTitle: "Guida ai servizi VPN",
  metaDescription:
    "Scegli un VPN affidabile: confronta Proton VPN, Mullvad e NymVPN — cosa proteggono, i loro limiti e la condivisione sicura dei segreti.",
  heroLabel: "Guida alla sicurezza",
  heroTitle: "Guida ai servizi VPN",
  heroSubtitle:
    "Una guida pratica per scegliere un VPN affidabile — cosa protegge, cosa non risolve e perché Proton VPN, Mullvad e NymVPN si distinguono per gli utenti attenti alla privacy.",
  whatItDoesTitle: "Cosa fa davvero un VPN",
  whatItDoesBody:
    "Una rete privata virtuale crea un tunnel crittografato tra il dispositivo e un server VPN. Il traffico in uscita è crittografato e i siti web vedono l'indirizzo IP del server VPN invece del vostro — riducendo ciò che il vostro ISP, l'operatore del Wi‑Fi del bar o qualcuno sulla stessa rete può osservare.",
  benefits: [
    "Crittografa il traffico tra il dispositivo e il server VPN",
    "Nasconde il vostro IP reale ai siti e servizi che visitate",
    "Protegge dall'ascolto passivo su Wi‑Fi non attendibili",
    "Riduce il tracciamento dei metadati DNS e di destinazione a livello ISP",
  ],
  withoutVpnLabel: "Senza VPN",
  withoutVpnBody:
    "Il dispositivo comunica direttamente con il sito. L'operatore del Wi‑Fi e l'ISP possono vedere i metadati di connessione — e su reti ostili, il traffico può essere intercettato.",
  withoutVpnItems: [
    "IP reale visibile ai siti",
    "L'ISP vede destinazioni e DNS",
    "Esposizione su Wi‑Fi pubblico",
  ],
  withVpnLabel: "Con VPN",
  withVpnBody:
    "Il traffico viene prima avvolto in crittografia verso il server VPN. Gli osservatori sulla rete locale vedono pacchetti crittografati — non quali siti visitate.",
  withVpnItems: [
    "I siti vedono l'IP di uscita VPN",
    "Tunnel crittografato al server",
    "Più sicuro su reti non attendibili",
  ],
  limitationsTitle: "Cosa un VPN non fa",
  limitationsIntro: "I VPN sono utili, ma non un mantello dell'invisibilità — soprattutto quando si condividono segreti.",
  limitations: [
    "Non vi rende anonimi se restate connessi a Google, Facebook o account di lavoro",
    "Non ferma phishing, malware o password deboli",
    "Non crittografa i contenuti delle chat se l'app non usa già la crittografia end-to-end",
    "Non sostituisce la condivisione sicura di password, chiavi API o codici di recupero",
  ],
  limitationsCallout:
    "Per segreti monouso — password, frasi seed, chiavi API — usate la condivisione crittografata end-to-end come PrivateNote. Un VPN protegge la condotta; non protegge ciò che incollate in email, Slack o SMS.",
  whenToUseTitle: "Quando usare un VPN",
  whenToUseIntro:
    "Non ne serve uno 24 ore su 24 a meno che il vostro modello di minaccia non lo richieda — ma ecco le situazioni in cui un VPN affidabile vale la pena.",
  useCases: [
    { label: "Wi‑Fi pubblico", detail: "Aeroporti, hotel, bar" },
    { label: "Viaggi", detail: "Reti estere e roaming" },
    { label: "Metadati ISP", detail: "Meno logging in rete domestica" },
    { label: "Lavoro sensibile", detail: "Ricerca e giornalismo" },
  ],
  trustTitle: "Come riconoscere un VPN affidabile",
  trustSignals: [
    "Politica no-logs verificata in modo indipendente",
    "Proprietà e giurisdizione trasparenti",
    "WireGuard o OpenVPN con crittografia robusta",
    "Client open source o build riproducibili",
    "Divulgazioni oneste su metadati e fatturazione",
    "Niente marketing «100% anonimi»",
  ],
  providersTitle: "Provider consigliati",
  providersIntro:
    "Tre VPN orientati alla privacy da team affidabili — scegliete in base alla legge svizzera, registrazione anonima o routing mixnet.",
  providers: {
    proton: {
      tagline: "Legge svizzera sulla privacy · no-logs verificato · ecosistema Proton",
      description:
        "Sviluppato da Proton AG — il team dietro Proton Mail. App open source, audit indipendenti, routing Secure Core e Tor-over-VPN opzionale.",
      highlights: ["Giurisdizione svizzera", "No-logs verificato", "Piano gratuito disponibile", "Client open source"],
      visitLabel: "Visita Proton VPN",
    },
    mullvad: {
      tagline: "Niente email · solo numero account · contanti e crypto",
      description:
        "VPN svedese con numeri di account anonimi, prezzo fisso e opzioni di pagamento che separano la vostra identità dall'abbonamento.",
      highlights: ["Registrazione senza email", "WireGuard + OpenVPN", "Accetta contanti e crypto", "Infrastruttura verificata"],
      visitLabel: "Visita Mullvad",
    },
    nym: {
      tagline: "Routing mixnet · oltre il tunneling standard",
      description:
        "Aggiunge la tecnologia mixnet alla crittografia VPN — frammentando e riordinando i pacchetti per resistere all'analisi del traffico, non solo nascondere l'IP.",
      highlights: [
        "Modalità WireGuard + mixnet",
        "Routing decentralizzato",
        "Resistente all'analisi del traffico",
        "Team supportato dalla ricerca",
      ],
      visitLabel: "Visita NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Ideale per",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Giurisdizione privacy",
      proton: "Svizzera",
      mullvad: "Svezia",
      nym: "Mixnet decentralizzato",
    },
    signup: {
      label: "Registrazione",
      proton: "Account email",
      mullvad: "N. account casuale",
      nym: "Account standard",
    },
    standout: {
      label: "Caratteristica distintiva",
      proton: "Secure Core + Tor",
      mullvad: "Pagamento contanti/crypto",
      nym: "Routing mixnet",
    },
    idealUser: {
      label: "Utente ideale",
      proton: "Fan dell'ecosistema Proton",
      mullvad: "Massima anonimia alla registrazione",
      nym: "Resistenza all'analisi del traffico",
    },
  },
  ctaTitle: "VPN + PrivateNote: compiti diversi",
  ctaBody:
    "Un VPN protegge la connessione. PrivateNote protegge il segreto stesso — crittografato nel browser prima del caricamento, autodistruttivo dopo una sola lettura.",
  ctaButton: "Crea una nota sicura monouso",
  exploreOther: "Esplora altre guide",
  allResources: "Tutte le risorse",
  affiliateDisclaimer:
    "Guida solo a scopo educativo. Possiamo ricevere una commissione dai link di affiliazione ai servizi consigliati, a supporto di questa risorsa gratuita sulla privacy.",
  otherGuides: [
    { id: "password", title: "Gestori di password" },
    { id: "messenger", title: "Messaggistica sicura" },
    { id: "email", title: "Email sicura" },
    { id: "browser", title: "Browser per la privacy" },
  ],
};
