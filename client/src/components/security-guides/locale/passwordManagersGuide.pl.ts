import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuidePl: PasswordManagersGuideCopy = {
  metaTitle: "Przewodnik po menedżerach haseł",
  metaDescription:
    "Twórz, przechowuj i udostępniaj hasła. Porównaj KeePass, Bitwarden, Apple i Google — plus Passwords.lu i PrivateNote do jednorazowego udostępniania.",
  heroLabel: "Przewodnik bezpieczeństwa",
  heroTitle: "Przewodnik po menedżerach haseł",
  heroTagline: "Twórz, przechowuj i udostępniaj hasła bezpiecznie",
  heroSubtitle:
    "Hasła chronią niemal każdy aspekt cyfrowego życia — a jednak ponowne użycie i słabe wzorce pozostają jednym z najsłabszych ogniw cyberbezpieczeństwa. Menedżer haseł to naprawia.",
  introLead:
    "Problem nie leży w samych hasłach, lecz w tym, jak ludzie ich używają. Wielu nadal stosuje to samo hasło na dziesiątkach stron albo wprowadza tylko drobne zmiany:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Gdy jedna witryna ucierpi na naruszeniu, atakujący testują te dane wszędzie — to credential stuffing, odpowiedzialny za miliony skompromitowanych kont co roku. Menedżer haseł generuje inne hasło do każdego konta. Wystarczy zapamiętać jedno silne hasło główne.",
  essentialTitle: "Dlaczego menedżery haseł są niezbędne",
  essentialIntro: "Dobry menedżer haseł wyraźnie poprawia zarówno bezpieczeństwo, jak i codzienną pracę w sieci.",
  essentialBenefits: [
    "Natychmiast generuj długie, losowe hasła",
    "Przechowuj każde hasło w szyfrowanym sejfie",
    "Automatycznie wypełniaj formularze logowania",
    "Wykrywaj ponownie używane lub słabe hasła",
    "Otrzymuj alerty, gdy dane pojawią się w znanych wyciekach",
    "Synchronizuj hasła między urządzeniami",
    "Przechowuj klucze dostępu obok haseł",
    "Bezpiecznie udostępniaj dane logowania, gdy to konieczne",
  ],
  howItWorksTitle: "Jak działają menedżery haseł",
  howItWorksBody1:
    "Dane logowania żyją w szyfrowanym sejfie. Przy tworzeniu sejfu wybierasz hasło główne, z którego pochodzą klucze szyfrowania chroniące całą zawartość.",
  cryptoLabel: "Nowoczesna kryptografia zwykle obejmuje:",
  cryptoPoints: [
    "Szyfrowanie AES-256",
    "Argon2id lub PBKDF2 do wyprowadzania kluczy",
    "Szyfrowanie uwierzytelnione, które wykrywa manipulację",
  ],
  howItWorksBody2:
    "Ponieważ sejf jest szyfrowany przed zapisem lub synchronizacją, zaufani dostawcy zwykle nie mogą odczytać Twoich haseł.",
  unlockedLabel: "Po odblokowaniu menedżer może:",
  vaultFeatures: [
    "Automatycznie wypełniać nazwy użytkownika i hasła",
    "Generować bezpieczne hasła",
    "Zapisywać nowo utworzone dane logowania",
    "Synchronizować zmiany między urządzeniami",
    "Przechowywać bezpieczne notatki i klucze dostępu",
  ],
  benefitsTitle: "Korzyści z menedżera haseł",
  benefitBlocks: [
    {
      title: "Każde konto dostaje unikalne hasło",
      body: "Jeśli ktoś ukradnie hasło do Netflix, nie powinno otworzyć też poczty, banku, GitHub ani chmury. Menedżery haseł sprawiają, że unikalne hasła są bez wysiłku.",
    },
    {
      title: "Silne generowanie haseł",
      body: "Ludzie źle wymyślają losowe hasła. Menedżery generują ciągi o wysokiej entropii, np. uQ8!kL#7P2@wXf9$rZm4 — bardzo trudne do odgadnięcia lub złamania siłowo.",
    },
    {
      title: "Automatyczne logowanie",
      body: "Menedżery rozpoznają witryny i wypełniają dane automatycznie. Zaufane zwykle wypełniają tylko na właściwej domenie, co pomaga też chronić przed phishingiem.",
    },
    {
      title: "Raporty kondycji haseł",
      body: "Wiele menedżerów oznacza ponownie używane hasła, słabe hasła, skompromitowane dane, brak MFA i witryny z kluczami dostępu — pomagając poprawiać bezpieczeństwo z czasem.",
    },
    {
      title: "Bezpieczna synchronizacja",
      body: "Nowoczesne menedżery synchronizują szyfrowany sejf między komputerem, laptopem, telefonem i tabletem, więc hasła są tam, gdzie ich potrzebujesz.",
    },
  ],
  passwordsLuPartnerLabel: "Narzędzie partnerskie",
  passwordsLuTitle: "Generowanie w przeglądarce z Passwords.lu",
  passwordsLuBody:
    "Czasem potrzebujesz tylko silnego hasła — nie całego przepływu sejfu. Passwords.lu generuje hasła bezpośrednio w przeglądarce. Hasła nie są przesyłane na serwery; konto nie jest wymagane.",
  passwordsLuWorkflow:
    "Zalecany przepływ: wygeneruj na Passwords.lu, potem od razu zapisz w menedżerze haseł.",
  passwordsLuCta: "Otwórz generator haseł",
  passwordsLuTools: [
    "Generator silnych haseł",
    "Generator fraz haseł",
    "Bezpieczny generator PIN",
    "Sprawdzanie siły hasła",
    "Generator nazw użytkownika",
    "Generatory skrótów (Argon2id, bcrypt, scrypt i inne)",
    "Edukacyjne narzędzia bezpieczeństwa",
  ],
  recommendedTitle: "Polecane menedżery haseł",
  recommendedIntro:
    "Myśl w trzech warstwach: narzędzia platformowe jako stabilny domyślny wybór, lokalne sejfy open source dla kontroli oraz menedżery chmurowe, gdy potrzebujesz silnej synchronizacji — godząc się na dodatkowe ryzyko po stronie serwera.",
  tiers: {
    platform: {
      title: "Menedżery wbudowane w platformę",
      subtitle: "Silna inżynieria, stabilne produkty — najlepszy domyślny wybór dla większości osób",
      intro:
        "Apple i Google dostarczają menedżery haseł wraz z systemem. Stoją za nimi duże zespoły bezpieczeństwa, otrzymują ciągłe aktualizacje i integrują klucze dostępu, autouzupełnianie oraz alerty wycieków przy minimalnej konfiguracji. Jeśli żyjesz w jednym ekosystemie, to często najpłynniejszy i najbardziej niezawodny wybór.",
      strengthsLabel: "Mocne strony",
      tradeoffsLabel: "Kompromisy",
      pros: [
        "Dopracowany interfejs z autouzupełnianiem na poziomie systemu i kluczami dostępu",
        "Utrzymywane przez inżynierów bezpieczeństwa platformy na dużą skalę",
        "Brak osobnej subskrypcji na funkcje podstawowe",
        "Stabilna synchronizacja przez iCloud lub konto Google",
      ],
      cons: [
        "Powiązane z kontem Apple lub Google i wyborami platformy",
        "Mniej elastyczne, gdy mieszasz Windows, Linux i urządzenia mobilne",
        "Model zaufania zależy od bezpieczeństwa konta w chmurze",
      ],
      managers: {
        apple: {
          verdict: "Najlepszy na iPhone, iPad, Mac i Vision Pro",
          description:
            "Wbudowany w platformy Apple: bezpieczne przechowywanie, generowanie, alerty bezpieczeństwa, klucze dostępu i synchronizacja iCloud Keychain — bez dodatkowej aplikacji w domu wyłącznie Apple.",
          highlights: [
            "Głęboka integracja z systemem i obsługa kluczy dostępu",
            "Alerty bezpieczeństwa przy znanych wyciekach",
            "Doskonałe doświadczenie, gdy zostajesz w stosie Apple",
          ],
          learnMore: "Dowiedz się więcej",
        },
        google: {
          verdict: "Najlepszy na Androida i Chrome",
          description:
            "Wbudowany w Androida i Chrome: generowanie, autouzupełnianie, Password Checkup, alerty wycieków, klucze dostępu i synchronizacja przez konto Google.",
          highlights: [
            "Wygodny wybór domyślny na urządzeniach Android",
            "Password Checkup i alerty wycieków",
            "Działa wszędzie tam, gdzie używasz Chrome",
          ],
          learnMore: "Dowiedz się więcej",
        },
      },
    },
    local: {
      title: "Lokalne sejfy open source",
      subtitle: "Maksymalna kontrola — szyfrowany plik należy do Ciebie",
      intro:
        "KeePass przechowuje sejf jako lokalną szyfrowaną bazę. Nic nie wymaga konta chmurowego dostawcy: Ty decydujesz, gdzie leży plik i jak się synchronizuje. Kompromisem jest interfejs — może sprawiać wrażenie starszego niż menedżery platformowe lub chmurowe, a synchronizacja wielu urządzeń jest samodzielna, dopóki nie dodasz własnej warstwy pamięci.",
      strengthsLabel: "Mocne strony",
      tradeoffsLabel: "Kompromisy",
      pros: [
        "Open source i możliwy do audytu",
        "Brak obowiązkowego konta chmurowego ani subskrypcji",
        "Najpierw offline; plik sejfu pozostaje pod Twoją kontrolą",
        "Duży ekosystem wtyczek (KeePassXC, porty mobilne itd.)",
      ],
      cons: [
        "Interfejs i wdrożenie mniej dopracowane niż narzędzia platformowe",
        "Synchronizacja między urządzeniami jest ręczna, dopóki jej nie skonfigurujesz",
        "Więcej konfiguracji dla rodzin lub domów z mieszanymi urządzeniami",
      ],
      managers: {
        keepass: {
          verdict: "Najlepszy dla purystów prywatności i samodzielnego hostowania",
          description:
            "Oryginalny model open source: jeden szyfrowany plik .kdbx, który możesz trzymać na dysku, USB, NAS lub synchronizować własną chmurą. KeePassXC to popularny wieloplatformowy fork z nowocześniejszym interfejsem.",
          highlights: [
            "Całkowicie bezpłatny — bez uzależnienia od dostawcy",
            "Ty wybierasz strategię przechowywania i synchronizacji",
            "Idealny, gdy chmura jest opcją, a nie domyślnym wyborem",
          ],
          learnMore: "Dowiedz się więcej",
        },
      },
    },
    cloud: {
      title: "Menedżery haseł z synchronizacją w chmurze",
      subtitle: "Silna synchronizacja i udostępnianie — najwyższe ryzyko po stronie serwera",
      intro:
        "Dedykowane menedżery chmurowe, takie jak Bitwarden, wyróżniają się synchronizacją wieloplatformową, udostępnianiem rodzinnym i funkcjami zespołowymi. Ta wygoda wiąże się z innym modelem zagrożeń: szyfrowany sejf (a czasem metadane) leży na serwerach kogoś innego. Naruszenie lub błędna konfiguracja u dostawcy to główne ryzyko resztkowe — dlatego audyty, open source i silne hasło główne liczą się tu bardziej niż gdziekolwiek indziej.",
      strengthsLabel: "Mocne strony",
      tradeoffsLabel: "Kompromisy",
      pros: [
        "Najlepsza synchronizacja między urządzeniami od razu po instalacji",
        "Funkcje udostępniania w rodzinie i organizacji",
        "Działa spójnie na Windows, macOS, Linux i urządzeniach mobilnych",
        "Opcje open source (Bitwarden) z publicznymi audytami bezpieczeństwa",
      ],
      cons: [
        "Największa powierzchnia ataku, jeśli dostawca zostanie skompromitowany",
        "Szyfrowane kopie sejfu nadal można łamać offline przy słabym haśle głównym",
        "Musisz zaufać implementacji kryptografii i operacjom dostawcy",
      ],
      managers: {
        bitwarden: {
          verdict: "Najlepsza opcja chmurowa dla użytkowników wieloplatformowych",
          description:
            "Oprogramowanie open source, synchronizacja szyfrowana end-to-end, klucze dostępu, niezależne audyty i mocna warstwa Free — domyślna rekomendacja, gdy potrzebujesz synchronizacji w chmurze poza Apple lub Google.",
          highlights: [
            "Audytowane klienci open source",
            "Doskonały plan Free i warstwy rodzinne",
            "Spójne doświadczenie na wszystkich głównych platformach",
          ],
          learnMore: "Dowiedz się więcej",
        },
        lastpass: {
          verdict: "Opcja legacy — nowym użytkownikom polecamy Bitwarden",
          description:
            "Pomógł spopularyzować chmurowe menedżery haseł, ale głośne incydenty z kradzieżą szyfrowanych kopii sejfów skłoniły wielu specjalistów bezpieczeństwa do Bitwarden lub lokalnego KeePass przy nowych wdrożeniach.",
          highlights: [
            "Używalny z silnym hasłem głównym + MFA, jeśli już jesteś zainwestowany",
            "Rozważ migrację, jeśli zaczynasz od zera",
          ],
          learnMore: "Dowiedz się więcej",
          caution: "Uwaga",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Twój priorytet",
    recommendation: "Rekomendacja",
  },
  comparisonRows: [
    { priority: "Żyję w ekosystemie Apple", pick: "Apple Passwords" },
    { priority: "Codziennie Android i Chrome", pick: "Google Password Manager" },
    { priority: "Maksymalna prywatność i kontrola pliku", pick: "KeePass (lokalny sejf)" },
    { priority: "Wieloplatformowa synchronizacja w chmurze", pick: "Bitwarden" },
    { priority: "Obecny użytkownik LastPass", pick: "Kontynuuj, jeśli utwardzone; oceń Bitwarden lub KeePass" },
  ],
  sharingTitle: "Bezpieczne udostępnianie haseł",
  sharingBody:
    "Nawet silne hasła czasem trzeba udostępnić — współpracownikom, rodzinie, administratorom IT, wykonawcom lub klientom. Zbyt wiele osób nadal wysyła je przez platformy zaprojektowane do czatu, a nie do przekazywania tajemnic.",
  unsafeChannels: ["E-mail", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Zamiast tego użyj PrivateNote",
  privateNoteSharingBody:
    "PrivateNote szyfruje tajemnice w przeglądarce przed przesłaniem. Serwer przechowuje tylko szyfrogram; klucz odszyfrowania podróżuje osobno w linku. Notatki mogą zniszczyć się po jednym odczycie lub wygasnąć według harmonogramu.",
  privateNoteSharingItems: [
    "Hasła",
    "Klucze API",
    "Dane logowania Wi‑Fi",
    "Kody odzyskiwania",
    "Tymczasowe logowania",
  ],
  privateNoteSharingCta: "Utwórz bezpieczną jednorazową notatkę",
  passwordProtectedTitle: "Dodatkowa ochrona notatkami z hasłem",
  passwordProtectedBody1:
    "Dodaj opcjonalne hasło do PrivateNote. Odbiorca potrzebuje zarówno linku, jak i osobnego hasła — najlepiej dostarczonych różnymi kanałami (link e-mailem, hasło telefonem lub osobiście).",
  passwordProtectedBody2:
    "Nawet jeśli ktoś przechwyci link, nie odsłoni tajemnicy bez hasła.",
  bestPracticesTitle: "Dobre praktyki",
  bestPractices: [
    "Używaj długiego, unikalnego hasła głównego",
    "Włącz uwierzytelnianie wieloskładnikowe w menedżerze haseł",
    "Nigdy nie używaj ponownie haseł na różnych witrynach",
    "Generuj hasła menedżerem haseł lub Passwords.lu",
    "Zapisuj każde hasło w szyfrowanym sejfie",
    "Włączaj klucze dostępu, gdy są dostępne",
    "Regularnie przeglądaj raporty kondycji haseł",
    "Udostępniaj hasła przez PrivateNote zamiast e-maila lub czatu",
    "Przy szczególnie wrażliwych danych użyj opcjonalnej ochrony hasłem PrivateNote i przekaż hasło osobno",
  ],
  faqTitle: "Często zadawane pytania",
  faq: [
    {
      q: "Czy menedżery haseł są bezpieczne?",
      a: "Tak. Zaufane menedżery haseł używają silnego, branżowego szyfrowania. Dla niemal każdego korzystanie z menedżera haseł jest wyraźnie bezpieczniejsze niż zapamiętywanie haseł lub ponowne używanie tego samego na wielu witrynach.",
    },
    {
      q: "Czy dostawca menedżera haseł może odczytać moje hasła?",
      a: "W nowoczesnych menedżerach, takich jak KeePass, Bitwarden, Apple Passwords i Google Password Manager, sejf jest szyfrowany przed zapisem. Przy silnym haśle głównym dostawca zwykle nie może odczytać przechowywanych danych logowania.",
    },
    {
      q: "Co się stanie, jeśli zapomnę hasła głównego?",
      a: "Większość menedżerów haseł nie może go odzyskać, bo nigdy go nie zna. To zamierzone. Niektóre usługi oferują odzyskiwanie lub dostęp awaryjny, jeśli skonfigurujesz je wcześniej.",
    },
    {
      q: "Czy powinienem używać przechowywania haseł w przeglądarce?",
      a: "Wbudowane menedżery Apple i Google to silne, stabilne wybory w swoich ekosystemach — wspierane przez duże zespoły bezpieczeństwa. KeePass pasuje do maksymalnej kontroli. Bitwarden pasuje, gdy potrzebujesz synchronizacji w chmurze na mieszanych platformach, godząc się na wyższe ryzyko po stronie serwera.",
    },
  ],
  finalTitle: "Ostateczna rekomendacja",
  finalBody:
    "Żaden menedżer nie jest idealny dla każdego — ale korzystanie z jednego to jeden z najskuteczniejszych kroków, jakie możesz zrobić. Połącz go z Passwords.lu do szybkiego generowania i PrivateNote, gdy musisz bezpiecznie udostępnić tajemnicę.",
  finalBullets: [
    { label: "Apple i Google", text: "stabilne domyślne wybory platformy" },
    { label: "KeePass", text: "lokalna kontrola, open source" },
    { label: "Bitwarden", text: "synchronizacja w chmurze, gdy potrzebujesz każdego urządzenia" },
    { label: "Passwords.lu", text: "szybkie generowanie lokalnie w przeglądarce" },
  ],
  finalCtaPrivateNote: "Udostępnij tajemnicę w PrivateNote",
  finalCtaPasswordsLu: "Odwiedź passwords.lu",
  exploreOther: "Zobacz inne przewodniki",
  allResources: "Wszystkie zasoby",
  affiliateDisclaimer:
    "Wyłącznie przewodnik edukacyjny. Możemy otrzymać prowizję z linków partnerskich, gdy skorzystasz z polecanych usług — to pomaga utrzymać ten bezpłatny zasób o prywatności.",
  otherGuides: [
    { id: "vpn", title: "Usługi VPN" },
    { id: "messenger", title: "Bezpieczne komunikatory" },
    { id: "email", title: "Bezpieczna poczta" },
    { id: "browser", title: "Przeglądarki prywatności" },
  ],
};
