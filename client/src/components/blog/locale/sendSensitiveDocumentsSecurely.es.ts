import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyEs: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Concepto de transferencia segura de documentos: un sobre sellado y una entrega de archivo cifrado sobre un escritorio tranquilo",
  heroCaption:
    "La parte difícil casi nunca es el botón de enviar. Es lo que sucede con cada copia después de que el documento llega.",
  intro: [
    "Imagina que necesitas enviar tu pasaporte a un banco, tu contador te pide documentos fiscales, tu empleador solicita una prueba de identidad, o un cliente necesita un contrato firmado.",
    "La tarea en sí toma solo unos segundos: adjuntar el archivo, hacer clic en Enviar, seguir con el día. La transferencia rara vez es la parte más débil del proceso. El verdadero problema comienza después de que el documento llega.",
    "Ese archivo adjunto puede permanecer en bandejas de entrada, copias de seguridad en la nube, dispositivos sincronizados, buzones archivados y viejas conversaciones de chat durante años. En muchas situaciones, el mayor riesgo para la privacidad no es la interceptación en tránsito, sino que las copias siguen existiendo mucho después de que el documento ha cumplido su propósito.",
    "Esta guía explica por qué el intercambio tradicional de documentos suele fallar, qué significa realmente el intercambio seguro de documentos, y cómo [el cifrado en el navegador](blog:encrypted-vs-secure-file-sharing) y [los enlaces de un solo uso](blog:one-time-secret-links) te ayudan a mantener privada la información confidencial.",
  ],
  sections: [
    {
      title: "Por qué los documentos confidenciales merecen un trato diferente",
      takeaway:
        "Si un documento sería difícil de reemplazar—o doloroso si se filtra—no lo trates como una foto de vacaciones.",
      paragraphs: [
        "No todos los archivos merecen el mismo nivel de protección. Perder una foto de vacaciones en línea puede ser decepcionante. Perder un documento confidencial puede tener consecuencias que duran años.",
        "Los documentos de identidad suelen contener tu nombre completo, fecha de nacimiento, número de identificación, nacionalidad, firma y fotografía. Los registros financieros revelan ingresos, ahorros, información fiscal o datos bancarios. Los documentos médicos contienen información profundamente personal, mientras que los contratos suelen incluir detalles comercialmente sensibles que nunca debían hacerse públicos.",
        "Si alguien descubre tu contraseña, la cambias. Si alguien copia tu pasaporte, tu documento nacional de identidad, tu declaración de impuestos o tu contrato laboral, la situación es mucho más complicada. Por eso los documentos confidenciales merecen un enfoque diferente al de la comunicación cotidiana.",
      ],
    },
    {
      title: "El problema oculto del correo electrónico",
      takeaway: "TLS protege el trayecto; no impide que se acumulen copias permanentes después.",
      paragraphs: [
        "El correo electrónico sigue siendo una de las herramientas de comunicación más útiles jamás creadas. Nunca fue diseñado como un sistema seguro de entrega de documentos.",
        "Los proveedores de correo modernos protegen los mensajes en tránsito con conexiones cifradas como TLS. Una vez que el mensaje llega, el archivo adjunto suele almacenarse para poder buscarse, sincronizarse, filtrarse, respaldarse y recuperarse más tarde.",
        "Un solo archivo adjunto se convierte rápidamente en varias copias: tu carpeta de Enviados, la bandeja de entrada del destinatario, teléfonos, portátiles, archivos corporativos, copias de seguridad en la nube y, a veces, sistemas de reenvío automático. Borrar el correo después rara vez elimina todas las copias.",
        "Para conversaciones cotidianas, esto suele ser aceptable. Para pasaportes, contratos, estados financieros o informes médicos, a menudo no lo es. Para profundizar en por qué el correo es un mal lugar para guardar secretos, consulta [por qué el correo es el peor lugar para los secretos](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Por qué las apps de mensajería dejan un rastro permanente",
      takeaway: "El chat facilita la colaboración—y hace que la retención de documentos sea accidental.",
      paragraphs: [
        "Muchas personas evitan el correo y en su lugar envían documentos confidenciales por Slack, Microsoft Teams, WhatsApp, Signal, Telegram o Discord. Estas plataformas resuelven la colaboración. No resuelven la gestión del ciclo de vida de los documentos.",
        "Los archivos compartidos en chat a menudo permanecen buscables durante meses o años, se sincronizan entre dispositivos, entran en copias de seguridad automáticas y se descargan en ordenadores personales. Incluso después de que la conversación se olvida, los documentos a menudo permanecen.",
        "El mayor riesgo para la privacidad no suele ser la interceptación por parte de hackers. Es que la información confidencial acumula silenciosamente copias que nadie pretendía conservar. El mismo patrón aparece cuando los equipos [pegan secretos en el chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "El almacenamiento en la nube resuelve un problema distinto",
      takeaway:
        "Los discos en la nube están hechos para el acceso duradero; la entrega temporal necesita caducidad desde el diseño.",
      paragraphs: [
        "Servicios como Google Drive, OneDrive, Dropbox e iCloud son excelentes para la colaboración, las copias de seguridad y el almacenamiento a largo plazo. La entrega segura de documentos es un problema distinto.",
        "Si varios compañeros necesitan acceso continuo a los mismos archivos, el almacenamiento en la nube es la herramienta adecuada. Si simplemente quieres que una persona reciba hoy un documento confidencial—y ya no necesitas que esté disponible el mes próximo—, los requisitos son completamente diferentes.",
        "Los enlaces de compartición permanentes a menudo quedan en el historial del navegador, correos antiguos, documentos de proyecto, mensajes de chat y marcadores mucho después de que todos supongan que han desaparecido. El almacenamiento en la nube optimiza la disponibilidad a largo plazo, no la entrega temporal.",
      ],
    },
    {
      title: "El intercambio seguro de documentos es más que cifrado",
      takeaway: "El cifrado protege los bits; los controles de ciclo de vida deciden cuánto dura la exposición.",
      paragraphs: [
        "Cuando la gente oye «intercambio seguro de documentos», a menudo piensa solo en el cifrado. El cifrado es esencial. No es toda la historia.",
        "El intercambio seguro consiste en reducir la exposición innecesaria durante toda la vida de un documento. Un sistema bien diseñado debería responder: ¿Solo puede acceder al documento el destinatario previsto? ¿Caduca el acceso automáticamente? ¿Se evitan copias innecesarias? ¿Recibe el servicio el documento original o solo datos cifrados?",
        "La seguridad no consiste solo en proteger un archivo en tránsito. Consiste en limitar quién puede acceder a él—y durante cuánto tiempo.",
      ],
    },
    {
      title: "Correo electrónico frente a enlace cifrado de un solo uso",
      takeaway:
        "El correo está hecho para conservar mensajes; los enlaces cifrados de un solo uso están hechos para entregar un documento y luego dejar de conservarlo.",
      comparisonTable: {
        headers: ["", "Adjunto de correo", "Enlace cifrado de un solo uso"],
        rows: [
          ["Facilidad de envío", "Muy alta", "Alta"],
          [
            "Copias creadas",
            "Muchas (enviados, bandeja de entrada, dispositivos, copias de seguridad)",
            "Muchas menos por diseño",
          ],
          ["Duración del acceso", "A menudo indefinida", "Caduca o se autodestruye tras el uso"],
          [
            "Qué ve el servicio",
            "Normalmente el archivo original",
            "Texto cifrado si se cifró primero en el navegador",
          ],
          [
            "Ideal para",
            "Correo cotidiano no sensible",
            "Pasaportes, contratos, documentos fiscales y de identidad",
          ],
        ],
        after: [
          "**Línea resumen:** Adjunto de correo = envío fácil, copias que pueden durar años. Enlace cifrado de un solo uso = cifrado en el navegador antes de subir, acceso que caduca, muchas menos copias sobrantes.",
        ],
      },
    },
    {
      title: "El cifrado en el navegador reduce la confianza necesaria",
      takeaway: "Cifra antes de subir para que el servicio almacene texto cifrado—no tu documento original.",
      paragraphs: [
        "Las plataformas tradicionales de compartición de archivos generalmente reciben tu documento original antes de almacenarlo o procesarlo. El cifrado basado en el navegador funciona de forma diferente.",
        "Antes de que el archivo salga de tu ordenador, tu navegador lo cifra localmente. El servicio almacena texto cifrado en lugar del documento original. Sin la clave de descifrado correspondiente, los datos almacenados son ininteligibles.",
        "En lugar de depender por completo del proveedor después de que reciba tu documento, reduces desde el principio la información disponible para el proveedor. La guía de PrivateNote sobre [cifrado frente a intercambio seguro de archivos](blog:encrypted-vs-secure-file-sharing) explica este modelo con más detalle.",
      ],
    },
    {
      title: "Los enlaces de un solo uso reducen la exposición a largo plazo",
      takeaway: "La mayoría de las filtraciones son accesos que quedaron sobrando—no piratería de película.",
      paragraphs: [
        "Muchas filtraciones de documentos ocurren porque documentos antiguos siguen existiendo: adjuntos de correo en bandejas de entrada, enlaces en la nube que todavía funcionan, historiales de chat que conservan archivos viejos.",
        "Los enlaces de un solo uso adoptan un enfoque distinto. El destinatario recupera el documento una vez. Después, los datos cifrados se eliminan o el enlace de compartición caduca de forma permanente.",
        "Ninguna carpeta compartida olvidada. Ningún enlace de descarga de años de antigüedad. Ningún documento confidencial esperando en silencio a ser descubierto.",
        "Ninguna tecnología puede impedir que un destinatario autorizado guarde intencionadamente una copia después de abrir el documento. Lo que el intercambio de un solo uso sí logra es eliminar muchas de las copias innecesarias que crean las herramientas tradicionales.",
      ],
      calloutTitle: "Regla general",
      callout:
        "Si no te sentirías cómodo publicando un documento en un sitio web público, piénsalo bien antes de enviarlo como adjunto permanente de correo.",
    },
    {
      title: "Una capa adicional: intercambio protegido con contraseña",
      takeaway: "Separa el enlace de la contraseña para que un solo error no exponga ambos.",
      paragraphs: [
        "A veces incluso el enlace de compartición merece protección—un correo reenviado por accidente, historial de navegador visible o una cuenta de mensajería comprometida.",
        "Añadir una contraseña crea otra capa. Aunque alguien descubra el enlace de compartición, aún no podrá descifrar el documento sin la contraseña.",
        "Para información especialmente sensible, comunica la contraseña por un canal distinto—teléfono o en persona—en lugar de en el mismo mensaje que el enlace. El mismo patrón se aplica cuando [compartes una contraseña de forma segura](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "El intercambio seguro de documentos en Europa y más allá",
      takeaway: "El RGPD no nombra ningún producto—pero limitar el acceso y la retención concuerda con su espíritu.",
      paragraphs: [
        "En toda Europa, las organizaciones procesan información personal conforme al RGPD. No exige un servicio de compartición de archivos específico, pero sí exige medidas técnicas y organizativas adecuadas según el riesgo.",
        "El intercambio cifrado, la disponibilidad limitada y menos copias innecesarias son ejemplos prácticos de esos principios. Las mismas ideas se aplican tanto si envías documentos a un contador, un empleador, un abogado, una universidad, un proveedor de salud, un banco, una aseguradora o una autoridad pública.",
      ],
    },
    {
      title: "¿Cuándo deberías usar el intercambio seguro de documentos?",
      takeaway: "Si importara que este documento se hiciera público, no lo envíes como adjunto permanente.",
      paragraphs: [
        "Esto incluye pasaportes, documentos nacionales de identidad, carnés de conducir, registros financieros, documentos fiscales, solicitudes de hipoteca, contratos laborales, documentación de seguros, acuerdos legales, informes médicos, información empresarial confidencial, datos de investigación, información de clientes y propiedad intelectual.",
        "Cuanto más difícil sería reemplazar un documento—o mayores las consecuencias de su exposición—, con más cuidado debería compartirse.",
      ],
    },
    {
      title: "Formas prácticas de reducir el riesgo",
      takeaway: "La seguridad perfecta no existe; menos copias y un acceso más corto casi siempre ayudan.",
      paragraphs: [
        "Antes de enviar un documento confidencial, revisa esta breve lista de verificación:",
      ],
      checklist: [
        "Verifica al destinatario—persona correcta, dirección o canal correctos",
        "Envía solo lo necesario—las páginas requeridas, no todo el paquete cuando sea posible",
        "Usa un enlace caducable o de un solo uso—no un adjunto permanente",
        "Añade una contraseña para archivos muy sensibles—y compártela por un canal separado",
        "Confirma la entrega y luego limpia—elimina las copias locales y de bandeja de entrada que ya no necesites",
      ],
      paragraphsAfterChecklist: [
        "Reducir el número de copias es una de las mejoras de privacidad más simples y efectivas que cualquiera puede hacer.",
      ],
      midCta: {
        body: "¿Listo para enviar un escaneo de pasaporte, un contrato o un archivo fiscal sin dejar un rastro permanente en el correo?",
        button: "Iniciar una transferencia de archivo segura",
      },
    },
    {
      title: "Preguntas frecuentes",
      takeaway: "El cifrado ayuda; la caducidad y menos copias terminan el trabajo.",
      faqs: [
        {
          question: "¿Basta con proteger un PDF con contraseña?",
          answer:
            "Ayuda, pero no resuelve el problema de la persistencia. El PDF cifrado puede seguir existiendo durante años en archivos de correo, copias de seguridad en la nube y descargas. Combina el cifrado con una entrega caducable o de un solo uso.",
        },
        {
          question: "¿No es HTTPS ya seguro?",
          answer:
            "HTTPS protege los datos en tránsito. No necesariamente impide que el servicio receptor acceda al archivo o lo almacene después. El cifrado basado en el navegador cifra antes de subir.",
        },
        {
          question: "¿Qué pasa con los archivos ZIP cifrados?",
          answer:
            "Es razonable si usas cifrado fuerte y comunicas la contraseña por separado—pero igualmente dejan archivos permanentes en los sistemas de correo, salvo que el método de compartición también limite cuánto tiempo permanece disponible el archivo.",
        },
        {
          question: "¿Puede el intercambio seguro impedir que el destinatario guarde el documento?",
          answer:
            "No. Una vez que alguien recibe legítimamente un documento, puede guardarlo, imprimirlo o fotografiar la pantalla. El intercambio seguro reduce la exposición innecesaria antes y después de la entrega; no puede impedir acciones intencionadas de destinatarios de confianza.",
        },
      ],
    },
    {
      title: "Compartir documentos confidenciales con PrivateNote",
      takeaway:
        "PrivateNote está construido para la entrega temporal de documentos cifrados—no para el almacenamiento permanente en la nube.",
      paragraphs: [
        "PrivateNote se diseñó a partir de una observación sencilla: muchos documentos confidenciales solo necesitan existir en línea el tiempo suficiente para que un único destinatario los recupere.",
        "En lugar de tratar el intercambio de documentos como almacenamiento permanente, PrivateNote cifra los archivos en tu navegador antes de subirlos y solo almacena el texto cifrado resultante. Puedes elegir caducidad automática, crear enlaces de un solo uso y, cuando sea apropiado, proteger el documento con una contraseña adicional mediante [transferencia segura de archivos](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Lo que hace PrivateNote", "Lo que no hace"],
        rows: [
          [
            "Cifra en tu navegador antes de subir",
            "Leer tu documento original en el servidor",
          ],
          [
            "Usa claves criptográficas separadas para el texto de la nota, los archivos y los metadatos",
            "Mezclar esos aspectos bajo una sola clave reutilizable",
          ],
          [
            "Usa cifrado autenticado AES-256-GCM, con políticas (caducidad / límites de acceso) vinculadas al texto cifrado",
            "Confiar en un «cifrado» que ignora quién puede abrir la nota o durante cuánto tiempo",
          ],
          [
            "Admite enlaces de un solo uso y caducables para limitar el acceso sobrante",
            "Mantener los documentos disponibles indefinidamente por defecto, por comodidad",
          ],
          [
            "Te permite añadir una contraseña opcional como segundo factor para el enlace",
            "Impedir que un destinatario autorizado lo guarde o lo imprima después de abrirlo",
          ],
          [
            "Reduce las copias en línea innecesarias antes y después de la entrega",
            "Sustituir el proceso organizativo, el criterio del destinatario o el almacenamiento seguro a largo plazo",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Este enfoque no puede impedir que un destinatario autorizado guarde una copia después de abrir el documento—ninguna tecnología puede. Lo que sí reduce es el número de copias innecesarias que permanecen en línea antes y después de la entrega.",
      ],
    },
    {
      title: "Reflexiones finales",
      takeaway:
        "El mejor control suele ser la vida más corta—solo las personas que lo necesitan, solo mientras lo necesitan.",
      paragraphs: [
        "Internet ha hecho que compartir documentos sea casi sin esfuerzo. También ha hecho que conservarlos para siempre sea notablemente fácil.",
        "La mayoría de los documentos confidenciales no necesitan permanecer accesibles durante meses o años. Simplemente necesitan llegar de forma segura al destinatario previsto.",
        "Elegir un método que cifre antes de subir, limite las copias innecesarias y elimine los datos una vez que han cumplido su propósito es una de las formas más simples de mejorar la privacidad—sin hacer mucho más difícil el intercambio cotidiano de documentos.",
        "La medida de seguridad más fuerte no siempre es la criptografía más sofisticada. A veces basta con asegurarse de que un documento confidencial exista solo para las personas que lo necesitan, y solo durante el tiempo que lo necesitan.",
      ],
    },
  ],
  ctaTitle: "Envía el documento. Mantén las copias bajo control.",
  ctaBody:
    "Cifra un archivo en tu navegador, establece una caducidad o apertura única, y comparte un enlace—no un adjunto permanente que vivirá para siempre en la bandeja de entrada de alguien.",
  ctaButton: "Transferir un archivo de forma segura",
};
