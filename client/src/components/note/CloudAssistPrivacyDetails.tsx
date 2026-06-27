import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type CloudAssistPrivacyDetailsProps = {
  tx: (key: string, fallback: string) => string;
};

export function CloudAssistPrivacyDetails({ tx }: CloudAssistPrivacyDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
        {open ? (
          <>
            <ChevronUp className="h-3 w-3" aria-hidden />
            {tx("aiComposerHideDetails", "Hide details")}
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" aria-hidden />
            {tx("aiComposerShowDetails", "Show details")}
          </>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
        <p>
          {tx(
            "aiComposerCloudAssistDetailLead",
            "Cloud Assist sends your prompt to Cloudflare Workers AI (Meta Llama 3.2 3B). It is not fully private.",
          )}
        </p>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            {tx(
              "aiComposerNonPrivateBullet1",
              "Your prompt is sent to Cloudflare Workers AI (Meta Llama) to generate a draft.",
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
  );
}
