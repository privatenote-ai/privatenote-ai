import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersEs: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Necesitas enviar una contraseña a un colega. Quizás es la base de datos de staging. Quizás es una clave Stripe que está a punto de ir a producción. Quizás es una credencial SSH para un servidor al que solo tú y otras dos personas deberían acceder.",
    "Abres Slack. Empiezas a escribir. Y entonces — una pequeña hesitación familiar.",
    "Ese mensaje va a quedarse en tu historial de chat. Se va a sincronizar en tres dispositivos. Puede acabar en una copia de seguridad, un índice de búsqueda, un archivo de cumplimiento. Mucho después de rotar la credencial y olvidarte de ella, ese mensaje sigue ahí.",
    "PrivateNote es un camino diferente. El secreto se cifra en tu máquina antes de tocar cualquier red. La clave de descifrado vive solo en la URL que compartes — el servidor que almacena la nota nunca la ve. La nota se autodestruye tras la primera lectura. Nada persiste.",
    "Así se usa — empezando por la opción más sencilla.",
  ],
  sections: [
    {
      title: "La extensión de VS Code y Cursor",
      body: [
        "Si pasas tus días en VS Code o Cursor, este es el camino más fluido. Instala la extensión una vez y quedará en tu barra lateral, siempre a un clic de distancia.",
        "Abre el panel de Extensiones (Cmd+Shift+X), busca PrivateNote y haz clic en Instalar. Tras recargar la ventana, aparece un pequeño icono de sobre en la barra de actividades a la izquierda.",
        "Haz clic en él. Se abre un panel:",
      ],
      bullets: [
        "Escribe o pega el secreto en el campo de contenido",
        "Establece una expiración — 15 minutos, 1 hora, 1 día o 7 días",
        'Deja marcado «Quemar después de leer» (predeterminado)',
        "Haz clic en Compartir PrivateNote →",
      ],
    },
    {
      title: "Qué ocurre cuando haces clic en Compartir",
      body: [
        "La criptografía integrada de tu navegador genera una clave aleatoria de 256 bits. Esa clave nunca sale de tu máquina.",
        "El contenido se cifra con AES-256-GCM. El resultado es un blob de texto cifrado sin contenido legible.",
        "Solo ese texto cifrado se envía al servidor PrivateNote. La clave no va incluida — ni en el cuerpo de la solicitud, ni en una cabecera, en ningún sitio.",
        "El servidor almacena el blob cifrado y devuelve un ID de nota. Tu máquina construye una URL compartible: el ID de la nota en la ruta, la clave de descifrado en el fragmento de la URL — la parte #que los navegadores nunca envían a los servidores.",
        "El enlace se copia al portapapeles. Lo pegas donde normalmente pegarías el secreto. La diferencia es que ahora el secreto es el enlace, no la contraseña en sí.",
      ],
    },
    {
      title: "Otras dos formas de usar la extensión",
      body: [
        "No siempre necesitas abrir el panel. Hay dos atajos más rápidos:",
        "Selecciona cualquier texto en tu editor y haz clic derecho — verás Share as PrivateNote en el menú contextual. Un quick-pick pregunta por la expiración y la preferencia de destrucción, luego el enlace se copia al portapapeles.",
        "Cuando tienes texto seleccionado, también aparece un icono de candado en la barra de título del editor arriba a la derecha. Un clic lo envía.",
      ],
    },
    {
      title: "Si usas un asistente de IA: el servidor MCP",
      body: [
        "Si trabajas en Cursor con Claude u otro modelo, puedes dejar que la IA cree PrivateNotes en tu nombre. El servidor MCP (Model Context Protocol) añade una herramienta create_private_note que el agente puede llamar automáticamente.",
        "Añade esto a ~/.cursor/mcp.json:",
      ],
      code: mcpConfig,
      bullets: [
        "Reinicia Cursor y comprueba Settings → MCP — deberías ver privatenote con un punto verde",
        'Luego dile al agente: «Envía esta clave API de forma segura, quemar después de leer»',
        "El agente llama a la herramienta, el cifrado se ejecuta localmente y obtienes un enlace",
      ],
    },
    {
      title: "Algo que debes entender sobre la IA y los secretos",
      body: [
        "Cuando incluyes un secreto en un prompt de IA, el modelo lo lee antes de que la herramienta MCP lo cifre. Los servidores del proveedor de IA ven brevemente el contenido.",
        "Sigue siendo una mejora significativa frente a enviarlo por Slack — el secreto no acaba en el historial persistente del chat, el correo o los registros del servidor. Pero no es lo mismo que decir que la IA nunca lo vio.",
        "Para privacidad de extremo a extremo completa con un agente de IA, usa un modelo local en tu máquina (como Ollama). Entonces nada sale de tu ordenador hasta que ya está cifrado.",
      ],
    },
    {
      title: "Sin instalación: la aplicación web",
      body: [
        "Si no estás en VS Code, o estás en una máquina sin tu configuración habitual, la aplicación web en privatenote.ai hace lo mismo en cualquier navegador.",
        "Pega tu secreto, elige una expiración, haz clic en Create. Comparte el enlace. La lógica de cifrado se ejecuta en tu navegador — el mismo AES-256-GCM, la misma arquitectura de clave en el fragmento.",
      ],
    },
    {
      title: "Qué recordar",
      body: [
        "El enlace contiene la clave de descifrado. Trata la URL con el mismo cuidado que el secreto en sí — no la publiques en un canal público.",
        "Una vez que se abre una nota de quemar después de leer, el enlace está muerto. Ni tú ni el destinatario podéis volver a abrirlo.",
        "Si has escrito un secreto en un prompt de IA, considera rotarlo después de compartir. El prompt fue visto. El enlace de PrivateNote no — pero la credencial subyacente sí.",
        "Para secretos que deben persistir, usa un gestor de secretos adecuado. PrivateNote es para la entrega, no para el almacenamiento.",
      ],
    },
  ],
  ctaTitle: "Comparte tu primera nota privada",
  ctaBody: "Instala la extensión de VS Code o prueba la aplicación web — no se requiere cuenta para notas de una sola lectura.",
  ctaButton: "Probar PrivateNote →",
};
