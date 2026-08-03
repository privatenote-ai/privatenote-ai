/**
 * Strict JSON shape checks for API success responses.
 */

import { isValidNoteId } from "@shared/noteId";

export type ReserveNoteResult = {
  id: string;
};

function assertPlainObject(body: unknown, label: string): Record<string, unknown> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new Error(`${label} is not a JSON object`);
  }
  return body as Record<string, unknown>;
}

function assertOnlyKeys(record: Record<string, unknown>, allowedKeys: ReadonlySet<string>, label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`${label} has unexpected field "${key}"`);
    }
  }
}

export function parseReserveResponse(body: unknown): ReserveNoteResult {
  const record = assertPlainObject(body, "Note reservation response");
  assertOnlyKeys(record, new Set(["id", "uploadToken", "expiresIn"]), "Note reservation response");

  const id = record["id"];
  const uploadToken = record["uploadToken"];
  const expiresIn = record["expiresIn"];

  if (typeof id !== "string" || !isValidNoteId(id)) {
    throw new Error("Note reservation response missing a valid note id");
  }
  if (typeof uploadToken !== "string" || uploadToken.trim().length === 0) {
    throw new Error("Note reservation response missing a valid upload token");
  }
  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error("Note reservation response missing a valid expiresIn");
  }

  return { id };
}

export function parseCreateResponse(body: unknown, expectedId: string): void {
  const record = assertPlainObject(body, "Note creation response");
  assertOnlyKeys(record, new Set(["id"]), "Note creation response");

  const id = record["id"];
  if (typeof id !== "string" || !isValidNoteId(id)) {
    throw new Error("Note creation response missing a valid note id");
  }
  if (id !== expectedId) {
    throw new Error("Note creation response id does not match the reserved note id");
  }
}
