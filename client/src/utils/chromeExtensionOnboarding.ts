import { isGoogleChrome } from "./isGoogleChrome.ts";

export const CHROME_EXTENSION_STORE_URL =
  "https://chromewebstore.google.com/detail/privatenote-encrypted-note-sharing/ijlfmagoflakmnecjembfcaoebfnnekm";

export const CHROME_EXTENSION_READY_EVENT = "privatenote-chrome-extension-ready";

const DISMISS_STORAGE_KEY = "privatenote_chrome_extension_prompt_dismissed";
const WEB_NOTES_CREATED_COUNT_KEY = "privatenote_web_notes_created_count";
const MIN_WEB_NOTES_FOR_PROMPT = 2;

export function isPrivateNoteChromeExtensionInstalled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.privatenoteChromeExtension === "1";
}

/** Subscribe to extension presence (content script sets a dataset flag at document_start). */
export function watchPrivateNoteChromeExtensionInstalled(
  onInstalled: (installed: boolean) => void,
): () => void {
  const notify = () => onInstalled(isPrivateNoteChromeExtensionInstalled());
  notify();

  if (typeof window === "undefined") return () => {};

  const onReady = () => notify();
  window.addEventListener(CHROME_EXTENSION_READY_EVENT, onReady);
  return () => window.removeEventListener(CHROME_EXTENSION_READY_EVENT, onReady);
}

export function getWebNotesCreatedCount(): number {
  if (typeof localStorage === "undefined") return 0;
  try {
    const raw = localStorage.getItem(WEB_NOTES_CREATED_COUNT_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function recordWebNoteCreated(): number {
  const next = getWebNotesCreatedCount() + 1;
  if (typeof localStorage === "undefined") return next;
  try {
    localStorage.setItem(WEB_NOTES_CREATED_COUNT_KEY, String(next));
  } catch {
    // private mode / blocked storage — non-fatal
  }
  return next;
}

export function isChromeExtensionPromptDismissed(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(DISMISS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissChromeExtensionPrompt(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, "1");
  } catch {
    // private mode / blocked storage — non-fatal
  }
}

export function meetsChromeExtensionOnboardingPrerequisites(): boolean {
  return (
    isGoogleChrome() &&
    !isChromeExtensionPromptDismissed() &&
    getWebNotesCreatedCount() >= MIN_WEB_NOTES_FOR_PROMPT
  );
}
