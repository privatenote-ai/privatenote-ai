import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeEs: BlogGuideArticleCopy = {
  heroAlt:
    "Pantalla de portátil que muestra un paso de verificación de seis dígitos antes de poder revelar una nota privada",
  heroCaption:
    "El enlace solo no basta: el destinatario introduce un código de un solo uso que compartes por otro canal.",
  intro: [
    "Un enlace de nota privada es potente porque suele llevar el material necesario para descifrar el mensaje. Esa comodidad también es un riesgo: si la URL completa cae en el buzón, hilo de chat o captura de pantalla equivocados, el secreto puede ser accesible antes de que lo abra el destinatario previsto.",
    "Los **códigos de verificación** del destinatario añaden un segundo secreto de entrega que controlas. Tras crear la nota, PrivateNote muestra un código de seis dígitos específico de la nota. Compartes ese código por separado—por teléfono, Signal u otro canal—para que un enlace interceptado no baste para llegar al paso de revelación.",
    "Esto es distinto del envoltorio opcional con frase de paso sobre el texto cifrado y distinto de iniciar sesión. Es una puerta de entrega: **verificar, luego revelar**.",
  ],
  sections: [
    {
      title: "Solo enlace frente a enlace más código",
      takeaway:
        "La entrega por canales separados convierte un mensaje robado en un puzzle incompleto.",
      paragraphs: [
        "Los enlaces portadores son habituales en el uso compartido seguro. Funcionan bien cuando el canal es de confianza y la vida útil es corta. Funcionan peor cuando la misma cuenta de correo o chat que recibe el enlace también puede estar monitorizada, compartida o comprometida.",
        "Exigir un código de verificación restaura la separación clásica: envía el enlace por el canal A y el código por el canal B. Un atacante necesita ambos. Ese patrón encaja de forma natural con [cómo compartir una contraseña de forma segura](blog:how-to-share-a-password-securely) y los [enlaces secretos de un solo uso](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Control", "Qué protege", "Qué no hace"],
        rows: [
          [
            "Código de verificación (Starter/Business)",
            "Bloquea la revelación hasta que el destinatario introduzca el código de un solo uso",
            "No sustituye el envoltorio con frase de paso ni el inicio de sesión",
          ],
          [
            "Frase de paso en la nota",
            "Envuelve el texto cifrado para que el descifrado necesite la frase de paso",
            "Sigue exigiendo un uso compartido fuera de banda cuidadoso de esa frase",
          ],
          [
            "Caducidad corta + una apertura",
            "Limita cuánto tiempo sigue siendo útil un enlace filtrado",
            "No detiene a quien ya tiene enlace y código a tiempo",
          ],
        ],
      },
    },
    {
      title: "Cómo activarlo",
      takeaway:
        "Actívalo en Entrega y verificación, luego comparte el código y el enlace por separado.",
      paragraphs: [
        "En los planes Starter y Business elegibles, abre **Personalizar** al crear una nota y activa **Exigir código de verificación** en Entrega y verificación. También puedes fijarlo como predeterminado en Cuenta → Preferencias para que las notas nuevas hereden la puerta.",
        "Tras la creación, la pantalla de éxito muestra el **código de verificación del destinatario**. Copia el enlace de la nota como de costumbre y envía el código por otra vía. Indica al destinatario que verá un paso de verificación antes de **Revelar nota**.",
      ],
      checklist: [
        "Usar Starter o Business (la función depende del plan)",
        "Activar Exigir código de verificación para la nota (o como predeterminado de la cuenta)",
        "Crear la nota y copiar el enlace",
        "Copiar el código de seis dígitos de la pantalla de éxito",
        "Enviar enlace y código por canales separados",
        "Confirmar que el destinatario verifica antes de revelar",
      ],
      midCta: {
        body: "¿Envías algo a un buzón que podría estar compartido o vigilado?",
        button: "Crear una nota con verificación",
      },
    },
    {
      title: "Qué experimenta el destinatario",
      takeaway: "Primero el código, luego la advertencia habitual de click-to-reveal.",
      paragraphs: [
        "Al abrir el enlace aparece una pantalla de verificación—no el contenido descifrado. Tras un código correcto, aparece la puerta de revelación familiar: ábrela solo cuando estés listo, porque revelar puede consumir la nota según su política de destrucción.",
        "Los códigos incorrectos fallan en cerrado. El destinatario no necesita una cuenta; solo el código que compartiste. Para el retraso intencional antes del descifrado, consulta [por qué las notas esperan al click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Cuándo usar códigos de verificación",
      takeaway: "Úsalos cuando el canal del enlace sea más débil que el secreto.",
      bullets: [
        "Credenciales o documentos enviados por correo a un buzón compartido",
        "Enlaces publicados en un chat de equipo con muchos miembros",
        "Entregas con alto riesgo de captura de pantalla o reenvío",
        "Cualquier secreto que también protegerías con frase de paso en canales separados",
      ],
      calloutTitle: "Consejo práctico",
      callout:
        "No pongas el código de verificación en el mismo correo que el enlace. Eso concentra ambos factores en un solo mensaje interceptable.",
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿El código de verificación es lo mismo que una contraseña en la nota?",
          answer:
            "No. El código de verificación es una puerta comprobada en el servidor antes de revelar. Una frase de paso de la nota (si está activada) envuelve el texto cifrado en sí y es un control opcional aparte.",
        },
        {
          question: "¿Puedo elegir mi propio código?",
          answer:
            "PrivateNote genera un código de seis dígitos específico de la nota. Compartes ese valor generado; no inventas ni reutilizas un PIN personal.",
        },
        {
          question: "¿Está disponible en Free?",
          answer:
            "La verificación del destinatario es una capacidad de Starter y Business. Las cuentas Free pueden seguir usando caducidad corta, límites de apertura y envoltorio opcional con frase de paso cuando se ofrezca.",
        },
        {
          question: "¿La verificación significa que PrivateNote puede leer mi nota?",
          answer:
            "No. La verificación autoriza el acceso al flujo de revelación. El contenido del mensaje sigue cifrado en el navegador; las alertas de estado nunca incluyen texto en claro.",
        },
      ],
    },
    {
      title: "En resumen",
      takeaway: "Haz que el enlace esté incompleto sin tu código fuera de banda.",
      paragraphs: [
        "Los códigos de verificación son para momentos en que la comodidad dejaría una URL completamente descifrable en un solo canal.",
        "Activa la puerta, comparte el código por separado y mantén corta la vida de la nota—sobre todo para [claves API](blog:how-to-share-api-key-securely), contraseñas y documentos.",
      ],
    },
  ],
  ctaTitle: "Añade un paso de verificación separado a la entrega.",
  ctaBody:
    "Exige un código de verificación de un solo uso antes de revelar y envía ese código por un canal distinto al del enlace.",
  ctaButton: "Crear una nota privada verificada",
};
