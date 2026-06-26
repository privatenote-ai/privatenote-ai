import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type ArticleCopy = {
  intro: string[];
  sections: Array<{ title: string; body: string[]; bullets?: string[]; code?: string }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "You need to send a password to a colleague. Maybe it's the staging database. Maybe it's a Stripe key that's about to go into production. Maybe it's an SSH credential for a server that only you and two other people are supposed to touch.",
      "You open Slack. You start typing. And then — a small, familiar hesitation.",
      "That message is going to sit in your chat history. It's going to sync to three devices. It might end up in a backup, a search index, a compliance archive. Long after you've rotated the credential and forgotten about it, that message is still there.",
      "PrivateNote is a different path. The secret gets encrypted on your machine before it touches any network. The decryption key lives only in the URL you share — the server that stores the note never sees it. The note self-destructs after the first read. Nothing persists.",
      "Here's how to use it — starting with the easiest option.",
    ],
    sections: [
      {
        title: "The VS Code and Cursor extension",
        body: [
          "If you spend your days in VS Code or Cursor, this is the most frictionless path. Install the extension once and it sits in your sidebar, always one click away.",
          "Open the Extensions panel (Cmd+Shift+X), search for PrivateNote, and click Install. After a window reload, a small envelope icon appears in the activity bar on the left.",
          "Click it. A panel opens:",
        ],
        bullets: [
          "Type or paste the secret into the content box",
          "Set an expiry — 15 minutes, 1 hour, 1 day, or 7 days",
          "Leave \"Burn after reading\" checked (the default)",
          "Click Share PrivateNote →",
        ],
      },
      {
        title: "What happens when you click Share",
        body: [
          "Your browser's built-in cryptography generates a random 256-bit key. That key never leaves your machine.",
          "The content is encrypted with AES-256-GCM. The result is a blob of ciphertext with no readable content inside.",
          "Only that ciphertext is sent to the PrivateNote server. The key is not included — not in the request body, not in a header, not anywhere.",
          "The server stores the encrypted blob and hands back a note ID. Your machine builds a shareable URL: the note ID in the path, the decryption key in the URL fragment — the #this-part that browsers never send to servers.",
          "The link copies to your clipboard. You paste it wherever you'd normally paste the secret. The difference is that the link is the secret now, not the password itself.",
        ],
      },
      {
        title: "Two other ways to use the extension",
        body: [
          "You don't always need to open the panel. Two faster shortcuts exist:",
          "Select any text in your editor and right-click — you'll see Share as PrivateNote in the context menu. A quick-pick prompt asks for expiry and burn preference, then the link copies to your clipboard.",
          "When you have text selected, a lock icon also appears in the editor title bar at the top right. One click sends it.",
        ],
      },
      {
        title: "If you use an AI assistant: the MCP server",
        body: [
          "If you work in Cursor with Claude or another model, you can let the AI create PrivateNotes on your behalf. The MCP (Model Context Protocol) server adds a create_private_note tool that the agent can call automatically.",
          "Add this to ~/.cursor/mcp.json:",
        ],
        code: `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`,
        bullets: [
          "Restart Cursor and check Settings → MCP — you should see privatenote with a green dot",
          "Then just tell the agent: \"Send this API key securely, burn after reading\"",
          "The agent calls the tool, encryption runs locally, and you get a link",
        ],
      },
      {
        title: "One thing to understand about AI and secrets",
        body: [
          "When you include a secret in an AI prompt, the model reads it before the MCP tool encrypts it. The AI provider's servers briefly see the content.",
          "This is still a meaningful improvement over sending it through Slack — the secret doesn't end up in persistent chat history, email, or server logs. But it's not the same as the AI never seeing it.",
          "For full end-to-end privacy when using an AI agent, use a local model running on your machine (like Ollama). Then nothing leaves your computer until it's already encrypted.",
        ],
      },
      {
        title: "No install needed: the web app",
        body: [
          "If you're not in VS Code, or you're on a machine without your usual setup, the web app at privatenote.ai does the same thing in any browser.",
          "Paste your secret, choose an expiry, click Create. Share the link. The encryption logic runs in your browser — the same AES-256-GCM, the same key-in-fragment architecture.",
        ],
      },
      {
        title: "What to remember",
        body: [
          "The link contains the decryption key. Treat the URL with the same care as the secret itself — don't post it in a public channel.",
          "Once a burn-after-reading note is opened, the link is dead. Neither you nor the recipient can re-open it.",
          "If you've typed a secret into an AI prompt, consider rotating it after sharing. The prompt was seen. The PrivateNote link wasn't — but the underlying credential was.",
          "For secrets that need to persist, use a proper secrets manager. PrivateNote is for delivery, not storage.",
        ],
      },
    ],
    ctaTitle: "Share your first private note",
    ctaBody: "Install the VS Code extension or try the web app — no account required for single-read notes.",
    ctaButton: "Try PrivateNote →",
  },
  de: {
    intro: [
      "Du musst einem Kollegen ein Passwort schicken. Vielleicht ist es die Staging-Datenbank. Vielleicht ist es ein Stripe-Key, der bald in Produktion geht.",
      "Du öffnest Slack. Und dann — ein kleines, vertrautes Zögern.",
      "Diese Nachricht wird in deinem Chatverlauf bleiben. Sie synchronisiert sich auf drei Geräte. Sie könnte in einem Backup, einem Suchindex oder einem Compliance-Archiv landen.",
      "PrivateNote ist ein anderer Weg. Das Geheimnis wird auf deinem Gerät verschlüsselt, bevor es ein Netzwerk berührt. Der Entschlüsselungsschlüssel lebt nur in der URL — der Server sieht ihn nie. Die Notiz löscht sich nach dem ersten Lesen selbst.",
      "So verwendest du es — beginnend mit der einfachsten Option.",
    ],
    sections: [
      {
        title: "Die VS Code und Cursor Erweiterung",
        body: [
          "Wenn du deinen Tag in VS Code oder Cursor verbringst, ist dies der reibungsloseste Weg. Installiere die Erweiterung einmal und sie sitzt in deiner Seitenleiste.",
          "Öffne den Erweiterungsbereich (Cmd+Shift+X), suche nach PrivateNote und klicke auf Installieren.",
        ],
        bullets: [
          "Tippe oder füge das Geheimnis in das Inhaltsfeld ein",
          "Lege ein Ablaufdatum fest — 15 Minuten, 1 Stunde, 1 Tag oder 7 Tage",
          "Lasse \"Nach dem Lesen verbrennen\" aktiviert (Standard)",
          "Klicke auf PrivateNote teilen →",
        ],
      },
      {
        title: "Was passiert, wenn du auf Teilen klickst",
        body: [
          "Die integrierte Kryptographie deines Browsers generiert einen zufälligen 256-Bit-Schlüssel. Dieser Schlüssel verlässt niemals dein Gerät.",
          "Der Inhalt wird mit AES-256-GCM verschlüsselt. Nur dieser Chiffretext wird an den PrivateNote-Server gesendet — der Schlüssel nicht.",
          "Der Link kopiert sich in deine Zwischenablage. Du fügst ihn dort ein, wo du sonst das Geheimnis einfügen würdest.",
        ],
      },
      { title: "Für KI-Nutzer: der MCP-Server", body: ["Wenn du mit einem KI-Assistenten arbeitest, kannst du die KI PrivateNotes in deinem Namen erstellen lassen."], code: `{\n  "mcpServers": {\n    "privatenote": {\n      "command": "npx",\n      "args": ["-y", "privatenote-mcp"]\n    }\n  }\n}`, bullets: ["Starte Cursor neu und überprüfe Einstellungen → MCP", "Sage dem Agenten dann: \"Schicke diesen API-Schlüssel sicher, nach dem Lesen verbrennen\""] },
      { title: "Kein Install nötig: die Web-App", body: ["Wenn du nicht in VS Code bist, macht die Web-App unter privatenote.ai dasselbe in jedem Browser."] },
      { title: "Was zu beachten ist", body: ["Der Link enthält den Entschlüsselungsschlüssel. Behandle die URL mit der gleichen Sorgfalt wie das Geheimnis selbst.", "Sobald eine Notiz geöffnet wird, ist der Link tot. Du und der Empfänger können ihn nicht erneut öffnen."] },
    ],
    ctaTitle: "Teile deine erste private Notiz",
    ctaBody: "Installiere die VS Code Erweiterung oder probiere die Web-App — kein Konto erforderlich für Einmal-Notizen.",
    ctaButton: "PrivateNote ausprobieren →",
  },
  fr: {
    intro: [
      "Tu dois envoyer un mot de passe à un collègue. Peut-être la base de données de staging. Peut-être une clé Stripe sur le point d'aller en production.",
      "Tu ouvres Slack. Et puis — une petite hésitation familière.",
      "Ce message va rester dans ton historique de chat. Il va se synchroniser sur trois appareils.",
      "PrivateNote est un autre chemin. Le secret est chiffré sur ta machine avant de toucher un réseau. La clé de déchiffrement vit uniquement dans l'URL — le serveur ne la voit jamais.",
      "Voici comment l'utiliser — en commençant par l'option la plus simple.",
    ],
    sections: [
      {
        title: "L'extension VS Code et Cursor",
        body: ["Si tu passes tes journées dans VS Code ou Cursor, c'est le chemin le moins frictif. Installe l'extension une fois et elle est toujours à un clic."],
        bullets: ["Tape ou colle le secret dans le champ contenu", "Définis une expiration — 15 minutes, 1 heure, 1 jour ou 7 jours", "Laisse \"Brûler après lecture\" coché (par défaut)", "Clique sur Partager PrivateNote →"],
      },
      { title: "Ce qui se passe quand tu cliques Partager", body: ["La cryptographie intégrée de ton navigateur génère une clé aléatoire de 256 bits. Cette clé ne quitte jamais ta machine.", "Le contenu est chiffré avec AES-256-GCM. Seul ce texte chiffré est envoyé au serveur — pas la clé."] },
      { title: "Pour les utilisateurs d'IA : le serveur MCP", body: ["Si tu travailles avec un assistant IA, tu peux laisser l'IA créer des PrivateNotes en ton nom."], code: `{\n  "mcpServers": {\n    "privatenote": {\n      "command": "npx",\n      "args": ["-y", "privatenote-mcp"]\n    }\n  }\n}` },
      { title: "Sans installation : l'application web", body: ["L'application web sur privatenote.ai fait la même chose dans n'importe quel navigateur."] },
      { title: "Ce qu'il faut retenir", body: ["Le lien contient la clé de déchiffrement. Traite l'URL avec le même soin que le secret lui-même.", "Une fois qu'une note est ouverte, le lien est mort. Ni toi ni le destinataire ne pouvez le rouvrir."] },
    ],
    ctaTitle: "Partage ta première note privée",
    ctaBody: "Installe l'extension VS Code ou essaie l'application web — aucun compte requis pour les notes à lecture unique.",
    ctaButton: "Essayer PrivateNote →",
  },
  es: {
    intro: [
      "Necesitas enviar una contraseña a un colega. Quizás es la base de datos de staging. Quizás es una clave Stripe que está a punto de ir a producción.",
      "Abres Slack. Y entonces — una pequeña hesitación familiar.",
      "Ese mensaje va a quedarse en tu historial de chat. Se va a sincronizar en tres dispositivos.",
      "PrivateNote es un camino diferente. El secreto se cifra en tu máquina antes de tocar cualquier red. La clave de descifrado vive solo en la URL — el servidor nunca la ve.",
      "Así se usa — empezando por la opción más sencilla.",
    ],
    sections: [
      {
        title: "La extensión de VS Code y Cursor",
        body: ["Si pasas tus días en VS Code o Cursor, este es el camino más fluido. Instala la extensión una vez y estará siempre a un clic."],
        bullets: ["Escribe o pega el secreto en el campo de contenido", "Establece una expiración — 15 minutos, 1 hora, 1 día o 7 días", "Deja marcado \"Quemar después de leer\" (predeterminado)", "Haz clic en Compartir PrivateNote →"],
      },
      { title: "Qué ocurre cuando haces clic en Compartir", body: ["La criptografía integrada de tu navegador genera una clave aleatoria de 256 bits. Esa clave nunca sale de tu máquina.", "El contenido se cifra con AES-256-GCM. Solo ese texto cifrado se envía al servidor — no la clave."] },
      { title: "Para usuarios de IA: el servidor MCP", body: ["Si trabajas con un asistente de IA, puedes dejar que la IA cree PrivateNotes en tu nombre."], code: `{\n  "mcpServers": {\n    "privatenote": {\n      "command": "npx",\n      "args": ["-y", "privatenote-mcp"]\n    }\n  }\n}` },
      { title: "Sin instalación: la aplicación web", body: ["La aplicación web en privatenote.ai hace lo mismo en cualquier navegador."] },
      { title: "Qué recordar", body: ["El enlace contiene la clave de descifrado. Trata la URL con el mismo cuidado que el secreto en sí.", "Una vez que se abre una nota, el enlace está muerto. Ni tú ni el destinatario pueden volver a abrirlo."] },
    ],
    ctaTitle: "Comparte tu primera nota privada",
    ctaBody: "Instala la extensión de VS Code o prueba la aplicación web — no se requiere cuenta para notas de una sola lectura.",
    ctaButton: "Probar PrivateNote →",
  },
};

export const PrivateNoteForDevelopersPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = copy[language] ?? copy.en;
  const blogPath = localizedPath("/blog", language);
  const homePath = localizedPath("/", language);

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
          <h1 className="text-3xl font-bold mb-4">{t.blogDevelopersTitle}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">{t.blogDevelopersExcerpt}</p>
        </header>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {article.sections.map((section) => (
            <section className="space-y-4" key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.code && (
                <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{section.code}</pre>
                </div>
              )}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2">
                  {section.bullets.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{article.ctaTitle}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5">{article.ctaBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={homePath}
              className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              {article.ctaButton}
            </Link>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-primary/30 bg-transparent px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
            >
              Install VS Code extension
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};
