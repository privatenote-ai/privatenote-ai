import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let fetchCalls: Array<{ url: string; body: Record<string, unknown> | null }> = [];
let globalFetchOriginal: typeof globalThis.fetch | undefined;

function mockFetch() {
  fetchCalls = [];
  globalFetchOriginal = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    let parsed: Record<string, unknown> | null = null;
    if (init?.body && typeof init.body === "string") {
      parsed = JSON.parse(init.body) as Record<string, unknown>;
    }
    fetchCalls.push({ url, body: parsed });

    if (url.includes("/api/auth/device/start")) {
      return new Response(
        JSON.stringify({
          deviceCode: "device-code-test-value-32charsxx",
          userCode: "ABCD-2345",
          verificationUriComplete: "https://privatenote.ai/auth/device?user_code=ABCD-2345&client=mcp",
          expiresIn: 600,
          interval: 0,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.includes("/api/auth/device/poll")) {
      return new Response(
        JSON.stringify({ status: "authorized", accessToken: "plugin-session-token-value" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.includes("/api/auth/me")) {
      return new Response(
        JSON.stringify({ email: "user@example.com", accountType: "free" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response("Not found", { status: 404 });
  };
}

function restoreFetch() {
  if (globalFetchOriginal) globalThis.fetch = globalFetchOriginal;
}

describe("handleSignIn", () => {
  const previousSessionPath = process.env["PRIVATENOTE_MCP_SESSION_PATH"];
  let dir: string;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "pn-mcp-signin-"));
    process.env["PRIVATENOTE_MCP_SESSION_PATH"] = join(dir, "mcp-session.json");
    delete process.env["PRIVATENOTE_SESSION"];
    mockFetch();
  });

  after(async () => {
    restoreFetch();
    if (previousSessionPath === undefined) delete process.env["PRIVATENOTE_MCP_SESSION_PATH"];
    else process.env["PRIVATENOTE_MCP_SESSION_PATH"] = previousSessionPath;
    await rm(dir, { recursive: true, force: true });
  });

  it("stores a Bearer plugin token after device approval", async () => {
    const { handleSignIn } = await import("../src/tools/signIn.ts");
    const result = await handleSignIn({});
    assert.equal(result.isError, undefined);
    const payload = JSON.parse(result.content[0]!.text as string) as { status: string; email: string };
    assert.equal(payload.status, "signed_in");
    assert.equal(payload.email, "user@example.com");
    assert.ok(fetchCalls.some((call) => call.url.includes("/api/auth/device/start")));
    assert.equal(fetchCalls[0]!.body?.["client"], "mcp");
    const { readStoredSession } = await import("../src/sessionStore.ts");
    const stored = await readStoredSession();
    assert.equal(stored?.accessToken, "plugin-session-token-value");
  });
});
