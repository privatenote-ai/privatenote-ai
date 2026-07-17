/**
 * Core note creation flow: validate → reserve ID → encrypt → POST ciphertext.
 *
 * Plaintext NEVER leaves this process. The API receives only ciphertext, IV,
 * AAD, and metadata. The decryption key lives exclusively in the URL fragment
 * returned to the caller.
 */

import {
  generateContentKey,
  encryptNote,
  serializeEncryptedPayload,
} from "@shared/noteCrypto";
import { noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { reserveNoteId, createNote } from "./apiClient.ts";
import { getConfig } from "./config.ts";

/** Expiry options exposed by the MCP tool (subset of all server presets). */
export type McpExpiresIn = "15m" | "1h" | "24h" | "7d";

const MCP_EXPIRY_MAP: Record<McpExpiresIn, string> = {
  "15m": "15m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
};

/** Map MCP `expiresIn` string to the canonical preset id used by shared/noteExpiry. */
export function mcpExpiresInToExpirySeconds(expiresIn: McpExpiresIn): number {
  const presetId = MCP_EXPIRY_MAP[expiresIn];
  return noteExpiryPresetIdToSeconds(presetId);
}

export interface CreatePrivateNoteInput {
  content: string;
  expiresIn?: McpExpiresIn;
  burnAfterReading?: boolean;
  title?: string;
}

export interface CreatePrivateNoteOutput {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
}

const MCP_EXPIRES_IN_VALUES: ReadonlySet<string> = new Set<McpExpiresIn>([
  "15m",
  "1h",
  "24h",
  "7d",
]);

export function isMcpExpiresIn(value: string): value is McpExpiresIn {
  return MCP_EXPIRES_IN_VALUES.has(value);
}

/** UTF-8 byte length without importing TextEncoder (Node built-in). */
function utf8ByteLength(s: string): number {
  return Buffer.byteLength(s, "utf8");
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
): Promise<CreatePrivateNoteOutput> {
  // ── Validate ──────────────────────────────────────────────────────────────
  const trimmed = input.content.trim();
  if (!trimmed) {
    throw new Error("Content is required");
  }

  if (utf8ByteLength(input.content) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }

  const expiresIn: McpExpiresIn = input.expiresIn ?? "24h";
  if (!isMcpExpiresIn(expiresIn)) {
    throw new Error(`Invalid expiresIn: must be one of 15m, 1h, 24h, 7d`);
  }

  // burnAfterReading: true → maxReads=1 (free-tier safe); false → maxReads=2 (may fail without premium)
  const maxReads = input.burnAfterReading === false ? 2 : 1;
  const expirySeconds = mcpExpiresInToExpirySeconds(expiresIn);

  // Prepend title as first line if provided (local transform before encryption)
  const plaintext =
    input.title ? `${input.title}\n\n${input.content}` : input.content;

  const { apiBaseUrl, webOrigin } = getConfig();

  // ── Reserve ID ────────────────────────────────────────────────────────────
  let id: string;
  try {
    ({ id } = await reserveNoteId(apiBaseUrl));
  } catch {
    throw new Error("Note creation failed");
  }

  // ── Encrypt ───────────────────────────────────────────────────────────────
  let key, exportedKey, encryptedData, iv, aadBytes;
  try {
    ({ key, exportedKey } = await generateContentKey());
    ({ encryptedData, iv, aadBytes } = await encryptNote(plaintext, key, {
      noteId: id,
      expirySeconds,
      maxReads,
    }));
  } catch {
    throw new Error("Note creation failed");
  }

  const { content: encryptedContent, iv: ivBase64, aad } = serializeEncryptedPayload({
    encryptedData,
    iv,
    aadBytes,
  });

  // ── POST ciphertext ───────────────────────────────────────────────────────
  try {
    await createNote(apiBaseUrl, {
      id,
      content: encryptedContent,
      iv: ivBase64,
      aad,
      expirySeconds,
      maxReads,
      isPasswordProtected: false,
      _hp: "",
      aiMode: false,
    });
  } catch (err) {
    // Preserve API error messages (e.g. "requires Premium") but strip any
    // echo of content by catching broadly here.
    const msg = err instanceof Error ? err.message : "Note creation failed";
    throw new Error(msg);
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  return {
    secureUrl,
    expiresAt,
    burnAfterReading: maxReads === 1,
  };
}
