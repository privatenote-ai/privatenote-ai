import { BarChart3, Lock, Zap } from "lucide-react";
import type { PasswordPostCopy } from "./passwordGeneration.types";

export const passwordGenerationSr: PasswordPostCopy = {
  intro:
    "Stvaranje jake lozinke više je od kombinovanja nasumičnih znakova. Na PrivateNote.ai naš generator zasniva se na tri načela:",
  lead: "Evo kako svaka komponenta pomaže da zaštitite svoje naloge.",
  cards: [
    { icon: Lock, title: "Kriptografska bezbednost", body: "Ista klasa sigurne slučajnosti koja se koristi za ključeve i tokene." },
    { icon: Zap, title: "Nepristrana slučajnost", body: "Svaki znak ima jednaku šansu da bude odabran." },
    { icon: BarChart3, title: "Inteligentna analiza snage", body: "Napredna analiza van jednostavnih provera dužine." },
  ],
  sections: [
    {
      icon: Lock,
      title: "Crypto Web API",
      paragraphs: [
        "Generator koristi Web Crypto API za dobijanje kriptografski sigurnih slučajnih vrednosti pogodnih za bezbednosno kritičan rad.",
        "Slučajnost potiče od operativnog sistema i dizajnirana je tako da se buduće vrednosti u praksi ne mogu predvideti bez pristupa unutrašnjem stanju.",
        "Sva generacija odvija se u vašem pregledaču. Lozinka nikad ne napušta vaš uređaj, pa se ne može zapisati u log, presresti niti procuriti sa naših servera.",
      ],
      notes: [
        {
          title: "Zašto je to važno",
          body: "Generisanje lozinki na serveru stvara dodatnu izloženost kroz mrežni prenos i logove. Lokalno generisanje u potpunosti izbegava te rizike.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Nepristrana slučajnost",
      paragraphs: [
        "Koristimo rejection sampling kako bi svaki znak imao jednaku verovatnoću pojave. Time uklanjamo suptilnu pristranost zbog koje bi neki znakovi bili češći.",
        "Jednostavan modulo odabir može biti pristran kada opseg slučajnih brojeva nije ravnomerno deljiv veličinom skupa znakova. Rejection sampling odbacuje nepravedne vrednosti i ponovo vuče.",
        "To čini lozinke težim za predviđanje jer napadači ne mogu iskoristiti obrasce odabira znakova.",
      ],
    },
    {
      icon: BarChart3,
      title: "Pametna analiza snage",
      paragraphs: [
        "Dobar merač mora ići dalje od dužine i pravila simbola. Predvidivi nizovi mogu izgledati složeno, a ipak biti slabi.",
        "Koristimo zxcvbn-stil analizu za uobičajene obrasce, rečnik reči, sekvence, ponavljanja, entropiju i realistične procene vremena probijanja.",
        "Tako dobijate realističniju sliku snage lozinke nego sa jednostavnom kontrolnom listom.",
      ],
      bullets: [
        { title: "Uobičajeni obrasci", body: "putanje tastature, sekvence i ponavljanja" },
        { title: "Rečnički napadi", body: "uobičajene reči, imena i varijante iz curenja podataka" },
        { title: "Entropija", body: "koliko je lozinke stvarno nepredvidivo" },
        { title: "Vreme probijanja", body: "koliko bi napadaču realistično trebalo" },
      ],
    },
  ],
  bestPracticesTitle: "Najbolje prakse za lozinke",
  bestPractices: [
    { title: "Koristite jedinstvene lozinke", body: "Nikad ne ponavljajte lozinke između naloga." },
    { title: "Duže je bolje", body: "Ciljajte na najmanje 16 znakova; više za važne naloge." },
    { title: "Koristite menadžer lozinki", body: "Bezbedno čuvajte generisane lozinke kako ih ne biste morali pamtiti." },
    { title: "Uključite dvofaktorsku autentifikaciju", body: "Čak i jake lozinke imaju koristi od dodatnog sloja." },
    { title: "Ne delite lozinke", body: "Nikad ne delite lozinke sa osobama koje tvrde da su podrška." },
  ],
};
