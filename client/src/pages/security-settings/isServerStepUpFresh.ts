/** Must match `STEP_UP_WINDOW_SECONDS` in `src/routes.ts` (5 minutes). */
const STEP_UP_WINDOW_MS = 5 * 60 * 1000;

export function isServerStepUpFresh(lastStepUpAt: string | null | undefined, now = Date.now()): boolean {
  if (!lastStepUpAt) return false;
  const t = new Date(lastStepUpAt).getTime();
  if (Number.isNaN(t)) return false;
  return now - t <= STEP_UP_WINDOW_MS;
}
