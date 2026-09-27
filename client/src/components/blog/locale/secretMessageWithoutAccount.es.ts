import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountEs: SecretMessageArticleCopy = {
  intro: [
    "A veces necesitas compartir algo confidencial—una [contraseña](app:password-generator), un código de recuperación, una contraseña Wi‑Fi, una nota privada o un mensaje personal—pero crear una cuenta solo para enviar un mensaje parece innecesario.",
    "La buena noticia es que no hace falta.",
    "La moderna [encriptación en el navegador](blog:encrypted-vs-secure-file-sharing) permite enviar un mensaje secreto de forma segura **sin registrarte**, instalar software ni confiar en un servicio con tu texto plano.",
  ],
  sections: [
    {
      title: "¿Por qué evitar crear una cuenta?",
      paragraphs: [
        "Crear una cuenta deja más información de la que mucha gente cree. Un servicio típico puede almacenar tu correo electrónico, un [nombre de usuario](https://passwords.lu/en/blog/username-privacy-identity), historial de inicio de sesión, información del dispositivo, direcciones IP y metadatos sobre tu actividad.",
        "Para colaboración a largo plazo, puede ser perfectamente razonable. Para compartir un solo mensaje confidencial, normalmente no lo es.",
        'Si tu objetivo es simplemente «Quiero que esta persona lea este mensaje una vez», una cuenta suele añadir complejidad sin mejorar la seguridad. Para ese patrón, los [enlaces secretos de un solo uso](blog:one-time-secret-links) suelen encajar mejor.',
      ],
    },
    {
      title: "Encripta antes de enviar",
      paragraphs: [
        "La pregunta importante no es si un sitio web usa HTTPS. Hoy casi todos los sitios usan HTTPS (TLS), que protege los datos mientras viajan por Internet. Nuestra guía sobre [encriptación frente a compartir archivos de forma segura](blog:encrypted-vs-secure-file-sharing) explica por qué la encriptación de transporte por sí sola no es lo mismo que la privacidad de extremo a extremo.",
        "La pregunta más importante es: **¿quién puede leer tu mensaje después de que llegue al servidor?**",
      ],
    },
    {
      title: "Servicios web tradicionales",
      paragraphs: [
        "Muchas plataformas de mensajería envían tu mensaje por una conexión encriptada (HTTPS/TLS). Una vez que el mensaje llega a sus servidores, técnicamente pueden acceder a él antes de almacenarlo o procesarlo.",
        "Según el servicio, el mensaje puede escanearse en busca de spam o abuso, indexarse para búsqueda, procesarse en la nube, conservarse en copias de seguridad o quedar accesible para administradores.",
        "TLS protege la conexión entre tu navegador y el servicio. **No** impide necesariamente que el propio servicio lea tu mensaje.",
      ],
    },
    {
      title: "Encriptación en el navegador",
      paragraphs: ["Un enfoque más respetuoso con la privacidad es encriptar el mensaje dentro de tu navegador antes de subirlo."],
      beforeFlowSteps: "En este modelo:",
      flowSteps: [
        {
          title: "Escribe tu mensaje",
          body: "Redactas el secreto en tu navegador—aún no se envía nada. O usa Private AI y [Escribe con Private AI](app:home) para redactarlo en tu dispositivo antes de encriptarlo.",
        },
        {
          title: "Genera una clave única localmente",
          body: "Tu navegador crea una clave de encriptación en tu dispositivo.",
        },
        {
          title: "Encripta antes de subir",
          body: "El mensaje se encripta localmente. Solo se sube texto cifrado al servidor.",
        },
        {
          title: "Comparte la clave en el enlace",
          body: "La clave de descifrado permanece contigo y se comparte como parte del enlace seguro—normalmente en el [fragmento de URL](blog:one-time-secret-links), que los navegadores no envían a los servidores web.",
        },
      ],
      afterFlowSteps: [
        "El servicio almacena solo datos encriptados y actúa como relevo. Sin la clave de descifrado, el texto cifrado es prácticamente inútil.",
        "El mismo principio aplica a los archivos. La [transferencia segura de archivos](app:secure-file-transfer) encripta documentos y archivos en tu navegador antes de subirlos. Los destinatarios pueden abrir el enlace sin cuenta, pero enviar requiere iniciar sesión en una cuenta gratuita de PrivateNote.",
      ],
    },
    {
      title: "Por qué esto significa que no hace falta una cuenta",
      paragraphs: [
        "Cuando un servicio nunca necesita leer tu mensaje, tampoco tiene muchas razones para saber quién eres. Por eso los servicios de notas encriptadas en el navegador suelen funcionar sin registro—consulta [cómo funcionan los enlaces secretos de un solo uso](blog:one-time-secret-links) para el flujo completo.",
        "En lugar de crear una cuenta, simplemente escribes tu mensaje, generas un enlace seguro y se lo envías al destinatario. Sin nombres de usuario. Sin contraseñas que recordar. Sin bandeja llena de correos de verificación.",
      ],
    },
    {
      title: "Añade otra capa con una contraseña",
      paragraphs: [
        "Para información muy sensible, puedes proteger el mensaje encriptado con una contraseña adicional.",
        "Un enfoque habitual es enviar el enlace encriptado por un canal de comunicación y la contraseña por otro—por ejemplo, una llamada, un SMS o una app de mensajería. Un atacante necesitaría ambos para descifrar el mensaje.",
      ],
    },
    {
      title: "Mensajes que desaparecen automáticamente",
      paragraphs: [
        "La información confidencial normalmente no debería permanecer online para siempre. Muchos servicios de notas seguras permiten que los mensajes se [autodestruyan tras la primera lectura](blog:one-time-secret-links), caduquen tras un tiempo elegido o se eliminen automáticamente.",
        "Esto reduce la cantidad de información sensible que sigue disponible online—similar a por qué los [textos laborales y registros de chat](blog:workplace-texts-private-note) son un mal lugar para secretos de un solo uso. Ninguna tecnología puede impedir que el destinatario haga una captura de pantalla o copie el contenido tras abrir el mensaje, pero la caducidad automática reduce mucho la exposición a largo plazo.",
      ],
    },
    {
      title: "¿Cuándo usar mensajes secretos anónimos?",
      paragraphs: ["Enviar mensajes encriptados sin crear una cuenta es útil para compartir:"],
      bullets: [
        "[Contraseñas y códigos de recuperación](blog:how-we-generate-passwords) — o usa nuestro [generador de contraseñas](app:password-generator) antes de compartir",
        "[Claves API](blog:privatenote-for-developers) y claves de licencia de software",
        "Enlaces privados y notas empresariales confidenciales",
        "Información financiera y contraseñas Wi‑Fi",
        "Mensajes personales temporales que no deberían vivir para siempre en el correo o el historial de chat",
      ],
    },
    {
      title: "Qué buscar en un servicio seguro",
      paragraphs: ['No todos los servicios de «mensajería privada» o «nota secreta» ofrecen el mismo nivel de protección. Busca servicios que:'],
      bullets: [
        "Encripten mensajes en tu navegador antes de subirlos",
        "Nunca reciban tu texto plano",
        "No requieran una cuenta",
        "Admitan caducidad automática",
        "Permitan opcionalmente protección con contraseña",
        "Usen encriptación autenticada moderna",
      ],
      callout:
        'Estas decisiones de diseño reducen la confianza que debes depositar en el propio servicio. Para una base de seguridad más amplia—incluyendo contraseñas, autenticación y compartición segura—consulta [El mito de la seguridad «suficientemente buena»](blog:myth-good-enough-security).',
    },
    {
      title: "Cómo encaja PrivateNote con estos principios",
      paragraphs: [
        "PrivateNote se construyó exactamente en torno a estas ideas. Cuando creas una nota, la encriptación ocurre por completo en tu navegador antes de que se suba nada. El servidor almacena solo texto cifrado y actúa únicamente como relevo entre tú y tu destinatario—nunca recibe el texto plano de tu mensaje.",
        "Por este diseño, no necesitas crear una cuenta para enviar una nota privada. Simplemente escribes tu mensaje, generas un enlace seguro y lo compartes por el canal que prefieras.",
        "Para protección adicional, puedes proteger la nota con contraseña, elegir cuándo caduca, hacer que se autodestruya tras la primera lectura, adjuntar archivos encriptados y, opcionalmente, recibir notificaciones de entrega que te indiquen cuándo se abrió o caducó una nota—sin revelar el contenido del mensaje.",
        "El objetivo es sencillo: hacer que enviar información confidencial sea tan fácil como compartir un enlace, minimizando la confianza que debes depositar en el servicio.",
      ],
    },
    {
      title: "Reflexiones finales",
      paragraphs: [
        "Enviar un mensaje secreto no debería exigir crear otra cuenta ni ceder información personal innecesaria.",
        "La encriptación en el navegador permite encriptar tu mensaje antes de que salga de tu dispositivo, de modo que el servicio almacena solo texto cifrado y no tu mensaje real. Combinado con [enlaces con caducidad](blog:one-time-secret-links) y protección opcional con contraseña, ofrece una forma sencilla y práctica de compartir información confidencial.",
        "Ya envíes una contraseña, un código de recuperación o una nota personal, elegir un servicio que encripte datos en tu navegador y no requiera cuenta te da más privacidad con menos fricción.",
      ],
    },
  ],
  closingTitle: "Pruébalo sin registrarte",
  closingBody: [
    "PrivateNote se diseñó en torno a estos principios—compartir mensajes de forma segura tan simple como crear un enlace y enviarlo al destinatario previsto.",
  ],
  fileSharingNote:
    "PrivateNote también ofrece [transferencia segura de archivos](app:secure-file-transfer) para compartir documentos y carpetas con el mismo modelo de encriptación en el navegador. Enviar requiere una cuenta gratuita; los destinatarios pueden abrir el enlace sin registrarse.",
  tagline: "Menos gestión de cuentas. Menos metadatos. Más control sobre lo que queda online tras la entrega.",
  relatedReading: "Lectura relacionada",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Análisis detallado de enlaces de lectura única, el fragmento de URL y por qué la efimeridad supera al correo o Slack para secretos de un solo uso.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS frente a encriptación en el navegador—qué protege cada uno y por qué el servidor aún puede leer tus datos.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Cómo crear y compartir contraseñas fuertes sin reutilizar patrones ni dejarlas en el historial de chat.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Por qué los registros escritos en correo y chat laboral crean riesgo a largo plazo—y cuándo encajan mejor las notas efímeras.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Una base de seguridad práctica: contraseñas, autenticación, mensajería y patrones de compartición segura.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Comparte claves API y credenciales desde tu editor sin pegar secretos en Slack o tickets.",
    },
  ],
};
