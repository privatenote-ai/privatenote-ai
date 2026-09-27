import type { VpnGuideCopy } from "./types";

export const vpnGuideSr: VpnGuideCopy = {
  metaTitle: "Vodič za VPN usluge",
  metaDescription:
    "Izaberite pouzdan VPN: uporedite Proton VPN, Mullvad i NymVPN — šta štite, njihove granice i bezbedno deljenje tajni.",
  heroLabel: "Bezbednosni vodič",
  heroTitle: "Vodič za VPN usluge",
  heroSubtitle:
    "Praktičan vodič za izbor pouzdanog VPN-a — šta štiti, šta ne rešava i zašto Proton VPN, Mullvad i NymVPN ističu za korisnike koji brinu o privatnosti.",
  whatItDoesTitle: "Šta VPN zapravo radi",
  whatItDoesBody:
    "Virtuelna privatna mreža kreira šifrovani tunel između vašeg uređaja i VPN servera. Saobraćaj koji napušta uređaj je šifrovan, a veb-sajtovi vide IP adresu VPN servera umesto vaše — smanjujući ono što vaš ISP, operater kafićkog Wi‑Fi-ja ili neko na istoj mreži može da posmatra.",
  benefits: [
    "Šifruje saobraćaj između uređaja i VPN servera",
    "Sakriva vašu pravu IP adresu od sajtova i usluga koje posećujete",
    "Štiti od pasivnog prisluškivanja na nepouzdanom Wi‑Fi-ju",
    "Smanjuje praćenje DNS i metapodataka o destinaciji na nivou ISP-a",
  ],
  withoutVpnLabel: "Bez VPN-a",
  withoutVpnBody:
    "Vaš uređaj komunicira direktno sa veb-sajtom. Operater Wi‑Fi-ja i ISP mogu da vide metapodatke o konekciji — a na neprijateljskim mrežama saobraćaj može biti presretnut.",
  withoutVpnItems: [
    "Prava IP vidljiva sajtovima",
    "ISP vidi destinacije i DNS",
    "Izloženost na javnom Wi‑Fi-ju",
  ],
  withVpnLabel: "Sa VPN-om",
  withVpnBody:
    "Saobraćaj se prvo umotava u šifrovanje do VPN servera. Posmatrači na lokalnoj mreži vide šifrovane pakete — ne koje sajtove posećujete.",
  withVpnItems: [
    "Sajtovi vide VPN izlaznu IP",
    "Šifrovani tunel do servera",
    "Bezbednije na nepouzdanim mrežama",
  ],
  limitationsTitle: "Šta VPN ne radi",
  limitationsIntro: "VPN-ovi su korisni, ali nisu magični plašt nevidljivosti — posebno pri deljenju tajni.",
  limitations: [
    "Ne čini vas anonimnim ako ostanete prijavljeni na Google, Facebook ili poslovne naloge",
    "Ne zaustavlja fišing, malver niti slabe lozinke",
    "Ne šifruje sadržaj ćaskanja osim ako aplikacija već koristi end-to-end šifrovanje",
    "Ne zamenjuje bezbedno deljenje lozinki, API ključeva ili kodova za oporavak",
  ],
  limitationsCallout:
    "Za jednokratne tajne — lozinke, seed fraze, API ključeve — koristite end-to-end šifrovano deljenje poput PrivateNote. VPN štiti kanal; ne štiti ono što nalepite u e-poštu, Slack ili SMS.",
  whenToUseTitle: "Kada koristiti VPN",
  whenToUseIntro:
    "Ne treba vam 24/7 osim ako vaš model pretnji to ne zahteva — ali ovo su situacije u kojima se pouzdan VPN isplati.",
  useCases: [
    { label: "Javni Wi‑Fi", detail: "Aerodromi, hoteli, kafići" },
    { label: "Putovanja", detail: "Strane mreže i roming" },
    { label: "ISP metapodaci", detail: "Manje logovanja na kućnoj mreži" },
    { label: "Osetljiv rad", detail: "Istraživanje i novinarstvo" },
  ],
  trustTitle: "Kako prepoznati pouzdan VPN",
  trustSignals: [
    "Nezavisno revidirana no-logs politika",
    "Transparentno vlasništvo i jurisdikcija",
    "WireGuard ili OpenVPN sa jakom šifrovanjem",
    "Open-source ili reproduktivni klijentski build-ovi",
    "Iskrena objava metapodataka i naplate",
    "Bez marketinga „100% anonimno“",
  ],
  providersTitle: "Preporučeni provajderi",
  providersIntro:
    "Tri VPN-a usmerena na privatnost od pouzdanih timova — birajte prema švajcarskom pravu, anonimnoj registraciji ili mixnet rutiranju.",
  providers: {
    proton: {
      tagline: "Švajcarsko pravo privatnosti · revidirano no-logs · Proton ekosistem",
      description:
        "Napravio Proton AG — tim iza Proton Mail-a. Open-source aplikacije, nezavisni auditi, Secure Core rutiranje i opcioni Tor-over-VPN.",
      highlights: ["Švajcarska jurisdikcija", "Revidirano no-logs", "Besplatan nivo dostupan", "Open-source klijenti"],
      visitLabel: "Posetite Proton VPN",
    },
    mullvad: {
      tagline: "Bez e-pošte · samo broj naloga · gotovina i kripto",
      description:
        "Švedski VPN sa anonimnim brojevima naloga, fiksnom cenom i opcijama plaćanja koje odvajaju vaš identitet od pretplate.",
      highlights: ["Registracija bez e-pošte", "WireGuard + OpenVPN", "Prihvata gotovinu i kripto", "Revidirana infrastruktura"],
      visitLabel: "Posetite Mullvad",
    },
    nym: {
      tagline: "Mixnet rutiranje · izvan standardnog tunelovanja",
      description:
        "Dodaje mixnet tehnologiju uz VPN šifrovanje — razbija i preuređuje pakete da odoli analizi saobraćaja, ne samo da sakrije IP.",
      highlights: [
        "WireGuard + mixnet režimi",
        "Decentralizovano rutiranje",
        "Otporan na analizu saobraćaja",
        "Tim zasnovan na istraživanju",
      ],
      visitLabel: "Posetite NymVPN",
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
      proton: "Švajcarska",
      mullvad: "Švedska",
      nym: "Decentralizovani mixnet",
    },
    signup: {
      label: "Registracija",
      proton: "Nalog sa e-poštom",
      mullvad: "Nasumičan br. naloga",
      nym: "Standardni nalog",
    },
    standout: {
      label: "Istaknuta osobina",
      proton: "Secure Core + Tor",
      mullvad: "Plaćanje gotovinom/kripto",
      nym: "Mixnet rutiranje",
    },
    idealUser: {
      label: "Idealni korisnik",
      proton: "Ljubitelji Proton ekosistema",
      mullvad: "Maksimalna anonimnost pri registraciji",
      nym: "Otpor analizi saobraćaja",
    },
  },
  ctaTitle: "VPN + PrivateNote: različiti poslovi",
  ctaBody:
    "VPN štiti vašu konekciju. PrivateNote štiti samu tajnu — šifrovano u pregledaču pre otpremanja, samouništavajuće nakon jednog čitanja.",
  ctaButton: "Kreirajte bezbednu jednokratnu belešku",
  exploreOther: "Istražite druge vodiče",
  allResources: "Svi resursi",
  affiliateDisclaimer:
    "Samo edukativni vodič. Možemo zaraditi proviziju preko partnerskih linkova kada koristite preporučene usluge, što podržava ovaj besplatan resurs o privatnosti.",
  otherGuides: [
    { id: "password", title: "Menadžeri lozinki" },
    { id: "messenger", title: "Bezbedno slanje poruka" },
    { id: "email", title: "Bezbedna e-pošta" },
    { id: "browser", title: "Pregledači za privatnost" },
  ],
};
