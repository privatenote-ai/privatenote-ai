import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DurableObjectState } from "@cloudflare/workers-types";
import { buildNoteAadBytes, encodeNoteAadBytesForWire } from "@shared/noteAad";
import { NOTE_AES_GCM_IV_BYTE_LENGTH } from "@shared/noteCryptoWire";
import {
  parseStoredNoteCiphertextForReveal,
  STORED_NOTE_CIPHER_ALG,
  STORED_NOTE_PAYLOAD_VERSION,
} from "@shared/storedNotePayload";
import { SecureNoteStorageSql } from "./secure_note_storage.ts";

const VALID_NOTE_ID = "00000000-0000-4000-8000-000000022222";
const BASE = "http://do.test";

const twelveZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_AES_GCM_IV_BYTE_LENGTH)));

const SQL = {
  createMeta:
    "CREATE TABLE IF NOT EXISTS notes_meta (" +
    "note_id TEXT PRIMARY KEY," +
    "expires_at TEXT NOT NULL," +
    "max_reads INTEGER NOT NULL," +
    "current_reads INTEGER NOT NULL," +
    "consumed INTEGER NOT NULL," +
    "opens_at TEXT" +
    ")",
  createCipher: "CREATE TABLE IF NOT EXISTS notes_cipher (" + "note_id TEXT PRIMARY KEY," + "payload TEXT NOT NULL" + ")",
  alterOpensAt: "ALTER TABLE notes_meta ADD COLUMN opens_at TEXT",
  deleteConsumedTombstones: "DELETE FROM notes_meta WHERE consumed = 1",
  selectMeta:
    "SELECT note_id, expires_at, max_reads, current_reads, consumed, opens_at FROM notes_meta WHERE note_id = ?",
  selectPayload: "SELECT payload FROM notes_cipher WHERE note_id = ?",
  insertCipher: "INSERT INTO notes_cipher (note_id, payload) VALUES (?, ?)",
  insertMeta:
    "INSERT INTO notes_meta (note_id, expires_at, max_reads, current_reads, consumed, opens_at) VALUES (?, ?, ?, ?, ?, ?)",
  updateReads: "UPDATE notes_meta SET current_reads = ?, consumed = 0 WHERE note_id = ?",
  deleteCipher: "DELETE FROM notes_cipher WHERE note_id = ?",
  deleteMeta: "DELETE FROM notes_meta WHERE note_id = ?",
} as const;

type MetaRow = {
  note_id: string;
  expires_at: string;
  max_reads: number;
  current_reads: number;
  consumed: number;
  opens_at: string | null;
};

/** Minimal in-memory stub for DO SQL used by {@link SecureNoteStorageSql}. */
function createMockStorage() {
  const cipher = new Map<string, string>();
  const meta = new Map<string, MetaRow>();

  function throwIfDuplicate<T>(m: Map<string, T>, key: string) {
    if (m.has(key)) {
      throw new Error("SQLITE_CONSTRAINT UNIQUE");
    }
  }

  const api = {
    cipher,
    meta,
    transactionSync<T>(fn: () => T): T {
      return fn();
    },
    sql: {
      exec(sql: string, ...args: unknown[]) {
        const q = sql.trim();
        if (q === SQL.createMeta || q === SQL.createCipher || q === SQL.alterOpensAt) {
          return { toArray: () => [] };
        }
        if (q === SQL.deleteConsumedTombstones) {
          for (const [id, row] of meta) {
            if (row.consumed) {
              meta.delete(id);
              cipher.delete(id);
            }
          }
          return { toArray: () => [] };
        }
        if (q === SQL.selectMeta) {
          const noteId = String(args[0]);
          const row = meta.get(noteId);
          return { toArray: () => (row ? [row] : []) };
        }
        if (q === SQL.selectPayload) {
          const noteId = String(args[0]);
          const payload = cipher.get(noteId);
          return { toArray: () => (payload !== undefined ? [{ payload }] : []) };
        }
        if (q === SQL.insertCipher) {
          const noteId = String(args[0]);
          const payload = String(args[1]);
          throwIfDuplicate(cipher, noteId);
          cipher.set(noteId, payload);
          return { toArray: () => [] };
        }
        if (q === SQL.insertMeta) {
          const [noteId, expires_at, max_reads, current_reads, consumed, opens_at] = args as [
            string,
            string,
            number,
            number,
            number,
            string | null,
          ];
          throwIfDuplicate(meta, noteId);
          meta.set(noteId, {
            note_id: noteId,
            expires_at,
            max_reads,
            current_reads,
            consumed,
            opens_at: opens_at ?? null,
          });
          return { toArray: () => [] };
        }
        if (q === SQL.updateReads) {
          const [newReads, noteId] = args as [number, string];
          const row = meta.get(noteId);
          if (row) {
            row.current_reads = newReads;
            row.consumed = 0;
          }
          return { toArray: () => [] };
        }
        if (q === SQL.deleteCipher) {
          cipher.delete(String(args[0]));
          return { toArray: () => [] };
        }
        if (q === SQL.deleteMeta) {
          meta.delete(String(args[0]));
          return { toArray: () => [] };
        }
        throw new Error(`Unhandled SQL in mock: ${q.slice(0, 80)}`);
      },
    },
  };
  return api;
}

