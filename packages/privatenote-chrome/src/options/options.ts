import { getUiStrings } from "../i18n.ts";
import {
  loadSettings,
  saveSettings,
  type ExtensionSettings,
  type ExpiresIn,
  type LanguageCode,
  type ThemePreference,
} from "../settings.ts";
import { applyTheme, watchSystemTheme } from "../uiHelpers.ts";

const form = document.getElementById("settingsForm") as HTMLFormElement;
const toastEl = document.getElementById("toast") as HTMLDivElement;

function showToast(message: string): void {
  toastEl.textContent = message;
  toastEl.classList.add("visible");
  setTimeout(() => toastEl.classList.remove("visible"), 1800);
}

function readForm(): ExtensionSettings {
  return {
    defaultExpiresIn: (document.getElementById("defaultExpiresIn") as HTMLSelectElement)
      .value as ExpiresIn,
    defaultBurnAfterReading: (document.getElementById("defaultBurnAfterReading") as HTMLInputElement)
      .checked,
    theme: (document.getElementById("theme") as HTMLSelectElement).value as ThemePreference,
    language: (document.getElementById("language") as HTMLSelectElement).value as LanguageCode,
  };
}

function fillForm(settings: ExtensionSettings): void {
  (document.getElementById("defaultExpiresIn") as HTMLSelectElement).value =
    settings.defaultExpiresIn;
  (document.getElementById("defaultBurnAfterReading") as HTMLInputElement).checked =
    settings.defaultBurnAfterReading;
  (document.getElementById("theme") as HTMLSelectElement).value = settings.theme;
  (document.getElementById("language") as HTMLSelectElement).value = settings.language;
}

function applyOptionStrings(strings: ReturnType<typeof getUiStrings>): void {
  document.getElementById("optionsTitle")!.textContent = strings.optionsTitle;
  document.getElementById("optionsSubtitle")!.textContent = strings.optionsSubtitle;
  document.getElementById("defaultExpiryLabel")!.textContent = strings.defaultExpiryLabel;
  document.getElementById("defaultBurnLabel")!.textContent = strings.defaultBurnLabel;
  document.getElementById("themeLabel")!.textContent = strings.themeLabel;
  document.getElementById("languageLabel")!.textContent = strings.languageLabel;
  document.getElementById("saveButton")!.textContent = strings.saveButton;

  const expirySelect = document.getElementById("defaultExpiresIn") as HTMLSelectElement;
  for (const opt of Array.from(expirySelect.options)) {
    opt.textContent =
      opt.value === "15m" ? strings.expiry15m :
      opt.value === "1h" ? strings.expiry1h :
      opt.value === "24h" ? strings.expiry24h :
      strings.expiry7d;
  }

  const themeSelect = document.getElementById("theme") as HTMLSelectElement;
  themeSelect.options[0]!.textContent = strings.themeSystem;
  themeSelect.options[1]!.textContent = strings.themeLight;
  themeSelect.options[2]!.textContent = strings.themeDark;
}

async function init(): Promise<void> {
  const settings = await loadSettings();
  const strings = getUiStrings(settings.language);

  applyOptionStrings(strings);
  fillForm(settings);
  applyTheme(settings.theme);

  watchSystemTheme(() => {
    const current = readForm();
    if (current.theme === "system") applyTheme("system");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const next = readForm();
    await saveSettings(next);
    applyTheme(next.theme);
    showToast(strings.savedToast);
  });
}

init();
