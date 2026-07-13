import type { VpnGuideCopy } from "./types";

export const vpnGuideHr: VpnGuideCopy = {
  metaTitle: "Vodič za VPN usluge",
  metaDescription:
    "Odaberite pouzdani VPN: usporedite Proton VPN, Mullvad i NymVPN — što štite, njihova ograničenja i sigurno dijeljenje tajni.",
  heroLabel: "Sigurnosni vodič",
  heroTitle: "Vodič za VPN usluge",
  heroSubtitle:
    "Praktičan vodič za odabir pouzdanog VPN-a — što štiti, što ne rješava i zašto Proton VPN, Mullvad i NymVPN ističu za korisnike koji brinu o privatnosti.",
  whatItDoesTitle: "Što VPN zapravo radi",
  whatItDoesBody:
    "Virtualna privatna mreža stvara šifrirani tunel između vašeg uređaja i VPN poslužitelja. Promet koji napušta uređaj je šifriran, a web-stranice vide IP adresu VPN poslužitelja umjesto vaše — smanjujući ono što vaš ISP, operater kafićkog Wi‑Fi-ja ili netko na istoj mreži može promatrati.",
  benefits: [
    "Šifrira promet između uređaja i VPN poslužitelja",
    "Skriva vašu pravu IP adresu od stranica i usluga koje posjećujete",
    "Štiti od pasivnog prisluškivanja na nepouzdanom Wi‑Fi-ju",
    "Smanjuje praćenje DNS-a i metapodataka o odredištu na razini ISP-a",
  ],
  withoutVpnLabel: "Bez VPN-a",
  withoutVpnBody:
    "Vaš uređaj komunicira izravno s web-stranicom. Operater Wi‑Fi-ja i ISP mogu vidjeti metapodatke o vezi — a na neprijateljskim mrežama promet može biti presretnut.",
  withoutVpnItems: [
    "Prava IP vidljiva stranicama",
    "ISP vidi odredišta i DNS",
    "Izloženost na javnom Wi‑Fi-ju",
  ],
  withVpnLabel: "S VPN-om",
  withVpnBody:
    "Promet se prvo umotava u šifriranje prema VPN poslužitelju. Promatrači na lokalnoj mreži vide šifrirane pakete — ne koje stranice posjećujete.",
  withVpnItems: [
    "Stranice vide VPN izlaznu IP",
    "Šifrirani tunel do poslužitelja",
    "Sigurnije na nepouzdanim mrežama",
  ],
  limitationsTitle: "Što VPN ne radi",
  limitationsIntro: "VPN-ovi su korisni, ali nisu čarobni plašt nevidljivosti — posebno pri dijeljenju tajni.",
  limitations: [
    "Ne čini vas anonimnima ako ostanete prijavljeni na Google, Facebook ili poslovne račune",
    "Ne zaustavlja phishing, zlonamjerni softver niti slabe lozinke",
    "Ne šifrira sadržaj chata osim ako aplikacija već koristi end-to-end šifriranje",
    "Ne zamjenjuje sigurno dijeljenje lozinki, API ključeva ili kodova za oporavak",
  ],
  limitationsCallout:
    "Za jednokratne tajne — lozinke, seed fraze, API ključeve — koristite end-to-end šifrirano dijeljenje poput PrivateNote. VPN štiti kanal; ne štiti ono što zalijepite u e-poštu, Slack ili SMS.",
  whenToUseTitle: "Kada koristiti VPN",
  whenToUseIntro:
    "Ne trebate ga 24/7 osim ako vaš model prijetnji to ne zahtijeva — ali ovo su situacije u kojima se pouzdani VPN isplati.",
  useCases: [
    { label: "Javni Wi‑Fi", detail: "Zračne luke, hoteli, kafići" },
    { label: "Putovanja", detail: "Strane mreže i roaming" },
    { label: "ISP metapodaci", detail: "Manje zapisivanja na kućnoj mreži" },
    { label: "Osjetljiv rad", detail: "Istraživanje i novinarstvo" },
  ],
  trustTitle: "Kako prepoznati pouzdani VPN",
  trustSignals: [
    "Neovisno revidirana no-logs politika",
    "Transparentno vlasništvo i jurisdikcija",
    "WireGuard ili OpenVPN sa snažnim šifriranjem",
    "Open-source ili reproduktivni klijentski build-ovi",
    "Iskrena objava metapodataka i naplate",
    "Bez marketinga „100% anonimno“",
  ],
  providersTitle: "Preporučeni pružatelji",
  providersIntro:
    "Tri VPN-a usmjerena na privatnost od pouzdanih timova — birajte prema švicarskom pravu, anonimnoj registraciji ili mixnet usmjeravanju.",
  providers: {
    proton: {
      tagline: "Švicarsko pravo privatnosti · revidirano no-logs · Proton ekosustav",
      description:
        "Izradio Proton AG — tim iza Proton Mail-a. Open-source aplikacije, neovisni auditi, Secure Core usmjeravanje i opcionalni Tor-over-VPN.",
      highlights: ["Švicarska jurisdikcija", "Revidirano no-logs", "Besplatna razina dostupna", "Open-source klijenti"],
      visitLabel: "Posjetite Proton VPN",
    },
    mullvad: {
      tagline: "Bez e-pošte · samo broj računa · gotovina i kripto",
      description:
        "Švedski VPN s anonimnim brojevima računa, fiksnom cijenom i opcijama plaćanja koje odvajaju vaš identitet od pretplate.",
      highlights: ["Registracija bez e-pošte", "WireGuard + OpenVPN", "Prihvaća gotovinu i kripto", "Revidirana infrastruktura"],
      visitLabel: "Posjetite Mullvad",
    },
    nym: {
      tagline: "Mixnet usmjeravanje · izvan standardnog tuneliranja",
      description:
        "Dodaje mixnet tehnologiju uz VPN šifriranje — razbija i preuređuje pakete da odoli analizi prometa, ne samo da sakrije IP.",
      highlights: [
        "WireGuard + mixnet načini",
        "Decentralizirano usmjeravanje",
        "Otporan na analizu prometa",
        "Tim temeljen na istraživanju",
      ],
      visitLabel: "Posjetite NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Najbolje za",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Jurisdikcija privatnosti",
      proton: "Švicarska",
      mullvad: "Švedska",
      nym: "Decentralizirani mixnet",
    },
    signup: {
      label: "Registracija",
      proton: "Račun s e-poštom",
      mullvad: "Nasumičan br. računa",
      nym: "Standardni račun",
    },
    standout: {
      label: "Istaknuta značajka",
      proton: "Secure Core + Tor",
      mullvad: "Plaćanje gotovinom/kripto",
      nym: "Mixnet usmjeravanje",
    },
    idealUser: {
      label: "Idealni korisnik",
      proton: "Ljubitelji Proton ekosustava",
      mullvad: "Maksimalna anonimnost pri registraciji",
      nym: "Otpornost na analizu prometa",
    },
  },
  ctaTitle: "VPN + PrivateNote: različiti poslovi",
  ctaBody:
    "VPN štiti vašu vezu. PrivateNote štiti samu tajnu — šifrirano u pregledniku prije prijenosa, samouništavajuće nakon jednog čitanja.",
  ctaButton: "Stvorite sigurnu jednokratnu bilješku",
  exploreOther: "Istražite druge vodiče",
  allResources: "Svi resursi",
  affiliateDisclaimer:
    "Samo edukativni vodič. Možemo zaraditi proviziju putem partnerskih poveznica kada koristite preporučene usluge, što podržava ovaj besplatan resurs o privatnosti.",
  otherGuides: [
    { id: "password", title: "Upravitelji lozinki" },
    { id: "messenger", title: "Sigurno slanje poruka" },
    { id: "email", title: "Sigurna e-pošta" },
    { id: "browser", title: "Preglednici za privatnost" },
  ],
};
