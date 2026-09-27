/**
 * Experimental bottom-sheet (mobile) / modal (desktop) Customize UX.
 *
 * Enabled by default for testing. Revert to inline accordion:
 *   VITE_CUSTOMIZE_SHEET=0
 * or set DEFAULT_CUSTOMIZE_SHEET_EXPERIMENT to false below.
 */
const DEFAULT_CUSTOMIZE_SHEET_EXPERIMENT = true;

export function isCustomizeSheetExperimentEnabled(): boolean {
  const flag = import.meta.env.VITE_CUSTOMIZE_SHEET;
  if (flag === "0" || flag === "false") return false;
  if (flag === "1" || flag === "true") return true;
  return DEFAULT_CUSTOMIZE_SHEET_EXPERIMENT;
}
