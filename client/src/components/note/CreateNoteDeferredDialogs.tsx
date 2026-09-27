import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { localizedPath } from "@/utils/localizedPath";
import {
  formatNoteFileSize,
  noteFileLimitBytesForAccount,
} from "@shared/noteFileLimits";
import { getLocalAiGenerationGlyph, localAiAnalyzingPromptLabel, isLocalAiReadyToGenerateProgress, localAiWorkingLabel } from "@/utils/localAiUxText";
import type { ModelLoadProgress } from "@/utils/clientLLM";
import { ThinkingBrainIcon } from "./ThinkingBrainIcon";
import { WritingPencilIcon } from "./WritingPencilIcon";
import { AttachmentProgressDialog } from "./AttachmentProgressDialog";

function localAiDialogPrimaryLine(progress: { text: string } | null): string {
  const text = progress?.text?.trim() ?? "";
  if (!text) return localAiWorkingLabel();
  if (isLocalAiReadyToGenerateProgress(text)) return localAiAnalyzingPromptLabel();
  return text;
}

export type AttachmentUploadUiProgress = {
  phase: "prepare" | "encrypt" | "upload" | "finalize";
  progress: number;
  detail?: string;
};

export type FileSizeUpgradePlan = "personal_premium" | "business_premium";

type CreateNoteDeferredDialogsProps = {
  aiProgress: ModelLoadProgress | null;
  attachmentProgress: AttachmentUploadUiProgress | null;
  cellularPreloadConfirmOpen: boolean;
  fileSizeUpgradePlan: FileSizeUpgradePlan | null;
  currentFileLimitBytes: number;
  isGeneratingContent: boolean;
  onStartFreeModelDownload: () => void;
  onUseCloudAssist: () => void;
  onWriteWithoutAi: () => void;
  setCellularPreloadConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setFileSizeUpgradePlan: Dispatch<SetStateAction<FileSizeUpgradePlan | null>>;
  setShowTemplateOfferPrompt: Dispatch<SetStateAction<boolean>>;
  showTemplateOfferPrompt: boolean;
};

