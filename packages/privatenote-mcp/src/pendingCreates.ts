/**
 * One-time pending create_private_note confirmations.
 *
 * Stores identities/digests and frozen options — not file plaintext.
 * consumePendingCreate is the only way out: the id is unusable immediately,
 * even if hashing, encryption, or upload later fails.
 */

import { randomBytes } from "node:crypto";
import type { BoundFileIdentity } from "./boundFile.ts";
import type { BoundNoteOptions, CreatePrivateNoteInput, NotePreview } from "./createNote.ts";
import type { BoundSendAuthorization } from "./sendChannels.ts";

export const PENDING_CREATE_TTL_MS = 5 * 60 * 1000;
export const MAX_PENDING_CREATES = 50;

export const CONFIRMATION_INVALID_MESSAGE =
  "Confirmation is invalid or expired. Call create_private_note again to start over.";

export type PendingCreate = {
  confirmationId: string;
  expiresAt: number;
  expiresAtMs: number;
  input: CreatePrivateNoteInput;
  preview: NotePreview;
  boundFiles: BoundFileIdentity[];
  options: BoundNoteOptions;
  sendAuthorization: BoundSendAuthorization;
};

const pending = new Map<string, PendingCreate>();

export function newConfirmationId(): string {
  return `cnfg_${randomBytes(32).toString("hex")}`;
}

function sweep(now = Date.now()): void {
  for (const [id, entry] of pending) {
    if (entry.expiresAtMs <= now) pending.delete(id);
  }
}

function dropOldestIfNeeded(): void {
  while (pending.size >= MAX_PENDING_CREATES) {
    let oldestId: string | null = null;
    let oldestAt = Number.POSITIVE_INFINITY;
    for (const [id, entry] of pending) {
      if (entry.expiresAtMs < oldestAt) {
        oldestAt = entry.expiresAtMs;
        oldestId = id;
      }
    }
    if (!oldestId) break;
    pending.delete(oldestId);
  }
}

function freezePending(entry: PendingCreate): PendingCreate {
  for (const file of entry.boundFiles) Object.freeze(file);
  Object.freeze(entry.boundFiles);
  Object.freeze(entry.options);
  Object.freeze(entry.sendAuthorization);
  if (Array.isArray(entry.preview.attachedFiles)) Object.freeze(entry.preview.attachedFiles);
  Object.freeze(entry.preview);
  if (Array.isArray(entry.input.filePaths)) Object.freeze(entry.input.filePaths);
  Object.freeze(entry.input);
  return Object.freeze(entry);
}

export function putPendingCreate(entry: Omit<PendingCreate, "confirmationId" | "expiresAt" | "expiresAtMs">): PendingCreate {
  sweep();
  dropOldestIfNeeded();
  const confirmationId = newConfirmationId();
  const expiresAtMs = Date.now() + PENDING_CREATE_TTL_MS;
  const stored = freezePending({
    input: {
      ...entry.input,
      filePaths: entry.input.filePaths ? [...entry.input.filePaths] : undefined,
    },
    preview: {
      ...entry.preview,
      attachedFiles: entry.preview.attachedFiles.map((file) => ({ ...file })),
    },
    boundFiles: entry.boundFiles.map((file) => ({ ...file })),
    options: { ...entry.options },
    sendAuthorization: { ...entry.sendAuthorization },
    confirmationId,
    expiresAtMs,
    expiresAt: Math.floor(expiresAtMs / 1000),
  });
  pending.set(confirmationId, stored);
  return stored;
}

/**
 * Atomic consume: pending → consumed. The id cannot be used again, including
 * when this throw fires because the token was already expired.
 */
export function consumePendingCreate(confirmationId: string): PendingCreate {
  sweep();
  const key = confirmationId.trim();
  const entry = pending.get(key);
  pending.delete(key);
  if (!entry || Date.now() > entry.expiresAtMs) {
    throw new Error(CONFIRMATION_INVALID_MESSAGE);
  }
  return entry;
}

export function pendingCreateCount(): number {
  sweep();
  return pending.size;
}

export function clearPendingCreates(): void {
  pending.clear();
}

export function expirePendingCreateForTests(confirmationId: string): void {
  const entry = pending.get(confirmationId);
  if (!entry) return;
  pending.delete(confirmationId);
  pending.set(confirmationId, { ...entry, expiresAtMs: 0, expiresAt: 0 });
}
