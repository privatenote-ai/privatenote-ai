import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCliArgv } from "./cliOptions.ts";

describe("parseCliArgv", () => {
  it("returns help when --help is passed", () => {
    assert.deepEqual(parseCliArgv(["--help"]), { kind: "help" });
    assert.deepEqual(parseCliArgv(["-h"]), { kind: "help" });
  });

  it("defaults expire to 24h and burn to true", () => {
    const out = parseCliArgv([]);
    assert.equal(out.kind, "run");
    if (out.kind !== "run") return;
    assert.equal(out.expiresIn, "24h");
    assert.equal(out.burnAfterReading, true);
    assert.equal(out.jsonOutput, false);
  });

  it("parses expire, title, and no-burn", () => {
    const out = parseCliArgv(["--expire", "1h", "--title", "deploy key", "--no-burn", "secret.txt"]);
    assert.equal(out.kind, "run");
    if (out.kind !== "run") return;
    assert.equal(out.expiresIn, "1h");
    assert.equal(out.title, "deploy key");
    assert.equal(out.burnAfterReading, false);
    assert.equal(out.fileArg, "secret.txt");
  });

  it("rejects invalid expire values", () => {
    assert.throws(() => parseCliArgv(["--expire", "2h"]), /Invalid --expire/);
  });

  it("rejects --output-url-only with --json", () => {
    assert.throws(() => parseCliArgv(["--json", "--output-url-only"]), /cannot be used with --json/);
  });

  it("reads api and web origins from env", () => {
    const out = parseCliArgv([], {
      PRIVATENOTE_API_BASE_URL: "https://notes.example.com",
      PRIVATENOTE_WEB_ORIGIN: "https://notes.example.com",
    });
    assert.equal(out.kind, "run");
    if (out.kind !== "run") return;
    assert.equal(out.endpoints.apiBaseUrl, "https://notes.example.com");
    assert.equal(out.endpoints.webOrigin, "https://notes.example.com");
  });

  it("rejects http api without --insecure", () => {
    assert.throws(
      () => parseCliArgv(["--api-base-url", "http://localhost:8787"]),
      /must use HTTPS/,
    );
  });

  it("applies hostname allowlist from env", () => {
    assert.throws(
      () =>
        parseCliArgv(["--api-base-url", "https://evil.example"], {
          PRIVATENOTE_ALLOWED_HOSTS: "privatenote.ai",
        }),
      /not allowed/,
    );
  });
});
