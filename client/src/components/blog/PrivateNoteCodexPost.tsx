import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type SectionLink = { label: string; href: string };

type ArticleCopy = {
  intro: string[];
  sections: Array<{
    title: string;
    body: string[];
    bullets?: string[];
    code?: string;
    codeLabel?: string;
    links?: SectionLink[];
  }>;
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
        title: "What is MCP?",
        body: [
          "MCP (Model Context Protocol) is an open protocol that lets AI applications connect to tools, data sources, and services through standardised servers. Any MCP-compatible client — Claude Desktop, Cursor, Codex, Windsurf, or another assistant — can call tools exposed by an MCP server.",
          "The PrivateNote MCP server exposes a single tool: create_private_note. When an AI calls it, a local Node.js process encrypts your content before anything touches the network. The result is a secure, expiring link you can share with anyone.",
        ],
        links: [
          { label: "Model Context Protocol docs", href: "https://modelcontextprotocol.io" },
          { label: "MCP transports", href: "https://modelcontextprotocol.io/docs/concepts/transports" },
          { label: "Claude Desktop MCP setup", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
        ],
      },
      {
        title: "Requirements",
        body: ["Before installing, make sure you have:"],
        bullets: [
          "An MCP-compatible client: Claude Desktop, Cursor, Codex CLI, Windsurf, or any client that implements the MCP spec",
          "Node.js 18 or later — check with: node --version",
          "npx available — check with: npx --version",
          "Network access to privatenote.ai (or your self-hosted instance)",
        ],
      },
      {
        title: "The fastest path: one command (Codex)",
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
        title: "Claude Desktop and other MCP clients",
        body: [
          "Most MCP clients accept a JSON config file. For Claude Desktop, open the config for your OS:",
          "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
          "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
          "Add the following entry, save the file, and restart Claude Desktop:",
        ],
        code: `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`,
        codeLabel: "claude_desktop_config.json",
        bullets: [
          "After restart, Claude will detect the server and expose the create_private_note tool in chat automatically",
          "Cursor: add the same entry under Settings → MCP",
          "Any other client that follows the MCP spec uses the same JSON block",
        ],
      },
      {
        title: "What you can now ask your AI assistant",
        body: [
          "Once the MCP server is connected, you can use plain natural language:",
        ],
        bullets: [
          "\"Create a PrivateNote that says: The temporary password is X. Make it expire in 24 hours.\"",
          "\"Wrap this database password in a self-destructing link for the contractor\"",
          "\"Send the SSH key securely — 15-minute expiry, burn after reading\"",
          "\"Generate a PrivateNote for the staging credentials and give me the link\"",
        ],
        code: `# Example response from the assistant:

PrivateNote created:
https://privatenote.ai/note/xK9m2p...#A3f7...

Expires in 24 hours · Burns after reading`,
        codeLabel: "Example",
      },
      {
        title: "What the tool actually does",
        body: [
          "When the AI calls create_private_note, the MCP server runs a local Node.js process on your machine. The encryption happens there — before anything touches the network.",
          "The server generates a random 256-bit AES key, encrypts the content with AES-256-GCM, and POSTs only the ciphertext to privatenote.ai. The key is not in the request.",
          "The decryption key lives only in the URL fragment — the #this-part that browsers never send to servers. What comes back is a link. Whoever opens the link decrypts it in their browser. The note deletes itself immediately after.",
          "privatenote.ai stores encrypted blobs. Without the fragment, those blobs are meaningless.",
        ],
      },
      {
        title: "Common tool options",
        body: ["The create_private_note tool accepts the following parameters:"],
        bullets: [
          "content — the sensitive text to encrypt and store (required)",
          "expiresIn — how long the note stays accessible: 15m, 1h, 24h, or 7d (default: 24h)",
          "burnAfterReading — destroy the note after the first view (default: true)",
          "title — an optional label prepended to the content before encryption",
        ],
        code: `# Structured example prompt:

Create a PrivateNote with:
content: "The deployment token is ghp_abc123"
expiresIn: "15m"
burnAfterReading: true`,
        codeLabel: "Prompt",
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
        title: "Troubleshooting",
        body: ["If the PrivateNote tool does not appear in your client after setup:"],
        bullets: [
          "Restart your MCP client — config changes are not picked up while the app is running",
          "Confirm Node.js is installed and on your PATH: node --version",
          "Confirm npx works: npx --version",
          "Validate your JSON config — a trailing comma is the most common syntax error",
          "Check your client's MCP or extension logs for startup errors",
          "Make sure your machine has network access to privatenote.ai (or your self-hosted host)",
        ],
      },
      {
        title: "A few things to remember",
        body: [
          "The URL is the secret. The link contains the decryption key in its fragment. Treat it with the same care as the credential itself — don't commit it, don't log it, don't post it in a public channel.",
          "Burn-after-reading means exactly that. Once the link is opened, it's gone. Neither you nor the recipient can re-open it.",
          "Rotate after sharing. If a credential appeared in an AI prompt — even briefly — treat it as potentially seen. Share the current value via PrivateNote, then rotate to a new one.",
          "PrivateNote is for delivery, not storage. If you need a secret to be accessible for more than a few days, use a proper secrets manager. PrivateNote is the secure handoff step, not the vault.",
          "Use short expiry windows. For one-time secrets, 15m or 1h is almost always sufficient. Default to the shortest window that still works for your recipient.",
        ],
      },
    ],
    ctaTitle: "Connect your AI assistant to PrivateNote",
    ctaBody:
      "One command or one JSON block registers the MCP server. Every session after that has a secure secret-sharing tool built in.",
    ctaButton: "Try PrivateNote →",
  },
  de: {
    intro: [
      "OpenAI Codex ist ein KI-Coding-Agent. Er braucht Geheimnisse — SSH-Keys, API-Tokens, Datenbank-Passwörter.",
      "Wenn du Credentials in einen Agent-Prompt eingibst, können sie in Logs oder Kontext-Historien landen. PrivateNote gibt dir einen saubereren Weg: Verschlüssele das Geheimnis, bevor der Agent es sieht, teile einen Link, der sich nach dem ersten Lesen selbst zerstört.",
      "So verbindest du beides.",
    ],
    sections: [
      {
        title: "Was ist MCP?",
        body: [
          "MCP (Model Context Protocol) ist ein offenes Protokoll, das KI-Anwendungen mit Tools, Datenquellen und Diensten über standardisierte Server verbindet. Jeder MCP-kompatible Client — Claude Desktop, Cursor, Codex, Windsurf oder ein anderer Assistent — kann die Tools eines MCP-Servers aufrufen.",
          "Der PrivateNote-MCP-Server stellt ein einziges Tool bereit: create_private_note. Wenn eine KI es aufruft, verschlüsselt ein lokaler Node.js-Prozess den Inhalt, bevor etwas das Netzwerk berührt.",
        ],
        links: [
          { label: "Model Context Protocol Docs", href: "https://modelcontextprotocol.io" },
          { label: "Claude Desktop MCP-Einrichtung", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
        ],
      },
      {
        title: "Voraussetzungen",
        body: ["Stelle vor der Installation sicher, dass du Folgendes hast:"],
        bullets: [
          "Einen MCP-kompatiblen Client: Claude Desktop, Cursor, Codex CLI, Windsurf oder einen anderen",
          "Node.js 18 oder neuer — prüfen mit: node --version",
          "npx verfügbar — prüfen mit: npx --version",
          "Netzwerkzugang zu privatenote.ai oder deiner selbst gehosteten Instanz",
        ],
      },
      {
        title: "Der schnellste Weg: ein Befehl (Codex)",
        body: ["Füge PrivateNote als globalen MCP-Server hinzu:"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "Der Server wird global in ~/.codex/config.toml registriert",
          "Jede neue Codex-Sitzung hat Zugriff auf das create_private_note-Tool",
          "Keine projektspezifische Konfiguration nötig — folgt dir über alle Repos",
        ],
      },
      {
        title: "Claude Desktop und andere MCP-Clients",
        body: [
          "Die meisten MCP-Clients akzeptieren eine JSON-Konfigurationsdatei. Öffne für Claude Desktop die Konfiguration deines Betriebssystems:",
          "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
          "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
          "Füge folgenden Eintrag hinzu, speichere die Datei und starte Claude Desktop neu:",
        ],
        code: `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`,
        codeLabel: "claude_desktop_config.json",
        bullets: [
          "Nach dem Neustart erkennt Claude den Server und stellt das create_private_note-Tool automatisch bereit",
          "Cursor: denselben Eintrag unter Einstellungen → MCP hinzufügen",
        ],
      },
      {
        title: "Was du deinen KI-Assistenten jetzt fragen kannst",
        body: ["Sobald der MCP-Server verbunden ist, kannst du in natürlicher Sprache anfragen:"],
        bullets: [
          "\"Erstelle eine PrivateNote für diesen API-Key, läuft in 1 Stunde ab, nach dem Lesen verbrennen\"",
          "\"Sende das Datenbankpasswort sicher — 15-Minuten-Ablaufzeit\"",
          "\"Verpacke diesen SSH-Key in einen selbstzerstörenden Link für den Auftragnehmer\"",
        ],
        code: `# Beispielantwort des Assistenten:

PrivateNote erstellt:
https://privatenote.ai/note/xK9m2p...#A3f7...

Läuft in 24 Stunden ab · Verbrennt nach dem Lesen`,
        codeLabel: "Beispiel",
      },
      {
        title: "Was das Tool tatsächlich macht",
        body: [
          "Wenn die KI create_private_note aufruft, läuft ein lokaler Node.js-Prozess auf deinem Rechner. Die Verschlüsselung erfolgt dort — bevor etwas das Netzwerk berührt.",
          "Der Server generiert einen zufälligen 256-Bit-AES-Schlüssel, verschlüsselt den Inhalt mit AES-256-GCM und sendet nur den Geheimtext an privatenote.ai. Der Schlüssel ist nicht in der Anfrage enthalten.",
          "Der Entschlüsselungsschlüssel lebt nur im URL-Fragment — dem #dieser-Teil, den Browser nie an Server senden.",
        ],
      },
      {
        title: "Verfügbare Tool-Parameter",
        body: ["Das create_private_note-Tool akzeptiert folgende Parameter:"],
        bullets: [
          "content — der zu verschlüsselnde Text (erforderlich)",
          "expiresIn — wie lange die Notiz verfügbar bleibt: 15m, 1h, 24h oder 7d (Standard: 24h)",
          "burnAfterReading — Notiz nach der ersten Ansicht zerstören (Standard: true)",
          "title — optionaler Titel, der dem Inhalt vor der Verschlüsselung vorangestellt wird",
        ],
      },
      {
        title: "Der Datenschutz-Vorbehalt",
        body: [
          "Wenn du ein Geheimnis in einen Codex-Prompt eingibst, liest Codex es, bevor das MCP-Tool ausgeführt wird. OpenAIs Server verarbeiten diese Nachricht.",
          "Für maximalen Datenschutz nutze die VS Code-Erweiterung: Markiere den Text im Editor, Rechtsklick → Als PrivateNote teilen. Codex ist dabei nie involviert.",
        ],
      },
      {
        title: "VS Code-Erweiterung im Codex IDE",
        body: ["Installiere die Erweiterung:"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
        bullets: [
          "Nach der Installation erscheint ein Symbol in der Aktivitätsleiste",
          "Text markieren → Rechtsklick → Als PrivateNote teilen für schnelle Einzelfälle",
          "Codex berührt niemals den Klartext — die Erweiterung verschlüsselt lokal",
        ],
      },
      {
        title: "Konfigurationsdatei",
        body: ["Oder füge den MCP-Server manuell in ~/.codex/config.toml ein:"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
      {
        title: "Selbst gehostete Instanz",
        body: ["Falls dein Team einen eigenen PrivateNote-Server betreibt:"],
        code: `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.deine-domain.com"`,
        codeLabel: "~/.codex/config.toml",
        bullets: [
          "Alle Geheimnisse bleiben auf deiner Infrastruktur — nichts erreicht privatenote.ai",
        ],
      },
      {
        title: "Fehlerbehebung",
        body: ["Falls das PrivateNote-Tool nach der Einrichtung nicht erscheint:"],
        bullets: [
          "Starte deinen MCP-Client neu — Konfigurationsänderungen werden nicht im laufenden Betrieb erkannt",
          "Prüfe, ob Node.js installiert ist: node --version",
          "Prüfe, ob npx funktioniert: npx --version",
          "Validiere deine JSON-Konfiguration — ein überschüssiges Komma ist der häufigste Fehler",
          "Überprüfe die MCP-Logs deines Clients auf Startfehler",
        ],
      },
      {
        title: "Wichtige Hinweise",
        body: [
          "Die URL ist das Geheimnis. Der Link enthält den Entschlüsselungsschlüssel im Fragment. Behandle ihn mit derselben Sorgfalt wie die Credentials selbst.",
          "Nach dem Lesen verbrennen bedeutet genau das. Einmal geöffnet, ist der Link weg. Er kann nicht erneut geöffnet werden.",
          "Nach dem Teilen rotieren. Falls ein Geheimnis in einem KI-Prompt erschien — auch kurz — behandle es als potenziell gesehen und rotiere es.",
          "PrivateNote ist für die Übergabe, nicht für die Speicherung. Für langfristigen Zugriff verwende einen echten Secrets Manager.",
        ],
      },
    ],
    ctaTitle: "Verbinde deinen KI-Assistenten mit PrivateNote",
    ctaBody: "Ein Befehl oder ein JSON-Block registriert den MCP-Server. Jede Sitzung danach hat ein sicheres Secret-Sharing-Tool eingebaut.",
    ctaButton: "PrivateNote ausprobieren →",
  },
  fr: {
    intro: [
      "OpenAI Codex est un agent de codage IA. Il a besoin de secrets — clés SSH, tokens API, mots de passe de base de données.",
      "Coller des identifiants dans un prompt d'agent n'est pas différent de les coller dans Slack — ils peuvent se retrouver dans des historiques ou des journaux. PrivateNote offre une meilleure voie : chiffre le secret avant que l'agent ne le voie, partage un lien qui s'autodétruit après la première lecture.",
      "Voici comment connecter les deux.",
    ],
    sections: [
      {
        title: "Qu'est-ce que MCP ?",
        body: [
          "MCP (Model Context Protocol) est un protocole ouvert qui permet aux applications IA de se connecter à des outils, sources de données et services via des serveurs standardisés. Tout client compatible MCP — Claude Desktop, Cursor, Codex, Windsurf ou un autre assistant — peut appeler les outils exposés par un serveur MCP.",
          "Le serveur MCP PrivateNote expose un seul outil : create_private_note. Lorsqu'une IA l'appelle, un processus Node.js local chiffre le contenu avant tout contact avec le réseau.",
        ],
        links: [
          { label: "Documentation Model Context Protocol", href: "https://modelcontextprotocol.io" },
          { label: "Guide Claude Desktop MCP", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
        ],
      },
      {
        title: "Prérequis",
        body: ["Avant l'installation, assure-toi d'avoir :"],
        bullets: [
          "Un client compatible MCP : Claude Desktop, Cursor, Codex CLI, Windsurf ou tout autre client implémentant la spécification MCP",
          "Node.js 18 ou plus récent — vérifier avec : node --version",
          "npx disponible — vérifier avec : npx --version",
          "Accès réseau à privatenote.ai ou à ton instance auto-hébergée",
        ],
      },
      {
        title: "Le chemin le plus rapide : une commande (Codex)",
        body: ["Ajoute PrivateNote comme serveur MCP global :"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "Le serveur est enregistré globalement dans ~/.codex/config.toml",
          "Chaque session Codex a accès à l'outil create_private_note",
          "Aucune configuration au niveau du projet — suit partout",
        ],
      },
      {
        title: "Claude Desktop et autres clients MCP",
        body: [
          "La plupart des clients MCP acceptent un fichier de configuration JSON. Pour Claude Desktop, ouvre le fichier de config de ton OS :",
          "macOS : ~/Library/Application Support/Claude/claude_desktop_config.json",
          "Windows : %APPDATA%\\Claude\\claude_desktop_config.json",
          "Ajoute l'entrée suivante, sauvegarde et redémarre Claude Desktop :",
        ],
        code: `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`,
        codeLabel: "claude_desktop_config.json",
        bullets: [
          "Après redémarrage, Claude détecte le serveur et expose l'outil create_private_note automatiquement",
          "Cursor : ajouter la même entrée sous Paramètres → MCP",
        ],
      },
      {
        title: "Ce que tu peux demander à ton assistant IA",
        body: ["Une fois le serveur MCP connecté, tu peux utiliser le langage naturel :"],
        bullets: [
          "\"Crée une PrivateNote : Le mot de passe temporaire est X. Expire dans 24 heures.\"",
          "\"Envoie ce mot de passe de base de données en lien sécurisé — brûler après lecture\"",
          "\"Emballe cette clé SSH dans un lien auto-destructeur pour le prestataire — 15 minutes\"",
        ],
        code: `# Exemple de réponse de l'assistant :

PrivateNote créée :
https://privatenote.ai/note/xK9m2p...#A3f7...

Expire dans 24 heures · Se détruit après lecture`,
        codeLabel: "Exemple",
      },
      {
        title: "Ce que l'outil fait réellement",
        body: [
          "Quand l'IA appelle create_private_note, le serveur MCP exécute un processus Node.js local sur ta machine. Le chiffrement se produit là — avant tout contact réseau.",
          "Le serveur génère une clé AES 256 bits aléatoire, chiffre le contenu avec AES-256-GCM et n'envoie que le texte chiffré à privatenote.ai. La clé n'est pas dans la requête.",
          "La clé de déchiffrement ne vit que dans le fragment d'URL — la partie #ceci que les navigateurs n'envoient jamais aux serveurs.",
        ],
      },
      {
        title: "Options disponibles",
        body: ["L'outil create_private_note accepte les paramètres suivants :"],
        bullets: [
          "content — le texte sensible à chiffrer (obligatoire)",
          "expiresIn — durée d'accessibilité : 15m, 1h, 24h ou 7d (défaut : 24h)",
          "burnAfterReading — détruire après la première lecture (défaut : true)",
          "title — titre optionnel ajouté avant le contenu avant chiffrement",
        ],
      },
      {
        title: "La mise en garde confidentialité",
        body: [
          "Quand tu tapes un secret dans un prompt Codex, Codex le lit avant que l'outil MCP s'exécute. Les serveurs d'OpenAI traitent ce message.",
          "Pour une confidentialité maximale, utilise l'extension VS Code : sélectionne le texte dans l'éditeur, clic droit → Partager comme PrivateNote. Codex n'est jamais impliqué.",
        ],
      },
      {
        title: "Extension VS Code dans Codex IDE",
        body: ["Installe l'extension :"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
        bullets: [
          "Après l'installation, une icône apparaît dans la barre d'activités",
          "Sélectionne du texte → clic droit → Partager comme PrivateNote",
          "Codex ne touche jamais le texte en clair — l'extension chiffre localement",
        ],
      },
      {
        title: "Fichier de configuration",
        body: ["Ou ajoute le serveur MCP manuellement dans ~/.codex/config.toml :"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
      {
        title: "Instance auto-hébergée",
        body: ["Si ton équipe gère un serveur PrivateNote privé :"],
        code: `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.ton-domaine.com"`,
        codeLabel: "~/.codex/config.toml",
        bullets: [
          "Tous les secrets restent sur ton infrastructure — rien n'atteint privatenote.ai",
        ],
      },
      {
        title: "Dépannage",
        body: ["Si l'outil PrivateNote n'apparaît pas dans ton client après configuration :"],
        bullets: [
          "Redémarre ton client MCP — les modifications de config ne sont pas prises en compte à chaud",
          "Vérifie que Node.js est installé : node --version",
          "Vérifie que npx fonctionne : npx --version",
          "Valide ton JSON — une virgule superflue est l'erreur la plus courante",
          "Consulte les journaux MCP de ton client pour les erreurs de démarrage",
        ],
      },
      {
        title: "Quelques points à retenir",
        body: [
          "L'URL est le secret. Le lien contient la clé de déchiffrement dans son fragment. Traite-le avec le même soin que les identifiants eux-mêmes.",
          "Brûler après lecture signifie exactement ça. Une fois ouvert, le lien disparaît. Personne ne peut le rouvrir.",
          "Fais tourner les secrets après le partage. Si un identifiant est apparu dans un prompt IA — même brièvement — traite-le comme potentiellement exposé et remplace-le.",
          "PrivateNote sert à la transmission, pas au stockage. Pour un accès de longue durée, utilise un gestionnaire de secrets dédié.",
        ],
      },
    ],
    ctaTitle: "Connecte ton assistant IA à PrivateNote",
    ctaBody: "Une commande ou un bloc JSON enregistre le serveur MCP. Chaque session suivante dispose d'un outil de partage sécurisé intégré.",
    ctaButton: "Essayer PrivateNote →",
  },
  es: {
    intro: [
      "OpenAI Codex es un agente de codificación con IA. Necesita secretos — claves SSH, tokens API, contraseñas de base de datos.",
      "Pegar credenciales en un prompt de agente no es diferente a pegarlas en Slack — pueden acabar en historiales o registros. PrivateNote ofrece un camino más limpio: cifra el secreto antes de que el agente lo vea, comparte un enlace que se autodestruye después de la primera lectura.",
      "Así se conectan los dos.",
    ],
    sections: [
      {
        title: "¿Qué es MCP?",
        body: [
          "MCP (Model Context Protocol) es un protocolo abierto que permite a las aplicaciones de IA conectarse a herramientas, fuentes de datos y servicios a través de servidores estandarizados. Cualquier cliente compatible con MCP — Claude Desktop, Cursor, Codex, Windsurf u otro asistente — puede llamar a las herramientas expuestas por un servidor MCP.",
          "El servidor MCP de PrivateNote expone una sola herramienta: create_private_note. Cuando una IA la llama, un proceso Node.js local cifra el contenido antes de que nada toque la red.",
        ],
        links: [
          { label: "Documentación Model Context Protocol", href: "https://modelcontextprotocol.io" },
          { label: "Guía de configuración Claude Desktop MCP", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
        ],
      },
      {
        title: "Requisitos",
        body: ["Antes de instalar, asegúrate de tener:"],
        bullets: [
          "Un cliente compatible con MCP: Claude Desktop, Cursor, Codex CLI, Windsurf u otro que implemente la especificación MCP",
          "Node.js 18 o posterior — verificar con: node --version",
          "npx disponible — verificar con: npx --version",
          "Acceso de red a privatenote.ai o a tu instancia autohospedada",
        ],
      },
      {
        title: "El camino más rápido: un comando (Codex)",
        body: ["Añade PrivateNote como servidor MCP global:"],
        code: "codex mcp add privatenote -- npx -y privatenote-mcp",
        codeLabel: "Terminal",
        bullets: [
          "El servidor se registra globalmente en ~/.codex/config.toml",
          "Cada sesión de Codex tiene acceso a la herramienta create_private_note",
          "Sin configuración por proyecto — te sigue en todos los repositorios",
        ],
      },
      {
        title: "Claude Desktop y otros clientes MCP",
        body: [
          "La mayoría de los clientes MCP aceptan un archivo de configuración JSON. Para Claude Desktop, abre el archivo de configuración de tu SO:",
          "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
          "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
          "Añade la siguiente entrada, guarda y reinicia Claude Desktop:",
        ],
        code: `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`,
        codeLabel: "claude_desktop_config.json",
        bullets: [
          "Tras el reinicio, Claude detecta el servidor y expone la herramienta create_private_note automáticamente",
          "Cursor: añadir la misma entrada en Configuración → MCP",
        ],
      },
      {
        title: "Qué puedes pedirle a tu asistente de IA",
        body: ["Una vez conectado el servidor MCP, puedes usar lenguaje natural:"],
        bullets: [
          "\"Crea una PrivateNote: La contraseña temporal es X. Que expire en 24 horas.\"",
          "\"Envía esta contraseña de base de datos en un enlace seguro — quemar tras leer\"",
          "\"Empaqueta esta clave SSH en un enlace autodestructivo para el contratista — 15 minutos\"",
        ],
        code: `# Ejemplo de respuesta del asistente:

PrivateNote creada:
https://privatenote.ai/note/xK9m2p...#A3f7...

Expira en 24 horas · Se destruye tras la lectura`,
        codeLabel: "Ejemplo",
      },
      {
        title: "Qué hace realmente la herramienta",
        body: [
          "Cuando la IA llama a create_private_note, el servidor MCP ejecuta un proceso Node.js local en tu máquina. El cifrado ocurre allí — antes de que nada toque la red.",
          "El servidor genera una clave AES de 256 bits aleatoria, cifra el contenido con AES-256-GCM y solo envía el texto cifrado a privatenote.ai. La clave no está en la petición.",
          "La clave de descifrado solo vive en el fragmento de la URL — la parte #esta que los navegadores nunca envían a los servidores.",
        ],
      },
      {
        title: "Opciones disponibles",
        body: ["La herramienta create_private_note acepta los siguientes parámetros:"],
        bullets: [
          "content — el texto sensible a cifrar (obligatorio)",
          "expiresIn — tiempo de accesibilidad: 15m, 1h, 24h o 7d (por defecto: 24h)",
          "burnAfterReading — destruir tras la primera lectura (por defecto: true)",
          "title — título opcional añadido al contenido antes del cifrado",
        ],
      },
      {
        title: "La advertencia de privacidad",
        body: [
          "Cuando escribes un secreto en un prompt de Codex, Codex lo lee antes de que se ejecute la herramienta MCP. Los servidores de OpenAI procesan ese mensaje.",
          "Para máxima privacidad, usa la extensión VS Code: selecciona el texto en el editor, clic derecho → Compartir como PrivateNote. Codex nunca está involucrado.",
        ],
      },
      {
        title: "Extensión VS Code en Codex IDE",
        body: ["Instala la extensión:"],
        code: "code --install-extension PrivateNote.privatenote-vscode",
        codeLabel: "Terminal",
        bullets: [
          "Tras la instalación, aparece un icono en la barra de actividades",
          "Selecciona texto → clic derecho → Compartir como PrivateNote",
          "Codex nunca toca el texto plano — la extensión cifra localmente",
        ],
      },
      {
        title: "Archivo de configuración",
        body: ["O añade el servidor MCP manualmente en ~/.codex/config.toml:"],
        code: `[mcp_servers.privatenote]\ncommand = "npx"\nargs = ["-y", "privatenote-mcp"]`,
        codeLabel: "~/.codex/config.toml",
      },
      {
        title: "Instancia autohospedada",
        body: ["Si tu equipo gestiona un servidor PrivateNote privado:"],
        code: `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.tu-dominio.com"`,
        codeLabel: "~/.codex/config.toml",
        bullets: [
          "Todos los secretos permanecen en tu infraestructura — nada llega a privatenote.ai",
        ],
      },
      {
        title: "Solución de problemas",
        body: ["Si la herramienta PrivateNote no aparece en tu cliente tras la configuración:"],
        bullets: [
          "Reinicia tu cliente MCP — los cambios de configuración no se aplican en caliente",
          "Verifica que Node.js está instalado: node --version",
          "Verifica que npx funciona: npx --version",
          "Valida tu JSON — una coma sobrante es el error más frecuente",
          "Revisa los registros MCP de tu cliente en busca de errores de inicio",
        ],
      },
      {
        title: "Algunas cosas a recordar",
        body: [
          "La URL es el secreto. El enlace contiene la clave de descifrado en su fragmento. Trátalo con el mismo cuidado que las credenciales en sí.",
          "Quemar tras leer significa exactamente eso. Una vez abierto, el enlace desaparece. Nadie puede volver a abrirlo.",
          "Rota tras compartir. Si una credencial apareció en un prompt de IA — aunque brevemente — trátala como potencialmente expuesta y cámbiala.",
          "PrivateNote es para la entrega, no para el almacenamiento. Para acceso de larga duración, usa un gestor de secretos dedicado.",
        ],
      },
    ],
    ctaTitle: "Conecta tu asistente de IA a PrivateNote",
    ctaBody: "Un comando o un bloque JSON registra el servidor MCP. Cada sesión siguiente tiene una herramienta de compartición segura integrada.",
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

            {section.links ? (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                {section.links.map((link, li) => (
                  <a
                    key={li}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
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
