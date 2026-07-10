import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedEs: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Votación del Parlamento Europeo sobre Chat Control con una burbuja de chat bloqueada sobre un mapa de Europa",
  heroCaption: "Ilustración generada para PrivateNote.ai.",
  intro:
    "El 9 de julio de 2026, algo inusual ocurrió en el Parlamento Europeo. La votación final sobre la prórroga del reglamento temporal Chat Control 1.0 terminó con más diputados votando en contra que a favor—y, sin embargo, la medida se aprobó igualmente.",
  voteEyebrow: "Votación final, 9 de julio de 2026",
  voteHeadline: "Más votos en «No» que en «Sí»—y aun así se aprobó",
  voteLabels: { against: "En contra", for: "A favor", abstentions: "Abstenciones" },
  voteSummary:
    "A primera vista, la mayoría de observadores concluirían que la propuesta había sido rechazada. La respuesta no está en el cifrado ni en la ciberseguridad—sino en el procedimiento parlamentario.",
  nonE2eChannels: [
    "servicios de correo tradicionales",
    "almacenamiento en la nube",
    "ciertos servicios de mensajería directa",
    "otras comunicaciones en las que los proveedores pueden acceder al contenido de los mensajes",
  ],
  privacyConcerns: [
    {
      title: "Falsos positivos",
      body: "Detectar material ilegal ya conocido mediante hashes criptográficos suele ser fiable, pero no es perfecto. Investigadores han demostrado colisiones y errores de implementación que pueden generar informes falsos. Si los proveedores empiezan a usar IA para identificar material nuevo, previamente no visto, la tasa de falsos positivos se vuelve mucho más difícil de controlar. Cada falso positivo puede implicar que la comunicación privada de una persona inocente quede marcada para una revisión posterior.",
    },
    {
      title: "Expansión de la infraestructura de vigilancia",
      body: "Muchos expertos argumentan que, una vez que las plataformas construyen sistemas de escaneo a gran escala, ampliar su uso a otros fines se vuelve técnicamente sencillo. La historia muestra que las tecnologías introducidas para fines acotados a menudo evolucionan hacia capacidades de vigilancia más amplias con el tiempo.",
    },
    {
      title: "Efectos disuasorios",
      body: "La comunicación privada solo funciona cuando la gente confía en que sus conversaciones siguen siendo privadas. Si los usuarios creen que cada mensaje puede analizarse automáticamente, muchos evitarán hablar de temas sensibles por completo—aunque sean perfectamente legales. Este fenómeno está bien documentado en la investigación sobre privacidad.",
    },
    {
      title: "Efectividad limitada",
      body: "Más de 800 investigadores en ciberseguridad y privacidad han argumentado que el escaneo masivo de mensajes es poco probable que reduzca de forma significativa el abuso infantil, mientras impone costes de privacidad sustanciales a cientos de millones de usuarios. Los críticos sostienen que es mejor invertir recursos policiales en investigaciones focalizadas que en un escaneo indiscriminado.",
    },
  ],
  e2eeCalloutTitle: "El cifrado de extremo a extremo cambia el modelo de confianza",
  e2eeCalloutBody:
    "El cifrado de extremo a extremo garantiza que solo el remitente y el destinatario previsto poseen las claves criptográficas necesarias para leer un mensaje. Ni siquiera el proveedor del servicio puede descifrar el contenido. Cualquier requisito de inspeccionar mensajes cifrados antes o después del cifrado cambia fundamentalmente ese modelo de seguridad—y se ha convertido en uno de los temas más controvertidos de la política de ciberseguridad moderna.",
  sections: {
    whyPassed: {
      title: "¿Por qué se aprobó?",
      paragraphs: [
        "No se trató de una votación legislativa estándar que requiriera una mayoría simple de los votos emitidos. Debido a la etapa procedimental concreta de esta legislación, **rechazar la propuesta exigía una mayoría absoluta de todos los miembros del Parlamento Europeo—actualmente 361 votos**.",
        "Aunque 314 eurodiputados votaron en contra de la propuesta, ese número no alcanzó el umbral requerido. En consecuencia, la propuesta se consideró aprobada.",
      ],
      callout:
        "Este resultado procedimental ha sorprendido a muchos observadores, incluidos periodistas, expertos legales e investigadores en ciberseguridad, porque la expectativa intuitiva es que más votos en «No» que en «Sí» deberían derrotar una propuesta.",
    },
    whatItDoes: {
      title: "¿Qué hace realmente Chat Control 1.0?",
      paragraphs: [
        "La medida adoptada **no** introduce el escaneo obligatorio de todos los mensajes privados. En su lugar, prorroga el marco legal temporal existente que permite a los proveedores de servicios en línea **voluntariamente** detectar y denunciar material de abuso sexual infantil (CSAM) en ciertos tipos de comunicaciones hasta el 3 de abril de 2028.",
        "Esto se aplica principalmente a comunicaciones que no están protegidas por [cifrado de extremo a extremo](blog:what-is-end-to-end-encryption), como:",
        "Es importante señalar que el Parlamento mantuvo el lenguaje que excluye las comunicaciones cifradas de extremo a extremo de este marco de escaneo voluntario. Para una definición precisa de lo que eso significa en la práctica—y en qué se diferencia del cifrado de transporte ordinario—consulta nuestra guía sobre [qué es realmente el cifrado de extremo a extremo](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "¿Por qué están preocupados los expertos en privacidad?",
      intro:
        "Muchos investigadores y organizaciones de libertades civiles se opusieron a la prórroga—no porque rechacen la protección de los niños, sino porque cuestionan si este enfoque logra ese objetivo sin crear riesgos significativos. Nuestro artículo anterior sobre [por qué los criptógrafos europeos siguen advirtiendo sobre Chat Control](blog:chat-control-europe-cryptographers) explica en profundidad las objeciones técnicas más amplias.",
    },
    chatControl20: {
      title: "La historia más grande es Chat Control 2.0",
      paragraphs: [
        "Aunque la votación de esta semana ha atraído mucha atención, muchos expertos creen que el debate más importante aún está por venir. La propuesta comúnmente conocida como Chat Control 2.0 pretende establecer un marco legal permanente para detectar CSAM en línea.",
        "A diferencia de la prórroga temporal adoptada esta semana, las discusiones en torno a Chat Control 2.0 han incluido repetidamente propuestas que podrían afectar a las comunicaciones cifradas de extremo a extremo. Ahí es donde el debate se vuelve considerablemente más significativo—y donde importan más las advertencias de nuestro [informe de criptógrafos sobre Chat Control](blog:chat-control-europe-cryptographers).",
      ],
    },
    privateNote: {
      title: "Por qué esto importa para PrivateNote",
      paragraphs: [
        "La comunicación privada se basa en un principio sencillo: si un servicio no puede leer tu mensaje, no puede escanearlo, analizarlo, venderlo ni exponerlo accidentalmente. PrivateNote se diseñó en torno a esa idea.",
        "Cuando creas una nota, el cifrado ocurre directamente en tu navegador. La clave de cifrado nunca llega a nuestros servidores. Solo almacenamos texto cifrado. Sin la clave—que permanece enteramente bajo tu control—el contenido de tu nota es matemáticamente ilegible para nosotros.",
        "Ese diseño no trata de evitar responsabilidades. Trata de garantizar que tu comunicación privada siga siendo exactamente eso: privada. Ya compartas contraseñas, documentos legales, información financiera, secretos empresariales o conversaciones personales, la privacidad no debería depender únicamente de confiar en el proveedor del servicio. Debería imponerse mediante criptografía.",
        "Para una visión paso a paso de cómo funciona el cifrado en el navegador en la práctica, consulta [cómo funciona PrivateNote](app:how-it-works). Para compartir secretos de corta duración sin dejarlos en un hilo de chat permanente, los [enlaces secretos de un solo uso](blog:one-time-secret-links) suelen encajar mejor que las apps de mensajería—incluso las cifradas.",
      ],
    },
    debateContinues: {
      title: "El debate está lejos de terminar",
      paragraphs: [
        "Personas razonables pueden discrepar sobre cómo la sociedad debe combatir el abuso infantil en línea. Proteger a los niños es, sin duda, uno de los intereses públicos más importantes. La pregunta difícil es cómo lograr ese objetivo sin socavar la infraestructura de seguridad y privacidad de la que dependen cada día periodistas, empresas, abogados, profesionales sanitarios, activistas y ciudadanos corrientes.",
        "A medida que continúen las discusiones en torno a Chat Control 2.0, este equilibrio entre seguridad pública y derechos fundamentales a la privacidad seguirá siendo uno de los debates definitorios de la política tecnológica en Europa. Sea cual sea la posición, una cosa es segura: el futuro de la comunicación cifrada lo decidirán cada vez más no solo criptógrafos e ingenieros de software—sino también legisladores.",
      ],
    },
  },
  ctaTitle: "Envía notas privadas sin darle la clave al servidor",
  ctaBody:
    "PrivateNote cifra las notas en tu navegador y mantiene la clave de descifrado en el fragmento de la URL.",
  ctaButton: "Probar PrivateNote ->",
};
