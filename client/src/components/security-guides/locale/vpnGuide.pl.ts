import type { VpnGuideCopy } from "./types";

export const vpnGuidePl: VpnGuideCopy = {
  metaTitle: "Przewodnik po VPN",
  metaDescription:
    "Wybierz zaufany VPN. Porównaj Proton VPN, Mullvad i NymVPN: co chronią, czego nie naprawią i bezpieczne udostępnianie tajemnic.",
  heroLabel: "Przewodnik bezpieczeństwa",
  heroTitle: "Przewodnik po usługach VPN",
  heroSubtitle:
    "Praktyczny przewodnik po wyborze zaufanego VPN — co chroni, czego nie naprawi i dlaczego Proton VPN, Mullvad oraz NymVPN wyróżniają się dla osób dbających o prywatność.",
  whatItDoesTitle: "Co VPN naprawdę robi",
  whatItDoesBody:
    "Wirtualna sieć prywatna tworzy szyfrowany tunel między Twoim urządzeniem a serwerem VPN. Ruch wychodzący z urządzenia jest szyfrowany, a witryny widzą adres IP serwera VPN zamiast Twojego — mniej mogą zaobserwować operator ISP, sieć Wi‑Fi w kawiarni lub ktoś w tej samej sieci.",
  benefits: [
    "Szyfruje ruch między urządzeniem a serwerem VPN",
    "Ukrywa prawdziwy adres IP przed odwiedzanymi witrynami i usługami",
    "Chroni przed pasywnym podsłuchem w niezaufanym Wi‑Fi",
    "Ogranicza śledzenie DNS i metadanych celów na poziomie ISP",
  ],
  withoutVpnLabel: "Bez VPN",
  withoutVpnBody:
    "Urządzenie łączy się z witryną bezpośrednio. Operator Wi‑Fi i ISP widzą metadane połączenia — a w wrogich sieciach ruch może zostać przechwycony.",
  withoutVpnItems: [
    "Witryny widzą prawdziwy IP",
    "ISP widzi cele i DNS",
    "Ryzyko publicznego Wi‑Fi",
  ],
  withVpnLabel: "Z VPN",
  withVpnBody:
    "Ruch najpierw idzie szyfrowany do serwera VPN. Obserwatorzy w sieci lokalnej widzą zaszyfrowane pakiety — nie to, które witryny odwiedzasz.",
  withVpnItems: [
    "Witryny widzą IP wyjścia VPN",
    "Szyfrowany tunel do serwera",
    "Bezpieczniej w niezaufanych sieciach",
  ],
  limitationsTitle: "Czego VPN nie robi",
  limitationsIntro: "VPN-y są przydatne, ale to nie magiczny płaszcz niewidki — zwłaszcza przy udostępnianiu tajemnic.",
  limitations: [
    "Nie czynią Cię anonimowym, gdy jesteś zalogowany w Google, Facebooku lub kontach służbowych",
    "Nie zatrzymują phishingu, złośliwego oprogramowania ani słabych haseł",
    "Nie szyfrują treści czatu, jeśli aplikacja nie używa już szyfrowania end-to-end",
    "Nie zastępują bezpiecznego udostępniania haseł, kluczy API ani kodów odzyskiwania",
  ],
  limitationsCallout:
    "Do jednorazowych tajemnic — haseł, fraz seed, kluczy API — użyj szyfrowanego end-to-end udostępniania jak PrivateNote. VPN chroni rurę; nie chroni tego, co wklejasz do e-maila, Slacka lub SMS-a.",
  whenToUseTitle: "Kiedy używać VPN",
  whenToUseIntro:
    "Nie potrzebujesz go 24/7, chyba że tak wymaga model zagrożeń — ale to sytuacje, w których zaufany VPN ma sens.",
  useCases: [
    { label: "Publiczne Wi‑Fi", detail: "Lotniska, hotele, kawiarnie" },
    { label: "Podróże", detail: "Zagraniczne sieci i roaming" },
    { label: "Metadane ISP", detail: "Mniej logów sieci domowej" },
    { label: "Wrażliwa praca", detail: "Badania i dziennikarstwo" },
  ],
  trustTitle: "Jak rozpoznać zaufany VPN",
  trustSignals: [
    "Niezależnie audytowana polityka braku logów",
    "Przejrzysta własność i jurysdykcja",
    "WireGuard lub OpenVPN z silnym szyfrowaniem",
    "Otwarty kod lub odtwarzalne kompilacje klienta",
    "Uczciwe informacje o metadanych i rozliczeniach",
    "Bez marketingu „100% anonimowości”",
  ],
  providersTitle: "Polecani dostawcy",
  providersIntro:
    "Trzy VPN-y nastawione na prywatność od zaufanych zespołów — wybierz według prawa szwajcarskiego, anonimowej rejestracji lub routingu mixnet.",
  providers: {
    proton: {
      tagline: "Szwajcarskie prawo prywatności · audytowany brak logów · ekosystem Proton",
      description:
        "Stworzony przez Proton AG — zespół Proton Mail. Aplikacje open source, niezależne audyty, routing Secure Core i opcjonalny Tor-over-VPN.",
      highlights: ["Jurysdykcja szwajcarska", "Audytowany brak logów", "Warstwa Free", "Klienci open source"],
      visitLabel: "Odwiedź Proton VPN",
    },
    mullvad: {
      tagline: "Bez e-maila · tylko numer konta · gotówka i krypto",
      description:
        "Szwedzki VPN z anonimowymi numerami kont, stałą ceną i płatnościami, które oddzielają tożsamość od subskrypcji.",
      highlights: ["Rejestracja bez e-maila", "WireGuard + OpenVPN", "Gotówka i krypto", "Audytowana infrastruktura"],
      visitLabel: "Odwiedź Mullvad",
    },
    nym: {
      tagline: "Routing mixnet · poza standardowym tunelem",
      description:
        "Dokłada technologię mixnet do szyfrowania VPN — łamie i przestawia pakiety, by opierać się analizie ruchu, nie tylko ukrywać IP.",
      highlights: [
        "Tryby WireGuard + mixnet",
        "Zdecentralizowany routing",
        "Odporność na analizę ruchu",
        "Zespół z zapleczem badawczym",
      ],
      visitLabel: "Odwiedź NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Najlepszy do",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Jurysdykcja prywatności",
      proton: "Szwajcaria",
      mullvad: "Szwecja",
      nym: "Zdecentralizowany mixnet",
    },
    signup: {
      label: "Rejestracja",
      proton: "Konto e-mail",
      mullvad: "Losowy nr konta",
      nym: "Standardowe konto",
    },
    standout: {
      label: "Wyróżnik",
      proton: "Secure Core + Tor",
      mullvad: "Płatność gotówką/krypto",
      nym: "Routing mixnet",
    },
    idealUser: {
      label: "Idealny użytkownik",
      proton: "Ekosystem Proton",
      mullvad: "Maksymalna anonimowość rejestracji",
      nym: "Odporność na analizę ruchu",
    },
  },
  ctaTitle: "VPN + PrivateNote: różne zadania",
  ctaBody:
    "VPN chroni połączenie. PrivateNote chroni samą tajemnicę — szyfrowaną w przeglądarce przed przesłaniem, niszczoną po jednym odczycie.",
  ctaButton: "Utwórz bezpieczną jednorazową notatkę",
  exploreOther: "Zobacz inne przewodniki",
  allResources: "Wszystkie zasoby",
  affiliateDisclaimer:
    "Wyłącznie przewodnik edukacyjny. Możemy otrzymać prowizję z linków partnerskich, gdy skorzystasz z polecanych usług — to pomaga utrzymać ten bezpłatny zasób o prywatności.",
  otherGuides: [
    { id: "password", title: "Menedżery haseł" },
    { id: "messenger", title: "Bezpieczne komunikatory" },
    { id: "email", title: "Bezpieczna poczta" },
    { id: "browser", title: "Przeglądarki prywatności" },
  ],
};
