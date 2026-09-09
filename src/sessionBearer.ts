/** Session id from an HttpOnly cookie, or from `Authorization: Bearer` (mobile JWT, VS Code / Cursor). */

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  return token ? token : null;
}

export function readSessionIdFromRequest(
  request: Request,
  cookieName: string,
  cookies: Record<string, string>,
): { sessionId: string; fromBearer: boolean } | null {
  const fromCookie = cookies[cookieName];
  if (typeof fromCookie === "string" && fromCookie.length > 0) {
    return { sessionId: fromCookie, fromBearer: false };
  }
  const fromBearer = readBearerToken(request);
  if (fromBearer) {
    return { sessionId: fromBearer, fromBearer: true };
  }
  return null;
}
