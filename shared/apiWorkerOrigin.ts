/** Default API Worker origin when the SPA uses the Pages /api proxy for JSON calls. */
export const DEFAULT_API_WORKER_ORIGIN = "https://privatenote-api.marjan-skrobot.workers.dev";

export function normalizeApiWorkerOrigin(origin: string): string {
  let base = origin.trim();
  if (!base) return DEFAULT_API_WORKER_ORIGIN;
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    base = `https://${base}`;
  }
  return base.replace(/\/$/, "");
}
