/**
 * Minimal PrivateNote API client for the CLI.
 */

import { parseCreateResponse, parseReserveResponse, type ReserveNoteResult } from "./responseValidation.ts";

export type { ReserveNoteResult };

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
}

async function request(
  url: string,
  method: string,
  body?: unknown,
): Promise<{ status: number; json: () => Promise<unknown> }> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      redirect: "error",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/redirect/i.test(message)) {
      throw new Error(`Request to ${url} was redirected. Refusing to follow redirects for security.`);
    }
    throw error;
  }

  return {
    status: res.status,
    json: () => res.json() as Promise<unknown>,
  };
}

export async function reserveNoteId(apiBaseUrl: string): Promise<ReserveNoteResult> {
  const res = await request(`${apiBaseUrl}/api/notes/reserve`, "POST");

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Note reservation failed (${res.status})`);
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error("Note reservation response is not valid JSON");
  }
  return parseReserveResponse(body);
}

export async function createNote(apiBaseUrl: string, body: CreateNoteBody): Promise<void> {
  const res = await request(`${apiBaseUrl}/api/notes`, "POST", body);

  if (res.status < 200 || res.status >= 300) {
    let detail = "";
    try {
      const json = (await res.json()) as Record<string, unknown>;
      if (typeof json["error"] === "string") detail = `: ${json["error"]}`;
    } catch {
      // ignore
    }
    let message = `Note creation failed (${res.status})${detail}`;
    if (/expirySeconds/i.test(detail) && body.expirySeconds === 15 * 60) {
      message +=
        ". The API does not accept --expire 15m yet (deploy the latest server, or use 10m/30m/1h).";
    }
    throw new Error(message);
  }

  let responseBody: unknown;
  try {
    responseBody = await res.json();
  } catch {
    throw new Error("Note creation response is not valid JSON");
  }
  parseCreateResponse(responseBody, body.id);
}
