import type { DurableObjectState, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  NOTES_KV: KVNamespace;
}

interface NoteMetaRow {
  note_id: string;
  expires_at: string;
  max_reads: number;
  current_reads: number;
  consumed: number;
}

interface StoredCiphertext {
  v: number;
  content: string;
  iv: string;
  alg: string;
  isPasswordProtected: boolean;
  salt: string | null;
  encryptedKey: string | null;
  encryptedKeyIv: string | null;
}

const MIN_TTL_SECONDS = 60;
const MAX_TTL_SECONDS = 2147483647;
const MIN_EXPIRY_SECONDS = 60;
const MAX_EXPIRY_SECONDS = 30 * 24 * 60 * 60;

function calculateTTL(expiresAt: Date): number | undefined {
  const now = Date.now();
  const ttlSeconds = Math.floor((expiresAt.getTime() - now) / 1000);
  if (ttlSeconds <= 0) return undefined;
  if (ttlSeconds > MAX_TTL_SECONDS) return undefined;
  return Math.max(MIN_TTL_SECONDS, ttlSeconds);
}

function getCiphertextKey(id: string): string {
  return `note:${id}`;
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

export class SecureNoteStorageSql {
  state: DurableObjectState;
  env: Env;
  private schemaReady: boolean;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
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
    this.schemaReady = true;
  }

  private async getMeta(noteId: string): Promise<NoteMetaRow | null> {
    const cursor = this.state.storage.sql.exec(
      "SELECT note_id, expires_at, max_reads, current_reads, consumed FROM notes_meta WHERE note_id = ?",
      noteId,
    );
    return await getOneRow<NoteMetaRow>(cursor);
  }

  private upsertMeta(meta: NoteMetaRow): void {
    this.state.storage.sql.exec(
      "INSERT OR REPLACE INTO notes_meta (note_id, expires_at, max_reads, current_reads, consumed) " +
        "VALUES (?, ?, ?, ?, ?)",
      meta.note_id,
      meta.expires_at,
      meta.max_reads,
      meta.current_reads,
      meta.consumed,
    );
  }

  private deleteMeta(noteId: string): void {
    this.state.storage.sql.exec("DELETE FROM notes_meta WHERE note_id = ?", noteId);
  }

  private async loadLegacyFromKV(noteId: string): Promise<NoteMetaRow | null> {
    const raw = await this.env.NOTES_KV.get(getCiphertextKey(noteId));
    if (!raw) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== "object" || !parsed.content || !parsed.iv) {
      return null;
    }

    const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const meta: NoteMetaRow = {
      note_id: noteId,
      expires_at: expiresAt.toISOString(),
      max_reads: typeof parsed.maxReads === "number" ? parsed.maxReads : 1,
      current_reads: typeof parsed.currentReads === "number" ? parsed.currentReads : 0,
      consumed: 0,
    };

    const ciphertext: StoredCiphertext = {
      v: typeof parsed.v === "number" ? parsed.v : 1,
      content: parsed.content,
      iv: parsed.iv,
      alg: typeof parsed.alg === "string" ? parsed.alg : "AES-GCM",
      isPasswordProtected: !!parsed.isPasswordProtected,
      salt: parsed.salt ?? null,
      encryptedKey: parsed.encryptedKey ?? null,
      encryptedKeyIv: parsed.encryptedKeyIv ?? null,
    };

    await this.persistCiphertext(noteId, ciphertext, expiresAt);
    this.upsertMeta(meta);
    return meta;
  }

  private async persistCiphertext(noteId: string, ciphertext: StoredCiphertext, expiresAt: Date): Promise<void> {
    const key = getCiphertextKey(noteId);
    const ttl = calculateTTL(expiresAt);
    const value = JSON.stringify(ciphertext);
    if (ttl === undefined) {
      await this.env.NOTES_KV.put(key, value);
    } else {
      await this.env.NOTES_KV.put(key, value, { expirationTtl: ttl });
    }
  }

  private async deleteCiphertext(noteId: string): Promise<void> {
    await this.env.NOTES_KV.delete(getCiphertextKey(noteId));
  }

  private async createNote(request: Request, noteId: string): Promise<Response> {
    const existing = await this.getMeta(noteId);
    if (existing) {
      return new Response(JSON.stringify({ error: "Note already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json<any>();
    const {
      content,
      iv,
      expiryDays = 1,
      expirySeconds,
      maxReads = 1,
      isPasswordProtected = false,
      salt = null,
      encryptedKey = null,
      encryptedKeyIv = null,
    } = body || {};

    if (!content || !iv) {
      return new Response(JSON.stringify({ error: "Content and IV are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (isPasswordProtected && (!salt || !encryptedKey || !encryptedKeyIv)) {
      return new Response(
        JSON.stringify({ error: "Salt, encryptedKey, and encryptedKeyIv are required for password-protected notes" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const parsedExpirySeconds = Number(expirySeconds);
    const parsedExpiryDays = Number(expiryDays);
    const rawExpirySeconds = Number.isFinite(parsedExpirySeconds)
      ? parsedExpirySeconds
      : Number.isFinite(parsedExpiryDays)
        ? parsedExpiryDays * 24 * 60 * 60
        : 24 * 60 * 60;
    const safeExpirySeconds = Math.min(
      MAX_EXPIRY_SECONDS,
      Math.max(MIN_EXPIRY_SECONDS, Math.floor(rawExpirySeconds)),
    );
    const expiresAt = new Date(Date.now() + safeExpirySeconds * 1000);
    const parsedMaxReads = Number(maxReads);
    const isUnlimitedExplicit = parsedMaxReads === 0 || maxReads === "0";
    const safeMaxReads = isUnlimitedExplicit
      ? 0
      : Number.isFinite(parsedMaxReads) && parsedMaxReads > 0
        ? Math.floor(parsedMaxReads)
        : 1;

    const meta: NoteMetaRow = {
      note_id: noteId,
      expires_at: expiresAt.toISOString(),
      max_reads: safeMaxReads,
      current_reads: 0,
      consumed: 0,
    };

    const ciphertext: StoredCiphertext = {
      v: 1,
      content,
      iv,
      alg: "AES-GCM",
      isPasswordProtected: !!isPasswordProtected,
      salt,
      encryptedKey,
      encryptedKeyIv,
    };

    this.upsertMeta(meta);
    await this.persistCiphertext(noteId, ciphertext, expiresAt);

    return new Response(JSON.stringify({ id: noteId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async getNoteMeta(noteId: string): Promise<Response> {
    let meta = await this.getMeta(noteId);
    if (!meta) {
      meta = await this.loadLegacyFromKV(noteId);
    }
    if (!meta || meta.consumed) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expiresAt = new Date(meta.expires_at);
    if (expiresAt < new Date()) {
      meta.consumed = 1;
      this.upsertMeta(meta);
      await this.deleteCiphertext(noteId);
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (meta.max_reads > 0 && meta.current_reads >= meta.max_reads) {
      meta.consumed = 1;
      this.upsertMeta(meta);
      await this.deleteCiphertext(noteId);
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseBody = {
      readCount: meta.current_reads,
      maxReads: meta.max_reads,
      expiresAt: meta.expires_at,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async revealNote(noteId: string): Promise<Response> {
    let meta = await this.getMeta(noteId);
    if (!meta) {
      meta = await this.loadLegacyFromKV(noteId);
    }
    if (!meta || meta.consumed) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expiresAt = new Date(meta.expires_at);
    if (expiresAt < new Date()) {
      meta.consumed = 1;
      this.upsertMeta(meta);
      await this.deleteCiphertext(noteId);
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (meta.max_reads > 0 && meta.current_reads >= meta.max_reads) {
      meta.consumed = 1;
      this.upsertMeta(meta);
      await this.deleteCiphertext(noteId);
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const raw = await this.env.NOTES_KV.get(getCiphertextKey(noteId));
    if (!raw) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let ciphertext: StoredCiphertext;
    try {
      ciphertext = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    meta.current_reads += 1;
    this.upsertMeta(meta);

    const responseBody = {
      content: ciphertext.content,
      iv: ciphertext.iv,
      readCount: meta.current_reads,
      maxReads: meta.max_reads,
      expiresAt: meta.expires_at,
      isPasswordProtected: ciphertext.isPasswordProtected ?? false,
      ...(ciphertext.isPasswordProtected && {
        salt: ciphertext.salt,
        encryptedKey: ciphertext.encryptedKey,
        encryptedKeyIv: ciphertext.encryptedKeyIv,
      }),
    };

    if (meta.max_reads > 0 && meta.current_reads >= meta.max_reads) {
      meta.consumed = 1;
      this.upsertMeta(meta);
      await this.deleteCiphertext(noteId);
    }

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async deleteNote(noteId: string): Promise<Response> {
    await this.deleteCiphertext(noteId);
    this.deleteMeta(noteId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export class SecureNoteStorage {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(): Promise<Response> {
    return new Response(JSON.stringify({ error: "Legacy Durable Object is deprecated" }), {
      status: 410,
      headers: { "Content-Type": "application/json" },
    });
  }
}
