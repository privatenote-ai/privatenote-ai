/**
 * Allowlisted body typefaces for the revealed note sheet.
 *
 * IDs are snapshotted onto the note at create time (the reveal page is anonymous
 * and cannot look up the sender). Only these tokens may be stored or rendered —
 * never a raw CSS font-family string or a remote @font-face URL.
 */

export const REVEAL_BODY_FONT_IDS = [
  "system",
  "source-serif",
  "fraunces",
  "jetbrains-mono",
] as const;

export type RevealBodyFont = (typeof REVEAL_BODY_FONT_IDS)[number];

/** Stored on the note when the sender picked a non-default face. */
export type StoredRevealBodyFont = Exclude<RevealBodyFont, "system">;

export type RevealBodyFontCatalogEntry = {
  id: RevealBodyFont;
  /** Public family name shown in pickers. */
  label: string;
  /** Short use-case hint. */
  hint: string;
  /** CSS font-family used only via this catalog — never interpolated from user input. */
  cssFamily: string;
  /** Tailwind-safe class applied to `.note-read-content`. */
  className: string;
};

export const REVEAL_BODY_FONT_CATALOG: readonly RevealBodyFontCatalogEntry[] = [
  {
    id: "system",
    label: "Inter",
    hint: "Default — clear and professional",
    cssFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    className: "note-body-font-system",
  },
  {
    id: "source-serif",
    label: "Source Serif 4",
    hint: "Letter and document",
    cssFamily: '"Source Serif 4", Georgia, "Times New Roman", serif',
    className: "note-body-font-source-serif",
  },
  {
    id: "fraunces",
    label: "Fraunces",
    hint: "Warm editorial",
    cssFamily: 'Fraunces, Georgia, "Times New Roman", serif',
    className: "note-body-font-fraunces",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    hint: "Passwords, keys, and code",
    cssFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    className: "note-body-font-jetbrains-mono",
  },
] as const;

const FONT_BY_ID = new Map<RevealBodyFont, RevealBodyFontCatalogEntry>(
  REVEAL_BODY_FONT_CATALOG.map((entry) => [entry.id, entry]),
);

export function isRevealBodyFont(value: unknown): value is RevealBodyFont {
  return typeof value === "string" && (REVEAL_BODY_FONT_IDS as readonly string[]).includes(value);
}

/**
 * Parses a wire value. `"system"`, null, and unknown tokens become `undefined`
 * so callers can omit the field rather than persist a default.
 */
export function parseRevealBodyFont(raw: unknown): StoredRevealBodyFont | undefined {
  if (raw == null) return undefined;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "system") return undefined;
  if (trimmed === "source-serif" || trimmed === "fraunces" || trimmed === "jetbrains-mono") {
    return trimmed;
  }
  return undefined;
}

export function revealBodyFontEntry(
  id: RevealBodyFont | null | undefined,
): RevealBodyFontCatalogEntry {
  return FONT_BY_ID.get(id ?? "system") ?? REVEAL_BODY_FONT_CATALOG[0];
}

export function revealBodyFontClassName(
  id: RevealBodyFont | null | undefined,
): string {
  return revealBodyFontEntry(id).className;
}
