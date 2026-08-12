import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesEs: BlogGuideArticleCopy = {
  heroAlt:
    "Vista del destinatario de una pantalla de revelación de PrivateNote con una advertencia clara de Abrir cuando esté listo antes del descifrado",
  heroCaption:
    "Revelar es intencional: el destinatario elige cuándo descifrar—y cuándo puede aplicarse la política de destrucción.",
  intro: [
    "Abrir una nota de un solo uso debe ser deliberado. Por eso PrivateNote muestra una puerta de **clic para revelar** con una advertencia explícita antes de que comience el descifrado.",
    "El enlace puede llegar pronto. El texto cifrado puede permanecer cifrado hasta que alguien esté listo. El descifrado y el consumo solo ocurren después de que el destinatario confirma **Revelar nota**, con un texto que deja clara la consecuencia: abrir solo cuando esté listo—esto no se puede deshacer.",
    "Esa pausa es deliberada. Reduce revelaciones accidentales por vistas previas del enlace, toques erróneos o abrir en el dispositivo equivocado antes de estar listo para consumir una nota de un solo uso.",
  ],
  sections: [
    {
      title: "Un paso de confirmación, no un desbloqueo programado",
      takeaway:
        "El destinatario elige cuándo revelar; el servidor no desbloquea la nota según un calendario.",
      paragraphs: [
        "Hoy no hay un interruptor de «desbloquear esta nota el martes a las 09:00» en el producto. En su lugar, PrivateNote separa la **entrega** de la **apertura**.",
        "Puede enviar el enlace cuando la coordinación lo requiera. El destinatario puede esperar hasta estar en una pantalla privada, tener listo cualquier código de verificación o frase secreta, y estar preparado para una apertura única. El secreto permanece sellado hasta esa acción consciente.",
        "Los controles de tiempo relacionados siguen importando: vida útil de la nota (cuánto tiempo funciona el enlace si nunca se abre) y ventanas de descarga de adjuntos (cuánto tiempo se pueden obtener los archivos tras abrir). Esos limitan la disponibilidad; el clic para revelar limita *cuándo empieza el descifrado*.",
      ],
    },
    {
      title: "Por qué las aperturas accidentales son caras",
      takeaway:
        "Las notas de un solo uso castigan por igual la curiosidad y los toques erróneos.",
      paragraphs: [
        "Si una nota está configurada para una sola vista, la primera revelación exitosa puede destruir el acceso posterior. Abrirla en la pantalla de bloqueo del teléfono, un portátil compartido o un café con Wi‑Fi público puede desperdiciar la única vista—o exponer el contenido en el lugar equivocado.",
        "La pantalla de revelación fuerza una pausa. Combinada con [códigos de verificación del destinatario](blog:recipient-verification-code-before-reveal), obtiene dos pasos deliberados antes de que aparezca el texto en claro.",
      ],
      calloutTitle: "Texto del producto, a propósito",
      callout:
        "«Ábrela solo cuando estés listo; esto no se puede deshacer.» no es relleno de marketing. Es el rail de seguridad para flujos de destrucción al abrir.",
    },
    {
      title: "Cómo funciona el flujo del destinatario",
      takeaway: "Llegar al enlace → verificar (opcional) → revelar → descifrar en local.",
      checklist: [
        "Abrir la URL completa de PrivateNote",
        "Introducir un código de verificación si el remitente lo exigió",
        "Leer la advertencia de revelación",
        "Pulsar Revelar nota solo cuando esté listo",
        "El descifrado ocurre en el navegador; después, seguir cualquier política de apertura/destrucción",
      ],
      paragraphsAfterChecklist: [
        "Los remitentes pueden reforzar la pausa con una instrucción clara: «Envío el enlace ahora; no lo reveles hasta que estemos en la llamada.» La pantalla de confirmación respalda esa instrucción, pero no programa ni impone técnicamente una hora futura de apertura.",
        "Para el modelo de un solo uso más amplio, consulte [enlaces secretos de un solo uso](blog:one-time-secret-links) y [cómo crear una nota privada](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Envíe una nota que el destinatario pueda guardar hasta estar listo para abrirla.",
        button: "Crear una nota privada",
      },
    },
    {
      title: "Controles de tiempo que combinan con revelar",
      takeaway:
        "Vida útil, límites de apertura y ventanas de archivos complementan la puerta de clic.",
      comparisonTable: {
        headers: ["Control", "Protege contra", "Uso típico"],
        rows: [
          [
            "Clic para revelar",
            "Descifrado accidental o prematuro",
            "Cualquier nota de un solo uso o de alta sensibilidad",
          ],
          [
            "Vida útil de la nota",
            "Enlaces sin abrir caducados",
            "«Si no abren en 24 h, eliminarla»",
          ],
          [
            "Límite de aperturas / vistas",
            "Acceso repetido tras la entrega",
            "Una vez (o un pequeño número fijo)",
          ],
          [
            "Ventana de descarga de adjuntos",
            "Re-descargas infinitas de archivos tras abrir",
            "15 minutos por defecto; más en planes elegibles",
          ],
        ],
      },
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Puedo programar que una nota se desbloquee en el futuro?",
          answer:
            "No como programación del servidor. Comparta el enlace pronto si hace falta y pida al destinatario que espere—el clic para revelar más la verificación opcional mantiene el contenido sellado hasta que confirme.",
        },
        {
          question: "¿La vista previa del enlace descifra la nota?",
          answer:
            "La confirmación de revelación es el paso intencional de descifrado. Los destinatarios no deben pulsar Revelar hasta estar listos para que se aplique la política de destrucción.",
        },
        {
          question: "¿Qué pasa si alguien abre el enlace por error?",
          answer:
            "Si se detiene antes de Revelar, puede poder volver más tarde (sujeto a la vida útil). Tras Revelar en una nota de un solo uso, el acceso posterior suele desaparecer—envíe una nota nueva si hace falta.",
        },
        {
          question: "¿Cómo se relaciona esto con las notificaciones por correo?",
          answer:
            "Las alertas de apertura y destrucción informan al remitente cuando cambia el estado. No incluyen el contenido del mensaje. Consulte [cómo saber cuándo se abrió un enlace secreto](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Conclusión",
      takeaway:
        "Revelar es una acción consciente, no una consecuencia automática de cargar un enlace.",
      paragraphs: [
        "El clic para revelar le permite enviar un enlace pronto sin descifrar la nota solo porque se cargó la página de destino.",
        "Combínelo con vidas útiles cortas, verificación cuando los canales son débiles e instrucciones claras al destinatario—y obtiene una revelación diferida práctica sin pretender que el producto pueda borrar una captura de pantalla a distancia.",
      ],
    },
  ],
  ctaTitle: "Deje que el destinatario revele solo cuando esté listo.",
  ctaBody:
    "PrivateNote mantiene el texto cifrado sellado hasta que el destinatario confirma la revelación—así las notas de un solo uso tienen menos probabilidad de quemarse por un toque accidental.",
  ctaButton: "Crear una nota con clic para revelar",
};
