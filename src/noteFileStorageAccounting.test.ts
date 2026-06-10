import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { D1Database, DurableObjectNamespace, DurableObjectStub, R2Bucket } from "@cloudflare/workers-types";
import { NOTE_FILE_ACCESS_DEFAULT_SECONDS } from "@shared/noteFileAccess";
import {
  NOTE_FILE_FREE_TOTAL_STORAGE_BYTES,
  NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES,
} from "@shared/noteFileLimits";
import {
  activateAccountFileStorageReservation,
  cleanupExpiredNoteFileStorage,
  reserveAccountFileStorageBytes,
} from "./routes.ts";
import type { Env } from "./types";

type UsageRow = {
  user_id: string;
  used_bytes: number;
  updated_at: string;
};

type ReservationRow = {
  note_id: string;
  user_id: string;
  encrypted_size: number;
  total_chunks: number | null;
  max_reads: number | null;
  file_access_window_seconds: number;
  expires_at: string | null;
  last_checked_at: string | null;
  status: "reserved" | "active" | "released";
  created_at: string;
  activated_at: string | null;
  released_at: string | null;
  release_reason: string | null;
};

const USER_ID = "user-premium";
const NOTE_ID = "00000000-0000-4000-8000-000000033333";
const NOTE_ID_2 = "00000000-0000-4000-8000-000000044444";
const FREE_STORAGE_LIMIT = NOTE_FILE_FREE_TOTAL_STORAGE_BYTES;
const PREMIUM_STORAGE_LIMIT = NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES;

function isoSecondsAgo(seconds: number): string {
  return new Date(Date.now() - seconds * 1000).toISOString();
}

class FakeD1Statement {
  private bindings: unknown[] = [];

  constructor(
    private readonly db: FakeD1Database,
    private readonly sql: string,
  ) {}

  bind(...values: unknown[]): FakeD1Statement {
    this.bindings = values;
    return this;
  }

  async run(): Promise<{ meta: { changes: number } }> {
    return this.db.run(this.sql, this.bindings);
  }

  async first<T>(): Promise<T | null> {
    return this.db.first(this.sql, this.bindings) as T | null;
  }

  async all<T>(): Promise<{ results: T[] }> {
    return { results: this.db.all(this.sql, this.bindings) as T[] };
  }
}

class FakeD1Database {
  readonly usage = new Map<string, UsageRow>();
  readonly reservations = new Map<string, ReservationRow>();

  prepare(sql: string): FakeD1Statement {
    return new FakeD1Statement(this, sql);
  }

  async batch(statements: FakeD1Statement[]): Promise<Array<{ meta: { changes: number } }>> {
    const results = [];
    for (const statement of statements) {
      results.push(await statement.run());
    }
    return results;
  }

