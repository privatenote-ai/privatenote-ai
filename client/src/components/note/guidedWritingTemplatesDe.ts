import {
  guidedWritingOption as option,
  type GuidedWritingTemplateSet,
  type LocalFallbackTemplateId,
} from "./localFallbackShared";

export const GUIDED_WRITING_TEMPLATES_DE: Record<LocalFallbackTemplateId, GuidedWritingTemplateSet> = {
  "ask-anything": {
    "1-2": [
      option("Herzliche Zeile", "Hi {{recipientName}}, ich wollte nur kurz sagen: {{mainMessage}}. Ich hoffe, es geht dir gut.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Kurze Nachricht", "Hi {{recipientName}}, ich melde mich wegen {{topic}}. Sag mir einfach, was bei dir passt.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Warme Entwurfszeilen", "Hi {{recipientName}}, ich wollte mich schon länger zu {{topic}} melden. Ich möchte sagen: {{mainMessage}} — und zwar weil {{reason}}. Ich wünsche dir eine gute restliche Woche.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Klares Follow-up", "Hi {{recipientName}}, ich wollte bei {{topic}} nachfassen. Am wichtigsten ist mir: {{mainMessage}}. Sag Bescheid, wenn du mehr dazu sprechen möchtest.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Durchdachter Entwurf", "Hi {{recipientName}}, ich wollte dir kurz zu {{topic}} schreiben. Ich habe an {{relevantDetail}} gedacht und fand, eine Nachricht lohnt sich. Am wichtigsten: {{mainMessage}}. Ich schätze besonders {{specificDetail}}. Melde dich, wenn du Zeit hast.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Ausgewogener Entwurf", "Hi {{recipientName}}, ich hoffe, dir geht es gut. Ich schreibe wegen {{topic}}, weil {{reason}}. Ich wollte dir sagen: {{mainMessage}}. Außerdem: {{extraDetail}}. Antworte gern, wenn es dir passt.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Persönlicher Brief", "Hi {{recipientName}}, ich hoffe, es geht dir gut. Ich wollte dir zu {{topic}} schreiben, weil es mich beschäftigt. In den letzten {{timeframe}} habe ich viel an {{relevantDetail}} gedacht. Am wichtigsten ist mir: {{mainMessage}}. Zusätzlich: {{extraDetail}}, weil es mir wichtig ist. Ich schätze {{specificDetail}} sehr. Kein Druck mit der Antwort — ich wollte das einfach klar und ehrlich sagen.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Ausführliche Notiz", "Hi {{recipientName}}, ich wollte eine etwas längere Nachricht zu {{topic}} schicken. Zuerst: {{mainMessage}}. Warum mir das wichtig ist: {{reason}}. Außerdem: {{extraDetail}}. Wenn es passt, könnten wir {{nextStep}}. Wenn jetzt ein schlechter Zeitpunkt ist, ist das völlig okay. Ich wollte nur klar, freundlich und ehrlich sein.", {
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
      option("Klassischer Dank", "Danke, {{recipientName}}, für {{supportType}}. Das hat mir wirklich viel bedeutet.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Formeller Dank", "Danke für {{specificDetail}}, {{recipientName}}. Ich weiß deine Unterstützung sehr zu schätzen.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Herzlicher Dank", "Vielen Dank, {{recipientName}}, für {{actionTaken}}. Deine Unterstützung hat mir bei {{result}} sehr geholfen. Ich kann gar nicht sagen, wie dankbar ich bin.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Freundliche Zeilen", "Hi {{recipientName}}, danke für {{supportType}}. Das war aufmerksam und großzügig und hat einen echten Unterschied gemacht. Ich bin dir sehr dankbar.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Ausführlicher Dank", "Hi {{recipientName}}, ich wollte mich richtig bei dir für {{actionTaken}} bedanken. Das war unglaublich lieb von dir und hat mir mehr geholfen, als du vielleicht merkst. Besonders geschätzt habe ich {{specificDetail}}. Deine Freundlichkeit hat eine stressige Zeit erleichtert. Nochmals vielen Dank für deine Großzügigkeit und Unterstützung.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Dankesbrief", "Danke, {{recipientName}}, für {{supportType}}. Ich wollte dir schon lange sagen, wie sehr ich das geschätzt habe. Es hat viel bedeutet, weil {{reason}}. Deine Aufmerksamkeit ist mir nicht entgangen. Ich fühle mich glücklich, deine Unterstützung zu haben.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Langer Dank", "Hi {{recipientName}}, ich wollte dir einen richtigen Dank für {{actionTaken}} schicken. Ich weiß, dass Zeit, Mühe und Sorgfalt dahinterstecken, und ich nehme das nicht leicht. Am meisten bedeutete mir {{specificDetail}}. Es hat bei {{resultOrSituation}} geholfen und die Dinge für mich spürbar leichter gemacht. Deine Freundlichkeit kam genau zur richtigen Zeit. Ich bin dir aufrichtig dankbar. Danke, dass du für mich da warst.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Tiefe Wertschätzung", "Liebe/r {{recipientName}}, herzlichen Dank für {{supportType}}. Ich habe oft darüber nachgedacht, wie viel mir das bedeutet hat. Es war nicht nur großzügig, sondern auch sehr durchdacht. Besonders geschätzt habe ich {{specificDetail}}. Durch dich ist {{positiveResult}}. Bitte wisse, wie dankbar ich bin. Deine Unterstützung hat einen bleibenden Eindruck hinterlassen.", {
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
      option("Kurze Anfrage", "Hi {{recipientName}}, könnten wir ein Treffen zu {{topic}} am {{dayOrTime}} vereinbaren?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Geschäftliche Anfrage", "Hi {{recipientName}}, ich möchte gern ein kurzes Meeting zu {{topic}} planen. Bitte sag mir, wann es dir passt.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Klare Anfrage", "Hi {{recipientName}}, ich möchte gern ein Meeting zu {{topic}} vereinbaren. Würde {{dayOrTime}} für dich passen? Wenn nicht, finden wir einen anderen Termin.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Follow-up", "Hi {{recipientName}}, ich melde mich, um einen Call zu {{topic}} abzustimmen. Am {{dayOrTime}} könnte ich. Was passt dir am besten?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Ausführliche Anfrage", "Hi {{recipientName}}, ich wollte ein Meeting zu {{topic}} vorschlagen. Ich denke, es wäre hilfreich, {{specificDetail}} durchzusprechen. Aktuell könnte ich am {{dayOrTime}}, kann mich aber gern anpassen. Sag mir bitte, welche Zeit für dich passt.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Formelle Anfrage", "Guten Tag {{recipientName}}, ich würde gern ein Treffen zu {{topic}} vereinbaren. Ein kurzes Gespräch würde helfen, {{specificDetail}} zu klären. Ich bin am {{dayOrTime}} verfügbar, alternativ auch am {{alternateTime}}. Bitte nennen Sie mir Ihren Wunschtermin. Vielen Dank im Voraus.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Ausführliches Briefing", "Hi {{recipientName}}, ich hoffe, es geht dir gut. Könnten wir ein Meeting zu {{topic}} planen? Ich fände es sinnvoll, {{specificDetail}} gemeinsam zu besprechen und die nächsten Schritte abzustimmen. Ich bin am {{dayOrTime}} verfügbar, auch {{alternateTime}} wäre möglich. Wenn ein anderer Tag besser passt, passe ich mich gern an. Sag mir bitte, was für dich am besten funktioniert. Ich schätze deine Zeit und würde das Gespräch gern sorgfältig vorbereiten.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Formelles Briefing", "Guten Tag {{recipientName}}, ich würde gern ein Meeting zu {{topic}} vereinbaren. Es gibt einige Punkte, die ich besprechen möchte, besonders {{specificDetail}}. Ein kurzes Gespräch würde die Dinge effizienter voranbringen. Ich bin am {{dayOrTime}} verfügbar, aber flexibel. Falls gewünscht, können wir auch per {{extraDetail}} sprechen. Bitte sagen Sie mir, welcher Termin Ihnen am besten passt. Vielen Dank.", {
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
      option("Klassische Grüße", "Alles Gute zum Geburtstag, {{recipientName}}! Ich hoffe, dein Tag ist voller Freude und schöner Momente.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Heitere Zeile", "Alles Gute zum Geburtstag, {{recipientName}}! Ich wünsche dir ein wunderbares Jahr.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Warme Glückwünsche", "Alles Gute zum Geburtstag, {{recipientName}}! Ich hoffe, heute bringt dir viel Glück und Raum zum Feiern. Du verdienst einen richtig guten Tag.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Persönliche Zeilen", "Alles Gute zum Geburtstag, {{recipientName}}! Ich bin froh, dich in meinem Leben zu haben. Ich hoffe, dieses Jahr bringt dir noch mehr {{joyWish}} und viele Gründe zum Lächeln.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Durchdachte Grüße", "Alles Gute zum Geburtstag, {{recipientName}}! Ich hoffe, du kannst den Tag mit Menschen und Dingen verbringen, die du liebst. Du bringst so viel {{quality}} in das Leben anderer. Ich bin wirklich dankbar für {{specificDetail}}. Ich wünsche dir ein Jahr voller Glück, Gesundheit und unvergesslicher Momente.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Herzliche Grüße", "Alles Gute zum Geburtstag, {{recipientName}}! Ich wollte dir heute eine richtige Nachricht schicken, weil du mir viel bedeutest. Ich hoffe, dieses Jahr bringt dir {{goalOrWish}} und viele Momente, auf die du stolz bist und die dich glücklich machen. Du sollst gefeiert werden. Hab einen tollen Tag.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Lange Glückwunsch-Nachricht", "Alles Gute zum Geburtstag, {{recipientName}}! Ich hoffe, dein Tag ist voller Lachen, Wärme und all der kleinen Dinge, die dich am glücklichsten machen. Du bist so ein {{quality}} Mensch, und es ist ein echtes Geschenk, dich zu kennen. Eines der Dinge, die ich an dir am meisten schätze, ist {{memory}}. Ich hoffe, das kommende Jahr bringt dir {{hopeOrGoal}}. Du verdienst gute Menschen, Gesundheit und viel Freude. Danke, dass du genau so bist, wie du bist. Ich hoffe, heute fühlt sich so besonders an, wie du es für andere bist.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Ausführliche Grüße", "Alles Gute zum Geburtstag, {{recipientName}}! Ich wollte mehr als eine kurze Zeile schicken, weil du das verdienst. Du hast eine Art, {{quality}} in das Leben anderer zu bringen. Besonders dankbar bin ich für {{memory}}. Ich hoffe, das nächste Jahr schenkt dir {{hopeOrGoal}} und viel Ruhe, Spaß und Aufregendes. Mögest du heute gefeiert, geschätzt und tief geliebt fühlen. Die besten Wünsche zum Geburtstag.", {
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
      option("Direkte Entschuldigung", "Es tut mir leid, {{recipientName}}, wegen {{happened}}. Ich hätte das besser lösen sollen.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Einfach und aufrichtig", "Es tut mir wirklich leid wegen {{happened}}. Ich verstehe, warum das wehgetan oder frustriert hat.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Klare Entschuldigung", "Es tut mir leid, {{recipientName}}, wegen {{happened}}. Mir ist bewusst, dass mein Verhalten dich belastet hat, und das bedauere ich. Ich will es künftig besser machen.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Professionelle Entschuldigung", "Ich möchte mich für {{issue}} entschuldigen. Mir ist die Unannehmlichkeit bewusst, und ich übernehme die Verantwortung. Ich arbeite daran, es gutzumachen.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Aufrichtige Entschuldigung", "Hi {{recipientName}}, ich möchte mich aufrichtig für {{happened}} entschuldigen. Mir ist klar, dass das {{impact}} ausgelöst hat, und es tut mir leid, dich in diese Lage gebracht zu haben. Ich hätte anders handeln sollen. Ich übernehme die volle Verantwortung für meinen Anteil. Wenn möglich, möchte ich es mit {{fixStep}} wieder gutmachen.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Nachdenkliche Entschuldigung", "Ich habe über {{happened}} nachgedacht und will klar sagen: Es tut mir leid. Du hattest {{impact}} nicht verdient, und ich bedauere, wie ich reagiert habe. Ich verstehe, dass du dich {{feeling}} fühlst. Ich suche keine Ausreden. Ich will es ehrlich anerkennen und mich bessern.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Ausführliche Entschuldigung", "Hi {{recipientName}}, ich wollte mich richtig für {{happened}} entschuldigen. Mir ist bewusst, dass mein Verhalten {{impact}} verursacht hat, und das tut mir aufrichtig leid. Rückblickend hätte ich die Situation sorgfältiger und respektvoller behandeln sollen. Du hattest den Stress oder die Enttäuschung nicht verdient. Ich übernehme Verantwortung. Ich möchte es mit {{fixStep}} wiedergutmachen. Wenn Vertrauen Zeit braucht, verstehe ich das — ich meine meine Entschuldigung ernst.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Lange aufrichtige Zeilen", "Es tut mir leid, {{recipientName}}, wegen {{happened}}. Ich habe viel darüber nachgedacht und sehe, wie es dich getroffen hat. Ich bedauere, dass ich in dem Moment nicht vorsichtiger, rücksichtsvoller oder ehrlicher war. Du hattest mehr von mir verdient. Ich will das nicht wegerklären. Ich war im Unrecht, und es tut mir leid. Wenn du offen dafür bist, möchte ich es mit {{fixStep}} wiedergutmachen. Danke, dass du das liest.", {
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
      option("Kurze Liebeszeile", "Ich liebe dich, {{recipientName}}. Du erhellst mein Leben auf so viele Arten.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Einfache romantische Zeile", "Ich wollte nur sagen: Ich liebe dich und schätze dich mehr, als Worte ausdrücken können.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warme romantische Zeilen", "Ich liebe dich, {{recipientName}}, und ich fühle mich glücklich, dich in meinem Leben zu haben. Du schenkst mir so viel {{feeling}}. Ich hoffe, du weißt, wie viel du mir bedeutest.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Sanfte Liebeszeile", "Mit dir werden gewöhnliche Tage besonders. Ich liebe dich für {{quality}}, und ich will das nie als selbstverständlich nehmen. Du bedeutest mir so viel.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Durchdachte Liebesnachricht", "Ich liebe dich, {{recipientName}}, und wollte das richtig in Worte fassen. Eines der Dinge, die ich an dir am meisten schätze, ist {{quality}}. Mit dir fühle ich {{feeling}}, und das bedeutet mir mehr, als ich erklären kann. Ich bin dankbar, wie du in meinem Leben bist. Dich zu lieben gehört zu den schönsten und leichtesten Dingen, die ich kenne.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Zärtliche Zeilen", "Manchmal sage ich es zu selten, aber ich liebe dich von Herzen. Ich liebe, wie du {{specificDetail}}, und ich liebe, wie es sich anfühlt, bei dir zu sein — wie {{feeling}}. Du machst das Leben weicher, lustiger und bedeutsamer. Ich bin jeden Tag dankbar für dich.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Lange romantische Nachricht", "Ich liebe dich, {{recipientName}}, und wollte dir heute ausführlicher sagen, wie sehr. Du bringst so viel {{feeling}} in mein Leben, und das nehme ich nicht als selbstverständlich. Eines der Dinge, die ich am meisten an dir schätze, ist {{specificDetail}}. Mit dir hat sich mein Leben in vielen stillen, bedeutsamen Weisen zum Guten verändert. Ich liebe, wie du {{quality}}. Ich fühle mich unglaublich glücklich, dich kennenzulieben und das Leben mit dir zu teilen. Danke, dass du du selbst bist. Ich liebe dich mehr, als in eine Nachricht passt.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Lange herzliche Liebeszeilen", "Du bedeutest mir so viel, {{recipientName}}. Ich liebe dich dafür, wer du bist, wie du mich fühlen lässt und wie du {{feeling}} in mein Leben bringst. Ich denke oft an {{memory}}, und es erinnert mich, wie glücklich ich bin, dich zu haben. Du machst selbst harte Tage leichter. Ich bewundere {{quality}} und schätze {{specificDetail}}. Ich hoffe, du weißt immer, wie tief du geliebt wirst. Ich bin so dankbar für dich.", {
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
      option("Klassische Gratulation", "Herzlichen Glückwunsch, {{recipientName}}, zu {{achievement}}! Das sind wunderbare Neuigkeiten.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Stolze Zeile", "Riesen Glückwunsch zu {{achievement}}. Du hast hart dafür gearbeitet, und man sieht es.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Herzlicher Glückwunsch", "Herzlichen Glückwunsch, {{recipientName}}, zu {{achievement}}! Ich freue mich so für dich. Du hast diesen Moment wirklich verdient.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Professioneller Glückwunsch", "Herzlichen Glückwunsch zu {{achievement}}. Deine harte Arbeit und dein Einsatz haben sich ausgezahlt. Ich wünsche dir weiterhin viel Erfolg auf dem nächsten Schritt.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Durchdachter Glückwunsch", "Herzlichen Glückwunsch, {{recipientName}}, zu {{achievement}}. Das sind aufregende und wirklich verdiente Neuigkeiten. Ich weiß, wie viel Arbeit, Zeit und Mühe dahinterstecken. Du kannst unglaublich stolz auf dich sein. Ich freue mich sehr für dich und bin gespannt, was als Nächstes kommt.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Unterstützender Glückwunsch", "Ich wollte dir einen großen Glückwunsch zu {{achievement}} aussprechen. Du hast dafür {{timeframe}} gearbeitet, und es ist schön zu sehen, dass der Einsatz gewürdigt wird. Du hast dir das verdient. Gönn dir einen Moment zum Feiern. Ich wünsche dir noch mehr Erfolg.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Langer Glückwunsch", "Herzlichen Glückwunsch, {{recipientName}}, zu {{achievement}}. Ich habe mich sehr über die Nachricht gefreut. Du hast hart dafür gearbeitet, und es ist schön zu sehen, wie sich der Einsatz so bedeutsam auszahlt. Eines der Dinge, die ich besonders schätze, ist {{quality}}. Du kannst sehr stolz sein auf das, was du erreicht hast. Ich hoffe, du nimmst dir Zeit, diesen Moment zu genießen und richtig zu feiern. Du hast es dir verdient. Ich wünsche dir noch mehr Erfolg und Glück im nächsten Kapitel.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Lange stolze Zeilen", "Riesen Glückwunsch zu {{achievement}}, {{recipientName}}. Das ist ein wunderbarer Meilenstein, und ich weiß, dass er nicht vom Himmel fiel. Deine {{quality}} kommt richtig zur Geltung. Ich zweifle nicht, dass du dir das mit viel Einsatz erarbeitet hast. Es ist schön zu sehen, dass du diesen Punkt erreichst. Ich hoffe, du nimmst dir einen Moment, wertzuschätzen, wie weit du gekommen bist. Du kannst stolz sein. Ich bin es auf jeden Fall auf dich.", {
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
      option("Klassischer Abschied", "Es war wunderbar, mit euch allen zu arbeiten. Danke für alles — ich wünsche euch nur das Beste.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Herzlicher Abschied", "Danke für die Unterstützung und die schönen Erinnerungen. Ich wünsche euch alles Gute.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Warmer Abschied", "Während ich in mein nächstes Kapitel starte, danke ich für {{specificDetail}}. Die Zusammenarbeit mit euch hat mir viel bedeutet. Ich wünsche euch alles Gute.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Professioneller Abschied", "Danke für die Chance, in einem so großartigen Team zu arbeiten. Ich habe viel gelernt und schätze eure Unterstützung. Weiterhin viel Erfolg.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Durchdachter Abschied", "Während ich gehe, möchte ich mich bei {{groupName}} bedanken. Diese Zeit hat mir viel bedeutet, und ich bin dankbar für {{specificDetail}}. Ich habe es wirklich geschätzt, Teil dieses Teams zu sein. Ich werde {{memory}} vermissen. Ich wünsche euch weiterhin Erfolg und alles Gute.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Dankbarer Abschied", "Abschied fällt nicht leicht, aber ich möchte {{groupName}} für alles danken. Ich habe hier viel gelernt, besonders schätze ich {{specificDetail}}. Mit euch zu arbeiten war bedeutsam und unvergesslich. Vieles nehme ich mit. Ich wünsche euch alles Gute.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Lange Abschiedszeilen", "Bevor ich weiterziehe, möchte ich mich bei {{groupName}} richtig bedanken. Dieses Kapitel hat mir sehr viel bedeutet, und ich bin wirklich dankbar für {{specificDetail}}. Ich habe viel gelernt an eurer Seite. Besonders werde ich {{memory}} in Erinnerung behalten. Danke, dass diese Zeit so bedeutsam und unvergesslich war. Ich werde die Menschen und Momente vermissen. Ich wünsche euch weiterhin Erfolg, Glück und alles Gute.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Langer Team-Abschied", "Bevor ich gehe, wollte ich sagen, wie sehr ich es geschätzt habe, Teil von {{groupName}} zu sein. Danke für Unterstützung, Großzügigkeit und Ermutigung. Diese Erfahrung hat mir persönlich und beruflich viel gegeben. Besonders dankbar bin ich für {{specificDetail}}. Obwohl ich mich auf das Nächste freue, werde ich dieses Team und die Verbindungen vermissen. Ich hoffe, wir bleiben in Kontakt. Ich wünsche euch viel Erfolg und Glück.", {
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
      option("Klassische Einladung", "Du bist eingeladen zu {{eventName}} am {{date}} in {{place}}. Ich würde mich sehr freuen, wenn du kommst.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Lockere Einladung", "Wir treffen uns zu {{eventName}} am {{dayOrTime}}, und ich würde mich freuen, wenn du dabei bist.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Warme Einladung", "Ich lade dich gern zu {{eventName}} am {{date}} in {{place}} ein. Beginn ist um {{time}} — es würde mir viel bedeuten, wenn du kommen kannst. Sag mir bitte Bescheid.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Freundliche Einladung", "Hi {{recipientName}}, ich lade zu {{eventName}} am {{dayOrTime}} in {{place}} ein. Ich würde mich sehr freuen, mit dir zu feiern. Hoffentlich klappt es.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Durchdachte Einladung", "Hi {{recipientName}}, ich möchte dich zu {{eventName}} am {{date}} in {{place}} einladen. Wir starten gegen {{time}}, und es würde mir sehr viel bedeuten, wenn du dabei bist. Es ist eine Gelegenheit zu {{occasion}}. Bitte sag mir, ob du kannst. Ich würde mich freuen, gemeinsam zu feiern.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Ausführliche Einladung", "Du bist herzlich eingeladen zu {{eventName}} am {{date}} in {{place}}. Wir beginnen um {{time}} und freuen uns, wenn du dabei bist. Es wird eine schöne Zeit mit {{eventDetail}}. Bitte gib mir bis {{rsvpDate}} Bescheid. Ich hoffe, du kannst kommen.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Lange Einladung", "Hi {{recipientName}}, ich wollte dir eine richtige Einladung zu {{eventName}} schicken. Wir treffen uns am {{date}} in {{place}}, Beginn gegen {{time}}. Es würde mir viel bedeuten, wenn du dabei bist und wir den Anlass gemeinsam feiern. Geplant ist {{eventDetail}} — ich denke, es wird etwas Besonderes. Bitte sag bis {{rsvpDate}}, ob es klappt. Ich würde mich sehr freuen. Hoffentlich bis dann.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Ausführliche warme Einladung", "Ich lade dich sehr gern zu {{eventName}} am {{date}} in {{place}} ein. Dieser Anlass ist mir wichtig, und mit dir wäre er noch besonderer. Wir beginnen um {{time}}, geplant ist {{eventDetail}}. Es gibt Zeit zum Entspannen, Feiern und Genießen. Bitte gib bis {{rsvpDate}} Bescheid. Ich hoffe sehr, du kannst dabei sein — ohne dich wäre es nicht dasselbe.", {
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
      option("Sanfte Anteilnahme", "Es tut mir so leid für deinen Verlust, {{recipientName}}. Ich denke an dich und deine Familie.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Leise Unterstützung", "Mein Herz ist bei dir in dieser schweren Zeit. Es tut mir so leid für das, was du durchmachst.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Einfache Anteilnahme", "Es tut mir so leid für deinen Verlust, {{recipientName}}. Ich denke an dich und sende dir liebe Gedanken. Ich hoffe, du spürst in den kommenden Tagen Unterstützung.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Sanfte Unterstützung", "Es hat mich sehr betroffen von {{loss}} zu hören. Ich denke an dich und deine Familie. Ich wünsche dir Kraft und Geborgenheit in dieser schweren Zeit.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Warme Anteilnahme", "Es hat mich tief berührt von {{loss}} zu hören. Bitte nimm mein aufrichtiges Beileid entgegen. Ich kann mir nur erahnen, wie schwer diese Zeit für dich und deine Familie ist. Ich hoffe, du bist von Liebe und Unterstützung umgeben. Ich denke an dich und wünsche dir Kraft.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Herzliche Zeilen", "Es tut mir so leid für deinen Verlust, {{recipientName}}. Es gibt keine perfekten Worte für einen Moment wie diesen, aber ich wollte dir sagen, dass ich an dich denke. {{personName}} wird in Erinnerung bleiben für {{tribute}}. Du bist nicht allein. Ich sende dir Liebe und Anteilnahme.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Lange Anteilnahme", "Es hat mich sehr betroffen von {{loss}} zu hören, {{recipientName}}. Ich kann mir kaum vorstellen, wie schwer sich dieser Moment anfühlt, aber ich wollte dir sagen, dass ich an dich denke. Bitte nimm mein aufrichtiges Beileid entgegen. {{personName}} wird in Erinnerung bleiben für {{tribute}}. Ich hoffe, du bist von Menschen umgeben, die dich tragen. Wenn ich etwas tun kann, auch etwas Kleines, sag Bescheid. Ich sende dir Liebe, Kraft und Trost.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Lange sanfte Zeilen", "Mir ist dein Verlust zutiefst leid. Ich weiß, Worte können in Momenten wie diesen klein wirken, aber ich wollte dir sagen, dass ich an dich und deine Familie denke. {{personName}} hat so viel bedeutet und wird in Liebe in Erinnerung bleiben. Ich hoffe, du findest Trost bei den Menschen um dich und in euren Erinnerungen. Pass gut auf dich auf. Mein aufrichtiges Mitgefühl und meine Unterstützung.", {
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
      option("Kurze Erinnerung", "Nur eine kurze Erinnerung an {{task}} am {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Höflicher Hinweis", "Freundliche Erinnerung: {{task}} bis {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Höfliche Erinnerung", "Hi {{recipientName}}, kurze Erinnerung an {{task}}. Die Frist ist {{dayOrTime}}. Sag Bescheid, wenn du etwas von mir brauchst.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Professionelle Erinnerung", "Freundliche Erinnerung an {{task}}. Bitte schick es bis {{deadline}}, wenn möglich. Vielen Dank.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Durchdachte Erinnerung", "Hi {{recipientName}}, ich wollte kurz an {{task}} erinnern. Die Frist ist {{dayOrTime}} — ich wollte sicherstellen, dass es auf dem Schirm ist. Wenn du Unterstützung brauchst, sag Bescheid. Danke, dass du dich darum kümmerst.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Klare Erinnerung", "Hallo {{recipientName}}, eine freundliche Erinnerung an {{task}}. Wir hoffen auf Abschluss bis {{deadline}}. Ich weiß, Kalender sind voll — deshalb die kurze Notiz. Bei Fragen melde dich gern. Danke.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Lange Erinnerung", "Hi {{recipientName}}, ich wollte freundlich an {{task}} erinnern. Die Frist ist {{dayOrTime}}, deshalb kurz vorher. Ich weiß, du hast viel um die Ohren — das soll nur ein hilfreicher Stups sein. Wenn ich etwas erleichtern kann, sag Bescheid. Danke für deine Hilfe und deine Zeit.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Lange professionelle Erinnerung", "Hallo {{recipientName}}, ich hoffe, es geht dir gut. Kurze Erinnerung an {{task}}. Wir streben Abschluss bis {{deadline}} an, deshalb melde ich mich vorab. Bei Problemen, Verzögerungen oder Fragen melde dich gern — ich helfe, wo ich kann. Danke für deine Aufmerksamkeit.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
