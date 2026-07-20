import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyEs: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Desarrollador trabajando en un escritorio con un portátil abierto con código—donde suelen empezar las entregas de claves SSH",
  heroCaption:
    "Las claves privadas SSH pertenecen a entregas cifradas y efímeras—no a Slack, el correo o el historial de git. Imagen: escritorio de programación vía Pixabay.",
  intro: [
    "Un compañero necesita entrar al servidor de staging. Un contratista necesita una clave de despliegue para el fin de semana. El portátil de alguien murió y el único acceso restante es la clave privada en tu máquina.",
    "El camino más rápido suele ser el mismo mal hábito: pegar el bloque PEM en Slack, enviarlo por correo «solo esta vez», o dejarlo en un ticket. Ese mensaje se sincroniza con los teléfonos, aterriza en índices de búsqueda, y puede quedarse en copias de seguridad mucho después de que termine la emergencia.",
    "Las claves privadas SSH son secretos con un radio de explosión alto. Una sola clave filtrada puede significar acceso shell completo. Esta guía cubre cuándo deberías compartir una clave privada, qué nunca pegar en el chat, y cómo entregar una con un enlace cifrado de lectura única (burn-after-reading)—más las extensiones para desarrolladores de PrivateNote que hacen que el camino seguro sea también el rápido.",
  ],
  sections: [
    {
      title: "Clave pública vs. clave privada (30 segundos de claridad)",
      paragraphs: [
        "Un par de claves SSH tiene dos mitades. La clave **pública** está diseñada para compartirse: la añades a `~/.ssh/authorized_keys`, una consola en la nube, o una clave de despliegue de GitHub. Enviar la clave pública de alguien por chat es normal.",
        "La clave **privada** (`id_ed25519`, `id_rsa`, un archivo `.pem`) es el secreto. Quien la tenga puede autenticarse como esa identidad hasta que revoques el acceso. Trátala como una contraseña que abre un servidor—porque eso es exactamente lo que es.",
        "Si tu instinto dice «tenemos que compartir la clave privada», detente. En muchos casos deberías compartir la clave **pública** en su lugar: el destinatario genera su propio par localmente y tú autorizas su clave pública en el host.",
      ],
      calloutTitle: "Regla general",
      callout:
        "Prefiere añadir su clave pública en vez de enviar tu clave privada. Las entregas de clave privada son para casos de recuperación de emergencia (break-glass) y casos legacy—no para el onboarding por defecto.",
    },
    {
      title: "Prefiere no compartir la clave privada",
      paragraphs: [
        "Antes de cifrar y enviar nada, pregúntate si la clave privada realmente necesita moverse:",
      ],
      subsections: [
        {
          title: "Añade su clave pública",
          paragraphs: [
            "Haz que ejecuten `ssh-keygen`, te envíen el archivo `.pub` (seguro en el chat), y lo añadan a `authorized_keys` o a la configuración SSH del proveedor. Ellos conservan la mitad privada; tú nunca la ves.",
          ],
        },
        {
          title: "Usa una clave de despliegue específica",
          paragraphs: [
            "Para CI o un solo repositorio, crea una clave de despliegue dedicada con el alcance mínimo. Evita reutilizar una clave personal de portátil en varios sistemas.",
          ],
        },
        {
          title: "Prefiere el acceso de corta duración",
          paragraphs: [
            "Donde tu stack lo soporte—certificados SSH, hosts bastión (jump hosts), Tailscale SSH, roles IAM en la nube—prefiere el acceso limitado en el tiempo en vez de copiar claves privadas de larga duración.",
          ],
        },
        {
          title: "Cuándo está justificada la entrega de una clave privada",
          paragraphs: [
            "Recuperación de emergencia (break-glass), un host legacy que no puede registrar nuevas claves rápidamente, o una emergencia en la que solo existe una clave protegida por contraseña. Aun así: cifra la transferencia, mantén una caducidad corta, confirma la recepción y luego rota o revoca.",
          ],
        },
      ],
    },
    {
      title: "Dónde mueren las claves SSH en la práctica",
      paragraphs: [
        "Los mismos canales que filtran [claves API](blog:how-to-share-api-key-securely) y [contraseñas](blog:how-to-share-a-password-securely) filtran material SSH—a menudo con peores consecuencias.",
      ],
      comparisonTable: {
        headers: ["Canal", "Por qué falla", "Qué obtienen los atacantes"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Historial buscable, sincronización de dispositivos, exportaciones del workspace",
            "Clave privada completa en texto plano para siempre",
          ],
          [
            "Correo",
            "Bandejas de entrada, archivos, sincronización móvil, reenvíos",
            "Una copia duradera que no puedes borrar de forma fiable",
          ],
          [
            "Tickets y documentos",
            "Jira, Notion, Confluence, issues de GitHub",
            "Claves en copias de seguridad, búsqueda con IA y registros de auditoría",
          ],
          [
            "Repositorios Git",
            "El historial se pega; «borrar y hacer push» no borra nada",
            "Los escáneres encuentran PEM en minutos en repos públicos",
          ],
        ],
        after: [
          "Si el secreto ya apareció en el chat o en git, asume que está quemado. Revoca la clave, genera un nuevo par, y entrega el reemplazo mediante un [enlace cifrado de un solo uso](blog:one-time-secret-links)—no otro pegado. Para fugas de pipeline y `.env`, consulta [secretos en CI/CD y GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Una entrega más segura de claves privadas SSH",
      paragraphs: [
        "Cuando debas mover una clave privada, trata la transferencia como una entrega temporal—no como almacenamiento. Se aplica el mismo patrón usado para contraseñas y claves API: cifrar en local, enviar un enlace, destruir tras la lectura, luego rotar.",
        "PrivateNote cifra en el navegador (o en tu editor/CLI) con AES-256-GCM antes de que nada llegue a la red. La clave de descifrado vive solo en el fragmento de la URL—la parte `#…` que los navegadores nunca envían a los servidores. Detalles: [qué significa aquí el cifrado de extremo a extremo](blog:what-is-end-to-end-encryption) y [cómo hacer una nota privada](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Un flujo de trabajo práctico de recuperación de emergencia:",
      flowSteps: [
        {
          step: "Paso 1",
          title: "Delimita y protege la clave",
          body: "Prefiere una clave dedicada para este host o tarea. Usa una contraseña en la clave privada. Evita enviar tu clave de identidad personal diaria si basta con una clave más limitada.",
        },
        {
          step: "Paso 2",
          title: "Cifra en local",
          body: "Pega solo el material de la clave (no una novela de nombres de host y usuarios) en PrivateNote mediante la [app web](app:home), la [extensión de VS Code / Cursor](app:developers/vscode), la [CLI](app:developers/cli), o la [extensión de Chrome](chrome:extension).",
        },
        {
          step: "Paso 3",
          title: "Envía el enlace—no el PEM",
          body: "Comparte el enlace cifrado en Slack o por correo. Opcionalmente activa el envoltorio con contraseña y envía esa contraseña por un canal separado ([consejo de canal dividido](blog:how-to-share-a-password-securely)). Prefiere una caducidad de 15 minutos o 1 hora y lectura única.",
        },
        {
          step: "Paso 4",
          title: "Confirma y luego rota",
          body: "El destinatario instala la clave con los permisos correctos (`chmod 600`), confirma el acceso, y luego revocas la clave antigua o la rotas. Trata cualquier clave que haya estado en un prompt de IA como vista—rótala.",
        },
      ],
      midCta: {
        body: "¿Necesitas entregar una clave SSH ahora? Crea una nota cifrada de un solo uso y envía el enlace en lugar de la clave privada.",
        button: "Crear una nota privada",
      },
    },
    {
      title: "Extensiones para desarrolladores: comparte claves SSH desde donde trabajas",
      paragraphs: [
        "Las entregas fallan cuando la herramienta segura está a tres clics más lejos que Slack. Las integraciones de PrivateNote mantienen el cifrado en tu editor, navegador, terminal o flujo de trabajo de agente. Recorrido completo: [PrivateNote para desarrolladores](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Tu situación", "Mejor opción"],
        rows: [
          [
            "La clave ya está abierta en el editor",
            "Extensión de IDE VS Code / Cursor / Codex — seleccionar → compartir como PrivateNote",
          ],
          [
            "La clave está en una página web o ticket",
            "Extensión de Chrome — resaltar → Crear PrivateNote",
          ],
          [
            "Estás en una terminal",
            "CLI — canaliza el archivo para que el PEM nunca esté en el historial de la shell",
          ],
          [
            "Quieres que un agente genere el enlace",
            "Servidor MCP — luego rota; prefiere la extensión del editor para claves privadas",
          ],
          [
            "El destinatario no es técnico",
            "Enlace de la app web en privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor y Codex IDE",
          paragraphs: [
            "Instala desde el marketplace (`PrivateNote.privatenote-vscode`), selecciona el bloque de la clave, y usa **Share as PrivateNote**—o abre el compositor de la barra lateral. El cifrado se ejecuta en el proceso host del editor, así que el texto plano nunca tiene que entrar en un chat de IA. Configuración: [extensión de VS Code / Cursor](app:developers/vscode).",
          ],
        },
        {
          title: "Extensión de Chrome",
          paragraphs: [
            "Cuando una clave aparece en un ticket, una página de documentación o una consola de administración, resáltala y crea una nota cifrada sin copiarla primero en Slack. Instalación: [extensión de Chrome](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Canaliza desde un archivo para que el secreto no sea un argumento de `echo` en el historial de la shell: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Documentación: [CLI de PrivateNote](app:developers/cli).",
          ],
        },
        {
          title: "MCP para Cursor, Claude y Codex",
          paragraphs: [
            "Los agentes pueden llamar a `create_private_note` tras instalar [privatenote-mcp](app:developers/mcp). Útil para orquestación—pero si pegas la clave privada en el prompt del agente, el proveedor del modelo podría verla antes del cifrado. Para claves privadas SSH, prefiere la extensión del editor o de Chrome. Configuración específica de Codex: [PrivateNote con Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Aclaración honesta",
      callout:
        "MCP cifra después de que el agente lee el prompt. La exposición persistente en chat/correo desaparece; la visibilidad del proveedor de IA no. Para claves privadas, usa la extensión de VS Code o Chrome para que el texto plano nunca salga de tu máquina antes de convertirse ya en texto cifrado.",
    },
    {
      title: "Buenas prácticas y errores comunes",
      subsections: [
        {
          title: "Nunca hagas commit de claves privadas",
          paragraphs: [
            "Mantén `id_*` y `*.pem` fuera de los repositorios. Añádelos al `.gitignore`. Si una clave llegó al historial de git, rótala—reescribir el historial ya no basta una vez que el repositorio se ha clonado o escaneado.",
          ],
        },
        {
          title: "Corrige los permisos de archivo",
          paragraphs: [
            "Las claves privadas deben tener `chmod 600` (o `400`). SSH rechazará archivos de clave demasiado permisivos en muchos sistemas—y las claves legibles por todos en máquinas compartidas son un autogol.",
          ],
        },
        {
          title: "No pongas contexto dentro de la nota",
          paragraphs: [
            "Pon solo el material de la clave en la nota cifrada. Envía el nombre de host, usuario y puerto en un mensaje separado. Si el enlace se filtra, el atacante no debería obtener también un mapa etiquetado de lo que desbloquea.",
          ],
        },
        {
          title: "Contraseña y canales separados",
          paragraphs: [
            "Protege con contraseña el propio archivo de clave, y opcionalmente envuelve la PrivateNote con una contraseña separada enviada por otro canal. Misma recomendación que en [cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "El reenvío de agente no es una estrategia de compartición",
          paragraphs: [
            "El reenvío de agente SSH puede reducir las copias de clave en hosts remotos, pero no sustituye una distribución cuidadosa de claves—y amplía la confianza a cada salto por el que reenvías. Úsalo deliberadamente, no como excusa para enviar PEM por correo.",
          ],
        },
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Es seguro enviar una clave pública por Slack?",
          answer:
            "Sí. Las claves públicas están hechas para distribuirse. Aun así evita volcar directorios `~/.ssh` completos—la gente incluye archivos privados por accidente.",
        },
        {
          question: "¿Puedo guardar una clave privada SSH en un gestor de contraseñas?",
          answer:
            "Para el almacenamiento a largo plazo de claves que conservas, un gestor de contraseñas o un agente respaldado por hardware es apropiado. Usa un enlace cifrado de un solo uso para el momento de entrega de persona a persona—luego el destinatario almacena la clave correctamente. PrivateNote es entrega, no una bóveda de secretos.",
        },
        {
          question: "¿Debería compartir la clave y la contraseña juntas?",
          answer:
            "No. Eso recrea un único punto de fallo. Envía el enlace cifrado por un canal y cualquier contraseña por otro—o haz que el destinatario establezca su propia contraseña tras la instalación y rote.",
        },
        {
          question: "¿Qué caducidad debería usar?",
          answer:
            "Para coordinación en vivo, 15 minutos con lectura única. Para entregas asíncronas a contratistas, 1 hora o 1 día como máximo. Prefiere lo más corto siempre que el destinatario esté disponible.",
        },
        {
          question: "¿Es PrivateNote un sustituto de Vault o de gestores de secretos en la nube?",
          answer:
            "No. Usa Vault, AWS Secrets Manager y herramientas similares para almacenamiento e inyección máquina a máquina. Usa PrivateNote para el momento de persona a persona cuando una clave debe cruzar el chat o el correo sin convertirse en un archivo permanente. Misma distinción que en la [guía de claves API](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Reflexiones finales",
      paragraphs: [
        "La mayoría de los problemas de «compartición» SSH son en realidad problemas de inscripción: añade una clave pública, usa una clave de despliegue, o emite un acceso de corta duración. Cuando una clave privada deba moverse, no la dejes en el [historial de chat](blog:secrets-never-send-in-chat) ni en el [correo](blog:why-email-is-worst-for-secrets).",
        "Cifra en local, envía un enlace autodestructivo, confirma la instalación, y luego rota. Conecta las [herramientas para desarrolladores](app:developers) que ya usas para que el camino seguro sea también el camino de menor resistencia.",
      ],
    },
  ],
  ctaTitle: "Comparte el enlace—no la clave privada",
  ctaBody:
    "Crea una PrivateNote cifrada en el navegador con caducidad corta y lectura única. O cifra desde la extensión de VS Code, la CLI, o la extensión de Chrome para que el PEM nunca llegue en texto plano a Slack.",
  ctaButton: "Crear una nota privada",
};
