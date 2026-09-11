import { useEffect, useRef, useState } from "react";
import { Camera, SwitchCamera, RotateCcw, Check, Crop } from "lucide-react";
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
  attachStreamToVideoElement,
  captureJpegFromVideo,
  createPhotoFile,
  isCameraCaptureSupported,
  shouldFallbackToBasicVideoConstraints,
  toggleCameraFacing,
  videoConstraintsForFacing,
} from "@/utils/photoCapture";
import {
  FULL_IMAGE_CROP,
  cropImageBlob,
  type ImageCropRect,
} from "@/utils/photoCrop";
import { PhotoCropEditor } from "@/components/note/PhotoCropEditor";

/** Slight inset so crop handles are easy to grab after capture. */
const DEFAULT_CAPTURE_CROP: ImageCropRect = {
  x: 0.04,
  y: 0.04,
  width: 0.92,
  height: 0.92,
};

type CapturePhase = "live" | "crop";

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

function revokeUrl(url: string | null): void {
  if (url) URL.revokeObjectURL(url);
}

const PERMISSION_DISMISS_GRACE_MS = 1000;

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
  const [crop, setCrop] = useState<ImageCropRect>(FULL_IMAGE_CROP);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedBlobRef = useRef<Blob | null>(null);
  const facingRef = useRef<CameraFacing>("environment");
  const startGenerationRef = useRef(0);
  const suppressDismissUntilRef = useRef(0);

  const clearPreview = () => {
    capturedBlobRef.current = null;
    setCrop(FULL_IMAGE_CROP);
    setPreviewUrl((prev) => {
      revokeUrl(prev);
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
    setIsBusy(false);
    setCameraReady(false);
    facingRef.current = "environment";
    setFacing("environment");
  };

  const armDismissSuppression = () => {
    suppressDismissUntilRef.current = Date.now() + PERMISSION_DISMISS_GRACE_MS;
  };

  const handleDismissAttempt = (event: { preventDefault: () => void }) => {
    if (isStarting || Date.now() < suppressDismissUntilRef.current) {
      event.preventDefault();
    }
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
      } catch (error) {
        if (!shouldFallbackToBasicVideoConstraints(error)) throw error;
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
      }
      armDismissSuppression();
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
        await attachStreamToVideoElement(video, stream);
      }
    } catch {
      armDismissSuppression();
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
      setCrop(DEFAULT_CAPTURE_CROP);
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        revokeUrl(prev);
        return url;
      });
      stopCamera();
      setPhase("crop");
    } catch {
      setErrorMessage(t.takePhotoFailed ?? "Could not take a photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const finishWithBlob = (blob: Blob) => {
    if (blob.size > maxBytes) {
      setErrorMessage(
        (t.fileTooLargeDescription ?? "Maximum file size is {limit} for your account.").replace(
          "{limit}",
          formatNoteFileSize(maxBytes),
        ),
      );
      return false;
    }
    onCaptured(createPhotoFile(blob));
    onOpenChange(false);
    return true;
  };

  const handleUsePhoto = async () => {
    const blob = capturedBlobRef.current;
    if (!blob || isBusy) return;
    setIsBusy(true);
    setErrorMessage(null);
    try {
      const cropped = await cropImageBlob(blob, crop);
      if (cropped.size <= 0) {
        setErrorMessage(t.takePhotoCropFailed ?? "Could not crop the photo. Try again.");
        return;
      }
      finishWithBlob(cropped);
    } catch {
      setErrorMessage(t.takePhotoCropFailed ?? "Could not crop the photo. Try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRetake = () => {
    clearPreview();
    setPhase("live");
    void startCamera(facingRef.current);
  };

  const handleResetCrop = () => {
    setCrop(FULL_IMAGE_CROP);
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

  const title =
    phase === "crop"
      ? (t.takePhotoCropTitle ?? "Crop photo")
      : (t.takePhotoTitle ?? "Take a photo");

  const description =
    phase === "crop"
      ? (t.takePhotoCropDescription ??
        "Drag the frame to remove faces, badges, or other identifying details before the photo is encrypted.")
      : (t.takePhotoDescription ??
        "Capture a private photo. It is encrypted in your browser like a file attachment before upload.");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-[calc(100svh-0.75rem)] w-[calc(100%-0.75rem)] flex-col gap-3 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom)+4.25rem))] sm:max-h-[min(90vh,40rem)] sm:w-full sm:max-w-lg sm:p-6 sm:pb-6"
        onPointerDownOutside={handleDismissAttempt}
        onInteractOutside={handleDismissAttempt}
        onFocusOutside={handleDismissAttempt}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="line-clamp-2 sm:line-clamp-none">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 flex flex-col items-center gap-3 sm:mt-0">
          <div className="relative mx-auto h-[min(62svh,26rem)] w-auto max-w-full aspect-[3/4] overflow-hidden rounded-lg bg-black sm:h-[min(68vh,28rem)]">
            <video
              ref={videoRef}
              className={`h-full w-full object-cover${
                facing === "user" ? " -scale-x-100" : ""
              }${phase !== "live" ? " hidden" : ""}`}
              playsInline
              muted
              autoPlay
            />
            {phase === "crop" && previewUrl ? (
              <PhotoCropEditor
                imageUrl={previewUrl}
                crop={crop}
                onCropChange={setCrop}
                ariaLabel={t.takePhotoCropTitle ?? "Crop photo"}
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

        <DialogFooter className="z-10 mt-auto flex-wrap gap-2 bg-background pt-5 sm:static sm:justify-center sm:space-x-0 sm:gap-2 sm:pt-2">
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
          ) : null}

          {phase === "crop" ? (
            <>
              <Button type="button" variant="outline" onClick={handleRetake} disabled={isBusy}>
                <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden />
                {t.takePhotoRetake ?? "Retake"}
              </Button>
              <Button type="button" variant="outline" onClick={handleResetCrop} disabled={isBusy}>
                <Crop className="mr-1.5 h-4 w-4" aria-hidden />
                {t.takePhotoCropReset ?? "Reset crop"}
              </Button>
              <Button type="button" onClick={() => void handleUsePhoto()} disabled={isBusy}>
                <Check className="mr-1.5 h-4 w-4" aria-hidden />
                {isBusy
                  ? (t.takePhotoCropping ?? "Cropping…")
                  : (t.takePhotoUse ?? "Use photo")}
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
