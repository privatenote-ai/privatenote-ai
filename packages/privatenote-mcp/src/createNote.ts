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
import { deriveNoteRootKeys, generateRootKeyBytes } from "@shared/noteRootKeys";
import { NOTE_KEY_DERIVATION_HKDF_ROOT_V2 } from "@shared/storedNotePayload";
import { NOTE_EXPIRY_PRESETS, noteExpiryPresetIdToSeconds } from "@shared/noteExpiry";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { NOTE_FILE_ATTACHMENTS_HARD_MAX } from "@shared/noteFileLimits";
import { wrapRootKeyWithPasswordNote } from "./passwordWrap.ts";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import {
  createNote,
  reserveNoteId,
  uploadEncryptedAttachment,
} from "./apiClient.ts";
import { inspectBoundFile, reopenAndVerifyBoundFile, wipeInspectedBytes, type BoundFileIdentity, type InspectedBoundFile } from "./boundFile.ts";
import { getConfig } from "./config.ts";
import { encryptFileToSodiumBlob, singleBlobEncryptedSizeUpperBound } from "./encryptAttachment.ts";
import { isSendChannel, type BoundSendAuthorization, type SendChannel } from "./sendChannels.ts";
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
  password?: string;
  passwordFilePath?: string;
  recipientEmail?: string;
  requireRecipientVerification?: boolean;
  notifyOnOpen?: boolean;
  label?: string;
  sendChannel?: SendChannel;
  sendRecipient?: string;
}

/** Opt-in flag the API replaces with the signed-in Business account snapshot. */
export const MCP_ACCOUNT_BRANDING_REQUEST = true as const;

