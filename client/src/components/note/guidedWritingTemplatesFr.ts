import {
  guidedWritingOption as option,
  type GuidedWritingTemplateRecord,
} from "./localFallbackShared";

export const GUIDED_WRITING_TEMPLATES_FR: GuidedWritingTemplateRecord = {
  "ask-anything": {
    "1-2": [
      option("Ligne chaleureuse", "Salut {{recipientName}}, je voulais juste te dire : {{mainMessage}}. J'espère que tout va bien pour toi.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Message court", "Salut {{recipientName}}, je te contacte au sujet de {{topic}}. Dis-moi simplement ce qui t'arrange.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Ouverture chaleureuse", "Salut {{recipientName}}, je voulais te reparler de {{topic}} depuis un moment. Je voudrais dire : {{mainMessage}} — parce que {{reason}}. Je te souhaite une bonne fin de semaine.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Relance claire", "Salut {{recipientName}}, je voulais faire un suivi au sujet de {{topic}}. Ce qui compte le plus pour moi : {{mainMessage}}. Dis-moi si tu veux en parler davantage.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Brouillon réfléchi", "Salut {{recipientName}}, je voulais t'écrire brièvement au sujet de {{topic}}. J'ai pensé à {{relevantDetail}}, et il me semblait utile de te contacter. L'essentiel : {{mainMessage}}. J'apprécie tout particulièrement {{specificDetail}}. Réponds-moi quand tu as un moment.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Brouillon équilibré", "Salut {{recipientName}}, j'espère que tout va bien pour toi. Je t'écris au sujet de {{topic}}, parce que {{reason}}. Je voulais te dire : {{mainMessage}}. Et aussi : {{extraDetail}}. Réponds quand tu peux, avec plaisir.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Lettre personnelle", "Salut {{recipientName}}, j'espère que tout va bien pour toi. Je voulais t'écrire au sujet de {{topic}}, parce que ça me tient à cœur. Ces derniers {{timeframe}}, j'ai beaucoup pensé à {{relevantDetail}}. Ce qui compte le plus pour moi : {{mainMessage}}. En plus : {{extraDetail}}, parce que c'est important pour moi. J'apprécie énormément {{specificDetail}}. Aucune pression pour répondre — je voulais simplement le dire clairement et avec honnêteté.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Note détaillée", "Salut {{recipientName}}, je voulais t'envoyer un message un peu plus long au sujet de {{topic}}. D'abord : {{mainMessage}}. Pourquoi c'est important pour moi : {{reason}}. Et aussi : {{extraDetail}}. Si ça te convient, on pourrait {{nextStep}}. Si ce n'est pas le bon moment, ce n'est absolument pas grave. Je voulais juste être clair, aimable et sincère.", {
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
      option("Remerciement classique", "Merci, {{recipientName}}, pour {{supportType}}. Ça a vraiment compté pour moi.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Remerciement formel", "Merci pour {{specificDetail}}, {{recipientName}}. J'apprécie énormément votre soutien.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Merci du fond du cœur", "Merci infiniment, {{recipientName}}, pour {{actionTaken}}. Votre aide m'a beaucoup aidé(e) pour {{result}}. Je ne saurais dire à quel point je vous en suis reconnaissant(e).", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Lignes bienveillantes", "Bonjour {{recipientName}}, merci pour {{supportType}}. C'était attentionné et généreux, et cela a vraiment compté pour moi. Je vous en suis très reconnaissant(e).", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Remerciement développé", "Salut {{recipientName}}, je voulais te remercier comme il faut pour {{actionTaken}}. C'était incroyablement gentil et ça m'a aidé(e) plus que tu ne le penses peut-être. J'ai particulièrement apprécié {{specificDetail}}. Ta bienveillance a rendu une période stressante plus supportable. Encore merci pour ta générosité et ton soutien.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Lettre de gratitude", "Merci, {{recipientName}}, pour {{supportType}}. Je voulais te le dire depuis longtemps : ça a compté énormément, parce que {{reason}}. Je n'ai pas manqué ton attention. Je me sens chanceux(se) d'avoir ton soutien.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Grand merci", "Salut {{recipientName}}, je voulais t'adresser un vrai merci pour {{actionTaken}}. Je sais qu'il y a du temps, des efforts et du soin derrière, et je ne le prends pas à la légère. Ce qui m'a le plus touché(e), c'est {{specificDetail}}. Ça m'a aidé(e) dans {{resultOrSituation}} et ça a rendu les choses nettement plus légères pour moi. Ta gentillesse est arrivée au bon moment. Je te suis sincèrement reconnaissant(e). Merci d'avoir été là pour moi.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Profonde reconnaissance", "Chère {{recipientName}}, merci sincèrement pour {{supportType}}. J'ai souvent repensé à tout ce que cela représentait pour moi. Ce n'était pas seulement généreux, c'était aussi très attentionné. J'ai particulièrement apprécié {{specificDetail}}. Grâce à vous, {{positiveResult}}. Sachez combien je vous en suis reconnaissant(e). Votre soutien a laissé une empreinte durable.", {
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
      option("Demande courte", "Salut {{recipientName}}, est-ce qu'on peut prévoir un rendez-vous au sujet de {{topic}} le {{dayOrTime}} ?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Demande professionnelle", "Bonjour {{recipientName}}, j'aimerais planifier un court entretien au sujet de {{topic}}. Merci de m'indiquer ce qui vous convient.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Demande claire", "Bonjour {{recipientName}}, j'aimerais convenir d'un rendez-vous au sujet de {{topic}}. Est-ce que {{dayOrTime}} vous conviendrait ? Sinon, nous trouverons un autre créneau.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Relance", "Bonjour {{recipientName}}, je vous contacte pour organiser un appel au sujet de {{topic}}. Je suis disponible le {{dayOrTime}}. Quel créneau vous conviendrait le mieux ?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Demande détaillée", "Bonjour {{recipientName}}, je souhaitais proposer des créneaux pour un rendez-vous au sujet de {{topic}}. Je pense qu'il serait utile d'aborder {{specificDetail}}. Je suis disponible le {{dayOrTime}}, mais je peux m'adapter si besoin. Merci de me dire quel horaire vous convient.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Demande formelle", "Bonjour {{recipientName}}, j'aimerais convenir d'un entretien au sujet de {{topic}}. Un bref échange aiderait à clarifier {{specificDetail}}. Je suis disponible le {{dayOrTime}}, ou bien le {{alternateTime}}. Merci de m'indiquer la date qui vous convient le mieux.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Briefing détaillé", "Bonjour {{recipientName}}, j'espère que tout va bien pour vous. Pourrions-nous planifier un rendez-vous au sujet de {{topic}} ? Je trouverais utile que nous discutions ensemble de {{specificDetail}} et que nous alignions les prochaines étapes. Je suis disponible le {{dayOrTime}}, et {{alternateTime}} pourrait aussi convenir. Si un autre jour vous arrange mieux, je peux m'adapter. Merci de me dire ce qui vous convient le mieux. J'apprécie votre temps et j'aimerais préparer l'échange avec soin.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Briefing formel", "Bonjour {{recipientName}}, je vous prie de bien vouloir m'accorder un rendez-vous au sujet de {{topic}}. Il y a plusieurs points que j'aimerais aborder, notamment {{specificDetail}}. Un court échange permettrait d'avancer plus efficacement. Je suis disponible le {{dayOrTime}}, mais je reste flexible. Si vous le souhaitez, nous pouvons aussi échanger par {{extraDetail}}. Merci de m'indiquer ce qui vous convient le mieux.", {
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
      option("Vœux classiques", "Joyeux anniversaire, {{recipientName}} ! J'espère que ta journée sera pleine de joie et de beaux moments.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Ligne enjouée", "Joyeux anniversaire, {{recipientName}} ! Je te souhaite une merveilleuse année.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Vœux chaleureux", "Joyeux anniversaire, {{recipientName}} ! J'espère qu'aujourd'hui t'apporte beaucoup de chance et l'occasion de fêter ça comme il se doit. Tu mérites une journée vraiment réussie.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Lignes personnelles", "Joyeux anniversaire, {{recipientName}} ! Je suis heureux(se) de t'avoir dans ma vie. J'espère que cette année t'apportera encore plus de {{joyWish}} et plein de raisons de sourire.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Vœux réfléchis", "Joyeux anniversaire, {{recipientName}} ! J'espère que tu pourras passer cette journée avec les gens et les choses que tu aimes. Tu apportes tellement de {{quality}} dans la vie des autres. Je suis vraiment reconnaissant(e) pour {{specificDetail}}. Je te souhaite une année pleine de bonheur, de santé et de moments inoubliables.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Vœux du cœur", "Joyeux anniversaire, {{recipientName}} ! Je voulais t'écrire un vrai message aujourd'hui parce que tu comptes énormément pour moi. J'espère que cette année t'apportera {{goalOrWish}} et plein de moments dont tu es fier/fière et qui te rendent heureux/heureuse. Tu mérites qu'on te fête. Passe une super journée.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Long message d'anniversaire", "Joyeux anniversaire, {{recipientName}} ! J'espère que ta journée est pleine de rires, de chaleur et de toutes ces petites choses qui te rendent le plus heureux/heureuse. Tu es une personne tellement {{quality}}, et te connaître est un vrai cadeau. Ce que j'apprécie peut-être le plus chez toi, c'est {{memory}}. J'espère que l'année à venir t'apportera {{hopeOrGoal}}. Tu mérites d'avoir de belles personnes autour de toi, la santé et beaucoup de joie. Merci d'être exactement comme tu es. J'espère qu'aujourd'hui te semblera aussi spécial que tu l'es pour les autres.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Vœux développés", "Joyeux anniversaire, {{recipientName}} ! Je voulais envoyer plus qu'une courte ligne, parce que tu le mérites. Tu as une façon d'apporter {{quality}} dans la vie des autres. Je suis particulièrement reconnaissant(e) pour {{memory}}. J'espère que l'année prochaine t'offrira {{hopeOrGoal}}, ainsi que du repos, du plaisir et de l'excitation. Puisses-tu te sentir fêté(e), apprécié(e) et profondément aimé(e) aujourd'hui. Mes meilleurs vœux pour ton anniversaire.", {
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
      option("Excuses directes", "Je suis désolé(e), {{recipientName}}, pour {{happened}}. J'aurais dû mieux gérer la situation.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Simple et sincère", "Je suis vraiment désolé(e) pour {{happened}}. Je comprends pourquoi ça a fait mal ou a été frustrant.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Excuses claires", "Je suis désolé(e), {{recipientName}}, pour {{happened}}. Je prends conscience que mon comportement t'a affecté(e), et je le regrette. Je veux faire mieux à l'avenir.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Excuses professionnelles", "Je souhaite m'excuser pour {{issue}}. Je suis conscient(e) du désagrément causé, et j'en assume la responsabilité. Je fais le nécessaire pour réparer les choses.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Excuses sincères", "Salut {{recipientName}}, je veux présenter mes excuses de tout cœur pour {{happened}}. Je comprends que cela a {{impact}}, et je suis désolé(e) de t'avoir mis dans cette situation. J'aurais dû agir autrement. J'assume pleinement ma part de responsabilité. Si possible, j'aimerais réparer les choses avec {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Excuses réfléchies", "J'ai réfléchi à {{happened}} et je veux le dire clairement : je suis désolé(e). Tu ne méritais pas {{impact}}, et je regrette ma réaction. Je comprends que tu te sentes {{feeling}}. Je ne cherche pas d'excuses. Je veux le reconnaître honnêtement et m'améliorer.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Excuses développées", "Salut {{recipientName}}, je voulais vraiment m'excuser pour {{happened}}. Je prends conscience que mon comportement a causé {{impact}}, et j'en suis sincèrement désolé(e). Avec du recul, j'aurais dû gérer la situation avec plus de soin et de respect. Tu ne méritais pas ce stress ni cette déception. J'en assume la responsabilité. J'aimerais réparer les choses avec {{fixStep}}. Si la confiance a besoin de temps, je comprends — mes excuses sont sincères.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Long message sincère", "Je suis désolé(e), {{recipientName}}, pour {{happened}}. J'y ai beaucoup pensé et je vois à quel point ça t'a touché(e). Je regrette de ne pas avoir été plus prudent(e), plus attentif(ve) ou plus honnête dans ce moment-là. Tu méritais mieux de ma part. Je ne veux pas minimiser. J'avais tort, et je suis désolé(e). Si tu es ouvert(e), j'aimerais réparer avec {{fixStep}}. Merci de prendre le temps de lire ceci.", {
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
      option("Courte déclaration", "Je t'aime, {{recipientName}}. Tu illumines ma vie de tant de façons.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Ligne romantique simple", "Je voulais juste dire : je t'aime et je t'apprécie plus que les mots ne peuvent l'exprimer.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Lignes romantiques chaleureuses", "Je t'aime, {{recipientName}}, et je me sens chanceux(se) de t'avoir dans ma vie. Tu m'apportes tant de {{feeling}}. J'espère que tu sais combien tu comptes pour moi.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Douce déclaration", "Avec toi, les journées ordinaires deviennent spéciales. Je t'aime pour {{quality}}, et je ne veux jamais le prendre pour acquis. Tu comptes énormément pour moi.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Message d'amour réfléchi", "Je t'aime, {{recipientName}}, et je voulais le formuler comme il faut. Ce que j'apprécie peut-être le plus chez toi, c'est {{quality}}. Avec toi, je me sens {{feeling}}, et ça compte pour moi plus que je ne peux l'expliquer. Je suis reconnaissant(e) de la façon dont tu es présent(e) dans ma vie. T'aimer fait partie des choses les plus belles et les plus naturelles que je connaisse.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Lignes tendres", "Parfois je ne le dis pas assez souvent, mais je t'aime de tout mon cœur. J'aime comment tu {{specificDetail}}, et j'aime ce que je ressens quand je suis avec toi — comme {{feeling}}. Tu rends la vie plus douce, plus drôle et plus significative. Je suis reconnaissant(e) pour toi chaque jour.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Long message romantique", "Je t'aime, {{recipientName}}, et je voulais te dire aujourd'hui plus en détail à quel point. Tu apportes tant de {{feeling}} dans ma vie, et je ne le prends pas pour acquis. Ce que j'apprécie peut-être le plus chez toi, c'est {{specificDetail}}. Avec toi, ma vie a changé à bien des égards discrets mais importants. J'aime comment tu {{quality}}. Je me sens incroyablement chanceux(se) de t'aimer et de partager la vie avec toi. Merci d'être toi-même. Je t'aime plus que ne peut contenir un message.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Long message du cœur", "Tu comptes tellement pour moi, {{recipientName}}. Je t'aime pour qui tu es, pour ce que tu me fais ressentir et pour la façon dont tu apportes {{feeling}} dans ma vie. Je pense souvent à {{memory}}, et ça me rappelle à quel point je suis heureux(se) de t'avoir. Tu rends même les journées difficiles plus légères. J'admire {{quality}} et j'apprécie {{specificDetail}}. J'espère que tu sauras toujours à quel point tu es aimé(e). Je suis si reconnaissant(e) pour toi.", {
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
      option("Félicitations classiques", "Toutes mes félicitations, {{recipientName}}, pour {{achievement}} ! Ce sont des nouvelles merveilleuses.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Ligne fière", "Énormes félicitations pour {{achievement}}. Tu as travaillé dur pour ça, et ça se voit.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Félicitations chaleureuses", "Toutes mes félicitations, {{recipientName}}, pour {{achievement}} ! Je suis tellement heureux(se) pour toi. Tu mérites vraiment ce moment.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Félicitations professionnelles", "Félicitations pour {{achievement}}. Ton travail acharné et ton engagement ont porté leurs fruits. Je te souhaite encore beaucoup de succès pour la suite.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Félicitations réfléchies", "Toutes mes félicitations, {{recipientName}}, pour {{achievement}}. Ce sont des nouvelles passionnantes et vraiment méritées. Je sais combien de travail, de temps et d'efforts il y a derrière. Tu peux être incroyablement fier/fière de toi. Je suis très heureux(se) pour toi et j'ai hâte de voir la suite.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Félicitations encourageantes", "Je voulais te féliciter chaleureusement pour {{achievement}}. Tu y as consacré {{timeframe}}, et c'est beau de voir que l'effort soit reconnu. Tu l'as mérité. Accorde-toi un moment pour fêter ça. Je te souhaite encore plus de succès.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Long message de félicitations", "Toutes mes félicitations, {{recipientName}}, pour {{achievement}}. La nouvelle m'a vraiment fait plaisir. Tu as travaillé dur pour ça, et c'est beau de voir à quel point l'effort porte des fruits si significatifs. Ce que j'apprécie particulièrement, c'est {{quality}}. Tu peux être très fier/fière de ce que tu as accompli. J'espère que tu prendras le temps de savourer ce moment et de vraiment le fêter. Tu l'as mérité. Je te souhaite encore plus de succès et de bonheur pour la suite.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Long message fier", "Énormes félicitations pour {{achievement}}, {{recipientName}}. C'est une étape formidable, et je sais qu'elle ne tombe pas du ciel. Ta {{quality}} est vraiment mise en valeur. Je ne doute pas que tu l'aies obtenue avec beaucoup d'investissement. C'est beau de te voir arriver à ce point. J'espère que tu prendras un instant pour apprécier le chemin parcouru. Tu peux être fier/fière. Moi, je le suis à coup sûr pour toi.", {
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
      option("Adieu classique", "Ce fut merveilleux de travailler avec vous tous. Merci pour tout — je vous souhaite le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Adieu du cœur", "Merci pour le soutien et les beaux souvenirs. Je vous souhaite tout le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Adieu chaleureux", "Alors que je commence un nouveau chapitre, merci pour {{specificDetail}}. Travailler avec vous a compté énormément pour moi. Je vous souhaite tout le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Adieu professionnel", "Merci pour l'opportunité de travailler dans une équipe aussi formidable. J'ai beaucoup appris et j'apprécie votre soutien. Bonne continuation.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Adieu réfléchi", "Alors que je pars, je veux remercier {{groupName}}. Cette période a compté énormément pour moi, et je suis reconnaissant(e) pour {{specificDetail}}. J'ai vraiment apprécié faire partie de cette équipe. Je vais manquer {{memory}}. Je vous souhaite encore beaucoup de succès et tout le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Adieu reconnaissant", "Dire au revoir n'est pas facile, mais je veux remercier {{groupName}} pour tout. J'ai beaucoup appris ici, et j'apprécie particulièrement {{specificDetail}}. Travailler avec vous a été important et inoubliable. J'emporte beaucoup de choses avec moi. Je vous souhaite tout le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Long message d'adieu", "Avant de poursuivre mon chemin, je veux vraiment remercier {{groupName}}. Ce chapitre a compté énormément pour moi, et je suis sincèrement reconnaissant(e) pour {{specificDetail}}. J'ai beaucoup appris à vos côtés. Je garderai surtout en mémoire {{memory}}. Merci d'avoir rendu cette période si importante et inoubliable. Je vais manquer les gens et les moments. Je vous souhaite encore beaucoup de succès, de bonheur et tout le meilleur.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Long adieu d'équipe", "Avant de partir, je voulais dire à quel point j'ai apprécié faire partie de {{groupName}}. Merci pour le soutien, la générosité et les encouragements. Cette expérience m'a apporté beaucoup sur le plan personnel et professionnel. Je suis particulièrement reconnaissant(e) pour {{specificDetail}}. Même si j'ai hâte de la suite, je vais manquer cette équipe et ces liens. J'espère que nous resterons en contact. Je vous souhaite beaucoup de succès et de bonheur.", {
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
      option("Invitation classique", "Tu es invité(e) à {{eventName}} le {{date}} à {{place}}. Je serais très heureux(heureuse) si tu peux venir.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Invitation décontractée", "On se retrouve pour {{eventName}} le {{dayOrTime}}, et je serais content(e) que tu sois des nôtres.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Invitation chaleureuse", "Je t'invite volontiers à {{eventName}} le {{date}} à {{place}}. Le début est à {{time}} — ça signifierait beaucoup pour moi si tu peux venir. Merci de me dire.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Invitation amicale", "Salut {{recipientName}}, je t'invite à {{eventName}} le {{dayOrTime}} à {{place}}. Je serais très heureux(heureuse) de fêter ça avec toi. J'espère que tu pourras être là.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Invitation réfléchie", "Salut {{recipientName}}, je voudrais t'inviter à {{eventName}} le {{date}} à {{place}}. On commence vers {{time}}, et ça signifierait beaucoup pour moi si tu es là. C'est l'occasion de {{occasion}}. Merci de me dire si tu peux venir. J'aimerais beaucoup fêter ça ensemble.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Invitation détaillée", "Tu es chaleureusement invité(e) à {{eventName}} le {{date}} à {{place}}. Nous commençons à {{time}} et serions ravis que tu sois des nôtres. Ce sera un beau moment avec {{eventDetail}}. Merci de me répondre avant le {{rsvpDate}}. J'espère que tu pourras venir.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Longue invitation", "Salut {{recipientName}}, je voulais t'envoyer une vraie invitation à {{eventName}}. On se retrouve le {{date}} à {{place}}, début vers {{time}}. Ça signifierait beaucoup pour moi si tu étais là et qu'on fête l'occasion ensemble. Au programme : {{eventDetail}} — je pense que ce sera quelque chose de spécial. Merci de me dire avant le {{rsvpDate}} si ça te convient. Je serais très heureux(heureuse). À très bientôt j'espère.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Invitation chaleureuse détaillée", "Je t'invite très volontiers à {{eventName}} le {{date}} à {{place}}. Cette occasion compte beaucoup pour moi, et avec toi elle serait encore plus spéciale. Nous commençons à {{time}}, au programme : {{eventDetail}}. Il y aura du temps pour se détendre, fêter et profiter. Merci de me répondre avant le {{rsvpDate}}. J'espère vraiment que tu pourras être là — sans toi, ce ne serait pas pareil.", {
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
      option("Douces condoléances", "Je suis si désolé(e) pour ta perte, {{recipientName}}. Je pense à toi et à ta famille.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Soutien discret", "Mon cœur est avec toi en cette période difficile. Je suis si désolé(e) pour ce que tu traverses.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Condoléances simples", "Je suis si désolé(e) pour ta perte, {{recipientName}}. Je pense à toi et je t'envoie des pensées affectueuses. J'espère que tu sentiras du soutien dans les jours qui viennent.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Soutien doux", "J'ai été très touché(e) d'apprendre {{loss}}. Je pense à toi et à ta famille. Je te souhaite force et réconfort en cette période si difficile.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Condoléances chaleureuses", "J'ai été profondément touché(e) d'apprendre {{loss}}. Accepte mes sincères condoléances. Je peux seulement imaginer combien cette période est difficile pour toi et ta famille. J'espère que tu es entouré(e) d'amour et de soutien. Je pense à toi et je te souhaite du courage.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Lignes du cœur", "Je suis si désolé(e) pour ta perte, {{recipientName}}. Il n'y a pas de mots parfaits pour un moment comme celui-ci, mais je voulais te dire que je pense à toi. {{personName}} restera dans les mémoires pour {{tribute}}. Tu n'es pas seul(e). Je t'envoie affection et condoléances.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Long message de condoléances", "J'ai été très touché(e) d'apprendre {{loss}}, {{recipientName}}. J'ai du mal à imaginer ce que tu ressens en ce moment, mais je voulais te dire que je pense à toi. Accepte mes sincères condoléances. {{personName}} restera dans les mémoires pour {{tribute}}. J'espère que tu es entouré(e) de gens qui te portent. Si je peux faire quelque chose, même petit, dis-le-moi. Je t'envoie affection, courage et réconfort.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Long message doux", "Ta perte me touche profondément. Je sais que les mots peuvent paraître insignifiants dans des moments comme celui-ci, mais je voulais te dire que je pense à toi et à ta famille. {{personName}} a tant compté et restera dans le souvenir avec amour. J'espère que tu trouveras du réconfort auprès des gens autour de toi et dans vos souvenirs. Prends bien soin de toi. Mes sincères condoléances et mon soutien.", {
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
      option("Rappel court", "Juste un petit rappel pour {{task}} le {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Rappel poli", "Rappel amical : {{task}} avant le {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Rappel courtois", "Salut {{recipientName}}, petit rappel pour {{task}}. L'échéance est le {{dayOrTime}}. Dis-moi si tu as besoin de quelque chose de ma part.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Rappel professionnel", "Rappel amical pour {{task}}. Merci de l'envoyer avant le {{deadline}}, si possible. Merci.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Rappel réfléchi", "Salut {{recipientName}}, je voulais te rappeler brièvement {{task}}. L'échéance est le {{dayOrTime}} — je voulais m'assurer que c'est bien sur tes radars. Si tu as besoin de soutien, dis-le-moi. Merci de t'en occuper.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Rappel clair", "Bonjour {{recipientName}}, petit rappel pour {{task}}. Nous espérons finaliser avant le {{deadline}}. Je sais que les agendas sont chargés — d'où cette courte note. En cas de question, n'hésitez pas. Merci.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Long rappel", "Salut {{recipientName}}, je voulais te rappeler avec bienveillance {{task}}. L'échéance est le {{dayOrTime}}, d'où ce petit message avant. Je sais que tu as beaucoup à faire — ce n'est qu'un coup de pouce utile. Si je peux faciliter les choses, dis-le-moi. Merci pour ton aide et ton temps.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Long rappel professionnel", "Bonjour {{recipientName}}, j'espère que tout va bien pour vous. Petit rappel pour {{task}}, avec le {{deadline}} comme échéance. En cas de problème, de retard ou de question, n'hésitez pas à me prévenir — je vous aiderai dans la mesure du possible. Merci pour votre attention.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
