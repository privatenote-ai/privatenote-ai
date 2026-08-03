const DEFAULT_MAX_WORDS = 3;
/** Max characters kept from the file stem (before ellipsis + extension). */
const MAX_STEM_CHARS = 20;

function truncateStem(stem: string, maxChars: number): string {
  if (stem.length <= maxChars) return stem;
  return stem.slice(0, maxChars).trimEnd();
}

/**
 * Compact attachment label for buttons, chips, and progress copy — keeps the
 * extension and a short stem so action rows and dialogs do not overflow on
 * mobile.
 */
export function formatAttachmentDisplayName(
  fileName: string,
  maxWords = DEFAULT_MAX_WORDS,
): string {
  const trimmed = fileName.trim();
  if (!trimmed) return fileName;

  const lastDot = trimmed.lastIndexOf(".");
  const hasExtension = lastDot > 0 && lastDot < trimmed.length - 1;
  const baseName = hasExtension ? trimmed.slice(0, lastDot) : trimmed;
  const extension = hasExtension ? trimmed.slice(lastDot) : "";

  const tokens = baseName.split(/[\s._-]+/).filter(Boolean);
  if (tokens.length === 0) return trimmed;

  const fitsAsIs =
    baseName.length <= MAX_STEM_CHARS && tokens.length <= maxWords;
  if (fitsAsIs) {
    return trimmed;
  }

  const head = truncateStem(tokens.slice(0, maxWords).join(" "), MAX_STEM_CHARS);
  return extension ? `${head}…${extension}` : `${head}…`;
}
