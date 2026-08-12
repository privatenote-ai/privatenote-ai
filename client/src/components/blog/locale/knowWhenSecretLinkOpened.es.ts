import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedEs: BlogGuideArticleCopy = {
  heroAlt:
    "Panel de notificaciones que muestra una alerta de nota abierta sin ningún contenido del mensaje visible",
  heroCaption:
    "Solo estado: abierta, destruida, caducada o revocada—nunca el secreto en sí.",
  intro: [
    "Después de enviar un enlace sensible, la pregunta natural es: **¿ya lo abrieron?** Esperar en silencio estresa; insistir por el chat solo genera más ruido en texto plano.",
    "PrivateNote puede avisarte cuando cambia el estado de entrega—por correo, con alertas en vivo en la pestaña mientras el sitio está abierto, y opcionalmente con notificaciones del navegador—sin enviar nunca el contenido de la nota por correo.",
    "Esa visibilidad te ayuda a rotar credenciales, revocar enlaces no abiertos o simplemente dejar de preguntarte si la entrega llegó.",
  ],
  sections: [
    {
      title: "Qué puedes saber (y qué no)",
      takeaway: "Las alertas tratan de eventos del ciclo de vida, no del texto del mensaje.",
      paragraphs: [
        "Los eventos típicos incluyen nota abierta, destruida, caducada, archivo adjunto descargado y revocada. La redacción se mantiene deliberadamente gruesa: suficiente para confianza operativa, no un feed de vigilancia del comportamiento de lectura.",
        "El modelo de privacidad de PrivateNote sigue aplicando. El correo de estado y los toasts **no** incluyen el secreto descifrado. Si necesitas un recibo estructurado para una pista de auditoría, usa la **prueba de acceso** en planes elegibles—descrita en [revocar y prueba de acceso](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Señal", "Dónde aparece", "Útil para"],
        rows: [
          [
            "Alertas por correo (cuenta verificada)",
            "El correo de tu cuenta",
            "Confirmación asíncrona cuando no estás en el sitio",
          ],
          [
            "Alertas en vivo en la pestaña (sesión iniciada)",
            "PrivateNote abierto en un navegador",
            "Conciencia casi en tiempo real durante una entrega activa",
          ],
          [
            "Notificaciones del navegador (permiso requerido)",
            "Permiso del SO solicitado desde Personalizar",
            "Aviso cuando la pestaña está en segundo plano",
          ],
          [
            "Cuenta → Actividad (según el plan)",
            "Tu historial de actividad privado",
            "Revisar más tarde qué ocurrió",
          ],
        ],
      },
    },
    {
      title: "Cómo activar las alertas",
      takeaway:
        "Inicia sesión, verifica el correo y luego activa alertas por nota o en preferencias.",
      checklist: [
        "Inicia sesión y verifica el correo de tu cuenta",
        "Activa las notificaciones por correo en Cuenta → Preferencias",
        "Al crear una nota, abre Personalizar → Alertas por correo",
        "Elige notificar al abrir, o al abrir y destruir (para flujos de una sola lectura)",
        "Permite notificaciones del navegador si quieres avisos a nivel del SO",
        "Mantén PrivateNote abierto para toasts en vivo en la pestaña durante entregas críticas",
      ],
      paragraphsAfterChecklist: [
        "Las notificaciones de apertura están disponibles para usuarios Free con sesión iniciada una vez verificado el correo; el seguimiento más rico, como eventos de descarga de adjuntos y herramientas de revocación, se amplía en planes de pago.",
        "Para el patrón de entrega subyacente, consulta [cómo crear una nota privada](blog:how-to-make-a-private-note) y [enviar un mensaje secreto sin cuenta](blog:send-secret-message-without-account) para destinatarios.",
      ],
      midCta: {
        body: "¿Envías un secreto urgente y necesitas confirmar que llegó?",
        button: "Crear una nota con alertas de apertura",
      },
    },
    {
      title: "Usar las alertas de forma operativa",
      takeaway:
        "Trata «abierta» como una señal para rotar o cerrar el ciclo—no como prueba de lectura cuidadosa.",
      bullets: [
        "Entrega de contraseña: al ver abierta, rota o confirma que el destinatario cambió la credencial",
        "Envío de documento: abierta + adjunto descargado (donde esté disponible) significa que la ventana del archivo está activa",
        "Sin apertura antes del vencimiento: sigue por otro canal, o revoca si sigue sin abrir",
        "Apertura inesperada: asume que el enlace puede estar comprometido; revoca si es posible y reenvía",
      ],
      calloutTitle: "Límite honesto",
      callout:
        "«Abierta» significa que el flujo de revelación avanzó—no que una persona leyó con cuidado cada línea, ni que las capturas de pantalla fueran imposibles.",
    },
    {
      title: "Expectativas de privacidad",
      takeaway: "Supervisar la entrega no debe recrear un correo del secreto.",
      paragraphs: [
        "A veces los equipos abusan de los acuses de lectura como vigilancia de productividad. El diseño de PrivateNote mantiene las alertas mínimas: etiquetas de estado y referencias, no volcados de contenido.",
        "Eso encaja con la promesa del producto en otros sitios—cifrado en el navegador, [conceptos de cifrado de extremo a extremo](blog:what-is-end-to-end-encryption), y nunca devolver el secreto al correo solo para demostrar que llegó.",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿La alerta incluirá el texto de mi nota?",
          answer:
            "No. Las alertas por correo y en vivo describen solo el estado. El contenido del mensaje se queda fuera de los canales de notificación.",
        },
        {
          question: "¿Necesito mantener la pestaña abierta?",
          answer:
            "Las alertas por correo funcionan sin la pestaña. Los toasts en vivo en la pestaña necesitan el sitio abierto; las notificaciones del navegador ayudan cuando la pestaña está en segundo plano y se ha concedido el permiso.",
        },
        {
          question: "¿Pueden los destinatarios ver que activé las alertas?",
          answer:
            "Los destinatarios se centran en abrir y revelar la nota. La configuración de notificaciones del remitente no forma parte de la carga secreta que descifran.",
        },
        {
          question: "¿Qué pasa si necesito detener el acceso después de enviar?",
          answer:
            "Si la nota sigue sin abrir, revoca el enlace desde la pantalla de éxito o la actividad de la cuenta en planes elegibles. Detalles en [revocar y prueba de acceso](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "En resumen",
      takeaway: "Cierra el ciclo sin copiar el secreto a otra bandeja de entrada.",
      paragraphs: [
        "Saber cuándo se abrió un enlace te permite terminar la historia operativa: rotar, hacer seguimiento o revocar.",
        "Activa el canal de alerta que encaje con cómo trabajas—correo para lo asíncrono, alertas en vivo para entregas en vivo—y deja el texto plano donde corresponde: dentro de la nota cifrada.",
      ],
    },
  ],
  ctaTitle: "Envía el secreto. Recibe el estado.",
  ctaBody:
    "Activa alertas de apertura y destrucción para saber cuándo avanza una entrega de PrivateNote—sin poner el mensaje en el correo.",
  ctaButton: "Crear una nota con alertas",
};
