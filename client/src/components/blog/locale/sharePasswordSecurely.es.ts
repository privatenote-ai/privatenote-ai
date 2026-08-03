import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyEs: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Portátil en un escritorio mostrando un enlace seguro de PrivateNote.ai listo para copiar, con caducidad de una vista y frase de contraseña activadas",
  heroCaption:
    "Comparta un enlace seguro—no la contraseña en sí—con caducidad corta, visualización única y una frase de contraseña opcional.",
  intro: [
    "Compartir una contraseña parece una tarea menor y cotidiana—hasta que algo sale mal.",
    "Ya sea que un compañero necesite acceso temporal a una herramienta interna, que el soporte al cliente pida acceso al sistema, o que deba enviar las credenciales Wi-Fi a un visitante, la opción más rápida suele parecer pegar la contraseña en texto plano en un chat de Microsoft Teams, un mensaje de WhatsApp o un correo rápido.",
    "Lamentablemente, esa comodidad deja un rastro digital permanente. Una vez que un secreto entra en estos canales, se sincroniza entre dispositivos, es indexable mediante funciones de búsqueda, se almacena en copias de seguridad automáticas del buzón y se conserva indefinidamente en archivos de mensajería corporativa. Una contraseña pensada como temporal se convierte en una responsabilidad permanente.",
    "Afortunadamente, hay una mejor forma de proteger sus credenciales.",
  ],
  sections: [
    {
      title: "El problema central de compartir en texto plano",
      paragraphs: [
        "El correo electrónico y las aplicaciones de chat son excelentes plataformas de colaboración, pero nunca se diseñaron para guardar secretos. Aunque los sistemas modernos suelen cifrar los datos en tránsito, fallan en la efimeridad: garantizar que los secretos desaparezcan una vez cumplido su propósito.",
        "Cuando pega una contraseña en un hilo de chat o correo estándar, pierde de inmediato el control de su ciclo de vida. Permanece almacenada en buzones, es buscable en registros de chat años después y visible en notificaciones o pantallas de bloqueo. Si su cuenta o la del destinatario se compromete más adelante, esos historiales de chat en texto plano se convierten en una mina de oro para los atacantes.",
      ],
    },
    {
      title: "RGPD (GDPR / DSGVO) y riesgos de cumplimiento en Europa",
      paragraphs: [
        "Para las organizaciones europeas, esto no es solo una preocupación de seguridad—es un riesgo de cumplimiento. Según el Reglamento General de Protección de Datos (RGPD / GDPR / DSGVO), las empresas están legalmente obligadas a proteger el acceso a datos personales con medidas técnicas y organizativas de última generación.",
        "Pegar credenciales activas en registros de chat en la nube alojados en EE. UU. o en servidores de correo sin cifrado, sin un cifrado de extremo a extremo dedicado, puede aumentar la exposición de cumplimiento, especialmente si esas contraseñas otorgan acceso a bases de datos con información de clientes o empleados.",
        "El cifrado local en el navegador reduce drásticamente dónde pueden permanecer las credenciales, alineando las entregas cotidianas con un enfoque privacy-first. Esto no es asesoramiento jurídico; trate el intercambio seguro de credenciales como parte de un control de acceso más amplio, la gestión de contraseñas y la política de rotación.",
      ],
    },
    {
      title: "Cómo funcionan los enlaces cifrados en el navegador",
      paragraphs: [
        "Para un intercambio rápido y puntual de contraseñas, los enlaces de un solo uso cifrados en el navegador se encuentran entre las opciones más seguras y eficientes. En lugar de enviar la credencial en sí, envía un enlace único y temporal a una nota cifrada.",
        "Su navegador hace el trabajo pesado: la contraseña se cifra localmente antes de la carga, de modo que el servidor intermediario almacena ciphertext—no su contraseña en bruto. La clave de descifrado suele permanecer en el fragmento del enlace, que los navegadores no envían al servidor.",
      ],
      flowIntro:
        "Para compartir un secreto con un enlace temporal de autodestrucción, siga estos cuatro pasos:",
      flowSteps: [
        {
          step: "Paso 1",
          title: "Entrada y cifrado local",
          body: "Introduzca la contraseña en una herramienta segura. Su navegador la cifra localmente con una clave que nunca sale de su máquina en texto plano.",
        },
        {
          step: "Paso 2",
          title: "Generar el enlace",
          body: "La herramienta solo sube la carga cifrada a un servidor de conocimiento cero y construye un enlace de uso compartido único. El material de descifrado permanece con el enlace—no en una bóveda del servidor de secretos legibles.",
        },
        {
          step: "Paso 3",
          title: "Enviar el enlace",
          body: "Copie y envíe el enlace por Microsoft Teams, correo o WhatsApp. La plataforma de chat ve una URL, no su contraseña.",
        },
        {
          step: "Paso 4",
          title: "Revelación y autodestrucción",
          body: "El navegador del destinatario descifra el contenido localmente. Según la política de uso compartido, la carga cifrada puede purgarse del servidor tras la visualización o tras una ventana corta de caducidad.",
        },
      ],
      midCta: {
        body: "¿Necesita compartir una contraseña ahora? Cree una nota cifrada de un solo uso y envíe el enlace seguro en lugar de la contraseña en sí.",
        button: "Crear una nota privada",
      },
    },
    {
      title: "Consejo de alta seguridad: uso compartido por canales separados",
      paragraphs: [
        "Un enlace cifrado solo es tan seguro como el canal que use para enviarlo. Si un tercero malicioso accede a su bandeja de Teams o correo, podría interceptar el enlace antes de que el destinatario lo abra.",
        "Muchas herramientas de uso compartido seguro—incluida PrivateNote.ai—ofrecen una opción para envolver la nota con una contraseña adicional (passphrase wrapping). No está activada por defecto: la activa al crear la nota, elige una frase de contraseña y el destinatario debe introducirla antes de que se revele el secreto.",
        "Para evitar un único punto de fallo (SPoF) en credenciales muy sensibles, use esa opción para el uso compartido por canales separados: genere el enlace cifrado con protección por frase de contraseña, envíe el enlace por su canal principal (por ejemplo, Microsoft Teams) y envíe la frase de contraseña por un canal completamente distinto—preferiblemente un mensajero centrado en la privacidad como Signal o Threema, o una breve llamada telefónica.",
      ],
      callout:
        "Un atacante necesitaría tanto el enlace como la frase de contraseña. Esa separación es lo que hace efectivo el uso compartido por canales separados.",
    },
    {
      title: "Uso compartido con gestor de contraseñas vs. enlaces de un solo uso",
      paragraphs: [
        "Ambos métodos pueden ser muy seguros, pero cumplen propósitos distintos. La herramienta adecuada depende de cuánto tiempo necesite acceso el destinatario.",
      ],
      comparisonTable: {
        headers: ["Categoría", "Ideal para", "Limitaciones técnicas"],
        rows: [
          [
            "Correo, Teams o WhatsApp",
            "No recomendado para contraseñas",
            "Deja copias en texto plano permanentes y buscables en copias de seguridad y archivos",
          ],
          [
            "Gestores de contraseñas",
            "Acceso continuo: compartir bóvedas con familiares, departamentos internos o equipos de confianza",
            "Ambas partes deben mantener cuentas activas y compatibles de gestor de contraseñas",
          ],
          [
            "Enlaces cifrados de un solo uso",
            "Acceso temporal: freelancers, soporte al cliente, visitantes y entregas puntuales",
            "Cualquiera con el enlace puede leer el secreto salvo que esté protegido por una frase de contraseña secundaria",
          ],
        ],
        after: [
          "Como regla general: use un **gestor de contraseñas** para el acceso compartido continuo, y un **enlace cifrado de un solo uso** cuando la credencial deba cambiar poco después de la entrega.",
        ],
      },
    },
    {
      title: "Cuándo usar un enlace de contraseña de un solo uso",
      paragraphs: [
        "El intercambio de contraseñas de un solo uso es ideal para credenciales transaccionales que solo deben comunicarse una vez. Ejemplos habituales en entornos laborales europeos:",
      ],
      useCaseTable: {
        headers: ["Departamento", "Casos de uso habituales"],
        rows: [
          [
            "Administración y oficina",
            "Contraseñas de router o Wi-Fi de invitados, credenciales de administrador de impresora o ajustes de oficina inteligente",
          ],
          [
            "Finanzas y negocio",
            "Credenciales para su asesor fiscal o auditores financieros externos",
          ],
          [
            "TI y operaciones",
            "Incorporación de proveedores de TI externos temporales, o compartir inicios de sesión temporales de contratistas",
          ],
          [
            "Equipos técnicos",
            "Credenciales de base de datos, claves API, claves SSH o contraseñas de plataformas en la nube con desarrolladores",
          ],
        ],
      },
    },
    {
      title: "Buenas prácticas y errores a evitar",
      subsections: [
        {
          title: "Exigir la rotación",
          paragraphs: [
            "Cada vez que comparta una contraseña, trátela como temporal. Pida al destinatario que la cambie en cuanto inicie sesión y confirme que la rotación está completa antes de dar por finalizada la entrega.",
          ],
        },
        {
          title: "Generar contraseñas fuertes y locales",
          paragraphs: [
            "No invente contraseñas usted mismo. Use una herramienta local como el [generador de contraseñas](app:password-generator) de PrivateNote, o [passwords.lu](https://passwords.lu) para opciones de frase de contraseña y PIN. Ambas se ejecutan localmente—no se sube nada. Para el modelo técnico, consulte [How We Generate Secure Passwords](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Mantener tiempos de caducidad cortos",
          paragraphs: [
            "La mayoría de las contraseñas solo necesitan existir unos minutos u horas. Prefiera una sola visualización o una ventana corta, como dos horas, cuando aún encaje en el flujo de trabajo del destinatario.",
          ],
        },
        {
          title: "No poner contraseñas en títulos o asuntos",
          paragraphs: [
            "Nunca coloque contraseñas en texto plano en asuntos de correo, títulos de tickets, nombres de canales de Teams, títulos de grupos de WhatsApp, nombres de documentos o invitaciones de calendario. Esos campos rara vez se tratan con el mismo cuidado que el cuerpo del mensaje—y persisten en los índices de búsqueda.",
          ],
        },
        {
          title: "Dejar el contexto fuera de la nota segura",
          paragraphs: [
            "Si comparte una contraseña de base de datos, no escriba «Contraseña de la base para el CRM de producción: MySecret123!» dentro de la nota. Ponga solo el secreto en bruto en el enlace cifrado. Si se intercepta el enlace, el atacante no debería saber también qué cuenta o sistema desbloquea.",
          ],
        },
      ],
      calloutTitle: "Error habitual",
      callout:
        "Enviar el enlace cifrado y su frase de contraseña en el mismo mensaje de Teams, chat de WhatsApp o correo anula el uso compartido por canales separados y recrea un único punto de fallo.",
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Son Microsoft Teams o WhatsApp más seguros que el correo?",
          answer:
            "Sus protocolos de transmisión suelen ser seguros, pero siguen funcionando como archivos de chat a largo plazo. Cualquier contraseña pegada en un hilo puede seguir siendo buscable indefinidamente, lo que la convierte en una vulnerabilidad persistente.",
        },
        {
          question: "¿Afecta el RGPD (GDPR / DSGVO) a cómo comparto contraseñas?",
          answer:
            "Según el artículo 32 del RGPD, las organizaciones deben aplicar medidas técnicas y organizativas adecuadas para proteger los datos personales. Almacenar contraseñas en texto plano en copias de seguridad en la nube o cadenas de correo abiertas aumenta la exposición de cumplimiento. Los enlaces de conocimiento cero y autodestrucción mantienen menor la huella de las credenciales.",
        },
        {
          question: "¿Debo enviar el enlace y la frase de contraseña juntos?",
          answer:
            "No. Enviar ambas partes en el mismo mensaje anula el uso compartido por canales separados. Envíe la frase de contraseña por otro medio—preferiblemente Signal o Threema, o una llamada telefónica.",
        },
        {
          question: "¿Debo usar un gestor de contraseñas o un enlace de un solo uso?",
          answer:
            "Use un gestor de contraseñas para el acceso compartido a largo plazo. Use un enlace de un solo uso cifrado en el navegador cuando solo necesite comunicar una contraseña una vez.",
        },
        {
          question: "¿Sigo necesitando un gestor de contraseñas?",
          answer:
            "Sí. Los gestores de contraseñas siguen siendo el lugar adecuado para almacenar y gestionar las credenciales que conserva. Los enlaces cifrados de un solo uso los complementan para entregas temporales y controladas.",
        },
      ],
    },
    {
      title: "Conclusión",
      paragraphs: [
        "El intercambio seguro de contraseñas no tiene por qué ser un cuello de botella en su flujo de trabajo. Solo requiere un pequeño cambio de hábito: dejar de dejar datos sensibles reposando de forma permanente en registros de chat e historiales de bandeja de entrada.",
        "Al usar cifrado local en el navegador y enlaces de autodestrucción, reduce el riesgo de seguridad y cumplimiento organizativo mientras mantiene las entregas rápidas y prácticas.",
        "La próxima vez que necesite compartir una contraseña, evite pegarla en Microsoft Teams, WhatsApp o el correo. Cree una nota cifrada de un solo uso, envíe el enlace en lugar de la contraseña y deje que la nota caduque una vez cumplido su propósito.",
      ],
    },
  ],
  ctaTitle: "¿Listo para compartir de forma segura?",
  ctaBody:
    "Cree una nota privada en PrivateNote.ai para cifrar credenciales en su navegador antes de la carga. Las notas pueden caducar automáticamente o tras la lectura, la protección opcional por frase de contraseña añade otra capa, y los datos de notas cifradas se gestionan bajo jurisdicción de la UE.",
  ctaButton: "Crear una nota privada",
};
