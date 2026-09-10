/**
 * Unit tests for the create_private_note MCP tool.
 * Run with: tsx --test tests/createPrivateNote.test.ts
 *
 * These tests mock `fetch` so no network connection is needed.
 * Key assertion: the HTTP body sent to the API NEVER contains plaintext.
 */
import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ── Test helpers ─────────────────────────────────────────────────────────────

const TEST_NOTE_ID = "00000000-0000-0000-0000-000000000001";
const SECRET = "sk_test_super_secret_value_42";

type RequestBody = Record<string, unknown>;

interface MockFetchCall {
  url: string;
  body: RequestBody | null;
  authorization?: string | null;
}

let fetchCalls: MockFetchCall[] = [];
let globalFetchOriginal: typeof globalThis.fetch | undefined;

function mockFetch() {
  fetchCalls = [];
  globalFetchOriginal = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    let parsed: RequestBody | null = null;
    if (init?.body && typeof init.body === "string") {
      parsed = JSON.parse(init.body) as RequestBody;
    }
    const rawHeaders = init?.headers;
    let authorization: string | null = null;
    if (rawHeaders instanceof Headers) {
      authorization = rawHeaders.get("Authorization");
    } else if (rawHeaders && typeof rawHeaders === "object") {
      authorization = (rawHeaders as Record<string, string>)["Authorization"] ?? null;
    }
    fetchCalls.push({ url, body: parsed, authorization });

    if (url.includes("/api/notes/reserve")) {
      return new Response(JSON.stringify({ id: TEST_NOTE_ID, uploadToken: "upload-token-test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/file")) {
      return new Response("", { status: 200 });
    }

    if (url.includes("/api/notes")) {
      return new Response(JSON.stringify({ id: TEST_NOTE_ID }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  };
}

function restoreFetch() {
  if (globalFetchOriginal) globalThis.fetch = globalFetchOriginal;
}

const { createPrivateNote, mcpExpiresInToExpirySeconds, isMcpExpiresIn } = await import(
  "../src/createNote.ts"
);

// ── Expiry mapping ─────────────────────────────────────────────────────────

describe("mcpExpiresInToExpirySeconds", () => {
  it("maps 5m to 300 seconds", () => {
    assert.equal(mcpExpiresInToExpirySeconds("5m"), 300);
  });

  it("maps 15m to 900 seconds", () => {
    assert.equal(mcpExpiresInToExpirySeconds("15m"), 900);
  });

  it("maps 1h to 3600 seconds", () => {
    assert.equal(mcpExpiresInToExpirySeconds("1h"), 3600);
  });

  it("maps 24h to 86400 seconds (1d preset)", () => {
    assert.equal(mcpExpiresInToExpirySeconds("24h"), 86400);
  });

  it("maps 30d to 2592000 seconds", () => {
    assert.equal(mcpExpiresInToExpirySeconds("30d"), 2_592_000);
  });
});

describe("isMcpExpiresIn", () => {
  it("accepts valid values", () => {
    assert.ok(isMcpExpiresIn("5m"));
    assert.ok(isMcpExpiresIn("15m"));
    assert.ok(isMcpExpiresIn("1h"));
    assert.ok(isMcpExpiresIn("2h"));
    assert.ok(isMcpExpiresIn("24h"));
    assert.ok(isMcpExpiresIn("1d"));
    assert.ok(isMcpExpiresIn("7d"));
    assert.ok(isMcpExpiresIn("30d"));
  });

  it("rejects invalid values", () => {
    assert.ok(!isMcpExpiresIn("2min"));
    assert.ok(!isMcpExpiresIn(""));
  });
});

// ── Validation (no network) ────────────────────────────────────────────────

describe("createPrivateNote validation", () => {
  it("rejects empty content", async () => {
    await assert.rejects(
      () => createPrivateNote({ content: "   " }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.match(err.message, /required/i);
        return true;
      },
    );
  });

  it("rejects content that exceeds 50 KiB", async () => {
    const big = "x".repeat(51 * 1024);
    await assert.rejects(
      () => createPrivateNote({ content: big }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.match(err.message, /too large/i);
        return true;
      },
    );
  });

  it("error messages do not contain the secret input", async () => {
    const longSecret = `secret_${SECRET}`;
    await assert.rejects(
      () => createPrivateNote({ content: "   " }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(!err.message.includes(longSecret));
        return true;
      },
    );
  });
});

// ── Encrypt path ─────────────────────────────────────────────────────────

describe("createPrivateNote encrypt path (default options)", () => {
  let result: Awaited<ReturnType<typeof createPrivateNote>>;

  before(async () => {
    mockFetch();
    result = await createPrivateNote({ content: SECRET });
  });

  after(restoreFetch);

  it("returns a URL matching /note/{uuid}#{43-char fragment}", () => {
    assert.match(result.secureUrl, /\/note\/[0-9a-f-]{36}#[A-Za-z0-9_-]{43}$/);
  });

  it("URL fragment is exactly 43 characters", () => {
    const fragment = result.secureUrl.split("#")[1]!;
    assert.equal(fragment.length, 43);
  });

  it("burnAfterReading defaults to true", () => {
    assert.equal(result.burnAfterReading, true);
  });

  it("expiresAt is a valid ISO date string in the future", () => {
    const dt = new Date(result.expiresAt).getTime();
    assert.ok(dt > Date.now(), "expiresAt is in the future");
  });

  it("sends exactly two requests (reserve + create)", () => {
    assert.equal(fetchCalls.length, 2);
    assert.match(fetchCalls[0]!.url, /\/api\/notes\/reserve/);
    assert.match(fetchCalls[1]!.url, /\/api\/notes/);
  });

  it("API body contains base64 ciphertext fields", () => {
    const body = fetchCalls[1]!.body!;
    assert.ok(typeof body["content"] === "string", "content field present");
    assert.ok(typeof body["iv"] === "string", "iv field present");
    assert.ok(typeof body["aad"] === "string", "aad field present");
  });

  it("API body does not contain plaintext secret", () => {
    const serialized = JSON.stringify(fetchCalls[1]!.body!);
    assert.ok(!serialized.includes(SECRET), "plaintext not in API body");
  });

  it("API body has the correct note id from reservation", () => {
    assert.equal(fetchCalls[1]!.body!["id"], TEST_NOTE_ID);
  });

  it("API body has isPasswordProtected: false", () => {
    assert.equal(fetchCalls[1]!.body!["isPasswordProtected"], false);
  });

  it("API body has maxReads: 1 for burn-after-reading", () => {
    assert.equal(fetchCalls[1]!.body!["maxReads"], 1);
  });
});

describe("createPrivateNote expiry mapping in API body", () => {
  before(mockFetch);
  after(restoreFetch);

  it("sends correct expirySeconds for 15m", async () => {
    await createPrivateNote({ content: SECRET, expiresIn: "15m" });
    assert.equal(fetchCalls[1]!.body!["expirySeconds"], 900);
  });
});

describe("createPrivateNote burnAfterReading=false", () => {
  before(mockFetch);
  after(restoreFetch);

  it("sends maxReads: 2 when burnAfterReading is false", async () => {
    const res = await createPrivateNote({ content: SECRET, burnAfterReading: false });
    assert.equal(fetchCalls[1]!.body!["maxReads"], 2);
    assert.equal(res.burnAfterReading, false);
  });
});

describe("createPrivateNote title prepend", () => {
  before(mockFetch);
  after(restoreFetch);

  it("title is absorbed into encryption — not sent as a separate field", async () => {
    await createPrivateNote({ content: SECRET, title: "My Secret" });
    const body = fetchCalls[1]!.body!;
    const serialized = JSON.stringify(body);
    assert.ok(!("title" in body), "no title field in API body");
    assert.ok(!serialized.includes(SECRET), "content not in API body plaintext");
  });
});

describe("createPrivateNote file attach", () => {
  it("requires a stored session before reading the file", async () => {
    const previousSessionPath = process.env["PRIVATENOTE_MCP_SESSION_PATH"];
    const previousToken = process.env["PRIVATENOTE_SESSION"];
    process.env["PRIVATENOTE_MCP_SESSION_PATH"] = join(tmpdir(), "pn-mcp-no-session.json");
    delete process.env["PRIVATENOTE_SESSION"];
    try {
      await assert.rejects(
        () => createPrivateNote({ filePath: "/tmp/does-not-matter.bin" }),
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.match(err.message, /sign_in/i);
          return true;
        },
      );
    } finally {
      if (previousSessionPath === undefined) delete process.env["PRIVATENOTE_MCP_SESSION_PATH"];
      else process.env["PRIVATENOTE_MCP_SESSION_PATH"] = previousSessionPath;
      if (previousToken === undefined) delete process.env["PRIVATENOTE_SESSION"];
      else process.env["PRIVATENOTE_SESSION"] = previousToken;
    }
  });

  it("encrypts a local file and uploads ciphertext with the note upload token", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-file-"));
    const filePath = join(dir, "secret.txt");
    const sessionPath = join(dir, "mcp-session.json");
    await writeFile(filePath, "file-secret-xyz", "utf8");
    await writeFile(
      sessionPath,
      JSON.stringify({
        accessToken: "plugin-session-token-value",
        apiBaseUrl: "https://privatenote.ai",
        storedAt: new Date().toISOString(),
      }),
      "utf8",
    );
    const previousSessionPath = process.env["PRIVATENOTE_MCP_SESSION_PATH"];
    const previousToken = process.env["PRIVATENOTE_SESSION"];
    process.env["PRIVATENOTE_MCP_SESSION_PATH"] = sessionPath;
    delete process.env["PRIVATENOTE_SESSION"];
    mockFetch();
    try {
      const result = await createPrivateNote({ content: SECRET, filePath });
      assert.match(result.secureUrl, /\/note\/[0-9a-f-]{36}#/);
      assert.equal(result.attachedFileName, "secret.txt");
      const createCall = fetchCalls.find(
        (call) => call.body && typeof call.body["content"] === "string" && call.body["id"] === TEST_NOTE_ID,
      );
      assert.ok(createCall?.body);
      const serialized = JSON.stringify(createCall.body);
      assert.ok(!serialized.includes("file-secret-xyz"));
      assert.ok(!serialized.includes(SECRET));
      assert.equal(createCall.body["keyDerivation"], "hkdf-root-v2");
      assert.ok(Array.isArray(createCall.body["attachments"]));
      assert.equal(typeof createCall.body["attachmentContentHash"], "string");
      assert.ok(Array.isArray(createCall.body["attachmentContentHashes"]));
      const filePut = fetchCalls.find((call) => call.url.includes("/file"));
      assert.match(filePut?.authorization ?? "", /^Bearer /);
    } finally {
      restoreFetch();
      if (previousSessionPath === undefined) delete process.env["PRIVATENOTE_MCP_SESSION_PATH"];
      else process.env["PRIVATENOTE_MCP_SESSION_PATH"] = previousSessionPath;
      if (previousToken === undefined) delete process.env["PRIVATENOTE_SESSION"];
      else process.env["PRIVATENOTE_SESSION"] = previousToken;
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("reads note body from contentFilePath without sending plaintext", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-content-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    mockFetch();
    try {
      const result = await createPrivateNote({ contentFilePath: contentPath });
      assert.match(result.secureUrl, /\/note\/[0-9a-f-]{36}#/);
      const createCall = fetchCalls.find(
        (call) => call.body && typeof call.body["content"] === "string",
      );
      assert.ok(createCall?.body);
      assert.ok(!JSON.stringify(createCall.body).includes(SECRET));
    } finally {
      restoreFetch();
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("uploads multiple filePaths to namespaced attachment URLs", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-files-"));
    const a = join(dir, "a.txt");
    const b = join(dir, "b.txt");
    const sessionPath = join(dir, "mcp-session.json");
    await writeFile(a, "file-a-secret", "utf8");
    await writeFile(b, "file-b-secret", "utf8");
    await writeFile(
      sessionPath,
      JSON.stringify({
        accessToken: "plugin-session-token-value",
        apiBaseUrl: "https://privatenote.ai",
        storedAt: new Date().toISOString(),
      }),
      "utf8",
    );
    const previousSessionPath = process.env["PRIVATENOTE_MCP_SESSION_PATH"];
    const previousToken = process.env["PRIVATENOTE_SESSION"];
    process.env["PRIVATENOTE_MCP_SESSION_PATH"] = sessionPath;
    delete process.env["PRIVATENOTE_SESSION"];
    mockFetch();
    try {
      const result = await createPrivateNote({ filePaths: [a, b] });
      assert.deepEqual(result.attachedFileNames, ["a.txt", "b.txt"]);
      const reserve = fetchCalls.find((call) => call.url.includes("/api/notes/reserve"));
      assert.equal((reserve?.body?.["attachments"] as unknown[] | undefined)?.length, 2);
      assert.ok(fetchCalls.some((call) => call.url.endsWith("/file")));
      assert.ok(fetchCalls.some((call) => call.url.includes("/attachments/1/file")));
      const createCall = fetchCalls.find(
        (call) => call.body && typeof call.body["content"] === "string" && Array.isArray(call.body["attachments"]),
      );
      assert.equal((createCall?.body?.["attachments"] as unknown[]).length, 2);
      assert.equal((createCall?.body?.["attachmentContentHashes"] as unknown[]).length, 2);
      assert.ok(!JSON.stringify(createCall?.body).includes("file-a-secret"));
    } finally {
      restoreFetch();
      if (previousSessionPath === undefined) delete process.env["PRIVATENOTE_MCP_SESSION_PATH"];
      else process.env["PRIVATENOTE_MCP_SESSION_PATH"] = previousSessionPath;
      if (previousToken === undefined) delete process.env["PRIVATENOTE_SESSION"];
      else process.env["PRIVATENOTE_SESSION"] = previousToken;
      await rm(dir, { recursive: true, force: true });
    }
  });
});
