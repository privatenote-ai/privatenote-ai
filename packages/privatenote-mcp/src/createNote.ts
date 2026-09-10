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
import { NOTE_EXPIRY_PRESETS, noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { NOTE_FILE_ATTACHMENTS_HARD_MAX } from "@shared/noteFileLimits";
import {
  createNote,
  reserveNoteId,
  uploadEncryptedAttachment,
} from "./apiClient.ts";
import { getConfig } from "./config.ts";
import { encryptFileToSodiumBlob, singleBlobEncryptedSizeUpperBound } from "./encryptAttachment.ts";
import { readStoredSession } from "./sessionStore.ts";

/** MCP expiry: all server presets, plus `24h` as an alias of `1d`. */
export const MCP_EXPIRES_IN = [
  ...NOTE_EXPIRY_PRESETS.map((preset) => preset.id),
  "24h",
] as const;

export type McpExpiresIn = (typeof MCP_EXPIRES_IN)[number];

const MCP_EXPIRES_IN_VALUES: ReadonlySet<string> = new Set(MCP_EXPIRES_IN);

/** Map MCP `expiresIn` string to seconds used by shared/noteExpiry. */
export function mcpExpiresInToExpirySeconds(expiresIn: McpExpiresIn): number {
  const presetId = expiresIn === "24h" ? "1d" : expiresIn;
  return noteExpiryPresetIdToSeconds(presetId);
}

export interface CreatePrivateNoteInput {
  content?: string;
  contentFilePath?: string;
  expiresIn?: McpExpiresIn;
  burnAfterReading?: boolean;
  title?: string;
  filePath?: string;
  filePaths?: string[];
}

export interface CreatePrivateNoteOutput {
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
  attachedFileName?: string;
  attachedFileNames?: string[];
}

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

type LocalAttachment = {
  path: string;
  bytes: Uint8Array;
  name: string;
  type: string;
};

function uniquePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of paths) {
    const path = raw.trim();
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push(path);
  }
  return out;
}

async function readUtf8SecretFile(path: string): Promise<string> {
  try {
    const info = await stat(path);
    if (!info.isFile()) {
      throw new Error("contentFilePath must point to a file");
    }
    if (info.size <= 0) {
      throw new Error("The content file is empty");
    }
    if (info.size > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
      throw new Error("Content too large (max 50 KB)");
    }
  } catch (err) {
    if (err instanceof Error && /contentFilePath|empty|too large/.test(err.message)) {
      throw err;
    }
    throw new Error("Could not read the file at contentFilePath");
  }
  const text = await readFile(path, "utf8");
  if (utf8ByteLength(text) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }
  return text;
}

async function readAttachmentFile(path: string): Promise<LocalAttachment> {
  try {
    const info = await stat(path);
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
    if (err instanceof Error && /filePath|empty|too large/.test(err.message)) {
      throw err;
    }
    throw new Error("Could not read the file at filePath");
  }
  const bytes = new Uint8Array(await readFile(path));
  const name = basename(path).slice(0, 255) || "privatenote-file";
  return { path, bytes, name, type: guessMimeType(name) };
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
): Promise<CreatePrivateNoteOutput> {
  const attachmentPaths = uniquePaths([
    ...(input.filePath ? [input.filePath] : []),
    ...(input.filePaths ?? []),
  ]);
  const contentFilePath = input.contentFilePath?.trim();
  let content = input.content ?? "";
  if (contentFilePath) {
    content = await readUtf8SecretFile(contentFilePath);
  }
  const trimmed = content.trim();
  if (!trimmed && attachmentPaths.length === 0) {
    throw new Error(
      "Content is required (or pass contentFilePath, filePath, or filePaths)",
    );
  }

  if (utf8ByteLength(content) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }

  if (attachmentPaths.length > NOTE_FILE_ATTACHMENTS_HARD_MAX) {
    throw new Error(`Too many files (max ${NOTE_FILE_ATTACHMENTS_HARD_MAX})`);
  }

  const expiresIn: McpExpiresIn = input.expiresIn ?? "24h";
  if (!isMcpExpiresIn(expiresIn)) {
    throw new Error(`Invalid expiresIn: must be one of ${MCP_EXPIRES_IN.join(", ")}`);
  }

  const maxReads = input.burnAfterReading === false ? 2 : 1;
  const expirySeconds = mcpExpiresInToExpirySeconds(expiresIn);

  const plaintextBody = trimmed || "Encrypted file attached.";
  const plaintext = input.title ? `${input.title}\n\n${plaintextBody}` : plaintextBody;

  const { apiBaseUrl, webOrigin } = getConfig();

  let attachments: LocalAttachment[] = [];
  if (attachmentPaths.length > 0) {
    const session = await readStoredSession();
    if (!session?.accessToken) {
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
    attachments = [];
    for (const path of attachmentPaths) {
      attachments.push(await readAttachmentFile(path));
    }
  }

  const attachmentBinding =
    attachments.length > 0
      ? {
          attachmentPlaintextSize: attachments[0]!.bytes.byteLength,
          attachmentEncryptedSize: singleBlobEncryptedSizeUpperBound(attachments[0]!.bytes.byteLength),
          attachments: attachments.map((item) => ({
            attachmentPlaintextSize: item.bytes.byteLength,
            attachmentEncryptedSize: singleBlobEncryptedSizeUpperBound(item.bytes.byteLength),
          })),
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
  const attachmentMetadataList: unknown[] = [];
  const attachmentContentHashes: string[] = [];

  if (attachments.length > 0) {
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
      for (let index = 0; index < attachments.length; index += 1) {
        const item = attachments[index]!;
        const encrypted = await encryptFileToSodiumBlob({
          bytes: item.bytes,
          name: item.name,
          type: item.type,
          contentKey: fileWrapKey,
          metadataKey,
          noteId: id,
          attachmentIndex: index,
        });
        attachmentMetadataList.push(encrypted.metadata);
        attachmentContentHashes.push(encrypted.metadata.encryptedContentSha256);
        await uploadEncryptedAttachment({
          apiBaseUrl,
          noteId: id,
          ciphertext: encrypted.ciphertext,
          plaintextSize: item.bytes.byteLength,
          encryptedSize: encrypted.metadata.encryptedSize,
          chunkSha256: encrypted.metadata.encryptedContentSha256,
          uploadToken,
          attachmentIndex: index,
        });
      }
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
      ...(attachmentMetadataList.length > 0 ? { attachments: attachmentMetadataList } : {}),
      ...(attachmentContentHashes.length > 0
        ? {
            attachmentContentHash: attachmentContentHashes[0],
            attachmentContentHashes,
          }
        : {}),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Note creation failed";
    throw new Error(msg);
  }

  const secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();
  const attachedFileNames = attachments.map((item) => item.name);

  return {
    secureUrl,
    expiresAt,
    burnAfterReading: maxReads === 1,
    ...(attachedFileNames[0] ? { attachedFileName: attachedFileNames[0] } : {}),
    ...(attachedFileNames.length > 0 ? { attachedFileNames } : {}),
  };
}
