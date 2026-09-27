import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessNl: BlogGuideArticleCopy = {
  heroAlt:
    "Accountactiviteit met een niet-geopende notitie en een duidelijke optie om de link in te trekken",
  heroCaption:
    "Van gedachten veranderd voordat iemand hem opende? Vernietig de link. Bewijs nodig? Bekijk bewijs van toegang.",
  intro: [
    "Veilig delen gaat niet alleen over versleuteling op het moment van verzenden. Het gaat ook over **controle daarna**: een link stoppen die je niet had moeten sturen, en een privacyvriendelijk register bewaren van wat er met een wél verzonden link is gebeurd.",
    "De Starter- en Business-abonnementen van PrivateNote voegen twee aanvullende tools toe. **Intrekken** vernietigt een niet-geopende link zodat die niet meer kan worden onthuld. **Bewijs van toegang** toont een eenvoudige tijdlijn—aangemaakt, geopend, bijlage gedownload, vernietigd, verlopen of ingetrokken—zonder notitie-inhoud bloot te leggen.",
    "Samen beantwoorden ze de twee vervolgvragen die teams echt stellen: «Kan ik het terugdraaien?» en «Kan ik laten zien dat de link is geopend?»",
  ],
  sections: [
    {
      title: "Intrekken zolang hij nog niet is geopend",
      takeaway:
        "Intrekken werkt vóór reveal—niet nadat iemand al een kopie heeft ontsleuteld.",
      paragraphs: [
        "Als een notitie nog niet is geopend, kun je hem intrekken vanaf het succes-scherm na aanmaken of via Account → Activiteit. De link werkt niet meer; ontvangers die later komen, zien dat toegang weg is.",
        "Intrekken is de juiste zet wanneer je de verkeerde ontvanger hebt geplakt, het geheim in de verkeerde chat hebt gezien, of hebt besloten dat de overdracht moet wachten. Het is **geen** externe verwijdering van een bestand dat iemand na reveal al heeft gedownload—geen eerlijk E2EE-overdrachtstool kan dat beloven.",
      ],
      checklist: [
        "Maak de notitie op Starter of Business",
        "Ziet iets er verkeerd uit, trek hem meteen in vanaf het succes-scherm",
        "Of open Account → Activiteit en trek in zolang de status nog niet-geopend is",
        "Stuur een vervangende notitie als de ontvanger het geheim nog nodig heeft",
      ],
      midCta: {
        body: "Heb je terugnames en bewijzen nodig bij gevoelige overdrachten?",
        button: "Maak een notitie die je kunt intrekken",
      },
    },
    {
      title: "Bewijs van toegang zonder inhoudslekken",
      takeaway:
        "Een privacyvriendelijke statusregistratie: de link is geopend—geen transcript van het lezen.",
      paragraphs: [
        "Bewijs van toegang is bedoeld voor operationele en compliance-gesprekken die bewijs van leveringsgebeurtenissen nodig hebben zonder geheimen in e-mail of tickets te zetten.",
        "De tijdlijn blijft op hoog niveau: aangemaakt, link geopend, bijlage gedownload (wanneer bijgehouden), vernietigd, verlopen, ingetrokken. Dat sluit aan bij de privacyhouding van [open-alerts](blog:know-when-secret-link-opened): status, geen inhoud.",
      ],
      calloutTitle: "Lees het label zorgvuldig",
      callout:
        "Bewijs van toegang is een ontvangstbewijs dat de link is geopend—geen cryptografisch bewijs dat een specifieke persoon elk woord zorgvuldig heeft gelezen, en geen DRM tegen screenshots.",
    },
    {
      title: "Hoe intrekken en bewijs samengaan",
      takeaway:
        "Voorkom toegang wanneer je kunt; documenteer toegang wanneer je moet.",
      comparisonTable: {
        headers: ["Situatie", "Gebruik", "Uitkomst"],
        rows: [
          [
            "Verkeerde ontvanger, nog niet geopend",
            "Intrekken",
            "Link sterft; maak een gecorrigeerde notitie",
          ],
          [
            "Overdracht afgerond, auditor vraagt «is hij geopend?»",
            "Bewijs van toegang",
            "Toon tijdlijn-gebeurtenissen zonder inhoud",
          ],
          [
            "Notitie al onthuld",
            "Roteer het geheim / beschouw als blootgesteld",
            "Intrekken herstelt geen plaintext-kopieën meer",
          ],
          [
            "Wachten op ontvanger",
            "Alerts + levensduur",
            "Volg op of laat automatisch verlopen als nooit geopend",
          ],
        ],
      },
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Kan ik intrekken nadat de ontvanger de notitie heeft geopend?",
          answer:
            "Intrekken richt zich op niet-geopende notities. Na reveal ga ervan uit dat de ontvanger kan bewaren wat hij zag; roteer credentials of behandel het document als geleverd.",
        },
        {
          question: "Bevat bewijs van toegang de berichttekst?",
          answer:
            "Nee. Het is alleen een status-tijdlijn. Inhoud blijft buiten Activiteit en bewijsweergaven.",
        },
        {
          question: "Is intrekken beschikbaar op Free?",
          answer:
            "Intrekken en bewijs van toegang zijn Starter/Business-mogelijkheden. Free-gebruikers krijgen nog steeds versleuteling, korte levensduren en open-alerts zodra ze zijn aangemeld met een geverifieerd e-mailadres.",
        },
        {
          question: "Waar vind ik het bewijs later?",
          answer:
            "Open Account → Activiteit, zoek de notitie en kies Bewijs van toegang bekijken wanneer het abonnement dat ondersteunt.",
        },
      ],
    },
    {
      title: "De kern",
      takeaway: "Beheer de niet-geopende link; documenteer de geopende.",
      paragraphs: [
        "Versleuteling beantwoordt «wie kan dit onderweg en in rust lezen.» Intrekken en bewijs beantwoorden «wat doen we hierna.»",
        "Gebruik ze samen met [verificatiecodes](blog:recipient-verification-code-before-reveal) en [open-alerts](blog:know-when-secret-link-opened) voor een complete overdrachtslus—van verzenden naar bevestigen, tot terugname of ontvangstbewijs.",
      ],
    },
  ],
  ctaTitle: "Neem een niet-geopend geheim terug.",
  ctaBody:
    "Trek links in die nooit zouden moeten openen, en bewaar een privacyvriendelijke tijdlijn wanneer je moet laten zien dat een overdracht is geopend—zonder het geheim per e-mail te sturen.",
  ctaButton: "Maak een private note",
};
