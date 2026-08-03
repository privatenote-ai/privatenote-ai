import { Lock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AttachmentProgressPhase = "prepare" | "encrypt" | "decrypt" | "upload" | "finalize";

export type AttachmentProgressState = {
  phase: AttachmentProgressPhase;
  progress: number;
  title: string;
  detail?: string;
  footnote: string;
};

type AttachmentProgressDialogProps = {
  progress: AttachmentProgressState | null;
};

/** Non-dismissible progress dialog for attachment encrypt/upload or download/decrypt. */
export function AttachmentProgressDialog({ progress }: AttachmentProgressDialogProps) {
  const showLock = progress?.phase === "encrypt" || progress?.phase === "decrypt";

  return (
    <Dialog open={Boolean(progress)}>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md overflow-hidden border-primary/15"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
            {showLock ? (
              <Lock className="h-8 w-8" aria-hidden />
            ) : (
              <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            )}
          </div>
          <DialogTitle className="text-center text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
            {progress?.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-2 text-center">
              {progress?.detail ? (
                <p
                  className="mx-auto w-full min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm font-medium leading-snug text-foreground/90"
                  title={progress.detail}
                >
                  {progress.detail}
                </p>
              ) : null}
              <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.round(Math.min(100, Math.max(0, progress?.progress ?? 0)))}%`,
                  }}
                />
              </div>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground/85">
                {progress?.footnote}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
