import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersEs: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Gráfico editorial «Chat Control vuelve» con una burbuja de chat bloqueada y un mapa de Europa",
  heroCaption: "Ilustración generada para PrivateNote.ai.",
  intro:
    "Hoy, martes 7 de julio, se espera que el Parlamento Europeo retome la propuesta de Reglamento sobre abuso sexual infantil, comúnmente conocida por sus críticos como Chat Control. El objetivo de la propuesta no es controvertido: los niños deben protegerse de abusos horribles. La pregunta técnica es si el escaneo obligatorio de comunicaciones privadas puede lograrlo sin romper las garantías de seguridad de las que depende todo el mundo.",
  updatePrefix:
    "**Actualización (9 de julio de 2026):** El Parlamento prorrogó Chat Control 1.0 aunque más eurodiputados votaron en contra que a favor.",
  updateLink: "Lee qué pasó y por qué",
  updateSuffix: ".",
  calloutTitle: "Este no es un debate sobre si se debe combatir el abuso infantil.",
  calloutBody:
    "Las víctimas merecen protección. Las fuerzas del orden merecen herramientas eficaces. Las plataformas deben denunciar con rapidez material ilegal conocido y cooperar en las investigaciones. El desacuerdo es si el escaneo masivo de los mensajes privados de todos es una forma técnicamente sólida de llegar ahí.",
  expertEyebrow: "Advertencia de expertos",
  expertTitle: "Bart Preneel: la comunidad de seguridad está inusualmente alineada",
  expertParagraphs: [
    "Bart Preneel, catedrático de la KU Leuven y uno de los expertos europeos más conocidos en criptografía, privacidad y derechos digitales, advirtió hoy de que Chat Control vuelve para una tercera votación tras dos votaciones anteriores que no resolvieron el asunto. En su publicación de LinkedIn, describió la propuesta como un escaneo indiscriminado de comunicaciones no cifradas, ahora ampliado con el uso de IA para encontrar CSAM nuevo.",
    "Preneel también señaló el consenso experto inusualmente amplio detrás de la crítica: más de 800 expertos en ciberseguridad y privacidad han advertido de que el escaneo masivo y el análisis de contenido basado en IA siguen teniendo tasas de error inaceptables, plantean serias preocupaciones de proporcionalidad y son menos eficaces que los enfoques focalizados. Como dijo, la comunidad de seguridad rara vez alcanza este nivel de acuerdo en cualquier tema.",
    "Su recomendación práctica es directa: contacta con los miembros del Parlamento Europeo y explica por qué el escaneo indiscriminado no es una forma sensata de abordar el grave problema de la distribución de CSAM.",
    "Para el trasfondo técnico, remite a los lectores a dos cartas de científicos: la carta abierta de septiembre de 2025, que explica las preocupaciones centrales sobre el escaneo del lado del cliente y la detección basada en IA, y el seguimiento de noviembre de 2025, que argumenta que el aumento propuesto del alcance amplifica los mismos riesgos que la comunidad de seguridad ya ha identificado.",
  ],
  expertLinks: {
    preneel: "Publicación de LinkedIn de Bart Preneel",
    sep2025: "Carta abierta de septiembre de 2025",
    nov2025: "Seguimiento de noviembre de 2025",
  },
  technicalConcerns: [
    {
      title: "La IA no puede clasificar de forma fiable CSAM desconocido a escala de Internet",
      body: "La clasificación de imágenes depende del contexto. Fotos familiares, imágenes médicas, material educativo e imágenes consensuadas intercambiadas por adolescentes pueden resultar difíciles incluso para humanos de interpretar correctamente.",
    },
    {
      title: "La coincidencia de imágenes conocidas puede evitarse",
      body: "Recortar, redimensionar, comprimir, pequeños cambios de píxeles y perturbaciones adversariales pueden dejar una imagen reconocible para una persona mientras cambian cómo la ven los sistemas automatizados de coincidencia.",
    },
    {
      title: "El escaneo del lado del cliente cambia el modelo de confianza del cifrado",
      body: "El algoritmo de cifrado puede seguir siendo matemáticamente robusto, pero el software debe inspeccionar el contenido antes de que el cifrado lo proteja. Esa no es la garantía de privacidad que los usuarios esperan del cifrado de extremo a extremo.",
    },
    {
      title: "La infraestructura de escaneo se convierte en un objetivo de alto valor",
      body: "Una vez que los dispositivos deben inspeccionar mensajes privados, el mismo mecanismo puede atraer atacantes, presión política y futuras exigencias de escanear otras categorías de contenido.",
    },
  ],
  protectedGroups: [
    "periodistas y fuentes confidenciales",
    "abogados y clientes",
    "médicos y pacientes",
    "empresas que protegen secretos comerciales",
    "funcionarios gubernamentales y diplomáticos",
    "comunicaciones policiales y militares",
  ],
  betterInvestments: [
    { title: "Apoyar a las víctimas", body: "Canales de denuncia informados sobre el trauma y apoyo a largo plazo a las víctimas." },
    { title: "Financiar especialistas", body: "Más capacidad para equipos policiales formados que investigan abusos." },
    { title: "Investigar pruebas", body: "Investigación rápida y focalizada basada en pistas y denuncias concretas." },
    { title: "Trabajar entre fronteras", body: "Cooperación internacional cuando delincuentes, plataformas y víctimas abarcan varias jurisdicciones." },
    { title: "Eliminar material confirmado", body: "Retirada más rápida de contenido ilegal conocido tras la confirmación adecuada." },
    { title: "Prevenir el abuso antes", body: "Educación y trabajo de prevención antes de que ocurra el abuso." },
  ],
  betterInvestmentEyebrow: "Mejor inversión",
  betterInvestmentTitle: "Reforzar el trabajo que ayuda directamente a víctimas e investigadores",
  sections: {
    proposalReturns: {
      title: "La propuesta sigue volviendo",
      paragraphs: [
        "En los últimos años, el CSAR ha pasado por múltiples revisiones. Algunos cambios merecen reconocimiento: un tratamiento más rápido de las denuncias voluntarias, obligaciones más claras y categorías de contenido más acotadas son mejores que mandatos más amplios y vagos.",
        "Pero esos cambios no eliminan el problema técnico central. Las versiones más controvertidas de Chat Control siguen apoyándose en tecnologías de detección de las que criptógrafos, informáticos e investigadores de seguridad han advertido que no son lo bastante fiables para desplegarlas contra cientos de millones de comunicaciones privadas.",
      ],
    },
    cryptographersObject: { title: "Por qué los criptógrafos siguen oponiéndose" },
    e2eeScanning: {
      title: "El cifrado de extremo a extremo no sobrevive al escaneo obligatorio del lado del cliente",
      paragraphs: [
        "El cifrado de extremo a extremo ofrece a los usuarios una promesa sencilla: solo el remitente y el destinatario previsto pueden leer el mensaje. El escaneo obligatorio del lado del cliente cambia esa promesa. El dispositivo debe inspeccionar el mensaje antes de que el cifrado lo proteja e informar de todo lo que el sistema de escaneo considere sospechoso.",
        "En tránsito, el mensaje puede seguir cifrado con criptografía robusta. El problema es lo que ocurre antes de ese paso. Si el software debe examinar el texto plano en el dispositivo e informar coincidencias a un sistema externo, el punto final ya no actúa solo para el usuario. Ese es un modelo de confianza distinto del cifrado de extremo a extremo tal como la gente lo entiende.",
      ],
    },
    encryptionProtects: {
      title: "El cifrado protege más que chats personales",
      intro:
        "El debate público a menudo suena como si la mensajería cifrada fuera solo conversación casual. No lo es. La comunicación privada segura es infraestructura crítica para personas e instituciones que enfrentan riesgos reales.",
    },
    moreTech: {
      title: "Más tecnología no significa automáticamente más seguridad",
      paragraphs: [
        "La propuesta también se sitúa junto a llamamientos más amplios a la verificación de edad y sistemas de mitigación adicionales. Esas ideas pueden sonar a capas extra de seguridad, pero la ingeniería de seguridad rara vez mejora añadiendo complejidad sin entender las nuevas superficies de ataque que crea.",
        "Las comprobaciones de identidad centralizadas, las tuberías de escaneo, las colas de revisión y la infraestructura de denuncias pueden introducir riesgos de privacidad propios. Un sistema construido para proteger a los niños no debería crear en silencio nuevas bases de datos, nuevos incentivos de vigilancia y nuevos modos de fallo para todos.",
      ],
    },
    betterWays: {
      title: "Hay mejores formas de proteger a los niños",
      intro:
        "Un punto de la crítica científica merece especial atención: el CSAM es prueba de un delito anterior. El objetivo real debería ser prevenir el abuso, apoyar a las víctimas y permitir investigaciones focalizadas que puedan identificar realmente a los delincuentes.",
    },
    privateNote: {
      title: "Por qué esto importa para PrivateNote",
      paragraphs: [
        "En PrivateNote, el principio es sencillo: cuando creas una nota cifrada, solo las personas que elijas deberían poder leerla. Ni nosotros. Ni anunciantes. Ni proveedores en la nube. Nadie más.",
        "Ese principio no es un eslogan. Refleja décadas de ingeniería criptográfica. El debate en torno a Chat Control pregunta si la comunicación privada debe seguir siendo genuinamente privada, o si cada dispositivo debe convertirse en un punto de control obligatorio que inspecciona los mensajes antes de cifrarlos.",
      ],
    },
    policyReality: {
      title: "La política debería seguir la realidad técnica",
      paragraphs: [
        "Personas razonables pueden discrepar en política. **Pero la política debería informarse de la realidad técnica.** Cuando cientos de criptógrafos, informáticos, ingenieros de seguridad e investigadores de privacidad advierten de que una tecnología propuesta no puede cumplir sus promesas sin debilitar garantías de seguridad fundamentales, los legisladores deberían escuchar.",
        "Proteger a los niños y proteger las comunicaciones seguras no son objetivos mutuamente excluyentes. Europa debería perseguir soluciones que logren ambos.",
      ],
    },
  },
  ctaTitle: "Envía notas privadas sin darle la clave al servidor",
  ctaBody:
    "PrivateNote cifra las notas en tu navegador y mantiene la clave de descifrado en el fragmento de la URL.",
  ctaButton: "Probar PrivateNote ->",
};
