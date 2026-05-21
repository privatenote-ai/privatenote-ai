import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type ArticleCopy = {
  intro: string[];
  sections: Array<{ title: string; body: string[]; bullets?: string[]; code?: string; codeLabel?: string }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

const copy: Record<SupportedLanguage, ArticleCopy> = {
  en: {
    intro: [
      "OpenAI Codex is an AI coding agent. You describe what you want — fix a bug, add a feature, write a test — and it does it autonomously in a sandboxed environment.",
      "But agents need secrets. They need to clone repos over SSH, pull from private package registries, connect to staging databases, call internal APIs. That means passing credentials to them.",
      "Pasting an API key into an agent prompt isn't fundamentally different from pasting it into Slack — it ends up in context history, possibly in logs, possibly in memory that persists between sessions. PrivateNote gives you a cleaner path: encrypt the secret before the agent ever sees it, share a link that self-destructs after one read, and leave nothing behind.",
      "Here's how to connect the two.",
    ],
    sections: [
      {
        title: "The fastest path: one command",
        body: [
          "If you use the Codex CLI, adding PrivateNote as a global MCP server is a single command:",
        ],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "That's it. The server is registered globally in ~/.codex/config.toml",
          "Every new Codex session has access to the create_private_note tool",
          "No project-level config needed — it follows you across repos",
        ],
      },
      {
        title: "What Codex can now do",
        body: [
          "Once the MCP server is registered, you can ask Codex to handle secret sharing directly:",
        ],
        bullets: [
          "\"Create a PrivateNote for this API key, expire in 1 hour, burn after reading\"",
          "\"Wrap this database password in a self-destructing link for the contractor\"",
          "\"Send the SSH key securely — 15-minute expiry\"",
          "\"Generate a new PrivateNote for the staging credentials and give me the link\"",
        ],
      },
      {
        title: "What the tool actually does",
        body: [
          "When Codex calls create_private_note, the MCP server runs a local Node.js process on your machine. The encryption happens there — before anything touches the network.",
          "The server generates a random 256-bit AES key, encrypts the content with AES-256-GCM, and POSTs only the ciphertext to privatenote.ai. The key is not in the request.",
          "The decryption key lives only in the URL fragment — the #this-part that browsers never send to servers. What comes back from Codex is a link. Whoever opens the link decrypts it in their browser. The note deletes itself immediately after.",
          "privatenote.ai stores encrypted blobs. Without the fragment, those blobs are meaningless.",
        ],
      },
      {
        title: "The privacy caveat you should understand",
        body: [
          "Here's the honest part: when you type a secret into a Codex prompt, Codex reads it before the MCP tool runs. OpenAI's servers process that message.",
          "So \"create a PrivateNote for sk_live_abc123\" means the value sk_live_abc123 briefly appeared in a cloud context. The PrivateNote step ensures it doesn't persist in Slack, email, or chat history — but it isn't the same as the AI never seeing it.",
          "Two ways to close that gap:",
        ],
        bullets: [
          "Use the VS Code extension when in the Codex IDE — select the secret in your editor, right-click → Share as PrivateNote. The secret goes directly from your editor to the encrypted link. Codex is never involved",
          "Use a local model for the agent session. Nothing leaves your machine until it's already encrypted",
        ],
      },
      {
        title: "Using the VS Code extension in Codex IDE",
        body: [
          "Codex runs inside a VS Code-compatible editor. The PrivateNote VS Code extension installs and works there exactly as it does in standard VS Code.",
        ],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
        bullets: [
          "After install, an envelope icon appears in the activity bar — click it to open the PrivateNote panel",
          "Select any text in the editor, right-click → Share as PrivateNote for a quick one-off",
          "The lock icon in the editor title bar appears whenever you have text selected",
          "With this path, Codex never touches the plaintext — the extension encrypts locally in the VS Code host process",
        ],
      },
      {
        title: "If you prefer the config file",
        body: [
          "You can also add the MCP server manually. The codex mcp add command writes to ~/.codex/config.toml — you can edit that file directly if you prefer:",
        ],
        code: `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
      {
        title: "Pointing at a self-hosted instance",
        body: [
          "If your team runs a private PrivateNote server, set the base URL via an environment variable in the MCP config:",
        ],
        code: `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.your-domain.com"`,
        codeLabel: "~/.codex/config.toml",
        bullets: [
          "All secrets stay on your infrastructure — nothing reaches privatenote.ai",
          "The same AES-256-GCM encryption applies; only the storage destination changes",
        ],
      },
      {
        title: "A few things to remember",
        body: [
          "The URL is the secret. The link contains the decryption key in its fragment. Treat it with the same care as the credential itself — don't commit it, don't log it, don't post it in a public channel.",
          "Burn-after-reading means exactly that. Once the link is opened, it's gone. Neither you nor the recipient can re-open it.",
          "Rotate after sharing. If a credential appeared in an AI prompt — even briefly — treat it as potentially seen. Share the current value via PrivateNote, then rotate to a new one.",
          "PrivateNote is for delivery, not storage. If you need a secret to be accessible for more than a few days, use a proper secrets manager. PrivateNote is the secure handoff step, not the vault.",
        ],
      },
    ],
    ctaTitle: "Connect Codex to PrivateNote",
    ctaBody:
      "One command registers the MCP server globally. Every Codex session after that has a secure secret-sharing tool built in.",
    ctaButton: "Try PrivateNote →",
  },
  de: {
    intro: [
      "OpenAI Codex ist ein KI-Coding-Agent. Er braucht Geheimnisse — SSH-Keys, API-Tokens, Datenbank-Passwörter.",
      "Wenn du Credentials in einen Agent-Prompt eingibst, können sie in Logs oder Kontext-Historien landen. PrivateNote gibt dir einen saubereren Weg.",
    ],
    sections: [
      {
        title: "Der schnellste Weg: ein Befehl",
        body: ["Füge PrivateNote als globalen MCP-Server hinzu:"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "Der Server wird global in ~/.codex/config.toml registriert",
          "Jede neue Codex-Sitzung hat Zugriff auf das create_private_note-Tool",
        ],
      },
      {
        title: "Was Codex jetzt tun kann",
        body: ["Sobald der MCP-Server registriert ist, kannst du Codex bitten, sichere Links zu erstellen:"],
        bullets: [
          "\"Erstelle eine PrivateNote für diesen API-Key, läuft in 1 Stunde ab\"",
          "\"Sende das Datenbankpasswort sicher — nach dem Lesen verbrennen\"",
        ],
      },
      {
        title: "Der Datenschutz-Vorbehalt",
        body: [
          "Wenn du ein Geheimnis in einen Codex-Prompt eingibst, liest Codex es, bevor das MCP-Tool läuft. Für maximalen Datenschutz nutze die VS Code-Erweiterung: Markiere den Text im Editor und wähle → Als PrivateNote teilen.",
        ],
      },
      {
        title: "VS Code-Erweiterung im Codex IDE",
        body: ["Installiere die Erweiterung:"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
      },
      {
        title: "Konfigurationsdatei",
        body: ["Oder füge den MCP-Server manuell in ~/.codex/config.toml ein:"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
    ],
    ctaTitle: "Verbinde Codex mit PrivateNote",
    ctaBody: "Ein Befehl, um den MCP-Server global zu registrieren.",
    ctaButton: "PrivateNote ausprobieren →",
  },
  fr: {
    intro: [
      "OpenAI Codex est un agent de codage IA. Il a besoin de secrets — clés SSH, tokens API, mots de passe de base de données.",
      "Coller des identifiants dans un prompt d'agent n'est pas différent de les coller dans Slack — ils peuvent se retrouver dans des historiques. PrivateNote offre une meilleure voie.",
    ],
    sections: [
      {
        title: "Le chemin le plus rapide : une commande",
        body: ["Ajoute PrivateNote comme serveur MCP global :"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "Le serveur est enregistré globalement dans ~/.codex/config.toml",
          "Chaque session Codex a accès à l'outil create_private_note",
        ],
      },
      {
        title: "Ce que Codex peut maintenant faire",
        body: ["Une fois le serveur MCP enregistré, tu peux demander à Codex de gérer le partage sécurisé :"],
        bullets: [
          "\"Crée une PrivateNote pour cette clé API, expire dans 1 heure\"",
          "\"Envoie le mot de passe de la base de données de manière sécurisée — brûler après lecture\"",
        ],
      },
      {
        title: "La mise en garde confidentialité",
        body: [
          "Quand tu tapes un secret dans un prompt Codex, Codex le lit avant que l'outil MCP s'exécute. Pour une confidentialité maximale, utilise l'extension VS Code : sélectionne le texte dans l'éditeur → Partager comme PrivateNote.",
        ],
      },
      {
        title: "Extension VS Code dans Codex IDE",
        body: ["Installe l'extension :"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
      },
      {
        title: "Fichier de configuration",
        body: ["Ou ajoute le serveur MCP manuellement dans ~/.codex/config.toml :"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
    ],
    ctaTitle: "Connecte Codex à PrivateNote",
    ctaBody: "Une commande pour enregistrer le serveur MCP globalement.",
    ctaButton: "Essayer PrivateNote →",
  },
  es: {
    intro: [
      "OpenAI Codex es un agente de codificación con IA. Necesita secretos — claves SSH, tokens API, contraseñas de base de datos.",
      "Pegar credenciales en un prompt de agente no es diferente a pegarlas en Slack — pueden acabar en historiales. PrivateNote ofrece un camino más limpio.",
    ],
    sections: [
      {
        title: "El camino más rápido: un comando",
        body: ["Añade PrivateNote como servidor MCP global:"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "El servidor se registra globalmente en ~/.codex/config.toml",
          "Cada sesión de Codex tiene acceso a la herramienta create_private_note",
        ],
      },
      {
        title: "Lo que Codex puede hacer ahora",
        body: ["Una vez registrado el servidor MCP, puedes pedirle a Codex que gestione el uso compartido seguro:"],
        bullets: [
          "\"Crea una PrivateNote para esta clave API, que expire en 1 hora\"",
          "\"Envía la contraseña de la base de datos de forma segura — quemar después de leer\"",
        ],
      },
      {
        title: "La advertencia de privacidad",
        body: [
          "Cuando escribes un secreto en un prompt de Codex, Codex lo lee antes de que se ejecute la herramienta MCP. Para máxima privacidad, usa la extensión VS Code: selecciona el texto en el editor → Compartir como PrivateNote.",
        ],
      },
      {
        title: "Extensión VS Code en Codex IDE",
        body: ["Instala la extensión:"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
      },
      {
        title: "Archivo de configuración",
        body: ["O añade el servidor MCP manualmente en ~/.codex/config.toml:"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
    ],
    ctaTitle: "Conecta Codex con PrivateNote",
    ctaBody: "Un comando para registrar el servidor MCP globalmente.",
    ctaButton: "Probar PrivateNote →",
  },
};

export function PrivateNoteCodexPost() {
  const { language } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);
  const c = copy[language] ?? copy.en;

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={lp("/blog")}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      <header className="mb-10">
        <div className="mb-3 flex flex-wrap gap-2">
          {["Developer", "MCP", "Codex", "Security"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          Using PrivateNote with OpenAI Codex
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          PrivateNote.ai · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {c.intro.map((p, i) => (
          <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {p}
          </p>
        ))}

        {c.sections.map((section, si) => (
          <section key={si} className="mt-10">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {section.title}
            </h2>

            {section.body.map((p, pi) => (
              <p key={pi} className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                {p}
              </p>
            ))}

            {section.code ? (
              <div className="my-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                {section.codeLabel && (
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {section.codeLabel}
                    </span>
                  </div>
                )}
                <pre className="overflow-x-auto bg-gray-900 px-5 py-4 text-sm leading-relaxed text-gray-100 dark:bg-gray-950">
                  <code>{section.code}</code>
                </pre>
              </div>
            ) : null}

            {section.bullets ? (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 dark:border-primary/30 dark:bg-primary/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{c.ctaTitle}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{c.ctaBody}</p>
        <Link
          href={lp("/")}
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {c.ctaButton}
        </Link>
      </div>
    </article>
  );
}
