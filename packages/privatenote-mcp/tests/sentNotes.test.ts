import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let fetchCalls: Array<{ url: string; method: string }> = [];
let globalFetchOriginal: typeof globalThis.fetch | undefined;

function mockFetch() {
  fetchCalls = [];
  globalFetchOriginal = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    fetchCalls.push({ url, method: init?.method ?? "GET" });
    if (url.includes("/api/auth/account/notifications")) {
      return new Response(
        JSON.stringify({
          ok: true,
          notifications: [
            {
              noteId: "00000000-0000-0000-0000-000000000099",
              status: "created",
              createdAt: "2026-09-10T00:00:00.000Z",
              openedAt: null,
              revokedAt: null,
              expiresAt: "2026-09-11T00:00:00.000Z",
              label: null,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.includes("/revoke")) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not found", { status: 404 });
  };
}

function restoreFetch() {
  if (globalFetchOriginal) globalThis.fetch = globalFetchOriginal;
}

describe("sent notes tools", () => {
  const previousSessionPath = process.env["PRIVATENOTE_MCP_SESSION_PATH"];
  let dir: string;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "pn-mcp-sent-"));
    process.env["PRIVATENOTE_MCP_SESSION_PATH"] = join(dir, "mcp-session.json");
    delete process.env["PRIVATENOTE_SESSION"];
    await writeFile(
      process.env["PRIVATENOTE_MCP_SESSION_PATH"],
      JSON.stringify({
        accessToken: "plugin-session-token-value",
        apiBaseUrl: "https://privatenote.ai",
        storedAt: new Date().toISOString(),
      }),
      "utf8",
    );
    mockFetch();
  });

  after(async () => {
    restoreFetch();
    if (previousSessionPath === undefined) delete process.env["PRIVATENOTE_MCP_SESSION_PATH"];
    else process.env["PRIVATENOTE_MCP_SESSION_PATH"] = previousSessionPath;
    await rm(dir, { recursive: true, force: true });
  });

  it("lists sent notes with Bearer session", async () => {
    const { handleListSentNotes } = await import("../src/tools/sentNotes.ts");
    const result = await handleListSentNotes({ limit: 10 });
    const payload = JSON.parse(result.content[0]!.text as string) as {
      notes: Array<{ noteId: string }>;
    };
    assert.equal(payload.notes[0]?.noteId, "00000000-0000-0000-0000-000000000099");
    assert.ok(fetchCalls.some((call) => call.url.includes("/api/auth/account/notifications")));
  });

  it("revokes an unopened note by id", async () => {
    const { handleRevokeSentNote } = await import("../src/tools/sentNotes.ts");
    const result = await handleRevokeSentNote({
      noteId: "00000000-0000-0000-0000-000000000099",
    });
    const payload = JSON.parse(result.content[0]!.text as string) as { revoked: boolean };
    assert.equal(payload.revoked, true);
    assert.ok(fetchCalls.some((call) => call.url.includes("/revoke") && call.method === "POST"));
  });
});
