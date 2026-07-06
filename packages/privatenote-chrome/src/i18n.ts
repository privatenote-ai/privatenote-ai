import type { LanguageCode } from "./settings.ts";

export interface UiStrings {
  brandName: string;
  brandTagline: string;
  privacyNote: string;
  titleLabel: string;
  titleOptional: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  expiresInLabel: string;
  burnAfterReadingLabel: string;
  passwordLabel: string;
  passwordOptional: string;
  passwordPlaceholder: string;
  encryptingPasswordButton: string;
  passwordProtectedMeta: string;
  shareButton: string;
  encryptingButton: string;
  contentEmpty: string;
  resultLabel: string;
  successTitle: string;
  successSubtitle: string;
  createAnotherButton: string;
  copyButton: string;
  shareLinkButton: string;
  shareLinkTitle: string;
  openButton: string;
  copiedToast: string;
  expiresMeta: string;
  burnsAfterRead: string;
  multiRead: string;
  expiry15m: string;
  expiry1h: string;
  expiry24h: string;
  expiry7d: string;
  optionsTitle: string;
  optionsSubtitle: string;
  defaultExpiryLabel: string;
  defaultBurnLabel: string;
  themeLabel: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;
  languageLabel: string;
  saveButton: string;
  savedToast: string;
}

const EN: UiStrings = {
  brandName: "PrivateNote",
  brandTagline: "End-to-end encrypted note sharing",
  privacyNote: "Encrypted in your browser · key stays in the URL, never sent to any server",
  titleLabel: "Title",
  titleOptional: "(optional)",
  titlePlaceholder: "e.g. Staging database password",
  contentLabel: "Content",
  contentPlaceholder: "Paste or type the secret here…",
  expiresInLabel: "Expires in",
  burnAfterReadingLabel: "Burn after reading",
  passwordLabel: "Password",
  passwordOptional: "(optional)",
  passwordPlaceholder: "Require a password to open the note",
  encryptingPasswordButton: "Encrypting (Argon2)…",
  passwordProtectedMeta: "Password protected",
  shareButton: "Share PrivateNote →",
  encryptingButton: "Encrypting…",
  contentEmpty: "Content cannot be empty.",
  resultLabel: "Encrypted link (the # fragment is the key):",
  successTitle: "Link ready",
  successSubtitle: "Copied to clipboard — share it securely",
  createAnotherButton: "Create another",
  copyButton: "Copy link",
  shareLinkButton: "Share link",
  shareLinkTitle: "PrivateNote secure link",
  openButton: "Open in browser",
  copiedToast: "Link copied to clipboard",
  expiresMeta: "Expires",
  burnsAfterRead: "burns after first read",
  multiRead: "multi-read",
  expiry15m: "15 minutes",
  expiry1h: "1 hour",
  expiry24h: "1 day",
  expiry7d: "7 days",
  optionsTitle: "PrivateNote settings",
  optionsSubtitle: "Defaults apply to the toolbar popup and context menu.",
  defaultExpiryLabel: "Default expiry",
  defaultBurnLabel: "Burn after reading by default",
  themeLabel: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  languageLabel: "Language",
  saveButton: "Save settings",
  savedToast: "Settings saved",
};

const STRINGS: Record<LanguageCode, UiStrings> = { en: EN };

export function getUiStrings(language: LanguageCode): UiStrings {
  return STRINGS[language] ?? EN;
}
