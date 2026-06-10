/** Set by the Pages /api proxy so the Worker sees the browser IP, not the internal fetch hop. */
export const PN_CLIENT_IP_HEADER = "x-pn-client-ip";

/** Already set by `functions/api/[[path]].ts` — marks requests proxied from the SPA host. */
export const PN_FORWARDED_HOST_HEADER = "x-forwarded-host";

export function readClientIpFromRequestHeaders(
  headers: Pick<Headers, "get">,
): string | null {
  const forwardedHost = headers.get(PN_FORWARDED_HOST_HEADER)?.trim();
  if (forwardedHost) {
    const forwardedIp = headers.get(PN_CLIENT_IP_HEADER)?.trim();
    if (forwardedIp) {
      return forwardedIp;
    }
  }
  return headers.get("CF-Connecting-IP")?.trim() || null;
}
