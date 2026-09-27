import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import type { BillingPortalFlow } from "@/utils/billingPortalAccess";

export function useBillingPortal() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const [billingPortalFlow, setBillingPortalFlow] = useState<BillingPortalFlow | null>(null);

  const openBillingPortal = useCallback(
    async (flow: BillingPortalFlow = "manage") => {
      setBillingPortalFlow(flow);
      try {
        const result = await apiRequest<{ ok: boolean; url?: string }>(
          "/api/auth/billing/portal",
          "POST",
          { flow },
        );
        if (result.url) {
          window.location.assign(result.url);
          return;
        }
        throw new Error("Missing portal URL");
      } catch {
        toast({
          title: tx("authBillingPortalFailedTitle", "Billing portal unavailable"),
          description: tx(
            "authBillingPortalFailedDesc",
            "Could not open billing management. Please try again later.",
          ),
          variant: "destructive",
        });
        setBillingPortalFlow(null);
      }
    },
    [t, toast],
  );

  return { billingPortalFlow, openBillingPortal };
}