export interface CreatePrivateNoteOutput {
  noteId: string;
  secureUrl: string;
  expiresAt: string;
  burnAfterReading: boolean;
  passwordProtected?: boolean;
  attachedFileName?: string;
  attachedFileNames?: string[];
  recipientVerification?: boolean;
  notifyOnOpen?: boolean;
  accountBranding?: boolean;
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

async function readPasswordFile(path: string): Promise<string> {
  const inspected = await inspectBoundFile(path, "passwordFilePath");
  try {
    const text = Buffer.from(inspected.bytes).toString("utf8").trim();
    if (!text) {
      throw new Error("The password file is empty");
    }
    return text;
  } finally {
    inspected.bytes.fill(0);
  }
}

async function resolveNotePassword(input: CreatePrivateNoteInput): Promise<string | null> {
  const fromFile = input.passwordFilePath?.trim();
  if (fromFile) {
    return readPasswordFile(fromFile);
  }
  const direct = input.password?.trim();
  return direct || null;
}

async function readUtf8SecretFile(path: string): Promise<string> {
  const inspected = await inspectBoundFile(path, "contentFilePath");
  try {
    const text = Buffer.from(inspected.bytes).toString("utf8");
    if (utf8ByteLength(text) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
      throw new Error("Content too large (max 50 KB)");
    }
    return text;
  } finally {
    inspected.bytes.fill(0);
  }
}

async function readAttachmentFile(path: string): Promise<LocalAttachment> {
  const inspected = await inspectBoundFile(path, "filePath");
  return {
    path: inspected.resolvedPath,
    bytes: inspected.bytes,
    name: inspected.name,
    type: guessMimeType(inspected.name),
  };
}

export type NotePreviewFile = {
  path: string;
  name: string;
  bytes: number;
  contentSha256: string;
};

export type NotePreview = {
  contentFromFile: boolean;
  contentFromChat: boolean;
  contentBytes: number | null;
  contentFilePath: string | null;
  attachedFiles: NotePreviewFile[];
  passwordProtected: boolean;
  passwordFromFile: boolean;
  expiresIn: McpExpiresIn;
  burnAfterReading: boolean;
  title: string | null;
  recipientEmail: string | null;
  requireRecipientVerification: boolean;
  notifyOnOpen: boolean;
  label: string | null;
  sendChannel: SendChannel | null;
  sendRecipient: string | null;
  accountBranding: boolean;
};

export type BoundNoteOptions = {
  expiresIn: McpExpiresIn;
  burnAfterReading: boolean;
  title: string | null;
  recipientEmail: string | null;
  requireRecipientVerification: boolean;
  notifyOnOpen: boolean;
  label: string | null;
  accountBranding: boolean;
};

export type PreloadedSecrets = {
  content?: string;
  password?: string | null;
  attachments?: LocalAttachment[];
};

export type PreparedBoundCreate = {
  preview: NotePreview;
  boundFiles: BoundFileIdentity[];
  inspected: InspectedBoundFile[];
  sendAuthorization: BoundSendAuthorization;
  options: BoundNoteOptions;
};

export function resolveSendAuthorization(input: CreatePrivateNoteInput): BoundSendAuthorization {
  const channel = input.sendChannel?.trim();
  const recipient = input.sendRecipient?.trim();
  if (!channel && !recipient) {
    return { requested: false };
  }
  if (!channel || !recipient) {
    throw new Error("sendChannel and sendRecipient must both be set to authorize delivery.");
  }
  if (!isSendChannel(channel)) {
    throw new Error("sendChannel must be email, slack, discord, teams, or whatsapp.");
  }
  if (channel === "email" && !isPlausibleEmailFormat(recipient.toLowerCase())) {
    throw new Error("sendRecipient must be a valid email when sendChannel is email.");
  }
  return { requested: true, channel, recipient: channel === "email" ? recipient.toLowerCase() : recipient };
}

export async function prepareBoundCreate(input: CreatePrivateNoteInput): Promise<PreparedBoundCreate> {
  const attachmentPaths = uniquePaths([
    ...(input.filePath ? [input.filePath] : []),
    ...(input.filePaths ?? []),
  ]);
  const contentFilePath = input.contentFilePath?.trim() || "";
  const passwordFilePath = input.passwordFilePath?.trim() || "";
  const chatContent = contentFilePath ? "" : (input.content ?? "");

  if (!chatContent.trim() && !contentFilePath && attachmentPaths.length === 0) {
    throw new Error(
      "Content is required (or pass contentFilePath, filePath, or filePaths)",
    );
  }
  if (utf8ByteLength(chatContent) > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }
  if (attachmentPaths.length > NOTE_FILE_ATTACHMENTS_HARD_MAX) {
    throw new Error(`Too many files (max ${NOTE_FILE_ATTACHMENTS_HARD_MAX})`);
  }

  const expiresIn: McpExpiresIn = input.expiresIn ?? "24h";
  if (!isMcpExpiresIn(expiresIn)) {
    throw new Error(`Invalid expiresIn: must be one of ${MCP_EXPIRES_IN.join(", ")}`);
  }

  const recipientEmail = input.recipientEmail?.trim().toLowerCase() || null;
  const requireRecipientVerification = input.requireRecipientVerification === true;
  if (requireRecipientVerification) {
    if (!recipientEmail || !isPlausibleEmailFormat(recipientEmail)) {
      throw new Error("Recipient verification needs a valid recipientEmail.");
    }
  }

  const sendAuthorization = resolveSendAuthorization(input);
  const inspected: InspectedBoundFile[] = [];

  let contentBytes: number | null = chatContent ? utf8ByteLength(chatContent) : null;
  let resolvedContentPath: string | null = null;
  if (contentFilePath) {
    const file = await inspectBoundFile(contentFilePath, "contentFilePath");
    inspected.push(file);
    contentBytes = file.fileSizeBytes;
    resolvedContentPath = file.resolvedPath;
  }

  const attachedFiles: NotePreviewFile[] = [];
  if (attachmentPaths.length > 0) {
    for (const path of attachmentPaths) {
      const file = await inspectBoundFile(path, "filePath");
      inspected.push(file);
      attachedFiles.push({
        path: file.resolvedPath,
        name: file.name,
        bytes: file.fileSizeBytes,
        contentSha256: file.contentSha256,
      });
    }
    const session = await readStoredSession();
    if (!session?.accessToken) {
      wipeInspectedBytes(inspected);
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
  }

  let passwordFromFile = false;
  if (passwordFilePath) {
    const file = await inspectBoundFile(passwordFilePath, "passwordFilePath");
    inspected.push(file);
    passwordFromFile = true;
  }

  const session = await readStoredSession();
  const signedIn = Boolean(session?.accessToken);
  if ((requireRecipientVerification || input.notifyOnOpen === true || input.label?.trim()) && !signedIn) {
    throw new Error("Sign in with the sign_in tool before recipient verification or open notifications.");
  }

  const options: BoundNoteOptions = {
    expiresIn,
    burnAfterReading: input.burnAfterReading !== false,
    title: input.title?.trim() || null,
    recipientEmail,
    requireRecipientVerification,
    notifyOnOpen: input.notifyOnOpen === true,
    label: input.label?.trim() || null,
    accountBranding: signedIn,
  };

  const preview: NotePreview = {
    contentFromFile: Boolean(contentFilePath),
    contentFromChat: Boolean(chatContent.trim()) && !contentFilePath,
    contentBytes,
    contentFilePath: resolvedContentPath,
    attachedFiles,
    passwordProtected: Boolean(passwordFilePath || input.password?.trim()),
    passwordFromFile,
    ...options,
    sendChannel: sendAuthorization.requested ? sendAuthorization.channel : null,
    sendRecipient: sendAuthorization.requested ? sendAuthorization.recipient : null,
  };

  return {
    preview,
    boundFiles: inspected.map(({ bytes: _bytes, ...identity }) => identity),
    inspected,
    sendAuthorization,
    options,
  };
}

export async function previewPrivateNote(input: CreatePrivateNoteInput): Promise<NotePreview> {
  const prepared = await prepareBoundCreate(input);
  wipeInspectedBytes(prepared.inspected);
  return prepared.preview;
}

function formatByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "?";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    const rounded = kb >= 10 ? Math.round(kb) : Math.round(kb * 10) / 10;
    return `${rounded} KB`;
  }
  const mb = bytes / (1024 * 1024);
  const rounded = mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10;
  return `${rounded} MB`;
}

