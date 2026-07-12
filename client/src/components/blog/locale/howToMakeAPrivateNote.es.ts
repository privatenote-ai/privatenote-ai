import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteEs: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Portátil en un escritorio mostrando la pantalla de creación de una nota privada con lectura única y caducidad, junto a un cuaderno de cuero cerrado con candado",
  intro: [
    "Quieres escribir algo sensible—una [contraseña](app:password-generator), un código de recuperación, un mensaje confidencial o una nota personal—y mantenerlo privado. Tal vez buscaste «how to make a note private» y encontraste consejos genéricos sobre bloquear una app, ocultar una carpeta local o activar un ajuste de privacidad del dispositivo.",
    "Esos pasos ayudan con la privacidad casual, frente a miradas indiscretas. **No** resuelven el problema más difícil: compartir una nota con otra persona sin dejar una copia permanente y buscable en el servidor de un tercero.",
    "Una nota verdaderamente privada requiere tres pilares distintos: **cifrado antes de subir**, **control de acceso estricto** y **ephemeralidad planificada**—un mecanismo para desaparecer. Así se logra en la práctica.",
  ],
  sections: [
    {
      title: "Qué significa realmente «privado»",
      paragraphs: [
        "En las aplicaciones cotidianas, «privado» suele significar oculto de otras personas físicas que tomen tu dispositivo, protegido por el código del teléfono o bloqueado tras una suscripción premium. Eso es muy útil—pero no es lo mismo que la privacidad criptográfica.",
        "Cuando compartes información sensible por la web, la pregunta real es: **¿quién puede leer la nota después de que sale de tus manos?**",
        "¿Puede leerla el proveedor del servicio? ¿Puede leerla alguien no autorizado que acceda a una copia de seguridad en la nube? ¿Puede un futuro compañero de equipo buscar en historiales de chat antiguos y encontrarla meses después?",
        "Una nota privada, en el sentido estricto de seguridad, es aquella en la que solo el destinatario previsto puede leer el contenido, el servicio de alojamiento nunca ve el texto en claro subyacente y la nota no permanece en línea para siempre.",
      ],
    },
    {
      title: "Por qué las apps de notas habituales se quedan cortas",
      paragraphs: [
        "Apple Notes, Google Keep, Notion y Evernote son herramientas excelentes para la organización personal, pero en general son la opción equivocada para distribuir secretos de un solo uso por varias características inherentes:",
      ],
      bullets: [
        "**Sincronización y copias de seguridad** — Tu nota se copia silenciosamente en varios dispositivos, cuentas de almacenamiento en la nube y archivos históricos a largo plazo que no controlas directamente.",
        "**Búsqueda y compartición** — Una compartición pública accidental, búsquedas amplias en el espacio de trabajo o una sola cuenta comprometida pueden exponer notas antiguas meses después.",
        "**Acceso del proveedor** — A menos que la app ofrezca explícitamente cifrado de extremo a extremo para esa nota concreta, el proveedor conserva la capacidad técnica de leer tu contenido en sus servidores.",
        "**Sin destrucción tras la lectura** — La mayoría de las apps de organización están diseñadas estructuralmente para almacenar información indefinidamente, no para eliminarla tras una sola lectura.",
      ],
      callout:
        "Para el diario personal a largo plazo, las apps de notas estándar son ideales. Para contraseñas, códigos de recuperación y entregas confidenciales, necesitas una herramienta efímera diseñada para la [entrega de secretos de un solo uso](blog:one-time-secret-links)—no para almacenamiento permanente.",
    },
    {
      title: "Cómo crear una nota privada: paso a paso",
      paragraphs: [
        "No necesitas registrar una cuenta para enviar una nota privada segura de un solo uso. El flujo estructurado a continuación describe lo que los servicios cifrados en el navegador están diseñados para ejecutar de forma segura.",
      ],
      flowDiagramCaption: "Flujo de trabajo de nota privada de un vistazo",
      flowSteps: [
        {
          step: "Paso 1",
          title: "Redacta el mensaje en tu navegador",
          body: "Abre [PrivateNote](app:home) y escribe tu mensaje directamente. ¿Ya estás en otra pestaña? La [extensión de Chrome](chrome:extension) cifra el texto seleccionado en el lugar—el mismo flujo del lado del cliente, sin abrir el sitio primero. Evita pegar el secreto en bruto en clientes de correo estándar o hilos de texto sin cifrar de antemano. También puedes usar [Write with Private AI](app:home) para redactar localmente en tu dispositivo antes del cifrado.",
        },
        {
          step: "Paso 2",
          title: "Configura tus ajustes de privacidad efímera",
          body: "Establece una ventana de expiración acorde a la tarea. Activa la destrucción tras la lectura si la nota debe desaparecer por completo tras la primera apertura exitosa, y añade una frase de contraseña opcional para contenido muy sensible.",
        },
        {
          step: "Paso 3",
          title: "Deja que el navegador ejecute el cifrado local",
          body: "Al hacer clic en crear, el cifrado ocurre íntegramente en el cliente. Solo se sube texto cifrado. La clave de descifrado permanece incrustada en el fragmento de URL—la parte tras `#`—que los navegadores web modernos no transmiten a los servidores de alojamiento.",
        },
        {
          step: "Paso 4",
          title: "Aísla tus canales de compartición",
          body: "Transmite el enlace seguro generado a tu destinatario por tu canal preferido. Si configuraste una contraseña manual, compártela por un canal separado—por llamada telefónica, Signal o en persona de forma segura.",
        },
        {
          step: "Paso 5",
          title: "Confirma la entrega y borra el estado local",
          body: "Usa notificaciones de entrega opcionales para verificar cuándo se abrió o expiró la nota con éxito. Una vez consumida, no queda ninguna copia en texto claro en tu bandeja de salida ni en los registros históricos de chat.",
        },
      ],
    },
    {
      title: "Ajustes de privacidad que merece la pena activar",
      paragraphs: [
        "Pequeños ajustes arquitectónicos producen enormes ganancias de seguridad. Al crear una nota efímera, maximiza tus defensas utilizando estas configuraciones:",
      ],
      bullets: [
        "**Destrucción tras la lectura** — El estándar de oro para contraseñas y credenciales. El texto cifrado subyacente se elimina del servidor en el momento en que se lee una vez con éxito.",
        "**Ventanas de expiración cortas** — Si tu destinatario no necesita abrir los datos al instante, limita la ventana de exposición a horas o días—nunca la dejes abierta indefinidamente.",
        "**Contraseñas en capas** — Añade un segundo factor crucial. Un atacante necesitaría comprometer tanto el canal de transporte del enlace como obtener la contraseña separada para leer el contenido.",
      ],
    },
    {
      title: "Qué no poner en una nota privada basada en la web",
      paragraphs: [
        "Los enlaces cifrados en el navegador son excelentes para secretos temporales o reemplazables—como credenciales Wi‑Fi, tokens de API y mensajes corporativos. Tienen límites.",
      ],
      callout:
        "**Regla de seguridad crítica:** Nunca escribas una frase semilla de criptomoneda, una copia de seguridad maestra de hardware wallet ni una clave privada raíz en ningún sitio web. Los activos maestros irremplazables justifican el cifrado local basado en terminal con age u OpenSSL antes de la transmisión. Para esa arquitectura, lee [frases semilla cripto y enlaces de un solo uso](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Cuándo una nota privada es la herramienta adecuada",
      paragraphs: [
        "Recurre a una nota privada dedicada en lugar de correo o chat estándar cuando entregues información sensible:",
      ],
      table: [
        {
          dataType: "Credenciales",
          scenario:
            "Pasar una [contraseña o código de recuperación](blog:how-we-generate-passwords) a un familiar o colega de confianza.",
        },
        {
          dataType: "Claves de acceso",
          scenario:
            "Distribuir una [clave de API o secreto de firma de webhook](blog:how-to-share-api-key-securely) durante la incorporación de desarrolladores.",
        },
        {
          dataType: "Acceso físico",
          scenario:
            "Compartir códigos de puerta temporales, PIN de alarma o credenciales Wi‑Fi de invitados.",
        },
        {
          dataType: "Comunicaciones corporativas",
          scenario:
            "Enviar un mensaje empresarial confidencial que no deba indexarse en [archivos de chat o correo empresarial](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Nuestra filosofía en PrivateNote",
      paragraphs: [
        "Diseñamos PrivateNote para devolver el equilibrio de confianza al usuario. Al realizar las operaciones criptográficas íntegramente en tu navegador antes de que la carga llegue a nuestra infraestructura, nuestros servidores permanecen estructuralmente ciegos a tus secretos en texto claro.",
        "También creemos en una transparencia clara sobre las limitaciones del producto. Si envías un token de acceso temporal a un colega, un enlace cifrado de un solo uso es una herramienta excelente. Si tratas con tus ahorros de toda la vida, cifra primero de forma local en una máquina sin conexión.",
        "La seguridad no consiste en encontrar una herramienta mágica para todo. Consiste en adaptar tu flujo de trabajo al valor de lo que proteges. Para el modelo técnico detrás del cifrado en el navegador, lee [cómo funciona PrivateNote](app:how-it-works) y [qué significa el cifrado de extremo a extremo del lado del cliente](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Tipo de dato",
    scenario: "Escenario ideal de compartición",
  },
  closingTitle: "Crea una nota privada ahora",
  closingBody: [
    "No se requiere cuenta. Escribe tu nota, configura tus ajustes de privacidad y comparte un enlace seguro en menos de un minuto.",
  ],
  fileSharingNote:
    "¿También necesitas compartir documentos? [Transferencia segura de archivos](app:secure-file-transfer) usa el mismo modelo de cifrado en el navegador. Enviar requiere una cuenta gratuita; los destinatarios pueden abrir enlaces sin registrarse.",
  chromeExtensionNote:
    "¿Usas PrivateNote a menudo? La [extensión de Chrome](chrome:extension) añade cifrar y compartir a tu barra de herramientas o menú contextual—útil cuando aparece una contraseña o clave API en medio de una conversación.",
  tagline: "Cifra primero. Comparte un enlace. Deja que expire.",
  relatedReading: "Lecturas relacionadas",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Enlaces de destrucción tras la lectura, el fragmento de URL y por qué la ephemeralidad supera al correo o Slack para secretos de un solo uso.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Por qué el correo crea copias duraderas de secretos—y qué usar en su lugar para entregas confidenciales.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Un flujo más seguro para claves de API: limitar el alcance, cifrar localmente, enviar el enlace—no el secreto en bruto.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Qué significa realmente la E2EE del lado del cliente y cómo difiere de la seguridad de transporte por sí sola.",
    },
  ],
};
