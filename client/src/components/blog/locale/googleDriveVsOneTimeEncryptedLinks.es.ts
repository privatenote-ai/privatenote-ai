import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksEs: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Escena tranquila de escritorio que sugiere una entrega temporal de archivos frente a carpetas de colaboración en la nube de larga duración",
  heroCaption:
    "Drive destaca en la colaboración continua. Los enlaces de un solo uso destacan cuando el archivo solo debe existir para la entrega.",
  intro: [
    "Google Drive es una de las mejores herramientas para guardar archivos y colaborar durante días, semanas o años. Los [enlaces cifrados de un solo uso](blog:one-time-secret-links) resuelven otro problema: entregar información confidencial de forma segura una sola vez y eliminar automáticamente el acceso cuando ya no se necesita.",
    "Ningún enfoque es universalmente mejor. La elección correcta depende de si estás colaborando en un documento o simplemente entregando información confidencial.",
  ],
  sections: [
    {
      title: "Por qué importa",
      takeaway:
        "La comodidad convierte Drive en el valor por defecto—incluso cuando el archivo solo necesita verse una vez.",
      paragraphs: [
        "Para muchas personas, Google Drive se ha convertido en la respuesta por defecto cuando hay que compartir un archivo. Está integrado en Gmail, Android, Google Workspace y un sinfín de flujos de trabajo. ¿Necesitas enviar un PDF, una hoja de cálculo o un contrato? Súbelo a Drive, copia el enlace y envíalo.",
        "Esa comodidad ha hecho que Drive tenga un éxito enorme—pero también puede empujarnos a usar la misma herramienta en situaciones para las que no fue específicamente diseñada.",
        "Imagina enviar una copia del pasaporte a tu contable, un contrato laboral firmado a RR. HH. o documentos fiscales a un asesor financiero. En la mayoría de los casos, el destinatario solo necesita esos archivos una vez. Cuando la tarea termina, cada copia restante solo aumenta la probabilidad de que la información siga accesible más tiempo del necesario.",
        "El mayor riesgo rara vez es que alguien intercepte el archivo mientras viaja por internet. Los servicios en la nube modernos cifran los datos [en tránsito](blog:encrypted-vs-secure-file-sharing). El problema mayor es la **retención**. La información sensible a menudo permanece en el almacenamiento en la nube, las notificaciones de correo, las carpetas sincronizadas y los archivos descargados mucho después de que todo el mundo haya olvidado que existe.",
      ],
    },
    {
      title: "Google Drive está hecho para colaborar",
      takeaway:
        "La edición simultánea, el historial de versiones y las carpetas compartidas son fortalezas—no defectos.",
      paragraphs: [
        "Google Drive es excelente para que las personas trabajen juntas. Varias personas pueden editar el mismo documento a la vez, los cambios se guardan automáticamente, el historial de versiones facilita recuperar revisiones anteriores y los permisos se pueden ajustar cuando alguien se une o deja un proyecto. Para el trabajo continuo, son ventajas enormes.",
        "Exactamente ese es el entorno para el que se diseñó Drive. Una carpeta de proyecto puede permanecer activa durante meses mientras los documentos evolucionan y se añaden archivos nuevos.",
        "El reto aparece cuando esas mismas funciones de colaboración se usan para información que nunca debió seguir disponible.",
      ],
    },
    {
      title: "El coste oculto del acceso a largo plazo",
      takeaway:
        "Las entregas temporales dejan huellas permanentes cuando la plataforma optimiza la disponibilidad.",
      paragraphs: [
        "La mayoría de los archivos confidenciales no necesitan estar disponibles para siempre. Una copia del pasaporte puede servir solo para verificar la identidad. Una declaración de impuestos, solo para una presentación concreta. Una clave API podría usarse una vez y luego rotarse. Cuando el destinatario termina, seguir almacenando la información aporta muy poco beneficio.",
        "Por desgracia, eliminar el acceso no siempre es sencillo. La gente descarga archivos en sus portátiles. Sincroniza carpetas entre dispositivos. Las invitaciones por correo permanecen en las bandejas. Las carpetas compartidas siguen existiendo. Meses después, alguien encuentra una carpeta antigua con permisos que nadie recordaba haber concedido.",
        "Ninguno de estos hechos es un fallo de Google Drive. Son la consecuencia natural de usar una plataforma de colaboración para una entrega temporal—el mismo patrón de retención que aparece cuando la gente [envía secretos por correo](blog:why-email-is-worst-for-secrets) o deja [documentos en el chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Cuándo tienen más sentido los enlaces de un solo uso",
      takeaway:
        "Entregar una vez, caducar por diseño—sin convertir cada entrega en un espacio de trabajo compartido.",
      paragraphs: [
        "Los enlaces cifrados de un solo uso están diseñados con otro objetivo. En lugar de crear un espacio de trabajo compartido, se centran en entregar información confidencial con la menor huella digital práctica. La información se cifra antes de salir del navegador y el acceso puede limitarse a una sola vista o a un periodo de caducidad corto. Cuando la entrega termina, el enlace deja de ser usable.",
        "No se trata de sustituir el almacenamiento en la nube. Se trata de reconocer que no todo archivo merece almacenamiento permanente ni permisos continuos.",
        "Si envías un código de recuperación a un compañero, un contrato firmado a un cliente o historiales médicos a un especialista, probablemente no necesitas edición colaborativa, historial de versiones ni una carpeta compartida. Solo necesitas que la persona correcta reciba la información de forma segura—véase también [cómo enviar documentos sensibles de forma segura](blog:send-sensitive-documents-securely).",
        "Servicios como [PrivateNote](app:secure-file-transfer) están construidos en torno a este modelo de uso temporal. En lugar de fomentar el almacenamiento a largo plazo, minimizan la retención combinando cifrado del lado del cliente y caducidad automática.",
      ],
    },
    {
      title: "¿Qué método deberías elegir?",
      takeaway:
        "Ajusta la herramienta a la vida útil de la información—no a la plataforma más familiar.",
      paragraphs: [
        "La decisión tiene menos que ver con una «seguridad» abstracta y más con el propósito.",
        "Si varias personas necesitan revisar, editar y volver a un documento a lo largo del tiempo, Google Drive es una excelente opción. Comentarios, historial de versiones y carpetas compartidas facilitan la colaboración.",
        "Si la información solo debe entregarse una vez, un enlace cifrado de un solo uso suele encajar mejor. Elimina la necesidad de gestionar permisos duraderos, reduce copias innecesarias y limita cuánto tiempo permanece disponible la información.",
      ],
      calloutTitle: "Regla práctica",
      callout:
        "Elige la herramienta según cuánto tiempo la información necesita realmente permanecer disponible—no según la que abres por costumbre.",
    },
    {
      title: "Comparación",
      takeaway: "Las funciones de colaboración y la entrega efímera resuelven trabajos distintos.",
      comparisonTable: {
        headers: ["Característica", "Google Drive", "Enlace cifrado de un solo uso"],
        rows: [
          ["Diseñado para colaborar", "Sí", "No"],
          ["Almacenamiento a largo plazo", "Sí", "No"],
          ["Cifrado de extremo a extremo del lado del cliente", "No por defecto*", "Sí"],
          ["Caducidad automática", "No (limpieza manual)", "Sí"],
          ["Acceso de lectura única", "No", "Sí"],
          ["Gestión continua de permisos", "Sí", "No"],
          ["Mejor para compartir confidencial de forma temporal", "A veces", "Sí"],
        ],
        after: [
          "*Drive estándar cifra los datos en tránsito y en reposo con claves gestionadas por Google. Google Workspace ofrece [cifrado del lado del cliente](https://support.google.com/a/answer/10741875) opcional para algunas organizaciones, pero los enlaces compartidos cotidianos siguen optimizando el acceso duradero en lugar de una entrega burn-after-reading.",
        ],
      },
    },
    {
      title: "Lista de buenas prácticas",
      takeaway: "Pequeños hábitos reducen el riesgo de retención con la herramienta que elijas.",
      paragraphs: [
        "Sea cual sea la herramienta que elijas, unos pocos hábitos sencillos reducen mucho la exposición innecesaria.",
      ],
      checklist: [
        "Comparte solo lo que el destinatario necesita—evita carpetas enteras con datos personales no relacionados",
        "Elimina metadatos innecesarios de PDF, archivos de Office e imágenes cuando sea práctico",
        "Si usas una frase de acceso, envíala por un canal separado (fuera de banda / OOB)",
        "Cuando termine la tarea: revoca el acceso compartido, borra copias locales temporales y evita carpetas compartidas indefinidas",
      ],
      paragraphsAfterChecklist: [
        "La entrega fuera de banda significa que el enlace cifrado viaja por un canal (por ejemplo, el correo) mientras la frase de acceso viaja por otro (Signal, SMS o una llamada). Comprometer un solo canal no debería bastar para abrir el archivo.",
        "Para un flujo más profundo sobre entregas de documentos, sigue la [guía de documentos sensibles](blog:send-sensitive-documents-securely). Para cómo el cifrado del navegador difiere del de transporte, consulta [cifrado vs uso compartido seguro de archivos](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Preguntas frecuentes",
      faqs: [
        {
          question: "¿Es seguro Google Drive?",
          answer:
            "Sí—Google Drive es una plataforma en la nube madura que cifra la información en tránsito y en reposo. La exposición global sigue dependiendo de cómo se compartan los archivos, cómo se gestionen los permisos y cuánto tiempo permanezcan accesibles los documentos después de terminar la tarea.",
        },
        {
          question: "¿Google Drive tiene cifrado de extremo a extremo?",
          answer:
            "No en el sentido usado para mensajería cifrada del lado del cliente o enlaces de un solo uso cifrados en el navegador. En el almacenamiento estándar de Drive, Google gestiona las claves de cifrado. El cifrado opcional del lado del cliente de Workspace cambia ese panorama para organizaciones elegibles, pero el uso compartido cotidiano «cualquiera con el enlace» sigue dejando copias duraderas y superficies de permisos que la entrega efímera evita. Consulta [qué significa el cifrado de extremo a extremo](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "¿Los enlaces de un solo uso son más seguros que Google Drive?",
          answer:
            "Para entregas confidenciales temporales, a menudo reducen el riesgo a largo plazo porque minimizan la retención y pueden eliminar el acceso automáticamente tras la entrega. Para edición colaborativa y proyectos continuos, Drive sigue siendo la mejor herramienta. La seguridad sigue al propósito—no a un ranking universal.",
        },
        {
          question: "¿Qué pasa si envío un enlace de un solo uso a la persona equivocada?",
          answer:
            "Protege el contenido con una frase de acceso, usa una caducidad corta y destruye la nota antes de que se abra si tu herramienta lo permite. Verificar al destinatario antes de enviar sigue siendo la mejor defensa. Organismos como [CISA](https://www.cisa.gov/) enfatizan de forma consistente limitar la duración del acceso y el mínimo privilegio—las mismas ideas detrás de los enlaces cifrados de corta duración.",
        },
      ],
    },
  ],
  ctaTitle: "¿Necesitas una entrega confidencial temporal?",
  ctaBody:
    "Google Drive y los enlaces cifrados de un solo uso son herramientas complementarias. Si las personas necesitan colaborar en documentos a lo largo del tiempo, Drive es una de las mejores plataformas de colaboración. Si tu objetivo es entregar información confidencial una vez y minimizar cuánto tiempo permanece accesible, crea un enlace de un solo uso cifrado de extremo a extremo en tu navegador—sin dejar copias permanentes en el correo o en carpetas compartidas.",
  ctaButton: "Crear un enlace seguro de un solo uso",
};