function previewField(label: string, value: string, width = 18): string {
  return `  ${label.padEnd(width)}${value}`;
}

function formatPreviewFiles(files: NotePreviewFile[]): string[] {
  if (files.length === 0) {
    return ["Files", previewField("Attached", "none")];
  }
  const lines = [`Files (${files.length})`];
  for (const file of files) {
    lines.push(`  ${file.name}`);
    lines.push(`    ${formatByteSize(file.bytes)}`);
    lines.push(`    ${file.path}`);
  }
  return lines;
}

export function formatNotePreviewMessage(preview: NotePreview): string {
  const body = preview.contentFromFile
    ? `file · ${formatByteSize(preview.contentBytes ?? 0)} · ${preview.contentFilePath}`
    : preview.contentFromChat
      ? `text in chat · ${formatByteSize(preview.contentBytes ?? 0)}`
      : "none (files only)";
  const password = preview.passwordProtected
    ? preview.passwordFromFile
      ? "yes · from file"
      : "yes · from chat"
    : "no";
  const heading = preview.sendChannel
    ? "Create and send secure handoff?"
    : "Create an encrypted PrivateNote link?";
  const channelLabel = preview.sendChannel
    ? preview.sendChannel.charAt(0).toUpperCase() + preview.sendChannel.slice(1)
    : "";

  const noteLines = [
    "Note",
    previewField("Body", body),
    previewField("Password", password),
    previewField("Expires", preview.expiresIn),
    previewField("Destroy after", preview.burnAfterReading ? "first access" : "multiple views"),
    preview.title ? previewField("Title", preview.title) : null,
    previewField("Branding", preview.accountBranding ? "your Business reveal page" : "none"),
    preview.requireRecipientVerification
      ? previewField("Verify recipient", preview.recipientEmail ?? "")
      : null,
    preview.notifyOnOpen ? previewField("Notify on open", "yes") : null,
    preview.label ? previewField("Label", preview.label) : null,
  ].filter((line): line is string => line !== null);

  const sendLines = preview.sendChannel
    ? [
        "Send",
        previewField("Via", channelLabel),
        previewField("Recipient", preview.sendRecipient ?? ""),
        "",
        "Approve to create the link and authorize sending only to that destination.",
      ]
    : [
        "Send",
        previewField("Status", "not requested"),
        "",
        "Approve to create the link. The agent must not send this URL.",
      ];

  return [heading, "", ...formatPreviewFiles(preview.attachedFiles), "", ...noteLines, "", ...sendLines].join(
    "\n",
  );
}

export function preloadedFromInspected(inspected: InspectedBoundFile[]): PreloadedSecrets {
  const attachments: LocalAttachment[] = [];
  let content: string | undefined;
  let password: string | null | undefined;
  for (const file of inspected) {
    if (file.kind === "contentFilePath") {
      content = Buffer.from(file.bytes).toString("utf8");
    } else if (file.kind === "passwordFilePath") {
      password = Buffer.from(file.bytes).toString("utf8").trim();
      if (!password) {
        throw new Error("The password file is empty");
      }
    } else {
      attachments.push({
        path: file.resolvedPath,
        bytes: file.bytes,
        name: file.name,
        type: guessMimeType(file.name),
      });
    }
  }
  return {
    ...(content !== undefined ? { content } : {}),
    ...(password !== undefined ? { password } : {}),
    attachments,
  };
}

export async function preloadedFromBoundFiles(identities: BoundFileIdentity[]): Promise<PreloadedSecrets> {
  const inspected: InspectedBoundFile[] = [];
  for (const identity of identities) {
    const bytes = await reopenAndVerifyBoundFile(identity);
    inspected.push({ ...identity, bytes });
  }
  return preloadedFromInspected(inspected);
}

