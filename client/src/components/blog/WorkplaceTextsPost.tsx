import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { workplaceTextsHr } from "@/components/blog/locale/workplaceTexts.hr";
import { workplaceTextsNl } from "@/components/blog/locale/workplaceTexts.nl";
import { workplaceTextsPt } from "@/components/blog/locale/workplaceTexts.pt";
import { workplaceTextsSr } from "@/components/blog/locale/workplaceTexts.sr";

type ArticleCopy = {
  sourceLabel: string;
  intro: string[];
  sections: Array<{ title: string; body: string[]; bullets?: string[] }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

const sourceUrl = "https://www.businessinsider.com/openai-trial-exposes-truth-about-workplace-texts-2026-5";
const heroImagePath = "/images/workplace-texting-jonas-leupe.jpg";
const heroImageCreditUrl =
  "https://unsplash.com/photos/man-in-black-crew-neck-top-using-smartphone-8pCtwj37VB4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink";

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    sourceLabel: "Inspired by reporting from Business Insider",
    intro: [
      "The recent Business Insider coverage of the OpenAI trial is a reminder that modern workplace communication is effectively permanent.",
      "Text messages, Slack conversations, AI meeting transcripts, synced devices, personal-phone chats, and collaboration tools can all become evidence long after the original context disappears.",
      "The lesson is not to hide wrongdoing. It is to be intentional about what gets written, where it lives, and how long it survives.",
    ],
    sections: [
      {
        title: "Written messages live longer than people expect",
        body: [
          "A quick message can feel informal and temporary, but digital communication rarely stays contained.",
          "Screenshots, notification previews, cloud backups, synced devices, forwarded emails, AI-generated summaries, and archived chat histories all create additional copies that may persist for years.",
          "As teams rely more on AI-powered tools, automatic records continue to grow. Meeting assistants generate transcripts, copilots summarize conversations, and productivity platforms increasingly turn temporary discussions into searchable institutional memory.",
        ],
      },
      {
        title: "Not every message needs to become permanent history",
        body: [
          "Some communication should absolutely be retained for accountability, operations, compliance, or legal obligations. But many messages do not need durable storage.",
          "Temporary credentials, recovery codes, one-time instructions, sensitive drafts, private feedback, legal-sensitive context, and short-lived operational details often have a limited purpose and lifespan.",
          "Good communication hygiene means distinguishing information that must persist from information that only needs to exist briefly.",
        ],
      },
      {
        title: "Where PrivateNote helps",
        body: [
          "PrivateNote is useful when information needs to be shared briefly without creating another long-term searchable record.",
          "Notes are encrypted in the browser before upload. The server stores only ciphertext, while the decryption key remains in the URL fragment and is not transmitted to the server in standard requests.",
          "That helps teams share temporary information without automatically adding it to Slack archives, Teams history, email inboxes, SMS backups, or collaborative document systems.",
        ],
        bullets: [
          "Passwords and recovery codes",
          "Temporary access instructions",
          "Sensitive one-off operational details",
          "Legal-sensitive drafts or context",
          "Private handoffs between teammates",
          "Information with a short operational lifespan",
        ],
      },
      {
        title: "What PrivateNote does not solve",
        body: [
          "No tool can make an inappropriate message safe. Recipients can still screenshot, copy, photograph, or forward what they can see.",
          "A compromised device can expose plaintext while a note is open. Ephemeral tools also do not replace legal obligations, company policy, retention requirements, or professional judgment.",
          "PrivateNote reduces server-side exposure and long-term retention. It does not eliminate risk or replace live conversation when nuance matters more than convenience.",
        ],
      },
      {
        title: "A better rule for sensitive workplace communication",
        body: [
          "Before sending a message, ask two questions: Does this need to be written? Does this need to persist?",
          "If the answer to the first question is no, talk live. If the answer to the second is no, use an ephemeral and encrypted channel designed for temporary communication.",
          "That small habit can prevent temporary context from becoming permanent evidence.",
        ],
      },
    ],
    ctaTitle: "Use privacy as a workflow, not a panic button",
    ctaBody:
      "Privacy tools are most effective when adopted before there is a problem. Use ephemeral communication for secrets, one-time instructions, and short-lived context that should not become permanent workplace history.",
    ctaButton: "Write a Private Note",
  },
  de: {
    sourceLabel: "Inspiriert durch Berichterstattung von Business Insider",
    intro: [
      "Die aktuelle Berichterstattung von Business Insider zum OpenAI-Prozess erinnert daran, dass moderne Kommunikation am Arbeitsplatz faktisch dauerhaft ist.",
      "Textnachrichten, Slack-Verläufe, KI-Meeting-Transkripte, synchronisierte Geräte, private Smartphone-Chats und Kollaborationstools können noch lange nach dem ursprünglichen Kontext zu Beweismitteln werden.",
      "Die Lehre ist nicht, Fehlverhalten zu verstecken. Es geht darum, bewusst zu entscheiden, was schriftlich festgehalten wird, wo es gespeichert ist und wie lange es bestehen bleibt.",
    ],
    sections: [
      {
        title: "Schriftliche Nachrichten leben länger als erwartet",
        body: [
          "Eine kurze Nachricht wirkt oft informell und temporär, doch digitale Kommunikation bleibt selten wirklich begrenzt.",
          "Screenshots, Benachrichtigungsvorschauen, Cloud-Backups, synchronisierte Geräte, weitergeleitete E-Mails, KI-Zusammenfassungen und Chat-Archive erzeugen zusätzliche Kopien, die über Jahre bestehen können.",
          "Je stärker Teams auf KI-gestützte Tools setzen, desto mehr automatische Aufzeichnungen entstehen. Meeting-Assistenten schreiben Transkripte, Copilots fassen Gespräche zusammen, und Produktivitätsplattformen machen temporäre Diskussionen zu durchsuchbarem Unternehmensgedächtnis.",
        ],
      },
      {
        title: "Nicht jede Nachricht muss zur dauerhaften Akte werden",
        body: [
          "Manche Kommunikation muss aus Gründen der Nachvollziehbarkeit, des Betriebs, der Compliance oder rechtlicher Pflichten selbstverständlich aufbewahrt werden. Vieles muss es aber nicht.",
          "Temporäre Zugangsdaten, Wiederherstellungscodes, einmalige Anweisungen, sensible Entwürfe, privates Feedback, rechtlich sensible Kontexte oder kurzlebige operative Details haben oft nur einen begrenzten Zweck und eine kurze Lebensdauer.",
          "Gute Kommunikationshygiene heißt, klar zu unterscheiden: Was muss bleiben, und was muss nur kurz existieren?",
        ],
      },
      {
        title: "Wo PrivateNote hilft",
        body: [
          "PrivateNote ist nützlich, wenn Informationen kurz geteilt werden müssen, ohne einen weiteren langfristig durchsuchbaren Datensatz zu erzeugen.",
          "Notizen werden vor dem Upload im Browser verschlüsselt. Der Server speichert nur Chiffretext, während der Entschlüsselungsschlüssel im URL-Fragment bleibt und bei Standardanfragen nicht an den Server übertragen wird.",
          "So lassen sich temporäre Informationen teilen, ohne sie automatisch in Slack-Archiven, Teams-Historien, E-Mail-Postfächern, SMS-Backups oder kollaborativen Dokumentensystemen abzulegen.",
        ],
        bullets: [
          "Passwörter und Wiederherstellungscodes",
          "Temporäre Zugriffsanweisungen",
          "Sensible einmalige operative Details",
          "Rechtlich sensible Entwürfe oder Kontexte",
          "Private Übergaben zwischen Teammitgliedern",
          "Informationen mit kurzer operativer Lebensdauer",
        ],
      },
      {
        title: "Was PrivateNote nicht löst",
        body: [
          "Kein Tool macht eine unangemessene Nachricht sicher. Empfänger können weiterhin Screenshots erstellen, Inhalte kopieren, fotografieren oder weiterleiten.",
          "Ein kompromittiertes Gerät kann Klartext offenlegen, solange eine Notiz geöffnet ist. Kurzlebige Tools ersetzen außerdem keine rechtlichen Pflichten, Unternehmensrichtlinien, Aufbewahrungsvorgaben oder professionelles Urteilsvermögen.",
          "PrivateNote reduziert serverseitige Sichtbarkeit und langfristige Aufbewahrung. Es eliminiert Risiken nicht und ersetzt kein direktes Gespräch, wenn Nuance wichtiger ist als Bequemlichkeit.",
        ],
      },
      {
        title: "Eine bessere Regel für sensible Arbeitsplatzkommunikation",
        body: [
          "Stellen Sie vor dem Senden zwei Fragen: Muss das schriftlich sein? Muss es dauerhaft bleiben?",
          "Wenn die erste Antwort nein ist, sprechen Sie direkt miteinander. Wenn die zweite Antwort nein ist, nutzen Sie einen kurzlebigen und verschlüsselten Kanal für temporäre Kommunikation.",
          "Diese kleine Gewohnheit kann verhindern, dass temporärer Kontext zu dauerhaftem Beweismaterial wird.",
        ],
      },
    ],
    ctaTitle: "Nutzen Sie Privatsphäre als Arbeitsablauf, nicht als Panikknopf",
    ctaBody:
      "Datenschutztools sind am wirksamsten, wenn sie vor dem Problem eingesetzt werden. Nutzen Sie kurzlebige Kommunikation für Geheimnisse, einmalige Anweisungen und temporären Kontext, der nicht Teil einer dauerhaften Arbeitsplatzhistorie werden sollte.",
    ctaButton: "Private Notiz schreiben",
  },
  fr: {
    sourceLabel: "Inspiré par un article de Business Insider",
    intro: [
      "La récente couverture de Business Insider sur le procès OpenAI rappelle qu’aujourd’hui, la communication au travail est pratiquement permanente.",
      "SMS, conversations Slack, transcriptions de réunions IA, appareils synchronisés, chats sur téléphone personnel et outils collaboratifs peuvent devenir des preuves bien après la disparition du contexte initial.",
      "La leçon n’est pas de dissimuler des fautes. Il s’agit de décider délibérément ce qui est écrit, où c’est stocké et combien de temps cela reste accessible.",
    ],
    sections: [
      {
        title: "Les messages écrits vivent plus longtemps qu’on ne l’imagine",
        body: [
          "Un message rapide peut sembler informel et temporaire, mais la communication numérique reste rarement confinée.",
          "Captures d’écran, aperçus de notifications, sauvegardes cloud, appareils synchronisés, e-mails transférés, résumés IA et historiques de chat créent des copies supplémentaires qui peuvent persister pendant des années.",
          "Avec la montée des outils dopés à l’IA, les traces automatiques se multiplient. Les assistants de réunion génèrent des transcriptions, les copilotes résument les échanges, et les plateformes de productivité transforment de plus en plus les discussions temporaires en mémoire institutionnelle consultable.",
        ],
      },
      {
        title: "Tous les messages ne doivent pas devenir une trace permanente",
        body: [
          "Certaines communications doivent évidemment être conservées pour la responsabilité, la continuité opérationnelle, la conformité ou des obligations légales. Mais beaucoup ne le doivent pas.",
          "Identifiants temporaires, codes de récupération, consignes à usage unique, brouillons sensibles, retours privés, contexte juridiquement sensible ou détails opérationnels de courte durée ont souvent un objectif limité et une durée de vie limitée.",
          "Une bonne hygiène de communication consiste à distinguer ce qui doit persister de ce qui n’a besoin d’exister que brièvement.",
        ],
      },
      {
        title: "Là où PrivateNote aide",
        body: [
          "PrivateNote est utile quand l’information doit être transmise brièvement, sans créer un nouvel enregistrement durable et consultable.",
          "Les notes sont chiffrées dans le navigateur avant envoi. Le serveur ne stocke que du chiffré, tandis que la clé de déchiffrement reste dans le fragment d’URL et n’est pas transmise au serveur dans les requêtes standard.",
          "En pratique, cela permet de partager des informations temporaires sans les ajouter automatiquement aux archives Slack, à l’historique Teams, aux boîtes e-mail, aux sauvegardes SMS ou aux systèmes documentaires collaboratifs.",
        ],
        bullets: [
          "Mots de passe et codes de récupération",
          "Consignes d’accès temporaires",
          "Détails opérationnels sensibles à usage unique",
          "Brouillons ou contexte juridiquement sensibles",
          "Passations privées entre collègues",
          "Informations à courte durée de vie opérationnelle",
        ],
      },
      {
        title: "Ce que PrivateNote ne résout pas",
        body: [
          "Aucun outil ne rend sûr un message inapproprié. Les destinataires peuvent toujours capturer, copier, photographier ou transférer ce qu’ils voient.",
          "Un appareil compromis peut exposer le texte en clair pendant l’ouverture de la note. Les outils éphémères ne remplacent pas non plus les obligations légales, les politiques internes, les exigences de rétention ou le jugement professionnel.",
          "PrivateNote réduit l’exposition côté serveur et la rétention long terme. Il n’élimine pas le risque et ne remplace pas une conversation en direct quand la nuance compte davantage que la commodité.",
        ],
      },
      {
        title: "Une meilleure règle pour les sujets sensibles",
        body: [
          "Avant d’envoyer un message, posez deux questions : faut-il l’écrire ? Doit-il persister ?",
          "Si la première réponse est non, parlez en direct. Si la seconde est non, utilisez un canal éphémère et chiffré conçu pour la communication temporaire.",
          "Cette petite habitude peut éviter qu’un contexte temporaire devienne une preuve permanente.",
        ],
      },
    ],
    ctaTitle: "Utilisez la confidentialité comme un processus, pas comme un bouton panique",
    ctaBody:
      "Les outils de confidentialité sont les plus efficaces lorsqu’ils sont adoptés avant le problème. Utilisez la communication éphémère pour les secrets, les consignes à usage unique et les contextes temporaires qui ne doivent pas devenir un historique professionnel permanent.",
    ctaButton: "Écrire une note privée",
  },
  es: {
    sourceLabel: "Inspirado en un artículo de Business Insider",
    intro: [
      "La reciente cobertura de Business Insider sobre el juicio de OpenAI recuerda que la comunicación laboral moderna es, en la práctica, permanente.",
      "Mensajes de texto, conversaciones de Slack, transcripciones de reuniones con IA, dispositivos sincronizados, chats en teléfonos personales y herramientas colaborativas pueden convertirse en evidencia mucho después de que desaparece el contexto original.",
      "La lección no es ocultar conductas indebidas. Es decidir con cuidado qué se escribe, dónde se guarda y cuánto tiempo permanece accesible.",
    ],
    sections: [
      {
        title: "Los mensajes escritos duran más de lo que se espera",
        body: [
          "Un mensaje rápido puede parecer informal y temporal, pero la comunicación digital rara vez queda contenida.",
          "Capturas de pantalla, vistas previas de notificaciones, copias de seguridad en la nube, dispositivos sincronizados, correos reenviados, resúmenes generados por IA e historiales de chat crean copias adicionales que pueden persistir durante años.",
          "A medida que los equipos dependen más de herramientas con IA, crece el número de registros automáticos. Los asistentes de reuniones generan transcripciones, los copilotos resumen conversaciones y las plataformas de productividad convierten debates temporales en memoria institucional consultable.",
        ],
      },
      {
        title: "No todo mensaje debe convertirse en registro permanente",
        body: [
          "Hay comunicaciones que sí deben conservarse por responsabilidad, continuidad operativa, cumplimiento o obligaciones legales. Pero muchas no.",
          "Credenciales temporales, códigos de recuperación, instrucciones de un solo uso, borradores sensibles, comentarios privados, contexto legalmente sensible o detalles operativos de corta duración suelen tener un propósito y una vida útil limitados.",
          "La buena higiene de comunicación consiste en distinguir qué información debe persistir y cuál solo necesita existir brevemente.",
        ],
      },
      {
        title: "Dónde ayuda PrivateNote",
        body: [
          "PrivateNote ayuda cuando la información debe comunicarse de forma breve sin crear otro registro buscable a largo plazo.",
          "Las notas se cifran en el navegador antes de subirse. El servidor solo guarda texto cifrado, mientras la clave de descifrado permanece en el fragmento de la URL y no se transmite al servidor en solicitudes estándar.",
          "En la práctica, permite compartir información temporal sin añadirla automáticamente a archivos de Slack, historial de Teams, bandejas de correo, copias SMS o sistemas colaborativos de documentos.",
        ],
        bullets: [
          "Contraseñas y códigos de recuperación",
          "Instrucciones temporales de acceso",
          "Detalles operativos sensibles de una sola vez",
          "Borradores o contexto legalmente sensibles",
          "Entregas privadas entre compañeros",
          "Información con vida operativa corta",
        ],
      },
      {
        title: "Lo que PrivateNote no resuelve",
        body: [
          "Ninguna herramienta hace seguro un mensaje inapropiado. Los destinatarios aún pueden hacer capturas, copiar, fotografiar o reenviar lo que ven.",
          "Un dispositivo comprometido también puede exponer texto en claro mientras la nota está abierta. Las herramientas efímeras tampoco sustituyen obligaciones legales, políticas de la empresa, requisitos de retención ni criterio profesional.",
          "PrivateNote reduce la exposición del lado del servidor y la retención a largo plazo. No elimina el riesgo ni reemplaza una conversación en vivo cuando el matiz importa más que la comodidad.",
        ],
      },
      {
        title: "Una regla mejor para comunicación laboral sensible",
        body: [
          "Antes de enviar un mensaje, haz dos preguntas: ¿esto necesita escribirse? ¿esto necesita persistir?",
          "Si la primera respuesta es no, habla en vivo. Si la segunda es no, usa un canal efímero y cifrado diseñado para comunicación temporal.",
          "Ese pequeño hábito puede evitar que un contexto temporal se convierta en evidencia permanente.",
        ],
      },
    ],
    ctaTitle: "Usa la privacidad como flujo de trabajo, no como botón de pánico",
    ctaBody:
      "Las herramientas de privacidad funcionan mejor cuando se adoptan antes del problema. Usa comunicación efímera para secretos, instrucciones de un solo uso y contexto breve que no debería convertirse en historial laboral permanente.",
    ctaButton: "Escribir una nota privada",
  },
  it: {
    sourceLabel: "Ispirato a un articolo di Business Insider",
    intro: [
      "La recente copertura di Business Insider sul processo OpenAI ricorda che la comunicazione moderna sul lavoro è, di fatto, permanente.",
      "Messaggi di testo, conversazioni Slack, trascrizioni di riunioni generate dall’IA, dispositivi sincronizzati, chat su telefoni personali e strumenti collaborativi possono diventare prove molto dopo che il contesto originale è scomparso.",
      "La lezione non è nascondere comportamenti scorretti. È essere intenzionali su ciò che viene scritto, dove vive e per quanto tempo sopravvive.",
    ],
    sections: [
      {
        title: "I messaggi scritti vivono più a lungo di quanto si pensi",
        body: [
          "Un messaggio rapido può sembrare informale e temporaneo, ma la comunicazione digitale raramente resta confinata.",
          "Screenshot, anteprime delle notifiche, backup cloud, dispositivi sincronizzati, e-mail inoltrate, riepiloghi generati dall’IA e archivi chat creano copie aggiuntive che possono persistere per anni.",
          "Man mano che i team si affidano a strumenti basati sull’IA, i record automatici continuano a crescere. Gli assistenti alle riunioni generano trascrizioni, i copilot riassumono conversazioni e le piattaforme di produttività trasformano sempre più discussioni temporanee in memoria istituzionale ricercabile.",
        ],
      },
      {
        title: "Non ogni messaggio deve diventare storia permanente",
        body: [
          "Alcune comunicazioni devono assolutamente essere conservate per accountability, operatività, compliance o obblighi legali. Ma molti messaggi non hanno bisogno di archiviazione durevole.",
          "Credenziali temporanee, codici di recupero, istruzioni monouso, bozze sensibili, feedback privato, contesto legalmente delicato e dettagli operativi di breve durata hanno spesso uno scopo e una vita limitati.",
          "Una buona igiene della comunicazione significa distinguere le informazioni che devono persistere da quelle che devono esistere solo per poco.",
        ],
      },
      {
        title: "Dove aiuta PrivateNote",
        body: [
          "PrivateNote è utile quando un’informazione deve essere condivisa brevemente senza creare un altro record ricercabile a lungo termine.",
          "Le note vengono cifrate nel browser prima dell’invio. Il server conserva solo testo cifrato, mentre la chiave di decifratura resta nel frammento dell’URL e non viene trasmessa al server nelle richieste standard.",
          "Questo aiuta i team a condividere informazioni temporanee senza aggiungerle automaticamente agli archivi Slack, alla cronologia Teams, alle caselle e-mail, ai backup SMS o ai sistemi documentali collaborativi.",
        ],
        bullets: [
          "Password e codici di recupero",
          "Istruzioni di accesso temporanee",
          "Dettagli operativi sensibili e monouso",
          "Bozze o contesto legalmente delicati",
          "Passaggi privati tra colleghi",
          "Informazioni con una vita operativa breve",
        ],
      },
      {
        title: "Che cosa PrivateNote non risolve",
        body: [
          "Nessuno strumento può rendere sicuro un messaggio inappropriato. I destinatari possono comunque fare screenshot, copiare, fotografare o inoltrare ciò che vedono.",
          "Un dispositivo compromesso può esporre il testo in chiaro mentre una nota è aperta. Gli strumenti effimeri inoltre non sostituiscono obblighi legali, policy aziendali, requisiti di conservazione o giudizio professionale.",
          "PrivateNote riduce l’esposizione lato server e la conservazione a lungo termine. Non elimina il rischio e non sostituisce una conversazione dal vivo quando le sfumature contano più della comodità.",
        ],
      },
      {
        title: "Una regola migliore per comunicazioni lavorative sensibili",
        body: [
          "Prima di inviare un messaggio, poniti due domande: deve essere scritto? Deve persistere?",
          "Se la risposta alla prima domanda è no, parlane dal vivo. Se la risposta alla seconda è no, usa un canale effimero e cifrato progettato per comunicazioni temporanee.",
          "Questa piccola abitudine può evitare che un contesto temporaneo diventi prova permanente.",
        ],
      },
    ],
    ctaTitle: "Usa la privacy come flusso di lavoro, non come pulsante di emergenza",
    ctaBody:
      "Gli strumenti di privacy sono più efficaci quando vengono adottati prima che esista un problema. Usa comunicazioni effimere per segreti, istruzioni monouso e contesti di breve durata che non dovrebbero diventare cronologia permanente del lavoro.",
    ctaButton: "Scrivi una nota privata",
  },
  nl: workplaceTextsNl,
  pt: workplaceTextsPt,
  hr: workplaceTextsHr,
  sr: workplaceTextsSr,
};

export const WorkplaceTextsPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const blogPath = localizedPath("/blog", language);
  const notePath = localizedPath("/", language);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="workplace-texts-private-note"
          title={t.blogWorkplaceTextsTitle}
          excerpt={t.blogWorkplaceTextsExcerpt}
          headerClassName="mb-10"
        >
          <figure className="mt-6">
            <img
              src={heroImagePath}
              alt="Man using smartphone in an urban setting"
              width={1000}
              height={666}
              decoding="async"
              fetchPriority="high"
              className="w-full max-w-2xl max-h-[340px] mx-auto rounded-2xl border border-gray-200 dark:border-gray-800 object-cover"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Photo by{" "}
              <a
                href={heroImageCreditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                Jonas Leupe
              </a>{" "}
              on Unsplash.
            </figcaption>
          </figure>
        </BlogPostHeader>

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

        <div className="mt-8 border-t border-gray-200 pt-5 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-semibold text-primary hover:text-primary/80"
          >
            {article.sourceLabel}
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>

        <BlogPostCrossLinks slug="workplace-texts-private-note" />
      </article>
    </div>
  );
};
