import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteNl: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop op een bureau met een scherm voor het maken van een privénotitie, burn-after-reading en vervaldatum, naast een afgesloten leren notitieboek",
  intro: [
    "Je wilt iets gevoeligs schrijven—een [wachtwoord](app:password-generator), een herstelcode, een vertrouwelijk bericht of een persoonlijke notitie—en het privé houden. Misschien zocht je op «how to make a note private» en vond je algemeen advies over het vergrendelen van een app, het verbergen van een lokale map of het inschakelen van een privacy-instelling op je apparaat.",
    "Die stappen helpen bij alledaagse privacy, tegen nieuwsgierige blikken. Ze lossen **niet** het moeilijkere probleem op: een notitie delen met iemand anders zonder een permanente, doorzoekbare kopie achter te laten op de server van een derde partij.",
    "Een echt privénotitie vereist drie afzonderlijke pijlers: **versleuteling vóór upload**, **strakke toegangscontrole** en **geplande efemeriteit**—een mechanisme om te verdwijnen. Zo bereik je dat in de praktijk.",
  ],
  sections: [
    {
      title: "Wat «privé» echt betekent",
      paragraphs: [
        "In alledaagse apps betekent «privé» meestal verborgen voor andere mensen die je apparaat oppakken, beschermd door je telefooncode of achter een premium-abonnement vergrendeld. Dat is zeer nuttig—maar niet hetzelfde als cryptografische privacy.",
        "Wanneer je gevoelige informatie via het web deelt, is de echte vraag: **wie kan de notitie lezen nadat deze uit je handen is?**",
        "Kan de dienstverlener het lezen? Kan een onbevoegde partij met toegang tot een cloudback-up het lezen? Kan een toekomstige teamgenoot oude chatgeschiedenissen doorzoeken en het maanden later vinden?",
        "Een privénotitie, in de strikte beveiligingszin, is er een waarbij alleen de beoogde ontvanger de inhoud kan lezen, de hostingdienst nooit de onderliggende platte tekst ziet en de notitie niet voor altijd online blijft.",
      ],
    },
    {
      title: "Waarom gewone notitie-apps tekortschieten",
      paragraphs: [
        "Apple Notes, Google Keep, Notion en Evernote zijn uitstekende tools voor persoonlijke organisatie, maar ze zijn over het algemeen de verkeerde keuze voor het verspreiden van eenmalige geheimen vanwege verschillende inherente eigenschappen:",
      ],
      bullets: [
        "**Synchronisatie en back-ups** — Je notitie wordt stilletjes gekopieerd naar meerdere apparaten, cloudopslagaccounts en langetermijnarchieven die je niet rechtstreeks beheert.",
        "**Zoeken en delen** — Per ongeluk openbaar delen, brede workspace-zoekopdrachten of één gecompromitteerd account kunnen historische notities maanden later blootleggen.",
        "**Toegang door aanbieder** — Tenzij de app expliciet end-to-end-versleuteling voor die specifieke notitie biedt, behoudt de aanbieder de technische mogelijkheid om je inhoud op zijn servers te lezen.",
        "**Geen vernietiging na lezen** — De meeste organisatie-apps zijn structureel ontworpen om informatie onbeperkt op te slaan, niet om het na één keer lezen te wissen.",
      ],
      callout:
        "Voor langdurig persoonlijk dagboekschrijven zijn standaard notitie-apps ideaal. Voor wachtwoorden, herstelcodes en vertrouwelijke overdrachten heb je een efemere tool nodig die is gebouwd voor [eenmalige geheimenlevering](blog:one-time-secret-links)—niet voor permanente opslag.",
    },
    {
      title: "Hoe je een privénotitie maakt: stap voor stap",
      paragraphs: [
        "Je hoeft geen account te registreren om een veilige, eenmalige privénotitie te versturen. De gestructureerde workflow hieronder beschrijft wat browserversleutelde diensten veilig zijn ontworpen uit te voeren.",
      ],
      flowDiagramCaption: "Workflow voor privénotities in één oogopslag",
      flowSteps: [
        {
          step: "Stap 1",
          title: "Schrijf het bericht in je browser",
          body: "Open [PrivateNote](app:home) en typ je bericht direct. Al in een ander tabblad? De [Chrome-extensie](chrome:extension) versleutelt geselecteerde tekst ter plekke—dezelfde client-side flow, zonder eerst de site te openen. Vermijd het plakken van het ruwe geheim in standaard e-mailclients of onversleutelde tekstthreads van tevoren. Je kunt ook [Write with Private AI](app:home) gebruiken om lokaal op je apparaat te schrijven vóór de versleuteling.",
        },
        {
          step: "Stap 2",
          title: "Configureer je efemere privacy-instellingen",
          body: "Stel een vervalvenster in dat bij de taak past. Schakel vernietiging na lezen in als de notitie volledig moet verdwijnen na de eerste succesvolle opening, en voeg optioneel een wachtwoordzin toe voor zeer gevoelige inhoud.",
        },
        {
          step: "Stap 3",
          title: "Laat de browser lokale versleuteling uitvoeren",
          body: "Wanneer je op aanmaken klikt, gebeurt de versleuteling volledig aan de clientzijde. Alleen versleutelde tekst wordt geüpload. De ontsleutelingssleutel blijft ingebed in het URL-fragment—het deel na `#`—dat moderne webbrowsers niet doorsturen naar hostingwebservers.",
        },
        {
          step: "Stap 4",
          title: "Isoleer je deelkanalen",
          body: "Stuur de gegenereerde beveiligde link naar je ontvanger via je voorkeurskanaal. Als je een handmatig wachtwoord hebt ingesteld, deel dat out-of-band—via een telefoongesprek, Signal of veilig persoonlijk.",
        },
        {
          step: "Stap 5",
          title: "Bevestig levering en wis lokale status",
          body: "Gebruik optionele leveringsmeldingen om te verifiëren wanneer de notitie succesvol is geopend of verlopen. Eenmaal gelezen blijft er geen platte-tekstkopie achter in je outbox of historische chatlogs.",
        },
      ],
    },
    {
      title: "Privacy-instellingen die de moeite waard zijn",
      paragraphs: [
        "Kleine architecturale aanpassingen leveren enorme beveiligingswinst op. Maximaliseer je verdediging bij het maken van een efemere notitie met deze configuraties:",
      ],
      bullets: [
        "**Vernietiging na lezen** — De gouden standaard voor wachtwoorden en inloggegevens. De onderliggende versleutelde tekst wordt van de server gewist op het moment dat deze één keer succesvol is gelezen.",
        "**Korte vervalvensters** — Als je ontvanger de gegevens niet direct hoeft te openen, beperk het blootstellingsvenster tot uren of dagen—nooit onbeperkt.",
        "**Gelaagde wachtwoorden** — Voegt een cruciale tweede factor toe. Een aanvaller zou zowel het linktransportkanaal moeten compromitteren als het aparte wachtwoord moeten verkrijgen om de inhoud te lezen.",
      ],
    },
    {
      title: "Wat je niet in een webgebaseerde privénotitie zet",
      paragraphs: [
        "Browserversleutelde links zijn uitstekend voor tijdelijke of vervangbare geheimen—zoals Wi‑Fi-inloggegevens, API-tokens en zakelijke berichten. Ze hebben grenzen.",
      ],
      callout:
        "**Kritieke veiligheidsregel:** Typ nooit een cryptocurrency seed phrase, een master-back-up van een hardware wallet of een root private key in op een website. Onvervangbare master-assets rechtvaardigen lokale terminalgebaseerde versleuteling met age of OpenSSL vóór verzending. Voor die architectuur, lees [crypto seed phrases en eenmalige links](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Wanneer een privénotitie het juiste hulpmiddel is",
      paragraphs: [
        "Kies een speciale privénotitie in plaats van standaard e-mail of chat wanneer je gevoelige informatie overdraagt:",
      ],
      table: [
        {
          dataType: "Inloggegevens",
          scenario:
            "Een [wachtwoord of herstelcode](blog:how-we-generate-passwords) doorgeven aan een vertrouwd familielid of collega.",
        },
        {
          dataType: "Toegangssleutels",
          scenario:
            "Een [API-sleutel of webhook-ondertekeningsgeheim](blog:how-to-share-api-key-securely) verspreiden tijdens developer-onboarding.",
        },
        {
          dataType: "Fysieke toegang",
          scenario:
            "Tijdelijke deurcodes, alarm-PIN's of gast-Wi‑Fi-inloggegevens delen.",
        },
        {
          dataType: "Zakelijke communicatie",
          scenario:
            "Een vertrouwelijk zakelijk bericht versturen dat niet geïndexeerd mag worden door [bedrijfschat- of e-mailarchieven](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Onze filosofie bij PrivateNote",
      paragraphs: [
        "We hebben PrivateNote ontworpen om het vertrouwensevenwicht terug naar de gebruiker te verschuiven. Door cryptografische bewerkingen volledig in je browser uit te voeren voordat de payload onze infrastructuur bereikt, blijven onze servers structureel blind voor je platte-tekstgeheimen.",
        "We geloven ook in duidelijke transparantie over productbeperkingen. Als je een tijdelijk toegangstoken naar een collega stuurt, is een versleutelde eenmalige link een uitstekend hulpmiddel. Als het om je levensbesparingen gaat, versleutel dan eerst lokaal op een offline machine.",
        "Beveiliging gaat niet over het vinden van één magisch alles-in-één-hulpmiddel. Het gaat over het afstemmen van je workflow op de waarde van wat je beschermt. Voor het technische model achter browserversleuteling, lees [hoe PrivateNote werkt](app:how-it-works) en [wat client-side end-to-end-versleuteling betekent](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Gegevenstype",
    scenario: "Ideaal delescenario",
  },
  closingTitle: "Maak nu een privénotitie",
  closingBody: [
    "Geen account vereist. Schrijf je notitie, configureer je privacy-instellingen en deel binnen een minuut een beveiligde link.",
  ],
  fileSharingNote:
    "Moet je ook documenten delen? [Veilige bestandsoverdracht](app:secure-file-transfer) gebruikt hetzelfde browser-side versleutelingsmodel. Verzenden vereist een gratis account; ontvangers kunnen links openen zonder zich aan te melden.",
  chromeExtensionNote:
    "Gebruik je PrivateNote vaak? De [Chrome-extensie](chrome:extension) voegt versleutelen-en-delen toe aan je werkbalk of contextmenu—handig wanneer een wachtwoord of API-sleutel midden in een gesprek opduikt.",
  tagline: "Eerst versleutelen. Deel een link. Laat verlopen.",
  relatedReading: "Gerelateerde artikelen",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Vernietiging-na-lezen-links, het URL-fragment en waarom efemeriteit e-mail of Slack verslaat voor eenmalige geheimen.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Waarom e-mail langdurige kopieën van geheimen maakt—en wat je in plaats daarvan gebruikt voor vertrouwelijke overdrachten.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Een veiliger workflow voor API-sleutels: beperk de scope, versleutel lokaal, stuur de link—niet het ruwe geheim.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Wat client-side E2EE echt betekent en hoe het verschilt van alleen transportbeveiliging.",
    },
  ],
};
