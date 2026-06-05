import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe2,
  KeyRound,
  Lock,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

const SECTION_SCROLL = "scroll-mt-20";

/** Set true when self-hosting docs are ready to publish again. */
const SHOW_SELF_HOSTING = false;

const quickLinks = [
  { href: "#vscode",   icon: Code2,      label: "VS Code & Cursor" },
  { href: "#codex",    icon: Terminal,   label: "OpenAI Codex" },
  { href: "#mcp",      icon: Cpu,        label: "MCP server" },
  { href: "#trust",    icon: Shield,     label: "Trust model" },
];

const creationPaths = [
  {
    icon: Globe2,
    title: "Web app",
    label: "Fastest universal path",
    text: "Paste a secret, choose expiry and read limits, then share the encrypted link from any browser.",
  },
  {
    icon: Code2,
    title: "Editor extension",
    label: "Best daily developer flow",
    text: "Create notes from VS Code, Cursor, or Codex IDE without switching context. Use the sidebar, a selected-text command, or the title-bar action.",
  },
  {
    icon: Terminal,
    title: "Codex plugin",
    label: "Best in OpenAI Codex",
    text: "Install the bundled plugin for MCP plus skills, or add privatenote-mcp to ~/.codex/config.toml. Use the same VS Code extension in the Codex IDE for secrets the agent never sees.",
  },
  {
    icon: Bot,
    title: "MCP server",
    label: "Best for AI-assisted workflows",
    text: "Give an MCP client a local tool that creates PrivateNote links when an agent needs to hand off a secret.",
  },
];

const trustModel = [
  "The plaintext is encrypted locally before upload.",
  "The server stores ciphertext and note metadata, not the decryption key.",
  "The key stays in the URL fragment, which is not sent in HTTP requests.",
  "Read limits and expiry are enforced by the note service.",
];

