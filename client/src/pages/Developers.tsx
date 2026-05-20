import React from "react";
import { Link } from "wouter";
import { Code2, Cpu, Globe, Lock, Shield, Terminal, Zap, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

export default function Developers() {
  const { t, language } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  return (
    <div className="mx-auto max-w-5xl overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-20 mb-20 relative">
      {/* Ambient glows */}
      <div className="absolute top-[-80px] right-1/4 w-80 h-80 bg-primary/10 blur-[130px] -z-10" />
      <div className="absolute bottom-[120px] left-1/4 w-56 h-56 bg-blue-500/10 blur-[120px] -z-10" />

      {/* Hero */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium mb-6">
          <Code2 className="h-3.5 w-3.5" />
          Developer integrations
        </div>
        <h1 className="page-title mb-6 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Share secrets from{" "}
          <span className="text-primary italic">anywhere you work</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          PrivateNote works inside your editor, inside your AI agent, and in any browser — with the same AES-256 encryption and the same zero-knowledge guarantee.
        </p>
      </div>

      <div className="space-y-6">

        {/* VS Code / Cursor — Prime method */}
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-8 relative overflow-hidden">
          <div className="absolute top-3 right-4 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
            Recommended
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-primary/15 p-2.5">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">VS Code & Cursor extension</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">No terminal. No config. Install and go.</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
            The extension lives in the sidebar — click the PrivateNote icon, type or paste your secret, set an expiry, and click <strong>Share PrivateNote</strong>. The encrypted link copies to your clipboard. Encryption happens on your machine before anything is sent.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <Lock className="h-4 w-4" />, label: "Sidebar panel", detail: "Always one click away" },
              { icon: <Zap className="h-4 w-4" />, label: "Selection shortcut", detail: "Right-click any selected text" },
              { icon: <Shield className="h-4 w-4" />, label: "Title-bar icon", detail: "Lock icon when text selected" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-primary/15 bg-white/50 dark:bg-white/5 p-4">
                <div className="flex items-center gap-2 text-primary mb-1">{f.icon}<span className="font-semibold text-sm">{f.label}</span></div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{f.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm text-green-400 mb-6">
            <span className="text-gray-500"># Search in Extensions panel (Cmd+Shift+X)</span>
            <br />
            <span className="text-white">PrivateNote</span>
            <br /><br />
            <span className="text-gray-500"># Or install from CLI</span>
            <br />
            <span>cursor --install-extension PrivateNote.privatenote-vscode</span>
          </div>

          <a
            href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Install from Marketplace
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        {/* MCP Server */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-white/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5">
              <Cpu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">MCP server for AI agents</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Let Cursor, Claude, or any MCP client create notes automatically.</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
            Add one block to your MCP config and your AI agent gains the <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono">create_private_note</code> tool. The model calls it, encryption runs locally via the MCP server process, and you get back a self-destructing link.
          </p>

          <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm text-gray-300 mb-4">
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

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Works with <strong className="text-gray-700 dark:text-gray-300">Cursor</strong>, <strong className="text-gray-700 dark:text-gray-300">Claude Desktop</strong>, <strong className="text-gray-700 dark:text-gray-300">Continue.dev</strong>, <strong className="text-gray-700 dark:text-gray-300">Zed</strong>, and any client that speaks the Model Context Protocol.
          </p>

          <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 mb-5 text-sm text-amber-800 dark:text-amber-300">
            <strong>Note on privacy:</strong> When you include a secret in a prompt, the AI model sees it before the MCP tool encrypts it. For full privacy, use a local model (Ollama) — then nothing leaves your machine until it's already encrypted.
          </div>

          <a
            href="https://www.npmjs.com/package/privatenote-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
          >
            <Terminal className="h-4 w-4" />
            View on npm
          </a>
        </section>

        {/* Web app */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-white/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5">
              <Globe className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Web app</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">No install required.</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-5 max-w-2xl">
            Go to <a href="https://privatenote.ai" className="text-primary font-medium hover:underline">privatenote.ai</a>, paste your secret, choose expiry and burn settings, click <strong>Create</strong>. Share the link. Works in any browser, on any device.
          </p>

          <Link
            href={lp("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4" />
            Open web app
          </Link>
        </section>

        {/* How encryption works */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">How the encryption works</h2>

          <div className="space-y-3 mb-6">
            {[
              { step: "1", title: "Key generated locally", detail: "A random 256-bit AES key is created on your machine. It never leaves." },
              { step: "2", title: "Content encrypted", detail: "AES-256-GCM authenticated encryption. The ciphertext is bound to note ID, expiry, and read limit via AAD — tampering is detected." },
              { step: "3", title: "Ciphertext sent, key kept", detail: "Only the encrypted blob is POSTed to privatenote.ai. The key is not included in any request." },
              { step: "4", title: "Key lives in the URL fragment", detail: "The shareable link is privatenote.ai/note/{id}#key. The #fragment is never sent to the server — it's a 30-year browser standard. The server stores data it can never decrypt." },
              { step: "5", title: "Recipient decrypts locally", detail: "Their browser fetches the ciphertext, extracts the key from the URL fragment, and decrypts locally. If burn-after-reading, the server deletes the blob immediately." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.title}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Algorithm", value: "AES-256-GCM" },
              { label: "Key size", value: "256 bits" },
              { label: "Key source", value: "Web Crypto API" },
            ].map((r) => (
              <div key={r.label} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{r.label}</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{r.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Self-hosting */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Self-hosting</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
            Run your own PrivateNote instance for maximum control. Point the extension and MCP server at your deployment via configuration.
          </p>
          <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm text-gray-300 mb-4">
            <span className="text-gray-500">// VS Code settings.json</span>
            <pre className="mt-2 whitespace-pre-wrap text-green-400">{`"privatenote.apiBaseUrl": "https://notes.your-domain.com"`}</pre>
            <br />
            <span className="text-gray-500">// MCP env</span>
            <pre className="mt-2 whitespace-pre-wrap text-green-400">{`"env": { "PRIVATENOTE_API_BASE_URL": "https://notes.your-domain.com" }`}</pre>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[2.5rem] bg-primary px-10 py-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-bold mb-3 relative z-10">Start with the extension</h2>
          <p className="text-white/80 max-w-md mx-auto mb-7 relative z-10">
            The fastest way to see PrivateNote in action — install the VS Code or Cursor extension and share your first encrypted note in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-white/90 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Install VS Code extension
            </a>
            <Link
              href={lp("/")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Try the web app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
