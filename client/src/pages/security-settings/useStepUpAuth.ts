import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { executeStepUp } from "./stepUp";
import { toastStepUpFailure } from "./stepUpNotifications";

/**
 * Returns a step-up function for “403 then retry” flows: runs WebAuthn step-up and shows
 * the standard verification toasts on failure. For proactive step-up (e.g. delete account),
 * call `executeStepUp()` directly and handle errors in the caller.
 */
export function useStepUpAuth() {
  const { toast } = useToast();
  const { t } = useLanguage();
  return useCallback(async () => {
    const r = await executeStepUp();
    if (r.ok) return true;
    toastStepUpFailure(toast, r, t);
    return false;
  }, [toast, t]);
}
