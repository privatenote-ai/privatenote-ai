import { createPrivateNote, isExpiresIn } from "../createNote.ts";
import { getUiStrings } from "../i18n.ts";
import { consumePendingSelection, loadSettings } from "../settings.ts";
import { applyTheme, canShareUrl, copyToClipboard, shareUrl, watchSystemTheme } from "../uiHelpers.ts";

const composeView = document.getElementById("composeView") as HTMLDivElement;
const successView = document.getElementById("successView") as HTMLDivElement;
const errorBanner = document.getElementById("errorBanner") as HTMLDivElement;
const submitBtn = document.getElementById("submit") as HTMLButtonElement;
const contentEl = document.getElementById("content") as HTMLTextAreaElement;
const passwordEl = document.getElementById("password") as HTMLInputElement;
const toastEl = document.getElementById("toast") as HTMLDivElement;

let lastSuccessUrl: string | null = null;
let uiStrings = getUiStrings("en");

function showToast(message: string): void {
  toastEl.textContent = message;
  toastEl.classList.add("visible");
  setTimeout(() => toastEl.classList.remove("visible"), 1800);
}

function hideError(): void {
  errorBanner.hidden = true;
  errorBanner.textContent = "";
}

function showError(message: string): void {
  hideError();
  composeView.hidden = false;
  successView.hidden = true;
  errorBanner.hidden = false;
  errorBanner.textContent = message;
}

function showComposeView(): void {
  hideError();
  composeView.hidden = false;
  successView.hidden = true;
  lastSuccessUrl = null;
}

function showSuccess(
  url: string,
  expiresAt: string,
  burnAfterReading: boolean,
  isPasswordProtected: boolean,
  strings: ReturnType<typeof getUiStrings>,
): void {
  lastSuccessUrl = url;
  hideError();
  composeView.hidden = true;
  successView.hidden = false;

  document.getElementById("successTitle")!.textContent = strings.successTitle;
  document.getElementById("successSubtitle")!.textContent = strings.successSubtitle;
  document.getElementById("successUrl")!.textContent = url;

  const expiresLabel = new Date(expiresAt).toLocaleString();
  const protectionMeta = isPasswordProtected ? ` · ${strings.passwordProtectedMeta}` : "";
  document.getElementById("successMeta")!.textContent =
    `${strings.expiresMeta} ${expiresLabel}` +
    (burnAfterReading ? ` · ${strings.burnsAfterRead}` : ` · ${strings.multiRead}`) +
    protectionMeta;

  document.getElementById("copyBtn")!.textContent = strings.copyButton;
  const shareBtn = document.getElementById("shareBtn") as HTMLButtonElement;
  shareBtn.textContent = strings.shareLinkButton;
  shareBtn.hidden = !lastSuccessUrl || !canShareUrl(url);
  document.getElementById("openBtn")!.textContent = strings.openButton;
  document.getElementById("createAnotherBtn")!.textContent = strings.createAnotherButton;
}

