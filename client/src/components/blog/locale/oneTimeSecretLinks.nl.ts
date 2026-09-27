import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksNl: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Een **eenmalige link** is een URL om gevoelige informatie te bezorgen zonder de platte tekst blijvend in e-mail of chatgeschiedenis achter te laten. De ontvanger opent de link, toont het geheim in de browser, en de versleutelde kopie op de server wordt daarna onbeschikbaar volgens de toegangs- en vervalregels.",
    "Dat is nuttig voor wachtwoorden, API-sleutels, herstelcodes, tijdelijke inloggegevens en privéberichten die één keer moeten aankomen en geen blijvend gesprek nodig hebben.",
    "Het probleem is niet altijd onderschepping. Het is **retentie**. Versleuteling beschermt de toegang. Kortstondigheid beperkt hoe lang overbodige kopieën beschikbaar blijven. Een eenmalige link is gebouwd voor een derde taak: de **tijdelijke overdracht**.",
  ],
  earlyCta: {
    body: "Moet u er nu een versturen?",
    linkLabel: "Maak een versleutelde eenmalige link met PrivateNote",
  },
  sections: [
    {
      title: "Wat is een eenmalige link?",
      paragraphs: [
        "Er circuleren meerdere namen voor hetzelfde idee: geheime link, zelfvernietigende notitie, burn-after-reading, verlopende link. Het etiket wisselt. De beveiligingseigenschappen volgen niet automatisch uit de naam.",
        "Een product dat zich «eenmalig geheim» noemt, betekent op zichzelf niet dat versleuteling in de browser plaatsvindt, dat de aanbieder de inhoud niet kan lezen, dat de sleutel van de server wegblijft, dat wissen écht na het lezen volgt, of dat metadata verdwijnt. Dat zijn ontwerpkeuzes. Beoordeel de eigenschappen, niet de slogan.",
        "Een nuttige checklist: waar wordt de platte tekst versleuteld? Ontvangt de server ooit de ontsleutelingssleutel? Wat gebeurt er na de bedoelde raadpleging? Hoe lang blijft een ongebruikte link beschikbaar? Wat haalt een chatvoorvertoning op als iemand de URL plakt?",
      ],
    },
    {
      title: "Hoe werkt een eenmalige link?",
      paragraphs: [
        "In een ontwerp aan de clientkant, zoals bij PrivateNote, wordt het geheim in de browser van de verzender versleuteld vóór de upload. De server bewaart versleutelde tekst. De browser van de ontvanger ontsleutelt lokaal. Notitietekst gebruikt AES-256-GCM via de Web Crypto API.",
      ],
      beforeFlowSteps: "**In de praktijk ziet de volledige flow er zo uit:**",
      flowSteps: [
        {
          title: "Sleutel en versleuteling in de browser",
          step: "Stap 1: uw browser",
          body: "U typt het geheim lokaal. De browser genereert cryptografisch materiaal en versleutelt de platte tekst voordat er een netwerkverzoek het apparaat verlaat.",
        },
        {
          title: "Alleen versleutelde tekst gaat de lijn op",
          step: "Stap 2: de server",
          body: "Alleen de versleutelde lading wordt geüpload. De server bewaart tekst die hij niet kan lezen, omdat hij noch de platte tekst noch de fragmentsleutel ontvangt.",
        },
        {
          title: "De sleutel blijft in de link",
          step: "Stap 3: de URL",
          body: "De ontsleutelingssleutel komt in het URL-fragment—het deel na #. Het publieke pad identificeert de notitie; het fragment blijft bij een gewone HTTPS-navigatie in de browser.",
        },
        {
          title: "Tonen, ontsleutelen, daarna toegangsregels toepassen",
          step: "Stap 4: de ontvanger",
          body: "De pagina openen is niet genoeg. De ontvanger klikt om te tonen, waarna de versleutelde tekst wordt opgehaald. De browser ontsleutelt lokaal. Na een geslaagde weergave past PrivateNote de kijklimiet toe—standaard één keer—en verwijdert de versleutelde tekst wanneer die limiet is bereikt. Ongebruikte links verlopen ook op tijd.",
        },
      ],
      afterFlowSteps: [
        "Niet elk product dat als eenmalige link wordt verkocht volgt dit patroon. Sommige versleutelen op de server nadat ze uw tekst hebben ontvangen, of genereren de sleutel daar, waardoor de dienst het geheim zou kunnen lezen. Andere wissen volgens een schema maar houden herstelbare kopieën. Vraag of het volledige ontwerp is geïmplementeerd—niet alleen of de link verloopt.",
        "Voor de versleutelingsarchitectuur van PrivateNote, inclusief wachtwoordomhulling met Argon2id, zie [Hoe het werkt](app:how-it-works).",
      ],
    },
    {
      title: "Waarom het URL-fragment ertoe doet",
      paragraphs: [
        "Dit detail is makkelijk te missen, en het is de basis van deze architectuur.",
        "Bij een gewone HTTPS-navigatie stuurt de browser pad en query naar de server. Het [URL-fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—alles na #—blijft in de browser en zit niet in dat verzoek. Een goed ontworpen systeem kan daarom versleutelde tekst bewaren bij een identifier zoals `/note/abc123` en het ontsleutelingsmateriaal in `#…` houden, buiten de gewone serverlogs van die paginalading.",
        "Een sleutel achter # zetten maakt een toepassing op zichzelf niet veilig. De cryptografie eromheen moet kloppen: een sterke willekeurige sleutel, geauthenticeerde versleuteling, en een server die de platte tekst nooit nodig heeft. Het fragment houdt die stukken gescheiden—het is geen omweg eromheen.",
      ],
    },
    {
      title: "Eenmalige link, verlopende link en verdwijnend bericht",
      paragraphs: [
        "Deze ideeën worden vaak door elkaar gehaald. Het zijn verschillende controles, en één product kan ze combineren.",
      ],
      bullets: [
        {
          label: "Eenmalige link",
          body: "Beschikbaarheid hangt vooral van toegang af. Na de bedoelde raadpleging—bij PrivateNote een geslaagde weergave die de limiet bereikt—is de versleutelde lading van de server verdwenen.",
        },
        {
          label: "Verlopende link",
          body: "Beschikbaarheid hangt vooral van tijd af. De link blijft ophaalbaar tot de termijn om is, of iemand hem nu opende of niet.",
        },
        {
          label: "Verdwijnend bericht",
          body: "Onderdeel van een lopend gesprek. Retentie volgt het beleid van de messenger, dat nog steeds back-ups, citaten of kopieën op het apparaat kan achterlaten.",
        },
      ],
      callout:
        "**PrivateNote combineert toegang en tijd.** Nieuwe notities starten met één geslaagde weergave en verlopen ook als ze ongebruikt blijven—standaard één dag, met kortere of langere voorinstellingen afhankelijk van het abonnement. Dat is tijdelijke overdracht: ophalen, of wachten, en de kopie aan de serverkant is weg.",
    },
    {
      title: "Zijn eenmalige links veilig?",
      paragraphs: [
        "Dat kan. De beveiliging hangt af van de implementatie en van hoe de link wordt verstuurd—niet van de frase «eenmalig».",
        "Een serieus ontwerp moet kijken naar versleuteling aan de clientkant, sterke willekeurige sleutels, wat de server kan zien, verval, toegangsbetekenis, optionele wachtwoordbescherming, optionele ontvangersverificatie, metadata, lekkage van de link, een gecompromitteerd eindpunt en het gedrag van de ontvanger.",
        "PrivateNote versleutelt in de browser, bewaart versleutelde tekst, houdt de sleutel in het URL-fragment, hanteert standaard één weergave en laat ongebruikte notities verlopen. U kunt een wachtwoord toevoegen of, op betaalde plannen, ontvangersverificatie. De ontvanger heeft geen account nodig.",
        "Een eenmalige link beschermt **niet** tegen een gecompromitteerd apparaat, een ontvanger die het geheim na het bekijken kopieert, een screenshot of foto, of het sturen van de volledige URL—inclusief het fragment—naar de verkeerde persoon. Behandel de hele link als de toegangscapaciteit.",
      ],
    },
    {
      title: "Wanneer gebruikt u een eenmalige link?",
      paragraphs: [
        "Als het geheim een korte taak heeft: aankomen, gebruikt worden, en niet blijven leven in het kanaal waarmee u het verstuurde.",
      ],
      subsections: [
        {
          title: "Wachtwoorden",
          paragraphs: [
            "Een eenmalige link past bij het overhandigen van een tijdelijk of net aangemaakt wachtwoord aan één ontvanger, zonder de platte tekst in mail of chat achter te laten. Voor de wachtwoordworkflow, zie [hoe u veilig een wachtwoord deelt](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "API-sleutels en tokens",
          paragraphs: [
            "Ontwikkelaars en opdrachtnemers hebben vaak één keer een sleutel nodig. Via een link blijft de ruwe credential buiten Slack-threads, tickets en Git-commentaar. Zie [hoe u veilig een API-sleutel deelt](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Herstelcodes",
          paragraphs: [
            "Nuttig wanneer een back-up- of 2FA-herstelcode écht naar een andere bevoegde persoon moet—en niet doorzoekbaar mag blijven in de thread die hem droeg.",
          ],
        },
        {
          title: "Privéberichten",
          paragraphs: [
            "Informatie die één keer gecommuniceerd moet worden, zonder een blijvend gesprek te worden. Ontvangers kunnen de notitie openen zonder een account. Zie [een geheim bericht versturen zonder account](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Gevoelige bestanden",
          paragraphs: [
            "Een bestand vraagt extra zorg: omvang, download, voorvertoning en een aparte toegangstijd na het openen van de notitie. Bij PrivateNote vereist het versturen van een bestand een account van de verzender; openen niet. Bijlagen blijven na weergave ophaalbaar binnen een beperkte venster—standaard één uur. Gebruik [veilig bestanden overdragen](app:secure-file-transfer) als de lading een document is in plaats van een kort geheim.",
          ],
        },
      ],
    },
    {
      title: "Wanneer gebruikt u er geen?",
      paragraphs: [
        "Een eenmalige link is het verkeerde gereedschap als de taak opslag, samenwerking of een register is dat u moet bewaren.",
      ],
      poorFits: [
        "Wachtwoorden langdurig bewaren: gebruik de kluis van een wachtwoordmanager.",
        "Een doorlopend gesprek: gebruik een messenger die beide partijen al vertrouwen, bijvoorbeeld Signal.",
        "Organisatieregisters die u voor audit of wettelijke bewaarplicht moet houden.",
        "Geheimen die helemaal niet hoeven te reizen—genereer ze ter plaatse, of deel ze niet.",
        "Cryptocurrency-seedzinnen en andere onherstelbare mastergeheimen: een link kan nog lekken als de volledige URL wordt gekopieerd. Lees [crypto-seedzinnen en eenmalige links](blog:crypto-seed-phrase-one-time-link) voordat u dat patroon daar gebruikt.",
      ],
    },
    {
      title: "Eenmalige links versus e-mail, messaging en wachtwoordmanagers",
      paragraphs: [
        "De nuttige vergelijking is doel en persistentie—niet een ranglijst van welk kanaal «veilig» is.",
      ],
      comparisonTable: {
        headers: [
          "Kanaal",
          "Hoofddoel",
          "End-to-end-versleuteling",
          "Typische persistentie",
          "Geschikt voor een tijdelijke geheime overdracht?",
        ],
        rows: [
          [
            "E-mail",
            "Blijvende correspondentie",
            "Versleuteling onderweg is gebruikelijk; end-to-end is over het algemeen niet de standaard",
            "Meestal bewaard in meerdere postvakken, back-ups en zoekfuncties",
            "Slechte match voor een geheim in platte tekst",
          ],
          [
            "Slack / Teams",
            "Werkgesprek en zoeken",
            "Versleuteld onderweg en in rust op het platform; standaard niet end-to-end",
            "Doorzoekbare, exporteerbare werkruimtegeschiedenis",
            "Slechte match voor een geheim in platte tekst; acceptabel om een link te sturen",
          ],
          [
            "SMS / iMessage",
            "Persoonlijke berichten",
            "Loopt sterk uiteen per provider en platform",
            "Vaak met back-up of cloudsynchronisatie",
            "Slechte match voor een geheim in platte tekst",
          ],
          [
            "WhatsApp",
            "Privégesprek",
            "End-to-end voor chats; back-ups zijn dat mogelijk niet",
            "Kopieën op het apparaat en optioneel in de cloud",
            "Beter dan e-mail om te praten; nog steeds een slechte plek om een wachtwoord te parkeren",
          ],
          [
            "Signal",
            "Privégesprek",
            "End-to-end",
            "Verdwijnende berichten zijn instelbaar",
            "Een redelijk alternatief als beide partijen het al gebruiken",
          ],
          [
            "Wachtwoordmanager",
            "Bewaren en delen van inloggegevens",
            "Ja, by design",
            "Gebouwd voor langetermijnbewaring",
            "Uitstekend voor teams en vaststaande toegang; vaak zwaarder dan een ad-hocoverdracht",
          ],
          [
            "PrivateNote",
            "Tijdelijke versleutelde overdracht",
            "Versleuteling aan de clientkant; sleutel in het URL-fragment",
            "Kijklimiet plus tijdverval; versleutelde tekst wordt verwijderd wanneer die voorwaarden zijn bereikt",
            "Ontworpen voor dit gebruik",
          ],
        ],
      },
    },
    {
      title: "Het probleem van de linkvoorvertoning",
      paragraphs: [
        "Veel chat-apps halen een binnenkomende URL op om een voorvertoning te maken—titel, beschrijving, miniatuur. Als het laden van de pagina al als een lezing telde, zou die crawler de eenmalige link opgebruiken voordat de ontvanger hem opent.",
        "PrivateNote behandelt een paginalading niet als een lezing. De publieke notitie-URL toont een poort om te klikken en te onthullen. Metadata van die pagina kan worden opgehaald zonder platte tekst terug te geven. Versleutelde tekst wordt pas opgehaald na een bewuste weergave-actie. Een voorvertoning in Slack, Teams of iMessage krijgt het geheim dus niet, en verbruikt de kijklimiet niet.",
        "Dat is een ontwerpkeuze van client en API, geen lijst van geblokkeerde crawler-user-agents. Hoe u de link verstuurt blijft van belang: wie de volledige URL heeft, inclusief het fragment, en op Tonen klikt, kan de notitie lezen. Voor de waarschuwing aan de ontvanger, zie [waarom notities wachten op klikken om te onthullen](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Hoe maakt u een eenmalige link",
      paragraphs: ["Houd de stappen kort. Het hulpmiddel versleutelt; u kiest de toegangsregels."],
      numberedSteps: [
        { title: "Open PrivateNote", body: "Gebruik de editor op de site—voor een tekstnotitie is geen account nodig." },
        { title: "Voer in wat u wilt delen", body: "Een wachtwoord, bericht, API-sleutel of, met een account, een bestand." },
        {
          title: "Kies verval en toegang",
          body: "Kies de kortste levensduur die nog praktisch is. Standaard: één weergave en één dag als de link ongebruikt blijft. Voeg een wachtwoord of ontvangersverificatie toe als de gevoeligheid dat rechtvaardigt.",
        },
        { title: "Maak de versleutelde link", body: "De browser versleutelt eerst en uploadt daarna de versleutelde tekst." },
        { title: "Stuur de link naar de bedoelde ontvanger", body: "Plak de platte tekst er niet naast." },
      ],
      closingNote: "Als u er klaar voor bent, [maak een eenmalige link](app:one-time-link).",
    },
    {
      title: "Voordat u een geheim verstuurt",
      paragraphs: ["Een zorgvuldige overdracht is vooral operationeel. Cryptografie herstelt geen verkeerde ontvanger."],
      checklist: [
        "Bevestig de ontvanger voordat u de volledige URL stuurt.",
        "Gebruik de kortste praktische vervaltijd.",
        "Voeg een wachtwoord of ontvangersverificatie toe als de gevoeligheid dat rechtvaardigt.",
        "Stuur een extra authenticatiefactor via een ander kanaal.",
        "Roteer tijdelijke inloggegevens na gebruik.",
        "Verstuur geen geheimen die niet hoeven te bewegen.",
        "Houd er rekening mee dat de ontvanger kan kopiëren, fotograferen of een screenshot maken.",
      ],
    },
    {
      title: "Veelgestelde vragen",
      paragraphs: [],
      faqs: [
        {
          question: "Wat is een eenmalige link?",
          answer:
            "Een URL die een geheim ter ophaling bezorgt en daarna de versleutelde kopie op de server onbeschikbaar maakt volgens toegangs- en vervalregels—zodat de platte tekst niet in e-mail of chat hoeft te leven.",
        },
        {
          question: "Hoe stuur ik een wachtwoord via een beveiligde link?",
          answer:
            "Zet het wachtwoord in de notitie, niet in het bericht dat de link draagt. Tips voor gescheiden kanalen staan in [hoe u veilig een wachtwoord deelt](blog:how-to-share-a-password-securely).",
        },
        {
          question: "Is een eenmalige link veiliger dan e-mail?",
          answer:
            "Voor het geheim zelf wel, omdat e-mail de platte tekst bewaart. De link mag nog steeds via e-mail reizen; in het postvak ligt dan een URL, niet de inloggegevens.",
        },
        {
          question: "Wat gebeurt er na het openen van de link?",
          answer:
            "Bij PrivateNote telt een geslaagde weergave als een kijkbeurt. Met de standaardlimiet van één weergave verwijdert de server daarna de versleutelde tekst. De inhoud kan zichtbaar blijven in de al geopende browser. Ongebruikte links verlopen ook op tijd.",
        },
        {
          question: "Heeft de ontvanger een account nodig?",
          answer:
            "Nee. Wie de volledige link heeft, kan een onbeschermde notitie openen. Een wachtwoord of verificatie geldt alleen als de verzender dat heeft ingeschakeld.",
        },
        {
          question: "Kan ik een bestand meesturen met een eenmalige link?",
          answer:
            "Ja, via de [veilige bestandsoverdracht](app:secure-file-transfer) van PrivateNote. Versturen vereist een gratis account; openen niet. Na weergave volgen bijlagen een apart toegangsvenster—standaard één uur.",
        },
        {
          question: "Wat is het verschil tussen een eenmalige link en een verlopende link?",
          answer:
            "Eenmalig gaat over toegang: weg na de bedoelde raadpleging. Verlopend gaat over tijd: weg na de deadline, ook zonder opening. PrivateNote gebruikt beide.",
        },
        {
          question: "Kan iemand een screenshot maken van een eenmalig geheim?",
          answer:
            "Ja. Wat op het scherm staat, kan worden gekopieerd, gefotografeerd of vastgelegd. Een eenmalige link beperkt de originele kopie op de server; het is geen DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Kanaaltype",
    encrypted: "Versleuteld?",
    persistent: "Persistent?",
    verdict: "Geschikt voor eenmalige geheimen?",
  },
  goodFitsLabel: "Goede toepassingen",
  poorFitsLabel: "Slechte toepassingen",
  closingTitle: "Waar PrivateNote past",
  closingBody:
    "PrivateNote is een overdrachtsgereedschap. Het is geen langetermijnwachtwoordkluis, geen teamwiki en geen compliance-archief. Versleutel in de browser, deel een tijdelijke link, en laat de kopie aan de serverkant vervallen wanneer het werk klaar is.",
  encryptLu: "",
  tagline: "Laat de levensduur van het geheim aansluiten op die van het medium dat het draagt.",
  relatedReading: "Verder lezen",
  ctaTitle: "Maak een eenmalige link",
  ctaBody: "Versleutel een bericht, wachtwoord of bestand in uw browser en deel het via een tijdelijke link.",
  ctaButton: "Maak een beveiligde link",
};
