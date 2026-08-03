import type { PrivateNoteCodexArticleCopy } from "./privateNoteCodex.types";

const claudeDesktopConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

const exampleResponse = `# Voorbeeldantwoord van de assistent:

PrivateNote aangemaakt:
https://privatenote.ai/note/xK9m2p...#A3f7...

Verloopt over 24 uur · Vernietigt na lezen`;

const structuredPrompt = `# Gestructureerd voorbeeldprompt:

Create a PrivateNote with:
content: "The deployment token is ghp_abc123"
expiresIn: "15m"
burnAfterReading: true`;

const codexConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]`;

const selfHostedConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.your-domain.com"`;

export const privateNoteCodexNl: PrivateNoteCodexArticleCopy = {
  intro: [
    "OpenAI Codex is een AI-codeeragent. Je beschrijft wat je wilt — een bug fixen, een feature toevoegen, een test schrijven — en hij doet het autonoom in een gesandboxte omgeving.",
    "Maar agents hebben geheimen nodig. Ze moeten repo's klonen via SSH, packages ophalen uit private registries, verbinden met staging-databases, interne API's aanroepen. Dat betekent credentials overdragen.",
    "Een API-sleutel plakken in een agent-prompt is in wezen niet anders dan plakken in Slack — het belandt in contextgeschiedenis, mogelijk in logs, mogelijk in geheugen dat tussen sessies blijft bestaan. PrivateNote geeft je een schoner pad: versleutel het geheim voordat de agent het ooit ziet, deel een link die zichzelf vernietigt na één lezing en laat niets achter.",
    "Zo verbind je de twee.",
  ],
  sections: [
    {
      title: "Wat is MCP?",
      body: [
        "MCP (Model Context Protocol) is een open protocol waarmee AI-applicaties verbinding kunnen maken met tools, databronnen en services via gestandaardiseerde servers. Elke MCP-compatibele client — Claude Desktop, Cursor, Codex, Windsurf of een andere assistent — kan tools aanroepen die een MCP-server blootstelt.",
        "De PrivateNote MCP-server biedt één tool: create_private_note. Wanneer een AI die aanroept, versleutelt een lokaal Node.js-proces je inhoud voordat iets het netwerk raakt. Het resultaat is een veilige, verlopende link die je met iedereen kunt delen.",
      ],
      links: [
        { label: "Model Context Protocol-documentatie", href: "https://modelcontextprotocol.io" },
        { label: "MCP-transports", href: "https://modelcontextprotocol.io/docs/concepts/transports" },
        { label: "Claude Desktop MCP-setup", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
      ],
    },
    {
      title: "Vereisten",
      body: ["Controleer vóór installatie of je het volgende hebt:"],
      bullets: [
        "Een MCP-compatibele client: Claude Desktop, Cursor, Codex CLI, Windsurf of een client die de MCP-specificatie implementeert",
        "Node.js 18 of nieuwer — controleer met: node --version",
        "npx beschikbaar — controleer met: npx --version",
        "Netwerktoegang tot privatenote.ai (of je self-hosted instance)",
      ],
    },
    {
      title: "Het snelste pad: één commando (Codex)",
      body: ["Als je de Codex CLI gebruikt, is PrivateNote toevoegen als globale MCP-server één commando:"],
      code: "codex mcp add privatenote -- npx -y privatenote-mcp",
      codeLabel: "Terminal",
      bullets: [
        "Dat is het. De server wordt globaal geregistreerd in ~/.codex/config.toml",
        "Elke nieuwe Codex-sessie heeft toegang tot de create_private_note-tool",
        "Geen projectconfig nodig — hij volgt je tussen repo's",
      ],
    },
    {
      title: "Claude Desktop en andere MCP-clients",
      body: [
        "De meeste MCP-clients accepteren een JSON-configuratiebestand. Voor Claude Desktop open je de config voor je OS:",
        "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
        "Voeg het volgende item toe, sla het bestand op en start Claude Desktop opnieuw:",
      ],
      code: claudeDesktopConfig,
      codeLabel: "claude_desktop_config.json",
      bullets: [
        "Na herstart detecteert Claude de server en stelt de create_private_note-tool automatisch beschikbaar in chat",
        "Cursor: voeg hetzelfde item toe onder Settings → MCP",
        "Elke andere client die de MCP-specificatie volgt gebruikt hetzelfde JSON-blok",
      ],
    },
    {
      title: "Wat je nu aan je AI-assistent kunt vragen",
      body: ["Zodra de MCP-server is verbonden, kun je gewone natuurlijke taal gebruiken:"],
      bullets: [
        "\"Maak een PrivateNote die zegt: Het tijdelijke wachtwoord is X. Laat hem over 24 uur verlopen.\"",
        "\"Wikkel dit databasewachtwoord in een zelfvernietigende link voor de contractor\"",
        "\"Stuur de SSH-sleutel veilig — verloopt over 15 minuten, vernietigen na lezen\"",
        "\"Genereer een PrivateNote voor staging-credentials en geef me de link\"",
      ],
      code: exampleResponse,
      codeLabel: "Voorbeeld",
    },
    {
      title: "Wat de tool daadwerkelijk doet",
      body: [
        "Wanneer de AI create_private_note aanroept, start de MCP-server een lokaal Node.js-proces op je computer. Versleuteling gebeurt daar — voordat iets het netwerk raakt.",
        "De server genereert een willekeurige 256-bits AES-sleutel, versleutelt de inhoud met AES-256-GCM en POST alleen de versleutelde tekst naar privatenote.ai. De sleutel zit niet in het verzoek.",
        "De ontsleutelingssleutel leeft alleen in het URL-fragment — het #dit-deel dat browsers nooit naar servers sturen. De returnwaarde is een link. Wie de link opent, ontsleutelt in de browser. De notitie wordt direct daarna verwijderd.",
        "privatenote.ai slaat versleutelde blobs op. Zonder het fragment zijn die blobs zinloos.",
      ],
    },
    {
      title: "Veelgebruikte toolopties",
      body: ["De create_private_note-tool accepteert de volgende parameters:"],
      bullets: [
        "content — gevoelige tekst om te versleutelen en op te slaan (verplicht)",
        "expiresIn — hoe lang de notitie beschikbaar blijft: 15m, 1h, 24h of 7d (standaard: 24h)",
        "burnAfterReading — vernietig de notitie na het eerste bekijken (standaard: true)",
        "title — optioneel label dat aan de inhoud wordt toegevoegd vóór versleuteling",
      ],
      code: structuredPrompt,
      codeLabel: "Prompt",
    },
    {
      title: "Privacyregels die je moet begrijpen",
      body: [
        "Hier is het eerlijke deel: als je een geheim in een Codex-prompt typt, leest Codex het voordat de MCP-tool start. OpenAI-servers verwerken dat bericht.",
        "Dus \"maak een PrivateNote voor sk_live_abc123\" betekent dat de waarde sk_live_abc123 kort in de cloudcontext stond. De PrivateNote-stap zorgt ervoor dat hij niet in Slack, e-mail of chatgeschiedenis blijft — maar het is niet hetzelfde als dat de AI de inhoud nooit heeft gezien.",
        "Twee manieren om die kloof te dichten:",
      ],
      bullets: [
        "Gebruik de VS Code-extensie in de Codex IDE — selecteer het geheim in de editor, rechtsklik → Share as PrivateNote. Het geheim gaat rechtstreeks van de editor naar een versleutelde link. Codex is niet betrokken",
        "Gebruik een lokaal model voor de agentsessie. Niets verlaat je computer voordat het al versleuteld is",
      ],
    },
    {
      title: "De VS Code-extensie gebruiken in de Codex IDE",
      body: [
        "Codex draait in een VS Code-compatibele editor. De PrivateNote VS Code-extensie installeert en werkt daar hetzelfde als in standaard VS Code.",
      ],
      code: "code --install-extension PrivateNote.privatenote-vscode",
      codeLabel: "Terminal",
      bullets: [
        "Na installatie verschijnt het envelopicoon in de activity bar — klik erop voor het PrivateNote-paneel",
        "Selecteer tekst in de editor, rechtsklik → Share as PrivateNote voor een snelle eenmalige case",
        "Het sloticoon in de title bar van de editor verschijnt wanneer je tekst geselecteerd hebt",
        "Via dit pad raakt Codex nooit platte tekst — de extensie versleutelt lokaal in het VS Code-hostproces",
      ],
    },
    {
      title: "Als je liever een configuratiebestand gebruikt",
      body: [
        "Je kunt de MCP-server ook handmatig toevoegen. Het commando codex mcp add schrijft naar ~/.codex/config.toml — dat bestand kun je direct bewerken als je dat prefereert:",
      ],
      code: codexConfigToml,
      codeLabel: "~/.codex/config.toml",
    },
    {
      title: "Doorverwijzen naar een self-hosted instance",
      body: [
        "Als je team een private PrivateNote-server draait, stel je de basis-URL in via een omgevingsvariabele in de MCP-config:",
      ],
      code: selfHostedConfigToml,
      codeLabel: "~/.codex/config.toml",
      bullets: [
        "Alle geheimen blijven op jullie infrastructuur — niets gaat naar privatenote.ai",
        "Hetzelfde AES-256-GCM-versleutelingsmodel; alleen de opslagbestemming verandert",
      ],
    },
    {
      title: "Problemen oplossen",
      body: ["Als de PrivateNote-tool niet verschijnt in de client na setup:"],
      bullets: [
        "Start de MCP-client opnieuw — configuratiewijzigingen laden niet terwijl de app draait",
        "Bevestig dat Node.js is geïnstalleerd en op PATH staat: node --version",
        "Bevestig dat npx werkt: npx --version",
        "Valideer de JSON-config — een trailing comma is de meest voorkomende syntaxfout",
        "Controleer MCP- of extension-logs van de client op opstartfouten",
        "Controleer netwerktoegang tot privatenote.ai (of je self-hosted host)",
      ],
    },
    {
      title: "Een paar dingen om te onthouden",
      body: [
        "De URL is het geheim. De link bevat de ontsleutelingssleutel in het fragment. Behandel hem met dezelfde zorg als de credential zelf — commit hem niet, log hem niet, post hem niet in een openbaar kanaal.",
        "Vernietigen na lezen betekent precies dat. Zodra de link wordt geopend, verdwijnt hij. Jij noch de ontvanger kunnen hem opnieuw openen.",
        "Roteer na het delen. Als een credential in een AI-prompt verscheen — zelfs kort — behandel hem als mogelijk gezien. Deel de huidige waarde via PrivateNote en roteer daarna naar een nieuwe.",
        "PrivateNote is voor overdracht, niet voor opslag. Als een geheim langer dan een paar dagen beschikbaar moet blijven, gebruik je een echte secrets manager. PrivateNote is een veilige overdrachtsstap, geen kluis.",
        "Gebruik korte vervaltijden. Voor eenmalige geheimen zijn 15m of 1h bijna altijd genoeg. Kies standaard het kortste venster dat nog werkt voor de ontvanger.",
      ],
    },
  ],
  ctaTitle: "Verbind je AI-assistent met PrivateNote",
  ctaBody:
    "Eén commando of één JSON-blok registreert de MCP-server. Elke sessie daarna heeft een ingebouwde tool voor veilig delen van geheimen.",
  ctaButton: "Probeer PrivateNote →",
};
