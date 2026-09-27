import React, { useMemo, useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import {
  createPlaygroundNote,
  formatPlaygroundError,
  shellEscapeSingleQuoted,
  type PlaygroundExpiresIn,
} from "@/components/developers/createPlaygroundNote";
import {
  DeveloperTerminalFrame,
  type TerminalLine,
} from "@/components/developers/DeveloperTerminalFrame";
import { useLanguage } from "@/context/LanguageContext";

type PlaygroundMode = "cli" | "mcp";

type DeveloperIntegrationPlaygroundProps = {
  mode: PlaygroundMode;
};

const DEFAULT_SECRET = "sk-live-demo-replace-me";

function buildCliLines(command: string, output?: string, error?: string): TerminalLine[] {
  const lines: TerminalLine[] = [{ variant: "prompt", text: command }];
  if (output) {
    lines.push({ variant: "output", text: output });
  }
  if (error) {
    lines.push({ variant: "comment", text: error });
  }
  return lines;
}

function buildMcpLines(
  requestJson: string,
  responseJson?: string,
  error?: string,
): TerminalLine[] {
  const lines: TerminalLine[] = [
    { variant: "comment", text: "// MCP tool call" },
    { variant: "json", text: requestJson },
  ];
  if (responseJson) {
    lines.push({ variant: "comment", text: "// Response" });
    lines.push({ variant: "json", text: responseJson });
  }
  if (error) {
    lines.push({ variant: "comment", text: error });
  }
  return lines;
}

function TerminalFieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-gray-500">{children}</span>;
}

function TerminalInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      className={`min-w-0 flex-1 border-b border-gray-700 bg-transparent px-1 py-0.5 text-green-400 outline-none focus:border-green-500/60 ${className}`}
    />
  );
}

function TerminalSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="border-b border-gray-700 bg-transparent px-1 py-0.5 text-gray-300 outline-none focus:border-gray-500"
    >
      {children}
    </select>
  );
}

function TerminalAction({
  onClick,
  disabled,
  children,
  type = "button",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="text-green-400 underline decoration-green-400/40 underline-offset-2 transition-colors hover:text-green-300 disabled:cursor-not-allowed disabled:text-gray-600 disabled:no-underline"
    >
      {children}
    </button>
  );
}

