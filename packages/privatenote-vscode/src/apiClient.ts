/**
 * Minimal PrivateNote API client for the VS Code / Cursor extension.
 * Uses Node's built-in `https` module instead of `fetch` — the extension
 * host environment has known issues with the global fetch on some
 * Electron/Cursor versions and proxy configurations.
 */

import * as https from "node:https";
import * as http from "node:http";
import { URL } from "node:url";

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

function request(
  url: string,
  method: string,
  body?: unknown,
): Promise<{ status: number; json: () => Promise<unknown> }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = body !== undefined ? JSON.stringify(body) : undefined;
    const options: http.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const transport = parsed.protocol === "https:" ? https : http;
    const req = transport.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve({
          status: res.statusCode ?? 0,
          json: () => {
            try {
              return Promise.resolve(JSON.parse(raw));
            } catch {
              return Promise.reject(new Error("Invalid JSON response"));
            }
          },
        });
      });
    });

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

export async function reserveNoteId(apiBaseUrl: string): Promise<ReserveNoteResult> {
  const res = await request(`${apiBaseUrl}/api/notes/reserve`, "POST");

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Note reservation failed (${res.status})`);
  }

  const body = (await res.json()) as Record<string, unknown>;
  if (typeof body["id"] !== "string") {
    throw new Error("Note reservation response missing id");
  }
  return { id: body["id"] };
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
    throw new Error(`Note creation failed (${res.status})${detail}`);
  }
}
