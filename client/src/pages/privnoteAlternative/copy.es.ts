import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativeEs: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternativa a Privnote",
  eyebrow: "Alternativa a Privnote",
  heroTitleLine1: "Una alternativa privada a Privnote",
  heroTitleLine2: "para notas, contraseñas y archivos",
  heroBody:
    "PrivateNote conserva la sencillez de una nota que desaparece y añade el uso compartido de archivos cifrados, protección con contraseña, controles para el destinatario y herramientas para entregar información sensible.",
  primaryCta: "Crear una nota privada",
  secondaryCta: "Cómo funciona",
  trustLine: "Sin cuenta para notas de texto · Cifrado en el navegador · Se lee una vez",

  introHeading: "Si ya conoces Privnote",
  introBody:
    "Si buscas una alternativa a Privnote, PrivateNote sigue la misma idea: crear un enlace privado, compartirlo y hacer que el contenido caduque o desaparezca al abrirlo. El cifrado ocurre en el navegador antes de subir nada. Quien recibe abre el enlace y descifra en local. No necesita cuenta.",
  introBody2:
    "PrivateNote amplía ese flujo más allá de un mensaje de texto corto. Puedes compartir contraseñas, documentos, fotos, grabaciones de voz o vídeo y otros archivos en la misma entrega cifrada, con controles extra cuando la situación lo pide.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Ambos servicios están pensados para el uso compartido temporal. PrivateNote extiende la idea a archivos, medios, controles del destinatario y flujos de empresa.",
  compareFeatureColumn: "Función",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Sí",
  compareNo: "No se ofrece",
  comparePaid: "Starter y Business",
  compareRows: [
    { feature: "Notas autodestructivas", privnote: "yes", privatenote: "yes" },
    { feature: "El destinatario no necesita cuenta", privnote: "yes", privatenote: "yes" },
    { feature: "Protección con contraseña", privnote: "yes", privatenote: "yes" },
    { feature: "Archivos adjuntos cifrados", privnote: "no", privatenote: "yes" },
    { feature: "Varios archivos en un mismo enlace", privnote: "no", privatenote: "yes" },
    { feature: "Fotos, audio y vídeo", privnote: "no", privatenote: "yes" },
    { feature: "Avisos de apertura y destrucción", privnote: "yes", privatenote: "yes" },
    { feature: "Verificación del destinatario", privnote: "no", privatenote: "paid" },
    { feature: "Revelación programada", privnote: "no", privatenote: "paid" },
    {
      feature: "Imagen de marca en la página de apertura",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Herramientas para desarrolladores (CLI, MCP, extensiones)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Las funciones pueden cambiar. Comparación basada en información pública del producto en septiembre de 2026.",
  compareCta: "Probar PrivateNote",

  whyHeading: "¿Por qué buscar una alternativa a Privnote?",
  whyBody:
    "Privnote funciona bien cuando el requisito es simple: enviar una nota de texto temporal. El texto temporal es solo una de las formas en que viaja la información sensible.",
  whyBody2:
    "Puede que necesites enviar un PDF, compartir varios archivos, confirmar que se abrió un enlace, proteger el acceso con una contraseña o entregar documentos confidenciales sin dejarlos en el correo ordinario.",
  whyClose:
    "Ese es el problema que PrivateNote está pensado para resolver: una entrega segura, no solo un mensaje que desaparece.",

  passwordHeading: "Una alternativa a Privnote para compartir contraseñas",
  passwordBody:
    "Las contraseñas Wi-Fi, las claves API y los códigos de recuperación suelen viajar en el mismo correo o chat que explica para qué sirven. Eso puede dejar copias en el historial, dispositivos sincronizados y copias de seguridad.",
  passwordBody2:
    "PrivateNote pone la credencial detrás de un enlace cifrado aparte. Envías el contexto por el canal que ya usas, y el secreto en una nota temporal que puede caducar, autodestruirse al leerse y, si quieres, exigir una contraseña. Es una entrega, no un gestor de contraseñas.",
  passwordCta: "Compartir una contraseña de forma segura",
  passwordArticleLink: "Cómo compartir una contraseña de forma segura",

  filesHeading: "Envía archivos, no solo texto",
  filesBody:
    "Contratos, documentos de identidad, PDF financieros, archivos de configuración, fotos y archivos comprimidos suelen ser el contenido real. Una nota de texto que desaparece no puede llevarlos. PrivateNote mantiene la nota y sus adjuntos cifrados en la misma entrega segura, para que el mensaje y los archivos viajen juntos.",
  filesBody2:
    "Enviar archivos requiere una cuenta gratuita de PrivateNote para aplicar límites de almacenamiento y transferencia. Quien recibe sigue abriendo el enlace sin iniciar sesión. Tras la primera apertura, los adjuntos siguen disponibles durante una ventana limitada, no como una carpeta compartida permanente.",
  filesLimits:
    "Límites actuales: Free hasta {freeSize} por archivo y {freeCount} archivos por envío ({freeTransfers} envíos al mes). Starter hasta {starterSize} y {starterCount} archivos. Business hasta {businessSize} y {businessCount} archivos.",
  filesCta: "Enviar un archivo cifrado",
  filesArticleLink: "Enviar documentos sensibles de forma segura",

  mediaHeading: "Comparte fotos, audio y vídeo sensibles",
  mediaBody:
    "Hay información que nunca empieza como un archivo en el disco. Puede que fotografíes un documento, grabes un mensaje de voz corto o adjuntas una foto existente sin pasarla antes por otra app de mensajería.",
  mediaBody2:
    "PrivateNote puede hacer una foto, grabar audio o vídeo o adjuntar un medio existente. La captura ocurre en el navegador y, después, se aplica el mismo cifrado en el cliente que en los archivos, antes de subir nada.",
  mediaPhotoLink: "Cómo compartir fotos de forma segura",
  mediaVoiceLink: "Mensajes de voz cifrados",

  businessHeading: "Cuando una nota que desaparece se convierte en un flujo de empresa",
  businessBody:
    "El mismo enlace privado sirve cuando quien envía es un contable, un administrador de IT, un consultor o un despacho que entrega archivos confidenciales a un cliente. La necesidad no es solo el secreto. Es confirmación, control y una entrega profesional.",
  businessScenarios: [
    "Un contable envía cifras confidenciales a un cliente.",
    "Un administrador de IT envía credenciales a un empleado.",
    "Un despacho envía documentos de identidad o financieros a un cliente.",
    "Un consultor transfiere archivos de proyecto que no deberían quedarse en el correo.",
    "Una empresa necesita saber que se accedió a información sensible.",
  ],
  businessBody2:
    "Starter y Business añaden verificación del destinatario, revelación programada, prueba de acceso, ventanas de acceso más largas, revocación de notas no abiertas y un seguimiento de notas enviadas. Business añade páginas de apertura con tu imagen, acceso a archivos solo lectura y envíos más grandes. El cifrado sigue siendo en el navegador en todos los planes.",
  businessCta: "Descubrir PrivateNote Business",
  businessNotifyLink: "Saber cuándo se abrió un enlace secreto",
  businessVerifyLink: "Verificación del destinatario",

  securityHeading: "Cómo protege PrivateNote tu contenido",
  securityBody:
    "El contenido sensible se cifra en tu navegador antes de subirse. La infraestructura de PrivateNote almacena texto cifrado, no la nota o el archivo en claro.",
  securityArchitecture:
    "Para una nota estándar, el navegador genera una clave de cifrado aleatoria de 256 bits y usa cifrado autenticado AES-256-GCM. La clave de descifrado viaja en el fragmento de la URL — la parte después de #. Los navegadores no incluyen el fragmento en las peticiones HTTP normales, así que el servidor no recibe la clave como parte de la URL de la petición.",
  securityRecipient:
    "El navegador del destinatario usa la clave del enlace compartido para descifrar el contenido en local.",
  securityLimitation:
    "Quien más tarde tenga el enlace completo puede copiar o hacer una captura de lo que ve. PrivateNote controla la entrega, no lo que hace el destinatario después de abrirla.",
  securityFlowWrite: "Escribir / adjuntar",
  securityFlowEncrypt: "Cifrar en el navegador",
  securityFlowCiphertext: "Subir texto cifrado",
  securityFlowShare: "Compartir el enlace privado",
  securityFlowDecrypt: "El destinatario descifra",
  securityEncryptionLink: "Cómo funciona el cifrado de PrivateNote",
  securityHowItWorksLink: "Cómo funciona en detalle",
  founderHeading: "Pensado con la criptografía en mente",
  founderBody:
    "PrivateNote lo desarrolla Marjan Skrobot, investigador en criptografía y seguridad de la información. El modelo de seguridad y sus límites están documentados en público, incluido aquello contra lo que PrivateNote puede — y no puede — proteger.",
  founderLink: "Sobre el modelo de seguridad",

  decideHeading: "¿Cuál deberías usar?",
  decidePrivnoteTitle: "Privnote puede bastar si…",
  decidePrivnoteItems: [
    "Solo necesitas enviar una nota de texto temporal.",
    "Quieres el flujo más simple posible.",
    "No necesitas archivos adjuntos ni controles de entrega extra.",
  ],
  decidePrivateNoteTitle: "PrivateNote puede encajar mejor si…",
  decidePrivateNoteItems: [
    "Quieres un cifrado en el cliente documentado.",
    "Necesitas compartir archivos o medios además de texto.",
    "Necesitas verificación del destinatario o revelación programada.",
    "Quieres avisos de acceso o prueba de acceso.",
    "Necesitas imagen profesional o controles de entrega para empresa.",
  ],
  decideOneTimeLink: "Cómo funcionan los enlaces secretos de un solo uso",
  decideDevelopersLink: "Integraciones de desarrolladores",

  faqHeading: "Preguntas frecuentes",
  faqs: [
    {
      question: "¿Cuáles son algunas alternativas a Privnote?",
      answer:
        "Varios servicios ofrecen el uso compartido temporal o cifrado de notas. PrivateNote está pensado para quien quiere el flujo de una nota que desaparece, pero también necesita archivos cifrados, medios, controles del destinatario o funciones de entrega profesional.",
    },
    {
      question: "¿En qué se diferencia PrivateNote de Privnote?",
      answer:
        "Ambos crean un enlace privado temporal que el destinatario puede abrir sin cuenta. PrivateNote añade adjuntos cifrados, captura de foto y audio en el navegador, protección opcional con contraseña en el mismo flujo, y controles de pago como la verificación del destinatario y páginas de apertura con tu imagen. Privnote se centra en notas de texto autodestructivas.",
    },
    {
      question: "¿Puedo usar PrivateNote sin cuenta?",
      answer:
        "Sí. Puedes crear una nota de texto cifrada básica sin iniciar sesión. Quien recibe nunca necesita cuenta. Enviar archivos, fotos o grabaciones requiere una cuenta gratuita para aplicar los límites de almacenamiento y de envíos mensuales.",
    },
    {
      question: "¿Puedo enviar archivos con PrivateNote?",
      answer:
        "Sí. Adjunta uno o varios archivos a la misma nota cifrada. Los archivos se cifran en el navegador antes de subirlos. Enviar requiere una cuenta gratuita; abrir el enlace, no. Quien recibe puede descargar los adjuntos durante una ventana limitada tras la apertura.",
    },
    {
      question: "¿Puedo compartir contraseñas con PrivateNote?",
      answer:
        "Sí. Pon la contraseña en la nota y envía el enlace cifrado en lugar de la contraseña. Puedes añadir una contraseña aparte y acortar la caducidad. Después de usar una credencial importante, rótala. Una nota privada es una entrega, no un gestor de contraseñas.",
    },
    {
      question: "¿Cómo cifra PrivateNote las notas?",
      answer:
        "El navegador genera una clave aleatoria de 256 bits y cifra la nota con AES-256-GCM antes de subirla. La clave viaja en el fragmento de la URL — la parte después de # — que los navegadores no envían en una petición HTTP normal. Las notas protegidas con contraseña envuelven esa clave con Argon2id. Los archivos adjuntos también se cifran en el navegador.",
    },
    {
      question: "¿El destinatario necesita una cuenta de PrivateNote?",
      answer:
        "No. Quien recibe abre el enlace en un navegador y descifra el contenido en local. No inicia sesión. Cualquiera que tenga el enlace completo, y la contraseña si la hay, puede abrir la nota.",
    },
  ],

  finalHeading: "Comparte algo en privado.",
  finalBody: "Crea una nota cifrada o una entrega de archivo y envía el enlace a tu destinatario.",
  finalPrimaryCta: "Crear una nota privada",
  finalSecondaryCta: "Ver precios",
  finalTrust: "No hace falta cuenta para empezar.",
};
