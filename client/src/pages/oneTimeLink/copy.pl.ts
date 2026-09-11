import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkPl: OneTimeLinkCopy = {
  heroTitle: "Utwórz jednorazowy link",
  heroSubtitle:
    "Udostępniaj hasła, wiadomości i pliki przez szyfrowany link · Szyfrowane w przeglądarce · Odbiorca nie potrzebuje konta",
  whatHeading: "Czym jest jednorazowy link?",
  whatBody:
    "Jednorazowy link to bezpieczniejszy sposób przekazania informacji, które nie powinny pozostawać bezterminowo dostępne w zwykłych kanałach komunikacji. Hasło, klucz API, kod odzyskiwania, prywatną wiadomość, poufny dokument lub tymczasowe dane logowania umieszczasz za szyfrowanym adresem URL. Odbiorca otwiera link, aby pobrać treść i odszyfrować ją w przeglądarce. PrivateNote szyfruje treść w przeglądarce przed przesłaniem, więc serwer otrzymuje dane zaszyfrowane, a nie zwykły tekst. Ty decydujesz, jak długo niewykorzystany link pozostaje dostępny i ile razy można go otworzyć. To bezpieczne przekazanie, a nie miejsce do trwałego przechowywania tajemnic.",
  whatLearnMore: "Jak działają jednorazowe tajne linki",
  stepsHeading: "Jak utworzyć jednorazowy link",
  step1Title: "Dodaj treść",
  step1Body: "Wpisz prywatną wiadomość lub hasło albo dołącz plik.",
  step2Title: "Ustaw dostęp",
  step2Body: "Wybierz ważność, ile razy link można otworzyć oraz opcjonalną ochronę hasłem.",
  step3Title: "Wyślij link",
  step3Body: "PrivateNote szyfruje treść w przeglądarce i zwraca link, który możesz wysłać dotychczasowym kanałem.",
  useHeading: "Co możesz udostępnić w PrivateNote",
  usePasswordsTitle: "Hasła i dane logowania",
  usePasswordsBody:
    "Udostępniaj hasła i tymczasowe dane logowania, nie zostawiając zwykłego tekstu w e-mailu ani czacie.",
  usePasswordsLink: "Jak bezpiecznie udostępnić hasło",
  useApiTitle: "Klucze API",
  useApiBody:
    "Udostępniaj klucze API, tokeny i sekrety webhooków, nie zostawiając ich w historii czatu ani zgłoszeniach.",
  useApiLink: "Jak bezpiecznie udostępnić klucz API",
  useMessagesTitle: "Prywatne wiadomości",
  useMessagesBody:
    "Dla informacji, które po przeczytaniu nie powinny pozostać bezterminowo wyszukiwalne w e-mailu ani historii czatu.",
  useMessagesLink: "Wyślij tajną wiadomość bez konta",
  useFilesTitle: "Pliki i dokumenty",
  useFilesBody:
    "Dla poufnych plików, gdy chcesz szyfrowanego przekazania i kontrolowanej dostępności zamiast długotrwałego współdzielonego folderu.",
  useFilesLink: "Bezpieczny transfer plików",
  persistHeading: "Dlaczego jednorazowy link?",
  persistBody:
    "Wysłanie hasła e-mailem, przez Slack, Teams, SMS lub inny komunikator może zostawić kopię w historii rozmowy, zsynchronizowanych urządzeniach, kopiach zapasowych, powiadomieniach i przeszukiwalnych archiwach. Szyfrowanie chroni przekazanie. Wygaśnięcie skraca czas, przez który oryginał pozostaje dostępny.",
  handoffHeading: "Zaprojektowane do bezpiecznego przekazania",
  handoffBody:
    "PrivateNote szyfruje wiadomości i pliki w przeglądarce przed przesłaniem. Serwer otrzymuje dane zaszyfrowane, a nie czytelną treść. Odszyfrowanie odbywa się w przeglądarce odbiorcy.",
  handoffEncryptionLink: "Jak działa szyfrowanie",
  handoffHowItWorksLink: "PrivateNote w szczegółach",
  limitsHeading: "Czego jednorazowy link nie zapobiegnie",
  limitsBody:
    "Po otwarciu uprawniona osoba nadal może skopiować, zapisać lub sfotografować informacje. PrivateNote chroni przekazanie i ogranicza, jak długo oryginalny link pozostaje dostępny. Nie usuwa kopii już zapisanych.",
  faqHeading: "Często zadawane pytania",
  faqs: [
    {
      question: "Czym jest jednorazowy link?",
      answer:
        "Jednorazowy link to sposób tymczasowego udostępniania poufnych informacji. Zamiast wysyłać hasło, wiadomość lub plik bezpośrednio e-mailem albo czatem, udostępniasz szyfrowany link o ograniczonej ważności i dostępie. PrivateNote szyfruje treść w przeglądarce, więc oryginalna tajemnica nie pozostaje bezterminowo w historii rozmowy.",
    },
    {
      question: "Jak utworzyć jednorazowy link?",
      answer:
        "Skorzystaj z formularza na górze tej strony. Dodaj wiadomość, hasło lub plik, wybierz, jak długo niewykorzystany link ma pozostać dostępny i ile razy można go otworzyć, a następnie utwórz link. PrivateNote szyfruje treść w przeglądarce i zwraca adres URL, który możesz wysłać dotychczasowym kanałem.",
    },
    {
      question: "Czy mogę wysłać hasło jednorazowym linkiem?",
      answer:
        "Tak. Umieść hasło w notatce i wyślij szyfrowany link zamiast samego hasła. Możesz dodać osobne hasło ochronne. Przy ważnych kontach zmień dane logowania po użyciu przez odbiorcę. Jednorazowy link to przekazanie, a nie menedżer haseł.",
    },
    {
      question: "Czy mogę wysłać plik jednorazowym linkiem?",
      answer:
        "Tak. Dołącz plik lub folder do tej samej szyfrowanej notatki. Pliki są szyfrowane w przeglądarce przed przesłaniem. Wysyłanie załączników wymaga bezpłatnego konta PrivateNote, aby egzekwować limity pamięci. Odbiorcy nadal nie potrzebują konta, aby otworzyć link.",
    },
    {
      question: "Czy odbiorca potrzebuje konta PrivateNote?",
      answer:
        "Nie. Odbiorcy otwierają link w przeglądarce i odszyfrowują treść lokalnie. Nie muszą się logować. Podstawową notatkę tekstową możesz też utworzyć bez konta. Wysyłanie plików wymaga bezpłatnego konta ze względu na ochronę przed nadużyciami i limity pamięci.",
    },
    {
      question: "Co się dzieje po otwarciu linku?",
      answer:
        "Przeglądarka odbiorcy odszyfrowuje treść lokalnie. Bezpłatne notatki są do jednokrotnego odczytu: po otwarciu oryginalna notatka jest niszczona. Starter może zezwolić na maksymalnie trzy otwarcia, Business na dziesięć. Jeśli nikt nie otworzy linku, wygasa po wybranym czasie — na planie Free najwyżej po trzech dniach. Załączone pliki pozostają widoczne przez ograniczony czas po pierwszym otwarciu.",
    },
    {
      question: "Czy ktoś może zrobić zrzut ekranu PrivateNote?",
      answer:
        "Tak. Każdy, kto widzi odsłoniętą treść, może zrobić zrzut ekranu, zdjęcie lub ją skopiować. PrivateNote nie twierdzi, że to blokuje. Kontroluje szyfrowane przekazanie i to, jak długo oryginalny link pozostaje dostępny.",
    },
    {
      question: "Jak długo link PrivateNote może pozostać aktywny?",
      answer:
        "Jeśli notatka nigdy nie zostanie otwarta, bezpłatne linki wygasają najpóźniej po trzech dniach. Starter pozwala na maksymalnie 15 dni, Business na 30 dni. Po otwarciu bezpłatne notatki są do jednokrotnego odczytu. Starter może zezwolić na maksymalnie trzy otwarcia, Business na dziesięć. Wybierz najkrótszy czas, który nadal pozwala odbiorcy dokończyć przekazanie.",
    },
  ],
  articleLearnMore: "Dowiedz się, jak działają jednorazowe linki i jak pozostają bezpieczne",
  backToCreate: "Gotowi? Utwórz jednorazowy link ↑",
};