  run(sql: string, args: unknown[]): { meta: { changes: number } } {
    const q = normalizeSql(sql);
    if (
      q.startsWith("CREATE TABLE") ||
      q.startsWith("CREATE INDEX") ||
      q.startsWith("ALTER TABLE")
    ) {
      return { meta: { changes: 0 } };
    }

    if (q.startsWith("INSERT OR IGNORE INTO account_file_storage_usage")) {
      const userId = String(args[0]);
      if (!this.usage.has(userId)) {
        this.usage.set(userId, { user_id: userId, used_bytes: 0, updated_at: new Date().toISOString() });
        return { meta: { changes: 1 } };
      }
      return { meta: { changes: 0 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_usage") &&
      q.includes("used_bytes = used_bytes + ?") &&
      q.includes("used_bytes + ? <= ?")
    ) {
      const [bytesRaw, userIdRaw, checkBytesRaw, limitRaw] = args;
      const bytes = Number(bytesRaw);
      const userId = String(userIdRaw);
      const checkBytes = Number(checkBytesRaw);
      const limit = Number(limitRaw);
      const row = this.usage.get(userId);
      if (!row || row.used_bytes + checkBytes > limit) return { meta: { changes: 0 } };
      row.used_bytes += bytes;
      row.updated_at = new Date().toISOString();
      return { meta: { changes: 1 } };
    }

    if (q.startsWith("INSERT INTO account_file_storage_reservations")) {
      const [noteIdRaw, userIdRaw, encryptedSizeRaw] = args;
      const noteId = String(noteIdRaw);
      if (this.reservations.has(noteId)) throw new Error("SQLITE_CONSTRAINT UNIQUE");
      this.reservations.set(noteId, {
        note_id: noteId,
        user_id: String(userIdRaw),
        encrypted_size: Number(encryptedSizeRaw),
        total_chunks: null,
        max_reads: null,
        file_access_window_seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS,
        expires_at: null,
        last_checked_at: null,
        status: "reserved",
        created_at: new Date().toISOString(),
        activated_at: null,
        released_at: null,
        release_reason: null,
      });
      return { meta: { changes: 1 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_usage") &&
      q.includes("used_bytes = max(0, used_bytes + ?)")
    ) {
      const [deltaRaw, userIdRaw] = args;
      const row = this.usage.get(String(userIdRaw));
      if (!row) return { meta: { changes: 0 } };
      row.used_bytes = Math.max(0, row.used_bytes + Number(deltaRaw));
      row.updated_at = new Date().toISOString();
      return { meta: { changes: 1 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_usage") &&
      q.includes("used_bytes = max(0, used_bytes - ?)")
    ) {
      const [bytesRaw, userIdRaw] = args;
      const row = this.usage.get(String(userIdRaw));
      if (!row) return { meta: { changes: 0 } };
      row.used_bytes = Math.max(0, row.used_bytes - Number(bytesRaw));
      row.updated_at = new Date().toISOString();
      return { meta: { changes: 1 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_reservations") &&
      q.includes("file_access_window_seconds = ?")
    ) {
      const [encryptedSizeRaw, totalChunksRaw, maxReadsRaw, windowRaw, expiresAtRaw, noteIdRaw] = args;
      const row = this.reservations.get(String(noteIdRaw));
      if (!row || row.status === "released") return { meta: { changes: 0 } };
      row.encrypted_size = Number(encryptedSizeRaw);
      row.total_chunks = Number(totalChunksRaw);
      row.max_reads = Number(maxReadsRaw);
      row.file_access_window_seconds = Number(windowRaw);
      row.expires_at = expiresAtRaw == null ? null : String(expiresAtRaw);
      row.last_checked_at = null;
      row.status = "active";
      row.activated_at = new Date().toISOString();
      return { meta: { changes: 1 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_reservations") &&
      q.includes("status = 'released'")
    ) {
      const [reasonRaw, noteIdRaw] = args;
      const row = this.reservations.get(String(noteIdRaw));
      if (!row || row.status === "released") return { meta: { changes: 0 } };
      row.status = "released";
      row.released_at = new Date().toISOString();
      row.release_reason = String(reasonRaw);
      return { meta: { changes: 1 } };
    }

    if (
      q.startsWith("UPDATE account_file_storage_reservations") &&
      q.includes("last_checked_at = datetime('now')")
    ) {
      const noteId = String(args[0]);
      const row = this.reservations.get(noteId);
      if (!row || row.status !== "active") return { meta: { changes: 0 } };
      row.last_checked_at = new Date().toISOString();
      return { meta: { changes: 1 } };
    }

    if (q.startsWith("DELETE FROM account_file_storage_reservations")) {
      let changes = 0;
      for (const [noteId, row] of [...this.reservations]) {
        if (row.status === "released" && row.released_at && Date.parse(row.released_at) < Date.now() - 31 * 86400_000) {
          this.reservations.delete(noteId);
          changes += 1;
        }
      }
      return { meta: { changes } };
    }

    throw new Error(`Unhandled D1 run SQL: ${q}`);
  }

  first(sql: string, args: unknown[]): unknown | null {
    const q = normalizeSql(sql);
    if (q.startsWith("SELECT user_id, encrypted_size, status FROM account_file_storage_reservations")) {
      const row = this.reservations.get(String(args[0]));
      return row
        ? { user_id: row.user_id, encrypted_size: row.encrypted_size, status: row.status }
        : null;
    }
    if (q.startsWith("SELECT used_bytes FROM account_file_storage_usage")) {
      const row = this.usage.get(String(args[0]));
      return row ? { used_bytes: row.used_bytes } : null;
    }
    throw new Error(`Unhandled D1 first SQL: ${q}`);
  }

  all(sql: string, args: unknown[]): unknown[] {
    const q = normalizeSql(sql);
    if (q.startsWith("PRAGMA table_info(account_file_storage_reservations)")) {
      return [
        "note_id",
        "user_id",
        "encrypted_size",
        "total_chunks",
        "max_reads",
        "file_access_window_seconds",
        "expires_at",
        "last_checked_at",
        "status",
        "created_at",
        "activated_at",
        "released_at",
        "release_reason",
      ].map((name) => ({ name }));
    }

    if (
      q.startsWith("SELECT note_id FROM account_file_storage_reservations") &&
      q.includes("status = 'reserved'")
    ) {
      const userFilter = q.includes("WHERE user_id = ?") ? String(args[0]) : null;
      const cutoffSeconds = q.includes("'-2 hours'")
        ? 2 * 60 * 60
        : parseRelativeSeconds(String(userFilter ? args[1] : args[0]));
      return [...this.reservations.values()]
        .filter((row) => row.status === "reserved")
        .filter((row) => !userFilter || row.user_id === userFilter)
        .filter((row) => Date.parse(row.created_at) < Date.now() - cutoffSeconds * 1000)
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
        .slice(0, Number(args.at(-1) ?? 200))
        .map((row) => ({ note_id: row.note_id }));
    }

    if (q.startsWith("SELECT note_id, file_access_window_seconds FROM account_file_storage_reservations")) {
      const activationDelaySeconds = parseRelativeSeconds(String(args[0]));
      const recheckSeconds = parseRelativeSeconds(String(args[1]));
      return [...this.reservations.values()]
        .filter((row) => row.status === "active")
        .filter((row) => Date.parse(row.activated_at ?? row.created_at) + activationDelaySeconds * 1000 <= Date.now())
        .filter((row) => {
          if (!row.last_checked_at) return true;
          if (Date.parse(row.last_checked_at) < Date.now() - recheckSeconds * 1000) return true;
          return !!row.expires_at && Date.parse(row.expires_at) <= Date.now();
        })
        .sort((a, b) => Date.parse(a.activated_at ?? a.created_at) - Date.parse(b.activated_at ?? b.created_at))
        .slice(0, Number(args[2] ?? 200))
        .map((row) => ({
          note_id: row.note_id,
          file_access_window_seconds: row.file_access_window_seconds,
        }));
    }

    throw new Error(`Unhandled D1 all SQL: ${q}`);
  }
}

function normalizeSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

function parseRelativeSeconds(value: string): number {
  const match = value.match(/([+-])(\d+) seconds/);
  assert.ok(match, `Expected relative seconds modifier, got ${value}`);
  return Number(match[2]);
}

class FakeR2Bucket {
  readonly objects = new Map<string, { body: Uint8Array; customMetadata?: Record<string, string> }>();

  async put(
    key: string,
    body: ArrayBuffer | Uint8Array,
    options?: { customMetadata?: Record<string, string> },
  ): Promise<void> {
    const bytes = body instanceof Uint8Array ? body : new Uint8Array(body);
    this.objects.set(key, { body: bytes, customMetadata: options?.customMetadata });
  }

  async head(key: string): Promise<{ customMetadata?: Record<string, string> } | null> {
    const object = this.objects.get(key);
    return object ? { customMetadata: object.customMetadata } : null;
  }

  async get(key: string): Promise<{ body: ReadableStream; customMetadata?: Record<string, string> } | null> {
    const object = this.objects.get(key);
    if (!object) return null;
    return { body: new Response(object.body).body!, customMetadata: object.customMetadata };
  }

  async list({ prefix, cursor }: { prefix: string; cursor?: string }): Promise<{
    objects: Array<{ key: string }>;
    truncated: boolean;
    cursor?: string;
  }> {
    assert.equal(cursor, undefined);
    const keys = [...this.objects.keys()].filter((key) => key.startsWith(prefix)).sort();
    return {
      objects: keys.map((key) => ({ key })),
      truncated: false,
    };
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key);
  }
}

class FakeDurableNamespace {
  noteStatuses = new Map<string, number>();

  jurisdiction(): FakeDurableNamespace {
    return this;
  }

  idFromName(name: string): string {
    return name;
  }

  get(id: string): DurableObjectStub {
    return {
      fetch: async () => new Response("{}", { status: this.noteStatuses.get(String(id)) ?? 200 }),
    } as DurableObjectStub;
  }
}

function makeEnv(db = new FakeD1Database(), r2 = new FakeR2Bucket(), notes = new FakeDurableNamespace()): Env {
  return {
    AUTH_DB: db as unknown as D1Database,
    NOTE_FILES_R2: r2 as unknown as R2Bucket,
    SECURE_NOTES: notes as unknown as DurableObjectNamespace,
    NOTES_KV: {} as Env["NOTES_KV"],
  };
}

async function putChunks(r2: FakeR2Bucket, noteId: string, count: number): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await r2.put(`note-files/${noteId}/chunks/${index}`, new Uint8Array([index]), {
      customMetadata: { chunkEncryptedSize: "1" },
    });
  }
}

describe("note file storage accounting", () => {
  it("reserves free encrypted bytes against the 250 MB account cap", async () => {
    const db = new FakeD1Database();
    const env = makeEnv(db);
    const firstSize = NOTE_FILE_FREE_TOTAL_STORAGE_BYTES - 1;

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, firstSize, FREE_STORAGE_LIMIT),
      { ok: true },
    );

    const blocked = await reserveAccountFileStorageBytes(
      env,
      USER_ID,
      NOTE_ID_2,
      2,
      FREE_STORAGE_LIMIT,
    );
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.status, 413);
      assert.equal(blocked.body.limitBytes, FREE_STORAGE_LIMIT);
    }
  });

  it("reserves Premium encrypted bytes atomically and blocks over the 20 GB account cap", async () => {
    const db = new FakeD1Database();
    const env = makeEnv(db);
    const firstSize = NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES - 10;

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, firstSize, PREMIUM_STORAGE_LIMIT),
      { ok: true },
    );
    assert.equal(db.usage.get(USER_ID)?.used_bytes, firstSize);

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, firstSize, PREMIUM_STORAGE_LIMIT),
      { ok: true },
    );
    assert.equal(db.usage.get(USER_ID)?.used_bytes, firstSize);

    const blocked = await reserveAccountFileStorageBytes(
      env,
      USER_ID,
      NOTE_ID_2,
      11,
      PREMIUM_STORAGE_LIMIT,
    );
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.status, 413);
      assert.equal(blocked.body.error, "account_file_storage_quota_exceeded");
      assert.equal(blocked.body.usedBytes, firstSize);
    }
    assert.equal(db.usage.get(USER_ID)?.used_bytes, firstSize);
    assert.equal(db.reservations.has(NOTE_ID_2), false);
  });

  it("activates reservations with exact encrypted size and scheduled cleanup releases destroyed-note quota and R2 chunks", async () => {
    const db = new FakeD1Database();
    const r2 = new FakeR2Bucket();
    const notes = new FakeDurableNamespace();
    const env = makeEnv(db, r2, notes);
    notes.noteStatuses.set(NOTE_ID, 404);

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, 1_000, PREMIUM_STORAGE_LIMIT),
      { ok: true },
    );
    await activateAccountFileStorageReservation(
      env,
      NOTE_ID,
      900,
      3,
      1,
      NOTE_FILE_ACCESS_DEFAULT_SECONDS,
      isoSecondsAgo(3600),
    );
    await putChunks(r2, NOTE_ID, 3);
    db.reservations.get(NOTE_ID)!.activated_at = isoSecondsAgo(7200);

    assert.equal(db.usage.get(USER_ID)?.used_bytes, 900);
    const result = await cleanupExpiredNoteFileStorage(env);

    assert.equal(result.released, 1);
    assert.equal(db.usage.get(USER_ID)?.used_bytes, 0);
    assert.equal(db.reservations.get(NOTE_ID)?.status, "released");
    assert.equal(r2.objects.size, 0);
  });

  it("keeps active-note R2 chunks and marks the reservation checked", async () => {
    const db = new FakeD1Database();
    const r2 = new FakeR2Bucket();
    const notes = new FakeDurableNamespace();
    const env = makeEnv(db, r2, notes);
    notes.noteStatuses.set(NOTE_ID, 200);

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, 500, PREMIUM_STORAGE_LIMIT),
      { ok: true },
    );
    await activateAccountFileStorageReservation(
      env,
      NOTE_ID,
      500,
      1,
      5,
      NOTE_FILE_ACCESS_DEFAULT_SECONDS,
      new Date(Date.now() + 3600_000).toISOString(),
    );
    await putChunks(r2, NOTE_ID, 1);
    db.reservations.get(NOTE_ID)!.activated_at = isoSecondsAgo(7200);

    const result = await cleanupExpiredNoteFileStorage(env);

    assert.equal(result.checked, 1);
    assert.equal(result.released, 0);
    assert.equal(db.usage.get(USER_ID)?.used_bytes, 500);
    assert.equal(db.reservations.get(NOTE_ID)?.status, "active");
    assert.ok(db.reservations.get(NOTE_ID)?.last_checked_at);
    assert.equal(r2.objects.size, 1);
  });

  it("cleans abandoned reserved uploads and releases their quota", async () => {
    const db = new FakeD1Database();
    const r2 = new FakeR2Bucket();
    const env = makeEnv(db, r2);

    assert.deepEqual(
      await reserveAccountFileStorageBytes(env, USER_ID, NOTE_ID, 700, PREMIUM_STORAGE_LIMIT),
      { ok: true },
    );
    db.reservations.get(NOTE_ID)!.created_at = isoSecondsAgo(3 * 60 * 60);
    await putChunks(r2, NOTE_ID, 4);

    const result = await cleanupExpiredNoteFileStorage(env);

    assert.equal(result.abandoned, 1);
    assert.equal(db.usage.get(USER_ID)?.used_bytes, 0);
    assert.equal(db.reservations.get(NOTE_ID)?.status, "released");
    assert.equal(r2.objects.size, 0);
  });
});