export async function createPrivateNote(
  input: CreatePrivateNoteInput,
  preloaded?: PreloadedSecrets,
): Promise<CreatePrivateNoteOutput> {
  const attachmentPaths = uniquePaths([
    ...(input.filePath ? [input.filePath] : []),
    ...(input.filePaths ?? []),
  ]);
  const contentFilePath = input.contentFilePath?.trim();
  let content = preloaded?.content ?? input.content ?? "";
  if (!preloaded && contentFilePath) {
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
  const password =
    preloaded && "password" in preloaded
      ? (preloaded.password ?? null)
      : await resolveNotePassword(input);
  const recipientEmail = input.recipientEmail?.trim().toLowerCase() || undefined;
  const requireRecipientVerification = input.requireRecipientVerification === true;
  const notifyOnOpen = input.notifyOnOpen === true;
  const label = input.label?.trim() || undefined;
  if (requireRecipientVerification) {
    if (!recipientEmail || !isPlausibleEmailFormat(recipientEmail)) {
      throw new Error("Recipient verification needs a valid recipientEmail.");
    }
  }

  const { apiBaseUrl, webOrigin } = getConfig();

  let attachments: LocalAttachment[] = preloaded?.attachments ? [...preloaded.attachments] : [];
  if (!preloaded && attachmentPaths.length > 0) {
    attachments = [];
    for (const path of attachmentPaths) {
      attachments.push(await readAttachmentFile(path));
    }
    const session = await readStoredSession();
    if (!session?.accessToken) {
      for (const item of attachments) item.bytes.fill(0);
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
  } else if (attachmentPaths.length > 0) {
    const session = await readStoredSession();
    if (!session?.accessToken) {
      throw new Error("Sign in with the sign_in tool before attaching a file.");
    }
  }

  if (requireRecipientVerification || notifyOnOpen || label) {
    const session = await readStoredSession();
    if (!session?.accessToken) {
      throw new Error("Sign in with the sign_in tool before recipient verification or open notifications.");
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
  const useRootKeys = attachments.length > 0 || Boolean(password);

  let exportedKey: string;
  let encryptedContent: string;
  let ivBase64: string;
  let aad: string;
  let keyDerivation: string | undefined;
  let passwordWire:
    | { salt: string; encryptedKeyIv: string; kdfParams: unknown }
    | undefined;
  const attachmentMetadataList: unknown[] = [];
  const attachmentContentHashes: string[] = [];

  if (useRootKeys) {
    if (attachments.length > 0 && !uploadToken) {
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
      keyDerivation = NOTE_KEY_DERIVATION_HKDF_ROOT_V2;
      if (password) {
        const wrapped = await wrapRootKeyWithPasswordNote({
          rootKeyBytes,
          password,
          aadBytes,
        });
        exportedKey = wrapped.fragmentKey;
        passwordWire = {
          salt: wrapped.saltBase64,
          encryptedKeyIv: wrapped.encryptedKeyIvBase64,
          kdfParams: wrapped.kdfParams,
        };
      } else {
        exportedKey = exportedRootKey;
      }
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
          uploadToken: uploadToken!,
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

  const applyAccountBranding = Boolean((await readStoredSession())?.accessToken);

  try {
    await createNote(apiBaseUrl, {
      id,
      content: encryptedContent,
      iv: ivBase64,
      aad,
      expirySeconds,
      maxReads,
      isPasswordProtected: Boolean(passwordWire),
      _hp: "",
      aiMode: false,
      creationSource: "mcp",
      creationEntryPoint: "mcp",
      ...(keyDerivation ? { keyDerivation } : {}),
      ...(passwordWire
        ? {
            salt: passwordWire.salt,
            encryptedKeyIv: passwordWire.encryptedKeyIv,
            kdfParams: passwordWire.kdfParams,
          }
        : {}),
      ...(attachmentMetadataList.length > 0 ? { attachments: attachmentMetadataList } : {}),
      ...(attachmentContentHashes.length > 0
        ? {
            attachmentContentHash: attachmentContentHashes[0],
            attachmentContentHashes,
          }
        : {}),
      ...(requireRecipientVerification
        ? { requireRecipientVerification: true, recipientEmail }
        : {}),
      ...(notifyOnOpen ? { notifyOnOpen: true } : {}),
      ...(label ? { label } : {}),
      ...(applyAccountBranding ? { revealBranding: MCP_ACCOUNT_BRANDING_REQUEST } : {}),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Note creation failed";
    throw new Error(msg);
  }

  const secureUrl = `${webOrigin}/note/${id}#${exportedKey}`;
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();
  const attachedFileNames = attachments.map((item) => item.name);

  return {
    noteId: id,
    secureUrl,
    expiresAt,
    burnAfterReading: maxReads === 1,
    ...(passwordWire ? { passwordProtected: true } : {}),
    ...(attachedFileNames[0] ? { attachedFileName: attachedFileNames[0] } : {}),
    ...(attachedFileNames.length > 0 ? { attachedFileNames } : {}),
    ...(requireRecipientVerification ? { recipientVerification: true } : {}),
    ...(notifyOnOpen ? { notifyOnOpen: true } : {}),
    ...(applyAccountBranding ? { accountBranding: true } : {}),
  };
}
