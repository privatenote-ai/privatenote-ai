import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionNl: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "Een iPhone en Android-telefoon met slotpictogrammen in berichtbubbels, verbonden door een centraal hangslot dat end-to-end versleutelde RCS voorstelt",
  heroCaption:
    "Cross-platform RCS haalt eindelijk zijn achterstand in: dezelfde end-to-end versleutelingsgarantie, of de bubbel nu blauw of groen is.",
  intro: [
    "Jarenlang was een van de grootste frustraties in mobiel berichtenverkeer niet het gebrek aan functies, maar het gebrek aan consistente privacy.",
    "Apple-gebruikers genoten van end-to-end versleutelde gesprekken via iMessage, terwijl Android-gebruikers konden profiteren van versleuteling bij gebruik van Google Messages met andere Android-toestellen. Berichten tussen Android en iPhone hadden nooit dezelfde bescherming. Cross-platform gesprekken leunden op Rich Communication Services (RCS), maar zonder interoperabele end-to-end versleuteling.",
    "Dat verandert eindelijk.",
    "Google heeft onlangs aangekondigd dat end-to-end versleuteld RCS-berichtenverkeer tussen Android en iPhone begint te worden uitgerold, na de publicatie van het nieuwste GSMA RCS Universal Profile, dat het Messaging Layer Security (MLS)-protocol integreert. Terwijl de ondersteuning zich uitbreidt over apparaten en berichtenapps, krijgen miljarden gebruikers sterkere privacy voor alledaagse gesprekken.",
    "Dit is een belangrijke mijlpaal voor digitale communicatie. Het is ook een goede gelegenheid om te begrijpen wat [end-to-end versleuteling](blog:what-is-end-to-end-encryption) precies beschermt — en wat niet.",
  ],
  sections: [
    {
      title: "Een betere standaard voor alledaags berichtenverkeer",
      paragraphs: [
        "De overgang van sms naar RCS heeft tekstberichten gemoderniseerd met functies zoals hoogwaardig fotodelen, typindicatoren, leesbevestigingen en rijkere groepsgesprekken. De beveiliging bleef echter inconsistent, afhankelijk van welke apparaten betrokken waren.",
        "Tot nu toe konden Android-gebruikers die met andere Android-gebruikers berichten uitwisselden, genieten van end-to-end versleuteling via Google Messages, terwijl iPhone-gebruikers dezelfde bescherming hadden binnen iMessage. Berichten tussen Android en iPhone misten echter interoperabele end-to-end versleuteling.",
        "De bijgewerkte RCS-standaard verandert dat. Naarmate ondersteuning wordt uitgerold, kunnen gebruikers op beide platforms eindelijk profiteren van dezelfde fundamentele privacygaranties, ongeacht welke telefoon ze hebben.",
        "Voor een communicatietechnologie die door miljarden mensen wordt gebruikt, is dit een belangrijke stap voorwaarts.",
      ],
    },
    {
      title: "Wat end-to-end versleuteling écht betekent",
      paragraphs: [
        "End-to-end versleuteling betekent dat een bericht wordt versleuteld voordat het het apparaat van de verzender verlaat, en alleen op het apparaat van de ontvanger kan worden ontsleuteld.",
        "In tegenstelling tot traditionele transportversleuteling, waarbij een serviceprovider mogelijk toegang heeft tot berichten zodra ze de servers bereiken, zorgt end-to-end versleuteling ervoor dat alleen de communicerende apparaten de sleutels bezitten die nodig zijn om het gesprek te lezen. De berichtenservice vervoert versleutelde gegevens, maar kan de inhoud niet ontsleutelen.",
        "Voor gebruikers is het voordeel eenvoudig: je gesprek blijft privé tussen jou en de persoon met wie je praat.",
        "Correct geïmplementeerde end-to-end versleuteling beschermt tegen veel voorkomende dreigingen. Iemand die een openbaar wifi-netwerk afluistert, kan je berichten niet zomaar lezen, internetproviders kunnen de inhoud niet inspecteren, en een inbreuk op de servers van de berichtenprovider zou versleutelde gegevens blootleggen in plaats van leesbare gesprekken.",
        "Voor alledaagse communicatie is dit een aanzienlijke verbetering van de privacy. Voor een diepgaandere technische definitie, zie onze gids over [wat end-to-end versleuteling betekent](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Versleuteling heeft grenzen",
      paragraphs: [
        "Hoe belangrijk end-to-end versleuteling ook is, ze wordt vaak verkeerd begrepen.",
        "Versleuteling beschermt berichten terwijl ze worden verzonden en terwijl ze door de berichtenprovider worden opgeslagen. Ze bepaalt niet wat er gebeurt nadat het bericht is afgeleverd.",
        "Zodra een bericht op de telefoon van de ontvanger is ontsleuteld, wordt het weer gewone informatie. De ontvanger kan het voor onbepaalde tijd bewaren, doorsturen naar iemand anders, de inhoud kopiëren naar een andere app, of gewoon een screenshot maken. Afhankelijk van het berichtenplatform kunnen gesprekken ook worden gesynchroniseerd over meerdere apparaten of opgenomen in cloudback-ups.",
        "Met andere woorden: end-to-end versleuteling beveiligt de aflevering — het garandeert niet dat informatie verdwijnt nadat ze is gelezen.",
      ],
      callout:
        "Dit onderscheid wordt steeds belangrijker wanneer de gedeelde informatie bijzonder gevoelig is — wachtwoorden, herstelcodes, API-sleutels en andere inloggegevens die niet voor altijd in een doorzoekbare chatgeschiedenis zouden moeten blijven staan.",
    },
    {
      title: "Niet elk geheim hoort in de chatgeschiedenis",
      paragraphs: [
        "De meeste gesprekken verdienen het om bewaard te blijven. Berichten met familie, gesprekken met vrienden of werkgerelateerde conversaties worden vaak een nuttig archief dat mensen later willen terugvinden.",
        "Gevoelige inloggegevens zijn anders.",
        "Stel je voor dat je een tijdelijk beheerderswachtwoord naar een collega stuurt. Het wachtwoord reist veilig over het internet dankzij end-to-end versleuteling, maar zes maanden later kan het nog altijd in een doorzoekbare gespreksgeschiedenis staan. Datzelfde geldt voor API-sleutels, herstelcodes, cryptocurrency-seedphrases, vertrouwelijke klantinformatie of tijdelijke inloggegevens.",
        "Bij veel echte beveiligingsincidenten is het probleem niet dat het geheim tijdens de overdracht werd onderschept. Het probleem is dat het lang na het moment waarop het vergeten had moeten worden, nog steeds opgeslagen bleef.",
        "Nu berichtenverkeer steeds veiliger wordt, verschuift de aandacht geleidelijk naar een andere uitdaging: het verminderen van onnodige persistentie. Daarom horen bepaalde [geheimen nooit via chat verstuurd te worden](blog:secrets-never-send-in-chat) — versleuteld of niet.",
      ],
    },
    {
      title: "Wanneer eenmalige links meer zin hebben",
      paragraphs: [
        "Voor informatie die maar één keer gedeeld hoeft te worden, is het niet altijd ideaal om die binnen een permanent gesprek te laten staan.",
        "Een steeds gebruikelijker alternatief is het delen van gevoelige informatie via [versleutelde eenmalige links](blog:one-time-secret-links) die automatisch verlopen of ontoegankelijk worden nadat ze zijn bekeken. In plaats van het geheim direct in een lopend gesprek te plaatsen, opent de ontvanger een speciale link, haalt de informatie op, en de link verloopt uiteindelijk — of kan in sommige gevallen slechts één keer worden geopend.",
        "Deze aanpak vervangt versleuteld berichtenverkeer niet. Ze vult het juist aan door een ander probleem aan te pakken.",
        "Berichtenapps zijn ontworpen om gesprekken te bewaren. Eenmalige links zijn ontworpen om de langdurige blootstelling van informatie te minimaliseren die idealiter niet voor onbepaalde tijd opgeslagen zou moeten blijven.",
        "Of je nu een tijdelijk wachtwoord, een API-token, een softwarelicentiesleutel of een andere vertrouwelijke waarde deelt, het beperken van hoe lang die informatie bestaat kan het risico op latere onbedoelde openbaarmaking aanzienlijk verminderen.",
      ],
    },
    {
      title: "Privacy is meer dan versleuteling",
      paragraphs: [
        "De uitrol van interoperabel end-to-end versleuteld RCS-berichtenverkeer is echt goed nieuws. Voor het eerst kunnen Android- en iPhone-gebruikers hetzelfde beschermingsniveau genieten, ongeacht welk ecosysteem ze gebruiken.",
        "Het is ook een herinnering dat privacy over meer gaat dan versleuteling alleen.",
        "Informatie beschermen terwijl ze over het internet reist, is essentieel, maar het is ook belangrijk om na te denken over wat er daarna gebeurt. Sommige informatie verdient het om jarenlang beschikbaar te blijven. Andere informatie — vooral wachtwoorden, herstelcodes en tijdelijke inloggegevens — is vaak veiliger wanneer ze slechts zolang bestaat als nodig is.",
        "Moderne berichtenapps en eenmalige geheimdeeldiensten dienen verschillende doelen. Geen van beide vervangt de ander; ze behandelen juist verschillende aspecten van veilige communicatie. Welke aanpak het juiste is, hangt af van wat je deelt en hoe lang het moet blijven bestaan.",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Vervangt dit sms?",
          answer:
            "Nee. Traditionele sms-berichten blijven onversleuteld. De nieuwe bescherming geldt alleen voor compatibele RCS-gesprekken, wanneer zowel de apparaten als de berichtenapps de nieuwste end-to-end versleutelde RCS-standaard ondersteunen.",
        },
        {
          question: "Kunnen Google of Apple versleutelde RCS-berichten lezen?",
          answer:
            "End-to-end versleuteling is zo ontworpen dat alleen de communicerende apparaten de sleutels bezitten die nodig zijn om berichten te ontsleutelen. De providers vervoeren versleutelde gegevens, maar kunnen niet bij de leesbare inhoud van je gesprekken.",
        },
        {
          question: "Kan iemand nog steeds een screenshot maken?",
          answer:
            "Ja. Zodra een bericht op het apparaat van de ontvanger is ontsleuteld, kan die persoon nog steeds screenshots maken, de inhoud kopiëren of doorsturen naar anderen. End-to-end versleuteling beschermt de overdracht van het bericht, niet wat de ontvanger er daarna mee doet.",
        },
        {
          question: "Zijn eenmalige links veiliger dan berichtenapps?",
          answer:
            "Niet noodzakelijk — ze lossen een ander probleem op. End-to-end versleuteld berichtenverkeer is uitstekend voor lopende gesprekken. [Eenmalige of verlopende links](blog:one-time-secret-links) zijn vaak beter geschikt voor het delen van gevoelige informatie die niet voor onbepaalde tijd in een chatgeschiedenis zou moeten blijven staan.",
        },
      ],
    },
  ],
  referencesTitle: "Meer lezen",
  references: [
    {
      label:
        "Android- en iPhone-gebruikers kunnen nu genieten van end-to-end versleuteld RCS-berichtenverkeer (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Deel geheimen die niet in chat horen te leven",
  ctaBody:
    "Wanneer je iemand een wachtwoord, API-sleutel of herstelcode moet geven, stuur dan een clientside versleutelde eenmalige notitie in plaats van deze in Messages te plakken. Stel een korte vervaltijd of burn-after-read in, zodat het geheim niet blijft hangen in een doorzoekbare geschiedenis.",
  ctaButton: "Privénotitie maken",
};
