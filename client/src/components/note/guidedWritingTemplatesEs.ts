import {
  guidedWritingOption as option,
  type GuidedWritingTemplateSet,
  type LocalFallbackTemplateId,
} from "./localFallbackShared";

export const GUIDED_WRITING_TEMPLATES_ES: Record<LocalFallbackTemplateId, GuidedWritingTemplateSet> = {
  "ask-anything": {
    "1-2": [
      option("Línea cercana", "Hola {{recipientName}}, solo quería decirte: {{mainMessage}}. Espero que estés bien.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "mainMessage"],
      }),
      option("Mensaje breve", "Hola {{recipientName}}, te escribo por {{topic}}. Dime qué te viene mejor.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Apertura cercana", "Hola {{recipientName}}, hace tiempo que quería escribirte sobre {{topic}}. Quería decir: {{mainMessage}} — sobre todo porque {{reason}}. Te deseo un buen resto de semana.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage", "reason"],
      }),
      option("Seguimiento claro", "Hola {{recipientName}}, quería retomar el tema de {{topic}}. Lo más importante para mí es: {{mainMessage}}. Avísame si quieres hablar más.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "mainMessage"],
      }),
    ],
    "4-6": [
      option("Borrador reflexivo", "Hola {{recipientName}}, quería escribirte un momento sobre {{topic}}. He pensado en {{relevantDetail}} y me pareció que valía la pena escribirte. Lo esencial: {{mainMessage}}. Valoro especialmente {{specificDetail}}. Escríbeme cuando puedas.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "relevantDetail", "mainMessage", "specificDetail"],
      }),
      option("Borrador equilibrado", "Hola {{recipientName}}, espero que estés bien. Te escribo sobre {{topic}} porque {{reason}}. Quería decirte: {{mainMessage}}. Además: {{extraDetail}}. Respóndeme cuando te venga bien.", {
        tone: "professional",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "reason", "mainMessage", "extraDetail"],
      }),
    ],
    "7-10": [
      option("Carta personal", "Hola {{recipientName}}, espero que estés bien. Quería escribirte sobre {{topic}} porque me importa. En los últimos {{timeframe}} he pensado mucho en {{relevantDetail}}. Lo más importante para mí es: {{mainMessage}}. Además: {{extraDetail}}, porque es importante para mí. Valoro muchísimo {{specificDetail}}. Sin presión para responder — solo quería decirlo con claridad y honestidad.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "timeframe", "relevantDetail", "mainMessage", "extraDetail", "specificDetail"],
      }),
      option("Nota detallada", "Hola {{recipientName}}, quería enviarte un mensaje algo más largo sobre {{topic}}. Primero: {{mainMessage}}. Por qué me importa: {{reason}}. También: {{extraDetail}}. Si te viene bien, podríamos {{nextStep}}. Si no es buen momento, no pasa nada. Solo quería ser claro, amable y sincero.", {
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
      option("Gracias clásicas", "Gracias, {{recipientName}}, por {{supportType}}. Significó muchísimo para mí.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
      option("Gracias formales", "Gracias por {{specificDetail}}, {{recipientName}}. Aprecio mucho tu apoyo.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["specificDetail", "recipientName"],
      }),
    ],
    "2-3": [
      option("Gracias de corazón", "Muchísimas gracias, {{recipientName}}, por {{actionTaken}}. Tu apoyo me ayudó mucho con {{result}}. No sabría decir cuánto te lo agradezco.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "result"],
      }),
      option("Líneas cercanas", "Hola {{recipientName}}, gracias por {{supportType}}. Fue atento y generoso y marcó una verdadera diferencia. Te lo agradezco de verdad.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType"],
      }),
    ],
    "4-6": [
      option("Gracias extensas", "Hola {{recipientName}}, quería agradecerte de verdad por {{actionTaken}}. Fue increíblemente amable y me ayudó más de lo que quizá notes. Valoré especialmente {{specificDetail}}. Tu cercanía alivió un momento de estrés. Gracias otra vez por tu generosidad y tu apoyo.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail"],
      }),
      option("Carta de gratitud", "Gracias, {{recipientName}}, por {{supportType}}. Hacía tiempo que quería decirte cuánto lo aprecié. Significó mucho porque {{reason}}. No pasó desapercibido para mí. Me siento afortunado de contar con tu apoyo.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "supportType", "reason"],
      }),
    ],
    "7-10": [
      option("Gracias largas", "Hola {{recipientName}}, quería mandarte un gracias de verdad por {{actionTaken}}. Sé que hay tiempo, esfuerzo y cuidado detrás, y no lo doy por sentado. Lo que más significó para mí fue {{specificDetail}}. Ayudó en {{resultOrSituation}} y hizo las cosas notablemente más llevaderas para mí. Tu amabilidad llegó en el momento justo. Te lo agradezco de corazón. Gracias por estar ahí para mí.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "actionTaken", "specificDetail", "resultOrSituation"],
      }),
      option("Profundo reconocimiento", "Estimado/a {{recipientName}}, mil gracias por {{supportType}}. He pensado a menudo en cuánto significó para mí. No fue solo generoso, también muy considerado. Valoré especialmente {{specificDetail}}. Gracias a ti, {{positiveResult}}. Por favor, ten presente cuánto te lo agradezco. Tu apoyo dejó una huella duradera.", {
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
      option("Solicitud breve", "Hola {{recipientName}}, ¿podríamos acordar una reunión sobre {{topic}} el {{dayOrTime}}?", {
        tone: "casual",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Solicitud profesional", "Hola {{recipientName}}, me gustaría programar una reunión breve sobre {{topic}}. Por favor indícame cuándo te viene bien.", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic"],
      }),
    ],
    "2-3": [
      option("Solicitud clara", "Hola {{recipientName}}, me gustaría concertar una reunión sobre {{topic}}. ¿Te vendría bien {{dayOrTime}}? Si no, buscamos otro momento.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
      option("Seguimiento", "Hola {{recipientName}}, te escribo para coordinar una llamada sobre {{topic}}. El {{dayOrTime}} podría yo. ¿Qué te viene mejor?", {
        tone: "professional",
        audience: "client",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "dayOrTime"],
      }),
    ],
    "4-6": [
      option("Solicitud detallada", "Hola {{recipientName}}, quería proponer horarios para una reunión sobre {{topic}}. Creo que ayudaría repasar {{specificDetail}}. Por ahora puedo el {{dayOrTime}}, pero me adapto con gusto. Por favor dime qué horario te conviene. Puedo coordinarme con tu calendario.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime"],
      }),
      option("Solicitud formal", "Buenos días, {{recipientName}}, me gustaría concertar una reunión sobre {{topic}}. Una conversación breve ayudaría a aclarar {{specificDetail}}. Estoy disponible el {{dayOrTime}}, o también el {{alternateTime}}. Por favor indíqueme la fecha que prefiera. Gracias de antemano.", {
        tone: "formal",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
    ],
    "7-10": [
      option("Briefing detallado", "Hola {{recipientName}}, espero que estés bien. ¿Podemos planificar una reunión sobre {{topic}}? Me parecería útil hablar juntos de {{specificDetail}} y alinear los próximos pasos. Estoy disponible el {{dayOrTime}}; {{alternateTime}} también podría servir. Si otro día te va mejor, me adapto con gusto. Por favor dime qué te funciona mejor. Valoro tu tiempo y me gustaría preparar la conversación con cuidado.", {
        tone: "professional",
        audience: "coworker",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "topic", "specificDetail", "dayOrTime", "alternateTime"],
      }),
      option("Briefing formal", "Buenos días, {{recipientName}}, solicito una reunión sobre {{topic}}. Hay varios puntos que me gustaría tratar, en especial {{specificDetail}}. Una conversación breve haría avanzar las cosas con más eficiencia. Mi disponibilidad actual es {{dayOrTime}}, pero soy flexible. Si lo desea, también podemos hablar por {{extraDetail}}. Por favor indíqueme qué le conviene mejor de su lado. Gracias.", {
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
      option("Felicitación clásica", "¡Feliz cumpleaños, {{recipientName}}! Espero que tu día esté lleno de alegría y buenos momentos.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Línea alegre", "¡Feliz cumpleaños, {{recipientName}}! Te deseo un año maravilloso.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
    ],
    "2-3": [
      option("Felicitación cercana", "¡Feliz cumpleaños, {{recipientName}}! Espero que hoy te traiga mucha suerte y espacio para celebrar. Te mereces un día de verdad bueno.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName"],
      }),
      option("Líneas personales", "¡Feliz cumpleaños, {{recipientName}}! Me alegra tenerte en mi vida. Espero que este año te traiga aún más {{joyWish}} y muchas razones para sonreír.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "joyWish"],
      }),
    ],
    "4-6": [
      option("Felicitación reflexiva", "¡Feliz cumpleaños, {{recipientName}}! Espero que puedas pasar el día con la gente y las cosas que amas. Aportas muchísima {{quality}} a la vida de los demás. Estoy muy agradecido por {{specificDetail}}. Te deseo un año de felicidad, salud y momentos inolvidables.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "specificDetail"],
      }),
      option("Felicitación del corazón", "¡Feliz cumpleaños, {{recipientName}}! Quería mandarte hoy un mensaje de verdad porque significas mucho para mí. Espero que este año te traiga {{goalOrWish}} y muchos momentos de los que te sientas orgulloso y que te hagan feliz. Mereces que te celebren. Que pases un gran día.", {
        tone: "warm",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "goalOrWish"],
      }),
    ],
    "7-10": [
      option("Mensaje largo de cumpleaños", "¡Feliz cumpleaños, {{recipientName}}! Espero que tu día esté lleno de risas, calidez y todas esas pequeñas cosas que te hacen más feliz. Eres una persona tan {{quality}}, y conocerte es un verdadero regalo. Una de las cosas que más valoro en ti es {{memory}}. Espero que el año que viene te traiga {{hopeOrGoal}}. Mereces buenas personas, salud y mucha alegría. Gracias por ser exactamente como eres. Espero que hoy se sienta tan especial como lo eres tú para los demás.", {
        tone: "warm",
        audience: "friend",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "quality", "memory", "hopeOrGoal"],
      }),
      option("Felicitación extensa", "¡Feliz cumpleaños, {{recipientName}}! Quería enviar más que una línea corta, porque te lo mereces. Tienes una forma de llevar {{quality}} a la vida de los demás. Estoy especialmente agradecido por {{memory}}. Espero que el próximo año te regale {{hopeOrGoal}} y también descanso, diversión y cosas emocionantes. Que hoy te sientas celebrado, valorado y muy querido. Los mejores deseos para tu cumpleaños.", {
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
      option("Disculpas directas", "Lo siento, {{recipientName}}, por {{happened}}. Debí haberlo manejado mejor.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Simple y sincero", "Lo siento de verdad por {{happened}}. Entiendo por qué dolió o fue frustrante.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened"],
      }),
    ],
    "2-3": [
      option("Disculpas claras", "Lo siento, {{recipientName}}, por {{happened}}. Soy consciente de que mi comportamiento te afectó y lo lamento. Quiero hacerlo mejor en el futuro.", {
        tone: "gentle",
        audience: "general",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened"],
      }),
      option("Disculpas profesionales", "Quiero pedir disculpas por {{issue}}. Soy consciente de las molestias y asumo la responsabilidad. Estoy trabajando para enmendarlo.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "sensitive",
        placeholders: ["issue"],
      }),
    ],
    "4-6": [
      option("Disculpas sinceras", "Hola {{recipientName}}, quiero disculparme de corazón por {{happened}}. Entiendo que eso provocó {{impact}}, y siento haberte puesto en esa situación. Debí actuar de otra manera. Asumo por completo mi parte de responsabilidad. Si es posible, me gustaría compensarlo con {{fixStep}}.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Disculpas reflexivas", "He reflexionado sobre {{happened}} y quiero decirlo claro: lo siento. No merecías {{impact}}, y lamento cómo reaccioné. Entiendo que te sientas {{feeling}}. No busco excusas. Quiero reconocerlo con honestidad y mejorar.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["happened", "impact", "feeling"],
      }),
    ],
    "7-10": [
      option("Disculpas extensas", "Hola {{recipientName}}, quería disculparme de verdad por {{happened}}. Soy consciente de que mi comportamiento causó {{impact}}, y lo lamento sinceramente. Mirando atrás, debí tratar la situación con más cuidado y respeto. No merecías ese estrés ni esa decepción. Asumo la responsabilidad. Me gustaría compensarlo con {{fixStep}}. Si la confianza necesita tiempo, lo entiendo — mis disculpas van en serio.", {
        tone: "gentle",
        audience: "general",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "happened", "impact", "fixStep"],
      }),
      option("Mensaje largo sincero", "Lo siento, {{recipientName}}, por {{happened}}. He pensado mucho en ello y veo cómo te afectó. Lamento no haber sido más cuidadoso, considerado u honesto en ese momento. Merecías más de mí. No quiero restarle importancia. Estuve mal y lo siento. Si estás abierto/a, me gustaría compensarlo con {{fixStep}}. Gracias por leer esto.", {
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
      option("Línea corta de amor", "Te amo, {{recipientName}}. Iluminas mi vida de tantas maneras.", {
        tone: "romantic",
        audience: "partner",
        style: "direct",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Línea romántica simple", "Solo quería decir: te amo y te valoro más de lo que las palabras pueden expresar.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Líneas románticas cercanas", "Te amo, {{recipientName}}, y me siento afortunado de tenerte en mi vida. Me das tanto {{feeling}}. Espero que sepas cuánto significas para mí.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling"],
      }),
      option("Declaración suave", "Contigo los días ordinarios se vuelven especiales. Te amo por {{quality}}, y no quiero darlo nunca por sentado. Significas muchísimo para mí.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["quality"],
      }),
    ],
    "4-6": [
      option("Mensaje de amor reflexivo", "Te amo, {{recipientName}}, y quería expresarlo bien. Una de las cosas que más valoro en ti es {{quality}}. Contigo me siento {{feeling}}, y eso significa para mí más de lo que puedo explicar. Estoy agradecido por cómo estás en mi vida. Amarte es una de las cosas más bonitas y naturales que conozco.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "quality", "feeling"],
      }),
      option("Líneas tiernas", "A veces no lo digo bastante, pero te amo de verdad. Me encanta cómo {{specificDetail}}, y me encanta cómo se siente estar contigo — como {{feeling}}. Haces la vida más suave, más divertida y más significativa. Cada día estoy agradecido por ti.", {
        tone: "romantic",
        audience: "partner",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["specificDetail", "feeling"],
      }),
    ],
    "7-10": [
      option("Mensaje romántico largo", "Te amo, {{recipientName}}, y quería decirte hoy con más detalle cuánto. Traes tanto {{feeling}} a mi vida y no lo doy por sentado. Una de las cosas que más valoro en ti es {{specificDetail}}. Contigo mi vida ha cambiado de muchas formas silenciosas pero importantes. Me encanta cómo {{quality}}. Me siento increíblemente afortunado de amarte y compartir la vida contigo. Gracias por ser tú. Te amo más de lo que cabe en un mensaje.", {
        tone: "romantic",
        audience: "partner",
        style: "thoughtful",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "feeling", "specificDetail", "quality"],
      }),
      option("Líneas largas del corazón", "Significas tanto para mí, {{recipientName}}. Te amo por quién eres, por cómo me haces sentir y por cómo traes {{feeling}} a mi vida. Pienso a menudo en {{memory}}, y me recuerda cuán feliz soy de tenerte. Incluso los días difíciles se alivian contigo. Admiro {{quality}} y valoro {{specificDetail}}. Espero que siempre sepas cuán profundamente eres amado. Estoy tan agradecido por ti.", {
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
      option("Felicitación clásica", "¡Felicitaciones, {{recipientName}}, por {{achievement}}! Son noticias maravillosas.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Línea orgullosa", "Enormes felicitaciones por {{achievement}}. Trabajaste duro por ello y se nota.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "2-3": [
      option("Felicitación cercana", "¡Felicitaciones, {{recipientName}}, por {{achievement}}! Me alegra muchísimo por ti. Te mereces de verdad este momento.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Felicitación profesional", "Felicitaciones por {{achievement}}. Tu esfuerzo y dedicación dieron frutos. Te deseo mucho éxito en el siguiente paso.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement"],
      }),
    ],
    "4-6": [
      option("Felicitación reflexiva", "¡Felicitaciones, {{recipientName}}, por {{achievement}}! Son noticias emocionantes y muy merecidas. Sé cuánto trabajo, tiempo y esfuerzo hay detrás. Puedes estar increíblemente orgulloso/a. Me alegra mucho por ti y tengo curiosidad por lo que viene.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement"],
      }),
      option("Felicitación de apoyo", "Quería felicitarte de corazón por {{achievement}}. Trabajaste en ello durante {{timeframe}}, y es bonito ver que el esfuerzo sea reconocido. Te lo mereces. Date un momento para celebrar. Te deseo aún más éxitos.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["achievement", "timeframe"],
      }),
    ],
    "7-10": [
      option("Felicitación larga", "¡Felicitaciones, {{recipientName}}, por {{achievement}}! La noticia me hizo mucha ilusión. Trabajaste duro por ello y es bonito ver cómo el esfuerzo da frutos tan significativos. Una de las cosas que especialmente valoro es {{quality}}. Puedes estar muy orgulloso de lo que lograste. Espero que te tomes tiempo para disfrutar este momento y celebrarlo de verdad. Te lo mereces. Te deseo aún más éxito y felicidad en el próximo capítulo.", {
        tone: "warm",
        audience: "general",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "achievement", "quality"],
      }),
      option("Líneas largas de orgullo", "Enormes felicitaciones por {{achievement}}, {{recipientName}}. Es un hito maravilloso y sé que no cayó del cielo. Tu {{quality}} se nota de verdad. No dudo de que lo conseguiste con mucho esfuerzo. Es bonito verte llegar a este punto. Espero que tomes un momento para valorar lo lejos que has llegado. Puedes estar orgulloso. Yo sin duda lo estoy por ti.", {
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
      option("Despedida clásica", "Fue maravilloso trabajar con todos ustedes. Gracias por todo — les deseo lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
      option("Despedida cercana", "Gracias por el apoyo y los bellos recuerdos. Les deseo todo lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Despedida cálida", "Mientras empiezo un nuevo capítulo, gracias por {{specificDetail}}. Trabajar con ustedes significó mucho para mí. Les deseo todo lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["specificDetail"],
      }),
      option("Despedida profesional", "Gracias por la oportunidad de trabajar en un equipo tan formidable. Aprendí mucho y valoro su apoyo. Mucho éxito.", {
        tone: "professional",
        audience: "team",
        style: "balanced",
        sensitivity: "standard",
        placeholders: [],
      }),
    ],
    "4-6": [
      option("Despedida reflexiva", "Al irme, quiero agradecer a {{groupName}}. Este tiempo significó mucho para mí y estoy agradecido por {{specificDetail}}. Aprecié de verdad ser parte de este equipo. Voy a extrañar {{memory}}. Les deseo mucho éxito y lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Despedida agradecida", "Despedirse no es fácil, pero quiero dar las gracias a {{groupName}} por todo. Aprendí mucho aquí y valoro especialmente {{specificDetail}}. Trabajar con ustedes fue significativo e inolvidable. Me llevo mucho conmigo. Les deseo todo lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail"],
      }),
    ],
    "7-10": [
      option("Despedida larga", "Antes de seguir adelante, quiero agradecer de verdad a {{groupName}}. Este capítulo significó muchísimo para mí y estoy sinceramente agradecido por {{specificDetail}}. Aprendí mucho a su lado. Recordaré especialmente {{memory}}. Gracias por hacer este tiempo tan significativo e inolvidable. Voy a extrañar a la gente y los momentos. Les deseo mucho éxito, felicidad y lo mejor.", {
        tone: "warm",
        audience: "team",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["groupName", "specificDetail", "memory"],
      }),
      option("Despedida larga de equipo", "Antes de irme, quería decir cuánto aprecié ser parte de {{groupName}}. Gracias por el apoyo, la generosidad y el ánimo. Esta experiencia me dio mucho a nivel personal y profesional. Estoy especialmente agradecido por {{specificDetail}}. Aunque ilusiona lo que viene, voy a extrañar a este equipo y los vínculos. Espero que sigamos en contacto. Les deseo mucho éxito y felicidad.", {
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
      option("Invitación clásica", "Estás invitado/a a {{eventName}} el {{date}} en {{place}}. Me encantaría mucho que puedas venir.", {
        tone: "warm",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place"],
      }),
      option("Invitación informal", "Nos vemos en {{eventName}} el {{dayOrTime}}, y me gustaría que estés.", {
        tone: "casual",
        audience: "friend",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["eventName", "dayOrTime"],
      }),
    ],
    "2-3": [
      option("Invitación cercana", "Te invito con gusto a {{eventName}} el {{date}} en {{place}}. Empieza a las {{time}} — significaría mucho para mí si puedes venir. Por favor avísame.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time"],
      }),
      option("Invitación amistosa", "Hola {{recipientName}}, te invito a {{eventName}} el {{dayOrTime}} en {{place}}. Me encantaría celebrar contigo. Espero que puedas.", {
        tone: "casual",
        audience: "friend",
        style: "celebratory",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "dayOrTime", "place"],
      }),
    ],
    "4-6": [
      option("Invitación reflexiva", "Hola {{recipientName}}, me gustaría invitarte a {{eventName}} el {{date}} en {{place}}. Empezamos alrededor de las {{time}}, y significaría mucho para mí que estés. Es una ocasión para {{occasion}}. Por favor dime si puedes. Me gustaría celebrar juntos.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "occasion"],
      }),
      option("Invitación detallada", "Estás cordialmente invitado/a a {{eventName}} el {{date}} en {{place}}. Empezamos a las {{time}} y nos encantaría que estés. Será un buen momento con {{eventDetail}}. Por favor confírmame antes del {{rsvpDate}}. Espero que puedas venir.", {
        tone: "warm",
        audience: "general",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
    ],
    "7-10": [
      option("Invitación larga", "Hola {{recipientName}}, quería enviarte una invitación de verdad a {{eventName}}. Nos reunimos el {{date}} en {{place}}, inicio alrededor de las {{time}}. Significaría mucho para mí que estés y celebremos juntos. Está previsto {{eventDetail}} — creo que será algo especial. Por favor avísame antes del {{rsvpDate}} si te viene bien. Me encantaría mucho. Espero verte.", {
        tone: "warm",
        audience: "general",
        style: "thoughtful",
        sensitivity: "standard",
        placeholders: ["recipientName", "eventName", "date", "place", "time", "eventDetail", "rsvpDate"],
      }),
      option("Invitación cálida extensa", "Te invito con mucho gusto a {{eventName}} el {{date}} en {{place}}. Esta ocasión me importa, y contigo sería aún más especial. Empezamos a las {{time}}, está previsto {{eventDetail}}. Habrá tiempo para relajarse, celebrar y disfrutar. Por favor confírmame antes del {{rsvpDate}}. Espero de verdad que puedas estar — sin ti no sería lo mismo.", {
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
      option("Condolencias suaves", "Lo siento muchísimo por tu pérdida, {{recipientName}}. Pienso en ti y en tu familia.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Apoyo discreto", "Mi corazón está contigo en este momento tan difícil. Lo siento muchísimo por lo que estás pasando.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: [],
      }),
    ],
    "2-3": [
      option("Condolencias simples", "Lo siento muchísimo por tu pérdida, {{recipientName}}. Pienso en ti y te envío cariño. Espero que sientas apoyo en los próximos días.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName"],
      }),
      option("Apoyo gentil", "Me entristeció mucho saber de {{loss}}. Pienso en ti y en tu familia. Te deseo fuerza y cobijo en este momento tan difícil.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
    ],
    "4-6": [
      option("Condolencias cercanas", "Me conmovió profundamente saber de {{loss}}. Recibe mi más sentido pésame. Solo puedo imaginar lo difícil que es este momento para ti y tu familia. Espero que estés rodeado de amor y apoyo. Pienso en ti y te deseo fortaleza.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss"],
      }),
      option("Líneas del corazón", "Lo siento muchísimo por tu pérdida, {{recipientName}}. No hay palabras perfectas para un momento así, pero quería decirte que pienso en ti. {{personName}} permanecerá en el recuerdo por {{tribute}}. No estás solo/a. Te envío cariño y condolencias.", {
        tone: "gentle",
        audience: "general",
        style: "gentle",
        sensitivity: "sensitive",
        placeholders: ["recipientName", "personName", "tribute"],
      }),
    ],
    "7-10": [
      option("Condolencias largas", "Me entristeció mucho saber de {{loss}}, {{recipientName}}. Me cuesta imaginar lo que sientes en este momento, pero quería decirte que pienso en ti. Recibe mi más sentido pésame. {{personName}} permanecerá en el recuerdo por {{tribute}}. Espero que estés rodeado de personas que te sostengan. Si puedo hacer algo, aunque sea pequeño, dímelo. Te envío cariño, fuerza y consuelo.", {
        tone: "gentle",
        audience: "general",
        style: "supportive",
        sensitivity: "sensitive",
        placeholders: ["loss", "recipientName", "personName", "tribute"],
      }),
      option("Líneas largas suaves", "Tu pérdida me duele profundamente. Sé que las palabras pueden parecer pequeñas en momentos así, pero quería decirte que pienso en ti y en tu familia. {{personName}} significó tanto y permanecerá en el recuerdo con amor. Espero encuentres consuelo en quienes te rodean y en los recuerdos. Cuídate mucho. Mi más sentido pésame y mi apoyo.", {
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
      option("Recordatorio breve", "Solo un recordatorio rápido de {{task}} el {{dayOrTime}}.", {
        tone: "casual",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "dayOrTime"],
      }),
      option("Recordatorio cortés", "Recordatorio amable: {{task}} antes del {{deadline}}.", {
        tone: "professional",
        audience: "general",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "2-3": [
      option("Recordatorio cortés", "Hola {{recipientName}}, recordatorio breve sobre {{task}}. La fecha límite es el {{dayOrTime}}. Avísame si necesitas algo de mi parte.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Recordatorio profesional", "Recordatorio amable sobre {{task}}. Por favor envíalo antes del {{deadline}}, si es posible. Gracias.", {
        tone: "professional",
        audience: "coworker",
        style: "direct",
        sensitivity: "standard",
        placeholders: ["task", "deadline"],
      }),
    ],
    "4-6": [
      option("Recordatorio reflexivo", "Hola {{recipientName}}, quería recordarte brevemente {{task}}. La fecha límite es el {{dayOrTime}} — solo quería asegurarme de que esté en tu radar. Si necesitas apoyo, dímelo. Gracias por encargarte.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Recordatorio claro", "Hola {{recipientName}}, un recordatorio amable sobre {{task}}. Esperamos cerrarlo antes del {{deadline}}. Sé que los calendarios están llenos — por eso esta nota breve. Si tienes preguntas, escríbeme. Gracias.", {
        tone: "professional",
        audience: "coworker",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
    "7-10": [
      option("Recordatorio largo", "Hola {{recipientName}}, quería recordarte con amabilidad {{task}}. La fecha límite es el {{dayOrTime}}, por eso este mensaje antes de tiempo. Sé que tienes mucho encima — esto solo es un empujoncito útil. Si puedo facilitar algo, dímelo. Gracias por tu ayuda y tu tiempo.", {
        tone: "professional",
        audience: "coworker",
        style: "supportive",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "dayOrTime"],
      }),
      option("Recordatorio largo profesional", "Hola {{recipientName}}, espero que esté bien. Recordatorio breve sobre {{task}}. Buscamos cerrar antes del {{deadline}}, por eso me adelanto. Si hay problemas, retrasos o preguntas, avísame — ayudo en lo que pueda. Gracias por su atención.", {
        tone: "professional",
        audience: "client",
        style: "balanced",
        sensitivity: "standard",
        placeholders: ["recipientName", "task", "deadline"],
      }),
    ],
  },
};
