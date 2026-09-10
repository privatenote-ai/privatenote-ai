/**
 * Core note creation flow: validate → reserve ID → encrypt → POST ciphertext.
 *
 * Plaintext NEVER leaves this process. The API receives only ciphertext, IV,
 * AAD, and metadata. The decryption key lives exclusively in the URL fragment
 * returned to the caller.
 */

import { basename } from "node:path";
import { readFile, stat } from "node:fs/promises";
import {
  generateContentKey,
  encryptNote,
  serializeEncryptedPayload,
} from "@shared/noteCrypto";
import { deriveNoteRootKeys, generateRootKeyBytes } from "@shared/noteRootKeys";
import { NOTE_KEY_DERIVATION_HKDF_ROOT_V2 } from "@shared/storedNotePayload";
import { noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import {
  createNote,
  reserveNoteId,
  uploadEncryptedAttachment,
} from "./apiClient.ts";
import { getConfig } from "./config.ts";
import { encryptFileToSodiumBlob, singleBlobEncryptedSizeUpperBound } from "./encryptAttachment.ts";
import { readStoredSession } from "./sessionStore.ts";

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
  content?: string;
  expiresIn?: McpExpiresIn;
  burnAfterReading?: boolean;
  title?: string;
  filePath?: string;
}

export interface CreatePrivateNoteOutput {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
  attachedFileName?: string;
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

function utf8ByteLength(s: string): number {
  return Buffer.byteLength(s, "utf8");
}

function guessMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    txt: "text/plain",
    csv: "text/csv",
    json: "application/json",
    zip: "application/zip",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    mp4: "video/mp4",
  };
  return (ext && types[ext]) || "application/octet-stream";
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
): Promise<CreatePrivateNoteOutput> {
  const filePath = input.filePath?.trim();
  const content = input.content ?? "";
  const trimmed = content.trim();
  if (!trimmed && !filePath) {
    throw new Error("Content is required (or pass filePath to attach a file)");
  }

  if (utf8ByteLength(content) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }

  const expiresIn: McpExpiresIn = input.expiresIn ?? "24h";
  if (!isMcpExpiresIn(expiresIn)) {
    throw new Error(`Invalid expiresIn: must be one of 15m, 1h, 24h, 7d`);
  }

  const maxReads = input.burnAfterReading === false ? 2 : 1;
  const expirySeconds = mcpExpiresInToExpirySeconds(expiresIn);

  const plaintextBody = trimmed || "Encrypted file attached.";
  const plaintext = input.title ? `${input.title}\n\n${plaintextBody}` : plaintextBody;

  const { apiBaseUrl, webOrigin } = getConfig();

  let fileBytes: Uint8Array | null = null;
  let fileName: string | undefined;
  let fileType = "application/octet-stream";
  if (filePath) {
    const session = await readStoredSession();
    if (!session?.accessToken) {
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
    try {
      const info = await stat(filePath);
      if (!info.isFile()) {
        throw new Error("filePath must point to a file");
      }
      if (info.size <= 0) {
        throw new Error("The attached file is empty");
      }
      if (info.size > 1024 * 1024 * 1024) {
        throw new Error("File is too large to attach from MCP (max 1 GB)");
      }
    } catch (err) {
      if (err instanceof Error && /Sign in|filePath|empty|too large/.test(err.message)) {
        throw err;
      }
      throw new Error("Could not read the file at filePath");
    }
    fileBytes = new Uint8Array(await readFile(filePath));
    fileName = basename(filePath).slice(0, 255) || "privatenote-file";
    fileType = guessMimeType(fileName);
  }

  const attachmentBinding =
    fileBytes && fileName
      ? {
          attachmentPlaintextSize: fileBytes.byteLength,
          attachmentEncryptedSize: singleBlobEncryptedSizeUpperBound(fileBytes.byteLength),
          attachments: [
            {
              attachmentPlaintextSize: fileBytes.byteLength,
              attachmentEncryptedSize: singleBlobEncryptedSizeUpperBound(fileBytes.byteLength),
            },
          ],
        }
      : undefined;

  let id: string;
  let uploadToken: string | undefined;
  try {
    ({ id, uploadToken } = await reserveNoteId(apiBaseUrl, attachmentBinding));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Note creation failed";
    throw new Error(msg);
  }

  const aadBinding = { noteId: id, expirySeconds, maxReads };

  let exportedKey: string;
  let encryptedContent: string;
  let ivBase64: string;
  let aad: string;
  let keyDerivation: string | undefined;
  let attachmentMetadata: unknown | undefined;

  if (fileBytes && fileName) {
    if (!uploadToken) {
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
    const { rootKeyBytes, exportedRootKey } = generateRootKeyBytes();
    try {
      const { noteTextKey, fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
      const { encryptedData, iv, aadBytes } = await encryptNote(plaintext, noteTextKey, aadBinding);
      const wire = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
      encryptedContent = wire.content;
      ivBase64 = wire.iv;
      aad = wire.aad;
      exportedKey = exportedRootKey;
      keyDerivation = NOTE_KEY_DERIVATION_HKDF_ROOT_V2;
      const encrypted = await encryptFileToSodiumBlob({
        bytes: fileBytes,
        name: fileName,
        type: fileType,
        contentKey: fileWrapKey,
        metadataKey,
        noteId: id,
      });
      attachmentMetadata = encrypted.metadata;
      await uploadEncryptedAttachment({
        apiBaseUrl,
        noteId: id,
        ciphertext: encrypted.ciphertext,
        plaintextSize: fileBytes.byteLength,
        encryptedSize: encrypted.metadata.encryptedSize,
        chunkSha256: encrypted.metadata.encryptedContentSha256,
        uploadToken,
      });
    } finally {
      rootKeyBytes.fill(0);
    }
  } else {
    try {
      const generated = await generateContentKey();
      exportedKey = generated.exportedKey;
      const { encryptedData, iv, aadBytes } = await encryptNote(plaintext, generated.key, aadBinding);
      const wire = serializeEncryptedPayload({ encryptedData, iv, aadBytes });
      encryptedContent = wire.content;
      ivBase64 = wire.iv;
      aad = wire.aad;
    } catch {
      throw new Error("Note creation failed");
    }
  }

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
      creationSource: "mcp",
      creationEntryPoint: "mcp",
      ...(keyDerivation ? { keyDerivation } : {}),
      ...(attachmentMetadata ? { attachments: [attachmentMetadata] } : {}),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Note creation failed";
    throw new Error(msg);
  }

  const secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  return {
    secureUrl,
    expiresAt,
    burnAfterReading: maxReads === 1,
    ...(fileName ? { attachedFileName: fileName } : {}),
  };
}