function applyStrings(strings: ReturnType<typeof getUiStrings>): void {
  document.getElementById("brandTagline")!.textContent = strings.brandTagline;
  document.getElementById("privacyNote")!.textContent = strings.privacyNote;
  document.getElementById("titleLabel")!.textContent = strings.titleLabel;
  document.getElementById("titleOptional")!.textContent = strings.titleOptional;
  (document.getElementById("title") as HTMLInputElement).placeholder = strings.titlePlaceholder;
  document.getElementById("contentLabel")!.textContent = strings.contentLabel;
  contentEl.placeholder = strings.contentPlaceholder;
  document.getElementById("passwordLabel")!.textContent = strings.passwordLabel;
  document.getElementById("passwordOptional")!.textContent = strings.passwordOptional;
  passwordEl.placeholder = strings.passwordPlaceholder;
  document.getElementById("expiresInLabel")!.textContent = strings.expiresInLabel;
  document.getElementById("burnLabel")!.textContent = strings.burnAfterReadingLabel;
  submitBtn.textContent = strings.shareButton;

  const expirySelect = document.getElementById("expiresIn") as HTMLSelectElement;
  for (const opt of Array.from(expirySelect.options)) {
    opt.textContent =
      opt.value === "15m" ? strings.expiry15m :
      opt.value === "1h" ? strings.expiry1h :
      opt.value === "24h" ? strings.expiry24h :
      strings.expiry7d;
  }

  if (!successView.hidden && lastSuccessUrl) {
    document.getElementById("successTitle")!.textContent = strings.successTitle;
    document.getElementById("successSubtitle")!.textContent = strings.successSubtitle;
    document.getElementById("copyBtn")!.textContent = strings.copyButton;
    const shareBtn = document.getElementById("shareBtn") as HTMLButtonElement;
    shareBtn.textContent = strings.shareLinkButton;
    shareBtn.hidden = !lastSuccessUrl || !canShareUrl(lastSuccessUrl);
    document.getElementById("openBtn")!.textContent = strings.openButton;
    document.getElementById("createAnotherBtn")!.textContent = strings.createAnotherButton;
  }
}

function resetFormForAnotherNote(): void {
  (document.getElementById("title") as HTMLInputElement).value = "";
  contentEl.value = "";
  passwordEl.value = "";
  showComposeView();
  contentEl.focus();
}

async function init(): Promise<void> {
  const settings = await loadSettings();
  uiStrings = getUiStrings(settings.language);

  applyStrings(uiStrings);
  applyTheme(settings.theme);
  watchSystemTheme(() => {
    if (settings.theme === "system") applyTheme("system");
  });

  (document.getElementById("expiresIn") as HTMLSelectElement).value = settings.defaultExpiresIn;
  (document.getElementById("burn") as HTMLInputElement).checked = settings.defaultBurnAfterReading;

  const pending = await consumePendingSelection();
  if (pending) {
    contentEl.value = pending;
    contentEl.focus();
    await chrome.action.setBadgeText({ text: "" });
  }

  document.getElementById("openOptions")!.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  document.getElementById("copyBtn")!.addEventListener("click", async () => {
    if (!lastSuccessUrl) return;
    await copyToClipboard(lastSuccessUrl);
    showToast(uiStrings.copiedToast);
  });

  document.getElementById("shareBtn")!.addEventListener("click", async () => {
    if (!lastSuccessUrl) return;
    const outcome = await shareUrl(lastSuccessUrl, uiStrings.shareLinkTitle);
    if (outcome === "copied") {
      showToast(uiStrings.copiedToast);
    }
  });

  document.getElementById("openBtn")!.addEventListener("click", () => {
    if (!lastSuccessUrl) return;
    chrome.tabs.create({ url: lastSuccessUrl });
  });

  document.getElementById("createAnotherBtn")!.addEventListener("click", () => {
    resetFormForAnotherNote();
  });

  submitBtn.addEventListener("click", async () => {
    const content = contentEl.value;
    if (!content.trim()) {
      showError(uiStrings.contentEmpty);
      return;
    }

    const password = passwordEl.value.trim() || undefined;
    const expiresIn = (document.getElementById("expiresIn") as HTMLSelectElement).value;
    if (!isExpiresIn(expiresIn)) {
      showError("Invalid expiry.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = password ? uiStrings.encryptingPasswordButton : uiStrings.encryptingButton;
    hideError();

    try {
      const result = await createPrivateNote({
        content,
        title: (document.getElementById("title") as HTMLInputElement).value.trim() || undefined,
        expiresIn,
        burnAfterReading: (document.getElementById("burn") as HTMLInputElement).checked,
        password,
      });

      await copyToClipboard(result.secureUrl);
      showSuccess(
        result.secureUrl,
        result.expiresAt,
        result.burnAfterReading,
        result.isPasswordProtected,
        uiStrings,
      );
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = uiStrings.shareButton;
    }
  });
}

init();
