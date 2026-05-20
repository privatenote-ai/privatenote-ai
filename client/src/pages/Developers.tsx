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
  ServerCog,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

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
    text: "Create notes from VS Code or Cursor without switching context. Use the sidebar, a selected-text command, or the title-bar action.",
  },
  {
    icon: Bot,
    title: "MCP server",
    label: "Best for AI-assisted workflows",
    text: "Give an MCP client a local tool that creates PrivateNote links when an agent needs to hand off a secret.",
  },
  {
    icon: ServerCog,
    title: "Self-hosted deployment",
    label: "Best for controlled environments",
    text: "Point the extension and MCP server at your own PrivateNote instance when you need tighter operational control.",
  },
];

const trustModel = [
  "The plaintext is encrypted locally before upload.",
  "The server stores ciphertext and note metadata, not the decryption key.",
  "The key stays in the URL fragment, which is not sent in HTTP requests.",
  "Read limits and expiry are enforced by the note service.",
];

const premiumItems = [
  {
    title: "Personal Premium",
    detail: "Higher usage limits and larger on-device AI capacity for people who use PrivateNote as part of daily work.",
  },
  {
    title: "Business Premium",
    detail: "Team-oriented controls such as longer activity history, deployment guidance, and compliance-oriented storage options.",
  },
  {
    title: "Self-host support",
    detail: "A paid path can include help running PrivateNote under your own domain and configuring developer tools against it.",
  },
];

export default function Developers() {
  const { language } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <section className="mb-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Code2 className="h-3.5 w-3.5" />
            Developer integrations
          </div>
          <h1 className="page-title mb-6 max-w-3xl pb-2 leading-[1.05]">
            Share secrets from the tools where work actually happens
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
            PrivateNote is useful as a website, but developer teams usually need the same encrypted handoff inside editors,
            local AI agents, scripts, and controlled deployments. This page maps those entry points and the trust boundary
            behind them.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm dark:border-gray-800 dark:bg-white/5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            What can create a PrivateNote?
          </p>
          <div className="space-y-3">
            {creationPaths.map((path) => {
              const Icon = path.icon;
              return (
                <div key={path.title} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/60">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h2 className="text-sm font-bold text-gray-950 dark:text-white">{path.title}</h2>
                      <span className="text-xs font-medium text-primary">{path.label}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{path.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-14 border-y border-gray-200 py-10 dark:border-gray-800">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">Where it fits</p>
            <h2 className="text-3xl font-bold text-gray-950 dark:text-white">A small tool for high-friction moments</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-7">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-primary/15 p-2.5">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">VS Code & Cursor extension</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recommended for most developers.</p>
            </div>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            The extension is the primary developer entry point because it does not ask people to leave their editor.
            It supports a sidebar flow for deliberate notes and a selected-text flow for quick one-off handoffs.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Lock, label: "Sidebar", detail: "Compose and configure" },
              { icon: Zap, label: "Selection", detail: "Share highlighted text" },
              { icon: KeyRound, label: "Clipboard", detail: "Copy link after create" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-primary/15 bg-white/70 p-3 dark:bg-white/5">
                  <Icon className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="mb-6 rounded-xl bg-gray-950 p-4 font-mono text-sm text-green-400">
            <span className="text-gray-500"># Search Extensions for PrivateNote, or install from CLI</span>
            <br />
            <span>cursor --install-extension PrivateNote.privatenote-vscode</span>
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

        <section className="rounded-2xl border border-gray-200 bg-white/60 p-7 dark:border-gray-800 dark:bg-white/5">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-800">
              <Cpu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">MCP server for AI agents</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use when an agent needs a secure handoff tool.</p>
            </div>
          </div>
          <p className="mb-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            Add the MCP server to Cursor, Claude Desktop, Continue.dev, Zed, or any MCP client. The agent receives a
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
              create_private_note
            </code>
            tool, and the local MCP process creates the encrypted link.
          </p>
          <div className="mb-5 rounded-xl bg-gray-950 p-4 font-mono text-sm text-gray-300">
            <span className="text-gray-500">// ~/.cursor/mcp.json</span>
            <pre className="mt-2 whitespace-pre-wrap text-green-400">{`{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`}</pre>
          </div>
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
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

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white/60 p-7 dark:border-gray-800 dark:bg-white/5">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-950 dark:text-white">Trust model</h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              All integration paths should preserve the same basic contract: create ciphertext locally, upload only what
              the server needs to store and enforce, then share a link that carries the decryption key outside the request.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustModel.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/60">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white/60 p-7 dark:border-gray-800 dark:bg-white/5">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <Sparkles className="h-3.5 w-3.5" />
              Planned premium layer
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-950 dark:text-white">Where premium belongs</h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Premium should not weaken the core promise. The free product can stay useful for secure one-off sharing,
              while premium adds capacity, governance, and support for people who rely on PrivateNote operationally.
            </p>
          </div>
          <div className="space-y-3">
            {premiumItems.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/60">
                <div className="mb-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white/60 p-7 dark:border-gray-800 dark:bg-white/5">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-950 dark:text-white">Self-hosting shape</h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Self-hosting should be presented as another deployment target, not a different product. The extension and
              MCP server only need to know which PrivateNote API base URL to use.
            </p>
          </div>
          <div className="rounded-xl bg-gray-950 p-4 font-mono text-sm text-gray-300">
            <span className="text-gray-500">// VS Code settings.json</span>
            <pre className="mt-2 whitespace-pre-wrap text-green-400">{`"privatenote.apiBaseUrl": "https://notes.your-domain.com"`}</pre>
            <br />
            <span className="text-gray-500">// MCP env</span>
            <pre className="mt-2 whitespace-pre-wrap text-green-400">{`"env": { "PRIVATENOTE_API_BASE_URL": "https://notes.your-domain.com" }`}</pre>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-primary px-7 py-10 text-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="mb-3 text-3xl font-bold">Start with the integration closest to the secret</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80">
              Use the web app for occasional sharing, the editor extension for daily developer work, and MCP when an
              agent needs a secure handoff primitive.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
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

      <div className="mt-8 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <GitBranch className="h-3.5 w-3.5" />
        <span>Extension, MCP, web app, and self-hosting all use the same encryption boundary.</span>
        <Database className="ml-2 h-3.5 w-3.5" />
      </div>
    </div>
  );
}
