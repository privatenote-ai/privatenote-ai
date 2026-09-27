/** Browser-only opt-in when not signed in (signed-in users use account `allow_hosted_ai`). */
export const HOSTED_AI_LOCAL_STORAGE_KEY = "privatenote_allow_hosted_ai";

export function readLocalHostedAiAllowed(): boolean {
  try {
    return localStorage.getItem(HOSTED_AI_LOCAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeLocalHostedAiAllowed(allowed: boolean): void {
  try {
    if (allowed) {
      localStorage.setItem(HOSTED_AI_LOCAL_STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(HOSTED_AI_LOCAL_STORAGE_KEY);
    }
  } catch {
    /* private mode */
  }
}
