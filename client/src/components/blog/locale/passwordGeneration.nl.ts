import { BarChart3, Lock, Zap } from "lucide-react";
import type { PasswordPostCopy } from "./passwordGeneration.types";

export const passwordGenerationNl: PasswordPostCopy = {
  intro:
    "Een sterk wachtwoord is meer dan willekeurige tekens combineren. Bij PrivateNote.ai is onze generator gebouwd rond drie principes:",
  lead: "Zo draagt elk onderdeel bij aan de beveiliging van je accounts.",
  cards: [
    { icon: Lock, title: "Cryptografische veiligheid", body: "Dezelfde klasse veilige willekeur die voor sleutels en tokens wordt gebruikt." },
    { icon: Zap, title: "Onbevooroordeelde willekeur", body: "Elk teken heeft een gelijke kans om geselecteerd te worden." },
    { icon: BarChart3, title: "Intelligente sterkte-analyse", body: "Geavanceerde analyse die verder gaat dan simpele lengtecontroles." },
  ],
  sections: [
    {
      icon: Lock,
      title: "Crypto Web API",
      paragraphs: [
        "De generator gebruikt de Web Crypto API om cryptografisch veilige willekeurige waarden te verkrijgen die geschikt zijn voor security-kritisch werk.",
        "De willekeur wordt door het besturingssysteem geseed en is zo ontworpen dat toekomstige waarden in de praktijk niet voorspelbaar zijn zonder toegang tot interne staat.",
        "Alle generatie gebeurt in je browser. Je wachtwoord verlaat je apparaat nooit, dus het kan niet worden gelogd, onderschept of gelekt vanaf onze servers.",
      ],
      notes: [
        {
          title: "Waarom dit ertoe doet",
          body: "Server-side wachtwoordgeneratie creëert extra blootstelling via netwerkverkeer en logs. Lokale generatie vermijdt die risico's volledig.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Onbevooroordeelde willekeur",
      paragraphs: [
        "We gebruiken rejection sampling zodat elk teken dezelfde kans heeft om te verschijnen. Dat verwijdert subtiele vertekening waardoor sommige tekens vaker voorkomen.",
        "Eenvoudige modulo-selectie kan bevooroordeeld zijn wanneer het bereik van willekeurige getallen niet gelijkmatig deelbaar is door de grootte van de tekenset. Rejection sampling gooit oneerlijke waarden weg en trekt opnieuw.",
        "Dat maakt wachtwoorden moeilijker te voorspellen omdat aanvallers geen patronen in tekenselectie kunnen misbruiken.",
      ],
    },
    {
      icon: BarChart3,
      title: "Slimme sterkte-analyse",
      paragraphs: [
        "Een goede meter kijkt verder dan lengte en symboolregels. Voorspelbare strings kunnen complex lijken terwijl ze toch zwak zijn.",
        "We gebruiken zxcvbn-stijl analyse voor veelvoorkomende patronen, woordenboekwoorden, reeksen, herhalingen, entropie en realistische crack-time-schattingen.",
        "Dat geeft je een realistischer beeld van wachtwoordsterkte dan een simpele checklist.",
      ],
      bullets: [
        { title: "Veelvoorkomende patronen", body: "toetsenbordpaden, reeksen en herhaalde tekens" },
        { title: "Woordenboekaanvallen", body: "veelvoorkomende woorden, namen en variaties uit datalekken" },
        { title: "Entropie", body: "hoe onvoorspelbaar het wachtwoord echt is" },
        { title: "Crack time", body: "hoe lang een aanvaller realistisch nodig zou hebben" },
      ],
    },
  ],
  bestPracticesTitle: "Best practices voor wachtwoorden",
  bestPractices: [
    { title: "Gebruik unieke wachtwoorden", body: "Hergebruik nooit wachtwoorden tussen accounts." },
    { title: "Langer is beter", body: "Streef naar minstens 16 tekens; meer voor belangrijke accounts." },
    { title: "Gebruik een wachtwoordmanager", body: "Bewaar gegenereerde wachtwoorden veilig zodat je ze niet hoeft te onthouden." },
    { title: "Schakel tweefactorauthenticatie in", body: "Zelfs sterke wachtwoorden profiteren van een extra laag." },
    { title: "Deel geen wachtwoorden", body: "Deel nooit wachtwoorden met iemand die beweert support te zijn." },
  ],
};
