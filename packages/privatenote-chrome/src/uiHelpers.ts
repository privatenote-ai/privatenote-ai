import type { ThemePreference } from "./settings.ts";

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    return;
  }
  root.setAttribute("data-theme", theme);
}

export function watchSystemTheme(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => onChange();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export function canShareUrl(url: string): boolean {
  if (typeof navigator.share !== "function") return false;
  if (typeof navigator.canShare === "function") {
    try {
      return navigator.canShare({ url });
    } catch {
      return false;
    }
  }
  return true;
}

export async function shareUrl(
  url: string,
  title: string,
): Promise<"shared" | "copied" | "cancelled"> {
  if (canShareUrl(url)) {
    try {
      await navigator.share({ url, title });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
    }
  }
  await copyToClipboard(url);
  return "copied";
}

export function formatExpiryOption(
  value: string,
  labels: { expiry15m: string; expiry1h: string; expiry24h: string; expiry7d: string },
): string {
  switch (value) {
    case "15m":
      return labels.expiry15m;
    case "1h":
      return labels.expiry1h;
    case "24h":
      return labels.expiry24h;
    case "7d":
      return labels.expiry7d;
    default:
      return value;
  }
}
