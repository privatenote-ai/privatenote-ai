import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyNl: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Concept van veilige documentoverdracht: een verzegelde envelop en een versleutelde bestandsoverdracht op een rustig bureau",
  heroCaption:
    "Het moeilijke deel is zelden de verzendknop. Het is wat er met elke kopie gebeurt nadat het document is aangekomen.",
  intro: [
    "Stel je moet je paspoort naar een bank sturen, je boekhouder vraagt om belastingdocumenten, je werkgever vraagt om een identiteitsbewijs, of een klant heeft een ondertekend contract nodig.",
    "De taak zelf duurt maar een paar seconden: bestand bijvoegen, op Verzenden klikken, verder met je dag. De overdracht is zelden het zwakste onderdeel van het proces. Het echte probleem begint nadat het document is aangekomen.",
    "Die bijlage kan jarenlang blijven bestaan in inboxen, cloudback-ups, gesynchroniseerde apparaten, gearchiveerde mailboxen en oude chatgesprekken. In veel situaties is het grootste privacyrisico niet onderschepping tijdens de overdracht—het is dat kopieën blijven bestaan lang nadat het document zijn doel heeft gediend.",
    "Deze gids legt uit waarom traditioneel documenten delen vaak tekortschiet, wat veilig documenten delen werkelijk betekent, en hoe [versleuteling in de browser](blog:encrypted-vs-secure-file-sharing) en [eenmalige links](blog:one-time-secret-links) je helpen vertrouwelijke informatie privé te houden.",
  ],
  sections: [
    {
      title: "Waarom vertrouwelijke documenten een andere behandeling verdienen",
      takeaway:
        "Als een document moeilijk te vervangen zou zijn—of pijnlijk om te lekken—behandel het dan niet als een vakantiefoto.",
      paragraphs: [
        "Niet elk bestand verdient hetzelfde beschermingsniveau. Een vakantiefoto online verliezen kan teleurstellend zijn. Een vertrouwelijk document verliezen kan gevolgen hebben die jaren aanhouden.",
        "Identiteitsdocumenten bevatten vaak je volledige naam, geboortedatum, identificatienummer, nationaliteit, handtekening en foto. Financiële gegevens onthullen inkomen, spaargeld, belastinginformatie of bankrekeninggegevens. Medische documenten bevatten zeer persoonlijke informatie, terwijl contracten vaak commercieel gevoelige details bevatten die nooit openbaar bedoeld waren.",
        "Als iemand je wachtwoord ontdekt, verander je het. Als iemand je paspoort, identiteitskaart, belastingaangifte of arbeidscontract kopieert, is de situatie veel gecompliceerder. Daarom verdienen vertrouwelijke documenten een andere aanpak dan alledaagse communicatie.",
      ],
    },
    {
      title: "Het verborgen probleem met e-mail",
      takeaway: "TLS beschermt de reis; het voorkomt niet dat permanente kopieën zich daarna opstapelen.",
      paragraphs: [
        "E-mail blijft een van de nuttigste communicatiemiddelen ooit gemaakt. Het is nooit ontworpen als veilig systeem voor het afleveren van documenten.",
        "Moderne e-mailproviders beschermen berichten tijdens het transport met versleutelde verbindingen zoals TLS. Zodra het bericht is aangekomen, wordt de bijlage doorgaans opgeslagen zodat die later kan worden doorzocht, gesynchroniseerd, gefilterd, geback-upt en opgehaald.",
        "Één bijlage wordt snel meerdere kopieën: je map Verzonden items, de inbox van de ontvanger, telefoons, laptops, bedrijfsarchieven, cloudback-ups en soms geautomatiseerde doorstuursystemen. Het later verwijderen van de e-mail verwijdert zelden elke kopie.",
        "Voor alledaagse gesprekken is dit meestal acceptabel. Voor paspoorten, contracten, financiële overzichten of medische rapporten is dat vaak niet zo. Voor een diepgaandere blik op waarom e-mail een slechte plek is voor geheimen, zie [waarom e-mail de slechtste plek is voor geheimen](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Waarom chatapps een permanent spoor achterlaten",
      takeaway: "Chat maakt samenwerken makkelijk—en documentbehoud onbedoeld.",
      paragraphs: [
        "Veel mensen vermijden e-mail en versturen vertrouwelijke documenten in plaats daarvan via Slack, Microsoft Teams, WhatsApp, Signal, Telegram of Discord. Deze platforms lossen samenwerking op. Ze lossen documentlevenscyclusbeheer niet op.",
        "Bestanden die in chat worden gedeeld, blijven vaak maandenlang of jarenlang doorzoekbaar, synchroniseren tussen apparaten, komen terecht in automatische back-ups en worden gedownload naar persoonlijke computers. Zelfs nadat het gesprek is vergeten, blijven de documenten vaak bestaan.",
        "Het grootste privacyrisico is vaak niet onderschepping door hackers. Het is dat vertrouwelijke informatie stilletjes kopieën opstapelt die niemand van plan was te bewaren. Hetzelfde patroon zien we wanneer teams [geheimen in chat plakken](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Cloudopslag lost een ander probleem op",
      takeaway: "Clouddrives zijn gebouwd voor blijvende toegang; tijdelijke levering heeft verlopen door ontwerp nodig.",
      paragraphs: [
        "Diensten zoals Google Drive, OneDrive, Dropbox en iCloud zijn uitstekend voor samenwerking, back-ups en langetermijnopslag. Veilige documentlevering is een ander probleem.",
        "Als meerdere collega’s continue toegang nodig hebben tot dezelfde bestanden, is cloudopslag het juiste hulpmiddel. Als je gewoon wilt dat één persoon vandaag een vertrouwelijk document ontvangt—en je het volgende maand niet meer beschikbaar hoeft te hebben—zijn de vereisten totaal anders.",
        "Permanente deellinks blijven vaak nog in browsergeschiedenis, oude e-mails, projectdocumenten, chatberichten en bladwijzers staan, lang na het moment waarop iedereen aannam dat ze verdwenen waren. Cloudopslag optimaliseert voor langetermijnbeschikbaarheid in plaats van tijdelijke levering.",
      ],
    },
    {
      title: "Veilig documenten delen gaat over meer dan versleuteling",
      takeaway: "Versleuteling beschermt de bits; levenscyclusbeheer bepaalt hoe lang blootstelling duurt.",
      paragraphs: [
        "Als mensen ‘veilig documenten delen’ horen, denken ze vaak alleen aan versleuteling. Versleuteling is essentieel. Het is niet het hele verhaal.",
        "Veilig delen gaat over het verminderen van onnodige blootstelling gedurende de hele levensduur van een document. Een goed ontworpen systeem zou moeten antwoorden op: Kan alleen de bedoelde ontvanger het document openen? Verloopt de toegang automatisch? Worden onnodige kopieën vermeden? Ontvangt de dienst het originele document of alleen versleutelde data?",
        "Beveiliging gaat niet alleen over het beschermen van een bestand tijdens het transport. Het gaat over het beperken van wie er toegang heeft—en voor hoe lang.",
      ],
    },
    {
      title: "E-mail versus eenmalige versleutelde link",
      takeaway:
        "E-mail is gebouwd om berichten te bewaren; eenmalige versleutelde links zijn gebouwd om een document af te leveren en het daarna niet meer te bewaren.",
      comparisonTable: {
        headers: ["", "E-mailbijlage", "Eenmalige versleutelde link"],
        rows: [
          ["Gemak van verzenden", "Zeer hoog", "Hoog"],
          [
            "Gecreëerde kopieën",
            "Veel (verzonden, inbox, apparaten, back-ups)",
            "Veel minder door ontwerp",
          ],
          ["Levensduur van toegang", "Vaak onbeperkt", "Verloopt of vernietigt zichzelf na gebruik"],
          [
            "Wat de dienst ziet",
            "Meestal het originele bestand",
            "Cijfertekst als eerst in de browser versleuteld",
          ],
          [
            "Beste voor",
            "Alledaagse, niet-gevoelige post",
            "Paspoorten, contracten, belasting- en identiteitsdocumenten",
          ],
        ],
        after: [
          "**Kant-en-klare samenvatting:** E-mailbijlage = eenvoudig verzenden, kopieën die jarenlang kunnen blijven bestaan. Eenmalige versleutelde link = versleuteling in de browser vóór upload, toegang die verloopt, veel minder overgebleven kopieën.",
        ],
      },
    },
    {
      title: "Browserversleuteling vermindert de benodigde vertrouwensbasis",
      takeaway: "Versleutel vóór upload zodat de dienst cijfertekst opslaat—niet je originele document.",
      paragraphs: [
        "Traditionele platforms voor het delen van bestanden ontvangen doorgaans je originele document voordat ze het opslaan of verwerken. Browsergebaseerde versleuteling werkt anders.",
        "Voordat het bestand je computer verlaat, versleutelt je browser het lokaal. De dienst slaat versleutelde cijfertekst op in plaats van het originele document. Zonder de bijbehorende ontsleutelingssleutel is de opgeslagen data onbegrijpelijk.",
        "In plaats van volledig te vertrouwen op de aanbieder nadat die je document heeft ontvangen, beperk je vooraf al de informatie die beschikbaar is voor de aanbieder. De gids van PrivateNote over [versleuteld versus veilig bestanden delen](blog:encrypted-vs-secure-file-sharing) behandelt dit model in meer detail.",
      ],
    },
    {
      title: "Eenmalige links verminderen langdurige blootstelling",
      takeaway: "De meeste lekken zijn achtergebleven toegang—geen Hollywood-hacking.",
      paragraphs: [
        "Veel documentlekken gebeuren omdat oude documenten blijven bestaan: e-mailbijlagen in inboxen, cloudlinks die nog werken, chatgeschiedenissen die oude bestanden bewaren.",
        "Eenmalige links hanteren een andere aanpak. De ontvanger haalt het document één keer op. Daarna wordt de versleutelde data verwijderd of verloopt de deellink permanent.",
        "Geen vergeten gedeelde map. Geen jarenoude downloadlink. Geen vertrouwelijk document dat stilletjes wacht om ontdekt te worden.",
        "Geen technologie kan voorkomen dat een geautoriseerde ontvanger opzettelijk een kopie bewaart na het openen van het document. Wat eenmalig delen wél bereikt, is het elimineren van veel van de onnodige kopieën die traditionele hulpmiddelen creëren.",
      ],
      calloutTitle: "Vuistregel",
      callout:
        "Als je je niet prettig zou voelen bij het publiceren van een document op een openbare website, denk dan goed na voordat je het als permanente e-mailbijlage verstuurt.",
    },
    {
      title: "Een extra laag: met wachtwoord beveiligd delen",
      takeaway: "Scheid de link van het wachtwoord zodat één fout niet beide blootlegt.",
      paragraphs: [
        "Soms verdient zelfs de deellink bescherming—een per ongeluk doorgestuurde e-mail, zichtbare browsergeschiedenis, of een gecompromitteerd berichtenaccount.",
        "Het toevoegen van een wachtwoord creëert een extra laag. Zelfs als iemand de deellink ontdekt, kan die het document nog steeds niet ontsleutelen zonder het wachtwoord.",
        "Voor bijzonder gevoelige informatie deel je het wachtwoord via een ander kanaal—telefoon of persoonlijk—in plaats van in hetzelfde bericht als de link. Hetzelfde patroon geldt wanneer je [een wachtwoord veilig deelt](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Veilig documenten delen in Europa en daarbuiten",
      takeaway: "De AVG noemt geen product—maar het beperken van toegang en bewaartermijn past bij de geest ervan.",
      paragraphs: [
        "In heel Europa verwerken organisaties persoonsgegevens onder de AVG (GDPR). Die schrijft geen specifieke bestandsdeeldienst voor, maar vereist wel passende technische en organisatorische maatregelen op basis van risico.",
        "Versleuteld delen, beperkte beschikbaarheid en minder onnodige kopieën zijn praktische voorbeelden van die principes. Dezelfde ideeën gelden of je nu documenten stuurt naar een boekhouder, werkgever, advocaat, universiteit, zorgverlener, bank, verzekeraar of overheidsinstantie.",
      ],
    },
    {
      title: "Wanneer moet je veilig documenten delen gebruiken?",
      takeaway: "Als het zou uitmaken dat dit document openbaar werd, stuur het dan niet als permanente bijlage.",
      paragraphs: [
        "Dat omvat paspoorten, identiteitskaarten, rijbewijzen, financiële gegevens, belastingdocumenten, hypotheekaanvragen, arbeidscontracten, verzekeringspapieren, juridische overeenkomsten, medische rapporten, vertrouwelijke bedrijfsinformatie, onderzoeksgegevens, klantinformatie en intellectueel eigendom.",
        "Hoe moeilijker een document te vervangen zou zijn—of hoe groter de gevolgen van blootstelling—hoe zorgvuldiger het gedeeld moet worden.",
      ],
    },
    {
      title: "Praktische manieren om risico te verminderen",
      takeaway: "Perfecte beveiliging bestaat niet; minder kopieën en kortere toegang helpen bijna altijd.",
      paragraphs: [
        "Voordat je een vertrouwelijk document verstuurt, doorloop deze korte checklist:",
      ],
      checklist: [
        "Controleer de ontvanger — juiste persoon, juist adres of kanaal",
        "Stuur alleen wat nodig is — vereiste pagina’s, niet het hele pakket wanneer mogelijk",
        "Gebruik een verlopende of eenmalige link — geen permanente bijlage",
        "Voeg een wachtwoord toe voor zeer gevoelige bestanden — en deel het via een apart kanaal",
        "Bevestig de levering en ruim daarna op — verwijder lokale en mailboxkopieën die je niet meer nodig hebt",
      ],
      paragraphsAfterChecklist: [
        "Het aantal kopieën verminderen is een van de simpelste en effectiefste privacyverbeteringen die iemand kan doorvoeren.",
      ],
      midCta: {
        body: "Klaar om een paspoortscan, contract of belastingbestand te versturen zonder een permanent spoor in e-mail achter te laten?",
        button: "Start een veilige bestandsoverdracht",
      },
    },
    {
      title: "Veelgestelde vragen",
      takeaway: "Versleuteling helpt; verlopen en minder kopieën maken het werk af.",
      faqs: [
        {
          question: "Is een met wachtwoord beveiligde PDF voldoende?",
          answer:
            "Het helpt, maar het lost het probleem van blijvend bestaan niet op. De versleutelde PDF kan nog jarenlang in e-mailarchieven, cloudback-ups en downloads blijven staan. Combineer versleuteling met verlopende of eenmalige levering.",
        },
        {
          question: "Is HTTPS niet al veilig?",
          answer:
            "HTTPS beschermt data tijdens het transport. Het voorkomt niet noodzakelijk dat de ontvangende dienst het bestand daarna kan openen of opslaan. Browsergebaseerde versleuteling versleutelt vóór upload.",
        },
        {
          question: "Wat dacht je van versleutelde ZIP-bestanden?",
          answer:
            "Redelijk als je sterke versleuteling gebruikt en het wachtwoord apart deelt—maar ze laten nog steeds permanente bestanden achter in e-mailsystemen, tenzij de deelmethode ook beperkt hoe lang het bestand beschikbaar blijft.",
        },
        {
          question: "Kan veilig delen voorkomen dat de ontvanger het document opslaat?",
          answer:
            "Nee. Zodra iemand legitiem een document ontvangt, kan die het opslaan, afdrukken of het scherm fotograferen. Veilig delen vermindert onnodige blootstelling vóór en na levering; het kan opzettelijke acties van vertrouwde ontvangers niet voorkomen.",
        },
      ],
    },
    {
      title: "Vertrouwelijke documenten delen met PrivateNote",
      takeaway:
        "PrivateNote is gebouwd voor tijdelijke levering van versleutelde documenten—niet permanente cloudopslag.",
      paragraphs: [
        "PrivateNote is ontworpen rond een simpele observatie: veel vertrouwelijke documenten moeten alleen lang genoeg online bestaan voor één ontvanger om ze op te halen.",
        "In plaats van documenten delen te behandelen als permanente opslag, versleutelt PrivateNote bestanden in je browser vóór het uploaden en slaat alleen de resulterende versleutelde cijfertekst op. Je kunt automatisch verlopen kiezen, eenmalige links maken en, waar toepasselijk, het document beschermen met een extra wachtwoord via [veilige bestandsoverdracht](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Wat PrivateNote doet", "Wat het niet doet"],
        rows: [
          [
            "Versleutelen in je browser vóór upload",
            "Je originele document op de server lezen",
          ],
          [
            "Afzonderlijke cryptografische sleutels gebruiken voor notitietekst, bestanden en metadata",
            "Deze zaken onder één herbruikbare sleutel mengen",
          ],
          [
            "AES-256-GCM geauthenticeerde versleuteling gebruiken, met beleid (verlopen / toegangslimieten) gebonden aan de cijfertekst",
            "Vertrouwen op ‘versleuteling’ die negeert wie de notitie mag openen of voor hoe lang",
          ],
          [
            "Eenmalige en verlopende links ondersteunen om overgebleven toegang te beperken",
            "Documenten standaard voor onbepaalde tijd beschikbaar houden voor het gemak",
          ],
          [
            "Je een optioneel wachtwoord laten toevoegen als tweede factor voor de link",
            "Een geautoriseerde ontvanger tegenhouden om na het openen op te slaan of af te drukken",
          ],
          [
            "Onnodige online kopieën vóór en na levering verminderen",
            "Organisatorisch proces, ontvangersbeoordeling of langetermijn-vaultopslag vervangen",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Deze aanpak kan niet voorkomen dat een geautoriseerde ontvanger een kopie bewaart na het openen van het document—geen technologie kan dat. Wat het wél vermindert, is het aantal onnodige kopieën dat vóór en na levering online blijft staan.",
      ],
    },
    {
      title: "Tot slot",
      takeaway:
        "De beste controle is vaak de kortste levensduur—alleen de mensen die het nodig hebben, alleen zo lang als ze het nodig hebben.",
      paragraphs: [
        "Het internet heeft het delen van documenten bijna moeiteloos gemaakt. Het heeft het ook opmerkelijk eenvoudig gemaakt om ze voor altijd te bewaren.",
        "De meeste vertrouwelijke documenten hoeven niet maandenlang of jarenlang toegankelijk te blijven. Ze moeten alleen veilig bij de bedoelde ontvanger terechtkomen.",
        "Het kiezen van een methode die vóór upload versleutelt, onnodige kopieën beperkt en data verwijdert zodra die haar doel heeft gediend, is een van de simpelste manieren om privacy te verbeteren—zonder dat alledaags documenten delen veel moeilijker wordt.",
        "De sterkste beveiligingsmaatregel is niet altijd de meest geavanceerde cryptografie. Soms is het gewoon ervoor zorgen dat een vertrouwelijk document alleen bestaat voor de mensen die het nodig hebben, en alleen zo lang als ze het nodig hebben.",
      ],
    },
  ],
  ctaTitle: "Verstuur het document. Houd de kopieën onder controle.",
  ctaBody:
    "Versleutel een bestand in je browser, stel een vervaldatum of eenmalige opening in, en deel een link—geen permanente bijlage die voor altijd in iemands inbox blijft staan.",
  ctaButton: "Verstuur een bestand veilig",
};
