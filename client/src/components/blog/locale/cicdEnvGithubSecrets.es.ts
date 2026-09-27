import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsEs: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Portátil de desarrollador en un escritorio de noche mostrando un terminal y archivos de configuración bajo luz azul fría",
  heroCaption:
    "La mayoría de filtraciones de secretos empiezan por comodidad: un .env commiteado, una variable de CI pegada, o una clave que nunca salió del historial de Git.",
  intro: [
    "Las claves API no suelen filtrarse por ataques criptográficos ingeniosos. Se filtran por flujos de trabajo de desarrolladores—archivos `.env` subidos a Git, secretos ecoados en logs de CI y credenciales pegadas en pull requests «solo por ahora».",
    "Si ya sabes [cómo compartir una clave API de forma segura](blog:how-to-share-api-key-securely), esta guía es la siguiente capa: dónde escapan realmente esas claves en la entrega moderna de software, y cómo evitar que GitHub, CI/CD y la configuración local se conviertan en un archivo permanente de tu acceso a producción.",
    "El patrón es siempre el mismo. Un secreto entra en un sistema diseñado para conservar historial. Meses después, un fork, una exportación de logs, un portátil comprometido o un escaneo de un repo público convierte esa comodidad en un incidente.",
  ],
  sections: [
    {
      title: "Por qué los archivos .env y CI/CD atraen fugas de desarrolladores",
      paragraphs: [
        "Los archivos de entorno locales y las pipelines existen para mover configuración rápido. Esa velocidad es útil—y peligrosa—porque los secretos suelen viajar con las mismas herramientas que usas para code review, artefactos de build y automatización.",
        "Un archivo `.env` parece temporal. Un secreto en CI se siente «resuelto». Un `echo $DATABASE_URL` de depuración parece inofensivo en un repo privado. Los atacantes—y los escáneres automáticos de secretos—no se preocupan de si la exposición fue intencional. Les importa la permanencia, la buscabilidad y el radio de impacto.",
        "Trata cada secreto que toque Git o CI como si eventualmente se copiara, espejara o indexara. Diseña el flujo para que esa hipótesis sea sobrevivible: credenciales de corta duración, almacenes de secretos adecuados y entregas humanas que no dejen texto plano en el chat o en tickets.",
      ],
    },
    {
      title: "Cómo escapan los secretos a través de GitHub",
      subsections: [
        {
          title: "Archivos .env y de configuración commiteados",
          paragraphs: [
            "La fuga clásica sigue siendo la más común: `cp .env.example .env`, rellenar valores de producción y luego `git add .` sin darse cuenta. Aunque borres el archivo en el siguiente commit, el secreto permanece en el historial de Git hasta que lo reescribas—y los repositorios públicos pueden escanearse muy rápido en busca de credenciales expuestas. Reescribir el historial tampoco borra todas las copias: forks, mirrors, cachés de CI y clones locales pueden seguir teniendo los commits antiguos.",
            "Las variantes incluyen `docker-compose.yml` con contraseñas en duro, estado de Terraform con outputs sensibles, manifiestos de Kubernetes que almacenan «secretos» en base64 (base64 es codificación, no cifrado—quien pueda leer el manifiesto puede decodificar el valor) y celdas de notebook que imprimen tokens. Si parece configuración, asume que los escáneres lo tratarán como un volcado de credenciales.",
          ],
        },
        {
          title: "Pull requests, issues y comentarios",
          paragraphs: [
            "Los desarrolladores pegan claves de staging en descripciones de PR para «ayudar al revisor a reproducir el bug». Los comentarios de tickets y GitHub Discussions heredan el mismo problema: permanencia buscable, notificaciones, resúmenes por email y exportaciones.",
            "Los repositorios privados reducen mucho la exposición casual, pero siguen sin ser un almacén de secretos adecuado. Cambios de acceso, contratistas, cuentas comprometidas, clones, backups e integraciones pueden resurgir texto plano histórico. Para entregas de claves API entre personas, usa un [enlace de un solo uso cifrado en el cliente](blog:one-time-secret-links)—no un comentario de PR.",
          ],
        },
        {
          title: "Forks, mirrors e historial que nunca muere",
          paragraphs: [
            "Una clave commiteada una vez puede sobrevivir en forks, mirrors, cachés de CI y clones locales mucho después de limpiar la rama principal. La rotación del secreto es la remediación real; reescribir el historial es control de daños.",
            "Si se dispara GitHub Secret Scanning, TruffleHog, gitleaks o una alerta del proveedor cloud, rota primero. Luego quita el secreto de las ramas activas. Solo entonces decide si reescribir el historial merece el coste de coordinación.",
          ],
        },
      ],
      calloutTitle: "Regla dura",
      callout:
        "Nunca commits secretos en vivo a Git—ni siquiera credenciales temporales de staging. Si un secreto debe moverse entre personas, usa un canal de entrega seguro adecuado, como un enlace de un solo uso cifrado en el cliente. Si la automatización necesita el secreto, usa el mecanismo nativo de secretos de la plataforma CI, un gestor de secretos dedicado o, preferiblemente, credenciales de corta duración obtenidas mediante workload identity u OIDC—no el repositorio.",
    },
    {
      title: "Cómo escapan los secretos a través de CI/CD",
      subsections: [
        {
          title: "Texto plano en archivos de workflow",
          paragraphs: [
            "Poner `API_KEY: sk-...` directamente en `.github/workflows/*.yml`, YAML de GitLab CI o config de CircleCI es solo committear un secreto con pasos extra. Los archivos de workflow son código. Se revisan, se clonan y se conservan para siempre.",
            "Usa el mecanismo nativo de secretos de la plataforma (secretos de GitHub Actions, variables de GitLab CI/CD y equivalentes) y referéncialos como bindings de entorno—no YAML hardcodeado. Los secretos nativos de CI son mucho mejores que el repositorio, pero no son magia: lógica maliciosa de workflow, dependencias comprometidas y logging descuidado aún pueden exponer valores en runtime. Prefiere OIDC u otra federación de identidad de carga de trabajo hacia proveedores cloud para no necesitar claves cloud de larga duración en CI.",
          ],
        },
        {
          title: "Logs de pipeline y salida de depuración",
          paragraphs: [
            "Los logs de build son un archivo infravalorado. Imprimir variables de entorno «para depurar el deploy», volcar `process.env` o ejecutar salida verbose de Terraform/Helm puede escribir credenciales en almacenamiento de logs que sobrevive al job.",
            "Asume que los logs son legibles por cualquiera con acceso a CI—y a veces por cualquiera que pueda descargar artefactos. Enmascara secretos, evita volcar el env y trata una línea de log filtrada como una contraseña filtrada: rota.",
          ],
        },
        {
          title: "Pull requests desde forks",
          paragraphs: [
            "Las PR de forks son una trampa clásica de CI: código no confiable ejecutándose con secretos. La mayoría de plataformas restringen la disponibilidad de secretos en workflows de forks precisamente por eso. Manténlo así. Nunca «actives secretos» para contribuidores externos solo para poner un check en verde.",
            "En repos internos, separa igual los jobs de deploy privilegiados de los checks de PR. Build y test con el mínimo privilegio; deploy solo desde ramas de confianza con secretos concedidos explícitamente.",
          ],
        },
        {
          title: "Runners compartidos y fuga de artefactos",
          paragraphs: [
            "Los runners self-hosted, las cachés compartidas y los artefactos subidos pueden retener tokens más tiempo que el job que los creó. Limpia workspaces, delimita bien las claves de caché y nunca empaquetes archivos `.env` en artefactos de build «por comodidad».",
          ],
        },
      ],
    },
    {
      title: "Un modelo mental más seguro: tres lugares donde pueden vivir los secretos",
      paragraphs: [
        "La confusión surge cuando los equipos usan una herramienta para cada trabajo. Divide el problema por ciclo de vida.",
      ],
      comparisonTable: {
        headers: ["Lugar", "Ideal para", "No para"],
        rows: [
          [
            "Local .env / dotenv",
            "Config de desarrollo local que permanece en el portátil y está correctamente en gitignore",
            "Compartir con compañeros, CI, Git, o secretos de producción de larga duración en texto plano",
          ],
          [
            "Secretos nativos de CI / Vault / cloud secret manager",
            "Runtime máquina a máquina y automatización de deploy",
            "Entregas humanas por chat o mensajes de larga duración «pásaselo al contratista»",
          ],
          [
            "Nota de un solo uso cifrada en el cliente",
            "Entrega persona a persona de una clave, token o fragmento .env",
            "Almacenar secretos de producción para apps o pipelines",
          ],
        ],
        after: [
          "Un `.env` en gitignore está bien para desarrollo local. Los secretos sensibles de producción idealmente tampoco deberían vivir indefinidamente en texto plano en máquinas de desarrolladores—prefiere un gestor de contraseñas o acceso de corta duración cuando sea práctico. PrivateNote está en la tercera fila: entrega segura entre personas. No sustituye los secretos de GitHub Actions, HashiCorp Vault, AWS Secrets Manager ni tu gestor de contraseñas. Para entregas diarias de claves API, combínalo con [cómo compartir una clave API de forma segura](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Flujo práctico: mantener los secretos fuera de Git y del chat",
      flowIntro:
        "Cuando un compañero, contratista o cliente necesita un valor que acabará en CI o en un `.env` local, usa esta secuencia:",
      flowSteps: [
        {
          step: "Paso 1",
          title: "Crear una credencial con alcance y corta duración",
          body: "Prefiere claves de staging, scopes de solo lectura, listas de IP permitidas y caducidad. Evita repartir la clave principal de producción «porque es más rápido».",
        },
        {
          step: "Paso 2",
          title: "Entregar con una nota de un solo uso cifrada en el cliente",
          body: "Cifra el secreto (o las pocas líneas `.env` necesarias) localmente con PrivateNote—vía la [app web](app:home), la [CLI](app:developers/cli), la [extensión de VS Code / Cursor](app:developers/vscode) o la [extensión de Chrome](chrome:extension). Configura una caducidad corta o burn-after-read y envía el enlace de la nota—no el texto plano—por Slack, email o ticket.",
        },
        {
          step: "Paso 3",
          title: "Instalar en el almacén correcto",
          body: "El destinatario copia el valor a un `.env` local en gitignore (para desarrollo), un gestor de contraseñas o el almacén de secretos de CI/cloud. No lo pegues de nuevo en la PR, el hilo del chat o un doc compartido.",
        },
        {
          step: "Paso 4",
          title: "Rotar cuando el trabajo termine",
          body: "Revoca claves de contratistas, rota tras incidentes y sustituye cualquier credencial que haya aparecido en logs, Git o un ticket. La comodidad sin rotación es solo respuesta a incidentes aplazada.",
        },
      ],
      midCta: {
        body: "¿Necesitas entregar un token de CI o unas líneas .env ahora mismo? Envía una nota de un solo uso cifrada en el cliente en lugar de committear o pegar texto plano.",
        button: "Crear una nota privada",
      },
    },
    {
      title: "Comparte desde donde ya trabajas",
      paragraphs: [
        "No necesitas salir del terminal, editor o pestaña del navegador para crear una nota de un solo uso cifrada en el cliente. Elige la superficie PrivateNote que encaje con el momento—el cifrado siempre ocurre localmente en tu dispositivo antes de la subida. Para una guía más completa, ver [PrivateNote para desarrolladores](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Lee desde un archivo o haz pipe de stdin para que el secreto nunca quede en el historial del shell como argumento de `echo`: `npx privatenote-cli --expire 1h --output-url-only .env.local` o `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Útil en flujos de shell, scripts y entregas rápidas en terminal. Setup y flags: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code y Cursor",
          paragraphs: [
            "Instala la [extensión de VS Code / Cursor](app:developers/vscode) y cifra desde la barra lateral, la selección del editor o el menú contextual—ideal cuando el secreto ya está en pantalla en un `.env` o archivo de config y nunca debería llegar a Slack en texto plano.",
          ],
        },
        {
          title: "Extensión de Chrome",
          paragraphs: [
            "Cuando la credencial aparece en email, docs o un ticket, la [extensión de Chrome](chrome:extension) convierte el texto seleccionado en una nota de un solo uso cifrada en el navegador sin salir de la pestaña.",
          ],
        },
      ],
    },
    {
      title: "Checklist de desarrollador antes de cada push y cambio de pipeline",
      useCaseTable: {
        headers: ["Punto de control", "Qué verificar"],
        rows: [
          [
            "Antes del git commit",
            "`.env`, `*.pem`, `credentials.json` y archivos locales de secretos están en gitignore; `git status` no muestra adiciones sorpresa",
          ],
          [
            "Antes de abrir una PR",
            "Ninguna clave en descripción, capturas, fixtures o archivos de depuración «temporales»",
          ],
          [
            "Antes de editar workflows",
            "Los secretos vienen del mecanismo nativo de secretos de la plataforma o de OIDC/workload identity—no de YAML hardcodeado",
          ],
          [
            "Antes de depurar CI",
            "Sin `env`, `printenv` ni dumps verbose que puedan escribir secretos en logs",
          ],
          [
            "Tras cualquier exposición",
            "Rotar primero, luego limpiar historial/ramas; tratar los escáneres como disparadores de incidente",
          ],
        ],
      },
      callout:
        "Añade secret scanning a la ruta por defecto: hooks pre-commit (gitleaks), escaneo en CI y GitHub Secret Scanning / push protection. La prevención supera las reescrituras heroicas de historial.",
    },
    {
      title: "Qué hacer si un secreto ya está en GitHub",
      paragraphs: [
        "Actúa en este orden: **rota o revoca** la credencial con el proveedor, **invalida** sesiones o webhooks dependientes, **elimina** el secreto de la rama por defecto y luego decide si hace falta reescribir el historial por cumplimiento o exposición pública. Incluso tras una reescritura, asume que forks, mirrors, cachés y clones pueden seguir teniendo copias hasta que se aborden por separado.",
        "Notifica a los dueños de cualquier sistema que la clave pueda alcanzar. Revisa facturación cloud, logs de acceso y uso inusual de API. Si el secreto también se pegó en Slack o email, asume que esos archivos aún lo contienen—ver [por qué el email es el peor lugar para secretos](blog:why-email-is-worst-for-secrets) y [secretos que nunca deberías enviar en el chat](blog:secrets-never-send-in-chat).",
        "Para secretos de valor extremadamente alto como seed phrases de criptomonedas, evita transmitirlos siempre que sea posible. Para otras credenciales raíz irreemplazables, no las escribas en un sitio web—cifra primero en local y comparte solo ciphertext cuando debas. Ese modelo se cubre en nuestra [guía de seed phrase cripto](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Un repo privado de GitHub es suficiente para archivos .env?",
          answer:
            "No. Un repositorio privado limita mucho la exposición, pero sigue sin ser un almacén de secretos adecuado. Cambios de acceso, cuentas comprometidas, clones, backups e integraciones de terceros pueden resurgir texto plano histórico. Mantén los secretos fuera de Git por completo.",
        },
        {
          question: "¿Bastan los secretos de GitHub Actions?",
          answer:
            "Son el lugar correcto para muchos valores de runtime de CI—mucho mejor que YAML o archivos del repo. Aún no resuelven la entrega humana, fugas en logs, permisos demasiado amplios, riesgos de PR de forks ni exposición por pasos de workflow maliciosos y dependencias comprometidas. Combina el mecanismo nativo de secretos de la plataforma con mínimo privilegio, logging cuidadoso y, preferiblemente, credenciales de corta duración vía OIDC o workload identity.",
        },
        {
          question: "¿Debo committear un .env.example redactado?",
          answer:
            "Sí. Commitea solo nombres de variables y placeholders ficticios. Nunca valores reales, claves de staging «casi reales» ni cadenas de conexión de producción con la contraseña quitada pero el host y el usuario intactos si esa combinación es sensible en tu modelo de amenaza.",
        },
        {
          question: "¿Está bien un archivo .env local?",
          answer:
            "Para desarrollo local, sí—cuando está correctamente en gitignore y nunca se commitea. Los secretos sensibles de producción idealmente no deberían vivir indefinidamente en archivos `.env` en texto plano en máquinas de desarrolladores; usa un gestor de contraseñas, acceso de corta duración o un gestor de secretos cuando sea práctico.",
        },
        {
          question: "¿Puede PrivateNote sustituir Vault o los secretos de GitHub?",
          answer:
            "No. PrivateNote es para entrega segura persona a persona. Usa el mecanismo nativo de secretos de la plataforma CI y gestores de secretos dedicados para automatización. Usa PrivateNote cuando una persona necesita recibir una clave, token o fragmento .env sin dejar texto plano en Slack, email o GitHub.",
        },
        {
          question: "¿Cuál es la entrega segura más rápida para un token de CI?",
          answer:
            "Crea un token de alcance estrecho, entrégalo con una nota de un solo uso cifrada en el cliente (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) o [Chrome](chrome:extension)), haz que el destinatario lo guarde en el almacén de secretos de CI o un gestor de contraseñas y luego revoca el token cuando el trabajo termine.",
        },
      ],
    },
    {
      title: "Reflexiones finales",
      paragraphs: [
        "GitHub y CI/CD son excelentes preservando el trabajo. Exactamente por eso son malos lugares para preservar secretos.",
        "Mantén los archivos `.env` locales, en gitignore y limitados al desarrollo cuando puedas. Pon las credenciales de automatización en secretos nativos de CI, un gestor de secretos o credenciales OIDC de corta duración. Cuando una persona necesite un valor, usa una nota de un solo uso cifrada en el cliente—luego rota.",
        "Si tu equipo aún pega claves en PRs o committea credenciales «solo de staging», empieza con el [flujo de compartir claves API](blog:how-to-share-api-key-securely) y la checklist de arriba. Para material de acceso a servidores, usa [cómo compartir claves SSH de forma segura](blog:how-to-share-ssh-keys-securely). Integra la [CLI](app:developers/cli), la [extensión de VS Code](app:developers/vscode) o la [extensión de Chrome](chrome:extension) en el camino de menor resistencia para que la opción segura también sea la rápida.",
      ],
    },
  ],
  ctaTitle: "Comparte el secreto—no una copia permanente",
  ctaBody:
    "Cifra un token de CI o un fragmento .env localmente con PrivateNote—usando la app web, CLI, VS Code / Cursor o la extensión de Chrome—antes de que llegue al chat o a Git. Usa una caducidad corta o burn-after-read, envía el enlace de la nota de un solo uso en lugar de texto plano y mantén el historial de Git y pipelines libre de credenciales en vivo.",
  ctaButton: "Crear una nota privada",
};
