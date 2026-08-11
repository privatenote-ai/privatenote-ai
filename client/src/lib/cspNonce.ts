/** Read the per-response CSP nonce injected by Pages middleware (production). */
export function readCspNonce(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  const value = document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content")?.trim();
  return value || undefined;
}

export function applyCspNonceToScript(script: HTMLScriptElement): void {
  const nonce = readCspNonce();
  if (nonce) {
    script.nonce = nonce;
  }
}
