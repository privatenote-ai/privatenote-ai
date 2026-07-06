import type { DurableObjectState } from "@cloudflare/workers-types";
import { decodeNoteAadBase64, parseNoteAadPlaintext } from "@shared/noteAad";
import { tryParseKdfParamsV2Object, type KdfParamsV2 } from "@shared/kdfParamsV2";
import { noteMetaEligibility, type NoteMetaRow } from "@shared/noteMetaEligibility";
import {
  passwordWireFieldsPresent,
  validateNoteAesGcmIvWire,
  validateNoteCiphertextWire,
  validateNoteEncryptedKeyWire,
  validateNoteKdfSaltWire,
} from "@shared/noteCryptoWire";
import { parseNoteExpirySecondsFromBody } from "@shared/noteExpiry";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  isNoteFileAccessWindowSeconds,
} from "@shared/noteFileAccess";
import { isValidNoteId } from "@shared/noteId";
import {
  NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
  parseStoredNoteAttachmentForNote,
  parseStoredNoteCiphertextForReveal,
  STORED_NOTE_CIPHER_ALG,
  STORED_NOTE_PAYLOAD_VERSION,
  type ParsedStoredNoteCiphertext,
} from "@shared/storedNotePayload";
import { isSupportedLanguage } from "@shared/supportedLanguages";

type StoredCiphertext = ParsedStoredNoteCiphertext;

const MIN_EXPIRY_SECONDS = 60;
const MAX_EXPIRY_SECONDS = 30 * 24 * 60 * 60;

function isUniqueConstraintError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /UNIQUE|unique constraint|SQLITE_CONSTRAINT/i.test(msg);
}

async function getOneRow<T>(cursor: any): Promise<T | null> {
  if (!cursor) return null;
  if (typeof cursor.toArray === "function") {
    const rows = await Promise.resolve(cursor.toArray() as T[]);
    return rows.length > 0 ? rows[0] : null;
  }
  if (typeof cursor.one === "function") {
    try {
      return cursor.one() as T | null;
    } catch {
      return null;
    }
  }
  return null;
}

/** For use inside `transactionSync` only (`sql.exec` / cursors are synchronous). */
function getOneRowSync<T>(cursor: any): T | null {
  if (!cursor) return null;
  if (typeof cursor.toArray === "function") {
    const rows = cursor.toArray() as T[] | Promise<T[]>;
    if (rows instanceof Promise) {
      throw new Error("SQL cursor returned a Promise inside transactionSync");
    }
    return rows.length > 0 ? rows[0] : null;
  }
  if (typeof cursor.one === "function") {
    try {
      return cursor.one() as T | null;
    } catch {
      return null;
    }
  }
  return null;
}

export class SecureNoteStorageSql {
  state: DurableObjectState;
  private schemaReady: boolean;

  constructor(state: DurableObjectState, _env?: unknown) {
    this.state = state;
    this.schemaReady = false;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);

    const isNotePath = segments.length >= 3 && segments[0] === "api" && segments[1] === "notes";
    const isRevealPath = segments.length === 4 && segments[3] === "reveal";

