import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionEs: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "Un iPhone y un teléfono Android con iconos de candado en burbujas de mensaje, conectados por un candado central que representa RCS cifrado de extremo a extremo",
  heroCaption:
    "El RCS multiplataforma por fin se pone al día: la misma garantía de cifrado de extremo a extremo, sin importar si la burbuja es azul o verde.",
  intro: [
    "Durante años, una de las mayores frustraciones en la mensajería móvil no fue la falta de funciones, sino la falta de privacidad coherente.",
    "Los usuarios de Apple disfrutaban de conversaciones cifradas de extremo a extremo a través de iMessage, mientras que los usuarios de Android podían beneficiarse del cifrado al usar Google Messages con otros dispositivos Android. Los mensajes enviados entre Android e iPhone nunca tuvieron la misma protección. Las conversaciones multiplataforma dependían de Rich Communication Services (RCS), pero sin cifrado de extremo a extremo interoperable.",
    "Eso finalmente está cambiando.",
    "Google anunció recientemente que la mensajería RCS cifrada de extremo a extremo entre Android e iPhone está empezando a implementarse, tras la publicación del último Perfil Universal RCS de GSMA, que incorpora el protocolo Messaging Layer Security (MLS). A medida que el soporte se expande entre dispositivos y aplicaciones de mensajería, miles de millones de usuarios ganarán más privacidad en sus conversaciones diarias.",
    "Este es un hito importante para la comunicación digital. También ofrece una buena oportunidad para entender qué protege realmente [el cifrado de extremo a extremo](blog:what-is-end-to-end-encryption) — y qué no.",
  ],
  sections: [
    {
      title: "Un mejor estándar para la mensajería del día a día",
      paragraphs: [
        "La transición de SMS a RCS ha modernizado la mensajería de texto con funciones como el envío de fotos de alta calidad, indicadores de escritura, confirmaciones de lectura y conversaciones grupales más ricas. Sin embargo, la seguridad ha sido inconsistente según qué dispositivos estuvieran involucrados.",
        "Hasta ahora, los usuarios de Android que se escribían con otros usuarios de Android podían disfrutar de cifrado de extremo a extremo a través de Google Messages, mientras que los usuarios de iPhone tenían la misma protección dentro de iMessage. Sin embargo, los mensajes intercambiados entre Android e iPhone carecían de cifrado de extremo a extremo interoperable.",
        "El estándar RCS actualizado cambia eso. A medida que se implementa el soporte, los usuarios de ambas plataformas finalmente pueden beneficiarse de las mismas garantías fundamentales de privacidad, sin importar qué teléfono posean.",
        "Para una tecnología de comunicación usada por miles de millones de personas, este es un paso importante hacia adelante.",
      ],
    },
    {
      title: "Qué significa realmente el cifrado de extremo a extremo",
      paragraphs: [
        "El cifrado de extremo a extremo significa que un mensaje se cifra antes de salir del dispositivo del remitente y solo puede descifrarse en el dispositivo del destinatario.",
        "A diferencia del cifrado de transporte tradicional, donde un proveedor de servicios puede tener la capacidad de acceder a los mensajes una vez que llegan a sus servidores, el cifrado de extremo a extremo garantiza que solo los dispositivos que se comunican poseen las claves necesarias para leer la conversación. El servicio de mensajería transporta datos cifrados, pero no puede descifrar su contenido.",
        "Para los usuarios, el beneficio es sencillo: tu conversación permanece privada entre tú y la persona con la que hablas.",
        "El cifrado de extremo a extremo correctamente implementado protege contra muchas amenazas comunes. Alguien que monitoree una red Wi-Fi pública no puede simplemente leer tus mensajes, los proveedores de servicios de internet no pueden inspeccionar su contenido, y una brecha en los servidores del proveedor de mensajería expondría datos cifrados en lugar de conversaciones legibles.",
        "Para la comunicación cotidiana, esto representa una mejora significativa en la privacidad. Para una definición técnica más profunda, consulta nuestra guía sobre [qué significa el cifrado de extremo a extremo](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "El cifrado tiene límites",
      paragraphs: [
        "Aunque el cifrado de extremo a extremo es muy importante, a menudo se malinterpreta.",
        "El cifrado protege los mensajes mientras se transmiten y mientras están almacenados por el proveedor de mensajería. No controla lo que ocurre después de que el mensaje ha sido entregado.",
        "Una vez que un mensaje se ha descifrado en el teléfono del destinatario, vuelve a ser información ordinaria. El destinatario puede conservarlo indefinidamente, reenviarlo a otra persona, copiar su contenido en otra aplicación, o simplemente hacer una captura de pantalla. Según la plataforma de mensajería, las conversaciones también pueden sincronizarse entre varios dispositivos o incluirse en copias de seguridad en la nube.",
        "En otras palabras, el cifrado de extremo a extremo asegura la entrega — no garantiza que la información desaparezca después de haber sido leída.",
      ],
      callout:
        "Esta distinción se vuelve cada vez más importante cuando la información compartida es particularmente sensible: contraseñas, códigos de recuperación, claves API y otras credenciales que no deberían vivir para siempre en un historial de chat consultable.",
    },
    {
      title: "No todos los secretos pertenecen al historial de chat",
      paragraphs: [
        "La mayoría de las conversaciones merecen ser conservadas. Los mensajes con la familia, las charlas con amigos o las conversaciones laborales a menudo se convierten en un registro útil que las personas esperan poder revisar más tarde.",
        "Las credenciales sensibles son diferentes.",
        "Imagina que envías una contraseña de administrador temporal a un colega. La contraseña viaja de forma segura por internet gracias al cifrado de extremo a extremo, pero seis meses después puede seguir estando en un historial de conversación consultable. Lo mismo aplica a las claves API, códigos de recuperación, frases semilla de criptomonedas, información confidencial de clientes o credenciales de acceso temporales.",
        "En muchos incidentes de seguridad reales, el problema no es que el secreto se interceptara durante la transmisión. Es que permaneció almacenado en algún lugar mucho después de que debiera haber sido olvidado.",
        "A medida que la mensajería se vuelve cada vez más segura, la atención se está desplazando gradualmente hacia un desafío diferente: reducir la persistencia innecesaria. Por eso algunos [secretos nunca deberían enviarse por chat](blog:secrets-never-send-in-chat), estén cifrados o no.",
      ],
    },
    {
      title: "Cuándo los enlaces de un solo uso tienen más sentido",
      paragraphs: [
        "Para información que solo necesita compartirse una vez, dejarla dentro de una conversación permanente no siempre es lo ideal.",
        "Una alternativa cada vez más común es compartir información sensible a través de [enlaces cifrados de un solo uso](blog:one-time-secret-links) que caducan automáticamente o se vuelven inaccesibles después de haber sido vistos. En lugar de incrustar el secreto directamente en una conversación en curso, el destinatario abre un enlace dedicado, recupera la información, y el enlace finalmente caduca — o, en algunos casos, solo puede accederse una vez.",
        "Este enfoque no reemplaza la mensajería cifrada. Más bien la complementa al abordar un problema distinto.",
        "Las aplicaciones de mensajería están diseñadas para preservar conversaciones. Los enlaces de un solo uso están diseñados para minimizar la exposición a largo plazo de información que, idealmente, no debería permanecer almacenada indefinidamente.",
        "Ya sea que estés compartiendo una contraseña temporal, un token de API, una clave de licencia de software u otro valor confidencial, limitar el tiempo de existencia de esa información puede reducir significativamente el riesgo de divulgación accidental más adelante.",
      ],
    },
    {
      title: "La privacidad es más que el cifrado",
      paragraphs: [
        "El despliegue de mensajería RCS cifrada de extremo a extremo e interoperable es genuinamente una buena noticia. Por primera vez, los usuarios de Android y iPhone pueden disfrutar del mismo nivel de protección sin importar qué ecosistema usen.",
        "También es un recordatorio de que la privacidad se trata de algo más que solo el cifrado.",
        "Proteger la información mientras viaja por internet es esencial, pero también lo es pensar en qué sucede después. Cierta información merece permanecer disponible durante años. Otra información —particularmente contraseñas, códigos de recuperación y credenciales temporales— suele ser más segura cuando existe solo el tiempo necesario.",
        "Las aplicaciones de mensajería modernas y los servicios de compartición de secretos de un solo uso cumplen propósitos diferentes. Ninguno reemplaza al otro; en cambio, abordan aspectos distintos de la comunicación segura. Elegir el enfoque correcto depende de qué estás compartiendo y de cuánto tiempo necesita existir.",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Esto reemplaza a los SMS?",
          answer:
            "No. Los mensajes SMS tradicionales siguen sin cifrar. Las nuevas protecciones aplican solo a conversaciones RCS compatibles, cuando tanto los dispositivos como las aplicaciones de mensajería admiten el último estándar RCS cifrado de extremo a extremo.",
        },
        {
          question: "¿Pueden Google o Apple leer los mensajes RCS cifrados?",
          answer:
            "El cifrado de extremo a extremo está diseñado para que solo los dispositivos que se comunican posean las claves necesarias para descifrar los mensajes. Los proveedores transportan datos cifrados pero no pueden acceder al contenido en texto plano de tus conversaciones.",
        },
        {
          question: "¿Alguien todavía puede hacer una captura de pantalla?",
          answer:
            "Sí. Una vez que un mensaje se ha descifrado en el dispositivo del destinatario, este puede seguir haciendo capturas de pantalla, copiando el contenido o reenviándolo a otros. El cifrado de extremo a extremo protege la transmisión del mensaje, no lo que el destinatario decida hacer con él después.",
        },
        {
          question: "¿Los enlaces de un solo uso son más seguros que las apps de mensajería?",
          answer:
            "No necesariamente — resuelven un problema diferente. La mensajería cifrada de extremo a extremo es excelente para conversaciones continuas. Los [enlaces de un solo uso o caducables](blog:one-time-secret-links) suelen ser más adecuados para compartir información sensible que no debería permanecer indefinidamente en el historial de chat.",
        },
      ],
    },
  ],
  referencesTitle: "Más información",
  references: [
    {
      label:
        "Los usuarios de Android e iPhone ya pueden disfrutar de mensajería RCS cifrada de extremo a extremo (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Comparte secretos que no deberían vivir en el chat",
  ctaBody:
    "Cuando necesites entregar a alguien una contraseña, una clave API o un código de recuperación, envía una nota cifrada de un solo uso en el navegador en lugar de pegarla en Messages. Configura una caducidad corta o autodestrucción tras la lectura para que el secreto no permanezca en un historial consultable.",
  ctaButton: "Crear una nota privada",
};
