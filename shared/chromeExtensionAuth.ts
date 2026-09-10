/** Published Chrome Web Store item ID (also used in the store listing URL). */
export const CHROME_WEB_STORE_EXTENSION_ID = "ijlfmagoflakmnecjembfcaoebfnnekm";

/** Legacy landing path after website sign-in. Plugin auth uses chrome.identity / device code instead. */
export const CHROME_EXTENSION_CONNECTED_PATH = "/extension/connected";

/** Dispatched on privatenote.ai so the installed extension can refresh signed-in state. */
export const CHROME_EXTENSION_AUTH_SYNC_EVENT = "privatenote-chrome-auth-sync";

export function chromeExtensionSignInUrl(webOrigin: string): string {
  const origin = webOrigin.replace(/\/$/, "");
  const returnTo = encodeURIComponent(CHROME_EXTENSION_CONNECTED_PATH);
  return `${origin}/auth/sign-in?returnTo=${returnTo}`;
}
