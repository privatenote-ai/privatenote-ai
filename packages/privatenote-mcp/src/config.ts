/**
 * Runtime configuration read from environment variables.
 * Both variables default to https://privatenote.ai for production use;
 * override when testing locally (e.g. PRIVATENOTE_API_BASE_URL=http://127.0.0.1:8787).
 */
export function getConfig() {
  const apiBaseUrl =
    process.env["PRIVATENOTE_API_BASE_URL"]?.replace(/\/$/, "") ??
    "https://privatenote.ai";

  const webOrigin =
    process.env["PRIVATENOTE_WEB_ORIGIN"]?.replace(/\/$/, "") ?? apiBaseUrl;

  return { apiBaseUrl, webOrigin };
}
