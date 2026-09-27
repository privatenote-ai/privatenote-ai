import { BarChart3, Lock, Zap } from "lucide-react";
import type { PasswordPostCopy } from "./passwordGeneration.types";

export const passwordGenerationHr: PasswordPostCopy = {
  intro:
    "Stvaranje jake lozinke više je od kombiniranja nasumičnih znakova. Na PrivateNote.ai naš generator temelji se na tri načela:",
  lead: "Evo kako svaka komponenta pomaže zaštititi vaše račune.",
  cards: [
    { icon: Lock, title: "Kriptografska sigurnost", body: "Ista klasa sigurne slučajnosti koja se koristi za ključeve i tokene." },
    { icon: Zap, title: "Nepristrana slučajnost", body: "Svaki znak ima jednaku šansu biti odabran." },
    { icon: BarChart3, title: "Inteligentna analiza snage", body: "Napredna analiza izvan jednostavnih provjera duljine." },
  ],
  sections: [
    {
      icon: Lock,
      title: "Crypto Web API",
      paragraphs: [
        "Generator koristi Web Crypto API za dobivanje kriptografski sigurnih slučajnih vrijednosti prikladnih za sigurnosno kritičan rad.",
        "Slučajnost potječe od operacijskog sustava i dizajnirana je tako da se buduće vrijednosti u praksi ne mogu predvidjeti bez pristupa unutarnjem stanju.",
        "Sva generacija odvija se u vašem pregledniku. Lozinka nikad ne napušta vaš uređaj, pa se ne može zapisati u log, presresti niti procuriti s naših poslužitelja.",
      ],
      notes: [
        {
          title: "Zašto je to važno",
          body: "Generiranje lozinki na poslužitelju stvara dodatnu izloženost kroz mrežni prijenos i logove. Lokalno generiranje u potpunosti izbjegava te rizike.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Nepristrana slučajnost",
      paragraphs: [
        "Koristimo rejection sampling kako bi svaki znak imao jednaku vjerojatnost pojave. Time uklanjamo suptilnu pristranost zbog koje bi neki znakovi bili češći.",
        "Jednostavni modulo odabir može biti pristran kad raspon slučajnih brojeva nije ravnomjerno djeljiv veličinom skupa znakova. Rejection sampling odbacuje nepravedne vrijednosti i ponovno vuče.",
        "To čini lozinke težim za predviđanje jer napadači ne mogu iskoristiti obrasce odabira znakova.",
      ],
    },
    {
      icon: BarChart3,
      title: "Pametna analiza snage",
      paragraphs: [
        "Dobar mjerač mora ići dalje od duljine i pravila simbola. Predvidivi nizovi mogu izgledati složeno, a ipak biti slabi.",
        "Koristimo zxcvbn-stil analizu za uobičajene obrasce, riječnik riječi, sekvence, ponavljanja, entropiju i realistične procjene vremena probijanja.",
        "Tako dobivate realističniju sliku snage lozinke nego s jednostavnom kontrolnom listom.",
      ],
      bullets: [
        { title: "Uobičajeni obrasci", body: "putanje tipkovnice, sekvence i ponavljanja" },
        { title: "Rječnički napadi", body: "uobičajene riječi, imena i varijante iz curenja podataka" },
        { title: "Entropija", body: "koliko je lozinke stvarno nepredvidivo" },
        { title: "Vrijeme probijanja", body: "koliko bi napadaču realistično trebalo" },
      ],
    },
  ],
  bestPracticesTitle: "Najbolje prakse za lozinke",
  bestPractices: [
    { title: "Koristite jedinstvene lozinke", body: "Nikad ne ponavljajte lozinke između računa." },
    { title: "Duže je bolje", body: "Ciljajte na najmanje 16 znakova; više za važne račune." },
    { title: "Koristite upravitelj lozinki", body: "Sigurno pohranite generirane lozinke kako ih ne biste morali pamtiti." },
    { title: "Uključite dvofaktorsku autentifikaciju", body: "Čak i jake lozinke imaju koristi od dodatnog sloja." },
    { title: "Ne dijelite lozinke", body: "Nikad ne dijelite lozinke s osobama koje tvrde da su podrška." },
  ],
};
