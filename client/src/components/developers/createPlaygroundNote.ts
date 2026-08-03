import { apiRequest } from "@/lib/queryClient";
import {
  encryptNote,
  generateContentKey,
  serializeEncryptedPayload,
} from "@shared/noteCrypto";
import { noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import type { NoteCreationSource } from "@shared/noteCreationSource";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { normalizeUrlFragmentKey } from "@shared/urlFragmentKey";

export function formatPlaygroundError(message: string, localSqlHint: string): string {
  if (message.includes("SQL is not enabled for this Durable Object")) {
    return localSqlHint;
  }
  return message;
}

export type PlaygroundExpiresIn = "15m" | "1h" | "24h" | "7d";

const EXPIRY_PRESET: Record<PlaygroundExpiresIn, string> = {
  "15m": "15m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
};

export type PlaygroundNoteResult = {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
};

export async function createPlaygroundNote(input: {
  content: string;
  expiresIn: PlaygroundExpiresIn;
  burnAfterReading: boolean;
  creationSource: Extract<NoteCreationSource, "cli" | "mcp">;
}): Promise<PlaygroundNoteResult> {
  const trimmed = input.content.trim();
  if (!trimmed) {
    throw new Error("Content cannot be empty");
  }

  const utf8Length = new TextEncoder().encode(trimmed).length;
  if (utf8Length > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large");
  }

  const expirySeconds = noteExpiryPresetIdToSeconds(EXPIRY_PRESET[input.expiresIn]);
  const maxReads = input.burnAfterReading ? 1 : 2;

  const { id: reservedId } = await apiRequest<{ id: string }>("/api/notes/reserve", "POST");
  const { key, exportedKey } = await generateContentKey();
  const { encryptedData, iv, aadBytes } = await encryptNote(trimmed, key, {
    noteId: reservedId,
    expirySeconds,
    maxReads,
  });
  const wirePayload = serializeEncryptedPayload({ encryptedData, iv, aadBytes });

  const { id } = await apiRequest<{ id: string }>("/api/notes", "POST", {
    id: reservedId,
    content: wirePayload.content,
    iv: wirePayload.iv,
    aad: wirePayload.aad,
    expirySeconds,
    maxReads,
    isPasswordProtected: false,
    _hp: "",
    aiMode: false,
    creationSource: input.creationSource,
    creationEntryPoint: input.creationSource,
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://privatenote.ai";
  const urlKey = normalizeUrlFragmentKey(exportedKey);
  const secureUrl = `${baseUrl}/note/${id}#${urlKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  return {
    secureUrl,
    expiresAt,
    burnAfterReading: input.burnAfterReading,
  };
}

export function shellEscapeSingleQuoted(value: string): string {
  return value.replace(/'/g, `'\\''`);
}
