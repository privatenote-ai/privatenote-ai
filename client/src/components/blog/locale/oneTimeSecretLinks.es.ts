import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksEs: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Un **enlace de un solo uso** es una URL para entregar información sensible sin dejar el texto en claro en el correo o en el historial de un chat. Quien lo recibe abre el enlace, revela el secreto en el navegador y la copia cifrada en el servidor deja de estar disponible según las reglas de acceso y caducidad.",
    "Sirve para contraseñas, claves API, códigos de recuperación, credenciales temporales y mensajes privados que tienen que llegar una vez y no necesitan una conversación permanente.",
    "El problema no siempre es la interceptación. Es la **retención**. El cifrado protege el acceso. Lo efímero reduce el tiempo que duran copias innecesarias. Un enlace de un solo uso cubre un tercer trabajo: la **entrega puntual**.",
  ],
  earlyCta: {
    body: "¿Necesitas enviar uno ahora?",
    linkLabel: "Crea un enlace cifrado de un solo uso con PrivateNote",
  },
  sections: [
    {
      title: "¿Qué es un enlace de un solo uso?",
      paragraphs: [
        "Hay varios nombres para la misma idea: enlace secreto, nota autodestructiva, enlace de un solo uso, enlace que caduca. La etiqueta cambia. Las propiedades de seguridad no vienen con el nombre.",
        "Que un producto se llame «secreto de un solo uso» no implica, por sí solo, que el cifrado ocurra en el navegador, que el proveedor no pueda descifrar el contenido, que la clave no llegue al servidor, que el borrado siga a la lectura o que desaparezcan los metadatos. Eso son decisiones de diseño. Evalúa las propiedades, no el eslogan.",
        "Una lista útil: ¿dónde se cifra el texto en claro? ¿El servidor recibe alguna vez la clave? ¿Qué ocurre después de la consulta prevista? ¿Cuánto tiempo sigue disponible un enlace sin usar? ¿Qué pide la vista previa de un chat si pegas la URL?",
      ],
    },
    {
      title: "¿Cómo funciona un enlace de un solo uso?",
      paragraphs: [
        "En un diseño del lado del cliente como el de PrivateNote, el secreto se cifra en el navegador de quien envía antes de subirlo. El servidor guarda texto cifrado. El navegador de quien recibe lo descifra en local. El texto de una nota usa AES-256-GCM a través de la API Web Crypto.",
      ],
      beforeFlowSteps: "**En la práctica, el recorrido completo es este:**",
      flowSteps: [
        {
          title: "Clave y cifrado en el navegador",
          step: "Paso 1: tu navegador",
          body: "Escribes el secreto en local. El navegador genera el material criptográfico y cifra el texto en claro antes de que salga ninguna petición de red.",
        },
        {
          title: "Solo se sube el texto cifrado",
          step: "Paso 2: el servidor",
          body: "Solo se envía la carga cifrada. El servidor guarda un texto que no puede leer, porque no recibe ni el claro ni la clave del fragmento.",
        },
        {
          title: "La clave se queda en el enlace",
          step: "Paso 3: la URL",
          body: "La clave de descifrado va en el fragmento de la URL—la parte después de #. La ruta pública identifica la nota; el fragmento se queda en el navegador en una navegación HTTPS habitual.",
        },
        {
          title: "Revelar, descifrar y aplicar las reglas de acceso",
          step: "Paso 4: quien recibe",
          body: "Abrir la página no basta. Hay que pulsar para revelar, y entonces se pide el texto cifrado. El navegador descifra en local. Tras una revelación correcta, PrivateNote aplica el límite de lecturas—una por defecto—y borra el texto cifrado cuando se alcanza. Los enlaces sin usar también caducan por tiempo.",
        },
      ],
      afterFlowSteps: [
        "No todos los productos vendidos como enlace de un solo uso siguen este modelo. Algunos cifran en el servidor después de recibir tu texto, o generan la clave allí, lo que permitiría al servicio leer el secreto. Otros borran según un calendario pero conservan copias recuperables. Pregunta si está el diseño completo—no solo si el enlace caduca.",
        "Para la arquitectura de cifrado de PrivateNote, incluido el envoltorio con contraseña mediante Argon2id, consulta [Cómo funciona](app:how-it-works).",
      ],
    },
    {
      title: "Por qué importa el fragmento de la URL",
      paragraphs: [
        "Este detalle se pasa por alto con facilidad, y es la base de esta arquitectura.",
        "En una navegación HTTPS normal, el navegador envía la ruta y la consulta al servidor. El [fragmento de URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—todo lo que va después de #—se queda en el navegador y no entra en esa petición. Un sistema bien planteado puede guardar el texto cifrado en un identificador como `/note/abc123` y dejar el material de descifrado en `#…`, fuera de los registros ordinarios de esa carga de página.",
        "Poner una clave detrás de # no hace segura una aplicación por sí sola. La criptografía de alrededor tiene que ser sólida: una clave aleatoria fuerte, cifrado autenticado y un servidor que nunca necesita el texto en claro. El fragmento sirve para separar esas piezas, no para saltárselas.",
      ],
    },
    {
      title: "Enlace de un solo uso, enlace que caduca y mensaje que desaparece",
      paragraphs: [
        "Estas ideas se mezclan a menudo. Son controles distintos, y un mismo producto puede combinarlos.",
      ],
      bullets: [
        {
          label: "Enlace de un solo uso",
          body: "La disponibilidad depende sobre todo del acceso. Tras la consulta prevista—en PrivateNote, una revelación correcta que llega al límite—la carga cifrada desaparece del servidor.",
        },
        {
          label: "Enlace que caduca",
          body: "La disponibilidad depende sobre todo del tiempo. El enlace se puede recuperar hasta que se acaba el plazo, se haya abierto o no.",
        },
        {
          label: "Mensaje que desaparece",
          body: "Forma parte de una conversación. La retención sigue la política del mensajero, que aún puede dejar copias de seguridad, citas o copias en el dispositivo.",
        },
      ],
      callout:
        "**PrivateNote combina acceso y tiempo.** Las notas nuevas empiezan con una revelación correcta y también caducan si nadie las abre—un día por defecto, con plazos más cortos o más largos según el plan. Es una entrega puntual: se recupera, o se espera, y la copia en el servidor desaparece.",
    },
    {
      title: "¿Son seguros los enlaces de un solo uso?",
      paragraphs: [
        "Pueden serlo. La seguridad depende de la implementación y de cómo se envía el enlace, no de la frase «de un solo uso».",
        "Un diseño serio debe tener en cuenta el cifrado en el cliente, claves aleatorias fuertes, lo que ve el servidor, la caducidad, el sentido del acceso, una contraseña opcional, una verificación opcional de quien recibe, los metadatos, la filtración del enlace, un dispositivo comprometido y lo que haga quien recibe.",
        "PrivateNote cifra en el navegador, guarda texto cifrado, deja la clave en el fragmento de la URL, limita por defecto a una revelación y caduca las notas sin usar. Puedes añadir una contraseña o, en planes de pago, verificación del destinatario. Quien recibe no necesita cuenta.",
        "Un enlace de un solo uso **no protege** frente a un dispositivo comprometido, alguien que copia el secreto después de verlo, una captura o una foto, o enviar la URL completa—incluido el fragmento—a la persona equivocada. Trata el enlace entero como la capacidad de acceso.",
      ],
    },
    {
      title: "¿Cuándo usar un enlace de un solo uso?",
      paragraphs: [
        "Cuando el secreto tiene un trabajo corto: llegar, usarse y dejar de vivir en el canal por el que lo enviaste.",
      ],
      subsections: [
        {
          title: "Contraseñas",
          paragraphs: [
            "Encaja bien para entregar una contraseña temporal o recién creada a una sola persona, sin dejar el texto en claro en el correo o el chat. Para el flujo concreto, consulta [cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Claves API y tokens",
          paragraphs: [
            "Quien desarrolla o colabora como contratista suele necesitar una clave una vez. Enviarla por un enlace evita dejar la credencial en hilos de Slack, tickets o comentarios de Git. Consulta [cómo compartir una clave API de forma segura](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Códigos de recuperación",
          paragraphs: [
            "Útil cuando un código de copia de seguridad o de recuperación 2FA tiene que llegar de verdad a otra persona autorizada—y no debe seguir siendo buscable en el hilo que lo llevó.",
          ],
        },
        {
          title: "Mensajes privados",
          paragraphs: [
            "Información que hay que comunicar una vez, sin convertirla en una conversación permanente. Quien recibe puede abrir la nota sin crear una cuenta. Consulta [enviar un mensaje secreto sin cuenta](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Archivos sensibles",
          paragraphs: [
            "Un archivo pide más cuidado: tamaño, descarga, vista previa y una ventana de acceso distinta después de abrir la nota. En PrivateNote, enviar un archivo exige cuenta de quien envía; abrirla, no. Los adjuntos siguen siendo recuperables durante una ventana limitada tras revelar—una hora por defecto. Usa la [transferencia segura de archivos](app:secure-file-transfer) cuando el contenido es un documento y no un secreto corto.",
          ],
        },
      ],
    },
    {
      title: "¿Cuándo no usarlo?",
      paragraphs: [
        "Es la herramienta equivocada cuando el trabajo es almacenar, colaborar o conservar un registro que estás obligado a guardar.",
      ],
      poorFits: [
        "Almacenar contraseñas a largo plazo: usa la caja fuerte de un gestor de contraseñas.",
        "Una conversación continua: usa un mensajero que ya compartáis, por ejemplo Signal.",
        "Archivos de la organización que hay que conservar por auditoría u obligación legal.",
        "Secretos que no hace falta transmitir: genéralos en el sitio o no los compartas.",
        "Frases semilla de criptomonedas y otros secretos maestros irrecuperables: un enlace aún puede filtrarse si se copia la URL completa. Lee [frases semilla cripto y enlaces de un solo uso](blog:crypto-seed-phrase-one-time-link) antes de usar este patrón ahí.",
      ],
    },
    {
      title: "Enlace de un solo uso frente a correo, mensajería y gestores de contraseñas",
      paragraphs: [
        "La comparación útil es el propósito y la persistencia, no un ranking de qué canal es «seguro».",
      ],
      comparisonTable: {
        headers: [
          "Medio",
          "Uso principal",
          "Cifrado de extremo a extremo",
          "Persistencia habitual",
          "¿Sirve para una entrega puntual?",
        ],
        rows: [
          [
            "Correo",
            "Correspondencia duradera",
            "El cifrado en tránsito es habitual; el de extremo a extremo no suele ser el valor por defecto",
            "Suele quedar en varias bandejas, copias de seguridad y búsquedas",
            "Mal encaje para un secreto en claro",
          ],
          [
            "Slack / Teams",
            "Conversación de trabajo y búsqueda",
            "Cifrado en tránsito y en reposo en la plataforma; no de extremo a extremo por defecto",
            "Historial del espacio de trabajo consultable y exportable",
            "Mal encaje para un secreto en claro; aceptable para enviar un enlace",
          ],
          [
            "SMS / iMessage",
            "Mensajería personal",
            "Varía mucho según operador y plataforma",
            "A menudo con copia de seguridad o sincronización en la nube",
            "Mal encaje para un secreto en claro",
          ],
          [
            "WhatsApp",
            "Conversación privada",
            "Extremo a extremo en los chats; las copias de seguridad pueden no serlo",
            "Copias en el dispositivo y, si se activa, en la nube",
            "Mejor que el correo para conversar; sigue siendo un mal sitio para dejar una contraseña",
          ],
          [
            "Signal",
            "Conversación privada",
            "Extremo a extremo",
            "Los mensajes que desaparecen se pueden configurar",
            "Una alternativa razonable si las dos partes ya lo usan",
          ],
          [
            "Gestor de contraseñas",
            "Almacenar y compartir credenciales",
            "Sí, por diseño",
            "Pensado para retención a largo plazo",
            "Excelente para equipos y acceso estable; a menudo más pesado que una entrega puntual",
          ],
          [
            "PrivateNote",
            "Entrega cifrada temporal",
            "Cifrado en el cliente; clave en el fragmento de la URL",
            "Límite de lecturas más caducidad; el texto cifrado se borra cuando se cumplen esas condiciones",
            "Diseñado para este uso",
          ],
        ],
      },
    },
    {
      title: "El problema de la vista previa del enlace",
      paragraphs: [
        "Muchas apps de chat piden una URL entrante para montar una vista previa: título, descripción, miniatura. Si cargar la página contara como una lectura, ese robot gastaría el enlace antes de que lo abriera quien lo recibe.",
        "PrivateNote no trata una carga de página como una lectura. La URL pública de la nota muestra una puerta de pulsar para revelar. Se pueden pedir metadatos de esa página sin devolver el texto en claro. El texto cifrado solo se obtiene tras una acción deliberada de revelar. Una vista previa de Slack, Teams o iMessage no recibe el secreto y no consume el límite de lecturas.",
        "Es una decisión de diseño del cliente y de la API, no una lista de agentes de usuario bloqueados. Sigue importando cómo envías el enlace: quien tenga la URL completa, fragmento incluido, y pulse Revelar, puede leer la nota. Para el aviso a quien recibe, consulta [por qué las notas esperan a un clic para revelarse](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Cómo crear un enlace de un solo uso",
      paragraphs: ["Quédate con los pasos cortos. La herramienta cifra; tú eliges las reglas de acceso."],
      numberedSteps: [
        { title: "Abre PrivateNote", body: "Usa el editor en el sitio: no hace falta cuenta para una nota de texto." },
        { title: "Escribe lo que necesitas compartir", body: "Una contraseña, un mensaje, una clave API o, con cuenta, un archivo." },
        {
          title: "Elige caducidad y acceso",
          body: "Prefiere la vida útil más corta que siga siendo práctica. Por defecto: una lectura y un día si nadie lo abre. Añade una contraseña o verificación del destinatario si la sensibilidad lo pide.",
        },
        { title: "Crea el enlace cifrado", body: "El navegador cifra primero y luego sube el texto cifrado." },
        { title: "Envía el enlace a quien corresponde", body: "No pegues el texto en claro al lado." },
      ],
      closingNote: "Cuando quieras, [crea un enlace de un solo uso](app:one-time-link).",
    },
    {
      title: "Antes de enviar un secreto",
      paragraphs: ["Una entrega cuidadosa es sobre todo operativa. La criptografía no corrige a la persona equivocada."],
      checklist: [
        "Confirma a quien recibe antes de enviar la URL completa.",
        "Usa la caducidad más corta que tenga sentido.",
        "Añade una contraseña o verificación del destinatario si la sensibilidad lo pide.",
        "Envía cualquier factor extra por otro canal.",
        "Rota las credenciales temporales después de usarlas.",
        "No transmitas secretos que no hace falta mover.",
        "Recuerda que quien recibe puede copiar, fotografiar o capturar lo que ve.",
      ],
    },
    {
      title: "Preguntas frecuentes",
      paragraphs: [],
      faqs: [
        {
          question: "¿Qué es un enlace de un solo uso?",
          answer:
            "Una URL que entrega un secreto para recuperarlo y luego deja inaccesible la copia cifrada en el servidor según reglas de acceso y caducidad, para que el texto en claro no tenga que vivir en el correo o el chat.",
        },
        {
          question: "¿Cómo enviar una contraseña de forma segura por un enlace?",
          answer:
            "Pon la contraseña en la nota, no en el mensaje que lleva el enlace. Consejos de canales separados en [cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely).",
        },
        {
          question: "¿Es más seguro que el correo?",
          answer:
            "Para el secreto en sí, sí, porque el correo conserva el texto en claro. El enlace puede viajar igual por correo; en la bandeja queda una URL, no la credencial.",
        },
        {
          question: "¿Qué pasa después de abrir el enlace?",
          answer:
            "En PrivateNote, una revelación correcta cuenta como una lectura. Con el límite por defecto de una lectura, el servidor borra después el texto cifrado. El contenido puede seguir visible en el navegador ya abierto. Los enlaces sin usar también caducan por tiempo.",
        },
        {
          question: "¿Hace falta una cuenta para abrirlo?",
          answer:
            "No. Quien tenga el enlace completo puede abrir una nota sin protección. Una contraseña o una verificación solo aplican si quien envía las activó.",
        },
        {
          question: "¿Se puede enviar un archivo con un enlace de un solo uso?",
          answer:
            "Sí, con la [transferencia segura de archivos](app:secure-file-transfer) de PrivateNote. Enviar exige una cuenta gratuita; abrir, no. Tras revelar, los adjuntos siguen una ventana de acceso distinta: una hora por defecto.",
        },
        {
          question: "¿Enlace de un solo uso o enlace que caduca?",
          answer:
            "De un solo uso habla del acceso: deja de estar disponible tras la consulta prevista. Que caduca habla del tiempo: deja de estar disponible al vencer el plazo, aunque nadie lo haya abierto. PrivateNote usa ambos.",
        },
        {
          question: "¿Se puede hacer una captura de pantalla de un secreto de un solo uso?",
          answer:
            "Sí. Lo que está en pantalla se puede copiar, fotografiar o capturar. Un enlace de un solo uso limita la copia original en el servidor; no es un DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Tipo de canal",
    encrypted: "¿Cifrado?",
    persistent: "¿Persistente?",
    verdict: "¿Sirve para un secreto puntual?",
  },
  goodFitsLabel: "Buenos encajes",
  poorFitsLabel: "Malos encajes",
  closingTitle: "Dónde encaja PrivateNote",
  closingBody:
    "PrivateNote es una herramienta de entrega. No es una caja fuerte de contraseñas a largo plazo, ni un wiki de equipo, ni un archivo de cumplimiento. Cifra en el navegador, comparte un enlace temporal y deja que la copia en el servidor caduque cuando el trabajo está hecho.",
  encryptLu: "",
  tagline: "Haz coincidir la vida del secreto con la del medio que lo transporta.",
  relatedReading: "Lecturas relacionadas",
  ctaTitle: "Crear un enlace de un solo uso",
  ctaBody: "Cifra un mensaje, una contraseña o un archivo en tu navegador y compártelo con un enlace temporal.",
  ctaButton: "Crear un enlace seguro",
};
