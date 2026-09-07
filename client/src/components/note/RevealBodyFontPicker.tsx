import {
  REVEAL_BODY_FONT_CATALOG,
  type RevealBodyFont,
} from "@shared/revealBodyFont";

const SAMPLE = "The access code is 7G-K4m.";

type RevealBodyFontPickerProps = {
  value: RevealBodyFont;
  onChange: (id: RevealBodyFont) => void;
  disabled?: boolean;
  /** Free plan: paid faces open the upgrade prompt instead of applying. */
  locked?: boolean;
  onLockedSelect?: () => void;
  labels?: Partial<Record<RevealBodyFont, string>>;
  hints?: Partial<Record<RevealBodyFont, string>>;
};

export function RevealBodyFontPicker({
  value,
  onChange,
  disabled = false,
  locked = false,
  onLockedSelect,
  labels,
  hints,
}: RevealBodyFontPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" id="reveal-body-font">
      {REVEAL_BODY_FONT_CATALOG.map((font) => {
        const selected = value === font.id;
        const paid = !font.free;
        return (
          <button
            key={font.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => {
              if (locked && paid) {
                onLockedSelect?.();
                return;
              }
              onChange(font.id);
            }}
            className={`rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-wait disabled:opacity-60 ${
              selected
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            }`}
          >
            <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {labels?.[font.id] ?? font.label}
              {locked && paid ? " — Starter" : ""}
            </span>
            <span
              className="mt-1.5 block text-[0.95rem] leading-snug text-gray-800 dark:text-gray-200"
              style={{ fontFamily: font.cssFamily }}
            >
              {SAMPLE}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">
              {hints?.[font.id] ?? font.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
