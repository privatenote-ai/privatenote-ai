import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiEs: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Persona trabajando en un escritorio doméstico con un portátil que muestra una visualización de red neuronal y un servidor local de IA compacto a su lado",
  intro: [
    "**La IA privada** significa ejecutar un modelo de lenguaje grande en hardware que controlas directamente—tu portátil, tu navegador o un servidor en tu oficina—de modo que tu texto de entrada nunca se envía a una nube de terceros para la inferencia. Es la respuesta práctica a una pregunta sencilla: *¿puedo obtener ayuda de alta calidad de la IA sin entregar mis palabras al ordenador de otra persona?*",
    "Esa pregunta importa cada vez más. Los asistentes en la nube son notablemente potentes, pero procesan tus indicaciones en infraestructura remota. Para notas, credenciales, borradores legales, información de salud o cualquier cosa que no pegarías en un chatbot público, la IA local y en el navegador ya no es una curiosidad de aficionados. Es un requisito de seguridad vital.",
    "Esta guía recorre cómo evolucionó la IA privada, por qué los grandes laboratorios publican pesos de modelos, las principales formas de ejecutar modelos localmente, los proyectos de código abierto y familias de modelos que más importan, dónde se sitúa el estado del arte en 2026—y cómo encaja [PrivateNote](app:home) con **Write with Private AI**, que se ejecuta íntegramente dentro de la pestaña de tu navegador.",
  ],
  sections: [
    {
      title: "Una breve evolución: de los laboratorios a tu portátil",
      paragraphs: [
        "Durante años, los modelos de lenguaje útiles vivieron casi exclusivamente dentro de gigantes tecnológicos con enormes clústeres de GPU. El entrenamiento requería millones de dólares en cómputo, equipos especializados y conjuntos de datos propietarios. Si querías asistencia de IA, usabas una API o una aplicación web en la nube—y tu texto salía de tu máquina.",
        "Tres cambios en la industria transformaron por completo ese panorama:",
      ],
      bullets: [
        "**Leyes de escalado de Transformers** — La investigación demostró que modelos bien entrenados con conjuntos de datos grandes y de alta calidad podían ofrecer capacidades sorprendentemente generales—no solo a escala de frontera.",
        "**Publicaciones de pesos abiertos** — Empezando con la familia Llama de Meta y seguida por Mistral, Google Gemma, Alibaba Qwen y otros, los parámetros descargables llegaron a desarrolladores de todo el mundo.",
        "**Madurez de las herramientas de inferencia** — Proyectos como llama.cpp, Ollama, vLLM, WebLLM y Transformers.js hicieron práctico ejecutar esos pesos en hardware de consumo.",
      ],
      callout:
        "En 2026, la brecha entre «solo en la nube» y «funciona en mi dispositivo» se ha reducido drásticamente. Los modelos de frontera en la nube siguen siendo más grandes y rápidos, pero los modelos abiertos pequeños y medianos son muy capaces para redactar, resumir, reescribir y responder preguntas cotidianas—especialmente para textos breves como notas.",
    },
    {
      title: "Por qué las empresas publican pesos de modelos",
      paragraphs: [
        "Publicar pesos no es caridad. Los laboratorios difunden parámetros por razones estratégicas que moldean todo el ecosistema.",
      ],
      bullets: [
        "**Apalancamiento del ecosistema** — Cuando los desarrolladores construyen sobre tu modelo, tu arquitectura se convierte en un estándar. Los fine-tunes, herramientas e integraciones siguen a los pesos.",
        "**Credibilidad investigadora** — Los pesos abiertos invitan al escrutinio, la reproducibilidad y la adopción académica. Esa visibilidad refuerza el liderazgo técnico.",
        "**Posicionamiento regulatorio y de confianza** — Actores europeos como Mistral y marcas globales como Meta y Google usan publicaciones abiertas para señalar transparencia y diferenciarse de las APIs totalmente cerradas.",
        "**Destilación y especialización** — Modelos más pequeños entrenados a partir de otros mayores difunden la capacidad hacia abajo. Publicar los pesos padre acelera esa cadena en toda la comunidad.",
        "**Presión competitiva** — Una vez que un gran laboratorio publica abiertamente un modelo sólido, los demás enfrentan presión para igualarlo o arriesgan perder la atención de los desarrolladores.",
      ],
      callout:
        "Los pesos abiertos no siempre son «código abierto» en sentido estricto. Las licencias pueden restringir el uso comercial, exigir atribución o excluir ciertos dominios. Lee siempre la ficha del modelo antes de desplegar en producción.",
    },
    {
      title: "Tres formas de desplegar IA privada",
      paragraphs: [
        "No hay una única arquitectura mejor. La elección correcta depende de tu hardware, tus requisitos de privacidad y de si necesitas un generalista de 70 mil millones de parámetros o un asistente rápido para notas breves.",
      ],
      beforeFlowSteps: "La mayoría de los despliegues de IA privada encajan en uno de estos patrones:",
      flowDiagramCaption: "Tres patrones de despliegue de un vistazo",
      flowSteps: [
        {
          step: "Opción 1",
          title: "Entornos de aplicación local (Ollama y apps de escritorio)",
          body: "Herramientas como [Ollama](https://ollama.com), LM Studio y GPT4All descargan pesos de modelos y los ejecutan de forma nativa en tu Mac, Windows o Linux. Obtienes inferencia sin conexión, aceleración GPU nativa y acceso a modelos más grandes de los que un navegador puede cargar cómodamente. Compromisos: espacio en disco considerable (a menudo decenas de gigabytes por modelo), RAM o VRAM dedicada y actualizaciones manuales.",
        },
        {
          step: "Opción 2",
          title: "Entornos sandbox (WebGPU en el navegador)",
          body: "Los navegadores modernos exponen **WebGPU**, que permite a JavaScript ejecutar redes neuronales en tu GPU sin instalar nada. Proyectos como WebLLM, MLC LLM y Transformers.js compilan modelos para la web. Sacrificas tamaño de modelo y velocidad bruta, pero ganas una propiedad notable: **tu indicación nunca sale de la pestaña del navegador para la inferencia**. Sin cuenta, sin ida y vuelta al servidor, sin proveedor que registre tu borrador.",
        },
        {
          step: "Opción 3",
          title: "Cómputo dedicado (servidores domésticos u oficina)",
          body: "Los equipos con GPU NVIDIA dedicadas, un Mac Studio o un pequeño servidor en rack suelen ejecutar **vLLM**, **llama.cpp** u Ollama como endpoint interno compartido. Este es el patrón para IA privada de máxima calidad: ventanas de contexto grandes, modelos mayores y varios usuarios en una LAN. Compromisos: coste de hardware, energía, refrigeración y mantenimiento operativo continuo.",
        },
      ],
      afterFlowSteps: [
        "El hilo conductor es el mismo en los tres casos: **la inferencia ocurre en infraestructura que controlas**, no en una nube multiinquilino donde tu texto se convierte en carga de procesamiento de otra persona.",
      ],
    },
    {
      title: "Proyectos de código abierto que más importan",
      paragraphs: [
        "Los modelos son solo la mitad de la historia. Estos proyectos fundamentales convirtieron pesos en bruto en software que millones de personas pueden ejecutar de verdad.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Inferencia C/C++ de alta eficiencia; la base de innumerables despliegues locales en CPU y GPU.",
        "**[Ollama](https://ollama.com)** — Una experiencia amigable de CLI y escritorio para descargar, actualizar y chatear con modelos localmente.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Servicio por lotes de alto rendimiento para servidores GPU compartidos de equipo y cargas de trabajo a escala de API.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — La biblioteca y el hub de facto para descubrir, descargar, ajustar y compartir modelos.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compila modelos para ejecución nativa en el navegador sin instalación, vía WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Ejecuta modelos exportados a ONNX directamente en JavaScript—otro camino hacia la inferencia en el navegador.",
      ],
    },
    {
      title: "Familias de modelos que conviene conocer",
      paragraphs: [
        "Cada mes aparecen docenas de checkpoints. Cuatro familias dominan las conversaciones sobre IA privada en 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 y las líneas más recientes Llama 4 fijan el referente para generalistas de pesos abiertos: razonamiento sólido, amplio soporte de herramientas y un enorme ecosistema de fine-tunes.",
        "**Google Gemma** — Las familias Gemma 2, Gemma 3 y **Gemma 4** se centran en la eficiencia—buen rendimiento por parámetro, excelentes modelos pequeños y variantes ajustadas para inferencia en dispositivo y alojada.",
        "**Mistral AI (Europa)** — Mistral, con sede en París, ofrece modelos compactos y capaces (Mistral, Mixtral, Codestral) con licencias amigables para desarrolladores y una narrativa europea clara sobre soberanía de datos.",
        "**Alibaba Qwen** — Las series Qwen 2.5 y **Qwen 3** destacan en tareas multilingües y ofrecen variantes diminutas (menos de 1B parámetros) que funcionan excepcionalmente bien en portátiles modestos y hardware de navegador.",
      ],
      callout:
        "La IA en el navegador de PrivateNote usa **Gemma 2 2B** y **Qwen3 0.6B** vía WebLLM—modelos de pesos abiertos compilados para WebGPU, no un checkpoint cerrado y propietario. Las variantes mayores de **Gemma 4** aparecen en la ruta opcional de Cloud Assist, no en Write with Private AI hoy.",
    },
    {
      title: "Estado del arte en 2026",
      paragraphs: [
        "La frontera está dividida. Las APIs cerradas de OpenAI, Anthropic y Google siguen liderando en capacidad bruta, uso de herramientas a escala y las ventanas de contexto más grandes. Pero los pesos abiertos están lo bastante cerca para muchos flujos de trabajo reales—y van por delante en **privacidad, control de costes y personalización**.",
        "Entre los modelos abiertos, **Gemma 4**, **Llama 4**, **Qwen 3** y los grandes checkpoints de **Mistral** representan la generación actual: mejor seguimiento de instrucciones, programación y matemáticas mejoradas, y rechazos más fiables ante indicaciones sensibles. Las variantes destiladas más pequeñas aportan una porción significativa de esa calidad a portátiles y navegadores.",
        "Los modelos multimodales (texto + imagen) se expanden tanto en publicaciones en la nube como abiertas, pero para tomar notas y entregas secretas, los modelos pequeños solo de texto siguen siendo el punto óptimo: lo bastante rápidos para sentirse interactivos, lo bastante pequeños para permanecer locales.",
      ],
    },
    {
      title: "IA privada en PrivateNote: Write with Private AI",
      paragraphs: [
        "PrivateNote está diseñado para notas cifradas y efímeras—no para sustituir todo tu stack de IA. Aun así, redactar un mensaje sensible es exactamente donde brilla la IA en el navegador: obtienes ayuda de escritura **antes** del cifrado, sin enviar tu texto a nuestros servidores para la inferencia.",
        "Abre [PrivateNote](app:home) y elige **Write with Private AI**. No hay selector manual de modelo—en escritorios compatibles con WebGPU, el nivel de tu dispositivo decide qué checkpoint se ejecuta:",
        "Sé honesto sobre los compromisos. Los pesos se descargan en el almacenamiento del navegador y la inferencia se ejecuta localmente—pero la IA en el navegador es **más lenta** que un centro de datos en la nube y no puede igualar las **grandes ventanas de contexto** de modelos de clase servidor. También depende del hardware: muchos teléfonos y portátiles antiguos recurren a escribir sin IA o al Cloud Assist opcional. Pero para redactar una nota privada breve, un mensaje de entrega de contraseña o una respuesta confidencial, es **bastante capaz**—y las propiedades de privacidad son fundamentalmente distintas de los flujos de pegar en ChatGPT.",
      ],
      bullets: [
        "**Hardware modesto** — Carga **Qwen3 0.6B** y ejecuta la inferencia localmente vía WebGPU.",
        "**Escritorios capaces** — Carga **Gemma 2 2B** y ejecuta la inferencia localmente vía WebGPU.",
        "**Privado por arquitectura** — Con Write with Private AI, tu borrador se procesa en el navegador. No se envía a los servidores de PrivateNote para la inferencia del modelo.",
        "**Cifrar tras redactar** — Cuando estés satisfecho con el texto, la nota se cifra localmente antes de subirla—el mismo modelo que en cualquier otra PrivateNote.",
        "**Cloud Assist opcional** — Si tu dispositivo no puede ejecutar modelos locales, puedes optar por Cloud Assist (Google **Gemma 4 26B** vía Cloudflare Workers AI). Esa ruta es más rápida y capaz, pero **no es totalmente privada**—tu indicación sale del dispositivo en texto plano y debes activarla explícitamente. Consulta [cómo funciona PrivateNote](app:how-it-works) para la comparación completa.",
        "**La herramienta adecuada para cada tarea** — Usa la IA privada del navegador para borradores sensibles. Usa Ollama o un servidor GPU doméstico cuando necesites documentos largos, contexto enorme o los modelos abiertos más grandes.",
      ],
      callout:
        "La IA privada en el navegador no intenta superar a los modelos de frontera en la nube en benchmarks. Intenta hacer **práctica la redacción privada** para las notas que la gente ya crea en PrivateNote.",
    },
    {
      title: "Elegir tu configuración de IA privada",
      paragraphs: [
        "Si eres nuevo en la IA privada, empieza de forma sencilla: instala Ollama y prueba un checkpoint mediano de Llama o Gemma para la escritura cotidiana en tu portátil.",
        "Si tu modelo de amenazas exige que los borradores nunca salgan del dispositivo—incluso antes del cifrado—usa herramientas en el navegador, incluido Write with Private AI dentro de PrivateNote. La soberanía de datos y la automatización inteligente ya no se contradicen; simplemente ajustas la sensibilidad del texto a la arquitectura que lo ejecuta.",
        "Si estás asegurando un equipo, evalúa un servidor GPU compartido con vLLM y controles de acceso—y lee [asegurar agentes de IA como empleados](blog:securing-ai-agents-like-employees) para entender cómo los sistemas agénticos cambian el límite de confianza. Para desarrolladores que integran agentes en flujos de trabajo, consulta [PrivateNote para desarrolladores](blog:privatenote-for-developers) y la [integración Codex MCP](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Prueba la redacción privada en tu navegador",
  closingBody: [
    "Abre PrivateNote, selecciona Write with Private AI y redacta tu próxima nota sensible sin enviarla a un modelo en la nube externo. Cifra cuando estés listo—y comparte un enlace seguro de un solo uso.",
  ],
  fileSharingNote:
    "¿También compartes archivos? [Transferencia segura de archivos](app:secure-file-transfer) usa el mismo cifrado en el navegador. Enviar requiere una cuenta gratuita; los destinatarios abren enlaces sin registrarse.",
  tagline: "Redacta localmente. Cifra primero. Comparte un enlace.",
  relatedReading: "Lecturas relacionadas",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "A medida que los agentes de IA ganan herramientas y memoria, la seguridad debe gobernar todo el sistema—no solo el modelo.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Comparte secretos desde VS Code, Cursor o un agente de IA sin pegarlos en el historial del chat.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Cifra antes de subir, comparte un enlace y deja que la nota expire—paso a paso.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Quién guarda las claves y por qué el cifrado en el navegador difiere de HTTPS por sí solo.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Herramientas de privacidad prácticas más allá de mejores hábitos.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Por qué las notas efímeras superan a los registros de chat permanentes para mensajes sensibles en el trabajo.",
    },
  ],
};
