import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkEs: OneTimeLinkCopy = {
  heroTitle: "Crear un enlace de un solo uso",
  heroSubtitle:
    "Comparte contraseñas, mensajes y archivos con un enlace cifrado · Cifrado en el navegador · El destinatario no necesita cuenta",
  whatHeading: "¿Qué es un enlace de un solo uso?",
  whatBody:
    "Un enlace de un solo uso es una forma más segura de entregar información que no debería permanecer indefinidamente en los canales de comunicación habituales. Colocas una contraseña, una clave API, un código de recuperación, un mensaje privado, un documento sensible o una credencial temporal detrás de una URL cifrada. El destinatario abre el enlace para recuperarlo y descifrarlo en su navegador. PrivateNote cifra el contenido en el navegador antes de subirlo, de modo que el servidor recibe datos cifrados, no texto claro. Tú eliges cuánto tiempo permanece disponible el enlace sin abrir y cuántas veces puede abrirse. Es una entrega segura, no un lugar para guardar secretos de forma permanente.",
  whatLearnMore: "Cómo funcionan los enlaces secretos de un solo uso",
  stepsHeading: "Cómo crear un enlace de un solo uso",
  step1Title: "Añade el contenido",
  step1Body: "Escribe un mensaje privado, una contraseña o adjunta un archivo.",
  step2Title: "Define el acceso",
  step2Body: "Elige la caducidad, cuántas veces puede abrirse el enlace y, si quieres, una contraseña.",
  step3Title: "Envía el enlace",
  step3Body: "PrivateNote cifra el contenido en tu navegador y crea un enlace que puedes enviar por el canal que ya usas.",
  useHeading: "Qué puedes compartir con PrivateNote",
  usePasswordsTitle: "Contraseñas y credenciales",
  usePasswordsBody:
    "Comparte contraseñas y credenciales temporales sin dejar el texto claro de forma permanente en el correo o el chat.",
  usePasswordsLink: "Cómo compartir una contraseña de forma segura",
  useApiTitle: "Claves API",
  useApiBody:
    "Comparte claves API, tokens y secretos de webhook sin dejarlos en el historial de chat o en tickets.",
  useApiLink: "Cómo compartir una clave API de forma segura",
  useMessagesTitle: "Mensajes privados",
  useMessagesBody:
    "Para información que no debería permanecer buscable indefinidamente en el correo o el chat después de leerse.",
  useMessagesLink: "Enviar un mensaje secreto sin cuenta",
  useFilesTitle: "Archivos y documentos",
  useFilesBody:
    "Para archivos sensibles cuando quieres una entrega cifrada y una disponibilidad controlada, no una carpeta compartida permanente.",
  useFilesLink: "Transferencia segura de archivos",
  persistHeading: "¿Por qué usar un enlace de un solo uso?",
  persistBody:
    "Enviar una contraseña por correo, Slack, Teams, SMS u otro servicio de mensajería puede dejar una copia en el historial, dispositivos sincronizados, copias de seguridad, notificaciones y archivos buscables. El cifrado protege la transferencia. La caducidad reduce cuánto tiempo permanece disponible el original.",
  handoffHeading: "Hecho para una entrega segura",
  handoffBody:
    "PrivateNote cifra mensajes y archivos en el navegador antes de subirlos. El servidor recibe datos cifrados, no el contenido legible. El descifrado ocurre en el navegador del destinatario.",
  handoffEncryptionLink: "Cómo funciona el cifrado",
  handoffHowItWorksLink: "PrivateNote en detalle",
  limitsHeading: "Lo que un enlace de un solo uso no puede impedir",
  limitsBody:
    "Después de abrirlo, una persona autorizada puede copiar, guardar o fotografiar la información. PrivateNote protege la entrega y limita cuánto tiempo permanece disponible el enlace original. No elimina copias ya guardadas.",
  faqHeading: "Preguntas frecuentes",
  faqs: [
    {
      question: "¿Qué es un enlace de un solo uso?",
      answer:
        "Un enlace de un solo uso sirve para compartir información confidencial de forma temporal. En lugar de enviar una contraseña, un mensaje o un archivo directamente por correo o chat, compartes un enlace cifrado con vigencia y acceso limitados. PrivateNote cifra el contenido en tu navegador para que el secreto original no quede indefinidamente en el historial.",
    },
    {
      question: "¿Cómo creo un enlace de un solo uso?",
      answer:
        "Usa el formulario de esta página. Añade un mensaje, una contraseña o un archivo, elige cuánto tiempo permanece disponible el enlace sin abrir y cuántas veces puede abrirse, y créalo. PrivateNote cifra el contenido en tu navegador y te devuelve una URL que puedes enviar por el canal que ya usas.",
    },
    {
      question: "¿Puedo enviar una contraseña con un enlace de un solo uso?",
      answer:
        "Sí. Pon la contraseña en la nota y envía el enlace cifrado en lugar de la contraseña. Puedes añadir una contraseña adicional. En cuentas importantes, rota la credencial después de que el destinatario la use. Un enlace de un solo uso es una entrega, no un gestor de contraseñas.",
    },
    {
      question: "¿Puedo enviar un archivo con un enlace de un solo uso?",
      answer:
        "Sí. Adjunta un archivo o una carpeta a la misma nota cifrada. Los archivos se cifran en el navegador antes de subirse. Enviar adjuntos requiere una cuenta gratuita de PrivateNote para aplicar límites de almacenamiento. El destinatario sigue sin necesitar cuenta para abrir el enlace.",
    },
    {
      question: "¿El destinatario necesita una cuenta de PrivateNote?",
      answer:
        "No. El destinatario abre el enlace en el navegador y descifra el contenido en local. No tiene que iniciar sesión. También puedes crear una nota de texto básica sin cuenta. Enviar archivos requiere una cuenta gratuita para prevenir abusos y aplicar límites de almacenamiento.",
    },
    {
      question: "¿Qué ocurre después de abrir el enlace?",
      answer:
        "El navegador del destinatario descifra el contenido en local. Las notas gratuitas se leen una vez: después, la nota original se destruye. Starter puede permitir hasta tres aperturas y Business hasta diez. Si nadie abre el enlace, caduca según el plazo que elijas — como máximo tres días en el plan gratuito. Los archivos adjuntos siguen visibles durante un intervalo limitado tras la primera apertura.",
    },
    {
      question: "¿Alguien puede hacer una captura de pantalla de un PrivateNote?",
      answer:
        "Sí. Quien pueda ver el contenido revelado puede capturarlo, fotografiarlo o copiarlo. PrivateNote no afirma bloquear eso. Controla la transferencia cifrada y cuánto tiempo permanece disponible el enlace original.",
    },
    {
      question: "¿Cuánto tiempo puede permanecer activo un enlace de PrivateNote?",
      answer:
        "Si la nota no se abre, los enlaces gratuitos caducan como máximo a los tres días. Starter permite hasta 15 días y Business hasta 30. Tras abrirse, las notas gratuitas se leen una vez. Starter puede permitir hasta tres aperturas y Business hasta diez. Elige la vigencia más corta que aún permita completar la entrega.",
    },
  ],
  articleLearnMore: "Más sobre cómo funcionan los enlaces de un solo uso y cómo se protegen",
  backToCreate: "¿Listo? Crear un enlace de un solo uso ↑",
};
