/**
 * Allowlisted body typefaces for the revealed note sheet.
 *
 * IDs are snapshotted onto the note at create time (the reveal page is anonymous
 * and cannot look up the sender). Only these tokens may be stored or rendered —
 * never a raw CSS font-family string or a remote @font-face URL.
 */

export const REVEAL_BODY_FONT_IDS = [
  "system",
  "satoshi",
  "source-serif",
  "ibm-plex-serif",
  "fraunces",
  "jetbrains-mono",
] as const;

export type RevealBodyFont = (typeof REVEAL_BODY_FONT_IDS)[number];

/** Stored on the note when the sender picked a non-default face. */
export type StoredRevealBodyFont = Exclude<RevealBodyFont, "system">;

export type RevealBodyFontPlan = "free" | "starter" | "business";

export type RevealBodyFontAccess = {
  starter: boolean;
  business: boolean;
};

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
  /** Free plan may pick these; others need Starter unless `plan` is business. */
  free: boolean;
  /** Paid faces: Starter+ unless `"business"`. */
  plan: RevealBodyFontPlan;
};

export const REVEAL_BODY_FONT_CATALOG: readonly RevealBodyFontCatalogEntry[] = [
  {
    id: "system",
    label: "Inter",
    hint: "Default — clear and professional",
    cssFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    className: "note-body-font-system",
    free: true,
    plan: "free",
  },
  {
    id: "satoshi",
    label: "Satoshi",
    hint: "Modern geometric sans",
    cssFamily: 'Satoshi, Inter, ui-sans-serif, system-ui, sans-serif',
    className: "note-body-font-satoshi",
    free: true,
    plan: "free",
  },
  {
    id: "source-serif",
    label: "Source Serif 4",
    hint: "Letter and document",
    cssFamily: '"Source Serif 4", Georgia, "Times New Roman", serif',
    className: "note-body-font-source-serif",
    free: false,
    plan: "starter",
  },
  {
    id: "ibm-plex-serif",
    label: "IBM Plex Serif",
    hint: "Client letter and contract",
    cssFamily: '"IBM Plex Serif", Georgia, "Times New Roman", serif',
    className: "note-body-font-ibm-plex-serif",
    free: false,
    plan: "business",
  },
  {
    id: "fraunces",
    label: "Fraunces",
    hint: "Warm editorial",
    cssFamily: 'Fraunces, Georgia, "Times New Roman", serif',
    className: "note-body-font-fraunces",
    free: false,
    plan: "starter",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    hint: "Passwords, keys, and code",
    cssFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    className: "note-body-font-jetbrains-mono",
    free: false,
    plan: "starter",
  },
] as const;

const FONT_BY_ID = new Map<RevealBodyFont, RevealBodyFontCatalogEntry>(
  REVEAL_BODY_FONT_CATALOG.map((entry) => [entry.id, entry]),
);

export function isRevealBodyFont(value: unknown): value is RevealBodyFont {
  return typeof value === "string" && (REVEAL_BODY_FONT_IDS as readonly string[]).includes(value);
}

export function isFreeRevealBodyFont(id: RevealBodyFont | null | undefined): boolean {
  return revealBodyFontEntry(id).free;
}

/**
 * Parses a wire value. `"system"`, null, and unknown tokens become `undefined`
 * so callers can omit the field rather than persist a default.
 */
export function parseRevealBodyFont(raw: unknown): StoredRevealBodyFont | undefined {
  if (raw == null) return undefined;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!isRevealBodyFont(trimmed) || trimmed === "system") return undefined;
  return trimmed;
}

export function mayChooseRevealBodyFont(
  id: RevealBodyFont,
  access: RevealBodyFontAccess,
): boolean {
  const plan = revealBodyFontEntry(id).plan;
  if (plan === "free") return true;
  if (plan === "business") return access.business;
  return access.starter;
}

export function mayStoreRevealBodyFont(
  id: StoredRevealBodyFont,
  access: RevealBodyFontAccess,
): boolean {
  return mayChooseRevealBodyFont(id, access);
}

export function revealBodyFontUpgradePlan(
  id: RevealBodyFont,
): Exclude<RevealBodyFontPlan, "free"> | null {
  const plan = revealBodyFontEntry(id).plan;
  return plan === "free" ? null : plan;
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
