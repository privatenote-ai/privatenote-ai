import {
  guidedWritingOption as option,
  type GuidedWritingTemplateRecord,
} from "./localFallbackShared";

export const GUIDED_WRITING_TEMPLATES_IT: GuidedWritingTemplateRecord = {
  "ask-anything": {
    "1-2": [
      option("Messaggio caloroso", "Ciao {{recipientName}}, volevo solo dirti: {{mainMessage}}. Spero che tu stia bene.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Messaggio breve", "Ciao {{recipientName}}, ti scrivo per {{topic}}. Dimmi quando ti fa comodo.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Apertura calorosa", "Ciao {{recipientName}}, da tempo volevo scriverti riguardo a {{topic}}. Volevo dirti: {{mainMessage}} — soprattutto perché {{reason}}. Ti auguro un buon fine settimana.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Follow-up chiaro", "Ciao {{recipientName}}, volevo riprendere il tema di {{topic}}. La cosa più importante per me è: {{mainMessage}}. Fammi sapere se vuoi parlarne di più.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Bozza riflessiva", "Ciao {{recipientName}}, volevo scriverti un momento su {{topic}}. Ho pensato a {{relevantDetail}} e mi è sembrato che valesse la pena scriverti. L'essenziale: {{mainMessage}}. Apprezzo soprattutto {{specificDetail}}. Scrivimi quando puoi.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Bozza equilibrata", "Ciao {{recipientName}}, spero che tu stia bene. Ti scrivo su {{topic}} perché {{reason}}. Volevo dirti: {{mainMessage}}. Inoltre: {{extraDetail}}. Rispondimi quando ti fa comodo.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Lettera personale", "Ciao {{recipientName}}, spero che tu stia bene. Volevo scriverti su {{topic}} perché mi sta a cuore. Negli ultimi {{timeframe}} ho pensato molto a {{relevantDetail}}. La cosa più importante per me è: {{mainMessage}}. Inoltre: {{extraDetail}}, perché è importante per me. Apprezzo moltissimo {{specificDetail}}. Nessuna pressione a rispondere — volevo solo dirlo con chiarezza e sincerità.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Nota dettagliata", "Ciao {{recipientName}}, volevo inviarti un messaggio un po' più lungo su {{topic}}. Prima di tutto: {{mainMessage}}. Perché mi sta a cuore: {{reason}}. Anche: {{extraDetail}}. Se ti fa comodo, potremmo {{nextStep}}. Se non è il momento giusto, nessun problema. Volevo solo essere chiaro, gentile e sincero.", {
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
      option("Ringraziamento classico", "Grazie, {{recipientName}}, per {{supportType}}. Ha significato moltissimo per me.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Ringraziamento formale", "Grazie per {{specificDetail}}, {{recipientName}}. Apprezzo molto il tuo supporto.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Ringraziamento dal cuore", "Grazie mille, {{recipientName}}, per {{actionTaken}}. Il tuo supporto mi è stato di grande aiuto con {{result}}. Non saprei quanto ringraziarti.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Righe calorose", "Ciao {{recipientName}}, grazie per {{supportType}}. È stato un gesto premuroso e generoso, e ha significato molto per me. Te ne sono davvero grato.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Ringraziamento esteso", "Ciao {{recipientName}}, volevo ringraziarti davvero per {{actionTaken}}. È stato incredibilmente gentile e mi ha aiutato più di quanto tu possa immaginare. Ho apprezzato soprattutto {{specificDetail}}. La tua vicinanza ha alleviato un momento di stress. Grazie ancora per la tua generosità e il tuo supporto.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Lettera di gratitudine", "Grazie, {{recipientName}}, per {{supportType}}. Da tempo volevo dirti quanto l'ho apprezzato. Ha significato molto perché {{reason}}. Non è passato inosservato per me. È una fortuna poter contare sul tuo supporto.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Ringraziamento lungo", "Ciao {{recipientName}}, volevo ringraziarti davvero per {{actionTaken}}. So che c'è stato tempo, impegno e cura dietro, e non lo do per scontato. Ciò che ha significato di più per me è stato {{specificDetail}}. Ha aiutato con {{resultOrSituation}} e ha reso le cose più gestibili. La tua gentilezza è arrivata al momento giusto. Te ne sono grato dal cuore. Grazie per essere stato al mio fianco.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Profondo riconoscimento", "Ciao {{recipientName}}, grazie mille per {{supportType}}. Ho pensato spesso a quanto abbia significato per me. Non è stato solo generoso, ma anche molto premuroso. Ho apprezzato soprattutto {{specificDetail}}. Grazie a te, {{positiveResult}}. Tieni presente quanto te ne sono grato. Il tuo supporto ha lasciato un segno duraturo.", {
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
      option("Richiesta breve", "Ciao {{recipientName}}, potremmo fissare un incontro su {{topic}} il {{dayOrTime}}?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Richiesta professionale", "Ciao {{recipientName}}, vorrei programmare un breve incontro su {{topic}}. Dimmi, per favore, quando ti fa comodo.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Richiesta chiara", "Ciao {{recipientName}}, vorrei fissare un incontro su {{topic}}. Ti andrebbe bene {{dayOrTime}}? Altrimenti troviamo un altro momento.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Follow-up", "Ciao {{recipientName}}, ti scrivo per coordinare una chiamata su {{topic}}. Il {{dayOrTime}} mi va bene. Cosa preferisci tu?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Richiesta dettagliata", "Ciao {{recipientName}}, volevo proporti degli orari per un incontro su {{topic}}. Penso che sarebbe utile rivedere {{specificDetail}}. Per ora posso il {{dayOrTime}}, ma posso adattarmi se serve. Dimmi, per favore, quale orario ti conviene.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Richiesta formale", "Buongiorno {{recipientName}}, vorrei fissare un incontro su {{topic}}. Una breve conversazione aiuterebbe a chiarire {{specificDetail}}. Sono disponibile il {{dayOrTime}}, oppure il {{alternateTime}}. Mi indichi, per favore, quale data preferisce. La ringrazio anticipatamente.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Briefing dettagliato", "Ciao {{recipientName}}, spero che tu stia bene. Possiamo pianificare un incontro su {{topic}}? Mi sembrerebbe utile parlare di {{specificDetail}} e allineare i prossimi passi. Sono disponibile il {{dayOrTime}}; anche {{alternateTime}} potrebbe andare bene. Se un altro giorno ti conviene di più, posso adattarmi. Dimmi, per favore, cosa preferisci. Apprezzo il tuo tempo e vorrei preparare la conversazione con cura.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Briefing formale", "Buongiorno {{recipientName}}, vorrei richiedere un incontro su {{topic}}. Ci sono diversi punti che vorrei trattare, in particolare {{specificDetail}}. Una breve conversazione aiuterebbe ad avanzare con maggiore efficienza. Sono disponibile il {{dayOrTime}}, ma sono flessibile. Se lo desidera, possiamo parlare anche tramite {{extraDetail}}. Mi indichi, per favore, quale orario le conviene di più. La ringrazio.", {
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
      option("Auguri classici", "Buon compleanno, {{recipientName}}! Spero che la tua giornata sia piena di gioia e bei momenti.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Riga allegra", "Buon compleanno, {{recipientName}}! Ti auguro un anno meraviglioso.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Auguri calorosi", "Buon compleanno, {{recipientName}}! Spero che oggi ti porti tanta fortuna e spazio per festeggiare. Meriti una giornata davvero bella.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Righe personali", "Buon compleanno, {{recipientName}}! Sono felice di averti nella mia vita. Spero che quest'anno ti porti ancora più {{joyWish}} e tante ragioni per sorridere.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Auguri riflessivi", "Buon compleanno, {{recipientName}}! Spero che tu possa trascorrere la giornata con le persone e le cose che ami. Porti tanta {{quality}} nella vita degli altri. Sono molto grato per {{specificDetail}}. Ti auguro un anno di felicità, salute e momenti indimenticabili.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Auguri dal cuore", "Buon compleanno, {{recipientName}}! Volevo mandarti oggi un messaggio sincero perché significi molto per me. Spero che quest'anno ti porti {{goalOrWish}} e tanti momenti di cui andare orgoglioso e che ti rendano felice. Meriti di essere festeggiato. Passa una splendida giornata.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Messaggio lungo di compleanno", "Buon compleanno, {{recipientName}}! Spero che la tua giornata sia piena di risate, calore e tutte quelle piccole cose che ti rendono più felice. Sei una persona così {{quality}}, e conoscerti è un vero regalo. Una delle cose che apprezzo di più in te è {{memory}}. Spero che l'anno che viene ti porti {{hopeOrGoal}}. Meriti persone buone, salute e tanta gioia. Grazie per essere esattamente come sei. Spero che oggi ti senta speciale quanto lo sei per gli altri.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Auguri estesi", "Buon compleanno, {{recipientName}}! Volevo inviare più di una riga breve, perché te lo meriti. Hai un modo di portare {{quality}} nella vita degli altri. Sono particolarmente grato per {{memory}}. Spero che il prossimo anno ti regali {{hopeOrGoal}} e anche riposo, divertimento e cose emozionanti. Che oggi ti senta festeggiato, apprezzato e molto amato. I migliori auguri per il tuo compleanno.", {
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
      option("Scuse dirette", "Mi dispiace, {{recipientName}}, per {{happened}}. Avrei dovuto gestirlo meglio.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Semplice e sincero", "Mi dispiace davvero per {{happened}}. Capisco perché abbia fatto male o sia stato frustrante.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Scuse chiare", "Mi dispiace, {{recipientName}}, per {{happened}}. Sono consapevole che il mio comportamento ti ha colpito e me ne rammarico. Voglio fare meglio in futuro.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Scuse professionali", "Vorrei scusarmi per {{issue}}. Sono consapevole del disagio e mi assumo la responsabilità. Sto lavorando per rimediare.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Scuse sincere", "Ciao {{recipientName}}, voglio scusarmi dal cuore per {{happened}}. Capisco che questo abbia causato {{impact}}, e mi dispiace averti messo in quella situazione. Avrei dovuto agire diversamente. Mi assumo pienamente la mia parte di responsabilità. Se possibile, vorrei rimediare con {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Scuse riflessive", "Ho riflettuto su {{happened}} e voglio dirlo chiaramente: mi dispiace. Non meritavi {{impact}}, e mi dispiace per come ho reagito. Capisco che tu ti senta {{feeling}}. Non cerco scuse. Voglio riconoscerlo con onestà e migliorare.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Scuse estese", "Ciao {{recipientName}}, volevo scusarmi davvero per {{happened}}. Sono consapevole che il mio comportamento ha causato {{impact}}, e me ne rammarico sinceramente. Guardando indietro, avrei dovuto affrontare la situazione con più cura e rispetto. Non meritavi quello stress né quella delusione. Mi assumo la responsabilità. Vorrei rimediare con {{fixStep}}. Se la fiducia ha bisogno di tempo, lo capisco — le mie scuse sono sincere.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Messaggio lungo sincero", "Mi dispiace, {{recipientName}}, per {{happened}}. Ci ho pensato molto e vedo come ti abbia colpito. Mi dispiace di non essere stato più attento, premuroso o onesto in quel momento. Meritavi di più da parte mia. Non voglio sminuire la cosa. Ho sbagliato e mi dispiace. Se sei disponibile, vorrei rimediare con {{fixStep}}. Grazie per aver letto questo messaggio.", {
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
      option("Breve riga d'amore", "Ti amo, {{recipientName}}. Illumini la mia vita in tanti modi.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Semplice riga romantica", "Volevo solo dirti: ti amo e ti apprezzo più di quanto le parole possano esprimere.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Righe romantiche calorose", "Ti amo, {{recipientName}}, e mi sento molto felice di averti nella mia vita. Mi dai tanto {{feeling}}. Spero che tu sappia quanto significi per me.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Dichiarazione dolce", "Con te i giorni ordinari diventano speciali. Ti amo per {{quality}}, e non voglio mai darlo per scontato. Significhi moltissimo per me.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Messaggio d'amore riflessivo", "Ti amo, {{recipientName}}, e volevo esprimerlo bene. Una delle cose che apprezzo di più in te è {{quality}}. Con te mi sento {{feeling}}, e questo significa per me più di quanto riesca a spiegare. Sono grato per come sei nella mia vita. Amarti è una delle cose più belle e naturali che conosco.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Righe tenere", "A volte non lo dico abbastanza, ma ti amo davvero. Mi piace come {{specificDetail}}, e mi piace come ci si sente con te — come {{feeling}}. Rendi la vita più dolce, più divertente e più significativa. Ogni giorno sono grato per te.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Messaggio romantico lungo", "Ti amo, {{recipientName}}, e volevo dirti oggi con più dettaglio quanto. Porti tanto {{feeling}} nella mia vita e non lo do per scontato. Una delle cose che apprezzo di più in te è {{specificDetail}}. Con te la mia vita è cambiata in tanti modi silenziosi ma importanti. Mi piace come {{quality}}. Mi sento profondamente grato di amarti e condividere la vita con te. Grazie per essere te stesso. Ti amo più di quanto possa entrare in un messaggio.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Lunghe righe dal cuore", "Significhi tanto per me, {{recipientName}}. Ti amo per chi sei, per come mi fai sentire e per come porti {{feeling}} nella mia vita. Penso spesso a {{memory}}, e mi ricorda quanto sono felice di averti. Anche i giorni difficili si alleggeriscono con te. Ammiro {{quality}} e apprezzo {{specificDetail}}. Spero che tu sappia sempre quanto profondamente sei amato. Sono così grato per te.", {
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
      option("Congratulazioni classiche", "Congratulazioni, {{recipientName}}, per {{achievement}}! Sono notizie meravigliose.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Riga orgogliosa", "Grandi congratulazioni per {{achievement}}. Ci hai lavorato duramente e si vede.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Congratulazioni calorose", "Congratulazioni, {{recipientName}}, per {{achievement}}! Sono felicissimo per te. Ti meriti davvero questo momento.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Congratulazioni professionali", "Congratulazioni per {{achievement}}. Il tuo impegno e la tua dedizione hanno dato i loro frutti. Ti auguro molto successo nel prossimo passo.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Congratulazioni riflessive", "Congratulazioni, {{recipientName}}, per {{achievement}}! Sono notizie emozionanti e molto meritate. So quanto lavoro, tempo e impegno ci sono dietro. Puoi essere incredibilmente orgoglioso. Sono molto felice per te e sono curioso di vedere cosa verrà.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Congratulazioni di supporto", "Volevo congratularmi dal cuore per {{achievement}}. Ci hai lavorato per {{timeframe}}, ed è bello vedere che l'impegno venga riconosciuto. Te lo meriti. Prenditi un momento per festeggiare. Ti auguro ancora più successi.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Congratulazioni lunghe", "Congratulazioni, {{recipientName}}, per {{achievement}}! La notizia mi ha fatto molta gioia. Ci hai lavorato duramente ed è bello vedere come l'impegno dia frutti così significativi. Una delle cose che apprezzo in particolare è {{quality}}. Puoi essere molto orgoglioso di ciò che hai raggiunto. Spero che ti prenda del tempo per goderti questo momento e festeggiarlo davvero. Te lo meriti. Ti auguro ancora più successo e felicità nel prossimo capitolo.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Lunghe righe di orgoglio", "Grandi congratulazioni per {{achievement}}, {{recipientName}}. È una tappa meravigliosa e so che non è caduta dal cielo. La tua {{quality}} si vede davvero. Non dubito che tu l'abbia ottenuto con molto impegno. È bello vederti arrivare a questo punto. Spero che tu prenda un momento per apprezzare quanto lontano sei arrivato. Puoi essere orgoglioso. Io di certo lo sono per te.", {
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
      option("Addio classico", "È stato meraviglioso lavorare con tutti voi. Grazie per tutto — vi auguro il meglio.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Addio caloroso", "Grazie per il supporto e i bei ricordi. Vi auguro tutto il meglio.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Addio caloroso", "Mentre inizio un nuovo capitolo, grazie per {{specificDetail}}. Lavorare con voi ha significato molto per me. Vi auguro tutto il meglio.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Addio professionale", "Grazie per l'opportunità di lavorare in un team così straordinario. Ho imparato molto e apprezzo il vostro supporto. Buona fortuna.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Addio riflessivo", "Mentre me ne vado, voglio ringraziare {{groupName}}. Questo periodo ha significato molto per me e sono grato per {{specificDetail}}. Ho apprezzato davvero far parte di questo team. Mi mancherà {{memory}}. Vi auguro molto successo e il meglio.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Addio grato", "Dire addio non è facile, ma voglio ringraziare {{groupName}} per tutto. Ho imparato molto qui e apprezzo in particolare {{specificDetail}}. Lavorare con voi è stato significativo e indimenticabile. Porto molto con me. Vi auguro tutto il meglio.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Addio lungo", "Prima di andare avanti, voglio ringraziare davvero {{groupName}}. Questo capitolo ha significato moltissimo per me e sono sinceramente grato per {{specificDetail}}. Ho imparato molto al vostro fianco. Ricorderò in particolare {{memory}}. Grazie per aver reso questo periodo così significativo e indimenticabile. Mi mancheranno le persone e i momenti. Vi auguro molto successo, felicità e il meglio.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Addio lungo di squadra", "Prima di andarmene, volevo dire quanto ho apprezzato far parte di {{groupName}}. Grazie per il supporto, la generosità e l'incoraggiamento. Questa esperienza mi ha dato molto a livello personale e professionale. Sono particolarmente grato per {{specificDetail}}. Anche se quello che viene entusiasma, mi mancheranno questo team e i legami creati. Spero che restiamo in contatto. Vi auguro molto successo e felicità.", {
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
      option("Invito classico", "Sei invitato/a a {{eventName}} il {{date}} presso {{place}}. Mi farebbe molto piacere se potessi venire.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Invito informale", "Ci vediamo a {{eventName}} il {{dayOrTime}}, e mi piacerebbe che ci fossi.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Invito caloroso", "Ti invito volentieri a {{eventName}} il {{date}} presso {{place}}. Inizia alle {{time}} — significherebbe molto per me se potessi venire. Fammi sapere quando puoi.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Invito amichevole", "Ciao {{recipientName}}, ti invito a {{eventName}} il {{dayOrTime}} presso {{place}}. Mi piacerebbe festeggiare con te. Spero che tu possa.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Invito riflessivo", "Ciao {{recipientName}}, vorrei invitarti a {{eventName}} il {{date}} presso {{place}}. Iniziamo verso le {{time}}, e significherebbe molto per me che tu ci sia. È un'occasione per {{occasion}}. Dimmi, per favore, se puoi venire. Mi piacerebbe festeggiare insieme.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Invito dettagliato", "Sei cordialmente invitato/a a {{eventName}} il {{date}} presso {{place}}. Iniziamo alle {{time}} e ci farebbe molto piacere averti. Sarà un bel momento con {{eventDetail}}. Confermami entro il {{rsvpDate}}, per favore. Spero che tu possa venire.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Invito lungo", "Ciao {{recipientName}}, volevo inviarti un invito sincero a {{eventName}}. Ci incontriamo il {{date}} presso {{place}}, con inizio verso le {{time}}. Significherebbe molto per me che tu ci sia e che festeggiamo insieme. È previsto {{eventDetail}} — penso che sarà qualcosa di speciale. Fammi sapere entro il {{rsvpDate}} se ti va bene. Mi farebbe molto piacere vederti.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Invito caloroso esteso", "Ti invito con molto piacere a {{eventName}} il {{date}} presso {{place}}. Questa occasione mi sta a cuore, e con te sarebbe ancora più speciale. Iniziamo alle {{time}}, ed è previsto {{eventDetail}}. Ci sarà tempo per rilassarsi, festeggiare e divertirsi. Confermami entro il {{rsvpDate}}, per favore. Spero davvero che tu possa venire — senza di te non sarebbe lo stesso.", {
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
      option("Condoglianze delicate", "Mi dispiace moltissimo per la tua perdita, {{recipientName}}. Penso a te e alla tua famiglia.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Supporto discreto", "Il mio cuore è con te in questo momento così difficile. Mi dispiace moltissimo per quello che stai passando.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Condoglianze semplici", "Mi dispiace moltissimo per la tua perdita, {{recipientName}}. Penso a te e ti mando affetto. Spero che tu senta supporto nei prossimi giorni.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Supporto gentile", "Mi ha addolorato molto sapere di {{loss}}. Penso a te e alla tua famiglia. Ti auguro forza e conforto in questo momento così difficile.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Condoglianze calorose", "Mi ha profondamente commosso sapere di {{loss}}. Le porgo le mie più sentite condoglianze. Posso solo immaginare quanto sia difficile questo momento per te e la tua famiglia. Spero che tu sia circondato da amore e supporto. Penso a te e ti auguro forza.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Righe dal cuore", "Mi dispiace moltissimo per la tua perdita, {{recipientName}}. Non ci sono parole perfette per un momento così, ma volevo dirti che penso a te. {{personName}} resterà nel ricordo per {{tribute}}. Non sei solo/a. Ti mando affetto e condoglianze.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Condoglianze lunghe", "Mi ha addolorato molto sapere di {{loss}}, {{recipientName}}. Fatico a immaginare cosa tu stia provando in questo momento, ma volevo dirti che penso a te. Le porgo le mie più sentite condoglianze. {{personName}} resterà nel ricordo per {{tribute}}. Spero che tu sia circondato da persone che ti sostengono. Se posso fare qualcosa, anche piccola, dimmelo. Ti mando affetto, forza e conforto.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Lunghe righe delicate", "La tua perdita mi addolora profondamente. So che le parole possono sembrare piccole in momenti così, ma volevo dirti che penso a te e alla tua famiglia. {{personName}} ha significato tanto e resterà nel ricordo con amore. Spero che tu trovi conforto in chi ti circonda e nei ricordi. Abbi cura di te. Le mie più sentite condoglianze e il mio supporto.", {
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
      option("Promemoria breve", "Solo un rapido promemoria per {{task}} il {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Promemoria cortese", "Promemoria gentile: {{task}} entro il {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Promemoria cortese", "Ciao {{recipientName}}, breve promemoria su {{task}}. La scadenza è il {{dayOrTime}}. Fammi sapere se hai bisogno di qualcosa da parte mia.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Promemoria professionale", "Promemoria gentile su {{task}}. Invialo entro il {{deadline}}, se possibile. Grazie.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Promemoria riflessivo", "Ciao {{recipientName}}, volevo ricordarti brevemente {{task}}. La scadenza è il {{dayOrTime}} — volevo solo assicurarmi che sia nel tuo radar. Se hai bisogno di supporto, dimmelo. Grazie per occupartene.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Promemoria chiaro", "Ciao {{recipientName}}, un promemoria gentile su {{task}}. Ci aspettiamo di chiudere entro il {{deadline}}. So che gli impegni sono tanti — ecco questa breve nota. Se hai domande, scrivimi. Grazie.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Promemoria lungo", "Ciao {{recipientName}}, volevo ricordarti gentilmente {{task}}. La scadenza è il {{dayOrTime}}, per questo ti scrivo in anticipo. So che hai molto da fare — questo è solo un piccolo promemoria utile. Se posso facilitare qualcosa, dimmelo. Grazie per il tuo aiuto e il tuo tempo.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Promemoria lungo professionale", "Buongiorno {{recipientName}}, spero che stia bene. Breve promemoria su {{task}}. Cerchiamo di chiudere entro il {{deadline}}, per questo mi anticipo. Se ci sono problemi, ritardi o domande, mi avvisi — la aiuto per quanto posso. La ringrazio per la sua attenzione.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
