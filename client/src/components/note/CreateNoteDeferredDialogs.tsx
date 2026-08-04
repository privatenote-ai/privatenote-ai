import type { Dispatch, SetStateAction } from "react";
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
import { useLanguage } from "@/context/LanguageContext";
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

type CreateNoteDeferredDialogsProps = {
  aiProgress: ModelLoadProgress | null;
  attachmentProgress: AttachmentUploadUiProgress | null;
  cellularPreloadConfirmOpen: boolean;
  isGeneratingContent: boolean;
  onStartFreeModelDownload: () => void;
  onUseCloudAssist: () => void;
  onWriteWithoutAi: () => void;
  setCellularPreloadConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setShowTemplateOfferPrompt: Dispatch<SetStateAction<boolean>>;
  showTemplateOfferPrompt: boolean;
};

export function CreateNoteDeferredDialogs({
  aiProgress,
  attachmentProgress,
  cellularPreloadConfirmOpen,
  isGeneratingContent,
  onStartFreeModelDownload,
  onUseCloudAssist,
  onWriteWithoutAi: _onWriteWithoutAi,
  setCellularPreloadConfirmOpen,
  setShowTemplateOfferPrompt,
  showTemplateOfferPrompt,
}: CreateNoteDeferredDialogsProps) {
  const { t } = useLanguage();
  const primaryLine = localAiDialogPrimaryLine(aiProgress);

  const attachmentTitle =
    attachmentProgress?.phase === "prepare"
      ? t.attachmentProgressPreparing
      : attachmentProgress?.phase === "upload"
        ? t.attachmentProgressUploading
        : attachmentProgress?.phase === "finalize"
          ? t.attachmentProgressFinalizing
          : t.attachmentProgressEncrypting;

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