export function CreateNoteDeferredDialogs({
  aiProgress,
  attachmentProgress,
  cellularPreloadConfirmOpen,
  fileSizeUpgradePlan,
  currentFileLimitBytes,
  isGeneratingContent,
  onStartFreeModelDownload,
  onUseCloudAssist,
  onWriteWithoutAi: _onWriteWithoutAi,
  setCellularPreloadConfirmOpen,
  setFileSizeUpgradePlan,
  setShowTemplateOfferPrompt,
  showTemplateOfferPrompt,
}: CreateNoteDeferredDialogsProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const primaryLine = localAiDialogPrimaryLine(aiProgress);

  const attachmentTitle =
    attachmentProgress?.phase === "prepare"
      ? t.attachmentProgressPreparing
      : attachmentProgress?.phase === "finalize"
        ? t.attachmentProgressFinalizing
        : attachmentProgress?.phase === "upload"
          ? t.attachmentProgressUploading
          : t.attachmentProgressEncrypting;

  const upgradeIsStarter = fileSizeUpgradePlan === "personal_premium";
  const currentLimitLabel = formatNoteFileSize(currentFileLimitBytes);
  const nextLimitLabel = formatNoteFileSize(
    noteFileLimitBytesForAccount(fileSizeUpgradePlan ?? "personal_premium"),
  );

  const startFileSizeUpgradeCheckout = async () => {
    if (!fileSizeUpgradePlan || checkoutBusy) return;
    if (!user) {
      const returnBase = localizedPath("/premium", language);
      const returnTo = `${returnBase}?checkout=${fileSizeUpgradePlan}&interval=year`;
      const signIn = localizedPath("/auth/sign-in", language);
      window.location.assign(`${signIn}?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setCheckoutBusy(true);
    try {
      const checkout = await apiRequest<{ url: string }>(
        "/api/auth/billing/checkout",
        "POST",
        { plan: fileSizeUpgradePlan, interval: "year" },
      );
      window.location.assign(checkout.url);
    } catch (error) {
      const alreadySubscribed =
        error instanceof Error &&
        (/409/.test(error.message) || /subscription_already_exists/.test(String(error)));
      if (alreadySubscribed) {
        try {
          const portal = await apiRequest<{ url: string }>(
            "/api/auth/billing/portal",
            "POST",
          );
          window.location.assign(portal.url);
          return;
        } catch {
          // Fall through to toast.
        }
      }
      toast({
        title: t.fileSizeUpgradeCheckoutFailedTitle,
        description: t.fileSizeUpgradeCheckoutFailedDesc,
        variant: "destructive",
      });
      setCheckoutBusy(false);
    }
  };

  return (
    <>
      <Dialog open={isGeneratingContent}>
        <DialogContent
          className="[&>button]:hidden sm:max-w-md border-primary/15"
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              {getLocalAiGenerationGlyph(primaryLine) === "brain" ? (
                <ThinkingBrainIcon sizeClassName="h-14 w-14" />
              ) : (
                <WritingPencilIcon sizeClassName="h-14 w-14" />
              )}
            </div>
            <DialogTitle className="text-center text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
              {primaryLine}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-center">
                {aiProgress?.detail ? (
                  <p className="text-sm font-medium leading-snug text-foreground/90">{aiProgress.detail}</p>
                ) : null}
                <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        Math.min(100, Math.max(0, aiProgress?.progress ?? 0)),
                      )}%`,
                    }}
                  />
                </div>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground/85">
                  {t.aiComposerLocalAiDialogFootnote}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AttachmentProgressDialog
        progress={
          attachmentProgress
            ? {
                phase: attachmentProgress.phase,
                progress: attachmentProgress.progress,
                title: attachmentTitle,
                detail: attachmentProgress.detail,
                footnote: t.attachmentProgressFootnote,
                mode: "create",
                encryptLabel: t.attachmentProgressEncrypting,
                uploadLabel: t.attachmentProgressUploading,
                finalizeLabel: t.attachmentProgressFinalizing,
              }
            : null
        }
      />

      <Dialog
        open={fileSizeUpgradePlan !== null}
        onOpenChange={(open) => {
          if (!open && !checkoutBusy) setFileSizeUpgradePlan(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {upgradeIsStarter ? t.fileSizeUpgradeTitleStarter : t.fileSizeUpgradeTitleBusiness}
            </DialogTitle>
            <DialogDescription>
              {(upgradeIsStarter
                ? t.fileSizeUpgradeDescriptionStarter
                : t.fileSizeUpgradeDescriptionBusiness
              )
                .replace("{currentLimit}", currentLimitLabel)
                .replace("{nextLimit}", nextLimitLabel)}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100">
            {(upgradeIsStarter
              ? t.fileSizeUpgradeHighlightStarter
              : t.fileSizeUpgradeHighlightBusiness
            ).replace("{nextLimit}", nextLimitLabel)}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={checkoutBusy}
              onClick={() => setFileSizeUpgradePlan(null)}
            >
              {t.cancel}
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto sm:min-w-[11rem]"
              disabled={checkoutBusy}
              onClick={() => {
                void startFileSizeUpgradeCheckout();
              }}
            >
              {checkoutBusy
                ? t.fileSizeUpgradeOpeningCheckout
                : upgradeIsStarter
                  ? t.fileSizeUpgradeCtaStarter
                  : t.fileSizeUpgradeCtaBusiness}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cellularPreloadConfirmOpen}
        onOpenChange={setCellularPreloadConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.aiComposerCellularDownloadTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.aiComposerCellularDownloadBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.aiComposerDialogNotNow}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCellularPreloadConfirmOpen(false);
                onStartFreeModelDownload();
              }}
            >
              {t.aiComposerDialogDownload}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTemplateOfferPrompt} onOpenChange={setShowTemplateOfferPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.aiComposerLocalAiUnavailableDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {t.aiComposerLocalAiUnavailableIntro}{" "}
                  <span className="font-semibold text-foreground">{t.aiComposerEnableCloudAssist}</span>{" "}
                  {t.aiComposerLocalAiUnavailableRunsOn}{" "}
                  <span className="font-semibold text-foreground">{t.aiComposerLocalAiUnavailableModel}</span>{" "}
                  {t.aiComposerLocalAiUnavailableVia}
                </p>
                <p>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {t.aiComposerLocalAiUnavailableNotPrivateLabel}
                  </span>{" "}
                  {t.aiComposerLocalAiUnavailableNotPrivateBody}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="w-full sm:w-auto">{t.aiComposerDialogNotNow}</AlertDialogCancel>
            <AlertDialogAction
              className="w-full bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-600 sm:w-auto"
              onClick={onUseCloudAssist}
            >
              {t.aiComposerEnableCloudAssistLink}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
