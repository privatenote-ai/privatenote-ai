import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedNl: BlogGuideArticleCopy = {
  heroAlt:
    "Meldingenpaneel met een waarschuwing dat een notitie is geopend, zonder zichtbare berichtinhoud",
  heroCaption:
    "Alleen status: geopend, vernietigd, verlopen of ingetrokken—nooit het geheim zelf.",
  intro: [
    "Nadat je een gevoelige link hebt gestuurd, is de natuurlijke vraag: **hebben ze hem al geopend?** Stil afwachten is stressvol; nazitten in de chat creëert alleen meer plaintext-ruis.",
    "PrivateNote kan je waarschuwen wanneer de bezorgstatus verandert—per e-mail, via live meldingen in het tabblad zolang de site open is, en optioneel via browsermeldingen—zonder ooit de inhoud van de notitie te e-mailen.",
    "Die zichtbaarheid helpt je credentials te roteren, ongeopende links in te trekken, of gewoon te stoppen met afvragen of de overdracht is aangekomen.",
  ],
  sections: [
    {
      title: "Wat je kunt weten (en wat niet)",
      takeaway: "Meldingen gaan over levenscyclusgebeurtenissen, niet over berichttekst.",
      paragraphs: [
        "Typische gebeurtenissen zijn notitie geopend, vernietigd, verlopen, bijlage gedownload en ingetrokken. De formulering blijft bewust grof: genoeg voor operationeel vertrouwen, geen surveillancefeed van leesgedrag.",
        "Het privacymodel van PrivateNote blijft gelden. Statusmail en toasts bevatten het ontsleutelde geheim **niet**. Als je een gestructureerde ontvangstbevestiging nodig hebt voor een audittrail, gebruik dan **bewijs van toegang** op in aanmerking komende plannen—beschreven in [intrekken en bewijs van toegang](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signaal", "Waar het verschijnt", "Geschikt voor"],
        rows: [
          [
            "E-mailwaarschuwingen (geverifieerd account)",
            "Je account-e-mail",
            "Asynchrone bevestiging wanneer je weg bent van de site",
          ],
          [
            "Live meldingen in het tabblad (ingelogd)",
            "PrivateNote open in een browser",
            "Bijna realtime bewustzijn tijdens een actieve overdracht",
          ],
          [
            "Browsermeldingen (toestemming vereist)",
            "OS-toestemming gevraagd vanuit Pas aan",
            "Seintje wanneer het tabblad op de achtergrond staat",
          ],
          [
            "Account → Activiteit (afhankelijk van plan)",
            "Je privé-activiteitengeschiedenis",
            "Later terugkijken wat er is gebeurd",
          ],
        ],
      },
    },
    {
      title: "Hoe je meldingen inschakelt",
      takeaway:
        "Log in, verifieer e-mail, schakel daarna meldingen per notitie of in voorkeuren in.",
      checklist: [
        "Log in en verifieer het e-mailadres van je account",
        "Schakel e-mailmeldingen in via Account → Voorkeuren",
        "Bij het maken van een notitie: open Pas aan → E-mailwaarschuwingen",
        "Kies melden bij openen, of bij openen en vernietigen (voor eenmalig-leesstromen)",
        "Sta browsermeldingen toe als je pings op OS-niveau wilt",
        "Houd PrivateNote open voor live toasts in het tabblad tijdens kritieke overdrachten",
      ],
      paragraphsAfterChecklist: [
        "Openmeldingen zijn beschikbaar voor ingelogde Free-gebruikers zodra e-mail is geverifieerd; rijkere tracking zoals gebeurtenissen bij bijlage-download en intrekgereedschap breidt uit op betaalde plannen.",
        "Voor het onderliggende overdrachtspatroon, zie [hoe maak je een privénotitie](blog:how-to-make-a-private-note) en [stuur een geheim bericht zonder account](blog:send-secret-message-without-account) voor ontvangers.",
      ],
      midCta: {
        body: "Stuur je een tijdgevoelig geheim en heb je bevestiging nodig dat het is aangekomen?",
        button: "Maak een notitie met openmeldingen",
      },
    },
    {
      title: "Meldingen operationeel gebruiken",
      takeaway:
        "Behandel «geopend» als een seintje om te roteren of de lus te sluiten—niet als bewijs van zorgvuldig lezen.",
      bullets: [
        "Wachtwoordoverdracht: bij geopend, roteer of bevestig dat de ontvanger de credential heeft gewijzigd",
        "Documentverzending: geopend + bijlage gedownload (waar beschikbaar) betekent dat het bestandsvenster actief is",
        "Geen opening vóór verloop: volg op via een ander kanaal, of trek in als nog ongeopend",
        "Onverwachte opening: ga ervan uit dat de link gecompromitteerd kan zijn; trek in indien mogelijk en stuur opnieuw",
      ],
      calloutTitle: "Eerlijke limiet",
      callout:
        "«Geopend» betekent dat de onthullingsstroom is voortgezet—niet dat een mens elke regel zorgvuldig heeft gelezen, en niet dat screenshots onmogelijk waren.",
    },
    {
      title: "Privacyverwachtingen",
      takeaway: "Bezorging monitoren mag geen e-mail van het geheim recreëren.",
      paragraphs: [
        "Teams misbruiken leesbevestigingen soms als productiviteitsbewaking. Het ontwerp van PrivateNote houdt meldingen minimaal: statuslabels en referenties, geen contentdumps.",
        "Dat sluit aan bij de productbelofte elders—browserversleuteling, [concepten van end-to-end-versleuteling](blog:what-is-end-to-end-encryption), en het geheim nooit terug in e-mail zetten alleen om te bewijzen dat het is aangekomen.",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Bevat de melding mijn notitietekst?",
          answer:
            "Nee. E-mail- en livemeldingen beschrijven alleen de status. Berichtinhoud blijft buiten notificatiekanalen.",
        },
        {
          question: "Moet ik het tabblad open houden?",
          answer:
            "E-mailwaarschuwingen werken zonder het tabblad. Live toasts in het tabblad hebben de site open nodig; browsermeldingen helpen wanneer het tabblad op de achtergrond staat en toestemming is gegeven.",
        },
        {
          question: "Kunnen ontvangers zien dat ik meldingen heb ingeschakeld?",
          answer:
            "Ontvangers richten zich op het openen en onthullen van de notitie. Notificatie-instellingen aan de kant van de afzender maken geen deel uit van de geheime payload die zij ontsleutelen.",
        },
        {
          question: "Wat als ik de toegang na verzending moet stoppen?",
          answer:
            "Als de notitie nog ongeopend is, trek de link in vanaf het succescherm of accountactiviteit op in aanmerking komende plannen. Details in [intrekken en bewijs van toegang](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "De kern",
      takeaway: "Sluit de lus zonder het geheim naar een andere inbox te kopiëren.",
      paragraphs: [
        "Weten wanneer een link is geopend laat je het operationele verhaal afronden: roteren, opvolgen of intrekken.",
        "Zet het meldingskanaal aan dat past bij hoe je werkt—e-mail voor asynchroon, livemeldingen voor live overdrachten—en houd de plaintext waar die hoort: in de versleutelde notitie.",
      ],
    },
  ],
  ctaTitle: "Stuur het geheim. Krijg de status.",
  ctaBody:
    "Schakel open- en vernietigingsmeldingen in zodat je weet wanneer een PrivateNote-overdracht beweegt—zonder het bericht in e-mail te zetten.",
  ctaButton: "Maak een notitie met meldingen",
};
