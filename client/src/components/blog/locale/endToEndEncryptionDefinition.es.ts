import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionEs: E2eeDefinitionArticleCopy = {
  intro: [
    "La encriptación de extremo a extremo es una de las frases más repetidas en el marketing de seguridad. También es una de las más fáciles de diluir. La definición real no es que los datos estén encriptados en algún sitio. La definición real trata de quién puede descifrarlos.",
    "Si el proveedor del servicio tiene las claves, puede recuperarlas o recibe texto plano durante el funcionamiento normal, el sistema puede seguir estando encriptado, pero no es encriptación de extremo a extremo en el sentido estricto.",
  ],
  definitionTitle: "La definición útil más breve",
  definitionBody:
    "La encriptación de extremo a extremo significa que solo los extremos tienen las claves necesarias para descifrar los datos. El proveedor del servicio puede almacenar o retransmitir el texto cifrado, pero no debería poseer las claves ni el texto plano.",
  tableHeaders: ["Modelo", "Encriptación", "¿El servidor ve texto plano?", "¿El servidor tiene claves?"],
  tableRows: [
    { model: "Seguridad de transporte (TLS)", happens: "Entre el navegador y el servidor", plaintext: "Sí, en el servidor", keys: "Sí, para procesamiento en el servidor" },
    { model: "Encriptación en el cliente defectuosa", happens: "En el dispositivo", plaintext: "Quizá", keys: "Sí, si las claves se suben o son recuperables" },
    { model: "E2EE verdadera", happens: "En los extremos", plaintext: "No", keys: "No" },
  ],
  flowNodes: [
    { title: "Navegador del remitente", body: "Encripta localmente antes de subir" },
    { title: "Almacenamiento de PrivateNote", body: "Almacena solo texto cifrado" },
    { title: "Navegador del destinatario", body: "Descifra con la clave del fragmento" },
  ],
  sections: [
    {
      title: "La encriptación no es lo mismo que la encriptación de extremo a extremo",
      paragraphs: [
        "La mayoría de los servicios web serios usan TLS. Eso importa: TLS protege los datos mientras viajan entre tu navegador y el servidor, y evita que atacantes en la red local lean la conexión.",
        "Pero TLS termina en el servidor. Una vez que llega la solicitud, el servicio suele poder ver el texto plano. El proveedor puede almacenarlo, escanearlo, indexarlo, procesarlo o volver a encriptarlo en reposo con claves que controla.",
        "Eso es transporte encriptado. Por sí solo, no es encriptación de extremo a extremo.",
      ],
      callout: "La prueba práctica es sencilla: ¿puede el proveedor obtener la clave de descifrado o el texto plano? Si la respuesta es sí, el sistema no está verdaderamente encriptado de extremo a extremo.",
    },
    {
      title: "La definición del criptógrafo",
      paragraphs: [
        "Una definición precisa de E2EE empieza por la posesión de claves. En un sistema verdadero de extremo a extremo, las claves de encriptación y descifrado se crean y conservan en los extremos, no en el servicio de entrega.",
        "El servidor puede enrutar, almacenar, limitar la tasa y eliminar texto cifrado. Puede operar el servicio. Pero no posee el material de clave necesario para convertir el texto cifrado en contenido legible.",
        "El análisis conocido de Matthew Green sobre la controversia de encriptación de Zoom deja esto claro: la propiedad central no es solo que exista encriptación, sino que las claves de descifrado no estén disponibles para el proveedor.",
      ],
      bullets: [
        "El extremo del remitente puede encriptar los datos.",
        "El extremo del destinatario puede descifrarlos.",
        "El servidor intermediario solo maneja texto cifrado.",
        "Una compromisión del servidor no debería exponer el contenido en texto plano.",
      ],
    },
    {
      title: "La encriptación en el cliente aún puede quedarse corta",
      paragraphs: [
        "La encriptación en el cliente significa que la operación criptográfica ocurre localmente antes de subir. Eso es necesario para muchos diseños E2EE, pero no basta por sí solo.",
        "Un servicio podría encriptar datos en el navegador y luego subir tanto el texto cifrado como la clave correspondiente a su backend. La encriptación ocurrió en el cliente, pero el proveedor sigue teniendo la clave. Eso rompe el límite de extremo a extremo.",
        "La distinción significativa es la posesión exclusiva de la clave. Si el proveedor puede acceder, recuperar, rotar, custodiar o regenerar la clave utilizable, sigues confiando en el proveedor para acceder al texto plano.",
      ],
    },
    {
      title: "Cómo encajan las notas con fragmento de URL en el modelo",
      paragraphs: [
        "PrivateNote usa una versión en el navegador de esta arquitectura para notas de un solo uso. El navegador del remitente encripta la nota localmente. La carga encriptada se sube al almacenamiento. La clave de descifrado se coloca en el fragmento de URL: la parte después del símbolo #.",
        "Los navegadores no envían el fragmento de URL al servidor en la solicitud HTTP. Eso significa que el servidor recibe el texto cifrado, pero no la clave. Cuando el destinatario abre el enlace, su navegador tiene el fragmento localmente y puede descifrar la nota tras el paso de revelación.",
        "No es la misma topología que Signal o MLS, donde los extremos suelen ser dispositivos vinculados a una cuenta con claves públicas persistentes. Pero la propiedad de seguridad central es la misma: el proveedor de almacenamiento no posee la clave necesaria para descifrar el contenido.",
      ],
    },
    {
      title: "El canal de entrega sigue importando",
      paragraphs: [
        "Un enlace encriptado de un solo uso es potente, pero el enlace completo se vuelve sensible porque lleva la clave de descifrado en el fragmento. Si pegas ese enlace en un canal que registra mensajes, sincroniza historial o está monitorizado por un administrador, ese canal puede exponer el secreto antes de que se abra.",
        "Por eso la caducidad, las lecturas de un solo uso y las contraseñas opcionales son importantes a nivel operativo. No cambian la definición de E2EE, pero reducen el daño si un enlace se reenvía, se registra o lo previsualiza un software.",
        "Para material muy sensible, envía el enlace por un canal y comparte la contraseña opcional por otro. Eso separa la posesión de la carga encriptada de la posesión del secreto humano.",
      ],
    },
    {
      title: "La advertencia del fuerza bruta offline",
      paragraphs: [
        "La protección con contraseña añade defensa en profundidad, pero tiene una advertencia criptográfica real. Si un atacante obtiene el enlace completo y descarga el texto cifrado antes de que caduque, adivinar la contraseña puede convertirse en un ataque offline. Los límites de tasa del servidor ya no ayudan, porque el atacante puede probar conjeturas contra el texto cifrado localmente.",
        "PrivateNote usa Argon2id para notas protegidas con contraseña. Argon2id es una función de derivación de claves que consume mucha memoria, lo que encarece cada intento de contraseña, especialmente frente a ataques de fuerza bruta con GPU.",
        "Eso no hace seguras las contraseñas débiles. Una contraseña corta o reutilizada puede seguir fallando. Cuanto más fuerte sea la contraseña opcional, más útil resulta esta segunda capa.",
      ],
    },
    {
      title: "Por qué importa la arquitectura",
      paragraphs: [
        "E2EE cambia el modelo de confianza. Con almacenamiento encriptado en reposo convencional, confías en la política del proveedor, los controles de empleados, el manejo legal y la prevención de brechas. Con encriptación de extremo a extremo, el proveedor queda limitado estructuralmente: puede almacenar datos encriptados, pero no puede descifrarlos.",
        "Eso no elimina todo riesgo. El malware en el extremo, extensiones maliciosas del navegador, enlaces copiados, contraseñas débiles y canales de entrega inseguros siguen importando. La criptografía reduce el límite de confianza; no elimina el criterio operativo.",
        "El valor sigue siendo significativo: una brecha de base de datos debería exponer texto cifrado ilegible en lugar del contenido del mensaje. Esa es la diferencia entre prometer no leer los datos y ser incapaz de leerlos desde el principio.",
      ],
    },
  ],
  continueReadingTitle: "Sigue leyendo",
  referencesTitle: "Referencias",
  references: [
    { label: "Matthew Green, «Does Zoom use end-to-end encryption?»", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
