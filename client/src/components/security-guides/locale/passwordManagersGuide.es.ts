import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideEs: PasswordManagersGuideCopy = {
  metaTitle: "Guía de gestores de contraseñas",
  metaDescription:
    "Cree, almacene y comparta contraseñas de forma segura. Compare KeePass, Bitwarden, Apple y Google — más Passwords.lu y PrivateNote para compartir de una vez.",
  heroLabel: "Guía de seguridad",
  heroTitle: "Guía de gestores de contraseñas",
  heroTagline: "Crear, almacenar y compartir contraseñas de forma segura",
  heroSubtitle:
    "Las contraseñas protegen casi todos los aspectos de la vida digital — sin embargo, la reutilización y los patrones débiles siguen siendo uno de los eslabones más frágiles en ciberseguridad. Un gestor de contraseñas lo soluciona.",
  introLead:
    "El problema no son las contraseñas en sí. Es cómo las usan las personas. Muchos siguen reutilizando la misma contraseña en docenas de sitios o hacen solo pequeñas variaciones:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Si un sitio web sufre una filtración, los atacantes prueban esas credenciales en todas partes — una técnica llamada credential stuffing, responsable de millones de cuentas comprometidas cada año. Un gestor de contraseñas genera una contraseña diferente para cada cuenta. Solo necesita recordar una contraseña maestra fuerte.",
  essentialTitle: "Por qué los gestores de contraseñas son esenciales",
  essentialIntro: "Un buen gestor de contraseñas mejora drásticamente tanto la seguridad como la experiencia diaria en línea.",
  essentialBenefits: [
    "Generar contraseñas largas y aleatorias al instante",
    "Almacenar cada contraseña en una bóveda cifrada",
    "Rellenar automáticamente los formularios de inicio de sesión",
    "Detectar contraseñas reutilizadas o débiles",
    "Recibir alertas cuando las credenciales aparecen en filtraciones conocidas",
    "Sincronizar contraseñas en todos sus dispositivos",
    "Almacenar passkeys junto con contraseñas",
    "Compartir credenciales de forma segura cuando sea necesario",
  ],
  howItWorksTitle: "Cómo funcionan los gestores de contraseñas",
  howItWorksBody1:
    "Sus credenciales viven dentro de una bóveda cifrada. Al crear la bóveda, elige una contraseña maestra que deriva las claves de cifrado que protegen todo lo que contiene.",
  cryptoLabel: "La criptografía moderna suele incluir:",
  cryptoPoints: [
    "Cifrado AES-256",
    "Argon2id o PBKDF2 para derivación de claves",
    "Cifrado autenticado para detectar manipulaciones",
  ],
  howItWorksBody2:
    "Como la bóveda se cifra antes del almacenamiento o la sincronización, los proveedores de confianza generalmente no pueden leer sus contraseñas.",
  unlockedLabel: "Una vez desbloqueado, su gestor puede:",
  vaultFeatures: [
    "Autocompletar nombres de usuario y contraseñas",
    "Generar contraseñas seguras",
    "Guardar credenciales recién creadas",
    "Sincronizar cambios entre dispositivos",
    "Almacenar notas seguras y passkeys",
  ],
  benefitsTitle: "Beneficios de usar un gestor de contraseñas",
  benefitBlocks: [
    {
      title: "Cada cuenta obtiene una contraseña única",
      body: "Si roban su contraseña de Netflix, no debería desbloquear también su correo, banca, cuenta de GitHub o almacenamiento en la nube. Los gestores hacen que las contraseñas únicas sean sencillas.",
    },
    {
      title: "Generación de contraseñas fuertes",
      body: "Los humanos son malos inventando contraseñas aleatorias. Los gestores generan cadenas de alta entropía como uQ8!kL#7P2@wXf9$rZm4 — extremadamente difíciles de adivinar o forzar por fuerza bruta.",
    },
    {
      title: "Inicio de sesión automático",
      body: "Los gestores reconocen sitios web y rellenan credenciales automáticamente. Los gestores de confianza suelen autocompletar solo en el dominio correcto, lo que también ayuda a proteger contra el phishing.",
    },
    {
      title: "Informes de salud de contraseñas",
      body: "Muchos gestores marcan contraseñas reutilizadas, débiles, credenciales comprometidas, MFA ausente y sitios que admiten passkeys — ayudándole a mejorar la seguridad con el tiempo.",
    },
    {
      title: "Sincronización segura",
      body: "Los gestores modernos sincronizan su bóveda cifrada en escritorio, portátil, teléfono y tableta para que las contraseñas estén disponibles donde las necesite.",
    },
  ],
  passwordsLuPartnerLabel: "Herramienta asociada",
  passwordsLuTitle: "Generación en el navegador con Passwords.lu",
  passwordsLuBody:
    "A veces solo necesita una contraseña fuerte — no un flujo de bóveda completo. Passwords.lu ejecuta la generación directamente en su navegador. Las contraseñas no se suben a servidores; no se requiere cuenta.",
  passwordsLuWorkflow:
    "Flujo recomendado: generar en Passwords.lu y guardar inmediatamente en su gestor de contraseñas.",
  passwordsLuCta: "Abrir generador de contraseñas",
  passwordsLuTools: [
    "Generador de contraseñas fuertes",
    "Generador de frases de contraseña",
    "Generador de PIN seguro",
    "Comprobador de fortaleza de contraseña",
    "Generador de nombres de usuario",
    "Generadores de hash (Argon2id, bcrypt, scrypt y más)",
    "Herramientas educativas de seguridad",
  ],
  recommendedTitle: "Gestores de contraseñas recomendados",
  recommendedIntro:
    "Piense en tres capas: herramientas integradas en la plataforma para estabilidad, bóvedas open source locales para control, y gestores en la nube cuando necesite sincronización potente — aceptando el riesgo adicional del lado del servidor que conlleva.",
  tiers: {
    platform: {
      title: "Gestores integrados en la plataforma",
      subtitle: "Ingeniería sólida, productos estables — mejor opción predeterminada para la mayoría",
      intro:
        "Apple y Google incluyen gestores de contraseñas con el sistema operativo. Están respaldados por grandes equipos de seguridad, reciben actualizaciones continuas e integran passkeys, autocompletado y alertas de filtraciones con configuración mínima. Si vive en un ecosistema, suele ser la opción más fluida y fiable.",
      strengthsLabel: "Fortalezas",
      tradeoffsLabel: "Compromisos",
      pros: [
        "UX pulida con autocompletado a nivel de SO y soporte de passkeys",
        "Mantenidos por ingenieros de seguridad de plataforma a gran escala",
        "Sin suscripción separada para funciones básicas",
        "Sincronización estable mediante iCloud o su cuenta de Google",
      ],
      cons: [
        "Vinculados a la cuenta de Apple o Google y a las decisiones de plataforma",
        "Menos flexible si mezcla libremente Windows, Linux y móvil",
        "El modelo de confianza depende de la seguridad de su cuenta en la nube",
      ],
      managers: {
        apple: {
          verdict: "Ideal para iPhone, iPad, Mac y Vision Pro",
          description:
            "Integrado en las plataformas Apple con almacenamiento seguro, generación, alertas de seguridad, passkeys y sincronización de iCloud Keychain — sin aplicación adicional en un hogar totalmente Apple.",
          highlights: [
            "Integración profunda con el SO y soporte de passkeys",
            "Alertas de seguridad por filtraciones conocidas",
            "Excelente UX dentro del ecosistema Apple",
          ],
          learnMore: "Más información",
        },
        google: {
          verdict: "Ideal para Android y Chrome",
          description:
            "Integrado en Android y Chrome con generación, autocompletado, Password Checkup, alertas de filtraciones, passkeys y sincronización mediante su cuenta de Google.",
          highlights: [
            "Opción predeterminada conveniente en dispositivos Android",
            "Password Checkup y alertas de filtraciones",
            "Funciona dondequiera que use Chrome",
          ],
          learnMore: "Más información",
        },
      },
    },
    local: {
      title: "Bóvedas open source locales",
      subtitle: "Control máximo — usted posee el archivo cifrado",
      intro:
        "KeePass almacena su bóveda como una base de datos cifrada local. No requiere cuenta en la nube del proveedor: usted decide dónde vive el archivo y cómo se sincroniza. El compromiso es la UX — las interfaces pueden parecer anticuadas frente a gestores de plataforma o nube, y la sincronización multi-dispositivo es DIY salvo que añada su propia capa de almacenamiento.",
      strengthsLabel: "Fortalezas",
      tradeoffsLabel: "Compromisos",
      pros: [
        "Open source y auditable",
        "Sin cuenta en la nube ni suscripción obligatoria",
        "Offline-first; el archivo de bóveda permanece bajo su control",
        "Gran ecosistema de plugins (KeePassXC, ports móviles, etc.)",
      ],
      cons: [
        "Interfaz y onboarding menos pulidos que las herramientas de plataforma",
        "Sincronización entre dispositivos manual salvo que la configure",
        "Más trabajo de configuración para familias o hogares con dispositivos mixtos",
      ],
      managers: {
        keepass: {
          verdict: "Ideal para puristas de la privacidad y autoalojadores",
          description:
            "El modelo open source original: un archivo .kdbx cifrado que puede almacenar en disco, USB, NAS o sincronizar mediante su propia nube. KeePassXC es un fork multiplataforma popular con una interfaz más moderna.",
          highlights: [
            "Completamente gratuito — sin dependencia del proveedor",
            "Usted elige la estrategia de almacenamiento y sincronización",
            "Ideal cuando la nube es opcional, no predeterminada",
          ],
          learnMore: "Más información",
        },
      },
    },
    cloud: {
      title: "Gestores de contraseñas en la nube",
      subtitle: "Sincronización y uso compartido potentes — mayor riesgo del lado del servidor",
      intro:
        "Los gestores en la nube dedicados como Bitwarden destacan en sincronización multiplataforma, uso compartido familiar y funciones de equipo. Esa comodidad trae un modelo de amenaza distinto: su bóveda cifrada (y a veces metadatos) vive en servidores ajenos. Una filtración o mala configuración del proveedor es el principal riesgo residual — por eso las auditorías, el open source y una contraseña maestra fuerte importan más aquí que en ningún otro lugar.",
      strengthsLabel: "Fortalezas",
      tradeoffsLabel: "Compromisos",
      pros: [
        "Mejor sincronización multi-dispositivo lista para usar",
        "Funciones de uso compartido familiar y organizacional",
        "Funciona de forma consistente en Windows, macOS, Linux y móvil",
        "Opciones open source (Bitwarden) con auditorías de seguridad públicas",
      ],
      cons: [
        "Mayor superficie de ataque si el proveedor se ve comprometido",
        "Las copias de seguridad cifradas de la bóveda aún pueden descifrarse offline con contraseñas maestras débiles",
        "Debe confiar en la implementación criptográfica y las operaciones del proveedor",
      ],
      managers: {
        bitwarden: {
          verdict: "Mejor opción en la nube para usuarios multiplataforma",
          description:
            "Software open source, sincronización cifrada de extremo a extremo, soporte de passkeys, auditorías independientes y un plan gratuito sólido — la recomendación predeterminada cuando necesita sincronización en la nube fuera de Apple o Google.",
          highlights: [
            "Clientes open source auditados",
            "Excelente plan gratuito y planes familiares",
            "Experiencia consistente en todas las plataformas principales",
          ],
          learnMore: "Más información",
        },
        lastpass: {
          verdict: "Opción heredada — prefiera Bitwarden para nuevos usuarios",
          description:
            "Ayudó a popularizar los gestores en la nube, pero incidentes de alto perfil con copias de seguridad cifradas robadas empujaron a muchos profesionales de seguridad hacia Bitwarden o KeePass local para nuevos despliegues.",
          highlights: [
            "Utilizable con contraseña maestra fuerte + MFA si ya está invertido",
            "Considere migrar si empieza de cero",
          ],
          learnMore: "Más información",
          caution: "Precaución",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Su prioridad",
    recommendation: "Recomendación",
  },
  comparisonRows: [
    { priority: "Vivir en el ecosistema Apple", pick: "Apple Passwords" },
    { priority: "Android y Chrome a diario", pick: "Google Password Manager" },
    { priority: "Máxima privacidad y control de archivos", pick: "KeePass (bóveda local)" },
    { priority: "Sincronización en la nube multiplataforma", pick: "Bitwarden" },
    { priority: "Usuario existente de LastPass", pick: "Continuar si está reforzado; evaluar Bitwarden o KeePass" },
  ],
  sharingTitle: "Compartir contraseñas de forma segura",
  sharingBody:
    "Incluso las contraseñas fuertes a veces deben compartirse — con colegas, familia, administradores de TI, contratistas o clientes. Demasiadas personas aún las envían por plataformas de mensajería diseñadas para chat, no para entrega de secretos.",
  unsafeChannels: ["Correo electrónico", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Use PrivateNote en su lugar",
  privateNoteSharingBody:
    "PrivateNote cifra secretos en su navegador antes de subirlos. El servidor solo almacena texto cifrado; la clave de descifrado viaja por separado en el enlace. Las notas pueden autodestruirse tras una lectura o caducar según un calendario.",
  privateNoteSharingItems: [
    "Contraseñas",
    "Claves API",
    "Credenciales Wi‑Fi",
    "Códigos de recuperación",
    "Inicios de sesión temporales",
  ],
  privateNoteSharingCta: "Crear una nota segura de un solo uso",
  passwordProtectedTitle: "Protección adicional con notas protegidas por contraseña",
  passwordProtectedBody1:
    "Añada una contraseña opcional a una PrivateNote. El destinatario necesita tanto el enlace como la contraseña separada — idealmente entregados por canales distintos (envíe el enlace por correo, comparta la contraseña por teléfono o en persona).",
  passwordProtectedBody2:
    "Incluso si alguien intercepta el enlace, no puede revelar el secreto sin la contraseña.",
  bestPracticesTitle: "Buenas prácticas",
  bestPractices: [
    "Usar una contraseña maestra larga y única",
    "Activar la autenticación multifactor en su gestor de contraseñas",
    "Nunca reutilizar contraseñas entre sitios web",
    "Generar contraseñas con un gestor o Passwords.lu",
    "Guardar cada contraseña en su bóveda cifrada",
    "Activar passkeys siempre que estén disponibles",
    "Revisar regularmente los informes de salud de contraseñas",
    "Compartir contraseñas mediante PrivateNote en lugar de correo o chat",
    "Para credenciales muy sensibles, usar la protección por contraseña opcional de PrivateNote y entregar la contraseña por separado",
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    {
      q: "¿Son seguros los gestores de contraseñas?",
      a: "Sí. Los gestores de confianza usan cifrado fuerte y estándar del sector. Para casi todos, usar un gestor es significativamente más seguro que memorizar contraseñas o reutilizar la misma en varios sitios.",
    },
    {
      q: "¿Puede el proveedor del gestor leer mis contraseñas?",
      a: "En gestores modernos como KeePass, Bitwarden, Apple Passwords y Google Password Manager, su bóveda se cifra antes del almacenamiento. Con una contraseña maestra fuerte, el proveedor generalmente no puede leer sus credenciales almacenadas.",
    },
    {
      q: "¿Qué pasa si olvido mi contraseña maestra?",
      a: "La mayoría de gestores no pueden recuperarla porque nunca la conocen. Es deliberado. Algunos servicios ofrecen opciones de recuperación o acceso de emergencia si se configuran con antelación.",
    },
    {
      q: "¿Debo usar el almacenamiento de contraseñas del navegador?",
      a: "Los gestores integrados de Apple y Google son opciones sólidas y estables en sus ecosistemas — respaldados por grandes equipos de seguridad. KeePass encaja para control máximo. Bitwarden encaja cuando necesita sincronización en la nube en plataformas mixtas, aceptando mayor riesgo del lado del servidor.",
    },
  ],
  finalTitle: "Recomendación final",
  finalBody:
    "Ningún gestor es perfecto para todos — pero usar uno es uno de los pasos más efectivos. Combínelo con Passwords.lu para generación rápida y PrivateNote cuando necesite compartir secretos de forma segura.",
  finalBullets: [
    { label: "Apple & Google", text: "opciones estables de plataforma" },
    { label: "KeePass", text: "control local, open source" },
    { label: "Bitwarden", text: "sincronización en la nube para cada dispositivo" },
    { label: "Passwords.lu", text: "generación rápida en el navegador" },
  ],
  finalCtaPrivateNote: "Compartir un secreto con PrivateNote",
  finalCtaPasswordsLu: "Visitar passwords.lu",
  exploreOther: "Explorar otras guías",
  allResources: "Todos los recursos",
  affiliateDisclaimer:
    "Solo guía educativa. Podemos ganar una comisión por enlaces de afiliado al usar los servicios recomendados, lo que ayuda a mantener este recurso gratuito de privacidad.",
  otherGuides: [
    { id: "vpn", title: "Guía de servicios VPN" },
    { id: "messenger", title: "Mensajería segura" },
    { id: "email", title: "Correo seguro" },
    { id: "browser", title: "Navegadores privados" },
  ],
};
