import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersNl: SecureClientDeliveryForLawyersArticleCopy = {
  intro: [
    "Gewone berichtenapps kunnen blijvende kopieën achterlaten. Bij veel communicatie die onder het beroepsgeheim valt, is het praktische doel juist het tegenovergestelde: een instructie of gevoelig document overbrengen zonder er opnieuw een permanent chatarchief van te maken. Versleuteling telt; het telt ook wie later een schriftelijk spoor kan terugvinden, en hoe lang dat spoor blijft bestaan.",
    "Kantoren weten dat e-mail geen kluis is. Veel wijken daarom uit naar Signal of WhatsApp, omdat «het versleuteld is». Dat is te smal. Die diensten zijn gemaakt om een gesprek te bewaren. Veel communicatie tussen advocaat en cliënt vraagt juist om het tegenovergestelde: een instructie, een concept of een bijlage bij de cliënt over te brengen — en daarna geen kopieën op te stapelen.",
    "De moeilijkheid is praktisch én juridisch. Een aanzienlijk deel van de cliënten installeert geen Signal. Ze voegen geen tweede «veilige» berichtenapp toe naast de familie-WhatsApp. Ze openen een link in de browser die al op het toestel staat. Juist in de strafrechtpraktijk heeft de advocatuur een kanaal nodig dat op kantoorcorrespondentie lijkt — niet op een bericht in een gewone chatapp.",
  ],
  sections: [
    {
      title: "Waarom een versleutelde chat toch een blijvende geschiedenis kan achterlaten",
      paragraphs: [
        "End-to-endversleuteling in Signal en WhatsApp beschermt de inhoud effectief tegen toegang door de aanbieder. Maar versleuteling en bewaring zijn twee verschillende vragen: een bericht kan goed versleuteld zijn en daarna toch op apparaten, in back-ups of op gekoppelde computers beschikbaar blijven. Juist die tweede vraag is in de praktijk relevant voor het kantoor en, in het bijzonder, voor de strafrechtadvocaat:",
      ],
      bullets: [
        "Blijft er een doorzoekbare geschiedenis op de telefoon van de cliënt, op die van een naaste, of op een toestel dat later in beslag wordt genomen, verloren gaat of wordt onderzocht?",
        "Vermenigvuldigen cloudback-ups, gekoppelde computers, meldingsvoorbeelden en doorgestuurde screenshots de inhoud voorbij de oorspronkelijke partijen?",
        "Ontstaat er, onbedoeld, een doorlopend schriftelijk commentaar dat nooit in het dossier thuishoorde, maar later als digitaal spoor opduikt?",
      ],
      paragraphsAfterBullets: [
        "Hetzelfde patroon kent de rest van het beroep: geschreven berichten overleven de aanleiding waarvoor ze zijn verstuurd. Zie [kortlevende notities voor werkberichten](blog:workplace-texts-private-note) en [waarom geheimen niet in de chat horen](blog:secrets-never-send-in-chat). Voor identiteitsbewijzen, medische verslagen en contracten geldt hetzelfde bezwaar voor [e-mailbijlagen](blog:why-email-is-worst-for-secrets).",
        "Dit is geen uitnodiging om te vernietigen wat het kantoor moet bewaren. Wettelijke bewaarplichten, de ordelijke dossiervorming en, waar bevolen, het veiligstellen van bewijs blijven. Het punt is enger: veel operationele berichten — eenmalige instructies, toegangscodes, formuleringen alleen voor de cliënt, een gevoelige bijlage die niet in de familiechat hoort te liggen — horen niet permanent in een berichtenapp te blijven staan.",
      ],
    },
    {
      title: "Strafrecht, voorlopige hechtenis en de cliënt zonder tweede app",
      paragraphs: [
        "Het bezwaar is het scherpst in de strafrechtpraktijk. De cliënt staat onder druk, zit soms in voorlopige hechtenis of in detentie, gebruikt de telefoon van een familielid en kan zelden een eigen set vertrouwelijkheidstools invoeren. Vragen om «gewoon Signal te installeren» strandt in veel dossiers. WhatsApp staat vaak al op het toestel — en dat is precies het probleem. Het is een persoonlijke communicatieomgeving: daar ruziet de familie, daar circuleren screenshots, daar ligt een vertrouwelijke instructie naast de grap van een neef.",
        "Daar komt de inbeslagnamepraktijk bij. Wordt de telefoon in beslag genomen, dan ligt de lokale chatgeschiedenis op het toestel. PrivateNote verandert niet wat autoriteiten wettelijk in beslag mogen nemen of onderzoeken. Het stelt een andere vraag: welke kopieën de cliënt zelf, standaard, op een alledaagse telefoon bewaart.",
        "Tot de berichten die in die omgeving niet thuishoren, behoren onder meer:",
      ],
      bullets: [
        "Instructies over de proceshouding, voorlopige hechtenis, voorwaarden, borgsom of een mogelijke schikking.",
        "Concepten van een verklaring, een conclusie of het requisitoir/pleidooi over de strafmaat die de cliënt vóór indiening moet goedkeuren.",
        "Adressen, medische verklaringen, vermogenspositie of de identiteit van een beoogde getuige: vandaag nodig, gevaarlijk als ze blijven liggen.",
        "Eenmalige toegang tot een portal, een videoverhoor of een stuk dat de cliënt één keer moet lezen, niet in de chat bewaren.",
        "Advocaat tot advocaat: correspondent, waarneming op zitting, substituut — de stukken zijn nú nodig, geen blijvende groepsapp.",
      ],
      paragraphsAfterBullets: [
        "In al die gevallen is het doel de informatie gericht aan de bedoelde ontvanger over te brengen, zonder de groep mensen die de inhoud later kan reconstrueren onnodig groter te maken. Een leesbevestiging in een berichtenapp is geen registratie van verzending voor het kantoor. Het identificeert het kantoor niet. Het lijkt niet op een mededeling waarop een cliënt die al wantrouwig is tegenover links, in één oogopslag kan vertrouwen.",
      ],
    },
    {
      title: "Waar de advocatuur écht behoefte aan heeft",
      paragraphs: [
        "Een kanaal dat geschikt is om vertrouwelijke informatie over te brengen, heeft een korte lijst eisen. De cliënt mag geen account hoeven aanmaken en geen software installeren. Versleuteling moet op het apparaat van de verzender plaatsvinden vóór het uploaden, zodat de dienst alleen versleutelde gegevens bewaart, niet de instructie. Toegang moet na lezen kunnen verdwijnen en verlopen. De openingspagina moet als kantoorcorrespondentie overkomen, niet als een anonieme dienst om tekst te delen. De verzender moet kunnen zien of de link is geopend, hem intrekken bij een verkeerd nummer, en bij gevoelige bijlagen het gemakkelijke downloaden bemoeilijken.",
        "Dat is de logica van een [eenmalige geheime link](blog:one-time-secret-links), toegepast op de praktijk. PrivateNote versleutelt de inhoud in de browser voordat die het apparaat verlaat. Ontvangers openen een unieke URL; er is geen account nodig. Het kantoor kan de link versturen via het kanaal dat de cliënt al gebruikt — sms, e-mail, zelfs een kort gesprek waarin het adres wordt voorgelezen — zonder de instructie in dat kanaal te zetten. De gevoelige inhoud zit in de notitie. Chat of inbox bewaren alleen een link die daarna niet meer werkt.",
      ],
      comparisonTable: {
        headers: ["Eis van de praktijk", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "De cliënt installeert geen toepassing",
            "Nee — de app ís het kanaal",
            "Ja — gewone browser",
          ],
          [
            "Geen duurzame geschiedenis als uitgangspunt",
            "Gesprek in een app; verdwijnende berichten kunnen worden ingesteld",
            "Eenmalige overdracht via een link; eenmalige toegang en verval als hoofdmodel",
          ],
          [
            "Identiteit van het kantoor bij verzending",
            "Profiel of identiteit binnen de berichtenapp",
            "Logo, kantoornaam en openingspagina in huisstijl",
          ],
          [
            "Bewijs dat de stukken zijn opgehaald",
            "Leesbevestigingen horen bij de chat, niet bij een eigen registratie van verzending",
            "Openingsmeldingen en toegangsbewijs (alleen status)",
          ],
          [
            "Intrekken bij een verkeerd nummer",
            "Het bericht staat al op het toestel",
            "Een ongeopende notitie intrekken",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal en WhatsApp bieden ook verdwijnende berichten. Hun model blijft dat van een gesprek in een berichtenapp, terwijl PrivateNote is bedoeld als een eenmalige overdracht via een link. Voor stukken in plaats van korte instructies, zie [hoe u gevoelige documenten veilig verstuurt](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Samen gebruiken: een kantoorgewoonte",
      paragraphs: [
        "De waarde groeit wanneer advocaten onderling hetzelfde kanaal gebruiken als met de cliënt. De correspondent, de waarnemer op zitting, de collega die een termijn overneemt en de cliënt delen dan een verwachting: het gevoelige komt als eenmalige link in huisstijl; het blijft niet in een groepsapp; het wordt geen extra chatgeschiedenis.",
        "Dat is een praktijkstandaard, geen product met licenties per gebruiker. PrivateNote Business is één professioneel account. Een advocaat, een medewerker of een klein kantoor kan naam en huisstijl op elke openingspagina tonen. Collega’s met een eigen Business- of Starter-account kunnen stukken op dezelfde wijze terugsturen. De cliënt heeft alsnog geen account nodig. De gemeenschappelijke discipline is het punt: stoppen met alledaagse berichtenapps als standaardkanaal voor operationele communicatie onder het beroepsgeheim.",
        "Huisstijl is geen ijdelheid. Een cliënt die gewend is voorzichtig te zijn met onbekende links, moet onmiddellijk kunnen herkennen in welke context het bericht wordt verstuurd: de naam van het kantoor, het logo, de afzender en een korte begeleidende tekst. Dat is geen cryptografische authenticatie van de afzender, maar het maakt de verzending wel herkenbaarder en professioneler. Een WhatsApp-draad biedt die waarborg niet. Business voegt profiel, logo, kleuren en een standaard of aangepaste openingspagina toe, zodat de verzending duidelijk onder de identiteit van het kantoor wordt getoond.",
      ],
      midCta: {
        body: "Business is het plan voor professionele, vertrouwelijke overdracht: huisstijl bij de ontvanger, alleen-lezen bestanden, bijlagen tot 1 GB en de set overdrachtscontroles (toegangsbewijs, ontvangersverificatie, intrekking, uitgestelde opening). 12 € / 12 $ per maand, of 120 € / 120 $ per jaar: één professioneel account, geen licenties per gebruiker.",
        button: "Bekijk Business op de plannenpagina",
      },
    },
    {
      title: "Controles die bij een professioneel account horen",
      paragraphs: [
        "Starter en Business voegen functies toe die het kantoor anders telefonisch of via gescheiden kanalen zou moeten organiseren. [Ontvangersverificatie](blog:recipient-verification-code-before-reveal) zet een notitie-eigen code op een tweede kanaal, zodat een onderschepte link niet volstaat. [Openingsmeldingen](blog:know-when-secret-link-opened) en toegangsbewijs zeggen dat de stukken zijn opgehaald: alleen de status, nooit de inhoud. Een nog ongeopende link kan worden [ingetrokken](blog:revoke-unopened-note-proof-of-access) als die naar het verkeerde nummer is gestuurd. Uitgestelde opening kan een bundel vasthouden tot een indieningstermijn of een belletje vanuit de inrichting. Business voegt alleen-lezen toe voor bijlagen die gelezen, niet achteloos opgeslagen moeten worden, en grotere bijlagelimieten voor dossiers die niet in een chat thuishoren.",
      ],
      orderedIntro: "Een werkbare volgorde is kort:",
      ordered: [
        "Stel de instructie op of voeg de stukken bij. Versleuteling gebeurt in de browser vóór het uploaden.",
        "Stel een korte levensduur in en één opening, of enkele openingen als cliënt en correspondent dezelfde bundel moeten ophalen.",
        "Schakel ontvangersverificatie in wanneer de inhoud bijzonder gevoelig is en deel de code via een ander kanaal (bijvoorbeeld een telefoongesprek).",
        "Stuur alleen de link via sms of e-mail. Plak de instructie niet in dat bericht.",
        "Wacht op de openingsmelding. Was het nummer fout, trek in vóór opening. Na opening: neem aan dat de ontvanger kan bewaren wat hij heeft gezien, en handel daarnaar.",
      ],
      paragraphsAfterOrdered: [
        "Voor grotere bundels geldt hetzelfde model: [versleutelde bestanden, versleutelde gegevens op de server, beperkte downloadperiode](app:secure-file-transfer). Een bestand versturen vereist een gratis account; een link openen nooit.",
      ],
    },
    {
      title: "Wat dit kanaal niet beslist",
      paragraphs: [
        "In Nederland beschermen geheimhoudingsplicht en verschoningsrecht de vertrouwensrelatie met de cliënt. In België is het beroepsgeheim van de advocaat van openbare orde. Of het geheim in het concrete geval geldt, hangt af van het juridische kader en de omstandigheden van het geval. PrivateNote bepaalt die juridische status niet. Geen product belet een rechtmatige ontvanger te kopiëren, vast te leggen of te fotograferen zodra de inhoud in leesbare vorm is getoond. PrivateNote vervangt het documentatiesysteem van het kantoor, de urenregistratie noch de plicht te bewaren wat het dossier moet bewaren. Het vermindert onnodige kopieën van berichten die geen duurzaam archief moesten worden. Ook het beginsel van dataminimalisatie pleit ervoor persoonsgegevens niet langer of uitgebreider te bewaren dan nodig is voor het doel waarvoor ze worden verwerkt.",
        "Binnen die grens is het een professioneel alternatief voor de twee gewoonten die nu overheersen: operationeel verkeer onder het beroepsgeheim in de e-mail zetten, of in een alledaagse berichtenapp omdat de cliënt niets anders zal installeren. Het kantoor laat de cliënt op de tools die hij al heeft, zet de naam op de verzending en laat geen geschiedenis achter waar die niet nodig is.",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is de versleuteling van Signal of WhatsApp genoeg voor het beroepsgeheim?",
          answer:
            "End-to-endversleuteling beschermt de inhoud effectief tegen toegang door de aanbieder. Ze beslist niet hoe lang een geschiedenis op toestellen, back-ups of in de chat van de cliënt blijft. Versleuteling en bewaring zijn twee verschillende vragen. De juridische bescherming van een communicatie hangt niet alleen af van het hulpmiddel waarmee ze wordt overgebracht.",
        },
        {
          question: "Moet de cliënt een account aanmaken of een toepassing installeren?",
          answer:
            "Nee. De cliënt opent een unieke link in een gewone browser. Signal, WhatsApp noch een PrivateNote-app zijn nodig, en er is geen account vereist om de notitie te openen.",
        },
        {
          question: "Vervangt PrivateNote het kantoordossier?",
          answer:
            "Nee. Het is een kortlevend overdrachtskanaal. Dossiers, processtukken en alles wat onder een bewaarplicht valt, blijven in de gebruikelijke systemen van het kantoor. PrivateNote is voor berichten die na ontvangst niet moeten blijven bestaan.",
        },
        {
          question: "Kan de ontvanger na opening toch een kopie bewaren?",
          answer:
            "Ja. Zodra de inhoud rechtmatig in leesbare vorm is getoond, kan een aangewezen ontvanger kopiëren, vastleggen, downloaden of fotograferen. Vernietiging na lezen en verval verminderen restkopieën op de dienst; ze wissen op afstand niet wat de ontvanger al heeft vastgelegd. Alleen-lezen van Business bemoeilijkt het gemakkelijke downloaden; fotograferen verbiedt het niet.",
        },
      ],
    },
  ],
  ctaTitle: "Lever de instructie. Laat de geschiedenis niet achter.",
  ctaBody:
    "Versleutel in de browser, zet de kantoornaam op de openingspagina en stuur een link die de cliënt opent zonder Signal of WhatsApp te installeren. Business is het plan voor die professionele, vertrouwelijke overdracht.",
  ctaPrimary: "Kies Business",
  ctaSecondary: "Schrijf een privénotitie",
};
