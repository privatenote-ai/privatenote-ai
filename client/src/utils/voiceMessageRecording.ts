/** Preferred MediaRecorder formats (browser support varies; Safari often wants mp4). */
const AUDIO_MIME_CANDIDATES: ReadonlyArray<{ mimeType: string; extension: string }> = [
  { mimeType: "audio/webm;codecs=opus", extension: "webm" },
  { mimeType: "audio/webm", extension: "webm" },
  { mimeType: "audio/mp4", extension: "m4a" },
  { mimeType: "audio/ogg;codecs=opus", extension: "ogg" },
  { mimeType: "audio/ogg", extension: "ogg" },
];

const VOICE_MESSAGE_NAME_RE = /^voice-message(?:[-_].+)?\.(webm|m4a|mp4|ogg|mp3|wav)$/i;

export const VOICE_MESSAGE_MAX_DURATION_SECONDS = 5 * 60;

export function pickVoiceRecordingMime(): { mimeType: string; extension: string } {
  if (typeof MediaRecorder === "undefined") {
    return { mimeType: "audio/webm", extension: "webm" };
  }
  for (const candidate of AUDIO_MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return candidate;
    }
  }
  return { mimeType: "", extension: "webm" };
}

export function isVoiceRecordingSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined"
  );
}

export function isVoiceMessageFile(file: File | null | undefined): boolean {
  if (!file) return false;
  if (file.type.trim().toLowerCase().startsWith("audio/")) return true;
  return VOICE_MESSAGE_NAME_RE.test(file.name);
}

const AUDIO_ONLY_EXTENSIONS = new Set(["m4a", "mp3", "ogg", "oga", "wav", "aac", "flac"]);

export function isVoiceMessageAttachment(
  mimeType: string | undefined,
  fileName?: string,
): boolean {
  const normalizedMime = mimeType?.trim().toLowerCase();
  if (normalizedMime?.startsWith("audio/")) return true;
  if (fileName && VOICE_MESSAGE_NAME_RE.test(fileName)) return true;
  const ext = fileName?.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase()
    : "";
  return Boolean(ext && AUDIO_ONLY_EXTENSIONS.has(ext));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function buildVoiceMessageFileName(extension: string, at = new Date()): string {
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
  return `voice-message-${stamp}.${safeExt}`;
}

export function formatRecordingDuration(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${pad2(seconds)}`;
}

export function createVoiceMessageFile(blob: Blob, mimeType: string, extension: string): File {
  const type = blob.type || mimeType || "audio/webm";
  const name = buildVoiceMessageFileName(extension);
  return new File([blob], name, { type, lastModified: Date.now() });
}
