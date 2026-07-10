import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingEs: EncryptedFileSharingArticleCopy = {
  intro: [
    'Cuando la gente busca «compartir archivos de forma segura», a menudo asume que todo servicio con HTTPS o TLS encriptación protege sus archivos de la misma manera. Por desgracia, no es cierto.',
    'Dos servicios pueden anunciar «transferencia de archivos encriptada» con garantías de privacidad muy distintas. La diferencia está enteramente en **dónde ocurre la encriptación**. Entender esa distinción explica por qué algunos servicios pueden inspeccionar, indexar y procesar tus archivos, mientras que otros simplemente no pueden.',
  ],
  sections: [
    {
      title: "Los dos tipos de encriptación",
      level: "primary",
      paragraphs: ["Hay dos formas principales en que los servicios modernos de compartición de archivos protegen tus datos."],
    },
    {
      title: "1. Encriptación de transporte (TLS)",
      level: "secondary",
      paragraphs: [
        "Esta es la encriptación estándar que usa casi todo sitio web en Internet hoy. Cuando subes un archivo, tu navegador establece una conexión segura de Transport Layer Security (TLS) con el servidor anfitrión. La conexión está encriptada mientras el archivo viaja por la red, protegiéndote de atacantes en Wi‑Fi público, routers comprometidos o cualquiera que espíe el tráfico de red.",
      ],
      flow: "tls",
      bullets: [
        "TLS es esencial, y todo servicio de confianza debe usarlo.",
        "Una vez que la subida llega al servidor, el proveedor recibe el archivo original en texto plano.",
        "A partir de ahí, según sus políticas, el servicio puede almacenar el archivo, generar vistas previas, indexar contenidos, escanear malware o usar metadatos para analítica.",
        'Muchos proveedores también encriptan archivos «en reposo». Eso protege contra el robo físico de discos—pero el servicio sigue teniendo las claves y puede leer tus archivos.',
      ],
      callout:
        "**La vulnerabilidad central del almacenamiento en la nube tradicional:** el servidor solo puede encriptar lo que ya ha podido leer.",
    },
    {
      title: "2. Encriptación en el navegador",
      level: "secondary",
      paragraphs: [
        "Un enfoque fundamentalmente distinto es encriptar el archivo **antes** de que salga de tu dispositivo. En lugar de subir el archivo original, tu navegador usa APIs criptográficas locales para encriptarlo. El servidor solo recibe texto cifrado—datos que parecen aleatorios y son inútiles sin la clave de descifrado.",
      ],
      flow: "browser",
      bullets: [
        "La encriptación en el navegador no sustituye a TLS—la complementa.",
        "TLS sigue protegiendo la conexión frente a espías a nivel de red.",
        "Los servidores del proveedor reciben solo texto cifrado ilegible porque nunca reciben el texto plano ni la clave de descifrado.",
      ],
    },
    {
      title: "Por qué importa esta diferencia",
      level: "primary",
      paragraphs: [
        "Supón que compartes datos muy sensibles: contratos legales, hojas de cálculo financieras, código fuente propietario, historiales médicos o documentos empresariales confidenciales.",
        "Con encriptación solo de transporte, tu privacidad es **contractual**. Debes confiar en la implementación del proveedor, los controles de acceso de empleados y las políticas corporativas actuales y futuras.",
        "Con encriptación en el navegador, tu privacidad es **arquitectónica**. El proveedor solo almacena texto cifrado. Aunque lo hackeen, reciban una citación judicial o cambien su modelo de negocio, no pueden entregar texto plano que nunca poseyeron.",
      ],
      callout:
        "Con encriptación solo de transporte, tu privacidad es **contractual**. Con encriptación en el navegador, tu privacidad es **arquitectónica**.",
    },
    {
      title: "Un recordatorio reciente: el factor de confianza",
      level: "primary",
      paragraphs: [
        "En 2025, WeTransfer actualizó sus Términos de servicio con un lenguaje que parecía conceder amplios derechos sobre el contenido subido, incluido para mejorar sistemas de aprendizaje automático usados en moderación de contenido.",
        "El cambio provocó una reacción inmediata de artistas, periodistas y profesionales creativos que temían que su propiedad intelectual se usara para entrenar sistemas de IA. WeTransfer aclaró rápidamente que el contenido de clientes no se usaba para entrenamiento de IA y eliminó el lenguaje confuso—pero el incidente destacó una lección crucial:",
        "Si un proveedor recibe tus archivos en texto plano, dependes por completo de sus promesas. Cuando un proveedor solo almacena texto cifrado, la confianza que debes depositar en él se minimiza estructuralmente. La arquitectura impone la privacidad.",
      ],
    },
    {
      title: "Cómo maneja PrivateNote la compartición de archivos",
      level: "primary",
      paragraphs: [
        "La encriptación moderna en el navegador combina varios bloques criptográficos bien establecidos para mantener los datos seguros sin depender de la confianza en el servidor.",
      ],
    },
    {
      title: "Generación y aislamiento de claves",
      level: "secondary",
      paragraphs: [
        "Cuando un usuario prepara compartir un archivo, PrivateNote genera en el navegador una clave simétrica aleatoria criptográficamente segura usando la Web Crypto API.",
        "Esta clave nunca se transmite a nuestra infraestructura. En su lugar, se añade al enlace de compartición como fragmento de URL (la parte después del símbolo `#`):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Por diseño, los navegadores web nunca envían el fragmento de URL al servidor web en una solicitud HTTP. Este comportamiento está definido por el estándar de URL y funciona así desde hace décadas. La clave de descifrado permanece en el navegador del destinatario.",
      ],
    },
    {
      title: "Encriptación en streaming autenticada",
      level: "secondary",
      paragraphs: [
        "En lugar de subir datos en bruto, el navegador encripta el archivo antes de que toque la red. Como PrivateNote admite archivos adjuntos grandes, usa **encriptación en streaming por fragmentos**: los archivos se encriptan bloque a bloque (normalmente en fragmentos de varios megabytes) para que las subidas grandes no tengan que cargar el archivo entero en memoria de una vez.",
        "Las cuentas gratuitas pueden adjuntar archivos de hasta 25 MB; las cuentas Premium admiten cargas mucho mayores (hasta 1 GB por archivo). En todos los casos, solo texto cifrado llega a nuestros servidores.",
        "La implementación se basa en **AES-GCM** (Authenticated Encryption with Associated Data), proporcionando confidencialidad e integridad:",
      ],
      bullets: [
        "**Confidencialidad** — la carga es ilegible sin la clave.",
        "**Integridad** — la manipulación del texto cifrado en reposo se detecta y rechaza durante el descifrado en el cliente.",
        "Cuando la protección con contraseña está activada, una clave derivada de la contraseña se genera con algoritmos que consumen mucha memoria como **Argon2id**, haciendo impracticable la adivinación por fuerza bruta.",
      ],
    },
    {
      title: "Qué metadatos siguen existiendo",
      level: "primary",
      paragraphs: [
        "Una arquitectura de seguridad rigurosa debe reconocer sus límites. La encriptación en el navegador protege el **contenido** de tus archivos, pero ciertos metadatos siguen siendo visibles para la red y el servicio:",
      ],
      bullets: [
        "Marcas de tiempo de subida y descarga.",
        "El tamaño aproximado de la carga encriptada.",
        "Caducidad, límites de visualización y ventanas de acceso al archivo.",
        "La dirección IP del destinatario al descargar (visible para el servidor web que enruta la solicitud).",
      ],
      callout:
        "Los sistemas centrados en la privacidad minimizan los metadatos donde es práctico, pero ningún servicio web puede eliminarlos por completo. PrivateNote trata los metadatos con la misma disciplina de retención que las cargas encriptadas—se purgan cuando una nota caduca o se elimina.",
    },
    {
      title: "Las compensaciones de la privacidad real",
      level: "primary",
      paragraphs: ["La encriptación en el navegador ofrece máxima privacidad del contenido, pero con compensaciones intencionadas:"],
      bullets: [
        "**Sin escaneo de malware en el servidor** — porque el servidor no puede leer el archivo, no puede escanearlo en busca de virus. Confía en el remitente.",
        "**Sin vistas previas generadas en el servidor** — las miniaturas y vistas previas de documentos se renderizan localmente en el navegador del destinatario tras el descifrado, no en el servidor.",
        "**Sin recuperación de contraseña o clave** — si pierdes el enlace o la clave de encriptación, el proveedor no puede recuperar el archivo. No hay «Olvidé mi contraseña» para datos a los que el anfitrión no puede acceder.",
      ],
    },
    {
      title: "Elegir el servicio adecuado",
      level: "primary",
      paragraphs: [
        "No toda transferencia de archivos requiere encriptación estricta en el navegador. Fotos casuales de vacaciones con la familia pueden bastar con encriptación de transporte.",
        "Si compartes propiedad intelectual, acuerdos legales o datos personales sensibles, hazte una pregunta arquitectónica:",
        "**¿El servicio recibe mi archivo original o solo una versión encriptada?**",
        "Esa única distinción determina quién puede acceder técnicamente a tus datos—no solo hoy, sino a medida que evolucionan las políticas corporativas, la propiedad y las leyes de privacidad.",
      ],
    },
  ],
  closingTitle: "Comparte archivos sin entregar texto plano al servidor",
  closingBody:
    "La transferencia segura de archivos de PrivateNote usa el mismo modelo de encriptación en el navegador que nuestras notas efímeras: encripta localmente, sube texto cifrado, comparte la clave en el fragmento de URL y caduca el acceso según tus condiciones.",
  ctaLabel: "Prueba la transferencia segura de archivos",
  relatedReading: "Lectura relacionada",
};
