import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type ArticleCopy = {
  sourceLabel: string;
  intro: string[];
  sections: Array<{ title: string; body: string[]; bullets?: string[] }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

const sourceUrl = "https://www.businessinsider.com/openai-trial-exposes-truth-about-workplace-texts-2026-5";

const copy: Record<SupportedLanguage, ArticleCopy> = {
  en: {
    sourceLabel: "Inspired by reporting from Business Insider",
    intro: [
      "A recent Business Insider article about the OpenAI trial highlighted a problem many teams underestimate: workplace texts, personal-device messages, AI notes, and chat records can become part of a legal or internal dispute long after the moment has passed.",
      "The lesson is not to hide wrongdoing. The lesson is to stop treating every written channel as a harmless place for sensitive, unfinished, or context-heavy conversations.",
    ],
    sections: [
      {
        title: "Written messages have a longer life than people expect",
        body: [
          "A quick text can feel casual, but it still creates a record. In litigation or an internal investigation, relevance often matters more than whether the message lived on a work laptop, a personal phone, or a third-party app.",
          "Screenshots, backups, notification previews, synced devices, AI meeting tools, and forwarded messages all multiply the places where a sensitive conversation can survive.",
        ],
      },
      {
        title: "Where PrivateNote helps",
        body: [
          "PrivateNote is built for cases where a written message is useful, but a permanent copy is unnecessary. Notes are encrypted in the browser before upload, the server stores only ciphertext, and the decryption key stays in the link rather than on the server.",
          "For practical workplace hygiene, that means you can share a short-lived note for a password, recovery code, private draft, legal-sensitive detail, or temporary context without adding another permanent record to Slack, Teams, email, or SMS.",
        ],
        bullets: [
          "Use read-once notes when the recipient only needs the content once.",
          "Use short expirations when the information has a limited purpose.",
          "Use password protection for higher-risk handoffs and share the password separately.",
          "Avoid putting the most sensitive material into tools that create transcripts, previews, or searchable archives.",
        ],
      },
      {
        title: "What PrivateNote does not solve",
        body: [
          "No tool can make an inappropriate message safe. Recipients can still screenshot, copy, photograph, or forward what they can see. A compromised device can also expose plaintext while the note is open.",
          "PrivateNote reduces retention and server-side exposure. It does not replace judgment, legal advice, company policy, or a phone call when a topic is too nuanced for writing.",
        ],
      },
      {
        title: "A better rule for sensitive workplace communication",
        body: [
          "Ask two questions before writing: does this need to be written, and does it need to persist?",
          "If the answer to the first question is no, talk live. If the answer to the second is no, use an ephemeral, encrypted channel. That small habit can prevent temporary context from becoming permanent evidence.",
        ],
      },
    ],
    ctaTitle: "Use privacy as a workflow, not a panic button",
    ctaBody:
      "PrivateNote is most useful when teams adopt it before there is a problem: for secrets, temporary instructions, sensitive one-off context, and anything that should not become searchable workplace history.",
    ctaButton: "Write a Private Note",
  },
  de: {
    sourceLabel: "Inspiriert durch Berichterstattung von Business Insider",
    intro: [
      "Ein aktueller Business-Insider-Artikel zum OpenAI-Prozess zeigt ein Problem, das viele Teams unterschätzen: Arbeitsplatz-Texts, Nachrichten auf privaten Geräten, KI-Notizen und Chatverläufe können lange nach dem Moment Teil eines rechtlichen oder internen Streits werden.",
      "Die Lehre ist nicht, Fehlverhalten zu verstecken. Die Lehre ist, nicht jeden schriftlichen Kanal als harmlosen Ort für sensible, unfertige oder kontextabhängige Gespräche zu behandeln.",
    ],
    sections: [
      {
        title: "Schriftliche Nachrichten leben länger, als man denkt",
        body: [
          "Eine kurze Textnachricht fühlt sich informell an, erzeugt aber trotzdem einen Datensatz. In einem Verfahren oder einer internen Untersuchung zählt oft die Relevanz, nicht ob die Nachricht auf einem Arbeitslaptop, privaten Telefon oder in einer Drittanbieter-App lag.",
          "Screenshots, Backups, Benachrichtigungsvorschauen, synchronisierte Geräte, KI-Meeting-Tools und weitergeleitete Nachrichten vervielfachen die Orte, an denen sensible Gespräche überleben können.",
        ],
      },
      {
        title: "Wo PrivateNote hilft",
        body: [
          "PrivateNote ist für Fälle gebaut, in denen eine schriftliche Nachricht nützlich ist, aber keine dauerhafte Kopie nötig ist. Notizen werden vor dem Upload im Browser verschlüsselt, der Server speichert nur Chiffretext, und der Entschlüsselungsschlüssel bleibt im Link statt auf dem Server.",
          "Für praktische Arbeitsplatzhygiene heißt das: Sie können eine kurzlebige Notiz für ein Passwort, einen Wiederherstellungscode, einen privaten Entwurf, ein rechtlich sensibles Detail oder temporären Kontext teilen, ohne einen weiteren dauerhaften Eintrag in Slack, Teams, E-Mail oder SMS zu erzeugen.",
        ],
        bullets: [
          "Nutzen Sie Einmal-Notizen, wenn Empfänger den Inhalt nur einmal benötigen.",
          "Nutzen Sie kurze Ablaufzeiten, wenn Informationen nur einem begrenzten Zweck dienen.",
          "Nutzen Sie Passwortschutz für riskantere Übergaben und teilen Sie das Passwort separat.",
          "Vermeiden Sie besonders sensible Inhalte in Tools, die Transkripte, Vorschauen oder durchsuchbare Archive erzeugen.",
        ],
      },
      {
        title: "Was PrivateNote nicht löst",
        body: [
          "Kein Tool macht eine unangemessene Nachricht sicher. Empfänger können weiterhin Screenshots machen, kopieren, fotografieren oder weiterleiten, was sie sehen. Ein kompromittiertes Gerät kann Klartext ebenfalls offenlegen, während die Notiz geöffnet ist.",
          "PrivateNote reduziert Aufbewahrung und serverseitige Sichtbarkeit. Es ersetzt nicht Urteilsvermögen, Rechtsberatung, Unternehmensrichtlinien oder ein Telefonat, wenn ein Thema zu nuanciert für Schriftform ist.",
        ],
      },
      {
        title: "Eine bessere Regel für sensible Arbeitsplatzkommunikation",
        body: [
          "Stellen Sie vor dem Schreiben zwei Fragen: Muss das schriftlich sein, und muss es dauerhaft bleiben?",
          "Wenn die erste Antwort nein ist, sprechen Sie live. Wenn die zweite Antwort nein ist, nutzen Sie einen kurzlebigen, verschlüsselten Kanal. Diese kleine Gewohnheit kann verhindern, dass temporärer Kontext zu dauerhaftem Beweismaterial wird.",
        ],
      },
    ],
    ctaTitle: "Nutzen Sie Privatsphäre als Arbeitsablauf, nicht als Panikknopf",
    ctaBody:
      "PrivateNote ist am nützlichsten, wenn Teams es einsetzen, bevor es ein Problem gibt: für Geheimnisse, temporäre Anweisungen, sensible Einmal-Kontexte und alles, was nicht zur durchsuchbaren Arbeitsplatzhistorie werden sollte.",
    ctaButton: "Private Notiz schreiben",
  },
  fr: {
    sourceLabel: "Inspiré par un article de Business Insider",
    intro: [
      "Un récent article de Business Insider sur le procès OpenAI met en lumière un problème souvent sous-estimé : textos professionnels, messages sur appareils personnels, notes IA et historiques de chat peuvent entrer dans un litige ou une enquête interne longtemps après les faits.",
      "La leçon n'est pas de cacher des fautes. La leçon est d'arrêter de traiter chaque canal écrit comme un endroit sans risque pour des conversations sensibles, incomplètes ou dépendantes du contexte.",
    ],
    sections: [
      {
        title: "Les messages écrits vivent plus longtemps qu'on ne le pense",
        body: [
          "Un texto rapide peut sembler informel, mais il crée tout de même une trace. Dans un litige ou une enquête interne, la pertinence compte souvent plus que le fait que le message se trouve sur un ordinateur de travail, un téléphone personnel ou une application tierce.",
          "Captures d'écran, sauvegardes, aperçus de notifications, appareils synchronisés, outils de réunion IA et messages transférés multiplient les endroits où une conversation sensible peut survivre.",
        ],
      },
      {
        title: "Là où PrivateNote aide",
        body: [
          "PrivateNote est conçu pour les cas où un message écrit est utile, mais où une copie permanente ne l'est pas. Les notes sont chiffrées dans le navigateur avant l'envoi, le serveur ne stocke que du texte chiffré, et la clé de déchiffrement reste dans le lien plutôt que sur le serveur.",
          "Pour une bonne hygiène au travail, vous pouvez partager une note de courte durée pour un mot de passe, un code de récupération, un brouillon privé, un détail juridiquement sensible ou un contexte temporaire sans ajouter une trace permanente à Slack, Teams, e-mail ou SMS.",
        ],
        bullets: [
          "Utilisez des notes à lecture unique lorsque le destinataire n'a besoin du contenu qu'une fois.",
          "Utilisez des expirations courtes lorsque l'information a un objectif limité.",
          "Ajoutez un mot de passe pour les transmissions plus risquées et partagez-le séparément.",
          "Évitez de placer les contenus les plus sensibles dans des outils qui créent transcriptions, aperçus ou archives consultables.",
        ],
      },
      {
        title: "Ce que PrivateNote ne résout pas",
        body: [
          "Aucun outil ne rend sûr un message inapproprié. Les destinataires peuvent toujours capturer, copier, photographier ou transférer ce qu'ils voient. Un appareil compromis peut aussi exposer le texte en clair pendant l'ouverture de la note.",
          "PrivateNote réduit la conservation et l'exposition côté serveur. Il ne remplace pas le jugement, le conseil juridique, les règles de l'entreprise ou un appel lorsque le sujet est trop nuancé pour l'écrit.",
        ],
      },
      {
        title: "Une meilleure règle pour les sujets sensibles",
        body: [
          "Avant d'écrire, posez deux questions : cela doit-il être écrit, et cela doit-il persister ?",
          "Si la première réponse est non, parlez en direct. Si la seconde est non, utilisez un canal éphémère et chiffré. Cette petite habitude peut empêcher un contexte temporaire de devenir une preuve permanente.",
        ],
      },
    ],
    ctaTitle: "Utilisez la confidentialité comme un processus, pas comme un bouton panique",
    ctaBody:
      "PrivateNote est le plus utile lorsque les équipes l'adoptent avant un problème : pour les secrets, instructions temporaires, contextes sensibles ponctuels et tout ce qui ne devrait pas devenir un historique professionnel consultable.",
    ctaButton: "Écrire une note privée",
  },
  es: {
    sourceLabel: "Inspirado en un artículo de Business Insider",
    intro: [
      "Un artículo reciente de Business Insider sobre el juicio de OpenAI subraya un problema que muchos equipos subestiman: textos de trabajo, mensajes en dispositivos personales, notas de IA e historiales de chat pueden entrar en una disputa legal o interna mucho después del momento original.",
      "La lección no es ocultar malas conductas. La lección es dejar de tratar cada canal escrito como un lugar inocuo para conversaciones sensibles, incompletas o muy dependientes del contexto.",
    ],
    sections: [
      {
        title: "Los mensajes escritos viven más de lo que la gente espera",
        body: [
          "Un texto rápido puede parecer informal, pero crea un registro. En un litigio o investigación interna, la relevancia suele importar más que si el mensaje estaba en un portátil de trabajo, un teléfono personal o una app de terceros.",
          "Capturas, copias de seguridad, vistas previas de notificaciones, dispositivos sincronizados, herramientas de reuniones con IA y mensajes reenviados multiplican los lugares donde una conversación sensible puede sobrevivir.",
        ],
      },
      {
        title: "Dónde ayuda PrivateNote",
        body: [
          "PrivateNote está diseñado para casos en los que un mensaje escrito es útil, pero una copia permanente no. Las notas se cifran en el navegador antes de subirse, el servidor solo almacena texto cifrado y la clave de descifrado permanece en el enlace, no en el servidor.",
          "Para una higiene práctica en el trabajo, puedes compartir una nota de corta duración para una contraseña, un código de recuperación, un borrador privado, un detalle legalmente sensible o contexto temporal sin añadir otro registro permanente a Slack, Teams, correo o SMS.",
        ],
        bullets: [
          "Usa notas de una sola lectura cuando el destinatario solo necesite el contenido una vez.",
          "Usa caducidades cortas cuando la información tenga un propósito limitado.",
          "Usa protección con contraseña para entregas de mayor riesgo y comparte la contraseña por separado.",
          "Evita poner material muy sensible en herramientas que crean transcripciones, vistas previas o archivos buscables.",
        ],
      },
      {
        title: "Lo que PrivateNote no resuelve",
        body: [
          "Ninguna herramienta vuelve seguro un mensaje inapropiado. Los destinatarios aún pueden hacer capturas, copiar, fotografiar o reenviar lo que ven. Un dispositivo comprometido también puede exponer el texto mientras la nota está abierta.",
          "PrivateNote reduce retención y exposición del lado del servidor. No sustituye el criterio, el asesoramiento legal, la política de la empresa ni una llamada cuando un tema tiene demasiados matices para escribirlo.",
        ],
      },
      {
        title: "Una regla mejor para comunicación laboral sensible",
        body: [
          "Antes de escribir, haz dos preguntas: ¿esto necesita estar escrito, y necesita persistir?",
          "Si la primera respuesta es no, habla en directo. Si la segunda es no, usa un canal efímero y cifrado. Ese pequeño hábito puede evitar que un contexto temporal se convierta en evidencia permanente.",
        ],
      },
    ],
    ctaTitle: "Usa la privacidad como flujo de trabajo, no como botón de pánico",
    ctaBody:
      "PrivateNote es más útil cuando los equipos lo adoptan antes de que haya un problema: para secretos, instrucciones temporales, contexto sensible puntual y cualquier cosa que no debería convertirse en historial laboral buscable.",
    ctaButton: "Escribir una nota privada",
  },
};

export const WorkplaceTextsPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = copy[language];
  const blogPath = localizedPath("/blog", language);
  const notePath = localizedPath("/", language);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <Link
        href={blogPath}
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> {t.blogBackToBlog}
      </Link>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-4">{t.blogWorkplaceTextsTitle}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">{t.blogWorkplaceTextsExcerpt}</p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
          >
            {article.sourceLabel}
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </header>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {article.sections.map((section) => (
            <section className="space-y-4" key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{article.ctaTitle}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5">{article.ctaBody}</p>
          <Link
            href={notePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            {article.ctaButton}
          </Link>
        </div>
      </article>
    </div>
  );
};
