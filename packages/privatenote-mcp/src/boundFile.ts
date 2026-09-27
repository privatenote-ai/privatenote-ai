/**
 * Bind a confirmation to the exact bytes of a local file.
 *
 * Preview: realpath → allow/deny → open → fstat → SHA-256 → close.
 * Confirm: open canonical path → fstat on that FD → hash the same FD → encrypt those bytes.
 * File descriptors are not held across the confirmation window.
 */

import { createHash } from "node:crypto";
import { open } from "node:fs/promises";
import { basename } from "node:path";
import { assertReadableSecretPath, type PathGuardContext } from "./allowedPaths.ts";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";

export const MAX_PASSWORD_FILE_BYTES = 4096;
export const MAX_ATTACHMENT_FILE_BYTES = 1024 * 1024 * 1024;

export const FILE_CHANGED_AFTER_PREVIEW_MESSAGE =
  "The approved file changed. Call create_private_note again to start a new confirmation.";

export type BoundFileKind = "contentFilePath" | "filePath" | "passwordFilePath";

export type BoundFileIdentity = {
  kind: BoundFileKind;
  resolvedPath: string;
  deviceId: number;
  inode: number;
  fileSizeBytes: number;
  contentSha256: string;
  name: string;
};

export type InspectedBoundFile = BoundFileIdentity & {
  bytes: Uint8Array;
};

function sha256Hex(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function assertSizeForKind(kind: BoundFileKind, size: number): void {
  if (size <= 0) {
    throw new Error(
      kind === "passwordFilePath"
        ? "The password file is empty"
        : kind === "contentFilePath"
          ? "The content file is empty"
          : "The attached file is empty",
    );
  }
  if (kind === "passwordFilePath" && size > MAX_PASSWORD_FILE_BYTES) {
    throw new Error("Password file is too large");
  }
  if (kind === "contentFilePath" && size > MAX_NOTE_PLAINTEXT_UTF8_BYTES) {
    throw new Error("Content too large (max 50 KB)");
  }
  if (kind === "filePath" && size > MAX_ATTACHMENT_FILE_BYTES) {
    throw new Error("File is too large to attach from MCP (max 1 GB)");
  }
}

async function readAllFromHandle(
  fh: Awaited<ReturnType<typeof open>>,
  size: number,
): Promise<Uint8Array> {
  const buf = Buffer.alloc(size);
  let offset = 0;
  while (offset < size) {
    const { bytesRead } = await fh.read(buf, offset, size - offset, offset);
    if (bytesRead === 0) break;
    offset += bytesRead;
  }
  if (offset !== size) {
    throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
  }
  return new Uint8Array(buf);
}

function identityFromStat(
  kind: BoundFileKind,
  resolvedPath: string,
  st: { dev: number; ino: number | bigint; size: number },
  bytes: Uint8Array,
): BoundFileIdentity {
  return {
    kind,
    resolvedPath,
    deviceId: st.dev,
    inode: Number(st.ino),
    fileSizeBytes: st.size,
    contentSha256: sha256Hex(bytes),
    name: basename(resolvedPath).slice(0, 255) || "privatenote-file",
  };
}

export function toBoundFileIdentity(inspected: InspectedBoundFile): BoundFileIdentity {
  const { bytes: _bytes, ...identity } = inspected;
  return identity;
}

/**
 * Canonicalize, allow/deny, then read+hash from a single open FD. Caller must
 * drop `bytes` if they must not retain file plaintext (pending confirmations).
 */
export async function inspectBoundFile(
  rawPath: string,
  kind: BoundFileKind,
  ctx?: PathGuardContext,
): Promise<InspectedBoundFile> {
  const resolvedPath = await assertReadableSecretPath(rawPath, ctx);
  const fh = await open(resolvedPath, "r");
  try {
    const st = await fh.stat();
    if (!st.isFile()) {
      throw new Error(`${kind} must point to a file`);
    }
    assertSizeForKind(kind, st.size);
    const bytes = await readAllFromHandle(fh, st.size);
    const stAfter = await fh.stat();
    if (
      stAfter.dev !== st.dev ||
      Number(stAfter.ino) !== Number(st.ino) ||
      stAfter.size !== st.size
    ) {
      throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
    }
    return { ...identityFromStat(kind, resolvedPath, st, bytes), bytes };
  } catch (err) {
    if (err instanceof Error && /must point|empty|too large|changed/.test(err.message)) {
      throw err;
    }
    throw new Error(`Could not read the file at ${kind}`);
  } finally {
    await fh.close();
  }
}

export function wipeInspectedBytes(files: InspectedBoundFile[]): void {
  for (const file of files) {
    file.bytes.fill(0);
  }
}

/**
 * Re-open the approved canonical path, verify device/inode/size on the FD,
 * hash the same FD, and return those bytes for encryption.
 */
export async function reopenAndVerifyBoundFile(
  identity: BoundFileIdentity,
  ctx?: PathGuardContext,
): Promise<Uint8Array> {
  let resolvedPath: string;
  try {
    resolvedPath = await assertReadableSecretPath(identity.resolvedPath, ctx);
  } catch {
    throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
  }
  if (resolvedPath !== identity.resolvedPath) {
    throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
  }
  let fh: Awaited<ReturnType<typeof open>>;
  try {
    fh = await open(resolvedPath, "r");
  } catch {
    throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
  }
  try {
    const st = await fh.stat();
    if (!st.isFile()) {
      throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
    }
    if (
      st.dev !== identity.deviceId ||
      Number(st.ino) !== identity.inode ||
      st.size !== identity.fileSizeBytes
    ) {
      throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
    }
    const bytes = await readAllFromHandle(fh, st.size);
    const stAfter = await fh.stat();
    if (
      stAfter.dev !== identity.deviceId ||
      Number(stAfter.ino) !== identity.inode ||
      stAfter.size !== identity.fileSizeBytes
    ) {
      throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
    }
    if (sha256Hex(bytes) !== identity.contentSha256) {
      throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
    }
    return bytes;
  } catch (err) {
    if (err instanceof Error && err.message === FILE_CHANGED_AFTER_PREVIEW_MESSAGE) {
      throw err;
    }
    throw new Error(FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
  } finally {
    await fh.close();
  }
}
