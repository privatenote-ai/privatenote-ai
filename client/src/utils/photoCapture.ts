export type CameraFacing = "user" | "environment";

const PHOTO_NAME_RE = /^photo-\d{8}-\d{6}\.(jpe?g|png|webp)$/i;

export function isCameraCaptureSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function"
  );
}

export function toggleCameraFacing(facing: CameraFacing): CameraFacing {
  return facing === "user" ? "environment" : "user";
}

export function videoConstraintsForFacing(facing: CameraFacing): MediaTrackConstraints {
  return {
    facingMode: { ideal: facing },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };
}

const CAMERA_CONSTRAINT_FALLBACK_ERRORS = new Set([
  "OverconstrainedError",
  "ConstraintNotSatisfiedError",
]);

/** Retry getUserMedia without facing/size hints only when constraints were the problem. */
export function shouldFallbackToBasicVideoConstraints(error: unknown): boolean {
  const name =
    error && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : "";
  return CAMERA_CONSTRAINT_FALLBACK_ERRORS.has(name);
}

const HAVE_METADATA = 1;

function waitForVideoMetadata(video: HTMLVideoElement, timeoutMs: number): Promise<void> {
  if (video.readyState >= HAVE_METADATA) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadedmetadata", finish);
      globalThis.clearTimeout(timer);
      resolve();
    };
    const timer = globalThis.setTimeout(finish, timeoutMs);
    video.addEventListener("loadedmetadata", finish);
  });
}

/** Bind a live camera stream and start playback once metadata is available. */
export async function attachStreamToVideoElement(
  video: HTMLVideoElement,
  stream: MediaStream,
  options?: { metadataTimeoutMs?: number },
): Promise<void> {
  if (video.srcObject !== stream) {
    video.srcObject = stream;
  }
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");

  if (video.readyState < HAVE_METADATA) {
    await waitForVideoMetadata(video, options?.metadataTimeoutMs ?? 2500);
  }

  try {
    await video.play();
  } catch {
    // Autoplay can fail if the tab is backgrounded; the stream stays attached.
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function buildPhotoFileName(at = new Date(), extension = "jpg"): string {
  const stamp = [
    at.getFullYear(),
    pad2(at.getMonth() + 1),
    pad2(at.getDate()),
    "-",
    pad2(at.getHours()),
    pad2(at.getMinutes()),
    pad2(at.getSeconds()),
  ].join("");
  const safeExt = extension.replace(/^\./, "").toLowerCase() || "jpg";
  return `photo-${stamp}.${safeExt}`;
}

export function extensionForImageMime(mimeType: string): string {
  const normalized = mimeType.trim().toLowerCase();
  if (normalized === "image/png") return "png";
  if (normalized === "image/webp") return "webp";
  return "jpg";
}

export function createPhotoFile(blob: Blob, mimeType = "image/jpeg"): File {
  const type = blob.type || mimeType || "image/jpeg";
  const name = buildPhotoFileName(new Date(), extensionForImageMime(type));
  return new File([blob], name, { type, lastModified: Date.now() });
}

export function isCapturedPhotoFile(file: File | null | undefined): boolean {
  if (!file) return false;
  const type = file.type.toLowerCase();
  return PHOTO_NAME_RE.test(file.name) && (type.startsWith("image/") || type === "");
}

export function countVideoInputDevices(devices: ReadonlyArray<Pick<MediaDeviceInfo, "kind">>): number {
  return devices.filter((device) => device.kind === "videoinput").length;
}

export async function captureJpegFromVideo(
  video: HTMLVideoElement,
  quality = 0.9,
): Promise<Blob> {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (width <= 0 || height <= 0) {
    throw new Error("Video frame is not ready");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not capture photo");
  }
  context.drawImage(video, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((next) => resolve(next), "image/jpeg", quality);
  });
  if (blob && blob.size > 0) return blob;

  const png = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((next) => resolve(next), "image/png");
  });
  if (png && png.size > 0) return png;
  throw new Error("Could not capture photo");
}
