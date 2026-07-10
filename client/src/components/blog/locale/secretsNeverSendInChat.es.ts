import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatEs: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Desde Slack y Microsoft Teams hasta WhatsApp y Messenger, el chat se ha convertido en la forma predeterminada de intercambiar información. Es rápido, cómodo y mantiene a los equipos alineados. Por desgracia, también se ha convertido en un cementerio digital de datos muy sensibles—compartidos en un momento de conveniencia y luego olvidados.",
    "Muchas apps de chat modernas ofrecen fuerte [encriptación en tránsito](blog:encrypted-vs-secure-file-sharing) o incluso encriptación de extremo a extremo. La encriptación protege los mensajes mientras se mueven entre dispositivos. El problema mayor es lo que ocurre después. Una vez que un secreto entra en un chat, a menudo sigue siendo buscable durante meses o años en múltiples sistemas.",
    "Esa persistencia crea una huella digital sorprendentemente grande. La información sensible puede sobrevivir en el historial de chat buscable, copias de seguridad en la nube, exportaciones del espacio de trabajo, vistas previas de notificaciones, capturas de pantalla y dispositivos sincronizados.",
    "Según el [Informe de investigaciones de brechas de datos 2026 de Verizon](https://www.verizon.com/business/resources/reports/dbir/), **el 62 % de las brechas implica el elemento humano**—robo de credenciales, phishing, ingeniería social, uso indebido y errores simples. La tecnología por sí sola no puede prevenir estos incidentes si la información sensible se comparte sin cuidado.",
    "Un enfoque más seguro se apoya en un principio sencillo: **comparte información solo cuando haga falta y asegúrate de que desaparezca tras la primera visualización.** Ese es el modelo detrás de los [enlaces secretos de un solo uso](blog:one-time-secret-links)—y por qué PrivateNote trata la vida útil de la nota como parte de la seguridad, no como un detalle posterior.",
  ],
  chatScreenshotCaption:
    "Ejemplo ilustrativo: credenciales en texto plano pegadas en un chat de equipo permanecen en el historial del canal, copias de seguridad y búsqueda—mucho después de que la entrega haya terminado.",
  cheatSheetTitle: "Hoja de referencia rápida de seguridad",
  cheatSheetHeaders: ["Nunca envíes", "El riesgo", "Mejor enfoque"],
  cheatSheetRows: [
    {
      neverSend: "Contraseñas",
      risk: "Indexadas en historial de chat permanente y registros buscables.",
      better: "[Enlace de un solo uso encriptado en el navegador](blog:one-time-secret-links).",
    },
    {
      neverSend: "Códigos de recuperación",
      risk: "Evade de forma efectiva la autenticación multifactor de manera permanente.",
      better: "Gestor de contraseñas dedicado o [nota de un solo uso](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "Claves API",
      risk: "Un pegado accidental en un canal público compromete entornos de producción.",
      better: "[Nota segura autodestructiva](blog:privatenote-for-developers) con encriptación en el cliente.",
    },
    {
      neverSend: "Documentos",
      risk: "Deja copias persistentes repartidas en carpetas locales de descarga.",
      better: "[Transferencia temporal de archivos encriptada](app:secure-file-transfer) con acceso limitado.",
    },
  ],
  whyChatTitle: "Por qué el chat no es un gestor de secretos",
  whyChatParagraphs: [
    "Las plataformas de mensajería están diseñadas para comunicación, no para gestión de secretos. Su propósito es preservar conversaciones entre dispositivos, sincronizar historial, admitir búsqueda, crear copias de seguridad y mantener registros de colaboración.",
    "Esas mismas funciones se convierten en responsabilidad cuando se comparten credenciales o activos corporativos. La información sigue accesible mucho después de cumplir su propósito. Nuestro artículo sobre [textos laborales y descubrimiento legal](blog:workplace-texts-private-note) muestra cómo mensajes escritos con desenfado pueden sobrevivir a su contexto original durante años.",
    "Un secreto de un solo uso sigue un modelo distinto: haz la información disponible solo el breve tiempo que realmente se necesita—y luego elimina el acceso en el servidor por diseño.",
  ],
  lifetimeTitle: "Vida útil de los datos: chat tradicional frente a PrivateNote",
  lifetimeIntro:
    "La diferencia no es si un mensaje está encriptado en tránsito. Es si el secreto sigue existiendo en algún sitio después de haberse leído.",
  chatWorkflowLabel: "Flujo de chat tradicional",
  chatWorkflowSteps: ["Contraseña", "Slack / Teams", "Almacenada", "Buscable", "Copias de seguridad", "Años después"],
  chatWorkflowOutcome: "El secreto persiste en los sistemas",
  privateNoteWorkflowLabel: "Flujo de PrivateNote",
  privateNoteWorkflowSteps: [
    "Contraseña",
    "Encriptar en el navegador",
    "Enlace de un solo uso",
    "Vista",
    "Eliminada del servidor",
  ],
  privateNoteWorkflowOutcome: "Secreto eliminado tras la entrega",
  secretsTitle: "10 secretos que debes prohibir en tus apps de chat",
  secrets: [
    {
      title: "Contraseñas de cuenta",
      paragraphs: [
        'Todos lo hemos visto: «Oye, ¿cuál era otra vez la contraseña de la cuenta compartida de marketing?» seguido de una respuesta en texto plano. Aunque confíes plenamente en tu colega, esa contraseña queda indexada en el historial del espacio de trabajo, en caché local de la app y potencialmente visible en vistas previas de correo o notificaciones push.',
        "Si un atacante compromete ese historial de chat meses después, hereda acceso activo a tu cuenta.",
      ],
      instead:
        "Envía un [enlace de un solo uso encriptado en el navegador](blog:send-secret-message-without-account). Una vez que el destinatario lo abre y recupera la contraseña, el texto cifrado se elimina del servidor anfitrión. ¿Necesitas una contraseña fuerte antes? Usa nuestro [generador de contraseñas](app:password-generator).",
    },
    {
      title: "Códigos de recuperación de autenticación multifactor (MFA)",
      paragraphs: [
        "Al activar MFA, los servicios generan códigos de respaldo de emergencia. Como los usuarios temen perder el acceso, a menudo pegan estos códigos en un chat con un compañero—o se los envían a su propio espacio de chat personal.",
        "Los códigos de recuperación son claves maestras de respaldo. Tratarlos como texto casual anula por completo el propósito de imponer seguridad multifactor.",
      ],
      instead:
        "Guárdalos en un gestor de contraseñas dedicado. Si debes compartirlos durante una entrega de cuenta, usa una [nota temporal de una sola visualización](blog:one-time-secret-links) para que el secreto no quede almacenado permanentemente en el historial de chat.",
    },
    {
      title: "Claves API de producción",
      paragraphs: [
        "Los desarrolladores intercambian rutinariamente claves API, tokens de acceso o secretos de servicios en la nube por chat para depurar un problema rápido. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) detecta continuamente credenciales expuestas en repositorios públicos—evidencia de lo a menudo que los secretos se filtran por accidente.",
        "Un pegado accidental en el canal equivocado puede exponer clústeres de bases de datos en vivo o pipelines de facturación.",
      ],
      instead:
        "Enruta los tokens por una [nota encriptada en el cliente](blog:privatenote-for-developers) que caduca automáticamente tras haberse visualizado una vez.",
    },
    {
      title: "Claves privadas SSH",
      paragraphs: [
        "Tu clave privada es tu identidad para la infraestructura de servidores. Nunca debería existir dentro de una aplicación de mensajería. Copiar una clave privada significa que una copia vive ahora fuera de su entorno seguro previsto—y puede persistir en el historial de chat, copias de seguridad o en los dispositivos del destinatario.",
      ],
      instead:
        "Si una clave debe moverse de forma segura, usa una carga encriptada de una sola visualización que se elimina del servidor anfitrión tras la entrega.",
    },
    {
      title: "Enlaces de invitación y restablecimiento",
      paragraphs: [
        "La gente suelta constantemente enlaces temporales de incorporación y administrativos en canales de chat:",
      ],
      bullets: [
        "Enlaces de asignación de host de Zoom",
        "Tokens de acceso de moderador de Google Meet",
        "Invitaciones de incorporación de Stripe",
        "Invitaciones con privilegios de administrador",
        "URL de restablecimiento de contraseña",
      ],
      instead:
        "Entrega enlaces de incorporación de alto privilegio mediante una [nota de un solo uso](blog:one-time-secret-links) para que no puedan extraerse de registros históricos si quedan sin usar.",
    },
    {
      title: "Frases semilla de criptomonedas",
      paragraphs: [
        "Tu frase de recuperación de 12 o 24 palabras controla toda tu cartera. Si alguien compromete tu cuenta de chat años después, el rastreo automatizado puede escanear conversaciones históricas en busca de frases con formato de semilla. Si te roban la frase semilla, tus activos pueden perderse de forma permanente.",
      ],
      instead:
        "Evita transmitir frases semilla digitalmente por completo. Si una emergencia absoluta te obliga, usa una nota encriptada que impone eliminación inmediata al leerla para limitar la exposición.",
    },
    {
      title: "Credenciales de inicio de sesión temporales",
      paragraphs: [
        "Los helpdesks de TI comparten con frecuencia credenciales iniciales durante la incorporación de empleados. Aunque al usuario suele pedírsele cambiar la contraseña en el primer inicio de sesión, la credencial temporal sigue siendo buscable en el historial de chat. Si el usuario retrasa el cambio—o el sistema permite reutilizar la contraseña—ese mensaje sigue siendo una vulnerabilidad activa.",
      ],
      instead:
        "Entrega credenciales temporales mediante una [nota encriptada en el navegador](blog:send-secret-message-without-account) que caduca tras haberse visualizado.",
    },
    {
      title: "Información financiera y bancaria",
      paragraphs: [
        "Pegar IBAN corporativos, datos de transferencia bancaria, documentos fiscales o confirmaciones de pago en el chat parece inofensivo porque un IBAN por sí solo no es una contraseña. Sin embargo, cuando los atacantes combinan datos bancarios con conversaciones personales encontradas en el historial de chat, obtienen el contexto necesario para phishing convincente y ataques de fraude de facturas.",
      ],
      instead:
        "Separa los datos financieros de la conversación diaria. Compártelos por canales encriptados que eliminan el acceso en el momento en que se verifica la transacción.",
    },
    {
      title: "Escaneos de documentos personales",
      paragraphs: [
        "¿Necesitas enviar rápidamente una copia de tu pasaporte, carnet de conducir o contrato laboral a RR. HH.? Soltar ese PDF en una ventana de chat copia datos de identidad muy sensibles en copias de seguridad en la nube, galerías locales del teléfono y carpetas de escritorio sincronizadas.",
      ],
      instead:
        "Usa [transferencia segura de archivos](app:secure-file-transfer) con encriptación en el navegador—una descarga, y luego el archivo se purga del servidor de alojamiento según tus ajustes de acceso.",
    },
    {
      title: "Información empresarial confidencial",
      paragraphs: [
        "Presentaciones de estrategia interna, propuestas de precios no anunciadas, borradores legales y documentos de adquisición circulan constantemente por canales de equipo. Las filtraciones de datos no siempre vienen de hackers externos; a veces ocurren porque un empleado invita por accidente a un invitado externo a un canal con años de estrategia interna.",
      ],
      instead:
        "Comparte activos corporativos sensibles mediante notas encriptadas con fechas de caducidad automática estrictas y ventanas de acceso limitadas.",
    },
  ],
  lifespanTitle: "Los secretos tienen una vida útil",
  lifespanParagraphs: [
    "La encriptación protege los secretos en tránsito. **La caducidad los protege a lo largo del tiempo.** La mayoría de apps de chat ignoran por completo esa segunda parte.",
    "Cuando usas PrivateNote, cambias la postura de seguridad por diseño. En lugar de confiar en que los usuarios recuerden eliminar mensajes sensibles después, impones la vida útil del secreto. El destinatario lo lee una vez—y entonces desaparece del servidor.",
  ],
  lifespanBullets: [
    "**Sin huella permanente:** ningún historial de chat ni archivo buscable contiene el secreto en bruto.",
    "**Reducción del radio de explosión:** si un portátil o cuenta de chat se compromete después, no hay contraseñas antiguas en los registros para cosechar.",
    "**Mitigación del error humano:** el sistema minimiza los datos automáticamente, sin necesidad de recordar eliminar mensajes sensibles manualmente.",
  ],
  underHoodTitle: "Seguridad bajo el capó: cómo funciona PrivateNote",
  underHoodParagraphs: [
    "PrivateNote encripta tu mensaje directamente en tu navegador antes de subirlo. El servidor almacena solo texto cifrado. La clave de descifrado vive en el [fragmento de URL](blog:one-time-secret-links)—la parte después de `#`—que los navegadores no envían a los servidores web como parte de las solicitudes HTTP. El servidor nunca recibe la clave de descifrado.",
    "Una vez que la nota se abre según tus ajustes elegidos, el texto cifrado se elimina del servidor. Para contraseñas, claves API, códigos de recuperación y credenciales temporales, **limitar la vida útil de los datos es tan importante como encriptar los datos en sí.** Los chats preservan conversaciones. PrivateNote limita la vida útil de los secretos.",
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    {
      question: "¿Es seguro enviar contraseñas en Slack?",
      answer:
        "Slack encripta datos en tránsito y en reposo, pero las contraseñas permanecen en el historial de chat buscable hasta que se eliminen. Para credenciales temporales, una [nota de un solo uso encriptada en el navegador](blog:send-secret-message-without-account) reduce la exposición a largo plazo.",
    },
    {
      question: "¿Son seguros los mensajes de WhatsApp para contraseñas?",
      answer:
        "La encriptación de extremo a extremo protege los mensajes durante la transmisión, y los mensajes temporales pueden eliminarlos automáticamente tras un tiempo definido—pero los destinatarios aún pueden hacer capturas de pantalla, reenviar o respaldar el contenido antes de que desaparezca. Las contraseñas deberían compartirse idealmente solo el tiempo necesario—mediante un [enlace secreto de un solo uso](blog:one-time-secret-links), no un hilo de chat permanente.",
    },
    {
      question: "¿Es el correo más seguro que el chat para contraseñas?",
      answer:
        "No. El correo estándar carece de encriptación de extremo a extremo por defecto y pasa por múltiples servidores de correo. Una vez entregada, una contraseña permanece indefinidamente en bandejas de entrada, carpetas de enviados, cachés locales y copias de seguridad del proveedor.",
    },
    {
      question: "¿Qué es un secreto de un solo uso?",
      answer:
        "Un secreto de un solo uso es un mensaje que deja de estar disponible tras haberse visualizado una vez o tras un tiempo de caducidad definido—reduciendo copias persistentes en los sistemas. Consulta nuestra guía sobre [cómo funcionan los enlaces secretos de un solo uso](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Referencias",
  references: [
    "Verizon. 2026 Data Breach Investigations Report (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. 2026 Healthcare Data Breach Investigations Snapshot. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Comparte secretos sin dejar una huella con forma de chat",
  closingBody: [
    "El chat es excelente para coordinación. Es un mal almacén para credenciales, claves, códigos de recuperación y documentos que nunca debieron persistir.",
    "PrivateNote se construyó para el patrón opuesto: encriptar en el navegador, compartir un enlace y dejar que el secreto caduque cuando termine su trabajo—sin cuenta para el remitente, sin texto plano sentado en un archivo buscable durante años.",
  ],
  tagline: "Menos historial de chat. Menos metadatos. Más control sobre cuánto tiempo existe un secreto online.",
  relatedReading: "Lectura relacionada",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Envía contraseñas y notas privadas sin registrarte—encriptación en el navegador y enlaces con caducidad explicados.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Cómo funcionan los enlaces de lectura única, por qué importa el fragmento de URL y cuándo la efimeridad supera al correo o Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Por qué los registros escritos en correo y chat laboral crean riesgo a largo plazo—y cuándo encajan mejor las notas efímeras.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS frente a encriptación en el navegador—qué protege cada uno y por qué el servidor aún puede leer tus datos.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Crea contraseñas fuertes antes de compartirlas mediante un enlace de un solo uso.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Una base de seguridad práctica para contraseñas, autenticación y hábitos de compartición segura.",
    },
  ],
};
