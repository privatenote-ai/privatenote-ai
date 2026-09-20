import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { trackNamedEvent } from "@/utils/productAnalytics";
import type { AnalyticsNamedEvent } from "@shared/analyticsEvents";

type CopyableCodeBlockProps = {
  code: string;
  className?: string;
  compact?: boolean;
  analyticsEvent?: AnalyticsNamedEvent;
};

export function CopyableCodeBlock({
  code,
  className = "",
  compact = false,
  analyticsEvent,
}: CopyableCodeBlockProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (analyticsEvent) trackNamedEvent(analyticsEvent);
      toast({ title: t.copiedToClipboard });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: t.copyFailed, variant: "destructive" });
    }
  };

  const padding = compact ? "p-4" : "p-6";
  const textSize = compact ? "text-xs sm:text-sm" : "text-sm";

  return (
    <div className={`relative overflow-x-auto rounded-xl bg-gray-950 ${padding} ${className}`.trim()}>
      <button
        type="button"
        onClick={copyCode}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        aria-label={t.devCopyCode}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            {t.copied}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {t.devCopyCode}
          </>
        )}
      </button>
      <pre className={`whitespace-pre-wrap font-mono leading-relaxed text-green-400 ${textSize} pr-20`}>
        {code}
      </pre>
    </div>
  );
}
