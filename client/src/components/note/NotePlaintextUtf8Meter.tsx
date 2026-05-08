import React from "react";
import { utf8ByteLength } from "@shared/noteSizeLimits";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function NotePlaintextUtf8Meter({
  noteContent,
  maxBytes,
  className,
}: {
  noteContent: string;
  maxBytes: number;
  /** Merged onto the outer wrapper (e.g. `mb-0` when laid out in a row). */
  className?: string;
}) {
  const { t } = useLanguage();
  const used = utf8ByteLength(noteContent);
  const remaining = Math.max(0, maxBytes - used);
  const warn = remaining < 2 * 1024;
  return (
    <div
      className={cn(
        "mb-2 text-xs text-right",
        warn
          ? "text-amber-800 dark:text-amber-100/95"
          : "text-gray-500 dark:text-gray-400",
        className,
      )}
    >
      {(used / 1024).toFixed(1)} / {maxBytes / 1024} KB (UTF-8)
      <span className="tabular-nums">
        {" · "}
        {remaining >= 1024
          ? `${(remaining / 1024).toFixed(1)} KB ${t.bytesLeft}`
          : `${remaining.toLocaleString()} B ${t.bytesLeft}`}
      </span>
    </div>
  );
}
