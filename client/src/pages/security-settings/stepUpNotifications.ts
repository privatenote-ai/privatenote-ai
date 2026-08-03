import type { StepUpResult } from "./stepUp";
import type { Translations } from "@/utils/translations/types";

type Toast = (props: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) => void;

export function toastStepUpFailure(toast: Toast, result: StepUpResult, t: Translations): void {
  if (result.ok) return;
  switch (result.reason) {
    case "not_supported":
      toast({ title: t.authStepUpNotSupportedTitle, description: t.authStepUpNotSupportedDesc });
      return;
    case "no_credential":
      toast({ title: t.authStepUpCancelledTitle, description: t.authStepUpNoCredentialDesc });
      return;
    case "no_passkey":
      toast({
        title: t.authStepUpUnavailableTitle,
        description: t.authStepUpNoPasskeyDesc,
        variant: "destructive",
      });
      return;
    case "timeout":
      toast({
        title: t.authStepUpTimeoutTitle,
        description: t.authStepUpTimeoutDesc,
      });
      return;
    case "cancelled":
      toast({ title: t.authStepUpUserCancelledTitle, description: t.authStepUpUserCancelledDesc });
      return;
    default:
      toast({
        title: t.authStepUpFailedTitle,
        description: result.reason === "unknown" ? result.message : t.authStepUpTryAgain,
        variant: "destructive",
      });
  }
}
