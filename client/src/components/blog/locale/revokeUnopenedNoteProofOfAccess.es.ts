import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessEs: BlogGuideArticleCopy = {
  heroAlt:
    "Vista de actividad de la cuenta con una nota sin abrir y una opción clara para revocar el enlace",
  heroCaption:
    "¿Cambiaste de opinión antes de que alguien la abriera? Destruye el enlace. ¿Necesitas un recibo? Consulta la prueba de acceso.",
  intro: [
    "El uso compartido seguro no termina con el cifrado en el momento del envío. También se trata del **control después**: detener un enlace que no debiste enviar y conservar un registro respetuoso con la privacidad de lo que ocurrió con uno que sí enviaste.",
    "Los planes Starter y Business de PrivateNote añaden dos herramientas complementarias. **Revocar** destruye un enlace sin abrir para que ya no pueda revelarse. La **prueba de acceso** muestra una línea de tiempo sencilla—creada, abierta, adjunto descargado, destruida, caducada o revocada—sin exponer el contenido de la nota.",
    "Juntas responden a las dos preguntas de seguimiento que los equipos realmente hacen: «¿Puedo recuperarla?» y «¿Puedo demostrar que se accedió al enlace?»",
  ],
  sections: [
    {
      title: "Revoca mientras siga sin abrir",
      takeaway:
        "La revocación funciona antes de la revelación—no después de que alguien ya haya descifrado una copia.",
      paragraphs: [
        "Si una nota aún no se ha abierto, puedes revocarla desde la pantalla de éxito al crearla o desde Cuenta → Actividad. El enlace deja de funcionar; los destinatarios que lleguen después verán que el acceso ya no existe.",
        "Revocar es el paso correcto cuando pegaste el destinatario equivocado, viste el secreto en el chat incorrecto o decidiste que la entrega debe esperar. **No** es el borrado remoto de un archivo que alguien ya descargó tras la revelación: ninguna herramienta honesta de entrega E2EE puede prometérselo.",
      ],
      checklist: [
        "Crea la nota en Starter o Business",
        "Si algo parece incorrecto, revócala de inmediato desde la pantalla de éxito",
        "O abre Cuenta → Actividad y revoca mientras el estado siga sin abrir",
        "Envía una nota de reemplazo si el destinatario aún necesita el secreto",
      ],
      midCta: {
        body: "¿Necesitas retractaciones y recibos en entregas sensibles?",
        button: "Crear una nota que puedas revocar",
      },
    },
    {
      title: "Prueba de acceso sin filtrar contenido",
      takeaway:
        "Un registro de estado respetuoso con la privacidad: se accedió al enlace—no una transcripción de la lectura.",
      paragraphs: [
        "La prueba de acceso está pensada para conversaciones operativas y de cumplimiento que necesitan evidencia de eventos de entrega sin poner secretos en correos o tickets.",
        "La línea de tiempo se mantiene de alto nivel: creada, enlace abierto, adjunto descargado (cuando se rastrea), destruida, caducada, revocada. Eso encaja con la postura de privacidad de las [alertas de apertura](blog:know-when-secret-link-opened): estado, no sustancia.",
      ],
      calloutTitle: "Lee la etiqueta con cuidado",
      callout:
        "La prueba de acceso es un recibo de que se accedió al enlace—no una prueba criptográfica de que una persona concreta leyó cada palabra con cuidado, ni DRM contra capturas de pantalla.",
    },
    {
      title: "Cómo encajan revocar y la prueba",
      takeaway:
        "Impide el acceso cuando puedas; documenta el acceso cuando debas.",
      comparisonTable: {
        headers: ["Situación", "Usar", "Resultado"],
        rows: [
          [
            "Destinatario incorrecto, aún sin abrir",
            "Revocar",
            "El enlace muere; crea una nota corregida",
          ],
          [
            "Entrega hecha, el auditor pregunta «¿se abrió?»",
            "Prueba de acceso",
            "Mostrar eventos de la línea de tiempo sin contenido",
          ],
          [
            "Nota ya revelada",
            "Rotar el secreto / asumir exposición",
            "Revocar ya no recupera copias en texto plano",
          ],
          [
            "Esperando al destinatario",
            "Alertas + vida útil",
            "Hacer seguimiento o dejar que caduque si nunca se abre",
          ],
        ],
      },
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Puedo revocar después de que el destinatario abrió la nota?",
          answer:
            "La revocación apunta a notas sin abrir. Tras la revelación, asume que el destinatario puede conservar lo que vio; rota credenciales o trata el documento como entregado.",
        },
        {
          question: "¿La prueba de acceso incluye el texto del mensaje?",
          answer:
            "No. Solo es una línea de tiempo de estado. El contenido permanece fuera de Actividad y de las vistas de prueba.",
        },
        {
          question: "¿La revocación está disponible en Free?",
          answer:
            "Revocar y la prueba de acceso son capacidades de Starter/Business. Los usuarios Free siguen teniendo cifrado, vidas útiles cortas y alertas de apertura una vez iniciada la sesión con un correo verificado.",
        },
        {
          question: "¿Dónde encuentro la prueba más tarde?",
          answer:
            "Abre Cuenta → Actividad, localiza la nota y elige Ver prueba de acceso cuando el plan lo permita.",
        },
      ],
    },
    {
      title: "Conclusión",
      takeaway: "Controla el enlace sin abrir; documenta el que se abrió.",
      paragraphs: [
        "El cifrado responde a «quién puede leer esto en tránsito y en reposo.» Revocar y la prueba responden a «qué hacemos a continuación.»",
        "Úsalos con [códigos de verificación](blog:recipient-verification-code-before-reveal) y [alertas de apertura](blog:know-when-secret-link-opened) para un ciclo de entrega completo—desde el envío y la confirmación hasta la retractación o el recibo.",
      ],
    },
  ],
  ctaTitle: "Recupera un secreto sin abrir.",
  ctaBody:
    "Revoca enlaces que nunca deberían abrirse y mantén una línea de tiempo respetuosa con la privacidad cuando necesites demostrar que se accedió a una entrega—sin enviar el secreto por correo.",
  ctaButton: "Crear una nota privada",
};
