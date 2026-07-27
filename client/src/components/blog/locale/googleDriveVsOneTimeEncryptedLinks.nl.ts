import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksNl: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Rustige bureauscène die een tijdelijke bestandsuitwisseling suggereert versus langdurige cloud-samenwerkingsmappen",
  heroCaption:
    "Drive blinkt uit bij doorlopende samenwerking. Eenmalige links blinken uit wanneer het bestand alleen voor de overdracht hoeft te bestaan.",
  intro: [
    "Google Drive is een van de beste tools om bestanden op te slaan en dagen, weken of jaren samen te werken. [Eenmalige versleutelde links](blog:one-time-secret-links) lossen een ander probleem op: vertrouwelijke informatie veilig één keer overdragen en de toegang automatisch intrekken wanneer die niet meer nodig is.",
    "Geen van beide aanpakken is universeel beter. De juiste keuze hangt af van of je samenwerkt aan een document of alleen vertrouwelijke informatie wilt afleveren.",
  ],
  sections: [
    {
      title: "Waarom dit belangrijk is",
      takeaway:
        "Gemak maakt Drive de standaard—zelfs wanneer het bestand maar één keer bekeken hoeft te worden.",
      paragraphs: [
        "Voor veel mensen is Google Drive het standaardantwoord geworden wanneer een bestand gedeeld moet worden. Het is ingebouwd in Gmail, Android, Google Workspace en talloze bedrijfsworkflows. Een PDF, spreadsheet of contract sturen? Upload naar Drive, kopieer de link en verstuur.",
        "Dat gemak heeft Drive enorm succesvol gemaakt—maar het kan ons ook verleiden dezelfde tool te gebruiken voor situaties waarvoor hij niet specifiek is ontworpen.",
        "Stel je voor dat je een paspoortkopie naar je accountant stuurt, een getekend arbeidscontract naar HR, of belastingdocumenten naar een financieel adviseur. In de meeste gevallen heeft de ontvanger die bestanden maar één keer nodig. Na afronding van de taak vergroot elke resterende kopie alleen de kans dat de informatie langer toegankelijk blijft dan nodig.",
        "Het grootste risico is zelden dat iemand het bestand onderschept tijdens het transport. Moderne clouddiensten versleutelen gegevens [onderweg](blog:encrypted-vs-secure-file-sharing). Het grotere probleem is **retentie**. Gevoelige informatie blijft vaak in cloudopslag, e-mailmeldingen, gesynchroniseerde mappen en gedownloade bestanden lang nadat iedereen is vergeten dat ze bestaan.",
      ],
    },
    {
      title: "Google Drive is gebouwd voor samenwerking",
      takeaway: "Gelijktijdig bewerken, versiegeschiedenis en gedeelde mappen zijn sterke punten—geen gebreken.",
      paragraphs: [
        "Google Drive is uitstekend in mensen samen laten werken. Meerdere mensen kunnen hetzelfde document tegelijk bewerken, wijzigingen worden automatisch opgeslagen, versiegeschiedenis maakt eerdere revisies eenvoudig terug te zetten, en rechten kunnen worden aangepast wanneer teamleden bij een project komen of vertrekken. Voor doorlopend werk zijn dit enorme voordelen.",
        "Dit is precies de omgeving waarvoor Drive is ontworpen. Een projectmap kan maanden actief blijven terwijl documenten evolueren en nieuwe bestanden worden toegevoegd.",
        "De uitdaging ontstaat wanneer dezelfde samenwerkingsfuncties worden gebruikt voor informatie die nooit beschikbaar had moeten blijven.",
      ],
    },
    {
      title: "De verborgen kosten van langdurige toegang",
      takeaway:
        "Tijdelijke overdrachten laten permanente sporen achter wanneer het platform optimaliseert voor beschikbaarheid.",
      paragraphs: [
        "De meeste vertrouwelijke bestanden hoeven niet voor altijd beschikbaar te zijn. Een paspoortkopie is misschien alleen nodig voor identiteitsverificatie. Een belastingaangifte alleen voor een specifieke indiening. Een API-sleutel kan één keer gebruikt en daarna geroteerd worden. Zodra de ontvanger klaar is, levert verdere opslag weinig voordeel op.",
        "Helaas is toegang intrekken niet altijd eenvoudig. Mensen downloaden bestanden naar laptops. Ze synchroniseren mappen tussen apparaten. E-mailuitnodigingen blijven in inboxen. Gedeelde mappen blijven bestaan. Maanden later ontdekt iemand een oude map met rechten die niemand zich herinnerde te hebben gegeven.",
        "Geen van deze gebeurtenissen is een falen van Google Drive. Het is simpelweg het natuurlijke gevolg van een samenwerkingsplatform gebruiken voor een tijdelijke overdracht—hetzelfde retentiepatroon dat ontstaat wanneer mensen [geheimen e-mailen](blog:why-email-is-worst-for-secrets) of [documenten in chat](blog:secrets-never-send-in-chat) laten staan.",
      ],
    },
    {
      title: "Wanneer eenmalige links meer zin hebben",
      takeaway:
        "Eenmaal afleveren, by design laten verlopen—zonder van elke overdracht een gedeelde werkruimte te maken.",
      paragraphs: [
        "Eenmalige versleutelde links zijn ontworpen met een ander doel. In plaats van een gedeelde werkruimte te creëren, richten ze zich op het afleveren van vertrouwelijke informatie met de kleinst mogelijke digitale voetafdruk. De informatie wordt versleuteld voordat ze je browser verlaat, en toegang kan worden beperkt tot één weergave of een korte verlooptijd. Zodra de overdracht klaar is, is de link onbruikbaar.",
        "Het gaat er niet om cloudopslag te vervangen. Het gaat erom te erkennen dat niet elk bestand permanente opslag of doorlopende rechten verdient.",
        "Als je een herstelcode naar een collega stuurt, een getekend contract naar een klant, of medische dossiers naar een specialist, heb je waarschijnlijk geen gezamenlijk bewerken, versiegeschiedenis of gedeelde map nodig. Je hebt alleen nodig dat de juiste persoon de informatie veilig ontvangt—zie ook [hoe je gevoelige documenten veilig verstuurt](blog:send-sensitive-documents-securely).",
        "Diensten zoals [PrivateNote](app:secure-file-transfer) zijn rond dit model van tijdelijk delen gebouwd. In plaats van langetermijnopslag te stimuleren, minimaliseren ze retentie door client-side encryptie te combineren met automatische verloop.",
      ],
    },
    {
      title: "Welke methode moet je kiezen?",
      takeaway:
        "Stem de tool af op de levensduur van de informatie—niet op het meest vertrouwde platform.",
      paragraphs: [
        "De beslissing gaat minder over abstracte „veiligheid” en meer over het doel.",
        "Als meerdere mensen een document in de loop van de tijd moeten beoordelen, bewerken en opnieuw openen, is Google Drive een uitstekende keuze. Reacties, versiegeschiedenis en gedeelde mappen maken samenwerking eenvoudig.",
        "Als de informatie maar één keer afgeleverd hoeft te worden, past een eenmalige versleutelde link vaak beter. Het maakt langdurige rechtenbeheer overbodig, vermindert onnodige kopieën en beperkt hoe lang de informatie beschikbaar blijft.",
      ],
      calloutTitle: "Vuistregel",
      callout:
        "Kies de tool die past bij hoe lang de informatie daadwerkelijk beschikbaar moet blijven—niet de tool die je uit gewoonte opent.",
    },
    {
      title: "Vergelijking",
      takeaway: "Samenwerkingsfuncties en efemere aflevering lossen verschillende taken op.",
      comparisonTable: {
        headers: ["Functie", "Google Drive", "Eenmalige versleutelde link"],
        rows: [
          ["Ontworpen voor samenwerking", "Ja", "Nee"],
          ["Langetermijnopslag", "Ja", "Nee"],
          ["Client-side end-to-end encryptie", "Niet standaard*", "Ja"],
          ["Automatische verloop", "Nee (handmatige opschoning)", "Ja"],
          ["Eenmalige leestoegang", "Nee", "Ja"],
          ["Doorlopend rechtenbeheer", "Ja", "Nee"],
          ["Beste voor tijdelijk vertrouwelijk delen", "Soms", "Ja"],
        ],
        after: [
          "*Standaard Drive versleutelt gegevens onderweg en in rust met sleutels die door Google worden beheerd. Google Workspace biedt optionele [client-side encryptie](https://support.google.com/a/answer/10741875) voor sommige organisaties, maar alledaagse deellinks optimaliseren nog steeds voor duurzame toegang in plaats van burn-after-reading-aflevering.",
        ],
      },
    },
    {
      title: "Checklist met best practices",
      takeaway: "Kleine gewoonten verminderen retentierisico, ongeacht welke tool je kiest.",
      paragraphs: [
        "Welke tool je ook kiest, een paar eenvoudige gewoonten verminderen onnodige blootstelling aanzienlijk.",
      ],
      checklist: [
        "Deel alleen wat de ontvanger nodig heeft—vermijd hele mappen vol ongegerelateerde persoonlijke gegevens",
        "Verwijder onnodige metadata uit PDF’s, Office-bestanden en afbeeldingen wanneer praktisch",
        "Als je een wachtzin gebruikt, stuur die via een apart kanaal (out-of-band / OOB)",
        "Na afronding: trek gedeelde toegang in, verwijder tijdelijke lokale kopieën en vermijd onbeperkte gedeelde mappen",
      ],
      paragraphsAfterChecklist: [
        "Out-of-band-aflevering betekent dat de versleutelde link via één kanaal gaat (bijvoorbeeld e-mail) terwijl de wachtzin via een ander kanaal gaat (Signal, sms of een telefoongesprek). Het compromitteren van één kanaal alleen mag niet genoeg zijn om het bestand te openen.",
        "Voor een diepere workflow rond documentoverdrachten, volg de [gids voor gevoelige documenten](blog:send-sensitive-documents-securely). Voor hoe browserversleuteling verschilt van transportversleuteling, zie [versleuteld vs veilig bestanden delen](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is Google Drive veilig?",
          answer:
            "Ja—Google Drive is een volwassen cloudplatform dat informatie versleutelt onderweg en in rust. De totale blootstelling hangt nog steeds af van hoe bestanden worden gedeeld, hoe rechten worden beheerd en hoe lang documenten toegankelijk blijven nadat de taak is afgerond.",
        },
        {
          question: "Is Google Drive end-to-end versleuteld?",
          answer:
            "Niet in de zin die wordt gebruikt voor client-side versleutelde messaging of browserversleutelde eenmalige links. Voor standaard Drive-opslag beheert Google de encryptiesleutels. Optionele Workspace client-side encryptie verandert dat beeld voor in aanmerking komende organisaties, maar alledaags delen „iedereen met de link” laat nog steeds duurzame kopieën en rechtenoppervlakken achter die efemere aflevering vermijdt. Zie [wat end-to-end encryptie betekent](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Zijn eenmalige links veiliger dan Google Drive?",
          answer:
            "Voor tijdelijke vertrouwelijke overdrachten verminderen ze vaak het langetermijnrisico omdat ze retentie minimaliseren en toegang automatisch kunnen intrekken na aflevering. Voor gezamenlijk bewerken en doorlopende projecten blijft Drive de betere tool. Veiligheid volgt het doel—niet een universele ranglijst.",
        },
        {
          question: "Wat als ik een eenmalige link naar de verkeerde persoon stuur?",
          answer:
            "Bescherm de inhoud met een wachtzin, gebruik een korte verlooptijd en vernietig de notitie voordat deze wordt geopend als je tool dat toelaat. De ontvanger verifiëren vóór verzending blijft de sterkste verdediging. Instanties zoals [CISA](https://www.cisa.gov/) benadrukken consequent het beperken van toegangsduur en least privilege—dezelfde ideeën achter kortlevende versleutelde links.",
        },
      ],
    },
  ],
  ctaTitle: "Heb je een tijdelijke vertrouwelijke overdracht nodig?",
  ctaBody:
    "Google Drive en eenmalige versleutelde links zijn complementaire tools. Als mensen in de loop van de tijd samen aan documenten moeten werken, is Drive een van de beste samenwerkingsplatforms. Als je doel is vertrouwelijke informatie één keer over te dragen en toegankelijkheid zo kort mogelijk te houden, maak dan een end-to-end versleutelde eenmalige link in je browser—zonder permanente kopieën achter te laten in e-mail of gedeelde mappen.",
  ctaButton: "Maak een veilige eenmalige link",
};
