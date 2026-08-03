import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyNl: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Ontwikkelaar werkt aan een bureau met een laptop open op code—waar SSH-sleuteloverdrachten vaak beginnen",
  heroCaption:
    "Privé-SSH-sleutels horen in versleutelde, kortstondige overdrachten—niet in Slack, e-mail of git-geschiedenis. Afbeelding: programmeerbureau via Pixabay.",
  intro: [
    "Een teamgenoot moet op de staging-server. Een contractor heeft een deploy-key nodig voor het weekend. De laptop van iemand is stukgegaan en de enige overgebleven toegang is de privésleutel op jouw machine.",
    "Het snelste pad is meestal dezelfde slechte gewoonte: het PEM-blok in Slack plakken, het per e-mail versturen ‘net dit ene keer’, of het in een ticket zetten. Dat bericht synchroniseert naar telefoons, komt terecht in zoekindexen, en kan lang na de noodsituatie nog in back-ups blijven staan.",
    "Privé-SSH-sleutels zijn geheimen met een grote schade-radius. Één gelekte sleutel kan volledige shell-toegang betekenen. Deze gids behandelt wanneer je een privésleutel überhaupt zou moeten delen, wat je nooit in chat moet plakken, en hoe je er een overdraagt via een burn-after-reading versleutelde link—plus de PrivateNote-ontwikkelaarsextensies die het veilige pad ook het snelle pad maken.",
  ],
  sections: [
    {
      title: "Publieke sleutel vs privésleutel (30 seconden duidelijkheid)",
      paragraphs: [
        "Een SSH-sleutelpaar heeft twee helften. De **publieke** sleutel is bedoeld om te delen: je voegt hem toe aan `~/.ssh/authorized_keys`, een cloudconsole, of een GitHub deploy-key. Iemands publieke sleutel in chat versturen is normaal.",
        "De **privé**sleutel (`id_ed25519`, `id_rsa`, een `.pem`-bestand) is het geheim. Iedereen die hem heeft, kan zich authenticeren als die identiteit totdat je de toegang intrekt. Behandel hem als een wachtwoord dat een server opent—want dat is precies wat het is.",
        "Als je instinct zegt ‘we moeten de privésleutel delen’, pauzeer even. In veel gevallen zou je in plaats daarvan de **publieke** sleutel moeten delen: de ontvanger genereert lokaal zijn eigen paar en jij autoriseert diens publieke sleutel op de host.",
      ],
      calloutTitle: "Vuistregel",
      callout:
        "Voeg liever hun publieke sleutel toe dan je privésleutel te versturen. Overdrachten van privésleutels zijn voor break-glass- en legacy-gevallen—niet voor standaard onboarding.",
    },
    {
      title: "Deel de privésleutel liever niet",
      paragraphs: [
        "Voordat je iets versleutelt en verstuurt, vraag je af of de privésleutel überhaupt moet verplaatsen:",
      ],
      subsections: [
        {
          title: "Voeg hun publieke sleutel toe",
          paragraphs: [
            "Laat ze `ssh-keygen` draaien, het `.pub`-bestand naar je sturen (veilig in chat), en het toevoegen aan `authorized_keys` of de SSH-instellingen van de provider. Zij houden de privéhelft; jij ziet die nooit.",
          ],
        },
        {
          title: "Gebruik een specifieke deploy-key",
          paragraphs: [
            "Voor CI of één repository maak je een dedicated deploy-key met minimale scope. Vermijd het hergebruiken van een persoonlijke laptopsleutel over meerdere systemen.",
          ],
        },
        {
          title: "Geef de voorkeur aan kortdurende toegang",
          paragraphs: [
            "Waar je stack het ondersteunt—SSH-certificaten, bastion/jump hosts, Tailscale SSH, cloud IAM-rollen—geef de voorkeur aan tijdgebonden toegang boven het kopiëren van langdurige privésleutels.",
          ],
        },
        {
          title: "Wanneer overdracht van een privésleutel gerechtvaardigd is",
          paragraphs: [
            "Break-glass-herstel, een legacy host die niet snel nieuwe sleutels kan registreren, of een noodgeval waarbij slechts één met wachtwoordzin beveiligde sleutel bestaat. Zelfs dan: versleutel de overdracht, houd de vervaldatum kort, bevestig ontvangst, en roteer of trek daarna in.",
          ],
        },
      ],
    },
    {
      title: "Waar SSH-sleutels in het wild sterven",
      paragraphs: [
        "Dezelfde kanalen die [API-sleutels](blog:how-to-share-api-key-securely) en [wachtwoorden](blog:how-to-share-a-password-securely) laten lekken, laten ook SSH-materiaal lekken—vaak met ergere gevolgen.",
      ],
      comparisonTable: {
        headers: ["Kanaal", "Waarom het faalt", "Wat aanvallers krijgen"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Doorzoekbare geschiedenis, apparaatsynchronisatie, workspace-exports",
            "Volledige privésleutel in platte tekst, voor altijd",
          ],
          [
            "E-mail",
            "Inboxen, archieven, mobiele sync, doorstuurberichten",
            "Een blijvende kopie die je niet betrouwbaar kunt wissen",
          ],
          [
            "Tickets en documenten",
            "Jira, Notion, Confluence, GitHub issues",
            "Sleutels in back-ups, AI-zoekfuncties en audittrails",
          ],
          [
            "Git-repositories",
            "Geschiedenis blijft plakken; ‘verwijderen en pushen’ wist niets",
            "Scanners vinden PEM's binnen minuten in publieke repo's",
          ],
        ],
        after: [
          "Als het geheim al in chat of git is verschenen, ga ervan uit dat het verbrand is. Trek de sleutel in, genereer een nieuw paar, en lever de vervanging via een [eenmalige versleutelde link](blog:one-time-secret-links)—niet nog een keer plakken. Voor pipeline- en `.env`-lekken, zie [geheimen in CI/CD en GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Een veiligere overdracht van SSH-privésleutels",
      paragraphs: [
        "Wanneer je een privésleutel moet verplaatsen, behandel de overdracht als tijdelijke levering—niet als opslag. Hetzelfde patroon als bij wachtwoorden en API-sleutels geldt: lokaal versleutelen, een link versturen, na lezen vernietigen, dan roteren.",
        "PrivateNote versleutelt in de browser (of in je editor/CLI) met AES-256-GCM voordat er iets het netwerk bereikt. De ontsleutelingssleutel leeft alleen in het URL-fragment—het `#…`-deel dat browsers nooit naar servers sturen. Details: [wat end-to-end-versleuteling hier betekent](blog:what-is-end-to-end-encryption) en [hoe je een privénotitie maakt](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Een praktische break-glass-workflow:",
      flowSteps: [
        {
          step: "Stap 1",
          title: "Beperk en bescherm de sleutel",
          body: "Geef de voorkeur aan een dedicated sleutel voor deze host of taak. Gebruik een wachtwoordzin op de privésleutel. Vermijd het versturen van je dagelijkse persoonlijke identiteitssleutel als een beperktere sleutel volstaat.",
        },
        {
          step: "Stap 2",
          title: "Versleutel lokaal",
          body: "Plak alleen het sleutelmateriaal (geen roman van hostnamen en gebruikersnamen) in PrivateNote via de [webapp](app:home), de [VS Code / Cursor-extensie](app:developers/vscode), de [CLI](app:developers/cli), of de [Chrome-extensie](chrome:extension).",
        },
        {
          step: "Stap 3",
          title: "Verstuur de link—niet het PEM",
          body: "Deel de versleutelde link in Slack of e-mail. Schakel optioneel wachtwoordzin-verpakking in en stuur die wachtwoordzin via een apart kanaal ([tip voor gesplitste kanalen](blog:how-to-share-a-password-securely)). Geef de voorkeur aan een vervaltijd van 15 minuten of 1 uur en burn-after-reading.",
        },
        {
          step: "Stap 4",
          title: "Bevestig, dan roteer",
          body: "De ontvanger installeert de sleutel met de juiste rechten (`chmod 600`), bevestigt de login, waarna jij de oude sleutel intrekt of roteert. Behandel elke sleutel die in een AI-prompt heeft gestaan als gezien—roteer die.",
        },
      ],
      midCta: {
        body: "Moet je nu een SSH-sleutel overdragen? Maak een versleutelde eenmalige notitie en verstuur de link in plaats van de privésleutel.",
        button: "Privénotitie maken",
      },
    },
    {
      title: "Ontwikkelaarsextensies: deel SSH-sleutels vanuit je werkomgeving",
      paragraphs: [
        "Overdrachten mislukken wanneer de veilige tool drie klikken verder ligt dan Slack. PrivateNote-integraties houden de versleuteling in je editor, browser, terminal of agent-workflow. Volledige rondleiding: [PrivateNote voor ontwikkelaars](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Jouw situatie", "Beste pad"],
        rows: [
          [
            "De sleutel staat al open in de editor",
            "VS Code / Cursor / Codex IDE-extensie — selecteren → delen als PrivateNote",
          ],
          [
            "De sleutel staat op een webpagina of ticket",
            "Chrome-extensie — markeren → PrivateNote maken",
          ],
          [
            "Je zit in een terminal",
            "CLI — pipe het bestand zodat het PEM nooit in de shell-geschiedenis staat",
          ],
          [
            "Je wilt dat een agent de link genereert",
            "MCP-server — daarna roteren; geef de voorkeur aan de editor-extensie voor privésleutels",
          ],
          [
            "De ontvanger is niet technisch onderlegd",
            "Webapp-link op privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor en Codex IDE",
          paragraphs: [
            "Installeer vanuit de marketplace (`PrivateNote.privatenote-vscode`), selecteer het sleutelblok, en gebruik **Share as PrivateNote**—of open de zijbalk-composer. Versleuteling draait in het editor-hostproces, zodat platte tekst nooit een AI-chat hoeft in te gaan. Installatie: [VS Code / Cursor-extensie](app:developers/vscode).",
          ],
        },
        {
          title: "Chrome-extensie",
          paragraphs: [
            "Wanneer een sleutel verschijnt in een ticket, documentatiepagina of adminconsole, markeer hem en maak een versleutelde notitie zonder hem eerst naar Slack te kopiëren. Installatie: [Chrome-extensie](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Pipe vanuit een bestand zodat het geheim geen `echo`-argument in de shell-geschiedenis wordt: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Documentatie: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "MCP voor Cursor, Claude en Codex",
          paragraphs: [
            "Agents kunnen `create_private_note` aanroepen na installatie van [privatenote-mcp](app:developers/mcp). Nuttig voor orkestratie—maar als je de privésleutel in de agent-prompt plakt, kan de modelprovider die zien vóór versleuteling. Voor SSH-privésleutels geef je de voorkeur aan de editor- of Chrome-extensie. Codex-specifieke installatie: [PrivateNote met Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Eerlijk voorbehoud",
      callout:
        "MCP versleutelt nadat de agent de prompt heeft gelezen. De blijvende blootstelling via chat/e-mail is weg; de zichtbaarheid voor de AI-provider niet. Voor privésleutels gebruik je de VS Code- of Chrome-extensie zodat platte tekst je machine nooit verlaat voordat het al cijfertekst is.",
    },
    {
      title: "Best practices en valkuilen",
      subsections: [
        {
          title: "Commit privésleutels nooit",
          paragraphs: [
            "Houd `id_*` en `*.pem` buiten repositories. Voeg ze toe aan `.gitignore`. Als een sleutel in de git-geschiedenis is terechtgekomen, roteer die—geschiedenis herschrijven is niet meer genoeg zodra de repository is gekloond of gescand.",
          ],
        },
        {
          title: "Herstel bestandsrechten",
          paragraphs: [
            "Privésleutels moeten `chmod 600` (of `400`) zijn. SSH weigert op veel systemen te toegankelijke sleutelbestanden—en voor iedereen leesbare sleutels op gedeelde machines zijn een eigen doelpunt.",
          ],
        },
        {
          title: "Zet geen context in de notitie",
          paragraphs: [
            "Zet alleen het sleutelmateriaal in de versleutelde notitie. Verstuur hostnaam, gebruikersnaam en poort in een apart bericht. Als de link lekt, hoeft de aanvaller er niet ook nog een gelabelde kaart bij te krijgen van wat hij opent.",
          ],
        },
        {
          title: "Wachtwoordzin en gesplitste kanalen",
          paragraphs: [
            "Beveilig het sleutelbestand zelf met een wachtwoordzin, en verpak de PrivateNote optioneel met een apart wachtwoord dat via een ander kanaal wordt verstuurd. Zelfde advies als bij [veilig wachtwoorden delen](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Agent-forwarding is geen deelstrategie",
          paragraphs: [
            "SSH-agent-forwarding kan sleutelkopieën op remote hosts verminderen, maar is geen vervanging voor zorgvuldige sleuteldistributie—en het breidt vertrouwen uit naar elke hop waardoor je forward. Gebruik het bewust, niet als excuus om PEM's te e-mailen.",
          ],
        },
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is het veilig om een publieke sleutel in Slack te versturen?",
          answer:
            "Ja. Publieke sleutels zijn bedoeld om verspreid te worden. Vermijd toch het dumpen van complete `~/.ssh`-mappen—mensen nemen per ongeluk privébestanden mee.",
        },
        {
          question: "Kan ik een SSH-privésleutel in een wachtwoordmanager zetten?",
          answer:
            "Voor langdurige opslag van sleutels die je bewaart, is een wachtwoordmanager of hardware-agent passend. Gebruik een eenmalige versleutelde link voor het mens-tot-mens-leveringsmoment—daarna bewaart de ontvanger de sleutel op de juiste manier. PrivateNote is levering, geen geheimenkluis.",
        },
        {
          question: "Moet ik de sleutel en de wachtwoordzin samen delen?",
          answer:
            "Nee. Dat creëert opnieuw één single point of failure. Verstuur de versleutelde link via één kanaal en elke wachtwoordzin via een ander—of laat de ontvanger na installatie zijn eigen wachtwoordzin instellen en roteren.",
        },
        {
          question: "Welke vervaltijd moet ik gebruiken?",
          answer:
            "Voor live coördinatie, 15 minuten met burn-after-reading. Voor asynchrone overdrachten aan contractors, maximaal 1 uur of 1 dag. Geef de voorkeur aan korter wanneer de ontvanger bereikbaar is.",
        },
        {
          question: "Is PrivateNote een vervanging voor Vault of cloud secret managers?",
          answer:
            "Nee. Gebruik Vault, AWS Secrets Manager en vergelijkbare tools voor machine-tot-machine opslag en injectie. Gebruik PrivateNote voor het mens-tot-mens-moment wanneer een sleutel chat of e-mail moet doorkruisen zonder een permanent archief te worden. Zelfde onderscheid als in de [API-sleutelgids](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Tot slot",
      paragraphs: [
        "De meeste SSH-‘deel’-problemen zijn eigenlijk inschrijvingsproblemen: voeg een publieke sleutel toe, gebruik een deploy-key, of geef kortdurende toegang. Wanneer een privésleutel moet verplaatsen, laat hem dan niet in de [chatgeschiedenis](blog:secrets-never-send-in-chat) of [e-mail](blog:why-email-is-worst-for-secrets) staan.",
        "Versleutel lokaal, verstuur een zelfvernietigende link, bevestig de installatie, en roteer dan. Koppel de [ontwikkelaarstools](app:developers) die je al gebruikt, zodat het veilige pad ook het pad van de minste weerstand is.",
      ],
    },
  ],
  ctaTitle: "Deel de link—niet de privésleutel",
  ctaBody:
    "Maak een in de browser versleutelde PrivateNote met korte vervaltijd en burn-after-reading. Of versleutel vanuit de VS Code-extensie, CLI, of Chrome-extensie zodat het PEM nooit als platte tekst in Slack terechtkomt.",
  ctaButton: "Privénotitie maken",
};