function PlaygroundPrimaryButton({
  onClick,
  disabled,
  running,
  runningLabel,
  label,
  className = "",
}: {
  onClick: () => void;
  disabled: boolean;
  running: boolean;
  runningLabel: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {running ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {running ? runningLabel : label}
    </button>
  );
}

export function DeveloperIntegrationPlayground({ mode }: DeveloperIntegrationPlaygroundProps) {
  const { t } = useLanguage();
  const [content, setContent] = useState(DEFAULT_SECRET);
  const [expiresIn, setExpiresIn] = useState<PlaygroundExpiresIn>("1h");
  const [burnAfterReading, setBurnAfterReading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof createPlaygroundNote>> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const idleCliCommand = useMemo(() => {
    const escaped = shellEscapeSingleQuoted(content.trim() || DEFAULT_SECRET);
    const flags = [`--expire ${expiresIn}`, "--output-url-only"];
    if (!burnAfterReading) flags.push("--no-burn");
    return `echo '${escaped}' | npx privatenote-cli ${flags.join(" ")}`;
  }, [burnAfterReading, content, expiresIn]);

  const idleMcpRequest = useMemo(() => {
    const preview = {
      contentFilePath: "/absolute/path/secret.txt",
      expiresIn,
      burnAfterReading,
    };
    return [
      "// 1. Preview — pass a path, not the secret. No URL yet.",
      `create_private_note(${JSON.stringify(preview, null, 2)})`,
      "",
      "// 2. After you approve",
      "confirm_private_note({",
      '  "confirmationId": "cnfg_…"',
      "})",
    ].join("\n");
  }, [burnAfterReading, expiresIn]);

  const terminalLines = useMemo((): TerminalLine[] => {
    if (mode === "cli") {
      if (result) {
        return buildCliLines(idleCliCommand, result.secureUrl);
      }
      if (error) {
        return buildCliLines(idleCliCommand, undefined, error);
      }
      return buildCliLines(idleCliCommand, t.devPlaygroundCliIdleOutput);
    }

    if (result) {
      return buildMcpLines(
        idleMcpRequest,
        JSON.stringify(
          {
            status: "created",
            secureUrl: result.secureUrl,
            expiresAt: result.expiresAt,
            burnAfterReading: result.burnAfterReading,
            sendAuthorized: false,
          },
          null,
          2,
        ),
      );
    }
    if (error) {
      return buildMcpLines(idleMcpRequest, undefined, error);
    }
    return buildMcpLines(idleMcpRequest);
  }, [error, idleCliCommand, idleMcpRequest, mode, result, t.devPlaygroundCliIdleOutput]);

  const run = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const note = await createPlaygroundNote({
        content,
        expiresIn,
        burnAfterReading,
        creationSource: mode,
      });
      setResult(note);
    } catch (err) {
      const raw = err instanceof Error ? err.message : t.devPlaygroundError;
      setError(formatPlaygroundError(raw, t.devPlaygroundLocalSqlError));
    } finally {
      setRunning(false);
    }
  };

  const copyUrl = async () => {
    if (!result?.secureUrl) return;
    try {
      await navigator.clipboard.writeText(result.secureUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t.devPlaygroundCopyFailed);
    }
  };

  const canRun = !running && !!content.trim();

  const submitCli = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!canRun) return;
    void run();
  };

  const mcpForm = (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-800 dark:bg-white/5 sm:p-6">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-950 dark:text-white">
          {t.devPlaygroundContentLabel}
        </span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-mono text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          spellCheck={false}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-950 dark:text-white">
            {t.devPlaygroundExpiresLabel}
          </span>
          <select
            value={expiresIn}
            onChange={(event) => setExpiresIn(event.target.value as PlaygroundExpiresIn)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          >
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
          </select>
        </label>

        <label className="flex items-end gap-2 pb-2.5 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={burnAfterReading}
            onChange={(event) => setBurnAfterReading(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          {t.devPlaygroundBurnLabel}
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void run()}
          disabled={running || !content.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {running ? t.devPlaygroundRunning : t.devPlaygroundRun}
        </button>
        {result ? (
          <button
            type="button"
            onClick={() => void copyUrl()}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
          >
            <Copy className="h-4 w-4" />
            {copied ? t.devPlaygroundCopied : t.devPlaygroundCopyUrl}
          </button>
        ) : null}
      </div>
    </div>
  );

  const cliTerminalFooter = (
    <form onSubmit={submitCli} className="space-y-3 text-gray-300">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <TerminalFieldLabel># secret</TerminalFieldLabel>
        <TerminalInput value={content} onChange={setContent} />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-1">
          <TerminalFieldLabel>--expire</TerminalFieldLabel>
          <TerminalSelect
            value={expiresIn}
            onChange={(value) => setExpiresIn(value as PlaygroundExpiresIn)}
          >
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
          </TerminalSelect>
        </span>
        <label className="flex cursor-pointer items-center gap-1.5 text-gray-400">
          <input
            type="checkbox"
            checked={burnAfterReading}
            onChange={(event) => setBurnAfterReading(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-gray-600 bg-transparent text-green-500 focus:ring-0 focus:ring-offset-0"
          />
          --burn
        </label>
      </div>
      <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 sm:flex">
        <TerminalAction type="submit" disabled={!canRun}>
          {running ? `${t.devPlaygroundRunning}…` : t.devPlaygroundRun}
        </TerminalAction>
        {result ? (
          <TerminalAction onClick={() => void copyUrl()}>
            {copied ? t.devPlaygroundCopied : t.devPlaygroundCopyUrl}
          </TerminalAction>
        ) : null}
      </div>
      <p className="hidden text-[10px] text-gray-600 sm:block">{t.devPlaygroundPressEnter}</p>
    </form>
  );

  const cliMobileActions = (
    <div className="mt-3 flex flex-wrap gap-3 sm:hidden">
      <PlaygroundPrimaryButton
        onClick={() => submitCli()}
        disabled={!canRun}
        running={running}
        runningLabel={t.devPlaygroundRunning}
        label={t.devPlaygroundRun}
      />
      {result ? (
        <button
          type="button"
          onClick={() => void copyUrl()}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
        >
          <Copy className="h-4 w-4" />
          {copied ? t.devPlaygroundCopied : t.devPlaygroundCopyUrl}
        </button>
      ) : null}
    </div>
  );

  return (
    <section id="playground" className="scroll-mt-28 mb-14 lg:mb-16">
      <h2 className="mb-2 text-2xl font-bold text-gray-950 dark:text-white">{t.devPlaygroundTitle}</h2>
      <p className="mb-6 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {mode === "cli" ? t.devPlaygroundCliIntro : t.devPlaygroundMcpIntro}
      </p>
      <p className="mb-6 max-w-3xl text-xs leading-relaxed text-amber-700 dark:text-amber-400/90">
        {t.devPlaygroundDisclaimer}
      </p>

      {mode === "cli" ? (
        <>
          <DeveloperTerminalFrame lines={terminalLines}>{cliTerminalFooter}</DeveloperTerminalFrame>
          {cliMobileActions}
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          {mcpForm}
          <DeveloperTerminalFrame lines={terminalLines} showChrome />
        </div>
      )}
    </section>
  );
}
