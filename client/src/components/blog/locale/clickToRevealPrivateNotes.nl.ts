import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesNl: BlogGuideArticleCopy = {
  heroAlt:
    "Ontvangerscherm van een PrivateNote-openpagina met een duidelijke waarschuwing Open wanneer je klaar bent vóór decryptie",
  heroCaption:
    "Openen is bewust: de ontvanger kiest wanneer te ontsleutelen—en wanneer het vernietigingsbeleid kan ingaan.",
  intro: [
    "Een eenmalige notitie openen moet bewust gebeuren. PrivateNote toont daarom een **klik-om-te-openen**-poort met een expliciete waarschuwing voordat decryptie begint.",
    "De link kan vroeg aankomen. De ciphertext kan versleuteld blijven liggen tot iemand klaar is. Ontsleutelen en verbruiken gebeuren pas nadat de ontvanger **Notitie openen** bevestigt, met tekst die de consequentie duidelijk maakt: open alleen als je klaar bent—dit kan niet ongedaan worden gemaakt.",
    "Die pauze is opzettelijk. Ze vermindert accidentele opens door linkvoorbeelden, verkeerde taps of openen op het verkeerde apparaat voordat je klaar bent om een eenmalige notitie te verbruiken.",
  ],
  sections: [
    {
      title: "Een bevestigingsstap, geen geplande ontgrendeling",
      takeaway:
        "De ontvanger kiest wanneer te openen; de server ontgrendelt de notitie niet op een kalender.",
      paragraphs: [
        "Er is vandaag geen schakelaar «ontgrendel deze notitie volgende dinsdag om 09:00» in het product. In plaats daarvan scheidt PrivateNote **bezorging** van **openen**.",
        "Je kunt de link sturen wanneer coördinatie dat vereist. De ontvanger kan wachten tot hij of zij op een privé-scherm zit, eventuele verificatiecode of wachtwoordzin klaar heeft, en voorbereid is op een eenmalige open. Het geheim blijft verzegeld tot die bewuste handeling.",
        "Verwante tijdcontroles blijven belangrijk: levensduur van de notitie (hoe lang de link werkt als hij nooit wordt geopend) en downloadvensters voor bijlagen (hoe lang bestanden na openen ophaalbaar blijven). Die beperken beschikbaarheid; klik-om-te-openen beperkt *wanneer decryptie start*.",
      ],
    },
    {
      title: "Waarom accidentele opens duur zijn",
      takeaway: "Eenmalige notities straffen nieuwsgierigheid en verkeerde taps even hard.",
      paragraphs: [
        "Als een notitie is geconfigureerd voor één weergave, kan de eerste geslaagde open verdere toegang vernietigen. Openen op een telefoonvergrendelscherm, een gedeelde laptop of een café met openbaar wifi kan de enige weergave verspillen—of inhoud op de verkeerde plek tonen.",
        "Het openscherm dwingt een pauze af. Gecombineerd met [ontvangersverificatiecodes](blog:recipient-verification-code-before-reveal) krijg je twee bewuste stappen voordat plaintext verschijnt.",
      ],
      calloutTitle: "Producttekst, met opzet",
      callout:
        "«Open alleen als je er klaar voor bent — dit kan niet ongedaan worden gemaakt.» is geen marketingpraat. Het is de veiligheidsreling voor vernietig-bij-openen-workflows.",
    },
    {
      title: "Hoe de ontvangersstroom werkt",
      takeaway: "Op de link landen → optioneel verifiëren → openen → lokaal ontsleutelen.",
      checklist: [
        "De volledige PrivateNote-URL openen",
        "Een verificatiecode invoeren als de afzender er een vereiste",
        "De open-waarschuwing lezen",
        "Alleen op Notitie openen drukken als je klaar bent",
        "Decryptie gebeurt in de browser; volg daarna eventueel open-/vernietigingsbeleid",
      ],
      paragraphsAfterChecklist: [
        "Afzenders kunnen de pauze versterken met een duidelijke instructie: «Ik stuur de link nu; open hem pas als we in het gesprek zitten.» Het bevestigingsscherm ondersteunt die instructie, maar plant of dwingt technisch geen toekomstig openingstijdstip af.",
        "Voor het bredere eenmalige model, zie [eenmalige geheime links](blog:one-time-secret-links) en [hoe maak je een privénotitie](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Stuur een notitie die de ontvanger kan vasthouden tot hij of zij klaar is om te openen.",
        button: "Een privénotitie maken",
      },
    },
    {
      title: "Tijdcontroles die bij openen passen",
      takeaway:
        "Levensduur, openlimieten en bestandsvensters vullen de klikpoort aan.",
      comparisonTable: {
        headers: ["Controle", "Beschermt tegen", "Typisch gebruik"],
        rows: [
          [
            "Klik-om-te-openen",
            "Accidentele of voortijdige decryptie",
            "Elke eenmalige of zeer gevoelige notitie",
          ],
          [
            "Levensduur van de notitie",
            "Verouderde ongeopende links",
            "«Als ze niet binnen 24 uur openen, vernietigen»",
          ],
          [
            "Open-/weergavelimiet",
            "Herhaalde toegang na overdracht",
            "Eenmaal (of een klein vast aantal)",
          ],
          [
            "Downloadvenster voor bijlagen",
            "Eindeloze herdownloads van bestanden na openen",
            "15 minuten standaard; langer op in aanmerking komende plannen",
          ],
        ],
      },
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Kan ik een notitie plannen om later te ontgrendelen?",
          answer:
            "Niet als server-side planning. Deel de link vroeg indien nodig en vraag de ontvanger te wachten—klik-om-te-openen plus optionele verificatie houdt de inhoud verzegeld tot bevestiging.",
        },
        {
          question: "Ontsleutelt een linkvoorbeeld de notitie?",
          answer:
            "De open-bevestiging is de bewuste decryptiestap. Ontvangers moeten niet op Openen drukken voordat ze klaar zijn dat het vernietigingsbeleid geldt.",
        },
        {
          question: "Wat als iemand de link per ongeluk opent?",
          answer:
            "Als ze stoppen vóór Openen, kunnen ze later mogelijk terugkomen (afhankelijk van de levensduur). Na Openen van een eenmalige notitie is verdere toegang doorgaans weg—stuur zo nodig een nieuwe notitie.",
        },
        {
          question: "Hoe hangt dit samen met e-mailmeldingen?",
          answer:
            "Open- en vernietigingsmeldingen laten de afzender weten wanneer de status verandert. Ze bevatten geen berichtinhoud. Zie [hoe je weet wanneer een geheime link is geopend](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Kort samengevat",
      takeaway:
        "Openen is een bewuste handeling, geen automatische gevolg van het laden van een link.",
      paragraphs: [
        "Klik-om-te-openen laat je een link vroeg sturen zonder de notitie te ontsleutelen enkel omdat de landingspagina is geladen.",
        "Combineer het met korte levensduren, verificatie wanneer kanalen zwak zijn, en duidelijke instructies aan de ontvanger—en je krijgt een praktische pauze voordat het geheim wordt getoond, zonder te pretenderen dat het product een screenshot op afstand kan wissen.",
      ],
    },
  ],
  ctaTitle: "Laat de ontvanger pas openen wanneer hij of zij klaar is.",
  ctaBody:
    "PrivateNote houdt de ciphertext verzegeld tot de ontvanger het openen bevestigt—zo branden eenmalige notities minder snel door een accidentele tap.",
  ctaButton: "Maak een notitie met klik-om-te-openen",
};
