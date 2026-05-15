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
import { Button } from "@/components/ui/button";
import { getLocalAiGenerationGlyph, localAiAnalyzingPromptLabel } from "@/utils/localAiUxText";
import type { ModelLoadProgress } from "@/utils/clientLLM";
import { ThinkingBrainIcon } from "./ThinkingBrainIcon";
import { WritingPencilIcon } from "./WritingPencilIcon";

function localAiDialogPrimaryLine(progress: { text: string } | null): string {
  const text = progress?.text?.trim() ?? "";
  if (!text) return "Working...";
  if (text === "Ready to generate") return localAiAnalyzingPromptLabel();
  return text;
}

type CreateNoteDeferredDialogsProps = {
  aiProgress: ModelLoadProgress | null;
  cellularPreloadConfirmOpen: boolean;
  isGeneratingContent: boolean;
  onRetryFreeModelDownloadAfterReset: () => void;
  onStartFreeModelDownload: () => void;
  onUseTemplates: () => void;
  setCellularPreloadConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setShowTemplateOfferPrompt: Dispatch<SetStateAction<boolean>>;
  showTemplateOfferPrompt: boolean;
};

export function CreateNoteDeferredDialogs({
  aiProgress,
  cellularPreloadConfirmOpen,
  isGeneratingContent,
  onRetryFreeModelDownloadAfterReset,
  onStartFreeModelDownload,
  onUseTemplates,
  setCellularPreloadConfirmOpen,
  setShowTemplateOfferPrompt,
  showTemplateOfferPrompt,
}: CreateNoteDeferredDialogsProps) {
  const primaryLine = localAiDialogPrimaryLine(aiProgress);

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
                  Private AI runs entirely in your browser. Longer tasks and slower devices can take
                  noticeably more time than cloud APIs - that&apos;s normal for local generation.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cellularPreloadConfirmOpen}
        onOpenChange={setCellularPreloadConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download the on-device AI now?</AlertDialogTitle>
            <AlertDialogDescription>
              This connection looks like cellular or a slower network (for example 3G). The private
              AI model is a large download and can use a noticeable amount of mobile data. You can
              download it now, or cancel and use Wi-Fi first. If you skip, the model will still
              download when you run your first generation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setCellularPreloadConfirmOpen(false);
                onStartFreeModelDownload();
              }}
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTemplateOfferPrompt} onOpenChange={setShowTemplateOfferPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue with built-in templates</AlertDialogTitle>
            <AlertDialogDescription>
              On-device private AI is not running on this device right now. You can keep writing
              using the curated starters, or clear any partial model download and try loading private
              AI again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setShowTemplateOfferPrompt(false);
                onRetryFreeModelDownloadAfterReset();
              }}
            >
              Clear download and retry
            </Button>
            <AlertDialogAction className="w-full sm:w-auto" onClick={onUseTemplates}>
              Use templates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
