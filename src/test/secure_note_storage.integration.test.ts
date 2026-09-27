import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { buildNoteAadBytes, encodeNoteAadBytesForWire } from "@shared/noteAad";
import { NOTE_AES_GCM_IV_BYTE_LENGTH } from "@shared/noteCryptoWire";

const BASE = "http://do.integration.test";
/** Valid UUID v4 for `isValidNoteId` / DO routing. */
const NOTE_ID = "aaaaaaaa-bbbb-4ccc-a811-aaaaaaaaaaaa";

const twelveZeroB64 = btoa(String.fromCharCode(...new Uint8Array(NOTE_AES_GCM_IV_BYTE_LENGTH)));

function noteStub() {
  const id = env.SECURE_NOTES.idFromName(NOTE_ID);
  return env.SECURE_NOTES.get(id);
}

function createBody(expirySeconds: number, maxReads: number): Record<string, unknown> {
  const aad = encodeNoteAadBytesForWire(buildNoteAadBytes({ noteId: NOTE_ID, expirySeconds, maxReads }));
  return {
    content: btoa("cipher-bytes"),
    iv: twelveZeroB64,
    expirySeconds,
    maxReads,
    aad,
    isPasswordProtected: false,
  };
}

describe("SecureNoteStorageSql (workerd / real SQLite DO)", () => {
  it("concurrent reveals: exactly one 200 and rest 404 for single-read note", async () => {
    const stub = noteStub();
    const post = await stub.fetch(
      new Request(`${BASE}/api/notes/${NOTE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createBody(86_400, 1)),
      }),
    );
    expect(post.status).toBe(201);

    const n = 12;
    const results = await Promise.all(
      Array.from({ length: n }, () =>
        stub.fetch(new Request(`${BASE}/api/notes/${NOTE_ID}/reveal`, { method: "POST" })),
      ),
    );
    const statuses = results.map((r) => r.status);
    expect(statuses.filter((s) => s === 200).length).toBe(1);
    expect(statuses.filter((s) => s === 404).length).toBe(n - 1);
  });

  it("pairwise concurrent reveal: [200, 404] in some order", async () => {
    const stub = noteStub();
    await expect(
      stub.fetch(
        new Request(`${BASE}/api/notes/${NOTE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createBody(86_400, 1)),
        }),
      ).then((r) => r.status),
    ).resolves.toBe(201);

    const [a, b] = await Promise.all([
      stub.fetch(new Request(`${BASE}/api/notes/${NOTE_ID}/reveal`, { method: "POST" })),
      stub.fetch(new Request(`${BASE}/api/notes/${NOTE_ID}/reveal`, { method: "POST" })),
    ]);
    const sorted = [a.status, b.status].sort((x, y) => x - y);
    expect(sorted).toEqual([200, 404]);
  });
});