function makeDurableState(storage: ReturnType<typeof createMockStorage>): DurableObjectState {
  return { storage } as unknown as DurableObjectState;
}

async function readJson(res: Response): Promise<unknown> {
  return res.json() as Promise<unknown>;
}

function createBody(over: Record<string, unknown> = {}): Record<string, unknown> {
  const expirySeconds = 86400;
  const maxReads = 1;
  const aad = encodeNoteAadBytesForWire(
    buildNoteAadBytes({ noteId: VALID_NOTE_ID, expirySeconds, maxReads }),
  );
  return {
    content: btoa("cipher-bytes"),
    iv: twelveZeroB64,
    expirySeconds,
    maxReads,
    aad,
    isPasswordProtected: false,
    ...over,
  };
}

function validStoredPayloadJson(aad: string): string {
  return JSON.stringify({
    v: STORED_NOTE_PAYLOAD_VERSION,
    alg: STORED_NOTE_CIPHER_ALG,
    content: btoa("x"),
    iv: twelveZeroB64,
    aad,
    isPasswordProtected: false,
  });
}

describe("SecureNoteStorageSql (mock SQLite)", () => {
  it("create → meta GET → reveal → second reveal 404 (single-use)", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));

    let res = await dox.fetch(
      new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody()),
      }),
    );
    assert.equal(res.status, 201);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 200);
    const meta = (await readJson(res)) as { readCount: number; maxReads: number };
    assert.equal(meta.readCount, 0);
    assert.equal(meta.maxReads, 1);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 200);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 404);

    assert.equal(store.meta.size, 0);
    assert.equal(store.cipher.size, 0);
  });

  it("stores readerLanguage metadata and returns it on meta GET and reveal", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));

    let res = await dox.fetch(
      new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody({ readerLanguage: "fr" })),
      }),
    );
    assert.equal(res.status, 201);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 200);
    const meta = (await readJson(res)) as { readerLanguage?: string };
    assert.equal(meta.readerLanguage, "fr");

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 200);
    const reveal = (await readJson(res)) as { readerLanguage?: string };
    assert.equal(reveal.readerLanguage, "fr");
  });

  it("stores bodyFont metadata and returns it on meta GET and reveal", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));

    let res = await dox.fetch(
      new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody({ bodyFont: "source-serif" })),
      }),
    );
    assert.equal(res.status, 201);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 200);
    const meta = (await readJson(res)) as { bodyFont?: string };
    assert.equal(meta.bodyFont, "source-serif");

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 200);
    const reveal = (await readJson(res)) as { bodyFont?: string };
    assert.equal(reveal.bodyFont, "source-serif");
  });

  it("stores attachmentPermission metadata and returns it on meta GET and reveal", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));

    let res = await dox.fetch(
      new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody({ attachmentPermission: "view-only" })),
      }),
    );
    assert.equal(res.status, 201);

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 200);
    const meta = (await readJson(res)) as { attachmentPermission?: string };
    assert.equal(meta.attachmentPermission, "view-only");

    res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 200);
    const reveal = (await readJson(res)) as { attachmentPermission?: string };
    assert.equal(reveal.attachmentPermission, "view-only");
  });

  it("max_reads 0 allows multiple reveals until expiry", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const body = createBody({ maxReads: 0 });
    body.aad = encodeNoteAadBytesForWire(
      buildNoteAadBytes({ noteId: VALID_NOTE_ID, expirySeconds: 86400, maxReads: 0 }),
    );

    let res = await dox.fetch(
      new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
    assert.equal(res.status, 201);

    for (let i = 0; i < 3; i++) {
      res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
      assert.equal(res.status, 200);
      const j = (await readJson(res)) as { readCount: number };
      assert.equal(j.readCount, i + 1);
    }
    assert.ok(store.meta.size > 0);
  });

  it("double create same id → 409", async () => {
    const store = createMockStorage();
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const req = () =>
      dox.fetch(
        new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createBody()),
        }),
      );
    assert.equal((await req()).status, 201);
    assert.equal((await req()).status, 409);
  });

  it("legacy consumed=1 tombstone is removed on wake and meta returns 404", async () => {
    const store = createMockStorage();
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2035-01-01T00:00:00.000Z",
      max_reads: 1,
      current_reads: 0,
      consumed: 1,
    });
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.has(VALID_NOTE_ID), false);
  });

  it("GET meta when read cap already reached purges rows (exhausted → terminal consume)", async () => {
    const store = createMockStorage();
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2035-01-01T00:00:00.000Z",
      max_reads: 2,
      current_reads: 2,
      consumed: 0,
    });
    store.cipher.set(VALID_NOTE_ID, validStoredPayloadJson("eyJleHAiOjEsImlkIjoibiIsInJlYWRzIjoxfQ"));
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.size, 0);
    assert.equal(store.cipher.size, 0);
  });

  it("reveal when read cap already reached returns 404 and purges", async () => {
    const store = createMockStorage();
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2035-01-01T00:00:00.000Z",
      max_reads: 1,
      current_reads: 1,
      consumed: 0,
    });
    store.cipher.set(VALID_NOTE_ID, validStoredPayloadJson("eyJleHAiOjEsImlkIjoibiIsInJlYWRzIjoxfQ"));
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.size, 0);
    assert.equal(store.cipher.size, 0);
  });

  it("GET meta on expired note purges rows (terminal consume)", async () => {
    const store = createMockStorage();
    const aad = encodeNoteAadBytesForWire(
      buildNoteAadBytes({ noteId: VALID_NOTE_ID, expirySeconds: 86400, maxReads: 1 }),
    );
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2000-01-01T00:00:00.000Z",
      max_reads: 1,
      current_reads: 0,
      consumed: 0,
    });
    store.cipher.set(VALID_NOTE_ID, validStoredPayloadJson(aad));
    const dox = new SecureNoteStorageSql(makeDurableState(store));

    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}`, { method: "GET" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.size, 0);
    assert.equal(store.cipher.size, 0);
  });

  it("reveal with eligible meta but missing ciphertext purges and returns 404", async () => {
    const store = createMockStorage();
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2035-01-01T00:00:00.000Z",
      max_reads: 1,
      current_reads: 0,
      consumed: 0,
    });
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.size, 0);
  });

  it("reveal with unparsable ciphertext purges and returns 404", async () => {
    const store = createMockStorage();
    store.meta.set(VALID_NOTE_ID, {
      note_id: VALID_NOTE_ID,
      expires_at: "2035-01-01T00:00:00.000Z",
      max_reads: 1,
      current_reads: 0,
      consumed: 0,
    });
    store.cipher.set(VALID_NOTE_ID, "{not-valid-json");
    const dox = new SecureNoteStorageSql(makeDurableState(store));
    const res = await dox.fetch(new Request(`${BASE}/api/notes/${VALID_NOTE_ID}/reveal`, { method: "POST" }));
    assert.equal(res.status, 404);
    assert.equal(store.meta.size, 0);
    assert.equal(store.cipher.size, 0);
  });

  it("stored payload round-trips through parser used at reveal (sanity)", () => {
    const aad = encodeNoteAadBytesForWire(
      buildNoteAadBytes({ noteId: VALID_NOTE_ID, expirySeconds: 86400, maxReads: 1 }),
    );
    const raw = validStoredPayloadJson(aad);
    const parsed = parseStoredNoteCiphertextForReveal(raw);
    assert.ok(parsed);
    assert.equal(parsed!.aad, aad.trim());
  });
});
