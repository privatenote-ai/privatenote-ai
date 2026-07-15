const DEFAULT_MAX_WORDS = 3;
const FULL_NAME_MAX_CHARS = 28;

/**
 * Compact attachment label for buttons and chips — keeps the extension and the
 * first few name tokens so action rows do not overflow.
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

  if (trimmed.length <= FULL_NAME_MAX_CHARS && tokens.length <= maxWords) {
    return trimmed;
  }

  const head = tokens.slice(0, maxWords).join(" ");
  return extension ? `${head}…${extension}` : `${head}…`;
}
