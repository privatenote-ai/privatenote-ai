import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideNl: PrivacyToolsGuideArticleCopy = {
  intro: [
    "De meeste pagina’s over «beste privacytools» zijn affiliatecatalogi in een trenchcoat. Ze ranken elke categorie, begraven de trade-offs en laten je achter met twintig tabbladen en geen systeem.",
    "Deze gids is anders. Het is een **beslissingskader voor 2026** om een privacystack samen te stellen die in het echte leven past: welke job je moet doen, welke default je kiest, wanneer je upgradet—en wanneer een tool de verkeerde vorm heeft.",
    "PrivateNote.ai zit in één smalle slot—**eenmalige geheimsoverdrachten**. Al het andere hieronder is gecureerde opinie, zodat je deze pagina verlaat met een coherente stack en daarna onze [privacytools-directory](app:privacy-tools) kunt doorbladeren voor de volledige catalogus.",
  ],
  sections: [
    {
      title: "Begin met een bedreigingsmodel (niet met een boodschappenlijst)",
      paragraphs: [
        "Privacytools helpen alleen als ze passen bij waar je je tegen verdedigt. Een freelancer die wifi-inloggegevens deelt heeft een ander probleem dan een journalist onder gerichte surveillance. Kies de lichtste stack die *jouw* risico’s dekt—en stop met tools verzamelen voor de sport.",
      ],
      subsections: [
        {
          title: "Dagelijks persoonlijk gebruik",
          paragraphs: [
            "Je wilt minder tracking, minder rampen door hergebruik van wachtwoorden, en geheimen die niet in chat blijven hangen. Je probeert niet te verdwijnen voor natiestaten. Focus op een wachtwoordmanager, verstandige browserdefaults, versleutelde messaging voor gevoelige chats, en efemere links voor eenmalige credentials.",
          ],
        },
        {
          title: "Freelancer of consultant",
          paragraphs: [
            "Je overhandigt geheimen aan klanten die jouw apps niet delen. E-mail en Slack worden permanente archieven van API-keys en tijdelijke wachtwoorden. Voeg eenmalige versleutelde notities en versleutelde bestandsoverdracht toe; bewaar langlevende credentials in een vault, niet in threads.",
          ],
        },
        {
          title: "Klein team",
          paragraphs: [
            "Je hebt gedeelde toegang nodig die kan worden ingetrokken, duidelijke regels voor contractors, en minder afhankelijkheid van «stuur het even in het kanaal». Geef voorkeur aan delen via de wachtwoordmanager voor doorlopende toegang, eenmalige links voor tijdelijke overdrachten, en geschreven normen zodat gemak niet stil beleid wordt.",
          ],
        },
      ],
      calloutTitle: "Vuistregel",
      callout:
        "Als een tool niet past bij een job die je echt wekelijks doet, sla hem over. Een minimale stack die je gebruikt wint van een puristische stack die je opgeeft.",
    },
    {
      title: "Privacyjobs, geen productcategorieën",
      paragraphs: [
        "Categorieën (VPN, browser, messenger) moedigen logo’s verzamelen aan. Jobs dwingen trade-offs naar buiten. Gebruik deze kaart ter oriëntatie; de secties hieronder gaan dieper.",
      ],
      comparisonTable: {
        headers: ["Job", "Standaardaanpak", "Verkeerde tool voor de job"],
        rows: [
          [
            "Langlevende wachtwoorden bewaren",
            "Wachtwoordmanager + sterke generator",
            "Alleen browsopgeslagen wachtwoorden, of chatarchieven",
          ],
          [
            "Iemand een eenmalig geheim geven",
            "Browser-versleutelde, aflopende notitie",
            "E-mail, Slack, sms, of een cloudmap «voor nu»",
          ],
          [
            "Dagelijkse privéchat",
            "End-to-end versleutelde messenger",
            "Sms, of «verdwijnende» berichten in apps die metadata toch eeuwig archiveren",
          ],
          [
            "Browse-trackers verminderen",
            "Geharde mainstreambrowser + blocker",
            "Vijf conflicterende privacy-extensies installeren",
          ],
          [
            "Onvertrouwde netwerken",
            "Reputatievolle no-logs-VPN",
            "Aannemen dat een VPN je anoniem maakt",
          ],
          [
            "Hygiëne tegen accountovername",
            "Breach-check + 2FA / passkeys",
            "Wachtwoorden hergebruiken en hopen",
          ],
        ],
        after: [
          "Voor productnamen, prijsnotities en uitsluitingen, houd de [privacytools-directory](app:privacy-tools) open naast deze gids.",
        ],
      },
    },
    {
      title: "Job: langlevende wachtwoorden",
      paragraphs: [
        "Wachtwoorden die je maanden hergebruikt horen in een vault—niet in je hoofd, niet in een notitie-app, en niet in gisteren’s Teams-thread.",
      ],
      subsections: [
        {
          title: "Het probleem",
          paragraphs: [
            "Hergebruik maakt van één breach vele. Zwakke, memorabele wachtwoorden falen bij offline cracking. Browserwachtwoordstores helpen, maar evenaren zelden dedicated managers in sync, delen en auditability.",
          ],
        },
        {
          title: "Default + alternatief",
          paragraphs: [
            "**Default:** [Bitwarden](https://bitwarden.com/) voor de meeste mensen—open source, bruikbare free tier, solide sync. **Alternatief:** [KeePassXC](https://keepassxc.org/) als je een lokale vault zonder cloud wilt. **Wanneer polish belangrijker is dan open source:** [1Password](https://1password.com/) is een eerlijke keuze; weet dat je proprietair gemak kiest.",
          ],
        },
        {
          title: "Wanneer niet alleen een manager te gebruiken",
          paragraphs: [
            "Managers blinken uit in *opslag* en doorlopende gedeelde toegang. Ze zijn onhandig wanneer de ontvanger geen account heeft, of wanneer het geheim na één lezing moet sterven. Dat is een andere job—zie eenmalige geheimen hieronder. Genereer sterke waarden met een lokale [wachtwoordgenerator](app:password-generator) voordat je ze opslaat of deelt.",
          ],
        },
      ],
    },
    {
      title: "Job: eenmalige geheimen",
      paragraphs: [
        "Wachtwoorden voor contractors, herstelcodes, API-keys, wifi voor een bezoeker—alles wat geen doorzoekbare geschiedenis mag worden.",
      ],
      subsections: [
        {
          title: "Het probleem",
          paragraphs: [
            "E-mail en chat versleutelen onderweg en archiveren daarna voor altijd. Cloudmappen blijven liggen. Screenshots en apparaatback-ups vergroten de blast radius. De failure mode is niet «iemand sniffet de lijn»—het is «het geheim is over zes maanden er nog».",
          ],
        },
        {
          title: "Default",
          paragraphs: [
            "**Default:** een browser-versleutelde, aflopende notitie zoals [PrivateNote.ai](app:home)—ciphertext op de server, decryptiemateriaal in het linkfragment, burn-after-reading of korte TTL. Voor het model, zie [hoe PrivateNote werkt](app:how-it-works) en [waarom e-mail de slechtste plek voor geheimen is](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Wanneer het niet te gebruiken",
          paragraphs: [
            "Vervang je wachtwoordmanager of dagelijkse messenger niet door eenmalige notities. Zet geen langlevende documenten of doorlopende gesprekken in efemere links. En stuur de link en een optionele passphrase niet via hetzelfde kanaal als het geheim hoog inzet is—splits de kanalen.",
          ],
        },
      ],
      midCta: {
        body: "Moet je nu een wachtwoord of API-key overhandigen? Versleutel het in de browser en stuur een link die na het lezen kan verlopen.",
        button: "Maak een privénotitie",
        href: "app:home",
      },
    },
    {
      title: "Job: dagelijkse messaging",
      paragraphs: [
        "Gevoelige gesprekken hebben end-to-end-versleuteling by default nodig—niet een toggle begraven in instellingen, en niet de belofte dat «verdwijnende» berichten serverkopieën wissen die je niet kunt verifiëren.",
      ],
      subsections: [
        {
          title: "Default + trade-off",
          paragraphs: [
            "**Default:** [Signal](https://signal.org/) voor mainstream veilige chat. **Trade-off hardop noemen:** registratie vereist een telefoonnummer, wat sommige hoog-anonimiteitsbedreigingsmodellen afwijzen. Voor die gevallen kijk verder dan deze startergids—en behandel metadata (wie praat met wie) als rest-risico op elke messenger.",
          ],
        },
        {
          title: "Wanneer chat niet voor geheimen te gebruiken",
          paragraphs: [
            "Zelfs versleutelde messengers houden geschiedenis op apparaten. Plak een productie-wachtwoord in een thread en je hebt een duurzame kopie gemaakt. Gebruik chat voor gesprek; gebruik eenmalige notities voor credentials. Meer over dat patroon: [geheimen die je nooit in chat moet sturen](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Job: e-mail en identiteitsscheiding",
      paragraphs: [
        "E-mail is een openbaar adresseringssysteem met privéhoop. Behandel inbox-versleuteling en aliasing als schadebeperking, niet als magische onzichtbaarheid.",
      ],
      subsections: [
        {
          title: "Defaults",
          paragraphs: [
            "**Versleutelde inbox-default:** [Proton Mail](https://proton.me/) of [Tuta](https://tuta.com/) wanneer je zero-access-mail wilt voor gevoelige correspondentie. **Aliasing-default:** [Firefox Relay](https://relay.firefox.com/) voor lichte masking, of [SimpleLogin](https://simplelogin.io/) wanneer je custom domains en scherpere identiteitsscheiding nodig hebt.",
          ],
        },
        {
          title: "Wanneer niet op e-mail te vertrouwen",
          paragraphs: [
            "Versleutelde e-mail laat nog steeds headers, doorstuurgewoonten en lange retentie achter. Zet nooit actieve credentials in de body «alleen deze keer». Als de payload een geheimsoverdracht is, gebruik een eenmalige notitie en zet alleen context in de e-mail.",
          ],
        },
      ],
    },
    {
      title: "Job: browsen met minder tracking",
      paragraphs: [
        "In 2026 gaat de strijd minder over «geheime modus» en meer over fingerprinting, cross-site tracking, en extensies die privacy beloven terwijl ze attack surface toevoegen.",
      ],
      subsections: [
        {
          title: "Default-stack",
          paragraphs: [
            "**Default:** [Firefox](https://www.mozilla.org/) met strikte trackingbescherming plus [uBlock Origin](https://ublockorigin.com/). **Chromium-vormig alternatief:** [Brave](https://brave.com/) als je extensiecompatibiliteit nodig hebt—weet dat de community verdeeld is over zijn rewards/crypto-oppervlak. **Zoeken:** [DuckDuckGo](https://duckduckgo.com/) (of vergelijkbaar niet-profilerend zoeken) zodat je queries geen ad-profielfeed worden.",
          ],
        },
        {
          title: "Wanneer Tor de juiste upgrade is",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) is de standaard voor sterkere anonimiteit en censuurweerstand. Hij is ook langzamer en CAPTCHA-zwaar. Gebruik hem wanneer het bedreigingsmodel het eist—niet als je dagelijkse bankbrowser.",
          ],
        },
      ],
    },
    {
      title: "Job: onvertrouwde netwerken (VPN-realiteitscheck)",
      paragraphs: [
        "Een VPN versleutelt het pad tussen jou en de VPN-provider. Het verbergt je IP voor de sites die je bezoekt. Het maakt je **niet** anoniem, versleutelt de logs van de bestemming niet, en fixt geen zwak wachtwoord.",
      ],
      subsections: [
        {
          title: "Defaults die we willen noemen",
          paragraphs: [
            "Geef voorkeur aan providers met een publiek trackrecord, duidelijk jurisdictieverhaal, en geauditeerde no-logs-claims—vaak [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) of [IVPN](https://www.ivpn.net/). Betaal voor het product; free-VPN-businessmodellen zijn vaak zelf het product.",
          ],
        },
        {
          title: "Wanneer het de moeite niet waard is",
          paragraphs: [
            "Op een netwerk dat je al vertrouwt, met HTTPS overal, is een VPN optionele hygiëne—geen morele plicht. Sla sketchy «military-grade»-merken over en alles wat leidt met influencer-codes in plaats van engineeringdetail. De uitsluitingsnotities van onze directory dekken gangbare «privacy-washed» picks.",
          ],
        },
      ],
    },
    {
      title: "Job: breaches, 2FA en passkeys",
      paragraphs: [
        "Account-hygiëne is de onglamoureuze helft van privacy. De meeste persoonlijke rampen zijn credential stuffing en SIM-swap-achtige failures, geen exotische malware.",
      ],
      subsections: [
        {
          title: "Praktische defaults",
          paragraphs: [
            "Check adressen op [Have I Been Pwned](https://haveibeenpwned.com/). Zet phishing-resistente factoren aan waar je kunt—passkeys of hardwarekeys zoals [YubiKey](https://www.yubico.com/) winnen van sms-OTP. Gebruik de [2FA Directory](https://2fa.directory/) om te zien welke diensten tweede factoren nog als optioneel theater behandelen.",
          ],
        },
        {
          title: "2026-nota over passwordless",
          paragraphs: [
            "Passkeys verminderen phishing en wachtwoordhergebruik, maar recovery en cross-ecosysteem lock-in zijn reëel. Houd een recovery-verhaal (hardwarekey, gedocumenteerd proces) klaar voordat je elk wachtwoord verwijdert. Wachtwoordmanagers blijven nuttig voor de long tail van sites die nog niet bij zijn.",
          ],
        },
      ],
    },
    {
      title: "Wat er in 2026 veranderde (commentaar dat mag blijven)",
      bullets: [
        "**AI-chat is een nieuw archief.** Geheimen in assistenten plakken creëert retentie- en trainingsrisicovragen die je bedreigingsmodel van 2019 nooit bevatte. Behandel prompts als e-mailbodies.",
        "**Fingerprinting heeft cookiebanners ingehaald.** Third-party cookies blokkeren helpt; browserkeuze, trackerblocking en minder extensies tellen nog steeds meer dan elk «legitimate interest»-toggle accepteren.",
        "**Passkeys worden mainstream.** Geef ze voorkeur op high-value accounts; doe niet alsof elke site ze al ondersteunt.",
        "**VPN-marketing werd luider, niet wijzer.** Jurisdictietheater en affiliate-leaderboards zijn geen audits. Kies saaie, gedocumenteerde providers—of geen.",
        "**Efemere sharing is nog niche—en nog nodig.** Collaboratie-apps geoptimaliseerd voor zoeken maken eenmalige-geheim-tools waardevoller, niet minder.",
      ],
    },
    {
      title: "Minimale starterkit (de meeste mensen)",
      paragraphs: [
        "Als je maar zeven dingen doet, doe deze. Al het andere is optionele diepte.",
      ],
      useCaseTable: {
        headers: ["Slot", "Keuze"],
        rows: [
          ["Wachtwoordvault", "Bitwarden (of KeePassXC als je cloud weigert)"],
          ["Wachtwoordcreatie", "Lokale generator—dan opslaan in de vault"],
          ["Eenmalige geheimen", "PrivateNote.ai (of gelijkwaardige browser-versleutelde notitie)"],
          ["Privéchat", "Signal"],
          ["Browser + blocker", "Firefox + uBlock Origin"],
          ["Breach- / 2FA-hygiëne", "Have I Been Pwned + passkeys of app-/hardware-2FA"],
          ["Reizen / café-wifi", "Mullvad, Proton VPN of IVPN—wanneer het netwerk het risico is"],
        ],
      },
      callout:
        "Geavanceerde add-ons (Tor dagelijks, full-disk-ritualisme, anonieme e-mailwebben) zijn geldig—maar pas nadat de starterkit gewoonte is.",
    },
    {
      title: "Wat we uitsluiten—en waarom",
      paragraphs: [
        "Cureren is vooral nee zeggen. Een paar patronen die we weigeren te verzachten:",
      ],
      subsections: [
        {
          title: "Privacytheater-VPN’s",
          paragraphs: [
            "Free tiers gefinancierd door vage datapraktijken, nep-«audit»-badges, en leaderboard-SEO. Als de pitch angst plus een kortingscode is, loop weg.",
          ],
        },
        {
          title: "Messengers die versleuteling selectief vermarketen",
          paragraphs: [
            "Cloud by default, optionele E2EE, of «geheime chat»-modi die gebruikers trainen geheimen in de onveilige default te plakken. We raden liever één eerlijke default aan dan vijf modi die mensen misbruiken. Telegram-achtige clouds en WhatsApps metadata-/backup-realiteiten worden genoemd in onze [directory-uitsluitingen](app:privacy-tools).",
          ],
        },
        {
          title: "Alles wat onze aanbeveling moet kopen",
          paragraphs: [
            "Deze gids en de directory zijn geen affiliatelijst. We verdienen niets als je doorklikt. Dat maakt ons niet alwetend—het betekent dat incentives de shortlist niet stil sturen.",
          ],
        },
      ],
    },
    {
      title: "Waarheen verder",
      paragraphs: [
        "Gebruik dit artikel als beslissingslaag. Gebruik de directory als levende catalogus—categorieën, nuances en links die we beoordeeld houden.",
      ],
      bullets: [
        "[Privacytools-directory](app:privacy-tools) — gecureerde catalogus per categorie",
        "[Hoe deel je een wachtwoord veilig](blog:how-to-share-a-password-securely) — overdracht-playbook",
        "[Een geheim sturen zonder account](blog:send-secret-message-without-account) — geen gedeelde app vereist",
        "[Beveiligingsbronnen](app:security-resources) — bredere lectuur op PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — beleids- en rechtencontext",
        "[Privacy Guides](https://www.privacyguides.org/) — diepere community-onderhouden aanbevelingen",
      ],
      midCta: {
        body: "Klaar om de volledige shortlist met categorienotities en uitsluitingen te doorbladeren?",
        button: "Open de privacytools-directory",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is dit hetzelfde als jullie privacytools-directory?",
          answer:
            "Nee. Dit bericht is de 2026 how-to-choose-gids. De [directory](app:privacy-tools) is de gecureerde catalogus. Lees de gids om te beslissen; gebruik de directory om concrete tools te kiezen.",
        },
        {
          question: "Kan ik elke privacycategorie op ranking najagen?",
          answer:
            "Dat kan, maar je houdt het niet vol. Een zeven-slot-starterkit die je echt gebruikt wint van een dertig-tool-tempel die je één keer configureert.",
        },
        {
          question: "Waar past PrivateNote.ai?",
          answer:
            "Alleen in de eenmalige-geheimen-job—credentials en instructies die moeten verlopen. Het is geen wachtwoordmanager, messenger of VPN.",
        },
        {
          question: "Heb ik elke dag een VPN nodig?",
          answer:
            "Meestal niet. Gebruik er een op onvertrouwde netwerken of wanneer je je IP specifiek voor een bestemming moet verbergen. Het is geen vervanging voor HTTPS, goede wachtwoorden of versleutelde messengers.",
        },
        {
          question: "Open source of gepolijst proprietair?",
          answer:
            "Geef voorkeur aan open source wanneer het risico hoog is en je met de UX kunt leven. Proprietaire tools kunnen rationeel zijn wanneer usability bepaalt of je familie überhaupt een vault adopteert—noem de trade-off expliciet, zoals wij met 1Password doen.",
        },
      ],
    },
  ],
  ctaTitle: "Bouw de stack, deel geheimen daarna goed",
  ctaBody:
    "Wanneer de job een tijdelijke overdracht is, sla het chatarchief over. Maak een browser-versleutelde notitie, stuur de link, en laat hem verlopen wanneer het moment voorbij is.",
  ctaButton: "Maak een privénotitie",
  ctaSecondaryLabel: "Blader door de privacytools-directory",
  ctaSecondaryHref: "app:privacy-tools",
};