    if (!isNotePath || (segments.length !== 3 && !isRevealPath)) {
      return new Response(JSON.stringify({ error: "Invalid API path" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const noteId = segments[2];
    if (!isValidNoteId(noteId)) {
      return new Response(JSON.stringify({ error: "Invalid note id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    this.ensureSchema();

    if (request.method === "POST") {
      if (isRevealPath) {
        return this.revealNote(noteId);
      }
      return this.createNote(request, noteId);
    }
    if (request.method === "GET") {
      return this.getNoteMeta(noteId);
    }
    if (request.method === "DELETE") {
      return this.deleteNote(noteId);
    }

    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  private ensureSchema(): void {
    if (this.schemaReady) {
      return;
    }
    this.state.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS notes_meta (" +
        "note_id TEXT PRIMARY KEY," +
        "expires_at TEXT NOT NULL," +
        "max_reads INTEGER NOT NULL," +
        "current_reads INTEGER NOT NULL," +
        "consumed INTEGER NOT NULL" +
        ")",
    );
    this.state.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS notes_cipher (" + "note_id TEXT PRIMARY KEY," + "payload TEXT NOT NULL" + ")",
    );
    // Legacy deployments may still have consumed=1 tombstones (ciphertext already removed).
    // Runs once per DO instance wake, not on a periodic schedule.
    this.state.storage.sql.exec("DELETE FROM notes_meta WHERE consumed = 1");
    this.schemaReady = true;
  }

  private async getMeta(noteId: string): Promise<NoteMetaRow | null> {
    const cursor = this.state.storage.sql.exec(
      "SELECT note_id, expires_at, max_reads, current_reads, consumed FROM notes_meta WHERE note_id = ?",
      noteId,
    );
    return await getOneRow<NoteMetaRow>(cursor);
  }

  /** Remove ciphertext and metadata for the note (terminal state). Caller must use transactions where needed. */
  private purgeNoteRowsSync(noteId: string): void {
    this.state.storage.sql.exec("DELETE FROM notes_cipher WHERE note_id = ?", noteId);
    this.state.storage.sql.exec("DELETE FROM notes_meta WHERE note_id = ?", noteId);
  }

  /** Purge note rows atomically (expired / exhausted / meta cleanup paths). */
  private terminalConsumeSync(noteId: string): void {
    this.state.storage.transactionSync(() => {
      this.purgeNoteRowsSync(noteId);
    });
  }

  /**
   * Create note: strict INSERT for both rows. Fails atomically if either already exists.
   */
  private insertNoteStrict(noteId: string, meta: NoteMetaRow, ciphertext: StoredCiphertext): void {
    const payload = JSON.stringify(ciphertext);
    this.state.storage.transactionSync(() => {
      this.state.storage.sql.exec("INSERT INTO notes_cipher (note_id, payload) VALUES (?, ?)", noteId, payload);
      this.state.storage.sql.exec(
        "INSERT INTO notes_meta (note_id, expires_at, max_reads, current_reads, consumed) VALUES (?, ?, ?, ?, ?)",
        meta.note_id,
        meta.expires_at,
        meta.max_reads,
        meta.current_reads,
        meta.consumed,
      );
    });
  }

  private async createNote(request: Request, noteId: string): Promise<Response> {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      content,
      iv,
      expirySeconds,
      maxReads = 1,
      salt = null,
      encryptedKey = null,
      encryptedKeyIv = null,
      aad: aadRaw = undefined,
      kdfParams = undefined,
      keyDerivation = undefined,
      attachment: attachmentRaw = undefined,
      fileAccessWindowSeconds: fileAccessWindowSecondsRaw = undefined,
      readerLanguage: readerLanguageRaw = undefined,
    } = body || {};

    const ippField = body?.isPasswordProtected;
    let isPasswordProtected: boolean;
    if (ippField === undefined) {
      isPasswordProtected = false;
    } else if (typeof ippField !== "boolean") {
      return new Response(JSON.stringify({ error: "isPasswordProtected must be a boolean" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      isPasswordProtected = ippField;
    }

    if (typeof content !== "string" || typeof iv !== "string") {
      return new Response(JSON.stringify({ error: "Content and IV must be strings" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!content.trim() || !iv.trim()) {
      return new Response(JSON.stringify({ error: "Content and IV are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof aadRaw !== "string" || !aadRaw.trim()) {
      return new Response(JSON.stringify({ error: "aad (note authentication data) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const aad = aadRaw.trim();

    const contentWire = validateNoteCiphertextWire(content, "content");
    if (!contentWire.ok) {
      return new Response(JSON.stringify({ error: contentWire.message }), {
        status: contentWire.kind === "too_large" ? 413 : 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ivWire = validateNoteAesGcmIvWire(iv, "iv");
    if (!ivWire.ok) {
      return new Response(JSON.stringify({ error: ivWire.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let normalizedKdfParams: KdfParamsV2 | undefined;
    if (keyDerivation != null && keyDerivation !== NOTE_KEY_DERIVATION_HKDF_ROOT_V2) {
      return new Response(JSON.stringify({ error: "Unsupported keyDerivation" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isPasswordProtected) {
      const kdfParsed = tryParseKdfParamsV2Object(kdfParams);
      if (!kdfParsed.ok) {
        return new Response(JSON.stringify({ error: kdfParsed.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      normalizedKdfParams = kdfParsed.params;

      const saltCheck = validateNoteKdfSaltWire(salt);
      if (!saltCheck.ok) {
        return new Response(JSON.stringify({ error: saltCheck.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const keyIvCheck = validateNoteAesGcmIvWire(encryptedKeyIv, "encryptedKeyIv");
      if (!keyIvCheck.ok) {
        return new Response(JSON.stringify({ error: keyIvCheck.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2) {
        if (encryptedKey != null) {
          return new Response(JSON.stringify({ error: "encryptedKey must not be stored for hkdf-root-v2 notes" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        const encKeyCheck = validateNoteEncryptedKeyWire(encryptedKey);
        if (!encKeyCheck.ok) {
          return new Response(JSON.stringify({ error: encKeyCheck.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    } else if (passwordWireFieldsPresent(body)) {
      return new Response(
        JSON.stringify({
          error:
            "salt, encryptedKey, and encryptedKeyIv must not be set for notes that are not password-protected",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (keyDerivation != null && keyDerivation !== NOTE_KEY_DERIVATION_HKDF_ROOT_V2) {
      return new Response(JSON.stringify({ error: "Unsupported keyDerivation" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else if (kdfParams != null) {
      return new Response(
        JSON.stringify({
          error: "kdfParams must not be set for notes that are not password-protected",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const expiryParsed = parseNoteExpirySecondsFromBody(expirySeconds);
    if (!expiryParsed.ok) {
      return new Response(JSON.stringify({ error: expiryParsed.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const safeExpirySeconds = Math.min(
      MAX_EXPIRY_SECONDS,
      Math.max(MIN_EXPIRY_SECONDS, expiryParsed.seconds),
    );
    const expiresAt = new Date(Date.now() + safeExpirySeconds * 1000);
    const parsedMaxReads = Number(maxReads);
    const isUnlimitedExplicit = parsedMaxReads === 0 || maxReads === "0";
    const safeMaxReads = isUnlimitedExplicit
      ? 0
      : Number.isFinite(parsedMaxReads) && parsedMaxReads > 0
        ? Math.floor(parsedMaxReads)
        : 1;

    const plaintext = decodeNoteAadBase64(aad);
    const parsedAad = plaintext !== null ? parseNoteAadPlaintext(plaintext) : null;
    if (
      !parsedAad ||
      parsedAad.noteId !== noteId ||
      parsedAad.expirySeconds !== safeExpirySeconds ||
      parsedAad.maxReads !== safeMaxReads
    ) {
      return new Response(
        JSON.stringify({
          error: "Note authentication data (aad) is invalid or does not match id, expirySeconds, and maxReads",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const meta: NoteMetaRow = {
      note_id: noteId,
      expires_at: expiresAt.toISOString(),
      max_reads: safeMaxReads,
      current_reads: 0,
      consumed: 0,
    };

    const contentTrimmed = content.trim();
    const ivTrimmed = iv.trim();
    const attachment = parseStoredNoteAttachmentForNote(attachmentRaw, noteId);
    if (attachmentRaw != null && !attachment) {
      return new Response(JSON.stringify({ error: "Invalid attachment metadata" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const readerLanguage =
      typeof readerLanguageRaw === "string" && isSupportedLanguage(readerLanguageRaw)
        ? readerLanguageRaw
        : undefined;
    if (readerLanguageRaw != null && !readerLanguage) {
      return new Response(JSON.stringify({ error: "Invalid reader language" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const fileAccessWindowSeconds =
      fileAccessWindowSecondsRaw == null
        ? NOTE_FILE_ACCESS_DEFAULT_SECONDS
        : fileAccessWindowSecondsRaw;
    if (!isNoteFileAccessWindowSeconds(fileAccessWindowSeconds)) {
      return new Response(JSON.stringify({ error: "Invalid attachment access window" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ciphertext: StoredCiphertext = {
      v: STORED_NOTE_PAYLOAD_VERSION,
      content: contentTrimmed,
      iv: ivTrimmed,
      alg: STORED_NOTE_CIPHER_ALG,
      aad,
      isPasswordProtected,
      salt: null,
      encryptedKey: null,
      encryptedKeyIv: null,
      ...(attachment ? { attachment } : {}),
      ...(attachment ? { fileAccessWindowSeconds } : {}),
      ...(readerLanguage ? { readerLanguage } : {}),
      ...(normalizedKdfParams ? { kdfParams: normalizedKdfParams } : {}),
      ...(keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
        ? { keyDerivation: NOTE_KEY_DERIVATION_HKDF_ROOT_V2 }
        : {}),
    };

    if (isPasswordProtected) {
      if (typeof salt !== "string" || typeof encryptedKeyIv !== "string") {
        return new Response(JSON.stringify({ error: "salt and encryptedKeyIv must be strings" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      ciphertext.salt = salt.trim();
      ciphertext.encryptedKey =
        keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
          ? null
          : typeof encryptedKey === "string" && encryptedKey.trim().length > 0
            ? encryptedKey.trim()
            : null;
      ciphertext.encryptedKeyIv = encryptedKeyIv.trim();
    }

    try {
      this.insertNoteStrict(noteId, meta, ciphertext);
    } catch (e) {
      if (isUniqueConstraintError(e)) {
        return new Response(JSON.stringify({ error: "Note already exists" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.error(`[DO] insertNoteStrict failed for ${noteId}:`, e);
      return new Response(JSON.stringify({ error: "Failed to store note" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id: noteId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async getNoteMeta(noteId: string): Promise<Response> {
    const meta = await this.getMeta(noteId);
    const elig = noteMetaEligibility(meta, new Date());
    if (!elig.ok) {
      if (elig.kind === "expired" || elig.kind === "exhausted") {
        try {
          this.terminalConsumeSync(noteId);
        } catch (e) {
          console.error(`[DO] terminalConsumeSync (${elig.kind} meta) failed for ${noteId}:`, e);
        }
      }
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const row = meta as NoteMetaRow;
    const raw =
      getOneRowSync<{ payload: string }>(
        this.state.storage.sql.exec("SELECT payload FROM notes_cipher WHERE note_id = ?", noteId),
      )?.payload ?? null;
    const ciphertext = raw ? parseStoredNoteCiphertextForReveal(raw, noteId) : null;
    return new Response(
      JSON.stringify({
        readCount: row.current_reads,
        maxReads: row.max_reads,
        expiresAt: row.expires_at,
        ...(ciphertext?.readerLanguage ? { readerLanguage: ciphertext.readerLanguage } : {}),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  private revealNote(noteId: string): Response {
    const now = new Date();
    type RevealTxnResult = { ok: true; body: Record<string, unknown> } | { ok: false };

    let txnResult: RevealTxnResult;
    try {
      txnResult = this.state.storage.transactionSync((): RevealTxnResult => {
        const meta = getOneRowSync<NoteMetaRow>(
          this.state.storage.sql.exec(
            "SELECT note_id, expires_at, max_reads, current_reads, consumed FROM notes_meta WHERE note_id = ?",
            noteId,
          ),
        );
        const elig = noteMetaEligibility(meta, now);
        if (!elig.ok) {
          if (elig.kind === "expired" || elig.kind === "exhausted") {
            this.purgeNoteRowsSync(noteId);
          }
          return { ok: false };
        }

        const m = meta as NoteMetaRow;

        const raw =
          getOneRowSync<{ payload: string }>(
            this.state.storage.sql.exec("SELECT payload FROM notes_cipher WHERE note_id = ?", noteId),
          )?.payload ?? null;
        if (!raw) {
          // Eligible meta without ciphertext is inconsistent storage — purge so the row cannot 404 forever.
          this.purgeNoteRowsSync(noteId);
          return { ok: false };
        }

        const ciphertext = parseStoredNoteCiphertextForReveal(raw, noteId);
        if (!ciphertext) {
          this.purgeNoteRowsSync(noteId);
          return { ok: false };
        }

        const newReads = m.current_reads + 1;
        const markConsumed = m.max_reads > 0 && newReads >= m.max_reads;

        if (markConsumed) {
          this.purgeNoteRowsSync(noteId);
        } else {
          this.state.storage.sql.exec(
            "UPDATE notes_meta SET current_reads = ?, consumed = 0 WHERE note_id = ?",
            newReads,
            noteId,
          );
        }

        const responseBody: Record<string, unknown> = {
          content: ciphertext.content,
          iv: ciphertext.iv,
          readCount: newReads,
          maxReads: m.max_reads,
          expiresAt: m.expires_at,
          isPasswordProtected: ciphertext.isPasswordProtected,
          ...(typeof ciphertext.aad === "string" && ciphertext.aad ? { aad: ciphertext.aad } : {}),
          ...(ciphertext.kdfParams ? { kdfParams: ciphertext.kdfParams } : {}),
          ...(ciphertext.keyDerivation ? { keyDerivation: ciphertext.keyDerivation } : {}),
          ...(ciphertext.readerLanguage ? { readerLanguage: ciphertext.readerLanguage } : {}),
          ...(ciphertext.attachment ? { attachment: ciphertext.attachment } : {}),
          ...(ciphertext.attachment
            ? {
                fileAccessWindowSeconds:
                  ciphertext.fileAccessWindowSeconds ?? NOTE_FILE_ACCESS_DEFAULT_SECONDS,
              }
            : {}),
          ...(ciphertext.isPasswordProtected && {
            salt: ciphertext.salt,
            ...(ciphertext.encryptedKey ? { encryptedKey: ciphertext.encryptedKey } : {}),
            encryptedKeyIv: ciphertext.encryptedKeyIv,
          }),
        };

        return { ok: true, body: responseBody };
      });
    } catch (e) {
      console.error(`[DO] reveal transaction failed for ${noteId}:`, e);
      return new Response(JSON.stringify({ error: "Failed to retrieve note" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!txnResult.ok) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(txnResult.body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  private deleteNote(noteId: string): Response {
    try {
      this.state.storage.transactionSync(() => {
        this.state.storage.sql.exec("DELETE FROM notes_cipher WHERE note_id = ?", noteId);
        this.state.storage.sql.exec("DELETE FROM notes_meta WHERE note_id = ?", noteId);
      });
    } catch (e) {
      console.error(`[DO] deleteNote transaction failed for ${noteId}:`, e);
      return new Response(JSON.stringify({ error: "Failed to delete note" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export class SecureNoteStorage {
  constructor(_state: DurableObjectState, _env?: unknown) {}

  async fetch(): Promise<Response> {
    return new Response(JSON.stringify({ error: "Legacy Durable Object is deprecated" }), {
      status: 410,
      headers: { "Content-Type": "application/json" },
    });
  }
}
