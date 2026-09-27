import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsNl: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Developerlaptop op een bureau ’s nachts met een terminal en configuratiebestanden onder koel blauw bureaulicht",
  heroCaption:
    "De meeste secret-leaks beginnen met gemak: een gecommitte .env, een geplakte CI-variabele, of een key die Git-history nooit heeft verlaten.",
  intro: [
    "API-keys lekken meestal niet via slimme cryptografie-aanvallen. Ze lekken via developer-workflows—`.env`-bestanden die in Git belanden, secrets die in CI-logs verschijnen, en credentials die «even voor nu» in pull requests worden geplakt.",
    "Als je al weet [hoe je een API-key veilig deelt](blog:how-to-share-api-key-securely), is deze gids de volgende laag: waar die keys écht ontsnappen in moderne software delivery, en hoe je voorkomt dat GitHub, CI/CD en lokale config een permanent archief van je productie-toegang worden.",
    "Het patroon is elke keer hetzelfde. Een secret komt in een systeem dat history bewaart. Maanden later maken een fork, een log-export, een gecompromitteerde laptop of een scan van een publieke repo van dat gemak een incident.",
  ],
  sections: [
    {
      title: "Waarom .env-bestanden en CI/CD een magneet voor developer-leaks zijn",
      paragraphs: [
        "Lokale environment-bestanden en pipelines bestaan om configuratie snel te verplaatsen. Die snelheid is nuttig—en gevaarlijk—omdat secrets vaak meereizen met dezelfde tools die je gebruikt voor code review, build-artifacts en automatisering.",
        "Een `.env`-bestand voelt tijdelijk. Een secret in CI voelt «geregeld». Een debug-`echo $DATABASE_URL` voelt onschuldig in een private repo. Aanvallers—en geautomatiseerde secret-scanners—geven niet om intentie. Ze geven om permanentie, doorzoekbaarheid en blast radius.",
        "Behandel elk secret dat Git of CI raakt alsof het uiteindelijk gekopieerd, gespiegeld of geïndexeerd wordt. Ontwerp de workflow zodat die aanname overleefbaar is: kortlevende credentials, juiste secret stores, en menselijke overdrachten die geen plaintext in chat of tickets achterlaten.",
      ],
    },
    {
      title: "Hoe secrets via GitHub ontsnappen",
      subsections: [
        {
          title: "Gecommitte .env- en configbestanden",
          paragraphs: [
            "De klassieke leak is nog steeds de meest voorkomende: `cp .env.example .env`, productie-waarden invullen, dan `git add .` zonder het te merken. Zelfs als je het bestand in de volgende commit verwijdert, blijft het secret in Git-history tot je die herschrijft—en publieke repositories kunnen zeer snel gescand worden op blootgestelde credentials. History herschrijven wist ook niet elke kopie: forks, mirrors, CI-caches en lokale clones kunnen de oude commits nog steeds vasthouden.",
            "Varianten zijn `docker-compose.yml` met hardcoded wachtwoorden, Terraform-state met gevoelige outputs, Kubernetes-manifesten die base64-gecodeerde «secrets» opslaan (base64 is encoding, geen encryptie—wie het manifest kan lezen, kan de waarde decoderen), en notebook-cellen die tokens printen. Als het op configuratie lijkt, ga ervan uit dat scanners het als een credential-dump behandelen.",
          ],
        },
        {
          title: "Pull requests, issues en comments",
          paragraphs: [
            "Developers plakken staging-keys in PR-beschrijvingen om «de reviewer te helpen de bug te reproduceren». Ticketcomments en GitHub Discussions hebben hetzelfde probleem: doorzoekbare permanentie, notificaties, e-maildigests en exports.",
            "Private repositories verminderen casual exposure sterk, maar zijn nog steeds geen geschikte secrets store. Toegangsveranderingen, contractors, gecompromitteerde accounts, clones, backups en integraties kunnen allemaal historische plaintext opnieuw boven water brengen. Voor API-key-overdrachten tussen mensen gebruik je een [client-side encrypted one-time link](blog:one-time-secret-links)—geen PR-comment.",
          ],
        },
        {
          title: "Forks, mirrors en history die nooit sterft",
          paragraphs: [
            "Een key die één keer is gecommit kan overleven in forks, mirrors, CI-caches en lokale clones lang nadat de main branch is opgeschoond. Secret-rotatie is de echte remediatie; history herschrijven is schadebeperking.",
            "Als GitHub Secret Scanning, TruffleHog, gitleaks of een cloudprovider-alert afgaat: eerst roteren. Verwijder daarna het secret uit actieve branches. Beslis pas daarna of history rewrite de coördinatiekosten waard is.",
          ],
        },
      ],
      calloutTitle: "Harde regel",
      callout:
        "Commit nooit live secrets naar Git—ook geen tijdelijke staging-credentials. Als een secret tussen mensen moet bewegen, gebruik dan een geschikt veilig leveringskanaal, zoals een client-side encrypted one-time link. Als automatisering het secret nodig heeft, gebruik het native secrets-mechanisme van het CI-platform, een dedicated secrets manager, of bij voorkeur kortlevende credentials via workload identity of OIDC—niet de repository.",
    },
    {
      title: "Hoe secrets via CI/CD ontsnappen",
      subsections: [
        {
          title: "Plaintext in workflow-bestanden",
          paragraphs: [
            "`API_KEY: sk-...` rechtstreeks in `.github/workflows/*.yml`, GitLab CI YAML of CircleCI-config zetten is gewoon een secret committen met extra stappen. Workflow-bestanden zijn code. Ze worden gereviewd, gecloned en voor altijd bewaard.",
            "Gebruik het native secrets-mechanisme van het platform (GitHub Actions secrets, GitLab CI/CD variables en equivalenten) en refereer ze als environment bindings—niet hardcoded YAML. Native CI-secrets zijn veel beter dan de repository, maar geen magie: kwaadaardige workflow-logica, gecompromitteerde dependencies en slordig logging kunnen waarden nog steeds runtime exposen. Geef de voorkeur aan OIDC of andere workload-identity-federatie naar cloudproviders zodat je helemaal geen langlevende cloud-keys in CI nodig hebt.",
          ],
        },
        {
          title: "Pipeline-logs en debug-output",
          paragraphs: [
            "Build-logs zijn een onderschat archief. Env-vars printen «om de deploy te debuggen», `process.env` dumpen of verbose Terraform/Helm-output draaien kan credentials schrijven naar log-opslag die de job overleeft.",
            "Ga ervan uit dat logs leesbaar zijn voor iedereen met CI-toegang—en soms voor iedereen die artifacts kan downloaden. Maskeer secrets, vermijd env-dumps, en behandel een gelekte logregel als een gelekt wachtwoord: roteer.",
          ],
        },
        {
          title: "Pull requests van forks",
          paragraphs: [
            "Fork-PR’s zijn een klassieke CI-val: untrusted code die met secrets draait. De meeste platforms beperken secret-beschikbaarheid op fork-workflows precies daarom. Houd het zo. «Schakel secrets nooit zomaar in» voor externe contributors om een check groen te maken.",
            "Voor interne repos scheid je privileged deploy-jobs nog steeds van PR-checks. Build en test met least privilege; deploy alleen vanaf trusted branches met expliciet verleende secrets.",
          ],
        },
        {
          title: "Shared runners en artifact-leaks",
          paragraphs: [
            "Self-hosted runners, gedeelde caches en geüploade artifacts kunnen tokens langer vasthouden dan de job die ze creëerde. Ruim workspaces op, scope cache keys zorgvuldig, en pack nooit `.env`-bestanden in build-artifacts «voor het gemak».",
          ],
        },
      ],
    },
    {
      title: "Een veiliger mentaal model: drie plekken waar secrets kunnen leven",
      paragraphs: [
        "Verwarring ontstaat wanneer teams één tool voor elke taak gebruiken. Splits het probleem per lifecycle.",
      ],
      comparisonTable: {
        headers: ["Plek", "Het best voor", "Niet voor"],
        rows: [
          [
            "Lokale .env / dotenv",
            "Lokale ontwikkelconfig die op de laptop blijft en goed is gitignored",
            "Delen met teammates, CI, Git, of langlevende productie-secrets in plaintext",
          ],
          [
            "CI-native secrets / Vault / cloud secret manager",
            "Machine-to-machine runtime en deploy-automatisering",
            "Menselijke chat-overdrachten of langlevende «geef dit aan de contractor»-berichten",
          ],
          [
            "Client-side encrypted one-time note",
            "Mens-tot-mens levering van een key, token of .env-snippet",
            "Productie-secrets opslaan voor apps of pipelines",
          ],
        ],
        after: [
          "Een gitignored `.env` is prima voor lokale ontwikkeling. Gevoelige productie-secrets zouden idealiter ook niet onbeperkt als plaintext op developer-machines moeten leven—gebruik waar praktisch een password manager of kortlevende toegang. PrivateNote staat in de derde rij: veilige levering tussen mensen. Het is geen vervanging voor GitHub Actions secrets, HashiCorp Vault, AWS Secrets Manager of je password manager. Voor dagelijkse API-key-overdrachten combineer je dit met [hoe je een API-key veilig deelt](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Praktische workflow: secrets buiten Git en chat houden",
      flowIntro:
        "Wanneer een teammate, contractor of klant een waarde nodig heeft die uiteindelijk in CI of een lokale `.env` belandt, gebruik dan deze sequentie:",
      flowSteps: [
        {
          step: "Stap 1",
          title: "Maak een scoped, kortlevende credential",
          body: "Geef voorkeur aan staging-keys, read-only scopes, IP-allowlists en expiry. Vermijd het uitdelen van de primaire productie-key «omdat het sneller is».",
        },
        {
          step: "Stap 2",
          title: "Lever via een client-side encrypted one-time note",
          body: "Versleutel het secret (of de paar benodigde `.env`-regels) lokaal met PrivateNote—via de [web app](app:home), [CLI](app:developers/cli), [VS Code / Cursor-extensie](app:developers/vscode) of [Chrome-extensie](chrome:extension). Stel een korte expiry of burn-after-read in, en stuur de note-link—niet de plaintext—via Slack, e-mail of ticket.",
        },
        {
          step: "Stap 3",
          title: "Installeer in de juiste store",
          body: "De ontvanger kopieert de waarde naar een gitignored lokale `.env` (voor development), een password manager, of de CI/cloud secret store. Plak het niet terug in de PR, de chatthread of een gedeeld document.",
        },
        {
          step: "Stap 4",
          title: "Roteer wanneer de job klaar is",
          body: "Trek contractor-keys in, roteer na incidenten, en vervang elke credential die ooit in logs, Git of een ticket verscheen. Gemak zonder rotatie is alleen uitgestelde incident response.",
        },
      ],
      midCta: {
        body: "Moet je iemand nu een CI-token of een paar .env-regels geven? Stuur een client-side encrypted one-time note in plaats van plaintext te committen of te plakken.",
        button: "Maak een private note",
      },
    },
    {
      title: "Deel vanaf waar je al werkt",
      paragraphs: [
        "Je hoeft terminal, editor of browsertab niet te verlaten om een client-side encrypted one-time note te maken. Kies het PrivateNote-oppervlak dat bij het moment past—encryptie gebeurt altijd lokaal op je apparaat vóór upload. Voor een uitgebreidere walkthrough, zie [PrivateNote voor developers](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Lees uit een bestand of pipe stdin zodat het secret nooit in shell-history belandt als `echo`-argument: `npx privatenote-cli --expire 1h --output-url-only .env.local` of `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Handig in shell-workflows, scripts en snelle terminal-overdrachten. Setup en flags: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code en Cursor",
          paragraphs: [
            "Installeer de [VS Code / Cursor-extensie](app:developers/vscode) en versleutel vanuit de sidebar, editorselectie of contextmenu—ideaal wanneer het secret al op het scherm staat in een `.env` of configbestand en nooit als plaintext in Slack mag belanden.",
          ],
        },
        {
          title: "Chrome-extensie",
          paragraphs: [
            "Wanneer de credential opduikt in e-mail, docs of een ticket, maakt de [Chrome-extensie](chrome:extension) van geselecteerde tekst een browser-encrypted one-time note zonder de tab te verlaten.",
          ],
        },
      ],
    },
    {
      title: "Developer-checklist vóór elke push en pipeline-wijziging",
      useCaseTable: {
        headers: ["Checkpoint", "Wat te controleren"],
        rows: [
          [
            "Vóór git commit",
            "`.env`, `*.pem`, `credentials.json` en lokale secret-bestanden zijn gitignored; `git status` toont geen verrassings-additions",
          ],
          [
            "Vóór het openen van een PR",
            "Geen keys in beschrijving, screenshots, fixtures of «tijdelijke» debug-bestanden",
          ],
          [
            "Vóór het bewerken van workflows",
            "Secrets komen uit het native secrets-mechanisme van het platform of OIDC/workload identity—niet hardcoded YAML",
          ],
          [
            "Vóór het debuggen van CI",
            "Geen `env`, `printenv` of verbose dumps die secrets in logs kunnen schrijven",
          ],
          [
            "Na elke exposure",
            "Eerst roteren, dan history/branches opschonen; behandel scanners als incident-triggers",
          ],
        ],
      },
      callout:
        "Voeg secret scanning toe aan het standaardpad: pre-commit hooks (gitleaks), CI-scanning en GitHub Secret Scanning / push protection. Preventie wint van heroïsche history rewrites.",
    },
    {
      title: "Wat te doen als een secret al in GitHub zit",
      paragraphs: [
        "Handel in deze volgorde: **roteer of trek in** de credential bij de provider, **invalideer** afhankelijke sessies of webhooks, **verwijder** het secret van de default branch, en beslis daarna of een history rewrite nodig is voor compliance of publieke exposure. Zelfs na een rewrite ga ervan uit dat forks, mirrors, caches en clones nog kopieën kunnen vasthouden tot die apart worden aangepakt.",
        "Waarschuw de owners van alle systemen die de key zou kunnen bereiken. Check cloud billing, access logs en ongebruikelijk API-gebruik. Als het secret ook in Slack of e-mail is geplakt, ga ervan uit dat die archieven het nog bevatten—zie [waarom e-mail de slechtste plek voor secrets is](blog:why-email-is-worst-for-secrets) en [secrets die je nooit in chat moet sturen](blog:secrets-never-send-in-chat).",
        "Voor extreem waardevolle secrets zoals cryptocurrency seed phrases: vermijd transmissie waar mogelijk. Voor andere onvervangbare root-credentials typ je ze helemaal niet in een website—versleutel eerst lokaal en deel alleen ciphertext wanneer het moet. Dat model staat in onze [crypto seed phrase-gids](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Is een private GitHub-repo veilig genoeg voor .env-bestanden?",
          answer:
            "Nee. Een private repository beperkt exposure sterk, maar is nog steeds geen geschikte secrets store. Toegangsveranderingen, gecompromitteerde accounts, clones, backups en third-party-integraties kunnen allemaal historische plaintext opnieuw boven water brengen. Houd secrets helemaal buiten Git.",
        },
        {
          question: "Zijn GitHub Actions secrets genoeg?",
          answer:
            "Ze zijn de juiste plek voor veel CI-runtime-waarden—veel beter dan YAML of repo-bestanden. Ze lossen nog steeds geen menselijke levering, log-leaks, te brede permissions, fork-PR-risico’s of exposure via kwaadaardige workflow-stappen en gecompromitteerde dependencies op. Combineer het native secrets-mechanisme van het platform met least privilege, zorgvuldig logging, en bij voorkeur kortlevende credentials via OIDC of workload identity.",
        },
        {
          question: "Moet ik een geredacteerde .env.example committen?",
          answer:
            "Ja. Commit alleen variabelenamen en dummy-placeholders. Nooit echte waarden, «bijna echte» staging-keys, of productie-connection strings met het wachtwoord verwijderd maar host en username intact als die combinatie gevoelig is in je threat model.",
        },
        {
          question: "Is een lokaal .env-bestand oké?",
          answer:
            "Voor lokale ontwikkeling, ja—wanneer het goed is gitignored en nooit gecommit. Gevoelige productie-secrets zouden idealiter niet onbeperkt in plaintext-`.env`-bestanden op developer-machines moeten leven; gebruik waar praktisch een password manager, kortlevende toegang of een secrets manager.",
        },
        {
          question: "Kan PrivateNote Vault of GitHub secrets vervangen?",
          answer:
            "Nee. PrivateNote is voor veilige mens-tot-mens levering. Gebruik het native secrets-mechanisme van het CI-platform en dedicated secrets managers voor automatisering. Gebruik PrivateNote wanneer iemand een key, token of .env-snippet moet ontvangen zonder plaintext in Slack, e-mail of GitHub achter te laten.",
        },
        {
          question: "Wat is de snelste veilige overdracht voor een CI-token?",
          answer:
            "Maak een smal gescoped token, lever het via een client-side encrypted one-time note (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) of [Chrome](chrome:extension)), laat de ontvanger het opslaan in de CI secret store of een password manager, en trek het token in wanneer het werk klaar is.",
        },
      ],
    },
    {
      title: "Slotgedachten",
      paragraphs: [
        "GitHub en CI/CD zijn uitstekend in het bewaren van werk. Precies daarom zijn ze slechte plekken om secrets te bewaren.",
        "Houd `.env`-bestanden lokaal, gitignored en waar mogelijk beperkt tot development. Zet automatiseringscredentials in native CI-secrets, een secrets manager of kortlevende OIDC-credentials. Wanneer een mens een waarde nodig heeft, gebruik een client-side encrypted one-time note—roteer daarna.",
        "Als je team nog steeds keys in PR’s plakt of «alleen staging»-credentials commit, begin met de [API-key-deelworkflow](blog:how-to-share-api-key-securely) en de checklist hierboven. Voor server-toegangsmateriaal gebruik [hoe je SSH-keys veilig deelt](blog:how-to-share-ssh-keys-securely). Integreer de [CLI](app:developers/cli), [VS Code-extensie](app:developers/vscode) of [Chrome-extensie](chrome:extension) in het pad van de minste weerstand zodat de veilige optie ook de snelle is.",
      ],
    },
  ],
  ctaTitle: "Deel het secret—niet een permanente kopie",
  ctaBody:
    "Versleutel een CI-token of .env-snippet lokaal met PrivateNote—via de web app, CLI, VS Code / Cursor of Chrome-extensie—vóór het chat of Git bereikt. Gebruik een korte expiry of burn-after-read, stuur de one-time note-link in plaats van plaintext, en houd Git- en pipeline-history vrij van live credentials.",
  ctaButton: "Maak een private note",
};
