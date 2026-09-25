import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteEs: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret y PrivateNote resuelven el mismo problema práctico: mover una contraseña, una clave API, un código de recuperación o una nota confidencial mediante un enlace temporal, en lugar de dejar el texto en claro en el correo o el chat. El destinatario abre el enlace, y la carga útil almacenada puede desaparecer tras leerse o al llegar su fecha de caducidad.",
    "Ambos productos cifran la carga útil. La diferencia importante es dónde ocurre el cifrado.",
    "OneTimeSecret describe su arquitectura como cifrado del lado del servidor. El texto en claro llega a OneTimeSecret antes de cifrarse. PrivateNote cifra primero en local, de modo que el servicio recibe texto cifrado en lugar de la carga útil en claro. Esa diferencia determina el límite de confianza criptográfica.",
  ],
  sections: [
    {
      title: "Dos formas de construir el mismo enlace",
      paragraphs: [
        "En el **cifrado del lado del servidor**, el remitente envía el secreto al servicio a través de TLS. El servicio recibe el texto en claro, lo cifra y almacena texto cifrado. Luego puede almacenar la carga útil, entregarla, hacerla caducar y eliminarla. El servidor de la aplicación forma parte del proceso de cifrado porque el texto en claro entra en el servicio antes de convertirse en texto cifrado.",
        "En el **cifrado del lado del cliente**, el dispositivo del remitente cifra primero. El servicio recibe y almacena texto cifrado. Esa subida viaja por TLS. El servicio no recibe la clave necesaria para descifrar una carga útil estándar. El dispositivo del destinatario descifra en local. El servicio puede seguir almacenando, entregando, haciendo caducar y eliminando la carga útil sin necesitar acceso a su texto en claro.",
        "Ambos diseños pueden ofrecer enlaces temporales, acceso limitado y caducidad. Ambos pueden describirse con precisión como cifrados. OneTimeSecret usa la primera arquitectura; PrivateNote, la segunda. La pregunta relevante, por tanto, no es simplemente si un enlace de un solo uso está cifrado, sino qué sistemas deben tener acceso al texto en claro para que ese enlace funcione.",
      ],
    },
    {
      title: "OneTimeSecret: cifrado del lado del servidor",
      paragraphs: [
        "En el flujo habitual de OneTimeSecret, el remitente envía el secreto a través de TLS. La aplicación recibe el texto en claro, lo cifra en el servidor y almacena la carga útil cifrada.",
        "Esto proporciona una protección real para los datos almacenados. Obtener solo el almacenamiento cifrado no revela necesariamente su contenido cuando el material necesario para el descifrado no está disponible para el atacante.",
        "El compromiso arquitectónico ocurre antes del almacenamiento. TLS protege el secreto mientras viaja entre el navegador y OneTimeSecret, pero la aplicación debe procesar el texto en claro para cifrarlo. El servidor de la aplicación queda, por tanto, dentro del límite de confianza criptográfica.",
        "Un proceso de aplicación malicioso o comprometido en ese momento podría acceder al secreto antes de que se cifre para el almacenamiento. El cifrado del lado del cliente elimina esta dependencia concreta cifrando el secreto antes de que llegue al servicio.",
      ],
    },
    {
      title: "La frase de contraseña de OneTimeSecret no cambia el límite de cifrado",
      paragraphs: [
        "La documentación de OneTimeSecret describe una frase de contraseña opcional. Cuando se usa una frase de contraseña, OneTimeSecret indica que el secreto se cifra en sus servidores con la frase de contraseña suministrada por el remitente. Indica que no almacena la frase de contraseña en sí; en su lugar, conserva un hash bcrypt usado para verificar la frase de contraseña durante la recuperación. Según su documentación, ese hash no puede descifrar el secreto por sí mismo, y el secreto almacenado protegido con frase de contraseña no puede descifrarse sin la frase de contraseña original.",
        "La recuperación usa el mismo límite del lado del servidor. El destinatario suministra la frase de contraseña a OneTimeSecret a través de TLS. El servicio la verifica y realiza el descifrado en el servidor antes de devolver el texto en claro.",
        "Esto significa que el proceso de la aplicación tiene acceso al secreto y a la frase de contraseña cuando ocurre el cifrado, y vuelve a procesar la frase de contraseña y el texto en claro resultante durante la recuperación. Un proceso de aplicación malicioso o comprometido que opere en cualquiera de esos puntos podría potencialmente capturar esa información. Es una consecuencia de dónde se ejecutan el cifrado y el descifrado, no una afirmación de que OneTimeSecret registre o haga un uso indebido de esos valores.",
        "La documentación pública de OneTimeSecret no establece, por sí sola, cada detalle de su jerarquía interna de claves —por ejemplo, cómo exactamente se combinan el material de claves del lado del servidor, las claves por secreto, la derivación de claves y la frase de contraseña suministrada—. No hace falta especular sobre esos detalles de implementación para esta comparación. La propiedad documentada relevante es que el cifrado y el descifrado tienen lugar del lado del servicio.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "El secreto que quieres enviar, y la frase de contraseña cuando defines una, viajan ambos al servidor a través de TLS. El cifrado se ejecuta en ese servidor. Lo que queda en el almacenamiento es texto cifrado.",
          columns: [
            [
              { text: "Secreto + frase de contraseña", via: "TLS" },
              { text: "Servidor", via: "Cifrar" },
              { text: "Texto cifrado" },
            ],
          ],
        },
      ],
    },
    {
      title: "El autoalojamiento puede hacer razonable esa confianza en el servidor",
      paragraphs: [
        "OneTimeSecret es de código abierto. Una organización puede ejecutar su propia instancia dentro de un perímetro de seguridad empresarial, en lugar de enviar secretos al servicio público.",
        "En ese despliegue, confiar en el servidor de la aplicación es confiar en una infraestructura que la organización ya opera. El texto en claro sigue llegando a ese servidor, porque el cifrado sigue ocurriendo allí. La parte al otro lado del límite son los propios hosts, operadores y copias de seguridad de la organización. Para un equipo que ya acepta esos sistemas como parte del camino que toma un secreto, el cifrado del lado del servidor puede ser una elección razonable. Reduce la distancia entre los modelos de amenaza del lado del servidor y del lado del cliente, porque el operador ya no es un servicio externo.",
      ],
    },
    {
      title: "PrivateNote cifra antes de la subida",
      paragraphs: [
        "Una PrivateNote estándar se cifra antes de la subida. El navegador del remitente, o un proceso local de [CLI](app:developers/cli), [extensión de Chrome](app:developers/chrome), [extensión de editor](app:developers/vscode) o [MCP](app:developers/mcp), genera una clave aleatoria y cifra la carga útil con AES-256-GCM. Solo se sube texto cifrado. TLS transporta ese texto cifrado del navegador al worker de Cloudflare de PrivateNote. La clave de descifrado se coloca en el fragmento de URL, la parte después de `#`, por ejemplo `https://privatenote.ai/note/abc123#…`. El fragmento se gestiona del lado del cliente y no se incluye en la petición HTTPS ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). El worker recibe un identificador de nota y devuelve texto cifrado por la misma conexión TLS. El navegador conserva el fragmento y descifra en local.",
      ],
    },
    {
      title: "Una frase de contraseña protege la clave si el canal del enlace está comprometido",
      paragraphs: [
        "Una frase de contraseña en PrivateNote hace un trabajo distinto al de una frase de contraseña en OneTimeSecret. La nota ya es texto cifrado antes de salir del dispositivo. Si añades una frase de contraseña, el navegador deriva de ella una clave de envoltorio con Argon2id y usa esa clave para cifrar la clave de la nota. El fragmento de URL contiene entonces la clave envuelta. El destinatario necesita el enlace y la frase de contraseña. El navegador desenvuelve la clave en local y solo entonces descifra la nota.",
        "PrivateNote no recibe la frase de contraseña. La petición de creación lleva texto cifrado, una sal y los parámetros que el navegador del destinatario necesita para probar la frase de contraseña en local. No hay un hash del lado del servidor cuya función sea verificar la frase de contraseña. Una frase de contraseña incorrecta falla el descifrado en el dispositivo.",
        "La frase de contraseña protege además la clave del lado del cliente en local si el canal que transporta el enlace está comprometido. Ese canal ve entonces una clave envuelta, no una clave que pueda abrir la nota por sí sola. No es el mecanismo que mantiene a PrivateNote fuera de la ruta del texto en claro. Esa separación ya existe en una nota estándar, con o sin frase de contraseña. Comparte la frase de contraseña por un canal distinto al del enlace. El mismo mensaje colapsa las dos capas en una — la misma regla que [cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "El cifrado local produce la clave del lado del cliente y el texto cifrado. Argon2id envuelve esa clave, y la clave envuelta permanece en el fragmento de URL. TLS solo transporta el texto cifrado al worker de Cloudflare.",
          columns: [
            [
              { text: "Secreto" },
              { text: "Cifrado local" },
              { text: "Texto cifrado", via: "TLS" },
              { text: "Servidor" },
            ],
            [
              { text: "Frase de contraseña" },
              { text: "Argon2id local" },
              { text: "Envolver clave" },
              { text: "Fragmento de URL" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "La misma división, una propiedad cada vez.",
        headers: ["", "OneTimeSecret + frase de contraseña", "PrivateNote + frase de contraseña"],
        rows: [
          ["Cifrado de la carga útil", "Servidor", "Dispositivo del remitente"],
          ["El texto en claro llega al servicio", "Sí", "No"],
          ["La frase de contraseña llega al servicio", "Sí", "No"],
          [
            "Rol de la frase de contraseña",
            "Participa en la protección del lado del servidor",
            "Deriva una clave de envoltorio local",
          ],
          [
            "Verificador o material almacenado",
            "Verificador bcrypt y carga útil cifrada, según la documentación de OneTimeSecret",
            "Sal, parámetros de envoltorio Argon2id y texto cifrado",
          ],
          ["Dónde se ejecuta el descifrado", "Servidor de aplicación de OneTimeSecret", "Dispositivo del destinatario"],
        ],
      },
      paragraphsAfterTable: [
        "El manejo de claves de PrivateNote se describe en [Cómo funciona](app:how-it-works): la clave de contenido se envuelve con Argon2id, y la clave envuelta viaja en el enlace.",
      ],
    },
    {
      title: "La hipótesis de confianza restante del cliente web",
      paragraphs: [
        "El cifrado del lado del cliente en un navegador no es una aplicación web sin confianza. La criptografía puede ejecutarse en local mientras el JavaScript que la implementa lo entrega el sitio. El navegador confía en el código que recibe para esa sesión.",
        "Alguien que pueda alterar ese JavaScript —a través de la aplicación, un CDN o el pipeline de despliegue— podría cambiar el cliente y capturar claves en una sesión futura del navegador. Es un fallo distinto de robar una base de datos. Un compromiso del almacenamiento expone texto cifrado. La entrega de código malicioso ataca el extremo mientras la clave está realmente presente.",
        "Un volcado posterior de la base de datos no puede fabricar claves del lado del cliente que nunca se almacenaron allí. Un cliente activamente comprometido puede atacar secretos manejados durante esa sesión. La misma hipótesis está escrita en el modelo de amenaza de PrivateNote: el código de la aplicación entregado no ha sido modificado de forma maliciosa, y los dispositivos del remitente y del destinatario son de confianza en el momento del cifrado y el descifrado.",
        "El software instalado reduce esa dependencia de una página recién descargada. Una CLI, una extensión de editor o una app nativa ejecuta código que instalaste. Esos clientes siguen dependiendo del sistema operativo, la firma, las dependencias y el canal de actualización. Las [herramientas para desarrolladores](app:developers) usan la misma división que el navegador: cifrar en local, subir texto cifrado, dejar la clave en el fragmento.",
      ],
    },
    {
      title: "Vida útil y confidencialidad",
      paragraphs: [
        "Un enlace de un solo uso responde a dos preguntas distintas. ¿Cuánto tiempo debe existir la carga útil cifrada? ¿Y quién puede descifrarla mientras existe? Destruirla tras la recuperación o la caducidad acorta la ventana. No decide quién podría leerla durante esa ventana. La vida útil y la confidencialidad se refuerzan mutuamente. Una no sustituye a la otra.",
        "La distinción es más nítida cuando la carga útil es autoridad: claves API, credenciales de base de datos, tokens en la nube, códigos de recuperación, contraseñas de infraestructura. Un servicio de intercambio de secretos existe porque el remitente quiere confiar esa información a menos sistemas. Si el intermediario solo tiene que transportar un objeto cifrado opaco, hacer cumplir la caducidad y eliminarlo, el servidor puede hacer ese trabajo sin recibir el secreto ni la clave que lo abre.",
      ],
    },
    {
      title: "Dónde se sitúa el límite",
      paragraphs: [
        "«Cifrado» no te dice dónde se sitúa el límite de confianza. El criterio que merece la pena usar es un límite de confianza mínimo: el principio de mínimo privilegio aplicado a quién debe ver el texto en claro. En la ingeniería criptográfica moderna, el objetivo no es solo confiar en que un servidor se comporte bien, sino reducir de antemano la necesidad matemática de esa confianza.",
        "OneTimeSecret describe un sistema cifrado del lado del servidor. Con protección por frase de contraseña, indica que el secreto almacenado no puede descifrarse después sin la frase de contraseña, y que un compromiso del servidor dejaría el secreto seguro mientras esa frase de contraseña siga desconocida. Una frase de contraseña débil puede atacarse por fuerza bruta. Si es débil, ese compromiso puede dejar el secreto recuperable de todos modos. El texto en claro y la frase de contraseña llegan a OneTimeSecret en la creación, porque el cifrado ocurre en sus servidores, y la frase de contraseña se envía de vuelta en la recuperación para que esos servidores puedan descifrar.",
        "PrivateNote toma una decisión arquitectónica distinta. La carga útil se cifra antes de llegar al servicio, y la clave de carga útil estándar permanece del lado del cliente. Una frase de contraseña, cuando defines una, protege además esa clave del lado del cliente en local si el canal que transporta el enlace está comprometido. No se envía a PrivateNote.",
        "OneTimeSecret cifra tu secreto. El cliente que usa el servicio de PrivateNote lo cifra antes de que el servicio lo reciba. Esa distinción no depende de asumir que alguno de los proveedores sea malicioso. Reduce la pregunta a la arquitectura: ¿cuántos sistemas necesitan acceso al texto en claro para que el servicio funcione?",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿OneTimeSecret almacena el secreto en texto en claro?",
          answer:
            "Su documentación dice que no. Cifran en sus servidores. Con una frase de contraseña, indican que almacenan el secreto cifrado y un hash bcrypt de la frase de contraseña, no la frase de contraseña, y que el hash no puede descifrar el secreto.",
        },
        {
          question: "Si defino una frase de contraseña en OneTimeSecret, ¿el secreto queda oculto a sus servidores?",
          answer:
            "No durante la creación, ni en la recuperación. OneTimeSecret indica que el secreto y la frase de contraseña se suministran a su servidor para que el servidor pueda realizar el cifrado. Cuando el destinatario abre el enlace, envía la frase de contraseña de vuelta a través de TLS, y el descifrado se ejecuta en los servidores de OneTimeSecret antes de devolver el texto en claro. Tras el cifrado, OneTimeSecret indica que descarta la frase de contraseña en claro, retiene solo un hash bcrypt y no puede descifrar el secreto almacenado sin la frase de contraseña original.",
        },
        {
          question: "¿Qué protege una frase de contraseña de PrivateNote?",
          answer:
            "La clave del lado del cliente, si el canal que transporta el enlace está comprometido. La nota en sí ya está cifrada en tu dispositivo con AES-256-GCM. Argon2id deriva una clave de envoltorio a partir de la frase de contraseña en local, y esa clave de envoltorio cifra la clave de la nota. El enlace contiene entonces una clave envuelta. PrivateNote recibe texto cifrado y una sal. No recibe la frase de contraseña ni la clave en bruto. Una nota estándar se cifra antes de la subida incluso sin frase de contraseña. Envía la frase de contraseña por un canal separado del enlace.",
        },
        {
          question: "¿Puede el cifrado del lado del cliente proteger frente a un servidor de PrivateNote comprometido?",
          answer:
            "Compromiso de datos almacenados o de la API: sí, en el sentido de que el cifrado del lado del cliente aísla las cargas útiles no leídas, porque el servidor no tiene la clave de carga útil estándar. Un volcado posterior de la base de datos no puede fabricar claves que nunca se almacenaron allí. Entrega de código de cliente malicioso: no. Un atacante que pueda cambiar el JavaScript entregado a una sesión futura del navegador podría intentar capturar la clave mientras está presente. Los clientes instalados reducen esa dependencia de una página recién descargada.",
        },
      ],
    },
    {
      title: "Fuentes primarias",
      paragraphs: [
        "La información de arquitectura sobre OneTimeSecret se revisó frente a su documentación pública el 23 de septiembre de 2026. Las implementaciones del producto y la documentación pueden cambiar.",
      ],
      bullets: [
        "[OneTimeSecret documentation](https://docs.onetimesecret.com/)",
        "[OneTimeSecret on security and passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret source code](https://github.com/onetimesecret/onetimesecret)",
        "[Cómo funciona el cifrado de PrivateNote](app:how-it-works)",
        "[PrivateNote para desarrolladores](blog:privatenote-for-developers), incluida la CLI",
        "[RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), que separa el fragmento de la URI antes de la desreferencia",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), sobre el manejo del fragmento del lado del cliente",
      ],
    },
  ],
  ctaTitle: "Cifrar antes de que el secreto salga del dispositivo",
  ctaBody:
    "Escribe la nota en el navegador. El cliente la cifra en local, pone la clave en el enlace y puede proteger esa clave con una frase de contraseña que el servidor nunca recibe.",
  ctaPrimary: "Crear una nota privada",
  ctaSecondary: "Ver cómo funciona el cifrado",
};
