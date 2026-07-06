/** Symbols that are unlikely to break shell quoting, markdown, chat formatting, or URLs when copy-pasted. */
export const TRANSPORT_SAFE_PASSWORD_SYMBOLS = "-_.~=";

/** Default length for “strong” random passwords (≈130+ bits with the transport-safe charset). */
export const DEFAULT_STRONG_PASSWORD_LENGTH = 22;

export const TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
  TRANSPORT_SAFE_PASSWORD_SYMBOLS;
