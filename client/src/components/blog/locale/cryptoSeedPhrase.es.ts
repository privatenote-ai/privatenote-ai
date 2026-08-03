import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseEs: CryptoSeedArticleCopy = {
  heroAlt:
    "Concepto de intercambio de archivos cifrados que ilustra el cifrado local antes de subir secretos",
  intro: [
    "Una frase semilla de criptomonedas es uno de los secretos más valiosos que tendrás jamás. Normalmente no se puede restablecer. No hay «Olvidé mi contraseña». Quien la posee suele controlar la wallet y todo lo que contiene.",
    "Puede sonar raro en el blog de una empresa que construye enlaces cifrados de un solo uso. La seguridad no consiste en fingir que cada herramienta sirve para todo—sino en adaptar el enfoque a lo que proteges, incluidos nuestros propios límites.",
    "Para **secretos reemplazables**—como contraseñas Wi‑Fi, credenciales temporales, códigos de recuperación MFA, muchas claves API y mensajes empresariales confidenciales—un [enlace cifrado de un solo uso](blog:one-time-secret-links) es una excelente solución.",
    "Los **secretos maestros de larga duración**, como las frases semilla de criptomonedas, merecen un enfoque distinto.",
  ],
  ruleTitle: "Regla n.º 1",
  ruleParagraphs: [
    "**No introduzcas una frase semilla de criptomonedas en un sitio web—incluido PrivateNote.** Si la transmisión es inevitable, cifra primero en local y comparte **solo el texto cifrado**. PrivateNote sirve para transportar datos previamente cifrados, no para escribir la mnemotecnia.",
    "**Los fabricantes legítimos de hardware wallets no te piden que introduzcas tu frase de recuperación en un sitio web.** Si un sitio solicita tu frase semilla, trátalo como muy sospechoso—verifica la autenticidad antes de continuar.",
    "Evita introducir frases semilla en sitios web siempre que sea posible.",
  ],
  offlineAlternatives: [
    { label: "Copia de seguridad en metal", body: "guardada en una caja fuerte o en un depósito bancario" },
    { label: "SLIP-39", body: "u esquemas similares para herencia o recuperación ante desastres" },
    { label: "Transferencia entre hardware wallets", body: "cuando sea práctico, en lugar de la frase de recuperación" },
  ],
  seedPhraseTraits: [
    { label: "Otorga control total", body: "sobre los activos" },
    { label: "Suele durar décadas", body: "sin rotación" },
    { label: "No se puede cambiar", body: "si se ve comprometida" },
    { label: "Sin recuperación del proveedor", body: "si se roba" },
  ],
  oneTimeLinkFit: [
    "Claves API y contraseñas temporales",
    "Credenciales Wi‑Fi",
    "Códigos de recuperación MFA",
    "Mensajes empresariales y borradores legales",
    "Tokens de acceso temporales",
  ],
  localEncryptFirst: [
    "Frases semilla de criptomonedas",
    "Copias de seguridad de hardware wallets",
    "Claves privadas de CA y claves de firma",
    "Material de recuperación de gestores de contraseñas",
    "Secretos maestros de alto valor",
  ],
  philosophySteps: [
    "evitar transmitir cuando puedas",
    "cifrar en local",
    "subir solo el texto cifrado",
    "borrar el texto plano temporal",
    "enviar la contraseña del archivo age—no la mnemotecnia—por un canal separado cuando sea posible",
  ],
  sections: {
    sendAtAll: {
      title: "¿Necesitas enviarla en absoluto?",
      question: "**¿tiene que salir la frase de donde está?** A menudo, no.",
      outro:
        "Cada transmisión añade una posibilidad de divulgación. Si puedes evitar enviarla, hazlo. Para otros canales que también conservan secretos indefinidamente, consulta [por qué el correo es el peor lugar para los secretos](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Por qué las frases semilla son distintas",
      p1: "Una frase semilla es el secreto raíz de todo un patrimonio digital—no «solo otra contraseña».",
      listIntro: "A diferencia de la mayoría de credenciales:",
      outro:
        "No solo te defiendes de los atacantes de hoy—tomas decisiones que pueden importar dentro de diez o veinte años.",
    },
    browserEncryption: {
      title: "El cifrado en el navegador es potente—pero no es magia",
      paragraphs: [
        "PrivateNote cifra en tu navegador antes de subir. Nuestros servidores solo ven texto cifrado; la clave nunca nos llega. Eso es mucho mejor que el [correo](blog:why-email-is-worst-for-secrets), el chat o los documentos en la nube para secretos cotidianos—y encaja con un modelo estricto de [cifrado de extremo a extremo](blog:what-is-end-to-end-encryption) para el contenido de la nota.",
        "Toda aplicación de criptografía en el navegador comparte una limitación: **el texto plano debe existir en el navegador antes del cifrado.** JavaScript malicioso—de extensiones, compromiso de la cadena de suministro, inyección o un CDN defectuoso—podría leerlo antes en teoría. Eso es inherente al cifrado del lado del cliente en el navegador, no exclusivo de PrivateNote.",
        "Para claves API y contraseñas temporales, ese compromiso suele estar bien. Para una frase semilla que protege tus ahorros, quizá quieras confiar en menos sistemas.",
      ],
    },
    encryptLocal: {
      title: "Cifra antes de que el navegador lo vea",
      intro: "Cifra en local y luego sube solo el texto cifrado:",
      outro: "PrivateNote nunca recibe la mnemotecnia—solo datos cifrados.",
      callout:
        "El cifrado local **no detiene el malware en tu equipo**. **Mantiene el texto plano fuera de aplicaciones web, servicios en la nube y servidores** que no lo necesitan. Reduces la base de confianza; no eliminas un punto final comprometido.",
    },
    whichTool: {
      title: "Qué herramienta usar",
      age: "**age** (recomendado para la mayoría de usuarios): cifrado de archivos sencillo con valores predeterminados seguros — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: excelente si ya usas OpenPGP.",
      openssl: "**OpenSSL**: fiable y potente; CLI de bajo nivel—mejor para usuarios con experiencia.",
    },
    ageExample: {
      title: "Ejemplo mínimo (age)",
      passphraseTitle: "¿Necesitas una contraseña fuerte?",
      passphraseBefore:
        "Usa un secreto largo y único para `age -p`. Genera uno en local en tu navegador—el",
      passphraseLink: "generador de contraseñas",
      passphraseAfter: "en passwords.lu se ejecuta en el cliente; no se sube nada.",
      p1: "Tras verificar `seed.txt.age`, **borra de forma segura el texto plano** en el dispositivo del remitente. Después de que el destinatario importe en una wallet, **borra también su copia en texto plano**.",
      p2: "Para intercambio habitual con alguien, `age -r` (modo de clave pública) evita una contraseña compartida—merece la pena aprenderlo por separado.",
      docsLabel: "Documentación:",
    },
    separateChannels: {
      title: "Usa canales separados",
      intro:
        "Separa el archivo cifrado del secreto que lo desbloquea. Estás separando el texto cifrado `.age` de la **contraseña de descifrado age**—no enviando la mnemotecnia de la frase semilla por un segundo canal.",
      steps: [
        "Sube el **archivo cifrado** (texto cifrado) con PrivateNote",
        "Envía la **contraseña age** que descifra ese archivo—por Signal, teléfono o en persona",
      ],
      outro: "Un atacante debe comprometer varios sistemas—no solo un enlace.",
    },
    recommend: {
      title: "Lo que recomendamos",
      intro:
        "La distinción va realmente de secretos **reemplazables** frente a **secretos maestros de larga duración**—no solo del formato de archivo o del canal.",
      oneTimeTitle: "Buen encaje para enlaces de un solo uso",
      oneTimeSubtitle: "Secretos reemplazables que puedes rotar o revocar",
      localTitle: "Cifra primero en local",
      localSubtitle: "Secretos maestros de larga duración que rara vez cambian",
      outro:
        "Para claves API en concreto, consulta nuestra guía sobre [cómo compartir una clave API de forma segura](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Adapta la herramienta al riesgo",
      body: "Cada enfoque tiene supuestos de confianza—gestores de contraseñas, hardware wallets, herramientas offline, criptografía en el navegador. Ninguno es perfecto; los compromisos difieren. La pregunta es si encajan con el **valor** de lo que proteges.",
    },
    philosophy: {
      title: "Nuestra filosofía",
      p1: "Construimos PrivateNote para que el cifrado ocurra **antes** de que los datos lleguen a nuestros servidores. Para secretos temporales y reemplazables, eso supera al correo, la mensajería o el almacenamiento en la nube. También puedes [enviar un secreto sin cuenta](blog:send-secret-message-without-account). Lee [cómo funciona PrivateNote](app:how-it-works) para el modelo completo.",
      listIntro: "Para una frase semilla que podría ser tus ahorros de toda la vida:",
      closingQuote:
        "A veces el mejor consejo no es «usa nuestro producto». Es «usa la herramienta adecuada para el trabajo».",
    },
  },
  ctaTitle: "Comparte secretos reemplazables—no frases semilla—en el navegador",
  ctaBody:
    "Crea una nota cifrada de un solo uso para claves API, contraseñas y credenciales. Para frases semilla, cifra primero en local con age y luego comparte solo el texto cifrado.",
  ctaButton: "Probar PrivateNote ->",
};
