import { createAudioContext } from "./voiceMessageRecording";

/** High-resolution peak buffer; the player downsamples to fit the control width. */
export const WAVEFORM_PEAK_RESOLUTION = 256;

/**
 * RMS + peak envelope per bucket, then normalize so the loudest bar fills the canvas.
 * Quiet buckets keep a floor so the waveform still reads as a track, not a flat line.
 */
export function peaksFromChannelData(samples: Float32Array, barCount: number): number[] {
  const count = Math.max(0, Math.floor(barCount));
  if (count <= 0) return [];
  if (samples.length === 0) return Array.from({ length: count }, () => 0.08);

  const blockSize = samples.length / count;
  const peaks = new Array<number>(count);
  let max = 0;

  for (let i = 0; i < count; i++) {
    const start = Math.floor(i * blockSize);
    const end = Math.max(start + 1, Math.floor((i + 1) * blockSize));
    let peak = 0;
    let sumSquares = 0;
    const span = end - start;
    for (let j = start; j < end; j++) {
      const value = Math.abs(samples[j] ?? 0);
      if (value > peak) peak = value;
      sumSquares += value * value;
    }
    const rms = span > 0 ? Math.sqrt(sumSquares / span) : 0;
    const mixed = peak * 0.62 + rms * 0.38;
    peaks[i] = mixed;
    if (mixed > max) max = mixed;
  }

  if (max <= 1e-5) return peaks.map(() => 0.08);
  return peaks.map((value) => Math.max(0.06, Math.min(1, value / max)));
}

export function downsamplePeaks(peaks: readonly number[], barCount: number): number[] {
  const count = Math.max(0, Math.floor(barCount));
  if (count <= 0) return [];
  if (peaks.length === 0) return Array.from({ length: count }, () => 0.08);
  if (peaks.length === count) return [...peaks];

  const result = new Array<number>(count);
  const ratio = peaks.length / count;
  for (let i = 0; i < count; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.max(start + 1, Math.floor((i + 1) * ratio));
    let max = 0;
    for (let j = start; j < end; j++) {
      const value = peaks[j] ?? 0;
      if (value > max) max = value;
    }
    result[i] = max;
  }
  return result;
}

/** Soft speech-shaped envelope used while the file is still decoding. */
export function placeholderPeaks(barCount: number): number[] {
  const count = Math.max(0, Math.floor(barCount));
  return Array.from({ length: count }, (_, index) => {
    const t = count <= 1 ? 0.5 : index / (count - 1);
    const envelope = Math.sin(Math.PI * t);
    const ripple = 0.52 + 0.48 * Math.abs(Math.sin(index * 0.41) * Math.sin(index * 0.19));
    return Math.max(0.08, envelope * ripple * 0.72);
  });
}

export function peaksFromFrequencyBins(bins: Uint8Array, barCount: number): number[] {
  const count = Math.max(0, Math.floor(barCount));
  if (count <= 0) return [];
  if (bins.length === 0) return Array.from({ length: count }, () => 0.08);

  const usable = Math.max(8, Math.floor(bins.length * 0.55));
  const blockSize = usable / count;
  const peaks = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    const start = Math.floor(i * blockSize);
    const end = Math.max(start + 1, Math.floor((i + 1) * blockSize));
    let sum = 0;
    for (let j = start; j < end; j++) sum += bins[j] ?? 0;
    peaks[i] = (sum / (end - start)) / 255;
  }
  return peaks.map((value) => Math.max(0.07, Math.min(1, value * 1.35)));
}

export async function extractWaveformPeaks(
  source: Blob | ArrayBuffer | string,
  barCount: number = WAVEFORM_PEAK_RESOLUTION,
): Promise<number[]> {
  const context = createAudioContext();
  try {
    const arrayBuffer = await readAudioArrayBuffer(source);
    const copy = arrayBuffer.slice(0);
    const decoded = await context.decodeAudioData(copy);
    const channel = decoded.numberOfChannels > 1
      ? mixToMono(decoded)
      : decoded.getChannelData(0);
    return peaksFromChannelData(channel, barCount);
  } finally {
    try {
      await context.close();
    } catch {
      // ignore
    }
  }
}

async function readAudioArrayBuffer(source: Blob | ArrayBuffer | string): Promise<ArrayBuffer> {
  if (typeof source === "string") {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio (${response.status})`);
    }
    return response.arrayBuffer();
  }
  if (source instanceof Blob) return source.arrayBuffer();
  return source;
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const mixed = new Float32Array(length);
  const channelCount = buffer.numberOfChannels;
  for (let channel = 0; channel < channelCount; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      mixed[i] += (data[i] ?? 0) / channelCount;
    }
  }
  return mixed;
}
