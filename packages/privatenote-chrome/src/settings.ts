export type ExpiresIn = "15m" | "1h" | "24h" | "7d";

export type ThemePreference = "system" | "light" | "dark";

export type LanguageCode = "en";

/** Fixed production endpoints — must match manifest host_permissions. */
export const PRIVATENOTE_API_BASE_URL = "https://privatenote.ai";
export const PRIVATENOTE_WEB_ORIGIN = "https://privatenote.ai";

export interface ExtensionSettings {
  defaultExpiresIn: ExpiresIn;
  defaultBurnAfterReading: boolean;
  theme: ThemePreference;
  language: LanguageCode;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  defaultExpiresIn: "24h",
  defaultBurnAfterReading: true,
  theme: "system",
  language: "en",
};

export const SETTINGS_STORAGE_KEY = "privatenoteSettings";

export const SESSION_PENDING_SELECTION_KEY = "pendingSelection";

export async function loadSettings(): Promise<ExtensionSettings> {
  const stored = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  const raw = stored[SETTINGS_STORAGE_KEY];
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SETTINGS };
  }
  const partial = raw as Partial<ExtensionSettings>;
  return {
    defaultExpiresIn: partial.defaultExpiresIn ?? DEFAULT_SETTINGS.defaultExpiresIn,
    defaultBurnAfterReading:
      partial.defaultBurnAfterReading ?? DEFAULT_SETTINGS.defaultBurnAfterReading,
    theme: partial.theme ?? DEFAULT_SETTINGS.theme,
    language: partial.language ?? DEFAULT_SETTINGS.language,
  };
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: settings });
}

export async function consumePendingSelection(): Promise<string | null> {
  const stored = await chrome.storage.session.get(SESSION_PENDING_SELECTION_KEY);
  const text = stored[SESSION_PENDING_SELECTION_KEY];
  if (typeof text === "string" && text.trim()) {
    await chrome.storage.session.remove(SESSION_PENDING_SELECTION_KEY);
    return text;
  }
  return null;
}

export async function setPendingSelection(text: string): Promise<void> {
  await chrome.storage.session.set({ [SESSION_PENDING_SELECTION_KEY]: text });
}
