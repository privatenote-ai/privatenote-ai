import React from "react";

export type TerminalLineVariant = "prompt" | "output" | "comment" | "json";

export type TerminalLine = {
  variant: TerminalLineVariant;
  text: string;
};

type DeveloperTerminalFrameProps = {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  /** Decorative macOS-style title bar — off by default for CLI. */
  showChrome?: boolean;
  children?: React.ReactNode;
};

const lineClass: Record<TerminalLineVariant, string> = {
  prompt: "text-gray-300",
  output: "text-green-400",
  comment: "text-gray-500",
  json: "text-sky-300/90",
};

export function DeveloperTerminalFrame({
  lines,
  title = "Terminal",
  className = "",
  showChrome = false,
  children,
}: DeveloperTerminalFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-800 bg-gray-950 ${className}`}
    >
      {showChrome ? (
        <div className="flex items-center gap-1.5 border-b border-gray-800 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden />
          <span className="ml-2 text-[10px] font-medium text-gray-500">{title}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-[0.8125rem]">
        {lines.map((line, index) => (
          <div key={`${line.variant}-${index}`} className={lineClass[line.variant]}>
            {line.text}
          </div>
        ))}
      </pre>
      {children ? (
        <div className="border-t border-gray-800 px-4 py-3 font-mono text-xs">{children}</div>
      ) : null}
    </div>
  );
}
