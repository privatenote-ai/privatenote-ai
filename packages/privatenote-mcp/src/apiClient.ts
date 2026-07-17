/**
 * Minimal PrivateNote API client for the MCP server.
 *
 * No Origin header is sent (Node fetch default), so CORS pre-flight is not
 * triggered. No session cookies — the server treats this as an anonymous
 * request, so only free-tier limits apply (maxReads=1, expiry ≤ 7d).
 */

export interface ReserveNoteResult {
  id: string;
}

export interface CreateNoteBody {
  id: string;
  content: string;
  iv: string;
  aad: string;
  expirySeconds: number;
  maxReads: number;
  isPasswordProtected: boolean;
  _hp: string;
  aiMode: boolean;
}

export interface CreateNoteResult {
  id: string;
}

export async function reserveNoteId(apiBaseUrl: string): Promise<ReserveNoteResult> {
  const res = await fetch(`${apiBaseUrl}/api/notes/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Note reservation failed (${res.status})`);
  }

  const body = (await res.json()) as Record<string, unknown>;
  if (typeof body["id"] !== "string") {
    throw new Error("Note reservation response missing id");
  }

  return { id: body["id"] as string };
}

export async function createNote(
  apiBaseUrl: string,
  body: CreateNoteBody,
): Promise<CreateNoteResult> {
  const res = await fetch(`${apiBaseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const json = (await res.json()) as Record<string, unknown>;
      if (typeof json["error"] === "string") detail = `: ${json["error"] as string}`;
    } catch {
      // ignore
    }
    throw new Error(`Note creation failed (${res.status})${detail}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  if (typeof json["id"] !== "string") {
    throw new Error("Note creation response missing id");
  }

  return { id: json["id"] as string };
}
