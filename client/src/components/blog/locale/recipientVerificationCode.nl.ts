import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeNl: BlogGuideArticleCopy = {
  heroAlt:
    "Laptopscherm met een zescijferige verificatiestap voordat een privénotitie kan worden onthuld",
  heroCaption:
    "Alleen de link is niet genoeg: de ontvanger voert een eenmalige code in die je via een apart kanaal deelt.",
  intro: [
    "Een privénotitie-link is krachtig omdat die meestal het materiaal meeneemt dat nodig is om het bericht te ontsleutelen. Die convenience is ook een risico: als de volledige URL in de verkeerde inbox, chatthread of screenshot belandt, kan het geheim bereikbaar zijn voordat je beoogde ontvanger het opent.",
    "Ontvanger-**verificatiecodes** voegen een tweede aflevergeheim toe dat jij beheert. Nadat je de notitie hebt gemaakt, toont PrivateNote een notitie-specifieke zescijferige code. Je deelt die code apart—via telefoon, Signal of een ander kanaal—zodat een onderschepte link niet genoeg is om de onthulstap te bereiken.",
    "Dit verschilt van optionele passphrase-wrapping op de ciphertext en van inloggen. Het is een afleverpoort: **verifiëren, dan onthullen**.",
  ],
  sections: [
    {
      title: "Alleen link versus link plus code",
      takeaway:
        "Aflevering via gescheiden kanalen maakt van één gestolen bericht een incomplete puzzel.",
      paragraphs: [
        "Bearer-links komen vaak voor bij veilig delen. Ze werken goed wanneer het kanaal vertrouwd is en de levensduur kort. Ze werken minder goed wanneer hetzelfde e-mail- of chataccount dat de link ontvangt ook gemonitord, gedeeld of gecompromitteerd kan zijn.",
        "Een verificatiecode herstelt de klassieke scheiding: stuur de link via kanaal A, de code via kanaal B. Een aanvaller heeft beide nodig. Dat patroon past natuurlijk bij [hoe je veilig een wachtwoord deelt](blog:how-to-share-a-password-securely) en [eenmalige geheime links](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Controle", "Wat het beschermt", "Wat het niet doet"],
        rows: [
          [
            "Verificatiecode (Starter/Business)",
            "Blokkeert onthullen tot de ontvanger de eenmalige code invoert",
            "Vervangt geen passphrase-wrapping of accountlogin",
          ],
          [
            "Passphrase op de notitie",
            "Wikkelt de ciphertext zodat ontsleutelen de passphrase nodig heeft",
            "Vereist nog steeds zorgvuldig out-of-band delen van die passphrase",
          ],
          [
            "Korte vervaltijd + één opening",
            "Beperkt hoe lang een gelekte link nuttig blijft",
            "Stopt niemand die link + code al op tijd heeft",
          ],
        ],
      },
    },
    {
      title: "Hoe je het inschakelt",
      takeaway:
        "Schakel in onder Levering & verificatie, deel daarna code en link apart.",
      paragraphs: [
        "Op in aanmerking komende Starter- en Business-abonnementen open je **Pas aan** bij het maken van een notitie en schakel je **Verificatiecode vereisen** in onder Levering & verificatie. Je kunt het ook als standaard zetten in Account → Voorkeuren zodat nieuwe notities de poort erven.",
        "Na het aanmaken toont het succes-scherm de **ontvanger-verificatiecode**. Kopieer de notitielink zoals gewoonlijk en stuur de code via een ander pad. Vertel de ontvanger dat ze een verificatiestap zien vóór **Notitie openen**.",
      ],
      checklist: [
        "Starter of Business gebruiken (functie is abonnementsgebonden)",
        "Verificatiecode vereisen inschakelen voor de notitie (of als accountstandaard)",
        "Notitie maken en link kopiëren",
        "Zescijferige code van het succes-scherm kopiëren",
        "Link en code via aparte kanalen sturen",
        "Bevestigen dat de ontvanger verifieert vóór onthullen",
      ],
      midCta: {
        body: "Stuur je iets naar een inbox die gedeeld of bekeken kan worden?",
        button: "Maak een notitie met verificatie",
      },
    },
    {
      title: "Wat de ontvanger ervaart",
      takeaway: "Eerst de code, dan de vertrouwde click-to-reveal-waarschuwing.",
      paragraphs: [
        "Het openen van de link toont een verificatiescherm—niet de ontsleutelde inhoud. Na een correcte code verschijnt de bekende onthulpoort: open alleen wanneer je klaar bent, want onthullen kan de notitie onder het burn-beleid verbruiken.",
        "Verkeerde codes falen gesloten. De ontvanger heeft geen account nodig; alleen de code die jij deelde. Voor de bewuste vertraging vóór ontsleutelen, zie [waarom notities wachten op click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Wanneer verificatiecodes gebruiken",
      takeaway: "Gebruik ze wanneer het linkkanaal zwakker is dan het geheim.",
      bullets: [
        "Credentials of documenten gemaild naar een gedeelde inbox",
        "Links geplaatst in een teamchat met veel leden",
        "Overdrachten met hoog screenshot- of doorstuur-risico",
        "Elk geheim dat je ook met gescheiden passphrase-deling zou beschermen",
      ],
      calloutTitle: "Praktische tip",
      callout:
        "Zet de verificatiecode niet in dezelfde e-mail als de link. Dat voegt beide factoren samen in één onderschept bericht.",
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is de verificatiecode hetzelfde als een wachtwoord op de notitie?",
          answer:
            "Nee. De verificatiecode is een servergecontroleerde poort vóór onthullen. Een notitie-passphrase (indien ingeschakeld) wikkelt de ciphertext zelf en is een aparte optionele controle.",
        },
        {
          question: "Kan ik mijn eigen code kiezen?",
          answer:
            "PrivateNote genereert een notitie-specifieke zescijferige code. Je deelt die gegenereerde waarde; je bedenkt of hergebruikt geen persoonlijke PIN.",
        },
        {
          question: "Is dit beschikbaar op Free?",
          answer:
            "Ontvangerverificatie is een Starter- en Business-mogelijkheid. Free-accounts kunnen nog steeds korte vervaltijden, openingslimieten en optionele passphrase-wrapping gebruiken waar aangeboden.",
        },
        {
          question: "Betekent verificatie dat PrivateNote mijn notitie kan lezen?",
          answer:
            "Nee. Verificatie machtigt toegang tot de onthulstroom. Berichtinhoud blijft versleuteld in de browser; statusmeldingen bevatten nooit platte tekst.",
        },
      ],
    },
    {
      title: "De kern",
      takeaway: "Maak de link incompleet zonder je out-of-band-code.",
      paragraphs: [
        "Verificatiecodes zijn voor momenten waarop convenience anders een volledig ontsleutelbare URL in één kanaal zou achterlaten.",
        "Schakel de poort in, deel de code apart en houd de levensduur van de notitie kort—vooral voor [API-sleutels](blog:how-to-share-api-key-securely), wachtwoorden en documenten.",
      ],
    },
  ],
  ctaTitle: "Voeg een aparte verificatiestap toe aan de overdracht.",
  ctaBody:
    "Vereis een eenmalige verificatiecode vóór onthullen en stuur die code via een ander kanaal dan de link.",
  ctaButton: "Maak een geverifieerde privénotitie",
};
