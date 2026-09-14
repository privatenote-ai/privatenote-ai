import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativePl: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternatywa dla Privnote",
  eyebrow: "Alternatywa dla Privnote",
  heroTitleLine1: "Prywatna alternatywa dla Privnote",
  heroTitleLine2: "dla notatek, haseł i plików",
  heroBody:
    "PrivateNote zachowuje prostotę znikającej notatki i dodaje szyfrowane udostępnianie plików, ochronę hasłem, kontrolę dostępu odbiorcy oraz narzędzia do przekazywania poufnych informacji.",
  primaryCta: "Utwórz prywatną notatkę",
  secondaryCta: "Jak to działa",
  trustLine: "Bez konta dla notatek tekstowych · Szyfrowanie w przeglądarce · Jednokrotny odczyt",

  introHeading: "Jeśli już znasz Privnote",
  introBody:
    "Jeśli szukasz alternatywy dla Privnote, PrivateNote idzie za tą samą ideą: utwórz prywatny link, udostępnij go, a treść wygaśnie lub zniknie po otwarciu. Szyfrowanie odbywa się w przeglądarce przed przesłaniem. Odbiorca otwiera link i odszyfrowuje lokalnie. Nie potrzebuje konta.",
  introBody2:
    "PrivateNote rozszerza ten przebieg poza krótką wiadomość tekstową. Możesz udostępnić hasła, dokumenty, zdjęcia, nagrania głosowe lub wideo i inne pliki w tym samym szyfrowanym przekazaniu, z dodatkową kontrolą, gdy sytuacja tego wymaga.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Obie usługi są zaprojektowane do tymczasowego udostępniania. PrivateNote rozszerza ideę na pliki, media, kontrolę odbiorcy i procesy firmowe.",
  compareFeatureColumn: "Funkcja",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Tak",
  compareNo: "Niedostępne",
  comparePaid: "Starter i Business",
  compareRows: [
    { feature: "Samodestrukcyjne notatki", privnote: "yes", privatenote: "yes" },
    { feature: "Odbiorca nie potrzebuje konta", privnote: "yes", privatenote: "yes" },
    { feature: "Ochrona hasłem", privnote: "yes", privatenote: "yes" },
    { feature: "Szyfrowane załączniki", privnote: "no", privatenote: "yes" },
    { feature: "Wiele plików w jednym linku", privnote: "no", privatenote: "yes" },
    { feature: "Zdjęcia, audio i wideo", privnote: "no", privatenote: "yes" },
    { feature: "Powiadomienia o otwarciu i zniszczeniu", privnote: "yes", privatenote: "yes" },
    { feature: "Weryfikacja odbiorcy", privnote: "no", privatenote: "paid" },
    { feature: "Zaplanowane odsłonięcie", privnote: "no", privatenote: "paid" },
    {
      feature: "Branding firmy na stronie odsłonięcia",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Narzędzia dla programistów (CLI, MCP, rozszerzenia)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Funkcje mogą się zmieniać. Porównanie na podstawie publicznie dostępnych informacji o produkcie z września 2026.",
  compareCta: "Wypróbuj PrivateNote",

  whyHeading: "Dlaczego szukać alternatywy dla Privnote?",
  whyBody:
    "Privnote sprawdza się, gdy wymaganie jest proste: wysłać tymczasową notatkę tekstową. Tymczasowy tekst to tylko jeden ze sposobów, w jakie poufne informacje krążą między ludźmi.",
  whyBody2:
    "Możesz potrzebować wysłać PDF, udostępnić kilka plików, potwierdzić, że link został otwarty, chronić dostęp hasłem albo dostarczyć poufne dokumenty, nie zostawiając ich w zwykłej poczcie.",
  whyClose:
    "Właśnie ten problem PrivateNote ma rozwiązywać: bezpieczne przekazanie, a nie tylko znikająca wiadomość.",

  passwordHeading: "Alternatywa dla Privnote do udostępniania haseł",
  passwordBody:
    "Hasła Wi-Fi, klucze API i kody odzyskiwania często podróżują w tym samym e-mailu lub czacie, który wyjaśnia, do czego służą. To może zostawić kopie w historii rozmowy, zsynchronizowanych urządzeniach i kopiach zapasowych.",
  passwordBody2:
    "PrivateNote umieszcza dane logowania za osobnym szyfrowanym linkiem. Kontekst wysyłasz dotychczasowym kanałem, a tajemnicę w tymczasowej notatce, która może wygasnąć, zniszczyć się po przeczytaniu i opcjonalnie wymagać hasła. To przekazanie, a nie menedżer haseł.",
  passwordCta: "Udostępnij hasło bezpiecznie",
  passwordArticleLink: "Jak bezpiecznie udostępnić hasło",

  filesHeading: "Wysyłaj pliki, nie tylko tekst",
  filesBody:
    "Umowy, dokumenty tożsamości, finansowe PDF-y, pliki konfiguracyjne, zdjęcia i archiwa często są właściwą treścią. Znikająca notatka tekstowa ich nie uniesie. PrivateNote trzyma notatkę i szyfrowane załączniki w tym samym bezpiecznym przekazaniu, więc wiadomość i pliki podróżują razem.",
  filesBody2:
    "Wysyłanie plików wymaga bezpłatnego konta PrivateNote, aby egzekwować limity pamięci i transferów. Odbiorcy nadal otwierają link bez logowania. Po pierwszym odsłonięciu załączniki pozostają dostępne przez ograniczony czas — to nie długotrwały współdzielony folder.",
  filesLimits:
    "Aktualne limity: Free do {freeSize} na plik i {freeCount} plików na transfer ({freeTransfers} transferów miesięcznie). Starter do {starterSize} i {starterCount} plików. Business do {businessSize} i {businessCount} plików.",
  filesCta: "Wyślij szyfrowany plik",
  filesArticleLink: "Jak bezpiecznie wysłać poufne dokumenty",

  mediaHeading: "Udostępniaj poufne zdjęcia, audio i wideo",
  mediaBody:
    "Część informacji nigdy nie zaczyna się jako plik na dysku. Możesz zrobić zdjęcie dokumentu, nagrać krótką wiadomość głosową albo dołączyć istniejące zdjęcie, nie wysyłając go najpierw przez inną aplikację do wiadomości.",
  mediaBody2:
    "PrivateNote może zrobić zdjęcie, nagrać audio lub wideo albo dołączyć istniejące media. Przechwycenie odbywa się w przeglądarce, a następnie przed przesłaniem działa to samo szyfrowanie po stronie klienta co przy plikach.",
  mediaPhotoLink: "Jak bezpiecznie udostępniać zdjęcia",
  mediaVoiceLink: "Szyfrowane wiadomości głosowe",

  businessHeading: "Gdy znikająca notatka staje się procesem firmowym",
  businessBody:
    "Ten sam prywatny link przydaje się, gdy nadawcą jest księgowy, administrator IT, konsultant albo kancelaria przekazująca poufne pliki klientowi. Potrzeba to nie tylko tajemnica. To potwierdzenie, kontrola i profesjonalne dostarczenie.",
  businessScenarios: [
    "Księgowy wysyła poufne liczby klientowi.",
    "Administrator IT wysyła dane logowania pracownikowi.",
    "Kancelaria wysyła dokumenty tożsamości lub finansowe klientowi.",
    "Konsultant przekazuje pliki projektu, które nie powinny zostawać w e-mailu.",
    "Firma musi wiedzieć, że uzyskano dostęp do poufnych informacji.",
  ],
  businessBody2:
    "Starter i Business dodają weryfikację odbiorcy, zaplanowane odsłonięcie, dowód dostępu, dłuższe okna dostępu, unieważnienie nieotwartych notatek i przegląd wysłanych notatek. Business dodaje strony odsłonięcia z brandingiem, dostęp do plików tylko do podglądu i większe transfery. Szyfrowanie pozostaje w przeglądarce na każdym planie.",
  businessCta: "Poznaj PrivateNote Business",
  businessNotifyLink: "Dowiedz się, kiedy tajny link został otwarty",
  businessVerifyLink: "Weryfikacja odbiorcy",

  securityHeading: "Jak PrivateNote chroni Twoją treść",
  securityBody:
    "Poufna treść jest szyfrowana w przeglądarce przed przesłaniem. Infrastruktura PrivateNote przechowuje szyfrogram, a nie notatkę ani plik w postaci jawnej.",
  securityArchitecture:
    "Dla standardowej notatki przeglądarka generuje losowy 256-bitowy klucz szyfrowania i używa uwierzytelnionego szyfrowania AES-256-GCM. Klucz deszyfrujący jest przenoszony we fragmencie URL — części po #. Przeglądarki nie dołączają fragmentu do zwykłych żądań HTTP, więc serwer nie otrzymuje klucza jako części adresu żądania.",
  securityRecipient:
    "Przeglądarka odbiorcy używa klucza z udostępnionego linku, aby odszyfrować treść lokalnie.",
  securityLimitation:
    "Każdy, kto później ma pełny link, nadal może skopiować lub zrobić zrzut tego, co widzi. PrivateNote kontroluje przekazanie, nie to, co odbiorca zrobi po otwarciu.",
  securityFlowWrite: "Napisz / dołącz",
  securityFlowEncrypt: "Szyfruj w przeglądarce",
  securityFlowCiphertext: "Prześlij szyfrogram",
  securityFlowShare: "Udostępnij prywatny link",
  securityFlowDecrypt: "Odbiorca odszyfrowuje",
  securityEncryptionLink: "Jak działa szyfrowanie PrivateNote",
  securityHowItWorksLink: "Jak to działa w szczegółach",
  founderHeading: "Zaprojektowane z myślą o kryptografii",
  founderBody:
    "PrivateNote rozwija Marjan Skrobot, badacz kryptografii i bezpieczeństwa informacji. Model bezpieczeństwa i jego ograniczenia są udokumentowane publicznie, w tym to, przed czym PrivateNote może — i nie może — chronić.",
  founderLink: "O modelu bezpieczeństwa",

  decideHeading: "Którego użyć?",
  decidePrivnoteTitle: "Privnote może wystarczyć, jeśli…",
  decidePrivnoteItems: [
    "Musisz tylko wysłać tymczasową notatkę tekstową.",
    "Chcesz najprostszy możliwy przebieg.",
    "Nie potrzebujesz załączników ani dodatkowej kontroli dostarczenia.",
  ],
  decidePrivateNoteTitle: "PrivateNote może pasować lepiej, jeśli…",
  decidePrivateNoteItems: [
    "Chcesz udokumentowanego szyfrowania po stronie klienta.",
    "Musisz udostępniać pliki lub media oprócz tekstu.",
    "Potrzebujesz weryfikacji odbiorcy lub zaplanowanego odsłonięcia.",
    "Chcesz powiadomień o dostępie lub dowodu dostępu.",
    "Potrzebujesz profesjonalnego brandingu lub firmowej kontroli dostarczenia.",
  ],
  decideOneTimeLink: "Jak działają jednorazowe tajne linki",
  decideDevelopersLink: "Integracje dla programistów",

  faqHeading: "Często zadawane pytania",
  faqs: [
    {
      question: "Jakie są alternatywy dla Privnote?",
      answer:
        "Kilka usług oferuje tymczasowe lub szyfrowane udostępnianie notatek. PrivateNote jest dla osób, które chcą przebiegu znikającej notatki, ale potrzebują też szyfrowanych plików, mediów, kontroli odbiorcy albo funkcji dostarczenia dla firm.",
    },
    {
      question: "Czym PrivateNote różni się od Privnote?",
      answer:
        "Obie tworzą tymczasowy prywatny link, który odbiorca może otworzyć bez konta. PrivateNote dodaje szyfrowane załączniki, zdjęcia i nagrania audio w przeglądarce, opcjonalną ochronę hasłem w tym samym przebiegu oraz płatne mechanizmy, takie jak weryfikacja odbiorcy i strony odsłonięcia z brandingiem. Privnote skupia się na samodestrukcyjnych notatkach tekstowych.",
    },
    {
      question: "Czy mogę używać PrivateNote bez konta?",
      answer:
        "Tak. Podstawową szyfrowaną notatkę tekstową możesz utworzyć bez logowania. Odbiorcy nigdy nie potrzebują konta. Wysyłanie plików, zdjęć lub nagrań wymaga bezpłatnego konta, aby egzekwować limity pamięci i miesięcznych transferów.",
    },
    {
      question: "Czy mogę wysyłać pliki w PrivateNote?",
      answer:
        "Tak. Dołącz jeden lub więcej plików do tej samej szyfrowanej notatki. Pliki są szyfrowane w przeglądarce przed przesłaniem. Wysyłanie wymaga bezpłatnego konta; otwarcie linku — nie. Odbiorcy mogą pobrać załączniki w ograniczonym oknie po odsłonięciu notatki.",
    },
    {
      question: "Czy mogę udostępniać hasła w PrivateNote?",
      answer:
        "Tak. Umieść hasło w notatce i wyślij szyfrowany link zamiast samego hasła. Możesz dodać osobne hasło ochronne i trzymać krótki czas ważności. Po użyciu wartościowych danych logowania zmień je. Prywatna notatka to przekazanie, a nie menedżer haseł.",
    },
    {
      question: "Jak PrivateNote szyfruje notatki?",
      answer:
        "Przeglądarka generuje losowy 256-bitowy klucz i szyfruje notatkę algorytmem AES-256-GCM przed przesłaniem. Klucz jest przenoszony we fragmencie URL — części po # — której przeglądarki nie wysyłają w zwykłym żądaniu HTTP. Notatki chronione hasłem owijają ten klucz algorytmem Argon2id. Załączniki też są szyfrowane w przeglądarce.",
    },
    {
      question: "Czy odbiorca potrzebuje konta PrivateNote?",
      answer:
        "Nie. Odbiorcy otwierają link w przeglądarce i odszyfrowują treść lokalnie. Nie logują się. Każdy, kto ma pełny link — i hasło, jeśli je ustawisz — może otworzyć notatkę.",
    },
  ],

  finalHeading: "Udostępnij coś prywatnie.",
  finalBody: "Utwórz szyfrowaną notatkę lub przekazanie pliku i wyślij link odbiorcy.",
  finalPrimaryCta: "Utwórz prywatną notatkę",
  finalSecondaryCta: "Zobacz cennik",
  finalTrust: "Aby zacząć, konto nie jest potrzebne.",
};
