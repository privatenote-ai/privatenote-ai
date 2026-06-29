import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Cloud } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

type CloudAssistUpgradePanelProps = {
  t: Record<string, string>;
  tx: (key: string, fallback: string) => string;
  onRequestEnable: () => void;
};

export function CloudAssistUpgradePanel({ t, tx, onRequestEnable }: CloudAssistUpgradePanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 px-4 py-4 dark:border-amber-900/45 dark:bg-amber-950/20">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {tx("aiComposerNeedStrongerAi", "Need stronger writing?")}
            </p>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
              {tx(
                "aiComposerCloudAssistOptionalSubtitle",
                "Cloud Assist · not fully private",
              )}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestEnable}
            className="h-9 min-w-[11rem] border-amber-300/90 bg-white text-amber-950 shadow-sm hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/60"
          >
            <Cloud className="h-4 w-4" aria-hidden />
            {tx("aiComposerEnableCloudAssist", "Enable Cloud Assist")}
          </Button>

          <CollapsibleTrigger className="flex items-center rounded-md px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            {open ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" aria-hidden />
                {tx("aiComposerHideDetails", "Hide details")}
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" aria-hidden />
                {tx("aiComposerShowDetails", "Show details")}
              </>
            )}
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-4 space-y-2 border-t border-amber-200/60 pt-4 text-left text-xs leading-relaxed text-gray-600 dark:border-amber-900/40 dark:text-gray-400">
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
              {tx("aiComposerCloudAssistBenefitQuality", "Better writing quality")}
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
              {tx(
                "aiComposerCloudAssistBenefitFaster",
                "Faster responses (no model download)",
              )}
            </li>
          </ul>
          <p className="font-medium text-amber-900 dark:text-amber-200">
            {tx("aiComposerCloudAssistHowever", "However — not fully private:")}
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              {tx(
                "aiComposerNonPrivateBullet1",
                "Your prompt is sent to Cloudflare Workers AI (Google Gemma 4 26B) to generate a draft.",
              )}
            </li>
            <li>
              {tx(
                "aiComposerNonPrivateBullet2",
                "PrivateNote cannot encrypt or control that text while it is processed in the cloud.",
              )}
            </li>
            <li>
              {tx(
                "aiComposerNonPrivateBullet3",
                "Use Private AI on supported devices when you need writing that never leaves your browser.",
              )}
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
