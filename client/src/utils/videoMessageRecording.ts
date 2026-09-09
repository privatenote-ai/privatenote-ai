import type { CameraFacing } from "./photoCapture";
import { videoConstraintsForFacing } from "./photoCapture";

const VIDEO_MESSAGE_NAME_RE = /^video-message(?:[-_].+)?\.(webm|mp4|m4v|mov)$/i;
const VIDEO_FILE_EXTENSIONS = new Set(["webm", "mp4", "m4v", "mov"]);

const VIDEO_RECORDER_CANDIDATES: ReadonlyArray<{ mimeType: string; extension: string }> = [
  { mimeType: "video/mp4", extension: "mp4" },
  { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
  { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
  { mimeType: "video/webm", extension: "webm" },
];

export type RecordCaptureMode = "audio" | "video";

export type VideoRecordingStrategy = {
  mimeType: string;
  extension: string;
};

export function isVideoRecordingSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined"
  );
}

export function pickVideoRecordingStrategy(): VideoRecordingStrategy | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const candidate of VIDEO_RECORDER_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return { mimeType: candidate.mimeType, extension: candidate.extension };
    }
  }
  return { mimeType: "", extension: "webm" };
}

export function videoAndAudioConstraints(facing: CameraFacing): MediaStreamConstraints {
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
    video: videoConstraintsForFacing(facing),
  };
}

/**
 * Target bitrate so a recording near the duration cap stays under the plan file limit.
 * Leaves headroom for container overhead.
 */
export function pickVideoBitsPerSecond(maxBytes: number, maxDurationSeconds: number): number {
  const duration = Math.max(1, maxDurationSeconds);
  const budgetBitsPerSecond = (maxBytes * 8 * 0.7) / duration;
  return Math.max(180_000, Math.min(2_500_000, Math.floor(budgetBitsPerSecond)));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function buildVideoMessageFileName(extension: string, at = new Date()): string {
  const stamp = [
    at.getFullYear(),
    pad2(at.getMonth() + 1),
    pad2(at.getDate()),
    "-",
    pad2(at.getHours()),
    pad2(at.getMinutes()),
    pad2(at.getSeconds()),
  ].join("");
  const safeExt = extension.replace(/^\./, "") || "webm";
  return `video-message-${stamp}.${safeExt}`;
}

export function extensionForVideoMime(mimeType: string): string {
  const normalized = mimeType.trim().toLowerCase();
  if (normalized.includes("mp4")) return "mp4";
  if (normalized.includes("quicktime")) return "mov";
  return "webm";
}

export function createVideoMessageFile(blob: Blob, mimeType: string, extension: string): File {
  const type = blob.type || mimeType || "video/webm";
  const name = buildVideoMessageFileName(extension || extensionForVideoMime(type));
  return new File([blob], name, { type, lastModified: Date.now() });
}

export function isVideoMessageFile(file: File | null | undefined): boolean {
  if (!file) return false;
  return VIDEO_MESSAGE_NAME_RE.test(file.name);
}

export function isVideoMessageAttachment(
  mimeType: string | undefined,
  fileName?: string,
): boolean {
  if (fileName && /^voice-message(?:[-_]|\.)/i.test(fileName)) return false;
  const normalizedMime = mimeType?.trim().toLowerCase();
  if (normalizedMime?.startsWith("audio/")) return false;
  if (normalizedMime?.startsWith("video/")) return true;
  if (fileName && VIDEO_MESSAGE_NAME_RE.test(fileName)) return true;
  const ext = fileName?.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase()
    : "";
  return Boolean(ext && VIDEO_FILE_EXTENSIONS.has(ext));
}
