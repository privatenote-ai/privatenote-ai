import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsEs: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Portátil en un escritorio mostrando un correo con credenciales de servidor y una clave privada SSH en texto plano",
  intro:
    "El correo se ha convertido en la forma predeterminada de intercambiar casi todo: contratos, contraseñas, claves API, datos bancarios, historiales médicos, documentos de identidad, contraseñas Wi‑Fi y códigos de recuperación. La mayoría enviamos información sensible por correo sin pensarlo dos veces.",
  calloutTitle: "El correo se creó para entregar mensajes, no para hacerlos desaparecer",
  calloutBody:
    "Una vez que envías un correo, a menudo pierdes el control sobre dónde termina, cuánto tiempo se almacena y quién puede acceder a él con el tiempo. Si envías algo que debe permanecer privado, el correo suele ser la herramienta equivocada.",
  emailCopies: [
    "tu bandeja de entrada",
    "la bandeja del destinatario",
    "copias de seguridad del proveedor de correo",
    "copias archivadas",
    "dispositivos sincronizados",
    "sistemas de copia de seguridad empresariales",
    "archivos PST o MBOX exportados",
    "infraestructura de recuperación ante desastres",
  ],
  agedSecretsExamples: [
    "una contraseña de base de datos de producción",
    "una clave API",
    "credenciales SSH",
    "datos de acceso VPN",
    "una frase de recuperación de criptomonedas",
  ],
  forwardingPaths: [
    "reenviado",
    "copiado en sistemas de tickets",
    "pegado en aplicaciones de chat",
    "adjuntado a otros correos",
    "compartido con contratistas",
    "incluido en solicitudes de soporte",
  ],
  aiProcessingUses: [
    "detección de spam",
    "protección contra phishing",
    "detección de malware",
    "respuestas inteligentes",
    "categorización de la bandeja",
    "búsqueda",
    "funciones de productividad",
    "redacción y resumen asistidos por IA",
  ],
  oneTimeSecretExamples: [
    "una contraseña",
    "una clave API",
    "un código de recuperación",
    "una licencia de software",
    "credenciales de servidor",
    "un mensaje confidencial",
  ],
  oneTimeBenefits: [
    "Sin historial en la bandeja de entrada.",
    "Sin archivo buscable.",
    "Sin reenvío accidental del secreto en sí.",
    "Sin copias olvidadas en buzones durante años.",
  ],
  sections: [
    {
      title: "Tu correo no existe solo en un lugar",
      paragraphs: [
        "Mucha gente imagina el correo como una conversación simple entre dos personas. En realidad, cada mensaje suele existir en varios sitios:",
        "Aunque borres un correo, las copias pueden seguir existiendo en otros lugares. Algunas organizaciones conservan el correo durante años por requisitos legales, regulatorios o empresariales. En la práctica, un correo a menudo se vuelve permanente.",
      ],
    },
    {
      title: "Los secretos envejecen mal",
      paragraphs: [
        "Lo más peligroso del correo no es necesariamente hoy. Es dentro de cinco años. Imagina que le enviaste a alguien:",
        "Quizá las credenciales han cambiado desde entonces. Quizá no. Años después, ese correo puede seguir en varias bandejas de entrada, buscable en segundos. Quien acceda a una de esas cuentas obtiene de golpe un mapa de tus secretos pasados. Nuestra guía sobre [secretos que nunca debes enviar por chat](blog:secrets-never-send-in-chat) cubre riesgos similares en apps de mensajería; el correo suele ser peor porque la retención es más larga y las copias más numerosas.",
      ],
    },
    {
      title: "El correo está diseñado para ser buscable",
      paragraphs: [
        "Los clientes de correo modernos encuentran mensajes antiguos con facilidad. Busca `password`, `API` o `confidential` y aparecen mensajes de hace años casi al instante.",
      ],
      callout:
        "Es una función excelente para la comunicación cotidiana. Es terrible para secretos. La información sensible debería volverse **más difícil** de encontrar con el tiempo, no más fácil.",
    },
    {
      title: "Reenviar cuesta un clic",
      paragraphs: [
        "Quizá confías en el destinatario. Eso no siempre basta. Los correos se:",
        "Cuando un secreto sale de tu bandeja, ya no controlas cuántas copias existen. A diferencia de un gestor de contraseñas o un servicio de compartición cifrada, el correo no permite revocar el acceso tras la entrega.",
      ],
    },
    {
      title: "La IA procesa cada vez más el correo",
      paragraphs: [
        "Otra razón para pensarlo bien antes de enviar información sensible por correo: los proveedores usan cada vez más sistemas automatizados para procesar mensajes. Estos sistemas pueden ayudar con:",
        "Los proveedores difieren mucho en cómo funcionan estas características, qué datos procesan y bajo qué políticas de privacidad. Aunque muchos han reforzado sus compromisos en los últimos años, enviar información sensible por correo sigue significando confiarla a sistemas fuera de tu control. Si tu objetivo es minimizar la exposición, reducir lo sensible que envías por correo es un primer paso sensato.",
      ],
    },
    {
      title: "El escaneo regulatorio también forma parte del debate",
      paragraphs: [
        "La privacidad ya no es solo una cuestión técnica. Se ha convertido en política. En julio de 2026, el Parlamento Europeo aprobó una prórroga del marco legal temporal que permite a ciertos proveedores de comunicación detectar y denunciar voluntariamente material de abuso sexual infantil (CSAM) hasta abril de 2028.",
        "El marco afecta sobre todo a servicios que pueden acceder al contenido de los mensajes, como muchos proveedores de correo tradicionales y otros servicios de comunicación sin [cifrado de extremo a extremo](blog:what-is-end-to-end-encryption). Para más sobre qué significó esa votación — y por qué más votos en contra que a favor aun así dieron lugar a la aprobación — consulta nuestra explicación de [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "El objetivo declarado es proteger a los menores, y personas razonables pueden discrepar sobre el equilibrio entre privacidad y seguridad pública. Aun así, el debate ilustra un punto importante: **si un servicio puede leer tus mensajes, leyes, políticas o decisiones de plataforma futuras pueden afectar cómo se procesan.** Por el contrario, los servicios cifrados de extremo a extremo son distintos porque el proveedor no posee las claves criptográficas necesarias para leer el contenido.",
    },
    {
      title: "Hay una forma mejor de compartir secretos",
      paragraphs: [
        "No toda la información debe vivir para siempre. A veces solo necesitas enviar algo una vez. Ejemplos:",
        "En lugar de enviarlos directamente en un correo, usa un [enlace cifrado de un solo uso](blog:one-time-secret-links). El destinatario abre el enlace, lee el secreto y los datos cifrados se eliminan permanentemente. Para claves API en concreto, consulta nuestra guía sobre [cómo compartir una clave API de forma segura](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "El cifrado en el navegador marca la diferencia",
      paragraphs: [
        "En PrivateNote, el cifrado ocurre en tu navegador antes de subir nada. Tu navegador cifra el mensaje localmente. Solo el texto cifrado llega a nuestros servidores. La clave de descifrado nunca sale de tu dispositivo ni la almacenamos nosotros.",
        "Cuando el destinatario abre la nota, puede configurarse para autodestruirse tras la primera lectura exitosa o caducar automáticamente tras un periodo elegido. Eso significa que no queda un correo permanente con el secreto esperando ser descubierto años después. Puedes [enviar un mensaje secreto sin crear una cuenta](blog:send-secret-message-without-account) o leer [cómo funciona PrivateNote](app:how-it-works) para el modelo completo de cifrado.",
      ],
      callout:
        "La prueba práctica es simple: ¿puede el proveedor obtener la clave de descifrado o el texto plano? Si sí, el sistema no está realmente cifrado de extremo a extremo. El correo falla esa prueba por diseño.",
    },
    {
      title: "La herramienta adecuada para la información adecuada",
      paragraphs: [
        "El correo sigue siendo una de las tecnologías de comunicación más útiles jamás creadas. Es excelente para conversaciones, facturas, boletines y comunicación empresarial cotidiana.",
        "No es el lugar ideal para información que debería desaparecer una vez cumplido su propósito. Contraseñas, códigos de recuperación, claves API, documentos confidenciales y otra información sensible merecen un mecanismo de compartición diseñado con la privacidad en mente.",
        "**A veces el secreto más seguro es el que simplemente ya no existe.**",
      ],
    },
  ],
  ctaTitle: "Comparte un secreto sin dejarlo en la bandeja de nadie",
  ctaBody:
    "Crea una nota cifrada de un solo uso en tu navegador. Envía el enlace por correo si hace falta; el secreto en sí queda fuera del hilo.",
  ctaButton: "Probar PrivateNote ->",
};
