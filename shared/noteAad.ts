/**
 * Client AES-GCM AAD: canonical JSON UTF-8 bytes (then base64 on the wire).
 *
 * Shape: `{ "exp": number, "id": string, "reads": number }` with exactly those keys
 * (alphabetical in `buildNoteAadPlaintext` for a single unambiguous serialization).
 */

export type ParsedNoteAad = {
  noteId: string;
  expirySeconds: number;
  maxReads: number;
};

/** Binding fields for AES-GCM additional authenticated data on new notes (always required when encrypting). */
export type NoteAadBinding = {
  noteId: string;
  expirySeconds: number;
  maxReads: number;
};

/** UTF-8 bytes of the canonical JSON AAD (use in crypto; encode for wire only at API boundaries). */
export function buildNoteAadBytes(binding: NoteAadBinding): Uint8Array {
  return new TextEncoder().encode(
    buildNoteAadPlaintext(binding.noteId, binding.expirySeconds, binding.maxReads),
  );
}

/**
 * Standard Base64 for the JSON request `aad` field. Server decodes with {@link decodeNoteAadBase64}.
 * Keep crypto code on raw bytes; call this only when serializing to storage/transport.
 */
export function encodeNoteAadBytesForWire(aadBytes: Uint8Array): string {
  const copy = new Uint8Array(aadBytes.byteLength);
  copy.set(aadBytes);
  let binary = "";
  for (let i = 0; i < copy.byteLength; i++) {
    binary += String.fromCharCode(copy[i]!);
  }
  return typeof globalThis.btoa === "function"
    ? globalThis.btoa(binary)
    : // Node (unit tests): Buffer is available without importing in node:test
      Buffer.from(copy).toString("base64");
}

/** Deterministic AAD plaintext for binding note id, TTL, and read cap to ciphertext. */
export function buildNoteAadPlaintext(noteId: string, expirySeconds: number, maxReads: number): string {
  return JSON.stringify({
    exp: expirySeconds,
    id: noteId,
    reads: maxReads,
  });
}

/** Decode standard or base64url AAD payload to UTF-8 plaintext. */
export function decodeNoteAadBase64(base64: string): string | null {
  try {
    const normalized = base64.trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function parseNoteAadPlaintext(plaintext: string): ParsedNoteAad | null {
  try {
    const trimmed = plaintext.trim();
    if (!trimmed.startsWith("{")) {
      return null;
    }
    const o = JSON.parse(trimmed) as unknown;
    if (o === null || typeof o !== "object" || Array.isArray(o)) {
      return null;
    }
    const rec = o as Record<string, unknown>;
    const keys = Object.keys(rec);
    if (keys.length !== 3 || !keys.includes("exp") || !keys.includes("id") || !keys.includes("reads")) {
      return null;
    }
    const id = rec.id;
    const exp = rec.exp;
    const reads = rec.reads;
    if (typeof id !== "string" || id.length === 0) {
      return null;
    }
    if (typeof exp !== "number" || !Number.isFinite(exp) || exp !== Math.trunc(exp)) {
      return null;
    }
    if (typeof reads !== "number" || !Number.isFinite(reads) || reads !== Math.trunc(reads) || reads < 0) {
      return null;
    }
    return { noteId: id, expirySeconds: exp, maxReads: reads };
  } catch {
    return null;
  }
}
