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
  onStartFreeModelDownload: () => void;
  onUseCloudAssist: () => void;
  onWriteWithoutAi: () => void;
  setCellularPreloadConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setShowTemplateOfferPrompt: Dispatch<SetStateAction<boolean>>;
  showTemplateOfferPrompt: boolean;
};

export function CreateNoteDeferredDialogs({
  aiProgress,
  cellularPreloadConfirmOpen,
  isGeneratingContent,
  onStartFreeModelDownload,
  onUseCloudAssist,
  onWriteWithoutAi,
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
            <AlertDialogTitle>Private AI isn&apos;t available on this device</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  On-device AI couldn't start on this device. You can use{" "}
                  <span className="font-semibold text-foreground">Cloud Assist</span> instead —
                  it runs on <span className="font-semibold text-foreground">Google Gemma 4 26B</span> via Cloudflare Workers AI.
                </p>
                <p>
                  <span className="font-semibold text-red-600 dark:text-red-400">Not fully private:</span>{" "}
                  your prompt is sent to the cloud for processing.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="w-full sm:w-auto">
              Not now
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-600 sm:w-auto"
              onClick={onUseCloudAssist}
            >
              Enable Cloud Assist ›
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
