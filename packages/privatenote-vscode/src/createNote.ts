/**
 * Validate input, reserve an ID, encrypt locally, POST ciphertext.
 * Plaintext never leaves this process. The decryption key is returned only
 * inside the URL fragment.
 */

import {
  generateContentKey,
  encryptNote,
  serializeEncryptedPayload,
} from "@shared/noteCrypto";
import { noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { reserveNoteId, createNote as apiCreateNote } from "./apiClient.ts";
import { detectEditorCreationSource } from "./editorSource.ts";

export type ExpiresIn = "15m" | "1h" | "24h" | "7d";

const EXPIRY_MAP: Record<ExpiresIn, string> = {
  "15m": "15m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
};

const VALID_EXPIRES: ReadonlySet<string> = new Set<ExpiresIn>(["15m", "1h", "24h", "7d"]);

export function isExpiresIn(value: string): value is ExpiresIn {
  return VALID_EXPIRES.has(value);
}

export function expiresInToSeconds(expiresIn: ExpiresIn): number {
  return noteExpiryPresetIdToSeconds(EXPIRY_MAP[expiresIn]);
}

export interface CreatePrivateNoteInput {
  content: string;
  expiresIn?: ExpiresIn;
  burnAfterReading?: boolean;
  title?: string;
  apiBaseUrl: string;
  webOrigin: string;
}

export interface CreatePrivateNoteOutput {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
): Promise<CreatePrivateNoteOutput> {
  const trimmed = input.content.trim();
  if (!trimmed) {
    throw new Error("Content cannot be empty");
  }

  const utf8Length = Buffer.byteLength(input.content, "utf8");
  if (utf8Length > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error(`Content too large (max ${MAX_NOTE_PLAINTEXT_UTF8_BYTES / 1024} KB)`);
  }

  const expiresIn = input.expiresIn ?? "24h";
  if (!isExpiresIn(expiresIn)) {
    throw new Error("Invalid expiresIn — must be 15m, 1h, 24h, or 7d");
  }

  const burnAfterReading = input.burnAfterReading !== false;
  const maxReads = burnAfterReading ? 1 : 2;
  const expirySeconds = expiresInToSeconds(expiresIn);

  const plaintext = input.title
    ? `${input.title}\n\n${input.content}`
    : input.content;

  const apiBaseUrl = input.apiBaseUrl.replace(/\/$/, "");
  const webOrigin = input.webOrigin.replace(/\/$/, "");

  const { id } = await reserveNoteId(apiBaseUrl);

  const { key, exportedKey } = await generateContentKey();
  const { encryptedData, iv, aadBytes } = await encryptNote(plaintext, key, {
    noteId: id,
    expirySeconds,
    maxReads,
  });

  const { content, iv: ivBase64, aad } = serializeEncryptedPayload({
    encryptedData,
    iv,
    aadBytes,
  });

  await apiCreateNote(apiBaseUrl, {
    id,
    content,
    iv: ivBase64,
    aad,
    expirySeconds,
    maxReads,
    isPasswordProtected: false,
    _hp: "",
    aiMode: false,
    creationSource: detectEditorCreationSource(),
    creationEntryPoint: "extension",
  });

  const secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  return {
    secureUrl,
    expiresAt,
    burnAfterReading,
  };
}
