import { Check, Lock, Loader2, Upload } from "lucide-react";
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
  /** 0–100 progress within the current phase. */
  progress: number;
  title: string;
  detail?: string;
  footnote: string;
  /** Create-note flow: show encrypt → upload → finalize bars. Download uses a single bar. */
  mode?: "create" | "download";
  encryptLabel?: string;
  uploadLabel?: string;
  finalizeLabel?: string;
};

type AttachmentProgressDialogProps = {
  progress: AttachmentProgressState | null;
};

function clampPercent(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function phaseStepProgress(
  phase: AttachmentProgressPhase,
  progress: number,
): { encrypt: number; upload: number; finalize: number } {
  const current = clampPercent(progress);
  if (phase === "prepare" || phase === "encrypt") {
    return { encrypt: current, upload: 0, finalize: 0 };
  }
  if (phase === "upload") {
    return { encrypt: 100, upload: current, finalize: 0 };
  }
  if (phase === "finalize") {
    return { encrypt: 100, upload: 100, finalize: current };
  }
  return { encrypt: current, upload: 0, finalize: 0 };
}

function StepRow({
  label,
  value,
  active,
  done,
  icon,
}: {
  label: string;
  value: number;
  active: boolean;
  done: boolean;
  icon: "lock" | "upload" | "loader";
}) {
  return (
    <div className={`space-y-1.5 text-left ${active ? "opacity-100" : done ? "opacity-90" : "opacity-50"}`}>
      <div className="flex items-center gap-2">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ${
            done
              ? "bg-primary text-primary-foreground ring-primary/20"
              : active
                ? "bg-primary/10 text-primary ring-primary/15"
                : "bg-muted text-muted-foreground ring-border"
          }`}
          aria-hidden
        >
          {done ? (
            <Check className="h-3.5 w-3.5" />
          ) : icon === "lock" ? (
            <Lock className="h-3.5 w-3.5" />
          ) : icon === "upload" ? (
            <Upload className="h-3.5 w-3.5" />
          ) : (
            <Loader2 className={`h-3.5 w-3.5 ${active ? "animate-spin" : ""}`} />
          )}
        </span>
        <p
          className={`min-w-0 flex-1 text-sm leading-snug ${
            active ? "font-semibold text-foreground" : "font-medium text-foreground/80"
          }`}
        >
          {label}
        </p>
        <span className="tabular-nums text-xs text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full bg-primary ${
            active ? "transition-[width] duration-75 ease-linear" : "transition-all duration-200"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/** Non-dismissible progress dialog for attachment encrypt/upload or download/decrypt. */
export function AttachmentProgressDialog({ progress }: AttachmentProgressDialogProps) {
  const mode = progress?.mode ?? (progress?.phase === "decrypt" ? "download" : "create");
  const showLock = progress?.phase === "encrypt" || progress?.phase === "decrypt";
  const steps = progress
    ? phaseStepProgress(progress.phase, progress.progress)
    : { encrypt: 0, upload: 0, finalize: 0 };
  const phase = progress?.phase;

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
            <div className="space-y-4 pt-2 text-center">
              {progress?.detail ? (
                <p
                  className="mx-auto w-full min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm font-medium leading-snug text-foreground/90"
                  title={progress.detail}
                >
                  {progress.detail}
                </p>
              ) : null}

              {mode === "create" && progress?.encryptLabel && progress.uploadLabel && progress.finalizeLabel ? (
                <div className="mx-auto w-full max-w-xs space-y-3">
                  <StepRow
                    label={progress.encryptLabel}
                    value={steps.encrypt}
                    active={phase === "prepare" || phase === "encrypt"}
                    done={steps.encrypt >= 100 && phase !== "prepare" && phase !== "encrypt"}
                    icon="lock"
                  />
                  <StepRow
                    label={progress.uploadLabel}
                    value={steps.upload}
                    active={phase === "upload"}
                    done={steps.upload >= 100 && phase !== "upload"}
                    icon="upload"
                  />
                  <StepRow
                    label={progress.finalizeLabel}
                    value={steps.finalize}
                    active={phase === "finalize"}
                    done={steps.finalize >= 100}
                    icon="loader"
                  />
                </div>
              ) : (
                <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${clampPercent(progress?.progress ?? 0)}%`,
                    }}
                  />
                </div>
              )}

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
