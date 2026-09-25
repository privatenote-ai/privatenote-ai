import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteNl: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret en PrivateNote lossen hetzelfde praktische probleem op: een wachtwoord, API-sleutel, herstelcode of vertrouwelijke notitie via een tijdelijke link versturen in plaats van plaintext in e-mail of chat achter te laten. De ontvanger opent de link, en de opgeslagen payload kan verdwijnen nadat die is gelezen of wanneer de vervaltijd is bereikt.",
    "Beide producten versleutelen de payload. Het belangrijke verschil is waar die versleuteling plaatsvindt.",
    "OneTimeSecret beschrijft zijn architectuur als server-side versleuteling. De plaintext bereikt OneTimeSecret voordat die wordt versleuteld. PrivateNote versleutelt eerst lokaal, zodat de dienst ciphertext ontvangt in plaats van de plaintext-payload. Dat verschil bepaalt de cryptografische vertrouwensgrens.",
  ],
  sections: [
    {
      title: "Twee manieren om dezelfde link te bouwen",
      paragraphs: [
        "Bij **server-side versleuteling** stuurt de verzender het geheim over TLS naar de dienst. De dienst ontvangt de plaintext, versleutelt die en slaat ciphertext op. Daarna kan de dienst de payload bewaren, afleveren, laten verlopen en verwijderen. De applicatieserver maakt deel uit van het versleutelingsproces omdat plaintext de dienst binnenkomt voordat die ciphertext wordt.",
        "Bij **client-side versleuteling** versleutelt het apparaat van de verzender eerst. De dienst ontvangt en bewaart ciphertext. Die upload gaat over TLS. De dienst ontvangt niet de sleutel die nodig is om een standaardpayload te ontsleutelen. Het apparaat van de ontvanger ontsleutelt lokaal. De dienst kan de payload nog steeds bewaren, afleveren, laten verlopen en verwijderen zonder toegang tot de plaintext.",
        "Beide ontwerpen kunnen tijdelijke links, beperkte toegang en verval bieden. Beide kunnen terecht als versleuteld worden beschreven. OneTimeSecret gebruikt de eerste architectuur; PrivateNote de tweede. De relevante vraag is dus niet alleen of een eenmalige link versleuteld is, maar welke systemen toegang tot plaintext moeten hebben om die link te laten werken.",
      ],
    },
    {
      title: "OneTimeSecret: server-side versleuteling",
      paragraphs: [
        "In de gewone OneTimeSecret-flow stuurt de verzender het geheim over TLS. De applicatie ontvangt de plaintext, versleutelt die op de server en bewaart de versleutelde payload.",
        "Dit biedt zinvolle bescherming voor opgeslagen data. Alleen versleutelde opslag bemachtigen onthult de inhoud niet per se wanneer het materiaal dat voor ontsleuteling nodig is, voor de aanvaller niet beschikbaar is.",
        "De architecturale afweging zit vóór de opslag. TLS beschermt het geheim terwijl het tussen browser en OneTimeSecret reist, maar de applicatie moet de plaintext verwerken om die te versleutelen. De applicatieserver zit daardoor binnen de cryptografische vertrouwensgrens.",
        "Een kwaadaardig of gecompromitteerd applicatieproces op dat moment zou het geheim kunnen benaderen voordat het voor opslag wordt versleuteld. Client-side versleuteling verwijdert deze specifieke afhankelijkheid door het geheim te versleutelen voordat het de dienst bereikt.",
      ],
    },
    {
      title: "De passphrase van OneTimeSecret verandert de versleutelingsgrens niet",
      paragraphs: [
        "De documentatie van OneTimeSecret beschrijft een optionele passphrase. Wanneer een passphrase wordt gebruikt, zegt OneTimeSecret dat het geheim op hun servers wordt versleuteld met de door de verzender opgegeven passphrase. Ze zeggen dat ze de passphrase zelf niet opslaan; in plaats daarvan bewaren ze een bcrypt-hash om de passphrase bij ophalen te verifiëren. Volgens hun documentatie kan die hash zelf het geheim niet ontsleutelen, en kan het opgeslagen, met passphrase beschermde geheim niet zonder de oorspronkelijke passphrase worden ontsleuteld.",
        "Ophalen gebruikt dezelfde server-side grens. De ontvanger stuurt de passphrase over TLS naar OneTimeSecret. De dienst verifieert die en voert de ontsleuteling op de server uit voordat de plaintext wordt teruggegeven.",
        "Dit betekent dat het applicatieproces toegang heeft tot geheim en passphrase wanneer versleuteling plaatsvindt, en opnieuw de passphrase en de resulterende plaintext verwerkt tijdens ophalen. Een kwaadaardig of gecompromitteerd applicatieproces op een van die momenten zou die informatie mogelijk kunnen vastleggen. Dit is een gevolg van waar versleuteling en ontsleuteling plaatsvinden, geen bewering dat OneTimeSecret die waarden opslaat of misbruikt.",
        "De openbare documentatie van OneTimeSecret legt op zichzelf niet elk detail van de interne sleutelhiërarchie vast—bijvoorbeeld precies hoe server-side sleutelmateriaal, per-geheim-sleutels, sleutelafleiding en de opgegeven passphrase worden gecombineerd. Voor deze vergelijking is het niet nodig over die implementatiedetails te speculeren. De relevante gedocumenteerde eigenschap is dat versleuteling en ontsleuteling aan de dienstkant plaatsvinden.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Het geheim dat je wilt versturen, en de passphrase wanneer je er een instelt, gaan beide over TLS naar de server. Versleuteling draait op die server. Wat in opslag achterblijft, is ciphertext.",
          columns: [
            [
              { text: "Geheim + passphrase", via: "TLS" },
              { text: "Server", via: "Versleutelen" },
              { text: "Ciphertext" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-hosting kan dat serververtrouwen redelijk maken",
      paragraphs: [
        "OneTimeSecret is open source. Een organisatie kan een eigen instantie binnen een enterprise-beveiligingsperimeter draaien, in plaats van geheimen naar de openbare dienst te sturen.",
        "In die uitrol is de applicatieserver vertrouwen hetzelfde als vertrouwen in infrastructuur die de organisatie al beheert. De plaintext bereikt die server nog steeds, omdat versleuteling daar nog steeds plaatsvindt. De partij aan de andere kant van de grens bestaat uit de eigen hosts, operators en backups van de organisatie. Voor een team dat die systemen al accepteert als deel van het pad dat een geheim aflegt, kan server-side versleuteling een redelijke keuze zijn. Het verkleint het verschil tussen de server-side en client-side dreigingsmodellen, omdat de operator geen externe dienst meer is.",
      ],
    },
    {
      title: "PrivateNote versleutelt vóór de upload",
      paragraphs: [
        "Een standaard PrivateNote wordt versleuteld vóór de upload. De browser van de verzender, of een lokaal [CLI](app:developers/cli)-, [Chrome-extensie](app:developers/chrome)-, [editor-extensie](app:developers/vscode)- of [MCP](app:developers/mcp)-proces, genereert een willekeurige sleutel en versleutelt de payload met AES-256-GCM. Alleen ciphertext wordt geüpload. TLS draagt die ciphertext van de browser naar de Cloudflare-worker van PrivateNote. De ontsleutelingssleutel komt in het URL-fragment, het deel na `#`, bijvoorbeeld `https://privatenote.ai/note/abc123#…`. Het fragment wordt client-side verwerkt en zit niet in het HTTPS-verzoek ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). De worker ontvangt een notitie-identifier en geeft ciphertext terug over dezelfde TLS-verbinding. De browser houdt het fragment vast en ontsleutelt lokaal.",
      ],
    },
    {
      title: "Een passphrase beschermt de sleutel als het kanaal van de link is gecompromitteerd",
      paragraphs: [
        "Een passphrase op PrivateNote doet ander werk dan een passphrase op OneTimeSecret. De notitie is al ciphertext voordat die het apparaat verlaat. Als je een passphrase toevoegt, leidt de browser met Argon2id een wrapping-sleutel af en gebruikt die om de sleutel van de notitie te versleutelen. Het URL-fragment bevat dan de wrapped key. De ontvanger heeft de link én de passphrase nodig. De browser unwrapped de sleutel lokaal en ontsleutelt pas daarna de notitie.",
        "PrivateNote ontvangt de passphrase niet. Het create-verzoek draagt ciphertext, een salt en de parameters die de browser van de ontvanger nodig heeft om de passphrase lokaal te proberen. Er is geen server-side hash waarvan de taak is de passphrase te verifiëren. Een verkeerde passphrase faalt bij ontsleuteling op het apparaat.",
        "De passphrase beschermt bovendien de client-side sleutel lokaal als het kanaal dat de link draagt, is gecompromitteerd. Dat kanaal ziet dan een wrapped key, geen sleutel die de notitie op zichzelf kan openen. Het is niet het mechanisme dat PrivateNote buiten het plaintext-pad houdt. Die scheiding zit er bij een standaardnotitie al in, met of zonder passphrase. Deel de passphrase via een ander kanaal dan de link. Dezelfde boodschap stort de twee lagen in één in — dezelfde regel als bij [een wachtwoord veilig delen](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Lokale versleuteling produceert de client-side sleutel en de ciphertext. Argon2id wrapt die sleutel, en de wrapped key blijft in het URL-fragment. TLS draagt alleen de ciphertext naar de Cloudflare-worker.",
          columns: [
            [
              { text: "Geheim" },
              { text: "Lokale versleuteling" },
              { text: "Ciphertext", via: "TLS" },
              { text: "Server" },
            ],
            [
              { text: "Passphrase" },
              { text: "Lokaal Argon2id" },
              { text: "Sleutel inwikkelen" },
              { text: "URL-fragment" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "Dezelfde scheiding, één eigenschap tegelijk.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Payloadversleuteling", "Server", "Apparaat van de verzender"],
          ["Plaintext bereikt de dienst", "Ja", "Nee"],
          ["Passphrase bereikt de dienst", "Ja", "Nee"],
          [
            "Rol van de passphrase",
            "Neemt deel aan server-side bescherming",
            "Leidt een lokale wrapping-sleutel af",
          ],
          [
            "Opgeslagen verifier of materiaal",
            "bcrypt-verifier en versleutelde payload, volgens de docs van OneTimeSecret",
            "Salt, Argon2id-wrapparameters en ciphertext",
          ],
          ["Waar ontsleuteling plaatsvindt", "Applicatieserver van OneTimeSecret", "Apparaat van de ontvanger"],
        ],
      },
      paragraphsAfterTable: [
        "De sleutelafhandeling van PrivateNote staat beschreven op [Hoe het werkt](app:how-it-works): de contentsleutel wordt gewrapt met Argon2id, en de wrapped key reist in de link.",
      ],
    },
    {
      title: "De resterende vertrouwensaanname van de webclient",
      paragraphs: [
        "Client-side versleuteling in een browser is geen trustless webapplicatie. De cryptografie kan lokaal draaien terwijl de JavaScript die die implementeert, door de site wordt geleverd. De browser vertrouwt de code die hij voor die sessie ontvangt.",
        "Iemand die die JavaScript kan wijzigen — via de applicatie, een CDN of de deployment-pipeline — zou de client kunnen veranderen en sleutels in een toekomstige browsersessie kunnen vastleggen. Dat is een ander falen dan een database stelen. Een opslagcompromis stelt ciphertext bloot. Kwaadaardige codelevering valt het endpoint aan terwijl de sleutel daadwerkelijk aanwezig is.",
        "Een latere databasedump kan geen client-side sleutels fabriceren die daar nooit waren opgeslagen. Een actief gecompromitteerde client kan geheimen aanvallen die tijdens die sessie worden verwerkt. Dezelfde aanname staat in het dreigingsmodel van PrivateNote: de geleverde applicatiecode is niet kwaadaardig aangepast, en de apparaten van verzender en ontvanger worden vertrouwd op het moment van versleuteling en ontsleuteling.",
        "Geïnstalleerde software verkleint die afhankelijkheid van een zojuist gedownloade pagina. Een CLI, editor-extensie of native app draait code die je hebt geïnstalleerd. Die clients hangen nog steeds af van het besturingssysteem, ondertekening, dependencies en het updatekanaal. De [developer tools](app:developers) gebruiken dezelfde scheiding als de browser: lokaal versleutelen, ciphertext uploaden, de sleutel in het fragment laten.",
      ],
    },
    {
      title: "Levensduur en vertrouwelijkheid",
      paragraphs: [
        "Een eenmalige link beantwoordt twee aparte vragen. Hoe lang mag de versleutelde payload bestaan? En wie kan die ontsleutelen zolang die bestaat? Vernietigen na ophalen of verval verkort het venster. Het bepaalt niet wie hem tijdens dat venster kon lezen. Levensduur en vertrouwelijkheid versterken elkaar. De ene vervangt de andere niet.",
        "Het onderscheid is het scherpst wanneer de payload autoriteit is: API-sleutels, databasecredentials, cloudtokens, herstelcodes, infrastructuurwachtwoorden. Een dienst voor geheimen delen bestaat omdat de verzender minder systemen met die informatie wil belasten. Als de tussenpartij alleen een opaak versleuteld object hoeft te dragen, verval af te dwingen en het te verwijderen, kan de server dat werk doen zonder het geheim of de sleutel die het opent te ontvangen.",
      ],
    },
    {
      title: "Waar de grens ligt",
      paragraphs: [
        "„Versleuteld” vertelt je niet waar de vertrouwensgrens ligt. De standaard die de moeite waard is, is een minimale vertrouwensgrens: het principe van least privilege toegepast op wie plaintext moet zien. In moderne cryptografische engineering is het doel niet alleen te vertrouwen dat een server zich netjes gedraagt, maar de wiskundige noodzaak van vertrouwen in de eerste plaats te verminderen.",
        "OneTimeSecret beschrijft een server-side versleuteld systeem. Met passphrase-bescherming zeggen ze dat het opgeslagen geheim daarna niet zonder de passphrase kan worden ontsleuteld, en dat een servercompromis het geheim veilig zou laten zolang die passphrase onbekend blijft. Een zwakke passphrase kan met brute force worden aangevallen. Als die zwak is, kan dat compromis het geheim alsnog herstelbaar maken. De plaintext en de passphrase bereiken OneTimeSecret bij aanmaak, omdat versleuteling op hun servers gebeurt, en de passphrase wordt bij ophalen teruggezonden zodat die servers kunnen ontsleutelen.",
        "PrivateNote maakt een andere architecturale keuze. De payload wordt versleuteld voordat die de dienst bereikt, en de standaard payloadsleutel blijft client-side. Een passphrase, wanneer je er een instelt, beschermt die client-side sleutel bovendien lokaal als het kanaal dat de link draagt, is gecompromitteerd. Die wordt niet naar PrivateNote gestuurd.",
        "OneTimeSecret versleutelt je geheim. De client die de dienst van PrivateNote gebruikt, versleutelt het voordat de dienst het ontvangt. Dat onderscheid hangt niet af van de aanname dat een van beide providers kwaadaardig is. Het reduceert de vraag tot architectuur: hoeveel systemen hebben toegang tot plaintext nodig om de dienst te laten werken?",
      ],
    },
    {
      title: "Veelgestelde vragen",
      faqs: [
        {
          question: "Slaat OneTimeSecret het geheim in plaintext op?",
          answer:
            "Hun documentatie zegt nee. Ze versleutelen op hun servers. Met een passphrase zeggen ze dat ze het versleutelde geheim en een bcrypt-hash van de passphrase opslaan, niet de passphrase, en dat de hash het geheim niet kan ontsleutelen.",
        },
        {
          question: "Als ik een passphrase op OneTimeSecret instel, is het geheim dan verborgen voor hun servers?",
          answer:
            "Niet tijdens aanmaak, en niet bij ophalen. OneTimeSecret zegt dat geheim en passphrase aan hun server worden aangeboden zodat de server de versleuteling kan uitvoeren. Wanneer de ontvanger de link opent, stuurt die de passphrase over TLS terug, en ontsleuteling draait op de servers van OneTimeSecret voordat de plaintext wordt teruggegeven. Na versleuteling zegt OneTimeSecret de plaintext-passphrase te verwerpen, alleen een bcrypt-hash te bewaren, en het opgeslagen geheim niet zonder de oorspronkelijke passphrase te kunnen ontsleutelen.",
        },
        {
          question: "Wat beschermt een PrivateNote-passphrase?",
          answer:
            "De client-side sleutel, als het kanaal dat de link draagt, is gecompromitteerd. De notitie zelf is al op je apparaat versleuteld met AES-256-GCM. Argon2id leidt lokaal een wrapping-sleutel af uit de passphrase, en die wrapping-sleutel versleutelt de sleutel van de notitie. De link bevat dan een wrapped key. PrivateNote ontvangt ciphertext en een salt. Het ontvangt niet de passphrase of de ruwe sleutel. Een standaardnotitie is zelfs zonder passphrase versleuteld vóór de upload. Stuur de passphrase via een apart kanaal van de link.",
        },
        {
          question: "Kan client-side versleuteling beschermen tegen een gecompromitteerde PrivateNote-server?",
          answer:
            "Een compromis van opgeslagen data of de API: ja, in de zin dat client-side versleuteling ongelezen payloads isoleert, omdat de server de standaard payloadsleutel niet heeft. Een latere databasedump kan geen sleutels fabriceren die daar nooit waren opgeslagen. Kwaadaardige clientcode-levering: nee. Een aanvaller die de JavaScript voor een toekomstige browsersessie kan wijzigen, zou kunnen proberen de sleutel vast te leggen terwijl die aanwezig is. Geïnstalleerde clients verminderen die afhankelijkheid van een zojuist gedownloade pagina.",
        },
      ],
    },
    {
      title: "Primaire bronnen",
      paragraphs: [
        "Architectuurinformatie over OneTimeSecret is getoetst aan de openbare documentatie op 23 september 2026. Productimplementaties en documentatie kunnen wijzigen.",
      ],
      bullets: [
        "[OneTimeSecret-documentatie](https://docs.onetimesecret.com/)",
        "[OneTimeSecret over beveiliging en passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret-broncode](https://github.com/onetimesecret/onetimesecret)",
        "[Hoe PrivateNote-versleuteling werkt](app:how-it-works)",
        "[PrivateNote voor developers](blog:privatenote-for-developers), inclusief de CLI",
        "[RFC 3986, sectie 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), die het fragment scheidt van de URI vóór dereference",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), over client-side afhandeling van het fragment",
      ],
    },
  ],
  ctaTitle: "Versleutel voordat het geheim het apparaat verlaat",
  ctaBody:
    "Schrijf de notitie in de browser. De client versleutelt lokaal, zet de sleutel in de link en kan die sleutel beschermen met een passphrase die de server nooit ontvangt.",
  ctaPrimary: "Maak een private note",
  ctaSecondary: "Bekijk hoe versleuteling werkt",
};