export default function Developers() {
  const { language } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  const desktopSidebar = (
    <>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Quick start
      </p>
      <nav className="flex flex-col gap-1.5">
        {quickLinks.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary/8 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/10 dark:hover:text-primary"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Install now
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <Code2 className="h-3.5 w-3.5 shrink-0" />
            VS Marketplace
          </a>
          <a
            href="https://www.npmjs.com/package/privatenote-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <Terminal className="h-3.5 w-3.5 shrink-0" />
            npm: privatenote-mcp
          </a>
        </div>
      </div>
    </>
  );

  return (
    <MarketingDocShell sidebar={desktopSidebar} className="overflow-visible">
          {/* Hero */}
          <section className="mb-20 lg:mb-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Code2 className="h-3.5 w-3.5" />
              Developer integrations
            </div>
            <h1 className="page-title mb-8 max-w-none pb-2 leading-[1.05]">
              Share secrets from the tools where work actually happens
            </h1>
            <p className="max-w-3xl text-lg leading-loose text-gray-600 dark:text-gray-400 md:text-xl md:leading-loose lg:max-w-4xl">
              PrivateNote is useful as a website, but developer teams usually need the same encrypted handoff inside editors,
              local AI agents, scripts, and controlled deployments. This page maps those entry points and the trust boundary
              behind them.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Install extension
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={lp("/")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
              >
                Open web app
              </Link>
            </div>
          </section>

          {/* What can create a PrivateNote? */}
          <section className="mb-28 lg:mb-36">
            <p className="mb-10 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:mb-12">
              What can create a PrivateNote?
            </p>
            <div className="grid gap-10 sm:grid-cols-2 lg:gap-12 xl:grid-cols-3">
              {creationPaths.map((path) => {
                const Icon = path.icon;
                return (
                  <div key={path.title} className="flex gap-5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h2 className="text-base font-bold text-gray-950 dark:text-white">{path.title}</h2>
                        <span className="text-xs font-medium text-primary">{path.label}</span>
                      </div>
                      <p className="mt-3 text-base leading-loose text-gray-600 dark:text-gray-400">{path.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Where it fits */}
          <section className="mb-28 border-y border-gray-200 py-20 dark:border-gray-800 lg:mb-32 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
              <div>
                <p className="mb-3 text-sm font-semibold text-primary">Where it fits</p>
                <h2 className="text-3xl font-bold leading-snug text-gray-950 dark:text-white lg:text-[2rem]">A small tool for high-friction moments</h2>
              </div>
              <div className="space-y-7 text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">
                <p>
                  Developer teams still pass around database passwords, recovery codes, API tokens, support handoff details,
                  and customer-specific diagnostics. Those secrets often end up in chat history, ticket comments, pull request
                  threads, or AI prompts because the secure path is too slow.
                </p>
                <p>
                  PrivateNote is meant to make the safer path quick. The integration should feel like creating a link, while
                  the implementation keeps the sensitive text encrypted before it reaches the server.
                </p>
              </div>
            </div>
          </section>

          {/* Integration cards */}
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">

            {/* VS Code / Cursor */}
            <section id="vscode" className={`${SECTION_SCROLL} rounded-2xl border border-primary/30 bg-primary/5 p-9 sm:p-11`}>
              <div className="mb-8 flex items-start gap-4">
                <div className="rounded-xl bg-primary/15 p-2.5">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white">VS Code, Cursor & Codex IDE</h2>
                  <p className="mt-1.5 text-base text-gray-600 dark:text-gray-400">Recommended for most developers.</p>
                </div>
              </div>
              <p className="mb-9 text-base leading-loose text-gray-700 dark:text-gray-300">
                The extension is the primary developer entry point because it does not ask people to leave their editor.
                It supports a sidebar flow for deliberate notes and a selected-text flow for quick one-off handoffs.
              </p>
              <div className="mb-9 flex flex-col gap-4">
                {[
                  { icon: Lock,     label: "Sidebar",   detail: "Compose and configure" },
                  { icon: Zap,      label: "Selection", detail: "Share highlighted text" },
                  { icon: KeyRound, label: "Clipboard", detail: "Copy link after create" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 rounded-xl border border-primary/15 bg-white/70 p-5 dark:bg-white/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-950 dark:text-white">{item.label}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-pretty text-gray-600 dark:text-gray-400">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mb-10 rounded-xl bg-gray-950 p-6 font-mono text-sm leading-relaxed text-green-400">
                <span className="text-gray-500"># Search Extensions for PrivateNote, or install from CLI</span>
                <br />
                <span>code --install-extension PrivateNote.privatenote-vscode</span>
              </div>
              <a
                href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Install from Marketplace
                <ArrowRight className="h-4 w-4" />
              </a>
            </section>

            {/* Codex plugin */}
            <section id="codex" className={`${SECTION_SCROLL} rounded-2xl border border-gray-200 bg-white/60 p-9 sm:p-11 dark:border-gray-800 dark:bg-white/5`}>
              <div className="mb-8 flex items-start gap-4">
                <div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
                  <Terminal className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white">OpenAI Codex plugin</h2>
                  <p className="mt-1.5 text-base text-gray-600 dark:text-gray-400">
                    MCP + skills for Codex CLI and IDE — same repo as this site.
                  </p>
                </div>
              </div>
              <p className="mb-9 text-base leading-loose text-gray-700 dark:text-gray-300">
                Codex plugins bundle an MCP server and reusable skills. Install from the repo marketplace
                (`.agents/plugins/marketplace.json`) or wire{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
                  privatenote-mcp
                </code>{" "}
                into <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">~/.codex/config.toml</code>.
                For secrets the agent must not see, use the VS Code extension in the Codex IDE instead of pasting into chat.
              </p>
              <div className="mb-10 rounded-xl bg-gray-950 p-6 font-mono text-sm leading-relaxed text-gray-300">
                <span className="text-gray-500"># ~/.codex/config.toml — one-liner</span>
                <pre className="mt-2 whitespace-pre-wrap text-green-400">{`codex mcp add privatenote -- npx -y privatenote-mcp`}</pre>
                <span className="mt-3 block text-gray-500"># or edit the file directly</span>
                <pre className="mt-2 whitespace-pre-wrap text-green-400">{`[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]
enabled = true`}</pre>
              </div>
              <Link
                href={lp("/blog/privatenote-codex")}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
              >
                Full Codex guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          <div className="mt-16 border-t border-gray-200 pt-16 dark:border-gray-800 lg:mt-20 lg:pt-20">
            {/* MCP server — full width */}
            <section id="mcp" className={`${SECTION_SCROLL} rounded-2xl border border-gray-200 bg-white/60 p-9 sm:p-11 dark:border-gray-800 dark:bg-white/5`}>
              <div className="mb-8 flex items-start gap-4">
                <div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
                  <Cpu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 dark:text-white">MCP server for AI agents</h2>
                  <p className="mt-1.5 text-base text-gray-600 dark:text-gray-400">Use when an agent needs a secure handoff tool.</p>
                </div>
              </div>
              <p className="mb-9 text-base leading-loose text-gray-700 dark:text-gray-300">
                Add the MCP server to Codex, Cursor, Claude Desktop, Continue.dev, Zed, or any MCP client. The agent receives a
                <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
                  create_private_note
                </code>
                tool, and the local MCP process creates the encrypted link.
              </p>
              <div className={`mb-9 grid gap-6${SHOW_SELF_HOSTING ? " lg:grid-cols-2" : ""}`}>
                <div>
                  <p className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Cursor / Claude Desktop</p>
                    <div className="rounded-xl bg-gray-950 p-6 font-mono text-sm leading-relaxed text-gray-300">
                    <span className="text-gray-500">// ~/.cursor/mcp.json or claude_desktop_config.json</span>
                    <pre className="mt-2 whitespace-pre-wrap text-green-400">{`{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`}</pre>
                  </div>
                </div>
                {SHOW_SELF_HOSTING ? (
                  <div>
                    <p className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Self-hosted instance</p>
                    <div className="rounded-xl bg-gray-950 p-6 font-mono text-sm leading-relaxed text-gray-300">
                      <span className="text-gray-500">// add env block to any MCP config</span>
                      <pre className="mt-2 whitespace-pre-wrap text-green-400">{`"env": {
  "PRIVATENOTE_API_BASE_URL":
    "https://notes.your-domain.com"
}`}</pre>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mb-9 rounded-xl border border-amber-200 bg-amber-50 p-6 text-base leading-loose text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                <strong>Privacy boundary:</strong> if a secret is typed into a cloud AI prompt, the model provider can see it
                before the MCP tool runs. For the strongest privacy posture, use the MCP flow with a local model.
              </div>
              <a
                href="https://www.npmjs.com/package/privatenote-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
              >
                <Terminal className="h-4 w-4" />
                View on npm
              </a>
            </section>
          </div>

          {/* Trust model */}
          <section id="trust" className={`${SECTION_SCROLL} mt-28 border-t border-gray-200 py-24 dark:border-gray-800 lg:mt-32 lg:py-32`}>
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold text-primary">Trust model</p>
              <h2 className="text-3xl font-bold leading-snug text-gray-950 dark:text-white lg:text-[2rem]">
                Same contract on every path
              </h2>
              <ul className="mt-8 space-y-6 sm:space-y-7">
                {trustModel.map((item) => (
                  <li key={item} className="flex gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">{item}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">
                All integration paths should preserve the same basic contract: create ciphertext locally, upload only what
                the server needs to store and enforce, then share a link that carries the decryption key outside the request.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 rounded-2xl bg-primary px-9 py-14 text-white sm:px-11 sm:py-16 lg:mt-24 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
              <div>
                <h2 className="mb-4 text-3xl font-bold leading-snug">Start with the integration closest to the secret</h2>
                <p className="max-w-2xl text-base leading-loose text-white/85">
                  Use the web app for occasional sharing, the editor extension for daily developer work, and MCP when an
                  agent needs a secure handoff primitive.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-white/90"
                >
                  <Shield className="h-4 w-4" />
                  Install extension
                </a>
                <Link
                  href={lp("/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
                >
                  Discuss premium
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-20 flex items-center gap-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:mt-24">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Extension, MCP, and the web app all use the same encryption boundary.</span>
            <Database className="ml-2 h-3.5 w-3.5" />
          </div>

    </MarketingDocShell>
  );
}
