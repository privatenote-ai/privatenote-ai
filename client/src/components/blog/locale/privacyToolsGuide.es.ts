import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideEs: PrivacyToolsGuideArticleCopy = {
  intro: [
    "La mayoría de las páginas de «mejores herramientas de privacidad» son catálogos de afiliados disfrazados. Clasifican cada categoría, entierran los trade-offs y te dejan con veinte pestañas y ningún sistema.",
    "Esta guía es distinta. Es un **marco de decisión 2026** para armar un stack de privacidad que encaje en la vida real: qué trabajo necesitas hacer, qué opción por defecto elegir, cuándo subir de nivel y cuándo una herramienta tiene la forma equivocada del todo.",
    "PrivateNote.ai ocupa un hueco estrecho—**entregas de secretos de un solo uso**. Todo lo demás abajo es opinión curada para que salgas de esta página con un stack coherente y luego explores nuestro [directorio de herramientas de privacidad](app:privacy-tools) para el catálogo completo.",
  ],
  sections: [
    {
      title: "Empieza con un modelo de amenaza (no con una lista de compras)",
      paragraphs: [
        "Las herramientas de privacidad solo ayudan si coinciden con aquello contra lo que te defiendes. Un freelancer que comparte credenciales Wi‑Fi tiene un problema distinto al de un periodista frente a vigilancia dirigida. Elige el stack más ligero que cubra *tus* riesgos—y deja de coleccionar herramientas por deporte.",
      ],
      subsections: [
        {
          title: "Uso personal cotidiano",
          paragraphs: [
            "Quieres menos rastreo, menos desastres por reutilizar contraseñas y secretos que no se queden en el chat. No intentas desaparecer ante estados-nación. Concéntrate en un gestor de contraseñas, defaults sensatos del navegador, mensajería cifrada para chats sensibles y enlaces efímeros para credenciales puntuales.",
          ],
        },
        {
          title: "Freelancer o consultor",
          paragraphs: [
            "Entregas secretos a clientes que no comparten tus apps. El correo y Slack se convierten en archivos permanentes de claves API y contraseñas temporales. Añade notas cifradas de un solo uso y transferencia de archivos cifrada; guarda las credenciales de larga duración en una bóveda, no en hilos.",
          ],
        },
        {
          title: "Equipo pequeño",
          paragraphs: [
            "Necesitas acceso compartido que se pueda revocar, reglas claras para contratistas y menos dependencia de «mándalo al canal». Prefiere el compartido del gestor de contraseñas para acceso continuo, enlaces de un solo uso para entregas temporales y normas escritas para que la comodidad no se convierta en silencio en política.",
          ],
        },
      ],
      calloutTitle: "Regla práctica",
      callout:
        "Si una herramienta no corresponde a un trabajo que realmente haces semanalmente, sáltala. Un stack mínimo que usas gana a un stack purista que abandonas.",
    },
    {
      title: "Trabajos de privacidad, no categorías de producto",
      paragraphs: [
        "Las categorías (VPN, navegador, mensajero) animan a coleccionar logos. Los trabajos obligan a sacar los trade-offs a la luz. Usa este mapa para orientarte; las secciones siguientes profundizan.",
      ],
      comparisonTable: {
        headers: ["Trabajo", "Enfoque por defecto", "Herramienta equivocada"],
        rows: [
          [
            "Guardar contraseñas de larga duración",
            "Gestor de contraseñas + generador fuerte",
            "Solo contraseñas del navegador, o archivos de chat",
          ],
          [
            "Entregar un secreto de un solo uso",
            "Nota cifrada en el navegador y con caducidad",
            "Correo, Slack, SMS o una carpeta en la nube «por ahora»",
          ],
          [
            "Chat privado del día a día",
            "Mensajero con cifrado de extremo a extremo",
            "SMS, o mensajes «que desaparecen» en apps que aun así archivan metadatos para siempre",
          ],
          [
            "Reducir rastreadores de navegación",
            "Navegador mainstream endurecido + bloqueador",
            "Instalar cinco extensiones de privacidad conflictivas",
          ],
          [
            "Redes no confiables",
            "VPN no-logs con reputación respaldada",
            "Asumir que un VPN te hace anónimo",
          ],
          [
            "Higiene contra toma de cuentas",
            "Chequeo de filtraciones + 2FA / passkeys",
            "Reutilizar contraseñas y esperar lo mejor",
          ],
        ],
        after: [
          "Para nombres de producto, notas de precios y exclusiones, mantén abierto el [directorio de herramientas de privacidad](app:privacy-tools) junto a esta guía.",
        ],
      },
    },
    {
      title: "Trabajo: contraseñas de larga duración",
      paragraphs: [
        "Las contraseñas que reutilizarás durante meses pertenecen a una bóveda—no a tu cabeza, no a una app de notas y no al hilo de Teams de ayer.",
      ],
      subsections: [
        {
          title: "El problema",
          paragraphs: [
            "La reutilización convierte una filtración en muchas. Las contraseñas débiles y memorables fallan ante cracking offline. Los almacenes del navegador ayudan, pero rara vez igualan a gestores dedicados en sync, compartido y auditabilidad.",
          ],
        },
        {
          title: "Por defecto + alternativa",
          paragraphs: [
            "**Por defecto:** [Bitwarden](https://bitwarden.com/) para la mayoría—código abierto, free tier usable, sync sólido. **Alternativa:** [KeePassXC](https://keepassxc.org/) si quieres una bóveda local sin nube. **Cuando el acabado importa más que el open source:** [1Password](https://1password.com/) es una elección justa; sé que eliges comodidad propietaria.",
          ],
        },
        {
          title: "Cuándo no usar solo un gestor",
          paragraphs: [
            "Los gestores destacan en *almacenamiento* y acceso compartido continuo. Son torpes cuando el destinatario no tiene cuenta, o cuando el secreto debe morir tras una lectura. Eso es otro trabajo—ver secretos de un solo uso abajo. Genera valores fuertes con un [generador de contraseñas](app:password-generator) local antes de guardarlos o compartirlos.",
          ],
        },
      ],
    },
    {
      title: "Trabajo: secretos de un solo uso",
      paragraphs: [
        "Contraseñas para contratistas, códigos de recuperación, claves API, Wi‑Fi para un visitante—todo lo que no debería convertirse en historial buscable.",
      ],
      subsections: [
        {
          title: "El problema",
          paragraphs: [
            "El correo y el chat cifran en tránsito y luego archivan para siempre. Las carpetas en la nube se quedan. Las capturas y las copias de seguridad de dispositivos amplían el radio. El modo de fallo no es «alguien olfatea el cable»—es «el secreto sigue ahí dentro de seis meses».",
          ],
        },
        {
          title: "Por defecto",
          paragraphs: [
            "**Por defecto:** una nota cifrada en el navegador y con caducidad como [PrivateNote.ai](app:home)—ciphertext en el servidor, material de descifrado en el fragmento del enlace, burn-after-reading o TTL corto. Sobre el modelo, ver [cómo funciona PrivateNote](app:how-it-works) y [por qué el correo es el peor lugar para secretos](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Cuándo no usarlo",
          paragraphs: [
            "No sustituyas tu gestor de contraseñas ni tu mensajero diario con notas de un solo uso. No pongas documentos de larga duración ni conversaciones continuas en enlaces efímeros. Y no envíes el enlace y una passphrase opcional por el mismo canal si el secreto es de alto riesgo—separa los canales.",
          ],
        },
      ],
      midCta: {
        body: "¿Necesitas entregar una contraseña o una clave API ahora? Cífrala en el navegador y envía un enlace que pueda caducar tras la lectura.",
        button: "Crear una nota privada",
        href: "app:home",
      },
    },
    {
      title: "Trabajo: mensajería del día a día",
      paragraphs: [
        "Las conversaciones sensibles necesitan cifrado de extremo a extremo por defecto—no un interruptor enterrado en ajustes, ni la promesa de que los mensajes «que desaparecen» borran copias en el servidor que no puedes verificar.",
      ],
      subsections: [
        {
          title: "Por defecto + trade-off",
          paragraphs: [
            "**Por defecto:** [Signal](https://signal.org/) para chat seguro mainstream. **Trade-off a decir en voz alta:** el registro exige un número de teléfono, que algunos modelos de amenaza de alta anonimidad rechazan. Para esos casos, mira más allá de esta guía inicial—y trata siempre los metadatos (quién habla con quién) como riesgo residual en todo mensajero.",
          ],
        },
        {
          title: "Cuándo no usar el chat para secretos",
          paragraphs: [
            "Incluso los mensajeros cifrados guardan historial en los dispositivos. Pega una contraseña de producción en un hilo y has creado una copia duradera. Usa el chat para conversar; usa notas de un solo uso para credenciales. Más sobre ese patrón: [secretos que nunca deberías enviar en el chat](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Trabajo: correo y separación de identidad",
      paragraphs: [
        "El correo es un sistema de direccionamiento público con esperanzas privadas. Trata el cifrado del buzón y el aliasing como control de daños, no como invisibilidad mágica.",
      ],
      subsections: [
        {
          title: "Por defecto",
          paragraphs: [
            "**Buzón cifrado por defecto:** [Proton Mail](https://proton.me/) o [Tuta](https://tuta.com/) cuando quieres correo zero-access para correspondencia sensible. **Aliasing por defecto:** [Firefox Relay](https://relay.firefox.com/) para enmascaramiento ligero, o [SimpleLogin](https://simplelogin.io/) cuando necesitas dominios personalizados y separación de identidad más nítida.",
          ],
        },
        {
          title: "Cuándo no confiar en el correo",
          paragraphs: [
            "El correo cifrado aún deja cabeceras, hábitos de reenvío y retención larga. Nunca pongas credenciales activas en el cuerpo «solo esta vez». Si la carga es una entrega de secreto, usa una nota de un solo uso y pon solo contexto en el correo.",
          ],
        },
      ],
    },
    {
      title: "Trabajo: navegar con menos rastreo",
      paragraphs: [
        "En 2026, la pelea va menos del «modo secreto» y más del fingerprinting, el rastreo entre sitios y las extensiones que prometen privacidad mientras añaden superficie de ataque.",
      ],
      subsections: [
        {
          title: "Stack por defecto",
          paragraphs: [
            "**Por defecto:** [Firefox](https://www.mozilla.org/) con protección estricta contra rastreo más [uBlock Origin](https://ublockorigin.com/). **Alternativa con forma Chromium:** [Brave](https://brave.com/) si necesitas compatibilidad de extensiones—sé que la comunidad está dividida sobre su superficie de rewards/crypto. **Búsqueda:** [DuckDuckGo](https://duckduckgo.com/) (o búsqueda similar no perfiladora) para que tus consultas no sean un feed de perfil publicitario.",
          ],
        },
        {
          title: "Cuándo Tor es la mejora correcta",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) es el estándar para mayor anonimato y resistencia a la censura. También es más lento y pesado en CAPTCHA. Úsalo cuando el modelo de amenaza lo exija—no como navegador bancario diario.",
          ],
        },
      ],
    },
    {
      title: "Trabajo: redes no confiables (realidad del VPN)",
      paragraphs: [
        "Un VPN cifra la ruta entre tú y el proveedor VPN. Oculta tu IP a los sitios que visitas. **No** te hace anónimo, no cifra los logs del destino ni arregla una contraseña débil.",
      ],
      subsections: [
        {
          title: "Defaults que estamos dispuestos a nombrar",
          paragraphs: [
            "Prefiere proveedores con historial público, historia de jurisdicción clara y claims no-logs auditados—comúnmente [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) o [IVPN](https://www.ivpn.net/). Paga por el producto; los modelos de negocio de VPN gratis a menudo son el producto.",
          ],
        },
        {
          title: "Cuándo no molestarse",
          paragraphs: [
            "En una red en la que ya confías, con HTTPS en todas partes, un VPN es higiene opcional—no un deber moral. Evita marcas dudosas «military-grade» y cualquier cosa que lidere con códigos de influencers en lugar de detalle de ingeniería. Las notas de exclusión de nuestro directorio cubren picks «privacy-washed» comunes.",
          ],
        },
      ],
    },
    {
      title: "Trabajo: filtraciones, 2FA y passkeys",
      paragraphs: [
        "La higiene de cuentas es la mitad poco glamurosa de la privacidad. La mayoría de los desastres personales son credential stuffing y fallos cercanos al SIM-swap, no malware exótico.",
      ],
      subsections: [
        {
          title: "Defaults prácticos",
          paragraphs: [
            "Comprueba direcciones en [Have I Been Pwned](https://haveibeenpwned.com/). Activa factores resistentes al phishing donde puedas—passkeys o claves de hardware como [YubiKey](https://www.yubico.com/) ganan al OTP por SMS. Usa el [2FA Directory](https://2fa.directory/) para ver qué servicios aún tratan el segundo factor como teatro opcional.",
          ],
        },
        {
          title: "Nota 2026 sobre passwordless",
          paragraphs: [
            "Las passkeys reducen el phishing y la reutilización de contraseñas, pero la recuperación y el lock-in entre ecosistemas son reales. Mantén una historia de recuperación (clave de hardware, proceso documentado) antes de borrar cada contraseña. Los gestores siguen siendo útiles para la larga cola de sitios que aún no se han puesto al día.",
          ],
        },
      ],
    },
    {
      title: "Qué cambió en 2026 (comentario que vale la pena guardar)",
      bullets: [
        "**El chat de IA es un nuevo archivo.** Pegar secretos en asistentes crea preguntas de retención y riesgo de entrenamiento que tu modelo de amenaza de 2019 nunca incluyó. Trata los prompts como cuerpos de correo.",
        "**El fingerprinting superó a los banners de cookies.** Bloquear cookies de terceros ayuda; la elección del navegador, el bloqueo de rastreadores y menos extensiones siguen importando más que aceptar cada interruptor de «interés legítimo».",
        "**Las passkeys se están generalizando.** Prefiérelas en cuentas de alto valor; no finjas que todos los sitios las soportan aún.",
        "**El marketing de VPN se volvió más ruidoso, no más sabio.** El teatro de jurisdicción y los leaderboards de afiliados no son auditorías. Elige proveedores aburridos y documentados—o ninguno.",
        "**El compartido efímero sigue siendo nicho—y sigue siendo necesario.** Las apps de colaboración optimizadas para la búsqueda hacen más valiosas, no menos, las herramientas de secretos de un solo uso.",
      ],
    },
    {
      title: "Kit inicial mínimo (la mayoría de la gente)",
      paragraphs: [
        "Si solo haces siete cosas, haz estas. Todo lo demás es profundidad opcional.",
      ],
      useCaseTable: {
        headers: ["Hueco", "Elección"],
        rows: [
          ["Bóveda de contraseñas", "Bitwarden (o KeePassXC si rechazas la nube)"],
          ["Creación de contraseñas", "Generador local—luego guardar en la bóveda"],
          ["Secretos de un solo uso", "PrivateNote.ai (o nota equivalente cifrada en el navegador)"],
          ["Chat privado", "Signal"],
          ["Navegador + bloqueador", "Firefox + uBlock Origin"],
          ["Higiene filtraciones / 2FA", "Have I Been Pwned + passkeys o 2FA de app/hardware"],
          ["Viajes / Wi‑Fi de café", "Mullvad, Proton VPN o IVPN—cuando la red es el riesgo"],
        ],
      },
      callout:
        "Los add-ons avanzados (Tor a diario, ritualismo de disco completo, telarañas de correo anónimo) son válidos—pero solo después de que el kit inicial sea habitual.",
    },
    {
      title: "Qué excluimos—y por qué",
      paragraphs: [
        "Curar es sobre todo decir no. Algunos patrones que nos negamos a suavizar:",
      ],
      subsections: [
        {
          title: "VPN de teatro de privacidad",
          paragraphs: [
            "Free tiers financiados por prácticas de datos vagas, badges falsos de «auditoría» y SEO de leaderboards. Si el pitch es miedo más un código de descuento, aléjate.",
          ],
        },
        {
          title: "Mensajeros que comercializan el cifrado de forma selectiva",
          paragraphs: [
            "Nube por defecto, E2EE opcional o modos de «chat secreto» que entrenan a los usuarios a pegar secretos en el default inseguro. Preferimos recomendar un default honesto a cinco modos que la gente malusa. Las nubes estilo Telegram y las realidades de metadatos/backup de WhatsApp se señalan en nuestras [exclusiones del directorio](app:privacy-tools).",
          ],
        },
        {
          title: "Cualquier cosa que necesite comprar nuestra recomendación",
          paragraphs: [
            "Esta guía y el directorio no son una lista de afiliados. No ganamos nada si haces clic. Eso no nos hace omniscientes—significa que los incentivos no dirigen en silencio la shortlist.",
          ],
        },
      ],
    },
    {
      title: "A dónde ir después",
      paragraphs: [
        "Usa este artículo como capa de decisión. Usa el directorio como catálogo vivo—categorías, matices y enlaces que mantenemos revisados.",
      ],
      bullets: [
        "[Directorio de herramientas de privacidad](app:privacy-tools) — catálogo curado por categoría",
        "[Cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely) — playbook de entrega",
        "[Enviar un secreto sin cuenta](blog:send-secret-message-without-account) — sin app compartida requerida",
        "[Recursos de seguridad](app:security-resources) — lectura más amplia en PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — contexto de política y derechos",
        "[Privacy Guides](https://www.privacyguides.org/) — recomendaciones más profundas mantenidas por la comunidad",
      ],
      midCta: {
        body: "¿Listo para explorar la shortlist completa con notas de categoría y exclusiones?",
        button: "Abrir el directorio de herramientas de privacidad",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Es lo mismo que vuestro directorio de herramientas de privacidad?",
          answer:
            "No. Este post es la guía 2026 de cómo elegir. El [directorio](app:privacy-tools) es el catálogo curado. Lee la guía para decidir; usa el directorio para elegir herramientas concretas.",
        },
        {
          question: "¿Puedo perseguir el ranking de cada categoría de privacidad?",
          answer:
            "Puedes, pero no te mantendrás. Un kit inicial de siete huecos que realmente usas gana a un santuario de treinta herramientas que configuras una vez.",
        },
        {
          question: "¿Dónde encaja PrivateNote.ai?",
          answer:
            "Solo en el trabajo de secretos de un solo uso—credenciales e instrucciones que deben caducar. No es un gestor de contraseñas, mensajero ni VPN.",
        },
        {
          question: "¿Necesito un VPN todos los días?",
          answer:
            "Normalmente no. Usa uno en redes no confiables o cuando necesites ocultar específicamente tu IP a un destino. No sustituye HTTPS, buenas contraseñas ni mensajeros cifrados.",
        },
        {
          question: "¿Open source o propietario pulido?",
          answer:
            "Prefiere open source cuando el riesgo es alto y puedes vivir con la UX. Las herramientas propietarias pueden ser racionales cuando la usabilidad determina si tu familia adopta una bóveda—nombra el trade-off explícitamente, como hacemos con 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Arma el stack y luego comparte secretos bien",
  ctaBody:
    "Cuando el trabajo es una entrega temporal, sáltate el archivo del chat. Crea una nota cifrada en el navegador, envía el enlace y déjalo caducar cuando el momento haya pasado.",
  ctaButton: "Crear una nota privada",
  ctaSecondaryLabel: "Explorar el directorio de herramientas de privacidad",
  ctaSecondaryHref: "app:privacy-tools",
};
