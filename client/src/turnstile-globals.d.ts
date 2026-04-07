/** Cloudflare Turnstile (loaded from challenges.cloudflare.com in index.html). */
interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
}

interface TurnstileAPI {
  render: (container: HTMLElement | string, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  /** Removes the widget from the page; preferred over `reset` when tearing down (e.g. unmount). */
  remove?: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export {};
