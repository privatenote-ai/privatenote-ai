import { Bot, Chrome, Code2, Cpu, Terminal } from "lucide-react";
import { CHROME_EXTENSION_STORE_URL } from "@/utils/chromeExtensionOnboarding";
import type { DevIntegrationContent } from "@/components/developers/types";
import type { EnglishOnlyDeveloperIntegration } from "@shared/englishOnlyDeveloperIntegrations";

const MCP_CONFIG = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

const CODEX_TOML = `# ~/.codex/config.toml — one-liner
codex mcp add privatenote -- npx -y privatenote-mcp

# or edit the file directly
[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]
enabled = true`;

export const DEVELOPER_INTEGRATIONS: readonly { id: EnglishOnlyDeveloperIntegration }[] = [
  { id: "cli" },
  { id: "vscode" },
  { id: "mcp" },
  { id: "codex" },
  { id: "chrome" },
];

const INTEGRATION_CONTENT: Record<EnglishOnlyDeveloperIntegration, DevIntegrationContent> = {
  cli: {
    id: "cli",
    icon: Terminal,
    status: "stable",
    metaTitle: "PrivateNote CLI",
    metaDescription:
      "Create encrypted PrivateNote links from the terminal. Pipe secrets from stdin, enforce HTTPS pinning, and keep plaintext out of shell history.",
    heroTitle: "PrivateNote CLI",
    heroSubtitle: "Zero-footprint secrets in scripts, pipes, and CI — encrypted locally before anything reaches the network.",
    hubPreview: "npx privatenote-cli --expire 1h --output-url-only",
    whyTitle: "Who this is for",
    whyBody: [
      "Use the CLI when the secret already lives in a file, password manager, or pipeline output and you need a shareable link without pasting into chat or email.",
      "The tool reads from stdin or a file path, encrypts with AES-256-GCM on your machine, uploads only ciphertext, and prints a URL with the decryption key in the fragment.",
      "Notes created this way are tracked as creationSource: cli in analytics.",
    ],
    quickStartTitle: "Install",
    quickStartNote: "Requires Node.js 18+. Works on macOS, Linux, and Windows.",
    quickStartCode: `# Run once without installing
npx privatenote-cli --expire 1h --output-url-only

# Or install globally (adds the \`privatenote\` command)
npm install -g privatenote-cli

# Pipe a secret in scripts
cat secret.txt | privatenote --expire 1h --output-url-only

# Local self-host / wrangler dev (HTTP API — dev only)
echo "secret" | privatenote --insecure --api-base-url http://localhost:8787 --output-url-only`,
    securityTitle: "Security architecture",
    securityBody: [
      "Plaintext never leaves your machine unencrypted. The share URL carries the decryption key in its #fragment, which browsers and HTTP clients do not send to servers.",
      "When stdout is not a TTY (piped or captured), the CLI refuses to print a link unless you pass --output-url-only or --force-stdout — this prevents accidental leaks into CI logs.",
    ],
    securityBullets: [
      "HTTPS required for remote API origins; pass --insecure only for local http:// dev (e.g. wrangler dev on :8787).",
      "PRIVATENOTE_ALLOWED_HOSTS pins API hostnames when using a custom API base URL.",
      "Response shape validation and reserved note ID checks before upload.",
      "Prefer redirecting output to a chmod 600 file instead of echoing URLs.",
    ],
    refTitle: "Flags and environment variables",
    refRows: [
      { name: "--expire 15m|1h|24h|7d", description: "Note lifetime (default: 24h)" },
      { name: "--burn / --no-burn", description: "Destroy after first view (default: burn)" },
      { name: "--title <text>", description: "Optional title prepended to content" },
      { name: "--json", description: "Print { secureUrl, expiresAt, burnAfterReading }" },
      { name: "--output-url-only", description: "URL-only output; safe for piped stdout in scripts" },
      { name: "--force-stdout", description: "Allow output when stdout is not a terminal (use with --json in CI)" },
      { name: "--api-base-url <url>", description: "Override API origin (HTTPS; use with --insecure for local http://)" },
      { name: "--insecure", description: "Allow http:// API origins — local dev only, never in production" },
      { name: "PRIVATENOTE_API_BASE_URL", description: "Default API base URL" },
      { name: "PRIVATENOTE_WEB_ORIGIN", description: "Share-link origin (defaults to API origin)" },
      { name: "PRIVATENOTE_ALLOWED_HOSTS", description: "Comma-separated hostname allowlist" },
    ],
    primaryCta: {
      label: "View on npm",
      href: "https://www.npmjs.com/package/privatenote-cli",
      external: true,
    },
    secondaryCta: {
      label: "CLI source on GitHub",
      href: "https://github.com/privatenote-ai/privatenote-ai/tree/main/packages/privatenote-cli",
      external: true,
    },
    blogLink: { label: "Developer walkthrough", slug: "privatenote-for-developers" },
    npmPackage: "privatenote-cli",
    playground: "cli",
  },
  vscode: {
    id: "vscode",
    icon: Code2,
    status: "stable",
    metaTitle: "VS Code & Cursor extension",
    metaDescription:
      "Create encrypted PrivateNote links from VS Code, Cursor, or Codex IDE. Sidebar panel, selection commands, and clipboard copy without leaving your editor.",
    heroTitle: "VS Code, Cursor & Codex IDE",
    heroSubtitle: "The primary developer entry point — compose, configure, and share without switching context.",
    hubPreview: "code --install-extension PrivateNote.privatenote-vscode",
    whyTitle: "Who this is for",
    whyBody: [
      "If you spend your day in an editor, this is the lowest-friction path. Install once and create encrypted handoff links from the sidebar, a context menu, or the editor title bar.",
      "Select any text and right-click Share as PrivateNote for quick one-off transfers. The extension encrypts locally and copies the link to your clipboard.",
    ],
    quickStartTitle: "Install",
    quickStartCode: `# VS Code / Cursor Extensions panel (Cmd+Shift+X / Ctrl+Shift+X)
# Search: PrivateNote

# Or install from the terminal:
code --install-extension PrivateNote.privatenote-vscode`,
    securityTitle: "Security architecture",
    securityBody: [
      "The extension uses the same client-side encryption as the web app: AES-256-GCM with a random 256-bit key that never leaves your machine.",
      "Only ciphertext is uploaded. The decryption key is appended to the share URL as a fragment, outside HTTP requests.",
    ],
    securityBullets: [
      "Sidebar flow for deliberate notes with expiry and burn settings.",
      "Selection and title-bar shortcuts for fast handoffs.",
      "Link copied to clipboard after create — treat it like the secret itself.",
    ],
    refTitle: "Workflows and commands",
    refRows: [
      { name: "Sidebar panel", description: "Compose content, set expiry, burn-after-reading, then share" },
      { name: "Share as PrivateNote", description: "Context menu on selected text" },
      { name: "Title bar action", description: "Lock icon when text is selected" },
      { name: "privatenote.apiBaseUrl", description: "API host for self-hosted instances (default: https://privatenote.ai)" },
      { name: "privatenote.webOrigin", description: "Share-link origin; usually matches apiBaseUrl" },
      { name: "Default expiry", description: "15 minutes, 1 hour, 1 day, or 7 days" },
      { name: "Burn after reading", description: "Enabled by default; note self-destructs after first view" },
    ],
    primaryCta: {
      label: "Install from Marketplace",
      href: "https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode",
      external: true,
    },
    blogLink: { label: "Developer walkthrough", slug: "privatenote-for-developers" },
    screenshot: {
      src: "/images/developers/vscode-cursor-panel.png",
      alt: "PrivateNote sidebar panel in VS Code or Cursor with title, content, expiry, and burn-after-reading options",
      caption:
        "Sidebar panel in VS Code or Cursor — compose a note, set expiry and burn-after-reading, then share without leaving the editor.",
    },
  },
  mcp: {
    id: "mcp",
    icon: Cpu,
    status: "stable",
    metaTitle: "PrivateNote MCP server",
    metaDescription:
      "Give AI agents a local create_private_note tool. Works with Cursor, Claude Desktop, Codex, Zed, and any MCP client.",
    heroTitle: "MCP server for AI agents",
    heroSubtitle: "Let agents hand off secrets securely — encryption runs locally in the MCP process.",
    hubPreview: MCP_CONFIG,
    whyTitle: "Who this is for",
    whyBody: [
      "Use MCP when an AI assistant needs to create a PrivateNote link as part of a workflow — for example, sending an API key securely with burn-after-reading.",
      "The MCP server exposes a create_private_note tool. The local process encrypts content and returns a shareable URL to the agent.",
    ],
    quickStartTitle: "Install and configure",
    quickStartCode: `# npm package (runs via npx)
npx -y privatenote-mcp

# Cursor — ~/.cursor/mcp.json
${MCP_CONFIG}

# Claude Desktop — claude_desktop_config.json (same structure)`,
    securityTitle: "Security architecture and privacy boundary",
    securityBody: [
      "Encryption happens in the local MCP process before upload. The server stores ciphertext only.",
      "Important: if you paste a secret into a cloud AI prompt, the model provider can see it before the MCP tool runs. For the strongest posture, use a local model or the VS Code extension for secrets the agent must never see.",
    ],
    securityBullets: [
      "creationSource: mcp in analytics.",
      "Optional PRIVATENOTE_API_BASE_URL for self-hosted instances.",
      "Works with any MCP-compatible client.",
    ],
    refTitle: "Configuration reference",
    refRows: [
      { name: "create_private_note", description: "MCP tool — content, expiry, burn-after-reading" },
      { name: "command", description: 'npx (or node path to local build)' },
      { name: 'args', description: '["-y", "privatenote-mcp"]' },
      { name: "PRIVATENOTE_API_BASE_URL", description: "Override API for self-hosted deployments" },
    ],
    primaryCta: {
      label: "View on npm",
      href: "https://www.npmjs.com/package/privatenote-mcp",
      external: true,
    },
    blogLink: { label: "PrivateNote for developers", slug: "privatenote-for-developers" },
    npmPackage: "privatenote-mcp",
    playground: "mcp",
  },
  codex: {
    id: "codex",
    icon: Bot,
    status: "stable",
    metaTitle: "OpenAI Codex plugin",
    metaDescription:
      "Install PrivateNote in OpenAI Codex via MCP and skills. Bundle privatenote-mcp or wire it in ~/.codex/config.toml.",
    heroTitle: "OpenAI Codex plugin",
    heroSubtitle: "MCP plus skills for Codex CLI and IDE — same repository as this site.",
    hubPreview: "codex mcp add privatenote -- npx -y privatenote-mcp",
    whyTitle: "Who this is for",
    whyBody: [
      "Codex plugins bundle an MCP server and reusable skills. Use PrivateNote when Codex needs to create encrypted handoff links during agent workflows.",
      "For secrets the agent must not see, use the VS Code extension in the Codex IDE instead of pasting credentials into chat.",
    ],
    quickStartTitle: "Install in Codex",
    quickStartCode: `# One-liner
codex mcp add privatenote -- npx -y privatenote-mcp

# Or edit ~/.codex/config.toml:
${CODEX_TOML.split("\n").slice(2).join("\n")}`,
    securityTitle: "Trust model",
    securityBody: [
      "Codex uses the same encryption boundary as every other integration: local encryption, ciphertext upload, key in the URL fragment.",
      "For cryptographic primitives and the full architecture, see How it works and the end-to-end encryption guide linked below.",
    ],
    securityBullets: [
      "Bundled plugin marketplace: .agents/plugins/marketplace.json in the repo.",
      "Skills teach Codex when and how to call create_private_note.",
      "Prefer the editor extension when the secret must not enter the model context.",
    ],
    refTitle: "Codex configuration",
    refRows: [
      { name: "codex mcp add", description: "CLI helper to register the MCP server" },
      { name: "[mcp_servers.privatenote]", description: "TOML block in ~/.codex/config.toml" },
      { name: "privatenote-mcp", description: "npm package run via npx" },
      { name: "VS Code extension", description: "Use in Codex IDE for secrets the agent never sees" },
    ],
    primaryCta: {
      label: "Full Codex guide (blog)",
      href: "/blog/privatenote-codex",
    },
    secondaryCta: {
      label: "How encryption works",
      href: "/how-it-works",
    },
    blogLink: { label: "Codex integration guide", slug: "privatenote-codex" },
  },
  chrome: {
    id: "chrome",
    icon: Chrome,
    status: "stable",
    metaTitle: "Chrome extension",
    metaDescription:
      "Encrypt and share selected text from any page. Toolbar popup, context menu, and keyboard shortcut with local AES-256-GCM encryption.",
    heroTitle: "Chrome extension",
    heroSubtitle: "Encrypt selected text in the browser without opening privatenote.ai — same client-side flow, fewer context switches.",
    hubPreview: "# Right-click selected text → Create PrivateNote\n# Shortcut: Alt+Shift+P",
    whyTitle: "Who this is for",
    whyBody: [
      "Use the Chrome extension when you are already in the browser — email, docs, tickets — and need to turn selected text into an encrypted one-time link.",
      "Encryption runs in the extension using the same shared crypto module as the web app. Plaintext is never sent to PrivateNote servers.",
    ],
    quickStartTitle: "Install",
    quickStartCode: `# Chrome Web Store (recommended)
# Search: PrivateNote Encrypted Note Sharing

# Or load unpacked for development (from repo root):
npm run build:chrome
# chrome://extensions → Developer mode → Load unpacked → packages/privatenote-chrome/dist`,
    securityTitle: "Security architecture",
    securityBody: [
      "Manifest V3 extension with local encryption before upload. Analytics records creationSource: chrome.",
      "The generated link is copied to your clipboard automatically. Treat the URL like the secret — the key is in the fragment.",
    ],
    securityBullets: [
      "Context menu: Create PrivateNote on selected text.",
      "Toolbar popup to compose notes with expiry and burn settings.",
      "Alt+Shift+P prefills selected text from the active tab.",
      "host_permissions limited to privatenote.ai for API calls — not configurable for self-hosting.",
    ],
    refTitle: "Features and permissions",
    refRows: [
      { name: "storage", description: "Sync settings; session storage for prefilled selection" },
      { name: "contextMenus", description: "Right-click Create PrivateNote" },
      { name: "activeTab + scripting", description: "Read selection for keyboard shortcut" },
      { name: "clipboardWrite", description: "Copy generated link" },
      { name: "Default expiry", description: "Configurable in extension settings" },
      { name: "Burn after reading", description: "Default on; configurable in options" },
    ],
    primaryCta: {
      label: "Add to Chrome",
      href: CHROME_EXTENSION_STORE_URL,
      external: true,
    },
    blogLink: { label: "How to make a private note", slug: "how-to-make-a-private-note" },
    screenshot: {
      src: "/images/developers/chrome-extension-panel.png",
      alt: "PrivateNote Chrome extension popup with title, content, optional password, expiry, and burn-after-reading options",
      caption:
        "Toolbar popup in Chrome — compose a note, set expiry and burn-after-reading, then share without opening privatenote.ai.",
    },
  },
};

export function getDeveloperIntegration(
  id: string,
): DevIntegrationContent | undefined {
  if (!(id in INTEGRATION_CONTENT)) return undefined;
  return INTEGRATION_CONTENT[id as EnglishOnlyDeveloperIntegration];
}

export function developerIntegrationMeta(id: string): { title: string; description: string } | null {
  const content = getDeveloperIntegration(id);
  if (!content) return null;
  return { title: content.metaTitle, description: content.metaDescription };
}
