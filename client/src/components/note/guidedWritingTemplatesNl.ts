import {
  guidedWritingOption as option,
  type GuidedWritingTemplateRecord,
} from "./localFallbackShared";

export const GUIDED_WRITING_TEMPLATES_NL: GuidedWritingTemplateRecord = {
  "ask-anything": {
    "1-2": [
      option("Warme regel", "Hoi {{recipientName}}, ik wilde je even zeggen: {{mainMessage}}. Ik hoop dat het goed met je gaat.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Kort bericht", "Hoi {{recipientName}}, ik stuur je dit over {{topic}}. Laat maar weten wat jou het beste uitkomt.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Warme opening", "Hoi {{recipientName}}, ik wilde al een tijdje iets over {{topic}} schrijven. Ik wilde zeggen: {{mainMessage}} — vooral omdat {{reason}}. Ik wens je een fijne rest van de week.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Duidelijke follow-up", "Hoi {{recipientName}}, ik wilde even terugkomen op {{topic}}. Het belangrijkste voor mij is: {{mainMessage}}. Laat maar weten als je verder wilt praten.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Bedachtzaam concept", "Hoi {{recipientName}}, ik wilde je even iets schrijven over {{topic}}. Ik heb nagedacht over {{relevantDetail}} en vond dat het de moeite waard was om je te schrijven. De kern: {{mainMessage}}. Ik waardeer vooral {{specificDetail}}. Schrijf terug wanneer het jou uitkomt.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Evenwichtig concept", "Hoi {{recipientName}}, ik hoop dat het goed met je gaat. Ik schrijf je over {{topic}} omdat {{reason}}. Ik wilde je zeggen: {{mainMessage}}. Verder: {{extraDetail}}. Reageer wanneer het jou schikt.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Persoonlijke brief", "Hoi {{recipientName}}, ik hoop dat het goed met je gaat. Ik wilde je iets schrijven over {{topic}} omdat het me veel betekent. De afgelopen {{timeframe}} heb ik veel nagedacht over {{relevantDetail}}. Het belangrijkste voor mij is: {{mainMessage}}. Verder: {{extraDetail}}, omdat dat voor mij belangrijk is. Ik waardeer {{specificDetail}} enorm. Geen druk om te antwoorden — ik wilde het gewoon duidelijk en eerlijk zeggen.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Uitgebreide notitie", "Hoi {{recipientName}}, ik wilde je een iets langer bericht sturen over {{topic}}. Eerst: {{mainMessage}}. Waarom het me veel betekent: {{reason}}. Ook: {{extraDetail}}. Als het jou uitkomt, kunnen we {{nextStep}}. Als het geen goed moment is, is dat ook prima. Ik wilde gewoon duidelijk, vriendelijk en oprecht zijn.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason", "extraDetail", "nextStep"],
      }),
    ],
  },
  "thank-you": {
    "1-2": [
      option("Klassieke dank", "Dank je wel, {{recipientName}}, voor {{supportType}}. Het betekende ontzettend veel voor me.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Formele dank", "Dank je wel voor {{specificDetail}}, {{recipientName}}. Ik waardeer je steun enorm.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Dank van harte", "Heel erg bedankt, {{recipientName}}, voor {{actionTaken}}. Je steun hielp me enorm met {{result}}. Ik kan niet genoeg zeggen hoe dankbaar ik ben.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Warme regels", "Hoi {{recipientName}}, dank je wel voor {{supportType}}. Het was een attente en gulle geste, en het betekende veel voor me. Ik waardeer het echt.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Uitgebreide dank", "Hoi {{recipientName}}, ik wilde je echt bedanken voor {{actionTaken}}. Het was ontzettend vriendelijk en het hielp me meer dan je misschien doorhebt. Ik waardeerde vooral {{specificDetail}}. Je betrokkenheid maakte een stressvol moment lichter. Nogmaals bedankt voor je vrijgevigheid en steun.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Dankbrief", "Dank je wel, {{recipientName}}, voor {{supportType}}. Ik wilde al een tijdje zeggen hoeveel ik het waardeerde. Het betekende veel omdat {{reason}}. Het is me niet ontgaan. Ik heb geluk met jouw steun.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Lange dank", "Hoi {{recipientName}}, ik wilde je echt bedanken voor {{actionTaken}}. Ik weet dat er tijd, moeite en zorg in zat, en ik neem dat niet vanzelfsprekend. Wat het meest voor me betekende, was {{specificDetail}}. Het hielp met {{resultOrSituation}} en maakte alles een stuk draaglijker. Je vriendelijkheid kwam precies op het juiste moment. Ik ben je oprecht dankbaar. Bedankt dat je er voor me was.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Diepgaande erkenning", "Hoi {{recipientName}}, duizendmaal dank voor {{supportType}}. Ik heb vaak nagedacht over hoeveel het voor me betekende. Het was niet alleen gul, maar ook heel attent. Ik waardeerde vooral {{specificDetail}}. Dankzij jou {{positiveResult}}. Onthoud hoe dankbaar ik ben. Je steun heeft een blijvende indruk achtergelaten.", {
        tone: "formal",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "specificDetail", "positiveResult"],
      }),
    ],
  },
  "meeting-request": {
    "1-2": [
      option("Kort verzoek", "Hoi {{recipientName}}, kunnen we een afspraak plannen over {{topic}} op {{dayOrTime}}?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Professioneel verzoek", "Hoi {{recipientName}}, ik zou graag een kort overleg plannen over {{topic}}. Laat me weten wanneer het jou uitkomt.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Duidelijk verzoek", "Hoi {{recipientName}}, ik zou graag een afspraak plannen over {{topic}}. Komt {{dayOrTime}} jou uit? Zo niet, dan zoeken we een ander moment.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Follow-up", "Hoi {{recipientName}}, ik schrijf je om een call te plannen over {{topic}}. {{dayOrTime}} komt mij goed uit. Wat werkt het beste voor jou?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Uitgebreid verzoek", "Hoi {{recipientName}}, ik wilde tijden voorstellen voor een afspraak over {{topic}}. Ik denk dat het helpt om {{specificDetail}} door te nemen. Voorlopig kan ik op {{dayOrTime}}, maar ik kan me aanpassen als dat nodig is. Laat me weten welk tijdstip jou het beste uitkomt.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Formeel verzoek", "Goedemorgen {{recipientName}}, ik zou graag een afspraak plannen over {{topic}}. Een kort gesprek zou helpen om {{specificDetail}} te verduidelijken. Ik ben beschikbaar op {{dayOrTime}}, of ook op {{alternateTime}}. Laat me weten welke datum je verkiest. Alvast bedankt.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Uitgebreide briefing", "Hoi {{recipientName}}, ik hoop dat het goed met je gaat. Kunnen we een afspraak plannen over {{topic}}? Ik denk dat het nuttig is om {{specificDetail}} te bespreken en de volgende stappen af te stemmen. Ik ben beschikbaar op {{dayOrTime}}; {{alternateTime}} kan ook. Als een andere dag jou beter uitkomt, pas ik me aan. Laat me weten wat jou het beste uitkomt. Ik waardeer je tijd en wil het gesprek graag goed voorbereiden.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Formele briefing", "Goedemorgen {{recipientName}}, ik zou graag een afspraak aanvragen over {{topic}}. Er zijn verschillende punten die ik graag wil bespreken, vooral {{specificDetail}}. Een kort gesprek zou helpen om efficiënter verder te komen. Ik ben beschikbaar op {{dayOrTime}}, maar ik ben flexibel. Als je wilt, kunnen we ook praten via {{extraDetail}}. Laat me weten welk tijdstip jou het beste uitkomt. Dank je wel.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "extraDetail"],
      }),
    ],
  },
  birthday: {
    "1-2": [
      option("Klassieke felicitatie", "Gefeliciteerd, {{recipientName}}! Ik hoop dat je dag vol vreugde en mooie momenten is.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Vrolijke regel", "Gefeliciteerd, {{recipientName}}! Ik wens je een geweldig jaar.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Warme felicitatie", "Gefeliciteerd, {{recipientName}}! Ik hoop dat vandaag je veel geluk brengt en ruimte geeft om te vieren. Je verdient echt een fijne dag.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Persoonlijke regels", "Gefeliciteerd, {{recipientName}}! Ik ben blij dat je in mijn leven bent. Ik hoop dat dit jaar je nog meer {{joyWish}} brengt en veel redenen om te glimlachen.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Bedachtzame felicitatie", "Gefeliciteerd, {{recipientName}}! Ik hoop dat je de dag kunt doorbrengen met de mensen en dingen waar je van houdt. Je brengt zoveel {{quality}} in het leven van anderen. Ik ben heel dankbaar voor {{specificDetail}}. Ik wens je een jaar vol geluk, gezondheid en onvergetelijke momenten.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Felicitatie van harte", "Gefeliciteerd, {{recipientName}}! Ik wilde je vandaag echt iets sturen, want je betekent veel voor me. Ik hoop dat dit jaar je {{goalOrWish}} brengt en veel momenten waar je trots op bent en die je gelukkig maken. Je verdient het om gevierd te worden. Geniet van je dag.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Lang verjaardagsbericht", "Gefeliciteerd, {{recipientName}}! Ik hoop dat je dag vol lachen, warmte en al die kleine dingen is die je het gelukkigst maken. Je bent zo'n {{quality}} persoon, en jou kennen is echt een cadeau. Een van de dingen die ik het meest aan je waardeer, is {{memory}}. Ik hoop dat het komende jaar je {{hopeOrGoal}} brengt. Je verdient goede mensen, gezondheid en veel vreugde. Bedankt dat je precies bent wie je bent. Ik hoop dat vandaag net zo bijzonder voelt als jij voor anderen bent.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Uitgebreide felicitatie", "Gefeliciteerd, {{recipientName}}! Ik wilde meer sturen dan een korte regel, want je verdient dat. Je hebt een manier om {{quality}} in het leven van anderen te brengen. Ik ben vooral dankbaar voor {{memory}}. Ik hoop dat het komende jaar je {{hopeOrGoal}} geeft, maar ook rust, plezier en spannende dingen. Moge je vandaag gevierd, gewaardeerd en heel geliefd voelen. De beste wensen voor je verjaardag.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
    ],
  },
  apology: {
    "1-2": [
      option("Directe excuses", "Het spijt me, {{recipientName}}, voor {{happened}}. Ik had het beter moeten aanpakken.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Eenvoudig en oprecht", "Het spijt me echt voor {{happened}}. Ik begrijp waarom dat pijn deed of frustrerend was.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Duidelijke excuses", "Het spijt me, {{recipientName}}, voor {{happened}}. Ik besef dat mijn gedrag je heeft geraakt en dat betreur ik. Ik wil het in de toekomst beter doen.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Professionele excuses", "Ik wil me verontschuldigen voor {{issue}}. Ik besef het ongemak en neem de verantwoordelijkheid. Ik werk eraan om het goed te maken.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Oprechte excuses", "Hoi {{recipientName}}, ik wil me van harte verontschuldigen voor {{happened}}. Ik begrijp dat dat {{impact}} veroorzaakte, en het spijt me dat ik je in die situatie heb gebracht. Ik had anders moeten handelen. Ik neem mijn verantwoordelijkheid volledig op me. Als het kan, zou ik het graag goedmaken met {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Bedachtzame excuses", "Ik heb nagedacht over {{happened}} en wil het duidelijk zeggen: het spijt me. Je verdiende {{impact}} niet, en het spijt me hoe ik reageerde. Ik begrijp dat je je {{feeling}} voelt. Ik zoek geen excuses. Ik wil het eerlijk erkennen en het beter doen.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Uitgebreide excuses", "Hoi {{recipientName}}, ik wilde me echt verontschuldigen voor {{happened}}. Ik besef dat mijn gedrag {{impact}} veroorzaakte, en dat betreur ik oprecht. Achteraf had ik de situatie zorgvuldiger en met meer respect moeten behandelen. Je verdiende die stress en teleurstelling niet. Ik neem de verantwoordelijkheid. Ik zou het graag goedmaken met {{fixStep}}. Als vertrouwen tijd nodig heeft, begrijp ik dat — mijn excuses zijn oprecht.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Lang oprecht bericht", "Het spijt me, {{recipientName}}, voor {{happened}}. Ik heb er veel over nagedacht en zie hoe het je heeft geraakt. Het spijt me dat ik op dat moment niet zorgvuldiger, attentiever of eerlijker was. Je verdiende meer van me. Ik wil het niet bagatelliseren. Ik zat ernaast en het spijt me. Als je openstaat, zou ik het graag goedmaken met {{fixStep}}. Bedankt dat je dit leest.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "fixStep"],
      }),
    ],
  },
  love: {
    "1-2": [
      option("Korte liefdesregel", "Ik hou van je, {{recipientName}}. Je verlicht mijn leven op zoveel manieren.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Eenvoudige romantische regel", "Ik wilde alleen zeggen: ik hou van je en ik waardeer je meer dan woorden kunnen uitdrukken.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warme romantische regels", "Ik hou van je, {{recipientName}}, en ik ben zo gelukkig dat je in mijn leven bent. Je geeft me zoveel {{feeling}}. Ik hoop dat je weet hoeveel je voor me betekent.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Zachte verklaring", "Met jou worden gewone dagen bijzonder. Ik hou van je om {{quality}}, en ik wil dat nooit vanzelfsprekend vinden. Je betekent ontzettend veel voor me.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Bedachtzaam liefdesbericht", "Ik hou van je, {{recipientName}}, en ik wilde dat goed uitdrukken. Een van de dingen die ik het meest aan je waardeer, is {{quality}}. Bij jou voel ik me {{feeling}}, en dat betekent meer voor me dan ik kan uitleggen. Ik ben dankbaar voor hoe je in mijn leven bent. Van je houden is een van de mooiste en meest natuurlijke dingen die ik ken.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Tedere regels", "Soms zeg ik het niet genoeg, maar ik hou echt van je. Ik hou ervan hoe {{specificDetail}}, en ik hou ervan hoe het voelt om bij je te zijn — als {{feeling}}. Je maakt het leven zachter, leuker en betekenisvoller. Elke dag ben ik dankbaar voor je.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Lang romantisch bericht", "Ik hou van je, {{recipientName}}, en ik wilde je vandaag wat uitgebreider vertellen hoeveel. Je brengt zoveel {{feeling}} in mijn leven en ik neem dat niet vanzelfsprekend. Een van de dingen die ik het meest aan je waardeer, is {{specificDetail}}. Met jou is mijn leven op zoveel stille maar belangrijke manieren veranderd. Ik hou ervan hoe {{quality}}. Ik ben diep dankbaar dat ik van je mag houden en het leven met je mag delen. Bedankt dat je jezelf bent. Ik hou meer van je dan in één bericht past.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Lange regels van harte", "Je betekent zoveel voor me, {{recipientName}}. Ik hou van je om wie je bent, om hoe je me laat voelen en om hoe je {{feeling}} in mijn leven brengt. Ik denk vaak aan {{memory}}, en het herinnert me eraan hoe gelukkig ik ben dat ik je heb. Zelfs moeilijke dagen worden lichter met jou. Ik bewonder {{quality}} en ik waardeer {{specificDetail}}. Ik hoop dat je altijd weet hoe diep je geliefd bent. Ik ben zo dankbaar voor je.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "memory", "quality", "specificDetail"],
      }),
    ],
  },
  congratulations: {
    "1-2": [
      option("Klassieke felicitatie", "Gefeliciteerd, {{recipientName}}, met {{achievement}}! Wat fantastisch nieuws.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Trotse regel", "Enorm gefeliciteerd met {{achievement}}. Je hebt er hard voor gewerkt en dat is te zien.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Warme felicitatie", "Gefeliciteerd, {{recipientName}}, met {{achievement}}! Ik ben ontzettend blij voor je. Je verdient dit moment echt.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Professionele felicitatie", "Gefeliciteerd met {{achievement}}. Je inzet en toewijding hebben vruchten afgeworpen. Ik wens je veel succes in de volgende stap.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Bedachtzame felicitatie", "Gefeliciteerd, {{recipientName}}, met {{achievement}}! Wat spannend en heel verdiend nieuws. Ik weet hoeveel werk, tijd en moeite erin zit. Je mag ontzettend trots zijn. Ik ben heel blij voor je en ben benieuwd wat er komt.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Ondersteunende felicitatie", "Ik wilde je van harte feliciteren met {{achievement}}. Je hebt er {{timeframe}} aan gewerkt, en het is mooi om te zien dat die inspanning wordt erkend. Je verdient het. Neem even de tijd om te vieren. Ik wens je nog meer successen.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Lange felicitatie", "Gefeliciteerd, {{recipientName}}, met {{achievement}}! Het nieuws maakte me heel blij. Je hebt er hard voor gewerkt en het is mooi om te zien hoe die inspanning zo'n betekenisvol resultaat oplevert. Een van de dingen die ik vooral waardeer, is {{quality}}. Je mag heel trots zijn op wat je hebt bereikt. Ik hoop dat je de tijd neemt om van dit moment te genieten en het echt te vieren. Je verdient het. Ik wens je nog meer succes en geluk in het volgende hoofdstuk.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Lange trotse regels", "Enorm gefeliciteerd met {{achievement}}, {{recipientName}}. Het is een prachtige mijlpaal en ik weet dat het niet uit de lucht kwam vallen. Je {{quality}} is echt te zien. Ik twijfel er niet aan dat je het met veel moeite hebt bereikt. Het is mooi om je op dit punt te zien. Neem even de tijd om te beseffen hoe ver je bent gekomen. Je mag trots zijn. Ik ben het in elk geval op je.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement", "recipientName", "quality"],
      }),
    ],
  },
  farewell: {
    "1-2": [
      option("Klassiek afscheid", "Het was geweldig om met jullie te werken. Bedankt voor alles — ik wens jullie het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Warm afscheid", "Bedankt voor de steun en de mooie herinneringen. Ik wens jullie het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warm afscheid", "Terwijl ik aan een nieuw hoofdstuk begin, bedank ik jullie voor {{specificDetail}}. Met jullie werken betekende veel voor me. Ik wens jullie het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Professioneel afscheid", "Bedankt voor de kans om in zo'n geweldig team te werken. Ik heb veel geleerd en waardeer jullie steun. Veel succes.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Bedachtzaam afscheid", "Nu ik vertrek, wil ik {{groupName}} bedanken. Deze tijd betekende veel voor me en ik ben dankbaar voor {{specificDetail}}. Ik heb het echt gewaardeerd om deel uit te maken van dit team. Ik ga {{memory}} missen. Ik wens jullie veel succes en het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Dankbaar afscheid", "Afscheid nemen is niet makkelijk, maar ik wil {{groupName}} bedanken voor alles. Ik heb hier veel geleerd en waardeer vooral {{specificDetail}}. Met jullie werken was betekenisvol en onvergetelijk. Ik neem veel mee. Ik wens jullie het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Lang afscheid", "Voordat ik verder ga, wil ik {{groupName}} echt bedanken. Dit hoofdstuk betekende ontzettend veel voor me en ik ben oprecht dankbaar voor {{specificDetail}}. Ik heb veel van jullie geleerd. Ik zal vooral {{memory}} onthouden. Bedankt dat jullie deze tijd zo betekenisvol en onvergetelijk maakten. Ik ga de mensen en de momenten missen. Ik wens jullie veel succes, geluk en het allerbeste.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Lang teamafscheid", "Voordat ik vertrek, wilde ik zeggen hoeveel ik het waardeerde om deel uit te maken van {{groupName}}. Bedankt voor de steun, de vrijgevigheid en het enthousiasme. Deze ervaring heeft me veel gebracht, persoonlijk en professioneel. Ik ben vooral dankbaar voor {{specificDetail}}. Hoewel ik uitkijk naar wat komt, ga ik dit team en de banden missen. Ik hoop dat we contact houden. Ik wens jullie veel succes en geluk.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
  },
  invitation: {
    "1-2": [
      option("Klassieke uitnodiging", "Je bent uitgenodigd voor {{eventName}} op {{date}} in {{place}}. Ik zou het heel fijn vinden als je erbij kunt zijn.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Informele uitnodiging", "We zien elkaar bij {{eventName}} op {{dayOrTime}}, en ik zou het fijn vinden als je erbij bent.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Warme uitnodiging", "Ik nodig je graag uit voor {{eventName}} op {{date}} in {{place}}. Het begint om {{time}} — het zou veel voor me betekenen als je erbij kunt zijn. Laat het me weten wanneer je kunt.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Vriendelijke uitnodiging", "Hoi {{recipientName}}, ik nodig je uit voor {{eventName}} op {{dayOrTime}} in {{place}}. Ik zou het heel graag met je vieren. Ik hoop dat je kunt.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Bedachtzame uitnodiging", "Hoi {{recipientName}}, ik zou je graag uitnodigen voor {{eventName}} op {{date}} in {{place}}. We beginnen rond {{time}}, en het zou veel voor me betekenen als je erbij bent. Het is een gelegenheid om {{occasion}}. Laat me weten of je kunt komen. Ik zou het fijn vinden om samen te vieren.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Uitgebreide uitnodiging", "Je bent van harte uitgenodigd voor {{eventName}} op {{date}} in {{place}}. We beginnen om {{time}} en we zouden het fijn vinden als je erbij bent. Het wordt een mooi moment met {{eventDetail}}. Laat het me vóór {{rsvpDate}} weten. Ik hoop dat je kunt komen.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Lange uitnodiging", "Hoi {{recipientName}}, ik wilde je een echte uitnodiging sturen voor {{eventName}}. We komen samen op {{date}} in {{place}}, met een start rond {{time}}. Het zou veel voor me betekenen als je erbij bent en we samen vieren. Er staat {{eventDetail}} op het programma — ik denk dat het iets bijzonders wordt. Laat het me vóór {{rsvpDate}} weten als het jou uitkomt. Ik zou je graag zien.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Uitgebreide warme uitnodiging", "Ik nodig je met veel plezier uit voor {{eventName}} op {{date}} in {{place}}. Deze gelegenheid is me veel waard, en met jou wordt het nog specialer. We beginnen om {{time}}, en er staat {{eventDetail}} op het programma. Er is tijd om te ontspannen, te vieren en te genieten. Laat het me vóór {{rsvpDate}} weten. Ik hoop echt dat je kunt komen — zonder jou is het niet hetzelfde.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
  },
  condolence: {
    "1-2": [
      option("Zachte condoleance", "Het spijt me zo voor je verlies, {{recipientName}}. Ik denk aan je en je familie.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Discrete steun", "Mijn hart is bij je in deze moeilijke tijd. Het spijt me zo voor wat je doormaakt.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Eenvoudige condoleance", "Het spijt me zo voor je verlies, {{recipientName}}. Ik denk aan je en stuur je warmte. Ik hoop dat je steun voelt in de komende dagen.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Zachte steun", "Het raakte me diep om te horen over {{loss}}. Ik denk aan je en je familie. Ik wens je kracht en troost in deze moeilijke tijd.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Warme condoleance", "Het raakte me diep om te horen over {{loss}}. Mijn oprechte deelneming. Ik kan me maar matig voorstellen hoe moeilijk dit moment voor jou en je familie is. Ik hoop dat je omringd bent door liefde en steun. Ik denk aan je en wens je kracht.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Regels van harte", "Het spijt me zo voor je verlies, {{recipientName}}. Er zijn geen perfecte woorden voor een moment als dit, maar ik wilde je laten weten dat ik aan je denk. {{personName}} zal in herinnering blijven om {{tribute}}. Je staat er niet alleen voor. Ik stuur je warmte en deelneming.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Lange condoleance", "Het raakte me diep om te horen over {{loss}}, {{recipientName}}. Ik kan me moeilijk voorstellen wat je nu voelt, maar ik wilde je laten weten dat ik aan je denk. Mijn oprechte deelneming. {{personName}} zal in herinnering blijven om {{tribute}}. Ik hoop dat je omringd bent door mensen die je steunen. Als ik iets kan doen, ook al is het klein, laat het me weten. Ik stuur je warmte, kracht en troost.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Lange zachte regels", "Je verlies raakt me diep. Ik weet dat woorden in momenten als deze klein kunnen lijken, maar ik wilde je laten weten dat ik aan je en je familie denk. {{personName}} betekende zoveel en zal met liefde in herinnering blijven. Ik hoop dat je troost vindt bij de mensen om je heen en in de herinneringen. Zorg goed voor jezelf. Mijn oprechte deelneming en steun.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["personName"],
      }),
    ],
  },
  reminder: {
    "1-2": [
      option("Korte herinnering", "Even een snelle herinnering voor {{task}} op {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Beleefde herinnering", "Vriendelijke herinnering: {{task}} vóór {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Beleefde herinnering", "Hoi {{recipientName}}, een korte herinnering over {{task}}. De deadline is {{dayOrTime}}. Laat me weten als je iets van mij nodig hebt.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Professionele herinnering", "Vriendelijke herinnering over {{task}}. Stuur het vóór {{deadline}} in, als dat kan. Dank je wel.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Bedachtzame herinnering", "Hoi {{recipientName}}, ik wilde je even herinneren aan {{task}}. De deadline is {{dayOrTime}} — ik wilde alleen zeker weten dat het op je radar staat. Als je steun nodig hebt, laat het me weten. Bedankt dat je het oppakt.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Duidelijke herinnering", "Hoi {{recipientName}}, een vriendelijke herinnering over {{task}}. We willen dit graag afgerond hebben vóór {{deadline}}. Ik weet dat agenda's vol zitten — daarom deze korte notitie. Als je vragen hebt, schrijf me. Dank je wel.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Lange herinnering", "Hoi {{recipientName}}, ik wilde je vriendelijk herinneren aan {{task}}. De deadline is {{dayOrTime}}, daarom dit bericht op tijd. Ik weet dat je veel op je hebt — dit is gewoon een behulpzame duwtje in de rug. Als ik iets kan vergemakkelijken, laat het me weten. Bedankt voor je hulp en je tijd.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Lange professionele herinnering", "Hoi {{recipientName}}, ik hoop dat het goed met je gaat. Een korte herinnering over {{task}}. We willen dit graag afgerond hebben vóór {{deadline}}, daarom stuur ik dit alvast. Als er problemen, vertragingen of vragen zijn, laat het me weten — ik help waar ik kan. Bedankt voor je aandacht.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
