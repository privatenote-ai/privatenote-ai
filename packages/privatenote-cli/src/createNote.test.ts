import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_NOTE_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import {
  assertPlaintextWithinLimit,
  buildNotePlaintext,
  expiresInToSeconds,
  isExpiresIn,
} from "./createNote.ts";

describe("isExpiresIn", () => {
  it("accepts supported CLI expiry tokens", () => {
    for (const value of ["15m", "1h", "24h", "7d"] as const) {
      assert.equal(isExpiresIn(value), true);
    }
  });

  it("rejects unknown tokens", () => {
    assert.equal(isExpiresIn("2h"), false);
    assert.equal(isExpiresIn(""), false);
  });
});

describe("expiresInToSeconds", () => {
  it("maps CLI tokens to canonical preset seconds", () => {
    assert.equal(expiresInToSeconds("15m"), 15 * 60);
    assert.equal(expiresInToSeconds("1h"), 60 * 60);
    assert.equal(expiresInToSeconds("24h"), 24 * 60 * 60);
    assert.equal(expiresInToSeconds("7d"), 7 * 24 * 60 * 60);
  });
});

describe("buildNotePlaintext", () => {
  it("prepends title with a blank line separator", () => {
    assert.equal(buildNotePlaintext("body", "Title"), "Title\n\nbody");
  });

  it("returns content unchanged when title is omitted", () => {
    assert.equal(buildNotePlaintext("body"), "body");
  });
});

describe("assertPlaintextWithinLimit", () => {
  it("accepts plaintext within the limit", () => {
    assert.doesNotThrow(() => assertPlaintextWithinLimit("x".repeat(100)));
  });

  it("rejects title plus content that exceeds the limit", () => {
    const title = "x".repeat(30 * 1024);
    const content = "x".repeat(21 * 1024);
    const plaintext = buildNotePlaintext(content, title);
    assert.ok(Buffer.byteLength(plaintext, "utf8") > MAX_NOTE_PLAINTEXT_UTF8_BYTES);
    assert.throws(() => assertPlaintextWithinLimit(plaintext), /too large/);
  });
});
