import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkIt: OneTimeLinkCopy = {
  heroTitle: "Crea un link monouso",
  heroSubtitle:
    "Condividi password, messaggi e file con un link cifrato · Cifrato nel browser · Il destinatario non ha bisogno di un account",
  whatHeading: "Che cos’è un link monouso?",
  whatBody:
    "Un link monouso è un modo più sicuro di consegnare informazioni che non dovrebbero restare disponibili a tempo indefinito nei canali di comunicazione abituali. Metti una password, una chiave API, un codice di recupero, un messaggio privato, un documento sensibile o una credenziale temporanea dietro un URL cifrato. Il destinatario apre il link per recuperare e decifrare il contenuto nel browser. PrivateNote cifra il contenuto nel browser prima del caricamento, così il server riceve dati cifrati, non testo in chiaro. Tu scegli quanto resta disponibile il link non aperto e quante volte può essere aperto. È una consegna sicura, non un posto in cui conservare segreti in modo permanente.",
  whatLearnMore: "Come funzionano i link segreti monouso",
  stepsHeading: "Come creare un link monouso",
  step1Title: "Aggiungi il contenuto",
  step1Body: "Scrivi un messaggio privato, una password o allega un file.",
  step2Title: "Imposta l’accesso",
  step2Body: "Scegli la scadenza, quante volte il link può essere aperto e, se vuoi, una protezione con password.",
  step3Title: "Invia il link",
  step3Body: "PrivateNote cifra il contenuto nel browser e restituisce un link da inviare sul canale che usi già.",
  useHeading: "Cosa puoi condividere con PrivateNote",
  usePasswordsTitle: "Password e credenziali",
  usePasswordsBody:
    "Condividi password e credenziali temporanee senza lasciare il testo in chiaro in modo permanente in email o chat.",
  usePasswordsLink: "Come condividere una password in modo sicuro",
  useApiTitle: "Chiavi API",
  useApiBody:
    "Condividi chiavi API, token e segreti di webhook senza lasciarli nella cronologia della chat o nei ticket.",
  useApiLink: "Come condividere una chiave API in modo sicuro",
  useMessagesTitle: "Messaggi privati",
  useMessagesBody:
    "Per informazioni che, una volta lette, non dovrebbero restare ricercabili a tempo indefinito in email o chat.",
  useMessagesLink: "Inviare un messaggio segreto senza account",
  useFilesTitle: "File e documenti",
  useFilesBody:
    "Per file sensibili quando vuoi una consegna cifrata e una disponibilità limitata, non una cartella condivisa permanente.",
  useFilesLink: "Trasferimento file sicuro",
  persistHeading: "Perché usare un link monouso?",
  persistBody:
    "Inviare una password via email, Slack, Teams, SMS o un altro servizio di messaggistica può lasciare una copia nella cronologia, sui dispositivi sincronizzati, nei backup, nelle notifiche e negli archivi ricercabili. La cifratura protegge il trasferimento. La scadenza riduce per quanto tempo resta disponibile l’originale.",
  handoffHeading: "Pensato per una consegna sicura",
  handoffBody:
    "PrivateNote cifra messaggi e file nel browser prima del caricamento. Il server riceve dati cifrati, non il contenuto leggibile. La decifratura avviene nel browser del destinatario.",
  handoffEncryptionLink: "Come funziona la cifratura",
  handoffHowItWorksLink: "PrivateNote nel dettaglio",
  limitsHeading: "Cosa un link monouso non può impedire",
  limitsBody:
    "Dopo l’apertura, una persona autorizzata può comunque copiare, salvare o fotografare le informazioni. PrivateNote protegge la consegna e limita per quanto tempo resta disponibile il link originale. Non elimina le copie già salvate.",
  faqHeading: "Domande frequenti",
  faqs: [
    {
      question: "Che cos’è un link monouso?",
      answer:
        "Un link monouso serve a condividere informazioni riservate in modo temporaneo. Invece di inviare una password, un messaggio o un file direttamente via email o chat, condividi un link cifrato con durata e accessi limitati. PrivateNote cifra il contenuto nel browser, così il segreto originale non resta a tempo indefinito nella cronologia.",
    },
    {
      question: "Come creo un link monouso?",
      answer:
        "Usa il modulo in cima a questa pagina. Aggiungi un messaggio, una password o un file, scegli quanto deve restare disponibile il link non aperto e quante volte può essere aperto, poi crealo. PrivateNote cifra il contenuto nel browser e restituisce un URL da inviare sul canale che usi già.",
    },
    {
      question: "Posso inviare una password con un link monouso?",
      answer:
        "Sì. Metti la password nella nota e invia il link cifrato al posto della password. Puoi aggiungere una passphrase separata per una protezione extra. Per gli account importanti, ruota la credenziale dopo che il destinatario l’ha usata. Un link monouso è una consegna, non un gestore di password.",
    },
    {
      question: "Posso inviare un file con un link monouso?",
      answer:
        "Sì. Allega un file o una cartella alla stessa nota cifrata. I file vengono cifrati nel browser prima del caricamento. Per inviare allegati serve un account PrivateNote gratuito, così si possono applicare i limiti di archiviazione. Il destinatario non ha comunque bisogno di un account per aprire il link.",
    },
    {
      question: "Il destinatario ha bisogno di un account PrivateNote?",
      answer:
        "No. Il destinatario apre il link nel browser e decifra il contenuto in locale. Non deve accedere. Puoi anche creare una nota di testo semplice senza account. Per inviare file serve un account gratuito, per prevenire abusi e applicare i limiti di archiviazione.",
    },
    {
      question: "Cosa succede dopo che qualcuno apre il link?",
      answer:
        "Il browser del destinatario decifra il contenuto in locale. Le note gratuite si leggono una sola volta: dopo quell’apertura, la nota originale viene distrutta. Starter può consentire fino a tre aperture e Business fino a dieci. Se nessuno apre il link, scade dopo il periodo che hai scelto — al massimo tre giorni nel piano gratuito. I file allegati restano visibili per un intervallo limitato dopo la prima apertura.",
    },
    {
      question: "Qualcuno può fare uno screenshot di un PrivateNote?",
      answer:
        "Sì. Chi può vedere il contenuto rivelato può farne uno screenshot, fotografarlo o copiarlo. PrivateNote non pretende di impedirlo. Controlla il trasferimento cifrato e per quanto tempo resta disponibile il link originale.",
    },
    {
      question: "Per quanto tempo può restare attivo un link PrivateNote?",
      answer:
        "Se la nota non viene mai aperta, i link gratuiti scadono al massimo dopo tre giorni. Starter consente fino a 15 giorni e Business fino a 30. Dopo l’apertura, le note gratuite si leggono una sola volta. Starter può consentire fino a tre aperture e Business fino a dieci. Scegli la durata più breve che consenta comunque di completare la consegna.",
    },
  ],
  articleLearnMore: "Scopri di più su come funzionano i link monouso e come restano protetti",
  backToCreate: "Pronto? Crea un link monouso ↑",
};
