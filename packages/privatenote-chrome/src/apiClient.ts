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
  creationSource: string;
  creationEntryPoint: string;
  keyDerivation?: string;
  salt?: string;
  encryptedKeyIv?: string;
  kdfParams?: unknown;
}

async function request<T>(
  url: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = (await res.json()) as { message?: string; error?: string };
      if (typeof errBody.message === "string" && errBody.message) {
        detail = errBody.message;
      } else if (typeof errBody.error === "string" && errBody.error) {
        detail = errBody.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  return (await res.json()) as T;
}

export async function reserveNoteId(apiBaseUrl: string): Promise<ReserveNoteResult> {
  return request<ReserveNoteResult>(`${apiBaseUrl}/api/notes/reserve`, "POST");
}

export async function createNote(
  apiBaseUrl: string,
  body: CreateNoteBody,
): Promise<void> {
  await request(`${apiBaseUrl}/api/notes`, "POST", body);
}
