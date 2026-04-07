import type { StepUpResult } from "./stepUp";

type Toast = (props: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) => void;

export function toastStepUpFailure(toast: Toast, result: StepUpResult): void {
  if (result.ok) return;
  switch (result.reason) {
    case "not_supported":
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return;
    case "no_credential":
      toast({ title: "Step-up cancelled", description: "No credential returned." });
      return;
    case "no_passkey":
      toast({
        title: "Verification unavailable",
        description: "Set up a passkey first to perform this action.",
        variant: "destructive",
      });
      return;
    case "timeout":
      toast({
        title: "Verification timed out",
        description: "The passkey prompt timed out. Please try again.",
      });
      return;
    case "cancelled":
      toast({ title: "Verification cancelled", description: "You cancelled the passkey prompt." });
      return;
    default:
      toast({
        title: "Verification failed",
        description: result.reason === "unknown" ? result.message : "Please try again.",
        variant: "destructive",
      });
  }
}
