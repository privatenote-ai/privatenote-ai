import {
  createAudioContext,
  encodeWavMonoFloat32,
  isVoiceRecordingMp4Supported,
} from "./voiceMessageRecording";

export const VOICE_DOWNLOAD_FORMATS = ["original", "wav", "m4a"] as const;

export type VoiceDownloadFormat = (typeof VOICE_DOWNLOAD_FORMATS)[number];

export type VoiceDownloadResult = {
  blob: Blob;
  mimeType: string;
  fileName: string;
  format: VoiceDownloadFormat;
};

export function normalizeVoiceDownloadFormat(
  raw: string | null | undefined,
): VoiceDownloadFormat {
  const value = (raw || "original").trim().toLowerCase();
  if (value === "wav" || value === "m4a" || value === "original") return value;
  return "original";
}

export function isVoiceDownloadConversionAvailable(format: VoiceDownloadFormat): boolean {
  if (format === "original") return true;
  if (format === "wav") {
    if (typeof window === "undefined") return true;
    const win = window as Window & { webkitAudioContext?: typeof AudioContext };
    return Boolean(window.AudioContext || win.webkitAudioContext);
  }
  if (format === "m4a") return isVoiceRecordingMp4Supported();
  return false;
}

function replaceExtension(fileName: string, extension: string): string {
  const trimmed = fileName.trim() || "voice-message";
  const base = trimmed.includes(".")
    ? trimmed.slice(0, trimmed.lastIndexOf("."))
    : trimmed;
  const safeExt = extension.replace(/^\./, "") || "bin";
  return `${base || "voice-message"}.${safeExt}`;
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  const { numberOfChannels, length } = buffer;
  if (numberOfChannels <= 1) {
    return buffer.getChannelData(0).slice();
  }
  const mono = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      mono[i] += data[i] ?? 0;
    }
  }
  const scale = 1 / numberOfChannels;
  for (let i = 0; i < length; i++) {
    mono[i] *= scale;
  }
  return mono;
}

async function decodeAudioBlob(blob: Blob): Promise<AudioBuffer> {
  const context = createAudioContext();
  try {
    const bytes = await blob.arrayBuffer();
    // copy: true — some browsers detach the ArrayBuffer.
    return await context.decodeAudioData(bytes.slice(0));
  } finally {
    void context.close().catch(() => undefined);
  }
}

async function encodeAudioBufferAsWav(buffer: AudioBuffer): Promise<Blob> {
  const mono = mixToMono(buffer);
  return encodeWavMonoFloat32(mono, buffer.sampleRate);
}

/**
 * Re-encode a decoded buffer to M4A/AAC via MediaRecorder when the browser supports it.
 * Falls back to WAV if recording mp4 is unavailable mid-flight.
 */
async function encodeAudioBufferAsM4a(buffer: AudioBuffer): Promise<{ blob: Blob; mimeType: string; extension: string }> {
  if (!isVoiceRecordingMp4Supported() || typeof MediaRecorder === "undefined") {
    const wav = await encodeAudioBufferAsWav(buffer);
    return { blob: wav, mimeType: "audio/wav", extension: "wav" };
  }

  const context = createAudioContext(buffer.sampleRate);
  try {
    const destination = context.createMediaStreamDestination();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(destination);

    const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : MediaRecorder.isTypeSupported("audio/aac")
        ? "audio/aac"
        : "";
    if (!mimeType) {
      const wav = await encodeAudioBufferAsWav(buffer);
      return { blob: wav, mimeType: "audio/wav", extension: "wav" };
    }

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(destination.stream, { mimeType });
    const recorded = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onerror = () => reject(recorder.error ?? new Error("Voice re-encode failed"));
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    });

    recorder.start(100);
    await context.resume();
    source.start(0);
    await new Promise<void>((resolve) => {
      source.onended = () => resolve();
    });
    // Brief tail so the recorder flushes the last frame.
    await new Promise((resolve) => window.setTimeout(resolve, 40));
    if (recorder.state !== "inactive") recorder.stop();
    const blob = await recorded;
    if (blob.size <= 0) {
      const wav = await encodeAudioBufferAsWav(buffer);
      return { blob: wav, mimeType: "audio/wav", extension: "wav" };
    }
    return {
      blob,
      mimeType: blob.type || mimeType,
      extension: mimeType.includes("aac") && !mimeType.includes("mp4") ? "aac" : "m4a",
    };
  } finally {
    void context.close().catch(() => undefined);
  }
}

/**
 * Client-side voice decoder / converter for Starter+ download format choice.
 * `original` returns the decrypted blob unchanged; `wav`/`m4a` decode then re-encode.
 */
export async function convertVoiceAttachmentForDownload(options: {
  blob: Blob;
  format: VoiceDownloadFormat;
  sourceFileName?: string;
  sourceMimeType?: string;
}): Promise<VoiceDownloadResult> {
  const format = normalizeVoiceDownloadFormat(options.format);
  const sourceName = options.sourceFileName?.trim() || "voice-message";
  const sourceMime =
    options.sourceMimeType?.trim() || options.blob.type || "application/octet-stream";

  if (format === "original") {
    return {
      blob: options.blob,
      mimeType: sourceMime,
      fileName: sourceName,
      format: "original",
    };
  }

  const audioBuffer = await decodeAudioBlob(options.blob);

  if (format === "wav") {
    const wav = await encodeAudioBufferAsWav(audioBuffer);
    return {
      blob: wav,
      mimeType: "audio/wav",
      fileName: replaceExtension(sourceName, "wav"),
      format: "wav",
    };
  }

  const encoded = await encodeAudioBufferAsM4a(audioBuffer);
  return {
    blob: encoded.blob,
    mimeType: encoded.mimeType,
    fileName: replaceExtension(sourceName, encoded.extension),
    format: encoded.extension === "wav" ? "wav" : "m4a",
  };
}
