import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyNl: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop op een bureau met een beveiligde PrivateNote.ai-link klaar om te kopiëren, met verval na één weergave en wachtwoordzin ingeschakeld",
  heroCaption:
    "Deel een beveiligde link—niet het wachtwoord zelf—met korte geldigheid, eenmalige weergave en een optionele wachtwoordzin.",
  intro: [
    "Een wachtwoord delen lijkt een kleine, alledaagse taak—tot er iets misgaat.",
    "Of een collega tijdelijk toegang nodig heeft tot een interne tool, een medewerker van de klantenservice om systeemtoegang vraagt, of je wifi-gegevens aan een bezoeker moet sturen: de snelste optie voelt vaak als het plakken van het wachtwoord in platte tekst in een Microsoft Teams-chat, een WhatsApp-bericht of een snelle e-mail.",
    "Helaas laat die gemakkelijke aanpak een permanente digitale spoor achter. Zodra een geheim deze kanalen binnenkomt, wordt het gesynchroniseerd over apparaten, doorzoekbaar via zoekfuncties, opgeslagen in automatische mailboxback-ups en onbeperkt bewaard in bedrijfsarchieven van berichten. Een wachtwoord dat tijdelijk bedoeld was, wordt een permanente aansprakelijkheid.",
    "Gelukkig is er een betere manier om je inloggegevens te beschermen.",
  ],
  sections: [
    {
      title: "Het kernprobleem van delen in platte tekst",
      paragraphs: [
        "E-mail- en chatapplicaties zijn uitstekende samenwerkingsplatforms, maar ze zijn nooit ontworpen om geheimen vast te houden. Hoewel moderne systemen gegevens tijdens verzending meestal versleutelen, schieten ze tekort op vergankelijkheid—ervoor zorgen dat geheimen verdwijnen zodra ze hun doel hebben gediend.",
        "Wanneer je een wachtwoord in een standaard chat- of e-mailthread plakt, verlies je meteen de controle over de levenscyclus. Het blijft opgeslagen in mailboxen, jaren later doorzoekbaar in chatlogs, en zichtbaar in apparaatmeldingen of vergrendelschermen. Als jouw account of dat van de ontvanger ooit wordt gecompromitteerd, worden die chatgeschiedenissen in platte tekst een goudmijn voor aanvallers.",
      ],
    },
    {
      title: "GDPR (DSGVO) en compliance-risico’s in Europa",
      paragraphs: [
        "Voor Europese organisaties is dit niet alleen een beveiligingskwestie—het is een compliance-risico. Op grond van de Algemene verordening gegevensbescherming (GDPR / DSGVO) zijn bedrijven wettelijk verplicht om toegang tot persoonsgegevens te beschermen met state-of-the-art technische en organisatorische maatregelen.",
        "Actieve inloggegevens plakken in Amerikaanse cloud-chatlogs of onversleutelde e-mailservers zonder toegewijde end-to-end-versleuteling kan de compliance-blootstelling vergroten, vooral als die wachtwoorden toegang geven tot databases met klant- of werknemersgegevens.",
        "Lokale versleuteling in de browser vermindert drastisch waar inloggegevens kunnen blijven hangen, zodat dagelijkse overdrachten aansluiten bij een privacy-first-aanpak. Dit is geen juridisch advies; behandel veilig delen van inloggegevens als één onderdeel van breder toegangsbeheer, wachtwoordbeheer en rotatiebeleid.",
      ],
    },
    {
      title: "Hoe browserversleutelde links werken",
      paragraphs: [
        "Voor snelle, eenmalige wachtwoorddeling behoren browserversleutelde eenmalige links tot de veiligste en efficiëntste opties. In plaats van de inloggegevens zelf te sturen, stuur je een unieke, tijdelijke link naar een versleutelde notitie. [Wat een eenmalige link is](blog:one-time-secret-links) legt het model achter die overdracht uit.",
        "Je browser doet het zware werk: het wachtwoord wordt lokaal versleuteld vóór upload, zodat de tussenliggende server ciphertext opslaat—niet je ruwe wachtwoord. De ontsleutelingsleutel blijft doorgaans in het linkfragment, dat browsers niet naar de server sturen.",
      ],
      flowIntro: "Om een geheim te delen met een tijdelijke, zelfvernietigende link, volg je deze vier stappen:",
      flowSteps: [
        {
          step: "Stap 1",
          title: "Invoer en lokale versleuteling",
          body: "Voer het wachtwoord in een beveiligde tool in. Je browser versleutelt het lokaal met een sleutel die je machine nooit als platte tekst verlaat.",
        },
        {
          step: "Stap 2",
          title: "Genereer de link",
          body: "De tool uploadt alleen de versleutelde payload naar een zero-knowledge-server en bouwt een unieke deellink. Het ontsleutelingsmateriaal blijft bij de link—niet in een server-side kluis met leesbare geheimen.",
        },
        {
          step: "Stap 3",
          title: "Stuur de link",
          body: "Kopieer en stuur de link via Microsoft Teams, e-mail of WhatsApp. Het chatplatform ziet een URL, niet je wachtwoord.",
        },
        {
          step: "Stap 4",
          title: "Onthullen en zelfvernietiging",
          body: "De browser van de ontvanger ontsleutelt de inhoud lokaal. Afhankelijk van het deelbeleid kan de versleutelde payload daarna van de server worden verwijderd na weergave of na een kort vervalvenster.",
        },
      ],
      midCta: {
        body: "Moet je nu een wachtwoord delen? Maak een versleutelde eenmalige notitie en stuur de beveiligde link in plaats van het wachtwoord zelf.",
        button: "Maak een privénotitie",
      },
    },
    {
      title: "Tip voor hoge beveiliging: gesplitst-kanaal delen",
      paragraphs: [
        "Een versleutelde link is alleen zo veilig als het kanaal waarmee je hem stuurt. Als een kwaadwillende derde toegang krijgt tot je Teams- of e-mailinbox, kan die de link onderscheppen voordat je ontvanger hem opent.",
        "Veel veilige deeltools—waaronder PrivateNote.ai—bieden een optionele instelling om de notitie te beschermen met een extra wachtwoord (passphrase wrapping). Dit staat niet standaard aan: je schakelt het in bij het maken van de notitie, kiest een wachtwoordzin, en de ontvanger moet die invoeren voordat het geheim wordt onthuld.",
        "Om een single point of failure (SPoF) voor zeer gevoelige inloggegevens te voorkomen, gebruik je die optie voor gesplitst-kanaal delen: genereer de versleutelde link met wachtwoordzinbescherming, stuur de link via je primaire kanaal (bijvoorbeeld Microsoft Teams), en stuur de wachtwoordzin via een volledig ander kanaal—bij voorkeur een privacygerichte messenger zoals Signal of Threema, of een kort telefoongesprek.",
      ],
      callout:
        "Een aanvaller zou zowel de link als de wachtwoordzin nodig hebben. Die scheiding maakt gesplitst-kanaal delen effectief.",
    },
    {
      title: "Delen via wachtwoordmanagers vs. eenmalige links",
      paragraphs: [
        "Beide methoden kunnen zeer veilig zijn, maar ze dienen verschillende doelen. Welke tool je kiest, hangt af van hoe lang de ontvanger toegang nodig heeft.",
      ],
      comparisonTable: {
        headers: ["Categorie", "Het best voor", "Technische beperkingen"],
        rows: [
          [
            "E-mail, Teams of WhatsApp",
            "Niet aanbevolen voor wachtwoorden",
            "Laat permanente, doorzoekbare kopieën in platte tekst achter in back-ups en archieven",
          ],
          [
            "Wachtwoordmanagers",
            "Lopende toegang: kluizen delen met familieleden, interne afdelingen of vertrouwde kernteams",
            "Vereist dat beide partijen actieve, compatibele wachtwoordmanager-accounts onderhouden",
          ],
          [
            "Eenmalige versleutelde links",
            "Tijdelijke toegang: freelancers, klantenservice, bezoekers en eenmalige overdrachten",
            "Iedereen met de link kan het geheim lezen, tenzij beschermd door een secundaire wachtwoordzin",
          ],
        ],
        after: [
          "Als vuistregel: gebruik een **wachtwoordmanager** voor lopende gedeelde toegang, en een **eenmalige versleutelde link** wanneer de inloggegevens kort na de overdracht moeten veranderen.",
        ],
      },
    },
    {
      title: "Wanneer een eenmalige wachtwoordlink gebruiken",
      paragraphs: [
        "Eenmalig wachtwoorden delen is ideaal voor transactionele inloggegevens die maar één keer gecommuniceerd hoeven te worden. Veelvoorkomende Europese werkplekvoorbeelden zijn:",
      ],
      useCaseTable: {
        headers: ["Afdeling", "Veelvoorkomende use cases"],
        rows: [
          [
            "Administratie & kantoor",
            "Router- of kantoor-gast-wifi-wachtwoorden, printer-admin-inloggegevens of smart-office-instellingen",
          ],
          [
            "Finance & business",
            "Inloggegevens voor je belastingadviseur of externe financiële auditors",
          ],
          [
            "IT & operations",
            "Onboarding van tijdelijke externe IT-dienstverleners, of delen van tijdelijke contractor-logins",
          ],
          [
            "Technische teams",
            "Database-inloggegevens, API-sleutels, SSH-sleutels of cloudplatform-wachtwoorden met ontwikkelaars",
          ],
        ],
      },
    },
    {
      title: "Best practices en valkuilen om te vermijden",
      subsections: [
        {
          title: "Dwing rotatie af",
          paragraphs: [
            "Behandel een wachtwoord altijd als tijdelijk wanneer je het deelt. Vraag de ontvanger het te wijzigen zodra ze inloggen, en bevestig dat de rotatie voltooid is voordat je de overdracht als afgerond beschouwt.",
          ],
        },
        {
          title: "Genereer sterke, lokale wachtwoorden",
          paragraphs: [
            "Verzin wachtwoorden niet zelf. Gebruik een lokale tool zoals de [wachtwoordgenerator](app:password-generator) van PrivateNote, of [passwords.lu](https://passwords.lu) voor wachtwoordzin- en PIN-opties. Beide draaien lokaal—er wordt niets geüpload. Voor het technische model, zie [Hoe we veilige wachtwoorden genereren](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Houd vervaltijden kort",
          paragraphs: [
            "De meeste wachtwoorden hoeven maar een paar minuten of uren te bestaan. Geef de voorkeur aan één weergave of een kort venster zoals twee uur wanneer dat nog past bij de workflow van de ontvanger.",
          ],
        },
        {
          title: "Zet geen wachtwoorden in titels of onderwerpregels",
          paragraphs: [
            "Plaats nooit wachtwoorden in platte tekst in e-mailonderwerpregels, tickettitels, Teams-kanaalnamen, WhatsApp-groeptitels, documentnamen of kalenderuitnodigingen. Die velden worden zelden met dezelfde zorg behandeld als berichtteksten—en ze blijven bestaan in zoekindexen.",
          ],
        },
        {
          title: "Houd context buiten de beveiligde notitie",
          paragraphs: [
            "Als je een databasewachtwoord deelt, schrijf dan niet “Databasewachtwoord voor productie-CRM: MySecret123!” in de notitie. Zet alleen het ruwe geheim in de versleutelde link. Als de link wordt onderschept, mag de aanvaller niet ook te weten komen welk account of systeem het ontgrendelt.",
          ],
        },
      ],
      calloutTitle: "Veelgemaakte fout",
      callout:
        "Zowel de versleutelde link als de wachtwoordzin in hetzelfde Teams-bericht, WhatsApp-chat of e-mail sturen ondermijnt gesplitst-kanaal delen en creëert opnieuw een single point of failure.",
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is Microsoft Teams of WhatsApp veiliger dan e-mail?",
          answer:
            "Hun verzendprotocollen zijn over het algemeen veilig, maar ze functioneren nog steeds als langetermijn-chatarchieven. Elk wachtwoord dat in een thread wordt geplakt, kan onbeperkt doorzoekbaar blijven, wat het een aanhoudende kwetsbaarheid maakt.",
        },
        {
          question: "Beïnvloedt de GDPR (DSGVO) hoe ik wachtwoorden deel?",
          answer:
            "Op grond van artikel 32 van de GDPR moeten organisaties passende technische en organisatorische maatregelen nemen om persoonsgegevens te beveiligen. Wachtwoorden in platte tekst opslaan in cloudback-ups of open e-mailketens vergroot de compliance-blootstelling. Zero-knowledge, zelfvernietigende links houden de voetafdruk van inloggegevens kleiner.",
        },
        {
          question: "Moet ik de link en de wachtwoordzin samen sturen?",
          answer:
            "Nee. Beide stukken in hetzelfde bericht sturen ondermijnt gesplitst-kanaal delen. Stuur de wachtwoordzin via een apart medium—bij voorkeur Signal of Threema, of een telefoongesprek.",
        },
        {
          question: "Moet ik een wachtwoordmanager of een eenmalige link gebruiken?",
          answer:
            "Gebruik een wachtwoordmanager voor gedeelde toegang op lange termijn. Gebruik een browserversleutelde eenmalige link wanneer je een wachtwoord maar één keer hoeft te communiceren.",
        },
        {
          question: "Heb ik nog steeds een wachtwoordmanager nodig?",
          answer:
            "Ja. Wachtwoordmanagers blijven de juiste plek om inloggegevens die je bewaart op te slaan en te beheren. Eenmalige versleutelde links vullen ze aan voor gecontroleerde, tijdelijke overdrachten.",
        },
      ],
    },
    {
      title: "Tot slot",
      paragraphs: [
        "Veilig wachtwoorden delen hoeft geen knelpunt voor je workflow te zijn. Het vraagt alleen om een kleine gewoonteverandering: stop met het permanent achterlaten van gevoelige gegevens in chatlogs en inboxgeschiedenissen.",
        "Door lokale browserversleuteling en zelfvernietigende links te gebruiken, verminder je organisatorische beveiligings- en compliancerisico’s terwijl overdrachten snel en praktisch blijven.",
        "De volgende keer dat je een wachtwoord moet delen, vermijd dan copy-paste in Microsoft Teams, WhatsApp of e-mail. Maak een versleutelde eenmalige notitie, stuur de link in plaats van het wachtwoord, en laat de notitie verlopen nadat hij zijn doel heeft gediend.",
      ],
    },
  ],
  ctaTitle: "Klaar om veilig te delen?",
  ctaBody:
    "Maak een privénotitie op PrivateNote.ai om inloggegevens in je browser te versleutelen vóór upload. Notities kunnen automatisch of na lezen verlopen, optionele wachtwoordzinbescherming voegt een extra laag toe, en versleutelde notitiegegevens worden onder EU-jurisdictie verwerkt.",
  ctaButton: "Maak een privénotitie",
};
