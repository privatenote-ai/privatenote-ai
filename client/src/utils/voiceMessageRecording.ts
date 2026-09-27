import type { VoiceRecordingFormatPreference } from "./voiceRecordingFormatPreference";

export type { VoiceRecordingFormatPreference };

/** Prefer formats recipients can play across Chrome and Safari. */
const MEDIA_RECORDER_CANDIDATES: ReadonlyArray<{ mimeType: string; extension: string }> = [
  // AAC-in-MP4 plays in Safari and Chrome; prefer whenever the browser can record it.
  { mimeType: "audio/mp4", extension: "m4a" },
  { mimeType: "audio/aac", extension: "aac" },
];

const VOICE_MESSAGE_NAME_RE = /^voice-message(?:[-_].+)?\.(webm|m4a|mp4|ogg|mp3|wav|aac)$/i;

export const VOICE_MESSAGE_MAX_DURATION_SECONDS = 5 * 60;
/** Target sample rate for WAV voice captures (keeps Free 5‑min notes under the 25 MB file limit). */
export const VOICE_MESSAGE_WAV_SAMPLE_RATE = 16_000;

export type VoiceRecordingStrategy =
  | { kind: "media-recorder"; mimeType: string; extension: string }
  | { kind: "wav"; mimeType: "audio/wav"; extension: "wav" };

export function isVoiceRecordingMp4Supported(): boolean {
  if (typeof MediaRecorder === "undefined") return false;
  return MEDIA_RECORDER_CANDIDATES.some((candidate) =>
    MediaRecorder.isTypeSupported(candidate.mimeType),
  );
}

function pickMediaRecorderMp4Strategy(): VoiceRecordingStrategy | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const candidate of MEDIA_RECORDER_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return {
        kind: "media-recorder",
        mimeType: candidate.mimeType,
        extension: candidate.extension,
      };
    }
  }
  return null;
}

export function pickVoiceRecordingMime(
  preference: VoiceRecordingFormatPreference = "auto",
): { mimeType: string; extension: string } {
  const strategy = pickVoiceRecordingStrategy(preference);
  return { mimeType: strategy.mimeType, extension: strategy.extension };
}

/**
 * Choose a recording path that recipients can play in both Chrome and Safari.
 * - auto: M4A/AAC when the browser can record it, otherwise WAV
 * - m4a: prefer compact AAC-in-MP4 (falls back to WAV if unsupported here)
 * - wav: always PCM WAV for maximum playback compatibility
 */
export function pickVoiceRecordingStrategy(
  preference: VoiceRecordingFormatPreference = "auto",
): VoiceRecordingStrategy {
  if (preference !== "wav") {
    const mp4 = pickMediaRecorderMp4Strategy();
    if (mp4) return mp4;
  }
  return { kind: "wav", mimeType: "audio/wav", extension: "wav" };
}

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const win = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext || win.webkitAudioContext || null;
}

export function isVoiceRecordingSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    (typeof MediaRecorder !== "undefined" || Boolean(getAudioContextConstructor()))
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

/**
 * Best-effort check whether this browser can decode a voice attachment in <audio>.
 * Empty canPlayType (common for WebM/Opus on Safari) means we should offer download.
 */
export function canBrowserPlayVoiceAttachment(
  mimeType: string | undefined,
  fileName?: string,
): boolean {
  if (typeof document === "undefined") return true;
  const audio = document.createElement("audio");
  if (typeof audio.canPlayType !== "function") return true;

  const candidates = voicePlaybackMimeCandidates(mimeType, fileName);
  return candidates.some((candidate) => {
    const result = audio.canPlayType(candidate);
    return result === "probably" || result === "maybe";
  });
}

export function voicePlaybackMimeCandidates(
  mimeType: string | undefined,
  fileName?: string,
): string[] {
  const out: string[] = [];
  const normalizedMime = mimeType?.trim().toLowerCase();
  if (normalizedMime && normalizedMime !== "application/octet-stream") {
    out.push(normalizedMime);
  }
  const ext = fileName?.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase()
    : "";
  if (ext === "m4a" || ext === "mp4") {
    out.push("audio/mp4", "audio/aac", "audio/x-m4a");
  } else if (ext === "wav") {
    out.push("audio/wav", "audio/wave", "audio/x-wav");
  } else if (ext === "webm") {
    out.push("audio/webm", 'audio/webm; codecs="opus"');
  } else if (ext === "ogg" || ext === "oga") {
    out.push("audio/ogg", 'audio/ogg; codecs="opus"');
  } else if (ext === "mp3") {
    out.push("audio/mpeg");
  } else if (ext === "aac") {
    out.push("audio/aac", "audio/mp4");
  }
  return [...new Set(out)];
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

export function downsampleToRate(
  input: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number,
): Float32Array {
  if (outputSampleRate <= 0 || inputSampleRate <= 0) return input;
  if (inputSampleRate === outputSampleRate) return input;
  const ratio = inputSampleRate / outputSampleRate;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const output = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    output[i] = input[Math.min(input.length - 1, Math.floor(i * ratio))] ?? 0;
  }
  return output;
}

export function concatFloat32(chunks: Float32Array[]): Float32Array {
  let total = 0;
  for (const chunk of chunks) total += chunk.length;
  const out = new Float32Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** Encode mono PCM float samples as a 16-bit WAV blob. */
export function encodeWavMonoFloat32(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export function createAudioContext(sampleRate?: number): AudioContext {
  const Ctx = getAudioContextConstructor();
  if (!Ctx) {
    throw new Error("Web Audio API is not available in this browser.");
  }
  return sampleRate ? new Ctx({ sampleRate }) : new Ctx();
}
