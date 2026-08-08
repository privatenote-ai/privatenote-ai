export const VOICE_RECORDING_FORMAT_STORAGE_KEY = "privatenote_voice_recording_format";

export const VOICE_RECORDING_FORMAT_OPTIONS = ["auto", "wav", "m4a"] as const;

export type VoiceRecordingFormatPreference = (typeof VOICE_RECORDING_FORMAT_OPTIONS)[number];

export function normalizeVoiceRecordingFormatPreference(
  raw: string | null | undefined,
): VoiceRecordingFormatPreference {
  const value = (raw || "auto").trim().toLowerCase();
  if (value === "wav" || value === "m4a" || value === "auto") return value;
  return "auto";
}

export function readVoiceRecordingFormatPreference(): VoiceRecordingFormatPreference {
  try {
    return normalizeVoiceRecordingFormatPreference(
      localStorage.getItem(VOICE_RECORDING_FORMAT_STORAGE_KEY),
    );
  } catch {
    return "auto";
  }
}

export function writeVoiceRecordingFormatPreference(
  preference: VoiceRecordingFormatPreference,
): void {
  try {
    const normalized = normalizeVoiceRecordingFormatPreference(preference);
    if (normalized === "auto") {
      localStorage.removeItem(VOICE_RECORDING_FORMAT_STORAGE_KEY);
      return;
    }
    localStorage.setItem(VOICE_RECORDING_FORMAT_STORAGE_KEY, normalized);
  } catch {
    /* private mode */
  }
}
