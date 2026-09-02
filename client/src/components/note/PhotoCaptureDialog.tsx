import { useEffect, useRef, useState } from "react";
import { Camera, SwitchCamera, RotateCcw, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { formatNoteFileSize } from "@shared/noteFileLimits";
import {
  type CameraFacing,
  captureJpegFromVideo,
  createPhotoFile,
  isCameraCaptureSupported,
  toggleCameraFacing,
  videoConstraintsForFacing,
} from "@/utils/photoCapture";

type CapturePhase = "live" | "preview";

type PhotoCaptureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCaptured: (file: File) => void;
  maxBytes: number;
};

function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

export function PhotoCaptureDialog({
  open,
  onOpenChange,
  onCaptured,
  maxBytes,
}: PhotoCaptureDialogProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<CapturePhase>("live");
  const [facing, setFacing] = useState<CameraFacing>("environment");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedBlobRef = useRef<Blob | null>(null);
  const facingRef = useRef<CameraFacing>("environment");
  const startGenerationRef = useRef(0);

  const clearPreview = () => {
    capturedBlobRef.current = null;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const stopCamera = () => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const resetCaptureState = () => {
    startGenerationRef.current += 1;
    stopCamera();
    clearPreview();
    setPhase("live");
    setErrorMessage(null);
    setIsStarting(false);
    setIsCapturing(false);
    setCameraReady(false);
    facingRef.current = "environment";
    setFacing("environment");
  };

  const startCamera = async (nextFacing: CameraFacing) => {
    if (!isCameraCaptureSupported()) {
      setErrorMessage(
        t.takePhotoUnsupported ?? "Camera capture is not supported in this browser.",
      );
      return;
    }

    const generation = ++startGenerationRef.current;
    setIsStarting(true);
    setCameraReady(false);
    setErrorMessage(null);
    stopCamera();

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: videoConstraintsForFacing(nextFacing),
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
      }
      if (generation !== startGenerationRef.current) {
        stopMediaStream(stream);
        return;
      }

      streamRef.current = stream;
      facingRef.current = nextFacing;
      setFacing(nextFacing);
      setPhase("live");
      setCameraReady(true);

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        await video.play().catch(() => {
          // Autoplay can fail if the tab is backgrounded; the user can still capture after play.
        });
      }
    } catch {
      if (generation !== startGenerationRef.current) return;
      setErrorMessage(
        t.takePhotoDenied ??
          "Camera access is required to take a photo. Allow access and try again.",
      );
      stopCamera();
    } finally {
      if (generation === startGenerationRef.current) {
        setIsStarting(false);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      resetCaptureState();
      return;
    }
    void startCamera(facingRef.current);
    return () => {
      startGenerationRef.current += 1;
      stopCamera();
      clearPreview();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start only when the dialog opens/closes
  }, [open]);

  const handleSwitchCamera = () => {
    if (isStarting || phase !== "live") return;
    void startCamera(toggleCameraFacing(facingRef.current));
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || isCapturing || isStarting) return;
    setIsCapturing(true);
    setErrorMessage(null);
    try {
      const blob = await captureJpegFromVideo(video);
      if (blob.size <= 0) {
        setErrorMessage(t.takePhotoEmpty ?? "No photo was captured. Try again.");
        return;
      }
      if (blob.size > maxBytes) {
        setErrorMessage(
          (t.fileTooLargeDescription ?? "Maximum file size is {limit} for your account.").replace(
            "{limit}",
            formatNoteFileSize(maxBytes),
          ),
        );
        return;
      }
      capturedBlobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      stopCamera();
      setPhase("preview");
    } catch {
      setErrorMessage(t.takePhotoFailed ?? "Could not take a photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUsePhoto = () => {
    const blob = capturedBlobRef.current;
    if (!blob) return;
    onCaptured(createPhotoFile(blob));
    onOpenChange(false);
  };

  const handleRetake = () => {
    clearPreview();
    setPhase("live");
    void startCamera(facingRef.current);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetCaptureState();
    }
    onOpenChange(next);
  };

  const switchLabel =
    facing === "environment"
      ? (t.takePhotoSwitchToFront ?? "Switch to front camera")
      : (t.takePhotoSwitchToBack ?? "Switch to back camera");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-0.75rem)] w-[calc(100%-0.75rem)] flex-col gap-3 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom)+4.25rem))] sm:max-h-[min(90vh,40rem)] sm:w-full sm:max-w-lg sm:p-6 sm:pb-6">
        <DialogHeader>
          <DialogTitle>{t.takePhotoTitle ?? "Take a photo"}</DialogTitle>
          <DialogDescription className="line-clamp-2 sm:line-clamp-none">
            {t.takePhotoDescription ??
              "Capture a private photo. It is encrypted in your browser like a file attachment before upload."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <div className="relative mx-auto h-[min(62svh,26rem)] w-auto max-w-full aspect-[3/4] overflow-hidden rounded-lg bg-black sm:h-[min(68vh,28rem)]">
            <video
              ref={videoRef}
              className={`h-full w-full object-cover${
                facing === "user" ? " -scale-x-100" : ""
              }${phase === "preview" ? " hidden" : ""}`}
              playsInline
              muted
              autoPlay
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            {phase === "live" ? (
              <button
                type="button"
                onClick={handleSwitchCamera}
                disabled={isStarting}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
                aria-label={switchLabel}
                title={switchLabel}
              >
                <SwitchCamera className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
            {phase === "live" ? (
              <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white/90">
                {facing === "user"
                  ? (t.takePhotoFrontCamera ?? "Front camera")
                  : (t.takePhotoBackCamera ?? "Back camera")}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <DialogFooter className="sticky bottom-0 z-10 mt-auto gap-2 bg-background pt-2 sm:static sm:justify-center sm:space-x-0 sm:gap-2">
          {phase === "live" ? (
            <Button
              type="button"
              onClick={() => void handleCapture()}
              disabled={isStarting || isCapturing || !cameraReady}
            >
              <Camera className="mr-1.5 h-4 w-4" aria-hidden />
              {isStarting
                ? (t.takePhotoStarting ?? "Starting camera…")
                : (t.takePhotoCapture ?? "Capture")}
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleRetake}>
                <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden />
                {t.takePhotoRetake ?? "Retake"}
              </Button>
              <Button type="button" onClick={handleUsePhoto}>
                <Check className="mr-1.5 h-4 w-4" aria-hidden />
                {t.takePhotoUse ?? "Use photo"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
