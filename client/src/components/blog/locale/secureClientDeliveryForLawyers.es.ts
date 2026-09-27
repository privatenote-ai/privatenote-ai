import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersEs: SecureClientDeliveryForLawyersArticleCopy = {
  intro: [
    "El correo y las mensajerías pueden dejar copias duraderas. En muchos intercambios sujetos al secreto profesional, el objetivo práctico es el contrario: transmitir una instrucción o una pieza sensible sin convertirla en otro historial permanente. El cifrado importa; también importa quién podrá más tarde recuperar un escrito, y durante cuánto tiempo.",
    "Los despachos saben que el correo no es una caja fuerte. Muchos pasan a Signal o WhatsApp porque «va cifrado». Se quedan cortos. Esas aplicaciones están hechas para conservar una conversación. Muchas comunicaciones entre abogado y cliente requieren precisamente lo contrario: entregar al cliente una instrucción, un borrador o un anexo, y dejar de acumular copias.",
    "La dificultad es práctica y jurídica. Una parte importante de la clientela no instalará Signal. No añadirá otra aplicación de mensajería «segura» junto al WhatsApp familiar. Abrirá un enlace en el navegador que ya tiene. Sobre todo en la defensa penal, la abogacía necesita un canal que parezca correspondencia del despacho, no una burbuja de una aplicación de mensajería.",
  ],
  sections: [
    {
      title: "Por qué un chat cifrado puede seguir dejando un historial",
      paragraphs: [
        "El cifrado de extremo a extremo de Signal y WhatsApp protege eficazmente el contenido frente al acceso del proveedor. Pero cifrado y persistencia son cuestiones distintas: un mensaje puede estar bien protegido y seguir almacenado después en los dispositivos, copias de seguridad u ordenadores vinculados. Esa segunda cuestión es la que importa en la práctica al despacho y, en particular, a la defensa penal:",
      ],
      bullets: [
        "¿Queda un historial consultable en el teléfono del cliente, en el de un familiar o en un aparato que más tarde será intervenido, perdido o peritado?",
        "¿Las copias en la nube, los ordenadores vinculados, las vistas previas de notificación y las capturas reenviadas multiplican el contenido más allá de las partes originales?",
        "¿Surge, sin quererlo, un comentario escrito continuo que nunca debió formar parte del expediente y luego reaparece como rastro digital?",
      ],
      paragraphsAfterBullets: [
        "El mismo patrón se da fuera del juzgado: los mensajes escritos sobreviven a la ocasión que los originó. Véase [notas efímeras para mensajes laborales](blog:workplace-texts-private-note) y [por qué los secretos no deben ir al chat](blog:secrets-never-send-in-chat). Para pasaportes, informes médicos y contratos, la objeción vale también para los [adjuntos de correo](blog:why-email-is-worst-for-secrets).",
        "No es una invitación a destruir lo que el despacho debe conservar. Las obligaciones de archivo, la correcta gestión del expediente y, en su caso, las medidas de aseguramiento permanecen. El punto es más estrecho: muchas comunicaciones operativas —instrucciones puntuales, claves de acceso, redacciones solo para el cliente, un anexo sensible que no debe vivir en el chat familiar— no deben fosilizarse en una aplicación de mensajería.",
      ],
    },
    {
      title: "Defensa penal, prisión provisional y el cliente sin segunda app",
      paragraphs: [
        "La objeción es más aguda en la defensa penal. El cliente está bajo presión, a veces en prisión provisional o cumpliendo condena, usa el teléfono de un familiar y rara vez puede adoptar un conjunto propio de herramientas de confidencialidad. Pedirle que «instale Signal» fracasa en muchos asuntos. WhatsApp suele estar ya en el aparato, y ese es precisamente el problema. Es un entorno de comunicación personal: ahí discute la familia, circulan capturas y una instrucción confidencial convive con el chiste de un primo.",
        "Se suma la práctica de entradas y registros. Si se interviene el teléfono, el historial local está en el aparato. PrivateNote no modifica lo que las autoridades pueden legalmente intervenir o examinar. Plantea otra pregunta: qué copias guarda el propio cliente, por defecto, en un teléfono cotidiano.",
        "Entre las comunicaciones que no deberían permanecer en ese entorno:",
      ],
      bullets: [
        "Instrucciones sobre la declaración, la prisión provisional, medidas cautelares, fianza o una conformidad.",
        "Borradores de declaración, escrito o informe de defensa sobre la pena que el cliente debe aprobar antes de presentarlos.",
        "Domicilios, informes médicos, situación patrimonial o identidad de un testigo previsto: necesarios hoy, peligrosos si permanecen.",
        "Accesos de un solo uso a un portal, una vista por videoconferencia o un documento que el cliente debe leer una vez, no guardar en el chat.",
        "Abogado a abogado: letrado correspondiente, procurador, sustitución en vista — los papeles hacen falta ahora, no un grupo permanente.",
      ],
      paragraphsAfterBullets: [
        "En todos esos casos, el objetivo es transmitir el contenido al destinatario previsto sin ampliar innecesariamente el círculo de personas que podrían reconstruirlo después. Una confirmación de lectura dentro de una mensajería no equivale a un registro de entrega específico para el despacho. No identifica el despacho. No ofrece, de un vistazo, el contexto profesional que un cliente receloso de los enlaces desconocidos puede necesitar para reconocer el envío.",
      ],
    },
    {
      title: "Lo que la abogacía necesita de un canal de entrega",
      paragraphs: [
        "Un canal adecuado para transmitir información confidencial tiene unos requisitos claros. El cliente no debe crear cuenta ni instalar software. El cifrado debe ocurrir en el dispositivo del remitente antes de subir, de modo que el servicio almacene solo cifrado, no la instrucción. El acceso debe poder destruirse tras la lectura y caducar. La página de apertura debe presentarse como correspondencia del despacho, no como un servicio anónimo para compartir texto. El remitente debe poder saber si el enlace se ha abierto, revocarlo si el número era erróneo y, en anexos sensibles, dificultar la descarga casual.",
        "Esa es la lógica de un [enlace secreto de un solo uso](blog:one-time-secret-links), aplicada al ejercicio. PrivateNote cifra el contenido en el navegador antes de que salga del dispositivo. Los destinatarios abren una URL única; no hace falta cuenta. El despacho puede enviar el enlace por el canal que el cliente ya usa —SMS, correo, incluso una llamada breve en la que se dicta la dirección— sin poner la instrucción en ese canal. El contenido sensible está en la nota. El chat o la bandeja solo contienen un enlace que deja de funcionar.",
      ],
      comparisonTable: {
        headers: ["Exigencia del ejercicio", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "El cliente no instala una aplicación",
            "No — la aplicación es el canal",
            "Sí — navegador ordinario",
          ],
          [
            "Sin historial duradero por defecto",
            "Conversación dentro de una aplicación; pueden configurarse mensajes temporales",
            "Transmisión puntual por enlace; lectura única y caducidad como flujo principal",
          ],
          [
            "Identidad del despacho en la entrega",
            "Perfil o identidad dentro de la mensajería",
            "Logotipo, nombre del despacho y página de apertura con marca",
          ],
          [
            "Prueba de que se recogieron los papeles",
            "Las confirmaciones de lectura pertenecen al chat, no a un registro de entrega propio",
            "Alertas de apertura y prueba de acceso (solo estado)",
          ],
          [
            "Revocación si el número es erróneo",
            "El mensaje ya está en el aparato",
            "Revocar una nota no abierta",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal y WhatsApp también ofrecen mensajes temporales. Su modelo sigue siendo el de una conversación en una aplicación de mensajería, mientras que PrivateNote está pensado como una transmisión puntual por enlace. Para documentos en lugar de instrucciones breves, véase [cómo enviar documentos sensibles de forma segura](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Usarlo juntos: un hábito de despacho",
      paragraphs: [
        "El valor crece cuando los letrados emplean entre sí el mismo canal que con el cliente. El letrado correspondiente, el procurador, la compañera que cubre una vista y el cliente comparten entonces una expectativa: lo sensible llega como enlace de un solo uso con la marca del despacho; no se deja en un grupo; no se convierte en otro historial consultable.",
        "Es un estándar de ejercicio, no un producto basado en licencias por usuario. PrivateNote Business es una cuenta profesional. Un abogado, un colaborador o un despacho pequeño pueden mostrar su nombre e identidad visual en cada página de apertura. Los colegas con cuenta Business o Starter pueden devolver los papeles del mismo modo. El cliente sigue sin necesitar cuenta. La disciplina común es lo esencial: dejar de tratar las mensajerías de uso cotidiano como depósito por defecto del tráfico operativo sujeto a secreto.",
        "La marca no es vanidad. Un cliente acostumbrado a desconfiar de enlaces desconocidos debería poder reconocer inmediatamente el contexto del envío: nombre del despacho, logotipo, identidad del remitente y mensaje de acompañamiento. Esto no autentica criptográficamente al remitente, pero hace la transmisión más reconocible y profesional. Un hilo de WhatsApp no ofrece esa garantía. Business añade perfil, logotipo, colores y una página de apertura predeterminada o personalizada, para que la entrega se presente claramente bajo la identidad del despacho.",
      ],
      midCta: {
        body: "Business es el plan para la entrega profesional: marca ante el destinatario, archivos en modo de solo visualización, adjuntos de hasta 1 GB y el conjunto de controles de entrega (prueba de acceso, verificación del destinatario, revocación, revelación programada). 12 € / 12 $ al mes, o 120 € / 120 $ al año: una cuenta profesional, no una licencia por usuario.",
        button: "Ver Business en la página de planes",
      },
    },
    {
      title: "Controles que corresponden a una cuenta profesional",
      paragraphs: [
        "Starter y Business añaden funciones que el despacho, de otro modo, tendría que coordinar por teléfono o mediante canales separados. La [verificación del destinatario](blog:recipient-verification-code-before-reveal) pone un código propio de la nota en un segundo canal, de modo que un enlace interceptado no basta. Las [notificaciones de apertura](blog:know-when-secret-link-opened) y la prueba de acceso indican que se recogieron los papeles: solo el estado, nunca el contenido. La [revocación](blog:revoke-unopened-note-proof-of-access) destruye un enlace no abierto enviado al número equivocado. La revelación programada puede retener un pliego hasta un plazo de presentación o una llamada desde el centro. Business añade un modo de solo visualización para anexos que deben consultarse sin fomentar su descarga innecesaria, y los mayores límites de adjuntos para expedientes que no pertenecen a un chat.",
      ],
      orderedIntro: "Una secuencia practicable es breve:",
      ordered: [
        "Redacte la instrucción o adjunte los papeles. El cifrado ocurre en el navegador antes de subir.",
        "Fije una vida corta y una sola apertura, o unas pocas si el cliente y el letrado correspondiente deben recoger el mismo paquete.",
        "Active la verificación del destinatario cuando el contenido sea especialmente sensible y comunique el código por otra vía (una llamada, por ejemplo).",
        "Envíe solo el enlace por SMS o correo. No pegue la instrucción en ese mensaje.",
        "Espere la alerta de apertura. Si el número era erróneo, revoque antes de la apertura. Tras abrir, asuma que el destinatario puede conservar lo que vio y actúe en consecuencia.",
      ],
      paragraphsAfterOrdered: [
        "Para expedientes más voluminosos vale el mismo modelo: [archivos cifrados, datos cifrados en el servidor, ventana de descarga limitada](app:secure-file-transfer). Enviar un archivo exige una cuenta gratuita; abrir un enlace, nunca.",
      ],
    },
    {
      title: "Lo que este canal no decide",
      paragraphs: [
        "En España, el secreto profesional del abogado se articula, entre otras normas, en el Estatuto General de la Abogacía y en la Ley de Enjuiciamiento Criminal. Su aplicación concreta depende del marco jurídico y de las circunstancias del caso. PrivateNote no determina si una comunicación concreta está jurídicamente amparada por el secreto profesional. Ningún producto impide a un destinatario legítimo copiar, capturar o fotografiar una vez mostrado el contenido en claro. PrivateNote no sustituye el sistema documental del despacho, la contabilidad de tiempo ni la obligación de conservar lo que el expediente debe conservar. Reduce copias innecesarias de comunicaciones que no debían convertirse en archivo permanente. El principio de minimización de datos también favorece no conservar datos personales durante más tiempo ni en mayor medida de lo necesario para la finalidad correspondiente.",
        "Con ese límite, es una alternativa profesional a las dos costumbres que hoy dominan: poner el tráfico operativo sujeto a secreto en el correo, o en una mensajería de uso cotidiano porque el cliente no instalará nada más. El despacho deja al cliente en las herramientas que ya tiene, pone su nombre en la entrega y no deja historial donde no hace falta.",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Basta el cifrado de Signal o WhatsApp para el secreto profesional?",
          answer:
            "El cifrado de extremo a extremo protege eficazmente el contenido frente al acceso del proveedor. No decide cuánto tiempo permanece un historial en aparatos, copias de seguridad o el chat del cliente. Cifrado y persistencia son cuestiones distintas. La protección jurídica aplicable a una comunicación no depende solo de la herramienta utilizada para transmitirla.",
        },
        {
          question: "¿Debe el cliente crear una cuenta o instalar una aplicación?",
          answer:
            "No. El cliente abre un enlace único en un navegador ordinario. No hacen falta Signal, WhatsApp ni una aplicación PrivateNote, y no se requiere cuenta para abrir la nota.",
        },
        {
          question: "¿Sustituye PrivateNote el expediente del despacho?",
          answer:
            "No. Es un canal de entrega de corta duración. Los expedientes, las actuaciones y todo lo sujeto a obligación de conservación siguen en los sistemas habituales del despacho. PrivateNote sirve para comunicaciones que no deben persistir tras la recepción.",
        },
        {
          question: "¿Puede el destinatario conservar una copia después de abrir?",
          answer:
            "Sí. Una vez mostrado lícitamente el contenido en claro, un destinatario determinado puede copiar, capturar, descargar o fotografiar. La destrucción tras la lectura y la caducidad reducen copias residuales en el servicio; no borran a distancia lo que el destinatario ya ha fijado. El modo de solo visualización de Business dificulta la descarga casual; no prohíbe fotografiar.",
        },
      ],
    },
  ],
  ctaTitle: "Entregue la instrucción. No deje el historial.",
  ctaBody:
    "Cifre en el navegador, ponga el nombre del despacho en la página de apertura y envíe un enlace que el cliente abre sin instalar Signal ni WhatsApp. Business es el plan para esa entrega profesional.",
  ctaPrimary: "Elegir Business",
  ctaSecondary: "Escribir una nota privada",
};
